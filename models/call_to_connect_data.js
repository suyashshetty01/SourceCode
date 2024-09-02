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


var call_to_connect_Schema = new Schema({}, {strict: false});

// the schema is useless so far
// we need to create a model using it
call_to_connect_Schema.plugin(mongoosePaginate);
call_to_connect_Schema.plugin(autoIncrement.plugin, {model: 'Call_To_Connect', field: 'Call_To_Connect_Id', startAt: 1});
var Call_To_Connect = mongoose.model('Call_To_Connect', call_to_connect_Schema);

// make this available to our users in our Node applications
module.exports = Call_To_Connect;