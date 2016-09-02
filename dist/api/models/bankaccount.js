'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mongooseTimestamp = require('mongoose-timestamp');

var _mongooseTimestamp2 = _interopRequireDefault(_mongooseTimestamp);

var _mongooseModelUpdate = require('mongoose-model-update');

var _mongooseModelUpdate2 = _interopRequireDefault(_mongooseModelUpdate);

/**
 * BankAccount Schema
 */

var BankAccount = new _mongoose.Schema({
    _id: {
        type: String,
        required: 'account id is required.',
        index: true,
        unique: true
    },
    _user: {
        type: _mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    logo_url: {
        type: String,
        'default': ''
    },
    institution_code: {
        type: String,
        required: 'institution code is required'
    },
    access_token: {
        type: String,
        'default': ''
    }
});

BankAccount.plugin(_mongooseTimestamp2['default']);
BankAccount.plugin(_mongooseModelUpdate2['default'], ['_user', 'logo_url', 'institution_code', 'access_token']);

BankAccount.statics.isValidId = function (bankAccountId) {};

module.exports = _mongoose2['default'].model('BankAccount', BankAccount);
_bluebird2['default'].promisifyAll(module.exports);
_bluebird2['default'].promisifyAll(module.exports.prototype);