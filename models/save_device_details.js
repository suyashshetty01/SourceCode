/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var device_detail_schema = new Schema({
    "ss_id": Number,
    "device_id": String,
    "device_name": String,
    "Created_On": Date,
    "Modified_On": Date
});
var device_details = mongoose.model('device_detail', device_detail_schema);


module.exports = device_details;


