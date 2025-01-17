/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var util = require('util');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var config = require('config');
var Motor = require(appRoot + '/libs/Motor');
var fs = require('fs');
var moment = require('moment');

function LibertyVideoconMotor() {

}
util.inherits(LibertyVideoconMotor, Motor);

LibertyVideoconMotor.prototype.lm_request_single = {};
LibertyVideoconMotor.prototype.insurer_integration = {};
LibertyVideoconMotor.prototype.insurer_addon_list = [];
LibertyVideoconMotor.prototype.insurer = {};
LibertyVideoconMotor.prototype.pdf_attempt = 0;
LibertyVideoconMotor.prototype.insurer_date_format = 'dd/MM/yyyy';


LibertyVideoconMotor.prototype.insurer_product_api_pre = function () {

};
LibertyVideoconMotor.prototype.insurer_product_field_process_pre = function () {
    try {
        let is_tp_only = false;
        if (this.prepared_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
            is_tp_only = true;
        } else if (this.prepared_request['vehicle_insurance_subtype'].indexOf('1OD') > -1) {
            is_tp_only = true;
        } else {
            is_tp_only = false;
        }

        if (this.lm_request['vehicle_insurance_type'] === 'new') {
            //this.prepared_request['policy_tenure'] = 1;
            //this.processed_request['___policy_tenure___'] = 1;
            this.method_content = this.method_content.toString().replace('___policy_tenure___', '1');
            this.method_content = this.method_content.toString().replace('___policy_end_date_extended___', '___policy_end_date___');
        }

        //for posp case
        var posp_request_data = this.find_text_btw_key(this.method_content.toString(), '<!--POS_CONFIG_START-->', '<!--POS_CONFIG_FINISH-->', true);
        /*        var is_posp = 'no';
         if ((this.lm_request['ss_id'] - 0) == 487 && false) {
         is_posp = 'yes';
         this.lm_request['is_posp'] = 'yes';
         var obj_posp = {
         "posp_category": "PolicyBoss",
         "posp_reporting_agent_name": "POLICY BOSS WEBSITE",
         "posp_reporting_agent_uid": 508389,
         "posp_posp_category": 0,
         "posp_gender": 0,
         "posp_erp_id": 654321,
         "posp_ss_id": 0,
         "posp_sources": 0,
         "posp_aadhar": '123456789123',
         "posp_pan_no": 'ATIPM8172H',
         "posp_mobile_no": '9999999999',
         "posp_agent_city": 0,
         "posp_email_id": 0,
         "posp_last_name": 'Posp',
         "posp_middle_name": 0,
         "posp_first_name": 'Landmark',
         "posp_sm_posp_name": 0,
         "posp_sm_posp_id": 0,
         "posp_fba_id": 0,
         "posp_posp_id": 0
         };
         for (var k in obj_posp) {
         this.lm_request[k] = obj_posp[k];
         }
         } else {
         is_posp = 'no';
         }*/

        //if (this.lm_request['is_posp'] === 'yes' && this.lm_request['vehicle_insurance_subtype'] == '1CH_0TP') {
        if (this.lm_request['is_posp'] === 'yes') {
            if (config.environment.name === 'Production') {
                //if (is_tp_only === false) {
                this.prepared_request['insurer_integration_agent_code'] = 'IMD1041090';
                this.processed_request['___insurer_integration_agent_code___'] = 'IMD1041090';
                //}
                this.method_content = this.method_content.replace('"PolicyBoss"', '"PolicyBossLandmark"');
                this.method_content = this.method_content.replace('"TPService"', '"PolicyBossLandmark"');

            } else {
                this.method_content = this.method_content.replace('"PolicyBoss"', '"TPService"');
            }
            this.method_content = this.method_content.replace('<!--POS_CONFIG_START-->', '');
            this.method_content = this.method_content.replace('<!--POS_CONFIG_FINISH-->', '');

            var obj_replace = {
                '___posp_mobile_no___': '8356844187'
            };
            if (Object.keys(obj_replace).length > 0) {
                this.method_content = this.method_content.toString().replaceJson(obj_replace);
            }
            for (var k in this.lm_request) {
                if (k.indexOf('posp_') === 0) {
                    this.method_content = this.method_content.replace('___' + k + '___', this.lm_request[k]);
                }
            }

        } else {
            if (config.environment.name === 'Production') {

            } else {
                if (is_tp_only && (this.lm_request['product_id'] === 10 || this.lm_request['product_id'] === 1)) {
                    //this.method_content = this.method_content.replace('"PolicyBoss"', '"Coverfox"');
                } else {
                    this.method_content = this.method_content.replace('"PolicyBoss"', '"TPService"');
                }
            }
            this.method_content = this.method_content.replace(posp_request_data, '');
        }

        if (this.lm_request['product_id'] === 10) {
            this.prepared_request['dbmaster_insurer_vehicle_seatingcapacity'] = 1;
            this.processed_request['___dbmaster_insurer_vehicle_seatingcapacity___'] = 1;
            this.method_content = this.method_content.toString().replace('___dbmaster_insurer_vehicle_seatingcapacity___', '1');
        }

        /*if (this.lm_request['vehicle_insurance_type'] === 'new' && this.lm_request['product_id'] === 1 && ["0CH_3TP", "0CH_5TP", "1CH_2TP"].indexOf(this.lm_request['vehicle_insurance_subtype']) > -1) {
         this.prepared_request['policy_tenure'] = 1;
         this.processed_request['___policy_tenure___'] = 1;
         this.method_content = this.method_content.toString().replace('___policy_tenure___', '1');
         }
         if (this.lm_request['vehicle_insurance_type'] === 'new') {
         //this.method_content = this.method_content.toString().replace('___policy_tenure___', '___policy_tp_tenure___');
         }*/

        if (is_tp_only && this.lm_request['is_breakin'] === "yes" && (this.lm_request['product_id'] === 1 || this.lm_request['product_id'] === 10)) {
            if (config.environment.name !== 'Production') {
                if (this.lm_request['product_id'] === 1) {
                    this.prepared_request['insurer_integration_agent_code'] = "IMD1060381";
                    this.processed_request['___insurer_integration_agent_code___'] = this.prepared_request['insurer_integration_agent_code'];
                    this.method_content = this.method_content.toString().replace('___insurer_integration_agent_code___', 'IMD1060381');
                }
            }
            if (this.lm_request['method_type'] === 'Proposal') {
                let current_date = this.processed_request['___current_date___'];
                this.method_content = this.method_content.toString().replace('"IsInspectionDone": false', '"IsInspectionDone": true');
                this.method_content = this.method_content.toString().replace('"InspectionDoneByWhom": ""', '"InspectionDoneByWhom": "Self Inspection"');
                this.method_content = this.method_content.toString().replace('"ReportDate": ""', '"ReportDate": "' + current_date + '"');
                this.method_content = this.method_content.toString().replace('"InspectionDate": ""', '"InspectionDate": "' + current_date + '"');
            }
        }

        if (this.lm_request['vehicle_registration_type'] === 'corporate') {
            this.method_content = this.method_content.replace('___is_pa_od___', 'no');
            //this.method_content = this.method_content.replace('___is_llpd_emp___', 'yes');
            if (this.lm_request['product_id'] === 10) {
                this.method_content = this.method_content.replace('___is_llpd_emp___', 'no');
                this.method_content = this.method_content.replace('___is_llpd_emp_2___', '');
            } else {
                this.method_content = this.method_content.replace('___is_llpd_emp___', 'yes');
                this.method_content = this.method_content.replace('___is_llpd_emp_2___', this.processed_request['___dbmaster_insurer_vehicle_seatingcapacity___']);
            }
        } else {
            this.method_content = this.method_content.replace('___is_llpd_emp___', 'no');
            this.method_content = this.method_content.replace('___is_llpd_emp_2___', '0');
        }
        if (this.lm_request['method_type'] === 'Proposal') {
            var nominee_request_data = this.find_text_btw_key(this.method_content.toString(), '<!--NO_NOMINEE_START-->', '<!--NO_NOMINEE_FINISH-->', true);
            if (this.lm_request['vehicle_registration_type'] === 'corporate') {

                this.method_content = this.method_content.replace(nominee_request_data, '');
                this.method_content = this.method_content.replace('<!--NO_NOMINEE_START-->', '');
                this.method_content = this.method_content.replace('<!--NO_NOMINEE_FINISH-->', '');
                this.method_content = this.method_content.replace('___first_name___', this.lm_request['company_name']);
                //this.prepared_request['first_name'] = this.lm_request['company_name'];
                //this.processed_request['___first_name___'] = this.prepared_request['first_name'];
                //this.prepared_request['email'] = this.lm_request['company_contact_person_email'];
                //this.processed_request['___email___'] = this.prepared_request['email'];
                //this.prepared_request['mobile'] = this.lm_request['company_contact_person_mobile'];
                //this.processed_request['___mobile___'] = this.prepared_request['mobile'];
                //this.method_content = this.method_content.replace('___salutation___', this.lm_request['company_salutation']);
                this.method_content = this.method_content.replace('___last_name___', '');
                this.method_content = this.method_content.replace('___birth_date___', '');
                this.method_content = this.method_content.replace('___is_pa_od___', 'no');
                //this.method_content = this.method_content.replace('___gst_no___', this.lm_request['company_gst_no']);
                //this.method_content = this.method_content.replace('___email___', this.lm_request['company_contact_person_email']);
                //this.method_content = this.method_content.replace('___mobile___', this.lm_request['company_contact_person_mobile']);
                this.method_content = this.method_content.replace('___is_no_nominee___', 'true');
            } else {
                this.method_content = this.method_content.replace('___is_no_nominee___', 'false');
                this.method_content = this.method_content.replace('<!--NO_NOMINEE_START-->', '');
                this.method_content = this.method_content.replace('<!--NO_NOMINEE_FINISH-->', '');


            }
        }

        if (this.lm_request['product_id'] === 10 || this.lm_request['product_id'] === 1) {
            //this.prepared_request['policy_end_date'] = this.policy_end_date_2();
            this.processed_request['___policy_end_date___'] = this.prepared_request['policy_end_date'];

            if (this.lm_request['method_type'] === 'Idv' || this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Proposal') {
                if (this.lm_request['vehicle_insurance_subtype'] !== '1OD_0TP') {
                    var txt_replace2 = this.find_text_btw_key(this.method_content, '<!--SAOD_to_SAOD_START-->', '<!--SAOD_to_SAOD_END-->', true);
                    if (txt_replace2) {
                        this.method_content = this.method_content.replace(txt_replace2, '');
                    }
                }
            }
        }
        if (this.lm_request['vehicle_insurance_type'] === 'new') {
            this.prepared_request['registration_no_1'] = 'NEW';
            this.prepared_request['registration_no_2'] = '';
            this.prepared_request['registration_no_3'] = '';
            this.prepared_request['registration_no_4'] = '';

            this.processed_request['___registration_no_1___'] = 'NEW';
            this.processed_request['___registration_no_2___'] = '';
            this.processed_request['___registration_no_3___'] = '';
            this.processed_request['___registration_no_4___'] = '';
        }
        if (this.lm_request['vehicle_insurance_type'] === 'renew') {
            if (this.lm_request['method_type'] === 'Proposal') {
                this.prepared_request['previous_policy_number'] = this.lm_request['previous_policy_number'].toString().substring(0, 25);
                this.processed_request['___previous_policy_number___'] = this.prepared_request['previous_policy_number'];
            }
        }
        if (this.lm_request['method_type'] === 'Idv' || this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Proposal') {
            this.prepared_request['is_pa_od'] = this.lm_request['is_pa_od'];
            this.processed_request['___is_pa_od___'] = this.prepared_request['is_pa_od'];
            if (this.lm_request['is_pa_od'] === 'yes') {
                this.method_content = this.method_content.replace('___is_pa_od_license___', 'True');
                this.method_content = this.method_content.replace('___is_pa_od_cpa___', 'False');
            } else {
                this.method_content = this.method_content.replace('___is_pa_od_license___', 'False');
                this.method_content = this.method_content.replace('___is_pa_od_cpa___', 'True');
            }
        }
        if ((!is_tp_only) && this.lm_request['product_id'] === 1 && this.lm_request['is_breakin'] === 'yes' && this.lm_request['method_type'] === 'Proposal') {
            this.method['Method_Request_File'] = "LibertyVideocon_Car_Create_Lead.json";
            this.method['Service_URL'] = "http://168.87.83.117/Api/MotoVeysClaimLook.asmx?WSDL";
            var method_content = fs.readFileSync(appRoot + '/resource/request_file/' + this.method.Method_Request_File).toString();
            this.method_content = method_content;
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1;
            var yyyy = today.getFullYear();
            var hh = today.getHours();
            var mn = today.getMinutes();
            var ss = today.getSeconds();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            } else if (mm > 12) {
                mm = '01';
            }
            if (hh < 10) {
                hh = '0' + hh;
            }
            if (mn < 10) {
                mn = '0' + mn;
            }
            if (ss < 10) {
                ss = '0' + ss;
            }
            var inspection_date = yyyy + '-' + mm + '-' + dd;
            var inspection_time = hh + ':' + mn + ':' + ss;
            this.method_content = this.method_content.replace('___inspection_date___', inspection_date);
            this.method_content = this.method_content.replace('___inspection_time___', inspection_time);
        }
        if (this.lm_request['method_type'] === 'Verification') {
            this.prepared_request['final_premium'] = this.const_policy.transaction_amount;
            this.processed_request['___final_premium___'] = this.const_policy.transaction_amount;
        }

        if (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Proposal') {
            if ((this.insurer_lm_request['pa_named_passenger_si'] - 0) > 0) {
                this.prepared_request['pa_named_passenger_si'] = (this.insurer_lm_request['pa_named_passenger_si'] - 0) * (this.prepared_request['dbmaster_insurer_vehicle_seatingcapacity'] - 0);
                this.processed_request['___pa_named_passenger_si___'] = this.prepared_request['pa_named_passenger_si'];
            }
            let segment_type_arr = {
                "COMPACT": 10000,
                "EXECUTIVE": 20000,
                "HIGH END": 30000,
                "MID SIZE": 10000,
                "SUV 1": 20000,
                "SUV 2": 20000
            };
            if (this.prepared_request['addon_key_lock_cover'] === 'yes') {
                this.prepared_request['key_lock_si'] = segment_type_arr[this.prepared_request.dbmaster_insurer_vehicle_insurer_segmant] || 20000;
                this.processed_request['___key_lock_si___'] = this.prepared_request['key_lock_si'];
                this.method_content = this.method_content.replace('___key_lock_si___', this.prepared_request['key_lock_si']);
            } else {
                this.prepared_request['key_lock_si'] = '';
                this.processed_request['___key_lock_si___'] = this.prepared_request['key_lock_si'];
                this.method_content = this.method_content.replace('___key_lock_si___', '');
            }
        }
        if (this.processed_request['___gst_state___'] === '') {
            this.prepared_request['gst_state'] = 'MAHARASHTRA';
            this.processed_request['___gst_state___'] = 'MAHARASHTRA';
        }

        //this.method_content = this.method_content.replace('___vehicle_expected_idv___', '0');

        if (this.lm_request['method_type'] === 'Premium') {
            this.prepared_request['prev_policy_number'] = "1234543456785548";
            this.processed_request['___prev_policy_number___'] = this.prepared_request['prev_policy_number'];
        }
        if (this.lm_request['is_policy_exist'] === "no") {
            this.prepared_request['is_policy_exist'] = false;
            this.processed_request['___is_policy_exist___'] = this.prepared_request['is_policy_exist'];
            this.method_content = this.method_content.toString().replace('___is_policy_exist___', 'true');
        } else {
            this.prepared_request['is_policy_exist'] = true;
            this.processed_request['___is_policy_exist___'] = this.prepared_request['is_policy_exist'];
            this.method_content = this.method_content.toString().replace('___is_policy_exist___', 'false');
        }
        if (is_tp_only && (this.lm_request['product_id'] === 10 || this.lm_request['product_id'] === 1)) {
            this.method_content = this.method_content.replace('___is_claim_exists___', '');
            //this.method_content = this.method_content.toString().replace('___claim_amount___', '');
            this.prepared_request['is_claim_exists'] = "";
            this.processed_request['___is_claim_exists___'] = this.prepared_request['is_claim_exists'];
            //this.method_content = this.method_content.replace('"TPService"', '"Coverfox"');

            if (this.lm_request.hasOwnProperty('is_tppd') && this.lm_request['is_tppd'] === 'yes') {
                this.method_content = this.method_content.replace('___is_tppd___', 'Yes');
            } else {
                this.method_content = this.method_content.replace('___is_tppd___', 'No');
            }

            if (this.lm_request['method_type'] === 'Verification') {
                this.prepared_request['payment_source'] = 'LGI-PAYU';
                this.processed_request['___payment_source___'] = this.prepared_request['payment_source'];
            }
            if (this.lm_request['product_id'] === 1) {
                this.prepared_request['product_id'] = '3155';
                this.processed_request['___product_id___'] = '3155';
                this.method_content = this.method_content.toString().replace('___product_id___', '3155');
            } else {
                this.prepared_request['product_id'] = '3158';
                this.processed_request['___product_id___'] = '3158';
                this.method_content = this.method_content.toString().replace('___product_id___', '3158');
            }

            if (this.lm_request['is_policy_exist'] === "no") {
                //this.prepared_request['is_policy_exist'] = true;
                //this.processed_request['___is_policy_exist___'] = this.prepared_request['is_policy_exist'];
                this.method_content = this.method_content.toString().replace('___dbmaster_previousinsurer_code___', '');
                this.method_content = this.method_content.toString().replace('___previous_policy_type___', '');
                this.method_content = this.method_content.toString().replace('___pre_policy_start_date___', '');
                this.method_content = this.method_content.toString().replace('___policy_expiry_date___', '');
                this.method_content = this.method_content.toString().replace('___prev_policy_number___', '');
            } else {
                //this.prepared_request['is_policy_exist'] = false;
                //this.processed_request['___is_policy_exist___'] = this.prepared_request['is_policy_exist'];
                //this.method_content = this.method_content.toString().replace('___is_policy_exist___', 'false');
                this.prepared_request['previous_policy_type'] = 'LIABILITYPOLICY';
                this.processed_request['___previous_policy_type___'] = this.prepared_request['previous_policy_type'];
                this.method_content = this.method_content.toString().replace('___previous_policy_type___', 'LIABILITYPOLICY');
            }

            if (this.lm_request['is_breakin'] === "yes" && (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Proposal') && (this.lm_request['product_id'] === 1 || this.lm_request['product_id'] === 10)) {
                /*if (this.lm_request['product_id'] === 10) {
                 var policystartdate = moment().add(3, 'days').format('DD/MM/YYYY');
                 var pol_start_date = policystartdate;
                 this.method_content = this.method_content.toString().replace('___policy_start_date___', pol_start_date);
                 
                 var policyenddate = moment().add(2, 'days');
                 var pol_end_date = moment(policyenddate).add(1, "years").format('DD/MM/YYYY');
                 this.method_content = this.method_content.toString().replace('___policy_end_date___', pol_end_date);
                 }*/
                //if (this.lm_request['product_id'] === 1) {
                var policystartdate = moment().add(2, 'days').format('DD/MM/YYYY');
                var pol_start_date = policystartdate;
                this.method_content = this.method_content.toString().replace('___policy_start_date___', pol_start_date);

                var policyenddate = moment().add(1, 'days');
                var pol_end_date = moment(policyenddate).add(1, "years").format('DD/MM/YYYY');
                this.method_content = this.method_content.toString().replace('___policy_end_date___', pol_end_date);
                //}
            }

            if (this.lm_request['product_id'] === 1 && this.lm_request['vehicle_insurance_type'] === 'new' && (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Proposal')) {
                var policyenddate = moment().subtract(1, 'days');
                var pol_end_date = moment(policyenddate).add(3, "years").format('DD/MM/YYYY');
                this.method_content = this.method_content.toString().replace('___policy_end_date___', pol_end_date);
            }
        } else {
            if (this.lm_request['vehicle_insurance_subtype'] === '1OD_0TP') {
                if ([1, 10].indexOf(this.lm_request['product_id']) > -1) {
                    let years_diff = moment(this.lm_request['vehicle_registration_date']).diff(this.prepared_request['prev_policy_expiry_date'], 'years');
                    if (this.lm_request['is_policy_exist'] === "yes") {
                        if (Math.abs(years_diff) > 1) {
                            this.method_content = this.method_content.toString().replace('___previous_policy_type___', 'STANDALONEPOLICY');
                        } else {
                            this.method_content = this.method_content.toString().replace('___previous_policy_type___', 'BUNDLEDPOLICY');
                        }

                        this.prepared_request['previous_policy_TP_insurer_name'] = this.Master_Details.tp_insurer.Insurer_Code;//this.Master_Details.tp_insurer.Insurer_Name;
                        this.processed_request['___previous_policy_TP_insurer_name___'] = this.prepared_request['previous_policy_TP_insurer_name'];
                        this.method_content = this.method_content.toString().replace('___previous_policy_TP_insurer_name___', this.processed_request['___previous_policy_TP_insurer_name___']);
                        this.prepared_request['previous_policy_OD_insurer_name'] = this.Master_Details.prev_insurer.Insurer_Code;//this.Master_Details.prev_insurer.Insurer_Name;
                        this.processed_request['___previous_policy_OD_insurer_name___'] = this.prepared_request['previous_policy_OD_insurer_name'];
                        this.method_content = this.method_content.toString().replace('___previous_policy_OD_insurer_name___', this.processed_request['___previous_policy_OD_insurer_name___']);
                        if (this.lm_request['method_type'] === 'Proposal') {
                            this.prepared_request['previous_policy_TP_number'] = this.lm_request.tp_policy_number;
                            this.processed_request['___previous_policy_TP_number___'] = this.prepared_request['previous_policy_TP_number'];
                            this.method_content = this.method_content.toString().replace('___previous_policy_TP_number___', this.processed_request['___previous_policy_TP_number___']);
                            this.prepared_request['previous_polic_TP_tenure'] = this.lm_request.saod_tp_tenure;
                            this.processed_request['___previous_polic_TP_tenure___'] = this.prepared_request['previous_polic_TP_tenure'];
                            this.method_content = this.method_content.toString().replace('___previous_polic_TP_tenure___', this.processed_request['___previous_polic_TP_tenure___']);
                        }
                        this.method_content = this.method_content.replace('<!--SAOD_to_SAOD_START-->', '');
                        this.method_content = this.method_content.replace('<!--SAOD_to_SAOD_END-->', '');
                    } else {
                        this.method_content = this.method_content.toString().replace('___previous_policy_type___', '');
                        var txt_replace2 = this.find_text_btw_key(this.method_content, '<!--SAOD_to_SAOD_START-->', '<!--SAOD_to_SAOD_END-->', true);
                        if (txt_replace2) {
                            this.method_content = this.method_content.replace(txt_replace2, '');
                        }
                    }
                } else {
                    this.method_content = this.method_content.toString().replace('___previous_policy_type___', 'BUNDLEDPOLICY');
                    this.prepared_request['previous_policy_type'] = "BUNDLEDPOLICY";
                    this.processed_request['___previous_policy_type___'] = this.prepared_request['previous_policy_type'];
                    var txt_replace2 = this.find_text_btw_key(this.method_content, '<!--SAOD_to_SAOD_START-->', '<!--SAOD_to_SAOD_END-->', true);
                    if (txt_replace2) {
                        this.method_content = this.method_content.replace(txt_replace2, '');
                    }
                }

                if (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Idv') {
                    this.prepared_request['tp_end_date'] = moment(this.prepared_request['policy_expiry_date']).add(3, "years").format('DD/MM/YYYY');
                    this.processed_request['___tp_end_date___'] = this.prepared_request['tp_end_date'];
                    this.method_content = this.method_content.toString().replace('___tp_end_date___', moment(this.prepared_request['policy_expiry_date']).add(3, "years").format('DD/MM/YYYY'));
                }
                if (this.lm_request['method_type'] === 'Proposal') {
                    this.prepared_request['tp_start_date'] = moment(this.lm_request['tp_start_date'], 'DD-MM-YYYY').format('DD/MM/YYYY');
                    this.processed_request['___tp_start_date___'] = this.prepared_request['tp_start_date'];
                    this.prepared_request['tp_end_date'] = moment(this.lm_request['tp_end_date'], 'DD-MM-YYYY').format('DD/MM/YYYY');
                    this.processed_request['___tp_end_date___'] = this.prepared_request['tp_end_date'];
                }
                if (this.lm_request['method_type'] === 'Verification') {
                    this.prepared_request['payment_source'] = 'LGI-PAYU';
                    this.processed_request['___payment_source___'] = this.prepared_request['payment_source'];
                    this.prepared_request['is_otp'] = '4152';
                    this.processed_request['___is_otp___'] = this.prepared_request['is_otp'];
                }
                if (this.lm_request['product_id'] === 1) {
                    this.prepared_request['product_id'] = '3140';
                    this.processed_request['___product_id___'] = '3140';
                    this.method_content = this.method_content.toString().replace('___product_id___', '3140');
                }
                if (this.lm_request['product_id'] === 10) {
                    this.prepared_request['product_id'] = '3141';
                    this.processed_request['___product_id___'] = this.prepared_request['product_id'];
                    this.method_content = this.method_content.toString().replace('___product_id___', '3141');
                }
            } else {
                this.prepared_request['previous_policy_type'] = 'PackagePolicy';
                this.processed_request['___previous_policy_type___'] = this.prepared_request['previous_policy_type'];
                this.method_content = this.method_content.toString().replace('___previous_policy_type___', 'PackagePolicy');
                if (this.lm_request['method_type'] === 'Verification') {
                    this.prepared_request['payment_source'] = 'LVGI-PAYU';
                    this.processed_request['___payment_source___'] = this.prepared_request['payment_source'];
                }
            }
        }

        if (this.lm_request['vehicle_insurance_subtype'] != '1OD_0TP') {
            if (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Idv') {
                this.method_content = this.method_content.toString().replace('"PreviousPolicyODStartDate": "___pre_policy_start_date___",', '');
                this.method_content = this.method_content.toString().replace('"PreviousPolicyODEndDate": "___policy_expiry_date___",', '');
                this.method_content = this.method_content.toString().replace('"PreviousPolicyTPStartDate": "___pre_policy_start_date___",', '');
                this.method_content = this.method_content.toString().replace('"PreviousPolicyTPEndDate":"___tp_end_date___",', '');
            }
            if (this.lm_request['method_type'] === 'Proposal') {
                this.method_content = this.method_content.toString().replace('"PreviousPolicyODStartDate": "___pre_policy_start_date___",', '');
                this.method_content = this.method_content.toString().replace('"PreviousPolicyODEndDate": "___policy_expiry_date___",', '');
                this.method_content = this.method_content.toString().replace('"PreviousPolicyTPStartDate": "___tp_start_date___",', '');
                this.method_content = this.method_content.toString().replace('"PreviousPolicyTPEndDate": "___tp_end_date___",', '');
            }
            if (this.lm_request['method_type'] === 'Verification') {
                this.method_content = this.method_content.toString().replace('"OTP":"___is_otp___",', '');
            }
        }

        if (this.lm_request['method_type'] === 'Proposal') {
            if (this.lm_request['product_id'] === 1 && this.lm_request['is_breakin'] === 'yes') {
            } else {
                if (this.lm_request['electrical_accessory'] < 1 || this.lm_request['non_electrical_accessory'] < 1) {
                    var obj_method_content = JSON.parse(this.method_content);
                    if (this.lm_request['electrical_accessory'] < 1) {
                        obj_method_content.lstAccessories = null;
                    }

                    if (this.lm_request['non_electrical_accessory'] < 1) {
                        obj_method_content.lstNonElecAccessories = null;
                    }
                    this.method_content = JSON.stringify(obj_method_content);
                }
            }
        }
        if (this.lm_request['product_id'] === 1) {
            if (this.prepared_request['addon_consumable_cover'] === 'yes') {
                this.method_content = this.method_content.replace('___addon_consumable_cover___', 'yes');
            } else {
                this.method_content = this.method_content.replace('___addon_consumable_cover___', 'no');
            }
            if (this.prepared_request['addon_key_lock_cover'] === 'yes') {
                this.method_content = this.method_content.replace('___addon_key_lock_cover___', 'yes');
            } else {
                this.method_content = this.method_content.replace('___addon_key_lock_cover___', 'no');
            }
        }
        if (this.lm_request['method_type'] === 'Proposal') {
            if (this.lm_request.hasOwnProperty("kyc_no") && this.lm_request['kyc_no'] && this.lm_request['kyc_no'] !== "" && this.lm_request['kyc_no'] !== "undefined") {
                this.prepared_request['kyc_no'] = this.lm_request['kyc_no'];
                this.processed_request['___kyc_no___'] = this.prepared_request['kyc_no'];
            } else {
                this.prepared_request['kyc_no'] = "";
                this.processed_request['___kyc_no___'] = this.prepared_request['kyc_no'];
            }
            this.prepared_request['crn'] = this.insurer_lm_request['crn'];
            this.processed_request['___crn___'] = this.prepared_request['crn'];
        }
        if (this.lm_request['is_policy_exist'] === 'no') {
            this.method_content = this.method_content.toString().replace('<ns2:prvInsCompany>___dbmaster_previousinsurer_code___</ns2:prvInsCompany>', '<ns2:prvInsCompany>0</ns2:prvInsCompany>');
        }

        //method blank;
        if ((this.lm_request['product_id'] === 1) && this.prepared_request["Plan_Name"] !== "Basic" && this.prepared_request["Plan_Name"] !== "TP" && this.lm_request['method_type'] === 'Premium') {
            if (this.prepared_request["vehicle_age_year"] <= this.prepared_request["addon_avaiable_age"]) {
                if (this.prepared_request['dbmaster_pb_fuel_name'] === "BATTERY" && this.prepared_request["Plan_Name"] === "Plan-6") {

                } else if (this.prepared_request['dbmaster_pb_fuel_name'] !== "BATTERY" && ["Plan-1", "Plan-2", "Plan-4", "Plan-5", "Plan-7", "Plan-8"].indexOf(this.prepared_request["Plan_Name"]) > -1) { //&& this.prepared_request["Plan_Name"] !== "Plan-6"){//

                } else {
                    this.method_content = this.method_content.toString();
                    this.method_content = "BATTERY_NONBATTERY_VEHICLE_VALIDATION";
                }
            } else {
                this.method_content = this.method_content.toString();
                this.method_content = "VEHICLE_AGE_VALIDATION";
            }
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_product_field_process_pre', ex);
    }
};
LibertyVideoconMotor.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
LibertyVideoconMotor.prototype.insurer_product_field_process_post = function () {

};
LibertyVideoconMotor.prototype.insurer_product_api_post = function () {

};
LibertyVideoconMotor.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    try {
        var objInsurerProduct = this;
        var product_id = objProduct.db_specific_product.Product_Id;
        var insurer_id = Insurer_Object.Insurer_ID;
        var soap = require('soap');
        var xml2js = require('xml2js');
        //var PostData = JSON.parse(docLog.Insurer_Request);
        var Client = require('node-rest-client').Client;
        var client = new Client();
        let is_tp_only = false;
        if (this.prepared_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
            is_tp_only = true;
        } else if (this.prepared_request['vehicle_insurance_subtype'].indexOf('1OD') > -1) {
            is_tp_only = true;
        } else {
            is_tp_only = false;
        }
        if (this.lm_request['product_id'] === 1 && (docLog.Insurer_Request === "VEHICLE_AGE_VALIDATION" || docLog.Insurer_Request === "BATTERY_NONBATTERY_VEHICLE_VALIDATION")) {
            let vage_data = {
                "msg": "Addon applied but vehicle age doest not satisfied - VEHICLE_AGE_VALIDATION OR BATTERY_NONBATTERY_VEHICLE_VALIDATION"
            };
            var objResponseFull = {
                'err': vage_data,
                'result': vage_data,
                'raw': vage_data,
                'soapHeader': null,
                'objResponseJson': vage_data
            };
            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
        } else {
            if (specific_insurer_object.method.Method_Type === 'Idv') {
                if (this.lm_request['product_id'] === 10 || this.lm_request['product_id'] === 1) {
                    if (this.lm_request['is_policy_exist'] === "no") {
                        docLog.Insurer_Request = docLog.Insurer_Request.toString().replace('___is_policy_exist___', 'true');
                        docLog.Insurer_Request = docLog.Insurer_Request.toString().replace('___prev_policy_number___', '1029237298539');
                        docLog.Insurer_Request = docLog.Insurer_Request.toString().replace('___previous_policy_type___', '');
                    } else {
                        docLog.Insurer_Request = docLog.Insurer_Request.toString().replace('___is_policy_exist___', 'false');
                        docLog.Insurer_Request = docLog.Insurer_Request.toString().replace('___prev_policy_number___', '1029237298539');
                        if (is_tp_only) {
                            docLog.Insurer_Request = docLog.Insurer_Request.toString().replace('___previous_policy_type___', 'LIABILITYPOLICY');
                        } else if (this.lm_request['vehicle_insurance_subtype'] === "1OD_0TP") {
                            if (this.lm_request['is_policy_exist'] === "yes") {
                                let years_diff = moment(this.lm_request['vehicle_registration_date']).diff(this.prepared_request['prev_policy_expiry_date'], 'years');
                                if (Math.abs(years_diff) > 1) {
                                    docLog.Insurer_Request = docLog.Insurer_Request.toString().replace('___previous_policy_type___', 'STANDALONEPOLICY');
                                    docLog.Insurer_Request = docLog.Insurer_Request.toString().replace('___previous_policy_TP_insurer_name___', this.Master_Details.tp_insurer.Insurer_Name);
                                    docLog.Insurer_Request = docLog.Insurer_Request.toString().replace('___previous_policy_OD_insurer_name___', this.Master_Details.prev_insurer.Insurer_Name);

                                    docLog.Insurer_Request = docLog.Insurer_Request.toString().replace('<!--SAOD_to_SAOD_START-->', '');
                                    docLog.Insurer_Request = docLog.Insurer_Request.toString().replace('<!--SAOD_to_SAOD_END-->', '');
                                } else {
                                    docLog.Insurer_Request = docLog.Insurer_Request.toString().replace('___previous_policy_type___', 'BUNDLEDPOLICY');
                                    var txt_replace2 = this.find_text_btw_key(docLog.Insurer_Request, '<!--SAOD_to_SAOD_START-->', '<!--SAOD_to_SAOD_END-->', true);
                                    if (txt_replace2) {
                                        docLog.Insurer_Request = docLog.Insurer_Request.toString().replace(txt_replace2, '');
                                    }
                                }
                            } else {
                                docLog.Insurer_Request = docLog.Insurer_Request.toString().replace('___previous_policy_type___', 'BUNDLEDPOLICY');
                                var txt_replace2 = this.find_text_btw_key(docLog.Insurer_Request, '<!--SAOD_to_SAOD_START-->', '<!--SAOD_to_SAOD_END-->', true);
                                if (txt_replace2) {
                                    docLog.Insurer_Request = docLog.Insurer_Request.toString().replace(txt_replace2, '');
                                }
                            }
                        } else {
                            docLog.Insurer_Request = docLog.Insurer_Request.toString().replace('___previous_policy_type___', 'PackagePolicy');
                            var txt_replace2 = this.find_text_btw_key(docLog.Insurer_Request, '<!--SAOD_to_SAOD_START-->', '<!--SAOD_to_SAOD_END-->', true);
                            if (txt_replace2) {
                                docLog.Insurer_Request = docLog.Insurer_Request.toString().replace(txt_replace2, '');
                            }
                        }
                    }

                    /*if (this.lm_request['vehicle_insurance_type'] === 'new' && this.lm_request['product_id'] === 1 && this.lm_request['vehicle_insurance_subtype'] === "1CH_2TP") {
                     docLog.Insurer_Request = docLog.Insurer_Request.toString().replace('___policy_tenure___', '1');
                     docLog.Insurer_Request = docLog.Insurer_Request.toString().replace('"PolicyTenure": "3"', '"PolicyTenure": "1"');
                     }*/
                }
            }

            if ((!is_tp_only) && this.lm_request['product_id'] === 1 && this.lm_request['is_breakin'] === 'yes' && specific_insurer_object.method.Method_Type === 'Proposal') {
                var args = {
                    json: '[' + docLog.Insurer_Request + ']'
                };
                console.log("args : ", args);
                specific_insurer_object.method.Service_URL = 'http://168.87.83.117/Api/MotoVeysClaimLook.asmx?WSDL';
                specific_insurer_object.method.Method_Action = 'CreateLeadJson';
                soap.createClient(specific_insurer_object.method.Service_URL, function (err, client) {
                    client[specific_insurer_object.method.Method_Action](args, function (err1, result, raw, soapHeader) {
                        if (err1) {
                            console.error('LibertyVideoconMotor', 'service_call', 'exception', err1);
                            var objResponseFull = {
                                'err': err1,
                                'result': result,
                                'raw': raw,
                                'soapHeader': soapHeader,
                                'objResponseJson': null
                            };
                            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                        } else {
                            var processedJson = "";
                            if (result.CreateLeadJsonResult) {
                                processedJson = result.CreateLeadJsonResult;
                                processedJson = processedJson.replace('[', '');
                                processedJson = processedJson.replace(']', '');
                                processedJson = JSON.parse(processedJson);
                            }
                            console.log("processedXml : ", processedJson);
                            var objResponseFull = {
                                'err': err,
                                'result': result,
                                'raw': raw,
                                'soapHeader': soapHeader,
                                'objResponseJson': processedJson
                            };
                            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                        }
                    });
                });
            } else {
                var args = {
                    data: JSON.parse(docLog.Insurer_Request),
                    headers: { "Content-Type": "application/json" }
                };
                if (specific_insurer_object.method.Method_Calling_Type === 'POST') {
                    client.post(specific_insurer_object.method_file_url + specific_insurer_object.method.Method_Action, args, function (data, response) {
                        // parsed response body as js object 
                        console.log(data);
                        // raw response 
                        console.log(response);
                        var objResponseFull = {
                            'err': null,
                            'result': null,
                            'raw': JSON.stringify(data),
                            'soapHeader': null,
                            'objResponseJson': data
                        };
                        var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                        if (specific_insurer_object.method.Method_Type === 'Idv') {
                            objInsurerProduct.insurer_vehicle_idv_handler(serviceBreakup, objProduct, Insurer_Object, specific_insurer_object);
                        }
                    });
                }
                if (specific_insurer_object.method.Method_Calling_Type === 'GET') {
                    function jsonToQueryString(json) {
                        return '?' +
                            Object.keys(json).map(function (key) {
                                return encodeURIComponent(key) + '=' +
                                    encodeURIComponent(json[key]);
                            }).join('&');
                    }
                    var qs = jsonToQueryString(args.data);
                    let txt_service_url = '';
                    if (is_tp_only) {
                        txt_service_url = specific_insurer_object.method_file_url + specific_insurer_object.method.Method_Action_SATP;
                        console.error('LibertPDFURL', txt_service_url + qs);
                    } else {
                        txt_service_url = specific_insurer_object.method_file_url + specific_insurer_object.method.Method_Action;
                        console.error('LibertPDFURL', txt_service_url + qs);
                    }
                    client.get(txt_service_url + qs, function (data, response) {
                        // parsed response body as js object 
                        console.log(data);
                        // raw response 
                        console.log(response);
                        var objResponseFull = {
                            'err': null,
                            'result': null,
                            'raw': JSON.stringify(data),
                            'soapHeader': null,
                            'objResponseJson': data
                        };
                        var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                    });
                }
            }
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};
LibertyVideoconMotor.prototype.idv_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'idv_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    //check error start
    try {
        if (objResponseJson.hasOwnProperty('ErrorText')) {
            if (objResponseJson['ErrorText']) {
                Error_Msg = objResponseJson['ErrorText'];
            }
        }

        if (Error_Msg === 'NO_ERR') {
            var Idv_Breakup = this.const_idv_breakup;
            if (objResponseJson['CurrentIDV']) {
                Idv_Breakup["Idv_Normal"] = parseInt(objResponseJson['CurrentIDV'] * 10 / 9); // getting idv at 90 % so counting to 100 and 110
                Idv_Breakup["Idv_Min"] = parseInt(Idv_Breakup["Idv_Normal"] * 0.90);
                Idv_Breakup["Idv_Max"] = parseInt(Idv_Breakup["Idv_Normal"] * 1.10);

                Idv_Breakup["Idv_Normal"] = parseInt(objResponseJson['CurrentIDV']); // getting idv at 90 % so counting to 100 and 110
                Idv_Breakup["Idv_Min"] = parseInt(objResponseJson["MinIDV"]);
                Idv_Breakup["Idv_Max"] = parseInt(objResponseJson["MaxIDV"]);
                Idv_Breakup["Exshowroom"] = 0;
                objServiceHandler.Premium_Breakup = Idv_Breakup;
                objServiceHandler.Insurer_Transaction_Identifier = '';
            } else {
                Error_Msg = 'LM_IDV_NODE_EMPTY';
            }
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'idv_response_handler', objServiceHandler);
        return objServiceHandler;
    } catch (ex) {
        objServiceHandler.Error_Msg = ex;
        console.error('Exception', this.constructor.name, 'idv_response_handler', ex);
        return objServiceHandler;
    }
};
LibertyVideoconMotor.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var objPremiumService = objResponseJson;
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    //check error start
    try {
        if (objResponseJson.hasOwnProperty('ErrorText')) {
            if (objResponseJson['ErrorText']) {
                Error_Msg = objResponseJson['ErrorText'];
            }
        }

        if (Error_Msg === 'NO_ERR') {
            if (objPremiumService.hasOwnProperty('LegalliabilityToEmployeeValue') && objPremiumService.LegalliabilityToEmployeeValue > 0 && this.lm_request['vehicle_registration_type'] === 'corporate') {
                objPremiumService['BasicTPPremium'] = objPremiumService.LegalliabilityToEmployeeValue + objPremiumService.BasicTPPremium;
            }
            var premium_breakup = this.const_premium_breakup;

            for (var key in this.premium_breakup_schema) {
                if (typeof this.premium_breakup_schema[key] === 'object') {
                    var group_final = 0, group_final_key = '';
                    for (var sub_key in this.premium_breakup_schema[key]) {
                        var premium_key = this.premium_breakup_schema[key][sub_key];
                        var premium_val = 0;
                        if (premium_key && objPremiumService.hasOwnProperty(premium_key)) {
                            premium_val = parseInt(objPremiumService[premium_key]);
                        }
                        premium_val = isNaN(premium_val) ? 0 : premium_val;
                        premium_breakup[key][sub_key] = premium_val;
                        if (sub_key === 'od_disc') {
                            var total_disc = 0;
                            total_disc += parseInt(objPremiumService['Discount']);
                            total_disc += parseInt(objPremiumService['Loading']);
                            premium_breakup[key][sub_key] = total_disc;
                            premium_val = total_disc;
                        }

                        if (sub_key.indexOf('_final_') > -1) {
                            group_final_key = sub_key;
                        } else if (sub_key.indexOf('_disc') > -1) {
                            group_final -= premium_val;
                        } else if (sub_key === 'tp_cover_tppd') {
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
                        premium_val = parseInt(objPremiumService[premium_key]);
                    }
                    premium_val = isNaN(premium_val) ? 0 : premium_val;
                    premium_breakup[key] = premium_val;
                }
            }
            /*if (objResponseJson.hasOwnProperty('PassengerAssistCoverValue')) {
             if ((objResponseJson['PassengerAssistCoverValue'] - 0 > 0) && (premium_breakup['addon']['addon_zero_dep_cover'] - 0 > 0)) {
             premium_breakup['addon']['addon_zero_dep_cover'] = ((premium_breakup['addon']['addon_zero_dep_cover'] - 0) + (objResponseJson['PassengerAssistCoverValue'] - 0));
             }
             }*/
            if (this.lm_request['is_tppd'] === 'yes') {
                premium_breakup['liability']['tp_cover_tppd'] = objPremiumService['TPPDCoverValue'];
            }
            objServiceHandler.Premium_Breakup = premium_breakup;
            objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['CustomerID'];
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);

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
LibertyVideoconMotor.prototype.insurer_vehicle_idv = function (objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback) {
    try {
        console.log('Start', this.constructor.name, 'insurer_vehicle_idv');
        var objInsurerProduct = this;
        var Insurer_Id = specific_insurer_object['insurer_id'];
        /*var lm_idv_request = this.lm_request;
         lm_idv_request['insurer_id'] = Insurer_Id;
         lm_idv_request['method_type'] = 'Idv';
         lm_idv_request['execution_async'] = 'no';
         var Base = require(appRoot + '/libs/Base');
         var objBase = new Base();
         objBase.request_id = this.create_guid('SRN-');
         objBase.response_object = objProduct.response_object;
         objBase.request_process_handler = 'this.insurer_vehicle_idv_handler(\'' + this.docRequest.Request_Unique_Id + '\');';
         objBase.request_process(lm_idv_request);
         */

        var IdvMethod = this.ArrayFindByKey(Insurer_Object.Method_List, 'Method_Type', 'Idv');
        specific_insurer_object.method = IdvMethod;
        if (specific_insurer_object.method.Service_File && fs.existsSync(appRoot + '/resource/wsdl/' + specific_insurer_object.method.Service_File)) {
            specific_insurer_object['method_file_url'] = appRoot + '/resource/wsdl/' + specific_insurer_object.method.Service_File;
        } else {
            specific_insurer_object['method_file_url'] = specific_insurer_object.method.Service_URL;
        }
        var method_content = fs.readFileSync(appRoot + '/resource/request_file/' + IdvMethod.Method_Request_File).toString();
        /*if ((this.lm_request['ss_id'] - 0) == 487) {
         this.lm_request['is_posp'] = 'yes';
         var obj_posp = {
         "posp_category": "PolicyBoss",
         "posp_reporting_agent_name": "POLICY BOSS WEBSITE",
         "posp_reporting_agent_uid": 508389,
         "posp_posp_category": 0,
         "posp_gender": 0,
         "posp_erp_id": 654321,
         "posp_ss_id": 0,
         "posp_sources": 0,
         "posp_aadhar": '123456789123',
         "posp_pan_no": 'ATIPM8172H',
         "posp_mobile_no": '9999999999',
         "posp_agent_city": 0,
         "posp_email_id": 0,
         "posp_last_name": 'Posp',
         "posp_middle_name": 0,
         "posp_first_name": 'Landmark',
         "posp_sm_posp_name": 0,
         "posp_sm_posp_id": 0,
         "posp_fba_id": 0,
         "posp_posp_id": 0
         };
         for (var k in obj_posp) {
         this.lm_request[k] = obj_posp[k];
         }
         }*/

        if (this.lm_request['is_posp'] === 'yes') {
            if (config.environment.name === 'Production') {

            } else {
                //this.prepared_request['insurer_integration_agent_code'] = 'IMD1022569';
                //this.processed_request['___insurer_integration_agent_code___'] = 'IMD1022569';
                method_content = method_content.replace('"PolicyBoss"', '"TPService"');
            }

            method_content = method_content.replace('<!--POS_CONFIG_START-->', '');
            method_content = method_content.replace('<!--POS_CONFIG_FINISH-->', '');
            for (var k in this.lm_request) {
                if (k.indexOf('posp_') === 0) {
                    method_content = method_content.replace('___' + k + '___', this.lm_request[k]);
                }
            }
        } else {
            if (config.environment.name === 'Production') {

            } else {
                method_content = method_content.replace('"PolicyBoss"', '"TPService"');
            }
        }
        method_content = method_content.replace('___lv_quote_no___', this.lv_quote_no());
        method_content = method_content.replace('___vehicle_expected_idv___', '0');
        method_content = method_content.replace('___is_pa_od___', 'yes');
        method_content = method_content.replace('___is_pa_od_license___', 'no');
        method_content = method_content.replace('___is_pa_od_cpa___', 'no');
        var obj_addon_replace = {};
        for (var k in this.const_addon_master) {
            obj_addon_replace['___' + k + '___'] = 'no';
            obj_addon_replace['___' + k + '_2___'] = 'false';
        }
        method_content = method_content.replaceJson(obj_addon_replace);
        if (this.lm_request['vehicle_insurance_type'] === 'new') {
            this.prepared_request['registration_no_1'] = 'NEW';
            this.prepared_request['registration_no_2'] = '';
            this.prepared_request['registration_no_3'] = '';
            this.prepared_request['registration_no_4'] = '';

            this.processed_request['___registration_no_1___'] = 'NEW';
            this.processed_request['___registration_no_2___'] = '';
            this.processed_request['___registration_no_3___'] = '';
            this.processed_request['___registration_no_4___'] = '';
        }
        this.prepared_request['tp_end_date'] = moment(this.prepared_request['policy_expiry_date']).add(3, "years").format('DD/MM/YYYY');
        this.processed_request['___tp_end_date___'] = this.prepared_request['tp_end_date'];
        if (this.lm_request['vehicle_registration_type'] === 'corporate') {
            method_content = method_content.replace('___is_pa_od___', 'no');
            //this.method_content = this.method_content.replace('___is_llpd_emp___', 'yes');
            if (this.lm_request['product_id'] === 10) {
                method_content = method_content.replace('___is_llpd_emp___', 'no');
                method_content = method_content.replace('___is_llpd_emp_2___', '');
            } else {
                method_content = method_content.replace('___is_llpd_emp___', 'yes');
                method_content = method_content.replace('___is_llpd_emp_2___', this.processed_request['___dbmaster_insurer_vehicle_seatingcapacity___']);
            }
        } else {
            method_content = method_content.replace('___is_llpd_emp___', 'no');
            method_content = method_content.replace('___is_llpd_emp_2___', '0');
        }

                this.insurer_product_field_process_pre();
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
LibertyVideoconMotor.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';

    try {
        var lead_Id = '';
        var objPremiumService = objResponseJson;
        if (this.lm_request['product_id'] === 1 && this.lm_request['is_breakin'] === 'yes' && this.lm_request['is_inspection_done'] === 'no'
            && (this.lm_request.hasOwnProperty('vehicle_insurance_subtype') && this.lm_request['vehicle_insurance_subtype'] !== "0CH_1TP")) {
            if (objPremiumService.hasOwnProperty('Error')) {
                if (objPremiumService['Error'] === "Success") {
                    lead_Id = objPremiumService['LeadID'];
                } else {
                    Error_Msg = objPremiumService['Error'];
                }
            } else {
                Error_Msg = JSON.stringify(objPremiumService);
            }
        } else {
            if (objPremiumService.hasOwnProperty('ErrorText')) {
                if (objPremiumService['ErrorText'] !== null) {
                    Error_Msg = objPremiumService['ErrorText'];
                }
            } else {
                Error_Msg = objPremiumService;
            }
        }

        if (Error_Msg === 'NO_ERR') {
            if (this.lm_request['product_id'] === 1 && this.lm_request['is_breakin'] === 'yes' && this.lm_request['is_inspection_done'] === 'no' && (this.prepared_request['Plan_Name'] !== 'TP')) {
                if (lead_Id !== '') {
                    var myobj = {
                        PB_CRN: parseInt(this.lm_request['crn']),
                        UD_Id: this.lm_request['udid'],
                        SL_Id: this.lm_request['slid'],
                        Insurer_Id: 33,
                        Request_Unique_Id: this.processed_request['___dbmaster_pb_request_unique_id___'],
                        Service_Log_Unique_Id: this.processed_request['___dbmaster_pb_service_log_unique_id___'],
                        Agent_Code: this.processed_request['___insurer_integration_agent_code___'],
                        Inspection_Id: lead_Id,
                        Status: 'INSPECTION_SCHEDULED',
                        Registration_No: this.lm_request['registration_no'], //"MH-02-GG-5464",
                        Chassis_No: this.lm_request['chassis_number'],
                        Engine_No: this.lm_request['engine_number'],
                        Insurer_Status: 'NOT_CHECKED',
                        Created_On: new Date(),
                        Modified_On: ''
                    };
                    var MongoClient = require('mongodb').MongoClient;
                    MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                        if (err)
                            throw err;
                        var inspectionSchedules = db.collection('inspection_schedules');
                        inspectionSchedules.insertOne(myobj, function (err, res) {
                            if (err)
                                throw err;
                        });
                    });
                    /*var inspectionSchedules = require(appRoot + '/models/inspection_schedule');
                     inspectionSchedules.insertOne(myobj, function (err, res) {
                     if (err)
                     throw err;
                     });*/
                } else {
                    Error_Msg = 'Inspection Id not found proposal_response_handler';
                }

                var inspection_link = '';
                if (config.environment.approver_env) {
                    inspection_link = 'https://www.policyboss.com/inspect_approve/inspect.html?ARN=' + this.lm_request['api_reference_number'];
                } else {
                    inspection_link = config.environment.portalurl + '/inspect_approve/inspect.html?ARN=' + this.lm_request['api_reference_number'];
                }
                var objRequestCore = {
                    'customer_name': this.lm_request['first_name'] + ' ' + this.lm_request['last_name'],
                    'crn': this.lm_request['crn'],
                    'vehicle_text': this.lm_request['vehicle_text'],
                    'insurer_name': 'LIBERTY GENERAL INSURANCE COMPANY LTD.',
                    'insurance_type': 'RENEW - Breakin Case',
                    'inspection_id': lead_Id,
                    'final_premium': Math.round(this.lm_request['final_premium']),
                    'inspection_link': inspection_link
                };

                try {
                    var email_data = fs.readFileSync(appRoot + '/resource/email/Send_Proposal_Link_Breakin.html').toString();
                    var User_Data = require(appRoot + '/models/user_data');
                    var ud_cond = { "User_Data_Id": this.lm_request.udid - 0 };
                    var emailto = this.lm_request['email'];

                    User_Data.findOne(ud_cond, function (err, dbUserData) {
                        if (err) {
                            console.error('Exception', err);
                        } else {
                            objRequestCore['registration_no'] = dbUserData.Proposal_Request['registration_no_1'] + '-' + dbUserData.Proposal_Request['registration_no_2'] + '-' + dbUserData.Proposal_Request['registration_no_3'] + '-' + dbUserData.Proposal_Request['registration_no_4'];
                            var processed_request = {};
                            for (var key in objRequestCore) {
                                if (typeof objRequestCore[key] !== 'object') {
                                    processed_request['___' + key + '___'] = objRequestCore[key];
                                }
                            }
                            email_data = email_data.replaceJson(processed_request);

                            var sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[Car] Vehicle Inspection Request CRN : ' + dbUserData['PB_CRN'];
                            var Email = require(appRoot + '/models/email');
                            var objModelEmail = new Email();
                            var email_agent = '';
                            if (dbUserData.Premium_Request['posp_email_id'] !== null && dbUserData.Premium_Request['posp_email_id'].toString().indexOf('@') > -1) {
                                email_agent = dbUserData.Premium_Request['posp_email_id'].toString();
                            }
                            var arr_bcc = ['horizon.lm.notification@gmail.com'];
                            if (dbUserData.Premium_Request.hasOwnProperty('posp_reporting_email_id') && dbUserData.Premium_Request['posp_reporting_email_id'] !== 0 && dbUserData.Premium_Request['posp_reporting_email_id'] !== '' && dbUserData.Premium_Request['posp_reporting_email_id'] !== null) {
                                if (dbUserData.Premium_Request['posp_reporting_email_id'].indexOf('@') > -1) {
                                    arr_bcc.push(dbUserData.Premium_Request['posp_reporting_email_id']);
                                }
                            }
                            if (config.environment.name === 'Production') {
                                if ((dbUserData.Premium_Request['posp_sources'] - 0) > 0) {
                                    if ((dbUserData.Premium_Request['posp_sources'] - 0) === 1) {
                                        arr_bcc.push('transactions@magicfinmart.com');//finmart-dc 
                                    }
                                }
                            }
                            objModelEmail.send('customercare@policyboss.com', emailto, sub, email_data, email_agent, arr_bcc.join(','), dbUserData['PB_CRN']);
                        }
                    });
                } catch (ex2) {
                    console.error('Exception', this.constructor.name, 'proposal_response_handler', ex2);
                }
                objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['LeadID'];
            } else {
                var objPremiumVerification = this.premium_verification(this.lm_request['final_premium'], objPremiumService['TotalPremium']);
                if (objPremiumVerification.Status || true) {
                    var pg_data = {
                        'SURL': this.const_payment.pg_ack_url,
                        'FURL': this.const_payment.pg_ack_url,
                        'txnid': this.method_processed_request['lv_quote_no'],
                        'key': "gtKFFx",
                        'amount': objPremiumService['TotalPremium'],
                        'FirstName': this.lm_request['first_name'],
                        'productinfo': "Liverty Videocon Payment Info",
                        'Email': this.lm_request['email'],
                        'Phone': this.lm_request['mobile'],
                        'quotationNumber': objPremiumService['QuotationNumber'],
                        'customerID': objPremiumService['CustomerID']
                    };


                    objServiceHandler.Payment.pg_data = pg_data;
                    objServiceHandler.Payment.pg_redirect_mode = 'POST';
                } else {
                    Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
                }
                objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['CustomerID'];
            }
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

LibertyVideoconMotor.prototype.pg_response_handler = function () {
    //    {
    //  "mihpayid": "403993715516624116",
    //  "mode": null,
    //  "status": "failure",
    //  "unmappedstatus": "userCancelled",
    //  "key": "gtKFFx",
    //  "txnid": "8166182-90629",
    //  "amount": "1414.00",
    //  "discount": "0.00",
    //  "net_amount_debit": "0.00",
    //  "addedon": "2017-09-18+16%3A44%3A10",
    //  "productinfo": "Liverty+Videocon+Payment+Info",
    //  "firstname": "MANISH",
    //  "lastname": "ANAND",
    //  "address1": null,
    //  "address2": null,
    //  "city": null,
    //  "state": null,
    //  "country": null,
    //  "zipcode": null,
    //  "email": "ANAND.MANISH92%40GMAIL.COM",
    //  "phone": "9798192909",
    //  "udf1": null,
    //  "udf2": null,
    //  "udf3": null,
    //  "udf4": null,
    //  "udf5": null,
    //  "udf6": null,
    //  "udf7": null,
    //  "udf8": null,
    //  "udf9": null,
    //  "udf10": null,
    //  "hash": "59601b7d07266aa00f7c02dc35787bc0f92dd215a23819b474bb0541f8ddb4792f20b3100afcbb3c67ffa7f4763fba44b0e9b5d0c283b20e5ed908494c562c72",
    //  "field1": null,
    //  "field2": null,
    //  "field3": null,
    //  "field4": null,
    //  "field5": null,
    //  "field6": null,
    //  "field7": null,
    //  "field8": null,
    //  "field9": "Cancelled+by+user",
    //  "payment_source": "payu",
    //  "PG_TYPE": null,
    //  "bank_ref_num": null,
    //  "bankcode": null,
    //  "error": "E1605",
    //  "error_Message": "Transaction+failed+due+to+customer+pressing+cancel+button"
    //}
    try {
        var objInsurerProduct = this;
        this.const_policy.pg_status = '';
        this.const_policy.transaction_id = objInsurerProduct.const_payment_response.pg_post['txnid'];
        if (objInsurerProduct.const_payment_response.pg_post['status'] === 'success') {
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.transaction_amount = objInsurerProduct.const_payment_response.pg_post['amount'];
            this.const_policy.pg_reference_number_1 = objInsurerProduct.const_payment_response.pg_post['txnid'];
        }
        if (objInsurerProduct.const_payment_response.pg_post['status'] === 'failure') {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
            this.const_policy.pg_message = objInsurerProduct.const_payment_response.pg_post['error_Message'];
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};

LibertyVideoconMotor.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var objInsurerProduct = this;
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
        if (objInsurerProduct.const_policy.pg_status === 'SUCCESS') {

            var objPremiumService = objResponseJson;
            if (objPremiumService.hasOwnProperty('ErrorText')) {
                if (objPremiumService['ErrorText'] !== null) {
                    Error_Msg = objPremiumService['ErrorText'];
                } else if (objPremiumService['Message'] !== 'Policy Generated Successfully') {
                    Error_Msg = objPremiumService;
                }
            } else {
                Error_Msg = objPremiumService;
            }

            if (Error_Msg === 'NO_ERR') {//verification success
                if (objPremiumService.hasOwnProperty('PolicyNumber') && objPremiumService['PolicyNumber'] !== '') {
                    this.const_policy.policy_number = objPremiumService['PolicyNumber'];
                    this.const_policy.transaction_status = 'SUCCESS';
                    var product_name = 'CAR';
                    if (objInsurerProduct.lm_request['product_id'] === 10) {
                        product_name = 'TW';
                    }
                    var pdf_file_name = objInsurerProduct.constructor.name + '_' + product_name + '_' + objPremiumService['PolicyNumber'] + '.pdf';
                    var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                    var pdf_web_path = config.environment.weburl + "/pdf/" + pdf_file_name;
                    this.const_policy.policy_url = pdf_web_path;

                    var Client = require('node-rest-client').Client;
                    var client = new Client();
                    var args = {
                        data: {
                            "search_reference_number": objInsurerProduct.lm_request['search_reference_number'],
                            "api_reference_number": objInsurerProduct.lm_request['api_reference_number'],
                            "policy_number": objInsurerProduct.const_policy.policy_number,
                            'client_key': objInsurerProduct.lm_request['client_key'],
                            'secret_key': objInsurerProduct.lm_request['secret_key'],
                            'insurer_id': objInsurerProduct.lm_request['insurer_id'],
                            'email': objInsurerProduct.lm_request['email'],
                            'mobile': objInsurerProduct.lm_request['mobile'],
                            'method_type': 'Pdf',
                            'execution_async': 'no'
                        },
                        headers: {
                            "Content-Type": "application/json",
                            'client_key': objInsurerProduct.lm_request['client_key'],
                            'secret_key': objInsurerProduct.lm_request['secret_key']
                        }
                    };
                    this.pdf_call(config.environment.weburl + '/quote/pdf_initiate', args, pdf_sys_loc);
                    //                    client.post(config.environment.weburl + '/quote/pdf_initiate', args, function (data, response) {
                    //
                    //                    });
                } else {
                    this.const_policy.transaction_status = 'PAYPASS';
                }
                this.const_policy.policy_number.transaction_identifier = objPremiumService['PaymentID'];//objPremiumService['policy_id'];
                objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['PaymentID'];
            } else {
                this.const_policy.transaction_status = 'PAYPASS';
            }

        }
        objServiceHandler.Policy = objInsurerProduct.const_policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);

    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
LibertyVideoconMotor.prototype.pdf_call = function (url, args, pdf_sys_loc) {
    try {
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
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pdf_call', ex);
    }
};
LibertyVideoconMotor.prototype.pdf_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'pdf_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        var objPremiumService = objResponseJson;
        if (objPremiumService.hasOwnProperty('ErrorText')) {
            if (objPremiumService['ErrorText'] !== null) {
                Error_Msg = objPremiumService['ErrorText'];
            }
        } else {
            Error_Msg = objPremiumService;
        }
        var policy = {
            'policy_url': null,
            'policy_number': this.lm_request['policy_number'],
            'pdf_status': null
        };
        if (Error_Msg === 'NO_ERR') {
            if (objPremiumService.hasOwnProperty('policyBytePDF') && objPremiumService['policyBytePDF'] !== '') {
                var product_name = 'CAR';
                if (this.lm_request['product_id'] === 10) {
                    product_name = 'TW';
                }
                var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.lm_request['policy_number'] + '.pdf';
                var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                var pdf_web_path = config.environment.weburl + "/pdf/" + pdf_file_name;
                var binary = new Buffer(objPremiumService['policyBytePDF'], 'base64');
                fs.writeFileSync(pdf_sys_loc, binary);
                policy.policy_url = pdf_web_path_portal;
                policy.pdf_status = 'SUCCESS';
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
LibertyVideoconMotor.prototype.lv_quote_no = function () {
    try {
        return new Date().getTime();
        //return this.create_guid('', 'numeric', 7);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'lv_quote_no', ex);
        return 0;
    }
};
LibertyVideoconMotor.prototype.policy_end_date_2 = function () {
    var pol_end_date = '';
    var policy_tenure = 1;
    try {
        pol_end_date = new Date();
        if (this.lm_request.hasOwnProperty('policy_od_tenure') && (this.lm_request['policy_od_tenure'] - 0) > 0) {
            policy_tenure = (this.lm_request['policy_od_tenure'] - 0);
        }
        if (this.lm_request['vehicle_insurance_type'] === 'new') {
            let nb_policy_tenure = 0;
            if (this.lm_request['product_id'] === 1 && this.lm_request['vehicle_insurance_subtype'] === '0CH_3TP') {
                nb_policy_tenure = 3;
            } else if (this.lm_request['product_id'] === 10 && this.lm_request['vehicle_insurance_subtype'] === '0CH_5TP') {
                nb_policy_tenure = 5;
            } else {
                nb_policy_tenure = policy_tenure;
            }
            pol_end_date = moment(this.lm_request['policy_expiry_date']);
            pol_end_date.add(nb_policy_tenure, 'years');
            pol_end_date.subtract(1, 'day');
            //pol_end_date.setDate(pol_end_date.getDate() - 1);
            //pol_end_date.setFullYear(pol_end_date.getFullYear() + nb_policy_tenure);
        }
        if (this.lm_request['vehicle_insurance_type'] === 'renew') {
            var days_diff = moment(this.todayDate()).diff(this.lm_request['policy_expiry_date'], 'days');
            //for expired case
            if (days_diff > 0) {
                var today_date = moment(this.todayDate());
                pol_end_date = today_date.add(policy_tenure, 'years');
                //var today_date = new Date(this.todayDate());
                //pol_end_date.setDate(today_date.getDate() + 1);
                //pol_end_date.setFullYear(today_date.getFullYear() + policy_tenure);
            } else { // for not expired case
                var expiry_date = moment(this.lm_request['policy_expiry_date']);
                pol_end_date = expiry_date;
                pol_end_date.add(policy_tenure, 'years');
                //var expiry_date = new Date(this.lm_request['policy_expiry_date']);
                //var pol_end_date = expiry_date;
                //pol_end_date.setFullYear(expiry_date.getFullYear() + policy_tenure);
            }
        }
        pol_end_date = this.date_format(pol_end_date, this.insurer_date_format);
        console.log('Finish', this.constructor.name, 'policy_end_date', pol_end_date);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'policy_end_date_2', ex);
        return pol_end_date;
    }
    return pol_end_date;
};
LibertyVideoconMotor.prototype.premium_breakup_schema = {
    "own_damage": {
        "od_basic": 'BasicODPremium',
        "od_elect_access": 'ElectricalAccessoriesValue',
        "od_non_elect_access": 'NonElectricalAccessoriesValue',
        "od_cng_lpg": 'FuelKitValueODpremium',
        "od_disc_ncb": 'DisplayNCBDiscountvalue',
        "od_disc_vol_deduct": 'VoluntaryExcessValue',
        "od_disc_anti_theft": 'AntiTheftDiscountValue',
        "od_disc_aai": 'AAIMembershipValue',
        "od_loading": '',
        "od_disc": 'Loading', //Discount
        "od_final_premium": 0
    },
    "liability": {
        "tp_basic": 'BasicTPPremium',
        "tp_cover_owner_driver_pa": 'PAToOwnerDrivervalue',
        "tp_cover_unnamed_passenger_pa": 'PAToUnnmaedPassengerValue',
        "tp_cover_named_passenger_pa": 'PatoNamedPassengerValue',
        "tp_cover_paid_driver_pa": 'PatoPaidDrivervalue',
        "tp_cover_tppd": 'TPPDCoverValue',
        "tp_cover_paid_driver_ll": 'LegalliabilityToPaidDriverValue',
        "tp_cng_lpg": 'FuelKitValueTPpremium',
        "tp_final_premium": 'TotalTPPremiumValue'
    },
    "addon": {
        "addon_zero_dep_cover": 'NilDepValue',
        "addon_road_assist_cover": 'RoadAssistCoverValue',
        "addon_ncb_protection_cover": null,
        "addon_engine_protector_cover": 'EngineCoverValue',
        "addon_invoice_price_cover": null,
        "addon_key_lock_cover": 'KeyLossCoverValue',
        "addon_consumable_cover": 'ConsumableCoverValue',
        "addon_daily_allowance_cover": null,
        "addon_windshield_cover": null,
        "addon_passenger_assistance_cover": 'PassengerAssistCoverValue',
        "addon_tyre_coverage_cover": null,
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
    "net_premium": 'NetPremium',
    "service_tax": 'GST',
    "final_premium": 'TotalPremium'
};
module.exports = LibertyVideoconMotor;
