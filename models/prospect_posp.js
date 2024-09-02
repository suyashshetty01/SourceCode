/*
 * Author : Piyush - 12 Aug 2024
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 */

/* global global */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
autoIncrement = require('mongoose-plugin-autoinc');
var mongoosePaginate = require('mongoose-paginate');
mongoose.Promise = global.Promise;

var prospect_posp_Schema = new Schema({
    "Name": String,
    "Mobile": String,
    "Email": String,
    "Pan": String,
    "City": String,
    "State": String,
    "Lead_Assigned_SsId": String,
    "Created_On": Date,
    "Modified_On": Date
});

prospect_posp_Schema.plugin(mongoosePaginate);
prospect_posp_Schema.plugin(autoIncrement.plugin, {model: 'prospect_posp', field: 'Prospect_Posp_Id', startAt: 1});
var prospect_posp = mongoose.model('prospect_posp', prospect_posp_Schema);

// make this available to our users in our Node applications
module.exports = prospect_posp;