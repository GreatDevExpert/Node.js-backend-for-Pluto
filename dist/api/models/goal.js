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
 * Goal Schema
 */

var Goal = new _mongoose.Schema({
    _user: {
        type: _mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        'default': 0.0
    },
    image_url: {
        type: String,
        'default': ''
    },
    deadline: {
        type: Date,
        required: true
    },
    priority: {
        type: Number,
        'default': 0
    }
});

Goal.statics.isValidId = function (goalId) {};

Goal.plugin(_mongooseTimestamp2['default']);
Goal.plugin(_mongooseModelUpdate2['default'], ['_user', 'name', 'amount', 'image_url', 'deadline', 'priority']);

module.exports = _mongoose2['default'].model('Goal', Goal);
_bluebird2['default'].promisifyAll(module.exports);
_bluebird2['default'].promisifyAll(module.exports.prototype);