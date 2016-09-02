import {Insight} from '../models'
let env = process.env.NODE_ENV || 'development';
let config = require('__dirname + /../../config/config')[env];


async function create(req, res, next){

    let insight = new Insight(req.body);
    insight._user = req.decoded._id;
    await insight.saveAsync();

    return res.success({ data: insight});

}

async function update(req, res, next){
    delete req.body._id;
    await req.Insight.update(req.body);
    res.success({ body: req.Insight});
}

async function index(req, res, next){
    const insights = await Insight.findAsync({_user:req.decoded._id});
    res.success({data: insights});
}

async function show(req, res) {
    res.success({ data: req.Insight})
}

async function destroy(req, res) {

    await req.Insight.removeAsync();
    res.success({})
}

module.exports = {
    update: update,
    index: index,
    show: show,
    create: create,
    destroy: destroy
}