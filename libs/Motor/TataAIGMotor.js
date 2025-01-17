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
        console.log(this.method_content);
        if (this.lm_request['method_type'] !== 'Status') {
            var is_tp = "no";
            if (this.lm_request.hasOwnProperty('vehicle_insurance_subtype')) {
                is_tp = this.lm_request["vehicle_insurance_subtype"].split("CH")[0] === "0" ? "yes" : "no";
            }
            if (is_tp === "yes" && (this.lm_request["vehicle_insurance_subtype"] !== "1OD_0TP")) {
                this.prepared_request['policy_od_tenure'] = "1";
                this.processed_request['___policy_od_tenure___'] = this.prepared_request['policy_od_tenure'];
            }
            if (this.lm_request["vehicle_insurance_subtype"] === "1CH_2TP" || this.lm_request["vehicle_insurance_subtype"] === "1CH_4TP") {
                this.prepared_request['policy_tenure'] = "1";
                this.processed_request['___policy_tenure___'] = this.prepared_request['policy_tenure'];
            }
            if (this.lm_request["vehicle_insurance_subtype"] !== "1OD_0TP" && this.lm_request['method_type'] === 'Proposal') {
                this.method_content = this.method_content.replace('___pre_policy_start_date___', '');
                this.method_content = this.method_content.replace('___policy_expiry_date___', '');
            }
            if (this.lm_request['method_type'] === 'Verification' || this.lm_request['method_type'] === 'Pdf') {
                if (this.prepared_request.hasOwnProperty('dbmaster_insurer_transaction_identifier')) {
                    var arr_ident = this.prepared_request['dbmaster_insurer_transaction_identifier'].toString().split('-');
                    this.prepared_request['proposal_no'] = arr_ident[0];
                    this.processed_request['___proposal_no___'] = arr_ident[0];
                    this.prepared_request['customer_id'] = arr_ident[1];
                    this.processed_request['___customer_id___'] = arr_ident[1];
                }
            }

            if (this.prepared_request["vehicle_registration_type"] === "corporate") {
                if (this.lm_request['method_type'] === 'Proposal') {
                    this.prepared_request['salutation'] = 'M/s.';
                    this.processed_request['___salutation___'] = this.prepared_request['salutation'];
                    this.prepared_request['is_llpd'] = 'Y';
                    this.processed_request['___is_llpd___'] = this.prepared_request['is_llpd'];
                }
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

                this.prepared_request['policy_start_date'] = pol_start_date.replace(/-/g, '');
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
                this.prepared_request['vehicle_registration_date'] = this.lm_request['vehicle_registration_date'].replace(/-/g, '');
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


            if (this.lm_request.hasOwnProperty('electrical_accessory')) {
                if (this.lm_request["electrical_accessory"] > 0) {
                    this.prepared_request['is_electrical_accessory'] = "Y";
                    this.processed_request['___is_electrical_accessory___'] = this.prepared_request['is_electrical_accessory'];
                } else {
                    this.prepared_request['is_electrical_accessory'] = "N";
                    this.processed_request['___is_electrical_accessory___'] = this.prepared_request['is_electrical_accessory'];
                }
            }
            if (this.lm_request.hasOwnProperty('non_electrical_accessory')) {
                if (this.lm_request["non_electrical_accessory"] > 0) {
                    this.prepared_request['is_non_electrical_accessory'] = "Y";
                    this.processed_request['___is_non_electrical_accessory___'] = this.prepared_request['is_non_electrical_accessory'];
                } else {
                    this.prepared_request['is_non_electrical_accessory'] = "N";
                    this.processed_request['___is_non_electrical_accessory___'] = this.prepared_request['is_non_electrical_accessory'];
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

                    this.prepared_request['is_external_bifuel_value'] = "Y";
                    this.processed_request['___is_external_bifuel_value___'] = this.prepared_request['is_external_bifuel_value'];
                } else {
                    this.prepared_request['is_external_bifuel_value'] = "N";
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
                    this.prepared_request['is_pa_unnamed_passenger_si'] = "Y";
                    this.processed_request['___is_pa_unnamed_passenger_si___'] = this.prepared_request['is_pa_unnamed_passenger_si'];
                } else {
                    this.prepared_request['is_pa_unnamed_passenger_si'] = "N";
                    this.processed_request['___is_pa_unnamed_passenger_si___'] = this.prepared_request['is_pa_unnamed_passenger_si'];
                }
            } else {
                this.prepared_request['is_pa_unnamed_passenger_si'] = "N";
                this.processed_request['___is_pa_unnamed_passenger_si___'] = this.prepared_request['is_pa_unnamed_passenger_si'];
            }
            if (this.lm_request.hasOwnProperty('pa_owner_driver_si') && this.lm_request.hasOwnProperty('vehicle_insurance_subtype')) {
                if (this.lm_request["pa_owner_driver_si"] > 0 && this.lm_request["vehicle_insurance_subtype"] !== "1OD_0TP") {
                    if (this.lm_request['is_pa_od'] === 'yes') {
                        this.prepared_request['pa_owner_driver'] = "Y";
                        this.processed_request['___pa_owner_driver___'] = this.prepared_request['pa_owner_driver'];

                        this.prepared_request['driver_declaration'] = "ODD01";
                        this.processed_request['___driver_declaration___'] = this.prepared_request['driver_declaration'];
                    } else {
                        this.prepared_request['pa_owner_driver'] = "N";
                        this.processed_request['___pa_owner_driver___'] = this.prepared_request['pa_owner_driver'];

                        this.prepared_request['driver_declaration'] = "ODD02";
                        this.processed_request['___driver_declaration___'] = this.prepared_request['driver_declaration'];

                    }
                } else {
                    this.prepared_request['pa_owner_driver'] = "N";
                    this.processed_request['___pa_owner_driver___'] = this.prepared_request['pa_owner_driver'];

                    this.prepared_request['driver_declaration'] = "ODD02";
                    this.processed_request['___driver_declaration___'] = this.prepared_request['driver_declaration'];
                }
            }


            this.prepared_request['segment_code'] = this.segement_code();
            this.processed_request['___segment_code___'] = this.prepared_request['segment_code'];

            this.prepared_request['policy_end_date'] = this.prepared_request['policy_end_date'].replace('-', '').replace('-', '');
            this.processed_request['___policy_end_date___'] = this.prepared_request['policy_end_date'];

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

                this.prepared_request['is_claim_exists'] = "N";
                this.processed_request['___is_claim_exists___'] = this.prepared_request['is_claim_exists'];

                this.prepared_request['vehicle_ncb_current'] = "";
                this.processed_request['___vehicle_ncb_current___'] = this.prepared_request['vehicle_ncb_current'];

                this.prepared_request['vehicle_ncb_next'] = "";
                this.processed_request['___vehicle_ncb_next___'] = this.prepared_request['vehicle_ncb_next'];


            } else if (this.lm_request["vehicle_insurance_subtype"] === "1OD_0TP") {

                this.prepared_request['vehicle_insurance_type'] = "New Business";
                this.processed_request['___vehicle_insurance_type___'] = this.prepared_request['vehicle_insurance_type'];

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

                if (this.lm_request['method_type'] === 'Proposal') {
                    this.prepared_request['is_standalone'] = "Y";
                    this.processed_request['___is_standalone___'] = this.prepared_request['is_standalone'];
                    this.prepared_request['tp_policy_number'] = this.lm_request['tp_policy_number'];
                    this.processed_request['___tp_policy_number___'] = this.prepared_request['tp_policy_number'];
                    this.prepared_request['tp_start_date'] = this.lm_request['tp_start_date'].split("-").reverse().join("-").replace(/-/g, '');
                    this.processed_request['___tp_start_date___'] = this.prepared_request['tp_start_date'];
                    this.prepared_request['tp_end_date'] = this.lm_request['tp_end_date'].split("-").reverse().join("-").replace(/-/g, '');
                    this.processed_request['___tp_end_date___'] = this.prepared_request['tp_end_date'];

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

            if (this.lm_request['method_type'] === 'Customer') {
                console.error("TATA_CUSTOM");
                if (this.prepared_request["Plan_Name"] === "Basic" || this.prepared_request["Plan_Name"] === "OD" || this.prepared_request["Plan_Name"] === "TP") {
                    console.error("TATA_CUSTOM_BASIC");
                    this.prepared_request['addon_emergency_transport_hotel'] = "N";
                    this.processed_request['___addon_emergency_transport_hotel___'] = this.prepared_request['addon_emergency_transport_hotel'];
                    this.prepared_request['addon_repair_glass_fiber_plastic'] = "N";
                    this.processed_request['___addon_repair_glass_fiber_plastic___'] = this.prepared_request['addon_repair_glass_fiber_plastic'];
                }
            }
            if (this.lm_request['method_type'] === 'Proposal' && this.lm_request["vehicle_insurance_subtype"] === "1OD_0TP") {
                this.prepared_request['is_standalone'] = "Y";
                this.processed_request['___is_standalone___'] = this.prepared_request['is_standalone'];
                this.prepared_request['tp_policy_number'] = this.lm_request['tp_policy_number'];
                this.processed_request['___tp_policy_number___'] = this.prepared_request['tp_policy_number'];
                this.prepared_request['tp_start_date'] = this.lm_request['tp_start_date'].split("-").reverse().join("-").replace(/-/g, '');
                this.processed_request['___tp_start_date___'] = this.prepared_request['tp_start_date'];
                this.prepared_request['tp_end_date'] = this.lm_request['tp_end_date'].split("-").reverse().join("-").replace(/-/g, '');
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
                //this.prepared_request['dbmaster_pb_insurer_code'] = "";
                //this.processed_request['___dbmaster_pb_insurer_code___'] = this.prepared_request['dbmaster_pb_insurer_code'];
                //this.prepared_request['dbmaster_pb_previousinsurer_address'] = "";
                //this.processed_request['___dbmaster_pb_previousinsurer_address___'] = this.prepared_request['dbmaster_pb_previousinsurer_address'];
                //this.prepared_request['dbmaster_pb_previousinsurer_pincode'] = "";
                //this.processed_request['___dbmaster_pb_previousinsurer_pincode___'] = this.prepared_request['dbmaster_pb_previousinsurer_pincode'];

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

                if (this.lm_request['method_type'] === 'Customer') {
                    this.prepared_request['addon_emergency_transport_hotel'] = "N";
                    this.processed_request['___addon_emergency_transport_hotel___'] = this.prepared_request['addon_emergency_transport_hotel'];

                    this.prepared_request['addon_repair_glass_fiber_plastic'] = "N";
                    this.processed_request['___addon_repair_glass_fiber_plastic___'] = this.prepared_request['addon_repair_glass_fiber_plastic'];
                }

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
        if (this.lm_request['method_type'] === 'Proposal') {
            if (this.lm_request['vehicle_insurance_type'] === "renew") {
                if (this.lm_request.hasOwnProperty('is_valid_pucc') && this.lm_request['is_valid_pucc'] === "yes") {
                    this.prepared_request['is_valid_pucc'] = "Y";
                    this.processed_request['___is_valid_pucc___'] = this.prepared_request['is_valid_pucc'];
                } else if (this.lm_request.hasOwnProperty('is_valid_pucc') && this.lm_request['is_valid_pucc'] === "no") {
                    this.prepared_request['is_valid_pucc'] = "N";
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
                this.prepared_request['policy_start_date'] = this.prepared_request['policy_start_date'].replace(/-/g, '');
                this.processed_request['___policy_start_date___'] = this.processed_request['___policy_start_date___'].replace(/-/g, '');
            }
            if (this.prepared_request.hasOwnProperty('birth_date')) {
                this.prepared_request['birth_date'] = this.prepared_request['birth_date'].replace(/-/g, '');
                this.processed_request['___birth_date___'] = this.processed_request['___birth_date___'].replace(/-/g, '');
            }

            if (this.processed_request.hasOwnProperty('___insured_age___')) {
                this.prepared_request['drivingexp'] = parseInt(this.processed_request['___insured_age___']) - 18;
                this.processed_request['___drivingexp___'] = this.prepared_request['drivingexp'];
            }
            this.prepared_request['dbmaster_insurer_transaction_identifier'] = this.prepared_request['insurer_customer_identifier'];
            this.processed_request['___dbmaster_insurer_transaction_identifier___'] = this.prepared_request['dbmaster_insurer_transaction_identifier'];

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

        if (this.lm_request.hasOwnProperty('is_tppd')) {
            if (this.lm_request['is_tppd'] === 'yes') {
                this.prepared_request['is_tppd'] = "Y";
                this.processed_request['___is_tppd___'] = this.prepared_request['is_tppd'];
            } else {
                this.prepared_request['is_tppd'] = "N";
                this.processed_request['___is_tppd___'] = this.prepared_request['is_tppd'];
            }
        } else {
            this.prepared_request['is_tppd'] = "N";
            this.processed_request['___is_tppd___'] = this.prepared_request['is_tppd'];
        }


        if (this.prepared_request.hasOwnProperty('policy_start_date')) {
            this.prepared_request['policy_start_date'] = this.prepared_request['policy_start_date'].replace(/-/g, '');
            this.processed_request['___policy_start_date___'] = this.processed_request['___policy_start_date___'].replace(/-/g, '');
        }
        this.prepared_request['policy_expiry_date'] = this.prepared_request['policy_expiry_date'].replace(/-/g, '');
        this.processed_request['___policy_expiry_date___'] = this.prepared_request['policy_expiry_date'];

        this.prepared_request['policy_end_date_extended'] = this.prepared_request['policy_end_date_extended'].replace(/-/g, '');
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
        if(this.lm_request['vehicle_insurance_type'] === 'new' && ([1, 10].indexOf(this.lm_request['product_id']) > -1)){
            if(this.lm_request.hasOwnProperty('cpa_tenure') && this.lm_request['is_pa_od'] == "yes") {
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
    if (specific_insurer_object.method.Method_Type === 'Proposal') {
        obj_response_handler = this.proposal_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Customer') {
        obj_response_handler = this.customer_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Verification') {
        obj_response_handler = this.verification_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Pdf') {
        obj_response_handler = this.pdf_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Status') {
        obj_response_handler = this.status_response_handler(objResponseJson);
    }
    return obj_response_handler;

};
TataAIGMotor.prototype.insurer_product_field_process_post = function () {

};
TataAIGMotor.prototype.insurer_product_api_post = function () {

};
TataAIGMotor.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    try {
        var objInsurerProduct = this;
        var product_id = objProduct.db_specific_product.Product_Id;//
        var insurer_id = Insurer_Object.Insurer_ID;
        var soap = require('soap');
        var xml2js = require('xml2js');
        // var PostData = JSON.parse(docLog.Insurer_Request);
        //Example POST method invocation 
        var Client = require('node-rest-client').Client;
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
        var client = new Client();
        // set content-type header and data as json in args parameter 
        console.log(docLog.Insurer_Request);

        if (specific_insurer_object.method.Method_Type === 'Premium' || specific_insurer_object.method.Method_Type === 'Idv' || (specific_insurer_object.method.Method_Type === 'Customer'))
        {
//            var obj = {
//                'T': '2D9D1BC5A837E7A2741C6121317E9EE6CE1D32145CBCF7084FA4493ECDA2C2804969A5473610BC2AB4FC034359C11D55F99F8AEC736D84F0EFD531DFE24FFC74F0923F1288A83121B8045A8AAA4D9F920B4D737E3A1134B824E23B1F0561D97AEA647554A31570720BDB6E4CE3D8813A1138ABF16F2A23A8E6BAB012DD07B768019A5B583351F6D36C1F6F26B5C8D474D2F701E664A96F73806EE3A5235DEFFD76CF4106F7F074A55258D75B1DDEFD38',
//                'SRC': 'TP',
//                'productid': product_id == 1 ? '3121' : '3122',
//                'QDATA': docLog.Insurer_Request
//            }
            var obj = {
                data: {
                    'T': config.environment.name === 'Production' ? Insurer_Object.Account_Code_Live : Insurer_Object.Account_Code,
                    'SRC': config.environment.name === 'Production' ? Insurer_Object.Agent_Code_Live : Insurer_Object.Agent_Code,
                    'productid': product_id === 1 ? '3121' : '3122',
                    'QDATA': docLog.Insurer_Request
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };

            obj.data = jsonToQueryString(obj.data);
            //client.post(specific_insurer_object['method']['Service_URL']+"?T=&SRC=TP&productid=3121&QDATA="+docLog.Insurer_Request, args, function (data, response) {  
            //client.post(specific_insurer_object['method']['Service_URL'] + "?" + obj, function (data, response) {
            client.post(specific_insurer_object['method']['Service_URL'], obj, function (data, response) {
                console.log(data);
                console.error("tata_kk_res", data);
                var objResponseFull = {
                    'err': null,
                    'result': null,
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
        } else if (specific_insurer_object.method.Method_Type === 'Proposal')
        {
            let return_url = "";
            if (config.environment.name === 'Production') {
                return_url = 'http://horizon.policyboss.com/transaction-status/' + this.lm_request['udid'] + '/' + this.lm_request['crn'] + '/' + this.lm_request['proposal_id'];
            } else
            {
                return_url = 'http://qa-horizon.policyboss.com/transaction-status/' + this.lm_request['udid'] + '/' + this.lm_request['crn'] + '/' + this.lm_request['proposal_id'];
                //return_url = this.const_payment.pg_ack_url;
            }
            console.error('TATA_THANKYOU_URL ' + return_url);
            var obj = {
                data: {
                    'T': config.environment.name === 'Production' ? Insurer_Object.Account_Code_Live : Insurer_Object.Account_Code,
                    'SRC': config.environment.name === 'Production' ? Insurer_Object.Agent_Code_Live : Insurer_Object.Agent_Code,
                    'product_code': product_id === 1 ? '3121' : '3122',
                    'PDATA': docLog.Insurer_Request,
                    'THANKYOU_URL': return_url
                            //'THANKYOU_URL': 'http://localhost:7000/transaction-status/' + this.lm_request['udid'] + '/' + this.lm_request['crn'] + '/' + this.lm_request['proposal_id']
                            //'THANKYOU_URL': "http://qa.policyboss.com/transaction-status/CRN" + this.lm_request['crn']
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            };

            obj.data = jsonToQueryString(obj.data);
            //client.post(specific_insurer_object['method']['Service_URL']+"?T=2D9D1BC5A837E7A2741C6121317E9EE6CE1D32145CBCF7084FA4493ECDA2C2804969A5473610BC2AB4FC034359C11D55F99F8AEC736D84F0EFD531DFE24FFC74F0923F1288A83121B8045A8AAA4D9F920B4D737E3A1134B824E23B1F0561D97AEA647554A31570720BDB6E4CE3D8813A1138ABF16F2A23A8E6BAB012DD07B768019A5B583351F6D36C1F6F26B5C8D474D2F701E664A96F73806EE3A5235DEFFD76CF4106F7F074A55258D75B1DDEFD38&SRC=TP&product_code=3121&PDATA="+docLog.Insurer_Request+"&THANKYOU_URL=http://qa.policyboss.com/transaction-status/", args, function (data, response) {          
            //client.post(specific_insurer_object['method']['Service_URL'] + "?" + obj, function (data, response) {
            client.post(specific_insurer_object['method']['Service_URL'], obj, function (data, response) {
                console.log(data);
                console.log(objResponseFull);
                var objResponseFull = {
                    'err': null,
                    'result': null,
                    'raw': JSON.stringify(docLog),
                    'soapHeader': null,
                    'objResponseJson': data
                };
                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);

            });
        } else if (specific_insurer_object.method.Method_Type === 'Status')
        {
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
                    'result': null,
                    'raw': JSON.stringify(docLog),
                    'soapHeader': null,
                    'objResponseJson': data
                };
                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);

            });
        } else if (specific_insurer_object.method.Method_Type === 'Verification' && this.lm_request.hasOwnProperty('calling_type'))
        {
            console.error("status_calling");
            if (this.lm_request['calling_type'] === "Status") {
                var obj = {
                    'T': '76FA61783DDADCD9A738131EEE3DDE223122EFC4A867959369EBC40E99AC64BD93A197BBC43176B46B2D6F5ADC6E88209A2EB505032B219F65B9D27A3604A6E4D35E90FD5D7E56F94DDA36BDDDEACC8C8A5A4858894E99DC91D5BCA85D17D0CF3C15F0D4B8BABDA7313129E007BD492205E00A2DB09E9E22B5A7ED79375B4F799E0CC7751A730A4830801DCDFBE66B1E7FCC8D9B11F6F20E8407F25486BB41B26DC84593294CF78DBBD19F529B13614F', //config.environment.name === 'Production' ? Insurer_Object.Account_Code_Live : Insurer_Object.Account_Code,
                    'PDATA': docLog.Insurer_Request
                };
                obj = jsonToQueryString(obj);
                client.post(specific_insurer_object['method']['Service_URL'] + "?" + obj, function (data, response) {
                    console.log(data);
                    console.log(objResponseFull);
                    var objResponseFull = {
                        'err': null,
                        'result': null,
                        'raw': JSON.stringify(docLog),
                        'soapHeader': null,
                        'objResponseJson': data
                    };
                    var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);

                });
            }
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
    var Error_Msg = 'NO_ERR';
    try {
        //check error start

        if (objResponseJson.hasOwnProperty('data')) {
            objPremiumService = objResponseJson['data'];
            if (objPremiumService.hasOwnProperty('errcode')) {
                if (objPremiumService['errcode'] !== '') {
                    if (objPremiumService.hasOwnProperty('message') && objPremiumService['message'] !== '') {
                        Error_Msg = objPremiumService['errcode'] + '-' + objPremiumService['message'];
                    }
                    if (objResponseJson.hasOwnProperty('ErrorText') && objResponseJson['ErrorText'] !== '') {
                        Error_Msg = objResponseJson['ErrorText'];
                    }
                }
            } else {
                Error_Msg = 'LM_errcode_NA';
            }
        } else {
            Error_Msg = 'LM_MAIN_data_NA';
        }
        //check error stop
        if (Error_Msg === 'NO_ERR') {
            var Idv_Breakup = this.const_idv_breakup;
            Idv_Breakup["Idv_Normal"] = parseInt(objResponseJson['data']['quotationdata']['idv'] - 0);
            Idv_Breakup["Idv_Min"] = parseInt(objResponseJson['data']['quotationdata']['idvlowerlimit'] - 0);
            Idv_Breakup["Idv_Max"] = parseInt(objResponseJson['data']['quotationdata']['idvupperlimit'] - 0);
            Idv_Breakup["Exshowroom"] = 0;

            objServiceHandler.Premium_Breakup = Idv_Breakup;
            objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['data']['quotationdata']['quotation_no'];
        }
    } catch (e) {
        Error_Msg = 'LM::' + e.stack;
        console.error('Exception', this.constructor.name, 'idv_response_handler', objResponseJson, e.stack);
    }
    objServiceHandler.Error_Msg = Error_Msg;
    console.log('Finish', this.constructor.name, 'idv_response_handler', objServiceHandler);
    return objServiceHandler;
};
TataAIGMotor.prototype.coverage_response_handler = function (objResponseJson) {
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Coverage': null
    };

    try {
        console.log('Start', this.constructor.name, 'coverage_response_handler', objResponseJson);
        objResponseJson = objResponseJson["data"];
        var Idv_limit = {};
        var Error_Msg = 'NO_ERR';
        if (objResponseJson.hasOwnProperty('errcode')) {
            //check error stop
            if (objResponseJson['errcode'] === '') {
                if (Error_Msg === 'NO_ERR') {
                    if (objResponseJson.hasOwnProperty('quotationdata')) {
                        Idv_limit['idv'] = objResponseJson['quotationdata']['idv'];
                        Idv_limit['idvupperlimit'] = objResponseJson['quotationdata']['idvupperlimit'];
                        Idv_limit['idvlowerlimit'] = objResponseJson['quotationdata']['idvlowerlimit'];
                    }
                    objServiceHandler.Coverage = Idv_limit;
                } else {
                    Error_Msg = objResponseJson['errcode'];
                }
            }
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'coverage_response_handler', objServiceHandler);
        return objServiceHandler;
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'coverage_response_handler', objServiceHandler);
        return objServiceHandler;
    }
};
TataAIGMotor.prototype.premium_response_handler = function (objResponseJson) {
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    try {
        console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
        objResponseJson = objResponseJson["data"];


        var Error_Msg = 'NO_ERR';
        //check error start
        if (objResponseJson.hasOwnProperty('errcode')) {
            //check error stop
            if (objResponseJson['errcode'] === '') {
                var jsonPremium = objResponseJson;

                if (Error_Msg === 'NO_ERR') {
                    console.log(this.Plan_condition(objResponseJson));
                    console.log(this.docRequest['Request_Product']['addon_package_name']);
                    console.log(this['addon_processed_request']['addon_package_name']);
                    console.log(this['prepared_request']['Plan_Name']);
                    console.log(this.prepared_request['vehicle_age_year']);
                    //if (this.Plan_condition(objResponseJson))
                    //{
                    var objInsurerPremium = {};
                    var objInsurerAddon = {};
                    var premium_breakup = this.get_const_premium_breakup();

                    var od_final = 0;
                    for (var keycover in this.premium_breakup_schema['own_damage']) {
                        var tata_key = this.premium_breakup_schema['own_damage'][keycover];
                        if (objResponseJson.hasOwnProperty(tata_key) && tata_key !== '') {
                            premium_breakup['own_damage'][keycover] = objResponseJson[tata_key]["premium"];
                        } else {
                            premium_breakup['own_damage'][keycover] = 0;
                        }
                    }

                    for (var keyCover in this.premium_breakup_schema['addon']) {
                        var tata_key = this.premium_breakup_schema['addon'][keyCover];
                        if (objResponseJson.hasOwnProperty(tata_key)) {
                            premium_breakup['addon'][keyCover] = objResponseJson[tata_key]['premium'];
                        } else {
                            premium_breakup['addon'][keyCover] = 0;
                        }
                    }
                    for (var keyCover in this.premium_breakup_schema['liability']) {
                        var tata_key = this.premium_breakup_schema['liability'][keyCover];
                        if (objResponseJson.hasOwnProperty(tata_key)) {
                            premium_breakup['liability'][keyCover] = objResponseJson[tata_key]['premium'];
                        } else {
                            premium_breakup['liability'][keyCover] = 0;
                        }
                    }


                    premium_breakup['addon']['addon_final_premium'] = 0;
                    premium_breakup['addon']['addon_road_assist_cover'] = premium_breakup['addon']['addon_road_assist_cover'] / 1.18;
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
                    // premium_breakup['own_damage']['od_final_premium'] = od_final - 0;

                    premium_breakup['liability']['tp_final_premium'] = objResponseJson["NETTP"] - 0;
                    premium_breakup['net_premium'] = objResponseJson["NETPREM"] - 0;
                    premium_breakup['service_tax'] = objResponseJson['TAX']['total_prem'];//UWOperationResult['ServiceTax'][0] - 0;
                    premium_breakup['final_premium'] = parseInt(objResponseJson["TOTALPAYABLE"]);//UWOperationResult['TotalPremium'][0] - 0;

                    objServiceHandler.Premium_Breakup = premium_breakup;
                    objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['quotationdata']['quotation_no'];
                    // }
                }

            } else {
                Error_Msg = objResponseJson['errcode'];
            }
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
        method_content = method_content.replace('___lv_quote_no___', this.lv_quote_no());
        this.method_content = method_content.replace('___vehicle_expected_idv___', 0);
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
        'Premium_Breakup': null,
        'Customer': null
    };
    var Error_Msg = 'NO_ERR';
    try {

        objResponseJson = objResponseJson["data"];

        var Error_Msg = 'NO_ERR';
        //check error start
        if (objResponseJson.hasOwnProperty('errcode')) {
            if (objResponseJson['errcode'] === '') {
                if (Error_Msg === 'NO_ERR') {
                    var premium_breakup = this.get_const_premium_breakup();

                    for (var keycover in this.premium_breakup_schema['own_damage']) {
                        var tata_key = this.premium_breakup_schema['own_damage'][keycover];
                        if (objResponseJson.hasOwnProperty(tata_key) && tata_key !== '') {
                            premium_breakup['own_damage'][keycover] = objResponseJson[tata_key]["premium"];
                        } else {
                            premium_breakup['own_damage'][keycover] = 0;
                        }
                    }

                    for (var keyCover in this.premium_breakup_schema['addon']) {
                        var tata_key = this.premium_breakup_schema['addon'][keyCover];
                        if (objResponseJson.hasOwnProperty(tata_key)) {
                            premium_breakup['addon'][keyCover] = objResponseJson[tata_key]['premium'];
                        } else {
                            premium_breakup['addon'][keyCover] = 0;
                        }
                    }
                    for (var keyCover in this.premium_breakup_schema['liability']) {
                        var tata_key = this.premium_breakup_schema['liability'][keyCover];
                        if (objResponseJson.hasOwnProperty(tata_key)) {
                            premium_breakup['liability'][keyCover] = objResponseJson[tata_key]['premium'];
                        } else {
                            premium_breakup['liability'][keyCover] = 0;
                        }
                    }


                    premium_breakup['addon']['addon_final_premium'] = 0;
                    premium_breakup['addon']['addon_road_assist_cover'] = premium_breakup['addon']['addon_road_assist_cover'] / 1.18;
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
                    // premium_breakup['own_damage']['od_final_premium'] = od_final - 0;

                    premium_breakup['liability']['tp_final_premium'] = objResponseJson["NETTP"] - 0;
                    premium_breakup['net_premium'] = objResponseJson["NETPREM"] - 0;
                    premium_breakup['service_tax'] = objResponseJson['TAX']['total_prem'];//UWOperationResult['ServiceTax'][0] - 0;
                    premium_breakup['final_premium'] = parseInt(objResponseJson["TOTALPAYABLE"]);//UWOperationResult['TotalPremium'][0] - 0;

                    objServiceHandler.Premium_Breakup = premium_breakup;
                    objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['quotationdata']['quotation_no'];

                    var Customer = {
                        'insurer_customer_identifier': objResponseJson['quotationdata']['quotation_no'].toString()
                    };
                    objServiceHandler.Customer = Customer;
                    objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['quotationdata']['quotation_no'].toString();

                }

            } else {
                Error_Msg = objResponseJson['errcode'] + '-' + objResponseJson['message'];
            }
        }

        objServiceHandler.Error_Msg = Error_Msg;

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
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        //'Payment': {
        //    "pg_ack_url": "http://qa.policyboss.com/transaction-status/CRN" + this.lm_request['crn'],
        //    "pg_url": "https://pipuat.tataaiginsurance.in/tagichubws/cpirequest.jsp",
        //   "proposal_confirm_url": "http://qa-horizon.policyboss.com" + "/proposal-confirm?udid=" + this.lm_request['udid']
        //}
        'Payment': this.const_payment
    };
    try {
        console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
        var objResponseData = objResponseJson['data'];
        var proposalPremium;

        var Error_Msg = 'NO_ERR';
        //check error start
        if (objResponseData.hasOwnProperty('errcode')) {
            //check error stop
            if (objResponseData['errcode'] === '' && objResponseData['message'] === '') {
                var ProposalNo = objResponseData['proposalno'];
            } else {
                Error_Msg = objResponseData['errcode'] + '-' + objResponseData['message'];
            }
        }
        if (Error_Msg === 'NO_ERR') {
            proposalPremium = config.environment.name === 'Production' ? objResponseData['premiun'] : objResponseData['premium'];
            var QuotePremium = this.lm_request['final_premium'];
            //var QuotePremium = this.insurer_master['service_logs']['insurer_db_master']['Premium_Breakup']['final_premium'];
            console.log("tata_kk_amt_" + QuotePremium);
            console.error("tata_kk_amt_" + QuotePremium);
            var objPremiumVerification = this.premium_verification(QuotePremium, proposalPremium);
            if (objPremiumVerification.Status) {
                var transaction_id = objResponseJson['refno'];
                var customer_id = objResponseData['abcustid'];
                var pg_url = this.const_payment.pg_url;
                var hashkey = '67H571iF5ol7q1n8';
                var src = this.insurer_master.service_logs.insurer_db_master.LM_Custom_Request['insurer_integration_agent_code'];
                var pg_data = {
                    'proposal_no': ProposalNo,
                    'src': src
                };

                function jsonToQueryString(json) {
                    return '?' +
                            Object.keys(json).map(function (key) {
                        return encodeURIComponent(key) + '=' +
                                encodeURIComponent(json[key]);
                    }).join('&');
                }
                var qs = jsonToQueryString(pg_data);
                var checksummsg = pg_url + qs + hashkey;
                var checksumvalue = this.convert_to_md5(checksummsg);
                //pg_data['hash'] = checksumvalue;

                objServiceHandler.Payment.pg_data = pg_data;
                objServiceHandler.Payment.pg_redirect_mode = 'POST';
                objServiceHandler.Insurer_Transaction_Identifier = ProposalNo;
            } else {
                Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
            }
        }
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
        //var objResponse={"status":"1","data":{"proposalno":"P/N/3122/0000085516","policyno":"064001/0173584841/000000/00","rnd_str":"ixUADUoBQmInl3s4SmIcvAzSK","productname":"Two Wheeler","productcode":"3122","uw_ref":"","status":"1","message":"","is_SAOD":false,"errocde":""}};
        let objInsurerProduct = this;
        if (objInsurerProduct.lm_request.hasOwnProperty('calling_type')) {
            if (this.lm_request.calling_type === "Status") {
                this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.policy_number = "";
                this.const_policy.pg_reference_number_1 = "";
                this.const_policy.pg_reference_number_2 = objInsurerProduct.lm_request.pg_post['proposal_no'];
                this.const_policy.pg_reference_number_3 = objInsurerProduct.date_format(new Date(), 'yyyy-MM-dd');
                this.const_policy.transaction_id = objInsurerProduct.lm_request.pg_post['proposal_no'];
                this.const_policy.transaction_amount = objInsurerProduct.lm_request.pg_post['transaction_amount'];
            }

        } else {
            var objResponse = JSON.parse(new Buffer(objInsurerProduct.const_payment_response.pg_get['response'], 'base64').toString('ascii'));
            this.const_policy.decoded_response = JSON.stringify(objResponse);
            console.error('TataPgdata', this.constructor.name, objResponse);
            //var errcode = config.environment.name === 'Production' ? objResponse['data']['errcode'] : objResponse['data']['errocde'];
            var status = objResponse['data']['status'];
            if (status === "1") {
                console.error('TataPgStart', this.constructor.name, 'success');
                if (objResponse['data'].hasOwnProperty('policyno') && objResponse['data']['policyno'] !== "") {
                    this.const_policy.pg_status = 'SUCCESS';
                    this.const_policy.policy_number = objResponse['data']['policyno'];
                    this.const_policy.pg_reference_number_1 = objResponse['data']['rnd_str'];
                    this.const_policy.pg_reference_number_2 = objResponse['data']['proposalno'];
                    this.const_policy.pg_reference_number_3 = objResponse['data']['message'];
                    this.const_policy.pg_message = objResponse['data']['message'];
                    this.const_policy.transaction_id = objResponse['data']['proposalno'];
                    this.const_policy.transaction_amount = objInsurerProduct.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['final_premium'];
                } else {
                    this.const_policy.pg_status = 'PAYPASS';
                    this.const_policy.transaction_status = 'PAYPASS';
                    this.const_policy.policy_number = "";
                    this.const_policy.pg_reference_number_1 = objResponse['data']['rnd_str'];
                    this.const_policy.pg_reference_number_2 = objResponse['data']['proposalno'];
                    this.const_policy.pg_reference_number_3 = objResponse['data']['message'];
                    this.const_policy.pg_message = objResponse['data']['message'];
                }
            } else {
                if (objResponse['data'].hasOwnProperty('policyno') && objResponse['data']['policyno'] !== "" && objResponse['data']['errcode'] === "EPCA0226") {
                    console.error('TataPgStart', this.constructor.name, 'success_1');
                    this.const_policy.pg_status = 'SUCCESS';
                    this.const_policy.policy_number = objResponse['data']['policyno'];
                    this.const_policy.pg_reference_number_1 = objResponse['data']['key'];
                    this.const_policy.pg_reference_number_3 = "";
                } else {
                    console.error('TataPgStart', this.constructor.name, 'fail');
                    this.const_policy.pg_status = 'FAIL';
                    this.const_policy.transaction_status = 'FAIL';
                    this.const_policy.policy_number = "";
                    this.const_policy.pg_reference_number_1 = objResponse['data']['key'];
                    this.const_policy.pg_reference_number_2 = objResponse['data']['proposalno'];
                    this.const_policy.pg_reference_number_3 = objResponse['data']['message'];
                    this.const_policy.pg_message = objResponse['data']['message'];
                }
            }
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
        if (objInsurerProduct.const_policy.pg_status === 'FAIL') {

        }
        if (objInsurerProduct.const_policy.pg_status === 'SUCCESS') {
            //Recon API 
            console.error('TataVerStart', this.constructor.name, 'ver_success');
            if (objInsurerProduct.lm_request.hasOwnProperty('calling_type')) {
                if (this.lm_request['calling_type'] === "Status") {
                    if (objResponseJson.data.hasOwnProperty('policyno')) {
                        objInsurerProduct.const_policy.policy_number = objResponseJson.data['policyno'];
                        objInsurerProduct.const_policy.pg_reference_number_1 = objResponseJson.data['key'];
                    }
                }
            } else {
                if (objInsurerProduct.const_policy.pg_reference_number_3 !== "") {
                    Error_Msg = objInsurerProduct.const_policy.pg_reference_number_3;
                }
            }

            if (Error_Msg === 'NO_ERR') {
                if (objInsurerProduct.const_policy.policy_number !== '') {
                    console.error('TataVerStart', this.constructor.name, 'policy_number', objInsurerProduct.const_policy['policy_number']);
                    //this.const_policy.policy_number = objResponseJson['policyno'];
                    this.const_policy.transaction_status = 'SUCCESS';
                    var product_name = 'CAR';
                    if (this.lm_request['product_id'] === 10) {
                        product_name = 'TW';
                    }

                    var pdf_file_name = this.constructor.name + '_' + product_name + '_' + objInsurerProduct.const_policy['policy_number'].replaceAll('/', '') + '.pdf';
                    var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                    var pdf_web_path = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    objInsurerProduct.const_policy.policy_url = pdf_web_path;


                    var args = {
                        data: {
                            "search_reference_number": objInsurerProduct.lm_request['search_reference_number'],
                            "api_reference_number": objInsurerProduct.lm_request['api_reference_number'],
                            "policy_number": objInsurerProduct.const_policy.policy_number,
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
                    objInsurerProduct.const_policy.verification_request = args.data;

                    var https = require('https');
                    var insurer_pdf_url = objInsurerProduct.prepared_request['insurer_integration_pdf_url'];
                    insurer_pdf_url = insurer_pdf_url.replace('___policy_number___', objInsurerProduct.const_policy.policy_number);
                    insurer_pdf_url = insurer_pdf_url.replace('___key___', objInsurerProduct.const_policy.pg_reference_number_1);
                    this.const_policy.insurer_policy_url = insurer_pdf_url;
                    try {
                        console.error('TataVerStart', this.constructor.name, 'pdf', pdf_sys_loc);
                        var file_horizon = fs.createWriteStream(pdf_sys_loc);
                        //var file_portal = fs.createWriteStream(pdf_sys_loc);  //local
                        var request = https.get(insurer_pdf_url, function (response) {
                            response.pipe(file_horizon);
                            // response.pipe(file_portal); //local
                        });
                        //sleep(40000);
                    } catch (ep) {
                        console.error('ExceptionPDF', this.constructor.name, 'verification_response_handler', ep.stack);
                    }
                    //End                   

                } else {
                    objInsurerProduct.const_policy.transaction_status = 'PAYPASS';
                }
            } else {
                objInsurerProduct.const_policy.transaction_status = 'PAYPASS';
            }
            objServiceHandler.Insurer_Transaction_Identifier = objInsurerProduct.const_policy.transaction_id;
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
TataAIGMotor.prototype.pg_response_handler_NIU2010 = function () {
    console.error('TataPgStart', this.constructor.name, 'pg_response_handler');
    //var objResponse={"status":"1","data":{"proposalno":"P/N/3122/0000085516","policyno":"064001/0173584841/000000/00","rnd_str":"ixUADUoBQmInl3s4SmIcvAzSK","productname":"Two Wheeler","productcode":"3122","uw_ref":"","status":"1","message":"","is_SAOD":false,"errocde":""}};
    if (this.lm_request.hasOwnProperty('calling_type')) {
        if (this.lm_request.calling_type === "Status") {
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.policy_number = "";
            this.const_policy.pg_reference_number_1 = "";
            this.const_policy.pg_reference_number_2 = this.lm_request.pg_post['proposal_no'];
            this.const_policy.pg_reference_number_3 = this.date_format(new Date(), 'yyyy-MM-dd');
            this.const_policy.transaction_id = this.lm_request.pg_post['proposal_no'];
            this.const_policy.transaction_amount = this.lm_request.pg_post['transaction_amount'];
        }

    } else {
        var objResponse = JSON.parse(new Buffer(this.const_payment_response.pg_get['response'], 'base64').toString('ascii'));
        console.error('TataPgdata', this.constructor.name, objResponse);
        //var errcode = config.environment.name === 'Production' ? objResponse['data']['errcode'] : objResponse['data']['errocde'];
        var status = objResponse['data']['status'];
        if (status === "1") {
            console.error('TataPgStart', this.constructor.name, 'success');
            if (objResponse['data'].hasOwnProperty('policyno') && objResponse['data']['policyno'] !== "") {
                this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.policy_number = objResponse['data']['policyno'];
                this.const_policy.pg_reference_number_1 = objResponse['data']['rnd_str'];
                this.const_policy.pg_reference_number_2 = objResponse['data']['proposalno'];
                this.const_policy.pg_reference_number_3 = objResponse['data']['message'];
                this.const_policy.transaction_id = objResponse['data']['proposalno'];
                this.const_policy.transaction_amount = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['final_premium'];
            } else {
                this.const_policy.pg_status = 'PAYPASS';
                this.const_policy.transaction_status = 'PAYPASS';
                this.const_policy.policy_number = "";
                this.const_policy.pg_reference_number_1 = objResponse['data']['rnd_str'];
                this.const_policy.pg_reference_number_2 = objResponse['data']['proposalno'];
                this.const_policy.pg_reference_number_3 = objResponse['data']['message'];
            }
        } else {
            if (objResponse['data'].hasOwnProperty('policyno') && objResponse['data']['policyno'] !== "" && objResponse['data']['errcode'] === "EPCA0226") {
                console.error('TataPgStart', this.constructor.name, 'success_1');
                this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.policy_number = objResponse['data']['policyno'];
                this.const_policy.pg_reference_number_1 = objResponse['data']['key'];
                this.const_policy.pg_reference_number_3 = "";
            } else {
                console.error('TataPgStart', this.constructor.name, 'fail');
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
                this.const_policy.policy_number = "";
                this.const_policy.pg_reference_number_1 = objResponse['data']['key'];
                this.const_policy.pg_reference_number_2 = objResponse['data']['proposalno'];
                this.const_policy.pg_reference_number_3 = objResponse['data']['message'];
            }
        }
    }
};
TataAIGMotor.prototype.verification_response_handler_NIU2010 = function (objResponseJson) {

    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);

    try {
        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null,
            'Policy': null
        };
        var Error_Msg = 'NO_ERR';

        if (this.const_policy.pg_status === 'FAIL') {
            //Error_Msg = this.const_policy.pg_reference_number_3;
        }
        if (this.const_policy.pg_status === 'SUCCESS') {
            //Recon API 
            console.error('TataVerStart', this.constructor.name, 'ver_success');
            if (this.lm_request.hasOwnProperty('calling_type')) {
                if (this.lm_request['calling_type'] === "Status") {
                    if (objResponseJson.data.hasOwnProperty('policyno')) {
                        this.const_policy.policy_number = objResponseJson.data['policyno'];
                        this.const_policy.pg_reference_number_1 = objResponseJson.data['key'];
                    }
                }
            } else {
                if (this.const_policy.pg_reference_number_3 !== "") {
                    Error_Msg = this.const_policy.pg_reference_number_3;
                }
            }

            if (Error_Msg === 'NO_ERR') {
                if (this.const_policy.policy_number !== '') {
                    console.error('TataVerStart', this.constructor.name, 'policy_number', this.const_policy['policy_number']);
                    //this.const_policy.policy_number = objResponseJson['policyno'];
                    this.const_policy.transaction_status = 'SUCCESS';
                    var product_name = 'CAR';
                    if (this.lm_request['product_id'] === 10) {
                        product_name = 'TW';
                    }

                    var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.const_policy['policy_number'].replaceAll('/', '') + '.pdf';
                    var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                    var pdf_sys_loc_portal = config.pb_config.pdf_system_loc + pdf_file_name;

                    var pdf_web_path_horizon = config.environment.weburl + "/pdf/" + pdf_file_name;
                    //var pdf_web_path = config.environment.portalurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    var pdf_web_path = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    this.const_policy.policy_url = pdf_web_path;

                    var Client = require('node-rest-client').Client;

                    var args = {
                        data: {
                            "search_reference_number": this.lm_request['search_reference_number'],
                            "api_reference_number": this.lm_request['api_reference_number'],
                            "policy_number": this.const_policy.policy_number,
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
                    this.const_policy.verification_request = args.data;
                    //var sleep = require('system-sleep');
                    //sleep(40000);

                    //Temp
                    var https = require('https');
                    var insurer_pdf_url = this.prepared_request['insurer_integration_pdf_url'];
                    insurer_pdf_url = insurer_pdf_url.replace('___policy_number___', this.const_policy.policy_number);
                    insurer_pdf_url = insurer_pdf_url.replace('___key___', this.const_policy.pg_reference_number_1);
                    this.const_policy.insurer_policy_url = insurer_pdf_url;
                    try {
                        console.error('TataVerStart', this.constructor.name, 'pdf', pdf_sys_loc);
                        var file_horizon = fs.createWriteStream(pdf_sys_loc);
                        //var file_portal = fs.createWriteStream(pdf_sys_loc);  //local
                        var request = https.get(insurer_pdf_url, function (response) {
                            response.pipe(file_horizon);
                            // response.pipe(file_portal); //local
                        });
                        //sleep(40000);
                    } catch (ep) {
                        console.error('ExceptionPDF', this.constructor.name, 'verification_response_handler', ep);
                    }
                    //End
                    //this.pdf_call(config.environment.weburl + '/quote/pdf_initiate', args, pdf_sys_loc);

                } else {
                    this.const_policy.transaction_status = 'PAYPASS';
                }
            } else {
                this.const_policy.transaction_status = 'PAYPASS';
            }
            objServiceHandler.Insurer_Transaction_Identifier = this.const_policy.transaction_id;
        }
        objServiceHandler.Policy = this.const_policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
        return objServiceHandler;
    } catch (e) {
        console.error('Exception', this.constructor.name, 'verification_response_handler', e);
    }
};
TataAIGMotor.prototype.status_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'status_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Recon_Reference_Number': null,
        'Data': null,
        'Pg_Status': null,
        'pg_post': null
    };
    try {
        var sleep = require('system-sleep');
        var Error_Msg = 'NO_ERR';
        var objserviceResponse = JSON.parse(objResponseJson['serviceResponse']);
        if (objserviceResponse.length > 0) {
            if (objserviceResponse[0]['txn_status'] === "Success") {
                Error_Msg = "NO_ERR";
            } else {
                Error_Msg = "Error";
            }
        } else {
            Error_Msg = "Error";
        }

        if (Error_Msg === 'NO_ERR') {
            var objResponse = objserviceResponse[0];

            let pg_post = {
                transaction_amount: objResponse['payment_amount'],
                status: "success",
                proposal_no: objResponse['application_number'].toString()
            };
            objServiceHandler['Data'] = objResponse;
            objServiceHandler['Recon_Reference_Number'] = objResponse['application_number'].toString();
            objServiceHandler['Pg_Status'] = "SUCCESS";
            objServiceHandler['pg_post'] = pg_post;
        }


    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };

        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'status_response_handler', objServiceHandler);
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
        var objPremiumService = objResponseJson;
        console.log(objPremiumService);

        var policy = {
            'policy_url': null,
            'policy_number': this.lm_request['policy_number'],
            'pdf_status': null
        };
        if (Error_Msg === 'NO_ERR') {
            if (objPremiumService) {
                var product_name = 'CAR';
                if (this.lm_request['product_id'] === 10) {
                    product_name = 'TW';
                }
                var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.lm_request['policy_number'].replaceAll('/', '') + '.pdf';
                var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                var pdf_web_path_horizon = config.environment.weburl + "/pdf/" + pdf_file_name;
                var pdf_sys_loc_portal = config.pb_config.pdf_system_loc + pdf_file_name;
                var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                var binary = new Buffer(objPremiumService, 'base64');

                var sleep = require('system-sleep');
                sleep(10000);
                fs.writeFileSync(pdf_sys_loc_portal, binary);
                policy.policy_url = pdf_web_path_portal;
                policy.pdf_status = 'SUCCESS';
            } else {
                policy.pdf_status = 'FAIL';
            }
            objServiceHandler.Insurer_Transaction_Identifier = this.lm_request['policy_number'];
        } else {
            policy.transaction_status = 'PAYPASS';
        }
        objServiceHandler.Policy = policy;

        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'pdf_response_handler', objServiceHandler);
        return objServiceHandler;

    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pdf_response_handler', ex);
        return objServiceHandler;
    }
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
        "od_basic": "C1", //when PropCoverDetails_CoverGroups = Own Damage
        "od_elect_access": "C4",
        "od_non_elect_access": "C5",
        "od_cng_lpg": "C7",
        "od_disc_ncb": "C15",
        "od_disc_vol_deduct": "C10",
        "od_disc_anti_theft": "C11",
        "od_disc_aai": "C8",
        "od_loading": "",
        "od_disc": "",
        "od_final_premium": "NETOD"//NetODPremium
    },
    "liability": {
        "tp_basic": "C2", ////when PropCoverDetails_CoverGroups = Basic TP  including TPPD premium
        "tp_cover_owner_driver_pa": "C3", //when PropCoverDetails_CoverGroups = Owner Driver
        "tp_cover_unnamed_passenger_pa": "C17",
        "tp_cover_named_passenger_pa": "",
        "tp_cover_paid_driver_pa": "",
        "tp_cover_paid_driver_ll": "C18", //this is included in tp_basic
        "tp_cover_tppd": "C12",
        "tp_cng_lpg": "C29",
        "tp_final_premium": "NETTP"
    },
    "addon": {
        "addon_zero_dep_cover": "C35",
        "addon_road_assist_cover": "C47", ///when PropCoverDetails_CoverGroups = RoadSide Assist
        "addon_ncb_protection_cover": "C39",
        "addon_engine_protector_cover": "C44",
        "addon_invoice_price_cover": "C38",
        "addon_key_lock_cover": "C43",
        "addon_consumable_cover": "C37",
        "addon_daily_allowance_cover": "C36",
        "addon_windshield_cover": null,
        "addon_passenger_assistance_cover": null,
        "addon_tyre_coverage_cover": "C45",
        "addon_personal_belonging_loss_cover": "C41",
        "addon_inconvenience_allowance_cover": null,
        "addon_medical_expense_cover": "C48",
        "addon_hospital_cash_cover": null,
        "addon_ambulance_charge_cover": null,
        "addon_rodent_bite_cover": null,
        "addon_losstime_protection_cover": null,
        "addon_hydrostatic_lock_cover": null,
        "addon_final_premium": "NETADDON",
        "addon_emergency_transport_hotel": "C42",
        "addon_repair_glass_fiber_plastic": "C40"
    },
    "net_premium": "NETPREM",
    "service_tax": "TAX",
    "final_premium": "TOTALPAYABLE"
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
function jsonToQueryString(json) {
    return  Object.keys(json).map(function (key) {
        return encodeURIComponent(key) + '=' +
                encodeURIComponent(json[key]);
    }).join('&');
}
module.exports = TataAIGMotor;






