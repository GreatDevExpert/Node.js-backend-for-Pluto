'use strict';

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _models = require('../models');

var env = process.env.NODE_ENV || 'development';
var config = require('__dirname + /../../config/config')[env];

function login(req, res, next) {
    var _req$body, email, password, user, token;

    return _regeneratorRuntime.async(function login$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                _req$body = req.body;
                email = _req$body.email;
                password = _req$body.password;

                if (!(!email || !password)) {
                    context$1$0.next = 5;
                    break;
                }

                return context$1$0.abrupt('return', res.error('authentication_failed', 401, 'Missing or invalid authentication credentials.'));

            case 5:
                context$1$0.next = 7;
                return _regeneratorRuntime.awrap(_models.User.findOneAsync({ email: email }));

            case 7:
                user = context$1$0.sent;

                if (user) {
                    context$1$0.next = 10;
                    break;
                }

                return context$1$0.abrupt('return', res.error('authentication_failed', 401, 'Missing or invalid authentication credentials.'));

            case 10:
                if (user.authenticate(password)) {
                    context$1$0.next = 12;
                    break;
                }

                return context$1$0.abrupt('return', res.error('authentication_failed', 401, 'Missing or invalid authentication credentials.'));

            case 12:
                token = _jsonwebtoken2['default'].sign(user, config.secret, {
                    expiresInMinutes: 1440 // expires in 24 hours
                });

                res.success({ id: user._id, api_token: token });

            case 14:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

function signup(req, res, next) {
    var _req$body2, email, password, user, newUser, token;

    return _regeneratorRuntime.async(function signup$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                _req$body2 = req.body;
                email = _req$body2.email;
                password = _req$body2.password;

                if (!(!email || !password)) {
                    context$1$0.next = 5;
                    break;
                }

                return context$1$0.abrupt('return', res.error('signup_failed', 401, 'Email or password cannot be empty.'));

            case 5:
                context$1$0.next = 7;
                return _regeneratorRuntime.awrap(_models.User.findOneAsync({ email: email }));

            case 7:
                user = context$1$0.sent;

                if (!user) {
                    context$1$0.next = 10;
                    break;
                }

                return context$1$0.abrupt('return', res.error('signup_failed', 401, 'Email already taken.'));

            case 10:
                newUser = new _models.User(req.body);
                context$1$0.next = 13;
                return _regeneratorRuntime.awrap(newUser.saveAsync());

            case 13:

                newUser.createCustomer(function (err, customer) {
                    if (err) return console.log(err);
                    console.log("Customer " + customer.stripe + " Created.");
                });

                token = _jsonwebtoken2['default'].sign(newUser, config.secret, {
                    expiresInMinutes: 1440 // expires in 24 hours
                });
                return context$1$0.abrupt('return', res.success({ id: newUser._id, api_token: token }));

            case 16:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

function show(req, res, next) {
    res.success(req.user);
}

function index(req, res, next) {
    var users;
    return _regeneratorRuntime.async(function index$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                context$1$0.next = 2;
                return _regeneratorRuntime.awrap(_models.User.findAsync({}));

            case 2:
                users = context$1$0.sent;

                res.success({ data: users });

            case 4:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

function update(req, res, next) {
    return _regeneratorRuntime.async(function update$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                delete req.body._id;
                context$1$0.next = 3;
                return _regeneratorRuntime.awrap(req.User.update(req.body));

            case 3:
                res.success({ _id: req.User._id });

            case 4:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

function updateMe(req, res, next) {
    return _regeneratorRuntime.async(function updateMe$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                delete req.body._id;
                context$1$0.next = 3;
                return _regeneratorRuntime.awrap(req.user.update(req.body));

            case 3:
                res.success({ _id: req.user._id });

            case 4:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}
function destroy(req, res, next) {
    return _regeneratorRuntime.async(function destroy$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                context$1$0.next = 2;
                return _regeneratorRuntime.awrap(req.User.removeAsync());

            case 2:
                res.success({});

            case 3:
            case 'end':
                return context$1$0.stop();
        }
    }, null, this);
}

module.exports = {
    login: login,
    signup: signup,
    show: show,
    index: index,
    destroy: destroy,
    update: update,
    updateMe: updateMe
};