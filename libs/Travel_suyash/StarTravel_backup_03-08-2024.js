/* Author: Kevin Monteiro
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

function StarTravel() {

}
util.inherits(StarTravel, Travel);

StarTravel.prototype.lm_request_single = {};
StarTravel.prototype.insurer_integration = {};
StarTravel.prototype.insurer_addon_list = [];
StarTravel.prototype.insurer = {};
StarTravel.prototype.insurer_date_format = 'MMMM D, YYYY';
//StarTravel.prototype.const_insurer_suminsured = [100000, 150000, 200000, 300000, 400000, 500000, 750000, 1000000, 1500000, 2000000, 2500000, 5000000, 7500000, 10000000];


StarTravel.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
StarTravel.prototype.insurer_product_field_process_pre = function () {
    var member = 1;
    var adult = this.lm_request['adult_count'];
    var child = this.lm_request['child_count'];
    var member_count = this.lm_request['member_count'];
    if (this.lm_request['method_type'] === 'Premium') {
        for (member = 1; member <= member_count; member++) {
            this.prepared_request['member_' + member + '_inc'] = member - 1;
            this.processed_request['___member_' + member + '_inc___'] = member - 1;
        }
    } else if (this.lm_request['method_type'] === 'Customer') {

        for (member = 1; member <= member_count; member++) {
            this.prepared_request['member_' + member + '_inc'] = member - 1;
            this.processed_request['___member_' + member + '_inc___'] = member - 1;
        }

        let index = this.lm_request['otherDetailsData'].findIndex(x => x.id === '3');
        this.prepared_request['travelPurposeId'] = this.lm_request['otherDetailsData'][index].value;
        this.processed_request['___travelPurposeId___'] = this.prepared_request['travelPurposeId'];

        var placeOfVisit = "";
        this.lm_request['visiting_countries'].forEach((country) => {
            placeOfVisit += country.item_id + ", ";
        });
        this.prepared_request['placeOfVisit'] = placeOfVisit.slice(0, -2);
        this.processed_request['___placeOfVisit___'] = this.prepared_request['placeOfVisit'];

        this.lm_request['otherDetailsData'].forEach((detail) => {
            this.prepared_request[detail.Ins_field] = detail.value;
            this.processed_request['___' + detail.Ins_field + '___'] = detail.value;
        });


        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";

        for (member = 1; member <= this.lm_request['adult_count']; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.get_member_relation(member);
            this.prepared_request['member_' + member + '_gender2'] = this.lm_request['member_' + member + '_gender'] === "M" ? "Male" : "Female";
            this.processed_request['___member_' + member + '_gender2___'] = this.prepared_request['member_' + member + '_gender2'];
            if (this.lm_request['member_' + member + '_ped'] !== '') {
                var ped = "";
                this.lm_request['member_' + member + '_ped'].forEach((illness) => {
                    ped += illness.name + ", ";
                });
                this.prepared_request['member_' + member + '_illness'] = ped.slice(0, -2);
            } else {
                this.prepared_request['member_' + member + '_illness'] = 'NONE';
            }
            this.processed_request['___member_' + member + '_illness___'] = this.prepared_request['member_' + member + '_illness'];
            this.prepared_request['member_' + member + '_passport_exp'] = this.dateToReqFormat(this.lm_request['member_' + member + '_passport_expiry']);
            this.processed_request['___member_' + member + '_passport_exp___'] = this.prepared_request['member_' + member + '_passport_exp'];

        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.get_member_relation(member);
            this.prepared_request['member_' + member + '_gender2'] = this.lm_request['member_' + member + '_gender'] === "M" ? "Male" : "Female";
            this.processed_request['___member_' + member + '_gender2___'] = this.prepared_request['member_' + member + '_gender2'];
            if (this.lm_request['member_' + member + '_ped'] !== '') {
                var ped = "";
                this.lm_request['member_' + member + '_ped'].forEach((illness) => {
                    ped += illness.name + ", ";
                });
                this.prepared_request['member_' + member + '_illness'] = ped.slice(0, -2);
            } else {
                this.prepared_request['member_' + member + '_illness'] = 'NONE';
            }
            this.processed_request['___member_' + member + '_illness___'] = this.prepared_request['member_' + member + '_illness'];
            this.prepared_request['member_' + member + '_passport_exp'] = this.dateToReqFormat(this.lm_request['member_' + member + '_passport_expiry']);
            this.processed_request['___member_' + member + '_passport_exp___'] = this.prepared_request['member_' + member + '_passport_exp'];
        }

        if (this.method_content[0] !== '<') {// for json
            txt_replace_with = txt_replace_with.replaceAll('<!--InsurersDetail_Start-->', "");
            var Total_Count = member_count;
            for (var x = 1; x <= Total_Count - 1; x++) {
                txt_replace_with = txt_replace_with.replace('<!--InsurersDetail_End-->', ",");
            }
            txt_replace_with = txt_replace_with.replace('<!--InsurersDetail_End-->', "");
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);

//        this.prepared_request['areaID'] = this.lm_request['areaId'];
//        this.processed_request['___areaID___'] = this.prepared_request['areaID'];
    } else if (this.lm_request['method_type'] === 'Pdf') {
        this.prepared_request['insurer_reference_identifier'] = this.const_policy.transaction_id;
        this.processed_request['___insurer_reference_identifier___'] = this.prepared_request['insurer_reference_identifier'];
    }
    console.log(this.processed_request);
};
StarTravel.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {
    var obj_response_handler;
    if (specific_insurer_object.method.Method_Type === 'Premium') {
        obj_response_handler = this.premium_response_handler(objResponseJson);
    } else if (specific_insurer_object.method.Method_Type === 'Customer') {
        obj_response_handler = this.customer_response_handler(objResponseJson);
    } else if (specific_insurer_object.method.Method_Type === 'Proposal') {
        obj_response_handler = this.proposal_response_handler(objResponseJson);
    } else if (specific_insurer_object.method.Method_Type === 'Verification') {
        obj_response_handler = this.verification_response_handler(objResponseJson);
    } else if (specific_insurer_object.method.Method_Type === 'Pdf') {
        obj_response_handler = this.pdf_response_handler(objResponseJson);
    }
    return obj_response_handler;
};
StarTravel.prototype.insurer_product_field_process_post = function () {

};
StarTravel.prototype.insurer_product_api_post = function () {

};
StarTravel.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    console.log('service_call');

    try {
        var objInsurerProduct = this;
        var body = docLog.Insurer_Request;
        var Client = require('node-rest-client').Client;
        var client = new Client();

        if (this.method.Method_Type === 'Verification') {
            specific_insurer_object.method_file_url += this.prepared_request['pg_reference_number_1'] + "/purchase/response";
            var apikey = this.prepared_request['insurer_integration_service_user'];
            var secretkey = this.prepared_request['insurer_integration_service_password'];
            var args = {
                data: body,
                headers: {
                    "Content-Type": "application/json"
                }
            };
            client.post(specific_insurer_object.method_file_url, args, function (data, response) {
                // parsed response body as js object 
                console.error('reference', data.toString());
                var err = null;
                var objData = null;
                if (data.indexOf('{') === 0) {
                    objData = data.toString();
                } else {
                    err = data;
                }
                var finalData = objData;
                var purchaseResp = JSON.parse(objData);
                specific_insurer_object.method.Service_URL += purchaseResp['referenceId'] + "/policystatus";

                var requestData = {
                    "APIKEY": apikey,
                    "SECRETKEY": secretkey,
                    "referenceId": purchaseResp['referenceId']
                };
                var args = {
                    data: JSON.stringify(requestData),
                    headers: {
                        "Content-Type": "application/json"
                    }
                };
                client.post(specific_insurer_object.method.Service_URL, args, function (data, response) {
                    console.error('policy status', data.toString());
                    err = null;
                    objData = null;
                    if (data.indexOf('{') === 0) {
                        objData = data.toString();
                    } else {
                        err = data;
                    }
                    finalData = finalData + objData;
                    finalData = finalData.replaceAll('}{', ',');
                    console.log('Final', finalData);
                    var objResponseFull = {
                        'err': err,
                        'result': null,
                        'raw': finalData,
                        'soapHeader': null,
                        'objResponseJson': JSON.parse(finalData)
                    };
                    objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                });
            });
        } else if (this.method.Method_Type === 'Pdf') {
            specific_insurer_object.method_file_url += this.const_policy.transaction_id + "/schedule";
            var args = {
                data: body,
                headers: {
                    "Content-Type": "application/json"
                }
            };
            client.post(specific_insurer_object.method_file_url, args, function (data, response) {
                // parsed response body as js object 
                console.log(response.statusCode);

                var err = null;
                var objData = null;
                if (data.indexOf('{') === 0) {
                    objData = data;
                } else {
                    err = data;
                }
                var objResponseFull = {
                    'err': err,
                    'result': null,
                    'raw': data,
                    'soapHeader': null,
                    'objResponseJson': objData
                };
                objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
            });
        } else {
            if (this.method.Method_Type === 'Customer') {
                service_method_url = config.environment.weburl + '/quote/starhealth_area/' + this.lm_request['permanent_pincode'] + '/' + this.lm_request['permanent_city_code'];
                console.error('StarTravel_area_get', 'service_method_url', service_method_url);
                client.get(service_method_url, function (data) {
                    console.error('Star_Health AreaId', data.toString());
                    let areaData = JSON.parse(data);
                    docLog.Insurer_Request = docLog.Insurer_Request.replaceAll("___areaID___", areaData['area'][0]['areaID']);
                    console.log(docLog.Insurer_Request);
                    var args = {
                        data: docLog.Insurer_Request,
                        headers: {
                            "Content-Type": "application/json"
                        }
                    };
                    console.log(args.data);

                    client.post(specific_insurer_object.method_file_url, args, function (data, response) {
                        // parsed response body as js object 
                        console.error('data', data.toString());
                        var err = null;
                        var objData = null;

                        if (data.indexOf('{') === 0) {
                            objData = JSON.parse(data);
                        } else {
                            err = data;
                        }
                        var objResponseFull = {
                            'err': err,
                            'result': data.toString(),
                            'raw': data.toString(),
                            'soapHeader': null,
                            'objResponseJson': objData
                        };
                        objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                    });
                });
            } else {
                if (this.method.Method_Type === 'Proposal') {
                    var ref_Id = this.processed_request['___insurer_customer_identifier___'];
                    specific_insurer_object.method_file_url += ref_Id + "/token";
                }

                var args = {
                    data: body,
                    headers: {
                        "Content-Type": "application/json"
                    }
                };

                client.post(specific_insurer_object.method_file_url, args, function (data, response) {
                    // parsed response body as js object 
                    console.error('data', data.toString());
                    var err = null;
                    var objData = null;

                    if (data.indexOf('{') === 0) {
                        objData = JSON.parse(data);
                    } else {
                        err = data;
                    }
                    var objResponseFull = {
                        'err': err,
                        'result': data.toString(),
                        'raw': data.toString(),
                        'soapHeader': null,
                        'objResponseJson': objData
                    };
                    if (objInsurerProduct.lm_request['method_type'] === 'Premium') {
                        objResponseFull['objResponseJson']['actualPlanId'] = docLog['Plan_Id'];
                    }
                    objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                });
            }
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};

StarTravel.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    try {
        var objPremiumService = objResponseJson;
        //check error start
        if (objPremiumService.hasOwnProperty('premium')) {
        } else {
            Error_Msg = JSON.stringify(objPremiumService);
        }
        if (Error_Msg === 'NO_ERR')
        {
            var premium_breakup = this.get_const_premium_breakup();
            premium_breakup['final_premium'] = objPremiumService['totalPremium'];
            premium_breakup['service_tax'] = objPremiumService['serviceTax'];
            premium_breakup['tax']['CGST'] = premium_breakup['service_tax'] / 2;
            premium_breakup['tax']['SGST'] = premium_breakup['service_tax'] / 2;
            premium_breakup['net_premium'] = objPremiumService['premium'];
            objServiceHandler.Premium_Breakup = premium_breakup;
            var si = {441: '$100000', 442: '$250000', 443: '$100000', 444: '$250000', 445: '$50000', 446: '$50000'};
            premium_breakup['travel_insurance_si'] = si[objPremiumService.actualPlanId];
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
StarTravel.prototype.customer_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'customer_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Customer': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson.hasOwnProperty('referenceId')) {
        } else {
            Error_Msg = objResponseJson["error"];
        }
        if (Error_Msg === 'NO_ERR') {
            var proposalAmt = (objResponseJson.hasOwnProperty('totalPremium') ? objResponseJson["totalPremium"] : 0);
            var objPremiumVerification = this.premium_verification(this.lm_request["final_premium"], proposalAmt);

            if (objPremiumVerification.Status) {
                var Customer = {
                    'insurer_customer_identifier': objResponseJson["referenceId"]
                };
                objServiceHandler.Customer = Customer;
            } else {
                Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
            }
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
StarTravel.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson.hasOwnProperty('redirectToken')) {
        } else {
            Error_Msg = JSON.stringify(objResponseJson);
        }
        if (Error_Msg === 'NO_ERR') {
            this.const_payment.pg_url += objResponseJson['redirectToken'];
            //this.const_payment.pg_ack_url = 'localhost:50111/HealthInsuranceIndia/StarPaymentResponse?';
            var pg_data = {
                'crn': this.lm_request['crn']
            };
            objServiceHandler.Payment.pg_data = pg_data;
            objServiceHandler.Payment.pg_redirect_mode = 'GET';
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
StarTravel.prototype.verification_response_handler = function (objResponseJson) {
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
        } else if (this.const_policy.pg_status === 'SUCCESS') {
            this.const_policy.transaction_id = objResponseJson['referenceId'];
            this.const_policy.policy_id = (objResponseJson.hasOwnProperty('Reference Number') ? objResponseJson['Reference Number'] : null);
            if (objResponseJson.hasOwnProperty('status')) {
                if (objResponseJson['status'] === 'SUCCESS') {//transaction success
                    this.const_policy.pg_status = 'SUCCESS';
                    this.const_policy.transaction_status = 'SUCCESS';
                    if (objResponseJson.hasOwnProperty('Policy Number')) {
                        this.const_policy.policy_number = objResponseJson['Policy Number'];
                        var pdf_file_name = this.constructor.name + '_' + "Health" + '_' + this.const_policy.policy_number.toString().replaceAll('/', '') + '.pdf';
                        var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
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
                                    'crn': this.lm_request['crn'],
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
                    } else if (objResponseJson.hasOwnProperty('Note') && (objResponseJson['Note'].includes("MER") || objResponseJson['Note'].includes("Medical"))) {
                        this.const_policy.transaction_substatus = 'ME';
                    } else if (objResponseJson.hasOwnProperty('Note') && objResponseJson['Note'].includes("UW")) {
                        this.const_policy.transaction_substatus = 'UW';
                    } else if (objResponseJson.hasOwnProperty('Note') && objResponseJson['Note'].includes("policy is being prepared")) {
                        this.const_policy.transaction_substatus = 'IP';
                    } else {
                        this.const_policy.transaction_status = 'PAYPASS';
                    }
                } else if (objResponseJson['status'] === 'FAILURE') {
                    this.const_policy.pg_status = 'FAIL';
                    this.const_policy.transaction_status = 'FAIL';
                }
            } else {
                Error_Msg = 'LM_STATUS_NODE_MISSING';
            }
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
StarTravel.prototype.pdf_call = function (url, args, pdf_sys_loc) {
    var objInsurerProduct = this;
    objInsurerProduct.pdf_attempt++;
    var Client = require('node-rest-client').Client;
    var client = new Client();
    client.post(url, args, function (data, response) {
        if (data.Error_Code !== '' || true) {
            if (!fs.existsSync(pdf_sys_loc) && objInsurerProduct.pdf_attempt < 11) {
                var sleep = require('system-sleep');
                sleep(6000);
                objInsurerProduct.pdf_call(url, args, pdf_sys_loc);
            }
        }
    });
};
StarTravel.prototype.pdf_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'pdf_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    try {
        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null,
            'Policy': null
        };

        if (objResponseJson !== '') {
            if (objResponseJson.hasOwnProperty('Note')) {
                Error_Msg = objResponseJson;
            }
        } else {
            Error_Msg = 'PDF not created';
        }
        var policy = {
            'policy_url': null,
            'policy_number': this.lm_request['policy_number'],
            'pdf_status': null
        };
        if (Error_Msg === 'NO_ERR') {
            var pdf_file_name = this.constructor.name + '_' + 'Health' + '_' + this.lm_request['policy_number'].toString().replaceAll('/', '') + '.pdf';
            var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
            var pdf_web_path = config.environment.weburl + "/pdf/" + pdf_file_name;
            var binary = new Buffer(objResponseJson, 'base64');
            fs.writeFileSync(pdf_sys_loc, binary);
            policy.policy_url = pdf_web_path;
            policy.pdf_status = 'SUCCESS';
            objServiceHandler.Insurer_Transaction_Identifier = this.lm_request['policy_number'];
        } else {
            policy.transaction_status = 'PAYPASS';
            policy.pdf_status = 'FAIL';
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
StarTravel.prototype.pg_response_handler = function () {
    try {
        console.log('Start', this.constructor.name, 'pg_response_handler');
        var output = this.const_payment_response.pg_get['purchaseToken'];
        this.const_policy.transaction_status = '';
        if (output !== '') {
            this.const_policy.transaction_amount = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['final_premium'];
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.pg_reference_number_1 = output;
        } else if (output === '') {
            this.const_policy.transaction_amount = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['final_premium'];
            this.const_policy.transaction_status = 'FAIL';
            this.const_policy.pg_status = 'FAIL';
        }
        console.error('End', this.constructor.name, 'pg_response_handler', this.const_policy);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'verification_response_handler', ex);
    }
};
StarTravel.prototype.get_member_relation = function (i) {
    console.log(this.constructor.name, 'get_member_relation', ' Start StarTravel');
    var gender = this.lm_request['member_' + i + '_gender'];
    var proposer_rel = this.lm_request["relation"];
    var member_rel;
    console.log("Gender in StarTravel:: " + gender);
    // 11:SELF, 12:SPOUSE, 13:SON, 14:DAUGHTER, 17:FATHER, 18:MOTHER
    if (proposer_rel === '13' || proposer_rel === '14') {
        member_rel = gender === 'M' ? '17' : '18';
    } else if (proposer_rel === '17' || proposer_rel === '18') {
        member_rel = gender === 'M' ? '13' : '14';
    } else if (proposer_rel === '12') {
        member_rel = '12';
        if (i >= 3) {
            member_rel = gender === 'M' ? '13' : '14';
        }
    } else if (proposer_rel === '11' || proposer_rel === '') {
        if (i >= 3) {
            member_rel = gender === 'M' ? '13' : '14';
        } else if (i === 1) {
            member_rel = '11';
        } else if (i === 2) {
            member_rel = '12';
        }
    }
    this.prepared_request['member_' + i + '_relation'] = member_rel;
    this.processed_request['___member_' + i + '_relation___'] = member_rel;
    this.get_nominee_relation_id(i, proposer_rel, member_rel);
    console.log(this.constructor.name, 'get_member_relation', 'End StarTravel');
};
StarTravel.prototype.get_nominee_relation_id = function (i, proposer_rel, member_rel) {
    if (i === 1 && proposer_rel === "11") {
        this.prepared_request['member_' + i + '_nominee_name'] = this.lm_request["nominee_name"];
        this.prepared_request['member_' + i + '_nominee_id'] = this.lm_request["nominee_relation"];
    } else {
        var nomineeIdObj = {'12': '1', '13': '2', '14': '3', '17': '6', '18': '7'};
        this.prepared_request['member_' + i + '_nominee_name'] = this.lm_request["first_name"] + ' ' + this.lm_request["last_name"];
        this.prepared_request['member_' + i + '_nominee_id'] = nomineeIdObj[member_rel];
    }
    this.processed_request['___member_' + i + '_nominee_name___'] = this.prepared_request['member_' + i + '_nominee_name'];
    this.processed_request['___member_' + i + '_nominee_id___'] = this.prepared_request['member_' + i + '_nominee_id'];
};
StarTravel.prototype.dateToReqFormat = function (d) {
    return moment(d, 'YYYY-MM-DD').format('MMMM D, YYYY');
};
StarTravel.prototype.is_valid_plan = function (lm_request, planCode) {
    console.log('StarTravel is_valid_plan', 'start');
    var travelArea = lm_request['travelling_to_area'];

    if (lm_request['member_count'] > 1 || ["Asia", "Africa", "Europe"].includes(travelArea) || lm_request['trip_type'] === 'MULTI') {
        return false;
    } else if (travelArea === 'WWExUSCanada' && ["1", "2", "5"].includes(planCode)) {
        return false;
    } else if (travelArea === 'WorldWide' && ["3", "4", "6"].includes(planCode)) {
        return false;
    } else {
        return true;
    }
    console.log('StarTravel is_valid_plan', 'End');
};
StarTravel.prototype.premium_breakup_schema = {
    "net_premium": "premium",
    "CGST": "CGST",
    "SGST": "SGST",
    "service_tax": "serviceTax",
    "final_premium": "totalPremium"
};
module.exports = StarTravel;