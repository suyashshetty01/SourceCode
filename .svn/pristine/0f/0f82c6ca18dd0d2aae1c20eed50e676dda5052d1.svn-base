/*
 * Author : Khushbu Gite 19-03-2020
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
autoIncrement = require('mongoose-plugin-autoinc');
var mongoosePaginate = require('mongoose-paginate');


var product_share_Schema = new Schema({ 
    "ss_id":Number,
    "fba_id":Number,
    "sub_fba_id" : Number,
    "product_id" :Number,
    "URL"  : String,
    "Share_Count" : Number,
    "Created_On":Date,
    "Modified_On":Date
});

// the schema is useless so far
// we need to create a model using it
product_share_Schema.plugin(mongoosePaginate);
product_share_Schema.plugin(autoIncrement.plugin, {model: 'Product_Share', field: 'Product_Share_Id', startAt: 150});
var Product_Share = mongoose.model('Product_Share', product_share_Schema);

// make this available to our users in our Node applications
module.exports = Product_Share;

