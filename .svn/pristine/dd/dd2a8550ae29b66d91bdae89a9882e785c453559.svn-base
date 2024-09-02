/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');

var dispositions_Schema = new Schema({
    "User_Data_Id" : Number,
    "PB_CRN" : Number,
    "Status" : String,
    "Sub_Status" : String,
    "Created_On" : Date,
    "Modified_On" : Date,
    "Remark" : String,
    "ss_id" : Number,
    "Is_Latest" : Number,
    "fba_id" : Number,
    "User_Data": Object,
    "File_Name": String,
    "Lead_Phone1":Number,
    "Lead_Phone2":Number,
    "Customer_Name":String,
    "Call_Start_Time":String, 
    "Call_End_Time":String,
    "Lead_First_Dial_Time":String,
    "Lead_Call_Back_Time":String,
    "UID":Number,
    "Lead_Id":String,
    "Service_Id":String,
    "Service_Name":String,
    "Call_Type":String,
    "Campaing_Name":String,
    "Customer_Mobile": Number,
    "Policy_Expiry_Date": Date,
    "Next_Call_Date": Date,
    "Sync_Contact_Erp_Data_Id": Number,
    "Lead_Status" : String
});

// the schema is useless so far
// we need to create a model using it
dispositions_Schema.plugin(mongoosePaginate);
var disposition = mongoose.model('disposition', dispositions_Schema);

// make this available to our users in our Node applications
module.exports = disposition;


