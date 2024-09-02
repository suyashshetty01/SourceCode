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

var service_log_errorSchema = new Schema({
    "Service_Log_Id": Number,
    "Service_Log_Unique_Id": String,
    "Request_Id": Number,
    "Request_Unique_Id": String,
    "LM_CRN": Number,
    "Client_Id": Number,
    "LM_Custom_Request": Object,
    "Insurer_Request": String,
    "Insurer_Response": Object,
    "Insurer_Response_Core": String,
    "Premium_Breakup": Object,
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
    "Created_On": Date,
    "Product_Id": Number,
    "Insurer_Id": Number,
    "Plan_Id": Number,
    "Plan_Name": String,
    "Method_Type": String,
    "Call_Execution_Time": Number,
    "Error": Object
},{collection: 'service_logs'});
service_log_errorSchema.pre('save', function (next) {
});
// the schema is useless so far
// we need to create a model using it
service_log_errorSchema.plugin(mongoosePaginate);
//service_logSchema.plugin(autoIncrement.plugin, {model: 'Client', field: 'Client_Id', startAt: 1});
var Service_Log_Error = mongoose.model('Service_Log', service_log_errorSchema);
// make this available to our users in our Node applications
module.exports = Service_Log_Error;