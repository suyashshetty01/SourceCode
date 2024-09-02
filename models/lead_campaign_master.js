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

var Lead_Campaign_masters_Schema = new Schema({
    "Campaign_Name": String,
    "Campaign_Text": String,
    "DataFormat": Object,
    "Access_User": [Number],
    "Collection_Name": String,
    "Status": {
        type: Number,
        enum:[0,1]
    },
    "Call_Api_URL": String,
    "Created_By": Number,
    "Modified_By": {
        type: Number,
        default: 0
    },
    "Created_On": Date,
    "Modified_On": Date
});

Lead_Campaign_masters_Schema.plugin(mongoosePaginate);
Lead_Campaign_masters_Schema.plugin(autoIncrement.plugin, {model: 'lead_campaign_masters', field: 'Campaign_Id', startAt: 1});
var Lead_Campaign_masters = mongoose.model('lead_campaign_masters', Lead_Campaign_masters_Schema);

// make this available to our users in our Node applications
module.exports = Lead_Campaign_masters;

