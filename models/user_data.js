/* Chirag Modi
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// grab the things we need
var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var config = require('config');
var Schema = mongoose.Schema;
autoIncrement = require('mongoose-plugin-autoinc');
mongoose.Promise = global.Promise;
var connection = mongoose.createConnection(config.db.connection + ':27017/' + config.db.name);
//autoIncrement.initialize(connection);

var user_dataSchema = new Schema({
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
user_dataSchema.pre('save', function (next) {
    // get the current date
    var currentDate = new Date();
    this.Created_On = currentDate;
    this.Modified_On = currentDate;
    next();
});

user_dataSchema.plugin(mongoosePaginate);

user_dataSchema.plugin(autoIncrement.plugin, {model: 'User_Data', field: 'User_Data_Id', startAt: 1});
var User_Data = connection.model('User_Data', user_dataSchema);
User_Data.prototype.update_policy_status = function (request_unique_id) {
    try {
        var User_Data = require('../models/user_data');
        User_Data.findOne({"Request_Unique_Id": request_unique_id}, function (err, dbUserData) {
            if (err) {

            } else {
                if (dbUserData) {
                    var Last_Status = 'TRANS_SUCCESS_WITH_POLICY';
                    var Status_History = dbUserData.Status_History;

                    Status_History.unshift({
                        "Status": Last_Status,
                        "StatusOn": new Date()
                    });
                    var objUserData = {
                        'Last_Status': Last_Status,
                        'Status_History': Status_History
                    };
                    var User_Data = require('../models/user_data');
                    User_Data.update({'User_Data_Id': dbUserData._doc['User_Data_Id']}, {$set: objUserData}, function (err, numAffected) {
                        console.log('policy_write_file', 'user_data', err, numAffected);
                    });
                }
            }
        });
    } catch (ep) {
        console.error('update_userdata_policy_status', ep);
    }
};
module.exports = User_Data;