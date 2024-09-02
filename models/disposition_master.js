/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');

var disposition_master_Schema = new Schema({
    "Status_Id" : Number,
    "Status" : String,
    "Status_Description" : String,
    "Sub_Status_Id":Number,
    "Sub_Status" : String,
    "Sub_Status_Description" : String,
    "Is_Active":Number
});

// the schema is useless so far
// we need to create a model using it
disposition_master_Schema.plugin(mongoosePaginate);
var disposition_master = mongoose.model('disposition_master', disposition_master_Schema);

// make this available to our users in our Node applications
module.exports = disposition_master;