/*
 * Author : Revati Ghadge 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;
autoIncrement = require('mongoose-plugin-autoinc');
mongoose.Promise = global.Promise;
var health_cq_Schema = new Schema({
    'PB_CRN': Number,
    'UDID': Number,
    'Visited_Count': Number,
    'Is_Visited': Boolean,
    'Short_Code_Id': String,
    'Short_Url': String,
    'Raw_Data': Object,
    'Quote_Url': String,
    'Created_On': Date,
    'Modified_On': Date
});
// we need to create a model using it
health_cq_Schema.plugin(mongoosePaginate);


health_cq_Schema.plugin(autoIncrement.plugin, {model: 'health_campaign', field: 'Health_Campaign_Id', startAt: 1});
var health_campaign = mongoose.model('health_campaign', health_cq_Schema);

// make this available to our users in our Node applications
module.exports = health_campaign;