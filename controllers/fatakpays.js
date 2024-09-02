/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
var Client = require('node-rest-client').Client;
var client = new Client();
var moment = require('moment');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var fs = require('fs');
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true});
var db = mongoose.connection;
//
db.on('error', () => console.log("Error in Connecting to Database"));
db.once('open', () => console.log("Connected to Database"));

module.exports.controller = function (app) {
    app.post('/fatakpays/update_transaction_details', function (req, res) {
        let objSummary = {};
        try {
            var Client = require('node-rest-client').Client;
            var client = new Client();
            req.body = JSON.parse(JSON.stringify(req.body));
            let objRequest = req.body;
            let user_data = require('../models/user_data');
            let update_query = {};
            if (objRequest && objRequest.udid && objRequest.proposal_id) {
                let updateObj = {
                    'Last_Status': 'TRANS_SUCCESS_WITH_FIRST_EMI'
                };
                update_query['User_Data_Id'] = (objRequest && objRequest.udid - 0) || 0;
                user_data.findOneAndUpdate(update_query, {$set: updateObj}, {new : true}, function (tnx_err, dbUserData) {
                    if (tnx_err) {
                        objSummary['Status'] = "FAIL";
                        objSummary['Msg'] = "TRANSACTION STATUS FAIL TO UPDATE";
                        objSummary['Data'] = tnx_err;
                        res.send(objSummary);
                    } else {
                        client.get(config.environment.weburl + "/fatakpays/mail_send?udid=" + (objRequest.udid - 0), function (send_mail_data, send_mail_response) {
                            if (send_mail_data && send_mail_data.Status === "SUCCESS") {
                                objSummary['Status'] = "SUCCESS";
                                objSummary['Msg'] = "TRANSACTION STATUS UPDATED SUCCESSFULLY AND MAIL SEND TO CUSTOMER";
                                objSummary['Data'] = dbUserData;
                                res.send(objSummary);
                            } else {
                                objSummary['Status'] = "SUCCESS";
                                objSummary['Msg'] = "TRANSACTION STATUS UPDATED SUCCESSFULLY BUT FAIL TO SEND MAIL";
                                objSummary['Data'] = dbUserData;
                                res.send(objSummary);
                            }
                        });
                    }
                });
            } else {
                objSummary['Status'] = "FAIL";
                objSummary['Msg'] = "UDID OR PROPOSAL ID IS MISSING";
                objSummary['Data'] = "";
                res.send(objSummary);
            }
        } catch (e) {
            objSummary['Status'] = "FAIL";
            objSummary['Msg'] = "EXCEPTION IN API";
            objSummary['Data'] = e.stack;
            res.send(objSummary);
        }
    });
    app.post('/fatakpays/save_fatakpay_histories', function (req, res) {
        try {
            var fatakpay_history = require('../models/fatakpay_history');
            req.body = JSON.parse(JSON.stringify(req.body));
            let objRequest = req.body;
            let saveFatakpayHistory = new fatakpay_history(objRequest);
            saveFatakpayHistory.save(function (saveFatakpayHistory_err, saveFatakpayHistory_data) {
                if (saveFatakpayHistory_err) {
                    console.error('Error while storing data in fatakpay history', saveFatakpayHistory_err);
                    res.send({"Status": "FAIL", "Msg": "FAIL TO STORE DATA IN FATAKPAY HISTORY COLLECTION", "Data": saveFatakpayHistory_err});
                } else {
                    res.send({"Status": "SUCCESS", "Msg": "DATA STORED SUCCESSFULLY IN FATAKPAY HISTORY COLLECTION", "Data": saveFatakpayHistory_data});
                }
            });
        } catch (e) {
            res.send({"Status": "FAIL", "Msg": e.stack});
        }
    });
    app.get("/fatakpays/mail_send", function (req, res) {
        let objSummary = {};
        try {
            var fatakpay_details = require('../models/fatakpay_detail');
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let objRequest = req.query;
            let udid = objRequest.udid;
            let objProduct = {
                '1': 'Car',
                '10': 'TW',
                '12': 'CV'
            };
            client.get(config.environment.weburl + '/user_datas/view/' + udid, {}, function (user_datas, user_datas_res) {
                if (user_datas.length > 0) {
                    let user_datas_data = user_datas[0];
                    let crn = user_datas_data.PB_CRN;
                    let product_short_name = objProduct[user_datas_data.Product_Id];
                    let find_args = {
                        PB_CRN: crn,
                        User_Data_Id: udid
                    };
                    fatakpay_details.find(find_args, function (fatakpay_details_err, fatakpay_details_data) {
                        if (fatakpay_details_data) {
                            let db_fatakpay_details = fatakpay_details_data[0]._doc || {};
                            let email_data = "";
                            email_data = fs.readFileSync(appRoot + '/resource/email/Fatakpay_Payment_Confirm.html').toString();
                            let proposal_request = user_datas_data.Proposal_Request || "";
                            let full_name = "";
                            let first_name = proposal_request.first_name && proposal_request.first_name.trim() || "";
                            let middle_name = proposal_request.middle_name && proposal_request.middle_name.trim() || "";
                            let last_name = proposal_request.last_name && proposal_request.last_name.trim() || "";
                            let email = proposal_request.email || "";
                            if (middle_name) {
                                full_name = first_name + " " + middle_name + " " + last_name;
                            } else {
                                full_name = first_name + " " + last_name;
                            }
                            let final_premium = "Rs. NA";
                            if (db_fatakpay_details.Installment_Amt && db_fatakpay_details.Installment_Amt > 0) {
                                final_premium = rupessFormat(db_fatakpay_details.Installment_Amt);
                            }
                            full_name = full_name && full_name.trim() || "";
                            let objReplaceData = {
                                "___application_id___": db_fatakpay_details.Application_Loan_Id || "NA",
                                "___crn___": db_fatakpay_details.PB_CRN || "NA",
                                "___amount_paid___": final_premium,
                                "___payment_date___": moment(db_fatakpay_details.Installment_On).format('DD MMM, YYYY') || "NA",
                                "___emi_paid_on___": moment(db_fatakpay_details.Installment_On).format('DD MMM, YYYY') || "NA",
                                "___customer_name___": full_name || "NA"
                            };
                            email_data = email_data.replaceJson(objReplaceData);
                            var Email = require('../models/email');
                            var Const_objModelEmail = new Email();
                            let sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[' + product_short_name + '] EMI Payment Successfully for CRN : ' + crn;
                            let arr_to = ["anuj.singh@policyboss.com"];
                            let arr_cc = [];
                            let arr_bcc = [config.environment.notification_email];
                            if (email) {
                                arr_to.push(email);
                            }
                            Const_objModelEmail.send('noreply@policyboss.com', arr_to.join(','), sub, email_data, arr_cc.join(','), arr_bcc.join(','), crn);
                            let subject_redirectURL = "";
                            let email_data_redirectURL = "";
                            let objReplaceData_RedirectedURL = {};
                            email_data_redirectURL = fs.readFileSync(appRoot + '/resource/email/Fatakpay_Document_Verification.html').toString();
                            if (db_fatakpay_details.RedirectURL) {
                                subject_redirectURL = `EMI Document Verification link CRN : ${db_fatakpay_details.PB_CRN}, Application ID : ${db_fatakpay_details.Application_Loan_Id}`; //"EMI Document Verification link.";
                                objReplaceData_RedirectedURL = {
                                    "___customer_name___": full_name || "NA",
                                    "___RedirectedURL___": db_fatakpay_details.RedirectURL || "NA",
                                    "___success_document_style___": "block",
                                    "___fail_document_style___": "none",
                                    "___eligible___" : "none"
                                };
                            } else {
                                subject_redirectURL = `EMI Document Verification link not available CRN : ${db_fatakpay_details.PB_CRN}, Application ID : ${db_fatakpay_details.Application_Loan_Id}`;
                                objReplaceData_RedirectedURL = {
                                    "___customer_name___": full_name || "NA",
                                    "___success_document_style___": "none",
                                    "___fail_document_style___": "block",
                                    "___eligible___" : "none"
                                };
                            }
                            email_data_redirectURL = email_data_redirectURL.replaceJson(objReplaceData_RedirectedURL);
                            Const_objModelEmail.send('noreply@policyboss.com', arr_to.join(','), subject_redirectURL, email_data_redirectURL, arr_cc.join(','), arr_bcc.join(','), crn);
                            objSummary['Status'] = 'SUCCESS';
                            objSummary['Msg'] = 'RECORD AVAILABLE IN FATAKPAY DETAILS AND MAIL SEND SUCCESSFULLY';
                            objSummary['Data'] = fatakpay_details_data;
                            res.send(objSummary);
                        } else {
                            objSummary['Status'] = 'FAIL';
                            objSummary['Msg'] = 'NO RECORD AVAILABLE IN FATAKPAY DETAILS';
                            objSummary['Data'] = fatakpay_details_data;
                            res.send(objSummary);
                        }
                    });
                } else {
                    objSummary['Status'] = 'FAIL';
                    objSummary['Msg'] = 'NO RECORD AVAILABLE IN USER DATAS';
                    objSummary['Data'] = user_datas;
                    res.send(objSummary);
                }
            });
        } catch (err) {
            objSummary['Status'] = 'FAIL';
            objSummary['Msg'] = 'EXCEPTION IN API';
            objSummary['Data'] = err.stack;
            res.send(objSummary);
        }
    });
    app.get("/fatakpay/redirecturl", function (req, res) {
        let objSummary = {};
        try {
            var fatakpay_detail = require('../models/fatakpay_detail.js');
            req.body = JSON.parse(JSON.stringify(req.body));
            let fatakpayDetailsFindQuery = {};
            if (req && req.query && req.query.source && req.query.source === "udid") {
                fatakpayDetailsFindQuery['User_Data_Id'] = (req.query.id - 0);
            } else {
                fatakpayDetailsFindQuery['Transaction_Id'] = (req.query.id - 0);
            }
            fatakpay_detail.findOne(fatakpayDetailsFindQuery).exec(function (err, dbData) {
                if (err) {
                    objSummary['Status'] = 'FAIL';
                    objSummary['Msg'] = 'ERROR WHILE FETCHING DATA FROM DB';
                    objSummary['Data'] = err;
                    res.send(objSummary);
                } else {
                    objSummary['Status'] = 'SUCCESS';
                    objSummary['Msg'] = 'RECORED FETCHED SUCCESSFULLY';
                    objSummary['Data'] = dbData;
                    res.send(objSummary);
                }
            });
        } catch (err) {
            objSummary['Status'] = 'FAIL';
            objSummary['Msg'] = 'EXCEPTION IN /fatakpay/redirecturl';
            objSummary['Data'] = err.stack;
            res.send(objSummary);
        }
    });

    
    app.post("/fatakpays/save_eligibility_details", function (req, res) {
        try {
            var fatakpay_details = require('../models/fatakpay_detail');
            var Email = require('../models/email');
            var objModelEmail = new Email();
            req.body = JSON.parse(JSON.stringify(req.body));
            let objRequest = req.body || {};
            let objRequestCore = objRequest && objRequest.reqBody || objRequest;
            let LM_Data = objRequest && objRequest.LM_DATA || {};
            let eligibility_response = objRequest && objRequest.eligibility_response_json || {};
            let source = objRequest && objRequest.source || "";
            let proposal_id = objRequestCore.proposal_id && objRequestCore.proposal_id - 0 || "";
            let customerEmail = LM_Data && LM_Data.Email || "";
            let customerName = LM_Data && LM_Data.Name || "";
            let details_find_query = {PB_CRN: objRequestCore.crn, User_Data_Id: objRequestCore.udid};
            let save_data_in_history = {
                "PB_CRN": objRequestCore.crn && objRequestCore.crn - 0 || "",
                "User_Data_Id": objRequestCore.udid && objRequestCore.udid - 0 || "",
                "Proposal_Id": objRequestCore.proposal_id && objRequestCore.proposal_id - 0 || "",
                "Insurer_Id": objRequestCore.insurer_id && objRequestCore.insurer_id - 0 || "",
                "Application_Loan_Id": (eligibility_response && eligibility_response.data && eligibility_response.data.loan_application_id && eligibility_response.data.loan_application_id - 0) || "",
                "Premium_Amount": objRequestCore.premium_amount && Math.round(objRequestCore.premium_amount - 0) || "",
                "Tenure": null,
                "PAN": objRequestCore.pan || "",
                "EMI_Status": "PENDING",
                "RedirectURL": "",
                "Ss_Id": (LM_Data.Ss_Id && LM_Data.Ss_Id - 0) || (objRequest && objRequest.ss_id - 0)
            };
            fatakpay_details.find(details_find_query, function (fatakpay_details_err, fatakpay_details_data) {
                if (fatakpay_details_err) {
                    res.send({'Status': 'FAIL', 'Msg': 'ERROR IN FATAKPAY DETAILS', 'Data': fatakpay_details_err});
                } else {
                    let update_eligible_status = "PENDING";
                    if (source === "EMI_Initiated") {
                        loan_application_ID = null;
                        let status_condition = ['ELIGIBLE', 'NOT_ELIGIBLE'];
                        details_find_query['EMI_Status'] = {nin: status_condition};
                    } else {
                        if (eligibility_response && eligibility_response.success && eligibility_response.success === true) {
                            loan_application_ID = (eligibility_response && eligibility_response.data && eligibility_response.data.loan_application_id) || null;
                            LM_Data['Application_Loan_Id'] = loan_application_ID;
                            LM_Data['Tenure'] = eligibility_response['data']['tenure'] || null;
                            update_eligible_status = "ELIGIBLE";
                        } else {
                            LM_Data['Tenure'] = null;
                            loan_application_ID = null;
                            update_eligible_status = "NOT_ELIGIBLE";
                        }
                    }
                    let save_fatakpay_history_url = config.environment.weburl + '/fatakpays/save_fatakpay_histories';
                    let email_data = "";
                    let objReplaceData = {};
                    email_data = fs.readFileSync(appRoot + '/resource/email/Fatakpay_Document_Verification.html').toString();
                    if (fatakpay_details_data && fatakpay_details_data.length > 0) {
                        if (fatakpay_details_data[0].EMI_Status !== "ELIGIBLE" && update_eligible_status === "ELIGIBLE") {
                            let subject = `Congratulations! You are Eligible for EMI CRN : ${objRequestCore.crn}, Application ID : ${eligibility_response.data.loan_application_id}`;
                            objReplaceData = {
                                "___crn___" : objRequestCore.crn || "",
                                "___application_id___" : eligibility_response.data.loan_application_id || "",
                                "___date___" : moment().format('DD MMM, YYYY'),
                                "___pan___" : objRequestCore.pan || "",
                                "___customer_name___": customerName || "",
                                "___success_document_style___" : "none",
                                "___fail_document_style___" : "none",
                                "___eligible___" : "block"
                            };
                            email_data = email_data.replaceJson(objReplaceData);
                            let arrCc = [];
                            let arrBcc = [config.environment.notification_email];
                            objModelEmail.send('noreply@policyboss.com', customerEmail, subject, email_data, arrCc.join(','), arrBcc.join(','), '');
                        }
                        let update_details_data = {
                            'EMI_Status': update_eligible_status || "",
                            'Application_Loan_Id': loan_application_ID || "",
                            'Proposal_Id': proposal_id || "",
                            'PAN': objRequestCore.pan || "",
                            'Premium_Amount': objRequestCore.premium_amount && Math.round(objRequestCore.premium_amount - 0) || "",
                            'Modified_On': new Date()
                        };
                        fatakpay_details.updateOne(details_find_query, {$set: update_details_data}, function (err, numAffected) { // Fatakpay_Status
                            if (err) {
                                res.send({'Status': 'FAIL', 'Msg': 'ERROR IN FATAKPAY UPDATE DETAILS', 'Data': err});
                            } else {
                                LM_Data['EMI_Status'] = update_eligible_status; //(eligibility_response_json["EMI_Status"] === 'SUCCESS') ? 'ELIGIBLE' : 'NOT_ELIGIBLE'; // 'ELIGIBLE_' + eligibility_response_json["Status"];
                                let save_fatakpay_history_args = {
                                    data: (source === "EMI_Initiated") ? save_data_in_history : LM_Data,
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                };
                                try {
                                    client.post(save_fatakpay_history_url, save_fatakpay_history_args, function (save_fatakpay_history_data, save_fatakpay_history_response) {
                                        res.send({
                                            "Status": "SUCCESS",
                                            "Msg": "DATA STORED",
                                            "Data": ""
                                        });
                                    });
                                } catch (e) {
                                }
                            }
                        });
                    } else {
                        if (update_eligible_status === "ELIGIBLE") {
                            let subject = `Congratulations! You are Eligible for EMI CRN : ${objRequestCore.crn}, Application ID : ${eligibility_response.data.loan_application_id}`;;
                            objReplaceData = {
                                "___crn___" : objRequestCore.crn || "",
                                "___application_id___" : eligibility_response.data.loan_application_id || "",
                                "___date___" : moment().format('DD MMM, YYYY'),
                                "___pan___" : objRequestCore.pan || "",
                                "___customer_name___": customerName || "",
                                "___success_document_style___" : "none",
                                "___fail_document_style___" : "none",
                                "___eligible___" : "block"
                            };
                            email_data = email_data.replaceJson(objReplaceData);
                            let arrCc = [];
                            let arrBcc = [config.environment.notification_email];
                            objModelEmail.send('noreply@policyboss.com', customerEmail, subject, email_data, arrCc.join(','), arrBcc.join(','), '');
                        }
                        let saveDetails = {
                            "PB_CRN": objRequestCore.crn && objRequestCore.crn - 0 || "",
                            "User_Data_Id": objRequestCore.udid && objRequestCore.udid - 0 || "",
                            "Proposal_Id": objRequestCore.proposal_id && objRequestCore.proposal_id - 0 || "",
                            "Insurer_Id": objRequestCore.insurer_id && objRequestCore.insurer_id - 0 || "",
                            "Application_Loan_Id": (eligibility_response && eligibility_response.data && eligibility_response.data.loan_application_id && eligibility_response.data.loan_application_id - 0) || "",
                            "Premium_Amount": objRequestCore.premium_amount && Math.round(objRequestCore.premium_amount - 0) || "",
                            "Tenure": null,
                            "PAN": objRequestCore.pan || "",
                            "EMI_Status": "PENDING",
                            "RedirectURL": "",
                            "Ss_Id": (LM_Data.Ss_Id && LM_Data.Ss_Id - 0) || (objRequest && objRequest.ss_id - 0)
                        };
                        
                        saveDetails['EMI_Status'] = eligibility_response && eligibility_response.data && eligibility_response.data.eligibility_status && eligibility_response.data.eligibility_status === true ? "ELIGIBLE" : "PENDING";
                        let saveFatakpayDetails = new fatakpay_details(saveDetails);
                        saveFatakpayDetails.save(function (saveFatakpayDetails_err, saveFatakpayDetails_Resp) {
                            if (saveFatakpayDetails_err) {
                                res.send({'Status': 'FAIL', 'Msg': 'ERROR IN FATAKPAY SAVE DETAILS', 'Data': saveFatakpayDetails_err});
                            } else {
                                LM_Data['EMI_Status'] = update_eligible_status;
                                let save_fatakpay_history_args = {
                                    data: (source === "EMI_Initiated") ? save_data_in_history : LM_Data,
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                };
                                try {
                                    client.post(save_fatakpay_history_url, save_fatakpay_history_args, function (save_fatakpay_history_data, save_fatakpay_history_response) {
                                        res.send({
                                            "Status": "SUCCESS",
                                            "Msg": "DATA STORED",
                                            "Data": ""
                                        });
                                    });
                                } catch (e) {
                                }
                            }
                        });
                    }
                }
            });
        } catch (e) {
            res.send({'Status': 'FAIL', 'Msg': 'EXCEPTION IN API', 'Data': e.stack});
        }
    });
    function rupessFormat(num) {
        if (num) {
            num = num - 0;
            let curr = num.toLocaleString();
            return "Rs. " + curr;
        } else {
            return "NA";
        }
    }
};