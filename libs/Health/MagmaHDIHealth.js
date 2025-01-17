/* Author : Revati Ghadge
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var util = require('util');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var Health = require(appRoot + '/libs/Health');
var fs = require('fs');
var sleep = require('system-sleep');
var config = require('config');
var moment = require('moment');

function MagmaHDIHealth() {

}
util.inherits(MagmaHDIHealth, Health);

MagmaHDIHealth.prototype.lm_request_single = {};
MagmaHDIHealth.prototype.insurer_integration = {};
MagmaHDIHealth.prototype.insurer_addon_list = [];
MagmaHDIHealth.prototype.insurer = {};
MagmaHDIHealth.prototype.insurer_date_format = 'dd/MM/yyyy';
MagmaHDIHealth.prototype.const_insurer_suminsured = [200000, 300000, 400000, 500000, 750000, 1000000, 1500000, 2000000, 2500000, 3000000, 5000000, 10000000];


MagmaHDIHealth.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
MagmaHDIHealth.prototype.insurer_product_field_process_pre = function () {
    var adult = this.lm_request['adult_count'];
    var child = this.lm_request['child_count'];

    if (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Customer') {
        this.prepared_request['policy_start'] = this.policy_start_date();
        this.processed_request['___policy_start___'] = this.prepared_request['policy_start'];
        this.prepared_request['policy_end'] = this.policy_end_date();
        this.processed_request['___policy_end___'] = this.prepared_request['policy_end'];
        this.prepared_request['entity_rel_name'] = ((config.environment.name === 'Production') ? "LANDMARK INSURANCE BROKERS PVT LTD" : "BROKER TEST3");
        this.processed_request['___entity_rel_name___'] = this.prepared_request['entity_rel_name'];
        this.prepared_request['intermediary_code'] = ((config.environment.name === 'Production') ? "BRC0000011" : "BRC0000276");
        this.processed_request['___intermediary_code___'] = this.prepared_request['intermediary_code'];
        this.prepared_request['channel_id'] = ((config.environment.name === 'Production') ? "INTR-61-160867" : "INTR-6111-171148");
        this.processed_request['___channel_id___'] = this.prepared_request['channel_id'];
        this.prepared_request['sp_code'] = ((config.environment.name === 'Production') ? "G01665" : "G00487");
        this.processed_request['___sp_code___'] = this.prepared_request['sp_code'];
        this.prepared_request['sp_name'] = ((config.environment.name === 'Production') ? "DEVANAND DWIVEDI" : "ALOKE AGRAWAL");
        this.processed_request['___sp_name___'] = this.prepared_request['sp_name'];
        this.prepared_request['display_ocode'] = ((config.environment.name === 'Production') ? "200002" : "400018");
        this.processed_request['___display_ocode___'] = this.prepared_request['display_ocode'];
        this.prepared_request['office_code'] = ((config.environment.name === 'Production') ? "9200001" : "");
        this.processed_request['___office_code___'] = this.prepared_request['office_code'];
        this.prepared_request['office_name'] = ((config.environment.name === 'Production') ? "SION MUMBAI BRANCH" : "KOLKATA 2");
        this.processed_request['___office_name___'] = this.prepared_request['office_name'];
    }

    if (this.lm_request['method_type'] === 'Premium') {
        var obj_member_type = this.get_member_type(adult, child);
        this.prepared_request['get_member_type'] = obj_member_type;
        this.processed_request['___get_member_type___'] = this.prepared_request['get_member_type'];

        var policy_type = (this.lm_request['health_insurance_type'] === 'individual') ? 'Individual' : 'Family Floater';
        this.prepared_request['policy_type'] = policy_type;
        this.processed_request['___policy_type___'] = policy_type;

        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";
        var member = 1;
        for (member = 1; member <= adult; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.prepared_request['member_' + member + '_inc'] = member;
            this.processed_request['___member_' + member + '_inc___'] = member;
        }
        for (member = 3; member <= child + 2; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            if (adult === 1) {
                this.prepared_request['member_' + member + '_inc'] = member - 1;
                this.processed_request['___member_' + member + '_inc___'] = member - 1;
            } else {
                this.prepared_request['member_' + member + '_inc'] = member;
                this.processed_request['___member_' + member + '_inc___'] = member;
            }
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);

        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetailRisk_Start-->', '<!--InsurersDetailRisk_End-->', true);
        var txt_replace_with = "";
        var member = 1;
        for (member = 1; member <= adult; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.prepared_request['member_' + member + '_inc'] = member;
            this.processed_request['___member_' + member + '_inc___'] = member;
        }
        for (member = 3; member <= child + 2; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            if (adult === 1) {
                this.prepared_request['member_' + member + '_inc'] = member - 1;
                this.processed_request['___member_' + member + '_inc___'] = member - 1;
            } else {
                this.prepared_request['member_' + member + '_inc'] = member;
                this.processed_request['___member_' + member + '_inc___'] = member;
            }
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);

        this.method_content = this.method_content.replaceAll('<!--InsurersDetail_Start-->', "");
        this.method_content = this.method_content.replaceAll('<!--InsurersDetail_End-->', "");
        this.method_content = this.method_content.replaceAll('<!--InsurersDetailRisk_Start-->', "");
        this.method_content = this.method_content.replaceAll('<!--InsurersDetailRisk_End-->', "");
    }
    if (this.lm_request['method_type'] === 'Customer') {
        var obj_member_type = this.get_member_type(adult, child);
        this.prepared_request['get_member_type'] = obj_member_type;
        this.processed_request['___get_member_type___'] = this.prepared_request['get_member_type'];
        this.prepared_request["area"] = this.lm_request["locality"];
        this.processed_request["___area___"] = this.prepared_request["area"];
        this.prepared_request["district"] = this.lm_request["district"];
        this.processed_request["___district___"] = this.prepared_request["district"];
        this.prepared_request["district_code"] = this.lm_request["communication_district_code"];
        this.processed_request["___district_code___"] = this.prepared_request["district_code"];
        this.prepared_request["state"] = this.lm_request["communication_state"];
        this.processed_request["___state___"] = this.prepared_request["state"];
        this.prepared_request["state_code"] = this.lm_request["communication_state_code"];
        this.processed_request["___state_code___"] = this.prepared_request["state_code"];

        var policy_type = (this.lm_request['health_insurance_type'] === 'individual') ? 'Individual' : 'Family Floater';
        this.prepared_request['policy_type'] = policy_type;
        this.processed_request['___policy_type___'] = policy_type;

        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";
        var member = 1;
        for (member = 1; member <= adult; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.prepared_request['member_' + member + '_inc'] = member;
            this.processed_request['___member_' + member + '_inc___'] = member;
        }
        for (member = 3; member <= child + 2; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            if (adult === 1) {
                this.prepared_request['member_' + member + '_inc'] = member - 1;
                this.processed_request['___member_' + member + '_inc___'] = member - 1;
            } else {
                this.prepared_request['member_' + member + '_inc'] = member;
                this.processed_request['___member_' + member + '_inc___'] = member;
            }
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);

        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetailRisk_Start-->', '<!--InsurersDetailRisk_End-->', true);
        var txt_replace_with = "";
        var member = 1;
        for (member = 1; member <= adult; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.prepared_request['member_' + member + '_inc'] = member;
            this.processed_request['___member_' + member + '_inc___'] = member;
        }
        for (member = 3; member <= child + 2; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            if (adult === 1) {
                this.prepared_request['member_' + member + '_inc'] = member - 1;
                this.processed_request['___member_' + member + '_inc___'] = member - 1;
            } else {
                this.prepared_request['member_' + member + '_inc'] = member;
                this.processed_request['___member_' + member + '_inc___'] = member;
            }
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);

        this.method_content = this.method_content.replaceAll('<!--InsurersDetail_Start-->', "");
        this.method_content = this.method_content.replaceAll('<!--InsurersDetail_End-->', "");
        this.method_content = this.method_content.replaceAll('<!--InsurersDetailRisk_Start-->', "");
        this.method_content = this.method_content.replaceAll('<!--InsurersDetailRisk_End-->', "");

        for (member = 1; member <= 6; member++) {
            if (this.lm_request['member_' + member + '_question_1_details'] === undefined) {
                for (var q = 1; q <= 15; q++) {
                    this.prepared_request['member_' + member + '_question_' + q + '_details'] = '0';
                    this.processed_request['___member_' + member + '_question_' + q + '_details___'] = '0';
                }
            }
        }

        for (member = 1; member <= adult; member++) {
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];

            for (var key in this.lm_request) {
                if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1) {
                    var ques_detail = key.replace('_type', '_details');
                    if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                        if (this.lm_request[ques_detail] === false) {
                            this.prepared_request[ques_detail] = '0';
                            this.processed_request['___' + ques_detail + '___'] = '0';
                            this.processed_request['___' + ques_detail + '1___'] = 'False';
                            this.processed_request['___' + ques_detail + '2___'] = 'No';
                        } else {
                            this.prepared_request[ques_detail] = '1';
                            this.processed_request['___' + ques_detail + '___'] = '1';
                            this.processed_request['___' + ques_detail + '1___'] = 'True';
                            this.processed_request['___' + ques_detail + '2___'] = 'Yes';
                        }
                    } else if (this.lm_request[key].toString().toLowerCase() === 'since') {
                        this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                        this.processed_request['___' + ques_detail + '___'] = this.lm_request[ques_detail];
                    }
                }
            }
        }
        for (member = 3; member <= child + 2; member++) {
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];

            for (var key in this.lm_request) {
                if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1) {
                    var ques_detail = key.replace('_type', '_details');
                    if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                        if (this.lm_request[ques_detail] === false) {
                            this.prepared_request[ques_detail] = '0';
                            this.processed_request['___' + ques_detail + '___'] = '0';
                            this.processed_request['___' + ques_detail + '1___'] = 'False';
                            this.processed_request['___' + ques_detail + '2___'] = 'No';
                        } else {
                            this.prepared_request[ques_detail] = '1';
                            this.processed_request['___' + ques_detail + '___'] = '1';
                            this.processed_request['___' + ques_detail + '1___'] = 'True';
                            this.processed_request['___' + ques_detail + '2___'] = 'Yes';
                        }
                    } else if (this.lm_request[key].toString().toLowerCase() === 'since') {
                        this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                        this.processed_request['___' + ques_detail + '___'] = this.lm_request[ques_detail];
                    }

                }
            }
        }
    }
    if (this.lm_request['method_type'] === 'Proposal') {
        var returnUrl = this.pg_ack_url(35);
        if (config.environment.name === 'Development') {
            returnUrl = 'http://localhost:7000/transaction-status/' + this.lm_request['udid'] + '/' + this.lm_request['crn'] + '/' + this.lm_request['proposal_id'];
        }
        this.prepared_request['return_url'] = returnUrl;
        this.processed_request['___return_url___'] = returnUrl;
    }
    if (this.lm_request['method_type'] === 'Pdf') {
        this.prepared_request['proposal_id'] = this['const_policy'].transaction_id !== null ? this.const_policy.transaction_id : this['lm_request'].proposal_number;
        this.processed_request['___proposal_id___'] = this.prepared_request['proposal_id'];
    }
    console.log(this.lm_request['method_type'], this.processed_request);
//    console.log(this.method_content);
};
MagmaHDIHealth.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

    var product_id = objProduct.db_specific_product.Product_Id;
    var insurer_id = Insurer_Object.Insurer_ID;

    var error_msg = 'NO_ERROR';
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
    if (specific_insurer_object.method.Method_Type === 'Pdf') {
        obj_response_handler = this.pdf_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Verification') {
        obj_response_handler = this.verification_response_handler(objResponseJson);
    }
    return obj_response_handler;

};
MagmaHDIHealth.prototype.insurer_product_field_process_post = function () {

};
MagmaHDIHealth.prototype.insurer_product_api_post = function () {

};
MagmaHDIHealth.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
//    console.log('service_call');

    try {
        var objInsurerProduct = this;
        var xml2js = require('xml2js');
        var body = docLog.Insurer_Request;
        var Client = require('node-rest-client').Client;
        var client = new Client();
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

        var auth_url = ((config.environment.name === 'Production') ? "https://int.magma-hdi.co.in" : "https://webportal.magma-hdi.co.in:444") + "/GCCustomerPortalServiceRest/GCCustomerPortalServiceRest.svc/GetAuthenticationKey";

        var authArgs = {
            "authenticateInput": {
                "UserID": objInsurerProduct.processed_request["___insurer_integration_service_user___"],
                "Password": objInsurerProduct.processed_request["___insurer_integration_service_password___"]
            }
        };
        var args = {
            data: JSON.stringify(authArgs),
            headers: {"Content-Type": "application/json;charset=UTF-8"},
            "rejectUnauthorized": false
        };
        client.post(auth_url, args, function (data, response) {

            var AuthKey = data.GetAuthenticationKeyResult.AuthKey;
            if (specific_insurer_object.method.Method_Type === "Premium" || specific_insurer_object.method.Method_Type === "Customer") {
                var proposalType = (specific_insurer_object.method.Method_Type === "Premium") ? 1 : 3;
                var postReq = {
                    "proposalInput": {
                        "UserID": objInsurerProduct.processed_request["___insurer_integration_service_user___"],
                        "Password": objInsurerProduct.processed_request["___insurer_integration_service_password___"],
                        "UserRole": "ADMIN",
                        "ProductCode": "6111",
                        "ModeOfOperation": "NEWPOLICY",
                        "AuthenticateKey": AuthKey,
                        "InputXML": body,
                        "ProposalGenerationMode": proposalType
                    }
                };
//                console.log(postReq);
                var args = {
                    data: postReq,
                    headers: {"Content-Type": "application/json;charset=UTF-8"}
                };
            } else {
                docLog.Insurer_Request = docLog.Insurer_Request.replace('___Authenticate_Key___', AuthKey);
                var args = {
                    data: docLog.Insurer_Request,
                    headers: {"Content-Type": "application/json;charset=UTF-8"},
                    "rejectUnauthorized": false
                };
            }
            client.post(specific_insurer_object.method.Service_URL, args, function (data, response) {
                if (specific_insurer_object.method.Method_Type === "Pdf") {
                    console.log(data.GeneratePolicyDocumentResult.ErrorText);
//                    console.log(data.GeneratePolicyDocumentResult.PolicyDocument);
                    console.log('Magma', JSON.stringify(data));
                    var objResponseFull = {
                        'err': null,
                        'result': null,
                        'raw': JSON.stringify(data),
                        'soapHeader': null,
                        'objResponseJson': data
                    };
                    objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                } else if (specific_insurer_object.method.Method_Type === "Proposal") {
                    console.log(data.GenerateTransactionIDResult.ErrorText);
//                    console.log(data.GenerateTransactionIDResult.OutputXML);
                    console.log('Magma', JSON.stringify(data));
                    var objResponseFull = {
                        'err': null,
                        'result': null,
                        'raw': JSON.stringify(data),
                        'soapHeader': null,
                        'objResponseJson': data
                    };
                    objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                } else {
//                    console.log(data.SaveProposalResult.ErrorText);
////                    console.log(data.SaveProposalResult.OutputXML);
//                    console.log('Magma', data.toString());
                    if (data.SaveProposalResult.ErrorText !== "") {
                        var objResponseFull = {
                            'err': data.SaveProposalResult.ErrorText,
                            'result': null,
                            'raw': null,
                            'soapHeader': null,
                            'objResponseJson': data.SaveProposalResult
                        };
                        objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);

                    } else {
                        xml2js.parseString(data.SaveProposalResult.OutputXML, function (err2, objXml2Json) {
                            if (err2) {
                                var objResponseFull = {
                                    'err': err2,
                                    'result': objXml2Json,
                                    'raw': objXml2Json,
                                    'soapHeader': objXml2Json,
                                    'objResponseJson': null
                                };
                                objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                            } else {
                                var objResponseFull = {
                                    'err': null,
                                    'result': null,
                                    'raw': JSON.stringify(objXml2Json),
                                    'soapHeader': null,
                                    'objResponseJson': objXml2Json
                                };
                                objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);

                            }
                        });
                    }
                }
            });
        });
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};

MagmaHDIHealth.prototype.premium_response_handler = function (objResponseJson) {
//    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        //check error start
        if (objResponseJson.hasOwnProperty("ServiceResult")) {
            var objPremiumService = objResponseJson['ServiceResult'];
            if (objPremiumService.hasOwnProperty("TotalPremium")) {
                if (objPremiumService["TotalPremium"] !== "") {
                } else {
                    Error_Msg = JSON.stringify(objPremiumService['ErrorText']);
                }
            } else {
                Error_Msg = 'LM_NODE_MISSING_Premium';
            }
        } else {
            Error_Msg = 'LM_NODE_MISSING_ServiceResult';
        }
        if (Error_Msg === 'NO_ERR')
        {
            var premium_breakup = this.get_const_premium_breakup();
            premium_breakup['final_premium'] = Number(objPremiumService['TotalPremium']);
            premium_breakup['net_premium'] = Number(objPremiumService['NetPremium']);
            premium_breakup['service_tax'] = Number(objPremiumService['ServiceTax']);
            premium_breakup['tax']['CGST'] = (premium_breakup['service_tax'] / 2).toFixed(2);
            premium_breakup['tax']['SGST'] = (premium_breakup['service_tax'] / 2).toFixed(2);
            objServiceHandler.Premium_Breakup = premium_breakup;
            objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['ProposalNo']['0'];
        }

        objServiceHandler.Error_Msg = Error_Msg;
//        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
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
MagmaHDIHealth.prototype.customer_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'customer_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Customer': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson.hasOwnProperty("ServiceResult")) {
            if (objResponseJson['ServiceResult'].hasOwnProperty("ProposalNo")) {
                if (objResponseJson['ServiceResult']["ProposalNo"] !== "") {
                } else {
                    Error_Msg = JSON.stringify(objResponseJson['ServiceResult']['ErrorText']);
                }
            } else {
                Error_Msg = 'LM_NODE_MISSING_Proposal';
            }
        } else {
            Error_Msg = 'LM_NODE_MISSING_ServiceResult';
        }
        if (Error_Msg === 'NO_ERR') {
            var encryptUrl = ((config.environment.name === 'Production') ? "https://int.magma-hdi.co.in" : "https://uatpg.magma-hdi.co.in:444") + "/GCCustomerPortalServiceRest/GCCustomerPortalServiceRest.svc/EncryptText";
            var data = {"encryptionInput": {"InputData": objResponseJson['ServiceResult']["ProposalNo"]['0']}};
            var args = {
                data: data,
                headers: {"Content-Type": "application/json;charset=UTF-8"}
            };

            var Client = require('node-rest-client').Client;
            var client = new Client();
            var encryptedData = '';
            client.post(encryptUrl, args, function (data, response) {
                console.log("ProposalNo encrypted-", JSON.stringify(data));
                encryptedData = data['EncryptTextResult']['OutputData'];
            });
            sleep(5000);

            var proposalAmt = objResponseJson['ServiceResult'].hasOwnProperty('TotalPremium') ? Number(objResponseJson['ServiceResult']["TotalPremium"]['0']) : 0;
            var objPremiumVerification = this.premium_verification(this.lm_request["final_premium"], proposalAmt);

            if (objPremiumVerification.Status) {
                var Customer = {
                    'insurer_customer_identifier': objResponseJson['ServiceResult']['ConfWFHelper']['0']['WFMessageList']['0']['clsMessageItem']['3']['ItemValue']['0'],
                    'insurer_customer_identifier_2': encryptedData,
                    'insurer_customer_identifier_3': objResponseJson['ServiceResult']['ConfWFHelper']['0']['GetLinkIDData']['0']['clsLinkIdDtls']['0']['LinkID']['0']
                };
                objServiceHandler.Customer = Customer;
                objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['ServiceResult']['ConfWFHelper']['0']['GetLinkIDData']['0']['clsLinkIdDtls']['0']['LinkID']['0'];
            } else {
                Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
            }
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'customer_response_handler', objServiceHandler);

    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'customer_response_handler', ex);
    }
    return objServiceHandler;
};
MagmaHDIHealth.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson.hasOwnProperty("GenerateTransactionIDResult")) {
            if (objResponseJson['GenerateTransactionIDResult'].hasOwnProperty("TransactionID")) {
                if (objResponseJson['GenerateTransactionIDResult']["TransactionID"] !== "") {
                } else {
                    Error_Msg = objResponseJson['GenerateTransactionIDResult']['ErrorText'];
                }
            } else {
                Error_Msg = 'LM_NODE_MISSING_Proposal';
            }
        } else {
            Error_Msg = 'LM_NODE_MISSING_GenerateTransactionIDResult';
        }
        if (Error_Msg === 'NO_ERR') {
            var encryptUrl = ((config.environment.name === 'Production') ? "https://int.magma-hdi.co.in" : "https://uatpg.magma-hdi.co.in:444") + "/GCCustomerPortalServiceRest/GCCustomerPortalServiceRest.svc/EncryptText";
            var data = {"encryptionInput": {"InputData": objResponseJson['GenerateTransactionIDResult']["TransactionID"]}};
            var args = {
                data: data,
                headers: {"Content-Type": "application/json;charset=UTF-8"}
            };

            var Client = require('node-rest-client').Client;
            var client = new Client();
            var encryptedData = '';
            client.post(encryptUrl, args, function (data, response) {
                console.log("TransactionID encrypted-", JSON.stringify(data));
                encryptedData = data['EncryptTextResult']['OutputData'];
            });
            sleep(5000);

            var pg_data = {
                'TXN': encryptedData,
                'PNO': this.processed_request['___insurer_customer_identifier_2___']
            };
//            objServiceHandler.Payment.pg_url += "?TXN=" + encryptedData + "&PNO=" + this.processed_request['___insurer_customer_identifier_2___'];
            objServiceHandler.Payment.pg_ack_url = this.prepared_request['return_url'];
            objServiceHandler.Payment.pg_data = pg_data;
            objServiceHandler.Payment.pg_redirect_mode = 'GET';
            objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['GenerateTransactionIDResult']["TransactionID"];
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'proposal_response_handler', ex);
    }
    return objServiceHandler;
};
MagmaHDIHealth.prototype.pg_response_handler = function () {
    try {
        console.log('Start', this.constructor.name, 'pg_response_handler');
        var output = this.const_payment_response.pg_post;
        this.const_policy.transaction_id = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['insurer_customer_identifier_3'];
        if (output['ErrorMessage'] === "") {
            this.const_policy.transaction_amount = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['final_premium'];
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.transaction_status = 'SUCCESS';
            this.const_policy.policy_number = output['PolicyNo'];
            this.const_policy.pg_reference_number_1 = output['PaymentGatewayTransId'];
            this.const_policy.pg_reference_number_2 = output['GCPaymentId'];
            this.const_policy.pg_reference_number_3 = output['TxnId'];
        } else {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
        console.error('End', this.constructor.name, 'pg_response_handler', this.const_policy);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
MagmaHDIHealth.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (this.const_policy.pg_status === 'FAIL') {
        }
        if (this.const_policy.transaction_status === 'SUCCESS') {//transaction success  
            if (this.const_policy.policy_number !== "" && !this.const_policy.policy_number.includes("PENDING")) {
                var pdf_file_name = this.constructor.name + '_' + "Health" + '_' + this.const_policy.policy_number.toString().replaceAll('/', '') + '.pdf';
                var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                this.const_policy.policy_url = pdf_web_path_portal;
                try {
                    var args = {
                        data: {
                            "search_reference_number": this.lm_request['search_reference_number'],
                            "api_reference_number": this.lm_request['api_reference_number'],
                            "policy_number": this.const_policy.policy_number,
                            "proposal_number": this.const_policy.transaction_id,
                            'client_key': this.lm_request['client_key'],
                            'secret_key': this.lm_request['secret_key'],
                            'insurer_id': this.lm_request['insurer_id'],
                            'email': this.lm_request['email'],
                            'mobile': this.lm_request['mobile'],
                            'method_type': 'Pdf',
                            'execution_async': 'no'
                        },
                        headers: {
                            "Content-Type": "application/json",
                            'client_key': this.lm_request['client_key'],
                            'secret_key': this.lm_request['secret_key']
                        }
                    };
                    this.pdf_call(config.environment.weburl + '/quote/pdf_initiate', args, pdf_sys_loc_horizon);
                } catch (ep) {
                    console.error('ExceptionPDF', this.constructor.name, 'verification_response_handler', ep);
                }
            } else {
                this.const_policy.transaction_substatus = 'UW';
            }
        }
        objServiceHandler.Policy = this.const_policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);

    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', ex);
    }
    return objServiceHandler;
};
MagmaHDIHealth.prototype.pdf_call = function (url, args, pdf_sys_loc) {
    var objInsurerProduct = this;
    objInsurerProduct.pdf_attempt++;
    var Client = require('node-rest-client').Client;
    var client = new Client();
    client.post(url, args, function (data, response) {
        console.log("Pdf initiate");
        if (data.Error_Code !== '' || true) {
            if (!fs.existsSync(pdf_sys_loc) && objInsurerProduct.pdf_attempt < 11) {
                var sleep = require('system-sleep');
                sleep(6000);
                objInsurerProduct.pdf_call(url, args, pdf_sys_loc);
            }
        }
    });
};
MagmaHDIHealth.prototype.pdf_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'pdf_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    try {
        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null,
            'Policy': null
        };
        if (objResponseJson.hasOwnProperty('GeneratePolicyDocumentResult')) {
            if (objResponseJson['GeneratePolicyDocumentResult']['ErrorCode'] === "") {
            } else {
                Error_Msg = objResponseJson['GeneratePolicyDocumentResult']['ErrorText'];
            }
        } else {
            Error_Msg = 'LM_NODE_MISSING_GeneratePolicyDocumentResult';
        }
        var policy = {
            'policy_url': null,
            'policy_number': this.lm_request['policy_number'],
            'pdf_status': null
        };
        if (Error_Msg === 'NO_ERR') {
            var strPdfReposnse = objResponseJson['GeneratePolicyDocumentResult']['PolicyDocument'];
            var pdf_file_name = this.constructor.name + '_Health_' + this.lm_request['policy_number'].toString().replaceAll('/', '') + '.pdf';
            var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
            var pdf_web_path = config.environment.weburl + "/pdf/" + pdf_file_name;
            var binary = new Buffer(strPdfReposnse, 'base64');
            fs.writeFileSync(pdf_sys_loc, binary);
            policy.policy_url = pdf_web_path;
            policy.pdf_status = 'SUCCESS';
            objServiceHandler.Insurer_Transaction_Identifier = this.lm_request['policy_number'];
        } else {
            policy.pdf_status = 'FAIL';
        }
        objServiceHandler.Policy = policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'pdf_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        objServiceHandler.Policy = this.const_policy;
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'pdf_response_handler', objServiceHandler);
    }
    return objServiceHandler;

};
MagmaHDIHealth.prototype.get_member_type = function (adult, child) {
    var member_type;
    if (adult === 1) {
        member_type = '1A';
        if (child === 1) {
            member_type = '1A+1C';
        } else if (child === 2) {
            member_type = '1A+2C';
        } else if (child === 3) {
            member_type = '1A+3C';
        } else if (child === 4) {
            member_type = '1A+4C';
        }
    } else if (adult === 2) {
        member_type = '2A';
        if (child === 1) {
            member_type = '2A+1C';
        } else if (child === 2) {
            member_type = '2A+2C';
        } else if (child === 3) {
            member_type = '2A+3C';
        } else if (child === 4) {
            member_type = '2A+4C';
        }
    }
    return member_type;
};
MagmaHDIHealth.prototype.get_member_relation = function (i) {
    var gender = this.lm_request['member_' + i + '_gender'];
    if (this.prepared_request["relation"] === 'Son' || this.prepared_request["relation"] === 'Daughter') {
        return(gender === 'M' ? 'Father' : 'Mother');
    }
    if (this.prepared_request["relation"] === 'Mother' || this.prepared_request["relation"] === 'Father') {
        return(gender === 'M' ? 'Son' : 'Daughter');
    }
    if (this.prepared_request["relation"] === 'Spouse') {
        return 'Spouse';
    }
    if (this.prepared_request["relation"] === 'Self' || this.prepared_request["relation"] === '') {
        if (i >= 3) {
            return(gender === 'M' ? 'Son' : 'Daughter');
        } else if (i === 1) {
            return 'Self';
        } else if (i === 2) {
            return 'Spouse';
        }
    }

    return '';
};
MagmaHDIHealth.prototype.policy_start_date = function () {
    var today = moment().utcOffset("+05:30");
    var pol_start_date = today.format('DD/MM/YYYY');
    var proposal_time = today.format("HH:mm");
    this.prepared_request['proposal_time'] = proposal_time;
    this.processed_request['___proposal_time___'] = proposal_time;
    return pol_start_date;
};
MagmaHDIHealth.prototype.policy_end_date = function () {
    var today = moment().utcOffset("+05:30");
    var pol_end_date = today.add(this.lm_request['policy_tenure'], 'year').subtract(1, 'days').format('DD/MM/YYYY');
    return pol_end_date;
};
MagmaHDIHealth.prototype.is_valid_plan = function (lm_request, planCode) {
    console.log('MagmaHDIHealth is_valid_plan', 'start');
    var index = -1;
    var Magma_Plans = [
        {'code': "Support", 'min_si': 99000, 'max_si': 500000},
        {'code': "SupportPlus", 'min_si': 99000, 'max_si': 1000000},
        {'code': "Shield", 'min_si': 99000, 'max_si': 1000000},
        {'code': "Premium", 'min_si': 450000, 'max_si': 5000000},
        {'code': "Secure", 'min_si': 800000, 'max_si': 10000000}
    ];
    index = Magma_Plans.findIndex(x => x.code === planCode
                && x.min_si < (lm_request['health_insurance_si'] - 0)
                && x.max_si >= (lm_request['health_insurance_si'] - 0));
    return (index > -1 ? true : false);
    console.log('MagmaHDIHealth is_valid_plan', 'End');
};
MagmaHDIHealth.prototype.premium_breakup_schema = {
    "base_premium": "basePremium",
    "net_premium": "premium",
    "service_tax": "serviceTax",
    "SBC": "SBC",
    "KKC": "KKC",
    "gross_premium": "grossPremium",
    "final_premium": "totalPremium"
};
module.exports = MagmaHDIHealth;