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
var config = require('config');
var mongoose = require('mongoose');
var Base = require('../libs/Base');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');
autoIncrement = require('mongoose-plugin-autoinc');

var connection = mongoose.createConnection(config.db.connection + ':27017/' + config.db.name);

//autoIncrement.initialize(connection);

var rtos_insurers_mappingSchema = new Schema({
    "Rto_ID": Number,
    "Insurer_Rto_ID": Number,
    "Insurer_ID": Number,
     "Is_Active": Number,
    "Created_On": Date,
    "Status_Id": Number,
    "Premium_Status": Number
});

// the schema is useless so far
// we need to create a model using it
rtos_insurers_mappingSchema.plugin(mongoosePaginate);
rtos_insurers_mappingSchema.plugin(autoIncrement.plugin, {model: 'Rtos_Insurer_Mapping', field: 'Insurer_Rto_Mapping_ID', startAt: 1});
var Rtos_Insurers_Mapping = mongoose.model('Rtos_Insurers_Mapping', rtos_insurers_mappingSchema);

// make this available to our users in our Node applications
module.exports = Rtos_Insurers_Mapping;