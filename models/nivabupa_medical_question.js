/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');

var nivabupa_medical_question_Schema = new Schema({
    "application_id": String,
    "CRN": Number,
    "Method_Type": String,
    "Request_Core"  : Object,
    "Response_Core"  : Object,
    "redirect_url" : String
});
nivabupa_medical_question_Schema.plugin(mongoosePaginate);
var nivabupa_medical_question = mongoose.model('nivabupa_medical_question', nivabupa_medical_question_Schema);
//console.log(nivabupa_medical_question.paginate({ page: 1, limit: 10 }));
module.exports = nivabupa_medical_question;

