/* Author: Roshani Prajapati
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
var sleep = require('system-sleep');

function BajajAllianzTravel() {

}
util.inherits(BajajAllianzTravel, Travel);

BajajAllianzTravel.prototype.lm_request_single = {};
BajajAllianzTravel.prototype.insurer_integration = {};
BajajAllianzTravel.prototype.insurer_addon_list = [];
BajajAllianzTravel.prototype.insurer = {};
BajajAllianzTravel.prototype.insurer_date_format = 'DD-MMM-YYYY';


BajajAllianzTravel.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
BajajAllianzTravel.prototype.insurer_product_field_process_pre = function () {
    var member = 1;
    this.get_plan_area(this.prepared_request['Plan_Id']);
    this.processed_request['___travel_insurance_type___'] = this.prepared_request['travel_insurance_type'] === "individual" ? "N" : "Y";
    if (this.lm_request['method_type'] === 'Premium') {
        for (member = 1; member <= this.lm_request['adult_count']; member++) {
            this.processed_request['___member_' + member + '_gender___'] = this.lm_request['member_' + member + '_gender'] === 'M' ? 'M' : 'F';
            this.get_member_relation(member);
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            this.processed_request['___member_' + member + '_gender___'] = this.lm_request['member_' + member + '_gender'] === 'M' ? 'M' : 'F';
            this.get_member_relation(member);
            if (this.prepared_request['member_' + member + '_age'] === 0) {
                this.processed_request['___member_' + member + '_age___'] = '0.' + moment().diff(this.lm_request['member_' + member + '_birth_date'], 'months');
            }
        }
    }
    if (this.lm_request['method_type'] === 'Proposal') {
        this.processed_request['___member_has_ped___'] = "N";
        this.processed_request['___any_other___'] = "N";
        var returnUrl = this.pg_ack_url(1);
        if (config.environment.name === 'Development') {
            returnUrl = 'http://localhost:7000/transaction-status/' + this.lm_request['udid'] + '/' + this.lm_request['crn'] + '/' + this.lm_request['proposal_id'];
        }
        this.prepared_request['return_url'] = returnUrl;
        this.processed_request['___return_url___'] = returnUrl;
        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";
        for (member = 1; member <= this.lm_request['adult_count']; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.processed_request['___member_' + member + '_gender___'] = this.lm_request['member_' + member + '_gender'] === 'M' ? 'M' : 'F';
            this.get_member_relation(member);
            if (this.prepared_request['member_' + member + '_ped'] !== "") {
                this.processed_request['___member_has_ped___'] = "Y";
                for (var i in this.prepared_request['member_' + member + '_ped']) {
                    if (this.prepared_request['member_' + member + '_ped'][i]['name'] === "Any Other") {
                        this.processed_request['___any_other___'] = "Y";
                    }
                }
            }
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.processed_request['___member_' + member + '_gender___'] = this.lm_request['member_' + member + '_gender'] === 'M' ? 'M' : 'F';
            this.get_member_relation(member);
            if (this.prepared_request['member_' + member + '_ped'] !== "") {
                this.processed_request['___member_has_ped___'] = "Y";
                for (var i in this.prepared_request['member_' + member + '_ped']) {
                    if (this.prepared_request['member_' + member + '_ped'][i]['name'] === "Any Other") {
                        this.processed_request['___any_other___'] = "Y";
                    }
                }
            }
            if (this.prepared_request['member_' + member + '_age'] === 0) {
                this.processed_request['___member_' + member + '_age___'] = '0.' + moment().diff(this.lm_request['member_' + member + '_birth_date'], 'months');
            }
        }
        if (this.method_content[0] !== '<') {// for json
            txt_replace_with = txt_replace_with.replaceAll('<!--InsurersDetail_Start-->', "");
            var Total_Count = this.lm_request['member_count'];
            for (var x = 1; x <= Total_Count - 1; x++) {
                txt_replace_with = txt_replace_with.replace('<!--InsurersDetail_End-->', ",");
            }
            txt_replace_with = txt_replace_with.replace('<!--InsurersDetail_End-->', "");
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
    }
};
BajajAllianzTravel.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {
    var obj_response_handler;
    if (specific_insurer_object.method.Method_Type === 'Premium') {
        obj_response_handler = this.premium_response_handler(objResponseJson);
    } else if (specific_insurer_object.method.Method_Type === 'Proposal') {
        obj_response_handler = this.proposal_response_handler(objResponseJson);
    } else if (specific_insurer_object.method.Method_Type === 'Verification') {
        obj_response_handler = this.verification_response_handler(objResponseJson);
    } else if (specific_insurer_object.method.Method_Type === 'Pdf') {
        obj_response_handler = this.pdf_response_handler(objResponseJson);
    }
    return obj_response_handler;
};
BajajAllianzTravel.prototype.insurer_product_field_process_post = function () {

};
BajajAllianzTravel.prototype.insurer_product_api_post = function () {

};
BajajAllianzTravel.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    console.log('service_call');
    try {
        var objInsurerProduct = this;
        var body = docLog.Insurer_Request;
        var Client = require('node-rest-client').Client;
        var client = new Client();
        if (this.method.Method_Type === 'Pdf') {
            var args = {
                data: {
                    'grant_type': 'password',
                    'username': objInsurerProduct.processed_request['___insurer_integration_service_user___'],
                    'password': objInsurerProduct.processed_request['___insurer_integration_service_password___'],
                    'client_id': ((config.environment.name !== 'Production') ? 'B2BService_Client' : ''),
                    'client_secret': ((config.environment.name !== 'Production') ? '3cd96187-ed12-44e1-af46-bdea2c3a6e72' : '')
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
            args.data = jsonToQueryString(args.data);
            var tokenservice_url = ((config.environment.name !== 'Production') ? "https://auth.bagicsit2.bajajallianz.com/auth/realms/Bagic/protocol/openid-connect/token" : '');
            client.post(tokenservice_url, args, function (data, response) {
                // parsed response body as js object 
                console.error('token', JSON.stringify(data));
                var policy_num = objInsurerProduct.processed_request['___policy_number___'];
                var args = {
                    headers: {
                        "auth": data['access_token']
                    }
                };
                client.get(specific_insurer_object.method_file_url + policy_num, args, function (data, response) {
                    // parsed response body as js object 
                    console.log("PDF data - ", data);
                    var objResponseFull = {
                        'err': null,
                        'result': data,
                        'raw': JSON.stringify(data),
                        'soapHeader': null,
                        'objResponseJson': data
                    };
                    objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                });
            });
        } else {
            console.log('Request:' + body);
            var args = {
                data: body,
                headers: {
                    "Content-Type": "application/json"
                }
            };
            if (this.method.Method_Type === 'Premium') {
                sleep(2000);
            }

            client.post(specific_insurer_object.method_file_url, args, function (data, response) {
                console.log('data', data);
                var objData = JSON.stringify(data);
                console.log(objData);
                var objResponseFull = {
                    'err': null,
                    'result': objData,
                    'raw': objData,
                    'soapHeader': null,
                    'objResponseJson': JSON.parse(objData)
                };
                objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
            });
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};

BajajAllianzTravel.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    try {
        if (objResponseJson['pErrorCode_out'] !== "0") {
            Error_Msg = objResponseJson['pError_out']['errText'];
        } else if (objResponseJson['pError_out']['errText'] !== "") {
            Error_Msg = objResponseJson['pError_out']['errText'];
        } else if (objResponseJson.hasOwnProperty('pTravelPremiumOut_out') && objResponseJson['pTravelPremiumOut_out']['ptotalPremium'] === "0") {
            Error_Msg = 'LM_MSG::PREMIUM_NULL';
        }
        if (Error_Msg === 'NO_ERR')
        {
            var objPremiumService = objResponseJson['pTravelPremiumOut_out'];
            var premium_breakup = this.get_const_premium_breakup();
            var plan_name = objResponseJson['pTravelPremiumIn_inout']['ptravelplan'];
            premium_breakup['final_premium'] = objPremiumService['ptotalPremium'];
            premium_breakup['service_tax'] = objPremiumService['pserviceTax'];
            premium_breakup['tax']['CGST'] = premium_breakup['service_tax'] / 2;
            premium_breakup['tax']['SGST'] = premium_breakup['service_tax'] / 2;
            premium_breakup['net_premium'] = objPremiumService['pbasePremium'];
            premium_breakup['travel_insurance_si'] = this.get_plan_si(plan_name);
            objServiceHandler.Premium_Breakup = premium_breakup;
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
BajajAllianzTravel.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (this.processed_request['___member_has_ped___'] === "Y") {
            Error_Msg = "Regret, policy cannot be issued online in-case insured members have PED";
        } else if (!objResponseJson.hasOwnProperty('pTrvPolDtls_inout')) {
            Error_Msg = objResponseJson['message'];
        } else if (objResponseJson['pError_out']['errText'] !== "") {
            Error_Msg = objResponseJson['pError_out']['errText'];
        } else if (!objResponseJson.hasOwnProperty('pRequestid_out') || objResponseJson['pRequestid_out'] === "") {
            Error_Msg = "LM_MSG::REQUEST_ID_MISSING";
        }
        if (Error_Msg === 'NO_ERR') {
            var proposalAmt = objResponseJson['pTrvPolDtls_inout']['finalPremium'];
            var objPremiumVerification = this.premium_verification(this.lm_request['final_premium'], proposalAmt);
            if (objPremiumVerification.Status) {
                objServiceHandler.Payment.pg_url = objResponseJson['pTrvPolDtls_inout']['loading'];
                objServiceHandler.Payment.pg_redirect_mode = 'POST';
                objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['pRequestid_out'];
            } else {
                Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
            }
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
BajajAllianzTravel.prototype.pg_response_handler = function () {
    try {
        console.log('Start', this.constructor.name, 'pg_response_handler');
        var output = this.const_payment_response.pg_get;
        if (output['status'] === 'success') {
            this.const_policy.transaction_amount = output['amt'];
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.transaction_status = 'SUCCESS';
            this.const_policy.policy_number = output['referenceno'];
            this.const_policy.pg_reference_number_1 = output['quoteno'];
            this.const_policy.transaction_id = output['txn'];
        } else {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
        console.error('End', this.constructor.name, 'pg_response_handler', this.const_policy);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'verification_response_handler', ex);
    }
};
BajajAllianzTravel.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (this.const_policy.pg_status === 'SUCCESS') {
            if (Error_Msg === 'NO_ERR') {
                if (this.const_policy.policy_number !== '' && this.const_policy.policy_number !== null && this.const_policy.policy_number !== undefined) {
                    this.const_policy.transaction_substatus = "IF";
                    var pdf_file_name = this.constructor.name + '_Travel_' + this.const_policy['policy_number'].replaceAll('-', '') + '.pdf';
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
                } else {
                    this.const_policy.transaction_status = 'PAYPASS';
                }
            } else {
                this.const_policy.transaction_status = 'PAYPASS';
            }

            objServiceHandler.Insurer_Transaction_Identifier = this.const_policy.transaction_id;
        }
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

BajajAllianzTravel.prototype.pdf_call = function (url, args, pdf_sys_loc) {
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
BajajAllianzTravel.prototype.pdf_response_handler = function (objResponseJson) {
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
        if (Error_Msg === 'NO_ERR') {
            if (objResponseJson.downloadedPdf !== undefined && objResponseJson.downloadedPdf !== null && objResponseJson.downloadedPdf !== "") {
                var pdf_file_name = this.constructor.name + '_Travel_' + this.lm_request['policy_number'].replaceAll('-', '') + '.pdf';
                var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                var binary = new Buffer(objResponseJson, 'base64');
                fs.writeFileSync(pdf_sys_loc_horizon, binary);
                policy.policy_url = pdf_web_path_portal;
                policy.pdf_status = 'SUCCESS';
            } else {
                policy.pdf_status = 'FAIL';
            }
            objServiceHandler.Insurer_Transaction_Identifier = this.lm_request['policy_number'];
        }
        objServiceHandler.Policy = policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'pdf_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'premium_response_handler', objServiceHandler);
        objServiceHandler.Policy = this.const_policy;
    }
    return objServiceHandler;
};
BajajAllianzTravel.prototype.get_plan_si = function (plan_name) {
    var plans = [
        {
            "Plan_Name": "Travel Prime Individual Gold 2 lakhs USD",
            "SI": "$200000"
        },
        {
            "Plan_Name": "Travel Prime Individual Silver 50000 USD",
            "SI": "$50000"
        },
        {
            "Plan_Name": "Travel Asia Elite Flair",
            "SI": "$15000"
        },
        {
            "Plan_Name": "Travel Prime Corporate Maximum with per trip limit of 45 days",
            "SI": "$1000000"
        },
        {
            "Plan_Name": "Travel Prime Family Silver USD 100000",
            "SI": "$100000"
        },
        {
            "Plan_Name": "Travel Prime Corporate Lite with per trip limit of 60 days",
            "SI": "$250000"
        },
        {
            "Plan_Name": "Corporate Elite Plus",
            "SI": "$500000"
        },
        {
            "Plan_Name": "Travel Prime Age Gold 200000 USD",
            "SI": "$200000"
        },
        {
            "Plan_Name": "Travel Elite Family (Family Floater)",
            "SI": "$50000"
        },
        {
            "Plan_Name": "Travel Prime Family Standard USD 50000",
            "SI": "$50000"
        },
        {
            "Plan_Name": "Travel Prime Corporate Lite with per trip limit of 45 days",
            "SI": "$250000"
        },
        {
            "Plan_Name": "Travel Elite Gold",
            "SI": "$200000"
        },
        {
            "Plan_Name": "E-Travel",
            "SI": "$300000"
        },
        {
            "Plan_Name": "Corporate Elite Lite",
            "SI": ""
        },
        {
            "Plan_Name": "Travel Asia Elite Supreme",
            "SI": "$25000"
        },
        {
            "Plan_Name": "Travel Prime Corporate Plus with per trip limit of 60 days",
            "SI": "$500000"
        },
        {
            "Plan_Name": "Travel Super Age Elite without medicals",
            "SI": "$50000"
        },
        {
            "Plan_Name": "Travel Corporate Age Elite Lite",
            "SI": ""
        },
        {
            "Plan_Name": "Travel Prime Asia Supreme",
            "SI": "$25000"
        },
        {
            "Plan_Name": "Travel Corporate Age Elite Plus",
            "SI": "$500000"
        },
        {
            "Plan_Name": "Travel Prime Corporate Lite with per trip limit of 30 days",
            "SI": "$250000"
        },
        {
            "Plan_Name": "Travel Prime Age Platinum 500000 USD",
            "SI": "$500000"
        },
        {
            "Plan_Name": "Travel Prime Corporate Plus with per trip limit of 45 days",
            "SI": "$500000"
        },
        {
            "Plan_Name": "Travel Prime Corporate Plus with per trip limit of 30 days",
            "SI": "$500000"
        },
        {
            "Plan_Name": "Travel Prime Asia Flair",
            "SI": "$15000"
        },
        {
            "Plan_Name": "Travel Elite Silver",
            "SI": "$50000"
        },
        {
            "Plan_Name": "Travel Prime Age Silver 50000 USD",
            "SI": "$50000"
        },
        {
            "Plan_Name": "Travel Elite Platinum",
            "SI": "$500000"
        },
        {
            "Plan_Name": "Travel Prime Corporate Maximum with per trip limit of 60 days",
            "SI": "$1000000"
        },
        {
            "Plan_Name": "Travel Prime Corporate Maximum with per trip limit of 30 days",
            "SI": "$1000000"
        }
    ];
    var index = plans.findIndex(x => x.Plan_Name === plan_name);
    return index === -1 ? "" : plans[index]['SI'];
};
BajajAllianzTravel.prototype.get_plan_area = function (plan_id) {
    var travel_area = this.lm_request['travelling_to_area'];
    if (travel_area === 'Africa') {
        travel_area = 'WWExUSCanada';
    }
    for (i = 1; i <= this.lm_request['adult_count']; i++) {
        if (this.lm_request['travelling_to_area'] === 'Europe' && (this.lm_request['member_' + i + '_age'] < 61 || this.lm_request['child_count'] > 0)) {
            travel_area = 'WWExUSCanada';
        }
    }

    var plans = [
        {'area': 'Worldwide Excluding USA and Canada', 'plan_id': 101, 'Region': 'WWExUSCanada'},
        {'area': 'Worldwide Including USA and Canada', 'plan_id': 101, 'Region': 'WorldWide'},
        {'area': 'Worldwide Excluding USA and Canada', 'plan_id': 102, 'Region': 'WWExUSCanada'},
        {'area': 'Worldwide Including USA and Canada', 'plan_id': 102, 'Region': 'WorldWide'},
        {'area': 'Asia Excluding Japan', 'plan_id': 103, 'Region': 'Asia'},
        {'area': 'Worldwide Including USA and Canada', 'plan_id': 104, 'Region': 'WorldWide'},
        {'area': 'Worldwide Including USA and Canada', 'plan_id': 105, 'Region': 'WorldWide'},
        {'area': 'Worldwide Excluding USA and Canada', 'plan_id': 105, 'Region': 'WWExUSCanada'},
        {'area': 'Worldwide Including USA and Canada', 'plan_id': 106, 'Region': 'WorldWide'},
        {'area': 'Worldwide Including USA and Canada', 'plan_id': 107, 'Region': 'WorldWide'},
        {'area': 'Worldwide Excluding USA and Canada', 'plan_id': 108, 'Region': 'WWExUSCanada'},
        {'area': 'Worldwide Including USA and Canada', 'plan_id': 108, 'Region': 'WorldWide'},
        {'area': 'Schengen', 'plan_id': 108, 'Region': 'Europe'},
        {'area': 'Worldwide Including USA and Canada', 'plan_id': 109, 'Region': 'WorldWide'},
        {'area': 'Worldwide Excluding USA and Canada', 'plan_id': 109, 'Region': 'WWExUSCanada'},
        {'area': 'Worldwide Including USA and Canada', 'plan_id': 110, 'Region': 'WorldWide'},
        {'area': 'Worldwide Excluding USA and Canada', 'plan_id': 110, 'Region': 'WWExUSCanada'},
        {'area': 'Worldwide Including USA and Canada', 'plan_id': 111, 'Region': 'WorldWide'},
        {'area': 'Worldwide Including USA and Canada', 'plan_id': 112, 'Region': 'WorldWide'},
        {'area': 'Worldwide Excluding USA and Canada', 'plan_id': 112, 'Region': 'WWExUSCanada'},
        {'area': 'Worldwide Including USA and Canada', 'plan_id': 114, 'Region': 'WorldWide'},
        {'area': 'Asia Excluding Japan', 'plan_id': 115, 'Region': 'Asia'},
        {'area': 'Worldwide Including USA and Canada', 'plan_id': 116, 'Region': 'WorldWide'},
        {'area': 'Worldwide Including USA and Canada', 'plan_id': 117, 'Region': 'WorldWide'},
        {'area': 'Worldwide Excluding USA and Canada', 'plan_id': 117, 'Region': 'WWExUSCanada'},
        {'area': 'Worldwide Including USA and Canada', 'plan_id': 118, 'Region': 'WorldWide'},
        {'area': 'Asia Excluding Japan', 'plan_id': 119, 'Region': 'Asia'},
        {'area': 'Worldwide Including USA and Canada', 'plan_id': 120, 'Region': 'WorldWide'},
        {'area': 'Worldwide Including USA and Canada', 'plan_id': 121, 'Region': 'WorldWide'},
        {'area': 'Worldwide Excluding USA and Canada', 'plan_id': 122, 'Region': 'WWExUSCanada'},
        {'area': 'Worldwide Including USA and Canada', 'plan_id': 122, 'Region': 'WorldWide'},
        {'area': 'Schengen', 'plan_id': 122, 'Region': 'Europe'},
        {'area': 'Worldwide Including USA and Canada', 'plan_id': 123, 'Region': 'WorldWide'},
        {'area': 'Worldwide Including USA and Canada', 'plan_id': 124, 'Region': 'WorldWide'},
        {'area': 'Asia Excluding Japan', 'plan_id': 125, 'Region': 'Asia'},
        {'area': 'Worldwide Excluding USA and Canada', 'plan_id': 126, 'Region': 'WWExUSCanada'},
        {'area': 'Worldwide Including USA and Canada', 'plan_id': 126, 'Region': 'WorldWide'},
        {'area': 'Worldwide Excluding USA and Canada', 'plan_id': 127, 'Region': 'WWExUSCanada'},
        {'area': 'Worldwide Including USA and Canada', 'plan_id': 127, 'Region': 'WorldWide'},
        {'area': 'Schengen', 'plan_id': 127, 'Region': 'Europe'},
        {'area': 'Worldwide Excluding USA and Canada', 'plan_id': 128, 'Region': 'WWExUSCanada'},
        {'area': 'Worldwide Including USA and Canada', 'plan_id': 128, 'Region': 'WorldWide'},
        {'area': 'Worldwide Including USA and Canada', 'plan_id': 129, 'Region': 'WorldWide'},
        {'area': 'Worldwide Including USA and Canada', 'plan_id': 130, 'Region': 'WorldWide'}
    ];
    var index = plans.findIndex(x => x.Region === travel_area && x.plan_id === plan_id);
    this.processed_request['___areaname___'] = index === -1 ? "" : plans[index]['area'];
};
BajajAllianzTravel.prototype.is_valid_plan = function (lm_request, planCode) {
    console.log('BajajAllianzTravel is_valid_plan', 'start');
    if (lm_request['travelling_to_area'] === 'Africa') {
        var travel_area = 'WWExUSCanada';
    }
    for (i = 1; i <= lm_request['adult_count']; i++) {
        if (lm_request['travelling_to_area'] === 'Europe' && (lm_request['member_' + i + '_age'] > 70 || (lm_request['member_' + i + '_age'] > 60 && lm_request['child_count'] > 0))) {
            return false;
        }
        if (["2", "4", "8", "10", "11", "12", "15", "16", "17", "23", "28", "31", "42", "45", "46", "48", "53", "55", "60"].indexOf(planCode) > -1 && lm_request['member_' + i + '_age'] > 60) {
            return false;
        }
        if (["6", "14", "29", "38", "39", "41", "44", "50"].indexOf(planCode) > -1 && lm_request['member_' + i + '_age'] > 70) {
            return false;
        }
        if (["35"].indexOf(planCode) > -1 && lm_request['member_' + i + '_age'] < 71) {
            return false;
        }
        if (["14", "38", "41", "50", "44"].indexOf(planCode) > -1 && lm_request['member_' + i + '_age'] < 61) {
            return false;
        }
    }
    for (i = 3; i <= lm_request['child_count'] + 2; i++) {
        var ageInMonths = moment().diff(lm_request['member_' + i + '_birth_date'], 'months');
        if (["2", "4", "6", "8", "11", "17", "23", "29", "31", "39", "42", "45", "46", "47", "48", "53", "55", "60"].indexOf(planCode) > -1 && ageInMonths < 5) {
            return false;
        }
        if (["10", "15", "16"].indexOf(planCode) > -1 && ageInMonths < 12) {
            return false;
        }
    }
    var total_days;
    total_days = moment(lm_request['policy_end_date']).diff(moment(lm_request['policy_start_date']), 'days') + 1; // getting two dates difference
    if (lm_request['travelling_to_area'] === 'Asia' && ["6", "29", "39", "47"].indexOf(planCode) === -1) {
        return false;
    } else if (lm_request['travelling_to_area'] === 'Asia' && total_days > 30) {
        return false;
    } else if (lm_request['travelling_to_area'] === 'Europe' && (["6", "29", "35", "38", "39", "41", "47"].indexOf(planCode) > -1 || total_days > 180)) {
        return false;
    } else if (lm_request['trip_type'] === "SINGLE" && ["10", "15", "16"].indexOf(planCode) > -1 && total_days > 60) {
        return false;
    } else if (lm_request['trip_type'] === "SINGLE" && ["2", "4", "14", "23", "44", "48", "50", "53"].indexOf(planCode) > -1 && total_days > 180) {
        return false;
    } else if ((travel_area === 'WWExUSCanada' || lm_request['travelling_to_area'] === 'WWExUSCanada' || lm_request['travelling_to_area'] === 'WorldWide') && ["6", "29", "39", "47"].indexOf(planCode) > -1) {
        return false;
    } else if (lm_request['trip_type'] === "MULTI" && (['90'].includes(lm_request['maximum_duration']) || lm_request['travelling_to_area'] === 'WWExUSCanada')) {
        return false;
    } else if (lm_request['travel_insurance_type'] === "individual" && ["10", "15", "16"].indexOf(planCode) > -1) {
        return false;
    } else if (lm_request['travel_insurance_type'] === "floater" && ["2", "4"].indexOf(planCode) > -1) {
        return false;
    } else if (lm_request['trip_type'] === "MULTI" && ["2", "4", "6", "10", "14", "15", "16", "23", "24", "29", "38", "39", "44", "47", "48", "50", "53"].indexOf(planCode) > -1) {
        return false;
    } else if (lm_request['trip_type'] === "SINGLE" && ["8", "11", "12", "17", "28", "31", "42", "45", "46", "55", "60"].indexOf(planCode) > -1) {
        return false;
    } else if (lm_request['trip_type'] === "MULTI" && ["8", "17", "45", "11", "31", "55"].includes(planCode) && ['30'].includes(lm_request['maximum_duration'])) {
        return false;
    } else if (lm_request['trip_type'] === "MULTI" && ["42", "46", "60", "11", "31", "55"].includes(planCode) && ['45'].includes(lm_request['maximum_duration'])) {
        return false;
    } else if (lm_request['trip_type'] === "MULTI" && ["42", "46", "60", "8", "17", "45"].includes(planCode) && ['60'].includes(lm_request['maximum_duration'])) {
        return false;
    } else {
        return true;
    }
};
BajajAllianzTravel.prototype.get_member_relation = function (i) {
    if (this.lm_request["relation"] === 'Self' || this.lm_request["relation"] === '' || this.lm_request["relation"] === undefined) {
        if (i >= 3) {
            this.prepared_request['member_' + i + '_relation'] = 'CHILD';
        } else if (i === 1) {
            this.prepared_request['member_' + i + '_relation'] = 'SELF';
        } else if (i === 2) {
            this.prepared_request['member_' + i + '_relation'] = 'SPOUSE';
        }
    }
    this.processed_request['___member_' + i + '_relation___'] = this.prepared_request['member_' + i + '_relation'];
};
BajajAllianzTravel.prototype.premium_breakup_schema = {
    "net_premium": "premium",
    "CGST": "CGST",
    "SGST": "SGST",
    "service_tax": "serviceTax",
    "final_premium": "totalPremium"
};
module.exports = BajajAllianzTravel;