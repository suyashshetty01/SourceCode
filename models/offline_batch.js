/* Author : Dipali Revanwar
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;
autoIncrement = require('mongoose-plugin-autoinc');
mongoose.Promise = global.Promise;
var offline_batchSchema = new Schema({
    'Start_Date': Date,
    'End_Date': Date,
    'Service_Type': String,
    'Data_Count': Number,
    'Service_Excecution_Time': String,
    'Execustion_Status': String,
    'Created_On': Date,
    'Modefied_On': Date
});
// we need to create a model using it
offline_batchSchema.plugin(mongoosePaginate);


offline_batchSchema.plugin(autoIncrement.plugin, {model: 'offline_batch', field: 'Batch_Id', startAt: 1});
var offline_batch = mongoose.model('offline_batch', offline_batchSchema);

// make this available to our users in our Node applications
module.exports = offline_batch;