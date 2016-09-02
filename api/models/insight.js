import mongoose, { Schema } from 'mongoose';
import P from 'bluebird';
import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';

/**
 * Insight Schema
 */

let Insight = new Schema ({
    _user: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: 'name is required.'
    },
    type: {
        type: String,
        enum: ['challenge1', 'challenge2', 'goal1', 'goal2']
    },
    title: {
        type: String,
        required: 'title is required.'
    },
    description: {
        type: String,
        default:''
    }
});

Insight.plugin(timestamps);
Insight.plugin(update, ['_user', 'name', 'type', 'title', 'description']);

Insight.statics.isValidId = function(insightId){
}

module.exports = mongoose.model('Insight', Insight);
P.promisifyAll(module.exports);
P.promisifyAll(module.exports.prototype);