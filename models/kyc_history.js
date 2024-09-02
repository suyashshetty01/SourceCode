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
var kyc_historySchema = new Schema({
    'Kyc_History_Id': Number,
    'PB_CRN': Number,
    'User_Data_Id': Number,
    'Insurer_Id': Number,
    'Product_Id': Number,
    'DOB': String,
    'Full_Name': String,
    'KYC_Full_Name': String,
    'KYC_Company_Name': String,
    'Mobile': Number,
    'Email': String,
    'KYC_Number': String,
    'Search_Type': String,
    'KYC_Status': String,
    'KYC_URL': String,
    'KYC_Ref_No': String,
    'Created_On': Date,
    'Modified_On': Date,
    'Proposal_Id': String,
    'Quote_Id': String,
    'KYC_Request_Core': Object,
    'KYC_Response_Core': Object,
    'proposal_page_url': String,
    'service_log_id': Number,
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
kyc_historySchema.plugin(mongoosePaginate);


kyc_historySchema.plugin(autoIncrement.plugin, {model: 'kyc_history', field: 'Kyc_History_Id', startAt: 1});
var kyc_history = mongoose.model('kyc_history', kyc_historySchema);

// make this available to our users in our Node applications
module.exports = kyc_history;