/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');

var disposition_historySchema = new Schema({
    "UDID" : Number,
    "PB_CRN" : Number,
    "Status" : String,
    "SubStatus" : String,
    "Created_On" : Date,
    "Modified_On" : Date,
    "Remark" : String,
    "ss_id" : Number,
    "IsLatest" : Number,
    "fba_id" : Number,
    "User_Data": Object,
    "File_Name": String,
    "Customer_Name": String,
    "Customer_Mobile": Number,
    "Policy_Expiry_Date": Date,
    "Next_Call_Date": Date,
    "Sync_Contact_Erp_Data_Id": Number,
    "Lead_Status": String
});
// the schema is useless so far
// we need to create a model using it
disposition_historySchema.plugin(mongoosePaginate);
var disposition_history = mongoose.model('disposition_history', disposition_historySchema);

// make this available to our users in our Node applications
module.exports = disposition_history;