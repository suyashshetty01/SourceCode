/*
 * Author : Khushbu Gite 16-03-2020
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 *
 *
 * 
 */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
autoIncrement = require('mongoose-plugin-autoinc');
var mongoosePaginate = require('mongoose-paginate');


var termLifeSchema = new Schema({ 
    "Name":String,
    "Contact_Number":String,
    "City" : String,
    "Created_On":Date});

// the schema is useless so far
// we need to create a model using it
termLifeSchema.plugin(mongoosePaginate);
termLifeSchema.plugin(autoIncrement.plugin, {model: 'Term_Campaigns', field: 'Campaign_Id', startAt: 1});
var TermLifeInsurance_Campaigns = mongoose.model('Term_Campaigns', termLifeSchema);

// make this available to our users in our Node applications
module.exports = TermLifeInsurance_Campaigns;

