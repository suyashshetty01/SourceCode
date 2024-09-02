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
var request = require('request');
var moment = require('moment');
function StarHealth() {

}
util.inherits(StarHealth, Health);

StarHealth.prototype.lm_request_single = {};
StarHealth.prototype.insurer_integration = {};
StarHealth.prototype.insurer_addon_list = [];
StarHealth.prototype.insurer = {};
StarHealth.prototype.insurer_date_format = 'MMMM DD,YYYY';
StarHealth.prototype.const_insurer_suminsured = [100000, 150000, 200000, 300000, 400000, 500000, 750000, 1000000, 1500000, 2000000, 2500000, 5000000, 7500000, 10000000];


StarHealth.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
StarHealth.prototype.insurer_product_field_process_pre = function () {
    var member = 1;
    var adult = this.lm_request['adult_count'];
    var child = this.lm_request['child_count'];
    if (this.lm_request['method_type'] === 'Premium') {
        for (member = 1; member <= this.lm_request['adult_count']; member++) {
            this.prepared_request['member_' + member + '_inc'] = member - 1;
            this.processed_request['___member_' + member + '_inc___'] = member - 1;
            this.prepared_request['member_' + member + '_birth_date'] = moment(this.lm_request['member_' + member + '_birth_date'], 'YYYY-MM-DD').format('MMMM DD, YYYY');
            this.processed_request['___member_' + member + '_birth_date___'] = this.prepared_request['member_' + member + '_birth_date'];
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            if (this.lm_request['adult_count'] === 1) {
                this.prepared_request['member_' + member + '_inc'] = member - 2;
                this.processed_request['___member_' + member + '_inc___'] = member - 2;
                this.prepared_request['member_' + member + '_birth_date'] = moment(this.lm_request['member_' + member + '_birth_date'], 'YYYY-MM-DD').format('MMMM DD, YYYY');
            this.processed_request['___member_' + member + '_birth_date___'] = this.prepared_request['member_' + member + '_birth_date'];
            } else {
                this.prepared_request['member_' + member + '_inc'] = member - 1;
                this.processed_request['___member_' + member + '_inc___'] = member - 1;
                this.prepared_request['member_' + member + '_birth_date'] = moment(this.lm_request['member_' + member + '_birth_date'], 'YYYY-MM-DD').format('MMMM DD, YYYY');
            this.processed_request['___member_' + member + '_birth_date___'] = this.prepared_request['member_' + member + '_birth_date'];
            }
        }
        if (this.prepared_request['Plan_Code'] === 'COMPREHENSIVE' && this.lm_request['member_count'] === 1) {
            this.prepared_request['Plan_Code'] = 'COMPREHENSIVEIND';
            this.processed_request['___Plan_Code___'] = 'COMPREHENSIVEIND';
//            this.prepared_request['scheme_id'] = 0;
//            this.processed_request['___scheme_id___'] = 0;
        }
        if (this.prepared_request['Plan_Code'] === 'DIABETESFMLY' && this.lm_request['member_count'] === 1) {
            this.prepared_request['Plan_Code'] = 'DIABETESIND';
            this.processed_request['___Plan_Code___'] = 'DIABETESIND';
        }
        if (this.prepared_request['Plan_Code'] === 'REDCARPET' && this.lm_request['member_count'] > 1) {
            this.prepared_request['Plan_Code'] = 'REDCARPETFMLY';
            this.processed_request['___Plan_Code___'] = 'REDCARPETFMLY';
        }
        var obj_si_id = this.get_si_id(this.prepared_request['Plan_Name']);
        this.prepared_request['health_insurance_si_id'] = obj_si_id;
        this.processed_request['___health_insurance_si_id___'] = this.prepared_request['health_insurance_si_id'];
    } else if (this.lm_request['method_type'] === 'Customer') {
        if (this.prepared_request['dbmaster_pb_plan_name'] === 'COMPREHENSIVE') {
            var txt_ignore = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
            var txt_ignore_with = "";
            this.method_content = this.method_content.replace(txt_ignore, txt_ignore_with);
            var txt_ignore = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start_Diab-->', '<!--InsurersDetail_End_Diab-->', true);
            var txt_ignore_with = "";
            this.method_content = this.method_content.replace(txt_ignore, txt_ignore_with);
            var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start_Comp-->', '<!--InsurersDetail_End_Comp-->', true);
            var txt_replace_with = "";
        } else if (this.prepared_request['dbmaster_pb_plan_name'] === 'DIABETES SAFE') {
            var txt_ignore = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
            var txt_ignore_with = "";
            this.method_content = this.method_content.replace(txt_ignore, txt_ignore_with);
            var txt_ignore = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start_Comp-->', '<!--InsurersDetail_End_Comp-->', true);
            var txt_ignore_with = "";
            this.method_content = this.method_content.replace(txt_ignore, txt_ignore_with);
            var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start_Diab-->', '<!--InsurersDetail_End_Diab-->', true);
            var txt_replace_with = "";
        } else {
            var txt_ignore = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start_Comp-->', '<!--InsurersDetail_End_Comp-->', true);
            var txt_ignore_with = "";
            this.method_content = this.method_content.replace(txt_ignore, txt_ignore_with);
            var txt_ignore = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start_Diab-->', '<!--InsurersDetail_End_Diab-->', true);
            var txt_ignore_with = "";
            this.method_content = this.method_content.replace(txt_ignore, txt_ignore_with);
            var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
            var txt_replace_with = "";
        }

        for (member = 1; member <= this.lm_request['adult_count']; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
            this.prepared_request['nominee_relation'] = this.lm_request['nominee_relation_text'];
            this.processed_request['___nominee_relation___'] = this.prepared_request['nominee_relation'];
            this.prepared_request['member_' + member + '_gender'] = this.lm_request['member_' + member + '_gender'] === 'M' ? 'Male' : 'Female';
            this.processed_request['___member_' + member + '_gender___'] = this.prepared_request['member_' + member + '_gender']; 
            this.prepared_request['member_' + member + '_birth_date'] = moment(this.lm_request['member_' + member + '_birth_date'], 'YYYY-MM-DD').format('MMMM DD, YYYY');
            this.processed_request['___member_' + member + '_birth_date___'] = this.prepared_request['member_' + member + '_birth_date'];
            this.is_accident_applicable(member, adult, child);

            for (var key in this.lm_request) {
                if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1 && key.includes("member_" + member)) {
                    var ques_detail = key.replace('_type', '_details');
                    if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                        if (this.lm_request[ques_detail] === false) {
                            this.prepared_request[ques_detail] = '0';
                            this.processed_request['___' + ques_detail + '___'] = '0';
                            this.processed_request['___' + ques_detail + '1___'] = 'NONE';
                        } else {
                            this.prepared_request[ques_detail] = '1';
                            this.processed_request['___' + ques_detail + '___'] = '1';
                        }
                    } else if (this.lm_request[key].toString().toLowerCase() === 'since') {
                        this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                        this.processed_request['___' + ques_detail + '___'] = this.lm_request[ques_detail];
                        this.processed_request['___' + ques_detail + '1___'] = this.lm_request[ques_detail];
                    }

                }
				// mg** additional

                if (key.indexOf('_additionalQue_1') > -1) {
                    this.prepared_request['member_' + member + '_additionalQue_1'] = (this.lm_request.hasOwnProperty('member_' + member + '_additionalQue_1') && this.lm_request['member_' + member + '_additionalQue_1'] === "yes") ? 1 : 0;
                    this.processed_request['___member_' + member + '_additionalQue_1___'] = this.prepared_request['member_' + member + '_additionalQue_1'];
                    this.prepared_request['member_' + member + '_additionalQue_1_subQue_1'] = (this.lm_request.hasOwnProperty('member_' + member + '_additionalQue_1_subQue_1') && this.lm_request['member_' + member + '_additionalQue_1_subQue_1'] === "TRUE") ? 1 : 0;
                    this.processed_request['___member_' + member + '_additionalQue_1_subQue_1___'] = this.prepared_request['member_' + member + '_additionalQue_1_subQue_1'];
                    this.prepared_request['member_' + member + '_additionalQue_1_subQue_2'] = (this.lm_request.hasOwnProperty('member_' + member + '_additionalQue_1_subQue_2') && this.lm_request['member_' + member + '_additionalQue_1_subQue_2'] === "TRUE") ? 1 : 0;
                    this.processed_request['___member_' + member + '_additionalQue_1_subQue_2___'] = this.prepared_request['member_' + member + '_additionalQue_1_subQue_2'];
                    if (this.lm_request.hasOwnProperty('member_' + member + '_additionalQue_1') && this.lm_request['member_' + member + '_additionalQue_1'] === "yes") {
                        if (this.lm_request.hasOwnProperty('member_' + member + '_additionalQue_1_subQue_1') && this.lm_request['member_' + member + '_additionalQue_1_subQue_1'] === "FALSE" && (this.lm_request.hasOwnProperty('member_' + member + '_additionalQue_1_subQue_2') && this.lm_request['member_' + member + '_additionalQue_1_subQue_2'] === "FALSE")) {
                            this.prepared_request['member_' + member + '_additionalQue_1_subQue_3'] = (this.lm_request.hasOwnProperty('member_' + member + '_additionalQue_1_subQue_3') && this.lm_request['member_' + member + '_additionalQue_1_subQue_3']) ? this.lm_request['member_' + member + '_additionalQue_1_subQue_3'] : "NONE";
                        } else {
                            this.prepared_request['member_' + member + '_additionalQue_1_subQue_3'] = "NONE";
                        }
                    } else {
                        this.prepared_request['member_' + member + '_additionalQue_1_subQue_3'] = "NONE";
                    }
                    this.processed_request['___member_' + member + '_additionalQue_1_subQue_3___'] = this.prepared_request['member_' + member + '_additionalQue_1_subQue_3'];
//                        
//                          this.prepared_request['member_' + member + '_additionalQue_1_subQue_3'] =  (this.lm_request.hasOwnProperty('member_' + member + '_additionalQue_1_subQue_3') && this.lm_request['member_' + member + '_additionalQue_1_subQue_3']) ? this.lm_request['member_' + member + '_additionalQue_1_subQue_3'] : "NONE"; 
//                        this.processed_request['___member_' + member + '_additionalQue_1_subQue_3___'] = this.prepared_request['member_' + member + '_additionalQue_1_subQue_3'];
                }
            }
			
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
            this.prepared_request['member_' + member + '_gender'] = this.lm_request['member_' + member + '_gender'] === 'M' ? 'Male' : 'Female';
            this.processed_request['___member_' + member + '_gender___'] = this.prepared_request['member_' + member + '_gender']; 
            this.prepared_request['member_' + member + '_birth_date'] = moment(this.lm_request['member_' + member + '_birth_date'], 'YYYY-MM-DD').format('MMMM DD, YYYY');
            this.processed_request['___member_' + member + '_birth_date___'] = this.prepared_request['member_' + member + '_birth_date'];
            this.prepared_request['member_' + member + '_occupation'] = "12";// student//this.lm_request['member_' + member + '_occupation'];
            this.processed_request['___member_' + member + '_occupation___'] = this.prepared_request['member_' + member + '_occupation'];
            this.is_accident_applicable(member, adult, child);

            for (var key in this.lm_request) {
                if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1 && key.includes("member_" + member)) {
                    var ques_detail = key.replace('_type', '_details');
                    if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                        if (this.lm_request[ques_detail] === false) {
                            this.prepared_request[ques_detail] = '0';
                            this.processed_request['___' + ques_detail + '___'] = '0';
                            this.processed_request['___' + ques_detail + '1___'] = 'NONE';
                        } else {
                            this.prepared_request[ques_detail] = '1';
                            this.processed_request['___' + ques_detail + '___'] = '1';
                        }
                    } else if (this.lm_request[key].toString().toLowerCase() === 'since') {
                        this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                        this.processed_request['___' + ques_detail + '___'] = this.lm_request[ques_detail];
                        this.processed_request['___' + ques_detail + '1___'] = this.lm_request[ques_detail];
                    }

                }
				// mg** additional

                if (key.indexOf('_additionalQue_1') > -1) {
                    this.prepared_request['member_' + member + '_additionalQue_1'] = (this.lm_request.hasOwnProperty('member_' + member + '_additionalQue_1') && this.lm_request['member_' + member + '_additionalQue_1'] === "yes") ? 1 : 0;
                    this.processed_request['___member_' + member + '_additionalQue_1___'] = this.prepared_request['member_' + member + '_additionalQue_1'];
                    this.prepared_request['member_' + member + '_additionalQue_1_subQue_1'] = (this.lm_request.hasOwnProperty('member_' + member + '_additionalQue_1_subQue_1') && this.lm_request['member_' + member + '_additionalQue_1_subQue_1'] === "TRUE") ? 1 : 0;
                    this.processed_request['___member_' + member + '_additionalQue_1_subQue_1___'] = this.prepared_request['member_' + member + '_additionalQue_1_subQue_1'];
                    this.prepared_request['member_' + member + '_additionalQue_1_subQue_2'] = (this.lm_request.hasOwnProperty('member_' + member + '_additionalQue_1_subQue_2') && this.lm_request['member_' + member + '_additionalQue_1_subQue_2'] === "TRUE") ? 1 : 0;
                    this.processed_request['___member_' + member + '_additionalQue_1_subQue_2___'] = this.prepared_request['member_' + member + '_additionalQue_1_subQue_2'];
                    if (this.lm_request.hasOwnProperty('member_' + member + '_additionalQue_1') && this.lm_request['member_' + member + '_additionalQue_1'] === "yes") {
                        if (this.lm_request.hasOwnProperty('member_' + member + '_additionalQue_1_subQue_1') && this.lm_request['member_' + member + '_additionalQue_1_subQue_1'] === "FALSE" && (this.lm_request.hasOwnProperty('member_' + member + '_additionalQue_1_subQue_2') && this.lm_request['member_' + member + '_additionalQue_1_subQue_2'] === "FALSE")) {
                            this.prepared_request['member_' + member + '_additionalQue_1_subQue_3'] = (this.lm_request.hasOwnProperty('member_' + member + '_additionalQue_1_subQue_3') && this.lm_request['member_' + member + '_additionalQue_1_subQue_3']) ? this.lm_request['member_' + member + '_additionalQue_1_subQue_3'] : "NONE";
                        } else {
                            this.prepared_request['member_' + member + '_additionalQue_1_subQue_3'] = "NONE";
                        }
                    } else {
                        this.prepared_request['member_' + member + '_additionalQue_1_subQue_3'] = "NONE";
                    }
                    this.processed_request['___member_' + member + '_additionalQue_1_subQue_3___'] = this.prepared_request['member_' + member + '_additionalQue_1_subQue_3'];
//                        
//                          this.prepared_request['member_' + member + '_additionalQue_1_subQue_3'] =  (this.lm_request.hasOwnProperty('member_' + member + '_additionalQue_1_subQue_3') && this.lm_request['member_' + member + '_additionalQue_1_subQue_3']) ? this.lm_request['member_' + member + '_additionalQue_1_subQue_3'] : "NONE"; 
//                        this.processed_request['___member_' + member + '_additionalQue_1_subQue_3___'] = this.prepared_request['member_' + member + '_additionalQue_1_subQue_3'];
                }
            }
        }
        if (this.prepared_request['dbmaster_pb_plan_name'] === 'COMPREHENSIVE') {
            if (this.method_content[0] !== '<') {// for json
                txt_replace_with = txt_replace_with.replaceAll('<!--InsurersDetail_Start_Comp-->', "");
                var Total_Count = this.lm_request['member_count'];
                for (var x = 1; x <= Total_Count - 1; x++) {
                    txt_replace_with = txt_replace_with.replace('<!--InsurersDetail_End_Comp-->', ",");
                }
                txt_replace_with = txt_replace_with.replace('<!--InsurersDetail_End_Comp-->', "");
            }
        } else if (this.prepared_request['dbmaster_pb_plan_name'] === 'DIABETES SAFE') {
            if (this.method_content[0] !== '<') {// for json
                txt_replace_with = txt_replace_with.replaceAll('<!--InsurersDetail_Start_Diab-->', "");
                var Total_Count = this.lm_request['member_count'];
                for (var x = 1; x <= Total_Count - 1; x++) {
                    txt_replace_with = txt_replace_with.replace('<!--InsurersDetail_End_Diab-->', ",");
                }
                txt_replace_with = txt_replace_with.replace('<!--InsurersDetail_End_Diab-->', "");
            }
        } else {
            if (this.method_content[0] !== '<') {// for json
                txt_replace_with = txt_replace_with.replaceAll('<!--InsurersDetail_Start-->', "");
                var Total_Count = this.lm_request['member_count'];
                for (var x = 1; x <= Total_Count - 1; x++) {
                    txt_replace_with = txt_replace_with.replace('<!--InsurersDetail_End-->', ",");
                }
                txt_replace_with = txt_replace_with.replace('<!--InsurersDetail_End-->', "");
            }
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);

        for (member = 1; member <= this.lm_request['adult_count']; member++) {
            this.prepared_request['member_' + member + '_inc'] = member - 1;
            this.processed_request['___member_' + member + '_inc___'] = member - 1;
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            if (this.lm_request['adult_count'] === 1) {
                this.prepared_request['member_' + member + '_inc'] = member - 2;
                this.processed_request['___member_' + member + '_inc___'] = member - 2;
            } else {
                this.prepared_request['member_' + member + '_inc'] = member - 1;
                this.processed_request['___member_' + member + '_inc___'] = member - 1;
            }
        }
        if (this.prepared_request['dbmaster_pb_plan_code'] === 'COMPREHENSIVE' && this.lm_request['member_count'] === 1) {
            this.prepared_request['dbmaster_pb_plan_code'] = 'COMPREHENSIVEIND';
            this.processed_request['___dbmaster_pb_plan_code___'] = 'COMPREHENSIVEIND';
        }
        if (this.prepared_request['dbmaster_pb_plan_code'] === 'DIABETESFMLY' && this.lm_request['member_count'] === 1) {
            this.prepared_request['dbmaster_pb_plan_code'] = 'DIABETESIND';
            this.processed_request['___dbmaster_pb_plan_code___'] = 'DIABETESIND';
        }
        if (this.prepared_request['dbmaster_pb_plan_code'] === 'REDCARPET' && this.lm_request['member_count'] > 1) {
            this.prepared_request['dbmaster_pb_plan_code'] = 'REDCARPETFMLY';
            this.processed_request['___dbmaster_pb_plan_code___'] = 'REDCARPETFMLY';
        }

        //var obj_policy_startdate = this.get_policy_startdate();
        this.prepared_request['get_policy_startdate'] = moment().add(1,'days').format('MMMM DD, YYYY');
        this.processed_request['___get_policy_startdate___'] = this.prepared_request['get_policy_startdate'];
        //var obj_policy_enddate = this.get_policy_enddate(this.prepared_request['policy_tenure']);
        this.prepared_request['get_policy_enddate'] = moment().add(1,'years').format('MMMM DD, YYYY');
        this.processed_request['___get_policy_enddate___'] = this.prepared_request['get_policy_enddate'];
        this.prepared_request['birth_date'] = moment(this.lm_request['birth_date'], 'YYYY-MM-DD').format('MMMM DD, YYYY');
        this.processed_request['___birth_date___'] = this.prepared_request['birth_date'];

        var obj_si_id = this.get_si_id(this.prepared_request['dbmaster_pb_plan_name']);
        this.prepared_request['health_insurance_si_id'] = obj_si_id;
        this.processed_request['___health_insurance_si_id___'] = this.prepared_request['health_insurance_si_id'];

        this.prepared_request['areaID'] = this.lm_request['areaId'];
        this.processed_request['___areaID___'] = this.prepared_request['areaID'];
    } else if (this.lm_request['method_type'] === 'Pdf') {
//         this.prepared_request['pg_reference_number_1'] = this.lm_request['pg_reference_number_1'];
//         this.processed_request['___pg_reference_number_1___'] = this.prepared_request['pg_reference_number_1'];
    }
    var obj_scheme_id = this.get_scheme_id(adult, child);
    this.prepared_request['scheme_id'] = obj_scheme_id;
    this.processed_request['___scheme_id___'] = this.prepared_request['scheme_id'];

    console.log(this.processed_request);
};
StarHealth.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
    if (specific_insurer_object.method.Method_Type === 'Pdf') {
        obj_response_handler = this.pdf_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Verification') {
        obj_response_handler = this.verification_response_handler(objResponseJson);
    }
    return obj_response_handler;

};
StarHealth.prototype.insurer_product_field_process_post = function () {

};
StarHealth.prototype.insurer_product_api_post = function () {

};
StarHealth.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
//    console.log('service_call');

    try {
        var objInsurerProduct = this;
        var body = docLog.Insurer_Request;
        if (this.method.Method_Type === 'Verification') {
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let pg_ref_url = specific_insurer_object.method_file_url + 'payment-service/v2/policy/proposals/' + this.prepared_request['pg_reference_number_1'] + "/purchase/response";

            var apikey = this.prepared_request['insurer_integration_service_user'];
            var secretkey = this.prepared_request['insurer_integration_service_password'];

            var args = {
                data: body,
                headers: {
                    "APIKEY": config.environment.name === 'Production' ? "" : "af2d561cd6644c34bb8fc61926da5e8f",
                    "SECRETKEY": config.environment.name === 'Production' ? "" : "5aedbe3f7f1048bd81b60a31ef2e011b"
                }
            };
            client.get(pg_ref_url, args, function (data, response) {
                // parsed response body as js object 
                console.error('reference', data);
                let err = null;
                let objData = null;
                if (data.hasOwnProperty('status') && data['status'] === 'SUCCESS') {
                    var finalData = JSON.stringify(data);//objData;
                    var purchaseResp = data;//JSON.parse(objData);
                    let policy_stats_url = specific_insurer_object.method.Service_URL + "proposal-service/policy/proposals/policystatus/" + purchaseResp['referenceId'];
                    // https://securegw-uat.starhealth.in/api/proposal-service/policy/proposals/
                let requestData = {
                    "referenceId": purchaseResp['referenceId']
                };
                var args = {
                    data: JSON.stringify(requestData),
                    headers: {
                        "Accept": "application/json",
                        "APIKEY": config.environment.name === 'Production' ? "" : "af2d561cd6644c34bb8fc61926da5e8f",
                        "SECRETKEY": config.environment.name === 'Production' ? "" : "5aedbe3f7f1048bd81b60a31ef2e011b"
                    }
                };
                client.get(policy_stats_url, args, function (data, response) {
                        console.error('policy status', data);
                        //{"Proposal_Number":"R/170000/01/2021/098739","Policy_Number":"P/170000/01/2021/007700"}
                        
                    objData = null;
                        //if (data.hasOwnProperty('Policy_Number') && data['Policy_Number']) {
                        if(data){
                            objData = JSON.stringify(data);
                    finalData = finalData + objData;
                    finalData = finalData.replaceAll('}{', ',');
//                    console.log('Final', finalData);
                        }
                    var objResponseFull = {
                        'err': err,
                        'result': null,
                        'raw': finalData,
                        'soapHeader': null,
                        'objResponseJson': JSON.parse(finalData)
                    };
                    var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                });
                } else {
                    err = data;
                }

            });
        } else if (this.method.Method_Type === 'Pdf') {
            var Client = require('node-rest-client').Client;
            var client = new Client();

            let pdf_service_url = specific_insurer_object.method_file_url + this.lm_request.pg_reference_number_1 + "/schedule";
             //https://securegw-uat.starhealth.in/api/proposal-service/v2/policy/proposals/<referenceId>/schedule
            var args = {
                data: body,
                headers: {
                    "Accept": " application/pdf",
                    "APIKEY": config.environment.name === 'Production' ? "" : "af2d561cd6644c34bb8fc61926da5e8f",
                    "SECRETKEY": config.environment.name === 'Production' ? "" : "5aedbe3f7f1048bd81b60a31ef2e011b"
                }
            };
            client.get(pdf_service_url, args, function (data, response) {
                // parsed response body as js object 
//                console.log(response.statusCode);

                var err = null;
                var objResponseFull = {
                    'err': err,
                    'result': null,
                    'raw':  data.toString(),
                    'soapHeader': null,
                    'objResponseJson':  data.toString()
                };
                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
            });
        } else {
            var Client = require('node-rest-client').Client;
            var client = new Client();

            if (this.method.Method_Type === 'Proposal') {
                var ref_Id = this.processed_request['___insurer_customer_identifier___'];
                //specific_insurer_object.method_file_url += ref_Id + "/token";
                let proposal_service_url = specific_insurer_object.method_file_url + ref_Id + "/token";
//                console.log(' specific_insurer_object.method_file_url += ref_Id +***** ', proposal_service_url);
                let requestData = {
                    "referenceId": ref_Id
                };
                
                var args = {
                    data: JSON.stringify(requestData),
                headers: { 
                    "APIKEY": config.environment.name === 'Production' ? "" : "af2d561cd6644c34bb8fc61926da5e8f",
                    "SECRETKEY": config.environment.name === 'Production' ? "" : "5aedbe3f7f1048bd81b60a31ef2e011b"
            }
            };

                client.get(proposal_service_url, args, function (data, response) {
                // parsed response body as js object 
                console.error('data', data);
                var err = null;
                var objData = null;
                data = JSON.stringify(data);//.toString();
                if (data.indexOf('{') === 0) {
                    objData = JSON.parse(data);
                } else {
                    err = data;
                }
                var objResponseFull = {
                    'err': err,
                    'result': data.toString(),
                    'raw': data.toString(),
                    'soapHeader': null,
                    'objResponseJson': objData
                };
                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
            });
            } else {

            var args = {
                data: body,
                headers: {
                    "Content-Type": "application/json",
                    "APIKEY": config.environment.name === 'Production' ? "" : "af2d561cd6644c34bb8fc61926da5e8f",
                    "SECRETKEY": config.environment.name === 'Production' ? "" : "5aedbe3f7f1048bd81b60a31ef2e011b"
                }
            };

            client.post(specific_insurer_object.method_file_url, args, function (data, response) {
                // parsed response body as js object 
                console.error('data', data);
                var err = null;
                var objData = null;
                data = JSON.stringify(data);//.toString();
                if (data.indexOf('{') === 0) {
                    objData = JSON.parse(data);
                } else {
                    err = data;
                }
                var objResponseFull = {
                    'err': err,
                    'result': data.toString(),
                    'raw': data.toString(),
                    'soapHeader': null,
                    'objResponseJson': objData
                };
                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
            });
        }
    }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};

