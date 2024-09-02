/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mongoose = require('mongoose');
var schema = mongoose.Schema;
mongoose.Promise = global.Promise;

var chat_schema = new schema({
    "SentMessage": {},
    "ReceivedMessage":String,
    "date": String,
    "user_id": String,
    "created_on": Date
});
var chatData = mongoose.model("UserChat", chat_schema);

module.exports = chatData;


