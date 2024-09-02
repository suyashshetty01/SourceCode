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
var mongoosePaginate = require('mongoose-paginate');
mongoose.Promise = global.Promise;

var sync_contactSchema = new Schema({}, {strict: false});
sync_contactSchema.plugin(mongoosePaginate);
sync_contactSchema.plugin(autoIncrement.plugin, {model: 'Sync_Contact', field: 'Sync_Contact_Id', startAt: 1766317});
var Sync_Contact = mongoose.model('Sync_Contact', sync_contactSchema);
module.exports = Sync_Contact;