StarHealth.prototype.premium_response_handler = function (objResponseJson) {
//    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    try {
        var objPremiumService = objResponseJson;
        //check error start
        if (objPremiumService.hasOwnProperty('premium')) {
        } else {
            Error_Msg = JSON.stringify(objPremiumService);
        }
        if (Error_Msg === 'NO_ERR')
        {
            var premium_breakup = this.get_const_premium_breakup();
            premium_breakup['final_premium'] = objPremiumService['totalPremium'];
            premium_breakup['service_tax'] = objPremiumService['serviceTax'];
            premium_breakup['tax']['CGST'] = premium_breakup['service_tax'] / 2;
            premium_breakup['tax']['SGST'] = premium_breakup['service_tax'] / 2;
            premium_breakup['net_premium'] = objPremiumService['premium'];
            premium_breakup['discount_percent'] = objPremiumService.hasOwnProperty('Discount percent') ? objPremiumService['Discount percent'] : 0;
            objServiceHandler.Premium_Breakup = premium_breakup;
            objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['TraceID'];
        }

        objServiceHandler.Error_Msg = Error_Msg;
//        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'premium_response_handler', ex);
    }
    return objServiceHandler;
};
StarHealth.prototype.customer_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'customer_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Customer': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson.hasOwnProperty('referenceId')) {
        } else {
            Error_Msg = objResponseJson["error"];
        }
        if (Error_Msg === 'NO_ERR') {
//            var proposalAmt = (objResponseJson.hasOwnProperty('totalPremium') ? objResponseJson["totalPremium"] : 0);
//            var objPremiumVerification = this.premium_verification(this.lm_request["final_premium"], proposalAmt);

//            if (objPremiumVerification.Status) {
                var Customer = {
                    'insurer_customer_identifier': objResponseJson["referenceId"]
                };
                objServiceHandler.Customer = Customer;
//            } else {
//                Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
//            }
//         }
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'customer_response_handler', objServiceHandler);

    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'customer_response_handler', ex);
    }
    return objServiceHandler;
};
StarHealth.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson.hasOwnProperty('redirectToken')) {
        } else {
            Error_Msg = JSON.stringify(objResponseJson);
        }
        if (Error_Msg === 'NO_ERR') {
            this.const_payment.pg_url += objResponseJson['redirectToken'];
            //this.const_payment.pg_ack_url = 'localhost:50111/HealthInsuranceIndia/StarPaymentResponse?';
//            var pg_data = {
//                'crn': this.lm_request['crn']
//            };
//            objServiceHandler.Payment.pg_data = pg_data;
            objServiceHandler.Payment.pg_redirect_mode = 'GET';
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'proposal_response_handler', ex);
    }
    return objServiceHandler;
};
StarHealth.prototype.verification_response_handler = function (objResponseJson) {
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
        } else if (this.const_policy.pg_status === 'SUCCESS') {
            this.const_policy.policy_id = (objResponseJson.hasOwnProperty('referenceId') ? objResponseJson['referenceId'] : null);
            if (objResponseJson.hasOwnProperty('status')) {
                if (objResponseJson['status'] === 'SUCCESS') {//transaction success
                    this.const_policy.pg_status = 'SUCCESS';
                    this.const_policy.transaction_status = 'SUCCESS';
                    if (objResponseJson.hasOwnProperty('Policy_Number')) {
                        this.const_policy.policy_number = objResponseJson['Policy_Number'];
                        var pdf_file_name = this.constructor.name + '_' + "Health" + '_' + this.const_policy.policy_number.toString().replaceAll('/', '') + '.pdf';
                        var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                        try {
                            var args = {
                                data: {
                                    "search_reference_number": this.lm_request['search_reference_number'],
                                    "api_reference_number": this.lm_request['api_reference_number'],
                                    "policy_number": this.const_policy.policy_number,
                                    "pg_reference_number_1": this.const_policy.pg_reference_number_1,
                                    'client_key': this.lm_request['client_key'],
                                    'secret_key': this.lm_request['secret_key'],
                                    'insurer_id': this.lm_request['insurer_id'],
                                    'email': this.lm_request['email'],
                                    'mobile': this.lm_request['mobile'],
                                    'crn': this.lm_request['crn'],
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
                    } else if (objResponseJson.hasOwnProperty('Note') && (objResponseJson['Note'].includes("MER") || objResponseJson['Note'].includes("Medical"))) {
                        this.const_policy.transaction_substatus = 'ME';
                    } else if (objResponseJson.hasOwnProperty('Note') && objResponseJson['Note'].includes("UW")) {
                        this.const_policy.transaction_substatus = 'UW';
                    } else if (objResponseJson.hasOwnProperty('Note') && objResponseJson['Note'].includes("policy is being prepared")) {
                        this.const_policy.transaction_substatus = 'IP';
                    } else {
                        this.const_policy.transaction_status = 'PAYPASS';
                    }
                } else if (objResponseJson['status'] === 'FAILURE') {
                    this.const_policy.pg_status = 'FAIL';
                    this.const_policy.transaction_status = 'FAIL';
                }
            } else {
                Error_Msg = 'LM_STATUS_NODE_MISSING';
            }
        }
        objServiceHandler.Policy = this.const_policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', ex);
    }
    return objServiceHandler;
};
StarHealth.prototype.pdf_call = function (url, args, pdf_sys_loc) {
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
StarHealth.prototype.pdf_response_handler = function (objResponseJson) {
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
            if (objResponseJson.hasOwnProperty('Note')) {
                Error_Msg = objResponseJson;
            }
        } else {
            Error_Msg = 'PDF not created';
        }
        var policy = {
            'policy_url': null,
            'policy_number': this.lm_request['policy_number'],
            'pdf_status': null
        };
        if (Error_Msg === 'NO_ERR') {
            var pdf_file_name = this.constructor.name + '_' + 'Health' + '_' + this.lm_request['policy_number'].toString().replaceAll('/', '') + '.pdf';
            var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
            var pdf_web_path = config.environment.weburl + "/pdf/" + pdf_file_name;
            var binary = new Buffer(objResponseJson, 'base64');
            fs.writeFileSync(pdf_sys_loc, binary);
            policy.policy_url = pdf_web_path;
            policy.pdf_status = 'SUCCESS';
            objServiceHandler.Insurer_Transaction_Identifier = this.lm_request['policy_number'];
        } else {
            policy.transaction_status = 'PAYPASS';
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
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'pdf_response_handler', objServiceHandler);
    }
    return objServiceHandler;

};
StarHealth.prototype.pg_response_handler = function () {
    try {
        console.log('Start', this.constructor.name, 'pg_response_handler');
        var output = this.const_payment_response.pg_get['purchaseToken'];
        this.const_policy.transaction_status = '';
        if (output !== '') {
            this.const_policy.transaction_amount = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['final_premium'];
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.pg_reference_number_1 = output;
        } else if (output === '') {
            this.const_policy.transaction_amount = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['final_premium'];
            this.const_policy.transaction_status = 'FAIL';
            this.const_policy.pg_status = 'FAIL';
        }
        console.error('End', this.constructor.name, 'pg_response_handler', this.const_policy);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'verification_response_handler', ex);
    }
};
StarHealth.prototype.get_policy_startdate = function () {
    var today = new Date();
    today.setDate(today.getDate() + 1);
    var months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
    var dd = today.getDate();
    var mm = today.getMonth();
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    policy_date = months[mm] + ' ' + dd + ',' + yyyy;
    return policy_date;
};
StarHealth.prototype.get_policy_enddate = function (policytenure) {
    var today = new Date();
    var months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
    var dd = today.getDate();
    var mm = today.getMonth();
    var yyyy = today.getFullYear() + policytenure;

    if (dd < 10) {
        dd = '0' + dd;
    }

    policy_date = months[mm] + ' ' + dd + ',' + yyyy;
    return policy_date;
};
StarHealth.prototype.get_member_relation = function (i) {
    console.log(this.constructor.name, 'get_member_relation', ' Start StarHealth');
    if (i >= 3) {
        return '3';
    } else if (i === 1) {
        return '1';
    } else if (i === 2) {
        return '2';
    }
    return '';
    console.log(this.constructor.name, 'get_member_relation', 'End StarHealth');
};
StarHealth.prototype.get_scheme_id = function (adult, child) {
    var scheme_id;
    if (adult === 1) {
        scheme_id = '0';
        if (child === 1) {
            scheme_id = '2';
        } else if (child === 2) {
            scheme_id = '3';
        } else if (child === 3) {
            scheme_id = '4';
        }
    } else if (adult === 2) {
        scheme_id = '1';
        if (child === 1) {
            scheme_id = '5';
        } else if (child === 2) {
            scheme_id = '6';
        } else if (child === 3) {
            scheme_id = '7';
        }
    }
    return scheme_id;
};
StarHealth.prototype.is_accident_applicable = function (member, adult, child) {
    if (this.prepared_request['dbmaster_pb_plan_name'] === 'COMPREHENSIVE' || this.prepared_request['dbmaster_pb_plan_name'] === 'DIABETES SAFE') {
        for (member = 1; member <= adult; member++) {
            if (member === 1) {
                this.prepared_request['member_1_ipaa'] = "true";
                this.processed_request['___member_1_ipaa___'] = this.prepared_request['member_1_ipaa'];
            } else
            {
                this.prepared_request['member_2_ipaa'] = false;
                this.processed_request['___member_2_ipaa___'] = this.prepared_request['member_2_ipaa'];
            }
        }
        for (member = 3; member <= child + 2; member++) {
            this.prepared_request['member_' + member + '_ipaa'] = false;
            this.processed_request['___member_' + member + '_ipaa___'] = this.prepared_request['member_' + member + '_ipaa'];
        }
    }
};
StarHealth.prototype.get_si_id = function (Plan_Name) {
    console.log('health_insurance_si_id', 'start');
    if (Plan_Name === "REDCARPET" && this.lm_request['health_insurance_type'] === 'floater') {
        var planSI = [
            {"plan": "REDCARPET", "sum_ins": 1000000, "sum_ins_id": 1},
            {"plan": "REDCARPET", "sum_ins": 1500000, "sum_ins_id": 2},
            {"plan": "REDCARPET", "sum_ins": 2000000, "sum_ins_id": 3},
            {"plan": "REDCARPET", "sum_ins": 2500000, "sum_ins_id": 4}
        ];
    } else {
        var planSI = [
            {"plan": "MEDICLASSIC", "sum_ins": 150000, "sum_ins_id": 1},
            {"plan": "MEDICLASSIC", "sum_ins": 200000, "sum_ins_id": 2},
            {"plan": "MEDICLASSIC", "sum_ins": 300000, "sum_ins_id": 3},
            {"plan": "MEDICLASSIC", "sum_ins": 400000, "sum_ins_id": 4},
            {"plan": "MEDICLASSIC", "sum_ins": 500000, "sum_ins_id": 5},
            {"plan": "MEDICLASSIC", "sum_ins": 1000000, "sum_ins_id": 6},
            {"plan": "MEDICLASSIC", "sum_ins": 1500000, "sum_ins_id": 7},
            {"plan": "COMPREHENSIVE", "sum_ins": 500000, "sum_ins_id": 1},
            {"plan": "COMPREHENSIVE", "sum_ins": 750000, "sum_ins_id": 2},
            {"plan": "COMPREHENSIVE", "sum_ins": 1000000, "sum_ins_id": 3},
            {"plan": "COMPREHENSIVE", "sum_ins": 1500000, "sum_ins_id": 4},
            {"plan": "COMPREHENSIVE", "sum_ins": 2000000, "sum_ins_id": 5},
            {"plan": "COMPREHENSIVE", "sum_ins": 2500000, "sum_ins_id": 6},
            {"plan": "COMPREHENSIVE", "sum_ins": 5000000, "sum_ins_id": 7},
            {"plan": "COMPREHENSIVE", "sum_ins": 7500000, "sum_ins_id": 8},
            {"plan": "COMPREHENSIVE", "sum_ins": 10000000, "sum_ins_id": 8},
            {"plan": "DIABETES SAFE", "sum_ins": 300000, "sum_ins_id": 1},
            {"plan": "DIABETES SAFE", "sum_ins": 400000, "sum_ins_id": 2},
            {"plan": "DIABETES SAFE", "sum_ins": 500000, "sum_ins_id": 3},
            {"plan": "DIABETES SAFE", "sum_ins": 1000000, "sum_ins_id": 4},
            {"plan": "REDCARPET", "sum_ins": 100000, "sum_ins_id": 1},
            {"plan": "REDCARPET", "sum_ins": 200000, "sum_ins_id": 2},
            {"plan": "REDCARPET", "sum_ins": 300000, "sum_ins_id": 3},
            {"plan": "REDCARPET", "sum_ins": 400000, "sum_ins_id": 4},
            {"plan": "REDCARPET", "sum_ins": 500000, "sum_ins_id": 5},
            {"plan": "REDCARPET", "sum_ins": 750000, "sum_ins_id": 6},
            {"plan": "REDCARPET", "sum_ins": 1000000, "sum_ins_id": 7},
            {"plan": "REDCARPET", "sum_ins": 1500000, "sum_ins_id": 8},
            {"plan": "REDCARPET", "sum_ins": 2000000, "sum_ins_id": 9},
            {"plan": "REDCARPET", "sum_ins": 2500000, "sum_ins_id": 10},
            {"plan": "FAMILY HEALTH OPTIMA", "sum_ins": 300000, "sum_ins_id": 2},
            {"plan": "FAMILY HEALTH OPTIMA", "sum_ins": 400000, "sum_ins_id": 3},
            {"plan": "FAMILY HEALTH OPTIMA", "sum_ins": 500000, "sum_ins_id": 4},
            {"plan": "FAMILY HEALTH OPTIMA", "sum_ins": 1000000, "sum_ins_id": 5},
            {"plan": "FAMILY HEALTH OPTIMA", "sum_ins": 1500000, "sum_ins_id": 6},
            {"plan": "FAMILY HEALTH OPTIMA", "sum_ins": 2000000, "sum_ins_id": 7},
            {"plan": "FAMILY HEALTH OPTIMA", "sum_ins": 2500000, "sum_ins_id": 8}
        ];
    }
    var index = planSI.findIndex(x => x.sum_ins === this.prepared_request['health_insurance_si'] - 0 && x.plan === Plan_Name);
    if (index === -1) {
        return "";
    }
    return planSI[index]['sum_ins_id'];
    console.log('health_insurance_si_id', 'end');
};
StarHealth.prototype.is_valid_plan = function (lm_request, planCode) {
    console.log('StarHealth is_valid_plan', 'start');
    var index = -1;
    var Plans = [];
    if (planCode === "REDCARPET" && lm_request['member_1_age'] >= 60 && lm_request['member_1_age'] <= 75) {
        if (lm_request['health_insurance_type'] === 'floater') {
            Plans = [
                {'code': "REDCARPET", 'min_si': 750000, 'max_si': 2500000}
            ];
        } else {
            Plans = [
                {'code': "REDCARPET", 'min_si': 99000, 'max_si': 2500000}
            ];
        }
    } else if (planCode === "FHONEW" && lm_request['health_insurance_type'] === 'floater') {
        Plans = [
            {'code': "FHONEW", 'min_si': 250000, 'max_si': 2500000}
        ];
    } else if (planCode === "DIABETESFMLY" && lm_request['health_insurance_type'] === 'floater' && lm_request['child_count'] > 0) {
        return false;
    } else {
        Plans = [
            {'code': "MCINEW", 'min_si': 100000, 'max_si': 2500000},
            {'code': "DIABETESFMLY", 'min_si': 250000, 'max_si': 1000000},
            {'code': "COMPREHENSIVE", 'min_si': 450000, 'max_si': 10000000}
        ];
    }
    index = Plans.findIndex(x => x.code === planCode
                && x.min_si < (lm_request['health_insurance_si'] - 0)
                && x.max_si >= (lm_request['health_insurance_si'] - 0));
    return (index > -1 ? true : false);
    console.log('StarHealth is_valid_plan', 'End');
};
StarHealth.prototype.premium_breakup_schema = {
    "net_premium": "premium",
    "CGST": "CGST",
    "SGST": "SGST",
    "service_tax": "serviceTax",
    "final_premium": "totalPremium",
    "discount_percent": "Discount percent"
};
module.exports = StarHealth;