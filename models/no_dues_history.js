/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');
autoIncrement = require('mongoose-plugin-autoinc');

var no_dues_History_Schema = new Schema({
    "No_Dues_ID": Number,
    "Approver_Employee_Name": String,
    "Approver_Employee_UID": Number,
    "Employee_UID": Number,
    "Employee_Code": Number,
    "Verify_SSID": Number,
    "Verify_Type": String,
    "Verify_Status": String,
    "No_Dues_Questions": Object,
    "Created_On": Date,
    "Modified_On": Date
});
no_dues_History_Schema.plugin(mongoosePaginate);
no_dues_History_Schema.plugin(autoIncrement.plugin, {model: 'no_dues_history', field: 'No_Dues_History_ID', startAt: 1});
var no_dues_historys = mongoose.model('no_dues_historys', no_dues_History_Schema);
module.exports = no_dues_historys;


