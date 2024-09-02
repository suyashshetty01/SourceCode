/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');

var leaddispositions_Schema = new Schema({
    "Lead_Id":String,
    "Status" : String,
    "Sub_Status" : String,
    "Created_On" : Date,
    "Modified_On" : Date,
    "Remark" : String,
    "ss_id" : Number,
    "Is_Latest" : Number,
    "fba_id" : Number,
    "File_Name": String,
    "Lead_Status" : String,
    "Customer_Name" : String,
    "Customer_Mobile" : Number,
    "Next_Call_Date" : {type: Date},
    "Policy_Expiry_Date" : {type: Date},
    "User_Data_Id" : Number,
    "Call_Service_ID" : Number,
    "Call_Type" : String,
    "Call_Start_Time" : {type: Date},
    "Call_End_Time" :{type: Date},
    "Dialer_Request_Core" : Object
});

// the schema is useless so far
// we need to create a model using it
leaddispositions_Schema.plugin(mongoosePaginate);
var leaddisposition = mongoose.model('lead_disposition', leaddispositions_Schema);

// make this available to our users in our Node applications
module.exports = leaddisposition;


