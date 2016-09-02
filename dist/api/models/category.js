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
 * Category Schema
 */

var Category = new _mongoose.Schema({
    name: {
        type: String,
        index: true,
        unique: true,
        required: 'name is required'
    },
    image_url: {
        type: String,
        'default': ''
    }
});

Category.statics.isValidId = function (categoryId) {};

Category.plugin(_mongooseTimestamp2['default']);
Category.plugin(_mongooseModelUpdate2['default'], ['name', 'image_url']);

module.exports = _mongoose2['default'].model('Category', Category);
_bluebird2['default'].promisifyAll(module.exports);
_bluebird2['default'].promisifyAll(module.exports.prototype);