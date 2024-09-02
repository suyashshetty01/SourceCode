/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');
//autoIncrement = require('mongoose-plugin-autoinc');
//var connection = mongoose.createConnection(config.db.connection+':27017/'+config.db.name);

var add_to_cartSchema = new Schema({
    'Request_Unique_Id': String,
    'Service_Log_Unique_Id': String,
    'Proposal_Id': Number,
    "PB_CRN": Number,
    "ERP_QT": String,
    "ERP_CS": String,
    "ERP_ENTRY": String,
    "ERP_CS_DOC": String,
    'Is_Last': String,
    'Last_Status': String,
    'Status_Mode': String,
    'Insurer_Id': Number,
    'Status_History': [{}],
    'Product_Id': Number,
    'Ss_Id':Number,
    'Client_Id': Number,
    'Master_Details': Object,
    'Report_Summary': Object,
    'Premium_Request': Object,
    'Premium_Summary': Object,
    'Premium_List': Object,
    'Insurer_Success_Count': Number,
    'Plan_Success_Count': Number,
    'Premium_Response': Object,
    'Premium_Rate': Object,
    'Addon_Request': Object,
    'Link_Request': Object,
    'Link_Id': Number,
    'Customer_Request': Object,
    'Customer_Response': Object,
    'Proposal_Request': Object,
    'Proposal_Response': Object,
    'Processed_Request': Object,
    'Insurer_Transaction_Identifier': String,
    'Proposal_Request_Core': Object,
    'Proposal_History': [{}],
    'PG_Dropoff_Status': String,
    'Policy_Ticket_Status': String,
    'Payment_Request': Object,
    'Payment_Response': Object,
    'Proposal_Status_Response': Object,
    'Payment_Status':String,
    'Verification_Request': Object,
    'Verification_Response': Object,
    'Pdf_Request': Object,
    'Pdf_Response': Object,
    'Transaction_Data': Object,
    'Transaction_Status': String,
    'Erp_Qt_Request_Core': Object,
    'Erp_Qt_Request': String,
    'Erp_Qt_Response': String,
    'Erp_Cs_Err': String,
    'Erp_Cs_Request_Core': Object,
    'Erp_Cs_Request': String,
    'Erp_Cs_Response': String,
    'Erp_Cs_Doc_Request_Core': Object,
    'Erp_Cs_Doc_Request': String,
    'Erp_Cs_Doc_Response': String,
    'Is_Active': {type: Boolean, default: true},
    'Created_On': {type: Date},
    'Modified_On': {type: Date},
    'Disposition_Status': String,
    'Disposition_SubStatus': String,
    'Disposition_Modified_On': {type: Date},
    'lead_assigned_uid': Number,
    'lead_assigned_name': String,
    'lead_assigned_ssid': Number,
    'lead_assigned_on': {type: Date},
    'Lead_Call_Back_Time': String,
    'agent_details': Object,
    'Preferred_Plan_Data': Object
});
add_to_cartSchema.plugin(mongoosePaginate);
//add_to_cartSchema.plugin(autoIncrement.plugin, {model: 'add_to_cart', field: 'add_to_cart_Id', startAt: 1});
var add_to_cart = mongoose.model('add_to_cart', add_to_cartSchema);
module.exports = add_to_cart;