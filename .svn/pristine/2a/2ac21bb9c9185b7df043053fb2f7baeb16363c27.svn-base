/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var util = require('util');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var Travel = require(appRoot + '/libs/Travel');
var fs = require('fs');
var config = require('config');
var moment = require('moment');
function FutureGeneraliTravel() {

}
util.inherits(FutureGeneraliTravel, Travel);
FutureGeneraliTravel.prototype.lm_request_single = {};
FutureGeneraliTravel.prototype.insurer_integration = {};
FutureGeneraliTravel.prototype.insurer_addon_list = [];
FutureGeneraliTravel.prototype.insurer = {};
FutureGeneraliTravel.prototype.insurer_date_format = 'dd/MM/yyyy';
//FutureGeneraliTravel.prototype.const_insurer_suminsured = [50000, 100000, 150000, 200000, 250000, 300000, 350000, 400000, 450000, 500000, 1000000, 1500000, 2000000, 2500000, 5000000, 10000000];
FutureGeneraliTravel.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
FutureGeneraliTravel.prototype.insurer_product_field_process_pre = function () {
    this.prepared_request['timestamp'] = this.timestamp();
    this.processed_request['___timestamp___'] = this.prepared_request['timestamp'];
    this.processed_request['___travel_start_date___'] = this.processed_request['___policy_start_date___'];
    this.get_product_details();
    if (this.lm_request['method_type'] === 'Premium') {
        for (member = 1; member <= this.lm_request['adult_count']; member++) {
            this.get_member_relation(member);
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            this.get_member_relation(member);
        }
    }

    if (this.lm_request['method_type'] === 'Proposal') {
        this.processed_request['___marital_status___'] = this.lm_request['travel_insurance_type'] === "floater" ? "M" : "S";
        let country_details = "";
        let plan_details = this.prepared_request['dbmaster_insurer_transaction_identifier'].split('|');
        if (plan_details.length > 0) {
            this.processed_request['___plan_name___'] = plan_details[0];
            this.processed_request['___coverage_value___'] = plan_details[1];
            this.processed_request['___plan_value___'] = plan_details[2];
        }

        let index = this.lm_request['otherDetailsData'].findIndex(x => x.id === '404');
        this.prepared_request['travel_purpose'] = this.lm_request['otherDetailsData'][index].value;
        this.processed_request['___travel_purpose___'] = this.prepared_request['travel_purpose'];
        this.prepared_request['travel_purpose_name'] = this.lm_request['other_detail_404_text'];
        this.processed_request['___travel_purpose_name___'] = this.prepared_request['travel_purpose_name'];
        this.prepared_request['visa_type'] = this.lm_request['other_detail_403_text'];
        this.processed_request['___visa_type___'] = this.prepared_request['visa_type'];

        for (let i = 0; i < this.lm_request['visiting_countries'].length; i++) {
            country_details += '<Countries><Countries>' + this.lm_request['visiting_countries'][i].item_text + '</Countries><Continent>' + this.get_continent(this.lm_request['visiting_countries'][i].item_text) + '</Continent></Countries>';
        }
        this.prepared_request['country_details'] = country_details;
        this.processed_request['___country_details___'] = country_details;

        let txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        let txt_replace_with = "";
        this.processed_request['___member_has_ped___'] = 'N';
        for (let member = 1; member <= this.lm_request['adult_count']; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.get_member_relation(member);
            if (this.prepared_request['member_' + member + '_ped'] !== "") {
                this.processed_request['___member_has_ped___'] = "Y";
            }
            this.prepared_request['member_' + member + '_occupation_text'] = this.lm_request['member_' + member + '_occupation_text'];
            this.processed_request['___member_' + member + '_occupation_text___'] = this.prepared_request['member_' + member + '_occupation_text'];
        }
        for (let member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.get_member_relation(member);
            if (this.prepared_request['member_' + member + '_ped'] !== "") {
                this.processed_request['___member_has_ped___'] = "Y";
            }
            this.prepared_request['member_' + member + '_occupation_text'] = this.lm_request['member_' + member + '_occupation_text'];
            this.processed_request['___member_' + member + '_occupation_text___'] = this.prepared_request['member_' + member + '_occupation_text'];
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
    }
    if (this.lm_request['method_type'] === 'Verification') {
        this.method_content = this.insurer_master['service_logs']['pb_db_master']['Insurer_Request'];
        let final_amoumt = this.insurer_master['service_logs']['pb_db_master']['Payment']['pg_data']['PremiumAmount'];
        let unique_trans_key = this.lm_request['pg_get']['WS_P_ID'] + this.processed_request['___timestamp___'];
        let obj_replace = {
            '<Uid></Uid>': '<Uid>' + this.processed_request['___timestamp___'] + '</Uid>',
            '<UniqueTranKey></UniqueTranKey>': '<UniqueTranKey>' + unique_trans_key + '</UniqueTranKey>',
            '<TranRefNo></TranRefNo>': '<TranRefNo>' + this.lm_request['pg_get']['PGID'] + '</TranRefNo>',
            '<Amount></Amount>': '<Amount>' + final_amoumt + '</Amount>'
        };
        this.method_content = this.method_content.toString().replaceJson(obj_replace);
    }

    this.method_content = this.method_content.replaceAll(/<!--(.*?)-->/g, "");
    console.log(this.method_content);
};
FutureGeneraliTravel.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {
    let obj_response_handler;
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
FutureGeneraliTravel.prototype.insurer_product_field_process_post = function () {

};
FutureGeneraliTravel.prototype.insurer_product_api_post = function () {

};
FutureGeneraliTravel.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    try {
        var objInsurerProduct = this;
        var soap = require('soap');
        var xml2js = require('xml2js');
        console.log(docLog.Insurer_Request);
        if (specific_insurer_object.method.Method_Type !== 'Pdf') {
            var args = {
                Product: "Travel",
                XML: docLog.Insurer_Request
            };
            soap.createClient(specific_insurer_object.method_file_url, function (err, client) {
                try {
                    client.setEndpoint(specific_insurer_object.method_file_url.split('?')['0']);
                    client[specific_insurer_object.method.Method_Action](args, function (err1, result, raw, soapHeader) {
//                        console.log(err1, result, raw, soapHeader);
                        if (err1) {
                            console.error('FutureGeneraliTravel', 'service_call', 'exception', err1);
                            var objResponseFull = {
                                'err': err1,
                                'result': result,
                                'raw': raw,
                                'soapHeader': soapHeader,
                                'objResponseJson': null
                            };
                            objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                        } else {
                            var filter_response = result['CreatePolicyResult'].includes("Root") ? result['CreatePolicyResult'] : '<Root>' + result['CreatePolicyResult'] + '</Root>';
                            xml2js.parseString(filter_response, {ignoreAttrs: true}, function (err2, objXml2Json) {
                                var objXml2Json = JSON.parse(JSON.stringify(objXml2Json));
                                if (err2) {
                                    console.error('Exception', this.constructor.name, 'service_call', err2);
                                } else {
                                    var objResponseFull = {
                                        'err': null,
                                        'result': result,
                                        'raw': raw,
                                        'soapHeader': null,
                                        'objResponseJson': objXml2Json
                                    };
                                    objResponseFull['objResponseJson']['PlanCode'] = docLog['Plan_Code'];
                                    objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                                }
                            });
                        }

                    });
                } catch (e) {
                    console.error('Exception', this.constructor.name, 'service_call', e);
                }
            });
        } else {
            var Client = require('node-rest-client').Client;
            var client = new Client();
            var args = {
                data: docLog.Insurer_Request,
                headers: {
                    "SOAPAction": "http://tempuri.org/IService1/" + specific_insurer_object.method.Method_Action,
                    "Content-Type": "text/xml;charset=UTF-8"
                }
            };
            client.post(specific_insurer_object.method.Service_URL, args, function (data) {
                var objData = JSON.stringify(data);
                var objReplace = {
                    's:E': 'E', 's:B': 'B'
                };
                var filter_response = objData.replaceJson(objReplace);
                var objResponseFull = {
                    'err': null,
                    'result': JSON.stringify(data),
                    'raw': JSON.stringify(data),
                    'soapHeader': null,
                    'objResponseJson': JSON.parse(filter_response)
                };
                objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
            });
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }

};
FutureGeneraliTravel.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    let objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    let Error_Msg = 'NO_ERR';
    try {
        let objDetails = objResponseJson['Root'];
        if (objDetails.hasOwnProperty('Policy')) {
            let objPlanDetails = objDetails['Policy'][0]['TravelPlan'];
            let premium_breakup = this.get_const_premium_breakup();
            for (let p = 0; p < objPlanDetails.length; p++) {
                if (objPlanDetails[p]['PlanName'][0].includes(objResponseJson['PlanCode']) && objPlanDetails[p]['ContractType'][0] === this.processed_request['___contract_type___']) {
                    premium_breakup['net_premium'] = Number(objPlanDetails[p]['ToatlPremiumAmount'][0]);
                    premium_breakup['service_tax'] = Number(objPlanDetails[p]['ServiceTaxAmount'][0]);
                    premium_breakup['tax']['CGST'] = premium_breakup['service_tax'] / 2;
                    premium_breakup['tax']['SGST'] = premium_breakup['service_tax'] / 2;
                    premium_breakup['final_premium'] = Number(objPlanDetails[p]['PremiumWithServiceTax'][0]);
                    premium_breakup['travel_insurance_si'] = (objPlanDetails[p]['SumInsuredCurrency'][0].includes("Euro") ? "€" : "$") + objPlanDetails[p]['SumInsured'][0].replaceAll(",", "");
                    objServiceHandler.Premium_Breakup = premium_breakup;
                    objServiceHandler.Insurer_Transaction_Identifier = objPlanDetails[p]['PlanName']['0'] + "|" + objPlanDetails[p]['RiskType']['0'] + "|" + objPlanDetails[p]['PlanCode']['0'];
                    break;
                } else {
                    objServiceHandler.Premium_Breakup = premium_breakup;
                    objServiceHandler.Insurer_Transaction_Identifier = "";
                }
            }
        } else
        {
            if (objDetails.hasOwnProperty('ErrorMsg'))
            {
                Error_Msg = objDetails['ErrorMsg'][0].toString();
            } else if (objDetails.hasOwnProperty('ValidationError')) {
                Error_Msg = objDetails['ValidationError'][0].toString();
            } else {
                Error_Msg = JSON.stringify(objDetails);
            }
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
    } catch (ex) {
        let Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'premium_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
FutureGeneraliTravel.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    let objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    let Error_Msg = 'NO_ERR';
    let final_premium = this.prepared_request['final_premium'];
    let member = 1;
    for (member = 1; member <= this.prepared_request['adult_count']; member++) {
        if (this.prepared_request['health_insurance_type'] === "floater" && this.prepared_request['member_' + member + '_marital_status'] === "S") {
            Error_Msg = "Marital status selected as Single";
        }
    }
//    if (this.prepared_request["relation"] !== 'SELF') {
//        Error_Msg = "Proposer should also be insured";
//    }
    if (this.lm_request['question_401_details'] === false) {
        Error_Msg = (Error_Msg !== 'NO_ERR') ? Error_Msg + '| ' + "This policy can be availed only by Citizen of India" : "This policy can be availed only by Citizen of India";
    } else if (this.lm_request['question_402_details'] === true) {
        Error_Msg = (Error_Msg !== 'NO_ERR') ? Error_Msg + '| ' + "This policy can not be availed if traveller has departed from India" : "This policy can not be availed if traveller has departed from India";
    } else if (this.processed_request['___member_has_ped___'] === "Y") {
        Error_Msg = (Error_Msg !== 'NO_ERR') ? Error_Msg + '| ' + "Regret, policy cannot be issued online in-case insured members have PED" : "Regret, policy cannot be issued online in-case insured members have PED";
    }
    try
    {
        if (Error_Msg === 'NO_ERR')
        {
            pg_data = {
                'TransactionID': this.prepared_request['timestamp'],
                'PaymentOption': 3,
                'ResponseURL': this.const_payment.pg_ack_url,
                'ProposalNumber': this.current_time() + this.lm_request["crn"],
                'PremiumAmount': Math.round(final_premium),
                'UserIdentifier': 'NA',
                'UserId': 'NA',
                'FirstName': this.lm_request['first_name'],
                'LastName': this.lm_request['last_name'],
                'Mobile': this.lm_request['mobile'],
                'Email': this.lm_request['email']
            };
            objServiceHandler.Payment.pg_data = pg_data;
            objServiceHandler.Payment.pg_redirect_mode = 'POST';
            objServiceHandler.Insurer_Transaction_Identifier = 'PB' + this.lm_request['crn'];
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    } catch (ex)
    {
        let Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
FutureGeneraliTravel.prototype.pg_response_handler = function () {
    try {
        let Output = this.const_payment_response.pg_get;
        this.const_policy.transaction_id = Output['WS_P_ID'];
        if (Output['Response'].indexOf('Success') > -1) {
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.transaction_amount = Output['Premium'];
            this.const_policy.pg_reference_number_1 = Output['PGID'];
        } else {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
        console.error('End', this.constructor.name, 'pg_response_handler', this.const_policy);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
FutureGeneraliTravel.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    let objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    let Error_Msg = 'NO_ERR';
    let client_id = "";
    let receipt_no = "";
    let policy_no = "";
    try {
        if (this.const_policy.pg_status === 'FAIL') {
        }
        if (this.const_policy.pg_status === 'SUCCESS') {

            if (objResponseJson.hasOwnProperty("Root"))
            {
                if (objResponseJson["Root"].hasOwnProperty("ValidationError")) {
                    Error_Msg = objResponseJson["Root"]["ValidationError"][0];
                } else if (objResponseJson["Root"].hasOwnProperty("Status") && objResponseJson["Root"]["Status"][0] === 'Fail') {
                    Error_Msg = objResponseJson["Root"]["ErrorMessage"][0];
                } else {
                    if (objResponseJson["Root"].hasOwnProperty("Client")) {
                        if (objResponseJson["Root"]["Client"][0]["Status"][0] !== "Fail") {
                            client_id = objResponseJson["Root"]["Client"][0]["ClientId"][0];
                        }
                    }
                    if (objResponseJson["Root"].hasOwnProperty("Receipt"))
                    {
                        if (objResponseJson["Root"]["Receipt"][0]["Status"][0] !== "Fail") {
                            receipt_no = objResponseJson["Root"]["Receipt"][0]["ReceiptNo"][0];
                        }
                    }
                    if (objResponseJson["Root"].hasOwnProperty("Policy"))
                    {
                        if (objResponseJson["Root"]["Policy"][0].hasOwnProperty("Status"))
                        {
                            if (objResponseJson["Root"]["Policy"][0]["Status"][0] === "Fail")
                            {
                                Error_Msg = objResponseJson["Root"]["Policy"][0]["Message"][0]; //"Missing Policy Id";
                            } else
                            {
                                policy_no = objResponseJson["Root"]["Policy"][0]["PolicyNo"][0];
                            }
                        } else if (objResponseJson["Root"]["Policy"][0].hasOwnProperty('Root'))
                        {
                            if (objResponseJson["Root"]["Policy"][0]["Root"][0]["Policy"][0]["Status"][0] === "Fail")
                            {
                                Error_Msg = objResponseJson["Root"]["Policy"][0]["Root"][0]["Policy"][0]["Message"][0];
                            }
                        }
                    } else {
                        Error_Msg = 'LM_MAIN_Policy_NODE_NA';
                    }
                }
            } else
            {
                Error_Msg = 'LM_MAIN_NODE_NA';
            }

            if (Error_Msg === 'NO_ERR')
            {
                this.const_policy.transaction_status = 'SUCCESS';
                this.const_policy.policy_id = receipt_no;
                this.const_policy.pg_reference_number_2 = client_id;
                if (policy_no !== "") {
                    this.const_policy.transaction_substatus = 'IF';
                    this.const_policy.policy_number = policy_no;
                    let pdf_file_name = this.constructor.name + '_Travel_' + this.const_policy.policy_number + '.pdf';
                    let pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                    let pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    this.const_policy.policy_url = pdf_web_path_portal;
//                    try {
//                        let args = {
//                            data: {
//                                "search_reference_number": this.lm_request['search_reference_number'],
//                                "api_reference_number": this.lm_request['api_reference_number'],
//                                "policy_number": this.const_policy.policy_number,
//                                'client_key': this.lm_request['client_key'],
//                                'secret_key': this.lm_request['secret_key'],
//                                'insurer_id': this.lm_request['insurer_id'],
//                                'email': this.lm_request['email'],
//                                'mobile': this.lm_request['mobile'],
//                                'method_type': 'Pdf',
//                                'execution_async': 'no'
//                            },
//                            headers: {
//                                "Content-Type": "application/json",
//                                'client_key': this.lm_request['client_key'],
//                                'secret_key': this.lm_request['secret_key']
//                            }
//                        };
//                        this.pdf_call(config.environment.weburl + '/quote/pdf_initiate', args, pdf_sys_loc_horizon);
//                    } catch (ep) {
//                        console.error('ExceptionPDF', this.constructor.name, 'verification_response_handler', ep);
//                    }
                } else {
                    this.const_policy.transaction_substatus = 'UW';
                }
            } else
            {
                this.const_policy.transaction_status = 'PAYPASS';
            }

        }
        objServiceHandler.Policy = this.const_policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
    } catch (ex) {
        let Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
FutureGeneraliTravel.prototype.pdf_call = function (url, args, pdf_sys_loc) {
    let objInsurerProduct = this;
    objInsurerProduct.pdf_attempt++;
    let Client = require('node-rest-client').Client;
    let client = new Client();
    client.post(url, args, function (data) {
        console.log("Pdf initiate");
        if (data.Error_Code !== '' || true) {
            if (!fs.existsSync(pdf_sys_loc) && objInsurerProduct.pdf_attempt < 11) {
                let sleep = require('system-sleep');
                sleep(6000);
                objInsurerProduct.pdf_call(url, args, pdf_sys_loc);
            }
        }
    });
};
FutureGeneraliTravel.prototype.pdf_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'pdf_response_handler', objResponseJson);
    let Error_Msg = 'NO_ERR';
    let insurer_pdf_url = "";
    try {
        let objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null,
            'Policy': null
        };
        if (objResponseJson.hasOwnProperty('Envelope') && objResponseJson['Envelope'].hasOwnProperty('Body')) {
            if (objResponseJson['Envelope']['Body'].hasOwnProperty('GetPDFResponse')) {
                if (objResponseJson['Envelope']['Body']['GetPDFResponse'].hasOwnProperty('GetPDFResult')) {
                    insurer_pdf_url = objResponseJson['Envelope']['Body']['GetPDFResponse']['GetPDFResult'];
                } else {
                    Error_Msg = "LM_PDF_URL_NA";
                }
            } else {
                Error_Msg = "PDF_Response_NODE_MISSING";
            }
        } else {
            Error_Msg = "PDF_MAIN_NODE_MISSING";
        }
        let policy = {
            'policy_url': null,
            'policy_number': this.lm_request['policy_number'],
            'pdf_status': null
        };
        if (Error_Msg === 'NO_ERR' && insurer_pdf_url !== '') {
            let pdf_file_name = this.constructor.name + '_Travel_' + this.lm_request['policy_number'] + '.pdf';
            let pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
            let pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
            policy.policy_url = pdf_web_path_portal;
            let https = require('https');
            this.const_policy.insurer_policy_url = insurer_pdf_url;
            try {
                let file_horizon = fs.createWriteStream(pdf_sys_loc_horizon);
                https.get(insurer_pdf_url, function (response) {
                    response.pipe(file_horizon);
                });
            } catch (ep) {
                console.error('ExceptionPDF', this.constructor.name, 'pdf_response_handler', ep);
            }
            policy.pdf_status = 'SUCCESS';
            objServiceHandler.Insurer_Transaction_Identifier = this.lm_request['policy_number'];
        } else {
            policy.pdf_status = 'FAIL';
        }
        objServiceHandler.Policy = policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'pdf_response_handler', objServiceHandler);
    } catch (ex) {
        let Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'pdf_response_handler', objServiceHandler);
        objServiceHandler.Policy = this.const_policy;
    }
    return objServiceHandler;
};
FutureGeneraliTravel.prototype.current_time = function () {
    let today = moment().utcOffset("+05:30");
    let current_time = moment(today).format("HH:mm:ss");
    current_time = current_time.replaceAll(":", "");
    return current_time;
};
FutureGeneraliTravel.prototype.get_member_relation = function (i) {
    let gender = this.lm_request['member_' + i + '_gender'];
    this.prepared_request['member_' + i + '_nominee_name'] = this.lm_request["contact_name"];
    if (this.lm_request["relation"] === 'SON' || this.lm_request["relation"] === 'DAUG') {
        this.prepared_request['member_' + i + '_relation'] = (gender === 'M' ? 'FATH' : 'MOTH');
        this.prepared_request['member_' + i + '_nominee_rel'] = this.lm_request['gender'] === 'M' ? 'SON' : 'DAUG';
    }
    if (this.lm_request["relation"] === 'MOTH' || this.lm_request["relation"] === 'FATH') {
        this.prepared_request['member_' + i + '_relation'] = (gender === 'M' ? 'SON' : 'DAUG');
        this.prepared_request['member_' + i + '_nominee_rel'] = this.lm_request['gender'] === 'M' ? 'FATH' : 'MOTH';
    }
    if (this.lm_request["relation"] === 'SPOU') {
        this.prepared_request['member_' + i + '_relation'] = 'SPOU';
        this.prepared_request['member_' + i + '_nominee_rel'] = 'SPOU';
        if (i >= 3) {
            this.prepared_request['member_' + i + '_relation'] = (gender === 'M' ? 'SON' : 'DAUG');
            this.prepared_request['member_' + i + '_nominee_rel'] = this.lm_request['gender'] === 'M' ? 'FATH' : 'MOTH';
        }
    }
    if (this.lm_request["relation"] === 'SELF' || this.lm_request["relation"] === '') {
        if (i >= 3) {
            this.prepared_request['member_' + i + '_relation'] = (gender === 'M' ? 'SON' : 'DAUG');
            this.prepared_request['member_' + i + '_nominee_rel'] = this.lm_request['member_1_gender'] === 'M' ? 'FATH' : 'MOTH';
        } else if (i === 1) {
            this.prepared_request['member_' + i + '_relation'] = 'SELF';
            this.prepared_request['member_' + i + '_nominee_name'] = this.lm_request["nominee_name"];
            this.prepared_request['member_' + i + '_nominee_rel'] = this.lm_request["nominee_relation"];
        } else if (i === 2) {
            this.prepared_request['member_' + i + '_relation'] = 'SPOU';
            this.prepared_request['member_' + i + '_nominee_rel'] = 'SPOU';
        }
    }
    this.processed_request['___member_' + i + '_relation___'] = this.prepared_request['member_' + i + '_relation'];
    this.processed_request['___member_' + i + '_nominee_name___'] = this.prepared_request['member_' + i + '_nominee_name'];
    this.processed_request['___member_' + i + '_nominee_rel___'] = this.prepared_request['member_' + i + '_nominee_rel'];
};
FutureGeneraliTravel.prototype.getNomineeAge = function (i) {
    let nominee_date_birth = this.lm_request['member_' + i + '_nominee_birth_date'];
    console.log(this.constructor.name, 'getNomineeAge');
    let nominee_age = moment().diff(nominee_date_birth, 'years');
    this.prepared_request['member_' + i + '_nominee_birth_date'] = nominee_age;
    this.processed_request['___member_' + i + '_nominee_birth_date___'] = nominee_age;
};
FutureGeneraliTravel.prototype.get_product_details = function () {
    let plans = [
        {'area': 'Asia', 'country': 'Vietnam', 'continent': 'Asia'},
        {'area': 'Africa', 'country': 'Egypt', 'continent': 'Africa'},
        {'area': 'Europe', 'country': 'France', 'continent': 'Europe'},
        {'area': 'WorldWide', 'country': 'United States', 'continent': 'Americas'},
        {'area': 'WWExUSCanada', 'country': 'Australia', 'continent': 'Pacific'}
    ];
    let index = plans.findIndex(x => x.area === this.lm_request['travelling_to_area']);
    this.processed_request['___trip_type___'] = this.lm_request['trip_type'] === "MULTI" ? "Multi Trip" : "Single Trip";
    this.processed_request['___family_type___'] = this.lm_request['travel_insurance_type'] === "floater" ? "Family" : "Individual";
    this.processed_request['___visiting_country___'] = index === -1 ? "" : plans[index]['country'];
    this.processed_request['___continent___'] = index === -1 ? "" : plans[index]['continent'];
    if (this.lm_request['trip_type'] === "MULTI") {
        this.processed_request['___coverage_name___'] = this.lm_request['travelling_to_area'] === 'Europe' ? "Future Travel Suraksha Schengen - Multi Trip" : (this.lm_request['travelling_to_area'] === 'Asia' ? "Future Travel Suraksha Select" : "Future Travel Suraksha-World - Annual Multi Trip");
        this.processed_request['___contract_type___'] = this.lm_request['travelling_to_area'] === 'Europe' ? "FST" : (this.lm_request['travelling_to_area'] === 'Asia' ? "TSS" : "FTM");
        this.processed_request['___travel_days___'] = '365';
        this.processed_request['___max_days___'] = this.lm_request['maximum_duration'];
        this.processed_request['___travel_end_date___'] = moment(this.lm_request['travel_start_date']).add((this.lm_request['maximum_duration']), 'days').format('DD/MM/YYYY');
    } else {
        if (this.lm_request['travelling_to_area'] === 'Europe') {
            this.processed_request['___coverage_name___'] = this.lm_request['travel_insurance_type'] === "floater" ? "Future Travel Suraksha Schengen - Family" : "Future Travel Suraksha Schengen - Individual";
        } else {
            this.processed_request['___coverage_name___'] = (this.lm_request['travelling_to_area'] === 'Asia' ? "Future Travel Suraksha Select" : "Future Travel Suraksha-World - Individual");
        }
        this.processed_request['___contract_type___'] = this.lm_request['travelling_to_area'] === 'Europe' ? "FST" : (this.lm_request['travelling_to_area'] === 'Asia' ? "TSS" : "FTI");
        this.processed_request['___travel_days___'] = moment(this.lm_request['policy_end_date']).diff(this.lm_request['policy_start_date'], 'days');
        this.processed_request['___max_days___'] = '';
        this.processed_request['___travel_end_date___'] = this.processed_request['___policy_end_date___'];
    }
};
FutureGeneraliTravel.prototype.get_continent = function (country) {
    let master = [
        {"Country": "United States", "Continent": "Americas"},
        {"Country": "Canada", "Continent": "Americas"},
        {"Country": "Thailand", "Continent": "Asia"},
        {"Country": "United Kingdom", "Continent": "Europe"},
        {"Country": "France", "Continent": "Europe"},
        {"Country": "Australia", "Continent": "Pacific"},
        {"Country": "New Zealand", "Continent": "Pacific"},
        {"Country": "South Africa", "Continent": "Africa"},
        {"Country": "Brazil", "Continent": "Americas"},
        {"Country": "Mexico", "Continent": "Americas"},
        {"Country": "China", "Continent": "Asia"},
        {"Country": "Hong Kong", "Continent": "Asia"},
        {"Country": "Singapore", "Continent": "Asia"},
        {"Country": "Malaysia", "Continent": "Asia"},
        {"Country": "Indonesia", "Continent": "Asia"},
        {"Country": "Taiwan", "Continent": "Asia"},
        {"Country": "Spain", "Continent": "Europe"},
        {"Country": "Italy", "Continent": "Europe"},
        {"Country": "Germany", "Continent": "Europe"},
        {"Country": "Switzerland", "Continent": "Europe"},
        {"Country": "Turkey", "Continent": "Europe"},
        {"Country": "Fiji", "Continent": "Pacific"},
        {"Country": "Zimbabwe", "Continent": "Africa"},
        {"Country": "Kenya", "Continent": "Africa"},
        {"Country": "United Arab Emirates", "Continent": "Asia"},
        {"Country": "Egypt", "Continent": "Africa"},
        {"Country": "Jordan", "Continent": "Africa"},
        {"Country": "Vietnam", "Continent": "Asia"},
        {"Country": "Cuba", "Continent": "Americas"},
        {"Country": "Dominican Republic", "Continent": "Americas"},
        {"Country": "Guatemala", "Continent": "Americas"},
        {"Country": "Haiti", "Continent": "Americas"},
        {"Country": "Honduras", "Continent": "Americas"},
        {"Country": "Nicaragua", "Continent": "Americas"},
        {"Country": "Argentina", "Continent": "Americas"},
        {"Country": "Bolivia", "Continent": "Americas"},
        {"Country": "Chile", "Continent": "Americas"},
        {"Country": "Colombia", "Continent": "Americas"},
        {"Country": "Ecuador", "Continent": "Americas"},
        {"Country": "Peru", "Continent": "Americas"},
        {"Country": "Uruguay", "Continent": "Americas"},
        {"Country": "Venezuela", "Continent": "Americas"},
        {"Country": "Antigua and Barbuda", "Continent": "Americas"},
        {"Country": "Bahamas", "Continent": "Americas"},
        {"Country": "Barbados", "Continent": "Americas"},
        {"Country": "Belize", "Continent": "Americas"},
        {"Country": "Costa Rica", "Continent": "Americas"},
        {"Country": "Dominica", "Continent": "Americas"},
        {"Country": "El Salvador", "Continent": "Americas"},
        {"Country": "Grenada", "Continent": "Americas"},
        {"Country": "Jamaica", "Continent": "Americas"},
        {"Country": "Panama", "Continent": "Americas"},
        {"Country": "Saint Kitts and Nevis", "Continent": "Americas"},
        {"Country": "Saint Lucia", "Continent": "Americas"},
        {"Country": "Saint Vincent and the Grenadines", "Continent": "Americas"},
        {"Country": "Trinidad and Tobago", "Continent": "Americas"},
        {"Country": "Armenia", "Continent": "Asia"},
        {"Country": "Azerbaijan", "Continent": "Asia"},
        {"Country": "Bahrain", "Continent": "Asia"},
        {"Country": "Bangladesh", "Continent": "Asia"},
        {"Country": "Bhutan", "Continent": "Asia"},
        {"Country": "Brunei", "Continent": "Asia"},
        {"Country": "Cyprus", "Continent": "Asia"},
        {"Country": "Georgia", "Continent": "Asia"},
        {"Country": "Israel", "Continent": "Asia"},
        {"Country": "Japan", "Continent": "Asia"},
        {"Country": "Jordan", "Continent": "Asia"},
        {"Country": "Kazakhstan", "Continent": "Asia"},
        {"Country": "Kuwait", "Continent": "Asia"},
        {"Country": "Kyrgyzstan", "Continent": "Asia"},
        {"Country": "Laos", "Continent": "Asia"},
        {"Country": "Maldives", "Continent": "Asia"},
        {"Country": "Mongolia", "Continent": "Asia"},
        {"Country": "Myanmar (Burma)", "Continent": "Asia"},
        {"Country": "Nepal", "Continent": "Asia"},
        {"Country": "Oman", "Continent": "Asia"},
        {"Country": "Pakistan", "Continent": "Asia"},
        {"Country": "Palestine", "Continent": "Asia"},
        {"Country": "Philippines", "Continent": "Asia"},
        {"Country": "Qatar", "Continent": "Asia"},
        {"Country": "Saudi Arabia", "Continent": "Asia"},
        {"Country": "Sri Lanka", "Continent": "Asia"},
        {"Country": "Guyana", "Continent": "Americas"},
        {"Country": "Paraguay", "Continent": "Americas"},
        {"Country": "Suriname", "Continent": "Americas"},
        {"Country": "United Arab Emirates (UAE)", "Continent": "Asia"},
        {"Country": "Yemen", "Continent": "Asia"},
        {"Country": "Algeria", "Continent": "Africa"},
        {"Country": "Angola", "Continent": "Africa"},
        {"Country": "Botswana", "Continent": "Africa"},
        {"Country": "Burkina", "Continent": "Africa"},
        {"Country": "Burundi", "Continent": "Africa"},
        {"Country": "Cameroon", "Continent": "Africa"},
        {"Country": "Cape Verde", "Continent": "Africa"},
        {"Country": "Central African Republic", "Continent": "Africa"},
        {"Country": "Chad", "Continent": "Africa"},
        {"Country": "Comoros", "Continent": "Africa"},
        {"Country": "Djibouti", "Continent": "Africa"},
        {"Country": "Equatorial Guinea", "Continent": "Africa"},
        {"Country": "Ethiopia", "Continent": "Africa"},
        {"Country": "Gabon", "Continent": "Africa"},
        {"Country": "Gambia", "Continent": "Africa"},
        {"Country": "Ghana", "Continent": "Africa"},
        {"Country": "Guinea", "Continent": "Africa"},
        {"Country": "Guinea-Bissau", "Continent": "Africa"},
        {"Country": "Lesotho", "Continent": "Africa"},
        {"Country": "Madagascar", "Continent": "Africa"},
        {"Country": "Malawi", "Continent": "Africa"},
        {"Country": "Mali", "Continent": "Africa"},
        {"Country": "Mauritania", "Continent": "Africa"},
        {"Country": "Mauritius", "Continent": "Africa"},
        {"Country": "Morocco", "Continent": "Africa"},
        {"Country": "Mozambique", "Continent": "Africa"},
        {"Country": "Namibia", "Continent": "Africa"},
        {"Country": "Niger", "Continent": "Africa"},
        {"Country": "Nigeria", "Continent": "Africa"},
        {"Country": "Rwanda", "Continent": "Africa"},
        {"Country": "Sao Tome and Principe", "Continent": "Africa"},
        {"Country": "Senegal", "Continent": "Africa"},
        {"Country": "Seychelles", "Continent": "Africa"},
        {"Country": "Sierra Leone", "Continent": "Africa"},
        {"Country": "South Sudan", "Continent": "Africa"},
        {"Country": "Swaziland", "Continent": "Africa"},
        {"Country": "Tanzania", "Continent": "Africa"},
        {"Country": "Togo", "Continent": "Africa"},
        {"Country": "Tunisia", "Continent": "Africa"},
        {"Country": "Uganda", "Continent": "Africa"},
        {"Country": "Zambia", "Continent": "Africa"},
        {"Country": "Albania", "Continent": "Europe"},
        {"Country": "Andorra", "Continent": "Europe"},
        {"Country": "Armenia", "Continent": "Europe"},
        {"Country": "Austria", "Continent": "Europe"},
        {"Country": "Azerbaijan", "Continent": "Europe"},
        {"Country": "Belarus", "Continent": "Europe"},
        {"Country": "Belgium", "Continent": "Europe"},
        {"Country": "Bosnia and Herzegovina", "Continent": "Europe"},
        {"Country": "Bulgaria", "Continent": "Europe"},
        {"Country": "Croatia", "Continent": "Europe"},
        {"Country": "Cyprus", "Continent": "Europe"},
        {"Country": "Czech Republic", "Continent": "Europe"},
        {"Country": "Denmark", "Continent": "Europe"},
        {"Country": "Estonia", "Continent": "Europe"},
        {"Country": "Finland", "Continent": "Europe"},
        {"Country": "Georgia", "Continent": "Europe"},
        {"Country": "Greece", "Continent": "Europe"},
        {"Country": "Hungary", "Continent": "Europe"},
        {"Country": "Iceland", "Continent": "Europe"},
        {"Country": "Ireland", "Continent": "Europe"},
        {"Country": "Latvia", "Continent": "Europe"},
        {"Country": "Liechtenstein", "Continent": "Europe"},
        {"Country": "Lithuania", "Continent": "Europe"},
        {"Country": "Luxembourg", "Continent": "Europe"},
        {"Country": "Macedonia", "Continent": "Europe"},
        {"Country": "Malta", "Continent": "Europe"},
        {"Country": "Moldova", "Continent": "Europe"},
        {"Country": "Monaco", "Continent": "Europe"},
        {"Country": "Montenegro", "Continent": "Europe"},
        {"Country": "Netherlands", "Continent": "Europe"},
        {"Country": "Norway", "Continent": "Europe"},
        {"Country": "Poland", "Continent": "Europe"},
        {"Country": "Portugal", "Continent": "Europe"},
        {"Country": "Romania", "Continent": "Europe"},
        {"Country": "San Marino", "Continent": "Europe"},
        {"Country": "Serbia", "Continent": "Europe"},
        {"Country": "Slovakia", "Continent": "Europe"},
        {"Country": "Slovenia", "Continent": "Europe"},
        {"Country": "Sweden", "Continent": "Europe"},
        {"Country": "Switzerland", "Continent": "Europe"},
        {"Country": "Ukraine", "Continent": "Europe"},
        {"Country": "Vatican City", "Continent": "Europe"},
        {"Country": "Kiribati", "Continent": "Pacific"},
        {"Country": "Marshall Islands", "Continent": "Pacific"},
        {"Country": "Micronesia", "Continent": "Pacific"},
        {"Country": "Nauru", "Continent": "Pacific"},
        {"Country": "New Zealand", "Continent": "Pacific"},
        {"Country": "Palau", "Continent": "Pacific"},
        {"Country": "Papua New Guinea", "Continent": "Pacific"},
        {"Country": "Samoa", "Continent": "Pacific"},
        {"Country": "Solomon Islands", "Continent": "Pacific"},
        {"Country": "Tonga", "Continent": "Pacific"},
        {"Country": "Tuvalu", "Continent": "Pacific"},
        {"Country": "Vanuatu", "Continent": "Pacific"},
        {"Country": "Bouvet Island", "Continent": "Antartica"},
        {"Country": "French Southern and Antarctic Lands", "Continent": "Antartica"},
        {"Country": "Heard Island and McDonald Islands", "Continent": "Antartica"},
        {"Country": "South Georgia and the South Sandwich Islands ", "Continent": "Antartica"}
    ];
    let index = master.findIndex(x => x.Country === country);
    return (index === -1 ? "" : master[index]['Continent']);
};
FutureGeneraliTravel.prototype.is_valid_plan = function (lm_request, planCode) {
    console.log('FutureGeneraliTravel is_valid_plan', 'start');
    if (lm_request['trip_type'] === "MULTI" && lm_request['travel_insurance_type'] === "floater") {
        return false;
    } else if (lm_request['travelling_to_area'] === "Asia" || lm_request['travelling_to_area'] === "Europe") {
        return false;
    } else {
        return true;
    }
};
FutureGeneraliTravel.prototype.premium_breakup_schema = {
    "base_premium": "basePremium",
    "net_premium": "premium",
    "service_tax": "serviceTax",
    "SBC": "SBC",
    "KKC": "KKC",
    "gross_premium": "grossPremium",
    "final_premium": "totalPremium"

};
module.exports = FutureGeneraliTravel;