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

function RahejaQBEMotor() {

}
util.inherits(RahejaQBEMotor, Motor);

RahejaQBEMotor.prototype.lm_request_single = {};
RahejaQBEMotor.prototype.insurer_integration = {};
RahejaQBEMotor.prototype.insurer_addon_list = [];
RahejaQBEMotor.prototype.insurer = {};
RahejaQBEMotor.prototype.pdf_attempt = 0;
RahejaQBEMotor.prototype.insurer_date_format = 'yyyy-MM-dd';


RahejaQBEMotor.prototype.insurer_product_api_pre = function () {

};
RahejaQBEMotor.prototype.insurer_product_field_process_pre = function () {
    try {
        if (this.lm_request['vehicle_manf_date'] !== null) {
            var vehicleManfDate = this.lm_request['vehicle_manf_date'];
            var yr = vehicleManfDate.split('-')[0];
            var mth = vehicleManfDate.split('-')[1];
            this.prepared_request['vehicleManfMonth'] = mth;
            this.processed_request['___vehicleManfMonth___'] = mth;
        }
        if ((this.prepared_request['vehicle_age_month'] > 48)) {
            this.method_content = this.method_content.replace('___addon_invoice_price_cover___', 'false');
        }
        this.prepared_request['previous_insurer_id'] = this.insurer_master.prev_insurer.insurer_db_master.PreviousInsurer_Code;
        this.processed_request['___previous_insurer_id___'] = this.prepared_request['previous_insurer_id'];

        if (this.processed_request['___vehicle_registration_type___'] === "individual") {
            if (this.processed_request['___salutation___'] !== null && this.processed_request['___salutation___'] !== "" && this.processed_request['___salutation___'] !== undefined) {
                if (this.processed_request['___salutation___'] === "MR") {
                    this.prepared_request['reb_salutation'] = 7;
                    this.processed_request['___reb_salutation___'] = this.prepared_request['reb_salutation'];
                } else if (this.processed_request['___salutation___'] === "MRS") {
                    this.prepared_request['reb_salutation'] = 8;
                    this.processed_request['___reb_salutation___'] = this.prepared_request['reb_salutation'];
                } else if (this.processed_request['___salutation___'] === "MS") {
                    this.prepared_request['reb_salutation'] = 9;
                    this.processed_request['___reb_salutation___'] = this.prepared_request['reb_salutation'];
                } else if (this.processed_request['___salutation___'] === "DR") {
                    this.prepared_request['reb_salutation'] = 10;
                    this.processed_request['___reb_salutation___'] = this.prepared_request['reb_salutation'];
                } else if (this.processed_request['___salutation___'] === "MISS") {
                    this.prepared_request['reb_salutation'] = 11;
                    this.processed_request['___reb_salutation___'] = this.prepared_request['reb_salutation'];
                }
            }
        } else {
            this.prepared_request['reb_salutation'] = "";
            this.processed_request['___reb_salutation___'] = this.prepared_request['reb_salutation'];
        }
        if (this.processed_request['___gender___'] !== null && this.processed_request['___gender___'] !== "" && this.processed_request['___gender___'] !== undefined) {
            if (this.processed_request['___gender___'] === "M") {
                this.prepared_request['gen'] = 20;
                this.processed_request['___gen___'] = this.prepared_request['gen'];
            } else if (this.processed_request['___gender___'] === "F") {
                this.prepared_request['gen'] = 21;
                this.processed_request['___gen___'] = this.prepared_request['gen'];
            }
        }
        if (this.processed_request['___vehicle_registration_type___'] !== null && this.processed_request['___vehicle_registration_type___'] !== "" && this.processed_request['___vehicle_registration_type___'] !== undefined) {
            if (this.processed_request['___vehicle_registration_type___'] === "individual") {
                this.prepared_request['client_type'] = 0;
                this.processed_request['___client_type___'] = this.prepared_request['client_type'];
            } else {
                this.prepared_request['client_type'] = 1;
                this.processed_request['___client_type___'] = this.prepared_request['client_type'];
            }
        }
        if (this.lm_request['method_type'] === 'Proposal') {
            var policyId = this.processed_request['___insurer_customer_identifier___'];
            if (policyId !== null && policyId !== "" && policyId !== undefined) {
                this.prepared_request['policy_id'] = policyId;
                this.processed_request['___policy_id___'] = this.prepared_request['policy_id'];
            }
            if (this.lm_request['vehicle_insurance_type'] === 'renew' && (this.lm_request['is_valid_pucc'] !== null && this.lm_request['is_valid_pucc'] !== undefined) && this.lm_request.hasOwnProperty('is_valid_pucc') && this.lm_request['is_valid_pucc'] === "yes") {
                this.prepared_request['pucc_number'] = this.lm_request['pucc_number'];
                this.processed_request['___pucc_number___'] = this.prepared_request['pucc_number'];

                var pucdate = this.lm_request['pucc_end_date'].split("-");
                this.prepared_request['pucc_end_date'] = pucdate[2] + "-" + pucdate[1] + "-" + pucdate[0];
                this.processed_request['___pucc_end_date___'] = this.prepared_request['pucc_end_date'];
            } else {
                this.prepared_request['pucc_number'] = "";
                this.processed_request['___pucc_number___'] = this.prepared_request['pucc_number'];

                this.prepared_request['pucc_end_date'] = "";
                this.processed_request['___pucc_end_date___'] = this.prepared_request['pucc_end_date'];
            }
            if (this.lm_request['is_reg_addr_comm_addr_same'] === "yes") {
                this.prepared_request['area_locality'] = this.lm_request['permanent_locality_code_text'];
                this.processed_request['___area_locality___'] = this.prepared_request['area_locality'];

                this.prepared_request['same_Comm_Reg_addr'] = true;
                this.processed_request['___same_Comm_Reg_addr___'] = this.prepared_request['same_Comm_Reg_addr'];
            } else {
                this.prepared_request['area_locality'] = this.lm_request['communication_locality_code_text'];
                this.processed_request['___area_locality___'] = this.prepared_request['area_locality'];

                this.prepared_request['same_Comm_Reg_addr'] = false;
                this.processed_request['___same_Comm_Reg_addr___'] = this.prepared_request['same_Comm_Reg_addr'];
            }
            this.prepared_request['permanent_locality'] = this.lm_request['permanent_locality_code_text'];
            this.processed_request['___permanent_locality___'] = this.prepared_request['permanent_locality'];

            if (this.processed_request['___is_hypothicated___'] === "true") {
                this.prepared_request['financier_address'] = this.processed_request['___communication_city___'];
                this.processed_request['___financier_address___'] = this.prepared_request['financier_address'];

                this.prepared_request['financier_name'] = this.processed_request['___financial_institute_code___'];
                this.processed_request['___financier_name___'] = this.prepared_request['financier_name'];
            } else {
                this.prepared_request['financier_address'] = "";
                this.processed_request['___financier_address___'] = this.prepared_request['financier_address'];

                this.prepared_request['financier_name'] = "";
                this.processed_request['___financier_name___'] = this.prepared_request['financier_name'];
            }
            if (this.processed_request['___financial_agreement_type___'] !== "0") {
                if (this.processed_request['___financial_agreement_type___'] === "Hypothecation") {
                    this.prepared_request['financier_type'] = 1;
                    this.processed_request['___financier_type___'] = this.prepared_request['financier_type'];
                } else if (this.processed_request['___financial_agreement_type___'] === "Hire Purchase") {
                    this.prepared_request['financier_type'] = 2;
                    this.processed_request['___financier_type___'] = this.prepared_request['financier_type'];
                } else if (this.processed_request['___financial_agreement_type___'] === "Lease agreement") {
                    this.prepared_request['financier_type'] = 3;
                    this.processed_request['___financier_type___'] = this.prepared_request['financier_type'];
                }
            } else {
                this.prepared_request['financier_type'] = "";
                this.processed_request['___financier_type___'] = this.prepared_request['financier_type'];
            }
            if (this.lm_request['vehicle_insurance_subtype'] === '1OD_0TP') {
                console.error("od error dipali " + JSON.stringify(this.Master_Details));
                var insurer_adress = this.Master_Details.tp_insurer['PreviousInsurer_City'].toString();
                this.prepared_request['tp_insurer_address'] = insurer_adress;
                this.processed_request['___tp_insurer_address___'] = this.prepared_request['tp_insurer_address'];

                this.prepared_request['tp_insurer_id'] = this.insurer_master.tp_insurer.insurer_db_master['PreviousInsurer_Id'];
                //this.prepared_request['tp_insurer_id'] = this.Master_Details.tp_insurer['Insurer_ID'];
                this.processed_request['___tp_insurer_id___'] = this.prepared_request['tp_insurer_id'];
            }
        }
        if (this.lm_request['method_type'] === 'Verification') {
            var TxnNo = (this.processed_request['___pg_reference_number_1___']);
            var RBE_quote_No = (this.processed_request['___dbmaster_insurer_transaction_identifier___']).split("-")[3];

            if (TxnNo !== null && TxnNo !== "" && TxnNo !== undefined) {
                this.prepared_request['txn_no'] = TxnNo;
                this.processed_request['___txn_no___'] = this.prepared_request['txn_no'];
            }
            if (RBE_quote_No !== null && RBE_quote_No !== "" && RBE_quote_No !== undefined) {
                this.prepared_request['rbe_quote_no'] = RBE_quote_No;
                this.processed_request['___rbe_quote_no___'] = this.prepared_request['rbe_quote_no'];
            }
            this.prepared_request['trace_id'] = (this.processed_request['___dbmaster_insurer_transaction_identifier___']).split("-")[4];
            this.processed_request['___trace_id___'] = this.prepared_request['trace_id'];
        }
        if (this.processed_request['___registration_no_3___'] === "" || this.processed_request['___registration_no_4___'] === "") {
            this.processed_request['___registration_no_3___'] = "AB";
            this.processed_request['___registration_no_4___'] = "1234";
        }
        if (this.processed_request['___is_hypothicated___'] !== "true") {
            this.processed_request['___financial_agreement_type___'] = "";
        }
        if (this.lm_request['vehicle_insurance_type'] === 'new') {
            this.prepared_request['prev_zero_cover'] = "";
            this.processed_request['___prev_zero_cover___'] = this.prepared_request['prev_zero_cover'];

            this.prepared_request['businessTypeId'] = 24;
            this.processed_request['___businessTypeId___'] = this.prepared_request['businessTypeId'];

            this.prepared_request['Policy_end_date'] = this.processed_request['___policy_end_date_extended___'];
            this.processed_request['___Policy_end_date___'] = this.prepared_request['Policy_end_date'];

            this.prepared_request['str_od_date'] = this.processed_request['___policy_end_date___'];
            this.processed_request['___str_od_date___'] = this.prepared_request['str_od_date'];

            if (this.lm_request['product_id'] === 10) {
                this.prepared_request['registration_no_1'] = "";
                this.processed_request['___registration_no_1___'] = this.prepared_request['registration_no_1'];

                this.prepared_request['registration_no_2'] = "";
                this.processed_request['___registration_no_2___'] = this.prepared_request['registration_no_2'];

                this.prepared_request['registration_no_3'] = "";
                this.processed_request['___registration_no_3___'] = this.prepared_request['registration_no_3'];

                this.prepared_request['registration_no_4'] = "";
                this.processed_request['___registration_no_4___'] = this.prepared_request['registration_no_4'];
            }

        } else {
            this.prepared_request['prev_zero_cover'] = "Yes";
            this.processed_request['___prev_zero_cover___'] = this.prepared_request['prev_zero_cover'];

            this.prepared_request['businessTypeId'] = 25;
            this.processed_request['___businessTypeId___'] = this.prepared_request['businessTypeId'];

            this.prepared_request['Policy_end_date'] = this.processed_request['___policy_end_date___'];
            this.processed_request['___Policy_end_date___'] = this.prepared_request['Policy_end_date'];

            this.prepared_request['str_od_date'] = "";
            this.processed_request['___str_od_date___'] = this.prepared_request['str_od_date'];
        }
        if (this.processed_request['___vehicle_registration_type___'] === "corporate") {
            this.method_content = this.method_content.replace('___first_name___', '');
            this.method_content = this.method_content.replace('___last_name___', '');
            this.method_content = this.method_content.replace('___gen___', '');
            this.method_content = this.method_content.replace('___birth_date___', '');
            this.method_content = this.method_content.replace('___occupation___', '');

            this.prepared_request['pa_owner_cover'] = false;
            this.processed_request['___pa_owner_cover___'] = this.prepared_request['pa_owner_cover'];

            this.method_content = this.method_content.replace('___nominee_age___', '');
            this.method_content = this.method_content.replace('___nominee_name___', '');
            this.method_content = this.method_content.replace('___nominee_relation___', '');
            this.method_content = this.method_content.replace('___pa_owner_driver_si___', '');
            this.method_content = this.method_content.replace('___appointee_name___', '');
            this.method_content = this.method_content.replace('___appointee_relation___', '');
            this.method_content = this.method_content.replace('___pa_tenure___', '');

            this.prepared_request['pa_owner_field1'] = "false";
            this.processed_request['___pa_owner_field1___'] = this.prepared_request['pa_owner_field1'];

            this.prepared_request['pa_owner_field2'] = "false";
            this.processed_request['___pa_owner_field2___'] = this.prepared_request['pa_owner_field2'];

            this.prepared_request['pa_owner_field3'] = "";
            this.processed_request['___pa_owner_field3___'] = this.prepared_request['pa_owner_field3'];

            this.prepared_request['pa_owner_field4'] = "";
            this.processed_request['___pa_owner_field4___'] = this.prepared_request['pa_owner_field4'];

            this.prepared_request['pa_owner_field5'] = "";
            this.processed_request['___pa_owner_field5___'] = this.prepared_request['pa_owner_field5'];

            this.prepared_request['pa_owner_field6'] = "";
            this.processed_request['___pa_owner_field6___'] = this.prepared_request['pa_owner_field6'];

            this.prepared_request['pa_owner_field7'] = "";
            this.processed_request['___pa_owner_field7___'] = this.prepared_request['pa_owner_field7'];

            this.prepared_request['vehicleColor'] = "";
            this.processed_request['___vehicleColor___'] = this.prepared_request['vehicleColor'];

        } else {
            this.prepared_request['pa_owner_cover'] = true;
            this.processed_request['___pa_owner_cover___'] = this.prepared_request['pa_owner_cover'];

            this.prepared_request['pa_owner_field1'] = "false";
            this.processed_request['___pa_owner_field1___'] = this.prepared_request['pa_owner_field1'];

            this.prepared_request['pa_owner_field2'] = "false";
            this.processed_request['___pa_owner_field2___'] = this.prepared_request['pa_owner_field2'];

            this.prepared_request['pa_owner_field3'] = "17";
            this.processed_request['___pa_owner_field3___'] = this.prepared_request['pa_owner_field3'];

            this.prepared_request['pa_owner_field4'] = "aaa";
            this.processed_request['___pa_owner_field4___'] = this.prepared_request['pa_owner_field4'];

            this.prepared_request['pa_owner_field5'] = "1548";
            this.processed_request['___pa_owner_field5___'] = this.prepared_request['pa_owner_field5'];

            this.prepared_request['pa_owner_field6'] = "jujihdf";
            this.processed_request['___pa_owner_field6___'] = this.prepared_request['pa_owner_field6'];

            this.prepared_request['pa_owner_field7'] = "1134";
            this.processed_request['___pa_owner_field7___'] = this.prepared_request['pa_owner_field7'];

            if (this.lm_request['method_type'] === 'Proposal' && this.lm_request['vehicle_color'] !== null && this.lm_request['vehicle_color'] !== "" && this.lm_request['vehicle_color'] !== undefined) {
                var ColorOfVehicle = {
                    'Black': 1,
                    'White': 2,
                    'Metallic': 3,
                    'Voilet': 5,
                    'Indigo': 6,
                    'Blue': 7,
                    'Green': 8,
                    'Yellow': 9,
                    'Orange': 10,
                    'Red': 11,
                    'Others': 12,
                    'Non Metallic': 13
                };
                if (ColorOfVehicle[this.lm_request['vehicle_color']] !== undefined) {
                    this.prepared_request['vehicleColor'] = ColorOfVehicle[this.lm_request['vehicle_color']];
                    this.processed_request['___vehicleColor___'] = this.prepared_request['vehicleColor'];
                } else {
                    this.prepared_request['vehicleColor'] = 12;
                    this.processed_request['___vehicleColor___'] = this.prepared_request['vehicleColor'];
                }
            } else {
                this.prepared_request['vehicleColor'] = 12;
                this.processed_request['___vehicleColor___'] = this.prepared_request['vehicleColor'];
            }
        }
        if (this.lm_request['is_claim_exists'] === 'yes') {
            this.prepared_request['isClaimExists'] = 1;
            this.processed_request['___isClaimExists___'] = 1;
            this.prepared_request['ntr_of_loss'] = 1;
            this.processed_request['___ntr_of_loss___'] = this.prepared_request['ntr_of_loss'];
            /*if(this.lm_request['vehicle_insurance_subtype'] === "0CH_1TP"){
             this.prepared_request['ntr_of_loss'] = 2;
             this.processed_request['___ntr_of_loss___'] = this.prepared_request['ntr_of_loss'];
             }else{
             this.prepared_request['ntr_of_loss'] = 1;
             this.processed_request['___ntr_of_loss___'] = this.prepared_request['ntr_of_loss'];
             } */
            if (this.lm_request['vehicle_insurance_type'] === 'renew') {
                if ((this.prepared_request['vehicle_age_month'] >= 24 || this.prepared_request['vehicle_age_month'] < 12)) {
                    this.method_content = this.method_content.replace('___addon_zero_dep_cover___', 'false');
                }
            }
        } else {
            this.prepared_request['isClaimExists'] = 2;
            this.processed_request['___isClaimExists___'] = 2;

            this.prepared_request['ntr_of_loss'] = "";
            this.processed_request['___ntr_of_loss___'] = this.prepared_request['ntr_of_loss'];
        }
        if (this.lm_request['prev_insurer_id'] !== null && this.lm_request['prev_insurer_id'] !== undefined) {
            this.prepared_request['PrevInsId'] = this.lm_request['prev_insurer_id'];
            this.processed_request['___PrevInsId___'] = this.lm_request['prev_insurer_id'];
        }

        if (this.lm_request['is_pa_od'] === "no" && this.processed_request['___vehicle_registration_type___'] !== "corporate") {

            this.prepared_request['pa_owner_cover'] = false;
            this.processed_request['___pa_owner_cover___'] = this.prepared_request['pa_owner_cover'];

            this.method_content = this.method_content.replace('___nominee_age___', '');
            this.method_content = this.method_content.replace('___nominee_name___', '');
            this.method_content = this.method_content.replace('___nominee_relation___', '');
            this.method_content = this.method_content.replace('___pa_owner_driver_si___', '');
            this.method_content = this.method_content.replace('___appointee_name___', '');
            this.method_content = this.method_content.replace('___appointee_relation___', '');
            this.method_content = this.method_content.replace('___pa_tenure___', '');

            this.prepared_request['pa_owner_field1'] = "true";
            this.processed_request['___pa_owner_field1___'] = this.prepared_request['pa_owner_field1'];

            this.prepared_request['pa_owner_field2'] = "false";
            this.processed_request['___pa_owner_field2___'] = this.prepared_request['pa_owner_field2'];

            this.prepared_request['pa_owner_field3'] = "";
            this.processed_request['___pa_owner_field3___'] = this.prepared_request['pa_owner_field3'];

            this.prepared_request['pa_owner_field4'] = "";
            this.processed_request['___pa_owner_field4___'] = this.prepared_request['pa_owner_field4'];

            this.prepared_request['pa_owner_field5'] = "";
            this.processed_request['___pa_owner_field5___'] = this.prepared_request['pa_owner_field5'];

            this.prepared_request['pa_owner_field6'] = "";
            this.processed_request['___pa_owner_field6___'] = this.prepared_request['pa_owner_field6'];

            this.prepared_request['pa_owner_field7'] = "";
            this.processed_request['___pa_owner_field7___'] = this.prepared_request['pa_owner_field7'];

            this.prepared_request['vehicleColor'] = "";
            this.processed_request['___vehicleColor___'] = this.prepared_request['vehicleColor'];
        }
        if (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Customer' || this.lm_request['method_type'] === 'Proposal') {
            if (this.lm_request['vehicle_insurance_type'] === 'new') {
                var txt_replace1 = this.find_text_btw_key(this.method_content, '<!--previous insurer details start-->', '<!--previous insurer details end-->', true);
                if (txt_replace1) {
                    this.method_content = this.method_content.replace(txt_replace1, '');
                }
            } else {
                this.method_content = this.method_content.replace('<!--previous insurer details start-->', '');
                this.method_content = this.method_content.replace('<!--previous insurer details end-->', '');
            }

            if (this.lm_request['vehicle_insurance_subtype'] === "1OD_0TP") {
                var txt_replace2 = this.find_text_btw_key(this.method_content, '<!-- TP cover details start-->', '<!-- TP cover details ends-->', true);
                if (txt_replace2) {
                    this.method_content = this.method_content.replace(txt_replace2, '');
                }
                this.method_content = this.method_content.replace('<!-- TP details start-->', '');
                this.method_content = this.method_content.replace('<!-- TP details ends-->', '');
            } else {
                var txt_replace1 = this.find_text_btw_key(this.method_content, '<!-- TP details start-->', '<!-- TP details ends-->', true);
                if (txt_replace1) {
                    this.method_content = this.method_content.replace(txt_replace1, '');
                }
                this.method_content = this.method_content.replace('<!-- TP cover details start-->', '');
                this.method_content = this.method_content.replace('<!-- TP cover details ends-->', '');
            }
        }
        if (this.lm_request['vehicle_insurance_subtype'] === "0CH_1TP") {
            this.prepared_request['prevPlcyCvrType'] = "LIABILITY ONLY";
            this.processed_request['___prevPlcyCvrType___'] = "LIABILITY ONLY";

            this.prepared_request['PrevPlcyType'] = "2";
            this.processed_request['___PrevPlcyType___'] = "2";
        } else {
            this.prepared_request['prevPlcyCvrType'] = "COMPREHENSIVE";
            this.processed_request['___prevPlcyCvrType___'] = "COMPREHENSIVE";

            this.prepared_request['PrevPlcyType'] = "1";
            this.processed_request['___PrevPlcyType___'] = "1";
        }
        if (this.lm_request['method_type'] === 'Customer' || this.lm_request['method_type'] === 'Proposal') {
            if (this.lm_request['vehicle_insurance_subtype'] === "1OD_0TP") {
                this.prepared_request['tp_policy_end_date'] = this.lm_request['tp_end_date'].split("-")[2] + "-" + this.lm_request['tp_end_date'].split("-")[1] + "-" + this.lm_request['tp_end_date'].split("-")[0];
                this.processed_request['___tp_policy_end_date___'] = this.prepared_request['tp_policy_end_date'];

                this.prepared_request['tp_policyNumber'] = this.lm_request['tp_policy_number'];
                this.processed_request['___tp_policyNumber___'] = this.prepared_request['tp_policyNumber'];

                this.prepared_request['tp_policy_start_date'] = this.lm_request['tp_start_date'].split("-")[2] + "-" + this.lm_request['tp_start_date'].split("-")[1] + "-" + this.lm_request['tp_start_date'].split("-")[0];
                this.processed_request['___tp_policy_start_date___'] = this.prepared_request['tp_policy_start_date'];
            }
        }
        if (this.lm_request['product_id'] === 1) {
            if (this.lm_request['vehicle_insurance_type'] === 'new') {
                if (this.lm_request['vehicle_insurance_subtype'] === "1OD_0TP") {
                    this.prepared_request['tennureType'] = 152;
                    this.processed_request['___tennureType___'] = 152;

                    this.prepared_request['cover_type'] = "1668";
                    this.processed_request['___cover_type___'] = this.prepared_request['cover_type'];

                    this.prepared_request['product_name'] = "MOTOR - PRIVATE CAR STANDALONE OD(2323)";
                    this.processed_request['___product_name___'] = this.prepared_request['product_name'];

                    this.prepared_request['product_code'] = "2323";
                    this.processed_request['___product_code___'] = this.prepared_request['product_code'];
                }
                if (this.lm_request['vehicle_insurance_subtype'] === "1CH_2TP") {
                    this.prepared_request['tennureType'] = 101;
                    this.processed_request['___tennureType___'] = 101;

                    this.prepared_request['product_code'] = "2367";
                    this.processed_request['___product_code___'] = this.prepared_request['product_code'];

                    this.prepared_request['product_name'] = "MOTOR PRIVATE CAR BUNDLED POLICY(2367)";
                    this.processed_request['___product_name___'] = this.prepared_request['product_name'];

                    this.prepared_request['cover_type'] = "1473";
                    this.processed_request['___cover_type___'] = this.prepared_request['cover_type'];
                }
            } else {
                if (this.lm_request['vehicle_insurance_subtype'] === "1OD_0TP") {
                    this.prepared_request['tennureType'] = 151;
                    this.processed_request['___tennureType___'] = 151;

                    this.prepared_request['cover_type'] = "1668";
                    this.processed_request['___cover_type___'] = this.prepared_request['cover_type'];

                    this.prepared_request['product_name'] = "MOTOR - PRIVATE CAR STANDALONE OD(2323)";
                    this.processed_request['___product_name___'] = this.prepared_request['product_name'];

                    this.prepared_request['product_code'] = "2323";
                    this.processed_request['___product_code___'] = this.prepared_request['product_code'];
                }
                if (this.lm_request['vehicle_insurance_subtype'] === "1CH_0TP") {
                    this.prepared_request['tennureType'] = 102;
                    this.processed_request['___tennureType___'] = 102;

                    this.prepared_request['cover_type'] = "1471";
                    this.processed_request['___cover_type___'] = this.prepared_request['cover_type'];

                    this.prepared_request['product_name'] = "MOTOR - PRIVATE CAR PACKAGE POLICY(2311)";
                    this.processed_request['___product_name___'] = this.prepared_request['product_name'];

                    this.prepared_request['product_code'] = "2311";
                    this.processed_request['___product_code___'] = this.prepared_request['product_code'];
                }
            }

            if (this.lm_request['method_type'] === 'Customer' || this.lm_request['method_type'] === 'Proposal') {
                var RBE_quote_id = (this.processed_request['___dbmaster_insurer_transaction_identifier___']).split("-")[0];
                var RBE_quote_No = (this.processed_request['___dbmaster_insurer_transaction_identifier___']).split("-")[1];
                var Trace_Id = (this.processed_request['___dbmaster_insurer_transaction_identifier___']).split("-")[2];

                if (RBE_quote_id !== null && RBE_quote_id !== "" && RBE_quote_id !== undefined) {
                    this.prepared_request['rbe_quote_id'] = RBE_quote_id;
                    this.processed_request['___rbe_quote_id___'] = this.prepared_request['rbe_quote_id'];
                }
                if (RBE_quote_No !== null && RBE_quote_No !== "" && RBE_quote_No !== undefined) {
                    this.prepared_request['rbe_quote_no'] = RBE_quote_No;
                    this.processed_request['___rbe_quote_no___'] = this.prepared_request['rbe_quote_no'];
                }
                this.prepared_request['trace_id'] = Trace_Id;
                this.processed_request['___trace_id___'] = this.prepared_request['trace_id'];
            }
            if (this.processed_request['___addon_ncb_protection_cover___'] === "true") {
                if (this.lm_request['vehicle_insurance_type'] === 'new') {
                    this.prepared_request['___addon_ncb_protection_cover___'] = "false";
                    this.processed_request['___addon_ncb_protection_cover___'] = "false";
                } else {
                    if (this.lm_request['is_claim_exists'] === 'no') {
                        if (this.processed_request['___vehicle_ncb_current___'] === "0") {
                            this.prepared_request['___addon_ncb_protection_cover___'] = "false";
                            this.processed_request['___addon_ncb_protection_cover___'] = "false";
                        }
                    } else {
                        this.prepared_request['___addon_ncb_protection_cover___'] = "false";
                        this.processed_request['___addon_ncb_protection_cover___'] = "false";
                    }
                }
            }
            if (this.lm_request['vehicle_insurance_type'] === 'new') {
                if (this.lm_request.hasOwnProperty('cpa_tenure') && this.lm_request['is_pa_od'] == "yes") {
                    if (this.lm_request['cpa_tenure'] == 3) {
                        this.prepared_request['pa_tenure'] = this.lm_request['cpa_tenure'];
                        this.processed_request['___pa_tenure___'] = this.prepared_request['pa_tenure'];
                    } else {
                        this.prepared_request['pa_tenure'] = "1";
                        this.processed_request['___pa_tenure___'] = this.prepared_request['pa_tenure'];
                    }
                } else {
                    this.prepared_request['pa_tenure'] = "3";
                    this.processed_request['___pa_tenure___'] = this.prepared_request['pa_tenure'];
                }
            } else {
                this.prepared_request['pa_tenure'] = "1";
                this.processed_request['___pa_tenure___'] = this.prepared_request['pa_tenure'];
            }
            if (this.lm_request['method_type'] === 'Premium') {
                var tp_date = parseInt(this.processed_request['___policy_end_date_extended___'].split("-")[0]) + 2 + "-" + this.processed_request['___policy_end_date_extended___'].split("-")[1] + "-" + this.processed_request['___policy_end_date_extended___'].split("-")[2];
                this.prepared_request['Policy_TP_end_date'] = tp_date;
                this.processed_request['___Policy_TP_end_date___'] = this.prepared_request['Policy_TP_end_date'];
            }
            if (this.processed_request['___is_external_bifuel___'] === "no") {
                this.prepared_request['is_cng_kit'] = false;
                this.processed_request['___is_cng_kit___'] = this.prepared_request['is_cng_kit'];
                this.prepared_request['is_lpg_kit'] = false;
                this.processed_request['___is_lpg_kit___'] = this.prepared_request['is_lpg_kit'];
            } else {
                if (this.processed_request['___external_bifuel_type___'] === "cng") {
                    this.prepared_request['is_cng_kit'] = true;
                    this.processed_request['___is_cng_kit___'] = this.prepared_request['is_cng_kit'];
                    this.prepared_request['is_lpg_kit'] = false;
                    this.processed_request['___is_lpg_kit___'] = this.prepared_request['is_lpg_kit'];
                } else if (this.processed_request['___external_bifuel_type___'] === "lpg") {
                    this.prepared_request['is_lpg_kit'] = true;
                    this.processed_request['___is_lpg_kit___'] = this.prepared_request['is_lpg_kit'];
                    this.prepared_request['is_cng_kit'] = false;
                    this.processed_request['___is_cng_kit___'] = this.prepared_request['is_cng_kit'];
                }
            }
        }
        if (this.lm_request['product_id'] === 10) {
            if (this.lm_request['method_type'] === 'Customer' || this.lm_request['method_type'] === 'Proposal') {
                var RBE_quote_id = (this.processed_request['___dbmaster_insurer_transaction_identifier___']).split("-")[0];
                var RBE_quote_No = (this.processed_request['___dbmaster_insurer_transaction_identifier___']).split("-")[1];
                var Trace_Id = (this.processed_request['___dbmaster_insurer_transaction_identifier___']).split("-")[2];

                if (RBE_quote_id !== null && RBE_quote_id !== "" && RBE_quote_id !== undefined) {
                    this.prepared_request['rbe_quote_id'] = RBE_quote_id;
                    this.processed_request['___rbe_quote_id___'] = this.prepared_request['rbe_quote_id'];
                }
                if (RBE_quote_No !== null && RBE_quote_No !== "" && RBE_quote_No !== undefined) {
                    this.prepared_request['rbe_quote_no'] = RBE_quote_No;
                    this.processed_request['___rbe_quote_no___'] = this.prepared_request['rbe_quote_no'];
                }

                this.prepared_request['trace_id'] = Trace_Id;
                this.processed_request['___trace_id___'] = this.prepared_request['trace_id'];
            }

            if (this.lm_request['vehicle_insurance_type'] === 'new') {
                this.prepared_request['businessTypeId'] = 24;
                this.processed_request['___businessTypeId___'] = this.prepared_request['businessTypeId'];
            } else {
                this.prepared_request['businessTypeId'] = 25;
                this.processed_request['___businessTypeId___'] = this.prepared_request['businessTypeId'];
            }

            if (this.lm_request['vehicle_insurance_type'] === 'new') {
                if (this.lm_request['vehicle_insurance_subtype'] === "1CH_4TP") {
                    this.prepared_request['tennureType'] = 111;
                    this.processed_request['___tennureType___'] = this.prepared_request['tennureType'];

                    this.prepared_request['product_code'] = "2369";
                    this.processed_request['___product_code___'] = this.prepared_request['product_code'];

                    this.prepared_request['product_name'] = "TWO WHEELER BUNDLED POLICY(2369)";
                    this.processed_request['___product_name___'] = this.prepared_request['product_name'];

                    this.prepared_request['cover_type'] = "1480";
                    this.processed_request['___cover_type___'] = this.prepared_request['cover_type'];
                }
            } else {
                if (this.lm_request['vehicle_insurance_subtype'] === "1OD_0TP") {
                    this.prepared_request['tennureType'] = 153;
                    this.processed_request['___tennureType___'] = this.prepared_request['tennureType'];

                    this.prepared_request['cover_type'] = "1686";
                    this.processed_request['___cover_type___'] = this.prepared_request['cover_type'];

                    this.prepared_request['product_name'] = "TWO WHEELER STANDALONE OD(2324)";
                    this.processed_request['___product_name___'] = this.prepared_request['product_name'];

                    this.prepared_request['product_code'] = "2324";
                    this.processed_request['___product_code___'] = this.prepared_request['product_code'];
                }
                if (this.lm_request['vehicle_insurance_subtype'] === "1CH_0TP") {
                    this.prepared_request['tennureType'] = 118;
                    this.processed_request['___tennureType___'] = this.prepared_request['tennureType'];

                    this.prepared_request['cover_type'] = "1476";
                    this.processed_request['___cover_type___'] = this.prepared_request['cover_type'];

                    this.prepared_request['product_name'] = "TWO WHEELER PACKAGE POLICY(2312)";
                    this.processed_request['___product_name___'] = this.prepared_request['product_name'];

                    this.prepared_request['product_code'] = "2312";
                    this.processed_request['___product_code___'] = this.prepared_request['product_code'];
                }
            }
            if (this.lm_request['vehicle_insurance_type'] === 'new') {
                if (this.lm_request.hasOwnProperty('cpa_tenure') && this.lm_request['is_pa_od'] == "yes") {
                    if (this.lm_request['cpa_tenure'] == 5) {
                        this.prepared_request['pa_tenure'] = this.lm_request['cpa_tenure'];
                        this.processed_request['___pa_tenure___'] = this.prepared_request['pa_tenure'];
                    } else {
                        this.prepared_request['pa_tenure'] = "1";
                        this.processed_request['___pa_tenure___'] = this.prepared_request['pa_tenure'];
                    }
                } else {
                    this.prepared_request['pa_tenure'] = "5";
                    this.processed_request['___pa_tenure___'] = this.prepared_request['pa_tenure'];
                }
            } else {
                this.prepared_request['pa_tenure'] = "1";
                this.processed_request['___pa_tenure___'] = this.prepared_request['pa_tenure'];
            }
            if (this.lm_request['method_type'] === 'Premium') {
                var tp_date = parseInt(this.processed_request['___policy_end_date_extended___'].split("-")[0]) + 4 + "-" + this.processed_request['___policy_end_date_extended___'].split("-")[1] + "-" + this.processed_request['___policy_end_date_extended___'].split("-")[2];
                this.prepared_request['Policy_TP_end_date'] = tp_date;
                this.processed_request['___Policy_TP_end_date___'] = this.prepared_request['Policy_TP_end_date'];
            }

            if (this.lm_request['is_tppd'] === 'yes') {
                this.prepared_request['is_tppd_val'] = 'true';
                this.processed_request['___is_tppd_val___'] = this.prepared_request['is_tppd_val'];
            } else {
                this.prepared_request['is_tppd_val'] = 'false';
                this.processed_request['___is_tppd_val___'] = this.prepared_request['is_tppd_val'];
            }
        }
        if (this.lm_request['method_type'] === 'Customer') {
            if (this.lm_request.hasOwnProperty('is_call_time')) {
                if (this.lm_request['is_call_time'].includes("first_call")) {
                    this.method_content = "";
                }
            }
        }
        if (this.lm_request['method_type'] === 'Proposal') {
            if (this.lm_request.hasOwnProperty('is_call_time')) {
                if (this.lm_request['is_call_time'].includes("first_call")) {
                    if (this.lm_request['is_call_time'].includes("success") === false) {
                        var policyId = this.lm_request['is_call_time'].split("-")[4];
                        if (policyId !== null && policyId !== "" && policyId !== undefined) {
                            this.prepared_request['policy_id'] = policyId;
                            this.processed_request['___policy_id___'] = this.prepared_request['policy_id'];
                        }
                        var RBE_quote_id = this.lm_request['is_call_time'].split("-")[1];
                        var RBE_quote_No = this.lm_request['is_call_time'].split("-")[2];
                        if (RBE_quote_id !== null && RBE_quote_id !== "" && RBE_quote_id !== undefined) {
                            this.prepared_request['rbe_quote_id'] = RBE_quote_id;
                            this.processed_request['___rbe_quote_id___'] = this.prepared_request['rbe_quote_id'];
                        }
                        if (RBE_quote_No !== null && RBE_quote_No !== "" && RBE_quote_No !== undefined) {
                            this.prepared_request['rbe_quote_no'] = RBE_quote_No;
                            this.processed_request['___rbe_quote_no___'] = this.prepared_request['rbe_quote_no'];
                        }
                    } else {
                        var policyId = this.lm_request['is_call_time'].split("-")[5];
                        if (policyId !== null && policyId !== "" && policyId !== undefined) {
                            this.prepared_request['policy_id'] = policyId;
                            this.processed_request['___policy_id___'] = this.prepared_request['policy_id'];
                        }
                    }
                }
            }
        }
        if (this.lm_request['product_id'] === 10) {
            this.prepared_request['rto_location'] = this.lm_request['registration_no_1'] + this.lm_request['registration_no_2'];
            this.processed_request['___rto_location___'] = this.prepared_request['rto_location'];
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_product_field_process_pre', ex);
    }
};
RahejaQBEMotor.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
RahejaQBEMotor.prototype.insurer_product_field_process_post = function () {

};
RahejaQBEMotor.prototype.insurer_product_api_post = function () {

};
RahejaQBEMotor.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    try {
        var objInsurerProduct = this;
        var Client = require('node-rest-client').Client;
        var client = new Client();
        var service_method_url = '';
        var args = {
            data: docLog.Insurer_Request,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        };
        if (config.environment.name === 'Production') {
            args.headers.Authorization = 'Basic ' + new Buffer("1000564" + ':' + "AA4A32EC-B897-4835-AF68-E3195528BEA4").toString('base64');
        } else {
            args.headers.Authorization = 'Basic ' + new Buffer("landmark" + ':' + "EB3F67DC-750C-40F9-BBAA-5F0EBF6A67E6").toString('base64');
        }
        console.log(args);
        service_method_url = specific_insurer_object.method_file_url;
        if (specific_insurer_object.method.Method_Name === "RahejaQBE_Car_Premium") {
            service_method_url = specific_insurer_object.method.Service_URL;
        }
        if (specific_insurer_object.method.Method_Type === 'Premium' || specific_insurer_object.method.Method_Type === 'Idv') {
            var service_method_urlT = '';
            var traceId = "";
            var argsT = {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            };
            if (config.environment.name === 'Production') {
                argsT.headers.Authorization = 'Basic ' + new Buffer("1000564" + ':' + "AA4A32EC-B897-4835-AF68-E3195528BEA4").toString('base64');
                service_method_urlT = 'http://104.211.226.68:8430/api/PolicyAPI/GetTraceID?UserName=1000564';
            } else {
                argsT.headers.Authorization = 'Basic ' + new Buffer("landmark" + ':' + "EB3F67DC-750C-40F9-BBAA-5F0EBF6A67E6").toString('base64');
                service_method_urlT = 'http://52.172.5.3:8423/api/PolicyAPI/GetTraceID?UserName=landmark';
            }

            client.get(service_method_urlT, argsT, function (dataT) {
                console.log(dataT);
                traceId = dataT;
                console.log(docLog.Insurer_Request);

                if (objInsurerProduct.prepared_request['trace_id'] === undefined) {
                    objInsurerProduct.prepared_request['trace_id'] = traceId;
                    objInsurerProduct.processed_request['___trace_id___'] = objInsurerProduct.prepared_request['trace_id'];
                }
                args.data = args.data.replace('___trace_id___', traceId);
                console.log(args.data);


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
                    var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                    if (specific_insurer_object.method.Method_Type === 'Idv') {
                        objInsurerProduct.insurer_vehicle_idv_handler(serviceBreakup, objProduct, Insurer_Object, specific_insurer_object);
                    }
                });
            });
        } else {
            client.post(service_method_url, args, function (data, response) {
                console.log(data);
                console.log(response);
                var objResponseFullTmp = {
                    'err': null,
                    'result': data,
                    'raw': data,
                    'soapHeader': null,
                    'objResponseJson': data
                };
                let objResponseFull = objResponseFullTmp;
                if (specific_insurer_object.method.Method_Type === 'Proposal' && data['objFault'] && data['objFault'].hasOwnProperty('ErrorMessage') && (data['objFault']['ErrorMessage'] === "" || data['objFault']['ErrorMessage'] === null)) {
                    var service_method_url = '';
                    var args = {
                        data: {
                            "objPolicy": {
                                "TraceID": data.objPolicy.TraceID,
                                "QuoteNo": data.objPolicy.QuoteNo,
                                "SessionID": "string"
                            }
                        },
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        }
                    };
                    if (config.environment.name === 'Production') {
                        args.headers.Authorization = 'Basic ' + new Buffer("1000564" + ':' + "AA4A32EC-B897-4835-AF68-E3195528BEA4").toString('base64');
                        args.data.objPolicy.TPSourceName = "1011";
                        args.data.objPolicy.UserName = "1000564";
                        service_method_url = 'http://104.211.226.68:8430/api/PaymentAPI/GenerateTransationNumber';
                    } else {
                        args.headers.Authorization = 'Basic ' + new Buffer("landmark" + ':' + "EB3F67DC-750C-40F9-BBAA-5F0EBF6A67E6").toString('base64');
                        args.data.objPolicy.TPSourceName = "2";
                        args.data.objPolicy.UserName = "landmark";
                        service_method_url = 'http://52.172.5.3:8423/api/PaymentAPI/GenerateTransationNumber';
                    }
                    client.post(service_method_url, args, function (data1) {
                        console.log(data1);
                        objResponseFull['objResponseJson']['transactionNumber'] = data1;
                        var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                    });
                } else {
                    var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                    if (specific_insurer_object.method.Method_Type === 'Idv') {
                        objInsurerProduct.insurer_vehicle_idv_handler(serviceBreakup, objProduct, Insurer_Object, specific_insurer_object);
                    }
                }
            });
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e.stack);
    }
};
RahejaQBEMotor.prototype.idv_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'idv_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        var objInsurerProduct = this;

        if (objResponseJson.hasOwnProperty('objFault')) {
            if (objResponseJson['objFault']['ErrorMessage'] !== "") {
                Error_Msg = objResponseJson['objFault']['ErrorMessage'];
            }
        }
        if (objResponseJson.hasOwnProperty('objVehicleDetails')) {
            if (objResponseJson['objVehicleDetails']['ModifiedIDV'] === "") {
                Error_Msg = "Error in objVehicleDetails";
            }
            if (objResponseJson['objVehicleDetails']['CurrentExshowroomPrice'] === "") {
                Error_Msg = "Error in objVehicleDetails";
            }
        }
        if (Error_Msg === 'NO_ERR') {
            var Idv_Breakup = objInsurerProduct.const_idv_breakup;
            if (Error_Msg === 'NO_ERR') {
                Idv_Breakup["Idv_Normal"] = parseInt(objResponseJson['objVehicleDetails']['ModifiedIDV'] - 0);
                Idv_Breakup["Idv_Min"] = Math.ceil(Idv_Breakup["Idv_Normal"] * 0.85);
                Idv_Breakup["Idv_Max"] = parseInt(Idv_Breakup["Idv_Normal"] * 1.15);
                Idv_Breakup["Exshowroom"] = objResponseJson['objVehicleDetails']['CurrentExshowroomPrice'];
                objServiceHandler.Premium_Breakup = Idv_Breakup;
            }
        }
        objServiceHandler.Error_Msg = Error_Msg;
        //console.log('Finish', this.constructor.name, 'idv_response_handler', objServiceHandler);
        return objServiceHandler;
    } catch (e) {
        objServiceHandler.Error_Msg = JSON.stringify(e);
        //console.error('Exception', this.constructor.name, 'idv_response_handler', objServiceHandler);
        return objServiceHandler;
    }
};

