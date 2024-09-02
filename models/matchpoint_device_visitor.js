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
var mongoosePaginate = require('mongoose-paginate');
mongoose.Promise = global.Promise;
autoIncrement = require('mongoose-plugin-autoinc');


var matchpoint_device_vistor_Schema = new Schema({}, {strict: false});

// the schema is useless so far
// we need to create a model using it
matchpoint_device_vistor_Schema.plugin(mongoosePaginate);
matchpoint_device_vistor_Schema.plugin(autoIncrement.plugin, {model: 'Matchpoint_Device_Vistor', field: 'Matchpoint_Device_Vistor_Id', startAt: 1});
var Matchpoint_Device_Vistor = mongoose.model('Matchpoint_Device_Vistor', matchpoint_device_vistor_Schema);

// make this available to our users in our Node applications
module.exports = Matchpoint_Device_Vistor;