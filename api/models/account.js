import mongoose, { Schema } from 'mongoose';
import P from 'bluebird';
import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';

let env = process.env.NODE_ENV || 'development';
let config = require('__dirname + /../../config/config')[env];

/**
 * Account Schema
 */

let Account = new Schema ({

    _id: {
        type: String,
        index: true,
        unique: true,
        required: 'account id is required.'
    },
    _bank: {
        type: String,
        required: true
    },
    balance: {
        type: Schema.Types.Mixed,
        default: {"available": 0, "current": 0}
    },
    institution_type: {
        type: String,
        required: 'institution type is required'
    },
    meta: {
        type: Schema.Types.Mixed,
        default: {"name":"", "number": ""}
    },
    type: {
        type: String,
        default: ''
    },
    subtype: {
        type: String,
        default: ''
    }
});

Account.plugin(timestamps);
Account.plugin(update, ['balance', 'institution_type', 'meta', 'type', 'subtype']);

Account.statics.isValidId = function(bankId){
}

module.exports = mongoose.model('Account', Account);
P.promisifyAll(module.exports);
P.promisifyAll(module.exports.prototype);