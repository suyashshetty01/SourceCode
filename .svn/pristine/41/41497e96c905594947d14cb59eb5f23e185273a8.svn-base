/*
 * Author : Kevin Monteiro
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

var highway_delites_Schema = new Schema({
    "hd_customer_name": String,
    "hd_mobile": Number,
    "hd_email": String,
    "hd_registration_no":String,
    "query_string":String,
    "Created_On": Date,
    "Modified_On": Date
});
// the schema is useless so far
// we need to create a model using it
highway_delites_Schema.plugin(mongoosePaginate);
highway_delites_Schema.plugin(autoIncrement.plugin, {model: 'highway_delite', field: 'highway_delite_Id', startAt: 1});
var highway_delites = mongoose.model('highway_delites', highway_delites_Schema);

// make this available to our users in our Node applications
module.exports = highway_delites;


