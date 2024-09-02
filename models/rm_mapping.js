/*
 * Author : Revati Ghadge 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var config = require('config');
var Schema = mongoose.Schema;
autoIncrement = require('mongoose-plugin-autoinc');
mongoose.Promise = global.Promise;
var connection = mongoose.createConnection(config.db.connection + ':27017/' + config.db.name);
var rm_mappingSchema = new Schema({
    'Rm_Mapping_Job_Id': Number,
    'Camp_Name': String,
    'Channel': String,
    'agent_name': String,
    'agent_email': String,
    'agent_city': String,
    'ss_id': Number,
    'fba_id': Number,
    'current_rm_uid': Number,
    'current_rm_name': String,
    'new_rm_uid': Number,
    'new_rm_name': String,
    'new_rm_mobile': Number,
    'new_rm_email': String,
    'remark': String,
    'Created_By': String,
    'session_id': String,
    'Created_On': Date,
    'Modified_On': Date
});
// we need to create a model using it
rm_mappingSchema.plugin(mongoosePaginate);


rm_mappingSchema.plugin(autoIncrement.plugin, {model: 'Rm_Mapping', field: 'Rm_Mapping_Id', startAt: 1});
var Rm_Mapping = mongoose.model('Rm_Mapping', rm_mappingSchema);

// make this available to our users in our Node applications
module.exports = Rm_Mapping;