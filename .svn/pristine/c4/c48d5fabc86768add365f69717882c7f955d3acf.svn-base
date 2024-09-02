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
autoIncrement = require('mongoose-plugin-autoinc');
mongoose.Promise = global.Promise;
var connection = mongoose.createConnection(config.db.connection + ':27017/' + config.db.name);
//autoIncrement.initialize(connection);



// create a schema
var clientSchema = new Schema({
    Client_Name: {type: String, required: true},
    Secret_Key: {type: String, required: true, unique: true},
    Client_Unique_Id: {type: String, required: true, unique: true},
    Platform: {type: String, enum: ['Website', 'MobileApp', 'DesktopSoftware', 'SMS', 'IVR'], default: 'Website'},
    Role: {type: String, enum: ['Admin', 'LMClient', 'TPClient'], default: 'LMClient'},
    Integration_Type: {type: String, enum: ['NonPOSP', 'POSP'], default: 'NonPOSP'},
    Premium_Source: {type: String, enum: ['Real', 'Cache'], default: 'Real'},
    Is_Active: Boolean,
    Created_On: Date,
    Modified_On: Date
});

//clientSchema.pre('save', function (next) {
//    // get the current date
//    var currentDate = new Date();
//    if (!this.Client_Id) {
//        this.Created_On = currentDate;
//        this.Is_Active = true;
//    }
//    this.Modified_On = currentDate;
//});
clientSchema.plugin(mongoosePaginate);
clientSchema.plugin(autoIncrement.plugin, {model: 'Client', field: 'Client_Id', startAt: 1});
// the schema is useless so far
// we need to create a model using it
//var Client = mongoose.model('Client', clientSchema);
var Client = connection.model('Client', clientSchema);

// make this available to our users in our Node applications
module.exports = Client;