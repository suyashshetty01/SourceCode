/* Author: Roshani Prajapati
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');

var lazy_pay_logSchema = new Schema({
    "PB_CRN": Number,
    "User_Data_Id": Number,
    "Customer Name": String,
    "Customer_Mobile": Number,
    "PAN_Card": String,
    "Date_of_Birth": String,
    "Request_Page": String,
    "Status": String,
    "LazyPay_Request": Object,
    "LazyPay_Response": Object,
    "LazyPay_Request_Core": Object,
    "Created_On": Date,
    "Modified_On": Date
});

// the schema is useless so far
// we need to create a model using it
lazy_pay_logSchema.plugin(mongoosePaginate);
var lazy_pay_log = mongoose.model('lazy_pay_logs', lazy_pay_logSchema);

// make this available to our users in our Node applications
module.exports = lazy_pay_log;