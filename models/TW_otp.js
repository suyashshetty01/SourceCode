/* Ravi
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var otp_schema = new Schema({
    "mobile_number": Number,
    "otp": String,
    "created_on":Date,
    "status":Number
});
var otp_ = mongoose.model("otp_tw", otp_schema);

module.exports = otp_;

