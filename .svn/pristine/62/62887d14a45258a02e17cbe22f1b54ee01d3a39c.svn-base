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
var fresh_quote_jobSchema = new Schema({
    'Camp_Name': String,
    'Status': String, // UPLOADED , VALIDATED , REJECTED, VERIFIED , MATCHED , NOTMATCHED , SURLCREATED
    'Data_File': String,
    'Quote_File': String,
    'File_Data_Count': Number,
    'Validation_Summary': Object,
    'Upload_Count': Number,
    'Process_Count': Number,
    'Quote_Summary': Object,
    'Vehicle_Matched_Count': Number,
    'Quote_Found_Count': Number,
    'Created_On': Date,
    'Modified_On': Date
});
// we need to create a model using it
fresh_quote_jobSchema.plugin(mongoosePaginate);


fresh_quote_jobSchema.plugin(autoIncrement.plugin, {model: 'Fresh_Quote_Job', field: 'Fresh_Quote_Job_Id', startAt: 1});
var Fresh_Quote_Job = mongoose.model('Fresh_Quote_Job', fresh_quote_jobSchema);

// make this available to our users in our Node applications
module.exports = Fresh_Quote_Job;