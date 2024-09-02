/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var util = require('util');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var Health = require(appRoot + '/libs/Health');
var fs = require('fs');
var config = require('config');
var moment = require('moment');
function FutureGeneraliHealth() {

}
util.inherits(FutureGeneraliHealth, Health);
FutureGeneraliHealth.prototype.lm_request_single = {};
FutureGeneraliHealth.prototype.insurer_integration = {};
FutureGeneraliHealth.prototype.insurer_addon_list = [];
FutureGeneraliHealth.prototype.insurer = {};
FutureGeneraliHealth.prototype.insurer_date_format = 'dd/MM/yyyy';
FutureGeneraliHealth.prototype.const_insurer_suminsured = [300000, 500000, 1000000, 1500000, 2000000, 2500000, 5000000, 10000000];
FutureGeneraliHealth.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
FutureGeneraliHealth.prototype.insurer_product_field_process_pre = function () {

    var adult = this.lm_request['adult_count'];
    var child = this.lm_request['child_count'];
    this.prepared_request['timestamp'] = this.timestamp();
    this.processed_request['___timestamp___'] = this.prepared_request['timestamp'];
    if (this.lm_request['method_type'] === 'Premium') {
        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";
        var member = 1;
        for (member = 1; member <= adult; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.prepared_request['member_' + member + '_inc'] = member;
            this.processed_request['___member_' + member + '_inc___'] = member;
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
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
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
        }

        this.method_content = this.method_content.replaceAll('<!--InsurersDetail_Start-->', "");
        this.method_content = this.method_content.replaceAll('<!--InsurersDetail_End-->', "");
    }

    if (this.lm_request['method_type'] === 'Proposal') {
        this.prepared_request["service_tax"] = this.lm_request["service_tax"];
        this.processed_request["___service_tax___"] = this.prepared_request["service_tax"];
        this.prepared_request["district"] = this.lm_request["district"];
        this.processed_request["___district___"] = this.prepared_request["district"];
        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";
        var member = 1;
//        var ped =false;
        this.prepared_request['pre_exist_disease'] = 'N';
        this.processed_request['___pre_exist_disease___'] = 'N';
        for (member = 1; member <= adult; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.prepared_request['member_' + member + '_inc'] = member;
            this.processed_request['___member_' + member + '_inc___'] = member;
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
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
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
        this.method_content = this.method_content.replaceAll('<!--InsurersDetail_Start-->', "");
        this.method_content = this.method_content.replaceAll('<!--InsurersDetail_End-->', "");

        //Question details
        //adult
        for (member = 1; member <= adult; member++) {
            this.prepared_request['member_' + member + '_nominee_name'] = this.lm_request['member_' + member + '_nominee_name'];
            this.processed_request['___member_' + member + '_nominee_name___'] = this.lm_request['member_' + member + '_nominee_name'];
            this.prepared_request['member_' + member + '_nominee_rel'] = this.lm_request['member_' + member + '_nominee_rel'];
            this.processed_request['___member_' + member + '_nominee_rel___'] = this.prepared_request['member_' + member + '_nominee_rel'];
            this.calculate_bmi(member);
            this.getNomineeAge(member);
            for (var key in this.lm_request) {
                if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1) {
                    var ques_detail = key.replace('_type', '_details');
                    if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                        if (this.lm_request[ques_detail] === false) {
                            this.prepared_request[ques_detail] = 'N';
                            this.processed_request['___' + ques_detail + '___'] = 'N';
                            if (ques_detail.includes('8')) {
                                this.processed_request['___' + ques_detail + '___'] = '0';
                            }
                        } else
                        {
                            this.prepared_request[ques_detail] = 'Y';
                            this.processed_request['___' + ques_detail + '___'] = 'Y';
                            if (ques_detail.includes('8')) {
                                this.processed_request['___' + ques_detail + '___'] = '10';
                            }
                        }
                    } else if (this.lm_request[key].toString().toLowerCase() === 'since') {
                        this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                        this.processed_request['___' + ques_detail + '___'] = this.lm_request[ques_detail];
                    }
                }
            }
            if (this.processed_request['___pre_exist_disease___'] === 'N')
            {
                if ((this.prepared_request['member_' + member + '_question_1_details']) === 'Y' || (this.prepared_request['member_' + member + '_question_2_details']) === 'Y' ||
                        (this.prepared_request['member_' + member + '_question_3_details']) === 'Y' || (this.prepared_request['member_' + member + '_question_4_details']) === 'Y' ||
                        (this.prepared_request['member_' + member + '_question_5_details']) === 'Y' || (this.prepared_request['member_' + member + '_question_6_details']) === 'Y' ||
                        (this.prepared_request['member_' + member + '_question_7_details']) === 'Y')
                {
                    this.processed_request['___pre_exist_disease___'] = 'Y';
                }
            }

        }

        //child

        for (member = 3; member <= child + 2; member++) {
            this.prepared_request['member_' + member + '_nominee_name'] = this.lm_request['member_' + member + '_nominee_name'];
            this.processed_request['___member_' + member + '_nominee_name___'] = this.lm_request['member_' + member + '_nominee_name'];
            this.prepared_request['member_' + member + '_nominee_rel'] = this.lm_request['member_' + member + '_nominee_rel'];
            this.processed_request['___member_' + member + '_nominee_rel___'] = this.prepared_request['member_' + member + '_nominee_rel'];
            this.calculate_bmi(member);
            this.getNomineeAge(member);
            for (var key in this.lm_request) {
                if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1) {
                    var ques_detail = key.replace('_type', '_details');
                    if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                        if (this.lm_request[ques_detail] === false) {
                            this.prepared_request[ques_detail] = 'N';
                            this.processed_request['___' + ques_detail + '___'] = 'N';
                            if (ques_detail.includes('8')) {
                                this.processed_request['___' + ques_detail + '___'] = '0';
                            }
                        } else
                        {
                            this.prepared_request[ques_detail] = 'Y';
                            this.processed_request['___' + ques_detail + '___'] = 'Y';
                            if (ques_detail.includes('8')) {
                                this.processed_request['___' + ques_detail + '___'] = '10';
                            }
                        }
                    } else
                    if (this.lm_request[key].toString().toLowerCase() === 'since') {
                        this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                        this.processed_request['___' + ques_detail + '___'] = this.lm_request[ques_detail];
                    }

                }
            }


            if (this.processed_request['___pre_exist_disease___'] === 'N')
            {
                if ((this.prepared_request['member_' + member + '_question_1_details']) === 'Y' || (this.prepared_request['member_' + member + '_question_2_details']) === 'Y' ||
                        (this.prepared_request['member_' + member + '_question_3_details']) === 'Y' || (this.prepared_request['member_' + member + '_question_4_details']) === 'Y' ||
                        (this.prepared_request['member_' + member + '_question_5_details']) === 'Y' || (this.prepared_request['member_' + member + '_question_6_details']) === 'Y' ||
                        (this.prepared_request['member_' + member + '_question_7_details']) === 'Y')
                {
                    this.processed_request['___pre_exist_disease___'] = 'Y';
                }
            }

        }

    }
    if (this.lm_request['method_type'] === 'Verification') {
        this.method_content = this.insurer_master['service_logs']['pb_db_master']['Insurer_Request'];
        var final_amoumt = this.insurer_master['service_logs']['pb_db_master']['Payment']['pg_data']['PremiumAmount'];
        var obj_replace = {
            '<UniqueTranKey></UniqueTranKey>': '<UniqueTranKey>' + this.lm_request['pg_get']['WS_P_ID'] + '</UniqueTranKey>',
            '<TranRefNo></TranRefNo>': '<TranRefNo>' + this.lm_request['pg_get']['PGID'] + '</TranRefNo>',
            '<Amount></Amount>': '<Amount>' + final_amoumt + '</Amount>'
        };
        this.method_content = this.method_content.toString().replaceJson(obj_replace);
    }

    console.log(this.method_content);
};
FutureGeneraliHealth.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {
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
FutureGeneraliHealth.prototype.insurer_product_field_process_post = function () {

};
FutureGeneraliHealth.prototype.insurer_product_api_post = function () {

};
FutureGeneraliHealth.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    try {
        var objInsurerProduct = this;
        var Client = require('node-rest-client').Client;
        var client = new Client();
        console.log(docLog.Insurer_Request);

        if (specific_insurer_object.method.Method_Type !== 'Pdf') {
            var args = {
                Product: 'HealthTotal',
                XML: docLog.Insurer_Request
            };
            soap.createClient(specific_insurer_object.method_file_url, function (err, client) {
                try {
                    client.setEndpoint(specific_insurer_object.method_file_url.split('?')['0']);
                    client[specific_insurer_object.method.Method_Action](args, function (err1, result, raw, soapHeader) {
                        console.log(err, result, raw, soapHeader);
                        if (err1) {
                            console.error('FutureGeneraliHealth', 'service_call', 'exception', err1);
                            var objResponseFull = {
                                'err': err1,
                                'result': result,
                                'raw': raw,
                                'soapHeader': soapHeader,
                                'objResponseJson': null
                            };
                            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
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
                                    var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
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
//            client.post(specific_insurer_object.method.Service_URL, args, function (data) {
//                var objData = JSON.stringify(data);
//                var objReplace = {
//                    's:E': 'E', 's:B': 'B'
//                };
//                var filter_response = objData.replaceJson(objReplace);
//                var objResponseFull = {
//                    'err': null,
//                    'result': JSON.stringify(data),
//                    'raw': JSON.stringify(data),
//                    'soapHeader': null,
//                    'objResponseJson': JSON.parse(filter_response)
//                };
//                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
//            });

//            =========================================================================


            let lm_service_url = 'http://qa-www.policyboss.com:3000/future_requests/future_services';
            let post_request = {
                data: {
                    method_type: specific_insurer_object.method.Method_Type,
                    method_file_url: specific_insurer_object.method_file_url,
                    method_action: specific_insurer_object.method.Method_Action,
                    xml_request: docLog.Insurer_Request
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': '*/*'
                }
            };
            function jsonToQueryString(json) {
                return  Object.keys(json).map(function (key) {
                    return encodeURIComponent(key) + '=' +
                            encodeURIComponent(json[key]);
                }).join('&');
            }

            post_request.data = jsonToQueryString(post_request.data);
            client.post(lm_service_url, post_request, function (future_data, future_response) {
                if (future_data && future_data.Msg && future_data.Msg === "Error") {
                    console.error('Exception', this.constructor.name, 'service_call', future_data.Data['err'], docLog.Insurer_Request);
                    var objResponseFull = {
                        'err': JSON.stringify(future_data.Data['err']),
                        'result': null,
                        'raw': future_data.Data['row'],
                        'soapHeader': null,
                        'objResponseJson': null
                    };
                    var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                } else {
                    if (specific_insurer_object.method.Method_Type === 'Pdf') {
                        var objResponseFull = {
                            'err': future_data.Data['err'],
                            'result': future_data.Data['result'],
                            'raw': future_data.Data['raw'],
                            'soapHeader': future_data.Data['soapHeader'],
                            'objResponseJson': future_data.Data['result']
                        };
                        var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                    } else {
                        var objResponseFull = {
                            'err': null,
                            'result': future_data.Data['result'],
                            'raw': future_data.Data['raw'],
                            'soapHeader': null,
                            'objResponseJson': future_data.Data['objResponseJson']
                        };
                        var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);

                    }
                }
            });

//        ===========================================================================
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }

};
FutureGeneraliHealth.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    var member = 1;
    try {
        var objDetails = objResponseJson['Root'];
        if (objDetails.hasOwnProperty('Policy')) {
            var objCoverDetails = objDetails['Policy'][0]['OutputRes'][0];
            var premium_breakup = this.get_const_premium_breakup();
            premium_breakup['net_premium'] = objCoverDetails['PremiumAmt'][0];
            premium_breakup['service_tax'] = objCoverDetails['ServiceTax'][0];
            premium_breakup['final_premium'] = objCoverDetails['PremWithServTax'][0];

            var inputDetails = objDetails['Policy'][0]['InputParameters'][0]['BeneficiaryDetails'][0].Member;
            if (inputDetails !== undefined) {
                for (member = 1; member <= this.lm_request['adult_count']; member++) {
                    premium_breakup['member_' + member + '_base_premium'] = (inputDetails[member - 1]['PerPrsnPremium'][0] - 0);
                }
                for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
                    if (this.lm_request['adult_count'] === 1) {
                        premium_breakup['member_' + member + '_base_premium'] = (inputDetails[member - 2]['PerPrsnPremium'][0] - 0);
                    } else {
                        premium_breakup['member_' + member + '_base_premium'] = (inputDetails[member - 1]['PerPrsnPremium'][0] - 0);
                    }
                }
            }
            objServiceHandler.Premium_Breakup = premium_breakup;
        } else
        {
            if (objCoverDetails.hasOwnProperty('ErrorMsg'))
            {
                Error_Msg = objCoverDetails['ErrorMsg'][0].toString();
            }
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
FutureGeneraliHealth.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    var count = this.prepared_request['member_count'];
    var adultcount = this.prepared_request['adult_count'];
    var net_premium = 0;
    var premium_breakup = this.insurer_master['service_logs']['pb_db_master']['Premium_Breakup'];
    var member = 1;
    for (member = 1; member <= count + 1; member++)
    {
        if (this.prepared_request["member_" + member + "_inc"] !== undefined && this.prepared_request["member_" + member + "_inc"] !== '') {
            if (this.prepared_request['member_' + member + '_bmi'] >= 32 && this.prepared_request['member_' + member + '_age'] > 15) {
                Error_Msg = "BMI Not In Range";
            }
            if ((this.prepared_request['member_' + member + '_question_8_details']) === 'Y') {
                var tot_base_prm = premium_breakup['member_' + member + '_base_premium'] + (premium_breakup['member_' + member + '_base_premium'] * 0.10);
                net_premium += tot_base_prm;
            } else {
                net_premium += premium_breakup['member_' + member + '_base_premium'];
            }
        }
    }
    var final_premium = (net_premium !== undefined && net_premium !== 0) ? (net_premium + (net_premium * 0.18)) : this.prepared_request['final_premium'];
    if (this.prepared_request['health_insurance_type'] === "individual" && this.prepared_request['member_1_marital_status'] === "M") {
        Error_Msg = "Marital status selected as Married - if insured is married than covering spouse is mandatory";
    }
    for (member = 1; member <= adultcount; member++) {
        if (this.prepared_request['health_insurance_type'] === "floater" && this.prepared_request['member_' + member + '_marital_status'] === "S") {
            Error_Msg = "Marital status selected as Single";
        }
    }
    if (this.prepared_request["relation"] !== 'SELF') {
        Error_Msg = "Proposer should also be insured";
    }
    if (this.processed_request['___pre_exist_disease___'] === 'Y') {
        Error_Msg = "Regret, policy cannot be issued online. Please contact our nearest branch";
    }
    try
    {
        if (Error_Msg === 'NO_ERR')
        {
            pg_data = {
                'TransactionID': this.prepared_request['timestamp'],
                'PaymentOption': 3,
                'ResponseURL': this.const_payment.pg_ack_url,
                'ProposalNumber': 'PB' + this.lm_request["crn"],
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
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
FutureGeneraliHealth.prototype.pg_response_handler = function () {
    try {
        var Output = this.const_payment_response.pg_get;
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
FutureGeneraliHealth.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';
    var client_id = "";
    var receipt_no = "";
    var policy_no = "";
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
                        if (objResponseJson["Root"]["Client"][0]["ErrorMessage"][0] === "") {
                            client_id = objResponseJson["Root"]["Client"][0]["ClientId"][0];
                        }
                    }
                    if (objResponseJson["Root"].hasOwnProperty("Receipt"))
                    {
                        if (objResponseJson["Root"]["Client"][0]["ErrorMessage"][0] === "") {
                            receipt_no = objResponseJson["Root"]["Receipt"][0]["ReceiptNo"][0];
                        }
                    }

                    if (objResponseJson["Root"].hasOwnProperty("Policy"))
                    {
                        if (objResponseJson["Root"]["Policy"][0].hasOwnProperty("Status"))
                        {
                            if (objResponseJson["Root"]["Policy"][0]["Status"][0] !== "Successful")
                            {
                                Error_Msg = objResponseJson["Root"]["Policy"][0]["Message"][0]; //"Missing Policy Id";
                            } else
                            {
                                policy_no = objResponseJson["Root"]["Policy"][0]["PolicyNo"][0];
                            }
                        } else if (objResponseJson["Root"]["Policy"][0].hasOwnProperty('Root'))
                        {
                            if (objResponseJson["Root"]["Policy"][0]["Root"][0]["Policy"][0]["Status"][0] !== "Successful")
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
                    var pdf_file_name = this.constructor.name + '_Health_' + this.const_policy.policy_number.replaceAll('-', '') + '.pdf';
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
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
FutureGeneraliHealth.prototype.pdf_call = function (url, args, pdf_sys_loc) {
    var objInsurerProduct = this;
    objInsurerProduct.pdf_attempt++;
    var Client = require('node-rest-client').Client;
    var client = new Client();
    client.post(url, args, function (data) {
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
FutureGeneraliHealth.prototype.pdf_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'pdf_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    var insurer_pdf_url = "";
    try {
        var objServiceHandler = {
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
        var policy = {
            'policy_url': null,
            'policy_number': this.lm_request['policy_number'],
            'pdf_status': null
        };
        if (Error_Msg === 'NO_ERR' && insurer_pdf_url !== '') {
            var pdf_file_name = this.constructor.name + '_Health_' + this.lm_request['policy_number'].replaceAll('-', '') + '.pdf';
            var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
            var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
            policy.policy_url = pdf_web_path_portal;
            var https = require('https');
            this.const_policy.insurer_policy_url = insurer_pdf_url;
            try {
                var file_horizon = fs.createWriteStream(pdf_sys_loc_horizon);
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
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'pdf_response_handler', objServiceHandler);
        objServiceHandler.Policy = this.const_policy;
    }
    return objServiceHandler;

};
FutureGeneraliHealth.prototype.current_time = function () {
    var today = moment().utcOffset("+05:30");
    var current_time = moment(today).format("HH:mm:ss");
    current_time = current_time.replaceAll(":", "");
    return current_time;
};
FutureGeneraliHealth.prototype.get_member_relation = function (i) {
    var gender = this.lm_request['member_' + i + '_gender'];
    console.log("Member:" + gender);
    if (this.prepared_request["relation"] === 'SON' || this.prepared_request["relation"] === 'DAUG') {
        return(gender === 'M' ? 'FATH' : 'MOTH');
    }
    if (this.prepared_request["relation"] === 'MOTH' || this.prepared_request["relation"] === 'FATH') {
        return(gender === 'M' ? 'SON' : 'DAUG');
    }
    if (this.prepared_request["relation"] === 'SPOU') {
        return 'SPOU';
    }
    if (this.prepared_request["relation"] === 'SELF' || this.prepared_request["relation"] === '') {
        if (i >= 3) {
            return(gender === 'M' ? 'SON' : 'DAUG');
        } else if (i === 1) {
            return 'SELF';
        } else if (i === 2) {
            return 'SPOU';
        }
    }

    return '';
};
FutureGeneraliHealth.prototype.calculate_bmi = function (i) {
    var height = this.prepared_request['member_' + i + '_height'];
    var weight = this.prepared_request['member_' + i + '_weight'];
    var bmi = Math.round((weight / height / height) * 10000);
    this.prepared_request['member_' + i + '_bmi'] = bmi;
    this.processed_request['___member_' + i + '_bmi___'] = bmi;
};
FutureGeneraliHealth.prototype.is_valid_plan = function (lm_request, planCode) {
    console.log('FutureGeneraliHealth is_valid_plan', 'start');
    var index = -1;
    var Plans = [
        {'code': "Vital", 'min_si': 99000, 'max_si': 1000000},
        {'code': "Superior", 'min_si': 1050000, 'max_si': 2500000},
        {'code': "Premiere", 'min_si': 2550000, 'max_si': 10000000}
    ];
    index = Plans.findIndex(x => x.code === planCode && lm_request['member_1_age'] <= 50
                && x.min_si < (lm_request['health_insurance_si'] - 0)
                && x.max_si >= (lm_request['health_insurance_si'] - 0));
    return (index > -1 ? true : false);
    console.log('FutureGeneraliHealth is_valid_plan', 'End');
};
FutureGeneraliHealth.prototype.getNomineeAge = function (i) {
    var nominee_date_birth = this.lm_request['member_' + i + '_nominee_birth_date'];
    console.log(this.constructor.name, 'getNomineeAge');
    var nominee_age = moment().diff(nominee_date_birth, 'years');
    this.prepared_request['member_' + i + '_nominee_birth_date'] = nominee_age;
    this.processed_request['___member_' + i + '_nominee_birth_date___'] = nominee_age;
};
FutureGeneraliHealth.prototype.premium_breakup_schema = {
    "base_premium": "basePremium",
    "net_premium": "premium",
    "service_tax": "serviceTax",
    "SBC": "SBC",
    "KKC": "KKC",
    "gross_premium": "grossPremium",
    "final_premium": "totalPremium"

};
module.exports = FutureGeneraliHealth;