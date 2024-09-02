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
autoIncrement = require('mongoose-plugin-autoinc');
mongoose.Promise = global.Promise;

var vehicle_classSchema = new Schema({}, {strict: false});
vehicle_classSchema.plugin(autoIncrement.plugin, {model: 'Vehicle_Class', field: 'Vehicle_Class_Id', startAt: 1});
var Vehicle_Class = mongoose.model('Vehicle_Class', vehicle_classSchema);
module.exports = Vehicle_Class;