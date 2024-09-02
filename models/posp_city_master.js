/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
autoIncrement = require('mongoose-plugin-autoinc');
var mongoosePaginate = require('mongoose-paginate');

var pincodeCitySchema = new Schema({
	"City" : String,
	"StateName" : String,
	"Pincode" : Number
});

// the schema is useless so far
// we need to create a model using it
pincodeCitySchema.plugin(mongoosePaginate);
var posp_city_master = mongoose.model('posp_city_master', pincodeCitySchema);

// make this available to our users in our Node applications
module.exports = posp_city_master;