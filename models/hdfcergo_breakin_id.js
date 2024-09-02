/* Author: Revati Ghadge
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');

var hdfcergo_breakinSchema = new Schema({});

// the schema is useless so far
// we need to create a model using it
hdfcergo_breakinSchema.plugin(mongoosePaginate);
var hdfcergo_breakin_id = mongoose.model('hdfcergo_breakin_id', hdfcergo_breakinSchema);

// make this available to our users in our Node applications
module.exports = hdfcergo_breakin_id;