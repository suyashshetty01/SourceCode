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
var encodeUrl = require('encodeurl');
var crypto = require('crypto');
var sleep = require('system-sleep');

function CholaMSMotor() {

}
util.inherits(CholaMSMotor, Motor);

CholaMSMotor.prototype.lm_request_single = {};
CholaMSMotor.prototype.insurer_integration = {};
CholaMSMotor.prototype.insurer_addon_list = [];
CholaMSMotor.prototype.insurer = {};
CholaMSMotor.prototype.pdf_attempt = 0;
CholaMSMotor.prototype.insurer_date_format = 'dd/MM/yyyy';


CholaMSMotor.prototype.insurer_product_api_pre = function () {

};
CholaMSMotor.prototype.insurer_product_field_process_pre = function () {
    try {
		//posp start
		if (this.lm_request['is_posp'] === 'yes') {
			let posp_name = this.lm_request['posp_first_name'];
			posp_name += (this.lm_request['posp_middle_name']) ? ( ' ' + this.lm_request['posp_middle_name']) : '';
			posp_name += (this.lm_request['posp_last_name']) ? ( ' ' + this.lm_request['posp_last_name']) : '';
			this.method_content = this.method_content.replace('___posp_pan_no___', this.lm_request['posp_pan_no']);
			this.method_content = this.method_content.replace('___posp_pan_no___', this.lm_request['posp_pan_no']);			
			this.method_content = this.method_content.replace('___posp_first_name___ ___posp_middle_name___ ___posp_last_name___', posp_name);
		} else {
			this.method_content = this.method_content.replace('___posp_pan_no___', '');
			this.method_content = this.method_content.replace('___posp_pan_no___', '');
			this.method_content = this.method_content.replace('___posp_first_name___ ___posp_middle_name___ ___posp_last_name___', '');
		}
		//posp finish
        if (this.lm_request['product_id'] === 10 && config.environment.name === 'Production') {
            if (this.lm_request['vehicle_insurance_subtype'] === "1CH_0TP" || this.lm_request['vehicle_insurance_subtype'] === "0CH_1TP" || this.lm_request['vehicle_insurance_subtype'] === "1CH_4TP") {
                this.prepared_request['product_id_car'] = "M00000006";
                this.processed_request['___product_id_car___'] = this.prepared_request['product_id_car'];
                this.prepared_request['product_id_tw'] = "M00000006";
                this.processed_request['___product_id_tw___'] = this.prepared_request['product_id_tw'];
            }
        }
        if (this.lm_request['product_id'] === 1 && config.environment.name === 'Production') {
            if (this.lm_request['vehicle_insurance_subtype'] === "1CH_0TP" || this.lm_request['vehicle_insurance_subtype'] === "1CH_2TP") {
                this.prepared_request['product_id_car'] = "M00000007";
                this.processed_request['___product_id_car___'] = this.prepared_request['product_id_car'];
            }
            if (this.lm_request['vehicle_insurance_subtype'] === "0CH_1TP") {
                this.prepared_request['product_id_car'] = "M000000000015";
                this.processed_request['___product_id_car___'] = this.prepared_request['product_id_car'];
            }            
        }
        if (this.lm_request['vehicle_insurance_subtype'] === "1OD_0TP") {
            if (this.lm_request['product_id'] === 1) {
                if (config.environment.name === 'Production') {
                    this.prepared_request['product_id_car'] = "M00000002";
                    this.processed_request['___product_id_car___'] = this.prepared_request['product_id_car'];
                } else {
                    this.prepared_request['product_id_car'] = "M00000006";
                    this.processed_request['___product_id_car___'] = this.prepared_request['product_id_car'];
                }
            }
            if (this.lm_request['product_id'] === 10) {
                if (config.environment.name === 'Production') {
                    this.prepared_request['product_id_car'] = "M00000003";
                    this.processed_request['___product_id_car___'] = this.prepared_request['product_id_car'];
                    this.prepared_request['product_id_tw'] = "M00000003";
                    this.processed_request['___product_id_tw___'] = this.prepared_request['product_id_tw'];
                } else {
                    this.prepared_request['product_id_car'] = "M00000008";
                    this.processed_request['___product_id_car___'] = this.prepared_request['product_id_car'];
                    this.prepared_request['product_id_tw'] = "M00000008";
                    this.processed_request['___product_id_tw___'] = this.prepared_request['product_id_tw'];
                }
                this.prepared_request['vehicle_insurance_subtype_tw'] = "Standalone OD";
                this.processed_request['___vehicle_insurance_subtype_tw___'] = this.prepared_request['vehicle_insurance_subtype_tw'];
            }
        }
        if ((this.lm_request['method_type'] === 'Idv' || this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Customer' || this.lm_request['method_type'] === 'Proposal')) {
            this.prepared_request['date_of_registration'] = this.javaScriptDateToExcelDate(this.processed_request['___vehicle_registration_date___']);
            this.processed_request['___date_of_registration___'] = this.prepared_request['date_of_registration'];
            if (this.lm_request['vehicle_insurance_type'] === 'new') {
                this.prepared_request['prev_policy_expiry_date'] = "";
                this.processed_request['___prev_policy_expiry_date___'] = this.prepared_request['prev_policy_expiry_date'];
            } else {
                this.prepared_request['prev_policy_expiry_date'] = this.javaScriptDateToExcelDate(this.processed_request['___policy_expiry_date___']);
                this.processed_request['___prev_policy_expiry_date___'] = this.prepared_request['prev_policy_expiry_date'];
            }
            if (this.lm_request['product_id'] === 10) {
                this.method_content = this.method_content.replace('___product_id_car___', this.processed_request['___product_id_tw___']);
            }
        }
        if ((this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Customer' || this.lm_request['method_type'] === 'Proposal')) {
            this.prepared_request['dbmaster_insurer_vehicle_exshowroom'] = this.insurer_master.vehicles.insurer_db_master['Insurer_Vehicle_ExShowRoom'];
            this.processed_request['___dbmaster_insurer_vehicle_exshowroom___'] = this.prepared_request['dbmaster_insurer_vehicle_exshowroom'];

            if (this.processed_request['___vehicle_registration_type___'] === "Individual" && this.lm_request['is_pa_od'] === "yes" && this.lm_request['vehicle_insurance_subtype'] !== "1OD_0TP") {
                this.prepared_request['is_pa_owner_driver'] = "Yes";
                this.processed_request['___is_pa_owner_driver___'] = this.prepared_request['is_pa_owner_driver'];
            } else {
                this.prepared_request['is_pa_owner_driver'] = "No";
                this.processed_request['___is_pa_owner_driver___'] = this.prepared_request['is_pa_owner_driver'];
            }
            if (this.lm_request['vehicle_insurance_type'] === 'new') {
                this.method_content = this.method_content.replace('<!-- New business node start -->', '');
                this.method_content = this.method_content.replace('<!-- New business node end -->', '');
            } else {
                var txt_replace2 = this.find_text_btw_key(this.method_content, '<!-- New business node start -->', '<!-- New business node end -->', true);
                if (txt_replace2) {
                    this.method_content = this.method_content.replace(txt_replace2, '');
                }
            }
        }
        if (this.lm_request['method_type'] === 'Proposal') {
            if (this.processed_request.hasOwnProperty('___insurer_customer_identifier___') && this.processed_request['___insurer_customer_identifier___'] !== undefined) {
                this.prepared_request['quote_id'] = this.processed_request['___insurer_customer_identifier___'].split("_")[0];
                this.processed_request['___quote_id___'] = this.prepared_request['quote_id'];

                this.prepared_request['proposal_id'] = this.processed_request['___insurer_customer_identifier___'].split("_")[1];
                this.processed_request['___proposal_id___'] = this.prepared_request['proposal_id'];
            }
            this.prepared_request['reg_area_locality'] = this.lm_request['permanent_locality_code_text'];
            this.processed_request['___reg_area_locality___'] = this.prepared_request['reg_area_locality'];
            if (this.lm_request['is_reg_addr_comm_addr_same'] === "yes") {
                this.prepared_request['area_locality'] = this.lm_request['permanent_locality_code_text'];
                this.processed_request['___area_locality___'] = this.prepared_request['area_locality'];

                this.prepared_request['same_Comm_Reg_addr'] = false;
                this.processed_request['___same_Comm_Reg_addr___'] = this.prepared_request['same_Comm_Reg_addr'];
            } else {
                this.prepared_request['area_locality'] = this.lm_request['communication_locality_code_text'];
                this.processed_request['___area_locality___'] = this.prepared_request['area_locality'];

                this.prepared_request['same_Comm_Reg_addr'] = true;
                this.processed_request['___same_Comm_Reg_addr___'] = this.prepared_request['same_Comm_Reg_addr'];
            }
            this.prepared_request['date_of_birth'] = this.javaScriptDateToExcelDate(this.processed_request['___birth_date___']);
            this.processed_request['___date_of_birth___'] = this.prepared_request['date_of_birth'];
            if (this.processed_request['___is_financed___'] === "no") {
                this.method_content = this.method_content.replace('___is_financed___', 'No');
            } else {
                this.method_content = this.method_content.replace('___is_financed___', 'Yes');
            }
            if (this.processed_request['___financial_agreement_type___'] == "0") {
                this.method_content = this.method_content.replace('___financial_agreement_type___', '');
            }
            if (this.processed_request['___vehicle_registration_type___'] === "Individual") {
                this.prepared_request['name'] = this.processed_request["___first_name___"] + " " + this.processed_request["___middle_name___"] + " " + this.processed_request["___last_name___"];
                this.processed_request['___name___'] = this.prepared_request['name'];
            } else {
                this.prepared_request['name'] = this.processed_request["___company_name___"];
                this.processed_request['___name___'] = this.prepared_request['name'];
            }
            // For Razorpay Wallet
            if (this.lm_request.hasOwnProperty('pay_from')) {
                this.prepared_request['pay_from'] = "wallet";
                this.processed_request['___pay_from___'] = this.prepared_request['pay_from'];
            }
        }
        if (this.lm_request['method_type'] === 'Verification') {
            if (this.lm_request.hasOwnProperty('payment_code')) {
                this.method_content = this.method_content.replace('___paymentId___', this.lm_request['payment_code']);
            }else{
                var payment_id = "";
                if ((this.hasOwnProperty('const_payment_response') && this.const_payment_response.hasOwnProperty('pg_data') && this.const_payment_response.pg_data.hasOwnProperty('quoteId') && this.const_payment_response.pg_data.quoteId)) {
                    payment_id = this.const_payment_response.pg_data.quoteId;
                } else {
                    payment_id = (this.processed_request['___dbmaster_insurer_transaction_identifier___']);
                }
                this.prepared_request['paymentId'] = payment_id;
                this.processed_request['___paymentId___'] = this.prepared_request['paymentId'];
            }
            // for razorpay transaction
            if ((this.proposal_processed_request.hasOwnProperty('___pay_from___') && this.proposal_processed_request['___pay_from___'] === 'wallet') || (this.hasOwnProperty('const_payment_response') && this.const_payment_response.hasOwnProperty('pg_data') && this.const_payment_response.pg_data.hasOwnProperty('pg_type') && this.const_payment_response.pg_data.pg_type === "rzrpay")) {
                let transaction_id = "";
                if (this.processed_request.hasOwnProperty('___pg_reference_number_1___') && this.processed_request.___pg_reference_number_1___ && this.processed_request.___pg_reference_number_1___.includes('trf_')) {
                    transaction_id = this.processed_request['___pg_reference_number_1___'];
                } else if (this.hasOwnProperty('const_payment_response') && this.const_payment_response.hasOwnProperty('pg_data') && this.const_payment_response.pg_data.transfer_id) {
                    transaction_id = this.const_payment_response.pg_data.transfer_id;
                }
                this.method_content = this.method_content.replace('___transaction_id___', transaction_id);
            }
        }
        if (this.lm_request['method_type'] === 'Pdf') {
            var policy_code = (this.const_policy.policy_code);
            if (policy_code === null || policy_code === undefined) {
                policy_code = this.lm_request["policy_code"];
            }
            this.prepared_request['policy_code'] = policy_code;
            this.processed_request['___policy_code___'] = this.prepared_request['policy_code'];
            this.lm_request['transaction_id'] = isNaN(this.lm_request['transaction_id']) ? (this.lm_request['transaction_pg'] ? this.lm_request['transaction_pg'] : this.lm_request['transaction_id']) : this.lm_request['transaction_id'];
        }
        if (this.lm_request['product_id'] === 1) {
            this.prepared_request['dbmaster_insurer_rto_city_code'] = this.prepared_request['dbmaster_insurer_rto_city_code_car'];
            this.processed_request['___dbmaster_insurer_rto_city_code___'] = this.prepared_request['dbmaster_insurer_rto_city_code'];
        }
        //this.method_content = this.method_content.replace('___is_policy_exist___', 'false');
        var addon_vehicle_age = this.addon_vehicle_age_year();
        if (parseFloat(addon_vehicle_age) >= 5) {
            this.method_content = this.method_content.replace('___addon_consumable_cover___', 'No');
            this.method_content = this.method_content.replace('___addon_daily_allowance_cover___', 'No');
            this.method_content = this.method_content.replace('___addon_engine_protector_cover___', 'No');
            this.method_content = this.method_content.replace('___addon_zero_dep_cover___', 'No');
            this.method_content = this.method_content.replace('___addon_hydrostatic_lock_cover___', 'No');
            this.method_content = this.method_content.replace('___addon_key_lock_cover___', 'No');
            this.method_content = this.method_content.replace('___addon_ncb_protection_cover___', 'No');
        }
        if (parseFloat(addon_vehicle_age) >= 10) {
            this.method_content = this.method_content.replace('___addon_road_assist_cover___', 'No');
        }
        if (this.lm_request['is_tppd'] === "yes") {
            this.prepared_request['TPPD_limit_val'] = 6000;
            this.processed_request['___TPPD_limit_val___'] = this.prepared_request['TPPD_limit_val'];
        } else {
            this.prepared_request['TPPD_limit_val'] = 0;
            this.processed_request['___TPPD_limit_val___'] = this.prepared_request['TPPD_limit_val'];
        }
        var is_tp_only = false;
        if (this.prepared_request.hasOwnProperty('vehicle_insurance_subtype') && this.prepared_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
            is_tp_only = true;
        }
        let isSAOD = this.lm_request.hasOwnProperty('vehicle_insurance_subtype') && this.lm_request['vehicle_insurance_subtype'].indexOf('1OD') > -1;
        if (this.processed_request['___dbmaster_previousinsurer_code___'] !== null && this.processed_request['___dbmaster_previousinsurer_code___'] !== undefined && this.processed_request['___dbmaster_previousinsurer_code___'] !== "") {
            this.prepared_request['Prev_Insur_Name'] = this.processed_request['___dbmaster_previousinsurer_code___'];
            this.processed_request['___Prev_Insur_Name___'] = this.prepared_request['Prev_Insur_Name'];
        } else {
            this.prepared_request['Prev_Insur_Name'] = "";
            this.processed_request['___Prev_Insur_Name___'] = this.prepared_request['Prev_Insur_Name'];
        }
        if (this.processed_request['___electrical_accessory___'] == "0") {
            this.prepared_request['electrical_cover'] = "No";
            this.processed_request['___electrical_cover___'] = this.prepared_request['electrical_cover'];
            this.method_content = this.method_content.replaceAll('___electrical_accessory___', '');
        } else {
            this.prepared_request['electrical_cover'] = "Yes";
            this.processed_request['___electrical_cover___'] = this.prepared_request['electrical_cover'];
        }

        if (this.processed_request['___non_electrical_accessory___'] == "0") {
            this.prepared_request['non_electrical_cover'] = "No";
            this.processed_request['___non_electrical_cover___'] = this.prepared_request['non_electrical_cover'];
            this.method_content = this.method_content.replaceAll('___non_electrical_accessory___', '');
        } else {
            this.prepared_request['non_electrical_cover'] = "Yes";
            this.processed_request['___non_electrical_cover___'] = this.prepared_request['non_electrical_cover'];
        }
        this.prepared_request['zero_dep_percentage'] = "0%";
        this.processed_request['___zero_dep_percentage___'] = this.prepared_request['zero_dep_percentage'];
        if (this.lm_request['vehicle_insurance_subtype'] === "0CH_1TP") {
            this.method_content = this.method_content.replace('___zero_dep_percentage___', "");
            this.method_content = this.method_content.toString().replace('___Daily_Cash_Allowance___', "");
            if (this.lm_request['product_id'] === 10) {
                this.method_content = this.method_content.replace('___insurer_integration_agent_code___', "2002954741760001");
            }
        } else {
            if (this.processed_request['___addon_zero_dep_cover___'] === "true") {
                //this.method_content = this.method_content.replace('___zero_dep_percentage___', "100%");
                this.prepared_request['zero_dep_percentage'] = "100%";
                this.processed_request['___zero_dep_percentage___'] = this.prepared_request['zero_dep_percentage'];
            }
        }
        if (this.lm_request['is_breakin'] === "yes") {
            if (this.lm_request['is_policy_exist'] === "no" && this.lm_request['vehicle_insurance_subtype'] !== "0CH_1TP") {
                this.prepared_request['policy_number'] = "87687893334";
                this.processed_request['___policy_number___'] = this.prepared_request['policy_number'];
            } else if (this.lm_request['is_policy_exist'] === "no" && this.lm_request['vehicle_insurance_subtype'] === "0CH_1TP") {
                this.prepared_request['policy_number'] = "";
                this.processed_request['___policy_number___'] = this.prepared_request['policy_number'];
            } else {
                this.prepared_request['policy_number'] = "74474747474";
                this.processed_request['___policy_number___'] = this.prepared_request['policy_number'];
            }
        } else {
            this.prepared_request['policy_number'] = "74474747474";
            this.processed_request['___policy_number___'] = this.prepared_request['policy_number'];
        }
        // TP Only
        if (this.lm_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
            this.prepared_request['vehicle_expected_idv'] = 0;
            this.processed_request['___vehicle_expected_idv___'] = 0;
        }
        if ((parseInt(this.lm_request['pa_paid_driver_si'])) > 0) {
            this.prepared_request['is_pa_paid_driver'] = true;
            this.processed_request['___is_pa_paid_driver___'] = this.prepared_request['is_pa_paid_driver'];
        } else {
            this.prepared_request['is_pa_paid_driver'] = false;
            this.processed_request['___is_pa_paid_driver___'] = this.prepared_request['is_pa_paid_driver'];
        }
        if ((parseInt(this.lm_request['pa_unnamed_passenger_si'])) > 0 && (parseInt(this.lm_request['pa_unnamed_passenger_si'])) === 100000) {
            this.prepared_request['is_pa_unnamed_passenger'] = "Yes";
            this.processed_request['___is_pa_unnamed_passenger___'] = this.prepared_request['is_pa_unnamed_passenger'];
        } else {
            this.prepared_request['is_pa_unnamed_passenger'] = "No";
            this.processed_request['___is_pa_unnamed_passenger___'] = this.prepared_request['is_pa_unnamed_passenger'];
        }
        if (this.prepared_request['pa_unnamed_passenger_si'] === "") {
            this.prepared_request['pa_unnamed_passenger_si'] = "0";
            this.processed_request['___pa_unnamed_passenger_si___'] = this.prepared_request['pa_unnamed_passenger_si'];
        }
        if (this.prepared_request['pa_paid_driver_si'] === "") {
            this.prepared_request['pa_paid_driver_si'] = "0";
            this.processed_request['___pa_paid_driver_si___'] = this.prepared_request['pa_paid_driver_si'];
        }
        if (this.processed_request['___voluntary_deductible___'] === "") {
            this.processed_request['___voluntary_deductible___'] = 0;
        }
        // TW
        if (this.lm_request['product_id'] === 10 || this.lm_request['product_id'] === 1) {
            var date = new Date();
            var udid = this.lm_request['udid'].toString();
            var transactionIdNo = '';
            if (this.lm_request['vehicle_insurance_subtype'] !== "1OD_0TP") {
                if (this.lm_request['method_type'] === 'Proposal') {
                   /* if (this.lm_request.hasOwnProperty('insurer_transaction_identifier') && this.lm_request['insurer_transaction_identifier'] !== undefined) {
                        if (this.lm_request['insurer_transaction_identifier'].includes("chola_first_call")) {
                            transactionIdNo = this.lm_request['insurer_transaction_identifier'].split("-")[1];
                        } else {
                            transactionIdNo = 'POLICYBOSS' + this.lm_request['proposal_id'];
                        }
                    } else {
                        transactionIdNo = 'POLICYBOSS' + this.lm_request['proposal_id'];
                    }*/
                    transactionIdNo = 'POLICYBOSS' + this.lm_request['proposal_id'];
                } else {
                    if (transactionIdNo === '') {
                        if (udid === '' || udid === 0) {
                            var time = moment(date).format('DDMMYYkkmmss'); //ddmmyyhhmmss
                            transactionIdNo = 'PBLM' + time;
                        } else {
                            var time = moment(date).format('kkmmss'); //hhmmss
                            transactionIdNo = 'PBLM' + udid + time;
                        }
                    }
                }
            } else {
                if (this.lm_request['method_type'] === 'Proposal') {
                    transactionIdNo = 'POLICYBOSS' + this.lm_request['proposal_id'];
                } else {
                    if (transactionIdNo === '') {
                        if (udid === '' || udid === 0) {
                            var time = moment(date).format('DDMMYYkkmmsssss'); //ddmmyyhhmmss
                            transactionIdNo = time;
                        } else {
                            var time = moment(date).format('kkmmsssss'); //hhmmss
                            transactionIdNo = udid + time;
                        }
                    }
                }
            }
            sleep(2000);

            this.prepared_request['unique_transaction_id'] = transactionIdNo;
            this.processed_request['___unique_transaction_id___'] = transactionIdNo;
        }
        if (this.lm_request['product_id'] === 10) {
            if (this.lm_request['vehicle_insurance_type'] === 'new') {
                this.prepared_request['registration_no'] = "NEW";
                this.processed_request['___registration_no___'] = "NEW";
            }
            // for IDV xml
            if (this.lm_request['product_id'] === 10) {
                this.method_content = this.method_content.replace('<tem:VehicleType>___product_id_2___</tem:VehicleType>', '<tem:VehicleType>TW</tem:VehicleType>');
            }
            // dynamic Verification & Pdf
            if (this.lm_request['method_type'] === 'Verification' && this.const_policy.pg_status === 'SUCCESS') {
                var res_date = (this.processed_request['___pg_reference_number_2___']).split(" ");
                var res_year = res_date[0].split("-");
                var pg_date = res_year[0] + "/" + res_year[1] + "/" + res_year[2];
                this.prepared_request['pg_reference_number_2'] = pg_date;
                this.processed_request['___pg_reference_number_2___'] = this.prepared_request['pg_reference_number_2'];
                //this.prepared_request['transaction_amount'] = this.processed_request['___final_premium___'];
                //this.processed_request['___transaction_amount___'] = this.processed_request['___final_premium___'];//((config.environment.name === 'Production') ? this.processed_request['___final_premium___'] : '1.0');
                //this.prepared_request['transaction_amount'] = ((config.environment.name === 'Production') ? this.const_policy.transaction_amount : this.proposal_processed_request['___final_premium_verified___']);
                this.prepared_request['transaction_amount'] = this.proposal_processed_request['___final_premium_verified___'];
                this.processed_request['___transaction_amount___'] = this.prepared_request['transaction_amount'];
            }
        }
        // Car
        if (this.lm_request['product_id'] === 1) {
            this.prepared_request['Daily_Cash_Allowance'] = "1";
            this.processed_request['___Daily_Cash_Allowance___'] = "1";
            // for IDV xml
            this.method_content = this.method_content.replace('<tem:VehicleType>___product_id_2___</tem:VehicleType>', '<tem:VehicleType>PCP</tem:VehicleType>');
            if (this.lm_request['vehicle_insurance_type'] === 'new') {
                this.prepared_request['registration_no'] = "NEW";
                this.processed_request['___registration_no___'] = "NEW";
            }

            if (this.lm_request['method_type'] === 'Verification' && this.const_policy.pg_status === 'SUCCESS') {
                var res_date = (this.processed_request['___pg_reference_number_2___']).split(" ");
                var res_year = res_date[0].split("-");
                var pg_date = res_year[0] + "/" + res_year[1] + "/" + res_year[2];
                //this.method_content = this.method_content.replace('___pg_reference_number_2___', pg_date);
                this.prepared_request['pg_reference_number_2'] = pg_date;
                this.processed_request['___pg_reference_number_2___'] = this.prepared_request['pg_reference_number_2'];
                //this.method_content = this.method_content.replace('___transaction_amount___', this.processed_request['___final_premium___']);
                /* this.prepared_request['transaction_amount'] = this.processed_request['___final_premium___'];
                 this.processed_request['___transaction_amount___'] = this.processed_request['___final_premium___'];*/ //((config.environment.name === 'Production') ? this.processed_request['___final_premium___'] : '1.0');
                // this.prepared_request['transaction_amount'] = ((config.environment.name === 'Production') ? this.const_policy.transaction_amount : this.proposal_processed_request['___final_premium_verified___']);
                this.prepared_request['transaction_amount'] = this.proposal_processed_request['___final_premium_verified___'];
                this.processed_request['___transaction_amount___'] = this.prepared_request['transaction_amount'];
            }
        }

        //SAOD Start
        if (isSAOD) {
            /*if (this.lm_request['method_type'] === 'Idv') {
             this.method['Method_Request_File'] = "CholaMS_SAOD_IDV.json";
             if (config.environment.name.toString() === 'Production')
             {
             //this.method['Service_URL'] = "https://www.cholainsurance.com/PortalAPI/Motor/StandaloneOD/PremiumCalculation";
             } else {
             // this.method['Service_URL'] = "https://genconpreprod.cholainsurance.com/PortalAPI/Motor/StandaloneOD/PremiumCalculation";
             this.method['Service_URL'] = "https://developer.cholainsurance.com/endpoint/integration-services-saod/v1.0.0/IDVWrapper";
             }
             var method_content = fs.readFileSync(appRoot + '/resource/request_file/' + this.method.Method_Request_File).toString();
             this.method_content = method_content;
             }*/
            if (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Customer') {
                if (this.method !== null && this.method !== undefined) {
                    //this.method['Method_Request_File'] = "CholaMS_SAOD_Premium.json";
                    if (config.environment.name.toString() === 'Production')
                    {
                        this.method['Service_URL'] = "https://services.cholainsurance.com/endpoint/integration-services-saod/v1.0.0/QuoteWrapper";
                    } else {
                        //this.method['Service_URL'] = "https://genconpreprod.cholainsurance.com/PortalAPI/Motor/StandaloneOD/PremiumCalculation";
                        this.method['Service_URL'] = "https://developer.cholainsurance.com/endpoint/integration-services-saod/v1.0.0/QuoteWrapper";
                    }
                    /*var method_content = fs.readFileSync(appRoot + '/resource/request_file/' + this.method.Method_Request_File).toString();
                     this.method_content = method_content;*/
                }
            }
            if (this.lm_request['method_type'] === 'Proposal') {
                // this.method['Method_Request_File'] = "CholaMS_SAOD_Proposal.json";
                if (config.environment.name.toString() === 'Production')
                {
                    this.method['Service_URL'] = "https://services.cholainsurance.com/endpoint/integration-services-saod/v1.0.0/ProposalWrapper";
                } else {
                    this.method['Service_URL'] = "https://developer.cholainsurance.com/endpoint/integration-services-saod/v1.0.0/ProposalWrapper";
                }
                //var method_content = fs.readFileSync(appRoot + '/resource/request_file/' + this.method.Method_Request_File).toString();
                //this.method_content = method_content;
                if (this.processed_request['___financial_agreement_type___'] === undefined) {
                    this.prepared_request['financial_agreement_type'] = "";
                    this.processed_request['___financial_agreement_type___'] = this.prepared_request['financial_agreement_type'];
                }
            }
            if (this.lm_request['method_type'] === 'Verification') {
                //this.method['Method_Request_File'] = "CholaMS_SAOD_Verification.json";
                if (config.environment.name.toString() === 'Production')
                {
                    this.method['Service_URL'] = "https://services.cholainsurance.com/endpoint/integration-services-saod/v1.0.0/PaymentWrapper";
                } else {
                    // this.method['Service_URL'] = "http://genconpreprod.cholainsurance.com/PortalAPI/Motor/StandaloneOD/Policygeneration";
                    this.method['Service_URL'] = "https://developer.cholainsurance.com/endpoint/integration-services-saod/v1.0.0/PaymentWrapper";
                }
                /*var method_content = fs.readFileSync(appRoot + '/resource/request_file/' + this.method.Method_Request_File).toString();
                 this.method_content = method_content;*/
            }
            if (this.lm_request['method_type'] === 'Pdf') {
                // this.method['Method_Request_File'] = "CholaMS_SAOD_Pdf.json";
                /*if (config.environment.name.toString() === 'Production')
                 {
                 //this.method['Service_URL'] = "https://www.cholainsurance.com/PortalAPI/Motor/StandaloneOD/PolicySchedule";
                 } else {
                 this.method['Service_URL'] = "https://genconpreprod.cholainsurance.com/PortalAPI/Motor/StandaloneOD/PolicySchedule";
                 }
                 var method_content = fs.readFileSync(appRoot + '/resource/request_file/' + this.method.Method_Request_File).toString();
                 this.method_content = method_content;*/
            }
            this.prepared_request['od_policy_start_date'] = this.javaScriptDateToExcelDate(this.processed_request['___pre_policy_start_date___']);
            this.processed_request['___od_policy_start_date___'] = this.prepared_request['od_policy_start_date'];
            this.prepared_request['od_policy_end_date'] = this.javaScriptDateToExcelDate(this.processed_request['___policy_expiry_date___']);
            this.processed_request['___od_policy_end_date___'] = this.prepared_request['od_policy_end_date'];
            if (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Customer') {
                this.prepared_request['tp_policy_start_date'] = this.javaScriptDateToExcelDate(this.processed_request['___pre_policy_start_date___']);
                this.processed_request['___tp_policy_start_date___'] = this.prepared_request['tp_policy_start_date'];
                this.prepared_request['tp_policy_end_date'] = this.javaScriptDateToExcelDate(this.processed_request['___policy_expiry_date___']);
                this.processed_request['___tp_policy_end_date___'] = this.prepared_request['tp_policy_end_date'];
            }
            if (this.lm_request['method_type'] === 'Proposal') {
                this.prepared_request['tp_policy_start_date'] = this.javaScriptDateToExcelDate(this.lm_request['tp_start_date'].replaceAll("-", "/"));
                this.processed_request['___tp_policy_start_date___'] = this.prepared_request['tp_policy_start_date'];
                this.prepared_request['tp_policy_end_date'] = this.javaScriptDateToExcelDate(this.lm_request['tp_end_date'].replaceAll("-", "/"));
                this.processed_request['___tp_policy_end_date___'] = this.prepared_request['tp_policy_end_date'];
                this.prepared_request['tp_policy_number'] = this.lm_request['tp_policy_number'];
                this.processed_request['___tp_policy_number___'] = this.prepared_request['tp_policy_number'];
            }
            /*this.prepared_request['od_year'] = this.processed_request['___pre_policy_start_date___'].split("/")[2];
             this.processed_request['___od_year___'] = this.prepared_request['od_year'];
             this.prepared_request['cng_fuel'] = false;
             this.processed_request['___cng_fuel___'] = this.prepared_request['cng_fuel'];
             this.prepared_request['lpg_fuel'] = false;
             this.processed_request['___lpg_fuel___'] = this.prepared_request['lpg_fuel'];
             if (this.processed_request['___dbmaster_insurer_vehicle_fueltype___'] == "CNG") {
             this.prepared_request['cng_fuel'] = true;
             this.processed_request['___cng_fuel___'] = this.prepared_request['cng_fuel'];
             } else if (this.processed_request['___dbmaster_insurer_vehicle_fueltype___'] == "LPG") {
             this.prepared_request['lpg_fuel'] = true;
             this.processed_request['___lpg_fuel___'] = this.prepared_request['lpg_fuel'];
             }*/
            if (this.lm_request['vehicle_insurance_subtype'] === '1OD_0TP' && this.lm_request['method_type'] === 'Proposal') {
                this.prepared_request['tp_policy_number'] = this.lm_request['tp_policy_number'];
                this.processed_request['___tp_policy_number___'] = this.prepared_request['tp_policy_number'];
                this.prepared_request['tp_start_date'] = this.insurer_dateFormat(this.lm_request['tp_start_date']);
                this.processed_request['___tp_start_date___'] = this.prepared_request['tp_start_date'];
                this.prepared_request['tp_end_date'] = this.insurer_dateFormat(this.lm_request['tp_end_date']);
                this.processed_request['___tp_end_date___'] = this.prepared_request['tp_end_date'];
                this.prepared_request['tp_insurer_code'] = this.insurer_master.tp_insurer.insurer_db_master['PreviousInsurer_Code'];
                this.processed_request['___tp_insurer_code___'] = this.prepared_request['tp_insurer_code'];
                var insurer_adress = this.Master_Details.tp_insurer['PreviousInsurer_City'].toString();
                this.prepared_request['tp_insurer_address'] = insurer_adress;
                this.processed_request['___tp_insurer_address___'] = this.prepared_request['tp_insurer_address'];
            }
        } else {
            this.prepared_request['od_policy_start_date'] = "0";
            this.processed_request['___od_policy_start_date___'] = this.prepared_request['od_policy_start_date'];
            this.prepared_request['od_policy_end_date'] = "0";
            this.processed_request['___od_policy_end_date___'] = this.prepared_request['od_policy_end_date'];
            this.prepared_request['od_policy_expiry_date'] = "0";
            this.processed_request['___od_policy_expiry_date___'] = this.prepared_request['od_policy_expiry_date'];
            if (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Customer') {
                this.prepared_request['tp_policy_start_date'] = "0";
                this.processed_request['___tp_policy_start_date___'] = this.prepared_request['tp_policy_start_date'];
                this.prepared_request['tp_policy_end_date'] = "0";
                this.processed_request['___tp_policy_end_date___'] = this.prepared_request['tp_policy_end_date'];
            }
            if (this.lm_request['method_type'] === 'Proposal') {
                this.prepared_request['tp_policy_start_date'] = "0";
                this.processed_request['___tp_policy_start_date___'] = this.prepared_request['tp_policy_start_date'];
                this.prepared_request['tp_policy_end_date'] = "0";
                this.processed_request['___tp_policy_end_date___'] = this.prepared_request['tp_policy_end_date'];
                this.prepared_request['tp_policy_number'] = "";
                this.processed_request['___tp_policy_number___'] = this.prepared_request['tp_policy_number'];
            }
        }
        //SAOD End
        if (this.processed_request['___is_policy_exist___'] === "") {
            if (this.lm_request['is_policy_exist'] === "no") {
                this.prepared_request['is_policy_exist'] = true;
                this.processed_request['___is_policy_exist___'] = this.prepared_request['is_policy_exist'];
            } else {
                this.prepared_request['is_policy_exist'] = false;
                this.processed_request['___is_policy_exist___'] = this.prepared_request['is_policy_exist'];
            }
        }
        if (this.lm_request['is_breakin'] === "yes") {
            var policystartdate = moment().add(3, 'days').format('DD/MM/YYYY');
            var pol_start_date = policystartdate;
            this.method_content = this.method_content.toString().replace('___policy_start_date___', pol_start_date);
            var policyenddate = moment().add(2, 'days');
            //policyenddate.setDate(policyenddate.getDate() + 2);
            var pol_end_date = moment(policyenddate).add(1, "years").format('DD/MM/YYYY');
            this.method_content = this.method_content.toString().replace('___policy_end_date___', pol_end_date);
            if (this.lm_request['is_policy_exist'] === "no" && this.lm_request['vehicle_insurance_subtype'] !== "0CH_1TP") {
                this.method_content = this.method_content.toString().replace('___pre_policy_start_date___', "31/12/2020");
                this.method_content = this.method_content.toString().replace('___policy_expiry_date___', "01/01/2020");
                //this.method_content = this.method_content.toString().replace('___policy_number___', "87687893334");
            }
            if (this.lm_request['is_policy_exist'] === "no" && this.lm_request['vehicle_insurance_subtype'] === "0CH_1TP") {
                this.method_content = this.method_content.toString().replace('___pre_policy_start_date___', "");
                this.method_content = this.method_content.toString().replace('___policy_expiry_date___', "");
                //this.method_content = this.method_content.toString().replace('___policy_number___', "");
                this.method_content = this.method_content.toString().replace('___vehicle_insurance_subtype___', "");
                this.method_content = this.method_content.toString().replace('___Prev_Insur_Name___', "");
            }
        }
        if (this.processed_request['___is_external_bifuel___'] === "no") {
            this.prepared_request['is_bifuel_external'] = "No";
            this.processed_request['___is_bifuel_external___'] = this.prepared_request['is_bifuel_external'];
        } else {
            this.prepared_request['is_bifuel_external'] = "Yes";
            this.processed_request['___is_bifuel_external___'] = this.prepared_request['is_bifuel_external'];
        }
        if (this.lm_request['product_id'] === 1) {
            if (this.processed_request['___electrical_accessory___'] == "0" || this.lm_request['vehicle_insurance_subtype'] === "0CH_1TP") {
                this.prepared_request['elec_acc_type_1'] = "";
                this.processed_request['___elec_acc_type_1___'] = this.prepared_request['elec_acc_type_1'];

                this.prepared_request['elec_acc_type_2'] = "";
                this.processed_request['___elec_acc_type_2___'] = this.prepared_request['elec_acc_type_2'];

                this.prepared_request['elec_acc_type_3'] = "";
                this.processed_request['___elec_acc_type_3___'] = this.prepared_request['elec_acc_type_3'];

                this.prepared_request['elec_acc_value'] = "";
                this.processed_request['___elec_acc_value___'] = this.prepared_request['elec_acc_value'];
            } else {
                this.prepared_request['elec_acc_type_1'] = "Bluetooth1";
                this.processed_request['___elec_acc_type_1___'] = this.prepared_request['elec_acc_type_1'];

                this.prepared_request['elec_acc_type_2'] = "Bluetooth2";
                this.processed_request['___elec_acc_type_2___'] = this.prepared_request['elec_acc_type_2'];

                this.prepared_request['elec_acc_type_3'] = "Bluetooth3";
                this.processed_request['___elec_acc_type_3___'] = this.prepared_request['elec_acc_type_3'];

                this.prepared_request['elec_acc_value'] = "20000";
                this.processed_request['___elec_acc_value___'] = this.prepared_request['elec_acc_value'];
            }
            if (this.processed_request['___non_electrical_accessory___'] == "0" || this.lm_request['vehicle_insurance_subtype'] === "0CH_1TP") {
                this.prepared_request['non_elec_acc_type_1'] = "";
                this.processed_request['___non_elec_acc_type_1___'] = this.prepared_request['non_elec_acc_type_1'];
            } else {
                this.prepared_request['non_elec_acc_type_1'] = "Test";
                this.processed_request['___non_elec_acc_type_1___'] = this.prepared_request['non_elec_acc_type_1'];
            }
        }
        if (this.lm_request['product_id'] === 10 && (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Customer' || this.lm_request['method_type'] === 'Proposal')) {
            if (this.lm_request['vehicle_insurance_subtype'] === "0CH_1TP") {
                this.method_content = this.method_content.replace('<!-- satp node start -->', '');
                this.method_content = this.method_content.replace('<!-- satp node end -->', '');

                var txt_replace2 = this.find_text_btw_key(this.method_content, '<!-- comprehensive node start -->', '<!-- comprehensive node end -->', true);
                if (txt_replace2) {
                    this.method_content = this.method_content.replace(txt_replace2, '');
                }
                var txt_replace3 = this.find_text_btw_key(this.method_content, '<!-- comp node start -->', '<!-- comp node end -->', true);
                if (txt_replace3) {
                    this.method_content = this.method_content.replace(txt_replace3, '');
                }
            } else if (this.lm_request['vehicle_insurance_subtype'] === "1OD_0TP") {
                this.method_content = this.method_content.replace('<!-- comprehensive node start -->', '');
                this.method_content = this.method_content.replace('<!-- comprehensive node end -->', '');

                var txt_replace3 = this.find_text_btw_key(this.method_content, '<!-- comp node start -->', '<!-- comp node end -->', true);
                if (txt_replace3) {
                    this.method_content = this.method_content.replace(txt_replace3, '');
                }
                var txt_replace2 = this.find_text_btw_key(this.method_content, '<!-- satp node start -->', '<!-- satp node end -->', true);
                if (txt_replace2) {
                    this.method_content = this.method_content.replace(txt_replace2, '');
                }
            } else {
                this.method_content = this.method_content.replace('<!-- comprehensive node start -->', '');
                this.method_content = this.method_content.replace('<!-- comprehensive node end -->', '');
                this.method_content = this.method_content.replace('<!-- comp node start -->', '');
                this.method_content = this.method_content.replace('<!-- comp node end -->', '');

                var txt_replace2 = this.find_text_btw_key(this.method_content, '<!-- satp node start -->', '<!-- satp node end -->', true);
                if (txt_replace2) {
                    this.method_content = this.method_content.replace(txt_replace2, '');
                }
            }
        }
        /*if (this.processed_request['___addon_zero_dep_cover___'] === "true") {
         this.prepared_request['addon_zero_dep_cover'] = "Yes";
         this.processed_request['___addon_zero_dep_cover___'] = this.prepared_request['addon_zero_dep_cover'];
         } else {
         this.prepared_request['addon_zero_dep_cover'] = "No";
         this.processed_request['___addon_zero_dep_cover___'] = this.prepared_request['addon_zero_dep_cover'];
         }*/
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_product_field_process_pre', ex);
    }
};
CholaMSMotor.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
    if (specific_insurer_object.method.Method_Type === 'Customer') {
        obj_response_handler = this.customer_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Pdf') {
        obj_response_handler = this.pdf_response_handler(objResponseJson);
    }
    return obj_response_handler;
};
CholaMSMotor.prototype.insurer_product_field_process_post = function () {
    console.log("in insurer_product_field_process_post");
};
CholaMSMotor.prototype.insurer_product_api_post = function () {
    console.log("in insurer_product_api_post");
};
CholaMSMotor.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    try {
        var objInsurerProduct = this;
        var service_method_url = '';
        var Client = require('node-rest-client').Client;
        var client = new Client();
        console.log(docLog.Insurer_Request);
        var service_method_urlT = '';
        var Token = "";
        let obj_cred = {
            'grant_type': 'password',
            'username': "ptrn_lanmarkP",
            'password': "pt1L@Nm#krn"
        };
        var argsT = {
            data: obj_cred,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "application/json"
            }
        };
        if (config.environment.name === 'Production') {
            argsT.headers.Authorization = 'Basic ' + new Buffer("OeShRu4AJFl0l1hB0wMMGd0s274a" + ':' + "vSksOzpnmbx28s5lKiMuRdCBtL8a").toString('base64');
            service_method_urlT = 'https://services.cholainsurance.com/endpoint/token';
        } else {
            argsT.headers.Authorization = 'Basic ' + new Buffer("QUP4sfatsjTRE9w_NVRBkRU3knwa" + ':' + "JO__N6SqbxwwAbQPWwk051kwUAwa").toString('base64');
            service_method_urlT = 'https://developer.cholainsurance.com/endpoint/token';
        }

        client.post(service_method_urlT, argsT, function (dataT) {
            console.log(dataT);
            Token = dataT["access_token"];
            console.log(docLog.Insurer_Request);
            if (specific_insurer_object.method.Method_Calling_Type === 'POST') {
                var args = {
                    data: docLog.Insurer_Request,
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                };
                args.headers.Authorization = 'Bearer Token ' + new Buffer(Token);
                if (objInsurerProduct.lm_request['product_id'] === 10 && objInsurerProduct.lm_request['vehicle_insurance_subtype'] === "0CH_1TP") {
                    if (objInsurerProduct.lm_request['method_type'] === 'Premium' || objInsurerProduct.lm_request['method_type'] === "Customer") {
                        if (config.environment.name === 'Production') {
                            specific_insurer_object.method_file_url = "https://services.cholainsurance.com/endpoint/integration-services-liability/v1.0.0/QuoteWrapper";
                        } else {
                            specific_insurer_object.method_file_url = "https://developer.cholainsurance.com/endpoint/integration-services-liability/v1.0.0/QuoteWrapper";
                        }
                    }
                    if (objInsurerProduct.lm_request['method_type'] === 'Proposal') {
                        if (config.environment.name === 'Production') {
                            specific_insurer_object.method_file_url = "https://services.cholainsurance.com/endpoint/integration-services-liability/v1.0.0/ProposalWrapper";
                        } else {
                            specific_insurer_object.method_file_url = "https://developer.cholainsurance.com/endpoint/integration-services-liability/v1.0.0/ProposalWrapper";
                        }
                    }
                    if (objInsurerProduct.lm_request['method_type'] === 'Verification') {
                        if (config.environment.name === 'Production') {
                            specific_insurer_object.method_file_url = "https://services.cholainsurance.com/endpoint/integration-services-liability/v1.0.0/PaymentWrapper";
                        } else {
                            specific_insurer_object.method_file_url = "https://developer.cholainsurance.com/endpoint/integration-services-liability/v1.0.0/PaymentWrapper";
                        }
                    }
                }
                if (objInsurerProduct.lm_request['product_id'] === 1 && objInsurerProduct.lm_request['vehicle_insurance_subtype'] === "0CH_1TP") {
                    if (objInsurerProduct.lm_request['method_type'] === 'Premium' || objInsurerProduct.lm_request['method_type'] === "Customer") {
                        if (config.environment.name === 'Production') {
                            specific_insurer_object.method_file_url = "https://services.cholainsurance.com/endpoint/integration-services-liability/v1.0.0/QuoteWrapper";
                        } else {
                            specific_insurer_object.method_file_url = "https://developer.cholainsurance.com/endpoint/integration-services-liability/v1.0.0/QuoteWrapper";
                        }
                    }
                    if (objInsurerProduct.lm_request['method_type'] === 'Proposal') {
                        if (config.environment.name === 'Production') {
                            specific_insurer_object.method_file_url = "https://services.cholainsurance.com/endpoint/integration-services-liability/v1.0.0/ProposalWrapper";
                        } else {
                            specific_insurer_object.method_file_url = "https://developer.cholainsurance.com/endpoint/integration-services-liability/v1.0.0/ProposalWrapper";
                        }
                    }
                    if (objInsurerProduct.lm_request['method_type'] === 'Verification') {
                        if (config.environment.name === 'Production') {
                            specific_insurer_object.method_file_url = "https://services.cholainsurance.com/endpoint/integration-services-liability/v1.0.0/PaymentWrapper";
                        } else {
                            specific_insurer_object.method_file_url = "https://developer.cholainsurance.com/endpoint/integration-services-liability/v1.0.0/PaymentWrapper";
                        }
                    }
                }
                if ((objInsurerProduct.lm_request['product_id'] === 1 || objInsurerProduct.lm_request['product_id'] === 10) && objInsurerProduct.lm_request['vehicle_insurance_subtype'] === "1OD_0TP" && specific_insurer_object.method['Method_Type'] === 'Idv') {
                    if (specific_insurer_object.method['Method_Type'] === 'Idv') {
                        if (config.environment.name === 'Production') {
                            specific_insurer_object.method_file_url = "https://services.cholainsurance.com/endpoint/integration-services-saod/v1.0.0/IDVWrapper";
                        } else {
                            specific_insurer_object.method_file_url = "https://developer.cholainsurance.com/endpoint/integration-services-saod/v1.0.0/IDVWrapper";
                        }
                        args.data = "";
                        args.data = fs.readFileSync(appRoot + '/resource/request_file/CholaMS_SAOD_IDV.json').toString();
                        for (var k in objInsurerProduct.processed_request) {
                            args.data = (args.data).replaceAll(k, objInsurerProduct.processed_request[k]);
                        }
                        console.log(args.data);
                        docLog.Insurer_Request = args.data;
                    }
                }
                if (false && objInsurerProduct.lm_request['method_type'] === 'Verification' && (objInsurerProduct.const_payment_response.hasOwnProperty('pg_data') && objInsurerProduct.const_payment_response['pg_data'].hasOwnProperty('pg_type') && objInsurerProduct.const_payment_response['pg_data']['pg_type'] === "rzrpay") || (objInsurerProduct.proposal_processed_request.hasOwnProperty('___pay_from___') && objInsurerProduct.proposal_processed_request['___pay_from___'] === "wallet")) {
                    try {
                        let pay_id = "";
                        if (objInsurerProduct.proposal_processed_request.hasOwnProperty('___pay_from___') && objInsurerProduct.proposal_processed_request['___pay_from___'] === "wallet") {
                            pay_id = objInsurerProduct.const_payment_response.pg_post.txnid;
                        } else {
                            pay_id = objInsurerProduct.const_payment_response.pg_get.PayId;
                        }
                        let order_verify_url = "https://api.razorpay.com/v1/payments/" + pay_id;
                        var rzp_username = config.razor_pay.rzp_icici.username;
                        var rzp_secret_key = config.razor_pay.rzp_icici.password;
                        var rzp_args = {
                            headers: {
                                "Accept": "application/json",
                                'Authorization': 'Basic ' + new Buffer(rzp_username + ':' + rzp_secret_key).toString('base64')
                            }
                        };
                        client.get(order_verify_url, rzp_args, function (rzp_data, response) {
                            if (rzp_data && rzp_data.hasOwnProperty('status') && rzp_data['status'] === "captured") {
                                service_method_url = specific_insurer_object.method_file_url;
                                console.log(args);
                                client.post(service_method_url, args, function (data, response) {
                                    console.log(data);
                                    console.log(response);
                                    var objResponseFull = {
                                        'err': null,
                                        'result': data,
                                        'raw': data,
                                        'soapHeader': null,
                                        'objResponseJson': data
                                    };
                                    console.log(data);
                                    var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                                    if (specific_insurer_object.method.Method_Type === 'Idv') {
                                        objInsurerProduct.insurer_vehicle_idv_handler(serviceBreakup, objProduct, Insurer_Object, specific_insurer_object);
                                    }
                                });
                            } else {
                                console.error('chola Razorpay payment verification response', JSON.stringify(rzp_data));
                                var objResponseFull = {
                                    'err': null,
                                    'result': null,
                                    'raw': JSON.stringify(rzp_data),
                                    'soapHeader': null,
                                    'objResponseJson': rzp_data
                                };
                                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                            }
                        });
                    } catch (ex) {
                        console.error('Razorpay Service Call Error: ', this.constructor.name, ex);
                    }
                } else {
                    service_method_url = specific_insurer_object.method_file_url;
                    console.log(args);
                    client.post(service_method_url, args, function (data, response) {
                        console.log(data);
                        console.log(response);
                        var objResponseFull = {
                            'err': null,
                            'result': data,
                            'raw': data,
                            'soapHeader': null,
                            'objResponseJson': data
                        };
                        console.log(data);
                        var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                        if (specific_insurer_object.method.Method_Type === 'Idv') {
                            objInsurerProduct.insurer_vehicle_idv_handler(serviceBreakup, objProduct, Insurer_Object, specific_insurer_object);
                        }
                    });
                }
            }
            if (specific_insurer_object.method.Method_Type === 'Pdf') {
                if (specific_insurer_object.method.Method_Calling_Type === 'GET') {
                    var args1 = {
                        headers: {
                            "Authorization": "Bearer " + Token
                        }
                    };
                    var body = JSON.parse(docLog.Insurer_Request);
                    //body['policy_id'] = 'P000000117642';
                    var qs_url;
                    if (objInsurerProduct.lm_request['vehicle_insurance_subtype'] === "1CH_0TP" || objInsurerProduct.lm_request['vehicle_insurance_type'] === "new") {
                        if (config.environment.name === 'Production') {
                            qs_url = 'https://services.cholainsurance.com/endpoint/integration-services-comprehensive/v1.0.0/DownloadPolicyURL?policy_id=' + body['policy_id'] + '&user_code=landmark';
                        } else {
                            qs_url = 'https://developer.cholainsurance.com/endpoint/integration-services-comprehensive/v1.0.0/DownloadPolicyURL?policy_id=' + body['policy_id'] + '&user_code=landmark';
                        }
                    }
                    if (objInsurerProduct.lm_request['vehicle_insurance_subtype'] === "1OD_0TP") {
                        if (objInsurerProduct.lm_request['product_id'] == "1") {
                            if (config.environment.name === 'Production') {
                                qs_url = 'https://services.cholainsurance.com/endpoint/integration-services-comprehensive/v1.0.0/DownloadPolicyURL?policy_id=' + body['policy_id'] + '&user_code=landmark';
                            } else {
                                qs_url = 'https://developer.cholainsurance.com/endpoint/integration-services-comprehensive/v1.0.0/DownloadPolicyURL?policy_id=' + body['policy_id'] + '&user_code=landmark';
                            }
                        }
                        if (objInsurerProduct.lm_request['product_id'] == "10") {
                            if (config.environment.name === 'Production') {
                                qs_url = 'https://services.cholainsurance.com/endpoint/integration-services-saod/v1.0.0/DownloadPolicyURL?policy_id=' + body['policy_id'] + '&user_code=landmark';
                            } else {
                                qs_url = 'https://developer.cholainsurance.com/endpoint/integration-services-saod/v1.0.0/DownloadPolicyURL?policy_id=' + body['policy_id'] + '&user_code=landmark';
                            }
                        }
                    }
                    if (objInsurerProduct.lm_request['vehicle_insurance_subtype'] === "0CH_1TP") {
                        if (config.environment.name === 'Production') {
                            qs_url = 'https://services.cholainsurance.com/endpoint/integration-services-liability/v1.0.0/DownloadPolicyURL?policy_id=' + body['policy_id'] + '&user_code=landmark';
                        } else {
                            qs_url = 'https://developer.cholainsurance.com/endpoint/integration-services-liability/v1.0.0/DownloadPolicyURL?policy_id=' + body['policy_id'] + '&user_code=landmark';
                        }
                    }
                    if (config.environment.name === 'Production') {
                        var args = {
                            policy_url: qs_url,
                            policy_id: body['policy_id']
                        };
                        var obj = {
                            data: args,
                            headers: {
                                "Content-Type": "application/json"
                            }
                        };
                        service_method_pdf_url = "http://qa-horizon.policyboss.com:3000/postservicecall/chola_pdf_initiate_service";
                        client.post(service_method_pdf_url, obj, function (response) {
                            console.log("chola pdf response " + response);
                            var objResponseFull = {
                                'err': null,
                                'result': response,
                                'raw': response,
                                'soapHeader': null,
                                'objResponseJson': response
                            };
                            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                            if (specific_insurer_object.method.Method_Type === 'Idv') {
                                objInsurerProduct.insurer_vehicle_idv_handler(serviceBreakup, objProduct, Insurer_Object, specific_insurer_object);
                            }
                        });
                    } else {
                        try {
                            const fetch = require('node-fetch');
                            var myHeaders1 = new fetch.Headers();
                            myHeaders1.append("Authorization", "Bearer " + Token);

                            var requestOptions = {
                                method: 'GET',
                                headers: myHeaders1,
                                redirect: 'follow'
                            };
                            var pdf_response, pdf_error, pdf_success;
                            fetch(qs_url, requestOptions)
                                    .then(response => response.text())
                                    .then(result => pdf_success = result)
                                    .catch(error => pdf_error = error);
                            sleep(2000);
                            if (pdf_success !== null && pdf_success !== "") {
                                pdf_response = pdf_success;
                            } else {
                                pdf_response = pdf_error;
                            }
                            var objResponseFull = {
                                'err': null,
                                'result': pdf_response,
                                'raw': pdf_response,
                                'soapHeader': null,
                                'objResponseJson': pdf_response
                            };
                            console.log(pdf_response);
                            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                            if (specific_insurer_object.method.Method_Type === 'Idv') {
                                objInsurerProduct.insurer_vehicle_idv_handler(serviceBreakup, objProduct, Insurer_Object, specific_insurer_object);
                            }
                        } catch (ex1) {
                            console.error('Exception', this.constructor.name, 'service_call', ex1);
                        }
                    }
                }
            }
        });
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e.stack);
    }
};
CholaMSMotor.prototype.idv_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'idv_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    //check error start
    try {
        if (objResponseJson.hasOwnProperty('Message')) {
            if (objResponseJson['Message'] !== "Success") {
                Error_Msg = objResponseJson['Message'];
            }
        } else {
            Error_Msg = 'IDV Error';
        }
        if (Error_Msg === 'NO_ERR') {
            var Idv_Breakup = this.get_const_idv_breakup();
            Idv_Breakup["Idv_Normal"] = parseInt(objResponseJson.Data['idv_2']);
            Idv_Breakup["Idv_Min"] = parseInt(objResponseJson.Data['idv_1']);
            Idv_Breakup["Idv_Max"] = parseInt(objResponseJson.Data['idv_4']);
            //Idv_Breakup["Exshowroom"] = parseInt(objResponseJson['ExshowroomPrice']);

            /*if (this.lm_request['vehicle_insurance_type'] === 'new' && this.lm_request['product_id'] === 10) {
             // IDV should not be change
             Idv_Breakup["Idv_Normal"] = parseInt(objResponseJson['idv_amount']);
             Idv_Breakup["Idv_Min"] = parseInt(objResponseJson['idv_amount']);
             Idv_Breakup["Idv_Max"] = parseInt(objResponseJson['idv_amount']);
             Idv_Breakup["Exshowroom"] = parseInt(objResponseJson['ExshowroomPrice']);
             } else {
             Idv_Breakup["Idv_Normal"] = parseInt(objResponseJson.Data['idv_4']);
             Idv_Breakup["Idv_Min"] = parseInt(objResponseJson.Data['idv_1']);
             Idv_Breakup["Idv_Max"] = parseInt(objResponseJson.Data['idv_4']);
             //Idv_Breakup["Exshowroom"] = parseInt(objResponseJson['ExshowroomPrice']);
             }*/
            objServiceHandler.Premium_Breakup = Idv_Breakup;
            objServiceHandler.Insurer_Transaction_Identifier = objResponseJson.Data['idv_4'];
        }

        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'idv_response_handler', objServiceHandler);
        return objServiceHandler;
    } catch (e) {
        objServiceHandler.Error_Msg = JSON.stringify(e.stack);
        console.error('Exception', this.constructor.name, 'idv_response_handler', objServiceHandler);
        return objServiceHandler;
    }
};
CholaMSMotor.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson.hasOwnProperty('Status')) {
            if (objResponseJson['Status'] !== "success") {
                if (objResponseJson['Message'] !== "Success") {
                    Error_Msg = objResponseJson['Message'];
                } else {
                    Error_Msg = objResponseJson['Message'];
                }
            }
        } else {
            Error_Msg = objResponseJson['Message'];
        }
        var Age_Yr = this.addon_vehicle_age_year();
        if (Age_Yr > 10) {
            Error_Msg = "Insurer not allow vehicle greater than 10 yrs";
        }
        if (Error_Msg === 'NO_ERR') {
            if (objResponseJson.hasOwnProperty('WaiverofReductioninDepreciation')) {
                if (objResponseJson['FullDepreciationWaiver'] > 0) {
                    if (objResponseJson['WaiverofReductioninDepreciation'] > 0) {
                        objResponseJson['FullDepreciationWaiver'] = objResponseJson['FullDepreciationWaiver'] + objResponseJson['WaiverofReductioninDepreciation'];
                    }
                } else {
                    objResponseJson['FullDepreciationWaiver'] = objResponseJson['WaiverofReductioninDepreciation'];
                }
            }
            var objPremiumService = objResponseJson;
            var tpBasic = 0;
            var odBasic = 0;
            console.log('objPremiumService' + objPremiumService);
            if (objPremiumService['Status'] == "success") {
                var premium_breakup = this.const_premium_breakup;
                for (var key in this.premium_breakup_schema) {
                    if (typeof this.premium_breakup_schema[key] === 'object') {
                        var group_final = 0, group_final_key = '';
                        var od_final = 0, tp_final = 0, addon_final = 0;
                        for (var sub_key in this.premium_breakup_schema[key]) {
                            if (this.lm_request['product_id'] === 1 || this.lm_request['product_id'] === 10) {
                                tpBasic = objPremiumService.Data["Basic_Third_Party_Premium"];
                                odBasic = objPremiumService.Data["Own_Damage"];
                                if (key === "own_damage") {
                                    if (sub_key === "od_basic") {
                                        if (objPremiumService.Data.hasOwnProperty('Electrical_Accessory_Prem') && objPremiumService.Data["Electrical_Accessory_Prem"] != 0) {
                                            odBasic -= objPremiumService.Data["Electrical_Accessory_Prem"];
                                        }
                                        if (objPremiumService.Data.hasOwnProperty('Non_Electrical_Accessory_Prem') && objPremiumService.Data["Non_Electrical_Accessory_Prem"] != 0) {
                                            odBasic -= objPremiumService.Data["Non_Electrical_Accessory_Prem"];
                                        }
                                        premium_breakup[key][sub_key] = odBasic;
                                        od_final += odBasic;
                                    } else if (sub_key === "od_elect_access") {
                                        premium_breakup[key][sub_key] = objPremiumService.Data["Electrical_Accessory_Prem"];
                                        od_final += objPremiumService.Data["Electrical_Accessory_Prem"];
                                    } else if (sub_key === "od_non_elect_access") {
                                        premium_breakup[key][sub_key] = objPremiumService.Data["Non_Electrical_Accessory_Prem"];
                                        od_final += objPremiumService.Data["Non_Electrical_Accessory_Prem"];
                                    } else if (sub_key === "od_cng_lpg") {
                                        premium_breakup[key][sub_key] = objPremiumService.Data["CNG_LPG_Own_Damage"];
                                        od_final += objPremiumService.Data["CNG_LPG_Own_Damage"];
                                    } else if (sub_key === "od_disc_ncb") {
                                        premium_breakup[key][sub_key] = objPremiumService.Data["No_Claim_Bonus"];
                                        od_final -= objPremiumService.Data["No_Claim_Bonus"];
                                    } else if (sub_key === "od_disc") {
                                        //premium_breakup[key][sub_key] = objPremiumService.Data["DTD_Discounts"];
                                        od_final -= (objPremiumService.Data["DTD_Discounts"] + objPremiumService.Data["GST_Discounts"]);
                                        premium_breakup[key][sub_key] = (objPremiumService.Data["DTD_Discounts"] + objPremiumService.Data["GST_Discounts"]);
                                        this.premium_breakup_schema[key][sub_key] = (objPremiumService.Data["DTD_Discounts"] + objPremiumService.Data["GST_Discounts"]);
                                    } else if (sub_key === "od_loading") {
                                        premium_breakup[key][sub_key] = objPremiumService.Data["DTD_Loading"];
                                        od_final += objPremiumService.Data["DTD_Loading"];
                                    } /*else if (sub_key === "od_disc_vol_deduct") {
                                     premium_breakup[key][sub_key] = 0;
                                     } else if (sub_key === "od_disc_anti_theft") {
                                     premium_breakup[key][sub_key] = 0;
                                     } else if (sub_key === "od_disc_aai") {
                                     premium_breakup[key][sub_key] = 0;
                                     }*/
                                }
                                if (key === "liability") {
                                    if (sub_key === "tp_basic") {
                                        premium_breakup[key][sub_key] = tpBasic;
                                        tp_final += tpBasic;
                                    } else if (sub_key === "tp_cover_owner_driver_pa") {
                                        premium_breakup[key][sub_key] = objPremiumService.Data["Personal_Accident"];
                                        tp_final += objPremiumService.Data["Personal_Accident"];
                                    } else if (sub_key === "tp_cover_unnamed_passenger_pa") {
                                        premium_breakup[key][sub_key] = objPremiumService.Data["Unnamed_Passenger_Cover"];
                                        tp_final += objPremiumService.Data["Unnamed_Passenger_Cover"];
                                    } /*else if (sub_key === "tp_cover_paid_driver_pa") {
                                        premium_breakup[key][sub_key] = objPremiumService.Data["CNG_LPG_TP"];
                                        tp_final += objPremiumService.Data["CNG_LPG_TP"];
                                     }*/ else if (sub_key === "tp_cover_paid_driver_ll") {
                                        premium_breakup[key][sub_key] = objPremiumService.Data["Legal_Liability_to_paid_driver"];
                                        tp_final += objPremiumService.Data["Legal_Liability_to_paid_driver"];
                                    } else if (sub_key === "tp_cng_lpg") {
                                        premium_breakup[key][sub_key] = objPremiumService.Data["CNG_LPG_TP"];
                                        tp_final += objPremiumService.Data["CNG_LPG_TP"];
                                    } else if (sub_key === "tp_cover_tppd") {
                                        premium_breakup[key][sub_key] = objPremiumService.Data["TPPD_Discount_Premium"];
                                        tp_final -= objPremiumService.Data["TPPD_Discount_Premium"];
                                    } /*else if (sub_key === "tp_cover_named_passenger_pa") {
                                     premium_breakup[key][sub_key] = 0;
                                     }  */
                                }
                                if (key === "addon") {
                                    if (sub_key === "addon_zero_dep_cover") {
                                        premium_breakup[key][sub_key] = objPremiumService.Data["Zero_Depreciation"];
                                        addon_final += objPremiumService.Data["Zero_Depreciation"];
                                    } else if (sub_key === "addon_road_assist_cover") {
                                        premium_breakup[key][sub_key] = objPremiumService.Data["RSA_Cover"];
                                        addon_final += objPremiumService.Data["RSA_Cover"];
                                    } else if (sub_key === "addon_ncb_protection_cover") {
                                        premium_breakup[key][sub_key] = objPremiumService.Data["NCB_Protection_Cover"];
                                        addon_final += objPremiumService.Data["NCB_Protection_Cover"];
                                    } else if (sub_key === "addon_hydrostatic_lock_cover") {
                                        premium_breakup[key][sub_key] = objPremiumService.Data["Hydrostatic_Lock_Cover"];
                                        addon_final += objPremiumService.Data["Hydrostatic_Lock_Cover"];
                                    } else if (sub_key === "addon_invoice_price_cover") {
                                        premium_breakup[key][sub_key] = objPremiumService.Data["Final_Return_To_Invoice_Cover_Premium"];
                                        addon_final += objPremiumService.Data["Final_Return_To_Invoice_Cover_Premium"];
                                    } else if (sub_key === "addon_key_lock_cover") {
                                        premium_breakup[key][sub_key] = objPremiumService.Data["Key_Replacement_Cover"];
                                        addon_final += objPremiumService.Data["Key_Replacement_Cover"];
                                    } else if (sub_key === "addon_consumable_cover") {
                                        premium_breakup[key][sub_key] = objPremiumService.Data["Consumables_Cover"];
                                        addon_final += objPremiumService.Data["Consumables_Cover"];
                                    } else if (sub_key === "addon_daily_allowance_cover") {
                                        premium_breakup[key][sub_key] = objPremiumService.Data["Final_Daily_Cash_Allowance_Cover_Premium"];
                                        addon_final += objPremiumService.Data["Final_Daily_Cash_Allowance_Cover_Premium"];
                                    } else if (sub_key === "addon_personal_belonging_loss_cover") {
                                        premium_breakup[key][sub_key] = objPremiumService.Data["Personal_Belonging_Cover"];
                                        addon_final += objPremiumService.Data["Personal_Belonging_Cover"];
                                    } else if (sub_key === "addon_losstime_protection_cover") {
                                        premium_breakup[key][sub_key] = 0;
                                    } else if (sub_key === "addon_engine_protector_cover") {
                                        premium_breakup[key][sub_key] = 0;
                                    } else if(sub_key === "addon_tyre_coverage_cover"){
                                        premium_breakup[key][sub_key] = 0;
                                    } else if(sub_key === "addon_emergency_transport_hotel"){
                                        premium_breakup[key][sub_key] = 0;
                                    }
                                }
                            } else {
                                var premium_key = this.premium_breakup_schema[key][sub_key];
                                var premium_val = 0;
                                if (premium_key && objPremiumService.hasOwnProperty(premium_key)) {
                                    premium_val = objPremiumService[premium_key];
                                }
                                premium_val = isNaN(premium_val) ? 0 : premium_val;
                                premium_val = (premium_val < 0) ? 0 - premium_val : premium_val;
                                if (sub_key === 'od_disc') {
                                    if ((objResponseJson.hasOwnProperty('Experiencebased_DiscountAmount')) && (objResponseJson['Experiencebased_DiscountAmount'] > 0)) {
                                        premium_val = isNaN(objResponseJson['Experiencebased_DiscountAmount']) ? 0 : (Math.round(objResponseJson['Experiencebased_DiscountAmount']));
                                    }
                                }
                                premium_breakup[key][sub_key] = Math.round(premium_val);
                                if (sub_key.indexOf('final_') > -1) {
                                    group_final_key = sub_key;
                                } else if (sub_key.indexOf('_disc') > -1) {
                                    group_final -= Math.round(premium_val);
                                } else if (sub_key.indexOf('_tppd') > -1) {
                                    group_final -= Math.round(premium_val);
                                } else {
                                    group_final += Math.round(premium_val);
                                }
                            }
                        }
                        if (this.lm_request['product_id'] === 1 || this.lm_request['product_id'] === 10) {
                            premium_breakup["net_premium"] = objPremiumService.Data["Net_Premium"];
                            premium_breakup["service_tax"] = objPremiumService.Data["GST"];
                            premium_breakup["final_premium"] = objPremiumService.Data["Total_Premium"];
                            if (key === "addon") {
                                premium_breakup[key]["addon_final_premium"] = addon_final;
                            }
                            if (key === "liability") {
                                premium_breakup[key]["tp_final_premium"] = tp_final;
                            }
                            if (key === "own_damage") {
                                premium_breakup[key]["od_final_premium"] = od_final;
                            }
                        } else {
                            premium_breakup[key][group_final_key] = group_final;
                        }
                    }
                }

                objServiceHandler.Premium_Breakup = premium_breakup;
                //objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['UniqueTransactionID'];
                objServiceHandler.Insurer_Transaction_Identifier = objPremiumService.Data["quote_id"] + "_" + objPremiumService.Data["proposal_id"];
            } else {
                Error_Msg = objPremiumService['ErrorMessage'];
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
CholaMSMotor.prototype.insurer_vehicle_idv = function (objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback) {
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
        for (var addon_key in this.const_addon_master) {
            this.method_content = this.method_content.replace('___' + addon_key + '___', 'false');
        }
        this.insurer_product_field_process_pre();
        var request_replaced_data = this.method_content.replaceJson(this.processed_request);
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
CholaMSMotor.prototype.customer_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'customer_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Customer': null
    };
    try {
        if (objResponseJson.hasOwnProperty('Status')) {
            if (objResponseJson['Status'] !== "success") {
                if (objResponseJson['Message'] !== "Success") {
                    Error_Msg = objResponseJson['Message'];
                } else {
                    Error_Msg = objResponseJson['Message'];
                }
            }
        } else {
            Error_Msg = objResponseJson['Message'];
        }
        if (Error_Msg === 'NO_ERR') {
            var Customer = {
                'final_premium_verified': parseInt(objResponseJson.Data["Total_Premium"]),
                'insurer_customer_identifier': objResponseJson.Data["quote_id"] + "_" + objResponseJson.Data["proposal_id"]
            };
            objServiceHandler.Customer = Customer;
            //objServiceHandler.Insurer_Transaction_Identifier = objResponseJson.Data["quote_id"] + "_" + objResponseJson.Data["proposal_id"];
        }
        objServiceHandler.Error_Msg = Error_Msg;
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'customer_response_handler', objServiceHandler);
    }
    console.log('Finish', this.constructor.name, 'customer_response_handler', objServiceHandler);
    return objServiceHandler;
};

