/*
 * Author : Kevin Monteiro
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');

var travel_countries_Schema = new Schema({});
// the schema is useless so far
// we need to create a model using it
travel_countries_Schema.plugin(mongoosePaginate);
var traveling_countries = mongoose.model('travel_insurer_countries', travel_countries_Schema);

// make this available to our users in our Node applications
module.exports = traveling_countries;
