/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');

var posp_leads_Schema = new Schema({
    'Campgin_name': String,
    'Enqiry_name': String,
    'Mobile': Number,
    'Email': String,
    'Date': Date
});
// the schema is useless so far
// we need to create a model using it
posp_leads_Schema.plugin(mongoosePaginate);
var posp_lead = mongoose.model('posp_lead', posp_leads_Schema);

// make this available to our users in our Node applications
module.exports = posp_lead;