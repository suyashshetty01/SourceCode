/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');

var fos_Schema = new Schema({
    'Full_Name': String,
    'Mobile': Number,
    'Email': String,
    'Pan': String,
    'Aadhar': Number,
    'Gst': String,
    'Address_1': String,
    'Address_2': String,
    'Address_3': String,
    'Pincode': Number,
    'City': String,
    'State': String,
    'Account_No': Number,
    "IFSC_Code" : String,
    "MICR_Code" : Number,
    "Bank_Name" : String,
    "Branch" : String,
    "Bank_City" : String,
    "Account_Type" : String,
    "Pan_Card" : Object,
    "Aadhar_Card_Front" : Object,
    "Aadhar_Card_Back" : Object,
    "Cancelled_Chq" : Object,
    "Gst_Certification" : Object,
    "ss_id" : Number,
    "last_status" : String,
    "level" : String,
    "status" : String
});
// the schema is useless so far
// we need to create a model using it
fos_Schema.plugin(mongoosePaginate);
var fos_onboarding = mongoose.model('fos_onboarding', fos_Schema);

// make this available to our users in our Node applications
module.exports = fos_onboarding;