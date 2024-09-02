/* Author: Dipali Revanwar
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var kyc_detail = require('../models/kyc_detail');
var kyc_history = require('../models/kyc_history');
let kyc_webhook_history = require('../models/kyc_webhook_history');
var moment = require('moment');
var crypto = require('crypto');
let jwt = require('jwt-simple');
let secret = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyzABCDEFGHIJKL';
var fs = require('fs');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var CryptoJS = require('crypto-js');
var NodeRSA = require("node-rsa");
const uuidv4 = require('uuid/v4');
let uuid = uuidv4();
module.exports.controller = function (app) {
    var Insurer_Kyc_Key = {
        9: {
            DOB: 'dob',
            kyc_no_node: 'ckyc_number',
            kyc_verified_node: 'kyc_verified',
            kyc_verified_value: 'true',
            unique_no: 'PB_CRN',
            insurer_name: 'Reliance',
            ckycno: 'ckyc_number',
            first_name: 'first_name',
            middle_name: 'middle_name',
            last_name: 'last_name',
            unique_no_node: 'PB_CRN',
        },
        46: {
            DOB: 'DOB',
            kyc_no_node: 'IC_KYC_No',
            kyc_verified_node: 'KYC_Status',
            kyc_verified_value: '1',
            unique_no: 'VISoF_KYC_Req_No',
            insurer_name: 'Edelweiss',
            ckycno: 'ckyc_number',
            first_name: 'FirstName',
            middle_name: 'MiddleName',
            last_name: 'LastName',
        }

    };
    app.post('/kyc_details/hdfc_fetch_kyc_details_NIU', function (req, res) {
        try {
            let ObjRequest = req.body;
            let kyc_fetch_request = "";
            let kyc_fetch_response = "";
            var user_name = null;
            if (ObjRequest['Proposal_Request'].middle_name === undefined || ObjRequest['Proposal_Request'].middle_name === "" || ObjRequest['Proposal_Request'].middle_name === null) {
                user_name = ((ObjRequest['Proposal_Request'].first_name === undefined || ObjRequest['Proposal_Request'].first_name === "" || ObjRequest['Proposal_Request'].first_name === null) ? "" : ObjRequest['Proposal_Request'].first_name) + " " +
                        ((ObjRequest['Proposal_Request'].last_name === undefined || ObjRequest['Proposal_Request'].last_name === "" || ObjRequest['Proposal_Request'].last_name === null) ? "" : ObjRequest['Proposal_Request'].last_name);
            } else {
                user_name = ((ObjRequest['Proposal_Request'].first_name === undefined || ObjRequest['Proposal_Request'].first_name === "" || ObjRequest['Proposal_Request'].first_name === null) ? "" : ObjRequest['Proposal_Request'].first_name) + " " +
                        ((ObjRequest['Proposal_Request'].middle_name === undefined || ObjRequest['Proposal_Request'].middle_name === "" || ObjRequest['Proposal_Request'].middle_name === null) ? "" : ObjRequest['Proposal_Request'].middle_name) + " " +
                        ((ObjRequest['Proposal_Request'].last_name === undefined || ObjRequest['Proposal_Request'].last_name === "" || ObjRequest['Proposal_Request'].last_name === null) ? "" : ObjRequest['Proposal_Request'].last_name);
            }
            let req_txt = {
                "mobile": (ObjRequest.Proposal_Request.mobile === undefined || ObjRequest.Proposal_Request.mobile === "" || ObjRequest.Proposal_Request.mobile === null) ? "" : ObjRequest.Proposal_Request.mobile,
                "name": user_name,
                "kyc_id": "",
                "dob": (ObjRequest.DOB === undefined || ObjRequest.DOB === "" || ObjRequest.DOB === null) ? "" : ObjRequest.DOB,
                "ckyc_number": "",
                //"pan": (ObjRequest.PAN === undefined || ObjRequest.PAN === "" || ObjRequest.PAN === null) ? "" : ObjRequest.PAN,
                "pan": ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "PAN" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID) : "",
                "aadhaar_uid": ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "AADHAR" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : (ObjRequest.Document_ID.substr(ObjRequest.Document_ID.length - 4))): "", //"last 4 digits of aadhar",
                "agent_id": "",
                "gc_cust_id": "",
                "eia_number": "",
                "email_address": "",
                "redirect_url": "https://www.policyboss.com/webhook/ckyc/ckyc_capture/" + ObjRequest.Insurer_Id + "/" + ObjRequest.PB_CRN
            };
            kyc_fetch_request = req_txt;
            let api_key = ((config.environment.name === 'Production') ? 'd220114d-8e75-4f' : '8d399be8-0b6f-4a');
            let args = {
                data: JSON.stringify(req_txt),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "token": ""
                }
            };
            let args1 = {
                headers: {
                    "api_key": api_key
                }
            };
            let KYC_Status = "PENDING";
            let kyc_id = 0;
            let token = null;
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let LM_Data = {
                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type,//"PAN",
                "KYC_Request": kyc_fetch_request,
                "KYC_Response": "",
                "ckyc_remarks": ""
            };
            let token_url = ((config.environment.name === 'Production') ? 'https://ekyc-prod.hdfcergo.com/e-kyc/tgt/generate-token' : 'https://ekyc-uat.hdfcergo.com/e-kyc/tgt/generate-token');
            client.get(token_url, args1, function (data1, response1) {
                if (data1) {
                    if (data1.hasOwnProperty("success") && data1.success === true) {
                        if (data1.hasOwnProperty("data") && data1.data.hasOwnProperty("token") && data1.data.token !== "" && data1.data.token !== null) {
                            token = data1.data.token;
                            try {
                                if (token) {
                                    args.headers.token = token;
                                    var client1 = new Client();
                                    let kyc_fetch_url = "";
                                    if (ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "AADHAR") {
                                        kyc_fetch_url = ((config.environment.name === 'Production') ? ('https://ekyc-prod.hdfcergo.com/e-kyc/primary/kyc-verified?aadhar_uid=') : ('https://ekyc-uat.hdfcergo.com/e-kyc/primary/kyc-verified?aadhar_uid=')) + (ObjRequest.Document_ID.substr(ObjRequest.Document_ID.length - 4)) + '&dob=' + ObjRequest.DOB;
                                    } else if (ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "PAN") {
                                        kyc_fetch_url = ((config.environment.name === 'Production') ? ('https://ekyc-prod.hdfcergo.com/e-kyc/primary/kyc-verified?pan=') : ('https://ekyc-uat.hdfcergo.com/e-kyc/primary/kyc-verified?pan=')) + ObjRequest.Document_ID + '&dob=' + ObjRequest.DOB;
                                    }
                                    client1.get(kyc_fetch_url, args, function (data, response) {
                                        if (data) {
                                            kyc_fetch_response = data; // kyc_insurer_response
                                            LM_Data.KYC_Response = kyc_fetch_response;
                                            if (data.hasOwnProperty("success") && data.success === true && data.hasOwnProperty("data") && data.data.hasOwnProperty("iskycVerified")) {
                                                if (data.data.iskycVerified === 1) {
                                                    kyc_id = (data.data.hasOwnProperty("kyc_id")) ? data.data.kyc_id : "";
                                                    LM_Data.KYC_Status = "FETCH_SUCCESS";
                                                    LM_Data.KYC_Number = kyc_id;
                                                    LM_Data.KYC_FullName = (data.data.hasOwnProperty("name")) ? data.data.name : req_txt.name;
                                                    //LM_Data.KYC_Doc_No = (data.data.hasOwnProperty("pan")) ? data.data.pan : ObjRequest.Document_ID;
                                                } else if (data.data.iskycVerified === 0) {
                                                    kyc_id = (data.data.hasOwnProperty("kyc_id")) ? data.data.kyc_id : "";
                                                    LM_Data.KYC_Status = "FETCH_FAIL";
                                                    LM_Data.KYC_Redirect_URL = data.data.redirect_link;
                                                } else {
                                                    LM_Data.KYC_Status = "FETCH_FAIL";
                                                }
                                            } else {
                                                LM_Data.KYC_Status = "FETCH_FAIL";
                                            }
                                            saveKYCDetails(ObjRequest, LM_Data, kyc_fetch_request, kyc_fetch_response);
                                            res.json({"Insurer": "HDFC", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                                        } else {
                                            res.json({"Insurer": "HDFC", "Msg": "KYC fetch services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                                        }
                                    });
                                } else {
                                    res.json({"Insurer": "HDFC", "Msg": "Could Not Generate Token. Please try again later.", "Status": "FAIL"});
                                }
                            } catch (e2) {
                                res.json({"Insurer": "HDFC", "Msg": e2.stack, "Status": "FAIL"});
                            }
                        } else {
                            res.json({"Insurer": "HDFC", "Msg": "KYC-Token not generated. Please try again later.", "Status": "FAIL"});
                        }
                    } else {
                        res.json({"Insurer": "HDFC", "Msg": "KYC-Token generation services was not successful. Please try again later.", "Status": "FAIL"});
                    }
                } else {
                    res.json({"Insurer": "HDFC", "Msg": "KYC-Token generation services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                }
            });
        } catch (e1) {
            res.json({"Insurer": "HDFC", "Msg": e1.stack, "Status": "FAIL"});
        }
    });

    app.post('/kyc_details/hdfc_fetch_kyc_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            let kyc_fetch_request = "";
            let kyc_fetch_response = "";
            var user_name = null;
            if (ObjRequest['Proposal_Request'].middle_name === undefined || ObjRequest['Proposal_Request'].middle_name === "" || ObjRequest['Proposal_Request'].middle_name === null) {
                user_name = ((ObjRequest['Proposal_Request'].first_name === undefined || ObjRequest['Proposal_Request'].first_name === "" || ObjRequest['Proposal_Request'].first_name === null) ? "" : ObjRequest['Proposal_Request'].first_name) + " " +
                        ((ObjRequest['Proposal_Request'].last_name === undefined || ObjRequest['Proposal_Request'].last_name === "" || ObjRequest['Proposal_Request'].last_name === null) ? "" : ObjRequest['Proposal_Request'].last_name);
            } else {
                user_name = ((ObjRequest['Proposal_Request'].first_name === undefined || ObjRequest['Proposal_Request'].first_name === "" || ObjRequest['Proposal_Request'].first_name === null) ? "" : ObjRequest['Proposal_Request'].first_name) + " " +
                        ((ObjRequest['Proposal_Request'].middle_name === undefined || ObjRequest['Proposal_Request'].middle_name === "" || ObjRequest['Proposal_Request'].middle_name === null) ? "" : ObjRequest['Proposal_Request'].middle_name) + " " +
                        ((ObjRequest['Proposal_Request'].last_name === undefined || ObjRequest['Proposal_Request'].last_name === "" || ObjRequest['Proposal_Request'].last_name === null) ? "" : ObjRequest['Proposal_Request'].last_name);
            }
            /*let req_txt = {
                "mobile": (ObjRequest.Proposal_Request.mobile === undefined || ObjRequest.Proposal_Request.mobile === "" || ObjRequest.Proposal_Request.mobile === null) ? "" : ObjRequest.Proposal_Request.mobile,
                "name": user_name,
                "kyc_id": "",
                "dob": (ObjRequest.DOB === undefined || ObjRequest.DOB === "" || ObjRequest.DOB === null) ? "" : ObjRequest.DOB,
                "ckyc_number": "",
                //"pan": (ObjRequest.PAN === undefined || ObjRequest.PAN === "" || ObjRequest.PAN === null) ? "" : ObjRequest.PAN,
                "pan": ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "PAN" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID) : "",
                "aadhaar_uid": ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "AADHAR" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : (ObjRequest.Document_ID.substr(ObjRequest.Document_ID.length - 4))): "", //"last 4 digits of aadhar",
                "agent_id": "",
                "gc_cust_id": "",
                "eia_number": "",
                "email_address": "",
                "redirect_url": "https://www.policyboss.com/webhook/ckyc/ckyc_capture/" + ObjRequest.Insurer_Id + "/" + ObjRequest.PB_CRN
            };*/
//            kyc_fetch_request = req_txt;
            let api_key = ((config.environment.name === 'Production') ? 'd220114d-8e75-4f' : '8d399be8-0b6f-4a');
            let args = {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "token": ""
                }
            };
            let args1 = {
                headers: {
                    "api_key": api_key
                }
            };
            let KYC_Status = "PENDING";
            let kyc_id = 0;
            let token = null;
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let LM_Data = {
                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type,//"PAN",
                "KYC_Request": kyc_fetch_request,
                "KYC_Response": "",
                "ckyc_remarks": ""
            };
            let token_url = ((config.environment.name === 'Production') ? 'https://ekyc-prod.hdfcergo.com/e-kyc/tgt/generate-token' : 'https://ekyc-uat.hdfcergo.com/e-kyc/tgt/generate-token');
            client.get(token_url, args1, function (data1, response1) {
                if (data1) {
                    if (data1.hasOwnProperty("success") && data1.success === true) {
                        if (data1.hasOwnProperty("data") && data1.data.hasOwnProperty("token") && data1.data.token !== "" && data1.data.token !== null) {
                            token = data1.data.token;
                            try {
                                if (token) {
                                    args.headers.token = token;
                                    var client1 = new Client();
                                    let url_doc_params = "";
                                    var timestamp = (moment().unix() + new Date().getUTCMilliseconds()).toString();
                                    let docyTypeCode = {'PASSPORT': 'passport_number',
                                        'VOTERID': 'voter_id',
                                        'AADHAR': 'aadhar_uid',
                                        'DRIVINGLICENSE': 'driving_licence'
                                    }
                                    if (ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') !== "PAN" && docyTypeCode[ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '')]) {
                                        url_doc_params = ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') !== "AADHAR" ? `&${docyTypeCode[ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '')]}=${ObjRequest.Document_ID}` : `&${docyTypeCode[ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '')]}=${(ObjRequest.Document_ID.substr(ObjRequest.Document_ID.length - 4))}`;
                                    }
                                    let kyc_fetch_url = ((config.environment.name === 'Production') ? 
                                        ('https://ekyc-prod.hdfcergo.com/e-kyc/partner/kyc') : 
                                        ('https://ekyc-uat.hdfcergo.com/e-kyc/partner/kyc')) + 
                                        `?dob=${ObjRequest.DOB}&pan=${ObjRequest.Proposal_Request.pan}${url_doc_params}&redirect_url=https://www.policyboss.com/webhook/ckyc/ckyc_capture/${ObjRequest.Insurer_Id}/${ObjRequest.PB_CRN}&txn_id=HEGI_${timestamp}`;
                                    kyc_fetch_request = kyc_fetch_url;
                                    client1.get(kyc_fetch_url,args, function (data, response) {
                                        if (data) {
                                            kyc_fetch_response = data; // kyc_insurer_response
                                            LM_Data.KYC_Response = kyc_fetch_response;
                                            if (data.hasOwnProperty("success") && data.success === true && data.hasOwnProperty("data") && data.data.hasOwnProperty("iskycVerified")) {
                                                if (data.data.hasOwnProperty("kyc_id") && data.data.kyc_id) {
                                                    kyc_id = (data.data.hasOwnProperty("kyc_id")) ? data.data.kyc_id : "";
                                                    LM_Data.KYC_Status = "VERIFY_SUCCESS";//"FETCH_SUCCESS";
                                                    LM_Data.KYC_Number = kyc_id;
                                                    LM_Data.KYC_FullName = (data.data.hasOwnProperty("name")) ? data.data.name : user_name;
                                                    LM_Data.KYC_Ref_No = 'HEGI_'+timestamp
//                                                } else if (data.data.iskycVerified === 0) {
//                                                    kyc_id = (data.data.hasOwnProperty("kyc_id")) ? data.data.kyc_id : "";
//                                                    LM_Data.KYC_Status = "FETCH_FAIL";
//                                                    LM_Data.KYC_Redirect_URL = data.data.redirect_link;
                                                } 
                                                else {
                                                    LM_Data.KYC_Status = "FETCH_FAIL";
                                                    LM_Data.KYC_Ref_No = 'HEGI_'+timestamp;
                                                }
                                            } else {
                                                LM_Data.KYC_Status = "FETCH_FAIL";
                                                LM_Data.KYC_Ref_No = 'HEGI_'+timestamp;
                                            }
                                            saveKYCDetails(ObjRequest, LM_Data, kyc_fetch_request, kyc_fetch_response);
                                            res.json({"Insurer": "HDFC", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                                        } else {
                                            res.json({"Insurer": "HDFC", "Msg": "KYC fetch services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                                        }
                                    });
                                } else {
                                    res.json({"Insurer": "HDFC", "Msg": "Could Not Generate Token. Please try again later.", "Status": "FAIL"});
                                }
                            } catch (e2) {
                                res.json({"Insurer": "HDFC", "Msg": e2.stack, "Status": "FAIL"});
                            }
                        } else {
                            res.json({"Insurer": "HDFC", "Msg": "KYC-Token not generated. Please try again later.", "Status": "FAIL"});
                        }
                    } else {
                        res.json({"Insurer": "HDFC", "Msg": "KYC-Token generation services was not successful. Please try again later.", "Status": "FAIL"});
                    }
                } else {
                    res.json({"Insurer": "HDFC", "Msg": "KYC-Token generation services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                }
            });
        } catch (e1) {
            res.json({"Insurer": "HDFC", "Msg": e1.stack, "Status": "FAIL"});
        }
    });

    app.post('/kyc_details/hdfc_verify_kyc_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            let kyc_verify_request = "";
            let kyc_verify_response = "";
            var user_kyc_no = (ObjRequest.user_kyc_no === undefined || ObjRequest.user_kyc_no === "" || ObjRequest.user_kyc_no === null) ? "" : ObjRequest.user_kyc_no;
            var user_name = null;
            if (ObjRequest['Proposal_Request'].middle_name === undefined || ObjRequest['Proposal_Request'].middle_name === "" || ObjRequest['Proposal_Request'].middle_name === null) {
                user_name = ((ObjRequest['Proposal_Request'].first_name === undefined || ObjRequest['Proposal_Request'].first_name === "" || ObjRequest['Proposal_Request'].first_name === null) ? "" : ObjRequest['Proposal_Request'].first_name) + " " +
                        ((ObjRequest['Proposal_Request'].last_name === undefined || ObjRequest['Proposal_Request'].last_name === "" || ObjRequest['Proposal_Request'].last_name === null) ? "" : ObjRequest['Proposal_Request'].last_name);
            } else {
                user_name = ((ObjRequest['Proposal_Request'].first_name === undefined || ObjRequest['Proposal_Request'].first_name === "" || ObjRequest['Proposal_Request'].first_name === null) ? "" : ObjRequest['Proposal_Request'].first_name) + " " +
                        ((ObjRequest['Proposal_Request'].middle_name === undefined || ObjRequest['Proposal_Request'].middle_name === "" || ObjRequest['Proposal_Request'].middle_name === null) ? "" : ObjRequest['Proposal_Request'].middle_name) + " " +
                        ((ObjRequest['Proposal_Request'].last_name === undefined || ObjRequest['Proposal_Request'].last_name === "" || ObjRequest['Proposal_Request'].last_name === null) ? "" : ObjRequest['Proposal_Request'].last_name);
            }
            /*let req_txt = {
                "mobile": (ObjRequest.Mobile === undefined || ObjRequest.Mobile === "" || ObjRequest.Mobile === null) ? "" : ObjRequest.Mobile,
                "name": user_name,
                "kyc_id": user_kyc_no,
                "dob": (ObjRequest.DOB === undefined || ObjRequest.DOB === "" || ObjRequest.DOB === null) ? "" : ObjRequest.DOB,
                "ckyc_number": user_kyc_no,
                "pan": ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "PAN" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID) : "",
                "aadhaar_uid": ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "AADHAR" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : (ObjRequest.Document_ID.substr(ObjRequest.Document_ID.length - 4))) : "", //"last 4 digits of aadhar",
                "agent_id": "",
                "gc_cust_id": "",
                "eia_number": "",
                "email_address": (ObjRequest.Email === undefined || ObjRequest.Email === "" || ObjRequest.Email === null) ? "" : ObjRequest.Email,
                "redirect_url": "https://www.policyboss.com/webhook/ckyc/ckyc_capture/" + ObjRequest.Insurer_Id + "/" + ObjRequest.PB_CRN
            };*/
//            kyc_verify_request = req_txt;
            let args = {headers: {"token": ""}};
            let api_key = ((config.environment.name === 'Production') ? 'd220114d-8e75-4f' : '8d399be8-0b6f-4a');
            let args1 = {
                headers: {
                    "api_key": api_key
                }
            };
            let KYC_Status = "VERIFY_FAIL";
            let token = null;
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let LM_Data = {
                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type,//"PAN",
                "KYC_Request": kyc_verify_request,
                "KYC_Response": "",
                "ckyc_remarks": ""
            };
            let token_url = ((config.environment.name === 'Production') ? 'https://ekyc-prod.hdfcergo.com/e-kyc/tgt/generate-token' : 'https://ekyc-uat.hdfcergo.com/e-kyc/tgt/generate-token');
            client.get(token_url, args1, function (data1, response1) {
                if (data1) {
                    if (data1.hasOwnProperty("success") && data1.success === true) {
                        if (data1.hasOwnProperty("data") && data1.data.hasOwnProperty("token") && data1.data.token !== "" && data1.data.token !== null) {
                            token = data1.data.token;
                            try {
                                if (token) {
                                    args.headers.token = token;
                                    var client1 = new Client();
                                    let kyc_verify_url = ((config.environment.name === 'Production') ?
                                    ('https://ekyc-prod.hdfcergo.com/e-kyc/primary/kyc-status/') : 
                                    ('https://ekyc-uat.hdfcergo.com/e-kyc/primary/kyc-status/')) + user_kyc_no;
                                    client1.get(kyc_verify_url, args, function (data, response) {
                                        if (data) {
                                            kyc_verify_response = data;
                                            LM_Data.KYC_Response = kyc_verify_response;
                                            if (data.hasOwnProperty("message") && data.message !== "") {
                                                LM_Data.KYC_Status = "VERIFY_FAIL";
                                                LM_Data.KYC_Redirect_URL = ObjRequest.KYC_URL;
                                            } else {
                                                if (data.hasOwnProperty("success") && data.success === true && data.hasOwnProperty("data") && data.data.hasOwnProperty("iskycVerified")) {
                                                    if (data.data.iskycVerified === 1) {
                                                        LM_Data.KYC_Status = "VERIFY_SUCCESS";
                                                        LM_Data.KYC_Number = (data.data.hasOwnProperty("kyc_id")) ? data.data.kyc_id : user_kyc_no;
                                                        LM_Data.KYC_FullName = (data.data.hasOwnProperty("name")) ? data.data.name : user_name;
                                                        //LM_Data.KYC_Doc_No = (data.data.hasOwnProperty("pan")) ? data.data.pan : ObjRequest.Document_ID;
                                                    } else if (data.data.iskycVerified === 0) {
                                                        LM_Data.KYC_Status = "VERIFY_FAIL";
                                                        LM_Data.KYC_Redirect_URL = ObjRequest.KYC_URL;
                                                    } else {
                                                        LM_Data.KYC_Status = "VERIFY_FAIL";
                                                        LM_Data.KYC_Redirect_URL = ObjRequest.KYC_URL;
                                                    }
                                                } else {
                                                    LM_Data.KYC_Status = "VERIFY_FAIL";
                                                    LM_Data.KYC_Redirect_URL = ObjRequest.KYC_URL;
                                                }
                                            }
                                            saveKYCDetails(ObjRequest, LM_Data, kyc_verify_request, kyc_verify_response);
                                            res.json({"Insurer": "HDFC", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                                        } else {
                                            res.json({"Insurer": "HDFC", "Msg": "KYC verify services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                                        }
                                    });
                                } else {
                                    res.json({"Insurer": "HDFC", "Msg": "Could Not Generate Token. Please try again later.", "Status": "FAIL"});
                                }
                            } catch (e2) {
                                res.json({"Insurer": "HDFC", "Msg": e2.stack, "Status": "FAIL"});
                            }
                        } else {
                            res.json({"Insurer": "HDFC", "Msg": "KYC-Token not generated. Please try again later.", "Status": "FAIL"});
                        }
                    } else {
                        res.json({"Insurer": "HDFC", "Msg": "KYC-Token generation services was not successful. Please try again later.", "Status": "FAIL"});
                    }
                } else {
                    res.json({"Insurer": "HDFC", "Msg": "KYC-Token generation services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                }
            });
        } catch (e1) {
            res.json({"Insurer": "HDFC", "Msg": e1.stack, "Status": "FAIL"});
        }
    });

    app.post('/kyc_details/hdfc_verify_kyc_details_NIU', function (req, res) {
        try {
            let ObjRequest = req.body;
            let kyc_verify_request = "";
            let kyc_verify_response = "";
            var user_kyc_no = (ObjRequest.user_kyc_no === undefined || ObjRequest.user_kyc_no === "" || ObjRequest.user_kyc_no === null) ? "" : ObjRequest.user_kyc_no;
            var user_name = null;
            if (ObjRequest['Proposal_Request'].middle_name === undefined || ObjRequest['Proposal_Request'].middle_name === "" || ObjRequest['Proposal_Request'].middle_name === null) {
                user_name = ((ObjRequest['Proposal_Request'].first_name === undefined || ObjRequest['Proposal_Request'].first_name === "" || ObjRequest['Proposal_Request'].first_name === null) ? "" : ObjRequest['Proposal_Request'].first_name) + " " +
                        ((ObjRequest['Proposal_Request'].last_name === undefined || ObjRequest['Proposal_Request'].last_name === "" || ObjRequest['Proposal_Request'].last_name === null) ? "" : ObjRequest['Proposal_Request'].last_name);
            } else {
                user_name = ((ObjRequest['Proposal_Request'].first_name === undefined || ObjRequest['Proposal_Request'].first_name === "" || ObjRequest['Proposal_Request'].first_name === null) ? "" : ObjRequest['Proposal_Request'].first_name) + " " +
                        ((ObjRequest['Proposal_Request'].middle_name === undefined || ObjRequest['Proposal_Request'].middle_name === "" || ObjRequest['Proposal_Request'].middle_name === null) ? "" : ObjRequest['Proposal_Request'].middle_name) + " " +
                        ((ObjRequest['Proposal_Request'].last_name === undefined || ObjRequest['Proposal_Request'].last_name === "" || ObjRequest['Proposal_Request'].last_name === null) ? "" : ObjRequest['Proposal_Request'].last_name);
            }
            let req_txt = {
                "mobile": (ObjRequest.Mobile === undefined || ObjRequest.Mobile === "" || ObjRequest.Mobile === null) ? "" : ObjRequest.Mobile,
                "name": user_name,
                "kyc_id": user_kyc_no,
                "dob": (ObjRequest.DOB === undefined || ObjRequest.DOB === "" || ObjRequest.DOB === null) ? "" : ObjRequest.DOB,
                "ckyc_number": user_kyc_no,
                "pan": ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "PAN" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID) : "",
                "aadhaar_uid": ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "AADHAR" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : (ObjRequest.Document_ID.substr(ObjRequest.Document_ID.length - 4))) : "", //"last 4 digits of aadhar",
                "agent_id": "",
                "gc_cust_id": "",
                "eia_number": "",
                "email_address": (ObjRequest.Email === undefined || ObjRequest.Email === "" || ObjRequest.Email === null) ? "" : ObjRequest.Email,
                "redirect_url": "https://www.policyboss.com/webhook/ckyc/ckyc_capture/" + ObjRequest.Insurer_Id + "/" + ObjRequest.PB_CRN
            };
            kyc_verify_request = req_txt;
            let args = {headers: {"token": ""}};
            let api_key = ((config.environment.name === 'Production') ? 'd220114d-8e75-4f' : '8d399be8-0b6f-4a');
            let args1 = {
                headers: {
                    "api_key": api_key
                }
            };
            let KYC_Status = "VERIFY_FAIL";
            let token = null;
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let LM_Data = {
                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type,//"PAN",
                "KYC_Request": kyc_verify_request,
                "KYC_Response": "",
                "ckyc_remarks": ""
            };
            let token_url = ((config.environment.name === 'Production') ? 'https://ekyc-prod.hdfcergo.com/e-kyc/tgt/generate-token' : 'https://ekyc-uat.hdfcergo.com/e-kyc/tgt/generate-token');
            client.get(token_url, args1, function (data1, response1) {
                if (data1) {
                    if (data1.hasOwnProperty("success") && data1.success === true) {
                        if (data1.hasOwnProperty("data") && data1.data.hasOwnProperty("token") && data1.data.token !== "" && data1.data.token !== null) {
                            token = data1.data.token;
                            try {
                                if (token) {
                                    args.headers.token = token;
                                    var client1 = new Client();
                                    let kyc_verify_url = ((config.environment.name === 'Production') ? ('https://ekyc-prod.hdfcergo.com/e-kyc/primary/kyc-verified?kyc_id=') : ('https://ekyc-uat.hdfcergo.com/e-kyc/primary/kyc-verified?kyc_id=')) + user_kyc_no;
                                    client1.get(kyc_verify_url, args, function (data, response) {
                                        if (data) {
                                            kyc_verify_response = data;
                                            LM_Data.KYC_Response = kyc_verify_response;
                                            if (data.hasOwnProperty("message") && data.message !== "") {
                                                LM_Data.KYC_Status = "VERIFY_FAIL";
                                                LM_Data.KYC_Redirect_URL = ObjRequest.KYC_URL;
                                            } else {
                                                if (data.hasOwnProperty("success") && data.success === true && data.hasOwnProperty("data") && data.data.hasOwnProperty("iskycVerified")) {
                                                    if (data.data.iskycVerified === 1) {
                                                        LM_Data.KYC_Status = "VERIFY_SUCCESS";
                                                        LM_Data.KYC_Number = (data.data.hasOwnProperty("kyc_id")) ? data.data.kyc_id : user_kyc_no;
                                                        LM_Data.KYC_FullName = (data.data.hasOwnProperty("name")) ? data.data.name : req_txt.name;
                                                        //LM_Data.KYC_Doc_No = (data.data.hasOwnProperty("pan")) ? data.data.pan : ObjRequest.Document_ID;
                                                    } else if (data.data.iskycVerified === 0) {
                                                        LM_Data.KYC_Status = "VERIFY_FAIL";
                                                        LM_Data.KYC_Redirect_URL = ObjRequest.KYC_URL;
                                                    } else {
                                                        LM_Data.KYC_Status = "VERIFY_FAIL";
                                                        LM_Data.KYC_Redirect_URL = ObjRequest.KYC_URL;
                                                    }
                                                } else {
                                                    LM_Data.KYC_Status = "VERIFY_FAIL";
                                                    LM_Data.KYC_Redirect_URL = ObjRequest.KYC_URL;
                                                }
                                            }
                                            saveKYCDetails(ObjRequest, LM_Data, kyc_verify_request, kyc_verify_response);
                                            res.json({"Insurer": "HDFC", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                                        } else {
                                            res.json({"Insurer": "HDFC", "Msg": "KYC verify services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                                        }
                                    });
                                } else {
                                    res.json({"Insurer": "HDFC", "Msg": "Could Not Generate Token. Please try again later.", "Status": "FAIL"});
                                }
                            } catch (e2) {
                                res.json({"Insurer": "HDFC", "Msg": e2.stack, "Status": "FAIL"});
                            }
                        } else {
                            res.json({"Insurer": "HDFC", "Msg": "KYC-Token not generated. Please try again later.", "Status": "FAIL"});
                        }
                    } else {
                        res.json({"Insurer": "HDFC", "Msg": "KYC-Token generation services was not successful. Please try again later.", "Status": "FAIL"});
                    }
                } else {
                    res.json({"Insurer": "HDFC", "Msg": "KYC-Token generation services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                }
            });
        } catch (e1) {
            res.json({"Insurer": "HDFC", "Msg": e1.stack, "Status": "FAIL"});
        }
    });

    app.post('/kyc_details/hdfc_create_kyc_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            let kyc_create_request = "";
            let kyc_create_response = "";
            var user_name = null;
            let weburl = ((config.environment.name === 'Production') ? 'https://horizon.policyboss.com:5443/' : 'https://qa-horizon.policyboss.com:3443/');
            let proposal_request = ObjRequest.hasOwnProperty('Proposal_Request') && ObjRequest.Proposal_Request ? ObjRequest.Proposal_Request : {};
            if (ObjRequest['Proposal_Request'].middle_name === undefined || ObjRequest['Proposal_Request'].middle_name === "" || ObjRequest['Proposal_Request'].middle_name === null) {
                user_name = ((ObjRequest['Proposal_Request'].first_name === undefined || ObjRequest['Proposal_Request'].first_name === "" || ObjRequest['Proposal_Request'].first_name === null) ? "" : ObjRequest['Proposal_Request'].first_name) + " " +
                        ((ObjRequest['Proposal_Request'].last_name === undefined || ObjRequest['Proposal_Request'].last_name === "" || ObjRequest['Proposal_Request'].last_name === null) ? "" : ObjRequest['Proposal_Request'].last_name);
            } else {
                user_name = ((ObjRequest['Proposal_Request'].first_name === undefined || ObjRequest['Proposal_Request'].first_name === "" || ObjRequest['Proposal_Request'].first_name === null) ? "" : ObjRequest['Proposal_Request'].first_name) + " " +
                        ((ObjRequest['Proposal_Request'].middle_name === undefined || ObjRequest['Proposal_Request'].middle_name === "" || ObjRequest['Proposal_Request'].middle_name === null) ? "" : ObjRequest['Proposal_Request'].middle_name) + " " +
                        ((ObjRequest['Proposal_Request'].last_name === undefined || ObjRequest['Proposal_Request'].last_name === "" || ObjRequest['Proposal_Request'].last_name === null) ? "" : ObjRequest['Proposal_Request'].last_name);
            }
            ;
            let docyTypeCode = {
                'PASSPORT': 'passport',
                'VOTERID': 'voterid',
                'DRIVINGLICENSE': 'drivingLicence',
                'AADHAR': 'aadhaar'
            };
            let req_txt = {
                "name": user_name,
                "mobile": (ObjRequest.Proposal_Request.mobile === undefined || ObjRequest.Proposal_Request.mobile === "" || ObjRequest.Proposal_Request.mobile === null) ? "" : ObjRequest.Proposal_Request.mobile,
                "pan": (proposal_request.pan === undefined || proposal_request.pan === "" || proposal_request.pan === null) ? (proposal_request.kyc_document_id && proposal_request.kyc_document_type === "PAN" ? proposal_request.kyc_document_id : "") : proposal_request.pan,
                "permanent_address": (proposal_request.permanent_address_1 === undefined || proposal_request.permanent_address_1 === "" || proposal_request.permanent_address_1 === null) ? "" : proposal_request.permanent_address_1,
                "permanent_city": (proposal_request.permanent_city === undefined || proposal_request.permanent_city === "" || proposal_request.permanent_city === null) ? "" : proposal_request.permanent_city,
                "permanent_pincode": (proposal_request.permanent_pincode === undefined || proposal_request.permanent_pincode === "" || proposal_request.permanent_pincode === null) ? "" : proposal_request.permanent_pincode,
                "correspondence_address": (proposal_request.permanent_address_1 === undefined || proposal_request.permanent_address_1 === "" || proposal_request.permanent_address_1 === null) ? "" : proposal_request.permanent_address_1,
                "correspondence_city": (proposal_request.permanent_city === undefined || proposal_request.permanent_city === "" || proposal_request.permanent_city === null) ? "" : proposal_request.permanent_city,
                "correspondence_pincode": (proposal_request.permanent_pincode === undefined || proposal_request.permanent_pincode === "" || proposal_request.permanent_pincode === null) ? "" : proposal_request.permanent_pincode,
                "dob": (ObjRequest.DOB === undefined || ObjRequest.DOB === "" || ObjRequest.DOB === null) ? "" : ObjRequest.DOB,
                "aadhar_uid": ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "AADHAR" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : (ObjRequest.Document_ID.substr(ObjRequest.Document_ID.length - 4))) : "", //"last 4 digits of aadhar",
                "email": (proposal_request.email === undefined || proposal_request.email === "" || proposal_request.email === null) ? "" : proposal_request.email,
                "occupation": (proposal_request.occupation === undefined || proposal_request.occupation === "" || proposal_request.occupation === null) ? "" : proposal_request.occupation,
                "organization_type": "Government",
                "is_politically_exposed": false,
                "annual_income": "0-2.5 lacs",
                "nationality": "Indian",
                "mother_name": "",
                "txn_id": ObjRequest.KYC_Ref_No || ObjRequest.Quote_Id || "",//"HEGI_0009",
                "gender": (proposal_request.gender === undefined || proposal_request.gender === "" || proposal_request.gender === null) ? "" : proposal_request.gender,
                "profile_image":(ObjRequest.Doc3 !== undefined && ObjRequest.Doc3 !== "" && ObjRequest.Doc3 !== null) ? (weburl + ObjRequest.Doc3) : "",
                "ovd_documents": [
                    {
                        "type": docyTypeCode[ObjRequest.Document_Type.toUpperCase().replace(/\s+/g, '')],
                        "front": (ObjRequest.Doc1 !== undefined && ObjRequest.Doc1 !== "" && ObjRequest.Doc1 !== null) ? (weburl + ObjRequest.Doc1) : "",
                        "back": (ObjRequest.Doc2 !== undefined && ObjRequest.Doc2 !== "" && ObjRequest.Doc2 !== null) ? (weburl + ObjRequest.Doc2) : ""
                    }
                ]
            };
            kyc_create_request = req_txt;
            let api_key = ((config.environment.name === 'Production') ? 'd220114d-8e75-4f' : '8d399be8-0b6f-4a');
            let args = {
                data: JSON.stringify(req_txt),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "token": ""
                }
            };
            let args1 = {
                headers: {
                    "api_key": api_key
                }
            };
            let KYC_Status = "PENDING";
            let kyc_id = 0;
            let token = null;
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let LM_Data = {
                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type, //"PAN",
                "KYC_Request": kyc_create_request,
                "KYC_Response": "",
                "ckyc_remarks": ""
            };
            let token_url = ((config.environment.name === 'Production') ? 'https://ekyc-prod.hdfcergo.com/e-kyc/tgt/generate-token' : 'https://ekyc-uat.hdfcergo.com/e-kyc/tgt/generate-token');
            client.get(token_url, args1, function (data1, response1) {
                if (data1) {
                    if (data1.hasOwnProperty("success") && data1.success === true) {
                        if (data1.hasOwnProperty("data") && data1.data.hasOwnProperty("token") && data1.data.token !== "" && data1.data.token !== null) {
                            token = data1.data.token;
                            try {
                                if (token) {
                                    args.headers.token = token;
                                    let kyc_create_url = ((config.environment.name === 'Production') ? ('https://ekyc-prod.hdfcergo.com/e-kyc/partner/kyc') : ('https://ekyc-uat.hdfcergo.com/e-kyc/partner/kyc'));
                                    var request = require('request');
                                    var options = {
                                        'method': 'POST',
                                        'url': kyc_create_url,
                                        'headers': {
                                            'token': token,
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(req_txt)
                                    };
                                    request(options, function (error, response) {
                                        if (error) {
                                            kyc_create_response = error;
                                            res.json({"Insurer": "HDFC", "Msg": "KYC create services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                                        }
                                        if (response) {
                                            kyc_create_response = response.body ? JSON.parse(response.body) : response.body;
                                            if (kyc_create_response.success && kyc_create_response.success === true && kyc_create_response.data && kyc_create_response.data.kyc_id) {
                                                kyc_id = (kyc_create_response.data.hasOwnProperty("kyc_id")) ? kyc_create_response.data.kyc_id : "";
                                                LM_Data.KYC_Status = "VERIFY_SUCCESS";
                                                LM_Data.KYC_Number = kyc_id;
//                                                LM_Data.KYC_FullName = (response.data.hasOwnProperty("name")) ? response.data.name : req_txt.name;
                                            } else {
                                                LM_Data.KYC_Status = "CREATE_FAIL";
                                                LM_Data.ckyc_remarks = kyc_create_response.message || "NA";
                                            }
                                            LM_Data.KYC_Response = kyc_create_response;
                                            saveKYCDetails(ObjRequest, LM_Data, kyc_create_request, kyc_create_response);
                                            res.json({"Insurer": "HDFC", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                                        } else {
                                            res.json({"Insurer": "HDFC", "Msg": "KYC create services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                                        }

                                    });
                                } else {
                                    res.json({"Insurer": "HDFC", "Msg": "Could Not Generate Token. Please try again later.", "Status": "FAIL"});
                                }
                            } catch (e2) {
                                res.json({"Insurer": "HDFC", "Msg": e2.stack, "Status": "FAIL"});
                            }
                        } else {
                            res.json({"Insurer": "HDFC", "Msg": "KYC-Token not generated. Please try again later.", "Status": "FAIL"});
                        }
                    } else {
                        res.json({"Insurer": "HDFC", "Msg": "KYC-Token generation services was not successful. Please try again later.", "Status": "FAIL"});
                    }
                } else {
                    res.json({"Insurer": "HDFC", "Msg": "KYC-Token generation services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                }
            });
        } catch (e1) {
            res.json({"Insurer": "HDFC", "Msg": e1.stack, "Status": "FAIL"});
        }
    });

    app.post('/kyc_details/edelweiss_fetch_kyc_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            let kyc_fetch_request = "";
            let kyc_fetch_response = "";
            let vehicle_registration_type = (ObjRequest.Proposal_Request.vehicle_registration_type === undefined || ObjRequest.Proposal_Request.vehicle_registration_type === "" || ObjRequest.Proposal_Request.vehicle_registration_type === null) ? "" : ObjRequest.Proposal_Request.vehicle_registration_type;
            vehicle_registration_type = (vehicle_registration_type === "") ? "I" : (vehicle_registration_type.toLowerCase() === "corporate" ? "C" : "I");
//            vehicle_registration_type = "I";
            let user_name = "";
            if (ObjRequest['Proposal_Request'].middle_name === undefined || ObjRequest['Proposal_Request'].middle_name === "" || ObjRequest['Proposal_Request'].middle_name === null) {
                user_name = ((ObjRequest['Proposal_Request'].first_name === undefined || ObjRequest['Proposal_Request'].first_name === "" || ObjRequest['Proposal_Request'].first_name === null) ? "" : ObjRequest['Proposal_Request'].first_name) + " " +
                        ((ObjRequest['Proposal_Request'].last_name === undefined || ObjRequest['Proposal_Request'].last_name === "" || ObjRequest['Proposal_Request'].last_name === null) ? "" : ObjRequest['Proposal_Request'].last_name);
            } else {
                user_name = ((ObjRequest['Proposal_Request'].first_name === undefined || ObjRequest['Proposal_Request'].first_name === "" || ObjRequest['Proposal_Request'].first_name === null) ? "" : ObjRequest['Proposal_Request'].first_name) + " " +
                        ((ObjRequest['Proposal_Request'].middle_name === undefined || ObjRequest['Proposal_Request'].middle_name === "" || ObjRequest['Proposal_Request'].middle_name === null) ? "" : ObjRequest['Proposal_Request'].middle_name) + " " +
                        ((ObjRequest['Proposal_Request'].last_name === undefined || ObjRequest['Proposal_Request'].last_name === "" || ObjRequest['Proposal_Request'].last_name === null) ? "" : ObjRequest['Proposal_Request'].last_name);
            }
            let timestamp = (moment().unix() + new Date().getUTCMilliseconds()).toString();
            let req_txt = {
                "VISoF_Program_Name": "PB-LIBPL", //"EGI",
                "VISoF_KYC_Req_No": (ObjRequest.PB_CRN === undefined || ObjRequest.PB_CRN === "" || ObjRequest.PB_CRN === null) ? "" : ("" + ObjRequest.PB_CRN + timestamp).toString(),
                "ProposerType": vehicle_registration_type, //I=Individual or C=Corporate
                "Source": "LIBPL", //"PP",
                "FirstName": (ObjRequest.Proposal_Request.first_name === undefined || ObjRequest.Proposal_Request.first_name === "" || ObjRequest.Proposal_Request.first_name === null) ? "" : ObjRequest.Proposal_Request.first_name,
                "MiddleName": (ObjRequest.Proposal_Request.middle_name === undefined || ObjRequest.Proposal_Request.middle_name === "" || ObjRequest.Proposal_Request.middle_name === null) ? "" : ObjRequest.Proposal_Request.middle_name,
                "LastName": (ObjRequest.Proposal_Request.last_name === undefined || ObjRequest.Proposal_Request.last_name === "" || ObjRequest.Proposal_Request.last_name === null) ? "" : ObjRequest.Proposal_Request.last_name,
                "DOB": (vehicle_registration_type === "I" ? ((ObjRequest.DOB === undefined || ObjRequest.DOB === "" || ObjRequest.DOB === null) ? "" : (moment(ObjRequest.DOB, "DD/MM/YYYY").format("MM/DD/YYYY"))) : ""), //"31/10/2000",
                "DOI": (vehicle_registration_type === "C" ? ((ObjRequest.date_of_incorporation === undefined || ObjRequest.date_of_incorporation === "" || ObjRequest.date_of_incorporation === null) ? "" : (moment(ObjRequest.date_of_incorporation, "DD/MM/YYYY").format("MM/DD/YYYY"))) : ""), //"31/10/2000",
                "MobileNo": (ObjRequest.Proposal_Request.mobile === undefined || ObjRequest.Proposal_Request.mobile === "" || ObjRequest.Proposal_Request.mobile === null) ? "" : ObjRequest.Proposal_Request.mobile,
                "ZIPCODE": (ObjRequest.Proposal_Request.permanent_pincode === undefined || ObjRequest.Proposal_Request.permanent_pincode === "" || ObjRequest.Proposal_Request.permanent_pincode === null) ? "" : ObjRequest.Proposal_Request.permanent_pincode,
                "Email": (ObjRequest.Proposal_Request.email === undefined || ObjRequest.Proposal_Request.email === "" || ObjRequest.Proposal_Request.email === null) ? "" : ObjRequest.Proposal_Request.email,
                //"ProposerPAN": (ObjRequest.PAN === undefined || ObjRequest.PAN === "" || ObjRequest.PAN === null) ? "" : ObjRequest.PAN, //"AQNPY8223A",
                "ProposerPAN":  ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "PAN" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID) : "",
                "ProposerAadhaarNumber":  ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "AADHAR" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : (ObjRequest.Document_ID.substr(ObjRequest.Document_ID.length - 4))): "",
                "ProposerCKYC_No": ""
            };
            let api_key = ((config.environment.name !== 'Production') ? 'vmX0qzSwUy5i4dyKa0MhuaQhQ6PECsp3FqZvwRX8' : 'GNa3E0AW0N1rQX5iJptWP4oTuJMm6xL165BKAiFv');
            let args = {
                data: JSON.stringify(req_txt),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "Authorization": "",
                    "X-Api-Key": api_key
                }
            };
            let username = ((config.environment.name !== 'Production') ? '2r9a4a9lpvj2lp5bqbo0jhcp0l' : '7tfqlek8a6di69gqevlnspmlop');
            let password = ((config.environment.name !== 'Production') ? '1q0fbp68juvm8f221f9ckh9j7i3ktq2hkibfk88q460pvccsfmqs' : '1f6u83mee4aun2vaaiv7vo02temfh8ebgonued3ou9s877qth6rc');
            let args1 = {
                headers: {
                    "Authorization": 'Basic ' + new Buffer(username + ':' + password).toString('base64'),
                    //"Authorization": "Basic MnI5YTRhOWxwdmoybHA1YnFibzBqaGNwMGw6MXEwZmJwNjhqdXZtOGYyMjFmOWNraDlqN2kza3RxMmhraWJmazg4cTQ2MHB2Y2NzZm1xcw==",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "*/*"
                }
            };
            kyc_fetch_request = req_txt;
            let KYC_Status = "PENDING";
            let kyc_id = 0;
            let token = null;
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let LM_Data = {
                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type,// "PAN",
                "KYC_Request": kyc_fetch_request,
                "KYC_Response": "",
                "ckyc_remarks": ""
            };
            let token_url = ((config.environment.name !== 'Production') ? 'https://devapi.edelweissinsurance.com/oauth2/token' : 'https://apis.edelweissinsurance.com/oauth2/token');
            client.post(token_url, args1, function (data1, response1) {
                if (data1) {
                    if (data1.hasOwnProperty("access_token") && data1.access_token !== "" && data1.access_token !== null) {
                        token = data1.access_token;
                        try {
                            if (token) {
                                args.headers.Authorization = token;
                                var client1 = new Client();
                                let kyc_fetch_url = ((config.environment.name !== 'Production') ? 'https://devapi.edelweissinsurance.com/signzy/e-kyc' : 'https://apis.edelweissinsurance.com/signzy/e-kyc');
                                client1.post(kyc_fetch_url, args, function (data, response) {
                                    if (data) {
                                        kyc_fetch_response = data;
                                        LM_Data.KYC_Response = kyc_fetch_response;
                                        if (data.hasOwnProperty("message") && data.message !== "") {
                                            LM_Data.KYC_Status = "FETCH_FAIL";
                                            LM_Data.KYC_Redirect_URL = ObjRequest.KYC_URL;
                                            LM_Data.KYC_Ref_No = data.data && data.data.VISoF_KYC_Req_No ? data.data.VISoF_KYC_Req_No : "";
                                        } else {
                                            if (data.hasOwnProperty("success") && data.success === true && data.hasOwnProperty("data") && data.data) {
                                                if (data.data.hasOwnProperty("KYC_Status") && (data.data.KYC_Status === '1' || data.data.KYC_Status === 1)) {
                                                    if ((data.data.hasOwnProperty("VISoF_KYC_Req_No") && data.data.VISoF_KYC_Req_No !== "") && (data.data.hasOwnProperty("IC_KYC_No") && data.data.IC_KYC_No !== "")) {
                                                        kyc_id = data.data.VISoF_KYC_Req_No + "|" + data.data.IC_KYC_No;
                                                        LM_Data.KYC_Status = "FETCH_SUCCESS";
                                                        LM_Data.KYC_Number = (kyc_id && kyc_id.includes('|')) ? kyc_id.split('|')[1] : "";
                                                        //LM_Data.KYC_Doc_No = data.data['ProposerPAN'];
                                                        LM_Data.KYC_Ref_No = data.data && data.data.VISoF_KYC_Req_No ? data.data.VISoF_KYC_Req_No : "";
                                                        try {
                                                            LM_Data.KYC_FullName = data.data['MiddleName'] === "" ? (data.data['FirstName'] + " " + data.data['LastName']).trim() : (data.data['FirstName'] + " " + data.data['MiddleName'] + " " + data.data['LastName']).trim();
                                                        } catch (e) {
                                                            LM_Data.KYC_FullName = user_name.trim();
                                                        }
                                                    } else {
                                                        if ((data.data.hasOwnProperty("VISoF_KYC_Req_No") && data.data.VISoF_KYC_Req_No !== "") && (data.data.hasOwnProperty("IC_KYC_No") && data.data.IC_KYC_No !== "")) {
                                                            kyc_id = data.data.VISoF_KYC_Req_No + "|" + data.data.IC_KYC_No;
                                                            LM_Data.KYC_Number = (kyc_id && kyc_id.includes('|')) ? kyc_id.split('|')[1] : "";
                                                            LM_Data.KYC_Redirect_URL = (data.data && data.data.IC_KYC_REG_URL) ? data.data.IC_KYC_REG_URL : "";
                                                            LM_Data.KYC_Ref_No = data.data.VISoF_KYC_Req_No ? data.data.VISoF_KYC_Req_No : "";
                                                        }
                                                        LM_Data.KYC_Status = "FETCH_FAIL";
                                                    }
                                                } else {
                                                    if ((data.data.hasOwnProperty("VISoF_KYC_Req_No") && data.data.VISoF_KYC_Req_No !== "") && (data.data.hasOwnProperty("IC_KYC_No") && data.data.IC_KYC_No !== "")) {
                                                        kyc_id = data.data.VISoF_KYC_Req_No + "|" + data.data.IC_KYC_No;
                                                        LM_Data.KYC_Number = (kyc_id && kyc_id.includes('|')) ? kyc_id.split('|')[1] : "";
                                                        LM_Data.KYC_Ref_No = data.data.VISoF_KYC_Req_No ? data.data.VISoF_KYC_Req_No : "";
//                                                        LM_Data.KYC_Redirect_URL = (data.hasOwnProperty('data') && data.data.hasOwnProperty('IC_KYC_REG_URL') && data.data.IC_KYC_REG_URL) ? data.data.IC_KYC_REG_URL : ObjRequest.KYC_URL;
                                                    }
                                                    LM_Data.KYC_Status = "FETCH_FAIL";
                                                    LM_Data.KYC_Redirect_URL = (data.hasOwnProperty('data') && data.data.hasOwnProperty('IC_KYC_REG_URL') && data.data.IC_KYC_REG_URL) ? data.data.IC_KYC_REG_URL : ObjRequest.KYC_URL;
                                                    LM_Data.KYC_Ref_No = data.data && data.data.VISoF_KYC_Req_No ? data.data.VISoF_KYC_Req_No : "";
                                                }
                                            } else {
                                                if ((data.hasOwnProperty("VISoF_KYC_Req_No") && data.VISoF_KYC_Req_No !== "") && (data.hasOwnProperty("IC_KYC_No") && data.IC_KYC_No !== "")) {
                                                    kyc_id = data.VISoF_KYC_Req_No + "|" + data.IC_KYC_No;
                                                    LM_Data.KYC_Number = (kyc_id && kyc_id.includes('|')) ? kyc_id.split('|')[1] : "";
                                                }
                                                LM_Data.KYC_Status = "FETCH_FAIL";
                                                LM_Data.KYC_Redirect_URL = ObjRequest.KYC_URL;
                                                LM_Data.KYC_Ref_No = data && data.VISoF_KYC_Req_No ? data.VISoF_KYC_Req_No : "";
                                                if (data && data.hasOwnProperty('IC_KYC_REG_URL')) {
                                                     LM_Data.KYC_Redirect_URL = data.IC_KYC_REG_URL;
                                            }
                                        }
                                        }
                                        saveKYCDetails(ObjRequest, LM_Data, kyc_fetch_request, kyc_fetch_response);
                                        res.json({"Insurer": "Edelweiss", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                                    } else {
                                        res.json({"Insurer": "Edelweiss", "Msg": "KYC fetch services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                                    }
                                });
                            } else {
                                res.json({"Insurer": "Edelweiss", "Msg": "Could Not Generate Token. Please try again later.", "Status": "FAIL"});
                            }
                        } catch (e2) {
                            res.json({"Insurer": "Edelweiss", "Msg": e2.stack, "Status": "FAIL"});
                        }
                    } else {
                        res.json({"Insurer": "Edelweiss", "Msg": "KYC-Token not generated. Please try again later.", "Status": "FAIL"});
                    }
                } else {
                    res.json({"Insurer": "Edelweiss", "Msg": "KYC-Token generation services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                }
            });
        } catch (e1) {
            res.json({"Insurer": "Edelweiss", "Msg": e1.stack, "Status": "FAIL"});
        }
    });

    app.post('/kyc_details/edelweiss_verify_kyc_details_fetch', function (req, res) {
        try {
            let ObjRequest = req.body;
            let kyc_verify_request = "";
            let kyc_verify_response = "";
            var user_kyc_no = (ObjRequest.user_kyc_no === undefined || ObjRequest.user_kyc_no === "" || ObjRequest.user_kyc_no === null) ? "" : ObjRequest.user_kyc_no;
            var user_name = null;
            if (ObjRequest['Proposal_Request'].middle_name === undefined || ObjRequest['Proposal_Request'].middle_name === "" || ObjRequest['Proposal_Request'].middle_name === null) {
                user_name = ((ObjRequest['Proposal_Request'].first_name === undefined || ObjRequest['Proposal_Request'].first_name === "" || ObjRequest['Proposal_Request'].first_name === null) ? "" : ObjRequest['Proposal_Request'].first_name) + " " +
                        ((ObjRequest['Proposal_Request'].last_name === undefined || ObjRequest['Proposal_Request'].last_name === "" || ObjRequest['Proposal_Request'].last_name === null) ? "" : ObjRequest['Proposal_Request'].last_name);
            } else {
                user_name = ((ObjRequest['Proposal_Request'].first_name === undefined || ObjRequest['Proposal_Request'].first_name === "" || ObjRequest['Proposal_Request'].first_name === null) ? "" : ObjRequest['Proposal_Request'].first_name) + " " +
                        ((ObjRequest['Proposal_Request'].middle_name === undefined || ObjRequest['Proposal_Request'].middle_name === "" || ObjRequest['Proposal_Request'].middle_name === null) ? "" : ObjRequest['Proposal_Request'].middle_name) + " " +
                        ((ObjRequest['Proposal_Request'].last_name === undefined || ObjRequest['Proposal_Request'].last_name === "" || ObjRequest['Proposal_Request'].last_name === null) ? "" : ObjRequest['Proposal_Request'].last_name);
            }
            let VISoF_KYC_Req_No = "";
            let IC_KYC_No = "";
            if (user_kyc_no === "EGI-00000113") { // for testing only
                VISoF_KYC_Req_No = "13201";
                IC_KYC_No = (ObjRequest.user_kyc_no === undefined || ObjRequest.user_kyc_no === "" || ObjRequest.user_kyc_no === null) ? "" : ObjRequest.user_kyc_no;
            } else {
                VISoF_KYC_Req_No = (ObjRequest.KYC_Ref_No === undefined || ObjRequest.KYC_Ref_No === "" || ObjRequest.KYC_Ref_No === null) ? "" : ObjRequest.KYC_Ref_No.toString();
                IC_KYC_No = (ObjRequest.user_kyc_no === undefined || ObjRequest.user_kyc_no === "" || ObjRequest.user_kyc_no === null) ? "" : ObjRequest.user_kyc_no;
            }
            let req_txt = {
                "VISoF_KYC_Req_No": VISoF_KYC_Req_No,
                "IC_KYC_No": IC_KYC_No
            };
            kyc_verify_request = req_txt;
            let api_key = ((config.environment.name !== 'Production') ? 'vmX0qzSwUy5i4dyKa0MhuaQhQ6PECsp3FqZvwRX8' : 'GNa3E0AW0N1rQX5iJptWP4oTuJMm6xL165BKAiFv');
            let args = {
                data: JSON.stringify(req_txt),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "Authorization": "",
                    "X-Api-Key": api_key
                }
            };
            let username = ((config.environment.name !== 'Production') ? '2r9a4a9lpvj2lp5bqbo0jhcp0l' : '7tfqlek8a6di69gqevlnspmlop');
            let password = ((config.environment.name !== 'Production') ? '1q0fbp68juvm8f221f9ckh9j7i3ktq2hkibfk88q460pvccsfmqs' : '1f6u83mee4aun2vaaiv7vo02temfh8ebgonued3ou9s877qth6rc');
            let args1 = {
                headers: {
                    "Authorization": 'Basic ' + new Buffer(username + ':' + password).toString('base64'),
                    //"Authorization": "Basic MnI5YTRhOWxwdmoybHA1YnFibzBqaGNwMGw6MXEwZmJwNjhqdXZtOGYyMjFmOWNraDlqN2kza3RxMmhraWJmazg4cTQ2MHB2Y2NzZm1xcw==",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "*/*"
                }
            };
            let KYC_Status = "VERIFY_FAIL";
            let kyc_id = 0;
            let token = null;
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let LM_Data = {
                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Ref_No": ObjRequest.KYC_Ref_No,
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type,//"PAN",
                "KYC_Request": kyc_verify_request,
                "KYC_Response": ""
            };
            let token_url = ((config.environment.name !== 'Production') ? 'https://devapi.edelweissinsurance.com/oauth2/token' : 'https://apis.edelweissinsurance.com/oauth2/token');
            client.post(token_url, args1, function (data1, response1) {
                if (data1) {
                    if (data1.hasOwnProperty("access_token") && data1.access_token !== "" && data1.access_token !== null) {
                        token = data1.access_token;
                        try {
                            if (token) {
                                args.headers.Authorization = token;
                                var client1 = new Client();
                                let kyc_verify_url = ((config.environment.name !== 'Production') ? 'https://devapi.edelweissinsurance.com/signzy/e-kyc-enquiry' : 'https://apis.edelweissinsurance.com/signzy/e-kyc-enquiry');
                                client1.get(kyc_verify_url, args, function (data, response) {
                                    if (data) {
                                        kyc_verify_response = data;
                                        LM_Data.KYC_Response = kyc_verify_response;
                                        if (data.hasOwnProperty("message") && data.message !== "") {
                                            LM_Data.KYC_Status = "VERIFY_FAIL";
                                            LM_Data.KYC_Ref_No = data.data && data.data.VISoF_KYC_Req_No ? data.data.VISoF_KYC_Req_No : ObjRequest.KYC_Ref_No;
                                        } else {
                                            if (data.hasOwnProperty("success") && data.success === true && data.hasOwnProperty("data") && data.data) {
                                                if (data.data.hasOwnProperty("KYC_Status") && (data.data.KYC_Status === '1' || data.data.KYC_Status === 1)) {
                                                    if ((data.data.hasOwnProperty("VISoF_KYC_Req_No") && data.data.VISoF_KYC_Req_No !== "") && (data.data.hasOwnProperty("IC_KYC_No") && data.data.IC_KYC_No !== "")) {
                                                        kyc_id = data.data.VISoF_KYC_Req_No + "|" + data.data.IC_KYC_No;
                                                        LM_Data.KYC_Status = "VERIFY_SUCCESS";
                                                        user_kyc_no = kyc_id ? kyc_id.split('|')[1] : user_kyc_no;
                                                        LM_Data.KYC_Number = user_kyc_no;
                                                        //LM_Data.KYC_Doc_No = data.data['ProposerPAN'];
                                                        LM_Data.KYC_Ref_No = data.data.VISoF_KYC_Req_No ? data.data.VISoF_KYC_Req_No : ObjRequest.KYC_Ref_No;
                                                        try {
                                                            LM_Data.KYC_FullName = data.data['MiddleName'] === "" ? (data.data['FirstName'] + " " + data.data['LastName']).trim() : (data.data['FirstName'] + " " + data.data['MiddleName'] + " " + data.data['LastName']).trim();
                                                        } catch (e) {
                                                            LM_Data.KYC_FullName = user_name.trim();
                                                        }
                                                    } else {
                                                        LM_Data.KYC_Status = "VERIFY_FAIL";
                                                    }
                                                } else {
                                                    LM_Data.KYC_Status = "VERIFY_FAIL";
                                                    LM_Data.KYC_Redirect_URL = data.data.IC_KYC_REG_URL;
                                                    LM_Data.KYC_Ref_No = data.data.VISoF_KYC_Req_No ? data.data.VISoF_KYC_Req_No : ObjRequest.KYC_Ref_No;
                                                }
                                            } else {
                                                LM_Data.KYC_Status = "VERIFY_FAIL";
                                            }
                                        }
                                        saveKYCDetails(ObjRequest, LM_Data, kyc_verify_request, kyc_verify_response);
                                        res.json({"Insurer": "Edelweiss", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                                    } else {
                                        res.json({"Insurer": "Edelweiss", "Msg": "KYC verify services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                                    }
                                });
                            } else {
                                res.json({"Insurer": "Edelweiss", "Msg": "Could Not Generate Token. Please try again later.", "Status": "FAIL"});
                            }
                        } catch (e2) {
                            res.json({"Insurer": "Edelweiss", "Msg": e2.stack, "Status": "FAIL"});
                        }
                    } else {
                        res.json({"Insurer": "Edelweiss", "Msg": "KYC-Token not generated. Please try again later.", "Status": "FAIL"});
                    }
                } else {
                    res.json({"Insurer": "Edelweiss", "Msg": "KYC-Token generation services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                }
            });
        } catch (e1) {
            res.json({"Insurer": "Edelweiss", "Msg": e1.stack, "Status": "FAIL"});
        }
    });

    app.post('/kyc_details/royal_fetch_kyc_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            let proposal_request = ObjRequest.Proposal_Request;
            let kyc_fetch_request = "";
            let kyc_fetch_response = "";
            let vehicle_registration_type = (proposal_request.vehicle_registration_type === undefined || proposal_request.vehicle_registration_type === "" || proposal_request.vehicle_registration_type === null) ? "Individual" : (proposal_request.vehicle_registration_type.toLowerCase() === "corporate" ? "Corporate" : "Individual");
            let productObj = {1 : "Privatecar", 10 : "", 12 : "", 2 : ""};
            let product = productObj[ObjRequest.Product_Id];
            let royal_token_service = (config.environment.name === "Production") ? "https://kyc.royalsundaram.in/eKycServices/ekyc/generateKYCToken" : "https://ekyc.royalsundaram.net/eKycServices/ekyc/generateKYCToken";
            let royal_create_service = (config.environment.name === "Production") ? "https://kyc.royalsundaram.in/eKycServices/ekyc/v1/searchDownloadKYCDetails" : "https://ekyc.royalsundaram.net/eKycServices/ekyc/v1/searchDownloadKYCDetails";

            var cust_name = null;
            if (ObjRequest.Proposal_Request.middle_name === undefined || ObjRequest.Proposal_Request.middle_name === "" || ObjRequest.Proposal_Request.middle_name === null) {
                cust_name = ((ObjRequest.Proposal_Request.first_name === undefined || ObjRequest.Proposal_Request.first_name === "" || ObjRequest.Proposal_Request.first_name === null) ? "" : ObjRequest.Proposal_Request.first_name) + " " +
                        ((ObjRequest.Proposal_Request.last_name === undefined || ObjRequest.Proposal_Request.last_name === "" || ObjRequest.Proposal_Request.last_name === null) ? "" : ObjRequest.Proposal_Request.last_name);
            } else {
                cust_name = ((ObjRequest.Proposal_Request.first_name === undefined || ObjRequest.Proposal_Request.first_name === "" || ObjRequest.Proposal_Request.first_name === null) ? "" : ObjRequest.Proposal_Request.first_name) + " " +
                        ((ObjRequest.Proposal_Request.middle_name === undefined || ObjRequest.Proposal_Request.middle_name === "" || ObjRequest.Proposal_Request.middle_name === null) ? "" : ObjRequest.Proposal_Request.middle_name) + " " +
                        ((ObjRequest.Proposal_Request.last_name === undefined || ObjRequest.Proposal_Request.last_name === "" || ObjRequest.Proposal_Request.last_name === null) ? "" : ObjRequest.Proposal_Request.last_name);
            }
            let req_txt = {
                "token": "",
                "policyNo": "",
                "quoteNo": ObjRequest.Quote_Id ? ObjRequest.Quote_Id : "",
                "appName": "D2C",
                "proposalNo": "",
                "product": product,
                "Lob": "",
                "customerName": cust_name,
                "mobileNo": (proposal_request.mobile === undefined || proposal_request.mobile === "" || proposal_request.mobile === null) ? "" : proposal_request.mobile,
                "emailId": (proposal_request.email === undefined || proposal_request.email === "" || proposal_request.email === null) ? "" : proposal_request.email,
//                "panNumber": proposal_request.pan && proposal_request.pan !== "" ? proposal_request.pan : "",
                "panNumber": ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "PAN" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID) : "",
                "aadharNumber": ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "AADHAR" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID): "",
                "dob_doi": proposal_request.birth_date && proposal_request.birth_date !=="" ? proposal_request.birth_date : "",
                "customerType": vehicle_registration_type,
                "uniqueId": ObjRequest.Quote_Id ? ObjRequest.Quote_Id : ""
            };
            let args1 = {
                data: {
                    "appId": "D2C",
                    "appKey": "D2C"
                },
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*"
                }
            };
            kyc_fetch_request = req_txt;
            let KYC_Status = "PENDING";
            let kyc_id = 0;
            let token = null;
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let LM_Data = {
                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Company_Name": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type,//"PAN",
                "KYC_Request": kyc_fetch_request,
                "KYC_Response": "",
                "ckyc_remarks": ""
            };
            client.post(royal_token_service, args1, function (data1, response1) {
                if (data1) {
                    if (data1.hasOwnProperty("token") && data1.token && data1.token !== "" && data1.errorMsg === null) {
                        req_txt['token'] = data1.token;
                        token = data1.token;
                        let args = {
                            data: JSON.stringify(req_txt),
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "*/*"
                            }
                        };
                        try {
                            if (token) {
                                var client1 = new Client();
                                client1.post(royal_create_service, args, function (data, response) {
                                    if (data) {
                                        kyc_fetch_response = data;
                                        LM_Data.KYC_Response = kyc_fetch_response;
                                        if (data.hasOwnProperty("errorCode") && data.hasOwnProperty("kycStatus") && data.errorCode === null && data.kycStatus === true) {
                                            if (data.hasOwnProperty("kycDetails") && data.kycDetails.ckycNo && data.kycDetails.ckycNo !== "") {
                                                LM_Data['KYC_Number'] = data.kycDetails['ckycNo'];
                                                LM_Data['KYC_Status'] = "FETCH_SUCCESS";
                                                LM_Data['KYC_FullName'] = (data.kycDetails.hasOwnProperty("middleName") && data.kycDetails.middleName && data.kycDetails.middleName !== "") ? (data.kycDetails.firstName + " " + data.kycDetails.middleName + " " + data.kycDetails.lastName) : (data.kycDetails.firstName + " " + data.kycDetails.lastName);
                                                LM_Data['KYC_Company_Name'] = data.kycDetails.hasOwnProperty("companyName") ? data.kycDetails.companyName : "";
                                                LM_Data['KYC_Ref_No'] = data.kycRefNo;
                                            } else {
                                                LM_Data['KYC_Status'] = "FETCH_FAIL";
                                                LM_Data['KYC_Number'] = data.hasOwnProperty('uniqueId') && data.uniqueId ? data.uniqueId : "";
                                                LM_Data['KYC_Ref_No'] = data.kycRefNo ? data.kycRefNo : "";
                                                LM_Data['KYC_Redirect_URL'] = data.url ? data.url : ObjRequest.KYC_URL;
                                                LM_Data['ckyc_remarks'] = data.hasOwnProperty('errMsg') && data.errMsg ? data.errMsg : "royal fetch service error !";
                                            }
                                        } else {
                                            LM_Data['KYC_Status'] = "FETCH_FAIL";
                                            LM_Data['KYC_Number'] = data.hasOwnProperty('uniqueId') && data.uniqueId ? data.uniqueId : "";
                                            LM_Data['KYC_Ref_No'] = data.kycRefNo ? data.kycRefNo : "";
                                            LM_Data['KYC_Redirect_URL'] = data.url ? data.url : ObjRequest.KYC_URL;
                                            LM_Data['ckyc_remarks'] = data.hasOwnProperty('errMsg') && data.errMsg ? data.errMsg : "royal fetch service error !";
                                        }
                                        if(LM_Data['KYC_Redirect_URL']){
                                            LM_Data['ckyc_remarks'] = "NA";
                                        }
                                        saveKYCDetails(ObjRequest, LM_Data, kyc_fetch_request, kyc_fetch_response);
                                        res.json({"Insurer": "Royal Sundaram", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                                    } else {
                                        res.json({"Insurer": "Royal Sundaram", "Msg": "KYC verify services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                                    }
                                });
                            } else {
                                res.json({"Insurer": "Royal Sundaram", "Msg": "Could Not Generate Token. Please try again later.", "Status": "FAIL"});
                            }
                        } catch (e2) {
                            res.json({"Insurer": "Royal Sundaram", "Msg": e2.stack, "Status": "FAIL"});
                        }
                    } else {
                        res.json({"Insurer": "Royal Sundaram", "Msg": "KYC-Token not generated. Please try again later.", "Status": "FAIL"});
                    }
                } else {
                    res.json({"Insurer": "Royal Sundaram", "Msg": "KYC-Token generation services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                }
            });
        } catch (e1) {
            res.json({"Insurer": "Royal Sundaram", "Msg": e1.stack, "Status": "FAIL"});
        }
    });

    app.post('/kyc_details/royal_verify_kyc_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            let kyc_verify_request = "";
            let kyc_verify_response = "";
            let royal_token_service = (config.environment.name === "Production") ? "https://kyc.royalsundaram.in/eKycServices/ekyc/generateKYCToken" : "https://ekyc.royalsundaram.net/eKycServices/ekyc/generateKYCToken";
            let royal_verify_service =(config.environment.name === "Production") ? "https://kyc.royalsundaram.in/eKycServices/ekyc/v1/getKycStatusResults" : "https://ekyc.royalsundaram.net/eKycServices/ekyc/v1/getKycStatusResults";
            var user_kyc_no = (ObjRequest.KYC_Number === undefined || ObjRequest.KYC_Number === "" || ObjRequest.KYC_Number === null) ? "" : ObjRequest.KYC_Number;
            var cust_name = null;
            if (ObjRequest.Proposal_Request.middle_name === undefined || ObjRequest.Proposal_Request.middle_name === "" || ObjRequest.Proposal_Request.middle_name === null) {
                cust_name = ((ObjRequest.Proposal_Request.first_name === undefined || ObjRequest.Proposal_Request.first_name === "" || ObjRequest.Proposal_Request.first_name === null) ? "" : ObjRequest.Proposal_Request.first_name) + " " +
                        ((ObjRequest.Proposal_Request.last_name === undefined || ObjRequest.Proposal_Request.last_name === "" || ObjRequest.Proposal_Request.last_name === null) ? "" : ObjRequest.Proposal_Request.last_name);
            } else {
                cust_name = ((ObjRequest.Proposal_Request.first_name === undefined || ObjRequest.Proposal_Request.first_name === "" || ObjRequest.Proposal_Request.first_name === null) ? "" : ObjRequest.Proposal_Request.first_name) + " " +
                        ((ObjRequest.Proposal_Request.middle_name === undefined || ObjRequest.Proposal_Request.middle_name === "" || ObjRequest.Proposal_Request.middle_name === null) ? "" : ObjRequest.Proposal_Request.middle_name) + " " +
                        ((ObjRequest.Proposal_Request.last_name === undefined || ObjRequest.Proposal_Request.last_name === "" || ObjRequest.Proposal_Request.last_name === null) ? "" : ObjRequest.Proposal_Request.last_name);
            }
            let req_txt = {
                "uniqueId": ObjRequest.Quote_Id
            };
            let args1 = {
                data: {
                    "appId": "D2C",
                    "appKey": "D2C"
                },
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*"
                }
            };
            kyc_verify_request = req_txt;
            let KYC_Status = "VERIFY_FAIL";
            let kyc_id = 0;
            let token = null;
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let LM_Data = {
                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type,//"PAN",
                "KYC_Request": kyc_verify_request,
                "KYC_Response": "",
                "ckyc_remarks": ""
            };
            client.post(royal_token_service, args1, function (data1, response1) {
                if (data1) {
                    if (data1.hasOwnProperty("token") && data1.token && data1.token !== "" && data1.errorMsg === null) {
                        req_txt['token'] = data1.token;
                        token = data1.token;
                        let args = {
                            data: JSON.stringify(req_txt),
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "*/*",
                                "TokenKey": ""
                            }
                        };
                        try {
                            if (token) {
                                args.headers.TokenKey = token;
                                var client1 = new Client();
                                client1.post(royal_verify_service, args, function (data, response) {
                                    if (data) {
                                        kyc_verify_response = data;
                                        LM_Data.KYC_Response = kyc_verify_response;
                                        if (data && data.hasOwnProperty("applicationStatus") && data.applicationStatus === "Success") {
                                                LM_Data['KYC_Number'] = data.ckycNo ? data.ckycNo : "";
                                                LM_Data['KYC_Status'] = "VERIFY_SUCCESS";
                                                LM_Data['KYC_FullName'] = (data.hasOwnProperty("middleName") && data.middleName && data.middleName !== "") ? (data.firstName + " " + data.middleName + " " + data.lastName): (data.firstName + " " + data.lastName);
                                                LM_Data['KYC_Ref_No'] = data['kycRefNo'];
                                            } else {
                                                LM_Data['KYC_Status'] = "VERIFY_FAIL";
                                                LM_Data['KYC_Ref_No'] = data['kycRefNo'] ? data['kycRefNo'] : "";
                                                LM_Data['KYC_Redirect_URL'] = data.url ? data.url : ObjRequest.KYC_URL;
                                                LM_Data['ckyc_remarks'] = data.hasOwnProperty("errMessage") && data.errMessage ?  data.errMessage : "royal verify service error !";
                                            }
                                            if(LM_Data['KYC_Redirect_URL']){
                                                LM_Data['ckyc_remarks'] = "NA";
                                            }
                                        saveKYCDetails(ObjRequest, LM_Data, kyc_verify_request, kyc_verify_response);
                                        res.json({"Insurer": "Royal Sundaram", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                                    } else {
                                        res.json({"Insurer": "Royal Sundaram", "Msg": "KYC verify services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                                    }
                                });
                            } else {
                                res.json({"Insurer": "Royal Sundaram", "Msg": "Could Not Generate Token. Please try again later.", "Status": "FAIL"});
                            }
                        } catch (e2) {
                            res.json({"Insurer": "Royal Sundaram", "Msg": e2.stack, "Status": "FAIL"});
                        }
                    } else {
                        res.json({"Insurer": "Royal Sundaram", "Msg": "KYC-Token not generated. Please try again later.", "Status": "FAIL"});
                    }
                } else {
                    res.json({"Insurer": "Royal Sundaram", "Msg": "KYC-Token generation services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                }
            });
        } catch (e1) {
            res.json({"Insurer": "Royal Sundaram", "Msg": e1.stack, "Status": "FAIL"});
        }
    });

    app.post('/kyc_details/bajaj_fetch_kyc_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            let proposal_request = ObjRequest.hasOwnProperty('Proposal_Request') && ObjRequest.Proposal_Request ? ObjRequest.Proposal_Request : {};
            let kyc_fetch_request = "";
            let kyc_fetch_response = "";
            let vehicle_registration_type = (proposal_request.vehicle_registration_type === undefined || proposal_request.vehicle_registration_type === "" || proposal_request.vehicle_registration_type === null) ? "I" : (proposal_request.vehicle_registration_type.toLowerCase() === "corporate" ? "O" : "I");
            let req_txt;
            if (ObjRequest && ObjRequest.hasOwnProperty('Search_Type') && ObjRequest.Search_Type === 'PAN') {
                req_txt = {
                    "docTypeCode": "C",
                    "docNumber": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                    "fieldType": "PROPOSAL_NUMBER",
                    "fieldValue": (ObjRequest.Quote_Id === undefined || ObjRequest.Quote_Id === "" || ObjRequest.Quote_Id === null) ? "" : ObjRequest.Quote_Id,
                    "dob": (ObjRequest.DOB === undefined || ObjRequest.DOB === "" || ObjRequest.DOB === null) ? "" : moment(ObjRequest.DOB, 'DD/MM/YYYY').format('DD-MMM-YYYY'),
                    "appType": "KYC_WS_BROKER",
                    "productCode": "3313",
                    "sysType": "OPUS",
                    "locationCode": "9906",
                    "userId": "webservice@landmarkinsurance.com", //(ObjRequest.PB_CRN === undefined || ObjRequest.PB_CRN === "" || ObjRequest.PB_CRN === null) ? "" : ObjRequest.PB_CRN,
                    "kycType": "03",
                    "customerType": vehicle_registration_type,
                    //"passportFileNumber": "",
                    "gender": (proposal_request.gender === undefined || proposal_request.gender === "" || proposal_request.gender === null) ? "" : proposal_request.gender,
                    "field1": "MOTOR"
                };
            } else {
                let docyTypeCode = {'PASSPORT': 'A',
                    'VOTERID': 'B',
                    'PAN': 'C',
                    'DRIVINGLICENSE': 'D',
                    'AADHAR': 'E',
                    'NREGAJOBCARD': 'F',
                    'GSTIN': 'G',
                    'CKYCNUBER': 'Z'
                };
                req_txt = {
                    "docTypeCode": docyTypeCode[ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '')],
                    "docNumber": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                    "fieldType": "PROPOSAL_NUMBER",
                    "fieldValue": (ObjRequest.Quote_Id === undefined || ObjRequest.Quote_Id === "" || ObjRequest.Quote_Id === null) ? "" : ObjRequest.Quote_Id,
                    "dob": (ObjRequest.DOB === undefined || ObjRequest.DOB === "" || ObjRequest.DOB === null) ? "" : moment(ObjRequest.DOB, 'DD/MM/YYYY').format('DD-MMM-YYYY'),
                    "appType": "KYC_WS_BROKER",
                    "productCode": "3313",
                    "sysType": "OPUS",
                    "locationCode": "9906",
                    "userId": "webservice@landmarkinsurance.com", //(ObjRequest.PB_CRN === undefined || ObjRequest.PB_CRN === "" || ObjRequest.PB_CRN === null) ? "" : ObjRequest.PB_CRN,
                    "kycType": "03",
                    "customerType": vehicle_registration_type,
                    //"passportFileNumber": "",
                    "gender": (proposal_request.gender === undefined || proposal_request.gender === "" || proposal_request.gender === null) ? "" : proposal_request.gender,
                    "field1": "MOTOR"
                };
            }
            let token_req = {
                "sub": "KYC_WS_BROKER",
                "exp": 1668407854,
                "iat": 1668406054
            };
            let KYC_Status = "FETCH_FAIL";
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let LM_Data = {
                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": "",
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type,//"PAN",
                "KYC_Request": "",
                "KYC_Response": "",
                "ckyc_remarks": ""
            };
            let token = jwt.encode(token_req, secret, 'HS512');
            try {
                var key = CryptoJS.enc.Utf8.parse("kycwsbrkmotr2023");
                var iv = CryptoJS.enc.Utf8.parse("kycwsbrkmotr2023");
                let encrypted_req = CryptoJS.AES.encrypt(JSON.stringify(req_txt), key, {iv: iv}).toString();
                kyc_fetch_request = encrypted_req;
                LM_Data.KYC_Request = kyc_fetch_request;
                let temp_args = {"payload": encrypted_req};
                let args = {
                    data: JSON.stringify(temp_args),
                    headers: {
                        "Content-Type": "application/json",
                        "BusinessCorelationId": "36c18e93-ac17-4990-8451-e1929f42ea88"
                    }
                };
                //config.environment.name !== 'Production' ? (args.headers.Auth = 'Bearer ' + token) : (args.headers.Authorization = 'Bearer ' + token);
                args.headers.Auth = 'Bearer ' + token;
                var kyc_fetch_url = (config.environment.name === 'Production') ? ('https://webapi.bajajallianz.com/csckyc/validateCkycDetails') : ('https://api.bagicuat.bajajallianz.com/csckyc/validateCkycDetails');
                client.post(kyc_fetch_url, args, function (data, response) {
                    try {
                        if (data) {
                            if (data.hasOwnProperty('message') && data.message === "Endpoint request timed out") {
                                res.json({"Insurer": "BAJAJ", "Msg": "KYC fetch services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                            } else {
                                kyc_fetch_response = data;
                                LM_Data.KYC_Response = kyc_fetch_response;
                                var key = CryptoJS.enc.Utf8.parse("kycwsbrkmotr2023");
                                var iv = CryptoJS.enc.Utf8.parse("kycwsbrkmotr2023");
                                var decrypted = CryptoJS.AES.decrypt(data.payload, key, {iv: iv});
                                let val = decrypted.toString(CryptoJS.enc.Utf8);
                                let decrypted_res = JSON.parse(val);
                                if (decrypted_res.hasOwnProperty("kycStatus") && decrypted_res.kycStatus === "KYC_SUCCESS" && decrypted_res.hasOwnProperty("ckycNumber") && decrypted_res["ckycNumber"]) {
                                    LM_Data.KYC_Status = "FETCH_SUCCESS";
                                    LM_Data.KYC_Number = decrypted_res["ckycNumber"];
                                    LM_Data.KYC_FullName = (decrypted_res.hasOwnProperty("fullName")) ? decrypted_res.fullName : "";
                                } else {
                                    LM_Data.KYC_Status = "FETCH_FAIL";
                                    LM_Data.KYC_Number = decrypted_res.hasOwnProperty("ckycNumber") ? decrypted_res["ckycNumber"] : '';
                                }
                                saveKYCDetails(ObjRequest, LM_Data, kyc_fetch_request, kyc_fetch_response);
                                res.json({"Insurer": "BAJAJ", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                            }
                        } else {
                            res.json({"Insurer": "BAJAJ", "Msg": "KYC fetch services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                        }
                    } catch (err) {
                        res.json({"Insurer": "BAJAJ", "Msg": err.stack, "Status": "FAIL"});
                    }
                });
            } catch (e2) {
                res.json({"Insurer": "BAJAJ", "Msg": e2.stack, "Status": "FAIL"});
            }
        } catch (e1) {
            res.json({"Insurer": "BAJAJ", "Msg": e1.stack, "Status": "FAIL"});
        }
    });

    app.post('/kyc_details/bajaj_create_kyc_details', function (req, res) {
        try {
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let ObjRequest = req.body;
            let kyc_create_request = "";
            let kyc_create_response = "";
            let fetch_args = {
                data: JSON.stringify(ObjRequest),
                headers: {
                    "Content-Type": "application/json"
                }
            };
            client.post(config.environment.weburl + "/kyc_details/bajaj_fetch_kyc_details", fetch_args, function (data, response) {
                if (data) {
                    if (data.hasOwnProperty('Status') && data.Status === 'FETCH_SUCCESS') {
                        data.Msg.KYC_Status = 'CREATE_SUCCESS';
                        res.json({"Insurer": "BAJAJ", "Msg": data.Msg, "Status": 'CREATE_SUCCESS'});
                    } else {
                        let docyTypeCode = {'PASSPORT': 'A',
                            'VOTERID': 'B',
                            'PAN': 'C',
                            'DRIVINGLICENSE': 'D',
                            'AADHAR': 'E',
                            'NREGAJOBCARD': 'F',
                            'GSTIN': 'G',
                            'CKYCNUBER': 'Z'
                        };
                        var document_data;
                        if (ObjRequest.Doc1 !== undefined && ObjRequest.Doc1 !== "" && ObjRequest.Doc1 !== null) {
                            document_data = fs.readFileSync(appRoot + ObjRequest.Doc1);
                        }
                        if (document_data) {
                            let extension = ObjRequest.hasOwnProperty('Doc1_Name') ? ObjRequest.Doc1_Name.split('.')[ObjRequest.Doc1_Name.split('.').length - 1] : "";
                            let req_txt = {
                                "userId": "webservice@landmarkinsurance.com",
                                "appType": "KYC_WS_BROKER",
                                "fieldType": "PROPOSAL_NUMBER",
                                "fieldValue": (ObjRequest.Quote_Id === undefined || ObjRequest.Quote_Id === "" || ObjRequest.Quote_Id === null) ? "" : ObjRequest.Quote_Id,
                                "kycDocumentType": "POA",
                                "kycDocumentCategory": docyTypeCode[ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '')],
                                "documentNumber": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                                "documentExtension": extension.toLowerCase(),
                                "documentArray": document_data.toString('base64')//(ObjRequest.Doc3 === undefined || ObjRequest.Doc3 === "" || ObjRequest.Doc3 === null) ? "" : ObjRequest.Doc3
                            };
                            let token_req = {
                                "sub": "KYC_WS_BROKER",
                                "exp": 1668407854,
                                "iat": 1668406054
                            };
                            let KYC_Status = "CREATE_FAIL";
                            let LM_Data = {
                                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                                "KYC_Number": "",
                                "KYC_FullName": "",
                                "KYC_Ref_No": "",
                                "KYC_Redirect_URL": "",
                                "KYC_Insurer_ID": "",
                                "KYC_PB_CRN": ObjRequest.PB_CRN,
                                "KYC_Status": KYC_Status,
                                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type,//"PAN",
                                "KYC_Request": "",
                                "KYC_Response": "",
                                "ckyc_remarks": ""
                            };
                            let token = jwt.encode(token_req, secret, 'HS512');
                            try {
                                let args = {
                                    data: JSON.stringify(req_txt),
                                    headers: {
                                        "Content-Type": "application/json",
                                        "BusinessCorelationId": "36c18e93-ac17-4990-8451-e1929f42ea88"
                                    }
                                };
                                kyc_create_request = req_txt;
                                //config.environment.name !== 'Production' ? (args.headers.Auth = 'Bearer ' + token) : (args.headers.Authorization = 'Bearer ' + token);
                                args.headers.Auth = 'Bearer ' + token;
                                var kyc_create_url = (config.environment.name === 'Production') ? ('https://webapi.bajajallianz.com/csckyc/uploadKYCDocument') : ('https://api.bagicuat.bajajallianz.com/csckyc/uploadKYCDocument');
                                client.post(kyc_create_url, args, function (data, response) {
                                    if (data) {
                                        kyc_create_response = data;
                                        if (data && data.hasOwnProperty("documentUploadStatus") && data.documentUploadStatus) {
                                            if (data.documentUploadStatus.hasOwnProperty("poaDocUploadStatus") && data.documentUploadStatus.poaDocUploadStatus && data.documentUploadStatus.poaDocUploadStatus.toLowerCase() === "success" && data.documentUploadStatus.hasOwnProperty("bagicKycStatus") && data.documentUploadStatus.bagicKycStatus.toLowerCase() === "kyc_success" && data.documentUploadStatus.bagicKycId) {
                                                LM_Data.KYC_Status = "CREATE_SUCCESS";
                                                LM_Data.KYC_Number = data.documentUploadStatus.bagicKycId;
                                                LM_Data.KYC_FullName = (data.hasOwnProperty("fullName")) ? data.fullName : "";
                                            } else {
                                                LM_Data.KYC_Status = "CREATE_FAIL";
                                                LM_Data.KYC_Number = data.hasOwnProperty("ckycNumber") ? data["ckycNumber"] : '';
                                            }
                                        } else {
                                            LM_Data.KYC_Status = "CREATE_FAIL";
                                            LM_Data.KYC_Number = data.hasOwnProperty("ckycNumber") ? data["ckycNumber"] : '';
                                        }
                                        kyc_create_request['documentArray'] = ObjRequest.Doc1;
                                        LM_Data.KYC_Request = kyc_create_request;
                                        LM_Data.KYC_Response = kyc_create_response;
                                        saveKYCDetails(ObjRequest, LM_Data, kyc_create_request, kyc_create_response);
                                        res.json({"Insurer": "BAJAJ", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                                    } else {
                                        res.json({"Insurer": "BAJAJ", "Msg": "KYC create service failed due to technical issue. Please try again later.", "Status": "FAIL"});
                                    }
                                });
                            } catch (e2) {
                                res.json({"Insurer": "BAJAJ", "Msg": e2.stack, "Status": "FAIL"});
                            }
                        }
                    }
                } else {
                    res.json({"Insurer": "BAJAJ", "Msg": 'Validate POA failed', "Status": "FAIL"});
                }

            });
        } catch (e1) {
            res.json({"Insurer": "BAJAJ", "Msg": e1.stack, "Status": "FAIL"});
        }
    });

    app.post('/kyc_details/bajaj_verify_kyc_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            let proposal_request = ObjRequest.hasOwnProperty('Proposal_Request') && ObjRequest.Proposal_Request ? ObjRequest.Proposal_Request : {};
            let kyc_verify_request = "";
            let kyc_verify_response = "";
            let vehicle_registration_type = (proposal_request.vehicle_registration_type === undefined || proposal_request.vehicle_registration_type === "" || proposal_request.vehicle_registration_type === null) ? "I" : (proposal_request.vehicle_registration_type.toLowerCase() === "corporate" ? "O" : "I");
            var user_kyc_no = (ObjRequest.user_kyc_no === undefined || ObjRequest.user_kyc_no === "" || ObjRequest.user_kyc_no === null) ? "" : ObjRequest.user_kyc_no;
            let req_txt = {
                "docTypeCode": "Z",
                "docNumber": user_kyc_no,
                "fieldType": "PROPOSAL_NUMBER",
                "fieldValue": (ObjRequest.Quote_Id === undefined || ObjRequest.Quote_Id === "" || ObjRequest.Quote_Id === null) ? "" : ObjRequest.Quote_Id,
                "dob": (ObjRequest.DOB === undefined || ObjRequest.DOB === "" || ObjRequest.DOB === null) ? "" : moment(ObjRequest.DOB, 'DD/MM/YYYY').format('DD-MMM-YYYY'),
                "appType": "KYC_WS_BROKER",
                "productCode": "3313",
                "sysType": "OPUS",
                "locationCode": "9906",
                "userId": "webservice@landmarkinsurance.com", //(ObjRequest.PB_CRN === undefined || ObjRequest.PB_CRN === "" || ObjRequest.PB_CRN === null) ? "" : ObjRequest.PB_CRN,
                "kycType": "03",
                "customerType": vehicle_registration_type,
                "passportFileNumber": "",
                "gender": (proposal_request.gender === undefined || proposal_request.gender === "" || proposal_request.gender === null) ? "" : proposal_request.gender,
                "field1": "MOTOR"
            };
            let token_req = {
                "sub": "KYC_WS_BROKER",
                "exp": 1668407854,
                "iat": 1668406054
            };
            let KYC_Status = "VERIFY_FAIL";
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let LM_Data = {
                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": "",
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type,//"PAN",
                "KYC_Request": "",
                "KYC_Response": "",
                "ckyc_remarks": ""
            };
            let token = jwt.encode(token_req, secret, 'HS512');
            try {
                var key = CryptoJS.enc.Utf8.parse("kycwsbrkmotr2023");
                var iv = CryptoJS.enc.Utf8.parse("kycwsbrkmotr2023");
                let encrypted_req = CryptoJS.AES.encrypt(JSON.stringify(req_txt), key, {iv: iv}).toString();
                kyc_verify_request = encrypted_req;
                LM_Data.KYC_Request = kyc_verify_request;
                let temp_args = {"payload": encrypted_req};
                let args1 = {
                    data: JSON.stringify(temp_args),
                    headers: {
                        "Content-Type": "application/json",
                        "BusinessCorelationId": "36c18e93-ac17-4990-8451-e1929f42ea88"
                    }
                };
                //config.environment.name !== 'Production' ? (args1.headers.Auth = 'Bearer ' + token) : (args1.headers.Authorization = 'Bearer ' + token);
                args1.headers.Auth = 'Bearer ' + token;
                var kyc_fetch_url = (config.environment.name === 'Production') ? ('https://webapi.bajajallianz.com/csckyc/validateCkycDetails') : ('https://api.bagicuat.bajajallianz.com/csckyc/validateCkycDetails');
                client.post(kyc_fetch_url, args1, function (data, response) {
                    if (data) {
                        kyc_verify_response = data;
                        LM_Data.KYC_Response = kyc_verify_response;
                        var key = CryptoJS.enc.Utf8.parse("kycwsbrkmotr2023");
                        var iv = CryptoJS.enc.Utf8.parse("kycwsbrkmotr2023");
                        var decrypted = CryptoJS.AES.decrypt(data.payload, key, {iv: iv});
                        let val = decrypted.toString(CryptoJS.enc.Utf8);
                        let decrypted_res = JSON.parse(val);
                        //kyc_verify_response = decrypted_res; // kyc_insurer_response
                        if (decrypted_res.hasOwnProperty("kycStatus") && decrypted_res.kycStatus === "KYC_SUCCESS" && decrypted_res.hasOwnProperty("ckycNumber") && decrypted_res["ckycNumber"]) {
                            LM_Data.KYC_Status = "VERIFY_SUCCESS";
                            LM_Data.KYC_Number = decrypted_res["ckycNumber"];
                            LM_Data.KYC_FullName = (decrypted_res.hasOwnProperty("fullName")) ? decrypted_res.fullName : "";
                        } else {
                            LM_Data.KYC_Status = "VERIFY_FAIL";
                            LM_Data.KYC_Number = decrypted_res.hasOwnProperty("ckycNumber") ? decrypted_res["ckycNumber"] : '';
                        }
                        saveKYCDetails(ObjRequest, LM_Data, kyc_verify_request, kyc_verify_response);
                        res.json({"Insurer": "BAJAJ", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                    } else {
                        res.json({"Insurer": "BAJAJ", "Msg": "KYC verify services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                    }
                });
            } catch (e2) {
                res.json({"Insurer": "BAJAJ", "Msg": e2.stack, "Status": "FAIL"});
            }
        } catch (e1) {
            res.json({"Insurer": "BAJAJ", "Msg": e1.stack, "Status": "FAIL"});
        }
    });

    app.post('/kyc_details/bajaj_encrypting', function (req, res) {
        try {
            var user_kyc_no = (req.body.user_kyc_no === undefined || req.body.user_kyc_no === "" || req.body.user_kyc_no === null) ? "" : req.body.user_kyc_no;
            var user_name = null;
            if (req.body.middle_name === undefined || req.body.middle_name === "" || req.body.middle_name === null) {
                user_name = ((req.body.first_name === undefined || req.body.first_name === "" || req.body.first_name === null) ? "" : req.body.first_name) + " " +
                        ((req.body.last_name === undefined || req.body.last_name === "" || req.body.last_name === null) ? "" : req.body.last_name);
            } else {
                user_name = ((req.body.first_name === undefined || req.body.first_name === "" || req.body.first_name === null) ? "" : req.body.first_name) + " " +
                        ((req.body.middle_name === undefined || req.body.middle_name === "" || req.body.middle_name === null) ? "" : req.body.middle_name) + " " +
                        ((req.body.last_name === undefined || req.body.last_name === "" || req.body.last_name === null) ? "" : req.body.last_name);
            }
            let req_txt = {
                "mobile": (req.body.mobile === undefined || req.body.mobile === "" || req.body.mobile === null) ? "" : req.body.mobile,
                "name": user_name,
                "kyc_id": user_kyc_no,
                "dob": (req.body.dob === undefined || req.body.dob === "" || req.body.dob === null) ? "" : req.body.dob,
                "ckyc_number": user_kyc_no,
                "pan": (req.body.pan === undefined || req.body.pan === "" || req.body.pan === null) ? "" : req.body.pan,
                "aadhaar_uid": (req.body.aadhar === undefined || req.body.aadhar === "" || req.body.aadhar === null) ? "" : (req.body.aadhar.substr(req.body.aadhar.length - 4)), //"last 4 digits of aadhar",
                "agent_id": "",
                "gc_cust_id": "",
                "eia_number": "",
                "email_address": (req.body.email === undefined || req.body.email === "" || req.body.email === null) ? "" : req.body.email,
                "redirect_url": ""
            };

            let args = {headers: {"token": ""}};
            let args1 = {
                headers: {
                    "api_key": "8d399be8-0b6f-4a"
                }
            };
            let KYC_Status = "PENDING";
            let token = null;
            var Client = require('node-rest-client').Client;
            var client = new Client();
            client.get("https://ekyc-uat.hdfcergo.com/e-kyc/tgt/generate-token", args1, function (data1, response1) {
                if (data1) {
                    if (data1.hasOwnProperty("success") && data1.success === true) {
                        if (data1.hasOwnProperty("data") && data1.data.hasOwnProperty("token") && data1.data.token !== "" && data1.data.token !== null) {
                            token = data1.data.token;
                            try {
                                if (token) {
                                    args.headers.token = token;
                                    var client1 = new Client();
                                    client1.get("https://ekyc-uat.hdfcergo.com/e-kyc/primary/kyc-status/" + user_kyc_no, args, function (data, response) {
                                        if (data) {
                                            let LM_Data = {
                                                'KYC_Obj': {
                                                    'kyc_id': ''
                                                },
                                                'LM_Obj': {
                                                    'iskycVerified': '',
                                                    'redirect_link': '',
                                                    'status': ''
                                                },
                                                'Hdfc_Obj': {
                                                    'data': ''
                                                },
                                                'tmp_Obj': ''
                                            };
                                            if (data.hasOwnProperty("message") && data.message !== "") {
                                                KYC_Status = "FAIL";
                                                LM_Data.Hdfc_Obj.data = data.message;
                                                LM_Data.tmp_Obj = LM_Data.Hdfc_Obj.data;
                                            } else {
                                                if (data.hasOwnProperty("success") && data.success === true && data.hasOwnProperty("data") && data.data.hasOwnProperty("iskycVerified")) {
                                                    if (data.data.iskycVerified === 1) {
                                                        KYC_Status = "SUCCESS";
                                                        LM_Data.KYC_Obj.kyc_id = user_kyc_no;
                                                        LM_Data.tmp_Obj = LM_Data.KYC_Obj;
                                                    } else if (data.data.iskycVerified === 0) {
                                                        KYC_Status = "FAIL";
                                                        LM_Data.Hdfc_Obj.data = data;
                                                        LM_Data.tmp_Obj = LM_Data.Hdfc_Obj.data;
                                                    } else {
                                                        KYC_Status = "FAIL";
                                                        LM_Data.Hdfc_Obj.data = data;
                                                        LM_Data.tmp_Obj = LM_Data.Hdfc_Obj.data;
                                                    }
                                                } else {
                                                    KYC_Status = "FAIL";
                                                    LM_Data.Hdfc_Obj.data = data;
                                                    LM_Data.tmp_Obj = LM_Data.Hdfc_Obj.data;
                                                }
                                            }

                                            try {
                                                //data.data.Msg.kyc_id = user_kyc_no;
                                                let queryObj = {
                                                    'Insurer_Id': req.body.insurer_id,
                                                    'Search_Type': (req.body.search_type === undefined || req.body.search_type === "" || req.body.search_type === null) ? "" : req.body.search_type,
                                                    'KYC_Number': user_kyc_no,
                                                    'Mobile': (req.body.mobile === undefined || req.body.mobile === "" || req.body.mobile === null) ? "" : req.body.mobile,
                                                    'PAN': (req.body.pan === undefined || req.body.pan === "" || req.body.pan === null) ? "" : req.body.pan,
                                                    'Aadhar': (req.body.aadhar === undefined || req.body.aadhar === "" || req.body.aadhar === null) ? "" : req.body.aadhar,
                                                    'KYC_Status': KYC_Status,
                                                    'DOB': (req.body.dob === undefined || req.body.dob === "" || req.body.dob === null) ? "" : req.body.dob,
                                                    'Created_On': new Date(),
                                                    'Modified_On': new Date(),
                                                    'User_Data_Id': (req.body.udid === undefined || req.body.udid === "" || req.body.udid === null) ? 0 : req.body.udid,
                                                    'Product_Id': (req.body.product_id === undefined || req.body.product_id === "" || req.body.product_id === null) ? 0 : req.body.product_id,
                                                    'Email': (req.body.email === undefined || req.body.email === "" || req.body.email === null) ? "" : req.body.email,
                                                    'PB_CRN': (req.body.crn === undefined || req.body.crn === "" || req.body.crn === null) ? "" : req.body.crn
                                                };
                                                var kyc_detail1 = new kyc_detail(queryObj);
                                                kyc_detail1.save(queryObj, function (err, users) {
                                                    if (err) {
                                                        res.json({"Insurer": "Bajaj", "Msg": err, "Status": "FAIL"});
                                                    } else {
                                                        //res.json({"Insurer": "Bajaj", "Msg": LM_Data.tmp_Obj, "Status": KYC_Status});
                                                    }
                                                });
                                                let queryObj1 = {
                                                    'PB_CRN': (req.body.crn === undefined || req.body.crn === "" || req.body.crn === null) ? "" : req.body.crn,
                                                    'User_Data_Id': (req.body.udid === undefined || req.body.udid === "" || req.body.udid === null) ? 0 : req.body.udid,
                                                    'PAN': (req.body.pan === undefined || req.body.pan === "" || req.body.pan === null) ? "" : req.body.pan,
                                                    'Aadhaar': (req.body.aadhar === undefined || req.body.aadhar === "" || req.body.aadhar === null) ? "" : req.body.aadhar,
                                                    'DOB': (req.body.dob === undefined || req.body.dob === "" || req.body.dob === null) ? "" : req.body.dob,
                                                    'Mobile': (req.body.mobile === undefined || req.body.mobile === "" || req.body.mobile === null) ? "" : req.body.mobile,
                                                    'Email': (req.body.email === undefined || req.body.email === "" || req.body.email === null) ? "" : req.body.email,
                                                    'Insurer_Id': req.body.insurer_id,
                                                    'KYC_Request_Core': req_txt,
                                                    'KYC_Response_Core': data,
                                                    'Status': "completed",
                                                    'Created_On': new Date(),
                                                    'Modified_On': new Date()
                                                };
                                                var kyc_history1 = new kyc_history(queryObj1);
                                                kyc_history1.save(queryObj1, function (err, users) {
                                                    if (err) {
                                                        res.json({"Insurer": "Bajaj", "Msg": err, "Status": "FAIL"});
                                                    } else {
                                                        //res.json({"Insurer": "Bajaj", "Msg": LM_Data.tmp_Obj, "Status": KYC_Status});
                                                    }
                                                });
                                            } catch (e) {
                                                res.json({"Insurer": "Bajaj", "Msg": e.stack, "Status": "FAIL"});
                                            }
                                            res.json({"Insurer": "Bajaj", "Msg": LM_Data.tmp_Obj, "Status": KYC_Status});
                                        } else {
                                            res.json({"Insurer": "Bajaj", "Msg": "KYC verify services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                                        }
                                    });
                                } else {
                                    res.json({"Insurer": "Bajaj", "Msg": "Could Not Generate Token. Please try again later.", "Status": "FAIL"});
                                }
                            } catch (e2) {
                                res.json({"Insurer": "Bajaj", "Msg": e2.stack, "Status": "FAIL"});
                            }
                        } else {
                            res.json({"Insurer": "Bajaj", "Msg": "KYC-Token not generated. Please try again later.", "Status": "FAIL"});
                        }
                    } else {
                        res.json({"Insurer": "Bajaj", "Msg": "KYC-Token generation services was not successful. Please try again later.", "Status": "FAIL"});
                    }
                } else {
                    res.json({"Insurer": "Bajaj", "Msg": "KYC-Token generation services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                }
            });
        } catch (e1) {
            res.json({"Insurer": "Bajaj", "Msg": e1.stack, "Status": "FAIL"});
        }
    });

    app.get('/kyc_details/get_kyc_status_NIU/:crn/:udid', function (req, res) {
        try {
            let crn = req.params.crn - 0;
            let udid = req.params.udid - 0;
            let kyc_detail = require('../models/kyc_detail');
            kyc_detail.findOne({'PB_CRN': crn, 'User_Data_Id': udid}).sort({Modified_On:-1}).exec(function (err, data) {
                if (err) {
                    res.json({"Msg": err, "Status": "FAIL"});
                } else {
                    if (data) {
                        res.json({"Msg": data['_doc'], "Status": data['_doc'].KYC_Status});
                    } else {
                        res.json({"Msg": "No Data Available", "Status": "NEW"});
                    }
                }
            });
        } catch (err) {
            res.json({"Msg": err.stack, "Status": "FAIL"});
        }
    });
    app.get('/kyc_details/get_kyc_status/:crn/:insurer_id', function (req, res) {
        try {
            let crn = req.params.crn - 0;
            let insurer_id = req.params.insurer_id - 0;
            let kyc_detail = require('../models/kyc_detail');
            kyc_detail.findOne({'PB_CRN': crn, 'Insurer_Id': insurer_id}).sort({Modified_On: -1}).exec(function (err, data) {
                if (err) {
                    res.json({"Msg": err, "Status": "FAIL"});
                } else {
                    if (data) {
                        res.json({"Msg": data['_doc'], "Status": data['_doc'].KYC_Status});
                    } else {
                        res.json({"Msg": "No Data Available", "Status": "NEW"});
                    }
                }
            });
        } catch (err) {
            res.json({"Msg": err.stack, "Status": "FAIL"});
        }
    });
    
    app.get('/kyc_details/get_kyc_proposal_url/:crn/:insurer_id', function (req, res) {
        try {
            let crn = req.params.crn - 0;
            let insurer_id = req.params.insurer_id - 0;
            let KYC_Details = require('../models/kyc_detail');
            KYC_Details.findOne({'PB_CRN': crn, 'Insurer_Id': insurer_id}).sort({Modified_On: -1}).exec(function (kyc_details_err, kyc_details_res) {
                if (kyc_details_err) {
                    res.json({"Msg": kyc_details_err, "Status": "FAIL"});
                } else {
                    if (kyc_details_res && kyc_details_res.hasOwnProperty('_doc')) {
                        var response_obj = {
                            "proposal_page_url": kyc_details_res['_doc'].hasOwnProperty('proposal_page_url') ? kyc_details_res['_doc']['proposal_page_url'] : "",
                            "KYC_URL": kyc_details_res['_doc'].hasOwnProperty('KYC_URL') ? kyc_details_res['_doc']['KYC_URL'] : ""
                        };
                        res.json(response_obj);
                    } else {
                        res.json({"Status": "Fail", "Msg": "No Data Found"});
                    }
                }
            });
        } catch (err) {
            res.json({"Msg": err.stack, "Status": "FAIL"});
        }
    });
    
    app.get('/kyc_details/verify_scheduler', function (req, res, next) {
        var Client = require('node-rest-client').Client;
        var client = new Client();
        let data_count = 0;
        kyc_detail.find({KYC_Status: 'FAIL'}).exec(function (err, dbRequest) {
            if (err)
                res.send("Error :" + err.stack);
            if (dbRequest.length > 0) {
                let objCallSummary = {
                    'main': {
                        'total_job': dbRequest.length,
                        'success_job_cnt': 0,
                        'fail_job_cnt': 0,
                        'verified_status_cnt': 0,
                        'pending_status_cnt': 0
                    },
                    'success_job': [],
                    'fail_job': [],
                    'verified_job': [],
                    'pending_job': []
                };

                let service_method_url = config.environment.weburl + "/postservicecall/kyc_details/search_kyc_details";
                for (let i in dbRequest) {
                    data_count++;
                    let arg_obj = dbRequest[i]['_doc'];
                    let args = {
                        data: {
                            "search_type": "VERIFY",
                            "pan": arg_obj['PAN'],
                            "dob": arg_obj['DOB'],
                            "insurer_id": arg_obj['Insurer_Id'] - 0,
                            "crn": arg_obj['PB_CRN'] - 0,
                            "user_kyc_no": "",
                            "udid": 270228 - 0,
                            "product_id": 1 - 0,
                            "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
                            "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9"
                        },
                        headers: {
                            "Content-Type": "application/json"
                        }
                    };
                    try {
                        client.post(service_method_url, args, function (data, response) {
                            if (data.Status === 'Success') {
                                objCallSummary.main.success_job_cnt++;
                                objCallSummary.success_job.push(data.Summary);
                                if (data.MSG === "Verify") {
                                    objCallSummary.main.verified_status_cnt++;
                                    objCallSummary.verified_job.push(data.Summary);
                                } else {
                                    objCallSummary.main.pending_status_cnt++;
                                    objCallSummary.pending_job.push(data.Summary);
                                }
                            } else {
                                objCallSummary.main.fail_job_cnt++;
                                var SummaryErr = {
                                    'url': service_method_url,
                                    'err': data,
                                    'status': 'api_failed'
                                };
                                objCallSummary.fail_job.push(SummaryErr);
                            }
                        });
                    } catch (ex) {
                        var SummaryErr = {
                            'url': service_method_url,
                            'err': ex.stack,
                            'status': 'api_exception'
                        };
                        console.error('Exception', 'post_call_error', ex.stack);
                        objCallSummary.fail_job.push(SummaryErr);
                    }
                    if (i === dbRequest.length - 1) {
                        res.send(objCallSummary);
                    }
                }
            } else {
                res.send("Record Not found for verify KYC");
            }
        });
    });
    
    app.post('/kyc_details/tataaig_fetch_kyc_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            let kyc_fetch_request = "";
            let kyc_fetch_response = "";
            let proposal_request = ObjRequest.Proposal_Request;
            let tokenservice_url = ((config.environment.name === 'Production') ? 'https://foyer-tataaig.auth.ap-south-1.amazoncognito.com/oauth2/token' : 'https://uatapigw-tataaig.auth.ap-south-1.amazoncognito.com/oauth2/token');
            let grant_type = ((config.environment.name === 'Production') ? 'client_credentials' : 'client_credentials');
            let scope = ((config.environment.name === 'Production') ? 'https://foyer.tataaig.com/write' : 'https://api.iorta.in/write');
            let client_id = ((config.environment.name === 'Production') ? '14rs1d1nbr70qu2rq3jlc9tu5m' : '5qdbqng8plqp1ko2sslu695n2g');
            let client_secret = ((config.environment.name === 'Production') ? '2usb6cl1os1cvplu507kbeasvjb0bl7193e08dojnosd2ouvmod' : 'gki6eqtltmjj37gpqq0dt52dt651o079dn6mls62ptkvsa2b45c');
            
            if (ObjRequest && ObjRequest.Product_Id && parseInt(ObjRequest.Product_Id) !== 10) {
                client_id = ((config.environment.name === 'Production') ? '54qqhf0pbk1jghrpajm8vjas8' : '5qdbqng8plqp1ko2sslu695n2g');
                client_secret = ((config.environment.name === 'Production') ? '1lg9d2a3lrns333hgs5mdnd8or6l1iesd02qtofb8r3vgnc53asn' : 'gki6eqtltmjj37gpqq0dt52dt651o079dn6mls62ptkvsa2b45c');
            }
            
            let token_args = {
                "grant_type": grant_type,
                "scope": scope,
                "client_id": client_id,
                "client_secret": client_secret
            };
            let kyc_token_args = {
                data: token_args,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            };
            function jsonToQueryString(json) {
                return  Object.keys(json).map(function (key) {
                    return encodeURIComponent(key) + '=' +
                            encodeURIComponent(json[key]);
                }).join('&');
            }
            kyc_token_args.data = jsonToQueryString(kyc_token_args.data);
            let full_name = proposal_request['middle_name'] === "" ? (proposal_request['first_name'] + " " + proposal_request['last_name']) : (proposal_request['first_name'] + " " + proposal_request['middle_name'] + " " + proposal_request['last_name']);
            let product_name_obj = {1: "motor", 10: "motor", 12: "motor", 2: "", 4: "travel"};
            let product_name = product_name_obj[ObjRequest.Product_Id];
            let KYC_Status = "PENDING";
            let kyc_id = 0;
            let token = null;
            let Client = require('node-rest-client').Client;
            let client = new Client();
            let user_datas = {};
            let LM_Data = {
                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type,//"PAN",
                "KYC_Request": "",
                "KYC_Response": "",
                "ckyc_remarks": ""
            };
            console.log(kyc_token_args);
             console.log(tokenservice_url);
             var request = require('request');
        var options = {
            'method': 'POST',
            'url': 'https://foyer-tataaig.auth.ap-south-1.amazoncognito.com/oauth2/token',
            'headers': {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': 'XSRF-TOKEN=7238d7ac-d335-4bea-abbf-b39ae11c8aff'
            },
            form: {
                'grant_type': 'client_credentials',
                'scope': 'https://foyer.tataaig.com/write',
                'client_id': '54qqhf0pbk1jghrpajm8vjas8',
                'client_secret': '1lg9d2a3lrns333hgs5mdnd8or6l1iesd02qtofb8r3vgnc53asn'
            }
        };
        request(options, function (error, token_data) {
//            client.post(tokenservice_url, kyc_token_args, function (token_data, response1) {
                if (token_data) {
                    if (token_data.hasOwnProperty("body") && token_data.body) {
                        token_data.body = JSON.parse(token_data.body)
                        token = token_data.body.access_token;
                        try {
                            if (token) {
//                                client.get(config.environment.weburl + '/user_datas/view/' + req.body.User_Data_Id, {}, function (db_user_data, response) {
//                                    if (db_user_data) {
//                                        user_datas = db_user_data[0];
//                                        let objProduct = {
//                                            "Quote_Id": user_datas['Processed_Request']['___insurer_customer_identifier___'],
//                                            "Modified_On": new Date()
//                                        };
//                                        kyc_detail.update({"PB_CRN": user_datas['PB_CRN'] - 0, "User_Data_Id": req.body.User_Data_Id}, {$set: objProduct}, function (err, objKyCDetails) {
//                                            if (err) {
//                                                res.json({"Insurer": "TATA_AIG", "Msg": 'KYC fetch services failed due to KYC Details not Updated. Please try again later.', "Status": "Fail"});
//                                            } else {
//                                                client.get(config.environment.weburl + '/kyc_details/get_kyc_status/' + user_datas['PB_CRN'] + '/' + ObjRequest.Insurer_Id, {}, function (db_kyc_details, response) {
//                                                    if (db_kyc_details) {
                                let verify_kyc_service_url = ((config.environment.name === 'Production') ? 'https://foyer.tataaig.com/ckyc/verify?product=' : 'https://uatapigw.tataaig.com/ckyc/verify?product=') + product_name;
                                let docyTypeCode = {
                                    'PASSPORT': 'PASSPORT',
                                    'VOTERID': 'VOTERID',
                                    'PAN': 'PAN',
                                    'DRIVINGLICENSE': 'DL',
                                    'AADHAR': 'AADHAAR'
                                };
                                let verify_args = {
                                    "id_type": docyTypeCode[ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '')],//(ObjRequest.Search_Type === undefined || ObjRequest.Search_Type === "" || ObjRequest.Search_Type === null) ? "" : ObjRequest.Search_Type,
                                    "id_num":  ObjRequest.Document_ID,//ObjRequest.Search_Type === "PAN" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID) : "",//(proposal_request.pan === undefined || proposal_request.pan === "" || proposal_request.pan === null) ? "" : proposal_request.pan,
                                    "customer_name": full_name.trim()
                                };
                                if (ObjRequest.hasOwnProperty('Product_Id') && ObjRequest.Product_Id && (ObjRequest.Product_Id === 10)) {
                                    verify_args['proposal_no'] = ObjRequest.Proposal_Id;
                                } else {
                                    verify_args['proposal_no'] = ObjRequest.Proposal_Id;
                                }
                                if(ObjRequest.KYC_Ref_No && ObjRequest.KYC_Ref_No !== ''){
                                    verify_args.req_id = ObjRequest.KYC_Ref_No;
                                    verify_args.gender = ObjRequest.Proposal_Request['gender'];
                                    verify_args.dob = moment(proposal_request.birth_date, 'DD/MM/YYYY').format('DD-MM-YYYY');
                                }
                                kyc_fetch_request = verify_args;
                                LM_Data.KYC_Request = kyc_fetch_request;
                                let kyc_verify_args = {
                                    data: verify_args,
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Authorization": token,
                                        "x-api-key": ((config.environment.name === 'Production') ? 'Xt4dW7poXZ9i7nI7xnTG21GuR7LtjlO27p1Tgflz' : 'g8hoqi8TBA2mBpxgMohdTcWxAfv6JsJ6wLztOWm4')
                                    }
                                };
                                
                                if (ObjRequest && ObjRequest.Product_Id && parseInt(ObjRequest.Product_Id) === 1) {
                                    kyc_verify_args["headers"]["x-api-key"] = ((config.environment.name === 'Production') ? 'euo2LL5PEc8IvEGwjvAdO16r6MNskqpNQpKihMse' : 'g8hoqi8TBA2mBpxgMohdTcWxAfv6JsJ6wLztOWm4');
                                }
                                
                                let client1 = new Client();
                                client1.post(verify_kyc_service_url, kyc_verify_args, function (kyc_verify_data, response) {
                                    if (kyc_verify_data) {
                                        kyc_fetch_response = kyc_verify_data;
                                        LM_Data.KYC_Response = kyc_fetch_response;
                                        if (kyc_verify_data.hasOwnProperty("status") && kyc_verify_data.status === 400 && kyc_verify_data.hasOwnProperty("message_txt") && kyc_verify_data.message_txt) {
                                            LM_Data.KYC_Status = "FETCH_FAIL";
                                            LM_Data.ckyc_remarks = "Insurer is not able to verify your KYC in given Pan Number, Kindly use another Insurer";
                                        } else if (kyc_verify_data.hasOwnProperty("status") && kyc_verify_data.status === 200) {
                                            if (kyc_verify_data.hasOwnProperty('data') && kyc_verify_data.data.hasOwnProperty('result') && kyc_verify_data.data.result.hasOwnProperty('ckyc_number')) {
                                                if (kyc_verify_data.data.result.ckyc_number) {
                                                    kyc_id = kyc_verify_data.data.result.ckyc_number;
                                                    LM_Data.KYC_Number = kyc_id;
                                                    LM_Data.KYC_FullName = (kyc_verify_data.data.result.registered_name) ? (kyc_verify_data.data.result.registered_name).trim() : full_name.trim();
                                                    LM_Data.KYC_Doc_No = ObjRequest.Document_ID;
                                                    LM_Data.KYC_Status = "FETCH_SUCCESS";
                                                } else {
                                                    LM_Data.KYC_Status = "FETCH_FAIL";
                                                    LM_Data.KYC_Doc_No = ObjRequest.Document_ID;
                                                    LM_Data.KYC_Ref_No = kyc_verify_data.data.req_id;
                                                    LM_Data.ckyc_remarks = "Insurer is not able to verify your KYC in given Pan Number, Kindly use another Insurer";
                                                }
                                            } else {
                                                LM_Data.KYC_Status = "FETCH_FAIL";
                                                LM_Data.KYC_Doc_No = ObjRequest.Document_ID;
                                                LM_Data.KYC_Ref_No = kyc_verify_data.data.req_id;
                                                LM_Data.ckyc_remarks = "Insurer is not able to verify your KYC in given Pan Number, Kindly use another Insurer";
                                            }
                                        } else {
                                            LM_Data.KYC_Status = "FETCH_FAIL";
                                            if (kyc_verify_data.hasOwnProperty('data') && kyc_verify_data.data.hasOwnProperty('req_id')) {
                                                LM_Data.KYC_Ref_No = kyc_verify_data.data.req_id; // request id
                                            }
                                            LM_Data.ckyc_remarks = "Insurer is not able to verify your KYC in given Pan Number, Kindly use another Insurer";
                                        }
                                        saveKYCDetails(ObjRequest, LM_Data, kyc_fetch_request, kyc_fetch_response);
                                        res.json({"Insurer": "TATA_AIG", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                                    } else {
                                        res.json({"Insurer": "TATA_AIG", "Msg": "KYC fetch services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                                    }
                                });
//                                                    } else {
//                                                        res.json({"Insurer": "TATA_AIG", "Msg": "KYC fetch services failed due to no details available in KYC Details Database. Please try again later.", "Status": "FAIL"});
//                                                    }
//                                                });
//                                            }
//                                        });
//                                    } else {
//                                        res.json({"Insurer": "TATA_AIG", "Msg": "KYC fetch services failed due to no details available in user data. Please try again later.", "Status": "FAIL"});
//                                    }
//                                });
                            } else {
                                res.json({"Insurer": "TATA_AIG", "Msg": "Could Not Generate Token. Please try again later.", "Status": "FAIL"});
                            }
                        } catch (e2) {
                            res.json({"Insurer": "TATA_AIG", "Msg": e2.stack, "Status": "FAIL"});
                        }
                    } else {
                        res.json({"Insurer": "TATA_AIG", "Msg": "KYC-Token generation services was not successful. Please try again later.", "Status": "FAIL"});
                    }
                } else {
                    res.json({"Insurer": "TATA_AIG", "Msg": "KYC-Token generation services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                }
            });
        } catch (e1) {
            res.json({"Insurer": "TATA_AIG", "Msg": e1.stack, "Status": "FAIL"});
        }
    });
    app.post('/kyc_details/tataaig_verify_kyc_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            let kyc_verify_request = "";
            let kyc_verify_response = "";
            let full_name = proposal_request['middle_name'] === "" ? (proposal_request['first_name'] + " " + proposal_request['last_name']) : (proposal_request['first_name'] + " " + proposal_request['middle_name'] + " " + proposal_request['last_name']);
            let user_kyc_no = (ObjRequest.user_kyc_no === undefined || ObjRequest.user_kyc_no === "" || ObjRequest.user_kyc_no === null) ? "" : ObjRequest.user_kyc_no;
            let proposal_request = ObjRequest.Proposal_Request;
            let tokenservice_url = ((config.environment.name === 'Production') ? 'https://foyer-tataaig.auth.ap-south-1.amazoncognito.com/oauth2/token' : 'https://uatapigw-tataaig.auth.ap-south-1.amazoncognito.com/oauth2/token');
            let grant_type = ((config.environment.name === 'Production') ? 'client_credentials' : 'client_credentials');
            let scope = ((config.environment.name === 'Production') ? 'https://foyer.tataaig.com/write' : 'https://api.iorta.in/write');
            let client_id = ((config.environment.name === 'Production') ? '14rs1d1nbr70qu2rq3jlc9tu5m' : '5qdbqng8plqp1ko2sslu695n2g');
            let client_secret = ((config.environment.name === 'Production') ? '2usb6cl1os1cvplu507kbeasvjb0bl7193e08dojnosd2ouvmod' : 'gki6eqtltmjj37gpqq0dt52dt651o079dn6mls62ptkvsa2b45c');
            
            if (ObjRequest && ObjRequest.Product_Id && parseInt(ObjRequest.Product_Id) !== 10) {
                client_id = ((config.environment.name === 'Production') ? '54qqhf0pbk1jghrpajm8vjas8' : '5qdbqng8plqp1ko2sslu695n2g');
                client_secret = ((config.environment.name === 'Production') ? '1lg9d2a3lrns333hgs5mdnd8or6l1iesd02qtofb8r3vgnc53asn' : 'gki6eqtltmjj37gpqq0dt52dt651o079dn6mls62ptkvsa2b45c');
            }
            
            let token_args = {
                "grant_type": grant_type,
                "scope": scope,
                "client_id": client_id,
                "client_secret": client_secret
            };
            let kyc_token_args = {
                data: token_args,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            };
            function jsonToQueryString(json) {
                return  Object.keys(json).map(function (key) {
                    return encodeURIComponent(key) + '=' +
                            encodeURIComponent(json[key]);
                }).join('&');
            }
            kyc_token_args.data = jsonToQueryString(kyc_token_args.data);
            let product_name_obj = {1: "motor", 10: "motor", 12: "motor", 2: "", 4: "travel"};
            let product_name = product_name_obj[ObjRequest.Product_Id];
            let KYC_Status = "VERIFY_FAIL";
            let token = null;
            let Client = require('node-rest-client').Client;
            let client = new Client();
            let user_datas = {};
            let LM_Data = {
                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type,
                "KYC_Request": "",
                "KYC_Response": "",
                "ckyc_remarks": ""
            };
            client.post(tokenservice_url, kyc_token_args, function (token_data, response1) {
                if (token_data) {
                    if (token_data.hasOwnProperty("access_token") && token_data.access_token) {
                        token = token_data.access_token;
                        try {
                            if (token) {
//                                client.get(config.environment.weburl + '/user_datas/view/' + req.body.User_Data_Id, {}, function (db_user_data, response) {
//                                    if (db_user_data) {
//                                        user_datas = db_user_data[0];
//                                        let objProduct = {
//                                            "Quote_Id": user_datas['Processed_Request']['___insurer_customer_identifier___'],
//                                            "Modified_On": new Date()
//                                        };
//                                        kyc_detail.update({"PB_CRN": user_datas['PB_CRN'] - 0, "User_Data_Id": req.body.User_Data_Id}, {$set: objProduct}, function (err, objKyCDetails) {
//                                            if (err) {
//                                                res.json({"Insurer": "TATA_AIG", "Msg": 'KYC fetch services failed due to KYC Details not Updated. Please try again later.', "Status": "Fail"});
//                                            } else {
//                                                client.get(config.environment.weburl + '/kyc_details/get_kyc_status/' + user_datas['PB_CRN'] + '/' + ObjRequest.Insurer_Id, {}, function (db_kyc_details, response) {
//                                                    if (db_kyc_details) {
                                let verify_kyc_service_url = ((config.environment.name === 'Production') ? 'https://foyer.tataaig.com/ckyc/verify?product=' : 'https://uatapigw.tataaig.com/ckyc/verify?product=') + product_name;
                                let verify_args = {
                                    "customer_name": full_name.trim(),
                                    "id_type": (ObjRequest.Search_Type === undefined || ObjRequest.Search_Type === "" || ObjRequest.Search_Type === null) ? "" : ObjRequest.Search_Type,
                                    "id_num": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                                    "full_name": full_name.trim(),
                                    "dob": (ObjRequest.DOB === undefined || ObjRequest.DOB === "" || ObjRequest.DOB === null) ? "" : ObjRequest.DOB,
                                    "gender": (proposal_request.gender === undefined || proposal_request.gender === "" || proposal_request.gender === null) ? "" : proposal_request.gender,
                                    "req_id": user_kyc_no
                                };
                                if (ObjRequest.hasOwnProperty('Product_Id') && ObjRequest.Product_Id && ObjRequest.Product_Id === 10) {
                                    verify_args['quote_id'] = ObjRequest.Proposal_Id;
                                } else {
                                    verify_args['proposal_no'] = ObjRequest.Proposal_Id;
                                }
                                kyc_verify_request = verify_args;
                                LM_Data.KYC_Request = kyc_verify_request;
                                let kyc_verify_args = {
                                    data: verify_args,
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Authorization": token,
                                        "x-api-key": ((config.environment.name === 'Production') ? 'Xt4dW7poXZ9i7nI7xnTG21GuR7LtjlO27p1Tgflz' : 'g8hoqi8TBA2mBpxgMohdTcWxAfv6JsJ6wLztOWm4')
                                    }
                                };
                                
                                if (ObjRequest && ObjRequest.Product_Id && parseInt(ObjRequest.Product_Id) !== 10) {
                                    kyc_verify_args["headers"]["x-api-key"] = ((config.environment.name === 'Production') ? 'euo2LL5PEc8IvEGwjvAdO16r6MNskqpNQpKihMse' : 'g8hoqi8TBA2mBpxgMohdTcWxAfv6JsJ6wLztOWm4');
                                }
                                
                                let client1 = new Client();
                                client1.post(verify_kyc_service_url, kyc_verify_args, function (kyc_verify_data, response) {
                                    if (kyc_verify_data) {
                                        kyc_verify_response = kyc_verify_data;
                                        LM_Data.KYC_Response = kyc_verify_response;
                                        if (kyc_verify_data.hasOwnProperty("status") && kyc_verify_data.status === 400 && kyc_verify_data.hasOwnProperty("message_txt") && kyc_verify_data.message_txt) {
                                            LM_Data.KYC_Status = "VERIFY_FAIL";
                                            LM_Data.ckyc_remarks = "Insurer is not able to verify your KYC in given Pan Number, Kindly use another Insurer";
                                        } else if (kyc_verify_data.hasOwnProperty("status") && kyc_verify_data.status === 200 && kyc_verify_data.hasOwnProperty('data') && kyc_verify_data.data.hasOwnProperty('ckyc_number') && kyc_verify_data.data.ckyc_number) {
                                            user_kyc_no = kyc_verify_data.data.ckyc_number;
                                            LM_Data.KYC_Number = user_kyc_no;
                                            LM_Data.KYC_Status = "VERIFY_SUCCESS";
                                        } else {
                                            LM_Data.KYC_Status = "VERIFY_FAIL";
                                            LM_Data.ckyc_remarks = "Insurer is not able to verify your KYC in given Pan Number, Kindly use another Insurer";
                                        }
                                        saveKYCDetails(ObjRequest, LM_Data, kyc_verify_request, kyc_verify_response);
                                        res.json({"Insurer": "TATA_AIG", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                                    } else {
                                        res.json({"Insurer": "TATA_AIG", "Msg": "KYC verify services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                                    }
                                });
////                                                    } else {
////                                                        res.json({"Insurer": "TATA_AIG", "Msg": "KYC verify services failed due to no details available in KYC Details Database. Please try again later.", "Status": "FAIL"});
////                                                    }
////                                                });
////                                            }
////                                        });
//                                    } else {
//                                        res.json({"Insurer": "TATA_AIG", "Msg": "KYC verify services failed due to no details available in user data. Please try again later.", "Status": "FAIL"});
//                                    }
//                                });
                            } else {
                                res.json({"Insurer": "TATA_AIG", "Msg": "Could Not Generate Token. Please try again later.", "Status": "FAIL"});
                            }
                        } catch (e2) {
                            res.json({"Insurer": "TATA_AIG", "Msg": e2.stack, "Status": "FAIL"});
                        }
                    } else {
                        res.json({"Insurer": "TATA_AIG", "Msg": "KYC-Token generation services was not successful. Please try again later.", "Status": "FAIL"});
                    }
                } else {
                    res.json({"Insurer": "TATA_AIG", "Msg": "KYC-Token generation services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                }
            });
        } catch (e1) {
            res.json({"Insurer": "TATA_AIG", "Msg": e1.stack, "Status": "FAIL"});
        }
    });
    app.get('/kyc_details/tataaig_update_proposal_kyc/:udid', function (req, res) {
        try {
            var ObjRequest = req.body;
            let udid = req.params['udid'] - 0;
            let Client = require('node-rest-client').Client;
            let client = new Client();
            let LM_Data = {
                "KYC_Doc_No": "",
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": "",
                "KYC_PB_CRN": "",
                "KYC_Status": "KYC_UPDATE_FAIL",
                "KYC_Search_Type": "",
                "KYC_Request": "",
                "KYC_Response": "",
                "ckyc_remarks": ""
            };
            let kyc_update_request = "";
            let kyc_update_response = "";
            kyc_detail.findOne({'User_Data_Id': udid}).sort({Modified_On: -1}).exec(function (err, db_kyc_details) {
                if (db_kyc_details) {
                    let obj_Kyc_details = db_kyc_details._doc;
                    /*if (obj_Kyc_details.Product_Id && obj_Kyc_details.Product_Id === 10) {
                        let t = ((config.environment.name === 'Production') ? '76FA61783DDADCD9A738131EEE3DDE223122EFC4A867959369EBC40E99AC64BD93A197BBC43176B46B2D6F5ADC6E88209A2EB505032B219F65B9D27A3604A6E4D35E90FD5D7E56F94DDA36BDDDEACC8C8A5A4858894E99DC91D5BCA85D17D0CF3C15F0D4B8BABDA7313129E007BD492205E00A2DB09E9E22B5A7ED79375B4F799E0CC7751A730A4830801DCDFBE66B1E7FCC8D9B11F6F20E8407F25486BB41B26DC84593294CF78DBBD19F529B13614F' : '2D9D1BC5A837E7A2741C6121317E9EE6CE1D32145CBCF7084FA4493ECDA2C2804969A5473610BC2AB4FC034359C11D55F99F8AEC736D84F0EFD531DFE24FFC74F0923F1288A83121B8045A8AAA4D9F920B4D737E3A1134B824E23B1F0561D97AEA647554A31570720BDB6E4CE3D8813A1138ABF16F2A23A8E6BAB012DD07B768019A5B583351F6D36C1F6F26B5C8D474D2F701E664A96F73806EE3A5235DEFFD76CF4106F7F074A55258D75B1DDEFD38');
                        let product_code = ((config.environment.name === 'Production') ? '3121' : '3121');
                        const event = new Date();
                        let update_args = {
                            "T": t,
                            "product_code": product_code,
                            "proposal_no": obj_Kyc_details.Proposal_Id,
                            "p_ckyc_pan": obj_Kyc_details.Search_Type === "PAN" ? ((obj_Kyc_details.Document_ID === undefined || obj_Kyc_details.Document_ID === "" || obj_Kyc_details.Document_ID === null) ? "" : obj_Kyc_details.Document_ID) : "", //obj_Kyc_details.PAN,
                            "p_ckyc_no": obj_Kyc_details.KYC_Number,
                            "p_ckyc_id_type": obj_Kyc_details.Search_Type,
                            "p_ckyc_id_no": "",
                            "timestamp": event.toISOString(),
                            "kyc_status": "SUCCESS"
                        };
                        kyc_update_request = update_args;
                        let kyc_token_args = {
                            data: update_args,
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            }
                        };
                        function jsonToQueryString(json) {
                            return  Object.keys(json).map(function (key) {
                                return encodeURIComponent(key) + '=' +
                                        encodeURIComponent(json[key]);
                            }).join('&');
                        }
                        kyc_token_args.data = jsonToQueryString(kyc_token_args.data);
                        let update_kyc_detail = ((config.environment.name === 'Production') ? 'https://inode.tataaig.com/tagicinodems/ws/v1/ws/getws/kycdet' : 'https://pipuat.tataaiginsurance.in/tagichubms/ws/v1/ws/getws/kycdet');
                        client.post(update_kyc_detail, kyc_token_args, function (get_update_date, response12) {
                            kyc_update_response = get_update_date;
                            if (get_update_date && get_update_date.hasOwnProperty('status') && get_update_date['status'] === "1" && get_update_date.hasOwnProperty('errcode') && get_update_date['errcode'] === "KYC002") {
                                LM_Data['KYC_Status'] = "KYC_UPDATE_SUCCESS";
//                            res.json({"Insurer": "TATA_AIG", "Msg": get_update_date, "Status": "KYC_UPDATE_SUCCESS"});
                            } else {
                                LM_Data['KYC_Status'] = "KYC_UPDATE_FAIL";
//                            res.json({"Insurer": "TATA_AIG", "Msg": get_update_date, "Status": "KYC_UPDATE_FAIL"});
                            }
                            LM_Data.KYC_Search_Type = obj_Kyc_details.Search_Type;
                            LM_Data.KYC_PB_CRN = obj_Kyc_details.PB_CRN ? obj_Kyc_details.PB_CRN : "";
                            LM_Data.KYC_Insurer_ID = obj_Kyc_details.Insurer_Id;
                            LM_Data.KYC_Doc_No = (obj_Kyc_details.Search_Type === "PAN" || obj_Kyc_details.Search_Type === "Update") ? ((obj_Kyc_details.Document_ID === undefined || obj_Kyc_details.Document_ID === "" || obj_Kyc_details.Document_ID === null) ? ((obj_Kyc_details.Proposal_Request.pan === undefined || obj_Kyc_details.Proposal_Request.pan === "" || obj_Kyc_details.Proposal_Request.pan === null) ? "" : obj_Kyc_details.Proposal_Request.pan) : obj_Kyc_details.Document_ID) : "";
                            LM_Data.KYC_Number = obj_Kyc_details['KYC_Number'] ? obj_Kyc_details['KYC_Number'] : "";
                            LM_Data.KYC_FullName = obj_Kyc_details['KYC_FullName'] ? obj_Kyc_details['KYC_FullName'] : "";
                            LM_Data.KYC_Ref_No = obj_Kyc_details['KYC_Ref_No'] ? obj_Kyc_details['KYC_Ref_No'] : "";
                            LM_Data.KYC_Request = kyc_update_request;
                            LM_Data.KYC_Response = kyc_update_response;
                            saveKYCDetails(obj_Kyc_details, LM_Data, kyc_update_request, kyc_update_response);
                            let args = {
                                data: LM_Data,
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            };
                            let service_method_url = config.environment.weburl + "/postservicecall/kyc_details/kyc_mail_send";
                            try {
                                client.post(service_method_url, args, function (data, response) {
                                    console.error(data);
                                });
                            } catch (ex) {
                                console.error('Exception', 'kyc_mail_send', ex.stack);
                            }
                            res.json({"Insurer": "UPDATE_KYC", "Msg": get_update_date, "Status": LM_Data['KYC_Status']});
                        });
                    } else {*/
                        LM_Data['KYC_Status'] = "KYC_UPDATE_SUCCESS";
                        LM_Data.KYC_Search_Type = obj_Kyc_details.Search_Type;
                        LM_Data.KYC_PB_CRN = obj_Kyc_details.PB_CRN ? obj_Kyc_details.PB_CRN : "";
                        LM_Data.KYC_Insurer_ID = obj_Kyc_details.Insurer_Id;
                        LM_Data.KYC_Doc_No = (obj_Kyc_details.Search_Type === "PAN" || obj_Kyc_details.Search_Type === "Update") ? ((obj_Kyc_details.Document_ID === undefined || obj_Kyc_details.Document_ID === "" || obj_Kyc_details.Document_ID === null) ? ((obj_Kyc_details.Proposal_Request.pan === undefined || obj_Kyc_details.Proposal_Request.pan === "" || obj_Kyc_details.Proposal_Request.pan === null) ? "" : obj_Kyc_details.Proposal_Request.pan) : obj_Kyc_details.Document_ID) : "";
                        LM_Data.KYC_Number = obj_Kyc_details['KYC_Number'] ? obj_Kyc_details['KYC_Number'] : "";
                        LM_Data.KYC_FullName = obj_Kyc_details['KYC_FullName'] ? obj_Kyc_details['KYC_FullName'] : "";
                        LM_Data.KYC_Ref_No = obj_Kyc_details['KYC_Ref_No'] ? obj_Kyc_details['KYC_Ref_No'] : "";
                        LM_Data.KYC_Request = kyc_update_request;
                        LM_Data.KYC_Response = kyc_update_response;
                        saveKYCDetails(obj_Kyc_details, LM_Data, kyc_update_request, kyc_update_response);
                        let args = {
                            data: LM_Data,
                            headers: {
                                "Content-Type": "application/json"
                            }
                        };
                        let service_method_url = config.environment.weburl + "/postservicecall/kyc_details/kyc_mail_send";
                        try {
                            client.post(service_method_url, args, function (data, response) {
                                console.error(data);
                            });
                        } catch (ex) {
                            console.error('Exception', 'kyc_mail_send', ex.stack);
                        }
                        res.json({"Insurer": "UPDATE_KYC", "Msg": {}, "Status": LM_Data['KYC_Status']});
//                    }
                } else {
                    res.json({"Insurer": "UPDATE_KYC", "Msg": "tataaig_update_proposal_kyc services failed due to no kyc details found. Please try again later.", "Status": "FAIL"});
                }
            });
        } catch (e) {
            res.json({"Insurer": "UPDATE_KYC", "Msg": "tataaig_update_proposal_kyc services failed due to Exception. Please try again later.", "Status": "FAIL"});
        }
    });
    app.post('/kyc_details/iffco_create_kyc_details', function (req, res)  {
        try {
            let ObjRequest = req.body;
            let proposal_request = ObjRequest.hasOwnProperty('Proposal_Request') && ObjRequest.Proposal_Request ? ObjRequest.Proposal_Request : {};
            let aadhar_file;
            let pan_file;
            let pan_file_extension = ObjRequest.Doc1_Name.split('.')[ObjRequest.Doc1_Name.split('.').length - 1];
            let aadhar_file_extension = ObjRequest.Doc2_Name.split('.')[ObjRequest.Doc2_Name.split('.').length - 1];
            if (ObjRequest.Doc1 !== undefined && ObjRequest.Doc1 !== "" && ObjRequest.Doc1 !== null && ObjRequest.Doc2 !== undefined && ObjRequest.Doc2 !== "" && ObjRequest.Doc2 !== null) {
                aadhar_file = fs.readFileSync(appRoot + ObjRequest.Doc2);
                pan_file = fs.readFileSync(appRoot + ObjRequest.Doc1);
                let req_txt = {
                    "prefix": (proposal_request.salutation === undefined || proposal_request.salutation === "" || proposal_request.salutation === null) ? "" : proposal_request.salutation,
                    "firstName": (proposal_request.first_name === undefined || proposal_request.first_name === "" || proposal_request.first_name === null) ? "" : proposal_request.first_name.trim(),
                    "middleName": (proposal_request.middle_name === undefined || proposal_request.middle_name === "" || proposal_request.middle_name === null) ? "" : proposal_request.middle_name.trim(),
                    "lastName": (proposal_request.last_name === undefined || proposal_request.last_name === "" || proposal_request.last_name === null) ? "" : proposal_request.last_name.trim(),
                    "gender": (proposal_request.gender === undefined || proposal_request.gender === "" || proposal_request.gender === null) ? "" : proposal_request.gender,
                    "dateofBirth": (proposal_request.birth_date === undefined || proposal_request.birth_date === "" || proposal_request.birth_date === null) ? "" : moment(proposal_request.birth_date, 'DD/MM/YYYY').format('DD-MM-YYYY'),
                    "relatedPersonPrefix": "Mr",
                    "relatedPersonFirstName": (proposal_request.nominee_name === undefined || proposal_request.nominee_name === "" || proposal_request.nominee_name === null) ? "" : proposal_request.nominee_name.includes(" ") ? proposal_request.nominee_name.split(' ')[0] : proposal_request.nominee_name,
                    "relatedPersonMiddleName": (proposal_request.nominee_name === undefined || proposal_request.nominee_name === "" || proposal_request.nominee_name === null) ? "" : (proposal_request.nominee_name.includes(" ") ? (proposal_request.nominee_name.split(' ').length > 2 ? proposal_request.nominee_name.split(' ')[1] : "") : ""),
                    "relatedPersonLastName": (proposal_request.nominee_name === undefined || proposal_request.nominee_name === "" || proposal_request.nominee_name === null) ? "" : proposal_request.nominee_name.includes(" ") ? (proposal_request.nominee_name.split(' ').length > 2 ? proposal_request.nominee_name.split(' ')[2] : (proposal_request.nominee_name.split(' ').length > 1 ? proposal_request.nominee_name.split(' ')[1] : "")) : "",
                    "relationshipType": (proposal_request.nominee_relation_text === undefined || proposal_request.nominee_relation_text === "" || proposal_request.nominee_relation_text === null) ? "" : proposal_request.nominee_relation_text,
                    "mobileNumber": (proposal_request.mobile === undefined || proposal_request.mobile === "" || proposal_request.mobile === null) ? "" : proposal_request.mobile,
                    "emailAddress": (proposal_request.email === undefined || proposal_request.email === "" || proposal_request.email === null) ? "" : proposal_request.email,
                    //"minor": moment().diff(moment(proposal_request.dob, 'DD/MM/YYYY'), 'years') >= 18 ? "Y" : "N",
                    "addressLine1": (proposal_request.permanent_address_1 === undefined || proposal_request.permanent_address_1 === "" || proposal_request.permanent_address_1 === null) ? "" : proposal_request.permanent_address_1,
                    "city": (proposal_request.permanent_city === undefined || proposal_request.permanent_city === "" || proposal_request.permanent_city === null) ? "" : proposal_request.permanent_city,
                    "district": (proposal_request.permanent_city === undefined || proposal_request.permanent_city === "" || proposal_request.permanent_city === null) ? "" : proposal_request.permanent_city,
                    "state": (proposal_request.permanent_state === undefined || proposal_request.permanent_state === "" || proposal_request.permanent_state === null) ? "" : proposal_request.permanent_state,
                    "country": "India",
                    "pinCode": (proposal_request.permanent_pincode === undefined || proposal_request.permanent_pincode === "" || proposal_request.permanent_pincode === null) ? "" : proposal_request.permanent_pincode,
                    "correspondenceAddressLine1": (proposal_request.communication_address_1 === undefined || proposal_request.communication_address_1 === "" || proposal_request.communication_address_1 === null) ? "" : proposal_request.communication_address_1,
                    "correspondenceCity": (proposal_request.communication_city === undefined || proposal_request.communication_city === "" || proposal_request.communication_city === null) ? "" : proposal_request.communication_city,
                    "correspondenceDistrict": (proposal_request.communication_city === undefined || proposal_request.communication_city === "" || proposal_request.communication_city === null) ? "" : proposal_request.communication_city,
                    "correspondenceState": (proposal_request.communication_state === undefined || proposal_request.communication_state === "" || proposal_request.communication_state === null) ? "" : proposal_request.communication_state,
                    "correspondenceCountry": "India",
                    "correspondencePinCode": (proposal_request.communication_pincode === undefined || proposal_request.communication_pincode === "" || proposal_request.communication_pincode === null) ? "" : proposal_request.communication_pincode,
                    "kycDocuments": [
                        {
                            "idType": "IDENTITY_PROOF",
                            "idName": "PAN",
                            "idNumber": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : (ObjRequest.Document_ID.includes('_') ? ObjRequest.Document_ID.split('_')[0] : ObjRequest.Document_ID), //(proposal_request.pan === undefined || proposal_request.pan === "" || proposal_request.pan === null) ? "" : proposal_request.pan,
                            "fileName": (ObjRequest.Doc1_Name === undefined || ObjRequest.Doc1_Name === "" || ObjRequest.Doc1_Name === null) ? "" : ObjRequest.Doc1_Name,
                            "fileExtension": pan_file_extension, //(ObjRequest.PAN_Doc_Extension === undefined || ObjRequest.PAN_Doc_Extension === "" || ObjRequest.PAN_Doc_Extension === null) ? "" : ObjRequest.PAN_Doc_Extension.toLowerCase(),
                            "fileBase64": pan_file.toString('base64')//(ObjRequest.PAN_Doc === undefined || ObjRequest.PAN_Doc === "" || ObjRequest.PAN_Doc === null) ? "" : ObjRequest.PAN_Doc
                        },
                        {
                            "idType": "ADDRESS_PROOF",
                            "idName": "AADHAR CARD NUMBER",
                            "idNumber": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : (ObjRequest.Document_ID.includes('_') ? ObjRequest.Document_ID.split('_')[1] : ObjRequest.Document_ID), //(ObjRequest.Aadhar === undefined || ObjRequest.Aadhar === "" || ObjRequest.Aadhar === null) ? "" : typeof (ObjRequest.Aadhar) === 'number' ? JSON.stringify(ObjRequest.Aadhar) : ObjRequest.Aadhar,
                            "fileName": (ObjRequest.Doc2_Name === undefined || ObjRequest.Doc2_Name === "" || ObjRequest.Doc2_Name === null) ? "" : ObjRequest.Doc2_Name, //(ObjRequest.Aadhar_Doc_FileName === undefined || ObjRequest.Aadhar_Doc_FileName === "" || ObjRequest.Aadhar_Doc_FileName === null) ? "" : ObjRequest.Aadhar_Doc_FileName,
                            "fileExtension": aadhar_file_extension, //(ObjRequest.Aadhar_Doc_Extension === undefined || ObjRequest.Aadhar_Doc_Extension === "" || ObjRequest.Aadhar_Doc_Extension === null) ? "" : ObjRequest.Aadhar_Doc_Extension.toLowerCase(),
                            "fileBase64": aadhar_file.toString('base64') //(ObjRequest.Aadhar_Doc === undefined || ObjRequest.Aadhar_Doc === "" || ObjRequest.Aadhar_Doc === null) ? "" : ObjRequest.Aadhar_Doc
                        }
                    ]
                };
                let username = (config.environment.name === 'Production') ? "ITGIMOT021" : "ITGIMOT001";
                let password = (config.environment.name === 'Production') ? "I0TTOGI2M1" : "partner@2020";
                let auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
                let args = {
                    data: JSON.stringify(req_txt),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        'Authorization': auth
                    }
                };
                kyc_create_request = req_txt;
                let upload_req_txt = {
                    "firstName": (proposal_request.first_name === undefined || proposal_request.first_name === "" || proposal_request.first_name === null) ? "" : proposal_request.first_name.trim(),
                    "lastName": (proposal_request.last_name === undefined || proposal_request.last_name === "" || proposal_request.last_name === null) ? "" : proposal_request.last_name.trim(),
                    "dateofBirth": (proposal_request.birth_date === undefined || proposal_request.birth_date === "" || proposal_request.birth_date === null) ? "" : proposal_request.birth_date,
                    "kycDocuments": [
                        {
                            "idType": "IDENTITY_PROOF",
                            "idName": "PAN",
                            "idNumber": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : (ObjRequest.Document_ID.includes('_') ? ObjRequest.Document_ID.split('_')[0] : ObjRequest.Document_ID),
                            "fileName": (ObjRequest.Doc1_Name === undefined || ObjRequest.Doc1_Name === "" || ObjRequest.Doc1_Name === null) ? "" : ObjRequest.Doc1_Name,
                            "fileExtension": pan_file_extension,
                            "fileBase64": pan_file.toString('base64')
                        },
                        {
                            "idType": "ADDRESS_PROOF",
                            "idName": "AADHAR CARD NUMBER",
                            "idNumber": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : (ObjRequest.Document_ID.includes('_') ? ObjRequest.Document_ID.split('_')[1] : ObjRequest.Document_ID),
                            "fileName": (ObjRequest.Doc2_Name === undefined || ObjRequest.Doc2_Name === "" || ObjRequest.Doc2_Name === null) ? "" : ObjRequest.Doc2_Name,
                            "fileExtension": aadhar_file_extension,
                            "fileBase64": aadhar_file.toString('base64')
                        }
                    ]
                };
                kyc_upload_request = upload_req_txt;
                let KYC_Status = "PENDING";
                let kyc_id = 0;
                var Client = require('node-rest-client').Client;
                var client = new Client();
                var call_upload = false;
                let LM_Data = {
                    "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                    "KYC_Number": "",
                    "KYC_FullName": "",
                    "KYC_Ref_No": "",
                    "KYC_Redirect_URL": "",
                    "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                    "KYC_PB_CRN": ObjRequest.PB_CRN,
                    "KYC_Status": KYC_Status,
                    "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type, //"PAN",
                    "KYC_Request": kyc_create_request,
                    "KYC_Response": "",
                    "ckyc_remarks": ""
                };
                let iffco_create_kyc_service_url = ((config.environment.name === 'Production') ? 'https://www.online.iffcotokio.co.in/partner-services/kyc/create' : 'https://staging.iffcotokio.co.in/partner-services/kyc/create');
                client.post(iffco_create_kyc_service_url, args, function (data, response) {
                    try {
                        kyc_create_response = data;
                        if (data.hasOwnProperty("status") && data.status == 200 && data.hasOwnProperty("result")) {
                            if (data.result.hasOwnProperty("status") && (data.result.status === 'SUCCESS' || data.result.status === 'EXISTING RECORD') && data.result.hasOwnProperty("itgiUniqueReferenceId") && data.result.itgiUniqueReferenceId) {
                                kyc_id = data.result.itgiUniqueReferenceId;
                                LM_Data.KYC_Status = "CREATE_SUCCESS";
                                LM_Data.KYC_Number = kyc_id;
                                LM_Data.KYC_Ref_No = data.result.itgiUniqueReferenceId;
                            } else {
                                call_upload = true;
                                kyc_id = data.result.itgiUniqueReferenceId;
                                LM_Data.KYC_Status = "CREATE_FAIL";
                                LM_Data.KYC_Number = kyc_id;
                                upload_req_txt.itgiUniqueReferenceId = data.result.itgiUniqueReferenceId;
                                let upload_args = {
                                    data: JSON.stringify(upload_req_txt),
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Accept": "application/json"
                                    }
                                };
                                let iffco_upload_kyc_service_url = ((config.environment.name === 'Production') ? 'https://www.online.iffcotokio.co.in/partner-services/kyc/upload' : 'https://staging.iffcotokio.co.in/partner-services/kyc/upload');
                                client.post(iffco_upload_kyc_service_url, upload_args, function (data, response) {
                                    console.log('iffco_fetch_kyc_details upload doc api data - ' + data);
                                    if (data.hasOwnProperty("status") && data.status === 200 && data.hasOwnProperty("result") && data.result.hasOwnProperty('apiStatus') && data.result.apiStatus === "SUCCESS") {
                                        res.json({"Insurer": "IFFCO", "Msg": LM_Data, "Status": KYC_Status});
                                    } else {
                                        res.json({"Insurer": "IFFCO", "Msg": LM_Data, "Status": KYC_Status});
                                    }
                                });
                            }
                        } else if (data && data.hasOwnProperty("status") && data.status !== 200 && data.hasOwnProperty("errors")) {
                            kyc_id = data.result.itgiUniqueReferenceId;
                            LM_Data.KYC_Status = "CREATE_FAIL";
                            LM_Data.KYC_Number = kyc_id;
                        } else {
                            LM_Data.KYC_Status = "CREATE_FAIL";
                        }
                        LM_Data.KYC_Response = kyc_create_response;
                        saveKYCDetails(ObjRequest, LM_Data, kyc_create_request, kyc_create_response);
                        if (!call_upload) {
                            res.json({"Insurer": "IFFCO", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                        }
                    } catch (err) {
                        res.json({"Insurer": "IFFCO", "Msg": err.stack, "Status": "FAIL"});
                    }
                });
            } else {
                res.json({"Insurer": "IFFCO", "Msg": 'Document Not Available', "Status": "FAIL"});
            }
        } catch (e1) {
            res.json({"Insurer": "IFFCO", "Msg": e1.stack, "Status": "FAIL"});
        }
    });

    app.post('/kyc_details/iffco_fetch_kyc_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            let kyc_fetch_request = "";
            let kyc_fetch_response = "";
            let vehicle_registration_type = (ObjRequest.Proposal_Request.vehicle_registration_type === undefined || ObjRequest.Proposal_Request.vehicle_registration_type === "" || ObjRequest.Proposal_Request.vehicle_registration_type === null) ? "" : ObjRequest.Proposal_Request.vehicle_registration_type;
            vehicle_registration_type = (vehicle_registration_type === "") ? "I" : (vehicle_registration_type.toLowerCase() === "corporate" ? "C" : "I");
//            vehicle_registration_type = "I";
            var user_kyc_no = (req.body.user_kyc_no === undefined || req.body.user_kyc_no === "" || req.body.user_kyc_no === null) ? "" : req.body.user_kyc_no;
            let req_txt = {
                "firstName": (ObjRequest.Proposal_Request.first_name === undefined || ObjRequest.Proposal_Request.first_name === "" || ObjRequest.Proposal_Request.first_name === null) ? "" : ObjRequest.Proposal_Request.first_name.trim(),
                "lastName": (ObjRequest.Proposal_Request.last_name === undefined || ObjRequest.Proposal_Request.last_name === "" || ObjRequest.Proposal_Request.last_name === null) ? "" : ObjRequest.Proposal_Request.last_name.trim(),
                "dateofBirth": (ObjRequest.Proposal_Request.birth_date === undefined || ObjRequest.Proposal_Request.birth_date === "" || ObjRequest.Proposal_Request.birth_date === null || ObjRequest.Proposal_Request.birth_date === "Invalid Date") ? "" : moment(ObjRequest.Proposal_Request.birth_date, 'DD/MM/YYYY').format('DD-MM-YYYY'),
                "gender": (ObjRequest.Proposal_Request.gender === undefined || ObjRequest.Proposal_Request.gender === "" || ObjRequest.Proposal_Request.gender === null) ? "" : ObjRequest.Proposal_Request.gender,
                "idNumber": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID
//                "idType": ObjRequest.Document_Type
            };
            if (ObjRequest.hasOwnProperty('Search_Type') && ObjRequest.Search_Type && ObjRequest.Search_Type === "PAN") {
                req_txt['idType'] = 'PAN';
            } else if (ObjRequest.hasOwnProperty('Search_Type') && ObjRequest.Search_Type && ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "AADHAR") {
                req_txt['idType'] = 'AADHAR CARD NUMBER';
            } else if (ObjRequest.hasOwnProperty('Search_Type') && ObjRequest.Search_Type && ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "PASSPORT") {
                req_txt['idType'] = 'PASSPORT';
            } else if (ObjRequest.hasOwnProperty('Search_Type') && ObjRequest.Search_Type && ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "VOTERID") {
                req_txt['idType'] = 'VOTER ID';
            } else if (ObjRequest.hasOwnProperty('Search_Type') && ObjRequest.Search_Type && ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "DRIVINGLICENSE") {
                req_txt['idType'] = 'DRIVING LICENSE';
            }
            let username = (config.environment.name === 'Production') ? "ITGIMOT021" : "ITGIMOT001";
            let password = (config.environment.name === 'Production') ? "I0TTOGI2M1" : "partner@2020";
            let auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
            let args = {
                data: JSON.stringify(req_txt),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    'Authorization': auth
                }
            };
            kyc_fetch_request = req_txt;
            let KYC_Status = "PENDING";
            let kyc_id = 0;
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let LM_Data = {
                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type, //"PAN",
                "KYC_Request": kyc_fetch_request,
                "KYC_Response": "",
                "ckyc_remarks": ""
            };
            let iffco_fetch_kyc_service_url = ((config.environment.name === 'Production') ? 'https://www.online.iffcotokio.co.in/partner-services/kyc/fetch' : 'https://staging.iffcotokio.co.in/partner-services/kyc/fetch');
            client.post(iffco_fetch_kyc_service_url, args, function (data, response) {
                if (data) {
                    kyc_fetch_response = data;
                    LM_Data.KYC_Response = kyc_fetch_response;
                    if (data.hasOwnProperty("status") && data.status == 200 && data.hasOwnProperty("result") && data.result.hasOwnProperty("itgiUniqueReferenceId") && data.result.itgiUniqueReferenceId) {
                        LM_Data.KYC_Status = "FETCH_SUCCESS";
                        kyc_id = data.result.itgiUniqueReferenceId;
                        LM_Data.KYC_Number = kyc_id;
                        LM_Data.KYC_Ref_No = kyc_id;
                        LM_Data.KYC_FullName = ((data.result.hasOwnProperty("firstName") ? data.result.firstName : '').trim() + ' ' + (data.result.hasOwnProperty("middleName") ? data.result.middleName : '').trim()).trim() + ' ' + (data.result.hasOwnProperty("lastName") ? data.result.lastName : '').trim();
                        LM_Data.KYC_FullName = (LM_Data.KYC_FullName).trim();
                    } else {
                        LM_Data.KYC_Status = "FETCH_FAIL";
                    }
                    saveKYCDetails(ObjRequest, LM_Data, kyc_fetch_request, kyc_fetch_response);
                    res.json({"Insurer": "IFFCO", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                } else {
                    res.json({"Insurer": "IFFCO", "Msg": "KYC verify services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                }
            });
        } catch (e1) {
            res.json({"Insurer": "IFFCO", "Msg": e1.stack, "Status": "FAIL"});
        }
    });

    app.post('/kyc_details/iffco_verify_kyc_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            let kyc_verify_request = "";
            let kyc_verify_response = "";
            let vehicle_registration_type = (ObjRequest.Proposal_Request.vehicle_registration_type === undefined || ObjRequest.Proposal_Request.vehicle_registration_type === "" || ObjRequest.Proposal_Request.vehicle_registration_type === null) ? "" : ObjRequest.Proposal_Request.vehicle_registration_type;
            vehicle_registration_type = (vehicle_registration_type === "") ? "I" : (vehicle_registration_type === "corporate" ? "C" : "I");
//            vehicle_registration_type = "I";
            var user_kyc_no = (ObjRequest.user_kyc_no === undefined || ObjRequest.user_kyc_no === "" || ObjRequest.user_kyc_no === null) ? "" : ObjRequest.user_kyc_no;
            let req_txt = {
                "firstName": (ObjRequest.Proposal_Request.first_name === undefined || ObjRequest.Proposal_Request.first_name === "" || ObjRequest.Proposal_Request.first_name === null) ? "" : ObjRequest.Proposal_Request.first_name.trim(),
                "lastName": (ObjRequest.Proposal_Request.last_name === undefined || ObjRequest.Proposal_Request.last_name === "" || ObjRequest.Proposal_Request.last_name === null) ? "" : ObjRequest.Proposal_Request.last_name.trim(),
                "dateofBirth": (ObjRequest.Proposal_Request.birth_date === undefined || ObjRequest.Proposal_Request.birth_date === "" || ObjRequest.Proposal_Request.birth_date === null || ObjRequest.Proposal_Request.birth_date === "Invalid Date") ? "" : moment(ObjRequest.Proposal_Request.birth_date, 'DD/MM/YYYY').format('DD-MM-YYYY'),
                "gender": (ObjRequest.Proposal_Request.gender === undefined || ObjRequest.Proposal_Request.gender === "" || ObjRequest.Proposal_Request.gender === null) ? "" : ObjRequest.Proposal_Request.gender,
                "idType": 'ITGI UNIQUE IDENTIFIER',
                "idNumber" : user_kyc_no
            };
            let username = (config.environment.name === 'Production') ? "ITGIMOT021" : "ITGIMOT001";
            let password = (config.environment.name === 'Production') ? "I0TTOGI2M1" : "partner@2020";
            let auth = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');
            let args = {
                data: JSON.stringify(req_txt),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    'Authorization': auth
                }
            };
            kyc_verify_request = req_txt;
            let KYC_Status = "VERIFY_FAIL";
            let kyc_id = 0;
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let LM_Data = {
                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": "PAN",
                "KYC_Request": kyc_verify_request,
                "KYC_Response": "",
                "ckyc_remarks": ""
            };
            let iffco_fetch_kyc_service_url = ((config.environment.name === 'Production') ? 'https://www.online.iffcotokio.co.in/partner-services/kyc/fetch' : 'https://staging.iffcotokio.co.in/partner-services/kyc/fetch');
            client.post(iffco_fetch_kyc_service_url, args, function (data, response) {
                if (data) {
                    kyc_verify_response = data;
                    LM_Data.KYC_Response = kyc_verify_response;
                    if (data.hasOwnProperty("status") && data.status == 200 && data.hasOwnProperty("result") && data.result.hasOwnProperty("itgiUniqueReferenceId") && data.result.itgiUniqueReferenceId) {
                        LM_Data.KYC_Status = "VERIFY_SUCCESS";
                        kyc_id = data.result.itgiUniqueReferenceId;
                        LM_Data.KYC_Number = data.result.itgiUniqueReferenceId;
                        LM_Data.KYC_Ref_No = data.result.itgiUniqueReferenceId;
                        LM_Data.KYC_FullName = ((data.result.hasOwnProperty("firstName") ? data.result.firstName : '').trim() + ' ' + (data.result.hasOwnProperty("middleName") ? data.result.middleName : '').trim()).trim() + ' ' + (data.result.hasOwnProperty("lastName") ? data.result.lastName : '').trim();
                        LM_Data.KYC_FullName = (LM_Data.KYC_FullName).trim();
                    } else {
                        LM_Data.KYC_Status = "VERIFY_FAIL";
                    }
                    saveKYCDetails(ObjRequest, LM_Data, kyc_verify_request, kyc_verify_response);
                    res.json({"Insurer": "IFFCO", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                } else {
                    res.json({"Insurer": "IFFCO", "Msg": "KYC verify services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                }
            });
        } catch (e1) {
            res.json({"Insurer": "IFFCO", "Msg": e1.stack, "Status": "FAIL"});
        }
    });
    app.post('/kyc_details/chola_fetch_kyc_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            let proposal_request = ObjRequest.Proposal_Request;
            let kyc_fetch_request = "";
            let kyc_fetch_response = "";
            let vehicle_registration_type = (ObjRequest.Proposal_Request.vehicle_registration_type === undefined || ObjRequest.Proposal_Request.vehicle_registration_type === "" || ObjRequest.Proposal_Request.vehicle_registration_type === null) ? "" : ObjRequest.Proposal_Request.vehicle_registration_type;
            vehicle_registration_type = (vehicle_registration_type === "") ? "I" : (vehicle_registration_type.toLowerCase() === "corporate" ? "C" : "I");
            let chola_token_service = (config.environment.name === "Production") ? "https://bapps.cholainsurance.com/ckycapi/api/KYC/CholaMS_CKYC_Auth" : "https://uatportal.cholainsurance.com/Epolicyv3API/api/KYC/CholaMS_CKYC_Auth";
            let chola_verify_service = (config.environment.name === "Production") ? "https://bapps.cholainsurance.com/ckycapi/api/KYC/CholaMS_CKYC_Verify" : "https://uatportal.cholainsurance.com/Epolicyv3API/api/KYC/CholaMS_CKYC_Verify";
//            vehicle_registration_type = "I";
            var user_kyc_no = (ObjRequest.KYC_Number === undefined || ObjRequest.KYC_Number === "" || ObjRequest.KYC_Number === null) ? "" : ObjRequest.KYC_Number;
            var cust_name = null;
            if (ObjRequest.Proposal_Request.middle_name === undefined || ObjRequest.Proposal_Request.middle_name === "" || ObjRequest.Proposal_Request.middle_name === null) {
                cust_name = ((ObjRequest.Proposal_Request.first_name === undefined || ObjRequest.Proposal_Request.first_name === "" || ObjRequest.Proposal_Request.first_name === null) ? "" : ObjRequest.Proposal_Request.first_name) + " " +
                        ((ObjRequest.Proposal_Request.last_name === undefined || ObjRequest.Proposal_Request.last_name === "" || ObjRequest.Proposal_Request.last_name === null) ? "" : ObjRequest.Proposal_Request.last_name);
            } else {
                cust_name = ((ObjRequest.Proposal_Request.first_name === undefined || ObjRequest.Proposal_Request.first_name === "" || ObjRequest.Proposal_Request.first_name === null) ? "" : ObjRequest.Proposal_Request.first_name) + " " +
                        ((ObjRequest.Proposal_Request.middle_name === undefined || ObjRequest.Proposal_Request.middle_name === "" || ObjRequest.Proposal_Request.middle_name === null) ? "" : ObjRequest.Proposal_Request.middle_name) + " " +
                        ((ObjRequest.Proposal_Request.last_name === undefined || ObjRequest.Proposal_Request.last_name === "" || ObjRequest.Proposal_Request.last_name === null) ? "" : ObjRequest.Proposal_Request.last_name);
            }
            let req_txt = {
                "Verify_Type": "VERIFY_DEMOGRAPHY", //VERIFY or VERIFY_DEMOGRAPHY
                "App_Ref_No": ObjRequest.PB_CRN,
                "Customer_Type": vehicle_registration_type,
                "Customer_Name": cust_name.trim(),
                "Gender": (ObjRequest.Proposal_Request.gender === undefined || ObjRequest.Proposal_Request.gender === "" || ObjRequest.Proposal_Request.gender === null) ? "" : ObjRequest.Proposal_Request.gender,
                "DOB_DOI": (vehicle_registration_type === "I" && proposal_request.birth_date && proposal_request.birth_date !== "") ? proposal_request.birth_date : (vehicle_registration_type === "C" && ObjRequest.date_of_incorporation && ObjRequest.date_of_incorporation !== "") ? ObjRequest.date_of_incorporation : "",
                "Mobile_No": (ObjRequest.Proposal_Request.mobile === undefined || ObjRequest.Proposal_Request.mobile === "" || ObjRequest.Proposal_Request.mobile === null) ? "" : ObjRequest.Proposal_Request.mobile,
                "CKYC_No": user_kyc_no,
                "PAN_No": ObjRequest.Search_Type === "PAN" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID) : "",//(proposal_request.pan === undefined || proposal_request.pan === "" || proposal_request.pan === null) ? "" : proposal_request.pan,
                "Aadhar_No":  ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "AADHAR" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID): "",//(proposal_request.aadhar === undefined || proposal_request.aadhar === "" || proposal_request.aadhar === null) ? "" : proposal_request.aadhar,
                "DL_No": ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "DRIVINGLICENSE" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID) : "",
                "Voter_ID": ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "VOTERID" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID) : "",
                "Passport_no": ObjRequest.Search_Type.toUpperCase() === "PASSPORT" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID) : "",
                "CIN": ""
            };
            let args = {
                data: JSON.stringify(req_txt),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "TokenKey": ""
                }
            };
            let args1 = {
                data: {
                    "PrivateKey": (config.environment.name === "Production") ? "UEJMTUBDS1lD" : "VjRfU09CIUBDS1lDVWF0",
                    "UserID": (config.environment.name === "Production") ? "PBLM" : ""
                },
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*"
                }
            };
            kyc_fetch_request = req_txt;
            let KYC_Status = "PENDING";
            let kyc_id = 0;
            let token = null;
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let LM_Data = {
                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type,//"PAN",
                "KYC_Request": kyc_fetch_request,
                "KYC_Response": "",
                "ckyc_remarks": ""
            };
            client.post(chola_token_service, args1, function (data1, response1) {
                if (data1) {
                    if (data1.hasOwnProperty("TokenKey") && data1.TokenKey && data1.TokenKey !== "" && data1.ErrorMSG === 'Success') {
                        token = data1.TokenKey;
                        try {
                            if (token) {
                                args.headers.TokenKey = token;
                                var client1 = new Client();
                                client1.post(chola_verify_service, args, function (data, response) {
                                    if (data) {
                                        kyc_fetch_response = data;
                                        LM_Data.KYC_Response = kyc_fetch_response;
                                        if (data.hasOwnProperty("Status") && data.Status === 'Success') {
                                            if (data.hasOwnProperty("CKYC_No") && data.CKYC_No && data.CKYC_No !== "") {
                                                LM_Data['KYC_Number'] = data['CKYC_No'];
                                                LM_Data['KYC_Status'] = "FETCH_SUCCESS";
                                                LM_Data['KYC_FullName'] = data['CKYC_Verified_Cust_Name'] ? data['CKYC_Verified_Cust_Name'] : "";
                                                LM_Data['KYC_Ref_No'] = data.Transaction_ID;
                                                LM_Data['ckyc_remarks'] = "NA";
                                            } else {
                                                LM_Data['KYC_Status'] = "FETCH_FAIL";
                                                LM_Data['KYC_Number'] = data.Transaction_ID ? data.Transaction_ID : "";
                                                LM_Data['KYC_Ref_No'] = data.Transaction_ID ? data.Transaction_ID : "";
                                                LM_Data['KYC_Redirect_URL'] = data.eKYC_Redirection_URL ? data.eKYC_Redirection_URL : ObjRequest.KYC_URL;
                                                //LM_Data['ckyc_remarks'] = data.hasOwnProperty('ErrorMsg') ? data.ErrorMsg : data;
                                            }
                                        } else {
                                            LM_Data['KYC_Status'] = "FETCH_FAIL";
                                            LM_Data['KYC_Number'] = data.Transaction_ID ? data.Transaction_ID : "";
                                            LM_Data['KYC_Ref_No'] = data.Transaction_ID ? data.Transaction_ID : "";
                                            LM_Data['KYC_Redirect_URL'] = data.eKYC_Redirection_URL ? data.eKYC_Redirection_URL : ObjRequest.KYC_URL;
                                            //LM_Data['ckyc_remarks'] = data.hasOwnProperty('ErrorMsg') ? data.ErrorMsg : data;
                                        }
                                        saveKYCDetails(ObjRequest, LM_Data, kyc_fetch_request, kyc_fetch_response);
                                        res.json({"Insurer": "CholaMS", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                                    } else {
                                        res.json({"Insurer": "CholaMS", "Msg": "KYC verify services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                                    }
                                });
                            } else {
                                res.json({"Insurer": "CholaMS", "Msg": "Could Not Generate Token. Please try again later.", "Status": "FAIL"});
                            }
                        } catch (e2) {
                            res.json({"Insurer": "CholaMS", "Msg": e2.stack, "Status": "FAIL"});
                        }
                    } else {
                        res.json({"Insurer": "CholaMS", "Msg": "KYC-Token not generated. Please try again later.", "Status": "FAIL"});
                    }
                } else {
                    res.json({"Insurer": "CholaMS", "Msg": "KYC-Token generation services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                }
            });
        } catch (e1) {
            res.json({"Insurer": "CholaMS", "Msg": e1.stack, "Status": "FAIL"});
        }
    });
	
    app.post('/kyc_details/chola_verify_kyc_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            let kyc_verify_request = "";
            let kyc_verify_response = "";
            let vehicle_registration_type = (ObjRequest.Proposal_Request.vehicle_registration_type === undefined || ObjRequest.Proposal_Request.vehicle_registration_type === "" || ObjRequest.Proposal_Request.vehicle_registration_type === null) ? "" : ObjRequest.Proposal_Request.vehicle_registration_type;
            vehicle_registration_type = (vehicle_registration_type === "") ? "I" : (vehicle_registration_type.toLowerCase() === "corporate" ? "C" : "I");
            let chola_token_service = (config.environment.name === "Production") ? "https://bapps.cholainsurance.com/ckycapi/api/KYC/CholaMS_CKYC_Auth" : "https://uatportal.cholainsurance.com/Epolicyv3API/api/KYC/CholaMS_CKYC_Auth";
            let chola_verify_service = (config.environment.name === "Production") ? "https://bapps.cholainsurance.com/ckycapi/api/KYC/CholaMS_CKYC_QUERY" : "https://uatportal.cholainsurance.com/Epolicyv3API/api/KYC/CholaMS_CKYC_QUERY";
//            vehicle_registration_type = "I";
            var user_kyc_no = (ObjRequest.KYC_Number === undefined || ObjRequest.KYC_Number === "" || ObjRequest.KYC_Number === null) ? "" : ObjRequest.KYC_Number;
            var cust_name = null;
            if (ObjRequest.Proposal_Request.middle_name === undefined || ObjRequest.Proposal_Request.middle_name === "" || ObjRequest.Proposal_Request.middle_name === null) {
                cust_name = ((ObjRequest.Proposal_Request.first_name === undefined || ObjRequest.Proposal_Request.first_name === "" || ObjRequest.Proposal_Request.first_name === null) ? "" : ObjRequest.Proposal_Request.first_name) + " " +
                        ((ObjRequest.last_name === undefined || ObjRequest.Proposal_Request.last_name === "" || ObjRequest.Proposal_Request.last_name === null) ? "" : ObjRequest.Proposal_Request.last_name);
            } else {
                cust_name = ((ObjRequest.Proposal_Request.first_name === undefined || ObjRequest.Proposal_Request.first_name === "" || ObjRequest.Proposal_Request.first_name === null) ? "" : ObjRequest.Proposal_Request.first_name) + " " +
                        ((ObjRequest.Proposal_Request.middle_name === undefined || ObjRequest.Proposal_Request.middle_name === "" || ObjRequest.Proposal_Request.middle_name === null) ? "" : ObjRequest.Proposal_Request.middle_name) + " " +
                        ((ObjRequest.Proposal_Request.last_name === undefined || ObjRequest.Proposal_Request.last_name === "" || ObjRequest.Proposal_Request.last_name === null) ? "" : ObjRequest.Proposal_Request.last_name);
            }
            let req_txt = {
                "App_Ref_No": "" + ObjRequest.PB_CRN,
                "Transaction_ID": ObjRequest.KYC_Ref_No
            };
            let args = {
                data: JSON.stringify(req_txt),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "TokenKey": ""
                }
            };
            let args1 = {
                data: {
                    "PrivateKey": (config.environment.name === "Production") ? "UEJMTUBDS1lD" : "VjRfU09CIUBDS1lDVWF0",
                    "UserID": (config.environment.name === "Production") ? "PBLM" : ""
                },
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*"
                }
            };
            kyc_verify_request = req_txt;
            let KYC_Status = "VERIFY_FAIL";
            let kyc_id = 0;
            let token = null;
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let LM_Data = {
                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type,
                "KYC_Request": kyc_verify_request,
                "KYC_Response": "",
                "ckyc_remarks": ""
            };
            client.post(chola_token_service, args1, function (data1, response1) {
                if (data1) {
                    if (data1.hasOwnProperty("TokenKey") && data1.TokenKey && data1.TokenKey !== "" && data1.ErrorMSG === 'Success') {
                        token = data1.TokenKey;
                        try {
                            if (token) {
                                args.headers.TokenKey = token;
                                var client1 = new Client();
                                client1.post(chola_verify_service, args, function (data, response) {
                                    if (data) {
                                        kyc_verify_response = data;
                                        LM_Data.KYC_Response = kyc_verify_response;
                                        if (data.hasOwnProperty("Proccess_Status") && (data.Proccess_Status === 'KYC VERIFIED' || data.Proccess_Status === 'CKYC SUCCESS')) {
                                            LM_Data['KYC_Number'] = data.hasOwnProperty('CKYC_No') && data['CKYC_No'] !== "" ? data['CKYC_No'] : "";
                                            LM_Data['KYC_Status'] = "VERIFY_SUCCESS";
                                            LM_Data['KYC_FullName'] = (ObjRequest['KYC_Status'] === "FETCH_SUCCESS") ? ObjRequest['KYC_Full_Name'] : (data.hasOwnProperty('CKYC_Verified_Cust_Name') && data.CKYC_Verified_Cust_Name !== null) ? data.CKYC_Verified_Cust_Name : data['Customer_Name'];
                                            LM_Data['KYC_Ref_No'] = data.hasOwnProperty('Transaction_ID') ? data.Transaction_ID : "";
                                            LM_Data["ckyc_remarks"]= "NA";
                                        } else {
                                            //LM_Data['KYC_Number'] = data.Transaction_ID ? data.Transaction_ID : "";
                                            LM_Data['KYC_Status'] = "VERIFY_FAIL";
                                            LM_Data['KYC_Ref_No'] = data.Transaction_ID ? data.Transaction_ID : "";
                                            LM_Data['KYC_Redirect_URL'] = data.eKYC_Redirection_URL ? data.eKYC_Redirection_URL : "";
                                            LM_Data["ckyc_remarks"]= data.hasOwnProperty('Remarks')&& data.hasOwnProperty('Status') ? data.Remarks : "";
                                        }
                                        saveKYCDetails(ObjRequest, LM_Data, kyc_verify_request, kyc_verify_response);
                                        res.json({"Insurer": "CholaMS", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                                    } else {
                                        res.json({"Insurer": "CholaMS", "Msg": "KYC verify services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                                    }
                                });
                            } else {
                                res.json({"Insurer": "CholaMS", "Msg": "Could Not Generate Token. Please try again later.", "Status": "FAIL"});
                            }
                        } catch (e2) {
                            res.json({"Insurer": "CholaMS", "Msg": e2.stack, "Status": "FAIL"});
                        }
                    } else {
                        res.json({"Insurer": "CholaMS", "Msg": "KYC-Token not generated. Please try again later.", "Status": "FAIL"});
                    }
                } else {
                    res.json({"Insurer": "CholaMS", "Msg": "KYC-Token generation services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                }
            });
        } catch (e1) {
            res.json({"Insurer": "CholaMS", "Msg": e1.stack, "Status": "FAIL"});
        }
    });
	
    app.post('/kyc_details/bajaj_req_enc', function (req, res) {
        // encode
        var encoded = '';
        let plainText = req.body; 
        try {
            var m = crypto.createHash('md5');
            m.update('kycwsbrkmotr2023');
            var key = m.digest();
            var iv = 'kycwsbrkmotr2023';
            var cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
            encoded = cipher.update(plainText, 'utf8', 'hex');
            encoded += cipher.final('hex');
            res.send(encoded);
        } catch (ex) {
            console.error('Exception', this.constructor.name, 'encrypt', ex);
            res.send(ex.stuck);
        }
    });
    app.post('/bajaj_enc', function (req, res) {
        // encode
        let token = jwt.encode(req.body, secret, 'HS512');
        res.send(token);
    });

    app.post('/bajaj_dec', function (req, res) {
        // decode
        let decoded = jwt.decode(req.body.token, secret, false, 'HS512');
        res.send(decoded);
    });
    app.post('/kyc_details/bajaj_body_enc', function (req, res) {
        // encode
        var key = CryptoJS.enc.Utf8.parse("kycwsbrkmotr2023");
        var iv = CryptoJS.enc.Utf8.parse("kycwsbrkmotr2023");

        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(req.body), key, {iv: iv}).toString();
        res.send(ciphertext);
    });
    app.post('/kyc_details/bajaj_body_dec', function (req, res) {
        // encode
        var key = CryptoJS.enc.Utf8.parse("kycwsbrkmotr2023");
        var iv = CryptoJS.enc.Utf8.parse("kycwsbrkmotr2023");
        var decrypted = CryptoJS.AES.decrypt(req.body.payload, key, {iv: iv});
        let val = decrypted.toString(CryptoJS.enc.Utf8);
        var objectdata = JSON.parse(val);
        res.send(objectdata);
    });
	
    //eKycpage.html Changes Start
    app.post('/kyc_details/hdfc_fetch_kyc_details_onload', function (req, res) {
        try {
            let ObjRequest = req.body;
            let kyc_fetch_request = "";
            let kyc_fetch_response = "";
            let hdfcReturnval = '';
            let req_txt = {
                "Mobile": (ObjRequest.mobile === undefined || ObjRequest.mobile === "" || ObjRequest.mobile === null) ? "" : ObjRequest.mobile,
                "Full_Name": (ObjRequest.fullName === undefined || ObjRequest.fullName === "" || ObjRequest.fullName === null) ? "" : ObjRequest.fullName,
                "DOB": (ObjRequest.DOB === undefined || ObjRequest.DOB === "" || ObjRequest.DOB === null) ? "" : ObjRequest.DOB,
                "PAN": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                'Search_Type': (ObjRequest.search_type === undefined || ObjRequest.search_type === "" || ObjRequest.search_type === null) ? "" : ObjRequest.search_type,
                'KYC_Number': '',
                'KYC_Full_Name': '',
                'Aadhar': '',
                'KYC_Status': '',
                'Created_On': new Date(),
                'Modified_On': new Date(),
                'Insurer_Id': '',
                'PAN_Doc': '',
                'Aadhar_Doc': '',
                'PB_CRN': '',
                'User_Data_Id': '',
                'Product_Id': '',
                'Email': '',
                'Proposal_Request': '',
                'Proposal_Id': '',
                'Quote_Id': '',
                'KYC_URL': ''
            };
            kyc_fetch_request = req_txt;

            kyc_detail.findOne({'PAN': ObjRequest.Document_ID, 'Mobile': ObjRequest.mobile}).sort({Modified_On: -1}).exec(function (err, db_svae_kyc_detail) {
                if (err) {
                    res.json({"Msg": err, "Status": "FAIL"});
                } else {
                    if (db_svae_kyc_detail) {
                        kyc_detail.update({'PAN': ObjRequest.Document_ID, 'Mobile': ObjRequest.mobile}, {$set: kyc_fetch_request}, function (err, db_update_kyc_detail) {
                            if (err) {
                                res.json({"Msg": err, "Status": "FAIL"});
                            } else {
//                              hdfcReturnval =  hdfcFetchKycDetails(ObjRequest,kyc_fetch_request);
//                              res.json(hdfcReturnval);
                                let args = {
                                    data: JSON.stringify(kyc_fetch_request),
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Accept": "application/json",
                                        "token": ""
                                    }
                                };
                                let args1 = {
                                    headers: {
                                        "api_key": "8d399be8-0b6f-4a"
                                    }
                                };
                                let KYC_Status = "PENDING";
                                let kyc_id = 0;
                                let token = null;
                                var Client = require('node-rest-client').Client;
                                var client = new Client();
                                let LM_Data = {
                                    "KYC_Doc_No": ObjRequest.Document_ID,
                                    "KYC_Number": "",
                                    "KYC_FullName": "",
                                    "KYC_Ref_No": "",
                                    "KYC_Redirect_URL": "",
                                    "KYC_Insurer_ID": "",
                                    "KYC_PB_CRN": ObjRequest.PB_CRN,
                                    "KYC_Status": KYC_Status,
                                    "KYC_Search_Type": "PAN",
                                    "KYC_Request": kyc_fetch_request,
                                    "KYC_Response": "",
                                    "ckyc_remarks": ""
                                };
                                client.get("https://ctrln-uat.hdfcergo.com/e-kyc/tgt/generate-token", args1, function (data1, response1) {
                                    if (data1) {
                                        if (data1.hasOwnProperty("success") && data1.success === true) {
                                            if (data1.hasOwnProperty("data") && data1.data.hasOwnProperty("token") && data1.data.token !== "" && data1.data.token !== null) {
                                                token = data1.data.token;
                                                try {
                                                    if (token) {
                                                        args.headers.token = token;
                                                        var client1 = new Client();
                                                        client1.get("https://ctrln-uat.hdfcergo.com/e-kyc/primary/kyc-verified", args, function (data, response) {
                                                            if (data) {
                                                                kyc_fetch_response = data; // kyc_insurer_response
                                                                LM_Data.KYC_Response = kyc_fetch_response;
                                                                if (data.hasOwnProperty("success") && data.success === true && data.hasOwnProperty("data") && data.data.hasOwnProperty("iskycVerified")) {
                                                                    if (data.data.iskycVerified === 1) {
                                                                        kyc_id = (data.data.hasOwnProperty("kyc_id")) ? data.data.kyc_id : "";
                                                                        LM_Data.KYC_Status = "FETCH_SUCCESS";
                                                                        LM_Data.KYC_Number = kyc_id;
                                                                    } else if (data.data.iskycVerified === 0) {
                                                                        kyc_id = (data.data.hasOwnProperty("kyc_id")) ? data.data.kyc_id : "";
                                                                        LM_Data.KYC_Status = "FETCH_FAIL";
                                                                        LM_Data.KYC_Redirect_URL = data.data.redirect_link;
                                                                    } else {
                                                                        LM_Data.KYC_Status = "FETCH_FAIL";
                                                                    }
                                                                } else {
                                                                    LM_Data.KYC_Status = "FETCH_FAIL";
                                                                }

                                                                try {
                                                                    let cond = {
                                                                        'PAN': ObjRequest.Document_ID ? ObjRequest.Document_ID : "",
                                                                        'Mobile': ObjRequest.mobile ? ObjRequest.mobile : ""
                                                                    };
                                                                    let setObj = {
                                                                        'KYC_Number': LM_Data.KYC_Number,
                                                                        'KYC_Full_Name': LM_Data.KYC_FullName,
                                                                        'KYC_Status': LM_Data.KYC_Status,
                                                                        'Modified_On': new Date(),
                                                                        'KYC_URL': LM_Data.KYC_Redirect_URL
                                                                    };
                                                                    kyc_detail.update(cond, {$set: setObj}, function (err, users) {
                                                                        if (err) {
                                                                            res.json({"Insurer": "Edelweiss", "Msg": err, "Status": "FAIL"});
                                                                        } else {
                                                                            //res.json({"Insurer": "Edelweiss", "Msg": LM_Data.tmp_Obj, "Status": KYC_Status});
                                                                        }
                                                                    });
                                                                    let queryObj1 = {
                                                                        'PB_CRN': ObjRequest.PB_CRN ? ObjRequest.PB_CRN : "",
                                                                        'User_Data_Id': ObjRequest.User_Data_Id ? ObjRequest.User_Data_Id : "",
                                                                        'Insurer_Id': ObjRequest.Insurer_Id ? ObjRequest.Insurer_Id : "",
                                                                        'Product_Id': ObjRequest.Product_Id ? ObjRequest.Product_Id : "",
                                                                        'PAN': (ObjRequest.PAN === undefined || ObjRequest.PAN === "" || ObjRequest.PAN === null) ? "" : ObjRequest.PAN,
                                                                        'Aadhar': (ObjRequest.Aadhaar === undefined || ObjRequest.Aadhaar === "" || ObjRequest.Aadhaar === null) ? "" : ObjRequest.Aadhaar,
                                                                        'DOB': (ObjRequest.DOB === undefined || ObjRequest.DOB === "" || ObjRequest.DOB === null) ? "" : ObjRequest.DOB,
                                                                          'Full_Name':ObjRequest.fullName ? ObjRequest.fullName : '',
                                                                        'Mobile': (ObjRequest.Mobile === undefined || ObjRequest.Mobile === "" || ObjRequest.Mobile === null) ? "" : ObjRequest.Mobile - 0,
                                                                        'Email': (ObjRequest.Email === undefined || ObjRequest.Email === "" || ObjRequest.Email === null) ? "" : ObjRequest.Email,
                                                                        'KYC_Number': LM_Data.KYC_Number,
                                                                        'Search_Type': ObjRequest.Search_Type ? ObjRequest.Search_Type : "",
                                                                        'KYC_Status': LM_Data.KYC_Status,
                                                                        'PAN_Doc': ObjRequest.PAN_Doc ? ObjRequest.PAN_Doc : "",
                                                                        'Aadhar_Doc': ObjRequest.Aadhar_Doc ? ObjRequest.Aadhar_Doc : "",
                                                                        'KYC_URL': LM_Data.KYC_Redirect_URL,
                                                                        'Created_On': new Date(),
                                                                        'Modified_On': new Date(),
                                                                        //'Proposal_Request': '',
                                                                        'Proposal_Id': (ObjRequest.Proposal_Id === undefined || ObjRequest.Proposal_Id === "" || ObjRequest.Proposal_Id === null) ? "" : ObjRequest.Proposal_Id,
                                                                        'Quote_Id': (ObjRequest.Quote_Id === undefined || ObjRequest.Quote_Id === "" || ObjRequest.Quote_Id === null) ? "" : ObjRequest.Quote_Id,
                                                                        'KYC_Request_Core': kyc_fetch_request,
                                                                        'KYC_Response_Core': kyc_fetch_response
                                                                    };
                                                                    var kyc_history1 = new kyc_history(queryObj1);
                                                                    kyc_history1.save(queryObj1, function (err, users) {
                                                                        if (err) {
                                                                            res.json({"Insurer": "Edelweiss", "Msg": err, "Status": "FAIL"});
                                                                        } else {
                                                                            //res.json({"Insurer": "Edelweiss", "Msg": LM_Data.tmp_Obj, "Status": KYC_Status});
                                                                        }
                                                                    });
                                                                } catch (e) {
                                                                    res.json({"Insurer": "HDFC", "Msg": e.stack, "Status": "FAIL"});
                                                                }
                                                                res.json({"Insurer": "HDFC", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                                                            } else {
                                                                res.json({"Insurer": "HDFC", "Msg": "KYC fetch services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                                                            }
                                                        });
                                                    } else {
                                                        res.json({"Insurer": "HDFC", "Msg": "Could Not Generate Token. Please try again later.", "Status": "FAIL"});
                                                    }
                                                } catch (e2) {
                                                    res.json({"Insurer": "HDFC", "Msg": e2.stack, "Status": "FAIL"});
                                                }
                                            } else {
                                                res.json({"Insurer": "HDFC", "Msg": "KYC-Token not generated. Please try again later.", "Status": "FAIL"});
                                            }
                                        } else {
                                            res.json({"Insurer": "HDFC", "Msg": "KYC-Token generation services was not successful. Please try again later.", "Status": "FAIL"});
                                        }
                                    } else {
                                        res.json({"Insurer": "HDFC", "Msg": "KYC-Token generation services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                                    }
                                });

                            }
                        });
                    } else {
                        let kyc_detail1 = new kyc_detail(req_txt);
                        kyc_detail1.save(req_txt, function (err, users) {
                            if (err) {
                                res.json({"Msg": err, "Status": "FAIL"});
                            } else {
//                                hdfcFetchKycDetails(ObjRequest,kyc_fetch_request);
//                              res.json(hdfcReturnval);
                                let args = {
                                    data: JSON.stringify(kyc_fetch_request),
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Accept": "application/json",
                                        "token": ""
                                    }
                                };
                                let args1 = {
                                    headers: {
                                        "api_key": "8d399be8-0b6f-4a"
                                    }
                                };
                                let KYC_Status = "PENDING";
                                let kyc_id = 0;
                                let token = null;
                                var Client = require('node-rest-client').Client;
                                var client = new Client();
                                let LM_Data = {
                                    "KYC_Doc_No": ObjRequest.Document_ID,
                                    "KYC_Number": "",
                                    "KYC_FullName": "",
                                    "KYC_Ref_No": "",
                                    "KYC_Redirect_URL": "",
                                    "KYC_Insurer_ID": "",
                                    "KYC_PB_CRN": ObjRequest.PB_CRN,
                                    "KYC_Status": KYC_Status,
                                    "KYC_Search_Type": "PAN",
                                    "KYC_Request": kyc_fetch_request,
                                    "KYC_Response": "",
                                    "ckyc_remarks": ""
                                };
                                client.get("https://ctrln-uat.hdfcergo.com/e-kyc/tgt/generate-token", args1, function (data1, response1) {
                                    if (data1) {
                                        if (data1.hasOwnProperty("success") && data1.success === true) {
                                            if (data1.hasOwnProperty("data") && data1.data.hasOwnProperty("token") && data1.data.token !== "" && data1.data.token !== null) {
                                                token = data1.data.token;
                                                try {
                                                    if (token) {
                                                        args.headers.token = token;
                                                        var client1 = new Client();
                                                        client1.get("https://ctrln-uat.hdfcergo.com/e-kyc/primary/kyc-verified", args, function (data, response) {
                                                            if (data) {
                                                                kyc_fetch_response = data; // kyc_insurer_response
                                                                LM_Data.KYC_Response = kyc_fetch_response;
                                                                if (data.hasOwnProperty("success") && data.success === true && data.hasOwnProperty("data") && data.data.hasOwnProperty("iskycVerified")) {
                                                                    if (data.data.iskycVerified === 1) {
                                                                        kyc_id = (data.data.hasOwnProperty("kyc_id")) ? data.data.kyc_id : "";
                                                                        LM_Data.KYC_Status = "FETCH_SUCCESS";
                                                                        LM_Data.KYC_Number = kyc_id;
                                                                    } else if (data.data.iskycVerified === 0) {
                                                                        kyc_id = (data.data.hasOwnProperty("kyc_id")) ? data.data.kyc_id : "";
                                                                        LM_Data.KYC_Status = "FETCH_FAIL";
                                                                        LM_Data.KYC_Redirect_URL = data.data.redirect_link;
                                                                    } else {
                                                                        LM_Data.KYC_Status = "FETCH_FAIL";
                                                                    }
                                                                } else {
                                                                    LM_Data.KYC_Status = "FETCH_FAIL";
                                                                }

                                                                try {
                                                                    let cond = {
                                                                        'PAN': ObjRequest.PAN ? ObjRequest.PAN : "",
                                                                        'Mobile': ObjRequest.mobile ? ObjRequest.mobile : ""
                                                                    };
                                                                    let setObj = {
                                                                        'KYC_Number': LM_Data.KYC_Number,
                                                                        'KYC_Full_Name': LM_Data.KYC_FullName,
                                                                        'KYC_Status': LM_Data.KYC_Status,
                                                                        'Modified_On': new Date(),
                                                                        'KYC_URL': LM_Data.KYC_Redirect_URL
                                                                    };
                                                                    kyc_detail.update(cond, {$set: setObj}, function (err, users) {
                                                                        if (err) {
                                                                            res.json({"Insurer": "Edelweiss", "Msg": err, "Status": "FAIL"});
                                                                        } else {
                                                                            //res.json({"Insurer": "Edelweiss", "Msg": LM_Data.tmp_Obj, "Status": KYC_Status});
                                                                        }
                                                                    });
                                                                    let queryObj1 = {
                                                                        'PB_CRN': ObjRequest.PB_CRN ? ObjRequest.PB_CRN : "",
                                                                        'User_Data_Id': ObjRequest.User_Data_Id ? ObjRequest.User_Data_Id : "",
                                                                        'Insurer_Id': ObjRequest.Insurer_Id ? ObjRequest.Insurer_Id : "",
                                                                        'Product_Id': ObjRequest.Product_Id ? ObjRequest.Product_Id : "",
                                                                        'PAN': (ObjRequest.PAN === undefined || ObjRequest.PAN === "" || ObjRequest.PAN === null) ? "" : ObjRequest.PAN,
                                                                        'Aadhar': (ObjRequest.Aadhaar === undefined || ObjRequest.Aadhaar === "" || ObjRequest.Aadhaar === null) ? "" : ObjRequest.Aadhaar,
                                                                        'DOB': (ObjRequest.DOB === undefined || ObjRequest.DOB === "" || ObjRequest.DOB === null) ? "" : ObjRequest.DOB,
                                                                        'Full_Name':ObjRequest.fullName ? ObjRequest.fullName : '',
                                                                        'Mobile': (ObjRequest.Mobile === undefined || ObjRequest.Mobile === "" || ObjRequest.Mobile === null) ? "" : ObjRequest.Mobile - 0,
                                                                        'Email': (ObjRequest.Email === undefined || ObjRequest.Email === "" || ObjRequest.Email === null) ? "" : ObjRequest.Email,
                                                                        'KYC_Number': LM_Data.KYC_Number,
                                                                        'Search_Type': ObjRequest.Search_Type ? ObjRequest.Search_Type : "",
                                                                        'KYC_Status': LM_Data.KYC_Status,
                                                                        'PAN_Doc': ObjRequest.PAN_Doc ? ObjRequest.PAN_Doc : "",
                                                                        'Aadhar_Doc': ObjRequest.Aadhar_Doc ? ObjRequest.Aadhar_Doc : "",
                                                                        'KYC_URL': LM_Data.KYC_Redirect_URL,
                                                                        'Created_On': new Date(),
                                                                        'Modified_On': new Date(),
                                                                        //'Proposal_Request': '',
                                                                        'Proposal_Id': '',
                                                                        'Quote_Id': (ObjRequest.Quote_Id === undefined || ObjRequest.Quote_Id === "" || ObjRequest.Quote_Id === null) ? "" : ObjRequest.Quote_Id,
                                                                        'KYC_Request_Core': kyc_fetch_request,
                                                                        'KYC_Response_Core': kyc_fetch_response
                                                                    };
                                                                    var kyc_history1 = new kyc_history(queryObj1);
                                                                    kyc_history1.save(queryObj1, function (err, users) {
                                                                        if (err) {
                                                                            res.json({"Insurer": "Edelweiss", "Msg": err, "Status": "FAIL"});
                                                                        } else {
                                                                            //res.json({"Insurer": "Edelweiss", "Msg": LM_Data.tmp_Obj, "Status": KYC_Status});
                                                                        }
                                                                    });
                                                                } catch (e) {
                                                                    res.json({"Insurer": "HDFC", "Msg": e.stack, "Status": "FAIL"});
                                                                }
                                                                res.json({"Insurer": "HDFC", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                                                            } else {
                                                                res.json({"Insurer": "HDFC", "Msg": "KYC fetch services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                                                            }
                                                        });
                                                    } else {
                                                        res.json({"Insurer": "HDFC", "Msg": "Could Not Generate Token. Please try again later.", "Status": "FAIL"});
                                                    }
                                                } catch (e2) {
                                                    res.json({"Insurer": "HDFC", "Msg": e2.stack, "Status": "FAIL"});
                                                }
                                            } else {
                                                res.json({"Insurer": "HDFC", "Msg": "KYC-Token not generated. Please try again later.", "Status": "FAIL"});
                                            }
                                        } else {
                                            res.json({"Insurer": "HDFC", "Msg": "KYC-Token generation services was not successful. Please try again later.", "Status": "FAIL"});
                                        }
                                    } else {
                                        res.json({"Insurer": "HDFC", "Msg": "KYC-Token generation services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                                    }
                                });
                            }
                        });
                    }
                }
            });


        } catch (e1) {
            res.json({"Insurer": "HDFC", "Msg": e1.stack, "Status": "FAIL"});
        }
    });
    //eKycpage.html Changes End

    app.post('/kyc_details/future_fetch_kyc_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            let proposal_request = ObjRequest.Proposal_Request;
            let kyc_fetch_request = "";
            let kyc_fetch_response = "";
            var cust_name = null;
            if (ObjRequest.Proposal_Request.middle_name === undefined || ObjRequest.Proposal_Request.middle_name === "" || ObjRequest.Proposal_Request.middle_name === null) {
                cust_name = ((ObjRequest.Proposal_Request.first_name === undefined || ObjRequest.Proposal_Request.first_name === "" || ObjRequest.Proposal_Request.first_name === null) ? "" : ObjRequest.Proposal_Request.first_name) + " " +
                        ((ObjRequest.Proposal_Request.last_name === undefined || ObjRequest.Proposal_Request.last_name === "" || ObjRequest.Proposal_Request.last_name === null) ? "" : ObjRequest.Proposal_Request.last_name);
            } else {
                cust_name = ((ObjRequest.Proposal_Request.first_name === undefined || ObjRequest.Proposal_Request.first_name === "" || ObjRequest.Proposal_Request.first_name === null) ? "" : ObjRequest.Proposal_Request.first_name) + " " +
                        ((ObjRequest.Proposal_Request.middle_name === undefined || ObjRequest.Proposal_Request.middle_name === "" || ObjRequest.Proposal_Request.middle_name === null) ? "" : ObjRequest.Proposal_Request.middle_name) + " " +
                        ((ObjRequest.Proposal_Request.last_name === undefined || ObjRequest.Proposal_Request.last_name === "" || ObjRequest.Proposal_Request.last_name === null) ? "" : ObjRequest.Proposal_Request.last_name);
            }
            let vehicle_registration_type = (ObjRequest.Proposal_Request.vehicle_registration_type === undefined || ObjRequest.Proposal_Request.vehicle_registration_type === "" || ObjRequest.Proposal_Request.vehicle_registration_type === null) ? "I" : (ObjRequest.Proposal_Request.vehicle_registration_type.toLowerCase() === "corporate" ? "C" : "I");
            let future_token_service = (config.environment.name === "Production") ? "http://qa-www.policyboss.com:3000/kyc_details/lm_future_token_generate" : "http://qa-www.policyboss.com:3000/kyc_details/lm_future_token_generate";
            let future_create_service = (config.environment.name === "Production") ? "http://qa-www.policyboss.com:3000/kyc_details/lm_future_fetch_detail" : "http://qa-www.policyboss.com:3000/kyc_details/lm_future_fetch_detail";

            let id_type = (ObjRequest.hasOwnProperty('Document_Type') && ObjRequest.Document_Type) ? ObjRequest.Document_Type : "";
            let req_txt = {
                "req_id": "",
                "customer_type": vehicle_registration_type,
                "id_type": id_type === "AADHAR" ? "AADHAAR" : id_type,
                "id_num": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "dob": (vehicle_registration_type === "I" && proposal_request.birth_date && proposal_request.birth_date !== "") ? (moment(proposal_request.birth_date, "DD/MM/YYYY").format("DD-MM-YYYY")) : "",
                "full_name": cust_name,
                "gender": (ObjRequest.Proposal_Request.gender === undefined || ObjRequest.Proposal_Request.gender === "" || ObjRequest.Proposal_Request.gender === null) ? "" : ObjRequest.Proposal_Request.gender,
                "url_type": "https://www.policyboss.com/webhook/ckyc/ckyc_capture/" + ObjRequest.Insurer_Id + "/" + ObjRequest.PB_CRN
            };
//            let username = (config.environment.name === "Production") ? "FGCkyc" : "FGCkyc";
//            let password = (config.environment.name === "Production") ? "FGCkyc@1" : "FGCkyc@1";
//            let args = {
//                data: JSON.stringify(req_txt),
//                headers: {
//                    "Content-Type": "application/json",
//                    "Accept": "application/json",
//                    "Token": "C9E541FC-CFAF-4361-96D9-70C839A2F349",
//                    "Authorization": "Basic " + new Buffer(username + ':' + password).toString('base64')
//                }
//            };
//            let token_args = {
//                headers: {
//                    "Token": "C9E541FC-CFAF-4361-96D9-70C839A2F349",
//                    "Authorization": "Basic " + new Buffer(username + ':' + password).toString('base64')
//                }
//            };
            
            let args = {
                data: JSON.stringify(req_txt),
                headers: {
                    "Content-Type": "application/json"
                }
            };
            kyc_fetch_request = req_txt;
            let KYC_Status = "PENDING";
            let kyc_id = 0;
            let kyc_url = "";
            let token = null;
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let kyc_req_id = "";
            let LM_Data = {
                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": ObjRequest.Document_Type ? ObjRequest.Document_Type : "",//"PAN",
                "KYC_Request": kyc_fetch_request,
                "KYC_Response": "",
                "ckyc_remarks": ""
            };
            client.get(future_token_service, {}, function (data1, response1) {
                if (data1) {
                    if (data1[0].hasOwnProperty("ProposalNo") && data1[0].ProposalNo !== "" && data1[0].ProposalNo !== null) {
                        if (data1[0].hasOwnProperty("Token") && data1[0].Token !== "" && data1[0].Token !== null) {
                            token = data1[0].Token;
                            try {
                                if (token) {
                                    //args.headers.token = token;
                                    var client1 = new Client();
                                    client1.post(future_create_service, args, function (data, response) {
                                        if (data) {
                                            kyc_fetch_response = data;
                                            LM_Data.KYC_Response = kyc_fetch_response;
                                            if (data.hasOwnProperty("success") && data.success === true) {
                                                if (data.ckyc_remarks === 'OK') {
                                                    LM_Data['KYC_Number'] = (data['result'].hasOwnProperty("ckyc_number")) ? data['result'].ckyc_number : "";
                                                    LM_Data['KYC_Status'] = "VERIFY_SUCCESS";//"FETCH_SUCCESS";
                                                    //LM_Data['KYC_Doc_No'] = (data['result'].hasOwnProperty("id_num")) ? data['result'].id_num : "";
                                                    LM_Data['KYC_Ref_No'] = (data.hasOwnProperty("proposal_id")) ? data.proposal_id : "";
                                                    kyc_req_id = (data.hasOwnProperty("req_id")) ? data.req_id : "";
                                                    LM_Data['KYC_FullName'] = (data['result'].hasOwnProperty("customer_name")) ? data['result'].customer_name : "";
                                                    LM_Data['ckyc_remarks'] = "NA";
                                                } else {
                                                    LM_Data['KYC_Status'] = "VERIFY_FAIL";//"FETCH_FAIL";
                                                    LM_Data['KYC_Ref_No'] = (data.hasOwnProperty("proposal_id")) ? data.proposal_id : "";
                                                    LM_Data['KYC_Redirect_URL'] = data.url ? data.url : data.url;
                                                    kyc_req_id = (data.hasOwnProperty("req_id")) ? data.req_id : "";
                                                    LM_Data['ckyc_remarks'] = data.ckyc_remarks ? data.ckyc_remarks : "NA";
                                                    LM_Data['KYC_Number'] = (data.hasOwnProperty("proposal_id")) ? data.proposal_id : "";
                                                }
                                            } else {
                                                LM_Data['KYC_Status'] = "VERIFY_FAIL";//"FETCH_FAIL";
                                                LM_Data['KYC_Ref_No'] = (data.hasOwnProperty("proposal_id")) ? data.proposal_id : "";
                                                LM_Data['KYC_Redirect_URL'] = data.url ? data.url : data.url;
                                                kyc_req_id = (data.hasOwnProperty("req_id")) ? data.req_id : "";
                                                LM_Data['ckyc_remarks'] = data.ckyc_remarks ? data.ckyc_remarks : "NA";
                                                LM_Data['KYC_Number'] = (data.hasOwnProperty("proposal_id")) ? data.proposal_id : "";
                                            }
                                            if(LM_Data && LM_Data.KYC_Redirect_URL){
                                                LM_Data['ckyc_remarks'] = "NA";
                                            }
                                            saveKYCDetails(ObjRequest, LM_Data, kyc_fetch_request, kyc_fetch_response);
                                            res.json({"Insurer": "FUTURE", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                                        } else {
                                            res.json({"Insurer": "FUTURE", "Msg": "KYC fetch services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                                        }
                                    });
                                } else {
                                    res.json({"Insurer": "FUTURE", "Msg": "Could Not Generate Token. Please try again later.", "Status": "FAIL"});
                                }
                            } catch (e2) {
                                res.json({"Insurer": "FUTURE", "Msg": e2.stack, "Status": "FAIL"});
                            }
                        } else {
                            res.json({"Insurer": "FUTURE", "Msg": "KYC-Token not generated. Please try again later.", "Status": "FAIL"});
                        }
                    } else {
                        res.json({"Insurer": "FUTURE", "Msg": "KYC-Token generation services was not successful. Please try again later.", "Status": "FAIL"});
                    }
                } else {
                    res.json({"Insurer": "FUTURE", "Msg": "KYC-Token generation services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                }
            });
        } catch (e1) {
            res.json({"Insurer": "FUTURE", "Msg": e1.stack, "Status": "FAIL"});
        }
    });

    app.post('/kyc_details/future_verify_kyc_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            let kyc_verify_request = "";
            let kyc_verify_response = "";
            let vehicle_registration_type = (ObjRequest.Proposal_Request.vehicle_registration_type === undefined || ObjRequest.Proposal_Request.vehicle_registration_type === "" || ObjRequest.Proposal_Request.vehicle_registration_type === null) ? "I" : (ObjRequest.Proposal_Request.vehicle_registration_type.toLowerCase() === "corporate" ? "C" : "I");
//            let future_token_service = (config.environment.name === "Production") ? "" : "https://fglpg001.futuregenerali.in/NLCKYC/API/CKYC/GenerateToken";
//            let future_verify_service = (config.environment.name === "Production") ? "" : "https://fglpg001.futuregenerali.in/NLCKYC/API/CommonCKYC/Verify-CKYC";
            let future_token_service = (config.environment.name === "Production") ? "http://qa-www.policyboss.com:3000/kyc_details/lm_future_token_generate" : "http://qa-www.policyboss.com:3000/kyc_details/lm_future_token_generate";
            let future_verify_service = (config.environment.name === "Production") ? "http://qa-www.policyboss.com:3000/kyc_details/lm_future_verifiy_detail" : "http://qa-www.policyboss.com:3000/kyc_details/lm_future_verifiy_detail";
            var user_kyc_no = (ObjRequest.user_kyc_no === undefined || ObjRequest.user_kyc_no === "" || ObjRequest.user_kyc_no === null) ? "" : ObjRequest.user_kyc_no;
            var cust_name = null;
            if (ObjRequest.Proposal_Request.middle_name === undefined || ObjRequest.Proposal_Request.middle_name === "" || ObjRequest.Proposal_Request.middle_name === null) {
                cust_name = ((ObjRequest.Proposal_Request.first_name === undefined || ObjRequest.Proposal_Request.first_name === "" || ObjRequest.Proposal_Request.first_name === null) ? "" : ObjRequest.Proposal_Request.first_name) + " " +
                        ((ObjRequest.last_name === undefined || ObjRequest.Proposal_Request.last_name === "" || ObjRequest.Proposal_Request.last_name === null) ? "" : ObjRequest.Proposal_Request.last_name);
            } else {
                cust_name = ((ObjRequest.Proposal_Request.first_name === undefined || ObjRequest.Proposal_Request.first_name === "" || ObjRequest.Proposal_Request.first_name === null) ? "" : ObjRequest.Proposal_Request.first_name) + " " +
                        ((ObjRequest.Proposal_Request.middle_name === undefined || ObjRequest.Proposal_Request.middle_name === "" || ObjRequest.Proposal_Request.middle_name === null) ? "" : ObjRequest.Proposal_Request.middle_name) + " " +
                        ((ObjRequest.Proposal_Request.last_name === undefined || ObjRequest.Proposal_Request.last_name === "" || ObjRequest.Proposal_Request.last_name === null) ? "" : ObjRequest.Proposal_Request.last_name);
            }
            //let id_type = ObjRequest.Search_Type === "PAN" ? ObjRequest.PAN : ObjRequest.Search_Type === "AADHAR" ? ObjRequest.Aadhar : "";
            let id_type = (ObjRequest.hasOwnProperty('Document_Type') && ObjRequest.Document_Type) ? ObjRequest.Document_Type : "";

//            let req_txt = {
//                "req_id": (ObjRequest.hasOwnProperty('Proposal_Id') && ObjRequest.Proposal_Id) ? ObjRequest.Proposal_Id : "",
//                "proposal_no": (ObjRequest.hasOwnProperty('KYC_Ref_No') && ObjRequest.KYC_Ref_No) ? ObjRequest.KYC_Ref_No : "",
//                "customer_type": vehicle_registration_type ? vehicle_registration_type : "I",
//                "dob": (ObjRequest.DOB === undefined || ObjRequest.DOB === "" || ObjRequest.DOB === null) ? "" : (moment(ObjRequest.DOB, "DD/MM/YYYY").format("DD-MM-YYYY")),
//                "gender": (ObjRequest.hasOwnProperty('gender') && ObjRequest.gender) ? ObjRequest.gender : "",
//                "url_type": "https://www.policyboss.com/webhook/ckyc/ckyc_capture/" + ObjRequest.PB_CRN + "/" + ObjRequest.Insurer_Id,
//                "DocumentDetails": [
//                    {
//                        "id_type": ObjRequest.Search_Type,
//                        "id_num": id_type
//                    }
//                ]
//            };
//            let ckyc_val = {
//                "id_type": (ObjRequest.hasOwnProperty('user_kyc_no') && ObjRequest.user_kyc_no) ? "CKYC" : "",
//                "id_num": user_kyc_no
//            };
//            if (ckyc_val['id_type']) {
//                req_txt['DocumentDetails'].push(ckyc_val);
//            };
            let req_txt = {
                "proposal_id": (ObjRequest.hasOwnProperty('KYC_Ref_No') && ObjRequest.KYC_Ref_No) ? ObjRequest.KYC_Ref_No : ""
            };
//            let username = (config.environment.name === "Production") ? "FGCkyc" : "FGCkyc";
//            let password = (config.environment.name === "Production") ? "FGCkyc@1" : "FGCkyc@1";
//            let args = {
//                data: JSON.stringify(req_txt),
//                headers: {
//                    "Content-Type": "application/json",
//                    "Accept": "application/json",
//                    "Token": "C9E541FC-CFAF-4361-96D9-70C839A2F349",
//                    "Authorization": "Basic " + new Buffer(username + ':' + password).toString('base64')
//                }
//            };
//            let token_args = {
//                headers: {
//                    "Token": "C9E541FC-CFAF-4361-96D9-70C839A2F349",
//                    "Authorization": "Basic " + new Buffer(username + ':' + password).toString('base64')
//                }
//            };
            let args = {
                data: JSON.stringify(req_txt),
                headers: {
                    "Content-Type": "application/json"
                }
            };
            kyc_verify_request = req_txt;
            let KYC_Status = "VERIFY_FAIL";
            let kyc_id = 0;
            let token = null;
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let kyc_req_id = "";
            let LM_Data = {
                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": "PAN",
                "KYC_Request": kyc_verify_request,
                "KYC_Response": "",
                "ckyc_remarks": ""
            };
            client.get(future_token_service, {}, function (data1, response1) {
                if (data1) {
                    if (data1[0].hasOwnProperty("ProposalNo") && data1[0].ProposalNo !== "" && data1[0].ProposalNo !== null) {
                        if (data1[0].hasOwnProperty("Token") && data1[0].Token !== "" && data1[0].Token !== null) {
                            token = data1[0].Token;
                            try {
                                if (token) {
//                                    args.headers.token = token;
                                    var client1 = new Client();
                                    client1.post(future_verify_service, args, function (data, response) {
                                        if (data) {
                                            kyc_verify_response = data;
                                            LM_Data.KYC_Response = kyc_verify_response;
                                            if (data.hasOwnProperty("success") && data.success === true) {
                                                if (data.ckyc_remarks === 'OK') {
                                                    LM_Data['KYC_Number'] = (data['result'].hasOwnProperty("ckyc_number")) ? data['result'].ckyc_number : "";
                                                    LM_Data['KYC_Status'] = "VERIFY_SUCCESS";
                                                    //LM_Data['KYC_Doc_No'] = (data['result'].hasOwnProperty("id_num")) ? data['result'].id_num : "";
                                                    LM_Data['KYC_Ref_No'] = (data.hasOwnProperty("proposal_id")) ? data.proposal_id : "";
                                                    kyc_req_id = (data.hasOwnProperty("req_id")) ? data.req_id : "";
                                                    LM_Data['KYC_FullName'] = (data['result'].hasOwnProperty("customer_name")) ? data['result'].customer_name : "";
                                                    LM_Data['ckyc_remarks'] = "NA";
                                                } else {
                                                    LM_Data['KYC_Status'] = "VERIFY_FAIL";
                                                    LM_Data['KYC_Ref_No'] = (data.hasOwnProperty("proposal_id")) ? data.proposal_id : "";
                                                    LM_Data['KYC_Redirect_URL'] = data.url ? data.url : data.url;
                                                    kyc_req_id = (data.hasOwnProperty("req_id")) ? data.req_id : "";
                                                    LM_Data['ckyc_remarks'] = data.ckyc_remarks ? (data.ckyc_remarks) : (data.message ? data.message : data);
                                                }
                                            } else {
                                                LM_Data['KYC_Status'] = "VERIFY_FAIL";
                                                LM_Data['KYC_Ref_No'] = (data.hasOwnProperty("proposal_id")) ? data.proposal_id : ((data.hasOwnProperty("Proposal_ID")) ? data.Proposal_ID : "");
                                                LM_Data['KYC_Redirect_URL'] = data.url ? data.url : data.url;
                                                kyc_req_id = (data.hasOwnProperty("req_id")) ? data.req_id : "";
                                                LM_Data['ckyc_remarks'] = data.ckyc_remarks ? (data.ckyc_remarks) : (data.message ? data.message : data);
                                            }
                                            saveKYCDetails(ObjRequest, LM_Data, kyc_verify_request, kyc_verify_response);
                                            res.json({"Insurer": "FUTURE", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                                        } else {
                                            res.json({"Insurer": "FUTURE", "Msg": "KYC verify services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                                        }
                                    });
                                } else {
                                    res.json({"Insurer": "FUTURE", "Msg": "Could Not Generate Token. Please try again later.", "Status": "FAIL"});
                                }
                            } catch (e2) {
                                res.json({"Insurer": "FUTURE", "Msg": e2.stack, "Status": "FAIL"});
                            }
                        } else {
                            res.json({"Insurer": "FUTURE", "Msg": "KYC-Token not generated. Please try again later.", "Status": "FAIL"});
                        }
                    } else {
                        res.json({"Insurer": "FUTURE", "Msg": "KYC-Token generation services was not successful. Please try again later.", "Status": "FAIL"});
                    }
                } else {
                    res.json({"Insurer": "FUTURE", "Msg": "KYC-Token generation services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                }
            });
        } catch (e1) {
            res.json({"Insurer": "FUTURE", "Msg": e1.stack, "Status": "FAIL"});
        }
    });
    app.get('/kyc_details/lm_future_token_generate', function (req, res) {
        try {
            let Client = require('node-rest-client').Client;
            let client = new Client();
            let future_token_service = "https://verifyekyc.fggeneral.in/CKYC/API/CKYC/GenerateToken";
            let username = "FGCkyc";
            let password = "FGCkyc@1";
            let token_args = {
                headers: {
                    "Token": "C9E541FC-CFAF-4361-96D9-70C839A2F349",
                    "Authorization": "Basic " + new Buffer(username + ':' + password).toString('base64')
                }
            };
            client.post(future_token_service, token_args, function (future_token_data, future_token_response) {
                if (future_token_data) {
                    res.send(future_token_data);
                } else {
                    res.send(future_token_response);
                }
            });
        } catch (e) {
            res.json({"Insurer": "Future /kyc_details/lm_future_token_generate", "Msg": e.stack, "Status": "FAIL"});
        }
    });
    app.post('/kyc_details/lm_future_fetch_detail', function (req, res) {
        try {
            let objRequest = req.body;
            let Client = require('node-rest-client').Client;
            let client = new Client();
            let future_create_service = "https://verifyekyc.fggeneral.in/CKYC/API/CKYC/CreateCKYC";
            let bodyObj = {};
            for (let key in objRequest) {
                bodyObj[key] = objRequest[key];
            }
            let username = "FGCkyc";
            let password = "FGCkyc@1";
            let args = {
                data: JSON.stringify(bodyObj),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Token": "C9E541FC-CFAF-4361-96D9-70C839A2F349",
                    "Authorization": "Basic " + new Buffer(username + ':' + password).toString('base64')
                }
            };
            client.post(future_create_service, args, function (create_service_data, create_service_response) {
                if (create_service_data) {
                    res.send(create_service_data);
                } else {
                    res.send(create_service_response);
                }
            });
        } catch (e) {
            res.json({"Insurer": "Future /kyc_details/lm_future_fetch_detail", "Msg": e.stack, "Status": "FAIL"});
        }
    });
    app.post('/kyc_details/lm_future_verifiy_detail', function (req, res) {
        try {
            let objRequest = req.body;
            let Client = require('node-rest-client').Client;
            let client = new Client();
            let future_verify_service = "https://verifyekyc.fggeneral.in/CKYC/API/CKYC/GetCKYCStatus";
            let bodyObj = {};
            for (let key in objRequest) {
                bodyObj[key] = objRequest[key];
            }
            let username = "FGCkyc";
            let password = "FGCkyc@1";
            let args = {
                data: JSON.stringify(bodyObj),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Token": "C9E541FC-CFAF-4361-96D9-70C839A2F349",
                    "Authorization": "Basic " + new Buffer(username + ':' + password).toString('base64')
                }
            };
            client.post(future_verify_service, args, function (verify_service_data, verify_service_response) {
                if (verify_service_data) {
                    res.send(verify_service_data);
                } else {
                    res.send(verify_service_response);
                }
            });
        } catch (e) {
            res.json({"Insurer": "Future /kyc_details/lm_future_verifiy_detail", "Msg": e.stack, "Status": "FAIL"});
        }
    });
    app.post('/kyc_details/reliance_fetch_kyc_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            let proposal_request = ObjRequest.Proposal_Request;
            let kyc_fetch_request = "";
            let kyc_fetch_response = "";
            let vehicle_registration_type = (proposal_request.vehicle_registration_type === undefined || proposal_request.vehicle_registration_type === "" || proposal_request.vehicle_registration_type === null) ? "" : proposal_request.vehicle_registration_type;
            vehicle_registration_type = (vehicle_registration_type === "") ? "I" : (vehicle_registration_type.toLowerCase() === "corporate" ? "C" : "I");
            let reliance_verify_service = (config.environment.name === "Production") ? "https://avenue.brobotinsurance.com/Verify_CKYC_Details" : "https://api.brobotinsurance.com/Verify_CKYC_Details";
//            vehicle_registration_type = "I";
            var user_kyc_no = (ObjRequest.KYC_Number === undefined || ObjRequest.KYC_Number === "" || ObjRequest.KYC_Number === null) ? "" : ObjRequest.KYC_Number;
            var cust_name = null;
            if (ObjRequest.Proposal_Request.middle_name === undefined || ObjRequest.Proposal_Request.middle_name === "" || ObjRequest.Proposal_Request.middle_name === null) {
                cust_name = ((ObjRequest.Proposal_Request.first_name === undefined || ObjRequest.Proposal_Request.first_name === "" || ObjRequest.Proposal_Request.first_name === null) ? "" : ObjRequest.Proposal_Request.first_name) + " " +
                        ((ObjRequest.Proposal_Request.last_name === undefined || ObjRequest.Proposal_Request.last_name === "" || ObjRequest.Proposal_Request.last_name === null) ? "" : ObjRequest.Proposal_Request.last_name);
            } else {
                cust_name = ((ObjRequest.Proposal_Request.first_name === undefined || ObjRequest.Proposal_Request.first_name === "" || ObjRequest.Proposal_Request.first_name === null) ? "" : ObjRequest.Proposal_Request.first_name) + " " +
                        ((ObjRequest.Proposal_Request.middle_name === undefined || ObjRequest.Proposal_Request.middle_name === "" || ObjRequest.Proposal_Request.middle_name === null) ? "" : ObjRequest.Proposal_Request.middle_name) + " " +
                        ((ObjRequest.Proposal_Request.last_name === undefined || ObjRequest.Proposal_Request.last_name === "" || ObjRequest.Proposal_Request.last_name === null) ? "" : ObjRequest.Proposal_Request.last_name);
            }
            let return_url = "https://www.policyboss.com/webhook/ckyc/ckyc_capture/"+ ObjRequest.Insurer_Id + "/" + ObjRequest.PB_CRN;
            let req_txt = {
                "PAN": ObjRequest.Search_Type === "PAN" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID) : "",//(proposal_request.pan === undefined || proposal_request.pan === "" || proposal_request.pan === null) ? "" : proposal_request.pan,
                "DOB":  (proposal_request.birth_date && proposal_request.birth_date !== "") ? (moment(proposal_request.birth_date, "DD/MM/YYYY").format("DD-MM-YYYY")) : "",
                "CKYC": user_kyc_no,
                "MOBILE": (ObjRequest.Proposal_Request.mobile === undefined || ObjRequest.Proposal_Request.mobile === "" || ObjRequest.Proposal_Request.mobile === null) ? "" : ObjRequest.Proposal_Request.mobile,
                "PINCODE": "",
                "BIRTHYEAR": "",
                "ReturnURL": return_url,
                "UNIQUEID": ObjRequest.PB_CRN,
                "AADHAAR_No": ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "AADHAR" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID): "",
                "CIN": "",
                "VOTERID": ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "VOTERID" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID) : "",
                "DL_No": ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "DRIVINGLICENSE" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID) : "",
                "PASSPORT": ObjRequest.Search_Type.toUpperCase() === "PASSPORT" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID) : ""
            };
            if (ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "AADHAR") {
                req_txt['FULLNAME'] = cust_name;
                req_txt['GENDER'] = (ObjRequest.Proposal_Request.gender === undefined || ObjRequest.Proposal_Request.gender === "" || ObjRequest.Proposal_Request.gender === null) ? "" : ObjRequest.Proposal_Request.gender;
            }
            let sub_key = (config.environment.name === "Production") ? "08712cf5065e4d549e7111e098ce4254" : "9338b32e0ed447b68b257ccdc6cfb0bb";
            let args = {
                data: JSON.stringify(req_txt),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "Subscription-Key": sub_key
                }
            };
            kyc_fetch_request = req_txt;
            let KYC_Status = "PENDING";
            let kyc_id = 0;
            let token = null;
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let LM_Data = {
                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Company_Name": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type,//"PAN",
                "KYC_Request": kyc_fetch_request,
                "KYC_Response": "",
                "ckyc_remarks": ""
            };
            try {
                var client = new Client();
                client.post(reliance_verify_service, args, function (data, response) {
                    if (data) {
                        kyc_fetch_response = data;
                        LM_Data.KYC_Response = kyc_fetch_response;
                        if (data.hasOwnProperty("success") && data.success === true) {
                            if (data.kyc_data && data.kyc_data.CKYC && data.kyc_data.CKYC.result && data.kyc_data.CKYC.result.PERSONAL_DETAILS && data.kyc_data.CKYC.result.PERSONAL_DETAILS.CKYC_NO && data.kyc_data.CKYC.result.PERSONAL_DETAILS.CKYC_NO !== "") {
                                LM_Data['KYC_Number'] = data.kyc_data.CKYC.result.PERSONAL_DETAILS.CKYC_NO;
                                LM_Data['KYC_Status'] = "FETCH_SUCCESS";
                                if(vehicle_registration_type === "C"){
                                    LM_Data['KYC_Company_Name'] = data.kyc_data.CKYC.result.PERSONAL_DETAILS.FULLNAME ? data.kyc_data.CKYC.result.PERSONAL_DETAILS.FULLNAME : "";
                                }else{
                                	LM_Data['KYC_FullName'] = data.kyc_data.CKYC.result.PERSONAL_DETAILS.FULLNAME ? data.kyc_data.CKYC.result.PERSONAL_DETAILS.FULLNAME : "";
                                }
                                LM_Data['KYC_Ref_No'] = data.hasOwnProperty('Unique_Id') ? data.Unique_Id : "";
                            } else {
                                LM_Data['KYC_Status'] = "FETCH_FAIL";
                                LM_Data['KYC_Ref_No'] = data.hasOwnProperty('Unique_Id') ? data.Unique_Id : "";
                                LM_Data['KYC_Redirect_URL'] = data.Endpoint_2_URL ? data.Endpoint_2_URL : ObjRequest.KYC_URL;
                            }
                        } else {
                            LM_Data['KYC_Status'] = "FETCH_FAIL";
                            LM_Data['KYC_Ref_No'] = data.hasOwnProperty('Unique_Id') ? data.Unique_Id : "";
                            LM_Data['KYC_Redirect_URL'] = data.Endpoint_2_URL ? data.Endpoint_2_URL : ObjRequest.KYC_URL;
                        }

                        saveKYCDetails(ObjRequest, LM_Data, kyc_fetch_request, kyc_fetch_response);
                        res.json({"Insurer": "Reliance", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                    } else {
                        res.json({"Insurer": "Reliance", "Msg": "KYC verify services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                    }
                });
            } catch (e2) {
                res.json({"Insurer": "Reliance", "Msg": e2.stack, "Status": "FAIL"});
            }
                    
                
        } catch (e1) {
            res.json({"Insurer": "Reliance", "Msg": e1.stack, "Status": "FAIL"});
        }
    });
    
    app.post('/kyc_details/reliance_verify_kyc_details_fetch', function (req, res) {
        try {
            let ObjRequest = req.body;
            let proposal_request = ObjRequest.Proposal_Request;
            let kyc_verify_request = "";
            let kyc_verify_response = "";
            let vehicle_registration_type = (proposal_request.vehicle_registration_type === undefined || proposal_request.vehicle_registration_type === "" || proposal_request.vehicle_registration_type === null) ? "" : proposal_request.vehicle_registration_type;
            vehicle_registration_type = (vehicle_registration_type === "") ? "I" : (vehicle_registration_type.toLowerCase() === "corporate" ? "C" : "I");
            let reliance_verify_service = (config.environment.name === "Production") ? "https://avenue.brobotinsurance.com/Verify_CKYC_Details" : "https://api.brobotinsurance.com/Verify_CKYC_Details";
//            vehicle_registration_type = "I";
            var user_kyc_no = (ObjRequest.KYC_Number === undefined || ObjRequest.KYC_Number === "" || ObjRequest.KYC_Number === null) ? "" : ObjRequest.KYC_Number;
            var cust_name = null;
            if (ObjRequest.Proposal_Request.middle_name === undefined || ObjRequest.Proposal_Request.middle_name === "" || ObjRequest.Proposal_Request.middle_name === null) {
                cust_name = ((ObjRequest.Proposal_Request.first_name === undefined || ObjRequest.Proposal_Request.first_name === "" || ObjRequest.Proposal_Request.first_name === null) ? "" : ObjRequest.Proposal_Request.first_name) + " " +
                        ((ObjRequest.Proposal_Request.last_name === undefined || ObjRequest.Proposal_Request.last_name === "" || ObjRequest.Proposal_Request.last_name === null) ? "" : ObjRequest.Proposal_Request.last_name);
            } else {
                cust_name = ((ObjRequest.Proposal_Request.first_name === undefined || ObjRequest.Proposal_Request.first_name === "" || ObjRequest.Proposal_Request.first_name === null) ? "" : ObjRequest.Proposal_Request.first_name) + " " +
                        ((ObjRequest.Proposal_Request.middle_name === undefined || ObjRequest.Proposal_Request.middle_name === "" || ObjRequest.Proposal_Request.middle_name === null) ? "" : ObjRequest.Proposal_Request.middle_name) + " " +
                        ((ObjRequest.Proposal_Request.last_name === undefined || ObjRequest.Proposal_Request.last_name === "" || ObjRequest.Proposal_Request.last_name === null) ? "" : ObjRequest.Proposal_Request.last_name);
            }
            let return_url = "https://www.policyboss.com/webhook/ckyc/ckyc_capture/"+ObjRequest.Insurer_Id + "/" + ObjRequest.PB_CRN;
            let req_txt = {
                "PAN": ObjRequest.Search_Type === "PAN" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID) : "",//(proposal_request.pan === undefined || proposal_request.pan === "" || proposal_request.pan === null) ? "" : proposal_request.pan,
                "DOB":  (proposal_request.birth_date && proposal_request.birth_date !== "") ? (moment(proposal_request.birth_date, "DD/MM/YYYY").format("DD-MM-YYYY")) : "",
                "CKYC": user_kyc_no,
                "MOBILE": (ObjRequest.Proposal_Request.mobile === undefined || ObjRequest.Proposal_Request.mobile === "" || ObjRequest.Proposal_Request.mobile === null) ? "" : ObjRequest.Proposal_Request.mobile,
                "PINCODE": "",
                "BIRTHYEAR": "",
                "ReturnURL": return_url,
                "UNIQUEID": ObjRequest.PB_CRN,
                "AADHAAR_No": ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "AADHAR" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID): "",
                "CIN": "",
                "VOTERID": ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "VOTERID" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID) : "",
                "DL_No": ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "DRIVINGLICENSE" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID) : "",
                "PASSPORT": ObjRequest.Search_Type.toUpperCase() === "PASSPORT" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID) : ""
            };
            if (ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "AADHAR") {
                req_txt['FULLNAME'] = cust_name;
                req_txt['GENDER'] = (ObjRequest.Proposal_Request.gender === undefined || ObjRequest.Proposal_Request.gender === "" || ObjRequest.Proposal_Request.gender === null) ? "" : ObjRequest.Proposal_Request.gender;
            }
            let sub_key = (config.environment.name === "Production") ? "08712cf5065e4d549e7111e098ce4254" : "9338b32e0ed447b68b257ccdc6cfb0bb";
            let args = {
                data: JSON.stringify(req_txt),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "Subscription-Key": sub_key
                }
            };
            kyc_verify_request = req_txt;
            let KYC_Status = "FETCH_SUCCESS";
            let kyc_id = 0;
            let token = null;
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let LM_Data = {
                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Company_Name": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type,//"PAN",
                "KYC_Request": kyc_verify_request,
                "KYC_Response": "",
                "ckyc_remarks": ""
            };
            try {
                var client = new Client();
                client.post(reliance_verify_service, args, function (data, response) {
                    if (data) {
                        kyc_verify_response = data;
                        LM_Data.KYC_Response = kyc_verify_response;
                        if (data.hasOwnProperty("success") && data.success === true) {
                            if (data.kyc_data && data.kyc_data.CKYC && data.kyc_data.CKYC.result && data.kyc_data.CKYC.result.PERSONAL_DETAILS && data.kyc_data.CKYC.result.PERSONAL_DETAILS.CKYC_NO && data.kyc_data.CKYC.result.PERSONAL_DETAILS.CKYC_NO !== "") {
                                LM_Data['KYC_Number'] = data.kyc_data.CKYC.result.PERSONAL_DETAILS.CKYC_NO;
                                LM_Data['KYC_Status'] = "VERIFY_SUCCESS";
                                if(vehicle_registration_type === "C"){
                                    LM_Data['KYC_Company_Name'] = data.kyc_data.CKYC.result.PERSONAL_DETAILS.FULLNAME ? data.kyc_data.CKYC.result.PERSONAL_DETAILS.FULLNAME : "";
                                }else{
                                	LM_Data['KYC_FullName'] = data.kyc_data.CKYC.result.PERSONAL_DETAILS.FULLNAME ? data.kyc_data.CKYC.result.PERSONAL_DETAILS.FULLNAME : "";
                                }
                                LM_Data['KYC_Ref_No'] = data.hasOwnProperty('Unique_Id') ? data.Unique_Id : "";
                            } else {
                                LM_Data['KYC_Status'] = "VERIFY_FAIL";
                                LM_Data['KYC_Ref_No'] = data.hasOwnProperty('Unique_Id') ? data.Unique_Id : "";
                                LM_Data['KYC_Redirect_URL'] = data.Endpoint_2_URL ? data.Endpoint_2_URL : ObjRequest.KYC_URL;
                            }
                        } else {
                            LM_Data['KYC_Status'] = "VERIFY_FAIL";
                            LM_Data['KYC_Ref_No'] = data.hasOwnProperty('Unique_Id') ? data.Unique_Id : "";
                            LM_Data['KYC_Redirect_URL'] = data.Endpoint_2_URL ? data.Endpoint_2_URL : ObjRequest.KYC_URL;
                        }
                        saveKYCDetails(ObjRequest, LM_Data, kyc_verify_request, kyc_verify_response);
                        res.json({"Insurer": "Reliance", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                    } else {
                        res.json({"Insurer": "Reliance", "Msg": "KYC verify services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                    }
                });
            } catch (e2) {
                res.json({"Insurer": "Reliance", "Msg": e2.stack, "Status": "FAIL"});
            }
        } catch (e1) {
            res.json({"Insurer": "Reliance", "Msg": e1.stack, "Status": "FAIL"});
        }
    });

    app.post('/kyc_details/webhook_verify_kyc_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            let crn = ObjRequest.PB_CRN - 0;
            let proposal_request = ObjRequest.hasOwnProperty('Proposal_Request') && ObjRequest.Proposal_Request ? ObjRequest.Proposal_Request : {};
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let query = {
                PB_CRN: crn,
                Insurer_Id: (ObjRequest.Insurer_Id === undefined || ObjRequest.Insurer_Id === "" || ObjRequest.Insurer_Id === null) ? "" : ObjRequest.Insurer_Id - 0,
                DOB: (proposal_request.birth_date === undefined || proposal_request.birth_date === "" || proposal_request.birth_date === null) ? "" : proposal_request.birth_date,
                Document_ID: (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                KYC_Status: {$nin: [null, "", "VERIFY_FAIL","VERIFY_SUCCESS", "CREATE_FAIL","CREATE_SUCCESS"]}
            };
            kyc_history.findOne(query).sort({Created_On: -1}).exec((err, data) => {
                try {
                    if (err) {
                        res.json({"Msg": err, "Status": "FAIL"});
                    } else {
                        let args = {
                            data: ObjRequest,
                            headers: {
                                "Content-Type": "application/json"
                            }
                        };
                        if (data && data.hasOwnProperty('_doc')) {
                            if (['FETCH_FAIL'].indexOf(data['_doc']['KYC_Status'] && data['_doc']['KYC_Status']) > -1) {
                                client.post(config.environment.weburl + "/kyc_details/verify_kyc_details_redirect", args, function (verify_kyc_details_redirect, response) {
                                    if (verify_kyc_details_redirect) {
                                        res.send(verify_kyc_details_redirect);
                                    } else {
                                        res.json({"Insurer": Insurer_Kyc_Key[ObjRequest.Insurer_Id].insurer_name, "Msg": "KYC verify services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                                    }
                                });
                            } else if (data['_doc']['KYC_Status'] && data['_doc']['KYC_Status'] === 'FETCH_SUCCESS') {
                                client.post(config.environment.weburl + "/kyc_details/"+(Insurer_Kyc_Key[ObjRequest.Insurer_Id].insurer_name).toLowerCase()+"_verify_kyc_details_fetch", args, function (verify_kyc_details_fetch, response) {
                                    if (verify_kyc_details_fetch) {
                                        res.send(verify_kyc_details_fetch);
                                    } else {
                                        res.json({"Insurer": Insurer_Kyc_Key[ObjRequest.Insurer_Id].insurer_name, "Msg": "KYC verify services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                                    }
                                });
                            }
                        } else {
                            res.json({"Insurer": Insurer_Kyc_Key[ObjRequest.Insurer_Id].insurer_name, "Msg": "No Records Found In kyc_histories", "Status": "FAIL"});
                        }
                    }
                } catch (err) {
                    res.json({"Insurer": Insurer_Kyc_Key[ObjRequest.Insurer_Id].insurer_name, "Msg": err.stack, "Status": "FAIL"});
                }
            });
        } catch (err) {
            res.json({"Insurer": Insurer_Kyc_Key[ObjRequest.Insurer_Id].insurer_name, "Msg": err.stack, "Status": "FAIL"});
        }
    });

    app.post('/kyc_details/verify_kyc_details_redirect', function (req, res) {
        try {
            let ObjRequest = req.body;
            var kyc_webhook_history = require('../models/kyc_webhook_history');
            let Insurer_Kyc_query = {
                9: {
                    query: {'Insurer_Id': ObjRequest.hasOwnProperty('Insurer_Id') && ObjRequest.Insurer_Id ? ObjRequest.Insurer_Id - 0 : 0,
                        PB_CRN: ObjRequest.hasOwnProperty('PB_CRN') && ObjRequest.PB_CRN ? ObjRequest.PB_CRN - 0 : 0,
                        'Request_Post.kyc_verified': 'true'
                    }
                },
                46: {
                    query: {'Insurer_Id':  ObjRequest.hasOwnProperty('Insurer_Id') && ObjRequest.Insurer_Id ? ObjRequest.Insurer_Id - 0 : 0,
                        'Request_Post.VISoF_KYC_Req_No': ObjRequest.hasOwnProperty('KYC_Ref_No') && ObjRequest.KYC_Ref_No ? ObjRequest.KYC_Ref_No.toString() : '',
                        'Request_Post.KYC_Status': '1'
                    }
                }
            };

            let query = Insurer_Kyc_query.hasOwnProperty(ObjRequest.Insurer_Id) && Insurer_Kyc_query[ObjRequest.Insurer_Id].hasOwnProperty('query') ? Insurer_Kyc_query[ObjRequest.Insurer_Id].query : '';
            kyc_webhook_history.find(query).sort({Created_On: -1}).exec(function (err, data) {
                try {
                    if (err) {
                        res.json({"Msg": err, "Status": "FAIL"});
                    } else {
                        if (data && data.length > 0 && data[0].hasOwnProperty('_doc')) {
                            var db_data = data[0]['_doc'];
                            let LM_Data = {
                                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID, //ObjRequest.Document_ID,
                                "KYC_Number": db_data['Request_Post'][Insurer_Kyc_Key[ObjRequest.Insurer_Id].ckycno],
                                "KYC_FullName": ((db_data['Request_Post'][Insurer_Kyc_Key[ObjRequest.Insurer_Id].first_name] ? db_data['Request_Post'][Insurer_Kyc_Key[ObjRequest.Insurer_Id].first_name] : "") + " " + (db_data['Request_Post'][Insurer_Kyc_Key[ObjRequest.Insurer_Id].middle_name] ? db_data['Request_Post'][Insurer_Kyc_Key[ObjRequest.Insurer_Id].middle_name] : "") + " " + (db_data['Request_Post'][Insurer_Kyc_Key[ObjRequest.Insurer_Id].last_name] ? db_data['Request_Post'][Insurer_Kyc_Key[ObjRequest.Insurer_Id].last_name] : "")).trim(),
                                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                                "KYC_PB_CRN": (ObjRequest.PB_CRN === undefined || ObjRequest.PB_CRN === "" || ObjRequest.PB_CRN === null) ? "" : ObjRequest.PB_CRN,
                                "KYC_Status": 'VERIFY_SUCCESS',
                                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type//"PAN",
                            };
                            saveKYCDetails(ObjRequest, LM_Data, '', '');
                            res.json({"Insurer": Insurer_Kyc_Key[ObjRequest.Insurer_Id].insurer_name, "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                        } else {
                            let LM_Data = {
                                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID, //ObjRequest.Document_ID,
                                "KYC_Number": "",
                                "KYC_FullName": "",
                                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                                "KYC_PB_CRN": (ObjRequest.PB_CRN === undefined || ObjRequest.PB_CRN === "" || ObjRequest.PB_CRN === null) ? "" : ObjRequest.PB_CRN,
                                "KYC_Status": 'VERIFY_FAIL',
                                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type//"PAN",
                            };
                            //saveKYCDetails(ObjRequest, LM_Data, '', '');
                            res.json({"Insurer": Insurer_Kyc_Key[ObjRequest.Insurer_Id].insurer_name, "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                        }
                    }
                } catch (err) {
                    res.json({"Insurer": Insurer_Kyc_Key[ObjRequest.Insurer_Id].insurer_name, "Msg": err.stack, "Status": "FAIL"});
                }
            });
        } catch (err) {
            res.json({"Insurer": Insurer_Kyc_Key[ObjRequest.Insurer_Id].insurer_name, "Msg": err.stack, "Status": "FAIL"});
        }
    });

    app.post('/kyc_details/liberty_fetch_kyc_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            let proposal_request = ObjRequest.Proposal_Request;
            let kyc_fetch_request = "";
            let kyc_fetch_response = "";
            var user_kyc_no = (ObjRequest.user_kyc_no === undefined || ObjRequest.user_kyc_no === "" || ObjRequest.user_kyc_no === null) ? "" : ObjRequest.user_kyc_no;
            let liberty_token_service = (config.environment.name === "Production") ? "https://libertykyc.auth.ap-south-1.amazoncognito.com/oauth2/token" : "https://libertykyc.auth.ap-south-1.amazoncognito.com/oauth2/token";
            let liberty_verify_service = (config.environment.name === "Production") ? "https://kyc.libertyinsurance.in/api/Generic/VerifyKYC" : "https://moem-uat.libertyinsurance.in/ckyc/api/Generic/VerifyKYC";
            let vehicle_registration_type = (proposal_request.vehicle_registration_type === undefined || proposal_request.vehicle_registration_type === "" || proposal_request.vehicle_registration_type === null) ? "" : proposal_request.vehicle_registration_type;
            vehicle_registration_type = (vehicle_registration_type === "") ? "I" : (vehicle_registration_type.toLowerCase() === "corporate" ? "C" : "I");
//            vehicle_registration_type = "I";
            let timestamp = (moment().unix() + new Date().getUTCMilliseconds()).toString();
            let req_txt = {
                "Aggregator_Program_Name": (config.environment.name === "Production") ? "PolicyBossLandmark" : "PolicyBossLandmark",
                "Aggregator_KYC_Req_No": (ObjRequest.PB_CRN === undefined || ObjRequest.PB_CRN === "" || ObjRequest.PB_CRN === null) ? "" : ("" + ObjRequest.PB_CRN + timestamp).toString(),
                "ProposerType": vehicle_registration_type,
                "FirstName": (ObjRequest.Proposal_Request.first_name === undefined || ObjRequest.Proposal_Request.first_name === "" || ObjRequest.Proposal_Request.first_name === null) ? "" : ObjRequest.Proposal_Request.first_name,
                "MiddleName": (ObjRequest.Proposal_Request.middle_name === undefined || ObjRequest.Proposal_Request.middle_name === "" || ObjRequest.Proposal_Request.middle_name === null) ? "" : ObjRequest.Proposal_Request.middle_name,
                "LastName": (ObjRequest.Proposal_Request.last_name === undefined || ObjRequest.Proposal_Request.last_name === "" || ObjRequest.Proposal_Request.last_name === null) ? "" : ObjRequest.Proposal_Request.last_name,
                "CompanyName": "",
                "Gender": (ObjRequest.Proposal_Request.gender === undefined || ObjRequest.Proposal_Request.gender === "" || ObjRequest.Proposal_Request.gender === null) ? "" : ObjRequest.Proposal_Request.gender,
                "DOB": (vehicle_registration_type === "I" && proposal_request.birth_date && proposal_request.birth_date !== "") ? (moment(proposal_request.birth_date, "DD/MM/YYYY").format("MM-DD-YYYY")) : "",
                "DOI": (vehicle_registration_type === "C" ? ((ObjRequest.date_of_incorporation === undefined || ObjRequest.date_of_incorporation === "" || ObjRequest.date_of_incorporation === null) ? "" : (moment(ObjRequest.date_of_incorporation, "DD/MM/YYYY").format("MM-DD-YYYY"))) : ""),
                "MobileNo": (ObjRequest.Proposal_Request.mobile === undefined || ObjRequest.Proposal_Request.mobile === "" || ObjRequest.Proposal_Request.mobile === null) ? "" : ObjRequest.Proposal_Request.mobile,
                "Email": (ObjRequest.Proposal_Request.email === undefined || ObjRequest.Proposal_Request.email === "" || ObjRequest.Proposal_Request.email === null) ? "" : ObjRequest.Proposal_Request.email,
                "ProposerPAN": ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "PAN" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : (ObjRequest.Document_ID)): "",
                "ProposerAadhaarNumber": ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "AADHAR" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : (ObjRequest.Document_ID.substr(ObjRequest.Document_ID.length - 4))): "", //"last 4 digits of aadhar",
                "ProposerCKYCNo": user_kyc_no,
                "Other_Add_FLD1": "",
                "Other_Add_FLD2": "",
                "Other_Add_FLD3": "",
                "Other_Add_FLD4": "",
                "Other_Add_FLD5": "",
                "Other_Add_FLD6": ""
            };
            let username = (config.environment.name === "Production") ? "7vo4vc9of4siainug2c38td8pm" : "7vo4vc9of4siainug2c38td8pm";
            let password = (config.environment.name === "Production") ? "1bho90pb9el9n8daqpua0srse1mnm86df9gb6ekna3s0t8pafg9d" : "1bho90pb9el9n8daqpua0srse1mnm86df9gb6ekna3s0t8pafg9d";
            let auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
            let buff_enc = new Buffer(JSON.stringify(req_txt));
            let data_enc = buff_enc.toString('base64');
            let req_txt_base64 = {
                "enc_request": data_enc
            };
            let args = {
                data: req_txt_base64,
                headers: {
                    "Authorization": auth,
                    "Content-Type": "application/json",
                    "Accept": "*/*"
                }
            };
            let token_args = {
                data: {
                    "grant_type": (config.environment.name === "Production") ? "client_credentials" : "client_credentials",
                    "client_id": (config.environment.name === "Production") ? "7vo4vc9of4siainug2c38td8pm" : "7vo4vc9of4siainug2c38td8pm",
                    "scope": (config.environment.name === "Production") ? "api/Generic" : "api/Generic"
                },
                headers: {
                    "Authorization": auth,
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "*/*"
                }
            };
            kyc_fetch_request = req_txt;
            let KYC_Status = "PENDING";
            let kyc_id = 0;
            let token = null;
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let LM_Data = {
                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,//ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type,//"PAN",
                "KYC_Request": kyc_fetch_request,
                "KYC_Response": "",
                "ckyc_remarks": ""
            };
            client.post(liberty_token_service, token_args, function (data1, response) {
                if (data1) {
                    if (data1.hasOwnProperty("access_token") && data1.access_token !== "" && data1.access_token !== null) {
                        token = data1.access_token;
                        try {
                            if (token) {
                                args.headers.Authorization = token;
                                var client1 = new Client();
                                client1.post(liberty_verify_service, args, function (data, response) {
                                    if (data && data.hasOwnProperty('enc_response')) {
                                        let enc_response = data.enc_response !== "" ? data.enc_response : "";
                                        let buff_dec = new Buffer(enc_response, 'base64');
                                        let data_dec = buff_dec.toString('ascii');
                                        data_dec = typeof data_dec === "string" ? JSON.parse(data_dec) : JSON.parse(JSON.stringify(data_dec));
                                        kyc_fetch_response = data_dec;
                                        LM_Data.KYC_Response = kyc_fetch_response;
                                        if (data_dec.hasOwnProperty("KYC_Status") && data_dec.KYC_Status === "1" && data_dec.KYC_Remark === "OK") {
                                            LM_Data['KYC_Number'] = (data_dec.hasOwnProperty("IC_KYC_No")) ? data_dec.IC_KYC_No : "";
                                            LM_Data['KYC_Status'] = "FETCH_SUCCESS";
                                            //LM_Data['KYC_Doc_No'] = (data_dec.hasOwnProperty("ProposerPAN")) ? data_dec.ProposerPAN : ObjRequest.Document_ID;
                                            LM_Data['KYC_Ref_No'] = (data_dec.hasOwnProperty("Aggregator_KYC_Req_No")) ? data_dec.Aggregator_KYC_Req_No.toString() : "";
//                        ObjRequest.Quote_Id = LM_Data['KYC_Ref_No'];//future purpose
                                            LM_Data['KYC_FullName'] = (data_dec.hasOwnProperty("FirstName")) ? data_dec.FirstName.trim() : "";
                                            if (data_dec.hasOwnProperty("FirstName") && data_dec.FirstName && data_dec.hasOwnProperty("MiddleName") && data_dec.MiddleName && data_dec.hasOwnProperty("LastName") && data_dec.LastName) {
                                                LM_Data['KYC_FullName'] = (data_dec.FirstName.trim() + " " + data_dec.MiddleName.trim() + " " + data_dec.LastName.trim());
                                            } else if (data_dec.hasOwnProperty("FirstName") && data_dec.FirstName && data_dec.hasOwnProperty("LastName") && data_dec.LastName) {
                                                LM_Data['KYC_FullName'] = (data_dec.FirstName.trim() + " " + data_dec.LastName.trim());
                                            }
                                        } else {
                                            LM_Data['KYC_Status'] = "FETCH_FAIL";
                                            LM_Data['KYC_Number'] = (data_dec.hasOwnProperty("IC_KYC_No")) ? data_dec.IC_KYC_No : "";
                                            LM_Data['KYC_Ref_No'] = (data_dec.hasOwnProperty("Aggregator_KYC_Req_No")) ? data_dec.Aggregator_KYC_Req_No.toString() : "";
                                            LM_Data['KYC_Redirect_URL'] = data_dec.IC_KYC_REG_URL ? data_dec.IC_KYC_REG_URL : ObjRequest.KYC_URL;
                                            if (data_dec.IC_KYC_REG_URL && (data_dec.IC_KYC_REG_URL.includes('This') || data_dec.IC_KYC_REG_URL.includes('already'))) {
                                                LM_Data['KYC_Redirect_URL'] = "";
                                                LM_Data['ckyc_remarks'] = data_dec.IC_KYC_REG_URL;
                                            }
                                        }
                                        saveKYCDetails(ObjRequest, LM_Data, kyc_fetch_request, kyc_fetch_response);
                                        res.json({"Insurer": "Liberty", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                                    } else {
                                        res.json({"Insurer": "Liberty", "Msg": "KYC fetch services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                                    }
                                });
                            } else {
                                res.json({"Insurer": "Liberty", "Msg": "Could Not Generate Token. Please try again later.", "Status": "FAIL"});
                            }
                        } catch (e2) {
                            res.json({"Insurer": "Liberty", "Msg": e2.stack, "Status": "FAIL"});
                        }
                    } else {
                        res.json({"Insurer": "Liberty", "Msg": "KYC-Token not generated. Please try again later.", "Status": "FAIL"});
                    }
                } else {
                    res.json({"Insurer": "Liberty", "Msg": "KYC-Token generation Live services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                }
            });
        } catch (e1) {
            res.json({"Insurer": "Liberty", "Msg": e1.stack, "Status": "FAIL"});
        }
    });
    app.post('/kyc_details/liberty_verify_kyc_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            let proposal_request = ObjRequest.Proposal_Request;
            let kyc_verify_request = "";
            let kyc_verify_response = "";
            var user_kyc_no = (ObjRequest.user_kyc_no === undefined || ObjRequest.user_kyc_no === "" || ObjRequest.user_kyc_no === null) ? "" : ObjRequest.user_kyc_no;
            let liberty_token_service = (config.environment.name === "Production") ? "https://libertykyc.auth.ap-south-1.amazoncognito.com/oauth2/token" : "https://libertykyc.auth.ap-south-1.amazoncognito.com/oauth2/token";
            let liberty_verify_service = (config.environment.name === "Production") ? "https://kyc.libertyinsurance.in/api/Generic/VerifyKYC" : "https://moem-uat.libertyinsurance.in/ckyc/api/Generic/Query";
            let vehicle_registration_type = (proposal_request.vehicle_registration_type === undefined || proposal_request.vehicle_registration_type === "" || proposal_request.vehicle_registration_type === null) ? "" : proposal_request.vehicle_registration_type;
            vehicle_registration_type = (vehicle_registration_type === "") ? "I" : (vehicle_registration_type.toLowerCase() === "corporate" ? "C" : "I");
//            vehicle_registration_type = "I";
            let timestamp = (moment().unix() + new Date().getUTCMilliseconds()).toString();
            let req_txt = {
                "Aggregator_Program_Name": (config.environment.name === "Production") ? "PolicyBossLandmark" : "PolicyBossLandmark",
                "Aggregator_KYC_Req_No": (ObjRequest.PB_CRN === undefined || ObjRequest.PB_CRN === "" || ObjRequest.PB_CRN === null) ? "" : ("" + ObjRequest.PB_CRN + timestamp).toString(),
                "ProposerType": vehicle_registration_type,
                "FirstName": (ObjRequest.Proposal_Request.first_name === undefined || ObjRequest.Proposal_Request.first_name === "" || ObjRequest.Proposal_Request.first_name === null) ? "" : ObjRequest.Proposal_Request.first_name,
                "MiddleName": (ObjRequest.Proposal_Request.middle_name === undefined || ObjRequest.Proposal_Request.middle_name === "" || ObjRequest.Proposal_Request.middle_name === null) ? "" : ObjRequest.Proposal_Request.middle_name,
                "LastName": (ObjRequest.Proposal_Request.last_name === undefined || ObjRequest.Proposal_Request.last_name === "" || ObjRequest.Proposal_Request.last_name === null) ? "" : ObjRequest.Proposal_Request.last_name,
                "CompanyName": "",
                "Gender": (ObjRequest.Proposal_Request.gender === undefined || ObjRequest.Proposal_Request.gender === "" || ObjRequest.Proposal_Request.gender === null) ? "" : ObjRequest.Proposal_Request.gender,
                "DOB": (vehicle_registration_type === "I" && proposal_request.birth_date && proposal_request.birth_date !== "") ? (moment(proposal_request.birth_date, "DD/MM/YYYY").format("MM-DD-YYYY")) : "",
                "DOI": (vehicle_registration_type === "C" ? ((ObjRequest.date_of_incorporation === undefined || ObjRequest.date_of_incorporation === "" || ObjRequest.date_of_incorporation === null) ? "" : (moment(ObjRequest.date_of_incorporation, "DD/MM/YYYY").format("MM-DD-YYYY"))) : ""),
                "MobileNo": (ObjRequest.Proposal_Request.mobile === undefined || ObjRequest.Proposal_Request.mobile === "" || ObjRequest.Proposal_Request.mobile === null) ? "" : ObjRequest.Proposal_Request.mobile,
                "Email": (ObjRequest.Proposal_Request.email === undefined || ObjRequest.Proposal_Request.email === "" || ObjRequest.Proposal_Request.email === null) ? "" : ObjRequest.Proposal_Request.email,
                "ProposerPAN": ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "PAN" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : (ObjRequest.Document_ID)): "",
                "ProposerAadhaarNumber": ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "AADHAR" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : (ObjRequest.Document_ID.substr(ObjRequest.Document_ID.length - 4))): "",
                "ProposerCKYCNo": "",
                "Other_Add_FLD1": "",
                "Other_Add_FLD2": "",
                "Other_Add_FLD3": "",
                "Other_Add_FLD4": "",
                "Other_Add_FLD5": "",
                "Other_Add_FLD6": ""
            };
            /*let req_txt = {
                "Aggregator_KYC_Req_No": ObjRequest.KYC_Ref_No,
                "IC_KYC_No": ObjRequest.KYC_Number,
                "Other_Add_FLD1": "",
                "Other_Add_FLD2": "",
                "Other_Add_FLD3": "",
                "Other_Add_FLD4": "",
                "Other_Add_FLD5": "",
                "Other_Add_FLD6": ""
            };*/
            let username = (config.environment.name === "Production") ? "7vo4vc9of4siainug2c38td8pm" : "7vo4vc9of4siainug2c38td8pm";
            let password = (config.environment.name === "Production") ? "1bho90pb9el9n8daqpua0srse1mnm86df9gb6ekna3s0t8pafg9d" : "1bho90pb9el9n8daqpua0srse1mnm86df9gb6ekna3s0t8pafg9d";
            let auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
            console.log(auth);
            let buff_enc = new Buffer(JSON.stringify(req_txt));
            let data_enc = buff_enc.toString('base64');
            let req_txt_base64 = {
                "enc_request": data_enc
            };
            let args = {
                data: req_txt_base64,
                headers: {
                    "Authorization": auth,
                    "Content-Type": "application/json",
                    "Accept": "*/*"
                }
            };
            let token_args = {
                data: {
                    "grant_type": (config.environment.name === "Production") ? "client_credentials" : "client_credentials",
                    "client_id": (config.environment.name === "Production") ? "7vo4vc9of4siainug2c38td8pm" : "7vo4vc9of4siainug2c38td8pm",
                    "scope": (config.environment.name === "Production") ? "api/Generic" : "api/Generic"
                },
                headers: {
                    "Authorization": auth,
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "*/*"
                }
            };
            kyc_verify_request = req_txt;
            let KYC_Status = "VERIFY_FAIL";
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let LM_Data = {
                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type,//"PAN",
                "KYC_Request": kyc_verify_request,
                "KYC_Response": "",
                "ckyc_remarks": ""
            };
            client.post(liberty_token_service, token_args, function (data1, response) {
                if (data1) {
                    if (data1.hasOwnProperty("access_token") && data1.access_token !== "" && data1.access_token !== null) {
                        token = data1.access_token;
                        try {
                            if (token) {
                                args.headers.Authorization = token;
                                var client1 = new Client();
                                client1.post(liberty_verify_service, args, function (data, response) {
                                    if (data && data.hasOwnProperty('enc_response')) {
                                        let enc_response = data.enc_response !== "" ? data.enc_response : "";
                                        let buff_dec = new Buffer(enc_response, 'base64');
                                        let data_dec = buff_dec.toString('ascii');
                                        data_dec = typeof data_dec === "string" ? JSON.parse(data_dec) : JSON.parse(JSON.stringify(data_dec));
                                        kyc_verify_response = data_dec;
                                        LM_Data.KYC_Response = kyc_verify_response;
                                        if (data_dec.hasOwnProperty("KYC_Status") && data_dec.KYC_Status === "1" && data_dec.KYC_Remark === "OK") {
                                            LM_Data['KYC_Number'] = (data_dec.hasOwnProperty("IC_KYC_No")) ? data_dec.IC_KYC_No : "";
                                            LM_Data['KYC_Status'] = "VERIFY_SUCCESS";
                                            //LM_Data['KYC_Doc_No'] = (data_dec.hasOwnProperty("ProposerPAN")) ? data_dec.ProposerPAN : ObjRequest.Document_ID;
                                            LM_Data['KYC_Ref_No'] = (data_dec.hasOwnProperty("Aggregator_KYC_Req_No")) ? data_dec.Aggregator_KYC_Req_No.toString() : "";
//                        ObjRequest.Quote_Id = LM_Data['KYC_Ref_No'];//future purpose
                                            //LM_Data['KYC_FullName'] = (data_dec.hasOwnProperty("FirstName")) ? data_dec.FirstName.trim() : "";
                                            if (data_dec.hasOwnProperty("FirstName") && data_dec.FirstName && data_dec.hasOwnProperty("MiddleName") && data_dec.MiddleName && data_dec.hasOwnProperty("LastName") && data_dec.LastName) {
                                                LM_Data['KYC_FullName'] = (data_dec.FirstName.trim() + " " + data_dec.MiddleName.trim() + " " + data_dec.LastName.trim());
                                            } else if (data_dec.hasOwnProperty("FirstName") && data_dec.FirstName && data_dec.hasOwnProperty("LastName") && data_dec.LastName) {
                                                LM_Data['KYC_FullName'] = (data_dec.FirstName.trim() + " " + data_dec.LastName.trim());
                                            }

                                        } else {
                                            LM_Data['KYC_Status'] = "VERIFY_FAIL";
                                            LM_Data['KYC_Ref_No'] = (data_dec.hasOwnProperty("Aggregator_KYC_Req_No")) ? data_dec.Aggregator_KYC_Req_No.toString() : "";
                                            LM_Data['KYC_Redirect_URL'] = data_dec.IC_KYC_REG_URL ? data_dec.IC_KYC_REG_URL : ObjRequest.KYC_URL;
                                            if (data_dec.IC_KYC_REG_URL && (data_dec.IC_KYC_REG_URL.includes('This') || data_dec.IC_KYC_REG_URL.includes('already'))) {
                                                LM_Data['KYC_Redirect_URL'] = "";
                                                LM_Data['ckyc_remarks'] = data_dec.IC_KYC_REG_URL;
                                            }
                                        }
                                        saveKYCDetails(ObjRequest, LM_Data, kyc_verify_request, kyc_verify_response);
                                        res.json({"Insurer": "Liberty", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                                    } else {
                                        res.json({"Insurer": "Liberty", "Msg": "KYC fetch services failed due to technical issue. Please try again later.", "Status": "FAIL", "data": data});
                                    }
                                });
                            } else {
                                res.json({"Insurer": "Liberty", "Msg": "Could Not Generate Token. Please try again later.", "Status": "FAIL"});
                            }
                        } catch (e2) {
                            res.json({"Insurer": "Liberty", "Msg": e2.stack, "Status": "FAIL"});
                        }
                    } else {
                        res.json({"Insurer": "Liberty", "Msg": "KYC-Token not generated. Please try again later.", "Status": "FAIL"});
                    }
                } else {
                    res.json({"Insurer": "Liberty", "Msg": "KYC-Token generation Live services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                }
            });
        } catch (e1) {
            res.json({"Insurer": "Liberty", "Msg": e1.stack, "Status": "FAIL"});
        }
    });
    app.post('/kyc_webhook_history/kyc_webhook_history_save', function (req, res) {
        try {
            let ObjRequest = req.body;
            ObjRequest['Modified_On'] = new Date();
            let kyc_webhook_history_save = new kyc_webhook_history(ObjRequest);
            kyc_webhook_history_save.save(function (err, res1) {
                if (err) {
                    res.json({"Msg": err, "Status": "FAIL"});
                } else {
                    if(ObjRequest && ObjRequest.hasOwnProperty('Insurer_Id') &&[9, 46].indexOf(parseInt(ObjRequest['Insurer_Id'])) > -1){
                        let args = {
                            data: ObjRequest,
                            headers: {
                                "Content-Type": "application/json"
                            }
                        };
                        var Client = require('node-rest-client').Client;
                        var client = new Client();
                        client.post(config.environment.weburl + "/kyc_details/update_kyc_history", args, function (update_kyc_history, response) {
                            if (update_kyc_history) {
                                console.error('/kyc_details/update_kyc_history', update_kyc_history);
                            }
                        });
                    }
                    ;
                    res.json({"Msg": res1, "Status": "Success"});
                }
            });
        } catch (ex) {
            console.error('Exception', '/kyc_webhook_history/kyc_webhook_history_save', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/kyc_details/digit_create_kyc_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            if (ObjRequest.Doc1 !== undefined && ObjRequest.Doc1 !== "" && ObjRequest.Doc1 !== null) {
                res.json({"Insurer": "DIGIT", "Msg": {"KYC_Status": "CREATE_SUCCESS", "Document_Path": ObjRequest.Doc1}, "Status": "CREATE_SUCCESS"});
            } else if (ObjRequest.Doc2 !== undefined && ObjRequest.Doc2 !== "" && ObjRequest.Doc2 !== null) {
                res.json({"Insurer": "DIGIT", "Msg": {"KYC_Status": "CREATE_SUCCESS", "Document_Path": ObjRequest.Doc2}, "Status": "CREATE_SUCCESS"});
            } else {
                res.json({"Insurer": "DIGIT", "Msg": {"KYC_Status": "CREATE_FAIL", "Document_Path": ""}, "Status": "CREATE_FAIL"});
            }
        } catch (err) {
            res.json({"Insurer": "DIGIT", "Msg": err.stack, "Status": "FAIL"});
        }
    });

    app.post('/kyc_details/digit_fetch_kyc_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            let vehicle_registration_type = (ObjRequest.Proposal_Request.vehicle_registration_type === undefined || ObjRequest.Proposal_Request.vehicle_registration_type === "" || ObjRequest.Proposal_Request.vehicle_registration_type === null) ? "" : ObjRequest.Proposal_Request.vehicle_registration_type;
            vehicle_registration_type = (vehicle_registration_type === "") ? "I" : (vehicle_registration_type.toLowerCase() === "corporate" ? "C" : "I");
            let policyNumber = '';
            let username = (config.environment.name === "Production") ? 95967257 : 51197558;
            let password = (config.environment.name === "Production") ? "Digit@123$" : "digit123";
			if (ObjRequest.Proposal_Request.hasOwnProperty('ss_id') && parseInt(ObjRequest.Proposal_Request.ss_id) === 0) {
                username = "83046227";
                password = "Digit@530$";
            }
            let kyc_fetch_request = "";
            let kyc_fetch_response = "";
            let args = {
                headers: {
                    "Authorization": "Basic " + new Buffer(username + ':' + password).toString('base64')
                }
            };
            let kyc_id = 0;
            let kyc_link = '';
            let KYC_Status = "FETCH_FAIL";
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let LM_Data = {
                "KYC_Doc_No":(ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type,//"PAN",
                "KYC_Request": kyc_fetch_request,
                "KYC_Response": "",
                "ckyc_remarks": ""
            };
            let kyc_status_url = ((config.environment.name === "Production") ? "https://prod-qnb.godigit.com/digit/base/services/v1/kyc/status?policyNumber=" : "https://preprod-qnb.godigit.com/digit/base/services/v1/kyc/status?policyNumber=") + policyNumber;
            client.get(kyc_status_url, args, function (data, response) {
                if (data) {
                    kyc_fetch_response = data;
                    LM_Data.KYC_Response = kyc_fetch_response;
                    if (data.hasOwnProperty("kycVerificationStatus") && (data.kycVerificationStatus === "DONE" || data.kycVerificationStatus === "Skip")) {
                        LM_Data.KYC_Status = "FETCH_SUCCESS";
                        kyc_link = (data.hasOwnProperty("link")) ? data.link : "";
                        kyc_id = (data.hasOwnProperty("referenceId")) ? data.referenceId : "";
                        LM_Data.KYC_Number = kyc_id;
                    } else {
                        LM_Data.KYC_Status = "FETCH_FAIL";
                        kyc_link = (data.hasOwnProperty("link")) ? data.link : "";
                        LM_Data.KYC_Redirect_URL = kyc_link;
                        //kyc_id = (data.hasOwnProperty("referenceId")) ? data.referenceId : "";
                        if (data.hasOwnProperty("link") && data.link){
                           LM_Data.ckyc_remarks = "NA";
                        } else {
                            LM_Data.ckyc_remarks = data;
                        }
                    }
                    saveKYCDetails(ObjRequest, LM_Data, kyc_fetch_request, kyc_fetch_response);
                    res.json({"Insurer": "Digit", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                } else {
                    res.json({"Insurer": "Digit", "Msg": "KYC fetch services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                }
            });

        } catch (e1) {
            res.json({"Insurer": "Digit", "Msg": e1.stack, "Status": "FAIL"});
        }
    });

    app.post('/kyc_details/digit_verify_kyc_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            let kyc_verify_request = "";
            let kyc_verify_response = "";
            let user_kyc_no = (req.body.user_kyc_no === undefined || req.body.user_kyc_no === "" || req.body.user_kyc_no === null) ? "" : req.body.user_kyc_no;
            var username = ((config.environment.name === 'Production') ? "95967257" : "51197558");
            var password = ((config.environment.name === 'Production') ? "Digit@123$" : "digit123");
            if (ObjRequest.Proposal_Request.hasOwnProperty('ss_id') && parseInt(ObjRequest.Proposal_Request.ss_id) === 0) {
                username = "83046227";
                password = "Digit@530$";
            }
            let args = {
                headers: {
                    "Authorization": "Basic " + new Buffer(username + ':' + password).toString('base64')
                }
            };
            let KYC_Status = "VERIFY_FAIL";
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let LM_Data = {
                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type,//"PAN",
                "KYC_Request": kyc_verify_request,
                "KYC_Response": "",
                "ckyc_remarks": ""
            };
            //let kyc_verify_url = ((config.environment.name === 'Production') ? "https://prod-qnb.godigit.com/digit/base/services/v1/kyc/status?policyNumber=" : "https://preprod-qnb.godigit.com/digit/base/services/v1/kyc/status?policyNumber=") + user_kyc_no;
//            let kyc_verify_url = "https://prod-qnb.godigit.com/digit/base/services/v1/kyc/status?policyNumber="+user_kyc_no;
            let kyc_verify_url = ((config.environment.name === 'Production') ? "https://prod-qnb.godigit.com/digit/base/services/v1/kyc/status?policyNumber=" : "https://preprod-qnb.godigit.com/digit/base/services/v1/kyc/status?policyNumber=") + user_kyc_no;
            kyc_verify_request = kyc_verify_url;
            LM_Data.KYC_Request = kyc_verify_request;
			//let sleep = require('system-sleep');
            //sleep(3000);
            client.get(kyc_verify_url, args, function (data, response) {
                if (data) {
                    kyc_verify_response = data;
                    LM_Data.KYC_Response = kyc_verify_response;
                    if (data.hasOwnProperty("kycVerificationStatus") && (data.kycVerificationStatus === "DONE" || data.kycVerificationStatus === "Skip")) {
                        LM_Data.KYC_Status = "VERIFY_SUCCESS";
                        LM_Data.KYC_Number = data.policyNumber;
                    } else if (data.hasOwnProperty("link") && data.link) {
                        LM_Data.KYC_Status = "VERIFY_FAIL";
                        LM_Data.KYC_Number = data.policyNumber;
                        LM_Data.KYC_Redirect_URL = data.link;
//                        LM_Data.ckyc_remarks = data;
                        if (data.hasOwnProperty("link") && data.link) {
                            LM_Data.ckyc_remarks = "NA";
                        } else {
                            LM_Data.ckyc_remarks = data;
                        }
                    } else {
                        LM_Data.KYC_Status = "VERIFY_FAIL";
                        if (data.hasOwnProperty("link") && data.link) {
                            LM_Data.ckyc_remarks = "NA";
                        } else {
                            LM_Data.ckyc_remarks = data;
                        }
                    }
                    saveKYCDetails(ObjRequest, LM_Data, kyc_verify_request, kyc_verify_response);
                    res.json({"Insurer": "DIGIT", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                } else {
                    res.json({"Insurer": "DIGIT", "Msg": "KYC verify services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                }
            });
        } catch (e1) {
            res.json({"Insurer": "DIGIT", "Msg": e1.stack, "Status": "FAIL"});
        }
    });
    
    app.post('/kyc_details/icici_fetch_kyc_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            let cust_name = "";
            if (ObjRequest.Proposal_Request.middle_name === undefined || ObjRequest.Proposal_Request.middle_name === "" || ObjRequest.Proposal_Request.middle_name === null) {
                cust_name = ((ObjRequest.Proposal_Request.first_name === undefined || ObjRequest.Proposal_Request.first_name === "" || ObjRequest.Proposal_Request.first_name === null) ? "" : ObjRequest.Proposal_Request.first_name) + " " +
                        ((ObjRequest.Proposal_Request.last_name === undefined || ObjRequest.Proposal_Request.last_name === "" || ObjRequest.Proposal_Request.last_name === null) ? "" : ObjRequest.Proposal_Request.last_name);
            } else {
                cust_name = ((ObjRequest.Proposal_Request.first_name === undefined || ObjRequest.Proposal_Request.first_name === "" || ObjRequest.Proposal_Request.first_name === null) ? "" : ObjRequest.Proposal_Request.first_name) + " " +
                        ((ObjRequest.Proposal_Request.middle_name === undefined || ObjRequest.Proposal_Request.middle_name === "" || ObjRequest.Proposal_Request.middle_name === null) ? "" : ObjRequest.Proposal_Request.middle_name) + " " +
                        ((ObjRequest.Proposal_Request.last_name === undefined || ObjRequest.Proposal_Request.last_name === "" || ObjRequest.Proposal_Request.last_name === null) ? "" : ObjRequest.Proposal_Request.last_name);
            }
            let kyc_fetch_request = "";
            let kyc_fetch_response = "";
            let args = {
                data: "",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "Authorization": ""
                }
            };
            let args1 = {
                data: {
                    'grant_type': 'password',
                    'username': 'landmark',
                    'password': ((config.environment.name === 'Production') ? 'l@n&M@rk' : 'l@n!m@$k'),
                    'scope': 'esb-kyc',
                    'client_id': 'ro.landmark',
                    'client_secret': ((config.environment.name === 'Production') ? 'ro.l@n&M@rkcL!3nt' : 'ro.l@n!m@$k')
                },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            };
            function jsonToQueryString(json) {
                return  Object.keys(json).map(function (key) {
                    return encodeURIComponent(key) + '=' +
                            encodeURIComponent(json[key]);
                }).join('&');
            }
            args1.data = jsonToQueryString(args1.data);
            let KYC_Status = "PENDING";
            let token = null;
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let LM_Data = {
                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type,//"PAN",
                "KYC_Request": kyc_fetch_request,
                "KYC_Response": "",
                "ckyc_remarks": ""
            };
            let token_url = ((config.environment.name === 'Production') ? 'https://app9.icicilombard.com/Cerberus/connect/token' : 'https://ilesbsanity.insurancearticlez.com/cerberus/connect/token');
            client.post(token_url, args1, function (data1, response1) {
                if (data1) {
                    if (data1.hasOwnProperty("access_token") && data1.access_token !== "" && data1.access_token !== null) {
                        token = data1.access_token;
                        try {
                            if (token) {
                                let decoded = jwt.decode(token, secret, 'RS256');
                                let pbk_temp = decoded['pbk'].replaceAll('\r', '');
                                let pbk_final = pbk_temp.replaceAll('\n', '');
                                let pbk_final1 = pbk_final.replace('-----BEGIN PUBLIC KEY-----', '');
                                let pbk = pbk_final1.replace('-----END PUBLIC KEY-----', '');
                                let temp_doc = (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID;
                                let temp_dob = (ObjRequest.DOB === undefined || ObjRequest.DOB === "" || ObjRequest.DOB === null) ? "" : moment(ObjRequest.DOB, 'DD/MM/YYYY').format("DD-MM-YYYY");
                                let doc_number = RSAEncryption(pbk, temp_doc);
                                let dob = RSAEncryption(pbk, temp_dob);
                                let req_txt = {};
                                if (ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "AADHAR") {
                                    let temp_gender = (ObjRequest.Proposal_Request.gender === undefined || ObjRequest.Proposal_Request.gender === "" || ObjRequest.Proposal_Request.gender === null) ? "" : ObjRequest.Proposal_Request.gender;
                                    req_txt = {
                                    "correlationId": ObjRequest.Quote_Id,
                                    "certificate_type": "AADHAAR",
                                    "pep_flag": false,
                                        "aadhaar_details": {
                                            "aadhaar_number": doc_number,
                                            "full_name": cust_name,
                                            "gender": temp_gender,
                                            "dob": dob
                                        }
                                    };
                                } else if (ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "PAN") {
                                    req_txt = {
                                        "correlationId": ObjRequest.Quote_Id,
                                        "certificate_type": "PAN",
                                        "pep_flag": false,
                                    "pan_details": {
                                            "pan": doc_number,
                                        "dob": dob
                                    }
                                };
                                }
                                kyc_fetch_request = req_txt;
                                LM_Data.KYC_Request = kyc_fetch_request;
                                args.data = req_txt;
                                args.headers.Authorization = 'Bearer ' + token;
                                var client1 = new Client();
                                let kyc_fetch_url = ((config.environment.name === 'Production') ? 'https://online.icicilombard.com/ilservices/customer/v1/kyc/initiate' : 'https://ilesbsanity.insurancearticlez.com/ilservices/ilesb/v1/kyc/initiate');
                                client1.post(kyc_fetch_url, args, function (data, response) {
                                    if (data) {
                                        kyc_fetch_response = data;
                                        LM_Data.KYC_Response = kyc_fetch_response;
                                        if (data.hasOwnProperty("status") && data.status === true && data.hasOwnProperty("statusMessage") && data.statusMessage === "Success" && data.hasOwnProperty("kyc_details") && data.kyc_details) {
                                            if (data['kyc_details'].hasOwnProperty('ckyc_number') && data.kyc_details.ckyc_number) {
                                                LM_Data.KYC_Status = "FETCH_SUCCESS";
                                                LM_Data.KYC_Number = data.kyc_details.ckyc_number;
                                                //LM_Data.KYC_Doc_No = data.kyc_details.certificate_number;
                                                if (data.kyc_details.hasOwnProperty('full_name') && data.kyc_details.full_name) {
                                                    LM_Data.KYC_FullName = data.kyc_details.full_name;
                                                } else {
                                                    LM_Data.KYC_FullName = (data.kyc_details['middle_name'] === "" || data.kyc_details['middle_name'] === undefined) ? (data.kyc_details['first_name'] + " " + data.kyc_details['last_name']) : (data.kyc_details['first_name'] + " " + data.kyc_details['middle_name'] + " " + data.kyc_details['last_name']);
                                                }
                                                
                                                LM_Data.KYC_Ref_No = data.kyc_details.il_kyc_ref_no ? data.kyc_details.il_kyc_ref_no : ObjRequest.PB_CRN;
                                                LM_Data.ckyc_remarks = "NA";
                                            } else {
                                                LM_Data.KYC_Status = "FETCH_FAIL";
                                                if (data.kyc_details.hasOwnProperty('full_name') && data.kyc_details.full_name) {
                                                    LM_Data.KYC_FullName = data.kyc_details.full_name;
                                                } else {
                                                    LM_Data.KYC_FullName = (data.kyc_details['middle_name'] === "" || data.kyc_details['middle_name'] === undefined) ? (data.kyc_details['first_name'] + " " + data.kyc_details['last_name']) : (data.kyc_details['first_name'] + " " + data.kyc_details['middle_name'] + " " + data.kyc_details['last_name']);
                                                }
                                                //LM_Data.KYC_Doc_No = data.kyc_details.certificate_number;
                                                LM_Data.KYC_Ref_No = data.kyc_details.il_kyc_ref_no ? data.kyc_details.il_kyc_ref_no : ObjRequest.PB_CRN;
                                                LM_Data.ckyc_remarks = "NA";//LM_Data.ckyc_remarks = data;
                                            }
                                        } else {
                                            LM_Data.KYC_Status = "FETCH_FAIL";
                                            LM_Data.KYC_Ref_No = ObjRequest.PB_CRN;
                                            LM_Data.ckyc_remarks = "NA";//LM_Data.ckyc_remarks = data;
                                        }
                                        saveKYCDetails(ObjRequest, LM_Data, kyc_fetch_request, kyc_fetch_response);
                                        res.json({"Insurer": "ICICI", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                                    } else {
                                        res.json({"Insurer": "ICICI", "Msg": "KYC fetch services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                                    }
                                });
                            } else {
                                res.json({"Insurer": "ICICI", "Msg": "Could Not Generate Token. Please try again later.", "Status": "FAIL"});
                            }
                        } catch (e2) {
                            res.json({"Insurer": "ICICI", "Msg": e2.stack, "Status": "FAIL"});
                        }
                    } else {
                        res.json({"Insurer": "ICICI", "Msg": "KYC-Token not generated. Please try again later.", "Status": "FAIL"});
                    }
                } else {
                    res.json({"Insurer": "ICICI", "Msg": "KYC-Token generation services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                }
            });
        } catch (e1) {
            res.json({"Insurer": "ICICI", "Msg": e1.stack, "Status": "FAIL"});
        }
    });
    app.post('/kyc_details/icici_verify_kyc_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            let kyc_verify_request = "";
            let kyc_verify_response = "";
            var user_kyc_no = (ObjRequest.user_kyc_no === undefined || ObjRequest.user_kyc_no === "" || ObjRequest.user_kyc_no === null) ? "" : ObjRequest.user_kyc_no;
            let args = {
                data: "",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "Authorization": ""
                }
            };
            let args1 = {
                data: {
                    'grant_type': 'password',
                    'username': 'landmark',
                    'password': ((config.environment.name === 'Production') ? 'l@n&M@rk' : 'l@n!m@$k'),
                    'scope': 'esb-kyc',
                    'client_id': 'ro.landmark',
                    'client_secret': ((config.environment.name === 'Production') ? 'ro.l@n&M@rkcL!3nt' : 'ro.l@n!m@$k')
                },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            };
            function jsonToQueryString(json) {
                return  Object.keys(json).map(function (key) {
                    return encodeURIComponent(key) + '=' +
                            encodeURIComponent(json[key]);
                }).join('&');
            }
            args1.data = jsonToQueryString(args1.data);
            let KYC_Status = "VERIFY_FAIL";
            let token = null;
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let LM_Data = {
                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type, //"PAN",
                "KYC_Request": kyc_verify_request,
                "KYC_Response": "",
                "ckyc_remarks": ""
            };
            let token_url = ((config.environment.name === 'Production') ? 'https://app9.icicilombard.com/Cerberus/connect/token' : 'https://ilesbsanity.insurancearticlez.com/cerberus/connect/token');
            client.post(token_url, args1, function (data1, response1) {
                if (data1) {
                    if (data1.hasOwnProperty("access_token") && data1.access_token !== "" && data1.access_token !== null) {
                        token = data1.access_token;
                        try {
                            if (token) {
                                let decoded = jwt.decode(token, secret, 'RS256');
                                let pbk_temp = decoded['pbk'].replaceAll('\r', '');
                                let pbk_final = pbk_temp.replaceAll('\n', '');
                                let pbk_final1 = pbk_final.replace('-----BEGIN PUBLIC KEY-----', '');
                                let pbk = pbk_final1.replace('-----END PUBLIC KEY-----', '');
                                let temp_dob = (ObjRequest.DOB === undefined || ObjRequest.DOB === "" || ObjRequest.DOB === null) ? "" : moment(ObjRequest.DOB, 'DD/MM/YYYY').format("DD-MM-YYYY");
                                let enc_user_kyc_no = RSAEncryption(pbk, user_kyc_no);
                                let dob = RSAEncryption(pbk, temp_dob);
                                let req_txt = {
                                    "correlationId": ObjRequest.Quote_Id,
                                    "certificate_type": "CKYC",
                                    "pep_flag": false,
                                    "ckyc_details": {
                                        "ckyc_number": enc_user_kyc_no,
                                        "dob": dob
                                    }
                                };
                                kyc_verify_request = req_txt;
                                LM_Data.KYC_Request = kyc_verify_request;
                                args.data = req_txt;
                                args.headers.Authorization = 'Bearer ' + token;
                                var client1 = new Client();
                                let kyc_fetch_url = ((config.environment.name === 'Production') ? 'https://online.icicilombard.com/ilservices/customer/v1/kyc/initiate' : 'https://ilesbsanity.insurancearticlez.com/ilservices/ilesb/v1/kyc/initiate');
                                client1.post(kyc_fetch_url, args, function (data, response) {
                                    if (data) {
                                        kyc_verify_response = data;
                                        LM_Data.KYC_Response = kyc_verify_response;
                                        if (data.hasOwnProperty("status") && data.status === true && data.hasOwnProperty("statusMessage") && data.statusMessage === "Success" && data.hasOwnProperty("kyc_details") && data.kyc_details) {
                                            if (data['kyc_details'].hasOwnProperty('ckyc_number') && data.kyc_details.ckyc_number) {
                                                LM_Data.KYC_Status = "VERIFY_SUCCESS";
                                                LM_Data.KYC_Number = data.kyc_details.ckyc_number;
                                                //LM_Data.KYC_Doc_No = data.kyc_details.certificate_number;
                                                if (data.kyc_details.hasOwnProperty('full_name') && data.kyc_details.full_name) {
                                                    LM_Data.KYC_FullName = data.kyc_details.full_name;
                                                } else {
                                                    LM_Data.KYC_FullName = (data.kyc_details['middle_name'] === "" || data.kyc_details['middle_name'] === undefined) ? (data.kyc_details['first_name'] + " " + data.kyc_details['last_name']) : (data.kyc_details['first_name'] + " " + data.kyc_details['middle_name'] + " " + data.kyc_details['last_name']);
                                                }
                                                LM_Data.KYC_Ref_No = data.kyc_details.il_kyc_ref_no ? data.kyc_details.il_kyc_ref_no : ObjRequest.PB_CRN;
                                                LM_Data.ckyc_remarks = "NA";
                                            } else {
                                                LM_Data.KYC_Status = "VERIFY_FAIL";
                                                if (data.kyc_details.hasOwnProperty('full_name') && data.kyc_details.full_name) {
                                                    LM_Data.KYC_FullName = data.kyc_details.full_name;
                                                } else {
                                                    LM_Data.KYC_FullName = (data.kyc_details['middle_name'] === "" || data.kyc_details['middle_name'] === undefined) ? (data.kyc_details['first_name'] + " " + data.kyc_details['last_name']) : (data.kyc_details['first_name'] + " " + data.kyc_details['middle_name'] + " " + data.kyc_details['last_name']);
                                                }
                                                //LM_Data.KYC_Doc_No = data.kyc_details.certificate_number;
                                                LM_Data.KYC_Ref_No = data.kyc_details.il_kyc_ref_no ? data.kyc_details.il_kyc_ref_no : ObjRequest.PB_CRN;
                                                LM_Data.ckyc_remarks = data;
                                            }
                                        } else {
                                            LM_Data.KYC_Status = "VERIFY_FAIL";
                                            LM_Data.KYC_Ref_No = ObjRequest.PB_CRN;
                                            LM_Data.ckyc_remarks = data;
                                        }
                                        saveKYCDetails(ObjRequest, LM_Data, kyc_verify_request, kyc_verify_response);
                                        res.json({"Insurer": "ICICI", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                                    } else {
                                        res.json({"Insurer": "ICICI", "Msg": "KYC fetch services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                                    }
                                });
                            } else {
                                res.json({"Insurer": "ICICI", "Msg": "Could Not Generate Token. Please try again later.", "Status": "FAIL"});
                            }
                        } catch (e2) {
                            res.json({"Insurer": "ICICI", "Msg": e2.stack, "Status": "FAIL"});
                        }
                    } else {
                        res.json({"Insurer": "ICICI", "Msg": "KYC-Token not generated. Please try again later.", "Status": "FAIL"});
                    }
                } else {
                    res.json({"Insurer": "ICICI", "Msg": "KYC-Token generation services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                }
            });
        } catch (e1) {
            res.json({"Insurer": "ICICI", "Msg": e1.stack, "Status": "FAIL"});
        }
    });

    app.post('/kyc_details/icici_create_kyc_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            var request = require('request');
            let proposal_request = ObjRequest.hasOwnProperty('Proposal_Request') && ObjRequest.Proposal_Request ? ObjRequest.Proposal_Request : {};
            let cust_name = "";
            if (ObjRequest.Proposal_Request.middle_name === undefined || ObjRequest.Proposal_Request.middle_name === "" || ObjRequest.Proposal_Request.middle_name === null) {
                cust_name = ((ObjRequest.Proposal_Request.first_name === undefined || ObjRequest.Proposal_Request.first_name === "" || ObjRequest.Proposal_Request.first_name === null) ? "" : ObjRequest.Proposal_Request.first_name) + " " +
                    ((ObjRequest.Proposal_Request.last_name === undefined || ObjRequest.Proposal_Request.last_name === "" || ObjRequest.Proposal_Request.last_name === null) ? "" : ObjRequest.Proposal_Request.last_name);
            } else {
                cust_name = ((ObjRequest.Proposal_Request.first_name === undefined || ObjRequest.Proposal_Request.first_name === "" || ObjRequest.Proposal_Request.first_name === null) ? "" : ObjRequest.Proposal_Request.first_name) + " " +
                    ((ObjRequest.Proposal_Request.middle_name === undefined || ObjRequest.Proposal_Request.middle_name === "" || ObjRequest.Proposal_Request.middle_name === null) ? "" : ObjRequest.Proposal_Request.middle_name) + " " +
                    ((ObjRequest.Proposal_Request.last_name === undefined || ObjRequest.Proposal_Request.last_name === "" || ObjRequest.Proposal_Request.last_name === null) ? "" : ObjRequest.Proposal_Request.last_name);
            }
            let vehicle_registration_type = (proposal_request.vehicle_registration_type === undefined || proposal_request.vehicle_registration_type === "" || proposal_request.vehicle_registration_type === null) ? "I" : (proposal_request.vehicle_registration_type.toLowerCase() === "corporate" ? "C" : "I");
            let kyc_fetch_request = "";
            let kyc_fetch_response = "";
            let KYC_Status = "PENDING";
            let token = null;
            if (ObjRequest.Doc1 !== undefined && ObjRequest.Doc1 !== "" && ObjRequest.Doc1 !== null && ObjRequest.Doc2 !== undefined && ObjRequest.Doc2 !== "" && ObjRequest.Doc2 !== null) {
                let LM_Data = {
                    "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                    "KYC_Number": "",
                    "KYC_FullName": " ",
                    "KYC_Ref_No": "",
                    "KYC_Redirect_URL": "",
                    "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                    "KYC_PB_CRN": ObjRequest.PB_CRN,
                    "KYC_Status": KYC_Status,
                    "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type,//"PAN",
                    "KYC_Request": kyc_fetch_request,
                    "KYC_Response": "",
                    "ckyc_remarks": ""
                };
                let icici_token_service_url = ((config.environment.name === 'Production') ? 'https://app9.icicilombard.com/Cerberus/connect/token' : 'https://ilesbsanity.insurancearticlez.com/cerberus/connect/token');
                var token_args = {
                    'method': 'POST',
                    'url': icici_token_service_url,
                    'headers': {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    form: {
                        'grant_type': 'password',
                        'username': 'landmark',
                        'password': ((config.environment.name === 'Production') ? 'l@n&M@rk' : 'l@n!m@$k'),
                        'scope': 'esb-kyc',
                        'client_id': 'ro.landmark',
                        'client_secret': ((config.environment.name === 'Production') ? 'ro.l@n&M@rkcL!3nt' : 'ro.l@n!m@$k')
                    }
                };
                let docyTypeCode = {
                    'PASSPORT': 'PASSPORT',
                    'VOTERID': 'VOTERID',
                    'PAN': 'PAN',
                    'DRIVINGLICENSE': 'DL',
                    'AADHAR': 'AADHAAR'
                };
                     request(token_args, function (error, data) {
                    if (data) {
                        if (data.body && JSON.parse(data.body).access_token !== "" && JSON.parse(data.body).access_token !== null) {
                            token = JSON.parse(data.body).access_token;
                            try {
                                if (token) {
                                    let decoded = jwt.decode(token, secret, 'RS256');
                                    let pbk_temp = decoded['pbk'].replaceAll('\r', '');
                                    let pbk_final = pbk_temp.replaceAll('\n', '');
                                    let pbk_final1 = pbk_final.replace('-----BEGIN PUBLIC KEY-----', '');
                                    let pbk = pbk_final1.replace('-----END PUBLIC KEY-----', '');
                                    let temp_doc = (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID;
                                    let temp_dob = (ObjRequest.DOB === undefined || ObjRequest.DOB === "" || ObjRequest.DOB === null) ? "" : moment(ObjRequest.DOB, 'DD/MM/YYYY').format("DD-MM-YYYY");
                                    // let doc_number = RSAEncryption(pbk, temp_doc);
                                    // console.log(RSAEncryption(pbk, "375301327399"));
                                    // let dob = RSAEncryption(pbk, temp_dob);
                                    // let req_txt = {};
                                    let ovd_url = ((config.environment.name === 'Production') ? "https://online.icicilombard.com/ilservices/customer/v1/kyc/ovd" : "https://ilesbsanity.insurancearticlez.com/ilservices/customer/v1/kyc/ovd");
                                    // var client1 = new Client();
                                    var options = {
                                        'method': 'POST',
                                        'url': ovd_url,
                                        'headers': {
                                            'Authorization': 'Bearer ' + token,
                                            "Content-Type": "application/json"
                                        },
                                        formData: {
                                            'mobile_number': '91'+ObjRequest.Mobile,
                                            'email': ObjRequest.Email,
                                            'is_poa_poi_same': "true",
                                            'poi[0].certificate_type': docyTypeCode[ObjRequest.Document_Type.toUpperCase().replace(/\s+/g, '')],
                                            'poi[0].document': {
                                                'value': fs.createReadStream(appRoot + ObjRequest.Doc1),        // fs.createReadStream(appRoot + ObjRequest.Doc1)
                                                'options': {
                                                    'filename': appRoot + ObjRequest.Doc1,
                                                    'contentType': null
                                                }
                                            },
                                            'poa[0].certificate_type': docyTypeCode[ObjRequest.Document_Type.toUpperCase().replace(/\s+/g, '')],
                                            'poa[0].document': {
                                                'value': fs.createReadStream(appRoot + ObjRequest.Doc2),
                                                'options': {
                                                    'filename': appRoot + ObjRequest.Doc2,
                                                    'contentType': null
                                                }
                                            },
                                            'correlationId': ObjRequest.Quote_Id,
                                            'customer_type': vehicle_registration_type//'I'
                                        }
                                    };
                                    kyc_fetch_request = JSON.stringify(options.formData);
                                    LM_Data.KYC_Request = kyc_fetch_request;
                                    console.log("req",LM_Data.KYC_Request);
                                    request(options, function (error, response) {
                                        if (response) {
                                            kyc_fetch_response = response.body ? JSON.stringify(response.body) : response;
                                            LM_Data.KYC_Response = kyc_fetch_response;
                                            let kyc_response = response.body ? JSON.parse(response.body) : "";
                                            if (response.hasOwnProperty("statusCode") && response.statusCode === 200 && response.hasOwnProperty("statusMessage") && response.statusMessage === "OK" && kyc_response.hasOwnProperty("kyc_details") && kyc_response['kyc_details']) {
                                                if (kyc_response['kyc_details'].hasOwnProperty('il_kyc_ref_no') && kyc_response['kyc_details']['il_kyc_ref_no']) {
                                                    LM_Data.KYC_Status = "VERIFY_SUCCESS";//"CREATE_SUCCESS";
                                                    //LM_Data.KYC_Number = kyc_response.kyc_details.il_kyc_ref_no;
                                                    if (kyc_response.kyc_details.hasOwnProperty('full_name') && kyc_response.kyc_details.full_name) {
                                                        LM_Data.KYC_FullName = kyc_response.kyc_details.full_name;
                                                    }
                                                    LM_Data.KYC_Ref_No = kyc_response.kyc_details.il_kyc_ref_no ? kyc_response.kyc_details.il_kyc_ref_no : ObjRequest.PB_CRN;
                                                    LM_Data.ckyc_remarks = "NA";
                                                } else {
                                                    LM_Data.KYC_Status = "CREATE_FAIL";
                                                    if (kyc_response.kyc_details.hasOwnProperty('full_name') && kyc_response.kyc_details.full_name) {
                                                        LM_Data.KYC_FullName = kyc_response.kyc_details.full_name;
                                                    } else {
                                                        if (kyc_response.kyc_details['first_name'] && kyc_response.kyc_details['last_name'])
                                                            LM_Data.KYC_FullName = (kyc_response.kyc_details['middle_name'] === "" || kyc_response.kyc_details['middle_name'] === undefined) ? (kyc_response.kyc_details['first_name'] + " " + kyc_response.kyc_details['last_name']) : (kyc_response.kyc_details['first_name'] + " " + kyc_response.kyc_details['middle_name'] + " " + kyc_response.kyc_details['last_name']);
                                                    }
                                                    LM_Data.KYC_Ref_No = kyc_response.kyc_details.il_kyc_ref_no ? kyc_response.kyc_details.il_kyc_ref_no : ObjRequest.PB_CRN;
//                                                    LM_Data.ckyc_remarks = kyc_fetch_response;
                                                }
                                            } else {
                                                LM_Data.KYC_Status = "CREATE_FAIL";
                                                LM_Data.KYC_Ref_No = ObjRequest.PB_CRN;
//                                                LM_Data.ckyc_remarks = kyc_fetch_response;
                                            }
                                            saveKYCDetails(ObjRequest, LM_Data, kyc_fetch_request, kyc_fetch_response);
                                            res.json({ "Insurer": "ICICI", "Msg": LM_Data, "Status": LM_Data.KYC_Status });
                                        } else {
                                            console.log("msg1:KYC create services failed due to technical issue. Please try again later." );
                                            res.json({ "Insurer": "ICICI", "Msg": "KYC create services failed due to technical issue. Please try again later.", "Status": "FAIL" });
                                        }
                                    });
                                } else {
                                     console.log("msg2: Could Not Generate Token. Please try again later.");
                                    res.json({ "Insurer": "ICICI", "Msg": "Could Not Generate Token. Please try again later.", "Status": "FAIL" });
                                }
                            } catch (e2) {
                                console.log("e2.stack");
                                res.json({ "Insurer": "ICICI", "Msg": e2.stack, "Status": "FAIL" });
                            }
                        } else {
                            console.log("KYC-Token net generated");
                            res.json({ "Insurer": "ICICI", "Msg": "KYC-Token not generated. Please try again later.", "Status": "FAIL" });
                        }
                    } else {
                        console.log("KYC-Token generation live services failed");
                        res.json({ "Insurer": "ICICI", "Msg": "KYC-Token generation Live services failed due to technical issue. Please try again later.", "Status": "FAIL" });
                    }
                })
            } else {
                console.log("Document not available");
                res.json({ "Insurer": "ICICI", "Msg": 'Document Not Available', "Status": "FAIL" });
            }
        } catch (el) {
            console.log("last e1.stack");
            res.json({ "Insurer": "ICICI", "Msg": el.stack, "Status": "FAIL" });
        }
    });

    app.post('/kyc_details/liberty_verify_kyc', function (req, res) {
        try {
            let ObjRequest = req.body;
            let bodyObj = {};
            for (let key in ObjRequest) {
                bodyObj[key] = ObjRequest[key];
            }
            let liberty_token_service = (config.environment.name === "Production") ? "https://libertykyc.auth.ap-south-1.amazoncognito.com/oauth2/token" : "";
            let liberty_verify_service = (config.environment.name === "Production") ? "https://kyc.libertyinsurance.in/api/Generic/VerifyKYC" : "https://moem-uat.libertyinsurance.in/ckyc/api/Generic/VerifyKYC";
            let username = (config.environment.name === "Production") ? "7vo4vc9of4siainug2c38td8pm" : "";
            let password = (config.environment.name === "Production") ? "1bho90pb9el9n8daqpua0srse1mnm86df9gb6ekna3s0t8pafg9d" : "";
            let auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
            let buff_enc = new Buffer(JSON.stringify(bodyObj));
            let data_enc = buff_enc.toString('base64');
            console.log(data_enc);
            let req_txt_base64 = {
                "enc_request": data_enc
            };
            let args = {
                data: req_txt_base64,
                headers: {
                    "Authorization": auth,
                    "Content-Type": "application/json",
                    "Accept": "/"
                }
            };
            let token_args = {
                data: {
                    "grant_type": (config.environment.name === "Production") ? "client_credentials" : "",
                    "client_id": (config.environment.name === "Production") ? "7vo4vc9of4siainug2c38td8pm" : "",
                    "scope": (config.environment.name === "Production") ? "api/Generic" : ""
                },
                headers: {
                    "Authorization": auth,
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "/"
                }
            };
            var Client = require('node-rest-client').Client;
            var client = new Client();
            client.post(liberty_token_service, token_args, function (data1, response) {
                if (data1) {
                    if (data1.hasOwnProperty("access_token") && data1.access_token !== "" && data1.access_token !== null) {
                        token = data1.access_token;
                        try {
                            if (token) {
                                args.headers.Authorization = token;
                                var client1 = new Client();
                                client1.post(liberty_verify_service, args, function (data, response) {
                                    if (data && data.hasOwnProperty('enc_response')) {
                                        let enc_response = data.enc_response !== "" ? data.enc_response : "";
                                        let buff_dec = new Buffer(enc_response, 'base64');
                                        let data_dec = buff_dec.toString('ascii');
                                        data_dec = typeof data_dec === "string" ? JSON.parse(data_dec) : JSON.parse(JSON.stringify(data_dec));
                                        res.json({"Insurer": "Liberty", "Msg": data_dec});
                                    } else {
                                        res.json({"Insurer": "Liberty", "Msg": data, "Status": "FAIL"});
                                    }
                                });
                            } else {
                                res.json({"Insurer": "Liberty", "Msg": data1, "Status": "FAIL"});
                            }
                        } catch (e2) {
                            res.json({"Insurer": "Liberty", "Msg": e2.stack, "Status": "FAIL"});
                        }
                    } else {
                        res.json({"Insurer": "Liberty", "Msg": data1, "Status": "FAIL"});
                    }
                } else {
                    res.json({"Insurer": "Liberty", "Msg": data1, "Status": "FAIL"});
                }
            });
        } catch (ex) {
            res.json({"Insurer": "Liberty", 'Status': 'Fail', 'Msg': ex.stack});
        }
    });
    app.post('/kyc_details/liberty_query_kyc', function (req, res) {
        try {
            let ObjRequest = req.body;
            let bodyObj = {};
            for (let key in ObjRequest) {
                bodyObj[key] = ObjRequest[key];
            }
            let liberty_token_service = (config.environment.name === "Production") ? "https://libertykyc.auth.ap-south-1.amazoncognito.com/oauth2/token" : "";
            let liberty_verify_service = (config.environment.name === "Production") ? "https://kyc.libertyinsurance.in/ckyc/api/Generic/Query" : " https://moem-uat.libertyinsurance.in/ckyc/api/Generic/Query";
            let username = (config.environment.name === "Production") ? "7vo4vc9of4siainug2c38td8pm" : "";
            let password = (config.environment.name === "Production") ? "1bho90pb9el9n8daqpua0srse1mnm86df9gb6ekna3s0t8pafg9d" : "";
            let auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
            let buff_enc = new Buffer(JSON.stringify(bodyObj));
            let data_enc = buff_enc.toString('base64');
            console.log(data_enc);
            let req_txt_base64 = {
                "enc_request": data_enc
            };
            let args = {
                data: req_txt_base64,
                headers: {
                    "Authorization": auth,
                    "Content-Type": "application/json",
                    "Accept": "/"
                }
            };
            let token_args = {
                data: {
                    "grant_type": (config.environment.name === "Production") ? "client_credentials" : "",
                    "client_id": (config.environment.name === "Production") ? "7vo4vc9of4siainug2c38td8pm" : "",
                    "scope": (config.environment.name === "Production") ? "api/Generic" : ""
                },
                headers: {
                    "Authorization": auth,
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "/"
                }
            };
            var Client = require('node-rest-client').Client;
            var client = new Client();
            client.post(liberty_token_service, token_args, function (data1, response) {
                if (data1) {
                    if (data1.hasOwnProperty("access_token") && data1.access_token !== "" && data1.access_token !== null) {
                        token = data1.access_token;
                        try {
                            if (token) {
                                args.headers.Authorization = token;
                                var client1 = new Client();
                                client1.post(liberty_verify_service, args, function (data, response) {
                                    if (data && data.hasOwnProperty('enc_response')) {
                                        let enc_response = data.enc_response !== "" ? data.enc_response : "";
                                        let buff_dec = new Buffer(enc_response, 'base64');
                                        let data_dec = buff_dec.toString('ascii');
                                        data_dec = typeof data_dec === "string" ? JSON.parse(data_dec) : JSON.parse(JSON.stringify(data_dec));
                                        res.json({"Insurer": "Liberty", "Msg": data_dec});
                                    } else {
                                        res.json({"Insurer": "Liberty", "Msg": data, "Status": "FAIL"});
                                    }
                                });
                            } else {
                                res.json({"Insurer": "Liberty", "Msg": data1, "Status": "FAIL"});
                            }
                        } catch (e2) {
                            res.json({"Insurer": "Liberty", "Msg": e2.stack, "Status": "FAIL"});
                        }
                    } else {
                        res.json({"Insurer": "Liberty", "Msg": data1, "Status": "FAIL"});
                    }
                } else {
                    res.json({"Insurer": "Liberty", "Msg": data1, "Status": "FAIL"});
                }
            });
        } catch (ex) {
            res.json({"Insurer": "Liberty", 'Status': 'Fail', 'Msg': ex.stack});
        }
    });
    app.get('/kyc_details/get_kyc_details', function (req, res) {
        try {
            let crn = req.query.crn ? parseInt(req.query.crn) : "";
            kyc_detail.find({"PB_CRN": crn}, function (err, dbData) {
                if (err) {
                    res.json({"Status": "Fail"});
                } else {
                    res.json({"Status": "Success", "Data": dbData});
                }
            });
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });

    app.get('/kyc_details/get_kyc_history', function (req, res) {
        try {
            let crn = req.query.crn ? parseInt(req.query.crn) : "";
            kyc_history.find({"PB_CRN": crn}).sort({Created_On: -1}).exec(function (err, dbData) {
                if (err) {
                    res.json({"Status": "Fail"});
                } else {
                    if (dbData) {
                        res.json({"Status": "Success", "Data": dbData});
                    } else {
                        res.json({"Status": "Fail", Msg: "No Data Available"});
                    }
                }
            });
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    
    app.get('/kyc_details/:crn/:type/:index', function (req, res) {
        try {
            var crn = req.params.crn ? parseInt(req.params.crn) : 0;
            var index = req.params.index ? parseInt(req.params.index) : "";
            var type = req.params.index ? req.params.type : "";
            kyc_history.find({"PB_CRN": crn}).sort({Created_On: -1}).exec(function (err, dbData) {
                try {
                    if (err) {
                        res.json({"Status": "Fail","Msg":err});
                    } else {
                        if (dbData && dbData.length > 0) {
                            if (type === "request") {
								return res.send('<pre>' + JSON.stringify(dbData[index]['_doc']['KYC_Request_Core'], undefined, 2) + '</pre>');
                                //res.json(dbData[index]['_doc']['KYC_Request_Core']);
                            } else {
								return res.send('<pre>' + JSON.stringify(dbData[index]['_doc']['KYC_Response_Core'], undefined, 2) + '</pre>');
                                //res.json(dbData[index]['_doc']['KYC_Response_Core']);
                            }
                        } else {
                            res.json({"Status": "Fail", Msg: "No Data Available"});
                        }
                    }
                } catch (ex) {
                    res.json({"Status": "Fail", "Msg": ex.stack});
                }
            });
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/kyc_details/dashboard_summary', function (req, res) {
        try {
            let now = moment().utcOffset("+05:30").startOf('Day');

            let fromDate = null;
            let toDate = null;
            let type = req.query['type'] || 'TODAY';
            if (type === 'TODAY') {
                fromDate = moment(now).format('YYYY-MM-D');
                toDate = moment(now).format('YYYY-MM-D');
			}
			else if(type === 'DAILY'){
                fromDate = moment(now).subtract(2, 'day').format('YYYY-MM-D');
                toDate = moment(now).subtract(1, 'day').format('YYYY-MM-D');
			}
			else if(type === 'MONTHLY'){				
                fromDate = moment(now).startOf('Month').format('YYYY-MM-D');
                toDate = moment(now).endOf('Month').format('YYYY-MM-D');
			}
			else if(type === 'CUSTOM'){
                let Req_From_Date = req.query['FromDate'] || '';
                let Req_To_Date = req.query['ToDate'] || '';
                if (Req_From_Date && Req_To_Date) {
                    fromDate = moment(Req_From_Date).utcOffset("+05:30").startOf('Day').format('YYYY-MM-D');
                    toDate = moment(Req_To_Date).utcOffset("+05:30").startOf('Day').format('YYYY-MM-D');
                }
            }

            var arrFrom = fromDate.split('-');
            var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);
            var arrTo = toDate.split('-');
            var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
            dateTo.setDate(dateTo.getDate() + 1);


            let agt_kyc = [
                {"$match": {
                        "PB_CRN": {"$gt": 0},
                        "Insurer_Id": {"$gt": 0},
                        "Created_On": {"$gte": dateFrom, "$lte": dateTo},
                        "KYC_Status": {"$in": ["FETCH_SUCCESS", "FETCH_FAIL", "VERIFY_SUCCESS"]}
                    }
                },
                {"$group": {
                        '_id': {
                            'Insurer_Id': "$Insurer_Id",
                            'KYC_Status': "$KYC_Status"
                        },
                        "PB_CRN_List": {
                            "$addToSet": "$PB_CRN"
                        },
                        'Kyc_Status_Count': {"$sum": 1}
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "Insurer_Id": "$_id.Insurer_Id",
                        "Kyc_Status_Count": 1,
                        "KYC_Status": "$_id.KYC_Status",
                        "PB_CRN_List_Count": {
                            $size: "$PB_CRN_List"
                        }
                    }
                },
                {
                    "$sort": {
                        Insurer_Id: 1,
                        KYC_Status: 1
                    }
                }
            ];
            let obj_kyc_summary = {
                "status": "pending",
                "err": "",
                "data": [],
                "query": agt_kyc
            };
            kyc_history.aggregate(agt_kyc).exec(function (err, dbAggkyc_history) {
                try {
                    if (err) {
                        obj_kyc_summary['status'] = 'err';
                        obj_kyc_summary['err'] = err;
                    } else {
                        obj_kyc_summary['status'] = 'success';
                        let obj_total = {
                            'Insurer': 'ALL',
                            'Insurer_Id': 'ALL',
                            'Kyc_Success_Total': 0,
                            'Kyc_Success_Unique': 0,
                            'Kyc_Fail_Total': 0,
                            'Kyc_Fail_Unique': 0,
                            'Kyc_Status_Unique': 0,
                            'Kyc_Success_Percentage': 0
                        };
                        let obj_final_kyc = {};

                        if (dbAggkyc_history) {
                            for (let k in dbAggkyc_history) {
                                let Insurer_Id = dbAggkyc_history[k]['Insurer_Id'];
                                if (obj_final_kyc.hasOwnProperty('Insurer_' + Insurer_Id) === false) {
                                    obj_final_kyc['Insurer_' + Insurer_Id] = {
                                        'Insurer': config.const_insurer_short[Insurer_Id] || 'NA',
                                        'Insurer_Id': Insurer_Id,
                                        'Kyc_Success_Total': 0,
                                        'Kyc_Success_Unique': 0,
                                        'Kyc_Fail_Total': 0,
                                        'Kyc_Fail_Unique': 0,
                                        'Kyc_Status_Unique': 0,
                                        'Kyc_Success_Percentage': 0
                                    };
                                }

                                if (dbAggkyc_history[k]['KYC_Status'] === 'FETCH_FAIL') {
                                    obj_final_kyc['Insurer_' + Insurer_Id]['Kyc_Fail_Unique'] = dbAggkyc_history[k]['PB_CRN_List_Count'];
                                    obj_final_kyc['Insurer_' + Insurer_Id]['Kyc_Fail_Total'] = dbAggkyc_history[k]['Kyc_Status_Count'];
                                    obj_total['Kyc_Fail_Unique'] += dbAggkyc_history[k]['PB_CRN_List_Count'];
                                    obj_total['Kyc_Fail_Total'] += dbAggkyc_history[k]['Kyc_Status_Count'];
                                }
								if([5,44,4].indexOf(dbAggkyc_history[k]['Insurer_Id'] - 0) > -1)
								{
									if (dbAggkyc_history[k]['KYC_Status'] === 'VERIFY_SUCCESS') {
										obj_final_kyc['Insurer_' + Insurer_Id]['Kyc_Success_Unique'] = dbAggkyc_history[k]['PB_CRN_List_Count'];
										obj_final_kyc['Insurer_' + Insurer_Id]['Kyc_Success_Total'] = dbAggkyc_history[k]['Kyc_Status_Count'];
										obj_total['Kyc_Success_Unique'] += dbAggkyc_history[k]['PB_CRN_List_Count'];
										obj_total['Kyc_Success_Total'] += dbAggkyc_history[k]['Kyc_Status_Count'];


										let Insurer_Total_Unique = obj_final_kyc['Insurer_' + Insurer_Id]['Kyc_Fail_Unique'] + obj_final_kyc['Insurer_' + Insurer_Id]['Kyc_Success_Unique'];
										obj_final_kyc['Insurer_' + Insurer_Id]['Kyc_Status_Unique'] = Insurer_Total_Unique;
										obj_total['Kyc_Status_Unique'] += Insurer_Total_Unique;
										obj_final_kyc['Insurer_' + Insurer_Id]['Kyc_Success_Percentage'] = Math.round(obj_final_kyc['Insurer_' + Insurer_Id]['Kyc_Success_Unique'] * 100 / Insurer_Total_Unique) + ' %';
									}
								}
								else
								{
									if (dbAggkyc_history[k]['KYC_Status'] === 'FETCH_SUCCESS') {
										obj_final_kyc['Insurer_' + Insurer_Id]['Kyc_Success_Unique'] = dbAggkyc_history[k]['PB_CRN_List_Count'];
										obj_final_kyc['Insurer_' + Insurer_Id]['Kyc_Success_Total'] = dbAggkyc_history[k]['Kyc_Status_Count'];
										obj_total['Kyc_Success_Unique'] += dbAggkyc_history[k]['PB_CRN_List_Count'];
										obj_total['Kyc_Success_Total'] += dbAggkyc_history[k]['Kyc_Status_Count'];


										let Insurer_Total_Unique = obj_final_kyc['Insurer_' + Insurer_Id]['Kyc_Fail_Unique'] + obj_final_kyc['Insurer_' + Insurer_Id]['Kyc_Success_Unique'];
										obj_final_kyc['Insurer_' + Insurer_Id]['Kyc_Status_Unique'] = Insurer_Total_Unique;
										obj_total['Kyc_Status_Unique'] += Insurer_Total_Unique;
										obj_final_kyc['Insurer_' + Insurer_Id]['Kyc_Success_Percentage'] = Math.round(obj_final_kyc['Insurer_' + Insurer_Id]['Kyc_Success_Unique'] * 100 / Insurer_Total_Unique) + ' %';
									}
								}
                            }
                            obj_total['Kyc_Success_Percentage'] = Math.round(obj_total['Kyc_Success_Unique'] * 100 / obj_total['Kyc_Status_Unique']) + ' %';
                            obj_final_kyc['Insurer_ALL'] = obj_total;
                            obj_kyc_summary['data'] = obj_final_kyc;
                        }
                    }
                } catch (ex) {
                    obj_kyc_summary['err'] = ex.stack;
                    obj_kyc_summary['status'] = 'exception';
                }
                res.json(obj_kyc_summary);
            });
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });

    app.post('/kyc_details/update_kyc_history', function (req, res) {
        try {
            let ObjRequest = req.body;
            let unique_id = ObjRequest.Request_Post[Insurer_Kyc_Key[ObjRequest.Insurer_Id].unique_no];
            ObjRequest['Modified_On'] = new Date();
            ObjRequest['Created_On'] = new Date();
            ObjRequest['KYC_Response_Core'] = ObjRequest.Request_Post ? ObjRequest.Request_Post : "";
            ObjRequest['KYC_Request_Core'] = "https://www.policyboss.com/webhook/ckyc/ckyc_capture/" + ObjRequest.Insurer_Id + "/" + unique_id;
            (ObjRequest['KYC_Response_Core'].hasOwnProperty(Insurer_Kyc_Key[ObjRequest.Insurer_Id].kyc_verified_node) && ObjRequest['KYC_Response_Core'][Insurer_Kyc_Key[ObjRequest.Insurer_Id].kyc_verified_node] === Insurer_Kyc_Key[ObjRequest.Insurer_Id].kyc_verified_value) ? (ObjRequest['KYC_Status'] = 'CREATE_SUCCESS') : (ObjRequest['KYC_Status'] = 'CREATE_FAIL');
            ObjRequest['KYC_Number'] = ObjRequest.Request_Post[Insurer_Kyc_Key[ObjRequest.Insurer_Id].kyc_no_node];
            ObjRequest['DOB'] = ObjRequest.Request_Post.hasOwnProperty(Insurer_Kyc_Key[ObjRequest.Insurer_Id].DOB) ? (ObjRequest.Request_Post[Insurer_Kyc_Key[ObjRequest.Insurer_Id].DOB].includes('-') ? (moment(ObjRequest.Request_Post[Insurer_Kyc_Key[ObjRequest.Insurer_Id].DOB], 'DD-MM-YYYY').format('DD/MM/YYYY')) : ObjRequest.Request_Post[Insurer_Kyc_Key[ObjRequest.Insurer_Id].DOB]) : '';

            var kyc_history1 = new kyc_history(ObjRequest);
            kyc_history1.save(function (err, res1) {
                if (err) {
                    res.json({"Msg": err, "Status": "FAIL"});
                } else {
                    res.json({"Msg": "Data Saved", "Status": "Success"});
                }
            });
        } catch (err) {
            res.json({"Status": "Fail", "Msg": err.stack});
        }
    });
    
    app.post('/kyc_details/united_fetch_kyc_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            let proposal_request = ObjRequest.Proposal_Request;
            let kyc_fetch_request = "";
            let kyc_verify_response = "";
            let united_fetch_service = (config.environment.name === "Production") ? "https://portal.uiic.in/UIICKYCFOROEMPROD/ekycconnect/kycconnect/verifykycNumber" : "https://portal.uiic.in/UIICKYCFOROEMPROD/ekycconnect/kycconnect/verifykycNumber";
            var cust_name = null;
            if (proposal_request.middle_name === undefined || proposal_request.middle_name === "" || proposal_request.middle_name === null) {
                cust_name = ((proposal_request.first_name === undefined || proposal_request.first_name === "" || proposal_request.first_name === null) ? "" : proposal_request.first_name) + " " +
                        ((proposal_request.last_name === undefined || proposal_request.last_name === "" || proposal_request.last_name === null) ? "" : proposal_request.last_name);
            } else {
                cust_name = ((proposal_request.first_name === undefined || proposal_request.first_name === "" || proposal_request.first_name === null) ? "" : proposal_request.first_name) + " " +
                        ((proposal_request.middle_name === undefined || proposal_request.middle_name === "" || proposal_request.middle_name === null) ? "" : proposal_request.middle_name) + " " +
                        ((proposal_request.last_name === undefined || proposal_request.last_name === "" || proposal_request.last_name === null) ? "" : proposal_request.last_name);
            }
            let vehicle_registration_type = (ObjRequest.Proposal_Request.vehicle_registration_type === undefined || ObjRequest.Proposal_Request.vehicle_registration_type === "" || ObjRequest.Proposal_Request.vehicle_registration_type === null) ? "I" : (ObjRequest.Proposal_Request.vehicle_registration_type.toLowerCase() === "corporate" ? "C" : "I");
            var user_kyc_no = (ObjRequest.KYC_Number === undefined || ObjRequest.KYC_Number === "" || ObjRequest.KYC_Number === null) ? "" : ObjRequest.KYC_Number;
            let timestamp = (moment().unix() + new Date().getUTCMilliseconds()).toString();
            let req_txt = {
                "oem_unique_identifier": timestamp,
                "ckyc_no": user_kyc_no,
                "customer_type": vehicle_registration_type,
                "customer_name": cust_name,
                "address1": "",
                "address2": "",
                "pincode": (proposal_request.permanent_pincode === undefined || proposal_request.permanent_pincode === "" || proposal_request.permanent_pincode === null) ? "" : proposal_request.permanent_pincode,
                "gender": (proposal_request.gender === undefined || proposal_request.gender === "" || proposal_request.gender === null) ? "" : proposal_request.gender,
                "dob": proposal_request.birth_date && proposal_request.birth_date !== "" ? proposal_request.birth_date : "",
                "email": (proposal_request.email === undefined || proposal_request.email === "" || proposal_request.email === null) ? "" : proposal_request.email,
                "mobile_no": (proposal_request.mobile === undefined || proposal_request.mobile === "" || proposal_request.mobile === null) ? "" : proposal_request.mobile,
                "aadhar_last_four_digits": ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "AADHAR" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : (ObjRequest.Document_ID.substr(ObjRequest.Document_ID.length - 4))) : "",
                "pan": ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "PAN" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID) : "",
                "tieup_name": "LandMark",
                "additional_field1": "",
                "additional_field2": "",
                "additional_field3": "",
                "additional_field4": ""
            };
            kyc_fetch_request = req_txt;
            let KYC_Status = "PENDING";
            var Client = require('node-rest-client').Client;
            let LM_Data = {
                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type, //"PAN",
                "KYC_Request": kyc_fetch_request,
                "KYC_Response": "",
                "ckyc_remarks": ""
            };
            let args = {
                data: JSON.stringify(req_txt),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "userid": (config.environment.name === "Production") ? "VUlJQ0tZQw==" : "VUlJQ0tZQw==",
                    "password": (config.environment.name === "Production") ? "S1lDUEFTU0AzMjE=" : "S1lDUEFTU0AzMjE="
                }
            };
            try {
                var client1 = new Client();
                client1.post(united_fetch_service, args, function (data, response) {
                    if (data) {
                        kyc_verify_response = data;
                        LM_Data.KYC_Response = kyc_verify_response;
                        if (data && data.hasOwnProperty("kyc_verification_status") && data.kyc_verification_status === "Y") {
                            LM_Data['KYC_Number'] = data.ckyc_no ? data.ckyc_no : "";
                            LM_Data['KYC_Status'] = "FETCH_SUCCESS";
                            LM_Data['KYC_FullName'] = data['customer_name'] ? data['customer_name'] : "";
                            LM_Data['KYC_Ref_No'] = data['oem_unique_identifier'];
                        } else {
                            LM_Data['KYC_Status'] = "FETCH_FAIL";
                            LM_Data['KYC_Ref_No'] = data['oem_unique_identifier'] ? data['oem_unique_identifier'] : "";
                            LM_Data['KYC_Redirect_URL'] = data.url ? data.url : ObjRequest.KYC_URL;
                        }
                        saveKYCDetails(ObjRequest, LM_Data, kyc_fetch_request, kyc_verify_response);
                        res.json({"Insurer": "United India", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                    } else {
                        res.json({"Insurer": "United India", "Msg": "KYC verify services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                    }
                });
            } catch (e2) {
                res.json({"Insurer": "United India", "Msg": e2.stack, "Status": "FAIL"});
            }
        } catch (e1) {
            res.json({"Insurer": "United India", "Msg": e1.stack, "Status": "FAIL"});
        }
    });
    app.post('/kyc_details/united_verify_kyc_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            let proposal_request = ObjRequest.Proposal_Request;
            let kyc_verify_request = "";
            let kyc_verify_response = "";
            let united_verify_service = (config.environment.name === "Production") ? "https://portal.uiic.in/UIICKYCFOROEMPROD/ekycconnect/kycconnect/verifykycNumber" : "https://portal.uiic.in/UIICKYCFOROEMPROD/ekycconnect/kycconnect/verifykycNumber";
            var cust_name = null;
            if (proposal_request.middle_name === undefined || proposal_request.middle_name === "" || proposal_request.middle_name === null) {
                cust_name = ((proposal_request.first_name === undefined || proposal_request.first_name === "" || proposal_request.first_name === null) ? "" : proposal_request.first_name) + " " +
                        ((proposal_request.last_name === undefined || proposal_request.last_name === "" || proposal_request.last_name === null) ? "" : proposal_request.last_name);
            } else {
                cust_name = ((proposal_request.first_name === undefined || proposal_request.first_name === "" || proposal_request.first_name === null) ? "" : proposal_request.first_name) + " " +
                        ((proposal_request.middle_name === undefined || proposal_request.middle_name === "" || proposal_request.middle_name === null) ? "" : proposal_request.middle_name) + " " +
                        ((proposal_request.last_name === undefined || proposal_request.last_name === "" || proposal_request.last_name === null) ? "" : proposal_request.last_name);
            }
            var user_kyc_no = (ObjRequest.KYC_Number === undefined || ObjRequest.KYC_Number === "" || ObjRequest.KYC_Number === null) ? "" : ObjRequest.KYC_Number;
            let req_txt = {
                "oem_unique_identifier": ObjRequest.KYC_Ref_No,
                "ckyc_no": user_kyc_no
            };
            kyc_verify_request = req_txt;
            let KYC_Status = "VERIFY_FAIL";
            var Client = require('node-rest-client').Client;
            let LM_Data = {
                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type, //"PAN",
                "KYC_Request": kyc_verify_request,
                "KYC_Response": "",
                "ckyc_remarks": ""
            };
            let args = {
                data: JSON.stringify(req_txt),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "*/*",
                    "userid": (config.environment.name === "Production") ? "VUlJQ0tZQw==" : "VUlJQ0tZQw==",
                    "password": (config.environment.name === "Production") ? "S1lDUEFTU0AzMjE=" : "S1lDUEFTU0AzMjE="
                }
            };
            try {
                var client1 = new Client();
                client1.post(united_verify_service, args, function (data, response) {
                    if (data) {
                        kyc_verify_response = data;
                        LM_Data.KYC_Response = kyc_verify_response;
                        if (data && data.hasOwnProperty("kyc_verification_status") && data.kyc_verification_status === "Y") {
                            LM_Data['KYC_Number'] = data.ckyc_no ? data.ckyc_no : "";
                            LM_Data['KYC_Status'] = "VERIFY_SUCCESS";
                            LM_Data['KYC_FullName'] = data['customer_name'] ? data['customer_name'] : "";
                            LM_Data['KYC_Ref_No'] = data['oem_unique_identifier'];
                        } else {
                            LM_Data['KYC_Status'] = "VERIFY_FAIL";
                            LM_Data['KYC_Ref_No'] = data['oem_unique_identifier'] ? data['oem_unique_identifier'] : "";
                            LM_Data['KYC_Redirect_URL'] = data.url ? data.url : ObjRequest.KYC_URL;
                        }
                        saveKYCDetails(ObjRequest, LM_Data, kyc_verify_request, kyc_verify_response);
                        res.json({"Insurer": "United India", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                    } else {
                        res.json({"Insurer": "United India", "Msg": "KYC verify services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                    }
                });
            } catch (e2) {
                res.json({"Insurer": "United India", "Msg": e2.stack, "Status": "FAIL"});
            }
        } catch (e1) {
            res.json({"Insurer": "United India", "Msg": e1.stack, "Status": "FAIL"});
        }
    });
    
    app.post('/kyc_details/kotak_fetch_kyc_details', function (req, res) {
    try {
        let ObjRequest = req.body;
        let proposal_request = ObjRequest.Proposal_Request;
        let kyc_fetch_request = "";
        let kyc_fetch_response = "";
        let KYC_Status = "PENDING";
        let LM_Data = {
            "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
            "KYC_Number": "",
            "KYC_FullName": "",
            "KYC_Ref_No": "",
            "KYC_Redirect_URL": "",
            "KYC_Insurer_ID": ObjRequest.Insurer_Id,
            "KYC_PB_CRN": ObjRequest.PB_CRN,
            "KYC_Status": KYC_Status,
            "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type, //"PAN",
            "KYC_Request": kyc_fetch_request,
            "KYC_Response": kyc_fetch_response,
            "ckyc_remarks": ""
        };

        let auth_service_req_txt = {
            "vLoginEmailId": (config.environment.name === "Production" ? "VUNtb3c0d1pDUGcrZjh4dmpEWHMvZz09" : "ZUN2RGJ6dkUveG1HTzk1Kzd1Z2ljZz09"),
            "vPassword": (config.environment.name === "Production" ? "VWxlQlZ3MUJuaHUwbnlnSDM2RHJ4UT09" : "Zk1ObTMvN3dmaWozNEFUSk5menovUT09")
        };
        let auth_args = {
            data: JSON.stringify(auth_service_req_txt),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "vRanKey": (config.environment.name === "Production" ? "2500007510762440" : "4658233666271180") //vRanKey //
            }
        };
        let TokenCode = "";
        let service_token_url = (config.environment.name === "Production" ? "https://api.kotakgeneralinsurance.com/KOTAK_FIG_NETBANKING_SERVICES/wsInvokeManagementServices.svc/Fn_Get_Service_Access_Token_For_User" : "https://kgibridgeuat.kotakmahindrageneralinsurance.com/KOTAK_FIG_NETBANKING_SERVICES/wsInvokeManagementServices.svc/Fn_Get_Service_Access_Token_For_User");
        var Client = require('node-rest-client').Client;
        var client_auth = new Client();
        client_auth.post(service_token_url, auth_args, function (auth_data, response1) {
            //console.log("kotak Authentication service token response **********", auth_data);
            if (auth_data) {
                if (auth_data.hasOwnProperty('vErrorMsg') && auth_data.vErrorMsg === "Success") {
                    TokenCode = auth_data.vTokenCode;
                    let PartnerRequestid = (ObjRequest.Quote_Id).split('-')[0];
                    let args_data = {
                        "PartnerBPOSLoginId": (config.environment.name === "Production" ? "3212290000" : "BP000001"),
                        "TokenId": "",
                        "PartnerRequestId": PartnerRequestid,
                        "ApplicationRefNumber": "BPOS",
                        "GetRecordType": "IND",
                        "InputIdType": "C",
                        "InputIdNo": (ObjRequest.hasOwnProperty('Document_ID') && ObjRequest.Document_ID) ? ObjRequest.Document_ID : "", //"FAGPS8388E",
                        "FirstName": proposal_request.first_name,
                        "MiddleName": proposal_request.middle_name,
                        "LastName": proposal_request.last_name,
                        "DateOfBirth": (ObjRequest.hasOwnProperty('DOB') && ObjRequest['DOB']) ? (moment(ObjRequest['DOB'], 'DD/MM/YYYY').format('DD-MM-YYYY')) : "",
                        "Gender": (proposal_request.hasOwnProperty('gender') && proposal_request['gender']) ? proposal_request['gender'] : "",
                        "ApplicationFormNo": null,
                        "APITag": null,
                        "KYCNumber": (ObjRequest.hasOwnProperty('KYC_Number') && ObjRequest['KYC_Number']) ? ObjRequest['KYC_Number'] : "",
                        "Pincode": "",
                        "BirthYear": "",
                        "CustomerId": "",
                        "ProposalNumber": (ObjRequest.hasOwnProperty('Proposal_Id') && ObjRequest['Proposal_Id']) ? ObjRequest['Proposal_Id'] : "",
                        "CustMobileNum": "",
                        "CustEmailId": (ObjRequest.hasOwnProperty('Email') && ObjRequest['Email']) ? ObjRequest['Email'] : "",
                        "SourceApplication": "BPOS",
                        "ClientCallBackURL": ""
                    };
                    //Note: From KOTAK mail  either birth date OR (birthyear & pincode is mandatory mobile no to pass empty)
                    //"Pincode": "",//proposal_request.permanent_pincode,
                    //"BirthYear": "",//(ObjRequest.hasOwnProperty('DOB') && ObjRequest['DOB']) ? (moment(ObjRequest['DOB'], 'DD/MM/YYYY').format('YYYY')) : "",
                    //"CustMobileNum": "",//(ObjRequest.hasOwnProperty('Mobile') && ObjRequest['Mobile']) ? ObjRequest['Mobile'] - 0 : "",
                    let fetch_service_url = (config.environment.name === "Production" ? "https://api.kotakgeneralinsurance.com/KOTAK_FIG_KYC_SERVICES/KYCService.svc/Fn_Get_CKYC_Data" : "https://kgibridgeuat.kotakmahindrageneralinsurance.com/KOTAK_FIG_KYC_SERVICES/KYCService.svc/Fn_Get_CKYC_Data");
                    kyc_fetch_request = args_data;
                    let args = {
                        data: JSON.stringify(args_data),
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "vTokenCode": TokenCode//"D2B83210-7AC1-4116-BED9-B996A53EBB88"
                        }
                    };
                    var client1 = new Client();
                    client1.post(fetch_service_url, args, function (data, response) {
                        if (data) {
                            //console.log("kotak_get_token_url response ********** data", data);
                            kyc_fetch_response = data;
                            LM_Data['KYC_Response']=kyc_fetch_response;
                            if (data.hasOwnProperty("KYCStatus") && data.KYCStatus === "CKYCSuccess") {
                                LM_Data['KYC_Number'] = (data.hasOwnProperty("KYCNumber") && data.KYCNumber) ? data.KYCNumber : "";
                                LM_Data['KYC_Status'] = "FETCH_SUCCESS";
                                LM_Data['KYC_Pan_No'] = (data.hasOwnProperty("KYCPAN")) ? data['KYCPAN'] : "";
                                LM_Data['KYC_Ref_No'] = (data.hasOwnProperty("TokenId")) ? data['TokenId'] : "";
                                LM_Data['KYC_FullName'] = (data.hasOwnProperty("KYCFullName")) ? data['KYCFullName'] : "";
                                LM_Data['KYC_Redirect_URL'] = (data.hasOwnProperty("RequestURL")) ? data['RequestURL'] : "";
                                LM_Data['KYC_PartnerRequestId'] = PartnerRequestid;
                            } else {
                                LM_Data['KYC_Status'] = "FETCH_FAIL";
                                LM_Data['KYC_Ref_No'] = (data.hasOwnProperty("TokenId")) ? data['TokenId'] : "";
                                LM_Data['KYC_Redirect_URL'] = (data.hasOwnProperty("RequestURL")) ? data['RequestURL'] : "";
                                LM_Data['KYC_PartnerRequestId'] = PartnerRequestid;
                                LM_Data['ckyc_remarks'] = data.hasOwnProperty("ExceptionErrorMsg") ? data.ExceptionErrorMsg : "";
                            }
                            saveKYCDetails(ObjRequest, LM_Data, kyc_fetch_request, kyc_fetch_response);
                            res.json({"Insurer": "KOTAK", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                        } else {
                            res.json({"Insurer": "KOTAK", "Msg": "KYC fetch services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                        }
                    });
//                                           
                }
            }
        });
    } catch (e1) {
        res.json({"Insurer": "KOTAK", "Msg": e1.stack, "Status": "FAIL"});
    }
});

    app.post('/kyc_details/kotak_verify_kyc_details', function (req, res) {
    try {
        let ObjRequest = req.body;
        let proposal_request = ObjRequest.Proposal_Request;
        let kyc_verify_request = "";
        let kyc_verify_response = "";
        let KYC_Status = "VERIFY_FAIL";
        let LM_Data = {
            "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
            "KYC_Number": "",
            "KYC_FullName": "",
            "KYC_Ref_No": ObjRequest.KYC_Ref_No,
            "KYC_Redirect_URL": "",
            "KYC_Insurer_ID": ObjRequest.Insurer_Id,
            "KYC_PB_CRN": ObjRequest.PB_CRN,
            "KYC_Status": KYC_Status,
            "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type, //"PAN",
            "KYC_Request": kyc_verify_request,
            "KYC_Response": kyc_verify_response,
            "ckyc_remarks": ""
        };
        let auth_service_req_txt = {
            "vLoginEmailId": (config.environment.name === "Production" ? "VUNtb3c0d1pDUGcrZjh4dmpEWHMvZz09" : "ZUN2RGJ6dkUveG1HTzk1Kzd1Z2ljZz09"),
            "vPassword": (config.environment.name === "Production" ? "VWxlQlZ3MUJuaHUwbnlnSDM2RHJ4UT09" : "Zk1ObTMvN3dmaWozNEFUSk5menovUT09")
        };
        let token_args = {
            data: JSON.stringify(auth_service_req_txt),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "vRanKey": (config.environment.name === "Production" ? "2500007510762440" : "4658233666271180") //vRanKey //
            }
        };
        let args_data = {
            "PartnerRequestId": ObjRequest.hasOwnProperty('Quote_Id') && ObjRequest.Quote_Id ? (ObjRequest.Quote_Id).split('-')[0] : "", //"20221115122222222221112421219",
            "TokenId": ObjRequest.KYC_Ref_No, //"786e6ae2-26f0-4e28-bc1a-3969529c3db8",
            "PartnerBPOSLoginId": (config.environment.name === "Production" ? "3212290000" : "BP000001")
        };
        let TokenCode = "";
        let service_token_url = (config.environment.name === "Production" ? "https://api.kotakgeneralinsurance.com/KOTAK_FIG_NETBANKING_SERVICES/wsInvokeManagementServices.svc/Fn_Get_Service_Access_Token_For_User" : "https://kgibridgeuat.kotakmahindrageneralinsurance.com/KOTAK_FIG_NETBANKING_SERVICES/wsInvokeManagementServices.svc/Fn_Get_Service_Access_Token_For_User");
        var Client = require('node-rest-client').Client;
        var client_auth = new Client();
        client_auth.post(service_token_url, token_args, function (auth_data, response1) {
            //console.log("kotak Authentication service token response **********", auth_data);
            if (auth_data) {
                if (auth_data.hasOwnProperty('vErrorMsg') && auth_data.vErrorMsg === "Success") {
                    TokenCode = auth_data.vTokenCode;
                    let args1 = {
                        data: JSON.stringify(args_data),
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "vTokenCode": TokenCode//"D2B83210-7AC1-4116-BED9-B996A53EBB88"
                        }
                    };

                    let verify_service_url = (config.environment.name === "Production" ? "https://api.kotakgeneralinsurance.com/KOTAK_FIG_KYC_SERVICES/KYCService.svc/Fn_Get_Verified_KYC_Data" : "https://kgibridgeuat.kotakmahindrageneralinsurance.com/KOTAK_FIG_KYC_SERVICES/KYCService.svc/Fn_Get_Verified_KYC_Data");
                    var Client = require('node-rest-client').Client;
                    var client = new Client();
                    kyc_verify_request = args_data;
                    client.post(verify_service_url, args1, function (data, response1) {
                        if (data) {
                            kyc_verify_response = data;
                            //console.log("kotak token args response **********", JSON.parse(data.CustomerJson));
                            if (data.hasOwnProperty("ErrorMessage") && data.ErrorMessage === "success") {
                                let res_custJson = JSON.parse(data.CustomerJson);
                                LM_Data['KYC_Number'] = (res_custJson.hasOwnProperty("KYCNumber") && res_custJson.KYCNumber) ? res_custJson.KYCNumber : "";
                                LM_Data['KYC_Status'] = "VERIFY_SUCCESS";
                                LM_Data['KYC_Pan_No'] = (res_custJson.hasOwnProperty("KYCPAN")) ? res_custJson['KYCPAN'] : "";
                                LM_Data['KYC_FullName'] = (res_custJson.hasOwnProperty("KYCFullName")) ? res_custJson['KYCFullName'] : "";
                                LM_Data['KYC_Request'] = kyc_verify_request;
                                LM_Data['KYC_Response'] = kyc_verify_response;
                            } else {
                                //LM_Data['KYC_Ref_No'] = (data.hasOwnProperty("proposal_id")) ? data.proposal_id : "";
                                //LM_Data['KYC_Redirect_URL'] = data.url ? data.url : "";
                                LM_Data['KYC_Status'] = "VERIFY_FAIL";
                                LM_Data['ckyc_remarks'] = data.hasOwnProperty('ErrorMessage') ? data.ErrorMessage : data;
                                LM_Data['KYC_Request'] = kyc_verify_request;
                                LM_Data['KYC_Response'] = kyc_verify_response;
                            }

                            saveKYCDetails(ObjRequest, LM_Data, kyc_verify_request, kyc_verify_response);
                            res.json({"Insurer": "KOTAK", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                        } else {
                            res.json({"Insurer": "KOTAK", "Msg": "KYC-Token generation services failed due to technical issue. Please try again later.", "Status": "FAIL"});
                        }
                    });
                }
            }
        });
    } catch (e1) {
        res.json({"Insurer": "KOTAK", "Msg": e1.stack, "Status": "FAIL"});
    }
});

 app.post('/kyc_details/newindia_fetch_kyc_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            let proposal_request = ObjRequest.Proposal_Request;
            let kyc_fetch_request = "";
            let kyc_fetch_response = "";
            let vehicle_registration_type = (ObjRequest.vehicle_registration_type === undefined || ObjRequest.vehicle_registration_type === "" || ObjRequest.vehicle_registration_type === null) ? "Individual" : (ObjRequest.vehicle_registration_type.toLowerCase() === "corporate" ? "Corporate" : "Individual");
            let return_url = "https://www.policyboss.com/webhook/ckyc/ckyc_capture/" + ObjRequest.Insurer_Id + "/" + ObjRequest.PB_CRN;
            let newindia_fetch_service = (config.environment.name === "Production") ? "https://b2b.newindia.co.in/B2B/initiateKycVerification" : "https://uatb2bug.newindia.co.in/B2B/initiateKycVerification";
            let user_kyc_no = (ObjRequest.KYC_Number === undefined || ObjRequest.KYC_Number === "" || ObjRequest.KYC_Number === null) ? "" : ObjRequest.KYC_Number;
            var cust_name = null;
            if (proposal_request.middle_name === undefined || proposal_request.middle_name === "" || proposal_request.middle_name === null) {
                cust_name = ((proposal_request.first_name === undefined || proposal_request.first_name === "" || proposal_request.first_name === null) ? "" : proposal_request.first_name) + " " +
                    ((proposal_request.last_name === undefined || proposal_request.last_name === "" || proposal_request.last_name === null) ? "" : proposal_request.last_name);
            } else {
                cust_name = ((proposal_request.first_name === undefined || proposal_request.first_name === "" || proposal_request.first_name === null) ? "" : proposal_request.first_name) + " " +
                    ((proposal_request.middle_name === undefined || proposal_request.middle_name === "" || proposal_request.middle_name === null) ? "" : proposal_request.middle_name) + " " +
                    ((proposal_request.last_name === undefined || proposal_request.last_name === "" || proposal_request.last_name === null) ? "" : proposal_request.last_name);
            }
            let req_txt = {
                "quoteNo": "",
                "policyHolCode": ObjRequest.Quote_Id ? ObjRequest.Quote_Id : "",
                "idNo": ObjRequest.Search_Type.toUpperCase().replace(/\s+/g, '') === "PAN" ? ((ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID) : "",
                "idType": "C",
                "dob": (proposal_request.birth_date && proposal_request.birth_date !== "" ? proposal_request.birth_date : ""),
                "appid": "MODEL1",
                "kycSource": "KYC_MODEL1",
                "workFlowId": "NIA_Agent_Led",
                "redirectUrl": return_url,
                "userId": "USROB",
                "mobileNo": (proposal_request.mobile === undefined || proposal_request.mobile === "" || proposal_request.mobile === null) ? "" : proposal_request.mobile,
                "pinCode": ""
            };
            let username = (config.environment.name === "Production") ? "Ckycekyc" : "GenericUserKyc";
            let password = (config.environment.name === "Production") ? "Ckycekyc#123" : "Gen#12345";
            let auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
            let args = {
                data: JSON.stringify(req_txt),
                headers: {
                    "Authorization": auth,
                    "Content-Type": "application/json",
                    "Accept": "*/*"
                }
            };
            kyc_fetch_request = req_txt;
            let KYC_Status = "PENDING";
            let kyc_id = 0;
            let token = null;
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let LM_Data = {
                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type, //"PAN",
                "KYC_Request": kyc_fetch_request,
                "KYC_Response": kyc_fetch_response,
                "ckyc_remarks": ""
            };
            client.post(newindia_fetch_service, args, function (data, response) {
                if (data) {
                    kyc_fetch_response = data;
                    LM_Data['KYC_Response']=kyc_fetch_response;
                    if (data.hasOwnProperty("errorCode") && data.hasOwnProperty("kycStatus") && data.errorCode === '0' && data.kycStatus === 'FOUND') {
                        LM_Data['KYC_Number'] = data.hasOwnProperty('ckycNumber') ? data['ckycNumber'] : "";
                        LM_Data['KYC_Status'] = "FETCH_SUCCESS";
                        LM_Data['KYC_FullName'] = data['firstname'] ? data['firstname'] : "";
                        LM_Data['KYC_FullName'] = data['middlename'] ? LM_Data['KYC_FullName'] + " " + data['middlename'] : "";
                        LM_Data['KYC_FullName'] = data['lastname'] ? LM_Data['KYC_FullName'] + " " + data['lastname'] : "";
                        LM_Data['KYC_Ref_No'] = data.hasOwnProperty('txnId') && data.txnId ? data.txnId : "";
                        LM_Data['ckyc_remarks'] = "NA";
                    } else {
                        LM_Data['KYC_Status'] = "FETCH_FAIL";
                        LM_Data['KYC_Ref_No'] = data.hasOwnProperty('txnId') && data.txnId ? data.txnId : "";
                        LM_Data['KYC_Redirect_URL'] = data.hasOwnProperty('linkUrl') ? data.linkUrl : ObjRequest.KYC_URL;
                        LM_Data['ckyc_remarks'] = data.hasOwnProperty('errorMsg') && data['errorMsg'] === "SUCCESS" ? "NA" : data['errorMsg'];
                    }
                    if (LM_Data.KYC_Redirect_URL){
                        LM_Data.ckyc_remarks = "NA";
                    }
                    saveKYCDetails(ObjRequest, LM_Data, kyc_fetch_request, kyc_fetch_response);
                    res.json({ "Insurer": "NewIndia", "Msg": LM_Data, "Status": LM_Data.KYC_Status });
                } else {
                    res.json({ "Insurer": "NewIndia", "Msg": "KYC verify services failed due to technical issue. Please try again later.", "Status": "FAIL" });
                }
            });
        } catch (e1) {
            res.json({ "Insurer": "NewIndia", "Msg": e1.stack, "Status": "FAIL" });
        }
    });
 app.post('/kyc_details/newindia_verify_kyc_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            let proposal_request = ObjRequest.Proposal_Request;
            let kyc_verify_request = "";
            let kyc_verify_response = "";
            let vehicle_registration_type = (ObjRequest.vehicle_registration_type === undefined || ObjRequest.vehicle_registration_type === "" || ObjRequest.vehicle_registration_type === null) ? "Individual" : (ObjRequest.vehicle_registration_type.toLowerCase() === "corporate" ? "Corporate" : "Individual");
            let newindia_verify_service = (config.environment.name === "Production") ? "https://b2b.newindia.co.in/B2B/Model1PrtnrRS/getPolicyHolDetails" : "https://uatb2bug.newindia.co.in/B2B/getPolicyHolDetails";
            let user_kyc_no = (ObjRequest.KYC_Number === undefined || ObjRequest.KYC_Number === "" || ObjRequest.KYC_Number === null) ? "" : ObjRequest.KYC_Number;
            var cust_name = null;
            if (proposal_request.middle_name === undefined || proposal_request.middle_name === "" || proposal_request.middle_name === null) {
                cust_name = ((proposal_request.first_name === undefined || proposal_request.first_name === "" || proposal_request.first_name === null) ? "" : proposal_request.first_name) + " " +
                    ((proposal_request.last_name === undefined || proposal_request.last_name === "" || proposal_request.last_name === null) ? "" : proposal_request.last_name);
            } else {
                cust_name = ((proposal_request.first_name === undefined || proposal_request.first_name === "" || proposal_request.first_name === null) ? "" : proposal_request.first_name) + " " +
                    ((proposal_request.middle_name === undefined || proposal_request.middle_name === "" || proposal_request.middle_name === null) ? "" : proposal_request.middle_name) + " " +
                    ((proposal_request.last_name === undefined || proposal_request.last_name === "" || proposal_request.last_name === null) ? "" : proposal_request.last_name);
            }
            let req_txt = {
                "partyCode": ObjRequest.Quote_Id ? ObjRequest.Quote_Id : "",
                "PRetCode": "0",
                "rolecode": "SUPERUSER",
                "stakeCode": "BROKER",
                "userCode": "POLICYBOSS"
            };
            let username = (config.environment.name === "Production") ? "Model1PrtnrRS" : "GenericUserKyc";
            let password = (config.environment.name === "Production") ? "Model1PrtnrRS@123" : "Gen#12345";
            let auth = 'Basic ' + new Buffer(username + ':' + password).toString('base64');
            kyc_verify_request = req_txt;
            let KYC_Status = "VERIFY_FAIL";
            let kyc_id = 0;
            let token = null;
            let LM_Data = {
                "KYC_Doc_No": (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                "KYC_Number": "",
                "KYC_FullName": "",
                "KYC_Ref_No": "",
                "KYC_Redirect_URL": "",
                "KYC_Insurer_ID": ObjRequest.Insurer_Id,
                "KYC_PB_CRN": ObjRequest.PB_CRN,
                "KYC_Status": KYC_Status,
                "KYC_Search_Type": (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type, //"PAN",
                "KYC_Request": kyc_verify_request,
                "KYC_Response": kyc_verify_response,
                "ckyc_remarks": ""
            };
            let request = require('request');
            let options = {
              'method': 'POST',
              'url': newindia_verify_service,
              'headers': {
                'Authorization': auth,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(req_txt)

            };
            request(options, function (error, data) {
                try {
                    if (error) {
                        res.json({"Insurer": "NewIndia", "Msg": error, "Status": "FAIL"});
                    }
                    if (data && data.statusCode === 200 || data.statusCode === '200') {
                        kyc_verify_response = data.body ? data.body : "";
                        LM_Data["KYC_Response"] = kyc_verify_response;
                        let newindia_verify_res = data.body ? (typeof(data.body) === "string" ? JSON.parse(data.body) : data.body) : data;
                        if (newindia_verify_res.hasOwnProperty("ekycStatus") && newindia_verify_res.ekycStatus === 'APPROVED') {
                            LM_Data['KYC_Number'] = newindia_verify_res.hasOwnProperty('ckycNumber') && newindia_verify_res['ckycNumber'] ? newindia_verify_res['ckycNumber'] : "";
                            LM_Data['KYC_Status'] = "VERIFY_SUCCESS";
                            LM_Data['KYC_FullName'] = newindia_verify_res['firstName'] ? newindia_verify_res['firstName'] : "" + " " + newindia_verify_res['midName'] ? newindia_verify_res['midName'] : "" + " " + newindia_verify_res['lastName'] ? newindia_verify_res['lastName'] : "";
                            LM_Data['KYC_Ref_No'] = newindia_verify_res.hasOwnProperty('txnId') && data.txnId ? data.txnId : "";
                            LM_Data['ckyc_remarks'] = "NA";
                        } else {
                            LM_Data['KYC_Status'] = "VERIFY_FAIL";
                            LM_Data['KYC_Ref_No'] = newindia_verify_res.hasOwnProperty('txnId') && newindia_verify_res.txnId ? data.txnId : "";
                            LM_Data['KYC_Redirect_URL'] = newindia_verify_res.hasOwnProperty('linkUrl') ? newindia_verify_res.linkUrl : ObjRequest.KYC_URL;
                            LM_Data['ckyc_remarks'] = newindia_verify_res.hasOwnProperty('errorMsg') && newindia_verify_res['errorMsg'] === "SUCCESS" ? "NA" : newindia_verify_res['errorMsg'];
                        }
                        if (LM_Data.KYC_Redirect_URL){
                            LM_Data.ckyc_remarks = "NA";
                        }
                        saveKYCDetails(ObjRequest, LM_Data, kyc_verify_request, kyc_verify_response);
                        res.json({"Insurer": "NewIndia", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                    } else {
                        kyc_verify_response = data.hasOwnProperty('statusMessage') ? data.statusCode + " - " + data.statusMessage + (data.body ? " - " + data.body : ""): (data.body ? " - " + data.body : "Service Error From Insurer Side.");
                        LM_Data['KYC_Status'] = "VERIFY_FAIL";
                        LM_Data['KYC_Ref_No'] = "";
                        LM_Data['KYC_Redirect_URL'] = "";
                        LM_Data['ckyc_remarks'] = data.hasOwnProperty('statusMessage') ? data.statusCode + " - " + data.statusMessage + (data.body ? " - " + data.body : ""): (data.body ? " - " + data.body : "Service Error From Insurer Side.");
                        saveKYCDetails(ObjRequest, LM_Data, kyc_verify_request, kyc_verify_response);
                        res.json({"Insurer": "NewIndia", "Msg": LM_Data, "Status": LM_Data.KYC_Status});
                    }
                } catch (err) {
                    res.json({"Insurer": "NewIndia", "Msg": err.stack, "Status": "FAIL"});
                }
            });
        } catch (e1) {
            res.json({ "Insurer": "NewIndia", "Msg": e1.stack, "Status": "FAIL" });
        }
    });
    function RSAEncryption(token, encrypted_data) {
        let key = new NodeRSA();
        key.setOptions({
            encryptionScheme: "pkcs1"
        });
        key.importKey(token, "pkcs8-public");
        const encrypted = key.encrypt(encrypted_data, "base64");
        return encrypted;
    }
    function saveKYCDetails(ObjRequest, LM_Data, kyc_request, kyc_response) {
        try {
            let user_kyc_no = (ObjRequest.user_kyc_no === undefined || ObjRequest.user_kyc_no === "" || ObjRequest.user_kyc_no === null) ? "" : ObjRequest.user_kyc_no;
            let cond = {
                'Insurer_Id': ObjRequest.Insurer_Id - 0,
                'PB_CRN': (ObjRequest.PB_CRN === undefined || ObjRequest.PB_CRN === "" || ObjRequest.PB_CRN === null) ? "" : ObjRequest.PB_CRN - 0
            };
            let setObj = {
                'KYC_Number': LM_Data.KYC_Number ? LM_Data.KYC_Number : (user_kyc_no ? user_kyc_no : ""),
                'KYC_Full_Name': LM_Data.KYC_FullName,
                'KYC_Status': LM_Data.KYC_Status,
                'Modified_On': new Date(),
                'KYC_URL': LM_Data.KYC_Redirect_URL,
                'Quote_Id': kyc_response.uniqueId ? kyc_response.uniqueId : ObjRequest.Quote_Id ? ObjRequest.Quote_Id : "",
                'KYC_Ref_No': LM_Data.KYC_Ref_No
            };
            if (ObjRequest.Verify_Search_Type !== undefined && ObjRequest.Verify_Search_Type !== "" && ObjRequest.Verify_Search_Type !== null) {
                setObj['Search_Type'] = ObjRequest.Verify_Search_Type;
            }
            if(LM_Data.KYC_Status.toLowerCase().includes("update")){
                setObj['Search_Type'] = "Update";
            }
            kyc_detail.update(cond, {$set: setObj}, function (err, users) {
                if (err) {
                    console.error("saveKYCDetails() - ",err);
                } else {
                }
            });
            let queryObj1 = {
                'PB_CRN': ObjRequest.PB_CRN ? ObjRequest.PB_CRN : "",
                'User_Data_Id': ObjRequest.User_Data_Id ? ObjRequest.User_Data_Id : "",
                'Insurer_Id': ObjRequest.Insurer_Id,
                'Product_Id': ObjRequest.Product_Id ? ObjRequest.Product_Id : "",
                'Document_Type': (ObjRequest.Document_Type === undefined || ObjRequest.Document_Type === "" || ObjRequest.Document_Type === null) ? "" : ObjRequest.Document_Type,
                'Document_ID': (ObjRequest.Document_ID === undefined || ObjRequest.Document_ID === "" || ObjRequest.Document_ID === null) ? "" : ObjRequest.Document_ID,
                'DOB': (ObjRequest.DOB === undefined || ObjRequest.DOB === "" || ObjRequest.DOB === null) ? "" : ObjRequest.DOB,
                'Full_Name':ObjRequest.hasOwnProperty('Proposal_Request') ? ( ObjRequest.Proposal_Request['middle_name'] === "" ? (ObjRequest.Proposal_Request['first_name'] + " " + ObjRequest.Proposal_Request['last_name']) : (ObjRequest.Proposal_Request['first_name'] + " " + ObjRequest.Proposal_Request['middle_name'] + " " + ObjRequest.Proposal_Request['last_name'])) :"",
                'KYC_Full_Name': LM_Data.KYC_FullName,
                'Mobile': (ObjRequest.Mobile === undefined || ObjRequest.Mobile === "" || ObjRequest.Mobile === null) ? "" : ObjRequest.Mobile - 0,
                'Email': (ObjRequest.Email === undefined || ObjRequest.Email === "" || ObjRequest.Email === null) ? "" : ObjRequest.Email,
                'KYC_Number': LM_Data.KYC_Number,
                'Search_Type': ObjRequest.Search_Type ? ObjRequest.Search_Type : "",
                'KYC_Status': LM_Data.KYC_Status,
                'Doc1': ObjRequest.Doc1 ? ObjRequest.Doc1 : "",
                'Doc1_Name': ObjRequest.Doc1_Name ? ObjRequest.Doc1_Name : "",
                'Doc2': ObjRequest.Doc2 ? ObjRequest.Doc2 : "",
                'Doc2_Name': ObjRequest.Doc2_Name ? ObjRequest.Doc2_Name : "",
                'Doc3': ObjRequest.Doc3 ? ObjRequest.Doc3 : "",
                'Doc3_Name': ObjRequest.Doc3_Name ? ObjRequest.Doc3_Name : "",
                'KYC_URL': LM_Data.KYC_Redirect_URL,
                'KYC_Ref_No': LM_Data.KYC_Ref_No,
                'Created_On': new Date(),
                'Modified_On': new Date(),
                'Proposal_Id': (ObjRequest.Proposal_Id === undefined || ObjRequest.Proposal_Id === "" || ObjRequest.Proposal_Id === null) ? "" : ObjRequest.Proposal_Id,
                'Quote_Id': (ObjRequest.Quote_Id === undefined || ObjRequest.Quote_Id === "" || ObjRequest.Quote_Id === null) ? "" : ObjRequest.Quote_Id,
                'KYC_Request_Core': kyc_request,
                'KYC_Response_Core': kyc_response,
                'KYC_Company_Name' : LM_Data.hasOwnProperty('KYC_Company_Name') ? LM_Data.KYC_Company_Name : ""
            };
            // var kyc_history1 = new kyc_history(queryObj1);
            if (LM_Data.KYC_Redirect_URL) {
                try {
                    let Client = require('node-rest-client').Client;
                    let client = new Client();
                    client.get(config.environment.shorten_url + '?longUrl=' + encodeURIComponent(LM_Data.KYC_Redirect_URL), function (urlData, urlResponse) {
                        if (urlData && urlData.Short_Url) {
                            queryObj1['KYC_Short_URL'] = urlData.Short_Url;
                            var kyc_history1 = new kyc_history(queryObj1);
                            kyc_history1.save(queryObj1, function (err, kyc_history_data) {
                                if (err) {
                                    console.error("saveKYCDetails() - ", err);
                                } else {
                                }
                            });
                        }
                    })
                } catch (e) {
                    console.error("saveKYCDetails() - ", e.stack);
                }
            } else{
                var kyc_history1 = new kyc_history(queryObj1);
                kyc_history1.save(queryObj1, function (err, kyc_history_data) {
                    if (err) {
                        console.error("saveKYCDetails() - ",err);
                    } else {
                    }
                });
            }
        } catch (e) {
            console.error("saveKYCDetails() - ",e.stack);
        }
    }
};