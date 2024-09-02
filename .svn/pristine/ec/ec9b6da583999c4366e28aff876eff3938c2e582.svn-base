/* Author : Roshani Prajapati 
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
var wallet_payment_updateSchema = new Schema({
   "SS_ID" : Number,
   "Customer_Id" : String,
   "Old_Amount" : Number,
   "New_Amount" : Number,
   "Created_On" : Date,
   "Modified_On" : Date
});
// we need to create a model using it
wallet_payment_updateSchema.plugin(mongoosePaginate);

wallet_payment_updateSchema.plugin(autoIncrement.plugin, {model: 'wallet_payment_update', field: 'Wallet_Id', startAt: 1});
var wallet_payment_updates = mongoose.model('wallet_payment_updates', wallet_payment_updateSchema);

// make this available to our users in our Node applications
module.exports = wallet_payment_updates;