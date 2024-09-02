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
var wallet_transaction_historySchema = new Schema({
    'wallet_transaction_detail_id': Number,
    'SS_ID': Number,
    'rzp_customer_id': String,
    'wallet_account_no': Number,
    'transaction_type': String,
    'transaction_amount': Number,
    'transaction_date': Date,
    'rzp_loading_request': Object,
    'rzp_loading_response': Object
});
// we need to create a model using it
wallet_transaction_historySchema.plugin(mongoosePaginate);


wallet_transaction_historySchema.plugin(autoIncrement.plugin, {model: 'Wallet_Transaction_History', field: 'Dailer_Lead_Push_Id', startAt: 1});
var Wallet_Transaction_History = mongoose.model('Wallet_Transaction_History', wallet_transaction_historySchema);

// make this available to our users in our Node applications
module.exports = Wallet_Transaction_History;