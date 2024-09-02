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

var pb_employeeSchema = new Schema({});

// the schema is useless so far
// we need to create a model using it
pb_employeeSchema.plugin(mongoosePaginate);
var Pb_Employee = mongoose.model('Pb_Employee', pb_employeeSchema);

// make this available to our users in our Node applications
module.exports = Pb_Employee;