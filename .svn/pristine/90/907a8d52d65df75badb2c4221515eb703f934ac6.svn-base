/* 
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
//autoIncrement.initialize(connection);


var email_eventSchema = new Schema({});

email_eventSchema.plugin(mongoosePaginate);

email_eventSchema.plugin(autoIncrement.plugin, {model: 'Email_Event', field: 'Email_Event_Id', startAt: 1});
var Email_Event = connection.model('Email_Event', email_eventSchema);

module.exports = Email_Event;