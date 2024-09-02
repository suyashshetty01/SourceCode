/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');

var visitor_History_Schema = new Schema({
    "visitor_Id": Number,
    "visited_on": Date,
    "visited_url":String,
    "device_type":String,
    "user_agent":String
});

visitor_History_Schema.plugin(mongoosePaginate);
var app_visitors = mongoose.model('visitors_history', visitor_History_Schema);


module.exports = app_visitors;


