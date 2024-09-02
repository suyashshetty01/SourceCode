/*
 * Author : Revati Ghadge 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var erp_regionSchema = new Schema({
    'Wrong Region': String,
    'Correct Region': String
});
// the schema is useless so far
// we need to create a model using it
var Erp_Region = mongoose.model('Erp_Region', erp_regionSchema);

// make this available to our users in our Node applications
module.exports = Erp_Region;