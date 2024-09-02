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
var fs = require('fs');
var sleep = require('system-sleep');
var moment = require('moment');

function ReligareHealth() {

}
util.inherits(ReligareHealth, Health);
ReligareHealth.prototype.insurer_date_format = 'dd/MM/yyyy';
ReligareHealth.prototype.const_insurer_suminsured = [100000, 200000, 300000, 400000, 500000, 700000, 800000, 1000000, 1500000, 2000000, 2500000, 3000000, 4000000, 6000000, 7500000, 10000000, 20000000, 30000000, 60000000];


ReligareHealth.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
ReligareHealth.prototype.insurer_product_field_process_pre = function () {
    if (this.lm_request['method_type'] === 'Proposal' && this.lm_request['health_policy_type'] !== 'renew') {
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
                    if (this.lm_request[x].toString().toLowerCase() === 'since' && this.prepared_request['dbmaster_plan_id'] === 82) {
                        var arr_questions = x.match('member_' + member + '_question_(.*)_')[0];
                        var arr_questions = arr_questions.concat('since');
                        var arr_ques = arr_questions.replaceAll('member_' + member + '_question_array_', arr_questions);
                        txt_ques_replace_with += txt_ques_replace.replaceAll('member_' + member + '_question_array_', arr_ques);
                    }
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
                    if (this.lm_request[x].toString().toLowerCase() === 'since' && this.prepared_request['dbmaster_plan_id'] === 82) {
                        var arr_questions = x.match('member_' + member + '_question_(.*)_')[0];
                        var arr_questions = arr_questions.concat('since');
                        var arr_ques = arr_questions.replaceAll('member_' + member + '_question_array_', arr_questions);
                        txt_ques_replace_with += txt_ques_replace.replaceAll('member_' + member + '_question_array_', arr_ques);
                    }
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
                var since_ques_setcode = key.replace('_type', '_sincesetcode');
                var ques_code = key.replace('_type', '_code');
                var since_ques_code = key.replace('_type', '_sincecode');
                var ques_detail = key.replace('_type', '_details');
                var since_ques_detail = key.replace('_type', '_sincedetails');
                this.prepared_request[ques_setcode] = this.getQuestionSet(this.prepared_request[ques_code]);
                this.processed_request['___' + ques_setcode + '___'] = this.prepared_request[ques_setcode];
                this.prepared_request[since_ques_setcode] = this.getQuestionSet(this.prepared_request[ques_code]);
                this.processed_request['___' + since_ques_setcode + '___'] = this.prepared_request[since_ques_setcode];

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
                    this.prepared_request[since_ques_detail] = "YES";
                    this.processed_request['___' + since_ques_detail + '___'] = this.prepared_request[since_ques_detail];

                    this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                    this.processed_request['___' + ques_detail + '___'] = this.lm_request[ques_detail];

                    this.prepared_request[ques_code] = this.getQuestionCode(this.lm_request[ques_code], this.lm_request[key]);
                    this.processed_request['___' + ques_code + '___'] = this.prepared_request[ques_code];

                    this.prepared_request[since_ques_code] = this.sincegetQuestionCode(this.lm_request[ques_code], this.lm_request[key]);
                    this.processed_request['___' + since_ques_code + '___'] = this.prepared_request[since_ques_code];
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

        if (this.prepared_request["addon_selected"] === "" || this.prepared_request['dbmaster_pb_plan_id'] === 268 ||
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

        if (this.prepared_request['dbmaster_pb_plan_id'] === 81)
        {
            this.prepared_request['base_product_id'] = 10001101;
            this.processed_request['___base_product_id___'] = 10001101;
            //this.processed_request['___nominee_relation___'] = this.get_nominee_relation(this.processed_request['___nominee_relation___']);
        } else
        {
            this.prepared_request['base_product_id'] = 10001106;
            this.processed_request['___base_product_id___'] = 10001106;
        }
        if (this.lm_request.hasOwnProperty('is_lazypay_emi') && this.lm_request['is_lazypay_emi'] !== true) {
            var obj_replace = {
                "<xsd:field3>Finance-Lazypay</xsd:field3>": ""
            };
            this.method_content = this.method_content.toString().replaceJson(obj_replace);
        }

    }
    if (this.lm_request['method_type'] === 'Proposal' && this.lm_request['health_policy_type'] === 'renew') {
        this.prepared_request["addon_selected"] = this.get_addon_details();
        this.processed_request["___addon_selected___"] = this.prepared_request["addon_selected"];
        this.prepared_request["loan_amount"] = this.get_loan_amt(this.prepared_request['dbmaster_pb_plan_id']);
        this.processed_request["___loan_amount___"] = this.prepared_request["loan_amount"];
        this.prepared_request['base_product_id'] = 10001101;
        this.processed_request['___base_product_id___'] = 10001101;

        this.prepared_request["crn"] = this.lm_request["crn"];
        this.processed_request["___crn___"] = this.prepared_request["crn"];
        var obj_replace = {
            "<xsd:policyNum></xsd:policyNum>": "<xsd:policyNum>" + this.lm_request['policy_no'] + "</xsd:policyNum>",
            "<xsd:questionCd>___member_array_question_array_code___</xsd:questionCd>": "<xsd:questionCd></xsd:questionCd>",
            "<xsd:response>___member_array_question_array_details___</xsd:response>": "<xsd:response></xsd:response>",
            "<xsd:questionSetCd>___member_array_question_array_setcode___</xsd:questionSetCd>": "<xsd:questionSetCd></xsd:questionSetCd>",
            "<xsd:height>___member_array_height___</xsd:height>": "<xsd:height></xsd:height>",
            "<xsd:weight>___member_array_weight___</xsd:weight>": "<xsd:weight></xsd:weight>"
        };
        this.method_content = this.method_content.toString().replaceJson(obj_replace);
        this.processed_request['___health_insurance_si_2___'] = this.lm_request['sum_insured'];

        if (this.prepared_request["addon_selected"] === "" || this.prepared_request['dbmaster_pb_plan_id'] === 268 ||
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

        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";
        var member = 1;

        for (member = 1; member <= this.lm_request['member_count']; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.prepared_request['member_' + member + '_inc'] = member;
            this.processed_request['___member_' + member + '_inc___'] = member;
            console.log(txt_replace_with);
        }
        txt_replace_with = txt_replace_with.replaceAll('<!--InsurersDetail_Start-->', "");
        txt_replace_with = txt_replace_with.replaceAll('<!--InsurersDetail_End-->', "");
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
        console.log(this.method_content);

        var objMember = this['insurer_master']['service_logs']['pb_db_master']['Premium_Response']['Member_details'];
        if (objMember.length > 0) {
            for (var i in objMember) {
                var mem = parseInt(i) + 1;
                this.processed_request['___member_' + mem + '_first_name___'] = objMember[i]['first_name'];
                this.processed_request['___member_' + mem + '_last_name___'] = objMember[i]['last_name'];
                this.processed_request['___member_' + mem + '_birth_date___'] = objMember[i]['birthdate'];
                this.processed_request['___member_' + mem + '_gender_2___'] = objMember[i]['gender'];
                this.processed_request['___permanent_address_1___'] = objMember[i]['premanent_address1'];
                this.processed_request['___permanent_address_2___'] = objMember[i]['premanent_address2'];
                this.processed_request['___area___'] = objMember[i]['premanent_city'];
                this.processed_request['___city___'] = objMember[i]['premanent_city'];
                this.processed_request['___permanent_pincode___'] = objMember[i]['premanent_pincode'];
                this.processed_request['___state___'] = objMember[i]['premanent_state'];
                this.processed_request['___member_' + mem + '_relation___'] = objMember[i]['relation'];
                this.processed_request['___member_' + mem + '_salutation___'] = objMember[i]['title'];
                this.processed_request['___birth_date___'] = objMember[0]['birthdate'];

            }
        }
        if (this.lm_request.hasOwnProperty('is_lazypay_emi') && this.lm_request['is_lazypay_emi'] !== true) {
            var obj_replace = {
                "<xsd:field3>Finance-Lazypay</xsd:field3>": ""
            };
            this.method_content = this.method_content.toString().replaceJson(obj_replace);
        }
    }
    if (this.lm_request['method_type'] === 'Renewal') {
        this.prepared_request['policy_number'] = this.lm_request['policy_no'];
        this.processed_request['___policy_number___'] = this.prepared_request['policy_number'];
    }

    if (this.lm_request['method_type'] === 'Premium') {
        //renewal 
        if (this.lm_request.hasOwnProperty('health_policy_type') && this.lm_request['health_policy_type'] === "renew") {
            this.prepared_request["crn"] = this.lm_request["crn"];
            this.processed_request["___crn___"] = this.prepared_request["crn"];
            var method_content = fs.readFileSync(appRoot + '/resource/request_file/Health/' + this.method.Renewal_Request_File).toString();
            this.method_content = method_content;

            var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
            var txt_replace_with = "";
            var member = 1;
            for (member = 1; member <= this.lm_request['member_count']; member++) {
                txt_replace_with += "," + txt_replace.replaceAll('___member_array', '___member_' + member);
                this.prepared_request['member_' + member + '_inc'] = member;
                this.processed_request['___member_' + member + '_inc___'] = member;
            }

            txt_replace_with = txt_replace_with.replaceAll('<!--InsurersDetail_Start-->', "");
            txt_replace_with = txt_replace_with.replaceAll('<!--InsurersDetail_End-->', "");

            this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
            console.log(this.method_content);
            for (var key in this.lm_request) {
                if (key.indexOf('member_') > -1) {
                    this.prepared_request[key] = this.lm_request[key];
                    this.processed_request['___' + key + '___'] = this.prepared_request[key];
                }
            }

            this.prepared_request['policy_number'] = this.lm_request['policy_no'];
            this.processed_request['___policy_number___'] = this.prepared_request['policy_number'];

            this.prepared_request["prev_policy_expiry_date"] = this.lm_request["prev_policy_expiry_date"];
            this.processed_request['___prev_policy_expiry_date___'] = this.prepared_request["prev_policy_expiry_date"];

            this.prepared_request["sum_insured"] = this.lm_request["sum_insured"];
            this.processed_request['___sum_insured___'] = this.prepared_request["sum_insured"];

//              if (this.prepared_request['dbmaster_pb_plan_id'] === 81)
//            {
//            this.prepared_request['base_product_id'] = 10001101;
//            this.processed_request['___base_product_id___'] = 10001101;
//            } else 
//            {
//            this.prepared_request['base_product_id'] = 10001106;
//            this.processed_request['___base_product_id___'] = 10001106;
//            }

        } else {
            var max_month = this.lm_request["elder_member_age_in_months"];
            var mem1_month = this.lm_request['member_1_birth_date'].split('-')[1];
            var current_month = moment().format('DD/MM/YYYY').split('/')[1];
            if (mem1_month === current_month) {
                if (this.prepared_request['Plan_Id'] === 268 || this.prepared_request['Plan_Id'] === 269 ||
                        this.prepared_request['Plan_Id'] === 270 || this.prepared_request['Plan_Id'] === 271) {
                    max_month = max_month - 1;
                }
            }

            var args = {
                "ProductPlan_Id": this.processed_request['___Plan_Id___'],
                "NumberOfAdults": this.lm_request["adult_count"],
                "NumberOfChildren": this.lm_request["child_count"],
                "SumInsured": this.prepared_request["health_insurance_si"] - 0,
                "Min_AgeOfEldestMember_Months": {$lte: this.lm_request["elder_member_age_in_months"]},
                "Max_AgeOfEldestMember_Months": {$gt: max_month},
                "Policy_Term_Year": this.lm_request["policy_tenure"]
            };
            this.method_content = JSON.stringify(args);
            console.log(args);
        }
    }

    if (this.lm_request['method_type'] === 'Verification') {
        this.prepared_request["proposal_number"] = this.insurer_master['service_logs']['pb_db_master']['Insurer_Response']['Envelope']['Body']['0']['createPolicyResponse']['0']['return']['0']['int-policy-data-iO']['0']['policy']['0']['proposal-num']['0'];
        this.processed_request["___proposal_number___"] = this.prepared_request["proposal_number"];
        this.prepared_request["insurer_bank_cd"] = config.environment.name === 'Production' ? "" : "02";
        this.processed_request["___insurer_bank_cd___"] = this.prepared_request["insurer_bank_cd"];
    }
    if (this.lm_request['method_type'] === 'Pdf') {
//        if (config.environment.name !== 'Production') {
//            var obj_replace = {
//                '"policyNum": "___policy_number___"': '"policyNum": "10368603"'
//            };
//            this.method_content = this.method_content.toString().replaceJson(obj_replace);
//        }
    }
    console.log('insurer_product_field_process_pre');
};
ReligareHealth.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
    if (specific_insurer_object.method.Method_Type === 'Renewal') {
        obj_response_handler = this.renewal_response_handler(objResponseJson);
    }
    return obj_response_handler;

};
ReligareHealth.prototype.insurer_product_field_process_post = function () {

};
ReligareHealth.prototype.insurer_product_api_post = function () {

};
ReligareHealth.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
//    console.log('service_call');
    try {
        var objInsurerProduct = this;
        if (specific_insurer_object.method.Method_Calling_Type === 'Database' && this.lm_request['health_policy_type'] === "renew") {
            var body = docLog.Insurer_Request;
//            console.log(body);
            var https = require('https');
            var hostname = ((config.environment.name === 'Production') ? "api.religarehealthinsurance.com" : "apiuat.religarehealthinsurance.com");
            var app_id = ((config.environment.name === 'Production') ? 314808 : 516215);
            var signature = ((config.environment.name === 'Production') ? "s1jKM0PqAtXouLydKtrL7X3QCgi2KmtNNogKMddxJA4=" : "JsnNW921WJDN51CUaadctSNkGDWlXo/28TrIKuKUIhc=");
            var timestamp = ((config.environment.name === 'Production') ? "1571141818393" : "1568801564676");
            var Service_URL = "";
            if (specific_insurer_object.method.Method_Calling_Type === 'Database' && this.lm_request['health_policy_type'] === "renew") {
                Service_URL = specific_insurer_object.method.Renew_URL;
            } else {
                Service_URL = specific_insurer_object.method.Service_URL;
            }
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
//                console.log(res.statusCode);
                var buffer = "";
                res.on("data", function (data) {
                    buffer = buffer + data;
                });
                res.on("end", function (data) {
//                    console.log(buffer);
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

        } else if (specific_insurer_object.method.Method_Calling_Type === 'Database' && this.lm_request['health_policy_type'] !== "renew") {
            var args = JSON.parse(this.method_content);
            args['ProductPlan_Id'] = docLog['Plan_Id'];
            var Health_Rate = require(appRoot + '/models/health_rate');
            Health_Rate.findOne(args, function (err, dbHealthRate) {
//                console.log(dbHealthRate);
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
        } else if (specific_insurer_object.method.Method_Calling_Type === 'POST') {

            var body = docLog.Insurer_Request;
            var https = require('https');
            var hostname = ((config.environment.name === 'Production') ? "api.religarehealthinsurance.com" : "apiuat.religarehealthinsurance.com");
            if (this.method.Method_Type === 'Proposal') {
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
                        "SOAPAction": "urn:createPolicy"
                    }
                };
                process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
                var req = https.request(postRequest, function (res) {
//                    console.log(res.statusCode);
                    var buffer = "";
                    res.on("data", function (data) {
                        buffer = buffer + data;
                    });
                    res.on("end", function (data) {
//                        console.log(buffer);
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
            } else if (this.method.Method_Type === 'Pdf' || this.method.Method_Type === 'Renewal' || this.method.Method_Type === 'Verification') {
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
//                    console.log(res.statusCode);
                    var buffer = "";
                    res.on("data", function (data) {
                        buffer = buffer + data;
                    });
                    res.on("end", function (data) {
//                        console.log(buffer);
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

ReligareHealth.prototype.premium_response_handler = function (objResponseJson) {
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Premium_Response': {'Member_details': "",
            'Nominee_details': "",
            'Addon': ""
        }
    };
    var Error_Msg = 'NO_ERR';
    try {
//        console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
        if (this.lm_request.hasOwnProperty('health_policy_type') && this.lm_request['health_policy_type'] === "renew") {
            if (objResponseJson.errorLists.length === 0) {
                Error_Msg = 'NO_ERR';
            } else {
                Error_Msg = objResponseJson.errorLists[0]['errDescription'];
            }

            if (Error_Msg === 'NO_ERR') {
                if (objResponseJson.policy.hasOwnProperty('premium')) {
                    var premium_breakup = this.get_const_premium_breakup();
                    premium_breakup['net_premium'] = objResponseJson.policy['premium'];
                    premium_breakup['final_premium'] = objResponseJson.policy['premium'];
                    objServiceHandler.Premium_Breakup = premium_breakup;

                    var objmembersarr = [];
                    var objMember = objResponseJson['policy']['partyDOList'];
                    for (var i in objMember) {
                        if (objMember[i]['roleCd'] === "PRIMARY") {
                            var obj = {
                                "first_name": objMember[i]['firstName'],
                                "last_name": objMember[i]['lastName'],
                                "sum_insurerd": this.health_insurance_si_2(),
                                "upsell_suminsured": this.health_insurance_si_2(),
                                "healthReturn": "",
//                                "birthdate": moment(objMember[i]['birthDt']).format('DD/MM/YYYY'),
                                "birthdate": objMember[i]['birthDt'],
                                "gender": objMember[i]['genderCd'],
                                "email": objMember[i]['partyEmailDOList'][0]['emailAddress'],
                                //"mobile_number": objMember[i]['partyContactDOList'][0]['contactNum'],
                                "mobile_number": objMember[i].hasOwnProperty('partyContactDOList') ? objMember[i]['partyContactDOList'][0]['contactNum'] : '""',
                                "relation": objMember[i]['relationCd'],
                                "Chronic": "",
                                "title": objMember[i]['titleCd'],
                                "age": moment().diff(objMember[i]['birthDt'], 'years'),
                                "customerId": objMember[i]['customerId'],
                                "premanent_address1": objMember[i]['partyAddressDOList'][0]['addressLine1Lang1'],
                                "premanent_address2": objMember[i]['partyAddressDOList'][0]['addressLine2Lang1'],
                                "premanent_pincode": objMember[i]['partyAddressDOList'][0]['pinCode'],
                                "premanent_state": objMember[i]['partyAddressDOList'][0]['stateCd'],
                                "premanent_city": objMember[i]['partyAddressDOList'][0]['cityCd'],
                                "communication_address1": objMember[i]['partyAddressDOList'][1]['addressLine1Lang1'],
                                "communication_address2": objMember[i]['partyAddressDOList'][1]['addressLine2Lang1'],
                                "communication_pincode": objMember[i]['partyAddressDOList'][1]['pinCode'],
                                "communication_state": objMember[i]['partyAddressDOList'][1]['stateCd'],
                                "communication_city": objMember[i]['partyAddressDOList'][1]['cityCd']
                            };
                            objmembersarr.push(obj);
                        }
                    }
                    objServiceHandler.Premium_Response['Member_details'] = objmembersarr;

                } else {
                    Error_Msg = 'LM_MSG:MAIN_NODE_MISSING';
                }
            }

        } else {
            if (objResponseJson !== null && objResponseJson.hasOwnProperty('_doc')) {
                var objPremiumService = objResponseJson['_doc'];
                if (objPremiumService.hasOwnProperty('Premium')) {
                    var premium_breakup = this.get_const_premium_breakup();
                    premium_breakup['service_tax'] = (objPremiumService['Premium'] - 0) * 0.18;
                    premium_breakup['net_premium'] = objPremiumService['Premium'];
                    premium_breakup['final_premium'] = premium_breakup['net_premium'] + premium_breakup['service_tax'];
                    premium_breakup['tax']['CGST'] = premium_breakup['service_tax'] / 2;
                    premium_breakup['tax']['SGST'] = premium_breakup['service_tax'] / 2;
                    if (objResponseJson['PlanId'] === 268 || objResponseJson['PlanId'] === 269 || objResponseJson['PlanId'] === 270 || objResponseJson['PlanId'] === 271) {

                    } else {
                        if (this.prepared_request.elder_member_age - 0 <= 45 && this.lm_request.health_insurance_si - 0 <= 450000)
                        {
                            premium_breakup['addon']['addon_uar'] = Math.round(premium_breakup['final_premium'] * 0.175);
                            premium_breakup['addon']['addon_ncb'] = Math.round(premium_breakup['final_premium'] * 0.20);
                            premium_breakup['addon']['addon_pa'] = 0;
                        } else if (this.prepared_request.elder_member_age - 0 <= 45 && this.lm_request.health_insurance_si - 0 > 450000 && this.lm_request.health_insurance_si - 0 <= 4000000)
                        {
                            premium_breakup['addon']['addon_uar'] = Math.round(premium_breakup['final_premium'] * 0.075);
                            premium_breakup['addon']['addon_ncb'] = Math.round(premium_breakup['final_premium'] * 0.10);
                            premium_breakup['addon']['addon_pa'] = 0;
                        } else if (this.prepared_request.elder_member_age - 0 <= 45 && this.lm_request.health_insurance_si - 0 > 4500000 && this.lm_request.health_insurance_si - 0 <= 7000000)
                        {
                            premium_breakup['addon']['addon_uar'] = Math.round(premium_breakup['final_premium'] * 0.05);
                            premium_breakup['addon']['addon_ncb'] = Math.round(premium_breakup['final_premium'] * 0.075);
                            premium_breakup['addon']['addon_pa'] = 0;
                        } else if (this.prepared_request.elder_member_age - 0 > 45 && this.lm_request.health_insurance_si - 0 <= 450000)
                        {
                            premium_breakup['addon']['addon_uar'] = Math.round(premium_breakup['final_premium'] * 0.25);
                            premium_breakup['addon']['addon_ncb'] = Math.round(premium_breakup['final_premium'] * 0.30);
                            premium_breakup['addon']['addon_pa'] = 0;
                        } else if (this.prepared_request.elder_member_age - 0 > 45 && this.lm_request.health_insurance_si - 0 > 450000 && this.lm_request.health_insurance_si - 0 <= 4000000)
                        {
                            premium_breakup['addon']['addon_uar'] = Math.round(premium_breakup['final_premium'] * 0.15);
                            premium_breakup['addon']['addon_ncb'] = Math.round(premium_breakup['final_premium'] * 0.20);
                            premium_breakup['addon']['addon_pa'] = 0;
                        } else if (this.prepared_request.elder_member_age - 0 > 45 && this.lm_request.health_insurance_si - 0 > 4500000 && this.lm_request.health_insurance_si - 0 <= 7000000)
                        {
                            premium_breakup['addon']['addon_uar'] = Math.round(premium_breakup['final_premium'] * 0.10);
                            premium_breakup['addon']['addon_ncb'] = Math.round(premium_breakup['final_premium'] * 0.15);
                            premium_breakup['addon']['addon_pa'] = 0;
                        }
                    }
//                    //Air Ambulance Cover
//                    var acc_service_tax = 655 * 0.18;
//                    premium_breakup['addon']['addon_aac'] = Math.round(acc_service_tax + 655);

                    var dsi_basic_rate = this.dsi_health_rate(this.processed_request) - 0;
                    var dsi_basic_rate_service_tax = dsi_basic_rate * 0.18;
                    premium_breakup['addon']['addon_dsi'] = dsi_basic_rate - 0 + dsi_basic_rate_service_tax;
                    objServiceHandler.Premium_Breakup = premium_breakup;
                } else {
                    Error_Msg = 'LM_MSG:MAIN_NODE_MISSING';
                }

            } else {
                Error_Msg = 'LM_MSG:MAIN_NODE_MISSING';

            }
            objServiceHandler.Error_Msg = Error_Msg;
//            console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
        }
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
ReligareHealth.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson.hasOwnProperty('Envelope')) {
            var objResJson = objResponseJson['Envelope']['Body']['0']['createPolicyResponse']['0']['return']['0']['int-policy-data-iO']['0'];
            if (objResJson.hasOwnProperty('error-lists')) {
                Error_Msg = 'I: ';
                var resp_err = objResJson['error-lists'];
                resp_err.forEach((err) => {
                    Error_Msg += '\u2726 ' + err['err-description'] + ". ";
                });
            } else if (objResJson['policy']['0'].hasOwnProperty('premium')) {
                var proposal_amt = parseInt(objResJson['policy']['0']['premium']['0']);
                var prm_diff = proposal_amt > this.lm_request['final_premium'] ? proposal_amt - this.lm_request['final_premium'] : this.lm_request['final_premium'] - proposal_amt;
                if (prm_diff >= 5) {
//                    Error_Msg = "LM_Premium_Mismatch";
                }
            }

            let check_for_eligibility = false;
            let check_for_initiate = false;
            var initiate_response = {};
            if (this.lm_request.hasOwnProperty('is_lazypay_emi') && this.lm_request['is_lazypay_emi'] === true && Error_Msg === 'NO_ERR') {
                let Client = require('node-rest-client').Client;
                let client = new Client();

                var args = {
                    headers: {"Content-Type": "application/json"},
                    data: this.lm_request
                };
                var proposal_req = {
                    "lm_request": this.lm_request,
                    "pg_ack_url": this.const_payment.pg_ack_url
                };
                client.post(config.environment.weburl + '/lazy_pay_log/check_eligibility', args, function (data, response) {
                    if (data.hasOwnProperty('Response')) {
                        if (data['Response'].hasOwnProperty('status') && (data['Response']['status'] === 400 || data['Response']['status'] === 404 || data['Response']['status'] === 500)) {
                            console.error('LazyPay Eligibility Err: ', JSON.stringify(data));
                            check_for_eligibility = false;
                            Error_Msg = "LP: " + (data['Response'].hasOwnProperty('message') ? data['Response']['message'] : JSON.stringify(data['Response']));
                        } else {
                            if (data['Response'].hasOwnProperty('isEligible') && data['Response']['isEligible'] === true) {
                                check_for_eligibility = true;
                                let Client = require('node-rest-client').Client;
                                let client = new Client();
                                var occ_obj = {"HOUSEWIFE": "home-maker", "STUDENT": "student", "SALARIED": "salaried", "PROFESSIONAL": "salaried", "RETIRED": "retired", "BUSINESS": "self-employed", "OTHERS": "salaried"};
                                var occupation = occ_obj[proposal_req['lm_request']['member_1_occupation']];
                                var args1 = {
                                    headers: {"Content-Type": "application/json"},
                                    data: {
                                        "request": proposal_req['lm_request'],
                                        "return_url": proposal_req['pg_ack_url'],
                                        "occupation": occupation
                                    }
                                };
                                client.post(config.environment.weburl + '/lazy_pay_log/pg_initiate', args1, function (data, response) {
                                    if (data) {
                                        if (data['Response'].hasOwnProperty('status') && (data['Response']['status'] === 400 || data['Response']['status'] === 404 || data['Response']['status'] === 500)) {
                                            Error_Msg = "LP: " + data['Response']['message'];
                                            check_for_initiate = false;
                                        } else if (data['Response'].hasOwnProperty('redirectUrl') && data['Response']['redirectUrl'] !== "" && data['Response']['redirectUrl'] !== null) {
                                            check_for_initiate = true;
                                        } else {
                                            check_for_initiate = false;
                                            Error_Msg = "LP: " + (data['Response'].hasOwnProperty('message') ? data['Response']['message'] : JSON.stringify(data['Response']));
                                        }
                                        initiate_response = JSON.stringify(data);
                                    } else {
                                        Error_Msg = 'LM_MSG:LAZYPAY_INITIATE_MAIN_NODE_MISSING';
                                    }
                                });
                            } else {
                                check_for_eligibility = false;
                                Error_Msg = "LP: " + (data['Response'].hasOwnProperty('message') ? data['Response']['message'] : JSON.stringify(data['Response']));
                            }
                        }
                    } else {
                        Error_Msg = 'LM_MSG:LAZYPAY_ELIGIBILITY_MAIN_NODE_MISSING';
                    }
                });
                sleep(18000);
            }

            this.prepared_request['pay_via_lazypay'] = check_for_initiate;
            this.processed_request['___pay_via_lazypay___'] = check_for_initiate;
            initiate_response = Object.keys(initiate_response).length !== 0 ? initiate_response : "";
//        if (this.lm_request.hasOwnProperty('is_lazypay_emi') && this.lm_request['is_lazypay_emi'] === true) {
//            if (check_for_eligibility === false) {
//                Error_Msg = "Lazypay: You are not eligible for the LazyPay EMI offer at this moment. Thanks for showing your interest.";
//            } else if (check_for_initiate === false) {
//                if (this.prepared_request['initiate_req_res'] !== "") {
//                    var initiate_req_response = JSON.parse(this.prepared_request['initiate_req_res']);
//                    if (initiate_req_response.hasOwnProperty('Response') && initiate_req_response['Response'].hasOwnProperty('message')) {
//                        Error_Msg = "Lazypay: " + initiate_req_response['Response']['message'];
//                    } else {
//                        Error_Msg = 'LM_MSG:INITIATE_MAIN_NODE_MISSING';
//                    }
//                }
//            }
//        }
        } else {
            Error_Msg = 'LM_MSG:MAIN_NODE_MISSING';
        }

        if (Error_Msg === 'NO_ERR') {
            if (this.lm_request['is_lazypay_emi'] === true && this.prepared_request['pay_via_lazypay'] === true && initiate_response !== '') {
                let initiate_data = JSON.parse(initiate_response);
                objServiceHandler.Payment.pg_url = initiate_data['Response']['redirectUrl'];
                objServiceHandler.Payment.pg_data = initiate_data['Request']['data'];
                objServiceHandler.Payment.pg_redirect_mode = 'POST';
                objServiceHandler.Insurer_Transaction_Identifier = initiate_data['Response']['token'];
            } else {
                var pg_data = {
                    'proposalNum': objResponseJson['Envelope']['Body']['0']['createPolicyResponse']['0']['return']['0']['int-policy-data-iO']['0']['policy']['0']['proposal-num']['0'],
                    'returnURL': this.const_payment.pg_ack_url
                };
                objServiceHandler.Payment.pg_data = pg_data;
                objServiceHandler.Payment.pg_redirect_mode = 'POST';
                objServiceHandler.Insurer_Transaction_Identifier = '';

            }
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
ReligareHealth.prototype.renewal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'renewal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Premium_Response': {'Member_details': "",
            'Nominee_details': "",
            'Addon': "",
            'Common_details': {"prev_policy_expiry_date": "",
                "cover_type": "",
                "sum_insured": ""}
        }
    };
    var Error_Msg = 'NO_ERR';
    try {
        var objPremiumService = objResponseJson;

        if (objPremiumService['responseData']['message'] === "Success") {
            Error_Msg = 'NO_ERR';
        } else {
            // Error_Msg = 'NO_ERR';
            Error_Msg = objPremiumService['intGetRenewalPolicyResponseIO']['listErrorListList'][0]['errDescription'];
        }

        if (Error_Msg === "NO_ERR") {
            //var method_content = fs.readFileSync(appRoot + '/resource/request_file/Health/Religare_Health_Renew_Response.json').toString();
            //objPremiumService = JSON.parse(method_content);
            objServiceHandler.Premium_Response['Common_details']["prev_policy_expiry_date"] = moment(objPremiumService['intGetRenewalPolicyResponseIO']['policy']['prevPolicyExpiryDt']).format('DD/MM/YYYY');
            objServiceHandler.Premium_Response['Common_details']["cover_type"] = objPremiumService['intGetRenewalPolicyResponseIO']['policy']['coverType'];
            objServiceHandler.Premium_Response['Common_details']["sum_insured"] = objPremiumService['intGetRenewalPolicyResponseIO']['policy']['sumInsured'];
            var objmembersarr = [];
            var objMember = objPremiumService['intGetRenewalPolicyResponseIO']['policy']['partyDOList'];
            for (var i in objMember) {
                var obj = {
                    "first_name": objMember[i]['firstName'],
                    "last_name": objMember[i]['lastName'],
                    "sum_insurerd": "",
                    "upsell_suminsured": "",
                    "healthReturn": "",
                    "birthdate": moment(objMember[i]['birthDt']).format('DD/MM/YYYY'),
                    "gender": objMember[i]['genderCd'],
                    "email": objMember[i]['partyEmailDOList'][0]['emailAddress'],
                    "mobile_number": objMember[i].hasOwnProperty('partyContactDOList') ? objMember[i]['partyContactDOList'][0]['contactNum'] : '""',
                    "relation": objMember[i]['relationCd'],
                    "Chronic": "",
                    "title": objMember[i]['titleCd'],
                    "age": moment().diff(objMember[i]['birthDt'], 'years'),
                    "customerId": objMember[i]['customerId'],
                    "premanent_address1": objMember[i]['partyAddressDOList'][0]['addressLine1Lang1'],
                    "premanent_address2": objMember[i]['partyAddressDOList'][0]['addressLine2Lang1'],
                    "premanent_pincode": objMember[i]['partyAddressDOList'][0]['pinCode'],
                    "premanent_state": objMember[i]['partyAddressDOList'][0]['stateCd'],
                    "premanent_city": objMember[i]['partyAddressDOList'][0]['cityCd'],
                    "communication_address1": objMember[i]['partyAddressDOList'][1]['addressLine1Lang1'],
                    "communication_address2": objMember[i]['partyAddressDOList'][1]['addressLine2Lang1'],
                    "communication_pincode": objMember[i]['partyAddressDOList'][1]['pinCode'],
                    "communication_state": objMember[i]['partyAddressDOList'][1]['stateCd'],
                    "communication_city": objMember[i]['partyAddressDOList'][1]['cityCd']
                };
                objmembersarr.push(obj);
            }
            objServiceHandler.Premium_Response['Member_details'] = objmembersarr;

            var health_renewal = require(appRoot + '/models/health_renewal_data');
            var objhealthReq = {
                "Insurer_Id": this['insurer_id'],
                "Product_Id": this.lm_request['product_id'],
                "Insurer_Request": JSON.parse(this['method_content_replaced']),
                "Insurer_Response": objPremiumService['intGetRenewalPolicyResponseIO'],
                "Policy_No": objPremiumService['intGetRenewalPolicyResponseIO']['policyNum'],
                "Mobile_No": objPremiumService['intGetRenewalPolicyResponseIO']['policy']['partyDOList'][0]['partyContactDOList'][0]['contactNum'],
                "Customer_Name": objPremiumService['intGetRenewalPolicyResponseIO']['policy']['partyDOList'][0]['firstName'] + ' ' + objPremiumService['intGetRenewalPolicyResponseIO']['policy']['partyDOList'][0]['lastName'],
                "Created_On": new Date(),
                "Modified_On": new Date(),
                "Status": "Pending"
            };

            var objModelRenewalData = new health_renewal(objhealthReq);
            objModelRenewalData.save(function (err, objdbRenewalData) {
                if (err) {
                    throw err;
                } else {

                }
            });
        } else {
            objServiceHandler['Error_Msg'] = Error_Msg;
        }

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
ReligareHealth.prototype.pg_response_handler = function () {
    try {
        console.log('Start', this.constructor.name, 'pg_response_handler');
        if (this.proposal_processed_request.hasOwnProperty('___pay_via_lazypay___') && this.proposal_processed_request['___pay_via_lazypay___'] === true) {
            var output = this.const_payment_response.pg_get;
            if (output['status'] === 'success' && output['lpTxnId'] !== "" && output['lpTxnId'] !== undefined) {
				
                this.const_policy.transaction_amount = this.insurer_master['service_logs']['pb_db_master']['Insurer_Response']['Envelope']['Body']['0']['createPolicyResponse']['0']['return']['0']['int-policy-data-iO']['0']['policy']['0']['premium']['0'];
				this.const_policy.transaction_id = output['lpTxnId'];
				this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.transaction_status = 'SUCCESS';
                
//                this.const_policy.policy_id = this.proposal_processed_request['___proposal_number___'];
                
            } else {
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
            }
        } else {
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
        }
        console.error('End', this.constructor.name, 'pg_response_handler', this.const_policy);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
ReligareHealth.prototype.verification_response_handler = function (objResponseJson) {
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
            if (objResponseJson.hasOwnProperty('responseData') && objResponseJson.responseData.message === 'Success') {
                if (objResponseJson.hasOwnProperty('intGetReceiptIO')) {
                    if (objResponseJson['intGetReceiptIO']['uwDecisionCode'] === "INFORCE") {
                        this.const_policy.policy_number = objResponseJson['intGetReceiptIO']['policyNum'];
                        this.const_policy.transaction_substatus = 'IF';
                    } else if (objResponseJson['intGetReceiptIO']['uwDecisionCode'] === "PENDINGFORMANUALUW" || objResponseJson['intGetReceiptIO']['uwDecisionCode'] === "PENDINGREQUIREMENTS") {
                        this.const_policy.transaction_substatus = 'UW';
                        this.const_policy.policy_number = objResponseJson['intGetReceiptIO']['policyNum'];
                    } else {
                        Error_Msg = JSON.stringify(objResponseJson);
                    }
                }
            } else {
                if (objResponseJson.hasOwnProperty('intGetReceiptIO') && objResponseJson.intGetReceiptIO.errorLists.length > 0) {
                    Error_Msg = objResponseJson.intGetReceiptIO.errorLists;
                } else {
                    Error_Msg = JSON.stringify(objResponseJson);
                }
            }

            if (Error_Msg === 'NO_ERR') {
                var pdf_file_name = this.constructor.name + '_' + "Health" + '_' + this.const_policy.policy_number + '.pdf';
                var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                this.const_policy.policy_url = pdf_web_path_portal;
//                if (config.environment.name === 'Production') {
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
                        if (this.proposal_processed_request.hasOwnProperty('___pay_via_lazypay___') && this.proposal_processed_request['___pay_via_lazypay___'] === true) {
                            var lazypay_arg = {
                                'crn': this.lm_request['crn'],
                                'udid': this.lm_request['udid'],
                                'insurer_id': this.lm_request['insurer_id'],
                                'policy_number': this.const_policy.policy_number,
                                'mobile': this.lm_request['mobile'],
                                'final_premium': this.lm_request['final_premium'],
                                'token': this.const_payment_response.pg_get['token']
                            };
                            this.lazypay_update_policy_no(config.environment.weburl + '/lazy_pay_log/policy_number', lazypay_arg);
                        }
                    } catch (ep) {
                        console.error('ExceptionPDF', this.constructor.name, 'verification_response_handler', ep);
                    }
//                }
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
ReligareHealth.prototype.pdf_call = function (url, args, pdf_sys_loc) {
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
ReligareHealth.prototype.lazypay_update_policy_no = function (url, args) {
    var Client = require('node-rest-client').Client;
    var client = new Client();
    var args1 = {
        data: args,
        headers: {
            "Content-Type": "application/json"
        }
    };
    client.post(url, args1, function (data, response) {});
};
ReligareHealth.prototype.pdf_response_handler = function (objResponseJson) {
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
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'premium_response_handler', objServiceHandler);
        objServiceHandler.Policy = this.const_policy;
    }
    return objServiceHandler;

};
ReligareHealth.prototype.get_member_relation = function (i) {
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
ReligareHealth.prototype.get_addon_details = function () {
    if (this.lm_request['method_type'] === 'Proposal')
    {
        if (this.lm_request['addon_dsi'] === 'yes' && this.lm_request['addon_ncb'] === 'yes' && this.lm_request['addon_uar'] === 'yes')
        {
            return "CAREWITHNCB,ASIFORAH,UAR";
        }
        if (this.lm_request['addon_dsi'] === 'yes' && this.lm_request['addon_ncb'] === 'yes')
        {
            return "CAREWITHNCB,ASIFORAH";
        }

        if (this.lm_request['addon_ncb'] === 'yes' && this.lm_request['addon_uar'] === 'yes')
        {
            return "CAREWITHNCB,UAR";
        }

        if (this.lm_request['addon_dsi'] === 'yes' && this.lm_request['addon_uar'] === 'yes')
        {
            return "ASIFORAH,UAR";
        }
        if (this.lm_request['addon_dsi'] === 'yes')
        {
            return "ASIFORAH";
        }

        if (this.lm_request['addon_uar'] === 'yes')
        {
            return "UAR";
        }

        if (this.lm_request['addon_ncb'] === 'yes')
        {
            return "CAREWITHNCB";
        }
        return "";
    }
};

/*ReligareHealth.prototype.get_addon_details = function () {
 if (this.prepared_request['dbmaster_pb_plan_name'] === 'Care + DSI') {
 return "ASIFORAH";
 }
 if (this.prepared_request['dbmaster_pb_plan_name'] === 'Care + NCB') {
 return "CAREWITHNCB";
 }
 //    if (this.prepared_request['dbmaster_pb_plan_name'] === 'Care + PA') {
 //        return "PA";
 //    }
 //    if (this.prepared_request['dbmaster_pb_plan_name'] === 'Care + UAR + PA') {
 //        return "CARE,PA,UAR";
 //    }
 //    if (this.prepared_request['dbmaster_pb_plan_name'] === 'Care + NCB + PA') {
 //        return "CAREWITHNCB,PA";
 //    }
 if (this.prepared_request['dbmaster_pb_plan_name'] === 'Care + NCB + UAR') {
 return "CAREWITHNCB,UAR";
 }
 if (this.prepared_request['dbmaster_pb_plan_name'] === 'Care + UAR') {
 return "UAR";
 }
 //    if (this.prepared_request['dbmaster_pb_plan_name'] === 'Care + DSI + PA') {
 //        return "ASIFORAH,PA";
 //    }
 //    if (this.prepared_request['dbmaster_pb_plan_name'] === 'Care + DSI + UAR + PA') {
 //        return "ASIFORAH,UAR,PA";
 //    }
 if (this.prepared_request['dbmaster_pb_plan_name'] === 'Care + DSI + UAR') {
 return "ASIFORAH,UAR";
 }
 };*/
ReligareHealth.prototype.get_loan_amt = function (plan_id) {
    var loan_amt = '';
    if (plan_id === 245 || plan_id === 260 || plan_id === 261 || plan_id === 262 || plan_id === 265 || plan_id === 266)
    {
        loan_amt = this.prepared_request['health_insurance_si'] * 5;
    }
    return loan_amt;
};

ReligareHealth.prototype.dsi_health_rate = function (processed_request) {
    try {
        var age = this.processed_request['___elder_member_age___'];
        var si = this.processed_request['___health_insurance_si___'];
        var member_count = this.processed_request['___member_count___'];

        if (age <= 45)
        {
            age = 45;
        }

        if (age > 45 && age <= 60)
        {
            age = 60;
        }

        if (age > 60 && age <= 75)
        {
            age = 75;
        }

        if (age > 75)
        {
            age = 76;
        }

        var dsi_rate = {
            'Age_45': {
                'sum_300000': 214,
                'sum_500000': 158,
                'sum_700000': 146,
                'sum_1000000': 137,
                'sum_1500000': 135,
                'sum_2000000': 108,
                'sum_2500000': 100,
                'sum_3000000': 95,
                'sum_4000000': 92,
                'sum_5000000': 87,
                'sum_6000000': 86,
                'sum_7500000': 85
            },
            'Age_60': {
                'sum_300000': 364,
                'sum_500000': 268,
                'sum_700000': 249,
                'sum_1000000': 233,
                'sum_1500000': 230,
                'sum_2000000': 183,
                'sum_2500000': 170,
                'sum_3000000': 161,
                'sum_4000000': 157,
                'sum_5000000': 147,
                'sum_6000000': 146,
                'sum_7500000': 145
            },
            'Age_75': {
                'sum_300000': 674,
                'sum_500000': 497,
                'sum_700000': 461,
                'sum_1000000': 431,
                'sum_1500000': 426,
                'sum_2000000': 339,
                'sum_2500000': 314,
                'sum_3000000': 299,
                'sum_4000000': 291,
                'sum_5000000': 273,
                'sum_6000000': 270,
                'sum_7500000': 268
            },
            'Age_76': {
                'sum_300000': 1279,
                'sum_500000': 943,
                'sum_700000': 876,
                'sum_1000000': 819,
                'sum_1500000': 808,
                'sum_2000000': 644,
                'sum_2500000': 596,
                'sum_3000000': 567,
                'sum_4000000': 552,
                'sum_5000000': 518,
                'sum_6000000': 513,
                'sum_7500000': 509
            }

        };
        var dsi_health_rate = dsi_rate['Age_' + age]['sum_' + si];
        if (member_count > 1)
        {
            var discount_member = member_count - 1;
            var dsi_health_rate_discount = dsi_health_rate * discount_member * 0.975;
            dsi_health_rate = dsi_health_rate_discount + dsi_health_rate;

        }
        return dsi_health_rate;

    } catch (e) {
        console.error('Exception', this.constructor.name, 'dsi_rate', e);
    }

    console.log("Finish", this.constructor.name, 'dsi_rate', processed_request);

};

ReligareHealth.prototype.health_insurance_si_2 = function () {
    console.log('health_insurance_si_2', 'start');
    if (this.prepared_request['dbmaster_pb_plan_id'] === 82)
    {
        var mediclaim = [
            {'code': '017', 'ins_type': 'individual', 'sum_ins': 500000, 'sum_ins_type': 'AROGYA SANJEEVANI'},
            {'code': '018', 'ins_type': 'floater', 'sum_ins': 500000, 'sum_ins_type': 'AROGYA SANJEEVANI'}
        ];
    } else
    {
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
    }
    if (this.lm_request.hasOwnProperty('health_policy_type') && this.lm_request['health_policy_type'] === "renew") {
        var index = mediclaim.findIndex(x => x.code === this.lm_request['sum_insured']);
        if (index === -1) {
            return "";
        }
        return mediclaim[index]['sum_ins'];
    } else {
        var index = mediclaim.findIndex(x => x.sum_ins === this.prepared_request['health_insurance_si'] - 0 && x.ins_type === this.lm_request['health_insurance_type']);
        if (index === -1) {
            return "";
        }
        return mediclaim[index]['code'];
    }

    console.log('health_insurance_si_2', 'end');
};
ReligareHealth.prototype.getQuestionCode = function (code, type) {
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
        {"code": "501", "set": "PEDEndoDetails", "type": "Flag"},
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
ReligareHealth.prototype.sincegetQuestionCode = function (code, type) {
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
        {"code": "501", "set": "PEDEndoDetails", "type": "Flag"},
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
    if (type === "since") {
        index = arr_question_set.findIndex(x => x.code === code);
        return arr_question_set[index]['code'];
    }
};
ReligareHealth.prototype.getQuestionSet = function (code) {
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
        {"code": "501", "set": "PEDEndoDetails", "type": "Flag"},
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
ReligareHealth.prototype.get_nominee_relation = function (nominee) {
    console.log('ReligareHealth get_nominee_relation', 'start');
    var index = -1;
    var nominee_name = [
        {"code": "SPSE", "name": "WIFE"},
        {"code": "SPSE", "name": "HUSBAND"},
        {"code": "FATH", "name": "FATHER"},
        {"code": "MOTH", "name": "MOTHER"},
        {"code": "SONM", "name": "SON"},
        {"code": "UDTR", "name": "DAUGHTER"}
    ];
    index = nominee_name.findIndex(x => x.name === nominee);
    return nominee_name[index]['code'];
    console.log('ReligareHealth get_nominee_relation', 'End');
};
ReligareHealth.prototype.is_valid_plan = function (lm_request, planCode) {
    console.log('ReligareHealth is_valid_plan', 'start');
	var sum_insured = lm_request['health_insurance_si'] - 0;
    if(lm_request['health_insurance_type'] === 'individual' && sum_insured < 500000 && lm_request['member_1_age'] - 0 <= 35 ){
        return false;
    }
    var index = -1;
    var HDFC_Plans = [
        {'code': "Care", 'min_si': 99000, 'max_si': 60000000},
        {'code': "ArogyaSanjeevani", 'min_si': 450000, 'max_si': 500000}
    ];
    index = HDFC_Plans.findIndex(x => x.code === planCode
                && x.min_si < sum_insured
                && x.max_si >= sum_insured);
    return (index > -1 ? true : false);
    console.log('ReligareHealth is_valid_plan', 'End');
};
ReligareHealth.prototype.premium_breakup_schema = {
    "addon": {
        "addon_dsi": 0,
        "addon_uar": 0,
        "addon_ncb": 0,
        "addon_pa": 0,
//        "addon_aac": 0,
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
module.exports = ReligareHealth;