/*
 * Author : Khushbu Gite 19-03-2020
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 *
 *
 * 
 */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
autoIncrement = require('mongoose-plugin-autoinc');
var mongoosePaginate = require('mongoose-paginate');


var offline_sale_Schema = new Schema({
    "Product": String,
    "Insurer": String,
    "Premium": Number,
    "VehicleRegNumber": String,
    "Make": String,
    "Model": String,
    "Sub_Model": String,
    "Fuel": String,
    "Insurance_Type ": String,
    "Insurance_Sub_Type ": String,
    "Previous_Insurer": String,
    "Previous_NCB": String,
    "ZD": String,
    "CPA": String,
    "erp_qt":String,
    "Date_Of_Sale":String,
    "Created_On": Date,
    "Modified_On": Date
});

// the schema is useless so far
// we need to create a model using it
offline_sale_Schema.plugin(mongoosePaginate);
offline_sale_Schema.plugin(autoIncrement.plugin, {model: 'Offline_Sale', field: 'Offline_Sale_Id', startAt: 1});
var Offline_Sale = mongoose.model('Offline_Sale', offline_sale_Schema);

// make this available to our users in our Node applications
module.exports = Offline_Sale;
