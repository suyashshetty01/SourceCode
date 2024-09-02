/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;
autoIncrement = require('mongoose-plugin-autoinc');
var Health_Lead_Schema = new Schema({
    'Created_On': Date,
    'Modified_On': Date,
    'Name': String,
    'Date_Of_Birth': String,
    'Mobile': Number,
    'Email': String,
    "City_Name": String,
    "City_Id": Number,
    "State": String,
    "Disposition_Status": {type: String, default: ""},
    "Disposition_Sub_Status": {type: String, default: ""},
    "Next_Call_Date": {type: Date, default: ""},
    "Disposition_On": {type: Date, default: ""},
    "Last_Enquiry_On": {type: Date, default: ""},
    "Last_Assigned_To": {type: Number, default: ""},
    "Last_Assigned_By": {type: String, default: ""},
    "Last_Assigned_On": {type: Date, default: ""}
});
// we need to create a model using it
Health_Lead_Schema.plugin(mongoosePaginate);

Health_Lead_Schema.plugin(autoIncrement.plugin, {model: 'health_lead', field: 'Health_Lead_Id', startAt: 1});
var health_lead = mongoose.model('health_lead', Health_Lead_Schema);

// make this available to our users in our Node applications
module.exports = health_lead;