
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var util = require('util');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var Marine = require(appRoot + '/libs/Marine');
var fs = require('fs');
var config = require('config');
var moment = require('moment');
var config = require('config');

function TataAIGMarine() {

}
util.inherits(TataAIGMarine, Marine);

TataAIGMarine.prototype.lm_request_single = {};
TataAIGMarine.prototype.insurer_integration = {};
TataAIGMarine.prototype.insurer_addon_list = [];
TataAIGMarine.prototype.insurer = {};
TataAIGMarine.prototype.insurer_date_format = 'dd/mm/yyyy';
TataAIGMarine.prototype.const_insurer_suminsured = [500000, 700000, 1000000];

TataAIGMarine.prototype.insurer_product_api_pre = function () {

};

TataAIGMarine.prototype.insurer_product_field_process_pre = function () {
    console.error('insurer_product_api_pre');
    //    console.error(this.lm_request);
    //    console.error(this.prepared_request);
    //    console.error(this.processed_request);

    // this.processed_request['___mode_transport___'] = "Sea " + "& " + "Rail/Road";



    if (config.environment.name === 'Production') {
        this.prepared_request['rm_code'] = "1798857";
    } else {
        this.prepared_request['rm_code'] = "3962538";
    }
    this.processed_request["___rm_code___"] = this.prepared_request['rm_code'];

    this.processed_request["___billNumber___"] = this.lm_request['billNumber'] ? this.lm_request['billNumber'] : "";
    this.processed_request["___billDate___"] = this.lm_request['billDate'] ? this.lm_request['billDate'] : "";

    let Mode_transit = this.lm_request["mode_of_transit"];
    if (Mode_transit.includes("Air")) {
        this.processed_request['___mode_transport___'] = "Road/Rail/Air";

    } else if (Mode_transit.includes("Road")) {
        this.processed_request['___mode_transport___'] = "Rail/Road";

    } else if (Mode_transit.includes("Rail")) {
        this.processed_request['___mode_transport___'] = "Rail/Road";

    } else { }
    // ___kyc_no___	string	"80054272758505"

    var rateChange = {
        "ICC Air-TLO + SRCC": "0.05",
        "ITC 'A' + SRCC": "0.07",
        "ITC 'B' + SRCC": "0.05",
        "ITC 'C' + SRCC": "0.05"
    };

    this.prepared_request['Premiumratepercent'] = rateChange[this.processed_request['___Plan_Name___']];
    this.processed_request['___Premiumratepercent___'] = this.prepared_request['Premiumratepercent'];

    if (this.lm_request['method_type'] === 'Proposal') {
        // default 27AABCU9603R1ZN
        this.prepared_request["gstin"] = this.lm_request['gstin'] ? this.lm_request['gstin'] : "";
        this.processed_request["___gstin___"] = this.prepared_request["gstin"];
        this.prepared_request['kyc_age'] = this.lm_request['kyc_age'] ? this.lm_request['kyc_age'] : "";
        this.processed_request['___kyc_age___'] = this.prepared_request['kyc_age'];

        this.prepared_request['kyc_c_address'] = this.lm_request['kyc_c_address'] ? JSON.stringify(this.lm_request['kyc_c_address']) : {};
        this.processed_request['___kyc_c_address___'] = this.prepared_request['kyc_c_address'];

        this.prepared_request['kyc_p_address'] = this.lm_request['kyc_p_address'] ? JSON.stringify(this.lm_request['kyc_p_address']) : {};
        this.processed_request['___kyc_p_address___'] = this.prepared_request['kyc_p_address'];

        this.prepared_request['kyc_date'] = this.lm_request['kyc_date'] ? this.lm_request['kyc_date'] : "";
        this.processed_request['___kyc_date___'] = this.prepared_request['kyc_date'];

        this.prepared_request['kyc_registered_name'] = this.lm_request['kyc_registered_name'] ? this.lm_request['kyc_registered_name'] : "";
        this.processed_request['___kyc_registered_name___'] = this.prepared_request['kyc_registered_name'];

        this.prepared_request['kyc_success'] = this.lm_request['kyc_success'] ? this.lm_request['kyc_success'] : "";
        this.processed_request['___kyc_success___'] = this.prepared_request['kyc_success'];

        this.prepared_request['kyc_verified'] = this.lm_request['kyc_verified'] ? this.lm_request['kyc_verified'] : "";
        this.processed_request['___kyc_verified___'] = this.prepared_request['kyc_verified'];

        this.prepared_request['kyc_verified_at'] = this.lm_request['kyc_verified_at'] ? this.lm_request['kyc_verified_at'] : "";
        this.processed_request['___kyc_verified_at___'] = this.prepared_request['kyc_verified_at'];

        this.prepared_request['kyc_no'] = this.lm_request['kyc_no'] ? this.lm_request['kyc_no'] : "";
        this.processed_request['___kyc_no___'] = this.prepared_request['kyc_no'];

        this.prepared_request['kyc_ref_no'] = this.lm_request['kyc_ref_no'] ? this.lm_request['kyc_ref_no'] : "";
        this.processed_request['___kyc_ref_no___'] = this.prepared_request['kyc_ref_no'];

    }

    if (this.lm_request['method_type'] === 'Customer') {
        //proposer name

        this.prepared_request['permanent_address_1'] = this.lm_request['permanent_address_1'];
        this.processed_request['___permanent_address_1___'] = this.prepared_request['permanent_address_1'];

        let nameSplits = this.lm_request['contact_name'] ? this.lm_request['contact_name'].trim().split(/\s+/) : "";

        this.prepared_request['firstname'] = nameSplits[0] || "";
        this.processed_request['___first_name___'] = this.prepared_request['firstname'];

        this.prepared_request['Middlename'] = nameSplits && nameSplits.slice(1, -1).join(" ") || "";
        this.processed_request['___middle_name___'] = this.prepared_request['Middlename'];

        this.prepared_request['lastname'] = nameSplits[nameSplits.length - 1] || "";
        this.processed_request['___last_name___'] = this.prepared_request['lastname'];

        //pan 
        this.prepared_request['pan'] = this.lm_request['pan'] ? this.lm_request['pan'] : "";
        this.processed_request['___pan___'] = this.prepared_request['pan'];

        var description_Of_Packing = (this.lm_request['description_Of_Packing'] ? this.lm_request['description_Of_Packing'] : " new packing");
        this.prepared_request['description_Of_Packing'] = description_Of_Packing;
        this.processed_request['___description_Of_Packing___'] = this.prepared_request['description_Of_Packing'];

        this.prepared_request['lc_no'] = this.lm_request['LCNumber'] ? this.lm_request['LCNumber'] : "";
        this.processed_request['___lc_no___'] = this.prepared_request['lc_no'];

        // this.prepared_request['lc_desc'] = this.lm_request['LCDesc'] ? this.lm_request['LCDesc'] : "";
        // this.processed_request['___lc_desc___'] = this.prepared_request['lc_no'];

        this.prepared_request['consignee_name'] = this.lm_request['consignee_name'] ? this.lm_request['consignee_name'] : "";
        this.processed_request['___consignee_name___'] = this.prepared_request['consignee_name'];

        this.prepared_request['consignee_address'] = this.lm_request['consignee_address'] ? this.lm_request['consignee_address'] : "";
        this.processed_request['___consignee_address___'] = this.prepared_request['consignee_address'];

        this.prepared_request['ProformaInvoiceandDate'] = (this.lm_request['invoiceNumber'] && this.lm_request['invoiceDate']) ? this.lm_request['invoiceNumber'] + " " + this.lm_request['invoiceDate'] : " ";
        this.processed_request['___ProformaInvoiceandDate___'] = this.prepared_request['ProformaInvoiceandDate'];

        //packing description 
        this.prepared_request['package_txt'] = this.lm_request['description_Of_Packing_text'] ? this.lm_request['description_Of_Packing_text'] : "";
        this.processed_request['___package_txt___'] = this.prepared_request['package_txt'];
    }

    if (this.lm_request['method_type'] === 'Verification') {
        console.error(this.insurer_master.service_logs.pb_db_master.Insurer_Response.proposal_res.data["Payment id"]);
        this.prepared_request['payment_id'] = this.insurer_master.service_logs.pb_db_master.Insurer_Response.proposal_res.data["Payment id"];
        this.processed_request['___payment_id___'] = this.prepared_request['payment_id'];
    }

    if(["0","5","10"].indexOf(this.lm_request['basisOfValuationRate']) > -1){
        this.prepared_request['basis_of_valuation_rate'] = this.lm_request['basisOfValuationRate'];
    }else{
        this.prepared_request['basis_of_valuation_rate'] = '0';
    }
    this.processed_request['___basis_of_valuation_rate___'] = this.prepared_request['basis_of_valuation_rate'];
};

