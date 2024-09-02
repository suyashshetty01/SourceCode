/*
 * Author : Chirag Modi 
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


var sub_fbaSchema = new Schema({});

// the schema is useless so far
// we need to create a model using it
sub_fbaSchema.plugin(mongoosePaginate);
var Sub_Fba = mongoose.model('Sub_Fba', sub_fbaSchema);

// make this available to our users in our Node applications
module.exports = Sub_Fba;