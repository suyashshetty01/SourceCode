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


var sync_contact_summary_Schema = new Schema({}, {strict: false});

// the schema is useless so far
// we need to create a model using it
sync_contact_summary_Schema.plugin(mongoosePaginate);
sync_contact_summary_Schema.plugin(autoIncrement.plugin, {model: 'Sync_Contact_Summary', field: 'Sync_Contact_Summary_Id', startAt: 1});
var Sync_Contact_Summary = mongoose.model('Sync_Contact_Summary', sync_contact_summary_Schema);

// make this available to our users in our Node applications
module.exports = Sync_Contact_Summary;