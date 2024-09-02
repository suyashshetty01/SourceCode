/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
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

var vehicles_insurers_mappingSchema = new Schema({
    "Insurer_ID": Number,
    "Insurer_Vehicle_ID": Number,
    "Vehicle_ID": Number,
    "Is_Active": Number,
    "Created_On": Date,
    "Status_Id": Number,
    "Premium_Status": Number
});
// the schema is useless so far
// we need to create a model using it
vehicles_insurers_mappingSchema.plugin(mongoosePaginate);
vehicles_insurers_mappingSchema.plugin(autoIncrement.plugin, {model: 'Vehicles_Insurer_Mapping', field: 'Insurer_Vehicle_Mapping_ID', startAt: 1});
var Vehicles_Insurers_Mapping = connection.model('Vehicles_Insurers_Mapping', vehicles_insurers_mappingSchema);
// make this available to our users in our Node applications
module.exports = Vehicles_Insurers_Mapping;