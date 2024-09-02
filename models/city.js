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

var citySchema = new Schema();
// the schema is useless so far
// we need to create a model using it
citySchema.plugin(mongoosePaginate);
var City = mongoose.model('City', citySchema);

// make this available to our users in our Node applications
module.exports = City;