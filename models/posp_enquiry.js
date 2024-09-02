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


var posp_enquiry_Schema = new Schema({
    "name": String,
    "mobile": String,
    "email": String,
    "city_name": String,
    "city_id": Number,
    "state": String,
    "Status": String,
    "Created_On": Date,
    "Modified_On": Date,
    "pan": String,
    "aadhaar": Number,
    "Source": String,
    "Campgin_Id": Number
});

// the schema is useless so far
// we need to create a model using it
posp_enquiry_Schema.plugin(mongoosePaginate);
posp_enquiry_Schema.plugin(autoIncrement.plugin, {model: 'Posp_Enquiry', field: 'Posp_Enquiry_Id', startAt: 1});
var Posp_Enquiry = mongoose.model('Posp_Enquiry', posp_enquiry_Schema);

// make this available to our users in our Node applications
module.exports = Posp_Enquiry;