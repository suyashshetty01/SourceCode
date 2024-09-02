/* Author : Revati Ghadge
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var util = require('util');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var Cyber = require(appRoot + '/libs/CyberSecurity');
var config = require('config');
var fs = require('fs');
function HDFCErgoCyber() {

}
util.inherits(HDFCErgoCyber, Cyber);
HDFCErgoCyber.prototype.insurer_date_format = 'dd/MM/yyyy';
HDFCErgoCyber.prototype.const_insurer_suminsured = [50000, 100000, 500000, 2000000, 5000000, 10000000];
HDFCErgoCyber.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
HDFCErgoCyber.prototype.insurer_product_field_process_pre = function () {
    if (this.lm_request['method_type'] === 'Premium') {
        var args = {
            "Insurer_Id": 5,
            "Plan_Id": this.processed_request['___Plan_Id___'],
            "Sum_Insured": this.prepared_request["cs_insurance_si"] - 0,
            "Policy_Term_Year": 1,
//            "Policy_Type": "individual",
            "Is_Active": 1
        };
        this.method_content = JSON.stringify(args);
    }
    if (this.lm_request['method_type'] === 'Proposal') {
        var Addon_Amt = 0;
        if (this.lm_request['addon_apply'] === true) {
            var prm_brkup = this.insurer_master['service_logs']['insurer_db_master'].Premium_Breakup;
            var Addon = prm_brkup['addon'];
            for (var key in Addon) {
                if (!key.includes('final') && (Addon[key] - 0) > 0) {
                    Addon_Amt += Math.round(Addon[key] - 0);
                }
            }
            this.prepared_request["addon_rate"] = Addon_Amt;
            this.processed_request["___addon_rate___"] = this.prepared_request["addon_rate"];
            this.prepared_request["protection_selected"] = 'Y';
            this.processed_request["___protection_selected___"] = this.prepared_request["protection_selected"];
        } else {
            this.prepared_request["addon_rate"] = Addon_Amt;
            this.processed_request["___addon_rate___"] = this.prepared_request["addon_rate"];
            this.prepared_request["protection_selected"] = 'N';
            this.processed_request["___protection_selected___"] = this.prepared_request["protection_selected"];
        }
        this.prepared_request['plan_code'] = "Plan" + this.insurer_master['service_logs']['insurer_db_master']['Insurer_Response'].CyberRate_Id;
        this.processed_request["___plan_code___"] = this.prepared_request['plan_code'];
        this.prepared_request["service_tax"] = this.lm_request["service_tax"];
        this.processed_request["___service_tax___"] = this.prepared_request["service_tax"];
        this.prepared_request['source_of_income'] = this.lm_request["source_of_income"];
        this.processed_request['___source_of_income___'] = this.prepared_request['source_of_income'];
        this.prepared_request["city"] = this.lm_request["city"];
        this.processed_request["___city___"] = this.prepared_request["city"];
        this.prepared_request["state"] = this.lm_request["state"];
        this.processed_request["___state___"] = this.prepared_request["state"];
        this.processed_request['___pan___'] = this.prepared_request['pan'] !== null ? (this.prepared_request['pan']).toUpperCase() : '';
        if (this.processed_request['___dbmaster_pb_plan_id___'] === 1801) {
            this.prepared_request["plan_type"] = 'NF';
            this.prepared_request["insured_count"] = 1;
        } else {
            this.prepared_request["plan_type"] = 'WF';
            this.prepared_request["insured_count"] = 4;
        }
        this.processed_request["___plan_type___"] = this.prepared_request["plan_type"];
        this.processed_request["___insured_count___"] = this.prepared_request["insured_count"];

        for (var key in this.lm_request) {
            if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1) {
                var ques_detail = key.replace('_type', '_details');
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
    console.log('insurer_product_field_process_pre');
};
HDFCErgoCyber.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
HDFCErgoCyber.prototype.insurer_product_field_process_post = function () {

};
HDFCErgoCyber.prototype.insurer_product_api_post = function () {

};
HDFCErgoCyber.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    console.log('service_call');
    try {
        var objInsurerProduct = this;
        if (specific_insurer_object.method.Method_Calling_Type === 'Database') {
            var args = JSON.parse(this.method_content);
            args['Plan_Id'] = docLog['Plan_Id'];
            var Cyber_Rate = require(appRoot + '/models/cyber_rate');
            Cyber_Rate.findOne(args, function (err, dbCyberRate) {
                if (err)
                    throw err;
                console.log('HdfcErgo Cyber Rate', dbCyberRate);
                if (dbCyberRate !== null) {
                    var objResponseFull = {
                        'err': err,
                        'result': dbCyberRate,
                        'raw': JSON.stringify(dbCyberRate),
                        'soapHeader': null,
                        'objResponseJson': dbCyberRate
                    };
                    objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                }
            });
        } else if (specific_insurer_object.method.Method_Calling_Type === 'SOAP') {
            var soap = require('soap');
            var body = docLog.Insurer_Request;
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
                        console.error('HDFCErgoCyber', 'service_call', 'exception', err1);
                        var objResponseFull = {
                            'err': err1,
                            'result': result,
                            'raw': raw,
                            'soapHeader': soapHeader,
                            'objResponseJson': null
                        };
                        objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
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
                                        console.error('HDFCErgoCyber', 'service_call', 'xml2jsonerror', err2);
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
                                objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
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
HDFCErgoCyber.prototype.premium_response_handler = function (objResponseJson) {
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
        if (objResponseJson !== null && objResponseJson.hasOwnProperty('_doc')) {
            var objPremiumService = objResponseJson['_doc'];
            if (objPremiumService.hasOwnProperty('Premium')) {
                var base_premium = (objPremiumService['Premium'] - 0);
                var premium_breakup = this.get_const_premium_breakup();
                premium_breakup['service_tax'] = base_premium * 0.18;
                premium_breakup['final_premium'] = Math.round(base_premium + premium_breakup['service_tax']);
                premium_breakup['tax']['CGST'] = premium_breakup['service_tax'] / 2;
                premium_breakup['tax']['SGST'] = premium_breakup['service_tax'] / 2;
                premium_breakup['net_premium'] = base_premium;
                premium_breakup['addon']['addon_malware'] = (objPremiumService['AddonRate'] - 0);
                var addon_net_premium = base_premium + premium_breakup['addon']['addon_malware'];
                var addon_service_tax = addon_net_premium * 0.18;
                premium_breakup['addon']['addon_final_premium'] = Math.round(addon_net_premium + addon_service_tax);
                objServiceHandler.Premium_Breakup = premium_breakup;
            } else {
                Error_Msg = 'LM_MSG:MAIN_NODE_MISSING';
            }
            objServiceHandler.Insurer_Transaction_Identifier = this.timestamp();
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'premium_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
HDFCErgoCyber.prototype.proposal_response_handler = function (objResponseJson) {
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
                'AdditionalInfo2': 'eSecure',
                'AdditionalInfo3': '1',
                'hdnPayMode': 'CC',
                'UserName': this.lm_request['first_name'] + ' ' + this.lm_request['last_name'],
                'UserMailId': this.lm_request['email'],
                'ProductCd': 'eSecure',
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
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
HDFCErgoCyber.prototype.pg_response_handler = function () {
    try {
        console.log('Start', this.constructor.name, 'pg_response_handler');
        if (this.lm_request.pg_redirect_mode === 'GET') {
            var output = this.const_payment_response.pg_get;
            this.const_policy.transaction_id = output['ProposalNo'];
            if (output['Msg'].indexOf('Success') > -1) {
                this.const_policy.pg_status = 'SUCCESS';
                if (output['PolicyNo'] !== '' && output['PolicyNo'] !== '0') {
                    this.const_policy.transaction_status = 'SUCCESS';
                    this.const_policy.policy_number = output['PolicyNo'];
                    this.const_policy.pg_reference_number_1 = output['PolicyNo'];
                } else {
                    this.const_policy.transaction_status = 'FAIL';
                }
                this.const_policy.transaction_amount = this.lm_request['final_premium'];
            } else {
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
            }
        } else {
            var msg = this.const_payment_response.pg_post['hdmsg'];
            var str = msg.split('|');
            this.const_policy.transaction_id = str[2];
            if (msg.indexOf('|0300|') > -1)
            {
                this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.transaction_status = 'SUCCESS';
                this.const_policy.transaction_amount = str[4];
                this.const_policy.policy_number = this.const_payment_response.pg_post['txtPGCustCode'];
                this.const_policy.pg_reference_number_1 = this.const_payment_response.pg_post['txtPGCustCode'];
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
HDFCErgoCyber.prototype.verification_response_handler = function (objResponseJson) {
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
            var pdf_file_name = this.constructor.name + '_Cyber_' + this.const_policy.policy_number + '.pdf';
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
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
HDFCErgoCyber.prototype.pdf_call = function (url, args, pdf_sys_loc) {
    var objInsurerProduct = this;
    objInsurerProduct.pdf_attempt++;
    var Client = require('node-rest-client').Client;
    var client = new Client();
    client.post(url, args, function (data) {
        if (data.Error_Code !== '' || true) {
            if (!fs.existsSync(pdf_sys_loc) && objInsurerProduct.pdf_attempt < 11) {
                var sleep = require('system-sleep');
                sleep(600000);
                objInsurerProduct.pdf_call(url, args, pdf_sys_loc);
            }
        }
    });
};
HDFCErgoCyber.prototype.pdf_response_handler = function (objResponseJson) {
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
            var pdf_file_name = this.constructor.name + '_Cyber_' + this.lm_request['policy_number'] + '.pdf';
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
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'pdf_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
HDFCErgoCyber.prototype.get_member_relation = function (i) {
    console.log(this.constructor.name, 'get_member_relation', 'Start HDFCErgoCyber');
    var gender = this.lm_request['member_' + i + '_gender'];
    console.log("Gender in HDFCErgoCyber " + gender);
    if (this.prepared_request["relation"] === 'M' || this.prepared_request["relation"] === 'F') {
        return(gender === 'M' ? 'S' : 'D');
    }
    if (this.prepared_request["relation"] === 'S' || this.prepared_request["relation"] === 'D') {
        return(gender === 'M' ? 'F' : 'M');
    }
    if (this.prepared_request["relation"] === 'W' || this.prepared_request["relation"] === 'H') {
        if (i >= 3) {
            return(gender === 'M' ? 'S' : 'D');
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
    console.log(this.constructor.name, 'get_member_relation', 'End HDFCErgoCyber');
};
HDFCErgoCyber.prototype.get_nominee_relation = function (rel) {
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

//HDFCErgoCyber.prototype.is_valid_plan = function (lm_request, planCode) {
//    console.log('HDFCErgoCyber is_valid_plan', 'start');
//    var index = -1;
//    var HDFC_Plans = [
//        {'code': "Plan1", 'si': 50000, 'policy_type': 'individual'},
//        {'code': "Plan2", 'si': 100000, 'policy_type': 'individual'},
//        {'code': "Plan3", 'si': 500000, 'policy_type': 'individual'},
//        {'code': "Plan4", 'si': 500000, 'policy_type': 'floater'},
//        {'code': "Plan5", 'si': 2000000, 'policy_type': 'individual'},
//        {'code': "Plan6", 'si': 2000000, 'policy_type': 'floater'},
//        {'code': "Plan7", 'si': 5000000, 'policy_type': 'individual'},
//        {'code': "Plan8", 'si': 5000000, 'policy_type': 'floater'},
//        {'code': "Plan9", 'si': 10000000, 'policy_type': 'individual'},
//        {'code': "Plan10", 'si': 10000000, 'policy_type': 'floater'}
//    ];
//    index = HDFC_Plans.findIndex(x => x.code === planCode
//                && x.si === (lm_request['cs_insurance_si'] - 0)
//                && x.policy_type === lm_request['cs_insurance_type']);
//    return (index > -1 ? true : false);
//    console.log('HDFCErgoCyber is_valid_plan', 'End');
//};
module.exports = HDFCErgoCyber;