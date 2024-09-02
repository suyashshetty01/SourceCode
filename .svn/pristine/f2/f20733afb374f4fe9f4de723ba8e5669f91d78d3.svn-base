/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');

var winingwheelSchema = new Schema({
    'Name': String,
    'Mobile': String,
    'Pincode': Number,
    'Product':String,
    'Annual_Expense':String,
    'Remarks':String,
    "Created_On" : Date,
    "Modified_On" : Date
});

// the schema is useless so far
// we need to create a model using it
winingwheelSchema.plugin(mongoosePaginate);
var wining_wheel_reward = mongoose.model('wining_wheel_reward', winingwheelSchema);

// make this available to our users in our Node applications
module.exports = wining_wheel_reward;
