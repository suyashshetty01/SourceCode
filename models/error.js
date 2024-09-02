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
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');


var errorSchema = new Schema({
    "Error_Code": String,
    "Error_Name": String,
    "Error_Desc": String,
    "Error_Type": String,
    "Error_Action": String,
    "Error_Identifier": [String],
    "Error_Msg": String,
    "Created_On": Date,
    "Modified_On": Date
});




errorSchema.pre('save', function (next) {
});
// the schema is useless so far
// we need to create a model using it
errorSchema.plugin(mongoosePaginate);
//errorSchema.plugin(autoIncrement.plugin, {model: 'Client', field: 'Client_Id', startAt: 1});
var Error = mongoose.model('Error', errorSchema);

// make this available to our users in our Node applications
module.exports = Error;