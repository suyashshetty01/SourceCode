/*
 * Author : Revati Ghadge 
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
var crnSchema = new Schema({
    'Product_Id': Number,
    'User_Data_Id': Number,
    'Crn_Request': Object,
    'PB_Crn_Request': Object,
    'Created_On': Date,
    'Modified_On': Date
});
// we need to create a model using it
crnSchema.plugin(mongoosePaginate);

if (config.environment.name.toString() === 'Production') {
    crnSchema.plugin(autoIncrement.plugin, {model: 'Crn', field: 'Crn_Id', startAt: 4000000});
} else {
    crnSchema.plugin(autoIncrement.plugin, {model: 'Crn', field: 'Crn_Id', startAt: 1000000});
}

var Crn = mongoose.model('Crn', crnSchema);
// make this available to our users in our Node applications
module.exports = Crn;