TataAIGMarine.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {
    var obj_response_handler;

    if (specific_insurer_object.method.Method_Type === 'Premium') {
        obj_response_handler = this.premium_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Customer') {
        obj_response_handler = this.customer_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Proposal') {
        obj_response_handler = this.proposal_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Verification') {
        obj_response_handler = this.verification_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Pdf') {
        obj_response_handler = this.pdf_response_handler(objResponseJson);
    }
    return obj_response_handler;

};

TataAIGMarine.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    console.error(this.constructor.name + '::' + 'service_call' + '::Start');

    try {
        var objInsurerProduct = this;
        var Client = require('node-rest-client').Client;
        var client = new Client();
        let token;
        client.get(config.environment.weburl + "/postservicecall/tataAigMarine/getToken", function (data, response) {
            token = data.token;
            console.error("token ", token);
            if (token !== null && token !== undefined) {
                process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
                console.error("====", "tata marine token generated =====");
                let request_obejct = specific_insurer_object.method.Method_Type === "Pdf" ? "" : JSON.parse(docLog.Insurer_Request);

                var args = {
                    data: request_obejct,
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": ((config.environment.name === 'Production') ? "n0Cjo7nUbA9F66eouvKNo35qSj6wsLv17kLNvqjZ" : "5QerRezeZs3PrVdLQu79c1v9Nsh5S7BOan26zc7P"), // "5QerRezeZs3PrVdLQu79c1v9Nsh5S7BOan26zc7P",
                        "Authorization": "Bearer " + token
                    }
                };
                if (specific_insurer_object.method.Method_Type === "Premium" || specific_insurer_object.method.Method_Type === "Customer") {
                    console.error(decodeHtmlEntities(request_obejct.info_sheet.mode_transport));
                    request_obejct.info_sheet.cover_name = decodeHtmlEntities(request_obejct.info_sheet.cover_name);
                    request_obejct.info_sheet.mode_transport = decodeHtmlEntities(request_obejct.info_sheet.mode_transport);
                    request_obejct.info_sheet.commodity_desc = decodeHtmlEntities(request_obejct.info_sheet.commodity_desc);


                    //console.error(args);
                    client.post(specific_insurer_object.method_file_url, args, function (data, response) {
                        console.error(specific_insurer_object.method_file_url);
                        console.error("==== tata marine Premium cb ====");
                        if (data.status === 200) {
                            var objResponseFull = {
                                'err': null,
                                'result': null,
                                'raw': JSON.stringify(data),
                                'soapHeader': null,
                                'objResponseJson': data
                            };
                            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                            console.error('Marine tataaig Premium serviceBreakup', serviceBreakup);
                        } else {
                            var objResponseFull = {
                                'err': JSON.stringify(data),
                                'result': JSON.stringify(data),
                                'raw': JSON.stringify(data),
                                'soapHeader': null,
                                'objResponseJson': JSON.stringify(data)
                            };
                            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                            console.error('Marine tataaig Premium serviceBreakup', serviceBreakup);
                        }

                    });
                }
                if (specific_insurer_object.method.Method_Type === 'Proposal') {

                    client.post(specific_insurer_object.method_file_url, args, function (data_prop, response) {
                        // console.error(specific_insurer_object.method_file_url);
                        console.error("==== tata marine proposal cb ====");
                        let proposal_res = {
                            "proposal_res": data_prop,
                            "payment_res": null,
                            "payment_req": null
                        };
                        let pay_id = [`${data_prop.data['Payment id']}`];
                        let redirectUrl = objInsurerProduct.pg_ack_url(11);
                        //initiate payment...
                        let args_pg = {
                            "payment_mode": "onlinePayment",
                            "online_payment_mode": "UPI",
                            "payer_type": "Customer",
                            "producer_code": "2200345678",
                            "payer_id": "",
                            "payer_pan_no": objInsurerProduct.prepared_request['pan'],// "AABCS6519A",
                            "payer_name": objInsurerProduct.prepared_request['company_name'],
                            "payer_relationship": "",
                            "email": objInsurerProduct.prepared_request['email'],
                            "deposit_in": "Bank",
                            "pan_no": "",
                            "payment_id": pay_id,
                            "returnurl": redirectUrl
                            // "office_location_code": "lcode",
                            // "office_location_name": "lname",
                            // "payment_amount": "1065",
                            // "policy_start_date": "2023-11-01",
                            // "consumerAppTransId": "ct123",
                            // "txn_start_time": "2023-10-31 10:05:00",
                            // "gateway_txn_id": "2323456",
                            // "transactionStatus": "Success"
                        };
                        console.error("pay_id ", args_pg);
                        proposal_res.payment_req = args_pg;
                        var args = {
                            data: args_pg,
                            headers: {
                                "Content-Type": "application/json",
                                "x-api-key": ((config.environment.name === 'Production') ? "n0Cjo7nUbA9F66eouvKNo35qSj6wsLv17kLNvqjZ" : "5QerRezeZs3PrVdLQu79c1v9Nsh5S7BOan26zc7P"),
                                "Authorization": "Bearer " + token
                            }
                        };
                        let payurl = (config.environment.name === 'Production') ? 'https://foyer.tataaig.com/payment/online?product=Marine' : 'https://uatapigw.tataaig.com/payment/online?product=Marine';
                        client.post(payurl, args, function (datapg, responsepg) {
                            console.error("==== tata marine pg cb ====");
                            proposal_res['payment_res'] = datapg;
                            let objResponseFull = {
                                'err': null,
                                'result': proposal_res,
                                'raw': JSON.stringify(docLog),
                                'soapHeader': null,
                                'objResponseJson': proposal_res
                            };
                            let serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                        });

                    });

                }

                if (specific_insurer_object.method.Method_Type === 'Verification') {

                    let serviceURL = specific_insurer_object['method']['Service_URL'];
                    var args = {
                        data: docLog.Insurer_Request,
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": 'Bearer ' + token,
                            "x-api-key": ((config.environment.name === 'Production') ? "n0Cjo7nUbA9F66eouvKNo35qSj6wsLv17kLNvqjZ" : "5QerRezeZs3PrVdLQu79c1v9Nsh5S7BOan26zc7P")
                        }
                    };
                    client.post(serviceURL, args, function (data, response) {
                        console.error("tata marine response", data);
                        let objResponseFull = {
                            'err': null,
                            'result': data,
                            'raw': JSON.stringify(data),
                            'soapHeader': null,
                            'objResponseJson': data
                        };
                        objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                    });
                }

                if (specific_insurer_object.method.Method_Type === 'Pdf') {
                    console.error("PDF URL : ", specific_insurer_object['method']['Service_URL'] + objInsurerProduct.lm_request['encrypted_policyId']);

                    let serviceURL = specific_insurer_object['method']['Service_URL'] + objInsurerProduct.lm_request['encrypted_policyId'];
                    var args = {
                        data: docLog.Insurer_Request,
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": 'Bearer ' + token,
                            "x-api-key": ((config.environment.name === 'Production') ? "n0Cjo7nUbA9F66eouvKNo35qSj6wsLv17kLNvqjZ" : "5QerRezeZs3PrVdLQu79c1v9Nsh5S7BOan26zc7P")
                        }
                    };
                    client.get(serviceURL, args, function (data, response) {
                        console.error("tata marine response", data);
                        let objResponseFull = {
                            'err': null,
                            'result': data,
                            'raw': JSON.stringify(data),
                            'soapHeader': null,
                            'objResponseJson': data
                        };
                        objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                    });
                }
            }
        });

    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};

