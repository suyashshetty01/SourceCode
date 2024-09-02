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

function DhflMotor() {

}
util.inherits(DhflMotor, Motor);

DhflMotor.prototype.lm_request_single = {};
DhflMotor.prototype.insurer_integration = {};
DhflMotor.prototype.insurer_addon_list = [];
DhflMotor.prototype.insurer = {};
DhflMotor.prototype.pdf_attempt = 0;
DhflMotor.prototype.insurer_date_format = 'dd-MM-yyyy';


DhflMotor.prototype.insurer_product_api_pre = function () {

};
DhflMotor.prototype.insurer_product_field_process_pre = function () {
    try {
        var Error_Msg = 'NO_ERR';
        if (this.lm_request['method_type'] === 'Premium') {
            //TW UW Rules to be implemented under API -Start
            // These Rules are applicable from 1st Jan 2020
            // - RTOs: JK, KL, HP, MP, RJ, North East RTOs ( AR, AS, MN, ML, MZ, NL, SK, TR) to be blocked
            if (this.lm_request['product_id'] === 10) {

                var tw_block_rto = ["JK", "KL", "HP", "MP", "RJ", "AR", "AS", "MN", "ML", "MZ", "NL", "SK", "TR", "PB", "CH", "HR", "UK", "UA", "OD", "OR", "GA", "DN", "UP", "DL"];
                var tw_sc_comp = ["PB", "HR", "GA", "DN"];
                var tw_bk_comp = ["CH", "PB", "DL", "UP", "UK", "UA", "TN", "GA", "DN", "OD"];
                var tw_sc_tp = ["TN", "OD"];
                var tw_bk_tp = ["HR", "TN", "OD"];

                if (this.prepared_request.hasOwnProperty('dbmaster_insurer_rto_code')) {
                    var RTOs_Name = (this.prepared_request['dbmaster_insurer_rto_code']).split('-')[0];
                }
                if (this.prepared_request.hasOwnProperty('regno_rtocode')) {
                    var RegNo_RTO = (this.prepared_request['regno_rtocode']);
                    var RegNo_RTOCode = (this.prepared_request['regno_rtocode']).split('-')[0];
                } else {
                    var RegNo_RTO = (this.prepared_request['dbmaster_insurer_rto_code']);
                    var RegNo_RTOCode = (this.prepared_request['dbmaster_insurer_rto_code']).split('-')[0];
                }
                if (tw_block_rto.indexOf(RTOs_Name) > -1 || tw_block_rto.indexOf(RegNo_RTOCode) > -1) {
                    Error_Msg = 'Two Wheeler BIKE > 150 cc TP - RTOs: JK, KL, HP, MP, RJ, North East RTOs ( AR, AS, MN, ML, MZ, NL, SK, TR) to be blocked';
                }
                if (this.prepared_request.hasOwnProperty('vehicle_insurance_subtype') && this.prepared_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
                    if (this.prepared_request.hasOwnProperty('dbmaster_insurer_vehicle_insurer_segmant') && ["Scooter", "Moped"].indexOf(this.prepared_request['dbmaster_insurer_vehicle_insurer_segmant']) > -1) {
                        if (tw_sc_tp.indexOf(RTOs_Name) > -1 || tw_sc_tp.indexOf(RegNo_RTOCode) > -1) {
                            Error_Msg = 'Two Wheeler SCOOTER TP - RTOs: JK,  HP,   RJ,  KL, TN, MP , OD, north east RTOs  ( AR, AS, MN, ML, MZ, NL, SK, TR) to be blocked';
                        }
                    }
                    if (this.prepared_request.hasOwnProperty('dbmaster_insurer_vehicle_insurer_segmant') && this.prepared_request['dbmaster_insurer_vehicle_insurer_segmant'] === "Motor cycle") {
                        if (tw_bk_tp.indexOf(RTOs_Name) > -1 || tw_bk_tp.indexOf(RegNo_RTOCode) > -1) {
                            Error_Msg = 'Two Wheeler BIKE  TP - RTOs: JK,  HP,   HR( Except HR26 & HR 51),  RJ,  TN, KL, MP, OD, North East RTOs ( AR, AS, MN, ML, MZ, NL, SK, TR) to be blocked';
                        } else if (this.prepared_request['dbmaster_insurer_rto_code'] === "HR-26" || this.prepared_request['dbmaster_insurer_rto_code'] === "HR-51" || RegNo_RTO === "HR-26" || RegNo_RTO === "HR-51") {
                            Error_Msg = 'NO_ERR';
                        }
                    }
                } else {
                    if (this.prepared_request.hasOwnProperty('dbmaster_insurer_vehicle_insurer_segmant') && ["Scooter", "Moped"].indexOf(this.prepared_request['dbmaster_insurer_vehicle_insurer_segmant']) > -1) {
                        if (tw_sc_comp.indexOf(RTOs_Name) > -1 || tw_sc_comp.indexOf(RegNo_RTOCode) > -1) {
                            Error_Msg = 'Two Wheeler SCOOTER  Comprehensive - RTOs: JK,  HP,   PB, HR( except HR26 & HR51 ), RJ, KL, MP , GA, DN, north east RTOs  ( AR, AS, MN, ML, MZ, NL, SK, TR, to be blocked';
                        } else if (this.prepared_request['dbmaster_insurer_rto_code'] === "HR-26" || this.prepared_request['dbmaster_insurer_rto_code'] === "HR-51" || RegNo_RTO === "HR-26" || RegNo_RTO === "HR-51") {
                            Error_Msg = 'NO_ERR';
                        }
                    }
                    if (this.prepared_request.hasOwnProperty('dbmaster_insurer_vehicle_insurer_segmant') && this.prepared_request['dbmaster_insurer_vehicle_insurer_segmant'] === "Motor cycle") {
                        if (tw_bk_comp.indexOf(RTOs_Name) > -1 || tw_bk_comp.indexOf(RegNo_RTOCode) > -1) {
                            Error_Msg = 'Two Wheeler BIKE  Comprehensive - RTOs: JK,  HP, CH, PB,  HR, DL, RJ, UP, UK, UA ,TN, KL, MP , GA, DN, OD, North East RTOs (AR, AS, MN, ML, MZ, NL, SK, TR) to be blocked';
                        }
                    }

                }
                if (this.prepared_request.hasOwnProperty('dbmaster_insurer_vehicle_cubiccapacity') && this.prepared_request['dbmaster_insurer_vehicle_insurer_segmant'] === "Motor cycle" && this.prepared_request['dbmaster_insurer_vehicle_cubiccapacity'] > 150) {
                    Error_Msg = 'Two Wheeler BIKE > 150 cc TP - RTOs: All India  to be blocked';
                }
            }
            //TW TW UW Rules -End
            //Pvt Car UW Rules -Start
            if (this.lm_request['product_id'] === 1) {
                var car_block_rto = ["JK", "KL", "HP", "MP", "RJ", "AR", "AS", "MN", "ML", "MZ", "NL", "SK", "TR", "PB", "CH", "HR", "UK", "UA"];
                var fortuner_block_rto = ["JK", "HP", "PB", "HR", "CH", "DL", "RJ", "UP", "UK", "UA"];
                var car_comp_block_rto = ["HR"];
                var car_tp_petrol_block_rto = ["HR", "TN", "OD"];
                var car_tp_diesel_block_rto = ["CH", "PB", "HR", "TN", "OD", "UP", "UK", "UA"];

                if (this.prepared_request.hasOwnProperty('dbmaster_insurer_rto_code')) {
                    var RTOs_Name = (this.prepared_request['dbmaster_insurer_rto_code']).split('-')[0];
                }
                if (this.prepared_request.hasOwnProperty('regno_rtocode')) {
                    var RegNo_RTO = (this.prepared_request['regno_rtocode']);
                    var RegNo_RTOCode = (this.prepared_request['regno_rtocode']).split('-')[0];
                } else {
                    var RegNo_RTO = (this.prepared_request['dbmaster_insurer_rto_code']);
                    var RegNo_RTOCode = (this.prepared_request['dbmaster_insurer_rto_code']).split('-')[0];
                }
                if (car_block_rto.indexOf(RTOs_Name) > -1 || car_block_rto.indexOf(RegNo_RTOCode) > -1) {
                    Error_Msg = 'RTOs: JK, KL, HP, MP, RJ, North East RTOs ( AR, AS, MN, ML, MZ, NL, SK, TR) to be blocked';
                }
                if (this.prepared_request.hasOwnProperty('vehicle_insurance_subtype') && this.prepared_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
                    if (this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === 'Petrol') {
                        if (car_tp_petrol_block_rto.indexOf(RTOs_Name) > -1 || car_tp_petrol_block_rto.indexOf(RegNo_RTOCode) > -1) {
                            Error_Msg = 'Private Car  Comprehensive - RTOs: JK,  HP,   HR( except HR26 & HR51 ), RJ, KL, MP , North east RTOs ( AR, AS, MN, ML, MZ, NL, SK, TR)to be blocked ';
                        } else if (this.prepared_request['dbmaster_insurer_rto_code'] === "HR-26" || this.prepared_request['dbmaster_insurer_rto_code'] === "HR-51" || RegNo_RTO === "HR-26" || RegNo_RTO === "HR-51") {
                            Error_Msg = 'NO_ERR';
                        }
                    }
                    if (this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === 'Diesel') {
                        if (car_tp_diesel_block_rto.indexOf(RTOs_Name) > -1 || car_tp_diesel_block_rto.indexOf(RegNo_RTOCode) > -1) {
                            Error_Msg = 'Private Car  Comprehensive - RTOs: JK,  HP,   HR( except HR26 & HR51 ), RJ, KL, MP , North east RTOs ( AR, AS, MN, ML, MZ, NL, SK, TR)to be blocked ';
                        } else if (this.prepared_request['dbmaster_insurer_rto_code'] === "HR-26" || this.prepared_request['dbmaster_insurer_rto_code'] === "HR-51" || RegNo_RTO === "HR-26" || RegNo_RTO === "HR-51") {
                            Error_Msg = 'NO_ERR';
                        }
                    }
                } else {
                    if (car_comp_block_rto.indexOf(RTOs_Name) > -1 || car_comp_block_rto.indexOf(RegNo_RTOCode) > -1) {
                        Error_Msg = 'Private Car  Comprehensive - RTOs: JK,  HP,   HR( except HR26 & HR51 ), RJ, KL, MP , North east RTOs ( AR, AS, MN, ML, MZ, NL, SK, TR)to be blocked ';
                    } else if (this.prepared_request['dbmaster_insurer_rto_code'] === "HR-26" || this.prepared_request['dbmaster_insurer_rto_code'] === "HR-51" || RegNo_RTO === "HR-26" || RegNo_RTO === "HR-51") {
                        Error_Msg = 'NO_ERR';
                    }
                }
                if (this.prepared_request.hasOwnProperty('dbmaster_insurer_vehicle_model_name') && this.prepared_request['dbmaster_insurer_vehicle_model_name'] === "FORTUNER") {
                    if (fortuner_block_rto.indexOf(RTOs_Name) > -1 || fortuner_block_rto.indexOf(RegNo_RTOCode) > -1) {
                        Error_Msg = 'Private Car > Fortuner - to be block in JK, HP, PB, HR, CH, DL, RJ, UP,UK, UA only';
                    }
                }
                if (this.processed_request.hasOwnProperty('___vehicle_expected_idv___') && parseInt(this.processed_request['___vehicle_expected_idv___']) > 3000000) {
                    Error_Msg = 'Private Car > IDV greater than 30 lakh';
                }
            }
            //Pvt Car UW Rules -End
        }
        if (Error_Msg === 'NO_ERR') {
            var is_tp_only = false;
            if (this.prepared_request.hasOwnProperty('vehicle_insurance_subtype') && this.prepared_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
                is_tp_only = true;
            }
            if (this.lm_request['vehicle_registration_type'] === 'corporate') {
                this.lm_request['is_pa_od'] = 'no';
                this.prepared_request['is_pa_od'] = 'no';
                this.processed_request['___is_pa_od___'] = 'false';
                this.method_content = this.method_content.replace('___is_pa_od___', 'false');
                if (this.lm_request['method_type'] === 'Proposal') {
                    this.prepared_request['company_name'] = this.lm_request['company_name'];
                    this.processed_request['___company_name___'] = this.prepared_request['company_name'];
                }
            }
            var vehicle_age = this.vehicle_age_year();
            if (this.lm_request.hasOwnProperty('vehicle_insurance_subtype')) {
                if (this.lm_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
                    this.prepared_request['vehicle_expected_idv'] = 0;
                    this.processed_request['___vehicle_expected_idv___'] = 0;
                }
            }
            if (this.prepared_request.hasOwnProperty('addon_tyre_coverage_cover')) {
                if (vehicle_age <= 2 && this.lm_request['product_id'] === 1 && this.prepared_request['addon_tyre_coverage_cover'] === 'yes') {
                    this.prepared_request['addon_tyre_coverage_cover'] = 'yes';
                    this.processed_request['___addon_tyre_coverage_cover___'] = '1000002';
                } else {
                    this.prepared_request['addon_tyre_coverage_cover'] = 'no';
                    this.processed_request['___addon_tyre_coverage_cover___'] = '';
                    this.method_content = this.method_content.replace('"tyreReplacementDHFLVO":"false"', '"tyreReplacementDHFLVO":""');
                }
                if (this.prepared_request['addon_tyre_coverage_cover'] === 'no' || this.lm_request['method_type'] === 'Idv') {
                    this.prepared_request['addon_tyre_coverage_cover'] = 'no';
                    this.processed_request['___addon_tyre_coverage_cover___'] = '';
                    this.method_content = this.method_content.replace('"tyreReplacementDHFLVO":"false"', '"tyreReplacementDHFLVO":""');
                }
            }

            var obj_fuel_code = {
                'Battery': 1000000,
                'CNG': 5,
                'Diesel': 2,
                'Electric': 1000001,
                'LPG': 3,
                'Petrol': 1
            };
            if (this.prepared_request.hasOwnProperty('dbmaster_insurer_vehicle_fueltype')) {
                var fuel_code = obj_fuel_code[this.prepared_request['dbmaster_insurer_vehicle_fueltype']];
                this.method_content = this.method_content.replace('___vehicle_fuelcode___', fuel_code);
            }
            if (this.lm_request['product_id'] === 10) {
                var obj_ncb_next = {
                    '0': 1000001,
                    '20': 1000002,
                    '25': 1000003,
                    '35': 1000004,
                    '45': 1000005,
                    '50': 1000006
                };
            } else {
                var obj_ncb_next = {
                    '0': 1000008,
                    '20': 1000009,
                    '25': 1000010,
                    '35': 1000011,
                    '45': 1000012,
                    '50': 1000013
                };
            }
            var ncb_next = obj_ncb_next[this.prepared_request['vehicle_ncb_next']];
            this.method_content = this.method_content.replace('___vehicle_ncb_next___', ncb_next);
            if (this.lm_request['product_id'] === 10) {
                this.method_content = this.method_content.replace('___rating_reference___', this.prepared_request['dbmaster_insurer_rto_city_code']);
            } else if (this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === 'Diesel') {
                this.method_content = this.method_content.replace('___rating_reference___', this.prepared_request['dbmaster_insurer_rto_state_code']);
            } else {
                this.method_content = this.method_content.replace('___rating_reference___', this.prepared_request['dbmaster_insurer_rto_district_code']);
            }
            if (this.lm_request['product_id'] === 10) {
                this.method_content = this.method_content.replace('___vehicle_insurance_subtype___', this.processed_request['___vehicle_insurance_subtype_1___']);
                if (this.lm_request['vehicle_insurance_subtype'] === '2CH_0TP' || this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP') {
                    this.method_content = this.method_content.replace('"productName":""', '"productName":"1000015"');
                    this.method_content = this.method_content.replace('___policy_tenure___', this.lm_request['policy_od_tenure']);
                }
                this.method_content = this.method_content.replace('___voluntary_deductible_dhflvo___', '0');
                if (this.lm_request['vehicle_insurance_subtype'] === '2CH_0TP') {
                    this.prepared_request['vehicle_insurance_subtype_2'] = 1000001;
                    this.processed_request['___vehicle_insurance_subtype_2___'] = 1000001;
                }
                if (this.lm_request['is_tppd'] === 'yes') {
                    this.method_content = this.method_content.replace('___is_tppd___', 'true');
                }
                if (vehicle_age > 3) {
                    this.method_content = this.method_content.replace('___addon_zero_dep_cover___', 'false');
                    this.method_content = this.method_content.replace('___addon_consumable_cover___', 'false');
                    this.method_content = this.method_content.replace('___addon_invoice_price_cover___', 'false');
                }
            }
            if (this.lm_request['is_tppd'] === undefined) {
                this.method_content = this.method_content.replace('___is_tppd___', 'false');
            }
            if (this.prepared_request['addon_zero_dep_cover'] === 'yes') {
                this.method_content = this.method_content.replace('___add_On_Claim_Count_DHFLVO___', 1000005);
            } else {
                this.method_content = this.method_content.replace('___add_On_Claim_Count_DHFLVO___', 1000001);
            }
            if (this.lm_request['method_type'] === 'Verification') {
                if (this.lm_request['vehicle_registration_type'] === 'corporate') {
                    this.method_content = this.method_content.replace('___salutation___', '1000000');
                    this.method_content = this.method_content.replace('___first_name___', '');
                    this.method_content = this.method_content.replace('___middle_name___', '');
                    this.method_content = this.method_content.replace('___last_name___', this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['company_name']);
                } else {
                    this.method_content = this.method_content.replace('___salutation___', this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['salutation']);
                    this.method_content = this.method_content.replace('___first_name___', this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['first_name']);
                    this.method_content = this.method_content.replace('___middle_name___', this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['middle_name']);
                    this.method_content = this.method_content.replace('___last_name___', this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['last_name']);
                }
                this.method_content = this.method_content.replace('___gst_no___', this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['gst_no']);
                this.method_content = this.method_content.replace('___address_1___', this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['communication_address_1'] + ' ');
                this.method_content = this.method_content.replace('___address_2___', (this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['communication_address_2'] + ' ' + this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['communication_address_3']).substring(0, 50));
                this.method_content = this.method_content.replace('___communication_pincode___', this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['communication_pincode']);
                this.method_content = this.method_content.replace('___email___', this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['email']);
            }
            if (this.lm_request['method_type'] === 'Premium') {
                this.method_content = this.method_content.replace('___nominee_name___', 'n name');
                this.method_content = this.method_content.replace('___nominee_relation___', '1000001');
            }
            if (this.lm_request['product_id'] === 1) {
                this.method_content = this.method_content.replace('___is_tppd___', 'false');
                this.method_content = this.method_content.replace('___vehicle_ncb_current___', this.processed_request['___vehicle_ncb_current_1___']);
                if (this.prepared_request['voluntary_deductible'] === "") {
                    this.method_content = this.method_content.replace('___voluntary_deductible___', '1000011');
                }
                if (vehicle_age > 2) {
                    this.method_content = this.method_content.replace('___addon_invoice_price_cover___', 'false');
                    this.method_content = this.method_content.replace('___addon_tyre_coverage_cover___', '');
                    this.method_content = this.method_content.replace('"tyreReplacementDHFLVO":"false"', '"tyreReplacementDHFLVO":""');
                }
                if (vehicle_age > 5) {
                    this.method_content = this.method_content.replace('___addon_zero_dep_cover___', 'false');
                    this.method_content = this.method_content.replace('___addon_consumable_cover___', 'false');
                }
                if (vehicle_age > 7) {
                    this.method_content = this.method_content.replace('___addon_engine_protector_cover___', 'false');
                }
                if (this.lm_request['vehicle_registration_type'] === 'individual' && this.lm_request['method_type'] === 'Proposal') {
                    var relation_nominee = {
                        "1000001": "1000006",
                        "1000002": "1000007",
                        "1000003": "1000008",
                        "1000004": "1000009",
                        "1000005": "1000010",
                        "1000022": "1000018",
                        "1000023": "1000020",
                        "1000024": "1000021",
                        "1000025": "1000011",
                        "1000026": "1000019"
                    };
                    this.prepared_request['nominee_relation'] = relation_nominee[this.processed_request['___nominee_relation___']];
                    this.processed_request['___nominee_relation___'] = relation_nominee[this.processed_request['___nominee_relation___']];
                }
            }
            if (this.lm_request['is_breakin'] === 'yes' && is_tp_only) {
                var n = 2;
                var t = new Date();
                t.setDate(t.getDate() + n);
                var month = "0" + (t.getMonth() + 1);
                var date = "0" + t.getDate();
                month = month.slice(-2);
                date = date.slice(-2);
                var date = date + "-" + month + "-" + t.getFullYear();
                this.method_content = this.method_content.replace('___policy_start_date___', date);
            }
            if (this.lm_request['method_type'] === 'Verification' && this.processed_request['___transaction_date___'] !== null) {
                var res_date = this.processed_request['___transaction_date___'];
                let res_date_dd = (res_date.getDate() < 10) ? ("0" + res_date.getDate()) : (res_date.getDate());
                let res_date_mm = ((res_date.getMonth() + 1) < 10) ? ("0" + (res_date.getMonth() + 1)) : (res_date.getMonth() + 1);
                var date = res_date_dd + "-" + res_date_mm + "-" + res_date.getFullYear();
                this.method_content = this.method_content.replace('___pg_reference_number_3___', date);
            }
            if (this.lm_request.hasOwnProperty('recon_reference_number')) {
                this.prepared_request['recon_reference_number'] = this.lm_request['recon_reference_number'];
                this.processed_request['___recon_reference_number___'] = this.prepared_request['recon_reference_number'];

            }
        } else {
            this.method_content = "";
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_product_field_process_pre', ex);
    }
};
DhflMotor.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
    if (specific_insurer_object.method.Method_Type === 'Status') {
        obj_response_handler = this.status_response_handler(objResponseJson);
    }
    return obj_response_handler;

};
DhflMotor.prototype.insurer_product_field_process_post = function () {

};
DhflMotor.prototype.insurer_product_api_post = function () {

};
DhflMotor.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    try {

        var objInsurerProduct = this;
        var product_id = objProduct.db_specific_product.Product_Id;//
        var insurer_id = Insurer_Object.Insurer_ID;
        var soap = require('soap');
        var xml2js = require('xml2js');

        //Example POST method invocation 
        var Client = require('node-rest-client').Client;
        var client = new Client();
        console.log("DHFLMotor service_call : ", specific_insurer_object.method.Method_Type, " :: ", docLog.Insurer_Request);
        var args = null;
        var service_method_url = '';

        args = {
            data: docLog.Insurer_Request,
            headers: {
                'Content-Type': 'application/json',
                'username': this.prepared_request['insurer_integration_service_user'], //'partnerchannel',//
                'password': this.prepared_request['insurer_integration_service_password'], //'test@654321',//
                'token': this.prepared_request['insurer_integration_agent_code']//'LANDMARK_TEST'//
            }
        };
        if (specific_insurer_object.method.Method_Type === "Status") {
            var service_method_url = specific_insurer_object.method_file_url;

            const request = require('request');
            request.post({
                url: service_method_url,
                form: {
                    order_no: '572362',
                    access_code: 'OPMED4OM2U05LCQQIX'
                }
            }, function (err, httpResponse, body) {

                console.log(httpResponse);
                // raw response 
                console.log(err);
                var objResponseFull = {
                    'err': null,
                    'result': body,
                    'raw': JSON.stringify(body),
                    'soapHeader': null,
                    'objResponseJson': JSON.parse(body)
                };
                var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);

            });
        } else {
            service_method_url = specific_insurer_object.method_file_url + specific_insurer_object.method.Method_Action;
            //var service_method_url = specific_insurer_object.method_file_url + specific_insurer_object.method.Method_Action;
            client.post(service_method_url, args, function (data, response) {
                // parsed response body as js object 
                console.log(data);
                // raw response 
                console.log(response);
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
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};
DhflMotor.prototype.idv_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'idv_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    //check error start
    try {
        if (objResponseJson['code'] === 1) {
            objResponseJson = objResponseJson['data'];
            var Idv_Breakup = this.get_const_idv_breakup();
            //Idv_Breakup["Idv_Normal"] = parseInt(Idv_Breakup["Idv_Normal"] * 0.90);
            Idv_Breakup["Idv_Normal"] = parseInt(objResponseJson['IDV']['ONE']);
            Idv_Breakup["Idv_Min"] = parseInt(Idv_Breakup["Idv_Normal"] * 0.85);
            Idv_Breakup["Idv_Max"] = parseInt(Idv_Breakup["Idv_Normal"] * 1.15);
            Idv_Breakup["Exshowroom"] = 0;

            objServiceHandler.Premium_Breakup = Idv_Breakup;
            objServiceHandler.Insurer_Transaction_Identifier = '';

        } else {
            Error_Msg = objResponseJson['message'];
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'idv_response_handler', objServiceHandler);
        return objServiceHandler;
    } catch (e) {
        objServiceHandler.Error_Msg = JSON.stringify(e);
        console.error('Exception', this.constructor.name, 'idv_response_handler', objServiceHandler);
        return objServiceHandler;
    }
};

DhflMotor.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };/*
     if (this.prepared_request['vehicle_expected_idv'] < 7500 && this.prepared_request['vehicle_expected_idv'] > 150000) {
     Error_Msg = 'LM_ERR:New Vehicle Not allowed(Minimum IDV ₹ 7,500  Maximum IDV ₹ 1,50,000)';
     }
     if (this.lm_request['vehicle_insurance_subtype'] === '1CH_0TP' && this.prepared_request['vehicle_age_year'] > 10) {
     Error_Msg = 'LM_ERR: Vehicle Restricted (Vehicle age upto 7 years for long term policy.)';
     }
     if ((this.lm_request['vehicle_insurance_subtype'] === '2CH_0TP' && this.prepared_request['vehicle_age_year'] > 7) || (this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP' && this.prepared_request['vehicle_age_year'] > 7)) {
     Error_Msg = 'LM_ERR: Vehicle Restricted (Vehicle age upto 10 years for Annual policy.)';
     }
     */
    var Error_Msg = 'NO_ERR';
    try {
        var objPremiumService = objResponseJson['data'];
        if (Error_Msg === 'NO_ERR') {
            if (objResponseJson['code'] !== 1) {
                Error_Msg = objPremiumService['error'];
            }
            if (Error_Msg === 'NO_ERR') {
                var premium_breakup = this.const_premium_breakup;
                var objLMPremium = {};
                for (var key in objPremiumService['TP']) {
                    for (var key1 in objPremiumService['TP'][key]) {
                        var key_change = objPremiumService['TP'][key][key1]['name'];
                        var val = objPremiumService['TP'][key][key1]['net_premium'];
                        key_change = key_change.replace(/ /g, '_');
                        objLMPremium[key_change] = this.round2Precision(val - 0);
                    }
                }
                for (var key in objPremiumService['OD']) {
                    for (var key1 in objPremiumService['OD'][key]) {
                        var key_change = objPremiumService['OD'][key][key1]['name'];
                        var val = objPremiumService['OD'][key][key1]['net_premium'];
                        key_change = key_change.replace(/ /g, '_');
                        objLMPremium[key_change] = this.round2Precision(val - 0);
                    }
                }
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
                            premium_breakup[key][sub_key] = Math.round(premium_val);
                            if (sub_key === "od_basic" && objLMPremium.hasOwnProperty('NCB_Discount'))
                            {
                                premium_breakup[key][sub_key] = Math.round(premium_val + objLMPremium['NCB_Discount']);
                                premium_val = Math.round(premium_val + objLMPremium['NCB_Discount']);
                            }
                            if (sub_key === "tp_cover_unnamed_passenger_pa" && this.prepared_request['pa_unnamed_passenger_si'] === '')
                            {
                                premium_breakup[key][sub_key] = 0;
                                premium_val = 0;
                            }
                            if (sub_key === "addon_invoice_price_cover" && objLMPremium.hasOwnProperty('New_Car_for_Old_Car'))
                            {
                                premium_breakup[key][sub_key] = Math.round(premium_val + objLMPremium['New_Car_for_Old_Car']);
                                premium_val = Math.round(premium_val + objLMPremium['New_Car_for_Old_Car']);
                            }
                            if (sub_key === "addon_hospital_cash_cover" && objLMPremium.hasOwnProperty('Hospi_Cash'))
                            {
                                premium_breakup[key][sub_key] = Math.round(premium_val + objLMPremium['Hospi_Cash']);
                                premium_val = Math.round(premium_val + objLMPremium['Hospi_Cash']);
                            }
                            if (sub_key === "tp_cover_paid_driver_pa" && this.prepared_request['pa_paid_driver_si'] === '')
                            {
                                premium_breakup[key][sub_key] = 0;
                                premium_val = 0;
                            }
                            if (sub_key === "tp_cover_paid_driver_ll" && this.prepared_request['is_llpd'] === 'no')
                            {
                                premium_breakup[key][sub_key] = 0;
                                premium_val = 0;
                            }
                            if (sub_key.indexOf('final_') > -1) {
                                group_final_key = sub_key;
                            } else if (sub_key.indexOf('_disc') > -1) {
                                group_final -= Math.round(premium_val);
                            } else {
                                group_final += Math.round(premium_val);
                            }
                        }
                        premium_breakup[key][group_final_key] = group_final;
                    }
                }
                //premium_breakup['addon']['addon_mandatory_deduction_protect'] = 0;
                objServiceHandler.Premium_Breakup = premium_breakup;
                objServiceHandler.Insurer_Transaction_Identifier = objPremiumService['CustomerID'];
            }
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.log('Finish', this.constructor.name, 'premium_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'premium_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
DhflMotor.prototype.insurer_vehicle_idv = function (objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback) {
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

DhflMotor.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };

    try {
        if (objResponseJson['code'] !== 1) {
            if (objResponseJson.hasOwnProperty('message')) {
                Error_Msg = objResponseJson['data']['error'];
            } else {
                Error_Msg = objResponseJson['message'];
            }
        }
        if (this.prepared_request['communication_state'] === 'ARUNACHAL PRADESH' || this.prepared_request['communication_state'] === 'ASSAM' || this.prepared_request['communication_state'] === 'JAMMU & KASHMIR') {
            Error_Msg = 'LM_ERR: Restricted States';
        }
        if (this.prepared_request['communication_state'] === 'MANIPUR' || this.prepared_request['communication_state'] === 'MEGHALAYA' || this.prepared_request['communication_state'] === 'MIZORAM') {
            Error_Msg = 'LM_ERR: Restricted States';
        }
        if (this.prepared_request['communication_state'] === 'NAGALAND' || this.prepared_request['communication_state'] === 'SIKKIM' || this.prepared_request['communication_state'] === 'TRIPURA') {
            Error_Msg = 'LM_ERR: Restricted States';
        }
        //var objPremiumVerification = this.premium_verification(this.lm_request['final_premium'], objResponseJson['grossPremium']);
        if (Error_Msg === 'NO_ERR') {
            var final_premium = objResponseJson['grossPremium'] - 0;
            var objPremiumVerification = this.premium_verification(this.lm_request['final_premium'], final_premium);
            let dhfl_pg_ack_url = "";
            if (config.environment.name === 'Production') {
                dhfl_pg_ack_url = "https://horizon.policyboss.com/transaction-status/" + this.lm_request['udid'] + '/' + this.lm_request['crn'] + '/' + this.lm_request['proposal_id'];
            } else {
                dhfl_pg_ack_url = this.const_payment.pg_ack_url;
                //dhfl_pg_ack_url = 'http://localhost:7000/transaction-status/' + this.lm_request['udid'] + '/' + this.lm_request['crn'] + '/' + this.lm_request['proposal_id'];
            }
            if (objPremiumVerification.Status) {
                var tid = '1562142022849';
                var order_id = objResponseJson['data'];
                var amount = Math.round(final_premium).toFixed(2);
                var currency_code = 'INR';
                var redirect_url = dhfl_pg_ack_url;
                var cancel_url = dhfl_pg_ack_url;
                var language = 'EN';
                var billing_name = this.processed_request['___first_name___'];
                var billing_address = this.processed_request['___communication_address___'];
                var billing_city = this.processed_request['___communication_city___'];
                var billing_state = this.processed_request['___communication_state___'];
                var billing_zip = this.processed_request['___communication_pincode___'];
                var billing_country = 'India';
                var billing_tel = this.processed_request['___mobile___'];
                var billing_email = this.processed_request['___email___'];
                var delivery_name = this.processed_request['___first_name___'];
                var delivery_address = this.processed_request['___communication_address___'];
                var delivery_city = this.processed_request['___communication_city___'];
                var delivery_state = this.processed_request['___communication_state___'];
                var delivery_zip = this.processed_request['___communication_pincode___'];
                var delivery_country = 'India';
                var delivery_tel = this.processed_request['___mobile___'];
                var merchant_param1 = 'landmark';
                var merchant_param2 = '';
                var merchant_param3 = '';
                var merchant_param4 = '';
                var merchant_param5 = '';
                var promo_code = '';
                var customer_identifier = '';

                var plainText = "order_id=" + order_id + "&currency=" + currency_code +
                        "&amount=" + amount + "&redirect_url=" + encodeURIComponent(redirect_url) + "&cancel_url=" + encodeURIComponent(cancel_url) +
                        "&language=" + language + "&billing_name=" + billing_name + "&billing_address=" + billing_address + "&billing_city=" + billing_city +
                        "&billing_zip=" + billing_zip + "&billing_country=" + billing_country + "&billing_tel=" + billing_tel + "&billing_email=" + encodeURIComponent(billing_email) +
                        "&merchant_param1=landmark&merchant_param2=" + merchant_param2 + "&merchant_param3=" + merchant_param3 + "&merchant_param4=" + merchant_param4 +
                        "&merchant_param5=" + merchant_param5;
                console.log("DHFL plainText : ", plainText);

                if (config.environment.name === 'Production') {
                    var workingKey = "EGI6AJDXRAAE6JI1RYRT0213ZS9BTW53"; //Productiom
                } else {
                    var workingKey = "YEXULYSIBSHRBKCWKTVJCICZSLTKWNXM"; //UAT
                }
                var m = crypto.createHash('md5');
                m.update(workingKey);
                var key = m.digest();
                var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
                var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
                var encoded = cipher.update(plainText, 'utf8', 'hex');
                encoded += cipher.final('hex');
                console.log('Encode-Code:- ' + encoded);
                if (config.environment.name === 'Production') {
                    var pg_data = {
                        'enc_request': encoded,
                        'access_code': 'OPMED4OM2U05LCQQIX'  //Productiom
                    };
                } else {
                    var pg_data = {
                        'enc_request': encoded,
                        'access_code': 'SAKAJZRLERONTDYBLY' //UAT
                    };
                }
                objServiceHandler.Payment.pg_data = pg_data;
                objServiceHandler.Payment.pg_data_plain = plainText;
                objServiceHandler.Payment.pg_redirect_mode = 'POST';
                objServiceHandler.Insurer_Transaction_Identifier = objResponseJson['data'];
            } else {
                Error_Msg = 'LM_PREMIUM_MISMATCH_' + JSON.stringify(objPremiumVerification);
            }
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.error('Exception', this.constructor.name, 'proposal_response_handler', objServiceHandler);
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
DhflMotor.prototype.pg_response_handler = function () {
    ///status=fail&enc_response=Access_code: Invalid Parameter&error_code=3112
    //status=success&enc_response=63957FB55DD6E7B968A7588763E0&error_code=
    //status=aborted&enc_response=Access_code: Invalid Parameter&error_code=3112
    //SUCCESS if status = success
    var objInsurerProduct = this;
    this.const_policy.transaction_status = '';
    try {
        if (objInsurerProduct.lm_request.pg_post['status'] === 'success') {
            var enc_response = objInsurerProduct.lm_request.pg_post['enc_response'];
            if (config.environment.name === 'Production') {
                var workingKey = "EGI6AJDXRAAE6JI1RYRT0213ZS9BTW53"; //Productiom
            } else {
                var workingKey = "YEXULYSIBSHRBKCWKTVJCICZSLTKWNXM"; //UAT
            }
            var m = crypto.createHash('md5');
            m.update(workingKey);
            var key = m.digest();
            var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';
            var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
            var decoded = decipher.update(enc_response, 'hex', 'utf8');
            decoded += decipher.final('utf8');
            var last = decoded.slice(-1);
            console.log('Decode_last-Code:- ' + last);
            if (last === "&") {
                decoded = decoded.substring(0, decoded.length - 1);
            }
            console.log('Decode-Code:- ' + decoded);
            var msg = decoded.replace(/"/g, '\\""').replace(/&/g, '","').replace(/=/g, '":"');
            console.log('Decode1-Code:- ' + msg);
            let payResp = JSON.parse('{"' + msg + '"}');
            this.const_policy.pg_status = 'SUCCESS';
            this.const_policy.transaction_id = payResp['partner_order_id'];
            this.const_policy.transaction_amount = payResp['amount'];
            this.const_policy.transaction_date = new Date();
            this.const_policy.pg_reference_number_1 = payResp['order_id'];
            this.const_policy.pg_reference_number_2 = payResp['bank_transaction_id'];
            this.const_policy.pg_reference_number_3 = payResp['created_at'];
            this.const_policy.pg_reference_number_4 = payResp['payment_id'];
            console.log("pg_response_handler dhfl - success : ");

        } else {
            this.const_policy.pg_status = 'FAIL';
            this.const_policy.transaction_status = 'FAIL';
            console.log("pg_response_handler dhfl - fail : ");
        }
        console.log("pg_response_handler dhfl - success/fail : ");
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
DhflMotor.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    let objInsurerProduct = this;
    let objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    try {


        var Error_Msg = 'NO_ERR';
        //this.const_policy.pg_status = 'SUCCESS';
        if (objInsurerProduct.prepared_request.pg_status === 'FAIL') {

        }
        if (objInsurerProduct.prepared_request.pg_status === 'SUCCESS') {
            if (objResponseJson['code'] !== 1) {
                if (objResponseJson.hasOwnProperty('message')) {
                    if (objResponseJson['data'].hasOwnProperty('err')) {
                        Error_Msg = objResponseJson['data']['err'];
                    } else {
                        Error_Msg = objResponseJson['data']['error'];
                    }
                } else {
                    Error_Msg = objResponseJson['message'];
                }
            }

            if (Error_Msg === 'NO_ERR') {
                if (objResponseJson.hasOwnProperty('data') && objResponseJson['data'].hasOwnProperty('policy_number') && objResponseJson['data']['policy_number'] !== '') {
                    //objResponseJson = JSON.parse('{"code":1,"message":"success","data":{"policy_number":"20700000412\/00\/000000\/0","pdf_url":"http:\/\/devapi.dhflgi.com\/dhflgip\/api\/pdf\/policy\/5170000112\/20700000412-00-000000-0\/17b8bcb33a2d00769152f7dc17bb63715436b779ee2afdabb464b35149975b2a"}}');
                    objInsurerProduct.const_policy.policy_number = objResponseJson['data']['policy_number'];
                    objInsurerProduct.const_policy.transaction_status = 'SUCCESS';
                    let insurer_pdf_url = objResponseJson['data']['pdf_url'];
                    var product_name = 'CAR';
                    if (objInsurerProduct.lm_request['product_id'] === 10) {
                        product_name = 'TW';
                    }
                    let policy_pdf_name = (objResponseJson['data']['policy_number']).replaceAll('/', '');
                    let pdf_file_name = this.constructor.name + '_' + product_name + '_' + policy_pdf_name + '.pdf';
                    let pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                    let pdf_web_path_horizon = config.environment.weburl + "/pdf/" + pdf_file_name;
                    let pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    //let pdf_web_path_portal = config.environment.weburl + config.pb_config.pdf_web_loc + pdf_file_name;
                    objInsurerProduct.const_policy.policy_url = pdf_web_path_portal;
                    objInsurerProduct.const_policy.insurer_pdf_url = insurer_pdf_url;
                    objInsurerProduct.pdf_call(insurer_pdf_url, pdf_sys_loc_horizon);
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
        this.const_policy.transaction_status = 'PAYPASS';
        objServiceHandler.Policy = objInsurerProduct.const_policy;
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
DhflMotor.prototype.status_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'status_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Recon_Reference_Number': null,
        'Data': null,
        'Pg_Status': null
    };
    try {
        var Error_Msg = 'NO_ERR';
        if (objResponseJson.hasOwnProperty('error')) {
            Error_Msg = objResponseJson['message'];
        }
        if (Error_Msg === 'NO_ERR') {

            objServiceHandler['Data'] = objResponseJson;
            objServiceHandler['Recon_Reference_Number'] = objResponseJson.Order_Lookup_Result.order_Status_List.order[0]['order_no'];
            objServiceHandler['Pg_Status'] = "SUCCESS";
        } else {
            objServiceHandler['Pg_Status'] = "FAIL";
        }
        objServiceHandler['Error_Msg'] = Error_Msg;
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
DhflMotor.prototype.pdf_call = function (url, pdf_sys_loc_horizon) {
    try {
        let objInsurerProduct = this;
        objInsurerProduct.pdf_attempt++;
        let Client = require('node-rest-client').Client;
        let client = new Client();
        client.get(url, function (data, response) {
            fs.writeFile(pdf_sys_loc_horizon, data, 'binary', function (err) {
                if (err)
                    console.log(err);
                else
                    console.log("The file was saved!");
            });

        });
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pdf_call', ex);
    }
};
DhflMotor.prototype.pdf_response_handler = function (objResponseJson) {
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
                //var pdf_web_path_portal = config.environment.weburl + config.pb_config.pdf_web_loc + pdf_file_name;
                var binary = new Buffer(objPremiumService, 'base64');
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
        return objServiceHandler;
    }
};
DhflMotor.prototype.encrypt = function (plainText, workingKey) {
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
DhflMotor.prototype.decrypt = function (encText, workingKey) {
    var decoded = '';
    try {
        var m = crypto.createHash('md5');
        m.update(workingKey);
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
DhflMotor.prototype.vehicle_age_year = function () {
    var age_in_year = 0;
    try {
        var moment = require('moment');
        console.log('Start', this.constructor.name, 'vehicle_age_year');
        var vehicle_manf_date = this.lm_request['vehicle_registration_date'];
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
DhflMotor.prototype.lv_quote_no = function () {
    try {
        return this.create_guid('', 'numeric', 7);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'lv_quote_no', ex);
        return 0;
    }
};
DhflMotor.prototype.premium_breakup_schema = {
    "own_damage": {
        "od_basic": 'Basic_Own_Damage',
        "od_elect_access": '',
        "od_non_elect_access": '',
        "od_cng_lpg": '',
        "od_disc_ncb": 'NCB_Discount',
        "od_disc_vol_deduct": '',
        "od_disc_anti_theft": '',
        "od_disc_aai": '',
        "od_loading": '',
        "od_disc": '', //Discount
        "od_final_premium": 0
    },
    "liability": {
        "tp_basic": 'Basic_Liability',
        "tp_cover_owner_driver_pa": 'Owner_Driver',
        "tp_cover_unnamed_passenger_pa": 'Unnamed_Passengers',
        "tp_cover_named_passenger_pa": '',
        "tp_cover_paid_driver_pa": 'Paid_drivers,_cleaners_and_conductors',
        "tp_cover_paid_driver_ll": 'Legal_Liability_for_paid_driver/cleaner/conductor',
        "tp_cng_lpg": '',
        "tp_final_premium": ''
    },
    "addon": {
        "addon_zero_dep_cover": 'Zero_Dep_Cover',
        "addon_road_assist_cover": 'Roadside_Assistance',
        "addon_ncb_protection_cover": 'NCB_(No_Claim_Bonus)_Secure',
        "addon_engine_protector_cover": 'Engine_Protector',
        "addon_invoice_price_cover": 'New_Vehicle_for_Old_Vehicle',
        "addon_key_lock_cover": 'Key_&_Lock_Replacement',
        "addon_consumable_cover": 'Consumable_Expenses',
        "addon_daily_allowance_cover": 'Daily_Conveyance_Allowance',
        "addon_windshield_cover": null,
        "addon_passenger_assistance_cover": 'PassengerAssistCoverValue',
        "addon_tyre_coverage_cover": 'Tyre_Replacement',
        "addon_personal_belonging_loss_cover": 'Personal_Belongings_Protector',
        "addon_inconvenience_allowance_cover": null,
        "addon_medical_expense_cover": 'Accidental_Hospitalization',
        "addon_hospital_cash_cover": 'Hospi_cash',
        "addon_ambulance_charge_cover": null,
        "addon_rodent_bite_cover": null,
        "addon_losstime_protection_cover": null,
        "addon_hydrostatic_lock_cover": null,
        "addon_final_premium": 0
    },
    "net_premium": '',
    "service_tax": '',
    "final_premium": ''
};
module.exports = DhflMotor;