/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
autoIncrement = require('mongoose-plugin-autoinc');
var mongoosePaginate = require('mongoose-paginate');

var customer_tracking_Schema = new Schema({
    'Customer_Tracking_Id':Number,
    'User_Id': Number,
    'Product_Id': Number,
    'Language': String,
    'Type_Of_Content':String,
    'Request_Core': Object,
    'Created_On': {type: Date, default: new Date()},
    'Modified_On': {type: Date, default: new Date()}
});
customer_tracking_Schema.plugin(mongoosePaginate);
customer_tracking_Schema.plugin(autoIncrement.plugin, {model: 'customer_tracking' ,field: 'Customer_Tracking_Id', startAt: 1});
var customer_tracking = mongoose.model('customer_tracking', customer_tracking_Schema);

module.exports = customer_tracking;