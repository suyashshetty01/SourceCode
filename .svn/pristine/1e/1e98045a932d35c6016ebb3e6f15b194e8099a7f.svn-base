/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*
 * 
 * {
 "_id" : ObjectId("591ad96ac273518df36fbec2"),
 "Client_Id" : "1",
 "Client_Unique_Id" : "123124343",
 "Client_Name" : "Self",
 "Secret_Key" : "12345678",
 "Is_Active" : "1",
 "Created_On" : "",
 "Modified_On" : ""
 }
 */

// grab the things we need
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var config = require('config');
var Schema = mongoose.Schema;
var fs = require('fs');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
autoIncrement = require('mongoose-plugin-autoinc');
mongoose.Promise = global.Promise;
var connection = mongoose.createConnection(config.db.connection + ':27017/' + config.db.name);
//autoIncrement.initialize(connection);


var support_emailSchema = new Schema({
	'Support_Email_Id': Number,
    'From': String,
    'To': String,
    'Cc': String,
    'Bcc': String,
    'Sub': String,
    'Content': String,
	'PB_CRN' : Number,
    'Created_On': Date,
	'Modified_On': Date,
    'Message_Id': String,
    'Message_Date': String,
    'Response_Core': Object,
    'Attachment': String
});

support_emailSchema.plugin(mongoosePaginate);

support_emailSchema.plugin(autoIncrement.plugin, {model: 'Support_Email', field: 'Support_Email_Id', startAt: 1});
var Support_Email = connection.model('Support_Email', support_emailSchema);
module.exports = Support_Email;