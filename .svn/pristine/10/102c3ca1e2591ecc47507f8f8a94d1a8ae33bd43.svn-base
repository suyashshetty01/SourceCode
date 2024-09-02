/*
 * Author : Kevin Monteiro 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
//var config = require('config');
var Schema = mongoose.Schema;
autoIncrement = require('mongoose-plugin-autoinc');
mongoose.Promise = global.Promise;
//var connection = mongoose.createConnection(config.db.connection + ':27017/' + config.db.name);
var posp_callbackSchema = new Schema({
    'Posp_Enquiry_Id': Number,
    'Name': String,
    'Mobile': Number,
    'Call_Time': String,
    'Remark': String,
    'Status': String,
    'Ip_Address':String,
    'Visited_History': [],
    'Visited_On': Date,
    'Visited_Count': Number,
	'Visited_Source' : String,
    'Url': String,
    'Created_On': Date,
    'Modified_On': Date
});
// we need to create a model using it
posp_callbackSchema.plugin(mongoosePaginate);
posp_callbackSchema.plugin(autoIncrement.plugin, {model: 'Posp_Callback', field: 'Posp_Callback_Id', startAt: 1});
var Posp_Callback = mongoose.model('Posp_Callback', posp_callbackSchema);

// make this available to our users in our Node applications
module.exports = Posp_Callback;