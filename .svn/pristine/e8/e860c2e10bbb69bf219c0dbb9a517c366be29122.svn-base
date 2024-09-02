/* Author : Kevin Monteiro
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
autoIncrement = require('mongoose-plugin-autoinc');
var mongoosePaginate = require('mongoose-paginate');

var app_visitor_Schema = new Schema({
    "ss_id": Number,
    "fba_id": Number,
    "customer_name": String,
    "mobile": Number,
    "email": String,
    "registration_no": String,
    "query_string": String,
    "visitor_Id": Number,
    "IP_Address": String,
    "app_type": String,
    "Created_On": Date,
    "Modified_On": Date
});
// the schema is useless so far
// we need to create a model using it
app_visitor_Schema.plugin(mongoosePaginate);
app_visitor_Schema.plugin(autoIncrement.plugin, {model: 'app_visitor', field: 'visitor_Id', startAt: 1});
var app_visitors = mongoose.model('app_visitors', app_visitor_Schema);

// make this available to our users in our Node applications
module.exports = app_visitors;