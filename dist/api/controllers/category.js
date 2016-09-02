'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _models = require('../models');

var env = process.env.NODE_ENV || 'development';
var config = require('__dirname + /../../config/config')[env];

function create(req, res, next) {
    var category;
    return _regeneratorRuntime.async(function create$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                category = new _models.Category(req.body);
                context$1$0.next = 3;
                return _regeneratorRuntime.awrap(category.saveAsync());

            case 3:
                return context$1$0.abrupt('return', res.success({ data: category }));

            case 4:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

function update(req, res, next) {
    return _regeneratorRuntime.async(function update$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                delete req.body._id;
                context$1$0.next = 3;
                return _regeneratorRuntime.awrap(req.Category.update(req.body));

            case 3:
                res.success({ _id: req.Category._id });

            case 4:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

function index(req, res, next) {
    var categories;
    return _regeneratorRuntime.async(function index$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                context$1$0.next = 2;
                return _regeneratorRuntime.awrap(_models.Category.findAsync({}));

            case 2:
                categories = context$1$0.sent;

                res.success({ data: categories });

            case 4:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

function show(req, res) {
    return _regeneratorRuntime.async(function show$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                res.success({ data: req.Category });

            case 1:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

function destroy(req, res) {
    return _regeneratorRuntime.async(function destroy$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                context$1$0.next = 2;
                return _regeneratorRuntime.awrap(req.Category.removeAsync());

            case 2:
                res.success({});

            case 3:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

module.exports = {
    update: update,
    index: index,
    show: show,
    create: create,
    destroy: destroy
};