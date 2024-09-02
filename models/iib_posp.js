/*
 * Author : Khushbu Gite 19-03-2020
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 *
 *
 * 
 */

// grab the things we need
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var iib_posp_Schema = new Schema({}, {strict: false});
iib_posp_Schema.plugin(mongoosePaginate);
var Iib_Posp = mongoose.model('iib_posp', iib_posp_Schema);
// make this available to our users in our Node applications
module.exports = Iib_Posp;