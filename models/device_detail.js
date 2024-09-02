/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

let mongoose = require('mongoose');
autoIncrement = require('mongoose-plugin-autoinc');
let Schema = mongoose.Schema;
let device_detail_schema = new Schema({
    "Device_Detail_Id":Number,
    "SS_ID": Number,
    "Device_ID": String,
    "Device_Name": String,
    "OS_Detail": String,
    "Created_On": Date,
    "Modified_On": Date,
    "Request_Core":  Object
});
device_detail_schema.plugin(autoIncrement.plugin, {model: 'device_detail_schema', field: 'Device_Detail_Id', startAt: 1});
let device_details = mongoose.model('device_detail', device_detail_schema);
module.exports = device_details;


