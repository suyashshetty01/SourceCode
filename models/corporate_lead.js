/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');
autoIncrement = require('mongoose-plugin-autoinc');

var corp_data_Schema = new Schema({
    "Corp_Product_Id" : Number,
    "Corp_Product_Name" : String,
    "Corp_Sub_Product_Id" : String, 
    "Corp_Sub_Product_Name" : String,
    "Customer_name" : String,
    "Mobile_no" : Number,
    "Email" : String,
    "Created_By" : String,
    "Status" : String,
    "Lead_Request" : JSON,
    "Source" : String,
    "Created_On": {type: Date},
    "Modified_On": {type: Date}
});
// the schema is useless so far
// we need to create a model using it
corp_data_Schema.plugin(mongoosePaginate);corp_data_Schema.plugin(autoIncrement.plugin, {model: 'Corporate_Leads', field: 'Corporate_Lead_Id', startAt: 1});
var corp_data = mongoose.model('Corporate_Leads', corp_data_Schema);


// make this available to our users in our Node applications
module.exports = corp_data;


