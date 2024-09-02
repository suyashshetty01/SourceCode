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

let training_module_masterSchema = new Schema({
    "Training_Module_Id": Number,
    "Training_Id": Number,
    "Module_Name": String,
    "Total_Chapter_Count": Number,
    "Total_Page_Count" : Number,
    "Status": String,
    "Created_On": {type: Date},
    "Modified_On": {type: Date}
});

training_module_masterSchema.plugin(mongoosePaginate);

training_module_masterSchema.plugin(autoIncrement.plugin, {model: 'training_module_master', field: 'Training_Module_Id', startAt: 1});
let training_module_master = connection.model('training_module_master', training_module_masterSchema);
module.exports = training_module_master;
