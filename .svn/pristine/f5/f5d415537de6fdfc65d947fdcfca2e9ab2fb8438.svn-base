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
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');


var userSchema = new Schema({
    "UID": Number,
    "Employee_Name": String,
    "Company": String,
    "Designation": String,
    "Dept_Short_Name": String,
    "Dept_Segment": String,
    "Direct_Reporting_UID": Number,
    "Branch": String,
    "Ss_Id": Number,
	"Phone":Number,
	"Email":String,
	"Official_Email":String,	
    "DOJ": String
});

// the schema is useless so far
// we need to create a model using it
userSchema.plugin(mongoosePaginate);
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;