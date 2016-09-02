import mongoose, { Schema } from 'mongoose';
import P from 'bluebird';
import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';
import plaid from 'plaid';

let env = process.env.NODE_ENV || 'development';
let config = require('__dirname + /../../config/config')[env];

P.promisifyAll(plaid);
let plaidClient = new plaid.Client(config.plaid_client_id, config.plaid_client_secret, config.plaid_env);

/**
 * Bank Schema
 */

let Bank = new Schema ({
    _user: {
        type: String,
        required: true
    },
    logo_url: {
        type: String,
        default:''
    },
    institution_type: {
        type: String,
        required: 'institution type is required'
    },
    access_token: {
        type: String,
        default: ''
    }
});

Bank.plugin(timestamps);
Bank.plugin(update, ['logo_url', 'institution_type']);

///**
// * Virtuals
// */
//Bank
//    .virtual('public_token')
//    .set(async function(public_token) {
//        const {access_token} = await plaidClient.exchangeTokenAsync(public_token);
//        console.log(access_token);
//        this.access_token = access_token;
//        await this.saveAsync();
//    })
//    .get(function() { return this._public_token})

Bank.statics.isValidId = function(bankId){
}

module.exports = mongoose.model('Bank', Bank);
P.promisifyAll(module.exports);
P.promisifyAll(module.exports.prototype);