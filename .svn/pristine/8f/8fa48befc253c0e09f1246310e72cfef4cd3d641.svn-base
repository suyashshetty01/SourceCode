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
//var mongoosePaginate = require('mongoose-paginate');

//autoIncrement = require('mongoose-plugin-autoinc');

//var connection = mongoose.createConnection(config.db.connection + ':27017/' + config.db.name);
//autoIncrement.initialize(connection);



var campaignSchema = new Schema({
    "CampaignId": {type: Number, required: true},
    "EntryNo": {type: String, required: true},
    "RegistrationNo": {type: String, required: true},
    "NoClaimBonus": {type: String, required: true},
    "InsCompany": {type: String, required: true},
    "InsId": {type: Number, required: true},
    "FLData": {type: Object},
    "FLResponse": {type: Object},
    "FLStatus": {type: Number},
    "PBVehicleId": {type: Number},
    "SQRequest": {type: String},
    "SQResponse": {type: String},
    "SQStatus": {type: Number},
    "SQCount": {type: Number}
})


// the schema is useless so far
// we need to create a model using it

//campaignSchema.plugin(autoIncrement.plugin, {model: 'Campaign', field: 'CampaignId', startAt: 1});
var Campaign =  mongoose.model('Campaign', campaignSchema);

// make this available to our users in our Node applications
module.exports = Campaign;