/* Author : Revati Ghadge
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var util = require('util');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var Health = require(appRoot + '/libs/Health');
var config = require('config');
var fs = require('fs');
function HDFCErgoHealth() {

}
util.inherits(HDFCErgoHealth, Health);
HDFCErgoHealth.prototype.insurer_date_format = 'dd/MM/yyyy';
HDFCErgoHealth.prototype.const_insurer_suminsured = [300000, 400000, 500000, 750000, 1000000, 1500000, 2000000, 2500000, 5000000, 7500000];
HDFCErgoHealth.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
HDFCErgoHealth.prototype.insurer_product_field_process_pre = function () {
    if (this.lm_request['method_type'] === 'Premium') {
//        var args = {
//            "Insurer_HealthRate_Id": this.insurer_master['hdfc_plans']['pb_db_master'],
//            "ProductPlan_Id": this.processed_request['___Plan_Id___'],
//            //"NumberOfAdults": this.lm_request["adult_count"],
//            //"NumberOfChildren": this.lm_request["child_count"],
//            "SumInsured": this.prepared_request["health_insurance_si"] - 0,
//            //"Min_AgeOfEldestMember_Months": {$lte: this.lm_request["elder_member_age_in_months"]},
//            //"Max_AgeOfEldestMember_Months": {$gte: this.lm_request["elder_member_age_in_months"]},
//            "Policy_Term_Year": this.lm_request["policy_tenure"]
//        };
        this.method_content = JSON.stringify(this.lm_request);
    }
    if (this.lm_request['method_type'] === 'Proposal') {
        this.prepared_request['plan_cd'] = this.prepared_request['dbmaster_insurer_transaction_identifier'];
        this.processed_request["___plan_cd___"] = this.prepared_request['plan_cd'];
        this.prepared_request["service_tax"] = this.lm_request["service_tax"];
        this.processed_request["___service_tax___"] = this.prepared_request["service_tax"];
        this.prepared_request["city"] = this.lm_request["district"];
        this.processed_request["___city___"] = this.prepared_request["city"];
        this.prepared_request["state"] = this.lm_request["communication_state"];
        this.processed_request["___state___"] = this.prepared_request["state"];
        this.prepared_request['tier'] = this.lm_request["zone"];
        this.processed_request['___tier___'] = this.prepared_request['tier'];
        this.processed_request['___pan___'] = (this.prepared_request['pan']).toUpperCase();
        this.prepared_request["plan_type"] = this.lm_request['member_count'] === 1 ? 'NF' : 'WF';
        this.processed_request["___plan_type___"] = this.prepared_request["plan_type"];
        this.prepared_request['proposer_insured'] = this.prepared_request["relation"] === 'I' ? "Y" : "N";
        this.processed_request["___proposer_insured___"] = this.prepared_request['proposer_insured'];
        this.prepared_request["crn"] = this.lm_request["crn"];
        this.processed_request["___crn___"] = this.prepared_request["crn"];

        var insured_details = "";
        var bmi_check = "";
        var member = 1;
        // repeat for each adult
        for (member = 1; member <= this.lm_request['adult_count']; member++) {
            this.calculate_bmi(member);
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
            this.prepared_request['member_' + member + '_nominee_name'] = this.lm_request['member_' + member + '_nominee_name'];
            this.processed_request['___member_' + member + '_nominee_name___'] = this.lm_request['member_' + member + '_nominee_name'];
            this.prepared_request['member_' + member + '_nominee_rel'] = this.get_nominee_relation(this.lm_request['member_' + member + '_nominee_rel']);
            this.processed_request['___member_' + member + '_nominee_rel___'] = this.prepared_request['member_' + member + '_nominee_rel'];
            this.prepared_request['member_' + member + '_bmi_normal'] = this.check_bmi(this.prepared_request['member_' + member + '_bmi']);
            this.processed_request['___member_' + member + '_bmi_normal___'] = this.prepared_request['member_' + member + '_bmi_normal'];
            bmi_check = bmi_check === "" ? this.prepared_request['member_' + member + '_bmi_normal'] : bmi_check + "|" + this.prepared_request['member_' + member + '_bmi_normal'];
            for (var key in this.lm_request) {
                if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1) {
                    var ques_detail = key.replace('_type', '_details');
                    var ques_code = key.replace('_type', '_code');
                    if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                        if (this.lm_request[ques_detail] === false) {
                            this.prepared_request[ques_detail] = "";
                            this.processed_request['___' + ques_detail + '___'] = "";
                        } else {
                            this.prepared_request[ques_detail] = "YES";
                            this.processed_request['___' + ques_detail + '___'] = "YES";
                        }
                    } else if (this.lm_request[key].toString().toLowerCase() === 'since') {
                        this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                        this.processed_request['___' + ques_detail + '___'] = this.lm_request[ques_detail];
                    }
                }
            }
        }
        //repeat for each kid
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            if (this.lm_request['adult_count'] === 1)
            {
                this.prepared_request['member_' + member + '_inc'] = member - 1;
                this.processed_request['___member_' + member + '_inc___'] = member - 1;
            }
            this.calculate_bmi(member);
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
            this.prepared_request['member_' + member + '_nominee_name'] = this.lm_request['member_' + member + '_nominee_name'];
            this.processed_request['___member_' + member + '_nominee_name___'] = this.lm_request['member_' + member + '_nominee_name'];
            this.prepared_request['member_' + member + '_nominee_rel'] = this.get_nominee_relation(this.lm_request['member_' + member + '_nominee_rel']);
            this.processed_request['___member_' + member + '_nominee_rel___'] = this.prepared_request['member_' + member + '_nominee_rel'];
            if (this.prepared_request['member_' + member + '_age'] >= 17) {
                this.prepared_request['member_' + member + '_bmi_normal'] = this.check_bmi(this.prepared_request['member_' + member + '_bmi']);
                this.processed_request['___member_' + member + '_bmi_normal___'] = this.prepared_request['member_' + member + '_bmi_normal'];
            } else {
                this.prepared_request['member_' + member + '_bmi_normal'] = 'yes';
                this.processed_request['___member_' + member + '_bmi_normal___'] = 'yes';
            }
            bmi_check = bmi_check === "" ? this.prepared_request['member_' + member + '_bmi_normal'] : bmi_check + "|" + this.prepared_request['member_' + member + '_bmi_normal'];
            for (var key in this.lm_request) {
                if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1) {
                    var ques_detail = key.replace('_type', '_details');
                    var ques_code = key.replace('_type', '_code');
                    if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                        if (this.lm_request[ques_detail] === false) {
                            this.prepared_request[ques_detail] = "";
                            this.processed_request['___' + ques_detail + '___'] = "";
                        } else {
                            this.prepared_request[ques_detail] = "YES";
                            this.processed_request['___' + ques_detail + '___'] = "YES";
                        }
                    } else if (this.lm_request[key].toString().toLowerCase() === 'since') {
                        this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                        this.processed_request['___' + ques_detail + '___'] = this.lm_request[ques_detail];
                    }
                }
            }
        }
        this.prepared_request['bmi_check'] = bmi_check;
        this.processed_request['___bmi_check___'] = bmi_check;
        for (var i = 1; i <= this.lm_request['member_count'] + 1; i++) {
            if (this.processed_request['___member_' + i + '_inc___'] !== undefined && this.processed_request['___member_' + i + '_inc___'] !== '') {
                insured_details += '<InsuredDetails SrNo=' + '"' + this.processed_request['___member_' + i + '_inc___'] + '"'
                        + ' FirstName=' + '"' + this.processed_request['___member_' + i + '_first_name___'].toUpperCase() + '"'
                        + ' LastName=' + '"' + this.processed_request['___member_' + i + '_last_name___'].toUpperCase() + '"'
                        + ' DOB=' + '"' + this.processed_request['___member_' + i + '_birth_date___'] + '"'
                        + ' RelationShip=' + '"' + this.processed_request['___member_' + i + '_relation___'] + '"'
                        + ' InsuredId=' + '"' + this.processed_request['___member_' + i + '_inc___'] + '"'
                        + ' Gender=' + '"' + this.processed_request['___member_' + i + '_gender___'] + '"'
                        + ' NomineeName=' + '"' + this.processed_request['___member_' + i + '_nominee_name___'] + '"'
                        + ' NomineeRelationship=' + '"' + this.processed_request['___member_' + i + '_nominee_rel___'] + '"'
                        + ' PreExistingDisease=' + '"' + this.processed_request['___member_' + i + '_question_1_details___'] + '"'
                        + ' Height=' + '"' + this.processed_request['___member_' + i + '_height___'] + '"'
                        + ' Weight=' + '"' + this.processed_request['___member_' + i + '_weight___'] + '"'
                        + '/>';
            }
        }
        this.prepared_request['member_details'] = insured_details;
        this.processed_request['___member_details___'] = insured_details;
        this.prepared_request['ppcped_accepted'] = this.PPCPED_Accepted();
        this.processed_request['___ppcped_accepted___'] = this.prepared_request['ppcped_accepted'];
    }
    console.log('insurer_product_field_process_pre');
};
HDFCErgoHealth.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

    var product_id = objProduct.db_specific_product.Product_Id;
    var insurer_id = Insurer_Object.Insurer_ID;
    var error_msg = 'NO_ERROR';
    var obj_response_handler;
    if (specific_insurer_object.method.Method_Type === 'Premium') {
        obj_response_handler = this.premium_response_handler(objResponseJson);
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
HDFCErgoHealth.prototype.insurer_product_field_process_post = function () {

};
HDFCErgoHealth.prototype.insurer_product_api_post = function () {

};
HDFCErgoHealth.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
//    console.log('service_call');
    try {
        var objInsurerProduct = this;
        if (specific_insurer_object.method.Method_Calling_Type === 'Database') {
//            var args = JSON.parse(this.method_content);
//            args['ProductPlan_Id'] = docLog['Plan_Id'];
////            let args_1 = {"Insurer_HealthRate_Id": args['Insurer_HealthRate_Id']};
//            var Health_Rate = require(appRoot + '/models/health_rate');
//            console.log("health rate request", args);
//            Health_Rate.findOne(args, function (err, dbHealthRate) {
//                if (err)
//                    throw err;
//                console.log('HdfcErgo Health Rate', dbHealthRate);
//                if (dbHealthRate !== null) {
//                    var objResponseFull = {
//                        'err': err,
//                        'result': dbHealthRate,
//                        'raw': JSON.stringify(dbHealthRate),
//                        'soapHeader': null,
//                        'objResponseJson': dbHealthRate
//                    };
//                    objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
//                }
//            });
            var request = JSON.parse(this.method_content);
//            console.log("health rate request", request);
            var Client = require('node-rest-client').Client;
            var client = new Client();
            var args = {
                data: request,
                headers: {
                    "Content-Type": "application/json"
                }
            };
            client.post(config.environment.weburl + '/health_benefits/hdfc_health_rate_premium', args, function (dbHealthRate, response) {
                if (dbHealthRate && dbHealthRate !== null) {
                    var objResponseFull = {
                        'err': '',
                        'result': dbHealthRate,
                        'raw': JSON.stringify(dbHealthRate),
                        'soapHeader': null,
                        'objResponseJson': dbHealthRate
                    };
                    objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                } else {
                    var objResponseFull = {
                        'err': 'Technical Error Please Retry',
                        'result': dbHealthRate,
                        'raw': JSON.stringify(dbHealthRate),
                        'soapHeader': null,
                        'objResponseJson': dbHealthRate
                    };
                    objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                }
            });
        } else if (specific_insurer_object.method.Method_Calling_Type === 'SOAP') {
            var soap = require('soap');
            var body = docLog.Insurer_Request;
//            console.log(body);
//            console.log(JSON.stringify(body));
            var xml2js = require('xml2js');
            if (this.method.Method_Type === 'Proposal') {
                var args = {
                    str: "<![CDATA[" + body + "]]>"
                };
            } else if (specific_insurer_object.method.Method_Type === 'Pdf') {
                args = {
                    PolicyNo: objInsurerProduct['lm_request']['policy_number'],
                    AgentCode: objInsurerProduct.processed_request['___insurer_integration_agent_code___']
                };
            }
            soap.createClient(specific_insurer_object.method.Service_URL, function (err, client) {
                client[specific_insurer_object.method.Method_Action](args, function (err1, result, raw, soapHeader) {
                    if (err1) {
                        console.error('HDFCErgoHealth', 'service_call', 'exception', err1);
                        var objResponseFull = {
                            'err': err1,
                            'result': result,
                            'raw': raw,
                            'soapHeader': soapHeader,
                            'objResponseJson': null
                        };
                        var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                    } else {
                        var objResponseJson = {};
                        var objResponseJsonLength = Object.keys(result).length;
                        var processedXml = 0;
                        for (var key in result) {
                            var keyJsonObj = JSON.parse('{"' + key + '":{}}');
                            Object.assign(objResponseJson, keyJsonObj);
                            if (result[key].indexOf('<') === 0) {
                                xml2js.parseString(result[key], function (err2, objXml2Json) {
                                    processedXml++;
                                    if (err2) {
                                        console.error('HDFCErgoHealth', 'service_call', 'xml2jsonerror', err2);
                                        var objResponseFull = {
                                            'err': err2,
                                            'result': result,
                                            'raw': raw,
                                            'soapHeader': soapHeader,
                                            'objResponseJson': null
                                        };
                                        objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);

                                    } else {
                                        objResponseJson[key] = objXml2Json;
                                        if (processedXml === objResponseJsonLength) {
                                            var objResponseFull = {
                                                'err': err,
                                                'result': result,
                                                'raw': raw,
                                                'soapHeader': soapHeader,
                                                'objResponseJson': objResponseJson
                                            };
                                            objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                                        }
                                    }
                                });
                            } else {
                                var objResponseFull = {
                                    'err': err,
                                    'result': result,
                                    'raw': raw,
                                    'soapHeader': soapHeader,
                                    'objResponseJson': result
                                };
                                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                            }
                        }
                    }
                });
            });
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};
HDFCErgoHealth.prototype.premium_response_handler = function (objResponseJson) {
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
//        console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
        if (objResponseJson && objResponseJson.hasOwnProperty('Status') && objResponseJson.Status === "SUCCESS" && objResponseJson.hasOwnProperty('Data')) {
            var objPremiumService = objResponseJson['Data'];
            var premium_breakup = this.get_const_premium_breakup();
            premium_breakup['base_premium'] = objPremiumService['base_premium'];
            premium_breakup['service_tax'] = objPremiumService['service_tax'];
            premium_breakup['final_premium'] = objPremiumService['final_premium'];
            premium_breakup['tax']['CGST'] = objPremiumService['tax']['CGST'];
            premium_breakup['tax']['SGST'] = objPremiumService['tax']['SGST'];
            premium_breakup['net_premium'] = objPremiumService['base_premium'];
            objServiceHandler.Premium_Breakup = premium_breakup;
            objServiceHandler.Error_Msg = Error_Msg;
            objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['insurer_health_rate_id'];
//            console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
        } else if (objResponseJson && objResponseJson.hasOwnProperty('Status') && objResponseJson.Status === "FAIL") {
            Error_Msg = objResponseJson.Msg;
        } else {
            Error_Msg = 'LM_MSG:MAIN_NODE_MISSING';
        }
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
HDFCErgoHealth.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson.hasOwnProperty('InputXMLResult')) {
            if (objResponseJson['InputXMLResult'].hasOwnProperty('WsResult')) {
                if (objResponseJson['InputXMLResult']['WsResult'].hasOwnProperty('WsResultSet')) {
                    if (objResponseJson['InputXMLResult']['WsResult']['WsResultSet']['0']['WsStatus']['0'] !== "0") {
                        Error_Msg = objResponseJson['InputXMLResult']['WsResult']['WsResultSet']['0']['WsMessage']['0'];
                    }
                } else {
                    Error_Msg = "LM_MSG:WsResultSet_NODE_MISSING";
                }
            } else {
                Error_Msg = "LM_MSG:WsResult_NODE_MISSING";
            }
        } else {
            Error_Msg = JSON.stringify(objResponseJson);
        }

        if (Error_Msg === 'NO_ERR') {
            var pg_data = {
                'CustomerID': objResponseJson['InputXMLResult']['WsResult']['WsResultSet']['0']['WsMessage']['0'],
                'TxnAmount': Math.round(this.lm_request['final_premium']),
                'AdditionalInfo1': 'NB',
                'AdditionalInfo2': 'HSP',
                'AdditionalInfo3': '1',
                'hdnPayMode': 'CC',
                'UserName': this.lm_request['first_name'] + ' ' + this.lm_request['last_name'],
                'UserMailId': this.lm_request['email'],
                'ProductCd': 'HSP',
                'ProducerCd': this.processed_request['___insurer_integration_agent_code___'],
                'ReturnURL': this.const_payment.pg_ack_url
            };
            objServiceHandler.Payment.pg_data = pg_data;
            objServiceHandler.Payment.pg_redirect_mode = 'POST';
            objServiceHandler.Insurer_Transaction_Identifier = pg_data['CustomerID'];
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
HDFCErgoHealth.prototype.pg_response_handler = function () {
    try {
        console.log('Start', this.constructor.name, 'pg_response_handler');
        if (this.lm_request.pg_redirect_mode === 'GET') {
            var output = this.const_payment_response.pg_get;
            if (output && output.Msg && output.Msg === "Successfull") {
                this.const_policy.transaction_id = output['ProposalNo'];
                if (output['Msg'].indexOf('Success') > -1) {
                    this.const_policy.pg_status = 'SUCCESS';
                    this.const_policy.transaction_status = 'SUCCESS';
                    if (output['PolicyNo'] !== '' && output['PolicyNo'] !== '0') {
                        this.const_policy.transaction_substatus = 'IF';
                        this.const_policy.policy_number = output['PolicyNo'];
                        this.const_policy.pg_reference_number_1 = output['PolicyNo'];
                    } else {
                        this.const_policy.transaction_substatus = 'UW';
                    }
                    this.const_policy.transaction_amount = this.lm_request['final_premium'];
                } else {
                    this.const_policy.pg_status = 'FAIL';
                    this.const_policy.transaction_status = 'FAIL';
                }
            } else {
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
            }
        } else {
            if (this.const_payment_response.hasOwnProperty('pg_post') && this.const_payment_response.pg_post.hasOwnProperty('hdmsg')) {
                var msg = this.const_payment_response.pg_post['hdmsg'];
                var str = msg.split('|');
                this.const_policy.transaction_id = str[2];
                if (msg.indexOf('|0300|') > -1) {
                    this.const_policy.pg_status = 'SUCCESS';
                    this.const_policy.transaction_status = 'SUCCESS';
                    this.const_policy.transaction_amount = str[4];
                    this.const_policy.policy_number = this.const_payment_response.pg_post['txtPGCustCode'];
                    this.const_policy.pg_reference_number_1 = this.const_payment_response.pg_post['txtPGCustCode'];
                } else {
                    this.const_policy.pg_status = 'FAIL';
                    this.const_policy.transaction_status = 'FAIL';
                }
            } else {
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
            }
        }
        console.error('End', this.constructor.name, 'pg_response_handler', this.const_policy);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
HDFCErgoHealth.prototype.verification_response_handler = function (objResponseJson) {
    console.error('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (this.const_policy.transaction_status === 'SUCCESS') {//transaction success  
            var pdf_file_name = this.constructor.name + '_' + "Health" + '_' + this.const_policy.policy_number + '.pdf';
            var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
            var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
            this.const_policy.policy_url = pdf_web_path_portal;
            try {
                var args = {
                    data: {
                        "search_reference_number": this.lm_request['search_reference_number'],
                        "api_reference_number": this.lm_request['api_reference_number'],
                        "policy_number": this.const_policy.policy_number,
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
        }
        objServiceHandler.Insurer_Transaction_Identifier = this.const_policy.transaction_id;
        objServiceHandler.Policy = this.const_policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
HDFCErgoHealth.prototype.pdf_call = function (url, args, pdf_sys_loc) {
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
};
HDFCErgoHealth.prototype.pdf_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'pdf_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    try {
        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null,
            'Policy': null
        };
        var policy = {
            'policy_url': null,
            'policy_number': this.lm_request['policy_number'],
            'pdf_status': null
        };
        if (objResponseJson.hasOwnProperty('GetPSSPDFInBytesResult') && objResponseJson['GetPSSPDFInBytesResult'] !== '') {
        } else {
            Error_Msg = objResponseJson;
        }
        if (Error_Msg === 'NO_ERR') {
            var pdf_file_name = this.constructor.name + '_Health_' + this.lm_request['policy_number'] + '.pdf';
            var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
            var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
            var binary = new Buffer(objResponseJson['GetPSSPDFInBytesResult'], 'base64');
            fs.writeFileSync(pdf_sys_loc, binary);
            policy.policy_url = pdf_web_path_portal;
            policy.pdf_status = 'SUCCESS';
        } else {
            policy.pdf_status = 'FAIL';
        }
        objServiceHandler.Insurer_Transaction_Identifier = this.lm_request['policy_number'];
        objServiceHandler.Policy = policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'pdf_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'pdf_response_handler', ex);
    }
    return objServiceHandler;
};
HDFCErgoHealth.prototype.get_member_relation = function (i) {
    console.log(this.constructor.name, 'get_member_relation', 'Start HDFCErgoHealth');
    var gender = this.lm_request['member_' + i + '_gender'];
    console.log("Gender in HDFCErgoHealth " + gender);
    if (this.prepared_request["relation"] === 'M' || this.prepared_request["relation"] === 'F') {
        return(gender === 'M' ? 'S' : 'D');
    }
    if (this.prepared_request["relation"] === 'S' || this.prepared_request["relation"] === 'D') {
        return(gender === 'M' ? 'F' : 'M');
    }
    if (this.prepared_request["relation"] === 'W' || this.prepared_request["relation"] === 'H') {
        if (i >= 3) {
            return(gender === 'M' ? 'S' : 'D');
        } else if (i === 2) {
            return(gender === 'M' ? 'H' : 'W');
        } else if (i === 1) {
            return(gender === 'M' ? 'H' : 'W');
        }
    }
    if (this.prepared_request["relation"] === 'I') {
        if (i >= 3) {
            return(gender === 'M' ? 'S' : 'D');
        } else if (i === 1) {
            return 'I';
        } else if (i === 2) {
            return(gender === 'M' ? 'H' : 'W');
        }
    }
    return '';
    console.log(this.constructor.name, 'get_member_relation', 'End HDFCErgoHealth');
};
HDFCErgoHealth.prototype.get_nominee_relation = function (rel) {
    if (rel === 'H' || rel === 'W') {
        return 'S';
    } else if (rel === 'S' || rel === 'D') {
        return 'C';
    } else if (rel === 'M' || rel === 'F') {
        return 'P';
    } else {
        return 'R';
    }
};
HDFCErgoHealth.prototype.premium_breakup_schema = {
    "net_premium": "premium",
    "CGST": "CGST",
    "SGST": "SGST",
    "service_tax": "serviceTax",
    "final_premium": "totalPremium",
    "base_premium": "base_premium",
    "health_rate_id_by_age": "health_rate_id_by_age"
};
HDFCErgoHealth.prototype.calculate_bmi = function (i) {
    var height = this.prepared_request['member_' + i + '_height'];
    var weight = this.prepared_request['member_' + i + '_weight'];

    var bmi = Math.round((weight / height / height) * 10000);
    this.prepared_request['member_' + i + '_bmi'] = bmi;
    this.processed_request['___member_' + i + '_bmi___'] = bmi;
};
HDFCErgoHealth.prototype.check_bmi = function (bmi) {
    if (bmi < 17 || bmi > 31) {
        return "no";
    } else {
        return "yes";
    }
};
HDFCErgoHealth.prototype.PPCPED_Accepted = function () {
    if (this.processed_request["___member_1_age___"] > 18) {
        if (this.processed_request['___bmi_check___'].includes("no")) {
            return "1";
        }
    }
    if ((this.prepared_request['health_insurance_si'] - 0 >= 2500000) && (this.prepared_request['health_insurance_si'] - 0 <= 50000000)) {
        if (this.processed_request["___member_1_age___"] >= 18) {
            return "1";
        }
    } else {
        if (this.processed_request["___member_1_age___"] >= 45) {
            return "1";
        }
    }
    if (this.lm_request['member_count'] === 1) {
        if (this.prepared_request['member_1_age'] >= 18 && this.prepared_request['member_1_age'] < 46) {
            return '1';
        }
    }
    return '0';
};
HDFCErgoHealth.prototype.get_member_age_in_months = function (birth_date) {
    console.log(this.constructor.name, 'get_member_age', 'Start');
    let moment =  require('moment');
    var date = moment(birth_date).format('DD-MM-YYYY');
    if (date !== '') {
        return moment().diff(date, 'months');
    }
    return 0;
    console.log(this.constructor.name, 'get_member_age', 'End');
};
HDFCErgoHealth.prototype.is_valid_plan = function (lm_request, planCode) {
    console.log('HDFCErgoHealth is_valid_plan', 'start');
    var index = -1;
    let child_allowed = lm_request['child_count'] < 3 ? true : false;
    var age = true;
    if (lm_request['member_1_age'] > 45) {
        age = false;
    }

    var HDFC_Plans = [
        {'code': "SilverSmart", 'min_si': 99000, 'max_si': 500000},
        {'code': "GoldSmart", 'min_si': 500000, 'max_si': 1500000},
        {'code': "PlatinumSmart", 'min_si': 1500000, 'max_si': 7500000}
    ];
    index = HDFC_Plans.findIndex(x => x.code === planCode && child_allowed === true && age === true
                && x.min_si < (lm_request['health_insurance_si'] - 0)
                && x.max_si >= (lm_request['health_insurance_si'] - 0));
    return (index > -1 ? true : false);
    console.log('HDFCErgoHealth is_valid_plan', 'End');
};
module.exports = HDFCErgoHealth;