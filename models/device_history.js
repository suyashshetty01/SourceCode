/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

let mongoose = require('mongoose');
let autoIncreament = require('mongoose-plugin-autoinc');
let schema = mongoose.Schema;

let device_history_schema = new schema({
    "Device_History_Id":Number,
    "SS_ID":Number,
    "Device_ID":String,
    "Device_Name":String,
    "OS_Detail": String,
    "Created_On":Date,
    "Modified_On":Date,
    "Request_Core":Object,
    "Action_Type":String,
    "Device_Info":Object
});

device_history_schema.plugin(autoIncreament.plugin,{model:'device_history_schema',field:'Device_History_Id',startAt:1});
let device_history = mongoose.model('device_detail_history',device_history_schema);
module.exports = device_history;