RahejaQBEMotor.prototype.customer_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'customer_response_handler', objResponseJson);
    var objInsurerProduct = this;
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': objInsurerProduct.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (objInsurerProduct.lm_request.hasOwnProperty('is_call_time')) {
            if (objInsurerProduct.lm_request['is_call_time'].includes("first_call")) {
                Error_Msg = 'NO_ERR';
                var Customer = {
                    'insurer_customer_identifier': "",
                    'insurer_customer_identifier_1': "",
                    'final_premium_verified': ""
                };
                objServiceHandler.Customer = Customer;
            }
        } else {
            if (objResponseJson.hasOwnProperty('objFault')) {
                if (objResponseJson['objFault']['ErrorMessage'] !== "" && objResponseJson['objFault']['ErrorMessage'] !== null) {
                    Error_Msg = objResponseJson['objFault']['ErrorMessage'];
                }
            }
            if (Error_Msg === 'NO_ERR') {
                var thankyouurl = objInsurerProduct.const_payment.pg_ack_url;
                var policy_no = objResponseJson['objPolicy']['Policyid'];

                objServiceHandler.Payment.pg_redirect_mode = 'POST';

                var Customer = {
                    'insurer_customer_identifier': policy_no,
                    'insurer_customer_identifier_1': thankyouurl,
                    'final_premium_verified': objResponseJson['FinalPremium']
                };
                objServiceHandler.Customer = Customer;
                objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['objPolicy']['QuoteID'] + "-" + objResponseJson['objPolicy']['QuoteNo'] + "-" + objResponseJson['objPolicy']['Policyid'] + "-" + objResponseJson['objPolicy']['TraceID'];
            }
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', objInsurerProduct.constructor.name, 'customer_response_handler', objServiceHandler);
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
RahejaQBEMotor.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var objPremiumService = objResponseJson;
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var objInsurerProduct = this;
    var Error_Msg = 'NO_ERR';

    try {
        if (objResponseJson.hasOwnProperty('objFault')) {
            if (objResponseJson['objFault']['ErrorMessage'] !== "" && objResponseJson['objFault']['ErrorMessage'] !== null) {
                Error_Msg = objResponseJson['objFault']['ErrorMessage'];
            }
        }
        if (Error_Msg === 'NO_ERR') {
            var objPremiumService = {};
            //main summary
            var objInsurerPremiumJson = objResponseJson['lstCoverResponce'];
            for (var keyCover in objInsurerPremiumJson) {
                try {
                    var premium = objInsurerPremiumJson[keyCover]['CoverPremium'];
                    premium = (premium < 0) ? (0 - premium) : premium;
                    var cover_name = objInsurerPremiumJson[keyCover]['CoverName'];
                    objPremiumService[cover_name] = objInsurerProduct.round2Precision(premium - 0);
                } catch (e) {
                }
            }
            objPremiumService["NCBPremium"] = objResponseJson["NCBPremium"];
            //breakup
            var objInsurerPremiumJson = objResponseJson['lstCoverResponce'];
            console.log(objPremiumService);
            var premium_breakup = objInsurerProduct.get_const_premium_breakup();

            for (var key in objInsurerProduct.premium_breakup_schema) {
                if (typeof objInsurerProduct.premium_breakup_schema[key] === 'object') {
                    var group_final = 0, group_final_key = '';
                    for (var sub_key in objInsurerProduct.premium_breakup_schema[key]) {
                        if (sub_key === 'tp_cng_lpg' || sub_key === 'od_cng_lpg') {
                            if (this.processed_request['___external_bifuel_value___'] - 0 > 0) {
                                if (this.processed_request['___external_bifuel_type___'] === "lpg") {
                                    if (key === 'liability' && sub_key === 'tp_cng_lpg') {
                                        this.premium_breakup_schema[key]['tp_cng_lpg'] = 'LPG kit - TP';
                                    }
                                    if (key === 'own_damage' && sub_key === 'od_cng_lpg') {
                                        this.premium_breakup_schema[key]['od_cng_lpg'] = 'LPG kit - OD';
                                    }
                                }
                            }
                        }

                        var premium_key = objInsurerProduct.premium_breakup_schema[key][sub_key];
                        var premium_val = 0;
                        if (premium_key) {
                            if (premium_key && objPremiumService.hasOwnProperty(premium_key)) {
                                premium_val = objPremiumService[premium_key];
                            }
                            premium_val = isNaN(premium_val) ? 0 : premium_val;
                            premium_breakup[key][sub_key] = premium_val;
                        }
                        if (sub_key.indexOf('_final_') > -1) {
                            group_final_key = sub_key;
                        } else if (sub_key.indexOf('_disc') > -1) {
                            group_final -= premium_val;
                        } else {
                            group_final += premium_val;
                        }
                    }
                    premium_breakup[key][group_final_key] = group_final;
                } else {
                    var premium_key = objInsurerProduct.premium_breakup_schema[key];
                    if (premium_key) {
                        premium_key = premium_key.toString().toLowerCase().replace(/ /g, '_');

                        var premium_val = 0;
                        if (premium_key && objPremiumService.hasOwnProperty(premium_key)) {
                            premium_val = parseInt(objPremiumService[premium_key]['0']);
                        }
                        premium_val = isNaN(premium_val) ? 0 : premium_val;
                        premium_breakup[key] = premium_val;
                    }
                }
            }
            if (premium_breakup['liability']['tp_cover_tppd']) {
                premium_breakup['liability']['tp_final_premium'] = Math.round(premium_breakup['liability']['tp_final_premium'] - 0) - (Math.round(premium_breakup['liability']['tp_cover_tppd'] - 0) * 2);
            }
            premium_breakup['net_premium'] = Math.round(objResponseJson['NetPremium'] - 0);
            premium_breakup['service_tax'] = Math.round(objResponseJson['TotalTax'] - 0);
            premium_breakup['final_premium'] = Math.round(objResponseJson['FinalPremium'] - 0);

            objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['objPolicy']['QuoteID'] + "-" + objResponseJson['objPolicy']['QuoteNo'] + "-" + objResponseJson['objPolicy']['TraceID'];
            console.log("premium quote data:- " + objServiceHandler.Insurer_Transaction_Identifier);
            objServiceHandler.Premium_Breakup = premium_breakup;
        }
        objServiceHandler.Error_Msg = Error_Msg;
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        //console.error('Exception', this.constructor.name, 'premium_response_handler', objServiceHandler);
    }
    //console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
    return objServiceHandler;
};
RahejaQBEMotor.prototype.insurer_vehicle_idv = function (objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback) {
    console.log('Start', this.constructor.name, 'insurer_vehicle_idv');
    try {
        var objInsurerProduct = this;
        var Insurer_Id = specific_insurer_object['insurer_id'];

        var IdvMethod = objInsurerProduct.ArrayFindByKey(Insurer_Object.Method_List, 'Method_Type', 'Idv');
        specific_insurer_object.method = IdvMethod;
        if (specific_insurer_object.method.Service_File && fs.existsSync(appRoot + '/resource/wsdl/' + specific_insurer_object.method.Service_File)) {
            specific_insurer_object['method_file_url'] = appRoot + '/resource/wsdl/' + specific_insurer_object.method.Service_File;
        } else {
            specific_insurer_object['method_file_url'] = specific_insurer_object.method.Service_URL;
        }
        var method_content = fs.readFileSync(appRoot + '/resource/request_file/' + IdvMethod.Method_Request_File).toString();
        method_content = method_content.replace('___lv_quote_no___', objInsurerProduct.lv_quote_no());
        objInsurerProduct.method_content = method_content.replace('___vehicle_expected_idv___', 0);
        for (var addon_key in objInsurerProduct.const_addon_master) {
            objInsurerProduct.method_content = objInsurerProduct.method_content.replace('___' + addon_key + '___', 'false');
        }
        objInsurerProduct.insurer_product_field_process_pre();
        var request_replaced_data = objInsurerProduct.method_content.replaceJson(objInsurerProduct.processed_request);

        var logGuid = objInsurerProduct.create_guid('ARN-');
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
        objInsurerProduct.save_log(docLog);
        console.log('ServiceData');
        console.log(docLog.Insurer_Request);

        objInsurerProduct.service_call(docLog, objProduct, Insurer_Object, specific_insurer_object);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_vehicle_idv', ex);
    }
};

