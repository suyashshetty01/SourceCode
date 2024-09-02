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

function LibertyVideoconHealth() {

}
util.inherits(LibertyVideoconHealth, Health);

LibertyVideoconHealth.prototype.lm_request_single = {};
LibertyVideoconHealth.prototype.insurer_integration = {};
LibertyVideoconHealth.prototype.insurer_addon_list = [];
LibertyVideoconHealth.prototype.insurer = {};
LibertyVideoconHealth.prototype.insurer_date_format = 'MM-dd-yyyy';
LibertyVideoconHealth.prototype.const_insurer_suminsured = [200000, 300000, 400000, 500000, 7500000, 1000000, 1500000, 2000000];

LibertyVideoconHealth.prototype.insurer_product_api_pre = function () {
    console.log('insurer_product_api_pre');
};

LibertyVideoconHealth.prototype.insurer_product_field_process_pre = function () {
    var member = 1;
    var adult = this.lm_request['adult_count'];
    var child = this.lm_request['child_count'];

    if (this.lm_request['method_type'] === 'Premium') {
        this.prepared_request['state_code'] = this.get_state_code(this.lm_request['state_name']);
        this.processed_request['___state_code___'] = this.prepared_request['state_code'];

        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";

        for (member = 1; member <= adult; member++) {
            this.prepared_request['member_' + member + '_inc'] = member;
            this.processed_request['___member_' + member + '_inc___'] = member;
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
        }

        for (member = 3; member <= child + 2; member++) {
            if (adult === 1) {
                this.prepared_request['member_' + member + '_inc'] = member - 1;
                this.processed_request['___member_' + member + '_inc___'] = member - 1;
                txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member - 1);
                this.prepared_request['member_' + member - 1 + '_relation'] = this.get_member_relation(member - 1);
                this.processed_request['___member_' + member - 1 + '_relation___'] = this.prepared_request['member_' + member - 1 + '_relation'];
            } else {
                this.prepared_request['member_' + member + '_inc'] = member;
                this.processed_request['___member_' + member + '_inc___'] = member;
                txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
                this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
                this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
            }
        }
    }

    if (this.lm_request['method_type'] === 'Proposal') {
        this.prepared_request['quote_number'] = this.insurer_master['service_logs']['pb_db_master']['Insurer_Response']["0"]["Quotation_Number"];
        this.processed_request['___quote_number___'] = this.prepared_request['quote_number'];
        var returnUrl = this.pg_ack_url(33);
        if (config.environment.name === 'Development') {
            returnUrl = 'http://localhost:7000/transaction-status/' + this.lm_request['udid'] + '/' + this.lm_request['crn'] + '/' + this.lm_request['proposal_id'];
        }
        this.prepared_request['aggregator_url'] = returnUrl;
        this.processed_request['___aggregator_url___'] = returnUrl;

        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";
        //ADULT
        //InsurersDetail_Start
        for (member = 1; member <= adult; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
            this.prepared_request['member_' + member + '_nominee_name'] = this.lm_request['member_' + member + '_nominee_name'];
            this.processed_request['___member_' + member + '_nominee_name___'] = this.prepared_request['member_' + member + '_nominee_name'];
            this.prepared_request['member_' + member + '_nominee_rel'] = this.lm_request['member_' + member + '_nominee_rel'];
            this.processed_request['___member_' + member + '_nominee_rel___'] = this.prepared_request['member_' + member + '_nominee_rel'];

            for (var key in this.lm_request) {
                if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1) {
                    var ques_detail = key.replace('_type', '_details');
                    if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                        if (this.lm_request[ques_detail]) {
                            this.prepared_request[ques_detail] = '1';
                            this.processed_request['___' + ques_detail + '___'] = '1';
                        } else {
                            this.prepared_request[ques_detail] = '0';
                            this.processed_request['___' + ques_detail + '___'] = '0';
                        }
                    } else if (this.lm_request[key].toString().toLowerCase() === 'since') {
                        this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                        this.processed_request['___' + ques_detail + '___'] = this.lm_request[ques_detail];
                    }
                }
            }
        }
        //CHILD
        //InsurersDetail_Start
        for (member = 3; member <= child + 2; member++) {
            if (adult === 1) {
                txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member - 1);
                this.prepared_request['member_' + member - 1 + '_relation'] = this.get_member_relation(member - 1);
                this.processed_request['___member_' + member - 1 + '_relation___'] = this.prepared_request['member_' + member - 1 + '_relation'];
                this.prepared_request['member_' + member + '_nominee_name'] = this.lm_request['member_' + member + '_nominee_name'];
                this.processed_request['___member_' + member + '_nominee_name___'] = this.prepared_request['member_' + member + '_nominee_name'];
                this.prepared_request['member_' + member + '_nominee_rel'] = this.lm_request['member_' + member + '_nominee_rel'];
                this.processed_request['___member_' + member + '_nominee_rel___'] = this.prepared_request['member_' + member + '_nominee_rel'];
            } else {
                txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
                this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
                this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
                this.prepared_request['member_' + member + '_nominee_name'] = this.lm_request['member_' + member + '_nominee_name'];
                this.processed_request['___member_' + member + '_nominee_name___'] = this.prepared_request['member_' + member + '_nominee_name'];
                this.prepared_request['member_' + member + '_nominee_rel'] = this.lm_request['member_' + member + '_nominee_rel'];
                this.processed_request['___member_' + member + '_nominee_rel___'] = this.prepared_request['member_' + member + '_nominee_rel'];
            }

            for (var key in this.lm_request) {
                if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1) {
                    var ques_detail = key.replace('_type', '_details');
                    if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                        if (this.lm_request[ques_detail]) {
                            this.prepared_request[ques_detail] = '1';
                            this.processed_request['___' + ques_detail + '___'] = '1';
                        } else {
                            this.prepared_request[ques_detail] = '0';
                            this.processed_request['___' + ques_detail + '___'] = '0';
                        }
                    } else if (this.lm_request[key].toString().toLowerCase() === 'since') {
                        this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                        this.processed_request['___' + ques_detail + '___'] = this.lm_request[ques_detail];
                    }
                }
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

        var txt_replace = this.find_text_btw_key(this.method_content, '<!--MedicalLifeStyleDetail_Start-->', '<!--MedicalLifeStyleDetail_End-->', true);
        var txt_replace_with = "";
        //ADULT
        //MedicalLifeStyleDetail_Start
        for (member = 1; member <= adult; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);

            for (var key in this.lm_request) {
                if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1) {
                    var ques_detail = key.replace('_type', '_details');
                    if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                        if (this.lm_request[ques_detail]) {
                            this.prepared_request[ques_detail] = '1';
                            this.processed_request['___' + ques_detail + '___'] = '1';
                        } else {
                            this.prepared_request[ques_detail] = '0';
                            this.processed_request['___' + ques_detail + '___'] = '0';
                        }
                    } else if (this.lm_request[key].toString().toLowerCase() === 'since') {
                        this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                        this.processed_request['___' + ques_detail + '___'] = this.lm_request[ques_detail];
                    }
                }
            }
        }
        //CHILD
        //MedicalLifeStyleDetail_Start
        for (member = 3; member <= child + 2; member++) {
            if (adult === 1) {
                txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member - 1);
            } else {
                txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            }

            for (var key in this.lm_request) {
                if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1) {
                    var ques_detail = key.replace('_type', '_details');
                    if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                        if (this.lm_request[ques_detail]) {
                            this.prepared_request[ques_detail] = '1';
                            this.processed_request['___' + ques_detail + '___'] = '1';
                        } else {
                            this.prepared_request[ques_detail] = '0';
                            this.processed_request['___' + ques_detail + '___'] = '0';
                        }
                    } else if (this.lm_request[key].toString().toLowerCase() === 'since') {
                        this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                        this.processed_request['___' + ques_detail + '___'] = this.lm_request[ques_detail];
                    }
                }
            }
        }

        if (this.method_content[0] !== '<') {// for json
            txt_replace_with = txt_replace_with.replaceAll('<!--MedicalLifeStyleDetail_Start-->', "");
            var Total_Count = this.lm_request['member_count'];
            for (var x = 1; x <= Total_Count - 1; x++) {
                txt_replace_with = txt_replace_with.replace('<!--MedicalLifeStyleDetail_End-->', ",");
            }
            txt_replace_with = txt_replace_with.replace('<!--MedicalLifeStyleDetail_End-->', "");
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);

        var txt_replace = this.find_text_btw_key(this.method_content, '<!--PreExistingDetail_Start-->', '<!--PreExistingDetail_End-->', true);
        var txt_replace_with = "";
        //ADULT
        //PreExistingDetail_Start
        for (member = 1; member <= adult; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);

            for (var key in this.lm_request) {
                if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1) {
                    var ques_detail = key.replace('_type', '_details');
                    if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                        if (this.lm_request[ques_detail]) {
                            this.prepared_request[ques_detail] = '1';
                            this.processed_request['___' + ques_detail + '___'] = '1';
                        } else {
                            this.prepared_request[ques_detail] = '0';
                            this.processed_request['___' + ques_detail + '___'] = '0';
                        }
                    } else if (this.lm_request[key].toString().toLowerCase() === 'since') {
                        this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                        this.processed_request['___' + ques_detail + '___'] = this.lm_request[ques_detail];
                    }
                }
            }
        }
        for (member = 3; member <= child + 2; member++) {
            if (adult === 1) {
                txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member - 1);
            } else {
                txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            }
            //CHILD
            //PreExistingDetail_Start
            for (var key in this.lm_request) {
                if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1) {
                    var ques_detail = key.replace('_type', '_details');
                    if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                        if (this.lm_request[ques_detail]) {
                            this.prepared_request[ques_detail] = '1';
                            this.processed_request['___' + ques_detail + '___'] = '1';
                        } else {
                            this.prepared_request[ques_detail] = '0';
                            this.processed_request['___' + ques_detail + '___'] = '0';
                        }
                    } else if (this.lm_request[key].toString().toLowerCase() === 'since') {
                        this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                        this.processed_request['___' + ques_detail + '___'] = this.lm_request[ques_detail];
                    }
                }
            }
        }

        if (this.method_content[0] !== '<') {// for json
            txt_replace_with = txt_replace_with.replaceAll('<!--PreExistingDetail_Start-->', "");
            var Total_Count = this.lm_request['member_count'];
            for (var x = 1; x <= Total_Count - 1; x++) {
                txt_replace_with = txt_replace_with.replace('<!--PreExistingDetail_End-->', ",");
            }
            txt_replace_with = txt_replace_with.replace('<!--PreExistingDetail_End-->', "");
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
    }
    console.log(this.processed_request);

};