TataAIGMarine.prototype.premium_response_handler = function (objResponseJson) {
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        console.error('Start', this.constructor.name, 'premium_response_handler', objResponseJson);

        if (objResponseJson.hasOwnProperty('message')) {
            var objPremiumService = objResponseJson['message'];
            if (objPremiumService.hasOwnProperty('status')) {
                if (objPremiumService['status'] !== 200 && objPremiumService['data'].length === 0) {
                    Error_Msg = JSON.stringify(objPremiumService);
                } else {
                    Error_Msg = JSON.stringify(objPremiumService);
                }
            }
        } else {
            Error_Msg = 'NO_ERR';
        }
        if (Error_Msg === 'NO_ERR') {
            //            var premium_breakup = this.get_const_premium_breakup();
            var premium_breakup = this.premium_breakup_schema;

            premium_breakup['net_premium'] = objResponseJson['data']['Premium'] - 0;
            premium_breakup['final_premium'] = Math.round(objResponseJson['data']['Total Premium']);
            premium_breakup['service_tax'] = objResponseJson['data']['GST'] - 0;
            premium_breakup['tax']['CGST'] = premium_breakup['service_tax'] / 2;
            premium_breakup['tax']['SGST'] = premium_breakup['service_tax'] / 2;

            objServiceHandler.Premium_Breakup = premium_breakup;
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.error('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);

    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'premium_response_handler', ex);
    }
    return objServiceHandler;
};

