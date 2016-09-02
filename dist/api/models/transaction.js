'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mongooseTimestamp = require('mongoose-timestamp');

var _mongooseTimestamp2 = _interopRequireDefault(_mongooseTimestamp);

var _mongooseModelUpdate = require('mongoose-model-update');

var _mongooseModelUpdate2 = _interopRequireDefault(_mongooseModelUpdate);

var _index = require('./index');

/**
 * Transaction Schema
 */

var Transaction = new _mongoose.Schema({

    _id: {
        type: String,
        index: true,
        unique: true,
        required: 'transaction id is required.'
    },
    _account: {
        type: String,
        ref: 'BankAccount',
        required: true
    },
    name: {
        type: String,
        required: 'name is required.'
    },
    amount: {
        type: Number,
        'default': 0.0
    },
    date: {
        type: Date,
        required: 'date is required.'
    },
    categories: [{
        type: _mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }],
    location: {
        type: _mongoose.Schema.Types.Mixed,
        'default': ''
    },
    is_deleted: {
        type: Boolean,
        'default': false
    }
});

Transaction.plugin(_mongooseTimestamp2['default']);
Transaction.plugin(_mongooseModelUpdate2['default'], ['name', 'amount', 'date', 'categories', 'location', 'is_deleted']);

Transaction.statics.isValidId = function (transactionId) {};

Transaction.methods.pushCategory = function callee$0$0(name) {
    var transaction, category;
    return _regeneratorRuntime.async(function callee$0$0$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                transaction = this;
                context$1$0.prev = 1;
                context$1$0.next = 4;
                return _regeneratorRuntime.awrap(_index.Category.findOneAsync({ name: name }));

            case 4:
                category = context$1$0.sent;

                transaction.categories.push(category._id);
                context$1$0.next = 8;
                return _regeneratorRuntime.awrap(transaction.saveAsync());

            case 8:
                context$1$0.next = 12;
                break;

            case 10:
                context$1$0.prev = 10;
                context$1$0.t0 = context$1$0['catch'](1);

            case 12:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this, [[1, 10]]);
};

module.exports = _mongoose2['default'].model('Transaction', Transaction);
_bluebird2['default'].promisifyAll(module.exports);
_bluebird2['default'].promisifyAll(module.exports.prototype);