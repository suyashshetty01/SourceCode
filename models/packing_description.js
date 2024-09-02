/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
//var mongoosePaginate = require('mongoose-paginate');

var packing_description_Schema = new Schema({});
// the schema is useless so far
// we need to create a model using it
//packing_description_Schema.plugin(mongoosePaginate);
var packing_description = mongoose.model('packing_description', packing_description_Schema);

// make this available to our users in our Node applications
module.exports = packing_description;