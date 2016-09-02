import { Account, Bank } from '../models'

let env = process.env.NODE_ENV || 'development';
let config = require('__dirname + /../../config/config')[env];

async function create(req, res, next){
    let account = new Account(req.body);
    await account.saveAsync();

    return res.success({ data: account });
}

async function update(req, res, next){
    delete req.body._id;
    await req.Account.update(req.body);
    res.success({body: req.Account});
}

async function index(req, res, next){

    const banks = await Bank.findAsync({_user:req.decoded._id});

    let accountsToReturn = [];
    for (let i = 0; i < banks.length; i++) {

        let bank = banks[i];

        let accounts = await Account.findAsync({_bank:bank._id});

        accountsToReturn.push(...accounts);
    }

    res.success({data: accountsToReturn});
}

async function show(req, res) {
    res.success({ data: req.Account})
}

async function destroy(req, res) {

    //let bank = await Bank.findOneAsync({_id: req.Account.bank});
    //bank.accounts.pull(req.Account._id);
    //await bank.saveAsync();
    await req.Account.removeAsync();
    res.success({})
}

module.exports = {
    update: update,
    index: index,
    show: show,
    create: create,
    destroy: destroy
}
