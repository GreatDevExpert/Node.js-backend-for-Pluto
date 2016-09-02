import {Unassigned} from '../models'
let env = process.env.NODE_ENV || 'development';
let config = require('__dirname + /../../config/config')[env];


async function create(req, res, next){

    let unassigned = new Unassigned(req.body);
    await unassigned.saveAsync();

    return res.success({ data: unassigned});

}

async function update(req, res, next){
    delete req.body._id;
    await req.Unassigned.update(req.body);
    res.success({ body: req.Unassigned});
}

async function index(req, res, next){
    const unassigneds = await Unassigned.findAsync({});
    res.success({data: unassigneds});
}

async function show(req, res) {
    res.success({ data: req.Unassigned})
}

async function destroy(req, res) {

    await req.Unassigned.removeAsync();
    res.success({})
}

module.exports = {
    update: update,
    index: index,
    show: show,
    create: create,
    destroy: destroy
}