/*
 * Author : Khushbu Gite 
 * Date: 03-06-2019 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
autoIncrement = require('mongoose-plugin-autoinc');
var mongoosePaginate = require('mongoose-paginate');

var efq_log_Schema = new Schema({
    "Type": String,
    "Created_On": {type: Date},
    'Detail': Object
});
// the schema is useless so far
// we need to create a model using it
efq_log_Schema.plugin(mongoosePaginate);
efq_log_Schema.plugin(autoIncrement.plugin, {model: 'efq_logs', field: 'EPF_Logs_Id', startAt: 1});
var efq_logs = mongoose.model('efq_logs', efq_log_Schema);

// make this available to our users in our Node applications
module.exports = efq_logs;
