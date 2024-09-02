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
var sleep = require('system-sleep');

function ApolloMunichHealth() {

}
util.inherits(ApolloMunichHealth, Health);

ApolloMunichHealth.prototype.lm_request_single = {};
ApolloMunichHealth.prototype.insurer_integration = {};
ApolloMunichHealth.prototype.insurer_addon_list = [];
ApolloMunichHealth.prototype.insurer = {};
ApolloMunichHealth.prototype.insurer_date_format = 'YYYY-MM-DD';
//ApolloMunichHealth.prototype.insurer_date_format = 'YYYY-MM-DDTHH:MM:SS.3247584+05:30';
ApolloMunichHealth.prototype.const_insurer_suminsured = [300000, 500000, 1000000, 1500000, 2000000, 2500000, 5000000];


ApolloMunichHealth.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('insurer_product_api_pre');
};
ApolloMunichHealth.prototype.insurer_product_field_process_pre = function () {
    if (this.lm_request['method_type'] === 'Premium') {
        this.prepared_request['town_id'] = this.insurer_master['pincodes']['pb_db_master'];
        this.processed_request['___town_id___'] = this.prepared_request['town_id'];

        if (this.prepared_request['member_1_age'] > 55 || this.prepared_request['health_insurance_si'] > 2000000) {
            this.processed_request['___insurer_integration_agent_code___'] = this.prepared_request['insurer_integration_agent_code'] + 'A';
        }
        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";
        var member = 1;
        for (member = 2; member <= this.lm_request['adult_count']; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
        }
        this.getSacCode();
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);

        var member = 1;
        for (member = 1; member <= this.lm_request['adult_count']; member++)
        {
            if (member === 1)
            {
            } else
            {
                this.prepared_request['member_' + member + '_inc'] = member - 1;
                this.processed_request['___member_' + member + '_inc___'] = member - 1;
            }
            if (this.lm_request.hasOwnProperty('multi_individual') && this.lm_request['multi_individual'] === "yes") {
                this.prepared_request['member_' + member + '_si'] = this.health_suminsured_selector(this.lm_request['member_' + member + '_si'] - 0, this.const_insurer_suminsured);
                this.processed_request['___member_' + member + '_si___'] = this.prepared_request['member_' + member + '_si'];
                this.multi_si_conditions(member);
            } else {
                this.prepared_request['member_' + member + '_si'] = this.prepared_request['health_insurance_si'];
                this.processed_request['___member_' + member + '_si___'] = this.prepared_request['health_insurance_si'];
                this.method_content = member > 1 ? this.method_content.replaceAll("___member_" + member + "_si___", 0) : this.method_content;
                this.si_conditions(member);
            }
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            if (this.lm_request['adult_count'] === 1)
            {
                this.prepared_request['member_' + member + '_inc'] = member - 2;
                this.processed_request['___member_' + member + '_inc___'] = member - 2;
            } else
            {
                this.prepared_request['member_' + member + '_inc'] = member - 1;
                this.processed_request['___member_' + member + '_inc___'] = member - 1;

            }
            if (this.lm_request.hasOwnProperty('multi_individual') && this.lm_request['multi_individual'] === "yes") {
                this.prepared_request['member_' + member + '_si'] = this.health_suminsured_selector(this.lm_request['member_' + member + '_si'] - 0, this.const_insurer_suminsured);
                this.processed_request['___member_' + member + '_si___'] = this.prepared_request['member_' + member + '_si'];
                this.multi_si_conditions(member);
            } else {
                this.prepared_request['member_' + member + '_si'] = this.prepared_request['health_insurance_si'];
                this.processed_request['___member_' + member + '_si___'] = this.prepared_request['health_insurance_si'];
                this.method_content = member > 1 ? this.method_content.replaceAll("___member_" + member + "_si___", 0) : this.method_content;
                this.si_conditions(member);
            }
        }
        if (this.prepared_request['Plan_Name'].includes('Optima') || this.lm_request['health_insurance_si'] >= 5000000) {
            txt_replace = this.find_text_btw_key(this.method_content, '<!--Addon_CI_Start-->', '<!--Addon_CI_End-->', true);
            var txt_replace1 = this.find_text_btw_key(this.method_content, '<!--Addon_ci_Start-->', '<!--Addon_ci_End-->', true);
            this.method_content = this.method_content.replace(txt_replace, "");
            this.method_content = this.method_content.replace(txt_replace1, "");
            if (this.lm_request['child_count'] !== '') {
                for (i = 1; i <= this.lm_request['child_count']; i++) {
                    txt_replace = this.find_text_btw_key(this.method_content, '<!--Addon_CI_Start-->', '<!--Addon_CI_End-->', true);
                    var txt_replace1 = this.find_text_btw_key(this.method_content, '<!--Addon_ci_Start-->', '<!--Addon_ci_End-->', true);
                    this.method_content = this.method_content.replace(txt_replace, "");
                    this.method_content = this.method_content.replace(txt_replace1, "");
                }
            }
        }
        if (this.lm_request['policy_tenure'] === 2) {
            this.prepared_request['addon_ca_code'] = 11196;
            this.processed_request['___addon_ca_code___'] = this.prepared_request['addon_ca_code'];
            this.prepared_request['addon_pa_code'] = 22048;
            this.processed_request['___addon_pa_code___'] = this.prepared_request['addon_pa_code'];
            this.prepared_request['Plan_Code'] = this.getPlanCode(this.prepared_request['Plan_Code']);
            this.processed_request['___Plan_Code___'] = this.prepared_request['Plan_Code'];
            this.getAddonCode(this.prepared_request['Plan_Code']);
        } else {
            this.prepared_request['addon_ca_code'] = 11197;
            this.processed_request['___addon_ca_code___'] = this.prepared_request['addon_ca_code'];
            this.prepared_request['addon_pa_code'] = 22051;
            this.processed_request['___addon_pa_code___'] = this.prepared_request['addon_pa_code'];
            this.getAddonCode(this.prepared_request['Plan_Code']);
        }
        var obj_plan_details = this.get_plan_version(this.prepared_request['Plan_Code']);
        this.prepared_request['get_plan_version'] = obj_plan_details['version'];
        this.prepared_request['get_plan_group'] = obj_plan_details['group'];
        this.prepared_request['get_plan_line'] = obj_plan_details['line'];
        this.prepared_request['get_plan_category'] = obj_plan_details['category'];

        if (this.lm_request['quick_quote'] === false) {
            this.replace_content();
        }
    }
    if (this.lm_request['method_type'] === 'Customer') {
        var bmi_check = '';
        this.prepared_request['isNSTP'] = 'no';
        this.processed_request['___isNSTP___'] = 'no';
        this.prepared_request["base_plan"] = this.prepared_request['dbmaster_pb_plan_name'].includes('Optima') ? "Optima Restore" : "Easy Health";
        this.processed_request["___base_plan___"] = this.prepared_request["base_plan"];

        var state_code = (this.lm_request['communication_state_code'].length === 1 ? "00" : "0") + this.lm_request['communication_state_code'];
        this.prepared_request['communication_state_code'] = state_code;
        this.processed_request['___communication_state_code___'] = this.prepared_request['communication_state_code'];

        var obj_premium_breakup = this.insurer_master['service_logs']['pb_db_master']['Premium_Breakup'];
        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";
        var member = 1;
        for (member = 2; member <= this.lm_request['adult_count']; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start1-->', '<!--InsurersDetail_End1-->', true);
        var txt_replace_with = "";
        var member = 1;
        for (member = 2; member <= this.lm_request['adult_count']; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);

        this.getSacCode();
        for (member = 1; member <= this.lm_request['adult_count']; member++) {
            if (this.lm_request.hasOwnProperty('multi_individual') && this.lm_request['multi_individual'] === "yes") {
                this.prepared_request['member_' + member + '_si'] = this.health_suminsured_selector(this.lm_request['member_' + member + '_si'] - 0, this.const_insurer_suminsured);
                this.processed_request['___member_' + member + '_si___'] = this.prepared_request['member_' + member + '_si'];
                this.multi_si_conditions(member);
            } else {
                this.prepared_request['member_' + member + '_si'] = this.prepared_request['health_insurance_si'];
                this.processed_request['___member_' + member + '_si___'] = this.prepared_request['health_insurance_si'];
                this.method_content = member > 1 ? this.method_content.replaceAll("___member_" + member + "_si___", 0) : this.method_content;
                this.si_conditions(member);
            }
            if (member === 1)
            {
                this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
                this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
            } else
            {
                this.prepared_request['member_' + member + '_inc'] = member - 1;
                this.processed_request['___member_' + member + '_inc___'] = member - 1;
                this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
                this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
            }
            for (var key in this.lm_request) {
                if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1) {
                    var ques_detail = key.replace('_type', '_details');
                    if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                        if (this.lm_request[ques_detail] === false) {
                            this.prepared_request[ques_detail] = "0";
                            this.processed_request['___' + ques_detail + '___'] = "0";
                            this.prepared_request[ques_detail + '1'] = "N";
                            this.processed_request['___' + ques_detail + '1___'] = "N";
                        } else {
                            this.prepared_request[ques_detail] = "1";
                            this.processed_request['___' + ques_detail + '___'] = "1";
                            this.prepared_request[ques_detail + '1'] = "Y";
                            this.processed_request['___' + ques_detail + '1___'] = "Y";
                            this.prepared_request['isNSTP'] = 'yes';
                            this.processed_request['___isNSTP___'] = 'yes';
                        }
                    } else if (this.lm_request[key].toString().toLowerCase() === 'since') {
                        this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                        this.processed_request['___' + ques_detail + '___'] = this.lm_request[ques_detail];
                    }

                }
            }
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            if (this.lm_request.hasOwnProperty('multi_individual') && this.lm_request['multi_individual'] === "yes") {
                this.prepared_request['member_' + member + '_si'] = this.health_suminsured_selector(this.lm_request['member_' + member + '_si'] - 0, this.const_insurer_suminsured);
                this.processed_request['___member_' + member + '_si___'] = this.prepared_request['member_' + member + '_si'];
                this.multi_si_conditions(member);
            } else {
                this.prepared_request['member_' + member + '_si'] = this.prepared_request['health_insurance_si'];
                this.processed_request['___member_' + member + '_si___'] = this.prepared_request['health_insurance_si'];
                this.method_content = member > 1 ? this.method_content.replaceAll("___member_" + member + "_si___", 0) : this.method_content;
                this.si_conditions(member);
            }
            if (this.lm_request['adult_count'] === 1)
            {
                this.prepared_request['member_' + member + '_inc'] = member - 2;
                this.processed_request['___member_' + member + '_inc___'] = member - 2;
                this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
                this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
            } else
            {
                this.prepared_request['member_' + member + '_inc'] = member - 1;
                this.processed_request['___member_' + member + '_inc___'] = member - 1;
                this.prepared_request['member_' + member + '_relation'] = this.get_member_relation(member);
                this.processed_request['___member_' + member + '_relation___'] = this.prepared_request['member_' + member + '_relation'];
            }
            for (var key in this.lm_request) {
                if (key.indexOf('_type') > -1 && key.indexOf('_question_') > -1) {
                    var ques_detail = key.replace('_type', '_details');
                    if (this.lm_request[key].toString().toLowerCase() === 'flag') {
                        if (this.lm_request[ques_detail] === false) {
                            this.prepared_request[ques_detail] = "0";
                            this.processed_request['___' + ques_detail + '___'] = "0";
                            this.prepared_request[ques_detail + '1'] = "N";
                            this.processed_request['___' + ques_detail + '1___'] = "N";
                        } else {
                            this.prepared_request[ques_detail] = "1";
                            this.processed_request['___' + ques_detail + '___'] = "1";
                            this.prepared_request[ques_detail + '1'] = "Y";
                            this.processed_request['___' + ques_detail + '1___'] = "Y";
                            this.prepared_request['isNSTP'] = 'yes';
                            this.processed_request['___isNSTP___'] = 'yes';
                        }
                    } else if (this.lm_request[key].toString().toLowerCase() === 'since') {
                        this.prepared_request[ques_detail] = this.lm_request[ques_detail];
                        this.processed_request['___' + ques_detail + '___'] = this.lm_request[ques_detail];
                    }
                }
            }
        }
        if (this.prepared_request['dbmaster_pb_plan_name'].includes('Optima') || this.lm_request['health_insurance_si'] >= 5000000) {
            if (this.lm_request['child_count'] !== '') {
                for (i = 1; i <= this.lm_request['child_count']; i++) {
                    txt_replace = this.find_text_btw_key(this.method_content, '<!--Addon_CI_Start-->', '<!--Addon_CI_End-->', true);
                    var txt_replace1 = this.find_text_btw_key(this.method_content, '<!--Addon_ci_Start-->', '<!--Addon_ci_End-->', true);
                    this.method_content = this.method_content.replace(txt_replace, "");
                    this.method_content = this.method_content.replace(txt_replace1, "");
                }
            }
        }
        if (this.lm_request['member_count'] > 1) {
            var dependent_details = this.insurer_master['service_logs']['pb_db_master']['Insurer_Response']['Envelope']['Body']['0']['ComputePremiumResponse']['0']['ComputePremiumResult']['0']['Client']['0']['Dependants']['0']['Client'];
        }
        var selected_addon_details = this.insurer_master['service_logs']['pb_db_master']['Insurer_Response']['Envelope']['Body']['0']['ComputePremiumResponse']['0']['ComputePremiumResult']['0']['Client']['0']['Product']['0']['Product'];
        if (obj_premium_breakup.hasOwnProperty('multi_indi_premium') && this.lm_request['multi_individual'] === 'yes') {
            for (i = 1; i <= this.lm_request['member_count'] + 1; i++) {
                if (obj_premium_breakup['multi_indi_premium'].hasOwnProperty('member_' + i + '_final_premium')) {
                    if (i === 1 || this.lm_request['adult_count'] === 2) {
                        this.prepared_request['member_' + i + '_gross_premium'] = obj_premium_breakup['multi_indi_premium']['member_' + i + '_final_premium'];
                        this.processed_request['___member_' + i + '_gross_premium___'] = this.prepared_request['member_' + i + '_gross_premium'];
                        this.prepared_request['member_' + i + '_base_premium'] = obj_premium_breakup['multi_indi_premium']['member_' + i + '_net_premium'];
                        this.processed_request['___member_' + i + '_base_premium___'] = this.prepared_request['member_' + i + '_base_premium'];
                        this.prepared_request['member_' + i + '_service_tax'] = obj_premium_breakup['multi_indi_premium']['member_' + i + '_service_tax'];
                        this.processed_request['___member_' + i + '_service_tax___'] = this.prepared_request['member_' + i + '_service_tax'];
                    } else {
                        this.prepared_request['member_' + (i + 1) + '_gross_premium'] = obj_premium_breakup['multi_indi_premium']['member_' + i + '_final_premium'];
                        this.processed_request['___member_' + (i + 1) + '_gross_premium___'] = this.prepared_request['member_' + (i + 1) + '_gross_premium'];
                        this.prepared_request['member_' + (i + 1) + '_base_premium'] = obj_premium_breakup['multi_indi_premium']['member_' + i + '_net_premium'];
                        this.processed_request['___member_' + (i + 1) + '_base_premium___'] = this.prepared_request['member_' + (i + 1) + '_base_premium'];
                        this.prepared_request['member_' + (i + 1) + '_service_tax'] = obj_premium_breakup['multi_indi_premium']['member_' + i + '_service_tax'];
                        this.processed_request['___member_' + (i + 1) + '_service_tax___'] = this.prepared_request['member_' + (i + 1) + '_service_tax'];
                    }
                }
            }
        } else {
            this.prepared_request['member_1_base_premium'] = selected_addon_details['0']['BasePremiumAmount']['0'];
            this.processed_request['___member_1_base_premium___'] = this.prepared_request['member_1_base_premium'];
            this.prepared_request['member_1_gross_premium'] = selected_addon_details['0']['GrossPremiumAmount']['0'];
            this.processed_request['___member_1_gross_premium___'] = this.prepared_request['member_1_gross_premium'];
            this.prepared_request['member_1_service_tax'] = obj_premium_breakup['service_tax'];
            this.processed_request['___member_1_service_tax___'] = selected_addon_details['0']['TaxAmount']['0'];
            for (i = 2; i <= this.lm_request['member_count'] + 2; i++) {
                if (this.prepared_request['member_' + i + '_first_name'] !== undefined) {
                    this.prepared_request['member_' + i + '_gross_premium'] = 0;
                    this.processed_request['___member_' + i + '_gross_premium___'] = 0;
                    this.prepared_request['member_' + i + '_base_premium'] = 0;
                    this.processed_request['___member_' + i + '_base_premium___'] = 0;
                    this.prepared_request['member_' + i + '_service_tax'] = 0;
                    this.processed_request['___member_' + i + '_service_tax___'] = 0;
                }
            }
        }

        if (this.prepared_request['member_1_age'] > 55 || this.prepared_request['health_insurance_si'] > 2000000) {
            this.prepared_request['isNSTP'] = 'yes';
            this.processed_request['___isNSTP___'] = 'yes';
        }
        for (member = 1; member <= 6; member++) {
            if (this.processed_request['___member_' + member + '_inc___'] !== '' && this.processed_request['___member_' + member + '_inc___'] !== undefined) {
                this.calculate_bmi(member);
                this.prepared_request['member_' + member + '_bmi_normal'] = this.check_bmi(this.prepared_request['member_' + member + '_age'], this.prepared_request['member_' + member + '_bmi']);
                this.processed_request['___member_' + member + '_bmi_normal___'] = this.prepared_request['member_' + member + '_bmi_normal'];
                bmi_check = bmi_check === "" ? this.prepared_request['member_' + member + '_bmi_normal'] : bmi_check + "|" + this.prepared_request['member_' + member + '_bmi_normal'];
                if (this.processed_request['___member_' + member + '_question_1265_details___'] > 10 ||
                        this.processed_request['___member_' + member + '_question_1266_details___'] > 7 ||
                        this.processed_request['___member_' + member + '_question_1267_details___'] > 9 ||
                        this.processed_request['___member_' + member + '_question_1268_details___'] > 10 ||
                        this.processed_request['___member_' + member + '_question_1269_details___'] > 6 ||
                        (this.processed_request['___member_' + member + '_question_1267_details___'] > 0 &&
                                this.processed_request['___member_' + member + '_question_1268_details___'] > 0 &&
                                this.processed_request['___member_' + member + '_question_1269_details___'] > 0)) {
                    this.prepared_request['isNSTP'] = 'yes';
                    this.processed_request['___isNSTP___'] = 'yes';
                }
            } else {
                for (var key in this.prepared_request) {
                    if (key.includes('member_1')) {
                        var ques_detail = key.replace('member_1', 'member_' + member);
                        this.prepared_request[ques_detail] = "";
                        this.processed_request['___' + ques_detail + '___'] = "";
                        this.prepared_request[ques_detail + '1'] = "";
                        this.processed_request['___' + ques_detail + '1___'] = "";
                    }
                }
            }
        }

        if (this.processed_request['___isNSTP___'] === 'yes' || bmi_check.includes('no')) {
            this.processed_request['___insurer_integration_agent_code___'] = this.prepared_request['insurer_integration_agent_code'] + 'A';
            this.get_nominee_relation();
            this.get_marital_status();
            this.get_proposal_datetime();
            for (member = 1; member <= 6; member++) {
                if (this.lm_request['adult_count'] === 1) {
                    for (var key in this.prepared_request) {
                        if (key.includes('member_' + member)) {
                            var ques_detail = member <= 2 ? key : key.replace('member_' + member, 'member_' + (member - 1));
                            this.processed_request['___temp_' + ques_detail + '___'] = this.processed_request['___' + key + '___'];
                        }
                    }
                }
            }
        }
        if (this.lm_request['policy_tenure'] === 2) {
            this.prepared_request['dbmaster_pb_plan_code'] = this.getPlanCode(this.prepared_request['dbmaster_pb_plan_code']);
            this.processed_request['___dbmaster_pb_plan_code___'] = this.prepared_request['dbmaster_pb_plan_code'];
            this.prepared_request['addon_ca_code'] = 11196;
            this.processed_request['___addon_ca_code___'] = this.prepared_request['addon_ca_code'];
            this.prepared_request['addon_pa_code'] = 22048;
            this.processed_request['___addon_pa_code___'] = this.prepared_request['addon_pa_code'];
            this.getAddonCode(this.prepared_request['dbmaster_pb_plan_code']);
        } else {
            this.prepared_request['addon_ca_code'] = 11197;
            this.processed_request['___addon_ca_code___'] = this.prepared_request['addon_ca_code'];
            this.prepared_request['addon_pa_code'] = 22051;
            this.processed_request['___addon_pa_code___'] = this.prepared_request['addon_pa_code'];
            this.getAddonCode(this.prepared_request['dbmaster_pb_plan_code']);
        }
        var obj_plan_details = this.get_plan_version(this.prepared_request['dbmaster_pb_plan_code']);
        this.prepared_request['get_plan_version'] = obj_plan_details['version'];
        this.prepared_request['get_plan_group'] = obj_plan_details['group'];
        this.prepared_request['get_plan_line'] = obj_plan_details['line'];
        this.prepared_request['get_plan_category'] = obj_plan_details['category'];

        var addon_checked = this.insurer_master['service_logs']['pb_db_master']['Premium_Breakup']['addon']['addon_checked'];
