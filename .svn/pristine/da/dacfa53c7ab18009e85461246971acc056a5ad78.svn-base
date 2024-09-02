/* Author: Roshani Prajapati
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
autoIncrement = require('mongoose-plugin-autoinc');
var mongoosePaginate = require('mongoose-paginate');

var corp_leads_historySchema = new Schema({
    "Contact_Name": String,
    "Mobile_No": Number,
    "Email_Id": String,
    "Product": String,
    "Message": String,
    "IP_Address" : String,
    "Created_On": Date,
    "Search_Parameter" : Object
});

corp_leads_historySchema.plugin(mongoosePaginate);
corp_leads_historySchema.plugin(autoIncrement.plugin, {model: 'corp_lead', field: 'Corp_Id', startAt: 1});
var corp_leads = mongoose.model('corp_leads', corp_leads_historySchema);
module.exports = corp_leads;