/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');

var request_samples_Schema = new Schema({
    "product_id" : Number,
    "product_name" : String,
    "sub_product_id" : Number, 
    "sub_product_name" : String,
    "customer_name" : String,
    "created_by" : String,
    "status" : String,
    "basic_details" : JSON,
    "full_details" : JSON
});
// the schema is useless so far
// we need to create a model using it
request_samples_Schema.plugin(mongoosePaginate);
var request_sample = mongoose.model('request_sample', request_samples_Schema);

// make this available to our users in our Node applications
module.exports = request_sample;


