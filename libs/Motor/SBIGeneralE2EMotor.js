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
var sleep = require('system-sleep');
function SBIGeneralE2EMotor() {

}
util.inherits(SBIGeneralE2EMotor, Motor);
SBIGeneralE2EMotor.prototype.lm_request_single = {};
SBIGeneralE2EMotor.prototype.insurer_integration = {};
SBIGeneralE2EMotor.prototype.insurer_addon_list = [];
SBIGeneralE2EMotor.prototype.insurer = {};
SBIGeneralE2EMotor.prototype.pdf_attempt = 0;
SBIGeneralE2EMotor.prototype.insurer_date_format = 'DD/MM/yyyy';
SBIGeneralE2EMotor.prototype.insurer_product_api_pre = function () {
};
SBIGeneralE2EMotor.prototype.insurer_product_field_process_pre = function () {
    try {
        if (this.lm_request['product_id'] === 1 || this.lm_request['product_id'] === 10) {

            if (this.lm_request['method_type'] === 'Proposal' && this.lm_request.hasOwnProperty('pay_from')) {
                this.prepared_request['pay_from'] = "wallet";
                this.processed_request['___pay_from___'] = this.prepared_request['pay_from'];
            }

            this.prepared_request['timestamp'] = this.timestamp();
            this.processed_request['___timestamp___'] = this.prepared_request['timestamp'];
            this.prepared_request['transactionTimestamp'] = this.current_date_time();
            this.processed_request['___transactionTimestamp___'] = this.prepared_request['transactionTimestamp'];
            if (this.lm_request['product_id'] === 1) {
                if (this.lm_request['method_type'] === 'Proposal') {
                    this.prepared_request['quotation_no'] = this.processed_request['___insurer_customer_identifier___'].split("-")[1];
                    this.processed_request['___quotation_no___'] = this.prepared_request['quotation_no'];
                    this.method_content = this.method_content.replace('<!--proposal node-->', '"QuotationNo" : "' + this.processed_request['___insurer_customer_identifier___'].split("-")[1] + '",');
                } else if (this.lm_request['method_type'] === 'Customer') {
                    this.method_content = this.method_content.replace('<!--proposal node-->', '');
                }
            } else if (this.lm_request['product_id'] === 10) {
                if (this.lm_request['method_type'] === 'Proposal') {
                    this.method_content = this.method_content.replace('<!--proposal node-->', '');
                }
            }
            var date = new Date();
            /*var transaction_Date = moment(date).format("DD-MMM-YYYY");
             this.prepared_request['transaction_date'] = transaction_Date;
             this.processed_request['___transaction_date___'] = this.prepared_request['transaction_date'];*/
            var currentDate = moment(date).format('YYYY-MM-DD');
            this.prepared_request['proposal_date'] = currentDate;
            this.processed_request['___proposal_date___'] = this.prepared_request['proposal_date'];
            var quote_valid_date = moment(currentDate).add(30, 'd');
            this.prepared_request['quote_valid_date'] = quote_valid_date.format('YYYY-MM-DD');
            this.processed_request['___quote_valid_date___'] = this.prepared_request['quote_valid_date'];
            var effective_date, expiry_date;
            if (this.lm_request['vehicle_insurance_subtype'] === '0CH_3TP') {
                effective_date = this.processed_request['___policy_start_date___'].split("/");
                expiry_date = this.processed_request['___policy_end_date_extended___'].split("/");
            } else {
                effective_date = this.processed_request['___policy_start_date___'].split("/");
                expiry_date = this.processed_request['___policy_end_date___'].split("/");
            }
            if (effective_date !== undefined && expiry_date !== undefined) {
                this.prepared_request['effective_start_date'] = this.lm_request['vehicle_insurance_type'] === 'new' ? effective_date[2] + "-" + effective_date[1] + "-" + effective_date[0] + "T" + this.current_time() : effective_date[2] + "-" + effective_date[1] + "-" + effective_date[0] + "T00:00:00";
                this.processed_request['___effective_start_date___'] = this.prepared_request['effective_start_date'];
                this.prepared_request['expiry_date'] = expiry_date[2] + "-" + expiry_date[1] + "-" + expiry_date[0];
                this.processed_request['___expiry_date___'] = this.prepared_request['expiry_date'];
            }
            if (this.processed_request['___birth_date___'] !== "") {
                var dob = this.processed_request['___birth_date___'].split("/");
                this.prepared_request['dob'] = dob[2] + "-" + dob[1] + "-" + dob[0];
                this.processed_request['___dob___'] = this.prepared_request['dob'];
            }
            if (this.lm_request['vehicle_insurance_type'] === 'new' || this.lm_request['is_policy_exist'] === "no") {
                this.prepared_request['pre_policy_expiry_date'] = '';
                this.processed_request['___pre_policy_expiry_date___'] = this.prepared_request['pre_policy_expiry_date'];
            } else {
                var pre_policy_exp = this.prepared_request['policy_expiry_date'];
                this.prepared_request['pre_policy_expiry_date'] = pre_policy_exp + "T23:59:59";
                this.processed_request['___pre_policy_expiry_date___'] = this.prepared_request['pre_policy_expiry_date'];
            }
            console.log("value ========= " + this.processed_request['___pre_policy_start_date___']);
            console.log("prepared_request value ========= " + this.prepared_request['pre_policy_start_date']);
            if (this.lm_request['vehicle_insurance_type'] === 'renew' || this.prepared_request['pre_policy_start_date'] !== "") {
                var pre_policy_start = this.prepared_request['pre_policy_start_date'];
                this.prepared_request['prev_policy_start_date'] = pre_policy_start + "T00:00:00";
                this.processed_request['___prev_policy_start_date___'] = this.prepared_request['prev_policy_start_date'];
            } else {
                this.prepared_request['prev_policy_start_date'] = '';
                this.processed_request['___prev_policy_start_date___'] = this.prepared_request['prev_policy_start_date'];
            }
            this.prepared_request['previous_insurer_id'] = this.insurer_master.prev_insurer.insurer_db_master.PreviousInsurer_Code;
            this.processed_request['___previous_insurer_id___'] = this.prepared_request['previous_insurer_id'];
            if ((this.lm_request['method_type'] === 'Proposal' || this.lm_request['method_type'] === "Customer") && this.lm_request['vehicle_color'] !== null && this.lm_request['vehicle_color'] !== "" && this.lm_request['vehicle_color'] !== undefined) {
                var ColorOfVehicle = {
                    "BLACK": 1,
                    "BLUE": 2,
                    "YELLOW": 3,
                    "IVORY": 4,
                    "RED": 5,
                    "WHITE": 6,
                    "GREEN": 7,
                    "PURPLE": 8,
                    "VIOLET": 9,
                    "MAROON": 10,
                    "SILVER": 11,
                    "GOLD": 12,
                    "BEING": 13,
                    "ORANGE": 14,
                    "STILL GREY": 15
                };
                if (ColorOfVehicle[this.lm_request['vehicle_color']] !== undefined) {
                    this.prepared_request['vehicleColor'] = ColorOfVehicle[this.lm_request['vehicle_color']];
                    this.processed_request['___vehicleColor___'] = this.prepared_request['vehicleColor'];
                } else {
                    this.prepared_request['vehicleColor'] = 6;
                    this.processed_request['___vehicleColor___'] = this.prepared_request['vehicleColor'];
                }
            }
            if (this.lm_request['vehicle_insurance_subtype'] !== "1OD_0TP") {
                var only_satp, tp_expiry_date, satp_exp_date;
                if (['0CH_1TP', '0CH_3TP', '0CH_5TP'].indexOf(this.lm_request['vehicle_insurance_subtype']) > -1) {
                    only_satp = "";
                } else {
                    only_satp = ",";
                }
                if (['1CH_2TP', '1CH_4TP', '0CH_5TP'].indexOf(this.lm_request['vehicle_insurance_subtype']) > -1) {
                    let cpa_exp_date = this.processed_request['___policy_end_date_extended___'].split("/");
                    tp_expiry_date = cpa_exp_date[2] + "-" + cpa_exp_date[1] + "-" + cpa_exp_date[0];
                } else {
                    tp_expiry_date = this.processed_request['___expiry_date___'];
                }
                if (['0CH_3TP'].indexOf(this.lm_request['vehicle_insurance_subtype']) > -1) {
                    var exp_date = this.processed_request['___policy_end_date___'].split("/");
                    satp_exp_date = exp_date[2] + "-" + exp_date[1] + "-" + exp_date[0];
                } else if (['0CH_5TP', '1CH_4TP'].indexOf(this.lm_request['vehicle_insurance_subtype']) > -1) {
                    if(this.lm_request['cpa_tenure'] == 1){
                        let satp_date = this.processed_request['___policy_end_date___'].split("/");
                        satp_exp_date = satp_date[2] + "-" + satp_date[1] + "-" + satp_date[0];
                    }else{
                        satp_exp_date = tp_expiry_date;
                    }
                } else {
                    satp_exp_date = this.processed_request['___expiry_date___'];
                }
                let pa_od_block = '{"EffectiveDate": "___effective_start_date___","PolicyBenefitList": [<!-- pa_paid_driver --><!-- pa_unnamed_block --><!-- pa_owner_driver_block -->],"OwnerHavingValidDrivingLicence": "1","OwnerHavingValidPACover": "1","ExpiryDate": "' + satp_exp_date + 'T23:59:59","ProductElementCode": "C101066"},';
                if (this.lm_request['product_id'] === 10 && this.processed_request['___Plan_Name___'] === "All-Addon") {
                    only_satp = "";
                }
                if ((parseInt(this.lm_request['pa_paid_driver_si'])) === 0 && this.processed_request['___pa_unnamed_passenger_si___'] === "" && this.lm_request['is_pa_od'] === "no") {
                    var tp_block = only_satp + '{"EffectiveDate": "___effective_start_date___","PolicyBenefitList": [<!-- llpd_block --><!-- tppd_block -->{"SumInsured": 0,"ProductElementCode": "B00008"}],"ExpiryDate": "' + tp_expiry_date + 'T23:59:59","ProductElementCode": "C101065"}';
                } else {
                    var tp_block = only_satp + pa_od_block + '{"EffectiveDate": "___effective_start_date___","PolicyBenefitList": [<!-- llpd_block --><!-- tppd_block -->{"SumInsured": 0,"ProductElementCode": "B00008"}],"ExpiryDate": "' + tp_expiry_date + 'T23:59:59","ProductElementCode": "C101065"}';
                }
                this.method_content = this.method_content.replace('<!-- TP_Block -->', tp_block);
            } else {
                this.method_content = this.method_content.replace('<!-- TP_Block -->', '');
            }
            if (['0CH_1TP', '0CH_3TP', '0CH_5TP'].indexOf(this.lm_request['vehicle_insurance_subtype']) > -1) {
                this.method_content = this.method_content.replace('<!-- OD_Block -->', '');
                this.method_content = this.method_content.replace('<!-- Basic_RSA_Block -->', '');
            } else {
                var no_comma = "";
                if (this.processed_request['___addon_road_assist_cover___'] === "no") {
                    this.method_content = this.method_content.replace('<!-- Basic_RSA_Block -->', '');
                } else {
                    if (this.lm_request['product_id'] === 1) {
                        no_comma = ",";
                        var basic_RSA = '{"EffectiveDate": "___effective_start_date___","ExpiryDate": "___expiry_date___T23:59:59","ProductElementCode": "C101069","PolicyBenefitList": [<!-- RSA_block -->]}';
                        this.method_content = this.method_content.replace('<!-- Basic_RSA_Block -->', basic_RSA);
                    } else {
                        this.method_content = this.method_content.replace('<!-- Basic_RSA_Block -->', '');
                    }
                }
                if (this.lm_request['product_id'] === 10) {
                    if (this.processed_request['___Plan_Name___'] === "All-Addon") {
                        no_comma = ",";
                    } else if ((this.lm_request['method_type'] === 'Customer' || this.lm_request['method_type'] === 'Proposal')) {
                        if (this.processed_request['___addon_ncb_protection_cover___'] == "yes" || this.processed_request['___addon_zero_dep_cover___'] == "yes" || this.processed_request['___addon_consumable_cover___'] == "yes") {
                            no_comma = ",";
                        }
                    }
                }
                var OD_block = '{"ProductElementCode": "C101064","EffectiveDate": "___effective_start_date___","PolicyBenefitList": [<!-- non_electrical_accessory block --><!-- electrical_accessory block -->{"ProductElementCode": "B00002"}],"ExpiryDate": "___expiry_date___T23:59:59"}' + no_comma;
                this.method_content = this.method_content.replace('<!-- OD_Block -->', OD_block);
            }
            if (this.processed_request['___nominee_birth_date___'] !== null || this.processed_request['___nominee_birth_date___'] !== "" || this.processed_request['___nominee_birth_date___'] !== undefined) {
                var nominee_dob = this.processed_request['___nominee_birth_date___'].split("/");
                this.prepared_request['nominee_dob'] = nominee_dob[2] + "-" + nominee_dob[1] + "-" + nominee_dob[0];
                this.processed_request['___nominee_dob___'] = this.prepared_request['nominee_dob'];
            }
            if (this.processed_request['___dbmaster_previousinsurer_code___'] !== null && this.processed_request['___dbmaster_previousinsurer_code___'] !== undefined && this.processed_request['___dbmaster_previousinsurer_code___'] !== "") {
                this.prepared_request['Prev_Insur_Name'] = this.processed_request['___dbmaster_previousinsurer_code___'];
                this.processed_request['___Prev_Insur_Name___'] = this.prepared_request['Prev_Insur_Name'];
            } else {
                this.prepared_request['Prev_Insur_Name'] = "";
                this.processed_request['___Prev_Insur_Name___'] = this.prepared_request['Prev_Insur_Name'];
            }
            if ((parseInt(this.lm_request['pa_paid_driver_si'])) > 0) {
                this.prepared_request['is_pa_paid_driver'] = 1;
                this.processed_request['___is_pa_paid_driver___'] = this.prepared_request['is_pa_paid_driver'];
                var pa_paid_block = '{"SumInsuredPerUnit": ' + this.lm_request["pa_paid_driver_si"] + ',"ProductElementCode": "B00027"},';
                this.method_content = this.method_content.replace('<!-- pa_paid_driver -->', pa_paid_block);
            } else {
                this.prepared_request['is_pa_paid_driver'] = 0;
                this.processed_request['___is_pa_paid_driver___'] = this.prepared_request['is_pa_paid_driver'];
                this.method_content = this.method_content.replace('<!-- pa_paid_driver -->', '');
            }
            if (this.processed_request['___registration_no___'] !== "") {
                this.prepared_request['registration_no'] = this.processed_request['___registration_no___'].replaceAll("-", " ");
                this.processed_request['___registration_no___'] = this.prepared_request['registration_no'];
            }
            if (this.processed_request['___vehicle_registration_date___'] !== "") {
                var regDate = this.processed_request['___vehicle_registration_date___'].split("/");
                this.prepared_request['vehicle_registration_dt'] = regDate[2] + "-" + regDate[1] + "-" + regDate[0];
                this.processed_request['___vehicle_registration_dt___'] = this.prepared_request['vehicle_registration_dt'];
            }
            if (this.processed_request['___voluntary_deductible___'] === "") {
                this.processed_request['___voluntary_deductible___'] = 0;
            }
            if (this.processed_request['___non_electrical_accessory___'] == 0) {
                this.method_content = this.method_content.replace('<!-- non_electrical_accessory block -->', '');
            } else {
                var non_electrical_block = '{"SumInsured":' + this.processed_request["___non_electrical_accessory___"] + ',"Description": "Description","ProductElementCode": "B00003"},';
                this.method_content = this.method_content.replace('<!-- non_electrical_accessory block -->', non_electrical_block);
            }
            if (this.processed_request['___electrical_accessory___'] == 0) {
                this.method_content = this.method_content.replace('<!-- electrical_accessory block -->', '');
            } else {
                var electrical_block = '{"SumInsured": ' + this.processed_request["___electrical_accessory___"] + ',"Description": "Description","ProductElementCode": "B00004"},';
                this.method_content = this.method_content.replace('<!-- electrical_accessory block -->', electrical_block);
            }
            if (this.processed_request['___addon_key_lock_cover___'] === "no" || this.processed_request['___addon_key_lock_cover___'] === "") {
                this.method_content = this.method_content.replace('<!-- key_replacement_block -->', '');
            } else {
                if (this.lm_request['product_id'] === 1) {
                    var key_replacement_block = '{"ProductElementCode": "C101073"},';
                    this.method_content = this.method_content.replace('<!-- key_replacement_block -->', key_replacement_block);
                } else {
                    this.method_content = this.method_content.replace('<!-- key_replacement_block -->', '');
                }
            }
            if (this.processed_request['___addon_invoice_price_cover___'] === "no" || this.processed_request['___addon_invoice_price_cover___'] === "") {
                this.method_content = this.method_content.replace('<!-- Return_To_Invoice -->', '');
            } else {
                let vehicle_age = this.vehicle_age_year();
                if (vehicle_age >= 3) {
                    this.method_content = this.method_content.replace('<!-- Return_To_Invoice -->', '');
                } else {
                    var Return_To_Invoice_block = '{"ProductElementCode": "C101067","SumInsured": 0},';
                    this.method_content = this.method_content.replace('<!-- Return_To_Invoice -->', Return_To_Invoice_block);
                }
            }
            if (this.processed_request['___addon_ncb_protection_cover___'] === "" || this.processed_request['___addon_ncb_protection_cover___'] === "no" || ['0CH_1TP', '0CH_3TP', '0CH_5TP'].indexOf(this.lm_request['vehicle_insurance_subtype']) > -1) {
                this.method_content = this.method_content.replace('<!-- NCB_Protection -->', '');
            } else {
                var NCB_Protection_block = '{"ProductElementCode": "C101068","NoClaimDiscount": ' + this.processed_request['___vehicle_ncb_next_1___'] + '},';
                this.method_content = this.method_content.replace('<!-- NCB_Protection -->', NCB_Protection_block);
            }
            if (this.prepared_request['addon_tyre_coverage_cover'] === "no") {
                this.method_content = this.method_content.replace('<!-- Tyre_Rim_Guard -->', '');
            } else {
                var Tyre_Rim_Guard_block = '{"ProductElementCode": "C101110","Deductible": 0},';
                //this.method_content = this.method_content.replace('<!-- Tyre_Rim_Guard -->', Tyre_Rim_Guard_block);
                this.method_content = this.method_content.replace('<!-- Tyre_Rim_Guard -->', ''); // In SBI Mail & Meeting - they not provided tyre coverage // Re: Fwd: CR8004 || Landmark insurance || Fire ||updated defect list --- 24/03/2022
            }
            if (this.processed_request['___addon_zero_dep_cover___'] === "no" || this.processed_request['___addon_zero_dep_cover___'] === "") {
                this.method_content = this.method_content.replace('<!-- zerp_dep_block -->', '');
            } else {
                 if (this.lm_request['product_id'] === 10 && ['1CH_0TP' , '1CH_4TP'].indexOf(this.lm_request['vehicle_insurance_subtype']) > -1 && this.lm_request['method_type'] === 'Proposal') {
                    if (this.processed_request['___addon_ncb_protection_cover___'] == "yes" || this.processed_request['___addon_zero_dep_cover___'] == "yes") {
                       this.method_content = this.method_content.replace('<!-- zerp_dep_block -->', '{"SumInsured": 0,"ProductElementCode": "C101072"}');
                    }
                } else {
                    var zero_dep_block = '{"SumInsured": 0,"ProductElementCode": "C101072"},';
                    this.method_content = this.method_content.replace('<!-- zerp_dep_block -->', zero_dep_block);
                }
            }
            if (this.processed_request['___addon_consumable_cover___'] === "" || this.processed_request['___addon_consumable_cover___'] === "no" || ['0CH_1TP', '0CH_3TP', '0CH_5TP'].indexOf(this.lm_request['vehicle_insurance_subtype']) > -1) {
                this.method_content = this.method_content.replace('<!-- consumable_element_block -->', '');
            } else {
                /*if (this.lm_request['product_id'] === 10 && ['1OD_0TP'].indexOf(this.lm_request['vehicle_insurance_subtype']) > -1) {
                    this.method_content = this.method_content.replace('<!-- consumable_element_block -->', '{"ProductElementCode": "C101111"}');
                } else if (this.lm_request['product_id'] === 10 && ['1CH_0TP' , '1CH_4TP'].indexOf(this.lm_request['vehicle_insurance_subtype']) > -1 && this.lm_request['method_type'] === 'Proposal') {
                    if (this.processed_request['___addon_ncb_protection_cover___'] == "yes" || this.processed_request['___addon_zero_dep_cover___'] == "yes" || this.processed_request['___addon_consumable_cover___'] == "yes") {
                       this.method_content = this.method_content.replace('<!-- consumable_element_block -->', '{"ProductElementCode": "C101111"}');
                    }
                } else {
                    this.method_content = this.method_content.replace('<!-- consumable_element_block -->', '{"ProductElementCode": "C101111"},');
                }*/ // Cover for Consumable is not available error in response
                if(this.lm_request['product_id'] === 10){
                    this.method_content = this.method_content.replace('<!-- consumable_element_block -->', '');
                }else {
                    this.method_content = this.method_content.replace('<!-- consumable_element_block -->', '{"ProductElementCode": "C101111"},');
                }
            }
            if (this.processed_request['___addon_engine_protector_cover___'] === "" || this.processed_request['___addon_engine_protector_cover___'] === "no" || ['0CH_1TP', '0CH_3TP', '0CH_5TP'].indexOf(this.lm_request['vehicle_insurance_subtype']) > -1 || (this.vehicle_age_year() >= 3)) {
                this.method_content = this.method_content.replace('<!-- engine_protection_block -->', '');
            } else {
                if (this.lm_request['product_id'] === 1) {
                    this.method_content = this.method_content.replace('<!-- engine_protection_block -->', '{"ProductElementCode": "C101108"},'); // Error in response - Premium rate not available for Engine Guard cover
                    //this.method_content = this.method_content.replace('<!-- engine_protection_block -->', '');
                } else {
                    this.method_content = this.method_content.replace('<!-- engine_protection_block -->', '');
                }
            }
            if (this.prepared_request['addon_personal_belonging_loss_cover'] === "no" || !(this.prepared_request['addon_personal_belonging_loss_cover'])) {
                this.method_content = this.method_content.replace('<!-- persobal_belogning_block -->', '');
            } else {
                if (this.lm_request['product_id'] === 1) {
                    var personal_belonging_loss = '{"SumInsured": 12500,"ProductElementCode": "C101075"},';
                    this.method_content = this.method_content.replace('<!-- persobal_belogning_block -->', personal_belonging_loss);
                } else {
                    this.method_content = this.method_content.replace('<!-- persobal_belogning_block -->', '');
                }
            }
            if (this.prepared_request['addon_inconvenience_allowance_cover'] === "no" || !(this.prepared_request['addon_inconvenience_allowance_cover']) || !(this.prepared_request['addon_inconvenience_allowance_cover'])) {
                this.method_content = this.method_content.replace('<!-- allowanve_block -->', '');
            } else {
                if (this.lm_request['product_id'] === 1) {
                    var allowance_block = '{"SumInsured": 1000,"ProductElementCode": "C101074"},';
                    this.method_content = this.method_content.replace('<!-- allowanve_block -->', allowance_block);
                } else {
                    this.method_content = this.method_content.replace('<!-- allowanve_block -->', '');
                }
            }
            if (this.processed_request['___addon_road_assist_cover___'] === "no") {
                this.method_content = this.method_content.replace('<!-- RSA_block -->', '');
            } else {
                if (this.lm_request['product_id'] === 1) {
                    var rsa_block = '{"ProductElementCode": "B00025","AdditionalTowingCharges": "0"}';
                    this.method_content = this.method_content.replace('<!-- RSA_block -->', rsa_block);
                } else {
                    this.method_content = this.method_content.replace('<!-- RSA_block -->', '');
                }
            }
            if (this.lm_request['is_tppd'] === "yes") {
                var tppd_block = '{"SumInsured": 6000,"ProductElementCode": "B00009"},';
                this.method_content = this.method_content.replace('<!-- tppd_block -->', tppd_block);
            } else {
                this.method_content = this.method_content.replace('<!-- tppd_block -->', '');
            }
            if (this.processed_request['___is_llpd___'] === "yes") {
                if(this.lm_request['product_id'] === 10){
                    this.prepared_request['is_pa_paid_driver'] = 1;
                    this.processed_request['___is_pa_paid_driver___'] = this.prepared_request['is_pa_paid_driver'];
                }
                var llpd_block = '{"ProductElementCode": "B00013"},';
                this.method_content = this.method_content.replace('<!-- llpd_block -->', llpd_block);
            } else {
                if(this.lm_request['product_id'] === 10){
                    this.prepared_request['is_pa_paid_driver'] = 0;
                    this.processed_request['___is_pa_paid_driver___'] = this.prepared_request['is_pa_paid_driver'];
                }
                this.method_content = this.method_content.replace('<!-- llpd_block -->', '');
            }
            /*if (this.lm_request['is_tppd'] === "yes" && this.processed_request['___is_llpd___'] == "yes") {
             var total_block = '{"EffectiveDate": " ' + this.processed_request['___effective_start_date___'] + 'T00:00:00","PolicyBenefitList": [{"SumInsured": 0,"ProductElementCode": "B00008"},{"ProductElementCode": "B00013"},{"SumInsured": 6000,"ProductElementCode": "B00009"}],"ExpiryDate": "' + this.processed_request['___expiry_date___'] + 'T23:59:59","ProductElementCode": "C101065"},';
             this.method_content = this.method_content.replace('<!-- lltp_block -->', total_block);
             } else if (this.processed_request['___is_llpd___'] == "yes" && this.lm_request['is_tppd'] === "no") {
             var llpd_block = '{"EffectiveDate": "' + this.processed_request['___effective_start_date___'] + 'T00:00:00","PolicyBenefitList": [{"SumInsured": 0,"ProductElementCode": "B00008"},{"ProductElementCode": "B00013"}],"ExpiryDate": "' + this.processed_request['___expiry_date___'] + 'T23:59:59","ProductElementCode": "C101065"},';
             this.method_content = this.method_content.replace('<!-- lltp_block -->', llpd_block);
             } else if (this.lm_request['is_tppd'] === "yes" && this.processed_request['___is_llpd___'] === "no") {
             var tppd_block = '{"EffectiveDate": " ' + this.processed_request['___effective_start_date___'] + 'T00:00:00","PolicyBenefitList": [{"SumInsured": 0,"ProductElementCode": "B00008"},{"SumInsured": 6000,"ProductElementCode": "B00009"}],"ExpiryDate": "' + this.processed_request['___expiry_date___'] + 'T23:59:59","ProductElementCode": "C101065"},';
             this.method_content = this.method_content.replace('<!-- lltp_block -->', tppd_block);
             } else {
             this.method_content = this.method_content.replace('<!-- lltp_block -->', '{"EffectiveDate": " ' + this.processed_request['___effective_start_date___'] + 'T00:00:00","PolicyBenefitList": [{"SumInsured": 0,"ProductElementCode": "B00008"}],"ExpiryDate": "' + this.processed_request['___expiry_date___'] + 'T23:59:59","ProductElementCode": "C101065"},');
             }*/
            if (this.processed_request['___pa_unnamed_passenger_si___'] === "") {
                this.method_content = this.method_content.replace('<!-- pa_unnamed_block -->', '');
            } else {
                let pa_valid = "";
                let element_code = "B00016";
                let tw_node = "";
                if (!(this.lm_request['is_pa_od'] === "no")) {
                    pa_valid = ",";
                }
                if (this.lm_request['product_id'] === 10) {
                    element_code = "B00075";
                    tw_node = ',"TotalSumInsured": ' + this.processed_request["___pa_unnamed_passenger_si___"] + ', "NoofPersons" : ' + this.processed_request['___dbmaster_insurer_vehicle_seatingcapacity___'] + '';
                }
                let pa_unnamed_block = '{"SumInsuredPerUnit": ' + this.processed_request["___pa_unnamed_passenger_si___"] + ',"ProductElementCode": "' + element_code + '" ' + tw_node + ' }' + pa_valid;
                this.method_content = this.method_content.replace('<!-- pa_unnamed_block -->', pa_unnamed_block);
            }
            if (this.lm_request['is_pa_od'] === "no") {
                this.method_content = this.method_content.replace('<!-- pa_owner_driver_block -->', '');
            } else {
                if (this.lm_request['method_type'] === 'Customer' || this.lm_request['method_type'] === 'Proposal') {
                    /* (this.lm_request['vehicle_registration_type'] === 'corporate') {
                     var pa_owner_driver_block = '{"SumInsured": ' + this.processed_request["___pa_owner_driver_si___"] + ',"ProductElementCode": "B00015"}';
                     } else {
                     var pa_owner_driver_block = '{"SumInsured": ' + this.processed_request["___pa_owner_driver_si___"] + ',"ProductElementCode": "B00015","NomineeName": "' + this.processed_request["___nominee_name___"] + '","NomineeRelToProposer": "' + this.processed_request["___nominee_relation___"] + '","NomineeDOB": "' + this.processed_request["___nominee_dob___"] + '","NomineeAge": "' + this.processed_request["___nominee_age___"] + '"}';
                     }*/
                    var pa_owner_driver_block = '{"SumInsured": ' + this.processed_request["___pa_owner_driver_si___"] + ',"ProductElementCode": "B00015","NomineeName": "' + this.processed_request["___nominee_name___"] + '","NomineeRelToProposer": "' + this.processed_request["___nominee_relation___"] + '","NomineeDOB": "' + this.processed_request["___nominee_dob___"] + '","NomineeAge": "' + this.processed_request["___nominee_age___"] + '"}';
                    this.method_content = this.method_content.replace('<!-- pa_owner_driver_block -->', pa_owner_driver_block);
                } else {
                    /*if (this.lm_request['vehicle_registration_type'] === 'corporate') {
                     var pa_owner_driver_block = '{"SumInsured": ' + this.processed_request["___pa_owner_driver_si___"] + ',"ProductElementCode": "B00015"}';
                     } else {
                     var pa_owner_driver_block = '{"SumInsured": ' + this.processed_request["___pa_owner_driver_si___"] + ',"ProductElementCode": "B00015","NomineeName": "Sai","NomineeRelToProposer": "1","NomineeDOB": "2000-04-19","NomineeAge": "21"}';
                     }*/
                    var pa_owner_driver_block = '{"SumInsured": ' + this.processed_request["___pa_owner_driver_si___"] + ',"ProductElementCode": "B00015","NomineeName": "Sai","NomineeRelToProposer": "1","NomineeDOB": "2000-04-19","NomineeAge": "21"}';
                    this.method_content = this.method_content.replace('<!-- pa_owner_driver_block -->', pa_owner_driver_block);
                }
            }
            if (this.lm_request['is_policy_exist'] === "yes") {
                this.prepared_request['is_pre_policy_exist'] = "1";
                this.processed_request['___is_pre_policy_exist___'] = this.prepared_request['is_pre_policy_exist'];
            } else {
                this.prepared_request['is_pre_policy_exist'] = "0";
                this.processed_request['___is_pre_policy_exist___'] = this.prepared_request['is_pre_policy_exist'];
            }
            if (this.processed_request['___dbmaster_pb_previousinsurer_address___'] == null || this.processed_request['___dbmaster_pb_previousinsurer_address___'] == undefined || this.processed_request['___dbmaster_pb_previousinsurer_address___'] == "") {
                this.prepared_request['dbmaster_pb_previousinsurer_address'] = "";
                this.processed_request['___dbmaster_pb_previousinsurer_address___'] = this.prepared_request['dbmaster_pb_previousinsurer_address'];
            }
            if (this.lm_request['method_type'] === 'Verification') {
                if (this.lm_request['product_id'] === 1) {
                    this.prepared_request['quotation_no'] = this.proposal_processed_request['___quotation_no___'];
                    this.processed_request['___quotation_no___'] = this.prepared_request['quotation_no'];

                    this.prepared_request['transaction_amount'] = this.proposal_processed_request['___final_premium_verified___'];
                    this.processed_request['___transaction_amount___'] = this.prepared_request['transaction_amount'];
                } else if (this.lm_request['product_id'] === 10) {
                    this.prepared_request['quotation_no'] = this.processed_request['___dbmaster_insurer_transaction_identifier___'].split("-")[1];
                    this.processed_request['___quotation_no___'] = this.prepared_request['quotation_no'];

                    this.prepared_request['transaction_amount'] = this.proposal_processed_request['___final_premium___'];
                    this.processed_request['___transaction_amount___'] = this.prepared_request['transaction_amount'];
                }

                /*this.prepared_request['pay_id'] = this.const_policy.transaction_id;
                 this.processed_request['___pay_id___'] = this.prepared_request['pay_id'];*/


                /*this.prepared_request['payment_date'] = this.const_policy.pg_reference_number_3;
                 this.processed_request['___payment_date___'] = this.prepared_request['payment_date'];*/
                if (this.lm_request['vehicle_insurance_subtype'] === '1OD_0TP') {
                    this.prepared_request['receipt_date'] = this.proposal_processed_request['___tp_policy_start_date___'];
                    this.processed_request['___receipt_date___'] = this.prepared_request['receipt_date'];
                } else {
                    this.prepared_request['receipt_date'] = this.const_policy.pg_reference_number_3;
                    this.processed_request['___receipt_date___'] = this.prepared_request['receipt_date'];
                }
                if (config.environment.name === 'Production') {
                    this.prepared_request['Currency_Id'] = 1;
                    this.processed_request['___Currency_Id___'] = this.prepared_request['Currency_Id'];
                    this.prepared_request['Payer'] = "payer";
                    this.processed_request['___Payer___'] = this.prepared_request['Payer'];
                    this.prepared_request['Location_Type'] = "2";
                    this.processed_request['___Location_Type___'] = this.prepared_request['Location_Type'];
                } else {
                    this.prepared_request['Currency_Id'] = 31;
                    this.processed_request['___Currency_Id___'] = this.prepared_request['Currency_Id'];
                    this.prepared_request['Payer'] = "Customer";
                    this.processed_request['___Payer___'] = this.prepared_request['Payer'];
                    this.prepared_request['Location_Type'] = "1";
                    this.processed_request['___Location_Type___'] = this.prepared_request['Location_Type'];
                }
            }
            if (this.lm_request['method_type'] === 'Pdf') {
                var policy_code = (this.const_policy.policy_number);
                if (policy_code === null || policy_code === undefined) {
                    policy_code = this.lm_request["policy_number"];
                }
                this.prepared_request['policy_code'] = policy_code;
                this.processed_request['___policy_code___'] = this.prepared_request['policy_code'];
                this.lm_request['transaction_id'] = isNaN(this.lm_request['transaction_id']) ? (this.lm_request['transaction_pg'] ? this.lm_request['transaction_pg'] : this.lm_request['transaction_id']) : this.lm_request['transaction_id'];
            }
            if (this.lm_request['vehicle_insurance_subtype'] === '1OD_0TP') {
                this.method_content = this.method_content.replace('<!-- KindofPolicy -->', '"KindofPolicy": "3",');
                this.method_content = this.method_content.replace('"BusinessType": "___vehicle_insurance_type___",', '"BusinessType": "7",');
                this.method_content = this.method_content.replace('___policy_type___', '9');
                this.prepared_request['tp_insurer_code'] = this.insurer_master.tp_insurer.insurer_db_master['PreviousInsurer_Code'];
                this.processed_request['___tp_insurer_code___'] = this.prepared_request['tp_insurer_code'];
                this.method_content = this.method_content.replace('<!-- SAOD nodes start-->', '');
                this.method_content = this.method_content.replace('<!-- SAOD nodes end-->', '');
                if (this.lm_request['method_type'] === 'Premium') {
                    var tp_start_Date = this.processed_request['___pre_policy_start_date___'].split("/");
                    this.prepared_request['tp_policy_start_date'] = tp_start_Date[2] + "-" + tp_start_Date[1] + "-" + tp_start_Date[0];
                    this.processed_request['___tp_policy_start_date___'] = this.prepared_request['tp_policy_start_date'];
                    var tp_end_date = (moment(this.processed_request['___policy_expiry_date___'], 'DD/MM/YYYY').add(2, "years").format("YYYY-MM-DD"));
                    this.prepared_request['tp_policy_end_date'] = tp_end_date;
                    this.processed_request['___tp_policy_end_date___'] = this.prepared_request['tp_policy_end_date'];
                }
                if (this.lm_request['method_type'] === 'Proposal' || this.lm_request['method_type'] === 'Customer') {
                    this.prepared_request['tp_policy_start_date'] = this.lm_request['tp_start_date'].split("-")[2] + "-" + this.lm_request['tp_start_date'].split("-")[1] + "-" + this.lm_request['tp_start_date'].split("-")[0];
                    this.processed_request['___tp_policy_start_date___'] = this.prepared_request['tp_policy_start_date'];
                    this.prepared_request['tp_policy_end_date'] = this.lm_request['tp_end_date'].split("-")[2] + "-" + this.lm_request['tp_end_date'].split("-")[1] + "-" + this.lm_request['tp_end_date'].split("-")[0];
                    this.processed_request['___tp_policy_end_date___'] = this.prepared_request['tp_policy_end_date'];
                    this.prepared_request['tp_policy_number'] = this.lm_request['tp_policy_number'];
                    this.processed_request['___tp_policy_number___'] = this.prepared_request['tp_policy_number'];
                }
            } else {
                if (this.lm_request['product_id'] == 10 && this.lm_request['vehicle_insurance_type'] === 'new') {
                    if (this.prepared_request.hasOwnProperty('vehicle_insurance_subtype') && this.prepared_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
                        this.method_content = this.method_content.replace('<!-- KindofPolicy -->', '"KindofPolicy": "1",');
                    } else {
                        this.method_content = this.method_content.replace('<!-- KindofPolicy -->', '"KindofPolicy": "2",');
                    }
                } else {
                    this.method_content = this.method_content.replace('<!-- KindofPolicy -->', '"KindofPolicy": "___vehicle_insurance_subtype___",');
                }
                var txt_replace3 = this.find_text_btw_key(this.method_content, '<!-- SAOD nodes start-->', '<!-- SAOD nodes end-->', true);
                if (txt_replace3) {
                    this.method_content = this.method_content.replace(txt_replace3, '');
                }
            }
        }
        if (this.lm_request['vehicle_insurance_type'] === 'new') {
            this.prepared_request['is_claim_exists'] = "no";
            this.processed_request['___is_claim_exists___'] = this.prepared_request['is_claim_exists'];
            this.prepared_request['vehicle_ncb_current'] = 0;
            this.processed_request['___vehicle_ncb_current___'] = this.prepared_request['vehicle_ncb_current'];
            this.prepared_request['vehicle_ncb_next'] = 0;
            this.processed_request['___vehicle_ncb_next___'] = this.prepared_request['vehicle_ncb_next'];
            var txt_replace3 = this.find_text_btw_key(this.method_content, '<!-- Renew nodes start -->', '<!-- Renew nodes end -->', true);
            if (txt_replace3) {
                this.method_content = this.method_content.replace(txt_replace3, '');
            }
            var txt_replace = this.find_text_btw_key(this.method_content, '<!-- Renew nodes start 1 -->', '<!-- Renew nodes end 1 -->', true);
            if (txt_replace) {
                this.method_content = this.method_content.replace(txt_replace, '');
            }
            this.method_content = this.method_content.replace('"NCB": ___vehicle_ncb_next_1___,', '');
            this.method_content = this.method_content.replace('"NCBLetterDate": "",', '');
            this.method_content = this.method_content.replace('"NCBPrePolicy" : "___vehicle_ncb_current_1___",', '');
            this.method_content = this.method_content.replace('"NCBProof": "1",', '');
        } else {
            this.method_content = this.method_content.replace('<!-- Renew nodes start -->', '');
            this.method_content = this.method_content.replace('<!-- Renew nodes end -->', '');
            this.method_content = this.method_content.replace('<!-- Renew nodes start 1 -->', '');
            this.method_content = this.method_content.replace('<!-- Renew nodes end 1 -->', '');
        }
        if (this.lm_request['method_type'] === 'Proposal' || this.lm_request['method_type'] === 'Customer') {
            this.prepared_request['locality_text'] = this.lm_request['communication_locality_code_text'];
            this.processed_request['___locality_text___'] = this.prepared_request['locality_text'];
            if (this.processed_request['___financial_agreement_type___'] === "0" || this.processed_request['___financial_agreement_type___'] === undefined) {
                var txt_replace3 = this.find_text_btw_key(this.method_content, '<!-- financial details start --->', '<!-- financial details end --->', true);
                if (txt_replace3) {
                    this.method_content = this.method_content.replace(txt_replace3, '');
                }
            } else {
                this.method_content = this.method_content.replace('<!-- financial details start --->', '');
                this.method_content = this.method_content.replace('<!-- financial details end --->', '');
                if (this.processed_request['___financial_agreement_type___'] === "Hypothecation") {
                    this.prepared_request['fn_type'] = "2";
                    this.processed_request['___fn_type___'] = this.prepared_request['fn_type'];
                } else if (this.processed_request['___financial_agreement_type___'] === "Lease agreement") {
                    this.prepared_request['fn_type'] = "3";
                    this.processed_request['___fn_type___'] = this.prepared_request['fn_type'];
                } else {
                    this.prepared_request['fn_type'] = "1";
                    this.processed_request['___fn_type___'] = this.prepared_request['fn_type'];
                }
            }
            this.method_content = this.method_content.replace('___normal_idv___', this.insurer_master.service_logs.insurer_db_master.Insurer_Response.PolicyLobList[0].PolicyRiskList[0].IDV_Suggested);
            this.method_content = this.method_content.replace('___user_idv___', this.insurer_master.service_logs.insurer_db_master.Insurer_Response.PolicyLobList[0].PolicyRiskList[0].IDV_User);
            this.method_content = this.method_content.replace('___max_idv___', this.insurer_master.service_logs.insurer_db_master.Insurer_Response.PolicyLobList[0].PolicyRiskList[0].MaxIDV_Suggested);
            this.method_content = this.method_content.replace('___min_idv___', this.insurer_master.service_logs.insurer_db_master.Insurer_Response.PolicyLobList[0].PolicyRiskList[0].MinIDV_Suggested);
        }
        if (this.lm_request['method_type'] === 'Premium') {
            // If user change idv value on ui, below nodes added in premium request to get proper premium value in response
            if (['0CH_1TP', '0CH_3TP', '0CH_5TP'].indexOf(this.lm_request['vehicle_insurance_subtype']) > -1) {
                this.method_content = this.method_content.replace('___suggested_idv___', 0); // this.prepared_request['vehicle_normal_idv']
                this.method_content = this.method_content.replace('___expected_idv___', 0);
                this.method_content = this.method_content.replace('___idv_max___', 0);
                this.method_content = this.method_content.replace('___idv_min___', 0);
            } else {
                this.method_content = this.method_content.replace('___suggested_idv___', this.prepared_request['vehicle_min_idv']); // this.prepared_request['vehicle_normal_idv']
                this.method_content = this.method_content.replace('___expected_idv___', this.prepared_request['vehicle_expected_idv']);
                this.method_content = this.method_content.replace('___idv_max___', this.prepared_request['vehicle_max_idv']);
                this.method_content = this.method_content.replace('___idv_min___', this.prepared_request['vehicle_min_idv']);
            }
            /*if (this.lm_request['vehicle_expected_idv'] > 0) {
             // If user change idv value on ui, below nodes added in premium request to get proper premium value in response
             this.method_content = this.method_content.replace('___suggested_idv___', this.prepared_request['vehicle_min_idv']); // this.prepared_request['vehicle_normal_idv']
             this.method_content = this.method_content.replace('___expected_idv___', this.prepared_request['vehicle_expected_idv']);
             this.method_content = this.method_content.replace('___idv_max___', this.prepared_request['vehicle_max_idv']);
             this.method_content = this.method_content.replace('___idv_min___', this.prepared_request['vehicle_min_idv']);
             } else {
             // for idv & premium service no nodes related to idv, so I changed it to 0
             this.method_content = this.method_content.replace('___suggested_idv___', 0);
             this.method_content = this.method_content.replace("___expected_idv___", 0);
             this.method_content = this.method_content.replace("___idv_max___", 0);
             this.method_content = this.method_content.replace("___idv_min___", 0);
             }*/
        }
        if (this.lm_request['vehicle_registration_type'] === 'corporate') {
            if (this.lm_request['method_type'] === 'Proposal' || this.lm_request['method_type'] === 'Customer') {
                this.prepared_request['title_code'] = "9000000013";
                this.processed_request['___title_code___'] = this.prepared_request['title_code'];
                this.method_content = this.method_content.replace('"OccupationCode": "___occupation___",', "");
                this.method_content = this.method_content.replace('"CustomerName": "___first_name___ ___last_name___",', '"CustomerName": "___company_name___",');
                this.method_content = this.method_content.replace('"MiddleName": "___middle_name___",', '"MiddleName": "",');
                this.method_content = this.method_content.replace('"LastName": "___last_name___",', '"LastName": "",');
            }
        }
        if (config.environment.name === 'Production') {
            this.prepared_request['AgreementCode'] = "48218";
            this.processed_request['___AgreementCode___'] = this.prepared_request['AgreementCode'];
        } else {
            this.prepared_request['AgreementCode'] = "6660";
            this.processed_request['___AgreementCode___'] = this.prepared_request['AgreementCode'];
        }
        if (this.lm_request['product_id'] == 10) {
            this.method_content = this.method_content.replace('"ProductCode": "PMCAR001"', '"ProductCode": "PM2W001"');
            this.method_content = this.method_content.replace('"ProductCode": "PMCAR001"', '"ProductCode": "PM2W001"');
            this.method_content = this.method_content.replace('___policy_type___', "___policy_type_1___");
        }
        /*if(this.lm_request['product_id'] == 10 && this.lm_request['vehicle_insurance_type'] === 'new' && ['0CH_5TP'].indexOf(this.lm_request['vehicle_insurance_subtype']) > -1){
            let expiry_dt = this.processed_request['___policy_end_date_extended___'].split("/");
            let tp_exp_date = expiry_dt[2] + "-" + expiry_dt[1] + "-" + expiry_dt[0];
            this.method_content = this.method_content.replace('___expiry_date___', tp_exp_date);
        }*/
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_product_field_process_pre', ex);
    }
};
SBIGeneralE2EMotor.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
SBIGeneralE2EMotor.prototype.insurer_product_field_process_post = function () {

    console.log("insurer_product_api_post");
};
SBIGeneralE2EMotor.prototype.insurer_product_api_post = function () {

    console.log("insurer_product_api_post");
};
SBIGeneralE2EMotor.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    try {

        var objInsurerProduct = this;
        var product_id = objProduct.db_specific_product.Product_Id; //
        var insurer_id = Insurer_Object.Insurer_ID;
        var soap = require('soap');
        var xml2js = require('xml2js');
        var Client = require('node-rest-client').Client;
        var client = new Client();
        var args = null;
        var service_method_url = '';
        if (specific_insurer_object.method.Method_Type === 'Pdf') {
            var Token = "";
            var service_method_urlT = '';
            var argsT = {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "X-IBM-Client-Id": '08e9c64bf82247c97639733335cae869',
                    "X-IBM-Client-Secret": '96b28412afa9d441f981349a0f12539f'
                }
            };
            if (config.environment.name === 'Production') {
                service_method_urlT = "";
            } else {
                service_method_urlT = "https://devapi.sbigeneral.in/v1/tokens";
            }
            client.get(service_method_urlT, argsT, function (dataT, response) {
                console.log(dataT);
                console.log(response);
                console.log(dataT);
                Token = dataT["accessToken"];
                if (Token !== "") {
                    var args = {
                        data: docLog.Insurer_Request,
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "X-IBM-Client-Id": '08e9c64bf82247c97639733335cae869',
                            "X-IBM-Client-Secret": '96b28412afa9d441f981349a0f12539f',
                            "Authorization": "Bearer " + Token
                        }
                    };
                    service_method_url = specific_insurer_object.method.Service_URL;
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
            });
        } else {
            var Token = "";
            var service_method_urlT = '';
            var argsT = {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "X-IBM-Client-Id": objInsurerProduct.prepared_request['insurer_integration_service_user'],
                    "X-IBM-Client-Secret": objInsurerProduct.prepared_request['insurer_integration_service_password']
                }
            };
            if (config.environment.name === 'Production') {
                service_method_urlT = "";
            } else {
                service_method_urlT = "https://devapi.sbigeneral.in/cld/v1/token";
            }
            client.get(service_method_urlT, argsT, function (dataT, response) {
                // parsed response body as js object 
                console.log(dataT);
                // raw response 
                console.log(response);
                console.log(dataT);
                Token = dataT["access_token"];
                if (Token !== "") {
                    if (specific_insurer_object.method.Method_Calling_Type === 'POST') {
                        var args = {
                            data: docLog.Insurer_Request,
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json",
                                "X-IBM-Client-Id": objInsurerProduct.prepared_request['insurer_integration_service_user'],
                                "X-IBM-Client-Secret": objInsurerProduct.prepared_request['insurer_integration_service_password'],
                                "Authorization": "Bearer " + Token
                            }
                        };
                        service_method_url = specific_insurer_object.method.Service_URL;
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
                    /*if (specific_insurer_object.method.Method_Type === 'Pdf') {
                     if (specific_insurer_object.method.Method_Calling_Type === 'GET') {
                     var service_method_url = '';
                     var args = {
                     headers: {
                     "Content-Type": "application/json",
                     "Accept": "application/json",
                     "X-IBM-Client-Id": objInsurerProduct.prepared_request['insurer_integration_service_user'],
                     "X-IBM-Client-Secret": objInsurerProduct.prepared_request['insurer_integration_service_password'],
                     "Authorization": "Bearer " + Token
                     }
                     };
                     var body = JSON.parse(docLog.Insurer_Request);
                     service_method_url = specific_insurer_object.method_file_url + "?policyNumber=" + body['policy_no'];
                     client.get(service_method_url, args, function (dataT, response) {
                     console.log(dataT);
                     console.log(response);
                     var objResponseFull = {
                     'err': null,
                     'result': dataT,
                     'raw': dataT,
                     'soapHeader': null,
                     'objResponseJson': dataT
                     };
                     console.log(response);
                     var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                     if (specific_insurer_object.method.Method_Type === 'Idv') {
                     objInsurerProduct.insurer_vehicle_idv_handler(serviceBreakup, objProduct, Insurer_Object, specific_insurer_object);
                     }
                     });
                     }
                     }*/
                } else {
                    console.log("token not generated");
                }
            });
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};
SBIGeneralE2EMotor.prototype.idv_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'idv_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson.hasOwnProperty("message") && objResponseJson.message !== "") {
            Error_Msg = objResponseJson.message;
        }
        if (objResponseJson.hasOwnProperty("httpMessage") && objResponseJson.httpMessage !== "") {
            Error_Msg = objResponseJson.httpMessage;
        }
        if (Error_Msg === 'NO_ERR') {
            if (objResponseJson.hasOwnProperty('UnderwritingResult')) {
                if (objResponseJson.UnderwritingResult.Status !== "Success") {
                    Error_Msg = objResponseJson.UnderwritingResult.MessageList[0].Message;
                }
            }
        }
        if (objResponseJson.hasOwnProperty('PolicyLobList')) {
            if (objResponseJson.PolicyLobList[0].hasOwnProperty('PolicyRiskList')) {
                if (parseInt(objResponseJson.PolicyLobList[0].PolicyRiskList[0]["IDV_User"]) > 5000000) {
                    Error_Msg = "SBI Not allowed IDV greater than 50 Lacs";
                }
            }
        }
        if (Error_Msg === 'NO_ERR') {
            var Idv_Breakup = this.get_const_idv_breakup();
            Idv_Breakup["Idv_Normal"] = parseInt(objResponseJson.PolicyLobList[0].PolicyRiskList[0]["IDV_Suggested"]);
            Idv_Breakup["Idv_Min"] = parseInt(objResponseJson.PolicyLobList[0].PolicyRiskList[0]["MinIDV_Suggested"]) + 1;
            //Math.round(Idv_Breakup["Idv_Normal"] * 0.90);
            Idv_Breakup["Idv_Max"] = parseInt(objResponseJson.PolicyLobList[0].PolicyRiskList[0]["MaxIDV_Suggested"]);
            ////Math.round(Idv_Breakup["Idv_Normal"] * 1.20);

            //Idv_Breakup["Exshowroom"] = parseInt(objResponseJson.PolicyLobList[0].PolicyRiskList[0][""]);

            objServiceHandler.Premium_Breakup = Idv_Breakup;
            //objServiceHandler.Insurer_Transaction_Identifier = objResponseJson.Data['idv_4'];
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
SBIGeneralE2EMotor.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    //var objPremiumService = objResponseJson;
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (this.vehicle_age_year() >= 15) {
            Error_Msg = 'Vehicle age is allowed only upto 14.99 Years for Two Wheeler.';
        }
        if (parseInt(this.lm_request['product_id']) === 1 || parseInt(this.lm_request['product_id']) === 10) {
            if (objResponseJson.hasOwnProperty("message") && objResponseJson.message !== "") {
                Error_Msg = objResponseJson.message;
            }
        }
        if (Error_Msg === 'NO_ERR') {
            if (objResponseJson.hasOwnProperty('UnderwritingResult')) {
                if (objResponseJson.UnderwritingResult.Status !== "Success") {
                    Error_Msg = objResponseJson.UnderwritingResult.MessageList[0].Message;
                }
            }
        }
        if (objResponseJson.hasOwnProperty('PolicyLobList')) {
            if (objResponseJson.PolicyLobList[0].hasOwnProperty('PolicyRiskList')) {
                if (parseInt(objResponseJson.PolicyLobList[0].PolicyRiskList[0]["IDV_User"]) > 5000000) {
                    Error_Msg = "SBI Not allowed IDV greater than 50 Lacs";
                }
            }
        }
        if (Error_Msg === 'NO_ERR') {
            if (parseInt(this.lm_request['product_id']) === 1 || parseInt(this.lm_request['product_id']) === 10) {
                var tpBasic = 0;
                var odBasic = 0;
                var od_cng_lpg = 0;
                var premium = 0;
                var objPremiumService = objResponseJson.PolicyLobList[0].PolicyRiskList[0].PolicyCoverageList;
                console.log('objPremiumService' + objResponseJson);
                if (objResponseJson.hasOwnProperty('IsPremiumCalcSuccess') && objResponseJson['IsPremiumCalcSuccess'] === "Y") {
                    var premium_breakup = this.const_premium_breakup;
                    var objOwnDamage, objLiability = [], objAddon = [], LoadingAmt;
                    for (var Code in objPremiumService) {
                        if (objPremiumService[Code].ProductElementCode === "C101064") {
                            objOwnDamage = objPremiumService[Code];
                            LoadingAmt = Math.round(objPremiumService[Code].LoadingAmount);
                        }
                        if (objPremiumService[Code].ProductElementCode === "C101065" || objPremiumService[Code].ProductElementCode === "C101066") {
                            objLiability[objPremiumService[Code].ProductElementCode] = objPremiumService[Code].PolicyBenefitList;
                        }
                        if (objPremiumService[Code].ProductElementCode === "C101067" || objPremiumService[Code].ProductElementCode === "C101068" || objPremiumService[Code].ProductElementCode === "C101069" || objPremiumService[Code].ProductElementCode === "C101073" || objPremiumService[Code].ProductElementCode === "C101074" || objPremiumService[Code].ProductElementCode === "C101071" || objPremiumService[Code].ProductElementCode === "C101075" || objPremiumService[Code].ProductElementCode === "C101108" || objPremiumService[Code].ProductElementCode === "C101110" || objPremiumService[Code].ProductElementCode === "C101111" || objPremiumService[Code].ProductElementCode === "C101072") {
                            if (objPremiumService[Code].ProductElementCode === "C101069" || objPremiumService[Code].ProductElementCode === "C101071") {
                                objAddon[objPremiumService[Code].ProductElementCode] = objPremiumService[Code].PolicyBenefitList;
                            } else {
                                objAddon[objPremiumService[Code].ProductElementCode] = objPremiumService[Code].GrossPremium;
                            }
                        }
                    }
                    for (var key in this.premium_breakup_schema) {
                        if (typeof this.premium_breakup_schema[key] === 'object') {
                            var group_final = 0, group_final_key = '';
                            var od_final = 0, tp_final = 0, addon_final = 0;
                            for (var sub_key in this.premium_breakup_schema[key]) {
                                if (this.lm_request['product_id'] === 1 || parseInt(this.lm_request['product_id']) === 10) {
                                    /*tpBasic = objResponseJson.PolicyLobList[0].PolicyRiskList[0].TP_BasePremium;
                                     if (tpBasic !== 0 && tpBasic !== undefined && tpBasic !== null) {
                                     tpBasic -= Math.round(objResponseJson.PolicyLobList[0].PolicyRiskList[0].TP_ConfinedOwnPremisesDiscAmt);
                                     }*/
                                    /*odBasic = objPremiumService.Data["Own_Damage"];*/
                                    if (key === "own_damage" && objOwnDamage !== null && objOwnDamage !== "" && objOwnDamage !== undefined) {
                                        for (var od_code in objOwnDamage.PolicyBenefitList) {
                                            if (sub_key === "od_basic") {
                                                if (objOwnDamage.PolicyBenefitList[od_code].ProductElementCode === "B00002") {
                                                    odBasic = Math.round(objOwnDamage.PolicyBenefitList[od_code].GrossPremium);
                                                    premium_breakup[key][sub_key] = odBasic;
                                                    od_final += odBasic;
                                                }
                                            } else if (sub_key === "od_elect_access") {
                                                if (objOwnDamage.PolicyBenefitList[od_code].ProductElementCode === "B00004") {
                                                    premium_breakup[key][sub_key] = Math.round(objOwnDamage.PolicyBenefitList[od_code].GrossPremium);
                                                    od_final += Math.round(objOwnDamage.PolicyBenefitList[od_code].GrossPremium);
                                                }
                                            } else if (sub_key === "od_non_elect_access") {
                                                if (objOwnDamage.PolicyBenefitList[od_code].ProductElementCode === "B00003") {
                                                    premium_breakup[key][sub_key] = Math.round(objOwnDamage.PolicyBenefitList[od_code].GrossPremium);
                                                    od_final += Math.round(objOwnDamage.PolicyBenefitList[od_code].GrossPremium);
                                                }
                                            } else if (sub_key === "od_cng_lpg") {
                                                if (objOwnDamage.PolicyBenefitList[od_code].ProductElementCode === "B00005" || objOwnDamage.PolicyBenefitList[od_code].ProductElementCode === "B00006") {
                                                    od_cng_lpg += Math.round(objOwnDamage.PolicyBenefitList[od_code].GrossPremium);
                                                    premium_breakup[key][sub_key] = od_cng_lpg;
                                                    od_final -= od_cng_lpg;
                                                }
                                            } /*else if (sub_key === "od_disc_ncb") {
                                             premium_breakup[key]["od_disc_ncb"] = 0;
                                             if(premium_breakup[key][sub_key] == null || premium_breakup[key][sub_key] == "" || premium_breakup[key][sub_key] == 0 || premium_breakup[key][sub_key] == undefined){
                                             od_final -= Math.round(objResponseJson.PolicyLobList[0].PolicyRiskList[0].OD_NCBAmount);
                                             premium_breakup[key][sub_key] = Math.round(objResponseJson.PolicyLobList[0].PolicyRiskList[0].OD_NCBAmount);
                                             }                                                
                                             } */else if (sub_key === "od_loading") {
                                                if (premium_breakup[key][sub_key] == null || premium_breakup[key][sub_key] == "" || premium_breakup[key][sub_key] == 0 || premium_breakup[key][sub_key] == undefined) {
                                                    premium_breakup[key][sub_key] = LoadingAmt;
                                                    od_final += LoadingAmt;
                                                }
                                            } else if (sub_key === "od_disc") {
                                                premium_breakup[key][sub_key] = 0;
                                                /*if (premium_breakup[key][sub_key] == null || premium_breakup[key][sub_key] == "" || premium_breakup[key][sub_key] == 0 || premium_breakup[key][sub_key] == undefined) {
                                                    premium_breakup[key][sub_key] = objResponseJson.PolicyLobList[0].PolicyRiskList[0].OD_ConfinedOwnPremisesDiscAmt === undefined ? 0 : Math.round(objResponseJson.PolicyLobList[0].PolicyRiskList[0].OD_ConfinedOwnPremisesDiscAmt);
                                                    od_final -= objResponseJson.PolicyLobList[0].PolicyRiskList[0].OD_ConfinedOwnPremisesDiscAmt === undefined ? 0 : Math.round(objResponseJson.PolicyLobList[0].PolicyRiskList[0].OD_ConfinedOwnPremisesDiscAmt);
                                                }*/
                                            }/*else if (sub_key === "od_disc_vol_deduct") {
                                             premium_breakup[key]["od_disc_vol_deduct"] = 0;
                                             if(premium_breakup[key][sub_key] == null || premium_breakup[key][sub_key] == "" || premium_breakup[key][sub_key] == 0 || premium_breakup[key][sub_key] == undefined){
                                             premium_breakup[key][sub_key] = objResponseJson.PolicyLobList[0].PolicyRiskList[0].DeductibleAmount === undefined ? 0 : Math.round(objResponseJson.PolicyLobList[0].PolicyRiskList[0].DeductibleAmount);
                                             od_final -= objResponseJson.PolicyLobList[0].PolicyRiskList[0].DeductibleAmount === undefined ? 0 : Math.round(objResponseJson.PolicyLobList[0].PolicyRiskList[0].DeductibleAmount);
                                             }
                                             }*/
                                        }
                                        if (sub_key === "od_disc_ncb") {
                                            //premium_breakup[key]["od_disc_ncb"] = 0;
                                            if (premium_breakup[key][sub_key] || premium_breakup[key][sub_key] == 0) {
                                                if (this.lm_request['product_id'] === 10) {
                                                    od_final -= Math.round(objResponseJson.PolicyLobList[0].PolicyRiskList[0].NCBDiscountAmt);
                                                    premium_breakup[key][sub_key] = Math.round(objResponseJson.PolicyLobList[0].PolicyRiskList[0].NCBDiscountAmt);
                                                } else {
                                                    od_final -= Math.round(objResponseJson.PolicyLobList[0].PolicyRiskList[0].OD_NCBAmount);
                                                    premium_breakup[key][sub_key] = Math.round(objResponseJson.PolicyLobList[0].PolicyRiskList[0].OD_NCBAmount);
                                                }
                                            }
                                        } else if (sub_key === "od_disc_vol_deduct") {
                                            //premium_breakup[key]["od_disc_vol_deduct"] = 0;
                                            if(this.lm_request['product_id'] == 1){
                                                if (premium_breakup[key][sub_key] || premium_breakup[key][sub_key] == 0) {
                                                    premium_breakup[key][sub_key] = objResponseJson.PolicyLobList[0].PolicyRiskList[0].DeductibleAmount === undefined ? 0 : Math.round(objResponseJson.PolicyLobList[0].PolicyRiskList[0].DeductibleAmount);
                                                    od_final -= objResponseJson.PolicyLobList[0].PolicyRiskList[0].DeductibleAmount === undefined ? 0 : Math.round(objResponseJson.PolicyLobList[0].PolicyRiskList[0].DeductibleAmount);
                                                }
                                            }else{
                                                if (premium_breakup[key][sub_key] || premium_breakup[key][sub_key] == 0) {
                                                    premium_breakup[key][sub_key] = objResponseJson.PolicyLobList[0].PolicyRiskList[0].VolDeductDiscAmt === undefined ? 0 : Math.round(objResponseJson.PolicyLobList[0].PolicyRiskList[0].VolDeductDiscAmt);
                                                    od_final -= objResponseJson.PolicyLobList[0].PolicyRiskList[0].VolDeductDiscAmt === undefined ? 0 : Math.round(objResponseJson.PolicyLobList[0].PolicyRiskList[0].VolDeductDiscAmt);
                                                }
                                            }
                                        } else if (sub_key === "od_disc_anti_theft") {
                                            //premium_breakup[key][sub_key] = 0;
                                            if (premium_breakup[key][sub_key] || premium_breakup[key][sub_key] == 0) {
                                                premium_breakup[key][sub_key] = objResponseJson.PolicyLobList[0].PolicyRiskList[0].AntiTheftDiscAmt === undefined ? 0 : Math.round(objResponseJson.PolicyLobList[0].PolicyRiskList[0].AntiTheftDiscAmt);
                                                od_final -= objResponseJson.PolicyLobList[0].PolicyRiskList[0].AntiTheftDiscAmt === undefined ? 0 : Math.round(objResponseJson.PolicyLobList[0].PolicyRiskList[0].AntiTheftDiscAmt);
                                            }
                                        } else if (sub_key === "od_disc_aai") {
                                            premium_breakup[key][sub_key] = 0;
                                        }
                                    }
                                    if (key === "liability") {
                                        for (var la_code in objLiability.C101066) {
                                            if (sub_key === "tp_cover_owner_driver_pa") {
                                                if (objLiability.C101066[la_code].ProductElementCode === "B00015") {
                                                    premium_breakup[key]["tp_cover_owner_driver_pa"] = 0;
                                                    if (premium_breakup[key][sub_key] == null || premium_breakup[key][sub_key] == "" || premium_breakup[key][sub_key] == 0 || premium_breakup[key][sub_key] == undefined) {
                                                        premium_breakup[key][sub_key] = objLiability.C101066[la_code].GrossPremium;
                                                        tp_final += objLiability.C101066[la_code].GrossPremium;
                                                    }
                                                }
                                            } else if (sub_key === "tp_cover_unnamed_passenger_pa") {
                                                if (this.lm_request['product_id'] === 10) {
                                                    if (objLiability.C101066[la_code].ProductElementCode === "B00075") {
                                                        premium_breakup[key][sub_key] = objLiability.C101066[la_code].GrossPremium;
                                                        tp_final += objLiability.C101066[la_code].GrossPremium;
                                                    }
                                                } else {
                                                    if (objLiability.C101066[la_code].ProductElementCode === "B00016") {
                                                        premium_breakup[key][sub_key] = objLiability.C101066[la_code].GrossPremium;
                                                        tp_final += objLiability.C101066[la_code].GrossPremium;
                                                    }
                                                }
                                            } else if (sub_key === "tp_cover_paid_driver_pa") {
                                                if (objLiability.C101066[la_code].ProductElementCode === "B00027") {
                                                    premium_breakup[key][sub_key] = objLiability.C101066[la_code].GrossPremium;
                                                    tp_final += objLiability.C101066[la_code].GrossPremium;
                                                }
                                            }
                                        }
                                        for (var la_code in objLiability.C101065) {
                                            if (sub_key === "tp_cover_tppd") {
                                                if (objLiability.C101065[la_code].ProductElementCode === "B00009") {
                                                    premium_breakup[key][sub_key] = Math.abs(objLiability.C101065[la_code].GrossPremium);
                                                    tp_final -= Math.abs(objLiability.C101065[la_code].GrossPremium);
                                                }
                                            } else if (sub_key === "tp_cng_lpg") {
                                                if (objLiability.C101065[la_code].ProductElementCode === "B00010") {
                                                    premium_breakup[key][sub_key] = objLiability.C101065[la_code].GrossPremium;
                                                    tp_final += objLiability.C101065[la_code].GrossPremium;
                                                }
                                            } else if (sub_key === "tp_cover_paid_driver_ll") {
                                                if (objLiability.C101065[la_code].ProductElementCode === "B00013") {
                                                    premium_breakup[key][sub_key] = objLiability.C101065[la_code].GrossPremium;
                                                    tp_final += objLiability.C101065[la_code].GrossPremium;
                                                }
                                            } else if (sub_key === "tp_basic") {
                                                if (objLiability.C101065[la_code].ProductElementCode === "B00008") {
                                                    tpBasic = objLiability.C101065[la_code].GrossPremium;
                                                    if (tpBasic !== 0 && tpBasic !== undefined && tpBasic !== null) {
                                                        tpBasic -= objResponseJson.PolicyLobList[0].PolicyRiskList[0].TP_ConfinedOwnPremisesDiscAmt === undefined ? 0 : Math.round(objResponseJson.PolicyLobList[0].PolicyRiskList[0].TP_ConfinedOwnPremisesDiscAmt);
                                                    }
                                                    tp_final += tpBasic === undefined ? 0 : tpBasic;
                                                    premium_breakup[key][sub_key] = tpBasic === undefined ? 0 : tpBasic;
                                                }
                                            }
                                        }
                                        /*if (sub_key === "tp_basic") {
                                         tp_final += tpBasic === undefined ? 0 : tpBasic;
                                         premium_breakup[key][sub_key] = tp_final;
                                         }*/
                                        /*else if (sub_key === "tp_cover_named_passenger_pa") {
                                         premium_breakup[key][sub_key] = 0;
                                         }  */
                                    }
                                    if (key === "addon") {
                                        for (var i in objAddon.C101069) {
                                            if (sub_key === "addon_road_assist_cover") {
                                                if (objAddon.C101069[i].ProductElementCode === "B00025") {
                                                    premium_breakup[key][sub_key] = Math.round(objAddon.C101069[i].GrossPremium);
                                                    addon_final += Math.round(objAddon.C101069[i].GrossPremium);
                                                }
                                            }
                                        }
                                        for (var i in objAddon.C101071) {
                                            if (sub_key === "addon_hospital_cash_cover") {
                                                if (objAddon.C101071[i].ProductElementCode === "B00018") {
                                                    premium_breakup[key][sub_key] = Math.round(objAddon.C101071[i].GrossPremium);
                                                    addon_final += Math.round(objAddon.C101071[i].GrossPremium);
                                                }
                                            }//added for owner driver, remaining - addon_hospital_cash_cover & Paid Driver 
                                        }
                                        if (sub_key === "addon_ncb_protection_cover") {
                                            if (premium_breakup[key][sub_key] == 0) {
                                                premium_breakup[key][sub_key] = objAddon.C101068 === undefined ? 0 : Math.round(objAddon.C101068);
                                                addon_final += objAddon.C101068 === undefined ? 0 : Math.round(objAddon.C101068);
                                            }
                                        } else if (sub_key === "addon_engine_protector_cover") {
                                            premium_breakup[key][sub_key] = objAddon.C101108 === undefined ? 0 : Math.round(objAddon.C101108);
                                            addon_final += objAddon.C101108 === undefined ? 0 : Math.round(objAddon.C101108);
                                        } else if (sub_key === "addon_invoice_price_cover") {
                                            premium_breakup[key][sub_key] = objAddon.C101067 === undefined ? 0 : Math.round(objAddon.C101067);
                                            addon_final += objAddon.C101067 === undefined ? 0 : Math.round(objAddon.C101067);
                                        } else if (sub_key === "addon_consumable_cover") {
                                            premium_breakup[key][sub_key] = objAddon.C101111 === undefined ? 0 : Math.round(objAddon.C101111);
                                            addon_final += objAddon.C101111 === undefined ? 0 : Math.round(objAddon.C101111);
                                        } else if (sub_key === "addon_personal_belonging_loss_cover") {
                                            premium_breakup[key][sub_key] = objAddon.C101075 === undefined ? 0 : Math.round(objAddon.C101075);
                                            addon_final += objAddon.C101075 === undefined ? 0 : Math.round(objAddon.C101075);
                                        } else if (sub_key === "addon_key_lock_cover") {
                                            premium_breakup[key][sub_key] = objAddon.C101073 === undefined ? 0 : Math.round(objAddon.C101073);
                                            addon_final += objAddon.C101073 === undefined ? 0 : Math.round(objAddon.C101073);
                                        } else if (sub_key === "addon_inconvenience_allowance_cover") {
                                            premium_breakup[key][sub_key] = objAddon.C101074 === undefined ? 0 : Math.round(objAddon.C101074);
                                            addon_final += objAddon.C101074 === undefined ? 0 : Math.round(objAddon.C101074);
                                        } else if (sub_key === "addon_tyre_coverage_cover") {
                                            premium_breakup[key][sub_key] = objAddon.C101110 === undefined ? 0 : Math.round(objAddon.C101110);
                                            addon_final += objAddon.C101110 === undefined ? 0 : Math.round(objAddon.C101110);
                                        } else if (sub_key === "addon_zero_dep_cover") {
                                            premium_breakup[key][sub_key] = objAddon.C101072 === undefined ? 0 : Math.round(objAddon.C101072);
                                            addon_final += objAddon.C101072 === undefined ? 0 : Math.round(objAddon.C101072);
                                        } else if (sub_key === "addon_mandatory_deduction_protect") {
                                            premium_breakup[key][sub_key] = 0;
                                        } else if (sub_key === "addon_windshield_cover") {
                                            premium_breakup[key][sub_key] = 0;
                                        }
                                    }
                                }
                            }
                            premium += tp_final + od_final + addon_final;
                            premium_breakup["net_premium"] = premium;
                            premium_breakup["service_tax"] = Math.round(objResponseJson["TGST"]);
                            premium_breakup["final_premium"] = objResponseJson['DuePremium'];
                            if (key === "addon") {
                                premium_breakup[key]["addon_final_premium"] = addon_final;
                            }
                            if (key === "liability") {
                                premium_breakup[key]["tp_final_premium"] = tp_final;
                            }
                            if (key === "own_damage") {
                                premium_breakup[key]["od_final_premium"] = od_final;
                            }
                        }
                    }
                    objServiceHandler.Premium_Breakup = premium_breakup;
                    //objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['UniqueTransactionID'];
                    objServiceHandler.Insurer_Transaction_Identifier = '';
                } else {
                    Error_Msg = objResponseJson['ErrorMessage'];
                }
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
        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
SBIGeneralE2EMotor.prototype.insurer_vehicle_idv = function (objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback) {
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
        docLog.Insurer_Request = docLog.Insurer_Request.replace(undefined, 0);
        docLog.Insurer_Request = docLog.Insurer_Request.replace('"IDV_User": ,', '"IDV_User": 0,');
        docLog.Insurer_Request = docLog.Insurer_Request.replace(undefined, 0);
        docLog.Insurer_Request = docLog.Insurer_Request.replace(undefined, 0);
        this.service_call(docLog, objProduct, Insurer_Object, specific_insurer_object);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_vehicle_idv', ex);
    }
};
SBIGeneralE2EMotor.prototype.customer_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'customer_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Customer': null
    };
    try {
        if (objResponseJson.hasOwnProperty("ValidateResult") && objResponseJson.ValidateResult.hasOwnProperty("message") && objResponseJson.ValidateResult.message !== "") {
            Error_Msg = objResponseJson.ValidateResult.message;
        }
        if (objResponseJson.hasOwnProperty("messages") && objResponseJson.messages !== "") {
            Error_Msg = objResponseJson.messages[0].message;
        }
        if (objResponseJson.hasOwnProperty("httpMessage") && objResponseJson.httpMessage !== "") {
            Error_Msg = objResponseJson.httpMessage;
        }
        if (Error_Msg === 'NO_ERR') {
            if (objResponseJson.hasOwnProperty('UnderwritingResult')) {
                if (objResponseJson.UnderwritingResult.Status !== "Success") {
                    Error_Msg = objResponseJson.UnderwritingResult.MessageList[0].Message;
                }
            }
        }
        if (Error_Msg === 'NO_ERR') {
            if (objResponseJson.hasOwnProperty('PolicyObject')) {
                var Customer = {
                    'final_premium_verified': parseInt(objResponseJson.PolicyObject['DuePremium']),
                    'insurer_customer_identifier': objResponseJson.PolicyObject["PolicyId"] + "-" + objResponseJson.PolicyObject["QuotationNo"]
                };
                objServiceHandler.Customer = Customer;
            }
            //objServiceHandler.Insurer_Transaction_Identifier = objResponseJson.PolicyObject.PolicyLobList[0].PolicyRiskList[0].IDV_Suggested + "_" + objResponseJson.PolicyObject.PolicyLobList[0].PolicyRiskList[0].MaxIDV_Suggested + "_" + objResponseJson.PolicyObject.PolicyLobList[0].PolicyRiskList[0].MinIDV_Suggested;
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
SBIGeneralE2EMotor.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objPremiumService = objResponseJson;
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    var objInsurerProduct = this;
    try {
        if ([1, 10].indexOf(this.lm_request['product_id']) > -1) {
            if (objResponseJson.hasOwnProperty('moreInformation') && objResponseJson.moreInformation !== "") {
                Error_Msg = objResponseJson.moreInformation;
            }
            if (objResponseJson.hasOwnProperty('ValidateResult') && objResponseJson.ValidateResult.message !== "") {
                Error_Msg = objResponseJson.ValidateResult.message;
            }
        } else {
            if (objResponseJson.status === 'ERR') {
                Error_Msg = objResponseJson.msg;
            }
        }
        if([10].indexOf(this.lm_request['product_id']) > -1){
            if (objResponseJson.hasOwnProperty('messages') && objResponseJson.messages !== "") {
                Error_Msg = objResponseJson.messages[0]["message"];
            }
        }
        if (this.lm_request['vehicle_insurance_type'] === 'renew') {
            if ((this.processed_request['___engine_number___']).length < 5 || (this.processed_request['___engine_number___']).length > 20) {
                Error_Msg = 'Engine Number : min 5 character and max 20 characters';
            }
            if ((this.processed_request['___chassis_number___']).length < 5 || (this.processed_request['___chassis_number___']).length > 20) {
                Error_Msg = 'Chassis Number : min 5 character and max 20 characters';
            }
            if (this.lm_request['is_policy_exist'] === "yes") {
                if ((this.processed_request['___previous_policy_number___']).length < 5 || (this.processed_request['___previous_policy_number___']).length > 35) {
                    Error_Msg = 'Previous Year Policy Number : min 5 character and max 35 characters';
                }
            }
        }
        if (Error_Msg === 'NO_ERR') {
            var objLMPremium = objPremiumService;
            if(objLMPremium.hasOwnProperty('UnderwritingResult')){
                if (objLMPremium.UnderwritingResult['Status'] === "Success") {
                    if ([1].indexOf(this.lm_request['product_id']) > -1) {
                        var objPremiumVerification = this.premium_verification(this.lm_request['final_premium'], this.processed_request['___final_premium_verified___'], 35, 10);
                        // var Received_Premium = parseInt(objResponseJson['DuePremium']);
                        if (objPremiumVerification.Status) {
                        } else {
                            Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
                        }
                    } else if ([10].indexOf(this.lm_request['product_id']) > -1) {
                        let Received_Premium = parseInt(objResponseJson.PolicyObject['DuePremium']);
                        var objPremiumVerification = this.premium_verification(this.lm_request['final_premium'], Received_Premium, 35, 10);
                        if (objPremiumVerification.Status) {
                        } else {
                            Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
                        }
                    }
                } else {
                    Error_Msg = objLMPremium.UnderwritingResult['Status'];
                }
            }
            if (objResponseJson.hasOwnProperty('UnderwritingResult')) {
                if (objResponseJson.UnderwritingResult.Status !== "Success") {
                    Error_Msg = objResponseJson.UnderwritingResult.MessageList[0].Message;
                }
            }

            if (Error_Msg === 'NO_ERR' && this.lm_request.hasOwnProperty('pay_from') && this.lm_request['pay_from'] === 'wallet') {
                try {
                    let policy_number = objResponseJson.policy_number.toString();
                    this.processed_request['___policy_number_generate___'] = policy_number;
                    var pg_data = {
                        'ss_id': objInsurerProduct.lm_request['ss_id'],
                        'crn': objInsurerProduct.lm_request['crn'],
                        'User_Data_Id': objInsurerProduct.lm_request['udid'],
                        'product_id': objInsurerProduct.lm_request['product_id'],
                        'premium_amount': ([819].indexOf(parseInt(objInsurerProduct.lm_request['ss_id'])) > -1) ? 1 : objInsurerProduct.lm_request['final_premium'],
                        'customer_name': objInsurerProduct.lm_request['first_name'] + " " + objInsurerProduct.lm_request['last_name'],
                        'txnid': policy_number,
                        'pg_type': "wallet"
                    };
                    objServiceHandler.Payment.pg_data = pg_data;
                    objServiceHandler.Payment.pg_redirect_mode = 'POST';
                    objServiceHandler.Payment.pg_url = ((config.environment.name === 'Production') ? "https://www.policyboss.com/wallet-confirm" : "http://qa.policyboss.com/TransactionDetail_Form/index.html") + "?udid=" + this.lm_request['udid'];
                } catch (ex) {
                    var Err = {
                        'Type': 'LM',
                        'Msg': ex.stack
                    };
                    objServiceHandler.Error_Msg = JSON.stringify(Err);
                    console.error('Exception', this.constructor.name, 'Wallet_proposal_response_handler', objServiceHandler);
                }
            }
            if (Error_Msg === 'NO_ERR' && [10].indexOf(this.lm_request['product_id']) > -1) {
                objServiceHandler.Insurer_Transaction_Identifier = objResponseJson.PolicyObject["PolicyId"] + "-" + objResponseJson.PolicyObject["QuotationNo"];
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
        console.log('Finish', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
SBIGeneralE2EMotor.prototype.pg_response_handler = function () {
    try {
        let objInsurerProduct = this;
        let output;
        if ([1, 10].indexOf(this.lm_request['product_id']) > -1) {
            if (objInsurerProduct.proposal_processed_request.hasOwnProperty('___pay_from___') && objInsurerProduct.proposal_processed_request['___pay_from___'] === 'wallet') {
                output = objInsurerProduct.const_payment_response.pg_post;
            } else {
                output = objInsurerProduct.const_payment_response.pg_get;
            }
        } else {
            output = objInsurerProduct.const_payment_response.pg_post;
        }
        if (objInsurerProduct.proposal_processed_request.hasOwnProperty('___pay_from___') && objInsurerProduct.proposal_processed_request['___pay_from___'] === 'wallet') {
            if (output['status'] === 'Success') {
                this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.transaction_id = output['txnid']; //payment id
                this.const_policy.transaction_amount = output['amount']; //amount
                this.const_policy.pg_reference_number_1 = output['order_id']; //order id
                this.const_policy.pg_reference_number_2 = output['transfer_id']; // transfer id
                this.const_policy.pg_reference_number_3 = moment(this.proposal_processed_request['___current_date___'], 'DD/MM/YYYY').format("YYYY-MM-DD");
            } else {
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
            }
        } else {
            try {
                console.log('Start', this.constructor.name, 'pg_response_handler');
                var date = new Date();
                var PaymentDate = moment(date).format('YYYY-MM-DD');
                if (output.hasOwnProperty('Status') && output['Status'] === 'Success') {
                    this.const_policy.transaction_id = output['PayId'];
                    this.const_policy.transaction_amount = objInsurerProduct.const_payment_response.pg_data.amount;
                    this.const_policy.pg_reference_number_1 = output['OrderId'];
                    this.const_policy.pg_reference_number_2 = objInsurerProduct.const_payment_response.pg_data.transfer_id;
                    this.const_policy.pg_reference_number_3 = moment(this.proposal_processed_request['___current_date___'], 'DD/MM/YYYY').format("YYYY-MM-DD");
                    // this.const_policy.pg_reference_number_3 = PaymentDate;
                    if (output.hasOwnProperty('Signature') && output.Signature) {
                        var secret_key = config.razor_pay.rzp_sbi.password;
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
                console.error('End', this.constructor.name, 'pg_response_handler', this.const_policy);
            } catch (ex) {
                console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
            }
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
SBIGeneralE2EMotor.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';
    var pdf = require('html-pdf');
    var objInsurerProduct = this;
    try {
        // var Error_Msg = 'NO_ERR';
        var sub = "";
        var Email = require('../../models/email');
        var objModelEmail = new Email();
        var product_name = 'CAR';
        if (this.const_policy.pg_status === 'FAIL') {

        }
        if (this.const_policy.pg_status === 'SUCCESS') {
            if (this.lm_request['product_id'] === 1 || this.lm_request['product_id'] === 10) {
                if (objResponseJson.hasOwnProperty('ValidateResult') && objResponseJson.ValidateResult[0].hasOwnProperty('message')) {
                    Error_Msg = objResponseJson.ValidateResult[0].message;
                }
                if (objResponseJson.hasOwnProperty('PolicyNo')) {
                    this.const_policy.policy_number = objResponseJson['PolicyNo'];
                } else {
                    Error_Msg = (Error_Msg === 'NO_ERR') ? "LM_POLICY_NUMBER_NA" : Error_Msg;
                }
            } else {
                if (this.const_policy.hasOwnProperty('policy_number') === false || this.const_policy.policy_number === '' || this.const_policy.policy_number === null || (this.const_policy.policy_number).indexOf('SBI') > -1 === false || this.const_policy.policy_number === 'Err_Pol_Num_Gnrt' || this.const_policy.policy_number.toString().length <= 7) {
                    Error_Msg = 'ERROR IN POLICY NUMBER GENERATION';
                }
            }
            if (Error_Msg === 'NO_ERR') {
                if (objResponseJson.hasOwnProperty('UnderwritingResult')) {
                    if (objResponseJson.UnderwritingResult.Status !== "Success") {
                        Error_Msg = objResponseJson.UnderwritingResult.MessageList[0].Message;
                    }
                }
            }
            if (Error_Msg === 'NO_ERR') {
                this.const_policy.transaction_status = 'SUCCESS';
                var policy_number = objResponseJson.PolicyNo;
                objInsurerProduct.const_policy.policy_number = ((objResponseJson.PolicyNo === undefined) ? "" : objResponseJson.PolicyNo);
                var pdf_file_name = this.constructor.name + '_' + product_name + '_POLICY_' + policy_number + '.pdf';
                var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                // var html_file_name = this.constructor.name + '_' + product_name + '_POLICY_' + policy_number + '.html';
                var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                //var html_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + html_file_name;
                var pdf_sys_loc_portal = config.pb_config.pdf_system_loc + pdf_file_name;
                objInsurerProduct.const_policy.policy_url = pdf_web_path_portal;
                var args = {
                    data: {
                        "search_reference_number": objInsurerProduct.lm_request['search_reference_number'],
                        "api_reference_number": objInsurerProduct.lm_request['api_reference_number'],
                        "policy_number": objResponseJson.PolicyNo,
                        "policy_code": objResponseJson.QuotationNo,
                        "proposal_number": objResponseJson.ProposalNo,
                        "proposal_date": objResponseJson.ProposalDate,
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
                sleep(40000);
                objInsurerProduct.pdf_call(config.environment.weburl + '/quote/pdf_initiate', args, pdf_sys_loc);
            } else {
                this.const_policy.transaction_status = 'PAYPASS';
            }
        }
        console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', objServiceHandler);
    }
    objServiceHandler.Policy = this.const_policy;
    objServiceHandler.Error_Msg = Error_Msg;
    return objServiceHandler;
};
SBIGeneralE2EMotor.prototype.pdf_call = function (url, args, pdf_sys_loc) {
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
SBIGeneralE2EMotor.prototype.pdf_response_handler = function (objResponseJson) {
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
        var policy = {
            'policy_url': null,
            'policy_number': this.lm_request['policy_number'],
            'pdf_status': null
        };
        var objProduct = this;
        objProduct['policy'] = policy;
        if (Error_Msg === 'NO_ERR') {
            if (objResponseJson.hasOwnProperty('UnderwritingResult')) {
                if (objResponseJson.UnderwritingResult.Status !== "Success") {
                    Error_Msg = objResponseJson.UnderwritingResult.MessageList[0].Message;
                }
            }
        }
        if (Error_Msg === 'NO_ERR') {
            if (objPremiumService.hasOwnProperty('Description') && objPremiumService['Description'] === 'Success') {
                var product_name = 'CAR';
                var pdf_file_name = this.constructor.name + '_' + product_name + '_POLICY_' + this.lm_request['policy_number'] + '.pdf';
                var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                //var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name; // for qa
                var pdf_web_path_portal = config.environment.weburl + config.pb_config.pdf_web_loc + pdf_file_name; // for local
                var pdf_web_path = config.environment.weburl + "/pdf/" + pdf_file_name;
                var binary = new Buffer(objPremiumService.DocBase64, 'base64');
                fs.writeFileSync(pdf_sys_loc, binary);
                policy.policy_url = pdf_web_path_portal;
                this.const_policy.insurer_policy_url = pdf_web_path_portal;
                this.const_policy.policy_url = pdf_web_path_portal;
                policy.pdf_status = 'SUCCESS';
                policy.policy_number = this.lm_request['policy_number'];
            } else {
                Error_Msg = objPremiumService['Description'];
                policy.pdf_status = 'FAIL';
            }
            objServiceHandler.Policy = policy;
            objServiceHandler.Insurer_Transaction_Identifier = this.lm_request['policy_number'];
        } else {
            policy.pdf_status = 'FAIL';
        }
        console.log('Finish', this.constructor.name, 'pdf_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'pdf_response_handler', ex);
    }
    objServiceHandler.Policy = policy;
    objServiceHandler.Error_Msg = Error_Msg;
    return objServiceHandler;
};
SBIGeneralE2EMotor.prototype.vehicle_age_year = function () {
    var age_in_year = 0;
    try {
        var vehicle_registration_date = this.lm_request['vehicle_registration_date'];
        var policy_start_date = this.prepared_request['policy_start_date'];
        var date1 = new Date(policy_start_date);
        var date2 = new Date(vehicle_registration_date); //mm/dd/yyyy
        var diff_date = date1 - date2;
        var num_years = diff_date / 31536000000;
        var num_months = (diff_date % 31536000000) / 2628000000;
        var num_days = ((diff_date % 31536000000) % 2628000000) / 86400000;
        age_in_year = Math.floor(num_years);
        var age_in_days = Math.floor(num_days);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'vehicle_age_year', ex);
        return age_in_year;
    }
    return age_in_year;
};
SBIGeneralE2EMotor.prototype.lv_quote_no = function () {
    try {
        return this.create_guid('', 'numeric', 7);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'lv_quote_no', ex);
        return 0;
    }
};
SBIGeneralE2EMotor.prototype.current_date_time = function () {
    var date = new moment().format('DD-MMM-YYYY-hh:mm:ss');
    return date;
};
SBIGeneralE2EMotor.prototype.current_time = function () {
    var time = new moment().format('HH:mm:ss');
    return time;
};
SBIGeneralE2EMotor.prototype.premium_breakup_schema = {

    "own_damage": {
        "od_basic": "",
        "od_elect_access": "",
        "od_non_elect_access": "",
        "od_cng_lpg": "",
        "od_disc_ncb": "",
        "od_disc_vol_deduct": "",
        "od_disc_anti_theft": "",
        "od_disc_aai": null,
        "od_loading": "LoadingAmount",
        "od_helmet_cover": null,
        "od_disc": null,
        "od_final_premium": "OD_PREMIUM"
    },
    "liability": {
        "tp_basic": "",
        "tp_cover_owner_driver_pa": "",
        "tp_cover_unnamed_passenger_pa": "",
        "tp_cover_named_passenger_pa": "",
        "tp_cover_paid_driver_pa": "",
        "tp_cover_paid_driver_ll": "",
        "tp_cng_lpg": "",
        "tp_final_premium": "TP_PREMIUM",
        "tp_cover_tppd": ""
    },
    "addon": {
        "addon_zero_dep_cover": "",
        "addon_road_assist_cover": "",
        "addon_ncb_protection_cover": "",
        "addon_engine_protector_cover": "",
        "addon_invoice_price_cover": "",
        "addon_key_lock_cover": "",
        "addon_consumable_cover": "",
        "addon_daily_allowance_cover": null,
        "addon_windshield_cover": null,
        "addon_passenger_assistance_cover": null,
        "addon_tyre_coverage_cover": null,
        "addon_personal_belonging_loss_cover": "",
        "addon_inconvenience_allowance_cover": "",
        "addon_medical_expense_cover": null,
        "addon_hospital_cash_cover": null,
        "addon_ambulance_charge_cover": null,
        "addon_rodent_bite_cover": null,
        "addon_losstime_protection_cover": null,
        "addon_hydrostatic_lock_cover": null,
        "addon_mandatory_deduction_protect": null,
        "addon_final_premium": 0
    },
    "net_premium": "totalNetPremium",
    "service_tax": "service_tax",
    "final_premium": "final_premium"
};
module.exports = SBIGeneralE2EMotor;