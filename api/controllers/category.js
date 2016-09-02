import { Category } from '../models'

let env = process.env.NODE_ENV || 'development';
let config = require('__dirname + /../../config/config')[env];

async function create(req, res, next){
    let category = new Category(req.body);
    await category.saveAsync();

    return res.success({ data: category });
}

async function update(req, res, next){
    delete req.body._id;
    await req.Category.update(req.body);
    res.success({body: req.Category});
}

async function index(req, res, next){
    const categories = await Category.findAsync({});
    res.success({data: categories});
}

async function show(req, res) {
    res.success({ data: req.Category })
}

async function destroy(req, res) {
    await req.Category.removeAsync();
    res.success({})
}

module.exports = {
    update: update,
    index: index,
    show: show,
    create: create,
    destroy: destroy
}
