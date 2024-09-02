/*
 * Author : Chirag Modi 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 *
 *
 * 
 */

// grab the things we need
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
autoIncrement = require('mongoose-plugin-autoinc');

var payout_schema = new Schema({
    "PB_CRN": Number,
    "Product_Id": Number,
    "User_Data_Id": Number,
    "Insurer_Id": Number,
    "Created_On": Date,
    "Request": Object,
    "Response": Object,
    "Status" : String,
    "Point" : Number,
    "Insurance_Company": String,
    "Rto": String,
    "YearOfMake": Number,
    "Vehicle_Cc": Number,
    "Tarriff": Number,
    "Make_Model": String,
    "Fuel_Type": String,
    "Policy_Type": String,
    "Product_Name": String,
    "Product_Sub_Type": String,
    "Odpremium": Number,
    "Addonpremium": Number,
    "Tppremium": Number,
    "Call_At": String
});

// the schema is useless so far
// we need to create a model using it
payout_schema.plugin(mongoosePaginate);
payout_schema.plugin(autoIncrement.plugin, {model: 'payouts', field: 'Payout_Id', startAt: 1});
var payouts = mongoose.model('payouts', payout_schema);

// make this available to our users in our Node applications
module.exports = payouts;
