import mongoose, { Schema } from 'mongoose';
import P from 'bluebird';
import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';
import crypto from 'crypto';

/**
 * User Schema
 */

let User = new Schema ({
    email: {
        type: String,
        index:true,
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
        default: ''
    },
    last_name: {
        type: String,
        default: ''
    },
    timezone: {
        type: Number,
        default: 0
    },
    device_token: {
        type: String,
        default: ''
    },
    avatar_url: {type: String, default: ''},
    email_notification_enabled: {type:Boolean, default: true},
    push_notification_enabled: {type:Boolean, default: true}
})

User.plugin(timestamps);
User.plugin(update, ['email', 'first_name', 'last_name', 'avatar_url', 'email_notification_enabled', 'push_notification_enabled', 'device_token', 'timezone']);

/**
 * Virtuals
 */

User
    .virtual('password')
    .set(function(password) {
        this._password = password
        this.salt = this.makeSalt()
        this.hashed_password = this.encryptPassword(password)
    })
    .get(function() { return this._password })

/**
 * Validations
 */

let validatePresenceOf = function (value) {
    return value && value.length
}


// the below 4 validations only apply if you are signing up traditionally

User.path('email').validate(function (email) {
   return  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
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

User.pre('save', function(next) {
    if (!this.isNew) return next()

    if (!validatePresenceOf(this.password))
        next(new Error('Invalid password'))
    else
        next()
})

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

    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashed_password
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */

    makeSalt: function() {
        return Math.round((new Date().valueOf() * Math.random())) + ''
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */

    encryptPassword: function(password) {
        if (!password) return ''
        return crypto.createHmac('sha1', this.salt).update(password).digest('hex')
    }
}

module.exports = mongoose.model('User', User);
P.promisifyAll(module.exports);
P.promisifyAll(module.exports.prototype);
