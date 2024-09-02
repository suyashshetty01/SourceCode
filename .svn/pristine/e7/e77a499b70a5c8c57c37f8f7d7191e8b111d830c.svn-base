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
var match_pointSchema = new Schema({
    'account_id': String,
    'customer_req': Object,
    'customer_res': Object,
    'proposal_req': Object,
    'proposal_res': Object,
    'payment_req': Object,
    'payment_res': Object,
    'mtc_link_history': Object,
    'variant': String,
    'model': String,
    'place': String,
    'is_matchpoint_issued': Number,
    'cust_phoneno': String,
    'policy_exp': String,
    'registration_no': String,
    'fuel_type': String,
    'cust_name': String,
    'make': String,
    'registration_date': String,
    'Created_On': Date,
    'Modified_On': Date
});
// we need to create a model using it
match_pointSchema.plugin(mongoosePaginate);


match_pointSchema.plugin(autoIncrement.plugin, {model: 'Match_Point', field: 'Match_Point_Id', startAt: 1});
var Match_Point = mongoose.model('Match_Point', match_pointSchema);

// make this available to our users in our Node applications
module.exports = Match_Point;