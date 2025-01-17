/*
 * Author : Khushbu Gite 
 * Date: 21-08-2019 
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
    "Proposal_Error_Msg" :String,
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
    "UploadFiles" : Object,
    "Ticket_Code" : String,
    "Agent_Email_Id" : String,
    "Transaction_On" : Date,
    "Source" : String,
    "RM_Email_Id" :String,
    "RM_Agent_Name" :String,
    "Agent_Name" : String,
    "Pincode" :Number,
    "Insurer_Id": Number
});

// the schema is useless so far
// we need to create a model using it
ticket_Schema.plugin(mongoosePaginate);
var ticket = mongoose.model('ticket', ticket_Schema);

// make this available to our users in our Node applications
module.exports = ticket;
