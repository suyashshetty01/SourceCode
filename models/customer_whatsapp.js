/*
 * Author : Kevin Monteiro 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var mongoosePaginate = require('mongoose-paginate');
autoIncrement = require('mongoose-plugin-autoinc');

var customer_whatsappSchema = new Schema({
    "Customer_Name": String,
    "Customer_Email": String,
    "User_Data_Id" : Number,
    "Whatsapp_No": Number,
    "Created_On" : Date,
    "Modified_On" : Date,
    "PB_CRN" : Number,
    "Mobile_No" : Number,
    "IsCustomer" : String,
    "IsAgent" : String,
    "Insurer_Id": Number,
    "Product_Id": Number,
    "ip_address" : String
});

customer_whatsappSchema.plugin(mongoosePaginate);
customer_whatsappSchema.plugin(autoIncrement.plugin, {model: 'customer_whatsapp', field: 'Customer_Id', startAt: 1});
var Customer_whatsapp = mongoose.model('customer_whatsapp', customer_whatsappSchema);

// make this available to our users in our Node applications
module.exports = Customer_whatsapp;