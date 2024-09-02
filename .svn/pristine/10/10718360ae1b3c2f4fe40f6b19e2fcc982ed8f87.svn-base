/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');

var lms_forms_master_Schema = new Schema({
    "lms_product_id": Number,
    "lms_sub_product_id": Number,
    "field_name"  : String,
    "field_type"  : String,
    "field_label" : String,
    "custom_tag"  : Object,
    "form_category" : String
});
// the schema is useless so far
// we need to create a model using it
lms_forms_master_Schema.plugin(mongoosePaginate);
var lms_forms_master = mongoose.model('lms_forms_master', lms_forms_master_Schema);

// make this available to our users in our Node applications
module.exports = lms_forms_master;