TataAIGMarine.prototype.customer_response_handler = function (objResponseJson) {
    console.error('Start', this.constructor.name, 'customer_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Customer': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson.hasOwnProperty('status')) {
            if (objResponseJson['status'] === 200) {
            } else {
                Error_Msg = objResponseJson['message_txt'];
            }
        } else {
            Error_Msg = 'LM_MSG:PROPOSAL_MAIN_NODE_MISSING';
        }
        if (Error_Msg === 'NO_ERR') {
            if (objResponseJson.data['Quote id'] !== null) {
                var Customer = {
                    'insurer_customer_identifier': objResponseJson.data['Quote id']
                };
                objServiceHandler.Customer = Customer;
            } else {
                objServiceHandler.Error_Msg = "LM_MSG:PROPOSAL_AND_CUSTOMER_NO_MISSING";
            }
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.error('Finish', this.constructor.name, 'customer_response_handler', objServiceHandler);

    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'customer_response_handler', ex);
    }
    return objServiceHandler;
};

TataAIGMarine.prototype.proposal_response_handler = function (objResponseJson) {
    console.error(this.const_payment.pg_ack_url);
    console.error('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        console.error('Start', this.constructor.name, 'Initiate TataAIG payment_response_handler', objResponseJson);
        var proposalResponseData = objResponseJson['proposal_res'];
        var paymentResponseData = objResponseJson['payment_res'];
        var Error_Msg = 'NO_ERR';

        if (proposalResponseData.hasOwnProperty('status') && proposalResponseData.status === 200 &&
            paymentResponseData.hasOwnProperty('status') && paymentResponseData.status === 200) {

        } else {
            if (proposalResponseData.hasOwnProperty('status') && proposalResponseData.status !== 200) {
                Error_Msg = JSON.stringify(proposalResponseData);
            }
            else if (paymentResponseData.status !== 200) {
                Error_Msg = JSON.stringify(paymentResponseData);
            }
            else {
                Error_Msg = "NO_ERR";
            }
        }
        if (Error_Msg === 'NO_ERR') {
            var objPremiumService = objResponseJson;
            var objPremiumVerification = this.premium_verification(this.lm_request['final_premium'], proposalResponseData['data']['TOTAL PREMIUM']);
            let payment_data = JSON.parse(paymentResponseData['data']);
            if (objPremiumVerification.Status) {
                //'pgiRequest': JSON.parse(paymentResponseData.data).pgiRequest
                var pg_data = {
                    pgiRequest: payment_data.pgiRequest
                };
            }
            objServiceHandler.Payment.pg_data = pg_data;
            objServiceHandler.Payment.pg_url = payment_data.url;
            objServiceHandler.Payment.pg_redirect_mode = 'POST';
            objServiceHandler.Insurer_Transaction_Identifier = proposalResponseData.data['Payment id'];
            objServiceHandler.insurer_customer_identifier = proposalResponseData.data['Proposal_No'];
            console.log(objServiceHandler);

        }


        // }
        objServiceHandler.Error_Msg = Error_Msg;
        return objServiceHandler;
        console.error('Finish', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex.message)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'proposal_response_handler', ex);
    }

};

