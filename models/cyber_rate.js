/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var config = require('config');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var connection = mongoose.createConnection(config.db.connection + ':27017/' + config.db.name);

var cyber_rateSchema = new Schema({
    "Plan_Id": Number,
    "Premium": Number,
    "Insurer_Id": Number
});

cyber_rateSchema.plugin(mongoosePaginate);
var Cyber_Rate = connection.model('Cyber_Rate', cyber_rateSchema);
module.exports = Cyber_Rate;