LibertyVideoconHealth.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
LibertyVideoconHealth.prototype.insurer_product_field_process_post = function () {

};
LibertyVideoconHealth.prototype.insurer_product_api_post = function () {

};
LibertyVideoconHealth.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
//    console.log('service_call');
    try {
        var objInsurerProduct = this;
//        console.log(docLog.Insurer_Request);
        //Example POST method invocation 
        var Client = require('node-rest-client').Client;
        var client = new Client();
        // set content-type header and data as json in args parameter 
        var args = {
            data: docLog.Insurer_Request,
            headers: {"Content-Type": "application/json"}
        };
        if (specific_insurer_object.method.Method_Calling_Type === 'POST') {
            client.post(specific_insurer_object.method_file_url + specific_insurer_object.method.Method_Action, args, function (data, response) {
                // parsed response body as js object 
//                console.log(data);
                // raw response 
                var objResponseFull = {
                    'err': null,
                    'result': data,
                    'raw': JSON.stringify(data),
                    'soapHeader': null,
                    'objResponseJson': JSON.parse(data)
                };
                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);

            });
        } else if (specific_insurer_object.method.Method_Calling_Type === 'GET') {
            function jsonToQueryString(json) {
                return '?' +
                        Object.keys(json).map(function (key) {
                    return encodeURIComponent(key) + '=' +
                            encodeURIComponent(json[key]);
                }).join('&');
            }
            var qs = jsonToQueryString(args.data);
            if (this.method.Method_Type === 'Verification') {
                var quoteNum = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['quote_number'];
                specific_insurer_object.method.Method_Action += "/" + quoteNum + "/null/null/null";
            } else if (this.method.Method_Type === 'Pdf') {
                var policyNum = this.lm_request['policy_number'];
                specific_insurer_object.method.Method_Action += "/null/" + policyNum + "/null";
            }
            client.get(specific_insurer_object.method_file_url + specific_insurer_object.method.Method_Action + qs, function (data, response) {
                // parsed response body as js object 
//                console.log(data);
                // raw response 
//                console.log(response);
                var objResponseFull = {
                    'err': null,
                    'result': null,
                    'raw': JSON.stringify(data),
                    'soapHeader': null,
                    'objResponseJson': data
                };
                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
            });
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};

