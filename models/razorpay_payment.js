/*
 * Author : Khushbu Gite 19-03-2020
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 *
 *
 * 
 */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
autoIncrement = require('mongoose-plugin-autoinc');
var mongoosePaginate = require('mongoose-paginate');


var razorpay_payment_Schema = new Schema({
    "Product_Id": Number,
    "Ss_Id": Number,
    "Fba_ID": Number,
    "Name": String,
    "Mobile": String,
    "Email": String,
    "Plan": Number,
    "Net_Premium": Number,
    "Total_Premium": Number,
    "Service_Tax": Number,
    "Lead_Count": Number,
    "PayId": String,
    "Transaction_Status": String,
    "Source": {type: String, default: ''},
    "Lead_From_Exp_Date":Date,
    "Lead_To_Exp_Date":Date,
    "Created_On": Date,
    "Modified_On": Date
});

// the schema is useless so far
// we need to create a model using it
razorpay_payment_Schema.plugin(mongoosePaginate);
razorpay_payment_Schema.plugin(autoIncrement.plugin, {model: 'Razorpay_Payment', field: 'Transaction_Id', startAt: 1});
var Razorpay_Payment = mongoose.model('Razorpay_Payment', razorpay_payment_Schema);

// make this available to our users in our Node applications
module.exports = Razorpay_Payment;
