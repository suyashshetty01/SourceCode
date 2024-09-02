/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
let config = require('config');
let Schema = mongoose.Schema;
autoIncrement = require('mongoose-plugin-autoinc');
mongoose.Promise = global.Promise;
let connection = mongoose.createConnection(config.db.connection + ':27017/' + config.db.name);

let training_module_contentSchema = new Schema({   
    "Module_Id": Number,
    "Training_Id": Number,
    "Chapter_No":Number,
    "Page_No": Number,
    "Module_Name": String,
    "Content_Heading": String,
    "Module_Content": String,
    "Status": String,
    "Created_On": {type: Date},
    "Modified_On": {type: Date}
});

training_module_contentSchema.plugin(mongoosePaginate);

training_module_contentSchema.plugin(autoIncrement.plugin, {model: 'training_module_content', field: 'Content_Id', startAt: 1});
let training_module_content = connection.model('training_module_content', training_module_contentSchema);
module.exports = training_module_content;
