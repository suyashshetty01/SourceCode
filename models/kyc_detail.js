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
var kyc_detailSchema = new Schema({
    'Search_Type': String,
    'KYC_Number': String,
    'Full_Name': String,
    'KYC_Full_Name': String,
    'KYC_Company_Name': String,
    'Mobile': Number,
    'KYC_Status': String,
    'DOB': String,
    'Created_On': Date,
    'Modified_On': Date,
    'Insurer_Id': Number,
    'PB_CRN': Number,
    'User_Data_Id': Number,
    'Product_Id': Number,
    'Email': String,
    'Proposal_Request': Object,
    'Proposal_Id': String,
    'Quote_Id': String,
    'KYC_URL': String,
    'KYC_Ref_No': String,
    'proposal_page_url':String,
    'service_log_id':Number,
    'Document_Type': String,
    'Document_ID': String,
    'Doc1': String,
    'Doc1_Name': String,
    'Doc2': String,
    'Doc2_Name': String,
    'Doc3': String,
    'Doc3_Name': String
});
// we need to create a model using it
kyc_detailSchema.plugin(mongoosePaginate);


kyc_detailSchema.plugin(autoIncrement.plugin, {model: 'kyc_detail', field: 'Kyc_Detail_Id', startAt: 1});
var kyc_detail = mongoose.model('kyc_detail', kyc_detailSchema);

// make this available to our users in our Node applications
module.exports = kyc_detail;