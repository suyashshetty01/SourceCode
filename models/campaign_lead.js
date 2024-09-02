/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;
autoIncrement = require('mongoose-plugin-autoinc');
mongoose.Promise = global.Promise;
var campaign_lead_Schema = new Schema({
    
    'Created_On': {type: Date,default: Date.now},
    'Modified_On': {type: Date,default: Date.now},
    'Campaign_Type' : String,
    'Product_Id': Number,
    'Status' : String,
    'IP_Address': String,
    'Query_String' : String,
    'Utm_Campaign' : String,
    'Utm_Source' : String,
    'Utm_Medium' : String,
    'Mobile_Number':String,
    'Name': String,
    'DOB' : String,
    'Email_Id' : String,
    'Lead_Assigned_Uid' : Number,
    'Lead_Assigned_Name' : String,
    'Lead_Assigned_Ss_Id' : Number,
    'Disposition_Status' : String,
    'Sub_Status' : String,
    'Next_Call_Date' : Date,
    'Disposition_On' : Date,
    'Disposition_By':Number,
    'Request_Core' : Object
});

campaign_lead_Schema.plugin(mongoosePaginate);


campaign_lead_Schema.plugin(autoIncrement.plugin, {model: 'campaign_lead', field: 'Campaign_Lead_Id', startAt: 1});
var campaign_lead = mongoose.model('campaign_lead', campaign_lead_Schema);


module.exports = campaign_lead;