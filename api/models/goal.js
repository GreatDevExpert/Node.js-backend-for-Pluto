import mongoose, { Schema } from 'mongoose';
import P from 'bluebird';
import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';

/**
 * Goal Schema
 */

let Goal = new Schema ({
    _user: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        default: 0.0
    },
    image_url: {
        type: String,
        default: ''
    },
    deadline: {
        type: Date
    },
    priority: {
        type: Number,
        default: 0
    },
    // The flag to show if completion push notification has been sent after the goal is achieved
    complete_notification_flag : {
        type: Number,
        default: 0,
    },
    // Possible Values - goal percentage that previous notification has been sent
    fivepercent_notification_flag : {
        type: String,
        default: 0,
    }
});

Goal.statics.isValidId = function(goalId){
}

Goal.plugin(timestamps);
Goal.plugin(update, ['name', 'amount', 'image_url', 'deadline', 'priority', 'complete_notification_flag', 'fivepercent_notification_flag']);

module.exports = mongoose.model('Goal', Goal);
P.promisifyAll(module.exports);
P.promisifyAll(module.exports.prototype);