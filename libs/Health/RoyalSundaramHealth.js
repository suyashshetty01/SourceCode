/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var util = require('util');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var Health = require(appRoot + '/libs/Health');
var config = require('config');
function RoyalSundaramHealth() {

}
util.inherits(RoyalSundaramHealth, Health);
RoyalSundaramHealth.prototype.lm_request_single = {};
RoyalSundaramHealth.prototype.insurer_integration = {};
RoyalSundaramHealth.prototype.insurer_addon_list = [];
RoyalSundaramHealth.prototype.insurer = {};
RoyalSundaramHealth.prototype.insurer_date_format = 'dd/MM/yyyy';
RoyalSundaramHealth.prototype.const_insurer_suminsured = [100000, 150000, 200000, 250000, 300000, 350000, 400000, 450000, 500000];
RoyalSundaramHealth.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
RoyalSundaramHealth.prototype.insurer_product_field_process_pre = function () {
    var member = 1;
    var adult = this.lm_request['adult_count'];
    var child = this.lm_request['child_count'];
    var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
    var txt_replace_with = "";
    if (this.lm_request['method_type'] === 'Premium') {
        this.processed_request['___first_name___'] = this.prepared_request['first_name'] === "" ? this.randomName(8) : this.prepared_request['first_name'];

        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";
//        this.processed_request['___dbmaster_pb_state_name___'] = this.processed_request['___dbmaster_pb_state_name___'].toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
        for (member = 1; member <= adult; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
            if (member === 1) {
                this.processed_request['___member_' + member + '_first_name___'] = this.processed_request['___first_name___'];
            } else {
                this.processed_request['___member_' + member + '_first_name___'] = this.prepared_request['member_' + member + '_first_name'] === "" ? this.randomName(8) : this.prepared_request['member_' + member + '_first_name'];
            }
        }
        for (member = 3; member <= child + 2; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
            this.processed_request['___member_' + member + '_first_name___'] = this.prepared_request['member_' + member + '_first_name'] === "" ? this.randomName(8) : this.prepared_request['member_' + member + '_first_name'];
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
    }

    if (this.lm_request['method_type'] === 'Customer') {
        this.prepared_request['quoteId'] = this.insurer_master['service_logs']['insurer_db_master']['Insurer_Response']['quoteId'];
        this.processed_request['___quoteId___'] = this.prepared_request['quoteId'];
        this.processed_request['___gender___'] = (this.prepared_request['gender'] === 'M') ? 'Male' : (this.lm_request['gender'] === 'F' ? 'Female' : 'Third');
        this.processed_request['___nominee_state_name___'] = this.prepared_request['nominee_state_name'] = this.lm_request['nominee_state_name'];
        this.processed_request['___coveredAllChild___'] = this.prepared_request['coveredAllChild'] = (child === 0) ? '' : this.lm_request['coveredAllChild'];
        this.processed_request['___tpa_name___'] = this.prepared_request['tpa_name'] = this.lm_request['tpa_name_text'];
        this.processed_request['___nominee_address2___'] = '';
        var nomi_addrs = this.processed_request['___nominee_address___'];
        if (nomi_addrs.length > 40) {
            var index = nomi_addrs.substring(0, 40).lastIndexOf(' ');
            this.processed_request['___nominee_address2___'] = nomi_addrs.slice(index + 1, nomi_addrs.length);
            this.processed_request['___nominee_address___'] = nomi_addrs.slice(0, index);
        }
        this.processed_request['___nominee_city_name___'] = this.lm_request['nominee_city_name'];
        this.processed_request['___nominee_pincode___'] = this.lm_request['nominee_pincode'];

        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";
        for (member = 1; member <= adult; member++) {
            txt_replace_with === "" ? txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member) : txt_replace_with += "," + txt_replace.replaceAll('___member_array', '___member_' + member);
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
            var additnl_med_block = this.med_question(member);
            txt_replace_with = txt_replace_with.replace('<!--___member_' + member + '_additional_medquestn-->', additnl_med_block);
        }
        for (member = 3; member <= child + 2; member++) {
            txt_replace_with === "" ? txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member) : txt_replace_with += "," + txt_replace.replaceAll('___member_array', '___member_' + member);
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
            var additnl_med_block = this.med_question(member);
            txt_replace_with = txt_replace_with.replace('<!--___member_' + member + '_additional_medquestn-->', additnl_med_block);
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
    }
    this.method_content = this.method_content.replaceAll(/<!--(.*?)-->/g, "");
};
RoyalSundaramHealth.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

    var product_id = objProduct.db_specific_product.Product_Id;
    var insurer_id = Insurer_Object.Insurer_ID;
    var error_msg = 'NO_ERROR';
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
RoyalSundaramHealth.prototype.insurer_product_field_process_post = function () {

};
RoyalSundaramHealth.prototype.insurer_product_api_post = function () {

};
RoyalSundaramHealth.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
//    console.log('service_call');
    try {
        let objInsurerProduct = this;
        let body = docLog.Insurer_Request;
        let Client = require('node-rest-client').Client;
        let client = new Client();
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
        var args = {
            data: body,
            headers: {
                "Content-Type": "application/json"
            }
        };
        client.post(specific_insurer_object.method_file_url, args, function (data, response) {
//            console.log(response.statusCode);
            let objData = JSON.stringify(data);
            let objResponseFull = {
                'err': null,
                'result': objData,
                'raw': objData,
                'soapHeader': null,
                'objResponseJson': JSON.parse(objData)
            };
            objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
        });
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};
RoyalSundaramHealth.prototype.premium_response_handler = function (objResponseJson) {
//    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        var objPremiumService = objResponseJson;
        objResponseJson.hasOwnProperty('result') ?
                Error_Msg = (objResponseJson['result']['Success'] === true && objResponseJson['data'] !== null) ? 'NO_ERR' : objResponseJson['result']['message']
                : Error_Msg = 'LM_EMPTY_result';
        if (Error_Msg === 'NO_ERR')
        {
            var premium_breakup = this.get_const_premium_breakup();
            premium_breakup['final_premium'] = objPremiumService["data"]["annualFinalPremium"];
            premium_breakup['net_premium'] = (premium_breakup['final_premium'] / 1.18).toFixed(2);
            premium_breakup['tax']['CGST'] = objPremiumService["data"]["annualCGST"];
            premium_breakup['tax']['SGST'] = objPremiumService["data"]["annualSGST"];
            premium_breakup['tax']['IGST'] = objPremiumService["data"]["annualIGST"];
            premium_breakup['tax']['UTGST'] = objPremiumService["data"]["annualUTGST"];
            premium_breakup['service_tax'] = Math.round(premium_breakup['final_premium'] - premium_breakup['net_premium']);
            objServiceHandler.Premium_Breakup = premium_breakup;
            objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['quoteId'];
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
RoyalSundaramHealth.prototype.customer_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'customer_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Customer': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson.hasOwnProperty('result')) {
            if (objResponseJson['result']['Success'] === true && objResponseJson['data'] !== null) {
                var proposal_amt = parseInt(objResponseJson['data']['annualFinalPremium']);
                var prm_diff = proposal_amt > this.lm_request['final_premium'] ? proposal_amt - this.lm_request['final_premium'] : this.lm_request['final_premium'] - proposal_amt;
                if (prm_diff >= 5) {
                    Error_Msg = "LM_Premium_Mismatch";
                }
            } else {
                if (objResponseJson.result.hasOwnProperty('validationErrors')) {
                    var validatnErr = objResponseJson['result']['validationErrors'];
                    var ques_no = [];
                    var objno = {'E-0115': 8, 'E-0116': 7, 'E-0118': 10, 'E-0119': 9, 'E-0121': 12, 'E-0122': 11, 'E-0124': 14, 'E-0125': 13};
                    Error_Msg = JSON.stringify(validatnErr) + '\n';
                    for (var i in validatnErr) {
                        if (['E-0115', 'E-0118', 'E-0121', 'E-0124', 'E-0116', 'E-0119', 'E-0122', 'E-0125'].includes(i)) {
                            ques_no.push(objno[i]);
                        }
                        if (['E-0128'].includes(i)) {
                            Error_Msg += '\u2726 ' + "For Child, Month Of Diagnosis is invalid" + Array(5).fill('\xa0').join('');
                        }
                        if (['E-0129'].includes(i)) {
                            Error_Msg += '\u2726 ' + "For Child, Year Of Diagnosis is invalid" + Array(5).fill('\xa0').join('');
                        }
                        if (['E-0145'].includes(i)) {
                            Error_Msg += '\u2726 ' + "Additional Medical Question are mandatory." + Array(35).fill('\xa0').join('');
                        }
                        if (['E-0063'].includes(i)) {
                            Error_Msg += '\u2726 ' + "Nominee address length cannot exceed 80 characters. Please update and submit." + Array(35).fill('\xa0').join('');
                        }
                    }
                    Error_Msg += (ques_no.length === 1) ? "\u2726 " + "Medical Question No.( " + ques_no + " ) is mandatory/invalid. " + Array(28).fill('\xa0').join('') : (ques_no.length > 1) ? "\n" + "\u2726 " + "Medical Question No.( " + ques_no.sort((a, b) => a - b) + " ) are mandatory/invalid. " + Array(25).fill('\xa0').join('') : '';
                }
            }
        } else {
            Error_Msg = 'LM_MSG:PROPOSAL_MAIN_NODE_MISSING';
        }
        if (Error_Msg === 'NO_ERR') {
            var Customer = {
                'insurer_customer_identifier': objResponseJson['data']['clientCode'],
                'insurer_customer_identifier_2': objResponseJson['quoteId'],
                'insurer_customer_identifier_3': objResponseJson['data']['referralStatus'] === 'NON-STP' ? 'NONSTP' : 'STP',
                'final_premium_verified': objResponseJson['data']['annualFinalPremium']
            };
            objServiceHandler.Customer = Customer;
            objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['quoteId'];
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
RoyalSundaramHealth.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        objResponseJson.hasOwnProperty('result') ?
                Error_Msg = (objResponseJson['result']['Success'] === true && objResponseJson['data'] !== null) ? 'NO_ERR' : objResponseJson['result']['message']
                : Error_Msg = 'LM_EMPTY_result';
        if (Error_Msg === 'NO_ERR') {
            var pg_data = {
                'reqType': 'JSON',
                'process': 'paymentOption',
                'apikey': this.prepared_request['insurer_integration_service_password'],
                'agentId': this.prepared_request['insurer_integration_service_user'],
                'premium': this.processed_request['___final_premium_verified___'],
                'quoteId': objResponseJson['data']['QuoteId'],
                'version_no': '12345',
                'strFirstName': this.lm_request['first_name'],
                'strEmail': this.lm_request['email'],
                'strMobileNo': this.lm_request['mobile'],
                'isQuickRenew': '',
                'crossSellProduct': '',
                'crossSellQuoteid': '',
                'returnUrl': this.const_payment.pg_ack_url,
                'paymentType': 'PAYTM'
            };
            objServiceHandler.Payment.pg_data = pg_data;
            objServiceHandler.Payment.pg_redirect_mode = 'POST';
            objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['data']['QuoteId'];
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
RoyalSundaramHealth.prototype.pg_response_handler = function () {
    try {
        console.log('Start', this.constructor.name, 'pg_response_handler');
        var output = this.const_payment_response.pg_post;
        if (output.hasOwnProperty('status') && output['status'] === 'success') {
            this.const_policy.transaction_amount = output['premium'];
            this.const_policy.policy_number = output['policyNO'];
            this.const_policy.transaction_id = output['transactionNumber'];
            this.const_policy.pg_reference_number_1 = output['quoteId'];
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.transaction_status = 'SUCCESS';
        } else {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
        console.error('End', this.constructor.name, 'pg_response_handler', this.const_policy);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
RoyalSundaramHealth.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (this.const_policy.transaction_status === 'SUCCESS') {//transaction success
            if (this.const_policy.policy_number !== '') {
                this.const_policy.transaction_substatus = "IF";
                var pdf_file_name = this.constructor.name + '_Health_' + this.const_policy.policy_number + '.pdf';
                var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                this.const_policy.policy_url = pdf_web_path_portal;
            } else {
                this.const_policy.transaction_substatus = 'UW';
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
RoyalSundaramHealth.prototype.pdf_response_handler = function () {

};
RoyalSundaramHealth.prototype.med_question = function (mem) {
    var i = 1;
    var additnl_info = [];
    var additnl_med = '';
    for (; ; ) {
        if (i > 16) {
            break;
        }
        let questn_no = 'member_' + mem + '_question_' + i;
        this.prepared_request[questn_no + '_details'] = this.lm_request[questn_no + '_details'] === false ? 'No' : 'Yes';
        this.processed_request['___' + questn_no + '_details' + '___'] = this.prepared_request[questn_no + '_details'];
        if (i < 3) {
            if (this.lm_request['member_' + mem + '_additionalQue_' + i] === 'yes') {
                let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                var month_no = (1 + months.indexOf(this.lm_request['member_' + mem + '_additionalQue_' + i + '_subQue_2_month_text']));
                month_no = ('0' + month_no).slice(-2);
                additnl_info.push({medicationDetail: this.lm_request['member_' + mem + '_additionalQue_' + i + '_subQue_3_text'],
                    monthOfDiagnosis: month_no,
                    nameOfIllness: this.lm_request['member_' + mem + '_additionalQue_' + i + '_subQue_1'],
                    treatmentOutCome: this.lm_request['member_' + mem + '_additionalQue_' + i + '_subQue_4_text'],
                    yearOfDiagnosis: this.lm_request['member_' + mem + '_additionalQue_' + i + '_subQue_2_year_text']});
            }
        }
        if (i > 6) {
            this.prepared_request[questn_no + '_info'] = (this.lm_request[questn_no + '_type'] === 'since') ? this.lm_request[questn_no + '_details'] : '';
            this.processed_request['___' + questn_no + '_info' + '___'] = this.prepared_request[questn_no + '_info'];
        }
        i++;
    }
    if (additnl_info.length > 0) {
        let obj = {"additionMedicalDetails": {"additionMedicalQuestionInfo": additnl_info}};
        let pretyobj = JSON.stringify(obj, null, 3);
        additnl_med = ',' + pretyobj.substring(1, pretyobj.length - 1);
//        console.log(additnl_med);
    }
    return additnl_med;
};
RoyalSundaramHealth.prototype.get_member_relation = function (i) {
    console.log(this.constructor.name, 'get_member_relation', ' Start RoyalSundaramHealth');
    this.prepared_request['member_' + i + '_insuredtype'] = (i > 2) ? "Child" : "Adult";
    this.processed_request['___member_' + i + '_insuredtype___'] = this.prepared_request['member_' + i + '_insuredtype'];
    var gender = this.lm_request['member_' + i + '_gender'];
    this.processed_request['___member_' + i + '_gender___'] = (gender === "M") ? "Male" : (gender === "F" ? "Female" : "Third");
    console.log("Gender in RoyalSundaramHealth " + gender);
    var relation = this.prepared_request["relation"];
    if (relation === 'Mother' || relation === 'Father') {
        return((gender === 'M' || gender === 'TM') ? 'Son' : 'Daughter');
    }
    if (relation === 'Son' || relation === 'Daughter') {
        return((gender === 'M' || gender === 'TM') ? 'Father' : 'Mother');
    }
    if (relation === 'Wife') {
        return 'Wife';
    }
    if (relation === 'Self' || relation === '') {
        if (i >= 3) {
            return((gender === 'M' || gender === 'TM') ? 'Son' : 'Daughter');
        } else if (i === 1) {
            return 'Self';
        } else if (i === 2) {
            return 'Spouse';
        }
    }
    return '';
    console.log(this.constructor.name, 'get_member_relation', 'End RoyalSundaramHealth');
};
RoyalSundaramHealth.prototype.is_valid_plan = function (lm_request, planCode) {
    console.log('RoyalSundaramHealth is_valid_plan', 'start');
    return (lm_request['member_1_age'] > 65 ? false : true);
    console.log('RoyalSundaramHealth is_valid_plan', 'End');
};
RoyalSundaramHealth.prototype.premium_breakup_schema = {
    "final_premium": "GrossPremium",
    "net_premium": "NetPremium",
    "service_tax": 0,
    "tax": {
        "CGST": "CGST",
        "SGST": "SGST",
        "IGST": "IGST",
        "UGST": "UTGST"
    }
};
module.exports = RoyalSundaramHealth;