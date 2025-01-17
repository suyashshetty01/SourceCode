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
var rzp_wallet_historySchema = new Schema({
    'Transaction_Id': Number,
    'PB_CRN': Number,
    'User_Data_Id': Number,
    'Service_Log_Id': Number,
    'rzp_customer_id': String,
    'rzp_payment_id': String,
    'rzp_transfer_id': String,
    'transaction_type': String,
    'transaction_amount': Number,
    'rzp_payment_request': Object,
    'rzp_payment_response': Object,
    'return_url': String,
    'Created_On': Date,
    'Status': String,
    'Channel': String
});
// we need to create a model using it
rzp_wallet_historySchema.plugin(mongoosePaginate);


rzp_wallet_historySchema.plugin(autoIncrement.plugin, {model: 'rzp_wallet_history', field: 'Transaction_Id', startAt: 1});
var Rzp_Wallet_History = mongoose.model('Rzp_Wallet_History', rzp_wallet_historySchema);

// make this available to our users in our Node applications
module.exports = Rzp_Wallet_History;