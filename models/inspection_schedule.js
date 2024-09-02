/*
 * Author : Chirag Modi 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 *
 *
 * 
 */

// grab the things we need
var mongoose = require('mongoose');
autoIncrement = require('mongoose-plugin-autoinc');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var inspection_scheduleSchema = new Schema({
    "Inspection_Schedule_Id":Number,
    "PB_CRN": Number,
    "UD_Id": Number,
    "SL_Id": Number,
    "Insurer_Id": Number,
    "Request_Unique_Id": String,
    "Service_Log_Unique_Id": String,
    "Agent_Code": String,
    "Inspection_Id": String,
    "Status": String,
    "Insurer_Status": String,
    "Insurer_Request": String,
    "Created_On": Date,
    "Modified_On": Date
});
// the schema is useless so far
// we need to create a model using it
var Inspection_Schedule = mongoose.model('Inspection_Schedule', inspection_scheduleSchema);
inspection_scheduleSchema.plugin(autoIncrement.plugin, {model: 'Inspection_Schedule', field: 'Inspection_Schedule_Id', startAt: 1});
// make this available to our users in our Node applications
module.exports = Inspection_Schedule;
