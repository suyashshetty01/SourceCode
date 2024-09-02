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
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var icici_tokenSchema = new Schema({
    'Token': String,
    'Product_Id': Number,
    'Created_On': Date
});

// the schema is useless so far
// we need to create a model using it
var Icici_Token = mongoose.model('Icici_Token', icici_tokenSchema);

// make this available to our users in our Node applications
module.exports = Icici_Token;