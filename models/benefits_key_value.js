/* Author : Roshani Prajapati
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var config = require('config');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var connection = mongoose.createConnection(config.db.connection + ':27017/' + config.db.name);

var benefits_key_valueSchema = new Schema({
    "Key": String,
    "Value": Array
});

benefits_key_valueSchema.plugin(mongoosePaginate);
var benefits_key_value = connection.model('benefits_key_values', benefits_key_valueSchema);
module.exports = benefits_key_value;
