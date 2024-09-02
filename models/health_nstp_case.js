/* Author : Revati Ghadge
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');

var health_nstp_Schema = new Schema({
    "PB_CRN": Number,
    "UDID": Number,
    "Request_Unique_Id": String,
    "Service_Log_Unique_Id": String,
    "Customer_Email": String,
    "Inspection_Id": String,
    "Proposal_Number": String,
    "Original_Premium": String,
    "Revised_Premium": String,
    "Insurer_Id": Number,
    "Status": String,
    "Last_Status": String,
    "Insurer_UW_Response": String,
    "Policy_Number": String,
    "Created_On": Date,
    "Modified_On": Date
});
// the schema is useless so far
// we need to create a model using it
health_nstp_Schema.plugin(mongoosePaginate);
var health_nstp_cases = mongoose.model('health_nstp_cases', health_nstp_Schema);

// make this available to our users in our Node applications
module.exports = health_nstp_cases;