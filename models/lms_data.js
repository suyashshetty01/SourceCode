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

var lms_data_Schema = new Schema({
    "Product_id" : Number,
    "Product_name" : String,
    "Sub_product_id" : Number, 
    "Sub_product_name" : String,
    "Customer_name" : String,
    "Mobile_no" : Number,
    "Email" : String,
    "Created_by" : String,
    "Status" : String,
    "Basic_details" : JSON,
    "Full_details" : JSON,
    "Created_On": {type: Date}
});
// the schema is useless so far
// we need to create a model using it
lms_data_Schema.plugin(mongoosePaginate);lms_data_Schema.plugin(autoIncrement.plugin, {model: 'lms_data', field: 'Lead_Id', startAt: 1});
var lms_data = mongoose.model('lms_data', lms_data_Schema);


// make this available to our users in our Node applications
module.exports = lms_data;


