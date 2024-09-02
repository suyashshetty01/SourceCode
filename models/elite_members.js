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

var elite_memberSchema = new Schema({
    'Member_Name': String,
    'Member_Email': String,
    'Member_Mobile': String,
    'Certificate_Id': String,
    'CRN': String,
    'Created_On': Date
});

// the schema is useless so far
// we need to create a model using it
var Elite_Member = mongoose.model('Elite_Member', elite_memberSchema);

// make this available to our users in our Node applications
module.exports = Elite_Member;