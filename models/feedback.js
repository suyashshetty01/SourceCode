/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

//
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;
autoIncrement = require('mongoose-plugin-autoinc');
mongoose.Promise = global.Promise;

var feedback_Schema = new Schema({
    "FeedId": String,
    "FeedbackId":String,
    "Name" :String,
    "Email":String,
    "Mobile":Number,
    "Policy_No": Number,
    "Message":String,
    "Service_Id":String,
    "Category_Type":String,
    "Nature_Of_Feedback_Complain":String,
    "Service_Claim_Type":String,
    "Created_On": Date,
    "Modified_On": Date    
});

feedback_Schema.plugin(mongoosePaginate);
feedback_Schema.plugin(autoIncrement.plugin, {model: 'feedback_Schema', field: 'FeedId', prefix:'MUM-', suffix:'-C', startAt: 1000});
//feedback_Schema.plugin(autoIncrement.plugin, {model: 'feedback_Schema', field: 'FeedbackId', 'prefix':'MUM-', 'suffix':'-C', startAt: 1000});
var feedback_ = mongoose.model("feedback",feedback_Schema);
module.exports =  feedback_;
