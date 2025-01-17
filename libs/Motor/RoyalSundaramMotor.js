/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var util = require('util');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var Motor = require(appRoot + '/libs/Motor');
var fs = require('fs');
var moment = require('moment');
var config = require('config');

function RoyalSundaramMotor() {}
util.inherits(RoyalSundaramMotor, Motor);

RoyalSundaramMotor.prototype.lm_request_single = {};
RoyalSundaramMotor.prototype.insurer_integration = {};
RoyalSundaramMotor.prototype.insurer_addon_list = [];
RoyalSundaramMotor.prototype.insurer = {};
RoyalSundaramMotor.prototype.insurer_date_format = 'dd/MM/yyyy';

RoyalSundaramMotor.prototype.insurer_product_api_pre = function () {};
RoyalSundaramMotor.prototype.insurer_product_field_process_pre = function () {
    try {
        let is_tp_only = false;
        if (this.prepared_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
            is_tp_only = true;
        } else if (this.prepared_request['vehicle_insurance_subtype'].indexOf('1OD') > -1) {
            is_tp_only = true;
        } else {
            is_tp_only = false;
        }

        if (is_tp_only && this.lm_request['is_breakin'] === 'yes') {
            if (this.lm_request['is_policy_exist'] === 'no') {
                this.method_content = this.method_content.replace('___dbmaster_previousinsurer_code___', '');
                this.method_content = this.method_content.replace('___policy_expiry_date___', '');
                this.method_content = this.method_content.replace('___previous_policy_number___', '');
                this.method_content = this.method_content.replace('___dbmster_insurername___', '');
                this.method_content = this.method_content.replace('___previous_insurer_address_1___,___previous_insurer_address_2___,___previous_insurer_address_3___', '');
                this.method_content = this.method_content.replace('<previousPolicyType>Comprehensive</previousPolicyType>', '<previousPolicyType></previousPolicyType>');
            }
        }

        var ch_flag = ((parseInt(((this.lm_request['vehicle_insurance_subtype']).split('CH'))[0]) > 0) ? true : false);
        this.processed_request['___Plan_Name___'] = this.prepared_request['Plan_Name'];
        if (this.lm_request['vehicle_insurance_type'] === 'new') {
            if (this.lm_request['method_type'] !== 'Verification' && this.lm_request['method_type'] !== 'Pdf') {
                var product_name = '';
                if (parseInt(this.lm_request['product_id']) === 1) {
                    product_name = 'Car';
                }
                if (parseInt(this.lm_request['product_id']) === 10) {
                    product_name = 'TW';
                }

                if (this.lm_request['method_type'] === 'Idv' || this.lm_request['method_type'] === 'Premium') {
                    this.method['Method_Request_File'] = "RoyalSundaram_" + product_name + "_Premium.json";
                }
                if (this.lm_request['method_type'] === 'Customer') {
                    this.method['Method_Request_File'] = "RoyalSundaram_" + product_name + "_Customer.json";
                }
                if (this.lm_request['method_type'] === 'Proposal') {
                    this.method['Method_Request_File'] = "RoyalSundaram_" + product_name + "_Proposal.json";
                }
                var method_content = fs.readFileSync(appRoot + '/resource/request_file/' + this.method.Method_Request_File).toString();
                this.method_content = method_content;
            }
        }

        if (this.lm_request.hasOwnProperty('is_pa_od') && this.lm_request['is_pa_od'] === 'yes') {
            this.prepared_request['is_pa_od'] = 'Yes';
            this.processed_request['___is_pa_od___'] = this.prepared_request['is_pa_od'];
        } else {
            this.prepared_request['is_pa_od'] = 'No';
            this.processed_request['___is_pa_od___'] = this.prepared_request['is_pa_od'];
        }

        //for posp case
        var posp_request_data = this.find_text_btw_key(this.method_content.toString(), '<!--POS_CONFIG_START-->', '<!--POS_CONFIG_FINISH-->', false);
        if (this.lm_request['is_posp'] === 'yes') {
            var obj_replace = {
                '___posp_mobile_no___': '8356844187'
            };
            if (Object.keys(obj_replace).length > 0) {
                this.method_content = this.method_content.toString().replaceJson(obj_replace);
            }
            if (this.lm_request['vehicle_insurance_type'] === 'renew') {
                this.method_content = this.method_content.replace('___is_posp_2___', 'Yes');
            }
            if (this.lm_request['vehicle_insurance_type'] === 'new') {
                this.method_content = this.method_content.replace('___is_posp_2___', 'true');
            }

            for (var k in this.lm_request) {
                if (k.indexOf('posp_') === 0) {
                    this.method_content = this.method_content.replace('___' + k + '___', this.lm_request[k]);
                }
            }
        } else {
            if (this.lm_request['vehicle_insurance_type'] === 'renew') {
                this.method_content = this.method_content.replace('___is_posp_2___', 'No');
            }
            if (this.lm_request['vehicle_insurance_type'] === 'new') {
                this.method_content = this.method_content.replace('___is_posp_2___', 'false');
            }
            this.method_content = this.method_content.replace(posp_request_data, '');
            this.method_content = this.method_content.replace('<!--POS_CONFIG_START-->', '');
            this.method_content = this.method_content.replace('<!--POS_CONFIG_FINISH-->', '');
        }


        if ((this.lm_request['vehicle_insurance_type'] === 'new') || (this.lm_request['vehicle_insurance_type'] === 'renew' && this.lm_request['is_claim_exists'] === 'yes')) {
            this.method_content = this.method_content.toString().replace('___addon_ncb_protection_cover_2___', 'false');
        }

        if (this.lm_request['vehicle_insurance_type'] === 'new' || (this.lm_request['vehicle_insurance_type'] === 'renew' && this.lm_request['is_claim_exists'] === 'no')) {
            this.prepared_request['claim_amount'] = '0';
            this.processed_request['___claim_amount___'] = this.prepared_request['claim_amount'];
        }

        if (this.lm_request['product_id'] === 1 || this.lm_request['product_id'] === 10) {
            var od_only_data = this.find_text_btw_key(this.method_content.toString(), '<!--OD_ONLY_START-->', '<!--OD_ONLY_FINISH-->', false);
            if (this.lm_request['vehicle_insurance_subtype'] === '1OD_0TP') {
                this.method_content = this.method_content.replace('___vehicle_insurance_subtype_2___', 'standalone');
                if (this.lm_request['method_type'] === 'Customer' || this.lm_request['method_type'] === 'Proposal') {
                    this.prepared_request['tp_policy_number'] = this.lm_request['tp_policy_number'];
                    this.processed_request['___tp_policy_number___'] = this.prepared_request['tp_policy_number'];
                    this.prepared_request['tp_start_date'] = this.insurer_dateFormat(this.lm_request['tp_start_date']);
                    this.processed_request['___tp_start_date___'] = this.prepared_request['tp_start_date'];
                    this.prepared_request['tp_end_date'] = this.insurer_dateFormat(this.lm_request['tp_end_date']);
                    this.processed_request['___tp_end_date___'] = this.prepared_request['tp_end_date'];
                    this.prepared_request['tp_insurer_code'] = this.insurer_master.tp_insurer.insurer_db_master['PreviousInsurer_Code']; //this.Master_Details.tp_insurer['Insurer_Name'];
                    this.processed_request['___tp_insurer_code___'] = this.prepared_request['tp_insurer_code'];
                    this.prepared_request['tp_insurer_address'] = this.Master_Details.tp_insurer['PreviousInsurer_Address']; //this.insurer_master.tp_insurer.insurer_db_master['PreviousInsurer_Address']; 
                    this.processed_request['___tp_insurer_address___'] = this.prepared_request['tp_insurer_address'];
                    this.prepared_request['tp_insurer_tenure'] = this.rstp_insurer_tenure();
                    this.processed_request['___tp_insurer_tenure___'] = this.prepared_request['tp_insurer_tenure'];
                }
                this.method_content = this.method_content.replace('<!--OD_ONLY_START-->', '');
                this.method_content = this.method_content.replace('<!--OD_ONLY_FINISH-->', '');
            } else {
                this.method_content = this.method_content.replace(od_only_data, '');
                this.method_content = this.method_content.replace('<!--OD_ONLY_START-->', '');
                this.method_content = this.method_content.replace('<!--OD_ONLY_FINISH-->', '');
            }
        }

        if (!ch_flag) {
            this.method_content = this.method_content.toString().replace('___policy_od_tenure___', '___policy_tp_tenure___');
        }

        if (this.lm_request['method_type'] === 'Idv') {
            var idv_replace = {
                'electrical_accessory': '0',
                'non_electrical_accessory': '0',
                'pa_unnamed_passenger_si': '0',
                'pa_paid_driver_si': '0',
                'voluntary_deductible': '0',
                "is_aai_member": "No",
                "addon_zero_dep_cover": "false",
                "addon_road_assist_cover": "false",
                "addon_ncb_protection_cover": "false",
                "addon_invoice_price_cover": "false",
                "addon_key_lock_cover": "false",
                "addon_windshield_cover": "false",
                "addon_engine_protector_cover": "false",
                "addon_tyre_coverage_cover": "false"
            };
            for (var key in idv_replace) {
                if (!this.insurer_lm_request.hasOwnProperty(key) || this.insurer_lm_request[key] === '' || this.insurer_lm_request[key] === '0' || this.insurer_lm_request[key] === 'undefined') {
                    var value = idv_replace[key];
                    this.method_content = this.method_content.toString().replace('___' + key + '___', value);
                }
            }
        }

        if (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Customer') {
            if (ch_flag || this.lm_request['vehicle_insurance_subtype'] === "1OD_0TP") {
                var first_step_flag = false;
                if (parseInt(this.prepared_request['vehicle_expected_idv']) === parseInt(this.prepared_request['vehicle_max_idv'])) {
                    first_step_flag = true;
                    this.method_content = this.method_content.replace('<idv>___vehicle_normal_idv___</idv>', '<idv>' + this.prepared_request['vehicle_normal_idv'] + '</idv>');
                    this.method_content = this.method_content.replace('<modified_idv_value>___vehicle_expected_idv___</modified_idv_value>', '<modified_idv_value>' + this.prepared_request['vehicle_expected_idv'] + '</modified_idv_value>');
                    this.method_content = this.method_content.replace('<original_idv>___vehicle_normal_idv___</original_idv>', '<original_idv>' + this.prepared_request['vehicle_normal_idv'] + '</original_idv>');
                    this.method_content = this.method_content.replace('<modify_your_idv>___vehicle_percent_idv___</modify_your_idv>', '<modify_your_idv>+15</modify_your_idv>');
                    this.method_content = this.method_content.replace('<discountIdvPercent>___vehicle_percent_idv___</discountIdvPercent>', '<discountIdvPercent>+15</discountIdvPercent>');
                }
                if (parseInt(this.prepared_request['vehicle_expected_idv']) === parseInt(this.prepared_request['vehicle_min_idv'])) {
                    first_step_flag = true;
                    this.method_content = this.method_content.replace('<idv>___vehicle_normal_idv___</idv>', '<idv>' + this.prepared_request['vehicle_normal_idv'] + '</idv>');
                    this.method_content = this.method_content.replace('<modified_idv_value>___vehicle_expected_idv___</modified_idv_value>', '<modified_idv_value>' + this.prepared_request['vehicle_expected_idv'] + '</modified_idv_value>');
                    this.method_content = this.method_content.replace('<original_idv>___vehicle_normal_idv___</original_idv>', '<original_idv>' + this.prepared_request['vehicle_normal_idv'] + '</original_idv>');
                    this.method_content = this.method_content.replace('<modify_your_idv>___vehicle_percent_idv___</modify_your_idv>', '<modify_your_idv>-10</modify_your_idv>');
                    this.method_content = this.method_content.replace('<discountIdvPercent>___vehicle_percent_idv___</discountIdvPercent>', '<discountIdvPercent>-10</discountIdvPercent>');
                }

                if (!first_step_flag) {
                    if (parseInt(this.prepared_request['vehicle_expected_idv']) !== parseInt(this.prepared_request['vehicle_normal_idv'])) {
                        var inc_dec_amount = '';
                        var inc_dec_percent = '';
                        var increase_flag = false;
                        var next_step_flag = false;
                        if ((parseInt(this.prepared_request['vehicle_expected_idv']) > parseInt(this.prepared_request['vehicle_normal_idv']))
                                && (parseInt(this.prepared_request['vehicle_expected_idv']) <= parseInt(this.prepared_request['vehicle_max_idv']))) {
                            increase_flag = true;
                            next_step_flag = true;
                            //inc_dec_amount = parseInt(this.prepared_request['vehicle_expected_idv']) - parseInt(this.prepared_request['vehicle_normal_idv']);
                            if (this.lm_request['method_type'] !== 'Customer') {
                                inc_dec_amount = parseInt(this.prepared_request['vehicle_expected_idv']) - parseInt(this.prepared_request['vehicle_normal_idv']);
                            } else {
                                inc_dec_amount = parseInt(this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['vehicle_expected_idv']) - parseInt(this.prepared_request['vehicle_normal_idv']);
                            }
                            inc_dec_percent = parseInt(inc_dec_amount) / parseInt(this.prepared_request['vehicle_normal_idv']) * 100;
                        }
                        if ((parseInt(this.prepared_request['vehicle_expected_idv']) < parseInt(this.prepared_request['vehicle_normal_idv']))
                                && (parseInt(this.prepared_request['vehicle_expected_idv']) >= parseInt(this.prepared_request['vehicle_min_idv']))) {
                            increase_flag = false;
                            next_step_flag = true;
                            //inc_dec_amount = parseInt(this.prepared_request['vehicle_normal_idv']) - parseInt(this.prepared_request['vehicle_expected_idv']);
                            if (this.lm_request['method_type'] !== 'Customer') {
                                inc_dec_amount = parseInt(this.prepared_request['vehicle_normal_idv']) - parseInt(this.prepared_request['vehicle_expected_idv']);
                            } else {
                                inc_dec_amount = parseInt(this.prepared_request['vehicle_normal_idv']) - parseInt(this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['vehicle_expected_idv']);
                            }
                            inc_dec_percent = parseInt(inc_dec_amount) / parseInt(this.prepared_request['vehicle_normal_idv']) * 100;
                        }
                        if (next_step_flag) {
                            var check_result = (inc_dec_percent - Math.floor(inc_dec_percent)) !== 0;
                            var percent_multiple = '';
                            if (check_result) {
                                inc_dec_percent = parseInt(inc_dec_percent);
                                if (increase_flag === true) {
                                    percent_multiple = (inc_dec_percent / 100) + 1;
                                    if (this.lm_request['method_type'] === 'Customer' && percent_multiple === 1) {
                                    } else {
                                        if (percent_multiple !== 0) {
                                            this.prepared_request['vehicle_expected_idv'] = (parseInt(parseInt(this.prepared_request['vehicle_normal_idv']) * percent_multiple));
                                            this.processed_request['___vehicle_expected_idv___'] = this.prepared_request['vehicle_expected_idv'];
                                        }
                                    }
                                } else {
                                    percent_multiple = (inc_dec_percent / 100);
                                    if (this.lm_request['method_type'] === 'Customer' && percent_multiple === 1) {
                                    } else {
                                        if (percent_multiple !== 0) {
                                            this.prepared_request['vehicle_expected_idv'] = (parseInt(this.prepared_request['vehicle_normal_idv'])) - (parseInt(parseInt(this.prepared_request['vehicle_normal_idv']) * percent_multiple));
                                            this.processed_request['___vehicle_expected_idv___'] = this.prepared_request['vehicle_expected_idv'];
                                        }
                                    }
                                }

                                if (percent_multiple !== 0) {
                                    if (this.insurer_lm_request.hasOwnProperty('vehicle_expected_idv')) {
                                        this.insurer_lm_request['vehicle_expected_idv'] = this.prepared_request['vehicle_expected_idv'];
                                    }
                                    if (this.lm_request.hasOwnProperty('vehicle_expected_idv')) {
                                        this.lm_request['vehicle_expected_idv'] = this.prepared_request['vehicle_expected_idv'];
                                    }
                                    if (this.docRequest.Request_Core.hasOwnProperty('vehicle_expected_idv')) {
                                        this.docRequest.Request_Core['vehicle_expected_idv'] = this.prepared_request['vehicle_expected_idv'];
                                    }
                                    if (this.docRequest.Request_Product.hasOwnProperty('vehicle_expected_idv')) {
                                        this.docRequest.Request_Product['vehicle_expected_idv'] = this.prepared_request['vehicle_expected_idv'];
                                    }
                                    if (this.method_processed_request.hasOwnProperty('vehicle_expected_idv')) {
                                        this.method_processed_request['vehicle_expected_idv'] = this.prepared_request['vehicle_expected_idv'];
                                    }
                                }
                            }

                            if (percent_multiple !== 0) {
                                if (increase_flag === true) {
                                    inc_dec_percent = '+' + parseInt(inc_dec_percent);
                                } else {
                                    inc_dec_percent = '-' + parseInt(inc_dec_percent);
                                }
                                this.method_content = this.method_content.replace('<idv>___vehicle_normal_idv___</idv>', '<idv>' + this.prepared_request['vehicle_normal_idv'] + '</idv>');
                                this.method_content = this.method_content.replace('<modified_idv_value>___vehicle_expected_idv___</modified_idv_value>', '<modified_idv_value>' + this.prepared_request['vehicle_expected_idv'] + '</modified_idv_value>');
                                this.method_content = this.method_content.replace('<modify_your_idv>___vehicle_percent_idv___</modify_your_idv>', '<modify_your_idv>' + inc_dec_percent + '</modify_your_idv>');
                                this.method_content = this.method_content.replace('<discountIdvPercent>___vehicle_percent_idv___</discountIdvPercent>', '<discountIdvPercent>' + inc_dec_percent + '</discountIdvPercent>');
                                this.method_content = this.method_content.replace('<original_idv>___vehicle_normal_idv___</original_idv>', '<original_idv>' + this.prepared_request['vehicle_normal_idv'] + '</original_idv>');
                            } else {
                                this.method_content = this.method_content.replace('<idv>___vehicle_normal_idv___</idv>', '<idv>' + this.prepared_request['vehicle_normal_idv'] + '</idv>');
                                this.method_content = this.method_content.replace('<modified_idv_value>___vehicle_expected_idv___</modified_idv_value>', '<modified_idv_value></modified_idv_value>');
                                this.method_content = this.method_content.replace('<modify_your_idv>___vehicle_percent_idv___</modify_your_idv>', '<modify_your_idv></modify_your_idv>');
                                this.method_content = this.method_content.replace('<discountIdvPercent>___vehicle_percent_idv___</discountIdvPercent>', '<discountIdvPercent></discountIdvPercent>');
                                this.method_content = this.method_content.replace('<original_idv>___vehicle_normal_idv___</original_idv>', '<original_idv>0</original_idv>');
                            }
                        } else {
                            this.method_content = "LM_ERROR_MSG : IDV OUT OF RANGE -10% (MIN) TO +15% (MAX) ARE ONLY ALLOWED";
                            console.log(this.method_content);
                        }
                    } else {
                        this.method_content = this.method_content.replace('<idv>___vehicle_normal_idv___</idv>', '<idv>' + this.prepared_request['vehicle_expected_idv'] + '</idv>');
                        this.method_content = this.method_content.replace('<modified_idv_value>___vehicle_expected_idv___</modified_idv_value>', '<modified_idv_value></modified_idv_value>');
                        this.method_content = this.method_content.replace('<modify_your_idv>___vehicle_percent_idv___</modify_your_idv>', '<modify_your_idv></modify_your_idv>');
                        this.method_content = this.method_content.replace('<discountIdvPercent>___vehicle_percent_idv___</discountIdvPercent>', '<discountIdvPercent></discountIdvPercent>');
                        this.method_content = this.method_content.replace('<original_idv>___vehicle_normal_idv___</original_idv>', '<original_idv>0</original_idv>');
                    }
                }
            } else {
                this.method_content = this.method_content.replace('<idv>___vehicle_normal_idv___</idv>', '<idv>0</idv>');
                this.method_content = this.method_content.replace('<modified_idv_value>___vehicle_expected_idv___</modified_idv_value>', '<modified_idv_value></modified_idv_value>');
                this.method_content = this.method_content.replace('<modify_your_idv>___vehicle_percent_idv___</modify_your_idv>', '<modify_your_idv></modify_your_idv>');
                this.method_content = this.method_content.replace('<discountIdvPercent>___vehicle_percent_idv___</discountIdvPercent>', '<discountIdvPercent></discountIdvPercent>');
                this.method_content = this.method_content.replace('<original_idv>___vehicle_normal_idv___</original_idv>', '<original_idv>0</original_idv>');
            }
        }

        if (this.lm_request['product_id'] === 1 && this.lm_request['method_type'] === 'Premium' && this.prepared_request['Plan_Name'] === "All-Addon") {
            if (this.lm_request['vehicle_insurance_type'] === 'new') {
                if ((parseInt(this.prepared_request['vehicle_age_year']) <= 5) && (this.prepared_request['addon_zero_dep_cover'] === "yes")) {
                    this.method_content = this.method_content.replace('___addon_zero_dep_cover___', 'true');
                } else {
                    this.method_content = this.method_content.replace('___addon_zero_dep_cover___', 'false');
                }
                if ((parseInt(this.prepared_request['vehicle_age_year']) <= 5) && (this.prepared_request['addon_key_lock_cover'] === "yes")) {
                    this.method_content = this.method_content.replace('___addon_key_lock_cover___', 'true');
                } else {
                    this.method_content = this.method_content.replace('___addon_key_lock_cover___', 'false');
                }
                if ((parseInt(this.prepared_request['vehicle_age_year']) <= 3) && (this.prepared_request['addon_windshield_cover'] === "yes")) {
                    this.method_content = this.method_content.replace('___addon_windshield_cover___', 'true');
                    this.method_content = this.method_content.replace('___addon_windshield_cover_2___', 'on');
                } else {
                    this.method_content = this.method_content.replace('___addon_windshield_cover___', 'false');
                    this.method_content = this.method_content.replace('___addon_windshield_cover_2___', 'off');
                }
                if ((parseInt(this.prepared_request['vehicle_age_year']) <= 7) && (this.prepared_request['addon_tyre_coverage_cover'] === "yes")) {
                    this.method_content = this.method_content.replace('___addon_tyre_coverage_cover___', 'true');
                    this.method_content = this.method_content.replace('___addon_tyre_coverage_cover_2___', 'Yes');
                } else {
                    this.method_content = this.method_content.replace('___addon_tyre_coverage_cover___', 'false');
                    this.method_content = this.method_content.replace('___addon_tyre_coverage_cover_2___', 'No');
                }
            }
            if (this.lm_request['vehicle_insurance_type'] === 'renew') {
                if ((parseInt(this.prepared_request['vehicle_age_year']) <= 10) && (this.prepared_request['addon_zero_dep_cover'] === "yes")) {
                    this.method_content = this.method_content.replace('___addon_zero_dep_cover___', 'true');
                } else {
                    this.method_content = this.method_content.replace('___addon_zero_dep_cover___', 'false');
                }
                if ((parseInt(this.prepared_request['vehicle_age_year']) <= 10) && (this.prepared_request['addon_windshield_cover'] === "yes")) {
                    this.method_content = this.method_content.replace('___addon_windshield_cover___', 'true');
                    this.method_content = this.method_content.replace('___addon_windshield_cover_2___', 'on');
                } else {
                    this.method_content = this.method_content.replace('___addon_windshield_cover___', 'false');
                    this.method_content = this.method_content.replace('___addon_windshield_cover_2___', 'off');
                }
                if ((parseInt(this.prepared_request['vehicle_age_year']) <= 10) && (this.prepared_request['addon_key_lock_cover'] === "yes")) {
                    this.method_content = this.method_content.replace('___addon_key_lock_cover___', 'true');
                } else {
                    this.method_content = this.method_content.replace('___addon_key_lock_cover___', 'false');
                }
                if ((parseInt(this.prepared_request['vehicle_age_year']) <= 15) && (this.prepared_request['addon_tyre_coverage_cover'] === "yes")) {
                    this.method_content = this.method_content.replace('___addon_tyre_coverage_cover___', 'true');
                    this.method_content = this.method_content.replace('___addon_tyre_coverage_cover_2___', 'Yes');
                } else {
                    this.method_content = this.method_content.replace('___addon_tyre_coverage_cover___', 'false');
                    this.method_content = this.method_content.replace('___addon_tyre_coverage_cover_2___', 'No');
                }
            }
            if ((parseInt(this.prepared_request['vehicle_age_year']) <= 4) && (this.prepared_request['addon_invoice_price_cover'] === "yes")) {
                this.method_content = this.method_content.replace('___addon_invoice_price_cover___', 'true');
            } else {
                this.method_content = this.method_content.replace('___addon_invoice_price_cover___', 'false');
            }
            if ((parseInt(this.prepared_request['vehicle_age_year']) <= 10) && (this.prepared_request['addon_ncb_protection_cover'] === "yes")) {
                this.method_content = this.method_content.replace('___addon_ncb_protection_cover_2___', 'true');
            } else {
                this.method_content = this.method_content.replace('___addon_ncb_protection_cover_2___', 'false');
            }
        }

        if (this.lm_request['is_aai_member'] === 'yes') {
            this.prepared_request['is_aai_member'] = "Yes";
            this.processed_request['___is_aai_member___'] = this.prepared_request['is_aai_member'];
        }
        if (this.lm_request['is_aai_member'] === 'no') {
            this.prepared_request['is_aai_member'] = "No";
            this.processed_request['___is_aai_member___'] = this.prepared_request['is_aai_member'];
        }

        this.prepared_request['policy_end_date'] = this.policy_end_date_2();
        this.processed_request['___policy_end_date___'] = this.prepared_request['policy_end_date'];

        if (this.lm_request['vehicle_insurance_type'] === 'new' && this.lm_request['is_claim_exists'] === 'yes') {
            this.prepared_request['vehicle_ncb_current_2'] = '0';
            this.processed_request['___vehicle_ncb_current_2___'] = this.prepared_request['vehicle_ncb_current_2'];
        }

        if (this.lm_request['method_type'] === 'Idv' || this.lm_request['method_type'] === 'Premium') {
            if (this.lm_request['vehicle_registration_type'] === 'corporate') {
                this.prepared_request['company_name'] = 'LIBPL';
                this.processed_request['___company_name___'] = this.prepared_request['company_name'];
                this.method_content = this.method_content.replace('___company_name___', 'LIBPL');
            } else {
                this.prepared_request['company_name'] = '';
                this.processed_request['___company_name___'] = this.prepared_request['company_name'];
                this.method_content = this.method_content.replace('___company_name___', '');
            }
        }

        if (this.lm_request['method_type'] === 'Customer') {
            if (this.lm_request['vehicle_registration_type'] === 'corporate') {
                this.prepared_request['salutation'] = 'Ms';
                this.processed_request['___salutation___'] = this.prepared_request['salutation'];
                this.method_content = this.method_content.replace('___salutation___', 'Ms');
                this.method_content = this.method_content.replace('___company_name___', this.lm_request['company_name']);
            }
            if (this.lm_request['is_reg_addr_comm_addr_same'] === "no") {
                this.prepared_request['is_reg_addr_comm_addr_same'] = 'No';
                this.processed_request['___is_reg_addr_comm_addr_same___'] = this.prepared_request['is_reg_addr_comm_addr_same'];
                this.method_content = this.method_content.replace('___is_reg_addr_comm_addr_same___', 'No');
            } else {
                this.prepared_request['is_reg_addr_comm_addr_same'] = 'Yes';
                this.processed_request['___is_reg_addr_comm_addr_same___'] = this.prepared_request['is_reg_addr_comm_addr_same'];
                this.method_content = this.method_content.replace('___is_reg_addr_comm_addr_same___', 'Yes');
            }
        }
        if (this.lm_request['method_type'] === 'Idv' || this.lm_request['method_type'] === 'Premium') {
            if (this.lm_request['vehicle_insurance_type'] === 'renew') {
                this.method_content = this.method_content.replace('___is_valid_pucc___', 'Yes');
            } else {
                this.method_content = this.method_content.replace('___is_valid_pucc___', 'No');
            }
        }
        if (this.lm_request['method_type'] === 'Proposal' || this.lm_request['method_type'] === 'Customer') {
            if (this.lm_request.hasOwnProperty('is_valid_pucc') && this.lm_request['is_valid_pucc'] === "yes") {
                this.prepared_request['is_valid_pucc'] = "Yes";
                this.processed_request['___is_valid_pucc___'] = this.prepared_request['is_valid_pucc'];
                this.prepared_request['pucc_number'] = this.lm_request['pucc_number'];
                this.processed_request['___pucc_number___'] = this.prepared_request['pucc_number'];
                this.prepared_request['pucc_end_date'] = this.lm_request['pucc_end_date'].replaceAll('-', '/');
                this.processed_request['___pucc_end_date___'] = this.prepared_request['pucc_end_date'];
            } else if (this.lm_request.hasOwnProperty('is_valid_pucc') && this.lm_request['is_valid_pucc'] === "no") {
                this.prepared_request['is_valid_pucc'] = "No";
                this.processed_request['___is_valid_pucc___'] = this.prepared_request['is_valid_pucc'];
                this.prepared_request['pucc_number'] = "";
                this.processed_request['___pucc_number___'] = this.prepared_request['pucc_number'];
                this.prepared_request['pucc_end_date'] = "";
                this.processed_request['___pucc_end_date___'] = this.prepared_request['pucc_end_date'];
            } else {
            }
        }

        if (this.lm_request['vehicle_insurance_type'] === 'new' && this.lm_request['product_id'] === 1 && this.lm_request['method_type'] === 'Customer') {
            this.method_content = this.method_content.replace('"quoteId": "__dbmaster_insurer_transaction_identifier___"', '"quoteId": "___dbmaster_insurer_transaction_identifier___"');
        }
        if (this.lm_request['vehicle_insurance_type'] === 'new' && this.lm_request['product_id'] === 10 && (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Customer')) {
            this.method_content = this.method_content.replace('quoteId":', '"quoteId":');
        }
        if (this.lm_request['vehicle_insurance_type'] === 'new' && this.lm_request['method_type'] === 'Proposal') {
            this.method_content = this.method_content.replace('authenticatinDetails', 'authenticationDetails');
            this.method_content = this.method_content.replace('authentcationDetails', 'authenticationDetails');
        }
        if (this.lm_request['vehicle_insurance_type'] === "renew" && this.lm_request['product_id'] === 10 && (this.lm_request['method_type'] === 'Idv' || this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Customer')) {
            if (this.processed_request['___pa_unnamed_passenger_si___'] === "200000" && this.processed_request['___pa_unnamed_passenger_si___'] !== "" && this.processed_request['___pa_unnamed_passenger_si___'] !== null && this.processed_request['___pa_unnamed_passenger_si___'] !== "undefined") {
                this.prepared_request['pa_unnamed_passenger_si'] = "";
                this.processed_request['___pa_unnamed_passenger_si___'] = this.prepared_request['pa_unnamed_passenger_si'];
            }
            if (this.lm_request['is_tppd'] === "yes") {
                this.prepared_request['tppd_si'] = 6000;
                this.processed_request['___tppd_si___'] = this.prepared_request['tppd_si'];
                this.method_content = this.method_content.replace('___tppd_si___', '6000');
            } else {
                this.prepared_request['tppd_si'] = "";
                this.processed_request['___tppd_si___'] = this.prepared_request['tppd_si'];
                this.method_content = this.method_content.replace('___tppd_si___', '');
            }
        } else {
            this.prepared_request['tppd_si'] = "";
            this.processed_request['___tppd_si___'] = this.prepared_request['tppd_si'];
            this.method_content = this.method_content.replace('___tppd_si___', '');
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_product_field_process_pre', ex);
    }
};
RoyalSundaramMotor.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {
    var product_id = objProduct.db_specific_product.Product_Id;
    var insurer_id = Insurer_Object.Insurer_ID;
    var error_msg = 'NO_ERROR';
    var obj_response_handler;
    if (specific_insurer_object.method.Method_Type === 'Premium') {
        obj_response_handler = this.premium_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Idv') {
        obj_response_handler = this.idv_response_handler(objResponseJson);
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
RoyalSundaramMotor.prototype.insurer_product_field_process_post = function () {};
RoyalSundaramMotor.prototype.insurer_product_api_post = function () {};
RoyalSundaramMotor.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    try {
        let objInsurerProduct = this;
        let product_id = objProduct.db_specific_product.Product_Id;
        const http = require('http');
        const https = require('https');
        let Client = require('node-rest-client').Client;
        let client = new Client();
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

        if (specific_insurer_object.method.Method_Type === 'Idv') {
            let comp_flag = ((parseInt(((this.lm_request['vehicle_insurance_subtype']).split('CH'))[0]) > 0) ? true : false);
            if (comp_flag || this.lm_request['vehicle_insurance_subtype'] === "1OD_0TP") {
                docLog.Insurer_Request = docLog.Insurer_Request.replace('<idv>___vehicle_normal_idv___</idv>', '<idv>' + this.prepared_request['vehicle_expected_idv'] + '</idv>');
                docLog.Insurer_Request = docLog.Insurer_Request.replace('<modified_idv_value>___vehicle_expected_idv___</modified_idv_value>', '<modified_idv_value></modified_idv_value>');
                docLog.Insurer_Request = docLog.Insurer_Request.replace('<modify_your_idv>___vehicle_percent_idv___</modify_your_idv>', '<modify_your_idv></modify_your_idv>');
                docLog.Insurer_Request = docLog.Insurer_Request.replace('<discountIdvPercent>___vehicle_percent_idv___</discountIdvPercent>', '<discountIdvPercent></discountIdvPercent>');
                docLog.Insurer_Request = docLog.Insurer_Request.replace('<original_idv>___vehicle_normal_idv___</original_idv>', '<original_idv>' + this.prepared_request['vehicle_expected_idv'] + '</original_idv>');
                docLog.Insurer_Request = docLog.Insurer_Request.replace('<hdnTyreCover>___addon_tyre_coverage_cover___</hdnTyreCover>', '<hdnTyreCover>false</hdnTyreCover>');
            } else {
                docLog.Insurer_Request = docLog.Insurer_Request.replace('<idv>___vehicle_normal_idv___</idv>', '<idv>0</idv>');
                docLog.Insurer_Request = docLog.Insurer_Request.replace('<modified_idv_value>___vehicle_expected_idv___</modified_idv_value>', '<modified_idv_value></modified_idv_value>');
                docLog.Insurer_Request = docLog.Insurer_Request.replace('<modify_your_idv>___vehicle_percent_idv___</modify_your_idv>', '<modify_your_idv></modify_your_idv>');
                docLog.Insurer_Request = docLog.Insurer_Request.replace('<discountIdvPercent>___vehicle_percent_idv___</discountIdvPercent>', '<discountIdvPercent></discountIdvPercent>');
                docLog.Insurer_Request = docLog.Insurer_Request.replace('<original_idv>___vehicle_normal_idv___</original_idv>', '<original_idv>0</original_idv>');
                docLog.Insurer_Request = docLog.Insurer_Request.replace('<hdnTyreCover>___addon_tyre_coverage_cover___</hdnTyreCover>', '<hdnTyreCover>false</hdnTyreCover>');
            }
        }

        let args = {};
        if (specific_insurer_object.method.Method_Type === 'Pdf') {
            let quoteId = objInsurerProduct.lm_request['pg_reference_number_1'];
            let proposerDob = objInsurerProduct.lm_request['pg_reference_number_3'];
            let expiryDate = objInsurerProduct.lm_request['pg_reference_number_2'];

            //https://dtcdocstag.royalsundaram.in/Services/Mailer/DownloadPdf?quoteId=QVMN0098875&force=true&proposerDob=13/07/1994&expiryDate=26/07/2021
            let service_call_url = specific_insurer_object.method_file_url + '?quoteId=' + quoteId + '&force=true&proposerDob=' + proposerDob + '&expiryDate=' + expiryDate;
            args = {
                headers: {
                    "Content-Type": "application/json"
                }};
            console.error("royalSundaram_motor_pdf", 'service_call_url', service_call_url);
            client.get(service_call_url, args, function (service_data, service_response) {
                let objResponseFull = {
                    'err': null,
                    'result': service_data,
                    'raw': null,
                    'soapHeader': null,
                    'objResponseJson': service_data
                };
                let serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
            });
        } else {
            if (objInsurerProduct.lm_request['vehicle_insurance_type'] === 'new') {
                docLog.Insurer_Request = docLog.Insurer_Request.replace('isprodutcheck', 'isproductcheck');
                docLog.Insurer_Request = docLog.Insurer_Request.replace('{\n    isproductcheck', '{\n    "isproductcheck');
                args = {
                    data: docLog.Insurer_Request,
                    headers: {
                        "Content-Type": "application/json",
                        'accept': '*/*'
                                //"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
                    }
                };
            }
            if (objInsurerProduct.lm_request['vehicle_insurance_type'] === 'renew') {
                args = {
                    data: docLog.Insurer_Request,
                    headers: {
                        "Content-Type": "application/xml",
                        'accept': '*/*'
                                //"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8"
                    }
                };
            }
            console.log("RoyalSundaramMotor service_call request : =====", args);
            let service_url = specific_insurer_object.method_file_url + specific_insurer_object.method.Method_Action;
            /* 
             let service_url;
             if(this.lm_request['vehicle_insurance_type'] === 'renew' && this.lm_request['product_id'] === 10 && this.lm_request['vehicle_insurance_subtype'] === '1OD_0TP' && this.lm_request['method_type'] === 'Customer'){
             let quoteId=this.prepared_request.dbmaster_insurer_transaction_identifier;
             service_url = specific_insurer_object.method_file_url + specific_insurer_object.method.Method_Action+'?quoteId=' + quoteId;
             }else{
             service_url = specific_insurer_object.method_file_url + specific_insurer_object.method.Method_Action;
             }
             */
            client.post(service_url, args, function (data, response) {
                console.log("RoyalSundaramMotor service_call response : =====", data);
                let objResponseFull = {
                    'err': null,
                    'result': null,
                    'raw': JSON.stringify(data),
                    'soapHeader': null,
                    'objResponseJson': data
                };
                let serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                if (specific_insurer_object.method.Method_Type === 'Idv') {
                    objInsurerProduct.insurer_vehicle_idv_handler(serviceBreakup, objProduct, Insurer_Object, specific_insurer_object);
                }
            });
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};

RoyalSundaramMotor.prototype.idv_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'idv_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson.hasOwnProperty('PREMIUMDETAILS')) {
            if (objResponseJson['PREMIUMDETAILS'].hasOwnProperty('Status')) {
                if (objResponseJson['PREMIUMDETAILS']['Status']['StatusCode'] === 'S-0002') {

                } else {
                    Error_Msg = JSON.stringify(objResponseJson['PREMIUMDETAILS']['Status']);
                }
            } else {
                Error_Msg = 'LM_EMPTY_STATUS';
            }
        } else {
            Error_Msg = 'LM_EMPTY_PREMIUMDETAILS';
        }
        if (Error_Msg === 'NO_ERR') {
            var Idv_Breakup = this.get_const_idv_breakup();
            var objPremiumService = objResponseJson['PREMIUMDETAILS'];
            Idv_Breakup["Idv_Normal"] = objPremiumService['DATA']['IDV'] - 0;
            Idv_Breakup["Idv_Min"] = Math.round(Idv_Breakup["Idv_Normal"] * 0.90);
            Idv_Breakup["Idv_Max"] = Math.round(Idv_Breakup["Idv_Normal"] * 1.15);
            Idv_Breakup["Exshowroom"] = 0;
            objServiceHandler.Premium_Breakup = Idv_Breakup;
            objServiceHandler.Insurer_Transaction_Identifier = '';

        }
        objServiceHandler.Error_Msg = Error_Msg;
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'idv_response_handler', ex);
    }
    console.log('Finish', this.constructor.name, 'idv_response_handler', objServiceHandler);
    return objServiceHandler;
};
RoyalSundaramMotor.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';

    try {
        //check error start        
        console.log(objPremiumService);
        if (objResponseJson.hasOwnProperty('PREMIUMDETAILS')) {
            if (objResponseJson['PREMIUMDETAILS'].hasOwnProperty('Status')) {
                if (objResponseJson['PREMIUMDETAILS']['Status']['StatusCode'] === 'S-0002') {

                } else {
                    Error_Msg = JSON.stringify(objResponseJson['PREMIUMDETAILS']['Status']);
                }
            } else {
                Error_Msg = 'LM_EMPTY_STATUS';
            }
        } else {
            Error_Msg = 'LM_EMPTY_PREMIUMDETAILS';
        }
        //check error stop

        if (Error_Msg === 'NO_ERR') {
            var objPremiumService = objResponseJson['PREMIUMDETAILS'];
            objPremiumService = objPremiumService['DATA'];
            for (var k in objPremiumService['OD_PREMIUM']) {
                objPremiumService[k] = objPremiumService['OD_PREMIUM'][k] - 0;
            }
            for (var k in objPremiumService['LIABILITY']) {
                objPremiumService[k] = objPremiumService['LIABILITY'][k] - 0;
            }

            var premium_breakup = this.get_const_premium_breakup();
            for (var key in this.premium_breakup_schema) {
                if (typeof this.premium_breakup_schema[key] === 'object') {
                    var group_final = 0, group_final_key = '';
                    for (var sub_key in this.premium_breakup_schema[key]) {
                        var premium_key = this.premium_breakup_schema[key][sub_key];
                        var premium_val = 0;
                        if (premium_key && objPremiumService.hasOwnProperty(premium_key)) {
                            premium_val = objPremiumService[premium_key] - 0;
                        }
                        premium_val = isNaN(premium_val) ? 0 : premium_val;
                        premium_breakup[key][sub_key] = premium_val;
                        if (sub_key.indexOf('final_') > -1) {
                            group_final_key = sub_key;
                        } else if (sub_key.indexOf('_disc') > -1) {
                            group_final -= premium_val;
                        } else {
                            group_final += premium_val;
                        }
                    }
                    premium_breakup[key][group_final_key] = group_final;

                } else {
                    var premium_key = this.premium_breakup_schema[key];
                    var premium_val = 0;
                    if (premium_key && objPremiumService.hasOwnProperty(premium_key)) {
                        premium_val = objPremiumService[premium_key] - 0;
                    }
                    premium_val = isNaN(premium_val) ? 0 : premium_val;
                    premium_breakup[key] = premium_val;
                }
            }

            premium_breakup['service_tax'] = (objPremiumService['CGST'] - 0) + (objPremiumService['SGST'] - 0) + (objPremiumService['UTGST'] - 0) + (objPremiumService['IGST'] - 0);
            objServiceHandler.Premium_Breakup = premium_breakup;
            objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['QUOTE_ID'];
        }

        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
        return objServiceHandler;
    } catch (e) {
        var Err = {
            'Type': 'LM',
            'Msg': e.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'premium_response_handler', e);
        return objServiceHandler;
    }
};
RoyalSundaramMotor.prototype.insurer_vehicle_idv = function (objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback) {
    console.log('Start', this.constructor.name, 'insurer_vehicle_idv');
    try {
        var objInsurerProduct = this;
        var Insurer_Id = specific_insurer_object['insurer_id'];
        var IdvMethod = this.ArrayFindByKey(Insurer_Object.Method_List, 'Method_Type', 'Idv');
        specific_insurer_object.method = IdvMethod;
        if (fs.existsSync(appRoot + '/resource/wsdl/' + specific_insurer_object.method.Service_File)) {
            specific_insurer_object['method_file_url'] = appRoot + '/resource/wsdl/' + specific_insurer_object.method.Service_File;
        } else {
            specific_insurer_object['method_file_url'] = specific_insurer_object.method.Service_URL;
        }
        if (this.lm_request['vehicle_insurance_type'] === 'new') {
            if (this.lm_request['method_type'] !== 'Verification') {
                if (this.lm_request['method_type'] === 'Idv' || this.lm_request['method_type'] === 'Premium') {
                    if (parseInt(this.lm_request['product_id']) === 1) {
                        IdvMethod.Method_Request_File = "RoyalSundaram_Car_Premium.json";
                    }
                    if (parseInt(this.lm_request['product_id']) === 10) {
                        IdvMethod.Method_Request_File = "RoyalSundaram_TW_Premium.json";
                    }
                }
            }
        }
        var method_content = fs.readFileSync(appRoot + '/resource/request_file/' + IdvMethod.Method_Request_File).toString();
        method_content = method_content.replace('___tppd_si___', '');
        method_content = method_content.replace('isprodutcheck', 'isproductcheck');
        var request_replaced_data = method_content.replaceJson(this.processed_request);

        var logGuid = this.create_guid('ARN-');
        var docLog = {
            "Service_Log_Id": "",
            "Service_Log_Unique_Id": logGuid,
            "Request_Id": objProduct.docRequest.Request_Id,
            "User_Data_Id": objProduct.lm_request['udid'] - 0,
            "Request_Unique_Id": objProduct.docRequest.Request_Unique_Id,
            "Insurer_Request": request_replaced_data,
            "Insurer_Response": "",
            "Insurer_Response_Core": "",
            "Premium_Breakup": null,
            "LM_Response": "",
            "Insurer_Transaction_Identifier": "",
            "Status": "pending",
            "Error_Code": "",
            "Is_Active": 1,
            "Created_On": new Date(),
            "Product_Id": objProduct.db_specific_product.Product_Id,
            "Insurer_Id": Insurer_Object.Insurer_ID,
            "Plan_Id": null,
            "Plan_Name": null,
            "Method_Type": "Idv",
            "Call_Execution_Time": 0
        };
        this.save_log(docLog);
        console.log('ServiceData');
        console.log(docLog.Insurer_Request);
        this.service_call(docLog, objProduct, Insurer_Object, specific_insurer_object);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_vehicle_idv', ex);
    }
};
RoyalSundaramMotor.prototype.insurer_vehicle_idv_handler_bakc = function (objBreakup, objProduct, Insurer_Object, specific_insurer_object) {
    try {
        var objInsurerProduct = this;
        var Db_Idv_Item = {
            "Motor_Premiums_Idv_Id": "",
            "Insurer_Id": parseInt(objInsurerProduct.insurer_id),
            "Vehicle_Id": parseInt(objInsurerProduct.lm_request['vehicle_id']),
            "Rto_Id": parseInt(objInsurerProduct.lm_request['rto_id']),
            "Vehicle_Age_Month": objInsurerProduct.vehicle_age_slab_month(),
            "Idv_Normal": objBreakup.Idv_Normal,
            "Idv_Min": objBreakup.Idv_Min,
            "Idv_Max": objBreakup.Idv_Max,
            "Exshowroom": objBreakup.Exshowroom,
            "Created_On": new Date()
        };
        var PremiumMethod = this.ArrayFindByKey(Insurer_Object.Method_List, 'Method_Type', 'Premium');
        specific_insurer_object.method = PremiumMethod;
        if (fs.existsSync(appRoot + '/resource/wsdl/' + specific_insurer_object.method.Service_File)) {
            specific_insurer_object['method_file_url'] = appRoot + '/resource/wsdl/' + specific_insurer_object.method.Service_File;
        } else {
            specific_insurer_object['method_file_url'] = specific_insurer_object.method.Service_URL;
        }
        objInsurerProduct.save_to_db('motor_premiums_idvs', Db_Idv_Item);
        objInsurerProduct.motor_vehicle_idv_handler(objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_vehicle_idv_handler_bakc', ex);
    }
    console.log('Finish', this.constructor.name, 'insurer_vehicle_idv', Db_Idv_Item);
};
RoyalSundaramMotor.prototype.customer_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'customer_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Customer': null
    };

    try {
        var final_premium = '';
        var Error_Msg = 'NO_ERR';
        if (objResponseJson.hasOwnProperty('PREMIUMDETAILS')) {
            if (objResponseJson['PREMIUMDETAILS'].hasOwnProperty('Status')) {
                if (objResponseJson['PREMIUMDETAILS']['Status']['StatusCode'] === 'S-0005' && (objResponseJson['PREMIUMDETAILS']['Status']['Message'].indexOf('Vehicle Additional details updation success') > -1) || (objResponseJson['PREMIUMDETAILS']['Status']['Message'].indexOf('Vehicle details saved successfully') > -1)) {
                    final_premium = objResponseJson['PREMIUMDETAILS']['DATA']['GROSS_PREMIUM'];
                } else {
                    Error_Msg = JSON.stringify(objResponseJson['PREMIUMDETAILS']['Status']);
                }
            } else {
                Error_Msg = 'LM_EMPTY_STATUS';
            }
        } else {
            Error_Msg = 'LM_EMPTY_PREMIUMDETAILS';
        }
        if (Error_Msg === 'NO_ERR') {
            var objPremiumService = objResponseJson['PREMIUMDETAILS'];
            var is_idv_verified = false;
            if (this.prepared_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
                is_idv_verified = true;
            } else {
                var vehicle_expected_idv = (parseInt(this.prepared_request['vehicle_expected_idv']) - 0);
                var vehicle_received_idv = (parseInt(objPremiumService['DATA']['IDV']) - 0);
                is_idv_verified = (vehicle_expected_idv === vehicle_received_idv);
                let min_amt = 0 - 1;
                let max_amt = 1;
                let Diff_Amt = vehicle_expected_idv - vehicle_received_idv;
                if (Diff_Amt >= min_amt && Diff_Amt < max_amt) {
                    is_idv_verified = true;
                } else {
                    is_idv_verified = false;
                }
            }
            if (is_idv_verified) {
                var Customer = {
                    'insurer_customer_identifier': objPremiumService['DATA']['QUOTE_ID'],
                    'final_premium_verified': final_premium
                };
                objServiceHandler.Customer = Customer;
                objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['DATA']['QUOTE_ID'];
            } else {
                Error_Msg = 'LM_IDV_MISMATCH_REQUEST_IDV_' + vehicle_expected_idv.toString() + '_RECEIVED_IDV_' + vehicle_received_idv.toString();
            }
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'customer_response_handler', objServiceHandler);
        return objServiceHandler;
    } catch (e) {
        var Err = {
            'Type': 'LM',
            'Msg': e.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'customer_response_handler', e);
        return objServiceHandler;
    }
};
RoyalSundaramMotor.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };

    try {
        var Error_Msg = 'NO_ERR';
        if (objResponseJson.hasOwnProperty('PREMIUMDETAILS')) {
            if (objResponseJson['PREMIUMDETAILS'].hasOwnProperty('Status')) {
                if (objResponseJson['PREMIUMDETAILS']['Status']['StatusCode'] === 'S-0005' || objResponseJson['PREMIUMDETAILS']['Status']['Message'].indexOf('Quote Approved,Proceed Buy Policy') > -1) {

                } else {
                    Error_Msg = JSON.stringify(objResponseJson['PREMIUMDETAILS']['Status']);
                }
            } else {
                Error_Msg = 'LM_EMPTY_STATUS';
            }
        } else {
            Error_Msg = 'LM_EMPTY_PREMIUMDETAILS';
        }
        if (Error_Msg === 'NO_ERR') {
            var objPremiumVerification = this.premium_verification(this.lm_request['final_premium'], objResponseJson['PREMIUMDETAILS']['DATA']['PREMIUM'], 2, 5);
            if (objPremiumVerification.Status) {
            } else {
                Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
            }

            var pg_data = {
                'reqType': 'JSON',
                'process': 'paymentOption',
                'apikey': this.prepared_request['insurer_integration_service_password'],
                'agentId': this.prepared_request['insurer_integration_service_user'],
                'premium': this.processed_request['___final_premium_verified___'],
                'quoteId': objResponseJson['PREMIUMDETAILS']['DATA']['QUOTE_ID'],
                'version_no': '12345',
                'strFirstName': this.lm_request['first_name'],
                'strEmail': this.lm_request['email'],
                'strMobileNo': this.lm_request['mobile'],
                'isQuickRenew': '',
                'crossSellProduct': '',
                'crossSellQuoteid': '',
                'returnUrl': this.const_payment.pg_ack_url, //'https://www.policyboss.com/transaction-status-qa.php',
                'vehicleSubLine': this.processed_request['___product_id___'],
                'elc_value': '',
                'nonelc_value': '',
                'paymentType': 'PAYTM'
            };

            objServiceHandler.Payment.pg_data = pg_data;
            objServiceHandler.Payment.pg_redirect_mode = 'POST';
            objServiceHandler.Insurer_Transaction_Identifier = 'PB' + this.lm_request['crn'];
        }

        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'proposal_response_handler', objServiceHandler);
        return objServiceHandler;

    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'proposal_response_handler', ex);
        return objServiceHandler;
    }
};
RoyalSundaramMotor.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';

    try {
        //this.pg_response_handler();
        if (this.const_policy.transaction_status === 'SUCCESS') {
            //PDF CODE
            var args = {
                data: {
                    "search_reference_number": this.lm_request['search_reference_number'],
                    "api_reference_number": this.lm_request['api_reference_number'],
                    "policy_number": this.const_policy.policy_number,
                    "pg_reference_number_1": this.const_policy.pg_reference_number_1, //quoteId
                    "pg_reference_number_2": this.proposal_processed_request['___policy_end_date___'], //expiryDate
                    "pg_reference_number_3": this.proposal_processed_request['___birth_date___'], //dob
                    'client_key': this.lm_request['client_key'],
                    'secret_key': this.lm_request['secret_key'],
                    'insurer_id': this.lm_request['insurer_id'],
                    'email': this.lm_request['email'],
                    'mobile': this.lm_request['mobile'],
                    'method_type': 'Pdf',
                    'execution_async': 'no'
                }
            };
            this.const_policy.pdf_request = args.data;

            var product_name = 'CAR';
            if (this.lm_request['product_id'] === 10) {
                product_name = 'TW';
            }
            var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.const_policy.policy_number.toString() + '.pdf';
            var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
            var pdf_web_path = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
            //var pdf_web_path = config.environment.weburl + config.pb_config.pdf_web_loc + pdf_file_name;
            this.const_policy.policy_url = pdf_web_path;
            this.pdf_call(config.environment.weburl + '/quote/pdf_initiate', args, pdf_sys_loc);
        }
        objServiceHandler.Insurer_Transaction_Identifier = this.const_policy.transaction_id;
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', ex);

    }
    objServiceHandler.Policy = this.const_policy;
    objServiceHandler.Error_Msg = Error_Msg;
    console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
    return objServiceHandler;
};
RoyalSundaramMotor.prototype.pg_response_handler = function () {
    console.log('Start', this.constructor.name, 'pg_response_handler', JSON.stringify(this.const_payment_response));
    try {
        var objInsurerProduct = this;
        this.const_policy.transaction_id = objInsurerProduct.lm_request.pg_post['transactionNumber'];
        if (objInsurerProduct.lm_request.pg_post['status'].indexOf('success') > -1) {
            if (objInsurerProduct.lm_request.pg_post['policyNO'] !== '') {
                this.const_policy.transaction_status = 'SUCCESS';
            } else {
                this.const_policy.transaction_status = 'PAYPASS';
            }
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.pg_reference_number_1 = objInsurerProduct.lm_request.pg_post['quoteId'];
            this.const_policy.policy_number = objInsurerProduct.lm_request.pg_post['policyNO'];
            this.const_policy.transaction_amount = objInsurerProduct.lm_request.pg_post['premium'];
        } else {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
            this.const_policy.transaction_amount = objInsurerProduct.lm_request.pg_post['premium'];
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
RoyalSundaramMotor.prototype.pdf_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'pdf_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        var policy = {
            'policy_url': null,
            'policy_number': this.lm_request['policy_number'],
            'pdf_status': null
        };
        if (Error_Msg === 'NO_ERR') {
            if (objResponseJson !== '') {
                var product_name = 'CAR';
                if (this.lm_request['product_id'] === 10) {
                    product_name = 'TW';
                }
                var policy_number = this.lm_request['policy_number'].toString().replace('/', '_');
                var pdf_file_name = this.constructor.name + '_' + product_name + '_' + policy_number + '.pdf';
                var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                //var pdf_web_path_portal = config.environment.weburl + config.pb_config.pdf_web_loc + pdf_file_name;
                var binary = new Buffer(objResponseJson, 'base64');
                fs.writeFileSync(pdf_sys_loc_horizon, binary);
                let is_valid_policy = null;
                policy.pdf_status = 'FAIL';
                if (fs.existsSync(pdf_sys_loc_horizon) && pdf_sys_loc_horizon.indexOf('.pdf') > -1) {
                    let stats = fs.statSync(pdf_sys_loc_horizon);
                    let fileSizeInBytes = stats.size;
                    let fileSizeInKb = (fileSizeInBytes / 1024).toFixed(2);
                    if (fileSizeInKb > 10) {
                        is_valid_policy = true;
                        policy.pdf_status = 'SUCCESS';
                    } else {
                        fs.unlinkSync(pdf_sys_loc_horizon);
                        is_valid_policy = false;
                    }
                } else {
                    is_valid_policy = false;
                }
                policy.policy_url = pdf_web_path_portal;
            } else {
                policy.pdf_status = 'FAIL';
            }
            objServiceHandler.Insurer_Transaction_Identifier = this.lm_request['policy_number'];
        } else {
            policy.transaction_status = 'PAYPASS';
        }
        this.const_policy = policy;
        objServiceHandler.Policy = policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'pdf_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'pdf_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
RoyalSundaramMotor.prototype.pdf_call = function (url, args, pdf_web_path) {
    console.log('Start', this.constructor.name, 'pdf_call', url, args, pdf_web_path);
    try {
        var objInsurerProduct = this;
        objInsurerProduct.pdf_attempt++;
        var Client = require('node-rest-client').Client;
        var client = new Client();
        client.post(url, args, function (data, response) {
            if (data.Error_Code !== '' || true) {
                if (!fs.existsSync(pdf_web_path) && objInsurerProduct.pdf_attempt < 11) {
                    var sleep = require('system-sleep');
                    sleep(600000);
                    objInsurerProduct.pdf_call(args, pdf_web_path);
                }
            }
        });
        console.log("RoyalSundaramMotor pdf_call objInsurerProduct.pdf_attempt :: ", objInsurerProduct.pdf_attempt);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pdf_call', ex);
    }
};
RoyalSundaramMotor.prototype.policy_end_date_2 = function () {
    console.log('Start', this.constructor.name, 'policy_end_date_2');
    var pol_end_date = '';
    try {
        pol_end_date = new Date();
        var policy_tenure = 1;
        var ch_flag = ((parseInt(((this.lm_request['vehicle_insurance_subtype']).split('CH'))[0]) > 0) ? true : false);
//    if (this.lm_request.hasOwnProperty('policy_tenure') && (this.lm_request['policy_tenure'] - 0) > 0) {
//        policy_tenure = (this.lm_request['policy_tenure'] - 0);
//    }
//end date for : 1ch+0tp = 1 year, 0ch+1tp = 1 year, 1ch+2tp = 1year, 1ch+4tp = 1 year, 2ch+0tp = 2 years, 3ch+0tp = 3 years, 5ch+0tp = 5 years
        if (ch_flag && this.lm_request.hasOwnProperty('policy_od_tenure') && (this.lm_request['policy_od_tenure'] - 0) > 0) {
            policy_tenure = (this.lm_request['policy_od_tenure'] - 0);
        }
        if (!ch_flag && this.lm_request.hasOwnProperty('policy_tp_tenure') && (this.lm_request['policy_tp_tenure'] - 0) > 0) {
            policy_tenure = (this.lm_request['policy_tp_tenure'] - 0);
        }
        if (this.lm_request['vehicle_insurance_type'] === 'new') {
            pol_end_date.setDate(pol_end_date.getDate() - 1);
            pol_end_date.setFullYear(pol_end_date.getFullYear() + policy_tenure);
        }
        if (this.lm_request['vehicle_insurance_type'] === 'renew') {
            var days_diff = moment(this.todayDate()).diff(this.lm_request['policy_expiry_date'], 'days');
            //for expired case
            if (days_diff > 0) {
                var today_date = new Date(this.todayDate());
                //pol_end_date.setDate(today_date.getDate() + 1);
                pol_end_date.setFullYear(today_date.getFullYear() + policy_tenure);
            } else { // for not expired case
                var expiry_date = new Date(this.lm_request['policy_expiry_date']);
                var pol_end_date = expiry_date;
                pol_end_date.setFullYear(expiry_date.getFullYear() + policy_tenure);
            }
        }
        pol_end_date = this.date_format(pol_end_date, this.insurer_date_format);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'policy_end_date_2', ex);
        return pol_end_date;
    }
    console.log('Finish', this.constructor.name, 'policy_end_date_2', pol_end_date);
    return pol_end_date;
};
RoyalSundaramMotor.prototype.insurer_dateFormat = function (date_txt) {
    console.log('Start', this.constructor.name, 'insurer_dateFormat');
    var dt_txt = '';
    try {
        dt_txt = date_txt.split("-");
        dt_txt = dt_txt[0] + "/" + dt_txt[1] + "/" + dt_txt[2];
        console.log("dt_txt : " + dt_txt);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_dateFormat', ex);
        return dt_txt;
    }
    return dt_txt;
};
RoyalSundaramMotor.prototype.rstp_insurer_tenure = function () {
    console.log('Start', this.constructor.name, 'rstp_insurer_tenure');
    var age_in_year = 0;
    try {
        var stdate = this.lm_request['tp_start_date'].split("-");
        var eddate = this.lm_request['tp_end_date'].split("-");
        var rstp_start_date = stdate[2] + "-" + stdate[1] + "-" + stdate[0];
        var rstp_end_date = eddate[2] + "-" + eddate[1] + "-" + eddate[0];
        age_in_year = moment(rstp_end_date).diff(rstp_start_date, 'years');
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'rstp_insurer_tenure', ex);
        return age_in_year;
    }
    console.log('Finish', this.constructor.name, 'rstp_insurer_tenure', age_in_year);
    return age_in_year;
};
RoyalSundaramMotor.prototype.premium_breakup_schema = {
    "own_damage": {
        "od_basic": "BASIC_PREMIUM_AND_NON_ELECTRICAL_ACCESSORIES",
        "od_elect_access": "ELECTRICAL_ACCESSORIES",
        "od_non_elect_access": "",
        "od_cng_lpg": "BI_FUEL_KIT",
        "od_disc_ncb": "NO_CLAIM_BONUS",
        "od_disc_vol_deduct": "VOLUNTARY_DEDUCTABLE",
        "od_disc_anti_theft": "",
        "od_disc_aai": "AUTOMOBILE_ASSOCIATION_DISCOUNT",
        "od_loading": "",
        "od_disc": "",
        "od_final_premium": "TOTAL_OD_PREMIUM"
    },
    "liability": {
        "tp_basic": "BASIC_PREMIUM_INCLUDING_PREMIUM_FOR_TPPD",
        "tp_cover_owner_driver_pa": "UNDER_SECTION_III_OWNER_DRIVER",
        "tp_cover_unnamed_passenger_pa": "UNNAMED_PASSENGRS",
        "tp_cover_named_passenger_pa": "",
        "tp_cover_paid_driver_pa": "PA_COVER_TO_PAID_DRIVER",
        "tp_cover_paid_driver_ll": "TO_PAID_DRIVERS",
        "tp_cng_lpg": "BI_FUEL_KIT_CNG",
        "tp_final_premium": "TOTAL_LIABILITY_PREMIUM"
    },
    "addon": {
        "addon_zero_dep_cover": "DEPRECIATION_WAIVER",
        "addon_road_assist_cover": null,
        "addon_ncb_protection_cover": "NCB_PROTECTOR",
        "addon_engine_protector_cover": "ENGINE_PROTECTOR",
        "addon_invoice_price_cover": "INVOICE_PRICE_INSURANCE",
        "addon_key_lock_cover": "KEY_REPLACEMENT",
        "addon_consumable_cover": null,
        "addon_daily_allowance_cover": null,
        "addon_windshield_cover": "WIND_SHIELD_GLASS",
        "addon_passenger_assistance_cover": null,
        "addon_tyre_coverage_cover": "TYRE_COVER",
        "addon_personal_belonging_loss_cover": null,
        "addon_inconvenience_allowance_cover": null,
        "addon_medical_expense_cover": null,
        "addon_hospital_cash_cover": null,
        "addon_ambulance_charge_cover": null,
        "addon_rodent_bite_cover": null,
        "addon_losstime_protection_cover": null,
        "addon_hydrostatic_lock_cover": null,
        "addon_final_premium": 0
    },
    "net_premium": "PACKAGE_PREMIUM",
    "service_tax": "",
    "final_premium": "GROSS_PREMIUM"
};
module.exports = RoyalSundaramMotor;
