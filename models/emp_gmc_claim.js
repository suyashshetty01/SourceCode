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

var emp_gmc_claim_Schema = new Schema({});

// the schema is useless so far
// we need to create a model using it
emp_gmc_claim_Schema.plugin(mongoosePaginate);
var emp_gmc_claim = mongoose.model('emp_gmc_claim', emp_gmc_claim_Schema);

// make this available to our users in our Node applications
module.exports = emp_gmc_claim;