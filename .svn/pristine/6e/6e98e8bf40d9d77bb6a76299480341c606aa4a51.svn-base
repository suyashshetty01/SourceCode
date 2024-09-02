/* Author : Revati Ghadge 
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
var wallet_transactionSchema = new Schema({
    'Transaction_Id': Number,
    'PB_CRN': Number,
    'User_Data_Id': Number,
    'Service_Log_Id': Number,
    'Premium': Number,
    'Payu_Request': Object,
    'Payu_Response': Object,
    'Payu_Status': String,
    'Payu_Requested_On': Date,
    'Created_On': Date,
    'Status': String
});
// we need to create a model using it
wallet_transactionSchema.plugin(mongoosePaginate);


wallet_transactionSchema.plugin(autoIncrement.plugin, {model: 'Wallet_Transaction', field: 'Transaction_Id', startAt: 1});
var Wallet_Transaction = mongoose.model('Wallet_Transaction', wallet_transactionSchema);

// make this available to our users in our Node applications
module.exports = Wallet_Transaction;