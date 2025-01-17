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
var sleep = require('system-sleep');
function RahejaQBEHealth() {

}
util.inherits(RahejaQBEHealth, Health);
RahejaQBEHealth.prototype.lm_request_single = {};
RahejaQBEHealth.prototype.insurer_integration = {};
RahejaQBEHealth.prototype.insurer_addon_list = [];
RahejaQBEHealth.prototype.insurer = {};
RahejaQBEHealth.prototype.insurer_date_format = 'MM/dd/yyyy';
RahejaQBEHealth.prototype.const_insurer_suminsured = [100000, 150000, 200000, 250000, 300000, 350000, 400000, 450000, 500000, 600000, 700000, 800000, 900000, 1000000, 1500000, 2000000, 2500000, 3000000, 4000000, 5000000];
RahejaQBEHealth.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
RahejaQBEHealth.prototype.insurer_product_field_process_pre = function () {
    var member = 1;
    var adult = this.lm_request['adult_count'];
    var child = this.lm_request['child_count'];
    this.prepared_request['suminsured_type'] = (this.lm_request['member_count'] === 1) ? 'Individual' : 'Family Floater';
    this.processed_request['___suminsured_type___'] = this.prepared_request['suminsured_type'];
    this.prepared_request['get_member_type'] = this.get_member_type(adult, child);
    this.processed_request['___get_member_type___'] = this.prepared_request['get_member_type'];
    this.prepared_request['intermediary_code'] = ((config.environment.name === 'Production') ? '2101426' : '01000074');
    this.processed_request['___intermediary_code___'] = this.prepared_request['intermediary_code'];
    this.prepared_request['instrument_number'] = this.timestamp();
    this.processed_request['___instrument_number___'] = this.prepared_request['instrument_number'];
    var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
    var txt_replace_with = "";

    if (this.lm_request['method_type'] === 'Premium') {
        if (this.prepared_request['Plan_Id'] === 100002) {
            var args = {
                "ProductPlan_Id": this.processed_request['___Plan_Id___'],
                "NumberOfAdults": this.lm_request['adult_count'],
                "NumberOfChildren": this.lm_request['child_count'],
                "SumInsured": this.lm_request["health_insurance_si"] - 0,
                "Min_AgeOfEldestMember_Months": {$lte: this.lm_request["elder_member_age_in_months"]},
                "Max_AgeOfEldestMember_Months": {$gt: this.lm_request["elder_member_age_in_months"]},
                "Policy_Term_Year": this.lm_request["policy_tenure"]
            };
            this.method_content = JSON.stringify(args);
        } else {
            this.prepared_request['product_code'] = this.prepared_request['Plan_Id'] === 100002 ? "4213" : "4218";
            this.processed_request['___product_code___'] = this.prepared_request['product_code'];
            for (member = 1; member <= adult; member++) {
                txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
                this.prepared_request['salutation'] = this.lm_request['member_' + member + '_gender'] === "M" ? "Mr" : "Miss";
                this.processed_request['___member_' + member + '_salutation___'] = this.prepared_request['salutation'];
                this.prepared_request['member_' + member + '_inc'] = member;
                this.processed_request['___member_' + member + '_inc___'] = member;
                this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
                this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
                this.prepared_request['member_' + member + '_si'] = this.prepared_request['health_insurance_si'];
                this.processed_request['___member_' + member + '_si___'] = this.prepared_request['health_insurance_si'];
            }
            for (member = 3; member <= child + 2; member++) {
                txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
                this.prepared_request['salutation'] = this.lm_request['member_' + member + '_gender'] === "M" ? "Mr" : "Miss";
                this.processed_request['___member_' + member + '_salutation___'] = this.prepared_request['salutation'];
                this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
                this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
                this.prepared_request['member_' + member + '_si'] = this.prepared_request['health_insurance_si'];
                this.processed_request['___member_' + member + '_si___'] = this.prepared_request['health_insurance_si'];
                (adult === 1) ? this.prepared_request['member_' + member + '_inc'] = member - 1 : this.prepared_request['member_' + member + '_inc'] = member;
                this.processed_request['___member_' + member + '_inc___'] = this.prepared_request['member_' + member + '_inc'];
            }
        }
    }

    if (this.lm_request['method_type'] === 'Proposal') {
        this.prepared_request['product_code'] = this.prepared_request['dbmaster_pb_plan_id'] === 100002 ? "4213" : "4218";
        this.processed_request['___product_code___'] = this.prepared_request['product_code'];
        this.prepared_request['total_premium'] = this.insurer_master['service_logs']['pb_db_master']['Premium_Breakup']['final_premium'];
        this.processed_request['___total_premium___'] = this.prepared_request['total_premium'];
        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";
        for (member = 1; member <= adult; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.prepared_request['member_' + member + '_inc'] = member;
            this.processed_request['___member_' + member + '_inc___'] = member;
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
            this.prepared_request['member_' + member + '_si'] = this.prepared_request['health_insurance_si'];
            this.processed_request['___member_' + member + '_si___'] = this.prepared_request['health_insurance_si'];
            var medQuestn_block = this.med_question(member);
            txt_replace_with = txt_replace_with.replace('<!--___member_' + member + '_medquestn-->', medQuestn_block);
        }
        for (member = 3; member <= child + 2; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
            this.prepared_request['member_' + member + '_si'] = this.prepared_request['health_insurance_si'];
            this.processed_request['___member_' + member + '_si___'] = this.prepared_request['health_insurance_si'];
            (adult === 1) ? this.prepared_request['member_' + member + '_inc'] = member - 1 : this.prepared_request['member_' + member + '_inc'] = member;
            this.processed_request['___member_' + member + '_inc___'] = this.prepared_request['member_' + member + '_inc'];
            var medQuestn_block = this.med_question(member);
            txt_replace_with = txt_replace_with.replace('<!--___member_' + member + '_medquestn-->', medQuestn_block);
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
    }

    if (this.lm_request['method_type'] === 'Verification') {
        this.prepared_request['quote_number'] = this.insurer_master['service_logs']['pb_db_master'].Insurer_Transaction_Identifier;
        this.processed_request['___quote_number___'] = this.prepared_request['quote_number'];
    }
    this.method_content = this.method_content.replaceAll(/<!--(.*?)-->/g, "");
};
RahejaQBEHealth.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
RahejaQBEHealth.prototype.insurer_product_field_process_post = function () {

};
RahejaQBEHealth.prototype.insurer_product_api_post = function () {

};
RahejaQBEHealth.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
//    console.log('service_call');
    try {
        let objInsurerProduct = this;
        if (docLog["Plan_Code"] === "4213100001" && specific_insurer_object.method.Method_Type === 'Premium') {     // Arogya Sanjeevani premium
            var args = JSON.parse(docLog["Insurer_Request"]);
            args['ProductPlan_Id'] = docLog['Plan_Id'];
            let Health_Rate = require(appRoot + '/models/health_rate');
            Health_Rate.findOne(args, function (err, dbHealthRate) {
                if (err)
                    throw err;
//                console.log('Raheja Arogya Sanjeevani Health Rate:', dbHealthRate);
                if (dbHealthRate !== null) {
                    var objResponseFull = {
                        'err': err,
                        'result': dbHealthRate,
                        'raw': JSON.stringify(dbHealthRate),
                        'soapHeader': null,
                        'objResponseJson': dbHealthRate
                    };
                    objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                }
            });
        } else {
            let body = docLog.Insurer_Request;
            let Client = require('node-rest-client').Client;
            let client = new Client();
            process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
            let auth_url = "https://qbuatwebapi.azurewebsites.net/api/Login/Authenticate";
            let authArgs = {
                "uid": objInsurerProduct.processed_request["___insurer_integration_service_user___"],
                "pwd": objInsurerProduct.processed_request["___insurer_integration_service_password___"]
            };
            let args = {
                data: JSON.stringify(authArgs),
                headers: {"Content-Type": "application/json"}
            };
            client.post(auth_url, args, function (data, response) {
//                console.log(response.statusCode);
                return handleToken(data.Data.tkn);
            });

            let handleToken = (AuthKey) => {
                let args1 = {
                    data: body,
                    headers: {
                        "Authorization": AuthKey,
                        "Content-Type": "application/json; charset=utf-8",
                        "Accept": "application/json, text/plain, */*"
                    }
                };
                setTimeout(() => {
                    client.post(specific_insurer_object.method_file_url, args1, function (data1, response1) {
//                        console.log('▬▬▬▬ :' + response1.statusCode);
                        let objData = JSON.stringify(data1);
                        let objResponseFull = {
                            'err': null,
                            'result': objData,
                            'raw': objData,
                            'soapHeader': null,
                            'objResponseJson': JSON.parse(objData)
                        };
                        objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                    }, sleep(4500));
                    sleep(8500);
                }, 1000);
            };
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};
RahejaQBEHealth.prototype.premium_response_handler = function (objResponseJson) {
//    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson !== null && objResponseJson.hasOwnProperty('_doc')) {
            var objPremiumService = objResponseJson['_doc'];
            if (objPremiumService.hasOwnProperty('Premium')) {
                var base_premium = (objPremiumService['Premium'] - 0);
                var premium_breakup = this.get_const_premium_breakup();
                premium_breakup['service_tax'] = base_premium * 0.18;
                premium_breakup['final_premium'] = Math.round(base_premium + premium_breakup['service_tax']);
                premium_breakup['tax']['CGST'] = premium_breakup['service_tax'] / 2;
                premium_breakup['tax']['SGST'] = premium_breakup['service_tax'] / 2;
                premium_breakup['net_premium'] = base_premium;
                objServiceHandler.Premium_Breakup = premium_breakup;
            } else {
                Error_Msg = 'LM_MSG:MAIN_NODE_MISSING';
            }
        } else {
            var objPremiumService = objResponseJson;
            if (objResponseJson.hasOwnProperty("PolCreationRespons")) {
                if (objResponseJson["PolCreationRespons"].hasOwnProperty("premiumDetails") && objResponseJson["PolCreationRespons"]["premiumDetails"] !== null) {
                    if (objResponseJson["PolCreationRespons"]["premiumDetails"]["0"].hasOwnProperty('Premium')) {
                    } else {
                        Error_Msg = JSON.stringify(objPremiumService);
                    }
                } else {
                    Error_Msg = 'LM_NODE_MISSING_premiumDetails';
                }
            } else {
                Error_Msg = 'LM_NODE_MISSING_PolCreationRespons';
            }
            if (Error_Msg === 'NO_ERR')
            {
                var premium_breakup = this.get_const_premium_breakup();
                premium_breakup['final_premium'] = Number(objPremiumService["PolCreationRespons"]["premiumDetails"]["0"]["Premium"]["0"]["GrossPremium"]);
                premium_breakup['gross_premium'] = Number(objPremiumService["PolCreationRespons"]["premiumDetails"]["0"]["Premium"]["0"]["GrossPremium"]);
                premium_breakup['base_premium'] = Number(objPremiumService["PolCreationRespons"]["premiumDetails"]["0"]["Premium"]["0"]["BasePremium"]);
                premium_breakup['net_premium'] = Number(objPremiumService["PolCreationRespons"]["premiumDetails"]["0"]["Premium"]["0"]["NetPremium"]);
                premium_breakup['tax']['CGST'] = Number((premium_breakup['net_premium'] * 0.09).toFixed(2));
                premium_breakup['tax']['SGST'] = Number((premium_breakup['net_premium'] * 0.09).toFixed(2));
                premium_breakup['service_tax'] = premium_breakup['tax']['CGST'] + premium_breakup['tax']['SGST'];
                premium_breakup['SBC'] = Number(objPremiumService["PolCreationRespons"]["premiumDetails"]["0"]["Premium"]["0"]["SBC"]);
                premium_breakup['KKC'] = Number(objPremiumService["PolCreationRespons"]["premiumDetails"]["0"]["Premium"]["0"]["KKC"]);
                objServiceHandler.Premium_Breakup = premium_breakup;
            }
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
RahejaQBEHealth.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (Error_Msg === 'NO_ERR') {
            objServiceHandler.Payment.pg_url = objResponseJson['PolCreationRespons']['PaymentUrl'] + '&Source=PolicyBoss';
            objServiceHandler.Payment.pg_redirect_mode = 'GET';
            objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['PolCreationRespons']['quoteNumber'];
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
RahejaQBEHealth.prototype.pg_response_handler = function () {
    try {
        console.log('Start', this.constructor.name, 'pg_response_handler');
        var output = this.const_payment_response.pg_get;
        this.const_policy.transaction_status = '';
        if (output['Status'] === "Sucess") {
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
RahejaQBEHealth.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
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
            if (objResponseJson.hasOwnProperty('QuotationNumber')) {
                this.const_policy.transaction_id = objResponseJson['QuotationNumber'];
            }
            if (objResponseJson.hasOwnProperty("PolicyNumber")) {
            } else {
                Error_Msg = 'LM_NODE_MISSING_PolicyNumber';
            }

            if (Error_Msg === 'NO_ERR') {
                if (objResponseJson["PolicyNumber"] !== '') {//transaction success
                    this.const_policy.transaction_substatus = "IF";
                    this.const_policy.policy_number = objResponseJson["PolicyNumber"];
                    var pdf_file_name = this.constructor.name + '_Health_' + this.const_policy.policy_number.toString().replaceAll('-', '') + '.pdf';
                    var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    this.const_policy.policy_url = pdf_web_path_portal;
                } else {
                    this.const_policy.transaction_substatus = "UW";
                }
            } else {
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
RahejaQBEHealth.prototype.get_member_type = function (adult, child) {
    var member_type;
    if (adult === 1) {
        (child === 1) ? member_type = 'M003' : (child === 2) ? member_type = 'M010' : (child === 3) ? member_type = 'M016' : (child === 4) ? member_type = '' : member_type = 'M001';
    } else if (adult === 2) {
        (child === 1) ? member_type = 'M004' : (child === 2) ? member_type = 'M005' : (child === 3) ? member_type = 'M011' : (child === 4) ? member_type = '' : member_type = 'M002';
    }
    return member_type;
};
RahejaQBEHealth.prototype.get_member_relation = function (i) {
    console.log(this.constructor.name, 'get_member_relation', ' Start RahejaQBEHealth');
    var gender = this.lm_request['member_' + i + '_gender'];
    console.log("Gender in RahejaQBEHealth " + gender);
    if (this.prepared_request["relation"] === '3' || this.prepared_request["relation"] === '4') {
        return(gender === 'M' ? 'R006' : 'R005');
    }
    if (this.prepared_request["relation"] === '5' || this.prepared_request["relation"] === '6') {
        return(gender === 'M' ? 'R003' : 'R004');
    }
    if (this.prepared_request["relation"] === '2') {
        return 'R002';
    }
    if (this.prepared_request["relation"] === '1' || this.prepared_request["relation"] === '') {
        if (i >= 3) {
            return(gender === 'M' ? 'R003' : 'R004');
        } else if (i === 1) {
            return 'R001';
        } else if (i === 2) {
            return 'R002';
        }
    }
    return '';
    console.log(this.constructor.name, 'get_member_relation', 'End RahejaQBEHealth');
};
RahejaQBEHealth.prototype.med_question = function (member) {
    var arr_questnId = ['Q001', 'Q002', 'Q003', 'Q004', 'Q005', 'Q006', 'Q007', 'Q008', 'Q009', 'Q010', 'Q011', 'Q013', 'Q014'];
    let medQuestn = '';
    for (i = 0; i <= arr_questnId.length - 1; i++) {
        if (this.prepared_request['member_' + member + '_question_' + arr_questnId[i] + '_details'] !== false) {
            if ([0, 11, 12].indexOf(i) === -1) {
                medQuestn === '' ? medQuestn = "\n\t\t\t" + '{"QuestionCode": "' + arr_questnId[i] + '", "Remarks": "Yes"}' : medQuestn += ",\n\t\t\t" + '{"QuestionCode": "' + arr_questnId[i] + '", "Remarks": "Yes"}';
            } else {    // answerable questns
                medQuestn === '' ? medQuestn = "\n\t\t\t" + '{"QuestionCode": "' + arr_questnId[i] + '", "Remarks": "' + this.prepared_request['member_' + member + '_question_' + arr_questnId[i] + '_details'] + '"}' : medQuestn += ",\n\t\t\t" + '{"QuestionCode": "' + arr_questnId[i] + '", "Remarks": "' + this.prepared_request['member_' + member + '_question_' + arr_questnId[i] + '_details'] + '"}';
            }
        }
    }
    var arr_habitId = ['Q015', 'Q016', 'Q017', 'Q018', 'Q019', 'Q020'];
    for (i = 0; i <= arr_habitId.length - 1; i++) {    //alcohol, tobacco, smoking details
        if (this.prepared_request['member_' + member + '_question_' + arr_habitId[i] + '_details'] === false) {
            this.prepared_request['member_' + member + '_question_' + arr_habitId[i] + '_details'] = '';
            this.processed_request['___member_' + member + '_question_' + arr_habitId[i] + '_details___'] = '';
        }
    }
    return medQuestn;
};
RahejaQBEHealth.prototype.is_valid_plan = function (lm_request, planCode) {
    console.log('RahejaQBEHealth is_valid_plan', 'start');
    var index = -1;
    var plan = true;
    if (planCode !== "4213100001" && ['150000', '250000', '350000', '450000'].includes(lm_request['health_insurance_si'])) {
        plan = false;
    }
    if (lm_request['child_count'] === 4 || lm_request['member_1_age'] > 65) {
        plan = false;
    }
    var Plans = [
        {'code': "4218100001", 'min_si': 99000, 'max_si': 5000000},
        {'code': "4218100002", 'min_si': 250000, 'max_si': 5000000},
        {'code': "4218100003", 'min_si': 99000, 'max_si': 5000000},
        {'code': "4213100001", 'min_si': 99000, 'max_si': 500000}
    ];
    index = Plans.findIndex(x => x.code === planCode && plan === true
                && x.min_si < (lm_request['health_insurance_si'] - 0)
                && x.max_si >= (lm_request['health_insurance_si'] - 0));
    return (index > -1 ? true : false);
    console.log('RahejaQBEHealth is_valid_plan', 'End');
};
RahejaQBEHealth.prototype.premium_breakup_schema = {
    "base_premium": "basePremium",
    "net_premium": "premium",
    "service_tax": "serviceTax",
    "SBC": "SBC",
    "KKC": "KKC",
    "gross_premium": "grossPremium",
    "final_premium": "totalPremium"
};
module.exports = RahejaQBEHealth;