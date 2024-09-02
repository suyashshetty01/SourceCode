/*
 * Author : Revati Ghadge 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var config = require('config');
var Schema = mongoose.Schema;
autoIncrement = require('mongoose-plugin-autoinc');
mongoose.Promise = global.Promise;
var connection = mongoose.createConnection(config.db.connection + ':27017/' + config.db.name);
var linkSchema = new Schema({
    'Product_Id': Number,
    'Insurer_Id': Number,
    'PB_CRN': Number,
    'User_Data_Id': Number,
    'Service_Log_Id': Number,
    'Payment_Request': Object,
    'Premium_Request': Object,
    'Premium': Number,
    'Expiry_Date': String,
    'Link_Validity_Date': String,
    'Reminder': Number,
    'Mode': String,
    'Reminder_History': [{}],
    'Status': String,
    'Created_On': Date,
    'Modified_On': Date
});
// we need to create a model using it
linkSchema.plugin(mongoosePaginate);


linkSchema.plugin(autoIncrement.plugin, {model: 'Link', field: 'Link_Id', startAt: 1});
var Link = mongoose.model('Link', linkSchema);

// make this available to our users in our Node applications
module.exports = Link;