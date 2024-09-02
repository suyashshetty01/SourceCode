/*
 * Author : Manish Anand 
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
var mongoosePaginate = require('mongoose-paginate');

var fg_discountSchema = new Schema({});
// the schema is useless so far

fg_discountSchema.plugin(mongoosePaginate);
var Fg_Discount = mongoose.model('Fg_Discount', fg_discountSchema);

// make this available to our users in our Node applications
module.exports = Fg_Discount;