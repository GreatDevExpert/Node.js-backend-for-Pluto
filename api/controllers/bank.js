import { Bank } from '../models'
import plaid from 'plaid';
import P from 'bluebird';

let env = process.env.NODE_ENV || 'development';
let config = require('__dirname + /../../config/config')[env];

P.promisifyAll(plaid);
let plaidClient = new plaid.Client(config.plaid_client_id, config.plaid_client_secret, config.plaid_env);

async function create(req, res, next){

    console.log("Registering new bank : " + JSON.stringify(req.body) + "\n");

    let bank = new Bank(req.body);
    bank._user = req.decoded._id;

    if (!bank.access_token) {
        const {access_token} = await plaidClient.exchangeTokenAsync(req.body.public_token);

        if (!access_token) {
            return res.error('Failed to exchange token', 500, 'Internal Server Error.');
        }

        console.log("Exchanged public token to access token : " + req.body.public_token + " -> " + access_token);

        // Ugrade User from Auth to Connect
        var upgradeUserAsync = P.promisify(plaidClient.upgradeUser, {context: plaidClient, multiArgs: true});
        await plaidClient.upgradeUserAsync(access_token, "connect", {webhook:config.webhook_url});

        bank.access_token = access_token;
    }

    try {
        await bank.saveAsync();
    } catch (error) {
        console.log("Error in registering a new bank : " + JSON.stringify(error) + "\n");
        return res.error('bank_creation_failed', 500, 'Internal Server Error.');
    }

    console.log("New bank added successfully. Access token : " + bank.access_token);

    return res.success({ data: bank });
}

async function addConnectUser(req, res, next) {
    // Add a Chase user using the list:true option

    let insitution_type = req.body.institution_type;
    let username = req.body.username;
    let password = req.body.password;

    console.log("Adding connect user... : " + JSON.stringify(req.body) + "\n");

    var addConnectUserAsync = P.promisify(plaidClient.addConnectUser, {context: plaidClient, multiArgs: true});

    plaidClient.addConnectUserAsync(insitution_type,
        {username: username, password: password},
        {login_only:true, webhook:config.webhook_url})
        .done(responses => {
        //var mfaResponse = responses[0];
        //var response = responses[1];
        console.log("Connect user successfully added : " + responses + "\n");
        res.success(responses);
    });
}

async function update(req, res, next){
    delete req.body._id;
    await req.Bank.update(req.body);
    res.success({ gody: req.Bank});
}

async function index(req, res, next){
    const banks = await Bank.findAsync({_user:req.decoded._id});
    res.success({data: banks});
}

async function show(req, res) {
    res.success({ data: req.Bank})
}

async function destroy(req, res) {
    await req.Bank.removeAsync();
    res.success({})
}

module.exports = {
    update: update,
    index: index,
    show: show,
    create: create,
    destroy: destroy,
    addConnectUser: addConnectUser
}
