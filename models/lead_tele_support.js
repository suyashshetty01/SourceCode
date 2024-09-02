/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
autoIncrement = require('mongoose-plugin-autoinc');
var mongoosePaginate = require('mongoose-paginate');
var leadteleSupportSchema = new Schema(
        {   
            "Ss_Id": Number,
            "Fba_Id": Number,
            "Sync_Contact_Erp_Data_Id" : Number,
            "Is_tele_support" : String,
            "Remark" : String,
            "Created_On": Date,
            "Modified_On": Date
           
        }
);
leadteleSupportSchema.plugin(mongoosePaginate);

leadteleSupportSchema.plugin(autoIncrement.plugin, {model: 'lead_tele_support', field: 'Lead_tele_support_Id', startAt: 1});
var LeadAllocation = mongoose.model('lead_tele_support', leadteleSupportSchema);
// make this available to our users in our Node applications
module.exports = LeadAllocation;