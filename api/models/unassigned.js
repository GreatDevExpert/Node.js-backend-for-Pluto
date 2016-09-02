import mongoose, { Schema } from 'mongoose';
import P from 'bluebird';
import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';

/**
 * Unassigned Schema
 */

let Unassigned = new Schema ({
    _goal: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        default: 0.0
    }
});

Unassigned.plugin(timestamps);
Unassigned.plugin(update, ['_goal', 'amount']);

Unassigned.statics.isValidId = function(unassignedId){
}

module.exports = mongoose.model('Unassigned', Unassigned);
P.promisifyAll(module.exports);
P.promisifyAll(module.exports.prototype);