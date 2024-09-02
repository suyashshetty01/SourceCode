/* Author:Kevin Monteiro
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

function CareTravel() {

}
util.inherits(CareTravel, Travel);
CareTravel.prototype.insurer_date_format = 'dd/MM/yyyy';
//CareTravel.prototype.const_insurer_suminsured = [100000, 200000, 300000, 400000, 500000];

CareTravel.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
CareTravel.prototype.insurer_product_field_process_pre = function () {
    var member = 1;
    if (this.lm_request['trip_type'] === "MULTI") {
        var dt = Number(this.lm_request['maximum_duration']);
        this.processed_request['___travel_days___'] = dt;
        //dt = dt -1;
        //this.processed_request['___policy_end_date___'] = moment(this.lm_request['policy_start_date']).add(dt, 'days').format('DD/MM/YYYY');
        this.processed_request['___policy_end_date___'] = moment(this.lm_request['policy_end_date']).subtract(1, 'days').format('DD/MM/YYYY');
    } else {
        this.processed_request['___travel_days___'] = moment(this.lm_request['policy_end_date']).diff(this.lm_request['policy_start_date'], 'days') + 1;
    }

    if (this.lm_request['method_type'] === 'Premium') {
//        var args = {
//            "Insurer_Id": this.method["Insurer_Id"],
//            "Age_Start_in_Months": {$lte: this.lm_request["elder_member_age_in_months"]},
//            "Age_End_in_Months": {$gte: this.lm_request["elder_member_age_in_months"]},
//            "TravelDays": this.processed_request['___travel_days___'],
//            "PED": 'No'
//        };
//        this.method_content = JSON.stringify(args);

    } else if (this.lm_request['method_type'] === 'Proposal') {
        this.get_Si_Code();
        this.prepared_request['proposer_gender'] = this.lm_request['gender'] === 'M' ? 'MALE' : 'FEMALE';
        this.prepared_request['trip_type'] = this.lm_request['trip_type'];

        this.processed_request['___proposer_gender___'] = this.prepared_request['proposer_gender'];
        this.processed_request['___trip_type___'] = this.prepared_request['trip_type'];
        if (this.lm_request['trip_type'] === "MULTI") {
            var obj_replace = {"<xsd:maxTripPeriod />": "<xsd:maxTripPeriod>" + this.processed_request['___travel_days___'] + "</xsd:maxTripPeriod>"};
            this.method_content = this.method_content.toString().replaceJson(obj_replace);
        }

        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";

        for (member = 1; member <= this.lm_request['adult_count']; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.get_member_relation(member);
            this.med_question(member);
            var med_block = this.med_question(member);
            txt_replace_with = txt_replace_with.replace('<!--___member_' + member + '_medquestn-->', med_block);
            this.prepared_request['member_' + member + '_gender_2'] = this.lm_request['member_' + member + '_gender'] === 'M' ? 'MALE' : 'FEMALE';
            this.processed_request['___member_' + member + '_gender_2___'] = this.prepared_request['member_' + member + '_gender_2'];
            this.prepared_request['member_' + member + '_salutation'] = this.lm_request['member_' + member + '_salutation'];
            this.processed_request['___member_' + member + '_salutation___'] = this.prepared_request['member_' + member + '_salutation'];
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.get_member_relation(member);
            var med_block = this.med_question(member);
            txt_replace_with = txt_replace_with.replace('<!--___member_' + member + '_medquestn-->', med_block);
            this.prepared_request['member_' + member + '_gender_2'] = this.lm_request['member_' + member + '_gender'] === 'M' ? 'MALE' : 'FEMALE';
            this.processed_request['___member_' + member + '_gender_2___'] = this.prepared_request['member_' + member + '_gender_2'];
            this.prepared_request['member_' + member + '_salutation'] = this.lm_request['member_' + member + '_salutation'];
            this.processed_request['___member_' + member + '_salutation___'] = this.prepared_request['member_' + member + '_salutation'];
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
        this.method_content = this.method_content.replaceAll(/<!--(.*?)-->/g, "");

    } else if (this.lm_request['method_type'] === 'Verification') {
        this.method_content = this.insurer_master['service_logs']['pb_db_master']['Insurer_Request'];
        
    }
    console.log(this.method_content);
    console.log('insurer_product_field_process_pre');
};
CareTravel.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {
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
CareTravel.prototype.insurer_product_field_process_post = function () {

};
CareTravel.prototype.insurer_product_api_post = function () {

};
CareTravel.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    console.log('service_call');
        var Client = require('node-rest-client').Client;
            var client = new Client();
    try {
        var objInsurerProduct = this;
//        if (specific_insurer_object.method.Method_Calling_Type === 'Database') {
//            var args = JSON.parse(this.method_content);
//            args['ProductPlan_Id'] = docLog['Plan_Id'];
//            var Travel_Rate = require(appRoot + '/models/travel_rate');
//            Travel_Rate.find(args, function (err, dbTravelRate) {
//                console.log(dbTravelRate);
//                if (dbTravelRate !== null) {
//                    var objResponseFull = {
//                        'err': err,
//                        'result': dbTravelRate,
//                        'raw': JSON.stringify(dbTravelRate),
//                        'soapHeader': null,
//                        'objResponseJson': dbTravelRate
//                    };
//                    objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
//                }
//            });
//
//        } else 
            if (specific_insurer_object.method.Method_Calling_Type === 'POST') {
            var body = docLog.Insurer_Request;
            var https = require('https');
            var hostname = ((config.environment.name === 'Production') ? "api.religarehealthinsurance.com" : "apiuat.religarehealthinsurance.com");
             if (this.method.Method_Type === 'Premium') {
                var token_args = {
                    data: {
                        "api_key": "OEH-D2xYwtbNx6460dzIuHvYaW1tx9-V",
                        "auth_secret": "a$p2Kf!$W$(J"
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }
                };

                client.post("https://abacus.careinsurance.com/religare_api/api/web/v1/auth/access-token?formattype=json", token_args, function (token_data, response) {
                    var access_token = token_data && token_data.data && token_data.data.accessToken || "";
                    var args1 = {
                        data: JSON.parse(body),
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization" : "Bearer " + access_token
                        }
                    };
                    client.post(specific_insurer_object.method_file_url, args1, function (data, response) {
                        var objData = JSON.stringify(data);
                        var objResponseFull = {
                            'err': null,
                            'result': objData,
                            'raw': objData,
                            'soapHeader': null,
                            'objResponseJson': JSON.parse(objData)
                        };
                        objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                    });
                });
             }            
           else if (this.method.Method_Type === 'Proposal') {
                var xml2js = require('xml2js');
                var postRequest = {
                    host: hostname,
                    path: "/relinterface/services/RelSymbiosysServices.RelSymbiosysServicesHttpSoap12Endpoint/",
                    port: '',
                    method: "POST",
                    "rejectUnauthorized": false,
                    headers: {
                        'Cookie': "cookie",
                        'Content-Type': 'application/soap+xml;charset=UTF-8',
                        'Content-Length': Buffer.byteLength(body),
                        "SOAPAction": "urn:createPolicyTravel"
                    }
                };
                process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
                var req = https.request(postRequest, function (res) {
                    console.log(res.statusCode);
                    var buffer = "";
                    res.on("data", function (data) {
                        buffer = buffer + data;
                    });
                    res.on("end", function (data) {
                        console.log(buffer);
                        var objReplace = {
                            'soapenv:': '',
                            'ns:': '',
                            'S:': '',
                            'ns2:': ''
                        };
                        var fliter_response = buffer.replaceJson(objReplace);
                        xml2js.parseString(fliter_response, {ignoreAttrs: true}, function (err, objXml2Json) {
                            var objResponseFull = {
                                'err': err,
                                'result': buffer,
                                'raw': buffer,
                                'soapHeader': null,
                                'objResponseJson': objXml2Json
                            };
                            objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                        });
                    });
                });
                req.on('error', function (e) {
                    console.error('problem with request: ' + e.message);
                });
                req.write(body);
                req.end();

            } else if (this.method.Method_Type === 'Pdf') {
                var app_id = ((config.environment.name === 'Production') ? 314808 : 516215);
                var signature = ((config.environment.name === 'Production') ? "s1jKM0PqAtXouLydKtrL7X3QCgi2KmtNNogKMddxJA4=" : "JsnNW921WJDN51CUaadctSNkGDWlXo/28TrIKuKUIhc=");
                var timestamp = ((config.environment.name === 'Production') ? "1571141818393" : "1568801564676");
                var Service_URL = specific_insurer_object.method.Service_URL;

                var postRequest = {
                    host: hostname,
                    path: Service_URL,
                    port: '',
                    method: "POST",
                    "rejectUnauthorized": false,
                    data: body,
                    headers: {
                        "Content-Type": "application/json",
                        "appId": app_id,
                        "signature": signature,
                        "timestamp": timestamp,
                        "agentId": this.processed_request['___insurer_integration_agent_code___']
                    }
                };
                process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
                var req = https.request(postRequest, function (res) {
                    console.log(res.statusCode);
                    var buffer = "";
                    res.on("data", function (data) {
                        buffer = buffer + data;
                    });
                    res.on("end", function (data) {
                        console.log(buffer);
                        var objResponseFull = {
                            'err': null,
                            'result': buffer,
                            'raw': buffer,
                            'soapHeader': null,
                            'objResponseJson': JSON.parse(buffer)
                        };
                        objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                    });
                });
                req.on('error', function (e) {
                    console.error('problem with request: ' + e.message);
                });
                req.write(body);
                req.end();
            }
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};

CareTravel.prototype.premium_response_handler = function (objResponseJson) {
    try {
        console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null
        };
        var Error_Msg = 'NO_ERR';
        if(Error_Msg == 'NO_ERR'){
//        if (objResponseJson.length > 0 && objResponseJson[0].hasOwnProperty(['_doc'])) {
//            var objPremiumService = objResponseJson[0]['_doc'];
//            if (objPremiumService.hasOwnProperty('Premium')) {
//                const mem_discnt = {2: 0.95, 3: 0.90, 4: 0.85, 5: 0.825, 6: 0.80};
//                let mem_count = this.lm_request['member_count']-0;
//                let final_premium = ((objPremiumService['Premium'] - 0) * 1.18) * mem_count;
//                if (mem_count > 1) {
//                    final_premium = (final_premium * mem_discnt[mem_count]);
//                }
                var premium_breakup = this.get_const_premium_breakup();
                premium_breakup['final_premium'] = objResponseJson && objResponseJson['data'] && objResponseJson['data']['outputFields'] && objResponseJson['data']['outputFields'][0] && (objResponseJson['data']['outputFields'][0]['premium']-0).toFixed(2) || 0;
                premium_breakup['net_premium'] = objResponseJson && objResponseJson['data'] && objResponseJson['data']['outputFields'] && objResponseJson['data']['outputFields'][0] && (objResponseJson['data']['outputFields'][0]['basePremium']-0).toFixed(2) || 0;
                premium_breakup['service_tax'] = objResponseJson && objResponseJson['data'] && objResponseJson['data']['abacusData'] && objResponseJson['data']['abacusData']['serviceTax']-0 || 0
                premium_breakup['tax']['CGST'] = (premium_breakup['service_tax'] / 2);
                premium_breakup['tax']['SGST'] = (premium_breakup['service_tax'] / 2);
                premium_breakup['travel_insurance_si'] = objResponseJson && objResponseJson['data'] && objResponseJson['data']['inputFields'][14]['selectedValue'] + '0000';
                objServiceHandler.Premium_Breakup = premium_breakup;
            } else {
                Error_Msg = 'LM_MSG:MAIN_NODE_MISSING';
            }

        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
        return objServiceHandler;
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'premium_response_handler', objServiceHandler);
    }
};
CareTravel.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        var objResJson = objResponseJson['Envelope']['Body']['0']['createPolicyTravelResponse']['0']['return']['0']['int-policy-data-iO']['0'];
        if (objResJson.hasOwnProperty('error-lists')) {
            Error_Msg = '';
            var resp_err = objResJson['error-lists'];
            resp_err.forEach((err) => {
                Error_Msg += '\u2726 ' + err['err-description'] + ". ";
            });
        } else if (objResJson['policy']['0'].hasOwnProperty('premium')) {
            var proposal_amt = parseInt(objResJson['policy']['0']['premium']['0']);
            var prm_diff = proposal_amt > this.lm_request['final_premium'] ? proposal_amt - this.lm_request['final_premium'] : this.lm_request['final_premium'] - proposal_amt;
            if (prm_diff >= 5) {
                Error_Msg = "LM_Premium_Mismatch : Final Premium: "+proposal_amt;
            }
        }

        if (Error_Msg === 'NO_ERR') {
            var pg_data = {
                'proposalNum': objResJson['policy']['0']['proposal-num']['0'],
                'returnURL': this.const_payment.pg_ack_url
            };
            objServiceHandler.Payment.pg_data = pg_data;
            objServiceHandler.Payment.pg_redirect_mode = 'POST';
            objServiceHandler.Insurer_Transaction_Identifier = '';
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
CareTravel.prototype.pg_response_handler = function () {
    try {
        console.log('Start', this.constructor.name, 'pg_response_handler');
        var output = this.const_payment_response.pg_post;
        this.const_policy.transaction_id = output['transactionRefNum'];
        if (output['uwDecision'] === "INFORCE") {
            this.const_policy.transaction_amount = this.insurer_master['service_logs']['pb_db_master']['Insurer_Response']['Envelope']['Body']['0']['createPolicyTravelResponse']['0']['return']['0']['int-policy-data-iO']['0']['policy']['0']['premium']['0'];
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.transaction_status = 'SUCCESS';
            this.const_policy.transaction_substatus = 'IF';
            this.const_policy.policy_number = output['policyNumber'];
        } else if (output['uwDecision'] === "PENDINGFORMANUALUW" || output['uwDecision'] === "PENDINGREQUIREMENTS") {
            this.const_policy.transaction_amount = this.insurer_master['service_logs']['pb_db_master']['Insurer_Response']['Envelope']['Body']['0']['createPolicyTravelResponse']['0']['return']['0']['int-policy-data-iO']['0']['policy']['0']['premium']['0'];
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.transaction_status = 'SUCCESS';
            this.const_policy.transaction_substatus = 'UW';
            this.const_policy.policy_number = output['policyNumber'];
        } else {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
        console.error('End', this.constructor.name, 'pg_response_handler', this.const_policy);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
CareTravel.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    try {
        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null,
            'Policy': null
        };
        if (this.const_policy.transaction_status === 'SUCCESS') {//transaction success  
            var pdf_file_name = this.constructor.name + '_Travel_' + this.const_policy.policy_number + '.pdf';
            var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
            var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
            this.const_policy.policy_url = pdf_web_path_portal;
            if (config.environment.name === 'Production') {
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
CareTravel.prototype.pdf_call = function (url, args, pdf_sys_loc) {
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
CareTravel.prototype.pdf_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'pdf_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    try {
        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null,
            'Policy': null
        };
        if (objResponseJson.hasOwnProperty('responseData') && objResponseJson.hasOwnProperty('intFaveoGetPolicyPDFIO')) {
            if (objResponseJson['responseData']['status'] === '1') {
                if (objResponseJson['intFaveoGetPolicyPDFIO'].hasOwnProperty('dataPDF')) {
                    var pdf_binary = objResponseJson['intFaveoGetPolicyPDFIO']['dataPDF'];
                } else {
                    Error_Msg = objResponseJson['responseData']['policyPDFStatus'];
                }
            } else {
                Error_Msg = objResponseJson['responseData']['message'];
            }
        } else {
            Error_Msg = "PDF_MAIN_NODE_MISSING";
        }
        var policy = {
            'policy_url': null,
            'policy_number': this.lm_request['policy_number'],
            'pdf_status': null
        };
        if (Error_Msg === 'NO_ERR' && pdf_binary !== '' && pdf_binary !== undefined) {
            var pdf_file_name = this.constructor.name + '_Travel_' + this.lm_request['policy_number'] + '.pdf';
            var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
            var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
            policy.policy_url = pdf_web_path_portal;
            var binary = new Buffer(pdf_binary, 'base64');
            fs.writeFileSync(pdf_sys_loc, binary);
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
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'premium_response_handler', objServiceHandler);
        objServiceHandler.Policy = this.const_policy;
    }
    return objServiceHandler;

};
CareTravel.prototype.get_member_relation = function (i) {
    console.log(this.constructor.name, 'get_member_relation', ' Start CareTravel');
    var gender = this.lm_request['member_' + i + '_gender'];
    var proposer_rel = this.lm_request["relation"];
    var member_rel;
    console.log("Gender in CareTravel:: " + gender);
//    if (proposer_rel === 'SONM' || proposer_rel === 'UDTR') {
//        member_rel = gender === 'M' ? 'FATH' : 'MOTH';
//    } else if (proposer_rel === 'FATH' || proposer_rel === 'MOTH') {
//        member_rel = gender === 'M' ? 'SONM' : 'UDTR';
//    } else if (proposer_rel === 'SPSE') {
//        member_rel = 'SPSE';
//        if (i >= 3) {
//            member_rel = gender === 'M' ? 'SONM' : 'UDTR';
//        }
//    }

    // SELF:SELF, SPSE:SPOUSE, SONM:SON, UDTR:DAUGHTER, FATH:FATHER, MOTH:MOTHER   
    if (proposer_rel === 'SELF' || proposer_rel === '') {
        if (i >= 3) {
            member_rel = gender === 'M' ? 'SONM' : 'UDTR';
        } else if (i === 1) {
            member_rel = 'SELF';
        } else if (i === 2) {
            member_rel = 'SPSE';
        }
    }
    this.prepared_request['member_' + i + '_relation'] = member_rel;
    this.processed_request['___member_' + i + '_relation___'] = member_rel;
};
CareTravel.prototype.get_Si_Code = function () {
    var pln_Si = this.prepared_request['dbmaster_pb_plan_code'].split('_');
    this.prepared_request['baseProductId'] = pln_Si[0];
    this.processed_request['___baseProductId___'] = this.prepared_request['baseProductId'];

    let si_key;
    if (['WorldWide', 'WWExUSCanada'].includes(this.lm_request['travelling_to_area'])) {
        if (['40001146', '40001143', '40001139', '40001136'].includes(this.prepared_request['baseProductId'])) {
            si_key = 'Gold';
        } else if (['40001135', '40001138', '40001142', '40001145'].includes(this.prepared_request['baseProductId'])) {
            si_key = 'Silver';
        } else if (['40001147', '40001144', '40001140', '40001137'].includes(this.prepared_request['baseProductId'])) {
            si_key = 'Platinum';
        }
    } else {
        si_key = this.lm_request['travelling_to_area'];
    }

    let SI_Code = {
        "Asia": {10000: '001', 25000: '002', 50000: '003', 100000: '004'},
        "Africa": {25000: '001', 50000: '002', 100000: '003'},
        "Europe": {30000: '001', 100000: '002'},
        "Gold": {50000: '001', 100000: '002', 200000: '003', 300000: '004', 500000: '005'},
        "Silver": {25000: '001', 50000: '002', 100000: '003', 200000: '004'},
        "Platinum": {50000: '001', 100000: '002', 300000: '003', 500000: '004'}
    };
    
    this.prepared_request['si_code'] = SI_Code[si_key][(pln_Si[1])];
    this.processed_request['___si_code___'] = this.prepared_request['si_code'];
    //console.log('SI: '+ pln_Si[1], "SI_Code: "+this.prepared_request['si_code'], "baseProductId: "+ this.prepared_request['baseProductId']);
};
CareTravel.prototype.med_question = function (mem) {
    var med_block = '';
    var questionSetCd = {
        128: 'PEDliverDetailsTravel',
        114: 'PEDcancerDetailsTravel',
        143: 'PEDHealthDiseaseTravel',
        129: 'PEDkidneyDetailsTravel',
        164: 'PEDparalysisDetailsTravel',
        210: 'PEDotherDetailsTravel',
        1: 'HEDTravelClaimPolicy',
        2: 'HEDTravelHospitalized'
    };
    if (this.lm_request['member_' + mem + '_ped'].length > 0) {
        med_block = `<xsd:partyQuestionDOList>
                        <xsd:questionCd>pedYesNo</xsd:questionCd>
                        <xsd:questionSetCd>pedYesNoTravel</xsd:questionSetCd>
                        <xsd:response>YES</xsd:response>
                    </xsd:partyQuestionDOList>`;

        this.lm_request['member_' + mem + '_ped'].forEach((illnes) => {
            med_block += `<xsd:partyQuestionDOList>
                            <xsd:questionCd>${illnes.id}</xsd:questionCd>
                            <xsd:questionSetCd>${questionSetCd[illnes.id]}</xsd:questionSetCd>
                            <xsd:response>YES</xsd:response>
                          </xsd:partyQuestionDOList>`;
        });
    }

    for (var i = 1; i < 3; i++) {
        if (this.lm_request['question_T00' + i + '_details'] === true) {
            med_block += `<xsd:partyQuestionDOList>
                            <xsd:questionCd>T00${i}</xsd:questionCd>
                            <xsd:questionSetCd>${questionSetCd[i]}</xsd:questionSetCd>
                            <xsd:response>YES</xsd:response>
                        </xsd:partyQuestionDOList>`;
        }
    }

    if (med_block === '') {
        med_block = `<xsd:partyQuestionDOList>
                        <xsd:questionCd />
                        <xsd:questionSetCd />
                        <xsd:response />
                    </xsd:partyQuestionDOList>`;
    }
    //console.log(med_block);
    return med_block;
};
CareTravel.prototype.is_valid_plan = function (lm_request, planCode) {
    console.log('CareTravel is_valid_plan', 'start');
    let plncode = planCode.split('_')[0];
    let plans = [
        {'code': '40001130', 'max_days': 180, 'type': 'SINGLE', 'Region': 'Asia'},
        {'code': '40001141', 'max_days': 60, 'type': 'MULTI', 'Region': 'Asia'},
        {'code': '40001132', 'max_days': 180, 'type': 'SINGLE', 'Region': 'Africa'},
        {'code': '40001133', 'max_days': 180, 'type': 'SINGLE', 'Region': 'Europe'},
        //gold
        {'code': '40001136', 'max_days': 180, 'type': 'SINGLE', 'Region': 'WorldWide'},
        {'code': '40001143', 'max_days': 60, 'type': 'MULTI', 'Region': 'WorldWide'},
        {'code': '40001139', 'max_days': 180, 'type': 'SINGLE', 'Region': 'WWExUSCanada'},
        {'code': '40001146', 'max_days': 60, 'type': 'MULTI', 'Region': 'WWExUSCanada'},
        //silver
        {'code': '40001135', 'max_days': 180, 'type': 'SINGLE', 'Region': 'WorldWide'},
        {'code': '40001142', 'max_days': 60, 'type': 'MULTI', 'Region': 'WorldWide'},
        {'code': '40001138', 'max_days': 180, 'type': 'SINGLE', 'Region': 'WWExUSCanada'},
        {'code': '40001145', 'max_days': 60, 'type': 'MULTI', 'Region': 'WWExUSCanada'},
        //platinum
        {'code': '40001137', 'max_days': 180, 'type': 'SINGLE', 'Region': 'WorldWide'},
        {'code': '40001144', 'max_days': 60, 'type': 'MULTI', 'Region': 'WorldWide'},
        {'code': '40001140', 'max_days': 180, 'type': 'SINGLE', 'Region': 'WWExUSCanada'},
        {'code': '40001147', 'max_days': 60, 'type': 'MULTI', 'Region': 'WWExUSCanada'}
    ];

    if (lm_request['trip_type'] === 'MULTI' && ['90'].includes(lm_request['maximum_duration'])) {
        return false;
        //index = -1;
    }
    let index = plans.findIndex(x => x.code === plncode && x.type === lm_request['trip_type'] && x.Region === lm_request['travelling_to_area']);
    return (index > -1 ? true : false);
    console.log('CareTravel is_valid_plan', 'End');
};
CareTravel.prototype.premium_breakup_schema = {
    "tax": {
        "CGST": "CGST",
        "SGST": "SGST",
        "IGST": 0,
        "UTGST": 0
    },
    "net_premium": "NetPremium",
    "service_tax": 0,
    "final_premium": "FinalPremium"
};
module.exports = CareTravel;