/* Author : Revati Ghadge
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var util = require('util');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var Health = require(appRoot + '/libs/Health');
var moment = require('moment');
var config = require('config');
var crypto = require("crypto");
var fs = require('fs');
var sleep = require('system-sleep');
function MaxBupaHealth() {

}
util.inherits(MaxBupaHealth, Health);
MaxBupaHealth.prototype.lm_request_single = {};
MaxBupaHealth.prototype.insurer_integration = {};
MaxBupaHealth.prototype.insurer_addon_list = [];
MaxBupaHealth.prototype.insurer = {};
MaxBupaHealth.prototype.insurer_date_format = 'dd/mm/yyyy';
MaxBupaHealth.prototype.const_insurer_suminsured = [300000, 400000, 500000, 750000, 1000000, 1250000, 1500000, 2000000, 2500000, 3000000, 5000000, 10000000];
MaxBupaHealth.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
MaxBupaHealth.prototype.insurer_product_field_process_pre = function () {
    var member = 1;
    var memLoad = '';
    var memDobs = '';
    var memPa = '';
    var adult = this.lm_request['adult_count'];
    var child = this.lm_request['child_count'];
    this.prepared_request['city'] = this.lm_request['city_name'];
    this.processed_request['___city___'] = this.prepared_request['city'];
    this.prepared_request['state'] = this.lm_request['state_name'];
    this.processed_request['___state___'] = this.prepared_request['state'];
    if (this.lm_request['method_type'] === 'Premium') {
        if (config.environment.name !== 'Production') {
            this.prepared_request['planCode'] = (this.prepared_request['Plan_Id'] === 61 && this.insurer_master['plans']['pb_db_master'] > 2637236) ? this.insurer_master['plans']['insurer_db_master'] : this.insurer_master['plans']['pb_db_master'];
        } else {
            this.prepared_request['planCode'] = (this.prepared_request['Plan_Id'] === 61 && this.insurer_master['plans']['insurer_db_master'] > 212626) ? this.insurer_master['plans']['pb_db_master'] : this.insurer_master['plans']['insurer_db_master'];
        }
        this.processed_request['___planCode___'] = this.prepared_request['planCode'];
        for (member = 1; member <= this.lm_request['member_count'] + 1; member++) {
            if (member === 1) {
                memLoad = '100';
                memDobs = this.processed_request['___member_' + member + '_birth_date___'];
                memPa = 'N';
            } else {
                if (this.prepared_request['member_' + member + '_inc'] !== undefined && this.prepared_request['member_' + member + '_inc'] !== '') {
                    memLoad += ',100';
                    memDobs += ',' + this.processed_request['___member_' + member + '_birth_date___'];
                    memPa += ',N';
                }
            }
        }
        this.prepared_request["proposer_gender"] = this.lm_request["gender"] === "M" ? "77" : "70";
        this.processed_request["___proposer_gender___"] = this.prepared_request["proposer_gender"];
        this.prepared_request['member_loading'] = memLoad;
        this.processed_request['___member_loading___'] = memLoad;
        this.prepared_request['members_dob'] = memDobs;
        this.processed_request['___members_dob___'] = memDobs;

        for (member = 1; member <= adult; member++) {
            if (this.lm_request.hasOwnProperty('multi_individual') && this.lm_request['multi_individual'] === "yes") {
                this.prepared_request['member_' + member + '_si'] = this.prepared_request['health_insurance_si'];
                this.processed_request['___member_' + member + '_si___'] = this.prepared_request['health_insurance_si'];
            }
        }
        for (member = 3; member <= child + 2; member++) {
            if (this.lm_request.hasOwnProperty('multi_individual') && this.lm_request['multi_individual'] === "yes") {
                this.prepared_request['member_' + member + '_si'] = this.prepared_request['health_insurance_si'];
                this.processed_request['___member_' + member + '_si___'] = this.prepared_request['health_insurance_si'];
            }
        }
        if (this.prepared_request['Plan_Id'] === 62) {
            this.prepared_request['members_pa'] = memPa;
            this.processed_request['___members_pa___'] = memPa;
            this.prepared_request['billCycle'] = this.lm_request["policy_tenure"] === 1 ? 'Y' : this.lm_request["policy_tenure"];
            this.processed_request['___billCycle___'] = this.prepared_request['billCycle'];
            var med_practitioner = (this.lm_request["quick_quote"] || this.lm_request["is_med_practitioner"] === undefined) ? 'N' : this.lm_request["is_med_practitioner"][0];
            this.prepared_request['med_practitioner'] = med_practitioner;
            this.processed_request['___med_practitioner___'] = med_practitioner;
            var premium_calc_date = this.policy_received_date();
            this.processed_request['___premium_calc_date___'] = premium_calc_date;
            this.method['Method_Request_File'] = "MaxBupa_Health_ReAssure_Premium.xml";
            var method_content = fs.readFileSync(appRoot + '/resource/request_file/Health/' + this.method.Method_Request_File).toString();
            this.method_content = method_content;
        }
    }
    if (this.lm_request['method_type'] === 'Customer' || this.lm_request['method_type'] === 'Proposal') {
        this.prepared_request["customer_id"] = (this.lm_request["crn"].toString()).length === 7 ? '820' + this.lm_request["crn"] + '11' : ((this.lm_request["crn"].toString()).length === 9 ? '820' + this.lm_request["crn"] : '820' + this.lm_request["crn"] + 1);
        this.processed_request["___customer_id___"] = this.prepared_request["customer_id"];
        this.prepared_request['planCode'] = this.insurer_master['service_logs']['insurer_db_master']['LM_Custom_Request'].planCode;
        this.processed_request['___planCode___'] = this.prepared_request['planCode'];
        var policy_receive_date = this.policy_received_date();
        this.prepared_request['policy_received_date'] = policy_receive_date;
        this.processed_request['___policy_received_date___'] = this.prepared_request['policy_received_date'];
    }
    if (this.lm_request['method_type'] === 'Customer') {
        this.prepared_request['current_time'] = this.current_time();
        this.prepared_request['section_a'] = "";

        if (this.prepared_request['dbmaster_plan_id'] === 62) {
            this.method['Method_Request_File'] = "MaxBupa_Health_ReAssure_Customer.xml";
            var method_content = fs.readFileSync(appRoot + '/resource/request_file/Health/' + this.method.Method_Request_File).toString();
            this.method_content = method_content;
        }
        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";
        for (member = 1; member <= adult; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
        }
        for (member = 3; member <= child + 2; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
        for (member = 1; member <= adult; member++) {
            this.prepared_request["member_" + member + "_gender_3"] = this.lm_request["member_" + member + "gender"] === "M" ? "Male" : "Female";
            this.processed_request["___member_" + member + "_gender_3___"] = this.prepared_request["member_" + member + "_gender_3"];
            this.prepared_request["member_" + member + '_id'] = '820' + this.prepared_request['current_time'] + member.toString();
            this.processed_request["___member_" + member + "_id___"] = this.prepared_request["member_" + member + '_id'];
            this.prepared_request['member_' + member + '_dob'] = this.get_member_dob(this.prepared_request['member_' + member + '_birth_date']);
            this.processed_request['___member_' + member + '_dob___'] = this.prepared_request['member_' + member + '_dob'];
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
            this.prepared_request['proposer_pep'] = this.lm_request['is_pep_text'];
            this.processed_request['___proposer_pep___'] = this.lm_request['is_pep_text'];
            this.prepared_request['member_' + member + '_pep'] = this.lm_request['member_' + member + '_pep_text'];
            this.processed_request['___member_' + member + '_pep___'] = this.lm_request['member_' + member + '_pep_text'];
            if (this.lm_request.hasOwnProperty('multi_individual') && this.lm_request['multi_individual'] === "yes") {
                this.prepared_request['member_' + member + '_si'] = this.prepared_request['health_insurance_si'];
                this.processed_request['___member_' + member + '_si___'] = this.prepared_request['health_insurance_si'];
            }
            if (this.lm_request['member_count'] === 1 && !this.prepared_request.hasOwnProperty('bmi_err')) {
                this.calculate_bmi(member);
                this.check_bmi(this.prepared_request['member_' + member + '_bmi']);
            }
            if (this.lm_request['member_' + member + '_additionalQue_2'] === 'no') {
                var start_tag = "<!--___member_" + member + "_block2_Start-->";
                var end_tag = "<!--___member_" + member + "_block2_End-->";
                let addn_block = this.find_text_btw_key(this.method_content.toString(), start_tag, end_tag, true);
                this.method_content = this.method_content.replace(addn_block, '');
            }

            for (var key in this.lm_request) {
                if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1 && key.includes("member_" + member)) {
                    var ques_detail = key.replace('_type', '_details');
                    if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                        if (this.lm_request[ques_detail] === false) {
                            this.prepared_request[ques_detail] = "No";
                            this.processed_request['___' + ques_detail + '___'] = "No";
                            if (ques_detail.includes('14')) {
                                if (this.lm_request["member_" + member + "_question_15_details"] === true || this.lm_request["member_" + member + "_question_16_details"] === true
                                        || this.lm_request["member_" + member + "_question_27_details"] === true || this.lm_request["member_" + member + "_question_28_details"] === true
                                        || this.lm_request["member_" + member + "_question_17_details"] !== false) {
                                    this.prepared_request['diabetes_err'] = 'Medical Question 18 is mandatory, if any medical question from 19 - 23 is selected';
                                }
                            }
                            if (ques_detail.includes('18')) {
                                if (this.lm_request["member_" + member + "_question_19_details"] === false && this.lm_request["member_" + member + "_question_29_details"] === false) {
                                } else {
                                    this.prepared_request['hypertension_err'] = 'Medical Question 24 is mandatory, if any medical question from 25 & 26 is selected';
                                }
                            }
                        } else {
                            this.prepared_request[ques_detail] = "Yes";
                            this.processed_request['___' + ques_detail + '___'] = "Yes";
                            if (ques_detail.includes('14')) {
                                if ((this.lm_request["member_" + member + "_question_15_details"] === false && this.lm_request["member_" + member + "_question_16_details"] === false
                                        && this.lm_request["member_" + member + "_question_27_details"] === false && this.lm_request["member_" + member + "_question_28_details"] === false) ||
                                        this.lm_request["member_" + member + "_question_17_details"] === false) {
                                    this.prepared_request['diabetes_err'] = 'Atleast one amongst Medical Question 19 - 22 and Medical Question 23 is mandatory, if medical question 18 is selected';
                                }
                            }
                            if (ques_detail.includes('18')) {
                                if (this.lm_request["member_" + member + "_question_19_details"] === false || this.lm_request["member_" + member + "_question_29_details"] === false) {
                                    this.prepared_request['hypertension_err'] = 'Medical Question 25 & 26 are mandatory, if medical question 24 is selected';
                                }
                            }
//                            if (ques_detail.includes('20') && this.prepared_request['member_' + member + '_gender'] === 'M') {
//                                this.prepared_request['pregnancy_err'] = 'Medical Question 27 is applicable only for females';
//                            }
                        }

                        for (var q = 2; q <= 13; q++) {
                            let qname = '_' + q.toString() + '_details';
                            if (ques_detail.indexOf(qname) > -1 || ques_detail.indexOf('_25_details') > -1) {
                                if (this.lm_request[ques_detail] === false) {
                                    if (this.lm_request["member_" + member + "_question_21_details"] !== false || this.lm_request["member_" + member + "_question_22_details"] !== false
                                            || this.lm_request["member_" + member + "_question_23_details"] !== false || this.lm_request["member_" + member + "_question_24_details"] !== false) {
                                        this.prepared_request['section_b'] = 'Atleast one amongst medical question 5 - 17 is mandatory, if any medical question from 1 - 4 is selected';
                                    }
                                } else {
                                    if (this.prepared_request['section_a'] === "" && this.lm_request["member_" + member + "_question_21_details"] === false && this.lm_request["member_" + member + "_question_22_details"] === false
                                            && this.lm_request["member_" + member + "_question_23_details"] === false && this.lm_request["member_" + member + "_question_24_details"] === false) {
                                        this.prepared_request['section_a'] = 'Atleast one amongst medical question 1 - 4 is mandatory, if any medical question from 5 - 17 is selected';
                                    }
                                }
                            }
                        }
                    } else if (this.lm_request[key].toString().toLowerCase() === 'since') {
                        this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                        this.processed_request['___' + ques_detail + '___'] = this.lm_request[ques_detail];
                        if ((this.lm_request["member_" + member + "_question_14_details"] === true && ques_detail.includes('17')) || (this.lm_request["member_" + member + "_question_18_details"] === true && (ques_detail.includes('19') || ques_detail.includes('29')))) {
                            if (['A', 'B', 'C', 'D', 'a', 'b', 'c', 'd'].indexOf(this.lm_request[ques_detail]) === -1) {
                                this.prepared_request['proper_option'] = 'Please mention proper option out of (A/B/C/D) if medical question 23/25/26 opted';
                            }
                        }
                    }

                }
                if (key.indexOf('_subQue_') > -1 && key.includes("member_" + member)) {
                    if (key.indexOf('_pregnancy_') > -1 && !key.includes("_subQue_5") && !key.includes("_subQue_6")) {
                        this.prepared_request[key] = (this.lm_request[key] !== 'Yes') ? 'No' : this.lm_request[key];
                        this.processed_request['___' + key + '___'] = this.prepared_request[key];
                    } else {
                        this.prepared_request[key] = this.lm_request[key];
                        this.processed_request['___' + key + '___'] = this.lm_request[key];
                    }
                }
            }
            if (this.prepared_request['dbmaster_plan_id'] === 62) {
                var tagsobj = {38: 'SMOKING_QTY', 39: 'TOBACCO_QTY', 40: 'ALCOHOL_QTY'};
                for (var j = 38; j < 41; j++) {
                    var memQuestn = 'member_' + member + '_question_' + j;
                    if (this.lm_request[memQuestn + '_type'] === "since") {
                        this.prepared_request[memQuestn + '_main'] = 'YES';
                    } else {
                        this.prepared_request[memQuestn + '_main'] = 'NO';
                        this.method_content = this.method_content.replace('<' + tagsobj[j] + '>___member_' + member + '_question_' + j + '_details___</' + tagsobj[j] + '>', '<' + tagsobj[j] + ' />');
                        if (j === 40) {
                            this.processed_request['___member_' + member + '_question_41_details___'] = 'No';
                        }
                    }
                    this.processed_request['___' + memQuestn + '_main___'] = this.prepared_request[memQuestn + '_main'];

                    if (this.processed_request['___member_' + member + '_additionalQue_1_subQue_' + (j - 30) + '___'] === "") {
                        this.processed_request['___member_' + member + '_additionalQue_1_subQue_' + (j - 30) + '___'] = 0;
                    }
                    if (this.processed_request['___member_' + member + '_additionalQue_2_subQue_' + (j - 30) + '___'] === "") {
                        this.processed_request['___member_' + member + '_additionalQue_2_subQue_' + (j - 30) + '___'] = 0;
                    }
                }
            }
        }
        for (member = 3; member <= child + 2; member++) {
            this.prepared_request["member_" + member + "_gender_3"] = this.lm_request["member_" + member + "gender"] === "M" ? "Male" : "Female";
            this.processed_request["___member_" + member + "_gender_3___"] = this.prepared_request["member_" + member + "_gender_3"];
            this.prepared_request["member_" + member + '_id'] = '820' + this.prepared_request['current_time'] + member.toString();
            this.processed_request["___member_" + member + "_id___"] = this.prepared_request["member_" + member + '_id'];
            this.prepared_request['member_' + member + '_dob'] = this.get_member_dob(this.prepared_request['member_' + member + '_birth_date']);
            this.processed_request['___member_' + member + '_dob___'] = this.prepared_request['member_' + member + '_dob'];
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
            this.prepared_request['proposer_pep'] = this.lm_request['is_pep_text'];
            this.processed_request['___proposer_pep___'] = this.lm_request['is_pep_text'];
            this.prepared_request['member_' + member + '_pep'] = this.lm_request['member_' + member + '_pep_text'];
            this.processed_request['___member_' + member + '_pep___'] = this.lm_request['member_' + member + '_pep_text'];
            if (this.lm_request.hasOwnProperty('multi_individual') && this.lm_request['multi_individual'] === "yes") {
                this.prepared_request['member_' + member + '_si'] = this.prepared_request['health_insurance_si'];
                this.processed_request['___member_' + member + '_si___'] = this.prepared_request['health_insurance_si'];
            }
            if (this.lm_request['member_count'] === 1 && this.prepared_request['member_' + member + '_age'] >= 18 && !this.prepared_request.hasOwnProperty('bmi_err')) {
                this.calculate_bmi(member);
                this.check_bmi(this.prepared_request['member_' + member + '_bmi']);
            }
            if (this.lm_request['member_' + member + '_additionalQue_2'] === 'no') {
                var start_tag = "<!--___member_" + member + "_block2_Start-->";
                var end_tag = "<!--___member_" + member + "_block2_End-->";
                let addn_block = this.find_text_btw_key(this.method_content.toString(), start_tag, end_tag, true);
                this.method_content = this.method_content.replace(addn_block, '');
            }

            for (var key in this.lm_request) {
                if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1 && key.includes("member_" + member)) {
                    var ques_detail = key.replace('_type', '_details');
                    if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                        if (this.lm_request[ques_detail] === false) {
                            this.prepared_request[ques_detail] = "No";
                            this.processed_request['___' + ques_detail + '___'] = "No";
                            if (ques_detail.includes('14')) {
                                if (this.lm_request["member_" + member + "_question_15_details"] === true || this.lm_request["member_" + member + "_question_16_details"] === true
                                        || this.lm_request["member_" + member + "_question_27_details"] === true || this.lm_request["member_" + member + "_question_28_details"] === true
                                        || this.lm_request["member_" + member + "_question_17_details"] !== false) {
                                    this.prepared_request['diabetes_err'] = 'Medical Question 18 is mandatory, if any medical question from 19 - 23 is selected';
                                }
                            }
                            if (ques_detail.includes('18')) {
                                if (this.lm_request["member_" + member + "_question_19_details"] === false && this.lm_request["member_" + member + "_question_29_details"] === false) {
                                } else {
                                    this.prepared_request['hypertension_err'] = 'Medical Question 24 is mandatory, if any medical question from 25 & 26 is selected';
                                }
                            }
                        } else {
                            this.prepared_request[ques_detail] = "Yes";
                            this.processed_request['___' + ques_detail + '___'] = "Yes";
                            if (ques_detail.includes('14')) {
                                if ((this.lm_request["member_" + member + "_question_15_details"] === false && this.lm_request["member_" + member + "_question_16_details"] === false
                                        && this.lm_request["member_" + member + "_question_27_details"] === false && this.lm_request["member_" + member + "_question_28_details"] === false) ||
                                        this.lm_request["member_" + member + "_question_17_details"] === false) {
                                    this.prepared_request['diabetes_err'] = 'Atleast one amongst Medical Question 19 - 22 and Medical Question 23 is mandatory, if medical question 18 is selected';
                                }
                            }
                            if (ques_detail.includes('18')) {
                                if (this.lm_request["member_" + member + "_question_19_details"] === false || this.lm_request["member_" + member + "_question_29_details"] === false) {
                                    this.prepared_request['hypertension_err'] = 'Medical Question 25 & 26 are mandatory, if medical question 24 is selected';
                                }
                            }
//                            if (ques_detail.includes('20') && this.prepared_request['member_' + member + '_gender'] === 'M') {
//                                this.prepared_request['pregnancy_err'] = 'Medical Question 27 is applicable only for females';
//                            }
                        }

                        for (var q = 2; q <= 13; q++) {
                            let qname = '_' + q.toString() + '_details';
                            if (ques_detail.indexOf(qname) > -1 || ques_detail.indexOf('_25_details') > -1) {
                                if (this.lm_request[ques_detail] === false) {
                                    if (this.lm_request["member_" + member + "_question_21_details"] !== false || this.lm_request["member_" + member + "_question_22_details"] !== false
                                            || this.lm_request["member_" + member + "_question_23_details"] !== false || this.lm_request["member_" + member + "_question_24_details"] !== false) {
                                        this.prepared_request['section_b'] = 'Atleast one amongst medical question 5 - 17 is mandatory, if any medical question from 1 - 4 is selected';
                                    }
                                } else {
                                    if (this.prepared_request['section_a'] === "" && this.lm_request["member_" + member + "_question_21_details"] === false && this.lm_request["member_" + member + "_question_22_details"] === false
                                            && this.lm_request["member_" + member + "_question_23_details"] === false && this.lm_request["member_" + member + "_question_24_details"] === false) {
                                        this.prepared_request['section_a'] = 'Atleast one amongst medical question 1 - 4 is mandatory, if any medical question from 5 - 17 is selected';
                                    }
                                }
                            }
                        }
                    } else if (this.lm_request[key].toString().toLowerCase() === 'since') {
                        this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                        this.processed_request['___' + ques_detail + '___'] = this.lm_request[ques_detail];
                        if ((this.lm_request["member_" + member + "_question_14_details"] === true && ques_detail.includes('17')) || (this.lm_request["member_" + member + "_question_18_details"] === true && (ques_detail.includes('19') || ques_detail.includes('29')))) {
                            if (['A', 'B', 'C', 'D', 'a', 'b', 'c', 'd'].indexOf(this.lm_request[ques_detail]) === -1) {
                                this.prepared_request['proper_option'] = 'Please mention proper option out of (A/B/C/D) if medical question 23/25/26 opted';
                            }
                        }
                    }
                }
                if (key.indexOf('_subQue_') > -1 && key.includes("member_" + member)) {
                    if (key.indexOf('_pregnancy_') > -1 && !key.includes("_subQue_5") && !key.includes("_subQue_6")) {
                        this.prepared_request[key] = 'No';
                        this.processed_request['___' + key + '___'] = 'No';
                    } else {
                        this.prepared_request[key] = this.lm_request[key];
                        this.processed_request['___' + key + '___'] = this.lm_request[key];
                    }
                }
            }
            if (this.prepared_request['dbmaster_plan_id'] === 62) {
                var tagsobj = {38: 'SMOKING_QTY', 39: 'TOBACCO_QTY', 40: 'ALCOHOL_QTY'};
                for (var j = 38; j < 41; j++) {
                    var memQuestn = 'member_' + member + '_question_' + j;
                    if (this.lm_request[memQuestn + '_type'] === "since") {
                        this.prepared_request[memQuestn + '_main'] = 'YES';
                    } else {
                        this.prepared_request[memQuestn + '_main'] = 'NO';
                        this.method_content = this.method_content.replace('<' + tagsobj[j] + '>___member_' + member + '_question_' + j + '_details___</' + tagsobj[j] + '>', '<' + tagsobj[j] + ' />');
                        if (j === 40) {
                            this.processed_request['___member_' + member + '_question_41_details___'] = 'No';
                        }
                    }
                    this.processed_request['___' + memQuestn + '_main___'] = this.prepared_request[memQuestn + '_main'];

                    if (this.processed_request['___member_' + member + '_additionalQue_1_subQue_' + (j - 30) + '___'] === "") {
                        this.processed_request['___member_' + member + '_additionalQue_1_subQue_' + (j - 30) + '___'] = 0;
                    }
                    if (this.processed_request['___member_' + member + '_additionalQue_2_subQue_' + (j - 30) + '___'] === "") {
                        this.processed_request['___member_' + member + '_additionalQue_2_subQue_' + (j - 30) + '___'] = 0;
                    }
                }
            }
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
        this.method_content = this.method_content.replaceAll(/<!--(.*?)-->/g, "");
    }
    if (this.lm_request['method_type'] === 'Proposal') {
        this.prepared_request["is_whatsapp_allow"] = this.lm_request["is_whatsapp_allow"] === 0 ? "No" : "Yes";
        this.processed_request["___is_whatsapp_allow___"] = this.prepared_request["is_whatsapp_allow"];
        this.prepared_request["proposer_gender"] = this.lm_request["gender"] === "M" ? "Male" : "Female";
        this.processed_request["___proposer_gender___"] = this.prepared_request["proposer_gender"];
        this.processed_request["___transaction_num___"] = "BB" + this.lm_request['crn'];
        var stp = (this.prepared_request["insurer_customer_identifier"]).split("|")[1];
        this.prepared_request["stp_flag"] = stp === "AC" ? "True" : "False";
        this.processed_request["___stp_flag___"] = this.prepared_request["stp_flag"];
        if (this.prepared_request['dbmaster_plan_id'] === 62) {
            this.method['Method_Request_File'] = "MaxBupa_Health_ReAssure_Proposal.xml";
            var method_content = fs.readFileSync(appRoot + '/resource/request_file/Health/' + this.method.Method_Request_File).toString();
            this.method_content = method_content;
            //console.log('Re-Assure plan' + this.method_content);
        }
        if (this.lm_request['electronic_policy'] !== true) {
            this.prepared_request['hard_copy'] = "NO";
            this.processed_request['___hard_copy___'] = "NO";
        } else {
            this.prepared_request['hard_copy'] = "YES";
            this.processed_request['___hard_copy___'] = "YES";
        }
        if (this.lm_request.hasOwnProperty('eia_number') && this.lm_request['eia_number'] !== "") {
            this.processed_request['___has_eia___'] = 'Yes';
            this.processed_request['___eia_number___'] = this.lm_request['eia_number'];
            this.processed_request['___ir_name___'] = this.lm_request['insurance_repo_name'];
        } else {
            this.processed_request['___has_eia___'] = 'No';
            this.processed_request['___eia_number___'] = '';
            this.processed_request['___ir_name___'] = '';
        }

        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";
        for (member = 1; member <= adult; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
        }
        for (member = 3; member <= child + 2; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
        for (member = 1; member <= adult; member++) {
            this.calculate_bmi(member);
            this.prepared_request["member_" + member + '_id'] = '820' + this.prepared_request['insurer_customer_identifier_3'] + member.toString();
            this.processed_request["___member_" + member + "_id___"] = this.prepared_request["member_" + member + '_id'];
            this.prepared_request['member_' + member + '_dob'] = this.get_member_dob(this.prepared_request['member_' + member + '_birth_date']);
            this.processed_request['___member_' + member + '_dob___'] = this.prepared_request['member_' + member + '_dob'];
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
            this.prepared_request['proposer_pep'] = this.lm_request['is_pep'];
            this.processed_request['___proposer_pep___'] = this.lm_request['is_pep'];
            this.prepared_request['member_' + member + '_pep'] = this.lm_request['member_' + member + '_pep'];
            this.processed_request['___member_' + member + '_pep___'] = this.lm_request['member_' + member + '_pep'];
            this.prepared_request['member_' + member + '_gender_3'] = this.lm_request['member_' + member + '_gender'] === 'M' ? 'Male' : 'Female';
            this.processed_request['___member_' + member + '_gender_3___'] = this.prepared_request['member_' + member + '_gender_3'];
            if (this.prepared_request['dbmaster_plan_id'] === 62) {
                this.prepared_request['member_' + member + '_practitnr_id'] = this.lm_request['member_' + member + '_practice_reg'];
                this.processed_request['___member_' + member + '_practitnr_id___'] = this.prepared_request['member_' + member + '_practitnr_id'];
                this.prepared_request['member_' + member + '_council_name'] = this.lm_request['member_' + member + '_council_name'];
                this.processed_request['___member_' + member + '_council_name___'] = this.prepared_request['member_' + member + '_council_name'];
                this.prepared_request['member_' + member + '_work_addrs'] = this.lm_request['member_' + member + '_work_address'];
                this.processed_request['___member_' + member + '_work_addrs___'] = this.prepared_request['member_' + member + '_work_addrs'];
                this.prepared_request['member_' + member + '_has_practitnr_discnt'] = this.lm_request['member_' + member + '_med_pract'];
                this.processed_request['___member_' + member + '_has_practitnr_discnt___'] = this.prepared_request['member_' + member + '_has_practitnr_discnt'];
            }
            if (this.lm_request['member_' + member + '_gender'] === "M") {
                let preg_block = this.find_text_btw_key(this.method_content.toString(), "<!--___member_" + member + "_preg_Start-->", "<!--___member_" + member + "_preg_End-->", true);
                this.method_content = this.method_content.replace(preg_block, '');
            }
            if (this.lm_request['member_' + member + '_additionalQue_1'] === 'no') {
                var start_tag = "<!--___member_" + member + "_aqblock_Start-->";
                var end_tag = "<!--___member_" + member + "_aqblock_End-->";
                let addn_block = this.find_text_btw_key(this.method_content.toString(), start_tag, end_tag, true);
                this.method_content = this.method_content.replace(addn_block, '');
            } else {
                this.processed_request['___member_' + member + '_additionalQue_1_onset___'] = (this.lm_request['member_' + member + '_additionalQue_1_subQue_4'] !== undefined && this.lm_request['member_' + member + '_additionalQue_1_subQue_4'] !== '') ? this.date_format(this.lm_request['member_' + member + '_additionalQue_1_subQue_4'], 'dd/mm/yyyy') : '';
            }
            if (this.lm_request['member_' + member + '_additionalQue_2'] === 'no') {
                if (this.lm_request['member_' + member + '_additionalQue_1'] === 'yes') {
                    var start_tag = "<!--___member_" + member + "_block2_Start-->";
                    var end_tag = "<!--___member_" + member + "_block2_End-->";
                    let addn_block = this.find_text_btw_key(this.method_content.toString(), start_tag, end_tag, true);
                    this.method_content = this.method_content.replace(addn_block, '');
                }
            } else {
                this.processed_request['___member_' + member + '_additionalQue_2_onset___'] = (this.lm_request['member_' + member + '_additionalQue_2_subQue_4'] !== undefined && this.lm_request['member_' + member + '_additionalQue_2_subQue_4'] !== '') ? this.date_format(this.lm_request['member_' + member + '_additionalQue_2_subQue_4'], 'dd/mm/yyyy') : '';
            }
            if (this.lm_request["member_" + member + "_question_1_details"] === false) {
                var start_tag = "<!--___member_" + member + "_familyHistory_Start-->";
                var end_tag = "<!--___member_" + member + "_familyHistory_End-->";
                let fam_history_block = this.find_text_btw_key(this.method_content.toString(), start_tag, end_tag, true);
                this.method_content = this.method_content.replace(fam_history_block, '<FAMILY_MEDICAL_HISTORY_SET/> ');
            }

            for (var key in this.lm_request) {
                if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1 && key.includes("member_" + member)) {
                    var ques_detail = key.replace('_type', '_details');
                    if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                        if (this.lm_request[ques_detail] === false) {
                            this.prepared_request[ques_detail] = "0";
                            this.processed_request['___' + ques_detail + '___'] = "0";
                            if (this.prepared_request['dbmaster_plan_id'] === 61) {
                                if (ques_detail.includes('_26_') || ques_detail.includes('_33_') || ques_detail.includes('_34_')) {
                                    this.processed_request['___' + ques_detail + '1___'] = "0";
                                    this.processed_request['___' + ques_detail + '___'] = "";
                                }
                                if (ques_detail.includes('_30_') || ques_detail.includes('_31_') || ques_detail.includes('_32_')) {
                                    if (this.lm_request["member_" + member + "_question_30_details"] === false && this.lm_request["member_" + member + "_question_31_details"] === false &&
                                            this.lm_request["member_" + member + "_question_32_details"] === false) {
                                        this.processed_request['___member_' + member + '_consumes_alcohol___'] = "0";
                                        this.processed_request['___' + ques_detail + '___'] = "";
                                    }
                                }
                            } else if (this.prepared_request['dbmaster_plan_id'] === 62 && ques_detail.includes('_41_')) {
                                this.prepared_request[ques_detail] = "No";
                                this.processed_request['___' + ques_detail + '___'] = "No";
                            }
                        } else {
                            this.prepared_request[ques_detail] = "1";
                            this.processed_request['___' + ques_detail + '___'] = "1";
                            if (this.prepared_request['dbmaster_plan_id'] === 62 && ques_detail.includes('_41_')) {
                                this.prepared_request[ques_detail] = "Yes";
                                this.processed_request['___' + ques_detail + '___'] = "Yes";
                            }
                        }
                    } else if (this.lm_request[key].toString().toLowerCase() === 'since') {
                        if (ques_detail.includes('_26_') || ques_detail.includes('_33_') || ques_detail.includes('_34_')) {
                            this.processed_request['___' + ques_detail + '1___'] = "1";
                        }
                        if (ques_detail.includes('_30_') || ques_detail.includes('_31_') || ques_detail.includes('_32_')) {
                            this.processed_request['___member_' + member + '_consumes_alcohol___'] = "1";
                        }
                        this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                        this.processed_request['___' + ques_detail + '___'] = this.lm_request[ques_detail];
                    }
                }
                if (key.indexOf('_subQue_') > -1 && key.includes("member_" + member)) {
                    if (key.indexOf('_pregnancy_') > -1) {
                        this.prepared_request[key] = (this.lm_request[key] === 'Yes') ? 1 : (this.lm_request[key] !== 'No' ? this.lm_request[key] : 0);
                        this.processed_request['___' + key + '___'] = this.prepared_request[key];
                    } else {
                        this.prepared_request[key] = this.lm_request[key];
                        this.processed_request['___' + key + '___'] = this.lm_request[key];
                    }
                }
            }
            if (this.prepared_request['dbmaster_plan_id'] === 62) {
                var tagsobj = {8: 'HBA1C_LEVEL', 9: 'BP_DYSTOLIC', 10: 'BP_SYSTOLIC'};
                for (var j = 38; j < 41; j++) {
                    var memQuestn = 'member_' + member + '_question_' + j;
                    if (this.lm_request[memQuestn + '_type'] === "since") {
                        this.prepared_request[memQuestn + '_main'] = '1';
                    } else {
                        this.prepared_request[memQuestn + '_main'] = '0';
                        this.processed_request['___' + memQuestn + '_details___'] = '';
                        if (j === 40) {
                            this.processed_request['___member_' + member + '_question_41_details___'] = 'No';
                        }
                    }
                    this.processed_request['___' + memQuestn + '_main___'] = this.prepared_request[memQuestn + '_main'];

                    if (this.lm_request['member_' + member + '_additionalQue_1'] === "yes") {
                        if (this.processed_request['___member_' + member + '_additionalQue_1_subQue_' + (j - 30) + '___'] === "0") {
                            this.processed_request['___member_' + member + '_additionalQue_1_subQue_' + (j - 30) + '___'] = '';
                            this.method_content = this.method_content.replace('<' + tagsobj[(j - 30)] + '>___member_' + member + '_additionalQue_1_subQue_' + (j - 30) + '___</' + tagsobj[(j - 30)] + '>', '<' + tagsobj[(j - 30)] + ' />');
                        }
                        this.processed_request['___member_' + member + '_additionalQue_1_subQue_2___'] = moment(this.processed_request['___member_' + member + '_additionalQue_1_subQue_2___']).format('DD/MM/YYYY');
                    }
                    if (this.lm_request['member_' + member + '_additionalQue_2'] === "yes") {
                        if (this.processed_request['___member_' + member + '_additionalQue_2_subQue_' + (j - 30) + '___'] === "0") {
                            this.processed_request['___member_' + member + '_additionalQue_2_subQue_' + (j - 30) + '___'] = '';
                            this.method_content = this.method_content.replace('<' + tagsobj[(j - 30)] + '>___member_' + member + '_additionalQue_2_subQue_' + (j - 30) + '___</' + tagsobj[(j - 30)] + '>', '<' + tagsobj[(j - 30)] + ' />');
                        }
                        this.processed_request['___member_' + member + '_additionalQue_2_subQue_2___'] = moment(this.processed_request['___member_' + member + '_additionalQue_2_subQue_2___']).format('DD/MM/YYYY');
                    }
                }
            }
        }
        for (member = 3; member <= child + 2; member++) {
            this.calculate_bmi(member);
            this.prepared_request["member_" + member + '_id'] = '820' + this.prepared_request['insurer_customer_identifier_3'] + member.toString();
            this.processed_request["___member_" + member + "_id___"] = this.prepared_request["member_" + member + '_id'];
            this.prepared_request['member_' + member + '_dob'] = this.get_member_dob(this.prepared_request['member_' + member + '_birth_date']);
            this.processed_request['___member_' + member + '_dob___'] = this.prepared_request['member_' + member + '_dob'];
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
            this.prepared_request['proposer_pep'] = this.lm_request['is_pep'];
            this.processed_request['___proposer_pep___'] = this.lm_request['is_pep'];
            this.prepared_request['member_' + member + '_pep'] = this.lm_request['member_' + member + '_pep'];
            this.processed_request['___member_' + member + '_pep___'] = this.lm_request['member_' + member + '_pep'];
            this.prepared_request['member_' + member + '_gender_3'] = this.lm_request['member_' + member + '_gender'] === 'M' ? 'Male' : 'Female';
            this.processed_request['___member_' + member + '_gender_3___'] = this.prepared_request['member_' + member + '_gender_3'];

            if (this.prepared_request['dbmaster_plan_id'] === 62) {
                this.prepared_request['member_' + member + '_practitnr_id'] = '';
                this.processed_request['___member_' + member + '_practitnr_id___'] = '';
                this.prepared_request['member_' + member + '_council_name'] = '';
                this.processed_request['___member_' + member + '_council_name___'] = '';
                this.prepared_request['member_' + member + '_work_addrs'] = '';
                this.processed_request['___member_' + member + '_work_addrs___'] = '';
                this.prepared_request['member_' + member + '_has_practitnr_discnt'] = 'No';
                this.processed_request['___member_' + member + '_has_practitnr_discnt___'] = 'No';
            }
            let preg_block = this.find_text_btw_key(this.method_content.toString(), "<!--___member_" + member + "_preg_Start-->", "<!--___member_" + member + "_preg_End-->", true);
            this.method_content = this.method_content.replace(preg_block, '');

            if (this.lm_request['member_' + member + '_additionalQue_1'] === 'no') {
                var start_tag = "<!--___member_" + member + "_aqblock_Start-->";
                var end_tag = "<!--___member_" + member + "_aqblock_End-->";
                let addn_block = this.find_text_btw_key(this.method_content.toString(), start_tag, end_tag, true);
                this.method_content = this.method_content.replace(addn_block, '');
            } else {
                this.processed_request['___member_' + member + '_additionalQue_1_onset___'] = (this.lm_request['member_' + member + '_additionalQue_1_subQue_4'] !== undefined && this.lm_request['member_' + member + '_additionalQue_1_subQue_4'] !== '') ? this.date_format(this.lm_request['member_' + member + '_additionalQue_1_subQue_4'], 'dd/mm/yyyy') : '';
            }
            if (this.lm_request['member_' + member + '_additionalQue_2'] === 'no') {
                if (this.lm_request['member_' + member + '_additionalQue_1'] === 'yes') {
                    var start_tag = "<!--___member_" + member + "_block2_Start-->";
                    var end_tag = "<!--___member_" + member + "_block2_End-->";
                    let addn_block = this.find_text_btw_key(this.method_content.toString(), start_tag, end_tag, true);
                    this.method_content = this.method_content.replace(addn_block, '');
                }
            } else {
                this.processed_request['___member_' + member + '_additionalQue_2_onset___'] = (this.lm_request['member_' + member + '_additionalQue_2_subQue_4'] !== undefined && this.lm_request['member_' + member + '_additionalQue_2_subQue_4'] !== '') ? this.date_format(this.lm_request['member_' + member + '_additionalQue_2_subQue_4'], 'dd/mm/yyyy') : '';
            }
            if (this.lm_request["member_" + member + "_question_1_details"] === false) {
                var start_tag = "<!--___member_" + member + "_familyHistory_Start-->";
                var end_tag = "<!--___member_" + member + "_familyHistory_End-->";
                let fam_history_block = this.find_text_btw_key(this.method_content.toString(), start_tag, end_tag, true);
                this.method_content = this.method_content.replace(fam_history_block, '<FAMILY_MEDICAL_HISTORY_SET/> ');
            }

            for (var key in this.lm_request) {
                if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1 && key.includes("member_" + member)) {
                    var ques_detail = key.replace('_type', '_details');
                    if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                        if (this.lm_request[ques_detail] === false) {
                            this.prepared_request[ques_detail] = "0";
                            this.processed_request['___' + ques_detail + '___'] = "0";
                            if (this.prepared_request['dbmaster_plan_id'] === 61) {
                                if (ques_detail.includes('_26_') || ques_detail.includes('_33_') || ques_detail.includes('_34_')) {
                                    this.processed_request['___' + ques_detail + '1___'] = "0";
                                    this.processed_request['___' + ques_detail + '___'] = "";
                                }
                                if (ques_detail.includes('_30_') || ques_detail.includes('_31_') || ques_detail.includes('_32_')) {
                                    if (this.lm_request["member_" + member + "_question_30_details"] === false && this.lm_request["member_" + member + "_question_31_details"] === false &&
                                            this.lm_request["member_" + member + "_question_32_details"] === false) {
                                        this.processed_request['___member_' + member + '_consumes_alcohol___'] = "0";
                                        this.processed_request['___' + ques_detail + '___'] = "";
                                    }
                                }
                            } else if (this.prepared_request['dbmaster_plan_id'] === 62 && ques_detail.includes('_41_')) {
                                this.prepared_request[ques_detail] = "No";
                                this.processed_request['___' + ques_detail + '___'] = "No";
                            }
                        } else {
                            this.prepared_request[ques_detail] = "1";
                            this.processed_request['___' + ques_detail + '___'] = "1";
                            if (this.prepared_request['dbmaster_plan_id'] === 62 && ques_detail.includes('_41_')) {
                                this.prepared_request[ques_detail] = "Yes";
                                this.processed_request['___' + ques_detail + '___'] = "Yes";
                            }

                        }
                    } else if (this.lm_request[key].toString().toLowerCase() === 'since') {
                        if (ques_detail.includes('_26_') || ques_detail.includes('_33_') || ques_detail.includes('_34_')) {
                            this.processed_request['___' + ques_detail + '1___'] = "1";
                        }
                        if (ques_detail.includes('_30_') || ques_detail.includes('_31_') || ques_detail.includes('_32_')) {
                            this.processed_request['___member_' + member + '_consumes_alcohol___'] = "1";
                        }
                        this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                        this.processed_request['___' + ques_detail + '___'] = this.lm_request[ques_detail];
                    }
                }
                if (key.indexOf('_subQue_') > -1 && key.includes("member_" + member)) {
                    this.prepared_request[key] = this.lm_request[key];
                    this.processed_request['___' + key + '___'] = this.lm_request[key];
                }
            }
            if (this.prepared_request['dbmaster_plan_id'] === 62) {
                var tagsobj = {8: 'HBA1C_LEVEL', 9: 'BP_DYSTOLIC', 10: 'BP_SYSTOLIC'};
                for (var j = 38; j < 41; j++) {
                    var memQuestn = 'member_' + member + '_question_' + j;
                    if (this.lm_request[memQuestn + '_type'] === "since") {
                        this.prepared_request[memQuestn + '_main'] = '1';
                    } else {
                        this.prepared_request[memQuestn + '_main'] = '0';
                        this.processed_request['___' + memQuestn + '_details___'] = '';
                        if (j === 40) {
                            this.processed_request['___member_' + member + '_question_41_details___'] = 'No';
                        }
                    }
                    this.processed_request['___' + memQuestn + '_main___'] = this.prepared_request[memQuestn + '_main'];

                    if (this.lm_request['member_' + member + '_additionalQue_1'] === "yes") {
                        if (this.processed_request['___member_' + member + '_additionalQue_1_subQue_' + (j - 30) + '___'] === "0") {
                            this.processed_request['___member_' + member + '_additionalQue_1_subQue_' + (j - 30) + '___'] = '';
                            this.method_content = this.method_content.replace('<' + tagsobj[(j - 30)] + '>___member_' + member + '_additionalQue_1_subQue_' + (j - 30) + '___</' + tagsobj[(j - 30)] + '>', '<' + tagsobj[(j - 30)] + ' />');
                        }
                        this.processed_request['___member_' + member + '_additionalQue_1_subQue_2___'] = moment(this.processed_request['___member_' + member + '_additionalQue_1_subQue_2___']).format('DD/MM/YYYY');
                    }
                    if (this.lm_request['member_' + member + '_additionalQue_2'] === "yes") {
                        if (this.processed_request['___member_' + member + '_additionalQue_2_subQue_' + (j - 30) + '___'] === "0") {
                            this.processed_request['___member_' + member + '_additionalQue_2_subQue_' + (j - 30) + '___'] = '';
                            this.method_content = this.method_content.replace('<' + tagsobj[(j - 30)] + '>___member_' + member + '_additionalQue_2_subQue_' + (j - 30) + '___</' + tagsobj[(j - 30)] + '>', '<' + tagsobj[(j - 30)] + ' />');
                        }
                        this.processed_request['___member_' + member + '_additionalQue_2_subQue_2___'] = moment(this.processed_request['___member_' + member + '_additionalQue_2_subQue_2___']).format('DD/MM/YYYY');
                    }
                }
            }
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
        this.method_content = this.method_content.replaceAll(/<!--(.*?)-->/g, "");
    }
    if (this.lm_request['method_type'] === 'Verification') {
        this.method_content = this.insurer_master['service_logs']['pb_db_master']['Insurer_Request'];
        var obj_replace = {
            "<Transaction_Number>_</Transaction_Number>": "<Transaction_Number>" + this.lm_request['transaction_number'] + "</Transaction_Number>"
        };
        this.method_content = this.method_content.toString().replaceJson(obj_replace);
    }

    console.log(this.processed_request);
    console.log(this.method_content);
};
MaxBupaHealth.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
MaxBupaHealth.prototype.insurer_product_field_process_post = function () {

};
MaxBupaHealth.prototype.insurer_product_api_post = function () {

};
MaxBupaHealth.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
//    console.log('service_call');
    try {
        var objInsurerProduct = this;
        var body = docLog.Insurer_Request;
        var http = require('http');
        var xml2js = require('xml2js');
        var stripPrefix = require('xml2js').processors.stripPrefix;
        if (this.lm_request['method_type'] !== "Verification") {
            if (this.lm_request['method_type'] === "Pdf") {

                var Client = require('node-rest-client').Client;
                var client = new Client();
                var token_url = config.environment.name === 'Production' ? '' : 'http://serviceuat.nivabupa.com/TokenService/Api/tokenGenration_Wrapper';

                var args = {
                    data: {
                        "PartnerCode": "VM3Jzw56!A"
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }
                };
                client.post(token_url, args, function (data, response) {
//                    console.log('token', JSON.stringify(data));

                    var args1 = {
                        data: {
                            "AccessKey": data['Token'],
                            "ApplicationOrPolicyNo": objInsurerProduct.lm_request['policy_number'],
                            "DOB": (objInsurerProduct.processed_request['___member_1_birth_date___']).replaceAll("/", '-')
                        },
                        headers: {
                            "Content-Type": "application/json"
                        }
                    };
                    docLog.Insurer_Request = args1['data'];
                    client.post(specific_insurer_object.method_file_url, args1, function (data, response) {
                        // parsed response body as js object 
                        console.error('policy status', JSON.stringify(data));
                        var objResponseFull = {
                            'err': null,
                            'result': null,
                            'raw': JSON.stringify(data),
                            'soapHeader': null,
                            'objResponseJson': data
                        };
                        objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                    });
                });
            } else {
                var method_action = (docLog.Plan_Id === 62 && this.lm_request['method_type'] === 'Premium') ? "GetPremiumForReAssuredProduct" : specific_insurer_object.method.Method_Action;
                var hostname = this.lm_request['method_type'] === 'Premium' ? ((config.environment.name === 'Production') ? "services.nivabupa.com" : "serviceuat.nivabupa.com") : "servicesone.nivabupa.com";
                //var contentType = this.lm_request['method_type'] === 'Premium' ? "application/soap+xml;charset=UTF-8" : "text/xml;charset=UTF-8";
                if (this.lm_request['method_type'] === 'Customer' && config.environment.name !== 'Production') {
                    http = require('https');
                }
                var contentType = "text/xml;charset=UTF-8";
                var postRequest = {
                    host: hostname,
                    path: specific_insurer_object.method.Service_URL,
                    method: "POST",
                    headers: {
                        'Cookie': "cookie",
                        'Content-Type': contentType,
                        "SOAPAction": "http://tempuri.org/" + method_action,
                        'Content-Length': Buffer.byteLength(body)
                    }
                };
                process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
                var req = http.request(postRequest, function (res) {
//                    console.log(res.statusCode);
                    var buffer = "";
                    res.on("data", function (data) {
                        buffer = buffer + data;
                    });
                    res.on("end", function (data) {
//                        console.log(buffer);
                        xml2js.parseString(buffer, {tagNameProcessors: [stripPrefix]}, function (err, objXml2Json) {
                            var objResponseFull = {
                                'err': err,
                                'result': buffer,
                                'raw': buffer,
                                'soapHeader': null,
                                'objResponseJson': objXml2Json
                            };
                            if (objInsurerProduct.lm_request['method_type'] === 'Premium') {
                                objResponseFull['objResponseJson']['actualPlanId'] = docLog['Plan_Id'];
                            }
                            objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                        });
                    });
                });
                req.on('error', function (e) {
                    console.error('problem with request: ' + e.message);
                });
                req.write(body);
                req.end();
            }
        } else {
            console.log('Start', 'maxbupa_final_push');
            var postRequest = {
                host: ((config.environment.name !== 'Production') ? "223.31.157.7" : "223.31.157.19"),
                port: 8091,
                path: "/NgcomplexModified/services/NgcomplexService/",
                method: "POST",
                headers: {
                    'Cookie': "cookie",
                    'Content-Type': 'text/xml;charset=UTF-8',
                    'Content-Length': Buffer.byteLength(body),
                    "SOAPAction": ""
                }
            };
//            console.log(postRequest);
            var req = http.request(postRequest, function (res) {
//                console.log(res.statusCode);
                var buffer = "";
                res.on("data", function (data) {
                    buffer = buffer + data;
                });
                res.on("end", function (data) {
//                    console.log(buffer);
                    xml2js.parseString(buffer, {tagNameProcessors: [stripPrefix]}, function (err, objXml2Json) {
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
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};
MaxBupaHealth.prototype.premium_response_handler = function (objResponseJson) {
//    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        var objPremiumService = objResponseJson;
        //check error start
        if (objResponseJson.hasOwnProperty("Envelope")) {
            if (objResponseJson["Envelope"].hasOwnProperty("Body")) {
                if (objResponseJson["Envelope"].hasOwnProperty("Body")) {
                    if (objResponseJson["Envelope"]["Body"]["0"].hasOwnProperty('GetPremiumForHCV3Response')) {
                        objPremiumService = objResponseJson["Envelope"]["Body"]["0"]["GetPremiumForHCV3Response"]["0"]["GetPremiumForHCV3Result"]["0"];
                    } else if (objResponseJson.Envelope.Body[0].hasOwnProperty('GetPremiumForReAssuredProductResponse')) {
                        objPremiumService = objResponseJson.Envelope.Body[0].GetPremiumForReAssuredProductResponse[0].GetPremiumForReAssuredProductResult[0];
                    } else {
                        Error_Msg = JSON.stringify(objPremiumService);
                    }
                }
            } else {
                Error_Msg = 'LM_NODE_MISSING_Body';
            }
        } else {
            Error_Msg = 'LM_NODE_MISSING_Envelope';
        }
        if (Error_Msg === 'NO_ERR')
        {
            var premium_breakup = this.get_const_premium_breakup();
            if (objResponseJson['actualPlanId'] === 62) {
                premium_breakup['final_premium'] = objPremiumService.NetPremium[0];
                premium_breakup['net_premium'] = objPremiumService.GrossPremium[0];
                premium_breakup['service_tax'] = premium_breakup['final_premium'] - premium_breakup['net_premium'];
            } else {
                premium_breakup['final_premium'] = objPremiumService["diffgram"]["0"]["DocumentElement"]["0"]["ProductPremium"]["0"]["Net_Premium_WithTaxAndMemberLoading"]["0"];
                premium_breakup['net_premium'] = objPremiumService["diffgram"]["0"]["DocumentElement"]["0"]["ProductPremium"]["0"]["Gross_Premium_With_MemberLoading"]["0"];
                premium_breakup['service_tax'] = premium_breakup['final_premium'] - premium_breakup['net_premium'];
            }

            objServiceHandler.Premium_Breakup = premium_breakup;
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
MaxBupaHealth.prototype.customer_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'customer_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Customer': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson.hasOwnProperty('Envelope') && objResponseJson['Envelope'].hasOwnProperty('Body')) {
            if (objResponseJson['Envelope']['Body']['0'].hasOwnProperty('Fault'))
            {
                Error_Msg = objResponseJson['Envelope']['Body']['0']['Fault']['0']['Reason']['0']['Text']['0'].toString();
            } else {
                if (objResponseJson['Envelope']['Body']['0'].hasOwnProperty('GetUWDecisionResponse')) {
                    if (objResponseJson['Envelope']['Body']['0']['GetUWDecisionResponse']['0'].hasOwnProperty('GetUWDecisionResult')) {
                        objResponseJson = objResponseJson['Envelope']['Body']['0']['GetUWDecisionResponse']['0']['GetUWDecisionResult']['0'];
                    } else {
                        Error_Msg = 'LM_NODE_MISSING_GetUWDecisionResult';
                    }
                } else {
                    Error_Msg = 'LM_NODE_MISSING_GetUWDecisionResponse';
                }
            }
        } else {
            Error_Msg = 'LM_MSG:CUSTOMER_MAIN_NODE_MISSING';
        }
        if (Error_Msg === 'NO_ERR') {
            var strUwReposnse = this.find_text_btw_key(objResponseJson, '<APPLICATION_FORM>', '</APPLICATION_FORM>', false);
            var respStatus = this.find_text_btw_key(strUwReposnse, '<ERROR_STATUS>', '</ERROR_STATUS>', false);
            var uwStatus = this.find_text_btw_key(strUwReposnse, '<HUMS_PROPOSAL_STATUS>', '</HUMS_PROPOSAL_STATUS>', false);
            var errDesc = this.find_text_btw_key(strUwReposnse, '<ERROR_DESC>', '</ERROR_DESC>', false);
            var Customer = {
                'insurer_customer_identifier': respStatus + '|' + uwStatus,
                'insurer_customer_identifier_2': "BB" + this.lm_request['crn'] + "111",
                'insurer_customer_identifier_3': this.prepared_request['current_time']
            };
            if (uwStatus === "RJ") {
                var msg = this.find_text_btw_key(strUwReposnse, '<MESSAGE>', '</MESSAGE>', false);
                Error_Msg = "Proposal rejected per Insurer's Underwriting terms - " + msg;
            } else if (this.prepared_request.hasOwnProperty('bmi_err')) {
                Error_Msg = this.prepared_request['bmi_err'];
            } else {
                if (respStatus !== "Success") {
                    Error_Msg = "Proposal " + respStatus;
                    if (this.prepared_request.hasOwnProperty('section_b') && errDesc.includes('B')) {
                        Error_Msg = (Error_Msg !== 'NO_ERR') ? Error_Msg + ', ' + this.prepared_request['section_b'] : this.prepared_request['section_b'];
                    }
                    if (this.prepared_request.hasOwnProperty('proper_option') && (errDesc.includes('YEARS COUNT') || errDesc.includes('MEDICAL') || errDesc.includes('MEDICINE'))) {
                        Error_Msg = (Error_Msg !== 'NO_ERR') ? Error_Msg + ', ' + this.prepared_request['proper_option'] : this.prepared_request['proper_option'];
                    }
                }
                if (uwStatus !== "RJ") {
                    if (this.prepared_request.hasOwnProperty('diabetes_err')) {
                        Error_Msg = (Error_Msg !== 'NO_ERR') ? Error_Msg + ', ' + this.prepared_request['diabetes_err'] : this.prepared_request['diabetes_err'];
                    }
                    if (this.prepared_request.hasOwnProperty('hypertension_err')) {
                        Error_Msg = (Error_Msg !== 'NO_ERR') ? Error_Msg + ', ' + this.prepared_request['hypertension_err'] : this.prepared_request['hypertension_err'];
                    }
                    if (this.prepared_request.hasOwnProperty('section_a') && this.prepared_request['section_a'] !== "") {
                        Error_Msg = (Error_Msg !== 'NO_ERR') ? Error_Msg + ', ' + this.prepared_request['section_a'] : this.prepared_request['section_a'];
                    }
                    if (this.prepared_request.hasOwnProperty('pregnancy_err')) {
                        Error_Msg = (Error_Msg !== 'NO_ERR') ? Error_Msg + ', ' + this.prepared_request['pregnancy_err'] : this.prepared_request['pregnancy_err'];
                    }
                }
            }
            objServiceHandler.Customer = Customer;
            objServiceHandler.Insurer_Transaction_Identifier = "BB" + this.lm_request['crn'] + "111";
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
MaxBupaHealth.prototype.proposal_response_handler = function (objResponseJson) {
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
            var unqProposalNum = this.processed_request["___transaction_num___"];
            var premium = this.lm_request['final_premium'];
            var appId = this.prepared_request["customer_id"];
            var returnUrl = this.const_payment.pg_ack_url;
            if (config.environment.name === 'Production') {
                objServiceHandler.Payment.pg_url += "?unqPolicyNumber=" + unqProposalNum + "&premiumValue=" + premium + "&otherParam=OnlineSales01&paymentType=mxbpofflinewithoutemi" + "&additionalComment=" + appId + ',' + premium + "&returnPath=" + returnUrl;
            } else {
                objServiceHandler.Payment.pg_url += "?unqPolicyNumber=" + unqProposalNum + "&premiumValue=" + premium + "&otherParam=OnlineSales01&paymentType=mxbpofflinewithoutemi" + "&additionalComment=" + appId + ',' + premium + "&returnPath=" + returnUrl;
//                https://paymbhid.maxbupa.com/Pages/getPaymentValues.aspx?unqPolicyNumber=SI6920262223&premiumValue=1&otherParam=OnlineSales01&paymentType=mxbpofflinewithoutemi&additionalComment=839xxxxxxxxx,200&returnPath=https://sandbox.sana.insure/success
            }
            objServiceHandler.Payment.pg_redirect_mode = 'POST';
            objServiceHandler.Insurer_Transaction_Identifier = appId;
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
MaxBupaHealth.prototype.verification_response_handler = function (objResponseJson) {
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
            if (objResponseJson.hasOwnProperty("Envelope") && objResponseJson["Envelope"].hasOwnProperty("Body")) {
                if (objResponseJson["Envelope"]["Body"]["0"].hasOwnProperty('getNgcomplexResponse')) {
                    if (objResponseJson["Envelope"]["Body"]["0"]["getNgcomplexResponse"]["0"].hasOwnProperty('ngResponse')) {
                    } else {
                        Error_Msg = 'LM_NODE_MISSING_ngResponse';
                    }
                } else {
                    Error_Msg = 'LM_NODE_MISSING_getNgcomplexResponse';
                }
            } else {
                Error_Msg = 'LM_MAIN_NODE_MISSING';
            }

            if (Error_Msg === 'NO_ERR')
            {
                var pdf_file_name = this.constructor.name + '_' + 'Health' + '_' + this.const_policy.policy_number + '.pdf';
                var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                var customer = this.insurer_master['service_logs']['pb_db_master']["LM_Custom_Request"]["insurer_customer_identifier"];
                var uwFlag = customer.split("|")[1];
                var pushResponse = objResponseJson['Envelope']['Body']['0']['getNgcomplexResponse']['0']['ngResponse']['0'];
                if (pushResponse.includes("Success")) {
                    this.const_policy.transaction_substatus = (uwFlag === "AC") ? "IF" : "UW";
                } else {
                    this.const_policy.transaction_status = 'PAYPASS';
                }
                var args = {
                    data: {
                        "search_reference_number": this.lm_request['search_reference_number'],
                        "api_reference_number": this.lm_request['api_reference_number'],
                        "policy_number": this.lm_request.transaction_id,
                        'client_key': this.lm_request['client_key'],
                        'secret_key': this.lm_request['secret_key'],
                        'insurer_id': this.lm_request['insurer_id'],
                        'method_type': 'Pdf',
                        'execution_async': 'no'
                    },
                    headers: {
                        "Content-Type": "application/json",
                        'client_key': this.lm_request['client_key'],
                        'secret_key': this.lm_request['secret_key']
                    }
                };
                this.pdf_call(config.environment.weburl + '/quote/pdf_initiate', args, pdf_sys_loc);
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
MaxBupaHealth.prototype.pdf_call = function (url, args, pdf_sys_loc) {
    var objInsurerProduct = this;
    objInsurerProduct.pdf_attempt++;
    var Client = require('node-rest-client').Client;
    var client = new Client();
    client.post(url, args, function (data, response) {
        if (data.Error_Code !== '' || true) {
            if (!fs.existsSync(pdf_sys_loc) && objInsurerProduct.pdf_attempt < 11) {
                var sleep = require('system-sleep');
                sleep(600000);
                objInsurerProduct.pdf_call(url, args, pdf_sys_loc);
            }
        }
    });
};
MaxBupaHealth.prototype.pdf_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'pdf_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    try {
        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null,
            'Policy': null
        };
        let policy = {
            'policy_url': null,
            'policy_number': this.lm_request['policy_number'],
            'pdf_status': null
        };
        if (objResponseJson['Status'] === "Failed") {
            Error_Msg = objResponseJson['ErrorMessage'];
        } else {
            if (objResponseJson['Details']['PolicyNumber'] === "" || objResponseJson['Details']['PolicyNumber'] === null) {
                Error_Msg = objResponseJson['Details'].Sales_Status;
            }
        }
        if (Error_Msg === 'NO_ERR') {
            policy.policy_number = objResponseJson['Details'].PolicyNumber;
            let pdf_file_name = this.constructor.name + '_Health_' + policy.policy_number + '.pdf';
            let pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
            let pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
            policy.policy_url = pdf_web_path_portal;

            try {
                var Client = require('node-rest-client').Client;
                var client = new Client();
                var pdf_url = config.environment.name === 'Production' ? '' : "http://223.31.157.7:8091/DocumentWrapperService/api/Wrapper/postDocumentStatus";
                var args = {
                    data: {
                          "Request_ID": this.lm_request['policy_number'],
                          "Type": "Download",
                          "Username": "Test1",
                          "Password": "Test123",
                          "Document_Name": "Policy_Document",
                          "UniqueIdentifier": policy.policy_number
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }};

                client.post(pdf_url, args, function (data, response) {
                    console.log('pdf', JSON.stringify(data));
                    if (data.status === "Failure") {
                        policy.pdf_status = 'FAIL';
                    } else {
                        policy.pdf_status = 'SUCCESS';
                        var binary = new Buffer(data.DocContent, 'base64');
                        fs.writeFileSync(pdf_sys_loc_horizon, binary);
                    }
                });
            } catch (ep) {
                console.error('ExceptionPDF', this.constructor.name, 'pdf_response_handler', ep);
            }
            objServiceHandler.Insurer_Transaction_Identifier = policy.policy_number;
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
MaxBupaHealth.prototype.pg_response_handler = function () {
    try {
        //MAXBUPA|BB3326881111|1.00|06/02/2020 3:45:14 PM|mxbpofflinewithoutemi-1029047A#00#HO,|309005804447|M001||||HO|||||||F
        //MAXBUPA|BB10199401111|1.00|10/08/2020 10:08:11 AM|mxbpofflinewithoutemi-1032617A#00#HO,|309006279930|M010|Transaction Declined by Bank(Not Enrolled Card)|||HO|||||||
        console.log('Start', this.constructor.name, 'pg_response_handler');
        this.const_policy.transaction_id = this.insurer_master['service_logs']['pb_db_master'].Insurer_Transaction_Identifier;
        if (this.const_payment_response.pg_post.hasOwnProperty("returnMessage")) {
            //var output = this.decrypt_pg_response(this.const_payment_response.pg_post['returnMessage']);//encrypted using RijndaelManaged
            var soap = require('soap');
            let decrption_url = config.environment.name === 'Production' ? "http://services.nivabupa.com/websiteService/Service1.svc?wsdl" : "http://serviceuat.nivabupa.com/websiteService/Service1.svc?wsdl";
            let method_action = 'decResp';
            var args = {
                cipherText: this.const_payment_response.pg_post['returnMessage'],
                EncryptionKey: '!max#bupapolicyboss@'
            };
            var objInsurerProduct = this;
            soap.createClient(decrption_url, function (err, client) {
                client[method_action](args, function (err1, result, raw, soapHeader) {
                    if (err1) {
                        objInsurerProduct.const_policy.pg_status = 'FAIL';
                        console.error('MaxBupaHealth', 'Decryption Service', 'exception', err1);
                    } else {
                        console.log(result);
                        var output = result.decRespResult;
                        var response = output !== undefined ? output.split("|") : "";
                        if (response['6'] === "M001") {
                            objInsurerProduct.const_policy.transaction_amount = response['2'];
                            objInsurerProduct.const_policy.pg_status = 'SUCCESS';
                            objInsurerProduct.const_policy.policy_number = '';
                            objInsurerProduct.const_policy.transaction_status = 'SUCCESS';
                            objInsurerProduct.const_policy.pg_reference_number_1 = response['1'];
                            objInsurerProduct.const_policy.pg_reference_number_2 = response['5'];
                            objInsurerProduct.const_policy.pg_reference_number_3 = output;
                            objInsurerProduct.lm_request['transaction_number'] = response['5'];
                        } else if (response['6'] === "M010") {
                            objInsurerProduct.const_policy.pg_reference_number_3 = output;
                            objInsurerProduct.const_policy.pg_status = 'FAIL';
                            objInsurerProduct.const_policy.transaction_status = 'FAIL';
                        }
                    }
                });
            });
            sleep(2000);
        } else {
            if (this.const_payment_response.pg_post.hasOwnProperty("pg_reference_number")) {
                this.lm_request['transaction_number'] = this.const_payment_response.pg_post['pg_reference_number'];
                this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.transaction_status = 'SUCCESS';
            } else {
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
            }
        }
        console.error('End', this.constructor.name, 'pg_response_handler', this.const_policy);
    } catch (ex) {
        this.const_policy.pg_status = 'FAIL';
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
MaxBupaHealth.prototype.decrypt_pg_response = function (encryptedResponse) {
    var key = "3E8xgMIwyOCNi94tary64bTb3kCEimbFM2jkE/Vmwxw=";
    var iv = "bBouicPilr6dSKODZRXUoQ==";
    const aes_key = new Buffer.from(key, 'base64');
    const aes_iv = new Buffer.from(iv, 'base64');
    var decipher = crypto.createDecipheriv('AES-256-CBC', aes_key, aes_iv);
    const Ciphertextbytes = new Buffer.from(encryptedResponse, 'base64');
    let decrypted = decipher.update(Ciphertextbytes);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    console.log("Maxbupa decryption-", decrypted.toString());
    return decrypted.toString();
};
MaxBupaHealth.prototype.get_member_dob = function (dob) {
    console.log(this.constructor.name, 'member_dob');
    var splitDate = dob.split('-');
    var year = splitDate[0];
    var mm = splitDate[1];
    var day = splitDate[2];
    var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    var bday = day + '-' + months[mm - 1] + '-' + year;
    return bday;
};
MaxBupaHealth.prototype.get_member_relation = function (i) {
    console.log(this.constructor.name, 'get_member_relation', ' Start MaxBupaHealth');
    var gender = this.lm_request['member_' + i + '_gender'];
    console.log("Gender in MaxBupaHealth " + gender);
    if (this.prepared_request["relation"] === 'Mother' || this.prepared_request["relation"] === 'Father') {
        return(gender === 'M' ? 'Son' : 'Daughter');
    }
    if (this.prepared_request["relation"] === 'Son' || this.prepared_request["relation"] === 'Daughter') {
        return(gender === 'M' ? 'Father' : 'Mother');
    }
    if (this.prepared_request["relation"] === 'Spouse') {
        if (i >= 3) {
            return(gender === 'M' ? 'Son' : 'Daughter');
        }
        return 'Spouse';
    }
    if (this.prepared_request["relation"] === 'Self' || this.prepared_request["relation"] === '') {
        if (i >= 3) {
            return(gender === 'M' ? 'Son' : 'Daughter');
        } else if (i === 1) {
            return 'Self';
        } else if (i === 2) {
            return 'Spouse';
        }
    }
    return 'Others';
    console.log(this.constructor.name, 'get_member_relation', 'End MaxBupaHealth');
};
MaxBupaHealth.prototype.policy_received_date = function () {
    console.log(this.constructor.name, 'policy_received_date');
    var pol_rec_date = moment().format('DD/MM/YYYY');
    return pol_rec_date;
};
MaxBupaHealth.prototype.get_proposal_time = function () {
    var today = new Date();
    var hrs = today.getHours();
    var mins = today.getMinutes();
    var secs = today.getSeconds();
    if (hrs < 10) {
        hrs = '0' + hrs;
    }
    if (mins < 10) {
        mins = '0' + mins;
    }
    if (secs < 10) {
        secs = '0' + secs;
    }
    proposal_time = hrs + '' + mins + '' + secs;
    return proposal_time;
};
MaxBupaHealth.prototype.calculate_bmi = function (i) {
    var height = this.prepared_request['member_' + i + '_height'];
    var weight = this.prepared_request['member_' + i + '_weight'];

    var bmi = Number(((weight / height / height) * 10000).toFixed(2));
    this.prepared_request['member_' + i + '_bmi'] = bmi;
    this.processed_request['___member_' + i + '_bmi___'] = bmi;
};
MaxBupaHealth.prototype.check_bmi = function (bmi) {
    if (bmi <= 15 || bmi > 37) {
        this.prepared_request['bmi_err'] = "Proposal Rejected : Body Mass index is not within range";
    }
};
MaxBupaHealth.prototype.current_time = function () {
    var today = moment().utcOffset("+05:30");
    var current_time = moment(today).format("HH:mm:ss");
    current_time = current_time.replaceAll(":", "");
    return current_time;
};
MaxBupaHealth.prototype.is_valid_plan = function (lm_request, planCode) {
    console.log('MaxBupaHealth is_valid_plan', 'start');
    var si = Number(lm_request['health_insurance_si']);
    if (planCode === "ReAssure" && (si === 3000000 || lm_request['member_1_age'] > 65)) {
        return false;
    } else if (planCode === "Companion" && (si === 2500000 || lm_request['member_3_age'] > 21)) {
        return false;
    } else {
        return true;
    }
    console.log('MaxBupaHealth is_valid_plan', 'End');
};
MaxBupaHealth.prototype.premium_breakup_schema = {
    "base_premium": "basePremium",
    "net_premium": "premium",
    "service_tax": "serviceTax",
    "SBC": "SBC",
    "KKC": "KKC",
    "gross_premium": "grossPremium",
    "final_premium": "totalPremium"
};
module.exports = MaxBupaHealth;