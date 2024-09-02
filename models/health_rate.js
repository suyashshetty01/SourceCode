/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var config = require('config');
var Schema = mongoose.Schema;
autoIncrement = require('mongoose-plugin-autoinc');
mongoose.Promise = global.Promise;
var connection = mongoose.createConnection(config.db.connection + ':27017/' + config.db.name);
//autoIncrement.initialize(connection);

var health_rateSchema = new Schema({
    "ProductPlan_Id": Number,
    "Premium": Number
});

health_rateSchema.plugin(mongoosePaginate);
var Health_Rate = connection.model('Health_Rate', health_rateSchema);
module.exports = Health_Rate;