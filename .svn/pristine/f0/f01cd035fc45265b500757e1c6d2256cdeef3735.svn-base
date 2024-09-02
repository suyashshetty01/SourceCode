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
var rm_mapping_jobSchema = new Schema({
    'Camp_Name': String,
    'Channel': String,
    'Status': String, // UPLOADED , VALIDATED , REJECTED, VERIFIED , MATCHED , NOTMATCHED , SURLCREATED
    'Data_File': String,
    'File_Data_Count': Number,
    'Upload_Count': Number,
    'Session_Id': String,
    'Created_By': String,
    'Created_By_Mobile': Number,
    'Email': String,
    'Created_On': Date,
    'Modified_On': Date
});
// we need to create a model using it
rm_mapping_jobSchema.plugin(mongoosePaginate);


rm_mapping_jobSchema.plugin(autoIncrement.plugin, {model: 'Rm_Mapping_Job', field: 'Rm_Mapping_Job_Id', startAt: 1});
var Rm_Mapping_Job = mongoose.model('Rm_Mapping_Job', rm_mapping_jobSchema);

// make this available to our users in our Node applications
module.exports = Rm_Mapping_Job;