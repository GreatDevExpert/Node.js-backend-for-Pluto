import mongoose, { Schema } from 'mongoose';
import P from 'bluebird';
import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';
import { Account, Category } from './index';

/**
 * Transaction Schema
 */
let Transaction = new Schema ({

    _id: {
        type: String,
        index: true,
        unique: true,
        required: 'transaction id is required.'
    },
    _bank: {
        type: String,
        required: true
    },
    _account: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: 'name is required.'
    },
    pending: {
        type: Boolean,
        default: false
    },
    amount: {
        type: Number,
        default: 0.0
    },
    date: {
        type: Date,
        required: 'date is required.'
    },
    category: [{
        type: String
    }],
    meta: {
        type: Schema.Types.Mixed,
        default: {
            "location": {
            "address": "",
            "city":"",
            "state":"",
            "zip":"",
            "coordinates": {
                "lat": 0.0,
                "lon":0.0
            }
        }}
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
});

Transaction.plugin(timestamps);
Transaction.plugin(update, ['name', 'amount', 'date', 'category', 'meta', 'is_deleted']);

//Transaction
//    .virtual('_account')
//    .set(async function(_account) {
//        this._account = _account;
//        const account = await Account.findAsync({_id: _account});
//        this.account = account._id;
//    })
//    .get(function() { return this._account})

Transaction.statics.isValidId = function(transactionId){
}

/**
 * Methods
 */

//Transaction.methods = {
//
//    /**
//     * PushCategory - Add Category to Current Transaction
//     * @param name
//     */
//
//    pushCategory: async function(name) {
//        let transaction = this;
//        try {
//            let category = await Category.findOneAsync({name: name});
//            transaction.categories.push(category._id);
//            await transaction.saveAsync();
//        } catch (error) {
//
//        }
//    }
//}

module.exports = mongoose.model('Transaction', Transaction);
P.promisifyAll(module.exports);
P.promisifyAll(module.exports.prototype);