//        var selected_addon_details = this.insurer_master['service_logs']['pb_db_master']['Insurer_Response']['Envelope']['Body']['0']['ComputePremiumResponse']['0']['ComputePremiumResult']['0']['Client']['0']['Product']['0']['Product'];
        for (var i = 1; i <= addon_checked.length; i++) {
            addon_checked[i - 1 + '_grossPremium'] = Number(selected_addon_details["" + i + ""]['GrossPremiumAmount']["0"]);
            this.processed_request['___' + addon_checked[i - 1] + '_grossPremium___'] = addon_checked[i - 1 + '_grossPremium'];
            addon_checked[i - 1 + '_basePremium'] = Number(selected_addon_details["" + i + ""]['BasePremiumAmount']["0"]);
            this.processed_request['___' + addon_checked[i - 1] + '_basePremium___'] = addon_checked[i - 1 + '_basePremium'];
            addon_checked[i - 1 + '_taxAmount'] = Number(selected_addon_details["" + i + ""]['TaxAmount']["0"]);
            this.processed_request['___' + addon_checked[i - 1] + '_taxAmount___'] = addon_checked[i - 1 + '_taxAmount'];
            addon_checked[i - 1 + '_discountAmount'] = Number(selected_addon_details["" + i + ""]['DiscountAmount']["0"]);
            this.processed_request['___' + addon_checked[i - 1] + '_discountAmount___'] = addon_checked[i - 1 + '_discountAmount'];
        }
