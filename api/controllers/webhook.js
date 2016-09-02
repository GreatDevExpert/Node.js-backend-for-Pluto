import { Bank, Transaction, Account } from '../models'
import plaid from 'plaid';
import P from 'bluebird';

let env = process.env.NODE_ENV || 'development';
let config = require('__dirname + /../../config/config')[env];

P.promisifyAll(plaid);
let plaidClient = new plaid.Client(config.plaid_client_id, config.plaid_client_secret, config.plaid_env);

async function handleWebhook(req, res, next) {

    const {message, access_token, total_transactions, code, removed_transactions, resolve} = req.body;

    console.log("webhook called!!!" + JSON.stringify(req.body));

    switch (parseInt(code)) {
        case 0: {
            console.log("DownloadInitData \n\n");
            // Initial transaction pull finished
            downloadInitialData(req.body);
        }
            break;
        case 1: {
            console.log("DownloadInitData \n\n");
            // Historical transaction pull finished
            downloadInitialData(req.body);
        }
            break;
        case 2: {
            console.log("DownloadLatestData \n\n");
            // Normal transaction pull finished
            downloadLatestData(req.body);
        }
            break;
        case 3: {
            console.log("RemoveTransactions \n\n");
            // Transaction removed
            deleteRemovedTransactions(req.body);
        }
            break;
        case 4: {
            // Webhook updated(or registered)
        }
            break;
        case 1205: {
            // Webhook Error - e.g. Account locked
        }
            break;
    }
}

async function downloadInitialData(body) {

    let response = await plaidClient.getConnectUserAsync(body.access_token, {gte: '90 days ago', pending: true});

    if (response) {

        let bank = await Bank.findOneAsync({access_token:body.access_token});

        // ************ Download & Save Account Data
        console.log('You have ' + response.accounts.length + ' accounts in your ' + bank.institution_type + " institution.\n");
        for (let i = 0; i < response.accounts.length; i ++) {
            let accountObj = response.accounts[i];
            accountObj._bank = bank._id;

            try {
                let account = new Account(accountObj);
                await account.saveAsync();
                console.log("Account saved : " + account + "\n");
            } catch (error) {
                console.log("Account save failed : " + JSON.stringify(accountObj) + "\nError : " + JSON.stringify(error) + "\n");
            }
        }

        // ************ Download & Save Transaction Data
        console.log('You have' + response.transactions.length + 'transactions from the last 90 days.');
        for (let i = 0; i < response.transactions.length; i ++) {

            let transactionObj = response.transactions[i];
            transactionObj._bank = bank._id;

            try {
                let transaction = new Transaction(transactionObj);
                await transaction.saveAsync();
                console.log("Transaction saved : " + transaction + "\n");
            } catch (error) {
                console.log("Transaction save failed : " + JSON.stringify(transactionObj) + "\nError : " + JSON.stringify(error) + "\n");
            }
        }

    } else {
        console.log("No transactions or accounts returned via response");
        res.success({"message": "No transactions or accounts returned via response"});
    }

    res.success({"message": "Successfully downloaded initial transactions"});
}

async function downloadLatestData(body) {

    let response = await plaidClient.getConnectUserAsync(body.access_token, {gte: '90 days ago', pending: true});

    if (response) {

        let bank = await Bank.findOneAsync({access_token:body.access_token});

        // ************ Download & Save Account Data
        console.log('You have ' + response.accounts.length + ' accounts in your ' + bank.institution_type + " institution.\n");
        for (let i = 0; i < response.accounts.length; i ++) {
            let accountObj = response.accounts[i];
            accountObj._bank = bank._id;

            let existing_account = await Account.findOneAsync({_id:accountObj._id});

            if (existing_account) {

                console.log("Account exists. Updating Account... " + "\n");
                delete accountObj._id;
                try {
                    await existing_account.update(accountObj);
                    console.log("Account update successful : " + existing_account + "\n");
                } catch (error) {
                    console.log("Account update failed : " + JSON.stringify(accountObj) + "\nError : " + JSON.stringify(error) + "\n");
                }

            } else {

                try {
                    let account = new Account(accountObj);
                    await account.saveAsync();
                    console.log("New Account Created : " + account + "\n");
                } catch (error) {
                    console.log("Account save failed : " + JSON.stringify(accountObj) + "\nError : " + JSON.stringify(error) + "\n");
                }
            }
        }

        // ************ Download & Save latest (past 90 days) Transaction Data
        console.log('You have' + response.transactions.length + 'transactions from the last 90 days.');
        for (let i = 0; i < response.transactions.length; i ++) {

            let transactionObj = response.transactions[i];
            transactionObj._bank = bank._id;

            let existing_transaction = await Transaction.findOneAsync({_id:transactionObj._id});

            if (existing_transaction) {

                console.log("Transaction exists. Updating Transaction... " + "\n");
                if (existing_transaction.pending != transactionObj.pending) {
                    existing_transaction.pending = transactionObj.pending;
                    await existing_transaction.saveAsync();
                    console.log("Pending Status of Transaction updated : " + existing_transaction + "\n");
                } else {
                    console.log("Pending Status is same. Nothing to update." + existing_transaction + "\n");
                }

            } else {
                try {
                    let transaction = new Transaction(transactionObj);
                    await transaction.saveAsync();
                    console.log("Transaction saved : " + transaction + "\n");
                } catch (error) {
                    console.log("Transaction save failed : " + JSON.stringify(transactionObj) + "\nError : " + JSON.stringify(error) + "\n");
                }
            }
        }

        // *********** Remove Transactions that does not exist in Plaid DB from AWS DB

        console.log("#########################################################################\n");
        console.log("Remove Transactions that does not exist in Plaid DB from AWS DB" + "\n");
        let aryLocalTransactions = await Transaction.findAsync({_bank : bank._id});
        console.log("number of transactions for the bank " + bank._id + " : " + aryLocalTransactions.length);

        for (let i = 0; i < aryLocalTransactions.length; i ++) {
            let localTransaction = aryLocalTransactions[i];

            let filteredTransactions = response.transactions.filter(transaction => transaction._id == localTransaction._id);

            console.log("Transaction filter result: " + JSON.stringify(filteredTransactions) + "\n");
            if (filteredTransactions.length == 0) {
                console.log("Transaction not exist in Plaid. Removing..." + "\n");
                await localTransaction.removeAsync();
            }
        }

        console.log("************ Remove Transaction Data Older than 90 days" + "\n");
        // ************ Remove Transaction Data Older than 90 days
        var startDate = new Date();
        startDate.setDate(startDate.getDate() - 90);
        console.log("Start Date : " + startDate);
        await Transaction.removeAsync({"createdAt": {"$lt": startDate}});
        console.log("************ Remove Transaction Data Older than 90 days done" + "\n");

    } else {
        console.log("No transactions or accounts returned via response");
        res.success({"message": "No transactions or accounts returned via response"});
    }

    res.success({"message": "Successfully downloaded latest transactions"});
}

async function deleteRemovedTransactions(body) {

    let removedTransactions = body.removed_transactions;
    console.log("Removing transactions...\n");
    for (let i = 0; i < removedTransactions.length; i ++) {
        let transaction_id = removedTransactions[i];
        console.log("Removing transaction " + transaction_id + "\n");
        await Transaction.findOneAndRemoveAsync({_id:transaction_id});
    }

    res.success({"message": "Successfully deleted transactions"});
}

module.exports = {
    webhook: handleWebhook
}