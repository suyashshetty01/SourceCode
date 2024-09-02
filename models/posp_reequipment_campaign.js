/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*
 * 
 
 */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var config = require('config');
var mongoosePaginate = require('mongoose-paginate');

autoIncrement = require('mongoose-plugin-autoinc');

var connection = mongoose.createConnection(config.db.connection + ':27017/' + config.db.name);
//autoIncrement.initialize(connection);

var pospReequipmentCampaignSchema = new Schema({
    "Campaign_id": Number,
    "Campaign_name": String,
    "Description": String,
    "Start_date": Date,
    "End_date": Date,
    "Status": String
});

// the schema is useless so far
// we need to create a model using it
pospReequipmentCampaignSchema.plugin(mongoosePaginate);
pospReequipmentCampaignSchema.plugin(autoIncrement.plugin, {model: 'posp_reequipment_campaign', field: 'Campaign_id', startAt: 1});
var pospReequipmentCampaign =  mongoose.model('posp_reequipment_campaign', pospReequipmentCampaignSchema);

// make this available to our users in our Node applications
module.exports = pospReequipmentCampaign;