/* Author : Revati Ghadge
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var util = require('util');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var Health = require(appRoot + '/libs/Health');
var config = require('config');
//var fs = require('fs');
var moment = require('moment');
//var pdf = require('html-pdf');
var excel = require('excel4node');

function EdelweissHealth() {

}
util.inherits(EdelweissHealth, Health);
EdelweissHealth.prototype.insurer_date_format = 'DD-MM-YYYY';
EdelweissHealth.prototype.const_insurer_suminsured = [300000, 400000, 500000, 750000, 1000000, 1500000, 2000000, 5000000, 7500000, 10000000];


EdelweissHealth.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
EdelweissHealth.prototype.insurer_product_field_process_pre = function () {
    if (this.lm_request['method_type'] === 'Premium') {
        if (this.lm_request['member_1_birth_date']) {
            var mem1_month = this.lm_request['member_1_birth_date'].split('-')[1];
            var current_month = moment().format('DD/MM/YYYY').split('/')[1];
            if (mem1_month === current_month) {
                max_month = this.lm_request["elder_member_age_in_months"] - 1;
            } else {
                max_month = this.lm_request["elder_member_age_in_months"];
            }
        }

        var args = {
            "ProductPlan_Id": this.processed_request['___Plan_Id___'],
            "NumberOfAdults": this.lm_request["adult_count"],
            "NumberOfChildren": this.lm_request["child_count"],
            "SumInsured": this.prepared_request["health_insurance_si"] - 0,
            "Min_AgeOfEldestMember_Months": {$lte: this.lm_request["elder_member_age_in_months"]},
            "Max_AgeOfEldestMember_Months": {$gt: max_month},
            "Policy_Term_Year": 1
        };
        this.method_content = JSON.stringify(args);
    }
    if (this.lm_request['method_type'] === 'Proposal') {
        this.prepared_request["area"] = this.lm_request["locality"];
        this.processed_request["___area___"] = this.prepared_request["area"];
        this.prepared_request["city"] = this.lm_request["district"];
        this.processed_request["___city___"] = this.prepared_request["city"];
        this.prepared_request["state"] = this.lm_request["communication_state"];
        this.processed_request["___state___"] = this.prepared_request["state"];
        this.processed_request['___pan___'] = (this.prepared_request['pan']).toUpperCase();
        this.prepared_request['isUW'] = 'no';

        var planDetails = this.prepared_request['dbmaster_pb_plan_name'].split('+');
        this.prepared_request["base_plan"] = (planDetails[0]).trim();
        this.processed_request["___base_plan___"] = this.prepared_request["base_plan"];
        this.prepared_request['base_plan_id'] = this.processed_request["___base_plan___"] === 'Silver' ? 314 : (this.processed_request["___base_plan___"] === 'Gold' ? 315 : 316);
        this.processed_request['___base_plan_id___'] = this.prepared_request['base_plan_id'];
        var obj_premium_breakup = this.insurer_master['service_logs']['pb_db_master']['Premium_Breakup'];
        this.prepared_request['discount'] = obj_premium_breakup['discount'];
        this.processed_request['___discount___'] = this.prepared_request['discount'];

        this.prepared_request["critical_plan_cover"] = this.prepared_request['dbmaster_pb_plan_name'].includes("Critical") ? "YES" : "NO";
        this.processed_request["___critical_plan_cover___"] = this.prepared_request["critical_plan_cover"];
        this.prepared_request["restoration_plan_cover"] = this.prepared_request['dbmaster_pb_plan_name'].includes("Restoration") ? "YES" : "NO";
        this.processed_request["___restoration_plan_cover___"] = this.prepared_request["restoration_plan_cover"];
        this.prepared_request["recharge_plan_cover"] = this.prepared_request['dbmaster_pb_plan_name'].includes("Recharge") ? "YES" : "NO";
        this.processed_request["___recharge_plan_cover___"] = this.prepared_request["recharge_plan_cover"];

//        if (this.prepared_request['dbmaster_pb_plan_name'].includes("241")) {
//            this.processed_request["___addon_plan_cover___"] = "checked";
//            this.processed_request["___no_addon_plan_cover___"] = "";
//        } else {
//            this.processed_request["___addon_plan_cover___"] = "";
//            this.processed_request["___no_addon_plan_cover___"] = "checked";
//        }
        var policy_type = (this.lm_request['health_insurance_type'] === 'individual') ? 'Individual' : 'Floater';
        this.prepared_request['policy_type'] = policy_type;
        this.processed_request['___policy_type___'] = policy_type;
        this.prepared_request['premium_type'] = (this.lm_request['policy_tenure'] === 1) ? 'Annual' : 'Single';
        this.processed_request['___premium_type___'] = this.prepared_request['premium_type'];
        this.prepared_request['policy_start'] = this.policy_start();
        this.processed_request['___policy_start___'] = this.prepared_request['policy_start'];
        this.prepared_request['policy_end'] = this.policy_end();
        this.processed_request['___policy_end___'] = this.prepared_request['policy_end'];
        this.lm_request['salutation_text'] = this.processed_request['___salutation___'];
        this.lm_request['nominee_relation_text'] = this.processed_request['___nominee_relation___'];

        var member = 1;
        var common_uw_reason = "";
        // repeat for each adult
        for (member = 1; member <= this.lm_request['adult_count']; member++) {
            this.prepared_request['member_' + member + '_ped'] = 'NO';
            this.processed_request['___member_' + member + '_ped___'] = 'NO';
            var uw_reason = "";
            this.calculate_bmi(member);
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];

            this.prepared_request['member_' + member + '_blood_group'] = this.lm_request['member_' + member + '_bloodgrp'];
            this.processed_request['___member_' + member + '_blood_group___'] = this.prepared_request['member_' + member + '_blood_group'];

            this.prepared_request['member_' + member + '_bmi_normal'] = this.check_bmi(this.prepared_request['member_' + member + '_bmi']);
            this.processed_request['___member_' + member + '_bmi_normal___'] = this.prepared_request['member_' + member + '_bmi_normal'];

            if (this.prepared_request['member_' + member + '_relation'] !== 'SELF') {
                var nominee_name = this.processed_request['___first_name___'] + ' ' + this.processed_request['___last_name___'];

                this.prepared_request['member_' + member + '_nominee_dob'] = this.processed_request['___birth_date___'];
                this.processed_request['___member_' + member + '_nominee_dob___'] = this.prepared_request['member_' + member + '_nominee_dob'];
                this.prepared_request['member_' + member + '_nominee_name'] = nominee_name;
                this.processed_request['___member_' + member + '_nominee_name___'] = nominee_name;
                this.prepared_request['member_' + member + '_nominee_rel'] = this.prepared_request['member_' + member + '_relation'];
                this.processed_request['___member_' + member + '_nominee_rel___'] = this.prepared_request['member_' + member + '_relation'];
            } else {
                var nominee_name = this.processed_request['___nominee_first_name___'] + ' ' + this.processed_request['___nominee_last_name___'];

                this.prepared_request['member_' + member + '_nominee_dob'] = this.processed_request['___nominee_birth_date___'];
                this.processed_request['___member_' + member + '_nominee_dob___'] = this.prepared_request['member_' + member + '_nominee_dob'];
                this.prepared_request['member_' + member + '_nominee_name'] = nominee_name;
                this.processed_request['___member_' + member + '_nominee_name___'] = nominee_name;
                this.prepared_request['member_' + member + '_nominee_rel'] = this.prepared_request['nominee_relation'];
                this.processed_request['___member_' + member + '_nominee_rel___'] = this.prepared_request['nominee_relation'];
            }

            for (var key in this.lm_request) {
                if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1 && key.includes("member_" + member)) {
                    var ques_detail = key.replace('_type', '_details');
                    var ques_code = key.replace('_type', '_code');
                    if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                        if (this.lm_request[ques_detail] === false) {
                            this.prepared_request[ques_detail] = "NO";
                            this.processed_request['___' + ques_detail + '___'] = "NO";
                        } else {
                            this.prepared_request[ques_detail] = "YES";
                            this.processed_request['___' + ques_detail + '___'] = "YES";
                            this.prepared_request['isUW'] = 'yes';
                            this.processed_request['___isUW___'] = 'yes';
                            if (!ques_detail.includes('1280') && !ques_detail.includes('1281')) {
                                this.prepared_request['member_' + member + '_ped'] = 'YES';
                                this.processed_request['___member_' + member + '_ped___'] = 'YES';
                            }
                            uw_reason = (uw_reason === "" ? this.lm_request[ques_code] : uw_reason + '|' + this.lm_request[ques_code]);
                        }
                    } else if (this.lm_request[key].toString().toLowerCase() === 'since') {
                        this.prepared_request['isUW'] = 'yes';
                        this.processed_request['___isUW___'] = 'yes';
                        this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                        this.processed_request['___' + ques_detail + '___'] = this.lm_request[ques_detail];
                        uw_reason = (uw_reason === "" ? this.lm_request[ques_code] : uw_reason + '|' + this.lm_request[ques_code]);
                    }
                }
                this.prepared_request['member_' + member + '_uwReason'] = uw_reason;
                this.processed_request['___member_' + member + '_uwReason___'] = uw_reason;
            }
            if (this.processed_request['___member_' + member + '_bmi_normal___'] !== 'yes') {
                this.processed_request['___member_' + member + '_uwReason___'] += '|BMI';
            }
            common_uw_reason += this.processed_request['___member_' + member + '_uwReason___'];
        }
        //repeat for each kid
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            this.prepared_request['member_' + member + '_ped'] = 'NO';
            this.processed_request['___member_' + member + '_ped___'] = 'NO';
            var uw_reason = "";
            this.calculate_bmi(member);
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];

            this.prepared_request['member_' + member + '_blood_group'] = this.lm_request['member_' + member + '_bloodgrp'];
            this.processed_request['___member_' + member + '_blood_group___'] = this.prepared_request['member_' + member + '_blood_group'];

            if (this.prepared_request['member_' + member + '_age'] >= 18) {
                this.prepared_request['member_' + member + '_bmi_normal'] = this.check_bmi(this.prepared_request['member_' + member + '_bmi']);
                this.processed_request['___member_' + member + '_bmi_normal___'] = this.prepared_request['member_' + member + '_bmi_normal'];
            } else {
                this.prepared_request['member_' + member + '_bmi_normal'] = 'yes';
                this.processed_request['___member_' + member + '_bmi_normal___'] = 'yes';
            }

            if (this.prepared_request['member_' + member + '_relation'] !== 'SELF') {
                var nominee_name = this.processed_request['___first_name___'] + ' ' + this.processed_request['___last_name___'];

                this.prepared_request['member_' + member + '_nominee_dob'] = this.processed_request['___birth_date___'];
                this.processed_request['___member_' + member + '_nominee_dob___'] = this.prepared_request['member_' + member + '_nominee_dob'];
                this.prepared_request['member_' + member + '_nominee_name'] = nominee_name;
                this.processed_request['___member_' + member + '_nominee_name___'] = nominee_name;
                this.prepared_request['member_' + member + '_nominee_rel'] = this.prepared_request['member_' + member + '_relation'];
                this.processed_request['___member_' + member + '_nominee_rel___'] = this.prepared_request['member_' + member + '_relation'];
            } else {
                var nominee_name = this.processed_request['___nominee_first_name___'] + ' ' + this.processed_request['___nominee_last_name___'];

                this.prepared_request['member_' + member + '_nominee_dob'] = this.processed_request['___nominee_birth_date___'];
                this.processed_request['___member_' + member + '_nominee_dob___'] = this.prepared_request['member_' + member + '_nominee_dob'];
                this.prepared_request['member_' + member + '_nominee_name'] = nominee_name;
                this.processed_request['___member_' + member + '_nominee_name___'] = nominee_name;
                this.prepared_request['member_' + member + '_nominee_rel'] = this.prepared_request['nominee_relation'];
                this.processed_request['___member_' + member + '_nominee_rel___'] = this.prepared_request['nominee_relation'];
            }

            for (var key in this.lm_request) {
                if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1 && key.includes("member_" + member)) {
                    var ques_detail = key.replace('_type', '_details');
                    var ques_code = key.replace('_type', '_code');
                    if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                        if (this.lm_request[ques_detail] === false) {
                            this.prepared_request[ques_detail] = "NO";
                            this.processed_request['___' + ques_detail + '___'] = "NO";
                        } else {
                            this.prepared_request[ques_detail] = "YES";
                            this.processed_request['___' + ques_detail + '___'] = "YES";
                            this.prepared_request['isUW'] = 'yes';
                            this.processed_request['___isUW___'] = 'yes';
                            if (!ques_detail.includes('1280') && !ques_detail.includes('1281')) {
                                this.prepared_request['member_' + member + '_ped'] = 'YES';
                                this.processed_request['___member_' + member + '_ped___'] = 'YES';
                            }
                            uw_reason = (uw_reason === "" ? this.lm_request[ques_code] : uw_reason + '|' + this.lm_request[ques_code]);
                        }
                    } else if (this.lm_request[key].toString().toLowerCase() === 'since') {
                        this.prepared_request['isUW'] = 'yes';
                        this.processed_request['___isUW___'] = 'yes';
                        this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                        this.processed_request['___' + ques_detail + '___'] = this.lm_request[ques_detail];
                        uw_reason = (uw_reason === "" ? this.lm_request[ques_code] : uw_reason + '|' + this.lm_request[ques_code]);
                    }
                }
                this.prepared_request['member_' + member + '_uwReason'] = uw_reason;
                this.processed_request['___member_' + member + '_uwReason___'] = uw_reason;
            }
            if (this.processed_request['___member_' + member + '_bmi_normal___'] !== 'yes') {
                this.processed_request['___member_' + member + '_uwReason___'] = this.processed_request['___member_' + member + '_uwReason___'] === "" ? 'BMI' : this.processed_request['___member_' + member + '_uwReason___'] + "|BMI";
            }
            common_uw_reason = common_uw_reason === "" ? this.processed_request['___member_' + member + '_uwReason___'] : common_uw_reason + '|' + this.processed_request['___member_' + member + '_uwReason___'];
        }
        this.prepared_request['mer'] = this.check_mer();
        this.processed_request['___mer___'] = this.prepared_request['mer'];
        this.prepared_request['common_uw_reason'] = common_uw_reason;
        this.processed_request['___common_uw_reason___'] = common_uw_reason;

        this.method_content = this.insurer_master['service_logs']['pb_db_master']['Insurer_Request'];
    }
    if (this.lm_request['method_type'] === 'Verification') {
        this.method_content = this.insurer_master['service_logs']['pb_db_master']['Insurer_Request'];
    }
    console.log('insurer_product_field_process_pre');
};
EdelweissHealth.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
EdelweissHealth.prototype.insurer_product_field_process_post = function () {

};
EdelweissHealth.prototype.insurer_product_api_post = function () {

};
EdelweissHealth.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    console.log('service_call');
    try {
        var objInsurerProduct = this;
        if (specific_insurer_object.method.Method_Calling_Type === 'Database') {
            var args = JSON.parse(this.method_content);
            if (this.lm_request['method_type'] === 'Premium') {
                args['ProductPlan_Id'] = (docLog['Plan_Id'] === docLog['Plan_Code']) ? docLog['Plan_Id'] : docLog['Plan_Code'];
                args['Policy_Term_Year'] = (!(docLog["Plan_Name"].includes("Platinum")) && this.prepared_request["member_1_age"] > 65) ? 0 : (this.prepared_request["member_1_age"] > 70 ? 0 : 1);
                args['Policy_Term_Year'] = this.lm_request['health_insurance_type'] === 'floater' ? (this.lm_request['member_1_age'] >= 21 ? args['Policy_Term_Year'] : 0) : args['Policy_Term_Year'];

                var Health_Rate = require(appRoot + '/models/health_rate');
                Health_Rate.findOne(args, function (err, dbHealthRate) {
                    if (err)
                        throw err;
                    console.log('Edelweiss Health Rate ', dbHealthRate);
                    if (dbHealthRate !== null) {
                        var objResponseFull = {
                            'err': err,
                            'result': dbHealthRate,
                            'raw': JSON.stringify(dbHealthRate),
                            'soapHeader': null,
                            'objResponseJson': dbHealthRate
                        };

                        objResponseFull['objResponseJson']['actualPlanId'] = docLog['Plan_Id'];
                        objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                    }
                });
            } else {
                var Client = require('node-rest-client').Client;
                var client = new Client();
                var service_method_url = '';
                service_method_url = config.environment.weburl + '/quote/edelweiss/proposal?Product_Id=2&CRN=' + objInsurerProduct.lm_request['crn'];
                console.error('DBG', 'Edelweiss_Health', 'service_method_url', service_method_url);
                args['ProductPlan_Id'] = this.processed_request['___base_plan_id___'];
                client.get(service_method_url, function (data) {
                    console.error('DBG', 'Customer', data);
                    if (data.status === 'ERR') {
                        var objResponseFull = {
                            'err': null,
                            'result': data,
                            'raw': '',
                            'soapHeader': null,
                            'objResponseJson': data
                        };
                        objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                    } else {
                        objInsurerProduct.processed_request['___policy_number_generate___'] = data.policy_number;
                        var Health_Rate = require(appRoot + '/models/health_rate');
                        Health_Rate.findOne(args, function (err, dbHealthRate) {
                            if (err)
                                throw err;
                            console.log('Edelweiss Health Rate ', dbHealthRate);
                            if (dbHealthRate !== null) {
                                var tenure = objInsurerProduct.prepared_request['policy_tenure'];
                                var base_premium = Math.round(dbHealthRate['Premium'] + (dbHealthRate['Premium'] * 0.05));
                                base_premium = tenure === 1 ? base_premium : (tenure === 2 ? Math.round(base_premium * 2) : Math.round(base_premium * 3));

                                var objResponseFull = {
                                    'err': err,
                                    'result': dbHealthRate,
                                    'raw': JSON.stringify(dbHealthRate),
                                    'soapHeader': null,
                                    'objResponseJson': objInsurerProduct.processed_request
                                };
                                objResponseFull['objResponseJson']['___base_premium___'] = base_premium;
                                objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                            }
                        });
                    }
                });
            }
        } else {
            var Client = require('node-rest-client').Client;
            var client = new Client();
            var service_method_url = config.environment.weburl;
            client.get(service_method_url, function (data, response) {
                data = objInsurerProduct.processed_request;
                var objResponseFull = {
                    'err': null,
                    'result': data,
                    'raw': '',
                    'soapHeader': null,
                    'objResponseJson': data
                };
                objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
            });
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};

EdelweissHealth.prototype.premium_response_handler = function (objResponseJson) {
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
//        var discount = 0;
        if (objResponseJson !== null && objResponseJson.hasOwnProperty('_doc')) {
            var objPremiumService = objResponseJson['_doc'];
            if (objPremiumService.hasOwnProperty('Premium')) {
                var base_premium = objPremiumService['Premium'] - 0;
                var premium_breakup = this.get_const_premium_breakup();
                base_premium = Math.round(base_premium + (base_premium * 0.05));
                if (this.lm_request['policy_tenure'] === 2) {
                    base_premium = (base_premium * 2 * 0.925);
                    premium_breakup['discount'] = (premium_breakup['base_premium'] * 2) - base_premium;
                } else if (this.lm_request['policy_tenure'] === 3) {
                    base_premium = (base_premium * 3 * 0.9);
                    premium_breakup['discount'] = (premium_breakup['base_premium'] * 2) - base_premium;
                }
                premium_breakup['net_premium'] = base_premium;

                if (objResponseJson['actualPlanId'] !== objPremiumService['ProductPlan_Id']) {
                    premium_breakup['net_premium'] = this.lm_request['policy_tenure'] !== 1 ? 0 : premium_breakup['net_premium'];
                    if (this.lm_request['policy_tenure'] === 1) {
                        premium_breakup['loading'] = 0.25 * base_premium;
                        base_premium += premium_breakup['loading'];
                        premium_breakup['service_tax'] = base_premium * 0.18;
                        premium_breakup['final_premium'] = Math.round(base_premium + premium_breakup['service_tax']);
                    }
                } else {
                    premium_breakup['service_tax'] = (base_premium - 0) * 0.18;
                    premium_breakup['final_premium'] = Math.round(base_premium + premium_breakup['service_tax']);
                }
                premium_breakup['tax']['CGST'] = (premium_breakup['service_tax'] / 2).toFixed(2);
                premium_breakup['tax']['SGST'] = (premium_breakup['service_tax'] / 2).toFixed(2);
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
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'premium_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
EdelweissHealth.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    var bmi_normal = '';
    var diabetes = '';
    try {
        if (objResponseJson.hasOwnProperty('status') && objResponseJson.status === 'ERR') {
            Error_Msg = objResponseJson.msg;
        } else {
            for (var i = 1; i <= this.lm_request['member_count'] + 1; i++) {
                if (this.processed_request['___member_' + i + '_bmi_normal___'] !== undefined || this.processed_request['___member_' + i + '_bmi_normal___'] !== "") {
                    bmi_normal = bmi_normal === '' ? this.processed_request['___member_' + i + '_bmi_normal___'] : bmi_normal + '|' + this.processed_request['___member_' + i + '_bmi_normal___'];
                }
                if (this.prepared_request["member_" + i + "_inc"] !== undefined && this.prepared_request["member_" + i + "_inc"] !== '') {
                    if (this.prepared_request["member_" + i + "_question_1266_details"] === 'YES' && this.prepared_request["member_" + i + "_age"] < 30) {
                        diabetes = "yes";
                    }
                }
            }
            Error_Msg = (bmi_normal.includes('no')) ? "Proposal Declined" : Error_Msg;
            if (this.prepared_request["common_uw_reason"].includes('OtherPED') || this.prepared_request["common_uw_reason"].includes('Epilepsy') || this.prepared_request["common_uw_reason"].includes('Cancer')) {
                Error_Msg = "Proposal Declined";
            } else if (diabetes === "yes") {
                Error_Msg = "Proposal Declined";
            } else if (this.processed_request['___mer___'] !== "" || this.processed_request['___isUW___'] === "yes" || this.processed_request['___common_uw_reason___'] !== "") {
                Error_Msg = "Proposal Declined";
            } else {
                if ((this.prepared_request["base_plan"].includes("Silver") || this.prepared_request["base_plan"].includes("Gold")) && this.prepared_request["member_1_age"] > 65) {
                    Error_Msg = "Proposal Declined";
                }
            }
            if (objResponseJson.hasOwnProperty('___policy_number_generate___') === false || objResponseJson['___policy_number_generate___'] === '' || objResponseJson['___policy_number_generate___'] === null || isNaN(objResponseJson['___policy_number_generate___']) || objResponseJson['___policy_number_generate___'].toString().length <= 8) {
                Error_Msg = 'ERROR IN POLICY NUMBER GENERATION';
            } else {
                this.processed_request['___policy_number_generate___'] = objResponseJson['___policy_number_generate___'];
            }
        }
        if (Error_Msg === 'NO_ERR') {
            var merchant_key = ((config.environment.name === 'Production') ? 'o7LxX9fJ' : 'BC50nb');
            var salt = ((config.environment.name === 'Production') ? 'c6ob2Q7Wb4' : 'Bwxo1cPe');
            var merchant_id = ((config.environment.name === 'Production') ? '6756734' : '4825050');
            var productinfo = {paymentParts: [{name: 'splitId1', merchantId: merchant_id, value: this.lm_request['final_premium'], commission: '0.00', description: 'splitId1 summary'}]};
            var hashSequence = 'key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10';
            var str = hashSequence.split('|');
            var txnid = (this.processed_request['___policy_number_generate___']).toString();
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
            objServiceHandler.Insurer_Transaction_Identifier = 'PB' + this.lm_request['crn'];
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
EdelweissHealth.prototype.pg_response_handler = function () {
    try {
        console.log('Start', this.constructor.name, 'pg_response_handler');
        var output = this.const_payment_response.pg_post;
        if (output['status'] === 'success') {
            this.const_policy.transaction_amount = output['amount'];
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.pg_reference_number_1 = output['addedon'];
            this.const_policy.pg_reference_number_2 = output['mihpayid'];
            this.const_policy.transaction_id = (JSON.parse(output['payuMoneyId'])['splitIdMap'][0]['splitPaymentId']).toString();
            this.const_policy.policy_number = output['txnid'];
        } else {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
        console.error('End', this.constructor.name, 'pg_response_handler', this.const_policy);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
EdelweissHealth.prototype.verification_response_handler = function (objResponseJson) {
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
        }

        if (this.const_policy.pg_status === 'SUCCESS') {//transaction success  
            if (this.const_policy.hasOwnProperty('policy_number') === false || this.const_policy.policy_number === '' || this.const_policy.policy_number === null || isNaN(this.const_policy.policy_number) || this.const_policy.policy_number === 'Err_Pol_Num_Gnrt' || this.const_policy.policy_number.toString().length <= 8) {
                Error_Msg = 'ERROR IN POLICY NUMBER GENERATION';
            }
            if (Error_Msg === 'NO_ERR') {
                this.const_policy.transaction_status = 'SUCCESS';
                var policy_number = this.const_policy.policy_number;

                var pdf_file_name = this.constructor.name + '_Health_' + policy_number + '.pdf';
                var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                this.const_policy.policy_url = pdf_web_path_portal;

                var Processed_Request = this.insurer_master['service_logs']['pb_db_master']['Insurer_Response'];
                this.const_policy.edelweiss_health_data = JSON.stringify(Processed_Request);
                this.const_policy.feedfile_url = config.environment.downloadurl + config.pb_config.pdf_web_loc + "EdelweissHealth_FeedFile_" + policy_number + ".xlsx";
                this.const_policy.transaction_substatus = (Processed_Request['___mer___'] === "") ? 'IF' : 'ME';
                this.const_policy.transaction_substatus = (Processed_Request['___isUW___'] !== "yes" && Processed_Request['___common_uw_reason___'] === "") ? this.const_policy.transaction_substatus : 'UW';
                var nstpFlag = (this.const_policy.transaction_substatus !== 'IF') ? 'Yes' : 'No';
//                var policy_status = (this.const_policy.transaction_substatus !== 'IF') ? 'NSTP' : 'STP';

                var nominee_name = Processed_Request['___nominee_first_name___'] + ' ' + Processed_Request['___nominee_last_name___'];
                var isAddon = (Processed_Request['___dbmaster_pb_plan_name___'].includes('241')) ? 'YES' : 'NO';
//                var loading = isAddon === 'Yes' ? (0.25 * Processed_Request['___net_premium___']).toString() : 'NA';
//                var discount = this.lm_request['health_insurance_type'] === 'floater' ? ((0.05 * Processed_Request['___final_premium___']).toFixed(2)).toString() : 'NA';
                var proposer_addr = Processed_Request['___permanent_address_1___'] + ',' + Processed_Request['___permanent_address_2___'] + ',' + Processed_Request['___permanent_address_3___'];
                var floaterCombo = Processed_Request['___adult_count___'].toString() + 'Adult' + ' ' + Processed_Request['___child_count___'].toString() + 'Child';
                var already_covered = "NO";
                var existing_egic_policy = "";
                for (var i = 1; i <= Processed_Request['___member_count___'] + 1; i++) {
                    if (Processed_Request['___member_' + i + '_inc___'] !== '' && Processed_Request['___member_' + i + '_inc___'] !== undefined) {
                        if (Processed_Request['___member_' + i + '_question_1282_details___'] !== 'NO') {
                            already_covered = 'YES';
                            existing_egic_policy = Processed_Request['___member_' + i + '_question_1282_details___'];
                        }
                    }
                }

                var User_Data = require(appRoot + '/models/user_data');
                var objProduct = this;
                User_Data.findOne({"Request_Unique_Id": this.lm_request['search_reference_number']}, function (err, dbUserData) {
                    if (dbUserData) {
                        var Erp_Qt_Request_Core = dbUserData.Erp_Qt_Request_Core;
                        var crn = (objProduct.lm_request['crn']).toString();

                        //START Feed File Code=========================================================================================
                        var ff_file_name = "EdelweissHealth_FeedFile_" + policy_number + ".xlsx";
                        var ff_loc_path_portal = appRoot + "/tmp/pdf/" + ff_file_name;
                        var ff_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + ff_file_name;

                        var User_Data = require(appRoot + '/models/user_data');
                        var workbook = new excel.Workbook();
                        var worksheet = workbook.addWorksheet('Sheet 1');
                        var style = workbook.createStyle({
                            font: {
                                color: '#FF0800',
                                size: 12
                            },
                            numberFormat: '$#,##0.00; ($#,##0.00); -'
                        });
                        var styleh = workbook.createStyle({
                            font: {
                                bold: true,
                                size: 12
                            }
                        });

                        //row 1
                        worksheet.cell(1, 1).string('Policy_Number').style(styleh);
                        worksheet.cell(1, 2).string('IMD_Name_ID').style(styleh);
                        worksheet.cell(1, 3).string('IMIDName').style(styleh);//Source
                        worksheet.cell(1, 4).string('Quote_Type').style(styleh);
                        worksheet.cell(1, 5).string('Sales_Product').style(styleh);
                        worksheet.cell(1, 6).string('Effective_Date').style(styleh);
                        worksheet.cell(1, 7).string('Business_Partner_Type').style(styleh);
                        worksheet.cell(1, 8).string('Policy_Start_Date').style(styleh);
                        worksheet.cell(1, 9).string('Policy_End_Date').style(styleh);
                        worksheet.cell(1, 10).string('Policy_Tenure').style(styleh);
                        worksheet.cell(1, 11).string('Branch').style(styleh);
                        worksheet.cell(1, 12).string('Distribution_Channel').style(styleh);
                        worksheet.cell(1, 13).string('Employee_Id').style(styleh);
                        worksheet.cell(1, 14).string('Sales_Manager').style(styleh);
                        worksheet.cell(1, 15).string('Policy_Type').style(styleh);
                        worksheet.cell(1, 16).string('Floater_Combination').style(styleh);
                        worksheet.cell(1, 17).string('Portability').style(styleh);
                        worksheet.cell(1, 18).string('Opt_for_Health_241_Add_on').style(styleh);
                        worksheet.cell(1, 19).string('NSTP_Flag').style(styleh);
                        worksheet.cell(1, 20).string('TPA').style(styleh);
                        worksheet.cell(1, 21).string('Discrepancy_Flag').style(styleh);
                        worksheet.cell(1, 22).string('Proposer_Salutation').style(styleh);
                        worksheet.cell(1, 23).string('Proposer_First_Name').style(styleh);
                        worksheet.cell(1, 24).string('Proposer_Middle_Name').style(styleh);
                        worksheet.cell(1, 25).string('Proposer_Last_Name').style(styleh);
                        worksheet.cell(1, 26).string('Proposer_Date_Of_Birth').style(styleh);
                        worksheet.cell(1, 27).string('Proposer_Age').style(styleh);
                        worksheet.cell(1, 28).string('Proposer_Gender').style(styleh);
                        worksheet.cell(1, 29).string('Proposer_Marital_Status').style(styleh);
                        worksheet.cell(1, 30).string('Proposer_Nationality').style(styleh);
                        worksheet.cell(1, 31).string('Proposer_Telephone').style(styleh);
                        worksheet.cell(1, 32).string('Proposer_Mobile').style(styleh);
                        worksheet.cell(1, 33).string('Proposer_Pan_No').style(styleh);
                        worksheet.cell(1, 34).string('Proposer_ID_Proof_Type').style(styleh);
                        worksheet.cell(1, 35).string('Proposer_ID_Proof_No').style(styleh);
                        worksheet.cell(1, 36).string('Proposer_Adhaar_No').style(styleh);
                        worksheet.cell(1, 37).string('Proposer_Profession').style(styleh);
                        worksheet.cell(1, 38).string('Proposer_Annual_income').style(styleh);
                        worksheet.cell(1, 39).string('Proposer_Email').style(styleh);
                        worksheet.cell(1, 40).string('Proposer_Correspondence_Address').style(styleh);
                        worksheet.cell(1, 41).string('Proposer_CLocality').style(styleh);
                        worksheet.cell(1, 42).string('Proposer_CCity').style(styleh);
                        worksheet.cell(1, 43).string('Proposer_CPincode').style(styleh);
                        worksheet.cell(1, 44).string('Proposer_CState').style(styleh);
                        worksheet.cell(1, 45).string('Proposer_CLandmark').style(styleh);
                        worksheet.cell(1, 46).string('Proposer_Permanent_Address').style(styleh);
                        worksheet.cell(1, 47).string('Proposer_Locality').style(styleh);
                        worksheet.cell(1, 48).string('Proposer_City').style(styleh);
                        worksheet.cell(1, 49).string('Proposer_Pincode').style(styleh);
                        worksheet.cell(1, 50).string('Proposer_State').style(styleh);
                        worksheet.cell(1, 51).string('Proposer_Landmark').style(styleh);
                        worksheet.cell(1, 52).string('Previous_Insurance_Policy').style(styleh);
                        worksheet.cell(1, 53).string('Previous_Policy_Start_Date').style(styleh);
                        worksheet.cell(1, 54).string('Previous_Policy_End_Date').style(styleh);
                        worksheet.cell(1, 55).string('Previous_Policy_No').style(styleh);
                        worksheet.cell(1, 56).string('Insured_Name').style(styleh);
                        worksheet.cell(1, 57).string('Previous_Insurer').style(styleh);
                        worksheet.cell(1, 58).string('Previous_Claim_made').style(styleh);
                        worksheet.cell(1, 59).string('Sum_Insured').style(styleh);
                        worksheet.cell(1, 60).string('Do_you_have_any_existing_policy_of_EGIC').style(styleh);
                        worksheet.cell(1, 61).string('PolicyNo').style(styleh);
                        worksheet.cell(1, 62).string('Name_of_Family_Physician').style(styleh);
                        worksheet.cell(1, 63).string('Contact_No').style(styleh);
                        worksheet.cell(1, 64).string('Address').style(styleh);
                        worksheet.cell(1, 65).string('Ever_filed_a_claim_with_their_current_previous_insurer').style(styleh);
                        worksheet.cell(1, 66).string('Insurance_ever_declined_cancelled_charged_a_higher_premium_issued_with_special_condition').style(styleh);
                        worksheet.cell(1, 67).string('Covered_under_any_other_health_insurance_policy_with_the_Company').style(styleh);
                        worksheet.cell(1, 68).string('Nominee_Name').style(styleh);
                        worksheet.cell(1, 69).string('Nominee_Date_of_Birth').style(styleh);
                        worksheet.cell(1, 70).string('Nominee_Relationship_with_Insured').style(styleh);
                        worksheet.cell(1, 71).string('Share').style(styleh);
                        worksheet.cell(1, 72).string('Is_Nominee_Minor').style(styleh);
                        var col_index = 72;
                        for (var i = 1; i <= 5; i++) {
                            worksheet.cell(1, col_index + 1).string('Member_' + i + '_Salutation').style(styleh);
                            worksheet.cell(1, col_index + 2).string('Member_' + i + '_First_Name').style(styleh);
                            worksheet.cell(1, col_index + 3).string('Member_' + i + '_Middle_Name').style(styleh);
                            worksheet.cell(1, col_index + 4).string('Member_' + i + '_Last_Name').style(styleh);
                            worksheet.cell(1, col_index + 5).string('Member_' + i + '_Date_Of_Birth').style(styleh);
                            worksheet.cell(1, col_index + 6).string('Member_' + i + '_Age').style(styleh);
                            worksheet.cell(1, col_index + 7).string('Member_' + i + '_Gender').style(styleh);
                            worksheet.cell(1, col_index + 8).string('Member_' + i + '_Mother_Name').style(styleh);
                            worksheet.cell(1, col_index + 9).string('Member_' + i + '_Relationship_with_Insured').style(styleh);
                            worksheet.cell(1, col_index + 10).string('Member_' + i + '_Plan_Name').style(styleh);
                            worksheet.cell(1, col_index + 11).string('Member_' + i + '_Marital_Status').style(styleh);
                            worksheet.cell(1, col_index + 12).string('Member_' + i + '_Nationality').style(styleh);
                            worksheet.cell(1, col_index + 13).string('Member_' + i + '_Telephone').style(styleh);
                            worksheet.cell(1, col_index + 14).string('Member_' + i + '_Mobile').style(styleh);
                            worksheet.cell(1, col_index + 15).string('Member_' + i + '_ID_Proof_Type').style(styleh);
                            worksheet.cell(1, col_index + 16).string('Member_' + i + '_ID_Proof_No').style(styleh);
                            worksheet.cell(1, col_index + 17).string('Member_' + i + '_Adhaar_No').style(styleh);
                            worksheet.cell(1, col_index + 18).string('Member_' + i + '_PAN_Form_60').style(styleh);
                            worksheet.cell(1, col_index + 19).string('Member_' + i + '_Profession').style(styleh);
                            worksheet.cell(1, col_index + 20).string('Member_' + i + '_Annual_income').style(styleh);
                            worksheet.cell(1, col_index + 21).string('Member_' + i + '_Height').style(styleh);
                            worksheet.cell(1, col_index + 22).string('Member_' + i + '_Weight').style(styleh);
                            worksheet.cell(1, col_index + 23).string('Member_' + i + '_BMI').style(styleh);
                            worksheet.cell(1, col_index + 24).string('Member_' + i + '_Blood_Group').style(styleh);
                            worksheet.cell(1, col_index + 25).string('Member_' + i + '_Email').style(styleh);
                            worksheet.cell(1, col_index + 26).string('Member_' + i + '_Correspondence_Address').style(styleh);
                            worksheet.cell(1, col_index + 27).string('Member_' + i + '_CLocality').style(styleh);
                            worksheet.cell(1, col_index + 28).string('Member_' + i + '_CCity').style(styleh);
                            worksheet.cell(1, col_index + 29).string('Member_' + i + '_CPincode').style(styleh);
                            worksheet.cell(1, col_index + 30).string('Member_' + i + '_CState').style(styleh);
                            worksheet.cell(1, col_index + 31).string('Member_' + i + '_CLandmark').style(styleh);
                            worksheet.cell(1, col_index + 32).string('Member_' + i + '_Permanent_Address').style(styleh);
                            worksheet.cell(1, col_index + 33).string('Member_' + i + '_Locality').style(styleh);
                            worksheet.cell(1, col_index + 34).string('Member_' + i + '_City').style(styleh);
                            worksheet.cell(1, col_index + 35).string('Member_' + i + '_Pincode').style(styleh);
                            worksheet.cell(1, col_index + 36).string('Member_' + i + '_State').style(styleh);
                            worksheet.cell(1, col_index + 37).string('Member_' + i + '_Landmark').style(styleh);
                            worksheet.cell(1, col_index + 38).string('Member_' + i + '_Sum_Insured').style(styleh);
                            worksheet.cell(1, col_index + 39).string('Member_' + i + '_Do_you_have_any_existing_policy_of_EGIC').style(styleh);
                            worksheet.cell(1, col_index + 40).string('Member_' + i + '_PolicyNo').style(styleh);
                            worksheet.cell(1, col_index + 41).string('Member_' + i + '_Critical_Illness').style(styleh);
                            worksheet.cell(1, col_index + 42).string('Member_' + i + '_Restoration').style(styleh);
                            worksheet.cell(1, col_index + 43).string('Member_' + i + '_Recharge').style(styleh);
                            worksheet.cell(1, col_index + 44).string('Member_' + i + '_Voluntary_Co_Payment').style(styleh);
                            worksheet.cell(1, col_index + 45).string('Member_' + i + '_a_Diabetes').style(styleh);
                            worksheet.cell(1, col_index + 46).string('Member_' + i + '_b_Hypertension_High_BP').style(styleh);
                            worksheet.cell(1, col_index + 47).string('Member_' + i + '_c_Epilepsy').style(styleh);
                            worksheet.cell(1, col_index + 48).string('Member_' + i + '_d_High_Cholesterol').style(styleh);
                            worksheet.cell(1, col_index + 49).string('Member_' + i + '_e_Thyroid_disorder').style(styleh);
                            worksheet.cell(1, col_index + 50).string('Member_' + i + '_f_Asthma').style(styleh);
                            worksheet.cell(1, col_index + 51).string('Member_' + i + '_g_Kidney_Disorder').style(styleh);
                            worksheet.cell(1, col_index + 52).string('Member_' + i + '_h_Cancer').style(styleh);
                            worksheet.cell(1, col_index + 53).string('Member_' + i + '_i_Heart_Disease').style(styleh);
                            worksheet.cell(1, col_index + 54).string('Member_' + i + '_j_Liver_diseases').style(styleh);
                            worksheet.cell(1, col_index + 55).string('Member_' + i + '_2_Disease_Condition_Details').style(styleh);
                            worksheet.cell(1, col_index + 56).string('Member_' + i + '_3_PED').style(styleh);
                            worksheet.cell(1, col_index + 57).string('Member_' + i + '_4_Receiving_received_any_treatment_medication_undergone_surgeries_for_any_medical_condition_disability').style(styleh);
                            worksheet.cell(1, col_index + 58).string('Member_' + i + '_5_Please_provide_details_of_hereditary_medical_history_if_any').style(styleh);
                            worksheet.cell(1, col_index + 59).string('Member_' + i + '_6_Any_allergies_reaction_to_any_drug').style(styleh);
                            worksheet.cell(1, col_index + 60).string('Member_' + i + '_7_Any_Other_Disease').style(styleh);
                            worksheet.cell(1, col_index + 61).string('Member_' + i + '_Medical_Package_Type').style(styleh);
                            worksheet.cell(1, col_index + 62).string('Member_' + i + '_Medical_Cost').style(styleh);
                            worksheet.cell(1, col_index + 63).string('Member_' + i + '_Name_of_Family_Physician').style(styleh);
                            worksheet.cell(1, col_index + 64).string('Member_' + i + '_Contact_No').style(styleh);
                            worksheet.cell(1, col_index + 65).string('Member_' + i + '_Address').style(styleh);
                            worksheet.cell(1, col_index + 66).string('Member_' + i + '_Ever_filed_a_claim_with_their_current_previous_insurer').style(styleh);
                            worksheet.cell(1, col_index + 67).string('Member_' + i + '_Insurance_ever_declined_cancelled_charged_a_higher_premium_issued_with_special_condition').style(styleh);
                            worksheet.cell(1, col_index + 68).string('Member_' + i + '_Covered_under_any_other_health_insurance_policy_with_the_Company').style(styleh);
                            worksheet.cell(1, col_index + 69).string('Member_' + i + '_Details').style(styleh);
                            worksheet.cell(1, col_index + 70).string('Member_' + i + '_Nominee_Name').style(styleh);
                            worksheet.cell(1, col_index + 71).string('Member_' + i + '_Nominee_Date_of_Birth').style(styleh);
                            worksheet.cell(1, col_index + 72).string('Member_' + i + '_Relationship_with_Insured_Beneficiary').style(styleh);
                            worksheet.cell(1, col_index + 73).string('Member_' + i + '_Is_Nominee_Minor').style(styleh);
                            col_index += 73;
                        }
                        worksheet.cell(1, col_index + 1).string('Basic_Cover_Premium').style(styleh);
                        worksheet.cell(1, col_index + 2).string('Total_Discount_Amount').style(styleh);
                        worksheet.cell(1, col_index + 3).string('Total_Premium_Before_Tax').style(styleh);
                        worksheet.cell(1, col_index + 4).string('Total_Premium_After_Tax').style(styleh);
                        worksheet.cell(1, col_index + 5).string('Cheque_From').style(styleh);
                        worksheet.cell(1, col_index + 6).string('Bank_Name').style(styleh);
                        worksheet.cell(1, col_index + 7).string('Bank_Branch').style(styleh);
                        worksheet.cell(1, col_index + 8).string('IFSC_code').style(styleh);
                        worksheet.cell(1, col_index + 9).string('Account_No').style(styleh);
                        worksheet.cell(1, col_index + 10).string('Cheque_Date').style(styleh);
                        worksheet.cell(1, col_index + 11).string('Cheque_No').style(styleh);
                        worksheet.cell(1, col_index + 12).string('Payer_Name').style(styleh);
                        worksheet.cell(1, col_index + 13).string('Amount').style(styleh);
                        worksheet.cell(1, col_index + 14).string('Policy_Status').style(styleh);
                        worksheet.cell(1, col_index + 15).string('Premium_Type').style(styleh);
                        worksheet.cell(1, col_index + 16).string('Sub Intermediary Category').style(styleh);
                        worksheet.cell(1, col_index + 17).string('Sub Intermediary Code').style(styleh);
                        worksheet.cell(1, col_index + 18).string('Sub Intermediary Name').style(styleh);
                        worksheet.cell(1, col_index + 19).string('Sub Intermediary Phone Email').style(styleh);
                        worksheet.cell(1, col_index + 20).string('POSP PAN Aadhar No').style(styleh);
                         worksheet.cell(1, col_index + 21).string('ekycValidateKey').style(styleh);

                        //row 2
                        worksheet.cell(2, 1).string(objProduct.const_policy.policy_number);
                        worksheet.cell(2, 2).string('onlinepolicy@policyboss.com');
                        worksheet.cell(2, 3).string('Landmark');
                        worksheet.cell(2, 4).string('Full');
                        worksheet.cell(2, 5).string('Edelweiss Health Insurance');
                        worksheet.cell(2, 6).string(Processed_Request['___policy_start___']);
                        worksheet.cell(2, 7).string('Person');
                        worksheet.cell(2, 8).string(Processed_Request['___policy_start___']);
                        worksheet.cell(2, 9).string(Processed_Request['___policy_end___']);
                        worksheet.cell(2, 10).string(Processed_Request['___policy_tenure___'].toString());
                        worksheet.cell(2, 11).string('Mumbai H.O.');
                        worksheet.cell(2, 12).string('Web Aggregator');
                        worksheet.cell(2, 13).string('25159');
                        worksheet.cell(2, 14).string('Abirami Iyer');
                        worksheet.cell(2, 15).string(objProduct.lm_request['health_insurance_type']);
                        worksheet.cell(2, 16).string(floaterCombo);//floater
                        worksheet.cell(2, 17).string('No');
                        worksheet.cell(2, 18).string(isAddon);
                        worksheet.cell(2, 19).string(nstpFlag);//NSTP
                        worksheet.cell(2, 20).string('');//TPA
                        worksheet.cell(2, 21).string('No');
                        worksheet.cell(2, 22).string(Processed_Request['___salutation___']);
                        worksheet.cell(2, 23).string(Processed_Request['___first_name___']);
                        worksheet.cell(2, 24).string(Processed_Request['___middle_name___']);
                        worksheet.cell(2, 25).string(Processed_Request['___last_name___']);
                        worksheet.cell(2, 26).string(Processed_Request['___birth_date___']);
                        worksheet.cell(2, 27).string('');
                        worksheet.cell(2, 28).string(Processed_Request['___gender_2___']);
                        worksheet.cell(2, 29).string(Processed_Request['___marital___']);
                        worksheet.cell(2, 30).string('Indian');
                        worksheet.cell(2, 31).string(Processed_Request['___mobile___'].toString());
                        worksheet.cell(2, 32).string(Processed_Request['___mobile___'].toString());
                        worksheet.cell(2, 33).string('');
                        worksheet.cell(2, 34).string('');
                        worksheet.cell(2, 35).string(Processed_Request['___pan___']);
                        worksheet.cell(2, 36).string('');//aadhar
                        worksheet.cell(2, 37).string(Processed_Request['___occupation___']);
                        worksheet.cell(2, 38).string(Processed_Request['___annual_income___']);
                        worksheet.cell(2, 39).string(Processed_Request['___email___']);
                        worksheet.cell(2, 40).string(proposer_addr);
                        worksheet.cell(2, 41).string(Processed_Request['___city___']);
                        worksheet.cell(2, 42).string(Processed_Request['___city___']);
                        worksheet.cell(2, 43).string(Processed_Request['___permanent_pincode___']);
                        worksheet.cell(2, 44).string(Processed_Request['___state___']);
                        worksheet.cell(2, 45).string('');
                        worksheet.cell(2, 46).string('YES');
                        worksheet.cell(2, 47).string('');
                        worksheet.cell(2, 48).string('');
                        worksheet.cell(2, 49).string('');
                        worksheet.cell(2, 50).string('');
                        worksheet.cell(2, 51).string('');
                        worksheet.cell(2, 52).string('NA');
                        worksheet.cell(2, 53).string('');
                        worksheet.cell(2, 54).string('');
                        worksheet.cell(2, 55).string('NA');//BD
                        worksheet.cell(2, 56).string('NA');
                        worksheet.cell(2, 57).string('NA');
                        worksheet.cell(2, 58).string('NA');
                        worksheet.cell(2, 59).string(Processed_Request['___health_insurance_si___'].toString());
                        worksheet.cell(2, 60).string(already_covered);
                        worksheet.cell(2, 61).string(existing_egic_policy);
                        worksheet.cell(2, 62).string('NA');
                        worksheet.cell(2, 63).string('NA');
                        worksheet.cell(2, 64).string('NA');
                        worksheet.cell(2, 65).string('');
                        worksheet.cell(2, 66).string('');
                        worksheet.cell(2, 67).string('');
                        worksheet.cell(2, 68).string(nominee_name);//nominee
                        worksheet.cell(2, 69).string(Processed_Request['___nominee_birth_date___']);
                        worksheet.cell(2, 70).string(Processed_Request['___nominee_relation___']);
                        worksheet.cell(2, 71).string('100%');
                        worksheet.cell(2, 72).string('No');
                        var index = 72;
                        for (var i = 1; i <= Processed_Request['___member_count___'] + 1; i++) {
                            if (Processed_Request['___member_' + i + '_inc___'] !== '' && Processed_Request['___member_' + i + '_inc___'] !== undefined) {
                                worksheet.cell(2, index + 1).string(Processed_Request['___member_' + i + '_salutation___']);//member 1
                                worksheet.cell(2, index + 2).string(Processed_Request['___member_' + i + '_first_name___']);
                                worksheet.cell(2, index + 3).string('');
                                worksheet.cell(2, index + 4).string(Processed_Request['___member_' + i + '_last_name___']);
                                worksheet.cell(2, index + 5).string(Processed_Request['___member_' + i + '_birth_date___']);
                                worksheet.cell(2, index + 6).string(Processed_Request['___member_' + i + '_age___'].toString());
                                worksheet.cell(2, index + 7).string(Processed_Request['___member_' + i + '_gender_2___']);
                                worksheet.cell(2, index + 8).string('');
                                worksheet.cell(2, index + 9).string(Processed_Request['___member_' + i + '_relation___']);
                                worksheet.cell(2, index + 10).string(Processed_Request['___dbmaster_plan_name___']);
                                worksheet.cell(2, index + 11).string(Processed_Request['___member_' + i + '_marital_status___']);
                                worksheet.cell(2, index + 12).string('Indian');
                                worksheet.cell(2, index + 13).string(Processed_Request['___mobile___'].toString());
                                worksheet.cell(2, index + 14).string(Processed_Request['___mobile___'].toString());
                                worksheet.cell(2, index + 15).string('NA');
                                worksheet.cell(2, index + 16).string('NA');
                                worksheet.cell(2, index + 17).string('NA');
                                worksheet.cell(2, index + 18).string('NA');
                                worksheet.cell(2, index + 19).string(Processed_Request['___member_' + i + '_occupation___']);//CU
                                worksheet.cell(2, index + 20).string('NA');
                                worksheet.cell(2, index + 21).string(Processed_Request['___member_' + i + '_height___']);
                                worksheet.cell(2, index + 22).string(Processed_Request['___member_' + i + '_weight___']);
                                worksheet.cell(2, index + 23).string(Processed_Request['___member_' + i + '_bmi___'].toString());
                                worksheet.cell(2, index + 24).string(Processed_Request['___member_' + i + '_blood_group___']);
                                worksheet.cell(2, index + 25).string(Processed_Request['___email___']);
                                worksheet.cell(2, index + 26).string(proposer_addr);
                                worksheet.cell(2, index + 27).string(Processed_Request['___city___']);
                                worksheet.cell(2, index + 28).string(Processed_Request['___city___']);
                                worksheet.cell(2, index + 29).string(Processed_Request['___permanent_pincode___']);
                                worksheet.cell(2, index + 30).string(Processed_Request['___state___']);
                                worksheet.cell(2, index + 31).string('');
                                worksheet.cell(2, index + 32).string(proposer_addr);
                                worksheet.cell(2, index + 33).string(Processed_Request['___city___']);
                                worksheet.cell(2, index + 34).string(Processed_Request['___city___']);
                                worksheet.cell(2, index + 35).string(Processed_Request['___permanent_pincode___']);
                                worksheet.cell(2, index + 36).string(Processed_Request['___state___']);
                                worksheet.cell(2, index + 37).string('');
                                worksheet.cell(2, index + 38).string(Processed_Request['___health_insurance_si___'].toString());//DO
                                worksheet.cell(2, index + 39).string(already_covered);
                                worksheet.cell(2, index + 40).string(existing_egic_policy);
                                worksheet.cell(2, index + 41).string(Processed_Request['___critical_plan_cover___']);
                                worksheet.cell(2, index + 42).string(Processed_Request['___restoration_plan_cover___']);
                                worksheet.cell(2, index + 43).string(Processed_Request['___recharge_plan_cover___']);
                                worksheet.cell(2, index + 44).string('0%');
                                worksheet.cell(2, index + 45).string(Processed_Request['___member_' + i + '_question_1266_details___']);//diabetes-DV
                                worksheet.cell(2, index + 46).string(Processed_Request['___member_' + i + '_question_1267_details___']);
                                worksheet.cell(2, index + 47).string(Processed_Request['___member_' + i + '_question_1268_details___']);
                                worksheet.cell(2, index + 48).string(Processed_Request['___member_' + i + '_question_1269_details___']);
                                worksheet.cell(2, index + 49).string(Processed_Request['___member_' + i + '_question_1270_details___']);
                                worksheet.cell(2, index + 50).string(Processed_Request['___member_' + i + '_question_1271_details___']);
                                worksheet.cell(2, index + 51).string(Processed_Request['___member_' + i + '_question_1272_details___']);
                                worksheet.cell(2, index + 52).string(Processed_Request['___member_' + i + '_question_1273_details___']);
                                worksheet.cell(2, index + 53).string(Processed_Request['___member_' + i + '_question_1274_details___']);
                                worksheet.cell(2, index + 54).string(Processed_Request['___member_' + i + '_question_1275_details___']);
                                worksheet.cell(2, index + 55).string('NA');
                                worksheet.cell(2, index + 56).string(Processed_Request['___member_' + i + '_ped___']);
                                worksheet.cell(2, index + 57).string(Processed_Request['___member_' + i + '_question_1276_details___']);
                                worksheet.cell(2, index + 58).string(Processed_Request['___member_' + i + '_question_1277_details___']);
                                worksheet.cell(2, index + 59).string(Processed_Request['___member_' + i + '_question_1278_details___']);
                                worksheet.cell(2, index + 60).string(Processed_Request['___member_' + i + '_question_1279_details___']);
                                worksheet.cell(2, index + 61).string('NA');
                                worksheet.cell(2, index + 62).string('NA');
                                worksheet.cell(2, index + 63).string('NA');
                                worksheet.cell(2, index + 64).string(Processed_Request['___mobile___'].toString());
                                worksheet.cell(2, index + 65).string(proposer_addr);//EP
                                worksheet.cell(2, index + 66).string(Processed_Request['___member_' + i + '_question_1280_details___']);
                                worksheet.cell(2, index + 67).string(Processed_Request['___member_' + i + '_question_1281_details___']);
                                worksheet.cell(2, index + 68).string('');
                                worksheet.cell(2, index + 69).string('');
                                worksheet.cell(2, index + 70).string(Processed_Request['___member_' + i + '_nominee_name___']);
                                worksheet.cell(2, index + 71).string(Processed_Request['___member_' + i + '_nominee_dob___']);
                                worksheet.cell(2, index + 72).string(Processed_Request['___member_' + i + '_nominee_rel___']);
                                worksheet.cell(2, index + 73).string('No');
                                index += 73;
                            }
                        }
                        var blank_count = 5 - Processed_Request['___member_count___'];
                        index += 73 * blank_count;

                        worksheet.cell(2, index + 1).string(Processed_Request['___base_premium___'].toString());
                        worksheet.cell(2, index + 2).string('');
                        worksheet.cell(2, index + 3).string(Processed_Request['___net_premium___'].toString());
                        worksheet.cell(2, index + 4).string(Processed_Request['___final_premium___'].toString());
                        worksheet.cell(2, index + 5).string('CUSTOMER');
                        worksheet.cell(2, index + 6).string('PAYU');
                        worksheet.cell(2, index + 7).string('Mumbai');
                        worksheet.cell(2, index + 8).string('');
                        worksheet.cell(2, index + 9).string('1234');
                        worksheet.cell(2, index + 10).string(Processed_Request['___policy_start___']);
                        worksheet.cell(2, index + 11).string(objProduct.processed_request['___transaction_id___']);
                        worksheet.cell(2, index + 12).string(Processed_Request['___first_name___']);
                        worksheet.cell(2, index + 13).string(Processed_Request['___final_premium___'].toString());
                        worksheet.cell(2, index + 14).string('');//policystatus
                        worksheet.cell(2, index + 15).string(Processed_Request['___premium_type___']);
                        if (dbUserData.Erp_Qt_Request_Core['___is_posp___'] === 'yes' && dbUserData.Erp_Qt_Request_Core['___posp_ss_id___'] > 0) {
                            worksheet.cell(2, index + 16).string('POSP');
                            worksheet.cell(2, index + 17).string((dbUserData.Erp_Qt_Request_Core['___posp_ss_id___']).toString());
                            worksheet.cell(2, index + 18).string(dbUserData.Erp_Qt_Request_Core['___posp_first_name___'] + " " + dbUserData.Erp_Qt_Request_Core['___posp_middle_name___'] + " " + dbUserData.Erp_Qt_Request_Core['___posp_last_name___']);
                            worksheet.cell(2, index + 19).string('');
                            worksheet.cell(2, index + 20).string(dbUserData.Erp_Qt_Request_Core['___posp_pan_no___']);
                        } else {
                            worksheet.cell(2, index + 16).string('');
                            worksheet.cell(2, index + 17).string('');
                            worksheet.cell(2, index + 18).string('');
                            worksheet.cell(2, index + 19).string('');
                            worksheet.cell(2, index + 20).string('');
                        }
                        worksheet.cell(2, index + 21).string(dbUserData.Erp_Qt_Request_Core['___kyc_no___'].toString());

                        workbook.write(ff_loc_path_portal);//ff_loc_path_portal//ff_file_name

                        var Email = require('../../models/email');
                        var objModelEmail = new Email();
                        var sub = '[' + config.environment.name.toString().toUpperCase() + '] CRN-' + crn + ' INFO-PolicyBoss.com-Policy Edelweiss Health Feed File:' + policy_number;
                        email_body = '<html><body><p>Hello,</p><BR/><p>Please find below the URL of Feed File of Edelweiss Health Policy.</p>'
                                + '<BR><p>Policy Number : ' + policy_number + '</p><BR><p>Feed file URL : ' + ff_web_path_portal + ' </p></body></html>';
                        if (config.environment.name === 'Production') {
                            objModelEmail.send('noreply@landmarkinsurance.co.in', 'revati.ghadge@policyboss.com', sub, email_body, 'anuj.singh@policyboss.com', '', '');
                        } else {
                            objModelEmail.send('noreply@landmarkinsurance.co.in', 'revati.ghadge@policyboss.com', sub, email_body, '', '', '');
                        }

//END Feed File Code============================================================================================

                    }
                });
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
EdelweissHealth.prototype.calculate_bmi = function (i) {
    var height = this.prepared_request['member_' + i + '_height'];
    var weight = this.prepared_request['member_' + i + '_weight'];

    var bmi = Number(((weight / height / height) * 10000).toFixed(2));
    this.prepared_request['member_' + i + '_bmi'] = bmi;
    this.processed_request['___member_' + i + '_bmi___'] = bmi;

};
EdelweissHealth.prototype.check_bmi = function (bmi) {
    if (bmi <= 16.09 || bmi >= 40) {
        return "no";
    } else if ((bmi >= 16.10 && bmi < 18) || (bmi > 35 && bmi < 40)) {
        return "uw";
    } else {
        return "yes";
    }
};
EdelweissHealth.prototype.check_mer = function () {
    if ((this.prepared_request['health_insurance_si'] - 0) <= 2000000) {
        if (this.processed_request["___member_1_age___"] >= 65) {
            if (this.processed_request["___member_1_age___"] === 65) {
                var isSixtyFive = this.age_is_sixtyfive();
                return (isSixtyFive === 'no' ? "SET 1" : '');
            } else {
                return "SET 1";
            }
        } else if (this.processed_request["___member_1_age___"] > 35) {
            if (this.processed_request['___member_1_bmi_normal___'] !== "yes") {
                return "SET 1";
            }
        }
    }
    if ((this.prepared_request['health_insurance_si'] - 0 > 2000000) && (this.prepared_request['health_insurance_si'] - 0 <= 5000000)) {
        if (this.processed_request["___member_1_age___"] > 35 && this.processed_request["___member_1_age___"] <= 60) {
            return "SET 1";
        } else if (this.processed_request["___member_1_age___"] > 60) {
            return "SET 2";
        }
    }
    if ((this.prepared_request['health_insurance_si'] - 0 > 5000000) && (this.prepared_request['health_insurance_si'] - 0 <= 10000000)) {
        if (this.processed_request["___member_1_age___"] <= 18) {
            return "SET 5";
        } else if (this.processed_request["___member_1_age___"] > 18 && this.processed_request["___member_1_age___"] <= 40) {
            return "SET 3";
        } else if (this.processed_request["___member_1_age___"] > 40) {
            return "SET 4";
        }
    }
    return '';
};
EdelweissHealth.prototype.get_member_relation = function (i) {
    console.log(this.constructor.name, 'get_member_relation', ' Start EdelweissHealth');
    var gender = this.lm_request['member_' + i + '_gender'];
    console.log("Gender in EdelweissHealth " + gender);
    if (this.prepared_request["relation"] === 'MOTHER' || this.prepared_request["relation"] === 'FATHER') {
        return(gender === 'M' ? 'SON' : 'DAUGHTER');
    }
    if (this.prepared_request["relation"] === 'SON' || this.prepared_request["relation"] === 'DAUGHTER') {
        return(gender === 'M' ? 'FATHER' : 'MOTHER');
    }
    if (this.prepared_request["relation"] === 'SPOUSE') {
        if (i >= 3) {
            return(gender === 'M' ? 'SON' : 'DAUGHTER');
        } else if (i === 1) {
            return 'SPOUSE';
        }
    }
    if (this.prepared_request["relation"] === 'SELF') {
        if (i >= 3) {
            return(gender === 'M' ? 'SON' : 'DAUGHTER');
        } else if (i === 1) {
            return 'SELF';
        } else if (i === 2) {
            return 'SPOUSE';
        }
    }
    return '';
    console.log(this.constructor.name, 'get_member_relation', 'End EdelweissHealth');
};
EdelweissHealth.prototype.policy_start = function () {
    var today = moment().utcOffset("+05:30");
    var pol_start_date = today.format('DD-MM-YYYY');
    return pol_start_date;
};
EdelweissHealth.prototype.policy_end = function () {
    var today = moment().utcOffset("+05:30");
    var pol_end_date = today.add(this.lm_request['policy_tenure'], 'year').subtract(1, 'days').format('DD-MM-YYYY');
    return pol_end_date;
};
EdelweissHealth.prototype.age_is_sixtyfive = function () {
    var today = moment().utcOffset("+05:30");
    var current_date = today.format('DD/MM/YYYY');
    var current_day = current_date.split('/')['0'];
    var current_month = current_date.split('/')['1'];
    var birth_date = this.processed_request['___member_1_birth_date___'];
    var birth_day = birth_date.split('-')['0'];
    var birth_month = birth_date.split('-')['1'];
    if (current_day === birth_day && current_month === birth_month) {
        return 'yes';
    }
    return 'no';
};
EdelweissHealth.prototype.is_valid_plan = function (lm_request, planCode) {
    console.log('EdelweissHealth is_valid_plan', 'start');
    var base_plan = 'Platinum';
    if ([314, 320, 321, 324].indexOf(planCode) > -1) {
        base_plan = 'Silver';
    } else if ([315, 322].indexOf(planCode) > -1) {
        base_plan = 'Gold';
    }
    var index = -1;
    var Plans = [
        {'code': "Silver", 'min_si': 99000, 'max_si': 500000},
        {'code': "Gold", 'min_si': 400000, 'max_si': 2000000},
        {'code': "Platinum", 'min_si': 1050000, 'max_si': 10000000}
    ];
    index = Plans.findIndex(x => x.code === base_plan
                && x.min_si < (lm_request['health_insurance_si'] - 0)
                && x.max_si >= (lm_request['health_insurance_si'] - 0));
    return (index > -1 ? true : false);
    console.log('EdelweissHealth is_valid_plan', 'End');
};
EdelweissHealth.prototype.premium_breakup_schema = {
    "net_premium": "premium",
    "CGST": "CGST",
    "SGST": "SGST",
    "service_tax": "serviceTax",
    "final_premium": "totalPremium",
    "base_premium": "base_premium",
    "loading": "loading"
};
module.exports = EdelweissHealth;