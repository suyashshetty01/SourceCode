/* Piyush
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
autoIncrement = require('mongoose-plugin-autoinc');
var mongoosePaginate = require('mongoose-paginate');

var onboarding_transaction_Schema = new Schema({
    "User_Id":Number,
    "Name": String,
    "Mobile": String,
    "Email": String,
    "Amount": Number,
    "PayId": String,
    "Transaction_Status": String,
    "Payment_Request" : Object,
    "Payment_Response" : Object,
    "Created_On": Date,
    "Modified_On": Date
});

// the schema is useless so far
// we need to create a model using it
onboarding_transaction_Schema.plugin(mongoosePaginate);
onboarding_transaction_Schema.plugin(autoIncrement.plugin, {model: 'onboarding_transaction_history', field: 'Transaction_Id', startAt: 1});
var onboarding_transaction_history = mongoose.model('onboarding_transaction_history', onboarding_transaction_Schema);

// make this available to our users in our Node applications
module.exports = onboarding_transaction_history;

