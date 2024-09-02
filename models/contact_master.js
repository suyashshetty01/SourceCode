/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

let mongoose = require('mongoose');
let autoIncrement = require('mongoose-plugin-autoinc');
let Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
let mongoosePaginate = require('mongoose-paginate');

let contact_master_Schema = new Schema({
    Contact_Name: String,
    Mobile_No: Number,
    Created_On: Date,
    Modified_On: Date,
    First_Sync_Ss_Id: Number,
    Last_Sync_Ss_Id: Number,
    Sync_City: String,
    Sync_Organization: String,
    Sync_Designation: String,
    Sync_Relation: String,
    Sync_Count: Number
});

contact_master_Schema.plugin(mongoosePaginate);
contact_master_Schema.plugin(autoIncrement.plugin, {
    model: 'contact_master',
    field: 'Contact_Master_Id',
    startAt: 1
});

let Contact_Master = mongoose.model('contact_master', contact_master_Schema);

module.exports = Contact_Master;
