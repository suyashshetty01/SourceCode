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
var mongoosePaginate = require('mongoose-paginate');

var ticket_Schema = new Schema({
    "Ticket_Id" : String,
    "Product" : Number,
    "Category" : String,
    "SubCategory" : String,
    "From" : String,
    "To" : String,
    "Status" :  String,
    "Created_By" : String,
    "Modified_By" : Number,
    "Created_On" : Date,
    "Modified_On" : Date,
    "Remark" : String,
    "Vehicle_No" : String,
    "CRN" : Number,
    "Mobile_No" :String,
    "ss_id" : Number,
    "SubCategory_level2" : String,
    "CRN_owner" : String,
    "IsActive" : Number,
    "fba_id" : Number,
    "CRN_fba_id" : Number,
    "channel" : String,
    "subchannel" : String,
    "Modified_By_Name" : String
});

// the schema is useless so far
// we need to create a model using it
ticket_Schema.plugin(mongoosePaginate);
var tickets = mongoose.model('tickets', ticket_Schema);

// make this available to our users in our Node applications
module.exports = tickets;
