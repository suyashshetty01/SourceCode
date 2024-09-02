/* 
 * Author: Piyush Singh
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 * 
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
autoIncrement = require('mongoose-plugin-autoinc');
var mongoosePaginate = require('mongoose-paginate');

var contactus_Schema = new Schema({

    "Name": String,
    "Mobile": Number,
    //"Email": String,
    "City": String,
    "Info_About": String,
    "Comment": String,
    "Visitor_Number": Number,
    "Created_On": Date,
    "Modified_On": Date
});
// the schema is useless so far
// we need to create a model using it
contactus_Schema.plugin(mongoosePaginate);
contactus_Schema.plugin(autoIncrement.plugin, {model: 'contactus_Schema', field: 'Visitor_Number', startAt: 1});
var contactus = mongoose.model('contactus', contactus_Schema);

// make this available to our users in our Node applications
module.exports = contactus;


