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
var Health = require(appRoot + '/libs/CancerCare');
var config = require('config');
var fs = require('fs');
var moment = require('moment');

function RahejaQBECancerCare() {

}
util.inherits(RahejaQBECancerCare, Health);
RahejaQBECancerCare.prototype.insurer_date_format = 'dd/MM/yyyy';
RahejaQBECancerCare.prototype.const_insurer_suminsured = [100000, 200000, 300000, 400000, 500000, 700000, 800000, 1000000, 1500000, 2000000, 2500000, 3000000, 4000000, 6000000, 7500000, 10000000, 20000000, 30000000, 60000000];


RahejaQBECancerCare.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
RahejaQBECancerCare.prototype.insurer_product_field_process_pre = function () {
        if (this.lm_request['method_type'] === 'Premium') {
//        var args = {
//            "ProductPlan_Id": this.processed_request['___Plan_Id___'],
//            "NumberOfAdults": this.lm_request["adult_count"],
//            "NumberOfChildren": this.lm_request["child_count"],
//            "SumInsured": this.prepared_request["health_insurance_si"] - 0,
//            "Min_AgeOfEldestMember_Months": {$lte: this.lm_request["elder_member_age_in_months"]},
//            "Max_AgeOfEldestMember_Months": {$gt: max_month},
//            "Policy_Term_Year": this.lm_request["policy_tenure"]
//        };
        var args = {
            "ProductPlan_Id": 10011,
            "NumberOfAdults": 1,
            "NumberOfChildren": 0,
            "SumInsured": 500000,
            "Min_AgeOfEldestMember_Months": 216,
            "Max_AgeOfEldestMember_Months": 311,
            "Policy_Term_Year": 1
        };
        console.log("Premium-------------");
        console.log(args);
        this.method_content = JSON.stringify(args);
    }
    if (this.lm_request['method_type'] === 'Proposal') {
        this.prepared_request["area"] = this.lm_request["locality"];
        this.processed_request["___area___"] = this.prepared_request["area"];
        this.prepared_request["city"] = this.lm_request["district"];
        this.processed_request["___city___"] = this.prepared_request["city"];
        this.prepared_request["state"] = this.lm_request["communication_state"];
        this.processed_request["___state___"] = this.prepared_request["state"];

        this.prepared_request["addon_selected"] = this.get_addon_details();
        this.processed_request["___addon_selected___"] = this.prepared_request["addon_selected"];
        this.prepared_request["loan_amount"] = this.get_loan_amt(this.prepared_request['dbmaster_pb_plan_id']);
        this.processed_request["___loan_amount___"] = this.prepared_request["loan_amount"];

        var obj_si = this.health_insurance_si_2();
        this.prepared_request['health_insurance_si_2'] = obj_si;
        this.processed_request['___health_insurance_si_2___'] = this.prepared_request['health_insurance_si_2'];

        this.processed_request['___pan___'] = (this.prepared_request['pan']).toUpperCase();

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
    }
    if (this.lm_request['method_type'] === 'Verification') {
        this.method_content = this.insurer_master['service_logs']['pb_db_master']['Insurer_Request'];
    }
    if (this.lm_request['method_type'] === 'Pdf') {
        if (config.environment.name !== 'Production') {
            var obj_replace = {
                '"policyNum": "___policy_number___"': '"policyNum": "10368603"'
            };
            this.method_content = this.method_content.toString().replaceJson(obj_replace);
        }
    }
    console.log('insurer_product_field_process_pre');
};
RahejaQBECancerCare.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
RahejaQBECancerCare.prototype.insurer_product_field_process_post = function () {

};
RahejaQBECancerCare.prototype.insurer_product_api_post = function () {

};
RahejaQBECancerCare.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    console.log('service_call');
    try {
        var objInsurerProduct = this;
        if (specific_insurer_object.method.Method_Calling_Type === 'Database') {
            var args = JSON.parse(this.method_content);
//            args['ProductPlan_Id'] = docLog['Plan_Id'];
            var Cancer_Care_Health_Rate = require(appRoot + '/models/cancer_care_health_rate');
            Cancer_Care_Health_Rate.findOne(args, function (err, dbHealthRate) {
                console.log(dbHealthRate);
                if (dbHealthRate !== null) {
                    var objResponseFull = {
                        'err': err,
                        'result': dbHealthRate,
                        'raw': JSON.stringify(dbHealthRate),
                        'soapHeader': null,
                        'objResponseJson': dbHealthRate
                    };
                    objResponseFull['objResponseJson']['PlanId'] = docLog['Plan_Id'];
                    objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                }
            });
        } else {
            var objResponseFull = {
                'err': '',
                'result': '',
                'raw': '',
                'soapHeader': null,
                'objResponseJson': this.processed_request
            };
            var sleep = require('system-sleep');
            sleep(8000);
            objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};

RahejaQBECancerCare.prototype.premium_response_handler = function (objResponseJson) {
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
        if (objResponseJson !== null && objResponseJson.hasOwnProperty('_doc')) {
            var objPremiumService = objResponseJson['_doc'];
            if (objPremiumService.hasOwnProperty('Premium')) {
                var premium_breakup = this.get_const_premium_breakup();
                premium_breakup['service_tax'] = (objPremiumService['Premium'] - 0) * 0.18;
                premium_breakup['final_premium'] = objPremiumService['Premium'];
                premium_breakup['net_premium'] = premium_breakup['final_premium'] - premium_breakup['service_tax'];
                premium_breakup['tax']['CGST'] = premium_breakup['service_tax'] / 2;
                premium_breakup['tax']['SGST'] = premium_breakup['service_tax'] / 2;
                objServiceHandler.Premium_Breakup = premium_breakup;
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
RahejaQBECancerCare.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objPremiumService = objResponseJson;
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        /*
         var merchant_key = ((config.environment.name === 'Production') ? 'o7LxX9fJ' : 'BC50nb');
         var salt = ((config.environment.name === 'Production') ? 'c6ob2Q7Wb4' : 'Bwxo1cPe');
         var merchant_id = ((config.environment.name === 'Production') ? '6801124' : '4825050');
         var amount = (((config.environment.testing_ssid).indexOf(this.lm_request['ss_id']) > -1) ? '2' : this.lm_request['final_premium']);
         */if (Error_Msg === 'NO_ERR') {
            var merchant_key = 'BC50nb';
            var salt = 'Bwxo1cPe';
            var merchant_id = '4825050';
            var amount = this.lm_request['final_premium'];
            var productinfo = {paymentParts: [{name: 'splitId1', merchantId: merchant_id, value: amount, commission: '0.00', description: 'splitId1 summary'}]};
            var hashSequence = 'key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10';
            var str = hashSequence.split('|');
            var txnid = '765867';
//          var txnid = this.lm_request['crn'];
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
                    hash_string = hash_string + amount;
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
                'surl': this.const_payment.pg_ack_url, //'http://localhost:50111/Payment/Transaction_Status/', //
                'phone': this.lm_request['mobile'],
                'key': merchant_key,
                'hash': hash,
                'curl': this.const_payment.pg_ack_url, //'http://localhost:50111/Payment/Transaction_Status/', //
                'furl': this.const_payment.pg_ack_url, //'http://localhost:50111/Payment/Transaction_Status/', //
                'txnid': txnid,
                'productinfo': JSON.stringify(productinfo),
                'amount': amount,
                'email': this.lm_request['email'],
                'SALT': salt,
                'service_provider': "payu_paisa"
            };
            objServiceHandler.Payment.pg_data = pg_data;
            console.log("pg_data", pg_data);
            objServiceHandler.Payment.pg_redirect_mode = 'POST';
            objServiceHandler.Insurer_Transaction_Identifier = 'PB' + this.lm_request['crn'];
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.error('Exception', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
RahejaQBECancerCare.prototype.pg_response_handler = function () {
    try {
        console.log('Start', this.constructor.name, 'pg_response_handler');
        var output = this.const_payment_response.pg_post;
        this.const_policy.transaction_id = output['transactionRefNum'];
        if (output['uwDecision'] === "INFORCE") {
            this.const_policy.transaction_amount = this.insurer_master['service_logs']['pb_db_master']['Insurer_Response']['Envelope']['Body']['0']['createPolicyResponse']['0']['return']['0']['int-policy-data-iO']['0']['policy']['0']['premium']['0'];
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
RahejaQBECancerCare.prototype.verification_response_handler = function (objResponseJson) {
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
            var pdf_file_name = this.constructor.name + '_' + "Health" + '_' + this.const_policy.policy_number + '.pdf';
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
RahejaQBECancerCare.prototype.pdf_call = function (url, args, pdf_sys_loc) {
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
RahejaQBECancerCare.prototype.pdf_response_handler = function (objResponseJson) {
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
RahejaQBECancerCare.prototype.get_member_relation = function (i) {
    console.log(this.constructor.name, 'get_member_relation', ' Start ReligareHealth');
    var gender = this.lm_request['member_' + i + '_gender'];
    console.log("Gender in ReligareHealth " + gender);
    if (i >= 3) {
        return(gender === 'M' ? 'SONM' : 'UDTR');
    } else if (i === 1) {
        return 'SELF';
    } else if (i === 2) {
        return(gender === 'F' ? 'SPSE' : 'SPSE');
    }
    return '';
    console.log(this.constructor.name, 'get_member_relation', 'End ReligareHealth');
};
RahejaQBECancerCare.prototype.get_addon_details = function () {
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
RahejaQBECancerCare.prototype.get_loan_amt = function (plan_id) {
    var loan_amt = '';
    if (plan_id === 245 || plan_id === 260 || plan_id === 261 || plan_id === 262 || plan_id === 265 || plan_id === 266)
    {
        loan_amt = this.prepared_request['health_insurance_si'] * 5;
    }
    return loan_amt;
};
RahejaQBECancerCare.prototype.health_insurance_si_2 = function () {
    console.log('health_insurance_si_2', 'start');
    var mediclaim = [
        {'code': '051', 'ins_type': 'individual', 'sum_ins': 100000, 'sum_ins_type': 'care'},
        {'code': '052', 'ins_type': 'floater', 'sum_ins': 100000, 'sum_ins_type': 'care'},
        {'code': '053', 'ins_type': 'individual', 'sum_ins': 150000, 'sum_ins_type': 'care'},
        {'code': '054', 'ins_type': 'floater', 'sum_ins': 150000, 'sum_ins_type': 'care'},
        {'code': '055', 'ins_type': 'individual', 'sum_ins': 200000, 'sum_ins_type': 'care'},
        {'code': '056', 'ins_type': 'floater', 'sum_ins': 200000, 'sum_ins_type': 'care'},
        {'code': '057', 'ins_type': 'individual', 'sum_ins': 250000, 'sum_ins_type': 'care'},
        {'code': '058', 'ins_type': 'floater', 'sum_ins': 250000, 'sum_ins_type': 'care'},
        {'code': '059', 'ins_type': 'individual', 'sum_ins': 300000, 'sum_ins_type': 'care'},
        {'code': '060', 'ins_type': 'floater', 'sum_ins': 300000, 'sum_ins_type': 'care'},
        {'code': '061', 'ins_type': 'individual', 'sum_ins': 350000, 'sum_ins_type': 'care'},
        {'code': '062', 'ins_type': 'floater', 'sum_ins': 350000, 'sum_ins_type': 'care'},
        {'code': '063', 'ins_type': 'individual', 'sum_ins': 400000, 'sum_ins_type': 'care'},
        {'code': '064', 'ins_type': 'floater', 'sum_ins': 400000, 'sum_ins_type': 'care'},
        {'code': '065', 'ins_type': 'individual', 'sum_ins': 450000, 'sum_ins_type': 'care'},
        {'code': '066', 'ins_type': 'floater', 'sum_ins': 450000, 'sum_ins_type': 'care'},
        {'code': '067', 'ins_type': 'individual', 'sum_ins': 500000, 'sum_ins_type': 'care'},
        {'code': '068', 'ins_type': 'floater', 'sum_ins': 500000, 'sum_ins_type': 'care'},
        {'code': '069', 'ins_type': 'individual', 'sum_ins': 550000, 'sum_ins_type': 'care'},
        {'code': '070', 'ins_type': 'floater', 'sum_ins': 550000, 'sum_ins_type': 'care'},
        {'code': '071', 'ins_type': 'individual', 'sum_ins': 600000, 'sum_ins_type': 'care'},
        {'code': '072', 'ins_type': 'floater', 'sum_ins': 600000, 'sum_ins_type': 'care'},
        {'code': '073', 'ins_type': 'individual', 'sum_ins': 650000, 'sum_ins_type': 'care'},
        {'code': '074', 'ins_type': 'floater', 'sum_ins': 650000, 'sum_ins_type': 'care'},
        {'code': '075', 'ins_type': 'individual', 'sum_ins': 700000, 'sum_ins_type': 'care'},
        {'code': '076', 'ins_type': 'floater', 'sum_ins': 700000, 'sum_ins_type': 'care'},
        {'code': '077', 'ins_type': 'individual', 'sum_ins': 750000, 'sum_ins_type': 'care'},
        {'code': '078', 'ins_type': 'floater', 'sum_ins': 750000, 'sum_ins_type': 'care'},
        {'code': '079', 'ins_type': 'individual', 'sum_ins': 800000, 'sum_ins_type': 'care'},
        {'code': '080', 'ins_type': 'floater', 'sum_ins': 800000, 'sum_ins_type': 'care'},
        {'code': '081', 'ins_type': 'individual', 'sum_ins': 850000, 'sum_ins_type': 'care'},
        {'code': '082', 'ins_type': 'floater', 'sum_ins': 850000, 'sum_ins_type': 'care'},
        {'code': '083', 'ins_type': 'individual', 'sum_ins': 900000, 'sum_ins_type': 'care'},
        {'code': '084', 'ins_type': 'floater', 'sum_ins': 900000, 'sum_ins_type': 'care'},
        {'code': '085', 'ins_type': 'individual', 'sum_ins': 950000, 'sum_ins_type': 'care'},
        {'code': '086', 'ins_type': 'floater', 'sum_ins': 950000, 'sum_ins_type': 'care'},
        {'code': '087', 'ins_type': 'individual', 'sum_ins': 1000000, 'sum_ins_type': 'care'},
        {'code': '088', 'ins_type': 'floater', 'sum_ins': 1000000, 'sum_ins_type': 'care'},
        {'code': '089', 'ins_type': 'individual', 'sum_ins': 1500000, 'sum_ins_type': 'care'},
        {'code': '090', 'ins_type': 'floater', 'sum_ins': 1500000, 'sum_ins_type': 'care'},
        {'code': '091', 'ins_type': 'individual', 'sum_ins': 2000000, 'sum_ins_type': 'care'},
        {'code': '092', 'ins_type': 'floater', 'sum_ins': 2000000, 'sum_ins_type': 'care'},
        {'code': '093', 'ins_type': 'individual', 'sum_ins': 2500000, 'sum_ins_type': 'care'},
        {'code': '094', 'ins_type': 'floater', 'sum_ins': 2500000, 'sum_ins_type': 'care'},
        {'code': '095', 'ins_type': 'individual', 'sum_ins': 3000000, 'sum_ins_type': 'care'},
        {'code': '096', 'ins_type': 'floater', 'sum_ins': 3000000, 'sum_ins_type': 'care'},
        {'code': '097', 'ins_type': 'individual', 'sum_ins': 4000000, 'sum_ins_type': 'care'},
        {'code': '098', 'ins_type': 'floater', 'sum_ins': 4000000, 'sum_ins_type': 'care'},
        {'code': '099', 'ins_type': 'individual', 'sum_ins': 5000000, 'sum_ins_type': 'care'},
        {'code': '100', 'ins_type': 'floater', 'sum_ins': 5000000, 'sum_ins_type': 'care'},
        {'code': '101', 'ins_type': 'individual', 'sum_ins': 6000000, 'sum_ins_type': 'care'},
        {'code': '102', 'ins_type': 'floater', 'sum_ins': 6000000, 'sum_ins_type': 'care'},
        {'code': '103', 'ins_type': 'individual', 'sum_ins': 7500000, 'sum_ins_type': 'care'},
        {'code': '104', 'ins_type': 'floater', 'sum_ins': 7500000, 'sum_ins_type': 'care'},
        {'code': '105', 'ins_type': 'individual', 'sum_ins': 10000000, 'sum_ins_type': 'care'},
        {'code': '106', 'ins_type': 'floater', 'sum_ins': 10000000, 'sum_ins_type': 'care'},
        {'code': '109', 'ins_type': 'individual', 'sum_ins': 20000000, 'sum_ins_type': 'care'},
        {'code': '110', 'ins_type': 'floater', 'sum_ins': 20000000, 'sum_ins_type': 'care'},
        {'code': '111', 'ins_type': 'individual', 'sum_ins': 30000000, 'sum_ins_type': 'care'},
        {'code': '112', 'ins_type': 'floater', 'sum_ins': 30000000, 'sum_ins_type': 'care'},
        {'code': '113', 'ins_type': 'individual', 'sum_ins': 60000000, 'sum_ins_type': 'care'},
        {'code': '114', 'ins_type': 'floater', 'sum_ins': 60000000, 'sum_ins_type': 'care'}
    ];
    var index = mediclaim.findIndex(x => x.sum_ins === this.prepared_request['health_insurance_si'] - 0 && x.ins_type === this.lm_request['health_insurance_type']);
    if (index === -1) {
        return "";
    }
    return mediclaim[index]['code'];
    console.log('health_insurance_si_2', 'end');
};
RahejaQBECancerCare.prototype.getQuestionCode = function (code, type) {
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
RahejaQBECancerCare.prototype.getQuestionSet = function (code) {
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
RahejaQBECancerCare.prototype.premium_breakup_schema = {
    "addon": {
        "addon_dsi": 0,
        "addon_uar": 0,
        "addon_ncb": 0,
        "addon_pa": 0,
        "addon_final_premium": 0
    },
    "tax": {
        "CGST": 0,
        "SGST": 0,
        "IGST": 0,
        "UGST": 0
    },
    "net_premium": 0,
    "service_tax": 0,
    "final_premium": 0
};
module.exports = RahejaQBECancerCare;





