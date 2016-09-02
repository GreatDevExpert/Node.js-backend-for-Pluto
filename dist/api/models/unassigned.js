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
 * Unassigned Schema
 */

var Unassigned = new _mongoose.Schema({
    _goal: {
        type: _mongoose.Schema.Types.ObjectId,
        ref: 'Goal',
        required: true
    },
    amount: {
        type: Number,
        'default': 0.0
    }
});

Unassigned.plugin(_mongooseTimestamp2['default']);
Unassigned.plugin(_mongooseModelUpdate2['default'], ['_goal', 'amount']);

Unassigned.statics.isValidId = function (unassignedId) {};

module.exports = _mongoose2['default'].model('Unassigned', Unassigned);
_bluebird2['default'].promisifyAll(module.exports);
_bluebird2['default'].promisifyAll(module.exports.prototype);