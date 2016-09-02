'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _configDatabase = require('../../config/database');

var _configDatabase2 = _interopRequireDefault(_configDatabase);

module.exports = {
    Bank: require('./bank'),
    Category: require('./category'),
    Challenge: require('./challenge'),
    Goal: require('./goal'),
    Insight: require('./insight'),
    Transaction: require('./transaction'),
    Unassigned: require('./unassigned'),
    User: require('./user')
};