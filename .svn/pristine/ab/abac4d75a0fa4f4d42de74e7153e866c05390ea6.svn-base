/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


// grab the things we need
var config = require('config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
autoIncrement = require('mongoose-plugin-autoinc');
mongoose.Promise = global.Promise;
var connection = mongoose.createConnection(config.db.connection + ':27017/' + config.db.name);


var pg_logSchema = new Schema({
    "Pg_Data_Id": Number,
    "Proposal_Id": Number,
    "Pg_Get": Object,
    "Pg_Post": Object,
    "Pg_Url": String,
    "PB_CRN": Number,
    "Referer": String,
    "User_Data_Id": Number,
    "Created_On": Date
});


pg_logSchema.plugin(autoIncrement.plugin, {model: 'Pg_Data', field: 'Pg_Data_Id', startAt: 71430});
var Pg_Data = connection.model('Pg_Data', pg_logSchema);
module.exports = Pg_Data;