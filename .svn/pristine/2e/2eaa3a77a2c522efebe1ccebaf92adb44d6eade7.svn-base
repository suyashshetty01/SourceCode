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
var proposalSchema = new Schema({
    'Product_Id': Number,
    'Insurer_Id': Number,
    'PB_CRN': Number,
    'User_Data_Id': Number,
    'Service_Log_Id': Number,
    'Service_Log_Unique_Id': String,
    'Insurer_Transaction_Identifier': String,
    'Ip_Address': String,
    'Proposal_Request': Object,
    'Proposal_Response': Object,
    'Payment_Response': Object,
    'Premium': Number,
    'Status': String,
    'Created_On': Date,
    'Modified_On': Date
});
// we need to create a model using it
proposalSchema.plugin(mongoosePaginate);


proposalSchema.plugin(autoIncrement.plugin, {model: 'Proposal', field: 'Proposal_Id', startAt: 1});
var Proposal = mongoose.model('Proposal', proposalSchema);

// make this available to our users in our Node applications
module.exports = Proposal;