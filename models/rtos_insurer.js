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


var rtos_insurerSchema = new Schema();

// the schema is useless so far
// we need to create a model using it
rtos_insurerSchema.plugin(mongoosePaginate);
var Rtos_Insurer = mongoose.model('Rtos_Insurer', rtos_insurerSchema);

// make this available to our users in our Node applications
module.exports = Rtos_Insurer;