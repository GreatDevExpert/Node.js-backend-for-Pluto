import mongoose, { Schema } from 'mongoose';
import P from 'bluebird';
import timestamps from 'mongoose-timestamp';
import update from 'mongoose-model-update';


/**
 * Category Schema
 */

let Category = new Schema ({
    name: {
        type: String,
        index:true,
        unique: true,
        required: 'name is required'
    },
    image_url: {
        type: String,
        default:''
    }
});

Category.statics.isValidId = function(categoryId){
}

Category.plugin(timestamps);
Category.plugin(update, ['name', 'image_url']);


module.exports = mongoose.model('Category', Category);
P.promisifyAll(module.exports);
P.promisifyAll(module.exports.prototype);