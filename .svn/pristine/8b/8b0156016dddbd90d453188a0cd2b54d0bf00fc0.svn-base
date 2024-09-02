/*
 * Author : Chirag Modi 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('config');
mongoose.Promise = global.Promise;
var connection = mongoose.createConnection(config.db.connection + ':27017/' + config.db.name);
autoIncrement = require('mongoose-plugin-autoinc');
var reportSchema = new Schema({}, {strict: false});
reportSchema.plugin(autoIncrement.plugin, {model: 'Report', field: 'Report_Id', startAt: 1});
var Report = connection.model('Report', reportSchema);
// make this available to our users in our Node applications
module.exports = Report;