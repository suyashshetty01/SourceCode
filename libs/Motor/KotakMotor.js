/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var express = require('express');
var router = express.Router();
var util = require('util');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var Motor = require(appRoot + '/libs/Motor');
var fs = require('fs');
var config = require('config');
var moment = require('moment');
var pdf = require('html-pdf');
var excel = require('excel4node');
var sleep = require('system-sleep');
function KotakMotor() {

}
util.inherits(KotakMotor, Motor);
KotakMotor.prototype.lm_request_single = {};
KotakMotor.prototype.insurer_integration = {};
KotakMotor.prototype.insurer_addon_list = [];
KotakMotor.prototype.insurer = {};
KotakMotor.prototype.pdf_attempt = 0;
KotakMotor.prototype.insurer_date_format = 'DD/MM/YYYY';
KotakMotor.prototype.insurer_product_api_pre = function () {
    console.log('KotakMotor insurer_product_api_pre');
    try {
        if (this.lm_request['method_type'] === 'Idv' || this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Customer' || this.lm_request['method_type'] === 'Verification') {
            this.insurer_date_format = 'dd/MM/yyyy';
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_product_api_pre', ex);
    }
};
KotakMotor.prototype.insurer_product_field_process_pre = function () {
    try {
        if (this.prepared_request['Plan_Name'] === "BUNDLE" && (this.prepared_request['voluntary_deductible'] !== "" && this.lm_request['voluntary_deductible'] !== null && this.lm_request['voluntary_deductible'] !== "undefined" && this.lm_request['voluntary_deductible'] !== "0" && this.lm_request['voluntary_deductible'] !== 0)) {
            this.method_content = this.method_content.toString().replace('___vol_duct_for_dep_cover___', '1000');
        } else {
            this.method_content = this.method_content.toString().replace('___vol_duct_for_dep_cover___', '0');
        }

        if (this.lm_request['method_type'] === 'Idv' || this.lm_request['method_type'] === 'Premium') {
            let validRTO1 = this.getDeclinedRTO1();
            let validRTO2 = this.getDeclinedRTO2();
            let validMake = this.getDeclinedMake(this.insurer_master.vehicles.insurer_db_master.Insurer_Vehicle_Make_Name);
            let validMakeRTO = this.getDeclinedMakeRTO(this.insurer_master.vehicles.insurer_db_master.Insurer_Vehicle_Make_Name);
            let validMakeModel = this.getDeclinedMakeModel(this.insurer_master.vehicles.insurer_db_master.Insurer_Vehicle_Make_Name, this.insurer_master.vehicles.insurer_db_master.Insurer_Vehicle_Model_Name);
            let validMakeModelRTO = this.getDeclinedMakeModelRTO(this.insurer_master.vehicles.insurer_db_master.Insurer_Vehicle_Make_Name, this.insurer_master.vehicles.insurer_db_master.Insurer_Vehicle_Model_Name);
            let flagForPremiumIDV = false;
            if (validRTO1 || validRTO2)
            {
                flagForPremiumIDV = true;
                console.error('Kotak Motor : RTO is not allowed', this.lm_request['crn']);
            } else if (validMake || validMakeRTO || validMakeModel || validMakeModelRTO)
            {
                flagForPremiumIDV = true;
                console.error('Kotak Motor : Make or Make_RTO or Make_Model or Make_Model_RTO is not allowed', this.lm_request['crn']);
            } else
            {
                flagForPremiumIDV = false;
            }

            let elec_limit_idv = 0;
            let non_elec_limit_idv = 0;
            let flagForElecPremiumIDV = false;
            let flagForNonElectPremiumIDV = false;
            if (this.lm_request['method_type'] === 'Premium' && this.lm_request['electrical_accessory'] > 0) {
                elec_limit_idv = (this.prepared_request['vehicle_expected_idv'] * 20) / 100;
            }
            if (this.lm_request['method_type'] === 'Premium' && this.lm_request['non_electrical_accessory'] > 0) {
                non_elec_limit_idv = (this.prepared_request['vehicle_expected_idv'] * 20) / 100;
            }

            if (this.lm_request['method_type'] === 'Premium' && this.lm_request['electrical_accessory'] > 0 && ((this.lm_request['electrical_accessory'] < 3000) || (this.lm_request['electrical_accessory'] > elec_limit_idv))) {
                flagForElecPremiumIDV = true;
                console.error('Kotak Motor Rule : Electrical & Non electrical - Min. IDV Rs.3000 Max IDV 20% of the total IDV', this.lm_request['crn']);
            }

            if (this.lm_request['method_type'] === 'Premium' && this.lm_request['non_electrical_accessory'] > 0 && ((this.lm_request['non_electrical_accessory'] < 3000) || (this.lm_request['non_electrical_accessory'] > non_elec_limit_idv))) {
                flagForNonElectPremiumIDV = true;
                console.error('Kotak Motor Rule : Electrical & Non electrical - Min. IDV Rs.3000 Max IDV 20% of the total IDV', this.lm_request['crn']);
            }

            if (flagForPremiumIDV || flagForElecPremiumIDV || flagForNonElectPremiumIDV) {
                this.method_content = "";
            }
        }
        /*if (this.lm_request['vehicle_insurance_type'] === 'renew' && this.lm_request['method_type'] === 'Proposal') {
         if (this.prepared_request['registration_no_2'].length > 1) {
         this.processed_request['___registration_no_2___'] = this.prepared_request['registration_no_2'];
         } else {
         this.processed_request['___registration_no_2___'] = ("0" + this.prepared_request['registration_no_2']);
         }
         }*/
        if (this.lm_request['vehicle_insurance_type'] === 'renew') {
            var txt_registration_no_2 = '';
            if (this.lm_request['method_type'] === 'Proposal') {
                txt_registration_no_2 = this.prepared_request['registration_no_2'];
            }
            if (this.lm_request['method_type'] === 'Verification') {
                txt_registration_no_2 = this.Master_Details['User_Data']['Erp_Qt_Request_Core']['___registration_no_2___'];
            }

            if (txt_registration_no_2.length > 1) {
                if (isNaN(txt_registration_no_2)) {
                    var str_registration_no_2 = txt_registration_no_2;
                    var pattern1 = /[0-9]/g;
                    var pattern2 = /[a-zA-Z]/g;
                    var letters = str_registration_no_2.match(pattern2);
                    var digits = str_registration_no_2.match(pattern1);
                    var letters2 = letters.toString().replaceAll(',', '');
                    var digits2 = digits.toString().replaceAll(',', '');
                    if (this.lm_request['method_type'] === 'Proposal') {
                        this.prepared_request['registration_no_2'] = digits2;
                        this.processed_request['___registration_no_2___'] = this.prepared_request['registration_no_2'];
                        this.prepared_request['registration_no_3'] = letters2 + this.prepared_request['registration_no_3'];
                        this.processed_request['___registration_no_3___'] = this.prepared_request['registration_no_3'];
                    }
                    if (this.lm_request['method_type'] === 'Verification') {
                        this.Master_Details['User_Data']['Erp_Qt_Request_Core']['___registration_no_2___'] = digits2;
                        this.method_content = this.method_content.replace('___registration_no_2___', this.Master_Details['User_Data']['Erp_Qt_Request_Core']['___registration_no_2___']);
                        this.Master_Details['User_Data']['Erp_Qt_Request_Core']['___registration_no_3___'] = letters2 + this.Master_Details['User_Data']['Erp_Qt_Request_Core']['___registration_no_3___'];
                        this.method_content = this.method_content.replace('___registration_no_3___', this.Master_Details['User_Data']['Erp_Qt_Request_Core']['___registration_no_3___']);
                    }
                } else {
                    if (this.lm_request['method_type'] === 'Proposal') {
                        this.processed_request['___registration_no_2___'] = txt_registration_no_2;
                    }
                    if (this.lm_request['method_type'] === 'Verification') {
                        this.method_content = this.method_content.replace('___registration_no_2___', txt_registration_no_2);
                    }
                }
            } else {
                if (this.lm_request['method_type'] === 'Proposal') {
                    this.processed_request['___registration_no_2___'] = ("0" + txt_registration_no_2);
                }
                if (this.lm_request['method_type'] === 'Verification') {
                    this.method_content = this.method_content.replace('___registration_no_2___', ("0" + txt_registration_no_2));
                }
            }

        }
        if (this.lm_request['vehicle_insurance_type'] === 'new') {
            this.prepared_request['is_claim_exists'] = '';
            this.processed_request['___is_claim_exists___'] = this.prepared_request['is_claim_exists'];
            this.method_content = this.method_content.toString().replace('"vClaimAmount": "0"', '"vClaimAmount": null');
        }
        if (this.lm_request['product_id'] === 10) {
            if (this.lm_request['vehicle_insurance_type'] === 'new') {
                this.prepared_request['vehicle_insurance_type_3'] = 'true';
                this.processed_request['___vehicle_insurance_type_3___'] = this.prepared_request['vehicle_insurance_type_3'];
            } else {
                this.prepared_request['vehicle_insurance_type_3'] = 'false';
                this.processed_request['___vehicle_insurance_type_3___'] = this.prepared_request['vehicle_insurance_type_3'];
            }
        }

        if (this.lm_request['product_id'] === 10 && (this.lm_request['vehicle_insurance_subtype'] === "1CH_0TP" || this.lm_request['vehicle_insurance_subtype'] === "2CH_0TP" || this.lm_request['vehicle_insurance_subtype'] === "3CH_0TP")) {
            this.prepared_request['vehicle_insurance_subtype_2'] = '1022';
            this.processed_request['___vehicle_insurance_subtype_2___'] = this.prepared_request['vehicle_insurance_subtype_2'];
        }

        if (this.lm_request['product_id'] === 1 || this.lm_request['product_id'] === 10) {
            var posp_request_data_car = this.find_text_btw_key(this.method_content.toString(), '<!--CAR_START-->', '<!--CAR_FINISH-->', true);
            var posp_request_data_tw = this.find_text_btw_key(this.method_content.toString(), '<!--TW_START-->', '<!--TW_FINISH-->', true);
            if (this.lm_request['product_id'] === 1) {
                this.method_content = this.method_content.replace(posp_request_data_tw, '');
                this.method_content = this.method_content.replace('<!--TW_START-->', '');
                this.method_content = this.method_content.replace('<!--TW_FINISH-->', '');
                this.method_content = this.method_content.replace('<!--CAR_START-->', '');
                this.method_content = this.method_content.replace('<!--CAR_FINISH-->', '');
            } else {
                this.method_content = this.method_content.replace(posp_request_data_car, '');
                this.method_content = this.method_content.replace('<!--CAR_START-->', '');
                this.method_content = this.method_content.replace('<!--CAR_FINISH-->', '');
                this.method_content = this.method_content.replace('<!--TW_START-->', '');
                this.method_content = this.method_content.replace('<!--TW_FINISH-->', '');
            }
            //console.error("Kotak Request Content for :: ", this.lm_request['product_id'], " :: ", this.method_content);
        }

        if (this.lm_request['product_id'] === 1) {
            if (this.lm_request['is_pa_od'] === 'no') {
                this.method_content = this.method_content.replace('___policy_od_tenure___', '0');
            }
            if (this.lm_request['vehicle_insurance_type'] === 'new') {
                if (this.lm_request['is_pa_od'] === 'yes' && this.lm_request.hasOwnProperty('cpa_tenure') && this.lm_request['cpa_tenure'] !== null && this.lm_request['cpa_tenure'] !== '' && this.lm_request['cpa_tenure'] !== undefined) {
                    if (parseInt(this.lm_request['cpa_tenure']) > 0) {
                        this.prepared_request['cpa_tenure'] = ((parseInt(this.lm_request['cpa_tenure']) === 2) ? 1 : (parseInt(this.lm_request['cpa_tenure'])));
                        this.processed_request['___cpa_tenure___'] = this.prepared_request['cpa_tenure'];
                        this.method_content = this.method_content.toString().replace('___policy_od_tenure___', this.lm_request['cpa_tenure']);
                    } else {
                        this.prepared_request['cpa_tenure'] = 1;
                        this.processed_request['___cpa_tenure___'] = this.prepared_request['cpa_tenure'];
                        this.method_content = this.method_content.toString().replace('___policy_od_tenure___', this.lm_request['cpa_tenure']);
                    }
                }
            }
        }
        if (this.lm_request['product_id'] === 10) {
            if (this.lm_request['is_pa_od'] === 'no') {
                this.method_content = this.method_content.replace('"vPAODTenure": "___policy_od_tenure___"', '"vPAODTenure": "0"');
                this.method_content = this.method_content.replace('"bIsCompulsoryPAWithOwnerDriver": true', '"bIsCompulsoryPAWithOwnerDriver": false');
            }
            if (this.lm_request['vehicle_insurance_subtype'] === '2CH_0TP' || this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP') {
                this.method_content = this.method_content.replace('"vPAODTenure": "___policy_od_tenure___"', '"vPAODTenure": "1"');
            }
        }
        if (this.lm_request['method_type'] === 'Verification') {
            if (this.const_payment_response.pg_post.hasOwnProperty("addedon")) {
                var addedonDate = this.const_payment_response.pg_post.addedon.split(" ");
                addedonDate = addedonDate[0].split("-");
                this.method_content = this.method_content.replaceAll('___current_date___', addedonDate[2] + '/' + addedonDate[1] + '/' + addedonDate[0]);
            }
        }

        var common_replace = {
            'electrical_accessory': '0',
            'non_electrical_accessory': '0',
            'pa_owner_driver_si': '0',
            'pa_unnamed_passenger_si': '0',
            'pa_named_passenger_si': '0',
            'pa_paid_driver_si': '0',
            'voluntary_deductible': '0'
        };
        for (var key in common_replace) {
            if (!this.insurer_lm_request.hasOwnProperty(key) || this.insurer_lm_request[key] < 1) {
                var value = common_replace[key];
                this.method_content = this.method_content.toString().replace('___' + key + '___', value);
            }
        }
        if (this.method.Method_Type === 'Idv') {
            var idv_replace = {
                'electrical_accessory': '0',
                'non_electrical_accessory': '0',
                'pa_owner_driver_si': '0',
                'pa_unnamed_passenger_si': '0',
                'pa_named_passenger_si': '0',
                'pa_paid_driver_si': '0',
                'voluntary_deductible': '0',
                "addon_zero_dep_cover": "false",
                "addon_road_assist_cover": "false",
                "addon_ncb_protection_cover": "false",
                "addon_engine_protector_cover": "false",
                "addon_invoice_price_cover": "false",
                "addon_key_lock_cover": "false",
                "addon_consumable_cover": "false",
                "addon_daily_allowance_cover": "false",
                "addon_windshield_cover": "false",
                "addon_passenger_assistance_cover": "false",
                "addon_tyre_coverage_cover": "false",
                "addon_personal_belonging_loss_cover": "false",
                "addon_inconvenience_allowance_cover": "false",
                "addon_medical_expense_cover": "false",
                "addon_hospital_cash_cover": "false",
                "addon_ambulance_charge_cover": "false",
                "addon_rodent_bite_cover": "false",
                "addon_losstime_protection_cover": "false",
                "addon_hydrostatic_lock_cover": "false"
            };
            for (var key in idv_replace) {
                if (!this.insurer_lm_request.hasOwnProperty(key) || this.insurer_lm_request[key] === '' || this.insurer_lm_request[key] === '0') {
                    var value = idv_replace[key];
                    this.method_content = this.method_content.toString().replace('___' + key + '___', value);
                }
            }
        }

        if (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Idv' || this.lm_request['method_type'] === 'Proposal') {
            //ADDON AGE VALIDATION
            if (this.lm_request['method_type'] !== 'Idv' && this.lm_request['vehicle_insurance_type'] === 'renew') {
                if (this.prepared_request['Plan_Name'] !== 'Basic' && this.prepared_request['Plan_Name'] !== undefined) {
                    //RSA Bundle Code Start
                    var rsaFlag = false;
                    var insurer_vehicle_age_RSA = this.insurer_vehicle_age_year();
                    insurer_vehicle_age_RSA = insurer_vehicle_age_RSA.split("-");
                    if ((insurer_vehicle_age_RSA[2] < 7) || (insurer_vehicle_age_RSA[2] < 8 && insurer_vehicle_age_RSA[1] <= 10)) {
                        if (insurer_vehicle_age_RSA[2] === 7 && insurer_vehicle_age_RSA[1] === 10 && insurer_vehicle_age_RSA[0] >= 1)
                        {
                            rsaFlag = false;
                            console.error("UW rules:- RSA for Private Car is allowed upto 7.99 years only", this.lm_request['crn']);//return false;                
                        } else {
                            rsaFlag = true;
                        }
                    } else {
                        rsaFlag = false;
                        console.error("UW rules:- RSA for Private Car is allowed upto 7.99 years only", this.lm_request['crn']);//return false;            
                    }
                    //RSA Bundle Code End
                    //AllAddon Bundle Code Start
                    var allAddonFlag = false;
                    var insurer_vehicle_age_All_Addon = this.insurer_vehicle_age_year();
                    insurer_vehicle_age_All_Addon = insurer_vehicle_age_All_Addon.split("-");
                    console.error('Kotak', this.lm_request['crn'], insurer_vehicle_age_All_Addon);
                    if ((insurer_vehicle_age_All_Addon[2] < 4) || (insurer_vehicle_age_All_Addon[2] < 5 && insurer_vehicle_age_All_Addon[1] <= 4)) {
                        if (insurer_vehicle_age_All_Addon[2] === 4 && insurer_vehicle_age_All_Addon[1] === 4 && insurer_vehicle_age_All_Addon[0] >= 1)
                        {
                            allAddonFlag = false;
                            console.error("UW rules:- ZD,CC,EP for Private Car is allowed upto 4.49 years only", this.lm_request['crn']);
                        } else {
                            allAddonFlag = true;
                        }
                    } else {
                        allAddonFlag = false;
                        console.error("UW rules:- ZD,CC,EP for Private Car is allowed upto 4.49 years only", this.lm_request['crn']);
                    }
                    //AllAddon Bundle Code End
                    //RTIAllAddon Bundle Code Start
                    var rtiAddonFlag = false;
                    var insurer_vehicle_age_RTI_Addon = this.insurer_vehicle_age_year();
                    insurer_vehicle_age_RTI_Addon = insurer_vehicle_age_RTI_Addon.split("-");
                    console.error('Kotak', this.lm_request['crn'], insurer_vehicle_age_RTI_Addon);
                    if ((insurer_vehicle_age_RTI_Addon[2] < 2) || (insurer_vehicle_age_RTI_Addon[2] < 3 && insurer_vehicle_age_RTI_Addon[1] <= 4)) {
                        if (insurer_vehicle_age_RTI_Addon[2] === 2 && insurer_vehicle_age_RTI_Addon[1] === 4 && insurer_vehicle_age_RTI_Addon[0] >= 1)
                        {
                            rtiAddonFlag = false;
                            console.error("UW rules:- RTI for Private Car is allowed upto 2.49 years only", this.lm_request['crn']);
                        } else {
                            rtiAddonFlag = true;
                        }
                    } else {
                        rtiAddonFlag = false;
                        console.error("UW rules:- RTI for Private Car is allowed upto 2.49 years only", this.lm_request['crn']);
                    }
                    //RTIAllAddon Bundle Code End

                    //RSA Check
                    if (!rsaFlag && this.prepared_request['Plan_Name'] === 'RSA') {
//                        this.method_content = this.method_content.toString().replace('___addon_road_assist_cover___', 'false');
//                        this.method_content = this.method_content.toString().replace('___addon_engine_protector_cover___', 'false');
//                        this.method_content = this.method_content.toString().replace('___addon_zero_dep_cover___', 'false');
//                        this.method_content = this.method_content.toString().replace('___addon_consumable_cover___', 'false');
//                        this.method_content = this.method_content.toString().replace('___addon_invoice_price_cover___', 'false');
                        this.method_content = "";
                    }
                    //AllAddon Check
                    var allAddonFlag_tmp = false;
                    if (!allAddonFlag) {
                        allAddonFlag_tmp = true;
                        console.error("UW rules:- ZD,CC,EP for Private Car is allowed upto 4.49 years only", this.lm_request['crn']);
                    } else {
                        if (this.processed_request['___dbmaster_insurer_vehicle_insurer_segmant___'] !== "HIGH END CARS" && this.processed_request['___dbmaster_insurer_vehicle_fueltype___'] !== "Petrol") {
                            allAddonFlag_tmp = true;
                            console.error("UW rules:- ZD,CC,EP for Private Car is allowed upto 4.49 years only for Petrol - HIGH END CARS", this.lm_request['crn']);
                        }
                    }

                    if (allAddonFlag_tmp && this.prepared_request['Plan_Name'] === 'BUNDLE') {
//                        this.method_content = this.method_content.toString().replace('___addon_road_assist_cover___', 'false');
//                        this.method_content = this.method_content.toString().replace('___addon_engine_protector_cover___', 'false');
//                        this.method_content = this.method_content.toString().replace('___addon_zero_dep_cover___', 'false');
//                        this.method_content = this.method_content.toString().replace('___addon_consumable_cover___', 'false');
//                        this.method_content = this.method_content.toString().replace('___addon_invoice_price_cover___', 'false');
                        this.method_content = "";
                    }
                    //RTIAllAddon Check
                    var rtiAddonFlag_tmp = false;
                    if (!rtiAddonFlag) {
                        rtiAddonFlag_tmp = true;
                        console.error("UW rules:- RTI for Private Car is allowed upto 2.49 years only", this.lm_request['crn']);
                    } else {
                        if (this.processed_request['___dbmaster_insurer_vehicle_insurer_segmant___'] !== "HIGH END CARS" && this.processed_request['___dbmaster_insurer_vehicle_fueltype___'] !== "Petrol") {
                            rtiAddonFlag_tmp = true;
                            console.error("UW rules:- RTI for Private Car is allowed upto 2.49 years only for Petrol - HIGH END CARS", this.lm_request['crn']);
                        }
                    }

                    if (rtiAddonFlag_tmp && this.prepared_request['Plan_Name'] === 'RTI-BUNDLE') {
//                        this.method_content = this.method_content.toString().replace('___addon_road_assist_cover___', 'false');
//                        this.method_content = this.method_content.toString().replace('___addon_engine_protector_cover___', 'false');
//                        this.method_content = this.method_content.toString().replace('___addon_zero_dep_cover___', 'false');
//                        this.method_content = this.method_content.toString().replace('___addon_consumable_cover___', 'false');
//                        this.method_content = this.method_content.toString().replace('___addon_invoice_price_cover___', 'false');
                        this.method_content = "";
                    }
                }
            }

            var vehicle_registration_year = this.lm_request['vehicle_registration_date'].split("-");
            this.prepared_request['vehicle_registration_year'] = vehicle_registration_year[0];
            this.processed_request['___vehicle_registration_year___'] = this.prepared_request['vehicle_registration_year'];
            if (this.lm_request['pa_paid_driver_si'] !== null && this.lm_request['pa_paid_driver_si'] !== '' && this.lm_request['pa_paid_driver_si'] !== 0 && this.lm_request['pa_paid_driver_si'] > 0) {
                this.method_content = this.method_content.toString().replace('___pa_paid_driver_si_2___', 'true');
                this.method_content = this.method_content.toString().replace('___pa_paid_driver_si_3___', '1');
            } else {
                this.method_content = this.method_content.toString().replace('___pa_paid_driver_si_2___', 'false');
                this.method_content = this.method_content.toString().replace('___pa_paid_driver_si_3___', '0');
            }
            if (this.lm_request['vehicle_insurance_type'] === 'renew') {
                if (this.processed_request['___is_claim_exists___'] === 'no') {
                    this.method_content = this.method_content.toString().replace('___is_claim_exists___', '');
                    //this.method_content = this.method_content.toString().replace('"vClaimAmount": "0"', '"vClaimAmount": null');
                }
            }
        }

        if (this.lm_request['vehicle_insurance_type'] === 'new') {
            this.method_content = this.method_content.toString().replace('___policy_expiry_date___', '');
        }

        if (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Proposal' || this.lm_request['method_type'] === 'Idv') {
            this.processed_request['___policy_tenure___'] = parseInt(this.lm_request['policy_tenure']);
        }

        if (this.lm_request['method_type'] === 'Verification') {
            var Erp_Qt_Request_Core = this.Master_Details['User_Data']['Erp_Qt_Request_Core'];
            if (this.prepared_request['dbmaster_pb_insurer_transaction_identifier']) {
                var insurer_transaction_identifier_split = this.prepared_request['dbmaster_pb_insurer_transaction_identifier'].split('-');
                this.prepared_request['insurer_transaction_identifier_1'] = insurer_transaction_identifier_split[0];
                this.processed_request['___insurer_transaction_identifier_1___'] = this.prepared_request['insurer_transaction_identifier_1'];
                this.prepared_request['insurer_transaction_identifier_2'] = insurer_transaction_identifier_split[1];
                this.processed_request['___insurer_transaction_identifier_2___'] = this.prepared_request['insurer_transaction_identifier_2'];
            }
            var contact_name = '';
            if (Erp_Qt_Request_Core['___middle_name___'] !== '') {
                contact_name = Erp_Qt_Request_Core['___first_name___'] + " " + Erp_Qt_Request_Core['___middle_name___'] + " " + Erp_Qt_Request_Core['___last_name___'];
            } else {
                contact_name = Erp_Qt_Request_Core['___first_name___'] + " " + Erp_Qt_Request_Core['___last_name___'];
            }
            this.prepared_request['contact_name'] = contact_name;
            this.processed_request['___contact_name___'] = this.prepared_request['contact_name'];

            if (this.lm_request['product_id'] === 1) {
                this.prepared_request['final_premium'] = this.insurer_master['service_logs']['pb_db_master']['Insurer_Response']['vTotalPremium'];
                this.processed_request['___final_premium___'] = this.prepared_request['final_premium'];
            }
            if (this.lm_request['product_id'] === 10) {
                this.prepared_request['final_premium'] = this.insurer_master['service_logs']['pb_db_master']['Insurer_Response']['TwoWheelerResponseWithCover']['nTotalPremium'];
                this.processed_request['___final_premium___'] = this.prepared_request['final_premium'];
            }

            if (this.lm_request['vehicle_insurance_type'] === 'renew') {
                this.prepared_request['pip_flag'] = 'Yes';
                this.processed_request['___pip_flag___'] = this.prepared_request['pip_flag'];
            } else {
                this.prepared_request['pip_flag'] = 'No';
                this.processed_request['___pip_flag___'] = this.prepared_request['pip_flag'];
            }
            if (Erp_Qt_Request_Core['___gender___'] === 'M') {
                this.prepared_request['gender_2'] = 'MALE';
                this.processed_request['___gender_2___'] = this.prepared_request['gender_2'];
            } else {
                this.prepared_request['gender_2'] = 'FEMALE';
                this.processed_request['___gender_2___'] = this.prepared_request['gender_2'];
            }

            //this.method_content = this.method_content.replace('___transaction_id___', this.prepared_request['pg_reference_number_2']);
            this.method_content = this.method_content.replace('___salutation___', Erp_Qt_Request_Core['___salutation___']);
            this.method_content = this.method_content.replace('___first_name___', Erp_Qt_Request_Core['___first_name___']);
            this.method_content = this.method_content.replace('___middle_name___', Erp_Qt_Request_Core['___middle_name___']);
            this.method_content = this.method_content.replace('___last_name___', Erp_Qt_Request_Core['___last_name___']);
            this.method_content = this.method_content.replace('___email___', Erp_Qt_Request_Core['___email___']);
            this.method_content = this.method_content.replace('___mobile___', Erp_Qt_Request_Core['___mobile___']);

            var customer_dob = (Erp_Qt_Request_Core['___birth_date___']).split('-');
            this.method_content = this.method_content.replace('___birth_date___', (customer_dob[2] + '/' + customer_dob[1] + '/' + customer_dob[0]));

            this.method_content = this.method_content.replace('___communication_pincode___', Erp_Qt_Request_Core['___communication_pincode___']);
            this.method_content = this.method_content.replace('___pan___', Erp_Qt_Request_Core['___pan___']);
            this.method_content = this.method_content.replace('___nominee_name___', Erp_Qt_Request_Core['___nominee_name___']);

            var nominee_dob = (Erp_Qt_Request_Core['___nominee_birth_date___']).split('-');
            this.method_content = this.method_content.replace('___nominee_birth_date___', (nominee_dob[2] + '/' + nominee_dob[1] + '/' + nominee_dob[0]));

            this.method_content = this.method_content.replace('___nominee_relation___', Erp_Qt_Request_Core['___nominee_relation___']);
            this.method_content = this.method_content.replace('___registration_no_1___', Erp_Qt_Request_Core['___registration_no_1___']);
            /*if (Erp_Qt_Request_Core['___registration_no_2___'].length > 1) {
             this.method_content = this.method_content.replace('___registration_no_2___', Erp_Qt_Request_Core['___registration_no_2___']);
             } else {
             this.method_content = this.method_content.replace('___registration_no_2___', ("0" + Erp_Qt_Request_Core['___registration_no_2___']));
             }*/
            this.method_content = this.method_content.replace('___registration_no_3___', Erp_Qt_Request_Core['___registration_no_3___']);
            this.method_content = this.method_content.replace('___registration_no_4___', Erp_Qt_Request_Core['___registration_no_4___']);
            this.method_content = this.method_content.replace('___engine_number___', Erp_Qt_Request_Core['___engine_number___']);
            this.method_content = this.method_content.replace('___chassis_number___', Erp_Qt_Request_Core['___chassis_number___']);
            this.method_content = this.method_content.replace('___previous_policy_number___', Erp_Qt_Request_Core['___previous_policy_number___']);
            if (this.lm_request['product_id'] === 1) {
                this.method_content = this.method_content.replace('___final_premium___', this.insurer_master['service_logs']['pb_db_master']['Insurer_Response']['vTotalPremium']);
                if (Erp_Qt_Request_Core['___is_financed___'] === "yes") {
                    this.method_content = this.method_content.replace('___is_financed_2___', '1');
                } else {
                    this.method_content = this.method_content.replace('___is_financed_2___', '0');
                }
            }
            if (this.lm_request['product_id'] === 10) {
                this.method_content = this.method_content.replace('___final_premium___', this.insurer_master['service_logs']['pb_db_master']['Insurer_Response']['TwoWheelerResponseWithCover']['nTotalPremium']);
                if (Erp_Qt_Request_Core['___is_financed___'] === "yes") {
                    this.method_content = this.method_content.replace('___is_financed_2___', 'true');
                } else {
                    this.method_content = this.method_content.replace('___is_financed_2___', 'false');
                }
            }

            this.method_content = this.method_content.replace('___communication_address_1___', Erp_Qt_Request_Core['___communication_address_1___'] + Erp_Qt_Request_Core['___communication_address_2___']);
            this.method_content = this.method_content.replace('___communication_address_2___', Erp_Qt_Request_Core['___communication_address_3___'] + ',' + Erp_Qt_Request_Core['___communication_city___'] + ',' + Erp_Qt_Request_Core['___communication_state___']);

            if (Erp_Qt_Request_Core['___is_financed___'] === "yes") {
                this.method_content = this.method_content.replace('___financial_institute_code___', Erp_Qt_Request_Core['___financial_institute_code___']);
                this.method_content = this.method_content.replace('___financial_institute_name___', Erp_Qt_Request_Core['___financial_institute_name___']);
                this.method_content = this.method_content.replace('___financial_institute_city___', Erp_Qt_Request_Core['___financial_institute_city___']);
                this.method_content = this.method_content.replace('___financial_agreement_type___', Erp_Qt_Request_Core['___financial_agreement_type___']);
            } else {
                this.method_content = this.method_content.replace('___financial_institute_code___', '');
                this.method_content = this.method_content.replace('___financial_institute_name___', '');
                this.method_content = this.method_content.replace('___financial_institute_city___', '');
                this.method_content = this.method_content.replace('___financial_agreement_type___', '');
            }
        }
        if (this.lm_request['method_type'] === 'Pdf') {
            this.processed_request['___policy_number___'] = this.lm_request['policy_number'];
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_product_field_process_pre', ex);
    }
};
KotakMotor.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
KotakMotor.prototype.insurer_product_field_process_post = function () {

};
KotakMotor.prototype.insurer_product_api_post = function () {

};
KotakMotor.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    try {
        let objInsurerProduct = this;
        //Example POST method invocation 
        var Client = require('node-rest-client').Client;
        var client = new Client();
        //Get Service Access Token -- START
        var CryptoJS = require("crypto-js");
        var AES = require("crypto-js/aes");
        var SHA256 = require("crypto-js/sha256");
        var btoa = require("btoa");
        let vRanKey = 0;//Math.floor((Math.random() * 8080808080808080) + 1);
        //console.error('kotak_motor_access_token vRanKey : ', vRanKey, ' and length is : ', vRanKey.toString().length);
        var keyflag = false;
        while (!keyflag) {
            vRanKey = Math.floor((Math.random() * 8080808080808080) + 1);
            console.error('kotak_motor_access_token vRanKey : ', vRanKey, ' and length is : ', vRanKey.toString().length);
            if (vRanKey.toString().length === 16) {
                keyflag = true;
            } else {
                keyflag = false;
            }
            console.log('keyflag : ', keyflag);
        }
        if (keyflag) {
            let key = CryptoJS.enc.Utf8.parse(vRanKey);
            let iv = CryptoJS.enc.Utf8.parse(vRanKey);
            let txtUserName = '';
            let txtPassword = '';
            let auth_url = '';
            if (config.environment.name.toString() === 'Production') {
                auth_url = 'https://api.kotakgeneralinsurance.com/BPOS_USER_SERVICE/wsUserManagementServices.svc/Fn_Get_Service_Access_Token_For_User';
                txtUserName = '3212290000';
                txtPassword = 'Apr@2019';
            } else {
                auth_url = 'https://kgibridgeuat.kotakmahindrageneralinsurance.com/BPOS_USER_SERVICE/wsUserManagementServices.svc/Fn_Get_Service_Access_Token_For_User';
                txtUserName = 'BP000001';
                txtPassword = 'Admin@1234';
            }
            let vEncryptedLogin = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(txtUserName), key, {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            let vEncryptedPassword = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(txtPassword), key, {
                keySize: 128 / 8,
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });
            vEncryptedLogin = btoa(vEncryptedLogin);
            vEncryptedPassword = btoa(vEncryptedPassword);
            console.log('kotak_motor_access_token vEncryptedLogin : ', vEncryptedLogin);
            console.log('kotak_motor_access_token vEncryptedPassword : ', vEncryptedPassword);
            let token_args = {
                data: {
                    "vLoginEmailId": vEncryptedLogin,
                    "vPassword": vEncryptedPassword
                },
                headers: {
                    "Content-Type": "application/json",
                    "vRanKey": vRanKey
                }
            };
            console.error("kotak_motor_access_token args :: for ", specific_insurer_object.method.Method_Type, "::", txtUserName, txtPassword, auth_url);
            console.error("kotak_motor_access_token args encrypted :: for ", specific_insurer_object.method.Method_Type, "::", token_args);

            //Get Service Access Token -- END
            console.error("KotakMotor ::", specific_insurer_object.method.Method_Type, ":: CRN -", objInsurerProduct.lm_request['crn'], "::  method_content-", this.method_content);
            //if (this.method_content !== "") {
            client.post(auth_url, token_args, function (token_data, token_response) {
                console.error("kotak_motor_access_token", objInsurerProduct.lm_request['crn'], specific_insurer_object.method.Method_Type, token_data);
                if (token_data.hasOwnProperty('vErrorMsg') === true && token_data['vErrorMsg'] === 'Success' && token_data.hasOwnProperty('vTokenCode') === true && token_data['vTokenCode'] !== null && token_data['vTokenCode'] !== '') {
                    console.error("kotak_motor_access_token", 'token_found', token_data['vTokenCode']);
                    // Service Call - Start    
                    let AuthKey = token_data['vTokenCode'];
                    if (specific_insurer_object.method.Method_Type === 'Pdf') {
                        let ProposalNumber = objInsurerProduct.processed_request['___pg_reference_number_1___'];
                        let PolicyNumber = objInsurerProduct.processed_request['___policy_number___'];
                        let ProductCode = objInsurerProduct.lm_request['pg_reference_number_3'];
                        let LoginEmailId = objInsurerProduct.processed_request['___insurer_integration_agent_code___'];

                        let args = {
                            headers: {
                                "Content-Type": "application/json",
                                "vTokenCode": AuthKey
                            }
                        };

                        let service_call_url = specific_insurer_object.method_file_url + '/' + specific_insurer_object.method.Method_Action + '/' + ProposalNumber + '/' + PolicyNumber + '/' + ProductCode + '/' + LoginEmailId;
                        console.error("kotak_motor_pdf", 'service_call_url', service_call_url);
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
                        let service_call_url = specific_insurer_object.method_file_url + '/' + specific_insurer_object.method.Method_Action;
                        console.error("kotak_motor service_call Insurer_Request : ", objInsurerProduct.lm_request['crn'], specific_insurer_object.method.Method_Type, docLog.Insurer_Request);
                        let args = {
                            data: docLog.Insurer_Request,
                            headers: {
                                "Content-Type": "application/json",
                                "vTokenCode": AuthKey
                            }
                        };
                        if (specific_insurer_object.method.Method_Type === 'Verification') {
                            let str = objInsurerProduct.processed_request['___dbmaster_insurer_transaction_identifier___'];
                            let QuoteID = str.split("-");
                            if (objInsurerProduct['lm_request']['product_id'] === 1) {
                                service_call_url = service_call_url + '/' + QuoteID[0] + '/' + objInsurerProduct.prepared_request['insurer_integration_agent_code'];
                            }
                        } else {
                            if (objInsurerProduct['lm_request']['product_id'] === 1) {
                                service_call_url = service_call_url + '/' + objInsurerProduct.prepared_request['insurer_integration_agent_code'];
                            }
                        }
                        console.error('kotak_motor_service_call', specific_insurer_object.method.Method_Type, 'AuthKey', AuthKey, 'service_call_url', service_call_url);
                        client.post(service_call_url, args, function (service_data, service_response) {
                            //console.log('Kotak Motor service_call data : ', data1);
                            if (service_data) {
                                console.error('kotak_motor_service_call', 'WORKING');
                                let objResponseFull = {
                                    'err': null,
                                    'result': service_data,
                                    'raw': null,
                                    'soapHeader': null,
                                    'objResponseJson': service_data
                                };
                                let serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                                if (specific_insurer_object.method.Method_Type === 'Idv') {
                                    objInsurerProduct.insurer_vehicle_idv_handler(serviceBreakup, objProduct, Insurer_Object, specific_insurer_object);
                                }
                            } else {
                                console.error('kotak_motor_service_call', 'NOTWORKING', service_data, service_response);
                                let objResponseFull = {
                                    'err': service_response,
                                    'result': service_response,
                                    'raw': service_response,
                                    'soapHeader': null,
                                    'objResponseJson': service_response
                                };
                                let serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                            }
                        });
                    }
                } else {
                    console.error("kotak_motor_access_token", 'token_not_found', token_data);
                    var objResponseFull = {
                        'err': token_data,
                        'result': token_data,
                        'raw': null,
                        'soapHeader': null,
                        'objResponseJson': token_data
                    };
                    var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                }
            });
            /*} else {
             console.error("kotak_motor_validations", 'Either RTO or Vehicle is in block list.');
             var objResponseFull = {
             'err': ["kotak_motor_validations : Either RTO or Vehicle is in block list."],
             'result': ["kotak_motor_validations : Either RTO or Vehicle is in block list."],
             'raw': null,
             'soapHeader': null,
             'objResponseJson': ["kotak_motor_validations : Either RTO or Vehicle is in block list."]
             };
             var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
             }*/
            if (specific_insurer_object.method.Method_Type === 'Premium' || specific_insurer_object.method.Method_Type === 'Idv') {
                sleep(500);
            }
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e.stack);
    }
};
KotakMotor.prototype.idv_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'idv_response_handler', objResponseJson);
    //var objPremiumService = objResponseJson;
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (this.lm_request['product_id'] === 1) {
            if (objResponseJson.hasOwnProperty('vErrorMsg')) {
                if (objResponseJson['vErrorMsg'] === 'Success') {
                    var Idv_Breakup = this.get_const_idv_breakup();
                    if (parseInt(objResponseJson['vFinalIDV']) <= 5000000) {
                        Idv_Breakup["Idv_Normal"] = Math.round(objResponseJson['vFinalIDV'] - 0); //vSystemIDV
                        Idv_Breakup["Idv_Min"] = Math.round(Idv_Breakup["Idv_Normal"] * 0.90);
                        Idv_Breakup["Idv_Max"] = Math.round(Idv_Breakup["Idv_Normal"] * 1.10);
                        Idv_Breakup["Exshowroom"] = 0;
                        objServiceHandler.Premium_Breakup = Idv_Breakup;
                        objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['vQuoteId'] + '-' + objResponseJson['vWorkFlowID'];
                    } else {
                        Error_Msg = 'Kotak Motor : IDV is more than 50 lacs SO NO QUOTES';
                    }
                } else {
                    Error_Msg = objResponseJson['vErrorMsg'];
                }
            } else {
                Error_Msg = objResponseJson;
            }
        }

        if (this.lm_request['product_id'] === 10) {
            if (objResponseJson.hasOwnProperty('ErrorMessage')) {
                if (objResponseJson['ErrorMessage'] === null) {
                    if (objResponseJson.hasOwnProperty('TwoWheelerResponseWithCover') && objResponseJson['TwoWheelerResponseWithCover'].hasOwnProperty('vErrorMessage')) {
                        var objPremiumService = objResponseJson['TwoWheelerResponseWithCover'];
                        if (objPremiumService['vErrorMessage'] === "") {
                            var Idv_Breakup = this.get_const_idv_breakup();
                            if (parseInt(objPremiumService['nFinalIDV']) <= 5000000) {
                                Idv_Breakup["Idv_Normal"] = Math.round(objPremiumService['nFinalIDV'] - 0); //vSystemIDV
                                Idv_Breakup["Idv_Min"] = Math.round(Idv_Breakup["Idv_Normal"] * 0.85);
                                Idv_Breakup["Idv_Max"] = Math.round(Idv_Breakup["Idv_Normal"] * 1.15);
                                Idv_Breakup["Exshowroom"] = 0;
                                objServiceHandler.Premium_Breakup = Idv_Breakup;
                                objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['vQuoteID'] + '-' + objPremiumService['vWorkFlowID'];
                            } else {
                                Error_Msg = 'Kotak Motor : IDV is more than 50 lacs SO NO QUOTES';
                            }
                        } else {
                            Error_Msg = objPremiumService['vErrorMessage'];
                        }
                    } else {
                        Error_Msg = objResponseJson;
                    }
                } else {
                    Error_Msg = objResponseJson['ErrorMessage'];
                }
            } else {
                Error_Msg = objResponseJson;
            }
        }
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'idv_response_handler', ex.stack);
    }
    objServiceHandler.Error_Msg = Error_Msg;
    return objServiceHandler;
};
KotakMotor.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var objPremiumService = objResponseJson;
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        var insurer_vehicle_age = this.insurer_vehicle_age_year();
        insurer_vehicle_age = insurer_vehicle_age.split("-");
        var age_in_year = parseInt(insurer_vehicle_age[2]);
        var age_in_month = parseInt(insurer_vehicle_age[1]);
        var age_in_day = parseInt(insurer_vehicle_age[0]);

        if (age_in_year < 12) {
            if (age_in_year === 11 && age_in_month === 10 && age_in_day >= 1) {
                Error_Msg = "UW rules:- vehicle age for Private Car is allowed upto 11.95 years only";//return false;
            } else if (age_in_year === 11 && age_in_month > 10) {
                Error_Msg = "UW rules:- vehicle age for Private Car is allowed upto 11.95 years only";//return false;
            } else {
                Error_Msg = 'NO_ERR';
            }
        } else {
            Error_Msg = "UW rules:- vehicle age for Private Car is allowed upto 11.95 years only";//return false;
        }

        if (Error_Msg === "NO_ERR") {
            if (this.lm_request['product_id'] === 1) {
                if (objPremiumService.hasOwnProperty('vErrorMsg')) {
                    if (objPremiumService['vErrorMsg'] === "Success") {
                        var premium_breakup = this.get_const_premium_breakup();
                        if (Error_Msg === 'NO_ERR') {
                            var od_disc_vol_deduct = '';
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
                                        if (sub_key.indexOf('_final_') > -1) {
                                            group_final_key = sub_key;
                                        } else if (sub_key.indexOf('_disc') > -1) {
                                            group_final -= premium_val;
                                        } else {
                                            group_final += premium_val;
                                        }
                                    }
                                    if (key === "addon") {
                                        od_disc_vol_deduct = ((objPremiumService.hasOwnProperty('vVoluntaryDeductionDepWaiver')) ? (objPremiumService['vVoluntaryDeductionDepWaiver'] - 0) : 0);
                                        premium_breakup['addon']['addon_zero_dep_cover'] = premium_breakup['addon']['addon_zero_dep_cover'] - od_disc_vol_deduct;
                                        group_final = group_final - od_disc_vol_deduct;
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
                            objServiceHandler.Premium_Breakup = premium_breakup;
                            objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['vQuoteId'] + '-' + objPremiumService['vWorkFlowID'];
                        }
                    } else {
                        Error_Msg = objPremiumService['vErrorMsg'];
                    }
                } else {
                    Error_Msg = objPremiumService['vErrorMsg'];
                }
            }
        }
        if (this.lm_request['product_id'] === 10) {
            if (objResponseJson.hasOwnProperty('ErrorMessage')) {
                if (objResponseJson['ErrorMessage'] === null) {
                    if (objResponseJson.hasOwnProperty('TwoWheelerResponseWithCover') && objResponseJson['TwoWheelerResponseWithCover'].hasOwnProperty('vErrorMessage')) {
                        var objPremiumData = objResponseJson['TwoWheelerResponseWithCover'];
                        if (objPremiumData['vErrorMessage'] === "") {
                            var premium_breakup = this.get_const_premium_breakup();
                            if (Error_Msg === 'NO_ERR') {
                                for (var key in this.premium_breakup_schema) {
                                    if (typeof this.premium_breakup_schema[key] === 'object') {
                                        var group_final = 0, group_final_key = '';
                                        for (var sub_key in this.premium_breakup_schema[key]) {
                                            if (sub_key === 'od_basic') {
                                                this.premium_breakup_schema[key]['od_basic'] = 'nOwnDamagePremium';
                                            }
                                            if (sub_key === 'od_elect_access') {
                                                this.premium_breakup_schema[key]['od_elect_access'] = 'nElectricalAccessoriesPremium';
                                            }
                                            if (sub_key === 'od_non_elect_access') {
                                                this.premium_breakup_schema[key]['od_non_elect_access'] = 'nNonElectricalAccessoriesPremium';
                                            }
                                            if (sub_key === 'od_disc_ncb') {
                                                this.premium_breakup_schema[key]['od_disc_ncb'] = 'nNoClaimBonusDiscount';
                                            }
                                            if (sub_key === 'od_final_premium') {
                                                this.premium_breakup_schema[key]['od_final_premium'] = 'nTotalPremiumOwnDamage';
                                            }
                                            if (sub_key === 'tp_basic') {
                                                this.premium_breakup_schema[key]['tp_basic'] = 'nBasicTPPremium';
                                            }
                                            if (sub_key === 'tp_cover_owner_driver_pa') {
                                                this.premium_breakup_schema[key]['tp_cover_owner_driver_pa'] = 'nPACoverForOwnerDriverPremium';
                                            }
                                            if (sub_key === 'tp_final_premium') {
                                                this.premium_breakup_schema[key]['tp_final_premium'] = 'nTotalPremiumLiability';
                                            }

                                            var premium_key = this.premium_breakup_schema[key][sub_key];
                                            var premium_val = 0;
                                            if (premium_key && objPremiumData.hasOwnProperty(premium_key)) {
                                                premium_val = parseInt(objPremiumData[premium_key]);
                                            }
                                            premium_val = isNaN(premium_val) ? 0 : premium_val;
                                            premium_breakup[key][sub_key] = premium_val;
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
                                        if (key === 'net_premium') {
                                            this.premium_breakup_schema['net_premium'] = 'nNetPremium';
                                        }
                                        if (key === 'service_tax') {
                                            this.premium_breakup_schema['service_tax'] = 'nGSTAmount';
                                        }
                                        if (key === 'final_premium') {
                                            this.premium_breakup_schema['final_premium'] = 'nTotalPremium';
                                        }
                                        var premium_key = this.premium_breakup_schema[key];
                                        var premium_val = 0;
                                        if (premium_key && objPremiumData.hasOwnProperty(premium_key)) {
                                            premium_val = parseInt(objPremiumData[premium_key]);
                                        }
                                        premium_val = isNaN(premium_val) ? 0 : premium_val;
                                        premium_breakup[key] = premium_val;
                                    }
                                }
                                objServiceHandler.Premium_Breakup = premium_breakup;
                                objServiceHandler.Insurer_Transaction_Identifier = objPremiumData['vQuoteID'] + '-' + objPremiumData['vWorkFlowID'];
                            }
                        } else {
                            Error_Msg = objPremiumData['vErrorMessage'];
                        }
                    } else {
                        Error_Msg = objResponseJson;
                    }
                } else {
                    Error_Msg = objResponseJson['ErrorMessage'];
                }
            } else {
                Error_Msg = objResponseJson;
            }
        }
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'premium_response_handler', ex.stack);
    }
    objServiceHandler.Error_Msg = Error_Msg;
    console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
    return objServiceHandler;
};
KotakMotor.prototype.insurer_vehicle_idv = function (objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback) {

    console.log('Start', this.constructor.name, 'insurer_vehicle_idv');
    var objInsurerProduct = this;
    try {
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
        this.method = IdvMethod;
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
    }
};
KotakMotor.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    //objResponseJson = this.insurer_master.service_logs.pb_db_master.Insurer_Response;
    var objPremiumService = objResponseJson;
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'QuoteNumber': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (this.lm_request['product_id'] === 1) {
            if (objPremiumService.hasOwnProperty('vErrorMsg')) {
                if (objPremiumService['vErrorMsg'] === "Success") {
                    objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['vQuoteId'] + '-' + objPremiumService['vWorkFlowID'];
                    objServiceHandler.QuoteNumber = objPremiumService['vQuoteId'];
                    objServiceHandler.WorkFlowNumber = objPremiumService['vWorkFlowID'];
                } else {
                    Error_Msg = objPremiumService['vErrorMsg'];
                }
            } else {
                Error_Msg = objPremiumService['vErrorMsg'];
            }
        }
        if (this.lm_request['product_id'] === 10) {
            if (objResponseJson.hasOwnProperty('ErrorMessage')) {
                if (objResponseJson['ErrorMessage'] === null) {
                    if (objResponseJson.hasOwnProperty('TwoWheelerResponseWithCover') && objResponseJson['TwoWheelerResponseWithCover'].hasOwnProperty('vErrorMessage')) {
                        var objPremiumData = objResponseJson['TwoWheelerResponseWithCover'];
                        if (objPremiumData['vErrorMessage'] === "") {
                            objServiceHandler.Insurer_Transaction_Identifier = objPremiumData['vQuoteID'] + '-' + objPremiumData['vWorkFlowID'];
                            objServiceHandler.QuoteNumber = objPremiumData['vQuoteID'];
                            objServiceHandler.WorkFlowNumber = objPremiumData['vWorkFlowID'];
                        } else {
                            Error_Msg = objPremiumData['vErrorMessage'];
                        }
                    } else {
                        Error_Msg = objResponseJson;
                    }
                } else {
                    Error_Msg = objResponseJson['ErrorMessage'];
                }
            } else {
                Error_Msg = objResponseJson;
            }
        }

        if (Error_Msg === 'NO_ERR') {
            //if (objPremiumService.hasOwnProperty('vErrorMsg')) {
            //if (objPremiumService['vErrorMsg'] === "Success") {
            var final_premium = '';
            if (this.lm_request['product_id'] === 1) {
                final_premium = objResponseJson['vTotalPremium']; //parseInt(parseFloat(objPremiumService['vTotalPremium']));
            }
            if (this.lm_request['product_id'] === 10) {
                final_premium = objResponseJson['TwoWheelerResponseWithCover']['nTotalPremium']; //parseInt(parseFloat(objPremiumService['vTotalPremium']));
            }

            var is_idv_verified = false;
            if (this.prepared_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
                is_idv_verified = true;
            } else {
                var vehicle_expected_idv = (parseInt(this.lm_request['vehicle_expected_idv']) - 0);
                var vehicle_received_idv = (parseInt(objResponseJson['vFinalIDV']) - 0);
                is_idv_verified = (vehicle_expected_idv === vehicle_received_idv);
            }

            var objPremiumVerification = this.premium_verification(final_premium, this.processed_request['___final_premium___'], 10, 3);
            if (is_idv_verified) {
                if (objPremiumVerification.Status) {
                } else {
                    Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
                }
            } else {
                Error_Msg = 'LM_IDV_MISMATCH_REQUEST_IDV_' + vehicle_expected_idv.toString() + '_RECEIVED_IDV_' + vehicle_received_idv.toString();
            }

            var merchant_key = '';//'157487';//'an7rIU';
            var productinfo = '';
            var salt = '';//'8MUr8LS7';
            if (config.environment.name === 'Production') {
                merchant_key = 'KoXBAd';//'si7yXM';
                productinfo = 'kotak';
                salt = 'uM9IRHYR';//'pJnQiKCg';
            } else {
                merchant_key = 'an7rIU';
                productinfo = 'kotak';
                salt = '8MUr8LS7';
            }
            var hashSequence = 'key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10';
            var str = hashSequence.split('|');
            var strHash = this.convert_to_sha512(this.randomNumeric(10) + moment().format('MM-DD-YYYY h:mm a'));
            var txnid1 = strHash.toString().substring(0, 20).toLowerCase();
            var hash_string = '';
            for (var hash_var in str) {
                if (str[hash_var] === "key")
                {
                    hash_string = hash_string + merchant_key;
                    hash_string = hash_string + '|';
                } else if (str[hash_var] === "txnid")
                {
                    hash_string = hash_string + txnid1;
                    hash_string = hash_string + '|';
                } else if (str[hash_var] === "amount")
                {
                    hash_string = hash_string + final_premium;
                    hash_string = hash_string + '|';
                } else if (str[hash_var] === "productinfo")
                {
                    hash_string = hash_string + productinfo;
                    hash_string = hash_string + '|';
                } else if (str[hash_var] === "firstname")
                {
                    hash_string = hash_string + this.lm_request['first_name'];
                    hash_string = hash_string + '|';
                } else if (str[hash_var] === "email")
                {
                    hash_string = hash_string + this.lm_request['email'];
                    hash_string = hash_string + '|';
                } else if (str[hash_var] === "udf1")
                {
                    hash_string = hash_string + 'M/s Landmark Insurance Brokers Pvt Ltd (Policy Boss)';
                    hash_string = hash_string + '|';
                } else
                {
                    hash_string = hash_string + '';
                    hash_string = hash_string + '|';
                }
            }
            hash_string = hash_string + salt;
            var hash1 = this.convert_to_sha512(hash_string).toLowerCase();
            console.log('hash_string -- >' + hash_string);

            var pg_data = {
                'firstname': this.lm_request['first_name'],
                'lastname': this.lm_request['last_name'],
                'surl': this.const_payment.pg_ack_url,
                'phone': this.lm_request['mobile'],
                'key': merchant_key,
                'hash': hash1,
                'curl': this.const_payment.pg_ack_url,
                'furl': this.const_payment.pg_ack_url,
                'txnid': txnid1,
                'productinfo': productinfo,
                'amount': final_premium,
                'email': this.lm_request['email'],
                'udf1': 'M/s Landmark Insurance Brokers Pvt Ltd (Policy Boss)'
            };
            objServiceHandler.Payment.pg_data = pg_data;
            objServiceHandler.Payment.pg_redirect_mode = 'POST';
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'proposal_response_handler', ex.stack);
    }
    return objServiceHandler;
};
KotakMotor.prototype.pg_response_handler = function () {
    console.log('Start', this.constructor.name, 'pg_response_handler', JSON.stringify(this.const_payment_response));
    try {
        var objInsurerProduct = this;
        this.const_policy.pg_status = '';
        this.const_policy.transaction_id = objInsurerProduct.lm_request.pg_post['txnid'];
        if (objInsurerProduct.lm_request.pg_post['status'] === 'success') {
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.transaction_amount = parseInt(objInsurerProduct.lm_request.pg_post['amount']);
            this.const_policy.pg_reference_number_1 = objInsurerProduct.lm_request.pg_post['txnid'];
            this.const_policy.pg_reference_number_2 = objInsurerProduct.lm_request.pg_post['mihpayid'];
        }
        if (objInsurerProduct.lm_request.pg_post['status'] === 'failure') {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
KotakMotor.prototype.verification_response_handler = function (objResponseJson) {
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
            var objProductValue = '';
            if (this.lm_request['product_id'] === 1) {
                objProductValue = 'Fn_Save_Partner_Private_Car_Proposal_Payment_DetailsResult';
            } else {
                objProductValue = 'Fn_Save_Partner_Two_Wheeler_Proposal_Payment_DetailsResult';
            }
            if (objResponseJson.hasOwnProperty(objProductValue)) {
                objResponseJson = objResponseJson[objProductValue];
                if (objResponseJson.hasOwnProperty('vErrorMessage')) {
                    if (objResponseJson['vErrorMessage'] === "Success") {
                    } else {
                        Error_Msg = objResponseJson['vErrorMessage'];
                    }
                } else {
                    Error_Msg = JSON.stringify(objResponseJson);
                }
            } else {
                Error_Msg = JSON.stringify(objResponseJson);
            }

            if (Error_Msg === 'NO_ERR') {
                if (objResponseJson.hasOwnProperty('vPolicyNumber') && objResponseJson['vPolicyNumber'] !== '') {
                    this.const_policy.policy_number = objResponseJson['vPolicyNumber'];
                    this.const_policy.policy_id = objResponseJson['vQuoteId'];
                    this.const_policy.pg_reference_number_1 = objResponseJson['vProposalNumber'];
                    this.const_policy.pg_reference_number_3 = objResponseJson['vProductCode'];
                    this.const_policy.transaction_status = 'SUCCESS';
                    objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['vProposalNumber'];

                    var product_name = 'CAR';
                    if (this.lm_request['product_id'] === 10) {
                        product_name = 'TW';
                    }
                    var pdf_file_name = this.constructor.name + '_' + product_name + '_' + this.const_policy.policy_number + '.pdf';
                    var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                    var pdf_web_path = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    //var pdf_web_path = config.environment.weburl + config.pb_config.pdf_web_loc + pdf_file_name;
                    this.const_policy.policy_url = pdf_web_path;

                    var args = {
                        data: {
                            "search_reference_number": this.lm_request['search_reference_number'],
                            "api_reference_number": this.lm_request['api_reference_number'],
                            "client_key": this.lm_request['client_key'],
                            "secret_key": this.lm_request['secret_key'],
                            "policy_url": this.const_policy.policy_url,
                            "policy_number": this.const_policy.policy_number,
                            "policy_id": this.const_policy.policy_id,
                            "transaction_status": this.const_policy.transaction_status,
                            "pg_status": this.const_policy.pg_status,
                            "transaction_id": this.const_policy.transaction_id,
                            "transaction_amount": this.const_policy.transaction_amount,
                            "pg_reference_number_1": this.const_policy.pg_reference_number_1,
                            "pg_reference_number_2": this.const_policy.pg_reference_number_2,
                            "pg_reference_number_3": this.const_policy.pg_reference_number_3,
                            "verification_request": null,
                            "crn": this.lm_request['crn'],
                            "insurer_id": this.lm_request['insurer_id'],
                            "method_type": "Pdf",
                            "execution_async": "no"
                        },
                        headers: {
                            "Content-Type": "application/json",
                            "client_key": this.lm_request['client_key'],
                            "secret_key": this.lm_request['secret_key']
                        }
                    };
                    this.pdf_call_new(config.environment.weburl + '/quote/pdf_initiate', args, pdf_sys_loc);
                } else {
                    this.const_policy.transaction_status = 'PAYPASS';
                }
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
        console.error('Exception', this.constructor.name, 'verification_response_handler', objServiceHandler, ex.stack);
    }
    objServiceHandler.Policy = this.const_policy;
    objServiceHandler.Error_Msg = Error_Msg;
    return objServiceHandler;
};
KotakMotor.prototype.pdf_call_new = function (url, args, pdf_web_path) {
    console.log('Start', this.constructor.name, 'pdf_call_new', url, args, pdf_web_path);
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
                    objInsurerProduct.pdf_call_new(args, pdf_web_path);
                }
            }
        });
        console.log("KotakMotor pdf_call_new objInsurerProduct.pdf_attempt :: ", objInsurerProduct.pdf_attempt);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pdf_call_new', ex);
    }
};
KotakMotor.prototype.pdf_response_handler = function (objResponseJson) {
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
KotakMotor.prototype.lv_quote_no = function () {
    try {
        return this.create_guid('', 'numeric', 7);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'lv_quote_no', ex);
        return 0;
    }
};
KotakMotor.prototype.premium_breakup_schema = {
    "own_damage": {
        "od_basic": "vOwnDamagePremium",
        "od_elect_access": "vElectronicSI",
        "od_non_elect_access": "vNonElectronicSI",
        "od_cng_lpg": "vCngLpgKitPremium",
        "od_disc_ncb": "vNCB",
        "od_disc_vol_deduct": "vVoluntaryDeduction", //"vVoluntaryDeductionDepWaiver",
        "od_disc_anti_theft": "",
        "od_disc_aai": "",
        "od_loading": "",
        "od_disc": "",
        "od_final_premium": "vTotalOwnDamagePremium"
    },
    "liability": {
        "tp_basic": "vBasicTPPremium",
        "tp_cover_owner_driver_pa": "vPACoverForOwnDriver",
        "tp_cover_unnamed_passenger_pa": "vPAForUnnamedPassengerPremium",
        "tp_cover_named_passenger_pa": "",
        "tp_cover_paid_driver_pa": "vPANoOfEmployeeforPaidDriverPremium", //vPAToPaidDriverSI //vLLEOPDCC
        "tp_cover_paid_driver_ll": "vLegalLiabilityPaidDriverNo",
        "tp_cng_lpg": "vLiabilityForBiFuel",
        "tp_final_premium": "vTotalPremiumLiability"
    },
    "addon": {
        "addon_zero_dep_cover": "vDepreciationCover",
        "addon_road_assist_cover": "vRSA",
        "addon_ncb_protection_cover": null,
        "addon_engine_protector_cover": "vEngineProtect",
        "addon_invoice_price_cover": "vReturnToInvoice",
        "addon_key_lock_cover": null,
        "addon_consumable_cover": "vConsumableCover",
        "addon_daily_allowance_cover": null,
        "addon_windshield_cover": null,
        "addon_passenger_assistance_cover": null,
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
    "net_premium": "vNetPremium",
    "service_tax": "vGSTAmount",
    "final_premium": "vTotalPremium"
};
KotakMotor.prototype.getDeclinedRTO1 = function () {
    console.log('KotakMotor getDeclinedRTO1', 'start');
    try {
        var rtoValues = [
            {'rto_code': 'ML'}, {'rto_code': 'MZ'}, {'rto_code': 'TR'}, {'rto_code': 'RJ'},
            {'rto_code': 'HP'}, {'rto_code': 'UK'}, {'rto_code': 'UA'}
        ];
        var index = rtoValues.findIndex(x => x.rto_code === this.lm_request['registration_no_1']);
        if (index === -1) {
            return false;
        } else {
            return true;
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'getDeclinedRTO1', ex);
    }
    console.log('KotakMotor getDeclinedRTO1', 'End');
};
KotakMotor.prototype.getDeclinedRTO2 = function () {
    console.log('KotakMotor getDeclinedRTO2', 'start');
    try {
        /*var rtoValues = [
         {'rto_code': 'HR26'}, {'rto_code': 'HR55'}, {'rto_code': 'HR72'}, {'rto_code': 'HR38'},
         {'rto_code': 'HR51'}, {'rto_code': 'UP14'}, {'rto_code': 'UP16'}, {'rto_code': 'PB08'},
         {'rto_code': 'TN58'}, {'rto_code': 'TN59'}, {'rto_code': 'TN64'}, {'rto_code': 'TN86'},
         {'rto_code': 'TN33'}, {'rto_code': 'TN45'}, {'rto_code': 'TN48'}, {'rto_code': 'TN81'},
         {'rto_code': 'GJ04'}, {'rto_code': 'HR29'}, {'rto_code': 'TR01'}, {'rto_code': 'MZ01'},
         {'rto_code': 'UA01'}, {'rto_code': 'HP19'}, {'rto_code': 'HR37'}, {'rto_code': 'HR85'},
         {'rto_code': 'CG15'}, {'rto_code': 'JK03'}, {'rto_code': 'HP35'}, {'rto_code': 'BR38'},
         {'rto_code': 'HP11'}, {'rto_code': 'HR40'}, {'rto_code': 'MH20'}, {'rto_code': 'HR87'},
         {'rto_code': 'HR13'}, {'rto_code': 'HP53'}, {'rto_code': 'AS28'}, {'rto_code': 'HR29'},
         {'rto_code': 'CG24'}, {'rto_code': 'CG22'}, {'rto_code': 'HP49'}, {'rto_code': 'BR51'},
         {'rto_code': 'JK05'}, {'rto_code': 'AS15'}, {'rto_code': 'HP21'}, {'rto_code': 'BR09'},
         {'rto_code': 'CG25'}, {'rto_code': 'HR77'}, {'rto_code': 'BR22'}, {'rto_code': 'BR45'},
         {'rto_code': 'BR10'}, {'rto_code': 'HP57'}, {'rto_code': 'HR16'}, {'rto_code': 'BR03'},
         {'rto_code': 'KA28'}, {'rto_code': 'HP69'}, {'rto_code': 'HP69'}, {'rto_code': 'AR04'},
         {'rto_code': 'AS19'}, {'rto_code': 'HR54'}, {'rto_code': 'JK04'}, {'rto_code': 'BR44'},
         {'rto_code': 'AS11'}, {'rto_code': 'UP05'}, {'rto_code': 'AR12'}, {'rto_code': 'BR04'},
         {'rto_code': 'HR84'}, {'rto_code': 'AS26'}, {'rto_code': 'CG16'}, {'rto_code': 'HP08'},
         {'rto_code': 'MN02'}, {'rto_code': 'HR25'}, {'rto_code': 'HP47'}, {'rto_code': 'DD03'},
         {'rto_code': 'CG18'}, {'rto_code': 'AR07'}, {'rto_code': 'BR07'}, {'rto_code': 'HP36'},
         {'rto_code': 'BR24'}, {'rto_code': 'JH15'}, {'rto_code': 'CG05'}, {'rto_code': 'HP04'},
         {'rto_code': 'AS22'}, {'rto_code': 'AS17'}, {'rto_code': 'AS06'}, {'rto_code': 'NL07'},
         {'rto_code': 'JK06'}, {'rto_code': 'MP24'}, {'rto_code': 'TN18'}, {'rto_code': 'HR44'},
         {'rto_code': 'HR62'}, {'rto_code': 'HR28'}, {'rto_code': 'HR42'}, {'rto_code': 'JK16'},
         {'rto_code': 'SK01'}, {'rto_code': 'BR02'}, {'rto_code': 'HP23'}, {'rto_code': 'JH11'},
         {'rto_code': 'JH17'}, {'rto_code': 'HR11'}, {'rto_code': 'HP32'}, {'rto_code': 'AS05'},
         {'rto_code': 'BR28'}, {'rto_code': 'AS25'}, {'rto_code': 'AS24'}, {'rto_code': 'BR31'},
         {'rto_code': 'UP91'}, {'rto_code': 'HR21'}, {'rto_code': 'HR70'}, {'rto_code': 'HR52'},
         {'rto_code': 'JH02'}, {'rto_code': 'HR61'}, {'rto_code': 'HR50'}, {'rto_code': 'MN01'},
         {'rto_code': 'HR75'}, {'rto_code': 'AR01'}, {'rto_code': 'HR02'}, {'rto_code': 'CG26'},
         {'rto_code': 'JK02'}, {'rto_code': 'BR46'}, {'rto_code': 'CG11'}, {'rto_code': 'CG14'},
         {'rto_code': 'HP54'}, {'rto_code': 'BR25'}, {'rto_code': 'HR14'}, {'rto_code': 'RJ17'},
         {'rto_code': 'HR56'}, {'rto_code': 'HP29'}, {'rto_code': 'AS03'}, {'rto_code': 'HR08'},
         {'rto_code': 'HR49'}, {'rto_code': 'HP13'}, {'rto_code': 'MN03'}, {'rto_code': 'HP61'},
         {'rto_code': 'CG19'}, {'rto_code': 'PY02'}, {'rto_code': 'HR05'}, {'rto_code': 'HP30'},
         {'rto_code': 'UK18'}, {'rto_code': 'JK08'}, {'rto_code': 'BR39'}, {'rto_code': 'CG09'},
         {'rto_code': 'HP41'}, {'rto_code': 'HR79'}, {'rto_code': 'AR13'}, {'rto_code': 'BR37'},
         {'rto_code': 'JK17'}, {'rto_code': 'JH12'}, {'rto_code': 'NL01'}, {'rto_code': 'AS16'},
         {'rto_code': 'CG27'}, {'rto_code': 'CG12'}, {'rto_code': 'HR43'}, {'rto_code': 'UK15'},
         {'rto_code': 'HP66'}, {'rto_code': 'AS07'}, {'rto_code': 'BR53'}, {'rto_code': 'JH08'},
         {'rto_code': 'HR18'}, {'rto_code': 'BR32'}, {'rto_code': 'CG06'}, {'rto_code': 'PY03'},
         {'rto_code': 'PY03'}, {'rto_code': 'HP58'}, {'rto_code': 'HP65'}, {'rto_code': 'HR15'},
         {'rto_code': 'HR34'}, {'rto_code': 'NL02'}, {'rto_code': 'AS21'}, {'rto_code': 'BR05'},
         {'rto_code': 'CG28'}, {'rto_code': 'BR06'}, {'rto_code': 'HP55'}, {'rto_code': 'AS02'},
         {'rto_code': 'HP18'}, {'rto_code': 'AR02'}, {'rto_code': 'HP12'}, {'rto_code': 'BR21'},
         {'rto_code': 'UP02'}, {'rto_code': 'HR04'}, {'rto_code': 'HR35'}, {'rto_code': 'HR32'},
         {'rto_code': 'BR27'}, {'rto_code': 'HP26'}, {'rto_code': 'HR27'}, {'rto_code': 'HP37'},
         {'rto_code': 'HR73'}, {'rto_code': 'HR68'}, {'rto_code': 'HR67'}, {'rto_code': 'HP17'},
         {'rto_code': 'HP15'}, {'rto_code': 'AR09'}, {'rto_code': 'BR01'}, {'rto_code': 'UP06'},
         {'rto_code': 'PY01'}, {'rto_code': 'JK12'}, {'rto_code': 'AN01'}, {'rto_code': 'BR11'},
         {'rto_code': 'CG11'}, {'rto_code': 'MP23'}, {'rto_code': 'MP33'}, {'rto_code': 'CG08'},
         {'rto_code': 'JK11'}, {'rto_code': 'JK19'}, {'rto_code': 'HP06'}, {'rto_code': 'JK20'},
         {'rto_code': 'HR36'}, {'rto_code': 'UA07'}, {'rto_code': 'HR12'}, {'rto_code': 'BR57'},
         {'rto_code': 'UK17'}, {'rto_code': 'HR33'}, {'rto_code': 'BR19'}, {'rto_code': 'HR60'},
         {'rto_code': 'BR33'}, {'rto_code': 'JK21'}, {'rto_code': 'HP28'}, {'rto_code': 'AR05'},
         {'rto_code': 'HP50'}, {'rto_code': 'MP33'}, {'rto_code': 'JK22'}, {'rto_code': 'AS04'},
         {'rto_code': 'DN09'}, {'rto_code': 'BR30'}, {'rto_code': 'BR29'}, {'rto_code': 'HR17'},
         {'rto_code': 'HP64'}, {'rto_code': 'HR10'}, {'rto_code': 'JK01'}, {'rto_code': 'HP31'},
         {'rto_code': 'BR50'}, {'rto_code': 'CG29'}, {'rto_code': 'AR03'}, {'rto_code': 'AS12'},
         {'rto_code': 'HP09'}, {'rto_code': 'MN04'}, {'rto_code': 'AS23'}, {'rto_code': 'HR48'},
         {'rto_code': 'HR23'}, {'rto_code': 'TR03'}, {'rto_code': 'JK14'}, {'rto_code': 'HR82'},
         {'rto_code': 'BR31'}, {'rto_code': 'PY04'}
         ];*/
        var rtoValues = [
            {'rto_code': 'HR26'}, {'rto_code': 'HR55'}, {'rto_code': 'HR72'}, {'rto_code': 'HR38'},
            {'rto_code': 'HR51'}, {'rto_code': 'UP14'}, {'rto_code': 'UP16'}, {'rto_code': 'PB08'},
            {'rto_code': 'TN58'}, {'rto_code': 'TN59'}, {'rto_code': 'TN64'}, {'rto_code': 'TN86'},
            {'rto_code': 'TN33'}, {'rto_code': 'TN45'}, {'rto_code': 'TN48'}, {'rto_code': 'TN81'},
            {'rto_code': 'GJ04'}, {'rto_code': 'HR29'}, {'rto_code': 'WB66'}
        ];
        var index = rtoValues.findIndex(x => x.rto_code === this.lm_request['registration_no_1'] + this.lm_request['registration_no_2']);
        if (index === -1) {
            return false;
        } else {
            return true;
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'getDeclinedRTO2', ex);
    }
    console.log('KotakMotor getDeclinedRTO2', 'End');
};
KotakMotor.prototype.getDeclinedMake = function (make) {
    console.log('KotakMotor getDeclinedMake', 'start');
    try {
        var rtoValues = [
            {"makeName": "Chevrolet"},
            {"makeName": "Daewoo"},
            {"makeName": "Mitsubishi"},
            {"makeName": "Audi"},
            {"makeName": "BMW"}
        ];
        var index = rtoValues.findIndex(x => x.makeName === make);
        if (index === -1) {
            return false;
        } else {
            return true;
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'getDeclinedMake', ex);
    }
    console.log('KotakMotor getDeclinedMake', 'End');
};
KotakMotor.prototype.getDeclinedMakeRTO = function (make) {
    console.log('KotakMotor getDeclinedMakeRTO', 'start');
    try {
        var rtoValues = [
            {"makeName": "FORCE", "rto_code": "JK"},
            {"makeName": "FORCE", "rto_code": "PB"},
            {"makeName": "FORCE", "rto_code": "CH"},
            {"makeName": "FORCE", "rto_code": "HP"},
            {"makeName": "FORCE", "rto_code": "HR"},
            {"makeName": "FORCE", "rto_code": "UA"},
            {"makeName": "FORCE", "rto_code": "UK"},
            {"makeName": "FORCE", "rto_code": "UP"},
            {"makeName": "FORCE", "rto_code": "DL"},
            {"makeName": "FORCE", "rto_code": "RJ"},
            {"makeName": "ISUZU", "rto_code": "JK"},
            {"makeName": "ISUZU", "rto_code": "PB"},
            {"makeName": "ISUZU", "rto_code": "CH"},
            {"makeName": "ISUZU", "rto_code": "HP"},
            {"makeName": "ISUZU", "rto_code": "HR"},
            {"makeName": "ISUZU", "rto_code": "UA"},
            {"makeName": "ISUZU", "rto_code": "UK"},
            {"makeName": "ISUZU", "rto_code": "UP"},
            {"makeName": "ISUZU", "rto_code": "DL"},
            {"makeName": "ISUZU", "rto_code": "RJ"}
        ];
        var index = rtoValues.findIndex(x => x.makeName === make && x.rto_code === this.lm_request['registration_no_1']);
        if (index === -1) {
            return false;
        } else {
            return true;
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'getDeclinedMakeRTO', ex);
    }
    console.log('KotakMotor getDeclinedMakeRTO', 'End');
};
KotakMotor.prototype.insurer_vehicle_age_year = function () {
    var combined_data = '';
    try {
        var moment = require('moment');
        var vehicle_reg_date = moment(this.lm_request['vehicle_registration_date']);
        var policy_start_date = moment(this.policy_start_date());
        var diffDuration = moment.duration(policy_start_date.diff(vehicle_reg_date));
        var age_in_year = diffDuration.years();
        var age_in_month = diffDuration.months();
        var age_in_day = diffDuration.days();
        combined_data = age_in_day + "-" + age_in_month + "-" + age_in_year;
        console.log("kotak combined_data ::", combined_data);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_vehicle_age_year', ex);
        return combined_data;
    }
    return combined_data;
};
KotakMotor.prototype.getDeclinedMakeModel = function (make, model) {
    console.log('KotakMotor getDeclinedMakeModel', 'start');
    try {
        var rtoValues = [
            {"makeName": "MARUTI", "modelName": "Omni"},
            {"makeName": "MARUTI", "modelName": "Eeco"},
            {"makeName": "MARUTI", "modelName": "Gypsy"},
            //{"makeName": "MARUTI", "modelName": "Vitara Brezza"},
            //{"makeName": "MARUTI", "modelName": "Alto"},
            //{"makeName": "MARUTI", "modelName": "Alto 800"},
            //{"makeName": "MARUTI", "modelName": "Alto K10"},
            {"makeName": "RENAULT", "modelName": "KWID"},
            {"makeName": "PREMIER", "modelName": "RIO"},
            {"makeName": "TATA", "modelName": "All SUMO"},
            {"makeName": "TATA", "modelName": "Spacio"},
            {"makeName": "TATA", "modelName": "Indica"},
            {"makeName": "ICML", "modelName": "Rhino"},
            {"makeName": "TOYOTA", "modelName": "Fortuner"},
            {"makeName": "TOYOTA", "modelName": "QUALIS"}
        ];
        var index = rtoValues.findIndex(x => x.makeName === make && x.modelName === model);
        if (index === -1) {
            return false;
        } else {
            return true;
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'getDeclinedMakeModel', ex);
    }
    console.log('KotakMotor getDeclinedMakeModel', 'End');
};
KotakMotor.prototype.getDeclinedMakeModelRTO = function (make, model) {
    console.log('KotakMotor getDeclinedMakeModelRTO', 'start');
    try {
        var rtoValues = [
            {"makeName": "FORD", "modelName": "Old Endeavour", "rto_code": "JK"},
            {"makeName": "FORD", "modelName": "Old Endeavour", "rto_code": "PB"},
            {"makeName": "FORD", "modelName": "Old Endeavour", "rto_code": "CH"},
            {"makeName": "FORD", "modelName": "Old Endeavour", "rto_code": "HP"},
            {"makeName": "FORD", "modelName": "Old Endeavour", "rto_code": "HR"},
            {"makeName": "FORD", "modelName": "Old Endeavour", "rto_code": "UA"},
            {"makeName": "FORD", "modelName": "Old Endeavour", "rto_code": "UK"},
            {"makeName": "FORD", "modelName": "Old Endeavour", "rto_code": "UP"},
            {"makeName": "FORD", "modelName": "Old Endeavour", "rto_code": "DL"},
            {"makeName": "FORD", "modelName": "Old Endeavour", "rto_code": "RJ"},
            {"makeName": "FORD", "modelName": "Fiesta Classic", "rto_code": "JK"},
            {"makeName": "FORD", "modelName": "Fiesta Classic", "rto_code": "PB"},
            {"makeName": "FORD", "modelName": "Fiesta Classic", "rto_code": "CH"},
            {"makeName": "FORD", "modelName": "Fiesta Classic", "rto_code": "HP"},
            {"makeName": "FORD", "modelName": "Fiesta Classic", "rto_code": "HR"},
            {"makeName": "FORD", "modelName": "Fiesta Classic", "rto_code": "UA"},
            {"makeName": "FORD", "modelName": "Fiesta Classic", "rto_code": "UK"},
            {"makeName": "FORD", "modelName": "Fiesta Classic", "rto_code": "UP"},
            {"makeName": "FORD", "modelName": "Fiesta Classic", "rto_code": "DL"},
            {"makeName": "FORD", "modelName": "Fiesta Classic", "rto_code": "RJ"},
            {"makeName": "FORD", "modelName": "ECO SPORT", "rto_code": "JK"},
            {"makeName": "FORD", "modelName": "ECO SPORT", "rto_code": "PB"},
            {"makeName": "FORD", "modelName": "ECO SPORT", "rto_code": "CH"},
            {"makeName": "FORD", "modelName": "ECO SPORT", "rto_code": "HP"},
            {"makeName": "FORD", "modelName": "ECO SPORT", "rto_code": "HR"},
            {"makeName": "FORD", "modelName": "ECO SPORT", "rto_code": "UA"},
            {"makeName": "FORD", "modelName": "ECO SPORT", "rto_code": "UK"},
            {"makeName": "FORD", "modelName": "ECO SPORT", "rto_code": "UP"},
            {"makeName": "FORD", "modelName": "ECO SPORT", "rto_code": "DL"},
            {"makeName": "FORD", "modelName": "ECO SPORT", "rto_code": "RJ"},
            {"makeName": "FORD", "modelName": "ENDEAVOUR", "rto_code": "JK"},
            {"makeName": "FORD", "modelName": "ENDEAVOUR", "rto_code": "PB"},
            {"makeName": "FORD", "modelName": "ENDEAVOUR", "rto_code": "CH"},
            {"makeName": "FORD", "modelName": "ENDEAVOUR", "rto_code": "HP"},
            {"makeName": "FORD", "modelName": "ENDEAVOUR", "rto_code": "HR"},
            {"makeName": "FORD", "modelName": "ENDEAVOUR", "rto_code": "UA"},
            {"makeName": "FORD", "modelName": "ENDEAVOUR", "rto_code": "UK"},
            {"makeName": "FORD", "modelName": "ENDEAVOUR", "rto_code": "UP"},
            {"makeName": "FORD", "modelName": "ENDEAVOUR", "rto_code": "DL"},
            {"makeName": "FORD", "modelName": "ENDEAVOUR", "rto_code": "RJ"},
            {"makeName": "FORD", "modelName": "NEW ENDEAVOUR", "rto_code": "JK"},
            {"makeName": "FORD", "modelName": "NEW ENDEAVOUR", "rto_code": "PB"},
            {"makeName": "FORD", "modelName": "NEW ENDEAVOUR", "rto_code": "CH"},
            {"makeName": "FORD", "modelName": "NEW ENDEAVOUR", "rto_code": "HP"},
            {"makeName": "FORD", "modelName": "NEW ENDEAVOUR", "rto_code": "HR"},
            {"makeName": "FORD", "modelName": "NEW ENDEAVOUR", "rto_code": "UA"},
            {"makeName": "FORD", "modelName": "NEW ENDEAVOUR", "rto_code": "UK"},
            {"makeName": "FORD", "modelName": "NEW ENDEAVOUR", "rto_code": "UP"},
            {"makeName": "FORD", "modelName": "NEW ENDEAVOUR", "rto_code": "DL"},
            {"makeName": "FORD", "modelName": "NEW ENDEAVOUR", "rto_code": "RJ"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "Old Elantra", "rto_code": "JK"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "Old Elantra", "rto_code": "PB"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "Old Elantra", "rto_code": "CH"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "Old Elantra", "rto_code": "HP"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "Old Elantra", "rto_code": "HR"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "Old Elantra", "rto_code": "UA"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "Old Elantra", "rto_code": "UK"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "Old Elantra", "rto_code": "UP"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "Old Elantra", "rto_code": "DL"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "Old Elantra", "rto_code": "RJ"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "Sonata", "rto_code": "JK"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "Sonata", "rto_code": "PB"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "Sonata", "rto_code": "CH"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "Sonata", "rto_code": "HP"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "Sonata", "rto_code": "HR"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "Sonata", "rto_code": "UA"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "Sonata", "rto_code": "UK"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "Sonata", "rto_code": "UP"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "Sonata", "rto_code": "DL"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "Sonata", "rto_code": "RJ"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "CRETA", "rto_code": "JK"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "CRETA", "rto_code": "PB"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "CRETA", "rto_code": "CH"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "CRETA", "rto_code": "HP"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "CRETA", "rto_code": "HR"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "CRETA", "rto_code": "UA"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "CRETA", "rto_code": "UK"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "CRETA", "rto_code": "UP"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "CRETA", "rto_code": "DL"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "CRETA", "rto_code": "RJ"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "SANTA FE", "rto_code": "JK"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "SANTA FE", "rto_code": "PB"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "SANTA FE", "rto_code": "CH"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "SANTA FE", "rto_code": "HP"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "SANTA FE", "rto_code": "HR"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "SANTA FE", "rto_code": "UA"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "SANTA FE", "rto_code": "UK"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "SANTA FE", "rto_code": "UP"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "SANTA FE", "rto_code": "DL"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "SANTA FE", "rto_code": "RJ"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "TUCSON", "rto_code": "JK"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "TUCSON", "rto_code": "PB"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "TUCSON", "rto_code": "CH"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "TUCSON", "rto_code": "HP"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "TUCSON", "rto_code": "HR"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "TUCSON", "rto_code": "UA"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "TUCSON", "rto_code": "UK"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "TUCSON", "rto_code": "UP"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "TUCSON", "rto_code": "DL"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "TUCSON", "rto_code": "RJ"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "I20", "rto_code": "JK"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "I20", "rto_code": "PB"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "I20", "rto_code": "CH"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "I20", "rto_code": "HP"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "I20", "rto_code": "HR"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "I20", "rto_code": "UA"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "I20", "rto_code": "UK"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "I20", "rto_code": "UP"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "I20", "rto_code": "DL"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "I20", "rto_code": "RJ"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "ELITE I20", "rto_code": "JK"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "ELITE I20", "rto_code": "PB"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "ELITE I20", "rto_code": "CH"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "ELITE I20", "rto_code": "HP"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "ELITE I20", "rto_code": "HR"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "ELITE I20", "rto_code": "UA"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "ELITE I20", "rto_code": "UK"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "ELITE I20", "rto_code": "UP"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "ELITE I20", "rto_code": "DL"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "ELITE I20", "rto_code": "RJ"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "I20 ACTIVE", "rto_code": "JK"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "I20 ACTIVE", "rto_code": "PB"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "I20 ACTIVE", "rto_code": "CH"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "I20 ACTIVE", "rto_code": "HP"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "I20 ACTIVE", "rto_code": "HR"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "I20 ACTIVE", "rto_code": "UA"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "I20 ACTIVE", "rto_code": "UK"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "I20 ACTIVE", "rto_code": "UP"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "I20 ACTIVE", "rto_code": "DL"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "I20 ACTIVE", "rto_code": "RJ"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "I20 SPORTS", "rto_code": "JK"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "I20 SPORTS", "rto_code": "PB"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "I20 SPORTS", "rto_code": "CH"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "I20 SPORTS", "rto_code": "HP"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "I20 SPORTS", "rto_code": "HR"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "I20 SPORTS", "rto_code": "UA"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "I20 SPORTS", "rto_code": "UK"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "I20 SPORTS", "rto_code": "UP"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "I20 SPORTS", "rto_code": "DL"},
            {"makeName": "HYUNDAI MOTORS", "modelName": "I20 SPORTS", "rto_code": "RJ"},
            {"makeName": "MAHINDRA", "modelName": "XUV500", "rto_code": "JK"},
            {"makeName": "MAHINDRA", "modelName": "XUV500", "rto_code": "PB"},
            {"makeName": "MAHINDRA", "modelName": "XUV500", "rto_code": "CH"},
            {"makeName": "MAHINDRA", "modelName": "XUV500", "rto_code": "HP"},
            {"makeName": "MAHINDRA", "modelName": "XUV500", "rto_code": "HR"},
            {"makeName": "MAHINDRA", "modelName": "XUV500", "rto_code": "UA"},
            {"makeName": "MAHINDRA", "modelName": "XUV500", "rto_code": "UK"},
            {"makeName": "MAHINDRA", "modelName": "XUV500", "rto_code": "UP"},
            {"makeName": "MAHINDRA", "modelName": "XUV500", "rto_code": "DL"},
            {"makeName": "MAHINDRA", "modelName": "XUV500", "rto_code": "RJ"},
            {"makeName": "MAHINDRA", "modelName": "THAR", "rto_code": "JK"},
            {"makeName": "MAHINDRA", "modelName": "THAR", "rto_code": "PB"},
            {"makeName": "MAHINDRA", "modelName": "THAR", "rto_code": "CH"},
            {"makeName": "MAHINDRA", "modelName": "THAR", "rto_code": "HP"},
            {"makeName": "MAHINDRA", "modelName": "THAR", "rto_code": "HR"},
            {"makeName": "MAHINDRA", "modelName": "THAR", "rto_code": "UA"},
            {"makeName": "MAHINDRA", "modelName": "THAR", "rto_code": "UK"},
            {"makeName": "MAHINDRA", "modelName": "THAR", "rto_code": "UP"},
            {"makeName": "MAHINDRA", "modelName": "THAR", "rto_code": "DL"},
            {"makeName": "MAHINDRA", "modelName": "THAR", "rto_code": "RJ"},
            {"makeName": "MAHINDRA", "modelName": "SCORPIO", "rto_code": "JK"},
            {"makeName": "MAHINDRA", "modelName": "SCORPIO", "rto_code": "PB"},
            {"makeName": "MAHINDRA", "modelName": "SCORPIO", "rto_code": "CH"},
            {"makeName": "MAHINDRA", "modelName": "SCORPIO", "rto_code": "HP"},
            {"makeName": "MAHINDRA", "modelName": "SCORPIO", "rto_code": "HR"},
            {"makeName": "MAHINDRA", "modelName": "SCORPIO", "rto_code": "UA"},
            {"makeName": "MAHINDRA", "modelName": "SCORPIO", "rto_code": "UK"},
            {"makeName": "MAHINDRA", "modelName": "SCORPIO", "rto_code": "UP"},
            {"makeName": "MAHINDRA", "modelName": "SCORPIO", "rto_code": "DL"},
            {"makeName": "MAHINDRA", "modelName": "SCORPIO", "rto_code": "RJ"},
            {"makeName": "MAHINDRA", "modelName": "XYLO", "rto_code": "JK"},
            {"makeName": "MAHINDRA", "modelName": "XYLO", "rto_code": "PB"},
            {"makeName": "MAHINDRA", "modelName": "XYLO", "rto_code": "CH"},
            {"makeName": "MAHINDRA", "modelName": "XYLO", "rto_code": "HP"},
            {"makeName": "MAHINDRA", "modelName": "XYLO", "rto_code": "HR"},
            {"makeName": "MAHINDRA", "modelName": "XYLO", "rto_code": "UA"},
            {"makeName": "MAHINDRA", "modelName": "XYLO", "rto_code": "UK"},
            {"makeName": "MAHINDRA", "modelName": "XYLO", "rto_code": "UP"},
            {"makeName": "MAHINDRA", "modelName": "XYLO", "rto_code": "DL"},
            {"makeName": "MAHINDRA", "modelName": "XYLO", "rto_code": "RJ"},
            {"makeName": "MAHINDRA", "modelName": "BOLERO", "rto_code": "JK"},
            {"makeName": "MAHINDRA", "modelName": "BOLERO", "rto_code": "PB"},
            {"makeName": "MAHINDRA", "modelName": "BOLERO", "rto_code": "CH"},
            {"makeName": "MAHINDRA", "modelName": "BOLERO", "rto_code": "HP"},
            {"makeName": "MAHINDRA", "modelName": "BOLERO", "rto_code": "HR"},
            {"makeName": "MAHINDRA", "modelName": "BOLERO", "rto_code": "UA"},
            {"makeName": "MAHINDRA", "modelName": "BOLERO", "rto_code": "UK"},
            {"makeName": "MAHINDRA", "modelName": "BOLERO", "rto_code": "UP"},
            {"makeName": "MAHINDRA", "modelName": "BOLERO", "rto_code": "DL"},
            {"makeName": "MAHINDRA", "modelName": "BOLERO", "rto_code": "RJ"},
            {"makeName": "MAHINDRA", "modelName": "QUANTO", "rto_code": "JK"},
            {"makeName": "MAHINDRA", "modelName": "QUANTO", "rto_code": "PB"},
            {"makeName": "MAHINDRA", "modelName": "QUANTO", "rto_code": "CH"},
            {"makeName": "MAHINDRA", "modelName": "QUANTO", "rto_code": "HP"},
            {"makeName": "MAHINDRA", "modelName": "QUANTO", "rto_code": "HR"},
            {"makeName": "MAHINDRA", "modelName": "QUANTO", "rto_code": "UA"},
            {"makeName": "MAHINDRA", "modelName": "QUANTO", "rto_code": "UK"},
            {"makeName": "MAHINDRA", "modelName": "QUANTO", "rto_code": "UP"},
            {"makeName": "MAHINDRA", "modelName": "QUANTO", "rto_code": "DL"},
            {"makeName": "MAHINDRA", "modelName": "QUANTO", "rto_code": "RJ"},
            {"makeName": "MAHINDRA", "modelName": "REXTON", "rto_code": "JK"},
            {"makeName": "MAHINDRA", "modelName": "REXTON", "rto_code": "PB"},
            {"makeName": "MAHINDRA", "modelName": "REXTON", "rto_code": "CH"},
            {"makeName": "MAHINDRA", "modelName": "REXTON", "rto_code": "HP"},
            {"makeName": "MAHINDRA", "modelName": "REXTON", "rto_code": "HR"},
            {"makeName": "MAHINDRA", "modelName": "REXTON", "rto_code": "UA"},
            {"makeName": "MAHINDRA", "modelName": "REXTON", "rto_code": "UK"},
            {"makeName": "MAHINDRA", "modelName": "REXTON", "rto_code": "UP"},
            {"makeName": "MAHINDRA", "modelName": "REXTON", "rto_code": "DL"},
            {"makeName": "MAHINDRA", "modelName": "REXTON", "rto_code": "RJ"},
            {"makeName": "MARUTI", "modelName": "ERTIGA", "rto_code": "JK"},
            {"makeName": "MARUTI", "modelName": "ERTIGA", "rto_code": "PB"},
            {"makeName": "MARUTI", "modelName": "ERTIGA", "rto_code": "CH"},
            {"makeName": "MARUTI", "modelName": "ERTIGA", "rto_code": "HP"},
            {"makeName": "MARUTI", "modelName": "ERTIGA", "rto_code": "HR"},
            {"makeName": "MARUTI", "modelName": "ERTIGA", "rto_code": "UA"},
            {"makeName": "MARUTI", "modelName": "ERTIGA", "rto_code": "UK"},
            {"makeName": "MARUTI", "modelName": "ERTIGA", "rto_code": "UP"},
            {"makeName": "MARUTI", "modelName": "ERTIGA", "rto_code": "DL"},
            {"makeName": "MARUTI", "modelName": "ERTIGA", "rto_code": "RJ"},
            {"makeName": "MARUTI", "modelName": "S CROSS ZETA 1.3", "rto_code": "JK"},
            {"makeName": "MARUTI", "modelName": "S CROSS ZETA 1.3", "rto_code": "PB"},
            {"makeName": "MARUTI", "modelName": "S CROSS ZETA 1.3", "rto_code": "CH"},
            {"makeName": "MARUTI", "modelName": "S CROSS ZETA 1.3", "rto_code": "HP"},
            {"makeName": "MARUTI", "modelName": "S CROSS ZETA 1.3", "rto_code": "HR"},
            {"makeName": "MARUTI", "modelName": "S CROSS ZETA 1.3", "rto_code": "UA"},
            {"makeName": "MARUTI", "modelName": "S CROSS ZETA 1.3", "rto_code": "UK"},
            {"makeName": "MARUTI", "modelName": "S CROSS ZETA 1.3", "rto_code": "UP"},
            {"makeName": "MARUTI", "modelName": "S CROSS ZETA 1.3", "rto_code": "DL"},
            {"makeName": "MARUTI", "modelName": "S CROSS ZETA 1.3", "rto_code": "RJ"},
            {"makeName": "MARUTI", "modelName": "S CROSS ALPHA 1.3", "rto_code": "JK"},
            {"makeName": "MARUTI", "modelName": "S CROSS ALPHA 1.3", "rto_code": "PB"},
            {"makeName": "MARUTI", "modelName": "S CROSS ALPHA 1.3", "rto_code": "CH"},
            {"makeName": "MARUTI", "modelName": "S CROSS ALPHA 1.3", "rto_code": "HP"},
            {"makeName": "MARUTI", "modelName": "S CROSS ALPHA 1.3", "rto_code": "HR"},
            {"makeName": "MARUTI", "modelName": "S CROSS ALPHA 1.3", "rto_code": "UA"},
            {"makeName": "MARUTI", "modelName": "S CROSS ALPHA 1.3", "rto_code": "UK"},
            {"makeName": "MARUTI", "modelName": "S CROSS ALPHA 1.3", "rto_code": "UP"},
            {"makeName": "MARUTI", "modelName": "S CROSS ALPHA 1.3", "rto_code": "DL"},
            {"makeName": "MARUTI", "modelName": "S CROSS ALPHA 1.3", "rto_code": "RJ"},
            {"makeName": "MARUTI", "modelName": "S CROSS ALPHA 1.6", "rto_code": "JK"},
            {"makeName": "MARUTI", "modelName": "S CROSS ALPHA 1.6", "rto_code": "PB"},
            {"makeName": "MARUTI", "modelName": "S CROSS ALPHA 1.6", "rto_code": "CH"},
            {"makeName": "MARUTI", "modelName": "S CROSS ALPHA 1.6", "rto_code": "HP"},
            {"makeName": "MARUTI", "modelName": "S CROSS ALPHA 1.6", "rto_code": "HR"},
            {"makeName": "MARUTI", "modelName": "S CROSS ALPHA 1.6", "rto_code": "UA"},
            {"makeName": "MARUTI", "modelName": "S CROSS ALPHA 1.6", "rto_code": "UK"},
            {"makeName": "MARUTI", "modelName": "S CROSS ALPHA 1.6", "rto_code": "UP"},
            {"makeName": "MARUTI", "modelName": "S CROSS ALPHA 1.6", "rto_code": "DL"},
            {"makeName": "MARUTI", "modelName": "S CROSS ALPHA 1.6", "rto_code": "RJ"},
            {"makeName": "MARUTI", "modelName": "GYPSY KING S CROSS DELTA 1.3", "rto_code": "JK"},
            {"makeName": "MARUTI", "modelName": "GYPSY KING S CROSS DELTA 1.3", "rto_code": "PB"},
            {"makeName": "MARUTI", "modelName": "GYPSY KING S CROSS DELTA 1.3", "rto_code": "CH"},
            {"makeName": "MARUTI", "modelName": "GYPSY KING S CROSS DELTA 1.3", "rto_code": "HP"},
            {"makeName": "MARUTI", "modelName": "GYPSY KING S CROSS DELTA 1.3", "rto_code": "HR"},
            {"makeName": "MARUTI", "modelName": "GYPSY KING S CROSS DELTA 1.3", "rto_code": "UA"},
            {"makeName": "MARUTI", "modelName": "GYPSY KING S CROSS DELTA 1.3", "rto_code": "UK"},
            {"makeName": "MARUTI", "modelName": "GYPSY KING S CROSS DELTA 1.3", "rto_code": "UP"},
            {"makeName": "MARUTI", "modelName": "GYPSY KING S CROSS DELTA 1.3", "rto_code": "DL"},
            {"makeName": "MARUTI", "modelName": "GYPSY KING S CROSS DELTA 1.3", "rto_code": "RJ"},
            {"makeName": "MARUTI", "modelName": "S CROSS SIGMA 1.3", "rto_code": "JK"},
            {"makeName": "MARUTI", "modelName": "S CROSS SIGMA 1.3", "rto_code": "PB"},
            {"makeName": "MARUTI", "modelName": "S CROSS SIGMA 1.3", "rto_code": "CH"},
            {"makeName": "MARUTI", "modelName": "S CROSS SIGMA 1.3", "rto_code": "HP"},
            {"makeName": "MARUTI", "modelName": "S CROSS SIGMA 1.3", "rto_code": "HR"},
            {"makeName": "MARUTI", "modelName": "S CROSS SIGMA 1.3", "rto_code": "UA"},
            {"makeName": "MARUTI", "modelName": "S CROSS SIGMA 1.3", "rto_code": "UK"},
            {"makeName": "MARUTI", "modelName": "S CROSS SIGMA 1.3", "rto_code": "UP"},
            {"makeName": "MARUTI", "modelName": "S CROSS SIGMA 1.3", "rto_code": "DL"},
            {"makeName": "MARUTI", "modelName": "S CROSS SIGMA 1.3", "rto_code": "RJ"},
            {"makeName": "MARUTI", "modelName": "S CROSS ZETA 1.6", "rto_code": "JK"},
            {"makeName": "MARUTI", "modelName": "S CROSS ZETA 1.6", "rto_code": "PB"},
            {"makeName": "MARUTI", "modelName": "S CROSS ZETA 1.6", "rto_code": "CH"},
            {"makeName": "MARUTI", "modelName": "S CROSS ZETA 1.6", "rto_code": "HP"},
            {"makeName": "MARUTI", "modelName": "S CROSS ZETA 1.6", "rto_code": "HR"},
            {"makeName": "MARUTI", "modelName": "S CROSS ZETA 1.6", "rto_code": "UA"},
            {"makeName": "MARUTI", "modelName": "S CROSS ZETA 1.6", "rto_code": "UK"},
            {"makeName": "MARUTI", "modelName": "S CROSS ZETA 1.6", "rto_code": "UP"},
            {"makeName": "MARUTI", "modelName": "S CROSS ZETA 1.6", "rto_code": "DL"},
            {"makeName": "MARUTI", "modelName": "S CROSS ZETA 1.6", "rto_code": "RJ"},
            {"makeName": "MARUTI", "modelName": "S-CROSS", "rto_code": "JK"},
            {"makeName": "MARUTI", "modelName": "S-CROSS", "rto_code": "PB"},
            {"makeName": "MARUTI", "modelName": "S-CROSS", "rto_code": "CH"},
            {"makeName": "MARUTI", "modelName": "S-CROSS", "rto_code": "HP"},
            {"makeName": "MARUTI", "modelName": "S-CROSS", "rto_code": "HR"},
            {"makeName": "MARUTI", "modelName": "S-CROSS", "rto_code": "UA"},
            {"makeName": "MARUTI", "modelName": "S-CROSS", "rto_code": "UK"},
            {"makeName": "MARUTI", "modelName": "S-CROSS", "rto_code": "UP"},
            {"makeName": "MARUTI", "modelName": "S-CROSS", "rto_code": "DL"},
            {"makeName": "MARUTI", "modelName": "S-CROSS", "rto_code": "RJ"},
            {"makeName": "MARUTI", "modelName": "SWIFT", "rto_code": "JK"},
            {"makeName": "MARUTI", "modelName": "SWIFT", "rto_code": "PB"},
            {"makeName": "MARUTI", "modelName": "SWIFT", "rto_code": "CH"},
            {"makeName": "MARUTI", "modelName": "SWIFT", "rto_code": "HP"},
            {"makeName": "MARUTI", "modelName": "SWIFT", "rto_code": "HR"},
            {"makeName": "MARUTI", "modelName": "SWIFT", "rto_code": "UA"},
            {"makeName": "MARUTI", "modelName": "SWIFT", "rto_code": "UK"},
            {"makeName": "MARUTI", "modelName": "SWIFT", "rto_code": "UP"},
            {"makeName": "MARUTI", "modelName": "SWIFT", "rto_code": "DL"},
            {"makeName": "MARUTI", "modelName": "SWIFT", "rto_code": "RJ"},
            {"makeName": "MARUTI", "modelName": "DZIRE", "rto_code": "JK"},
            {"makeName": "MARUTI", "modelName": "DZIRE", "rto_code": "PB"},
            {"makeName": "MARUTI", "modelName": "DZIRE", "rto_code": "CH"},
            {"makeName": "MARUTI", "modelName": "DZIRE", "rto_code": "HP"},
            {"makeName": "MARUTI", "modelName": "DZIRE", "rto_code": "HR"},
            {"makeName": "MARUTI", "modelName": "DZIRE", "rto_code": "UA"},
            {"makeName": "MARUTI", "modelName": "DZIRE", "rto_code": "UK"},
            {"makeName": "MARUTI", "modelName": "DZIRE", "rto_code": "UP"},
            {"makeName": "MARUTI", "modelName": "DZIRE", "rto_code": "DL"},
            {"makeName": "MARUTI", "modelName": "DZIRE", "rto_code": "RJ"},
            {"makeName": "MARUTI", "modelName": "SWIFT DZIRE", "rto_code": "JK"},
            {"makeName": "MARUTI", "modelName": "SWIFT DZIRE", "rto_code": "PB"},
            {"makeName": "MARUTI", "modelName": "SWIFT DZIRE", "rto_code": "CH"},
            {"makeName": "MARUTI", "modelName": "SWIFT DZIRE", "rto_code": "HP"},
            {"makeName": "MARUTI", "modelName": "SWIFT DZIRE", "rto_code": "HR"},
            {"makeName": "MARUTI", "modelName": "SWIFT DZIRE", "rto_code": "UA"},
            {"makeName": "MARUTI", "modelName": "SWIFT DZIRE", "rto_code": "UK"},
            {"makeName": "MARUTI", "modelName": "SWIFT DZIRE", "rto_code": "UP"},
            {"makeName": "MARUTI", "modelName": "SWIFT DZIRE", "rto_code": "DL"},
            {"makeName": "MARUTI", "modelName": "SWIFT DZIRE", "rto_code": "RJ"},
            {"makeName": "MARUTI", "modelName": "VITARA BREZZA", "rto_code": "JK"},
            {"makeName": "MARUTI", "modelName": "VITARA BREZZA", "rto_code": "PB"},
            {"makeName": "MARUTI", "modelName": "VITARA BREZZA", "rto_code": "CH"},
            {"makeName": "MARUTI", "modelName": "VITARA BREZZA", "rto_code": "HP"},
            {"makeName": "MARUTI", "modelName": "VITARA BREZZA", "rto_code": "HR"},
            {"makeName": "MARUTI", "modelName": "VITARA BREZZA", "rto_code": "UA"},
            {"makeName": "MARUTI", "modelName": "VITARA BREZZA", "rto_code": "UK"},
            {"makeName": "MARUTI", "modelName": "VITARA BREZZA", "rto_code": "UP"},
            {"makeName": "MARUTI", "modelName": "VITARA BREZZA", "rto_code": "DL"},
            {"makeName": "MARUTI", "modelName": "VITARA BREZZA", "rto_code": "RJ"},
            {"makeName": "NISSAN", "modelName": "TERRANO", "rto_code": "JK"},
            {"makeName": "NISSAN", "modelName": "TERRANO", "rto_code": "PB"},
            {"makeName": "NISSAN", "modelName": "TERRANO", "rto_code": "CH"},
            {"makeName": "NISSAN", "modelName": "TERRANO", "rto_code": "HP"},
            {"makeName": "NISSAN", "modelName": "TERRANO", "rto_code": "HR"},
            {"makeName": "NISSAN", "modelName": "TERRANO", "rto_code": "UA"},
            {"makeName": "NISSAN", "modelName": "TERRANO", "rto_code": "UK"},
            {"makeName": "NISSAN", "modelName": "TERRANO", "rto_code": "UP"},
            {"makeName": "NISSAN", "modelName": "TERRANO", "rto_code": "DL"},
            {"makeName": "NISSAN", "modelName": "TERRANO", "rto_code": "RJ"},
            {"makeName": "NISSAN", "modelName": "Evalia", "rto_code": "JK"},
            {"makeName": "NISSAN", "modelName": "Evalia", "rto_code": "PB"},
            {"makeName": "NISSAN", "modelName": "Evalia", "rto_code": "CH"},
            {"makeName": "NISSAN", "modelName": "Evalia", "rto_code": "HP"},
            {"makeName": "NISSAN", "modelName": "Evalia", "rto_code": "HR"},
            {"makeName": "NISSAN", "modelName": "Evalia", "rto_code": "UA"},
            {"makeName": "NISSAN", "modelName": "Evalia", "rto_code": "UK"},
            {"makeName": "NISSAN", "modelName": "Evalia", "rto_code": "UP"},
            {"makeName": "NISSAN", "modelName": "Evalia", "rto_code": "DL"},
            {"makeName": "NISSAN", "modelName": "Evalia", "rto_code": "RJ"},
            {"makeName": "RENAULT", "modelName": "DUSTER", "rto_code": "JK"},
            {"makeName": "RENAULT", "modelName": "DUSTER", "rto_code": "PB"},
            {"makeName": "RENAULT", "modelName": "DUSTER", "rto_code": "CH"},
            {"makeName": "RENAULT", "modelName": "DUSTER", "rto_code": "HP"},
            {"makeName": "RENAULT", "modelName": "DUSTER", "rto_code": "HR"},
            {"makeName": "RENAULT", "modelName": "DUSTER", "rto_code": "UA"},
            {"makeName": "RENAULT", "modelName": "DUSTER", "rto_code": "UK"},
            {"makeName": "RENAULT", "modelName": "DUSTER", "rto_code": "UP"},
            {"makeName": "RENAULT", "modelName": "DUSTER", "rto_code": "DL"},
            {"makeName": "RENAULT", "modelName": "DUSTER", "rto_code": "RJ"},
            {"makeName": "RENAULT", "modelName": "CAPTUR", "rto_code": "JK"},
            {"makeName": "RENAULT", "modelName": "CAPTUR", "rto_code": "PB"},
            {"makeName": "RENAULT", "modelName": "CAPTUR", "rto_code": "CH"},
            {"makeName": "RENAULT", "modelName": "CAPTUR", "rto_code": "HP"},
            {"makeName": "RENAULT", "modelName": "CAPTUR", "rto_code": "HR"},
            {"makeName": "RENAULT", "modelName": "CAPTUR", "rto_code": "UA"},
            {"makeName": "RENAULT", "modelName": "CAPTUR", "rto_code": "UK"},
            {"makeName": "RENAULT", "modelName": "CAPTUR", "rto_code": "UP"},
            {"makeName": "RENAULT", "modelName": "CAPTUR", "rto_code": "DL"},
            {"makeName": "RENAULT", "modelName": "CAPTUR", "rto_code": "RJ"},
            {"makeName": "RENAULT", "modelName": "Lodgy", "rto_code": "JK"},
            {"makeName": "RENAULT", "modelName": "Lodgy", "rto_code": "PB"},
            {"makeName": "RENAULT", "modelName": "Lodgy", "rto_code": "CH"},
            {"makeName": "RENAULT", "modelName": "Lodgy", "rto_code": "HP"},
            {"makeName": "RENAULT", "modelName": "Lodgy", "rto_code": "HR"},
            {"makeName": "RENAULT", "modelName": "Lodgy", "rto_code": "UA"},
            {"makeName": "RENAULT", "modelName": "Lodgy", "rto_code": "UK"},
            {"makeName": "RENAULT", "modelName": "Lodgy", "rto_code": "UP"},
            {"makeName": "RENAULT", "modelName": "Lodgy", "rto_code": "DL"},
            {"makeName": "RENAULT", "modelName": "Lodgy", "rto_code": "RJ"},
            {"makeName": "HONDA", "modelName": "BR-V", "rto_code": "JK"},
            {"makeName": "HONDA", "modelName": "BR-V", "rto_code": "PB"},
            {"makeName": "HONDA", "modelName": "BR-V", "rto_code": "CH"},
            {"makeName": "HONDA", "modelName": "BR-V", "rto_code": "HP"},
            {"makeName": "HONDA", "modelName": "BR-V", "rto_code": "HR"},
            {"makeName": "HONDA", "modelName": "BR-V", "rto_code": "UA"},
            {"makeName": "HONDA", "modelName": "BR-V", "rto_code": "UK"},
            {"makeName": "HONDA", "modelName": "BR-V", "rto_code": "UP"},
            {"makeName": "HONDA", "modelName": "BR-V", "rto_code": "DL"},
            {"makeName": "HONDA", "modelName": "BR-V", "rto_code": "RJ"},
            {"makeName": "HONDA", "modelName": "WR-V", "rto_code": "JK"},
            {"makeName": "HONDA", "modelName": "WR-V", "rto_code": "PB"},
            {"makeName": "HONDA", "modelName": "WR-V", "rto_code": "CH"},
            {"makeName": "HONDA", "modelName": "WR-V", "rto_code": "HP"},
            {"makeName": "HONDA", "modelName": "WR-V", "rto_code": "HR"},
            {"makeName": "HONDA", "modelName": "WR-V", "rto_code": "UA"},
            {"makeName": "HONDA", "modelName": "WR-V", "rto_code": "UK"},
            {"makeName": "HONDA", "modelName": "WR-V", "rto_code": "UP"},
            {"makeName": "HONDA", "modelName": "WR-V", "rto_code": "DL"},
            {"makeName": "HONDA", "modelName": "WR-V", "rto_code": "RJ"},
            {"makeName": "TATA", "modelName": "Old Safari", "rto_code": "JK"},
            {"makeName": "TATA", "modelName": "Old Safari", "rto_code": "PB"},
            {"makeName": "TATA", "modelName": "Old Safari", "rto_code": "CH"},
            {"makeName": "TATA", "modelName": "Old Safari", "rto_code": "HP"},
            {"makeName": "TATA", "modelName": "Old Safari", "rto_code": "HR"},
            {"makeName": "TATA", "modelName": "Old Safari", "rto_code": "UA"},
            {"makeName": "TATA", "modelName": "Old Safari", "rto_code": "UK"},
            {"makeName": "TATA", "modelName": "Old Safari", "rto_code": "UP"},
            {"makeName": "TATA", "modelName": "Old Safari", "rto_code": "DL"},
            {"makeName": "TATA", "modelName": "Old Safari", "rto_code": "RJ"},
            {"makeName": "TATA", "modelName": "Safari Dicor", "rto_code": "JK"},
            {"makeName": "TATA", "modelName": "Safari Dicor", "rto_code": "PB"},
            {"makeName": "TATA", "modelName": "Safari Dicor", "rto_code": "CH"},
            {"makeName": "TATA", "modelName": "Safari Dicor", "rto_code": "HP"},
            {"makeName": "TATA", "modelName": "Safari Dicor", "rto_code": "HR"},
            {"makeName": "TATA", "modelName": "Safari Dicor", "rto_code": "UA"},
            {"makeName": "TATA", "modelName": "Safari Dicor", "rto_code": "UK"},
            {"makeName": "TATA", "modelName": "Safari Dicor", "rto_code": "UP"},
            {"makeName": "TATA", "modelName": "Safari Dicor", "rto_code": "DL"},
            {"makeName": "TATA", "modelName": "Safari Dicor", "rto_code": "RJ"},
            {"makeName": "TATA", "modelName": "Safari Storm", "rto_code": "JK"},
            {"makeName": "TATA", "modelName": "Safari Storm", "rto_code": "PB"},
            {"makeName": "TATA", "modelName": "Safari Storm", "rto_code": "CH"},
            {"makeName": "TATA", "modelName": "Safari Storm", "rto_code": "HP"},
            {"makeName": "TATA", "modelName": "Safari Storm", "rto_code": "HR"},
            {"makeName": "TATA", "modelName": "Safari Storm", "rto_code": "UA"},
            {"makeName": "TATA", "modelName": "Safari Storm", "rto_code": "UK"},
            {"makeName": "TATA", "modelName": "Safari Storm", "rto_code": "UP"},
            {"makeName": "TATA", "modelName": "Safari Storm", "rto_code": "DL"},
            {"makeName": "TATA", "modelName": "Safari Storm", "rto_code": "RJ"},
            {"makeName": "TATA", "modelName": "Aria", "rto_code": "JK"},
            {"makeName": "TATA", "modelName": "Aria", "rto_code": "PB"},
            {"makeName": "TATA", "modelName": "Aria", "rto_code": "CH"},
            {"makeName": "TATA", "modelName": "Aria", "rto_code": "HP"},
            {"makeName": "TATA", "modelName": "Aria", "rto_code": "HR"},
            {"makeName": "TATA", "modelName": "Aria", "rto_code": "UA"},
            {"makeName": "TATA", "modelName": "Aria", "rto_code": "UK"},
            {"makeName": "TATA", "modelName": "Aria", "rto_code": "UP"},
            {"makeName": "TATA", "modelName": "Aria", "rto_code": "DL"},
            {"makeName": "TATA", "modelName": "Aria", "rto_code": "RJ"},
            {"makeName": "TATA", "modelName": "Movus", "rto_code": "JK"},
            {"makeName": "TATA", "modelName": "Movus", "rto_code": "PB"},
            {"makeName": "TATA", "modelName": "Movus", "rto_code": "CH"},
            {"makeName": "TATA", "modelName": "Movus", "rto_code": "HP"},
            {"makeName": "TATA", "modelName": "Movus", "rto_code": "HR"},
            {"makeName": "TATA", "modelName": "Movus", "rto_code": "UA"},
            {"makeName": "TATA", "modelName": "Movus", "rto_code": "UK"},
            {"makeName": "TATA", "modelName": "Movus", "rto_code": "UP"},
            {"makeName": "TATA", "modelName": "Movus", "rto_code": "DL"},
            {"makeName": "TATA", "modelName": "Movus", "rto_code": "RJ"},
            {"makeName": "TATA", "modelName": "Ventura", "rto_code": "JK"},
            {"makeName": "TATA", "modelName": "Ventura", "rto_code": "PB"},
            {"makeName": "TATA", "modelName": "Ventura", "rto_code": "CH"},
            {"makeName": "TATA", "modelName": "Ventura", "rto_code": "HP"},
            {"makeName": "TATA", "modelName": "Ventura", "rto_code": "HR"},
            {"makeName": "TATA", "modelName": "Ventura", "rto_code": "UA"},
            {"makeName": "TATA", "modelName": "Ventura", "rto_code": "UK"},
            {"makeName": "TATA", "modelName": "Ventura", "rto_code": "UP"},
            {"makeName": "TATA", "modelName": "Ventura", "rto_code": "DL"},
            {"makeName": "TATA", "modelName": "Ventura", "rto_code": "RJ"},
            {"makeName": "TATA", "modelName": "Indigo", "rto_code": "JK"},
            {"makeName": "TATA", "modelName": "Indigo", "rto_code": "PB"},
            {"makeName": "TATA", "modelName": "Indigo", "rto_code": "CH"},
            {"makeName": "TATA", "modelName": "Indigo", "rto_code": "HP"},
            {"makeName": "TATA", "modelName": "Indigo", "rto_code": "HR"},
            {"makeName": "TATA", "modelName": "Indigo", "rto_code": "UA"},
            {"makeName": "TATA", "modelName": "Indigo", "rto_code": "UK"},
            {"makeName": "TATA", "modelName": "Indigo", "rto_code": "UP"},
            {"makeName": "TATA", "modelName": "Indigo", "rto_code": "DL"},
            {"makeName": "TATA", "modelName": "Indigo", "rto_code": "RJ"},
            {"makeName": "TATA", "modelName": "Hexa", "rto_code": "JK"},
            {"makeName": "TATA", "modelName": "Hexa", "rto_code": "PB"},
            {"makeName": "TATA", "modelName": "Hexa", "rto_code": "CH"},
            {"makeName": "TATA", "modelName": "Hexa", "rto_code": "HP"},
            {"makeName": "TATA", "modelName": "Hexa", "rto_code": "HR"},
            {"makeName": "TATA", "modelName": "Hexa", "rto_code": "UA"},
            {"makeName": "TATA", "modelName": "Hexa", "rto_code": "UK"},
            {"makeName": "TATA", "modelName": "Hexa", "rto_code": "UP"},
            {"makeName": "TATA", "modelName": "Hexa", "rto_code": "DL"},
            {"makeName": "TATA", "modelName": "Hexa", "rto_code": "RJ"},
            {"makeName": "TATA", "modelName": "Nexon", "rto_code": "JK"},
            {"makeName": "TATA", "modelName": "Nexon", "rto_code": "PB"},
            {"makeName": "TATA", "modelName": "Nexon", "rto_code": "CH"},
            {"makeName": "TATA", "modelName": "Nexon", "rto_code": "HP"},
            {"makeName": "TATA", "modelName": "Nexon", "rto_code": "HR"},
            {"makeName": "TATA", "modelName": "Nexon", "rto_code": "UA"},
            {"makeName": "TATA", "modelName": "Nexon", "rto_code": "UK"},
            {"makeName": "TATA", "modelName": "Nexon", "rto_code": "UP"},
            {"makeName": "TATA", "modelName": "Nexon", "rto_code": "DL"},
            {"makeName": "TATA", "modelName": "Nexon", "rto_code": "RJ"},
            //{"makeName": "ISUZU", "modelName": "MUX", "rto_code": "JK"},
            //{"makeName": "ISUZU", "modelName": "MUX", "rto_code": "PB"},
            //{"makeName": "ISUZU", "modelName": "MUX", "rto_code": "CH"},
            //{"makeName": "ISUZU", "modelName": "MUX", "rto_code": "HP"},
            //{"makeName": "ISUZU", "modelName": "MUX", "rto_code": "HR"},
            //{"makeName": "ISUZU", "modelName": "MUX", "rto_code": "UA"},
            //{"makeName": "ISUZU", "modelName": "MUX", "rto_code": "UK"},
            //{"makeName": "ISUZU", "modelName": "MUX", "rto_code": "UP"},
            //{"makeName": "ISUZU", "modelName": "MUX", "rto_code": "DL"},
            //{"makeName": "ISUZU", "modelName": "MUX", "rto_code": "RJ"},
            //{"makeName": "ISUZU", "modelName": "MU7", "rto_code": "JK"},
            //{"makeName": "ISUZU", "modelName": "MU7", "rto_code": "PB"},
            //{"makeName": "ISUZU", "modelName": "MU7", "rto_code": "CH"},
            //{"makeName": "ISUZU", "modelName": "MU7", "rto_code": "HP"},
            //{"makeName": "ISUZU", "modelName": "MU7", "rto_code": "HR"},
            //{"makeName": "ISUZU", "modelName": "MU7", "rto_code": "UA"},
            //{"makeName": "ISUZU", "modelName": "MU7", "rto_code": "UK"},
            //{"makeName": "ISUZU", "modelName": "MU7", "rto_code": "UP"},
            //{"makeName": "ISUZU", "modelName": "MU7", "rto_code": "DL"},
            //{"makeName": "ISUZU", "modelName": "MU7", "rto_code": "RJ"},
            {"makeName": "TOYOTA", "modelName": "INNOVA", "rto_code": "JK"},
            {"makeName": "TOYOTA", "modelName": "INNOVA", "rto_code": "PB"},
            {"makeName": "TOYOTA", "modelName": "INNOVA", "rto_code": "CH"},
            {"makeName": "TOYOTA", "modelName": "INNOVA", "rto_code": "HP"},
            {"makeName": "TOYOTA", "modelName": "INNOVA", "rto_code": "HR"},
            {"makeName": "TOYOTA", "modelName": "INNOVA", "rto_code": "UA"},
            {"makeName": "TOYOTA", "modelName": "INNOVA", "rto_code": "UK"},
            {"makeName": "TOYOTA", "modelName": "INNOVA", "rto_code": "UP"},
            {"makeName": "TOYOTA", "modelName": "INNOVA", "rto_code": "DL"},
            {"makeName": "TOYOTA", "modelName": "INNOVA", "rto_code": "RJ"},
            {"makeName": "TOYOTA", "modelName": "INNOVA CRYSTA", "rto_code": "JK"},
            {"makeName": "TOYOTA", "modelName": "INNOVA CRYSTA", "rto_code": "PB"},
            {"makeName": "TOYOTA", "modelName": "INNOVA CRYSTA", "rto_code": "CH"},
            {"makeName": "TOYOTA", "modelName": "INNOVA CRYSTA", "rto_code": "HP"},
            {"makeName": "TOYOTA", "modelName": "INNOVA CRYSTA", "rto_code": "HR"},
            {"makeName": "TOYOTA", "modelName": "INNOVA CRYSTA", "rto_code": "UA"},
            {"makeName": "TOYOTA", "modelName": "INNOVA CRYSTA", "rto_code": "UK"},
            {"makeName": "TOYOTA", "modelName": "INNOVA CRYSTA", "rto_code": "UP"},
            {"makeName": "TOYOTA", "modelName": "INNOVA CRYSTA", "rto_code": "DL"},
            {"makeName": "TOYOTA", "modelName": "INNOVA CRYSTA", "rto_code": "RJ"},
            {"makeName": "TOYOTA", "modelName": "INNOVA LE", "rto_code": "JK"},
            {"makeName": "TOYOTA", "modelName": "INNOVA LE", "rto_code": "PB"},
            {"makeName": "TOYOTA", "modelName": "INNOVA LE", "rto_code": "CH"},
            {"makeName": "TOYOTA", "modelName": "INNOVA LE", "rto_code": "HP"},
            {"makeName": "TOYOTA", "modelName": "INNOVA LE", "rto_code": "HR"},
            {"makeName": "TOYOTA", "modelName": "INNOVA LE", "rto_code": "UA"},
            {"makeName": "TOYOTA", "modelName": "INNOVA LE", "rto_code": "UK"},
            {"makeName": "TOYOTA", "modelName": "INNOVA LE", "rto_code": "UP"},
            {"makeName": "TOYOTA", "modelName": "INNOVA LE", "rto_code": "DL"},
            {"makeName": "TOYOTA", "modelName": "INNOVA LE", "rto_code": "RJ"},
            {"makeName": "Volkswagon", "modelName": "Polo", "rto_code": "JK"},
            {"makeName": "Volkswagon", "modelName": "Polo", "rto_code": "PB"},
            {"makeName": "Volkswagon", "modelName": "Polo", "rto_code": "CH"},
            {"makeName": "Volkswagon", "modelName": "Polo", "rto_code": "HP"},
            {"makeName": "Volkswagon", "modelName": "Polo", "rto_code": "HR"},
            {"makeName": "Volkswagon", "modelName": "Polo", "rto_code": "UA"},
            {"makeName": "Volkswagon", "modelName": "Polo", "rto_code": "UK"},
            {"makeName": "Volkswagon", "modelName": "Polo", "rto_code": "UP"},
            {"makeName": "Volkswagon", "modelName": "Polo", "rto_code": "DL"},
            {"makeName": "Volkswagon", "modelName": "Polo", "rto_code": "RJ"},
            {"makeName": "Volkswagon", "modelName": "Vento (Diesel)", "rto_code": "JK"},
            {"makeName": "Volkswagon", "modelName": "Vento (Diesel)", "rto_code": "PB"},
            {"makeName": "Volkswagon", "modelName": "Vento (Diesel)", "rto_code": "CH"},
            {"makeName": "Volkswagon", "modelName": "Vento (Diesel)", "rto_code": "HP"},
            {"makeName": "Volkswagon", "modelName": "Vento (Diesel)", "rto_code": "HR"},
            {"makeName": "Volkswagon", "modelName": "Vento (Diesel)", "rto_code": "UA"},
            {"makeName": "Volkswagon", "modelName": "Vento (Diesel)", "rto_code": "UK"},
            {"makeName": "Volkswagon", "modelName": "Vento (Diesel)", "rto_code": "UP"},
            {"makeName": "Volkswagon", "modelName": "Vento (Diesel)", "rto_code": "DL"},
            {"makeName": "Volkswagon", "modelName": "Vento (Diesel)", "rto_code": "RJ"}
        ];
        var index = rtoValues.findIndex(x => x.makeName === make && x.modelName === model && x.rto_code === this.lm_request['registration_no_1']);
        if (index === -1) {
            return false;
        } else {
            return true;
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'getDeclinedMakeModelRTO', ex);
    }
    console.log('KotakMotor getDeclinedMakeModelRTO', 'End');
};
module.exports = KotakMotor;
