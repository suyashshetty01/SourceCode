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


/*
 * 
 * {    
 "Service_Log_Unique_Id" : String,
 "Request_Id" : Number,
 "Request_Unique_Id" : String,
 "LM_CRN" : String,
 "Client_Id" : Number,
 "LM_Custom_Request" : Object,
 "Status" : String,
 "Error_Code" : String,
 "Is_Active" : Number,
 "Created_On" : Date,
 "Product_Id" : Number,
 "Insurer_Id" : Number,
 "Method_Type" : String,
 "Call_Execution_Time" : Number
 if (method_type === 'Customer') {
 Object.assign(docLogModify, {'Customer': objProductResponse.Customer});
 }
 if (method_type === 'Proposal') {
 Object.assign(docLogModify, {'Payment': objProductResponse.Payment});
 }
 if (method_type === 'Verification' || method_type === 'Pdf') {
 Object.assign(docLogModify, {'Policy': objProductResponse.Policy});
 }
 if (method_type === 'Coverage') {
 Object.assign(docLogModify, {'Coverage': objProductResponse.Coverage});
 }
 }
 */


var service_logSchema = new Schema({
    "Service_Log_Id": Number,
    "Service_Log_Unique_Id": String,
    "Request_Id": Number,
    "Request_Unique_Id": String,
    "User_Data_Id": Number, //
    "PB_CRN": Number,
    "Client_Id": Number,
    "LM_Custom_Request": Object,
    "Insurer_Request": String, //
    "Insurer_Response": Object, //
    "Insurer_Response_Core": String, //
    "Premium_Breakup": Object, //
    "Premium_Rate": Object,
    "Payment": Object,
    "Policy": Object,
    "Coverage": Object,
    "Customer": Object,
    "LM_Response": String,
    "Insurer_Transaction_Identifier": String,
    "Status": String,
    "Error_Code": String,
    "Is_Active": Number,
    "Created_On": Date, //
    "Product_Id": Number,
    "Insurer_Id": Number,
    "Plan_Id": Number,
    "Plan_Name": String,
    "Method_Type": String,
    "Call_Execution_Time": Number, //
    "Error": Object,
    "Error_Details": Object,
    "Addon_Mode": String
});
service_logSchema.pre('save', function (next) {
});
// the schema is useless so far
// we need to create a model using it
service_logSchema.plugin(mongoosePaginate);
//service_logSchema.plugin(autoIncrement.plugin, {model: 'Client', field: 'Client_Id', startAt: 1});
var Service_Log = mongoose.model('Service_Log', service_logSchema);
// make this available to our users in our Node applications
module.exports = Service_Log;