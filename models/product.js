/*
 * Author : Chirag Modi 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var productSchema = new Schema({});
productSchema.plugin(mongoosePaginate);
var Product = mongoose.model('Product', productSchema);
// make this available to our users in our Node applications
module.exports = Product;