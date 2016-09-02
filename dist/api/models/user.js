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

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

/**
 * User Schema
 */

var User = new _mongoose.Schema({
    email: {
        type: String,
        index: true,
        unique: true,
        required: 'email address is required.'
    },
    hashed_password: {
        type: String,
        required: 'password cannot be blank.'
    },
    salt: {
        type: String
    },
    first_name: {
        type: String,
        'default': ''
    },
    last_name: {
        type: String,
        'default': ''
    },
    avatar_url: { type: String, 'default': '' },
    email_notification_enabled: { type: Boolean, 'default': true },
    push_notification_enabled: { type: Boolean, 'default': true }
});

User.plugin(_mongooseTimestamp2['default']);
User.plugin(_mongooseModelUpdate2['default'], ['email', 'first_name', 'last_name', 'avatar_url', 'email_notification_enabled', 'push_notification_enabled']);

/**
 * Virtuals
 */

User.virtual('password').set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
}).get(function () {
    return this._password;
});

/**
 * Validations
 */

var validatePresenceOf = function validatePresenceOf(value) {
    return value && value.length;
};

// the below 4 validations only apply if you are signing up traditionally

User.path('email').validate(function (email) {
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
    );
}, 'Please fill a valid email address. ');

//User.path('username').validate(function (username, fn) {
//    var User = mongoose.model('User');
//    // Check only when it is a new user or when email field is modified
//    User.find({ username: username }).exec(function (err, users) {
//        //return true;
//        fn((!err && users.length === 0));
//    });
//}, 'Username already exists.');

/**
 * Pre-save hook
 */

User.pre('save', function (next) {
    if (!this.isNew) return next();

    if (!validatePresenceOf(this.password)) next(new Error('Invalid password'));else next();
});

/**
 * Methods
 */

User.methods = {

    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */

    authenticate: function authenticate(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */

    makeSalt: function makeSalt() {
        return Math.round(new Date().valueOf() * Math.random()) + '';
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */

    encryptPassword: function encryptPassword(password) {
        if (!password) return '';
        return _crypto2['default'].createHmac('sha1', this.salt).update(password).digest('hex');
    }
};

module.exports = _mongoose2['default'].model('User', User);
_bluebird2['default'].promisifyAll(module.exports);
_bluebird2['default'].promisifyAll(module.exports.prototype);