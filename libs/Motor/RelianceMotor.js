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
Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + parseInt(days));
    return this;
};

function RelianceMotor() {

}
util.inherits(RelianceMotor, Motor);

RelianceMotor.prototype.lm_request_single = {};
RelianceMotor.prototype.insurer_integration = {};
RelianceMotor.prototype.insurer_addon_list = [];
RelianceMotor.prototype.insurer = {};
RelianceMotor.prototype.insurer_date_format = 'dd/MM/yyyy';
RelianceMotor.prototype.insurer_date_format1 = 'yyyy-MM-dd';


RelianceMotor.prototype.insurer_product_api_pre = function (objProduct, Insurer_Object, specific_insurer_object) {
    /*
     * 1	Petrol
     2	Diesel
     3	CNG
     4	LPG
     5	Bifuel
     6	Battery
     0	None
     7	NA
     
     */
//    this.insurer_lm_request['fuel_code'] = 
//    specific_insurer_object['prepared_request'][]

    console.log('insurer_product_api_pre');
};
RelianceMotor.prototype.insurer_product_field_process_pre = function () {
    try {
        let objInsurerProduct = this;
        let is_tp_only = false;
        if (this.prepared_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
            is_tp_only = true;
        } else if (this.prepared_request['vehicle_insurance_subtype'].indexOf('1OD') > -1) {
            is_tp_only = true;
        } else {
            is_tp_only = false;
        }

        if (this.lm_request['product_id'] === 1) {
            var product_code_1 = {"1CH_0TP": "2311", "1OD_0TP": "2309", "0CH_1TP": "2347", "0CH_3TP": "NA", "1CH_2TP": "NA", "3CH_0TP": "NA"};
            this.prepared_request['product_code'] = product_code_1[this.lm_request['vehicle_insurance_subtype']];
            this.processed_request['___product_code___'] = this.prepared_request['product_code'];
        }
        if (this.lm_request['product_id'] === 10) {
            var product_code_10 = {"1CH_0TP": "2312", "1OD_0TP": "2308", "0CH_1TP": "2348", "0CH_5TP": "NA", "1CH_4TP": "NA", "5CH_0TP": "NA", "2CH_0TP": "2369", "3CH_0TP": "2369"};
            this.prepared_request['product_code'] = product_code_10[this.lm_request['vehicle_insurance_subtype']];
            this.processed_request['___product_code___'] = this.prepared_request['product_code'];
        }

        let tmp_method_content = objInsurerProduct.method_content;
        if (this.lm_request['method_type'] === 'Coverage') {
            //console.error("RelianceMotor_Coverage_Pre_Start",tmp_method_content);
        }
        if (is_tp_only) {
            this.prepared_request['vehicle_expected_idv'] = 0;
            this.processed_request['___vehicle_expected_idv___'] = 0;
            //tmp_method_content = tmp_method_content.replace('___product_id___', '___product_id_1___');
            tmp_method_content = tmp_method_content.replace('___is_aai_membership___', 'false');
            tmp_method_content = tmp_method_content.replace('___addon_zero_dep_cover_rate___', 'false');

            if (this.lm_request['is_pa_od'] && this.lm_request['is_pa_od'] === "no") {
                tmp_method_content = tmp_method_content.replace('___pa_owner_driver_si_2___', 'false');
            }

            if (this.prepared_request['dbmaster_insurer_vehicle_fueltype']) {
                if (this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === "PETROL+CNG") {
                    tmp_method_content = tmp_method_content.replace('___external_bifuel_type___', 'CNG');
                    this.prepared_request['external_bifuel_type'] = "CNG";
                    this.processed_request['___external_bifuel_type___'] = this.prepared_request['external_bifuel_type'];
                }
                if (this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === "PETROL+LPG") {
                    tmp_method_content = tmp_method_content.replace('___external_bifuel_type___', 'LPG');
                    this.prepared_request['external_bifuel_type'] = "LPG";
                    this.processed_request['___external_bifuel_type___'] = this.prepared_request['external_bifuel_type'];
                }
            }

            if (is_tp_only && (this.lm_request['product_id'] === 1 || this.lm_request['product_id'] === 10) && this.lm_request['method_type'] === 'Proposal') {
                var inspection_request_data = this.find_text_btw_key(tmp_method_content, '<!--INSPECT_START-->', '<!--INSPECT_FINISH-->', false);
                if (inspection_request_data !== '') {
                    tmp_method_content = tmp_method_content.replace(inspection_request_data, '');
                }
                tmp_method_content = tmp_method_content.replace('<InspectionNo>___insurer_transaction_identifier___</InspectionNo>', '');
                tmp_method_content = tmp_method_content.replace('<InspectionID>___insurer_transaction_identifier___</InspectionID>', '');
                tmp_method_content = tmp_method_content.replace('<InspectionDate>___inspection_date___</InspectionDate>', '');
                tmp_method_content = tmp_method_content.replace('<IsInspectionDone>true</IsInspectionDone>', '');
            }
        }

        if (this.lm_request['vehicle_registration_type'] === 'corporate') {
            tmp_method_content = tmp_method_content.replace('<CPAcovertenure>1</CPAcovertenure>', '<CPAcovertenure/>');
            tmp_method_content = tmp_method_content.replace('___pa_owner_driver_si_2___', 'false');

            if (this.lm_request['method_type'] === 'Proposal') {
                var company_request_data1 = this.find_text_btw_key(tmp_method_content, '<!--NO_NOMINEE_START-->', '<!--NO_NOMINEE_FINISH-->', false);
                tmp_method_content = tmp_method_content.replace(company_request_data1, '');

                var company_request_data = this.find_text_btw_key(tmp_method_content, '<!--IND_START-->', '<!--IND_FINISH-->', false);
                tmp_method_content = tmp_method_content.replace(company_request_data, '');
                this.prepared_request['salutation'] = 'M/S';
                this.processed_request['___salutation___'] = this.prepared_request['salutation'];
                tmp_method_content = tmp_method_content.replace('___first_name___', '');
                tmp_method_content = tmp_method_content.replace('___middle_name___', '');
                tmp_method_content = tmp_method_content.replace('___last_name___', '');
                tmp_method_content = tmp_method_content.replace('___occupation___', '');
                tmp_method_content = tmp_method_content.replace('___gender___', '');
                tmp_method_content = tmp_method_content.replace('___birth_date___', '');
                tmp_method_content = tmp_method_content.replace('___marital___', '');
            }
        } else {
            tmp_method_content = tmp_method_content.replace('___company_name___', '');
        }

        if (this.lm_request['is_breakin'] === 'yes') {
            this.prepared_request['is_motor_quote'] = 'false';
            this.processed_request['___is_motor_quote___'] = this.prepared_request['is_motor_quote'];
        } else {
            this.prepared_request['is_motor_quote'] = 'true';
            this.processed_request['___is_motor_quote___'] = this.prepared_request['is_motor_quote'];
        }
        if (this.lm_request['pa_owner_driver_si'] !== '') {
            tmp_method_content = tmp_method_content.replace('<IsHavingValidDrivingLicense>true</IsHavingValidDrivingLicense>', '<IsHavingValidDrivingLicense></IsHavingValidDrivingLicense>');
            tmp_method_content = tmp_method_content.replace('<IsOptedStandaloneCPAPolicy>true</IsOptedStandaloneCPAPolicy>', '<IsOptedStandaloneCPAPolicy></IsOptedStandaloneCPAPolicy>');
        }

        if ((!is_tp_only) && this.lm_request['product_id'] === 1 && this.lm_request['is_breakin'] === 'yes' && this.lm_request['is_inspection_done'] === 'no' && this.lm_request['method_type'] === 'Proposal') {
            this.method['Method_Request_File'] = "Reliance_Car_Create_Lead.xml";
            if (config.environment.name === 'Production') {
            } else {
                this.method['Service_URL'] = "https://rgiclservices.reliancegeneral.co.in/Inspection_Lead_Production_UAT/Service.asmx?WSDL";
            }
            var method_content = fs.readFileSync(appRoot + '/resource/request_file/' + this.method.Method_Request_File).toString();
            tmp_method_content = method_content;
            tmp_method_content = tmp_method_content.replace('___vehicle_insurance_type___', '4');
        }

        if (this.lm_request['product_id'] === 10 && this.lm_request['is_tppd'] === 'yes') {
            tmp_method_content = tmp_method_content.replace('___is_tppd___', 'true');
            tmp_method_content = tmp_method_content.replace('___tppd_si___', '6000');
        } else {
            tmp_method_content = tmp_method_content.replace('___is_tppd___', 'false');
            tmp_method_content = tmp_method_content.replace('___tppd_si___', '');
        }

        if (this.lm_request['method_type'] === 'Coverage') {
            //console.error("RelianceMotor_Coverage_Pre_Start_1",tmp_method_content);
        }
        if (this.lm_request['vehicle_insurance_subtype'] === '1OD_0TP') {
            /*if (this.lm_request['product_id'] === 1) {
             this.prepared_request['product_id'] = 2309;
             this.processed_request['___product_id___'] = 2309;
             }
             if (this.lm_request['product_id'] === 10) {
             this.prepared_request['product_id'] = 2308;
             this.processed_request['___product_id___'] = 2308;
             }*/
            if (this.lm_request['method_type'] === 'Coverage' || this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Proposal') {
                tmp_method_content = tmp_method_content.replace('<IsBasicLiability>true</IsBasicLiability>', '<IsBasicLiability>false</IsBasicLiability>');
                tmp_method_content = tmp_method_content.replace('___pa_owner_driver_si_2___', 'false');
            }
            if (this.lm_request['method_type'] === 'Proposal') {
                this.prepared_request['tp_policy_number'] = this.lm_request['tp_policy_number'];
                this.processed_request['___tp_policy_number___'] = this.prepared_request['tp_policy_number'];
                this.prepared_request['tp_start_date'] = this.lm_request['tp_start_date'];
                this.processed_request['___tp_start_date___'] = this.prepared_request['tp_start_date'];
                this.prepared_request['tp_end_date'] = this.lm_request['tp_end_date'];
                this.processed_request['___tp_end_date___'] = this.prepared_request['tp_end_date'];
                this.prepared_request['tp_insurer_code'] = this.insurer_master.tp_insurer.insurer_db_master['PreviousInsurer_Code'];
                this.processed_request['___tp_insurer_code___'] = this.prepared_request['tp_insurer_code'];
            }
        } else {
            if (this.lm_request['method_type'] === 'Proposal') {
                var posp_request_data = this.find_text_btw_key(tmp_method_content, '<!--ODONLY_START-->', '<!--ODONLY_FINISH-->', false);
                if (posp_request_data !== '') {
                    tmp_method_content = tmp_method_content.replace(posp_request_data, '');
                }
            }
        }
        if (this.lm_request['method_type'] === 'Coverage') {
            //console.error("RelianceMotor_Coverage_Pre_Start_2",tmp_method_content);
        }
        if (this.lm_request['is_breakin'] === 'yes' && this.lm_request['is_inspection_done'] === 'yes' && this.lm_request['method_type'] === 'Proposal') {
            this.prepared_request['insurer_transaction_identifier'] = this.insurer_lm_request['insurer_transaction_identifier'];
            this.processed_request['___insurer_transaction_identifier___'] = this.prepared_request['insurer_transaction_identifier'];
            var today = new Date();
            today.setHours(0);
            today.setMinutes(0);
            today.setSeconds(0);
            var dd = today.getDate();
            var mm = today.getMonth() + 1;
            var yyyy = today.getFullYear();
            if (dd < 10) {
                dd = '0' + dd;
            }
            if (mm < 10) {
                mm = '0' + mm;
            } else if (mm > 12) {
                mm = '01';
            }
            var inspection_date = dd + '/' + mm + '/' + yyyy;
            this.prepared_request['inspection_date'] = inspection_date;
            this.processed_request['___inspection_date___'] = this.prepared_request['inspection_date'];
        }
        //tmp_method_content = tmp_method_content.replace('___tppd_si___', '');
        if (this.lm_request['is_breakin'] === 'no' && this.lm_request['method_type'] === 'Proposal') {
            var inspection_request_data = this.find_text_btw_key(tmp_method_content, '<!--INSPECT_START-->', '<!--INSPECT_FINISH-->', false);
            if (inspection_request_data !== '') {
                tmp_method_content = tmp_method_content.replace(inspection_request_data, '');
                tmp_method_content = tmp_method_content.replace('<InspectionNo>___insurer_transaction_identifier___</InspectionNo>', '');
                tmp_method_content = tmp_method_content.replace('<InspectionID>___insurer_transaction_identifier___</InspectionID>', '');
                tmp_method_content = tmp_method_content.replace('<InspectionDate>___inspection_date___</InspectionDate>', '');
                tmp_method_content = tmp_method_content.replace('<IsInspectionDone>true</IsInspectionDone>', '');
            }
        }
        if (this.lm_request['product_id'] === '10') {
            tmp_method_content = tmp_method_content.replace('___addon_ncb_protection_cover___', 'false');
            //this.prepared_request['is_antitheft_fit'] = 'false';
            //this.processed_request['___is_antitheft_fit___'] = 'false';
        }
        var vehicle_age = this.vehicle_age_year();
        if (this.processed_request['___vehicle_ncb_current___'] > vehicle_age - 1) {
            this.processed_request['___vehicle_ncb_current___'] = vehicle_age;
        }
        if (vehicle_age <= 5) {
            this.processed_request['___vehicle_ncb_next___'] = parseInt(this.processed_request['___vehicle_ncb_current___']) + 1;
        } else {
            this.processed_request['___vehicle_ncb_next___'] = this.processed_request['___vehicle_ncb_current___'];
        }
        if (vehicle_age > 6 && parseInt(this.lm_request['ss_id']) === 0) {
            tmp_method_content = tmp_method_content.replace('___addon_zero_dep_cover_rate___', '0');
            tmp_method_content = tmp_method_content.replace('___addon_zero_dep_cover___', 'false');
        }
        if (vehicle_age > 10 && parseInt(this.lm_request['ss_id']) > 0) {
            tmp_method_content = tmp_method_content.replace('___addon_zero_dep_cover_rate___', '0');
            tmp_method_content = tmp_method_content.replace('___addon_zero_dep_cover___', 'false');
        }

        if (this.processed_request['___external_bifuel_value___'] - 0 > 0) {
            this.prepared_request['reliance_fuel_code'] = '5';
            this.processed_request['___reliance_fuel_code___'] = this.prepared_request['reliance_fuel_code'];
        }
        if (['PETROL+LPG', 'PETROL+CNG'].indexOf(this.prepared_request['dbmaster_insurer_vehicle_fueltype']) > -1) {
            this.prepared_request['is_external_bifuel'] = 'true';
            this.processed_request['___is_external_bifuel___'] = this.prepared_request['is_external_bifuel'];
            tmp_method_content = tmp_method_content.replace('<ISLpgCng>false</ISLpgCng>', '<ISLpgCng>true</ISLpgCng>');
        }
        if (this.lm_request['method_type'] === 'Coverage') {
            //console.error("RelianceMotor_Coverage_Pre_Start_3",tmp_method_content);
        }

//comment till uat review

        if (this.lm_request['vehicle_insurance_type'] === 'new') {
            this.prepared_request['registration_no'] = 'New';
            this.processed_request['___registration_no___'] = 'New';
        }

        var days_diff = moment(this.todayDate()).diff(this.lm_request['policy_expiry_date'], 'days');
        //for expired case
        //if (days_diff > 90) {
        if ((this.lm_request['breakin_days'] >= 90) && this.lm_request['is_policy_exist'] === 'no' && this.lm_request['is_breakin'] === 'yes') {
            this.prepared_request['vehicle_insurance_type'] = 6;
            this.processed_request['___vehicle_insurance_type___'] = 6;
            tmp_method_content = tmp_method_content.replace('___pre_policy_start_date___', '');
            tmp_method_content = tmp_method_content.replace('___policy_expiry_date___', '');
            if (this.lm_request['method_type'] === 'Proposal' && this.lm_request['vehicle_insurance_type'] === 'renew') {
                tmp_method_content = tmp_method_content.replace('___dbmaster_previousinsurer_code___', '');
                tmp_method_content = tmp_method_content.replace('___previous_policy_number___', '');
                if (this.lm_request['product_id'] === '10') {
                    tmp_method_content = tmp_method_content.replace('___insurer_transaction_identifier___', '');
                    tmp_method_content = tmp_method_content.replace('___inspection_date___', '');
                    tmp_method_content = tmp_method_content.replace('<IsInspectionDone>true</IsInspectionDone>', '<IsInspectionDone></IsInspectionDone>');
                }
            }
        }
        if (this.lm_request['method_type'] === 'Coverage') {
            //console.error("RelianceMotor_Coverage_Pre_Start_4",tmp_method_content);
        }
        //for posp case

        if (tmp_method_content.indexOf('POS_CONFIG_START') > -1) {
            var posp_request_data = this.find_text_btw_key(tmp_method_content, '<!--POS_CONFIG_START-->', '<!--POS_CONFIG_FINISH-->', false);
            if (this.lm_request['is_posp'] === 'yes') {
                tmp_method_content = tmp_method_content.replace('___posp_aadhar___', this.lm_request['posp_aadhar']);
                tmp_method_content = tmp_method_content.replace('___posp_pan_no___', this.lm_request['posp_pan_no']);
            } else {
                tmp_method_content = tmp_method_content.replace(posp_request_data, '');
            }
        }

        if (this.insurer_lm_request['product_id'] === 12) {
            this.prepared_request['policy_start_date'] = this.date_format(this.prepared_request['policy_start_date'], this.insurer_date_format1);
            this.processed_request['___policy_start_date___'] = this.prepared_request['policy_start_date'];

            this.prepared_request['policy_end_date'] = this.date_format(this.prepared_request['policy_end_date'], this.insurer_date_format1);
            this.processed_request['___policy_end_date___'] = this.prepared_request['policy_end_date'];

            if (this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === 'PETROL+LPG') {
                tmp_method_content = tmp_method_content.replace('___bifuel_fuel_type___', 'LPG');
            } else if (this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === 'PETROL+CNG') {
                tmp_method_content = tmp_method_content.replace('___bifuel_fuel_type___', 'CNG');
            } else {
                tmp_method_content = tmp_method_content.replace('___bifuel_fuel_type___', this.prepared_request['dbmaster_insurer_vehicle_fueltype']);
            }
            var towing_grid = {
                'gcv_public_otthw': [5000, 10000, 15000, 20000],
                'gcv_private_otthw': [5000, 10000, 15000, 20000],
                'gcv_public_thwpc': [2000, 3000, 4000, 5000],
                'gcv_private_thwpc': [2000, 3000, 4000, 5000],
                'pcv_fw_lt6pass': [2000, 3000, 4000, 5000],
                'pcv_thw_lt6pass': [2000, 3000, 4000, 5000],
                'pcv_fw_gt6pass': [5000, 10000, 15000, 20000],
                'pcv_thw_between6to17pass': [2000, 3000, 4000, 5000],
                'pcv_tw': [0, 0, 0, 0],
                'msc': [10000, 20000, 30000, 40000]
            };
            tmp_method_content = tmp_method_content.replace('___towing_si___', towing_grid[this.lm_request['vehicle_sub_class']][0]);
        }
        /*if (this.lm_request['product_id'] === 10 && (this.lm_request['vehicle_insurance_subtype'] === '2CH_0TP' || this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP')) {
         this.prepared_request['product_id'] = 2369;
         this.processed_request['___product_id___'] = 2369;
         }*/
        if (this.lm_request['method_type'] === 'Coverage') {
            //console.error("RelianceMotor_Coverage_Pre_Start_5",tmp_method_content);
        }
        if (this.lm_request['method_type'] !== 'Coverage') {
            var nil_dep = this.find_text_btw_key(tmp_method_content, '<!--NIL_DEP_START-->', '<!--NIL_DEP_FINISH-->', false);
            var secure_plus = this.find_text_btw_key(tmp_method_content, '<!--SECURE_PLUS_START-->', '<!--SECURE_PLUS_FINISH-->', false);
            var secure_premium = this.find_text_btw_key(tmp_method_content, '<!--SECURE_PREMIUM_START-->', '<!--SECURE_PREMIUM_FINISH-->', false);
            if (this.lm_request['method_type'] === 'Idv') {
                tmp_method_content = tmp_method_content.replace(nil_dep, '');
                tmp_method_content = tmp_method_content.replace(secure_plus, '');
                tmp_method_content = tmp_method_content.replace(secure_premium, '');

                tmp_method_content = tmp_method_content.replace('___addon_zero_dep_cover_rate___', '0');
                tmp_method_content = tmp_method_content.replace('___package_secureplus_rate___', '0');
                tmp_method_content = tmp_method_content.replace('___package_securepremium_rate___', '0');

            } else {
                let package_name = (this.lm_request['method_type'] === 'Premium') ? this.prepared_request['addon_package_name'] : this.prepared_request['dbmaster_plan_code'];
                console.error('Reliance_Package', package_name);
                if (package_name === 'Secure_Plus') {
                    tmp_method_content = tmp_method_content.replace(secure_premium, '');
                    tmp_method_content = tmp_method_content.replace(nil_dep, '');
                    if ((this.prepared_request['package_secureplus_rate'] - 0) === 0) {
                        tmp_method_content = 'PB_DECLINED';
                    }
                } else if (package_name === 'Secure_Premium') {
                    tmp_method_content = tmp_method_content.replace(secure_plus, '');
                    tmp_method_content = tmp_method_content.replace(nil_dep, '');
                    if ((this.prepared_request['package_securepremium_rate'] - 0) === 0) {
                        tmp_method_content = 'PB_DECLINED';
                    }
                } else {
                    tmp_method_content = tmp_method_content.replace(secure_premium, '');
                    tmp_method_content = tmp_method_content.replace(secure_plus, '');
                    if ((this.prepared_request['addon_zero_dep_cover_rate'] - 0) === 0) {
                        tmp_method_content = tmp_method_content.replace(nil_dep, '');
                    }
                }
            }
        }
        if (this.lm_request['method_type'] === 'Coverage') {
            //console.error("RelianceMotor_Coverage_Pre_Finish",tmp_method_content);
        }
        this.method_content = tmp_method_content;
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_product_field_process_pre', ex);
    }
};
RelianceMotor.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

    var product_id = objProduct.db_specific_product.Product_Id;
    var insurer_id = Insurer_Object.Insurer_ID;

    var error_msg = 'NO_ERROR';
    var obj_response_handler;

    if (specific_insurer_object.method.Method_Type === 'Coverage') {
        obj_response_handler = this.coverage_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Premium') {
        obj_response_handler = this.premium_response_handler(objResponseJson);
    }
    if (specific_insurer_object.method.Method_Type === 'Idv') {
        obj_response_handler = this.idv_response_handler(objResponseJson);
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
RelianceMotor.prototype.insurer_product_field_process_post = function () {

};
RelianceMotor.prototype.insurer_product_api_post = function () {

};
RelianceMotor.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    console.log('service_call');
    try {
        var objInsurerProduct = this;
        var product_id = objProduct.db_specific_product.Product_Id;//
        var insurer_id = Insurer_Object.Insurer_ID;
        var soap = require('soap');
        var xml2js = require('xml2js');

//Example POST method invocation 
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

        /*if (this.lm_request['method_type'] === 'Premium') {
         docLog.Insurer_Request = '<PolicyDetails xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' + docLog.Insurer_Request;
         }
         if (this.lm_request['method_type'] === 'Proposal') {
         docLog.Insurer_Request = '<PolicyDetails xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">' + docLog.Insurer_Request;
         docLog.Insurer_Request = docLog.Insurer_Request.replace('<CoverDetals /', '<CoverDetails />');
         docLog.Insurer_Request = docLog.Insurer_Request.replace('<CoverDetails >', '<CoverDetails />');
         docLog.Insurer_Request = docLog.Insurer_Request.replace('<CoverDetails     <','<CoverDetails /><');
         }*/
        if (this.lm_request['method_type'] === 'Proposal') {
            docLog.Insurer_Request = docLog.Insurer_Request.toString().replace('<PolicyDetails    <CoverDetails />', '<PolicyDetails>    <CoverDetails />');
            docLog.Insurer_Request = docLog.Insurer_Request.toString().replace('<PolicyDetail>', '<PolicyDetails>');
            docLog.Insurer_Request = docLog.Insurer_Request.toString().replace('<PolicyDetails', '<PolicyDetails>');
            docLog.Insurer_Request = docLog.Insurer_Request.toString().replace('<PolicyDetails>>', '<PolicyDetails>');
        }
        if (this.lm_request['method_type'] === 'Coverage') {
            console.error("RelianceMotor_Coverage_Process_Service_Call", docLog.Insurer_Request);
        }
        var args = null;
        var service_method_url = '';
        if ((!is_tp_only) && this.lm_request['product_id'] === 1 && this.lm_request['is_breakin'] === 'yes' && this.lm_request['is_inspection_done'] === 'no' && this.lm_request['method_type'] === 'Proposal')
        {
            args = {
                //data: '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">' + docLog.Insurer_Request,
                data: docLog.Insurer_Request,
                headers: {"Content-Type": "text/xml"}
            };
            specific_insurer_object.method.Method_Calling_Type === 'POST';
            specific_insurer_object.method_file_url = 'http://rgiclservices.reliancegeneral.co.in/Inspection_Lead_Production_UAT/Service.asmx?WSDL';
            specific_insurer_object.method.Method_Action = 'InsertLead';
            if (config.environment.name === 'Production') {
            } else {
                service_method_url = 'https://rgiclservices.reliancegeneral.co.in/Inspection_Lead_Production_UAT/Service.asmx?op=InsertLead';
            }
        } else if ((!is_tp_only) && this.lm_request['product_id'] === 1 && this.lm_request['is_breakin'] === 'yes' && this.lm_request['is_inspection_done'] === 'yes' && this.lm_request['method_type'] === 'Proposal')
        {
            args = {
                data: docLog.Insurer_Request,
                headers: {"Content-Type": "application/xml"}
            };
            specific_insurer_object.method.Method_Calling_Type === 'POST';
            if (config.environment.name === 'Production') {
                specific_insurer_object.method_file_url = 'https://rzonews.reliancegeneral.co.in:91/API/Service/';
            } else {
                specific_insurer_object.method_file_url = 'https://rgipartners.reliancegeneral.co.in/API/Service/';
            }
            specific_insurer_object.method.Method_Action = 'ProposalCreationForMotorPostInspection';
            service_method_url = specific_insurer_object.method_file_url + specific_insurer_object.method.Method_Action;
        } else {
            args = {
                data: docLog.Insurer_Request,
                headers: {"Content-Type": "application/xml"}
            };
            service_method_url = specific_insurer_object.method_file_url + specific_insurer_object.method.Method_Action;
        }

        if (specific_insurer_object.method.Method_Calling_Type === 'POST') {
            client.post(service_method_url, args, function (data, response) {
                // parsed response body as js object 
                console.log(data);
                // raw response 
                //console.log(response);
                var objResponseFull = {
                    'err': null,
                    'result': data,
                    'raw': JSON.stringify(data),
                    'soapHeader': null,
                    'objResponseJson': data
                };
                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
                if (specific_insurer_object.method.Method_Type === 'Idv') {
                    objInsurerProduct.insurer_vehicle_idv_handler(serviceBreakup, objProduct, Insurer_Object, specific_insurer_object);
                }
            });
        } else if (specific_insurer_object.method.Method_Calling_Type === 'GET') {
            function jsonToQueryString(json) {
                return '?' +
                        Object.keys(json).map(function (key) {
                    return encodeURIComponent(key) + '=' +
                            encodeURIComponent(json[key]);
                }).join('&');
            }
            var qs = jsonToQueryString(args.data);
            client.get(service_method_url + qs, function (data, response) {
                // parsed response body as js object 
                console.log(data);
                // raw response 
                //console.log(response);
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
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};

RelianceMotor.prototype.coverage_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Coverage': null
    };

    try {
        var objPremiumService = objResponseJson['ListCovers'];
        var Error_Msg = 'NO_ERR';

        //check error start
        if (objPremiumService.hasOwnProperty('LstAddonCovers')) {
            var coverage_breakup_schema = {
                'addon_zero_dep_cover': 'Nil_Depreciation'
            };
            var coverage_breakup_full = {};
            var coverage_breakup = {};
            for (var key in objPremiumService['LstAddonCovers']['AddonCovers']) {
                var key_change = objPremiumService['LstAddonCovers']['AddonCovers'][key]['CoverageName'];
                key_change = key_change.toString().replace(/ /g, '_');
                coverage_breakup_full[key_change] = objPremiumService['LstAddonCovers']['AddonCovers'][key];
            }
            coverage_breakup = coverage_breakup_full;
            if (coverage_breakup_full.hasOwnProperty('Nil_Depreciation')) {
                coverage_breakup['addon_zero_dep_cover'] = coverage_breakup_full['Nil_Depreciation'];
            }
            objServiceHandler.Coverage = coverage_breakup;
            objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['TraceID'];
        } else {
            Error_Msg = "LM_RELIANCE_COVERAGE_NA";
        }

        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'coverage_response_handler', objServiceHandler);

    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'coverage_response_handler', objServiceHandler);
    }
    return objServiceHandler;

};
RelianceMotor.prototype.idv_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'idv_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };

    try {
        var Error_Msg = 'NO_ERR';
//check error start
        if (objResponseJson.hasOwnProperty('MotorPolicy')) {
            var objPremiumService = objResponseJson['MotorPolicy'];
            if (objPremiumService.hasOwnProperty('ErrorMessages')) {
                if (objPremiumService['ErrorMessages'] === '') {
                } else {
                    Error_Msg = objPremiumService['ErrorMessages'];
                }
            }
        } else {
            Error_Msg = 'LM_MSG:MAIN_NODE_MISSING';
        }
//check error stop

        if (Error_Msg === 'NO_ERR') {
            var Idv_Breakup = this.get_const_idv_breakup();
            if (objPremiumService['IDV']) {
                Idv_Breakup["Idv_Normal"] = Number(objPremiumService['IDV']);
                Idv_Breakup["Idv_Min"] = Number(objPremiumService['MinIDV']);
                Idv_Breakup["Idv_Max"] = Number(objPremiumService['MaxIDV']);
                if (this.insurer_lm_request['product_id'] === 12) {
                    Idv_Breakup["Exshowroom"] = this.prepared_request['dbmaster_insurer_vehicle_exshowroom'];
                } else {
                    Idv_Breakup["Exshowroom"] = 0;
                }
                objServiceHandler.Premium_Breakup = Idv_Breakup;
                objServiceHandler.Insurer_Transaction_Identifier = '';
            } else {
                Error_Msg = 'LM_IDV_NODE_EMPTY';
            }
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'idv_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'idv_response_handler', ex);
    }
    return objServiceHandler;
};
RelianceMotor.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };

    try {
        var Error_Msg = 'NO_ERR';
        //check error start
        if (objResponseJson.hasOwnProperty('MotorPolicy')) {
            var objPremiumService = objResponseJson['MotorPolicy'];
            if (objPremiumService.hasOwnProperty('ErrorMessages')) {
                if (objPremiumService['ErrorMessages'] === '') {
                } else {
                    Error_Msg = objPremiumService['ErrorMessages'];
                }
            }
        } else {
            Error_Msg = 'LM_MSG:MAIN_NODE_MISSING';
        }
//check error stop

        if (Error_Msg === 'NO_ERR') {
            var objLMPremium = {};
            for (var key in objPremiumService) {
                if (typeof objPremiumService[key] !== 'Object' && objPremiumService[key] !== null) {
                    objLMPremium[key] = this.round2Precision(objPremiumService[key] - 0);
                }
            }
            if (this.lm_request['product_id'] === 12) {
                objLMPremium['Geographical_Extension'] = this.round2Precision(0);
            }
            if (objPremiumService['lstPricingResponse'].length > 0) {
                for (var key in objPremiumService['lstPricingResponse']) {
                    var key_change = objPremiumService['lstPricingResponse'][key]['CoverageName'];
                    var val = objPremiumService['lstPricingResponse'][key]['Premium'];
                    key_change = key_change.replace(/ /g, '_');
                    if (key_change === 'Geographical_Extension' && this.lm_request['product_id'] === 12) {
                        objLMPremium['Geographical_Extension'] += this.round2Precision(val - 0);
                    } else {
                        objLMPremium[key_change] = this.round2Precision(val - 0);
                    }
                }
            } else {
                var key_change = objPremiumService['lstPricingResponse']['CoverageName'];
                var val = objPremiumService['lstPricingResponse']['Premium'];
                key_change = key_change.replace(/ /g, '_');
                objLMPremium[key_change] = this.round2Precision(val - 0);
            }
            if (objLMPremium.hasOwnProperty('OD_Discount') && (objLMPremium['OD_Discount'] - 0) !== 0) {
                objLMPremium['OD_Discount'] = objLMPremium['OD_Discount'] - 0;
                objLMPremium['OD_Discount'] = (objLMPremium['OD_Discount'] < 0) ? 0 - objLMPremium['OD_Discount'] : objLMPremium['OD_Discount'];
                objLMPremium["Basic_OD"] = objLMPremium["Basic_OD"] + objLMPremium['OD_Discount'];
            }
            /*if (objLMPremium.hasOwnProperty('NCB') && (objLMPremium['NCB'] - 0) < 0) {
             objLMPremium['NCB'] = 0 - objLMPremium['NCB'];
             objLMPremium["Basic_OD"] = objLMPremium["Basic_OD"] + objLMPremium['NCB'];
             }*/
            if (objLMPremium.hasOwnProperty('InspectionCharges') && (objLMPremium['InspectionCharges'] - 0) > 0) {
                objLMPremium["Basic_OD"] = objLMPremium["Basic_OD"] + objLMPremium['InspectionCharges'];
            }

            var premium_breakup = this.get_const_premium_breakup();

            for (var key in this.premium_breakup_schema) {
                if (typeof this.premium_breakup_schema[key] === 'object') {
                    var group_final = 0, group_final_key = '';
                    for (var sub_key in this.premium_breakup_schema[key]) {
                        var premium_key = this.premium_breakup_schema[key][sub_key];
                        var premium_val = 0;
                        if (premium_key && objLMPremium.hasOwnProperty(premium_key)) {
                            premium_val = objLMPremium[premium_key];
                        }
                        premium_val = isNaN(premium_val) ? 0 : premium_val;
                        premium_val = (premium_val < 0) ? 0 - premium_val : premium_val;
                        premium_breakup[key][sub_key] = premium_val;
                        if (sub_key.indexOf('final_') > -1) {
                            group_final_key = sub_key;
                        } else if (sub_key.indexOf('_disc') > -1) {
                            group_final -= premium_val;
                        } else if (sub_key.indexOf('_tppd') > -1) {
                            group_final -= Math.round(premium_val);
                        } else {
                            group_final += premium_val;
                        }
                    }
                    premium_breakup[key][group_final_key] = group_final;

                } else {
                    var premium_key = this.premium_breakup_schema[key];
                    var premium_val = 0;
                    if (premium_key && objLMPremium.hasOwnProperty(premium_key)) {
                        premium_val = objLMPremium[premium_key];
                    }
                    premium_val = isNaN(premium_val) ? 0 : premium_val;
                    premium_breakup[key] = premium_val;
                }
            }

            console.error('DBG', 'RELBUNDLE', 'addon_package_name', this.prepared_request['addon_package_name'], premium_breakup['addon']['addon_zero_dep_cover']);
            if (objLMPremium.hasOwnProperty('Secure_Plus')) {
                //Nil Depreciation, Consumables Cover, and Engine Cover
                let addon_premium_single = Math.round(objLMPremium['Secure_Plus'] / 3);
                premium_breakup['addon']['addon_zero_dep_cover'] = addon_premium_single;
                premium_breakup['addon']['addon_consumable_cover'] = addon_premium_single;
                premium_breakup['addon']['addon_engine_protector_cover'] = addon_premium_single;
                premium_breakup['addon']['addon_final_premium'] = objLMPremium['Secure_Plus'];
            } else if (objLMPremium.hasOwnProperty('Secure_Premium')) {
                //Nil Depreciation, Consumables, Engine Cover, and Key Protect Cover
                let addon_premium_single = Math.round(objLMPremium['Secure_Premium'] / 4);
                premium_breakup['addon']['addon_zero_dep_cover'] = addon_premium_single;
                premium_breakup['addon']['addon_consumable_cover'] = addon_premium_single;
                premium_breakup['addon']['addon_engine_protector_cover'] = addon_premium_single;
                premium_breakup['addon']['addon_key_lock_cover'] = addon_premium_single;
                premium_breakup['addon']['addon_final_premium'] = objLMPremium['Secure_Premium'];
            }

            if (!(this.prepared_request['vehicle_insurance_subtype'].indexOf('0CH') > -1)) {
                if (premium_breakup['own_damage']['od_final_premium'] < 100) {
                    let od_diff = 100 - premium_breakup['own_damage']['od_final_premium'];
                    premium_breakup['own_damage']['od_basic'] += od_diff;
                    premium_breakup['own_damage']['od_final_premium'] = 100;
                }
            }
            var objTax = objPremiumService['LstTaxComponentDetails']['TaxComponent'];
            premium_breakup['service_tax'] = 0;
            for (let t in objTax) {
                premium_breakup['service_tax'] += (objTax[t]['Amount'] - 0);
            }
            objServiceHandler.Premium_Breakup = premium_breakup;
            objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['TraceID'];
        }

        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        Error_Msg = JSON.stringify(Err);
        objServiceHandler.Error_Msg = Error_Msg;
        console.error('Exception', this.constructor.name, 'premium_response_handler', ex.stack);
    }
    return objServiceHandler;
};
RelianceMotor.prototype.insurer_vehicle_idv_2 = function (objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback) {
    console.log('Start', this.constructor.name, 'insurer_vehicle_idv');
    try {
        var Insurer_Id = specific_insurer_object['insurer_id'];
        var Master_Db_List = objProduct.insurer_master_object['insurer_id_' + Insurer_Id]['master_db_list'];
        var Insurer_Vehicle_ExShowRoom = Master_Db_List['vehicles']['insurer_db_master']['Insurer_Vehicle_ExShowRoom'];
        var Vehicle_Depreciation_Range = {
            'Age_0': '5',
            'Age_1': '15',
            'Age_2': '20',
            'Age_3': '30',
            'Age_4': '40',
            'Age_5': '50',
            'Age_6': '55',
            'Age_7': '59',
            'Age_8': '64',
            'Age_9': '67',
            'Age_10': '70'
        };
        var Idv = 0;
        if (Insurer_Vehicle_ExShowRoom !== '') {
            var Vehicle_Age_Year = this.vehicle_age_year();
            if (Vehicle_Age_Year < 1) {
                Vehicle_Age_Year = 1;
            } else if (Vehicle_Age_Year > 11) {
                Vehicle_Age_Year = 10;
            }

            var Applied_Year = Vehicle_Age_Year - 1;
            Idv = Insurer_Vehicle_ExShowRoom - Math.round(Insurer_Vehicle_ExShowRoom * parseInt(Vehicle_Depreciation_Range['Age_' + Applied_Year]) / 100);
        }
        var Db_Idv_Calculated = {
            "Idv_Normal": Idv,
            "Idv_Min": Math.round(Idv * 0.9),
            "Idv_Max": Math.round(Idv * 1.10),
            "Exshowroom": Insurer_Vehicle_ExShowRoom
        };
        this.insurer_vehicle_idv_handler(Db_Idv_Calculated, objProduct, Insurer_Object, specific_insurer_object);
        console.log('Finish', this.constructor.name, 'insurer_vehicle_idv', Db_Idv_Calculated);
        return Db_Idv_Calculated;
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_vehicle_idv_2', ex);
        return Db_Idv_Calculated;
    }
};
RelianceMotor.prototype.insurer_vehicle_idv = function (objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback) {
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
        method_content = method_content.replace('___vehicle_expected_idv___', '0');
        method_content = method_content.replace('___addon_zero_dep_cover_rate___', '0');
        method_content = method_content.replace('___addon_zero_dep_cover___', 'false');
        method_content = method_content.replace('___addon_ncb_protection_cover___', 'false');

        var nil_dep = this.find_text_btw_key(method_content, '<!--NIL_DEP_START-->', '<!--NIL_DEP_FINISH-->', false);
        var secure_plus = this.find_text_btw_key(method_content, '<!--SECURE_PLUS_START-->', '<!--SECURE_PLUS_FINISH-->', false);
        var secure_premium = this.find_text_btw_key(method_content, '<!--SECURE_PREMIUM_START-->', '<!--SECURE_PREMIUM_FINISH-->', false);
        method_content = method_content.replace(nil_dep, '');
        method_content = method_content.replace(secure_plus, '');
        method_content = method_content.replace(secure_premium, '');

        method_content = method_content.replace('___addon_zero_dep_cover_rate___', '0');
        method_content = method_content.replace('___package_secureplus_rate___', '0');
        method_content = method_content.replace('___package_securepremium_rate___', '0');



        this.method_content = method_content;
        this.method = IdvMethod;
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
RelianceMotor.prototype.insurer_vehicle_coverage = function (objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback) {
    console.log('Start', this.constructor.name, 'insurer_vehicle_idv');
    try {
        var objInsurerProduct = this;
        var Insurer_Id = specific_insurer_object['insurer_id'];

        var CoverageMethod = this.ArrayFindByKey(Insurer_Object.Method_List, 'Method_Type', 'Coverage');
        specific_insurer_object.method = CoverageMethod;
        if (fs.existsSync(appRoot + '/resource/wsdl/' + specific_insurer_object.method.Service_File)) {
            specific_insurer_object['method_file_url'] = appRoot + '/resource/wsdl/' + specific_insurer_object.method.Service_File;
        } else {
            specific_insurer_object['method_file_url'] = specific_insurer_object.method.Service_URL;
        }
        var method_content = fs.readFileSync(appRoot + '/resource/request_file/' + CoverageMethod.Method_Request_File).toString();
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
            "Method_Type": "Coverage",
            "Call_Execution_Time": 0
        };
        this.save_log(docLog);
        console.log('ServiceData');
        console.log(docLog.Insurer_Request);
        this.service_call(docLog, objProduct, Insurer_Object, specific_insurer_object);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_vehicle_coverage', ex);
    }
};
RelianceMotor.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    try {
        if (this.lm_request['product_id'] === 12 && objResponseJson.hasOwnProperty('Error'))
        {
            Error_Msg = objResponseJson['Error']['Message'];
        }
        if (this.lm_request['product_id'] === 1 && this.lm_request['vehicle_insurance_type'] === 'renew' && this.lm_request['is_breakin'] === 'yes' && this.lm_request['is_inspection_done'] === 'no' && (this.prepared_request['Plan_Name'] !== 'TP'))
        {
            //if (objResponseJson['soap:Envelope']['soap:Body']['InsertLeadResponse'].hasOwnProperty('InsertLeadResult')) {
            if (objResponseJson['soap:Envelope']['soap:Body'].hasOwnProperty('InsertLeadResponse')) {
                var objPremiumService = objResponseJson['soap:Envelope']['soap:Body']['InsertLeadResponse'];
                if (!(objPremiumService['InsertLeadResult'] === '')) {
                    if (Number(objPremiumService['InsertLeadResult'])) {

                    } else {
                        Error_Msg = objPremiumService['InsertLeadResult'];
                    }
                } else {
                    Error_Msg = objPremiumService;
                }
            } else {
                Error_Msg = objPremiumService;
            }
        } else {
            if (objResponseJson.hasOwnProperty('MotorPolicy')) {
                var objPremiumService = objResponseJson['MotorPolicy'];
                if (!(objPremiumService['ErrorMessages'] === '')) {
                    Error_Msg = objPremiumService['ErrorMessages'];
                }
            } else if (this.lm_request['product_id'] === 12 && objResponseJson.hasOwnProperty('Error'))
            {
                Error_Msg = objResponseJson['Error']['Message'];
            } else {
                Error_Msg = objPremiumService;
            }
        }

        if (Error_Msg === 'NO_ERR') {
            if (this.lm_request['product_id'] === 1 && this.lm_request['vehicle_insurance_type'] === 'renew' && this.lm_request['is_breakin'] === 'yes' && this.lm_request['is_inspection_done'] === 'no' && (this.prepared_request['Plan_Name'] !== 'TP'))
            {
                var objInsurerProduct = this;
               var pg_data = {
                    'ProposalNo': objPremiumService['InsertLeadResult'],
                    'userID': this.prepared_request['insurer_integration_service_user'],
                    'ProposalAmount': Math.round(this.lm_request['final_premium']),
                    'PaymentType': '1',
                    'Responseurl': this.const_payment.pg_ack_url,//'http://localhost:50111/Payment/Transaction_Status/',
                    'CKYC':this.processed_request['___kyc_no___'],
                    'IsDocumentUpload':false,
                    'PanNo':this.processed_request['___pan___'],
                    'IsForm60' : false
                };
                console.log(pg_data);
                objServiceHandler.Payment.pg_data = pg_data;
                objServiceHandler.Payment.pg_redirect_mode = 'GET';
                objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['InsertLeadResult'];
                var proposalno = objPremiumService['InsertLeadResult'];
                if (proposalno !== '') {
                    var myobj = {
                        PB_CRN: parseInt(this.lm_request['crn']),
                        UD_Id: this.lm_request['udid'],
                        SL_Id: this.lm_request['slid'],
                        Insurer_Id: 9,
                        Request_Unique_Id: this.processed_request['___dbmaster_pb_request_unique_id___'],
                        Service_Log_Unique_Id: this.processed_request['___dbmaster_pb_service_log_unique_id___'],
                        Inspection_Id: proposalno,
                        Status: 'INSPECTION_SCHEDULED',
                        Created_On: new Date(),
                        Modified_On: ''
                    };
                    var MongoClient = require('mongodb').MongoClient;
                    MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                        if (err)
                            throw err;
                        var relianceBreakinId = db.collection('inspection_schedules');
                        relianceBreakinId.insertOne(myobj, function (err, res) {
                            if (err)
                                throw err;
                        });
                    });
                } else {
                    Error_Msg = 'Inspection Id not found proposal_response_handler';
                }

                let Client = require('node-rest-client').Client;
                let client = new Client();
                //let inspection_link = config.environment.weburl + '/inspect_approve/inspect.html?ARN='+this.lm_request['api_reference_number'];
                let inspection_link = config.environment.portalurl + '/inspect_approve/inspect.html?ARN=' + this.lm_request['api_reference_number'];
                client.get(config.environment.shorten_url + '?longUrl=' + encodeURIComponent(inspection_link), function (urlData, urlResponse) {
                    try {
                        let short_url = '';
                        if (urlData && urlData.Short_Url !== '') {
                            short_url = urlData.Short_Url;
                        }
                        var objRequestCore = {
                            'customer_name': objInsurerProduct.lm_request['first_name'] + ' ' + objInsurerProduct.lm_request['last_name'],
                            'crn': objInsurerProduct.lm_request['crn'],
                            'vehicle_text': objInsurerProduct.lm_request['vehicle_text'],
                            'insurer_name': 'Reliance General Insurance Co. Ltd.',
                            'insurance_type': 'RENEW - Breakin Case',
                            'inspection_id': proposalno,
                            'final_premium': Math.round(objInsurerProduct.lm_request['final_premium']),
                            'inspection_label': "Self Inspection Link",
                            'inspection_link': '<a href="' + short_url + '">' + short_url + '</a>'
                        };

                        try {
                            var email_data = fs.readFileSync(appRoot + '/resource/email/Send_Proposal_Link_Breakin.html').toString();
                            var User_Data = require(appRoot + '/models/user_data');
                            var ud_cond = {"User_Data_Id": objInsurerProduct.lm_request.udid - 0};
                            var emailto = objInsurerProduct.lm_request['email'];

                            User_Data.findOne(ud_cond, function (err, dbUserData) {
                                if (err) {
                                    console.error('Exception', err);
                                } else {
                                    objRequestCore['registration_no'] = dbUserData.Proposal_Request['registration_no_1'] + '-' + dbUserData.Proposal_Request['registration_no_2'] + '-' + dbUserData.Proposal_Request['registration_no_3'] + '-' + dbUserData.Proposal_Request['registration_no_4'];
                                    objRequestCore['registration_no'] = objRequestCore['registration_no'].toUpperCase();
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
                    } catch (ex3) {
                        console.error('Exception in ', objInsurerProduct.constructor.name, 'proposal_response_handler for inspection_scheduled mail', ex3);
                    }
                });
            } else {
                var objPremiumVerification = this.premium_verification(this.lm_request['final_premium'], objPremiumService['FinalPremium']);
                if (objPremiumVerification.Status) {
                } else {
                    if (this.lm_request['product_id'] === 10 && objPremiumVerification.Diff_Amt === -237) {
                        Error_Msg = 'Policy is expired. Please contact agent to generate New Payment link';
                    } else {
                        Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
                    }
                }
                var pg_data = {
                    'ProposalNo': objResponseJson['MotorPolicy']['ProposalNo'],
                    'userID': this.prepared_request['insurer_integration_service_user'],
                    'ProposalAmount': objPremiumVerification.Proposal_Amt,
                    'PaymentType': '1',
                    'Responseurl': this.const_payment.pg_ack_url //'http://localhost:50111/Payment/Transaction_Status/'
                };
                objServiceHandler.Payment.pg_data = pg_data;
                objServiceHandler.Payment.pg_redirect_mode = 'GET';
                objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['MotorPolicy']['ProposalNo'];

            }
        }
        //this.const_policy.transaction_amount=   
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'proposal_response_handler', objServiceHandler);


    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': JSON.stringify(ex)
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
RelianceMotor.prototype.verification_response_handler_NIU = function (objResponseJson) {
    var objInsurerProduct = this;
    console.log('Start', objInsurerProduct.constructor.name, 'verification_response_handler_NIU', objResponseJson);
    try {
        var objServiceHandler = {
            'Error_Msg': 'NO_ERR',
            'Insurer_Transaction_Identifier': null,
            'Premium_Breakup': null,
            'Policy': null
        };
        var Error_Msg = 'NO_ERR';

        if (objInsurerProduct.prepared_request.transaction_status === 'SUCCESS') {//transaction success

            var product_name = 'CAR';
            if (objInsurerProduct.lm_request['product_id'] === 10) {
                product_name = 'TW';
            } else if (objInsurerProduct.lm_request['product_id'] === 12) {
                if (objInsurerProduct.lm_request['vehicle_class'] === 'gcv') {
                    product_name = 'GCV';
                } else if (objInsurerProduct.lm_request['vehicle_class'] === 'pcv') {
                    product_name = 'PCV';
                } else {
                    product_name = 'MSC';
                }
            }
            var pdf_file_name = objInsurerProduct.constructor.name + '_' + product_name + '_' + objInsurerProduct.prepared_request.policy_number + '.pdf';
            var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
            var pdf_web_path_horizon = config.environment.weburl + "/pdf/" + pdf_file_name;

            var pdf_sys_loc_portal = config.pb_config.pdf_system_loc + pdf_file_name;
            var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
            //loc
            //var pdf_web_path_portal = config.environment.weburl + config.pb_config.pdf_web_loc + pdf_file_name;
            this.const_policy.policy_url = pdf_web_path_portal;

            var http = require('http');
            var insurer_pdf_url = objInsurerProduct.prepared_request['insurer_integration_pdf_url'];
            insurer_pdf_url = insurer_pdf_url.replace('___policy_number___', objInsurerProduct.prepared_request.policy_number);
            insurer_pdf_url = insurer_pdf_url.replace('___product_id___', objInsurerProduct.prepared_request['product_id']);
            this.const_policy.insurer_policy_url = insurer_pdf_url;
            if (insurer_pdf_url.indexOf('https:') > -1) {
                http = require('https');
            }
            try {
                var file_horizon = fs.createWriteStream(pdf_sys_loc_horizon);
                //var file_portal = fs.createWriteStream(pdf_sys_loc_portal);
                var request = http.get(insurer_pdf_url, function (response) {
                    response.pipe(file_horizon);
                    //response.pipe(file_portal);
                });
            } catch (ep) {
                console.error('ExceptionPDF', objInsurerProduct.constructor.name, 'verification_response_handler', ep);
            }
        }
        objServiceHandler.Policy = objInsurerProduct.const_policy;
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', objInsurerProduct.constructor.name, 'verification_response_handler_NIU', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        objServiceHandler.Policy = objInsurerProduct.const_policy;
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', objInsurerProduct.constructor.name, 'verification_response_handler_NIU', ex);
    }
    return objServiceHandler;
};
RelianceMotor.prototype.verification_response_handler = function (objResponseJson) {
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
        if (objInsurerProduct.prepared_request.transaction_status === 'SUCCESS') {//transaction success

            var product_name = 'CAR';
            if (objInsurerProduct.lm_request['product_id'] === 10) {
                product_name = 'TW';
            } else if (objInsurerProduct.lm_request['product_id'] === 12) {
                if (objInsurerProduct.lm_request['vehicle_class'] === 'gcv') {
                    product_name = 'GCV';
                } else if (objInsurerProduct.lm_request['vehicle_class'] === 'pcv') {
                    product_name = 'PCV';
                } else {
                    product_name = 'MSC';
                }
            }
            var pdf_file_name = this.constructor.name + '_' + product_name + '_' + objInsurerProduct.prepared_request.policy_number + '.pdf';
            var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
            var pdf_web_path_horizon = config.environment.weburl + "/pdf/" + pdf_file_name;

            var pdf_sys_loc_portal = config.pb_config.pdf_system_loc + pdf_file_name;
            var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
            //loc
            //var pdf_web_path_portal = config.environment.weburl + config.pb_config.pdf_web_loc + pdf_file_name;
            objInsurerProduct.const_policy.policy_url = pdf_web_path_portal;

            var http = require('http');
            var insurer_pdf_url = objInsurerProduct.prepared_request['insurer_integration_pdf_url'];
            insurer_pdf_url = insurer_pdf_url.replace('___policy_number___', objInsurerProduct.prepared_request.policy_number);
            insurer_pdf_url = insurer_pdf_url.replace('___product_id___', objInsurerProduct.prepared_request['product_id']);
            this.const_policy.insurer_policy_url = insurer_pdf_url;
            if (insurer_pdf_url.indexOf('https:') > -1) {
                http = require('https');
            }
            try {
                var file_horizon = fs.createWriteStream(pdf_sys_loc_horizon);
                //var file_portal = fs.createWriteStream(pdf_sys_loc_portal);
                var request = http.get(insurer_pdf_url, function (response) {
                    response.pipe(file_horizon);
                    //response.pipe(file_portal);
                });
            } catch (ep) {
                console.error('ExceptionPDF', this.constructor.name, 'verification_response_handler', ep);
            }
        }
        console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };
        Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', ex);
    }
    objServiceHandler.Policy = objInsurerProduct.const_policy;
    objServiceHandler.Error_Msg = Error_Msg;
    return objServiceHandler;
};
RelianceMotor.prototype.pg_response_handler = function () {
    try {
//Success -> Output=1|9202272311012647|C531031700163|0|CCAvenue|R31031700154|Success|
//Failure -> Output=0|| C514081505462|0|Billdesk|R311027381|Failure|authentication failed from bank
//MismatchPremium -> Output=0|||1|CCavenue|R06041700079||Response Amount is not matching with the Premium to be paid.

        var objInsurerProduct = this;
        console.log('Start', objInsurerProduct.constructor.name, 'pg_response_handler');
        var output = objInsurerProduct.lm_request.pg_get['Output'];
        var response = output.split('|');
        this.const_policy.transaction_status = '';
        this.const_policy.transaction_id = response[2];
        if (output.indexOf('Success') > -1 && response[1] !== '') {
            this.const_policy.transaction_amount = objInsurerProduct.insurer_master['service_logs']['pb_db_master']['Payment']['pg_data']['ProposalAmount'];
            this.const_policy.transaction_status = 'SUCCESS';
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.policy_number = response[1];
            this.const_policy.pg_reference_number_1 = response[5];
        } else if (output.indexOf('Success') > -1 && response[1] === '') {
            this.const_policy.transaction_amount = objInsurerProduct.insurer_master['service_logs']['pb_db_master']['Payment']['pg_data']['ProposalAmount'];
            this.const_policy.transaction_status = 'PAYPASS';
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.policy_number = response[1];
        } else if (output.indexOf('Failure') > -1) {
            this.const_policy.pg_message = response[7];
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
        }
        console.error('End', objInsurerProduct.constructor.name, 'pg_response_handler', objInsurerProduct.const_policy);
    } catch (ex) {
        console.error('Exception', objInsurerProduct.constructor.name, 'pg_response_handler', ex);
    }
};
RelianceMotor.prototype.reliance_fuel_code = function (objProduct, Insurer_Object, specific_insurer_object) {
    console.log('reliance_fuel_code', 'start');
    var fuel_code = 0;
    try {
        var arr_fuel = {
            "PETROL": "1",
            "DIESEL": "2",
            "CNG": "3",
            "LPG": "4",
            "PETROL+LPG": "5",
            "PETROL+CNG": "5",
            "BATTERY": "6",
            "BATTERY OPERATED": "6",
            "NA": "7"
        };
        var fuel_type = this.prepared_request['dbmaster_insurer_vehicle_fueltype'].toString();
        if (arr_fuel.hasOwnProperty(fuel_type)) {
            fuel_code = arr_fuel[fuel_type];
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'reliance_fuel_code', ex);
        return fuel_code;
    }
    console.log('reliance_fuel_code', 'finish');
    return fuel_code;

};