//        dependant addon details:
        if (this.lm_request['member_count'] > 1) {
            for (i = 1; i <= this.lm_request['member_count'] - 1; i++) {
                var index = addon_checked.indexOf("addon_Pa");
                if (index > -1) {
                    addon_checked.splice(index, 1);
                }
                for (var j = 1; j <= addon_checked.length; j++) {
                    this.prepared_request['member_' + i + '_' + addon_checked[j - 1] + '_grossPremium'] = dependent_details['' + i - 1 + '']['Product']['0']['Product']['' + j + '']["GrossPremiumAmount"]['0'];
                    this.processed_request['___member_' + i + '_' + addon_checked[j - 1] + '_grossPremium___'] = this.prepared_request['member_' + i + '_' + addon_checked[j - 1] + '_grossPremium'];
                    this.prepared_request['member_' + i + '_' + addon_checked[j - 1] + '_basePremium'] = dependent_details['' + i - 1 + '']['Product']['0']['Product']['' + j + '']["BasePremiumAmount"]['0'];
                    this.processed_request['___member_' + i + '_' + addon_checked[j - 1] + '_basePremium___'] = this.prepared_request['member_' + i + '_' + addon_checked[j - 1] + '_basePremium'];
                    this.prepared_request['member_' + i + '_' + addon_checked[j - 1] + '_serviceTax'] = dependent_details['' + i - 1 + '']['Product']['0']['Product']['' + j + '']["TaxAmount"]['0'];
                    this.processed_request['___member_' + i + '_' + addon_checked[j - 1] + '_serviceTax___'] = this.prepared_request['member_' + i + '_' + addon_checked[j - 1] + '_serviceTax'];
                    this.prepared_request['member_' + i + '_' + addon_checked[j - 1] + '_discountAmount'] = dependent_details['' + i - 1 + '']['Product']['0']['Product']['' + j + '']["DiscountAmount"]['0'];
                    this.processed_request['___member_' + i + '_' + addon_checked[j - 1] + '_discountAmount___'] = this.prepared_request['member_' + i + '_' + addon_checked[j - 1] + '_discountAmount'];
                }
            }
        }
        this.replace_content();

        //for posp case
        if (config.environment.name !== 'Production' && (this.lm_request['ss_id'] - 0) === 487) {
            this.lm_request['is_posp'] = 'yes';
        }
        var posp_request_data = this.find_text_btw_key(this.method_content.toString(), '<!--POS_CONFIG_START-->', '<!--POS_CONFIG_FINISH-->', false);
        if (this.lm_request['is_posp'] === 'yes' && (this.prepared_request["health_insurance_si"] - 0) < 500000) {
            var obj_replace = {};
            if (config.environment.name === 'Production') {

            } else {
                /*
                 * <POSPAadhaarNumber>___posp_aadhar___</POSPAadhaarNumber>
                 <POSPCode>___posp_insurer_code___</POSPCode>
                 <POSPName>___posp_first_name___ ___posp_last_name___</POSPName>
                 <POSPPANNumber>___posp_pan_no___</POSPPANNumber>
                 
                 <POSPAadhaarNumber>123456789009</POSPAadhaarNumber>
                 <POSPCode>POSPCODE123</POSPCode>
                 <POSPName>POSPNAMEabc</POSPName>
                 <POSPPANNumber>AWWUK9876A</POSPPANNumber>
                 * 
                 */
                obj_replace = {
                    '___posp_aadhar___': '123456789009',
                    '___posp_insurer_code___': 'POSPCODE123',
                    '___posp_first_name___ ___posp_last_name___': 'POSPNAMEabc',
                    '___posp_pan_no___': 'AWWUK9876A'
                };
            }
            if (Object.keys(obj_replace).length > 0) {
                this.method_content = this.method_content.toString().replaceJson(obj_replace);
            }
            for (var k in this.lm_request) {
                if (k.indexOf('posp_') === 0) {
                    this.method_content = this.method_content.replace('___' + k + '___', this.lm_request[k]);
                }
            }
        } else {
            this.method_content = this.method_content.replace(posp_request_data, '');
        }
        //pos end
    }
    if (this.lm_request['method_type'] === 'Proposal') {
        var returnUrl = this.pg_ack_url(21);
        if (config.environment.name === 'Development') {
            returnUrl = 'http://localhost:7000/transaction-status/' + this.lm_request['udid'] + '/' + this.lm_request['crn'] + '/' + this.lm_request['proposal_id'];
        }
        this.prepared_request['return_url'] = returnUrl;
        this.processed_request['___return_url___'] = returnUrl;
    }
    if (this.lm_request['method_type'] === 'Verification') {
        this.processed_request['___insurer_integration_agent_code___'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['insurer_customer_identifier_2'];
    }
    if (this.lm_request['method_type'] === 'Pdf') {
        this.prepared_request['encoded_data'] = this.lm_request['proposal_pdf'];
        this.processed_request['___encoded_data___'] = this.prepared_request['encoded_data'];
    }
    this.processed_request['___get_plan_version___'] = this.prepared_request['get_plan_version'];
    this.processed_request['___get_plan_group___'] = this.prepared_request['get_plan_group'];
    this.processed_request['___get_plan_line___'] = this.prepared_request['get_plan_line'];
    this.processed_request['___get_plan_category___'] = this.prepared_request['get_plan_category'];

    console.log('insurer_product_field_process_pre');
    console.log(this.processed_request);
    console.log(this.method_content);
};
ApolloMunichHealth.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
ApolloMunichHealth.prototype.insurer_product_field_process_post = function () {
};
ApolloMunichHealth.prototype.insurer_product_api_post = function () {
};
ApolloMunichHealth.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
//    console.log('service_call');

    try {
        var objInsurerProduct = this;
        var xml2js = require('xml2js');
        var body = docLog.Insurer_Request;
        var http = require('http');
        if (config.environment.name === 'Production')
        {
            var postRequest = {
                host: 'b2b.apollomunichinsurance.com',
                path: specific_insurer_object.method.Service_URL,
                //port: 443,
                method: "POST",
                "rejectUnauthorized": false,
                headers: {
                    'Content-Type': 'text/xml',
                    'Content-Length': Buffer.byteLength(body),
                    "SOAPAction": 'http://www.apollomunichinsurance.com/B2BService' + specific_insurer_object.method.Method_Action
                }
            };
        } else {
            var postRequest = {
                host: 'b2buat.apollomunichinsurance.com',
                path: specific_insurer_object.method.Service_URL,
                //port: 443,
                method: "POST",
                "rejectUnauthorized": false,
                headers: {
                    'Content-Type': 'text/xml',
                    'Content-Length': Buffer.byteLength(body),
                    "SOAPAction": 'http://www.apollomunichinsurance.com/B2BService' + specific_insurer_object.method.Method_Action
                }
            };
        }
        console.error('ApolloMunich ', postRequest);
        var buffer = "";
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
        var req = http.request(postRequest, function (res) {

//            console.log(res.statusCode);
            var buffer = "";
            res.on("data", function (data) {
                buffer = buffer + data;
            });
            res.on("end", function (data) {
                // var parse = JSON.parse(buffer);
//                console.log(buffer);

                var objReplace = {
                    's:': '',
                    'a:': ''
                };
                var fliter_response = buffer.replaceJson(objReplace);
                xml2js.parseString(fliter_response, {ignoreAttrs: true}, function (err, objXml2Json) {
//                    console.log(objXml2Json);
                    if (err) {
//                        console.error('Exception', this.constructor.name, 'service_call', err);
                    } else {
                        var objResponseFull = {
                            'err': null,
                            'result': objXml2Json,
                            'raw': objXml2Json,
                            'soapHeader': null,
                            'objResponseJson': objXml2Json
                        };
                        if (objInsurerProduct.lm_request['method_type'] === 'Premium') {
                            objResponseFull['objResponseJson']['actualPlanName'] = docLog['Plan_Name'];
                        }
                        var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                    }
                });
            });
        });
        req.on('error', function (e) {
            console.error('problem with request: ' + e.message);
        });
        req.write(body);
        req.end();
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};
ApolloMunichHealth.prototype.premium_response_handler = function (objResponseJson) {
//    console.log('Apollo Munich', this.constructor.name, 'premium_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        //check error start
        if (objResponseJson["Envelope"]["Body"]["0"].hasOwnProperty('ComputePremiumResponse')) {
            if (objResponseJson["Envelope"]["Body"]["0"]["ComputePremiumResponse"]["0"]["ComputePremiumResult"]["0"].hasOwnProperty("Client")) {
                var objPremiumService = objResponseJson["Envelope"]["Body"]["0"]["ComputePremiumResponse"]["0"]["ComputePremiumResult"]["0"]["Client"]["0"];
                if (objPremiumService["Product"]["0"]["Product"]["0"]["ProductCode"]["0"].includes('invalid')) {
                    Error_Msg = objPremiumService["Product"]["0"]["Product"]["0"]["ProductCode"]["0"];
                }
            } else {
                Error_Msg = "Premium_MAIN_NODE_MISSING";
            }
        } else {
            Error_Msg = JSON.stringify(objPremiumService);
        }
        if (Error_Msg === 'NO_ERR')
        {
            var premium_breakup = this.get_const_premium_breakup();
            if (this.lm_request.hasOwnProperty('multi_individual') && this.lm_request['multi_individual'] === "yes") {
                premium_breakup['multi_indi_premium'] = {};
                var multi_individuals = objPremiumService["Dependants"]["0"]["Client"];
                for (var i = 0; i < multi_individuals.length; i++) {
                    var j = i + 2;
                    premium_breakup['multi_indi_premium']['member_' + j + '_final_premium'] = Number(objPremiumService["Dependants"]["0"]["Client"][i]["Product"]["0"]["Product"]["0"]['GrossPremiumAmount']["0"]);
                    premium_breakup['multi_indi_premium']['member_' + j + '_service_tax'] = Number(objPremiumService["Dependants"]["0"]["Client"][i]["Product"]["0"]["Product"]["0"]['TaxAmount']["0"]);
                    premium_breakup['multi_indi_premium']['member_' + j + '_net_premium'] = Number(objPremiumService["Dependants"]["0"]["Client"][i]["Product"]["0"]["Product"]["0"]['BasePremiumAmount']["0"]);
                    premium_breakup['service_tax'] += Number(objPremiumService["Dependants"]["0"]["Client"][i]["Product"]["0"]["Product"]["0"]['TaxAmount']["0"]);
                    premium_breakup['net_premium'] += Number(objPremiumService["Dependants"]["0"]["Client"][i]["Product"]["0"]["Product"]["0"]['BasePremiumAmount']["0"]);
                }
                premium_breakup['multi_indi_premium']['member_1_final_premium'] = Number(objPremiumService["Product"]["0"]["Product"]["0"]['GrossPremiumAmount']["0"]);
                premium_breakup['multi_indi_premium']['member_1_service_tax'] = Number(objPremiumService["Product"]["0"]["Product"]["0"]['TaxAmount']["0"]);
                premium_breakup['multi_indi_premium']['member_1_net_premium'] = Number(objPremiumService["Product"]["0"]["Product"]["0"]['BasePremiumAmount']["0"]);

//                premium_breakup['service_tax'] += Number(objPremiumService["Dependants"]["0"]["Client"]["0"]["Product"]["0"]["Product"]["0"]['TaxAmount']["0"]);
//                premium_breakup['net_premium'] += Number(objPremiumService["Dependants"]["0"]["Client"]["0"]["Product"]["0"]["Product"]["0"]['BasePremiumAmount']["0"]);
            }
            if (this.lm_request['quick_quote'] === true) {
                premium_breakup['final_premium'] = Number(objPremiumService["Product"]["0"]["Product"]["0"]['GrossPremiumAmount']["0"]);
                premium_breakup['service_tax'] = Number(objPremiumService["Product"]["0"]["Product"]["0"]['TaxAmount']["0"]);
                premium_breakup['net_premium'] = Number(objPremiumService["Product"]["0"]["Product"]["0"]['BasePremiumAmount']["0"]);
                if (this.lm_request['member_count'] > 1) {
                    var final = 0;
                    var tax = 0;
                    var base = 0;
                    for (var i = 0; i < this.lm_request['member_count'] - 1; i++) {
                        final += Number(objPremiumService["Dependants"]["0"]["Client"]["" + i + ""]['Product']["0"]['Product']['0']['GrossPremiumAmount']['0']);
                        base += Number(objPremiumService["Dependants"]["0"]["Client"]["" + i + ""]['Product']["0"]['Product']['0']['BasePremiumAmount']['0']);
                        tax += Number(objPremiumService["Dependants"]["0"]["Client"]["" + i + ""]['Product']["0"]['Product']['0']['TaxAmount']['0']);
                    }
                    premium_breakup['final_premium'] = Number(final + premium_breakup['final_premium']);
                    premium_breakup['service_tax'] = Number(tax + premium_breakup['service_tax']);
                    premium_breakup['net_premium'] = Number(base + premium_breakup['net_premium']);
                }
                var ca_total = 0;
                var ci_total = 0;
                var Hdc_total = 0;
                var protector_total = 0;
                if (this.lm_request['health_insurance_si'] < 1000000 && objResponseJson['actualPlanName'].includes('Optima')) {
                    premium_breakup.addon['addon_Hdc'] = Number(objPremiumService["Product"]["0"]["Product"]["1"]['GrossPremiumAmount']["0"]);
                    premium_breakup.addon['addon_Pa'] = Number(objPremiumService["Product"]["0"]["Product"]["2"]['GrossPremiumAmount']["0"]);
                    premium_breakup.addon['addon_protector'] = Number(objPremiumService["Product"]["0"]["Product"]["3"]['GrossPremiumAmount']["0"]);
                    if (this.lm_request['member_count'] > 1) {
                        for (var i = 0; i < this.lm_request['member_count'] - 1; i++) {
                            Hdc_total += Number(objPremiumService["Dependants"]["0"]["Client"]["" + i + ""]['Product']["0"]['Product']['1']['GrossPremiumAmount']['0']);
                            protector_total += Number(objPremiumService["Dependants"]["0"]["Client"]["" + i + ""]['Product']["0"]['Product']['1']['GrossPremiumAmount']['0']);
                        }
                        premium_breakup.addon['addon_Hdc'] = Number(Hdc_total + premium_breakup.addon['addon_Hdc']);
                        premium_breakup.addon['addon_protector'] = Number(protector_total + premium_breakup.addon['addon_protector']);
                    }
                } else if ((this.lm_request['health_insurance_si'] >= 1000000 && objResponseJson['actualPlanName'].includes('Optima')) || this.lm_request['health_insurance_si'] >= 5000000) {
                    premium_breakup.addon['addon_ca'] = Number(objPremiumService["Product"]["0"]["Product"]["1"]['GrossPremiumAmount']["0"]);
                    premium_breakup.addon['addon_Hdc'] = Number(objPremiumService["Product"]["0"]["Product"]["2"]['GrossPremiumAmount']["0"]);
                    premium_breakup.addon['addon_Pa'] = Number(objPremiumService["Product"]["0"]["Product"]["3"]['GrossPremiumAmount']["0"]);
                    premium_breakup.addon['addon_protector'] = Number(objPremiumService["Product"]["0"]["Product"]["4"]['GrossPremiumAmount']["0"]);
                    if (this.lm_request['member_count'] > 1) {
                        for (var i = 0; i < this.lm_request['member_count'] - 1; i++) {
                            ca_total += Number(objPremiumService["Dependants"]["0"]["Client"]["" + i + ""]['Product']["0"]['Product']['1']['GrossPremiumAmount']['0']);
                            Hdc_total += Number(objPremiumService["Dependants"]["0"]["Client"]["" + i + ""]['Product']["0"]['Product']['2']['GrossPremiumAmount']['0']);
                            protector_total += Number(objPremiumService["Dependants"]["0"]["Client"]["" + i + ""]['Product']["0"]['Product']['3']['GrossPremiumAmount']['0']);
                        }
                        premium_breakup.addon['addon_ca'] = Number(ca_total + premium_breakup.addon['addon_ca']);
                        premium_breakup.addon['addon_Hdc'] = Number(Hdc_total + premium_breakup.addon['addon_Hdc']);
                        premium_breakup.addon['addon_protector'] = Number(protector_total + premium_breakup.addon['addon_protector']);
                    }
                } else if (this.lm_request['health_insurance_si'] < 1000000) {
                    premium_breakup.addon['addon_ci'] = Number(objPremiumService["Product"]["0"]["Product"]["1"]['GrossPremiumAmount']["0"]);
                    premium_breakup.addon['addon_Hdc'] = Number(objPremiumService["Product"]["0"]["Product"]["2"]['GrossPremiumAmount']["0"]);
                    premium_breakup.addon['addon_Pa'] = Number(objPremiumService["Product"]["0"]["Product"]["3"]['GrossPremiumAmount']["0"]);
                    premium_breakup.addon['addon_protector'] = Number(objPremiumService["Product"]["0"]["Product"]["4"]['GrossPremiumAmount']["0"]);
                    if (this.lm_request['member_count'] > 1) {
                        for (var i = 0; i < this.lm_request['member_count'] - 1; i++) {
                            ci_total += Number(objPremiumService["Dependants"]["0"]["Client"]["" + i + ""]['Product']["0"]['Product']['1']['GrossPremiumAmount']['0']);
                            Hdc_total += Number(objPremiumService["Dependants"]["0"]["Client"]["" + i + ""]['Product']["0"]['Product']['2']['GrossPremiumAmount']['0']);
                            protector_total += Number(objPremiumService["Dependants"]["0"]["Client"]["" + i + ""]['Product']["0"]['Product']['3']['GrossPremiumAmount']['0']);
                        }
                        premium_breakup.addon['addon_ci'] = ci_total + premium_breakup.addon['addon_ci'];
                        premium_breakup.addon['addon_Hdc'] = Number(Hdc_total + premium_breakup.addon['addon_Hdc']);
                        premium_breakup.addon['addon_protector'] = Number(protector_total + premium_breakup.addon['addon_protector']);
                    }
                } else {
                    premium_breakup.addon['addon_ca'] = Number(objPremiumService["Product"]["0"]["Product"]["1"]['GrossPremiumAmount']["0"]);
                    premium_breakup.addon['addon_ci'] = Number(objPremiumService["Product"]["0"]["Product"]["2"]['GrossPremiumAmount']["0"]);
                    premium_breakup.addon['addon_Hdc'] = Number(objPremiumService["Product"]["0"]["Product"]["3"]['GrossPremiumAmount']["0"]);
                    premium_breakup.addon['addon_Pa'] = Number(objPremiumService["Product"]["0"]["Product"]["4"]['GrossPremiumAmount']["0"]);
                    premium_breakup.addon['addon_protector'] = Number(objPremiumService["Product"]["0"]["Product"]["5"]['GrossPremiumAmount']["0"]);
                    if (this.lm_request['member_count'] > 1) {
                        for (var i = 0; i < this.lm_request['member_count'] - 1; i++) {
                            ca_total += Number(objPremiumService["Dependants"]["0"]["Client"]["" + i + ""]['Product']["0"]['Product']['1']['GrossPremiumAmount']['0']);
                            ci_total += Number(objPremiumService["Dependants"]["0"]["Client"]["" + i + ""]['Product']["0"]['Product']['2']['GrossPremiumAmount']['0']);
                            Hdc_total += Number(objPremiumService["Dependants"]["0"]["Client"]["" + i + ""]['Product']["0"]['Product']['3']['GrossPremiumAmount']['0']);
                            protector_total += Number(objPremiumService["Dependants"]["0"]["Client"]["" + i + ""]['Product']["0"]['Product']['4']['GrossPremiumAmount']['0']);
                        }
                        premium_breakup.addon['addon_ca'] = ca_total + premium_breakup.addon['addon_ca'];
                        premium_breakup.addon['addon_ci'] = ci_total + premium_breakup.addon['addon_ci'];
                        premium_breakup.addon['addon_Hdc'] = Number(Hdc_total + premium_breakup.addon['addon_Hdc']);
                        premium_breakup.addon['addon_protector'] = Number(protector_total + premium_breakup.addon['addon_protector']);
                    }
                }
            } else {
                premium_breakup['final_premium'] = objPremiumService["TotalPremium"]["0"];
                premium_breakup['service_tax'] = Number((premium_breakup['final_premium'] - 0) * 0.18);
                premium_breakup['net_premium'] = Number(premium_breakup['final_premium'] - premium_breakup['service_tax']);

                var arr_addon_checked = [];
                if (this.lm_request['addon_ca'] === "yes") {
                    arr_addon_checked.push("addon_ca");
                }
                if (this.lm_request['addon_ci'] === "yes") {
                    arr_addon_checked.push("addon_ci");
                }
                if (this.lm_request['addon_Hdc'] === "yes") {
                    arr_addon_checked.push("addon_Hdc");
                }
                if (this.lm_request['addon_Pa'] === "yes") {
                    arr_addon_checked.push("addon_Pa");
                }
                if (this.lm_request['addon_protector'] === "yes") {
                    arr_addon_checked.push("addon_protector");
                }
                premium_breakup.addon.addon_checked = arr_addon_checked;
            }
            premium_breakup['tax']['CGST'] = premium_breakup['service_tax'] / 2;
            premium_breakup['tax']['SGST'] = premium_breakup['service_tax'] / 2;
            objServiceHandler.Premium_Breakup = premium_breakup;
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
ApolloMunichHealth.prototype.customer_response_handler = function (objResponseJson) {
    console.log('ApolloMunichHealth', this.constructor.name, 'customer_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Customer': null
    };
    try {
        if (objResponseJson["Envelope"]["Body"]["0"].hasOwnProperty('ProposalCaptureResponse')) {
        } else if (objResponseJson["Envelope"]["Body"]["0"]["Fault"]["0"].hasOwnProperty('detail')) {
            if (objResponseJson["Envelope"]["Body"]["0"]["Fault"]["0"]["detail"]['0'].hasOwnProperty('ValidationFault')) {
                Error_Msg = objResponseJson["Envelope"]["Body"]["0"]["Fault"]["0"]["detail"]['0']['ValidationFault']["0"]["Details"]['0']['ValidationDetail']['0']['Message']['0'];
            } else if (objResponseJson["Envelope"]["Body"]["0"]["Fault"]["0"]["detail"]['0'].hasOwnProperty('ValidationDetail')) {
                Error_Msg = objResponseJson["Envelope"]["Body"]["0"]["Fault"]["0"]["detail"]['0']['ValidationDetail']['0']['Message']['0'];
            } else {
                Error_Msg = JSON.stringify(objResponseJson["Envelope"]["Body"]["0"]["Fault"]["0"]["detail"]['0']['ValidationDetail']['0']);
            }
        } else if (objResponseJson["Envelope"]["Body"]["0"]["Fault"]["0"].hasOwnProperty('faultstring')) {
            Error_Msg = objResponseJson["Envelope"]["Body"]["0"]["Fault"]["0"]["faultstring"]['0'];
        } else {
            Error_Msg = JSON.stringify(objResponseJson);
        }
//        Error_Msg = (this.prepared_request.hasOwnProperty('isNSTP') && this.prepared_request['isNSTP'] === 'yes') ? "Insured member(s) are not eligible" : Error_Msg;

        if (Error_Msg === 'NO_ERR') {
            var Customer = {
                'insurer_customer_identifier': objResponseJson["Envelope"]["Body"]["0"]["ProposalCaptureResponse"]["0"]["ProposalCaptureResult"]["0"],
                'insurer_customer_identifier_2': this.processed_request['___insurer_integration_agent_code___']
            };
            objServiceHandler.Customer = Customer;
            objServiceHandler.Insurer_Transaction_Identifier = objResponseJson["Envelope"]["Body"]["0"]["ProposalCaptureResponse"]["0"]["ProposalCaptureResult"]["0"];

            //for NSTP case
            if (this.processed_request['___insurer_integration_agent_code___'].includes('A')) {
                this.prepared_request['policy_id'] = Customer['insurer_customer_identifier'];
                this.processed_request['___policy_id___'] = this.prepared_request['policy_id'];

                var html_file_path = appRoot + "/resource/request_file/Health/ApolloMunich_Health_ProposalHtml.html";
                var html_file_name = this.constructor.name + '_' + Customer['insurer_customer_identifier'] + '_NSTP_Proposal.html';
                var replaced_html_file_path = appRoot + "/tmp/pdf/" + html_file_name;
                var html_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + html_file_name;
                var pdf_file_path = appRoot + "/tmp/pdf/" + this.constructor.name + '_' + Customer['insurer_customer_identifier'] + '_NSTP_Proposal.pdf';
                console.log("replaced_html_file_path : ", replaced_html_file_path);
                var htmlPol = fs.readFileSync(html_file_path, 'utf8');
                htmlPol = this.lm_request['adult_count'] === 2 ? htmlPol.toString().replaceAll("___temp_member", "___member") : htmlPol.toString().replaceAll("___temp_member_6", "___member_6");

                htmlPol = htmlPol.toString().replaceJson(this.processed_request);
                htmlPol = htmlPol.toString().replaceAll("//", "");

                fs.writeFileSync(replaced_html_file_path, htmlPol);
                sleep(4000);
                try {
                    var http = require('http');
//                    var insurer_pdf_url = "http://qa.policyboss.com:3000/html2pdf?o=download&u=http://qa-horizon.policyboss.com:3000/pdf-files/policy/ApolloMunichHealth_B117493525_NSTP_Proposal.html";
                    var insurer_pdf_url = "http://qa.policyboss.com:3000/html2pdf?o=download&u=" + html_web_path_portal;
                    var file_horizon = fs.createWriteStream(pdf_file_path);
                    http.get(insurer_pdf_url, function (response) {
                        response.pipe(file_horizon);
                        console.log("NSTP Proposal PDF success!!");
                    });
                } catch (e) {
                    console.error('NSTP PF Exception', this.constructor.name, 'customer_response_handler', e);
                }
            }
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
ApolloMunichHealth.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('ApolloMunichHealth', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    try {
        if (objResponseJson["Envelope"]["Body"]["0"].hasOwnProperty('PaymentDetailsResponse')) {

        } else {
            Error_Msg = JSON.stringify(objResponseJson);
        }
        if (Error_Msg === 'NO_ERR') {
            var pg_data = {
                'PaymentId': objResponseJson["Envelope"]["Body"]["0"]["PaymentDetailsResponse"]["0"]["PaymentDetailsResult"]["0"]["PaymentId"]["0"],
                'ProposalId': objResponseJson["Envelope"]["Body"]["0"]["PaymentDetailsResponse"]["0"]["PaymentDetailsResult"]["0"]["ProposalId"]["0"],
                'Responseurl': this.prepared_request['return_url']
            };
            objServiceHandler.Payment.pg_data = pg_data;
            this.const_payment_response.pg_data = pg_data;
            var pgUrl = objResponseJson["Envelope"]["Body"]["0"]["PaymentDetailsResponse"]["0"]["PaymentDetailsResult"]["0"]["PaymentUrl"]["0"];
            if (pgUrl.includes("http//")) {
                pgUrl = pgUrl.replace(/http/g, 'http:');
            } else if (pgUrl.includes("https//")) {
                pgUrl = pgUrl.replace(/https/g, 'https:');
            }
            objServiceHandler.Insurer_Transaction_Identifier = pg_data.ProposalId;
            objServiceHandler.Payment.pg_url = pgUrl;
            objServiceHandler.Payment.pg_redirect_mode = 'POST';
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'proposal_response_handler', objServiceHandler);


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
ApolloMunichHealth.prototype.pg_response_handler = function () {
    try {
        console.log('Start', this.constructor.name, 'pg_response_handler');
        var output = this.const_payment_response['pg_post'];
        if (output.hasOwnProperty('ResponseCode') && output['ResponseCode'] === '0') {
            this.const_policy.transaction_amount = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['final_premium'];
            this.const_policy.transaction_id = output['TransactionId'];
            this.const_policy.pg_status = "SUCCESS";
            this.const_policy.policy_number = output['ProposalId'];
            this.const_policy.policy_id = output['ApplicationNo'];
            this.const_policy.pg_reference_number_1 = output['PaymentId'];
            this.const_policy.pg_reference_number_2 = output['MerchantRefNo'];
        } else {
            this.const_policy.transaction_amount = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['final_premium'];
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
        console.error('End', this.constructor.name, 'pg_response_handler', this.const_policy);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
ApolloMunichHealth.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    try {
        if (this.const_policy.pg_status === 'FAIL') {

        } else {
            if (objResponseJson["Envelope"]["Body"][0]["VerifyTransactionResponse"][0].hasOwnProperty('VerifyTransactionResult'))
            {
                var paymentStatus = objResponseJson["Envelope"]["Body"][0]["VerifyTransactionResponse"][0]["VerifyTransactionResult"][0];
                if (paymentStatus === '0') {//transaction success
                    this.const_policy.pg_status = 'SUCCESS';
                    this.const_policy.transaction_status = 'SUCCESS';
                    this.const_policy.transaction_substatus = this.processed_request['___insurer_integration_agent_code___'].includes('A') ? 'UW' : 'IF';
                    var pdf_file_name = this.constructor.name + '_Health_' + this.const_policy.policy_number + '.pdf';
                    var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    this.const_policy.policy_url = pdf_web_path_portal;
                    var objInsurer = this;

                    var pdf_file_path = appRoot + "/tmp/pdf/" + this.constructor.name + '_' + this.const_policy.policy_id + '_NSTP_Proposal.pdf';
                    console.log("pdf_file_path : ", pdf_file_path);
                    if (fs.existsSync(pdf_file_path) && this.const_policy.transaction_substatus === 'UW') {
                        var stream = fs.createReadStream(pdf_file_path);
                        stream.on("data", function (data) {
                            console.log("Pdf data - ", data.toString('base64'));
                            var chunk = data.toString('base64');
                            sleep(8000);
                            console.log("Apollo nstp pdf - ", chunk);
                            var args = {
                                data: {
                                    "search_reference_number": objInsurer.lm_request['search_reference_number'],
                                    "api_reference_number": objInsurer.lm_request['api_reference_number'],
                                    "policy_number": objInsurer.const_policy.policy_number,
                                    "application_id": objInsurer.const_policy.policy_id,
                                    'client_key': objInsurer.lm_request['client_key'],
                                    'secret_key': objInsurer.lm_request['secret_key'],
                                    'insurer_id': objInsurer.lm_request['insurer_id'],
                                    'proposal_pdf': chunk,
                                    'method_type': 'Pdf',
                                    'execution_async': 'no'
                                },
                                headers: {
                                    "Content-Type": "application/json",
                                    'client_key': objInsurer.lm_request['client_key'],
                                    'secret_key': objInsurer.lm_request['secret_key']
                                }
                            };
                            objInsurer.pdf_call(config.environment.weburl + '/quote/pdf_initiate', args, pdf_file_path);
                        });
                    }
                } else
                {
                    this.const_policy.transaction_status = 'FAIL';
                    this.const_policy.pg_status = 'FAIL';
                }
            } else
            {
                this.const_policy.transaction_status = 'FAIL';
                this.const_policy.pg_status = 'FAIL';
                Error_Msg = JSON.stringify(objResponseJson);
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
ApolloMunichHealth.prototype.pdf_call = function (url, args, pdf_sys_loc) {
    var objInsurerProduct = this;
    objInsurerProduct.pdf_attempt++;
    var Client = require('node-rest-client').Client;
    var client = new Client();
    client.post(url, args, function (data, response) {
        if (data.Error_Code !== '' || true) {
            if (!fs.existsSync(pdf_sys_loc) && objInsurerProduct.pdf_attempt < 11) {
                sleep(600000);
                objInsurerProduct.pdf_call(url, args, pdf_sys_loc);
            }
        }
    });
};
ApolloMunichHealth.prototype.pdf_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'pdf_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    try {
        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null,
            'Policy': null
        };
        var policy = {
            'policy_url': null,
            'policy_number': this.lm_request['policy_number'],
            'pdf_status': null
        };
        if (objResponseJson["Envelope"]["Body"]["0"].hasOwnProperty('DocumentUploadResponse')) {
            if (objResponseJson["Envelope"]["Body"]["0"]['DocumentUploadResponse']['0']['DocumentUploadResult']['0']['DocumentUploadResult']['0'] === 'Success') {

            } else {
                Error_Msg = "Document Upload fail!";
            }
        } else {
            Error_Msg = JSON.stringify(objResponseJson);
        }
        if (Error_Msg === 'NO_ERR') {
            var pdf_file_name = this.constructor.name + '_Health_' + this.lm_request['policy_number'] + '.pdf';
            var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;

            policy.policy_url = pdf_web_path_portal;
            objServiceHandler.Insurer_Transaction_Identifier = this.lm_request['policy_number'];
        } else {
            policy.transaction_status = 'PAYPASS';
        }
        objServiceHandler.Policy = policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'pdf_response_handler', objServiceHandler);
        return objServiceHandler;
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'pdf_response_handler', ex);
    }

};
ApolloMunichHealth.prototype.premium_breakup_schema = {
    "net_premium": "premium",
    "CGST": "CGST",
    "SGST": "SGST",
    "service_tax": "serviceTax",
    "final_premium": "totalPremium"
};
ApolloMunichHealth.prototype.get_member_relation = function (i) {
    console.log(this.constructor.name, 'get_member_relation', ' Start Apollo');
    var gender = this.lm_request['member_' + i + '_gender'];
    console.log("Gender in Apollo " + gender);
    if (this.prepared_request["relation"] === '17' || this.prepared_request["relation"] === '20') {
        this.prepared_request['member_' + i + '_rel'] = gender === 'M' ? 'Father' : 'Mother';
        this.processed_request['___member_' + i + '_rel___'] = this.prepared_request['member_' + i + '_rel'];
        return(gender === 'M' ? '4' : '5');
    }
    if (this.prepared_request["relation"] === '4' || this.prepared_request["relation"] === '5') {
        this.prepared_request['member_' + i + '_rel'] = gender === 'M' ? 'Son' : 'Daughter';
        this.processed_request['___member_' + i + '_rel___'] = this.prepared_request['member_' + i + '_rel'];
        return(gender === 'M' ? '20' : '17');
    }
    if (this.prepared_request["relation"] === '14' || this.prepared_request["relation"] === '15') {
        this.prepared_request['member_' + i + '_rel'] = gender === 'M' ? 'Husband' : 'Wife';
        this.processed_request['___member_' + i + '_rel___'] = this.prepared_request['member_' + i + '_rel'];
        return(gender === 'M' ? '15' : '14');
    }
    if (this.prepared_request["relation"] === '1' || this.prepared_request["relation"] === '') {
        if (i >= 3) {
            this.prepared_request['member_' + i + '_rel'] = gender === 'M' ? 'Son' : 'Daughter';
            this.processed_request['___member_' + i + '_rel___'] = this.prepared_request['member_' + i + '_rel'];
            return(gender === 'M' ? '20' : '17');
        } else if (i === 1) {
            this.prepared_request['member_' + i + '_rel'] = 'Self';
            this.processed_request['___member_' + i + '_rel___'] = this.prepared_request['member_' + i + '_rel'];
            return '1';
        } else if (i === 2) {
            this.prepared_request['member_' + i + '_rel'] = gender === 'M' ? 'Husband' : 'Wife';
            this.processed_request['___member_' + i + '_rel___'] = this.prepared_request['member_' + i + '_rel'];
            return(gender === 'F' ? '14' : '15');
        }
    }

    return '';
    console.log(this.constructor.name, 'get_member_relation', 'End Apollo');
};
ApolloMunichHealth.prototype.get_nominee_relation = function () {
    if (this.prepared_request["nominee_relation"] === '17' || this.prepared_request["nominee_relation"] === '20') {
        this.prepared_request['nominee_rel'] = this.prepared_request["nominee_relation"] === '17' ? 'Son' : 'Daughter';
        this.processed_request['___nominee_rel___'] = this.prepared_request['nominee_rel'];
    } else if (this.prepared_request["nominee_relation"] === '4' || this.prepared_request["nominee_relation"] === '5') {
        this.prepared_request['nominee_rel'] = this.prepared_request["nominee_relation"] === '4' ? 'Father' : 'Mother';
        this.processed_request['___nominee_rel___'] = this.prepared_request['nominee_rel'];
    } else if (this.prepared_request["nominee_relation"] === '14' || this.prepared_request["nominee_relation"] === '15') {
        this.prepared_request['nominee_rel'] = this.prepared_request["nominee_relation"] === '15' ? 'Husband' : 'Wife';
        this.processed_request['___nominee_rel___'] = this.prepared_request['nominee_rel'];
    } else {
        this.prepared_request['nominee_rel'] = 'Self';
        this.processed_request['___nominee_rel___'] = 'Self';
    }
};
ApolloMunichHealth.prototype.get_marital_status = function () {
    if (this.processed_request["___marital___"] === '1') {
        this.prepared_request['marital_status'] = 'Married';
        this.processed_request['___marital_status___'] = this.prepared_request['marital_status'];
    } else if (this.processed_request["___marital___"] === '2') {
        this.prepared_request['marital_status'] = 'Single';
        this.processed_request['___marital_status___'] = this.prepared_request['marital_status'];
    } else if (this.processed_request["___marital___"] === '3') {
        this.prepared_request['marital_status'] = 'Widowed';
        this.processed_request['___marital_status___'] = this.prepared_request['marital_status'];
    } else if (this.processed_request["___marital___"] === '4') {
        this.prepared_request['marital_status'] = 'Divorced';
        this.processed_request['___marital_status___'] = this.prepared_request['marital_status'];
    } else {
        this.prepared_request['marital_status'] = 'Separated';
        this.processed_request['___marital_status___'] = this.prepared_request['marital_status'];
    }
};
ApolloMunichHealth.prototype.get_plan_version = function (Plan_Code) {
    var plan_details = {
        '11054': {
            'version': '1',
            'group': '1',
            'line': '2',
            'category': '1'
        },
        '11055': {
            'version': '1',
            'group': '1',
            'line': '2',
            'category': '1'
        },
        '11056': {
            'version': '1',
            'group': '1',
            'line': '2',
            'category': '1'
        },
        '11111': {
            'version': '1',
            'group': '1',
            'line': '2',
            'category': '1'
        },
        '11112': {
            'version': '1',
            'group': '1',
            'line': '2',
            'category': '1'
        },
        '11113': {
            'version': '1',
            'group': '1',
            'line': '2',
            'category': '1'
        },
        '11121': {
            'version': '1',
            'group': '1',
            'line': '9',
            'category': '1'
        },
        '11122': {
            'version': '1',
            'group': '1',
            'line': '9',
            'category': '1'
        },
        '11006': {
            'version': '1',
            'group': '1',
            'line': '2',
            'category': '1'
        },
        '11007': {
            'version': '1',
            'group': '1',
            'line': '2',
            'category': '1'
        },
        '11008': {
            'version': '1',
            'group': '1',
            'line': '2',
            'category': '1'
        },
        '11108': {
            'version': '1',
            'group': '1',
            'line': '2',
            'category': '1'
        },
        '11109': {
            'version': '1',
            'group': '1',
            'line': '2',
            'category': '1'
        },
        '11110': {
            'version': '1',
            'group': '1',
            'line': '2',
            'category': '1'
        },
        '11119': {
            'version': '1',
            'group': '1',
            'line': '9',
            'category': '1'
        },
        '11120': {
            'version': '1',
            'group': '1',
            'line': '9',
            'category': '1'
        }
    };
    return plan_details[Plan_Code];
};
ApolloMunichHealth.prototype.getSacCode = function () {
    var adult = this.lm_request['adult_count'];
    var child = this.lm_request['child_count'];
    var member = 1;
    for (member = 1; member <= adult; member++) {
        if (member === 1) {
            this.prepared_request['member_' + member + '_sac_code'] = 1;
            this.processed_request['___member_' + member + '_sac_code___'] = 1;
        } else
        {
            this.prepared_request['member_' + member + '_sac_code'] = 2;
            this.processed_request['___member_' + member + '_sac_code___'] = 2;
        }
    }
    for (member = 3; member <= child + 2; member++) {
        this.prepared_request['member_' + member + '_sac_code'] = 3;
        this.processed_request['___member_' + member + '_sac_code___'] = 3;
    }
};
ApolloMunichHealth.prototype.getPlanCode = function (code) {
    var plan_code = '';
    if (code === '11121') {
        plan_code = '11122';
    }
    if (code === '11054') {
        plan_code = '11111';
    }
    if (code === '11055') {
        plan_code = '11112';
    }
    if (code === '11056') {
        plan_code = '11113';
    }
    if (code === '11006') {
        plan_code = '11108';
    }
    if (code === '11007') {
        plan_code = '11109';
    }
    if (code === '11008') {
        plan_code = '11110';
    }
    if (code === '11119') {
        plan_code = '11120';
    }
    return plan_code;
};
ApolloMunichHealth.prototype.getAddonCode = function (code) {
    var ci = '';
    var protector = '';
    var hdc = '';
    if (code === '11054') {
        ci = 11018;
        protector = 11393;
        hdc = 11387;
    }
    if (code === '11055') {
        ci = 11026;
        protector = 11394;
        hdc = 11387;
    }
    if (code === '11056') {
        ci = 11027;
        protector = 11396;
        hdc = 11387;
    }
    if (code === '11111') {
        ci = 11150;
        protector = 11400;
        hdc = 11382;
    }
    if (code === '11112') {
        ci = 11117;
        protector = 11401;
        hdc = 11382;
    }
    if (code === '11113') {
        ci = 11118;
        protector = 11402;
        hdc = 11382;
    }
    if (code === '11006') {
        ci = 11019;
        protector = 11389;
        hdc = 22053;
    }
    if (code === '11007') {
        ci = 11024;
        protector = 11391;
        hdc = 22053;
    }
    if (code === '11008') {
        ci = 11025;
        protector = 11392;
        hdc = 22053;
    }
    if (code === '11109') {
        ci = 11114;
        protector = 11398;
        hdc = 22050;
    }
    if (code === '11110') {
        ci = 11115;
        protector = 11399;
        hdc = 22050;
    }
    if (code === '11119') {
        protector = 11403;
        hdc = 22053;
    }
    if (code === '11120') {
        protector = 11405;
        hdc = 22050;
    }
    if (code === '11121') {
        protector = 11404;
        hdc = 11387;
    }
    if (code === '11122') {
        protector = 11406;
        hdc = 11382;
    }
    this.prepared_request['addon_ci_code'] = ci;
    this.processed_request['___addon_ci_code___'] = this.prepared_request['addon_ci_code'];
    this.prepared_request['addon_hdc_code'] = hdc;
    this.processed_request['___addon_hdc_code___'] = this.prepared_request['addon_hdc_code'];
    this.prepared_request['addon_protector_code'] = protector;
    this.processed_request['___addon_protector_code___'] = this.prepared_request['addon_protector_code'];
};
ApolloMunichHealth.prototype.calculate_bmi = function (i) {
    var height = this.prepared_request['member_' + i + '_height'];
    var weight = this.prepared_request['member_' + i + '_weight'];

    var bmi = Number(((weight / height / height) * 10000).toFixed(2));
    this.prepared_request['member_' + i + '_bmi'] = bmi;
    this.processed_request['___member_' + i + '_bmi___'] = bmi;

};
ApolloMunichHealth.prototype.check_bmi = function (age, bmi) {
    if (age <= 15) {
        if (bmi <= 39 && bmi >= 12) {
            return "yes";
        } else {
            return "no";
        }
    } else {
        if (bmi < 29 && bmi >= 18) {
            return "yes";
        } else {
            return "no";
        }
    }
};
ApolloMunichHealth.prototype.get_proposal_datetime = function () {
    var moment = require('moment');
    var today = moment().utcOffset("+05:30");
    var proposal_date = today.format('YYYY-MM-DD');
    var proposal_time = today.format("HH:mm:ss");
    this.prepared_request['proposal_date'] = proposal_date;
    this.processed_request['___proposal_date___'] = proposal_date;
    this.prepared_request['proposal_time'] = proposal_time;
    this.processed_request['___proposal_time___'] = proposal_time;
};
ApolloMunichHealth.prototype.si_conditions = function (member) {
    if (this.lm_request['health_insurance_si'] < 1000000) {
        txt_replace = this.find_text_btw_key(this.method_content, '<!--Addon_CA_Start-->', '<!--Addon_CA_End-->', true);
        txt_replace1 = this.find_text_btw_key(this.method_content, '<!--Addon_ca_Start-->', '<!--Addon_ca_End-->', true);
        this.method_content = this.method_content.replaceAll(txt_replace, "");
        this.method_content = this.method_content.replaceAll(txt_replace1, "");
        if (this.lm_request['child_count'] !== '') {
            for (i = 1; i <= this.lm_request['child_count']; i++) {
                txt_replace = this.find_text_btw_key(this.method_content, '<!--Addon_CA_Start-->', '<!--Addon_CA_End-->', true);
                txt_replace1 = this.find_text_btw_key(this.method_content, '<!--Addon_ca_Start-->', '<!--Addon_ca_End-->', true);
                this.method_content = this.method_content.replaceAll(txt_replace, "");
                this.method_content = this.method_content.replaceAll(txt_replace1, "");
            }
        }
    } else {
        this.prepared_request['member_' + member + '_ca_si'] = 500000;
        this.processed_request['___member_' + member + '_ca_si___'] = this.prepared_request['member_' + member + '_ca_si'];
    }
    if (this.lm_request['health_insurance_si'] > 2000000) {
        this.prepared_request['member_' + member + '_pa_si'] = 10000000;
        this.processed_request['___member_' + member + '_pa_si___'] = this.prepared_request['member_' + member + '_pa_si'];
    } else {
        this.prepared_request['member_' + member + '_pa_si'] = this.lm_request['health_insurance_si'] * 5;
        this.processed_request['___member_' + member + '_pa_si___'] = this.prepared_request['member_' + member + '_pa_si'];
    }
    this.prepared_request['member_' + member + '_ci_si'] = this.prepared_request['health_insurance_si'];
    this.processed_request['___member_' + member + '_ci_si___'] = this.prepared_request['member_' + member + '_ci_si'];
    this.prepared_request['member_' + member + '_hdc_si'] = 1000;
    this.processed_request['___member_' + member + '_hdc_si___'] = this.prepared_request['member_' + member + '_hdc_si'];
    this.method_content = member > 1 ? this.method_content.replaceAll("___member_" + member + "_hdc_si___", 0) : this.method_content;
    this.prepared_request['member_' + member + '_protector_si'] = this.prepared_request['health_insurance_si'];
    this.processed_request['___member_' + member + '_protector_si___'] = this.prepared_request['member_' + member + '_protector_si'];
    this.method_content = member > 1 ? this.method_content.replaceAll("___member_" + member + "_protector_si___", 0) : this.method_content;
};
ApolloMunichHealth.prototype.multi_si_conditions = function (member) {
    if (this.prepared_request['member_' + member + '_si'] < 1000000) {
        txt_replace = this.find_text_btw_key(this.method_content, '<!--Addon_CA_Start-->', '<!--Addon_CA_End-->', true);
        txt_replace1 = this.find_text_btw_key(this.method_content, '<!--Addon_ca_Start-->', '<!--Addon_ca_End-->', true);
        this.method_content = this.method_content.replaceAll(txt_replace, "");
        this.method_content = this.method_content.replaceAll(txt_replace1, "");
        if (this.lm_request['child_count'] !== '') {
            for (i = 1; i <= this.lm_request['child_count']; i++) {
                txt_replace = this.find_text_btw_key(this.method_content, '<!--Addon_CA_Start-->', '<!--Addon_CA_End-->', true);
                txt_replace1 = this.find_text_btw_key(this.method_content, '<!--Addon_ca_Start-->', '<!--Addon_ca_End-->', true);
                this.method_content = this.method_content.replaceAll(txt_replace, "");
                this.method_content = this.method_content.replaceAll(txt_replace1, "");
            }
        }
    } else {
        this.prepared_request['member_' + member + '_ca_si'] = 500000;
        this.processed_request['___member_' + member + '_ca_si___'] = this.prepared_request['member_' + member + '_ca_si'];
    }
    if (this.prepared_request['member_' + member + '_si'] > 2000000) {
        this.prepared_request['member_' + member + '_pa_si'] = 10000000;
        this.processed_request['___member_' + member + '_pa_si___'] = this.prepared_request['member_' + member + '_pa_si'];
    } else {
        this.prepared_request['member_' + member + '_pa_si'] = this.prepared_request['member_' + member + '_si'] * 5;
        this.processed_request['___member_' + member + '_pa_si___'] = this.prepared_request['member_' + member + '_pa_si'];
    }
    this.prepared_request['member_' + member + '_ci_si'] = this.prepared_request['member_' + member + '_si'];
    this.processed_request['___member_' + member + '_ci_si___'] = this.prepared_request['member_' + member + '_ci_si'];
    this.prepared_request['member_' + member + '_hdc_si'] = 1000;
    this.processed_request['___member_' + member + '_hdc_si___'] = this.prepared_request['member_' + member + '_hdc_si'];
    this.prepared_request['member_' + member + '_protector_si'] = this.prepared_request['member_' + member + '_si'];
    this.processed_request['___member_' + member + '_protector_si___'] = this.prepared_request['member_' + member + '_protector_si'];
};
ApolloMunichHealth.prototype.replace_content = function () {
    if (this.lm_request['addon_ca'] === "no" || this.lm_request['health_insurance_si'] < 1000000) {
        txt_replace = this.find_text_btw_key(this.method_content, '<!--Addon_CA_Start-->', '<!--Addon_CA_End-->', true);
        txt_replace1 = this.find_text_btw_key(this.method_content, '<!--Addon_ca_Start-->', '<!--Addon_ca_End-->', true);
        this.method_content = this.method_content.replaceAll(txt_replace, "");
        this.method_content = this.method_content.replaceAll(txt_replace1, "");
        if (this.lm_request['child_count'] !== '') {
            for (i = 1; i <= this.lm_request['child_count']; i++) {
                txt_replace = this.find_text_btw_key(this.method_content, '<!--Addon_CA_Start-->', '<!--Addon_CA_End-->', true);
                txt_replace1 = this.find_text_btw_key(this.method_content, '<!--Addon_ca_Start-->', '<!--Addon_ca_End-->', true);
                this.method_content = this.method_content.replace(txt_replace, "");
                this.method_content = this.method_content.replace(txt_replace1, "");
            }
        }
    }
    if (this.lm_request['addon_ci'] === "no" || this.lm_request['health_insurance_si'] >= 5000000) {
        txt_replace = this.find_text_btw_key(this.method_content, '<!--Addon_CI_Start-->', '<!--Addon_CI_End-->', true);
        txt_replace1 = this.find_text_btw_key(this.method_content, '<!--Addon_ci_Start-->', '<!--Addon_ci_End-->', true);
        this.method_content = this.method_content.replace(txt_replace, "");
        this.method_content = this.method_content.replace(txt_replace1, "");
        if (this.lm_request['child_count'] !== '') {
            for (i = 1; i <= this.lm_request['child_count']; i++) {
                txt_replace = this.find_text_btw_key(this.method_content, '<!--Addon_CI_Start-->', '<!--Addon_CI_End-->', true);
                var txt_replace1 = this.find_text_btw_key(this.method_content, '<!--Addon_ci_Start-->', '<!--Addon_ci_End-->', true);
                this.method_content = this.method_content.replace(txt_replace, "");
                this.method_content = this.method_content.replace(txt_replace1, "");
            }
        }
    }
    if (this.lm_request['addon_Hdc'] === "no") {
        txt_replace = this.find_text_btw_key(this.method_content, '<!--Addon_HDC_Start-->', '<!--Addon_HDC_End-->', true);
        txt_replace1 = this.find_text_btw_key(this.method_content, '<!--Addon_hdc_Start-->', '<!--Addon_hdc_End-->', true);
        this.method_content = this.method_content.replace(txt_replace, "");
        this.method_content = this.method_content.replace(txt_replace1, "");
        if (this.lm_request['child_count'] !== '') {
            for (i = 1; i <= this.lm_request['child_count']; i++) {
                txt_replace = this.find_text_btw_key(this.method_content, '<!--Addon_HDC_Start-->', '<!--Addon_HDC_End-->', true);
                txt_replace1 = this.find_text_btw_key(this.method_content, '<!--Addon_hdc_Start-->', '<!--Addon_hdc_End-->', true);
                this.method_content = this.method_content.replace(txt_replace, "");
                this.method_content = this.method_content.replace(txt_replace1, "");
            }
        }
    }
    if (this.lm_request['addon_Pa'] === "no") {
        txt_replace = this.find_text_btw_key(this.method_content, '<!--Addon_pa_Start-->', '<!--Addon_pa_End-->', true);
        this.method_content = this.method_content.replace(txt_replace, "");
    }
    if (this.lm_request['addon_protector'] === "no") {
        txt_replace = this.find_text_btw_key(this.method_content, '<!--Addon_PROTECTOR_Start-->', '<!--Addon_PROTECTOR_End-->', true);
        txt_replace1 = this.find_text_btw_key(this.method_content, '<!--Addon_protector_Start-->', '<!--Addon_protector_End-->', true);
        this.method_content = this.method_content.replace(txt_replace, "");
        this.method_content = this.method_content.replace(txt_replace1, "");
        if (this.lm_request['child_count'] !== '') {
            for (i = 1; i <= this.lm_request['child_count']; i++) {
                txt_replace = this.find_text_btw_key(this.method_content, '<!--Addon_PROTECTOR_Start-->', '<!--Addon_PROTECTOR_End-->', true);
                txt_replace1 = this.find_text_btw_key(this.method_content, '<!--Addon_protector_Start-->', '<!--Addon_protector_End-->', true);
                this.method_content = this.method_content.replace(txt_replace, "");
                this.method_content = this.method_content.replace(txt_replace1, "");
            }
        }
    }
//        this.method_content = this.method_content.replaceAll(/<!--(.*?)-->/g, "");
//        this.method_content = this.method_content.replaceAll(/(^[ \t]*\n)/gm, '');
//        this.method_content = this.method_content.replaceAll(/^\s*$(?:\r\n?|\n)/gm, '');
};
ApolloMunichHealth.prototype.is_valid_plan = function (lm_request, planCode) {
    console.log('ApolloMunichHealth is_valid_plan', 'start');
    var index = -1;
    var cover_type = (lm_request.hasOwnProperty('multi_individual') && lm_request['multi_individual'] === "yes") ? 'individual' : lm_request['health_insurance_type'];
    var AM_Plans = [
        {'code': "11054", 'cover_type': 'floater', 'min_si': 400000, 'max_si': 1500000}, //floater standard
        {'code': "11055", 'cover_type': 'floater', 'min_si': 400000, 'max_si': 5000000}, //floater exclusive
        {'code': "11056", 'cover_type': 'floater', 'min_si': 400000, 'max_si': 5000000}, //floater premium
        {'code': "11121", 'cover_type': 'floater', 'min_si': 99000, 'max_si': 5000000}, //OR floater
        {'code': "11006", 'cover_type': 'individual', 'min_si': 400000, 'max_si': 1500000}, //indi standard
        {'code': "11007", 'cover_type': 'individual', 'min_si': 400000, 'max_si': 5000000}, //indi excl
        {'code': "11008", 'cover_type': 'individual', 'min_si': 400000, 'max_si': 5000000}, //indi premium
        {'code': "11119", 'cover_type': 'individual', 'min_si': 99000, 'max_si': 5000000}//OR indi
    ];
    index = AM_Plans.findIndex(x => x.cover_type === cover_type && x.code === planCode
                && x.min_si < (lm_request['health_insurance_si'] - 0)
                && x.max_si >= (lm_request['health_insurance_si'] - 0));
    return (index > -1 ? true : false);
    console.log('ApolloMunichHealth is_valid_plan', 'End');
};
ApolloMunichHealth.prototype.premium_breakup_schema = {
    "addon": {
        "addon_checked": 0,
        "addon_ca": 0,
        "addon_ci": 0,
        "addon_Hdc": 0,
        "addon_Pa": 0,
        "Dependant_addon_ca": 0,
        "Dependant_addon_ci": 0,
        "addon_protector": 0,
        "addon_ca_grossPremium": 0,
        "addon_ci_grossPremium": 0,
        "addon_Hdc_grossPremium": 0,
        "addon_Pa_grossPremium": 0,
        "addon_protector_grossPremium": 0,
        "addon_ca_basePremium": 0,
        "addon_ci_basePremium": 0,
        "addon_Hdc_basePremium": 0,
        "addon_Pa_basePremium": 0,
        "addon_protector_basePremium": 0,
        "addon_ca_taxAmount": 0,
        "addon_ci_taxAmount": 0,
        "addon_Hdc_taxAmount": 0,
        "addon_Pa_taxAmount": 0,
        "addon_protector_taxAmount": 0
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
module.exports = ApolloMunichHealth;