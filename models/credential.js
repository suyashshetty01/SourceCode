/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');
autoIncrement = require('mongoose-plugin-autoinc');

var credential_Schema = new Schema({
    "ss_id": Number,
    "fba_id": Number,
    "erp_code": Number,
    "name": String,
    "email_id": String,
    "mobile": Number,
    "password": String,
    "last_updated_on": Date
});
// the schema is useless so far
// we need to create a model using it
credential_Schema.plugin(mongoosePaginate);
credential_Schema.plugin(autoIncrement.plugin, {model: 'Credential', field: 'Credential_Id', startAt: 1});
var credential_data = mongoose.model('Credential', credential_Schema);


// make this available to our users in our Node applications
module.exports = credential_data;