RelianceMotor.prototype.premium_breakup_schema = {
    "own_damage": {
        "od_basic": "Basic_OD",
        "od_elect_access": "Electrical_Accessories",
        "od_non_elect_access": "Non_Electrical_Accessories",
        "od_cng_lpg": "Bifuel_Kit",
        "od_disc_ncb": "NCB",
        "od_disc_vol_deduct": "Voluntary_Deductible",
        "od_disc_anti_theft": "Anti-Theft_Device",
        "od_disc_aai": "Automobile_Association_Membership",
        "od_loading": "",
        "od_disc": "OD_Discount",
        "od_inspection_charge": "",
        "od_disc_own_premises": "Use_of_Vehicles_Confined_to_sites",
        "od_final_premium": "TotalODPremium"
    },
    "liability": {
        "tp_basic": "Basic_Liability",
        "tp_cover_owner_driver_pa": "PA_to_Owner_Driver",
        "tp_cover_unnamed_passenger_pa": "PA_to_Unnamed_Passenger",
        "tp_cover_named_passenger_pa": "",
        "tp_cover_paid_driver_pa": "",
        "tp_cover_tppd": "TPPD",
        "tp_cover_paid_driver_ll": "Liability_to_Paid_Driver",
        "tp_cng_lpg": "Bifuel_Kit_TP",
        "tp_cover_imt23": "",
        "tp_cover_fairing_paying_passenger": "",
        "tp_cover_non_fairing_paying_passenger": "",
        "tp_basic_other_use": "",
        "tp_cover_emp_pa": "",
        "tp_cover_conductor_ll": "Liability_to_Conductor",
        "tp_cover_coolie_ll": "Liability_to_Coolies",
        "tp_cover_cleaner_ll": "Liability_to_Cleaner",
        "tp_cover_geographicalareaext": "Geographical_Extension",
        "tp_cover_additionaltowing": "Additional_Towing",
        "tp_cover_fibreglasstankfitted": "Fibre_Glass_Tank",
        "tp_final_premium": "TotalLiabilityPremium"
    },
    "addon": {
        "addon_zero_dep_cover": "Nil_Depreciation",
        "addon_road_assist_cover": null,
        "addon_ncb_protection_cover": 'NCB_Retention',
        "addon_engine_protector_cover": "",
        "addon_invoice_price_cover": null,
        "addon_key_lock_cover": null,
        "addon_consumable_cover": null,
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
        "addon_final_premium": "TotalAddonPremium"
    },
    "net_premium": "NetPremium",
    "service_tax": "",
    "final_premium": "FinalPremium"
};
module.exports = RelianceMotor;
