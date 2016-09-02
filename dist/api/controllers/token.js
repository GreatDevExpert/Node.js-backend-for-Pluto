'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _models = require('../models');

var jwt = require('jsonwebtoken');
var env = process.env.NODE_ENV || 'development';
var config = require('../../config/config')[env];

function ensureAuthenticated(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-auth-token'];
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secret, function callee$1$0(err, decoded) {
            return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
                while (1) switch (context$2$0.prev = context$2$0.next) {
                    case 0:
                        if (!err) {
                            context$2$0.next = 4;
                            break;
                        }

                        return context$2$0.abrupt('return', res.json({ status: 401, reason: 'Failed to authenticate token.' }));

                    case 4:
                        // if everything is good, save to request for use in other routes
                        req.decoded = decoded;
                        context$2$0.next = 7;
                        return _regeneratorRuntime.awrap(_models.User.findByIdAsync(req.decoded._id));

                    case 7:
                        req.user = context$2$0.sent;

                        next();

                    case 9:
                    case 'end':
                        return context$2$0.stop();
                }
            }, null, this);
        });
    } else {
        // if there is no token return an error
        return res.error('no token', 401, 'No token provided');
    }
}

function ensureAdmin(req, res, next) {
    console.log(req.user);
    if (req.user.email != config.admin.email) {
        return res.error('no permission', 401, 'You are not approved to do this action');
    }
    next();
}

module.exports = {
    ensureAuthenticated: ensureAuthenticated,
    ensureAdmin: ensureAdmin
};