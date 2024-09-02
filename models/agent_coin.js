/* Piyush Singh
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global global */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoosePaginate = require('mongoose-paginate');
autoIncrement = require('mongoose-plugin-autoinc');
mongoose.Promise = global.Promise;

var agent_coin_Schema = new Schema({
    "Agent_Coin_Id":Number,
    "Ss_Id": Number,
    "Total_Coins": Number,
    "Total_Purchase": Number,
    "Total_Spend": Number,
    "Created_On": Date,
    "Modified_On": Date
});
agent_coin_Schema.plugin(mongoosePaginate);
agent_coin_Schema.plugin(autoIncrement.plugin, {model: 'agent_coin', field: 'Agent_Coin_Id', startAt: 1});
var agent_coin = mongoose.model('agent_coin', agent_coin_Schema);
module.exports = agent_coin;