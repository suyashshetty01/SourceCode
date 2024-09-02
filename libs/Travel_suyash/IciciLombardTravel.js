/* Author: Revati Ghadge
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
function IciciLombardTravel() {

}
util.inherits(IciciLombardTravel, Travel);
IciciLombardTravel.prototype.lm_request_single = {};
IciciLombardTravel.prototype.insurer_integration = {};
IciciLombardTravel.prototype.insurer_addon_list = [];
IciciLombardTravel.prototype.insurer = {};
IciciLombardTravel.prototype.insurer_date_format = 'yyyy-MM-dd';
//IciciLombardTravel.prototype.const_insurer_suminsured = [300000, 400000, 500000, 700000, 1000000, 1500000, 2000000, 2500000, 5000000];
IciciLombardTravel.prototype.insurer_product_api_pre = function () {
    console.log('insurer_product_api_pre');
};
IciciLombardTravel.prototype.insurer_product_field_process_pre = function () {

    if (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Customer') {
        if (this.lm_request['trip_type'] === "MULTI") {
            this.processed_request['___travel_days___'] = '365';
            this.processed_request['___max_days___'] = this.lm_request['maximum_duration'];
            this.processed_request['___travel_end_date___'] = moment(this.lm_request['travel_start_date']).add((this.lm_request['maximum_duration']), 'days').format('DD/MM/YYYY');
        } else {
            this.processed_request['___travel_days___'] = moment(this.lm_request['policy_end_date']).diff(this.lm_request['policy_start_date'], 'days') + 1;
            this.processed_request['___max_days___'] = '0';
            this.processed_request['___travel_end_date___'] = this.processed_request['___policy_end_date___'];
        }
    }

    if (this.lm_request['method_type'] === 'Premium') {
        const uuidv4 = require('uuid/v4');
        var uuid = uuidv4();
        console.log('IciciLombardTravel uuid4: ' + uuid);
        this.prepared_request['correlationCode'] = this.prepared_request.hasOwnProperty('correlationCode') ? this.prepared_request['correlationCode'] : uuid;
        this.processed_request['___correlationCode___'] = this.prepared_request['correlationCode'];
        this.processed_request['___trip_type___'] = this.lm_request['trip_type'] === "MULTI" ? "MULTI" : "SINGLE";
        this.processed_request['___plan_type___'] = this.lm_request['travel_insurance_type'] === "floater" ? "FAMILY" : "SINGLE";
        this.prepared_request['travel_insurance_si_' + this.prepared_request['Plan_Id']] = this.getSI(this.prepared_request['Plan_Name']);
    } else if (this.lm_request['method_type'] === 'Customer') {
        const uuidv4 = require('uuid/v4');
        var uuid = uuidv4();
        console.log('IciciLombardTravel uuid4: ' + uuid);
        this.prepared_request['correlationCode'] = uuid;
        this.processed_request['___correlationCode___'] = this.prepared_request['correlationCode'];
        this.processed_request['___trip_type___'] = this.lm_request['trip_type'] === "MULTI" ? "Multi Trip" : "Single Trip";
        this.processed_request['___policy_type___'] = this.lm_request['travel_insurance_type'] === "floater" ? "Family" : "Individual";
        this.prepared_request['travel_country'] = this.lm_request['visiting_city'].Country;
        this.prepared_request['travel_country_code'] = this.lm_request['visiting_city'].Country_Code;
        this.prepared_request['travel_city'] = this.lm_request['visiting_city'].City_Name;
        this.prepared_request['travel_city_code'] = this.lm_request['visiting_city'].City_Code;
        this.processed_request['___travel_country___'] = this.prepared_request['travel_country'];
        this.processed_request['___travel_country_code___'] = this.prepared_request['travel_country_code'];
        this.processed_request['___travel_city___'] = this.prepared_request['travel_city'];
        this.processed_request['___travel_city_code___'] = this.prepared_request['travel_city_code'];
        this.prepared_request['visa_type'] = this.lm_request['other_detail_1_text'];
        this.processed_request['___visa_type___'] = this.prepared_request['visa_type'];
        var member = 1;
        var adult = this.lm_request['adult_count'];
        var child = this.lm_request['child_count'];
        var ped_conditns = ["Heart", "Kidney", "Cancer", "Liver"];
        this.prepared_request['restrict_on_ped'] = false;
        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";
        for (member = 1; member <= adult; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.get_member_relation(member);
            this.prepared_request['member_' + member + '_gender_2'] = this.lm_request['member_' + member + '_gender'] === 'M' ? 'MALE' : 'FEMALE';
            this.processed_request['___member_' + member + '_gender_2___'] = this.prepared_request['member_' + member + '_gender_2'];
            if (this.lm_request['member_' + member + '_ped'] !== '') {
                var ped = "";
                this.lm_request['member_' + member + '_ped'].forEach((illness) => {
                    ped += illness.name + ", ";
                });
                this.prepared_request['member_' + member + '_illness'] = ped.slice(0, -2);
                if (this.prepared_request['restrict_on_ped'] === false) {
                    this.prepared_request['restrict_on_ped'] = ped_conditns.some(el => ped.includes(el));
                }
            } else {
                this.prepared_request['member_' + member + '_illness'] = 'None';
                //txt_replace_with = txt_replace_with.replace('"___member_' + member + '_illness___"', null);
            }
            this.processed_request['___member_' + member + '_illness___'] = this.prepared_request['member_' + member + '_illness'];
        }

        for (member = 3; member <= child + 2; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.get_member_relation(member);
            this.prepared_request['member_' + member + '_gender_2'] = this.lm_request['member_' + member + '_gender'] === 'M' ? 'MALE' : 'FEMALE';
            this.processed_request['___member_' + member + '_gender_2___'] = this.prepared_request['member_' + member + '_gender_2'];
            if (this.lm_request['member_' + member + '_ped'] !== '') {
                var ped = "";
                this.lm_request['member_' + member + '_ped'].forEach((illness) => {
                    ped += illness.name + ", ";
                });
                this.prepared_request['member_' + member + '_illness'] = ped.slice(0, -2);
                if (this.prepared_request['restrict_on_ped'] === false) {
                    this.prepared_request['restrict_on_ped'] = ped_conditns.some(el => ped.includes(el));
                }
            } else {
                this.prepared_request['member_' + member + '_illness'] = 'None';
                //txt_replace_with = txt_replace_with.replace('"___member_' + member + '_illness___"', null);
            }
            this.processed_request['___member_' + member + '_illness___'] = this.prepared_request['member_' + member + '_illness'];
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
    } else if (this.lm_request['method_type'] === 'Proposal') {
        this.prepared_request['proposal_date'] = this.get_quote_date();
        this.processed_request['___proposal_date___'] = this.prepared_request['proposal_date'];

        var appId = ((config.environment.name === 'Production') ? 19 : 56);
        this.prepared_request['app_id'] = appId;
        this.processed_request['___app_id___'] = appId;
        var returnUrl = this.pg_ack_url(6);
        if (config.environment.name === 'Development') {
            returnUrl = 'http://localhost:7000/transaction-status/' + this.lm_request['udid'] + '/' + this.lm_request['crn'] + '/' + this.lm_request['proposal_id'];
        }
        this.prepared_request['return_url'] = returnUrl;
        this.processed_request['___return_url___'] = returnUrl;
    } else if (this.lm_request['method_type'] === 'Verification') {
        this.prepared_request['payment_date'] = this.proposal_processed_request['___proposal_date___'];
        this.processed_request['___payment_date___'] = this.prepared_request['payment_date'];
    }
    console.log(this.processed_request);
};
IciciLombardTravel.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {
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
IciciLombardTravel.prototype.insurer_product_field_process_post = function () {

};
IciciLombardTravel.prototype.insurer_product_api_post = function () {

};
IciciLombardTravel.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    console.log('service_call');
    try {
        var objInsurerProduct = this;
        var request = docLog.Insurer_Request;
        console.log(request);
        var Icici_Token = require('../../models/icici_token');
        Icici_Token.findOne({Product_Id: 4}, null, {sort: {'Created_On': -1}}, function (err, dbIciciToken) {
            if (err) {
                console.log('Icici Token not Found Travel', err);
            } else {
                if (specific_insurer_object.method.Method_Type === 'Premium' || specific_insurer_object.method.Method_Type === 'Customer') {
                    var Client = require('node-rest-client').Client;
                    var client = new Client();
                    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
                    var access_key = dbIciciToken['Token'];
                    console.error('token', access_key);
                    var body = JSON.parse(request);
                    var args = {
                        data: JSON.stringify(body),
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "Authorization": "Bearer " + access_key
                        }
                    };
                    console.log(JSON.stringify(args));
                    client.post(specific_insurer_object.method_file_url, args, function (data, response) {
                        // parsed response body as js object 
                        console.error('ICICI Data', JSON.stringify(data));
                        var objResponseFull = {
                            'err': null,
                            'result': null,
                            'raw': JSON.stringify(data),
                            'soapHeader': null,
                            'objResponseJson': data
                        };
                        objResponseFull['objResponseJson']['PlanCode'] = docLog['Plan_Code'];
                        var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                        console.log('ICICI serviceBreakup', serviceBreakup);
                    });
                } else if (specific_insurer_object.method.Method_Type === 'Proposal') {
                    var Client = require('node-rest-client').Client;
                    var client = new Client();
                    var username = ((config.environment.name !== 'Production') ? 'PolicyBossApp' : 'Landmark');
                    var password = ((config.environment.name !== 'Production') ? 'P0L!cy80$$@pp' : 'Landmark');
                    var body = JSON.parse(request);
                    var args = {
                        data: JSON.stringify(body),
                        headers: {"Content-Type": "application/json",
                            "Accept": "application/json",
                            'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
                        }
                    };
                    console.log(JSON.stringify(args));
                    client.post(specific_insurer_object.method_file_url, args, function (data, response) {
                        // parsed response body as js object 
                        console.log('ICICI Data', data.toString());
                        var objResponseFull = {
                            'err': null,
                            'result': null,
                            'raw': JSON.stringify(data),
                            'soapHeader': null,
                            'objResponseJson': data
                        };
                        objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                    });
                } else if (specific_insurer_object.method.Method_Type === 'Verification') {
                    var Client = require('node-rest-client').Client;
                    var client = new Client();
                    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
                    var username = ((config.environment.name !== 'Production') ? 'PolicyBossApp' : 'Landmark');
                    var password = ((config.environment.name !== 'Production') ? 'P0L!cy80$$@pp' : 'Landmark');
                    var args1 = {
                        headers: {
                            "Authorization": "Basic " + new Buffer(username + ':' + password).toString('base64')
                        }
                    };
                    var body = JSON.parse(docLog.Insurer_Request);
                    var qa_url = 'https://ilesb.southindia.cloudapp.azure.com/pgi/api/transaction/TransactionEnquiry?TransactionIdForPG=' + body['PaymentEntry']['onlineDAEntry']['TransactionId'];
                    var live_url = 'https://paygate.icicilombard.com/pgi/api/transaction/transactionenquiry?TransactionIdForPG=' + body['PaymentEntry']['onlineDAEntry']['TransactionId'];
                    client.get(config.environment.name === 'Production' ? live_url : qa_url, args1, function (data, response) {
                        console.log('ICICI tranaction Data', JSON.stringify(data));
                        if (data['Status'] === 0) {

                            var args = {
                                data: {
                                    'grant_type': 'password',
                                    'username': ((config.environment.name !== 'Production') ? 'policyboss' : 'landmark'),
                                    'password': ((config.environment.name !== 'Production') ? 'pol!cyboss' : 'l@n&M@rk'),
                                    'scope': 'esbpayment',
                                    'client_id': ((config.environment.name !== 'Production') ? 'ro.policyboss' : 'ro.landmark'),
                                    'client_secret': ((config.environment.name !== 'Production') ? 'pol!cybossCLi3nt' : 'ro.l@n&M@rkcL!3nt')
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
                            var tokenservice_url = config.icici_travel_auth.auth_url;
                            console.error('token data', JSON.stringify(args));
                            console.error(tokenservice_url);
                            client.post(tokenservice_url, args, function (data, response) {
                                // parsed response body as js object 
                                console.error('token', JSON.stringify(data));
                                var access_key = data['access_token'];
                                var body = JSON.parse(docLog.Insurer_Request);
                                var args = {
                                    data: JSON.stringify(body),
                                    headers: {"Content-Type": "application/json",
                                        "Accept": "application/json",
                                        "Authorization": "Bearer " + access_key
                                    }
                                };
                                console.log(JSON.stringify(args));
                                client.post(specific_insurer_object.method_file_url, args, function (data, response) {
                                    // parsed response body as js object 
                                    console.error('verification response', JSON.stringify(data));
                                    console.log('ICICI Data', data.toString());
                                    var objResponseFull = {
                                        'err': null,
                                        'result': null,
                                        'raw': JSON.stringify(data),
                                        'soapHeader': null,
                                        'objResponseJson': data
                                    };
                                    objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                                });
                            });
                        }
                    });
                } else if (specific_insurer_object.method.Method_Type === 'Pdf') {
                    var Client = require('node-rest-client').Client;
                    var client = new Client();
                    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
                    var args = {
                        data: {
                            'grant_type': 'password',
                            'username': ((config.environment.name !== 'Production') ? 'policyboss' : 'landmark'),
                            'password': ((config.environment.name !== 'Production') ? 'pol!cyboss' : 'l@n&M@rk'),
                            'scope': 'esbgeneric',
                            'client_id': ((config.environment.name !== 'Production') ? 'ro.policyboss' : 'ro.landmark'),
                            'client_secret': ((config.environment.name !== 'Production') ? 'pol!cybossCLi3nt' : 'ro.l@n&M@rkcL!3nt')
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
                    var tokenservice_url = config.icici_travel_auth.auth_url;
                    console.error('token data', JSON.stringify(args));
                    console.error(tokenservice_url);
                    client.post(tokenservice_url, args, function (data, response) {
                        console.error('token', JSON.stringify(data));
                        var access_key = data['access_token'];
                        var args = {
                            headers: {
                                "Authorization": "Bearer " + access_key
                            }
                        };
                        console.log(JSON.stringify(args));
                        var qs = '?policyNo=' + objInsurerProduct.processed_request["___policy_number___"];
                        client.get(specific_insurer_object.method_file_url + qs, args, function (data, response) {
                            // parsed response body as js object 
                            console.log("PDF data - ", data);
                            // raw response 
//                            console.log(response);
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
                }
            }
        });
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};
IciciLombardTravel.prototype.premium_response_handler = function (objResponseJson) {
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
        var objPremiumService = objResponseJson;
        if (objPremiumService['status'] === true) {
            if (objPremiumService.hasOwnProperty('statusMessage') && objPremiumService['statusMessage'] !== "Success") {
                Error_Msg = objPremiumService['message'];
            }
        } else if (objPremiumService.hasOwnProperty('message')) {
            Error_Msg = objPremiumService['message'];
        } else {
            Error_Msg = objPremiumService;
        }
        if (Error_Msg === 'NO_ERR') {
            var premium_breakup = this.get_const_premium_breakup();
            let plan_id = objPremiumService['PlanCode'];
            premium_breakup['base_premium'] = objPremiumService['basicPremium'].toFixed(2);
            premium_breakup['net_premium'] = objPremiumService['basicPremium'].toFixed(2);
            premium_breakup['service_tax'] = objPremiumService['totalTax'].toFixed(2);
            premium_breakup['final_premium'] = Math.round(objPremiumService['totalPremium']);
            premium_breakup['travel_insurance_si'] = this.prepared_request['travel_insurance_si_' + plan_id];
            objServiceHandler.Premium_Breakup = premium_breakup;
        }
        objServiceHandler.Error_Msg = Error_Msg;
        objServiceHandler.Insurer_Transaction_Identifier = objPremiumService.hasOwnProperty('correlationId') ? objPremiumService['correlationId'] : null;
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
IciciLombardTravel.prototype.customer_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'customer_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Customer': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (this.prepared_request['restrict_on_ped'] === true) {
            Error_Msg = 'Regret, policy cannot be issued online in-case insured members have pre-existing diseases.';
        } else if (objResponseJson.hasOwnProperty('status')) {
            if (objResponseJson['status'] === true || objResponseJson['status'] === 'SUCCESS') {
            } else {
                Error_Msg = objResponseJson['message'];
            }
        } else {
            Error_Msg = 'LM_MSG:PROPOSAL_MAIN_NODE_MISSING';
        }

        if (Error_Msg === 'NO_ERR') {
            var Customer = {
                'insurer_customer_identifier': objResponseJson['proposalNumber'],
                'insurer_customer_identifier_2': objResponseJson['customerId'],
                'insurer_customer_identifier_3': this.prepared_request['correlationCode']
            };
            objServiceHandler.Customer = Customer;
            objServiceHandler.Insurer_Transaction_Identifier = Customer['insurer_customer_identifier_3'];
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'customer_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'customer_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
IciciLombardTravel.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        //check error start
        if (objResponseJson.includes("Unable") || objResponseJson.includes("exists")) {
            Error_Msg = objResponseJson;
        }

        if (Error_Msg === 'NO_ERR') {
            var transaction_id = objResponseJson;
            var pg_data = {
                'transactionId': transaction_id
            };
//            objServiceHandler.Payment.pg_url += "?transactionId=" + transaction_id;
            objServiceHandler.Payment.pg_data = pg_data;
            objServiceHandler.Payment.pg_redirect_mode = 'GET';
            objServiceHandler.Insurer_Transaction_Identifier = this.prepared_request['dbmaster_insurer_transaction_identifier'];
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
IciciLombardTravel.prototype.pg_response_handler = function () {
    try {
        console.log('Start', this.constructor.name, 'pg_response_handler');
        var output = this.const_payment_response.pg_post;
        this.const_policy.transaction_id = output['TransactionId'];
        if (output['Success'] === 'True') {
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.transaction_amount = output['Amount'];
            this.const_policy.policy_id = output['AdditionalInfo3'];
            this.const_policy.pg_reference_number_1 = output['AuthCode'];
            this.const_policy.pg_reference_number_2 = output['MerchantId'];
            this.const_policy.pg_reference_number_3 = output['AdditionalInfo2'];
        } else {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
IciciLombardTravel.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    try {
        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null,
            'Policy': null
        };
        if (this.const_policy.pg_status === 'FAIL') {
        }
        if (this.const_policy.pg_status === 'SUCCESS') {

            if (!objResponseJson.hasOwnProperty('status')) {
                Error_Msg = 'LM_EMPTY_RESPONSE';
            } else {
                if (objResponseJson['status'] === true) {
                    var paymentTagResponse = objResponseJson['paymentTagResponse']['paymentTagResponseList'][0];
                    if (paymentTagResponse['status'] === 'SUCCESS') {
                        if (paymentTagResponse.hasOwnProperty('policyNo') && paymentTagResponse['policyNo'] !== '' && paymentTagResponse['policyNo'] !== null && paymentTagResponse['policyNo'] !== '0') {
                            this.const_policy.policy_number = paymentTagResponse['policyNo'];
                        } else if (paymentTagResponse.hasOwnProperty('coverNoteNo') && paymentTagResponse['coverNoteNo'] !== "") {
                            this.const_policy.policy_id = paymentTagResponse['coverNoteNo'];
                        } else {
                            Error_Msg = paymentTagResponse['errorText'] !== "" ? paymentTagResponse['errorText'] : "LM_POLICY_NUMBER_NA";
                        }
                    } else {
                        Error_Msg = paymentTagResponse['status'];
                    }
                } else {
                    Error_Msg = objResponseJson['statusMessage'];
                }
            }

            if (Error_Msg === 'NO_ERR') {
                this.const_policy.transaction_status = 'SUCCESS';
                if (this.const_policy.policy_number !== '' && this.const_policy.policy_number !== null && this.const_policy.policy_number !== undefined) {
                    this.const_policy.transaction_substatus = "IF";
                    var pdf_file_name = this.constructor.name + '_' + 'Travel' + '_' + this.const_policy.policy_number.toString().replaceAll('/', '') + '.pdf';
                    var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                    var pdf_web_path = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    this.const_policy.policy_url = pdf_web_path;
                    var args = {
                        data: {
                            "search_reference_number": this.lm_request['search_reference_number'],
                            "api_reference_number": this.lm_request['api_reference_number'],
                            "policy_number": this.const_policy.policy_number,
                            'client_key': this.lm_request['client_key'],
                            'secret_key': this.lm_request['secret_key'],
                            'insurer_id': this.lm_request['insurer_id'],
                            'method_type': 'Pdf',
                            'execution_async': 'no'
                        },
                        headers: {
                            "Content-Type": "application/json",
                            'client_key': this.lm_request['client_key'],
                            'secret_key': this.lm_request['secret_key']
                        }
                    };
                    this.pdf_call(config.environment.weburl + '/quote/pdf_initiate', args, pdf_sys_loc);
                } else {
                    this.const_policy.transaction_substatus = "UW";
                }
            } else {
                this.const_policy.transaction_status = 'PAYPASS';
            }

            objServiceHandler.Insurer_Transaction_Identifier = this.const_policy.transaction_id;
        }
        objServiceHandler.Policy = this.const_policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
        return objServiceHandler;
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', objServiceHandler);
        return objServiceHandler;
    }
};
IciciLombardTravel.prototype.pdf_call = function (url, args, pdf_sys_loc) {
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
IciciLombardTravel.prototype.pdf_response_handler = function (objResponseJson) {
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
            if (objResponseJson) {

                var pdf_file_name = this.constructor.name + '_Travel_' + this.lm_request['policy_number'].replaceAll('/', '') + '.pdf';
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
        console.error('Exception', this.constructor.name, 'pdf_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
IciciLombardTravel.prototype.get_member_relation = function (i) {
    console.log(this.constructor.name, 'get_member_relation', ' Start IciciLombardTravel');
    var gender = this.lm_request['member_' + i + '_gender'];
    this.prepared_request['member_' + i + '_nominee_name'] = this.lm_request["contact_name"];
    var proposer_rel = this.lm_request["relation"];
    var member_rel = '';
//    var member_nominee_rel = '';

    if (proposer_rel === 'Son' || proposer_rel === 'Daughter') {
        member_rel = gender === 'M' ? 'Father' : 'Mother';
        //member_nominee_rel = this.lm_request['gender'] === 'M' ? 'Son' : 'Daughter';
    } else if (proposer_rel === 'Father' || proposer_rel === 'Mother') {
        member_rel = gender === 'M' ? 'Son' : 'Daughter';
        //member_nominee_rel = this.lm_request['gender'] === 'M' ? 'Father' : 'Mother';
    } else if (proposer_rel === 'Spouse') {
        member_rel = 'Spouse';
//        member_nominee_rel = 'Spouse';
        if (i >= 3) {
            member_rel = gender === 'M' ? 'Son' : 'Daughter';
            //member_nominee_rel = this.lm_request['gender'] === 'M' ? 'Father' : 'Mother';
        }
    }

    if (proposer_rel === 'Self' || proposer_rel === '') {
        if (i >= 3) {
            member_rel = gender === 'M' ? 'Son' : 'Daughter';
            //member_nominee_rel = this.lm_request['member_1_gender'] === 'M' ? 'Father' : 'Mother';
        } else if (i === 1) {
            member_rel = 'Self';
            //member_nominee_rel = this.lm_request["nominee_relation"];
            this.prepared_request['member_' + i + '_nominee_name'] = this.lm_request["nominee_name"];
        } else if (i === 2) {
            member_rel = 'Spouse';
//            member_nominee_rel = 'Spouse';
        }
    }

    this.prepared_request['member_' + i + '_relation'] = member_rel;
    this.processed_request['___member_' + i + '_relation___'] = member_rel;
//    this.prepared_request['member_' + i + '_nominee_rel'] = member_nominee_rel;
//    this.processed_request['___member_' + i + '_nominee_rel___'] = member_nominee_rel;
    this.processed_request['___member_' + i + '_nominee_name___'] = this.prepared_request['member_' + i + '_nominee_name'];
};
IciciLombardTravel.prototype.getSI = function (planName) {
    if (planName.includes("500")) {
        return "$500000";
    } else if (planName.includes("250")) {
        return "$250000";
    } else if (planName.includes("100")) {
        return "$100000";
    } else if (planName.includes("25")) {
        return "$25000";
    } else {
        return "$50000";
    }
};
IciciLombardTravel.prototype.get_quote_date = function () {
    var moment = require('moment');
    var today = moment().utcOffset("+05:30");
    var quote_date = today.format('YYYY-MM-DD');
    return quote_date;
};

IciciLombardTravel.prototype.is_valid_plan = function (lm_request, planCode) {
    console.log('IciciLombardTravel is_valid_plan', 'start');
    if (config.environment.name !== 'Production') {
        if (lm_request['trip_type'] === "MULTI" && [60913, 61909, 61907, 61908].indexOf(planCode) > -1) {
            return true;
        } else if (lm_request['trip_type'] === "SINGLE" && [60913, 61909, 61907, 61908].indexOf(planCode) > -1) {
            return false;
        } else {
            return true;
        }
    } else {
        let region = lm_request['travelling_to_area'];
        if (lm_request['travelling_to_area'] !== "WorldWide" && lm_request['travelling_to_area'] !== "Europe") {
            region = "WWExUSCanada";
        } else {
            if (lm_request['travelling_to_area'] === "Europe" && lm_request['member_1_age'] < 51) {
                region = lm_request['trip_type'] === "SINGLE" ? "WWExUSCanada" : "WorldWide";
            }
        }
        let ILPlans = {};
        if (lm_request['member_1_age'] > 70) {
            ILPlans = [
                {'region': 'WorldWide', 'ins_type': 'individual', 'trip_type': "SINGLE", 'plans': [12237, 12238]},
                {'region': 'WorldWide', 'ins_type': 'floater', 'trip_type': "SINGLE", 'plans': [12272, 12273]},
                {'region': 'WWExUSCanada', 'ins_type': 'individual', 'trip_type': "SINGLE", 'plans': [12235, 12236]},
                {'region': 'WWExUSCanada', 'ins_type': 'floater', 'trip_type': "SINGLE", 'plans': [12270, 12271]},
                {'region': 'Europe', 'ins_type': 'individual', 'trip_type': "SINGLE", 'plans': [12239]},
                {'region': 'Europe', 'ins_type': 'floater', 'trip_type': "SINGLE", 'plans': [12274]}
            ];
        } else {
            ILPlans = [
                {'region': 'WorldWide', 'ins_type': 'individual', 'trip_type': "SINGLE", 'plans': [12206, 12207, 12208, 12209, 12221, 12222, 12223, 12224]},
                {'region': 'WWExUSCanada', 'ins_type': 'individual', 'trip_type': "SINGLE", 'plans': [12202, 12203, 12204, 12205, 12217, 12218, 12219, 12220]},
                {'region': 'WorldWide', 'ins_type': 'individual', 'trip_type': "MULTI", 'plans': [12214, 12215, 12216]},
                {'region': 'WorldWide', 'ins_type': 'floater', 'trip_type': "SINGLE", 'plans': [12251, 12252, 12253, 12254, 12261, 12262, 12263, 12264]},
                {'region': 'WWExUSCanada', 'ins_type': 'floater', 'trip_type': "SINGLE", 'plans': [12247, 12248, 12249, 12250, 12257, 12258, 12259, 12260]},
                {'region': 'Europe', 'ins_type': 'individual', 'trip_type': "SINGLE", 'plans': [12210, 12376]},
                {'region': 'Europe', 'ins_type': 'floater', 'trip_type': "SINGLE", 'plans': [12255, 12377]}
            ];
        }
        let index = ILPlans.findIndex(x => x.trip_type === lm_request['trip_type'] && x.region === region
                    && x.ins_type === lm_request['travel_insurance_type'] && x.plans.indexOf(planCode) > -1);

        console.log('IciciLombardTravelplanCode', planCode, lm_request['plan_name'], index);
        return (index > -1 ? true : false);
    }
    console.log('IciciLombardTravel is_valid_plan', 'End');
};
IciciLombardTravel.prototype.premium_breakup_schema = {
    "net_premium": "NetPremium",
    "tax": {
        "CGST": "CGST",
        "SGST": "SGST",
        "IGST": "IGST",
        "UGST": "UGST"
    },
    "service_tax": 0,
    "final_premium": "GrossPremium"
};
module.exports = IciciLombardTravel;