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
var elitekotakcustomerdetails_Schema = new Schema({}, {strict: false});
var Elite_Kotak_Customer_Details = mongoose.model('elitekotakcustomerdetails', elitekotakcustomerdetails_Schema);
// make this available to our users in our Node applications
module.exports = Elite_Kotak_Customer_Details;