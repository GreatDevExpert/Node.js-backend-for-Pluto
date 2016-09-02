import mongoose, { Schema } from 'mongoose';
import P from 'bluebird';
import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';

/**
 * Challenge Schema
 */

let Challenge = new Schema ({
    name: {
        type: String,
        required: 'name is required.'
    },
    image_url: {
        type: String,
        default: ''
    },
    _category: {
        type: String,
        required: true
    },
    _user: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        default: 0.0
    },
    _goals: [{
        type: String
    }]
});

Challenge.statics.isValidId = function(challengeId){
}

Challenge.plugin(timestamps);
Challenge.plugin(update, ['name', 'image_url', '_category', 'amount', '_goals']);

module.exports = mongoose.model('Challenge', Challenge);
P.promisifyAll(module.exports);
P.promisifyAll(module.exports.prototype);