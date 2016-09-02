import { Transaction, Bank } from '../models'

let env = process.env.NODE_ENV || 'development';
let config = require('__dirname + /../../config/config')[env];

async function create(req, res, next){
    let transaction = new Transaction(req.body);

    //await req.body.category.forEach(async function(name) {
    //    transaction.pushCategory(name);
    //});

    await transaction.saveAsync();

    return res.success({ data: account });
}

async function update(req, res, next){

    let param = 'id';
    console.log("ID : " + req.params[param] + "\n");

    let transaction = await Transaction.findOneAsync({_id:req.params[param]});

    delete req.body._id;

    req.body.category = req.body['category[]'] || [];
    await transaction.update(req.body);

    console.log("Updated transaction : " + JSON.stringify(transaction));

    res.success({ body: transaction});
}

async function index(req, res, next){

    const banks = await Bank.findAsync({_user:req.decoded._id});

    let transactionsToReturn = [];
    for (let i = 0; i < banks.length; i++) {
        let bank = banks[i];
        let transactions = await Transaction.findAsync({_bank:bank._id});

        transactionsToReturn.push(...transactions);
    }


    res.success({data: transactionsToReturn, time: Date.now()});
}

async function show(req, res) {
    res.success({ data: req.Transaction})
}

async function destroy(req, res) {

    req.Transaction.is_deleted = true;
    await req.Transaction.saveAsync();
    res.success({})
}

module.exports = {
    update: update,
    index: index,
    show: show,
    create: create,
    destroy: destroy
}
