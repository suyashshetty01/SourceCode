/*
 * Author : Khushbu Gite 
 * Date: 03-06-2019 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
autoIncrement = require('mongoose-plugin-autoinc');
var mongoosePaginate = require('mongoose-paginate');

var customer_information_Schema = new Schema({
    "Customer_Info_Id":Number,
    "inputInfo": String,
    "authenticateInputInfo":String,
    "fm_request":Object,
    "Created_On": {type: Date},
    "Modified_On": {type: Date}
});
// the schema is useless so far
// we need to create a model using it
customer_information_Schema.plugin(mongoosePaginate);
customer_information_Schema.plugin(autoIncrement.plugin, {model: 'Customer_Information', field: 'Customer_Info_Id', startAt: 9000410});
var customer_informations = mongoose.model('Customer_Information', customer_information_Schema);

// make this available to our users in our Node applications
module.exports = customer_informations;
