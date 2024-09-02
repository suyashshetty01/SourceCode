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


var requestSchema = new Schema({
    "Request_Unique_Id": String,
    "PB_CRN": Number,
    "ERP_QT": String,
    "ERP_CS": String,
    "Client_Id": Number,
    "Request_Core": Object,
    "Request_Product": Object,
    "Created_On": Date,
    "Status": String,
    "Total": Number,
    "Pending": Number,
    "Complete": Number,
    "Success": Number,
    "Fail": Number,
    "Total_Execution_Time": Number
});

// the schema is useless so far
// we need to create a model using it
requestSchema.plugin(mongoosePaginate);
requestSchema.plugin(autoIncrement.plugin, {model: 'Request', field: 'Request_Id', startAt: 278879});
var Request = mongoose.model('Request', requestSchema);
// make this available to our users in our Node applications
module.exports = Request;