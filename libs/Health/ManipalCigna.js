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
var moment = require('moment');
var serviceLog = require(appRoot + '/models/service_log');
var sleep = require('system-sleep');

function ManipalCigna() {

}
util.inherits(ManipalCigna, Health);
ManipalCigna.prototype.insurer_date_format = 'dd/MM/yyyy';
ManipalCigna.prototype.const_insurer_suminsured = [250000, 350000, 450000, 550000, 750000, 1000000, 1500000, 2000000, 2500000, 3000000, 5000000, 10000000];
var baseVerifyReq = '';

ManipalCigna.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
ManipalCigna.prototype.insurer_product_field_process_pre = function () {
    console.log(this.processed_request);
    var channelId = ((config.environment.name === 'Production') ? 350 : 148);//325
    this.prepared_request['channel_id'] = channelId;
    this.processed_request['___channel_id___'] = channelId;
    this.prepared_request['policy_received_date'] = moment().format('DD/MM/YYYY');
    this.processed_request['___policy_received_date___'] = this.prepared_request['policy_received_date'];
    this.prepared_request['topup'] = this.get_topup();
    this.processed_request['___topup___'] = this.prepared_request['topup'];

//    if (this.lm_request['is_posp'] === "yes" && this.prepared_request['health_insurance_si'] <= 500000) {
//        this.prepared_request['posp_pan_no'] = this.docRequest.Request_Core['posp_pan_no'];
//        this.processed_request['___posp_pan_no___'] = this.prepared_request['posp_pan_no'];
//        this.prepared_request['posp_name'] = this.docRequest.Request_Core['posp_first_name'] + ' ' + this.docRequest.Request_Core['posp_last_name'];
//        this.processed_request['___posp_name___'] = this.prepared_request['posp_name'];
//    } else {
//        var posp_request_data = this.find_text_btw_key(this.method_content.toString(), '<!--POSPDetail_Start-->', '<!--POSPDetail_End-->', true);
//        this.method_content = this.method_content.replace(posp_request_data, '');
//        this.method_content = this.method_content.replace('<!--POSPDetail_Start-->', '');
//        this.method_content = this.method_content.replace('<!--POSPDetail_End-->', '');
//    }

    if (this.lm_request['method_type'] === 'Premium') {
        if (this.lm_request['multi_individual'] !== "yes") {
            if (this.prepared_request['Plan_Id'] === 219) {
                var topupBaseOption = (this.lm_request['health_insurance_type'] === 'individual') ? 'IN-PRT4.5-HMB500' : 'FL-PRT4.5-HMB500';
                var obj_replace = {
                    '"productPlanOptionCd": "___base_plan_option_code___"': '"productPlanOptionCd": ' + '"' + topupBaseOption + '"',
                    '"sumInsured": ___member_array_si___': '"sumInsured": 450000'
                };
                this.method_content = this.method_content.toString().replaceJson(obj_replace);
            } else if (this.prepared_request['Plan_Id'] === 218) {
                var topupBaseOption = (this.lm_request['health_insurance_type'] === 'individual') ? 'IN-PLS4.5-HMB2K' : 'FL-PLS4.5-HMB2K';
                var obj_replace = {
                    '"productPlanOptionCd": "___base_plan_option_code___"': '"productPlanOptionCd": ' + '"' + topupBaseOption + '"',
                    '"sumInsured": ___member_array_si___': '"sumInsured": 450000'
                };
                this.method_content = this.method_content.toString().replaceJson(obj_replace);
            } else {
                var obj_base_plan = this.get_baseplan_optioncode(this.prepared_request['Plan_Code'], this.prepared_request['health_insurance_si']);
                this.prepared_request['base_plan_option_code'] = obj_base_plan;
                this.processed_request['___base_plan_option_code___'] = this.prepared_request['base_plan_option_code'];
            }
        } else {
            this.prepared_request['health_insurance_type_2'] = "INDIVIDUAL";
            this.processed_request['___health_insurance_type_2___'] = "INDIVIDUAL";
            var obj_base_plan = "";
            if (this.prepared_request['Plan_Id'] !== 219 && this.prepared_request['Plan_Id'] !== 218) {
                obj_base_plan = this.get_baseplan_optioncode(this.prepared_request['Plan_Code'], this.prepared_request['health_insurance_si']);
            }
            this.prepared_request['base_plan_option_code'] = obj_base_plan;
            this.processed_request['___base_plan_option_code___'] = this.prepared_request['base_plan_option_code'];
        }
        this.prepared_request['zone'] = this.insurer_master['zones']['pb_db_master'];
        this.processed_request['___zone___'] = this.prepared_request['zone'];

        var member = 1;
        for (member = 1; member <= this.lm_request['adult_count']; member++) {
            if (member === 1) {
                this.prepared_request['member_' + member + '_relation'] = "SELF";
                this.processed_request['___member_' + member + '_relation___'] = "SELF";
            } else {
                this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
                this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
            }
            if (this.lm_request.hasOwnProperty('multi_individual') && this.lm_request['multi_individual'] === "yes") {
                this.prepared_request['member_' + member + '_si'] = this.health_suminsured_selector(this.lm_request['member_' + member + '_si'] - 0, this.const_insurer_suminsured);
                var obj_base_plan = "";
                if (this.prepared_request['Plan_Id'] !== 219 && this.prepared_request['Plan_Id'] !== 218) {
                    obj_base_plan = this.get_baseplan_optioncode(this.prepared_request['Plan_Code'], this.prepared_request['member_' + member + '_si']);
                }
                this.processed_request['___member_' + member + '_si___'] = obj_base_plan === "" ? "" : this.prepared_request['member_' + member + '_si'];
                this.prepared_request['member_' + member + '_base_plan_code'] = obj_base_plan;
                this.processed_request['___member_' + member + '_base_plan_code___'] = this.prepared_request['member_' + member + '_base_plan_code'];
            } else {
                this.prepared_request['member_' + member + '_si'] = this.prepared_request['health_insurance_si'];
                this.processed_request['___member_' + member + '_si___'] = this.prepared_request['health_insurance_si'];
                var obj_base_plan = this.get_baseplan_optioncode(this.prepared_request['Plan_Code'], this.prepared_request['health_insurance_si']);
                this.prepared_request['member_' + member + '_base_plan_code'] = obj_base_plan;
                this.processed_request['___member_' + member + '_base_plan_code___'] = this.prepared_request['member_' + member + '_base_plan_code'];
            }
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            if (this.lm_request['adult_count'] === 1)
            {
                this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
                this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
            } else
            {
                this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
                this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
            }
            if (this.lm_request.hasOwnProperty('multi_individual') && this.lm_request['multi_individual'] === "yes") {
                var obj_base_plan = "";
                if (this.lm_request['member_' + member + '_si'] !== undefined) {
                    this.prepared_request['member_' + member + '_si'] = this.health_suminsured_selector(this.lm_request['member_' + member + '_si'] - 0, this.const_insurer_suminsured);
                    if (this.prepared_request['Plan_Id'] !== 219 && this.prepared_request['Plan_Id'] !== 218) {
                        obj_base_plan = this.get_baseplan_optioncode(this.prepared_request['Plan_Code'], this.prepared_request['member_' + member + '_si']);
                    }
                } else {
                    this.prepared_request['member_' + member + '_si'] = this.prepared_request['health_insurance_si'];
                    if (this.prepared_request['Plan_Id'] !== 219 && this.prepared_request['Plan_Id'] !== 218) {
                        obj_base_plan = this.get_baseplan_optioncode(this.prepared_request['Plan_Code'], this.prepared_request['health_insurance_si']);
                    }
                }

                this.processed_request['___member_' + member + '_si___'] = obj_base_plan === "" ? "" : this.prepared_request['member_' + member + '_si'];
                this.prepared_request['member_' + member + '_base_plan_code'] = obj_base_plan;
                this.processed_request['___member_' + member + '_base_plan_code___'] = this.prepared_request['member_' + member + '_base_plan_code'];
            } else {
                this.prepared_request['member_' + member + '_si'] = this.prepared_request['health_insurance_si'];
                this.processed_request['___member_' + member + '_si___'] = this.prepared_request['health_insurance_si'];
                var obj_base_plan = this.get_baseplan_optioncode(this.prepared_request['Plan_Code'], this.prepared_request['health_insurance_si']);
                this.prepared_request['member_' + member + '_base_plan_code'] = obj_base_plan;
                this.processed_request['___member_' + member + '_base_plan_code___'] = this.prepared_request['member_' + member + '_base_plan_code'];
            }
        }
    }

    if (this.lm_request['method_type'] === 'Proposal') {
        this.processed_request['___plan_id___'] = this.processed_request['___dbmaster_pb_plan_code___'].split('SB')[0];
        this.getNomineeAge();
        if (this.lm_request.hasOwnProperty('eia_number') && this.lm_request['eia_number'] !== "") {
            this.processed_request['___has_eia___'] = 'YES';
            this.processed_request['___eia_number___'] = this.lm_request['eia_number'];
        } else {
            this.processed_request['___has_eia___'] = 'NO';
            this.processed_request['___eia_number___'] = '';
        }
        let incomeRangeObj = {50001: "UPTO50K", 500001: "50K-5L", 1000001: "5-10L", 1500001: "10-15L", 2000001: "15-20L", 2000001: "15-20L", 9999999999: "ABOVE20L"};
        Object.keys(incomeRangeObj).some((range) => {
            if (range > Number(this.lm_request['annual_income'])) {
                this.prepared_request['annualGrossIncome'] = incomeRangeObj[range];
                this.processed_request['___annualGrossIncome___'] = incomeRangeObj[range];
                return true;
            }
            return false;
        });
        if (this.lm_request['topup_applied'] === true) {
            this.prepared_request['topup_received_date'] = moment().format('YYYY-MM-DD');
            this.processed_request['___topup_received_date___'] = this.prepared_request['topup_received_date'];
            this.processed_request["___si_type___"] = (this.lm_request['member_count'] === 1 ? "1" : "2");
            this.processed_request["___member_type___"] = this.get_member_type();
            this.processed_request['___proposer_dob___'] = this.prepared_request['birth_date'];
            this.processed_request["___sal___"] = (this.prepared_request["salutation"] === "MISS" ? "MS" : this.prepared_request["salutation"]);
            this.prepared_request['is_eligible'] = 'yes';
            this.prepared_request['bmi'] = 'yes';
            this.prepared_request["elite_id"] = this.insurer_master['elite']['pb_db_master'];
            this.processed_request["___elite_id___"] = this.prepared_request["elite_id"];
        } else {
            this.processed_request["___elite_id___"] = "";
        }
        if (this.lm_request['multi_individual'] !== "yes") {
            if (this.prepared_request['dbmaster_pb_plan_id'] === 219) {
                var topupBaseOption = (this.lm_request['health_insurance_type'] === 'individual') ? 'IN-PRT4.5-HMB500' : 'FL-PRT4.5-HMB500';
                var obj_replace = {
                    '"productPlanOptionCd": "___base_plan_option_code___"': '"productPlanOptionCd": ' + '"' + topupBaseOption + '"',
                    '"baseSumAssured": ___health_insurance_si___': '"baseSumAssured": 450000',
                    '"sumInsured": ___member_array_si___': '"sumInsured": 450000'
                };
                this.method_content = this.method_content.toString().replaceJson(obj_replace);
            } else if (this.prepared_request['dbmaster_pb_plan_id'] === 218) {
                var topupBaseOption = (this.lm_request['health_insurance_type'] === 'individual') ? 'IN-PLS4.5-HMB2K' : 'FL-PLS4.5-HMB2K';
                var obj_replace = {
                    '"productPlanOptionCd": "___base_plan_option_code___"': '"productPlanOptionCd": ' + '"' + topupBaseOption + '"',
                    '"baseSumAssured": ___health_insurance_si___': '"baseSumAssured": 450000',
                    '"sumInsured": ___member_array_si___': '"sumInsured": 450000'
                };
                this.method_content = this.method_content.toString().replaceJson(obj_replace);
            } else {
                var obj_base_plan = this.get_baseplan_optioncode(this.prepared_request['dbmaster_pb_plan_code'], this.prepared_request['health_insurance_si']);
                this.prepared_request['base_plan_option_code'] = obj_base_plan;
                this.processed_request['___base_plan_option_code___'] = this.prepared_request['base_plan_option_code'];
            }
        } else {
            this.prepared_request['health_insurance_type_2'] = "INDIVIDUAL";
            this.processed_request['___health_insurance_type_2___'] = "INDIVIDUAL";
            var obj_base_plan = "";
            if (this.prepared_request['dbmaster_pb_plan_id'] !== 219 && this.prepared_request['dbmaster_pb_plan_id'] !== 218) {
                obj_base_plan = this.get_baseplan_optioncode(this.prepared_request['dbmaster_pb_plan_code'], this.prepared_request['health_insurance_si']);
            }
            this.prepared_request['base_plan_option_code'] = obj_base_plan;
            this.processed_request['___base_plan_option_code___'] = this.prepared_request['base_plan_option_code'];
        }

        this.prepared_request["city"] = this.lm_request["district"];
        this.processed_request["___city___"] = this.prepared_request["city"];
        this.prepared_request["gender_2"] = this.lm_request["gender"] === "M" ? "MALE" : "FEMALE";
        this.processed_request["___gender_2___"] = this.prepared_request["gender_2"];
        this.prepared_request['zone'] = this.lm_request["zone"];
        this.processed_request['___zone___'] = this.prepared_request['zone'];
        this.processed_request['___marital_2___'] = (this.prepared_request['marital'] === "MARRIED" ? "1" : "2");
        if (this.prepared_request['dbmaster_pb_plan_id'] !== 220) {
            if (this.insurer_master['service_logs']['pb_db_master']['Insurer_Response'].hasOwnProperty('listofquotationTO')) {
                this.prepared_request['quote_id'] = this.insurer_master['service_logs']['pb_db_master']['Insurer_Response']['listofquotationTO']['0']["quoteId"];
                this.processed_request['___quote_id___'] = this.prepared_request['quote_id'];
                this.prepared_request['quote_amount'] = this.insurer_master['service_logs']['pb_db_master']['Insurer_Response']['listofquotationTO']['0']["totPremium"];
                this.processed_request['___quote_amount___'] = this.prepared_request['quote_amount'];
            }
        }

        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";
        var member = 1;
        if (this.prepared_request["relation"] === 'SELF') {
            if (this.lm_request['member_count'] === 1) {
                var insured_data = this.find_text_btw_key(this.method_content.toString(), '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
                this.method_content = this.method_content.replace(insured_data, '');
            } else {
                if (this.lm_request['adult_count'] > 1) {
                    for (member = 2; member <= this.lm_request['adult_count']; member++) {
                        txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
                        this.prepared_request['member_' + member + '_inc'] = member;
                        this.processed_request['___member_' + member + '_inc___'] = member;
                    }
                }
            }
        } else {
            for (member = 1; member <= this.lm_request['adult_count']; member++) {
                txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
                this.prepared_request['member_' + member + '_inc'] = member;
                this.processed_request['___member_' + member + '_inc___'] = member;
            }
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            if (this.lm_request['adult_count'] === 1) {
                this.prepared_request['member_' + member + '_inc'] = member - 1;
                this.processed_request['___member_' + member + '_inc___'] = member - 1;
            } else {
                this.prepared_request['member_' + member + '_inc'] = member;
                this.processed_request['___member_' + member + '_inc___'] = member;
            }
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);

        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetailGuid_Start-->', '<!--InsurersDetailGuid_End-->', true);
        var txt_replace_with = "";
        var member = 1;
        for (member = 1; member <= this.lm_request['adult_count']; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.prepared_request['member_' + member + '_inc'] = member;
            this.processed_request['___member_' + member + '_inc___'] = member;
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            if (this.lm_request['adult_count'] === 1) {
                this.prepared_request['member_' + member + '_inc'] = member - 1;
                this.processed_request['___member_' + member + '_inc___'] = member - 1;
            } else {
                this.prepared_request['member_' + member + '_inc'] = member;
                this.processed_request['___member_' + member + '_inc___'] = member;
            }
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);

        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersQues_Start-->', '<!--InsurersQues_End-->', true);
        var txt_replace_with = "";
        var member = 1;
        for (member = 1; member <= this.lm_request['adult_count']; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            this.prepared_request['member_' + member + '_inc'] = member;
            this.processed_request['___member_' + member + '_inc___'] = member;
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
            if (this.lm_request['adult_count'] === 1) {
                this.prepared_request['member_' + member + '_inc'] = member - 1;
                this.processed_request['___member_' + member + '_inc___'] = member - 1;
            } else {
                this.prepared_request['member_' + member + '_inc'] = member;
                this.processed_request['___member_' + member + '_inc___'] = member;
            }
        }

        if (this.method_content[0] !== '<') {// for json
            txt_replace_with = txt_replace_with.replaceAll('<!--InsurersQues_Start-->', "");
            var Total_Count = this.lm_request['member_count'];
            for (var x = 1; x <= Total_Count - 1; x++) {
                txt_replace_with = txt_replace_with.replace('<!--InsurersQues_End-->', ",");
            }
            txt_replace_with = txt_replace_with.replace('<!--InsurersQues_End-->', "");
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);

        var txt_replace = this.find_text_btw_key(this.method_content, '<!--Additnl_Med_Start-->', '<!--Additnl_Med_End-->', true);
        var txt_replace_with = "";
        for (member = 1; member <= this.lm_request['adult_count']; member++) {
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_qualification___'] = this.lm_request['member_' + member + '_qualification'];
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
            this.prepared_request['member_' + member + '_dob'] = this.prepared_request['member_' + member + '_birth_date'];
            this.processed_request['___member_' + member + '_dob___'] = this.prepared_request['member_' + member + '_dob'];
            this.processed_request['___member_' + member + '_sal___'] = (this.prepared_request['member_' + member + '_salutation'] === "MISS" ? "MS" : this.prepared_request['member_' + member + '_salutation']);
            this.processed_request['___member_' + member + '_marital___'] = (this.prepared_request['member_' + member + '_marital_status'] === "MARRIED" ? "1" : "2");
            if (this.prepared_request["bmi"] === 'yes') {
                this.prepared_request["bmi"] = this.check_bmi(this.prepared_request['member_' + member + '_height'], this.prepared_request['member_' + member + '_weight']);
            }
            if (this.lm_request.hasOwnProperty('multi_individual') && this.lm_request['multi_individual'] === "yes") {
                this.prepared_request['member_' + member + '_si'] = this.health_suminsured_selector(this.lm_request['member_' + member + '_si'] - 0, this.const_insurer_suminsured);
                this.processed_request['___member_' + member + '_si___'] = this.prepared_request['member_' + member + '_si'];
                var obj_base_plan = "";
                if (this.prepared_request['dbmaster_pb_plan_id'] !== 219 && this.prepared_request['dbmaster_pb_plan_id'] !== 218) {
                    obj_base_plan = this.get_baseplan_optioncode(this.prepared_request['dbmaster_pb_plan_code'], this.prepared_request['member_' + member + '_si']);
                }
                this.prepared_request['member_' + member + '_base_plan_code'] = obj_base_plan;
                this.processed_request['___member_' + member + '_base_plan_code___'] = obj_base_plan;
            } else {
                this.prepared_request['member_' + member + '_si'] = this.prepared_request['health_insurance_si'];
                this.processed_request['___member_' + member + '_si___'] = this.prepared_request['health_insurance_si'];
                var obj_base_plan = this.get_baseplan_optioncode(this.prepared_request['dbmaster_pb_plan_code'], this.prepared_request['health_insurance_si']);
                this.prepared_request['member_' + member + '_base_plan_code'] = obj_base_plan;
                this.processed_request['___member_' + member + '_base_plan_code___'] = this.prepared_request['member_' + member + '_base_plan_code'];
            }

            for (var key in this.lm_request) {
                if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1) {
                    var ques_detail = key.replace('_type', '_details');
                    if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                        if (this.lm_request[ques_detail] === false) {
                            this.prepared_request[ques_detail] = "NO";
                            this.processed_request['___' + ques_detail + '___'] = "NO";
                            this.processed_request['___' + ques_detail + '_topup___'] = "0";
                            if (ques_detail.includes('19')) {
                                this.processed_request['___' + ques_detail + '_smoke___'] = "NO";
                            } else if (ques_detail.includes('20')) {
                                this.processed_request['___' + ques_detail + '_tobacco___'] = "NO";
                            } else if (ques_detail.includes('21')) {
                                this.processed_request['___' + ques_detail + '_alcohol___'] = "NO";
                            }
                        } else {
                            this.prepared_request[ques_detail] = "YES";
                            this.processed_request['___' + ques_detail + '___'] = "YES";
                            this.processed_request['___' + ques_detail + '_topup___'] = "1";
                            this.prepared_request['is_eligible'] = 'no';
                        }
                    } else if (this.lm_request[key].toString().toLowerCase() === 'since') {
                        this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                        //this.processed_request['___' + ques_detail + '___'] = this.lm_request[ques_detail];
                        this.processed_request['___' + ques_detail + '___'] = "YES";
                        if (ques_detail.includes('19')) {
                            var smoke_cd = {"A": "LESSTHAN20", "B": "MORETHAN20"};
                            if (["A", "B"].includes(this.lm_request[ques_detail].toUpperCase())) {
                                this.processed_request['___' + ques_detail + '_smoke___'] = smoke_cd[this.lm_request[ques_detail].toUpperCase()];
                            } else {
                                this.processed_request['___' + ques_detail + '_smoke___'] = this.lm_request[ques_detail];
                            }
                        } else if (ques_detail.includes('20')) {
                            var tobacco_cd = {"A": "FOURTOSIX", "B": "MORETHAN6", "C": "ONETOTHREE"};
                            if (["A", "B", "C"].includes(this.lm_request[ques_detail].toUpperCase())) {
                                this.processed_request['___' + ques_detail + '_tobacco___'] = tobacco_cd[this.lm_request[ques_detail].toUpperCase()];
                            } else {
                                this.processed_request['___' + ques_detail + '_tobacco___'] = this.lm_request[ques_detail];
                            }
                        } else if (ques_detail.includes('21')) {
                            var alcohol_cd = {"A": "DAILY", "B": "ONETOTHREE", "C": "THREETOSIX"};
                            if (["A", "B", "C"].includes(this.lm_request[ques_detail].toUpperCase())) {
                                this.processed_request['___' + ques_detail + '_alcohol___'] = alcohol_cd[this.lm_request[ques_detail].toUpperCase()];
                            } else {
                                this.processed_request['___' + ques_detail + '_alcohol___'] = this.lm_request[ques_detail];
                            }
                        }
                    }
                }
            }
            txt_replace_with += txt_replace_with === "" ? txt_replace.replaceAll('___member_array', '___member_' + member) : "," + txt_replace.replaceAll('___member_array', '___member_' + member);
            //adult addtional med questions
            if (this.lm_request['member_' + member + '_additionalQue_1'] === "yes") {
                for (var i = 1; i < 10; i++) {
                    if (i === 2) {
                        this.prepared_request['member_' + member + '_additnl_Med_Questn_' + i] = this.lm_request['member_' + member + '_additionalQue_1_subQue_' + i + '_year_text'];
                    } else if (i === 6) {
                        let consultDate = moment(this.lm_request['member_' + member + '_additionalQue_1_subQue_' + i]).format('DD-MMM-YYYY');
                        consultDate = moment(consultDate).format('DD/MM/YYYY');
                        this.prepared_request['member_' + member + '_additnl_Med_Questn_' + i] = consultDate;
                    } else {
                        this.prepared_request['member_' + member + '_additnl_Med_Questn_' + i] = this.lm_request['member_' + member + '_additionalQue_1_subQue_' + i];
                    }
                    this.processed_request['___member_' + member + '_additnl_Med_Questn_' + i + '___'] = this.prepared_request['member_' + member + '_additnl_Med_Questn_' + i];
                }
            } else {
                for (var i = 10; i--; ) {
                    this.prepared_request['member_' + member + '_additnl_Med_Questn_' + i] = (i === 2 ? null : '');
                    this.processed_request['___member_' + member + '_additnl_Med_Questn_' + i + '___'] = this.prepared_request['member_' + member + '_additnl_Med_Questn_' + i];
                }
                var obj_replace = {};
                obj_replace['___crn_______member_' + member + '_inc___'] = '';
                txt_replace_with = txt_replace_with.toString().replaceJson(obj_replace);
            }
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            this.prepared_request['member_' + member + '_occupation'] = "99";
            this.processed_request['___member_' + member + '_occupation___'] = "99";
            this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
            this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
            this.prepared_request['member_' + member + '_dob'] = this.prepared_request['member_' + member + '_birth_date'];
            this.processed_request['___member_' + member + '_dob___'] = this.prepared_request['member_' + member + '_dob'];
            this.processed_request['___member_' + member + '_sal___'] = (this.prepared_request['member_' + member + '_salutation'] === "MISS" ? "MS" : this.prepared_request['member_' + member + '_salutation']);
            this.processed_request['___member_' + member + '_marital___'] = (this.prepared_request['member_' + member + '_marital_status'] === "MARRIED" ? "1" : "2");
            if (this.lm_request.hasOwnProperty('multi_individual') && this.lm_request['multi_individual'] === "yes") {
                this.prepared_request['member_' + member + '_si'] = this.health_suminsured_selector(this.lm_request['member_' + member + '_si'] - 0, this.const_insurer_suminsured);
                this.processed_request['___member_' + member + '_si___'] = this.prepared_request['member_' + member + '_si'];
                var obj_base_plan = "";
                if (this.prepared_request['dbmaster_pb_plan_id'] !== 219 && this.prepared_request['dbmaster_pb_plan_id'] !== 218) {
                    obj_base_plan = this.get_baseplan_optioncode(this.prepared_request['dbmaster_pb_plan_code'], this.prepared_request['member_' + member + '_si']);
                }
                this.prepared_request['member_' + member + '_base_plan_code'] = obj_base_plan;
                this.processed_request['___member_' + member + '_base_plan_code___'] = obj_base_plan;
            } else {
                this.prepared_request['member_' + member + '_si'] = this.prepared_request['health_insurance_si'];
                this.processed_request['___member_' + member + '_si___'] = this.prepared_request['health_insurance_si'];
                var obj_base_plan = this.get_baseplan_optioncode(this.prepared_request['dbmaster_pb_plan_code'], this.prepared_request['health_insurance_si']);
                this.prepared_request['member_' + member + '_base_plan_code'] = obj_base_plan;
                this.processed_request['___member_' + member + '_base_plan_code___'] = this.prepared_request['member_' + member + '_base_plan_code'];
            }

            for (var key in this.lm_request) {
                if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1) {
                    var ques_detail = key.replace('_type', '_details');
                    if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                        if (this.lm_request[ques_detail] === false) {
                            this.prepared_request[ques_detail] = "NO";
                            this.processed_request['___' + ques_detail + '___'] = "NO";
                            this.processed_request['___' + ques_detail + '_topup___'] = "0";
                            if (ques_detail.includes('19')) {
                                this.processed_request['___' + ques_detail + '_smoke___'] = "NO";
                            } else if (ques_detail.includes('20')) {
                                this.processed_request['___' + ques_detail + '_tobacco___'] = "NO";
                            } else if (ques_detail.includes('21')) {
                                this.processed_request['___' + ques_detail + '_alcohol___'] = "NO";
                            }
                        } else {
                            this.prepared_request[ques_detail] = "YES";
                            this.processed_request['___' + ques_detail + '___'] = "YES";
                            this.processed_request['___' + ques_detail + '_topup___'] = "1";
                            this.prepared_request['is_eligible'] = 'no';
                        }
                    } else if (this.lm_request[key].toString().toLowerCase() === 'since') {
                        this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                        this.processed_request['___' + ques_detail + '___'] = "YES";
                        if (ques_detail.includes('19')) {
                            var smoke_cd = {"A": "LESSTHAN20", "B": "MORETHAN20"};
                            if (["A", "B"].includes(this.lm_request[ques_detail].toUpperCase())) {
                                this.processed_request['___' + ques_detail + '_smoke___'] = smoke_cd[this.lm_request[ques_detail].toUpperCase()];
                            } else {
                                this.processed_request['___' + ques_detail + '_smoke___'] = this.lm_request[ques_detail];
                            }
                        } else if (ques_detail.includes('20')) {
                            var tobacco_cd = {"A": "FOURTOSIX", "B": "MORETHAN6", "C": "ONETOTHREE"};
                            if (["A", "B", "C"].includes(this.lm_request[ques_detail].toUpperCase())) {
                                this.processed_request['___' + ques_detail + '_tobacco___'] = tobacco_cd[this.lm_request[ques_detail].toUpperCase()];
                            } else {
                                this.processed_request['___' + ques_detail + '_tobacco___'] = this.lm_request[ques_detail];
                            }
                        } else if (ques_detail.includes('21')) {
                            var alcohol_cd = {"A": "DAILY", "B": "ONETOTHREE", "C": "THREETOSIX"};
                            if (["A", "B", "C"].includes(this.lm_request[ques_detail].toUpperCase())) {
                                this.processed_request['___' + ques_detail + '_alcohol___'] = alcohol_cd[this.lm_request[ques_detail].toUpperCase()];
                            } else {
                                this.processed_request['___' + ques_detail + '_alcohol___'] = this.lm_request[ques_detail];
                            }
                        }
                    }
                }
            }

