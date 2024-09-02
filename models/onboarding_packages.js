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


var onboarding_package_Schema = new Schema({
    "Package_Id":Number,
    "Name": String,
    "Amount": Number,
    "Description": String,
    "Is_Active": {type:Boolean,default:true},
   "Created_On": Date,
   "Modified_On": Date
});

// the schema is useless so far
// we need to create a model using it
onboarding_package_Schema.plugin(mongoosePaginate);
onboarding_package_Schema.plugin(autoIncrement.plugin, {model: 'onboarding_package', field: 'Package_Id', startAt: 1});
var onboarding_package = mongoose.model('onboarding_package', onboarding_package_Schema);

// make this available to our users in our Node applications
module.exports = onboarding_package;