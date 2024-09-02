/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');

var otps_Schema = new Schema({
    "Mobile_Number": Number,
    "Email_Id": String,
    "otp": String,
    "Created_On": Date,
    "Modified_On": Date,
    "Status": Number,
    "Source": String
});
// the schema is useless so far
// we need to create a model using it
otps_Schema.plugin(mongoosePaginate);
var otp = mongoose.model('otp', otps_Schema);

// make this available to our users in our Node applications
module.exports = otp;