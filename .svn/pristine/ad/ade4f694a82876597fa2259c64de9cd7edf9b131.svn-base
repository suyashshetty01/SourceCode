/* Author : Roshani Prajapati
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var util = require('util');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var Cyber = require(appRoot + '/libs/CyberSecurity');
var moment = require('moment');
var config = require('config');
var fs = require('fs');
function BajajAllianzCyber() {

}
util.inherits(BajajAllianzCyber, Cyber);
BajajAllianzCyber.prototype.insurer_date_format = 'DD-MMM-YYYY';
BajajAllianzCyber.prototype.const_insurer_suminsured = [100000, 300000, 500000, 1000000, 1500000, 2000000, 2500000, 5000000, 7500000, 10000000];
BajajAllianzCyber.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
BajajAllianzCyber.prototype.insurer_product_field_process_pre = function () {
    this.prepared_request["si_code"] = this.sum_insured_code(this.prepared_request['cs_insurance_si']);
    this.processed_request["___si_code___"] = this.prepared_request["si_code"];
    if (this.lm_request['method_type'] === 'Proposal') {
        this.processed_request['___pan___'] = this.prepared_request['pan'] !== null ? (this.prepared_request['pan']).toUpperCase() : '';
        this.prepared_request["gst_no"] = this.lm_request['gstNumber'];
        this.processed_request["___gst_no___"] = this.prepared_request["gst_no"];
        this.prepared_request["state"] = this.lm_request["state"];
        this.processed_request["___state___"] = this.prepared_request["state"];
        this.processed_request['___policy_end_date___'] = this.expiry_date(this.prepared_request["policy_end_date"]);
        var lost_history = this.lost_history_ques();
        this.method_content = this.method_content.replace('<!--___medquestn-->', lost_history);
    }
    console.log('insurer_product_field_process_pre');
};
BajajAllianzCyber.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

    var obj_response_handler;
    if (specific_insurer_object.method.Method_Type === 'Premium') {
        obj_response_handler = this.premium_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Proposal') {
        obj_response_handler = this.proposal_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Verification') {
        obj_response_handler = this.verification_response_handler(objResponseJson);
    }
    return obj_response_handler;
};
BajajAllianzCyber.prototype.insurer_product_field_process_post = function () {

};
BajajAllianzCyber.prototype.insurer_product_api_post = function () {

};
BajajAllianzCyber.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    console.log('service_call');
    try {
        var objInsurerProduct = this;
        console.log(docLog.Insurer_Request);
        var body = docLog.Insurer_Request;
        var Client = require('node-rest-client').Client;
        var client = new Client();
        console.log('Rquest:' + body);
        var args = {
            data: body,
            headers: {
                "Content-Type": "application/json"
            }
        };
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
            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
        });
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};
BajajAllianzCyber.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson['errorlist']['length'] !== 0) {
            Error_Msg = objResponseJson['errorlist'][0]['errtext'];
        } else if (objResponseJson.hasOwnProperty('cbspoldtlobj')) {
            if (objResponseJson['cbspoldtlobj']['planpremium'] === "null") {
                Error_Msg = "LM_MAIN_MISSING_NODE_NA";
            }
        }
        if (Error_Msg === "NO_ERR") {
            var premium_breakup = this.get_const_premium_breakup();
            premium_breakup['net_premium'] = parseInt(objResponseJson['cbspoldtlobj']['planpremium']);
            premium_breakup['service_tax'] = premium_breakup['net_premium'] * 0.18;
            premium_breakup['final_premium'] = Math.round(premium_breakup['net_premium'] + premium_breakup['service_tax']);
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
BajajAllianzCyber.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson['errorcode'] !== 0) {
            Error_Msg = objResponseJson['errorlist'][0]['errtext'];
        } else if (objResponseJson['errorlist']['length'] !== 0) {
            Error_Msg = objResponseJson['errorlist'][0]['errtext'];
        }
        if (Error_Msg === 'NO_ERR') {
            var merchant_key = ((config.environment.name === 'Production') ? '' : 'BC50nb');
            var salt = ((config.environment.name === 'Production') ? '' : 'Bwxo1cPe');
            var merchant_id = ((config.environment.name === 'Production') ? '' : '4825050');
            var productinfo = {paymentParts: [{name: 'splitId1', merchantId: merchant_id, value: this.lm_request['final_premium'], commission: '0.00', description: 'splitId1 summary'}]};
            var hashSequence = 'key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10';
            var str = hashSequence.split('|');
            var txnid = objResponseJson['transid'];
            var return_url = this.const_payment.pg_ack_url;
            var hash_string = '';
            for (var hash_var in str) {
                if (str[hash_var] === "key")
                {
                    hash_string = hash_string + merchant_key;
                    hash_string = hash_string + '|';
                } else if (str[hash_var] === "txnid")
                {
                    hash_string = hash_string + txnid;
                    hash_string = hash_string + '|';
                } else if (str[hash_var] === "amount")
                {
                    hash_string = hash_string + this.lm_request['final_premium'];
                    hash_string = hash_string + '|';
                } else if (str[hash_var] === "productinfo")
                {
                    hash_string = hash_string + JSON.stringify(productinfo);
                    hash_string = hash_string + '|';
                } else if (str[hash_var] === "firstname")
                {
                    hash_string = hash_string + this.lm_request['first_name'];
                    hash_string = hash_string + '|';
                } else if (str[hash_var] === "email")
                {
                    hash_string = hash_string + this.lm_request['email'];
                    hash_string = hash_string + '|';
                } else
                {
                    hash_string = hash_string + '';
                    hash_string = hash_string + '|';
                }
            }
            hash_string = hash_string + salt;
            var hash = this.convert_to_sha512(hash_string).toLowerCase();
            var pg_data = {
                'firstname': this.lm_request['first_name'],
                'lastname': this.lm_request['last_name'],
                'surl': return_url,
                'phone': this.lm_request['mobile'],
                'key': merchant_key,
                'hash': hash,
                'curl': return_url,
                'furl': return_url,
                'txnid': txnid,
                'productinfo': JSON.stringify(productinfo),
                'amount': this.lm_request['final_premium'],
                'email': this.lm_request['email'],
                'service_provider': "payu_paisa"
            };
            objServiceHandler.Payment.pg_data = pg_data;
            objServiceHandler.Payment.pg_redirect_mode = 'POST';
            objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['transid'];
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
BajajAllianzCyber.prototype.pg_response_handler = function () {
    try {
        console.log('Start', this.constructor.name, 'pg_response_handler');
        var output = this.const_payment_response.pg_post;
        if (output['status'] === 'success') {
            this.const_policy.transaction_amount = output['amount'];
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.transaction_status = 'SUCCESS';
            this.const_policy.pg_reference_number_1 = output['addedon'];
            this.const_policy.pg_reference_number_2 = output['mihpayid'];
            this.const_policy.transaction_id = (JSON.parse(output['payuMoneyId'])['splitIdMap'][0]['splitPaymentId']).toString();
        } else {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
        console.error('End', this.constructor.name, 'pg_response_handler', this.const_policy);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
BajajAllianzCyber.prototype.verification_response_handler = function (objResponseJson) {
    console.error('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (this.const_policy.pg_status === 'FAIL') {

        }
        if (this.const_policy.pg_status === 'SUCCESS') {
            if (objResponseJson['errorcode'] !== 0) {
                if (objResponseJson['errormsg'] === null) {
//                    Error_Msg = "ERROR IN POLICY NUMBER GENERATION";
                } else {
                    Error_Msg = objResponseJson['errormsg'];
                }
            }
            if (Error_Msg === 'NO_ERR') {
                this.const_policy.transaction_status = 'SUCCESS';
                this.const_policy.policy_number = objResponseJson['ppolicyref_out'];
                if (this.const_policy.policy_number !== '' && this.const_policy.policy_number !== null && this.const_policy.policy_number !== undefined) {
                    this.const_policy.transaction_substatus = "IF";
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
BajajAllianzCyber.prototype.lost_history_ques = function () {
    var arr_questnId = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
    let lostQuestn = '';
    for (i = 0; i <= arr_questnId.length - 1; i++) {
        var questionText = this.question_text(arr_questnId[i]);
        if (this.prepared_request['member_' + 1 + '_question_' + arr_questnId[i] + '_details'] !== false) {
            if ([0, 1, 3].indexOf(i) === -1) {
                this.prepared_request['question_answer'] = "1";
                lostQuestn === '' ? lostQuestn = "\n\t\t" + '{"questionid": "' + arr_questnId[i] + '","questiontext": "' + questionText + '","ansfieldtype": "TEXTBOX","answer": "' + this.prepared_request['question_answer'] + '", "remarks": "' + this.prepared_request['member_' + 1 + '_question_' + arr_questnId[i] + '_details'] + '"}'
                        : lostQuestn += ",\n\t\t" + '{"questionid": "' + arr_questnId[i] + '","questiontext": "' + questionText + '","ansfieldtype": "TEXTBOX","answer": "' + this.prepared_request['question_answer'] + '", "remarks": "' + this.prepared_request['member_' + 1 + '_question_' + arr_questnId[i] + '_details'] + '"}';
            } else {
                this.prepared_request['question_answer'] = "1";
                lostQuestn === '' ? lostQuestn = "\n\t\t" + '{"questionid": "' + arr_questnId[i] + '","questiontext": "' + questionText + '","ansfieldtype": "TEXTBOX","answer": "' + this.prepared_request['question_answer'] + '", "remarks": "null"}'
                        : lostQuestn += ",\n\t\t" + '{"questionid": "' + arr_questnId[i] + '","questiontext": "' + questionText + '","ansfieldtype": "TEXTBOX","answer": "' + this.prepared_request['question_answer'] + '", "remarks": "null"}';
            }
        } else {
            this.prepared_request['question_answer'] = "0";
            lostQuestn === '' ? lostQuestn = "\n\t\t" + '{"questionid": "' + arr_questnId[i] + '","questiontext": "' + questionText + '","ansfieldtype": "TEXTBOX","answer": "' + this.prepared_request['question_answer'] + '", "remarks": "null"}'
                    : lostQuestn += ",\n\t\t" + '{"questionid": "' + arr_questnId[i] + '","questiontext": "' + questionText + '","ansfieldtype": "TEXTBOX","answer": "' + this.prepared_request['question_answer'] + '", "remarks": "null"}';
        }
    }
    return lostQuestn;
};
BajajAllianzCyber.prototype.question_text = function (id) {
    console.log('BajajAllianzCyber question_text', 'start');
    var index = -1;
    var question_text = -1;
    var Ques_Text = [
        {'code': "1", 'questText': "Do you actively implement best practices of network security recommended by the service provider?"},
        {'code': "2", 'questText': "Do you have an updated anti-virus software as recommended by the service provider?"},
        {'code': "3", 'questText': "For all your digital devices, do you maintain a regular backup of data on the cloud or an external device?"},
        {'code': "4", 'questText': "In the past, have you been a victim of security threats covered under this policy?"},
        {'code': "5", 'questText': "I have been a victim of (Cyber Identity Theft)"},
        {'code': "6", 'questText': "I have been a victim of (Cyber Stalking)"},
        {'code': "7", 'questText': "I have been a victim of (IT Theft)."},
        {'code': "8", 'questText': "I have been a victim of (Malware Attack)."},
        {'code': "9", 'questText': "I have been a victim of (Phishing or E-mail spoofing)."},
        {'code': "10", 'questText': "I have been a victim of (Media wrongful act)."},
        {'code': "11", 'questText': "I have been a victim of (Data breach or privacy breach)."}
    ];
    index = Ques_Text.findIndex(x => x.code === id);
    question_text = (index === -1 ? '' : Ques_Text[index]['questText']);
    return question_text;
    console.log('BajajAllianzCyber question_text', 'End');
};
BajajAllianzCyber.prototype.expiry_date = function (date) {
    console.log('Start', this.constructor.name, 'policy_expiry_date');
    var pol_end_date = moment(date).subtract(1, 'd').format('DD-MMM-YYYY');
    console.log('Finish', this.constructor.name, 'expiry_date', pol_end_date);
    return pol_end_date;
};
BajajAllianzCyber.prototype.sum_insured_code = function (sum_insured) {
    console.log('BajajAllianzCyber sum_insured_code', 'start');
    var index = -1;
    var get_si_code = -1;
    var BAJAJ_Plans = [
        {'code': "P1", 'si': 100000, 'policy_type': 'individual'},
        {'code': "P2", 'si': 300000, 'policy_type': 'individual'},
        {'code': "P3", 'si': 500000, 'policy_type': 'individual'},
        {'code': "P4", 'si': 1000000, 'policy_type': 'individual'},
        {'code': "P5", 'si': 1500000, 'policy_type': 'individual'},
        {'code': "P6", 'si': 2000000, 'policy_type': 'individual'},
        {'code': "P7", 'si': 2500000, 'policy_type': 'individual'},
        {'code': "P8", 'si': 5000000, 'policy_type': 'individual'},
        {'code': "P9", 'si': 7500000, 'policy_type': 'individual'},
        {'code': "P10", 'si': 10000000, 'policy_type': 'individual'}
    ];
    index = BAJAJ_Plans.findIndex(x => x.si === (sum_insured));
    get_si_code = (index === -1 ? '' : BAJAJ_Plans[index]['code']);
    return get_si_code;
    console.log('BajajAllianzCyber sum_insured_code', 'End');
};
module.exports = BajajAllianzCyber;