//child addtional med questions
            txt_replace_with += "," + txt_replace.replaceAll('___member_array', '___member_' + member);
            if (this.lm_request['member_' + member + '_additionalQue_1'] === "yes") {
                for (var i = 1; i < 10; i++) {
                    if (i === 2) {
                        this.prepared_request['member_' + member + '_additnl_Med_Questn_' + i] = this.lm_request['member_' + member + '_additionalQue_1_subQue_' + i + '_year_text'];
                    } else if (i === 6) {
                        let consultDate = moment(this.lm_request['member_' + member + '_additionalQue_1_subQue_' + i]).format('DD-MMM-YYYY');
                        consultDate = moment(consultDate).format('DD/MM/YYYY');
                        this.prepared_request['member_' + member + '_additnl_Med_Questn_' + i] = consultDate;
                    } else {
                        this.prepared_request['member_' + member + '_additnl_Med_Questn_' + i] = this.lm_request['member_' + member + '_additionalQue_1_subQue_' + i];
                    }
                    this.processed_request['___member_' + member + '_additnl_Med_Questn_' + i + '___'] = this.prepared_request['member_' + member + '_additnl_Med_Questn_' + i];
                }
            } else {
                for (var i = 10; i--; ) {
                    this.prepared_request['member_' + member + '_additnl_Med_Questn_' + i] = (i === 2 ? null : '');
                    this.processed_request['___member_' + member + '_additnl_Med_Questn_' + i + '___'] = this.prepared_request['member_' + member + '_additnl_Med_Questn_' + i];
                    var obj_replace = {};
                    obj_replace['___crn_______member_' + member + '_inc___'] = '';
                    txt_replace_with = txt_replace_with.toString().replaceJson(obj_replace);
                }
            }
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);

        this.prepared_request["crn"] = this.lm_request["crn"];
        this.processed_request["___crn___"] = this.prepared_request["crn"];
        this.prepared_request['nominee_rel'] = this.get_nominee_relation(this.prepared_request["nominee_relation"]);
        this.processed_request['___nominee_rel___'] = this.prepared_request['nominee_rel'];
        if (this.processed_request['___relation___'] === 'SELF') {
            this.method_content = this.method_content.replaceAll('___crn____0', '___crn____1');
        }
    }
    if (this.lm_request['method_type'] === 'Verification') {
        if (!this.lm_request.hasOwnProperty('topup_verify')) {
            if (this.lm_request['topup_applied'] !== "only") {
                baseVerifyReq = this.insurer_master['service_logs']['pb_db_master']['Insurer_Request'];
                var payMethod = "";
                var paymentMode = this.lm_request['pg_post']['mode'];
                if (paymentMode === 'CC' || paymentMode === 'EMI') {
                    payMethod = 'CREDITCARD';
                } else if (paymentMode === 'DC' || paymentMode === 'NB') {
                    payMethod = 'DEBITCARD';
                } else {
                    payMethod = 'DIRECTDEBIT';
                }
                console.log(baseVerifyReq);

                var inward_data = {"inwardDOList": [{
                            "payerTypeCd": "CLIENT",
                            "inwardDt": this.prepared_request["policy_received_date"],
                            "insurerBankCd": "DAUTSCHEBANK",
                            "agentId": "1600099-01",
                            "payerPartyId": this.prepared_request['dbmaster_pb_crn'] + '_1',
                            "depositDt": this.prepared_request["policy_received_date"],
                            "inwardTypeCd": "NEWBUSINESS",
                            "inwardSubTypeCd": "PROPOSALDOCUMENT",
                            "inwardDetailsDOList": [
                                {
                                    "paymentMethodCd": payMethod,
                                    "inwardNum": this.lm_request['pg_post']['mihpayid'],
                                    "instrumentDt": this.prepared_request["policy_received_date"],
                                    "inwardAmount": this.prepared_request["transaction_amount"],
                                    "bankCd": this.lm_request['pg_post']['bankcode'],
                                    "paymentFrequencyCd": "SINGLE",
                                    "inwardDenoDOList": []
                                }
                            ],
                            "inwardPolicyDOList": [
                                {
                                    "policyNum": this.prepared_request["dbmaster_pb_insurer_transaction_identifier"],
                                    "acctTypeCd": "PROPOSAL",
                                    "appAmount": this.prepared_request["transaction_amount"],
                                    "productFamilyCd": "HEALTHREVISED",
                                    "acctSubTypeCd": "NA"
                                }
                            ],
                            "partyDOList": []
                        }]};
                if (this.lm_request['topup_applied'] === "none") {
                    inward_data = JSON.stringify(inward_data, null, 3);
                    inward_data = inward_data.substring(1, inward_data.length - 1);
                    baseVerifyReq = baseVerifyReq.replace(`"inwardDOList": []`, inward_data);
                    this.method_content = baseVerifyReq;
                }
            }
            if (this.lm_request['topup_applied'] !== "none") {
                var processedRequest = JSON.stringify(this.processed_request) + JSON.stringify(this.proposal_processed_request);
                var final_processed_request = JSON.parse(processedRequest.replaceAll('}{', ','));
                var obj_replace = {
                    '"Instrument_Number":""': '"Instrument_Number":' + '"' + this.lm_request['pg_post']['mihpayid'] + '"'
                };
                this.method_content = this.method_content.toString().replaceJson(obj_replace);
                this.processed_request = final_processed_request;

                var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
                var txt_replace_with = "";
                var member = 1;
                for (member = 1; member <= this.lm_request['adult_count']; member++) {
                    txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
                    this.prepared_request['member_' + member + '_inc'] = member;
                    this.processed_request['___member_' + member + '_inc___'] = member;
                }
                for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
                    txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
                    if (this.lm_request['adult_count'] === 1) {
                        this.prepared_request['member_' + member + '_inc'] = member - 1;
                        this.processed_request['___member_' + member + '_inc___'] = member - 1;
                    } else {
                        this.prepared_request['member_' + member + '_inc'] = member;
                        this.processed_request['___member_' + member + '_inc___'] = member;
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

                var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersQues_Start-->', '<!--InsurersQues_End-->', true);
                var txt_replace_with = "";
                var member = 1;
                for (member = 1; member <= this.lm_request['adult_count']; member++) {
                    txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
                    this.prepared_request['member_' + member + '_inc'] = member;
                    this.processed_request['___member_' + member + '_inc___'] = member;
                }
                for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
                    txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
                    if (this.lm_request['adult_count'] === 1) {
                        this.prepared_request['member_' + member + '_inc'] = member - 1;
                        this.processed_request['___member_' + member + '_inc___'] = member - 1;
                    } else {
                        this.prepared_request['member_' + member + '_inc'] = member;
                        this.processed_request['___member_' + member + '_inc___'] = member;
                    }
                }

                if (this.method_content[0] !== '<') {// for json
                    txt_replace_with = txt_replace_with.replaceAll('<!--InsurersQues_Start-->', "");
                    var Total_Count = this.lm_request['member_count'];
                    for (var x = 1; x <= Total_Count - 1; x++) {
                        txt_replace_with = txt_replace_with.replace('<!--InsurersQues_End-->', ",");
                    }
                    txt_replace_with = txt_replace_with.replace('<!--InsurersQues_End-->', "");
                }
                this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
            }
            console.log(this.method_content);
        }
    }
    if (this.lm_request['method_type'] === 'Pdf') {
        this.prepared_request['topup_policy_number'] = this.lm_request.policy_number;
        this.processed_request['___topup_policy_number___'] = this.prepared_request['topup_policy_number'];
    }
    console.log('insurer_product_field_process_pre');
    this.method_content = this.method_content.replaceAll(/<!--(.*?)-->/g, "");
    console.log(this.method_content);
};
ManipalCigna.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {
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
ManipalCigna.prototype.insurer_product_field_process_post = function () {

};
ManipalCigna.prototype.insurer_product_api_post = function () {

};
ManipalCigna.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    console.log('service_call');
    console.log(this.method_content);
    try {
        var objInsurerProduct = this;
        var body = docLog.Insurer_Request;

        if (docLog['Plan_Id'] === 220 || docLog['LM_Custom_Request']['dbmaster_pb_plan_id'] === 220 ||
                (objInsurerProduct.const_payment_response['pg_post'] !== null && objInsurerProduct.const_payment_response['pg_post']['udf4'] === "220")) {
            if (this.lm_request['method_type'] === 'Pdf') {
                var Client = require('node-rest-client').Client;
                var client = new Client();

                var args = {
                    data: body,
                    headers: {
                        "Content-Type": "application/json"
                    }
                };
                client.post(specific_insurer_object.method.Service_URL, args, function (data, response) {
                    console.log('topup pdf', JSON.stringify(data));
                    var objResponseFull = {
                        'err': null,
                        'result': JSON.stringify(data),
                        'raw': JSON.stringify(data),
                        'soapHeader': null,
                        'objResponseJson': data
                    };
                    objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                });
            } else if (this.lm_request['method_type'] === 'Verification') {

                var Client = require('node-rest-client').Client;
                var client = new Client();
                var url = ((config.environment.name === 'Production') ? 'https://group.manipalcigna.com/HealthBuzzApi/api/Policy/Proposal' : 'https://inuatams.cignattkinsurance.in/api/Policy/Proposal');

                var postRequest = {
                    data: JSON.stringify(JSON.parse(body)),
                    headers: {
                        'Content-Type': 'application/json',
                        'User_Nm': objInsurerProduct.processed_request["___insurer_integration_service_user___"],
                        'Password': objInsurerProduct.processed_request["___insurer_integration_service_password___"]
                    }
                };
                client.post(url, postRequest, function (data, response) {
                    // parsed response body as js object 
                    console.log('Topup Response', JSON.stringify(data));

                    var objResponseFull = {
                        'err': null,
                        'result': null,
                        'raw': JSON.stringify(data),
                        'soapHeader': null,
                        'objResponseJson': data
                    };
                    objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                });
            } else {
                if (this.lm_request['multi_individual'] !== 'yes') {
                    this.prepared_request['only_topup'] = 'yes';
                    var topup_data = this.get_topup();
                    var objResponseFull = {
                        'err': null,
                        'result': null,
                        'raw': JSON.stringify(topup_data),
                        'soapHeader': null,
                        'objResponseJson': topup_data
                    };
                    if (objInsurerProduct.lm_request['method_type'] === 'Premium') {
                        objResponseFull['objResponseJson']['actualPlanId'] = docLog['Plan_Id'];
                    }
                    sleep(5000);
                    objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                }
            }
        } else {
            if (this.lm_request['method_type'] === 'Verification' && this.lm_request['topup_verify'] === 'yes') {
                docLog.Insurer_Request = JSON.stringify(JSON.parse(this.lm_request['request']));
                this.const_policy = JSON.parse(this.lm_request['base_policy']);

                var Client = require('node-rest-client').Client;
                var client = new Client();
                var url = ((config.environment.name === 'Production') ? 'https://group.manipalcigna.com/HealthBuzzApi/api/Policy/Proposal' : 'https://inuatams.cignattkinsurance.in/api/Policy/Proposal');

                var postRequest = {
                    data: JSON.stringify(JSON.parse(this.lm_request['request'])),
                    headers: {
                        'Content-Type': 'application/json',
                        'User_Nm': objInsurerProduct.processed_request["___insurer_integration_service_user___"],
                        'Password': objInsurerProduct.processed_request["___insurer_integration_service_password___"]
                    }
                };
                client.post(url, postRequest, function (data, response) {
                    // parsed response body as js object 
                    console.error('Topup Response', JSON.stringify(data));

                    var objResponseFull = {
                        'err': null,
                        'result': null,
                        'raw': JSON.stringify(data),
                        'soapHeader': null,
                        'objResponseJson': JSON.parse(JSON.stringify(data))
                    };
                    var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                });
            } else if (this.lm_request['method_type'] === 'Pdf' && this.lm_request['topup_verify'] === 'yes') {
                var Client = require('node-rest-client').Client;
                var client = new Client();
                var args = {
                    data: body,
                    headers: {
                        "Content-Type": "application/json"
                    }
                };
                client.post(specific_insurer_object.method.Service_URL, args, function (data, response) {
                    console.log('topup pdf', JSON.stringify(data));
                    var objResponseFull = {
                        'err': null,
                        'result': JSON.stringify(data),
                        'raw': JSON.stringify(data),
                        'soapHeader': null,
                        'objResponseJson': data
                    };
                    var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                });
            } else {
                let body = docLog.Insurer_Request;
                let Client = require('node-rest-client').Client;
                let client = new Client();
                if (this.lm_request['method_type'] === 'Verification') {
                    if (this.lm_request['topup_applied'] === "base") {
                        this.lm_request['topup_json'] = JSON.stringify(JSON.parse(docLog.Insurer_Request));
                        body = baseVerifyReq;
                        docLog.Insurer_Request = body;
                    }
                }

                if (this.lm_request['method_type'] === 'Customer') {
                    var args = {
                        headers: {
                            "app_key": objInsurerProduct['method']['Service_User'],
                            "app_id": objInsurerProduct['method']['Service_Password']
                        }};
                    console.log(specific_insurer_object.method_file_url);
                    client.get(specific_insurer_object.method_file_url, args, function (data, response) {
                        console.log(response.statusCode);
                        let objData = JSON.stringify(data);
                        let objResponseFull = {
                            'err': null,
                            'result': objData,
                            'raw': objData,
                            'soapHeader': null,
                            'objResponseJson': data
                        };
                        objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                    });
                } else {
                    var args = {
                        data: body,
                        headers: {
                            "app_key": objInsurerProduct['method']['Service_User'],
                            "app_id": objInsurerProduct['method']['Service_Password'],
                            "Content-Type": "application/json",
                            "Accept": "*/*"
                        }
                    };
                    if (this.lm_request['method_type'] === 'Proposal') {
                        args['headers']['Action-Type'] = "VALIDATE";
                    }
                    client.post(specific_insurer_object.method_file_url, args, function (data, response) {
                        console.log(response.statusCode);
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
                }
            }
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};

ManipalCigna.prototype.premium_response_handler = function (objResponseJson) {
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
        var objPremiumService = '';
        if (objResponseJson.hasOwnProperty('listofquotationTO')) {
            if (objResponseJson['errorList'] === null) {
                objPremiumService = objResponseJson['listofquotationTO']['0'];
            } else {
                Error_Msg = '';
                objResponseJson['errorList'].map((obj) => {
                    Error_Msg += '\u2726 ' + obj.errDescription + ". ";
                });
            }
        } else if (objResponseJson.hasOwnProperty('with_gst')) {
            objPremiumService = objResponseJson;
        } else {
            Error_Msg = 'LM_MSG:PREMIUM_MAIN_NODE_MISSING';
        }

        if (Error_Msg === 'NO_ERR') {
            var premium_breakup = this.get_const_premium_breakup();
            if (objResponseJson['actualPlanId'] === 218 || objResponseJson['actualPlanId'] === 219) {
                premium_breakup['topup'] = Math.round(Number(objPremiumService['totPremium']['0']) + this.prepared_request['topup']);
                premium_breakup['final_premium'] = Math.round(objPremiumService['totPremium']['0']);
                premium_breakup['service_tax'] = (objPremiumService['quotationChargeDOList']['0'].hasOwnProperty('chargeAmount') ? objPremiumService['quotationChargeDOList']['0']['chargeAmount'] : '0');
                premium_breakup['tax']['CGST'] = premium_breakup['service_tax'] / 2;
                premium_breakup['tax']['SGST'] = premium_breakup['service_tax'] / 2;
                premium_breakup['net_premium'] = premium_breakup['final_premium'] - premium_breakup['service_tax'];
                premium_breakup['base_premium'] = objPremiumService['quotationProductDOList']['0']['basePremium']['0'];
            } else if (objResponseJson['actualPlanId'] === 220) {
                premium_breakup['topup'] = objPremiumService['with_gst'];
                premium_breakup['final_premium'] = Number(objPremiumService['with_gst']);
                premium_breakup['service_tax'] = objPremiumService['with_gst'] - objPremiumService['amount'];
                premium_breakup['tax']['CGST'] = premium_breakup['service_tax'] / 2;
                premium_breakup['tax']['SGST'] = premium_breakup['service_tax'] / 2;
                premium_breakup['net_premium'] = objPremiumService['amount'];
                premium_breakup['base_premium'] = objPremiumService['amount'];
            } else {
                premium_breakup['final_premium'] = Math.round(objPremiumService['totPremium']);
                premium_breakup['service_tax'] = (objPremiumService['quotationChargeDOList']['0'].hasOwnProperty('chargeAmount') ? objPremiumService['quotationChargeDOList']['0']['chargeAmount'] : '0');
                premium_breakup['tax']['CGST'] = premium_breakup['service_tax'] / 2;
                premium_breakup['tax']['SGST'] = premium_breakup['service_tax'] / 2;
                premium_breakup['net_premium'] = premium_breakup['final_premium'] - premium_breakup['service_tax'];
                premium_breakup['base_premium'] = objPremiumService['quotationProductDOList']['0']['basePremium'];
            }

            //addons
//            if (objPremiumService['quotationProductDOList']['0'].hasOwnProperty('quotationProductAddOnDOList')) {
//                for (var keyCover in this.premium_breakup_schema['addon']) {
//                    var Cigna_Addon = objPremiumService['quotationProductDOList']['0']['quotationProductAddOnDOList'];
//                    for (var i = 0; Cigna_Addon.length > i; i++) {
//                        var key = this.premium_breakup_schema['addon'][keyCover];
//                        var product_Code = objPremiumService['quotationProductDOList']['0']['quotationProductAddOnDOList'][i]['productId']['0'];
//                        if (product_Code === key) {
//                            premium_breakup['addon'][keyCover] = parseInt(objPremiumService['quotationProductDOList']['0']['quotationProductAddOnDOList'][i]['basePremium']['0']);
//                        }
//                    }
//                }
//            }
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
ManipalCigna.prototype.customer_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'customer_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Customer': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson.hasOwnProperty('applicationNumber') || objResponseJson.hasOwnProperty('with_gst')) {

        } else {
            Error_Msg = 'LM_MSG:CUSTOMER_MAIN_NODE_MISSING';
        }
        if (Error_Msg === 'NO_ERR') {
            var Customer = {};
            Customer['insurer_customer_identifier'] = objResponseJson.hasOwnProperty('with_gst') ? 220 : objResponseJson['applicationNumber'];
            objServiceHandler.Customer = Customer;
            objServiceHandler.Insurer_Transaction_Identifier = '';
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
ManipalCigna.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        var firstname = this.lm_request['first_name'];
        var lastname = this.lm_request['last_name'];
        var mobile = this.lm_request['mobile'];
        var email = this.lm_request['email'];
        var txnid = this.prepared_request['crn'];
        var udf3 = this.prepared_request['insurer_integration_agent_code'];
        var udf4 = this.prepared_request['insurer_customer_identifier'];
        var return_url = this.const_payment.pg_ack_url;

        if (objResponseJson.hasOwnProperty('html'))
        {
            Error_Msg = objResponseJson['html']['head']['0']['title']['0'];
        }

        if (objResponseJson.hasOwnProperty('listofPolicyTO') && objResponseJson['listofPolicyTO'] !== null) {
            if (objResponseJson['errorList'] === null) {
                Error_Msg = 'NO_ERR';
            } else {
                Error_Msg = '';
                objResponseJson['errorList'].map((obj) => {
                    if (obj.errDescription.includes('Lvl03_Q805_01_01')) {
                        Error_Msg += '\u2726 Please enter valid option[A/B] for Smoking. ';
                    } else if (obj.errDescription.includes('Lvl03_Q805_02_01')) {
                        Error_Msg += '\u2726 Please enter valid option[A/B/C] for Tobabacco intake. ';
                    } else if (obj.errDescription.includes('Lvl03_Q805_02_03')) {
                        Error_Msg += '\u2726 Please enter valid option[A/B/C] for Alcohol consumption. ';
                    }
                    Error_Msg += '\u2726 ' + obj.errDescription + ". ";
                });
            }
        } else if (objResponseJson.hasOwnProperty('with_gst')) {
        } else {
            Error_Msg = 'LM_MSG:PROPOSAL_MAIN_NODE_MISSING';
        }
        if (this.lm_request['topup_applied'] !== true) {
            if (Error_Msg === 'NO_ERR') {
                var key = ((config.environment.name === 'Production') ? 'o7LxX9fJ' : 'BC50nb');
                var SALT = ((config.environment.name === 'Production') ? 'c6ob2Q7Wb4' : 'Bwxo1cPe');
                var amount = Number(objResponseJson['listofPolicyTO']['0']['quoteAmount']);
                var merchant_id = ((config.environment.name === 'Production') ? '6741794' : '4825050');
                var productinfo = {paymentParts: [{name: 'splitId1', merchantId: merchant_id, value: amount, commission: 0, description: 'splitId1 summary'}]};

                var pg_data = {
                    'firstname': firstname,
                    'lastname': lastname,
                    'surl': return_url,
                    'phone': mobile,
                    'email': email,
                    'curl': return_url,
                    'furl': return_url,
                    'key': key,
                    'txnid': txnid,
                    'productinfo': JSON.stringify(productinfo),
                    'amount': amount,
                    'udf1': "",
                    'udf2': "",
                    'udf3': udf3,
                    'udf4': udf4,
                    'udf5': merchant_id,
                    'service_provider': "payu_paisa"
                };
                var hash_data = {// sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT);
                    'key': key, 'txnid': txnid, 'amount': amount, 'productinfo': JSON.stringify(productinfo), 'firstname': firstname, 'email': email,
                    'udf1': '', 'udf2': '', 'ud3': udf3, 'ud4': udf4, 'ud5': merchant_id, 'str1': '', 'str2': '', 'str3': '', 'str4': '', 'str5': '', 'SALT': SALT
                };
                function jsonToQueryString(json) {
                    return Object.keys(json).map(function (key) {
                        return json[key];
                    }).join('|');
                }
                var checksummsg = jsonToQueryString(hash_data);
                console.log("checksum ", checksummsg);
                var checksumvalue = this.convert_to_sha512(checksummsg);
                pg_data['hash'] = checksumvalue.toLowerCase();
            }
        } else {
            Error_Msg = this.prepared_request['is_eligible'] === 'no' ? "Insured member(s) are not eligible" : Error_Msg;
            Error_Msg = (Error_Msg === 'NO_ERR' && this.prepared_request["bmi"] === 'no') ? "BMI range not met" : Error_Msg;

            if (this.lm_request['topup_type'] === 'base') {
                if (Error_Msg === 'NO_ERR') {
                    var key = ((config.environment.name === 'Production') ? 'o7LxX9fJ' : 'BC50nb');
                    var SALT = ((config.environment.name === 'Production') ? 'c6ob2Q7Wb4' : 'Bwxo1cPe');
                    var split1_mid = ((config.environment.name === 'Production') ? '6741794' : '4825050');
                    var split2_mid = ((config.environment.name === 'Production') ? '6742182' : '4825051');
                    var org_premium = Number(objResponseJson['listofPolicyTO']['0']['quoteAmount']);
                    var amount = org_premium + this.prepared_request['topup'];
                    var productinfo = {paymentParts: [{name: 'splitId1', merchantId: split1_mid, value: org_premium, commission: 0, description: 'splitId1 summary'}, {name: 'splitId2', merchantId: split2_mid, value: this.prepared_request['topup'], commission: 0, description: 'splitId2 summary'}]};

                    var pg_data = {
                        'firstname': firstname,
                        'lastname': lastname,
                        'surl': return_url,
                        'phone': mobile,
                        'email': email,
                        'curl': return_url,
                        'furl': return_url,
                        'key': key,
                        'txnid': txnid,
                        'productinfo': JSON.stringify(productinfo),
                        'amount': amount,
                        'udf1': "",
                        'udf2': "",
                        'udf3': udf3,
                        'udf4': udf4,
                        'udf5': merchant_id,
                        'service_provider': "payu_paisa"
                    };
                    var hash_data = {// sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT);
                        'key': key, 'txnid': txnid, 'amount': amount, 'productinfo': JSON.stringify(productinfo), 'firstname': firstname, 'email': email,
                        'udf1': '', 'udf2': '', 'ud3': udf3, 'ud4': udf4, 'ud5': merchant_id, 'str1': '', 'str2': '', 'str3': '', 'str4': '', 'str5': '', 'SALT': SALT
                    };
                    function jsonToQueryString(json) {
                        return Object.keys(json).map(function (key) {
                            return json[key];
                        }).join('|');
                    }
                    var checksummsg = jsonToQueryString(hash_data);
                    console.log("checksum ", checksummsg);
                    var checksumvalue = this.convert_to_sha512(checksummsg);
                    pg_data['hash'] = checksumvalue.toLowerCase();
                }
            } else {
                if (Error_Msg === 'NO_ERR') {
                    var key = ((config.environment.name === 'Production') ? 'o7LxX9fJ' : 'BC50nb');
                    var SALT = ((config.environment.name === 'Production') ? 'c6ob2Q7Wb4' : 'Bwxo1cPe');
                    var merchant_id = ((config.environment.name === 'Production') ? '6742182' : '4825051');
                    var amount = objResponseJson['with_gst'];
                    var productinfo = {paymentParts: [{name: 'splitId1', merchantId: merchant_id, value: amount, commission: 0, description: 'splitId1 summary'}]};

                    var pg_data = {
                        'firstname': firstname,
                        'lastname': lastname,
                        'surl': return_url,
                        'phone': mobile,
                        'email': email,
                        'curl': return_url,
                        'furl': return_url,
                        'key': key,
                        'txnid': txnid,
                        'productinfo': JSON.stringify(productinfo),
                        'amount': amount,
                        'udf1': "",
                        'udf2': "",
                        'udf3': udf3,
                        'udf4': udf4,
                        'udf5': merchant_id,
                        'service_provider': "payu_paisa"
                    };
                    var hash_data = {// sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT);
                        'key': key, 'txnid': txnid, 'amount': amount, 'productinfo': JSON.stringify(productinfo), 'firstname': firstname, 'email': email,
                        'udf1': '', 'udf2': '', 'ud3': udf3, 'ud4': udf4, 'ud5': merchant_id, 'str1': '', 'str2': '', 'str3': '', 'str4': '', 'str5': '', 'SALT': SALT
                    };
                    function jsonToQueryString(json) {
                        return Object.keys(json).map(function (key) {
                            return json[key];
                        }).join('|');
                    }
                    var checksummsg = jsonToQueryString(hash_data);
                    console.log("checksum ", checksummsg);
                    var checksumvalue = this.convert_to_sha512(checksummsg);
                    pg_data['hash'] = checksumvalue.toLowerCase();
                }
            }
        }
        objServiceHandler.Payment.pg_data = pg_data;
        objServiceHandler.Payment.pg_redirect_mode = 'POST';
        objServiceHandler.Insurer_Transaction_Identifier = udf4;

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
ManipalCigna.prototype.pg_response_handler = function () {
    try {
        console.log('Start', this.constructor.name, 'pg_response_handler');
        var output = this.const_payment_response.pg_post;
        if (!this.lm_request.hasOwnProperty('topup_verify')) {
            this.const_policy.transaction_id = output['mihpayid'];
            if (output['status'] === 'success') {
                this.const_policy.transaction_amount = output['amount'];
                this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.policy_number = output['udf4'];
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
ManipalCigna.prototype.verification_response_handler = function (objResponseJson) {
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
            objServiceHandler.Error_Msg = Error_Msg;
            objServiceHandler.Policy = this.const_policy;
            console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
            return objServiceHandler;
        } else {
            if (this.const_policy.pg_status === 'SUCCESS') {
                if (this.lm_request['topup_applied'] !== "only" || this.lm_request.hasOwnProperty('topup_json')) {
//                    var dob = this.get_birth_date((this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['birth_date']).toString());
//                    dob = new Buffer(dob).toString('base64');
                    var policyNo = new Buffer(this.lm_request['pg_post']['udf4']).toString('base64');
                    var user = new Buffer(this.prepared_request['insurer_integration_agent_code']).toString('base64');
                    var email = new Buffer(this.lm_request['pg_post']['email']).toString('base64');
                    var insurer_pdf_url = this.prepared_request['insurer_integration_pdf_url'];
                    var password = new Buffer("Cigna@123").toString('base64');
//                    var receiptNo = new Buffer(objResponseJson.listofPolicyTO[0].inwardDOList[0].receiptId).toString('base64');
                }

                if (this.lm_request['topup_applied'] === "none") {
                    if (objResponseJson.hasOwnProperty('listofPolicyTO')) {
                        if (objResponseJson['errorList'] === null) {
                        } else {
                            Error_Msg = '';
                            objResponseJson['errorList'].map((obj) => {
                                Error_Msg += '\u2726 ' + obj.errDescription + ". ";
                            });
                        }
                    } else {
                        Error_Msg = 'LM_MSG:VERIFICATION_MAIN_NODE_MISSING';
                    }
                    if (Error_Msg === 'NO_ERR') {
                        this.const_policy.transaction_status = 'SUCCESS';//transaction success
                        this.const_policy.policy_id = objResponseJson.listofPolicyTO[0].inwardDOList[0].receiptId;
                        insurer_pdf_url += "DocumentType=&RenewalId=&ApplicationNumber=" + policyNo + "&PolicyNumber=" + policyNo + "&ReceiptNo=&UserId=" + user + "&Password=" + password + "&EmailId=" + email;
                        this.const_policy.insurer_policy_url = insurer_pdf_url;
                        console.log(insurer_pdf_url);
                        if (objResponseJson['listofPolicyTO']['0']['caseType'] === 'STP') {
                            this.const_policy.transaction_substatus = 'IF';
                        } else if (objResponseJson['listofPolicyTO']['0']['caseType'] === 'NSTP') {
                            this.const_policy.transaction_substatus = 'UW';
                        } else {
                            this.const_policy.transaction_status = 'PAYPASS';
                        }
                        var pdf_file_name = this.constructor.name + '_' + 'Health' + '_' + this.const_policy.policy_number + '.pdf';
                        var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                        var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                        this.const_policy.policy_url = pdf_web_path_portal;

//                        var https = require('https');
//                        console.log(insurer_pdf_url);
//                        try {
//                            var options = {
//                                url: insurer_pdf_url,
//                                headers: {
//                                    "app_key": objInsurerProduct['method']['Service_User'],
//                                    "app_id": objInsurerProduct['method']['Service_Password']
//                                }};
//                            var file_horizon = fs.createWriteStream(pdf_sys_loc_horizon);
//                            https.get(options, function (response) {
//                                response.pipe(file_horizon);
//                            });
//                        } catch (ep) {
//                            console.error('ExceptionPDF', this.constructor.name, 'verification_response_handler', ep);
//                        }
                    } else {
                        this.const_policy.transaction_status = 'PAYPASS';
                        Error_Msg = JSON.stringify(objResponseJson);
                    }
                    objServiceHandler.Error_Msg = Error_Msg;
                    objServiceHandler.Policy = this.const_policy;
                    console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
                    return objServiceHandler;
                } else {
                    if (this.lm_request.hasOwnProperty('topup_json')) {
                        if (objResponseJson.hasOwnProperty('listofPolicyTO')) {
                            if (objResponseJson['errorList'] === null) {
                            } else {
                                Error_Msg = '';
                                objResponseJson['errorList'].map((obj) => {
                                    Error_Msg += '\u2726 ' + obj.errDescription + ". ";
                                });
                            }
                        } else {
                            Error_Msg = 'LM_MSG:VERIFICATION_MAIN_NODE_MISSING';
                        }

                        if (Error_Msg === 'NO_ERR') {
                            this.const_policy.transaction_status = 'SUCCESS';//transaction success
                            this.const_policy.policy_id = objResponseJson.listofPolicyTO[0].inwardDOList[0].receiptId;
                            var case_type = objResponseJson['listofPolicyTO']['0']['caseType'];

                            if (case_type === 'STP' || case_type === 'NSTP') {
                                insurer_pdf_url += "DocumentType=&RenewalId=&ApplicationNumber=" + policyNo + "&PolicyNumber=" + policyNo + "&ReceiptNo=&UserId=" + user + "&Password=" + password + "&EmailId=" + email;
                                this.const_policy.insurer_policy_url = insurer_pdf_url;
                                console.log(insurer_pdf_url);
                                if (objResponseJson['listofPolicyTO']['0']['caseType'] === 'STP') {
                                    this.const_policy.transaction_substatus = 'IF';
                                } else if (objResponseJson['listofPolicyTO']['0']['caseType'] === 'NSTP') {
                                    this.const_policy.transaction_substatus = 'UW';
                                } else {
                                    this.const_policy.transaction_status = 'PAYPASS';
                                }
                                var pdf_file_name = this.constructor.name + '_' + 'Health' + '_' + this.const_policy.policy_number + '.pdf';
                                var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                                var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                                this.const_policy.policy_url = pdf_web_path_portal;

                                var https = require('https');
                                console.log(insurer_pdf_url);
//                                try {
//                                    var options = {
//                                        url: insurer_pdf_url,
//                                        headers: {
//                                            "app_key": objInsurerProduct['method']['Service_User'],
//                                            "app_id": objInsurerProduct['method']['Service_Password']
//                                        }};
//                                    var file_horizon = fs.createWriteStream(pdf_sys_loc_horizon);
//                                    https.get(options, function (response) {
//                                        response.pipe(file_horizon);
//                                    });
//                                } catch (ep) {
//                                    console.error('ExceptionPDF', this.constructor.name, 'verification_response_handler', ep);
//                                }

                                this.const_policy.pg_reference_number_1 = this.lm_request['udid'];
                                objServiceHandler.Policy = this.const_policy;
                                try {
                                    var Client = require('node-rest-client').Client;
                                    var client = new Client();
                                    var args = {
                                        data: {
                                            'search_reference_number': this.lm_request['search_reference_number'],
                                            'api_reference_number': this.lm_request['api_reference_number'],
                                            'client_key': this.lm_request['client_key'],
                                            'secret_key': this.lm_request['secret_key'],
                                            'insurer_id': this.lm_request['insurer_id'],
                                            'method_type': 'Verification',
                                            'execution_async': 'no',
                                            'topup_verify': 'yes',
                                            'request': this.lm_request['topup_json'],
                                            'base_policy': JSON.stringify(this.const_policy),
                                            'pg_url': this.const_payment_response['pg_url'],
                                            'pg_get': this.const_payment_response['pg_get'],
                                            'pg_post': this.const_payment_response['pg_post'],
                                            'pg_redirect_mode': this.const_payment_response['pg_redirect_mode']
                                        },
                                        headers: {
                                            "Content-Type": "application/json",
                                            'client_key': this.lm_request['client_key'],
                                            'secret_key': this.lm_request['secret_key']
                                        }
                                    };
                                    client.post(config.environment.weburl + '/quote/verification_initiate', args, function (data, response) {
                                        console.log("Topup verify done ", data);
                                        objServiceHandler.Policy = data['Policy'];

                                        var verifyObj = {
                                            'User_Data_Id': data['Policy']['pg_reference_number_1'],
                                            'Method_Type': 'Verification',
                                            'Status': 'pending'
                                        };
                                        var jsonUpdate = {
                                            $set: {
                                                'Status': 'complete',
                                                'Policy': data['Policy']
                                            }
                                        };
                                        serviceLog.update(verifyObj, jsonUpdate, function (err, res) {
                                            if (err)
                                                throw err;
                                            console.log('Updated!');
                                        });
                                    });
                                    sleep(30000);
                                    objServiceHandler['Error_Msg'] = 'NO_ERR';
                                    console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
                                    return objServiceHandler;
                                } catch (ep) {
                                    console.error('ExceptionTopup', this.constructor.name, 'verification_response_handler', ep);
                                    var Err = {
                                        'Type': 'LM',
                                        'Msg': JSON.stringify(ep)
                                    };
                                    objServiceHandler.Error_Msg = Error_Msg;
                                    objServiceHandler.Policy = this.const_policy;
                                    console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
                                    return objServiceHandler;
                                }
                            } else {
                                this.const_policy.transaction_status = 'PAYPASS';
                                objServiceHandler.Error_Msg = Error_Msg;
                                objServiceHandler.Policy = this.const_policy;
                                console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
                                return objServiceHandler;
                            }
                        } else {
                            this.const_policy.transaction_status = 'PAYPASS';
                            Error_Msg = JSON.stringify(objResponseJson);
                            objServiceHandler.Error_Msg = Error_Msg;
                            objServiceHandler.Policy = this.const_policy;
                            console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
                            return objServiceHandler;
                        }
                    }
                }
                if (this.lm_request.hasOwnProperty('topup_verify') || this.lm_request['topup_applied'] === "only") {
                    if (objResponseJson.hasOwnProperty('ResponseObj') && objResponseJson['ResponseObj'].hasOwnProperty('PremiumDetail')) {
                        if (objResponseJson['ResponseObj']['PremiumDetail']['0']['COI_Number'] !== null) {
                        } else {
                            Error_Msg = 'LM_MSG:VERIFICATION_TOPUP_COI_MISSING';
                        }
                    } else {
                        Error_Msg = 'LM_MSG:VERIFICATION_TOPUP_NODE_MISSING';
                    }
                    if (Error_Msg === 'NO_ERR') {
                        this.const_policy.transaction_status = 'SUCCESS';
                        if (this.lm_request['topup_applied'] === "base") {
                            var baseTopup = JSON.parse(this.lm_request['base_policy']);
                            baseTopup.policy_id = objResponseJson['ResponseObj']['PremiumDetail']['0']['COI_Number'];
                            var policyNo = baseTopup.policy_id;
                        } else {
                            if (objResponseJson['ResponseObj']['PremiumDetail']['0']['Policy_Status'] === "IF") {
                                this.const_policy.transaction_substatus = 'IF';
                                this.const_policy.policy_number = objResponseJson['ResponseObj']['PremiumDetail']['0']['COI_Number'];
                            } else {
                                this.const_policy.transaction_substatus = 'UW';
                            }
                            var policyNo = this.const_policy.policy_number;
                        }
                        if (this.const_policy.transaction_substatus === 'IF' || baseTopup['transaction_substatus'] === 'IF') {
                            var pdf_file_name = this.constructor.name + '_' + "Health" + '_' + policyNo.toString().replaceAll('/', '') + '.pdf';
                            var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                            var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                            this.const_policy.policy_url = pdf_web_path_portal;
                            if (baseTopup !== undefined) {
                                baseTopup['policy_url_topup'] = pdf_web_path_portal;
                            }

                            try {
                                var args = {
                                    data: {
                                        "search_reference_number": this.lm_request['search_reference_number'],
                                        "api_reference_number": this.lm_request['api_reference_number'],
                                        "policy_number": policyNo,
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
                        objServiceHandler['Error_Msg'] = Error_Msg;
                        objServiceHandler['Policy'] = this.lm_request['topup_applied'] !== "only" ? baseTopup : this.const_policy;
                        console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
                        return objServiceHandler;
                    } else {
                        this.const_policy.transaction_status = 'PAYPASS';
                        objServiceHandler.Error_Msg = Error_Msg;
                        objServiceHandler['Policy'] = this.lm_request['topup_applied'] !== "only" ? baseTopup : this.const_policy;
                        console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
                        return objServiceHandler;
                    }
                }
            }
        }
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', objServiceHandler);
        objServiceHandler.Policy = this.const_policy;
        return objServiceHandler;
    }
};
ManipalCigna.prototype.pdf_call = function (url, args, pdf_sys_loc) {
    var objInsurerProduct = this;
    objInsurerProduct.pdf_attempt++;
    var Client = require('node-rest-client').Client;
    var client = new Client();
    client.post(url, args, function (data, response) {
        if (data.Error_Code !== '' || true) {
            if (!fs.existsSync(pdf_sys_loc) && objInsurerProduct.pdf_attempt < 11) {
                sleep(6000);
                objInsurerProduct.pdf_call(url, args, pdf_sys_loc);
            }
        }
    });
};
ManipalCigna.prototype.pdf_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'pdf_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    try {
        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null,
            'Policy': null
        };

        if (objResponseJson.hasOwnProperty('ResponseObj') && objResponseJson['ResponseObj'].hasOwnProperty('PolicyCopy')) {
        } else {
            Error_Msg = 'LM_MSG:PDF_TOPUP_NODE_MISSING';
        }
        var policy = {
            'policy_url': null,
            'policy_number': this.lm_request['policy_number'],
            'pdf_status': null
        };
        if (Error_Msg === 'NO_ERR') {
            var byteStream = objResponseJson['ResponseObj']['PolicyCopy']['0'].byteStrem;
            var pdf_file_name = this.constructor.name + '_' + 'Health' + '_' + this.lm_request['policy_number'].toString().replaceAll('/', '') + '.pdf';
            var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
            var pdf_web_path = config.environment.weburl + "/pdf/" + pdf_file_name;
            var binary = new Buffer(byteStream, 'base64');
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
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'pdf_response_handler', objServiceHandler);
    }
    return objServiceHandler;

};
ManipalCigna.prototype.get_member_relation = function (i) {
    console.log(this.constructor.name, 'get_member_relation', ' Start ManipalCigna');
    var gender = this.lm_request['member_' + i + '_gender'];
    console.log("Gender in ManipalCigna " + gender);
    if (this.prepared_request["relation"] === 'MOTH' || this.prepared_request["relation"] === 'FATH') {
        this.processed_request['___member_' + i + '_rel___'] = gender === 'M' ? 'R006' : 'R005';
        return(gender === 'M' ? 'SON' : 'UDTR');
    }
    if (this.prepared_request["relation"] === 'SON' || this.prepared_request["relation"] === 'UDTR') {
        this.processed_request['___member_' + i + '_rel___'] = gender === 'M' ? 'R003' : 'R004';
        return(gender === 'M' ? 'FATH' : 'MOTH');
    }
    if (this.prepared_request["relation"] === 'HUSBAND' || this.prepared_request["relation"] === 'WIFE') {
        if (i >= 3) {
            this.processed_request['___member_' + i + '_rel___'] = gender === 'M' ? 'R003' : 'R004';
            return(gender === 'M' ? 'SON' : 'UDTR');
        } else {
            this.processed_request['___member_' + i + '_rel___'] = 'R002';
            return(gender === 'M' ? 'HUSBAND' : 'WIFE');
        }
    }
    if (this.prepared_request["relation"] === 'SELF' || this.prepared_request["relation"] === '') {
        if (i >= 3) {
            this.processed_request['___member_' + i + '_rel___'] = gender === 'M' ? 'R003' : 'R004';
            return(gender === 'M' ? 'SON' : 'UDTR');
        } else if (i === 1) {
            this.processed_request['___member_' + i + '_rel___'] = 'R001';
            return 'SELF';
        } else if (i === 2) {
            this.processed_request['___member_' + i + '_rel___'] = 'R002';
            return(gender === 'F' ? 'WIFE' : 'HUSBAND');
        }
    }
    return '';
    console.log(this.constructor.name, 'get_member_relation', 'End ManipalCigna');
};
ManipalCigna.prototype.get_member_relcode = function (i) {
    console.log(this.constructor.name, 'get_member_relcode', ' Start ManipalCigna');
    if (i === 1) {
        return 'PROPOSER';
    } else {
        return 'PRIMARY';
    }
    console.log(this.constructor.name, 'get_member_relcode', 'End ManipalCigna');
};
ManipalCigna.prototype.get_nominee_relation = function (nominee_rel) {
    if (nominee_rel === 'HUSBAND') {
        this.prepared_request['nominee_title'] = 'MR';
        this.processed_request['___nominee_title___'] = 'MR';
        this.processed_request['___topup_nominee_rel___'] = 'R002';
        return 'HU';
    } else if (nominee_rel === 'WIFE') {
        this.prepared_request['nominee_title'] = 'MRS';
        this.processed_request['___nominee_title___'] = 'MRS';
        this.processed_request['___topup_nominee_rel___'] = 'R002';
        return 'WI';
    } else if (nominee_rel === 'SON') {
        this.prepared_request['nominee_title'] = 'MR';
        this.processed_request['___nominee_title___'] = 'MR';
        this.processed_request['___topup_nominee_rel___'] = 'R003';
        return 'SO';
    } else if (nominee_rel === 'UDTR') {
        this.prepared_request['nominee_title'] = 'MISS';
        this.processed_request['___nominee_title___'] = 'MISS';
        this.processed_request['___topup_nominee_rel___'] = 'R004';
        return 'DA';
    } else if (nominee_rel === 'MOTH') {
        this.prepared_request['nominee_title'] = 'MRS';
        this.processed_request['___nominee_title___'] = 'MRS';
        this.processed_request['___topup_nominee_rel___'] = 'R005';
        return 'MO';
    } else if (nominee_rel === 'FATH') {
        this.prepared_request['nominee_title'] = 'MR';
        this.processed_request['___nominee_title___'] = 'MR';
        this.processed_request['___topup_nominee_rel___'] = 'R006';
        return 'FA';
    } else {
        this.prepared_request['nominee_title'] = 'Mr.';
        this.processed_request['___nominee_title___'] = 'Mr.';
        this.processed_request['___topup_nominee_rel___'] = 'R001';
        return 'OTHER';
    }
};
ManipalCigna.prototype.get_birth_date = function (birthdate) {
    var splitDate = birthdate.split('-');
    var year = splitDate[0];
    var month = splitDate[1];
    var day = splitDate[2];
    var bday = day + month + year;
    return bday;
};
ManipalCigna.prototype.get_member_type = function () {
    var adult = this.lm_request['adult_count'];
    var child = this.lm_request['child_count'];

    if (adult === 0) {
//        if(child === 1) { return "GM006"; }
//        if(child === 2) { return "GM027"; }
//        if(child === 3) { return "GM028"; }
//        if(child === 4) { return "GM029"; }
    } else {
        if (adult === 1) {
            if (child === 0) {
                return "GM004";
            }
            if (child === 1) {
                return "GM005";
            }
            if (child === 2) {
                return "GM007";
            }
            if (child === 3) {
                return "GM008";
            }
        } else {
            if (child === 0) {
                return "GM024";
            }
            if (child === 1) {
                return "GM010";
            }
            if (child === 2) {
                return "GM011";
            }
            if (child === 3) {
                return "GM012";
            }
        }
    }
    return '';
};
ManipalCigna.prototype.get_baseplan_optioncode = function (Plan_Code, si) {
    console.log('base_plan_option_code', 'start');
    var cover_type = (this.lm_request.hasOwnProperty('multi_individual') && this.lm_request['multi_individual'] === "yes") ? 'individual' : this.lm_request['health_insurance_type'];
    var basePlans = [
        {'PRODUCTID': 'RPRM04SBSF', 'BASEPLANOPTIONCD': 'IN-PRM100-HMB15K', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 10000000},
        {'PRODUCTID': 'RPRM04SBSF', 'BASEPLANOPTIONCD': 'FL-PRM100-HMB15K', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 10000000},
        {'PRODUCTID': 'RPRF04SBSF', 'BASEPLANOPTIONCD': 'IN-PRF15-HMB15K', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 1500000},
        {'PRODUCTID': 'RPRF04SBSF', 'BASEPLANOPTIONCD': 'FL-PRF15-HMB15K', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 1500000},
        {'PRODUCTID': 'RPRF04SBSF', 'BASEPLANOPTIONCD': 'IN-PRF30-HMB15K', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 3000000},
        {'PRODUCTID': 'RPRF04SBSF', 'BASEPLANOPTIONCD': 'FL-PRF30-HMB15K', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 3000000},
        {'PRODUCTID': 'RPRF04SBSF', 'BASEPLANOPTIONCD': 'IN-PRF50-HMB15K', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 5000000},
        {'PRODUCTID': 'RPRF04SBSF', 'BASEPLANOPTIONCD': 'FL-PRF50-HMB15K', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 5000000},
        {'PRODUCTID': 'RACC04SBSF', 'BASEPLANOPTIONCD': 'IN-ACC5.5-HMB5K', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 550000},
        {'PRODUCTID': 'RACC04SBSF', 'BASEPLANOPTIONCD': 'FL-ACC5.5-HMB5K', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 550000},
        {'PRODUCTID': 'RACC04SBSF', 'BASEPLANOPTIONCD': 'IN-ACC7.5-HMB5K', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 750000},
        {'PRODUCTID': 'RACC04SBSF', 'BASEPLANOPTIONCD': 'FL-ACC7.5-HMB5K', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 750000},
        {'PRODUCTID': 'RACC04SBSF', 'BASEPLANOPTIONCD': 'IN-ACC10-HMB5K', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 1000000},
        {'PRODUCTID': 'RACC04SBSF', 'BASEPLANOPTIONCD': 'FL-ACC10-HMB5K', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 1000000},
        {'PRODUCTID': 'RACC04SBSF', 'BASEPLANOPTIONCD': 'IN-ACC15-HMB5K', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 1500000},
        {'PRODUCTID': 'RACC04SBSF', 'BASEPLANOPTIONCD': 'FL-ACC15-HMB5K', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 1500000},
        {'PRODUCTID': 'RACC04SBSF', 'BASEPLANOPTIONCD': 'IN-ACC20-HMB5K', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 2000000},
        {'PRODUCTID': 'RACC04SBSF', 'BASEPLANOPTIONCD': 'FL-ACC20-HMB5K', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 2000000},
        {'PRODUCTID': 'RACC04SBSF', 'BASEPLANOPTIONCD': 'IN-ACC25-HMB5K', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 2500000},
        {'PRODUCTID': 'RACC04SBSF', 'BASEPLANOPTIONCD': 'FL-ACC25-HMB5K', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 2500000},
        {'PRODUCTID': 'RACC04SBSF', 'BASEPLANOPTIONCD': 'IN-ACC30-HMB5K', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 3000000},
        {'PRODUCTID': 'RACC04SBSF', 'BASEPLANOPTIONCD': 'FL-ACC30-HMB5K', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 3000000},
        {'PRODUCTID': 'RACC04SBSF', 'BASEPLANOPTIONCD': 'IN-ACC50-HMB5K', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 5000000},
        {'PRODUCTID': 'RACC04SBSF', 'BASEPLANOPTIONCD': 'FL-ACC50-HMB5K', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 5000000},
        {'PRODUCTID': 'RPLS04SBSF', 'BASEPLANOPTIONCD': 'IN-PLS4.5-HMB2K', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 450000},
        {'PRODUCTID': 'RPLS04SBSF', 'BASEPLANOPTIONCD': 'FL-PLS4.5-HMB2K', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 450000},
        {'PRODUCTID': 'RPLS04SBSF', 'BASEPLANOPTIONCD': 'IN-PLS5.5-HMB2K', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 550000},
        {'PRODUCTID': 'RPLS04SBSF', 'BASEPLANOPTIONCD': 'FL-PLS5.5-HMB2K', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 550000},
        {'PRODUCTID': 'RPLS04SBSF', 'BASEPLANOPTIONCD': 'IN-PLS7.5-HMB2K', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 750000},
        {'PRODUCTID': 'RPLS04SBSF', 'BASEPLANOPTIONCD': 'FL-PLS7.5-HMB2K', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 750000},
        {'PRODUCTID': 'RPLS04SBSF', 'BASEPLANOPTIONCD': 'IN-PLS10-HMB2K', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 1000000},
        {'PRODUCTID': 'RPLS04SBSF', 'BASEPLANOPTIONCD': 'FL-PLS10-HMB2K', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 1000000},
        {'PRODUCTID': 'RPLS04SBSF', 'BASEPLANOPTIONCD': 'IN-PLS15-HMB2K', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 1500000},
        {'PRODUCTID': 'RPLS04SBSF', 'BASEPLANOPTIONCD': 'FL-PLS15-HMB2K', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 1500000},
        {'PRODUCTID': 'RPLS04SBSF', 'BASEPLANOPTIONCD': 'IN-PLS20-HMB2K', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 2000000},
        {'PRODUCTID': 'RPLS04SBSF', 'BASEPLANOPTIONCD': 'FL-PLS20-HMB2K', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 2000000},
        {'PRODUCTID': 'RPLS04SBSF', 'BASEPLANOPTIONCD': 'IN-PLS25-HMB2K', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 2500000},
        {'PRODUCTID': 'RPLS04SBSF', 'BASEPLANOPTIONCD': 'FL-PLS25-HMB2K', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 2500000},
        {'PRODUCTID': 'RPLS04SBSF', 'BASEPLANOPTIONCD': 'IN-PLS30-HMB2K', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 3000000},
        {'PRODUCTID': 'RPLS04SBSF', 'BASEPLANOPTIONCD': 'FL-PLS30-HMB2K', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 3000000},
        {'PRODUCTID': 'RPLS04SBSF', 'BASEPLANOPTIONCD': 'IN-PLS50-HMB2K', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 5000000},
        {'PRODUCTID': 'RPLS04SBSF', 'BASEPLANOPTIONCD': 'FL-PLS50-HMB2K', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 5000000},
        {'PRODUCTID': 'RPRT04SBSF', 'BASEPLANOPTIONCD': 'IN-PRT2.5-HMB500', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 250000},
        {'PRODUCTID': 'RPRT04SBSF', 'BASEPLANOPTIONCD': 'FL-PRT2.5-HMB500', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 250000},
        {'PRODUCTID': 'RPRT04SBSF', 'BASEPLANOPTIONCD': 'IN-PRT3.5-HMB500', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 350000},
        {'PRODUCTID': 'RPRT04SBSF', 'BASEPLANOPTIONCD': 'FL-PRT3.5-HMB500', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 350000},
        {'PRODUCTID': 'RPRT04SBSF', 'BASEPLANOPTIONCD': 'IN-PRT4.5-HMB500', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 450000},
        {'PRODUCTID': 'RPRT04SBSF', 'BASEPLANOPTIONCD': 'FL-PRT4.5-HMB500', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 450000},
        {'PRODUCTID': 'RPRT04SBSF', 'BASEPLANOPTIONCD': 'IN-PRT5.5-HMB500', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 550000},
        {'PRODUCTID': 'RPRT04SBSF', 'BASEPLANOPTIONCD': 'FL-PRT5.5-HMB500', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 550000},
        {'PRODUCTID': 'RPRT04SBSF', 'BASEPLANOPTIONCD': 'IN-PRT7.5-HMB500', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 750000},
        {'PRODUCTID': 'RPRT04SBSF', 'BASEPLANOPTIONCD': 'FL-PRT7.5-HMB500', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 750000},
        {'PRODUCTID': 'RPRT04SBSF', 'BASEPLANOPTIONCD': 'IN-PRT10-HMB500', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 1000000},
        {'PRODUCTID': 'RPRT04SBSF', 'BASEPLANOPTIONCD': 'FL-PRT10-HMB500', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 1000000},
        {'PRODUCTID': 'RPRT04SBSF', 'BASEPLANOPTIONCD': 'IN-PRT15-HMB500', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 1500000},
        {'PRODUCTID': 'RPRT04SBSF', 'BASEPLANOPTIONCD': 'FL-PRT15-HMB500', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 1500000},
        {'PRODUCTID': 'RPRT04SBSF', 'BASEPLANOPTIONCD': 'IN-PRT20-HMB500', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 2000000},
        {'PRODUCTID': 'RPRT04SBSF', 'BASEPLANOPTIONCD': 'FL-PRT20-HMB500', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 2000000},
        {'PRODUCTID': 'RPRT04SBSF', 'BASEPLANOPTIONCD': 'IN-PRT25-HMB500', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 2500000},
        {'PRODUCTID': 'RPRT04SBSF', 'BASEPLANOPTIONCD': 'FL-PRT25-HMB500', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 2500000},
        {'PRODUCTID': 'RPRT04SBSF', 'BASEPLANOPTIONCD': 'IN-PRT30-HMB500', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 3000000},
        {'PRODUCTID': 'RPRT04SBSF', 'BASEPLANOPTIONCD': 'FL-PRT30-HMB500', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 3000000},
        {'PRODUCTID': 'RPRT04SBSF', 'BASEPLANOPTIONCD': 'IN-PRT50-HMB500', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 5000000},
        {'PRODUCTID': 'RPRT04SBSF', 'BASEPLANOPTIONCD': 'FL-PRT50-HMB500', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 5000000},
        {'PRODUCTID': 'PACT01POSSF', 'BASEPLANOPTIONCD': 'IN-PACT5', 'COVERTYPECD': 'individual', 'SUMINSUREDVALUE': 500000},//**mg
        {'PRODUCTID': 'PACT01POSSF', 'BASEPLANOPTIONCD': 'FL-PACT5', 'COVERTYPECD': 'floater', 'SUMINSUREDVALUE': 500000}//**mg
    ];
    var index = basePlans.findIndex(x => x.SUMINSUREDVALUE === si - 0 && x.COVERTYPECD === cover_type && x.PRODUCTID === Plan_Code);
    var optionCd = index === -1 ? "" : basePlans[index]['BASEPLANOPTIONCD'];
    return optionCd;
    console.log('base_plan_option_code', 'end');
};
ManipalCigna.prototype.get_topup = function () {
    var topup = [
        {"age_start": 18, "age_end": 35, "adult": 1, "child": 0, "amount": 1622.93, "with_gst": 1915.06},
        {"age_start": 36, "age_end": 40, "adult": 1, "child": 0, "amount": 1988.51, "with_gst": 2346.44},
        {"age_start": 41, "age_end": 45, "adult": 1, "child": 0, "amount": 2425.62, "with_gst": 2862.23},
        {"age_start": 18, "age_end": 35, "adult": 1, "child": 1, "amount": 2918.41, "with_gst": 3443.72},
        {"age_start": 36, "age_end": 40, "adult": 1, "child": 1, "amount": 3192.72, "with_gst": 3767.41},
        {"age_start": 41, "age_end": 45, "adult": 1, "child": 1, "amount": 3593.14, "with_gst": 4239.74},
        {"age_start": 18, "age_end": 35, "adult": 1, "child": 2, "amount": 4206.74, "with_gst": 4963.95},
        {"age_start": 36, "age_end": 40, "adult": 1, "child": 2, "amount": 4477.65, "with_gst": 5283.63},
        {"age_start": 41, "age_end": 45, "adult": 1, "child": 2, "amount": 4872.46, "with_gst": 5749.50},
        {"age_start": 18, "age_end": 35, "adult": 1, "child": 3, "amount": 5521.20, "with_gst": 6515.02},
        {"age_start": 36, "age_end": 40, "adult": 1, "child": 3, "amount": 5792.12, "with_gst": 6834.70},
        {"age_start": 41, "age_end": 45, "adult": 1, "child": 3, "amount": 6186.93, "with_gst": 7300.58},
        {"age_start": 18, "age_end": 35, "adult": 2, "child": 0, "amount": 3030.41, "with_gst": 3575.88},
        {"age_start": 36, "age_end": 40, "adult": 2, "child": 0, "amount": 3502.09, "with_gst": 4132.47},
        {"age_start": 41, "age_end": 45, "adult": 2, "child": 0, "amount": 4160.43, "with_gst": 4909.31},
        {"age_start": 18, "age_end": 35, "adult": 2, "child": 1, "amount": 3920.97, "with_gst": 4626.75},
        {"age_start": 36, "age_end": 40, "adult": 2, "child": 1, "amount": 4278.87, "with_gst": 5049.07},
        {"age_start": 41, "age_end": 45, "adult": 2, "child": 1, "amount": 4835.45, "with_gst": 5705.83},
        {"age_start": 18, "age_end": 35, "adult": 2, "child": 2, "amount": 4972.17, "with_gst": 5867.16},
        {"age_start": 36, "age_end": 40, "adult": 2, "child": 2, "amount": 5314.86, "with_gst": 6271.53},
        {"age_start": 41, "age_end": 45, "adult": 2, "child": 2, "amount": 5847.81, "with_gst": 6900.42},
        {"age_start": 18, "age_end": 35, "adult": 2, "child": 3, "amount": 6117.52, "with_gst": 7218.67},
        {"age_start": 36, "age_end": 40, "adult": 2, "child": 3, "amount": 6459.92, "with_gst": 7622.71},
        {"age_start": 41, "age_end": 45, "adult": 2, "child": 3, "amount": 6992.39, "with_gst": 8251.02}
    ];
    var index = topup.findIndex(x => x.adult === this.lm_request['adult_count'] && x.child === this.lm_request['child_count'] &&
                (x.age_start <= this.lm_request['member_1_age'] && this.lm_request['member_1_age'] <= x.age_end));
    if (this.prepared_request.hasOwnProperty('only_topup')) {
        var amt = index === -1 ? 0 : topup[index];
    } else {
        var amt = index === -1 ? 0 : topup[index]['with_gst'];
    }
    return amt;
};
ManipalCigna.prototype.check_bmi = function (height, weight) {
    var bmi = Math.round((weight / height / height) * 10000);
    if (bmi < 18 || bmi > 35) {
        return "no";
    }
};

ManipalCigna.prototype.getNomineeAge = function () {
    var nominee_date_birth = this.lm_request['nominee_birth_date'];
    var nominee_age = moment().diff(nominee_date_birth, 'years');
    this.prepared_request['nominee_age'] = nominee_age;
    this.processed_request['___nominee_age___'] = nominee_age;
};
ManipalCigna.prototype.is_valid_plan = function (lm_request, planCode) {
    console.log('ManipalCigna is_valid_plan', 'start');
    var index = -1;
    var Plans = [
        {'code': "PACT01POSSF", 'min_si': 350000, 'max_si': 5000000}, //ProHealth Premium
        {'code': "RPLS04SBSF", 'min_si': 350000, 'max_si': 5000000}, //ProHealth Plus
        {'code': "RPRF04SBSF", 'min_si': 1050000, 'max_si': 5000000}, //ProHealth Prefered
        {'code': "RPRM04SBSF", 'min_si': 5000000, 'max_si': 10000000}, //ProHealth Premier
        {'code': "RPRT04SBSF", 'min_si': 99000, 'max_si': 5000000}, //ProHealth Protect
        {'code': "RACC04SBSF", 'min_si': 450000, 'max_si': 5000000} //ProHealth Accumulate
    ];
    index = Plans.findIndex(x => x.code === planCode
                && x.min_si < (lm_request['health_insurance_si'] - 0)
                && x.max_si >= (lm_request['health_insurance_si'] - 0));
    return (index > -1 ? true : false);
    console.log('ManipalCigna is_valid_plan', 'End');
};
ManipalCigna.prototype.premium_breakup_schema = {
    "net_premium": "premium",
    "CGST": "CGST",
    "SGST": "SGST",
    "service_tax": "serviceTax",
    "final_premium": "totalPremium",
    "base_premium": "base_premium",
    "topup": "topup"
};
module.exports = ManipalCigna;