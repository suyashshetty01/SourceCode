/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');

var lms_sub_product_types_Schema = new Schema({
    "lm_sub_product_id" : Number,
    "lm_sub_product_name" : String,
    "lm_product_id" : Number,  
    "status" : String
});
// the schema is useless so far
// we need to create a model using it
lms_sub_product_types_Schema.plugin(mongoosePaginate);
var lms_sub_product_type = mongoose.model('lms_sub_product_type', lms_sub_product_types_Schema);

// make this available to our users in our Node applications
module.exports = lms_sub_product_type;

