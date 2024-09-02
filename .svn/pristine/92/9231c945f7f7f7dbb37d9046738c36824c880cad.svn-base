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
mongoose.Promise = global.Promise;
autoIncrement = require('mongoose-plugin-autoinc');
var mongoosePaginate = require('mongoose-paginate');


var sync_contact_erp_data_Schema = new Schema({}, {strict: false});


// the schema is useless so far
// we need to create a model using it
sync_contact_erp_data_Schema.plugin(mongoosePaginate);
sync_contact_erp_data_Schema.plugin(autoIncrement.plugin, {model: 'sync_contact_erp_data', field: 'Sync_Contact_Erp_Data_Id', startAt: 1});
var Sync_Contact_Erp_Data = mongoose.model('sync_contact_erp_data', sync_contact_erp_data_Schema);

// make this available to our users in our Node applications
module.exports = Sync_Contact_Erp_Data;
