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
var wallet_account_detailSchema = new Schema({
  'wallet_account_no':Number,
  'agent_uid':Number,
  'agent_name':String,
  'agent_mobile_no':Number,
  'agent_email_id':String,
  'agent_total_amount':Number,
  'agent_username':String,
  'agent_password':String,
  'status':Number
});
// we need to create a model using it
wallet_account_detailSchema.plugin(mongoosePaginate);


wallet_account_detailSchema.plugin(autoIncrement.plugin, {model: 'Wallet_Account_Detail', field: 'wallet_account_no', startAt: 1});
var Wallet_Account_Detail = mongoose.model('Wallet_Account_Detail', wallet_account_detailSchema);

// make this available to our users in our Node applications
module.exports = Wallet_Account_Detail;
