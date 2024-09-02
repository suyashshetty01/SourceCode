/*
 * Author : Chirag Modi
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
var parse = require('xml-parser');
var moment = require('moment');

function MagmaHDIMotor() {

}
util.inherits(MagmaHDIMotor, Motor);
MagmaHDIMotor.prototype.lm_request_single = {};
MagmaHDIMotor.prototype.insurer_integration = {};
MagmaHDIMotor.prototype.insurer_addon_list = [];
MagmaHDIMotor.prototype.insurer = {};
MagmaHDIMotor.prototype.insurer_date_format = 'dd/MM/yyyy';
MagmaHDIMotor.prototype.insurer_product_api_pre = function () {
    console.log("Insurer Product FIelds Process Pre Method Called");
};
MagmaHDIMotor.prototype.insurer_product_field_process_pre = function () {
    try {
        var objProduct = this;
//    if (this.lm_request['method_type'] === 'Customer' && this.lm_request['middle_name'] !== '') {
//        this.method_content = this.method_content.replace('___first_name___', this.lm_request['first_name'] + " " + this.lm_request['middle_name']);
//    }
        if (this.lm_request['product_id'] === 1) {
            var tw_data = this.find_text_btw_key(this.method_content.toString(), '<!--TW_DATA_START-->', '<!--TW_DATA_FINISH-->', false);
            this.method_content = this.method_content.replace(tw_data, '');
            this.method_content = this.method_content.replace('<!--TW_DATA_START-->', '');
            this.method_content = this.method_content.replace('<!--TW_DATA_FINISH-->', '');

            var tw_data_2 = this.find_text_btw_key(this.method_content.toString(), '<!--TW_DATA_2_START-->', '<!--TW_DATA_2_FINISH-->', false);
            this.method_content = this.method_content.replace(tw_data_2, '');
            this.method_content = this.method_content.replace('<!--TW_DATA_2_START-->', '');
            this.method_content = this.method_content.replace('<!--TW_DATA_2_FINISH-->', '');

            var tw_data_3 = this.find_text_btw_key(this.method_content.toString(), '<!--TW_DATA_3_START-->', '<!--TW_DATA_3_FINISH-->', false);
            this.method_content = this.method_content.replace(tw_data_3, '');
            this.method_content = this.method_content.replace('<!--TW_DATA_3_START-->', '');
            this.method_content = this.method_content.replace('<!--TW_DATA_3_FINISH-->', '');

        } else {
            this.method_content = this.method_content.replace('<!--TW_DATA_START-->', '');
            this.method_content = this.method_content.replace('<!--TW_DATA_FINISH-->', '');

            this.method_content = this.method_content.replace('<!--TW_DATA_2_START-->', '');
            this.method_content = this.method_content.replace('<!--TW_DATA_2_FINISH-->', '');

            this.method_content = this.method_content.replace('<!--TW_DATA_3_START-->', '');
            this.method_content = this.method_content.replace('<!--TW_DATA_3_FINISH-->', '');

        }
        if (this.lm_request['product_id'] === 10) {
            var car_data = this.find_text_btw_key(this.method_content.toString(), '<!--CAR_DATA_START-->', '<!--CAR_DATA_FINISH-->', false);
            this.method_content = this.method_content.replace(car_data, '');
            this.method_content = this.method_content.replace('<!--CAR_DATA_START-->', '');
            this.method_content = this.method_content.replace('<!--CAR_DATA_FINISH-->', '');

            var car_data_2 = this.find_text_btw_key(this.method_content.toString(), '<!--CAR_DATA_2_START-->', '<!--CAR_DATA_2_FINISH-->', false);
            this.method_content = this.method_content.replace(car_data_2, '');
            this.method_content = this.method_content.replace('<!--CAR_DATA_2_START-->', '');
            this.method_content = this.method_content.replace('<!--CAR_DATA_2_FINISH-->', '');

            var car_data_3 = this.find_text_btw_key(this.method_content.toString(), '<!--CAR_DATA_3_START-->', '<!--CAR_DATA_3_FINISH-->', false);
            this.method_content = this.method_content.replace(car_data_3, '');
            this.method_content = this.method_content.replace('<!--CAR_DATA_3_START-->', '');
            this.method_content = this.method_content.replace('<!--CAR_DATA_3_FINISH-->', '');

        } else {
            this.method_content = this.method_content.replace('<!--CAR_DATA_START-->', '');
            this.method_content = this.method_content.replace('<!--CAR_DATA_FINISH-->', '');

            this.method_content = this.method_content.replace('<!--CAR_DATA_2_START-->', '');
            this.method_content = this.method_content.replace('<!--CAR_DATA_2_FINISH-->', '');

            this.method_content = this.method_content.replace('<!--CAR_DATA_3_START-->', '');
            this.method_content = this.method_content.replace('<!--CAR_DATA_3_FINISH-->', '');
        }

        if (this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === 'LPG/CNG' || this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === 'LPG' || this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === 'CNG') {
            if (this.prepared_request['dbmaster_pb_fuel_name'] === 'CNG') {
                this.prepared_request['is_internal_bifuel_2'] = "True";
                this.processed_request['___is_internal_bifuel_2___'] = this.prepared_request['is_internal_bifuel_2'];
            } else {
                this.prepared_request['is_internal_bifuel_2'] = "False";
                this.processed_request['___is_internal_bifuel_2___'] = this.prepared_request['is_internal_bifuel_2'];
            }
            if (this.prepared_request['dbmaster_pb_fuel_name'] === 'LPG') {
                this.prepared_request['is_internal_bifuel_3'] = "True";
                this.processed_request['___is_internal_bifuel_3___'] = this.prepared_request['is_internal_bifuel_3'];
            } else {
                this.prepared_request['is_internal_bifuel_3'] = "False";
                this.processed_request['___is_internal_bifuel_3___'] = this.prepared_request['is_internal_bifuel_3'];
            }
        } else {
            this.prepared_request['is_internal_bifuel_2'] = "False";
            this.processed_request['___is_internal_bifuel_2___'] = this.prepared_request['is_internal_bifuel_2'];
            this.prepared_request['is_internal_bifuel_3'] = "False";
            this.processed_request['___is_internal_bifuel_3___'] = this.prepared_request['is_internal_bifuel_3'];
        }
        if (this.lm_request['is_external_bifuel'] === 'yes') {
            this.prepared_request['dbmaster_insurer_vehicle_fueltype'] = 'LPG/CNG';
            this.processed_request['___dbmaster_insurer_vehicle_fueltype___'] = this.prepared_request['dbmaster_insurer_vehicle_fueltype'];
            if (this.lm_request['external_bifuel_type'] === 'cng') {
                var external_lpg_data = this.find_text_btw_key(this.method_content.toString(), '<!--External_LPG_Start-->', '<!--External_LPG_Finish-->', false);
                this.method_content = this.method_content.replace(external_lpg_data, '');
                this.method_content = this.method_content.replace('<!--External_LPG_Start-->', '');
                this.method_content = this.method_content.replace('<!--External_LPG_Finish-->', '');
            } else {
                this.method_content = this.method_content.replace('<!--External_LPG_Start-->', '');
                this.method_content = this.method_content.replace('<!--External_LPG_Finish-->', '');
            }
            if (this.lm_request['external_bifuel_type'] === 'lpg') {
                var external_cng_data = this.find_text_btw_key(this.method_content.toString(), '<!--External_CNG_Start-->', '<!--External_CNG_Finish-->', false);
                this.method_content = this.method_content.replace(external_cng_data, '');
                this.method_content = this.method_content.replace('<!--External_CNG_Start-->', '');
                this.method_content = this.method_content.replace('<!--External_CNG_Finish-->', '');
            } else {
                this.method_content = this.method_content.replace('<!--External_CNG_Start-->', '');
                this.method_content = this.method_content.replace('<!--External_CNG_Finish-->', '');
            }
        } else {
            var external_cng_data = this.find_text_btw_key(this.method_content.toString(), '<!--External_CNG_Start-->', '<!--External_CNG_Finish-->', false);
            this.method_content = this.method_content.replace(external_cng_data, '');
            var external_lpg_data = this.find_text_btw_key(this.method_content.toString(), '<!--External_LPG_Start-->', '<!--External_LPG_Finish-->', false);
            this.method_content = this.method_content.replace(external_lpg_data, '');
            this.method_content = this.method_content.replace('<!--External_CNG_Start-->', '');
            this.method_content = this.method_content.replace('<!--External_CNG_Finish-->', '');
            this.method_content = this.method_content.replace('<!--External_LPG_Start-->', '');
            this.method_content = this.method_content.replace('<!--External_LPG_Finish-->', '');
            this.prepared_request['external_bifuel_value'] = "";
            this.processed_request['___external_bifuel_value___'] = this.prepared_request['external_bifuel_value'];
        }

        this.prepared_request['dbmaster_insurer_vehicle_carryingcapacity'] = parseInt(this.prepared_request['dbmaster_insurer_vehicle_seatingcapacity']) - 1;
        this.processed_request['___dbmaster_insurer_vehicle_carryingcapacity___'] = this.prepared_request['dbmaster_insurer_vehicle_carryingcapacity'];

        if (this.lm_request['product_id'] === 1) {
            this.prepared_request['product_pckg_name'] = "PvtCarPackage";
            this.processed_request['___product_pckg_name___'] = this.prepared_request['product_pckg_name'];
            this.prepared_request['isvehicle'] = "NEW";
            this.processed_request['___isvehicle___'] = this.prepared_request['isvehicle'];
            this.prepared_request['isuicemployee'] = "F";
            this.processed_request['___isuicemployee___'] = this.prepared_request['isuicemployee'];
            this.prepared_request['annualincome'] = "3";
            this.processed_request['___annualincome___'] = this.prepared_request['annualincome'];
            this.prepared_request['maidenname'] = "ss";
            this.processed_request['___maidenname___'] = this.prepared_request['maidenname'];
            this.prepared_request['cstmerinitals'] = "ws";
            this.processed_request['___cstmerinitals___'] = this.prepared_request['cstmerinitals'];
        }
        if (this.lm_request['product_id'] === 10) {
            this.prepared_request['product_pckg_name'] = "TwoWheelerPackage";
            this.processed_request['___product_pckg_name___'] = this.prepared_request['product_pckg_name'];
            this.prepared_request['isvehicle'] = "New";
            this.processed_request['___isvehicle___'] = this.prepared_request['isvehicle'];
            this.prepared_request['isuicemployee'] = "NA";
            this.processed_request['___isuicemployee___'] = this.prepared_request['isuicemployee'];
            this.prepared_request['annualincome'] = "0";
            this.processed_request['___annualincome___'] = this.prepared_request['annualincome'];
            this.prepared_request['maidenname'] = "NA";
            this.processed_request['___maidenname___'] = this.prepared_request['maidenname'];
            this.prepared_request['cstmerinitals'] = "NA";
            this.processed_request['___cstmerinitals___'] = this.prepared_request['cstmerinitals'];
        }

        if ((this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'idv') && this.lm_request['vehicle_insurance_type'] === "renew") {
            this.prepared_request['registration_no_3'] = "FG";
            this.processed_request['___registration_no_3___'] = this.prepared_request['registration_no_3'];
            this.prepared_request['registration_no_4'] = "9898";
            this.processed_request['___registration_no_4___'] = this.prepared_request['registration_no_4'];
        }
        if (this.lm_request.hasOwnProperty('is_tppd')) {
            if (this.lm_request['is_tppd'] === 'yes') {
                this.prepared_request['is_tppd'] = "6000";
                this.processed_request['___is_tppd___'] = this.prepared_request['is_tppd'];
            } else {
                this.prepared_request['is_tppd'] = "";
                this.processed_request['___is_tppd___'] = this.prepared_request['is_tppd'];
            }
        } else {
            this.prepared_request['is_tppd'] = "";
            this.processed_request['___is_tppd___'] = this.prepared_request['is_tppd'];
        }
        if (this.lm_request['method_type'] === 'Customer' && this.lm_request['is_reg_addr_comm_addr_same'] === 'yes') {
            this.prepared_request['is_reg_addr_comm_addr_same'] = "True";
            this.processed_request['___is_reg_addr_comm_addr_same___'] = this.prepared_request['is_reg_addr_comm_addr_same'];
        } else {
            this.prepared_request['is_reg_addr_comm_addr_same'] = "False";
            this.processed_request['___is_reg_addr_comm_addr_same___'] = this.prepared_request['is_reg_addr_comm_addr_same'];
        }

        var vehicle_manf_month = (this.prepared_request['vehicle_manf_date']).split("-");
        this.prepared_request['vehicle_manf_month'] = vehicle_manf_month[1];
        this.processed_request['___vehicle_manf_month___'] = this.prepared_request['vehicle_manf_month'];

        if (this.lm_request['vehicle_insurance_type'] === 'new') {
            var prev_policy_data = this.find_text_btw_key(this.method_content.toString(), '<!--Prev_policy_Start-->', '<!--Prev_policy_Finish-->', false);
            this.method_content = this.method_content.replace(prev_policy_data, '');
            this.method_content = this.method_content.replace('<!--Prev_policy_Start-->', '');
            this.method_content = this.method_content.replace('<!--Prev_policy_Finish-->', '');
        } else {
            this.method_content = this.method_content.replace('<!--Prev_policy_Start-->', '');
            this.method_content = this.method_content.replace('<!--Prev_policy_Finish-->', '');
        }

        if (this.lm_request['method_type'] === 'Customer' && this.prepared_request['is_financed'] === "no") {
            var finance_data = this.find_text_btw_key(this.method_content.toString(), '<!--finance_Start-->', '<!--finance_Finish-->', false);
            this.method_content = this.method_content.replace(finance_data, '');
            this.method_content = this.method_content.replace('<!--finance_Start-->', '');
            this.method_content = this.method_content.replace('<!--finance_Finish-->', '');
        } else {
            this.method_content = this.method_content.replace('<!--finance_Start-->', '');
            this.method_content = this.method_content.replace('<!--finance_Finish-->', '');
        }

        if (this.lm_request['method_type'] === 'Pdf') {
            var ProposalNo = this.prepared_request['dbmaster_insurer_transaction_identifier'];
            this.prepared_request['Proposal_No'] = ProposalNo;
            this.processed_request['___Proposal_No___'] = this.prepared_request['Proposal_No'];
        }
        if (this.lm_request['method_type'] === 'Proposal') {
            var returnUrl = this.const_payment.pg_ack_url;
            this.prepared_request['return_url'] = returnUrl;
            this.processed_request['___return_url___'] = this.prepared_request['return_url'];
        }

        if (this.lm_request['vehicle_insurance_type'] === "renew") {
            var pre_policy_start = (this.prepared_request['pre_policy_start_date']);
            var d = new Date(pre_policy_start);
            var date2 = ("0" + (d.getDate())).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear();
            var policy_expiry_date_2 = (this.prepared_request['policy_expiry_date']);
            var d2 = new Date(policy_expiry_date_2);
            var date3 = ("0" + (d2.getDate())).slice(-2) + "/" + ("0" + (d2.getMonth() + 1)).slice(-2) + "/" + d2.getFullYear();

            this.prepared_request['pre_policy_start_date_2'] = date2;
            this.processed_request['___pre_policy_start_date_2___'] = this.prepared_request['pre_policy_start_date_2'];
            this.prepared_request['pre_policy_expiry_date_2'] = date3;
            this.processed_request['___pre_policy_expiry_date_2___'] = this.prepared_request['pre_policy_expiry_date_2'];
            this.prepared_request['noprevInsurnceflag'] = "True";
            this.processed_request['___noprevInsurnceflag___'] = this.prepared_request['noprevInsurnceflag'];

        } else {
            this.prepared_request['registration_no_1'] = "NEW";
            this.processed_request['___registration_no_1___'] = this.prepared_request['registration_no_1'];
            this.prepared_request['registration_no_2'] = "";
            this.processed_request['___registration_no_2___'] = this.prepared_request['registration_no_2'];
            this.prepared_request['registration_no_3'] = "";
            this.processed_request['___registration_no_3___'] = this.prepared_request['registration_no_3'];
            this.prepared_request['registration_no_4'] = "";
            this.processed_request['___registration_no_4___'] = this.prepared_request['registration_no_4'];
            this.prepared_request['noprevInsurnceflag'] = "False";
            this.processed_request['___noprevInsurnceflag___'] = this.prepared_request['noprevInsurnceflag'];
        }

        var Plan_Name = '';
        if (this.lm_request['method_type'] === 'Customer') {
            Plan_Name = this.processed_request['___dbmaster_plan_name___'];
            this.prepared_request['pincodelocity'] = this.insurer_lm_request['communication_locality_code_text'];
            this.processed_request['___pincodelocity___'] = this.prepared_request['pincodelocity'];
        }
        if (this.lm_request['method_type'] === 'Idv' || this.lm_request['method_type'] === 'Premium') {
            Plan_Name = this.prepared_request['Plan_Name'];
        }
        if (this.lm_request['method_type'] === 'Idv' || Plan_Name === "Basic") {
            this.processed_request['___dbmaster_plan_name___'] = "";
            //this.processed_request['___Plan_Name___'] = this.prepared_request['Plan_Name'];
            this.prepared_request['gold_1'] = "False";
            this.processed_request['___gold_1___'] = this.prepared_request['gold_1'];
            this.prepared_request['silver_1'] = "False";
            this.processed_request['___silver_1___'] = this.prepared_request['silver_1'];
            this.prepared_request['basicplus_1'] = "False";
            this.processed_request['___basicplus_1___'] = this.prepared_request['basicplus_1'];
        }
        if (this.lm_request['method_type'] === 'Premium' && Plan_Name === undefined && this.lm_request['product_id'] === 10) {
            this.processed_request['___dbmaster_plan_name___'] = "";
        }

        if (Plan_Name === "BasicPlus") {
            this.processed_request['___dbmaster_plan_name___'] = "BasicPlus";
            this.prepared_request['basicplus_1'] = "True";
            this.processed_request['___basicplus_1___'] = this.prepared_request['basicplus_1'];
        }

        if (Plan_Name === "Gold") {
            //this.prepared_request['Plan_Name'] = "Gold";
            //this.processed_request['___Plan_Name___'] = this.prepared_request['Plan_Name'];
            this.processed_request['___dbmaster_plan_name___'] = Plan_Name;
            this.prepared_request['gold_1'] = "True";
            this.processed_request['___gold_1___'] = this.prepared_request['gold_1'];
            this.prepared_request['silver_1'] = "False";
            this.processed_request['___silver_1___'] = this.prepared_request['silver_1'];
        }

        if (Plan_Name === "Silver") {
            //this.prepared_request['Plan_Name'] = "Silver";
            //this.processed_request['___Plan_Name___'] = this.prepared_request['Plan_Name'];
            this.processed_request['___dbmaster_plan_name___'] = Plan_Name;
            this.prepared_request['silver_1'] = "True";
            this.processed_request['___silver_1___'] = this.prepared_request['silver_1'];
            this.prepared_request['gold_1'] = "False";
            this.processed_request['___gold_1___'] = this.prepared_request['gold_1'];
        }

        if (this.lm_request['is_antitheft_fit'] === "yes") {
            this.prepared_request['is_antitheft_fit_2'] = "True";
            this.processed_request['___is_antitheft_fit_2___'] = this.prepared_request['is_antitheft_fit_2'];
        } else {
            this.prepared_request['is_antitheft_fit_2'] = "False";
            this.processed_request['___is_antitheft_fit_2___'] = this.prepared_request['is_antitheft_fit_2'];
        }
        if (this.lm_request['voluntary_deductible'] === "" || this.lm_request['voluntary_deductible'] === null && this.lm_request['voluntary_deductible'] === "undefined") {
            this.prepared_request['voluntary_deductible'] = "0";
            this.processed_request['___voluntary_deductible___'] = this.prepared_request['voluntary_deductible'];
        }
        this.prepared_request['is_aai_member_2'] = "";
        this.processed_request['___is_aai_member_2___'] = this.prepared_request['is_aai_member_2'];
        this.prepared_request['is_aai_member_3'] = "False";
        this.processed_request['___is_aai_member_3___'] = this.prepared_request['is_aai_member_3'];

        if (this.lm_request['pa_unnamed_passenger_si'] === "" || this.lm_request['pa_unnamed_passenger_si'] === null && this.lm_request['pa_unnamed_passenger_si'] === "undefined") {
            this.prepared_request['pa_unnamed_passenger_si'] = "0";
            this.processed_request['___pa_unnamed_passenger_si___'] = this.prepared_request['pa_unnamed_passenger_si'];
        }
        if (this.lm_request['is_llpd'] === "yes") {
            this.prepared_request['is_llpd_2'] = "1";
            this.processed_request['___is_llpd_2___'] = this.prepared_request['is_llpd_2'];
        } else {
            this.prepared_request['is_llpd_2'] = "0";
            this.processed_request['___is_llpd_2___'] = this.prepared_request['is_llpd_2'];
        }
        if (this.lm_request['pa_paid_driver_si'] > 0) {
            this.prepared_request['pa_paid_driver_si_2'] = "1";
            this.processed_request['___pa_paid_driver_si_2___'] = this.prepared_request['pa_paid_driver_si_2'];
        } else {
            this.prepared_request['pa_paid_driver_si_2'] = "0";
            this.processed_request['___pa_paid_driver_si_2___'] = this.prepared_request['pa_paid_driver_si_2'];
        }
        if (this.lm_request['is_pa_od'] === "yes") {
            this.prepared_request['is_pa_od_2'] = "";
            this.processed_request['___is_pa_od_2___'] = this.prepared_request['is_pa_od_2'];
            this.prepared_request['is_pa_od_tw_2'] = "True";
            this.processed_request['___is_pa_od_tw_2___'] = this.prepared_request['is_pa_od_tw_2'];
            this.prepared_request['is_pa_od_3'] = "True";
            this.processed_request['___is_pa_od_3___'] = this.prepared_request['is_pa_od_3'];
            this.prepared_request['is_pa_od_4'] = "False";
            this.processed_request['___is_pa_od_4___'] = this.prepared_request['is_pa_od_4'];
        } else {
            this.prepared_request['is_pa_od_2'] = "False";
            this.processed_request['___is_pa_od_2___'] = this.prepared_request['is_pa_od_2'];
            this.prepared_request['is_pa_od_tw_2'] = "False";
            this.processed_request['___is_pa_od_tw_2___'] = this.prepared_request['is_pa_od_tw_2'];
            this.prepared_request['is_pa_od_3'] = "False";
            this.processed_request['___is_pa_od_3___'] = this.prepared_request['is_pa_od_3'];
            this.prepared_request['is_pa_od_4'] = "True";
            this.processed_request['___is_pa_od_4___'] = this.prepared_request['is_pa_od_4'];
        }

        if (this.lm_request['is_claim_exists'] === "no") {
            this.prepared_request['is_claim_exists_2'] = "True";
            this.processed_request['___is_claim_exists_2___'] = this.prepared_request['is_claim_exists_2'];
            this.prepared_request['is_claim_exists_3'] = "0";
            this.processed_request['___is_claim_exists_3___'] = this.prepared_request['is_claim_exists_3'];
            this.prepared_request['isncbapplcble'] = "True";
            this.processed_request['___isncbapplcble___'] = this.prepared_request['isncbapplcble'];
            this.prepared_request['Prev_claimno'] = "";
            this.processed_request['___Prev_claimno___'] = this.prepared_request['Prev_claimno'];
        } else {
            this.prepared_request['is_claim_exists_2'] = "False";
            this.processed_request['___is_claim_exists_2___'] = this.prepared_request['is_claim_exists_2'];
            this.prepared_request['is_claim_exists_3'] = "0";
            this.processed_request['___is_claim_exists_3___'] = this.prepared_request['is_claim_exists_3'];
            this.prepared_request['isncbapplcble'] = "False";
            this.processed_request['___isncbapplcble___'] = this.prepared_request['isncbapplcble'];
            this.prepared_request['Prev_claimno'] = "1";
            this.processed_request['___Prev_claimno___'] = this.prepared_request['Prev_claimno'];
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_product_field_process_pre', ex);
    }
};
MagmaHDIMotor.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {
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
    if (specific_insurer_object.method.Method_Type === 'Customer') {
        obj_response_handler = this.customer_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Idv') {
        obj_response_handler = this.idv_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Verification') {
        obj_response_handler = this.verification_response_handler(objResponseJson);
    }
    return obj_response_handler;

};
MagmaHDIMotor.prototype.insurer_product_field_process_post = function () {

};
MagmaHDIMotor.prototype.insurer_product_api_post = function () {

};
MagmaHDIMotor.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    try {
        var objInsurerProduct = this;
        var product_id = objProduct.db_specific_product.Product_Id;
        var insurer_id = Insurer_Object.Insurer_ID;
        var soap = require('soap');
        var xml2js = require('xml2js');
        var http = require('http');
        var https = require('https');
        var body = docLog.Insurer_Request;
        var Client = require('node-rest-client').Client;
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
        var client = new Client();

        var XML_file_name = 'MagmaHDI_Car_Authentication.json';
        var xml_mhauth_data = fs.readFileSync(appRoot + '/resource/request_file/' + XML_file_name).toString();
        xml_mhauth_data = xml_mhauth_data.replace('___insurer_integration_service_user___', objInsurerProduct.prepared_request['insurer_integration_service_user']);
        xml_mhauth_data = xml_mhauth_data.replace('___insurer_integration_service_password___', objInsurerProduct.prepared_request['insurer_integration_service_password']);
        var args = {
            data: xml_mhauth_data,
            headers: {"Content-Type": "application/json;charset=UTF-8"},
            "rejectUnauthorized": false
        };
        var auth_service_url = "https://webportal.magma-hdi.co.in:444/GCCustomerPortalServiceRest/GCCustomerPortalServiceRest.svc/GetAuthenticationKey";
        client.post(auth_service_url, args, function (data, response) {
            console.log(docLog.Insurer_Request);

            var AuthKey = data.GetAuthenticationKeyResult.AuthKey;
            if (AuthKey !== null || AuthKey !== "") {
                docLog.Insurer_Request = docLog.Insurer_Request.replace('___Authenticate_Key___', AuthKey);
                if (product_id === 10 && (specific_insurer_object.method.Method_Type === 'Premium' || specific_insurer_object.method.Method_Type === 'Idv' || specific_insurer_object.method.Method_Type === 'Customer')) {
                    docLog.Insurer_Request = docLog.Insurer_Request.replace('proposalInput": {', '"proposalInput": {');
                }
                if (product_id === 1 && specific_insurer_object.method.Method_Type === 'Proposal') {
                    docLog.Insurer_Request = docLog.Insurer_Request.replace('transactioniutut" {', '"transactioniutput": {');
                }
                if (product_id === 10 && specific_insurer_object.method.Method_Type === 'Proposal') {
                    docLog.Insurer_Request = docLog.Insurer_Request.replace('"transactionitput"{', '"transactioniutput": {');
                }
                if (product_id === 1 && specific_insurer_object.method.Method_Type === 'Pdf') {
                    docLog.Insurer_Request = docLog.Insurer_Request.replace('olicyPDFInput" {', '"policyPDFInput" :{');
                } else if (product_id === 10 && specific_insurer_object.method.Method_Type === 'Pdf') {
                    docLog.Insurer_Request = docLog.Insurer_Request.replace('"policyPDFInpt" {', '"policyPDFInput" :{');
                } else {
                    docLog.Insurer_Request = docLog.Insurer_Request.replace('"policyPDFInput": {', '"policyPDFInput" :{');
                }
                //console.log("***************" + docLog.Insurer_Request.proposalInput.InputXML)
                console.error(docLog.Insurer_Request);
                var args = {
                    data: docLog.Insurer_Request,
                    headers: {"Content-Type": "application/json;charset=UTF-8"},
                    "rejectUnauthorized": false
                };
                client.post(specific_insurer_object.method.Service_URL, args, function (data, response) {
                    console.log(specific_insurer_object.method.Service_URL);
                    console.log('Magma service_call response :: ', data.toString());
                    if (specific_insurer_object.method.Method_Type === 'Premium' || specific_insurer_object.method.Method_Type === 'Customer' || specific_insurer_object.method.Method_Type === 'Idv') {
                        console.log(data.SaveProposalResult.ErrorText);
                        console.log(data.SaveProposalResult.OutputXML);
                    } else if (specific_insurer_object.method.Method_Type === 'Pdf') {
                        console.log(data.GeneratePolicyDocumentResult.ErrorText);
                        console.log(data.GeneratePolicyDocumentResult.PolicyDocument);
                    } else {
                        console.log(data.GenerateTransactionIDResult.ErrorText);
                        console.log(data.GenerateTransactionIDResult.TransactionID);
                    }

                    if (specific_insurer_object.method.Method_Type !== 'Proposal' && specific_insurer_object.method.Method_Type !== 'Pdf') {
                        xml2js.parseString(data.SaveProposalResult.OutputXML, function (err2, objXml2Json) {
                            console.log('Magma service_call response objXml2Json :: ', objXml2Json);
                            if (err2) {
                                var objResponseFull = {
                                    'err': err2,
                                    'result': objXml2Json,
                                    'raw': objXml2Json,
                                    'soapHeader': objXml2Json,
                                    'objResponseJson': null
                                };
                                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                            } else {
                                var objResponseFull = {
                                    'err': null,
                                    'result': null,
                                    'raw': JSON.stringify(objXml2Json),
                                    'soapHeader': null,
                                    'objResponseJson': objXml2Json
                                };
                                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                                if (specific_insurer_object.method.Method_Type === 'Idv') {
                                    objInsurerProduct.insurer_vehicle_idv_handler(serviceBreakup, objProduct, Insurer_Object, specific_insurer_object);
                                }
                            }
                        });
                    } else {
                        var objResponseFull = {
                            'err': null,
                            'result': null,
                            'raw': JSON.stringify(data),
                            'soapHeader': null,
                            'objResponseJson': data
                        };
                        var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                    }
                });
            } else {
                var objResponseFull = {
                    'err': null,
                    'result': null,
                    'raw': JSON.stringify(data),
                    'soapHeader': null,
                    'objResponseJson': data
                };
                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
            }
        });
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};
MagmaHDIMotor.prototype.customer_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'customer_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';

    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment,
        'Customer': null
    };

    try {
        if (objResponseJson.hasOwnProperty('ServiceResult')) {
            if (objResponseJson['ServiceResult']['ErrorText'][0] === '') {
            } else {
                Error_Msg = objResponseJson['ServiceResult']['ErrorText'][0];
            }
        } else {
            Error_Msg = 'LM Empty Response';
        }

        var encryptedProposalNo = '';
        var customerId = '';
        var Proposal_No = '';
        if (Error_Msg === 'NO_ERR') {
            customerId = objResponseJson['ServiceResult']['GetUserData'][0]['PropCustomerDtls_CustomerID_Mandatary'][0];
            Proposal_No = objResponseJson['ServiceResult']['ProposalNo'][0];
            var data = {"encryptionInput": {"InputData": Proposal_No}};
            data.encryptionInput.InputData = Proposal_No;
            var args = {
                data: data,
                headers: {"Content-Type": "application/json;charset=UTF-8"},
                "rejectUnauthorized": false
            };
            var Client = require('node-rest-client').Client;
            var client = new Client();
            var encryptedData = '';
            var temp = false;
            client.post("https://webportal.magma-hdi.co.in:444/GCCustomerPortalServiceRest/GCCustomerPortalServiceRest.svc/EncryptText", args, function (data, response) {
                temp = true;
                encryptedData = data['EncryptTextResult']['OutputData'];
            });
        }
        for (var i = 0; i < 10; i++) {
            if (!temp) {
                var sleep = require('system-sleep');
                sleep(7000);
            } else {
                encryptedProposalNo = encryptedData;
                break;
            }
        }
        var Customer = {
            'insurer_customer_identifier': Proposal_No,
            'insurer_customer_identifier_2': customerId,
            'insurer_customer_identifier_3': encryptedProposalNo,
            'final_premium_verified': objResponseJson['ServiceResult']['TotalPremium'][0]
        };
        objServiceHandler.Customer = Customer;
        objServiceHandler.Insurer_Transaction_Identifier = Proposal_No;
        objServiceHandler.Error_Msg = Error_Msg;
        return objServiceHandler;
        console.log('Finish', this.constructor.name, 'customer_response_handler', objServiceHandler);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'customer_response_handler', ex);
        return objServiceHandler;
    }
};
MagmaHDIMotor.prototype.idv_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'idv_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';

    try {
        objError = objResponseJson['ServiceResult']['ErrorText'];
        //check error start
        // var responseXml = objResponseJson[0]['GenerateProposalAndQuotationResult'][0]["a:ResponseXML"]
        //check error stop
        if (objError[0] === '') {
            var Idv_Breakup = this.get_const_idv_breakup();
            Idv_Breakup["Idv_Normal"] = Math.round(objResponseJson['ServiceResult']['GetUserData'][0]['PropRisks_IDVofthevehicle'][0]);
            Idv_Breakup["Idv_Min"] = Math.round(objResponseJson['ServiceResult']['GetUserData'][0]['PropRisks_LowerIDV'][0]);
            Idv_Breakup["Idv_Max"] = Math.round(objResponseJson['ServiceResult']['GetUserData'][0]['PropRisks_HigherIDV'][0]);
            Idv_Breakup["Exshowroom"] = Math.round(objResponseJson['ServiceResult']['GetUserData'][0]['PropRisks_Exshowroomprice_Mandatary'][0]);
            //Idv_Breakup["Exshowroom"] = 0;
            objServiceHandler.Premium_Breakup = Idv_Breakup;
            objServiceHandler.Insurer_Transaction_Identifier = '';
        } else {
            Error_Msg = objError.toString();
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'idv_response_handler', objServiceHandler);
        return objServiceHandler;
    } catch (e) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(e)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'idv_response_handler', e);
        return objServiceHandler;
    }
};
MagmaHDIMotor.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson.hasOwnProperty('ServiceResult')) {
            if (objResponseJson['ServiceResult']['ErrorText'][0] === '') {
            } else {
                Error_Msg = objResponseJson['ServiceResult']['ErrorText'][0];
            }
        } else {
            Error_Msg = 'LM Empty Response';
        }

        if (Error_Msg === 'NO_ERR') {
            var objInsurerPremium = {};
            var objInsurerAddon = {};
            var premium_breakup = this.get_const_premium_breakup();
            //var GeneralProposalAndQuatation = objResponseJson[0]['ServiceResult'][0];
            //var ResponseXML = objResponseJson[0]['GenerateProposalAndQuotationResult'][0]['a:ResponseXML'][0]['ServiceResult'][0]
            var GetUserData = objResponseJson['ServiceResult']['GetUserData'][0];

            var RiskCoverDetails = objResponseJson['ServiceResult']['GetUserData'][0]['PropRisks_Col'][0]['Risks'][0]['PropRisks_CoverDetails_Col'][0]['Risks_CoverDetails'];
            var Risk = objResponseJson['ServiceResult']['GetUserData'][0]['PropRisks_Col'][0]['Risks'][0]['PropRisks_CoverDetails_Col'];

            for (var i in Risk[0].Risks_CoverDetails) {
                if (Risk[0].Risks_CoverDetails[i].hasOwnProperty('PropCoverDetails_CoverGroups')) {
                    var PropLoadingDiscount_Col = Risk[0].Risks_CoverDetails[i].PropCoverDetails_CoverGroups[0];
                    if (PropLoadingDiscount_Col !== '') {
                        var cover_name = PropLoadingDiscount_Col;
                        cover_name = cover_name.toString().toLowerCase().replace(/ - /g, '_').replace(/-/g, '_').replace(/ /g, '_');
                        Object.assign(objInsurerPremium, JSON.parse('{"' + cover_name + '":""}'));
                        objInsurerPremium[cover_name] = Risk[0].Risks_CoverDetails[i]['PropCoverDetails_EndorsementAmount'][0] - 0;
                    }
                }
            }

            for (var k in GetUserData.PropRisks_Col[0].Risks) {
                console.log(GetUserData.PropRisks_Col[0].Risks[k].PropRisks_CoverDetails_Col);
                for (var l in GetUserData.PropRisks_Col[0].Risks[k].PropRisks_CoverDetails_Col) {
                    console.log(GetUserData.PropRisks_Col[0].Risks[k].PropRisks_CoverDetails_Col[l].Risks_CoverDetails);
                    var Deatils = GetUserData.PropRisks_Col[0].Risks[k].PropRisks_CoverDetails_Col[l].Risks_CoverDetails;
                    for (var m in Deatils) {
                        var cover_name = Deatils[m].PropCoverDetails_CoverGroups;
                        cover_name = cover_name.toString().toLowerCase().replace(/ - /g, '_').replace(/-/g, '_').replace(/ /g, '_');
                        Object.assign(objInsurerPremium, JSON.parse('{"' + cover_name + '":""}'));
                        objInsurerPremium[cover_name] = Deatils[m].PropCoverDetails_EndorsementAmount - 0;
                        console.log(Deatils[m].PropCoverDetails_EndorsementAmount);
                    }
                }
            }
            var k = 0;
            for (k in GetUserData.PropLoadingDiscount_Col) {
                for (l in GetUserData.PropLoadingDiscount_Col[k]) {
                    console.log(GetUserData.PropLoadingDiscount_Col[k].LoadingDiscount);
                    var Deatils = GetUserData.PropLoadingDiscount_Col[k].LoadingDiscount;
                    for (var m in Deatils) {
                        console.log(Deatils[m].PropLoadingDiscount_Description);
                        var cover_name = Deatils[m].PropLoadingDiscount_Description;
                        cover_name = cover_name.toString().toLowerCase().replace(/ - /g, '_').replace(/-/g, '_').replace(/ /g, '_');
                        Object.assign(objInsurerPremium, JSON.parse('{"' + cover_name + '":""}'));
                        objInsurerPremium[cover_name] = Deatils[m].PropLoadingDiscount_EndorsementAmount - 0;
                        console.log(Deatils[m].PropLoadingDiscount_EndorsementAmount);
                    }
                }
            }

            premium_breakup['own_damage']['od_basic'] = (objInsurerPremium.hasOwnProperty('basic_od')) ? objInsurerPremium['basic_od'] - 0 : 0;
            premium_breakup['own_damage']['od_elect_access'] = (objInsurerPremium.hasOwnProperty('electrical_or_electronic_accessories')) ? objInsurerPremium['electrical_or_electronic_accessories'] - 0 : 0;
            premium_breakup['own_damage']['od_non_elect_access'] = (objInsurerPremium.hasOwnProperty('non_electrical_accessories')) ? objInsurerPremium['non_electrical_accessories'] - 0 : 0;

            if (this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === 'LPG/CNG' || this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === 'LPG' || this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === 'CNG') {
                if (this.lm_request['is_external_bifuel'] === 'yes') {
                    if (this.lm_request['external_bifuel_type'] === 'cng') {
                        premium_breakup['own_damage']['od_cng_lpg'] = (objInsurerPremium.hasOwnProperty('cng_kit_od')) ? objInsurerPremium['cng_kit_od'] - 0 : 0;
                    }
                    if (this.lm_request['external_bifuel_type'] === 'lpg') {
                        premium_breakup['own_damage']['od_cng_lpg'] = (objInsurerPremium.hasOwnProperty('lpg_kit_od')) ? objInsurerPremium['lpg_kit_od'] - 0 : 0;
                    }
                } else {
                    if (this.prepared_request['dbmaster_pb_fuel_name'] === 'CNG') {
                        premium_breakup['own_damage']['od_cng_lpg'] = (objInsurerPremium.hasOwnProperty('built_in_cng_od_loading_od')) ? objInsurerPremium['built_in_cng_od_loading_od'] - 0 : 0;
                    } else if (this.prepared_request['dbmaster_pb_fuel_name'] === 'LPG') {
                        premium_breakup['own_damage']['od_cng_lpg'] = (objInsurerPremium.hasOwnProperty('built_in_lpg_od_loading_od')) ? objInsurerPremium['built_in_lpg_od_loading_od'] - 0 : 0;
                    } else {
                        premium_breakup['own_damage']['od_cng_lpg'] = (objInsurerPremium.hasOwnProperty('od_cng_lpg')) ? objInsurerPremium['od_cng_lpg'] - 0 : 0;
                    }
                }
            } else {
                premium_breakup['own_damage']['od_cng_lpg'] = (objInsurerPremium.hasOwnProperty('od_cng_lpg')) ? objInsurerPremium['od_cng_lpg'] - 0 : 0;
            }

            premium_breakup['own_damage']['od_disc_anti_theft'] = (objInsurerPremium.hasOwnProperty('anti_theft_device_od')) ? objInsurerPremium['anti_theft_device_od'] - 0 : 0;
            premium_breakup['own_damage']['od_disc_aai'] = (objInsurerPremium.hasOwnProperty('automobile_association_discount')) ? objInsurerPremium['automobile_association_discount'] - 0 : 0;
            premium_breakup['own_damage']['od_loading'] = (objInsurerPremium.hasOwnProperty('od_loading')) ? objInsurerPremium['od_loading'] - 0 : 0;
            premium_breakup['own_damage']['od_disc'] = (objInsurerPremium.hasOwnProperty('od_disc')) ? objInsurerPremium['od_disc'] - 0 : 0;

            if (this.lm_request['vehicle_insurance_type'] === "renew" && this.lm_request['product_id'] === 1) {
                if (this.lm_request['is_claim_exists'] === "no") {
                    premium_breakup['own_damage']['od_disc_vol_deduct'] = (objInsurerPremium.hasOwnProperty('voluntary_excess_discount')) ? objInsurerPremium['voluntary_excess_discount'] - 0 : 0;
                    premium_breakup['own_damage']['od_disc_ncb'] = (objInsurerPremium.hasOwnProperty('bonus_discount')) ? objInsurerPremium['bonus_discount'] - 0 : 0;
                    premium_breakup['own_damage']['od_final_premium'] = objResponseJson['ServiceResult']['GetUserData'][0]['PropPremiumCalculation_CustomCoverLDPremium'][0] - objInsurerPremium['bonus_discount'];
                } else {
                    premium_breakup['own_damage']['od_disc_vol_deduct'] = (objInsurerPremium.hasOwnProperty('voluntary_excess_discount')) ? objInsurerPremium['voluntary_excess_discount'] - 0 : 0;
                    premium_breakup['own_damage']['od_disc_ncb'] = (objInsurerPremium.hasOwnProperty('bonus_discount')) ? objInsurerPremium['bonus_discount'] - 0 : 0;
                    premium_breakup['own_damage']['od_final_premium'] = objResponseJson['ServiceResult']['GetUserData'][0]['PropPremiumCalculation_CustomCoverLDPremium'][0] - 0;
                }
            } else if (this.lm_request['product_id'] === 10 && this.lm_request['vehicle_insurance_type'] === "renew") {
                if (this.lm_request['is_claim_exists'] === "no") {
                    premium_breakup['own_damage']['od_disc_vol_deduct'] = (objInsurerPremium.hasOwnProperty('voluntary_excess_discount_od')) ? objInsurerPremium['voluntary_excess_discount_od'] - 0 : 0;
                    premium_breakup['own_damage']['od_disc_ncb'] = (objInsurerPremium.hasOwnProperty('no_claim_bonus_discount')) ? objInsurerPremium['no_claim_bonus_discount'] - 0 : 0;
                    premium_breakup['own_damage']['od_final_premium'] = objResponseJson['ServiceResult']['GetUserData'][0]['PropPremiumCalculation_CustomCoverLDPremium'][0] - objInsurerPremium['no_claim_bonus_discount'];
                } else {
                    premium_breakup['own_damage']['od_disc_vol_deduct'] = (objInsurerPremium.hasOwnProperty('voluntary_excess_discount_od')) ? objInsurerPremium['voluntary_excess_discount_od'] - 0 : 0;
                    premium_breakup['own_damage']['od_disc_ncb'] = (objInsurerPremium.hasOwnProperty('no_claim_bonus_discount')) ? objInsurerPremium['no_claim_bonus_discount'] - 0 : 0;
                    premium_breakup['own_damage']['od_final_premium'] = objResponseJson['ServiceResult']['GetUserData'][0]['PropPremiumCalculation_CustomCoverLDPremium'][0] - 0;
                }
            } else if (this.lm_request['vehicle_insurance_type'] === "new" && this.lm_request['product_id'] === 10) {
                premium_breakup['own_damage']['od_disc_vol_deduct'] = (objInsurerPremium.hasOwnProperty('voluntary_excess_discount_od')) ? objInsurerPremium['voluntary_excess_discount_od'] - 0 : 0;
                premium_breakup['own_damage']['od_final_premium'] = objResponseJson['ServiceResult']['GetUserData'][0]['PropPremiumCalculation_CustomCoverLDPremium'][0] - 0;
            } else {
                premium_breakup['own_damage']['od_disc_vol_deduct'] = (objInsurerPremium.hasOwnProperty('voluntary_excess_discount')) ? objInsurerPremium['voluntary_excess_discount'] - 0 : 0;
                premium_breakup['own_damage']['od_disc_ncb'] = (objInsurerPremium.hasOwnProperty('bonus_discount')) ? objInsurerPremium['bonus_discount'] - 0 : 0;
                premium_breakup['own_damage']['od_final_premium'] = objResponseJson['ServiceResult']['GetUserData'][0]['PropPremiumCalculation_CustomCoverLDPremium'][0] - 0;
            }

            //remium_breakup['own_damage']['od_final_premium'] = (GetUserData.hasOwnProperty('PropPremiumCalculation_CustomCoverLDPremium')) ? GetUserData['PropPremiumCalculation_CustomCoverLDPremium'][0] - 0 : 0;

            //liability
            premium_breakup['liability']['tp_basic'] = (objInsurerPremium.hasOwnProperty('basic_tp')) ? objInsurerPremium['basic_tp'] - 0 : 0;
            premium_breakup['liability']['tp_cover_owner_driver_pa'] = (objInsurerPremium.hasOwnProperty('pa_owner_driver')) ? objInsurerPremium['pa_owner_driver'] - 0 : 0;
            premium_breakup['liability']['tp_cover_unnamed_passenger_pa'] = (objInsurerPremium.hasOwnProperty('personal_accident_cover_unnamed')) ? objInsurerPremium['personal_accident_cover_unnamed'] - 0 : 0;
            premium_breakup['liability']['tp_cover_named_passenger_pa'] = (objInsurerPremium.hasOwnProperty('tp_cover_named_passenger_pa')) ? objInsurerPremium['tp_cover_named_passenger_pa'] - 0 : 0;
            premium_breakup['liability']['tp_cover_paid_driver_pa'] = (objInsurerPremium.hasOwnProperty('pa_paid_drivers,_cleaners_and_conductors')) ? objInsurerPremium['pa_paid_drivers,_cleaners_and_conductors'] - 0 : 0;
            premium_breakup['liability']['tp_cover_paid_driver_ll'] = (objInsurerPremium.hasOwnProperty('ll_to_paid_driver_imt_28')) ? objInsurerPremium['ll_to_paid_driver_imt_28'] - 0 : 0;

            if (this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === 'LPG/CNG' || this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === 'LPG' || this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === 'CNG') {
                if (this.lm_request['is_external_bifuel'] === 'yes') {
                    if (this.lm_request['external_bifuel_type'] === 'cng') {
                        premium_breakup['liability']['tp_cng_lpg'] = (objInsurerPremium.hasOwnProperty('cng_kit_tp')) ? objInsurerPremium['cng_kit_tp'] - 0 : 0;
                    }
                    if (this.lm_request['external_bifuel_type'] === 'lpg') {
                        premium_breakup['liability']['tp_cng_lpg'] = (objInsurerPremium.hasOwnProperty('lpg_kit_tp')) ? objInsurerPremium['lpg_kit_tp'] - 0 : 0;
                    }
                } else {
                    if (this.prepared_request['dbmaster_pb_fuel_name'] === 'CNG') {
                        premium_breakup['liability']['tp_cng_lpg'] = (objInsurerPremium.hasOwnProperty('built_in_cng_tp_loading_tp')) ? objInsurerPremium['built_in_cng_tp_loading_tp'] - 0 : 0;
                    } else if (this.prepared_request['dbmaster_pb_fuel_name'] === 'LPG') {
                        premium_breakup['liability']['tp_cng_lpg'] = (objInsurerPremium.hasOwnProperty('built_in_lpg_tp_loading_tp')) ? objInsurerPremium['built_in_lpg_tp_loading_tp'] - 0 : 0;
                    } else {
                        premium_breakup['liability']['tp_cng_lpg'] = (objInsurerPremium.hasOwnProperty('tp_cng_lpg')) ? objInsurerPremium['tp_cng_lpg'] - 0 : 0;
                    }
                }
            } else {
                premium_breakup['liability']['tp_cng_lpg'] = (objInsurerPremium.hasOwnProperty('tp_cng_lpg')) ? objInsurerPremium['tp_cng_lpg'] - 0 : 0;
            }
            premium_breakup['liability']['tp_final_premium'] = (GetUserData.hasOwnProperty('PropPremiumCalculation_NetTPPremium')) ? GetUserData['PropPremiumCalculation_NetTPPremium'] - 0 : 0;

            /* premium_breakup['addon']['addon_zero_dep_cover'] = (objInsurerPremium.hasOwnProperty('zero_depreciation')) ? objInsurerPremium['zero_depreciation'] - 0 : 0;
             premium_breakup['addon']['addon_road_assist_cover'] = (objInsurerPremium.hasOwnProperty('basic_roadside_assistance')) ? objInsurerPremium['basic_roadside_assistance'] - 0 : 0;
             premium_breakup['addon']['addon_ncb_protection_cover'] = (objInsurerPremium.hasOwnProperty('ncb_protection')) ? objInsurerPremium['ncb_protection'] - 0 : 0;
             */
            if (objResponseJson['ServiceResult']['GetUserData'][0]['PropRisks_PlanName'][0] === "Gold") {
                premium_breakup['addon']['addon_zero_dep_cover'] = (objInsurerPremium.hasOwnProperty('zero_depreciation')) ? (objInsurerPremium['add_on_cover_gold'] / 3) - 0 : 0;
                premium_breakup['addon']['addon_road_assist_cover'] = (objInsurerPremium.hasOwnProperty('basic_roadside_assistance')) ? (objInsurerPremium['add_on_cover_gold'] / 3) - 0 : 0;
                premium_breakup['addon']['addon_ncb_protection_cover'] = (objInsurerPremium.hasOwnProperty('ncb_protection')) ? (objInsurerPremium['add_on_cover_gold'] / 3) - 0 : 0;
            } else if (objResponseJson['ServiceResult']['GetUserData'][0]['PropRisks_PlanName'][0] === "Silver") {
                premium_breakup['addon']['addon_zero_dep_cover'] = (objInsurerPremium.hasOwnProperty('zero_depreciation')) ? (objInsurerPremium['add_on_cover_silver'] / 2) - 0 : 0;
                premium_breakup['addon']['addon_road_assist_cover'] = (objInsurerPremium.hasOwnProperty('basic_roadside_assistance')) ? (objInsurerPremium['add_on_cover_silver'] / 2) - 0 : 0;
            } else {
                premium_breakup['addon']['addon_zero_dep_cover'] = (objInsurerPremium.hasOwnProperty('zero_depreciation')) ? objInsurerPremium['zero_depreciation'] - 0 : 0;
                premium_breakup['addon']['addon_road_assist_cover'] = (objInsurerPremium.hasOwnProperty('basic_roadside_assistance')) ? objInsurerPremium['basic_roadside_assistance'] - 0 : 0;
                premium_breakup['addon']['addon_ncb_protection_cover'] = (objInsurerPremium.hasOwnProperty('ncb_protection')) ? objInsurerPremium['ncb_protection'] - 0 : 0;
            }
            if (this.lm_request['product_id'] === 10) {
                if (objResponseJson['ServiceResult']['GetUserData'][0]['PropRisks_PlanName'][0] === "BasicPlus") {
                    premium_breakup['addon']['addon_zero_dep_cover'] = (objInsurerPremium.hasOwnProperty('zero_depreciation')) ? (objInsurerPremium['add_on_cover_basic_plus']) - 0 : 0;
                } else {
                    premium_breakup['addon']['addon_zero_dep_cover'] = (objInsurerPremium.hasOwnProperty('zero_depreciation')) ? objInsurerPremium['zero_depreciation'] - 0 : 0;
                }
            }
            premium_breakup['addon']['addon_engine_protector_cover'] = (objInsurerPremium.hasOwnProperty('engine_protector')) ? objInsurerPremium['engine_protector'] - 0 : 0;
            premium_breakup['addon']['addon_invoice_price_cover'] = (objInsurerPremium.hasOwnProperty('return_to_invoice')) ? objInsurerPremium['return_to_invoice'] - 0 : 0;
            premium_breakup['addon']['addon_key_lock_cover'] = (objInsurerPremium.hasOwnProperty('key_replacement')) ? objInsurerPremium['key_replacement'] - 0 : 0;
            // premium_breakup['addon']['addon_consumable_cover'] = (objInsurerPremium.hasOwnProperty('addon_consumable_cover')) ? objInsurerPremium['addon_consumable_cover'] - 0 : 0;
            //premium_breakup['addon']['addon_daily_allowance_cover'] = (objInsurerPremium.hasOwnProperty('addon_daily_allowance_cover')) ? objInsurerPremium['addon_daily_allowance_cover'] - 0 : 0;


            //premium_breakup['addon']['addon_windshield_cover'] = (objInsurerPremium.hasOwnProperty('addon_windshield_cover')) ? objInsurerPremium['addon_windshield_cover'] - 0 : 0;
            //premium_breakup['addon']['addon_passenger_assistance_cover'] = (objInsurerPremium.hasOwnProperty('addon_passenger_assistance_cover')) ? objInsurerPremium['addon_passenger_assistance_cover'] - 0 : 0;
            // premium_breakup['addon']['addon_tyre_coverage_cover'] = (objInsurerPremium.hasOwnProperty('addon_tyre_coverage_cover')) ? objInsurerPremium['addon_tyre_coverage_cover'] - 0 : 0;
            premium_breakup['addon']['addon_personal_belonging_loss_cover'] = (objInsurerPremium.hasOwnProperty('loss_of_personal_belongings')) ? objInsurerPremium['loss_of_personal_belongings'] - 0 : 0;
            premium_breakup['addon']['addon_inconvenience_allowance_cover'] = (objInsurerPremium.hasOwnProperty('inconvenience_allowance')) ? objInsurerPremium['inconvenience_allowance'] - 0 : 0;
            // premium_breakup['addon']['addon_medical_expense_cover'] = (objInsurerPremium.hasOwnProperty('addon_medical_expense_cover')) ? objInsurerPremium['addon_medical_expense_cover'] - 0 : 0;
            // premium_breakup['addon']['addon_hospital_cash_cover'] = (objInsurerPremium.hasOwnProperty('addon_hospital_cash_cover')) ? objInsurerPremium['addon_hospital_cash_cover'] - 0 : 0;
            //premium_breakup['addon']['addon_ambulance_charge_cover'] = (objInsurerPremium.hasOwnProperty('addon_ambulance_charge_cover')) ? objInsurerPremium['addon_ambulance_charge_cover'] - 0 : 0;


