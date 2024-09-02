/*
 * Author : Chirag Modi 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');

var hdfcergo_breakin_Schema = new Schema({
    "PB_CRN" : Number,
    "UD_Id" : Number,
    "SL_Id" : Number,
    "Request_Unique_Id" : String,
    "Service_Log_Unique_Id" : String,
    "Agent_Code" : String,
    "Proposal_Number" : String,
    "Status" : String,
    "Created_On" : Date,
    "Modified_On" : Date
});
// the schema is useless so far
// we need to create a model using it
hdfcergo_breakin_Schema.plugin(mongoosePaginate);
var Hdfcergo_breakins = mongoose.model('hdfcergo_breakins', hdfcergo_breakin_Schema);

// make this available to our users in our Node applications
module.exports = Hdfcergo_breakins;