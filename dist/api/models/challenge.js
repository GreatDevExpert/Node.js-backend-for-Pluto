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
 * Challenge Schema
 */

var Challenge = new _mongoose.Schema({
    name: {
        type: String,
        required: 'name is required.'
    },
    image_url: {
        type: String,
        'default': ''
    },
    _category: {
        type: _mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    _user: {
        type: _mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        'default': 0.0
    },
    _goals: [{
        type: _mongoose.Schema.Types.ObjectId,
        ref: 'Goal'
    }]
});

Challenge.statics.isValidId = function (challengeId) {};

Challenge.plugin(_mongooseTimestamp2['default']);
Challenge.plugin(_mongooseModelUpdate2['default'], ['name', 'image_url', '_category', '_user', 'amount', '_goals']);

module.exports = _mongoose2['default'].model('Challenge', Challenge);
_bluebird2['default'].promisifyAll(module.exports);
_bluebird2['default'].promisifyAll(module.exports.prototype);