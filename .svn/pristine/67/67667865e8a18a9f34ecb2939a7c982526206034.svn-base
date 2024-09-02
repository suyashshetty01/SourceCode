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
var protectSchema  = new Schema({}, {strict: false});
// we need to create a model using it
protectSchema.plugin(mongoosePaginate);


protectSchema.plugin(autoIncrement.plugin, {model: 'Protect_Me_Well_Detail', field: 'Protect_Me_Id', startAt: 1});
var Protect_Me = mongoose.model('Protect_Me_Well_Detail', protectSchema);

// make this available to our users in our Node applications
module.exports = Protect_Me;
