/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var util = require('util');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var Health = require(appRoot + '/libs/CancerCare');
var config = require('config');
var fs = require('fs');
var moment = require('moment');

function ReligareCancerCare() {
    console.log("religare care");
}
util.inherits(ReligareCancerCare, Health);
ReligareCancerCare.prototype.insurer_date_format = 'dd/MM/yyyy';
ReligareCancerCare.prototype.const_insurer_suminsured = [1000000, 2500000, 5000000, 10000000, 20000000];


ReligareCancerCare.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
ReligareCancerCare.prototype.insurer_product_field_process_pre = function () {
    if (this.lm_request['method_type'] === 'Proposal') {
        var obj_si = this.health_insurance_si_2();
        this.prepared_request['health_insurance_si_2'] = obj_si;
        this.processed_request['___health_insurance_si_2___'] = this.prepared_request['health_insurance_si_2'];
        this.prepared_request['sum_ins'] = this.lm_request["cancer_care_si"];
        this.processed_request['___sum_ins___'] = this.prepared_request['sum_ins'];
        this.prepared_request['member_1_birth_date'] = this.lm_request['member_1_birth_date'];
        this.processed_request['___member_1_birth_date___'] = this.prepared_request['member_1_birth_date'];
        this.prepared_request["member_1_age"] = this.lm_request['member_1_age'];
        this.processed_request["___member_1_age___"] = this.prepared_request["member_1_age"];
         this.prepared_request['height'] = this.lm_request['height'];
        this.processed_request['___height___'] = this.prepared_request['height'];
        this.prepared_request['weight'] = this.lm_request['weight'];
        this.processed_request['___weight___'] = this.prepared_request['weight'];
        this.prepared_request["gender"] = this.lm_request["gender"] === "M" ? "MALE" : "FEMALE";
        this.processed_request["___gender___"] = this.prepared_request["gender"];
        this.processed_request['___pan___'] = (this.prepared_request['pan']).toUpperCase();
        this.prepared_request["guid"] = this.lm_request["crn"] + this.current_time();
        this.processed_request["___guid___"] = this.prepared_request["guid"];
        this.prepared_request["city_name"] = this.lm_request["city_name"];
        this.processed_request["___city_name___"] = this.prepared_request["city_name"] ;
        this.prepared_request["final_premium"] = this.lm_request["final_premium"];
        this.processed_request["___final_premium___"]=this.prepared_request["final_premium"];
        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";
        var member = 1;
        // repeat for each adult
        for (member = 1; member <= this.lm_request['adult_count']; member++) {
            var txt = txt_replace.replaceAll('___member_array_inc___', member);
            txt = txt.replaceAll('___member_array', '___member_' + member);
            // repeat for each questions
            var txt_ques_replace = this.find_text_btw_key(txt, '<xsd:partyQuestionDOList>', '</xsd:partyQuestionDOList>', true);
            var txt_ques_replace_with = "";
            for (var x in this.lm_request) {
                if (x.indexOf('member_' + member + '_question_') > -1 && x.indexOf('_type') > -1) {
                    var arr_questions = x.match('member_' + member + '_question_(.*)_')[0];
                    txt_ques_replace_with += txt_ques_replace.replaceAll('member_' + member + '_question_array_', arr_questions);
                }
            }
            txt_replace_with += txt.replace(txt_ques_replace, txt_ques_replace_with);
        }
        //repeat for each kid
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            var txt = txt_replace.replaceAll('___member_array_inc___', member);
            txt = txt.replaceAll('___member_array', '___member_' + member);
            // repeat for each questions
            var txt_ques_replace = this.find_text_btw_key(txt, '<xsd:partyQuestionDOList>', '</xsd:partyQuestionDOList>', true);
            var txt_ques_replace_with = "";
            for (var x in this.lm_request) {
                if (x.indexOf('member_' + member + '_question_') > -1 && x.indexOf('_type') > -1) {
                    var arr_questions = x.match('member_' + member + '_question_(.*)_')[0];
                    txt_ques_replace_with += txt_ques_replace.replaceAll('member_' + member + '_question_array_', arr_questions);
                }
            }
            txt_replace_with += txt.replace(txt_ques_replace, txt_ques_replace_with);
        }
        txt_replace_with = txt_replace_with.replaceAll('<!--InsurersDetail_Start-->', "");
        txt_replace_with = txt_replace_with.replaceAll('<!--InsurersDetail_End-->', "");
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
        console.log(this.method_content);
        for (var key in this.lm_request) {
            if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1) {
                var ques_setcode = key.replace('_type', '_setcode');
                var ques_code = key.replace('_type', '_code');
                var ques_detail = key.replace('_type', '_details');
                this.prepared_request[ques_setcode] = this.getQuestionSet(this.prepared_request[ques_code]);
                this.processed_request['___' + ques_setcode + '___'] = this.prepared_request[ques_setcode];

                if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                    if (this.lm_request[ques_detail] === false) {
                        this.prepared_request[ques_detail] = "NO";
                        this.processed_request['___' + ques_detail + '___'] = "NO";
                    } else {
                        this.prepared_request[ques_detail] = "YES";
                        this.processed_request['___' + ques_detail + '___'] = "YES";
                    }
                    this.prepared_request[ques_code] = this.lm_request[ques_code];
                    this.processed_request['___' + ques_code + '___'] = this.lm_request[ques_code];
                    ;
                } else if (this.lm_request[key].toString().toLowerCase() === 'since') {
                    this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                    this.processed_request['___' + ques_detail + '___'] = this.lm_request[ques_detail];
                    this.prepared_request[ques_code] = this.getQuestionCode(this.lm_request[ques_code], this.lm_request[key]);
                    this.processed_request['___' + ques_code + '___'] = this.prepared_request[ques_code];
                }
            }
        }
        for (member = 1; member <= this.lm_request['adult_count']; member++)
        {
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];

        }
        this.prepared_request["crn"] = this.lm_request["crn"];
        this.processed_request["___crn___"] = this.prepared_request["crn"];

        if (this.prepared_request['dbmaster_pb_plan_id'] === 81 || this.prepared_request['dbmaster_pb_plan_id'] === 268 ||
                this.prepared_request['dbmaster_pb_plan_id'] === 269 || this.prepared_request['dbmaster_pb_plan_id'] === 270 ||
                this.prepared_request['dbmaster_pb_plan_id'] === 271) {
            var obj_replace = {
                "<xsd:addOns>___addon_selected___</xsd:addOns>": "",
                "<xsd:loanAmount>___loan_amount___</xsd:loanAmount>": "",
                "<xsd:isPaRequired>YES</xsd:isPaRequired>": ""
            };
            this.method_content = this.method_content.toString().replaceJson(obj_replace);
        } else if (this.prepared_request['dbmaster_pb_plan_id'] === 230 || this.prepared_request['dbmaster_pb_plan_id'] === 236 ||
                this.prepared_request['dbmaster_pb_plan_id'] === 244 || this.prepared_request['dbmaster_pb_plan_id'] === 259 ||
                this.prepared_request['dbmaster_pb_plan_id'] === 263 || this.prepared_request['dbmaster_pb_plan_id'] === 264 ||
                this.prepared_request['dbmaster_pb_plan_id'] === 267) {
            var obj_replace = {
                "<xsd:loanAmount>___loan_amount___</xsd:loanAmount>": "",
                "<xsd:isPaRequired>YES</xsd:isPaRequired>": ""
            };
            this.method_content = this.method_content.toString().replaceJson(obj_replace);
        }

        if (this.lm_request['standing_instruction'] !== true) {
            var obj_replace = {
                "<xsd:siforCreditcard>1</xsd:siforCreditcard>": ""
            };
            this.method_content = this.method_content.toString().replaceJson(obj_replace);
        }
    }
    if (this.lm_request['method_type'] === 'Premium') {
        console.log("religare premium");
        console.log(JSON.stringify(this.lm_request));
        var args = {
            "ProductPlan_Id": this.processed_request['___Plan_Id___'],
            "NumberOfAdults": 1,
            "NumberOfChildren": 0,
            "SumInsured": this.prepared_request['cancer_care_si'],
            "Min_AgeOfEldestMember_Months": {$lte: this.lm_request["elder_member_age_in_months"]},
            "Max_AgeOfEldestMember_Months": {$gt: this.lm_request["elder_member_age_in_months"]},
            "Policy_Term_Year": 1
        };
        console.log("Premium-------------");
        console.log(args);
        this.method_content = JSON.stringify(args);
    }
    if (this.lm_request['method_type'] === 'Verification') {
//        this.prepared_request['policy_number'] = this.lm_request[pg_post]['policy_no'];
//            this.processed_request['___policy_number___'] = this.prepared_request['policy_number'];
        this.method_content = this.insurer_master['service_logs']['pb_db_master']['Insurer_Request'];
    }
    if (this.lm_request['method_type'] === 'Pdf') {
        if (config.environment.name !== 'Production') {
//            var obj_replace = {
//                '"policyNum": "___policy_number___"': '"policyNum": "10368603"'
//            };
            this.method_content = this.method_content.toString().replaceJson(obj_replace);
        }
    }
    console.log('insurer_product_field_process_pre');
};
ReligareCancerCare.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
ReligareCancerCare.prototype.insurer_product_field_process_post = function () {

};
ReligareCancerCare.prototype.insurer_product_api_post = function () {

};
ReligareCancerCare.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    console.log('service_call');
    try {
        var objInsurerProduct = this;
        if (specific_insurer_object.method.Method_Calling_Type === 'Database') {
            var args = JSON.parse(this.method_content);
            args['ProductPlan_Id'] = docLog['Plan_Id'];
            var Cancer_Care_Health_Rate = require(appRoot + '/models/cancer_care_health_rate');
            Cancer_Care_Health_Rate.findOne(args, function (err, dbHealthRate) {
                console.log(dbHealthRate);
                var objResponseFull = {
                    'err': err,
                    'result': dbHealthRate,
                    'raw': JSON.stringify(dbHealthRate),
                    'soapHeader': null,
                    'objResponseJson': dbHealthRate
                };
                objResponseFull['objResponseJson']['PlanId'] = docLog['Plan_Id'];
                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
            });
        } else if (specific_insurer_object.method.Method_Calling_Type === 'POST') {
            var body = docLog.Insurer_Request;
            console.log(body);
             var https = require('https');
             var hostname = ((config.environment.name === 'Production') ? "api.ReligareCancerCareinsurance.com" : "apiuat.ReligareCancerCareinsurance.com");
            if (this.method.Method_Type === 'Proposal') {
                console.log("docLog");
                console.log(docLog);
                var request = docLog.Insurer_Request;
                var Client = require('node-rest-client').Client;
                var client = new Client();
                var username = ((config.environment.name !== 'Production') ? 'PolicyBossApp' : 'Landmark');
                var password = ((config.environment.name !== 'Production') ? 'P0L!cy80$$@pp' : 'Landmark');
                var body = JSON.parse(request);
                var args = {
                    data: JSON.stringify(body),
                    headers: {"Content-Type": "application/json",
                        "Accept": "application/json",
                        "AppId": 554940,
                        "Signature": "VLwAATi/myXGqlG9C14DVIKsLgFjEUAZIizPSIbVdJw=",
                        "TimeStamp": 1545391069685
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
            } else if (this.method.Method_Type === 'Pdf') {
                var app_id = ((config.environment.name === 'Production') ? 314808 : 516215);
                var signature = ((config.environment.name === 'Production') ? "s1jKM0PqAtXouLydKtrL7X3QCgi2KmtNNogKMddxJA4=" : "JsnNW921WJDN51CUaadctSNkGDWlXo/28TrIKuKUIhc=");
                var timestamp = ((config.environment.name === 'Production') ? "1571141818393" : "1568801564676");
                
                var postRequest = {
                    host: hostname,
                    path: specific_insurer_object.method.Service_URL,
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

ReligareCancerCare.prototype.premium_response_handler = function (objResponseJson) {
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
        console.log("religare response handler------------>");
        if (objResponseJson !== null && objResponseJson.hasOwnProperty('_doc')) {
            var objPremiumService = objResponseJson['_doc'];
            if (objPremiumService.hasOwnProperty('Premium')) {
                var premium_breakup = this.get_const_premium_breakup();
                premium_breakup['net_premium'] = objPremiumService['Premium'];
                premium_breakup['service_tax'] = premium_breakup['net_premium'] * 0.18;
                premium_breakup['final_premium'] = Math.round(premium_breakup['net_premium'] + premium_breakup['service_tax']);
                premium_breakup['tax']['CGST'] = premium_breakup['service_tax'] / 2;
                premium_breakup['tax']['SGST'] = premium_breakup['service_tax'] / 2;
                objServiceHandler.Premium_Breakup = premium_breakup;

//                var premium_breakup = this.get_const_premium_breakup();
//                premium_breakup['service_tax'] = (objPremiumService['Premium'] - 0) * 0.18;
//                premium_breakup['final_premium'] = objPremiumService['Premium'];
//                premium_breakup['net_premium'] = premium_breakup['final_premium'] - premium_breakup['service_tax'];
//                console.log(premium_breakup['final_premium']);
//                premium_breakup['tax']['CGST'] = premium_breakup['service_tax'] / 2;
//                premium_breakup['tax']['SGST'] = premium_breakup['service_tax'] / 2;
//                objServiceHandler.Premium_Breakup = premium_breakup;

            } else {
                Error_Msg = 'LM_MSG:MAIN_NODE_MISSING';
            }
        }
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
ReligareCancerCare.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    console.log(objResponseJson);

    try {
        if (objResponseJson.hasOwnProperty('responseData'))
        {
            var objError = objResponseJson['responseData']['status'];
            if (objError !== "1")
            {
                Error_Msg = objResponseJson['responseData']['message'];
            }

        }
        if (Error_Msg === 'NO_ERR')
        {
            var pg_data = {
                'proposalNum': objResponseJson['intPolicyDataIO']['policy']['proposalNum'],
                'returnURL': this.const_payment.pg_ack_url
            };
            objServiceHandler.Payment.pg_data = pg_data;
            objServiceHandler.Payment.pg_redirect_mode = 'POST';
            objServiceHandler.Insurer_Transaction_Identifier = '';
        } else {
            Error_Msg = "LM_MAIN_NODE_NA";
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
ReligareCancerCare.prototype.pg_response_handler = function () {
    try {
        console.log('Start', this.constructor.name, 'pg_response_handler');
        var output = this.const_payment_response.pg_post;
        this.const_policy.transaction_id = output['transactionRefNum'];
        if (output['uwDecision'] === "INFORCE") {
            this.const_policy.transaction_amount = this.insurer_master['service_logs']['pb_db_master']['Insurer_Response']['intPolicyDataIO']['policy']['premium'];
            //this.const_policy.transaction_amount = this.insurer_master['service_logs']['pb_db_master']['Insurer_Response']['Envelope']['Body']['0']['createPolicyResponse']['0']['return']['0']['int-policy-data-iO']['0']['policy']['0']['premium']['0'];
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.transaction_status = 'SUCCESS';
            this.const_policy.policy_number = output['policyNumber'];
        } else if (output['uwDecision'] === "PENDINGFORMANUALUW" || output['uwDecision'] === "PENDINGREQUIREMENTS") {
            this.const_policy.transaction_amount = this.insurer_master['service_logs']['pb_db_master']['Insurer_Response']['Envelope']['Body']['0']['createPolicyResponse']['0']['return']['0']['int-policy-data-iO']['0']['policy']['0']['premium']['0'];
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.transaction_status = 'SUCCESS';
            this.const_policy.transaction_substatus = 'UNDERWRITING';
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
ReligareCancerCare.prototype.verification_response_handler = function (objResponseJson) {
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
            var pdf_file_name = this.constructor.name + '_' + "CancerCare" + '_' + this.const_policy.policy_number + '.pdf';
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
ReligareCancerCare.prototype.pdf_call = function (url, args, pdf_sys_loc) {
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
ReligareCancerCare.prototype.pdf_response_handler = function (objResponseJson) {
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
            var product_name = 'Health';
            var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.lm_request['policy_number'] + '.pdf';
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
            'Msg': ex
        };
        objServiceHandler.Policy = this.const_policy;
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'pdf_response_handler', objServiceHandler);
    }
    return objServiceHandler;

};
ReligareCancerCare.prototype.get_member_relation = function (i) {
    console.log(this.constructor.name, 'get_member_relation', ' Start ReligareCancerCare');
    var gender = this.lm_request['member_' + i + '_gender'];
    console.log("Gender in ReligareCancerCare " + gender);
    if (i >= 3) {
        return(gender === 'M' ? 'SONM' : 'UDTR');
    } else if (i === 1) {
        return 'SELF';
    } else if (i === 2) {
        return(gender === 'F' ? 'SPSE' : 'SPSE');
    }
    return '';
    console.log(this.constructor.name, 'get_member_relation', 'End ReligareCancerCare');
};
ReligareCancerCare.prototype.get_addon_details = function () {
    if (this.prepared_request['dbmaster_pb_plan_name'] === 'Care + DSI') {
        return "ASIFORAH";
    }
    if (this.prepared_request['dbmaster_pb_plan_name'] === 'Care + DSI + Care') {
        return "CAREWITHNCB,ASIFORAH";
    }
    if (this.prepared_request['dbmaster_pb_plan_name'] === 'Care + DSI + Care + UAR') {
        return "CAREWITHNCB,ASIFORAH,UAR";
    }
    if (this.prepared_request['dbmaster_pb_plan_name'] === 'Care + DSI + Care + PA') {
        return "CAREWITHNCB,ASIFORAH,PA";
    }
    if (this.prepared_request['dbmaster_pb_plan_name'] === 'Care + NCB') {
        return "CAREWITHNCB";
    }
    if (this.prepared_request['dbmaster_pb_plan_name'] === 'Care + PA') {
        return "PA";
    }
    if (this.prepared_request['dbmaster_pb_plan_name'] === 'Care + UAR + PA') {
        return "CARE,PA,UAR";
    }
    if (this.prepared_request['dbmaster_pb_plan_name'] === 'Care + NCB + PA') {
        return "CAREWITHNCB,PA";
    }
    if (this.prepared_request['dbmaster_pb_plan_name'] === 'Care + NCB + UAR') {
        return "CAREWITHNCB,UAR";
    }
    if (this.prepared_request['dbmaster_pb_plan_name'] === 'Care + UAR') {
        return "UAR";
    }
    if (this.prepared_request['dbmaster_pb_plan_name'] === 'Care + DSI + PA') {
        return "ASIFORAH,PA";
    }
    if (this.prepared_request['dbmaster_pb_plan_name'] === 'Care + DSI + UAR + PA') {
        return "ASIFORAH,UAR,PA";
    }
    if (this.prepared_request['dbmaster_pb_plan_name'] === 'Care + DSI + UAR') {
        return "ASIFORAH,UAR";
    }
};
ReligareCancerCare.prototype.get_loan_amt = function (plan_id) {
    var loan_amt = '';
    if (plan_id === 245 || plan_id === 260 || plan_id === 261 || plan_id === 262 || plan_id === 265 || plan_id === 266)
    {
        loan_amt = this.prepared_request['health_insurance_si'] * 5;
    }
    return loan_amt;
};
ReligareCancerCare.prototype.health_insurance_si_2 = function () {
    console.log('health_insurance_si_2', 'start');
    var mediclaim = [
        {'code': '011', 'ins_type': 'individual', 'sum_ins': 1000000},
        {'code': '015', 'ins_type': 'individual', 'sum_ins': 2500000},
        {'code': '017', 'ins_type': 'individual', 'sum_ins': 5000000},
        {'code': '019', 'ins_type': 'individual', 'sum_ins': 10000000},
        {'code': '021', 'ins_type': 'individual', 'sum_ins': 20000000}
    ];
    var index = mediclaim.findIndex(x => x.sum_ins === this.lm_request['cancer_care_si'] - 0);
    if (index === -1) {
        return "";
    }
    return mediclaim[index]['code'];
    console.log('health_insurance_si_2', 'end');
};
ReligareCancerCare.prototype.getQuestionCode = function (code, type) {
    var arr_question_set = [
        {"code": "205", "set": "PEDdiabetesDetails", "type": "Flag"},
        {"code": "diabetesExistingSince", "set": "PEDdiabetesDetails", "type": "Since"},
        {"code": "207", "set": "PEDhyperTensionDetails", "type": "Flag"},
        {"code": "hyperTensionExistingSince", "set": "PEDhyperTensionDetails", "type": "Since"},
        {"code": "232", "set": "PEDliverDetails", "type": "Flag"},
        {"code": "liverExistingSince", "set": "PEDliverDetails", "type": "Since"},
        {"code": "114", "set": "PEDcancerDetails", "type": "Flag"},
        {"code": "cancerExistingSince", "set": "PEDcancerDetails", "type": "Since"},
        {"code": "143", "set": "PEDcardiacDetails", "type": "Flag"},
        {"code": "cardiacExistingSince", "set": "PEDcardiacDetails", "type": "Since"},
        {"code": "105", "set": "PEDjointpainDetails", "type": "Flag"},
        {"code": "jointpainExistingSince", "set": "PEDjointpainDetails", "type": "Since"},
        {"code": "129", "set": "PEDkidneyDetails", "type": "Flag"},
        {"code": "kidneyExistingSince", "set": "PEDkidneyDetails", "type": "Since"},
        {"code": "164", "set": "PEDparalysisDetails", "type": "Flag"},
        {"code": "paralysisExistingSince", "set": "PEDparalysisDetails", "type": "Since"},
        {"code": "122", "set": "PEDcongenitalDetails", "type": "Flag"},
        {"code": "congenitalExistingSince", "set": "PEDcongenitalDetails", "type": "Since"},
        {"code": "147", "set": "PEDHivaidsDetails", "type": "Flag"},
        {"code": "hivaidsExistingSince", "set": "PEDHivaidsDetails", "type": "Since"},
        {"code": "210", "set": "PEDotherDetails", "type": "Flag"},
        {"code": "otherExistingSince", "set": "PEDotherDetails", "type": "Since"},
        {"code": "otherDiseasesDescription", "set": "PEDotherDetails", "type": "Details"},
        {"code": "250", "set": "PEDRespiratoryDetails", "type": "Flag"},
        {"code": "respiratoryExistingSince", "set": "PEDRespiratoryDetails", "type": "Since"},
        {"code": "222", "set": "PEDEndoDetails", "type": "Flag"},
        {"code": "EndocriExistingSince", "set": "PEDEndoDetails", "type": "Since"},
        {"code": "502", "set": "PEDillnessDetails", "type": "Flag"},
        {"code": "illnessExistingSince", "set": "PEDillnessDetails", "type": "Since"},
        {"code": "503", "set": "PEDSurgeryDetails", "type": "Flag"},
        {"code": "SurgeryExistingSince", "set": "PEDSurgeryDetails", "type": "Since"},
        {"code": "504", "set": "PEDSmokeDetails", "type": "Flag"},
        {"code": "SmokeExistingSince", "set": "PEDSmokeDetails", "type": "Since"},
        {"code": "OtherSmokeDetails", "set": "PEDSmokeDetails", "type": "Details"},
        {"code": "pedYesNo", "set": "yesNoExist", "type": "Flag"},
        {"code": "H001", "set": "HEDHealthHospitalized", "type": "Flag"},
        {"code": "H002", "set": "HEDHealthClaim", "type": "Flag"},
        {"code": "H003", "set": "HEDHealthDeclined", "type": "Flag"},
        {"code": "H004", "set": "HEDHealthCovered", "type": "Flag"},
        {"code": "H102", "set": "HEDCFLEAFONE", "type": "Flag"},
        {"code": "H103", "set": "HEDCFLEAFTWO", "type": "Flag"},
        {"code": "H104", "set": "HEDCFLEAFTHREE", "type": "Flag"},
        {"code": "H105", "set": "HEDCFLEAFFOUR", "type": "Flag"},
        {"code": "H106", "set": "HEDCFLEAFFIVE", "type": "Flag"},
        {"code": "H107", "set": "HEDCFLEAFSIX", "type": "Flag"},
        {"code": "H108", "set": "HEDCFLEAFSEVEN", "type": "Flag"},
        {"code": "H109", "set": "HEDCFLEAFEIGHT", "type": "Flag"},
        {"code": "H110", "set": "HEDCFLEAFNINE", "type": "Flag"},
        {"code": "H111", "set": "HEDCFLEAFTEN", "type": "Flag"},
        {"code": "H112", "set": "HEDCFLEAFELEVEN", "type": "Flag"},
        {"code": "H113", "set": "HEDCFLEAFTWELVE", "type": "Flag"},
        {"code": "H114", "set": "HEDCFLEAFTHIRTEEN", "type": "Flag"},
        {"code": "H115", "set": "HEDCFLEAFFOURTEEN", "type": "Flag"}
    ];
    var index = -1;
    if (type === "flag") {
        return code;
    } else if (type === "since") {
        index = arr_question_set.findIndex(x => x.code === code);
        var set = arr_question_set[index]['set'];
        index = arr_question_set.findIndex(x => x.set === set && x.type === "Since");
    }
    if (index === -1) {
        return "000";
    }
    return arr_question_set[index]['code'];
};
ReligareCancerCare.prototype.getQuestionSet = function (code) {
    var arr_question_set = [
        {"code": "205", "set": "PEDdiabetesDetails", "type": "Flag"},
        {"code": "diabetesExistingSince", "set": "PEDdiabetesDetails", "type": "Since"},
        {"code": "207", "set": "PEDhyperTensionDetails", "type": "Flag"},
        {"code": "hyperTensionExistingSince", "set": "PEDhyperTensionDetails", "type": "Since"},
        {"code": "232", "set": "PEDliverDetails", "type": "Flag"},
        {"code": "liverExistingSince", "set": "PEDliverDetails", "type": "Since"},
        {"code": "114", "set": "PEDcancerDetails", "type": "Flag"},
        {"code": "cancerExistingSince", "set": "PEDcancerDetails", "type": "Since"},
        {"code": "143", "set": "PEDcardiacDetails", "type": "Flag"},
        {"code": "cardiacExistingSince", "set": "PEDcardiacDetails", "type": "Since"},
        {"code": "105", "set": "PEDjointpainDetails", "type": "Flag"},
        {"code": "jointpainExistingSince", "set": "PEDjointpainDetails", "type": "Since"},
        {"code": "129", "set": "PEDkidneyDetails", "type": "Flag"},
        {"code": "kidneyExistingSince", "set": "PEDkidneyDetails", "type": "Since"},
        {"code": "164", "set": "PEDparalysisDetails", "type": "Flag"},
        {"code": "paralysisExistingSince", "set": "PEDparalysisDetails", "type": "Since"},
        {"code": "122", "set": "PEDcongenitalDetails", "type": "Flag"},
        {"code": "congenitalExistingSince", "set": "PEDcongenitalDetails", "type": "Since"},
        {"code": "147", "set": "PEDHivaidsDetails", "type": "Flag"},
        {"code": "hivaidsExistingSince", "set": "PEDHivaidsDetails", "type": "Since"},
        {"code": "210", "set": "PEDotherDetails", "type": "Flag"},
        {"code": "otherExistingSince", "set": "PEDotherDetails", "type": "Since"},
        {"code": "otherDiseasesDescription", "set": "PEDotherDetails", "type": "Details"},
        {"code": "250", "set": "PEDRespiratoryDetails", "type": "Flag"},
        {"code": "respiratoryExistingSince", "set": "PEDRespiratoryDetails", "type": "Since"},
        {"code": "222", "set": "PEDEndoDetails", "type": "Flag"},
        {"code": "EndocriExistingSince", "set": "PEDEndoDetails", "type": "Since"},
        {"code": "502", "set": "PEDillnessDetails", "type": "Flag"},
        {"code": "illnessExistingSince", "set": "PEDillnessDetails", "type": "Since"},
        {"code": "503", "set": "PEDSurgeryDetails", "type": "Flag"},
        {"code": "SurgeryExistingSince", "set": "PEDSurgeryDetails", "type": "Since"},
        {"code": "504", "set": "PEDSmokeDetails", "type": "Flag"},
        {"code": "SmokeExistingSince", "set": "PEDSmokeDetails", "type": "Since"},
        {"code": "OtherSmokeDetails", "set": "PEDSmokeDetails", "type": "Details"},
        {"code": "pedYesNo", "set": "yesNoExist", "type": "Flag"},
        {"code": "H001", "set": "HEDHealthHospitalized", "type": "Flag"},
        {"code": "H002", "set": "HEDHealthClaim", "type": "Flag"},
        {"code": "H003", "set": "HEDHealthDeclined", "type": "Flag"},
        {"code": "H004", "set": "HEDHealthCovered", "type": "Flag"},
        {"code": "H102", "set": "HEDCFLEAFONE", "type": "Flag"},
        {"code": "H103", "set": "HEDCFLEAFTWO", "type": "Flag"},
        {"code": "H104", "set": "HEDCFLEAFTHREE", "type": "Flag"},
        {"code": "H105", "set": "HEDCFLEAFFOUR", "type": "Flag"},
        {"code": "H106", "set": "HEDCFLEAFFIVE", "type": "Flag"},
        {"code": "H107", "set": "HEDCFLEAFSIX", "type": "Flag"},
        {"code": "H108", "set": "HEDCFLEAFSEVEN", "type": "Flag"},
        {"code": "H109", "set": "HEDCFLEAFEIGHT", "type": "Flag"},
        {"code": "H110", "set": "HEDCFLEAFNINE", "type": "Flag"},
        {"code": "H111", "set": "HEDCFLEAFTEN", "type": "Flag"},
        {"code": "H112", "set": "HEDCFLEAFELEVEN", "type": "Flag"},
        {"code": "H113", "set": "HEDCFLEAFTWELVE", "type": "Flag"},
        {"code": "H114", "set": "HEDCFLEAFTHIRTEEN", "type": "Flag"},
        {"code": "H115", "set": "HEDCFLEAFFOURTEEN", "type": "Flag"}
    ];
    var index = arr_question_set.findIndex(x => x.code === code);
    if (index === -1) {
        return "000";
    }
    return arr_question_set[index]['set'];
};
ReligareCancerCare.prototype.current_time = function () {
    var today = moment().utcOffset("+05:30");
    var current_time = moment(today).format("HH:mm:ss");
    current_time = current_time.replaceAll(":", "");
    return current_time;
};
module.exports = ReligareCancerCare;