TataAIGMarine.prototype.pg_response_handler = function () {
    try {

        var objInsurerProduct = this;
        var msg = objInsurerProduct.lm_request.pg_get;
        if (msg['policy_no'] !== "" && msg['policy_no'] !== null) {
            objInsurerProduct.const_policy.pg_status = 'SUCCESS';
            objInsurerProduct.const_policy.transaction_status = 'SUCCESS';
            objInsurerProduct.const_policy.policy_number = msg['policy_no'];
            objInsurerProduct.const_policy.transaction_id = msg['proposal_no'];
        } else {
            objInsurerProduct.const_policy.pg_status = 'PAYPASS';
            objInsurerProduct.const_policy.transaction_status = 'PAYPASS';
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'verification_response_handler', ex);
    }
};

TataAIGMarine.prototype.verification_response_handler = function (objResponseJson) {
    console.error('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var objInsurerProduct = this;
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objInsurerProduct.const_policy.pg_status === 'SUCCESS') {

            if (Error_Msg === 'NO_ERR') {
                if (objInsurerProduct.const_policy.policy_number !== '') {
                    console.error('Start', this.constructor.name, 'policy_number', objInsurerProduct.const_policy['policy_number']);
                    this.const_policy.encrypted_policy_id = objResponseJson.data[0].encrypted_policy_id;
                    //this.const_policy.policy_number = objResponseJson['policyno'];
                    this.const_policy.transaction_status = 'SUCCESS';
                    var product_name = 'MARINE';
                    var pdf_file_name = this.constructor.name + '_' + product_name + '_' + objInsurerProduct.const_policy['policy_number'].replaceAll('/', '') + '.pdf';
                    var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                    var pdf_web_path = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name; // note: need confrimstion from piyuish : config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    this.const_policy.policy_url = pdf_web_path;

                    var args = {
                        data: {
                            "search_reference_number": objInsurerProduct.lm_request['search_reference_number'],
                            "api_reference_number": objInsurerProduct.lm_request['api_reference_number'],
                            "policy_number": objInsurerProduct.const_policy.policy_number,
                            "encrypted_policyId": objResponseJson.data[0].encrypted_policy_id,
                            'client_key': objInsurerProduct.lm_request['client_key'],
                            'secret_key': objInsurerProduct.lm_request['secret_key'],
                            'insurer_id': objInsurerProduct.lm_request['insurer_id'],
                            'method_type': 'Pdf',
                            'execution_async': 'no'
                        },
                        headers: {
                            "Content-Type": "application/json",
                            'client_key': objInsurerProduct.lm_request['client_key'],
                            'secret_key': objInsurerProduct.lm_request['secret_key']
                        }
                    };
                    // this.pdf_call(config.environment.weburl + '/quote/pdf_initiate', args, pdf_sys_loc);
                    objInsurerProduct.const_policy.verification_request = args.data;
                    objServiceHandler.Insurer_Transaction_Identifier = objResponseJson.data[0].encrypted_policy_id;
                    var http = require('http');
                    //                    var insurer_pdf_url = objInsurerProduct.prepared_request['insurer_integration_pdf_url'];
                    //                    insurer_pdf_url = insurer_pdf_url.replace('___policy_number___', objInsurerProduct.const_policy.policy_number);
                    //                    insurer_pdf_url = insurer_pdf_url.replace('___product_code___', "24SV");
                    //                    this.const_policy.insurer_policy_url = insurer_pdf_url;
                    //                    try {
                    //                        var file_horizon = fs.createWriteStream(pdf_sys_loc);
                    //                        var request = http.get(insurer_pdf_url, function (response) {
                    //                            response.pipe(file_horizon);
                    //                        });
                    //                    } catch (ep) {
                    //                        console.error('ExceptionPDF', this.constructor.name, 'verification_response_handler', ep.stack);
                    //                    }
                    //End

                    //dummy pdf: dinesh
                    this.pdf_call(config.environment.weburl + '/quote/pdf_initiate', args, pdf_sys_loc);

                } else {
                    objInsurerProduct.const_policy.transaction_status = 'PAYPASS';
                }
            } else {
                objInsurerProduct.const_policy.transaction_status = 'PAYPASS';
            }
            // objServiceHandler.Insurer_Transaction_Identifier = objInsurerProduct.const_policy.transaction_id;
        }
        objServiceHandler.Policy = objInsurerProduct.const_policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.error('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};

TataAIGMarine.prototype.pdf_call = function (url, args, pdf_sys_loc) {
    try {
        var objInsurerProduct = this;
        objInsurerProduct.pdf_attempt++;
        var Client = require('node-rest-client').Client;
        var client = new Client();
        client.post(url, args, function (data, response) {
            if (data.Error_Code !== '' || true) {
                if (!fs.existsSync(pdf_sys_loc) && objInsurerProduct.pdf_attempt < 11) {
                    var sleep = require('system-sleep');
                    sleep(600000);
                    objInsurerProduct.pdf_call(url, args, pdf_sys_loc);
                }
            }
        });
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pdf_call', ex);
    }
};

TataAIGMarine.prototype.pdf_response_handler = function (objResponseJson) {
    console.error('Start', this.constructor.name, 'pdf_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        var policy = {
            'policy_url': null,
            'policy_number': this.lm_request['policy_number'],
            'pdf_status': null
        };
        if (objResponseJson.hasOwnProperty('byteStream') && objResponseJson.byteStream && objResponseJson.hasOwnProperty('download') && objResponseJson.download) {
        } else {
            Error_Msg = objResponseJson.hasOwnProperty('message_txt') ? objResponseJson.message_txt : objResponseJson;
        }

        if (Error_Msg === 'NO_ERR') {
            if (objResponseJson.byteStream) {
                var product_name = 'MARINE';
                var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.const_payment_response.pg_get.policy_no.replaceAll('/', '') + '.pdf';
                var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                var pdf_web_path = config.environment.downloadurl + "/pdf/" + pdf_file_name;

                // fs.createWriteStream(pdf_sys_loc);

                var binary = new Buffer(objResponseJson.byteStream, 'base64');

                var sleep = require('system-sleep');
                //sleep(10000);
                fs.writeFileSync(pdf_sys_loc, binary);
                policy.policy_url = pdf_web_path;
                policy.pdf_status = 'SUCCESS';
            } else {
                policy.pdf_status = 'FAIL';
            }
            objServiceHandler.Insurer_Transaction_Identifier = this.lm_request['policy_number'];
        } else {
            policy.transaction_status = 'PAYPASS';
        }
        objServiceHandler.Policy = policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.error('Finish', this.constructor.name, 'pdf_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'pdf_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};

TataAIGMarine.prototype.premium_breakup_schema = {
    "tax": {
        "CGST": 0,
        "SGST": 0,
        "IGST": 0,
        "UGST": 0
    },
    "net_premium": 0,
    "service_tax": 0,
    "final_premium": 0,
    'WarSRCCorSRCCInlandPremiumINR': 0,
    'WarSRCCorSRCCInlandPremiumFC': 0,
    'StampDutyINR': 0,
    'base_premium': 0,
    'BasicPremiumFC': 0,
    'NetPremiumFC': 0,
    'NetPremiumINR': 0,
    'StoragePremiumFC': 0,
    'StoragePremiumINR': 0,
    'UndertonnagePremiumFC': 0,
    'UndertonnagePremiumINR': 0,
    'OveragePremiumFC': 0,
    'OveragePremiumINR': 0,
    'FOBPremiumFC': 0,
    'FOBPremiumINR': 0,
    'DutyPremiumFC': 0,
    'DutyPremiumINR': 0
};

function jsonToQueryString(json) {
    return "?" + Object.keys(json).map(function (key) {
        return encodeURIComponent(key) + '=' +
            encodeURIComponent(json[key]);
    }).join('&');
}

function decodeHtmlEntities(input) {
    return input.replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
}

module.exports = TataAIGMarine;
