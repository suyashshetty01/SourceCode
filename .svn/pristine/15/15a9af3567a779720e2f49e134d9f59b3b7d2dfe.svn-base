/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var config = require('config');
var Schema = mongoose.Schema;
autoIncrement = require('mongoose-plugin-autoinc');
mongoose.Promise = global.Promise;
var sms_campaignSchema = new Schema({}, {strict: false});
// we need to create a model using it
sms_campaignSchema.plugin(mongoosePaginate);
var Sms_Campaign = mongoose.model('Sms_Campaign', sms_campaignSchema);

// make this available to our users in our Node applications
module.exports = Sms_Campaign;
