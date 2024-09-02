/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');

var sub_product_types_Schema = new Schema({
    "Sub_Product_Id" : String,
    "Sub_Product_Name" : String,
    "Product_Id" : Number,  
    "Status" : String
});
// the schema is useless so far
// we need to create a model using it
sub_product_types_Schema.plugin(mongoosePaginate);
var lms_sub_product_type = mongoose.model('corp_sub_product', sub_product_types_Schema);

// make this available to our users in our Node applications
module.exports = lms_sub_product_type;