LibertyVideoconHealth.prototype.premium_response_handler = function (objResponseJson) {
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
//        console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
        var objPremiumService = objResponseJson.hasOwnProperty('ErrorMessage') ? objResponseJson : objResponseJson['0'];
        if (objPremiumService['ErrorMessage'] === "Success" || objPremiumService['ErrorMessage'] === "Sucess") {
        } else {
            Error_Msg = objPremiumService['ErrorMessage'];
        }
        //check error stop
        if (Error_Msg === 'NO_ERR') {
            var premium_breakup = this.get_const_premium_breakup();
            premium_breakup['base_premium'] = objPremiumService['BasicPremium'];
            premium_breakup['net_premium'] = objPremiumService['NetPremium'];
            premium_breakup['service_tax'] = objPremiumService['CGST'] + objPremiumService['SGST'];
            premium_breakup['final_premium'] = objPremiumService['GrossPremium'];
            premium_breakup['gross_premium'] = objPremiumService['GrossPremium'];
            premium_breakup['tax']['IGST'] = objPremiumService['IGST'];
            premium_breakup['tax']['CGST'] = objPremiumService['CGST'];
            premium_breakup['tax']['SGST'] = objPremiumService['SGST'];
            premium_breakup['tax']['UGST'] = objPremiumService['UGST'];
            objServiceHandler.Premium_Breakup = premium_breakup;
            objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['Quotation_Number'];
        }
        objServiceHandler.Error_Msg = Error_Msg;
//        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);

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
LibertyVideoconHealth.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';

    try {
        var objPremiumService = objResponseJson.hasOwnProperty('ErrorMessage') ? objResponseJson : objResponseJson['0'];
        //check error start
        if (objPremiumService.hasOwnProperty('ErrorMessage')) {
            if (objPremiumService['ErrorMessage'] === "Success" || objPremiumService['ErrorMessage'] === "Sucess") {
            } else {
                Error_Msg = objPremiumService['ErrorMessage'];
            }
        } else {
            Error_Msg = 'LM_MSG:PROPOSAL_MAIN_NODE_MISSING';
        }

        if (Error_Msg === 'NO_ERR') {
            var today = this.get_instrument_date();
            var pg_data = {
                'Quote_Number': objPremiumService['Quotation_Number'],
                'Payer_Type': 'Customer',
                'Payment_By_Name': this.lm_request['first_name'],
                'Payment_By_Relation': '',
                'Collection_Amount': objPremiumService['GrossPremium'],
                'Collection_Receive_Date': today,
                'Collection_Mode': 'Online Collections',
                'Instrument_Number': this.lm_request['crn'],
                'Instrument_Date': today,
                'IFSC_Code': '',
                'Remarks': ''
            };
            objServiceHandler.Payment.pg_data = pg_data;
            objServiceHandler.Payment.pg_url = objPremiumService['PaymentURL'];
            objServiceHandler.Payment.pg_redirect_mode = 'POST';
            objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['Quotation_Number'];
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
LibertyVideoconHealth.prototype.pg_response_handler = function () {
    try {
        console.log('Start', this.constructor.name, 'pg_response_handler');
        var output = this.const_payment_response.pg_get;
        if (output['PLN'] !== '') {//PN
            this.const_policy.transaction_amount = this.insurer_master['service_logs']['pb_db_master']['Payment']['pg_data']['Collection_Amount'];
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.transaction_id = output['PLN'];
//            this.const_policy.policy_number = output['PLN'];//PN
        } else {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
        console.error('End', this.constructor.name, 'pg_response_handler', this.const_policy);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
LibertyVideoconHealth.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson !== '') {
            var objString = (objResponseJson['string'].hasOwnProperty('_') ? objResponseJson['string']['_'] : '');
            console.log(objString);
            var response = JSON.parse(objString);
            var objResponse = response.hasOwnProperty('ErrorMessage') ? response : response['0'];
            if (objResponse.hasOwnProperty('ErrorMessage')) {
                if (objResponse['ErrorMessage'] === "Success" || objResponse['ErrorMessage'] === "Sucess") {
                } else {
                    Error_Msg = objResponse['ErrorMessage'];
                }
            }
        } else {
            Error_Msg = 'Policy Number not available';
        }

        if (this.const_policy.pg_status === 'FAIL') {
        }
        if (this.const_policy.pg_status === 'SUCCESS') {
            if (objResponse.hasOwnProperty('Policy_Number'))
            {//transaction success
                this.const_policy.transaction_status = 'SUCCESS';
                if (objResponse['Policy_Number'] !== '' && objResponse['Policy_Number'] !== null) {
                    this.const_policy.transaction_substatus = "IF";
                    this.const_policy.policy_number = objResponse['Policy_Number'];
                    var pdf_file_name = 'LibertyGeneral_Health_' + this.const_policy.policy_number + '.pdf';
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
                    this.const_policy.transaction_substatus = "UW";
                }
            } else {
                Error_Msg = JSON.stringify(objResponseJson);
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
LibertyVideoconHealth.prototype.pdf_call = function (url, args, pdf_sys_loc) {
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
LibertyVideoconHealth.prototype.pdf_response_handler = function (objResponseJson) {
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
            var objString = (objResponseJson['string'].hasOwnProperty('_') ? objResponseJson['string']['_'] : '');
            console.log(objString);
            var response = JSON.parse(objString);
        } else {
            Error_Msg = 'Policy not available';
        }

        var policy = {
            'policy_url': null,
            'policy_number': this.lm_request['policy_number'],
            'pdf_status': null
        };
        if (Error_Msg === 'NO_ERR') {
            if (response[0]['ResponseCode'] === '0') {
                var pdf_file_name = 'LibertyGeneral_Health_' + this.lm_request['policy_number'] + '.pdf';
                var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                var url = response[0]['LetterUrl'];
                try {
                    var Client = require('node-rest-client').Client;
                    var client = new Client();
                    client.get(url, function (data, response) {
                        var binary = new Buffer(data, 'base64');
                        fs.writeFileSync(pdf_sys_loc_horizon, binary);
                    });
                } catch (ep) {
                    console.error('ExceptionPDF', this.constructor.name, 'pdf_response_handler', ep);
                }
                policy.policy_url = url;
                policy.pdf_status = 'SUCCESS';
                objServiceHandler.Insurer_Transaction_Identifier = this.lm_request['policy_number'];
            } else {
                policy.pdf_status = 'FAIL';
            }
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
    }
    return objServiceHandler;
};
LibertyVideoconHealth.prototype.premium_breakup_schema = {
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
LibertyVideoconHealth.prototype.get_member_relation = function (i) {
    console.log(this.constructor.name, 'get_member_relation', ' Start LVH');
    var gender = this.lm_request['member_' + i + '_gender'];
    console.log("Gender in LVH " + gender);
    if (i >= 3) {
        return(gender === 'M' ? 'R003' : 'R004');
    } else if (i === 1) {
        return 'R001';
    } else if (i === 2) {
        return 'R002';
    }
    return '';
    console.log(this.constructor.name, 'get_member_relation', 'End ABH');
};
LibertyVideoconHealth.prototype.get_instrument_date = function () {
    var today = new Date();

    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    today = mm + '/' + dd + '/' + yyyy;
    return today;
};
LibertyVideoconHealth.prototype.get_state_code = function (stateName) {
    console.log('Liberty state_code', 'start');
    var LibertyState = [
        {'code': 02, 'state': 'Himachal Pradesh'},
        {'code': 03, 'state': 'Punjab'},
        {'code': 04, 'state': 'Chandigarh'},
        {'code': 05, 'state': 'Uttarakhand'},
        {'code': 06, 'state': 'Haryana'},
        {'code': 07, 'state': 'Delhi'},
        {'code': 08, 'state': 'Rajasthan'},
        {'code': 09, 'state': 'Uttar Pradesh'},
        {'code': 10, 'state': 'Bihar'},
        {'code': 11, 'state': 'Sikkim'},
        {'code': 12, 'state': 'Arunachal Pradesh'},
        {'code': 13, 'state': 'Nagaland'},
        {'code': 14, 'state': 'Manipur'},
        {'code': 15, 'state': 'Mizoram'},
        {'code': 16, 'state': 'Tripura'},
        {'code': 17, 'state': 'Meghalaya'},
        {'code': 18, 'state': 'Assam'},
        {'code': 19, 'state': 'West Bengal'},
        {'code': 20, 'state': 'Jharkhand'},
        {'code': 21, 'state': 'Orissa'},
        {'code': 22, 'state': 'Chattisgarh'},
        {'code': 23, 'state': 'Madhya Pradesh'},
        {'code': 24, 'state': 'Gujarat'},
        {'code': 25, 'state': 'Daman & Diu'},
        {'code': 26, 'state': 'Dadra & Nagar Haveli'},
        {'code': 27, 'state': 'Maharashtra'},
        {'code': 28, 'state': 'Andhra Pradesh'},
        {'code': 29, 'state': 'Karnataka'},
        {'code': 30, 'state': 'Goa'},
        {'code': 31, 'state': 'Lakshadweep'},
        {'code': 32, 'state': 'Kerala'},
        {'code': 33, 'state': 'Tamil Nadu'},
        {'code': 34, 'state': 'Pondicherry'},
        {'code': 35, 'state': 'Andaman & Nicobar Islands'},
        {'code': 36, 'state': 'Telangana'}
    ];
    var index = LibertyState.findIndex(x => x.state === stateName);
    if (index === -1) {
        return "";
    }
    return LibertyState[index]['code'];
    console.log('Liberty state_code', 'end');
};
LibertyVideoconHealth.prototype.is_valid_plan = function (lm_request, planCode) {
    console.log('LibertyVideoconHealth is_valid_plan', 'start');
    var index = -1;
    var Plans = [
        {'code': 421201, 'min_si': 200000, 'max_si': 750000},
        {'code': 421202, 'min_si': 99000, 'max_si': 1000000},
        {'code': 421203, 'min_si': 200000, 'max_si': 1500000},
        {'code': 421204, 'min_si': 99000, 'max_si': 1500000}
    ];
    index = Plans.findIndex(x => x.code === planCode
                && x.min_si < (lm_request['health_insurance_si'] - 0)
                && x.max_si >= (lm_request['health_insurance_si'] - 0));
    return (index > -1 ? true : false);
    console.log('LibertyVideoconHealth is_valid_plan', 'End');
};
module.exports = LibertyVideoconHealth;