RahejaQBEMotor.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    var objInsurerProduct = this;
    var policyId = "";
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': objInsurerProduct.const_payment
    };
    try {
        /*if (objResponseJson.hasOwnProperty('objFault')) {
         if (objResponseJson['objFault']['ErrorMessage'] !== "" && objResponseJson['objFault']['ErrorMessage'] !== null) {
         Error_Msg = objResponseJson['objFault']['ErrorMessage'];
         }
         } else {
         Error_Msg = objResponseJson;
         }
         if (objInsurerProduct.lm_request['vehicle_insurance_type'] === 'renew') {
         if ((objInsurerProduct.processed_request['___engine_number___']).length < 5 || (objInsurerProduct.processed_request['___engine_number___']).length > 20) {
         Error_Msg = 'Engine Number : min 5 character and max 20 characters';
         }
         if ((objInsurerProduct.processed_request['___chassis_number___']).length < 5 || (objInsurerProduct.processed_request['___chassis_number___']).length > 20) {
         Error_Msg = 'Chassis Number : min 5 character and max 20 characters';
         }
         if ((objInsurerProduct.processed_request['___previous_policy_number___']).length < 5 || (objInsurerProduct.processed_request['___previous_policy_number___']).length > 35) {
         Error_Msg = 'Previous Year Policy Number : min 5 character and max 35 characters';
         }
         }
         
         if (Error_Msg === 'NO_ERR') {
         var thankyouurl = objInsurerProduct.const_payment.pg_ack_url;
         var policy_no = objResponseJson['objPolicy']['Policyid'];
         var pg_data = {
         'successReturnUrl': thankyouurl, //this.const_payment.pg_ack_url,
         'cancelReturnUrl': thankyouurl, //this.const_payment.pg_ack_url,
         'expiryHours': '48'
         };
         objServiceHandler.Payment.pg_redirect_mode = 'POST';
         
         var Proposal = {
         'insurer_customer_identifier': policy_no,
         'insurer_customer_identifier_1': thankyouurl,
         'final_premium_verified': objResponseJson['FinalPremium']
         };
         objInsurerProduct.const_payment_response.final_premium = objResponseJson['FinalPremium'];
         var objPremiumVerification = objInsurerProduct.premium_verification(objInsurerProduct.lm_request['final_premium'], objInsurerProduct.const_payment_response.final_premium, 10, 10);
         if (objInsurerProduct.lm_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
         if (objPremiumVerification.Status) {
         objInsurerProduct.const_payment_response.pg_data = pg_data;
         objServiceHandler.Proposal = Proposal;
         } else {
         Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
         }
         } else {
         if (objPremiumVerification.Status) {
         objInsurerProduct.const_payment_response.pg_data = pg_data;
         objServiceHandler.Proposal = Proposal;
         } else {
         Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
         }
         }
         }
         if (Error_Msg === 'NO_ERR') {
         if (objResponseJson.hasOwnProperty('transactionNumber')) {
         if (objResponseJson['transactionNumber']['objFault']['ErrorMessage'] !== "" && objResponseJson['transactionNumber']['objFault']['ErrorMessage'] !== null) {
         Error_Msg = objResponseJson['transactionNumber']['objFault']['ErrorMessage'];
         if (objInsurerProduct.processed_request['___insurer_customer_identifier___'] !== "") {
         policyId = objInsurerProduct.processed_request['___insurer_customer_identifier___'];
         } else {
         policyId = objInsurerProduct.processed_request['___policy_id___'];
         }
         objServiceHandler.Insurer_Transaction_Identifier = "first_call" + "-" + objInsurerProduct.processed_request['___dbmaster_insurer_transaction_identifier___'] + "-" + policyId;
         } else {
         var pg_data = {
         'TxnNo': objResponseJson['transactionNumber']['TxnNo'],
         'QuoteNo': objResponseJson['transactionNumber']['objPolicy']['QuoteNo']
         };
         //objServiceHandler.Payment.pg_ack_url = objInsurerProduct.const_payment.pg_ack_url; //thankyouurl;
         objServiceHandler.Payment.pg_data = pg_data;
         objServiceHandler.Payment.pg_url = objResponseJson['transactionNumber']['OnlinePaymentPage'];
         objServiceHandler.Payment.pg_redirect_mode = 'GET';
         objServiceHandler.Insurer_Transaction_Identifier = "first_call" + "-" + "success" + "-" + objResponseJson['transactionNumber']['TxnNo'] + "-" + objResponseJson['transactionNumber']['objPolicy']['QuoteNo'] + "-" + objResponseJson['transactionNumber']['objPolicy']['TraceID'] + "-" + objResponseJson['objPolicy']['Policyid'];
         }
         } else {
         if (objInsurerProduct.processed_request['___insurer_customer_identifier___'] !== "") {
         policyId = objInsurerProduct.processed_request['___insurer_customer_identifier___'];
         } else {
         policyId = objInsurerProduct.processed_request['___policy_id___'];
         }
         objServiceHandler.Insurer_Transaction_Identifier = "first_call" + "-" + objInsurerProduct.processed_request['___dbmaster_insurer_transaction_identifier___'] + "-" + policyId;
         Error_Msg = "Error in Transaction Number Service Call";
         }            
         } else {
         if (objInsurerProduct.processed_request['___insurer_customer_identifier___'] !== "") {
         policyId = objInsurerProduct.processed_request['___insurer_customer_identifier___'];
         } else {
         policyId = objInsurerProduct.processed_request['___policy_id___'];
         }
         objServiceHandler.Insurer_Transaction_Identifier = "first_call" + "-" + objInsurerProduct.processed_request['___dbmaster_insurer_transaction_identifier___'] + "-" + policyId;
         }*/
        var pg_data = {
            'ss_id': objInsurerProduct.lm_request['ss_id'],
            'crn': objInsurerProduct.lm_request['crn'],
            'User_Data_Id': objInsurerProduct.lm_request['udid'],
            'product_id': objInsurerProduct.lm_request['product_id'],
            'premium_amount': objInsurerProduct.lm_request['final_premium'],
            'customer_name': objInsurerProduct.lm_request['first_name'] + " " + objInsurerProduct.lm_request['last_name']
        };
        if (objResponseJson.objFault.hasOwnProperty("ErrorMessage") && objResponseJson.objFault.ErrorMessage !== "") {
            Error_Msg = objResponseJson.objFault.ErrorMessage;
        }
        if (Error_Msg === 'NO_ERR') {
            var thankyouurl = objInsurerProduct.const_payment.pg_ack_url;
            var policy_no = objResponseJson['objPolicy']['Policyid'];
            var pg_data = {
                'successReturnUrl': thankyouurl, //this.const_payment.pg_ack_url,
                'cancelReturnUrl': thankyouurl, //this.const_payment.pg_ack_url,
                'expiryHours': '48'
            };
            objServiceHandler.Payment.pg_redirect_mode = 'POST';

            var Proposal = {
                'insurer_customer_identifier': policy_no,
                'insurer_customer_identifier_1': thankyouurl,
                'final_premium_verified': objResponseJson['FinalPremium']
            };
            objInsurerProduct.const_payment_response.final_premium = objResponseJson['FinalPremium'];
            var objPremiumVerification = objInsurerProduct.premium_verification(objInsurerProduct.lm_request['final_premium'], this.processed_request['___final_premium_verified___'], 10, 10);
            if (objInsurerProduct.lm_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
                if (objPremiumVerification.Status) {
                    objInsurerProduct.const_payment_response.pg_data = pg_data;
                    objServiceHandler.Proposal = Proposal;
                } else {
                    Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
                }
            } else {
                if (objPremiumVerification.Status) {
                    objInsurerProduct.const_payment_response.pg_data = pg_data;
                    objServiceHandler.Proposal = Proposal;
                } else {
                    Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
                }
            }
        }
        if (Error_Msg === 'NO_ERR') {
            if (objResponseJson.hasOwnProperty('transactionNumber')) {
                if (objResponseJson['transactionNumber']['objFault']['ErrorMessage'] !== "" && objResponseJson['transactionNumber']['objFault']['ErrorMessage'] !== null) {
                    Error_Msg = objResponseJson['transactionNumber']['objFault']['ErrorMessage'];
                    if (objInsurerProduct.processed_request['___insurer_customer_identifier___'] !== "") {
                        policyId = objInsurerProduct.processed_request['___insurer_customer_identifier___'];
                    } else {
                        policyId = objInsurerProduct.processed_request['___policy_id___'];
                    }
                    objServiceHandler.Insurer_Transaction_Identifier = "first_call" + "-" + objInsurerProduct.processed_request['___dbmaster_insurer_transaction_identifier___'] + "-" + policyId;
                } else {
                    var pg_data = {
                        'TxnNo': objResponseJson['transactionNumber']['TxnNo'],
                        'QuoteNo': objResponseJson['transactionNumber']['objPolicy']['QuoteNo']
                    };
                    //objServiceHandler.Payment.pg_ack_url = objInsurerProduct.const_payment.pg_ack_url; //thankyouurl;
                    objServiceHandler.Payment.pg_data = pg_data;
                    objServiceHandler.Payment.pg_url = objResponseJson['transactionNumber']['OnlinePaymentPage'];
                    objServiceHandler.Payment.pg_redirect_mode = 'GET';
                    objServiceHandler.Insurer_Transaction_Identifier = "first_call" + "-" + "success" + "-" + objResponseJson['transactionNumber']['TxnNo'] + "-" + objResponseJson['transactionNumber']['objPolicy']['QuoteNo'] + "-" + objResponseJson['transactionNumber']['objPolicy']['TraceID'] + "-" + objResponseJson['objPolicy']['Policyid'];
                }
            } else {
                if (objInsurerProduct.processed_request['___insurer_customer_identifier___'] !== "") {
                    policyId = objInsurerProduct.processed_request['___insurer_customer_identifier___'];
                } else {
                    policyId = objInsurerProduct.processed_request['___policy_id___'];
                }
                objServiceHandler.Insurer_Transaction_Identifier = "first_call" + "-" + objInsurerProduct.processed_request['___dbmaster_insurer_transaction_identifier___'] + "-" + policyId;
                Error_Msg = "Error in Transaction Number Service Call";
            }
        } else {
            if (objInsurerProduct.processed_request['___insurer_customer_identifier___'] !== "") {
                policyId = objInsurerProduct.processed_request['___insurer_customer_identifier___'];
            } else {
                policyId = objInsurerProduct.processed_request['___policy_id___'];
            }
            objServiceHandler.Insurer_Transaction_Identifier = "first_call" + "-" + objInsurerProduct.processed_request['___dbmaster_insurer_transaction_identifier___'] + "-" + policyId;
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.error('Exception', objInsurerProduct.constructor.name, 'proposal_response_handler', objServiceHandler);

    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'proposal_response_handler', objServiceHandler);
        //return objServiceHandler;
    }
    return objServiceHandler;
};
RahejaQBEMotor.prototype.pg_response_handler = function () {
    try {
        var objInsurerProduct = this;
        if (objInsurerProduct.const_payment_response.pg_post['status'] === "success") {
            var msg = objInsurerProduct.const_payment_response.pg_post['txnid'];
            objInsurerProduct.const_policy.pg_status = 'SUCCESS';
            objInsurerProduct.const_policy.pg_reference_number_1 = msg;
        } else {
            objInsurerProduct.const_policy.pg_status = 'FAIL';
            objInsurerProduct.const_policy.transaction_status = 'FAIL';
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
RahejaQBEMotor.prototype.verification_response_handler = function (objResponseJson) {
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        var objInsurerProduct = this;
        if (objInsurerProduct.const_policy.pg_status === 'FAIL') {

        }
        if (objInsurerProduct.const_policy.pg_status === 'SUCCESS') {
            console.error('RahejaPdfResponse', objResponseJson);

            if (objResponseJson['objFault']['ErrorMessage'] !== null) {
                Error_Msg = objResponseJson['objFault']['ErrorMessage'];
            }
            if (objResponseJson['objFault']['ErrorCode'] !== null) {
                Error_Msg = objResponseJson['objFault']['ErrorCode'];
            }
            if (Error_Msg === 'NO_ERR') {
                if (objResponseJson.hasOwnProperty('PolicyNo') && (objResponseJson['PolicyNo'] !== '' && objResponseJson['PolicyNo'] !== null)) {
                    objInsurerProduct.const_policy.policy_number = objResponseJson['PolicyNo'];
                    objInsurerProduct.const_policy.transaction_status = 'SUCCESS';
                    objInsurerProduct.const_policy.insurer_policy_url = objResponseJson['PolicyPDFDownloadLink'];
                    var product_name = 'CAR';
                    if (objInsurerProduct.lm_request['product_id'] === 10) {
                        product_name = 'TW';
                    }
                    var pdf_file_name = objInsurerProduct.constructor.name + '_' + product_name + '_' + objInsurerProduct.const_policy.policy_number + '.pdf';
                    var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                    var pdf_web_path = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    objInsurerProduct.const_policy.policy_url = pdf_web_path;
                    var http = require('http');
                    try {
                        var file_horizon = fs.createWriteStream(pdf_sys_loc);
                        http.get(objInsurerProduct.const_policy.insurer_policy_url, function (response) {
                            response.pipe(file_horizon);
                        });
                    } catch (ep) {
                        console.error('ExceptionPDF', objInsurerProduct.constructor.name, 'pdf_response_handler', ep);
                    }
                    objInsurerProduct.const_policy.transaction_id = objResponseJson.TxnNo;
                } else {
                    objInsurerProduct.const_policy.transaction_status = 'PAYPASS';
                }
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
        this.const_policy.transaction_status = 'PAYPASS';
        objServiceHandler.Policy = this.const_policy;
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
RahejaQBEMotor.prototype.vehicle_age_year = function () {
    console.log('Start', this.constructor.name, 'vehicle_age_year');
    var age_in_year = 0;
    try {
        var moment = require('moment');
        var vehicle_manf_date = this.lm_request['vehicle_manf_date'];
        var policy_start_date = this.policy_start_date();
        var age_in_year = moment(policy_start_date).diff(vehicle_manf_date, 'years');
        //age_in_year = age_in_year + 1;
        console.log('Finish', this.constructor.name, 'vehicle_age_year', age_in_year);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'vehicle_age_year', ex);
        return age_in_year;
    }
    return age_in_year;
};
RahejaQBEMotor.prototype.lv_quote_no = function () {
    try {
        return this.create_guid('', 'numeric', 7);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'lv_quote_no', ex);
        return 0;
    }
};
RahejaQBEMotor.prototype.premium_breakup_schema = {
    "own_damage": {
        "od_basic": "Basic - OD",
        "od_elect_access": "Electrical or electronic accessories",
        "od_non_elect_access": "Non Electrical Accessories",
        "od_cng_lpg": "CNG Kit - OD",
        "od_disc_ncb": "NCBPremium",
        "od_disc_vol_deduct": "Voluntary Deductibles",
        "od_disc_anti_theft": "Installation of Anti-Theft Device",
        "od_disc_aai": "",
        "od_loading": "",
        "od_disc": "",
        "od_final_premium": ""
    },
    "liability": {
        "tp_basic": "Basic - TP",
        "tp_cover_owner_driver_pa": "PA - Owner",
        "tp_cover_unnamed_passenger_pa": "PA - Unnamed Person",
        "tp_cover_named_passenger_pa": "PA - Named Person",
        "tp_cover_paid_driver_pa": "Paid Driver",
        "tp_cover_paid_driver_ll": "Legal Liability to Paid Driver",
        "tp_cng_lpg": "CNG Kit - TP",
        "tp_cover_tppd": "TPPD",
        "tp_final_premium": ""
    },
    "addon": {
        //"addon_rim_damage_cover": "rimDamageCover",
        "addon_zero_dep_cover": "Zero Depreciation",
        "addon_road_assist_cover": "Road Side Assistance",
        "addon_ncb_protection_cover": "NCB Retention",
        "addon_engine_protector_cover": "Engine Protect",
        "addon_invoice_price_cover": "Return To Invoice",
        "addon_key_lock_cover": "Key Protect",
        "addon_consumable_cover": "Consumable Expenses",
        "addon_daily_allowance_cover": "Daily Conveyance Benefit",
        "addon_windshield_cover": null,
        "addon_passenger_assistance_cover": null,
        "addon_tyre_coverage_cover": "Tyre And Rim Protector",
        "addon_personal_belonging_loss_cover": "Loss of Personal Belongings",
        "addon_inconvenience_allowance_cover": null,
        "addon_medical_expense_cover": "",
        "addon_hospital_cash_cover": null,
        "addon_ambulance_charge_cover": null,
        "addon_rodent_bite_cover": null,
        "addon_losstime_protection_cover": null,
        "addon_hydrostatic_lock_cover": null,
        "addon_final_premium": 0
    },
    "net_premium": "totalNetPremium",
    "service_tax": "TotalTax",
    "final_premium": "FinalPremium"
};
module.exports = RahejaQBEMotor;