/*
 * Author : Manish Anand 
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
var mongoosePaginate = require('mongoose-paginate');

var discount_requestSchema = new Schema({
    "PB_CRN" : Number,
    "Request_Unique_Id" : String,
    "Insurer_Id": Number,
    "Original_Discount": Number,
    "Desired_Discount": Number,
	"Reference" : String,
	"Requested_By": Number,
	"Created_On":Date,
	"Modified_On":Date
});
// the schema is useless so far
// we need to create a model using it
discount_requestSchema.pre('save', function (next) {
    // get the current date
    var currentDate = new Date();
	this._doc.Created_On = currentDate;
	this._doc.Modified_On = currentDate;
    next();
});

discount_requestSchema.plugin(mongoosePaginate);
var Discount_Request = mongoose.model('Discount_Request', discount_requestSchema);

// make this available to our users in our Node applications
module.exports = Discount_Request;