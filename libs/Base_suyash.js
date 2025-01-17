/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var EventEmitter = require('events');
var util = require('util');
var config = require('config');
var bitly_access_token = config.environment.arr_bitly_access_token[Math.floor(Math.random() * config.environment.arr_bitly_access_token.length)];
var MongoClient = require('mongodb').MongoClient;
var path = require('path');
var fs = require('fs');
var moment = require('moment');
var appRoot = path.dirname(path.dirname(require.main.filename));
var crypto = require('crypto');
var const_email_env_sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']'));
var User_Data = require('../models/user_data');
var const_policy_subtype = {
    '0CH_1TP': 'TP 1 yr Only',
    '0CH_3TP': 'TP 3 yrs Only',
    '0CH_5TP': 'TP 5 yrs Only',
    '1OD_0TP': 'OD 1 yr Only',
    '1CH_2TP': 'OD 1 yr + TP 3 yrs',
    '1CH_4TP': 'OD 1 yr + TP 5 yrs',
    '1CH_0TP': 'OD 1 yr + TP 1 yr',
    '2CH_0TP': 'OD 2 yr + TP 2 yrs',
    '3CH_0TP': 'OD 3 yr + TP 3 yrs',
    '5CH_0TP': 'OD 5 yr + TP 5 yrs'
};
var const_allowed_plateform = [
    //"FinPeace",
    "HorizonFM",
    "LERP",
    "PolicyBoss.com",
    "PolicyBoss.com#"
];
var Const_CH_Mobile = {
    'DIRECT': ['9820538598', '9833669219'],
    'DC': ['9769588193'],
    'LA': ['9769588193'],
    'SM': ['9099946466'],
    'SG': ['9819600699'],
    'GS': ['9702738000'],
    'EM': ['9909973125'],
    'DC-NP': ['9769588193'],
    'SM-NP': ['9099946466'],
    'SG-NP': ['9819600699'],
    'GS-NP': ['9702738000'],
    'EM-NP': ['9909973125'],
    'CC-AUTO': ['9870200065'],
    'CC-HEALTH': ['9920162163']
};
var Const_Product = {
    '1': 'Car',
    '2': 'Health',
    '4': 'Travel',
    '3': 'Term',
    '10': 'TW',
    '12': 'CV',
    '17': 'CoronaCare',
    '13': 'Marine',
    '5': 'Investment',
    '16': 'CancerCare',
    '18': 'CyberSecurity',
    '19': 'WorkmenCompensation',
    '8': 'PersonalAccident'
};

function Base() {

}
util.inherits(Base, EventEmitter);
Base.prototype.lm_request_core = {};
Base.prototype.insurer_lm_request = {};
Base.prototype.lm_request = {};
Base.prototype.prepared_request = {};
Base.prototype.processed_request = {};
Base.prototype.proposal_processed_request = {};
Base.prototype.lm_response = {};
Base.prototype.lm_response = {};
Base.prototype.db_specific_product = {};
Base.prototype.master_db_list = {};
Base.prototype.Master_Details = {};
Base.prototype.generic_field_list = [];
Base.prototype.method_field_list = [];
Base.prototype.product_field_list = [];
Base.prototype.plan_processed_list = [];
Base.prototype.premium_request_file = '';
Base.prototype.base_date_format = 'yyyy-MM-dd';
Base.prototype.request_id = 0;
Base.prototype.udid = 0;
Base.prototype.request_unique_id = '';
Base.prototype.insurer_lib_list = {};
Base.prototype.insurer_master_object = {};
Base.prototype.request_process_handler = '';
Base.prototype.client_id = 0;
Base.prototype.const_payment = {
    'pg_ack_url': null,
    'pg_url': null,
    'pg_data': null,
    'pg_redirect_mode': 'GET'
};
Base.prototype.const_payment_response = {
    'pg_url': null,
    'pg_get': null,
    'pg_post': null,
    'pg_redirect_mode': 'GET'
};
Base.prototype.const_transaction_status = [
    'SEARCH',
    'RECALCULATE',
    'ADDON_APPLY',
    'BUY_NOW_AGENT',
    'BUY_NOW_CUSTOMER',
    'PROPOSAL_SAVE_AGENT',
    'PROPOSAL_SAVE_CUSTOMER',
    'PROPOSAL_LINK_SENT',
    'PROPOSAL_SUBMIT',
    'PROPOSAL_EXCEPTION',
    'INSPECTION_SCHEDULED',
    'INSPECTION_EXCEPTION',
    'INSPECTION_APPROVED',
    'INSPECTION_REJECTED',
    'VERIFICATION_EXCEPTION',
    'TRANS_FAIL',
    'TRANS_SUCCESS_WO_POLICY',
    'TRANS_SUCCESS_WITH_POLICY',
    'ALREADY_CLOSED',
    'TRANS_PAYPASS',
    'ERP_CS_SUCCESS',
    'ERP_CS_EXCEPTION',
    'ERP_POLICY_SUCCESS',
    'ERP_POLICY_EXCEPTION'
];
Base.prototype.const_policy = {
    'policy_url': null,
    'policy_number': null,
    'policy_id': null,
    'transaction_status': null,
    'pg_status': null,
    'transaction_id': null,
    'transaction_amount': null,
    "pg_reference_number_1": null,
    "pg_reference_number_2": null,
    "pg_reference_number_3": null,
    'verification_request': null
};
Base.prototype.generic_processed_request = {};
Base.prototype.product_processed_request = {};
Base.prototype.method_processed_request = {};
Base.prototype.addon_processed_request = {};
var mongojs = require('mongojs');
var myDb = mongojs(config.db.connection + ':27017/' + config.db.name);
var myDbClient = null;
//var myDb = null;

MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
    if (err) {
        return console.dir(err);
    } else {
        myDbClient = db;
        // var obj = new Base();
        //obj.getNextSequence('Request_Id');
    }
});
Base.prototype.get_GMT_current_datetime = function () {
    var today = new Date();
    var str = today.toUTCString(); // deprecated! use toUTCString()
    return str;
}
Base.prototype.base_api_pre = function () {
    //console.log(this.constructor.name + '::' + 'base_api_pre' + '::Start');
    var objLMRequest = this.lm_request;
    var arr_random_request = ['first_name', 'last_name', 'middle_name'];
    for (var i in arr_random_request) {
        if (!(objLMRequest.hasOwnProperty(arr_random_request[i]) && objLMRequest[arr_random_request[i]] != '')) {
            if (this.lm_request['method_type'] === 'Proposal' || this.lm_request['method_type'] === 'Customer') {
                objLMRequest[arr_random_request[i]] = '';
            } else {
                objLMRequest[arr_random_request[i]] = this.randomString(10);
            }
        }
    }

    if (!objLMRequest.hasOwnProperty('birth_date') || objLMRequest['birth_date'] == '') {
        objLMRequest['birth_date'] = '1992-01-01';
    }
    if (!objLMRequest.hasOwnProperty('email') || objLMRequest['email'] === '' || objLMRequest['email'] === null) {
        objLMRequest['email'] = this.randomString(10) + '@testpb.com';
    }
    if (!objLMRequest.hasOwnProperty('mobile') || objLMRequest['mobile'] === '' || objLMRequest['mobile'] === null) {
        //objLMRequest['mobile'] = this.create_guid('', 'numeric', 10);
        objLMRequest['mobile'] = '9999999999';
    }
    if (objLMRequest.hasOwnProperty('nominee_name') && objLMRequest['nominee_name'] !== '' && (!objLMRequest.hasOwnProperty('nominee_first_name') || objLMRequest['nominee_first_name'] === '')) {
        var nominee_name = objLMRequest['nominee_name'];
        var arr_nominee_name = nominee_name.split(' ');
        objLMRequest['nominee_first_name'] = arr_nominee_name[0];
        objLMRequest['nominee_last_name'] = arr_nominee_name[arr_nominee_name.length - 1];
        if (arr_nominee_name.length > 2) {
            arr_nominee_name.splice(0, 1);
            arr_nominee_name.splice(arr_nominee_name.length - 1, 1);
            objLMRequest['nominee_middle_name'] = arr_nominee_name.join(' ');
        }

    }
    if (objLMRequest.hasOwnProperty('appointee_name') && objLMRequest['appointee_name'] !== '' && (!objLMRequest.hasOwnProperty('appointee_first_name') || objLMRequest['appointee_first_name'] === '')) {
        var appointee_name = objLMRequest['appointee_name'];
        var arr_appointee_name = appointee_name.split(' ');
        objLMRequest['appointee_first_name'] = arr_appointee_name[0];
        objLMRequest['appointee_last_name'] = arr_appointee_name[arr_appointee_name.length - 1];
        if (arr_appointee_name.length > 2) {
            arr_appointee_name.splice(0, 1);
            arr_appointee_name.splice(arr_appointee_name.length - 1, 1);
            objLMRequest['appointee_middle_name'] = arr_appointee_name.join(' ');
        }
    }

    this.lm_request = objLMRequest;
    //console.log(this.constructor.name + '::' + 'base_api_pre' + '::Finish');
}
Base.prototype.base_field_process_pre = function () {

}
Base.prototype.base_field_process_post = function () {

}
Base.prototype.base_response_handler = function (objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object) {

    //console.log(this.constructor.name, 'base_response_handler', 'Start');
    try {
        var objInsurerProduct = this;
        var objProductResponse = null;
        var Error_Code = '';
        var objError = null;
        let insurer_id = objInsurerProduct.lm_request['insurer_id'];
        var Proposal_Id = objInsurerProduct.lm_request['proposal_id'] - 0;
        if (objResponseFull.objResponseJson && typeof objResponseFull.objResponseJson === 'object') {
            var strResp = JSON.stringify(objResponseFull.objResponseJson);
            if (strResp.indexOf('$') > -1) {
                strResp = strResp.replace(/\$/g, 'attr');
                objResponseFull.objResponseJson = JSON.parse(strResp);
            }
        }

        if (objResponseFull.err) {

            objError = {
                "Error_Code": "LM001",
                "Error_Name": "Service_Exception",
                "Error_Desc": "Service has exception",
                "Error_Type": "Post",
                "Error_Action": "Insurer_Inform",
                "Error_Msg": "Service_Exception",
                "Error_Specific": objResponseFull.err
            };
            //            var docLogModify = {
            //                "Insurer_Response": objResponseFull.objResponseJson,
            //                "Insurer_Response_Core": objResponseFull.raw,
            //                "Premium_Breakup": null,
            //                "Status": "complete",
            //                "Error_Code": Error_Code,
            //                "Error": objError,
            //                "Call_Execution_Time": 0
            //            };
            //this.save_log(docLog, docLogModify);
            return objInsurerProduct.error_process_post_handler(docLog, objProductResponse, objResponseFull, objError, specific_insurer_object);
        } else {
            /*if(typeof objResponseFull.raw === 'object') {
                console.error("NIVA DATA SAVE IN DB", objResponseFull);
                objResponseFull.raw = JSON.stringify(objResponseFull.raw);
            }*/
            var docLogModify = {
                "Insurer_Response": objResponseFull.objResponseJson,
                "Insurer_Response_Core": objResponseFull.raw
            };
            this.save_log(docLog, docLogModify);
            objInsurerProduct.lm_request['proposal_slid'] = docLog['Service_Log_Id'];
            objInsurerProduct.const_payment.pg_ack_url = objInsurerProduct.pg_ack_url(insurer_id);
            objInsurerProduct.const_payment.proposal_confirm_url = objInsurerProduct.proposal_confirm_url(insurer_id, Proposal_Id);
            objInsurerProduct.const_payment.pg_url = Insurer_Object.Payment_Gateway_URL;
            objProductResponse = objInsurerProduct.product_response_handler(objResponseFull.objResponseJson, objProduct, objInsurerProduct, Insurer_Object, specific_insurer_object);
            if (docLog && docLog.Product_Id == 2 && objProductResponse && objProductResponse.Health_Renewal_Proposal_Request_Core) {
                try {
                    var Client = require('node-rest-client').Client;
                    var client = new Client();
                    let proposal_request = objProductResponse.Health_Renewal_Proposal_Request_Core;
                    let args = {
                        data: JSON.stringify(proposal_request),
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        }
                    };
                    client.post(config.environment.weburl + '/quote/save_user_data', args, function (data, response) {
                        try {
                            if (data) {
                                console.error(data);
                            }

                        } catch (ex1) {
                            console.error('Error From Health Renewal Proposal Save : ', ex1.stack);
                        }
                    });
                } catch (e) {
                    console.error("Exception in renewal proposal save_user_data api call", e.stack);
                }
            }
            //objProductResponse.Payment.proposal_confirm_url = objInsurerProduct.proposal_confirm_url(insurer_id, Proposal_Id);
            if (specific_insurer_object.method.Method_Type === 'Proposal' || specific_insurer_object.method.Method_Type === 'Customer') {
                if (objProductResponse.Error_Msg && objProductResponse.Error_Msg !== 'NO_ERR' && objProductResponse.Error_Msg.indexOf('LM_PREMIUM_MISMATCH_') > -1 && objProductResponse.hasOwnProperty('Payment')) {
                    let Premium_Verification = objProductResponse.Error_Msg.substring(objProductResponse.Error_Msg.indexOf('{'));
                    Premium_Verification = JSON.parse(Premium_Verification);
                    objProductResponse.Payment.Premium_Verification = Premium_Verification;
                    objProductResponse.Error_Msg = "Premium revised from INR " + Math.round(Premium_Verification.Quote_Amt) + ' to INR ' + Math.round(Premium_Verification.Proposal_Amt);
                    if (Premium_Verification.Is_PG_Allowed === true) {
                        objProductResponse.Error_Msg += '<BR>Payment is allowed.<BR>If you want to continue, Kindly click on button Continue Payment';
                    } else {
                        objProductResponse.Error_Msg += '<BR>Payment is NOT allowed.<BR>Kindly choose from other Insurer quote(s)';
                    }
                }
            }
            if (['Proposal', 'Verification', 'Status', 'Pdf'].indexOf(specific_insurer_object.method.Method_Type) > -1) {
                if (objProductResponse.Error_Msg === 'NO_ERR' && specific_insurer_object.method.Method_Type === 'Proposal' && objProductResponse.Payment.pg_url === null) {
                    objProductResponse.Payment.pg_url = Insurer_Object.Payment_Gateway_URL;
                }
                let cond_ud = { "User_Data_Id": objInsurerProduct.lm_request['udid'] };
                User_Data.findOne(cond_ud, function (err, dbUserData) {
                    if (err) {

                    } else {
                        if (dbUserData) {
                            dbUserData = dbUserData._doc;
                            var Status_History = (dbUserData.Status_History) ? dbUserData.Status_History : [];
                            var ObjUser_Data = {};
                            var Last_Status = '';
                            var Form_Data = null;
                            var Insurer_Transaction_Identifier = (objProductResponse.hasOwnProperty('Insurer_Transaction_Identifier') && objProductResponse.Insurer_Transaction_Identifier !== null) ? objProductResponse.Insurer_Transaction_Identifier.toString() : '';
                            if (specific_insurer_object.method.Method_Type === 'Proposal') {
                                if (objProductResponse.Error_Msg === 'NO_ERR') {
                                    if (specific_insurer_object.method.Product_Id === 1 && dbUserData.Premium_Request.hasOwnProperty('is_breakin') && dbUserData.Premium_Request.is_breakin === 'yes' && (!(dbUserData.Premium_Request.vehicle_insurance_subtype.indexOf('0CH') > -1)) && dbUserData.Premium_Request.hasOwnProperty('is_inspection_done') && dbUserData.Premium_Request.is_inspection_done === 'no') {
                                        Last_Status = 'INSPECTION_SCHEDULED';
                                    } else {
                                        Last_Status = 'PROPOSAL_SUBMIT';
                                    }
                                    ObjUser_Data = {
                                        'Insurer_Transaction_Identifier': Insurer_Transaction_Identifier,
                                        'Payment_Request': objProductResponse.Payment
                                    };
                                    Form_Data = objProductResponse.Payment;
                                } else {
                                    Last_Status = 'PROPOSAL_EXCEPTION';
                                }
                            }
                            if (specific_insurer_object.method.Method_Type === 'Verification') {
                                if (objProductResponse.Error_Msg === 'NO_ERR') {
                                    ObjUser_Data = {
                                        'Transaction_Data': objProductResponse.Policy,
                                        'Transaction_Status': objProductResponse.Policy.transaction_status
                                    };
                                    if (objProductResponse.Policy.transaction_status === 'SUCCESS') {
                                        ObjUser_Data['ERP_CS'] = 'PENDING';
                                        ObjUser_Data['ERP_ENTRY'] = 'PENDING';
                                        Last_Status = 'TRANS_SUCCESS_WO_POLICY';
                                        if (objProductResponse.Policy.policy_url) {
                                            var pdf_file_name = objProductResponse.Policy.policy_url;
                                            pdf_file_name = pdf_file_name.split('/');
                                            pdf_file_name = pdf_file_name[pdf_file_name.length - 1];
                                            var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                                            if (fs.existsSync(pdf_sys_loc)) {
                                                var stats = fs.statSync(pdf_sys_loc);
                                                var fileSizeInBytes = stats.size;
                                                var fileSizeInKb = (fileSizeInBytes / 1024).toFixed(2);
                                                if (fileSizeInKb > 10) {
                                                    var bitmap = fs.readFileSync(pdf_sys_loc);
                                                    if (bitmap !== "") {
                                                        Last_Status = 'TRANS_SUCCESS_WITH_POLICY';
                                                    }
                                                }
                                            }

                                        }
                                    }
                                    if (objProductResponse.Policy.transaction_status === 'FAIL') {
                                        Last_Status = 'TRANS_FAIL';
                                    }
                                    if (objProductResponse.Policy.transaction_status === 'PAYPASS') {
                                        Last_Status = 'TRANS_PAYPASS';
                                    }

                                } else {
                                    Last_Status = 'VERIFICATION_EXCEPTION';
                                }
                                Form_Data = objProductResponse.Policy;
                            }
                            if (specific_insurer_object.method.Method_Type === 'Pdf') {
                                if (objProductResponse.Error_Msg === 'NO_ERR' && objProductResponse.hasOwnProperty('Policy')) {
                                    if (objProductResponse.Policy.pdf_status === 'SUCCESS') {
                                        if (objProductResponse.Policy.policy_url) {
                                            var pdf_file_name = objProductResponse.Policy.policy_url;
                                            pdf_file_name = pdf_file_name.split('/');
                                            pdf_file_name = pdf_file_name[pdf_file_name.length - 1];
                                            var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                                            if (fs.existsSync(pdf_sys_loc)) {
                                                var stats = fs.statSync(pdf_sys_loc);
                                                var fileSizeInBytes = stats.size;
                                                var fileSizeInKb = (fileSizeInBytes / 1024).toFixed(2);
                                                if (fileSizeInKb > 10) {
                                                    var bitmap = fs.readFileSync(pdf_sys_loc);
                                                    if (bitmap !== "") {
                                                        Last_Status = 'TRANS_SUCCESS_WITH_POLICY';
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            // Recon API
                            if (specific_insurer_object.method.Method_Type === 'Status') {
                                if (objProductResponse.Error_Msg === 'NO_ERR' && objProductResponse.Pg_Status === "SUCCESS") {
                                    //Last_Status = 'TRANS_SUCCESS_WO_POLICY';
                                    var Client = require('node-rest-client').Client;
                                    var client = new Client();
                                    var data_req = {
                                        "api_reference_number": objProduct['lm_request']['api_reference_number'],
                                        "search_reference_number": objProduct['lm_request']['search_reference_number'],
                                        "execution_async": "no",
                                        "insurer_id": objInsurerProduct.lm_request['insurer_id'],
                                        "method_type": "Verification",
                                        "pg_url": "http://localhost:7000/transaction-status/" + objProduct['lm_request']['udid'] + "/" + objProduct['lm_request']['crn'] + "/" + objProduct['lm_request']['proposal_id'],
                                        "pg_get": {},
                                        "pg_post": objProductResponse.pg_post,
                                        "pg_redirect_mode": "POST",
                                        "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
                                        "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
                                        "calling_type": "Status"
                                    };
                                    var args = {
                                        data: data_req,
                                        headers: {
                                            "Content-Type": "application/json",
                                            'client_key': objProduct.lm_request['client_key'],
                                            'secret_key': objProduct.lm_request['secret_key']
                                        }
                                    };

                                    client.post(config.environment.weburl + '/quote/verification_initiate', args, function (data, response) {

                                    });
                                }
                                //else {
                                //Last_Status = 'TRANS_FAIL';
                                //}
                                let objRequest = {
                                    "Recon_Reference_Number": objProductResponse.Recon_Reference_Number,
                                    "udid": objProduct['lm_request']['udid'],
                                    "Transaction_status": "TRANS_SUCCESS_WITH_POLICY",
                                    "Product_Id": objInsurerProduct.lm_request['product_id'],
                                    "Insurer_Id": objInsurerProduct.lm_request['insurer_id'],
                                    "Request": JSON.parse(objInsurerProduct.method_content_replaced),
                                    "Response": objProductResponse['Data'],
                                    "PG_data": objProductResponse.pg_post,
                                    "Created_On": new Date(),
                                    "Modified_On": new Date()
                                };
                                var recon_status = require('../models/recon_status');
                                var objrecon_status = new recon_status(objRequest);
                                objrecon_status.save(function (err, objDB) {
                                    if (err) {
                                        console.error('Exception', 'Recon_status_Save_Err', err, objRequest);
                                    }

                                });
                            }
                            Status_History.unshift({
                                "Status": Last_Status,
                                "StatusOn": new Date(),
                                "Data": Form_Data
                            });
                            if (Last_Status !== '') {
                                ObjUser_Data.Last_Status = Last_Status;
                                ObjUser_Data.Status_History = Status_History;
                                if (specific_insurer_object.method.Method_Type !== 'Pdf') {
                                    ObjUser_Data.Modified_On = new Date();
                                }
                                User_Data.update({ 'User_Data_Id': dbUserData['User_Data_Id'] }, { $set: ObjUser_Data }, function (err, numAffected) {
                                    if (specific_insurer_object.method.Method_Type === 'Proposal') {//save proposal history start
                                        try {
                                            console.error('DBG', 'PROPOSAL_SAVE', objInsurerProduct.lm_request['proposal_id']);
                                            if (objInsurerProduct.lm_request['proposal_id'] > 0) {
                                                let objProposal = {
                                                    'Service_Log_Unique_Id': docLog['Service_Log_Unique_Id'],
                                                    'Proposal_Request': dbUserData.Proposal_Request_Core,
                                                    'Insurer_Transaction_Identifier': (Insurer_Transaction_Identifier !== null) ? Insurer_Transaction_Identifier.toString() : '',
                                                    'Status': (objProductResponse.Error_Msg === 'NO_ERR') ? 'PROPOSAL' : 'EXCEPTION',
                                                    'Modified_On': new Date()
                                                };
                                                if (docLog['Service_Log_Id'] > 0) {
                                                    objProposal['Service_Log_Id'] = docLog['Service_Log_Id'];
                                                }
                                                var Proposal = require('../models/proposal');
                                                Proposal.update({ 'Proposal_Id': objInsurerProduct.lm_request['proposal_id'] - 0 }, { $set: objProposal }, function (err, numAffected) {
                                                    if (err) {
                                                        console.error('Exception', 'Proposal_Save_Err_Base', err, objProposal);
                                                    }

                                                });
                                            }
                                        } catch (e) {
                                            console.error('Exception', 'ProposalHistorySave', e);
                                        }
                                    }
                                    if (specific_insurer_object.method.Method_Type === 'Verification') {
                                        if (['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY'].indexOf(Last_Status) > -1 && dbUserData['PB_CRN'] > 0 && dbUserData['User_Data_Id'] > 0) {
                                            objInsurerProduct.send_verification_notification(dbUserData['User_Data_Id']);
                                        }
                                    }
                                    if (specific_insurer_object.method.Method_Type === 'Pdf') {
                                        if (['TRANS_SUCCESS_WITH_POLICY'].indexOf(Last_Status) > -1) {
                                            objInsurerProduct.send_policy_upload_notification(dbUserData['User_Data_Id']);
                                        }
                                    }
                                });
                            }
                        }
                    }
                });
            }
            if (objProductResponse.Error_Msg === 'NO_ERR' && specific_insurer_object.method.Method_Type === 'Renewal') {
                this.health_renewal_initiate_handler(objProductResponse);
            }
            if (objProductResponse.Error_Msg === 'NO_ERR' && specific_insurer_object.method.Method_Type === 'Status') {
                this.proposal_status_initiate_handler(objProductResponse);
            }
            if (objProductResponse.Error_Msg === 'NO_ERR' && specific_insurer_object.method.Method_Type === 'Renewal') {
                this.personal_accident_renewal_initiate_handler(objProductResponse);
            }


            if (objProductResponse.Error_Msg === 'NO_ERR') {
                return objInsurerProduct.error_process_post_handler(docLog, objProductResponse, objResponseFull, objError, specific_insurer_object);
            } else {
                var Error_Code = objInsurerProduct.error_handler(docLog, objProductResponse, objResponseFull, specific_insurer_object);
            }
        }
        //console.log(this.constructor.name, 'base_response_handler', 'Finish');
    } catch (e) {
        console.error('Exception', this.constructor.name, 'base_response_handler', e);
    }
}
Base.prototype.error_process_post_handler = function (docLog, objProductResponse, objResponseFull, objError, specific_insurer_object) {
    var objBase = this;
    var Error_Code = '';
    var method_type = specific_insurer_object.method.Method_Type;
    let Product_Id = docLog.Product_Id;
    if (objResponseFull.err) {
        Error_Code = 'LM001';
        var docLogModify = {
            "Insurer_Response": objResponseFull.objResponseJson,
            "Insurer_Response_Core": objResponseFull.raw,
            "Premium_Breakup": null,
            "Status": "complete",
            "Error_Code": Error_Code,
            "Error": objError,
            "Call_Execution_Time": 0
        };
    } else {
        Error_Code = (objError) ? objError.Error_Code : '';
        var docLogModify = {
            "Insurer_Response": objResponseFull.objResponseJson,
            "Insurer_Transaction_Identifier": objProductResponse.Insurer_Transaction_Identifier,
            "Insurer_Response_Core": objResponseFull.raw,
            "Premium_Breakup": objProductResponse.Premium_Breakup,
            "Premium_Rate": objProductResponse.Premium_Rate,
            "Status": "complete",
            "Error_Code": Error_Code,
            "Error": objError
        };
        if ([1, 10, 12].indexOf(Product_Id) > -1 && Error_Code !== '' && Error_Code && ['LM009', 'LM010', 'LM265'].indexOf(Error_Code) > -1) {
            try {
                if (Error_Code === 'LM009' || Error_Code === 'LM265') {
                    docLogModify['Error_Details'] = objBase.insurer_master['vehicles']['pb_db_master'];
                }
                if (Error_Code === 'LM010') {
                    docLogModify['Error_Details'] = objBase.insurer_master['rtos']['pb_db_master'];
                }
            } catch (e) {
                console.error('Exception', 'RTO_VEH_PROCESS', e.stack);
            }
        }
        if (Product_Id === 2) {
            docLogModify['Premium_Response'] = objProductResponse.Premium_Response;
        }
        if (method_type === 'Customer') {
            Object.assign(docLogModify, { 'Customer': objProductResponse.Customer });
        }
        if (method_type === 'Proposal') {
            Object.assign(docLogModify, { 'Payment': objProductResponse.Payment });
        }
        if (method_type === 'Verification' || method_type === 'Pdf' || method_type === 'Status') {
            Object.assign(docLogModify, { 'Policy': objProductResponse.Policy });
        }
        if (method_type === 'Coverage') {
            Object.assign(docLogModify, { 'Coverage': objProductResponse.Coverage });
        }
    }

    this.save_log(docLog, docLogModify);
    //ERP Data Push Start


    var erp_op_type = '';
    if (method_type === 'Proposal' && Error_Code == '') {
        if (docLog["LM_Custom_Request"]["product_id"] === 1 || docLog["LM_Custom_Request"]["product_id"] === 10 || docLog["LM_Custom_Request"]["product_id"] === 12) {
            this.motor_erp_qt_data_prepare('QT');
        }
        if (docLog["LM_Custom_Request"]["product_id"] === 2 || docLog["LM_Custom_Request"]["product_id"] === 16) {
            this.health_erp_qt_data_prepare('QT');
        }
        if (docLog["LM_Custom_Request"]["product_id"] === 18) {
            this.cyber_erp_qt_data_prepare('QT');
        }
        if (docLog["LM_Custom_Request"]["product_id"] === 19) {
            this.workmen_erp_qt_data_prepare('QT');
        }
        if (docLog["LM_Custom_Request"]["product_id"] === 4) {
            this.travel_erp_qt_data_prepare('QT');
        }
        if (docLog["LM_Custom_Request"]["product_id"] === 8) {
            this.personal_accident_erp_qt_data_prepare('QT');
        }
    }
    if (method_type === 'Verification') {


        erp_op_type = 'CS';


    }



    //ERP Data Push Finish

    if (method_type === 'Customer' || method_type === 'Proposal' || method_type === 'Verification' || method_type === 'Pdf' || method_type === 'Status') {
        var clsProduct = specific_insurer_object.method.Method_Name;
        clsProduct = clsProduct.toString().split('_')[0];
        var productName = '';
        if (specific_insurer_object.method.Product_Id === 1) {
            productName = 'CAR';
        }
        if (specific_insurer_object.method.Product_Id === 10) {
            productName = 'TW';
        }
        if (specific_insurer_object.method.Product_Id === 2) {
            productName = 'HEALTH';
            if (specific_insurer_object.method.Insurer_Id === 21) {
                clsProduct = "HDFCErgoGeneral";
            } else if (specific_insurer_object.method.Insurer_Id === 34) {
                clsProduct = "CareHealth";
            }
        }
        if (specific_insurer_object.method.Product_Id === 4) {
            productName = 'TRAVEL';
        }
        if (specific_insurer_object.method.Product_Id === 12) {
            productName = 'CV';
        }
        if (specific_insurer_object.method.Product_Id === 13) {
            productName = 'Marine';
        }
        if (specific_insurer_object.method.Product_Id === 5) {
            productName = 'Investment';
        }
        if (specific_insurer_object.method.Product_Id === 15) {
            productName = 'Cycle';
        }
        if (specific_insurer_object.method.Product_Id === 17) {
            productName = 'Corona Care';
        }
        if (specific_insurer_object.method.Product_Id === 16) {
            productName = 'Cancer Care';
        }
        if (specific_insurer_object.method.Product_Id === 18) {
            productName = 'Cyber Security';
        }
        if (specific_insurer_object.method.Product_Id === 8) {
            productName = 'PersonalAccident';
        }
        let Proposal_Response_Type = 'INFO';
        if (objError) {
            if (objError.Error_Action === 'UI_VALIDATION') {
                Proposal_Response_Type = 'VALIDATION';
            } else {
                Proposal_Response_Type = 'ERR';
            }
            Proposal_Response_Type += '-' + objError.Error_Code;
        }
        var sub = '[' + config.environment.name.toString().toUpperCase() + ']' + Proposal_Response_Type;
        if (method_type === 'Verification') {
            sub += '-' + docLogModify.Policy['transaction_status'];
        }

        var user_type = (objBase.lm_request['is_posp'] === 'yes') ? 'Posp' : 'NonPosp';
        var user_sub_type = 'EMP';
        if ((objBase.lm_request['posp_sources'] - 0) == 1) {
            user_sub_type = 'FM-DC';
        }
        if ((objBase.lm_request['posp_sources'] - 0) == 2) {
            user_sub_type = 'FM-SM';
        }
        var app_version = (objBase.lm_request['app_version'] == 'PolicyBoss.com') ? 'PolicyBoss.com' : ('App' + objBase.lm_request['app_version']);
        sub += '-' + user_type + '-' + app_version + '-' + productName + '-' + method_type + '-' + clsProduct + '-CRN:' + this.lm_request['crn'];
        if (this.lm_request.hasOwnProperty('proposal_id')) {
            sub += '-' + this.lm_request['proposal_id'];
        }


        var msg = '<!DOCTYPE html><html><head><title>Proposal Report</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
        var dt = new Date();
        if (objError) {
            msg += '<div class="report"><span  style="font-family:tahoma;font-size:18px;">Error&nbsp;Details</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
            for (var k in objError) {
                msg += '<tr><td  width="20%" style="font-size:14px;font-family:tahoma;background-color: #ffcc00">' + k + '</td><td  width="78%" style="font-family:tahoma;font-size:14px;">' + objError[k] + '&nbsp;</td></tr>';
            }
            msg += '</table></div><br><br>';
            try {
                if (objError.Error_Action === 'UI_VALIDATION') {

                } else {
                    var agent_name = 'Direct Customer';
                    var agent_mobile = 0;
                    if (objBase.lm_request['ss_id'] > 0) {
                        agent_name = objBase.lm_request['posp_first_name'] + ' ' + objBase.lm_request['posp_last_name'];
                        agent_mobile = objBase.lm_request['posp_mobile_no'];
                    }
                    if (!isNaN(objBase.lm_request['lm_agent_mobile']) && objBase.lm_request['lm_agent_mobile'] > 0) {
                        agent_mobile = objBase.lm_request['lm_agent_mobile'];
                    }
                    if (objBase.lm_request['lm_agent_name'] != '') {
                        agent_name = objBase.lm_request['lm_agent_name'];
                    }

                    if (method_type === 'Customer' || method_type === 'Proposal' || method_type === 'Verification' || method_type === 'Status' || method_type === 'Renewal') {
                        // sending method err msg start
                        //request_url
                        var SmsLog = require('../models/sms_log');
                        var objsmsLog = new SmsLog();
                        var obj_err_sms = {
                            '___business_source___': user_type + "_" + user_sub_type,
                            '___crn___': objBase.lm_request['crn'],
                            '___product___': productName,
                            '___agent_name___': agent_name,
                            '___agent_mobile___': agent_mobile,
                            '___first_name___': objBase.lm_request['first_name'],
                            '___last_name___': objBase.lm_request['last_name'],
                            '___mobile___': objBase.lm_request['mobile'],
                            '___final_premium___': objBase.lm_request['final_premium'],
                            '___method_type___': objBase.lm_request['method_type'],
                            '___insurerco_name___': clsProduct,
                            '___error___': objError.Error_Code + '::' + objError.Error_Specific,
                            '___current_dt___': dt.toLocaleString()
                        };
                        var err_sms_data = objsmsLog.methodErrMsg(obj_err_sms);
                        if (config.environment.name === 'Production') {
                            if (objBase.lm_request['product_id'] === 2) {
                                //                                objsmsLog.send_sms('9833341817', err_sms_data, 'METHOD_ERR_MSG'); //Soman
                                //objsmsLog.send_sms('9594646237', err_sms_data, 'METHOD_ERR_MSG'); //Revati
                            }
                            //objsmsLog.send_sms('7208803933', err_sms_data, 'METHOD_ERR_MSG'); //Ashish
                            //objsmsLog.send_sms('9967192191', err_sms_data, 'METHOD_ERR_MSG'); //Vijay
                            //                            objsmsLog.send_sms('9768463482', err_sms_data, 'METHOD_ERR_MSG'); //Vikram
                            //objsmsLog.send_sms('9768463482', err_sms_data, 'METHOD_ERR_MSG'); //Jatin
                            //objsmsLog.send_sms('7666020532', err_sms_data, 'METHOD_ERR_MSG');//Chirag
                            //objsmsLog.send_sms('9619160851', err_sms_data, 'METHOD_ERR_MSG'); //Anuj  
                        }
                        // sending method err msg stop
                    }
                }
            } catch (ex) {
                console.error('MethodErrSMS', ex);
            }

        } else {
            try {
                if (method_type === 'Proposal') {
                    var agent_name = 'Direct Customer';
                    var agent_mobile = 0;
                    if (objBase.lm_request['ss_id'] > 0) {
                        agent_name = objBase.lm_request['posp_first_name'] + ' ' + objBase.lm_request['posp_last_name'];
                        agent_mobile = objBase.lm_request['posp_mobile_no'];
                    }
                    if (!isNaN(objBase.lm_request['lm_agent_mobile']) && objBase.lm_request['lm_agent_mobile'] > 0) {
                        agent_mobile = objBase.lm_request['lm_agent_mobile'];
                    }
                    if (objBase.lm_request['lm_agent_name'] != '') {
                        agent_name = objBase.lm_request['lm_agent_name'];
                    }
                    var SmsLog = require('../models/sms_log');
                    var objsmsLog = new SmsLog();
                    var obj_err_sms = {
                        '___business_source___': objBase.lm_request['client_name'],
                        '___crn___': objBase.lm_request['crn'],
                        '___product___': productName,
                        '___agent_name___': agent_name,
                        '___posp_sub_fba_name___': '',
                        '___posp_sub_fba_mobile_no___': 0,
                        '___agent_mobile___': agent_mobile,
                        '___first_name___': objBase.lm_request['first_name'],
                        '___last_name___': objBase.lm_request['last_name'],
                        '___mobile___': objBase.lm_request['mobile'],
                        '___final_premium___': objBase.lm_request['final_premium'],
                        '___method_type___': objBase.lm_request['method_type'],
                        '___insurerco_name___': clsProduct,
                        '___link_sent_on___': '',
                        '___proposal_attempt_cnt___': 0,
                        '___current_dt___': dt.toLocaleString()
                    };

                    User_Data.findOne({ "User_Data_Id": objBase.lm_request['udid'] - 0 }, function (err, dbUserData) {
                        if (err) {

                        } else {
                            if (dbUserData) {
                                if (dbUserData._doc['PB_CRN'] > 0) {
                                    let Obj_Link = {
                                        'Status': 'PROPOSAL',
                                        'Modified_On': new Date()
                                    };
                                    var Link = require('../models/link');
                                    Link.update({
                                        'PB_CRN': dbUserData._doc['PB_CRN'],
                                        'Insurer_Id': objBase.lm_request['insurer_id'] - 0
                                    }, { $set: Obj_Link }, function (err, numAffected) {
                                        //console.log('UserDataPolicyDataUpdate', err, numAffected);
                                    });
                                }
                                var proposal_attempt_cnt = 0;
                                var link_sent_on = '';
                                var proposal_link_cnt = 0;
                                for (var k in dbUserData.Status_History) {
                                    if (dbUserData.Status_History[k]['Status'] == 'PROPOSAL_LINK_SENT') {
                                        proposal_link_cnt++;
                                        if (link_sent_on == '') {
                                            link_sent_on = (new Date(dbUserData.Status_History[k]['StatusOn'])).toLocaleString();
                                        }
                                    }
                                    if (dbUserData.Status_History[k]['Status'] == 'PROPOSAL_SUBMIT') {
                                        proposal_attempt_cnt++;
                                    }
                                }
                                proposal_attempt_cnt++;
                                if (dbUserData['Premium_Request'].hasOwnProperty('posp_sub_fba_id') && dbUserData['Premium_Request']['posp_sub_fba_id'] > 0) {
                                    obj_err_sms['___posp_sub_fba_name___'] = dbUserData['Premium_Request']['posp_sub_fba_name'];
                                    obj_err_sms['___posp_sub_fba_mobile_no___'] = dbUserData['Premium_Request']['posp_sub_fba_mobile_no'];
                                }


                                obj_err_sms['___link_sent_on___'] = link_sent_on;
                                obj_err_sms['___proposal_attempt_cnt___'] = proposal_attempt_cnt;
                                obj_err_sms['___proposal_link_cnt___'] = proposal_link_cnt;
                                obj_err_sms['___ip_address___'] = objBase.lm_request['ip_address'];
                                obj_err_sms['___proposal_id___'] = objBase.lm_request['proposal_id'];
                                var proposal_ack_data = objsmsLog.proposalSubmitAckMsg(obj_err_sms);
                                proposal_ack_data = proposal_ack_data.replace('SubFba: (Mob:0)\n', '');
                                if (objBase.lm_request['product_id'] == '2') {
                                    //objsmsLog.send_sms('9833341817', proposal_ack_data, 'PROPOSAL_ACK_MSG', dbUserData['PB_CRN']);//Soman
                                }
                                if (agent_mobile > 0) {
                                    objsmsLog.send_sms(agent_mobile, proposal_ack_data, 'PROPOSAL_ACK_MSG', dbUserData['PB_CRN']);
                                }
                                if (dbUserData['Premium_Request'].hasOwnProperty('posp_sub_fba_mobile_no') && dbUserData['Premium_Request']['posp_sub_fba_mobile_no'] > 0) {
                                    objsmsLog.send_sms(dbUserData['Premium_Request']['posp_sub_fba_mobile_no'], proposal_ack_data, 'PROPOSAL_ACK_MSG', dbUserData['PB_CRN']);
                                }
                                if ((dbUserData['Premium_Request']["posp_sources"] - 0) > 0) {

                                }

                                if (dbUserData['Product_Id'] == 1 && dbUserData['Premium_Request']['ui_source'] === 'UI22') {
                                    /*
                                    let arr_sms_notify = [];									
                                    arr_sms_notify.push('7666020532'); //Chirag
                                    arr_sms_notify.push('9321332485'); //Amish
                                    arr_sms_notify.push('9967192191'); //Vijay
                                    arr_sms_notify.push('7208803933'); //Ashish
                                    for(let z of arr_sms_notify){
                                        objsmsLog.send_sms(z, proposal_ack_data, 'PROPOSAL_ACK_MSG', dbUserData['PB_CRN']);
                                    }
                                    */
                                }
                                //email notification process
                                try {
                                    if (dbUserData['Premium_Request']['ss_id'] - 0 > 0) {
                                        var objProduct = {
                                            '1': 'Car',
                                            '2': 'Health',
                                            '4': 'Travel',
                                            '10': 'TW',
                                            '12': 'CV',
                                            '18': 'CyberSecurity',
                                            '13': 'Marine',
                                            '8': 'PersonalAccident',
                                            '19': 'WorkmenCompensation'
                                        };
                                        var product_short_name = objProduct[dbUserData['Product_Id']];
                                        var sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[' + product_short_name + '][Attempt:' + proposal_attempt_cnt + '][PROPOSAL:' + objBase.lm_request['proposal_id'] + '] REDIRECT_TO_PG - CRN : ' + dbUserData['PB_CRN'];
                                        var arr_to = [];
                                        var arr_bcc = [config.environment.notification_email];
                                        var arr_cc = [];
                                        var email_body = proposal_ack_data.replace(/\n/g, '<BR>');
                                        var email_data = '<!DOCTYPE html><html><head><title>PROPOSAL_SUBMIT_NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                                        email_data += '<div class="report"><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">PROPOSAL_SUBMIT_NOTIFICATION</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
                                        email_data += '<tr><td  width="70%" style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">' + email_body + '&nbsp;</td></tr>';
                                        email_data += '</table></div><br></body></html>';
                                        if (dbUserData['Premium_Request'].hasOwnProperty('posp_email_id') && dbUserData['Premium_Request']['posp_email_id'] != null && dbUserData['Premium_Request']['posp_email_id'].toString().indexOf('@') > -1) {
                                            arr_to.push(dbUserData['Premium_Request']['posp_email_id']);
                                        }
                                        if (dbUserData['Premium_Request'].hasOwnProperty('posp_reporting_email_id') && dbUserData['Premium_Request']['posp_reporting_email_id'] != null && dbUserData['Premium_Request']['posp_reporting_email_id'].toString().indexOf('@') > -1) {
                                            arr_cc.push(dbUserData['Premium_Request']['posp_reporting_email_id']);
                                        }
                                        if (dbUserData['Premium_Request'].hasOwnProperty('posp_sub_fba_email') && dbUserData['Premium_Request']['posp_sub_fba_email'] != null && dbUserData['Premium_Request']['posp_sub_fba_email'].toString().indexOf('@') > -1) {
                                            arr_cc.push(dbUserData['Premium_Request']['posp_sub_fba_email']);
                                        }
                                        if (config.environment.name === 'Production') {
                                            if ((dbUserData['Premium_Request']['posp_sources'] - 0) > 0) {
                                                if ((dbUserData['Premium_Request']['posp_sources'] - 0) == 1) {
                                                    arr_bcc.push('transactions.1920@gmail.com'); //finmart-dc
                                                }
                                            }
                                        }
                                        if (arr_to.length) {
                                            objModelEmail.send('notifications@policyboss.com', arr_to.join(','), sub, email_data, arr_cc.join(','), arr_bcc.join(','), dbUserData['PB_CRN']);
                                        }
                                    }
                                } catch (e) {
                                    console.error('Exception', 'Notification_RM_Proposal_Team', e);
                                }


                                //finmart status push
                                if (dbUserData['Premium_Request'].hasOwnProperty('device_id') && (dbUserData['Premium_Request']["posp_sources"] - 0) > 0) {
                                    var fba_id = dbUserData['Premium_Request']["posp_fba_id"];
                                    if (dbUserData['Premium_Request'].hasOwnProperty('fba_id') && (dbUserData['Premium_Request']['fba_id'] - 0) > 0) {
                                        fba_id = (dbUserData['Premium_Request']['fba_id'] - 0);
                                    }
                                    objBase.fm_status_push(fba_id, dbUserData['PB_CRN'], dbUserData['Product_Id'], 'SUBMIT');
                                }
                            }
                        }
                    });
                }
            } catch (ex) {
                console.error('MethodErrSMS', ex);
            }
        }

        var service_url = config.environment.weburl + '/service_logs/' + docLog.Service_Log_Id + '/';
        var objLogJson = [
            "Call_Execution_Time",
            'LM_Custom_Request',
            'Insurer_Request',
            'Insurer_Response',
            'Insurer_Response_Core',
            'Premium_Breakup',
            'Customer',
            'Payment',
            'Policy'
        ];
        // http://qa-horizon.policyboss.com:3000/requests/1659/Request_Core
        msg += '<div class="report"><span  style="font-family:tahoma;font-size:18px;">Log&nbsp;Details</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
        var service_url = config.environment.weburl + '/requests/' + docLog.Request_Id + '/Request_Core';
        msg += '<tr><td width="20%" style="font-size:14px;font-family:tahoma;background-color: #ffcc00">LM_Request</td><td width="78%" style="font-family:tahoma;font-size:14px;"><a href="' + service_url + '" target="_BLANK">View</a>&nbsp;</td></tr>';
        var moment = require('moment');
        var StartDate = moment(docLog.Created_On);
        var EndDate = moment(new Date());
        var Call_Execution_Time = EndDate.diff(StartDate);
        Call_Execution_Time = Math.round((Call_Execution_Time * 0.001) * 100) / 100;
        for (var k in objLogJson) {
            if (objLogJson[k] === 'Call_Execution_Time') {
                msg += '<tr><td width="20%" style="font-size:14px;font-family:tahoma;background-color: #ffcc00">' + objLogJson[k] + '</td><td width="78%" style="font-family:tahoma;font-size:14px;">' + Call_Execution_Time + '&nbsp;Seconds&nbsp;</td></tr>';
            } else {
                var service_url = config.environment.weburl + '/service_logs/' + docLog.Service_Log_Id + '/' + objLogJson[k];
                msg += '<tr><td width="20%" style="font-size:14px;font-family:tahoma;background-color: #ffcc00">' + objLogJson[k] + '</td><td width="78%" style="font-family:tahoma;font-size:14px;"><a href="' + service_url + '" target="_BLANK">View</a>&nbsp;</td></tr>';
            }
        }
        msg += '</table></div><br><br>';
        if (method_type === 'Proposal') {
            //for premium api log
            msg += '<div class="report"><span  style="font-family:tahoma;font-size:18px;">Premium Log&nbsp;Details</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
            var objLogJsonPremium = [
                'LM_Custom_Request',
                'Insurer_Request',
                'Insurer_Response',
                'Insurer_Response_Core',
                'Premium_Breakup'
            ];
            for (var k in objLogJsonPremium) {
                var service_url = config.environment.weburl + '/service_logs/' + this.lm_request['slid'] + '/' + objLogJsonPremium[k];
                msg += '<tr><td width="20%" style="font-size:14px;font-family:tahoma;background-color: #ffcc00">' + objLogJsonPremium[k] + '</td><td width="78%" style="font-family:tahoma;font-size:14px;"><a href="' + service_url + '" target="_BLANK">View</a>&nbsp;</td></tr>';
            }
            msg += '</table></div><br><br>';
            //for premium api log

            if (this.lm_request.hasOwnProperty('ip_address') && this.lm_request['ip_address'] !== '' && this.lm_request['ip_address'] !== '::1' || true) {
                var objURL = null;
                if (this.lm_request['product_id'] == 1 || this.lm_request['product_id'] == 12) {
                    objURL = {
                        'Quote_Page_URL': config.environment.portalurl + '/CarInsuranceIndia/NewQuotePage?SID=' + docLog.Request_Unique_Id + "_" + this.lm_request['udid'] + '&ClientID=' + docLog.Client_Id,
                        'Proposal_Page_URL': config.environment.portalurl + '/buynowprivatecar/' + docLog.Client_Id + '/' + this.lm_request['api_reference_number'] + "_" + this.lm_request['slid'] + "_" + this.lm_request['udid'] + '/NONPOSP/0'
                    };
                }
                if (this.lm_request['product_id'] == 10) {
                    objURL = {
                        'Quote_Page_URL': config.environment.portalurl + '/TwoWheelerInsurance/NewQuotePage?SID=' + docLog.Request_Unique_Id + "_" + this.lm_request['udid'] + '&ClientID=' + docLog.Client_Id,
                        'Proposal_Page_URL': config.environment.portalurl + '/buynowTwoWheeler/' + docLog.Client_Id + '/' + this.lm_request['api_reference_number'] + "_" + this.lm_request['slid'] + "_" + this.lm_request['udid'] + '/NONPOSP/0'
                    };
                }
                if (this.lm_request['product_id'] == 2) {
                    // http://www.policyboss.com/Health/quotes?SID=SRN-HWWJBSFY-URFQ-ZSS4-B4XD-H6259ZUV693P&ClientID=2
                    //http://www.policyboss.com/Health/proposal-details?client_id=2&arn=ARN-FWC3O766-GBQR-AKYR-3JW7-ATNCRVCCEA5L&is_posp=NonPOSP&ss_id=0 
                    objURL = {
                        'Quote_Page_URL': config.environment.portalurl + '/Health/quotes?SID=' + docLog.Request_Unique_Id + "_" + this.lm_request['udid'] + '&ClientID=' + docLog.Client_Id,
                        'Proposal_Page_URL': config.environment.portalurl + '/Health/proposal-details?client_id=' + docLog.Client_Id + '&arn=' + this.lm_request['api_reference_number'] + "_" + this.lm_request['slid'] + "_" + this.lm_request['udid'] + '&is_posp=NONPOSP&ss_id=0'
                    };
                }
                if (this.lm_request['product_id'] == 13) {
                    objURL = {
                        'Quote_Page_URL': config.environment.portalurl + '/marine_quote',
                        'Proposal_Page_URL': config.environment.portalurl + '/marine_proposal?client_id=' + docLog.Client_Id + '&arn=' + this.lm_request['api_reference_number'] + "_" + this.lm_request['slid'] + "_" + this.lm_request['udid'] + '&is_posp=NONPOSP&ss_id=0'
                    };
                }
                if (this.lm_request['product_id'] == 5) {
                    objURL = {
                        'Quote_Page_URL': config.environment.portalurl + '/marine_quote',
                        'Proposal_Page_URL': config.environment.portalurl + '/marine_proposal?client_id=' + docLog.Client_Id + '&arn=' + this.lm_request['api_reference_number'] + "_" + this.lm_request['slid'] + "_" + this.lm_request['udid'] + '&is_posp=NONPOSP&ss_id=0'
                    };
                }
                if (this.lm_request['product_id'] == 8) {
                    objURL = {
                        'Quote_Page_URL': config.environment.portalurl + '/PersonalAccident/quotes?SID=' + docLog.Request_Unique_Id + "_" + this.lm_request['udid'] + '&ClientID=' + docLog.Client_Id,
                        'Proposal_Page_URL': config.environment.portalurl + '/PersonalAccident/proposal-details?client_id=' + docLog.Client_Id + '&arn=' + this.lm_request['api_reference_number'] + "_" + this.lm_request['slid'] + "_" + this.lm_request['udid'] + '&is_posp=NONPOSP&ss_id=0'
                    };
                }
                if (objURL) {
                    msg += '<div class="report"><span  style="font-family:tahoma;font-size:18px;">URL&nbsp;Details</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
                    for (var k in objURL) {
                        msg += '<tr><td  width="20%" style="font-size:14px;font-family:tahoma;background-color: #ffcc00">' + k + '</td><td  width="78%" style="font-family:tahoma;font-size:14px;"><a href="' + objURL[k] + '" target="_BLANK">Open&nbsp;Page</a>&nbsp;</td></tr>';
                    }
                    msg += '</table></div><br><br>';
                }
            }
        }

        if (method_type === 'Verification' || method_type === 'Pdf' || method_type === 'Status') {
            msg += '<div class="report"><span  style="font-family:tahoma;font-size:18px;">Policy&nbsp;Details</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
            for (var k in docLogModify.Policy) {
                msg += '<tr><td  width="20%" style="font-size:14px;font-family:tahoma;background-color: #ffcc00">' + k + '</td><td  width="78%" style="font-family:tahoma;font-size:14px;">' + docLogModify.Policy[k] + '&nbsp;</td></tr>';
            }
            msg += '</table></div><br><br>';
        }

        msg += '</body></html>';
        var Email = require('../models/email');
        var objModelEmail = new Email();
        objModelEmail.send('noreply@policyboss.com', config.environment.notification_email, sub, msg, '', '', objBase.lm_request['crn']);
    }
    if (this.lm_request['execution_async'] === 'no' && method_type !== 'Idv') {
        var objServiceLog = {
            "Service_Log_Id": docLog['Service_Log_Id'],
            "Service_Log_Unique_Id": docLog['Service_Log_Unique_Id'] + '_' + docLog['Service_Log_Id'] + '_' + this.lm_request['udid'],
            "Insurer_Id": docLog['Insurer_Id'],
            "Insurer": docLog['Insurer'],
            "Error_Code": (objError) ? objError.Error_Code : '',
            "Error": objError,
            "Call_Execution_Time": docLog.Call_Execution_Time,
            "User_Data_Id": this.lm_request['udid']
        };
        var thankyou = (config.environment.name === 'Production') ? 'http://horizon.policyboss.com/' : 'http://qa-horizon.policyboss.com/';
        if (method_type === 'Proposal') {
            Object.assign(objServiceLog, { "Payment": docLogModify.Payment });
        }
        if (method_type === 'Coverage') {
            Object.assign(objServiceLog, { "Coverage": docLogModify.Coverage });
        }
        if (method_type === 'Customer') {
            Object.assign(objServiceLog, { "Customer": docLogModify.Customer });
        }
        if (method_type === 'Verification' || method_type === 'Pdf' || method_type === 'Status') {
            Object.assign(objServiceLog, { "Policy": docLogModify.Policy });
            if (objServiceLog["Error_Code"] === "") {
                if (objServiceLog.Policy["transaction_status"] === "SUCCESS") {
                    thankyou += "transaction-status-success?udid=" + objServiceLog["User_Data_Id"];
                }
                if (objServiceLog.Policy["transaction_status"] === "FAIL") {
                    thankyou += "transaction-status-fail?udid=" + objServiceLog["User_Data_Id"];
                }
                if (objServiceLog.Policy["transaction_status"] === "PAYPASS") {
                    thankyou += "transaction-status-paypass?udid=" + objServiceLog["User_Data_Id"];
                }
            } else {
                thankyou += "transaction-status-error?udid=" + objServiceLog["User_Data_Id"];
            }
            Object.assign(objServiceLog, { "Thankyou_URL": thankyou });
        }
        objBase.response_object.json(objServiceLog);
    } else {
        return docLogModify.Premium_Breakup;
    }
};
Base.prototype.send_email_alert = function () {

};
Base.prototype.request_process = function (objRequestCore) {
    try {
        var objBase = this;
        // Connect to the db
        //console.log(objRequestCore, objRequestCore.product_id);
        //fetch product fields
        var Client = require('node-rest-client').Client;
        var objClient = new Client();
        objClient.get(config.environment.weburl + '/quote/cache/product/' + objRequestCore.product_id, {}, function (dataProduct, response) {
            try {
                //console.error('ProductDbg', dataProduct);
                var itemProductMaster = dataProduct;
                /*});
                 
                 var arr_product_id = [objRequestCore.product_id, 101];
                 if (objRequestCore.product_id == 10 || objRequestCore.product_id == 12) {
                 arr_product_id.push(1); // car product id
                 }
                 var search_product_condition = {
                 "Product_Id": {
                 "$in": arr_product_id
                 }
                 };
                 product.find(search_product_condition).toArray(function (err, itemProductMaster) {
                 */
                for (var k in itemProductMaster) {
                    if (itemProductMaster[k]['Product_Id'] === 101) {
                        var objGeneric = itemProductMaster[k];
                    }
                    if (itemProductMaster[k]['Product_Id'] === 1) {
                        var objCar = itemProductMaster[k];
                    }
                    if (itemProductMaster[k]['Product_Id'] === objRequestCore.product_id) {
                        var objProduct = itemProductMaster[k];
                    }
                }
                var ProductClass = require(appRoot + '/libs/' + objProduct.Product_Class);
                var User_Data_Premium = {};
                for (var k in objRequestCore) {
                    User_Data_Premium[k] = objRequestCore[k];
                }
                var objProductClass = new ProductClass();
                objProductClass.lm_request_core = objRequestCore;
                objProductClass.lm_request = objRequestCore;
                objProductClass.db_specific_product = objProduct;
                objProductClass.product_field_list = (objRequestCore.product_id === 10 || objRequestCore.product_id === 12) ? objCar.Product_Fields : objProduct.Product_Fields;
                objProductClass.response_object = objBase.response_object;
                objProductClass.Master_Details = objBase.Master_Details;
                objProductClass.proposal_processed_request = objBase.proposal_processed_request;
                objProductClass.request_unique_id = objBase.request_unique_id;
                objProductClass.udid = objBase.udid;
                objProductClass.client_id = objBase.client_id;
                objProductClass.request_process_handler = objBase.request_process_handler;
                objProductClass.base_api_pre();
                objProductClass.db_generic_product = objGeneric;
                objProductClass.generic_field_list = objGeneric.Product_Fields;
                //objBase.pb_crn_create(objRequestCore, objBase.client_id, objBase.request_unique_id);




                objProductClass.product_api_pre();

                if (objRequestCore.product_id === 2 || objRequestCore.product_id === 4) {
                    var adult_count = objProductClass.lm_request['adult_count'];
                    var child_count = objProductClass.lm_request['child_count'];
                    for (var k in objProduct.Product_Fields) {
                        if (objProduct.Product_Fields[k]['Field_Name'].indexOf('member_array') > -1) {
                            for (var x = 1; x <= adult_count; x++) {
                                var objArrField = Object.create(objProduct.Product_Fields[k]);
                                objArrField['Field_Name'] = objArrField['Field_Name'].replace('member_array', 'member_' + x);
                                objProductClass.product_field_list.push(objArrField);
                            }
                            for (var y = 3; y <= child_count + 2; y++) {
                                var objArrField = Object.create(objProduct.Product_Fields[k]);
                                objArrField['Field_Name'] = objArrField['Field_Name'].replace('member_array', 'member_' + y);
                                objProductClass.product_field_list.push(objArrField);
                            }
                        }
                    }
                }

                objProductClass.field_process_all(objProductClass.generic_field_list, 'generic');
                //console.log('Going to wait..');
                var objPospKey = {
                    "Posp_Id": 469,
                    "Fba_Id": 573,
                    "Sm_Posp_Id": 319,
                    "Sm_Posp_Name": "ASHISH  BANZAL",
                    "First_Name": "ASHOK",
                    "Middle_Name": "KUMAR",
                    "Last_Name": "BANJAL",
                    "Email_Id": "Ashokbanzal1204@gmail.com",
                    "Agent_City": "Indore",
                    "Mobile_No": 9893024750.0,
                    "Pan_No": "AQVPB7015K",
                    "Aadhar": 527397000000.0,
                    "Sources": 0,
                    "Ss_Id": 1702,
                    "Erp_Id": 106598,
                    "Last_Status": 106598,
                    "Gender": "Male",
                    "Posp_Category": "GI",
                    "Reporting_Agent_Uid": "GI",
                    "Reporting_Agent_Name": "GI",
                    "Reporting_Email_ID": "",
                    "Reporting_Mobile_Number": ""
                };
                for (var k in objPospKey) {
                    objRequestCore['posp_' + k.toString().toLowerCase()] = 0;
                    User_Data_Premium['posp_' + k.toString().toLowerCase()] = 0;
                }

                objRequestCore['posp_reporting_agent_uid'] = 508389;
                User_Data_Premium['posp_reporting_agent_uid'] = 508389;
                objRequestCore['posp_reporting_agent_name'] = 'POLICY BOSS WEBSITE';
                User_Data_Premium['posp_reporting_agent_name'] = 'POLICY BOSS WEBSITE';
                objRequestCore['posp_category'] = 'PolicyBoss';
                User_Data_Premium['posp_category'] = 'PolicyBoss';
                var Erp_Product_Source = {
                    '1': 'FRESH-MTR',
                    '2': 'FRESH-NM',
                    '8': 'FRESH-NM',
                    '17': 'FRESH-NM',
                    '9': 'FRESH-LIFE',
                    '10': 'FRESH-TW',
                    '12': 'FRESH-MTR',
                    '4': 'FRESH-NM'
                };
                var Erp_Product_Name = Erp_Product_Source[objProductClass.lm_request_core['product_id']];
                objRequestCore['erp_source'] = Erp_Product_Name;
                User_Data_Premium['erp_source'] = Erp_Product_Name;
                objRequestCore['is_posp'] = 'no';
                User_Data_Premium['is_posp'] = 'no';
                var is_allowed = true;
                var ss_id = 0;
                if (objRequestCore.hasOwnProperty('ss_id') && (objRequestCore['ss_id'] - 0) > 0) {
                    ss_id = (objRequestCore['ss_id'] - 0);
                }
                var fba_id = 0;
                if (objRequestCore.hasOwnProperty('fba_id') && (objRequestCore['fba_id'] - 0) > 0) {
                    fba_id = (objRequestCore['fba_id'] - 0);
                }
                if (ss_id > 0) {//for agent flow of employee , registered posp

                    try {
                        var data = objProductClass['Master_Details']['agent'];
                        objPospKey = {
                            "Posp_Id": 469,
                            "Fba_Id": 573,
                            "Sm_Posp_Id": 319,
                            "Sm_Posp_Name": "ASHISH  BANZAL",
                            "First_Name": "ASHOK",
                            "Middle_Name": "KUMAR",
                            "Last_Name": "BANJAL",
                            "Email_Id": "Ashokbanzal1204@gmail.com",
                            "Agent_City": "Indore",
                            "Mobile_No": 9893024750.0,
                            "Pan_No": "AQVPB7015K",
                            "Aadhar": 527397000000.0,
                            "Sources": 0,
                            "Ss_Id": 1702,
                            "Erp_Id": 106598,
                            "Last_Status": 106598,
                            "Gender": "Male",
                            "Posp_Category": "GI",
                            "Reporting_Agent_Uid": "GI",
                            "Reporting_Agent_Name": "GI",
                            "Reporting_Email_ID": "",
                            "Reporting_Mobile_Number": ""
                        };
                        if (data.hasOwnProperty('user_type') && data['user_type'] === 'POSP') {
                            let dbPosp = data['POSP'];
                            dbPosp['Sources'] = dbPosp['Sources'] - 0;
                            dbPosp['Erp_Id'] = dbPosp['Erp_Id'] - 0;
                            dbPosp['Fba_Id'] = dbPosp['Fba_Id'] - 0;
                            dbPosp['Last_Status'] = dbPosp['Last_Status'] - 0;
                            if (config.channel.Const_POSP_Channel.hasOwnProperty(dbPosp['Sources'] - 0) === true) {
                                if (dbPosp['Fba_Id'] !== fba_id) {
                                    if (dbPosp['Erp_Id'] > 0) {
                                        var arr_msg = ['fba is not matching in POSP(FBA_ID-' + dbPosp['Fba_Id'] + ') and FM-BO(FBA_ID-' + fba_id + ')'];
                                        var sub = '[' + config.environment.name.toString().toUpperCase() + ']ALERT-CERTIFIED_POSP_ACCESS_ALLOWED-FBA_ID_MISMATCH';
                                        email_data = '<html><body><h2><u>Error Details</u><BR>' + arr_msg.join('<BR>') + '</h2><p>Request</p><pre>' + JSON.stringify(objRequestCore, undefined, 2) + '</pre></body></html>';
                                        var Email = require('../models/email');
                                        var objModelEmail = new Email();
                                        objModelEmail.send('noreply@policyboss.com', config.environment.notification_email, sub, email_data, '', '', '');
                                        //dbPosp['Fba_Id'] = fba_id;
                                    } else {
                                        var arr_msg = ['fba is not matching in POSP(FBA_ID-' + dbPosp['Fba_Id'] + ') and FM-BO(FBA_ID-' + fba_id + ')', 'Please contact TechSupport'];
                                        var sub = '[' + config.environment.name.toString().toUpperCase() + ']ALERT-NON-CERTIFIED_POSP_ACCESS_DENIED-FBA_ID_MISMATCH';
                                        email_data = '<html><body><h2><u>Error Details</u><BR>' + arr_msg.join('<BR>') + '</h2><p>Request</p><pre>' + JSON.stringify(objRequestCore, undefined, 2) + '</pre></body></html>';
                                        var Email = require('../models/email');
                                        var objModelEmail = new Email();
                                        objModelEmail.send('noreply@policyboss.com', config.environment.notification_email, sub, email_data, '', '', '');
                                        //objBase.response_object.json({'Msg': 'Not Valid Request', 'Details': arr_msg, 'Status': 'VALIDATION'});
                                    }
                                    dbPosp['Fba_Id'] = fba_id;
                                }
                                if ([1, 2].indexOf(dbPosp['Sources']) < 0) { //only certified posp allowed
                                    is_allowed = (dbPosp['Erp_Id'] > 0) ? true : false;
                                }

                                if (dbPosp['Erp_Id'] > 0) {
                                    let code_series = dbPosp['Erp_Id'].toString().split('')[0] - 0;
                                    if (data['user_type'] === 'POSP' && (code_series !== 4 && code_series !== 6)) {
                                        is_allowed = false;
                                        var arr_msg = ['Access Denied as POSP is configured with other than 4 or 6 series code'];
                                        var sub = '[RESTRICTION]ACCESS_DENIED-POSP_WITH_WRONGSERIES-SSID:' + ss_id;
                                        email_data = '<html><body><h2><u>Agent Details</u><p>Request</p><pre>' + JSON.stringify(dbPosp, undefined, 2) + '</pre></body></html>';
                                        var Email = require('../models/email');
                                        var objModelEmail = new Email();
                                        objModelEmail.send('noreply@policyboss.com', config.environment.notification_email, sub, email_data, '', '', '');
                                        return objBase.response_object.json({ 'Msg': 'Access_Denied', 'Details': arr_msg, 'Status': 'VALIDATION' });
                                    }
                                }
                                if (dbPosp['Erp_Id'] > 0 && dbPosp['Last_Status'] == 6) {
                                    is_allowed = false;
                                    var arr_msg = ['Agent access is declined based on Document_Declined after certification'];
                                    var sub = '[' + config.environment.name.toString().toUpperCase() + ']ALERT-ACCESS_DENIED-DOCUMENT_DECLINED';
                                    email_data = '<html><body><h2><u>Agent Details</u><p>Request</p><pre>' + JSON.stringify(dbPosp, undefined, 2) + '</pre></body></html>';
                                    var Email = require('../models/email');
                                    var objModelEmail = new Email();
                                    objModelEmail.send('noreply@policyboss.com', config.environment.notification_email, sub, email_data, '', '', '');
                                    return objBase.response_object.json({ 'Msg': 'Access_Denied', 'Details': arr_msg, 'Status': 'VALIDATION' });
                                }
                                var objPospKey = {
                                    "Posp_Id": 469,
                                    "Fba_Id": 573,
                                    "Sm_Posp_Id": 319,
                                    "Sm_Posp_Name": "ASHISH  BANZAL",
                                    "First_Name": "ASHOK",
                                    "Middle_Name": "KUMAR",
                                    "Last_Name": "BANJAL",
                                    "Email_Id": "Ashokbanzal1204@gmail.com",
                                    "Agent_City": "Indore",
                                    "Mobile_No": 9893024750.0,
                                    "Pan_No": "AQVPB7015K",
                                    "Aadhar": 527397000000.0,
                                    "Sources": 0,
                                    "Ss_Id": 1702,
                                    "Erp_Id": 106598,
                                    "Last_Status": 106598,
                                    "Gender": "Male",
                                    "Posp_Category": "GI",
                                    "Reporting_Agent_Uid": "GI",
                                    "Reporting_Agent_Name": "GI",
                                    "Reporting_Email_ID": "",
                                    "Reporting_Mobile_Number": ""
                                };
                                if (is_allowed) {
                                    var objPospData = {};
                                    for (var k in dbPosp) {
                                        if (objPospKey.hasOwnProperty(k)) {
                                            if (k === 'Sources') {
                                                dbPosp[k] = dbPosp[k] - 0;
                                            }
                                            objPospData['posp_' + k.toString().toLowerCase()] = dbPosp[k];
                                            objRequestCore['posp_' + k.toString().toLowerCase()] = dbPosp[k];
                                            User_Data_Premium['posp_' + k.toString().toLowerCase()] = dbPosp[k];
                                        }
                                    }

                                    objPospData['posp_reporting_agent_uid_core'] = objPospData['posp_reporting_agent_uid'] - 0;
                                    objPospData['posp_reporting_agent_name_core'] = objPospData['posp_reporting_agent_name'];
                                    objPospData['is_posp'] = 'yes';
                                    if ((dbPosp['Erp_Id'] - 0) > 0) {

                                    } else {
                                        objPospData['posp_reporting_agent_uid'] = 508396;
                                        objPospData['posp_reporting_agent_name'] = 'DIRECT APP BUSINESS';
                                        objPospData['is_posp'] = 'no';
                                    }

                                    objPospData['posp_category'] = (dbPosp['Sources'] == 1) ? 'Datacomp POSP' : 'Lm Internal POSP';

                                    var Erp_Product_Source = {
                                        '1': 'POSP-MTR',
                                        '12': 'POSP-MTR',
                                        '2': 'POSP-NM',
                                        '8': 'POSP-NM',
                                        '17': 'POSP-NM',
                                        '9': 'POSP-LIFE',
                                        '10': 'POSP-TW',
                                        '4': 'POSP-NM'
                                    };
                                    var Erp_Product_Name = Erp_Product_Source[objProductClass.lm_request_core['product_id']];
                                    objPospData['erp_source'] = Erp_Product_Name;
                                    for (var k in objPospData) {
                                        User_Data_Premium[k] = objPospData[k];
                                        objRequestCore[k] = objPospData[k];
                                        objBase.lm_request[k] = objPospData[k];
                                        objProductClass.lm_request[k] = objPospData[k];
                                    }
                                    objProductClass.request_process_data_handler(objRequestCore, User_Data_Premium);
                                }
                            } else { // for other source than DC and SM
                                var arr_msg = ['POSP Source not allowed to sale'];
                                var sub = '[' + config.environment.name.toString().toUpperCase() + ']ALERT-ACCESS_DENIED-SOURCE_NOT_ALLOWED';
                                email_data = '<html><body><h2><u>Error Details</u><BR>' + arr_msg.join('<BR>') + '</h2><p>Request</p><pre>' + JSON.stringify(objRequestCore, undefined, 2) + '</pre><p>EmployeeData</p><pre>' + JSON.stringify(dbPosp, undefined, 2) + '</pre></body></html>';
                                var Email = require('../models/email');
                                var objModelEmail = new Email();
                                objModelEmail.send('noreply@policyboss.com', config.environment.notification_email, sub, email_data, '', '', '');
                                return objBase.response_object.json({ 'Msg': 'Not Valid Request', 'Details': arr_msg, 'Status': 'VALIDATION' });
                            }
                        }
                        if (data['user_type'] === 'FOS' || data['user_type'] === 'EMP' || data['user_type'] === 'MISP') {
                            let dbEmployee = data['EMP'];
                            var arr_name = dbEmployee['Emp_Name'].toString().split(' ');
                            var objPospKey = {
                                "Posp_Id": ss_id,
                                "Fba_Id": dbEmployee['FBA_ID'],
                                "Sm_Posp_Id": 319,
                                "Sm_Posp_Name": "",
                                "First_Name": arr_name[0],
                                "Middle_Name": "",
                                "Last_Name": arr_name[1],
                                "Email_Id": dbEmployee['Email_Id'],
                                "Agent_City": "",
                                "Mobile_No": dbEmployee['Mobile_Number'],
                                "Pan_No": "",
                                "Aadhar": "",
                                "Sources": 0,
                                "Ss_Id": ss_id,
                                "Erp_Id": '',
                                "Gender": "",
                                "Last_Status": "",
                                "Posp_Category": "GI",
                                "Reporting_Agent_Uid": dbEmployee['UID'],
                                "Reporting_Agent_Name": dbEmployee['Emp_Name'],
                                "Reporting_Email_ID": dbEmployee['Reporting_Email_ID'],
                                "Reporting_Mobile_Number": dbEmployee['Reporting_Mobile_Number']
                            };
                            if (data['user_type'] === 'EMP') {
                                arr_name = objRequestCore.rm_details_name ? objRequestCore['rm_details_name'].toString().split(' ') : '';
                                objPospKey = {
                                    "Posp_Id": ss_id,
                                    "Fba_Id": dbEmployee['FBA_ID'],
                                    "Sm_Posp_Id": 319,
                                    "Sm_Posp_Name": "",
                                    "First_Name": arr_name[0],
                                    "Middle_Name": "",
                                    "Last_Name": arr_name[arr_name.length - 1],
                                    "Email_Id": objRequestCore['rm_details_email'],
                                    "Agent_City": objRequestCore['rm_details_agent_city'],
                                    "Mobile_No": objRequestCore['rm_details_mobile'],
                                    "Pan_No": "",
                                    "Aadhar": "",
                                    "Sources": 0,
                                    "Ss_Id": ss_id,
                                    "Erp_Id": '',
                                    "Gender": "",
                                    "Last_Status": "",
                                    "Posp_Category": "GI",
                                    "Reporting_Agent_Uid": dbEmployee['UID'],
                                    "Reporting_Agent_Name": objRequestCore['rm_details_name'],
                                    "Reporting_Email_ID": '',
                                    "Reporting_Mobile_Number": ''
                                };
                            }
                            for (var k in objPospKey) {
                                objRequestCore['posp_' + k.toString().toLowerCase()] = objPospKey[k];
                                User_Data_Premium['posp_' + k.toString().toLowerCase()] = objPospKey[k];
                            }
                            if (dbEmployee['Role_ID'] == 30) {
                                objRequestCore['posp_category'] = 'RBS';
                                User_Data_Premium['posp_category'] = 'RBS';
                                objRequestCore['posp_erp_id'] = 707060;
                                User_Data_Premium['posp_erp_id'] = 707060;
                                var Erp_Product_Source = {
                                    '1': 'FOS-MTR',
                                    '12': 'FOS-MTR',
                                    '2': 'FOS-NM',
                                    '8': 'FOS-NM',
                                    '17': 'FOS-NM',
                                    '9': 'FOS-LIFE',
                                    '10': 'FOS-TW',
                                    '4': 'FOS-NM'
                                };
                                var Erp_Product_Name = Erp_Product_Source[objProductClass.lm_request_core['product_id']];
                                objRequestCore['erp_source'] = Erp_Product_Name;
                                User_Data_Premium['erp_source'] = Erp_Product_Name;
                                objBase.lm_request['erp_source'] = Erp_Product_Name;
                                objProductClass.lm_request['erp_source'] = Erp_Product_Name;
                            } else if (config.channel.Const_FOS_Code.hasOwnProperty(dbEmployee['Role_ID']) === true) {
                                objRequestCore['posp_category'] = config.channel.Const_FOS_Code[dbEmployee['Role_ID']];
                                User_Data_Premium['posp_category'] = config.channel.Const_FOS_Code[dbEmployee['Role_ID']];

                                if ((dbEmployee['VendorCode'] - 0) > 0) {
                                    let code_series = dbEmployee['VendorCode'].toString().split('')[0] - 0;
                                    if (data['user_type'] === 'FOS' && code_series !== 7) {
                                        is_allowed = false;
                                        var arr_msg = ['Access Denied as FOS is configured with other than 7 series code'];
                                        var sub = '[RESTRICTION]ACCESS_DENIED-FOS_WITH_WRONGSERIES-SSID:' + ss_id;
                                        email_data = '<html><body><h2><u>Agent Details</u><p>Request</p><pre>' + JSON.stringify(dbEmployee, undefined, 2) + '</pre></body></html>';
                                        var Email = require('../models/email');
                                        var objModelEmail = new Email();
                                        objModelEmail.send('noreply@policyboss.com', config.environment.notification_email, sub, email_data, '', '', '');
                                        return objBase.response_object.json({ 'Msg': 'Access_Denied', 'Details': arr_msg, 'Status': 'VALIDATION' });
                                    }
                                    if (data['user_type'] === 'MISP' && code_series !== 5) {
                                        is_allowed = false;
                                        var arr_msg = ['Access Denied as MISP is configured with other than 5 series code'];
                                        var sub = '[RESTRICTION]ACCESS_DENIED-MISP_WITH_WRONGSERIES-SSID:' + ss_id;
                                        email_data = '<html><body><h2><u>Agent Details</u><p>Request</p><pre>' + JSON.stringify(dbEmployee, undefined, 2) + '</pre></body></html>';
                                        var Email = require('../models/email');
                                        var objModelEmail = new Email();
                                        objModelEmail.send('noreply@policyboss.com', config.environment.notification_email, sub, email_data, '', '', '');
                                        return objBase.response_object.json({ 'Msg': 'Access_Denied', 'Details': arr_msg, 'Status': 'VALIDATION' });
                                    }
                                    objRequestCore['posp_erp_id'] = dbEmployee['VendorCode'];
                                    User_Data_Premium['posp_erp_id'] = dbEmployee['VendorCode'];
                                    objRequestCore['posp_agent_city'] = dbEmployee['Branch'];
                                    User_Data_Premium['posp_agent_city'] = dbEmployee['Branch'];
                                    objRequestCore['posp_reporting_agent_name'] = dbEmployee['Reporting_UID_Name'];
                                    User_Data_Premium['posp_reporting_agent_name'] = dbEmployee['Reporting_UID_Name'];
                                    var Erp_Product_Source = {
                                        '1': 'FOS-MTR',
                                        '12': 'FOS-MTR',
                                        '2': 'FOS-NM',
                                        '8': 'FOS-NM',
                                        '17': 'FOS-NM',
                                        '9': 'FOS-LIFE',
                                        '10': 'FOS-TW',
                                        '4': 'FOS-NM'
                                    };
                                    var Erp_Product_Name = Erp_Product_Source[objProductClass.lm_request_core['product_id']];
                                    objRequestCore['erp_source'] = Erp_Product_Name;
                                    User_Data_Premium['erp_source'] = Erp_Product_Name;
                                    objBase.lm_request['erp_source'] = Erp_Product_Name;
                                    objProductClass.lm_request['erp_source'] = Erp_Product_Name;
                                } else {
                                    var arr_msg = ['FOS WITHOUT VENDOR_CODE'];
                                    var sub = '[' + config.environment.name.toString().toUpperCase() + ']ALERT-ACCESS_DENIED-FOS_WO_VENDOR_CODE';
                                    email_data = '<html><body><h2><u>Error Details</u><BR>' + arr_msg.join('<BR>') + '</h2><p>Request</p><pre>' + JSON.stringify(objRequestCore, undefined, 2) + '</pre><p>EmployeeData</p><pre>' + JSON.stringify(dbEmployee, undefined, 2) + '</pre></body></html>';
                                    var Email = require('../models/email');
                                    var objModelEmail = new Email();
                                    objModelEmail.send('noreply@policyboss.com', config.environment.notification_email, sub, email_data, '', '', '');
                                    return objBase.response_object.json({ 'Msg': 'Not Valid Request', 'Details': arr_msg, 'Status': 'VALIDATION' });
                                }
                            } else {
                                let code_series = dbEmployee['UID'].toString().split('')[0] - 0;
                                if (data['user_type'] === 'EMP' && code_series !== 1) {
                                    is_allowed = false;
                                    var arr_msg = ['Access Denied as Employee is configured with other than 1 series code'];
                                    var sub = '[RESTRICTION]ACCESS_DENIED-EMP_WITH_WRONGSERIES-SSID:' + ss_id;
                                    email_data = '<html><body><h2><u>Agent Details</u><p>Request</p><pre>' + JSON.stringify(dbEmployee, undefined, 2) + '</pre></body></html>';
                                    var Email = require('../models/email');
                                    var objModelEmail = new Email();
                                    objModelEmail.send('noreply@policyboss.com', config.environment.notification_email, sub, email_data, '', '', '');
                                    return objBase.response_object.json({ 'Msg': 'Access_Denied', 'Details': arr_msg, 'Status': 'VALIDATION' });
                                }
                                objRequestCore['posp_category'] = 'PBS';
                                User_Data_Premium['posp_category'] = 'PBS';
                            }
                            objProductClass.request_process_data_handler(objRequestCore, User_Data_Premium);
                        }
                    } catch (ex) {
                        console.error('POSP_DETAIL_HANDLER', ex);
                        return objBase.response_object.json({ 'Msg': 'Not Valid Request', 'Details': ex.stack, 'Status': 'VALIDATION' });
                    }
                } else { // for direct customer
                    objProductClass.request_process_data_handler(objRequestCore, User_Data_Premium);
                }
            } catch (e) {
                console.error('request_process', 'step1', e.stack);
            }
        });
    } catch (e) {
        console.error('request_process', e);
    }
}
Base.prototype.agent_data_process = function (data, objRequestCore, User_Data_Premium) {
    var objBase = this;
    var fba_id = data['FinMartID'] - 0;
    //console.error('FinmartDataFound', data);
    var arr_name = data['FullName'].split(' ');
    objRequestCore['posp_fba_id'] = fba_id;
    objRequestCore['posp_posp_id'] = fba_id;
    objRequestCore['posp_ss_id'] = 5;
    objRequestCore['posp_sources'] = data['Source'] - 0;
    objRequestCore['posp_posp_category'] = "GI";
    objRequestCore['posp_mobile_no'] = data['MobiNumb1'] - 0;
    objRequestCore['posp_agent_city'] = "Mumbai";
    objRequestCore['posp_email_id'] = data['EmailId'];
    objRequestCore['posp_last_name'] = arr_name[arr_name.length - 1];
    objRequestCore['posp_middle_name'] = "";
    objRequestCore['posp_first_name'] = arr_name[0];
    objRequestCore['posp_reporting_agent_uid'] = 508396;
    objRequestCore['posp_reporting_agent_name'] = 'DIRECT APP BUSINESS';
    objRequestCore['posp_reporting_email_id'] = data['RRMEmail'];
    objRequestCore['posp_reporting_mobile_number'] = data['RRMMobile'];
    objRequestCore['posp_reporting_agent_uid_core'] = data['RRMUID'];
    objRequestCore['posp_reporting_agent_name_core'] = data['RRMName'];
    if (data['Source'] == 1) {
        objRequestCore['posp_category'] = 'Datacomp POSP';
    }
    if (data['Source'] == 2 || data['Source'] == 8) {
        objRequestCore['posp_category'] = 'Lm Internal POSP';
    }

    for (let k in objRequestCore) {
        if (k.indexOf('posp_') === 0) {
            User_Data_Premium[k] = objRequestCore[k];
        }
    }

    var Erp_Product_Source = {
        '1': 'POSP-MTR',
        '2': 'POSP-NM',
        '8': 'POSP-NM',
        '3': 'POSP-LIFE',
        '10': 'POSP-TW',
        '4': 'POSP-NM'
    };
    var Erp_Product_Name = Erp_Product_Source[objRequestCore['product_id']];
    objRequestCore['erp_source'] = Erp_Product_Name;
    User_Data_Premium['erp_source'] = Erp_Product_Name;
    return {
        'objRequestCore': objRequestCore,
        'User_Data_Premium': User_Data_Premium
    };
}
Base.prototype.request_process_data_handler = function (objRequestCore, User_Data_Premium) {
    var objProductClass = this;
    if (objProductClass.lm_request_core['method_type'] === 'Premium') {
        var channel = 'DIRECT';
        var subchannel = 'DIRECT';
        if (User_Data_Premium['ss_id'] > 0) {
            if (User_Data_Premium['posp_sources'] > 0) {
                channel = config.channel.Const_POSP_Channel[User_Data_Premium['posp_sources']];
                subchannel = 'POSP';
            } else if (User_Data_Premium['posp_category'].indexOf('FOS') > -1) {
                subchannel = 'FOS';
                if (User_Data_Premium['posp_category'] == 'FOS') {
                    channel = 'SM';
                } else {
                    channel = User_Data_Premium['posp_category'].split('-')[0];
                }
            } else if (User_Data_Premium['posp_category'] == 'PBS') {
                channel = 'CC';
                subchannel = 'PBS';
            } else if (User_Data_Premium['posp_category'] == 'RBS') {
                channel = 'CC';
                subchannel = 'RBS';
            } else if (User_Data_Premium['posp_category'] == 'MISP') {
                channel = 'SM';
                subchannel = 'MISP';
            }
        }


        User_Data_Premium['channel'] = channel;
        objRequestCore['channel'] = channel;
        User_Data_Premium['subchannel'] = subchannel;
        objRequestCore['subchannel'] = subchannel;

        if (objRequestCore.hasOwnProperty('sub_fba_id') && (objRequestCore['sub_fba_id'] - 0) > 0) {
            objRequestCore['sub_fba_id'] = objRequestCore['sub_fba_id'] - 0;
            var Sub_Fba = require('../models/sub_fba');
            Sub_Fba.findOne({ 'Sub_FBA_ID': objRequestCore['sub_fba_id'] }, function (err, dbSubFbaItem) {
                if (err) {
                    return console.dir(err);
                }
                if (dbSubFbaItem) {
                    dbSubFbaItem = dbSubFbaItem._doc;
                    User_Data_Premium['posp_sub_fba_id'] = objRequestCore['sub_fba_id'];
                    User_Data_Premium['posp_sub_fba_name'] = dbSubFbaItem['First_Name'] + " " + dbSubFbaItem['Last_Name'];
                    User_Data_Premium['posp_sub_fba_email'] = dbSubFbaItem['Email_ID'];
                    User_Data_Premium['posp_sub_fba_mobile_no'] = dbSubFbaItem['Mobile'];
                    objRequestCore['posp_sub_fba_id'] = objRequestCore['sub_fba_id'];
                    objRequestCore['posp_sub_fba_name'] = dbSubFbaItem['First_Name'] + " " + dbSubFbaItem['Last_Name'];
                    objRequestCore['posp_sub_fba_email'] = dbSubFbaItem['Email_ID'];
                    objRequestCore['posp_sub_fba_mobile_no'] = dbSubFbaItem['Mobile'];
                }
                var ObjUser_Data = {
                    'Premium_Request': User_Data_Premium
                };

                User_Data.update({ 'User_Data_Id': objRequestCore['udid'] }, { $set: ObjUser_Data }, function (err, numAffected) {
                    //console.error('request_process_handler', 'UserDataCRNUpdate', err, numAffected);
                    objProductClass.integration_process_all(objRequestCore);
                });
            });
        } else {
            var ObjUser_Data = {
                'Premium_Request': User_Data_Premium
            };

            User_Data.update({ 'User_Data_Id': objRequestCore['udid'] }, { $set: ObjUser_Data }, function (err, numAffected) {
                //console.error('request_process_handler', 'UserDataCRNUpdate', err, numAffected);
                objProductClass.integration_process_all(objRequestCore);
            });
        }
    } else {
        objProductClass.integration_process_all(objRequestCore);
    }
}
Base.prototype.error_handler = function (docLog, objProductResponse, objResponseFull, specific_insurer_object) {
    try {
        //console.log('Start', this.constructor.name, 'error_handler');
        var objInsurerProduct = this;
        var Error_Msg;
        if (typeof objProductResponse.Error_Msg === 'undefined') {
            Error_Msg = '';
        } else {
            Error_Msg = objProductResponse.Error_Msg.toString();
        }
        var Error_Code = 'LM002';
        var objError = {
            "Error_Code": "LM002",
            "Error_Name": "Non_Classified",
            "Error_Desc": "Error not Classified",
            "Error_Type": "Post",
            "Error_Action": "PB_Tech_Inform",
            "Error_Msg": "Non_Classified",
            "Error_Specific": Error_Msg
        };
        //find method field
        var Client = require('node-rest-client').Client;
        var objClient = new Client();
        objClient.get(config.environment.weburl + '/quote/error_master', {}, function (data, response) {
            var errors = data;
            for (let k in errors) {
                var db_err_code = errors[k].Error_Code;
                for (let j in errors[k].Error_Identifier) {
                    var db_err_msg = errors[k].Error_Identifier[j];
                    if (db_err_msg !== '' && Error_Msg.indexOf(db_err_msg) > -1) {
                        delete errors[k].Error_Identifier;
                        delete errors[k]._id;
                        Error_Code = db_err_code;
                        objError = errors[k];
                        objError['Error_Specific'] = Error_Msg;
                        break;
                    }
                }
                if (Error_Code !== 'LM002') {
                    break;
                }
            }
            return objInsurerProduct.error_process_post_handler(docLog, objProductResponse, objResponseFull, objError, specific_insurer_object);
        });
        //console.log('Finish', this.constructor.name, 'error_handler');
    } catch (e) {
        console.error('Exception', this.constructor.name, 'error_handler', objProductResponse, e);
    }
};
Base.prototype.base_api_post = function () {

}
Base.prototype.create_guid = function (prefix = '', type = 'default', length = 32) {
    /*
     * default - default set of token characters which is numbers, lower case letters, and upper case letters (i.e. 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ)
     a-z || alpha - lower case characters (i.e. abcdefghijklmnopqrstuvwxyz)
     A-Z || ALPHA - upper case characters (i.e. ABCDEFGHIJKLMNOPQRSTUVWXYZ)
     0-9 || numeric - numbers only (i.e. 0123456789)
     base32 - use characters from the base32 alphabet, specifically A-Z and 2-7
     * 
     */
    // Create a token generator with the default settings:

    var randtoken = require('rand-token').generator({
        chars: type
    });
    // Generate a 16 character token:
    var token = randtoken.generate(length);
    /*var suid = require('rand-token').suid;
     
     // Generate a 24 (16 + 8) character alpha-numeric token:
     var token = suid(length);
     */

    //
    if (prefix.indexOf('-') > -1) {
        var guid = prefix;
        guid += token.substring(0, 8) + '-' + token.substring(8, 12) + '-' + token.substring(12, 16) + '-' + token.substring(16, 20) + '-' + token.substring(20, 32);
    } else {
        var guid = token;
    }
    return guid.toUpperCase();
}
Base.prototype.integration_process_all = function (objRequestCore) {
    try {
        //console.log(this.constructor.name + '::' + 'integration_process_all' + '::Start');
        //save to request start
        //console.log("integration_process_all", 'client_id', this.client_id);
        if (this.lm_request['method_type'] == 'Pdf') {
            console.error("DBG", "integration_process_all", 'pdf', objRequestCore);
        }
        if (this.lm_request['execution_async'] === 'yes' && this.lm_request['method_type'] == 'Premium') {
            eval(this.request_process_handler);
        }
        let docRequest = {
            "Request_Id": "",
            "Request_Unique_Id": this.request_unique_id,
            "Client_Id": this.client_id,
            "PB_CRN": objRequestCore['crn'],
            "Request_Core": objRequestCore,
            "Request_Product": null,
            "Created_On": new Date(),
            "Status": "pending",
            "Total": 0,
            "Pending": 0,
            "Complete": 0,
            "Success": 0,
            "Fail": 0,
            "Total_Execution_Time": 0
        };
        //save to request finish
        //process product fields
        this.field_process_all(this.product_field_list, 'product');
        docRequest.Request_Product = this.product_processed_request;
        this.save_to_db('requests', docRequest);
        this.docRequest = docRequest;
        //console.log('product_processed_request');
        //console.log(this.product_processed_request);
        let product_id = objRequestCore['product_id'];
        let Product_Class = this.db_specific_product.Product_Class;
        let is_breakin = this.lm_request['is_breakin'];
        let is_policy_exist = this.lm_request['is_policy_exist'];
        let is_tp_only = false;
        if (objRequestCore.hasOwnProperty('vehicle_insurance_subtype') && objRequestCore['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
            is_tp_only = true;
        }
        let arr_insurer_breaking_allowed = [];
        if (is_breakin === 'yes') { // bajaj tw breakin not allowed and godigit
            if (objRequestCore['product_id'] === 1) { //car
                arr_insurer_breaking_allowed.push(5); //hdfc
                arr_insurer_breaking_allowed.push(7); //iffco
                //arr_insurer_breaking_allowed.push(35); //MagmaHDI
                arr_insurer_breaking_allowed.push(10) // royal
                if ((objRequestCore['breakin_days'] - 0) < 30) {
                    arr_insurer_breaking_allowed.push(3); //chola
                }
                if (config.environment.name.toString() !== 'Production' && objRequestCore['vehicle_insurance_subtype'] !== "1OD_0TP") {
                    arr_insurer_breaking_allowed.push(9); //reliance
                }
                if (is_policy_exist === 'yes') {
                    arr_insurer_breaking_allowed.push(44); //godigit
                    //arr_insurer_breaking_allowed.push(35);//MagmaHDI
                    if (objRequestCore['vehicle_insurance_subtype'] !== "1OD_0TP") {
                        arr_insurer_breaking_allowed.push(6); //icici
                        arr_insurer_breaking_allowed.push(7); //iffco
                        arr_insurer_breaking_allowed.push(1); //bajaj
                    }
                    if (is_tp_only === true) {
                        arr_insurer_breaking_allowed.push(47); //dhfl
                        arr_insurer_breaking_allowed.push(1); //bajaj
                        arr_insurer_breaking_allowed.push(2); //bharti   
                        arr_insurer_breaking_allowed.push(45); //acko 
                        arr_insurer_breaking_allowed.push(13); //oriental
                        arr_insurer_breaking_allowed.push(4); //fg
                        arr_insurer_breaking_allowed.push(46); //edelweiss
                        arr_insurer_breaking_allowed.push(3); //chola
                        arr_insurer_breaking_allowed.push(33); //liberty
                        //arr_insurer_breaking_allowed.push(10); //royal
                        arr_insurer_breaking_allowed.push(11);//tata
                        arr_insurer_breaking_allowed.push(35);//MagmaHDI
						arr_insurer_breaking_allowed.push(16);//RahejaQBE
                    }
                }
                if (is_policy_exist === 'no') {
                    if (is_tp_only === true) {
                        arr_insurer_breaking_allowed.push(2); //bharti   
                        arr_insurer_breaking_allowed.push(1); //bajaj
                        arr_insurer_breaking_allowed.push(44); //digit
                        arr_insurer_breaking_allowed.push(45); //acko
                        arr_insurer_breaking_allowed.push(47); //dhfl
                        arr_insurer_breaking_allowed.push(11); //tata
                        arr_insurer_breaking_allowed.push(4); //fg
                        arr_insurer_breaking_allowed.push(3); //chola
                        arr_insurer_breaking_allowed.push(33); //liberty
                        //arr_insurer_breaking_allowed.push(10); //royal
                        arr_insurer_breaking_allowed.push(35);//MagmaHDI
						arr_insurer_breaking_allowed.push(16);//RahejaQBE
                        if (objRequestCore['vehicle_insurance_subtype'] !== "1OD_0TP") {
                            arr_insurer_breaking_allowed.push(6); //icici
                        }
                    } else {
                        if (objRequestCore['vehicle_insurance_subtype'] === "1OD_0TP") {
                            //arr_insurer_breaking_allowed.push(11); //tata
                        }
                        if (objRequestCore['vehicle_insurance_subtype'] !== "1OD_0TP") {
                            arr_insurer_breaking_allowed.push(44); //godigit
                        }
                        arr_insurer_breaking_allowed.push(1);//bajaj
                    }

                }
            }
            if (objRequestCore['product_id'] === 10) {//tw    
				arr_insurer_breaking_allowed.push(44); //digit
                arr_insurer_breaking_allowed.push(5); //hdfc
                arr_insurer_breaking_allowed.push(48); //KotakOEM
                //arr_insurer_breaking_allowed.push(17); //SBI
                arr_insurer_breaking_allowed.push(45); //acko
                arr_insurer_breaking_allowed.push(46); //Edelweiss
                arr_insurer_breaking_allowed.push(11); //TATA AIG
				//arr_insurer_breaking_allowed.push(35);//MagmaHDI
                if (objRequestCore['vehicle_insurance_subtype'] !== "1OD_0TP") {
                    arr_insurer_breaking_allowed.push(9); //reliance
                }
                if (config.environment.name.toString() !== 'Production' && objRequestCore['vehicle_insurance_subtype'] !== "1OD_0TP") {
                    arr_insurer_breaking_allowed.push(6); //icici
                }
                if (is_policy_exist === 'yes') {
                    arr_insurer_breaking_allowed.push(2); //bharti 
                    arr_insurer_breaking_allowed.push(3); //chola 
                    //arr_insurer_breaking_allowed.push(11);//tata
                    arr_insurer_breaking_allowed.push(44); //digit
                    if (is_tp_only === true) {
                        arr_insurer_breaking_allowed.push(1); //bajaj
                        arr_insurer_breaking_allowed.push(47); //dhfl
                        arr_insurer_breaking_allowed.push(13); //oriental
                        arr_insurer_breaking_allowed.push(33);//liberty
                        arr_insurer_breaking_allowed.push(10); //royal
                    } else {
                        if (objRequestCore['vehicle_insurance_subtype'] === "1OD_0TP") {
                            arr_insurer_breaking_allowed.push(33); //liberty
                        }
                    }
                }
                if (is_policy_exist === 'no') {
                    if (is_tp_only === true) {
                        arr_insurer_breaking_allowed.push(1); //bajaj
                        arr_insurer_breaking_allowed.push(2); //bhartiaxa
                        arr_insurer_breaking_allowed.push(47); //dhfl                          
                        arr_insurer_breaking_allowed.push(44); //digit
                        //arr_insurer_breaking_allowed.push(11); //tata
                        arr_insurer_breaking_allowed.push(3); //chola
                        arr_insurer_breaking_allowed.push(33);//liberty
                        arr_insurer_breaking_allowed.push(10); //royal
                    } else {
                        if (objRequestCore['vehicle_insurance_subtype'] === "1OD_0TP") {
                            //arr_insurer_breaking_allowed.push(11); //tata
                            arr_insurer_breaking_allowed.push(44); //digit
                        }
                    }
                }
            }
            /*if (objRequestCore['product_id'] === 12) { //CV
                arr_insurer_breaking_allowed.push(10); //royal
                if (is_policy_exist === 'yes') {
                    if (is_tp_only === true) {
                        arr_insurer_breaking_allowed.push(5); //hdfc
                        arr_insurer_breaking_allowed.push(10); //royal
                        arr_insurer_breaking_allowed.push(9); //Reliance
                    }
                }
            }*/
            if (objRequestCore['product_id'] === 12) { //CV
                // arr_insurer_breaking_allowed.push(10); //royal
                if (is_policy_exist === 'yes') {
                    arr_insurer_breaking_allowed.push(18); //Shriram
                    if (is_tp_only === true) {
                        arr_insurer_breaking_allowed.push(5); //hdfc
                        arr_insurer_breaking_allowed.push(10); //royal
                        arr_insurer_breaking_allowed.push(9); //Reliance
                        arr_insurer_breaking_allowed.push(7); //IFFCO
                        arr_insurer_breaking_allowed.push(3); //Chola
                        arr_insurer_breaking_allowed.push(35); //MagmaHDI
                        arr_insurer_breaking_allowed.push(8); //National
						arr_insurer_breaking_allowed.push(11); //TATA
						arr_insurer_breaking_allowed.push(44); //digit
                        //arr_insurer_breaking_allowed.push(18); //Shriram
                    } else if (objRequestCore.hasOwnProperty('vehicle_class') && ((objRequestCore['vehicle_class'] === "pcv" && objRequestCore['vehicle_sub_class'] === 'pcv_thw_lt6pass') || (objRequestCore['vehicle_class'] === "gcv" && this.Master_Details && this.Master_Details.vehicle && this.Master_Details.vehicle.Gross_Vehicle_Weight && this.Master_Details.vehicle.Gross_Vehicle_Weight <= 2000))) {
                        arr_insurer_breaking_allowed.push(10); //royal
                        //arr_insurer_breaking_allowed.push(7); //IFFCO
                        arr_insurer_breaking_allowed.push(3); //Chola
                        arr_insurer_breaking_allowed.push(9); //Reliance
                        arr_insurer_breaking_allowed.push(35); //MagmaHDI
                        //arr_insurer_breaking_allowed.push(18); //Shriram
                    } else if (objRequestCore.hasOwnProperty('vehicle_class') && ((objRequestCore['vehicle_class'] === "pcv" && objRequestCore['vehicle_sub_class'] === 'pcv_thw_lt6pass') || (objRequestCore['vehicle_class'] === "gcv" && this.Master_Details && this.Master_Details.vehicle && this.Master_Details.vehicle.Gross_Vehicle_Weight && this.Master_Details.vehicle.Gross_Vehicle_Weight <= 2500))) {
                        arr_insurer_breaking_allowed.push(3); //Chola
                    }
                } else if (is_policy_exist === 'no') {
                    arr_insurer_breaking_allowed.push(18); //Shriram
                    if (is_tp_only === true) {
                        //arr_insurer_breaking_allowed.push(3); //Chola
                        arr_insurer_breaking_allowed.push(7); //IFFCO
                        arr_insurer_breaking_allowed.push(35); //MagmaHDI
                        arr_insurer_breaking_allowed.push(8); //National
						arr_insurer_breaking_allowed.push(11); //TATA
						arr_insurer_breaking_allowed.push(44); //digit
                    } else if (objRequestCore.hasOwnProperty('vehicle_class') && ((objRequestCore['vehicle_class'] === "pcv" && objRequestCore['vehicle_sub_class'] === 'pcv_thw_lt6pass') || (objRequestCore['vehicle_class'] === "gcv" && this.Master_Details && this.Master_Details.vehicle && this.Master_Details.vehicle.Gross_Vehicle_Weight && this.Master_Details.vehicle.Gross_Vehicle_Weight <= 2000))) {
                        arr_insurer_breaking_allowed.push(9); //Reliance
                    }
                } else if (objRequestCore.hasOwnProperty('is_ownership_transfer') && objRequestCore['is_ownership_transfer'] === "no" && objRequestCore.hasOwnProperty('vehicle_class') && ((objRequestCore['vehicle_class'] === "pcv" && objRequestCore['vehicle_sub_class'] === 'pcv_thw_lt6pass') || (objRequestCore['vehicle_class'] === "gcv" && this.Master_Details && this.Master_Details.vehicle && this.Master_Details.vehicle.Gross_Vehicle_Weight && this.Master_Details.vehicle.Gross_Vehicle_Weight <= 2000))) {
                    arr_insurer_breaking_allowed.push(10); //royal
                    //arr_insurer_breaking_allowed.push(7); //IFFCO
                    arr_insurer_breaking_allowed.push(9); //Reliance
                }
            }
        }

        let is_corporate = this.lm_request['vehicle_registration_type'];
        for (let i in this.db_specific_product.Integration_List) {

            let Insurer_Object = this.db_specific_product.Integration_List[i];
            if (Insurer_Object.Is_Active === 1 || ['Pdf', 'Verification', 'Status'].indexOf(this.lm_request['method_type']) > -1) {

            } else {
                continue;
            }



            let Insurer_Product_Class = Insurer_Object.Lib_Class;
            let insurer_id = Insurer_Object['Insurer_ID'] - 0;
            let is_allowed = false;
            let Tmp_Plan_List = [];
            if (this.lm_request && this.lm_request.is_rto_allowed && this.lm_request.is_rto_allowed[insurer_id] && this.lm_request.is_rto_allowed[insurer_id] === "no") {
                continue;
            }
            if(product_id === 12 && [11].indexOf(insurer_id) > -1){
                if(insurer_id === this.lm_request['prev_insurer_id']){
                    continue;
                }                
            }
            if (product_id === 2 && this.lm_request.hasOwnProperty('is_ghi') && this.lm_request['is_ghi'] === 'yes') {
                continue;
            }
            if(insurer_id !== 26){
               continue; 
            }
            //disable icici on not policyboss plateform
            if (this.lm_request['method_type'] == "Premium" && insurer_id === 6 && const_allowed_plateform.indexOf(this.lm_request['app_version']) < 0) {
                if ((this.lm_request['app_version']).includes('policyboss-0') || (this.lm_request['app_version']).startsWith("1")) {
                } else {
                    continue;
                }
            }

            if (is_corporate === 'corporate') {
                if (config.environment.name.toString() === 'Production') {
                    var corporate_ins_id = [1, 2, 5, 6, 9, 10, 33, 45, 47, 16];
                } else {
                    if (objRequestCore['product_id'] === 10 && insurer_id === 16) {
                        continue;
                    } else {
                        var corporate_ins_id = [1, 2, 3, 5, 9, 10, 11, 16, 17, 33, 44, 45, 47, 6, 35];
                    }
                }
                if (corporate_ins_id.indexOf(insurer_id) > -1) {

                } else {
                    continue;
                }
            }

            //for testing environment str
            let is_testing = false;
            if (Insurer_Object.hasOwnProperty('Is_Testing') && Insurer_Object['Is_Testing'] === 1) {
                is_testing = true;
            }

            if (is_testing) {
                if (config.environment.testing_ssid.indexOf(this.lm_request['ss_id']) === -1) {
                    continue;
                }
            }


            //if ([1, 2, 10, 12].indexOf(product_id) === -1) {
            if (Insurer_Object.hasOwnProperty('Plan_List')) {
                for (var j in Insurer_Object.Plan_List) {
                    if (Insurer_Object.Plan_List[j].hasOwnProperty('Is_Active') && Insurer_Object.Plan_List[j].Is_Active == true) {
                        if (this.lm_request.hasOwnProperty('addon_selected') && this.lm_request['addon_selected'] === 'yes'
                            && this.lm_request.hasOwnProperty('plan_selected') && this.lm_request['plan_selected']) {
                            var arr_plans_allowed = this.lm_request['plan_selected'].toString().split(',');
                            if (Insurer_Object.Plan_List[j].hasOwnProperty('Plan_Id') && arr_plans_allowed.indexOf(Insurer_Object.Plan_List[j].Plan_Id.toString()) > -1) {
                                Tmp_Plan_List.push(Insurer_Object.Plan_List[j]);
                            }
                        } else {
                            Tmp_Plan_List.push(Insurer_Object.Plan_List[j]);
                        }
                    }
                }
                if (Tmp_Plan_List.length > 0) {
                    Insurer_Object.Plan_List = Tmp_Plan_List;
                }
            }
            // }
            if ([1, 10, 12].indexOf(product_id) > -1 && this.lm_request['method_type'] !== 'Status') {
                Tmp_Plan_List = [];
                if (this.lm_request.hasOwnProperty('addon_applied') && this.lm_request.addon_applied === 'no' && Insurer_Object && Insurer_Object.Plan_List && ['0CH_1TP', '0CH_3TP', '0CH_5TP'].indexOf(this.lm_request['vehicle_insurance_subtype']) < 0) {
                    /*for (var j in Insurer_Object.Plan_List) {
                        if (Insurer_Object.Plan_List[j].hasOwnProperty('Plan_Name') && Insurer_Object.Plan_List[j].Plan_Name === 'Basic') {
                            Tmp_Plan_List.push(Insurer_Object.Plan_List[j]);
                        }
                    }*/
                    for (var j in Insurer_Object.Plan_List) {
                        if (Insurer_Object.Plan_List[j].hasOwnProperty('Is_Active') && Insurer_Object.Plan_List[j].Is_Active == true) {
                            if(this.lm_request['vehicle_insurance_subtype'] === '1OD_0TP') {
                                if (Insurer_Object.Plan_List[j].hasOwnProperty('Plan_Name') && (Insurer_Object.Plan_List[j].Plan_Name === 'OD')) {
                                    Tmp_Plan_List.push(Insurer_Object.Plan_List[j]);
                                }
                            } else {
                                if (Insurer_Object.Plan_List[j].hasOwnProperty('Plan_Name') && (Insurer_Object.Plan_List[j].Plan_Name === 'Basic')) {
                                    Tmp_Plan_List.push(Insurer_Object.Plan_List[j]);
                                }
                            }
                        }
                    }
                } else {
                    if (Insurer_Object['Sub_Type_List'].indexOf(this.lm_request['vehicle_insurance_subtype']) > -1) {
                        if (Insurer_Object.hasOwnProperty('Plan_List') && this.lm_request.hasOwnProperty('vehicle_insurance_subtype')) {
                            if (['0CH_1TP', '0CH_3TP', '0CH_5TP'].indexOf(this.lm_request['vehicle_insurance_subtype']) > -1) {
                                for (var j in Insurer_Object.Plan_List) {
                                    if (Insurer_Object.Plan_List[j].hasOwnProperty('Plan_Name') && Insurer_Object.Plan_List[j].Plan_Name === 'TP') {
                                        Tmp_Plan_List.push(Insurer_Object.Plan_List[j]);
                                    }
                                }
                            } else if (['1CH_0TP', '1CH_4TP', '1CH_2TP', '2CH_0TP', '3CH_0TP', '5CH_0TP'].indexOf(this.lm_request['vehicle_insurance_subtype']) > -1) {
                                for (var j in Insurer_Object.Plan_List) {
                                    if (Insurer_Object.Plan_List[j].hasOwnProperty('Plan_Name') && Insurer_Object.Plan_List[j].Plan_Name !== 'TP' && Insurer_Object.Plan_List[j].Plan_Name !== 'OD') {
                                        Tmp_Plan_List.push(Insurer_Object.Plan_List[j]);
                                    }
                                }
                            } else if (['1OD_0TP'].indexOf(this.lm_request['vehicle_insurance_subtype']) > -1) {
                                for (var j in Insurer_Object.Plan_List) {
                                    if (Insurer_Object.Plan_List[j].hasOwnProperty('Plan_Name') && Insurer_Object.Plan_List[j].Plan_Name !== 'TP' && Insurer_Object.Plan_List[j].Plan_Name !== 'Basic') {
                                        Tmp_Plan_List.push(Insurer_Object.Plan_List[j]);
                                    }
                                }
                            }

                        }
                    }
                }
                if (Tmp_Plan_List.length > 0 || this.lm_request['method_type'] === 'Status') {
                    Insurer_Object.Plan_List = Tmp_Plan_List;
                } else {
                    continue;
                }

                if (objRequestCore['vehicle_insurance_subtype'] === "1OD_0TP" && (insurer_id === 11 || insurer_id === 16 || insurer_id === 3 || insurer_id === 33 || insurer_id === 1)) {
                    var date = new Date(objRequestCore['vehicle_registration_date']);
                    var month = date.getMonth() + 1;
                    var year = date.getFullYear();
                    if (month < 9 && year <= 2018) {
                        continue;
                    }
                }

            }
            if (product_id === 2 || product_id === 4) {
                Tmp_Plan_List = [];
                var product = product_id === 2 ? 'Health' : 'Travel';
                if (Insurer_Object.Is_Active === 1 && Insurer_Object.hasOwnProperty('Plan_List')) {
                    var Insurer_Class = require(appRoot + '/libs/' + product + '/' + Insurer_Object.Lib_Class);
                    for (var j in Insurer_Object.Plan_List) {
                        if (Insurer_Object.Plan_List[j].Is_Active === true) {
                            if (Insurer_Class.prototype.hasOwnProperty('is_valid_plan')) {
                                var is_valid = Insurer_Class.prototype.is_valid_plan(this.lm_request, Insurer_Object.Plan_List[j].Plan_Code);
                                if (is_valid) {
                                    Tmp_Plan_List.push(Insurer_Object.Plan_List[j]);
                                }
                            } else {
                                if (Insurer_Object.Plan_List[j].hasOwnProperty('Plan_Name')) {
                                    Tmp_Plan_List.push(Insurer_Object.Plan_List[j]);
                                }
                            }
                        }
                    }
                }
                if (Tmp_Plan_List.length > 0) {
                    Insurer_Object.Plan_List = Tmp_Plan_List;
                } else {
                    continue;
                }
            }
            if (product_id === 8) {
                Tmp_Plan_List = [];
                var product = 'PersonalAccident';
                if (Insurer_Object.Is_Active === 1 && Insurer_Object.hasOwnProperty('Plan_List')) {
                    var Insurer_Class = require(appRoot + '/libs/' + product + '/' + Insurer_Object.Lib_Class);
                    for (var j in Insurer_Object.Plan_List) {
                        if (Insurer_Object.Plan_List[j].Is_Active === true) {
                            if (Insurer_Class.prototype.hasOwnProperty('is_valid_plan')) {
                                var is_valid = Insurer_Class.prototype.is_valid_plan(this.lm_request, Insurer_Object.Plan_List[j].Plan_Code);
                                if (is_valid) {
                                    Tmp_Plan_List.push(Insurer_Object.Plan_List[j]);
                                }
                            } else {
                                if (Insurer_Object.Plan_List[j].hasOwnProperty('Plan_Name')) {
                                    Tmp_Plan_List.push(Insurer_Object.Plan_List[j]);
                                }
                            }
                        }
                    }
                }
                if (Tmp_Plan_List.length > 0) {
                    Insurer_Object.Plan_List = Tmp_Plan_List;
                } else {
                    continue;
                }
            }
            let Is_Live = false;
            if (config.environment.insurer_env === 'LIVE') {
                Is_Live = true;
            } else {
                if (Insurer_Object.hasOwnProperty('Environment')) {
                    if (Insurer_Object['Environment'] === 'LIVE') {
                        Is_Live = true;
                    }
                }
            }
            if (Is_Live) {
                for (let k_IO in Insurer_Object) {
                    if (typeof Insurer_Object[k_IO] !== 'object') {
                        if (k_IO.indexOf('_Live') > -1) {
                            var key_live = k_IO.replace('_Live', '');
                            Insurer_Object[key_live] = Insurer_Object[k_IO];
                        }
                    }
                }
                for (let m_inc in Insurer_Object.Method_List) {
                    for (let mk_IO in Insurer_Object.Method_List[m_inc]) {
                        if (typeof Insurer_Object.Method_List[m_inc][mk_IO] !== 'object') {
                            if (mk_IO.indexOf('_Live') > -1) {
                                var key_live = mk_IO.replace('_Live', '');
                                Insurer_Object.Method_List[m_inc][key_live] = Insurer_Object.Method_List[m_inc][mk_IO];
                            }
                        }
                    }
                }
            }

            //for smagent
            //for health
            if (product_id === 2 || product_id === 10) {
                //condition for callcenter
                if (this.lm_request.hasOwnProperty('insurer_selected') && this.lm_request['insurer_selected'] && this.lm_request['insurer_selected'] !== '') {
                    var arr_insurer_allowed = this.lm_request['insurer_selected'].toString().split(',');
                    if (arr_insurer_allowed.indexOf(insurer_id.toString()) === -1) {
                        continue;
                    }
                }
                //cigna negative pincodes
                if (insurer_id === 38 && getPincode(this.lm_request.permanent_pincode) > -1) {
                    continue;
                }

                if (this.lm_request['adult_count'] === 0 && this.lm_request['child_count'] > 0) { // only child plan
                    if (insurer_id === 6 || insurer_id === 38) {
                    } else {
                        continue;
                    }
                }

                if (this.lm_request.hasOwnProperty('multi_individual') && this.lm_request['multi_individual'] === "yes") { // only multi-individual
                    if (insurer_id === 42 || insurer_id === 38 || insurer_id === 21 || insurer_id === 20) {
                    } else {
                        continue;
                    }
                }
            }
            //for CV
            //  if (product_id === 12) {
            //    if (objRequestCore['vehicle_class'] === "gcv") {
            //        if (insurer_id === 1) {  //bajaj gcv not allow
            //            continue;
            //        }
            //    }
            // }
            //for travel
            if (product_id === 4) {
                if (this.lm_request.hasOwnProperty('insurer_selected') && this.lm_request['insurer_selected'] && this.lm_request['insurer_selected'] !== '') {
                    var arr_insurer_allowed = this.lm_request['insurer_selected'].toString().split(',');
                    if (arr_insurer_allowed.indexOf(insurer_id.toString()) === -1) {
                        continue;
                    }
                }
            }

            if ([8165, 816, 14154, 14155, 14156, 14157, 14158, 17051, 15912, 15253, 11971, 17053, 27130].indexOf(this.lm_request['ss_id'] - 0) > -1 && product_id === 10) {
                if (insurer_id === 6 || insurer_id === 17) { // only SBI call if misp login
                } else {
                    continue;
                }
            }
            //KotakOEM Login & Validation
            if ([822, 24835, 13964, 25297, 15302, 13964, 14106, 14230, 14377, 14674, 19342, 15211, 15212, 15215, 15300, 15428, 16229, 16230, 16223, 19268, 19267, 20109, 21605, 21634, 21907, 22024, 22317, 25297, 25299, 25881, 25871, 26116, 120045].indexOf(this.lm_request['ss_id'] - 0) > -1) {
                if (insurer_id === 48 || insurer_id === 17) {
                    if ((this.lm_request.hasOwnProperty('electrical_accessory') && (this.lm_request['electrical_accessory'] - 0) > 5000) || (this.lm_request.hasOwnProperty('non_electrical_accessory') && (this.lm_request['non_electrical_accessory'] - 0) > 5000)) {
                        continue;
                    }
                } else {
                    continue;
                }
            } else {
                //allowed KotakOEM TW without login for QA only 
                /*if (insurer_id === 48) {
                    if (this.lm_request.hasOwnProperty('ss_id') && (this.lm_request['ss_id'] - 0) > 0) {
                        if ((this.lm_request.hasOwnProperty('electrical_accessory') && (this.lm_request['electrical_accessory'] - 0) > 5000) || (this.lm_request.hasOwnProperty('non_electrical_accessory') && (this.lm_request['non_electrical_accessory'] - 0) > 5000)) {
                            continue;
                        }
                    } else {
                        continue;  
                    }
                } */
            }

            if (insurer_id === 45) { // allowed acko tw only to pb-ss                
                if ((objRequestCore['ss_id'] - 0) > 0) {
                    if (this.lm_request['vehicle_insurance_type'] == 'renew' && this.lm_request['prev_insurer_id'] === 45) {
                        is_allowed = true;
                    } else {
                        if (objRequestCore['posp_category'] === 'PBS') {
                            is_allowed = true;
                        } else {
                            if ((objRequestCore['product_id'] === 1 || objRequestCore['product_id'] === 10) &&
                                (objRequestCore['posp_category'] === 'FOS' || (objRequestCore['posp_sources'] - 0) > 0)) {
                                if (objRequestCore['product_id'] === 1 && is_tp_only) {
                                    is_allowed = true;
                                }
                                if (objRequestCore['product_id'] === 10) {
                                    is_allowed = true;
                                }
                            }
                        }
                    }
                }
                if (is_allowed === false) {
                    continue;
                }
            }

            if (is_breakin === 'yes') { // bajaj tw breakin not allowed and godigit
                is_allowed = false;
                if (arr_insurer_breaking_allowed.length > 0 && arr_insurer_breaking_allowed.indexOf(insurer_id) > -1) {
                    is_allowed = true;
                }
                if (is_allowed === false) {
                    continue;
                }
            }

            if (this.lm_request['ui_source'] === 'quick_tw_journey') { // quick-tw-journey
                is_allowed = false;
                let arr_insurer_quick_tw = [17, 46];
                if (arr_insurer_quick_tw.length > 0 && arr_insurer_quick_tw.indexOf(insurer_id) > -1) {
                    is_allowed = true;
                }
                if (is_allowed === false) {
                    continue;
                }
            }

            if (objRequestCore['method_type'] === 'Premium') {
                var is_pa_opt = false;
                if ((objRequestCore['product_id'] === 10 && (objRequestCore['vehicle_insurance_subtype'].indexOf('0CH') > -1 || [5, 6, 44].indexOf(insurer_id) > -1)) || config.environment.name !== 'Production') {
                    is_pa_opt = true;
                }
                if (is_pa_opt === false) {
                    objRequestCore["is_pa_od"] = "yes";
                    objRequestCore["is_having_valid_dl"] = "yes";
                    objRequestCore["is_opted_standalone_cpa"] = "no";
                    objRequestCore["pa_owner_driver_si"] = 1500000;
                }
            }
            /*if (this.lm_request['vehicle_registration_type'] == 'corporate') {
             continue;
             }*/

            //            if (insurer_id === 6) { //icici only for agent
            //                if (this.lm_request.hasOwnProperty('ss_id') && (this.lm_request['ss_id'] - 0) > 0) {
            //
            //                } else {
            //                    continue;
            //                }
            //            }

            if (this.lm_request.hasOwnProperty('ss_id') && this.lm_request['ss_id'] == 1792 && insurer_id != 9) {
                continue;
            }

            if (this.lm_request.hasOwnProperty('insurer_id') && this.lm_request['insurer_id'] != '' && insurer_id != this.lm_request['insurer_id']) {
                continue;
            }
            if (insurer_id == 7 && (this.lm_request['product_id'] === 12 && this.lm_request['vehicle_insurance_type'] === 'new')) { // block for IFFCO - CV - New vehicle 
                continue;
            }

            console.error('DBG', 'Isactive', Insurer_Object.Is_Active, 'Product_class', Product_Class, 'Insurer_Product_Class', Insurer_Product_Class);
            if (Insurer_Object.Is_Active === 1 &&
                fs.existsSync(appRoot + '/libs/' + Product_Class + '/' + Insurer_Product_Class + '.js')) {


                //console.log('==========================');
                //console.log('Start', 'Product_class', Product_Class, 'Insurer_Product_Class', Insurer_Product_Class);
                //var prepared_request = this.prepared_request;
                //prepared_request['insurer_id'] = insurer_id;
                try {
                    let specific_insurer_object = {
                        'insurer_id': insurer_id,
                        'insurer_product_class': Insurer_Product_Class,
                        'method': this.ArrayFindByKey(Insurer_Object.Method_List, 'Method_Type', this.lm_request['method_type']),
                        'prepared_request': this.prepared_request,
                        'master_db_list': null,
                        'method_field_list': null,
                        'method_file_url': ''
                    };
                    if (this.lm_request['product_id'] == 12) {
                        console.error('CVDBG', 'STEP3', Product_Class, Insurer_Product_Class, specific_insurer_object);
                    }
                    if (specific_insurer_object.method.Service_File && fs.existsSync(appRoot + '/resource/wsdl/' + specific_insurer_object.method.Service_File)) {
                        specific_insurer_object['method_file_url'] = appRoot + '/resource/wsdl/' + specific_insurer_object.method.Service_File;
                    } else {
                        specific_insurer_object['method_file_url'] = specific_insurer_object.method.Service_URL;
                    }
                    this.insurer_master_object['insurer_id_' + insurer_id] = specific_insurer_object;
                    let InsurerProduct = require(appRoot + '/libs/' + Product_Class + '/' + Insurer_Product_Class);
                    let objInsurerProduct = new InsurerProduct();
                    objInsurerProduct.const_payment_response = this.const_payment_response;
                    objInsurerProduct.insurer_id = insurer_id;
                    objInsurerProduct.insurer_lm_request = this.lm_request;
                    objInsurerProduct.lm_request = this.lm_request;
                    objInsurerProduct.response_object = this.response_object;
                    objInsurerProduct.Master_Details = this.Master_Details;
                    objInsurerProduct.proposal_processed_request = this.proposal_processed_request;
                    objInsurerProduct.request_process_handler = this.request_process_handler;
                    objInsurerProduct.docRequest = this.docRequest;
                    objInsurerProduct.prepared_request = {};
                    objInsurerProduct.processed_request = {};
                    if (this.lm_request['method_type'] == 'Pdf') {
                        console.error('DBG', 'PdfLoop', this.lm_request);
                    }
                    objInsurerProduct.method_field_get(this, Insurer_Object, specific_insurer_object);
                }
                catch (e) {
                    console.error('Exception', 'LIBCLASSERROR', e.stack);
                }
                //console.log('Finish', 'Product_class', Product_Class, 'Insurer_Product_Class', Insurer_Product_Class);
                //console.log('==========================');
            }
            else {
                if (this.lm_request['method_type'] == 'Pdf') {
                    console.error("DBG", "integration_process_all", 'pdfloop', 'notactive', objRequestCore);
                }
            }
        }
        //        if (this.lm_request['execution_async'] === 'yes' && this.lm_request['method_type'] == 'Premium') {
        //            eval(this.request_process_handler);
        //        }
        //console.log(this.constructor.name + '::' + 'integration_process_all' + '::Finish');
    } catch (e) {
        console.error('Error', 'integration_process_all', this.constructor.name, e);
    }
}
Base.prototype.master_db_get = function (objProduct, Insurer_Object, specific_insurer_object) {
    try {
        var objInsurerProduct = this;
        let product_id = objProduct.db_specific_product.Product_Id;
        let insurer_id = Insurer_Object.Insurer_ID;
        let insurer_id_for_master = 0;
        /*if ([35].indexOf(insurer_id) > -1) {
         insurer_id_for_master = 2;
         } else {
         insurer_id_for_master = insurer_id;
         }*/
        insurer_id_for_master = insurer_id;
        var master_db_list = null;
        // master_db_list['plan_list'] = null;
        if (product_id === 2) { // remove after used roshani
            console.error({ "objProduct": objProduct, "Insurer_Object": Insurer_Object, "specific_insurer_object": specific_insurer_object })
        }
        if (product_id === 1 || product_id === 10 || product_id === 12) {
        }

        if (objProduct.lm_request.hasOwnProperty('vehicle_id')) {
            master_db_list = {
                'vehicles': null
            };
        } else {
            master_db_list = {};
        }
        if (product_id === 13) {
            master_db_list = {
                'commodity': null
            };
            //        //pincode
            if ((objProduct.lm_request.method_type === 'Proposal' || objProduct.lm_request.method_type === 'Customer') && objProduct.lm_request.hasOwnProperty('permanent_pincode')) {
                if (objProduct.lm_request['permanent_pincode'] !== '') {
                    master_db_list['pincodes'] = null;
                }
            }

        }

        var Arr_Method_List = ['Customer', 'Proposal', 'Verification', 'Pdf', 'Status'];
        if (objProduct.lm_request.hasOwnProperty('api_reference_number') && Arr_Method_List.indexOf(this.lm_request['method_type']) > -1) {
            if (objProduct.lm_request['api_reference_number'] !== '') {
                master_db_list['service_logs'] = null;
            }
        }

        if (objProduct.lm_request.hasOwnProperty('rto_id')) {
            if (objProduct.lm_request['rto_id'] !== '') {
                master_db_list['rtos'] = null;
            }
        }
        if (objProduct.lm_request.hasOwnProperty('prev_insurer_id') && objProduct.lm_request['vehicle_insurance_type'] === 'renew') {
            if (objProduct.lm_request.hasOwnProperty('is_policy_exist')) {
                if (objProduct.lm_request['is_policy_exist'] === 'yes') {
                    if (objProduct.lm_request['prev_insurer_id'] !== '') {
                        master_db_list['prev_insurer'] = null;
                    }
                }
            } else {
                if ((objProduct.lm_request['prev_insurer_id'] - 0) > 0) {
                    master_db_list['prev_insurer'] = null;
                }
            }
        }
        //get city master for health
        if (objProduct.lm_request.hasOwnProperty('city_id')) {
            console.error('Niva Health Renew LINE1');
            if (objProduct.lm_request['product_id'] && objProduct.lm_request['product_id'] == 2 && objProduct.lm_request['health_policy_type'] && objProduct.lm_request['health_policy_type'] == 'renew') {
                console.error('Niva Health Renew LINE2');
            } else if (objProduct.lm_request['city_id'] !== '') {
                master_db_list['cities'] = null;
            }
        }
        if (product_id === 2) {
            if ([20, 38, 6].includes(insurer_id) && (objProduct.lm_request.method_type === 'Premium' || objProduct.lm_request.method_type === 'Get_Renewal') && objProduct.lm_request.health_policy_type === "renew") {
                objInsurerProduct.master_motor_db_get_handler(master_db_list, insurer_id, objProduct, objInsurerProduct, Insurer_Object, specific_insurer_object);
            }
            //pincode
            if (insurer_id === 21 && objProduct.lm_request.hasOwnProperty('permanent_pincode')) {
                if (objProduct.lm_request['permanent_pincode'] !== '') {
                    master_db_list['pincodes'] = null;
                }
            }

            //get zonecode for cigna
            if (insurer_id === 38) {
                if (objProduct.lm_request.method_type === 'Premium' && objProduct.lm_request.hasOwnProperty('permanent_pincode') && objProduct.lm_request['permanent_pincode'] !== '') {
                    master_db_list['zones'] = null;
                }
                if (objProduct.lm_request.method_type === 'Proposal' && objProduct.lm_request['topup_applied'] === true) {
                    master_db_list['elite'] = null;
                }
            }

            //get plan for maxbupa
            //  if (insurer_id === 20) {
            //     master_db_list['plans'] = null;
            // }

            //get plan for hdfc
            //            if (insurer_id === 5) {
            //                if (objProduct.lm_request.method_type === 'Premium') {
            //                    master_db_list['hdfc_plans'] = null;
            //                }
            //            }
            //get zone for digit
            if (insurer_id === 44) {
                if (objProduct.lm_request.method_type === 'Premium' && objProduct.lm_request.hasOwnProperty('permanent_pincode') && objProduct.lm_request['permanent_pincode'] !== '') {
                    master_db_list['zones'] = null;
                }
            }
        }
        //handle new case
        if (objProduct.lm_request.hasOwnProperty('vehicle_insurance_type') && objProduct.lm_request['vehicle_insurance_type'] === 'new') {
            var sample_prev_insurer = {
                "Insurer_ID": "",
                "InsurerName": "",
                "PreviousInsurer_Code": "",
                "PreviousInsurer_Id": ""
            };
            master_db_list['prev_insurer'] = {
                'pb_db_master': sample_prev_insurer,
                'insurer_db_master': sample_prev_insurer
            };
        }
        //get vehicle master
        if (master_db_list.hasOwnProperty('vehicles')) {


            var vehicles_master = {
                'pb_db_master': objInsurerProduct['Master_Details']['vehicle'],
                'insurer_db_master': null
            };
            var Insurer_Vehicle_ID = 0;
            let iv_cond = null;
            /*if (insurer_id_for_master === 17 && product_id === 10) {
                iv_cond = {
                    "Insurer_Vehicle_Code": objProduct.lm_request.vehicle_id,
                    "Insurer_ID": 17
                };
            } else */if (insurer_id_for_master === 48) {
                iv_cond = {
                    "Insurer_Vehicle_Code": objProduct.lm_request.vehicle_id,
                    "Insurer_ID": 48
                };
            } else {
                if (objInsurerProduct['Master_Details']['vehicle'].hasOwnProperty('Insurer_' + insurer_id_for_master)) {
                    if (objInsurerProduct['Master_Details']['vehicle']['Insurer_' + insurer_id_for_master]['Is_Active'] === 1 && (objInsurerProduct['Master_Details']['vehicle']['Insurer_' + insurer_id_for_master]['Insurer_Vehicle_ID'] - 0) > 0) {
                        Insurer_Vehicle_ID = objInsurerProduct['Master_Details']['vehicle']['Insurer_' + insurer_id_for_master]['Insurer_Vehicle_ID'] - 0;
                        iv_cond = {
                            "Insurer_Vehicle_ID": Insurer_Vehicle_ID
                        };
                    } else {
                        VehicleErrorCode = 'LM003';
                        if (objInsurerProduct['Master_Details']['vehicle']['Insurer_' + insurer_id_for_master]['Status_Id'] === 3) {
                            VehicleErrorCode = 'LM008'; // vehicle not supported
                        }
                    }
                } else {
                    VehicleErrorCode = 'LM003';
                }
            }
            if (iv_cond !== null) {
                var Vehicles_Insurer = require('../models/vehicles_insurer');
                Vehicles_Insurer.findOne(iv_cond, function (err2, dbVehicles_Insurer) {
                    if (err2) {
                        console.error('MongooseException', this.constructor.name, 'master_db_get', 'Vehicles_InsurerFind', err2);
                    } else {
                        if (dbVehicles_Insurer) {
                            vehicles_master['insurer_db_master'] = dbVehicles_Insurer._doc;
                            if (vehicles_master['insurer_db_master']['Insurer_Vehicle_CubicCapacity']) {
                                vehicles_master['insurer_db_master']['Insurer_Vehicle_CubicCapacity'] = vehicles_master['insurer_db_master']['Insurer_Vehicle_CubicCapacity'].toString().replace(/[^0-9&&^.]/g, "");
                            }
                            master_db_list['vehicles'] = vehicles_master;
                            objInsurerProduct.master_motor_db_get_handler(master_db_list, insurer_id, objProduct, objInsurerProduct, Insurer_Object, specific_insurer_object);

                        } else {
                            console.error('MongooseException', this.constructor.name, 'master_db_get', 'Vehicles_InsurerFind', 'NOREC');
                        }
                    }
                });
            } else {
                Error_Code = VehicleErrorCode;
                var logGuid = objInsurerProduct.create_guid('ARN-');
                var docLog = {
                    "Service_Log_Id": "",
                    "Service_Log_Unique_Id": logGuid,
                    "User_Data_Id": objProduct.lm_request['udid'] - 0,
                    "Request_Id": objProduct.docRequest.Request_Id,
                    "Request_Unique_Id": objProduct.docRequest.Request_Unique_Id,
                    "PB_CRN": objProduct.docRequest.PB_CRN,
                    "Client_Id": objProduct.docRequest.Client_Id,
                    "LM_Custom_Request": null,
                    "Status": "complete",
                    "Error_Code": Error_Code,
                    "Error_Details": vehicles_master.pb_db_master,
                    "Is_Active": 1,
                    "Created_On": new Date(),
                    "Product_Id": objProduct.db_specific_product.Product_Id,
                    "Insurer_Id": Insurer_Object.Insurer_ID,
                    "Method_Type": "Premium",
                    "Call_Execution_Time": 0
                };
                objInsurerProduct.save_log(docLog);
            }
        }
        //get vehicle Master

        //get rto master
        if (master_db_list.hasOwnProperty('rtos')) {
            var rtos_master = {
                'pb_db_master': objInsurerProduct['Master_Details']['rto'],
                'insurer_db_master': null
            };
            var Insurer_Rto_ID = 0;
            let ir_cond = null;
            if (insurer_id_for_master === 16) {
                ir_cond = {
                    "Insurer_Rto_District_Code": objProduct.lm_request.rto_id,
                    "Insurer_ID": 16
                };
            } /*else if (insurer_id_for_master === 17 && product_id === 10) {
                ir_cond = {
                    "Insurer_Rto_City_Code": objProduct.lm_request.rto_id,
                    "Insurer_ID": 17
                };
            }*/ else if (insurer_id_for_master === 48) {
                ir_cond = {
                    "Insurer_Rto_District_Code": objProduct.lm_request.rto_id, //"Insurer_Vehicle_Code": objProduct.lm_request.vehicle_id,
                    "Insurer_ID": 48
                };
            } else {
                if (objInsurerProduct['Master_Details']['rto'].hasOwnProperty('Insurer_' + insurer_id_for_master)) {
                    if ((objInsurerProduct['Master_Details']['rto']['Insurer_' + insurer_id_for_master]['Insurer_Rto_ID'] - 0) > 0) {
                        Insurer_Rto_ID = objInsurerProduct['Master_Details']['rto']['Insurer_' + insurer_id_for_master]['Insurer_Rto_ID'] - 0;
                        ir_cond = {
                            "Insurer_Rto_ID": Insurer_Rto_ID
                        };
                    }
                }
            }
            if (ir_cond !== null) {
                var Rtos_Insurer = require('../models/rtos_insurer');
                Rtos_Insurer.findOne(ir_cond, function (err2, dbRtos_Insurer) {
                    if (err2) {
                        console.error('MongooseException', this.constructor.name, 'master_db_get', 'Rtos_InsurerFind', err2);
                    } else {
                        if (dbRtos_Insurer) {
                            rtos_master['insurer_db_master'] = dbRtos_Insurer._doc;
                            master_db_list['rtos'] = rtos_master;
                            objInsurerProduct.master_motor_db_get_handler(master_db_list, insurer_id, objProduct, objInsurerProduct, Insurer_Object, specific_insurer_object);

                        } else {
                            console.error('MongooseException', this.constructor.name, 'master_db_get', 'Rtos_InsurerFind', 'NOREC', ir_cond);
                        }
                    }
                });
            } else {
                Error_Code = 'LM004';
                var logGuid = objInsurerProduct.create_guid('ARN-');
                var docLog = {
                    "Service_Log_Id": "",
                    "Service_Log_Unique_Id": logGuid,
                    "Request_Id": objProduct.docRequest.Request_Id,
                    "User_Data_Id": objProduct.lm_request['udid'] - 0,
                    "Request_Unique_Id": objProduct.docRequest.Request_Unique_Id,
                    "PB_CRN": objProduct.docRequest.PB_CRN,
                    "Client_Id": objProduct.docRequest.Client_Id,
                    "LM_Custom_Request": null,
                    "Status": "complete",
                    "Error_Code": Error_Code,
                    "Error_Details": rtos_master.pb_db_master,
                    "Is_Active": 1,
                    "Created_On": new Date(),
                    "Product_Id": objProduct.db_specific_product.Product_Id,
                    "Insurer_Id": Insurer_Object.Insurer_ID,
                    "Method_Type": "Premium",
                    "Call_Execution_Time": 0
                };
                objInsurerProduct.save_log(docLog);
            }

        }

        //get city master
        if (master_db_list.hasOwnProperty('cities')) {
            var City = require('../models/city');
            City.findOne({ "City_ID": objProduct.lm_request.city_id }, function (err, dbCity) {
                if (err) {
                    console.error('MongooseException', this.constructor.name, 'master_db_get', 'CityFind', err);
                } else {
                    if (dbCity !== null) {
                        var cities_master = {
                            'pb_db_master': dbCity._doc,
                            'insurer_db_master': null
                        };
                        master_db_list['cities'] = cities_master;
                        objInsurerProduct.master_motor_db_get_handler(master_db_list, insurer_id, objProduct, objInsurerProduct, Insurer_Object, specific_insurer_object);
                    } else {
                        Error_Code = 'LM010';
                        var logGuid = objInsurerProduct.create_guid('ARN-');
                        var docLog = {
                            "Service_Log_Id": "",
                            "Service_Log_Unique_Id": logGuid,
                            "Request_Id": objProduct.docRequest.Request_Id,
                            "User_Data_Id": objProduct.lm_request['udid'] - 0,
                            "Request_Unique_Id": objProduct.docRequest.Request_Unique_Id,
                            "PB_CRN": objProduct.docRequest.PB_CRN,
                            "Client_Id": objProduct.docRequest.Client_Id,
                            "LM_Custom_Request": null,
                            "Status": "complete",
                            "Error_Code": Error_Code,
                            "Error_Details": (cities_master && cities_master.pb_db_master) ? cities_master.pb_db_master : "No data received from city id collection",
                            "Is_Active": 1,
                            "Created_On": new Date(),
                            "Product_Id": objProduct.db_specific_product.Product_Id,
                            "Insurer_Id": Insurer_Object.Insurer_ID,
                            "Method_Type": "Premium",
                            "Call_Execution_Time": 0
                        };
                        objInsurerProduct.save_log(docLog);
                    }
                }
            });
        }
        //1806get city code by insurer master 
        if (master_db_list.hasOwnProperty('pincodes')) {
            var pincode_insurer = require('../models/pincode_insurer');
            var cityName = "^" + objProduct.lm_request['city_name'] + "$";
            pincode_insurer.findOne({ "Insurer_Id": insurer_id, "City": { '$regex': cityName, '$options': 'i' } }, function (err, dbCityId) {
                if (err) {
                    console.error('MongooseException', this.constructor.name, 'master_db_get', 'CityFind', err);
                } else {
                    if (dbCityId !== null) {
                        var insurer_pincode_master = {
                            'pb_db_master': product_id === 2 ? dbCityId['_doc']['City_Id'] : dbCityId['_doc'],
                            'insurer_db_master': product_id === 13 ? dbCityId['_doc'] : null
                        };
                        master_db_list['pincodes'] = insurer_pincode_master;
                        objInsurerProduct.master_motor_db_get_handler(master_db_list, insurer_id, objProduct, objInsurerProduct, Insurer_Object, specific_insurer_object);
                    } else {
                        Error_Code = 'LM010';
                        var logGuid = objInsurerProduct.create_guid('ARN-');
                        var docLog = {
                            "Service_Log_Id": "",
                            "Service_Log_Unique_Id": logGuid,
                            "Request_Id": objProduct.docRequest.Request_Id,
                            "User_Data_Id": objProduct.lm_request['udid'] - 0,
                            "Request_Unique_Id": objProduct.docRequest.Request_Unique_Id,
                            "PB_CRN": objProduct.docRequest.PB_CRN,
                            "Client_Id": objProduct.docRequest.Client_Id,
                            "LM_Custom_Request": null,
                            "Status": "complete",
                            "Error_Code": Error_Code,
                            "Error_Details": "Town code unavailable",
                            "Is_Active": 1,
                            "Created_On": new Date(),
                            "Product_Id": objProduct.db_specific_product.Product_Id,
                            "Insurer_Id": Insurer_Object.Insurer_ID,
                            "Method_Type": "Premium",
                            "Call_Execution_Time": 0
                        };
                        objInsurerProduct.save_log(docLog);
                    }
                }
            });
        }

        //get zone code by insurer master 
        if (master_db_list.hasOwnProperty('zones')) {
            var pincode_insurer = require('../models/pincode_insurer');
            pincode_insurer.findOne({ "Pincode": objProduct.lm_request.permanent_pincode, "Insurer_Id": insurer_id }, function (err, dbZoneCd) {
                if (err) {
                    console.error('MongooseException', this.constructor.name, 'master_db_get', 'ZoneFind', err);
                } else {
                    if (dbZoneCd !== null) {
                        var insurer_zone_master = {
                            'pb_db_master': dbZoneCd['_doc']['ZONECD'],
                            'insurer_db_master': null
                        };
                        master_db_list['zones'] = insurer_zone_master;
                        objInsurerProduct.master_motor_db_get_handler(master_db_list, insurer_id, objProduct, objInsurerProduct, Insurer_Object, specific_insurer_object);
                    } else {
                        Error_Code = 'LM010';
                        var logGuid = objInsurerProduct.create_guid('ARN-');
                        var docLog = {
                            "Service_Log_Id": "",
                            "Service_Log_Unique_Id": logGuid,
                            "Request_Id": objProduct.docRequest.Request_Id,
                            "User_Data_Id": objProduct.lm_request['udid'] - 0,
                            "Request_Unique_Id": objProduct.docRequest.Request_Unique_Id,
                            "PB_CRN": objProduct.docRequest.PB_CRN,
                            "Client_Id": objProduct.docRequest.Client_Id,
                            "LM_Custom_Request": null,
                            "Status": "complete",
                            "Error_Code": Error_Code,
                            "Error_Details": insurer_zone_master.pb_db_master,
                            "Is_Active": 1,
                            "Created_On": new Date(),
                            "Product_Id": objProduct.db_specific_product.Product_Id,
                            "Insurer_Id": Insurer_Object.Insurer_ID,
                            "Method_Type": "Premium",
                            "Call_Execution_Time": 0
                        };
                        objInsurerProduct.save_log(docLog);
                    }
                }
            });
        }
        //get elideId from db for cigna
        if (master_db_list.hasOwnProperty('elite')) {
            var mem_name = objProduct.lm_request.first_name.toUpperCase() + ' ' + objProduct.lm_request.last_name.toUpperCase();
            var elite_mem = require('../models/elite_members');
            elite_mem.findOne({ "Member_Name": mem_name, "Member_Mobile": objProduct.lm_request.mobile }, function (err, dbEliteMem) {
                if (err) {
                    console.error('MongooseException', this.constructor.name, 'master_db_get', 'EliteMemFind', err);
                } else if (dbEliteMem === null) {
                    Error_Code = 'LM011';
                    var logGuid = objInsurerProduct.create_guid('ARN-');
                    var docLog = {
                        "Service_Log_Id": "",
                        "Service_Log_Unique_Id": logGuid,
                        "Request_Id": objProduct.docRequest.Request_Id,
                        "User_Data_Id": objProduct.lm_request['udid'] - 0,
                        "Request_Unique_Id": objProduct.docRequest.Request_Unique_Id,
                        "PB_CRN": objProduct.docRequest.PB_CRN,
                        "Client_Id": objProduct.docRequest.Client_Id,
                        "LM_Custom_Request": null,
                        "Status": "complete",
                        "Error_Code": Error_Code,
                        "Error_Details": "Elite ID not found",
                        "Is_Active": 1,
                        "Created_On": new Date(),
                        "Product_Id": objProduct.db_specific_product.Product_Id,
                        "Insurer_Id": Insurer_Object.Insurer_ID,
                        "Method_Type": "Proposal",
                        "Call_Execution_Time": 0
                    };
                    objInsurerProduct.save_log(docLog);
                } else {
                    if (dbEliteMem !== null) {
                        var insurer_elite_master = {
                            'pb_db_master': dbEliteMem['_doc']['Certificate_Id'],
                            'insurer_db_master': null
                        };
                        master_db_list['elite'] = insurer_elite_master;
                        objInsurerProduct.master_motor_db_get_handler(master_db_list, insurer_id, objProduct, objInsurerProduct, Insurer_Object, specific_insurer_object);
                    }
                }
            });
        }
        //get plans for MaxBupa 
        if (master_db_list.hasOwnProperty('plans')) {
            var pincode_insurer = require('../models/pincode_insurer');
            let actual_si = objInsurerProduct.health_suminsured_selector(objProduct.lm_request['health_insurance_si'] - 0, objInsurerProduct.const_insurer_suminsured);
            let si = actual_si;
            let adult = (objProduct.lm_request['member_count'] === 1 || objProduct.lm_request['multi_individual'] === 'yes') ? [0, objProduct.lm_request['adult_count']] : [objProduct.lm_request['adult_count']];
            let child = (objProduct.lm_request['member_count'] === 1 || objProduct.lm_request['multi_individual'] === 'yes') ? [0, objProduct.lm_request['child_count']] : [objProduct.lm_request['child_count']];
            let multi_individual = (objProduct.lm_request['member_count'] === 1 || objProduct.lm_request['multi_individual'] === 'yes') ? ['N', 'Y'] : ['Y'];
            let city_name = "^" + objProduct.lm_request['city_name'].toUpperCase() + "$";
            pincode_insurer.findOne({ "City": { '$regex': city_name, '$options': 'i' }, "Insurer_Id": 20 }, function (err, mbPin) {
                if (err) {
                    console.error('MongooseException', this.constructor.name, 'master_db_get', 'MaxBupa_zoneFind', err);
                } else {
                    if (mbPin) {
                        var maxbupa_plan = require('../models/maxbupa_plan');
                        let zone = mbPin['_doc']['ZONECD'];
                        var arr_zone = [zone, 'Nat'];
                        let search_plan_condition = { "PLAN_LIMIT": si, "FAMILY_FLOATER_IND": { "$in": multi_individual }, "ADULT_COVERED": { "$in": adult }, "CHILD_COVERED": { "$in": child }, "FLOATER_LIMIT": 0, "DEDUCT_AMOUNT": 0, "ZONE": { "$in": arr_zone } };
                        maxbupa_plan.find(search_plan_condition, function (err, dbPlan) {
                            if (err) {
                                console.error('MongooseException', this.constructor.name, 'master_db_get', 'MaxBupa_PlanFind', err);
                            } else {
                                if (dbPlan !== null && dbPlan.length > 0) {
                                    var insurer_plan_master = {
                                        'pb_db_master': dbPlan[0]._doc['PLAN_ID'],
                                        'insurer_db_master': dbPlan.length > 1 ? dbPlan[1]._doc['PLAN_ID'] : null
                                    };
                                    master_db_list['plans'] = insurer_plan_master;
                                    objInsurerProduct.master_motor_db_get_handler(master_db_list, insurer_id, objProduct, objInsurerProduct, Insurer_Object, specific_insurer_object);
                                } else {
                                    console.error('MongooseException', this.constructor.name, 'master_db_get', 'MaxBupa_PlanFind', 'NOREC');
                                }
                            }
                        });
                    }
                }
            });
        }
        //get plans for HDFCErgo 
        if (master_db_list.hasOwnProperty('hdfc_plans')) {
            var hdfc_plan = require('../models/hdfc_plan');
            var pincode_insurer = require('../models/pincode_insurer');
            var actual_si = objInsurerProduct.health_suminsured_selector(objProduct.lm_request['health_insurance_si'] - 0, objInsurerProduct.const_insurer_suminsured);
            var si = actual_si.toString();
            var adult = objProduct.lm_request['adult_count'];
            var child = objProduct.lm_request['child_count'];
            var tenure = objProduct.lm_request['policy_tenure'].toString();
            var age = (objProduct.lm_request['elder_member_age']).toString();
            var pincode = parseInt(objProduct.lm_request['permanent_pincode']);
            var insured_pattern = '1000';
            if (adult === 1) {
                if (child === 1) {
                    insured_pattern = '1010';
                } else if (child === 2) {
                    insured_pattern = '1020';
                }
            } else {
                insured_pattern = '1100';
                if (child === 1) {
                    insured_pattern = '1110';
                } else if (child === 2) {
                    insured_pattern = '1120';
                }
            }
            pincode_insurer.findOne({ "Pincode": pincode, "Insurer_Id": 5 }, function (err, hdfcPin) {
                if (err) {
                    console.error('MongooseException', this.constructor.name, 'master_db_get', 'hdfc_PinFind', err);
                } else {
                    if (hdfcPin) {
                        var tier = (hdfcPin['_doc']['Tier_Id']).toString();
                        // mg**
                        //                    var member_count = adult + child;
                        for (var i = 1; i <= adult; i++) {
                            //var tenure = objProduct.lm_request['policy_tenure'].toString();
                            let elder_age = (objProduct.lm_request['member_' + i + '_age']).toString();
                            hdfc_plan.findOne({ "SumInsured": si, "TierID": tier, "Tenure": tenure, "Age": elder_age }, function (err1, hdfcPlan) {
                                if (err1) {
                                    console.error('MongooseException', this.constructor.name, 'master_db_get', 'hdfc_PlanFind', err1);
                                } else {
                                    if (hdfcPlan) {
                                        var insurer_plan_master = {
                                            'pb_db_master': hdfcPlan['_doc']['PlanCode'],
                                            'insurer_db_master': null
                                        };
                                        master_db_list['hdfc_plans'] = insurer_plan_master;
                                        objInsurerProduct.master_motor_db_get_handler(master_db_list, insurer_id, objProduct, objInsurerProduct, Insurer_Object, specific_insurer_object);
                                    } else {
                                        console.error('MongooseException', this.constructor.name, 'master_db_get', 'hdfc_PlanFind', 'NOREC');
                                    }
                                }
                            });
                        } //for mg**

                        for (var i = 3; i <= child + 2; i++) {
                            //var tenure = objProduct.lm_request['policy_tenure'].toString();
                            let child_age = (objProduct.lm_request['member_' + i + '_age']).toString();
                            hdfc_plan.findOne({ "SumInsured": si, "TierID": tier, "Tenure": tenure, "Age": child_age }, function (err1, hdfcPlan) {
                                if (err1) {
                                    console.error('MongooseException', this.constructor.name, 'master_db_get', 'hdfc_PlanFind', err1);
                                } else {
                                    if (hdfcPlan) {
                                        var insurer_plan_master = {
                                            'pb_db_master': hdfcPlan['_doc']['PlanCode'],
                                            'insurer_db_master': null
                                        };
                                        master_db_list['hdfc_plans'] = insurer_plan_master;
                                        objInsurerProduct.master_motor_db_get_handler(master_db_list, insurer_id, objProduct, objInsurerProduct, Insurer_Object, specific_insurer_object);
                                    } else {
                                        console.error('MongooseException', this.constructor.name, 'master_db_get', 'hdfc_PlanFind', 'NOREC');
                                    }
                                }
                            });
                        } //for mg**
                    }
                }
            });
        }
        //get previous insurer master start

        if (master_db_list.hasOwnProperty('prev_insurer') && objProduct.lm_request['vehicle_insurance_type'] === 'renew') {
            var prev_insurer_master = {
                'pb_db_master': objInsurerProduct['Master_Details']['prev_insurer'],
                'insurer_db_master': null
            };
            var Prev_Insurer = require('../models/prev_insurer');
            Prev_Insurer.findOne({
                "Insurer_ID": insurer_id_for_master,
                "PreviousInsurer_Id": objInsurerProduct.lm_request.prev_insurer_id,
            }, function (err1, dbPrev_Insurer) {
                if (err1) {
                    console.error('MongooseException', this.constructor.name, 'master_db_get', 'PBPrevInsurer_Find', err1);
                } else {
                    if (dbPrev_Insurer) {
                        prev_insurer_master['insurer_db_master'] = dbPrev_Insurer._doc;
                        master_db_list['prev_insurer'] = prev_insurer_master;
                        objInsurerProduct.master_motor_db_get_handler(master_db_list, insurer_id, objProduct, objInsurerProduct, Insurer_Object, specific_insurer_object);
                    } else {
                        Error_Code = 'LM005';
                        var logGuid = objInsurerProduct.create_guid('ARN-');
                        var docLog = {
                            "Service_Log_Id": "",
                            "Service_Log_Unique_Id": logGuid,
                            "Request_Id": objProduct.docRequest.Request_Id,
                            "User_Data_Id": objProduct.lm_request['udid'] - 0,
                            "Request_Unique_Id": objProduct.docRequest.Request_Unique_Id,
                            "PB_CRN": objProduct.docRequest.PB_CRN,
                            "Client_Id": objProduct.docRequest.Client_Id,
                            "LM_Custom_Request": null,
                            "Status": "complete",
                            "Error_Code": Error_Code,
                            "Error_Details": prev_insurer_master.pb_db_master,
                            "Is_Active": 1,
                            "Created_On": new Date(),
                            "Product_Id": objProduct.db_specific_product.Product_Id,
                            "Insurer_Id": Insurer_Object.Insurer_ID,
                            "Method_Type": "Premium",
                            "Call_Execution_Time": 0
                        };
                        objInsurerProduct.save_log(docLog);
                        console.error('MongooseFind', this.constructor.name, 'master_db_get', 'PBPrevInsurer_Find', 'NOREC');
                    }
                }
            });
        }
        //get previous insurer master finish

		//get TP insurer master start
		var tp_ins_flag = false;
		if ([1, 10, 12].indexOf(product_id) > -1) {
			try {
				var manfYear = parseInt(objProduct.lm_request.vehicle_manf_date.split('-')[0]);
				var currentYear = parseInt(moment().format('YYYY'));
				var yearsDiff = currentYear - manfYear;
			} catch (e) {
				
			}
			if (insurer_id === 35) {
				if (objProduct.lm_request['vehicle_insurance_type'] === 'renew' && objProduct.lm_request['method_type'] !== "Pdf"  && (objProduct.lm_request['vehicle_insurance_subtype'] === '1OD_0TP' ||
						objProduct.lm_request['vehicle_insurance_subtype'] === '1CH_0TP') && ((product_id === 1 && yearsDiff === 4) || (product_id === 10 && yearsDiff === 6))) {
					tp_ins_flag = true;
					if (objProduct.lm_request['vehicle_insurance_subtype'] === '1CH_0TP' && objProduct.lm_request['method_type'] === 'Premium') {
						objInsurerProduct.lm_request.tp_insurer_id = objInsurerProduct.lm_request.prev_insurer_id;
					}
					if (objProduct.lm_request['vehicle_insurance_subtype'] === '1CH_0TP' && objProduct.lm_request['method_type'] === 'Verification' && objInsurerProduct.hasOwnProperty('proposal_processed_request')) {
						objInsurerProduct.lm_request.tp_insurer_id = (objInsurerProduct && objInsurerProduct.proposal_processed_request && objInsurerProduct['proposal_processed_request']['___tp_insurer_id___']) || 0;
					}
				}
			} else {
				if (objProduct.lm_request['vehicle_insurance_type'] === 'renew' && objProduct.lm_request['vehicle_insurance_subtype'] === '1OD_0TP' && (product_id === 1 || product_id === 10)) {
					tp_ins_flag = true;
				}
			}
		}
        if (tp_ins_flag) {
            //if (objProduct.lm_request['vehicle_insurance_type'] === 'renew' && objProduct.lm_request['vehicle_insurance_subtype'] === '1OD_0TP' && (product_id === 1 || product_id === 10)) {
            master_db_list['tp_insurer'] = null;

            if (master_db_list.hasOwnProperty('tp_insurer')) {
                var tp_insurer_master = {
                    'pb_db_master': objInsurerProduct['Master_Details']['tp_insurer'] === undefined ? null : objInsurerProduct['Master_Details']['tp_insurer'],
                    'insurer_db_master': null
                };
                var TP_Insurer = require('../models/prev_insurer');
                TP_Insurer.findOne({
                    "Insurer_ID": insurer_id_for_master,
                    "PreviousInsurer_Id": objInsurerProduct.lm_request.tp_insurer_id
                }, function (err1, dbPrev_Insurer) {
                    if (err1) {
                        console.error('MongooseException', this.constructor.name, 'master_db_get', 'PBPrevInsurer_Find', err1);
                    } else {
                        if (dbPrev_Insurer) {
                            tp_insurer_master['insurer_db_master'] = dbPrev_Insurer._doc;
                            master_db_list['tp_insurer'] = tp_insurer_master;
                            objInsurerProduct.master_motor_db_get_handler(master_db_list, insurer_id, objProduct, objInsurerProduct, Insurer_Object, specific_insurer_object);
                        } else {
                            Error_Code = 'LM005';
                            var logGuid = objInsurerProduct.create_guid('ARN-');
                            var docLog = {
                                "Service_Log_Id": "",
                                "Service_Log_Unique_Id": logGuid,
                                "Request_Id": objProduct.docRequest.Request_Id,
                                "User_Data_Id": objProduct.lm_request['udid'] - 0,
                                "Request_Unique_Id": objProduct.docRequest.Request_Unique_Id,
                                "PB_CRN": objProduct.docRequest.PB_CRN,
                                "Client_Id": objProduct.docRequest.Client_Id,
                                "LM_Custom_Request": null,
                                "Status": "complete",
                                "Error_Code": Error_Code,
                                "Error_Details": tp_insurer_master.pb_db_master,
                                "Is_Active": 1,
                                "Created_On": new Date(),
                                "Product_Id": objProduct.db_specific_product.Product_Id,
                                "Insurer_Id": Insurer_Object.Insurer_ID,
                                "Method_Type": "Premium",
                                "Call_Execution_Time": 0
                            };
                            objInsurerProduct.save_log(docLog);
                            console.error('MongooseFind', this.constructor.name, 'master_db_get', 'PBPrevInsurer_Find', 'NOREC');
                        }
                    }
                });
            }
        }
		//get TP insurer master finish

        //get vehicle master
        if (master_db_list.hasOwnProperty('service_logs')) {
            // var Service_Log = require('../models/service_log');
            // Service_Log.findOne({ "Service_Log_Unique_Id": objInsurerProduct.lm_request.api_reference_number }, function (err, dbService_Log) {
            //     if (err) {
            //         console.error('Exception', this.constructor.name, 'service_call', e);
            //     } else {
            //         if (dbService_Log) {
            //             var objService_Log = {};
            //             for (var k in dbService_Log._doc) {
            //                 objService_Log[k] = dbService_Log._doc[k];
            //                 if (dbService_Log._doc[k] !== null && typeof dbService_Log._doc[k] !== 'object') {

            //                 }
            //             }
            //             master_db_list['service_logs'] = {
            //                 'pb_db_master': objService_Log,
            //                 'insurer_db_master': objService_Log
            //             };
            //             objInsurerProduct.master_motor_db_get_handler(master_db_list, insurer_id, objProduct, objInsurerProduct, Insurer_Object, specific_insurer_object);
            //         }
            //     }
            // });
            var Client = require('node-rest-client').Client;
            var client = new Client();
            var service_log_args = {
                data: { query: { "Service_Log_Unique_Id": objInsurerProduct.lm_request.api_reference_number } },
                headers: {
                    "Content-Type": "application/json"
                }
            };
            client.post(config.environment.weburl + '/service_log/find', service_log_args, (dbService_Log_Fetch, response) => {
                if (!dbService_Log_Fetch || (dbService_Log_Fetch && dbService_Log_Fetch.Status && dbService_Log_Fetch.Status === "FAIL")) {
                    console.error('Exception', this.constructor.name, 'service_call', 'No Data Found');
                } else {
                    var dbService_Log = {};
                    if (dbService_Log_Fetch.hasOwnProperty('_doc')) {
                        dbService_Log['_doc'] = dbService_Log_Fetch['_doc'];
                    } else {
                        dbService_Log['_doc'] = dbService_Log_Fetch;
                    }
                    if (dbService_Log) {
                        var objService_Log = {};
                        for (var k in dbService_Log._doc) {
                            objService_Log[k] = dbService_Log._doc[k];
                            if (dbService_Log._doc[k] !== null && typeof dbService_Log._doc[k] !== 'object') {

                            }
                        }
                        master_db_list['service_logs'] = {
                            'pb_db_master': objService_Log,
                            'insurer_db_master': objService_Log
                        };
                        objInsurerProduct.master_motor_db_get_handler(master_db_list, insurer_id, objProduct, objInsurerProduct, Insurer_Object, specific_insurer_object);
                    }
                }
            });
        }
        //get service logs

        //get commoditiy data by insurer master 
        if (master_db_list.hasOwnProperty('commodity')) {
            var commodity = require('../models/commodity');
            commodity.findOne({ "Commodity_Id": parseInt(objProduct.lm_request.type_of_cargo) }, function (err, dbCommodity) {
                if (err) {
                    console.error('MongooseException', this.constructor.name, 'master_db_get', 'CommodityFind', err);
                } else {
                    //var commodityDoc = dbCommodity['_doc'];
                    var node = "Insurer_" + insurer_id;
                    if (dbCommodity !== null && dbCommodity['_doc'] && dbCommodity['_doc'][node]) {
                        var commodity_insurer = require('../models/commodity_insurer');
                        var commodityDoc = dbCommodity['_doc'];
                        commodity_insurer.findOne({ "Insurer_Commodity_Id": commodityDoc[node]["Insurer_Commodity_Id"], "Insurer_ID": insurer_id }, function (err, dbCommodityCd) {
                            if (err) {
                                console.error('MongooseException', this.constructor.name, 'master_db_get', 'CommodityFind', err);
                            } else {
                                if (dbCommodityCd !== null) {
                                    var insurer_commodity_master = {
                                        'pb_db_master': null,
                                        'insurer_db_master': dbCommodityCd['_doc']
                                    };
                                    master_db_list['commodity'] = insurer_commodity_master;
                                    objInsurerProduct.master_motor_db_get_handler(master_db_list, insurer_id, objProduct, objInsurerProduct, Insurer_Object, specific_insurer_object);
                                } else {
                                    Error_Code = 'LM010';
                                    var logGuid = objInsurerProduct.create_guid('ARN-');
                                    var docLog = {
                                        "Service_Log_Id": "",
                                        "Service_Log_Unique_Id": logGuid,
                                        "Request_Id": objProduct.docRequest.Request_Id,
                                        "User_Data_Id": objProduct.lm_request['udid'] - 0,
                                        "Request_Unique_Id": objProduct.docRequest.Request_Unique_Id,
                                        "PB_CRN": objProduct.docRequest.PB_CRN,
                                        "Client_Id": objProduct.docRequest.Client_Id,
                                        "LM_Custom_Request": null,
                                        "Status": "complete",
                                        "Error_Code": Error_Code,
                                        "Error_Details": insurer_commodity_master.pb_db_master,
                                        "Is_Active": 1,
                                        "Created_On": new Date(),
                                        "Product_Id": objProduct.db_specific_product.Product_Id,
                                        "Insurer_Id": Insurer_Object.Insurer_ID,
                                        "Method_Type": "Premium",
                                        "Call_Execution_Time": 0
                                    };
                                    objInsurerProduct.save_log(docLog);
                                }
                            }
                        });
                    } else {
                        Error_Code = 'LM010';
                        var logGuid = objInsurerProduct.create_guid('ARN-');
                        var docLog = {
                            "Service_Log_Id": "",
                            "Service_Log_Unique_Id": logGuid,
                            "Request_Id": objProduct.docRequest.Request_Id,
                            "User_Data_Id": objProduct.lm_request['udid'] - 0,
                            "Request_Unique_Id": objProduct.docRequest.Request_Unique_Id,
                            "PB_CRN": objProduct.docRequest.PB_CRN,
                            "Client_Id": objProduct.docRequest.Client_Id,
                            "LM_Custom_Request": null,
                            "Status": "complete",
                            "Error_Code": Error_Code,
                            "Error_Details": "Commodity not supported by Insurer",//insurer_commodity_master.pb_db_master,
                            "Is_Active": 1,
                            "Created_On": new Date(),
                            "Product_Id": objProduct.db_specific_product.Product_Id,
                            "Insurer_Id": Insurer_Object.Insurer_ID,
                            "Method_Type": "Premium",
                            "Call_Execution_Time": 0
                        };
                        objInsurerProduct.save_log(docLog);
                    }

                }
            });

        }
    } catch (e) {
        console.error('Error', 'master_db_get', this.constructor.name, e);
    }
};
Base.prototype.master_motor_db_get_handler = function (master_db_list, insurer_id, objProduct, objInsurerProduct, Insurer_Object, specific_insurer_object) {
    console.error('Niva Health Renew LINE5');
    var is_all_master_processed = false;
    var objBase = this;
    for (var k in master_db_list) {
        if (master_db_list[k]) {
            is_all_master_processed = true;
        } else {
            is_all_master_processed = false;
            break;
        }
    }
    if (objProduct['lm_request_core'].product_id === 2 && (objProduct.lm_request['method_type'] === 'Premium' || objProduct.lm_request['method_type'] === 'Get_Renewal') && objProduct['lm_request'] && objProduct['lm_request'].health_policy_type && objProduct['lm_request_core'].health_policy_type === 'renew') {
        is_all_master_processed = true;
    }
    if (is_all_master_processed === true) {
        objProduct.insurer_master_object['insurer_id_' + insurer_id]['master_db_list'] = master_db_list;
        objInsurerProduct.insurer_master = master_db_list;
        objInsurerProduct.insurer_product_api_pre(objProduct, Insurer_Object, specific_insurer_object);
        objInsurerProduct.field_prepare_all(objProduct, Insurer_Object, specific_insurer_object);
        if (objProduct.lm_request['method_type'] === 'Coverage' || objProduct.lm_request['method_type'] === 'Verification' || objProduct.lm_request['method_type'] === 'Pdf' || objProduct.lm_request['method_type'] === 'Status' || objProduct.lm_request['method_type'] === 'Renewal') {
            objInsurerProduct.process_execute_plan(objInsurerProduct, objProduct, Insurer_Object, specific_insurer_object);
        } else if (objProduct.lm_request['method_type'] === 'Proposal') {
            var is_method_customer_exist = false;
            for (var list in Insurer_Object.Method_List) {
                if (Insurer_Object.Method_List && Insurer_Object.Method_List[list] && Insurer_Object.Method_List[list].hasOwnProperty('Method_Type') && Insurer_Object.Method_List[list]['Method_Type'] === 'Customer') {
                    if (objProduct['lm_request_core'].product_id === 2 && objProduct['lm_request_core'].insurer_id === 20 && objProduct['lm_request'] && objProduct['lm_request'].health_policy_type
                        && objProduct['lm_request_core'].health_policy_type === 'renew') {
                        is_method_customer_exist = false;
                    } else {
                        is_method_customer_exist = true;
                    }
                }
            }

            if (is_method_customer_exist && typeof objInsurerProduct.customer_response_handler === "function") {
                var Client = require('node-rest-client').Client;
                var client = new Client();
                var coverage_request = {};
                for (var k in objInsurerProduct.lm_request) {
                    coverage_request[k] = objInsurerProduct.lm_request[k];
                }
                coverage_request.method_type = 'Customer';
                coverage_request.execution_async = 'no';
                coverage_request.search_reference_number = objInsurerProduct.lm_request['search_reference_number'];
                coverage_request.api_reference_number = objInsurerProduct.lm_request['api_reference_number'];
                coverage_request.insurer_id = Insurer_Object.Insurer_ID;
                //coverage_request.addon_package_name = 'Basic';
                var args = {
                    data: coverage_request,
                    headers: {
                        "Content-Type": "application/json",
                        'client_key': this.lm_request['client_key'],
                        'secret_key': this.lm_request['secret_key']
                    }
                };
                client.post(config.environment.weburl + '/quote/customer_initiate', args, function (data, response) {

                    /*if (data.Error_Code === '') {
                     objInsurerProduct.prepared_request['insurer_customer_identifier'] = data.Customer.insurer_customer_identifier;
                     objInsurerProduct.processed_request['___insurer_customer_identifier___'] = data.Customer.insurer_customer_identifier;
                     objInsurerProduct.process_execute_plan(objInsurerProduct, objProduct, Insurer_Object, specific_insurer_object);
                     } */
                    if (data.Error_Code === '') {
                        if (objInsurerProduct.prepared_request.hasOwnProperty('insurer_customer_identifier')) {

                        } else {
                            objInsurerProduct.prepared_request['insurer_customer_identifier'] = "";
                        }
                        objInsurerProduct.prepared_request['insurer_customer_identifier'] = data.Customer.insurer_customer_identifier;
                        objInsurerProduct.processed_request['___insurer_customer_identifier___'] = data.Customer.insurer_customer_identifier;
                        if (data.Customer.hasOwnProperty('insurer_customer_identifier_2')) {
                            objInsurerProduct.prepared_request['insurer_customer_identifier_2'] = data.Customer.insurer_customer_identifier_2;
                            objInsurerProduct.processed_request['___insurer_customer_identifier_2___'] = data.Customer.insurer_customer_identifier_2;
                        }
                        if (data.Customer.hasOwnProperty('insurer_customer_identifier_3')) {
                            objInsurerProduct.prepared_request['insurer_customer_identifier_3'] = data.Customer.insurer_customer_identifier_3;
                            objInsurerProduct.processed_request['___insurer_customer_identifier_3___'] = data.Customer.insurer_customer_identifier_3;
                        }
                        objInsurerProduct.prepared_request['final_premium_verified'] = data.Customer.final_premium_verified;
                        objInsurerProduct.processed_request['___final_premium_verified___'] = data.Customer.final_premium_verified;
                        objInsurerProduct.process_execute_plan(objInsurerProduct, objProduct, Insurer_Object, specific_insurer_object);
                    } else {
                        Error_Code = 'LM007';
                        var logGuid = objInsurerProduct.create_guid('ARN-');
                        var docLog = {
                            "Service_Log_Id": "",
                            "Service_Log_Unique_Id": logGuid,
                            "Request_Id": objProduct.docRequest.Request_Id,
                            "User_Data_Id": objProduct.lm_request['udid'] - 0,
                            "Request_Unique_Id": objProduct.docRequest.Request_Unique_Id,
                            "PB_CRN": objProduct.docRequest.PB_CRN,
                            "Client_Id": objProduct.docRequest.Client_Id,
                            "LM_Custom_Request": objInsurerProduct.prepared_request,
                            "Status": "complete",
                            "Error_Code": Error_Code,
                            "Is_Active": 1,
                            "Created_On": new Date(),
                            "Product_Id": objProduct.db_specific_product.Product_Id,
                            "Insurer_Id": Insurer_Object.Insurer_ID,
                            "Method_Type": "Proposal",
                            "Call_Execution_Time": 0
                        };
                        objInsurerProduct.save_log(docLog);
                        data.Proposal_Id = objProduct.lm_request['proposal_id'] - 0;
                        objBase.response_object.json(data);
                    }

                });
            } else {
                if (objProduct['lm_request_core'].product_id === 2 || objProduct['lm_request_core'].product_id === 13 || objProduct['lm_request_core'].product_id === 5 || objProduct['lm_request_core'].product_id === 15 || objProduct['lm_request_core'].product_id === 16 || objProduct['lm_request_core'].product_id === 18 || objProduct['lm_request_core'].product_id === 19 || objProduct['lm_request_core'].product_id === 4 || objProduct['lm_request_core'].product_id === 8 || objProduct['lm_request_core']['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
                    //objInsurerProduct.health_suminsured(objProduct, Insurer_Object, specific_insurer_object);                    
                    //                    var plan_id = master_db_list['service_logs']['pb_db_master']['Plan_Id'];
                    //                    var index = Insurer_Object.Plan_List.findIndex(x=>x.Plan_Id === plan_id);
                    //                    var Plan_List= [];
                    //                    Plan_List[0] = Insurer_Object.Plan_List[index === -1 ? 0 : index];
                    //                    Insurer_Object.Plan_List = Plan_List;
                    objInsurerProduct.process_execute_plan(objInsurerProduct, objProduct, Insurer_Object, specific_insurer_object);
                } else {
                    objInsurerProduct.motor_vehicle_idv(objProduct, Insurer_Object, specific_insurer_object);
                    //objInsurerProduct.process_execute_plan(objInsurerProduct, objProduct, Insurer_Object, specific_insurer_object);
                }
            }
        } else {
            if (objProduct['lm_request_core'].product_id === 2) {
                //renewal changes start
                if(objInsurerProduct.insurer_id && objInsurerProduct.insurer_id == 6 && objProduct['lm_request_core'].method_type == 'Premium'  &&  objProduct['lm_request_core'].health_policy_type && objProduct['lm_request_core'].health_policy_type == 'renew' && Insurer_Object && Insurer_Object.Insurer_ID && Insurer_Object.Insurer_ID == 6 && !objProduct['lm_request_core'].is_renewal_recalculate){
                    objInsurerProduct.health_renewal_details(objProduct, Insurer_Object, specific_insurer_object);
                }
                //renewal changes end
                else{
                objInsurerProduct.health_suminsured(objInsurerProduct, objProduct, Insurer_Object, specific_insurer_object);
            }
            }
            if (objProduct['lm_request_core'].product_id === 13 || objProduct['lm_request_core'].product_id === 5 || objProduct['lm_request_core'].product_id === 15 || objProduct['lm_request_core'].product_id === 4) {
                objInsurerProduct.process_execute_plan(objInsurerProduct, objProduct, Insurer_Object, specific_insurer_object);
            }
            if (objProduct['lm_request_core'].product_id === 16) {
                objInsurerProduct.CancerCare_suminsured(objInsurerProduct, objProduct, Insurer_Object, specific_insurer_object);
            }
            if (objProduct['lm_request_core'].product_id === 18) {
                objInsurerProduct.cyber_suminsured(objInsurerProduct, objProduct, Insurer_Object, specific_insurer_object);
            }
            if (objProduct['lm_request_core'].product_id === 19) {
                objInsurerProduct.workmen_suminsured(objInsurerProduct, objProduct, Insurer_Object, specific_insurer_object);
            }
            if (objProduct['lm_request_core'].product_id === 1 || objProduct['lm_request_core'].product_id === 10 || objProduct['lm_request_core'].product_id === 12) {

                if (objProduct['lm_request_core']['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
                    objInsurerProduct.process_execute_plan(objInsurerProduct, objProduct, Insurer_Object, specific_insurer_object);
                } else {
                    objInsurerProduct.motor_vehicle_idv(objProduct, Insurer_Object, specific_insurer_object);
                }
            }
            if (objProduct['lm_request_core'].product_id === 8) {
                objInsurerProduct.PersonalAccident_suminsured(objInsurerProduct, objProduct, Insurer_Object, specific_insurer_object);
            }
        }
    }
}
Base.prototype.process_execute_plan = function (objInsurerProduct, objProduct, Insurer_Object, specific_insurer_object) {
    var Client = require('node-rest-client').Client;
    var client = new Client();
    if (Insurer_Object.Insurer_ID === 20 && objProduct.lm_request['product_id'] === 2) {
        if (objProduct.lm_request['health_policy_type'] && objProduct.lm_request['health_policy_type'] === 'renew'
            && objProduct.lm_request['is_renewal_recalculate'] != 'yes') {
            console.error('Niva Health Renew LINE6');
            objInsurerProduct.plan_process_all(objProduct, Insurer_Object, specific_insurer_object);
            objInsurerProduct.plan_execute_all(objProduct, Insurer_Object, specific_insurer_object);
        } else {
            let nivaAddonArray = ['coPay_value','deductible_value','addon_HC', 'addon_SP', 'addon_PA', 'addon_SH', 'addon_ACBC', 'addon_ACBCNT', 'addon_SPP', 'addon_DMG', 'addon_DMP', 'addon_acbc_amount',"addon_DD","addon_Copay"];
            let existingAddons = [];
            let is_proposal_recalculate = objProduct.lm_request.hasOwnProperty('is_proposal_recalculate') ? objProduct.lm_request['is_proposal_recalculate'] : 'no';
            nivaAddonArray.filter(function (addon) {
                if (addon === 'addon_acbc_amount') {
                    let acbc_amount = {
                        addon_acbc_amount: objProduct.lm_request.hasOwnProperty('addon_acbc_amount') ? objProduct.lm_request['addon_acbc_amount'] : 0
                    };
                    existingAddons.push(acbc_amount);
                } else if (addon === 'deductible_value') {
                    let deductible_amount = {
                        discount_deductible_amount : objProduct.lm_request.hasOwnProperty('discount_deductible_value') ? objProduct.lm_request['discount_deductible_value'] : 0
                    };
                    existingAddons.push(deductible_amount);
                } else if (addon === 'coPay_value') {
                    let coPay_amount = {
                       discount_coPay_amount :objProduct.lm_request.hasOwnProperty('discount_coPay_value') ? objProduct.lm_request['discount_coPay_value'] : 0
                    };
                    existingAddons.push(coPay_amount);
                } else if (objProduct.lm_request.hasOwnProperty(addon)) {
                    existingAddons.push(addon);
                }
            });
            let city_name = objProduct.lm_request['city_name'] ? "^" + objProduct.lm_request['city_name'].toUpperCase() + "$" : "";
            let nivaPlansList = Insurer_Object.Plan_List;
            let nivaPrevPolicyAddons;
            if(objProduct.lm_request['health_policy_type'] === 'renew' && objProduct.lm_request['prev_policy_addons_list']){
                nivaPrevPolicyAddons = objProduct.lm_request['prev_policy_addons_list'];
            }
            let args = {
                data: {
                    "PLAN_LIMIT": objProduct.lm_request['health_insurance_si'] ? objProduct.lm_request['health_insurance_si'] - 0 : 100000,
                    "ADULT_COVERED": objProduct.lm_request['adult_count'],
                    "CHILD_COVERED": objProduct.lm_request['child_count'],
                    "CITY_NAME": city_name,
                    "NIVA_PLAN_LIST": nivaPlansList,
                    "Addons": existingAddons,
                    "is_proposal_recalculate": is_proposal_recalculate,
                    "ZONE": objProduct.lm_request['zone'],
                    "Renewal_Recalculate": objProduct.lm_request["is_renewal_recalculate"] ? objProduct.lm_request["is_renewal_recalculate"] : "no",
                    "Plan_Id":objProduct.lm_request["prev_plan_id"] ? objProduct.lm_request["prev_plan_id"] : "",
                    "Prev_Policy_Addon_List" : nivaPrevPolicyAddons,
                    "Health_Policy_Type": objProduct.lm_request['health_policy_type']? objProduct.lm_request['health_policy_type'] : '',
                },
                headers: {
                    "Content-Type": "application/json"
                }
            };
            client.post(config.environment.weburl + '/health_benefits/nivabupa_plan', args, function (planCodeRes, response) {
                if (planCodeRes) {
                    if (planCodeRes.hasOwnProperty('planCodeObj')) {
                        objProduct.lm_request.nivaPlancodes = planCodeRes.planCodeObj;
                    }
                    if (planCodeRes.hasOwnProperty('addonPlanArray')) {
                        objProduct.lm_request.addonPlanArray = planCodeRes.addonPlanArray;
                    }
                    if (planCodeRes.hasOwnProperty('nivaPlanDbObj')) {
                        objProduct.lm_request.nivaPlanDbObj = planCodeRes.nivaPlanDbObj;
                    }
                }
                objInsurerProduct.plan_process_all(objProduct, Insurer_Object, specific_insurer_object);
                objInsurerProduct.plan_execute_all(objProduct, Insurer_Object, specific_insurer_object);
            });
        }
    } else {
        objInsurerProduct.plan_process_all(objProduct, Insurer_Object, specific_insurer_object);
        objInsurerProduct.plan_execute_all(objProduct, Insurer_Object, specific_insurer_object);
    }
};
Base.prototype.method_field_get = function (objProduct, Insurer_Object, specific_insurer_object) {
    var objInsurerProduct = this;
    var product_id = objProduct.db_specific_product.Product_Id;
    var insurer_id = Insurer_Object.Insurer_ID;
    if (product_id === 10 || product_id === 12) {
        product_id = 1;
    }
    //find method field
    var Client = require('node-rest-client').Client;
    var objClient = new Client();
    objClient.get(config.environment.weburl + '/quote/fields/' + product_id + '/' + insurer_id, {}, function (data, response) {
        Object.assign(objProduct.insurer_master_object['insurer_id_' + insurer_id], { "method_field_list": "" });
        objProduct.insurer_master_object['insurer_id_' + insurer_id]['method_field_list'] = data;
        objInsurerProduct.master_db_get(objProduct, Insurer_Object, specific_insurer_object);

    });
    /*var dbCollMaster = myDb.collection('fields');
     var search_condition = JSON.parse('{"Product_Id":"' + product_id + '","Insurer_ID":"' + insurer_id + '"}');
     dbCollMaster.find(search_condition).toArray(function (err, fieldMasterItem) {
     if (err) {
     return console.dir(err);
     }
     Object.assign(objProduct.insurer_master_object['insurer_id_' + insurer_id], {"method_field_list": ""});
     objProduct.insurer_master_object['insurer_id_' + insurer_id]['method_field_list'] = fieldMasterItem;
     objInsurerProduct.master_db_get(objProduct, Insurer_Object, specific_insurer_object);
     });*/
    //find method field finish


}
Base.prototype.complete_request = function () {
    //console.log('Start', this.constructor.name, 'complete_request');
    //save to request start 
    var objBase = this;
    var StartDate = moment(this.docRequest.Created_On);
    var EndDate = moment(new Date());
    var Call_Execution_Time = EndDate.diff(StartDate);
    Call_Execution_Time = Math.round((Call_Execution_Time * 0.001) * 100) / 100;
    var docRequest = this.docRequest;
    var docRequestModify = {
        "Status": "complete",
        "Total": this.docRequest.Total,
        "Pending": this.docRequest.Pending,
        "Complete": this.docRequest.Complete,
        "Success": this.docRequest.Success,
        "Fail": this.docRequest.Fail,
        "Total_Execution_Time": Call_Execution_Time
    };
    var search_criteria = {
        "Request_Unique_Id": this.docRequest.Request_Unique_Id
    };
    var Request = require('../models/request');
    if (this.docRequest.Total > 0 && this.docRequest.Total == this.docRequest.Complete) {
        docRequestModify['Status'] = "complete";
        //this.save_to_db('requests', {$set: docRequestModify}, search_criteria);        
        Request.update(search_criteria, { $set: docRequestModify }, { upsert: true }, function (err, dbRequest) {
            //console.log('UpdateRequestComplete', err, dbRequest);
        });
        //console.log('Finish', this.constructor.name, 'complete_request');
        if (this.lm_request['execution_async'] == 'no') {
            eval(this.request_process_handler);
        }
        //objBase.response_object.json(arr_premium_response);
    } else {
        docRequestModify['Status'] = "pending";
        //this.save_to_db('requests', {$set: docRequestModify}, search_criteria);        
        Request.update(search_criteria, { $set: docRequestModify }, { upsert: true }, function (err, dbRequest) {
            //console.log('UpdateRequestComplete', err, dbRequest);
        });
    }
};
Base.prototype.premium_initiate_handler = function (customer_reference_number, crn, product_id) {
    try {
        //console.log(this.constructor.name, 'premium_initiate_handler', 'Start');
        var objBase = this;
        var srn = this.request_unique_id;
        let quote_product_action = {
            1: 'car-insurance',
            2: 'health-insurance',
            10: 'two-wheeler-insurance',
            12: 'commercial-vehicle-insurance',
            4: 'travel-insurance',
            8: 'personal-accident-insurance',
            18: 'cyber-insurance',
            13: 'marine-insurance'
        }
        var arr_premium_response = {
            'Summary': {
                'Request_Unique_Id': srn + '_' + objBase.udid,
                'customer_reference_number': customer_reference_number + '_' + crn,
                'Crn_Unique_Id': customer_reference_number,
                'crn': crn,
                'quote_url': '/' + quote_product_action[product_id] + '-UI22/quotes?SID=' + customer_reference_number + '_' + crn + '&ClientID=2'
            },
            'Request': objBase.lm_request,
            'Addon_Request': null,
            'Master': {
                'Vehicle': null,
                'Rto': null
            }
        };
        objBase.response_object.json(arr_premium_response);
    } catch (e) {
        console.error('Exception', 'premium_initiate_handler', e);
    }
}

Base.prototype.health_renewal_initiate_handler = function (objResponse) {
    try {
        //console.log(this.constructor.name, 'renewal_initiate_handler', 'Start');

        var srn = this.request_unique_id;
        var arr_premium_response = {
            'Response': objResponse
        };
        this.response_object.json(arr_premium_response);

    } catch (e) {
        console.error('Exception', 'renewal_initiate_handler', e);
    }
};
Base.prototype.personal_accident_renewal_initiate_handler = function (objResponse) {
    try {
        //console.log(this.constructor.name, 'renewal_initiate_handler', 'Start');

        var srn = this.request_unique_id;
        var arr_premium_response = {
            'Response': objResponse
        };
        this.response_object.json(arr_premium_response);

    } catch (e) {
        console.error('Exception', 'renewal_initiate_handler', e);
    }
};
Base.prototype.proposal_status_initiate_handler = function (objResponse) {
    try {
        //console.log(this.constructor.name, 'renewal_initiate_handler', 'Start');

        var Tranaction_status;
        if (objResponse.Error_Msg === 'NO_ERR' && objResponse.Pg_Status === "SUCCESS") {
            Tranaction_status = 'TRANS_SUCCESS_WITH_POLICY';
        } else {
            Tranaction_status = 'TRANS_FAIL';
        }
        var arr_premium_response = {
            'Summary': {
                PB_CRN: this.lm_request['crn'],
                'Request_Unique_Id': this.lm_request['search_reference_number'] + '_' + this.lm_request['udid'],
            },
            'Tranaction_status': Tranaction_status,
            'Response': objResponse
        };
        this.response_object.json(arr_premium_response);

    } catch (e) {
        console.error('Exception', 'renewal_initiate_handler', e);
    }
};


Base.prototype.premium_summary = function () {

    var objBase = this;
    var srn = objBase.request_unique_id;
    var arr_premium_response = {
        'Status': 'Not_Cached',
        'Summary': {
            'Request_Unique_Id': srn,
            'customer_reference_number': 'NA',
            'User_Data_Id': objBase.udid
        },
        'Request': {},
        'Addon_Request': {},
        'Master': {}
    };
    try {
        //console.log(this.constructor.name, 'premium_summary_async', 'Start');
        //console.log('Request_Unique_Id', this.request_unique_id, 'Client_Id', this.client_id);
        //var cache_key = 'premium_summary_' + this.request_unique_id;

        User_Data.findOne({ 'User_Data_Id': objBase.udid }, function (err, objDbUserData) {
            if (err) {

            } else {
                if (objDbUserData) {
                    objDbUserData = objDbUserData._doc;
                    if (false && objDbUserData.hasOwnProperty('Premium_Summary')) {
                        objDbUserData.Premium_Summary.Status = 'Cached';
                        objBase.response_object.json(objDbUserData.Premium_Summary);
                    } else {
                        if (objDbUserData.hasOwnProperty('Addon_Request') && objDbUserData.Addon_Request) {
                            arr_premium_response.Addon_Request = objDbUserData.Addon_Request;
                        } else {
                            arr_premium_response.Addon_Request = {};
                        }
                        arr_premium_response.Summary.customer_reference_number = objDbUserData.Crn_Unique_Id || 'NA';
                        arr_premium_response.Summary.User_Data_Id = objDbUserData.User_Data_Id;
                        arr_premium_response.Summary.Request_Unique_Id = objDbUserData.Request_Unique_Id + '_' + objDbUserData.User_Data_Id;
                        arr_premium_response.Summary.Created_On = objDbUserData.Created_On;
                        arr_premium_response.Summary.PB_CRN = objDbUserData.PB_CRN;
                        arr_premium_response.Summary.Client_Id = objDbUserData.Client_Id;
                        arr_premium_response.Request = objDbUserData.Premium_Request;
                        if ([1, 10, 12].indexOf(objDbUserData.Product_Id) > -1) {
                            arr_premium_response.Master = {
                                'Vehicle': objDbUserData.Master_Details.vehicle,
                                'Rto': objDbUserData.Master_Details.rto
                            };
                        }
                        //find method field
                        var dbCollRequest = myDb.collection('requests');
                        dbCollRequest.findOne({ 'Request_Unique_Id': objDbUserData.Request_Unique_Id }, function (err, dbRequestItem) {
                            if (err) {
                                return console.dir(err);
                            }
                            if (dbRequestItem) {
                                arr_premium_response.Summary.Request_Id = dbRequestItem.Request_Id;
                                arr_premium_response.Request = dbRequestItem.Request_Core;
                                var arr_request_key = ['Status', 'Total', 'Pending', 'Complete', 'Success', 'Fail', 'Total_Execution_Time'];
                                for (let i in arr_request_key) {
                                    arr_premium_response.Summary[arr_request_key[i]] = dbRequestItem[arr_request_key[i]];
                                }
                            }
                            /*var ObjUser_Data = {
                             Premium_Summary: arr_premium_response
                             };
                             if (ObjUser_Data) {
                             
                             User_Data.update({'User_Data_Id': objDbUserData.User_Data_Id}, {$set: ObjUser_Data}, function (err, numAffected) {
                             //console.error('UserDataCRNUpdate', erp_ops_type, err, numAffected);
                             });
                             }*/
                            objBase.response_object.json(arr_premium_response);
                        });

                    }
                }
            }
        });
    } catch (e) {
        arr_premium_response.Status = e.stack;
        console.error('Exception', 'premium_summary', e);
        objBase.response_object.json(arr_premium_response);
    }
}
Base.prototype.premium_summary_handler_niu = function (arr_premium_response) {
    //console.log('Start', 'premium_summary_handler');
    var all_complete = false;
    if ([2, 3, 4, 13, 15, 5].indexOf(arr_premium_response.Request.product_id - 0) > -1) {
        all_complete = true;
    } else {
        if (arr_premium_response.Request && arr_premium_response.Summary && arr_premium_response.Master.Vehicle && arr_premium_response.Master.Rto && arr_premium_response.Addon_Request !== null) {
            all_complete = true;
        }
    }
    if (all_complete) {
        arr_premium_response.Summary.Request_Unique_Id = arr_premium_response.Summary.Request_Unique_Id + '_' + arr_premium_response.Summary.User_Data_Id;

        User_Data.findOne({ "User_Data_Id": arr_premium_response.Summary.User_Data_Id - 0 }, function (err, dbUserData) {
            if (err) {

            } else {
                if (dbUserData) {
                    var ObjUser_Data = {
                        Premium_Summary: arr_premium_response
                    };
                    if (ObjUser_Data) {

                        User_Data.update({ 'User_Data_Id': dbUserData._doc['User_Data_Id'] }, { $set: ObjUser_Data }, function (err, numAffected) {
                            //console.error('UserDataCRNUpdate', erp_ops_type, err, numAffected);
                        });
                    }
                }
            }
        });
        var cache_key = 'premium_summary_' + this.request_unique_id;
        fs.writeFile(appRoot + "/tmp/cache/" + cache_key + ".log", JSON.stringify(arr_premium_response), function (err) {
            if (err) {
                return console.error(err);
            }
        });
        this.response_object.json(arr_premium_response);
    }
};
Base.prototype.proposal_details = function (proposal_id = 0) {
    var Client = require('node-rest-client').Client;
    var client = new Client();
    //console.log(this.constructor.name, 'proposal_details', 'Start');
    var objBase = this;
    // var Service_Log = require('../models/service_log');
    var sl_cond = { "Service_Log_Unique_Id": objBase.service_log_unique_id };
    if (objBase.slid > 0) {
        sl_cond = { "Service_Log_Id": objBase.slid - 0 };
    }
    var service_log_args = {
        data: {
            query: sl_cond,
            query_options: {
                select: {
                    Insurer_Request: 0,
                    Insurer_Response: 0,
                    Insurer_Response_Core: 0,
                    Premium_Breakup: 0,
                    _id: 0
                }
            }
        },
        headers: {
            "Content-Type": "application/json"
        }
    };
    client.post(config.environment.weburl + '/service_log/find', service_log_args, (dbService_Log, response) => {
        if (!dbService_Log || (dbService_Log[0] && dbService_Log.Status && dbService_Log.Status === "FAIL")) {
            return objBase.response_object.json({ 'Errod_Code': 'NoData' });
        } else {
            if (dbService_Log) {
                //delete dbService_Log._doc.LM_Custom_Request;
                delete dbService_Log.Insurer_Request;
                delete dbService_Log.Insurer_Response;
                delete dbService_Log.Insurer_Response_Core;
                delete dbService_Log.Premium_Breakup;
                delete dbService_Log._id;
                if (dbService_Log.Status === 'complete') {
                    //save proposal history start
                    if (objBase.udid - 0 > 0) {
                        var ObjUser_Data = {
                            Proposal_Response: dbService_Log
                        };
                        User_Data.update({ 'User_Data_Id': objBase.udid - 0 }, { $set: ObjUser_Data }, function (err, numAffected) {
                            //console.error('UserDataCRNUpdate', erp_ops_type, err, numAffected);
                        });
                    }
                    if (proposal_id > 0) {
                        let objProposal = {
                            'Proposal_Response': dbService_Log,
                            'Modified_On': new Date()
                        };
                        var Proposal = require('../models/proposal');
                        Proposal.update({ 'Proposal_Id': proposal_id }, { $set: objProposal }, function (err, numAffected) {
                            if (err) {
                                console.error('Exception', 'ProposalResponseUpdate', err);
                                return objBase.response_object.send(err);
                            } else {
                                return objBase.response_object.json(dbService_Log);
                            }
                        });
                    }
                } else {
                    return objBase.response_object.json(dbService_Log);
                }
            } else {
                return objBase.response_object.json({ 'Errod_Code': 'NoData' });
            }
        }
    });

    // Service_Log.findOne(sl_cond).select('-Insurer_Request -Insurer_Response -Insurer_Response_Core -Premium_Breakup -_id').select().exec(function (err, dbService_Log) {
    //     if (err) {
    //         return objBase.response_object.send(err);
    //     } else {
    //         if (dbService_Log) {
    //             //delete dbService_Log._doc.LM_Custom_Request;
    //             delete dbService_Log._doc.Insurer_Request;
    //             delete dbService_Log._doc.Insurer_Response;
    //             delete dbService_Log._doc.Insurer_Response_Core;
    //             delete dbService_Log._doc.Premium_Breakup;
    //             delete dbService_Log._doc._id;
    //             if (dbService_Log.Status === 'complete') {
    //                 //save proposal history start
    //                 if (objBase.udid - 0 > 0) {
    //                     var ObjUser_Data = {
    //                         Proposal_Response: dbService_Log
    //                     };
    //                     User_Data.update({ 'User_Data_Id': objBase.udid - 0 }, { $set: ObjUser_Data }, function (err, numAffected) {
    //                         //console.error('UserDataCRNUpdate', erp_ops_type, err, numAffected);
    //                     });
    //                 }
    //                 if (proposal_id > 0) {
    //                     let objProposal = {
    //                         'Proposal_Response': dbService_Log,
    //                         'Modified_On': new Date()
    //                     };
    //                     var Proposal = require('../models/proposal');
    //                     Proposal.update({ 'Proposal_Id': proposal_id }, { $set: objProposal }, function (err, numAffected) {
    //                         if (err) {
    //                             console.error('Exception', 'ProposalResponseUpdate', err);
    //                             return objBase.response_object.send(err);
    //                         } else {
    //                             return objBase.response_object.json(dbService_Log);
    //                         }
    //                     });
    //                 }
    //             } else {
    //                 return objBase.response_object.json(dbService_Log);
    //             }
    //         } else {
    //             return objBase.response_object.json({ 'Errod_Code': 'NoData' });
    //         }
    //     }
    // });
}
Base.prototype.proposal_details_0306 = function (service_log_unique_id) {
    //console.log(this.constructor.name, 'proposal_details', 'Start');
    var objBase = this;
    var Service_Log = require('../models/service_log');
    var sl_cond = { "Service_Log_Unique_Id": objBase.service_log_unique_id };
    if (objBase.slid > 0) {
        sl_cond = { "Service_Log_Id": objBase.slid - 0 };
    }
    Service_Log.findOne(sl_cond, function (err, dbService_Log) {
        if (err) {

        } else {
            if (dbService_Log) {
                delete dbService_Log._doc.LM_Custom_Request;
                delete dbService_Log._doc.Insurer_Request;
                delete dbService_Log._doc.Insurer_Response;
                delete dbService_Log._doc.Insurer_Response_Core;
                delete dbService_Log._doc.Premium_Breakup;
                delete dbService_Log._doc._id;
                if (dbService_Log.Status === 'complete' || true) {
                    //save proposal history start
                    try {
                        if (dbService_Log['Service_Log_Id'] > 0) {
                            let objProposal = {
                                'Proposal_Response': dbService_Log,
                                'Modified_On': new Date()
                            };
                            var Proposal = require('../models/proposal');
                            Proposal.update({ 'Service_Log_Id': dbService_Log['Service_Log_Id'] }, { $set: objProposal }, function (err, numAffected) {
                                if (err) {
                                    console.error('Exception', 'ProposalHistoryUpdate', e);
                                }
                            });
                        }
                    } catch (e) {
                        console.error('Exception', 'ProposalHistoryUpdate', e);
                    }
                    ///save proposal history finish

                    User_Data.findOne({ "User_Data_Id": objBase.udid - 0 }, function (err, dbUserData) {
                        if (err) {

                        } else {
                            if (dbUserData) {
                                dbUserData = dbUserData._doc;
                                var ObjUser_Data = {
                                    Proposal_Response: dbService_Log
                                };

                                User_Data.update({ 'User_Data_Id': dbUserData['User_Data_Id'] }, { $set: ObjUser_Data }, function (err, numAffected) {
                                    //console.error('UserDataCRNUpdate', erp_ops_type, err, numAffected);
                                });
                            }
                        }
                    });
                }
                objBase.response_object.json(dbService_Log);
            }
        }
    });
}
Base.prototype.api_log_summary = function () {
    //console.log(this.constructor.name, 'api_log_summary', 'Start');
    //console.log('service_log_unique_id', this.service_log_unique_id, 'Client_Id', this.client_id);
    var Client = require('node-rest-client').Client;
    var client = new Client();
    var objBase = this;
    var api_log_response = {
        'Summary': null,
        'PB_Master': {
            'Vehicle': null,
            'Rto': null,
            'Insurer': null,
            'Vehicle_Details': null
        },
        'Insurer_Master': {
            'Vehicle': null,
            'Rto': null,
            'Insurer': null
        },
        'Quote_Request': null,
        'Addon_Request': null,
        'Proposal_Request': null,
        'Premium_Response': null,
        'Posp': null,
        'Last_Premium_Request': null,
        'Last_Premium_Response': null,
        'Last_Proposal_Request': null,
        'Last_Proposal_Response': null
    };
    var Product_Id = 0;
    var Service_Log = require('../models/service_log');
    let planid;
    var sl_cond = { "Service_Log_Unique_Id": objBase.service_log_unique_id }
    if (objBase.slid > 0) {
        sl_cond = { "Service_Log_Id": objBase.slid - 0 };
    }
    var service_log_args = {
        data: { query: sl_cond },
        headers: {
            "Content-Type": "application/json"
        }
    };
    client.post(config.environment.weburl + '/service_log/find', service_log_args, (dbService_Log_Fetch, response) => {
        console.error("Shriram Addon LINE 1", dbService_Log_Fetch);
        if ([18, 13].indexOf(dbService_Log_Fetch.Insurer_Id) > -1 && dbService_Log_Fetch.Product_Id === 12) {
            User_Data.findOne({ User_Data_Id: objBase.udid - 0 }).sort({ Created_on: -1 }).exec(function (err, objDbUserData) {
                console.log(objDbUserData);
                if ((dbService_Log_Fetch.Insurer_Id === 18 && dbService_Log_Fetch.LM_Custom_Request.Plan_Name === "Basic" || dbService_Log_Fetch.LM_Custom_Request.Plan_Name === "TP") || (dbService_Log_Fetch.Insurer_Id === 13 && dbService_Log_Fetch.Plan_Name === "Basic" || dbService_Log_Fetch.Plan_Name === "TP")
                ) {
                    planid = (dbService_Log_Fetch.LM_Custom_Request.Plan_Name === "Basic" || dbService_Log_Fetch.Plan_Name === "Basic") ? 207 : 206;
                } else {
                let addon_selected = objDbUserData._doc.Addon_Request.addon_standalone;
                    let mp = (addon_selected.hasOwnProperty('addon_motor_protector_cover') && addon_selected.addon_motor_protector_cover === "yes") ? true : false;
                    let zd = (addon_selected.hasOwnProperty('addon_zero_dep_cover') && addon_selected.addon_zero_dep_cover === "yes") ? true : false;
                    let rsa = (addon_selected.hasOwnProperty('addon_road_assist_cover') && addon_selected.addon_road_assist_cover === "yes") ? true : false;
                    if (zd && mp && rsa) {
                        planid = 214;
                    } else if (zd && rsa && mp === false) {
                        planid = 213;
                    } else if (mp && rsa && zd == false) {
                        planid = 212;
                    } else if (zd && mp && rsa === false) {
                        planid = 211;
                    } else if (zd && rsa === false && mp === false) {
                    planid = 210;
                    } else if (rsa && mp === false && zd === false) {
                    planid = 209;
                    } else if (mp && rsa === false && zd === false) {
                    planid = 208;
                }else{}
                }
                console.error("Shriram Addon LINE 2", dbService_Log_Fetch);
                var sl_cond1 = { "Request_Unique_Id": dbService_Log_Fetch.Request_Unique_Id, "Plan_Id": planid };
                var service_log_args1 = {
                    data: { query: sl_cond1 },
                    headers: {
                        "Content-Type": "application/json"
                    }
                };
                client.post(config.environment.weburl + '/service_log/find', service_log_args1, (dbService_Log_Fetch_addon, response) => {
                    console.error("Shriram Addon LINE 3", dbService_Log_Fetch_addon);
                    dbService_Log_Fetch = dbService_Log_Fetch_addon;
                    api_log_summary_builder(api_log_response, dbService_Log_Fetch, objBase, client);
                });
            });


        } else {
            console.error("Shriram Addon LINE 4", dbService_Log_Fetch);
            api_log_summary_builder(api_log_response, dbService_Log_Fetch, objBase, client);
        }
    });

    // Service_Log.findOne(sl_cond, function (err, dbService_Log) {
    //     if (err) {

    //     } else {
    //         if (dbService_Log) {
    //             var ud_cond = { 'Request_Unique_Id': dbService_Log._doc['Request_Unique_Id'] };
    //             if (objBase.udid > 0) {
    //                 ud_cond = { "User_Data_Id": objBase.udid - 0 };
    //             }
    //             Product_Id = dbService_Log._doc['Product_Id'];
    //             if (Product_Id !== 12 && (dbService_Log._doc['Insurer_Id'] === 10 && (dbService_Log._doc['Method_Type'] === "Idv" || dbService_Log._doc['Method_Type'] === "Premium"))) {
    //                 dbService_Log._doc.LM_Custom_Request['vehicle_expected_idv'] = royal_sundaram_idv_changes(dbService_Log._doc.LM_Custom_Request);
    //             }
    //             api_log_response.Last_Premium_Request = dbService_Log._doc.LM_Custom_Request;
    //             api_log_response.Last_Premium_Response = dbService_Log._doc.Premium_Breakup;
    //             api_log_response.Summary = {
    //                 "Service_Log_Id": dbService_Log._doc['Service_Log_Id'],
    //                 "Service_Log_Unique_Id_Core": dbService_Log._doc['Service_Log_Unique_Id'],
    //                 "Service_Log_Unique_Id": dbService_Log._doc['Service_Log_Unique_Id'] + '_' + dbService_Log._doc['Service_Log_Id'] + '_' + objBase.udid,
    //                 "Request_Unique_Id": dbService_Log._doc['Request_Unique_Id'] + '_' + objBase.udid,
    //                 "Request_Unique_Id_Core": dbService_Log._doc['Request_Unique_Id'],
    //                 "Insurer_Transaction_Identifier": dbService_Log._doc['Insurer_Transaction_Identifier'],
    //                 "Created_On": dbService_Log._doc['Created_On'],
    //                 "Product_Id": dbService_Log._doc['Product_Id'],
    //                 "Insurer_Id": dbService_Log._doc['Insurer_Id'],
    //                 "Plan_Id": dbService_Log._doc['Plan_Id'],
    //                 "Addon_Mode": dbService_Log._doc['Addon_Mode'] || '',
    //                 "Plan_Name": dbService_Log._doc['Plan_Name']
    //             };
    //             var dbCollLog = myDb.collection('service_logs');
    //             var sl_all_cond = {
    //                 'Request_Id': dbService_Log._doc['Request_Id'],
    //                 'Method_Type': 'Premium',
    //                 'Insurer_Id': dbService_Log._doc['Insurer_Id']
    //             };
    //             if (dbService_Log._doc['Method_Type'] == 'Proposal') {
    //                 sl_all_cond = {
    //                     'Request_Unique_Id': dbService_Log._doc['Request_Unique_Id'],
    //                     'Method_Type': 'Premium',
    //                     'Insurer_Id': dbService_Log._doc['Insurer_Id']
    //                 };
    //             }
    //             dbCollLog.find(sl_all_cond).sort({ 'Plan_Id': 1 }).toArray(function (err, dbLogItems) {
    //                 if (err) {

    //                 } else if (!dbLogItems) {
    //                     console.error('Exception', 'api_log_summary', 'SL log not found', sl_all_cond);
    //                     objBase.response_object.json({ 'Msg': 'No such record' });
    //                 } else {
    //                     var Premium_Response = null;
    //                     if (Product_Id === 2 || Product_Id === 13 || Product_Id === 5 || Product_Id === 15 || Product_Id === 16 || Product_Id === 18 || Product_Id === 4 || Product_Id === 19 || Product_Id === 8) {
    //                         var All_Response = {};
    //                         for (var k in dbLogItems) {
    //                             if (dbLogItems[k]['Error_Code'] === "" && dbLogItems[k]['Status'] == 'complete' && dbLogItems[k]['Premium_Breakup']) {
    //                                 if (typeof All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']] == 'undefined') {
    //                                     //                                        var Filtered_Request = objBase.insurer_request_filter(dbLogItems[k]['LM_Custom_Request']);
    //                                     All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']] = {
    //                                         "Service_Log_Id": dbLogItems[k]['Service_Log_Id'],
    //                                         "Service_Log_Unique_Id": dbLogItems[k]['Service_Log_Unique_Id'],
    //                                         "Insurer_Id": dbLogItems[k]['Insurer_Id'],
    //                                         "Insurer": null,
    //                                         "Premium_Breakup": dbLogItems[k]['Premium_Breakup'],
    //                                         "Insurer_Response": [],
    //                                         "Addon_List": {}
    //                                         //                                            "Plan_List": [],
    //                                         //                                            "LM_Custom_Request": Filtered_Request
    //                                     };
    //                                     if (Product_Id === 2 || Product_Id === 8) {
    //                                         All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']]['Insurer_Response'] = dbLogItems[k]['Premium_Response'];
    //                                     } else if (Product_Id === 18) {
    //                                         All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']]['Addon_List'] = dbLogItems[k]['Premium_Breakup']['addon'];
    //                                     }
    //                                 }

    //                                 dbLogItems[k]['Premium_Breakup']['final_premium'] = Number(dbLogItems[k]['Premium_Breakup']['net_premium']) + Number(dbLogItems[k]['Premium_Breakup']['service_tax']);
    //                             }
    //                         }
    //                         Premium_Response = All_Response['Insurer_' + api_log_response.Summary.Insurer_Id];

    //                         var Request = require('../models/request');
    //                         User_Data.findOne(ud_cond, function (err, objDbUserData) {
    //                             if (objDbUserData) {
    //                                 if (objDbUserData.Premium_Request) {
    //                                     api_log_response.Summary.User_Data_Id = objDbUserData.User_Data_Id;
    //                                     api_log_response.Summary.Last_Status = objDbUserData.Last_Status;
    //                                     api_log_response.Quote_Request = objDbUserData.Premium_Request;
    //                                     api_log_response.Quote_Request.crn = objDbUserData.PB_CRN;
    //                                     // to get insurer details
    //                                     var Insurer = require('../models/insurer');
    //                                     Insurer.findOne({ "Insurer_ID": dbService_Log._doc.Insurer_Id }, function (err, dbInsurer) {
    //                                         if (err) {

    //                                         } else {
    //                                             api_log_response.PB_Master.Insurer = dbInsurer._doc;
    //                                             objBase.api_log_summary_handler(api_log_response);
    //                                         }
    //                                     });
    //                                 }
    //                                 if (objDbUserData.Proposal_Request) {
    //                                     var ind_proposal_request = {};
    //                                     if (objDbUserData.Proposal_History && objDbUserData.Proposal_History.length > 0) {
    //                                         for (var k2 in objDbUserData.Proposal_History) {
    //                                             var ind_req = objDbUserData.Proposal_History[k2];
    //                                             if (ind_req['Insurer_Id'] === dbService_Log._doc['Insurer_Id']) {
    //                                                 ind_proposal_request = ind_req['Form_Data'];
    //                                                 break;
    //                                             }
    //                                         }
    //                                     }
    //                                     for (var k1 in objDbUserData.Proposal_Request) {
    //                                         ind_proposal_request[k1] = objDbUserData.Proposal_Request[k1];
    //                                     }
    //                                     api_log_response.Proposal_Request = ind_proposal_request;
    //                                 }
    //                                 if (Product_Id === 18) {
    //                                     if (objDbUserData.Addon_Request) {
    //                                         api_log_response.Addon_Request = objDbUserData.Addon_Request;
    //                                     }
    //                                 }
    //                                 else if (Product_Id === 2 && [20, 38].indexOf(api_log_response.Summary.Insurer_Id) > -1) {
    //                                     if (objDbUserData.Addon_Request) {
    //                                         api_log_response.Addon_Request = objDbUserData.Addon_Request;
    //                                         Premium_Response['Premium_Breakup']['addon'] = {};
    //                                         var addon_final_premium = 0;
    //                                         var addon_premium_breakup = {};
    //                                         let insId = api_log_response.Summary.Insurer_Id;
    //                                         let planId = api_log_response.Summary.Plan_Id;
    //                                         if (api_log_response.Summary.Addon_Mode === "ALACARTE") {
    //                                             for (var k in api_log_response.Addon_Request) {
    //                                                 if (api_log_response.Addon_Request.hasOwnProperty(insId) && api_log_response.Addon_Request[insId]) {
    //                                                     if (api_log_response.Addon_Request[insId].hasOwnProperty(planId) && api_log_response.Addon_Request[insId][planId]) {
    //                                                         if (api_log_response.Addon_Request[insId][planId].hasOwnProperty('addons') && api_log_response.Addon_Request[insId][planId]['addons']) {
    //                                                             let addonsList = api_log_response.Addon_Request[insId][planId]['addons'];
    //                                                             for (var i in addonsList) {
    //                                                                 Premium_Response['Addon_List'][i] = addonsList[i]['value'];

    //                                                                 addon_final_premium += Premium_Response['Addon_List'][i] - 0;
    //                                                             }
    //                                                             addon_premium_breakup[k] = addonsList;
    //                                                             Premium_Response['Premium_Breakup']['addon'] = addon_premium_breakup;
    //                                                             Premium_Response['Premium_Breakup']['addon']['addon_final_premium'] = addon_final_premium;
    //                                                             Premium_Response['Premium_Breakup']['net_premium'] = Premium_Response['Premium_Breakup']['base_premium'] - 0 + addon_final_premium;
    //                                                             Premium_Response['Premium_Breakup']['service_tax'] = (Premium_Response['Premium_Breakup']['net_premium'] * 0.18);
    //                                                             Premium_Response['Premium_Breakup']['final_premium'] = Premium_Response['Premium_Breakup']['net_premium'] + Premium_Response['Premium_Breakup']['service_tax'];
    //                                                         }
    //                                                     }
    //                                                 }
    //                                             }
    //                                         }

    //                                     }
    //                                 }
    //                                 api_log_response.Premium_Response = Premium_Response;
    //                                 objBase.api_log_summary_handler(api_log_response);
    //                             }
    //                         });
    //                     } else {
    //                         var All_Response = {};
    //                         let obj_plan_basic = {};
    //                         for (let k in dbLogItems) {
    //                             let Insurer_Id = dbLogItems[k]['Insurer_Id'] - 0;
    //                             let Plan_Name = dbLogItems[k]['Plan_Name'];
    //                             if (dbLogItems[k]['Error_Code'] === "" && dbLogItems[k]['Status'] == 'complete' && dbLogItems[k]['Premium_Breakup']) {
    //                                 if (typeof All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']] == 'undefined') {
    //                                     var Filtered_Request = objBase.insurer_request_filter(dbLogItems[k]['LM_Custom_Request']);
    //                                     All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']] = {
    //                                         "Service_Log_Id": dbLogItems[k]['Service_Log_Id'],
    //                                         "Service_Log_Unique_Id": dbLogItems[k]['Service_Log_Unique_Id'],
    //                                         "Insurer_Id": dbLogItems[k]['Insurer_Id'],
    //                                         "Insurer": null,
    //                                         "Premium_Breakup": dbLogItems[k]['Premium_Breakup'],
    //                                         "Addon_List": {},
    //                                         "Plan_List": [],
    //                                         "LM_Custom_Request": Filtered_Request
    //                                     };
    //                                     obj_plan_basic['Insurer_' + Insurer_Id] = {};
    //                                 }
    //                                 obj_plan_basic['Insurer_' + Insurer_Id][Plan_Name] = dbLogItems[k]['Premium_Breakup']['own_damage'];

    //                                 var plan_len = All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']]['Plan_List'].length;
    //                                 var Addon = dbLogItems[k]['Premium_Breakup']['addon'];
    //                                 try {
    //                                     if ([6, 44].indexOf(Insurer_Id) > -1) { //digit , icici
    //                                         if (Addon.hasOwnProperty('addon_zero_dep_cover') && Addon['addon_zero_dep_cover'] > 0) {
    //                                             let zd_amt = Addon['addon_zero_dep_cover'];
    //                                             let basic_plan_name = 'Basic';
    //                                             if (Insurer_Id === 44 && obj_plan_basic['Insurer_' + Insurer_Id].hasOwnProperty('OD') === true) {
    //                                                 basic_plan_name = 'OD';
    //                                             }
    //                                             let od_final_diff = obj_plan_basic['Insurer_' + Insurer_Id][Plan_Name]['od_final_premium'] - obj_plan_basic['Insurer_' + Insurer_Id][basic_plan_name]['od_final_premium'];
    //                                             //let od_final_diff = obj_plan_basic['Insurer_' + Insurer_Id][Plan_Name]['od_final_premium'] - obj_plan_basic['Insurer_' + Insurer_Id]['Basic']['od_final_premium'];
    //                                             console.error('DBG', 'diff_od_rate', 'base', Insurer_Id, zd_amt, od_final_diff);
    //                                             if (od_final_diff > 0) {
    //                                                 Addon['addon_zero_dep_cover'] = zd_amt + od_final_diff;
    //                                             }
    //                                         }
    //                                     }
    //                                 } catch (e) {
    //                                     console.error('Exception', 'diff_od_rate', 'base', Insurer_Id, e.stack);
    //                                 }
    //                                 var Plan_Addon = {};
    //                                 for (var key in Addon) {
    //                                     if (key.indexOf('final') < 0 && (Addon[key] - 0) > 0) {
    //                                         var Addon_Amt = Math.round(Addon[key] - 0);
    //                                         if (Addon_Amt > 0 && dbLogItems[k]['Insurer_Id'] == 13 && key === 'addon_zero_dep_cover' && All_Response['Insurer_13']['Premium_Breakup']['own_damage']['od_loading'] > 0) {
    //                                             Addon_Amt = Addon_Amt - Math.round(All_Response['Insurer_13']['Premium_Breakup']['own_damage']['od_loading'] * 1.18);
    //                                             dbLogItems[k]['Premium_Breakup']['addon']['addon_final_premium'] = dbLogItems[k]['Premium_Breakup']['addon']['addon_final_premium'] - Math.round(All_Response['Insurer_13']['Premium_Breakup']['own_damage']['od_loading'] * 1.18);
    //                                         }
    //                                         Plan_Addon[key] = Addon_Amt;
    //                                         ////console.log(key,Addon_Amt);
    //                                         All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']]['Addon_List'][key] = Addon_Amt;
    //                                     }
    //                                 }

    //                                 dbLogItems[k]['Premium_Breakup']['net_premium'] = (dbLogItems[k]['Premium_Breakup']['own_damage']['od_final_premium'] - 0) + (dbLogItems[k]['Premium_Breakup']['liability']['tp_final_premium'] - 0);
    //                                 dbLogItems[k]['Premium_Breakup']['service_tax'] = (dbLogItems[k]['Premium_Breakup']['net_premium'] * 0.18);
    //                                 dbLogItems[k]['Premium_Breakup']['final_premium'] = dbLogItems[k]['Premium_Breakup']['net_premium'] + dbLogItems[k]['Premium_Breakup']['service_tax'];
    //                                 All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']]['Plan_List'][plan_len] = {
    //                                     "Plan_Id": dbLogItems[k]['Plan_Id'],
    //                                     "Plan_Name": dbLogItems[k]['Plan_Name'],
    //                                     "Service_Log_Id": dbLogItems[k]['Service_Log_Id'],
    //                                     "Service_Log_Unique_Id": dbLogItems[k]['Service_Log_Unique_Id'],
    //                                     "Insurer_Transaction_Identifier": dbLogItems[k]['Insurer_Transaction_Identifier'],
    //                                     'Plan_Addon_Breakup': Plan_Addon,
    //                                     'Plan_Addon_Premium': dbLogItems[k]['Premium_Breakup']['addon']['addon_final_premium']
    //                                 };
    //                                 delete dbLogItems[k]['Premium_Breakup']['addon'];
    //                             }
    //                         }
    //                         Premium_Response = All_Response['Insurer_' + api_log_response.Summary.Insurer_Id];
    //                         //console.error('Log','APISUMMARYDBG',Premium_Response);

    //                         var Request = require('../models/request');
    //                         User_Data.findOne(ud_cond, function (err, objDbUserData) {
    //                             if (objDbUserData) {
    //                                 if (objDbUserData.Premium_Request) {
    //                                     api_log_response.Summary.User_Data_Id = objDbUserData.User_Data_Id;
    //                                     api_log_response.Summary.Last_Status = objDbUserData.Last_Status;
    //                                     api_log_response.Quote_Request = objDbUserData.Premium_Request;
    //                                     api_log_response.Quote_Request.crn = objDbUserData.PB_CRN;
    //                                     api_log_response.PB_Master.Vehicle = objDbUserData.Master_Details.vehicle;
    //                                     api_log_response.PB_Master.Rto = objDbUserData.Master_Details.rto;
    //                                     var Vehicles_Insurer = require('../models/vehicles_insurer');
    //                                     var Insurer_Vehicle_ID = dbService_Log._doc.LM_Custom_Request.insurer_vehicle_id;
    //                                     Vehicles_Insurer.findOne({ "Insurer_Vehicle_ID": Insurer_Vehicle_ID }, function (err, dbVehicles_Insurer) {
    //                                         if (err) {

    //                                         } else {
    //                                             api_log_response.Insurer_Master.Vehicle = dbVehicles_Insurer._doc;
    //                                             objBase.api_log_summary_handler(api_log_response);
    //                                         }
    //                                     });
    //                                     // to get insurer details
    //                                     var Insurer = require('../models/insurer');
    //                                     Insurer.findOne({ "Insurer_ID": dbService_Log._doc.Insurer_Id }, function (err, dbInsurer) {
    //                                         if (err) {

    //                                         } else {
    //                                             api_log_response.PB_Master.Insurer = dbInsurer._doc;
    //                                             objBase.api_log_summary_handler(api_log_response);
    //                                         }
    //                                     });
    //                                     // to get insurer details

    //                                     // to get insurer details

    //                                     var Vehicle_Detail = require('../models/vehicle_detail');
    //                                     var registration_no = dbService_Log._doc.LM_Custom_Request.registration_no;
    //                                     registration_no = registration_no.replace(/-/g, '');
    //                                     if (registration_no != '' && registration_no.length === 10 && registration_no.indexOf('AA1234') < 0 && registration_no.indexOf('ZZ9999') < 0) {
    //                                         console.error('vehicle_details', registration_no);
    //                                         Vehicle_Detail.findOne({ "Registration_Number": registration_no }, null, { sort: { Vehicle_Detail_Id: -1 } }, function (err, dbVehicle_Detail) {
    //                                             if (err) {
    //                                                 console.error('vehicle_details', 'err', err);
    //                                             } else {
    //                                                 //console.error('vehicle_details', 'db', dbVehicle_Detail);
    //                                                 if (dbVehicle_Detail) {
    //                                                     api_log_response.PB_Master.Vehicle_Details = dbVehicle_Detail._doc;
    //                                                 } else {
    //                                                     api_log_response.PB_Master.Vehicle_Details = {};
    //                                                 }
    //                                                 objBase.api_log_summary_handler(api_log_response);
    //                                             }
    //                                         });
    //                                     } else {
    //                                         api_log_response.PB_Master.Vehicle_Details = {};
    //                                     }

    //                                 }
    //                                 if (objDbUserData.Proposal_Request) {
    //                                     var ind_proposal_request = {};
    //                                     if (objDbUserData.Proposal_History && objDbUserData.Proposal_History.length > 0) {
    //                                         for (var k2 in objDbUserData.Proposal_History) {
    //                                             var ind_req = objDbUserData.Proposal_History[k2];
    //                                             if ((ind_req['Insurer_Id'] - 0) == (dbService_Log._doc['Insurer_Id'] - 0)) {
    //                                                 ind_proposal_request = ind_req['Form_Data'];
    //                                                 break;
    //                                             }
    //                                         }
    //                                     }
    //                                     for (var k1 in objDbUserData.Proposal_Request) {
    //                                         try {
    //                                             ind_proposal_request[k1] = objDbUserData.Proposal_Request[k1];
    //                                         } catch (ex1) {

    //                                         }
    //                                     }
    //                                     api_log_response.Proposal_Request = ind_proposal_request;
    //                                 }
    //                                 if (objDbUserData.Addon_Request) {
    //                                     api_log_response.Addon_Request = objDbUserData.Addon_Request;
    //                                     if (api_log_response.Addon_Request.hasOwnProperty('addon_standalone') === false) {
    //                                         api_log_response.Addon_Request = {
    //                                             'addon_standalone': objDbUserData.Addon_Request,
    //                                             'addon_package': {}
    //                                         }
    //                                     }
    //                                     Premium_Response['Premium_Breakup']['addon'] = {};
    //                                     var addon_final_premium = 0;
    //                                     var addon_premium_breakup = {};
    //                                     if (api_log_response.Summary.Addon_Mode === "ALACARTE") {
    //                                         for (var k in api_log_response.Addon_Request.addon_standalone) {
    //                                             if (Premium_Response['Addon_List'].hasOwnProperty(k) && Premium_Response['Addon_List'][k] > 0 && api_log_response.Addon_Request.addon_standalone[k] === 'yes') {
    //                                                 if (false && api_log_response.Summary.Insurer_Id == 13 && k === 'addon_zero_dep_cover' && Premium_Response['Premium_Breakup']['own_damage']['od_loading'] > 0) {
    //                                                     Premium_Response['Addon_List'][k] = Premium_Response['Addon_List'][k] - Math.round(Premium_Response['Premium_Breakup']['own_damage']['od_loading'] * 1.18);
    //                                                 }
    //                                                 addon_final_premium += Premium_Response['Addon_List'][k] - 0;
    //                                                 addon_premium_breakup[k] = Premium_Response['Addon_List'][k];
    //                                             }
    //                                         }
    //                                     }
    //                                     Premium_Response['Premium_Breakup']['addon'] = addon_premium_breakup;
    //                                     Premium_Response['Premium_Breakup']['addon']['addon_final_premium'] = addon_final_premium;
    //                                     Premium_Response['Premium_Breakup']['net_premium'] = (Premium_Response['Premium_Breakup']['own_damage']['od_final_premium'] - 0) + (Premium_Response['Premium_Breakup']['liability']['tp_final_premium'] - 0);
    //                                     Premium_Response['Premium_Breakup']['net_premium'] += addon_final_premium;
    //                                     Premium_Response['Premium_Breakup']['service_tax'] = (Premium_Response['Premium_Breakup']['net_premium'] * 0.18);
    //                                     Premium_Response['Premium_Breakup']['final_premium'] = Premium_Response['Premium_Breakup']['net_premium'] + Premium_Response['Premium_Breakup']['service_tax'];
    //                                 }

    //                                 api_log_response.Premium_Response = Premium_Response;
    //                                 objBase.api_log_summary_handler(api_log_response);
    //                             }
    //                         });
    //                     }

    //                 }
    //             });
    //             //  to get insurer vehicle master
    //             //                var Request = require('../models/request');
    //             //                Request.findOne({"Request_Id": dbService_Log._doc['Request_Id']}, function (err, dbRequest) {
    //             //                    if (err) {
    //             //
    //             //                    } else {
    //             //                        api_log_response.Quote_Request = dbRequest._doc.Request_Core;
    //             //                        objBase.api_log_summary_handler(api_log_response);
    //             //                    }
    //             //                });

    //         } else {
    //             console.error('API_LOG_SUMMARY', 'No such record');
    //             objBase.response_object.json({ 'Msg': 'No such record' });
    //         }
    //     }
    // });
    //console.log(this.constructor.name, 'api_log_summary', 'To Early');
}


Base.prototype.api_log_summary_handler = function (api_log_response) {
    //console.log('Start', 'api_log_summary_handler');
    if (api_log_response.Summary.Product_Id === 2 || api_log_response.Summary.Product_Id === 13 || api_log_response.Summary.Product_Id === 5 || api_log_response.Summary.Product_Id === 15 || api_log_response.Summary.Product_Id === 16 || api_log_response.Summary.Product_Id === 18 || api_log_response.Summary.Product_Id === 4 || api_log_response.Summary.Product_Id === 19 || api_log_response.Summary.Product_Id === 8) {
        if (api_log_response.Quote_Request !== null && api_log_response.Premium_Response !== null && api_log_response.PB_Master.Insurer !== null) {
            //console.log('Start', 'api_log_summary_handler', 'Now I am Done');
            this.response_object.json(api_log_response);
        } else {
            //console.log('Start', 'api_log_summary_handler', 'Yet to complete');
        }
    } else {
        if (api_log_response.PB_Master.Insurer !== null && api_log_response.Insurer_Master.Vehicle !== null
            && api_log_response.PB_Master.Vehicle_Details !== null && api_log_response.Quote_Request !== null && api_log_response.Premium_Response !== null) {
            //console.log('Start', 'api_log_summary_handler', 'Now I am Done');
            try {
                if (api_log_response.PB_Master.Vehicle_Details && api_log_response.PB_Master.Vehicle_Details != {}) {
                    if (api_log_response.hasOwnProperty('Quote_Request')) {
                        api_log_response.Last_Premium_Request.engine_number = api_log_response.PB_Master.Vehicle_Details.Engin_Number;
                        api_log_response.Last_Premium_Request.chassis_number = api_log_response.PB_Master.Vehicle_Details.Chassis_Number;
                        //api_log_response.Quote_Request.engine_number = api_log_response.PB_Master.Vehicle_Details.Engin_Number;
                        //api_log_response.Quote_Request.chassis_number = api_log_response.PB_Master.Vehicle_Details.Chassis_Number;
                        try {
                            api_log_response.Quote_Request.engine_number = api_log_response.Quote_Request.engin_number ? api_log_response.Quote_Request.engin_number : (api_log_response.PB_Master.Vehicle_Details.Engin_Number ? api_log_response.PB_Master.Vehicle_Details.Engin_Number : "");
                            api_log_response.Quote_Request.chassis_number = api_log_response.Quote_Request.chassis_number ? api_log_response.Quote_Request.chassis_number : (api_log_response.PB_Master.Vehicle_Details.Chassis_Number ? api_log_response.PB_Master.Vehicle_Details.Chassis_Number : "");
                        } catch (e) {
                            api_log_response.Quote_Request.engine_number = "";
                            api_log_response.Quote_Request.chassis_number = "";
                        }
                    }
                    if (!api_log_response.Proposal_Request) {
                        api_log_response.Proposal_Request = {
                            'engine_number': '',
                            'chassis_number': ''
                        };
                    }

                    if (api_log_response.Proposal_Request.engine_number == '' || api_log_response.Proposal_Request.hasOwnProperty('engine_number') === false) {
                        api_log_response.Proposal_Request.engine_number = api_log_response.PB_Master.Vehicle_Details.Engin_Number;
                    }
                    if (api_log_response.Proposal_Request.chassis_number == '' || api_log_response.Proposal_Request.hasOwnProperty('chassis_number') === false) {
                        api_log_response.Proposal_Request.chassis_number = api_log_response.PB_Master.Vehicle_Details.Chassis_Number;
                    }

                }
            } catch (e) {
                console.error('api_log_summary_handler', e);
            }
            this.response_object.json(api_log_response);
        } else {
            //console.log('Start', 'api_log_summary_handler', 'Yet to complete');
        }
    }
};
Base.prototype.insurer_process_single = function (arr_insurer_single) {
    for (var i in arr_insurer_single.Plan_List) {

    }
}


Base.prototype.method_process_all = function (arr_method_all) {
    for (var i in arr_method_all) {
        var InsurerProduct = require('../libs/');
        this.method_process_single(arr_method_all[i]);
    }

}
Base.prototype.field_prepare_all = function (objProduct, Insurer_Object, specific_insurer_object) {
    var objInsurerProduct = this;
    var product_id = objProduct.db_specific_product.Product_Id;
    var insurer_id = Insurer_Object.Insurer_ID;
    var method_field_list = objProduct.insurer_master_object['insurer_id_' + insurer_id]['method_field_list'];
    //console.log(this.constructor.name, 'field_prepare_all', 'Start');


    this.method_field_list = [];
    this.plan_processed_list = [];
    this.method_processed_request = {};
    this.addon_processed_request = {};
    this.processed_request = {};
    this.processed_response = {};
    //processed mapped db master field start
    this.master_db_field_process(objProduct, Insurer_Object, specific_insurer_object);
    //processed mapped db master field finish



    this.field_process_all(method_field_list, 'method');
    //process date field for method start
    if (this.base_date_format != this.insurer_date_format) {
        for (var key in objProduct.product_processed_request) {
            if (key.indexOf('_date') > -1) {
                this.method_processed_request[key] = this.date_format(objProduct.product_processed_request[key], this.insurer_date_format);
            }
        }
        for (var key in objProduct.generic_processed_request) {
            if (key.indexOf('_date') > -1) {
                this.method_processed_request[key] = this.date_format(objProduct.generic_processed_request[key], this.insurer_date_format);
            }
        }
    }
    //process date field for method end
    //console.log('method_processed_request');
    //console.log(this.method_processed_request);

    var arr_combine_field = [this.method_processed_request, objProduct.product_processed_request, objProduct.generic_processed_request];
    for (var k in arr_combine_field) {
        for (var key in arr_combine_field[k]) {
            //            if (this.prepared_request.hasOwnProperty(key) === false) {
            //                this.prepared_request[key] = arr_combine_field[k][key];
            //            }
            var key_1 = '___' + key + '___';
            if (this.processed_request.hasOwnProperty(key_1) === false || this.processed_request[key_1] === '') {
                this.processed_request[key_1] = arr_combine_field[k][key];
            }

        }
    }
    var arr_combine_field = [objProduct.product_processed_request, objProduct.generic_processed_request];
    for (var k in arr_combine_field) {
        for (var key in arr_combine_field[k]) {
            if (this.prepared_request.hasOwnProperty(key) === false) {
                this.prepared_request[key] = arr_combine_field[k][key];
            }
        }
    }


    //processed insurer_integration field start
    this.insurer_integration_field_process(objProduct, Insurer_Object, specific_insurer_object);
    //processed insurer_integration field finish

    this.processed_request = this.sortObjectByKey(this.processed_request);
    //console.log('processed_request');
    //console.log(this.processed_request);

}
Base.prototype.plan_process_all = function (objProduct, Insurer_Object, specific_insurer_object) {
    let objInsurerProduct = this;
    try {
        let Plan_List = [];
        let addon_preference = {};
        for (let k in objInsurerProduct.lm_request) {
            if (k.indexOf('addon_') === 0) {
                addon_preference[k] = objInsurerProduct.lm_request[k];
            }
        }
        let Arr_Method_List = ['Coverage', 'Customer', 'Proposal', 'Verification', 'Pdf', 'Status', 'Renewal'];
        //if (Arr_Method_List.indexOf(objInsurerProduct.lm_request['method_type']) > -1) {
        if (objInsurerProduct.lm_request.hasOwnProperty('insurer_id') && objInsurerProduct.lm_request['insurer_id'] !== '') {
            if (objInsurerProduct.lm_request.hasOwnProperty('product_id') && objInsurerProduct.lm_request.hasOwnProperty('method_type') && objInsurerProduct.lm_request['method_type'] === 'Proposal' && [2, 16, 18, 4, 8].indexOf(objInsurerProduct.lm_request['product_id'] - 0) > -1) {
                // for non-motor
                let plan_id = objInsurerProduct.lm_request['plan_id'];
                let index = Insurer_Object.Plan_List.findIndex(x => x.Plan_Id === plan_id);
                Plan_List.push(Insurer_Object.Plan_List[index === -1 ? 0 : index]);
            } else {
                let specific_plan = Insurer_Object.Plan_List[0];
                specific_plan.Plan_Addon_List = addon_preference;
                Plan_List.push(specific_plan);
            }
        } else {
            Plan_List = Insurer_Object.Plan_List;
        }

		console.error("Health Renewal Jyoti ", objInsurerProduct.lm_request.health_policy_type);

        if (objInsurerProduct.lm_request.health_policy_type && objInsurerProduct.lm_request.health_policy_type == 'renew' && specific_insurer_object.method.Method_Type && specific_insurer_object.method.Method_Type == 'Premium' && specific_insurer_object.method.Insurer_Id && specific_insurer_object.method.Insurer_Id == 6) {
            Plan_List = [];
            Plan_List.push(objProduct.lm_request.plan_data);
        }
		
		console.error("Health Renewal Jyoti plan_list", Plan_List);

        let Product_Class = objProduct.db_specific_product['Product_Class'];
        let Insurer_Product_Class = specific_insurer_object;
        let product_id = objProduct.db_specific_product.Product_Id;
        let insurer_id = Insurer_Object.Insurer_ID;
        let method_field_list = objProduct.insurer_master_object['insurer_id_' + insurer_id]['method_field_list'];
        let method_content = "";
        if (specific_insurer_object.method.Method_Request_File !== "") {
            method_content = fs.readFileSync(appRoot + '/resource/request_file/' + specific_insurer_object.method.Method_Request_File).toString();
        }

        ////console.log(arr_combine_field);
        let is_addon_custom = false;
        if (method_field_list) {
            for (let key in method_field_list) {
                let field_name = method_field_list[key]['Field_Name'];
                if (field_name.indexOf('addon_') > -1 || field_name.indexOf('_addon') > -1) {
                    is_addon_custom = true;
                    break;
                }
            }

            if (!is_addon_custom) {
                for (let key in objProduct.product_field_list) {
                    let field_name = objProduct.product_field_list[key]['Field_Name'];
                    if (field_name.indexOf('addon_') > -1) {
                        method_field_list.push(objProduct.product_field_list[key]);
                    }
                }
            }
        }

        objInsurerProduct.plan_processed_list = [];

        for (let k in Plan_List) {
            objInsurerProduct.prepared_request['insurer_vehicle_id'] = objInsurerProduct.processed_request['___dbmaster_insurer_vehicle_id___'];
            let loop_prepared_request = objInsurerProduct.prepared_request;
            let loop_processed_request = objInsurerProduct.processed_request;
            for (let key in Plan_List[k].Plan_Addon_List) {
                objInsurerProduct.product_processed_request[key] = Plan_List[k].Plan_Addon_List[key];
                loop_prepared_request[key] = Plan_List[k].Plan_Addon_List[key];
            }

            loop_prepared_request['Plan_Code'] = Plan_List[k].Plan_Code || '';
            loop_prepared_request['Plan_Name'] = Plan_List[k].Plan_Name || '';
            loop_prepared_request['Plan_Id'] = Plan_List[k].Plan_Id || '';

            loop_processed_request['___Plan_Code___'] = Plan_List[k].Plan_Code || '';
            loop_processed_request['___Plan_Name___'] = Plan_List[k].Plan_Name || '';
            loop_processed_request['___Plan_Id___'] = Plan_List[k].Plan_Id || '';

            objInsurerProduct.field_process_all(method_field_list, 'addon');
            for (let key in objInsurerProduct.addon_processed_request) {
                loop_processed_request['___' + key + '___'] = objInsurerProduct.addon_processed_request[key] || '';
            }

            let request_replaced_data = '';
            if (objInsurerProduct.lm_request['method_type'] === 'Verification') {
                objInsurerProduct.const_policy = {
                    'policy_url': null,
                    'policy_number': null,
                    'policy_id': null,
                    'transaction_status': null,
                    'pg_status': null,
                    'transaction_id': null,
                    'transaction_amount': null,
                    "pg_reference_number_1": null,
                    "pg_reference_number_2": null,
                    "pg_reference_number_3": null,
                    'verification_request': null
                };

                objInsurerProduct.pg_response_handler();
                for (let kpg in objInsurerProduct.const_policy) {
                    loop_processed_request['___' + kpg + '___'] = objInsurerProduct.const_policy[kpg];
                    loop_prepared_request[kpg] = objInsurerProduct.const_policy[kpg];
                    loop_prepared_request['policy_' + kpg] = objInsurerProduct.const_policy[kpg];
                }
            }

            objInsurerProduct.prepared_request = objInsurerProduct.sortObjectByKey(loop_prepared_request);
            objInsurerProduct.processed_request = objInsurerProduct.sortObjectByKey(loop_processed_request);

            //pre check before service key replaced by processed value
            objInsurerProduct.method_content = method_content;
            objInsurerProduct.method = specific_insurer_object.method;
            objInsurerProduct.product_field_process_pre();
            objInsurerProduct.insurer_product_field_process_pre();
            if (objInsurerProduct.method_content === 'PB_DECLINED') {
                continue;
            }
            if (objInsurerProduct.lm_request['method_type'] == 'Coverage') {
                console.error("RelianceMotor_Coverage_Process_Start", objInsurerProduct.method_content);
            }
            request_replaced_data = objInsurerProduct.method_content.replaceJson(objInsurerProduct.processed_request);
            if (objInsurerProduct.lm_request['method_type'] == 'Coverage') {
                console.error("RelianceMotor_Coverage_Process_Finish", request_replaced_data);
            }

            request_replaced_data = request_replaced_data.replace(/&/g, '&amp;');
            if (objInsurerProduct.lm_request['method_type'] == 'Coverage') {
                //request_replaced_data = request_replaced_data.replace('<PolicyDetails mlns:', '<PolicyDetails xmlns:');
            }
            ////console.log(request_replaced_data);

            objInsurerProduct.method_content_replaced = request_replaced_data;
            let logGuid = objInsurerProduct.create_guid('ARN-');
            if (Insurer_Object.hasOwnProperty('Insurer_Idv')) {
                for (let k2 in Insurer_Object['Insurer_Idv']) {
                    objInsurerProduct.prepared_request[k2] = Insurer_Object['Insurer_Idv'][k2];
                }
            }
            let LM_Custom_Request = objInsurerProduct.prepared_request;
            let docLog = {
                "Service_Log_Id": "",
                "Service_Log_Unique_Id": logGuid,
                "Request_Id": objProduct.docRequest.Request_Id,
                "User_Data_Id": objProduct.lm_request['udid'] - 0,
                "Request_Unique_Id": objProduct.docRequest.Request_Unique_Id,
                "PB_CRN": objProduct.docRequest.PB_CRN,
                "Client_Id": objProduct.docRequest.Client_Id,
                "LM_Custom_Request": LM_Custom_Request,
                "Insurer_Request": request_replaced_data,
                "Insurer_Response": "",
                "Insurer_Response_Core": "",
                "Premium_Breakup": null,
                "LM_Response": "",
                "Insurer_Transaction_Identifier": "",
                "Health_Renewal_Proposal_Request_Core": null, // Added By roshani
                "Status": "pending",
                "Error_Code": "",
                "Is_Active": 1,
                "Created_On": new Date(),
                "Product_Id": objProduct.db_specific_product.Product_Id,
                "Insurer_Id": Insurer_Object.Insurer_ID,
                "Plan_Id": LM_Custom_Request['Plan_Id'],
                "Plan_Name": LM_Custom_Request['Plan_Name'],
                "Plan_Code": LM_Custom_Request['Plan_Code'],
                "Allow_Renew": Plan_List[k]['Allow_renew'],
                "Addon_Mode": (Insurer_Object.hasOwnProperty('Addon_Mode')) ? Insurer_Object['Addon_Mode'] : 'ALACARTE',
                "Method_Type": objInsurerProduct.lm_request['method_type'],
                "Call_Execution_Time": 0
            };
            console.error('Dhananjay Health Renewal docLog ',docLog);
            if (objInsurerProduct.lm_request.product_id == 2) {
                if (Insurer_Object.Insurer_ID == 20 && objInsurerProduct.lm_request.hasOwnProperty('addon_selected') && objInsurerProduct.lm_request['addon_selected'] &&
                    objInsurerProduct.lm_request['addon_selected'] === 'yes' && objInsurerProduct.lm_request.hasOwnProperty('addonPlanArray') &&
                    objInsurerProduct.lm_request['addonPlanArray'] && objInsurerProduct.lm_request['addonPlanArray'].indexOf(LM_Custom_Request['Plan_Id']) > -1) {
                    docLog['Addons_Applied'] = 'yes';
                    docLog['Insurer_Addon_List'] = objInsurerProduct.lm_request['Insurer_Addon_List'];
                } else if ([5, 38].includes(Insurer_Object.Insurer_ID) && objInsurerProduct.lm_request.hasOwnProperty('addon_selected') && objInsurerProduct.lm_request['addon_selected'] &&
                    objInsurerProduct.lm_request['addon_selected'] === 'yes') {
                    docLog['Addons_Applied'] = 'yes';
                    docLog['Insurer_Addon_List'] = objInsurerProduct.lm_request['Insurer_Addon_List'];
                } else {
                    docLog['Addons_Applied'] = 'no';
                }
            }
            let save_log = true;
            if (objProduct.db_specific_product.Product_Id === 2) {
                if (Plan_List[k].hasOwnProperty('Allow_renew') && Plan_List[k]['Allow_renew'] == false) {
                    save_log = false;
                }
            }

            objInsurerProduct.plan_processed_list['plan_id_' + Plan_List[k].Plan_Id] = docLog;
            if (objInsurerProduct.lm_request['execution_async'] === 'yes' && objInsurerProduct.lm_request['method_type'] === 'Proposal') {
                let objProposal = {
                    "Proposal_Id": objInsurerProduct.lm_request['proposal_id'],
                    "Service_Log_Id": "",
                    "Service_Log_Unique_Id": logGuid,
                    "Request_Id": objProduct.docRequest.Request_Id,
                    "User_Data_Id": objProduct.lm_request['udid'] - 0,
                    "Request_Unique_Id": objProduct.docRequest.Request_Unique_Id,
                    "PB_CRN": objProduct.docRequest.PB_CRN,
                    "Client_Id": objProduct.docRequest.Client_Id,
                    "Error_Code": "",
                    "Product_Id": objProduct.db_specific_product.Product_Id,
                    "Insurer_Id": Insurer_Object.Insurer_ID,
                    "Plan_Id": "",
                    "Plan_Name": "",
                    "Plan_Code": "",
                    "Method_Type": objInsurerProduct.lm_request['method_type']
                };
                let autoIncrement = require("mongodb-autoincrement");
                autoIncrement.getNextSequence(myDbClient, 'service_logs', function (err, autoIndex) {
                    let document_pk = 'Service_Log_Id';
                    docLog[document_pk] = autoIndex;
                    objProposal['Service_Log_Id'] = autoIndex;
                    objProposal['Service_Log_Unique_Id'] = logGuid + '_' + autoIndex + '_' + objInsurerProduct.lm_request['udid'];
                    if (Plan_List.length >= 0) {
                        objProposal.Plan_Id = Plan_List[0].Plan_Id;
                        objProposal.Plan_Name = Plan_List[0]['Plan_Name'];
                        objProposal.Plan_Code = Plan_List[0]['Plan_Code'];
                    }
                    myDbClient.collection('service_logs').insert(docLog, function (err, docsInserted) {
                        ////console.log('save_to_db', collection_name, docsInserted);
                        if (err) {
                            console.error('Exception', 'SaveSLError', err);
                            objProposal.Error_Code = err;
                            return objInsurerProduct.response_object.json(objProposal);
                        } else {
                            return objInsurerProduct.response_object.json(objProposal);
                        }
                    });
                });
            } else {
                console.error('Dhananjay Health Renewal Before save_log ',save_log);
                if (save_log) {
                    console.error('Plan_execute_loop', objProduct.docRequest.PB_CRN, Insurer_Object.Insurer_ID, logGuid, LM_Custom_Request['Plan_Id'], LM_Custom_Request['Plan_Name'], Plan_List[k]['Plan_Id'], Plan_List[k]['Plan_Name']);
                    console.error('Dhananjay Health Renewal After save_log ',save_log);
                    objInsurerProduct.save_log(docLog);
                }
            }
            /*objInsurerProduct.prepared_request['Plan_Code'] = docLog['Plan_Code'];
            objInsurerProduct.processed_request['___Plan_Code___'] = docLog['Plan_Code'];
            objInsurerProduct.prepared_request['Plan_Name'] = docLog['Plan_Name'];
            objInsurerProduct.processed_request['___Plan_Name___'] = docLog['Plan_Name'];
            objInsurerProduct.prepared_request['Plan_Id'] = docLog['Plan_Id'];
            objInsurerProduct.processed_request['___Plan_Id___'] = docLog['Plan_Id'];*/
        }
    }
    catch (e) {
        return objInsurerProduct.response_object.json({
            'Error_Code': e.stack
        });
    }
};
Base.prototype.plan_execute_all = function (objProduct, Insurer_Object, specific_insurer_object) {
    let objInsurerProduct = this;
    let product_id = objProduct.db_specific_product.Product_Id;
    let insurer_id = Insurer_Object.Insurer_ID;
    for (let i in objInsurerProduct.plan_processed_list) {
        //this.docRequest.Total++;
        //this.docRequest.Pending++;
        //console.log('ServiceData');
        //console.log(this.plan_processed_list[i].Insurer_Request);

        let Execute_API = true;
        let call_API = true;
        if (objProduct.lm_request['method_type'] === 'Proposal' || objProduct.lm_request['method_type'] === 'Verification') {
            if (specific_insurer_object.method.hasOwnProperty('Execute_API') && specific_insurer_object.method.Execute_API === 'no') {
                Execute_API = false;
            } else {
                if (objProduct.lm_request['method_type'] === 'Verification') {
                    if (objInsurerProduct.const_policy.pg_status === 'SUCCESS') {
                        Execute_API = true;
                    } else if (objInsurerProduct.const_policy.pg_status === 'FAIL') {
                        Execute_API = false;
                    }

                    //commented by Jyoti 24-02-2023
                    //Khushbu 22062020
                    /*if (objProduct.lm_request['insurer_id'] === 11) {
                         if (objProduct.lm_request['calling_type'] === 'Status') {
                             Execute_API = true;
                         } else {
                             Execute_API = false;
                         }
                     }*/
                }
            }
        }
        if (objProduct.lm_request['product_id'] === 2 && objProduct.lm_request.hasOwnProperty('health_policy_type') && objInsurerProduct.plan_processed_list[i].hasOwnProperty('Allow_Renew')) {
            if (objInsurerProduct.plan_processed_list[i].hasOwnProperty('Allow_Renew') && objInsurerProduct.plan_processed_list[i]['Allow_Renew'] !== undefined) {
                if (objInsurerProduct.plan_processed_list[i]['Allow_Renew'] === true && objProduct.lm_request['health_policy_type'] === "renew") {
                    call_API = true;
                } else {
                    Execute_API = false;
                    call_API = false;
                }
            }
        }

        //Iffco breakin jyoti
        if (objProduct.lm_request['method_type'] === 'Proposal' && (objProduct.lm_request['product_id'] === 1 || objProduct.lm_request['product_id'] === 12)) {
            if (objProduct.lm_request['insurer_id'] === 7) {
                var ch_flag = ((parseInt(((this.lm_request['vehicle_insurance_subtype']).split('CH'))[0]) > 0) ? true : false);
                if (objProduct.lm_request['is_breakin'] === 'yes' && ch_flag && objProduct.lm_request['is_inspection_done'] === 'no') {
                    Execute_API = true;
                    call_API = true;
                } else {
                    Execute_API = false;
                    call_API = true;
                }
            }
        }

        //Godigit breakin jyoti
        if (objProduct.lm_request['method_type'] === 'Customer' && objProduct.lm_request['product_id'] === 1) {
            if (objProduct.lm_request['insurer_id'] === 16) {
                if (objProduct.lm_request.hasOwnProperty('is_call_time')) {
                    if (objProduct.lm_request['is_call_time'].includes("first_call")) {
                        Execute_API = false;
                        call_API = true;
                    }
                } else {
                    Execute_API = true;
                    call_API = true;
                }
            }
            if (objProduct.lm_request['insurer_id'] === 44) {
                var ch_flag = ((parseInt(((this.lm_request['vehicle_insurance_subtype']).split('CH'))[0]) > 0) ? true : false);
                if (objProduct.lm_request['is_breakin'] === 'yes' && ch_flag && objProduct.lm_request['is_inspection_done'] === 'yes') {
                    Execute_API = false;
                    call_API = true;
                } else {
                    Execute_API = true;
                    call_API = true;
                }
            }

        }

        //if (objInsurerProduct.lm_request.hasOwnProperty('proposal_create_flag') && objInsurerProduct.lm_request['proposal_create_flag'] === 'no') {
        // if (objProduct.lm_request['product_id'] === 1 && insurer_id === 11 && objProduct.lm_request['method_type'] == "Customer") {
        //    Execute_API = false;
        // }
        if (Execute_API === false) {
            if (call_API) {
                let sleep = require('system-sleep');
                sleep(3000);
                let objResponseFull = {
                    'err': null,
                    'result': null,
                    'raw': objInsurerProduct.plan_processed_list[i].Insurer_Request,
                    'soapHeader': objInsurerProduct,
                    'objResponseJson': objInsurerProduct.plan_processed_list[i].Insurer_Request
                };
                objInsurerProduct.base_response_handler(objResponseFull, objInsurerProduct.plan_processed_list[i], objProduct, Insurer_Object, specific_insurer_object);
            }
        } else {
            try {
                //exclude kotak car as details are send in post payment
                if (['Proposal', 'Customer'].indexOf(objInsurerProduct.lm_request['method_type']) > -1 && [1, 10, 12].indexOf(objInsurerProduct.lm_request['product_id']) > -1) {
                    let customer_name = objInsurerProduct.lm_request['first_name'] + '-' + objInsurerProduct.lm_request['last_name'];
                    let insurer_request_xml = objInsurerProduct.plan_processed_list[i].Insurer_Request;
                    let REG_VERIFY_STATUS = 'FAIL';
                    let Is_Proposal_Details_Verification_Required = false;
                    let obj_proposal_check = {};
                    if (Insurer_Object.Insurer_ID !== 30 && Insurer_Object.Insurer_ID !== 35 && Insurer_Object.Insurer_ID !== 13 && insurer_request_xml && typeof insurer_request_xml === 'string') {
                        if (objInsurerProduct.lm_request['vehicle_insurance_type'] === 'renew') {
                            //liberty , united
                            if (insurer_request_xml.indexOf(objInsurerProduct.lm_request['registration_no']) > -1) {
                                REG_VERIFY_STATUS = "SUCCESS";
                            }
                            else if (insurer_request_xml.indexOf(objInsurerProduct.lm_request['registration_no'].replace(/\-/g, '')) > -1) {
                                REG_VERIFY_STATUS = "SUCCESS";
                            }
                            else if (insurer_request_xml.indexOf(objInsurerProduct.lm_request['registration_no_1']) > -1 &&
                                insurer_request_xml.indexOf(objInsurerProduct.lm_request['registration_no_2']) > -1 &&
                                insurer_request_xml.indexOf(objInsurerProduct.lm_request['registration_no_3']) > -1 &&
                                insurer_request_xml.indexOf(objInsurerProduct.lm_request['registration_no_4']) > -1) {
                                REG_VERIFY_STATUS = "SUCCESS";
                            }
                            else if (insurer_request_xml.indexOf("<Vehicle_Regno>ELC</Vehicle_Regno>") > -1 || Insurer_Object.Insurer_ID === 11) {
                                REG_VERIFY_STATUS = "NA";
                            }

                        }
                        if (objInsurerProduct.lm_request['vehicle_insurance_type'] === 'new') {
                            REG_VERIFY_STATUS = "NA";
                        }

                        obj_proposal_check = {
                            "PROPOSAL": objInsurerProduct.lm_request['proposal_id'],
                            "Method": objInsurerProduct.lm_request['method_type'],
                            "InsurerProduct": Insurer_Object.Name || 'NA',
                            "InsurerId": Insurer_Object.Insurer_ID,
                            'CRN': objInsurerProduct.lm_request['crn'],
                            'NAME': customer_name,
                            'REG': objInsurerProduct.lm_request['registration_no'],
                            "ENGINE": objInsurerProduct.lm_request['engine_number'],
                            "CHASSIS": objInsurerProduct.lm_request['chassis_number'],
                            "FIRST_NAME_VERIFY_STATUS": (insurer_request_xml.indexOf(objInsurerProduct.lm_request['first_name']) > -1) ? 'SUCCESS' : 'FAIL',
                            'REG_VERIFY_STATUS': REG_VERIFY_STATUS,
                            "ENGINE_VERIFY_STATUS": (insurer_request_xml.indexOf(objInsurerProduct.lm_request['engine_number']) > -1) ? 'SUCCESS' : 'FAIL',
                            "CHASSIS_VERIFY_STATUS": (insurer_request_xml.indexOf(objInsurerProduct.lm_request['chassis_number']) > -1) ? 'SUCCESS' : 'FAIL',
                            "ALL_VERIFY_STATUS": 'NA'
                        };

                        //for royal digit details stay in customer service
                        if ([10, 44].indexOf(Insurer_Object.Insurer_ID) > -1) {
                            if (objInsurerProduct.lm_request['method_type'] === 'Customer') {
                                Is_Proposal_Details_Verification_Required = true;
								if ([44].indexOf(Insurer_Object.Insurer_ID) > -1 && this.lm_request['vehicle_registration_type'] === 'corporate') {
									obj_proposal_check.FIRST_NAME_VERIFY_STATUS = 'SUCCESS';
								}
                            }
                        }
                        else {
                            if (objInsurerProduct.lm_request['method_type'] === 'Proposal') {
                                Is_Proposal_Details_Verification_Required = true;
                            }
                        }
                    }
                    else {
                        obj_proposal_check = {
                            "PROPOSAL": objInsurerProduct.lm_request['proposal_id'],
                            "Method": objInsurerProduct.lm_request['method_type'],
                            "InsurerProduct": Insurer_Object.Name || 'NA',
                            "InsurerId": Insurer_Object.Insurer_ID,
                            'CRN': objInsurerProduct.lm_request['crn'],
                            'NAME': customer_name,
                            'REG': objInsurerProduct.lm_request['registration_no'],
                            "ENGINE": objInsurerProduct.lm_request['engine_number'],
                            "CHASSIS": objInsurerProduct.lm_request['chassis_number'],
                            "FIRST_NAME_VERIFY_STATUS": 'NA',
                            'REG_VERIFY_STATUS': 'NA',
                            "ENGINE_VERIFY_STATUS": 'NA',
                            "CHASSIS_VERIFY_STATUS": 'NA',
                            "ALL_VERIFY_STATUS": 'NA'
                        };
                        Is_Proposal_Details_Verification_Required = true;
                    }




                    if (Is_Proposal_Details_Verification_Required === true) {
                        if (([13, 30, 35].indexOf(Insurer_Object.Insurer_ID) === -1) && insurer_request_xml && typeof insurer_request_xml === 'string') {
                            if (obj_proposal_check['FIRST_NAME_VERIFY_STATUS'] === 'SUCCESS' &&
                                    (obj_proposal_check['REG_VERIFY_STATUS'] === 'SUCCESS' || obj_proposal_check['REG_VERIFY_STATUS'] === 'NA') &&
                                    obj_proposal_check['ENGINE_VERIFY_STATUS'] === 'SUCCESS' &&
                                    obj_proposal_check['CHASSIS_VERIFY_STATUS'] === 'SUCCESS') {
                                obj_proposal_check['ALL_VERIFY_STATUS'] = 'SUCCESS';
                            } else {
                                obj_proposal_check['ALL_VERIFY_STATUS'] = 'FAIL';
                            }

                        } else {
                            obj_proposal_check['ALL_VERIFY_STATUS'] = 'NOT_APPLICABLE';
                        }


                        if (obj_proposal_check['ALL_VERIFY_STATUS'] === 'FAIL' || obj_proposal_check['ALL_VERIFY_STATUS'] === 'NA') {
                            obj_proposal_check['lm_request'] = objInsurerProduct.lm_request;
                            //obj_proposal_check['insurer_request_xml'] = '<pre lang="xml" >'+insurer_request_xml+'</pre>';
                        }

                        let msg = '<html><body><p>PROPOSAL_VERIFICATION</p><pre>' + JSON.stringify(obj_proposal_check, undefined, 2) + '</pre></body></html>';

                        let Email = require('../models/email');
                        let objModelEmail = new Email();
                        objModelEmail.send('noreply@policyboss.com', config.environment.notification_email, "[PROPOSAL_VERIFICATION]::" + obj_proposal_check['InsurerProduct'] + "::ALL_VERIFY_STATUS-" + obj_proposal_check['ALL_VERIFY_STATUS'] + "::Proposal_Id-" + objInsurerProduct.lm_request['proposal_id'] + '::CRN-' + objInsurerProduct.lm_request['crn'], msg, '', '', objInsurerProduct.lm_request['crn']);
                        if (obj_proposal_check['ALL_VERIFY_STATUS'] === 'FAIL' || obj_proposal_check['ALL_VERIFY_STATUS'] === 'NA') {
                            return objInsurerProduct.response_object.json({ 'Msg': 'Proposal could not be submitted due to technical error. Please try to submit again', 'Status': 'VALIDATION' });
                        }
                    }
                }
            }
            catch (e) {
                console.error('Exception', e.stack);
            }
            if (product_id === 2 && ([5, 20].indexOf(insurer_id) > -1) && objProduct.lm_request['method_type'] === 'Proposal') {
                objInsurerProduct.const_payment.pg_ack_url = objInsurerProduct.pg_ack_url(insurer_id);
            }
            objInsurerProduct.service_call(objInsurerProduct.plan_processed_list[i], objProduct, Insurer_Object, specific_insurer_object);
        }
    }
}
Base.prototype.save_log = function (docLog, docLogModify = null) {
    if (docLogModify) {
        if (docLogModify.Status === "complete") {
            var moment = require('moment');
            var StartDate = moment(docLog.Created_On);
            var EndDate = moment(new Date());
            var Call_Execution_Time = EndDate.diff(StartDate);
            Call_Execution_Time = Math.round((Call_Execution_Time * 0.001) * 100) / 100;
            docLogModify['Call_Execution_Time'] = Call_Execution_Time;
        }
        let search_criteria = JSON.parse('{"Service_Log_Unique_Id": "' + docLog.Service_Log_Unique_Id + '"}');
        this.save_to_db('service_logs', { $set: docLogModify }, search_criteria);
    } else {
        this.save_to_db('service_logs', docLog);
    }

    if (docLog.Method_Type === 'Premium') {
        if (docLogModify) {
            if (docLogModify.Status == "complete") {
                this.docRequest.Pending--;
                this.docRequest.Complete++;
                if (docLogModify.Error_Code !== "") {
                    this.docRequest.Fail++;
                } else {
                    this.docRequest.Success++;
                }
            }
        } else {
            this.docRequest.Total++;
            this.docRequest.Pending++;
            if (docLog.Status == "complete") {
                this.docRequest.Pending--;
                this.docRequest.Complete++;
                if (docLog.Error_Code !== "") {
                    this.docRequest.Fail++;
                } else {
                    this.docRequest.Success++;
                }
            }
        }
        this.complete_request();
    }
};
Base.prototype.method_content_process = function () {
    fs.readFile(appRoot + '/resource/request_file/' + this.premium_request_file, 'utf8', function (err, request_file_data) {
        if (err) {
            return //console.log(err);
        }

    });
}
Base.prototype.field_process = function (obj_field, field_cateogry) {
    let field_processed_value = '';
    ////console.log(obj_field['Field_Name'], obj_field['Field_Type'], obj_field['Field_Value']);
    let field_value = '';
    if (['generic', 'product', 'method', 'addon'].indexOf(field_cateogry) > -1) {
        if (this.lm_request.hasOwnProperty(obj_field['Field_Name'])) {
            field_value = this.lm_request[obj_field['Field_Name']];
        }
        if (['method', 'addon'].indexOf(field_cateogry) > -1 && field_value === "") {
            if (obj_field.hasOwnProperty('Field_Parent')) {
                if (obj_field['Field_Name'] == obj_field['Field_Parent']) {
                    if (this.product_processed_request.hasOwnProperty(obj_field['Field_Name'])) {
                        field_value = this.product_processed_request[obj_field['Field_Name']];
                    }
                } else {
                    if (this.product_processed_request.hasOwnProperty(obj_field['Field_Parent'])) {
                        field_value = this.product_processed_request[obj_field['Field_Parent']];
                    }
                    if (this.generic_processed_request.hasOwnProperty(obj_field['Field_Parent'])) {
                        field_value = this.generic_processed_request[obj_field['Field_Parent']];
                    }
                }
            } else {
                if (this.product_processed_request.hasOwnProperty(obj_field['Field_Name'])) {
                    field_value = this.product_processed_request[obj_field['Field_Name']];
                }
            }
        }
    }


    if (this.processed_request.hasOwnProperty('___' + obj_field['Field_Name'] + '___') &&
        this.processed_request['___' + obj_field['Field_Name'] + '___'] != '' && false) {
        field_processed_value = this.processed_request['___' + obj_field['Field_Name'] + '___'];
    } else {   //for text

        if (obj_field['Field_Type'] == 'text') {
            //            if (field_value == '' && obj_field.hasOwnProperty('Field_Default')) {
            //                field_processed_value = obj_field['Field_Default'];
            //            } else {
            //                field_processed_value = field_value;
            //            }
            field_processed_value = field_value;
        } else if (obj_field['Field_Type'] == 'date') {
            //            if (field_value == '') {
            //                if (obj_field.hasOwnProperty('Field_Default')) {
            //                    field_processed_value = obj_field['Field_Default'];
            //                } else {
            //                    field_processed_value = '';
            //                }
            //            } else {
            //                
            //            }
            field_processed_value = this.date_format(field_value, obj_field['Field_Value']);
        } else if (obj_field['Field_Type'] == 'list_key' || obj_field['Field_Type'] == 'list_val') {
            var field_json = JSON.parse(obj_field['Field_Value']);
            //      //console.log(JSON.stringify(field_json));
            if (field_json.hasOwnProperty(field_value)) {
                //for list key
                if (obj_field['Field_Type'] == 'list_key') {
                    field_processed_value = field_value; //field_value;
                }
                if (obj_field['Field_Type'] == 'list_val') {
                    field_processed_value = field_json[field_value];
                }
            }
        } else if (obj_field['Field_Type'] == 'custom') {
            try {
                field_processed_value = eval('this.' + obj_field['Field_Value'] + '(obj_field)');
            } catch (e) {
                //console.log('method', obj_field['Field_Value'], 'not_exists');
            }
        } else if (obj_field['Field_Type'] == 'hidden') {
            let field_json = JSON.parse(obj_field['Field_Value']);
            if (field_value !== '') {
                field_processed_value = field_json['not_empty'];
            }
            if (field_value === '' || field_value === 0 || field_value === '0') {
                field_processed_value = field_json['empty'];
            }
        } else {
            field_processed_value = field_value;
        }

    }
    //console.log('field_process', obj_field['Field_Name'], field_processed_value, field_value);
    return field_processed_value;
    //if(field.)
}
Base.prototype.field_process_all = function (arr_field, field_category) {
    let obj_processed_request = {};
    let field_processed_val = '';
    for (let i in arr_field) {
        let field_name = arr_field[i]['Field_Name'];
        if (field_category == 'generic' || field_category == 'product' || field_category == 'method') {
            field_processed_val = this.field_process(arr_field[i], field_category);
            if (field_category == 'generic') {
                this.generic_processed_request[field_name] = field_processed_val;
            }
            if (field_category == 'product') {
                this.product_processed_request[field_name] = field_processed_val;
            }
            if (field_category == 'method') {
                this.method_processed_request[field_name] = field_processed_val;
            }
        }
        if (field_category == 'addon') {
            if (field_name.indexOf('addon_') > -1) {
                field_processed_val = this.field_process(arr_field[i], field_category);
                this.addon_processed_request[field_name] = field_processed_val;
            }
        }
    }
}
Base.prototype.master_db_field_process = function (objProduct, Insurer_Object, specific_insurer_object) {
    var objInsurerProduct = this;
    var product_id = objProduct.db_specific_product.Product_Id;
    var insurer_id = Insurer_Object.Insurer_ID;
    var master_db_list = objProduct.insurer_master_object['insurer_id_' + insurer_id]['master_db_list'];
    //processed mapped db master field start

    var arr_field_key_exclude = ['_id', 'Insurer_ID', 'Is_Active', 'Created_On'];
    for (var key in master_db_list) {
        var single_master = master_db_list[key]['insurer_db_master'];
        for (var key_1 in single_master) {
            if (arr_field_key_exclude.indexOf(key_1) < 0 && typeof single_master[key_1] !== 'object') {
                var key_2 = 'dbmaster_' + key_1.toLowerCase();
                var key_3 = '___' + key_2 + '___';
                this.prepared_request[key_2] = single_master[key_1];
                this.processed_request[key_3] = single_master[key_1];
            }
        }
        var single_master = master_db_list[key]['pb_db_master'];
        for (var key_1 in single_master) {
            if (arr_field_key_exclude.indexOf(key_1) < 0 && typeof single_master[key_1] !== 'object') {
                var key_2 = 'dbmaster_pb_' + key_1.toLowerCase();
                var key_3 = '___' + key_2 + '___';
                this.prepared_request[key_2] = single_master[key_1];
                this.processed_request[key_3] = single_master[key_1];
            }
        }
    }
    //processed mapped db master field finish

}
Base.prototype.insurer_integration_field_process = function (objProduct, Insurer_Object, specific_insurer_object) {
    let objInsurerProduct = this;
    let product_id = objProduct.db_specific_product.Product_Id;
    let insurer_id = Insurer_Object.Insurer_ID;
    let master_db_list = objProduct.insurer_master_object['insurer_id_' + insurer_id]['master_db_list'];
    //processed mapped db master field start
    let arr_field_key_include = ['Agent_Code', 'Location_Code', 'Service_User', 'Service_Password', 'Pdf_URL', 'Account_Code'];
    for (let key in Insurer_Object) {
        if (arr_field_key_include.indexOf(key) > -1) {
            let key_1 = '___insurer_integration_' + key.toLowerCase() + '___';
            let key_2 = 'insurer_integration_' + key.toLowerCase();
            this.processed_request[key_1] = Insurer_Object[key];
            this.prepared_request[key_2] = Insurer_Object[key];
        }
    }
    //processed mapped db master field finish

}
Base.prototype.master_db_process_all = function (arr_field, insurer_id) {
    for (var i in arr_field) {
        if (arr_field[i]['Field_Type'] === 'db_master' && arr_field[i]['Field_Value'].indexOf('{') > -1) {
            var masterDBItem = this.master_db_get(arr_field[i], insurer_id);

            this.master_db_process(masterDBItem);
        }
    }

}
Base.prototype.master_db_get_back = function (obj_field, insurer_id) {

    //get vehicles
    /*
     * 
     {
     "source_collection": "vehicles",
     "source_key": "Vehicle_ID",
     "target_collection": "vehicles_insurers",
     "target_key": "Insurer_Vehicle_ID"
     }
     * g
     * 
     */

    var field_json = JSON.parse(obj_field['Field_Value']);
    var source_key = field_json['source_key'];
    var field_value = this.lm_request[obj_field['Field_Name']];
    var dbCollMaster = myDb.collection(field_json['source_collection']);
    var search_condition = JSON.parse('{"' + source_key + '":' + field_value + '}');
    dbCollMaster.findOne(search_condition, function (err, insurerMasterItem) {
        if (err) {
            return console.dir(err);
        }
        var mappedInsurerItems = [];
        mappedInsurerItems = insurerMasterItem['Insurer_Mapping_List'];
        var Insurer_Mapped_ID_DB = mappedInsurerItems.ArrayFindByKey('Insurer_ID', insurer_id, field_json['target_key']);
        //get insurer vehicle
        var dbCollInsurer = myDb.collection(field_json['target_collection']);
        var target_key = field_json['target_key'];
        search_condition = JSON.parse('{"' + target_key + '":' + Insurer_Mapped_ID_DB + '}');
        dbCollInsurer.findOne(search_condition, function (err, insurerMappedItem) {
            if (err) {
                return console.dir(err);
            }
            Base.master_db_list[field_json['source_collection']] = insurerMappedItem;
            //return insurerMappedItem;
        });
    });
}

Base.prototype.date_format = function (dateString, y) {
    //y = y || 'yyyy-MM-dd';
    y = y.toUpperCase() || 'YYYY-MM-DD';
    if (dateString instanceof Date) {
        x = dateString;
    } else {
        x = (dateString) ? new Date(dateString) : new Date();
    }
    var date_in_format = moment(x).format(y);
    return date_in_format.toString().toUpperCase();
    var z = {
        M: x.getMonth() + 1,
        d: x.getDate(),
        h: x.getHours(),
        m: x.getMinutes(),
        s: x.getSeconds()
    };
    y = y.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
        return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2)
    });
    return y.replace(/(y+)/g, function (v) {
        return x.getFullYear().toString().slice(-v.length)
    });
}
Function.prototype.myname = function () {
    return this.toString()
        .substr(0, this.toString().indexOf("("))
        .replace("function ", "");
}
String.prototype.replaceJson = function (objfindReplaceJson) {
    var replaceString = this;
    var regex;
    for (var key in objfindReplaceJson) {
        if (objfindReplaceJson.hasOwnProperty(key)) {
            var val = objfindReplaceJson[key];
            regex = new RegExp(key, "g");
            replaceString = replaceString.replace(regex, val);
        }
    }
    return replaceString;
};
Base.prototype.randomString = function (length) {
    var result = '';
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
Base.prototype.randomNumeric = function (length) {
    var result = '';
    var chars = '0123456789';
    for (var i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
Base.prototype.todayDate = function () {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    return [year, month, day].join('-');
}
Base.prototype.timestamp = function () {

    return new Date().getTime();
}
Base.prototype.sortObjectByKey = function (obj) {
    var keys = [];
    var sorted_obj = {};
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            keys.push(key);
        }
    }

    // sort keys
    keys.sort();
    // create new array based on Sorted Keys
    for (var i in keys) {
        sorted_obj[keys[i]] = obj[keys[i]];
    }
    return sorted_obj;
};
// array = [{key:value},{key:value}]
Base.prototype.ArrayFindByKey = function (arr_object, search_key, search_value, target_key = '') {
    var array = arr_object;
    for (var i = 0; i < array.length; i++) {
        if (array[i][search_key] === search_value) {
            if (target_key != '') {
                return array[i][target_key];
            } else {
                return array[i];
            }

        }
    }
    return null;
}
Base.prototype.save_to_db = function (collection_name, document, search_criteria = '', callback = '') {
    //console.log(this.constructor.name, 'save_to_db', 'Start');
    var Client = require('node-rest-client').Client;
    var client = new Client();
    if (search_criteria == '') {
        var autoIncrement = require("mongodb-autoincrement");
        autoIncrement.getNextSequence(myDbClient, collection_name, function (err, autoIndex) {
            let document_pk = Object.keys(document)[0];
            //console.log('getNextSequence', collection_name, autoIndex, document_pk);

            if (document.hasOwnProperty('Request_Core') && document.Request_Core && document.Request_Core.hasOwnProperty('product_id') && document.Request_Core.product_id === 2 && document.Request_Core.hasOwnProperty('addon_selected')
                && document.Request_Core.addon_selected === 'yes' && document.Request_Core.hasOwnProperty('Request_Id')
                && document.Request_Core.Request_Id && collection_name === 'requests') {
                document[document_pk] = document.Request_Core.Request_Id;
            } else {
                document[document_pk] = autoIndex;
            }
            if (collection_name === 'service_logs') {
                // new inster changes checking by suraj...
                let testNewData = {
                    collectionName: "service_logs",
                    documentData: document
                }
                let service_log_args = {
                    data: testNewData,
                    headers: {
                        "Content-Type": "application/json"
                    }
                };
                client.post(config.environment.weburl + '/service_log/save', service_log_args, (dbService_Logs, response) => {
                    if (dbService_Logs) {
                        console.log("Service logs insterted...")
                    }
                });
            }
            else {
                if (document.hasOwnProperty('Request_Core') && document.Request_Core.hasOwnProperty('product_id') && document.Request_Core.product_id == 2
                    && document.Request_Core.hasOwnProperty('addon_selected') && document.Request_Core.addon_selected == 'yes'
                    && document.Request_Core.hasOwnProperty('Request_Id') && document.Request_Core.Request_Id) {
                    let updateDocument = {};
                    updateDocument.Request_Core = document.Request_Core;
                    updateDocument.Request_Product = document.Request_Product;
                    updateDocument.Modified_On = new Date();
                    myDbClient.collection(collection_name).findOneAndUpdate({ 'Request_Id': document[document_pk] }, { $set: updateDocument }, { new: true }, function (err, docUpdated) {
                        try {
                            if (err) {
                                console.error('FindModify', err);
                            }
                            if (callback) {
                                callback(docUpdated);
                            }
                        } catch (e) {
                            console.error('Error in Request Collection Update', e.stack);
                        }
                    })
                } else {
                    myDbClient.collection(collection_name).insert(document, function (err, docsInserted) {
                        //console.log('save_to_db', collection_name, docsInserted);
                        if (err) {
                            console.error('FindModify', err);
                        }
                        if (callback) {
                            callback(docsInserted);
                        }

                    });
                }
            }
        });
    }
    if (search_criteria != '') {
        if (collection_name === 'service_logs') {
            // new inster changes checking by suraj...
            let testNewData = {
                collectionName: "service_logs",
                documentData: document,
                condition: search_criteria
            }
            let service_log_args = {
                data: testNewData,
                headers: {
                    "Content-Type": "application/json"
                }
            };
            client.post(config.environment.weburl + '/service_log/update', service_log_args, (dbService_Logs, response) => {
                if (dbService_Logs) {
                    console.log("Service logs insterted...")
                }
            });
        } else {
            myDbClient.collection(collection_name).findAndModify(search_criteria, [], document, {}, function (err, docsInserted) {
                ////console.log('save_to_db', collection_name, docsInserted);
                if (err) {
                    console.error('FindModify', err);
                }
                if (callback) {
                    callback(docsInserted);
                }
            });
        }



        //console.log(this.constructor.name, 'save_to_db', 'Finish');
    }
}
Base.prototype.insurer_request_filter = function (request_parameter) {
    //console.log("Start", this.constructor.name, 'insurer_request_create');
    var Field_List = {
        "dbmaster_insurer_rto_city_code": "",
        "dbmaster_insurer_rto_city_name": "BANGALORE RURAL",
        "dbmaster_insurer_rto_code": "",
        "dbmaster_insurer_rto_district_code": "",
        "dbmaster_insurer_rto_district_name": "",
        "dbmaster_insurer_rto_id": 6809,
        "dbmaster_insurer_rto_state_code": "",
        "dbmaster_insurer_rto_state_name": "KARNATAKA",
        "dbmaster_insurer_rto_zone_code": "B",
        "dbmaster_insurer_rto_zone_name": "",
        "dbmaster_insurer_vehicle_code": 1111611404,
        "dbmaster_insurer_vehicle_cubiccapacity": 1497,
        "dbmaster_insurer_vehicle_exshowroom": 0,
        "dbmaster_insurer_vehicle_fueltype": "Petrol",
        "dbmaster_insurer_vehicle_id": 143254,
        "dbmaster_insurer_vehicle_insurer_bodytype": "Sedan",
        "dbmaster_insurer_vehicle_insurer_segmant": 0,
        "dbmaster_insurer_vehicle_make_code": 0,
        "dbmaster_insurer_vehicle_make_name": "HONDA",
        "dbmaster_insurer_vehicle_model_code": 0,
        "dbmaster_insurer_vehicle_model_name": "NEW CITY",
        "dbmaster_insurer_vehicle_seatingcapacity": 5,
        "dbmaster_insurer_vehicle_variant_code": 0,
        "dbmaster_insurer_vehicle_variant_name": "1.5 S (AT)",
        "dbmaster_gross_vehicle_weight": 0,
        /*"addon_engine_protector_cover": "yes",
         "addon_invoice_price_cover": "yes",
         "addon_key_lock_cover": "yes",
         "addon_ncb_protection_cover": "yes",
         "addon_package_name": "Silver",
         "addon_road_assist_cover": "yes",
         "addon_zero_dep_cover": "yes",*/
        /*"electrical_accessory": "30000",
         "external_bifuel_type": "",
         "external_bifuel_value": "40000",
         "insurer_id": 5,
         "is_aai_membership": "",
         "is_antitheft_fit": "",
         "is_claim_exists": "no",
         "is_external_bifuel": "",
         "is_financed": "",
         "is_llpd": "yes",
         "non_electrical_accessory": "60000",
         "pa_named_passenger_si": "100000",
         "pa_owner_driver_si": "",
         "pa_paid_driver_si": "100000",
         "pa_unnamed_passenger_si": "200000",
         "policy_end_date": "2018-03-29",
         "policy_expiry_date": "2017-03-29",
         "policy_start_date": "2017-03-30",
         "pre_policy_start_date": "2016-03-30",
         "vehicle_age_month": 14,
         "vehicle_age_year": 1,*/
        "vehicle_expected_idv": 291790,
        "vehicle_min_idv": 291790,
        "vehicle_max_idv": 291790,
        "vehicle_normal_idv": 291790,
        "vehicle_ncb_current": "0",
        "vehicle_ncb_next": "20",
        /*"vehicle_manf_date": "2016-01-01",
         "vehicle_ncb_current": "0",
         "vehicle_ncb_next": "20",
         "vehicle_registration_date": "2016-01-05",
         "vehicle_registration_type": "individual",
         "voluntary_deductible": ""*/

    };
    var filtered_parameter = {};
    for (var key in request_parameter) {
        if (Field_List.hasOwnProperty(key)) {
            if (key === 'dbmaster_insurer_vehicle_cubiccapacity' && request_parameter[key]) {
                filtered_parameter[key] = request_parameter[key].toString().replace(/[^0-9&&^.]/g, "");
            }
            else {
                filtered_parameter[key] = request_parameter[key];
            }
        }
    }
    //console.log("Finish", this.constructor.name, 'insurer_request_create', filtered_parameter);
    return filtered_parameter;
};
Base.prototype.premium_list_db = function (request_unique_id = '', client_id = 0, response_version = '1.0') {
    //console.log(this.constructor.name, 'premium_list', 'Start');
    var objBase = this;
    //find method field5
    var dbCollRequest = myDb.collection('requests');
    dbCollRequest.findOne({ 'Request_Unique_Id': objBase.request_unique_id }, function (err, dbRequestItem) {
        if (dbRequestItem) {
            var productId = dbRequestItem.Request_Core["product_id"];
            var objProduct;
            if (productId === 2) {
                var Health = require('../libs/Health');
                objProduct = new Health();
            } else if (productId === 13) {
                var Marine = require('../libs/Marine');
                objProduct = new Marine();
            } else if (productId === 15) {
                var Cycle = require('../libs/Cycle');
                objProduct = new Cycle();
            } else if (productId === 16) {
                var CancerCare = require('../libs/CancerCare');
                objProduct = new CancerCare();
            } else if (productId === 5) {
                var Investment = require('../libs/Investment');
                objProduct = new Investment();
            } else if (productId === 18) {
                var CyberSecurity = require('../libs/CyberSecurity');
                objProduct = new CyberSecurity();
            } else if (productId === 4) {
                var Travel = require('../libs/Travel');
                objProduct = new Travel();
            }
            else if (productId === 19) {
                var WorkmenCompensation = require('../libs/WorkmenCompensation');
                objProduct = new WorkmenCompensation();
            }
            else if (productId === 8) {
                var PersonalAccident = require('../libs/PersonalAccident');
                objProduct = new PersonalAccident();
            } else {
                var Motor = require('../libs/Motor');
                objProduct = new Motor();
            }
            objProduct.response_object = objBase.response_object;
            objProduct.udid = objBase.udid;
            var moment = require('moment');
            var StartDate = moment(dbRequestItem.Created_On);
            var EndDate = moment(new Date());
            var Request_Age_Second = EndDate.diff(StartDate);
            Request_Age_Second = Math.round((Request_Age_Second * 0.001) * 100) / 100;
            //console.error('Log', 'PremiumRequestAgeSecond', Request_Age_Second);
            if (Request_Age_Second > 180 && response_version == '2.0' && config.environment.name === 'Production') {

                User_Data.findOne({ "User_Data_Id": objBase.udid }, function (err, dbUserData) {
                    if (err) {

                    } else {
                        if (dbUserData && dbUserData.Premium_List) {
                            if (dbUserData.hasOwnProperty('_doc')) {
                                dbUserData.Premium_List.Addon_Request = (dbUserData._doc.hasOwnProperty('Addon_Request')) ? dbUserData['_doc'].Addon_Request : {};
                            } else {
                                dbUserData.Premium_List.Addon_Request = (dbUserData.hasOwnProperty('Addon_Request')) ? dbUserData.Addon_Request : {};
                            }
                            objBase.response_object.json(dbUserData.Premium_List);
                        } else {
                            objProduct.premium_list_db(dbRequestItem, dbRequestItem.Request_Unique_Id, client_id, response_version);
                        }
                    }
                });
            } else {
                objProduct.premium_list_db(dbRequestItem, dbRequestItem.Request_Unique_Id, client_id, response_version);
            }
        } else {
            objBase.response_object.json({ 'Msg': 'Not Authorized' });
        }
    });
    //console.log(this.constructor.name, 'premium_list', 'Finish');
}
Base.prototype.soapResponseToJson = function (xml) {
    var json = this.xmlToJson(xml).Body;
    console.debug(json);
    var response = {};
    for (var outterKey in json) {
        if (json.hasOwnProperty(outterKey)) {
            temp = json[outterKey];
            for (var innerKey in temp) {
                if (temp.hasOwnProperty(innerKey)) {
                    response[innerKey] = temp[innerKey].text;
                }
            }
        }
    }

    console.debug(response);
    return response;
}
//Base.prototype.getNextSequence = function (sequenceName) {
//    var search_criteria = JSON.parse('{"_id" : "' + sequenceName + '"}');
//    var sequenceDocument = null;
//    myDb.collection('counters').findAndModify(
//            search_criteria, [],
//            {$inc: {"sequence_value": 1}},
//            {upsert: true, new : true}, function (err, DbSequenceDocument) {
//        ////console.log('save_to_db', collection_name, docsInserted);
//
//        if (err) {
//            //console.log('FindModify', err);
//        }
//        //console.log(DbSequenceDocument);
//        sequenceDocument = DbSequenceDocument;
//    });
//    // var i = 0;
////    while (sequenceDocument === null) {
////        //console.log(i++);
////    }
//    // return sequenceDocument.sequence_value;
////    var sequenceDocument = myDbClient.collection('counters').findAndModify(
////            {
////                "query": search_criteria,
////                "update": {"$inc": {"sequence_value": 1}},
////                "upsert": true,
////                "new" : true,
////                remove:true
////            }
////    );
//
////    return sequenceDocument.sequence_value;
//}
// Changes XML to JSON
Base.prototype.xmlToJson = function (xml) {

    // Create the return object
    var obj = {};
    if (xml.nodeType == 1) {// element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    } else if (xml.nodeType == 3) {// text
        obj = xml.nodeValue;
    }

    // do children
    if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName.substring(item.nodeName.indexOf(":") + 1).replace('#', '');
            if (typeof (obj[nodeName]) == "undefined") {
                obj[nodeName] = this.xmlToJson(item);
            } else {
                if (typeof (obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(this.xmlToJson(item));
            }
        }
    }
    return obj;
};
Base.prototype.jqdt_paginate_process = function (paginate_param) {
    /*draw:5
     columns[0][data]:Vehicle_ID
     columns[0][name]:
     columns[0][searchable]:true
     columns[0][orderable]:true
     columns[0][search][value]:
     columns[0][search][regex]:false
     columns[1][data]:Make_Name
     columns[1][name]:
     columns[1][searchable]:true
     columns[1][orderable]:true
     columns[1][search][value]:
     columns[1][search][regex]:false
     columns[2][data]:Model_Name
     columns[2][name]:
     columns[2][searchable]:true
     columns[2][orderable]:true
     columns[2][search][value]:
     columns[2][search][regex]:false
     columns[3][data]:Variant_Name
     columns[3][name]:
     columns[3][searchable]:true
     columns[3][orderable]:true
     columns[3][search][value]:
     columns[3][search][regex]:false
     columns[4][data]:Cubic_Capacity
     columns[4][name]:
     columns[4][searchable]:true
     columns[4][orderable]:true
     columns[4][search][value]:
     columns[4][search][regex]:false
     columns[5][data]:Seating_Capacity
     columns[5][name]:
     columns[5][searchable]:true
     columns[5][orderable]:true
     columns[5][search][value]:
     columns[5][search][regex]:false
     columns[6][data]:Is_Active
     columns[6][name]:
     columns[6][searchable]:true
     columns[6][orderable]:true
     columns[6][search][value]:
     columns[6][search][regex]:false
     columns[7][data]:Fuel_Name
     columns[7][name]:
     columns[7][searchable]:true
     columns[7][orderable]:true
     columns[7][search][value]:
     columns[7][search][regex]:false
     columns[8][data]:Modified_On
     columns[8][name]:
     columns[8][searchable]:true
     columns[8][orderable]:true
     columns[8][search][value]:
     columns[8][search][regex]:false
     order[0][column]:0
     order[0][dir]:asc
     start:10
     length:10
     search[value]:
     search[regex]:false
     */
    var obj_pagination = {
        'filter': {},
        'paginate': {
            'page': 1,
            'total': 0,
            'limit': 10
        },
        'sort': []
    };
    obj_pagination['paginate']['page'] = Math.round(paginate_param['start'] / paginate_param['length']) + 1;
    obj_pagination['paginate']['limit'] = parseInt(paginate_param['length']);
    var t_key = '', t_val = '';
    for (var key in paginate_param) {

        if (key.indexOf('[data]') > -1) {
            t_key = paginate_param[key];
        }
        if (key.indexOf('[search][value]') > -1) {
            //t_val = paginate_param[key];
            t_val = isNaN(paginate_param[key]) ? paginate_param[key] : (paginate_param[key] - 0);
            if (t_val != '') {
                obj_pagination['filter'][t_key] = t_val;
            }
            t_key = t_val = '';
        }
    }
    //console.log(obj_pagination, paginate_param);
    return obj_pagination;
};
Base.prototype.round2Precision = function (number) {
    return ((Math.round(number * 100)) / 100);
};
Base.prototype.nominee_age = function (nominee_birth_date) {
    try {
        //console.log('Start', this.constructor.name, 'nominee_age');
        if (this.lm_request['nominee_birth_date'] !== '') {
            var birth_date = this.lm_request['nominee_birth_date'];
        } else {
            var birth_date = nominee_birth_date;
        }

        var today = this.todayDate();
        var age_in_year = moment(today).diff(birth_date, 'years');
        //console.log('Finish', this.constructor.name, 'nominee_age', age_in_year);
        return age_in_year;
    } catch (e) {
        console.error('Exception', 'nominee_age', e);
    }
}
Base.prototype.appointee_age = function () {
    //console.log('Start', this.constructor.name, 'appointee_age');
    var birth_date = this.lm_request['appointee_birth_date'];
    var today = this.todayDate();
    var age_in_year = moment(today).diff(birth_date, 'years');
    //console.log('Finish', this.constructor.name, 'appointee_age', age_in_year);
    return age_in_year;
}
Base.prototype.erp_cs_doc_data_prepare_NIU = function (policy_file_name, erp_cs, posp_reporting_agent_uid, obj_erp_data) {
    //console.log('erp_cs_doc_data_prepare');
    try {
        obj_erp_data['___crn___'] = obj_erp_data['___crn___'] - 0;
        var fs = require('fs');
        var policy_file_path = appRoot + "/tmp/pdf/" + policy_file_name;
        // read binary data

        if (fs.existsSync(policy_file_path)) {
            var stats = fs.statSync(policy_file_path);
            var fileSizeInBytes = stats.size;
            var fileSizeInKb = (fileSizeInBytes / 1024).toFixed(2);
            if (fileSizeInKb > 10) {
                var bitmap = fs.readFileSync(policy_file_path);
                if (bitmap != "") {
                    // convert binary data to base64 encoded string
                    var pdf_binary_data = new Buffer(bitmap).toString('base64');
                    var erp_doc = {
                        '___policy_binary_data___': pdf_binary_data,
                        '___policy_file_name___': policy_file_name,
                        '___erp_cs___': erp_cs,
                        '___posp_reporting_agent_uid___': posp_reporting_agent_uid,
                        '___pg_policy_url___': obj_erp_data['___pg_policy_url___']
                    };
                    var erp_cs_doc_xml = this.erp_request_xml_prepare(erp_doc, 'CS_DOC');
                    this.erp_process_service_call(erp_cs_doc_xml, 'CS_DOC', obj_erp_data);
                    return { "Status": 'SUCCESS', 'Msg': 'Policy push initiated' };
                }
            } else {
                var sub = '[' + (config.environment.name.toString().toUpperCase()) + ']ERR-POLICY_EMPTY-CRN : ' + obj_erp_data['___crn___'];
                var email_data = '<html><body><p>Status : Empty Policy Saved, Please upload again.<br>URL : ' + obj_erp_data['___pg_policy_url___'] + '</p></body></html>';
                var Email = require(appRoot + '/models/email');
                var objModelEmail = new Email();
                objModelEmail.send('noreply@policyboss.com', 'notifications@policyboss.com', sub, email_data, '', config.environment.notification_email, obj_erp_data['___crn___']);
                return { "Status": 'FAIL', 'Msg': 'Policy file size less than 10 KB. Please upload policy again.' };
            }
        } else {
            var sub = '[' + (config.environment.name.toString().toUpperCase()) + ']ERR-POLICY_NOT_EXIST-CRN : ' + obj_erp_data['___crn___'];
            var email_data = '<html><body><p>Status : POLICY_NOT_EXIST, Please upload again.<br>URL : ' + obj_erp_data['___pg_policy_url___'] + '</p></body></html>';
            var Email = require(appRoot + '/models/email');
            var objModelEmail = new Email();
            objModelEmail.send('noreply@policyboss.com', 'notifications@policyboss.com', sub, email_data, '', config.environment.notification_email, obj_erp_data['___crn___']);
            return { "Status": 'FAIL', 'Msg': 'Policy does not exist' };
        }
    } catch (e) {
        console.error('erp_cs_doc_data_prepare', e);
    }
}
Base.prototype.erp_cs_doc_data_prepare = function (policy_file_name, erp_cs, posp_reporting_agent_uid, obj_erp_data) {
    //console.log('erp_cs_doc_data_prepare');
    try {
        var objBase = this;
        obj_erp_data['___crn___'] = obj_erp_data['___crn___'] - 0;

        var fs = require('fs');
        var policy_file_path = appRoot + "/tmp/pdf/" + policy_file_name;
        // read binary data

        if (fs.existsSync(policy_file_path)) {
            var stats = fs.statSync(policy_file_path);
            var fileSizeInBytes = stats.size;
            var fileSizeInKb = (fileSizeInBytes / 1024).toFixed(2);
            if (fileSizeInKb > 10) {
                var bitmap = fs.readFileSync(policy_file_path);
                if (bitmap != "") {
                    // convert binary data to base64 encoded string
                    var pdf_binary_data = new Buffer(bitmap).toString('base64');
                    var erp_doc = {
                        '___policy_binary_data___': pdf_binary_data,
                        '___policy_file_name___': policy_file_name,
                        '___erp_cs___': erp_cs,
                        '___posp_reporting_agent_uid___': posp_reporting_agent_uid,
                        '___pg_policy_url___': obj_erp_data['___pg_policy_url___']
                    };
                    var erp_cs_doc_xml = this.erp_request_xml_prepare(erp_doc, 'CS_DOC');
                    this.erp_process_service_call(erp_cs_doc_xml, 'CS_DOC', obj_erp_data);
                    return { "Status": 'SUCCESS', 'Msg': 'Policy push initiated' };
                }
            } else {
                var sub = '[' + (config.environment.name.toString().toUpperCase()) + ']ERR-POLICY_EMPTY-CRN : ' + obj_erp_data['___crn___'];
                var email_data = '<html><body><p>Status : Empty Policy Saved, Please upload again.<br>URL : ' + obj_erp_data['___pg_policy_url___'] + '</p></body></html>';
                var Email = require(appRoot + '/models/email');
                var objModelEmail = new Email();
                objModelEmail.send('noreply@policyboss.com', 'notifications@policyboss.com', sub, email_data, '', config.environment.notification_email, obj_erp_data['___crn___']);
                return { "Status": 'FAIL', 'Msg': 'Policy file size less than 10 KB. Please upload policy again.' };
            }
        }
        else {
            let AWS = require('aws-sdk');
            let s3 = new AWS.S3({
                accessKeyId: config.aws.access_key,
                secretAccessKey: config.aws.secret_key
            });
            let pdf_file_name = policy_file_name;
            let params = {
                Bucket: 'horizon-policy-01012020/pdf',
                Key: pdf_file_name
            };
            let localDest = appRoot + "/tmp/temporary/" + pdf_file_name;
            s3.headObject(params, function (err, metadata) {
                try {
                    if (err && err.code === 'NotFound') {
                        //not found
                        var sub = '[' + (config.environment.name.toString().toUpperCase()) + ']ERR-POLICY_NOT_EXIST-CRN : ' + obj_erp_data['___crn___'];
                        var email_data = '<html><body><p>Status : POLICY_NOT_EXIST, Please upload again.<br>URL : ' + obj_erp_data['___pg_policy_url___'] + '</p></body></html>';
                        var Email = require(appRoot + '/models/email');
                        var objModelEmail = new Email();
                        //objModelEmail.send('noreply@policyboss.com', 'notifications@policyboss.com', sub, email_data, '', config.environment.notification_email, obj_erp_data['___crn___']);
                        return { "Status": 'FAIL', 'Msg': 'Policy does not exist in Amazon S3' };
                    } else {
                        s3.getObject(params, function (err, data) {
                            try {
                                if (err) {
                                    throw err
                                }
                                fs.writeFileSync(localDest, data.Body);

                                var erp_doc = {
                                    '___policy_binary_data___': '',
                                    '___policy_file_name___': policy_file_name,
                                    '___erp_cs___': erp_cs,
                                    '___posp_reporting_agent_uid___': posp_reporting_agent_uid,
                                    '___pg_policy_url___': obj_erp_data['___pg_policy_url___']
                                };
                                var erp_cs_doc_xml = objBase.erp_request_xml_prepare(erp_doc, 'CS_DOC');
                                objBase.erp_process_service_call(erp_cs_doc_xml, 'CS_DOC', obj_erp_data);
                                //return {"Status": 'SUCCESS', 'Msg': 'Policy push initiated from Amazon S3'};
                            } catch (e) {
                                console.error('erp_cs_doc_data_prepare', e.stack);
                                //return {"Status": 'FAIL', 'Msg': e.stack};
                            }
                        });
                    }
                } catch (e) {
                    console.error('erp_cs_doc_data_prepare', e.stack);
                    //return {"Status": 'FAIL', 'Msg': e.stack};
                }

            });
            return { "Status": 'SUCCESS', 'Msg': 'Policy push initiated from Amazon S3' };
        }
    } catch (e) {
        console.error('erp_cs_doc_data_prepare', e.stack);
        res.send(e.stack);
    }
}

Base.prototype.motor_erp_qt_data_prepare = function (type) {

    //console.log('Start', this.constructor.name, 'motor_erp_qt_data_prepare');
    var objBase = this;
    var obj_erp_data = {};
    if (type == 'QT') {
        try {
            var premium_breakup = this.get_const_premium_breakup();
            for (var k in premium_breakup) {
                if (typeof premium_breakup[k] === 'object') {
                    for (var k1 in premium_breakup[k]) {
                        obj_erp_data['___premium_breakup_' + k1 + '___'] = premium_breakup[k][k1];
                    }
                } else {
                    obj_erp_data['___premium_breakup_' + k + '___'] = premium_breakup[k];
                }
            }
            var rate_breakup = this.get_const_rate_breakup();
            for (var k in rate_breakup['own_damage']) {
                obj_erp_data['___premium_rate_' + k + '___'] = rate_breakup['own_damage'][k] || 0;
            }
            for (var k in rate_breakup['addon']) {
                obj_erp_data['___premium_rate_' + k + '___'] = rate_breakup['addon'][k] || 0;
            }
            if ((objBase.lm_request.hasOwnProperty('renewal_crn_udid') && objBase.lm_request['renewal_crn_udid'] !== '') || (objBase.lm_request.hasOwnProperty('erp_qt') && objBase.lm_request['erp_qt'] !== '')) {
                if (objBase.lm_request['erp_source'].indexOf('POSP-') > -1 || objBase.lm_request['erp_source'].indexOf('FOS-') > -1) {
                    objBase.lm_request['erp_source'] = 'THRU US ' + objBase.lm_request['erp_source'];
                }
                if (objBase.lm_request['erp_source'].indexOf('FRESH-') > -1) {
                    objBase.lm_request['erp_source'] = objBase.lm_request['erp_source'].replace('FRESH-', 'THRU US-');
                }
            }

            for (var k in this.lm_request) {
                var v;
                v = this.lm_request[k];
                obj_erp_data['___' + k + '___'] = v;
            }
            obj_erp_data['___erp_registration_no___'] = obj_erp_data['___registration_no___'].toString().replace(/\-/g, '');

            obj_erp_data['___current_date___'] = obj_erp_data.hasOwnProperty('___current_date___') ? obj_erp_data['___current_date___'] : objBase.todayDate();
            obj_erp_data['___policy_start_date___'] = obj_erp_data.hasOwnProperty('___policy_start_date___') ? obj_erp_data['___policy_start_date___'] : objBase.policy_start_date();
            obj_erp_data['___policy_end_date___'] = obj_erp_data.hasOwnProperty('___policy_end_date___') ? obj_erp_data['___policy_end_date___'] : objBase.policy_end_date();

            //for tp policy duration
            if (['1CH_4TP', '1CH_2TP', '2CH_0TP', '3CH_0TP'].indexOf(this.lm_request['vehicle_insurance_subtype']) > -1 && this.lm_request.hasOwnProperty('policy_tp_tenure')) {
                let tp_policy_inc = this.lm_request['policy_tp_tenure'] - 0;
                obj_erp_data['___tp_start_date___'] = moment(obj_erp_data['___policy_start_date___']).format("YYYY-MM-DD");
                obj_erp_data['___tp_end_date___'] = moment(obj_erp_data['___policy_start_date___']).add(tp_policy_inc, 'years').add(-1, 'days').format("YYYY-MM-DD");
            }
            //for tp policy duration

            if (this.lm_request['product_id'] === 1 || this.lm_request['product_id'] === 10) {
                var obj_policy_category = {
                    '0CH_1TP': 'PRIVATE - 1 YEAR TP',
                    '0CH_3TP': 'PRIVATE - 3 YEAR TP',
                    '0CH_5TP': 'PRIVATE - 5 Year TP',
                    '1CH_0TP': 'PRIVATE',
                    '1OD_0TP': 'PRIVATE - 1 YEAR OD',
                    '2CH_0TP': 'PRIVATE - 2 YEAR OD AND 2 YEAR TP',
                    '1CH_2TP': 'PRIVATE - 1 YEAR OD AND 3 YEAR TP',
                    '1CH_4TP': 'PRIVATE - 1 Year OD and 5 Year TP',
                    '3CH_0TP': 'PRIVATE - 3 YEAR OD AND 3 YEAR TP',
                    '5CH_0TP': 'Private - 5 Year OD and 5 Year TP'
                };
                obj_erp_data['___erp_policy_category___'] = obj_policy_category[obj_erp_data['___vehicle_insurance_subtype___']];

                obj_erp_data['___erp_business_class_name___'] = '';
                if (this.lm_request['product_id'] === 1) {
                    obj_erp_data['___erp_product_id___'] = 1;
                    obj_erp_data['___erp_product_name___'] = 'Motor';
                }
                if (this.lm_request['product_id'] === 10) {
                    obj_erp_data['___erp_product_id___'] = 11;
                    obj_erp_data['___erp_product_name___'] = 'TWO WHEELER';
                }
                if (this.lm_request['vehicle_insurance_type'] === 'new') {
                    obj_erp_data['___erp_registration_no___'] = 'APPLIEDFOR';
                }
                if (this.lm_request.hasOwnProperty('is_oslc') && this.lm_request['is_oslc'] === 'yes' && (this.insurer_master.service_logs.pb_db_master.Premium_Breakup.liability.tp_cover_outstanding_loan > 0)) {
                    obj_erp_data['___premium_breakup_outstanding_loan_premium___'] = this.insurer_master.service_logs.pb_db_master.Premium_Breakup.liability.tp_cover_outstanding_loan;
                    obj_erp_data['___premium_breakup_outstanding_loan_amount___'] = this.lm_request['oslc_si'];
                } else {
                    obj_erp_data['___premium_breakup_outstanding_loan_premium___'] = null;
                    obj_erp_data['___premium_breakup_outstanding_loan_amount___'] = null;
                }
                if (this.lm_request['vehicle_registration_type'] === 'corporate') {
                    obj_erp_data['___erp_client_type___'] = 'COMPANY';
                } else {
                    obj_erp_data['___erp_client_type___'] = 'Individual';
                }

            }
            if (this.lm_request['product_id'] === 12) {
                var obj_policy_category = {
                    '0CH_1TP': 'COMMERCIAL - 1 YEAR TP',
                    '1CH_0TP': 'COMMERCIAL'
                };
                var business_class_name = {
                    "gcv_public_otthw": 'GOODS CARRYING PUBLIC OTHER THAN 3 WHEELERS',
                    "gcv_private_otthw": 'GOODS CARRYING PRIVATE OTHER THAN 3 WHEELERS',
                    "gcv_public_thwpc": 'GOODS CARRYING PUBLIC 3 WHEELERS',
                    "gcv_private_thwpc": 'GOODS CARRYING PRIVATE 3 WHEELERS',
                    "pcv_fw_lt6pass": 'PASSANGER CARRYING NOT EXCEED 6 PAX',
                    "pcv_thw_lt6pass": 'PASSANGER CARRYING NOT EXCEED 6 PAX 3 WHEELERS',
                    "pcv_fw_gt6pass": 'PASSANGER CARRYING EXCEED 6 PAX',
                    "pcv_thw_between6to17pass": 'PASSANGER CARRYING EXCEED 6 PAX 3 WHEELER',
                    "pcv_tw": '',
                    "msc": 'MISCELLANEOUS AND SPECIAL TYPE VEHICLE'
                };
                obj_erp_data['___erp_product_id___'] = 12;
                obj_erp_data['___erp_product_name___'] = 'Motor';
                obj_erp_data['___erp_policy_category___'] = obj_policy_category[obj_erp_data['___vehicle_insurance_subtype___']];
                obj_erp_data['___erp_business_class_name___'] = business_class_name[obj_erp_data['___vehicle_sub_class___']];
                if (this.lm_request['vehicle_insurance_type'] === 'new') {
                    obj_erp_data['___erp_registration_no___'] = 'APPLIEDFOR';
                }
            }

            var obj_premium_breakup = this.insurer_master['service_logs']['pb_db_master']['Premium_Breakup'];
            if (obj_premium_breakup) {
                obj_premium_breakup['net_premium'] = this.lm_request['net_premium'];
                obj_premium_breakup['service_tax'] = this.lm_request['tax'];
                obj_premium_breakup['final_premium'] = this.lm_request['final_premium'];
                var addon_final_premium = 0;
                for (var k in obj_premium_breakup) {
                    if (typeof obj_premium_breakup[k] === 'object') {
                        for (var k1 in obj_premium_breakup[k]) {
                            if (k == 'addon' && this.lm_request.hasOwnProperty(k1 + '_amt') && (this.lm_request[k1 + '_amt'] - 0) > 0) {
                                obj_premium_breakup[k][k1] = this.lm_request[k1 + '_amt'] - 0;
                                addon_final_premium += this.lm_request[k1 + '_amt'] - 0;
                            }
                            obj_erp_data['___premium_breakup_' + k1 + '___'] = Math.round(obj_premium_breakup[k][k1]);
                        }
                    } else {
                        obj_erp_data['___premium_breakup_' + k + '___'] = Math.round(obj_premium_breakup[k]);
                    }
                }
                var other_liability = obj_erp_data['___premium_breakup_tp_cover_named_passenger_pa___'] + obj_erp_data['___premium_breakup_tp_cover_paid_driver_pa___'] + obj_erp_data['___premium_breakup_tp_cover_paid_driver_ll___'];
                obj_erp_data['___tp_other___'] = other_liability;
                obj_erp_data['___premium_breakup_addon_final_premium___'] = addon_final_premium;
            }
            obj_erp_data['___nominee_age___'] = objBase.nominee_age();
            var obj_rate_breakup = this.insurer_master['service_logs']['pb_db_master']['Premium_Rate'];
            if (obj_rate_breakup) {
                for (var k in obj_rate_breakup['own_damage']) {
                    obj_erp_data['___premium_rate_' + k + '___'] = Math.round(obj_rate_breakup['own_damage'][k]);
                }
                for (var k in obj_rate_breakup['addon']) {
                    obj_erp_data['___premium_rate_' + k + '___'] = Math.round(obj_rate_breakup['addon'][k]);
                }
            }
            if (this.lm_request['policy_od_tenure'] == '0') {
                obj_erp_data['___actual_tarrif_rate___'] = '0';
                obj_erp_data['___tarrif_rate___'] = 'TP Only';
            } else {
                obj_erp_data['___actual_tarrif_rate___'] = obj_erp_data['___premium_rate_od_disc___'];
                obj_erp_data['___tarrif_rate___'] = obj_erp_data['___premium_rate_od_disc___'];
            }

            obj_erp_data['___vehicle_manf_year___'] = this.vehicle_manf_year();
            obj_erp_data['___premium_breakup_od_after_tarrif_discount___'] = obj_erp_data['___premium_breakup_od_basic___'] - obj_erp_data['___premium_breakup_od_disc___'];
            var fuel_list = {
                'petrol': 1,
                'diesel': 2,
                'electric': 3,
                'hybrid': 4,
                'cng': 5,
                'inbuilt cng': 6,
                'lpg': 7,
                'inbuilt lpg': 8,
            };
            var contact_name = [];
            contact_name.push(this.lm_request['first_name']);
            if (this.lm_request['middle_name'] !== "") {
                contact_name.push(this.lm_request['middle_name']);
            }
            contact_name.push(this.lm_request['last_name']);
            obj_erp_data['___contact_name___'] = contact_name.join(" ");
            var address = [];
            address.push(this.lm_request['communication_address_1']);
            address.push(this.lm_request['communication_address_2']);
            address.push(this.lm_request['communication_address_3']);
            address.push(this.lm_request['communication_city']);
            address.push(this.lm_request['communication_state']);
            address.push(this.lm_request['communication_pincode']);
            obj_erp_data['___communication_address___'] = address.join(", ");
            var vehicles_master = {
                'pb_db_master': this.insurer_master['vehicles']['pb_db_master'],
                'insurer_db_master': null
            };
            for (var k in this.insurer_master['vehicles']['pb_db_master']) {
                if (['_id', 'CreatedOn', 'Is_Active', 'ModifyOn'].indexOf(k) < 0) {
                    obj_erp_data['___pb_' + k.toString().toLowerCase() + '___'] = this.insurer_master['vehicles']['pb_db_master'][k];
                }
            }
            if (this.insurer_master.hasOwnProperty('rtos') && this.insurer_master['rtos']) {
                for (var k in this.insurer_master['rtos']['pb_db_master']) {
                    if (['_id', 'CreatedOn', 'Is_Active', 'ModifyOn'].indexOf(k) < 0) {
                        obj_erp_data['___pb_' + k.toString().toLowerCase() + '___'] = this.insurer_master['rtos']['pb_db_master'][k];
                    }
                }
            }
            if (isNaN(obj_erp_data['___pb_erp_regionid___'])) {
                obj_erp_data['___pb_erp_regionid___'] = 'Mumbai';
                obj_erp_data['___pb_erp_regionname___'] = 'Mumbai';
            }
            //obj_erp_data['___pb_rto_city___'] = 'Mumbai';

            if (fuel_list.hasOwnProperty((obj_erp_data['___pb_fuel_name___']).toLowerCase())) {
                obj_erp_data['___fuel_type___'] = fuel_list[(obj_erp_data['___pb_fuel_name___']).toLowerCase()];
            } else {
                obj_erp_data['___fuel_type___'] = 1;
            }

            if (!obj_erp_data['___posp_reporting_agent_uid___']) {
                obj_erp_data['___posp_agent_city___'] = 'Mumbai';
                obj_erp_data['___posp_reporting_agent_uid___'] = '0';
            }

            if (obj_erp_data.hasOwnProperty('___lm_agent_id___') && obj_erp_data['___lm_agent_id___'] > 0) {
                if (obj_erp_data['___posp_reporting_agent_uid___'] != obj_erp_data['___lm_agent_id___']) {
                    obj_erp_data['___posp_reporting_agent_uid___'] = obj_erp_data['___lm_agent_id___'];
                    obj_erp_data['___posp_reporting_agent_name___'] = obj_erp_data['___lm_agent_name___'];
                }
            }
            if (obj_erp_data['___posp_agent_city___'] === '' || obj_erp_data['___posp_agent_city___'] === null || obj_erp_data['___posp_agent_city___'] == '0') {
                obj_erp_data['___posp_agent_city___'] = 'Mumbai';
            }


            obj_erp_data['___pb_insurer_vehicle_make_code___'] = (obj_erp_data.hasOwnProperty('___pb_make_id___')) ? obj_erp_data['___pb_make_id___'] : 100;
            obj_erp_data['___pb_insurer_vehicle_model_code___'] = obj_erp_data['___pb_model_id___'];
            obj_erp_data['___pb_insurer_vehicle_variant_code___'] = obj_erp_data['___pb_vehicle_id___'];
            obj_erp_data['___erp_posp_product___'] = 2;
            obj_erp_data['___erp_is_posp___'] = 'NONPOSP';
            let is_erp_posp = false;
            if ([1, 2, 5, 7, 9, 10, 11, 19, 33, 44, 45, 46].indexOf(this.lm_request['insurer_id'] - 0) > -1 && this.lm_request['is_posp'] == 'yes' && (this.lm_request['product_id'] == 1 || this.lm_request['product_id'] == 10 || this.lm_request['product_id'] == 12)) {
                if ([1, 2, 5, 7, 9, 10, 19, 44, 45, 46].indexOf(this.lm_request['insurer_id'] - 0) > -1) {
                    is_erp_posp = true;
                }
                if ((this.lm_request['product_id'] == 1 || this.lm_request['product_id'] == 10) && this.lm_request['insurer_id'] == 11 && this.lm_request.hasOwnProperty('posp_insurer_11') && this.lm_request['posp_insurer_11'] !== null && this.lm_request['posp_insurer_11'].toString() !== '') {
                    is_erp_posp = true;
                }
                if (this.lm_request['product_id'] == 1 && this.lm_request['insurer_id'] == 33) {
                    is_erp_posp = true;
                }
                if (is_erp_posp) {
                    obj_erp_data['___erp_posp_product___'] = 1;
                    obj_erp_data['___erp_is_posp___'] = 'POSP';
                }
            }
            var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/erp_insurer.log").toString();
            var Obj_Prev_Insurer = JSON.parse(cache_content);
            if (Obj_Prev_Insurer && Obj_Prev_Insurer.hasOwnProperty('INS_' + this.lm_request['insurer_id'])) {
                obj_erp_data['___insurerco_id___'] = Obj_Prev_Insurer['INS_' + this.lm_request['insurer_id']]['PreviousInsurer_Code'];
                obj_erp_data['___insurerco_name___'] = Obj_Prev_Insurer['INS_' + this.lm_request['insurer_id']]['InsurerName'];
            }
            if (Obj_Prev_Insurer && Obj_Prev_Insurer.hasOwnProperty('INS_' + this.lm_request['tp_insurer_id'])) {
                //obj_erp_data['___tp_insurer_id___'] = Obj_Prev_Insurer['INS_' + this.lm_request['tp_insurer_id']]['PreviousInsurer_Code'];
                obj_erp_data['___tp_insurer_name___'] = Obj_Prev_Insurer['INS_' + this.lm_request['tp_insurer_id']]['InsurerName'];
            } else {
                obj_erp_data['___tp_insurer_id___'] = "";
                obj_erp_data['___tp_insurer_name___'] = "";
            }



            //for tp policy duration
            if (['1CH_4TP', '1CH_2TP'].indexOf(this.lm_request['vehicle_insurance_subtype']) > -1) {
                obj_erp_data['___tp_insurer_id___'] = obj_erp_data['___insurerco_id___'];
                obj_erp_data['___tp_insurer_name___'] = obj_erp_data['___insurerco_name___'];
            }
            //for tp policy duration

            if (this.lm_request && this.lm_request['tp_start_date'] && this.lm_request['tp_start_date'] !== "") {
                obj_erp_data['___tp_start_date___'] = moment(this.lm_request['tp_start_date'], "DD-MM-YYYY").format("YYYY-MM-DD");
            }
            if (this.lm_request && this.lm_request['tp_end_date'] && this.lm_request['tp_end_date'] !== "") {
                obj_erp_data['___tp_end_date___'] = moment(this.lm_request['tp_end_date'], "DD-MM-YYYY").format("YYYY-MM-DD");
            }
            if (this.lm_request['vehicle_insurance_type'] === 'renew' && this.lm_request['is_breakin'] === 'yes' && this.lm_request['product_id'] === 1 && this.lm_request.hasOwnProperty('insurer_id')) {
                // for breakin already t+2 added in the policy_start_date & policy_end_date
                //we are subtracting the days from  policy_start_date & policy_end_datein both
                var const_breakin_day = {
                    5: 1,
                    33: 0
                };
                var breakinDay = const_breakin_day[this.lm_request['insurer_id'] - 0] ? const_breakin_day[this.lm_request['insurer_id'] - 0] : 0;
                if (breakinDay) {
                    obj_erp_data['___policy_start_date___'] = moment(obj_erp_data['___policy_start_date___'], "YYYY-MM-DD").subtract(breakinDay, "days").format("YYYY-MM-DD");
                    obj_erp_data['___policy_end_date___'] = moment(obj_erp_data['___policy_end_date___'], "YYYY-MM-DD").subtract(breakinDay, "days").format("YYYY-MM-DD");
                }
            }
            if ((objBase.lm_request.hasOwnProperty('ui_source') && objBase.lm_request['ui_source'] === 'quick_tw_journey') || (objBase.lm_request.hasOwnProperty('agent_source') && objBase.lm_request['agent_source'] === 'quick_tw_journey')) {
                if (objBase.lm_request.hasOwnProperty('is_tppd') && objBase.lm_request['is_tppd'] === 'yes') {
                } else {
                    obj_erp_data['___is_tppd___'] = 'no';
                    obj_erp_data['___premium_breakup_tp_final_premium___'] = obj_erp_data['___premium_breakup_tp_final_premium___'] + obj_erp_data['___premium_breakup_tp_cover_tppd___'];
                    obj_erp_data['___premium_breakup_tp_cover_tppd___'] = 0;
                }
                if (objBase.lm_request.hasOwnProperty('is_pa_od') && objBase.lm_request['is_pa_od'] === 'yes') {
                } else {
                    obj_erp_data['___is_pa_od___'] = 'no';
                    obj_erp_data['___pa_owner_driver_si___'] = 0;
                    obj_erp_data['___is_having_valid_dl___'] = 'no';
                    obj_erp_data['___is_opted_standalone_cpa___'] = 'yes';
                    obj_erp_data['___premium_breakup_tp_final_premium___'] = obj_erp_data['___premium_breakup_tp_final_premium___'] - obj_erp_data['___premium_breakup_tp_cover_owner_driver_pa___'];
                    obj_erp_data['___premium_breakup_tp_cover_owner_driver_pa___'] = 0;
                    obj_erp_data['___nominee_age___'] = 0;
                    obj_erp_data['___nominee_first_name___'] = '';
                    obj_erp_data['___nominee_last_name___'] = '';
                    obj_erp_data['___nominee_relation___'] = '';
                    obj_erp_data['___nominee_relation_text___'] = '';
                    obj_erp_data['___nominee_name___'] = '';
                    obj_erp_data['___nominee_birth_date___'] = '';
                }
                obj_erp_data['___premium_breakup_net_premium___'] = obj_erp_data['___premium_breakup_tp_final_premium___'] + obj_erp_data['___premium_breakup_od_final_premium___'] + obj_erp_data['___premium_breakup_addon_final_premium___'];
                obj_erp_data['___net_premium___'] = obj_erp_data['___premium_breakup_net_premium___'];
                obj_erp_data['___premium_breakup_service_tax___'] = Math.round(obj_erp_data['___premium_breakup_net_premium___'] * 0.18);
                obj_erp_data['___tax___'] = obj_erp_data['___premium_breakup_service_tax___'];
                obj_erp_data['___premium_breakup_final_premium___'] = obj_erp_data['___premium_breakup_net_premium___'] + obj_erp_data['___premium_breakup_service_tax___'];
                obj_erp_data['___final_premium___'] = obj_erp_data['___premium_breakup_final_premium___'];
            }
            obj_erp_data['___insurer_short_name___'] = config.const_insurer_short[this.lm_request['insurer_id']] || 'NA';
        } catch (e) {
            console.error('Exception', this.constructor.name, 'motor_erp_qt_data_prepare', e);
        }

        var ud_cond = { 'Request_Unique_Id': objBase.lm_request['search_reference_number'] };
        if (objBase.udid > 0) {
            ud_cond = { "User_Data_Id": objBase.udid - 0 };
        }
        var ObjUser_Data = {
            Erp_Qt_Request_Core: obj_erp_data,
            Processed_Request: objBase.processed_request
        };

        User_Data.update(ud_cond, { $set: ObjUser_Data }, function (err, numAffected) {
            if (err) {
                console.error('Exception', 'Erp_Qt_Request_Core', err, numAffected);
            }
        });
        /*var Client = require('node-rest-client').Client;
         var client = new Client();
         var lerp_vehicle_full = "";
         client.get('http://202.131.96.98:8041/PolicyBossRegNoService.svc/GetRegNoData?v=' + obj_erp_data['___erp_registration_no___'], function (data, response) {
         //console.log(data);
         var objVehicleResponse = data['GetRegNoDataResult'];
         if (objVehicleResponse.length > 0) {
         obj_erp_data['___is_lm_data___'] = 'yes';
         if (objVehicleResponse[0].hasOwnProperty('IsCustomer') && objVehicleResponse[0]['IsCustomer'] == 'Yes') {
         obj_erp_data['___is_lm_customer___'] = 'yes';
    }
         if (objVehicleResponse[0].hasOwnProperty('POSPCode') && objVehicleResponse[0]['POSPCode'] != '') {
         obj_erp_data['___lm_posp_code___'] = objVehicleResponse[0]['POSPCode'];
         }
         }
         
         });
         */
        //objBase.erp_process_service_call(obj_erp_data, type);

    }
    return obj_erp_data;
    //console.log('Finish', this.constructor.name, 'motor_erp_qt_data_prepare');

}
Base.prototype.health_erp_qt_data_prepare = function (type) {
    try {
        //console.log('Start', this.constructor.name, 'health_erp_qt_data_prepare');
        var objBase = this;
        var obj_erp_data = {};
        if (type == 'QT') {
            var premium_breakup = this.get_const_premium_breakup();
            for (var k in premium_breakup) {
                if (typeof premium_breakup[k] === 'object') {
                    for (var k1 in premium_breakup[k]) {
                        obj_erp_data['___premium_breakup_' + k1 + '___'] = premium_breakup[k][k1];
                    }
                } else {
                    obj_erp_data['___premium_breakup_' + k + '___'] = premium_breakup[k];
                }
            }
            for (var k in this.lm_request) {
                var v;
                if (k.indexOf('_date') > -1 && false) {
                    v = this.date_format(this.lm_request[k], 'DD-MMM-YYYY');
                } else {
                    v = this.lm_request[k];
                }
                obj_erp_data['___' + k + '___'] = v;
            }
            for (var i = 1; i <= this.lm_request['adult_count']; i++) {
                obj_erp_data['___member_' + i + '_relation___'] = objBase.get_insured_relation(i);
            }
            for (var i = 3; i <= this.lm_request['child_count'] + 2; i++) {
                obj_erp_data['___member_' + i + '_relation___'] = objBase.get_insured_relation(i);
            }
            if (obj_erp_data['___marital_text___'] !== undefined) {
                obj_erp_data['___salutation_text___'] = obj_erp_data['___gender___'] === 'F' ? ((obj_erp_data['___marital_text___']).toUpperCase() === 'MARRIED' ? 'Mrs.' : 'Miss.') : (obj_erp_data['___gender___'] === 'M' ? 'Mr.' : 'Mx');
            } else {
                obj_erp_data['___salutation_text___'] = obj_erp_data['___gender___'] === 'F' ? ((obj_erp_data['___marital___']).toUpperCase() === 'MARRIED' ? 'Mrs.' : 'Miss.') : (obj_erp_data['___gender___'] === 'M' ? 'Mr.' : 'Mx');
            }
            obj_erp_data['___current_date___'] = obj_erp_data.hasOwnProperty('___current_date___') ? obj_erp_data['___current_date___'] : objBase.todayDate();
            obj_erp_data['___policy_start_date___'] = obj_erp_data.hasOwnProperty('___policy_start_date___') ? obj_erp_data['___policy_start_date___'] : objBase.policy_start_date();
            obj_erp_data['___policy_end_date___'] = obj_erp_data.hasOwnProperty('___policy_end_date___') ? obj_erp_data['___policy_end_date___'] : objBase.policy_end_date();

            if (this.lm_request['product_id'] === 2) {
                obj_erp_data['___erp_product_id___'] = 1;
                obj_erp_data['___erp_product_name___'] = 'Health';
            }
            var obj_premium_breakup = this.insurer_master['service_logs']['pb_db_master']['Premium_Breakup'];
            if (obj_premium_breakup) {
                obj_premium_breakup['net_premium'] = this.lm_request['net_premium'];
                obj_premium_breakup['service_tax'] = this.lm_request['tax'];
                obj_premium_breakup['final_premium'] = this.lm_request['final_premium'];
                var addon_final_premium = 0;
                for (var k in obj_premium_breakup) {
                    if (typeof obj_premium_breakup[k] === 'object') {
                        for (var k1 in obj_premium_breakup[k]) {
                            obj_erp_data['___premium_breakup_' + k1 + '___'] = Math.round(obj_premium_breakup[k][k1]);
                        }
                    } else {
                        obj_erp_data['___premium_breakup_' + k + '___'] = Math.round(obj_premium_breakup[k]);
                    }
                }
                var other_liability = obj_erp_data['___premium_breakup_tp_cover_named_passenger_pa___'] + obj_erp_data['___premium_breakup_tp_cover_paid_driver_pa___'] + obj_erp_data['___premium_breakup_tp_cover_paid_driver_ll___'];
                obj_erp_data['___tp_other___'] = other_liability;
                obj_erp_data['___premium_breakup_addon_final_premium___'] = addon_final_premium;
            }
            obj_erp_data['___nominee_age___'] = objBase.nominee_age();
            var contact_name = [];
            contact_name.push(this.lm_request['first_name']);
            if (this.lm_request['middle_name'] !== "") {
                contact_name.push(this.lm_request['middle_name']);
            }
            contact_name.push(this.lm_request['last_name']);
            obj_erp_data['___contact_name___'] = contact_name.join(" ");
            var address = [];
            address.push(this.lm_request['communication_address_1']);
            address.push(this.lm_request['communication_address_2']);
            address.push(this.lm_request['communication_address_3']);
            address.push(this.lm_request['communication_city']);
            address.push(this.lm_request['communication_state']);
            address.push(this.lm_request['communication_pincode']);
            obj_erp_data['___communication_address___'] = this.lm_request['communication_state'];
            obj_erp_data['___communication_address___'] = this.lm_request['communication_state'];
            obj_erp_data['___elite_flag___'] = this.lm_request['topup_applied'] === true ? 1 : 0;
            try {
                obj_erp_data['___remarks___'] = this.lm_request['topup_applied'] === true ? this.insurer_master['elite']['pb_db_master'] : '';
            } catch (e) {
                obj_erp_data['___remarks___'] = "";
                //console.error(e.stack);
            }
            if (isNaN(obj_erp_data['___pb_erp_regionid___'])) {
                obj_erp_data['___pb_erp_regionid___'] = 'Mumbai';
                obj_erp_data['___pb_erp_regionname___'] = 'Mumbai';
            }
            if (!obj_erp_data['___posp_reporting_agent_uid___']) {
                obj_erp_data['___posp_agent_city___'] = 'Mumbai';
                obj_erp_data['___posp_reporting_agent_uid___'] = '0';
            }
            if (obj_erp_data.hasOwnProperty('___lm_agent_id___') && obj_erp_data['___lm_agent_id___'] > 0) {
                if (obj_erp_data['___posp_reporting_agent_uid___'] != obj_erp_data['___lm_agent_id___']) {
                    obj_erp_data['___posp_reporting_agent_uid___'] = obj_erp_data['___lm_agent_id___'];
                    obj_erp_data['___posp_reporting_agent_name___'] = obj_erp_data['___lm_agent_name___'];
                }
            }

            if (obj_erp_data['___posp_agent_city___'] == '') {
                obj_erp_data['___posp_agent_city___'] = 'Mumbai';
            }


            //reliance,sompo,cigna,digit,edelweiss,hdfc
            if ([9, 19, 38, 44, 46, 5].indexOf(this.lm_request['insurer_id'] - 0) > -1 && this.lm_request['is_posp'] === 'yes' && this.lm_request['health_insurance_si'] < 500001) {
                obj_erp_data['___erp_posp_product___'] = 1;
                obj_erp_data['___erp_is_posp___'] = 'POSP';
            } else {
                obj_erp_data['___erp_posp_product___'] = 2;
                obj_erp_data['___erp_is_posp___'] = 'NONPOSP';
            }


            var Insurerco_ID = require('../models/prev_insurer');
            Insurerco_ID.findOne({
                "Insurer_ID": 101,
                "PreviousInsurer_Id": this.lm_request['insurer_id']
            }, function (insurer_err, dbPrev_Insurer) {
                if (dbPrev_Insurer) {
                    obj_erp_data['___insurerco_id___'] = dbPrev_Insurer._doc['PreviousInsurer_Code'];
                    obj_erp_data['___insurerco_name___'] = dbPrev_Insurer._doc['InsurerName'];
                }

                User_Data.findOne({ "Request_Unique_Id": objBase.lm_request['search_reference_number'] }, function (err, dbUserData) {
                    if (err) {

                    } else {
                        if (dbUserData) {
                            var erp_ops_type = type;
                            var ObjUser_Data = {
                                Erp_Qt_Request_Core: obj_erp_data,
                                Processed_Request: objBase.processed_request
                            };
                            if (ObjUser_Data) {

                                User_Data.update({ 'User_Data_Id': dbUserData._doc['User_Data_Id'] }, ObjUser_Data, function (err, numAffected) {
                                    //console.error('UserDataCRNUpdate', erp_ops_type, err, numAffected);
                                });
                            }
                        }
                    }
                });
            });
            var businessClass = require('../resource/request_file/BusinessClass.json');
            var objKey = 'Insurer_Id_' + this.lm_request['insurer_id'];
            var productPlanId = this.prepared_request.dbmaster_pb_plan_id ? (this.prepared_request['dbmaster_pb_plan_id']).toString() : "63"; // for Niva Bupa
            var insuranceType = obj_erp_data['___health_insurance_type___'] = (productPlanId === "16079" ? "Hospital Cash" : this.lm_request['health_insurance_type']);
            if (businessClass.hasOwnProperty(objKey)) {
                var obj = businessClass[objKey];
                //              //console.log(obj);
                for (var i = 0; i < obj.length; i++) {
                    if (obj[i]['ProductPlan_Id'] === productPlanId && obj[i]['Category'] === insuranceType) {
                        obj_erp_data['___erp_plan_name___'] = obj[i]['BusinessClass'];
                    }
                }
            }
        }
        return obj_erp_data;
        //console.log('Finish', this.constructor.name, 'motor_erp_qt_data_prepare');
    } catch (e) {
        console.error('Exception', this.constructor.name, 'health_erp_qt_data_prepare', e);
    }
};
Base.prototype.personal_accident_erp_qt_data_prepare = function (type) {
    try {
        //console.log('Start', this.constructor.name, 'personal_accident_erp_qt_data_prepare');
        var objBase = this;
        var obj_erp_data = {};
        if (type == 'QT') {
            var premium_breakup = this.get_const_premium_breakup();
            for (var k in premium_breakup) {
                if (typeof premium_breakup[k] === 'object') {
                    for (var k1 in premium_breakup[k]) {
                        obj_erp_data['___premium_breakup_' + k1 + '___'] = premium_breakup[k][k1];
                    }
                } else {
                    obj_erp_data['___premium_breakup_' + k + '___'] = premium_breakup[k];
                }
            }
            for (var k in this.lm_request) {
                var v;
                if (k.indexOf('_date') > -1 && false) {
                    v = this.date_format(this.lm_request[k], 'DD-MMM-YYYY');
                } else {
                    v = this.lm_request[k];
                }
                obj_erp_data['___' + k + '___'] = v;
            }
            for (var i = 1; i <= this.lm_request['adult_count']; i++) {
                obj_erp_data['___member_' + i + '_relation___'] = objBase.get_insured_relation(i);
            }
            for (var i = 3; i <= this.lm_request['child_count'] + 2; i++) {
                obj_erp_data['___member_' + i + '_relation___'] = objBase.get_insured_relation(i);
            }
            if (obj_erp_data['___marital_text___'] !== undefined) {
                obj_erp_data['___salutation_text___'] = obj_erp_data['___gender___'] === 'F' ? ((obj_erp_data['___marital_text___']).toUpperCase() === 'MARRIED' ? 'Mrs.' : 'Miss.') : (obj_erp_data['___gender___'] === 'M' ? 'Mr.' : 'Mx');
            } else {
                obj_erp_data['___salutation_text___'] = obj_erp_data['___gender___'] === 'F' ? ((obj_erp_data['___marital___']).toUpperCase() === 'MARRIED' ? 'Mrs.' : 'Miss.') : (obj_erp_data['___gender___'] === 'M' ? 'Mr.' : 'Mx');
            }
            obj_erp_data['___current_date___'] = obj_erp_data.hasOwnProperty('___current_date___') ? obj_erp_data['___current_date___'] : objBase.todayDate();
            obj_erp_data['___policy_start_date___'] = obj_erp_data.hasOwnProperty('___policy_start_date___') ? obj_erp_data['___policy_start_date___'] : objBase.policy_start_date();
            obj_erp_data['___policy_end_date___'] = obj_erp_data.hasOwnProperty('___policy_end_date___') ? obj_erp_data['___policy_end_date___'] : objBase.policy_end_date();

            if (this.lm_request['product_id'] === 8) {
                obj_erp_data['___erp_product_id___'] = 8;
                obj_erp_data['___erp_product_name___'] = 'P A';
            }
            var obj_premium_breakup = this.insurer_master['service_logs']['pb_db_master']['Premium_Breakup'];
            if (obj_premium_breakup) {
                obj_premium_breakup['net_premium'] = this.lm_request['net_premium'];
                obj_premium_breakup['service_tax'] = this.lm_request['tax'];
                obj_premium_breakup['final_premium'] = this.lm_request['final_premium'];
                var addon_final_premium = 0;
                for (var k in obj_premium_breakup) {
                    if (typeof obj_premium_breakup[k] === 'object') {
                        for (var k1 in obj_premium_breakup[k]) {
                            obj_erp_data['___premium_breakup_' + k1 + '___'] = Math.round(obj_premium_breakup[k][k1]);
                        }
                    } else {
                        obj_erp_data['___premium_breakup_' + k + '___'] = Math.round(obj_premium_breakup[k]);
                        obj_erp_data['___pa_insurance_si___'] = obj_premium_breakup['pa_insurance_si'];
                    }
                }
                var other_liability = obj_erp_data['___premium_breakup_tp_cover_named_passenger_pa___'] + obj_erp_data['___premium_breakup_tp_cover_paid_driver_pa___'] + obj_erp_data['___premium_breakup_tp_cover_paid_driver_ll___'];
                obj_erp_data['___tp_other___'] = other_liability;
                obj_erp_data['___premium_breakup_addon_final_premium___'] = addon_final_premium;
            }
            obj_erp_data['___nominee_age___'] = objBase.nominee_age();
            var contact_name = [];
            contact_name.push(this.lm_request['first_name']);
            if (this.lm_request['middle_name'] !== "") {
                contact_name.push(this.lm_request['middle_name']);
            }
            contact_name.push(this.lm_request['last_name']);
            obj_erp_data['___contact_name___'] = contact_name.join(" ");
            var address = [];
            address.push(this.lm_request['communication_address_1']);
            address.push(this.lm_request['communication_address_2']);
            address.push(this.lm_request['communication_address_3']);
            address.push(this.lm_request['communication_city']);
            address.push(this.lm_request['communication_state']);
            address.push(this.lm_request['communication_pincode']);
            obj_erp_data['___communication_address___'] = this.lm_request['communication_state'];
            obj_erp_data['___communication_address___'] = this.lm_request['communication_state'];
            obj_erp_data['___elite_flag___'] = this.lm_request['topup_applied'] === true ? 1 : 0;
            obj_erp_data['___remarks___'] = this.lm_request['topup_applied'] === true ? this.insurer_master['elite']['pb_db_master'] : '';
            if (isNaN(obj_erp_data['___pb_erp_regionid___'])) {
                obj_erp_data['___pb_erp_regionid___'] = 'Mumbai';
                obj_erp_data['___pb_erp_regionname___'] = 'Mumbai';
            }
            if (!obj_erp_data['___posp_reporting_agent_uid___']) {
                obj_erp_data['___posp_agent_city___'] = 'Mumbai';
                obj_erp_data['___posp_reporting_agent_uid___'] = '0';
            }
            if (obj_erp_data.hasOwnProperty('___lm_agent_id___') && obj_erp_data['___lm_agent_id___'] > 0) {
                if (obj_erp_data['___posp_reporting_agent_uid___'] != obj_erp_data['___lm_agent_id___']) {
                    obj_erp_data['___posp_reporting_agent_uid___'] = obj_erp_data['___lm_agent_id___'];
                    obj_erp_data['___posp_reporting_agent_name___'] = obj_erp_data['___lm_agent_name___'];
                }
            }

            if (obj_erp_data['___posp_agent_city___'] == '') {
                obj_erp_data['___posp_agent_city___'] = 'Mumbai';
            }


            /*//reliance,sompo,cigna,digit,edelweiss
            if ([9, 19, 38, 44, 46].indexOf(this.lm_request['insurer_id'] - 0) > -1 && this.lm_request['is_posp'] === 'yes' && this.lm_request['health_insurance_si'] < 500000) {
                obj_erp_data['___erp_posp_product___'] = 1;
                obj_erp_data['___erp_is_posp___'] = 'POSP';
            } else {
                obj_erp_data['___erp_posp_product___'] = 2;
                obj_erp_data['___erp_is_posp___'] = 'NONPOSP';
            }*/

            var Insurerco_ID = require('../models/prev_insurer');
            Insurerco_ID.findOne({
                "Insurer_ID": 101,
                "PreviousInsurer_Id": this.lm_request['insurer_id']
            }, function (insurer_err, dbPrev_Insurer) {
                if (dbPrev_Insurer) {
                    obj_erp_data['___insurerco_id___'] = dbPrev_Insurer._doc['PreviousInsurer_Code'];
                    obj_erp_data['___insurerco_name___'] = dbPrev_Insurer._doc['InsurerName'];
                }

                User_Data.findOne({ "Request_Unique_Id": objBase.lm_request['search_reference_number'] }, function (err, dbUserData) {
                    if (err) {

                    } else {
                        if (dbUserData) {
                            var erp_ops_type = type;
                            var ObjUser_Data = {
                                Erp_Qt_Request_Core: obj_erp_data,
                                Processed_Request: objBase.processed_request
                            };
                            if (ObjUser_Data) {

                                User_Data.update({ 'User_Data_Id': dbUserData._doc['User_Data_Id'] }, ObjUser_Data, function (err, numAffected) {
                                    //console.error('UserDataCRNUpdate', erp_ops_type, err, numAffected);
                                });
                            }
                        }
                    }
                });
            });
            var businessClass = require('../resource/request_file/PersonalAccidentBusinessClass.json');
            var objKey = 'Insurer_Id_' + this.lm_request['insurer_id'];
            var productPlanId = (this.prepared_request['dbmaster_pb_plan_id']).toString();
            var insuranceType = obj_erp_data['___health_insurance_type___'] = (productPlanId === "16079" ? "Hospital Cash" : this.lm_request['health_insurance_type']);
            if (businessClass.hasOwnProperty(objKey)) {
                var obj = businessClass[objKey];
                //              //console.log(obj);
                for (var i = 0; i < obj.length; i++) {
                    if (obj[i]['ProductPlan_Id'] === productPlanId && obj[i]['Category'] === insuranceType) {
                        obj_erp_data['___erp_plan_name___'] = obj[i]['BusinessClass'];
                    }
                }
            }
        }
        //console.log('Finish', this.constructor.name, 'motor_erp_qt_data_prepare');
    } catch (e) {
        console.error('Exception', this.constructor.name, 'personal_accident_erp_qt_data_prepare', e);
    }
};
Base.prototype.workmen_erp_qt_data_prepare = function (type) {
    try {
        //console.log('Start', this.constructor.name, 'personal_accident_erp_qt_data_prepare');
        var objBase = this;
        var obj_erp_data = {};
        if (type == 'QT') {
            var premium_breakup = this.get_const_premium_breakup();
            for (var k in premium_breakup) {
                if (typeof premium_breakup[k] === 'object') {
                    for (var k1 in premium_breakup[k]) {
                        obj_erp_data['___premium_breakup_' + k1 + '___'] = premium_breakup[k][k1];
                    }
                } else {
                    obj_erp_data['___premium_breakup_' + k + '___'] = premium_breakup[k];
                }
            }
            for (var k in this.lm_request) {
                var v;
                if (k.indexOf('_date') > -1 && false) {
                    v = this.date_format(this.lm_request[k], 'DD-MMM-YYYY');
                } else {
                    v = this.lm_request[k];
                }
                obj_erp_data['___' + k + '___'] = v;
            }
            for (var i = 1; i <= this.lm_request['adult_count']; i++) {
                obj_erp_data['___member_' + i + '_relation___'] = objBase.get_insured_relation(i);
            }
            for (var i = 3; i <= this.lm_request['child_count'] + 2; i++) {
                obj_erp_data['___member_' + i + '_relation___'] = objBase.get_insured_relation(i);
            }
            if (obj_erp_data['___marital_text___'] !== undefined) {
                obj_erp_data['___salutation_text___'] = obj_erp_data['___gender___'] === 'F' ? ((obj_erp_data['___marital_text___']).toUpperCase() === 'MARRIED' ? 'Mrs.' : 'Miss.') : (obj_erp_data['___gender___'] === 'M' ? 'Mr.' : 'Mx');
            } else {
                obj_erp_data['___salutation_text___'] = obj_erp_data['___gender___'] === 'F' ? ((obj_erp_data['___marital___']).toUpperCase() === 'MARRIED' ? 'Mrs.' : 'Miss.') : (obj_erp_data['___gender___'] === 'M' ? 'Mr.' : 'Mx');
            }
            obj_erp_data['___current_date___'] = obj_erp_data.hasOwnProperty('___current_date___') ? obj_erp_data['___current_date___'] : objBase.todayDate();
            obj_erp_data['___policy_start_date___'] = obj_erp_data.hasOwnProperty('___policy_start_date___') ? obj_erp_data['___policy_start_date___'] : objBase.policy_start_date();
            obj_erp_data['___policy_end_date___'] = obj_erp_data.hasOwnProperty('___policy_end_date___') ? obj_erp_data['___policy_end_date___'] : objBase.policy_end_date();

            if (this.lm_request['product_id'] === 8) {
                obj_erp_data['___erp_product_id___'] = 8;
                obj_erp_data['___erp_product_name___'] = 'WC';
            }
            var obj_premium_breakup = this.insurer_master['service_logs']['pb_db_master']['Premium_Breakup'];
            if (obj_premium_breakup) {
                obj_premium_breakup['net_premium'] = this.lm_request['net_premium'];
                obj_premium_breakup['service_tax'] = this.lm_request['tax'];
                obj_premium_breakup['final_premium'] = this.lm_request['final_premium'];
                var addon_final_premium = 0;
                for (var k in obj_premium_breakup) {
                    if (typeof obj_premium_breakup[k] === 'object') {
                        for (var k1 in obj_premium_breakup[k]) {
                            obj_erp_data['___premium_breakup_' + k1 + '___'] = Math.round(obj_premium_breakup[k][k1]);
                        }
                    } else {
                        obj_erp_data['___premium_breakup_' + k + '___'] = Math.round(obj_premium_breakup[k]);
                        obj_erp_data['___pa_insurance_si___'] = obj_premium_breakup['pa_insurance_si'];
                    }
                }
                var other_liability = obj_erp_data['___premium_breakup_tp_cover_named_passenger_pa___'] + obj_erp_data['___premium_breakup_tp_cover_paid_driver_pa___'] + obj_erp_data['___premium_breakup_tp_cover_paid_driver_ll___'];
                obj_erp_data['___tp_other___'] = other_liability;
                obj_erp_data['___premium_breakup_addon_final_premium___'] = addon_final_premium;
            }
            obj_erp_data['___nominee_age___'] = objBase.nominee_age();
            var contact_name = [];
            contact_name.push(this.lm_request['first_name']);
            if (this.lm_request['middle_name'] !== "") {
                contact_name.push(this.lm_request['middle_name']);
            }
            contact_name.push(this.lm_request['last_name']);
            obj_erp_data['___contact_name___'] = contact_name.join(" ");
            var address = [];
            address.push(this.lm_request['communication_address_1']);
            address.push(this.lm_request['communication_address_2']);
            address.push(this.lm_request['communication_address_3']);
            address.push(this.lm_request['communication_city']);
            address.push(this.lm_request['communication_state']);
            address.push(this.lm_request['communication_pincode']);
            obj_erp_data['___communication_address___'] = this.lm_request['communication_state'];
            obj_erp_data['___communication_address___'] = this.lm_request['communication_state'];
            //            obj_erp_data['___elite_flag___'] = this.lm_request['topup_applied'] === true ? 1 : 0;
            obj_erp_data['___remarks___'] = this.lm_request['topup_applied'] === true ? this.insurer_master['elite']['pb_db_master'] : '';
            if (isNaN(obj_erp_data['___pb_erp_regionid___'])) {
                obj_erp_data['___pb_erp_regionid___'] = 'Mumbai';
                obj_erp_data['___pb_erp_regionname___'] = 'Mumbai';
            }
            if (!obj_erp_data['___posp_reporting_agent_uid___']) {
                obj_erp_data['___posp_agent_city___'] = 'Mumbai';
                obj_erp_data['___posp_reporting_agent_uid___'] = '0';
            }
            if (obj_erp_data.hasOwnProperty('___lm_agent_id___') && obj_erp_data['___lm_agent_id___'] > 0) {
                if (obj_erp_data['___posp_reporting_agent_uid___'] != obj_erp_data['___lm_agent_id___']) {
                    obj_erp_data['___posp_reporting_agent_uid___'] = obj_erp_data['___lm_agent_id___'];
                    obj_erp_data['___posp_reporting_agent_name___'] = obj_erp_data['___lm_agent_name___'];
                }
            }

            if (obj_erp_data['___posp_agent_city___'] == '') {
                obj_erp_data['___posp_agent_city___'] = 'Mumbai';
            }
            var Insurerco_ID = require('../models/prev_insurer');
            Insurerco_ID.findOne({
                "Insurer_ID": 101,
                "PreviousInsurer_Id": this.lm_request['insurer_id']
            }, function (insurer_err, dbPrev_Insurer) {
                if (dbPrev_Insurer) {
                    obj_erp_data['___insurerco_id___'] = dbPrev_Insurer._doc['PreviousInsurer_Code'];
                    obj_erp_data['___insurerco_name___'] = dbPrev_Insurer._doc['InsurerName'];
                }

                User_Data.findOne({ "Request_Unique_Id": objBase.lm_request['search_reference_number'] }, function (err, dbUserData) {
                    if (err) {

                    } else {
                        if (dbUserData) {
                            var erp_ops_type = type;
                            var ObjUser_Data = {
                                Erp_Qt_Request_Core: obj_erp_data,
                                Processed_Request: objBase.processed_request
                            };
                            if (ObjUser_Data) {

                                User_Data.update({ 'User_Data_Id': dbUserData._doc['User_Data_Id'] }, ObjUser_Data, function (err, numAffected) {
                                    //console.error('UserDataCRNUpdate', erp_ops_type, err, numAffected);
                                });
                            }
                        }
                    }
                });
            });
            //            var businessClass = require('../resource/request_file/PersonalAccidentBusinessClass.json');
            //            var objKey = 'Insurer_Id_' + this.lm_request['insurer_id'];
            //            var productPlanId = (this.prepared_request['dbmaster_pb_plan_id']).toString();
            //            var insuranceType = obj_erp_data['___health_insurance_type___'] = (productPlanId === "16079" ? "Hospital Cash" : this.lm_request['health_insurance_type']);
            //            if (businessClass.hasOwnProperty(objKey)) {
            //                var obj = businessClass[objKey];
            //                for (var i = 0; i < obj.length; i++) {
            //                    if (obj[i]['ProductPlan_Id'] === productPlanId && obj[i]['Category'] === insuranceType) {
            //                        obj_erp_data['___erp_plan_name___'] = obj[i]['BusinessClass'];
            //                    }
            //                }
            //            }
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'personal_accident_erp_qt_data_prepare', e);
    }
};
Base.prototype.cyber_erp_qt_data_prepare = function (type) {
    try {
        console.log('Start', this.constructor.name, 'cyber_erp_qt_data_prepare');
        var objBase = this;
        var obj_erp_data = {};
        if (type === 'QT') {
            var premium_breakup = this.get_const_premium_breakup();
            for (var k in premium_breakup) {
                if (typeof premium_breakup[k] === 'object') {
                    for (var k1 in premium_breakup[k]) {
                        obj_erp_data['___premium_breakup_' + k1 + '___'] = premium_breakup[k][k1];
                    }
                } else {
                    obj_erp_data['___premium_breakup_' + k + '___'] = premium_breakup[k];
                }
            }
            for (var k in this.lm_request) {
                var v;
                if (k.indexOf('_date') > -1 && false) {
                    v = this.date_format(this.lm_request[k], 'DD-MMM-YYYY');
                } else {
                    v = this.lm_request[k];
                }
                obj_erp_data['___' + k + '___'] = v;
            }
            obj_erp_data['___current_date___'] = objBase.todayDate();
            obj_erp_data['___policy_start_date___'] = objBase.policy_start_date();
            obj_erp_data['___policy_end_date___'] = objBase.policy_end_date();
            if (this.lm_request['product_id'] === 18) {
                obj_erp_data['___erp_product_id___'] = 3;
                obj_erp_data['___erp_product_name___'] = 'NON MOTOR';
                obj_erp_data['___erp_plan_name___'] = "E@Secure";
            }
            var obj_premium_breakup = this.insurer_master['service_logs']['pb_db_master']['Premium_Breakup'];
            if (obj_premium_breakup) {
                obj_premium_breakup['net_premium'] = this.lm_request['net_premium'];
                obj_premium_breakup['service_tax'] = this.lm_request['service_tax'];
                obj_premium_breakup['final_premium'] = this.lm_request['final_premium'];
                var addon_final_premium = 0;
                for (var k in obj_premium_breakup) {
                    if (typeof obj_premium_breakup[k] === 'object') {
                        for (var k1 in obj_premium_breakup[k]) {
                            obj_erp_data['___premium_breakup_' + k1 + '___'] = Math.round(obj_premium_breakup[k][k1]);
                        }
                    } else {
                        obj_erp_data['___premium_breakup_' + k + '___'] = Math.round(obj_premium_breakup[k]);
                    }
                }
            }
            //            obj_erp_data['___nominee_age___'] = objBase.nominee_age();
            //            var contact_name = [];
            //            contact_name.push(this.lm_request['first_name']);
            //            if (this.lm_request['middle_name'] !== "") {
            //                contact_name.push(this.lm_request['middle_name']);
            //            }
            //            contact_name.push(this.lm_request['last_name']);
            obj_erp_data['___contact_name___'] = this.lm_request['contact_name'];//contact_name.join(" ");
            var address = [];
            address.push(this.lm_request['permanent_address_1']);
            address.push(this.lm_request['permanent_address_2']);
            address.push(this.lm_request['permanent_address_3']);
            address.push(this.lm_request['city']);
            address.push(this.lm_request['state']);
            address.push(this.lm_request['communication_pincode']);
            obj_erp_data['___communication_address___'] = this.lm_request['state'];
            if (isNaN(obj_erp_data['___pb_erp_regionid___'])) {
                obj_erp_data['___pb_erp_regionid___'] = 'Mumbai';
                obj_erp_data['___pb_erp_regionname___'] = 'Mumbai';
            }
            if (!obj_erp_data['___posp_reporting_agent_uid___']) {
                obj_erp_data['___posp_agent_city___'] = 'Mumbai';
                obj_erp_data['___posp_reporting_agent_uid___'] = '0';
            }
            if (obj_erp_data.hasOwnProperty('___lm_agent_id___') && obj_erp_data['___lm_agent_id___'] > 0) {
                if (obj_erp_data['___posp_reporting_agent_uid___'] !== obj_erp_data['___lm_agent_id___']) {
                    obj_erp_data['___posp_reporting_agent_uid___'] = obj_erp_data['___lm_agent_id___'];
                    obj_erp_data['___posp_reporting_agent_name___'] = obj_erp_data['___lm_agent_name___'];
                }
            }

            if (obj_erp_data['___posp_agent_city___'] === '') {
                obj_erp_data['___posp_agent_city___'] = 'Mumbai';
            }

            var Insurerco_ID = require('../models/prev_insurer');
            Insurerco_ID.findOne({
                "Insurer_ID": 101,
                "PreviousInsurer_Id": this.lm_request['insurer_id']
            }, function (insurer_err, dbPrev_Insurer) {
                if (dbPrev_Insurer) {
                    obj_erp_data['___insurerco_id___'] = dbPrev_Insurer._doc['PreviousInsurer_Code'];
                    obj_erp_data['___insurerco_name___'] = dbPrev_Insurer._doc['InsurerName'];
                }

                User_Data.findOne({ "Request_Unique_Id": objBase.lm_request['search_reference_number'] }, function (err, dbUserData) {
                    if (err) {

                    } else {
                        if (dbUserData) {
                            var erp_ops_type = type;
                            var ObjUser_Data = {
                                Erp_Qt_Request_Core: obj_erp_data,
                                Processed_Request: objBase.processed_request
                            };
                            if (ObjUser_Data) {

                                User_Data.update({ 'User_Data_Id': dbUserData._doc['User_Data_Id'] }, ObjUser_Data, function (err, numAffected) {
                                    //console.error('UserDataCRNUpdate', erp_ops_type, err, numAffected);
                                });
                            }
                        }
                    }
                });
            });
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'cyber_erp_qt_data_prepare', e);
    }
};
Base.prototype.travel_erp_qt_data_prepare = function (type) {
    try {
        console.log('Start', this.constructor.name, 'travel_erp_qt_data_prepare');
        var objBase = this;
        var obj_erp_data = {};
        if (type === 'QT') {
            for (var k in this.lm_request) {
                obj_erp_data['___' + k + '___'] = this.lm_request[k];
            }
            var premium_breakup = this.get_const_premium_breakup();
            for (var k in premium_breakup) {
                if (typeof premium_breakup[k] === 'object') {
                    for (var k1 in premium_breakup[k]) {
                        obj_erp_data['___premium_breakup_' + k1 + '___'] = premium_breakup[k][k1];
                    }
                } else {
                    obj_erp_data['___premium_breakup_' + k + '___'] = premium_breakup[k];
                }
            }

            obj_erp_data['___salutation_text___'] = obj_erp_data['___gender___'] === 'F' ? 'Miss.' : 'Mr.';
            obj_erp_data['___current_date___'] = objBase.todayDate();
            obj_erp_data['___policy_start_date___'] = objBase.policy_start_date();
            obj_erp_data['___policy_end_date___'] = objBase.policy_end_date();
            obj_erp_data['___trip_type___'] = (this.lm_request['trip_type'] == "SINGLE") ? 1 : 2;
            if (this.lm_request['travelling_to_area'] === "WorldWide") {
                obj_erp_data['___hasUSCanada___'] = 1;
                obj_erp_data['___travel_destination___'] = "WorldWide Including US/Canada";
            } else {
                obj_erp_data['___hasUSCanada___'] = 0;
                obj_erp_data['___travel_destination___'] = this.lm_request['travelling_to_area'] === "WorldWide" ? "WorldWide Excluding US/Canada" : this.lm_request['travelling_to_area'];
            }
            if (this.lm_request['product_id'] === 4) {
                obj_erp_data['___erp_product_id___'] = 12;
                obj_erp_data['___erp_product_name___'] = 'TRAVEL';
            }
            var obj_premium_breakup = this.insurer_master['service_logs']['pb_db_master']['Premium_Breakup'];
            if (obj_premium_breakup) {
                obj_premium_breakup['net_premium'] = this.lm_request['net_premium'];
                obj_premium_breakup['service_tax'] = this.lm_request['service_tax'];
                obj_premium_breakup['final_premium'] = this.lm_request['final_premium'];
                for (var k in obj_premium_breakup) {
                    if (typeof obj_premium_breakup[k] === 'object') {
                        for (var k1 in obj_premium_breakup[k]) {
                            obj_erp_data['___premium_breakup_' + k1 + '___'] = Math.round(obj_premium_breakup[k][k1]);
                        }
                    } else {
                        obj_erp_data['___premium_breakup_' + k + '___'] = Math.round(obj_premium_breakup[k]);
                        obj_erp_data['___travel_insurance_si___'] = obj_premium_breakup['travel_insurance_si'];
                    }
                }
            }
            obj_erp_data['___contact_name___'] = this.lm_request['contact_name'];
            var address = [];
            address.push(this.lm_request['permanent_address_1']);
            address.push(this.lm_request['permanent_address_2']);
            address.push(this.lm_request['permanent_address_3']);
            address.push(this.lm_request['city']);
            address.push(this.lm_request['state']);
            address.push(this.lm_request['permamnent_pincode']);
            obj_erp_data['___communication_address___'] = this.lm_request['state'];
            if (isNaN(obj_erp_data['___pb_erp_regionid___'])) {
                obj_erp_data['___pb_erp_regionid___'] = 'Mumbai';
                obj_erp_data['___pb_erp_regionname___'] = 'Mumbai';
            }
            if (!obj_erp_data['___posp_reporting_agent_uid___']) {
                obj_erp_data['___posp_agent_city___'] = 'Mumbai';
                obj_erp_data['___posp_reporting_agent_uid___'] = '0';
            }
            if (obj_erp_data.hasOwnProperty('___lm_agent_id___') && obj_erp_data['___lm_agent_id___'] > 0) {
                if (obj_erp_data['___posp_reporting_agent_uid___'] !== obj_erp_data['___lm_agent_id___']) {
                    obj_erp_data['___posp_reporting_agent_uid___'] = obj_erp_data['___lm_agent_id___'];
                    obj_erp_data['___posp_reporting_agent_name___'] = obj_erp_data['___lm_agent_name___'];
                }
            }

            if (obj_erp_data['___posp_agent_city___'] === '') {
                obj_erp_data['___posp_agent_city___'] = 'Mumbai';
            }
            if (this.lm_request['is_posp'] === 'yes') {
                obj_erp_data['___erp_posp_product___'] = 2;
                obj_erp_data['___erp_is_posp___'] = 'POSP';
            } else {
                obj_erp_data['___erp_posp_product___'] = 2;
                obj_erp_data['___erp_is_posp___'] = 'NONPOSP';
            }

            var Insurerco_ID = require('../models/prev_insurer');
            Insurerco_ID.findOne({
                "Insurer_ID": 101,
                "PreviousInsurer_Id": this.lm_request['insurer_id']
            }, function (insurer_err, dbPrev_Insurer) {
                if (dbPrev_Insurer) {
                    obj_erp_data['___insurerco_id___'] = dbPrev_Insurer._doc['PreviousInsurer_Code'];
                    obj_erp_data['___insurerco_name___'] = dbPrev_Insurer._doc['InsurerName'];
                }

                User_Data.findOne({ "Request_Unique_Id": objBase.lm_request['search_reference_number'] }, function (err, dbUserData) {
                    if (err) {

                    } else {
                        if (dbUserData) {
                            var erp_ops_type = type;
                            var ObjUser_Data = {
                                Erp_Qt_Request_Core: obj_erp_data,
                                Processed_Request: objBase.processed_request
                            };
                            if (ObjUser_Data) {

                                User_Data.update({ 'User_Data_Id': dbUserData._doc['User_Data_Id'] }, ObjUser_Data, function (err, numAffected) {
                                    //console.error('UserDataCRNUpdate', erp_ops_type, err, numAffected);
                                });
                            }
                        }
                    }
                });
            });
            //            var businessClass = require('../resource/request_file/TravelBusinessClass.json');
            //            var objKey = 'Insurer_Id_' + this.lm_request['insurer_id'];
            //            var productPlanId = (this.prepared_request['dbmaster_pb_plan_id']).toString();
            //            var insuranceType = this.lm_request['travel_insurance_type'];
            //            if (businessClass.hasOwnProperty(objKey)) {
            //                var obj = businessClass[objKey];
            //                for (var i = 0; i < obj.length; i++) {
            //                    if (obj[i]['ProductPlan_Id'] === productPlanId && obj[i]['Category'] === insuranceType) {
            //                        obj_erp_data['___erp_plan_name___'] = obj[i]['BusinessClass'];
            //                    }
            //                }
            //            }
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'travel_erp_qt_data_prepare', e);
    }
};
Base.prototype.erp_request_xml_prepare = function (obj_erp_data, type) {
    try {
        var objBase = this;
        //console.log('Start', this.constructor.name, 'erp_request_xml_prepare');
        var xml_erp_data = '';
        var xml_file_name = '';
        if (type === 'CS') {
            if (obj_erp_data.hasOwnProperty('___posp_sub_fba_id___') === false) {
                obj_erp_data['___posp_sub_fba_id___'] = 0;
                obj_erp_data['___posp_sub_fba_name___'] = '';
            }
            if (obj_erp_data.hasOwnProperty('___is_whatsapp_allow___') === false) {
                obj_erp_data['___is_whatsapp_allow___'] = 0;
                obj_erp_data['___whatsapp_mobile___'] = '';
            }
            if (obj_erp_data.hasOwnProperty('___premium_breakup_outstanding_loan_premium___') === false) {
                obj_erp_data['___premium_breakup_outstanding_loan_premium___'] = 0;
                obj_erp_data['___premium_breakup_outstanding_loan_amount___'] = 0;
            }
            if (obj_erp_data.hasOwnProperty('___erp_client_type___') === false) {
                obj_erp_data['___erp_client_type___'] = 'Individual';
            }
            if ((obj_erp_data.hasOwnProperty('___renewal_crn_udid___') && obj_erp_data['___renewal_crn_udid___'] !== '' && obj_erp_data['___erp_source___'].indexOf('THRU US') < 0) || (obj_erp_data.hasOwnProperty('___erp_qt___') && obj_erp_data['___erp_qt___'] !== '')) {
                if (obj_erp_data['___erp_source___'].indexOf('POSP-') > -1 || obj_erp_data['___erp_source___'].indexOf('FOS-') > -1) {
                    obj_erp_data['___erp_source___'] = 'THRU US ' + obj_erp_data['___erp_source___'];
                }
                if (obj_erp_data['___erp_source___'].indexOf('FRESH-') > -1) {
                    obj_erp_data['___erp_source___'] = obj_erp_data['___erp_source___'].replace('FRESH-', 'THRU US-');
                }
            }
            if (obj_erp_data.hasOwnProperty('___posp_category___') && obj_erp_data['___posp_category___'].indexOf('MISP') > -1) {
                if (obj_erp_data.hasOwnProperty('___vehicle_insurance_type___') && obj_erp_data['___vehicle_insurance_type___'].indexOf('new') > -1) {
                    obj_erp_data['___erp_source___'] = 'FRESH-TW';
                } else {
                    obj_erp_data['___erp_source___'] = 'THRU US-TW';
                }
                // obj_erp_data['___posp_reporting_agent_uid___'] = 'Handler A1';
            }
            if (objBase.lm_request['product_id'] === 8 && !obj_erp_data.hasOwnProperty('___erp_plan_name___')) {
                if (obj_erp_data['___pa_insurance_type___'] === 'individual') {
                    obj_erp_data['___erp_plan_name___'] = 'Accident Protection';
                }
                else {
                    obj_erp_data['___erp_plan_name___'] = 'Accident Protection   Hospital Daily Cash';
                }
                if (!obj_erp_data.hasOwnProperty('___nominee_middle_name___')) {
                    obj_erp_data['___nominee_middle_name___'] = "";
                }
                if (obj_erp_data.hasOwnProperty('___is_posp___') && obj_erp_data['___is_posp___'] === "yes") {
                    obj_erp_data['___erp_posp_product___'] = 1;
                    obj_erp_data['___erp_is_posp___'] = 'POSP';
                }
                if (obj_erp_data.hasOwnProperty('___subchannel___')) {
                    if (obj_erp_data['___subchannel___'] === 'POSP') {
                        obj_erp_data['___erp_source___'] = "POSP-NM";
                    }
                    else if (obj_erp_data['___subchannel___'] === 'FOS') {
                        obj_erp_data['___erp_source___'] = "FOS-NM";
                    }
                    else {
                        obj_erp_data['___erp_source___'] = "FRESH-NM";
                    }
                }
                obj_erp_data['___erp_product_name___'] = "P A";
            }
            if (objBase.lm_request['product_id'] === 1 || objBase.lm_request['product_id'] === 10 || objBase.lm_request['product_id'] === 12) {
                if ((obj_erp_data['___posp_sources___'] - 0) > 0 && obj_erp_data['___posp_reporting_agent_uid___'] !== 508396) {
                    xml_file_name = 'LERP_CS.xml';
                } else if (!(obj_erp_data['___posp_sources___'] - 0) || obj_erp_data['___posp_reporting_agent_uid___'] == 508396) { //for policyboss
                    xml_file_name = 'LERP_CS_PB.xml';
                }
                xml_erp_data = fs.readFileSync(appRoot + '/resource/request_file/' + xml_file_name).toString();
                //data process start
                //xml_erp_data = xml_erp_data.replace('<Region>Bangalore</Region>', '<Region>Banglore</Region>');
                //xml_erp_data = xml_erp_data.replace('<Region>Kolkatta</Region>', '<Region>Kolkata</Region>');



                if (obj_erp_data.hasOwnProperty('___tarrif_rate___') === false && obj_erp_data.hasOwnProperty('___policy_od_tenure___')) {
                    if (obj_erp_data['___policy_od_tenure___'] == '0') {
                        xml_erp_data = xml_erp_data.replace('___tarrif_rate___', 'TP Only');
                        xml_erp_data = xml_erp_data.replace('___actual_tarrif_rate___', 0);
                    } else {
                        xml_erp_data = xml_erp_data.replace('___tarrif_rate___', obj_erp_data['___premium_rate_od_disc___']);
                        xml_erp_data = xml_erp_data.replace('___actual_tarrif_rate___', obj_erp_data['___premium_rate_od_disc___']);
                    }
                }
                if (obj_erp_data.hasOwnProperty('___tp_start_date___') === false) {
                    xml_erp_data = xml_erp_data.replace('<TPPYPInceptionDate>___tp_start_date___</TPPYPInceptionDate>', '<TPPYPInceptionDate></TPPYPInceptionDate>');
                    xml_erp_data = xml_erp_data.replace('<TPPYPExpiryDate>___tp_end_date___</TPPYPExpiryDate>', '<TPPYPExpiryDate></TPPYPExpiryDate>');
                    xml_erp_data = xml_erp_data.replace('<TPPYPPolicyNo>___tp_policy_number___</TPPYPPolicyNo>', '<TPPYPPolicyNo></TPPYPPolicyNo>');
                }
                if (obj_erp_data.hasOwnProperty('___tp_insurer_name___') === false) {
                    xml_erp_data = xml_erp_data.replace('<TPPYPInsCoName>___tp_insurer_name___</TPPYPInsCoName>', '<TPPYPInsCoName></TPPYPInsCoName>');
                }
                obj_erp_data['___erp_addon_zero_dep_cover___'] = ((obj_erp_data.hasOwnProperty('___addon_zero_dep_cover___') && obj_erp_data.___addon_zero_dep_cover___ === "yes") ? 1 : 0);
                obj_erp_data['___erp_addon_consumable_cover___'] = ((obj_erp_data.hasOwnProperty('___addon_consumable_cover___') && obj_erp_data.___addon_consumable_cover___ === "yes") ? 1 : 0);
                obj_erp_data['___erp_addon_engine_protector_cover___'] = ((obj_erp_data.hasOwnProperty('___addon_engine_protector_cover___') && obj_erp_data.___addon_engine_protector_cover___ === "yes") ? 1 : 0);
                obj_erp_data['___erp_addon_tyre_coverage_cover___'] = ((obj_erp_data.hasOwnProperty('___addon_tyre_coverage_cover___') && obj_erp_data.___addon_tyre_coverage_cover___ === "yes") ? 1 : 0);
                obj_erp_data['___erp_addon_ncb_protection_cover___'] = ((obj_erp_data.hasOwnProperty('___addon_ncb_protection_cover___') && obj_erp_data.___addon_ncb_protection_cover___ === "yes") ? 1 : 0);
                obj_erp_data['___erp_addon_invoice_price_cover___'] = ((obj_erp_data.hasOwnProperty('___addon_invoice_price_cover___') && obj_erp_data.___addon_invoice_price_cover___ === "yes") ? 1 : 0);
                obj_erp_data['___erp_addon_key_lock_cover___'] = ((obj_erp_data.hasOwnProperty('___addon_key_lock_cover___') && obj_erp_data.___addon_key_lock_cover___ === "yes") ? 1 : 0);
                obj_erp_data['___erp_addon_road_assist_cover___'] = ((obj_erp_data.hasOwnProperty('___addon_road_assist_cover___') && obj_erp_data.___addon_road_assist_cover___ === "yes") ? 1 : 0);
                obj_erp_data['___erp_addon_personal_belonging_loss_cover___'] = ((obj_erp_data.hasOwnProperty('_addon_personal_belonging_loss_cover__') && obj_erp_data._addon_personal_belonging_loss_cover__ === "yes") ? 1 : 0);
                //data process end
            }
            if (objBase.lm_request['product_id'] === 18) {
                if ((obj_erp_data['__posp_sources_'] - 0) > 0 && obj_erp_data['_posp_reporting_agent_uid__'] !== 508396) {
                    xml_file_name = 'LERP_CS_Cyber.xml';
                } else if (!(obj_erp_data['__posp_sources_'] - 0) || obj_erp_data['_posp_reporting_agent_uid__'] == 508396) { //for policyboss
                    xml_file_name = 'LERP_CS_PB_Cyber.xml';
                }
                xml_erp_data = fs.readFileSync(appRoot + '/resource/request_file/' + xml_file_name).toString();
                //data process start
                //xml_erp_data = xml_erp_data.replace('<Region>Bangalore</Region>', '<Region>Banglore</Region>');
                //xml_erp_data = xml_erp_data.replace('<Region>Kolkatta</Region>', '<Region>Kolkata</Region>');
                //data process end
            }
            if (objBase.lm_request['product_id'] == 2 || objBase.lm_request['product_id'] == 17) {
                if ((obj_erp_data['___posp_sources___'] - 0) > 0 && obj_erp_data['___posp_reporting_agent_uid___'] !== 508396) {
                    xml_file_name = 'LERP_CS_Health.xml';
                } else if (!(obj_erp_data['___posp_sources___'] - 0) || obj_erp_data['___posp_reporting_agent_uid___'] == 508396) { //for policyboss
                    xml_file_name = 'LERP_CS_PB_Health.xml';
                }
                xml_erp_data = fs.readFileSync(appRoot + '/resource/request_file/' + xml_file_name).toString();
                var txt_replace = this.find_text_btw_key(xml_erp_data, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
                var txt_replace_with = "";
                for (var member = 1; member <= obj_erp_data['___adult_count___']; member++) {
                    txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
                }
                for (var member = 3; member <= obj_erp_data['___child_count___'] + 2; member++) {
                    txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
                }
                xml_erp_data = xml_erp_data.replace(txt_replace, txt_replace_with);
            }
            if (objBase.lm_request['product_id'] === 4) {
                if (obj_erp_data['___subchannel___'] == 'POSP') {
                    xml_file_name = 'LERP_CS_Travel.xml';
                } else { //for policyboss
                    xml_file_name = 'LERP_CS_PB_Travel.xml';
                }
                xml_erp_data = fs.readFileSync(appRoot + '/resource/request_file/' + xml_file_name).toString();
            }
            if (objBase.lm_request['product_id'] === 8) {
                if ((obj_erp_data['___posp_sources___'] - 0) > 0 && obj_erp_data['___posp_reporting_agent_uid___'] !== 508396) {
                    xml_file_name = 'LERP_CS_PersonalAccident.xml';
                } else if (!(obj_erp_data['___posp_sources___'] - 0) || obj_erp_data['___posp_reporting_agent_uid___'] === 508396) { //for policyboss
                    xml_file_name = 'LERP_CS_PB_PersonalAccident.xml';
                }
                xml_erp_data = fs.readFileSync(appRoot + '/resource/request_file/' + xml_file_name).toString();
                var txt_replace = this.find_text_btw_key(xml_erp_data, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
                var txt_replace_with = "";
                for (var member = 1; member <= obj_erp_data['___adult_count___']; member++) {
                    txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
                }
                for (var member = 3; member <= obj_erp_data['___child_count___'] + 2; member++) {
                    txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
                }
                xml_erp_data = xml_erp_data.replace(txt_replace, txt_replace_with);
            }


            xml_erp_data = xml_erp_data.replaceJson(obj_erp_data);
            if (objBase.lm_request['product_id'] == 2 || objBase.lm_request['product_id'] == 17) {
                xml_erp_data = xml_erp_data.replaceAll('>M</', '>Male</');
                xml_erp_data = xml_erp_data.replaceAll('>F</', '>Female</');
                xml_erp_data = xml_erp_data.replaceAll('>TF</', '>TransgenderFemale</');
                xml_erp_data = xml_erp_data.replaceAll('>TM</', '>TransgenderMale</');
            }
            xml_erp_data = xml_erp_data.replace('<DSACode>0</DSACode>', '<DSACode></DSACode>');
            xml_erp_data = xml_erp_data.replace('<tem:DSAID>0</tem:DSAID>', '<tem:DSAID></tem:DSAID>');
            var cache_key = 'live_erp_region_list';
            if (fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
                var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
                var obj_live_erp_region_list = JSON.parse(cache_content);
                if (obj_live_erp_region_list.hasOwnProperty(obj_erp_data['___posp_agent_city___'])) {
                    let erp_region_name = obj_live_erp_region_list[obj_erp_data['___posp_agent_city___']];
                    console.error('live_erp_region_list', 'step2', erp_region_name);
                    xml_erp_data = xml_erp_data.replace('<Region>' + obj_erp_data['___posp_agent_city___'] + '</Region>', '<Region>' + erp_region_name + '</Region>');
                    xml_erp_data = xml_erp_data.replace('<tem:Region>' + obj_erp_data['___posp_agent_city___'] + '</tem:Region>', '<tem:Region>' + erp_region_name + '</tem:Region>');
                }
            }
            xml_erp_data = xml_erp_data.replace(/&/g, '&amp;');
            xml_erp_data = xml_erp_data.replace(/NaN/g, '0');
        }
        if (type === 'CS_DOC') { //http://202.131.98.100:8069/Service1.svc
            xml_file_name = 'LERP_CS_DOC.xml';
            xml_erp_data = fs.readFileSync(appRoot + '/resource/request_file/' + xml_file_name).toString();
            xml_erp_data = xml_erp_data.replaceJson(obj_erp_data);
        }
        return xml_erp_data;
        //console.log('Finish', this.constructor.name, 'erp_request_xml_prepare');
    } catch (Ex) {
        console.error('Exception', this.constructor.name, 'erp_request_xml_prepare', Ex.stack);
        return Ex.stack;
    }
};
Base.prototype.erp_process_service_call = function (xml_erp_data, type, obj_erp_data) {
    try {
        var fs = require('fs');
        //console.log('Start', 'erp_process_service_call');
        var moment = require('moment');
        var StartDate = moment(new Date());
        var objBase = this;
        var xml_file_name = '';
        let qt_data = '';
        let core_response = '';
        let fliter_response = '';
        let Err_Erp = '';
        let erp_status = 'INPROGRESS';
        let erp_value = 'INPROGRESS';
        var http = require('http');
        var xml2js = require('xml2js');
        var body = xml_erp_data;
        var str = '';
        var response_node_key = '';
        var method_controller = '';
        if (type === 'QT') {

        } else {

            User_Data.findOne({ "User_Data_Id": (obj_erp_data['___udid___'] - 0) }, function (err, dbUserData) {
                if (err) {

                } else {
                    if (dbUserData) {
                        dbUserData = dbUserData._doc;
                        if (type === 'CS') {
                            //for posp agent
                            //if (obj_erp_data.hasOwnProperty('___posp_sources___') && (obj_erp_data['___posp_sources___'] - 0) > 0 && obj_erp_data['___posp_reporting_agent_uid___'] != 508396) {
                            if (obj_erp_data['___subchannel___'] == 'POSP') {

                                if (objBase.lm_request['product_id'] == 1 || objBase.lm_request['product_id'] == 18 || objBase.lm_request['product_id'] == 10 || objBase.lm_request['product_id'] == 12) {
                                    soap_action = "http://tempuri.org/IChequeSubmissionDetailPushToSS/InsChequeSubmissionDetailToSS";
                                    response_node_key = 'InsChequeSubmissionDetailToSSResult';
                                }
                                if (objBase.lm_request['product_id'] == 2 || objBase.lm_request['product_id'] == 17 || objBase.lm_request['product_id'] == 8) {
                                    soap_action = "http://tempuri.org/IChequeSubmissionDetailPushToSS/SaveHealthDetails";
                                    response_node_key = 'SaveHealthDetailsResult';
                                }
                                if (objBase.lm_request['product_id'] === 4) {
                                    soap_action = "http://tempuri.org/IChequeSubmissionDetailPushToSS/SaveTravelCS";
                                    response_node_key = 'SaveTravelCSResult';
                                }
                                var postRequest = {
                                    host: "202.131.96.100",
                                    path: "/ChequeSubmissionDetailToSS.svc",
                                    port: '8084',
                                    method: "POST",
                                    "rejectUnauthorized": false,
                                    headers: {
                                        'Cookie': "cookie",
                                        'Content-Type': 'text/xml',
                                        'Content-Length': Buffer.byteLength(body),
                                        "SOAPAction": soap_action,
                                        "Cache-Control": 'private, no-cache, no-store, must-revalidate, max-age=0',
                                        "Pragma": "no-cache"
                                    }
                                };
                            } else { //for policyboss
                                if (objBase.lm_request['product_id'] == 1 || objBase.lm_request['product_id'] == 18 || objBase.lm_request['product_id'] == 10 || objBase.lm_request['product_id'] == 12) {
                                    soap_action = "http://tempuri.org/ISaveCSPB/InsertCSPB";
                                    response_node_key = 'InsertCSPBResult';
                                }
                                if (objBase.lm_request['product_id'] == 2 || objBase.lm_request['product_id'] == 17 || objBase.lm_request['product_id'] == 8) {
                                    soap_action = "http://tempuri.org/ISaveCSPB/InsertHealthCSPB";
                                    response_node_key = 'InsertHealthCSPBResult';
                                }
                                if (objBase.lm_request['product_id'] === 4) {
                                    soap_action = "http://tempuri.org/ISaveCSPB/SaveTravelCS";
                                    response_node_key = 'SaveTravelCSResult';
                                }
                                var postRequest = {
                                    host: "202.131.96.100",
                                    path: "/SaveCSPB.svc",
                                    port: '7521',
                                    method: "POST",
                                    "rejectUnauthorized": false,
                                    headers: {
                                        'Cookie': "cookie",
                                        'Content-Type': 'text/xml',
                                        'Content-Length': Buffer.byteLength(body),
                                        "SOAPAction": soap_action,
                                        "Cache-Control": 'private, no-cache, no-store, must-revalidate, max-age=0',
                                        "Pragma": "no-cache"
                                    }
                                };
                            }
                        }
                        if (type === 'CS_DOC') { //http://202.131.98.100:8069/Service1.svc
                            var postRequest = {
                                host: "202.131.96.100",
                                path: "/Service1.svc",
                                port: '8069',
                                method: "POST",
                                "rejectUnauthorized": false,
                                headers: {
                                    'Cookie': "cookie",
                                    'Content-Type': 'text/xml',
                                    'Content-Length': Buffer.byteLength(body),
                                    "SOAPAction": "http://tempuri.org/IService1/ChqSubDocUpload",
                                    "Cache-Control": 'private, no-cache, no-store, must-revalidate, max-age=0',
                                    "Pragma": "no-cache"
                                }
                            };
                            response_node_key = 'ChqSubDocUploadResult';
                        }

                        var buffer = "";
                        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
                        console.error('DBG', 'ERP_CS', 'START', dbUserData.PB_CRN);
                        var req = http.request(postRequest, function (res) {
                            var EndDate = moment(new Date());
                            var Call_Execution_Time = EndDate.diff(StartDate);
                            Call_Execution_Time = Math.round((Call_Execution_Time * 0.001) * 100) / 100;
                            //console.log(res.statusCode);
                            let buffer = "";
                            res.on("data", function (data) {
                                buffer = buffer + data;
                            });
                            res.on("end", function (data) {
                                console.error('DBG', 'ERP_CS', 'FINSISH', dbUserData.PB_CRN);
                                var parse = require('xml-parser');
                                //console.log(buffer);
                                core_response = buffer;
                                fliter_response = buffer.replace(/s:/g, '');
                                if (fliter_response.indexOf('<' + response_node_key + '>') > -1) {
                                    qt_data = objBase.find_text_btw_key(fliter_response, '<' + response_node_key + '>', '</' + response_node_key + '>', false);
                                    if ((type === 'CS' && qt_data.toString().indexOf('CS') === 0) || (type === 'CS_DOC' && qt_data === 'Success')) {
                                        erp_value = qt_data;
                                        erp_status = 'SUCCESS';
                                    } else if (qt_data.toLowerCase().indexOf('duplicate') > -1) {
                                        if (type === 'CS') {
                                            erp_value = 'DUPLICATE';
                                            erp_status = 'DUPLICATE';
                                            Err_Erp = qt_data;
                                            if (qt_data.indexOf('The duplicate key value is (') > -1) {
                                                erp_value = 'TRYAGAIN';
                                                erp_status = 'TRYAGAIN';
                                                //erp_value = objBase.find_text_btw_key(qt_data, 'The duplicate key value is (', ').', false);
                                                //erp_status = 'SUCCESS';
                                            } else if (qt_data.indexOf('CS is duplicate with CRNNo') > -1) {
                                                erp_value = 'DUPLICATE_CRN';
                                            } else if (qt_data.indexOf('Duplicate Registration No') > -1) {
                                                erp_value = 'DUPLICATE_REGNO';
                                            } else if (qt_data.indexOf('Duplicate Policy No') > -1) {
                                                erp_value = 'DUPLICATE_POLICYNO';
                                            }
                                        }
                                        if (type === 'CS_DOC') {
                                            erp_value = 'Success';
                                            erp_status = 'SUCCESS';
                                        }
                                    } else if (qt_data.indexOf('ROLLBACK TRANSACTION') > -1) {
                                        erp_value = 'TRYAGAIN';
                                        erp_status = 'TRYAGAIN';
                                    } else if (qt_data.indexOf('was deadlocked on lock') > -1) {
                                        erp_value = 'TRYAGAIN';
                                        erp_status = 'TRYAGAIN';
                                    } else if (qt_data.indexOf('Error -') > -1) {
                                        erp_value = 'VALIDATION';
                                        erp_status = 'VALIDATION';
                                        Err_Erp = qt_data;
                                        if (qt_data.indexOf('Region does not match with Master') > -1) {
                                            Err_Erp = qt_data + '| PB_MSG : Agent_City - ' + obj_erp_data['___posp_agent_city___'];
                                        } else if (qt_data.indexOf('Please provide proper FOS') > -1 || qt_data.indexOf('Please provide proper DSA') > -1 || qt_data.indexOf('Please provide POSP') > -1) {
                                            erp_value = 'VALIDATION_AGENT';
                                        } else if (qt_data.indexOf('Region does not match with Master') > -1) {
                                            erp_value = 'VALIDATION_REGION';
                                        } else if (qt_data.indexOf('Insurance company not match') > -1) {
                                            erp_value = 'VALIDATION_INSURER';
                                        } else if (qt_data.indexOf('Buss class not match with Master') > -1) {
                                            erp_value = 'VALIDATION_PLAN';
                                        } else if (qt_data.indexOf('At leat Executive 1 or Executive 2') > -1) {
                                            erp_value = 'VALIDATION_EXECUTIVE';
                                        } else if (qt_data.indexOf('Source does not match with Master') > -1) {
                                            erp_value = 'VALIDATION_SOURCE';
                                        }
                                    } else {
                                        erp_value = 'EXCEPTION';
                                        erp_status = 'EXCEPTION';
                                    }
                                } else if (fliter_response.indexOf('Specified argument was out of the range') > -1) {
                                    erp_value = 'EXCEPTION';
                                    erp_status = 'EXCEPTION';
                                } else if (fliter_response.indexOf('___') > -1) {
                                    erp_value = 'VALIDATION';
                                    erp_status = 'VALIDATION';
                                } else {
                                    erp_value = 'TRYAGAIN';
                                    erp_status = 'TRYAGAIN';
                                }

                                let ObjUser_Data = {};
                                let Status_History = dbUserData['Status_History'];
                                if (type === 'CS') {
                                    ObjUser_Data = {
                                        'Erp_Cs_Request': xml_erp_data,
                                        'Erp_Cs_Response': core_response,
                                        'Erp_Cs_Err': Err_Erp,
                                        'ERP_CS': erp_value,
                                        'ERP_CS_DOC': 'PENDING'
                                    };
                                }
                                if (type === 'CS_DOC') {
                                    ObjUser_Data = {
                                        'Erp_Cs_Doc_Request': xml_erp_data,
                                        'Erp_Cs_Doc_Response': core_response,
                                        'ERP_CS_DOC': erp_status
                                    };
                                }
                                Status_History.unshift({
                                    "Status": 'ERP_' + type + '_' + erp_status,
                                    "StatusOn": new Date()
                                });
                                ObjUser_Data.Status_History = Status_History;

                                //ObjUser_Data.Modified_On = new Date();
                                User_Data.update({ 'User_Data_Id': dbUserData['User_Data_Id'] }, { $set: ObjUser_Data }, function (err, numAffected) {
                                    if (err) {
                                        console.error('UserDataCRNUpdate', obj_erp_data['___udid___'], qt_data, err, numAffected);
                                    } else {
                                        if (type === 'CS' && erp_status === 'SUCCESS') {
                                            try {
                                                let args = {
                                                    data: {
                                                        "search_reference_number": dbUserData['Request_Unique_Id'],
                                                        "udid": dbUserData['User_Data_Id'],
                                                        "op": 'execute'
                                                    },
                                                    headers: {
                                                        "Content-Type": "application/json"
                                                    }
                                                };
                                                let url_api = config.environment.weburl + '/quote/erp_pdf';
                                                let Client = require('node-rest-client').Client;
                                                let client = new Client();
                                                client.post(url_api, args, function (data, response) { });
                                            } catch (e1) {
                                                console.error(e1.stack);
                                            }
                                        }
                                    }
                                });
                                //cs notification start
                                //email notification process
                                try {
                                    if (type === 'CS' && erp_status === 'SUCCESS') {

                                        if (dbUserData['Premium_Request']['ss_id'] - 0 > 0) {
                                            var Email = require('../models/email');
                                            var objModelEmail = new Email();
                                            var objProduct = {
                                                '1': 'Car',
                                                '2': 'Health',
                                                '4': 'Travel',
                                                '10': 'TW',
                                                '12': 'CV',
                                                '18': 'CyberSecurity',
                                                '8': 'PersonalAccident'
                                            };
                                            var product_short_name = objProduct[dbUserData['Product_Id']];
                                            var sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[' + product_short_name + '] CS_GENERATED for CRN : ' + dbUserData['PB_CRN'];
                                            var arr_to = [];
                                            var arr_bcc = [config.environment.notification_email];
                                            var arr_cc = [];
                                            var contentSms_Log = "CS-ENTRY-GENERATED\n\
																				-------------------\n\
																				CRN: " + dbUserData['PB_CRN'] + "\n\
																				Customer: " + dbUserData['Erp_Qt_Request_Core']['___first_name___'] + ' ' + dbUserData['Erp_Qt_Request_Core']['___last_name___'] + "\n\
																				Product: " + product_short_name + "\n\
                                                                                                                                                                CS: " + ObjUser_Data['ERP_CS'];
                                            var email_body = contentSms_Log.replace(/\n/g, '<BR>');
                                            var email_data = '<!DOCTYPE html><html><head><title>CS_GENERATION_NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                                            email_data += '<div class="report"><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">CS_GENERATION_NOTIFICATION</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
                                            email_data += '<tr><td  width="70%" style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">' + email_body + '&nbsp;</td></tr>';
                                            email_data += '</table></div><br></body></html>';
                                            if (dbUserData['Premium_Request'].hasOwnProperty('posp_email_id') && dbUserData['Premium_Request']['posp_email_id'] != null && dbUserData['Premium_Request']['posp_email_id'].toString().indexOf('@') > -1) {
                                                arr_to.push(dbUserData['Premium_Request']['posp_email_id']);
                                            }
                                            if (dbUserData['Premium_Request'].hasOwnProperty('posp_reporting_email_id') && dbUserData['Premium_Request']['posp_reporting_email_id'] != null && dbUserData['Premium_Request']['posp_reporting_email_id'].toString().indexOf('@') > -1) {
                                                arr_cc.push(dbUserData['Premium_Request']['posp_reporting_email_id']);
                                            }
                                            try {
                                                let rm_reporting_email = dbUserData['Master_Details']['agent']['RM']['rm_reporting_details']['email'];
                                                if (rm_reporting_email && rm_reporting_email.toString().indexOf('@') > -1) {
                                                    //arr_bcc.push(rm_reporting_email);
                                                }
                                            } catch (e) {
                                                console.error('Exception', 'RM_REPORTING_EMAIL_NA', e.stack);
                                            }

                                            if (arr_to.length) {
                                                objModelEmail.send('notifications@policyboss.com', arr_to.join(','), sub, email_data, arr_cc.join(','), arr_bcc.join(','), dbUserData['PB_CRN'] - 0);
                                            }
                                        }
                                    }
                                } catch (e) {
                                    console.error('Exception', 'Notification_CS', e);
                                }
                                //cs notification end


                                var user_type = (obj_erp_data['___is_posp___'] === 'yes') ? 'Posp' : 'NonPosp';
                                var app_version = (obj_erp_data['___app_version___'] == 'PolicyBoss.com') ? 'PolicyBoss.com' : ('App' + obj_erp_data['___app_version___']);
                                var sub = '[' + config.environment.name.toString().toUpperCase() + '-' + ((erp_status === 'SUCCESS') ? 'INFO' : erp_status) + ']' + user_type + '-' + app_version + '-ERP_' + type + ((erp_status === 'SUCCESS') ? ('-' + erp_value) : ('-0')) + '::CRN-' + objBase.lm_request['crn'] + '::Exec_Time-' + Call_Execution_Time + '_SEC';
                                var msg = '<!DOCTYPE html><html><head><title>LERP ' + type + ' Create</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                                var rm_msg = '';
                                if (erp_status === 'VALIDATION' || erp_status === 'DUPLICATE' || erp_status === 'TRYAGAIN') {
                                    msg += '<div class="report"><span  style="font-family:tahoma;font-size:18px;">ERP_' + type + '&nbsp;Message</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
                                    msg += '<tr><td  width="78%" style="font-family:tahoma;font-size:14px;"><pre>' + Err_Erp + '</pre></td></tr>';
                                    msg += '</table></div><br><br>';
                                    rm_msg = msg;
                                    rm_msg += '</body></html>';
                                }
                                msg += '<div class="report"><span  style="font-family:tahoma;font-size:18px;">ERP_' + type + '&nbsp;Response</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
                                msg += '<tr><td  width="78%" style="font-family:tahoma;font-size:14px;"><pre>' + fliter_response.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ /g, '&nbsp;').replace(/\n/g, '<br />') + '</pre></td></tr>';
                                msg += '</table></div>';
                                msg += '<br><br>';
                                msg += '<div class="report"><span  style="font-family:tahoma;font-size:18px;">ERP_' + type + '&nbsp;Request</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
                                msg += '<tr><td  width="78%" style="font-family:tahoma;font-size:14px;"><pre>' + xml_erp_data.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ /g, '&nbsp;') + '</pre></td></tr>';
                                msg += '</table></div><br><br>';
                                msg += '</body></html>';
                                var Email = require('../models/email');
                                var objModelEmail = new Email();
                                var arr_to = [config.environment.notification_email];
                                var arr_cc = [];
                                var arr_bcc = [];
                                if (type === 'CS' && erp_status !== 'SUCCESS') {
                                    arr_to.push('nikita.jadhav@policyboss.com');
                                    if (dbUserData['Premium_Request']['posp_reporting_email_id'].toString().indexOf('@') > -1) {
                                        objModelEmail.send('noreply@policyboss.com', dbUserData['Premium_Request']['posp_reporting_email_id'], sub, rm_msg, '', config.environment.notification_email, obj_erp_data['___crn___'] - 0);
                                    }
                                }
                                objModelEmail.send('noreply@policyboss.com', arr_to.join(','), sub, msg, arr_cc.join(','), arr_bcc.join(','), obj_erp_data['___crn___'] - 0);
                            });
                        });
                        req.on('error', function (e) {
                            console.error('DBG', 'ERP_CS', 'ERR', dbUserData.PB_CRN, e.message);
                            console.error('problem with request: ' + e.message);
                        });
                        req.write(body);
                        req.end();
                    }
                }
            });
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'erp_process_service_call', e);
    }
}
Base.prototype.motor_daily_report = function () {
    var Client = require('node-rest-client').Client;
    var client = new Client();
    //console.log('Start', this.constructor.name, 'motor_daily_report');
    // var Service_Log = require('../models/service_log');
    var cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 1);
    var service_log_args = {
        data: { query: { "Created_On": { $gt: cutoff }, 'Status': 'complete', 'Error_Code': { $ne: null } } },
        headers: {
            "Content-Type": "application/json"
        }
    };
    client.post(config.environment.weburl + '/service_log/find', service_log_args, (dbService_Logs, response) => {
        if (dbService_Logs) {
            for (var k in dbService_Logs) {
                var objDailyReport = {};
                var k_name = dbService_Logs[k]['Product_Id'] + '_' + dbService_Logs[k]['Insurer_Id'] + '_' + dbService_Logs[k]['Method_Type'] + '_' + dbService_Logs[k]['Error_Code'];
                if (!objDailyReport.hasOwnProperty(k_name)) {
                    var t_obj = JSON.parse('{"' + k_name + '":null}');
                    var objSingleReport = {
                        'Product_Id': 0,
                        'Insurer_Id': 0,
                        'Method_Type': '',
                        'Error_Code': '',
                        'Count': 0
                    };
                    objSingleReport.Product_Id = dbService_Logs[k]['Product_Id'];
                    objSingleReport.Insurer_Id = dbService_Logs[k]['Insurer_Id'];
                    objSingleReport.Method_Type = dbService_Logs[k]['Method_Type'];
                    objSingleReport.Error_Code = dbService_Logs[k]['Error_Code'];
                    Object.assign(objDailyReport, t_obj);
                }
                objDailyReport[k_name].Count += 1;
            }

        }
    });
    // Service_Log.find({ "Created_On": { $gt: cutoff }, 'Status': 'complete', 'Error_Code': { $ne: null } }, function (err, dbService_Logs) {
    //     if (err) {
    //         console.error('DBException', this.constructor.name, 'Service_Log_Find-motor_daily_report', err);
    //     } else {
    //         if (dbService_Logs) {
    //             for (var k in dbService_Logs) {
    //                 var objDailyReport = {};
    //                 var k_name = dbService_Logs[k]['Product_Id'] + '_' + dbService_Logs[k]['Insurer_Id'] + '_' + dbService_Logs[k]['Method_Type'] + '_' + dbService_Logs[k]['Error_Code'];
    //                 if (!objDailyReport.hasOwnProperty(k_name)) {
    //                     var t_obj = JSON.parse('{"' + k_name + '":null}');
    //                     var objSingleReport = {
    //                         'Product_Id': 0,
    //                         'Insurer_Id': 0,
    //                         'Method_Type': '',
    //                         'Error_Code': '',
    //                         'Count': 0
    //                     };
    //                     objSingleReport.Product_Id = dbService_Logs[k]['Product_Id'];
    //                     objSingleReport.Insurer_Id = dbService_Logs[k]['Insurer_Id'];
    //                     objSingleReport.Method_Type = dbService_Logs[k]['Method_Type'];
    //                     objSingleReport.Error_Code = dbService_Logs[k]['Error_Code'];
    //                     Object.assign(objDailyReport, t_obj);
    //                 }
    //                 objDailyReport[k_name].Count += 1;
    //             }

    //         }
    //     }
    // });
    //console.log('Finish', this.constructor.name, 'motor_daily_report');
    return age_in_year;
}
String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};
String.prototype.toTitleCase = function () {
    var strArr = this.split(' ');
    var newArr = [];
    for (var i = 0; i < strArr.length; i++) {
        newArr.push(strArr[i].charAt(0).toUpperCase() + strArr[i].slice(1).toLowerCase())
    }
    ;
    return newArr.join(' ');
};
Base.prototype.convert_to_sha256 = function (str_content) {
    var str_encrypted = crypto.createHash("sha256").update(str_content).digest("hex");
    return str_encrypted.toUpperCase();
}
Base.prototype.convert_to_sha1 = function (str_content) {
    var str_encrypted = crypto.createHash("sha1").update(str_content).digest("hex");
    return str_encrypted.toUpperCase();
}
Base.prototype.convert_to_md5 = function (str_content) {
    var str_encrypted = crypto.createHash("md5").update(str_content).digest("hex");
    return str_encrypted.toUpperCase();
}
Base.prototype.convert_to_sha512 = function (str_content) {
    var str_encrypted = crypto.createHash("sha512").update(str_content).digest("hex");
    return str_encrypted.toUpperCase();
}
Base.prototype.pg_ack_url = function (insurer_id = 0) {
    var pg_ack_url = '';
    if (config.environment.name === 'Production') {
        pg_ack_url = 'http://horizon.policyboss.com/transaction-status/' + this.lm_request['udid'] + '/' + this.lm_request['crn'] + '/' + this.lm_request['proposal_id'];
        if (insurer_id === 9) {
            pg_ack_url = 'https://www.policyboss.com' + '/transaction-status.php';
            //pg_ack_url = 'https://www.policyboss.com' + '/transaction-status/' + this.lm_request['crn'];
        }
    } else {
        if (insurer_id === 10) {
            //pg_ack_url = 'https://www.policyboss.com/transaction-status-qa.php';
            //pg_ack_url = 'http://horizon.policyboss.com/transaction-status/' + this.lm_request['udid'] + '/' + this.lm_request['crn'] + '/' + this.lm_request['proposal_id'];
            pg_ack_url = 'http://qa-horizon.policyboss.com' + '/transaction-status/' + this.lm_request['udid'] + '/' + this.lm_request['crn'] + '/' + this.lm_request['proposal_id'];
        } else {
            pg_ack_url = 'http://qa-horizon.policyboss.com' + '/transaction-status/' + this.lm_request['udid'] + '/' + this.lm_request['crn'] + '/' + this.lm_request['proposal_id'];
        }
        //pg_ack_url = 'http://horizon.policyboss.com/transaction-status/' + this.lm_request['udid'] + '/' + this.lm_request['crn'] + '/' + this.lm_request['proposal_id'];
    }
    return pg_ack_url;
};
Base.prototype.proposal_confirm_url = function (insurer_id = 0, proposal_id) {
    let t_proposal_confirm_url = '';
    if (config.environment.name === 'Production') {
        t_proposal_confirm_url = 'http://horizon.policyboss.com' + '/proposal-confirm?udid=' + this.lm_request['udid'] + '&proposal_id=' + this.lm_request['proposal_id'];
    } else if (config.environment.name === 'QA') {
        t_proposal_confirm_url = 'http://qa-horizon.policyboss.com' + '/proposal-confirm?udid=' + this.lm_request['udid'] + '&proposal_id=' + this.lm_request['proposal_id'];
    } else {
        t_proposal_confirm_url = 'http://qa-horizon.policyboss.com' + '/proposal-confirm?udid=' + this.lm_request['udid'] + '&proposal_id=' + this.lm_request['proposal_id'];
    }

    if (insurer_id === 9) {
        t_proposal_confirm_url += '&sourcesecure=no';
    } else {
        t_proposal_confirm_url += '&sourcesecure=no';
    }
    return t_proposal_confirm_url;
};
Base.prototype.premium_verification_ver2 = function (quote_premium, proposal_premium, allowed_diff_max = 100, allowed_diff_min = 5) {
    var objPremiumVerification = {
        'Quote_Amt': 0,
        'Proposal_Amt': 0,
        'Diff_Amt': 0,
        'Diff_Percentage': 0,
        'Status': false
    };
    objPremiumVerification.Quote_Amt = quote_premium;
    objPremiumVerification.Proposal_Amt = proposal_premium;
    objPremiumVerification.Diff_Amt = quote_premium - proposal_premium;
    objPremiumVerification.Diff_Percentage = (((quote_premium - proposal_premium) / quote_premium) * 100).toFixed(2);
    let min_amt = 0 - allowed_diff_min;
    let max_amt = allowed_diff_max;
    if (objInsurerProduct.lm_request.product_id === 12 && objInsurerProduct.insurer_id === 18 && objPremiumVerification.Diff_Amt >= min_amt && objPremiumVerification.Diff_Amt <= max_amt) {
        objPremiumVerification.Status = true;
    } else if (objPremiumVerification.Diff_Amt >= min_amt && objPremiumVerification.Diff_Amt < max_amt) {
        objPremiumVerification.Status = true;
    } else {
        objPremiumVerification.Status = false;
    }
    return objPremiumVerification;
}
Base.prototype.premium_verification = function (quote_premium, proposal_premium, allowed_diff_max = 100, allowed_diff_min = 10) {
    var objInsurerProduct = this;
    //allowed_diff_min = 10;
    //allowed_diff_max = 100;
    let allowed_pg_min = 10;
    let allowed_pg_max = Math.round(quote_premium * 1.10);
    var objPremiumVerification = {
        'Quote_Amt': 0,
        'Proposal_Amt': 0,
        'Diff_Amt': 0,
        'Diff_Percentage': 0,
        'Status': false,
        'Is_PG_Allowed': false,
        'Revision_Direction': 'NA',
        'Original_Premium': {
            'net_premium': Math.round(quote_premium / 1.18),
            'service_tax': Math.round((quote_premium * 0.18) / 1.18),
            'final_premium': Math.round(quote_premium)
        },
        'Revision_Premium': {
            'net_premium': Math.round(proposal_premium / 1.18),
            'service_tax': Math.round((proposal_premium * 0.18) / 1.18),
            'final_premium': Math.round(proposal_premium)
        }
    };
    objPremiumVerification.Quote_Amt = quote_premium;
    objPremiumVerification.Proposal_Amt = proposal_premium;
    objPremiumVerification.Diff_Amt = quote_premium - proposal_premium;
    if (objPremiumVerification.Diff_Amt < 0) {
        objPremiumVerification.Revision_Direction = 'INCREASED';
    } else {
        objPremiumVerification.Revision_Direction = 'DECREASED';
    }
    objPremiumVerification.Diff_Percentage = (((quote_premium - proposal_premium) / quote_premium) * 100).toFixed(2);
    objPremiumVerification.Diff_Percentage = (objPremiumVerification.Diff_Percentage < 0) ? 0 - objPremiumVerification.Diff_Percentage : objPremiumVerification.Diff_Percentage;
    let min_amt = 0 - allowed_diff_min;
    let max_amt = allowed_diff_max;
    if (objPremiumVerification.Diff_Amt >= min_amt && objPremiumVerification.Diff_Amt <= max_amt) {
        objPremiumVerification.Status = true;
    } else {
        objPremiumVerification.Status = false;
        if (objPremiumVerification.Revision_Direction === 'INCREASED') {
            objPremiumVerification.Is_PG_Allowed = true;
        } else if (objPremiumVerification.Revision_Direction === 'DECREASED' && objPremiumVerification.Diff_Percentage < 10) {
            objPremiumVerification.Is_PG_Allowed = true;
        }
        /*if (objInsurerProduct.lm_request['insurer_id'] === 5) {
         objPremiumVerification.Is_PG_Allowed = true;
         }*/
    }
    return objPremiumVerification;
}
Base.prototype.find_text_btw_key = function (src_text, start_key, end_key, include_key) {
    //console.log('Start', this.constructor.name, 'find_text_btw_key', src_text);
    include_key = include_key || false;
    var target_text = '';
    var SP = src_text.indexOf(start_key) + start_key.length;
    var string1 = src_text.substr(0, SP);
    var string2 = src_text.substr(SP);
    var TP = string1.length + string2.indexOf(end_key);
    target_text = src_text.substring(SP, TP);
    target_text = (include_key) ? (start_key + target_text + end_key) : target_text;
    //console.log('Finish', 'find_text_btw_key', target_text);
    return target_text;
}

function format_xmlobj_to_json(core_xml_obj) {
    let obj_formatted = {};
    try {
        for (let k in core_xml_obj) {
            if (Array.isArray(core_xml_obj[k]) && core_xml_obj[k].length == 1) {
                obj_formatted[k] = {};
                for (let j in core_xml_obj[k][0]) {
                    if (Array.isArray(core_xml_obj[k][0][j]) && core_xml_obj[k][0][j].length == 1) {
                        obj_formatted[k][j] = core_xml_obj[k][0][j][0];
                    }
                    else {
                        obj_formatted[k][j] = core_xml_obj[k][0][j];
                    }
                }
            }
            else {
                obj_formatted[k] = core_xml_obj[k];
            }
        }
    }
    catch (e) {
        obj_formatted['err'] = e.stack;
    }
    return obj_formatted;
}
Base.prototype.vehicle_info = function (Reg_No) {
    //console.log(this.constructor.name, 'Vehicle Info', 'Start');
    //console.log('service_log_unique_id', this.service_log_unique_id, 'Client_Id', this.client_id);

    var objBase = this;
    let ss_id = objBase.response_object.req.body.ss_id;
    if (ss_id !== "" || ss_id !== null || ss_id !== undefined) {
        ss_id = (isNaN(ss_id)) ? 0 : (parseInt(ss_id));
    }
    var objResponse = {
        "Variant_Id": 0,
        "Variant_Name": "",
        "VehicleCity_Id": 0,
        "FastLaneId": 0,
        "Make_ID": 0,
        "Model_ID": 0,
        "Fuel_ID": 0,
        "Make_Name": "",
        "Model_Name": "",
        "Fuel_Type": "",
        "Seating_Capacity": 0,
        "Cubic_Capacity": 0,
        "Manufacture_Year": 0,
        "Color": "",
        "Registration_Number": Reg_No,
        "RTO_Code": 0,
        "RTO_Name": "",
        "Chassis_Number": "",
        "Engin_Number": "",
        "Registration_Date": "",
        "Purchase_Date": "",
        "ErrorMessage": "",
        "Source": "",
        "Is_LM": "no",
        "FastlaneResponse": "",
        "FastlanePostResponse": "",
        "Call_Execution_Time": 0
    };
    var Client = require('node-rest-client').Client;
    var client = new Client();
    var lerp_vehicle_full = "";
    var moment = require('moment');
    var StartDate = moment(new Date());
    var args = {
        requestConfig: {
            timeout: 5000, //request timeout in milliseconds
            noDelay: true, //Enable/disable the Nagle algorithm
            keepAlive: true, //Enable/disable keep-alive functionalityidle socket.
            keepAliveDelay: 5000 //and optionally set the initial delay before the first keepalive probe is sent
        },
        responseConfig: {
            timeout: 5000 //response timeout
        }
    };
    var req_erp = client.get('http://202.131.96.98:8041/PolicyBossRegNoService.svc/GetRegNoData?v=' + Reg_No, args, function (data, response) {
        var EndDate = moment(new Date());
        var Call_Execution_Time = EndDate.diff(StartDate);
        Call_Execution_Time = Math.round((Call_Execution_Time * 0.001) * 100) / 100;
        if (Call_Execution_Time > 10) {
            var sub = '[' + config.environment.name.toString().toUpperCase() + '-' + ((data) ? 'INFO' : 'ERR') + ']ERP_REG_NUMBER_' + Reg_No;
            sub += '::Exec_Time-' + Call_Execution_Time + '_SEC';
            var msg = '<!DOCTYPE html><html><head><title>ERP REG NUMBER SERVICE</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
            msg += '</table></div><br><br>';
            if (data && false) {
                msg += '<div class="report"><span  style="font-family:tahoma;font-size:18px;">CRN&nbsp;Response</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
                msg += '<tr><td  width="78%" style="font-family:tahoma;font-size:14px;"><pre>' + JSON.stringify(data, undefined, 2) + '</pre></td></tr>';
            }
            msg += '</table></div>';
            msg += '</body></html>';
            var Email = require('../models/email');
            var objModelEmail = new Email();
            objModelEmail.send('noreply@policyboss.com', config.environment.notification_email, sub, msg, '', '');
        }

        if (data && data.hasOwnProperty('GetRegNoDataResult')) {
            //console.error('Log','ErpVehicleInfo',Reg_No,data);
            var objVehicleResponse = data['GetRegNoDataResult'];
            var status = objVehicleResponse.length > 0 ? true : false; // this service doesn't have vehicle registration date therefore false
            if (status) {
                objResponse["Source"] = "LERP";
                objResponse["Is_LM"] = "yes";
                objVehicleResponse = objVehicleResponse[0];
                lerp_vehicle_full = objVehicleResponse['Make'] + ' ' + objVehicleResponse['model'] + ' ' + objVehicleResponse['SubModel'];
                objResponse['Registration_Date'] = '07/01/' + objVehicleResponse['Mfgyear'];
                objResponse["Purchase_Date"] = objResponse["Registration_Date"];
            }
        } else {
            console.error('Log', 'ErpVehicleError', Reg_No, data);
        }
        var Vehicle_Detail = require('../models/vehicle_detail');
        Vehicle_Detail.findOne({ "Registration_Number": Reg_No }, function (err, dbVehicle_Detail) {
            if (err) {

            } else {
                if (dbVehicle_Detail != null && dbVehicle_Detail._doc['Variant_Id'] > 0) {
                    //console.log('FastLane', 'Vehicle Details Found in collection');
                    for (var key in dbVehicle_Detail._doc) {
                        objResponse[key] = dbVehicle_Detail._doc[key];
                    }
                    if (ss_id > 0) {
                        if (objResponse['ErrorMessage'] === "") {
                            objResponse['status'] = "Success";
                        }
                        /*objResponse['message'] = objResponse['ErrorMessage'];
                        objResponse['ModelName'] = objResponse['Model_Name'];
                        objResponse['FuelName'] = objResponse['Fuel_Type'];
                        objResponse['CarVariantName'] = objResponse['Variant_Name'];
                        objResponse['VariantId'] = objResponse['Variant_Id'];
                        objResponse['CityofRegitration'] = objResponse['RTO_Name'];
                        objResponse['CityofRegitrationId'] = objResponse['RTO_Code'];
                         //objResponse['ManufactureYear'] = objResponse['Manufacture_Year'];
                         let today_date = new Date();
                         objResponse['ManufactureYear'] = today_date.toLocaleString('en-us', { month: 'short' });
                        objResponse['PoExpiryDuration'] = "TodayTomorrow";
                         //objResponse['RegistrationDate'] = objResponse['Registration_Date'];
                         objResponse['RegistrationDate'] = moment(objResponse["Registration_Date"], "DD/MM/YYYY").format("DD-MM-YYYY");
                        objResponse['PD_VehicleCity_Id'] = objResponse['VehicleCity_Id'];
                        objResponse['ModelID'] = objResponse['Model_ID'];
                        objResponse['citycamal'] = objResponse['RTO_Name'];
                         objResponse['Year'] = objResponse['Manufacture_Year'];*/
                    }
                    objBase.response_object.json(objResponse);
                } else {
                    //console.log('FastLane', 'Vehicle Details not Found in collection, call service');
                    var objMaster = {
                        'Vehicle': null,
                        'Rto': null
                    };
                    var VehicleDetail = require('../models/vehicle_detail');
                    var objModelVehicleDetail = new VehicleDetail(objResponse);
                    objModelVehicleDetail.save(function (err, objDBVehicleDetail) {
                        if (err) {
                            console.error('Insert vehicle_details Error', 'ERP Vehicle_Data', err);
                        } else {
                            objResponse['Call_Execution_Time'] = moment(new Date());
                            var Vehicle_Detail_Id = objDBVehicleDetail.Vehicle_Detail_Id;
                            var https = require('https');
                            var xml2js = require('xml2js');
                            var options = {
                                host: 'web.fastlaneindia.com',
                                port: 443,
                                //path: '/vin/api/v1.2/vehicle?module_code=V01&regn_no=' + Reg_No,
                                path: '/vin/api/v1.2/vehicle?regn_no=' + Reg_No,
                                headers: {
                                    'Authorization': 'Basic ' + new Buffer('I013PROD1' + ':' + 'i13prd1@li257').toString('base64')
                                }
                            };
                            var request = https.get(options, function (res) {
                                var body = "";
                                res.on('data', function (data) {
                                    body += data;
                                });
                                res.on('end', function () {
                                    //here we have the full response, html or json object
                                    console.error('fastlane', Reg_No, body);
                                    objResponse['FastlaneResponse'] = body;
                                    xml2js.parseString(body, { ignoreAttrs: true }, function (err, objXml2Json) {
                                        //console.log(objXml2Json);
                                        if (err) {
                                            console.error('FastLane', 'service_call', 'xml2jsonerror', err);
                                            objResponse["ErrorMessage"] = err.toString();
                                            objBase.response_object.json(objResponse);
                                        } else {
                                            var status = objXml2Json['response']['description'][0];
                                            if (status === 'Record found') {
                                                objXml2Json = objXml2Json['response']['result'][0]['vehicle'][0];
                                                objResponse['Source'] = "Fastlane";
                                                objResponse["Manufacture_Year"] = '';
                                                objResponse["Registration_Date"] = '';
                                                objResponse["Purchase_Date"] = '';
                                                objResponse["Chassis_Number"] = '';
                                                objResponse["Engin_Number"] = '';
                                                objResponse["Color"] = '';
                                                try {
                                                    objResponse["Manufacture_Year"] = objXml2Json['manu_yr'][0] - 0;
                                                    objResponse["Registration_Date"] = moment(objXml2Json['regn_dt'][0], "DD/MM/YYYY").format("DD/MM/YYYY");
                                                    objResponse["Purchase_Date"] = objResponse["Registration_Date"];
                                                    objResponse["Chassis_Number"] = objXml2Json['chasi_no'][0];
                                                    objResponse["Engin_Number"] = objXml2Json['eng_no'][0];
                                                    objResponse["Color"] = objXml2Json['color'][0];
                                                    if (ss_id > 0) {
                                                        if (objResponse['ErrorMessage'] === "") {
                                                            objResponse['status'] = "Success";
                                                        }
                                                        /*objResponse['message'] = objResponse['ErrorMessage'];
                                                        objResponse['ModelName'] = objResponse['Model_Name'];
                                                        objResponse['FuelName'] = objResponse['Fuel_Type'];
                                                        objResponse['CarVariantName'] = objResponse['Variant_Name'];
                                                        objResponse['VariantId'] = objResponse['Variant_Id'];
                                                        objResponse['CityofRegitration'] = objResponse['RTO_Name'];
                                                        objResponse['CityofRegitrationId'] = objResponse['RTO_Code'];
                                                         //objResponse['ManufactureYear'] = objResponse['Manufacture_Year'];
                                                         let today_date = new Date();
                                                         objResponse['ManufactureYear'] = today_date.toLocaleString('en-us', { month: 'short' });
                                                        objResponse['PoExpiryDuration'] = "TodayTomorrow";
                                                         //objResponse['RegistrationDate'] = objResponse['Registration_Date'];
                                                         objResponse['RegistrationDate'] = moment(objResponse["Registration_Date"], "DD/MM/YYYY").format("DD-MM-YYYY");
                                                        objResponse['PD_VehicleCity_Id'] = objResponse['VehicleCity_Id'];
                                                        objResponse['ModelID'] = objResponse['Model_ID'];
                                                        objResponse['citycamal'] = objResponse['RTO_Name'];
                                                         objResponse['Year'] = objResponse['Manufacture_Year'];*/
                                                    }
                                                } catch (fex) {
                                                    console.error('flprocess', fex);
                                                }

                                                var vehicle_cd = objXml2Json['vehicle_cd'][0];
                                                var Vehicles_Insurer = require('../models/vehicles_insurer');
                                                Vehicles_Insurer.findOne({ 'Insurer_Vehicle_Code': vehicle_cd, 'Insurer_ID': 100 }, function (err, dbVehicleInsurer) {
                                                    if (err || dbVehicleInsurer === null) {
                                                        //console.log('Not found in Master table search by string match.');
                                                        // sometimes faslane sends "." in maker_model tag.
                                                        var des = objXml2Json['fla_maker_desc'][0] + ' ' + objXml2Json['fla_model_desc'][0];
                                                        var vehicle = require('../models/vehicle')
                                                        vehicle.find({ $text: { $search: des, $caseSensitive: false } }, { score: { $meta: "textScore" } }).sort({ score: { $meta: 'textScore' } }).exec(function (err, dbVehicle_Detail) {
                                                            if (err) {
                                                                //console.log("PB_Variant ID could not be found");
                                                                objResponse["ErrorMessage"] = "VehicleDetails not Found";
                                                                objBase.response_object.json(objResponse);
                                                            } else {
                                                                if (dbVehicle_Detail.length > 0) {
                                                                    objMaster['Vehicle'] = dbVehicle_Detail;
                                                                    objBase.vehicle_info_handler(objResponse, objMaster, Vehicle_Detail_Id);
                                                                }
                                                            }
                                                        });
                                                    } else {
                                                        var insurer_vehicle_id = dbVehicleInsurer._doc['Insurer_Vehicle_ID'];
                                                        //console.log(insurer_vehicle_id);
                                                        var Vehicles_Insurers_Mapping = require('../models/vehicles_insurers_mapping');
                                                        Vehicles_Insurers_Mapping.findOne({ Insurer_ID: 100, Insurer_Vehicle_ID: insurer_vehicle_id }, function (er, dbVehiclesInsurerMapping) {
                                                            if (er || dbVehiclesInsurerMapping === null) {
                                                                //console.log('Not found in Mapping table search by string match.');
                                                                // sometimes faslane sends "." in maker_model tag.
                                                                var des = objXml2Json['fla_maker_desc'][0] + ' ' + objXml2Json['fla_model_desc'][0];
                                                                var vehicle = require('../models/vehicle')
                                                                vehicle.find({ $text: { $search: des, $caseSensitive: false } }, { score: { $meta: "textScore" } }).sort({ score: { $meta: 'textScore' } }).exec(function (err, dbVehicle_Detail) {
                                                                    if (err) {
                                                                        //console.log("PB_Variant ID could not be found");
                                                                        objResponse["ErrorMessage"] = "VehicleDetails not Found";
                                                                        objBase.response_object.json(objResponse);
                                                                    } else {
                                                                        if (dbVehicle_Detail.length > 0) {
                                                                            objMaster['Vehicle'] = dbVehicle_Detail;
                                                                            objBase.vehicle_info_handler(objResponse, objMaster, Vehicle_Detail_Id);
                                                                        }
                                                                    }
                                                                });
                                                            } else {
                                                                var vehicle_id = dbVehiclesInsurerMapping._doc['Vehicle_ID'];
                                                                var Vehicle = require('../models/vehicle');
                                                                Vehicle.find({ Vehicle_ID: vehicle_id }, function (e, dbVehicle) {
                                                                    if (e) {
                                                                        //console.log('Not found in Vehicle table.');
                                                                        objResponse["ErrorMessage"] = "VehicleDetails not Found";
                                                                    } else {
                                                                        objMaster['Vehicle'] = dbVehicle;
                                                                        objBase.vehicle_info_handler(objResponse, objMaster, Vehicle_Detail_Id);
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            } else {
                                                if (lerp_vehicle_full !== "") {
                                                    var Vehicle = require('../models/vehicle');
                                                    Vehicle.find({ $text: { $search: lerp_vehicle_full, $caseSensitive: false } }, { score: { $meta: "textScore" } }).sort({ score: { $meta: 'textScore' } }).exec(function (err, dbVehicle_Detail) {
                                                        if (err) {
                                                            //console.log("PB_Variant ID could not be found");
                                                            objResponse["ErrorMessage"] = "VehicleDetails not Found";
                                                            objBase.response_object.json(objResponse);
                                                        } else if (dbVehicle_Detail.length > 0) {
                                                            objResponse["Manufacture_Year"] = objVehicleResponse['Mfgyear'] - 0;
                                                            objMaster['Vehicle'] = dbVehicle_Detail;
                                                            objBase.vehicle_info_handler(objResponse, objMaster, Vehicle_Detail_Id);
                                                        } else {
                                                            objResponse["ErrorMessage"] = "VehicleDetails not Found";
                                                            objBase.response_object.json(objResponse);
                                                        }
                                                    });
                                                } else {
                                                    objResponse["ErrorMessage"] = "VehicleDetails not Found";
                                                    objBase.response_object.json(objResponse);
                                                }
                                            }
                                        }
                                    });
                                });
                                res.on('error', function (e) {
                                    //console.log("Got error: " + e.message);
                                });
                            });
                            var rto_code = Reg_No.substring(0, 4);
                            if (isNaN(parseInt(Reg_No[3]))) {
                                rto_code = Reg_No.substring(0, 2) + '0' + Reg_No.substring(2, 3);
                            }
                            var rto = require('../models/rto');
                            rto.find({ VehicleCity_RTOCode: rto_code.toUpperCase() }).exec(function (err_rto, dbRto) {
                                if (err_rto) {
                                    objResponse["ErrorMessage"] += err_rto.toString();
                                    objBase.response_object.json(objResponse);
                                } else {
                                    objMaster['Rto'] = dbRto;
                                    objBase.vehicle_info_handler(objResponse, objMaster, Vehicle_Detail_Id);
                                }
                            });
                        }
                    });
                }
            }
        });
    });
    req_erp.on('requestTimeout', function (req) {
        console.error('erp request has expired', Reg_No);
        var sub = '[' + config.environment.name.toString().toUpperCase() + '-ERR]ERP_REG_NUMBER_REQ_TIMEOUT_' + Reg_No;
        var msg = '<!DOCTYPE html><html><head><title>ERP REG NUMBER SERVICE</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
        msg += '</body></html>';
        var Email = require('../models/email');
        var objModelEmail = new Email();
        objModelEmail.send('noreply@policyboss.com', config.environment.notification_email, sub, msg, '', '');
        req.abort();
    });
    req_erp.on('responseTimeout', function (res) {

        console.error('erp response has expired', Reg_No);
        var sub = '[' + config.environment.name.toString().toUpperCase() + '-ERR]ERP_REG_NUMBER_RES_TIMEOUT_' + Reg_No;
        var msg = '<!DOCTYPE html><html><head><title>ERP REG NUMBER SERVICE</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
        msg += '</body></html>';
        var Email = require('../models/email');
        var objModelEmail = new Email();
        objModelEmail.send('noreply@policyboss.com', config.environment.notification_email, sub, msg, '', '');
    });
    //console.log(this.constructor.name, 'FastLane', 'To Early');
};
Base.prototype.vehicle_info_handler = function (objResponse, objMaster, Vehicle_Detail_Id) {
    try {
        if (objMaster['Vehicle'] != null && objMaster['Rto'] != null) {
            var endDate = moment(new Date());
            var Call_Execution_Time = endDate.diff(objResponse['Call_Execution_Time']);
            objResponse['Call_Execution_Time'] = Math.round((Call_Execution_Time * 0.001) * 100) / 100;
            var dbVehicle_Detail = objMaster['Vehicle'];
            if (dbVehicle_Detail && dbVehicle_Detail.length > 0 && dbVehicle_Detail[0]._doc.hasOwnProperty('Vehicle_ID')) {
                //console.log("Vehicle has matched", "Vehicle ID: ", dbVehicle_Detail[0]._doc["Vehicle_ID"]);
                objResponse["Variant_Id"] = dbVehicle_Detail[0]._doc['Vehicle_ID'];
                objResponse["Model_ID"] = dbVehicle_Detail[0]._doc["Model_ID"];
                objResponse["Fuel_ID"] = dbVehicle_Detail[0]._doc["Fuel_ID"];
                objResponse["Make_Name"] = dbVehicle_Detail[0]._doc['Make_Name'];
                objResponse["Model_Name"] = dbVehicle_Detail[0]._doc['Model_Name'];
                objResponse["Fuel_Type"] = dbVehicle_Detail[0]._doc['Fuel_Name'];
                objResponse["Variant_Name"] = dbVehicle_Detail[0]._doc['Variant_Name'];
                objResponse["Seating_Capacity"] = dbVehicle_Detail[0]._doc['Seating_Capacity'];
                objResponse["Cubic_Capacity"] = dbVehicle_Detail[0]._doc['Cubic_Capacity'];
            }
            var dbRto = objMaster['Rto'];
            if (dbRto && dbRto.length > 0 && dbRto[0]._doc.hasOwnProperty('VehicleCity_Id')) {
                //console.log("RTO has matched RTO ID: " + dbRto[0]._doc['VehicleCity_Id']);
                objResponse["VehicleCity_Id"] = dbRto[0]._doc['VehicleCity_Id'];
                objResponse["RTO_Code"] = dbRto[0]._doc['VehicleCity_Id'];
                objResponse["RTO_Name"] = dbRto[0]._doc['RTO_City'];
            }
            //objResponse['message'] = objResponse['Error_Message'];
            //objResponse['status'] = objResponse['Error_Message'];
            objResponse['ModelName'] = objResponse['Model_Name'];
            objResponse['FuelName'] = objResponse['Fuel_Type'];
            objResponse['CarVariantName'] = objResponse['Variant_Name'];
            objResponse['VariantId'] = objResponse['Variant_Id'];
            objResponse['CityofRegitration'] = objResponse['RTO_Name'];
            objResponse['CityofRegitrationId'] = objResponse['RTO_Code'];
            //objResponse['ManufactureYear'] = objResponse['Manufacture_Year'];
            let today_date = new Date();
            objResponse['ManufactureYear'] = moment(objResponse["Registration_Date"], "DD/MM/YYYY").format("MMM");
            objResponse['PoExpiryDuration'] = "TodayTomorrow";
            //objResponse['RegistrationDate'] = objResponse['Registration_Date'];
            objResponse['RegistrationDate'] = moment(objResponse["Registration_Date"], "DD/MM/YYYY").format("DD-MM-YYYY");
            objResponse['PD_VehicleCity_Id'] = objResponse['VehicleCity_Id'];
            objResponse['ModelID'] = objResponse['Model_ID'];
            objResponse['citycamal'] = objResponse['RTO_Name'];
            objResponse['Year'] = objResponse['Manufacture_Year'];
            this.response_object.json(objResponse);
            var Vehicle_Detail = require('../models/vehicle_detail');
            Vehicle_Detail.update({ 'Vehicle_Detail_Id': Vehicle_Detail_Id }, objResponse, function (err, objDBVehicleDetail) {
                if (err) {
                    console.error('Insert vehicle_details Error', 'ERP Vehicle_Data', err);
                } else {
                }
            });
        }
    } catch (e) {
        objResponse['Error_Message'] = e;
        this.response_object.json(objResponse);
    }
};
Base.prototype.encrypt_to_cbc = function (str_content) {
    var crypto = require('crypto');
    var derp = require('derive-password-bytes');
    var initVector = "@1B2c3D4e5F6g7H8";
    var salt = 'Tewari$05';
    var masterkey = 'Satish$05';
    try {
        // random initialization vector
        var iv = Buffer.from(initVector, 'ascii');
        // random salt
        var salt = Buffer.from(salt, 'ascii');
        // derive key: 32 byte key length - in assumption the masterkey is a cryptographic and NOT a password there is no need for
        // a large number of iterations. It may can replaced by HKDF
        const derp = require('derive-password-bytes');
        const key = derp(masterkey, salt, 2, 'sha1', 32);
        // AES 256 CBC Mode
        var cipher = crypto.createCipheriv('AES-256-CBC', key, iv);
        // encrypt the given text
        var encrypted = cipher.update(str_content, 'ascii', 'base64') + cipher.final('base64');
        // generate output
        return encrypted.toString('base64');
    } catch (e) {
    }

}
Base.prototype.insured_age = function (insured_birth_date) {
    //console.log('Start', this.constructor.name, 'insured_birth_date');
    if (this.lm_request.hasOwnProperty('birth_date') && this.lm_request['birth_date'] !== '') {
        var birth_date = this.lm_request['birth_date'];
    } else {
        var birth_date = insured_birth_date;
    }

    var today = this.todayDate();
    var age_in_year = moment(today).diff(birth_date, 'years');
    //console.log('Finish', this.constructor.name, 'insured_birth_date', age_in_year);
    return age_in_year;
}
Base.prototype.customer_data = function (mobile_number) {
    return objBase.response_object.json({ Msg: 'No Data' });

    var objResponse = { "Error_Msg": '' };
    var objBase = this;
    try {
        var Client = require('node-rest-client').Client;
        var client = new Client();
        client.get('NIU/GetCustomerInformation?v=' + mobile_number, function (data, response) {
            //console.log(data);
            if (data.string.hasOwnProperty('_')) {
                var objCustomerArray = data.string['_'].toString().split(';');
                objResponse['Vehicle_Data'] = [];
                var count = 0;
                for (var y in objCustomerArray) {
                    var detail = objCustomerArray[y].toString().split(',');
                    if ((detail[3] === 'MOTOR' || detail[3] === 'TWO WHEELER') && detail[12].toString().length > 2 && detail[4].toString().length > 0 && detail[12] != "APPLIEDFOR") {
                        count++;
                    }
                }
                if (count == 0) {
                    objBase.response_object.json({ Msg: 'No Data' });
                } else {
                    var i = 0;
                    for (var x in objCustomerArray) {
                        var detail = objCustomerArray[x].toString().split(',');
                        if ((detail[3] === 'MOTOR' || detail[3] === 'TWO WHEELER') && detail[12].toString().length > 2 && detail[4].toString().length > 0 && detail[12] != "APPLIEDFOR") {
                            var registration_number = detail[12];
                            var vehicle_detail = { 'customer_name': detail[0], 'registration_no': registration_number, 'vehicle_type': detail[3], 'customer_email': detail[1] };
                            objResponse['Vehicle_Data'].push(vehicle_detail);
                            var Client = require('node-rest-client').Client;
                            var client = new Client();
                            //console.log(registration_number);
                            client.get('http://202.131.96.98:8041/PolicyBossRegNoService.svc/GetRegNoData?v=' + registration_number, function (data, response) {
                                //console.log(data.toString());
                                var vehicle_name = data['GetRegNoDataResult'][0]['Make'] + ' ' + data['GetRegNoDataResult'][0]['model'] + ' ' + data['GetRegNoDataResult'][0]['SubModel'];
                                var registration_no = data['GetRegNoDataResult'][0]['registrationno'];
                                var expiry_date = moment(data['GetRegNoDataResult'][0]['ExpiryDate'], 'DD MMM YYYY').format('DD/MM/YYYY');
                                var vehicle_array = objResponse['Vehicle_Data'];
                                var index = vehicle_array.indexOf(vehicle_array.find(x => x.registration_no === registration_no));
                                i++;
                                vehicle_array[index]['vehicle_name'] = vehicle_name;
                                vehicle_array[index]['expiry_date'] = expiry_date;
                                objResponse['Vehicle_Data'] = vehicle_array;
                                if (i == count) {
                                    objResponse['Vehicle_Data'].sort(function (a, b) {
                                        var dateA = moment(a.expiry_date, 'dd/MM/YYYY');
                                        var dateB = moment(b.expiry_date, 'dd/MM/YYYY');
                                        if (dateB - dateA > 0)
                                            return -1;
                                        if (dateB - dateA < 0)
                                            return 1;
                                        return 0;
                                    });
                                    var current_date = new moment();
                                    var index = 0;
                                    for (var key in objResponse['Vehicle_Data']) {
                                        if (current_date - moment(objResponse['Vehicle_Data'][key]['expiry_date'], 'dd/MM/YYYY') > 0) {
                                            index = key;
                                        }
                                    }
                                    if (index > 0) {
                                        objResponse['Vehicle_Data'] = objResponse['Vehicle_Data'].slice(index + 1);
                                    }
                                    objBase.response_object.json(objResponse);
                                }
                            });
                        }
                    }
                }
            } else {
                objBase.response_object.json({ 'Error_Msg': 'No Data' });
            }
        });
    } catch (e) {
        objBase.response_object.json({ 'Error_Msg': e.Msg });
        //console.log('Exception', 'customer_data', this.constructorName, e);
    }
};
Base.prototype.create_guid_with_objectid = function (Object_Id) {
    var a = [0, 6, 8, 12, 14, 24];
    var formatedString = "";
    for (var i = 0; i < a.length - 1; i++) {
        formatedString += Object_Id.substring(a[i], a[i + 1]) + "-";
    }
    return formatedString.replace(/-\s*$/, "").toUpperCase();
}
Base.prototype.encrypt_to_hmac_256 = function (str_content, checksumkey) {
    const crypto = require('crypto');
    const hash = crypto.createHmac('sha256', checksumkey)
        .update(str_content)
        .digest('hex');
    return hash.toUpperCase();
}
Base.prototype.fm_status_push = function (fba_id, crn, product_id, status) {
    try {
        var Client = require('node-rest-client').Client;
        var client = new Client();
        var fm_product = {
            "1": "MOI",
            "10": "MOI",
            "2": "HLI",
            "3": "LIF"
        };
        var fm_status = {
            "LINK": "AM",
            "SUBMIT": "PP",
            "SALE": "PS",
            "FAIL": "PF"
        };
        var args = {
            data: {
                "FBAId": fba_id,
                "QuotId": crn,
                "TranType": fm_product[product_id],
                "QuotStat": fm_status[status]
            },
            headers: {
                "Content-Type": "application/json",
                "token": "1234567890"
            }
        };
        /*
         client.post(config.finmart_config.status_push_url, args, function (data, response) {
         //console.error('FMStatusApi', data, response);
         if (!data) {
         
         } else {
         
         }
         });
         */
    } catch (e) {
        console.error('fm_status_push', e);
    }
};
Base.prototype.dialer_lead_push = function (objRequestCore) {
    try {
        var is_dialer_eligible = false;
        var obj_rto = {
            219: 'GJ05',
            597: 'MH15',
            1355: 'MH51'
        };
        if (config.environment.name === 'Production' && objRequestCore['channel'] === 'DIRECT' &&
            (objRequestCore['product_id'] === 1 || objRequestCore['product_id'] === 10) &&
            objRequestCore.hasOwnProperty('ip_city_state') &&
            objRequestCore['ip_city_state'] !== '' &&
            (objRequestCore['ip_city_state'].toString().toLowerCase().indexOf('surat') > -1 ||
                objRequestCore['ip_city_state'].toString().toLowerCase().indexOf('nashik') > -1 ||
                objRequestCore['ip_city_state'].toString().toLowerCase().indexOf('nasik') > -1 ||
                obj_rto.hasOwnProperty(objRequestCore['rto_id'])
            )) {

            is_dialer_eligible = true;
        }
        if (config.environment.name === 'Production' && objRequestCore['product_id'] == 2 && objRequestCore['utm_source'] == 'sms' && objRequestCore['utm_medium'] == 'cus_db' && objRequestCore['utm_campaign'] == 'sms_cam_hi') {
            is_dialer_eligible = true;
        }


        if (is_dialer_eligible) {
            var Client = require('node-rest-client').Client;
            var client = new Client();
            if (objRequestCore['product_id'] == 1 || objRequestCore['product_id'] == 10 || objRequestCore['product_id'] == 12) {
                var args = {
                    data: {
                        "phoneno": "+91-" + objRequestCore['mobile'],
                        "name": objRequestCore['first_name'] + ' ' + objRequestCore['last_name'],
                        "uniqueid": objRequestCore['udid']
                    },
                    headers: {
                        "Content-Type": "application/json",
                        "token": "1234567890"
                    }
                };
            }
            if (objRequestCore['product_id'] == 2) {
                var args = {
                    data: {
                        "phoneno": "+91-" + objRequestCore['mobile'],
                        "name": objRequestCore['contact_name'],
                        "uniqueid": objRequestCore['udid'],
                        "udf_param1": "sms camp",
                        "udf_param2": "sub-sms camp",
                        "udf_param3": "",
                        "udf_param4": "6"
                    },
                    headers: {
                        "Content-Type": "application/json",
                        "token": "1234567890"
                    }
                };
            }

            client.post(config.dialer_config.lead_push_api, args, function (data, response) {
                if (!data) {
                    console.error('dialer_lead_push', data, response);
                } else {
                    var obj_product_name = {
                        1: 'CAR',
                        10: 'TW',
                        12: 'CV',
                        2: 'HEALTH',
                        8: 'PersonalAccident'
                    };
                    if (data.IsSuccess === true) {
                        var SmsLog = require('../models/sms_log');
                        var objSmsLog = new SmsLog();
                        var customer_msg = "HORIZON-DIALER-LEAD\n\
---------------\n\
UDID : " + objRequestCore['udid'] + "\n\
CRN : " + objRequestCore['pb_crn'] + "\n\
Product : " + obj_product_name[objRequestCore['product_id']];
                        objSmsLog.send_sms('7666020532', customer_msg, 'Diler_Lead_Push', '');
                        objSmsLog.send_sms('7678050999', customer_msg, 'Diler_Lead_Push', '');
                        objSmsLog.send_sms('9833341817', customer_msg, 'Diler_Lead_Push', '');
                    }
                }
            });
        }
    } catch (e) {
        console.error('fm_status_push', e);
    }
};
Base.prototype.isCurrentFutureDate = function (dateText) {
    var selectedDate = new Date(dateText);
    var now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0, 0);
    if (selectedDate < now) {
        return false;
    } else {
        return true;
    }
};
Base.prototype.send_policy_upload_notification = function (User_Data_Id) {
    //email notification process
    try {

        User_Data.findOne({ 'User_Data_Id': User_Data_Id }, function (err, dbUserData) {
            if (err) {

            } else if (dbUserData) {
                try {
                    var Client = require('node-rest-client').Client;
                    let tmpuser = dbUserData._doc;
                    //push to erp
                    try {
                        if (tmpuser.hasOwnProperty('ERP_CS') && tmpuser['ERP_CS'] !== null && tmpuser['ERP_CS'].toString().indexOf('CS') > -1) {
                            let args = {
                                data: {
                                    "search_reference_number": tmpuser['Request_Unique_Id'],
                                    "udid": tmpuser['User_Data_Id'],
                                    "op": 'execute'
                                },
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            };
                            let url_api = config.environment.weburl + '/quote/erp_pdf';
                            var client = new Client();
                            client.post(url_api, args, function (data, response) { });
                        }
                    } catch (e) {
                        console.error('Exception', 'send_policy_upload_notification', 'erp_policy_push', 'User_Data_Id', User_Data_Id, e.stack);
                    }
                    //push to erp

                    var client_2 = new Client();
                    client_2.get(config.environment.weburl + '/user_datas/sync_policy_aws/' + tmpuser['User_Data_Id'], {}, function (data, response) { });

                    var Email = require('../models/email');
                    let objModelEmail = new Email();

                    let product_short_name = Const_Product[tmpuser['Product_Id']];
                    let sub = const_email_env_sub + '[' + product_short_name + '] Policy_Generated for CRN : ' + tmpuser['PB_CRN'];



                    let arr_to = [];
                    let arr_cc = [];
                    let arr_bcc = [config.environment.notification_email];
                    let contentSms_Log = "POLICY-UPLOADED\n\
																				-------------------\n\
																				CRN: " + tmpuser['PB_CRN'] + "\n\
																				Customer: " + tmpuser['Erp_Qt_Request_Core']['___first_name___'] + ' ' + tmpuser['Erp_Qt_Request_Core']['___last_name___'] + "\n\
                                                                                                                                                                Product: " + product_short_name + "\n\
                                                                                                                                                                Transaction_On: " + tmpuser['Modified_On'].toLocaleString();

                    let email_body = contentSms_Log.replace(/\n/g, '<BR>');
                    let email_data = '<!DOCTYPE html><html><head><title>POLICY_CREATION_NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                    email_data += '<div class="report"><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;"><u>POLICY_GENERATION_NOTIFICATION</u></span><br><span>Dear ' + tmpuser['Erp_Qt_Request_Core']['___first_name___'] + ' ' + tmpuser['Erp_Qt_Request_Core']['___last_name___'] + ',<BR>Policy Copy is generated for following transaction. <br>For any query, Please mail to customercare@policyboss.com <br><br><span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
                    email_data += '<tr><td  width="70%" style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">' + email_body + '&nbsp;</td></tr>';

                    email_data += '</table></div><br></body></html>';
                    arr_to.push(tmpuser['Erp_Qt_Request_Core']['___email___']);
                    if (tmpuser['Premium_Request']['ss_id'] - 0 > 0) {
                        if (tmpuser['Premium_Request'].hasOwnProperty('posp_email_id') && tmpuser['Premium_Request']['posp_email_id'] != null && tmpuser['Premium_Request']['posp_email_id'].toString().indexOf('@') > -1) {
                            arr_cc.push(tmpuser['Premium_Request']['posp_email_id']);
                        }
                        if (tmpuser['Premium_Request'].hasOwnProperty('posp_reporting_email_id') && tmpuser['Premium_Request']['posp_reporting_email_id'] != null && tmpuser['Premium_Request']['posp_reporting_email_id'].toString().indexOf('@') > -1) {
                            arr_bcc.push(tmpuser['Premium_Request']['posp_reporting_email_id']);
                        }
                        try {
                            let rm_reporting_email = tmpuser['Master_Details']['agent']['RM']['rm_reporting_details']['email'];
                            if (rm_reporting_email && rm_reporting_email.toString().indexOf('@') > -1) {
                                //arr_bcc.push(rm_reporting_email);
                            }
                        } catch (e) {
                            console.error('Exception', 'RM_REPORTING_EMAIL_NA', e.stack);
                        }
                    }
                    if (arr_to.length) {
                        objModelEmail.send('customercare@policyboss.com', arr_to.join(','), sub, email_data, arr_cc.join(','), arr_bcc.join(','), tmpuser['PB_CRN']);
                    }
                } catch (e) {
                    console.error('Exception', 'send_policy_upload_notification_data_cb', e.stack);
                }
            }
        });
    } catch (e) {
        console.error('Exception', 'send_policy_upload_notification', e.stack);
    }

};
Base.prototype.send_verification_notification = function (User_Data_Id) {
    //email notification process
    try {
        User_Data.findOne({ 'User_Data_Id': User_Data_Id, 'Last_Status': { $in: ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY'] } }, function (err, dbUserData) {
            if (dbUserData) {
                dbUserData = dbUserData._doc;
                if (dbUserData['PB_CRN'] > 0 && dbUserData['User_Data_Id'] > 0) {
                    var Client = require('node-rest-client').Client;
                    var client = new Client();
                    client.get(config.environment.weburl + '/report/process_already_closed?ud=' + dbUserData['User_Data_Id'], {}, function (data, response) { });
                    var client_1 = new Client();
                    client_1.get(config.environment.weburl + '/user_datas/rbmark/sms/' + dbUserData['User_Data_Id'], {}, function (data, response) { });
                    if (dbUserData['Product_Id'] === 1) {
                        var client_3 = new Client();
                        var args = {
                            data: {
                                "email": dbUserData['Erp_Qt_Request_Core']['___email___'],
                                'crn': dbUserData['PB_CRN']
                            },
                            headers: {
                                "Content-Type": "application/json"
                            }
                        };
                        client_3.get('http://qa.mgfm.in/api/SendRBEMail', args, function (data, response) { });
                    }

                    if (dbUserData['Last_Status'] === 'TRANS_SUCCESS_WITH_POLICY') {
                        var client_2 = new Client();
                        client_2.get(config.environment.weburl + '/user_datas/sync_policy_aws/' + dbUserData['User_Data_Id'], {}, function (data, response) { });
                    }
                }
                let obj_erp_data = dbUserData.Erp_Qt_Request_Core;
                let Transaction_Data = dbUserData.Transaction_Data;
                let posp_source = dbUserData['Premium_Request']['posp_sources'];
                let channel = dbUserData['Premium_Request']['channel'];
                let arr_sms_receiver = [];
                try {
                    //sms start
                    var SmsLog = require('../models/sms_log');
                    var objSmsLog = new SmsLog();
                    var dt = new Date();
                    obj_erp_data['___current_dt___'] = dt.toLocaleString();
                    obj_erp_data['___product___'] = Const_Product[obj_erp_data['___product_id___'].toString()];
                    if (obj_erp_data.hasOwnProperty('___vehicle_insurance_subtype___')) {
                        obj_erp_data['___vehicle_insurance_subtype_text___'] = const_policy_subtype[obj_erp_data['___vehicle_insurance_subtype___']];
                    }

                    obj_erp_data['___business_source___'] = dbUserData['Premium_Request']["channel"] + '-' + dbUserData['Premium_Request']["subchannel"];
                    if (dbUserData['Premium_Request'].hasOwnProperty('utm_source') && dbUserData['Premium_Request']["utm_source"] !== '') {
                        obj_erp_data['___business_source___'] += '-UTM-' + dbUserData['Premium_Request']["utm_source"];
                    }
                    if (obj_erp_data['___ss_id___'] > 0) {
                        obj_erp_data['___agent_name___'] = obj_erp_data['___posp_first_name___'] + ' ' + obj_erp_data['___posp_last_name___'];
                        if (obj_erp_data['___posp_erp_id___'] > 0) {
                            obj_erp_data['___agent_name___'] += ' (ERPID:' + obj_erp_data['___posp_erp_id___'] + ')';
                        } else {
                            obj_erp_data['___agent_name___'] += ' (FBAID:' + obj_erp_data['___posp_fba_id___'] + ')';
                        }
                    }

                    obj_erp_data['___app_version___'] = obj_erp_data.hasOwnProperty('___app_version___') ? obj_erp_data['___app_version___'] : 'NA';

                    obj_erp_data['___transaction_substatus___'] = 'NA';
                    if (Transaction_Data.transaction_status == 'SUCCESS') {
                        obj_erp_data['___transaction_status___'] = 'Successful Transaction';
                        if (Transaction_Data.hasOwnProperty('transaction_substatus') && Transaction_Data.transaction_substatus != '') {
                            if (Transaction_Data.transaction_substatus == 'ME') {
                                obj_erp_data['___transaction_substatus___'] = 'MER/PED Case';
                            }
                            if (Transaction_Data.transaction_substatus == 'UW') {
                                obj_erp_data['___transaction_substatus___'] = 'UW Case';
                            }
                            if (Transaction_Data.transaction_substatus == 'IP') {
                                obj_erp_data['___transaction_substatus___'] = 'Awaiting from Insurer';
                            }
                        }
                    }
                    if (Transaction_Data.transaction_status == 'FAIL') {
                        obj_erp_data['___transaction_status___'] = 'Customer did not pay';
                    }
                    if (Transaction_Data.transaction_status == 'PAYPASS') {
                        obj_erp_data['___transaction_status___'] = 'Payment done but Policy not created';
                    }
                    if (obj_erp_data['___product_id___'] == 2 && obj_erp_data.hasOwnProperty('___topup_applied___') && obj_erp_data['___topup_applied___'] == true) {
                        obj_erp_data['___erp_plan_name___'] += " + TOPUP";
                    }
                    let Agent_Msg = '';

                    if (config.environment.name === 'Production') {
                        if (obj_erp_data.hasOwnProperty('___posp_reporting_mobile_number___') && obj_erp_data['___posp_reporting_mobile_number___'] > 0) {
                            arr_sms_receiver.push(obj_erp_data['___posp_reporting_mobile_number___']);
                        }
                        if (Const_CH_Mobile.hasOwnProperty(channel)) {
                            for (let k in Const_CH_Mobile[channel]) {
                                //arr_sms_receiver.push(Const_CH_Mobile[channel][k]);
                            }
                        }
                    }
                    if (dbUserData['Product_Id'] == 1 && dbUserData['Premium_Request']['ui_source'] === 'UI22') {
                        //arr_sms_receiver.push('7666020532'); //Chirag
                        //arr_sms_receiver.push('9321332485'); //Amish
                        //arr_sms_receiver.push('9967192191'); //Vijay
                        //arr_sms_receiver.push('7208803933'); //Ashish
                    }
                    if (posp_source > 0) {
                        if ([1, 10, 12].indexOf(obj_erp_data['___product_id___']) > -1) {
                            Agent_Msg = objSmsLog.policyIssuedMsgPosp(obj_erp_data);
                        }
                        if (obj_erp_data['___product_id___'] == 2) {
                            Agent_Msg = objSmsLog.policyIssuedMsgPospHealth(obj_erp_data);
                        }
                        if (obj_erp_data['___product_id___'] == 13) {
                            Agent_Msg = objSmsLog.policyIssuedMsgPospMarine(obj_erp_data);
                        }
                        if (obj_erp_data['___product_id___'] == 5) {
                            Agent_Msg = objSmsLog.policyIssuedMsgPospMarine(obj_erp_data);
                        }
                        if (config.environment.name === 'Production') {
                            if (obj_erp_data.hasOwnProperty('___posp_reporting_mobile_number___') && obj_erp_data['___posp_reporting_mobile_number___'] > 0) {
                                arr_sms_receiver.push(obj_erp_data['___posp_reporting_mobile_number___']);
                            }
                            for (let k in Const_CH_Mobile[posp_source]) {
                                //arr_sms_receiver.push(Const_CH_Mobile[posp_source][k]);
                            }
                        }

                    } else {
                        if (obj_erp_data['___lm_agent_name___'] != '') {
                            obj_erp_data['___agent_name___'] = obj_erp_data['___lm_agent_name___'];
                        }
                        if ([1, 10, 12].indexOf(obj_erp_data['___product_id___']) > -1) {
                            Agent_Msg = objSmsLog.policyIssuedMsg(obj_erp_data);
                        }
                        if (obj_erp_data['___product_id___'] == 2) {
                            Agent_Msg = objSmsLog.policyIssuedMsgHealth(obj_erp_data);
                        }
                        if (obj_erp_data['___product_id___'] == 13 || obj_erp_data['___product_id___'] == 5) {
                            Agent_Msg = objSmsLog.policyIssuedMsgMarine(obj_erp_data);
                        }

                        if (obj_erp_data.hasOwnProperty('___lm_agent_mobile___')) {
                            if (obj_erp_data['___lm_agent_mobile___'] != '' && obj_erp_data['___lm_agent_mobile___'] != '9999999999' && !isNaN(obj_erp_data['___lm_agent_mobile___'])) {
                                arr_sms_receiver.push(obj_erp_data['___lm_agent_mobile___']);
                            }
                        }
                    }

                    if (obj_erp_data.hasOwnProperty('___posp_mobile_no___')) {
                        if (obj_erp_data['___posp_mobile_no___'] != '' && obj_erp_data['___posp_mobile_no___'] != '9999999999' && !isNaN(obj_erp_data['___posp_mobile_no___'])) {
                            arr_sms_receiver.push(obj_erp_data['___posp_mobile_no___']);
                        }
                    }

                    if (config.environment.name === 'Production') {
                        //arr_sms_receiver.push('9910069219');//varun
                        if (obj_erp_data['___product_id___'] == 2 && (Transaction_Data.transaction_status == 'SUCCESS')) {
                            //arr_sms_receiver.push('9769695091'); //apaar
                            //arr_sms_receiver.push('9833341817'); //soman                                
                        }
                        if (obj_erp_data['___product_id___'] == 12) {
                            //arr_sms_receiver.push('7666020532'); //Chirag
                        }
                    }
                    //sms finish
                    obj_erp_data['___sms_msg___'] = Agent_Msg;
                    obj_erp_data['___sms_receiver___'] = arr_sms_receiver.join(',');
                    if (Transaction_Data.transaction_status === 'SUCCESS') {
                        if (Transaction_Data) {
                            for (var k in Transaction_Data) {
                                obj_erp_data['___pg_' + k.toString().toLowerCase() + '___'] = (Transaction_Data[k]) ? Transaction_Data[k] : 0;
                            }
                        }
                        if (config.environment.name === 'Production') { // 2 -  sm , 3 - nochi - 5 - pospi 
                            arr_sms_receiver = obj_erp_data['___sms_receiver___'].split(',');
                            var SmsLog = require('../models/sms_log');
                            var objSmsLog = new SmsLog();
                            //for customer 
                            var customer_msg = '';
                            if (obj_erp_data['___product_id___'] == 1 || obj_erp_data['___product_id___'] == 10 || obj_erp_data['___product_id___'] == 12) {
                                customer_msg = objSmsLog.policyIssuedMsgMotorCustomer(obj_erp_data);
                            }
                            if (obj_erp_data['___product_id___'] == 2) {
                                customer_msg = objSmsLog.policyIssuedMsgHealthCustomer(obj_erp_data);
                            }
                            if (obj_erp_data['___product_id___'] == 13 || obj_erp_data['___product_id___'] == 5) {
                                customer_msg = objSmsLog.policyIssuedMsgMarineCustomer(obj_erp_data);
                            }
                            Agent_Msg = Agent_Msg.replace('SubFba: ___posp_sub_fba_name___(Id:___posp_sub_fba_id___)', '');
                            if (obj_erp_data.hasOwnProperty('___pg_policy_url___') && obj_erp_data['___pg_policy_url___'] && obj_erp_data['___pg_policy_url___'].indexOf('http') > -1) {
                                var Client = require('node-rest-client').Client;
                                var client = new Client();
                                client.get(config.environment.shorten_url + '?longUrl=' + encodeURIComponent(obj_erp_data['___pg_policy_url___']), function (data, response) {
                                    //console.log(data);
                                    var request_short_url = obj_erp_data['___pg_policy_url___'];
                                    if (data && data.Short_Url !== '') {
                                        request_short_url = data.Short_Url;
                                    } else {
                                        var sub = '[' + config.environment.name.toString().toUpperCase() + '-ERR]BITLY_ERROR';
                                        var email_data = '<html><body>TOKEN - ' + bitly_access_token + '<p>Data</p><pre>' + JSON.stringify(data, undefined, 2) + '</pre></body></html>';
                                        var Email = require('../models/email');
                                        var objModelEmail = new Email();
                                        objModelEmail.send('customercare@policyboss.com', config.environment.notification_email, sub, email_data, '', '', 0);
                                    }
                                    Agent_Msg = Agent_Msg.replace("Policy: ___policy_surl___", request_short_url);
                                    customer_msg = customer_msg.replace("Policy: ___policy_surl___", request_short_url);
                                    objSmsLog.send_sms(obj_erp_data['___mobile___'], customer_msg, 'Transaction_Success', obj_erp_data['___crn___']);
                                    for (let k = 0; k < arr_sms_receiver.length; k++) {
                                        let finalmsg = '';
                                        if (arr_sms_receiver[k] !== obj_erp_data['___posp_mobile_no___']) {
                                            finalmsg = Agent_Msg.replace("Policy: ___policy_surl___", '');
                                        } else {
                                            finalmsg = Agent_Msg;
                                        }
                                        objSmsLog.send_sms(arr_sms_receiver[k], finalmsg, 'Transaction_Success', obj_erp_data['___crn___']);
                                    }
                                    try {
                                        //email process
                                        var objEmail = {
                                            '___crn___': obj_erp_data['___crn___'],
                                            '___insurer_name___': obj_erp_data['___insurerco_name___'],
                                            '___contact_name___': obj_erp_data['___first_name___'],
                                            '___short_url___': request_short_url
                                        };
                                        var fs = require('fs');
                                        var email_data = '';
                                        email_data = fs.readFileSync(appRoot + '/resource/email/Policy_Success.html').toString();
                                        var objProduct = {
                                            '1': 'Car',
                                            '2': 'Health',
                                            '10': 'TW',
                                            '12': 'CV',
                                            '13': 'Marine',
                                            '5': 'Investment',
                                            '4': 'Travel',
                                            '18': 'CyberSecurity',
                                            '8': 'PersonalAccident'
                                        };
                                        var product_short_name = objProduct[obj_erp_data['___product_id___']];
                                        var sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[' + product_short_name + '] Successful Transaction for CRN : ' + obj_erp_data['___crn___'];
                                        email_data = email_data.replaceJson(objEmail);
                                        var Email = require('../models/email');
                                        var objModelEmail = new Email();
                                        var arr_bcc = [config.environment.notification_email];
                                        var emailto = obj_erp_data['___email___'];
                                        var email_agent = '';
                                        if (obj_erp_data.hasOwnProperty('___posp_email_id___') && obj_erp_data['___posp_email_id___'] != null && obj_erp_data['___posp_email_id___'].toString().indexOf('@') > -1) {
                                            if (emailto.toString().toLowerCase() !== obj_erp_data['___posp_email_id___'].toString().toLowerCase()) {
                                                email_agent = obj_erp_data['___posp_email_id___'];
                                            }
                                        }
                                        objModelEmail.send('customercare@policyboss.com', emailto, sub, email_data, email_agent, arr_bcc.join(','), obj_erp_data['___crn___'] - 0);
                                        //email process end
                                    } catch (e) {
                                        console.error('Exception', 'Success Email', e);
                                    }

                                });
                            } else {
                                customer_msg = customer_msg.replace("Policy: ___policy_surl___", '');
                                objSmsLog.send_sms(obj_erp_data['___mobile___'], customer_msg, 'Transaction_Success', obj_erp_data['___crn___']);
                                Agent_Msg = Agent_Msg.replace("Policy: ___policy_surl___", '');
                                for (var k = 0; k < arr_sms_receiver.length; k++) {
                                    objSmsLog.send_sms(arr_sms_receiver[k], Agent_Msg, 'Transaction_Success', obj_erp_data['___crn___']);
                                }
                            }

                            var product_short_name = Const_Product[obj_erp_data['___product_id___']];
                            var sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[' + product_short_name + '] SUCCESSFUL_TRANSACTION for CRN : ' + obj_erp_data['___crn___'];

                        }
                    } else {
                        Agent_Msg = obj_erp_data['___sms_msg___'];
                        arr_sms_receiver = obj_erp_data['___sms_receiver___'].split(',');
                        var SmsLog = require('../models/sms_log');
                        var objSmsLog = new SmsLog();
                        var CS_Status = 'NA';
                        Agent_Msg = Agent_Msg.replace('___erp_cs___', CS_Status);
                        Agent_Msg = Agent_Msg.replace("Policy: ___policy_surl___", '');
                        if (config.environment.name === 'Production') {
                            for (var k = 0; k < arr_sms_receiver.length; k++) {
                                if (Transaction_Data.transaction_status === 'SUCCESS') {
                                    objSmsLog.send_sms(arr_sms_receiver[k], Agent_Msg, 'Transaction_Fail', obj_erp_data['___crn___']);
                                }
                            }
                        }
                        var product_short_name = Const_Product[obj_erp_data['___product_id___']];
                        if (Transaction_Data.transaction_status === 'FAIL') {
                            var sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[' + product_short_name + '] PAYMENT_NOT_COMPLETED for CRN : ' + obj_erp_data['___crn___'];
                        }
                        if (Transaction_Data.transaction_status === 'PAYPASS') {
                            var sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[' + product_short_name + '] PAYPASS_TRANSACTION for CRN : ' + obj_erp_data['___crn___'];
                        }

                    }
                    //email notification process
                    try {
                        if (obj_erp_data['___ss_id___'] - 0 > 0) {
                            var arr_to = [];
                            var arr_cc = [];
                            var arr_bcc = [config.environment.notification_email];
                            var email_body = Agent_Msg.replace("Policy: ___policy_surl___", '');
                            email_body = email_body.replace(/\n/g, '<BR>');
                            var email_data = '<!DOCTYPE html><html><head><title>TRANSACTION_NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                            email_data += '<div class="report"><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">TRANSACTION_NOTIFICATION</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
                            email_data += '<tr><td  width="70%" style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">' + email_body + '&nbsp;</td></tr>';
                            email_data += '</table></div><br></body></html>';
                            if (obj_erp_data.hasOwnProperty('___posp_email_id___') && obj_erp_data['___posp_email_id___'] != null && obj_erp_data['___posp_email_id___'].toString().indexOf('@') > -1) {
                                arr_to.push(obj_erp_data['___posp_email_id___']);
                            }
                            if (obj_erp_data.hasOwnProperty('___posp_reporting_email_id___') && obj_erp_data['___posp_reporting_email_id___'] != null && obj_erp_data['___posp_reporting_email_id___'].toString().indexOf('@') > -1) {
                                arr_cc.push(obj_erp_data['___posp_reporting_email_id___']);
                            }
                            try {
                                let rm_reporting_email = dbUserData['Master_Details']['agent']['RM']['rm_reporting_details']['email'];
                                if (rm_reporting_email && rm_reporting_email.toString().indexOf('@') > -1) {
                                    //arr_bcc.push(rm_reporting_email);
                                }
                            } catch (e) {
                                console.error('Exception', 'RM_REPORTING_EMAIL_NA', e.stack);
                            }
                            if (arr_to.length) {
                                var Email = require('../models/email');
                                var objModelEmail = new Email();
                                if (Transaction_Data.transaction_status === 'SUCCESS') {
                                    objModelEmail.send('notifications@policyboss.com', arr_to.join(','), sub, email_data, arr_cc.join(','), arr_bcc.join(','), obj_erp_data['___crn___'] - 0);
                                }
                            }
                        }
                    } catch (e) {
                        console.error('Exception', 'Notification_RM_Team', e);
                    }

                } catch (e3) {
                    console.error('Exception', 'SMS', e3);
                }
            }
        });
    } catch (e) {
        console.error('Exception', 'send_policy_upload_notification', e.stack);
    }
};

function jsonToQueryString(json) {
    return '?' +
        Object.keys(json).map(function (key) {
            return encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);
        }).join('&');
}
Base.verification_handler = function () {
    //sms start
    var objBase = this;
    var erp_op_type = 'CS';
}
Base.prototype.create_policy_file_name = function (policy_number, insurer_id, product_id) {
    let product_class = 'Motor';
    let product_name = 'CAR';
    if (product_id === 10) {
        product_name = 'TW';
    }
    if (product_id === 12) {
        product_name = 'CV';
    }
    if (product_id === 2) {
        product_class = 'Health';
        product_name = 'Health';
    }
    if (product_id === 3) {
        product_class = 'TERM';
        product_name = 'TERM';
    }
    if (product_id === 4) {
        product_class = 'TRAVEL';
        product_name = 'TRAVEL';
    }
    if (product_id === 13) {
        product_class = 'MARINE';
        product_name = 'MARINE';
    }
    if (product_id === 17) {
        product_class = 'CORONACARE';
        product_name = 'CORONACARE';
    }
    if (product_id === 18) {
        product_class = 'CYBER';
        product_name = 'CYBER';
    }
    if (product_id === 8) {
        product_class = 'PersonalAccident';
        product_name = 'PersonalAccident';
    }
    if (product_id === 19) {
        product_class = 'workmanCompensation';
        product_name = 'workmanCompensation';
    }
    var objInsuranceProduct = {
        '1': 'BajajAllianz',
        '2': 'BhartiAxa',
        '4': 'FutureGenerali',
        '5': 'HdfcErgo',
        '6': 'IciciLombard',
        '7': 'IffcoTokio',
        '9': 'Reliance',
        '11': 'TataAig',
        '12': 'NewIndia',
        '16': 'RahejaQBE',
        '19': 'UniversalSompo',
        '30': 'Kotak',
        '33': 'LibertyGeneral',
        '14': 'UnitedIndia',
        '10': 'RoyalSundaram',
        '26': 'Star',
        '42': 'AdityaBirla',
        '34': 'Care',
        '45': 'Acko',
        '21': 'HDFCErgoGeneral',
        '38': 'Cigna',
        '44': 'Digit',
        '46': 'Edelweiss',
        '47': 'Dhfl',
        '13': 'Oriental',
        '35': 'MagmaHDI',
        '3': 'CholaMS',
        '17': 'SBIGeneral',
        '28': 'HdfcLife',
        '37': 'TataAIA',
        '39': 'IciciPru',
        '43': 'EdelweissTokio',
        '20': 'MaxBupa'
    };
    var pdf_file_name = objInsuranceProduct[insurer_id] + product_class + '_' + product_name + '_' + policy_number.toString().trim().replace(/\//g, '') + '.pdf';
    return pdf_file_name;
}
function getPincode(lm_pincode) {
    var result;
    var pincodeArr = [];
    var lm_pincode = lm_pincode;
    try {
        var content = fs.readFileSync(appRoot + "/resource/request_file/Health/pincodes.json");
        pincodeArr = JSON.parse(content);
        result = pincodeArr.indexOf(lm_pincode);
        return result;
    } catch (err) {
        console.log(err);
    }
}
function ValidatePAN(PAN) {
    let regexpan = /([A-Z]){5}([0-9]){4}([A-Z]){1}$/;
    return (regexpan.test(PAN.toUpperCase())) ? true : false;
}
function royal_sundaram_idv_changes(Db_Data_Object) {
    var objMotor = this;
    var arr_premium_response = {
        'Error': null,
        'Summary': null,
        'Response': []
    };
    try {
        console.log('Start', 'royal_sundaram_idv_changes');
        var ch_flag = ((parseInt(((Db_Data_Object['vehicle_insurance_subtype']).split('CH'))[0]) > 0) ? true : false);
        if (ch_flag || Db_Data_Object['vehicle_insurance_subtype'] === "1OD_0TP") {
            var first_step_flag = false;
            if (parseInt(Db_Data_Object['vehicle_expected_idv']) === parseInt(Db_Data_Object['vehicle_max_idv'])) {
                first_step_flag = true;
            }
            if (parseInt(Db_Data_Object['vehicle_expected_idv']) === parseInt(Db_Data_Object['vehicle_min_idv'])) {
                first_step_flag = true;
            }
            if (first_step_flag) {
                return (parseInt(Db_Data_Object['vehicle_expected_idv']));
            } else {
                if (parseInt(Db_Data_Object['vehicle_expected_idv']) !== parseInt(Db_Data_Object['vehicle_normal_idv'])) {
                    var inc_dec_amount = '';
                    var inc_dec_percent = '';
                    var increase_flag = false;
                    var next_step_flag = false;
                    if ((parseInt(Db_Data_Object['vehicle_expected_idv']) > parseInt(Db_Data_Object['vehicle_normal_idv']))
                        && (parseInt(Db_Data_Object['vehicle_expected_idv']) <= parseInt(Db_Data_Object['vehicle_max_idv']))) {
                        increase_flag = true;
                        next_step_flag = true;
                        inc_dec_amount = parseInt(Db_Data_Object['vehicle_expected_idv']) - parseInt(Db_Data_Object['vehicle_normal_idv']);
                        inc_dec_percent = parseInt(inc_dec_amount) / parseInt(Db_Data_Object['vehicle_normal_idv']) * 100;
                    }
                    if ((parseInt(Db_Data_Object['vehicle_expected_idv']) < parseInt(Db_Data_Object['vehicle_normal_idv']))
                        && (parseInt(Db_Data_Object['vehicle_expected_idv']) >= parseInt(Db_Data_Object['vehicle_min_idv']))) {
                        increase_flag = false;
                        next_step_flag = true;
                        inc_dec_amount = parseInt(Db_Data_Object['vehicle_normal_idv']) - parseInt(Db_Data_Object['vehicle_expected_idv']);
                        inc_dec_percent = parseInt(inc_dec_amount) / parseInt(Db_Data_Object['vehicle_normal_idv']) * 100;
                    }
                    if (next_step_flag) {
                        var check_result = (inc_dec_percent - Math.floor(inc_dec_percent)) !== 0;
                        if (check_result) {
                            inc_dec_percent = parseInt(inc_dec_percent);
                            var percent_multiple = '';
                            if (increase_flag === true) {
                                percent_multiple = (inc_dec_percent / 100) + 1;
                                return (parseInt(parseInt(Db_Data_Object['vehicle_normal_idv']) * percent_multiple));
                            } else {
                                percent_multiple = (inc_dec_percent / 100);
                                return ((parseInt(parseInt(Db_Data_Object['vehicle_normal_idv']))) - (parseInt(parseInt(Db_Data_Object['vehicle_normal_idv']) * percent_multiple)));
                            }
                        } else {
                            return (parseInt(Db_Data_Object['vehicle_expected_idv']));
                        }
                    }
                } else {
                    return (parseInt(Db_Data_Object['vehicle_expected_idv']));
                }
            }
        }
    } catch (e) {
        console.error('Exception', 'royal_sundaram_idv_changes', e);
        arr_premium_response.Error = e.stack;
    }
}

function api_log_summary_builder(api_log_response, dbService_Log_Fetch, objBase, client) {
    if (!dbService_Log_Fetch) {
        console.error('API_LOG_SUMMARY', 'No such record');
        objBase.response_object.json({ 'Msg': 'No such record' });
    } else {
        var dbService_Log = {};
        if (dbService_Log_Fetch.hasOwnProperty('_doc')) {
            dbService_Log['_doc'] = dbService_Log_Fetch['_doc'];
        } else {
            dbService_Log['_doc'] = dbService_Log_Fetch;
        }
        if (dbService_Log && dbService_Log.Status !== "FAIL") {
            var ud_cond = { 'Request_Unique_Id': dbService_Log['Request_Unique_Id'] };
            if (objBase.udid > 0) {
                ud_cond = { "User_Data_Id": objBase.udid - 0 };
            }
            Product_Id = dbService_Log._doc['Product_Id'];
            if (Product_Id !== 12 && (dbService_Log._doc['Insurer_Id'] === 10 && (dbService_Log._doc['Method_Type'] === "Idv" || dbService_Log._doc['Method_Type'] === "Premium"))) {
                dbService_Log._doc.LM_Custom_Request['vehicle_expected_idv'] = royal_sundaram_idv_changes(dbService_Log._doc.LM_Custom_Request);
            }
            api_log_response.Last_Premium_Request = dbService_Log._doc.LM_Custom_Request;
            api_log_response.Last_Premium_Response = dbService_Log._doc.Premium_Breakup;
            api_log_response.Summary = {
                "Service_Log_Id": dbService_Log._doc['Service_Log_Id'],
                "Service_Log_Unique_Id_Core": dbService_Log._doc['Service_Log_Unique_Id'],
                "Service_Log_Unique_Id": dbService_Log._doc['Service_Log_Unique_Id'] + '_' + dbService_Log._doc['Service_Log_Id'] + '_' + objBase.udid,
                "Request_Unique_Id": dbService_Log._doc['Request_Unique_Id'] + '_' + objBase.udid,
                "Request_Unique_Id_Core": dbService_Log._doc['Request_Unique_Id'],
                "Insurer_Transaction_Identifier": dbService_Log._doc['Insurer_Transaction_Identifier'],
                "Created_On": dbService_Log._doc['Created_On'],
                "Product_Id": dbService_Log._doc['Product_Id'],
                "Insurer_Id": dbService_Log._doc['Insurer_Id'],
                "Plan_Id": dbService_Log._doc['Plan_Id'],
                "Addon_Mode": dbService_Log._doc['Addon_Mode'] || '',
                "Plan_Name": dbService_Log._doc['Plan_Name'],
                "Insurer_Addon_List": dbService_Log._doc['Insurer_Addon_List'] || {} //**mg
            };
            var dbCollLog = myDb.collection('service_logs');
            var sl_all_cond = {
                'Request_Id': dbService_Log._doc['Request_Id'],
                'Method_Type': 'Premium',
                'Insurer_Id': dbService_Log._doc['Insurer_Id']
            };
            if (dbService_Log._doc['Method_Type'] == 'Proposal') {
                sl_all_cond = {
                    'Request_Unique_Id': dbService_Log._doc['Request_Unique_Id'],
                    'Method_Type': 'Premium',
                    'Insurer_Id': dbService_Log._doc['Insurer_Id']
                };
            }
            /*dbCollLog.find(sl_all_cond).sort({'Plan_Id': 1}).toArray(function (err, dbLogItems) {
                if (err) {

             } else if (!dbLogItems) {*/

            var service_log_args = {
                data: {
                    query: sl_all_cond,
                    query_options: {
                        toArray: 1,
                        sort: { 'Plan_Id': 1 }
                    }
                },
                headers: {
                    "Content-Type": "application/json"
                }
            };
            client.post(config.environment.weburl + '/service_log/find', service_log_args, (dbLogItems, response) => {
                if (!dbLogItems) {
                    console.error('Exception', 'api_log_summary', 'SL log not found', sl_all_cond);
                    objBase.response_object.json({ 'Msg': 'No such record' });
                } else {
                    var Premium_Response = null;
                    if (Product_Id === 2 || Product_Id === 13 || Product_Id === 5 || Product_Id === 15 || Product_Id === 16 || Product_Id === 18 || Product_Id === 4 || Product_Id === 19 || Product_Id === 8) {
                        var All_Response = {};
                        for (var k in dbLogItems) {
                            if (dbLogItems[k]['Error_Code'] === "" && dbLogItems[k]['Status'] == 'complete' && dbLogItems[k]['Premium_Breakup']) {
                                if (typeof All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']] == 'undefined') {
                                    //                                        var Filtered_Request = objBase.insurer_request_filter(dbLogItems[k]['LM_Custom_Request']);
                                    All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']] = {
                                        "Service_Log_Id": dbLogItems[k]['Service_Log_Id'],
                                        "Service_Log_Unique_Id": dbLogItems[k]['Service_Log_Unique_Id'],
                                        "Insurer_Id": dbLogItems[k]['Insurer_Id'],
                                        "Insurer": null,
                                        "Premium_Breakup": dbLogItems[k]['Premium_Breakup'],
                                        "Insurer_Response": [],
                                        "Addon_List": {}
                                        //                                            "Plan_List": [],
                                        //                                            "LM_Custom_Request": Filtered_Request
                                    };
                                    if (Product_Id === 2 || Product_Id === 8) {
                                        All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']]['Insurer_Response'] = dbLogItems[k]['Premium_Response'];
                                    } else if (Product_Id === 18) {
                                        All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']]['Addon_List'] = dbLogItems[k]['Premium_Breakup']['addon'];
                                    }
                                }

                                dbLogItems[k]['Premium_Breakup']['final_premium'] = Number(dbLogItems[k]['Premium_Breakup']['net_premium']) + Number(dbLogItems[k]['Premium_Breakup']['service_tax']);
                            }
                        }
                        Premium_Response = All_Response['Insurer_' + api_log_response.Summary.Insurer_Id];

                        var Request = require('../models/request');
                        User_Data.findOne(ud_cond, function (err, objDbUserData) {
                            if (objDbUserData) {
                                if (objDbUserData.Premium_Request) {
                                    api_log_response.Summary.User_Data_Id = objDbUserData.User_Data_Id;
                                    api_log_response.Summary.Last_Status = objDbUserData.Last_Status;
                                    api_log_response.Quote_Request = objDbUserData.Premium_Request;
                                    api_log_response.Quote_Request.crn = objDbUserData.PB_CRN;
                                    // to get insurer details
                                    var Insurer = require('../models/insurer');
                                    Insurer.findOne({ "Insurer_ID": dbService_Log._doc.Insurer_Id }, function (err, dbInsurer) {
                                        if (err) {

                                        } else {
                                            api_log_response.PB_Master.Insurer = dbInsurer._doc;
                                            objBase.api_log_summary_handler(api_log_response);
                                        }
                                    });
                                }
                                if (objDbUserData.Proposal_Request) {
                                    var ind_proposal_request = {};
                                    if (objDbUserData.Proposal_History && objDbUserData.Proposal_History.length > 0) {
                                        for (var k2 in objDbUserData.Proposal_History) {
                                            var ind_req = objDbUserData.Proposal_History[k2];
                                            if (ind_req['Insurer_Id'] === dbService_Log._doc['Insurer_Id']) {
                                                ind_proposal_request = ind_req['Form_Data'];
                                                break;
                                            }
                                        }
                                    }
                                    for (var k1 in objDbUserData.Proposal_Request) {
                                        ind_proposal_request[k1] = objDbUserData.Proposal_Request[k1];
                                    }
                                    api_log_response.Proposal_Request = ind_proposal_request;
                                }
                                if (Product_Id === 18) {
                                    if (objDbUserData.Addon_Request) {
                                        api_log_response.Addon_Request = objDbUserData.Addon_Request;
                                    }
                                } else if (Product_Id === 2 && [20, 38, 5].indexOf(api_log_response.Summary.Insurer_Id) > -1) {
                                    if (objDbUserData.Addon_Request) {
                                        api_log_response.Addon_Request = objDbUserData.Addon_Request;
                                        Premium_Response['Premium_Breakup']['addon'] = {};
                                        var addon_final_premium = 0;
                                        var addon_premium_breakup = {};
                                        let insId = api_log_response.Summary.Insurer_Id;
                                        let planId = api_log_response.Summary.Plan_Id;
                                        if (api_log_response.Summary.Addon_Mode === "ALACARTE") {
                                            for (var k in api_log_response.Addon_Request) {
                                                if (api_log_response.Addon_Request.hasOwnProperty(insId) && api_log_response.Addon_Request[insId]) {
                                                    if (api_log_response.Addon_Request[insId].hasOwnProperty(planId) && api_log_response.Addon_Request[insId][planId]) {
                                                        if (api_log_response.Addon_Request[insId][planId].hasOwnProperty('addons') && api_log_response.Addon_Request[insId][planId]['addons']) {
                                                            let addonsList = api_log_response.Addon_Request[insId][planId]['addons'];
                                                            for (var i in addonsList) {
                                                                Premium_Response['Addon_List'][i] = addonsList[i]['value'];

                                                                addon_final_premium += Premium_Response['Addon_List'][i] - 0;
                                                            }
                                                            addon_premium_breakup[k] = addonsList;
                                                            Premium_Response['Premium_Breakup']['addon'] = addon_premium_breakup;
                                                            Premium_Response['Premium_Breakup']['addon']['addon_final_premium'] = addon_final_premium;
                                                            Premium_Response['Premium_Breakup']['net_premium'] = Premium_Response['Premium_Breakup']['base_premium'] - 0 + addon_final_premium;
                                                            Premium_Response['Premium_Breakup']['service_tax'] = (Premium_Response['Premium_Breakup']['net_premium'] * 0.18);
                                                            Premium_Response['Premium_Breakup']['final_premium'] = Premium_Response['Premium_Breakup']['net_premium'] + Premium_Response['Premium_Breakup']['service_tax'];
                                                        }
                                                    }
                                                }
                                            }
                                        }

                                    }
                                }
                                api_log_response.Premium_Response = Premium_Response;
                                objBase.api_log_summary_handler(api_log_response);
                            }
                        });
                    } else {
                        var All_Response = {};
                        let obj_plan_basic = {};
                        for (let k in dbLogItems) {
                            let Insurer_Id = dbLogItems[k]['Insurer_Id'] - 0;
                            let Plan_Name = dbLogItems[k]['Plan_Name'];
                            if (dbLogItems[k]['Error_Code'] === "" && dbLogItems[k]['Status'] == 'complete' && dbLogItems[k]['Premium_Breakup']) {
                                if (typeof All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']] == 'undefined') {
                                    var Filtered_Request = objBase.insurer_request_filter(dbLogItems[k]['LM_Custom_Request']);
                                    All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']] = {
                                        "Service_Log_Id": dbLogItems[k]['Service_Log_Id'],
                                        "Service_Log_Unique_Id": dbLogItems[k]['Service_Log_Unique_Id'],
                                        "Insurer_Id": dbLogItems[k]['Insurer_Id'],
                                        "Insurer": null,
                                        "Premium_Breakup": dbLogItems[k]['Premium_Breakup'],
                                        "Addon_List": {},
                                        "Plan_List": [],
                                        "LM_Custom_Request": Filtered_Request
                                    };
                                    obj_plan_basic['Insurer_' + Insurer_Id] = {};
                                }
                                obj_plan_basic['Insurer_' + Insurer_Id][Plan_Name] = dbLogItems[k]['Premium_Breakup']['own_damage'];

                                var plan_len = All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']]['Plan_List'].length;
                                var Addon = dbLogItems[k]['Premium_Breakup']['addon'];
                                try {
                                    if ([6].indexOf(Insurer_Id) > -1) { //digit , icici     //--5May2024[Removed Digit]
                                        if (Addon.hasOwnProperty('addon_zero_dep_cover') && Addon['addon_zero_dep_cover'] > 0) {
                                            let zd_amt = Addon['addon_zero_dep_cover'];
                                            let basic_plan_name = 'Basic';
                                            if (Insurer_Id === 44 && obj_plan_basic['Insurer_' + Insurer_Id].hasOwnProperty('OD') === true) {
                                                basic_plan_name = 'OD';
                                            }
                                            let od_final_diff = obj_plan_basic['Insurer_' + Insurer_Id][Plan_Name]['od_final_premium'] - obj_plan_basic['Insurer_' + Insurer_Id][basic_plan_name]['od_final_premium'];
                                            //let od_final_diff = obj_plan_basic['Insurer_' + Insurer_Id][Plan_Name]['od_final_premium'] - obj_plan_basic['Insurer_' + Insurer_Id]['Basic']['od_final_premium'];
                                            console.error('DBG', 'diff_od_rate', 'base', Insurer_Id, zd_amt, od_final_diff);
                                            if (od_final_diff > 0) {
                                                Addon['addon_zero_dep_cover'] = zd_amt + od_final_diff;
                                            }
                                        }
                                    }
                                } catch (e) {
                                    console.error('Exception', 'diff_od_rate', 'base', Insurer_Id, e.stack);
                                }
                                var Plan_Addon = {};
                                for (var key in Addon) {
                                    if (key.indexOf('final') < 0 && (Addon[key] - 0) > 0) {
                                        var Addon_Amt = Math.round(Addon[key] - 0);
                                        if (Addon_Amt > 0 && dbLogItems[k]['Insurer_Id'] == 13 && key === 'addon_zero_dep_cover' && All_Response['Insurer_13']['Premium_Breakup']['own_damage']['od_loading'] > 0) {
                                            Addon_Amt = Addon_Amt - Math.round(All_Response['Insurer_13']['Premium_Breakup']['own_damage']['od_loading'] * 1.18);
                                            dbLogItems[k]['Premium_Breakup']['addon']['addon_final_premium'] = dbLogItems[k]['Premium_Breakup']['addon']['addon_final_premium'] - Math.round(All_Response['Insurer_13']['Premium_Breakup']['own_damage']['od_loading'] * 1.18);
                                        }
                                        Plan_Addon[key] = Addon_Amt;
                                        ////console.log(key,Addon_Amt);
                                        All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']]['Addon_List'][key] = Addon_Amt;
                                    }
                                }

                                dbLogItems[k]['Premium_Breakup']['net_premium'] = (dbLogItems[k]['Premium_Breakup']['own_damage']['od_final_premium'] - 0) + (dbLogItems[k]['Premium_Breakup']['liability']['tp_final_premium'] - 0);
                                dbLogItems[k]['Premium_Breakup']['service_tax'] = (dbLogItems[k]['Insurer_Id'] === 11 && Product_Id === 12 )  ? dbLogItems[k]['Premium_Breakup']['service_tax'] : (dbLogItems[k]['Premium_Breakup']['net_premium'] * 0.18);
                                dbLogItems[k]['Premium_Breakup']['final_premium'] = dbLogItems[k]['Premium_Breakup']['net_premium'] + dbLogItems[k]['Premium_Breakup']['service_tax'];
                                All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']]['Plan_List'][plan_len] = {
                                    "Plan_Id": dbLogItems[k]['Plan_Id'],
                                    "Plan_Name": dbLogItems[k]['Plan_Name'],
                                    "Service_Log_Id": dbLogItems[k]['Service_Log_Id'],
                                    "Service_Log_Unique_Id": dbLogItems[k]['Service_Log_Unique_Id'],
                                    "Insurer_Transaction_Identifier": dbLogItems[k]['Insurer_Transaction_Identifier'],
                                    'Plan_Addon_Breakup': Plan_Addon,
                                    'Plan_Addon_Premium': dbLogItems[k]['Premium_Breakup']['addon']['addon_final_premium']
                                };
                                delete dbLogItems[k]['Premium_Breakup']['addon'];
                            }
                        }
                        Premium_Response = All_Response['Insurer_' + api_log_response.Summary.Insurer_Id];
                        //console.error('Log','APISUMMARYDBG',Premium_Response);

                        var Request = require('../models/request');
                        User_Data.findOne(ud_cond, function (err, objDbUserData) {
                            if (objDbUserData) {
                                if (objDbUserData.Premium_Request) {
                                    api_log_response.Summary.User_Data_Id = objDbUserData.User_Data_Id;
                                    api_log_response.Summary.Last_Status = objDbUserData.Last_Status;
                                    api_log_response.Quote_Request = objDbUserData.Premium_Request;
                                    api_log_response.Quote_Request.crn = objDbUserData.PB_CRN;
                                    api_log_response.PB_Master.Vehicle = objDbUserData && objDbUserData.Master_Details && objDbUserData.Master_Details.vehicle ? objDbUserData.Master_Details.vehicle : "";
                                    api_log_response.PB_Master.Rto = objDbUserData && objDbUserData.Master_Details && objDbUserData.Master_Details.rto ? objDbUserData.Master_Details.rto : "";
                                    var Vehicles_Insurer = require('../models/vehicles_insurer');
                                    var Insurer_Vehicle_ID = dbService_Log._doc.LM_Custom_Request.insurer_vehicle_id;
                                    Vehicles_Insurer.findOne({ "Insurer_Vehicle_ID": Insurer_Vehicle_ID }, function (err, dbVehicles_Insurer) {
                                        if (err) {

                                        } else {
                                            api_log_response.Insurer_Master.Vehicle = dbVehicles_Insurer._doc;
                                            objBase.api_log_summary_handler(api_log_response);
                                        }
                                    });
                                    // to get insurer details
                                    var Insurer = require('../models/insurer');
                                    Insurer.findOne({ "Insurer_ID": dbService_Log._doc.Insurer_Id }, function (err, dbInsurer) {
                                        if (err) {

                                        } else {
                                            api_log_response.PB_Master.Insurer = dbInsurer._doc;
                                            objBase.api_log_summary_handler(api_log_response);
                                        }
                                    });
                                    // to get insurer details

                                    // to get insurer details

                                    var Vehicle_Detail = require('../models/vehicle_detail');
                                    var registration_no = dbService_Log._doc.LM_Custom_Request.registration_no;
                                    registration_no = registration_no.replace(/-/g, '');
                                    if (registration_no != '' && registration_no.length === 10 && registration_no.indexOf('AA1234') < 0 && registration_no.indexOf('ZZ9999') < 0) {
                                        console.error('vehicle_details', registration_no);
                                        Vehicle_Detail.findOne({ "Registration_Number": registration_no }, null, { sort: { Vehicle_Detail_Id: -1 } }, function (err, dbVehicle_Detail) {
                                            if (err) {
                                                console.error('vehicle_details', 'err', err);
                                            } else {
                                                //console.error('vehicle_details', 'db', dbVehicle_Detail);
                                                if (dbVehicle_Detail) {
                                                    api_log_response.PB_Master.Vehicle_Details = dbVehicle_Detail._doc;
                                                } else {
                                                    api_log_response.PB_Master.Vehicle_Details = {};
                                                }
                                                objBase.api_log_summary_handler(api_log_response);
                                            }
                                        });
                                    } else {
                                        api_log_response.PB_Master.Vehicle_Details = {};
                                    }

                                }
                                if (objDbUserData.Proposal_Request) {
                                    var ind_proposal_request = {};
                                    if (objDbUserData.Proposal_History && objDbUserData.Proposal_History.length > 0) {
                                        for (var k2 in objDbUserData.Proposal_History) {
                                            var ind_req = objDbUserData.Proposal_History[k2];
                                            if ((ind_req['Insurer_Id'] - 0) == (dbService_Log._doc['Insurer_Id'] - 0)) {
                                                ind_proposal_request = ind_req['Form_Data'];
                                                break;
                                            }
                                        }
                                    }
                                    for (var k1 in objDbUserData.Proposal_Request) {
                                        try {
                                            ind_proposal_request[k1] = objDbUserData.Proposal_Request[k1];
                                        } catch (ex1) {

                                        }
                                    }
                                    api_log_response.Proposal_Request = ind_proposal_request;
                                }
                                if (objDbUserData.Addon_Request) {
                                    api_log_response.Addon_Request = objDbUserData.Addon_Request;
                                    if (api_log_response.Addon_Request.hasOwnProperty('addon_standalone') === false) {
                                        api_log_response.Addon_Request = {
                                            'addon_standalone': objDbUserData.Addon_Request,
                                            'addon_package': {}
                                        }
                                    }
                                    Premium_Response['Premium_Breakup']['addon'] = {};
                                    var addon_final_premium = 0;
                                    var addon_premium_breakup = {};
                                    if (api_log_response.Summary.Addon_Mode === "ALACARTE") {
                                        for (var k in api_log_response.Addon_Request.addon_standalone) {
                                            if (Premium_Response['Addon_List'].hasOwnProperty(k) && Premium_Response['Addon_List'][k] > 0 && api_log_response.Addon_Request.addon_standalone[k] === 'yes') {
                                                if (false && api_log_response.Summary.Insurer_Id == 13 && k === 'addon_zero_dep_cover' && Premium_Response['Premium_Breakup']['own_damage']['od_loading'] > 0) {
                                                    Premium_Response['Addon_List'][k] = Premium_Response['Addon_List'][k] - Math.round(Premium_Response['Premium_Breakup']['own_damage']['od_loading'] * 1.18);
                                                }
                                                addon_final_premium += Premium_Response['Addon_List'][k] - 0;
                                                addon_premium_breakup[k] = Premium_Response['Addon_List'][k];
                                            }
                                        }
                                    }
                                    Premium_Response['Premium_Breakup']['addon'] = addon_premium_breakup;
                                    Premium_Response['Premium_Breakup']['addon']['addon_final_premium'] = addon_final_premium;
                                    Premium_Response['Premium_Breakup']['net_premium'] = (Premium_Response['Premium_Breakup']['own_damage']['od_final_premium'] - 0) + (Premium_Response['Premium_Breakup']['liability']['tp_final_premium'] - 0);
                                    Premium_Response['Premium_Breakup']['net_premium'] += addon_final_premium;
                                    Premium_Response['Premium_Breakup']['service_tax'] = (Premium_Response['Premium_Breakup']['net_premium'] * 0.18);
                                    Premium_Response['Premium_Breakup']['final_premium'] = Premium_Response['Premium_Breakup']['net_premium'] + Premium_Response['Premium_Breakup']['service_tax'];
                                }

                                api_log_response.Premium_Response = Premium_Response;
                                objBase.api_log_summary_handler(api_log_response);
                            }
                        });
                    }

                }
            });
            //  to get insurer vehicle master
            //                var Request = require('../models/request');
            //                Request.findOne({"Request_Id": dbService_Log._doc['Request_Id']}, function (err, dbRequest) {
            //                    if (err) {
            //
            //                    } else {
            //                        api_log_response.Quote_Request = dbRequest._doc.Request_Core;
            //                        objBase.api_log_summary_handler(api_log_response);
            //                    }
            //                });

        } else {
            console.error('API_LOG_SUMMARY', 'No such record');
            objBase.response_object.json({ 'Msg': 'No such record' });
        }
    }
}

module.exports = Base;