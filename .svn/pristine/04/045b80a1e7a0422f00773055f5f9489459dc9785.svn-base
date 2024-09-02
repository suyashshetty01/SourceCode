/*
 * Author : Khushbu Gite 19-03-2020
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 *
 *
 * 
 */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
autoIncrement = require('mongoose-plugin-autoinc');
var mongoosePaginate = require('mongoose-paginate');


var fm_log_Schema = new Schema({
"Api_Name":String,
"Json_Request":String,
"Create_On":Date,
"Result":String,
"Message":String
});

// the schema is useless so far
// we need to create a model using it
fm_log_Schema.plugin(mongoosePaginate);
fm_log_Schema.plugin(autoIncrement.plugin, {model: 'Fm_Log', field: 'Fm_Log_Id', startAt: 1});
var Fm_Log = mongoose.model('Fm_Log', fm_log_Schema);

// make this available to our users in our Node applications
module.exports = Fm_Log;

