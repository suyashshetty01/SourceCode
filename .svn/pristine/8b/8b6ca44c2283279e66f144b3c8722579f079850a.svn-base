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


var prev_insurerSchema = new Schema();

// the schema is useless so far
// we need to create a model using it
prev_insurerSchema.plugin(mongoosePaginate);
var Prev_Insurer = mongoose.model('Prev_Insurer', prev_insurerSchema);

// make this available to our users in our Node applications
module.exports = Prev_Insurer;