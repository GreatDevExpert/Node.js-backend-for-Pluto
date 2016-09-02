'use strict';

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var rootPath = _path2['default'].normalize(__dirname + '/..');

module.exports = {
	development: {
		db: process.env.MONGOLAB_URI || 'mongodb://localhost:27017/pluto_dev',
		root: rootPath,
		app: {
			name: 'Pluto Backend'
		},
		secret: 'secretkeyforplutowebservice',
		admin: {
			email: 'admin@gopluto.io',
			password: 'pass'
		}
	},
	production: {
		db: process.env.MONGOLAB_URI || 'mongodb://localhost:27017/pluto_dev',
		root: rootPath,
		app: {
			name: 'Pluto Backend'
		},
		secret: 'secretkeyforplutowebservice',
		admin: {
			email: 'admin@gopluto.io',
			password: 'pass'
		}
	}
};