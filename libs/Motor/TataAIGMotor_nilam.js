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
var config = require('config');
var moment = require('moment');
var enddate;
function TataAIGMotor() {

}
util.inherits(TataAIGMotor, Motor);

TataAIGMotor.prototype.lm_request_single = {};
TataAIGMotor.prototype.insurer_integration = {};
TataAIGMotor.prototype.insurer_addon_list = [];
TataAIGMotor.prototype.insurer = {};
TataAIGMotor.prototype.pdf_attempt = 0;
TataAIGMotor.prototype.insurer_date_format = 'yyyy-MM-dd';


TataAIGMotor.prototype.insurer_product_api_pre = function () {

};
TataAIGMotor.prototype.insurer_product_field_process_pre = function () {
    try {
        if (this.lm_request['method_type'] !== 'Status') {
            var is_tp = "no";
            if (this.lm_request.hasOwnProperty('vehicle_insurance_subtype')) {
                is_tp = this.lm_request["vehicle_insurance_subtype"].split("CH")[0] === "0" ? "yes" : "no";
            }

            is_tp = (this.lm_request.hasOwnProperty('vehicle_insurance_subtype') && this.lm_request["vehicle_insurance_subtype"].split("CH")[0] === "0") ? "yes" : "no";
            if (is_tp === "yes" && (this.lm_request["vehicle_insurance_subtype"] !== "1OD_0TP")) {
                this.prepared_request['policy_od_tenure'] = "1";
                this.processed_request['___policy_od_tenure___'] = this.prepared_request['policy_od_tenure'];
            }
            if (this.lm_request["vehicle_insurance_subtype"] === "1CH_2TP" || this.lm_request["vehicle_insurance_subtype"] === "1CH_4TP") {
                this.prepared_request['policy_tenure'] = "1";
                this.processed_request['___policy_tenure___'] = this.prepared_request['policy_tenure'];
            }
            if (this.lm_request["vehicle_insurance_subtype"] !== "1OD_0TP" && this.lm_request['method_type'] === 'Customer') {
                this.method_content = this.method_content.replace('___pre_policy_start_date___', '');
                this.method_content = this.method_content.replace('___policy_expiry_date___', '');
            }

            this.prepared_request['tyre_secure_options'] = (config.environment.name === 'Production') ? "DEPRECIATION BASIS" : "REPLACEMENT BASIS";
            this.processed_request['___tyre_secure_options___'] = this.prepared_request['tyre_secure_options'];
            this.prepared_request['engine_secure_options'] = (config.environment.name === 'Production') ? "WITH DEDUCTIBLE" : "WITHOUT DEDUCTIBLE";
            this.processed_request['___engine_secure_options___'] = this.prepared_request['engine_secure_options'];

            if (this.prepared_request.hasOwnProperty('addon_package_name')) {
                if (this.prepared_request['addon_package_name'] === "P1") {
                    this.prepared_request['plan_name'] = "SILVER";
                } else if (this.prepared_request['addon_package_name'] === "P2") {
                    this.prepared_request['plan_name'] = "GOLD";
                } else if (this.prepared_request['addon_package_name'] === "P3") {
                    this.prepared_request['plan_name'] = "PEARL";
                } else if (this.prepared_request['addon_package_name'] === "P4") {
                    this.prepared_request['plan_name'] = "PEARL+";
                } else if (this.prepared_request['addon_package_name'] === "P5") {
                    this.prepared_request['plan_name'] = "SAPPHIRE";
                } else if (this.prepared_request['addon_package_name'] === "P6") {
                    this.prepared_request['plan_name'] = "SAPPHIREPLUS";
                } else if (this.prepared_request['addon_package_name'] === "P7") {
                    this.prepared_request['plan_name'] = "SAPPHIRE++";
                } else if (this.prepared_request['addon_package_name'] === "P10") {
                    this.prepared_request['plan_name'] = "PLATINUM";
                } else if (this.prepared_request['addon_package_name'] === "P11") {
                    this.prepared_request['plan_name'] = "CORAL";
                } else if (this.prepared_request['addon_package_name'] === "P12") {
                    this.prepared_request['plan_name'] = "PEARL++";
                }

                if (this.prepared_request['addon_package_name'] === "SATP" || this.prepared_request['addon_package_name'] === "SAOD" || this.prepared_request['addon_package_name'] === "P1") {
                    this.prepared_request['plan_name'] = "";
                    this.prepared_request['addon_package_name'] = "";
                    this.processed_request['___addon_package_name___'] = this.prepared_request['addon_package_name'];
                    this.processed_request['___plan_name___'] = this.prepared_request['plan_name'];
                    this.prepared_request['prev_dep'] = "No";
                    this.processed_request['___prev_dep___'] = this.prepared_request['prev_dep'];
                    this.prepared_request['ncb_protection'] = "No";
                    this.processed_request['___ncb_protection___'] = this.prepared_request['ncb_protection'];
                    if (this.prepared_request['addon_package_name'] === "SATP") {
                        this.prepared_request['prev_rti'] = "No";
                        this.processed_request['___prev_rti___'] = this.prepared_request['prev_rti'];
                        this.prepared_request['no_of_claims'] = "0";
                        this.processed_request['___no_of_claims___'] = this.prepared_request['no_of_claims'];
                    } else {
                        this.prepared_request['prev_rti'] = "Yes";
                        this.processed_request['___prev_rti___'] = this.prepared_request['prev_rti'];
                        this.prepared_request['no_of_claims'] = "1";
                        this.processed_request['___no_of_claims___'] = this.prepared_request['no_of_claims'];
                    }
                } else {
                    this.prepared_request['prev_dep'] = "Yes";
                    this.processed_request['___prev_dep___'] = this.prepared_request['prev_dep'];
                    this.prepared_request['ncb_protection'] = "Yes";
                    this.processed_request['___ncb_protection___'] = this.prepared_request['ncb_protection'];
                    this.processed_request['___addon_package_name___'] = this.prepared_request['addon_package_name'];
                    this.processed_request['___plan_name___'] = this.prepared_request['plan_name'];
                    this.prepared_request['prev_rti'] = "Yes";
                    this.processed_request['___prev_rti___'] = this.prepared_request['prev_rti'];
                    this.prepared_request['no_of_claims'] = "1";
                    this.processed_request['___no_of_claims___'] = this.prepared_request['no_of_claims'];
                }
            } else {
                this.prepared_request['addon_package_name'] = "";
                this.processed_request['___addon_package_name___'] = this.prepared_request['addon_package_name'];
                this.prepared_request['plan_name'] = "";
                this.processed_request['___plan_name___'] = this.prepared_request['plan_name'];
                this.prepared_request['prev_dep'] = "No";
                this.processed_request['___prev_dep___'] = this.prepared_request['prev_dep'];
                this.prepared_request['ncb_protection'] = "No";
                this.processed_request['___ncb_protection___'] = this.prepared_request['ncb_protection'];
            }

            if (this.lm_request['vehicle_insurance_subtype'] === "1OD_0TP" && (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Customer')) {
                this.method_content = this.method_content.replace('___vehicle_insurance_subtype_2___', "Package");
                this.method_content = this.method_content.replace('___vehicle_insurance_subtype_3___', "05");
                this.method_content = this.method_content.replace('___vehicle_insurance_subtype_4___', "Standalone OD");
                this.prepared_request['ncb_protection'] = "No";
                this.processed_request['___ncb_protection___'] = this.prepared_request['ncb_protection'];
            }
            if (this.lm_request['vehicle_insurance_subtype'] === "1OD_0TP" && this.lm_request['method_type'] === 'Customer') {
                this.prepared_request['tp_insurer_code'] = this.insurer_master.tp_insurer.insurer_db_master['PreviousInsurer_Code'];
                this.processed_request['___tp_insurer_code___'] = this.prepared_request['tp_insurer_code'];
                var txt_replace = this.find_text_btw_key(this.method_content, ',<!--ODONLY_START-->', '<!--ODONLY_FINISH-->', true);
                if (txt_replace) {
                    this.method_content = this.method_content.replace(txt_replace, '');
                }
                this.method_content = this.method_content.replace('<!--ODONLY_START-->', '');
                this.method_content = this.method_content.replace('<!--ODONLY_FINISH-->', '');
            } else {
                var txt_replace = this.find_text_btw_key(this.method_content.toString(), '<!--ODONLY_START-->', '<!--ODONLY_FINISH-->', false);
                this.method_content = this.method_content.replace(txt_replace, '');
                this.method_content = this.method_content.replace('<!--ODONLY_START-->', '');
                this.method_content = this.method_content.replace('<!--ODONLY_FINISH-->', '');
            }

            if (this.lm_request['method_type'] === 'Verification') {
                if (this.proposal_processed_request.hasOwnProperty('___insurer_customer_identifier___')) {
                    this.prepared_request['payment_id'] = this.proposal_processed_request['___insurer_customer_identifier___'];
                    this.processed_request['___payment_id___'] = this.prepared_request['payment_id'];
                }
            }
            if (this.lm_request['method_type'] === 'Pdf') {
                if (this.lm_request.hasOwnProperty('encrypted_policyId')) {
                    this.prepared_request['encrypted_policyId'] = this.lm_request['encrypted_policyId'];
                    this.processed_request['___encrypted_policyId___'] = this.prepared_request['encrypted_policyId'];
                }
            }
            if (this.prepared_request["vehicle_registration_type"] === "corporate") {
                if (this.lm_request['method_type'] === 'Customer') {
                    this.prepared_request['salutation'] = 'M/s.';
                    this.processed_request['___salutation___'] = this.prepared_request['salutation'];
                    this.prepared_request['is_llpd'] = 'Yes';
                    this.processed_request['___is_llpd___'] = this.prepared_request['is_llpd'];
                }
                if (this.lm_request['product_id'] === 12) {
                    this.prepared_request["vehicle_registration_type"] = "Organization";
                }
            }

            if (this.prepared_request["vehicle_insurance_type"] === "new") {
                this.prepared_request['registration_no_1'] = "NEW";
                this.processed_request['___registration_no_1___'] = this.prepared_request['registration_no_1'];
                this.prepared_request['registration_no_2'] = "";
                this.processed_request['___registration_no_2___'] = this.prepared_request['registration_no_2'];
                this.prepared_request['registration_no_3'] = "";
                this.processed_request['___registration_no_3___'] = this.prepared_request['registration_no_3'];
                this.prepared_request['registration_no_4'] = "";
                this.processed_request['___registration_no_4___'] = this.prepared_request['registration_no_4'];
                this.prepared_request['prev_dep'] = "No";
                this.processed_request['___prev_dep___'] = this.prepared_request['prev_dep'];
                this.prepared_request['ncb_protection'] = "No";
                this.processed_request['___ncb_protection___'] = this.prepared_request['ncb_protection'];
                this.prepared_request['pucc_end_date'] = "";
                this.processed_request['___pucc_end_date___'] = this.prepared_request['pucc_end_date'];
                this.prepared_request['pucc_number'] = "";
                this.processed_request['___pucc_number___'] = this.prepared_request['pucc_number'];
                this.prepared_request['dbmaster_pb_previousinsurer_address'] = "";
                this.processed_request['___dbmaster_pb_previousinsurer_address___'] = this.prepared_request['dbmaster_pb_previousinsurer_address'];
            }

            if (this.prepared_request["vehicle_insurance_type"] === "new" && is_tp === "yes") {
                var policystartdate = new Date(this.prepared_request['policy_start_date']);
                var pol_start_date = policystartdate;
                pol_start_date.setDate(policystartdate.getDate() + 1);
                pol_start_date = this.date_format(pol_start_date, 'yyyy-MM-dd');
                var policyenddate = new Date(this.prepared_request['policy_end_date_extended']);
                var pol_end_date = policyenddate;
                pol_end_date.setDate(policyenddate.getDate() + 1);
                pol_end_date = this.date_format(pol_end_date, 'yyyy-MM-dd');

                this.prepared_request['policy_start_date'] = pol_start_date;
                this.processed_request['___policy_start_date___'] = this.prepared_request['policy_start_date'];

                this.prepared_request['policy_end_date_extended'] = pol_end_date.replace(/-/g, '');
                this.processed_request['___policy_end_date_extended___'] = this.prepared_request['policy_end_date_extended'];
            }

            if (this.prepared_request['vehicle_expected_idv'] - 0 > 0) {
                this.prepared_request['tata_revised_idv'] = this.prepared_request['vehicle_expected_idv'];
                this.processed_request['___tata_revised_idv___'] = this.prepared_request['tata_revised_idv'];
            } else {
                if (this.insurer_master.hasOwnProperty('vehicles')) {
                    this.prepared_request['tata_revised_idv'] = this.insurer_master['vehicles']['insurer_db_master']['Insurer_Vehicle_ExShowRoom'];
                    this.processed_request['___tata_revised_idv___'] = this.prepared_request['tata_revised_idv'];
                }
            }

            if (this.lm_request.hasOwnProperty('vehicle_registration_date') && this.lm_request['vehicle_registration_date'] !== "") {
                this.prepared_request['vehicle_registration_date'] = this.lm_request['vehicle_registration_date'];
                this.processed_request['___vehicle_registration_date___'] = this.prepared_request['vehicle_registration_date'];
            }

            if (this.prepared_request["financial_agreement_type"] === "0") {
                this.prepared_request['financial_agreement_type_2'] = "";
                this.processed_request['___financial_agreement_type_2___'] = this.prepared_request['financial_agreement_type_2'];
            } else {
                this.prepared_request['financial_agreement_type_2'] = this.prepared_request["financial_agreement_type"];
                this.processed_request['___financial_agreement_type_2___'] = this.prepared_request['financial_agreement_type_2'];
            }
            if (this.insurer_master.hasOwnProperty('vehicles')) {
                this.prepared_request['dbmaster_insurer_vehicle_exshowroom'] = this.insurer_master['vehicles']['insurer_db_master']['Insurer_Vehicle_ExShowRoom'];
            }
            this.processed_request['___dbmaster_insurer_vehicle_exshowroom___'] = this.prepared_request['dbmaster_insurer_vehicle_exshowroom'];

            if (this.lm_request.hasOwnProperty('electrical_accessory') && (parseInt(this.lm_request["electrical_accessory"]) > 0)) {
                this.prepared_request['electrical_accessory'] = this.lm_request['electrical_accessory'];
                this.processed_request['___electrical_accessory___'] = this.prepared_request['electrical_accessory'];
            } else {
                this.prepared_request['electrical_accessory'] = "";
                this.processed_request['___electrical_accessory___'] = this.prepared_request['electrical_accessory'];
            }

            if (this.lm_request.hasOwnProperty('non_electrical_accessory') && (parseInt(this.lm_request["non_electrical_accessory"]) > 0)) {
                this.prepared_request['non_electrical_accessory'] = this.lm_request['non_electrical_accessory'];
                this.processed_request['___non_electrical_accessory___'] = this.prepared_request['non_electrical_accessory'];
            } else {
                this.prepared_request['non_electrical_accessory'] = "";
                this.processed_request['___non_electrical_accessory___'] = this.prepared_request['non_electrical_accessory'];
            }

            if (this.lm_request.hasOwnProperty('is_external_bifuel')) {
                if (this.lm_request["is_external_bifuel"] === "yes") {
                    this.prepared_request['is_external_bifuel_value'] = "Yes";
                    this.processed_request['___is_external_bifuel_value___'] = this.prepared_request['is_external_bifuel_value'];
                } else {
                    this.prepared_request['is_external_bifuel_value'] = "No";
                    this.processed_request['___is_external_bifuel_value___'] = this.prepared_request['is_external_bifuel_value'];
                }
            }
            if (this.lm_request.hasOwnProperty('is_external_bifuel')) {
                if (this.lm_request["is_external_bifuel"] === "yes" && (this.lm_request["vehicle_insurance_subtype"].split('CH')[0] > 0 || this.lm_request["vehicle_insurance_subtype"] === "1OD_0TP")) {
                    var fuel_type = '';
                    if (this.lm_request['external_bifuel_type'].toLowerCase() === 'cng') {
                        fuel_type = 'EXTERNAL CNG';
                    }
                    if (this.lm_request['external_bifuel_type'].toLowerCase() === 'lpg') {
                        fuel_type = 'EXTERNAL LPG';
                    }
                    this.method_content = this.method_content.replace('___dbmaster_insurer_vehicle_fueltype___', fuel_type);

                    this.prepared_request['is_external_bifuel_value'] = "Yes";
                    this.processed_request['___is_external_bifuel_value___'] = this.prepared_request['is_external_bifuel_value'];
                } else {
                    this.prepared_request['is_external_bifuel_value'] = "No";
                    this.processed_request['___is_external_bifuel_value___'] = this.prepared_request['is_external_bifuel_value'];
                }
            }
            if (this.lm_request.hasOwnProperty('voluntary_deductible')) {
                if (this.lm_request["voluntary_deductible"] > 0) {
                    this.prepared_request['is_voluntary_deductible'] = "Y";
                    this.processed_request['___is_voluntary_deductible___'] = this.prepared_request['is_voluntary_deductible'];
                } else {
                    this.prepared_request['is_voluntary_deductible'] = "N";
                    this.processed_request['___is_voluntary_deductible___'] = this.prepared_request['is_voluntary_deductible'];
                }
            } else {
                this.prepared_request['is_voluntary_deductible'] = "N";
                this.processed_request['___is_voluntary_deductible___'] = this.prepared_request['is_voluntary_deductible'];
            }

            if (this.lm_request.hasOwnProperty('pa_unnamed_passenger_si')) {
                if (this.lm_request["pa_unnamed_passenger_si"] > 0) {
                    this.prepared_request['is_pa_unnamed_passenger_si'] = "Yes";
                    this.processed_request['___is_pa_unnamed_passenger_si___'] = this.prepared_request['is_pa_unnamed_passenger_si'];
                } else {
                    this.prepared_request['is_pa_unnamed_passenger_si'] = "No";
                    this.processed_request['___is_pa_unnamed_passenger_si___'] = this.prepared_request['is_pa_unnamed_passenger_si'];
                }
            } else {
                this.prepared_request['is_pa_unnamed_passenger_si'] = "No";
                this.processed_request['___is_pa_unnamed_passenger_si___'] = this.prepared_request['is_pa_unnamed_passenger_si'];
            }
            if (this.lm_request.hasOwnProperty('pa_owner_driver_si') && this.lm_request.hasOwnProperty('vehicle_insurance_subtype')) {
                if (this.lm_request["pa_owner_driver_si"] > 0 && this.lm_request["vehicle_insurance_subtype"] !== "1OD_0TP") {
                    if (this.lm_request['is_pa_od'] === 'yes') {
                        this.prepared_request['pa_owner_driver'] = "true";
                        this.processed_request['___pa_owner_driver___'] = this.prepared_request['pa_owner_driver'];

                        this.prepared_request['driver_declaration'] = "None";
                        this.processed_request['___driver_declaration___'] = this.prepared_request['driver_declaration'];
                    } else {
                        this.prepared_request['pa_owner_driver'] = "false";
                        this.processed_request['___pa_owner_driver___'] = this.prepared_request['pa_owner_driver'];

                        this.prepared_request['driver_declaration'] = "Have standalone CPA >= 15 L";
                        this.processed_request['___driver_declaration___'] = this.prepared_request['driver_declaration'];

                    }
                } else {
                    this.prepared_request['pa_owner_driver'] = "false";
                    this.processed_request['___pa_owner_driver___'] = this.prepared_request['pa_owner_driver'];

                    this.prepared_request['driver_declaration'] = "Have standalone CPA >= 15 L";
                    this.processed_request['___driver_declaration___'] = this.prepared_request['driver_declaration'];
                }
                //mgP102**** driver declaration
                if (this.lm_request['product_id'] === 12) {
                    if (this.lm_request['is_pa_od'] !== 'yes') {
                        this.prepared_request['driver_declaration'] = "ODD01";
                        this.processed_request['___driver_declaration___'] = this.prepared_request['driver_declaration'];
                    } else if (this.lm_request['is_having_valid_dl'] == 'no') {
                        this.prepared_request['driver_declaration'] = "ODD02";
                        this.processed_request['___driver_declaration___'] = this.prepared_request['driver_declaration'];
                    } else if (this.lm_request['is_having_valid_dl'] == 'no') {
                        this.prepared_request['driver_declaration'] = "ODD02";
                        this.processed_request['___driver_declaration___'] = this.prepared_request['driver_declaration'];
                    }
                }
            }

            this.prepared_request['segment_code'] = this.segement_code();
            this.processed_request['___segment_code___'] = this.prepared_request['segment_code'];

            this.prepared_request['fuel_code'] = this.tata_fuel_code();
            this.processed_request['___fuel_code___'] = this.prepared_request['fuel_code'];

            this.prepared_request['is_standalone'] = "N";
            this.processed_request['___is_standalone___'] = this.prepared_request['is_standalone'];

            if (is_tp === "yes") {
                this.prepared_request['covertype_code'] = 2;
                this.processed_request['___covertype_code___'] = this.prepared_request['covertype_code'];

                this.prepared_request['covertype_name'] = "Liability";
                this.processed_request['___covertype_name___'] = this.prepared_request['covertype_name'];

                this.prepared_request['tppolicytype'] = "Liability Only";
                this.processed_request['___tppolicytype___'] = this.prepared_request['tppolicytype'];

                this.prepared_request['tppolicytenure'] = "1";
                this.processed_request['___tppolicytenure___'] = this.prepared_request['tppolicytenure'];

                this.prepared_request['basic_od'] = "N";
                this.processed_request['___basic_od___'] = this.prepared_request['basic_od'];

                this.prepared_request['basic_tp'] = "Y";
                this.processed_request['___basic_tp___'] = this.prepared_request['basic_tp'];

                this.prepared_request['is_claim_exists'] = "false";
                this.processed_request['___is_claim_exists___'] = this.prepared_request['is_claim_exists'];

                this.prepared_request['vehicle_ncb_next'] = "";
                this.processed_request['___vehicle_ncb_next___'] = this.prepared_request['vehicle_ncb_next'];

            } else if (this.lm_request["vehicle_insurance_subtype"] === "1OD_0TP") {
                this.prepared_request['btype_code'] = "1";
                this.processed_request['___btype_code___'] = this.prepared_request['btype_code'];
                this.prepared_request['covertype_code'] = 3;
                this.processed_request['___covertype_code___'] = this.prepared_request['covertype_code'];
                this.prepared_request['covertype_name'] = "Standalone Own Damage";
                this.processed_request['___covertype_name___'] = this.prepared_request['covertype_name'];
                this.prepared_request['basic_od'] = "Y";
                this.processed_request['___basic_od___'] = this.prepared_request['basic_od'];
                this.prepared_request['basic_tp'] = "N";
                this.processed_request['___basic_tp___'] = this.prepared_request['basic_tp'];
                this.prepared_request['pa_owner_driver'] = "N";
                this.processed_request['___pa_owner_driver___'] = this.prepared_request['pa_owner_driver'];

                if (this.lm_request.hasOwnProperty('is_policy_exist') && (this.lm_request['is_policy_exist'] === "yes" || this.lm_request['is_policy_exist'] === "no")) {
                    this.prepared_request['tppolicytype'] = "Comprehensive Package";
                    this.processed_request['___tppolicytype___'] = this.prepared_request['tppolicytype'];
                    if (this.lm_request['product_id'] === 1) {
                        this.prepared_request['tppolicytenure'] = "3";
                        this.processed_request['___tppolicytenure___'] = this.prepared_request['tppolicytenure'];
                    } else {
                        this.prepared_request['tppolicytenure'] = "5";
                        this.processed_request['___tppolicytenure___'] = this.prepared_request['tppolicytenure'];
                    }
                } else {
                    this.prepared_request['tppolicytype'] = "Liability Only";
                    this.processed_request['___tppolicytype___'] = this.prepared_request['tppolicytype'];
                    this.prepared_request['tppolicytenure'] = "2";
                    this.processed_request['___tppolicytenure___'] = this.prepared_request['tppolicytenure'];
                }
            } else {
                this.prepared_request['covertype_code'] = 1;
                this.processed_request['___covertype_code___'] = this.prepared_request['covertype_code'];
                this.prepared_request['covertype_name'] = "Package";
                this.processed_request['___covertype_name___'] = this.prepared_request['covertype_name'];
                this.prepared_request['tppolicytype'] = "";
                this.processed_request['___tppolicytype___'] = this.prepared_request['tppolicytype'];
                this.prepared_request['tppolicytenure'] = "";
                this.processed_request['___tppolicytenure___'] = this.prepared_request['tppolicytenure'];
                this.prepared_request['basic_od'] = "Y";
                this.processed_request['___basic_od___'] = this.prepared_request['basic_od'];
                this.prepared_request['basic_tp'] = "Y";
                this.processed_request['___basic_tp___'] = this.prepared_request['basic_tp'];
            }
            if (this.lm_request['vehicle_insurance_type'] === "new") {
                this.prepared_request['registration_no_3'] = "";
                this.processed_request['___registration_no_3___'] = this.prepared_request['registration_no_3'];
                this.prepared_request['registration_no_4'] = "";
                this.processed_request['___registration_no_4___'] = this.prepared_request['registration_no_4'];

                this.prepared_request['vehicle_ncb_current'] = "";
                this.processed_request['___vehicle_ncb_current___'] = this.prepared_request['vehicle_ncb_current'];

                this.prepared_request['vehicle_ncb_next'] = "";
                this.processed_request['___vehicle_ncb_next___'] = this.prepared_request['vehicle_ncb_next'];

                this.prepared_request['policy_expiry_date'] = "";
                this.processed_request['___policy_expiry_date___'] = this.prepared_request['policy_expiry_date'];
            }

            if (this.lm_request['method_type'] === 'Customer' && this.lm_request["vehicle_insurance_subtype"] === "1OD_0TP") {
                this.prepared_request['is_standalone'] = "Y";
                this.processed_request['___is_standalone___'] = this.prepared_request['is_standalone'];
                this.prepared_request['tp_policy_number'] = this.lm_request['tp_policy_number'];
                this.processed_request['___tp_policy_number___'] = this.prepared_request['tp_policy_number'];
                //this.prepared_request['tp_start_date'] = this.lm_request['tp_start_date'].split("-").reverse().join("-").replace(/-/g, '');
                this.prepared_request['tp_start_date'] = this.lm_request['tp_start_date'].split("-").reverse().join("-");
                this.processed_request['___tp_start_date___'] = this.prepared_request['tp_start_date'];
                this.prepared_request['tp_end_date'] = this.lm_request['tp_end_date'].split("-").reverse().join("-");
                this.processed_request['___tp_end_date___'] = this.prepared_request['tp_end_date'];
            } else {
                this.prepared_request['is_standalone'] = "N";
                this.processed_request['___is_standalone___'] = this.prepared_request['is_standalone'];
                this.prepared_request['tp_policy_number'] = "";
                this.processed_request['___tp_policy_number___'] = this.prepared_request['tp_policy_number'];
                this.prepared_request['tp_start_date'] = "";
                this.processed_request['___tp_start_date___'] = this.prepared_request['tp_start_date'];
                this.prepared_request['tp_end_date'] = "";
                this.processed_request['___tp_end_date___'] = this.prepared_request['tp_end_date'];
            }

            if (this.lm_request['product_id'] === 10) {
                if (this.lm_request['is_breakin'] === "yes") {
                    var policystartdate = moment().add(2, 'days').format('YYYY-MM-DD');
                    var pol_start_date = policystartdate;
                    var policyenddate = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
                    policyenddate.setDate(policyenddate.getDate() + 1);
                    var pol_end_date = policyenddate;

                    this.prepared_request['policy_start_date'] = this.date_format(pol_start_date, 'yyyy-MM-dd').replace(/-/g, '');
                    this.processed_request['___policy_start_date___'] = this.prepared_request['policy_start_date'];

                    this.prepared_request['policy_end_date_extended'] = this.date_format(pol_end_date, 'yyyy-MM-dd').replace(/-/g, '');
                    this.processed_request['___policy_end_date_extended___'] = this.prepared_request['policy_end_date_extended'];
                }
                this.prepared_request['addon_key_lock_cover'] = "N";
                this.processed_request['___addon_key_lock_cover___'] = this.prepared_request['addon_key_lock_cover'];

                if (this.prepared_request['vehicle_age_year'] > 3) {
                    this.prepared_request['addon_zero_dep_cover'] = "N";
                    this.processed_request['___addon_zero_dep_cover___'] = this.prepared_request['addon_zero_dep_cover'];
                    this.prepared_request['addon_invoice_price_cover'] = "N";
                    this.processed_request['___addon_invoice_price_cover___'] = this.prepared_request['addon_invoice_price_cover'];
                    this.prepared_request['addon_consumable_cover'] = "N";
                    this.processed_request['___addon_consumable_cover___'] = this.prepared_request['addon_consumable_cover'];
                    this.prepared_request['addon_road_assist_cover'] = "N";
                    this.processed_request['___addon_road_assist_cover___'] = this.prepared_request['addon_road_assist_cover'];
                }
            }
        }
        if (this.lm_request['method_type'] === 'Customer') {
            this.prepared_request['proposal_id'] = this.insurer_master.service_logs.insurer_db_master.Insurer_Response.data[0]['data']['proposal_id'];
            this.processed_request['___proposal_id___'] = this.prepared_request['proposal_id'];

            if (this.lm_request['vehicle_insurance_type'] === "renew") {
                this.prepared_request['pucc_end_date'] = "";
                this.processed_request['___pucc_end_date___'] = this.prepared_request['pucc_end_date'];
                this.prepared_request['pucc_number'] = "";
                this.processed_request['___pucc_number___'] = this.prepared_request['pucc_number'];
                if (this.lm_request.hasOwnProperty('is_valid_pucc') && this.lm_request['is_valid_pucc'] === "yes") {
                    this.prepared_request['is_valid_pucc'] = "false";
                    this.processed_request['___is_valid_pucc___'] = this.prepared_request['is_valid_pucc'];

                    this.prepared_request['pucc_end_date'] = moment(this.lm_request['pucc_end_date'], "DD-MM-YYYY").format("YYYY-MM-DD");
                    this.processed_request['___pucc_end_date___'] = this.prepared_request['pucc_end_date'];
                    this.prepared_request['pucc_number'] = this.lm_request["pucc_number"];
                    this.processed_request['___pucc_number___'] = this.prepared_request['pucc_number'];
                } else if (this.lm_request.hasOwnProperty('is_valid_pucc') && this.lm_request['is_valid_pucc'] === "no") {
                    this.prepared_request['is_valid_pucc'] = "false";
                    this.processed_request['___is_valid_pucc___'] = this.prepared_request['is_valid_pucc'];
                } else {
                    this.prepared_request['is_valid_pucc'] = "";
                    this.processed_request['___is_valid_pucc___'] = this.prepared_request['is_valid_pucc'];
                }
            } else {
                this.prepared_request['is_valid_pucc'] = "";
                this.processed_request['___is_valid_pucc___'] = this.prepared_request['is_valid_pucc'];
            }

            if (this.prepared_request.hasOwnProperty('policy_start_date')) {
                //  this.prepared_request['policy_start_date'] = this.prepared_request['policy_start_date'];
                this.processed_request['___policy_start_date___'] = this.prepared_request['policy_start_date'];
            }

            if (this.processed_request.hasOwnProperty('___insured_age___')) {
                this.prepared_request['drivingexp'] = parseInt(this.processed_request['___insured_age___']) - 18;
                this.processed_request['___drivingexp___'] = this.prepared_request['drivingexp'];
            }

            if ((this.lm_request['product_id'] === 1 || this.lm_request['product_id'] === 10) && this.lm_request['vehicle_insurance_type'] === "renew" && this.lm_request['is_breakin'] === "yes" && this.lm_request['is_policy_exist'] === "no") {
                this.prepared_request['tata_prevPolicy'] = "Y";
                this.processed_request['___tata_prevPolicy___'] = this.prepared_request['tata_prevPolicy'];

                this.prepared_request['dbmaster_pb_previousinsurer_address'] = "Dummy";
                this.processed_request['___dbmaster_pb_previousinsurer_address___'] = this.prepared_request['dbmaster_pb_previousinsurer_address'];

                this.prepared_request['previous_policy_number'] = "123456";
                this.processed_request['___previous_policy_number___'] = this.prepared_request['previous_policy_number'];

                this.prepared_request['dbmaster_pb_previousinsurer_pincode'] = "111111";
                this.processed_request['___dbmaster_pb_previousinsurer_pincode___'] = this.prepared_request['dbmaster_pb_previousinsurer_pincode'];

                //this.prepared_request['dbmaster_previousinsurer_code'] = "L ampersand T GICL";
                this.prepared_request['dbmaster_previousinsurer_code'] = "ENDURANCE";
                this.processed_request['___dbmaster_previousinsurer_code___'] = this.prepared_request['dbmaster_previousinsurer_code'];

                //this.prepared_request['dbmaster_insurername'] = "L ampersand T General Insurance Company Limited";
                this.prepared_request['dbmaster_insurername'] = "ENDURANCE";
                this.processed_request['___dbmaster_insurername___'] = this.prepared_request['dbmaster_insurername'];
            } else {
                if (this.lm_request["prev_insurer_id"] - 0 > 0 && this.lm_request['vehicle_insurance_type'] === "renew") {
                    this.prepared_request['tata_prevPolicy'] = "Y";
                    this.processed_request['___tata_prevPolicy___'] = this.prepared_request['tata_prevPolicy'];
                } else {
                    this.prepared_request['tata_prevPolicy'] = "N";
                    this.processed_request['___tata_prevPolicy___'] = this.prepared_request['tata_prevPolicy'];
                }
            }
        }
        if (this.lm_request['method_type'] === 'Proposal') {
            console.log("Inside Proposal");
            var returnUrl = this.pg_ack_url(6);
            if (config.environment.name === 'Development') {
                returnUrl = 'http://localhost:7000/transaction-status/' + this.lm_request['udid'] + '/' + this.lm_request['crn'] + '/' + this.lm_request['proposal_id'];
            }
            this.prepared_request['return_url'] = returnUrl;
            this.processed_request['___return_url___'] = this.prepared_request['return_url'];
            this.processed_request['___payer_name___'] = this.prepared_request['first_name'] + " " + this.prepared_request['last_name'];
        }
        if (this.lm_request.hasOwnProperty('is_tppd')) {
            if (this.lm_request['is_tppd'] === 'yes') {
                this.prepared_request['is_tppd'] = "Yes";
                this.processed_request['___is_tppd___'] = this.prepared_request['is_tppd'];
            } else {
                this.prepared_request['is_tppd'] = "No";
                this.processed_request['___is_tppd___'] = this.prepared_request['is_tppd'];
            }
        } else {
            this.prepared_request['is_tppd'] = "No";
            this.processed_request['___is_tppd___'] = this.prepared_request['is_tppd'];
        }

        this.processed_request['___policy_end_date_extended___'] = this.prepared_request['policy_end_date_extended'];

        if (this.lm_request['method_type'] === 'Status') {
            this.method_content = this.method_content.replace('___insurer_integration_agent_code___', 'POLIBO01');
        }

        //posp start date 9-June-21 Chirag Modi
        if (this.method_content.indexOf('"quote_type": "quick"') < 0 || true) {
            if (this.lm_request['is_posp'] === 'yes' && this.lm_request.hasOwnProperty('posp_insurer_11') && this.lm_request['posp_insurer_11'] !== null && this.lm_request['posp_insurer_11'].toString() !== '') {
                this.method_content = this.method_content.replace('___insurer_integration_location_code___', this.lm_request['posp_pan_no']);
                this.method_content = this.method_content.replace('___is_pup_check___', 'Y');
            } else {
                this.method_content = this.method_content.replace('___is_pup_check___', 'N');
            }
        }
        //posp finish

        if ((parseInt(this.lm_request['crn']) - 0) > 5558586) {
            if ((parseInt(this.lm_request['ss_id']) - 0) > 0) {
            } else {
                this.method_content = this.method_content.replace('___insurer_integration_location_code___', 'HCS3903004');
            }
        }
        console.log(this.method_content);

        if (this.lm_request['vehicle_insurance_type'] === 'new' && ([1, 10].indexOf(this.lm_request['product_id']) > -1)) {
            if (this.lm_request.hasOwnProperty('cpa_tenure') && this.lm_request['is_pa_od'] == "yes") {
                this.prepared_request['policy_od_tenure'] = this.lm_request['cpa_tenure'];
                this.processed_request['___policy_od_tenure___'] = this.prepared_request['policy_od_tenure'];
            }
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_product_field_process_pre', ex);
    }
};

TataAIGMotor.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
TataAIGMotor.prototype.insurer_product_field_process_post = function () {};
TataAIGMotor.prototype.insurer_product_api_post = function () {};
TataAIGMotor.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    try {
        var objInsurerProduct = this;
        var Client = require('node-rest-client').Client;
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
        var client = new Client();

        if (specific_insurer_object.method.Method_Type === 'Idv' || specific_insurer_object.method.Method_Type === 'Premium') {
            docLog.Insurer_Request = docLog.Insurer_Request.replace("qproducer_code", "q_producer_code");
        }
        if (specific_insurer_object.method.Method_Type === 'Customer') {
            docLog.Insurer_Request = docLog.Insurer_Request.replace("proposer_slutation", "proposer_salutation");
        }
        if (specific_insurer_object.method.Method_Type === 'Proposal') {
            docLog.Insurer_Request = docLog.Insurer_Request.replace("payment_moe", "payment_mode");
        }
        if (specific_insurer_object.method.Method_Type === 'Verification') {
            docLog.Insurer_Request = docLog.Insurer_Request.replace("payment_id", "\"payment_id");
        }

        let service_method_urlT = (config.environment.name === 'Production') ? "" : "https://uatapigw-tataaig.auth.ap-south-1.amazoncognito.com/oauth2/token";
        var token_obj = {
            data: {
                "grant_type": "client_credentials",
                "scope": "https://api.iorta.in/write",
                "client_id": "5qdbqng8plqp1ko2sslu695n2g",
                "client_secret": "gki6eqtltmjj37gpqq0dt52dt651o079dn6mls62ptkvsa2b45c"
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': '*/*'
            }
        };
        try {
            token_obj.data = jsonToQueryString(token_obj.data);
            client.post(service_method_urlT, token_obj, function (dataT, tokenError) {
                console.log("TOKEN : " + dataT);
                if (dataT.hasOwnProperty('access_token')) {
                    var obj = {
                        data: docLog.Insurer_Request,
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': dataT.access_token,
                            'x-api-key': "g8hoqi8TBA2mBpxgMohdTcWxAfv6JsJ6wLztOWm4"
                        }
                    };

                    if (specific_insurer_object.method.Method_Type === 'Premium' || specific_insurer_object.method.Method_Type === 'Idv') {
                        let nbbreakindate = moment(new Date()).add(-16, 'd').format('YYYY-MM-DD');
                        if (parseInt(objInsurerProduct.lm_request['product_id']) === 1 && objInsurerProduct.lm_request['vehicle_insurance_type'] === 'new' && moment(nbbreakindate).isSameOrAfter(objInsurerProduct.lm_request['vehicle_registration_date'])) {
                            this.method_content = "New Business Vehicle Registration Date Cannot Be Less Than T-15";
                            var objResponseFull = {
                                'err': {'LM_MSG': 'New business vehicle registration date cannot be less than T-15'},
                                'result': {'LM_MSG': 'New business vehicle registration date cannot be less than T-15'},
                                'raw': JSON.stringify(docLog),
                                'soapHeader': null,
                                'objResponseJson': {'LM_MSG': 'New business vehicle registration date cannot be less than T-15'}
                            };
                            console.log(objResponseFull);
                            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);

                        } else {
                            client.post(specific_insurer_object['method']['Service_URL'], obj, function (data, response) {
                                console.log(data);
                                console.error("tata_kk_res", data);
                                var objResponseFull = {
                                    'err': null,
                                    'result': data,
                                    'raw': JSON.stringify(docLog),
                                    'soapHeader': null,
                                    'objResponseJson': data
                                };
                                console.log(objResponseFull);
                                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                                if (specific_insurer_object.method.Method_Type === 'Idv') {
                                    objInsurerProduct.insurer_vehicle_idv_handler(serviceBreakup, objProduct, Insurer_Object, specific_insurer_object);
                                }
                            });
                        }
                    } else if (specific_insurer_object.method.Method_Type === 'Customer') {
                        client.post(specific_insurer_object['method']['Service_URL'], obj, function (data, response) {
                            console.log(data);
                            console.log(objResponseFull);
                            var objResponseFull = {
                                'err': null,
                                'result': data,
                                'raw': JSON.stringify(docLog),
                                'soapHeader': null,
                                'objResponseJson': data
                            };
                            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                        });
                    } else if (specific_insurer_object.method.Method_Type === 'Proposal') {
                        client.post(specific_insurer_object['method']['Service_URL'], obj, function (data, response) {
                            console.log(data);
                            console.log(objResponseFull);
                            var objResponseFull = {
                                'err': null,
                                'result': data,
                                'raw': JSON.stringify(docLog),
                                'soapHeader': null,
                                'objResponseJson': data
                            };
                            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                        });
                    } else if (specific_insurer_object.method.Method_Type === 'Status') {
                        var args = {
                            data: docLog.Insurer_Request,
                            headers: {
                                "Content-Type": "application/json"
                            }
                        };
                        client.post(specific_insurer_object['method']['Service_URL'], args, function (data, response) {
                            console.log(data);
                            console.log(objResponseFull);
                            var objResponseFull = {
                                'err': null,
                                'result': data,
                                'raw': JSON.stringify(docLog),
                                'soapHeader': null,
                                'objResponseJson': data
                            };
                            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);

                        });
                    } else if (specific_insurer_object.method.Method_Type === 'Verification') {
                        console.error("status_calling");

                        client.post(specific_insurer_object['method']['Service_URL'], obj, function (data, response) {
                            console.log(data);
                            console.log(objResponseFull);
                            var objResponseFull = {
                                'err': null,
                                'result': data,
                                'raw': JSON.stringify(docLog),
                                'soapHeader': null,
                                'objResponseJson': data
                            };
                            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                        });

                    } else if (specific_insurer_object.method.Method_Type === 'Pdf') {
                        console.error("status_calling");
                        var obj2 = {
                            headers: {
                                'Authorization': dataT.access_token,
                                'x-api-key': "5QerRezeZs3PrVdLQu79c1v9Nsh5S7BOan26zc7P"
                            }
                        };

                        var encrypted_policy_id = objProduct.lm_request.encrypted_policyId;
                        client.get(specific_insurer_object['method']['Service_URL'] + encrypted_policy_id, obj2, function (data, response) {
                            console.log(data);
                            console.log(objResponseFull);
                            var objResponseFull = {
                                'err': null,
                                'result': data,
                                'raw': JSON.stringify(docLog),
                                'soapHeader': null,
                                'objResponseJson': data
                            };
                            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                        });
                    }
                } else {
                    var objResponseFull = {
                        'err': null,
                        'result': dataT,
                        'raw': dataT,
                        'soapHeader': null,
                        'objResponseJson': dataT
                    };
                    console.log(objResponseFull);
                    var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                }
            });
        } catch (e1) {
            console.error('Exception', this.constructor.name, 'service_call', e1);
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};
TataAIGMotor.prototype.idv_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'idv_response_handler', objResponseJson);
    var objPremiumService = '';
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    try {
        var Error_Msg = 'NO_ERR';
        if (objResponseJson.hasOwnProperty('status') && objResponseJson.status === 200 && objResponseJson.hasOwnProperty('message_txt') && objResponseJson.message_txt === "Quotation converted to proposal successfully") {

        } else {
            Error_Msg = objResponseJson.hasOwnProperty('message_txt') ? objResponseJson.message_txt : objResponseJson;
        }
        //check error stop
        if (Error_Msg === 'NO_ERR') {
            var Idv_Breakup = this.const_idv_breakup;
            Idv_Breakup["Idv_Normal"] = parseInt(objResponseJson['data']['0']['pol_dlts']['total_idv'] - 0);
            Idv_Breakup["Idv_Min"] = parseInt(objResponseJson['data']['0']['pol_dlts']['min_idv'] - 0);
            Idv_Breakup["Idv_Max"] = parseInt(objResponseJson['data']['0']['pol_dlts']['max_idv'] - 0);
            Idv_Breakup["Exshowroom"] = 0;

            objServiceHandler.Premium_Breakup = Idv_Breakup;
            objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['data']['0']['data']['quote_no'];
        }
    } catch (e) {
        Error_Msg = 'LM::' + e.stack;
        console.error('Exception', this.constructor.name, 'idv_response_handler', objResponseJson, e.stack);
    }
    objServiceHandler.Error_Msg = Error_Msg;
    console.log('Finish', this.constructor.name, 'idv_response_handler', objServiceHandler);
    return objServiceHandler;
};
TataAIGMotor.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    try {
        var Error_Msg = 'NO_ERR';
        if (objResponseJson.hasOwnProperty('status') && objResponseJson.status === 200 && objResponseJson.hasOwnProperty('message_txt') && objResponseJson.message_txt.toLowerCase().includes("success")) {

        } else {
            Error_Msg = objResponseJson.hasOwnProperty('message_txt') ? objResponseJson.message_txt : objResponseJson;
        }

        if (Error_Msg === 'NO_ERR') {
            console.log(this.docRequest['Request_Product']['addon_package_name']);
            console.log(this['addon_processed_request']['addon_package_name']);
            console.log(this['prepared_request']['Plan_Name']);
            console.log(this.prepared_request['vehicle_age_year']);

            var objInsurerPremium = {};
            var objInsurerAddon = {};
            var premium_breakup = this.get_const_premium_breakup();
            var od_final = 0;

            objResponseJson1 = objResponseJson["data"][0]["data"]["premium_break_up"]["total_od_premium"];
            for (var keycover in this.premium_breakup_schema['own_damage']) {
                var tata_key = this.premium_breakup_schema['own_damage'][keycover];
                if (tata_key) {
                    if (objResponseJson1.od.hasOwnProperty(tata_key)) {
                        premium_breakup['own_damage'][keycover] = objResponseJson1.od[tata_key];
                    } else if (objResponseJson1.discount_od.hasOwnProperty(tata_key) && tata_key !== '') {
                        premium_breakup['own_damage'][keycover] = objResponseJson1.discount_od[tata_key];
                    } else {
                        premium_breakup['own_damage'][keycover] = objResponseJson1["total_od"];
                    }
                } else {
                    premium_breakup['own_damage'][keycover] = 0;
                }
            }

            console.log("premium_breakup : " + JSON.stringify(premium_breakup));
            objResponseJson1 = objResponseJson["data"][0]["data"]["premium_break_up"]["total_addOns"];
            for (var keyCover in this.premium_breakup_schema['addon']) {
                var tata_key = this.premium_breakup_schema['addon'][keyCover];
                if (objResponseJson1.hasOwnProperty(tata_key) && tata_key !== '') {
                    premium_breakup['addon'][keyCover] = objResponseJson1[tata_key];
                } else {
                    premium_breakup['addon'][keyCover] = 0;
                }
            }
            objResponseJson1 = objResponseJson["data"][0]["data"]["premium_break_up"]["total_tp_premium"];
            for (var keyCover in this.premium_breakup_schema['liability']) {
                var tata_key = this.premium_breakup_schema['liability'][keyCover];
                if (objResponseJson1.hasOwnProperty(tata_key) && tata_key !== '') {
                    premium_breakup['liability'][keyCover] = objResponseJson1[tata_key];
                } else {
                    premium_breakup['liability'][keyCover] = 0;
                }
            }

            var group_final_key, group_final = 0;
            for (var key in premium_breakup) {
                if (typeof premium_breakup[key] === 'object') {
                    group_final_key = '';
                    group_final = 0;
                    for (var sub_key in premium_breakup[key]) {
                        if (sub_key.indexOf('final_') > -1) {
                            group_final_key = sub_key;
                        } else {
                            premium_val = parseFloat(premium_breakup[key][sub_key]);
                            premium_breakup[key][sub_key] = premium_val;
                            if (sub_key.indexOf('_disc') > -1) {
                                group_final -= premium_val;
                            } else {
                                group_final += premium_val;
                            }
                        }
                        console.log(key, sub_key);
                    }
                    console.log(group_final_key);
                    premium_breakup[key][group_final_key] = group_final;
                }
            }

            premium_breakup['net_premium'] = objResponseJson["data"][0]["data"]["premium_break_up"]["final_premium"];
            premium_breakup['service_tax'] = objResponseJson["data"][0]["pol_dlts"]["prem_gst"];
            premium_breakup['final_premium'] = objResponseJson["data"][0]["data"]["premium_break_up"]["net_premium"];

            objServiceHandler.Premium_Breakup = premium_breakup;
            objServiceHandler.Insurer_Transaction_Identifier = objResponseJson["data"][0]["data"]["quote_no"];
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
        return objServiceHandler;
    } catch (e) {
        console.error('Exception', this.constructor.name, 'premium_response_handler', e.stack);
        objServiceHandler.Error_Msg = e.stack;
        return objServiceHandler;
    }
};
TataAIGMotor.prototype.insurer_vehicle_idv = function (objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback) {
    console.log('Start', this.constructor.name, 'insurer_vehicle_idv');
    try {
        var objInsurerProduct = this;
        var Insurer_Id = specific_insurer_object['insurer_id'];

        var IdvMethod = this.ArrayFindByKey(Insurer_Object.Method_List, 'Method_Type', 'Idv');
        specific_insurer_object.method = IdvMethod;
        if (specific_insurer_object.method.Service_File && fs.existsSync(appRoot + '/resource/wsdl/' + specific_insurer_object.method.Service_File)) {
            specific_insurer_object['method_file_url'] = appRoot + '/resource/wsdl/' + specific_insurer_object.method.Service_File;
        } else {
            specific_insurer_object['method_file_url'] = specific_insurer_object.method.Service_URL;
        }
        var method_content = fs.readFileSync(appRoot + '/resource/request_file/' + IdvMethod.Method_Request_File).toString();

        var vehicle_insurance_subtype_2_obj = {"1CH_0TP": "Package", "1OD_0TP": "Package", "0CH_1TP": "Liability", "0CH_3TP": "Liability", "1CH_2TP": "Package"};
        let vehicle_insurance_subtype_2 = vehicle_insurance_subtype_2_obj[this.lm_request['vehicle_insurance_subtype']];

        var vehicle_insurance_subtype_3_obj = {"1CH_0TP": "02", "1OD_0TP": "05", "0CH_1TP": "01", "0CH_3TP": "03", "1CH_2TP": "04"};
        let vehicle_insurance_subtype_3 = vehicle_insurance_subtype_3_obj[this.lm_request['vehicle_insurance_subtype']];

        var vehicle_insurance_subtype_4_obj = {"1CH_0TP": "PackagePolicy", "1OD_0TP": "Standalone OD", "0CH_1TP": "Standalone TP", "0CH_3TP": "Standalone TP", "1CH_2TP": "PackagePolicy"};
        let vehicle_insurance_subtype_4 = vehicle_insurance_subtype_4_obj[this.lm_request['vehicle_insurance_subtype']];

        method_content = method_content.replace('___vehicle_insurance_subtype_2___', vehicle_insurance_subtype_2);
        method_content = method_content.replace('___vehicle_insurance_subtype_3___', vehicle_insurance_subtype_3);
        method_content = method_content.replace('___vehicle_insurance_subtype_4___', vehicle_insurance_subtype_4);
        method_content = method_content.replace('___plan_name___', '');
        method_content = method_content.replace('___addon_package_name___', '');
        method_content = method_content.replace('___lv_quote_no___', this.lv_quote_no());
        this.method_content = method_content.replace('___vehicle_expected_idv___', 0);
        this.method_content = method_content.replace('qproducer_code', 'q_producer_code');
        this.insurer_product_field_process_pre();
        var request_replaced_data = this.method_content.replaceJson(this.processed_request);

        var logGuid = this.create_guid('ARN-');
        var docLog = {
            "Service_Log_Id": "",
            "Service_Log_Unique_Id": logGuid,
            "Request_Id": objProduct.docRequest.Request_Id,
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
        return 0;
    }
};
TataAIGMotor.prototype.customer_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'customer_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Customer': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson.hasOwnProperty('status') && objResponseJson.status === 200 && objResponseJson.hasOwnProperty('message_txt') && objResponseJson.message_txt.toLowerCase().includes("success")) {

        } else {
            Error_Msg = objResponseJson.hasOwnProperty('message_txt') ? objResponseJson.message_txt : objResponseJson;
        }

        if (Error_Msg === 'NO_ERR') {
            var Customer = {};
            Customer = {
                'insurer_customer_identifier': objResponseJson["data"][0]["payment_id"],
                'insurer_customer_identifier_2': objResponseJson["data"][0]["proposal_no"]
            };
            objServiceHandler.Insurer_Transaction_Identifier = objResponseJson["data"][0]["proposal_no"];
            objServiceHandler.Customer = Customer;
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'customer_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'customer_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
TataAIGMotor.prototype.proposal_response_handler = function (objResponseJson) {
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    try {
        console.log('Start', this.constructor.name, 'Initiate payment_response_handler', objResponseJson);
        var objResponseData = objResponseJson['data'];
        var Error_Msg = 'NO_ERR';
        if (objResponseJson.hasOwnProperty('status') && objResponseJson.status === 200 && objResponseJson.hasOwnProperty('message_txt') && objResponseJson.message_txt.toLowerCase().includes("success")) {

        } else {
            Error_Msg = objResponseJson.hasOwnProperty('message_txt') ? objResponseJson.message_txt : objResponseJson;
        }

        if (Error_Msg === 'NO_ERR') {
            let payment_data = JSON.parse(objResponseJson['data']);
            var pg_data = {
                pgiRequest: payment_data.pgiRequest
            };
            objServiceHandler.Payment.pg_data = pg_data;
            objServiceHandler.Payment.pg_url = payment_data.url;
            objServiceHandler.Payment.pg_redirect_mode = 'POST';
        }
        objServiceHandler.Insurer_Transaction_Identifier = this.prepared_request['insurer_customer_identifier_2'];
        objServiceHandler.Error_Msg = Error_Msg;
    } catch (e) {
        objServiceHandler.Error_Msg = 'LM::' + e.stack;
        console.error('Exception', this.constructor.name, 'proposal_response_handler', e.stack);
    }
    return objServiceHandler;
};
TataAIGMotor.prototype.pg_response_handler = function () {
    console.error('TataPgStart', this.constructor.name, 'pg_response_handler');
    try {
        let objInsurerProduct = this;
        var date = new Date();
        var Pay_Date = moment(date).format('DD-MM-YYYY');

        var objResponse = (objInsurerProduct.hasOwnProperty('const_payment_response') && objInsurerProduct.const_payment_response.hasOwnProperty('pg_get')) ? objInsurerProduct.const_payment_response.pg_get : false;
        console.error('TataPgdata', this.constructor.name, objResponse);

        if (objResponse) {
            var policy_status = (objResponse.hasOwnProperty('policy_no') && objResponse.policy_no !== "null") ? objResponse['policy_no'] : null;
            var proposal_status = (objResponse.hasOwnProperty('proposal_no') && objResponse.proposal_no !== "null") ? objResponse['proposal_no'] : null;

            if (policy_status !== null && proposal_status !== null) {
                console.error('TataPgStart', this.constructor.name, 'success');
                if (objResponse['policy_no'] !== "" && objResponse['policy_no'] !== null && objResponse['proposal_no'] !== "" && objResponse['proposal_no'] !== null) {
                    this.const_policy.pg_status = 'SUCCESS';
                    this.const_policy.transaction_status = 'SUCCESS';
                    this.const_policy.policy_number = objResponse['policy_no'];
                    this.const_policy.pg_reference_number_1 = objResponse['proposal_no'];
                    this.const_policy.pg_reference_number_2 = Pay_Date;
                    this.const_policy.transaction_id = objResponse['proposal_no'];
                    this.const_policy.transaction_amount = objInsurerProduct.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['final_premium'];
                } else {
                    this.const_policy.pg_status = 'PAYPASS';
                    this.const_policy.transaction_status = 'PAYPASS';
                    this.const_policy.policy_number = "";
                    this.const_policy.pg_reference_number_1 = objResponse['proposal_no'];
                    this.const_policy.pg_reference_number_2 = Pay_Date;
                }
            } else {
                console.error('TataPgStart', this.constructor.name, 'fail');
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
                this.const_policy.policy_number = "";
                this.const_policy.pg_reference_number_1 = objResponse['proposal_no'];
                this.const_policy.pg_reference_number_2 = Pay_Date;
            }
        } else {
            console.error('TataPgStart', this.constructor.name, 'fail');
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
            this.const_policy.policy_number = "";
            this.const_policy.pg_reference_number_1 = objResponse['proposal_no'];
            this.const_policy.pg_reference_number_2 = Pay_Date;
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
TataAIGMotor.prototype.verification_response_handler = function (objResponseJson) {
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
            //Recon API 
            console.error('TataVerStart', this.constructor.name, 'ver_success');
            if (objResponseJson.hasOwnProperty('status') && objResponseJson.status === 200 && objResponseJson.hasOwnProperty('message_txt') && objResponseJson.message_txt.toLowerCase().includes("success")) {
            } else {
                Error_Msg = objResponseJson.hasOwnProperty('message_txt') ? objResponseJson.message_txt : objResponseJson;
            }

            if (Error_Msg === 'NO_ERR') {
                if (objInsurerProduct.const_policy.policy_number !== '' && objResponseJson.hasOwnProperty("data") && objResponseJson.data && objResponseJson.data.hasOwnProperty("encrypted_policy_id") && objResponseJson.data.encrypted_policy_id) {
                    console.error('TataVerStart', this.constructor.name, 'policy_number', objInsurerProduct.const_policy['policy_number']);
                    //this.const_policy.policy_number = objResponseJson['policyno'];
                    this.const_policy.transaction_status = 'SUCCESS';
                    var product_name = 'CAR';
                    if (objInsurerProduct.lm_request['product_id'] === 10) {
                        product_name = 'TW';
                    }
                    if (objInsurerProduct.lm_request['product_id'] === 12) {
                        product_name = 'CV';
                    }
                    this.const_policy.policy_id = objResponseJson["data"]["policy_id"];
                    this.const_policy.encrypted_policy_id = objResponseJson["data"]["encrypted_policy_id"];
                    this.const_policy.encrypted_policy_no = objResponseJson["data"]["encrypted_policy_no"];

                    var pdf_file_name = this.constructor.name + '_' + product_name + '_' + objInsurerProduct.const_policy['policy_number'].replaceAll('/', '') + '.pdf';
                    pdf_file_name = this.constructor.name + '_' + product_name + '_' + objInsurerProduct.const_policy['policy_number'].replaceAll('-', '') + '.pdf';
                    var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                    //var pdf_web_path = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    var pdf_web_path = config.environment.weburl + "/pdf/" + pdf_file_name;
                    this.const_policy.policy_url = pdf_web_path;

                    var args = {
                        data: {
                            "search_reference_number": objInsurerProduct.lm_request['search_reference_number'],
                            "api_reference_number": objInsurerProduct.lm_request['api_reference_number'],
                            "policy_number": objInsurerProduct.const_policy.policy_number,
                            "policyId": objResponseJson["data"]["policy_id"],
                            "encrypted_policyId": objResponseJson["data"]["encrypted_policy_id"],
                            'client_key': objInsurerProduct.lm_request['client_key'],
                            'secret_key': objInsurerProduct.lm_request['secret_key'],
                            'insurer_id': objInsurerProduct.lm_request['insurer_id'],
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

                } else {
                    this.const_policy.transaction_status = 'PAYPASS';
                }
                this.const_policy.policy_number.transaction_identifier = objInsurerProduct.const_policy.transaction_id;
                objServiceHandler.Insurer_Transaction_Identifier = objInsurerProduct.const_policy.transaction_id;
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
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
TataAIGMotor.prototype.pdf_call = function (url, args, pdf_sys_loc) {
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
TataAIGMotor.prototype.pdf_response_handler = function (objResponseJson) {
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
        if (objResponseJson.hasOwnProperty('byteStream') && objResponseJson.byteStream && objResponseJson.hasOwnProperty('download') && objResponseJson.download) {
        } else {
            Error_Msg = objResponseJson.hasOwnProperty('message_txt') ? objResponseJson.message_txt : objResponseJson;
        }

        if (Error_Msg === 'NO_ERR') {
            if (objResponseJson.byteStream) {
                var product_name = 'CAR';
                if (this.lm_request['product_id'] === 10) {
                    product_name = 'TW';
                }
                if (this.lm_request['product_id'] === 12) {
                    product_name = 'CV';
                }
                var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.lm_request['policy_number'].replaceAll('/', '') + '.pdf';
                pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.lm_request['policy_number'].replaceAll('-', '') + '.pdf';
                var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                var pdf_web_path = config.environment.weburl + "/pdf/" + pdf_file_name;
                var binary = new Buffer(objResponseJson.byteStream, 'base64');
                var sleep = require('system-sleep');
                sleep(10000);
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
TataAIGMotor.prototype.lv_quote_no = function () {
    try {
        return this.create_guid('', 'numeric', 7);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'lv_quote_no', ex);
        return 0;
    }
};

TataAIGMotor.prototype.Plan_condition = function (PremiumResponseJson) {
    var plan_check = true;
    try {
        console.log(this.docRequest['Request_Product']['addon_package_name']);
        console.log(this['addon_processed_request']['addon_package_name']);
        console.log(this['prepared_request']['Plan_Name']);

        if (this.prepared_request['vehicle_age_year'] > 5 && this.prepared_request['vehicle_age_year'] <= 7 && this['addon_processed_request']['addon_package_name'] === "P11" && this.docRequest['Request_Product']['is_claim_exists'] === "yes") {
            //if (this.prepared_request['vehicle_age_year'] > 5 && this.prepared_request['vehicle_age_year'] <= 7 && objResponse['quotationdata']['addon_plan_code'] == "P11" && this.docRequest['Request_Product']['is_claim_exists'] == "yes") {
            plan_check = false;
        }
        if ((this.prepared_request['vehicle_age_year'] > 5 && this.prepared_request['vehicle_age_year'] <= 7 && this.docRequest['Request_Product']['is_claim_exists'] === "no"))
        {
            if (this['addon_processed_request']['addon_package_name'] === "P3" || this['addon_processed_request']['addon_package_name'] === "P8" || this['addon_processed_request']['addon_package_name'] === "P9" || this['addon_processed_request']['addon_package_name'] === "P10" || this['addon_processed_request']['addon_package_name'] === "P11")
                //if (objResponse['quotationdata']['addon_plan_code'] == "P3" || objResponse['quotationdata']['addon_plan_code'] == "P8" || objResponse['quotationdata']['addon_plan_code'] == "P9" || objResponse['quotationdata']['addon_plan_code'] == "P10" || objResponse['quotationdata']['addon_plan_code'] == "P11")
                plan_check = false;
        }
        if (this.prepared_request['vehicle_age_year'] > 7 && this.prepared_request['vehicle_age_year'] <= 10) {
            if (this['prepared_request']['Plan_Name'] === "GOLD" || this['prepared_request']['Plan_Name'] === "PEARLP" || this['prepared_request']['Plan_Name'] === "SAPPHIRE" || this['prepared_request']['Plan_Name'] === "SAPPHIREP" || this['prepared_request']['Plan_Name'] === "SAPPHIREPP")
                //if (objResponse['quotationdata']['addon_plan_code'] == "P3" || objResponse['quotationdata']['addon_plan_code'] == "P8" || objResponse['quotationdata']['addon_plan_code'] == "P9" || objResponse['quotationdata']['addon_plan_code'] == "P10" || objResponse['quotationdata']['addon_plan_code'] == "P11")
                plan_check = false;
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'Plan_condition', ex);
        return plan_check;
    }
    return plan_check;
};
TataAIGMotor.prototype.premium_breakup_schema = {
    "own_damage": {
        "od_basic": "basic_od", //when PropCoverDetails_CoverGroups = Own Damage
        "od_elect_access": "electrical_prem",
        "od_non_elect_access": "non_electrical_prem",
        "od_cng_lpg": "cng_lpg_od_prem",
        "od_disc_ncb": "ncb_prem",
        "od_disc_vol_deduct": null,
        "od_disc_anti_theft": null,
        "od_disc_aai": null,
        "od_loading": null,
        "od_disc": null,
        "od_final_premium": "total_od"//NetODPremium
    },
    "liability": {
        "tp_basic": "basic_tp", ////when PropCoverDetails_CoverGroups = Basic TP  including TPPD premium
        "tp_cover_owner_driver_pa": "pa_owner_prem", //when PropCoverDetails_CoverGroups = Owner Driver
        "tp_cover_unnamed_passenger_pa": "pa_unnamed_prem",
        "tp_cover_named_passenger_pa": null,
        "tp_cover_paid_driver_pa": "pa_paid_prem",
        "tp_cover_paid_driver_ll": "ll_paid_prem", //this is included in tp_basic
        "tp_cover_tppd": "tppd_prem",
        "tp_cng_lpg": "cng_lpg_tp_prem",
        "tp_final_premium": "total_tp"
    },
    "addon": {
        "addon_zero_dep_cover": "dep_reimburse_prem",
        "addon_road_assist_cover": "rsa_prem", ///when PropCoverDetails_CoverGroups = RoadSide Assist
        "addon_ncb_protection_cover": "ncb_protection_prem",
        "addon_engine_protector_cover": "engine_secure_prem",
        "addon_invoice_price_cover": "return_invoice_prem",
        "addon_key_lock_cover": "key_replace_prem",
        "addon_consumable_cover": "consumbale_expense_prem",
        "addon_daily_allowance_cover": null,
        "addon_windshield_cover": null,
        "addon_passenger_assistance_cover": null,
        "addon_tyre_coverage_cover": "tyre_secure_prem",
        "addon_personal_belonging_loss_cover": "personal_loss_prem",
        "addon_inconvenience_allowance_cover": null,
        "addon_medical_expense_cover": null,
        "addon_hospital_cash_cover": null,
        "addon_ambulance_charge_cover": null,
        "addon_rodent_bite_cover": null,
        "addon_losstime_protection_cover": null,
        "addon_hydrostatic_lock_cover": null,
        "addon_final_premium": "total_addon",
        "addon_emergency_transport_hotel": "emergency_expense_prem",
        "addon_repair_glass_fiber_plastic": "repair_glass_prem"
    },
    "net_premium": "final_premium",
    "service_tax": "prem_gst",
    "final_premium": "net_premium"
};
TataAIGMotor.prototype.tata_fuel_code = function () {
    console.log('tata_fuel_code', 'start');
    var fuel_code = 0;
    try {
        var arr_fuel = {
            "PETROL": "1",
            "DIESEL": "2",
            "CNG": "3",
            "BATTERY": "4",
            "EXTERNAL CNG": "5",
            "EXTERNAL LPG": "6",
            "ELECTRICITY": "7",
            "HYDROGEN": "8",
            "LPG": "9"
        };
        var fuel_type = this.prepared_request['dbmaster_insurer_vehicle_fueltype'].toString().toUpperCase();
        if (this.lm_request['is_external_bifuel'] === 'yes') {
            if (this.lm_request['external_bifuel_type'].toLowerCase() === 'cng') {
                fuel_type = 'EXTERNAL CNG';
            }
            if (this.lm_request['external_bifuel_type'].toLowerCase() === 'lpg') {
                fuel_type = 'EXTERNAL LPG';
            }
        }

        if (arr_fuel.hasOwnProperty(fuel_type)) {
            fuel_code = arr_fuel[fuel_type];
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'tata_fuel_code', ex);
        return fuel_code;
    }
    console.log('tata_fuel_code', 'finish');
    return fuel_code;
};
TataAIGMotor.prototype.segement_code = function () {
    console.log('segement_code', 'start');
    var segement_code = 0;
    try {
        var arr_segement = {
            "Mini": "1",
            "Compact": "2",
            "Mid Size": "3",
            "High End": "4",
            "MPV SUV": "5",
            "Scooter": "7",
            "MOTOR CYCLE": "8",
            "Moped": "9"

        };
        var segement_type = this.prepared_request['dbmaster_insurer_vehicle_insurer_segmant'].toString();
        if (arr_segement.hasOwnProperty(segement_type)) {
            segement_code = arr_segement[segement_type];
        }
        console.log('segement_code', 'finish');
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'segement_code', ex);
        return segement_code;
    }
    return segement_code;
};
TataAIGMotor.prototype.subProduct_code = function () {
    console.log('subProduct_code', 'start');
    var subProduct_code = 0;
    try {
        var arr_subProduct = {
            "Goods Carrying Vehicle": "50",
            "Misc and Special Types": "51",
            "Passenger Carrying Two Wheeler": "52",
            "Passenger Carrying Vehicle": "53",
            "Taxi": "54"
        };
        var subProduct_type = this.prepared_request['dbmaster_insurer_vehicle_insurer_subProduct'].toString();
        if (arr_subProduct.hasOwnProperty(subProduct_type)) {
            subProduct_code = arr_subProduct[subProduct_type];
        }
        console.log('subProduct_code', 'finish');
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'subProduct_code', ex);
        return subProduct_code;
    }
    return subProduct_code;
};
function jsonToQueryString(json) {
    return  Object.keys(json).map(function (key) {
        return encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);
    }).join('&');
}
module.exports = TataAIGMotor;
