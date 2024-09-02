/* Roshani Prajapati
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
let mongoose = require('mongoose');
autoIncrement = require('mongoose-plugin-autoinc');
let Schema = mongoose.Schema;
let auth_token_schema = new Schema({
    "SS_ID": Number,
    "Device_ID": String,
    "Auth_Token": String,
    "User_Agent": String,
    "Created_On": Date,
    "Validate_On": Date,
    "Status": String,
    "Request_Core":  Object
});
auth_token_schema.plugin(autoIncrement.plugin, {model: 'auth_token_schema', field: 'Auth_token_Id', startAt: 1});
let auth_tokens = mongoose.model('auth_token', auth_token_schema);
module.exports = auth_tokens;


