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
var offline_transactionSchema = new Schema({
    'Batch_Id': Number,
    'ss_id': Number,
    'Product_Id': Number,
    'Product_Name': String,
    'Insurer_Id': Number,
    'Created_On': Date,
    'Modefied_On': Date,
    'AgentID': Number,
    'AgentName': String,
    'BusinessClass': String,
    'Category': String,
    'EntryType': String,
    'Error': String,
    'FinalPremium': Number,
    'ID': Number,
    'InsCompanyName': String,
    'Mode': String,
    'NetPremium': Number,
    'ProductName': String,
    'ServiceTax': Number,
    'SumAssured': Number,
    'UID': Number,
    'inceptionDate': String
});
// we need to create a model using it
offline_transactionSchema.plugin(mongoosePaginate);


offline_transactionSchema.plugin(autoIncrement.plugin, {model: 'offline_transaction', field: 'Transaction_Id', startAt: 1});
var offline_transaction = mongoose.model('offline_transaction', offline_transactionSchema);

// make this available to our users in our Node applications
module.exports = offline_transaction;