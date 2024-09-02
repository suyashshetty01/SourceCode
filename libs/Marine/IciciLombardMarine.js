/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

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

function IciciLombardMarine() {

}
util.inherits(IciciLombardMarine, Marine);

IciciLombardMarine.prototype.lm_request_single = {};
IciciLombardMarine.prototype.insurer_integration = {};
IciciLombardMarine.prototype.insurer_addon_list = [];
IciciLombardMarine.prototype.insurer = {};
IciciLombardMarine.prototype.insurer_date_format = 'yyyy-MM-dd';
IciciLombardMarine.prototype.const_insurer_suminsured = [500000, 700000, 1000000];

IciciLombardMarine.prototype.insurer_product_api_pre = function () {
    console.log('insurer_product_api_pre');
};

IciciLombardMarine.prototype.insurer_product_field_process_pre = function () {
    // console.log('insurer_product_api_pre');
    console.log(this.constructor.name + '::' + 'product_api_pre' + '::Start');
    var objLMRequest = this.lm_request;

    // console.log(this.lm_request['type_of_cargo'])
    if (this.lm_request['method_type'] === 'Premium') {
        const uuidv4 = require('uuid/v4');
        var uuid = uuidv4();
        this.prepared_request['correlationCode'] = this.prepared_request.hasOwnProperty('correlationCode') ? this.prepared_request['correlationCode'] : uuid;
        this.processed_request['___correlationCode___'] = this.prepared_request['correlationCode'];

        var stateName = this.insurer_master.cities.pb_db_master.State_Name;
        this.prepared_request['state_name'] = stateName;
        this.processed_request['___state_name___'] = this.prepared_request['state_name'];
        var type_of_cargo = this.lm_request['cmmodityName'];
        this.prepared_request['type_of_cargo'] = type_of_cargo;
        this.processed_request['___type_of_cargo___'] = this.prepared_request['type_of_cargo'];
        var sum_insured = (this.lm_request['sum_insured'] - 0) * 1.10;
        this.prepared_request['sum_insured'] = Math.round(sum_insured);
        this.processed_request['___sum_insured___'] = this.prepared_request['sum_insured'];
        this.prepared_request['limit_per_sending'] = sum_insured;
        this.processed_request['___limit_per_sending___'] = this.prepared_request['limit_per_sending'];
        this.prepared_request['limits_per_location'] = sum_insured;
        this.processed_request['___limits_per_location___'] = this.prepared_request['limits_per_location'];
        var modeoftransit = this.lm_request['mode_of_transit'];
        this.prepared_request['mode_of_transit'] = modeoftransit;
        this.processed_request['___mode_of_transit___'] = this.prepared_request['mode_of_transit'];
        var transitfrom = this.lm_request['transit_from_cityName'];
        this.prepared_request['transit_from_cityName'] = transitfrom;
        this.processed_request['___Transit_From___'] = this.prepared_request['transit_from_cityName'];
        var transitto = this.lm_request['transit_to_cityName'];
        this.prepared_request['transit_to_cityName'] = transitto;
        this.processed_request['___Transit_To___'] = this.prepared_request['transit_to_cityName'];
//        this.prepared_request['commodity_name'] = type_of_cargo;
//        this.processed_request['__commodity_name__'] = this.prepared_request['commodity_name'];
        //    console.log(this.lm_request);
        //    console.log(this.processed_request);

    } else if (this.lm_request['method_type'] === 'Customer') {
        var desctiption_of_cargo = (this.lm_request['description_Of_Cargo'] ? this.lm_request['description_Of_Cargo'] : "new cargo");
        this.prepared_request['desctiption_of_cargo'] = desctiption_of_cargo;
        this.processed_request['___desctiption_of_cargo___'] = this.prepared_request['desctiption_of_cargo'];
        var desctiption_of_cargo = (this.lm_request['description_Of_Cargo'] ? this.lm_request['description_Of_Cargo'] : "new cargo");
        var first_name = this.lm_request['contact_name'];
        this.prepared_request['first_name'] = first_name;
        this.processed_request['___first_name___'] = this.prepared_request['first_name'];

        var mobile = this.lm_request['mobile'];
        this.prepared_request['mobile'] = mobile;
        this.processed_request['___mobile___'] = this.prepared_request['mobile'];

        var email = this.lm_request['email'];
        this.prepared_request['email'] = email;
        this.processed_request['___email___'] = this.prepared_request['email'];

        var dob = this.lm_request['dob'];
        this.prepared_request['dob'] = dob;
        this.processed_request['___dob___'] = this.prepared_request['dob'];

        var amount = this.lm_request['amount'];
        this.prepared_request['amount'] = amount;
        this.processed_request['___amount___'] = this.prepared_request['amount'];

        var sumInsured = (this.lm_request['sum_insured'] - 0) * 1.10;
        this.prepared_request['sumInsured'] = Math.round(sumInsured);
        this.processed_request['___sumInsured___'] = this.prepared_request['sumInsured'];

        var description_Of_Packing = (this.lm_request['description_Of_Packing'] ? this.lm_request['description_Of_Packing'] : " new packing");
        this.prepared_request['desctiption_of_Packing'] = description_Of_Packing;
        this.processed_request['___desctiption_of_Packing___'] = this.prepared_request['desctiption_of_Packing'];

        var transitfrom = this.lm_request['transit_from'];
        this.prepared_request['Transit_From'] = transitfrom;
        this.processed_request['___Transit_From___'] = this.prepared_request['Transit_From'];
        var transitto = this.lm_request['transit_to'];
        this.prepared_request['Transit_To'] = transitto;
        this.processed_request['___Transit_To___'] = this.prepared_request['Transit_To'];

        var finalPremium = this.lm_request['final_premium'];
        this.prepared_request['final_premium'] = finalPremium;
        this.processed_request['___final_premium___'] = this.prepared_request['final_premium'];


        var modeoftransit = this.lm_request['mode_of_transport'];
        this.prepared_request['mode_of_transit'] = modeoftransit;
        this.processed_request['___mode_of_transit___'] = this.prepared_request['mode_of_transit'];

        this.prepared_request['ninetyFivePercent_Premium'] = this.lm_request['ninetyFivePercent_Premium'];
        this.processed_request['___ninety_FivePercent_Premium___'] = this.prepared_request['ninetyFivePercent_Premium'];

        this.prepared_request['ninetyFivePercent_Rate'] = this.lm_request['ninetyFivePercent_Rate'];
        this.processed_request['___ninety_FivePercent_Rate___'] = this.prepared_request['ninetyFivePercent_Rate'];

        this.prepared_request['fivePercent_Premium'] = this.lm_request['fivePercent_Premium'];
        this.processed_request['___five_Percent_Premium___'] = this.prepared_request['fivePercent_Premium'];

        this.prepared_request['fivePercent_Rate'] = this.lm_request['fivePercent_Rate'];
        this.processed_request['___five_Percent_Rate___'] = this.prepared_request['fivePercent_Rate'];

//        this.prepared_request['state_code'] =  this.lm_request['state_code'];
//        this.processed_request['___state_code___'] = this.prepared_request['state_code'];
//
//        this.prepared_request['city_id'] =  this.lm_request['city_id'];
//        this.processed_request['___city_code___'] = this.prepared_request['city_id'];

        this.prepared_request['invoice_date'] = this.lm_request['invoiceDate'];
        this.processed_request['___invoice_date___'] = this.prepared_request['invoice_date'];
		
        this.prepared_request['invoice_number'] = this.lm_request['invoiceNumber'];
        this.processed_request['___invoice_number___'] = this.prepared_request['invoice_number'];
		
		 this.prepared_request['bill_number'] = this.lm_request['billNumber'];
        this.processed_request['___bill_number___'] = this.prepared_request['bill_number'];
		
		 this.prepared_request['bill_date'] = this.lm_request['billDate'];
        this.processed_request['___bill_date___'] = this.prepared_request['bill_date'];


        console.log(this.processed_request);

    } else if (this.lm_request['method_type'] === 'Proposal') {
        var appId = ((config.environment.name === 'Production') ? 19 : 56);
        this.prepared_request['app_id'] = appId;
        this.processed_request['___app_id___'] = appId;
        var returnUrl = "";
        var returnUrl = ((config.environment.name === 'Production') ? 'http://horizon.policyboss.com/transaction-status/' : 'http://qa-horizon.policyboss.com/transaction-status/') + this.lm_request['udid'] + '/' + this.lm_request['crn'];
        if (config.environment.name === 'Development') {
            returnUrl = 'http://localhost:7000/transaction-status/' + this.lm_request['udid'] + '/' + this.lm_request['crn'];
        }
        this.prepared_request['return_url'] = returnUrl;
        this.processed_request['___return_url___'] = returnUrl;
    } else if (this.lm_request['method_type'] === 'Verification') {
        this.prepared_request['customer_id'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['insurer_customer_identifier_2'];
        this.processed_request['___customer_id___'] = this.prepared_request['customer_id'];
        this.prepared_request['proposal_num'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['insurer_customer_identifier'];
        this.processed_request['___proposal_num___'] = this.prepared_request['proposal_num'];
    }

};

IciciLombardMarine.prototype.get_taxeffective_date = function () {
    console.log(this.constructor.name, 'quote_date');
    var today = moment().format('DD/MM/YYYY');
    return today;
};

IciciLombardMarine.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {
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
IciciLombardMarine.prototype.insurer_product_field_process_post = function () {
    console.log('IciciLombardMarine insurer_product_field_process_post');
};
IciciLombardMarine.prototype.insurer_product_api_post = function () {
    console.log(' IciciLombardMarine insurer_product_api_post');
};
IciciLombardMarine.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    console.log('service_call');
    try {
        var objInsurerProduct = this;
        var request = docLog.Insurer_Request;

        var Icici_Token = require('../../models/icici_token');
        Icici_Token.findOne({Product_Id: 13}, null, {sort: {'Created_On': -1}}, function (err, dbIciciToken) {
            if (err) {
                console.log('Icici Token not Found ', err);
            } else {
                if (specific_insurer_object.method.Method_Type === 'Premium' || specific_insurer_object.method.Method_Type === 'Customer') {
                    var Client = require('node-rest-client').Client;
                    var client = new Client();
                    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

                    var body = JSON.parse(request);
                    var args = {
                        data: JSON.stringify(body),
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "Authorization": "Bearer " + dbIciciToken['Token']
                        }
                    };

                    console.log(JSON.stringify(args));
                    client.post(specific_insurer_object.method_file_url, args, function (data, response) {
                        // parsed response body as js object 
                        if (specific_insurer_object.method.Method_Type === 'Customer') {
                            console.error('ICICI Data', data.toString());
                        } else {
                            console.error('ICICI Data', JSON.stringify(data));
                        }
                        var objResponseFull = {
                            'err': null,
                            'result': null,
                            'raw': JSON.stringify(data),
                            'soapHeader': null,
                            'objResponseJson': data
                        };
                        console.log(data);
                        var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                        console.log('ICICI serviceBreakup', serviceBreakup);
                    });
                    //});
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
                    //console.error('proposal Data', args.toString());
                    client.post(specific_insurer_object.method_file_url, args, function (data, response) {
                        // parsed response body as js object 

                        var objResponseFull = {
                            'err': null,
                            'result': null,
                            'raw': JSON.stringify(data),
                            'soapHeader': null,
                            'objResponseJson': data
                        };

                        var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
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
                        console.log('ICICI tranaction Data', data.toString());
                        if (data['Status'] === 0) {

                            var args = {
                                data: {'grant_type': 'password',
                                    'username': 'landmark',
                                    'password': 'l@n!m@$k',
                                    'scope': 'esbpayment',
                                    'client_id': 'ro.landmark',
                                    'client_secret': 'ro.l@n!m@$k'
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
                            var tokenservice_url = config.icici_marine_auth.auth_url;
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
                                    var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
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
                            'username': 'landmark',
                            'password': 'l@n!m@$k',
                            'scope': 'esbgeneric',
                            'client_id': 'ro.landmark',
                            'client_secret': 'ro.l@n!m@$k'
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
                    var tokenservice_url = config.icici_marine_auth.auth_url;
                    console.error('token data', JSON.stringify(args));
                    console.error(tokenservice_url);
                    client.post(tokenservice_url, args, function (data, response) {
                        console.error('token', JSON.stringify(data));
                        var access_key = data['access_token'];
                        var args = {
                            headers: {
                                "Authorization": "Bearer " + access_key}
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
                            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                        });
                    });
                }
            }
        });
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};

IciciLombardMarine.prototype.premium_response_handler = function (objResponseJson) {
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
        } else if (objPremiumService.hasOwnProperty('message')) {
            Error_Msg = objPremiumService['message'];
        } else {
            Error_Msg = objPremiumService;
        }
        if (Error_Msg === 'NO_ERR') {
            var premium_breakup = this.get_const_premium_breakup();
            premium_breakup['base_premium'] = objPremiumService['netPremium'];
            premium_breakup['net_premium'] = objPremiumService['netPremium'];
            premium_breakup['service_tax'] = objPremiumService['taxDetails']['gstServiceDetails']['0']['totalTax'];
            premium_breakup['tax']['CGST'] = premium_breakup['service_tax'] / 2;
            premium_breakup['tax']['SGST'] = premium_breakup['service_tax'] / 2;
            premium_breakup['final_premium'] = Math.round(objPremiumService['totalPremium']);
            premium_breakup['ninetyFivePercentPremium'] = Math.round(objPremiumService['ninetyFivePercentPremium']);
            premium_breakup['ninetyFivePercentRate'] = (objPremiumService['ninetyFivePercentRate']).toFixed(5);
            premium_breakup['fivePercentPremium'] = Math.round(objPremiumService['fivePercentPremium']);
            premium_breakup['fivePercentRate'] = (objPremiumService['fivePercentRate']).toFixed(5);
            premium_breakup['rackAmount'] = Math.round(objPremiumService['rackAmount']);
            objServiceHandler.Premium_Breakup = premium_breakup;
        }
        objServiceHandler.Insurer_Transaction_Identifier = objPremiumService.hasOwnProperty('correlationId') ? objPremiumService['correlationId'] : null;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);

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
IciciLombardMarine.prototype.customer_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'customer_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Customer': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson.hasOwnProperty('status')) {
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
                'insurer_customer_identifier_2': objResponseJson['customerId']
            };
            objServiceHandler.Customer = Customer;
            objServiceHandler.Insurer_Transaction_Identifier = this.prepared_request['dbmaster_insurer_transaction_identifier'];
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'customer_response_handler', objServiceHandler);

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

IciciLombardMarine.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        var objProposalService = objResponseJson;
        console.log("obj->");
        console.log(objResponseJson);
        if (objResponseJson.includes("Unable")) {
            Error_Msg = objResponseJson;
        }
        if (objResponseJson)
            if (Error_Msg === 'NO_ERR') {
                var transaction_id = objResponseJson;
                var pg_data = {
                    'transactionId': transaction_id
                };
//                objServiceHandler.Payment.pg_url += "?transactionId=" + transaction_id;
                objServiceHandler.Payment.pg_data = pg_data;
                objServiceHandler.Payment.pg_redirect_mode = 'GET';
                objServiceHandler.Insurer_Transaction_Identifier = this.prepared_request['dbmaster_insurer_transaction_identifier'];
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
IciciLombardMarine.prototype.pg_response_handler = function () {
    try {
//        this.const_policy.pg_status = '';
        var output = this.const_payment_response.pg_post;
        this.const_policy.transaction_id = output['TransactionId'];
        if (output['Success'] === 'True') {
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.transaction_amount = output['Amount'];
            this.const_policy.pg_reference_number_1 = output['AuthCode'];
            this.const_policy.pg_reference_number_2 = output['MerchantId'];
        } else {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
IciciLombardMarine.prototype.verification_response_handler = function (objResponseJson) {
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
                    } else if (paymentTagResponse.hasOwnProperty('policyNo') && paymentTagResponse['policyNo'] !== '' && paymentTagResponse['policyNo'] !== null) {
                    } else {
//                        Error_Msg = paymentTagResponse['errorText'];
                        Error_Msg = paymentTagResponse['errorText'] !== null ? paymentTagResponse['errorText'] : "ERROR";

                    }
                } else {
                    Error_Msg = objResponseJson['statusMessage'];
                }
            }

            if (Error_Msg === 'NO_ERR') {
                var paymentTagResponse = objResponseJson['paymentTagResponse']['paymentTagResponseList'][0];
                if (paymentTagResponse.hasOwnProperty('policyNo')) {
                    this.const_policy.policy_number = paymentTagResponse['policyNo'];
                    this.const_policy.transaction_status = 'SUCCESS';
                    var pdf_file_name = this.constructor.name + '_' + 'Marine' + '_' + this.const_policy.policy_number.toString().replaceAll('/', '') + '.pdf';
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
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', ex);
    }
};
IciciLombardMarine.prototype.pdf_call = function (url, args, pdf_sys_loc) {
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
IciciLombardMarine.prototype.pdf_response_handler = function (objResponseJson) {
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

                var pdf_file_name = this.constructor.name + '_Marine_' + this.lm_request['policy_number'].replaceAll('/', '') + '.pdf';
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
        } else {
            policy.transaction_status = 'PAYPASS';
        }
        objServiceHandler.Policy = policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'pdf_response_handler', objServiceHandler);
        return objServiceHandler;
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'pdf_response_handler', ex);
    }

};
IciciLombardMarine.prototype.premium_breakup_schema = {
    "net_premium": "NetPremium",
    "tax": {
        "CGST": "CGST",
        "SGST": "SGST",
        "IGST": "IGST",
        "UGST": "UGST"
    },
    "service_tax": 0,
    "final_premium": "GrossPremium",
    "ninetyFivePercentPremium": "ninetyFivePercentPremium",
    "ninetyFivePercentRate": "ninetyFivePercentRate",
    "fivePercentPremium": "fivePercentPremium",
    "fivePercentRate": "fivePercentRate",
    "rackAmount": "rackAmount"

};


module.exports = IciciLombardMarine;