//        premium_breakup['addon']['addon_rodent_bite_cover'] = (objInsurerPremium.hasOwnProperty('addon_rodent_bite_cover')) ? objInsurerPremium['addon_rodent_bite_cover'] - 0 : 0;
//        premium_breakup['addon']['addon_losstime_protection_cover'] = (objInsurerPremium.hasOwnProperty('addon_losstime_protection_cover')) ? objInsurerPremium['addon_losstime_protection_cover'] - 0 : 0;
//        premium_breakup['addon']['addon_hydrostatic_lock_cover'] = (objInsurerPremium.hasOwnProperty('addon_hydrostatic_lock_cover')) ? objInsurerPremium['addon_hydrostatic_lock_cover'] - 0 : 0;

            var j = 0, final_addon = 0;
            for (j in premium_breakup.addon) {
                final_addon = final_addon + premium_breakup.addon[j];
            }
            premium_breakup['addon']['addon_final_premium'] = final_addon;
            //final_addon=final_addon+objInsurerPremium['add_on_cover_gold'] - 0;
            //premium_breakup['addon']['addon_final_premium'] = (objInsurerPremium.hasOwnProperty('final_addon')) ? (s - 0) : 0;

            premium_breakup['net_premium'] = Math.round(GetUserData.PropPremiumCalculation_NetPremium - 0);
            premium_breakup['final_premium'] = Math.round(GetUserData.PropPremiumCalculation_TotalPremium - 0);
            premium_breakup['service_tax'] = Math.round(GetUserData.PropPremiumCalculation_EndorsementServiceTax - 0);


            objServiceHandler.Premium_Breakup = premium_breakup;
            objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['ServiceResult']['ProposalNo'][0];
        }
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'premium_response_handler', ex);
    }
    console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
    return objServiceHandler;
};
MagmaHDIMotor.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    if (objResponseJson.hasOwnProperty('GenerateTransactionIDResult')) {
        if (objResponseJson['GenerateTransactionIDResult']['ErrorText'] === '') {

        } else {
            Error_Msg = objResponseJson['GenerateTransactionIDResult']['ErrorText'];
        }
    } else {
        Error_Msg = 'LM Empty Response';
    }
    try {
        var transaction_Id = 0;
        if (Error_Msg === 'NO_ERR') {
            transaction_Id = objResponseJson['GenerateTransactionIDResult']['TransactionID'];

            var data = {"encryptionInput": {"InputData": transaction_Id}};
            var args = {
                data: data,
                headers: {"Content-Type": "application/json;charset=UTF-8"},
                "rejectUnauthorized": false
            };

            var Client = require('node-rest-client').Client;
            var client = new Client();
            var temp = false;
            var encryptedData = '';
            client.post("https://webportal.magma-hdi.co.in:444/GCCustomerPortalServiceRest/GCCustomerPortalServiceRest.svc/EncryptText", args, function (data, response) {
                temp = true;
                console.log(data);
                //console.log(response);
                encryptedData = data['EncryptTextResult']['OutputData'];
            });
        }

        for (var i = 0; i < 10; i++)
        {
            if (!temp) {
                var sleep = require('system-sleep');
                sleep(7000);
            } else {
                var encryptedtransaction_Id = encryptedData;
                break;
            }
        }
        console.log(encryptedtransaction_Id);
        console.log("**************************************");
        console.log(this.prepared_request.insurer_customer_identifier_3);
        var encryptedProposalNo = this.prepared_request.insurer_customer_identifier_3;
        var pg_data = {
            'TXN': encryptedtransaction_Id,
            'PNO': encryptedProposalNo
        };
        console.log(pg_data);
        //objServiceHandler.Payment.pg_ack_url = 'http://localhost:50111/transaction-status/' + this.lm_request['crn'];
        objServiceHandler.Payment.pg_ack_url = this.const_payment.pg_ack_url;
        //objServiceHandler.Payment.pg_ack_url = 'http://localhost:7000/transaction-status/' + this.lm_request['crn'];
        objServiceHandler.Payment.pg_data = pg_data;
        objServiceHandler.Payment.pg_redirect_mode = 'GET';
        objServiceHandler.Insurer_Transaction_Identifier = this.prepared_request.insurer_customer_identifier;
        objServiceHandler.Error_Msg = Error_Msg;
        return objServiceHandler;
    } catch (e) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(e)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'proposal_response_handler', e);
    }
};
MagmaHDIMotor.prototype.insurer_vehicle_idv = function (objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback) {
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
        method_content = method_content.replace('___vehicle_expected_idv___', 0);
        this.method_content = method_content;
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
        console.log("Service Data for Megma *********************************************************************************************************");
        console.log(docLog.Insurer_Request);
        this.service_call(docLog, objProduct, Insurer_Object, specific_insurer_object);
    } catch (e) {
        console.error('Exception', this.constructor.name, 'insurer_vehicle_idv', e);
    }
};
MagmaHDIMotor.prototype.verification_response_handler = function (objResponseJson) {
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
            if (Error_Msg === 'NO_ERR') {
                var product_name = 'CAR';
                if (this.lm_request['product_id'] === 10) {
                    product_name = 'TW';
                }
                var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.const_policy.policy_number.toString().replaceAll('/', '') + '.pdf';
                var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                var pdf_web_path = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                //var pdf_web_path = config.environment.portalurl + config.pb_config.pdf_web_loc + pdf_file_name;
                this.const_policy.policy_url = pdf_web_path;

                var Client = require('node-rest-client').Client;
                var client = new Client();
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
                this.pdf_call(config.environment.weburl + '/quote/pdf_initiate', args, pdf_sys_loc);
                /*
                 client.post(config.environment.weburl + '/quote/pdf_initiate', args, function (data, response) {
                 
                 });*/

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
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(e)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', e);
        return objServiceHandler;
    }
};
MagmaHDIMotor.prototype.pdf_call = function (url, args, pdf_sys_loc) {
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
    } catch (e) {
        console.error('Exception', this.constructor.name, 'pdf_call', e);
    }
};
MagmaHDIMotor.prototype.pdf_response_handler = function (objResponseJson) {
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';
    console.log('Start', this.constructor.name, 'pdf_response_handler', objResponseJson);

    try {
        var objPremiumService = objResponseJson;
        if (!objPremiumService.hasOwnProperty('GeneratePolicyDocumentResult')) {
            Error_Msg = 'LM_EMPTY_RESPONSE';
        } else {
            //objPremiumService = objPremiumService['GeneratePolicyDocumentResult']['PolicyDocument'];
            if (objPremiumService['GeneratePolicyDocumentResult'].hasOwnProperty('ErrorText') && objPremiumService['GeneratePolicyDocumentResult']['ErrorText'] !== '') {
                Error_Msg = objPremiumService['GeneratePolicyDocumentResult']['ErrorText'];
            }
        }

        var policy = {
            'policy_url': null,
            'policy_number': this.lm_request['policy_number'],
            'pdf_status': null
        };
        if (Error_Msg === 'NO_ERR') {
            if (objPremiumService['GeneratePolicyDocumentResult'].hasOwnProperty('PolicyDocument') && objPremiumService['GeneratePolicyDocumentResult']['PolicyDocument'] !== '') {
                var product_name = 'CAR';
                if (this.lm_request['product_id'] === 10) {
                    product_name = 'TW';
                }
                var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.lm_request['policy_number'].toString().replaceAll('/', '') + '.pdf';
                var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                var pdf_web_path_horizon = config.environment.weburl + "/pdf/" + pdf_file_name;
                var pdf_sys_loc_portal = config.pb_config.pdf_system_loc + pdf_file_name;
                var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                // var pdf_web_path_portal = config.environment.portalurl + config.pb_config.pdf_web_loc + pdf_file_name;
                var binary = new Buffer(objPremiumService['GeneratePolicyDocumentResult']['PolicyDocument'], 'base64');
                fs.writeFileSync(pdf_sys_loc_horizon, binary);
                //fs.writeFileSync(pdf_sys_loc_portal, binary);
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
        objServiceHandler.Error_Msg = JSON.stringify(ex);
        return objServiceHandler;
    }

};
MagmaHDIMotor.prototype.pg_response_handler = function () {
    //PolicyNo: GCPaymentId: 119300003100000609PaymentGatewayTransId: 20009606TxnId: 102187180523PartnerSource: CustomerWorksiteProposalNumber: 201805230000379CustomerID: 20001099898ErrorStatus: Payment tagging is unsuccessful in GCErrorMessage: Please proceed with manual payment tagging in GC.
    try {
        var objInsurerProduct = this;
        this.const_policy.transaction_status = '';
        this.const_policy.transaction_id = objInsurerProduct.lm_request.pg_post['PaymentGatewayTransId'];
        if (objInsurerProduct.lm_request.pg_post['ErrorStatus'].indexOf('successfully') > -1) {
            this.const_policy.transaction_status = 'SUCCESS';
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.pg_reference_number_1 = objInsurerProduct.lm_request.pg_post['GCPaymentId'];
            this.const_policy.pg_reference_number_2 = objInsurerProduct.lm_request.pg_post['TxnId'];
            this.const_policy.policy_number = objInsurerProduct.lm_request.pg_post['PolicyNo'];
        } else if (objInsurerProduct.lm_request.pg_post['GCPaymentId'] !== '' && objInsurerProduct.lm_request.pg_post['PolicyNo'] === '') {
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.transaction_status = 'PAYPASS';
        } else if (objInsurerProduct.lm_request.pg_post['GCPaymentId'] === '' && objInsurerProduct.lm_request.pg_post['PolicyNo'] === '') {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', e);
    }
};
MagmaHDIMotor.prototype.premium_breakup_schema = {
    "own_damage": {
        "od_basic": "Basic - OD",
        "od_elect_access": "Electrical or Electronic Accessories",
        "od_non_elect_access": "Non-Electrical Accessories",
        "od_cng_lpg": "Built in LPG - OD loading - OD", //Built in CNG - OD loading - OD
        "od_disc_ncb": "Bonus Discount",
        "od_disc_vol_deduct": "Voluntary Excess Discount",
        "od_disc_anti_theft": "Anti-Theft Device - OD",
        "od_disc_aai": "Automobile Association Discount",
        "od_loading": "",
        "od_disc": "",
        "od_final_premium": ""
    },
    "liability": {
        "tp_basic": "Basic - TP", //132
        "tp_cover_owner_driver_pa": "PA Owner Driver", //132
        "tp_cover_unnamed_passenger_pa": "Personal Accident Cover-Unnamed", //****
        "tp_cover_named_passenger_pa": "",
        "tp_cover_paid_driver_pa": "PA Paid Drivers, Cleaners and Conductors",
        "tp_cover_paid_driver_ll": "LL to Paid Driver IMT 28",
        "tp_cng_lpg": "Built in LPG-TP Loading-TP", //Built in CNG-TP Loading-TP
        "tp_cover_outstanding_loan": "",
        "tp_final_premium": ""
    },
    "addon": {
        "addon_zero_dep_cover": "Zero Depreciation",
        "addon_road_assist_cover": "Basic Roadside Assistance",
        "addon_ncb_protection_cover": "NCB Protection",
        "addon_engine_protector_cover": "Engine Protector",
        "addon_invoice_price_cover": "Return to Invoice",
        "addon_key_lock_cover": "Key Replacement",
        "addon_consumable_cover": null,
        "addon_daily_allowance_cover": null,
        "addon_windshield_cover": null,
        "addon_passenger_assistance_cover": null,
        "addon_tyre_coverage_cover": null,
        "addon_personal_belonging_loss_cover": "Loss Of Personal Belongings",
        "addon_inconvenience_allowance_cover": "Inconvenience Allowance",
        "addon_medical_expense_cover": null,
        "addon_hospital_cash_cover": null,
        "addon_ambulance_charge_cover": null,
        "addon_rodent_bite_cover": null,
        "addon_losstime_protection_cover": null,
        "addon_hydrostatic_lock_cover": null,
        "addon_final_premium": ""
    },
    "net_premium": "NetPremium",
    "service_tax": "ServiceTax",
    "final_premium": "TotalPremium"
};
module.exports = MagmaHDIMotor;
