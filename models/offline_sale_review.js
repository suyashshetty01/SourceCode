/* Author : Dipali Revanwar
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var Schema = mongoose.Schema;
autoIncrement = require('mongoose-plugin-autoinc');
mongoose.Promise = global.Promise;
var offline_sale_reviewSchema = new Schema({
    'Ss_Id': Number,
    'Product_Id': Number,
    'Insurer_Id': Number,
    'Vehicle_Id': Number,
    'Rto_Id': Number,
    'Prev_Insurer_Id': Number,
    'Prev_Policy_Number': String,
    'Engin_Number': String,
    'Chassis_Number': String,
    'Created_On': Date,
    'Modified_On': Date,
    'Policy_Start_Date': String,
    'Vehicle_Registration_Date': String,
    'Vehicle_Manf_Date': String,
    'Fuel': String,
    'Inspection_Date': Date,
    'Customer_Name': String,
    'Addon_Premium': Number,
    'Offline_Addon_Premium' : Number,
    'Final_Premium' : Number,
    'Offline_Final_Premium' : Number,
    'Idv' : Number,
    'Net_Premium' : Number,
    'Offline_Net_Premium' : Number,
    'Registration_No' : String,
    'Service_Tax' : Number,
    'Addons' : Object,
    'Policy_End_Date' : String,
    'CPA' : String,
    'Ncb' : String,
    'Claim' : String,
    'Quote_On' : Date,
    'PB_CRN' : Number,
    'User_Data_Id' : Number,
    'Quote_Url' : String,
    'Premium_Initiated' : String,
    'Remark': String,
    'Fail_Request': String,
    'Details': String
});
// we need to create a model using it
offline_sale_reviewSchema.plugin(mongoosePaginate);
offline_sale_reviewSchema.plugin(autoIncrement.plugin, { model: 'offline_sale_review', field: 'Offline_Sale_Review_Id', startAt: 1 });
var offline_sale_review = mongoose.model('offline_sale_review', offline_sale_reviewSchema);
module.exports = offline_sale_review;