CholaMSMotor.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    try {
        if (objResponseJson.hasOwnProperty('Status')) {
            if (objResponseJson['Status'] !== "success") {
                Error_Msg = objResponseJson['Message'];
            }
        } else {
            Error_Msg = objResponseJson['Message'];
        }
        if (Error_Msg === 'NO_ERR') {
            var objPremiumService = objResponseJson;
            console.log('objPremiumService' + objPremiumService);
            var objLMPremium = objPremiumService;
            if (objLMPremium['Status'] === "success") {
                var final_premium = objLMPremium.Data['Total_Premium'] - 0;
                // not for production 
                if (config.environment.name !== 'Production') {
                    this.prepared_request['final_premium'] = final_premium;
                    this.processed_request['___final_premium___'] = final_premium;
                }
                var objPremiumVerification = this.premium_verification(this.lm_request['final_premium'], this.processed_request['___final_premium_verified___'], 25, 10);
                var checksum_key = ((config.environment.name === 'Production') ? 'B8hKm6C4Sxw2' : 'Gnknq3AaLRZV');
                var random_str = 'PB-' + this.lm_request['crn'].toString() + '-' + this.randomString(5) + '-' + this.lm_request['proposal_id'];
                var Received_Premium = objLMPremium.Data['Total_Premium'];
                if (objPremiumVerification.Status) {
                    if (Received_Premium === this.processed_request['___final_premium_verified___']) {
                        if (this.lm_request.hasOwnProperty('pay_from') && this.lm_request['pay_from'] === 'wallet') {
                            var pg_data = {
                                'ss_id': this.lm_request['ss_id'],
                                'crn': this.lm_request['crn'],
                                'User_Data_Id': this.lm_request['udid'],
                                'product_id': this.lm_request['product_id'],
                                'premium_amount': this.lm_request['final_premium'],
                                'customer_name': this.lm_request['first_name'] + " " + this.lm_request['last_name'],
                                'txnid': this.lm_request['udid'] + ',' + this.lm_request['crn'] + ',' + this.lm_request['proposal_id'] + ',' + this.lm_request['insurer_id'],
                                'pg_type': "wallet"
                            };
                            objServiceHandler.Payment.pg_data = pg_data;
                            objServiceHandler.Payment.pg_redirect_mode = 'POST';
                            objServiceHandler.Payment.pg_url = ((config.environment.name === 'Production') ? "https://www.policyboss.com/wallet-confirm" : "http://qa.policyboss.com/TransactionDetail_Form/index.html") + "?udid=" + this.lm_request['udid'];
                            objServiceHandler.Insurer_Transaction_Identifier = objPremiumService.Data['payment_id'];
                        } else {
//                            var pg_args = {
//                                'MerchantID': ((config.environment.name === 'Production') ? 'CHOLABKAGR' : 'CHOLATEST'),
//                                'CustomerID': random_str.toString().toUpperCase(),
//                                'NA': 'NA',
//                                'TxnAmount': ((config.environment.name === 'Production') ? Received_Premium : '1.00'),
//                                'NA1': 'NA',
//                                'NA2': 'NA',
//                                'NA3': 'NA',
//                                'CurrencyType': 'INR',
//                                'NA4': 'NA',
//                                'TypeField1': 'R',
//                                'SecurityID': ((config.environment.name === 'Production') ? 'CHOLAPOLBS-NA' : 'cholatest'), //cholabussn  
//                                'NA5': 'NA',
//                                'NA6': 'NA',
//                                'TypeField2': 'F',
//                                'Txtadditionalinfo1': 'NA',
//                                'Txtadditionalinfo2': 'PBLM',
//                                'Txtadditionalinfo3': 'NA',
//                                'Txtadditionalinfo4': 'NA',
//                                'Txtadditionalinfo5': 'NA',
//                                'Txtadditionalinfo6': 'NA',
//                                'Txtadditionalinfo7': 'NA',
//                                'RU': this.const_payment.pg_ack_url
//                                        //'RU': 'http://localhost:50115/Payment/Transaction_Status'
//                            };
//                            var arrPgVal = [];
//                            for (var k in pg_args) {
//                                arrPgVal.push(pg_args[k]);
//                            }
//
//                            var msg = arrPgVal.join('|');
//                            var checksummsg = msg;
//                            var checksumvalue = this.encrypt_to_hmac_256(checksummsg, checksum_key);
//                            var pg_data = {
//                                'msg': msg + '|' + checksumvalue
//                            };
//                            console.log(pg_data);
//                            objServiceHandler.Payment.pg_data = pg_data;
//                            objServiceHandler.Payment.pg_redirect_mode = 'POST';
//                            objServiceHandler.Insurer_Transaction_Identifier = objPremiumService.Data['payment_id'];
                            if (this.lm_request && this.lm_request.hasOwnProperty('pg_order_response') && this.lm_request['pg_order_response']) {
                                var merchant_key = config.razor_pay.rzp_chola.username;
                                var razorpay_response = this.lm_request['pg_order_response'];
                                var full_name = this.lm_request['middle_name'] === "" ? (this.lm_request['first_name'] + " " + this.lm_request['last_name']) : (this.lm_request['first_name'] + " " + this.lm_request['middle_name'] + " " + this.lm_request['last_name']);
                                var pg_data = {
                                    'key': merchant_key,
                                    'full_name': full_name,
                                    'return_url': this.const_payment.pg_ack_url,
                                    'phone': this.lm_request['mobile'],
                                    'orderId': razorpay_response["id"],
                                    'txnId': this.lm_request['udid'] + ',' + this.lm_request['crn'] + ',' + this.lm_request['proposal_id'] + ',' + this.lm_request['insurer_id'],
                                    'quoteId': objPremiumService.Data['payment_id'],
                                    'amount': Math.round(this.lm_request['final_premium']),
                                    'email': this.lm_request['email'],
                                    'img_url': 'https://origin-cdnh.policyboss.com/website/Images/PolicyBoss-Logo.jpg',
                                    'pg_type': "rzrpay",
                                    'transfer_id': razorpay_response.hasOwnProperty('transfers') && razorpay_response['transfers'][0].hasOwnProperty('status') && razorpay_response['transfers'][0]['status'] === "created" ? razorpay_response['transfers'][0]['id'] : ""
                                };
                                objServiceHandler.Payment.pg_data = pg_data;
                                objServiceHandler.Payment.pg_redirect_mode = 'POST';
                                objServiceHandler.Payment.pg_url = "";
                                objServiceHandler.Insurer_Transaction_Identifier = razorpay_response["id"];
                            } else {
                                Error_Msg = "LM_PG_ORDER_NOT_CREATED";
                            }
                        }
                        if (objResponseJson.hasOwnProperty('WaiverofReductioninDepreciation')) {
                            if (objResponseJson['FullDepreciationWaiver'] > 0) {
                                if (objResponseJson['WaiverofReductioninDepreciation'] > 0) {
                                    objResponseJson['FullDepreciationWaiver'] = objResponseJson['FullDepreciationWaiver'] + objResponseJson['WaiverofReductioninDepreciation'];
                                }
                            } else {
                                objResponseJson['FullDepreciationWaiver'] = objResponseJson['WaiverofReductioninDepreciation'];
                            }
                        }
                    } else {
                        Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
                    }
                } else {
                    Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
                }
            } else {
                Error_Msg = objLMPremium['ErrorMessage'];
            }
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.error('Exception', this.constructor.name, 'proposal_response_handler', objServiceHandler);
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
CholaMSMotor.prototype.pg_response_handler = function () {
    try {
        var objInsurerProduct = this;
                if (objInsurerProduct.proposal_processed_request.hasOwnProperty('___pay_from___') && objInsurerProduct.proposal_processed_request['___pay_from___'] === 'wallet') {
            var output = objInsurerProduct.const_payment_response.pg_post;
//            var rzp_proposal_id = objInsurerProduct.const_payment_response.pg_data.hasOwnProperty('txnid') ? objInsurerProduct.const_payment_response.pg_data.txnid.split(',')[2] : "";
            if (output['status'] === 'Success') {
                this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.transaction_status = 'SUCCESS';
                this.const_policy.transaction_amount = output['amount'];
                this.const_policy.transaction_id = output['txnid'];
//                this.const_policy.pg_reference_number_1 = 'PB-' + objInsurerProduct.lm_request['crn'].toString() + '-' + objInsurerProduct.randomString(5) + '-' + rzp_proposal_id;
                this.const_policy.pg_reference_number_1 = output['transfer_id'];
                this.const_policy['pg_reference_number_2'] = moment(objInsurerProduct.proposal_processed_request['___current_date___'], 'DD/MM/YYYY').format('DD-MM-YYYY');
                this.const_policy.pg_reference_number_3 = "";
            } else {
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
            }
        } else if (objInsurerProduct.const_payment_response.pg_data.hasOwnProperty('pg_type') && objInsurerProduct.const_payment_response.pg_data.pg_type === "rzrpay") {
            var output = objInsurerProduct.const_payment_response.pg_get;
//            var rzp_proposal_id = objInsurerProduct.const_payment_response.pg_data.hasOwnProperty('txnId') ? objInsurerProduct.const_payment_response.pg_data.txnId.split(',')[2] : "";
            if (output['Status'] === 'Success') {
                this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.transaction_status = 'SUCCESS';
                this.const_policy.transaction_amount = objInsurerProduct.const_payment_response.pg_data.amount;
                this.const_policy.transaction_id = output['PayId'];
//                this.const_policy.pg_reference_number_1 = 'PB-' + objInsurerProduct.lm_request['crn'].toString() + '-' + objInsurerProduct.randomString(5) + '-' + rzp_proposal_id;
                this.const_policy.pg_reference_number_1 = objInsurerProduct.const_payment_response.pg_data.transfer_id;
                this.const_policy['pg_reference_number_2'] = moment(objInsurerProduct.proposal_processed_request['___current_date___'], 'DD/MM/YYYY').format('DD-MM-YYYY');
                this.const_policy.pg_reference_number_3 = "";
                if (output.hasOwnProperty('Signature') && output.Signature) {
                    var secret_key = config.razor_pay.rzp_chola.password;
                    var gen_signature = this.encrypt_to_hmac_256(output['OrderId'] + '|' + output['PayId'], secret_key).toLowerCase();
                    if (gen_signature === output['Signature']) {//Razorpay verification
                        this.const_policy.pg_status = 'SUCCESS';
                        this.const_policy.transaction_status = 'SUCCESS';
                    } else {
                        this.const_policy.pg_status = 'FAIL';
                        this.const_policy.transaction_status = 'FAIL';
                    }
                } else {
                    this.const_policy.pg_status = 'SUCCESS';
                    this.const_policy.transaction_status = 'SUCCESS';
                }
            } else {
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
            }
        } else {
            var msg = objInsurerProduct.lm_request.pg_post['msg'];
            var str = msg.split('|');
            this.const_policy.transaction_id = str[2];
            if (msg.indexOf('|0300|') > -1) {
                this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.transaction_amount = parseInt(str[4]);
                this.const_policy.pg_reference_number_1 = str[1];
                this.const_policy.pg_reference_number_2 = str[13];
                this.const_policy.pg_reference_number_3 = "";
            } else {
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
            }
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', e.stack);
    }
};
CholaMSMotor.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var objInsurerProduct = this;
    try {
        if (objInsurerProduct.const_policy.pg_status === 'FAIL' || objInsurerProduct.const_policy.pg_status === null) {
            //Error_Msg = "Payment Fail";  // we never send payment fail in error msg
            this.const_policy.transaction_status = 'FAIL';
        } else {
            if (objResponseJson.hasOwnProperty('Status')) {
                if (objResponseJson['Status'] !== 'success') {
                    Error_Msg = objResponseJson['Message'];
                }
                if (objResponseJson.Data['policy_id'] === 0 || objResponseJson.Data['policy_id'] === '') {
                    Error_Msg = objResponseJson['Message'];
                }
                if (Error_Msg === 'NO_ERR') {
                    if (objResponseJson.Data.hasOwnProperty('tp_policy_no') && objResponseJson.Data['tp_policy_no'] !== '') {
                        objInsurerProduct.const_policy.policy_number = objResponseJson.Data['tp_policy_no'];
                        objInsurerProduct.const_policy.transaction_status = 'SUCCESS';
                        objInsurerProduct.const_policy.policy_code = ((objResponseJson.Data['policy_id'] === undefined) ? "" : objResponseJson.Data['policy_id']);
                        objInsurerProduct.const_policy.pg_reference_number_3 = objResponseJson.Data['policy_id'];
                        var product_name = 'CAR';
                        if (objInsurerProduct.lm_request['product_id'] === 10) {
                            product_name = 'TW';
                        }

                        //var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.processed_request['___pg_reference_number_1___'] + '.pdf';
                        var pdf_file_name = objInsurerProduct.constructor.name + '_' + product_name + '_' + objResponseJson.Data['tp_policy_no'].replaceAll('/', '') + '.pdf';
                        var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                        var pdf_web_path = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                        objInsurerProduct.const_policy.policy_url = pdf_web_path;
                        var Client = require('node-rest-client').Client;
                        var client = new Client();
                        var args = {
                            data: {
                                "search_reference_number": objInsurerProduct.lm_request['search_reference_number'],
                                "api_reference_number": objInsurerProduct.lm_request['api_reference_number'],
                                "policy_number": objResponseJson.Data['tp_policy_no'],
                                "policy_code": objResponseJson.Data['policy_id'],
                                "proposal_number": objInsurerProduct.prepared_request['dbmaster_pb_insurer_transaction_identifier'].split('-')[0],
                                "proposal_date": objInsurerProduct.processed_request['___pg_reference_number_2___'].split(' ')[0],
                                "transaction_pg": objInsurerProduct.const_policy.transaction_id,
                                'client_key': objInsurerProduct.lm_request['client_key'],
                                'secret_key': objInsurerProduct.lm_request['secret_key'],
                                'insurer_id': objInsurerProduct.lm_request['insurer_id'],
                                'email': objInsurerProduct.processed_request['___email___'],
                                'mobile': objInsurerProduct.processed_request['___mobile___'],
                                'method_type': 'Pdf',
                                'execution_async': 'no'
                            },
                            headers: {
                                "Content-Type": "application/json",
                                'client_key': objInsurerProduct.lm_request['client_key'],
                                'secret_key': objInsurerProduct.lm_request['secret_key']
                            }
                        };
                        objInsurerProduct.pdf_call(config.environment.weburl + '/quote/pdf_initiate', args, pdf_sys_loc);
                    } else {
                        objInsurerProduct.const_policy.transaction_status = 'PAYPASS';
                    }
                } else {
                    objInsurerProduct.const_policy.transaction_status = 'PAYPASS';
                }
                objServiceHandler.Insurer_Transaction_Identifier = objResponseJson.Data['policy_id'];
            }
        }
        objServiceHandler.Policy = objInsurerProduct.const_policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', objInsurerProduct.constructor.name, 'verification_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objInsurerProduct.const_policy.transaction_status = 'PAYPASS';
        objServiceHandler.Policy = objInsurerProduct.const_policy;
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', objInsurerProduct.constructor.name, 'verification_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
CholaMSMotor.prototype.pdf_call = function (url, args, pdf_sys_loc) {
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
CholaMSMotor.prototype.pdf_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'pdf_response_handler', objResponseJson);

    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var insurer_pdf_url = null;
    var Error_Msg = 'NO_ERR';
    try {
        //objResponseJson = JSON.parse(objResponseJson);
        if (objResponseJson && JSON.parse(objResponseJson).hasOwnProperty('Status')) {
            if (JSON.parse(objResponseJson)['Status'] !== "success") {
                Error_Msg = objResponseJson['Data'];
            }
        } else {
            Error_Msg = objResponseJson;
        }
        var policy = {
            'policy_url': null,
            'policy_number': this.lm_request['policy_number'],
            'pdf_status': null
        };
        if (Error_Msg === 'NO_ERR') {
            objResponseJson = JSON.parse(objResponseJson);
            var product_name = 'CAR';
            if (this.lm_request['product_id'] === 10) {
                product_name = 'TW';
            }
            var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.lm_request['policy_number'].replaceAll('/', '') + '.pdf';
            var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
            var pdf_web_path_horizon = config.environment.weburl + "/pdf/" + pdf_file_name;
            var pdf_sys_loc_portal = config.pb_config.pdf_system_loc + pdf_file_name;
            var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name; // for qa
            //var pdf_web_path_portal = config.environment.weburl + config.pb_config.pdf_web_loc + pdf_file_name; // for local

            var crn = parseInt(this.lm_request["crn"]);
            var Product_Id = parseInt(this.lm_request['product_id']);
            var Request_Unique_Id = this.lm_request["search_reference_number"];

            const axios = require('axios');

            axios.get(objResponseJson.Data, {responseType: "stream"})
                    .then(response => {
                        response.data.pipe(fs.createWriteStream(pdf_sys_loc_horizon));
                    })
                    .catch(error => {
                        console.log(error);
                    });
            try {
                var MongoClient = require('mongodb').MongoClient;
                MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                    if (err) {
                        throw err;
                    } else {
                        var User_Data = db.collection('user_datas');
                        User_Data.update({PB_CRN: crn, Product_Id: Product_Id, Request_Unique_Id: Request_Unique_Id}, {$set: {"Transaction_Data.policy_url": pdf_web_path_portal}}, function (err, objproduct_share) {
                            if (err) {
                                throw err;
                            } else {
                                console.log(objproduct_share);
                            }
                        });
                    }
                });
                policy.policy_url = pdf_web_path_portal;
                policy.pdf_status = 'SUCCESS';
                this.const_policy.insurer_policy_url = pdf_web_path_portal;
                this.const_policy.policy_url = pdf_web_path_portal;
            } catch (ep) {
                console.error('ExceptionPDF', this.constructor.name, 'pdf_response_handler', ep);
            }
            try {
                /*if (insurer_pdf_url.indexOf('https:') > -1) {
                 http = require('https');
                 }
                 
                 var file_horizon = fs.createWriteStream(pdf_sys_loc_horizon);
                 //var file_portal = fs.createWriteStream(pdf_sys_loc_portal);
                 var request = http.get(insurer_pdf_url, function (response) {
                 response.pipe(file_horizon);
                 //response.pipe(file_portal);
                 });*/
            } catch (ep) {
                console.error('ExceptionPDF', this.constructor.name, 'pdf_response_handler', ep);
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
        console.error('Exception', this.constructor.name, 'pdf_response_handler', ex.stack);
        return objServiceHandler;
    }
};
CholaMSMotor.prototype.encrypt = function (plainText, workingKey) {
    var encoded = '';
    try {
        var m = crypto.createHash('md5');
        m.update(workingKey);
        var key = m.digest();
        var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
        var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
        encoded = cipher.update(plainText, 'utf8', 'hex');
        encoded += cipher.final('hex');
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'encrypt', ex);
        return encoded;
    }
    return encoded;
};
CholaMSMotor.prototype.decrypt = function (encText, workingKey) {
    var decoded = '';
    try {
        var m = crypto.createHash('md5');
        m.update(workingKey)
        var key = m.digest('binary');
        var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
        var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        decoded = decipher.update(encText, 'hex', 'utf8');
        decoded += decipher.final('utf8');
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'decrypt', ex);
        return decoded;
    }
    return decoded;
};
CholaMSMotor.prototype.vehicle_age_year = function () {
    var age_in_year = 0;
    try {
        var moment = require('moment');
        console.log('Start', this.constructor.name, 'vehicle_age_year');
        var vehicle_manf_date = this.lm_request['vehicle_manf_date'];
        var policy_start_date = this.policy_start_date();
        age_in_year = moment(policy_start_date).diff(vehicle_manf_date, 'years');
        age_in_year = age_in_year + 1;
        console.log('Finish', this.constructor.name, 'vehicle_age_year', age_in_year);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'vehicle_age_year', ex);
        return age_in_year;
    }
    return age_in_year;
};
CholaMSMotor.prototype.lv_quote_no = function () {
    console.log("in lv_quote_no");
    try {
        return this.create_guid('', 'numeric', 7);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'lv_quote_no', ex);
        return 0;
    }
};
CholaMSMotor.prototype.premium_breakup_schema = {
    "own_damage": {
        "od_basic": 'Own_Damage',
        "od_elect_access": 'Electrical_Accessory_Prem',
        "od_non_elect_access": 'Non_Electrical_Accessory_Prem',
        "od_cng_lpg": 'CNG_LPG_Own_Damage',
        "od_disc_ncb": 'No_Claim_Bonus',
        "od_disc_vol_deduct": '',
        "od_disc_anti_theft": '',
        "od_disc_aai": 'AutomobileDiscountPremium',
        "od_loading": 'DTD_Loading',
        "od_disc": 'DTD_Discounts', //Discount
        "od_final_premium": ''
    },
    "liability": {
        "tp_basic": 'Basic_Third_Party_Premium',
        "tp_cover_owner_driver_pa": 'Personal_Accident',
        "tp_cover_unnamed_passenger_pa": 'Unnamed_Passenger_Cover',
        "tp_cover_named_passenger_pa": '',
        "tp_cover_paid_driver_pa": 'PaidDriver',
        "tp_cover_paid_driver_ll": 'Legal_Liability_to_paid_driver',
        "tp_cng_lpg": 'CNG_LPG_TP',
        "tp_cover_tppd": "TPPD_Discount_Premium",
        "tp_final_premium": ''
    },
    "addon": {
        "addon_zero_dep_cover": 'Zero_Depreciation',
        "addon_road_assist_cover": 'RSA_Cover',
        "addon_ncb_protection_cover": 'NCB_Protection_Cover',
        "addon_engine_protector_cover": null,
        "addon_invoice_price_cover": 'Final_Return_To_Invoice_Cover_Premium',
        "addon_key_lock_cover": 'Key_Replacement_Cover',
        "addon_consumable_cover": 'Consumables_Cover',
        "addon_daily_allowance_cover": 'Final_Daily_Cash_Allowance_Cover_Premium',
        "addon_windshield_cover": null,
        "addon_passenger_assistance_cover": null,
        "addon_tyre_coverage_cover": null,
        "addon_emergency_transport_hotel": null,
        "addon_personal_belonging_loss_cover": "Personal_Belonging_Cover",
        "addon_inconvenience_allowance_cover": '', //ConveyanceAllowanceCover
        "addon_medical_expense_cover": '',
        "addon_hospital_cash_cover": null,
        "addon_ambulance_charge_cover": null,
        "addon_rodent_bite_cover": null,
        "addon_losstime_protection_cover": null,
        "addon_hydrostatic_lock_cover": 'Hydrostatic_Lock_Cover',
        "addon_mandatory_deduction_protect": '',
        "addon_final_premium": 0
    },
    "net_premium": 'Net_Premium',
    "service_tax": 'GST',
    "final_premium": 'Total_Premium'
};
CholaMSMotor.prototype.vehicle_age_month = function () {
    var num_months = 0;
    try {
        var vehicle_registration_date = this.lm_request['vehicle_registration_date'];
        var policy_start_date = this.prepared_request['policy_start_date'];
        var date1 = new Date(policy_start_date);
        var date2 = new Date(vehicle_registration_date); //mm/dd/yyyy
        var diff_date = date1 - date2;
        var num_years = diff_date / 31536000000;
        num_months = (diff_date % 31536000000) / 2628000000;
        var num_days = ((diff_date % 31536000000) % 2628000000) / 86400000;
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'vehicle_age_month', ex);
        return num_months;
    }
    return num_months;
};
CholaMSMotor.prototype.addon_vehicle_age_year = function () {
    var age_in_year = 0;
    try {
        var moment = require('moment');
        var vehicle_manf_date = moment(this.lm_request['vehicle_registration_date']);
        var policy_start_date = moment(this.policy_start_date());
        var diffDuration = moment.duration(policy_start_date.diff(vehicle_manf_date));
        var age_in_year1 = diffDuration.years();
        var age_in_month = diffDuration.months();
        var age_in_day = diffDuration.days();
        age_in_year = age_in_year1.toString() + '.' + age_in_month.toString() + age_in_day.toString();
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'addon_vehicle_age_year', ex);
        return age_in_year;
    }
    return age_in_year;
};
CholaMSMotor.prototype.insurer_dateFormat = function (date_txt) {
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
CholaMSMotor.prototype.javaScriptDateToExcelDate = function (inDate) {
    console.log(inDate);
    if (inDate) {
        var date = inDate;
        date = date.split("/");
        date = date[1] + "/" + date[0] + "/" + date[2];
        var t = new Date(date);

        inDate = new Date(
                t.getFullYear(),
                t.getMonth(),
                t.getDate());
        let ret = 25569.0 + (inDate.getTime() - inDate.getTimezoneOffset() * 60 * 1000) / (1000 * 60 * 60 * 24);

        console.log(+ret.toString().substr(0, 20));
        return +ret.toString().substr(0, 20);
    } else {
        return "";
    }
};

CholaMSMotor.prototype.excelDateToJavaScriptDate = function (apiDate) {
    if (apiDate) {
        let utc_days = Math.floor(apiDate - 25569);
        let utc_value = utc_days * 86400;
        let date_info = new Date(utc_value * 1000);
        let temp_date = new Date(
                Date.UTC(
                        date_info.getFullYear(),
                        date_info.getMonth(),
                        date_info.getDate(),
                        date_info.getHours(),
                        date_info.getMinutes(),
                        date_info.getSeconds()
                        )
                );
        return temp_date;
    } else {
        return "";
    }
};
module.exports = CholaMSMotor;