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
 * Insight Schema
 */

var Insight = new _mongoose.Schema({
    _user: {
        type: _mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: 'name is required.'
    },
    type: {
        type: String,
        'enum': ['challenge1', 'challenge2', 'goal1', 'goal2']
    },
    title: {
        type: String,
        required: 'title is required.'
    },
    description: {
        type: String,
        'default': ''
    }
});

Insight.plugin(_mongooseTimestamp2['default']);
Insight.plugin(_mongooseModelUpdate2['default'], ['_user', 'name', 'type', 'title', 'description']);

Insight.statics.isValidId = function (insightId) {};

module.exports = _mongoose2['default'].model('Insight', Insight);
_bluebird2['default'].promisifyAll(module.exports);
_bluebird2['default'].promisifyAll(module.exports.prototype);