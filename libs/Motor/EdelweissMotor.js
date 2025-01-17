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
var excel = require('excel4node');
function EdelweissMotor() {

}
util.inherits(EdelweissMotor, Motor);
EdelweissMotor.prototype.lm_request_single = {};
EdelweissMotor.prototype.insurer_integration = {};
EdelweissMotor.prototype.insurer_addon_list = [];
EdelweissMotor.prototype.insurer = {};
EdelweissMotor.prototype.pdf_attempt = 0;
EdelweissMotor.prototype.insurer_date_format = 'dd/MM/yyyy';
EdelweissMotor.prototype.insurer_product_api_pre = function () {
};
EdelweissMotor.prototype.insurer_product_field_process_pre = function () {
    try {
        var is_tp_only = false;
        if (this.prepared_request.hasOwnProperty('vehicle_insurance_subtype') && this.prepared_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
            is_tp_only = true;
        }
        if (is_tp_only && this.lm_request['is_breakin'] === "yes" && this.lm_request['product_id'] === 1 && this.lm_request['vehicle_insurance_type'] === "renew") {
            var today_date = new Date(this.todayDate());
            var pol_end_date = new Date();
            pol_end_date.setDate(pol_end_date.getDate() + 1);
            //pol_end_date.setDate(today_date.getDate() + 1);
            pol_end_date.setFullYear(today_date.getFullYear() + 1);
            pol_end_date = this.date_format(pol_end_date, 'dd-MM-yyyy');
            this.prepared_request['policy_end_date'] = pol_end_date;
            this.processed_request['___policy_end_date___'] = pol_end_date;
        }

        this.prepared_request['vehicle_normal_idv_2yrs'] = 0;
        this.processed_request['___vehicle_normal_idv_2yrs___'] = 0;
        this.prepared_request['vehicle_normal_idv_3yrs'] = 0;
        this.processed_request['___vehicle_normal_idv_3yrs___'] = 0;
        //this.prepared_request['policy_number_generat'] = 0;
        //this.processed_request['___policy_number_generate___'] = 0;

        if (this.lm_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
            this.prepared_request['vehicle_expected_idv'] = 0;
            this.processed_request['___vehicle_expected_idv___'] = 0;
        }
        if (this.lm_request['method_type'] !== 'Idv') {
            var slab = 0;
            var Idv = 0;
            var vehicle_age = this.vehicle_age_year();
            if (this.lm_request['vehicle_insurance_type'] === 'new' && this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP') {
                var Vehicle_Depreciation_Rate = {
                    'Age_0': '100.00',
                    'Age_1': '84.000',
                    'Age_2': '87.500',
                    'Age_3': '85.714',
                    'Age_4': '83.333',
                    'Age_5': '88.000',
                    'Age_6': '84.091',
                    'Age_7': '81.081'
                };
            } else {
                var Vehicle_Depreciation_Rate = {
                    'Age_0': '95.00',
                    'Age_1': '84.000',
                    'Age_2': '80.000',
                    'Age_3': '70.000',
                    'Age_4': '60.000',
                    'Age_5': '50.000',
                    'Age_6': '45.000',
                    'Age_7': '40.000',
                    'Age_8': '36.500',
                    'Age_9': '32.800',
                    'Age_10': '29.500'
                };
            }
            if (this.lm_request['vehicle_insurance_type'] === 'new' && this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP') {

                slab = parseFloat(Vehicle_Depreciation_Rate['Age_' + vehicle_age]);
                //if (vehicle_age === 0) {
                //    Idv = parseFloat((this.processed_request['___vehicle_expected_idv___'] * slab) / 100);
                //} else {
                Idv = parseFloat(this.prepared_request['vehicle_expected_idv']);
                var Idv_2yrs = parseFloat((Idv * 84.000) / 100);
                var Idv_3yrs = parseFloat((Idv_2yrs * 87.500) / 100);
                var Idv_4yrs = parseFloat((Idv_3yrs * 85.714) / 100);
                this.prepared_request['vehicle_normal_idv_2yrs'] = Idv_2yrs;
                this.processed_request['___vehicle_normal_idv_2yrs___'] = Idv_2yrs;
                this.prepared_request['vehicle_normal_idv_3yrs'] = Idv_3yrs;
                this.processed_request['___vehicle_normal_idv_3yrs___'] = Idv_3yrs;
            } else {
                this.prepared_request['vehicle_normal_idv_2yrs'] = 0;
                this.processed_request['___vehicle_normal_idv_2yrs___'] = 0;
                this.prepared_request['vehicle_normal_idv_3yrs'] = 0;
                this.processed_request['___vehicle_normal_idv_3yrs___'] = 0;
            }

        }

        if (this.lm_request['method_type'] === 'Premium') {
            this.prepared_request['dbmaster_insurer_vehicle_insurer_segmant'] = this.get_vehicle_bodytype(this.prepared_request['dbmaster_insurer_vehicle_insurer_segmant']);
            this.processed_request['___dbmaster_insurer_vehicle_insurer_segmant___'] = this.prepared_request['dbmaster_insurer_vehicle_insurer_segmant'];
            var cubic_capacity = parseInt(this.processed_request['___dbmaster_insurer_vehicle_cubiccapacity___']); //parseInt(this.processed_request['___dbmaster_pb_cubic_capacity___']);
            var vehicle_age = this.vehicle_age_year();
            var rto_zone = this.processed_request['___dbmaster_insurer_rto_zone_code___']; //this.processed_request['___dbmaster_pb_vehicletariff_zone___'];
            var vehicle_cc_slab_1 = 0;
            var vehicle_age1 = 0;
            var arr_cc_1 = [1000, 1500, 8000];
            var arr_age = [5, 10, 20];
            for (var k in arr_cc_1) {
                if (cubic_capacity < arr_cc_1[k]) {
                    vehicle_cc_slab_1 = arr_cc_1[k];
                    break;
                }
            }
            for (var k in arr_age) {
                if (vehicle_age < arr_age[k]) {
                    vehicle_age1 = arr_age[k];
                    break;
                }
            }
            var obj_basicod = [
                {'zone': 'A', 'vehicle_age': 5, 'cubic_capacity': 1000, 'premium_rate': 3.127},
                {'zone': 'A', 'vehicle_age': 10, 'cubic_capacity': 1000, 'premium_rate': 3.283},
                {'zone': 'A', 'vehicle_age': 20, 'cubic_capacity': 1000, 'premium_rate': 3.362},
                {'zone': 'A', 'vehicle_age': 5, 'cubic_capacity': 1500, 'premium_rate': 3.283},
                {'zone': 'A', 'vehicle_age': 10, 'cubic_capacity': 1500, 'premium_rate': 3.447},
                {'zone': 'A', 'vehicle_age': 20, 'cubic_capacity': 1500, 'premium_rate': 3.529},
                {'zone': 'A', 'vehicle_age': 5, 'cubic_capacity': 8000, 'premium_rate': 3.440},
                {'zone': 'A', 'vehicle_age': 10, 'cubic_capacity': 8000, 'premium_rate': 3.612},
                {'zone': 'A', 'vehicle_age': 20, 'cubic_capacity': 8000, 'premium_rate': 3.698},
                {'zone': 'B', 'vehicle_age': 5, 'cubic_capacity': 1000, 'premium_rate': 3.039},
                {'zone': 'B', 'vehicle_age': 10, 'cubic_capacity': 1000, 'premium_rate': 3.191},
                {'zone': 'B', 'vehicle_age': 20, 'cubic_capacity': 1000, 'premium_rate': 3.267},
                {'zone': 'B', 'vehicle_age': 5, 'cubic_capacity': 1500, 'premium_rate': 3.191},
                {'zone': 'B', 'vehicle_age': 10, 'cubic_capacity': 1500, 'premium_rate': 3.351},
                {'zone': 'B', 'vehicle_age': 20, 'cubic_capacity': 1500, 'premium_rate': 3.430},
                {'zone': 'B', 'vehicle_age': 5, 'cubic_capacity': 8000, 'premium_rate': 3.343},
                {'zone': 'B', 'vehicle_age': 10, 'cubic_capacity': 8000, 'premium_rate': 3.510},
                {'zone': 'B', 'vehicle_age': 20, 'cubic_capacity': 8000, 'premium_rate': 3.594}
            ];
            var index = obj_basicod.findIndex(x => x.zone === rto_zone && x.cubic_capacity === vehicle_cc_slab_1 && x.vehicle_age === vehicle_age1);
            this.prepared_request['od_tarrif_rate'] = obj_basicod[index]['premium_rate'];
            this.processed_request['___od_tarrif_rate___'] = this.prepared_request['od_tarrif_rate'];
        }
        // For Razorpay Wallet 
        if (this.lm_request['method_type'] === 'Proposal' && this.lm_request.hasOwnProperty('pay_from')) {
            this.prepared_request['pay_from'] = "wallet";
            this.processed_request['___pay_from___'] = this.prepared_request['pay_from'];
        }
        if (this.lm_request['method_type'] === 'Verification' || this.lm_request['method_type'] === 'Proposal') {
            if (this.lm_request['method_type'] === 'Proposal' && this.lm_request['nominee_relation'] === 'Others') {
                this.prepared_request['nominee_relation'] = this.lm_request['nominee_other_relation'];
                this.processed_request['___nominee_relation___'] = this.prepared_request['nominee_relation'];
            }
            this.prepared_request['vehicle_normal_idv'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['vehicle_normal_idv'];
            this.processed_request['___vehicle_normal_idv___'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['vehicle_normal_idv'];
            if (this.lm_request['method_type'] === 'Proposal') {
                this.prepared_request['own_damage_disc_rate'] = parseInt(this.processed_request['___dbmaster_insurer_transaction_identifier___']);
                this.processed_request['___own_damage_disc_rate___'] = parseInt(this.processed_request['___dbmaster_insurer_transaction_identifier___']);
            } else {
                this.prepared_request['own_damage_disc_rate'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['own_damage_disc_rate'];
                this.processed_request['___own_damage_disc_rate___'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['own_damage_disc_rate'];
            }
            this.prepared_request['dbmaster_insurer_vehicle_exshowroom'] = this.insurer_master['service_logs']['insurer_db_master']['LM_Custom_Request']['dbmaster_insurer_vehicle_exshowroom'];
            this.processed_request['___dbmaster_insurer_vehicle_exshowroom___'] = this.insurer_master['service_logs']['insurer_db_master']['LM_Custom_Request']['dbmaster_insurer_vehicle_exshowroom'];
            /*
             this.prepared_request['addon_mandatory_deduction_protect'] = this.prepared_request['addon_mandatory_deduction_protect'];
             this.processed_request['___addon_mandatory_deduction_protect___'] = this.prepared_request['addon_mandatory_deduction_protect'];
             this.prepared_request['addon_mandatory_deduction_protect_amt'] = this.prepared_request['addon_mandatory_deduction_protect_amt'];
             this.processed_request['___addon_mandatory_deduction_protect_amt___'] = this.prepared_request['addon_mandatory_deduction_protect_amt'];
             */
            if (this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['vehicle_normal_idv'] === null || this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['vehicle_normal_idv'] === undefined)
            {
                this.prepared_request['vehicle_normal_idv'] = 0;
                this.processed_request['___vehicle_normal_idv___'] = 0;
                this.prepared_request['own_damage_disc_rate'] = 0;
                this.processed_request['___own_damage_disc_rate___'] = 0;
            }
            if (this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['own_damage_disc_rate'] === null || this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['own_damage_disc_rate'] === undefined)
            {
                this.prepared_request['vehicle_normal_idv'] = 0;
                this.processed_request['___vehicle_normal_idv___'] = 0;
                this.prepared_request['own_damage_disc_rate'] = 0;
                this.processed_request['___own_damage_disc_rate___'] = 0;
            }
            if (this.lm_request['vehicle_insurance_subtype'] === '1OD_0TP' && this.lm_request['method_type'] === 'Proposal') {
                var saod_tp_policy_tenure = this.saod_tp_policy_tenure(this.lm_request['tp_start_date'], this.lm_request['tp_end_date']);
                this.prepared_request['saod_tp_policy_tenure'] = saod_tp_policy_tenure;
                this.processed_request['___saod_tp_policy_tenure___'] = saod_tp_policy_tenure;
            }
        }
        if (this.lm_request['method_type'] === 'Verification') {
            if (false && this.lm_request.hasOwnProperty('ui_source') && this.lm_request['ui_source'] === 'quick_tw_journey') {
                var date = moment().format('DD/MM/YYYY');
                this.prepared_request['pg_reference_number_1'] = date;
                this.processed_request['___pg_reference_number_1___'] = date;
            } else {
                if (this.processed_request['___pg_reference_number_1___'] !== null) {
                    var res_year = (this.processed_request['___pg_reference_number_1___']).split("-");
                    var res_date = res_year[2].split(" ");
                    var date = res_date[0] + "/" + res_year[1] + "/" + res_year[0];
                    this.prepared_request['pg_reference_number_1'] = date;
                    this.processed_request['___pg_reference_number_1___'] = date;
                }
            }
            this.prepared_request['addon_zero_dep_cover'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['addon_zero_dep_cover'];
            this.processed_request['___addon_zero_dep_cover___'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['addon_zero_dep_cover'];
            this.prepared_request['addon_invoice_price_cover'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['addon_invoice_price_cover'];
            this.processed_request['___addon_invoice_price_cover___'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['addon_invoice_price_cover'];
            this.prepared_request['addon_consumable_cover'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['addon_consumable_cover'];
            this.processed_request['___addon_consumable_cover___'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['addon_consumable_cover'];
            this.prepared_request['addon_personal_belonging_loss_cover'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['addon_personal_belonging_loss_cover'];
            this.processed_request['___addon_personal_belonging_loss_cover___'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['addon_personal_belonging_loss_cover'];
            this.prepared_request['addon_engine_protector_cover'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['addon_engine_protector_cover'];
            this.processed_request['___addon_engine_protector_cover___'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['addon_engine_protector_cover'];
            this.prepared_request['addon_key_lock_cover'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['addon_key_lock_cover'];
            this.processed_request['___addon_key_lock_cover___'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['addon_key_lock_cover'];
            this.prepared_request['addon_road_assist_cover'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['addon_road_assist_cover'];
            this.processed_request['___addon_road_assist_cover___'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['addon_road_assist_cover'];
            this.prepared_request['addon_ncb_protection_cover'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['addon_ncb_protection_cover'];
            this.processed_request['___addon_ncb_protection_cover___'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['addon_ncb_protection_cover'];
            this.prepared_request['addon_mandatory_deduction_protect'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['addon_mandatory_deduction_protect'];
            this.processed_request['___addon_mandatory_deduction_protect___'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['addon_mandatory_deduction_protect'];

            if (this.lm_request['vehicle_insurance_subtype'] === '1OD_0TP') {
                this.prepared_request['tp_insurer_name'] = this.insurer_master.tp_insurer.pb_db_master['Insurer_Name'];
                this.processed_request['___tp_insurer_name___'] = this.prepared_request['tp_insurer_name'];
                this.prepared_request['saod_tp_policy_tenure'] = this.proposal_processed_request['___saod_tp_policy_tenure___'];
                this.processed_request['___saod_tp_policy_tenure___'] = this.prepared_request['saod_tp_policy_tenure'];
            }
        }
        if (this.lm_request['method_type'] === 'Pdf') {
            this.lm_request['transaction_id'] = isNaN(this.lm_request['transaction_id']) ? (this.lm_request['transaction_pg'] ? this.lm_request['transaction_pg'] : this.lm_request['transaction_id']) : this.lm_request['transaction_id'];
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_product_field_process_pre', ex);
    }
};
EdelweissMotor.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
EdelweissMotor.prototype.insurer_product_field_process_post = function () {

    console.log("insurer_product_api_post");
};
EdelweissMotor.prototype.insurer_product_api_post = function () {

    console.log("insurer_product_api_post");
};
EdelweissMotor.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    try {
        var objInsurerProduct = this;
        var product_id = objProduct.db_specific_product.Product_Id; //
        var insurer_id = Insurer_Object.Insurer_ID;
        var soap = require('soap');
        var xml2js = require('xml2js');
        var Client = require('node-rest-client').Client;
        var client = new Client();
        console.log("EdelweissMotor service_call : ", specific_insurer_object.method.Method_Type, " :: ", docLog.Insurer_Request);
        var args = {};
        var service_method_url = '';
        if (specific_insurer_object.method.Method_Type === 'Proposal') {
            service_method_url = config.environment.weburl + '/quote/edelweiss/proposal?Product_Id=' + product_id + '&CRN=' + objInsurerProduct.lm_request['crn'];
            console.error('DBG', 'Edelweiss', 'service_method_url', service_method_url);
        } else if (false && specific_insurer_object.method.Method_Type === 'Verification' && ((objInsurerProduct.const_payment_response.hasOwnProperty('pg_data') && objInsurerProduct.const_payment_response['pg_data'].hasOwnProperty('pg_type') && objInsurerProduct.const_payment_response['pg_data']['pg_type'] === "rzrpay") || (objInsurerProduct.proposal_processed_request.hasOwnProperty('___pay_from___') && objInsurerProduct.proposal_processed_request['___pay_from___'] === "wallet"))) {
            try {
                let pay_id = "";
                if (objInsurerProduct.proposal_processed_request.hasOwnProperty('___pay_from___') && objInsurerProduct.proposal_processed_request['___pay_from___'] === "wallet") {
                    pay_id = objInsurerProduct.const_payment_response.pg_post.txnid;
                } else {
                    pay_id = objInsurerProduct.const_payment_response.pg_get.PayId;
                }
                service_method_url = "https://api.razorpay.com/v1/payments/" + pay_id;
                var username = config.razor_pay.rzp_edelweiss.username;
                var secret_key = config.razor_pay.rzp_edelweiss.password;
                args = {
                    headers: {
                        "Accept": "application/json",
                        'Authorization': 'Basic ' + new Buffer(username + ':' + secret_key).toString('base64')
                    }
                };
            } catch (ex) {
                console.error('Razorpay Service Call Error: ', this.constructor.name, ex);
            }
        } else {
            service_method_url = config.environment.weburl;
        }
        client.get(service_method_url, args, function (data, response) {
            if (specific_insurer_object.method.Method_Type === 'Proposal') {
                console.error('DBG', 'Proposal', data);
            }
            var objResponseFull = {
                'err': null,
                'result': data,
                'raw': '',
                'soapHeader': null,
                'objResponseJson': data
            };
            var serviceBreakup = objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
            if (specific_insurer_object.method.Method_Type === 'Idv') {
                objInsurerProduct.insurer_vehicle_idv_handler(serviceBreakup, objProduct, Insurer_Object, specific_insurer_object);
            }
        });
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};
EdelweissMotor.prototype.idv_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'idv_response_handler', objResponseJson);
};
EdelweissMotor.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    //var objPremiumService = objResponseJson;
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (this.lm_request['product_id'] === 1 && this.lm_request['vehicle_insurance_subtype'] === '0CH_1TP') {
            var Edelweiss_TP_Guidelines = fs.readFileSync(appRoot + '/resource/request_file/Edelweiss_TP_Guidelines.json').toString();
            //var sleep = require('system-sleep');
            //sleep(5000);
            var tp_basic = 0;
            let code_rto = this.processed_request['___dbmaster_insurer_rto_code___'].split("-");
            code_rto = code_rto[0] + code_rto[1];
            let code_make = this.processed_request['___dbmaster_insurer_vehicle_make_name___'];
            let name_fuel = this.processed_request['___dbmaster_insurer_vehicle_fueltype___'];
            var cubic_capacity = parseInt(this.processed_request['___dbmaster_insurer_vehicle_cubiccapacity___']);

            var vehicle_cc_slab = 0;
            var arr_cc = [1000, 1500, 8000];

            for (var k in arr_cc) {
                if (cubic_capacity < arr_cc[k]) {
                    vehicle_cc_slab = arr_cc[k];
                    break;
                }
            }
            var cc_value = vehicle_cc_slab + " CC";

            var Edelweiss_TP_Guideline = JSON.parse(Edelweiss_TP_Guidelines);
            var index = Edelweiss_TP_Guideline.findIndex(x => x.Make_Name === code_make && x.RTO_Code === code_rto && x.Fuel_Type === name_fuel && x.CC_Group === cc_value);
            if (index > -1) {
                console.log("TP Guidelines - Success");
            } else {
                Error_Msg = "Vehicle not allowed";
                console.log("TP Guidelines - Failure");
            }
        }

        var addon_vehicle_age = this.addon_vehicle_age_year();
        var Edelweiss_TW_Guidelines = fs.readFileSync(appRoot + '/resource/request_file/Edelweiss_TW_Guidelines.json').toString();
        var Edelweiss_TopCity_Guidelines = fs.readFileSync(appRoot + '/resource/request_file/Edelweiss_TW_TopCity_Guidelines.json').toString();
        var edel_decline_file = fs.readFileSync(appRoot + '/resource/request_file/EdelweissMotor_1_Decline_List.json').toString();
        var discount_edelData = fs.readFileSync(appRoot + '/resource/request_file/Edelweiss_Discount_Structure.json').toString();
        var Edelweiss_Car_RTO_File = fs.readFileSync(appRoot + '/resource/request_file/Edelweiss_Car_RTO_Decline.json').toString();
        //var sleep = require('system-sleep');
        //sleep(5000);
        let code_rto = this.processed_request['___dbmaster_insurer_rto_code___'];
        discount_edelData = JSON.parse(discount_edelData);
        if (discount_edelData && discount_edelData[0]) {
            discount_edelData = discount_edelData[0];
            var edelData_disc = discount_edelData[this.processed_request['___dbmaster_insurer_vehicle_make_name___']];
            if (edelData_disc && edelData_disc[this.processed_request['___dbmaster_insurer_vehicle_model_name___']]) {
                edelData_disc = edelData_disc[this.processed_request['___dbmaster_insurer_vehicle_model_name___']];
                if (edelData_disc)
                {
                    var edelData_discIndex = edelData_disc.findIndex(function (value) {
                        return value === code_rto;
                    });
                    if (edelData_discIndex > -1) {
                        if (parseFloat(addon_vehicle_age) <= 7.99) {
                            this.prepared_request['own_damage_disc_rate'] = -70;
                            this.processed_request['___own_damage_disc_rate___'] = -70;
                        } else {
                            this.prepared_request['own_damage_disc_rate'] = -75;
                            this.processed_request['___own_damage_disc_rate___'] = -75;
                        }
                    }
                }
            }
        }
        var edel_decline_list = JSON.parse(edel_decline_file);
        var rto_code_decline = code_rto.split('-');

        if (this.lm_request['product_id'] === 10) {
            var new_code_rto = rto_code_decline[0] + rto_code_decline[1];
            var is_top_city_rto = (this.top_new_city_rto.indexOf(new_code_rto) > 1);
            if ((is_top_city_rto && this.lm_request.hasOwnProperty('ui_source') && this.lm_request['ui_source'] === 'quick_tw_journey') || (is_top_city_rto && this.lm_request.hasOwnProperty('agent_source') && this.lm_request['agent_source'] === 'quick_tw_journey')) {
                Error_Msg = 'NO_ERR';
            } else {
                var code_make = this.processed_request['___dbmaster_insurer_vehicle_make_name___'];
                var name_fuel = this.processed_request['___dbmaster_insurer_vehicle_fueltype___'];
                var cubic_capacity = parseInt(this.processed_request['___dbmaster_insurer_vehicle_cubiccapacity___']);

                var vehicle_cc_slab = 0;
                var arr_cc = [75, 150, 350, 3000];

                for (var k in arr_cc) {
                    if (cubic_capacity < arr_cc[k]) {
                        vehicle_cc_slab = arr_cc[k];
                        break;
                    }
                }
                var cc_value = "CC_" + vehicle_cc_slab;
                var Edelweiss_TW_Guideline = JSON.parse(Edelweiss_TW_Guidelines);
                var Edelweiss_TopCity_Guideline = JSON.parse(Edelweiss_TopCity_Guidelines);
                if (Edelweiss_TW_Guideline && Edelweiss_TW_Guideline.length > 0 && Edelweiss_TW_Guideline[0]) {
                    if (this.processed_request['___dbmaster_insurer_vehicle_insurer_segmant___'] == "BIKE") {
                        Edelweiss_TW_Guideline[0] = Edelweiss_TW_Guideline[0][this.processed_request['___dbmaster_insurer_vehicle_insurer_segmant___']];
                        if (Edelweiss_TW_Guideline[0][code_make] && Edelweiss_TW_Guideline[0][code_make][cc_value] && (Edelweiss_TW_Guideline[0][code_make][cc_value]).length > 0 && (Edelweiss_TW_Guideline[0][code_make][cc_value]).indexOf(new_code_rto) > -1) {
                            console.log("TW Guidelines - Success");
                        } else {
                            Error_Msg = "UW Guidelines : Restricted " + new_code_rto + "|" + code_make + "|" + cubic_capacity;
                            console.log("TW Guidelines - Failure");
                        }
                    } else if (this.processed_request['___dbmaster_insurer_vehicle_insurer_segmant___'] == "MOPED" || this.processed_request['___dbmaster_insurer_vehicle_insurer_segmant___'] == "SCOOTER") {
                        Edelweiss_TW_Guideline[0] = Edelweiss_TW_Guideline[0][this.processed_request['___dbmaster_insurer_vehicle_insurer_segmant___']];
                        if (Edelweiss_TW_Guideline[0][code_make] && Edelweiss_TW_Guideline[0][code_make]['RTO'] && (Edelweiss_TW_Guideline[0][code_make]['RTO']).length > 0 && (Edelweiss_TW_Guideline[0][code_make]['RTO']).indexOf(new_code_rto) > -1) {
                            console.log("TW Guidelines - Success");
                        } else {
                            Error_Msg = "UW Guidelines : Restricted " + new_code_rto + "|" + code_make + "|" + cubic_capacity;
                            console.log("TW Guidelines - Failure");
                        }
                    } else {
                        Error_Msg = "UW Guidelines : Restricted " + new_code_rto + "|" + code_make + "|" + cubic_capacity;
                        console.log("TW Guidelines - Failure");
                    }
                } else {
                    Error_Msg = "UW Guidelines : Restricted " + new_code_rto + "|" + code_make + "|" + cubic_capacity;
                    console.log("TW Guidelines - Failure");
                }
                if (false && Error_Msg !== 'NO_ERR' && (this.top_city_rto.indexOf(new_code_rto) > 1)) {
                    if (this.processed_request['___dbmaster_insurer_vehicle_insurer_segmant___'] == "BIKE") {
                        if (Edelweiss_TopCity_Guideline && Edelweiss_TopCity_Guideline.length > 0 && Edelweiss_TopCity_Guideline[0]) {
                            if (Edelweiss_TopCity_Guideline[0][code_make] && Edelweiss_TopCity_Guideline[0][code_make][cc_value] && (Edelweiss_TopCity_Guideline[0][code_make][cc_value]).length > 0 && (Edelweiss_TopCity_Guideline[0][code_make][cc_value]).indexOf(new_code_rto) > -1) {
                                Error_Msg = 'NO_ERR';
                            }
                        }
                    }
                    if (this.processed_request['___dbmaster_insurer_vehicle_insurer_segmant___'] == "MOPED" || this.processed_request['___dbmaster_insurer_vehicle_insurer_segmant___'] == "SCOOTER") {
                        Error_Msg = 'NO_ERR';
                    }
                }
            }
        }

        if (this.processed_request['___dbmaster_insurer_vehicle_make_name___'] === "MARUTI" && this.processed_request['___dbmaster_insurer_vehicle_model_name___'] !== "BALENO") {
            if (parseFloat(addon_vehicle_age) <= 7.99) {
                if (this.prepared_request['dbmaster_insurer_rto_zone_name'] === "South" || this.prepared_request['dbmaster_insurer_rto_zone_name'] === "East" || (this.prepared_request['dbmaster_insurer_rto_zone_name'] === "West" && code_rto !== "GJ-05") || (this.prepared_request['dbmaster_insurer_rto_zone_name'] === "North" && rto_code_decline === "DL")) {
                    this.prepared_request['own_damage_disc_rate'] = -70;
                    this.processed_request['___own_damage_disc_rate___'] = -70;
                }
            } else {
                if (this.prepared_request['dbmaster_insurer_rto_zone_name'] === "South" || this.prepared_request['dbmaster_insurer_rto_zone_name'] === "East" || (this.prepared_request['dbmaster_insurer_rto_zone_name'] === "West" && code_rto !== "GJ-05")) {
                    this.prepared_request['own_damage_disc_rate'] = -75;
                    this.processed_request['___own_damage_disc_rate___'] = -75;
                }
                if ((this.prepared_request['dbmaster_insurer_rto_zone_name'] === "North" && rto_code_decline === "DL") && parseFloat(addon_vehicle_age) <= 10.99) {
                    this.prepared_request['own_damage_disc_rate'] = -70;
                    this.processed_request['___own_damage_disc_rate___'] = -70;
                }
            }
        }
        if (this.processed_request['___dbmaster_insurer_vehicle_make_name___'] === "MARUTI" && this.processed_request['___dbmaster_insurer_vehicle_model_name___'] === "BALENO") {
            if (parseFloat(addon_vehicle_age) <= 10.99) {
                this.prepared_request['own_damage_disc_rate'] = -50;
                this.processed_request['___own_damage_disc_rate___'] = -50;
            }
        }
        if (this.prepared_request['dbmaster_pb_fuel_name'] === "ELECTRIC" || this.prepared_request['dbmaster_pb_fuel_name'] === "Electric") {
            Error_Msg = 'UW Guidelines : Electric Vehicle Restricted';
        }
        if (rto_code_decline[0] === "TN" || rto_code_decline[0] === "AS") {
            Error_Msg = 'UW Guidelines : RTO Restricted';
        }
        if (this.lm_request['product_id'] === 1) {
            rto_code_decline = rto_code_decline[0] + rto_code_decline[1];
            var index = edel_decline_list.findIndex(x => x.Make_Name === this.processed_request['___dbmaster_insurer_vehicle_make_name___'] && x.Model_Name === this.processed_request['___dbmaster_insurer_vehicle_model_name___'] && x.Fuel_Type === this.processed_request['___dbmaster_insurer_vehicle_fueltype___'] && x.RTO_Code === rto_code_decline);
            if (index > -1) {
                Error_Msg = 'UW Guidelines:Vehicle Decline - ' + JSON.stringify(edel_decline_list[index]);
            }
            if (this.lm_request['vehicle_insurance_type'] === 'new' && this.lm_request['product_id'] !== 1) {
                Error_Msg = 'LM_ERR:New Vehicle Not allowed';
            }
            if (this.prepared_request['own_damage_disc_rate'] >= 0) {
                Error_Msg = 'LM_ERR: Vehicle Restricted Due To Discount';
            }

            var edel_rto_decline_list = JSON.parse(Edelweiss_Car_RTO_File);
            if (edel_rto_decline_list && edel_rto_decline_list[0] && edel_rto_decline_list[0]['RTO'] && (edel_rto_decline_list[0]['RTO']).indexOf(this.prepared_request['dbmaster_insurer_rto_code']) > -1)
            {
                Error_Msg = 'UW Guidelines : RTO Restricted';
            } else {
//PB-UW-Start        
                if (this.prepared_request['dbmaster_pb_make_name'] === "MARUTI") {
                    if ((this.prepared_request['dbmaster_pb_model_name'] === "SWIFT DZIRE" || this.prepared_request['dbmaster_pb_model_name'] === "NEW SWIFT" || this.prepared_request['dbmaster_pb_model_name'] === "SWIFT") && this.prepared_request['dbmaster_pb_fuel_name'] === "DIESEL") {
                        Error_Msg = 'UW Guidelines : Vehicle Restricted';
                    }
                    if ((this.prepared_request['dbmaster_pb_model_name'] === "CELERIO" || this.prepared_request['dbmaster_pb_model_name'] === "CELERIO X") && this.prepared_request['dbmaster_pb_fuel_name'] === "CNG") {
                        Error_Msg = 'UW Guidelines : Vehicle Restricted';
                    }
                    if (this.prepared_request['dbmaster_pb_model_name'] === "EECO" || this.prepared_request['dbmaster_pb_model_name'] === "OMNI" || this.prepared_request['dbmaster_pb_model_name'] === "ZEN") {
                        Error_Msg = 'UW Guidelines : Vehicle Restricted';
                    }
                }
                if (this.prepared_request['dbmaster_pb_make_name'] === "HONDA") {
                    if ((this.prepared_request['dbmaster_pb_model_name'] === "AMAZE") && this.prepared_request['dbmaster_pb_fuel_name'] === "DIESEL") {
                        Error_Msg = 'UW Guidelines : Vehicle Restricted';
                    }
                    if ((this.prepared_request['dbmaster_pb_model_name'] === "CITY" || this.prepared_request['dbmaster_pb_model_name'] === "CITY 5TH GEN") && this.prepared_request['dbmaster_pb_fuel_name'] === "DIESEL") {
                        Error_Msg = 'UW Guidelines : Vehicle Restricted';
                    }
                    if (this.prepared_request['dbmaster_pb_model_name'] === "MOBILIO") {
                        Error_Msg = 'UW Guidelines : Vehicle Restricted';
                    }
                }
                if (this.prepared_request['dbmaster_pb_make_name'] === "HYUNDAI") {
                    if (this.prepared_request['dbmaster_pb_model_name'] === "SONATA" || this.prepared_request['dbmaster_pb_model_name'] === "SONATA TRANSFORM") {
                        Error_Msg = 'UW Guidelines : Vehicle Restricted';
                    }
                    if ((this.prepared_request['dbmaster_pb_model_name'] === "VERNA" || this.prepared_request['dbmaster_pb_model_name'] === "VERNA TRANSFORM" || this.prepared_request['dbmaster_pb_model_name'] === "VERNA FLUIDIC" || this.prepared_request['dbmaster_pb_model_name'] === "FLUIDIC VERNA") && this.prepared_request['dbmaster_pb_fuel_name'] === "DIESEL") {
                        Error_Msg = 'UW Guidelines : Vehicle Restricted';
                    }
                    if (this.prepared_request['dbmaster_pb_model_name'] === "GETZ" || this.prepared_request['dbmaster_pb_model_name'] === "GETZ PRIME") {
                        Error_Msg = 'UW Guidelines : Vehicle Restricted';
                    }
                }
//PB-UW-End        
//Insure-UW-Start
                if (this.prepared_request['dbmaster_insurer_vehicle_make_name'] === "MARUTI") {
                    if ((this.prepared_request['dbmaster_insurer_vehicle_model_name'] === "SWIFT DZIRE" || this.prepared_request['dbmaster_insurer_vehicle_model_name'] === "SWIFT DZIRE KB" || this.prepared_request['dbmaster_insurer_vehicle_model_name'] === "SWIFT RANGE EXTENDER" || this.prepared_request['dbmaster_insurer_vehicle_model_name'] === "SWIFT KB" || this.prepared_request['dbmaster_insurer_vehicle_model_name'] === "SWIFT") && this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === "DIESEL") {
                        Error_Msg = 'UW Guidelines : Vehicle Restricted';
                    }
                    if ((this.prepared_request['dbmaster_insurer_vehicle_model_name'] === "CELERIO" || this.prepared_request['dbmaster_insurer_vehicle_model_name'] === "CELERIO X") && this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === "CNG") {
                        Error_Msg = 'UW Guidelines : Vehicle Restricted';
                    }
                    if (this.prepared_request['dbmaster_insurer_vehicle_model_name'] === "EECO" || this.prepared_request['dbmaster_insurer_vehicle_model_name'] === "OMNI" || this.prepared_request['dbmaster_insurer_vehicle_model_name'] === "ZEN" || this.prepared_request['dbmaster_insurer_vehicle_model_name'] === "ZEN ESTILO") {
                        Error_Msg = 'UW Guidelines : Vehicle Restricted';
                    }
                }
                if (this.prepared_request['dbmaster_insurer_vehicle_make_name'] === "HONDA") {
                    if ((this.prepared_request['dbmaster_insurer_vehicle_model_name'] === "AMAZE" || this.prepared_request['dbmaster_insurer_vehicle_model_name'] === "AMAZE(2018)") && this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === "DIESEL") {
                        Error_Msg = 'UW Guidelines : Vehicle Restricted';
                    }
                    if ((this.prepared_request['dbmaster_insurer_vehicle_model_name'] === "CITY" || this.prepared_request['dbmaster_insurer_vehicle_model_name'] === "CITY ZX" || this.prepared_request['dbmaster_insurer_vehicle_model_name'] === "NEW CITY" || this.prepared_request['dbmaster_insurer_vehicle_model_name'] === "CITY 5TH GEN") && this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === "DIESEL") {
                        Error_Msg = 'UW Guidelines : Vehicle Restricted';
                    }
                    if (this.prepared_request['dbmaster_insurer_vehicle_model_name'] === "MOBILIO") {
                        Error_Msg = 'UW Guidelines : Vehicle Restricted';
                    }
                }
                if (this.prepared_request['dbmaster_insurer_vehicle_make_name'] === "HYUNDAI") {
                    if (this.prepared_request['dbmaster_insurer_vehicle_model_name'] === "SONATA" || this.prepared_request['dbmaster_insurer_vehicle_model_name'] === "SONATA EMBERA" || this.prepared_request['dbmaster_insurer_vehicle_model_name'] === "SONATA TRANSFORM") {
                        Error_Msg = 'UW Guidelines : Vehicle Restricted';
                    }
                    if ((this.prepared_request['dbmaster_insurer_vehicle_model_name'] === "VERNA" || this.prepared_request['dbmaster_insurer_vehicle_model_name'] === "FLUIDIC VERNA") && this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === "DIESEL") {
                        Error_Msg = 'UW Guidelines : Vehicle Restricted';
                    }
                    if (this.prepared_request['dbmaster_insurer_vehicle_model_name'] === "GETZ" || this.prepared_request['dbmaster_insurer_vehicle_model_name'] === "GETZ PRIME") {
                        Error_Msg = 'UW Guidelines : Vehicle Restricted';
                    }
                }
//Insurer-UW-End
            }

        }

        //Insurer-UW 23/05/2022 start
        if (false && Error_Msg === 'NO_ERR' && this.lm_request['product_id'] === 1) {
            try {
                //this.prepared_request['Plan_Name']
                var Edelweiss_RTO_Location = fs.readFileSync(appRoot + '/resource/request_file/Edelweiss_Rto_Location.json').toString();
                Edelweiss_RTO_Location = JSON.parse(Edelweiss_RTO_Location);
                let tempCodeRTO = this.processed_request['___dbmaster_insurer_rto_code___'].split('-')[0];
                let locationRTO = Edelweiss_RTO_Location.find(objRTO => objRTO.RTO === rto_code_decline);
                if (locationRTO) {
                    let tempAddon_vehicle_Age = this.addon_vehicle_age_year();
                    let RTO_Location = locationRTO.RTO_Location;
                    let tempMakeName = this.prepared_request['dbmaster_insurer_vehicle_make_name'].toString().toLowerCase();
                    let tempModelName = this.prepared_request['dbmaster_insurer_vehicle_model_name'].toString().toLowerCase();
                    let tempFuelType = this.prepared_request['dbmaster_insurer_vehicle_fueltype'].toString().toLowerCase();
                    let tempVehicleType = this.prepared_request['dbmaster_insurer_vehicle_insurer_segmant'].toString().toLowerCase();
                    //block vehicle
                    if (tempFuelType === 'petrol') {
                        if (['eon'].indexOf(tempModelName) > -1) {
                            if (['MH-Pune', 'DL-All', 'GJ-Ahmedabad_Areas'].indexOf(RTO_Location) > -1) {
                                Error_Msg = 'UW Guidelines : Vehicle Model Restricted';
                            }
                        }
                        if (['i10'].indexOf(tempModelName) > -1) {
                            if (['MH-Pune', 'Delhi-NCR', 'WB-Kolkata', 'GJ-Ahmedabad_Areas'].indexOf(RTO_Location) > -1) {
                                Error_Msg = 'UW Guidelines : Vehicle Model Restricted';
                            }
                        }
                    }
                    if (tempFuelType === 'diesel') {
                        if (['city', 'i20'].indexOf(tempModelName) > -1) {
                            Error_Msg = 'UW Guidelines : Vehicle Model Restricted';
                        }
                        if (['i10'].indexOf(tempModelName) > -1) {
                            if (['DL-All'].indexOf(RTO_Location) > -1) {
                                Error_Msg = 'UW Guidelines : Vehicle Model Restricted';
                            }
                        }
                    }
                    if (Error_Msg === 'NO_ERR') {
                        if (['honda', 'hyundai', 'maruti', 'kia', 'mg'].indexOf(tempMakeName) > -1) {
                            if (this.prepared_request['dbmaster_insurer_rto_zone_name'] === "North") {
                                if (['CH-All', 'DL-All', 'Delhi-NCR', 'JK-All', 'HP-All', 'UK-All'].indexOf(RTO_Location) > -1) {
                                    if (tempFuelType === 'petrol') {
                                        if (this.lm_request['is_claim_exists'] === 'yes') {
                                            this.prepared_request['own_damage_disc_rate'] = -50;
                                            this.processed_request['___own_damage_disc_rate___'] = -50;
                                        } else {
                                            if (parseFloat(tempAddon_vehicle_Age) > 5.80) {
                                                this.prepared_request['own_damage_disc_rate'] = -75;
                                                this.processed_request['___own_damage_disc_rate___'] = -75;
                                            } else {
                                                this.prepared_request['own_damage_disc_rate'] = -65;
                                                this.processed_request['___own_damage_disc_rate___'] = -65;
                                            }
                                        }
                                    }
                                    if ((tempMakeName !== 'mg' && tempFuelType === 'diesel') || (tempMakeName === 'mg' && tempVehicleType === 'suv' && tempFuelType === 'diesel')) {
                                        if (this.lm_request['is_claim_exists'] === 'yes') {
                                            this.prepared_request['own_damage_disc_rate'] = -40;
                                            this.processed_request['___own_damage_disc_rate___'] = -40;
                                        } else {
                                            if (parseFloat(tempAddon_vehicle_Age) > 5.80) {
                                                this.prepared_request['own_damage_disc_rate'] = -70;
                                                this.processed_request['___own_damage_disc_rate___'] = -70;
                                            } else {
                                                this.prepared_request['own_damage_disc_rate'] = -55;
                                                this.processed_request['___own_damage_disc_rate___'] = -55;
                                            }
                                        }
                                    }
                                }
                            }
                            if (this.prepared_request['dbmaster_insurer_rto_zone_name'] === "West") {
                                if (['GJ-Ahmedabad_Areas', 'MH-Mumbai', 'MH-Pune'].indexOf(RTO_Location) > -1) {
                                    if (tempFuelType === 'petrol') {
                                        if (this.lm_request['is_claim_exists'] === 'yes') {
                                            this.prepared_request['own_damage_disc_rate'] = -50;
                                            this.processed_request['___own_damage_disc_rate___'] = -50;
                                        } else {
                                            if (parseFloat(tempAddon_vehicle_Age) > 5.80) {
                                                this.prepared_request['own_damage_disc_rate'] = -85;
                                                this.processed_request['___own_damage_disc_rate___'] = -85;
                                            } else {
                                                this.prepared_request['own_damage_disc_rate'] = -75;
                                                this.processed_request['___own_damage_disc_rate___'] = -75;
                                            }
                                        }
                                    }
                                    if ((tempMakeName !== 'mg' && tempFuelType === 'diesel') || (tempMakeName === 'mg' && tempVehicleType === 'suv' && tempFuelType === 'diesel')) {
                                        if (this.lm_request['is_claim_exists'] === 'yes') {
                                            this.prepared_request['own_damage_disc_rate'] = -45;
                                            this.processed_request['___own_damage_disc_rate___'] = -45;
                                        } else {
                                            if (parseFloat(tempAddon_vehicle_Age) > 5.80) {
                                                this.prepared_request['own_damage_disc_rate'] = -75;
                                                this.processed_request['___own_damage_disc_rate___'] = -75;
                                            } else {
                                                this.prepared_request['own_damage_disc_rate'] = -65;
                                                this.processed_request['___own_damage_disc_rate___'] = -65;
                                            }
                                        }
                                    }
                                }
                            }
                            if (this.prepared_request['dbmaster_insurer_rto_zone_name'] === "South") {
                                if (['TN-Chennai&'].indexOf(RTO_Location) > -1 || ['AP', 'TS', 'KA'].indexOf(tempCodeRTO) > -1) {
                                    if (tempFuelType === 'petrol') {
                                        if (this.lm_request['is_claim_exists'] === 'yes') {
                                            this.prepared_request['own_damage_disc_rate'] = -50;
                                            this.processed_request['___own_damage_disc_rate___'] = -50;
                                        } else {
                                            if (parseFloat(tempAddon_vehicle_Age) > 5.80) {
                                                this.prepared_request['own_damage_disc_rate'] = -85;
                                                this.processed_request['___own_damage_disc_rate___'] = -85;
                                            } else {
                                                this.prepared_request['own_damage_disc_rate'] = -75;
                                                this.processed_request['___own_damage_disc_rate___'] = -75;
                                            }
                                        }
                                    }
                                    if ((tempMakeName !== 'mg' && tempFuelType === 'diesel') || (tempMakeName === 'mg' && tempVehicleType === 'suv' && tempFuelType === 'diesel')) {
                                        if (this.lm_request['is_claim_exists'] === 'yes') {
                                            this.prepared_request['own_damage_disc_rate'] = -45;
                                            this.processed_request['___own_damage_disc_rate___'] = -45;
                                        } else {
                                            if (parseFloat(tempAddon_vehicle_Age) > 5.80) {
                                                this.prepared_request['own_damage_disc_rate'] = -75;
                                                this.processed_request['___own_damage_disc_rate___'] = -75;
                                            } else {
                                                this.prepared_request['own_damage_disc_rate'] = -65;
                                                this.processed_request['___own_damage_disc_rate___'] = -65;
                                            }
                                        }
                                    }
                                }
                            }
                            if (this.prepared_request['dbmaster_insurer_rto_zone_name'] === "East") {
                                if (['WB-Kolkata'].indexOf(RTO_Location) > -1 || ['BR', 'OR', 'OD', 'JH'].indexOf(tempCodeRTO) > -1) {
                                    if (tempFuelType === 'petrol') {
                                        if (this.lm_request['is_claim_exists'] === 'yes') {
                                            this.prepared_request['own_damage_disc_rate'] = -50;
                                            this.processed_request['___own_damage_disc_rate___'] = -50;
                                        } else {
                                            if (parseFloat(tempAddon_vehicle_Age) > 5.80) {
                                                this.prepared_request['own_damage_disc_rate'] = -80;
                                                this.processed_request['___own_damage_disc_rate___'] = -80;
                                            } else {
                                                this.prepared_request['own_damage_disc_rate'] = -65;
                                                this.processed_request['___own_damage_disc_rate___'] = -65;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.log(error.stack);
                Error_Msg = error.stack;
            }
        }
        //Insurer-UW 23/05/2022 end

        if (Error_Msg === 'NO_ERR') {
            var electIdv = 0;
            var nonElectIdv = 0;
            var extBiFuelIdv = 0;
            if (this.lm_request['external_bifuel_value'] && (this.lm_request['external_bifuel_value'] - 0) && (this.lm_request['external_bifuel_value'] - 0 > 0))
            {
                extBiFuelIdv = this.lm_request['external_bifuel_value'] - 0;
            }
            if (this.lm_request['electrical_accessory'] && (this.lm_request['electrical_accessory'] - 0) && (this.lm_request['electrical_accessory'] - 0 > 0))
            {
                electIdv = this.lm_request['electrical_accessory'] - 0;
            }
            if (this.lm_request['non_electrical_accessory'] && (this.lm_request['non_electrical_accessory'] - 0) && (this.lm_request['non_electrical_accessory'] - 0 > 0))
            {
                nonElectIdv = this.lm_request['non_electrical_accessory'] - 0;
            }
            var idv = 0;
            var idv_2yr = 0;
            var idv_3yr = 0;
            var premium_breakup = this.get_const_premium_breakup();
            if (this.prepared_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
                idv = 0;
                idv_2yr = 0;
                idv_3yr = 0;
            } else {
                idv = parseInt(this.processed_request['___vehicle_expected_idv___']);
                idv_2yr = parseInt(this.prepared_request['vehicle_normal_idv_2yrs']);
                idv_3yr = parseInt(this.prepared_request['vehicle_normal_idv_3yrs']);
            }
            var cubic_capacity = parseInt(this.processed_request['___dbmaster_insurer_vehicle_cubiccapacity___']);
            var rto_zone = this.processed_request['___dbmaster_insurer_rto_zone_code___'];
            var vehicle_age = this.vehicle_age_year();
            var od_tenure = parseInt(this.lm_request['policy_od_tenure']);
            var tp_tenure = parseInt(this.lm_request['policy_tp_tenure']);
            if (this.lm_request['product_id'] === 1)
            {
                var tp_basic = 0;
                var vehicle_cc_slab = 0;
                var vehicle_age1 = 0;
                var arr_cc = [1000, 1500, 8000];
                var arr_age = [5, 10, 20];
                for (var k in arr_cc) {
                    if (cubic_capacity < arr_cc[k]) {
                        vehicle_cc_slab = arr_cc[k];
                        break;
                    }
                }
                for (var k in arr_age) {
                    if (vehicle_age < arr_age[k]) {
                        vehicle_age1 = arr_age[k];
                        break;
                    }
                }
                var obj_cubic_capacity;
                if (this.lm_request['vehicle_insurance_type'] === 'new') {
                    obj_cubic_capacity = {
                        'Cc_1000': 6521,
                        'Cc_1500': 10640,
                        'Cc_8000': 24596
                    };
                } else {
                    obj_cubic_capacity = {
                        'Cc_1000': 2094,
                        'Cc_1500': 3416,
                        'Cc_8000': 7897
                    };
                }
                if (this.prepared_request['dbmaster_insurer_rto_zone_name'] === "South") {
                    var ncb_protect = {
                        '0': 6.50,
                        '1': 7.15,
                        '2': 7.15,
                        '3': 8.45,
                        '4': 8.45,
                        '5': 8.45,
                        '6': 11.05,
                        '7': 11.05,
                        '8': 11.05,
                        '9': 13.00,
                        '10': 13.00
                    };
                    var invoice_protect = {
                        '0': 0.1560,
                        '1': 0.3250,
                        '2': 0.4680,
                        '3': 0.5850,
                        '4': 0,
                        '5': 0,
                        '6': 0,
                        '7': 0,
                        '8': 0,
                        '9': 0,
                        '10': 0
                    };
                    var mandatory_deduction_protect = {
                        '1000': [455, 455, 455, 455, 455, 455],
                        '1500': [455, 455, 455, 455, 455, 455],
                        '8000': [715, 715, 715, 715, 715, 715]
                    };
                    var zero_dep = {
                        "Compact": [0.0029, 0.0042, 0.0042, 0.0059, 0.0059, 0.0059, 0.01, 0.01, 0, 0, 0],
                        "Highend": [0.0052, 0.0065, 0.0065, 0.0098, 0.0098, 0.0132, 0.0193, 0.0193, 0, 0, 0],
                        "Midsize": [0.0033, 0.0046, 0.0046, 0.0072, 0.0072, 0.0097, 0.0172, 0.0172, 0, 0, 0],
                        "MINI": [0.0026, 0.0039, 0.0039, 0.0052, 0.0052, 0.007, 0.0114, 0.0114, 0, 0, 0],
                        "MUV": [0.0036, 0.0049, 0.0049, 0.0078, 0.0078, 0.0105, 0.0149, 0.0149, 0, 0, 0],
                        "SUV": [0.0039, 0.0052, 0.0052, 0.0085, 0.0085, 0.0085, 0.013, 0.013, 0, 0, 0]
                    };
                    var key_lock = {
                        "Compact": [0.0455, 0.0455, 0.0455, 0.0455, 0.0455, 0.0455, 0.0455, 0.0455, 0.0455, 0.0455, 0.052],
                        "Highend": [0.078, 0.078, 0.078, 0.078, 0.078, 0.078, 0.078, 0.078, 0.078, 0.078, 0.078],
                        "Midsize": [0.052, 0.052, 0.052, 0.052, 0.052, 0.052, 0.052, 0.052, 0.052, 0.052, 0.052],
                        "MINI": [0.039, 0.039, 0.039, 0.039, 0.039, 0.052, 0.052, 0.052, 0.052, 0.065, 0.065],
                        "MUV": [0.065, 0.065, 0.065, 0.065, 0.065, 0.065, 0.065, 0.065, 0.065, 0.065, 0.065],
                        "SUV": [0.065, 0.065, 0.065, 0.065, 0.065, 0.065, 0.065, 0.065, 0.065, 0.065, 0.065]
                    };
                    var engine_pro = {
                        "Compact": [0.15, 0.17, 0.17, 0.20, 0.25, 0.30, 0.33, 0.33, 0.35, 0.40, 0.45],
                        "Highend": [0.30, 0.30, 0.30, 0.35, 0.35, 0.35, 0.40, 0.40, 0.40, 0.45, 0.45],
                        "Midsize": [0.17, 0.19, 0.19, 0.22, 0.27, 0.32, 0.35, 0.35, 0.37, 0.42, 0.47],
                        "MINI": [0.15, 0.17, 0.17, 0.20, 0.25, 0.30, 0.33, 0.33, 0.35, 0.40, 0.45],
                        "MUV": [0.20, 0.22, 0.22, 0.25, 0.30, 0.35, 0.38, 0.38, 0.40, 0.45, 0.50],
                        "SUV": [0.20, 0.22, 0.22, 0.25, 0.30, 0.35, 0.38, 0.38, 0.40, 0.45, 0.50]
                    };
                    var consumable_exp = {
                        "Compact": [520, 578.50, 578.50, 643.50, 643.50, 643.50, 728, 728, 728, 806, 806],
                        "Highend": [682.50, 741, 741, 819, 819, 819, 897, 897, 897, 962, 962],
                        "Midsize": [520, 578.50, 578.50, 643.50, 643.50, 643.50, 728, 728, 728, 806, 806],
                        "MINI": [442, 487.50, 487.50, 572, 572, 572, 624, 624, 624, 695.50, 695.50],
                        "MUV": [682.50, 741, 741, 819, 819, 819, 897, 897, 897, 962, 962],
                        "SUV": [682.50, 741, 741, 819, 819, 819, 897, 897, 897, 962, 962]
                    };
                } else if (this.prepared_request['dbmaster_insurer_rto_zone_name'] === "West" || this.prepared_request['dbmaster_insurer_rto_zone_name'] === "East") {
                    var ncb_protect = {
                        '0': 6.00,
                        '1': 6.60,
                        '2': 6.60,
                        '3': 7.80,
                        '4': 7.80,
                        '5': 7.80,
                        '6': 10.20,
                        '7': 10.20,
                        '8': 10.20,
                        '9': 12.00,
                        '10': 12.00
                    };
                    var invoice_protect = {
                        '0': 0.1440,
                        '1': 0.30,
                        '2': 0.4320,
                        '3': 0.54,
                        '4': 0,
                        '5': 0,
                        '6': 0,
                        '7': 0,
                        '8': 0,
                        '9': 0,
                        '10': 0
                    };
                    var mandatory_deduction_protect = {
                        '1000': [420, 420, 420, 420, 420, 420],
                        '1500': [420, 420, 420, 420, 420, 420],
                        '8000': [660, 660, 660, 660, 660, 660]
                    };
                    if (this.prepared_request['dbmaster_insurer_rto_zone_name'] === "West") {
                        if (this.lm_request['registration_no_1'] === "GJ") {
                            if (this.processed_request['___dbmaster_insurer_rto_code___'] === "GJ-05") {
                                var zero_dep = {
                                    "Compact": [0.0026, 0.0048, 0.0048, 0.0068, 0.0068, 0.0091, 0.0124, 0.0124, 0, 0, 0],
                                    "Highend": [0.0048, 0.006, 0.006, 0.009, 0.009, 0.0122, 0.0178, 0.0178, 0, 0, 0],
                                    "Midsize": [0.003, 0.005, 0.005, 0.0079, 0.0079, 0.0107, 0.0159, 0.0159, 0, 0, 0],
                                    "MINI": [0.0024, 0.0072, 0.0072, 0.0096, 0.0096, 0.013, 0.0126, 0.0126, 0, 0, 0],
                                    "MUV": [0.0034, 0.0046, 0.0046, 0.0072, 0.0072, 0.0097, 0.0138, 0.0138, 0, 0, 0],
                                    "SUV": [0.0036, 0.0048, 0.0048, 0.0078, 0.0078, 0.0078, 0.012, 0.012, 0, 0, 0]
                                };
                            } else {
                                var zero_dep = {
                                    "Compact": [0.0026, 0.0048, 0.0048, 0.0068, 0.0068, 0.0091, 0.0124, 0.0124, 0, 0, 0],
                                    "Highend": [0.0048, 0.006, 0.006, 0.009, 0.009, 0.0122, 0.0178, 0.0178, 0, 0, 0],
                                    "Midsize": [0.003, 0.005, 0.005, 0.0079, 0.0079, 0.0107, 0.0159, 0.0159, 0, 0, 0],
                                    "MINI": [0.0024, 0.0072, 0.0072, 0.0096, 0.0096, 0.013, 0.0126, 0.0126, 0, 0, 0],
                                    "MUV": [0.0034, 0.0046, 0.0046, 0.0072, 0.0072, 0.0097, 0.0138, 0.0138, 0, 0, 0],
                                    "SUV": [0.0036, 0.0048, 0.0048, 0.0078, 0.0078, 0.0078, 0.012, 0.012, 0, 0, 0]
                                };
                            }
                        } else {
                            var zero_dep = {
                                "Compact": [0.0026, 0.0048, 0.0048, 0.0068, 0.0068, 0.0091, 0.0124, 0.0124, 0, 0, 0],
                                "Highend": [0.0048, 0.006, 0.006, 0.009, 0.009, 0.0122, 0.0178, 0.0178, 0, 0, 0],
                                "Midsize": [0.003, 0.005, 0.005, 0.0079, 0.0079, 0.0107, 0.0159, 0.0159, 0, 0, 0],
                                "MINI": [0.0024, 0.0072, 0.0072, 0.0096, 0.0096, 0.013, 0.0126, 0.0126, 0, 0, 0],
                                "MUV": [0.0034, 0.0046, 0.0046, 0.0072, 0.0072, 0.0097, 0.0138, 0.0138, 0, 0, 0],
                                "SUV": [0.0036, 0.0048, 0.0048, 0.0078, 0.0078, 0.0078, 0.012, 0.012, 0, 0, 0]
                            };
                        }
                    }
                    if (this.prepared_request['dbmaster_insurer_rto_zone_name'] === "East") {
                        var zero_dep = {
                            "Compact": [0.0026, 0.0048, 0.0048, 0.0068, 0.0068, 0.0091, 0.0147, 0.0147, 0, 0, 0],
                            "Highend": [0.0048, 0.006, 0.006, 0.009, 0.009, 0.0122, 0.0178, 0.0178, 0, 0, 0],
                            "Midsize": [0.003, 0.0053, 0.0053, 0.0083, 0.0083, 0.0111, 0.0159, 0.0159, 0, 0, 0],
                            "MINI": [0.0024, 0.0072, 0.0072, 0.0096, 0.0096, 0.013, 0.021, 0.021, 0, 0, 0],
                            "MUV": [0.0034, 0.0046, 0.0046, 0.0072, 0.0072, 0.0097, 0.0138, 0.0138, 0, 0, 0],
                            "SUV": [0.0036, 0.0048, 0.0048, 0.0078, 0.0078, 0.0078, 0.012, 0.012, 0, 0, 0]
                        };
                    }
                    var key_lock = {
                        "Compact": [0.042, 0.042, 0.042, 0.042, 0.042, 0.042, 0.042, 0.042, 0.042, 0.042, 0.048],
                        "Highend": [0.072, 0.072, 0.072, 0.072, 0.072, 0.072, 0.072, 0.072, 0.072, 0.072, 0.072],
                        "Midsize": [0.048, 0.048, 0.048, 0.048, 0.048, 0.048, 0.048, 0.048, 0.048, 0.048, 0.048],
                        "MINI": [0.036, 0.036, 0.036, 0.036, 0.036, 0.048, 0.048, 0.048, 0.048, 0.060, 0.060],
                        "MUV": [0.060, 0.060, 0.060, 0.060, 0.060, 0.060, 0.060, 0.060, 0.060, 0.060, 0.060],
                        "SUV": [0.060, 0.060, 0.060, 0.060, 0.060, 0.060, 0.060, 0.060, 0.060, 0.060, 0.060]
                    };
                    var engine_pro = {
                        "Compact": [0.15, 0.17, 0.17, 0.20, 0.25, 0.30, 0.33, 0.33, 0.35, 0.40, 0.45],
                        "Highend": [0.30, 0.30, 0.30, 0.35, 0.35, 0.35, 0.40, 0.40, 0.40, 0.45, 0.45],
                        "Midsize": [0.17, 0.19, 0.19, 0.22, 0.27, 0.32, 0.35, 0.35, 0.37, 0.42, 0.47],
                        "MINI": [0.15, 0.17, 0.17, 0.20, 0.25, 0.30, 0.33, 0.33, 0.35, 0.40, 0.45],
                        "MUV": [0.20, 0.22, 0.22, 0.25, 0.30, 0.35, 0.38, 0.38, 0.40, 0.45, 0.50],
                        "SUV": [0.20, 0.22, 0.22, 0.25, 0.30, 0.35, 0.38, 0.38, 0.40, 0.45, 0.50]
                    };
                    var consumable_exp = {
                        "Compact": [480, 534, 534, 594, 594, 594, 672, 672, 672, 744, 744],
                        "Highend": [630, 684, 684, 756, 756, 756, 828, 828, 828, 888, 888],
                        "Midsize": [480, 534, 534, 594, 594, 594, 672, 672, 672, 744, 744],
                        "MINI": [408, 450, 450, 528, 528, 528, 576, 576, 576, 642, 642],
                        "MUV": [630, 684, 684, 756, 756, 756, 828, 828, 828, 888, 888],
                        "SUV": [630, 684, 684, 756, 756, 756, 828, 828, 828, 888, 888]
                    };
                } else if (this.prepared_request['dbmaster_insurer_rto_zone_name'] === "North" || this.lm_request['registration_no_1'] === "TN") {
                    var ncb_protect = {
                        '0': 6.5000,
                        '1': 7.1500,
                        '2': 7.1500,
                        '3': 8.4500,
                        '4': 8.4500,
                        '5': 8.4500,
                        '6': 11.0500,
                        '7': 11.0500,
                        '8': 11.0500,
                        '9': 13.0000,
                        '10': 13.0000
                    };
                    var invoice_protect = {
                        '0': 0.2500,
                        '1': 0.3800,
                        '2': 0.4900,
                        '3': 0.5800,
                        '4': 0,
                        '5': 0,
                        '6': 0,
                        '7': 0,
                        '8': 0,
                        '9': 0,
                        '10': 0
                    };
                    var mandatory_deduction_protect = {
                        '1000': [455, 455, 455, 455, 455, 455],
                        '1500': [455, 455, 455, 455, 455, 455],
                        '8000': [715, 715, 715, 715, 715, 715]
                    };
                    if (this.prepared_request['dbmaster_insurer_rto_zone_name'] === "North") {
                        var zero_dep = {
                            "Compact": [0.0032, 0.0042, 0.0042, 0.0055, 0.0055, 0.0072, 0.0208, 0.0208, 0, 0, 0],
                            "Highend": [0.005, 0.006, 0.006, 0.0085, 0.0085, 0.0111, 0.0312, 0.0312, 0, 0, 0],
                            "Midsize": [0.0035, 0.0045, 0.0045, 0.0065, 0.0065, 0.0085, 0.0222, 0.0222, 0, 0, 0],
                            "MINI": [0.003, 0.004, 0.004, 0.005, 0.005, 0.0065, 0.0196, 0.0196, 0, 0, 0],
                            "MUV": [0.0038, 0.0048, 0.0048, 0.007, 0.007, 0.0091, 0.0248, 0.0248, 0, 0, 0],
                            "SUV": [0.004, 0.005, 0.005, 0.0075, 0.0075, 0.0075, 0.022, 0.022, 0, 0, 0]
                        };
                    }
                    if (this.lm_request['registration_no_1'] === "TN") {
                        var zero_dep = {
                            "Compact": [0.0032, 0.0042, 0.0042, 0.0055, 0.0055, 0.0055, 0.008, 0.008, 0, 0, 0],
                            "Highend": [0.005, 0.006, 0.006, 0.0085, 0.0085, 0.0115, 0.0162, 0.0162, 0, 0, 0],
                            "Midsize": [0.0035, 0.0045, 0.0045, 0.0065, 0.0065, 0.0088, 0.0144, 0.0144, 0, 0, 0],
                            "MINI": [0.003, 0.004, 0.004, 0.005, 0.005, 0.0068, 0.0152, 0.0152, 0, 0, 0],
                            "MUV": [0.0038, 0.0048, 0.0048, 0.007, 0.007, 0.0095, 0.0128, 0.0128, 0, 0, 0],
                            "SUV": [0.004, 0.005, 0.005, 0.0075, 0.0075, 0.0075, 0.011, 0.011, 0, 0, 0]
                        };
                    }
                    var key_lock = {
                        "Compact": [0.0455, 0.0455, 0.0455, 0.0455, 0.0455, 0.0455, 0.0455, 0.0455, 0.0455, 0.0455, 0.0520],
                        "Highend": [0.078, 0.078, 0.078, 0.078, 0.078, 0.078, 0.078, 0.078, 0.078, 0.078, 0.078],
                        "Midsize": [0.052, 0.052, 0.052, 0.052, 0.052, 0.052, 0.052, 0.052, 0.052, 0.052, 0.052],
                        "MINI": [0.039, 0.039, 0.039, 0.039, 0.039, 0.052, 0.052, 0.052, 0.052, 0.065, 0.065],
                        "MUV": [0.065, 0.065, 0.065, 0.065, 0.065, 0.065, 0.065, 0.065, 0.065, 0.065, 0.065],
                        "SUV": [0.065, 0.065, 0.065, 0.065, 0.065, 0.065, 0.065, 0.065, 0.065, 0.065, 0.065]
                    };
                    var engine_pro = {
                        "Compact": [0.15, 0.17, 0.17, 0.20, 0.25, 0.30, 0.33, 0.33, 0.35, 0.40, 0.45],
                        "Highend": [0.30, 0.30, 0.30, 0.35, 0.35, 0.35, 0.40, 0.40, 0.40, 0.45, 0.45],
                        "Midsize": [0.17, 0.19, 0.19, 0.22, 0.27, 0.32, 0.35, 0.35, 0.37, 0.42, 0.47],
                        "MINI": [0.15, 0.17, 0.17, 0.20, 0.25, 0.30, 0.33, 0.33, 0.35, 0.40, 0.45],
                        "MUV": [0.20, 0.22, 0.22, 0.25, 0.30, 0.35, 0.38, 0.38, 0.40, 0.45, 0.50],
                        "SUV": [0.20, 0.22, 0.22, 0.25, 0.30, 0.35, 0.38, 0.38, 0.40, 0.45, 0.50]
                    };
                    var consumable_exp = {
                        "Compact": [520, 578.50, 578.50, 643.50, 643.50, 643.50, 728, 728, 728, 806, 806],
                        "Highend": [682.50, 741, 741, 819, 819, 819, 897, 897, 897, 962, 962],
                        "Midsize": [520, 578.50, 578.50, 643.50, 643.50, 643.50, 728, 728, 728, 806, 806],
                        "MINI": [442, 487.50, 487.50, 572, 572, 572, 624, 624, 624, 695.50, 695.50],
                        "MUV": [682.50, 741, 741, 819, 819, 819, 897, 897, 897, 962, 962],
                        "SUV": [682.50, 741, 741, 819, 819, 819, 897, 897, 897, 962, 962]
                    };
                }
                var addon_vehicle_age = this.addon_vehicle_age_year();
                var addon_age = addon_vehicle_age.split('.');
                var addon_apply_age = addon_age[0];
                if (parseFloat(addon_vehicle_age) <= 10.99) {
                    var ncb_protect_slab = ncb_protect[addon_apply_age.toString()];
                    var ncb_protect_slab_2yr = ncb_protect['1'];
                    var ncb_protect_slab_3yr = ncb_protect['2'];
                } else {
                    var ncb_protect_slab = 0;
                }
                if (parseFloat(addon_vehicle_age) <= 3.99) {
                    if (this.lm_request['vehicle_insurance_type'] === 'renew') {
                        var invoice_protect_slab = invoice_protect[addon_apply_age.toString()];
                    } else {
                        var invoice_protect_slab = invoice_protect[addon_apply_age.toString()];
                    }
                    var invoice_protect_slab_2yr = invoice_protect['1'];
                    var invoice_protect_slab_3yr = invoice_protect['2'];
                } else {
                    var invoice_protect_slab = 0;
                }
                if (parseFloat(addon_vehicle_age) <= 5.99) {
                    var mandatory_deduction_protect_slab = mandatory_deduction_protect[vehicle_cc_slab][addon_apply_age];
                    var mandatory_deduction_protect_slab_2yr = mandatory_deduction_protect[vehicle_cc_slab]['1'];
                    var mandatory_deduction_protect_slab_3yr = mandatory_deduction_protect[vehicle_cc_slab]['2'];
                } else {
                    var mandatory_deduction_protect_slab = 0;
                }
                if (parseFloat(addon_vehicle_age) <= 7.80) {// && this.lm_request['is_claim_exists'] === 'no'
                    var zero_dep_slab = zero_dep[this.prepared_request['dbmaster_insurer_vehicle_insurer_segmant']][addon_apply_age];
                    var zero_dep_slab_2yr = zero_dep[this.prepared_request['dbmaster_insurer_vehicle_insurer_segmant']]['1'];
                    var zero_dep_slab_3yr = zero_dep[this.prepared_request['dbmaster_insurer_vehicle_insurer_segmant']]['2'];
                    if ((parseFloat(addon_vehicle_age) > 5.80) && this.lm_request['is_claim_exists'] === 'yes' && this.prepared_request['dbmaster_insurer_rto_zone_name'] !== "South") {
                        zero_dep_slab = 0;
                    }
                } else {
                    var zero_dep_slab = 0;
                }
                if (parseFloat(addon_vehicle_age) <= 10.80) {
                    var key_lock_slab = key_lock[this.prepared_request['dbmaster_insurer_vehicle_insurer_segmant']][addon_apply_age];
                    var key_lock_slab_2yr = key_lock[this.prepared_request['dbmaster_insurer_vehicle_insurer_segmant']]['1'];
                    var key_lock_slab_3yr = key_lock[this.prepared_request['dbmaster_insurer_vehicle_insurer_segmant']]['2'];
                    var engine_pro_slab = engine_pro[this.prepared_request['dbmaster_insurer_vehicle_insurer_segmant']][addon_apply_age];
                    var engine_pro_slab_2yr = engine_pro[this.prepared_request['dbmaster_insurer_vehicle_insurer_segmant']]['1'];
                    var engine_pro_slab_3yr = engine_pro[this.prepared_request['dbmaster_insurer_vehicle_insurer_segmant']]['2'];
                    var consumable_exp_slab = consumable_exp[this.prepared_request['dbmaster_insurer_vehicle_insurer_segmant']][addon_apply_age];
                    var consumable_exp_slab_2yr = consumable_exp[this.prepared_request['dbmaster_insurer_vehicle_insurer_segmant']][1];
                    var consumable_exp_slab_3yr = consumable_exp[this.prepared_request['dbmaster_insurer_vehicle_insurer_segmant']][2];
                } else {
                    var key_lock_slab = 0;
                    var engine_pro_slab = 0;
                    var consumable_exp_slab = 0;
                }
                cubic_capacity = vehicle_cc_slab;
                vehicle_age = vehicle_age1;
                var tp_basic = obj_cubic_capacity['Cc_' + vehicle_cc_slab];
                var od_tariff_rate = this.processed_request['___od_tarrif_rate___'];
                var od_basic_rate = parseFloat((od_tariff_rate * idv) / 100);
                var od_basic_rate_2yr = parseFloat((od_tariff_rate * idv_2yr) / 100);
                var od_basic_rate_3yr = parseFloat((od_tariff_rate * idv_3yr) / 100);
                if (this.lm_request['vehicle_insurance_type'] === 'new' && this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP') {
                    var od_disc_rate = parseFloat(((od_basic_rate + od_basic_rate_2yr + od_basic_rate_3yr) * Math.abs(this.prepared_request['own_damage_disc_rate'])) / 100);
                } else {
                    var od_disc_rate = parseFloat((od_basic_rate * Math.abs(this.prepared_request['own_damage_disc_rate'])) / 100);
                }
                if (this.lm_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
                    var od_basic_final = 0;
                } else if (this.lm_request['vehicle_insurance_type'] === 'new' && this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP') {
                    var od_basic_final = parseFloat(od_basic_rate + od_basic_rate_2yr + od_basic_rate_3yr - od_disc_rate);
                } else {
                    var od_basic_final = parseFloat(od_basic_rate - od_disc_rate);
                }
                premium_breakup['own_damage']['od_basic'] = od_basic_final;
                //premium_breakup['own_damage']['od_disc_ncb'] = parseInt((parseFloat(this.prepared_request['vehicle_ncb_next']) * od_basic_final) / 100);

                if (this.lm_request['vehicle_insurance_type'] === 'new' && this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP') {
                    var elect_accsess_dep_2 = parseFloat((this.lm_request['electrical_accessory'] * 84.00) / 100);
                    var elect_accsess_dep_3 = parseFloat((elect_accsess_dep_2 * 87.50) / 100);
                    var elect_accsess_val = parseFloat((this.lm_request['electrical_accessory'] * 4) / 100);
                    var elect_accsess_val_2 = parseFloat((elect_accsess_dep_2 * 4) / 100);
                    var elect_accsess_val_3 = parseFloat((elect_accsess_dep_3 * 4) / 100);
                    premium_breakup['own_damage']['od_elect_access'] = parseFloat(elect_accsess_val + elect_accsess_val_2 + elect_accsess_val_3);
                } else {
                    premium_breakup['own_damage']['od_elect_access'] = parseFloat((this.lm_request['electrical_accessory'] * 4) / 100);
                }

                if (this.lm_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
                    var non_elect_accsess = 0;
                } else {
                    var non_elect_accsess = (od_tariff_rate - ((od_tariff_rate * Math.abs(this.prepared_request['own_damage_disc_rate'])) / 100));
                }
                if (this.lm_request['vehicle_insurance_type'] === 'new' && this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP') {
                    var non_elect_accsess_dep_2 = parseFloat((this.lm_request['non_electrical_accessory'] * 84) / 100);
                    var non_elect_accsess_dep_3 = parseFloat((non_elect_accsess_dep_2 * 87.50) / 100);
                    var non_elect_accsess_val = parseFloat((this.lm_request['non_electrical_accessory'] * non_elect_accsess) / 100);
                    var non_elect_accsess_val_2 = parseFloat((non_elect_accsess_dep_2 * non_elect_accsess) / 100);
                    var non_elect_accsess_val_3 = parseFloat((non_elect_accsess_dep_3 * non_elect_accsess) / 100);
                    premium_breakup['own_damage']['od_non_elect_access'] = parseFloat(non_elect_accsess_val + non_elect_accsess_val_2 + non_elect_accsess_val_3);
                } else {
                    premium_breakup['own_damage']['od_non_elect_access'] = parseFloat((this.lm_request['non_electrical_accessory'] * non_elect_accsess) / 100);
                }

                if (this.prepared_request['voluntary_deductible'] === "") {
                    premium_breakup['own_damage']['od_disc_vol_deduct'] = 0;
                } else {
                    premium_breakup['own_damage']['od_disc_vol_deduct'] = 0;
                    /*
                     var voluntary_rate = {
                     '2500': 20,
                     '5000': 25,
                     '7500': 30,
                     '15000': 35
                     };
                     var voluntary_max_amount = {
                     '2500': 750,
                     '5000': 1500,
                     '7500': 2000,
                     '15000': 2500
                     };
                     var voluntary_rate_prm = parseFloat((voluntary_rate[this.lm_request['voluntary_deductible']] * od_basic_final) / 100);
                     var voluntary_max_prm = parseFloat(voluntary_max_amount[this.lm_request['voluntary_deductible']]);
                     premium_breakup['own_damage']['od_disc_vol_deduct'] = parseFloat(voluntary_rate_prm) > parseFloat(voluntary_max_prm) ? parseFloat(voluntary_max_prm) : parseFloat(voluntary_rate_prm);
                     */
                }
                if (this.lm_request['vehicle_insurance_subtype'] === '0CH_1TP') {
                    premium_breakup['own_damage']['od_cng_lpg'] = 0;
                } else {
                    if (this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === "CNG" || this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === "LPG") {
                        premium_breakup['own_damage']['od_cng_lpg'] = parseFloat((od_basic_final * 5) / 100);
                    } else if (this.lm_request['is_external_bifuel'] === 'yes') {
                        premium_breakup['own_damage']['od_cng_lpg'] = parseFloat((parseInt(this.lm_request['external_bifuel_value']) * 4) / 100);
                    } else {
                        premium_breakup['own_damage']['od_cng_lpg'] = 0;
                    }
                }
                var od_ncb_final = parseFloat(premium_breakup['own_damage']['od_basic'] + premium_breakup['own_damage']['od_elect_access'] + premium_breakup['own_damage']['od_non_elect_access'] - premium_breakup['own_damage']['od_disc_vol_deduct']
                        + premium_breakup['own_damage']['od_cng_lpg']);
                premium_breakup['own_damage']['od_disc_ncb'] = parseFloat((parseFloat(this.prepared_request['vehicle_ncb_next']) * od_ncb_final) / 100);
                premium_breakup['own_damage']['od_final_premium'] = parseFloat(premium_breakup['own_damage']['od_basic'] + premium_breakup['own_damage']['od_elect_access'] + premium_breakup['own_damage']['od_non_elect_access'] - premium_breakup['own_damage']['od_disc_vol_deduct']
                        - premium_breakup['own_damage']['od_disc_ncb'] + premium_breakup['own_damage']['od_cng_lpg']);
                if (this.lm_request['vehicle_insurance_subtype'] !== '1OD_0TP') {
                    premium_breakup['liability']['tp_basic'] = tp_basic;
                    var pa_unnamed_psngr = parseFloat((parseInt(this.lm_request['pa_unnamed_passenger_si']) * 0.05) / 100);
                    if (this.lm_request['is_pa_od'] === 'yes') {
                        premium_breakup['liability']['tp_cover_owner_driver_pa'] = 220;
                    } else {
                        premium_breakup['liability']['tp_cover_owner_driver_pa'] = 0;
                    }/*
                     if (this.lm_request['pa_paid_driver_si'] === '0') {
                     premium_breakup['liability']['tp_cover_paid_driver_pa'] = 0;
                     } else {
                     premium_breakup['liability']['tp_cover_paid_driver_pa'] = tp_tenure * 50;
                     }*/
                    if (this.lm_request['is_llpd'] === 'yes') {
                        premium_breakup['liability']['tp_cover_paid_driver_ll'] = tp_tenure * 50;
                    } else {
                        premium_breakup['liability']['tp_cover_paid_driver_ll'] = 0;
                    }
                    if (this.lm_request['pa_unnamed_passenger_si'] === "0" || this.lm_request['pa_unnamed_passenger_si'] === undefined) {
                        premium_breakup['liability']['tp_cover_unnamed_passenger_pa'] = 0;
                    } else {
                        premium_breakup['liability']['tp_cover_unnamed_passenger_pa'] = tp_tenure * parseFloat(pa_unnamed_psngr * parseFloat(this.prepared_request['dbmaster_insurer_vehicle_seatingcapacity']));
                    }
                    if (this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === "CNG" || this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === "LPG" || this.lm_request['is_external_bifuel'] === 'yes') {
                        premium_breakup['liability']['tp_cng_lpg'] = tp_tenure * 60;
                    } else {
                        premium_breakup['liability']['tp_cng_lpg'] = 0;
                    }
//premium_breakup['liability']['tp_cover_outstanding_loan'] = 0;
                    premium_breakup['liability']['tp_final_premium'] = parseFloat(premium_breakup['liability']['tp_basic'] + premium_breakup['liability']['tp_cover_owner_driver_pa'] + premium_breakup['liability']['tp_cover_paid_driver_pa'] + premium_breakup['liability']['tp_cover_paid_driver_ll']
                            + premium_breakup['liability']['tp_cover_unnamed_passenger_pa'] + premium_breakup['liability']['tp_cng_lpg']);
                }
                //Addon
                var newIdv = idv + electIdv + nonElectIdv + extBiFuelIdv;
                if (this.lm_request['vehicle_insurance_type'] === 'new' && this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP') {
                    var zero_dep_val = parseFloat(zero_dep_slab * idv);
                    var zero_dep_val_2 = parseFloat((zero_dep_slab_2yr * idv_2yr) / 100);
                    var zero_dep_val_3 = parseFloat((zero_dep_slab_3yr * idv_3yr) / 100);
                    premium_breakup['addon']['addon_zero_dep_cover'] = parseFloat((zero_dep_val + zero_dep_val_2 + zero_dep_val_3).toFixed(2));
                } else {
                    premium_breakup['addon']['addon_zero_dep_cover'] = parseFloat((zero_dep_slab * newIdv).toFixed(2));
                }
                if (parseInt(this.prepared_request['vehicle_ncb_next']) !== 0) {
                    if (this.lm_request['vehicle_insurance_type'] === 'new' && this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP') {
                        var ncb_protect_val = parseFloat((ncb_protect_slab * parseFloat(od_ncb_final)) / 100);
                        var ncb_protect_val_2 = parseFloat((ncb_protect_slab_2yr * parseFloat(od_ncb_final)) / 100);
                        var ncb_protect_val_3 = parseFloat((ncb_protect_slab_3yr * parseFloat(od_ncb_final)) / 100);
                        premium_breakup['addon']['addon_ncb_protection_cover'] = parseFloat((ncb_protect_val + ncb_protect_val_2 + ncb_protect_val_3).toFixed(2));
                    } else {
                        premium_breakup['addon']['addon_ncb_protection_cover'] = parseFloat((ncb_protect_slab * parseFloat(od_ncb_final) / 100).toFixed(2));
                    }
                }
                if (this.lm_request['vehicle_insurance_type'] === 'new' && this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP') {
                    var key_lock_val = parseFloat((key_lock_slab * idv) / 100);
                    var key_lock_val_2 = parseFloat((key_lock_slab_2yr * idv_2yr) / 100);
                    var key_lock_val_3 = parseFloat((key_lock_slab_3yr * idv_3yr) / 100);
                    premium_breakup['addon']['addon_key_lock_cover'] = parseFloat((key_lock_val + key_lock_val_2 + key_lock_val_3).toFixed(2));
                } else {
                    premium_breakup['addon']['addon_key_lock_cover'] = parseFloat(((key_lock_slab * newIdv) / 100).toFixed(2));
                }
                if (parseFloat(addon_vehicle_age) <= 10.99) {
                    premium_breakup['addon']['addon_road_assist_cover'] = od_tenure * 110;
                } else {
                    premium_breakup['addon']['addon_road_assist_cover'] = 0;
                }
                if (this.lm_request['vehicle_insurance_type'] === 'new' && this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP') {
                    var engine_pro_val = parseFloat((engine_pro_slab * idv) / 100);
                    var engine_pro_val_2 = parseFloat((engine_pro_slab_2yr * idv_2yr) / 100);
                    var engine_pro_val_3 = parseFloat((engine_pro_slab_3yr * idv_3yr) / 100);
                    premium_breakup['addon']['addon_engine_protector_cover'] = parseFloat((engine_pro_val + engine_pro_val_2 + engine_pro_val_3).toFixed(2));
                } else {
                    premium_breakup['addon']['addon_engine_protector_cover'] = parseFloat(((engine_pro_slab * newIdv) / 100).toFixed(2));
                }
                if (this.lm_request['vehicle_insurance_type'] === 'new' && this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP') {
                    premium_breakup['addon']['addon_consumable_cover'] = parseFloat(consumable_exp_slab + consumable_exp_slab_2yr + consumable_exp_slab_3yr);
                } else {
                    premium_breakup['addon']['addon_consumable_cover'] = parseFloat(consumable_exp_slab);
                }
                if (this.lm_request['vehicle_insurance_type'] === 'new' && this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP') {
                    var invoice_protect_val = parseFloat((invoice_protect_slab * idv) / 100);
                    var invoice_protect_val_2 = parseFloat((invoice_protect_slab_2yr * idv_2yr) / 100);
                    var invoice_protect_val_3 = parseFloat((invoice_protect_slab_3yr * idv_3yr) / 100);
                    premium_breakup['addon']['addon_invoice_price_cover'] = parseFloat((invoice_protect_val + invoice_protect_val_2 + invoice_protect_val_3).toFixed(2));
                } else {
                    premium_breakup['addon']['addon_invoice_price_cover'] = parseFloat(((invoice_protect_slab * newIdv) / 100).toFixed(2));
                }
                if (parseFloat(addon_vehicle_age) <= 10.99) {
                    premium_breakup['addon']['addon_personal_belonging_loss_cover'] = this.lm_request['policy_od_tenure'] * 84.75;
                } else {
                    premium_breakup['addon']['addon_personal_belonging_loss_cover'] = 0;
                }
                if (this.lm_request['vehicle_insurance_type'] === 'new' && this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP') {
                    var mandatory_deduction_protect_val = parseFloat(mandatory_deduction_protect_slab);
                    var mandatory_deduction_protect_val_2 = parseFloat(mandatory_deduction_protect_slab_2yr);
                    var mandatory_deduction_protect_val_3 = parseFloat(mandatory_deduction_protect_slab_3yr);
                    premium_breakup['addon']['addon_mandatory_deduction_protect'] = parseFloat(mandatory_deduction_protect_val + mandatory_deduction_protect_val_2 + mandatory_deduction_protect_val_3);
                } else {
                    premium_breakup['addon']['addon_mandatory_deduction_protect'] = parseFloat(mandatory_deduction_protect_slab);
                }

                if (this.lm_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
                    let addon_breakup = premium_breakup['addon'];
                    for (var key in addon_breakup) {
                        premium_breakup['addon'][key] = 0;
                    }
                }

                premium_breakup['net_premium'] = premium_breakup['own_damage']['od_final_premium'] + premium_breakup['liability']['tp_final_premium'];
                premium_breakup['service_tax'] = Math.round(premium_breakup['net_premium'] * 0.18);
                premium_breakup['final_premium'] = premium_breakup['net_premium'] + premium_breakup['service_tax'];
                objServiceHandler.Premium_Breakup = premium_breakup;
                objServiceHandler.Insurer_Transaction_Identifier = this.processed_request['___own_damage_disc_rate___'];
            }

            if (this.lm_request['product_id'] === 10) {
                var tp_basic = 0;
                var vehicle_cc_slab = 0;
                var arr_cc = [76, 151, 351, 4000];
                for (var k in arr_cc) {
                    if (cubic_capacity < arr_cc[k]) {
                        vehicle_cc_slab = arr_cc[k];
                        break;
                    }
                }

                var obj_cubic_capacity;
                if (this.lm_request['vehicle_insurance_type'] === 'new') {
                    obj_cubic_capacity = {
                        'Cc_76': 2091,
                        'Cc_151': 3851,
                        'Cc_351': 7365,
                        'Cc_4000': 15117
                    };
                } else {
                    obj_cubic_capacity = {
                        'Cc_76': 538,
                        'Cc_151': 714,
                        'Cc_351': 1366,
                        'Cc_4000': 2804
                    };
                }
                tp_basic = obj_cubic_capacity['Cc_' + vehicle_cc_slab];

                premium_breakup['own_damage']['od_basic'] = 0;
                premium_breakup['own_damage']['od_elect_access'] = 0;
                premium_breakup['own_damage']['od_non_elect_access'] = 0;
                premium_breakup['own_damage']['od_disc_vol_deduct'] = 0;
                premium_breakup['own_damage']['od_cng_lpg'] = 0;
                premium_breakup['own_damage']['od_disc_ncb'] = 0;
                premium_breakup['own_damage']['od_final_premium'] = 0;
                premium_breakup['liability']['tp_basic'] = (tp_tenure - 0) * (tp_basic - 0);
                var pa_unnamed_psngr = parseFloat((parseInt(this.lm_request['pa_unnamed_passenger_si']) * 0.07) / 100);
                if (this.lm_request['is_pa_od'] === 'yes') {
                    premium_breakup['liability']['tp_cover_owner_driver_pa'] = 220;
                } else {
                    premium_breakup['liability']['tp_cover_owner_driver_pa'] = 0;
                }
                premium_breakup['liability']['tp_cover_paid_driver_ll'] = 0;
                if (this.lm_request['pa_unnamed_passenger_si'] === "0" || this.lm_request['pa_unnamed_passenger_si'] === undefined) {
                    premium_breakup['liability']['tp_cover_unnamed_passenger_pa'] = 0;
                } else {
                    premium_breakup['liability']['tp_cover_unnamed_passenger_pa'] = tp_tenure * parseFloat(pa_unnamed_psngr * parseFloat(this.prepared_request['dbmaster_insurer_vehicle_seatingcapacity']));
                }
                premium_breakup['liability']['tp_cng_lpg'] = 0;
                //premium_breakup['liability']['tp_cover_outstanding_loan'] = 0;
                premium_breakup['liability']['tp_final_premium'] = parseFloat(premium_breakup['liability']['tp_basic'] + premium_breakup['liability']['tp_cover_owner_driver_pa'] + premium_breakup['liability']['tp_cover_paid_driver_pa'] + premium_breakup['liability']['tp_cover_paid_driver_ll']
                        + premium_breakup['liability']['tp_cover_unnamed_passenger_pa'] + premium_breakup['liability']['tp_cng_lpg']);

                premium_breakup['addon']['addon_zero_dep_cover'] = 0;
                premium_breakup['addon']['addon_ncb_protection_cover'] = 0;
                premium_breakup['addon']['addon_key_lock_cover'] = 0;
                premium_breakup['addon']['addon_road_assist_cover'] = 0;
                premium_breakup['addon']['addon_engine_protector_cover'] = 0;
                premium_breakup['addon']['addon_consumable_cover'] = 0;
                premium_breakup['addon']['addon_invoice_price_cover'] = 0;
                premium_breakup['addon']['addon_personal_belonging_loss_cover'] = 0;
                premium_breakup['addon']['addon_mandatory_deduction_protect'] = 0;
                premium_breakup['net_premium'] = premium_breakup['own_damage']['od_final_premium'] + premium_breakup['liability']['tp_final_premium'];
                premium_breakup['service_tax'] = parseFloat(premium_breakup['net_premium'] * 0.18);
                premium_breakup['final_premium'] = parseFloat(premium_breakup['net_premium'] + premium_breakup['service_tax']);
                objServiceHandler.Premium_Breakup = premium_breakup;
                objServiceHandler.Insurer_Transaction_Identifier = '';
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
EdelweissMotor.prototype.insurer_vehicle_idv = function (objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback) {
    console.log('Start', this.constructor.name, 'insurer_vehicle_idv');
    try {
        var objCurrent = this;
        var Insurer_Id = specific_insurer_object['insurer_id'];
        var Master_Db_List = objProduct.insurer_master_object['insurer_id_' + Insurer_Id]['master_db_list'];
        var Vehicle_code = Master_Db_List['vehicles']['insurer_db_master']['Insurer_Vehicle_Code'];
        var Vehicle_cubiccapacity = parseInt(Master_Db_List['vehicles']['insurer_db_master']['Insurer_Vehicle_CubicCapacity']);
        var City = Master_Db_List['rtos']['insurer_db_master']['Insurer_Rto_District_Code'];
        var vehicle_age = this.vehicle_age_year();
        if (this.lm_request['vehicle_insurance_type'] === 'new' && this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP') {
            var Vehicle_Depreciation_Rate = {
                'Age_0': '100.00',
                'Age_1': '84.000',
                'Age_2': '87.500',
                'Age_3': '85.714',
                'Age_4': '83.333',
                'Age_5': '88.000',
                'Age_6': '84.091',
                'Age_7': '81.081'
            };
        } else {
            var Vehicle_Depreciation_Rate = {
                'Age_0': '95.00',
                'Age_1': '84.000',
                'Age_2': '80.000',
                'Age_3': '70.000',
                'Age_4': '60.000',
                'Age_5': '50.000',
                'Age_6': '45.000',
                'Age_7': '40.000',
                'Age_8': '36.500',
                'Age_9': '32.800',
                'Age_10': '29.500'
            };
        }
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
            if (err) {
            } else {
                var edelweissMaster = db.collection('edelweiss_motor_idv_master');
                edelweissMaster.findOne({MASTER_CODE: Vehicle_code, CITY: 'DELHI', CAPACITY: Vehicle_cubiccapacity}, function (err, result) {
                    if (err) {
                    } else {
                        var vehicle_age = objCurrent.vehicle_age_year();
                        var slab = parseFloat(Vehicle_Depreciation_Rate['Age_' + vehicle_age]);
                        var Idv = (result && result.hasOwnProperty('Upto_6_Month')) ? result['Upto_6_Month'] : 0; //result[slab];
                        var Insurer_Vehicle_ExShowRoom = (result && result.hasOwnProperty('EX_PRICE')) ? result['EX_PRICE'] : 0;
                        if (objCurrent.lm_request['vehicle_insurance_type'] === 'new' && objCurrent.lm_request['vehicle_insurance_subtype'] === '3CH_0TP') {
                            Idv = parseFloat((Idv * slab) / 100);
                            var Db_Idv_Calculated = {
                                "Idv_Normal": Math.round(Idv),
                                "Idv_Min": Math.round(Idv * 0.75),
                                "Idv_Max": Math.round(Idv * 1.15),
                                "Exshowroom": Math.round(Insurer_Vehicle_ExShowRoom)
                            };
                        } else {
                            if (vehicle_age > 10 && vehicle_age <= 15) {
                                Idv = parseFloat((Insurer_Vehicle_ExShowRoom * 29.500) / 100);
                                if (vehicle_age > 10) {
                                    Idv = parseFloat(Idv - (Idv * .1));
                                } else if (vehicle_age > 11) {
                                    Idv = parseFloat(Idv - (Idv * .1));
                                } else if (vehicle_age > 12) {
                                    Idv = parseFloat(Idv - (Idv * .1));
                                } else if (vehicle_age > 13) {
                                    Idv = parseFloat(Idv - (Idv * .1));
                                } else if (vehicle_age > 14) {
                                    Idv = parseFloat(Idv - (Idv * .1));
                                } else if (vehicle_age > 15) {
                                    Idv = parseFloat(Idv - (Idv * .1));
                                }
                            } else {
                                Idv = parseFloat((Insurer_Vehicle_ExShowRoom * slab) / 100);
                            }
                            var Db_Idv_Calculated = {
                                "Idv_Normal": Math.round(Idv),
                                "Idv_Min": Math.round(Idv * 0.75),
                                "Idv_Max": Math.round(Idv * 1.15),
                                "Exshowroom": Math.round(Insurer_Vehicle_ExShowRoom)
                            };
                        }
                        objCurrent.insurer_vehicle_idv_handler(Db_Idv_Calculated, objProduct, Insurer_Object, specific_insurer_object);
                        console.log('Finish', this.constructor.name, 'insurer_vehicle_idv', Db_Idv_Calculated);
                        return Db_Idv_Calculated;
                    }
                });
            }
        });
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_vehicle_idv', ex);
    }
};
EdelweissMotor.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objPremiumService = objResponseJson;
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var objInsurerProduct = this;
    var Error_Msg = 'NO_ERR';
    try {
        if (objResponseJson.status === 'ERR') {
            Error_Msg = objResponseJson.msg;
        }
        if (false && this.lm_request.hasOwnProperty('ui_source') && this.lm_request['ui_source'] === 'quick_tw_journey') {
            let policy_number = objResponseJson.policy_number.toString();
            this.processed_request['___policy_number_generate___'] = policy_number;
            var pg_data = {
                'ss_id': this.lm_request['ss_id'],
                'crn': this.lm_request['crn'],
                'status': 'Success',
                'User_Data_Id': this.lm_request['udid'],
                'product_id': this.lm_request['product_id'],
                'premium_amount': this.lm_request['final_premium'],
                'customer_name': this.lm_request['first_name'] + " " + this.lm_request['last_name'],
                'txnid': policy_number
            };
            objServiceHandler.Payment.pg_data = pg_data;
            objServiceHandler.Payment.pg_redirect_mode = 'GET';
            objServiceHandler.Payment.pg_url = "http://qa-horizon.policyboss.com/transaction-status/" + this.lm_request['udid'] + "/" + this.lm_request['crn'] + "/" + this.lm_request['proposal_id'];
            objServiceHandler.Insurer_Transaction_Identifier = 'PB' + this.lm_request['crn'];
        } else {
            if (Error_Msg === 'NO_ERR') {
                let policy_number = objResponseJson.policy_number.toString();
                this.processed_request['___policy_number_generate___'] = policy_number;
                var merchant_key = ((config.environment.name === 'Production') ? 'o7LxX9fJ' : 'BC50nb');
                var salt = ((config.environment.name === 'Production') ? 'c6ob2Q7Wb4' : 'Bwxo1cPe');
                var merchant_id = ((config.environment.name === 'Production') ? '6756734' : '4825050');
                var amount = this.lm_request['final_premium'];
                var productinfo = {paymentParts: [{name: 'splitId1', merchantId: merchant_id, value: amount, commission: '0.00', description: 'splitId1 summary'}]};
                var hashSequence = 'key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10';
                var str = hashSequence.split('|');
                //var txnid = this.lm_request['crn'];
                var txnid = policy_number;
                var hash_string = '';
                for (var hash_var in str) {
                    if (str[hash_var] === "key")
                    {
                        hash_string = hash_string + merchant_key;
                        hash_string = hash_string + '|';
                    } else if (str[hash_var] === "txnid")
                    {
                        hash_string = hash_string + txnid;
                        hash_string = hash_string + '|';
                    } else if (str[hash_var] === "amount")
                    {
                        hash_string = hash_string + amount;
                        hash_string = hash_string + '|';
                    } else if (str[hash_var] === "productinfo")
                    {
                        hash_string = hash_string + JSON.stringify(productinfo);
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
                        hash_string = hash_string + this.lm_request['udid'] + ',' + this.lm_request['crn'] + ',' + this.lm_request['proposal_id'] + ',' + this.lm_request['insurer_id'];
                        hash_string = hash_string + '|';
                    } else if (str[hash_var] === "udf2")
                    {
                        hash_string = hash_string + policy_number;
                        hash_string = hash_string + '|';
                    } else
                    {
                        hash_string = hash_string + '';
                        hash_string = hash_string + '|';
                    }
                }
                hash_string = hash_string + salt;
                var hash = this.convert_to_sha512(hash_string).toLowerCase();
                var pg_data = {
                    'firstname': this.lm_request['first_name'],
                    'lastname': this.lm_request['last_name'],
                    'surl': this.const_payment.pg_ack_url, //'http://localhost:50111/Payment/Transaction_Status/', //
                    'phone': this.lm_request['mobile'],
                    'key': merchant_key,
                    'hash': hash,
                    'curl': this.const_payment.pg_ack_url, //'http://localhost:50111/Payment/Transaction_Status/', //
                    'furl': this.const_payment.pg_ack_url, //'http://localhost:50111/Payment/Transaction_Status/', //
                    'txnid': txnid,
                    'productinfo': JSON.stringify(productinfo),
                    'amount': amount,
                    'email': this.lm_request['email'],
                    'udf1': this.lm_request['udid'] + ',' + this.lm_request['crn'] + ',' + this.lm_request['proposal_id'] + ',' + this.lm_request['insurer_id'],
                    'udf2': policy_number,
                    'SALT': salt,
                    'service_provider': "payu_paisa"
                };
                objServiceHandler.Payment.pg_data = pg_data;
                objServiceHandler.Payment.pg_redirect_mode = 'POST';
                objServiceHandler.Insurer_Transaction_Identifier = 'PB' + this.lm_request['crn'];
            }
        }
        objServiceHandler.Error_Msg = Error_Msg;
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
EdelweissMotor.prototype.proposal_response_handler_NIU = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objPremiumService = objResponseJson;
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var objInsurerProduct = this;
    var MongoClient = require('mongodb').MongoClient;
    MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
        if (err)
            throw err;
        var edelweissMaster = db.collection('edelweiss_policy_master');
        var mysort = {Policy_Number: -1};
        edelweissMaster.find({}, {_id: 0, Policy_Number: 1}).sort(mysort).limit(1).toArray(function (err, result) {
            console.log(result);
            if (err)
                throw err;
            if (result['length'] === 0)
            {
                objInsurerProduct.processed_request['___policy_number_generate___'] = 600000001;
                //objInsurerProduct.const_policy.policy_number = 600000001;
            } else
            {
                if (isNaN(result[0]['Policy_Number'])) {
                    objInsurerProduct.processed_request['___policy_number_generate___'] = "Err_Pol_Num_Gnrt";
                } else {
                    objInsurerProduct.processed_request['___policy_number_generate___'] = parseFloat(result[0]['Policy_Number']) + 1;
                    //objInsurerProduct.const_policy.policy_number = parseFloat(result[0]['Policy_Number']) + 1;
                }
            }
            if (objInsurerProduct.processed_request.hasOwnProperty('___policy_number_generate___') === false || objInsurerProduct.processed_request['___policy_number_generate___'] === '' || objInsurerProduct.processed_request['___policy_number_generate___'] === null || isNaN(objInsurerProduct.processed_request['___policy_number_generate___']) || objInsurerProduct.processed_request['___policy_number_generate___'] === 'Err_Pol_Num_Gnrt' || objInsurerProduct.processed_request['___policy_number_generate___'].toString().length <= 8) {
                objServiceHandler.Error_Msg = 'ERROR IN POLICY NUMBER GENERATION';
            } else {
                var policy_number = (objInsurerProduct.processed_request['___policy_number_generate___']).toString();
                var date = moment().format('YYYY-MM-DD HH:mm:ss');
                var CRN = (objInsurerProduct.lm_request['crn']).toString();
                var Product_Id = objInsurerProduct.lm_request['product_id'];
                edelweissMaster.findOne({Policy_Number: policy_number}, function (e, res) {
                    if (e)
                        throw e;
                    if (res !== null) {
                        console.log('Msg : Policy Number Already Exists');
                        var mysort = {Policy_Number: -1};
                        edelweissMaster.find({}, {_id: 0, Policy_Number: 1}).sort(mysort).limit(1).toArray(function (err, result) {
                            console.log(result);
                            if (err)
                                throw err;
                            objInsurerProduct.processed_request['___policy_number_generate___'] = parseFloat(result[0]['Policy_Number']) + 1;
                            var policy_number_new = (objInsurerProduct.processed_request['___policy_number_generate___']).toString();
                            var myobj = {Created_On: date, Policy_Number: policy_number_new, CRN: CRN, Product_Id: Product_Id};
                            edelweissMaster.insertOne(myobj, function (err, res) {
                                if (err)
                                    throw err;
                            });
                        });
                    } else {
                        var myobj = {Created_On: date, Policy_Number: policy_number, CRN: CRN, Product_Id: Product_Id};
                        edelweissMaster.insertOne(myobj, function (err, res) {
                            if (err)
                                throw err;
                        });
                    }
                });
            }

        });
    });
    var Error_Msg = 'NO_ERR';
    var sleep = require('system-sleep');
    sleep(15000);
    try {
        if (this.processed_request.hasOwnProperty('___policy_number_generate___') === false || this.processed_request['___policy_number_generate___'] === '' || this.processed_request['___policy_number_generate___'] === null || isNaN(this.processed_request['___policy_number_generate___']) || this.processed_request['___policy_number_generate___'] === 'Err_Pol_Num_Gnrt' || this.processed_request['___policy_number_generate___'].toString().length <= 8) {
            Error_Msg = 'ERROR IN POLICY NUMBER GENERATION';
        }
        if (Error_Msg === 'NO_ERR') {
            var merchant_key = ((config.environment.name === 'Production') ? 'o7LxX9fJ' : 'BC50nb');
            var salt = ((config.environment.name === 'Production') ? 'c6ob2Q7Wb4' : 'Bwxo1cPe');
            var merchant_id = ((config.environment.name === 'Production') ? '6756734' : '4825050');
            var amount = (((config.environment.testing_ssid).indexOf(this.lm_request['ss_id']) > -1) ? '2' : this.lm_request['final_premium']);
            var productinfo = {paymentParts: [{name: 'splitId1', merchantId: merchant_id, value: amount, commission: '0.00', description: 'splitId1 summary'}]};
            var hashSequence = 'key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10';
            var str = hashSequence.split('|');
            //var txnid = this.lm_request['crn'];
            var txnid = (this.processed_request['___policy_number_generate___']).toString();
            var hash_string = '';
            for (var hash_var in str) {
                if (str[hash_var] === "key")
                {
                    hash_string = hash_string + merchant_key;
                    hash_string = hash_string + '|';
                } else if (str[hash_var] === "txnid")
                {
                    hash_string = hash_string + txnid;
                    hash_string = hash_string + '|';
                } else if (str[hash_var] === "amount")
                {
                    hash_string = hash_string + amount;
                    hash_string = hash_string + '|';
                } else if (str[hash_var] === "productinfo")
                {
                    hash_string = hash_string + JSON.stringify(productinfo);
                    hash_string = hash_string + '|';
                } else if (str[hash_var] === "firstname")
                {
                    hash_string = hash_string + this.lm_request['first_name'];
                    hash_string = hash_string + '|';
                } else if (str[hash_var] === "email")
                {
                    hash_string = hash_string + this.lm_request['email'];
                    hash_string = hash_string + '|';
                } else
                {
                    hash_string = hash_string + '';
                    hash_string = hash_string + '|';
                }
            }
            hash_string = hash_string + salt;
            var hash = this.convert_to_sha512(hash_string).toLowerCase();
            var pg_data = {
                'firstname': this.lm_request['first_name'],
                'lastname': this.lm_request['last_name'],
                'surl': this.const_payment.pg_ack_url, //'http://localhost:50111/Payment/Transaction_Status/', //
                'phone': this.lm_request['mobile'],
                'key': merchant_key,
                'hash': hash,
                'curl': this.const_payment.pg_ack_url, //'http://localhost:50111/Payment/Transaction_Status/', //
                'furl': this.const_payment.pg_ack_url, //'http://localhost:50111/Payment/Transaction_Status/', //
                'txnid': txnid,
                'productinfo': JSON.stringify(productinfo),
                'amount': amount,
                'email': this.lm_request['email'],
                'SALT': salt,
                'service_provider': "payu_paisa"
            };
            objServiceHandler.Payment.pg_data = pg_data;
            objServiceHandler.Payment.pg_redirect_mode = 'POST';
            objServiceHandler.Insurer_Transaction_Identifier = 'PB' + this.lm_request['crn'];
        }
        objServiceHandler.Error_Msg = Error_Msg;
        console.error('Exception', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.log('Finish', this.constructor.name, 'proposal_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
EdelweissMotor.prototype.pg_response_handler = function () {
    try {
        let objInsurerProduct = this;
        let output;// = objInsurerProduct.lm_request.pg_post;
        if (false && this.lm_request.hasOwnProperty('ui_source') && this.lm_request['ui_source'] === 'quick_tw_journey') {
            output = objInsurerProduct.const_payment_response.pg_get;
        } else if (objInsurerProduct.const_payment_response.pg_data.hasOwnProperty('pg_type') && objInsurerProduct.const_payment_response.pg_data.pg_type === "rzrpay") {
            output = objInsurerProduct.const_payment_response.pg_get;
        } else {
            output = objInsurerProduct.const_payment_response.pg_post;
        }
        if (false && this.lm_request.hasOwnProperty('ui_source') && this.lm_request['ui_source'] === 'quick_tw_journey') {
            if (output['status'] === 'Success') {
                this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.pg_reference_number_1 = new Date();
                this.const_policy.transaction_amount = output['amount'];
                this.const_policy.policy_number = this.insurer_master['service_logs']['pb_db_master']['Payment']['pg_data']['txnid'];
                this.const_policy.transaction_id = output['txnid'];
            } else {
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
            }
        } else if (objInsurerProduct.proposal_processed_request.hasOwnProperty('___pay_from___') && objInsurerProduct.proposal_processed_request['___pay_from___'] === 'wallet') {
            if (output['status'] === 'Success') {
                this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.pg_reference_number_1 = moment(this.proposal_processed_request['___current_date___'], 'DD/MM/YYYY').format("YYYY-MM-DD");
                this.const_policy.transaction_amount = output['amount'];
                this.const_policy.policy_number = objInsurerProduct.const_payment_response.pg_data.txnid;
                this.const_policy.transaction_id = output['transfer_id'];
            } else {
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
            }
        } else if (objInsurerProduct.const_payment_response.pg_data.hasOwnProperty('pg_type') && objInsurerProduct.const_payment_response.pg_data.pg_type === "rzrpay") {
            if (output['Status'] === 'Success') {
                this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.pg_reference_number_1 = moment(this.proposal_processed_request['___current_date___'], 'DD/MM/YYYY').format("YYYY-MM-DD");
                this.const_policy.transaction_amount = objInsurerProduct.const_payment_response.pg_data.amount;
                this.const_policy.policy_number = objInsurerProduct.const_payment_response.pg_data.quoteId;
//                this.const_policy.transaction_id = output['PayId'].toString();
                this.const_policy.transaction_id = objInsurerProduct.const_payment_response.pg_data.transfer_id;
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
        } else {
            this.const_policy.transaction_id = output['mihpayid'];
            if (output['status'] === 'success') {
                this.const_policy.transaction_amount = output['amount'];
                this.const_policy.pg_reference_number_1 = output['addedon'];
                //this.const_policy.transaction_id = (JSON.parse(output['payuMoneyId'])['splitIdMap'][0]['splitPaymentId']).toString();
                this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.transaction_id = output.hasOwnProperty('payuMoneyId') ? (JSON.parse(output['payuMoneyId'])['splitIdMap'][0]['splitPaymentId']).toString() : output['txnid'];
                this.const_policy.policy_number = (output['udf2'] !== '') ? output['udf2'] : output['txnid'];
            } else if (output['status'] === 'failure') {
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
                this.const_policy.pg_message = output['field9'];
            }
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
EdelweissMotor.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        var pdf = require('html-pdf');
        var Error_Msg = 'NO_ERR';
        var sub = "";
        var Email = require('../../models/email');
        var objModelEmail = new Email();
        var product_name = 'CAR';
        if (this.lm_request['product_id'] === 10) {
            product_name = 'TW';
        }
        if (this.lm_request['product_id'] === 12) {
            product_name = 'CV';
        }
        /*
         if (((this.proposal_processed_request.hasOwnProperty('___pay_from___') && this.proposal_processed_request['___pay_from___'] === 'wallet') || (this.const_payment_response.pg_data.hasOwnProperty('pg_type') && this.const_payment_response.pg_data.pg_type === "rzrpay")) && this.const_policy.pg_status === "SUCCESS") {
         if (objResponseJson['status'] === "captured") {
         var razp_date = moment.unix(objResponseJson['created_at']).format("YYYY-MM-DD");
         this.const_policy['pg_reference_number_1'] = razp_date;
         } else {
         Error_Msg = JSON.stringify(objResponseJson);
         this.const_policy.pg_status = 'FAIL';
         this.const_policy.transaction_status = 'FAIL';
         }
         }*/
        if (this.const_policy.pg_status === 'FAIL') {

        } else if (this.const_policy.pg_status === 'SUCCESS') {
            if (this.const_policy.hasOwnProperty('policy_number') === false || this.const_policy.policy_number === '' || this.const_policy.policy_number === null || isNaN(this.const_policy.policy_number) || this.const_policy.policy_number === 'Err_Pol_Num_Gnrt' || this.const_policy.policy_number.toString().length <= 8) {
                if (isNaN(this.const_policy.policy_number) === true && this.hasOwnProperty('const_payment_response') && this.const_payment_response.hasOwnProperty('pg_data') && this.const_payment_response.pg_data.hasOwnProperty('txnid')) {
                    this.const_policy.policy_number = this.const_payment_response.pg_data['txnid'];
                    if (this.const_policy.hasOwnProperty('policy_number') === false || this.const_policy.policy_number === '' || this.const_policy.policy_number === null || isNaN(this.const_policy.policy_number) || this.const_policy.policy_number === 'Err_Pol_Num_Gnrt' || this.const_policy.policy_number.toString().length <= 8) {
                        Error_Msg = 'ERROR IN POLICY NUMBER GENERATION';
                    }
                } else {
                    Error_Msg = 'ERROR IN POLICY NUMBER GENERATION';
                }
            }
            if (Error_Msg === 'NO_ERR') {
                //this.const_policy.policy_number = (this.processed_request['___policy_number_generate___']).toString();
                this.const_policy.edelweiss_data = JSON.stringify(this['processed_request']);
                var policy_number = this.const_policy.policy_number;
                this.const_policy.transaction_status = 'SUCCESS';
                if (this.lm_request['product_id'] === 1 || this.lm_request['product_id'] === 10)
                {
                    var pdf_file_name = this.constructor.name + '_' + product_name + '_POLICY_' + policy_number + '.pdf';
                    var html_file_name = this.constructor.name + '_' + product_name + '_POLICY_' + policy_number + '.html';
                    var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    var pdf_sys_loc_portal = config.pb_config.pdf_system_loc + pdf_file_name;
                    var html_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + html_file_name;
                    var html_sys_loc_portal = config.pb_config.pdf_system_loc + html_file_name;
                    this.const_policy.policy_url = pdf_web_path_portal;
                    this.const_policy.feedfile_url = config.environment.downloadurl + config.pb_config.pdf_web_loc + "EdelweissMotor_FeedFile_" + policy_number + ".xlsx";
                    if (this.lm_request['product_id'] === 10) {
                        this.const_policy.feedfile_url = config.environment.downloadurl + config.pb_config.pdf_web_loc + "EdelweissMotor_FeedFile_" + policy_number + ".csv";
                    }
                    var User_Data = require(appRoot + '/models/user_data');
                    var objProduct = this;
                    User_Data.findOne({"Request_Unique_Id": this.lm_request['search_reference_number']}, function (err, dbUserData) {
                        if (dbUserData) {
                            var args = {
                                data: {
                                    "search_reference_number": objProduct.lm_request['search_reference_number'],
                                    "api_reference_number": objProduct.lm_request['api_reference_number'],
                                    "policy_number": objProduct.const_policy.policy_number,
                                    "transaction_id": objProduct.const_policy.transaction_id,
                                    "transaction_pg": objProduct.const_policy.transaction_id,
                                    "transaction_amount": objProduct.const_policy.transaction_amount,
                                    "pg_reference_number_1": objProduct.const_policy.pg_reference_number_1,
                                    'client_key': objProduct.lm_request['client_key'],
                                    'secret_key': objProduct.lm_request['secret_key'],
                                    'insurer_id': objProduct.lm_request['insurer_id'],
                                    'email': objProduct.lm_request['email'],
                                    'mobile': objProduct.lm_request['mobile'],
                                    'method_type': 'Pdf',
                                    'execution_async': 'no'
                                },
                                headers: {
                                    "Content-Type": "application/json",
                                    'client_key': objProduct.lm_request['client_key'],
                                    'secret_key': objProduct.lm_request['secret_key']
                                }
                            };
                            objProduct.pdf_call(config.environment.weburl + '/quote/pdf_initiate', args, pdf_sys_loc_portal);
                        }
                    });
                }

            } else {
                this.const_policy.transaction_status = 'PAYPASS';
            }
        }
        console.log('Finish', this.constructor.name, 'verification_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', objServiceHandler);
    }
    objServiceHandler.Policy = this.const_policy;
    objServiceHandler.Error_Msg = Error_Msg;
    return objServiceHandler;
};
EdelweissMotor.prototype.pdf_call = function (url, args, pdf_sys_loc) {
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
EdelweissMotor.prototype.pdf_response_handler = function (objResponseJson) {
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
        var product_name = 'CAR';
        if (this.lm_request['product_id'] === 10) {
            product_name = 'TW';
        }
        if (this.lm_request['product_id'] === 12) {
            product_name = 'CV';
        }
        var objProduct = this;
        if (Error_Msg === 'NO_ERR') {
            var pdf_file_name = this.constructor.name + '_' + product_name + '_POLICY_' + objProduct.lm_request['policy_number'] + '.pdf';
            var html_file_name = this.constructor.name + '_' + product_name + '_POLICY_' + objProduct.lm_request['policy_number'] + '.html';
            var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
            var pdf_sys_loc_portal = config.pb_config.pdf_system_loc + pdf_file_name;
            var html_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + html_file_name;
            //var html_web_path_portal = config.environment.weburl + config.pb_config.pdf_web_loc + html_file_name;
            var html_sys_loc_portal = config.pb_config.pdf_system_loc + html_file_name;
            policy.policy_url = pdf_web_path_portal;
            policy.feedfile_url = config.environment.downloadurl + config.pb_config.pdf_web_loc + "EdelweissMotor_FeedFile_" + objProduct.lm_request['policy_number'] + ".xlsx";
            policy.pdf_status = 'SUCCESS';

            let ch_flag = false;
            let html_file_path;
            if (this.lm_request['vehicle_insurance_subtype'] === "1OD_0TP") {
                html_file_path = appRoot + "/resource/request_file/Edelweiss_CAR_SAOD_SampleHtml.html";
            } else {
                ch_flag = ((parseInt(((this.lm_request['vehicle_insurance_subtype']).split('CH'))[0]) > 0) ? true : false);
                if (!ch_flag) {
                    html_file_path = appRoot + "/resource/request_file/Edelweiss_CAR_SATP_SampleHtml.html";
                } else {
                    html_file_path = appRoot + "/resource/request_file/Edelweiss_CAR_Package_SampleHtml.html";
                }
            }

            //var html_file_path = appRoot + "/resource/request_file/Edelweiss_CAR_SampleHtml.html"; //for UAT
            if (this.lm_request['product_id'] === 10) {
                policy.feedfile_url = config.environment.downloadurl + config.pb_config.pdf_web_loc + "EdelweissMotor_FeedFile_" + objProduct.lm_request['policy_number'] + ".csv";
                html_file_path = appRoot + "/resource/request_file/Edelweiss_TW_SampleHtml.html";
            }
            var pdf_file_path = appRoot + "/tmp/pdf/" + this.constructor.name + '_' + product_name + '_POLICY_' + objProduct.lm_request['policy_number'] + '.pdf';
            var html_pdf_file_path = appRoot + "/tmp/pdf/" + this.constructor.name + '_' + product_name + '_POLICY_' + objProduct.lm_request['policy_number'] + '.html';
            var htmlPol = fs.readFileSync(html_file_path, 'utf8');
            var User_Data = require(appRoot + '/models/user_data');
            User_Data.findOne({"Request_Unique_Id": objProduct.lm_request['search_reference_number']}, function (err, dbUserData) {
                if (dbUserData) {
                    //process for pg_data
                    var Processed_Request = dbUserData.Proposal__Request_Core;
                    var Erp_Qt_Request_Core = dbUserData.Erp_Qt_Request_Core;
                    var mdp_prm = (dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_final_premium___']) - ((Erp_Qt_Request_Core['___addon_zero_dep_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_zero_dep_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_invoice_price_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_invoice_price_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_consumable_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_consumable_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_personal_belonging_loss_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_personal_belonging_loss_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_engine_protector_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_engine_protector_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_key_lock_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_key_lock_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_road_assist_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_road_assist_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_ncb_protection_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_ncb_protection_cover___'] : 0));
                    var qr_text = 'Policy No: ' + objProduct.lm_request['policy_number'].toString() + '+Customer Name:' + Erp_Qt_Request_Core['___first_name___'] + ' ' + Erp_Qt_Request_Core['___middle_name___'] + ' ' + Erp_Qt_Request_Core['___last_name___'] + '+Engine no:' + Erp_Qt_Request_Core['___engine_number___'] + '+Chassis No:' + Erp_Qt_Request_Core['___chassis_number___'] + '+Vehicle No:' + Erp_Qt_Request_Core['___registration_no___'] + '+Policy Start date:' + moment(Erp_Qt_Request_Core['___policy_start_date___']).format("DD/MM/YYYY") + '+Policy end date:' + moment(Erp_Qt_Request_Core['___policy_end_date___']).format("DD/MM/YYYY") + '+URL:https://edelweissinsurance.com';
                    var qr_url = 'https://chart.googleapis.com/chart?chs=60x60&cht=qr&chl=' + encodeURI(qr_text) + '&chld=L|1&choe=UTF-8';
                    dbUserData.Erp_Qt_Request_Core['___addon_mandatory_deduction_protect_cover___'] = mdp_prm > 0 ? "yes" : "no";
                    dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_mandatory_deduction_protect___'] = mdp_prm;
                    var is_financial = "";
                    if (dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___'] !== "0") {
                        is_financial = dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___'] + " with " + dbUserData.Erp_Qt_Request_Core['___financial_institute_name___'];
                    }
                    var posp_name = "NA";
                    var posp_pan_no = "NA";
                    if (dbUserData.Erp_Qt_Request_Core['___is_posp___'] === "yes") {
                        if (dbUserData.Erp_Qt_Request_Core['___posp_middle_name___'] === null || dbUserData.Erp_Qt_Request_Core['___posp_middle_name___'] === "") {
                            posp_name = dbUserData.Erp_Qt_Request_Core['___posp_first_name___'] + " " + dbUserData.Erp_Qt_Request_Core['___posp_last_name___'];
                        } else {
                            posp_name = dbUserData.Erp_Qt_Request_Core['___posp_first_name___'] + " " + dbUserData.Erp_Qt_Request_Core['___posp_middle_name___'] + " " + dbUserData.Erp_Qt_Request_Core['___posp_last_name___'];
                        }
                        posp_pan_no = dbUserData.Erp_Qt_Request_Core['___posp_pan_no___'];
                    }
                    let paid_amt = "";
                    let payment_bank_name = "";
                    if ((dbUserData.Payment_Request.pg_data.hasOwnProperty('pg_type') && dbUserData.Payment_Request.pg_data['pg_type'] === "rzrpay") || dbUserData.Erp_Qt_Request_Core['___pay_from___'] === "wallet") {
                        paid_amt = (objProduct.lm_request['transaction_amount'].toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
                        if (dbUserData.Erp_Qt_Request_Core['___pay_from___'] === "wallet") {
                            payment_bank_name = "Razor Pay Wallet";
                        } else {
                            payment_bank_name = "Razor Pay";
                        }
                    } else {
                        paid_amt = (objProduct.lm_request['transaction_amount']).split('.')[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
                        payment_bank_name = "PAYU";
                    }
                    var replacedata = {
                        '___qr_url___': qr_url,
                        '___pa_hide___': (dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cover_owner_driver_pa___'] - 0) > 0 ? "" : "display:none;",
                        "___finance_hide___": dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___'] === "0" ? "display:none;" : "",
                        '___if_addons___': Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "0CH_1TP" ? "display: none;" : "",
                        '___od_hide___': Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1CH_0TP" ? "" : "display: none;",
                        '___pa_unnamed_hide___': Erp_Qt_Request_Core['___premium_breakup_tp_cover_unnamed_passenger_pa___'] > 0 ? "" : "display: none;",
                        "___gst_no___": dbUserData.Erp_Qt_Request_Core['___gst_no___'] === "" ? "NA" : dbUserData.Erp_Qt_Request_Core['___gst_no___'],
                        '___od_only_hide___': Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? "" : "display: none;",
                        '___od_only_show___': Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? "display: none;" : "",
                        '___tp_insurer___': Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? Erp_Qt_Request_Core['___tp_insurer_name___'] : "display: none;",
                        '___tp_policy_number___': Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? Erp_Qt_Request_Core['___tp_policy_number___'] : "display: none;",
                        '___tp_start_date___': Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? Erp_Qt_Request_Core['___tp_start_date___'] : "display: none;",
                        '___tp_end_date___': Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? Erp_Qt_Request_Core['___tp_end_date___'] : "display: none;",
                        '___tp_hide___': Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "0CH_1TP" ? "" : "display: none;",
                        '___tp_show___': Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "0CH_1TP" ? "display: none;" : "",
                        '___transaction_id___': objProduct.lm_request['transaction_id'].toString(),
                        '___basic_tp_including_tppd___': (dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_basic___'] - 0) + (dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cover_paid_driver_pa___'] - 0),
                        '___policy_number___': objProduct.lm_request['policy_number'].toString(),
                        '___tax___': Erp_Qt_Request_Core['___communication_state___'] === "MAHARASHTRA" ? "0" : ((((dbUserData.Erp_Qt_Request_Core['___tax___'] - 0) / 1).toFixed(2).toString()).split('.')[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")),
                        '___cgst___': Erp_Qt_Request_Core['___communication_state___'] === "MAHARASHTRA" ? ((((dbUserData.Erp_Qt_Request_Core['___tax___'] - 0) / 2).toFixed(2).toString()).split('.')[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")) : "0.00",
                        '___sgst___': Erp_Qt_Request_Core['___communication_state___'] === "MAHARASHTRA" ? ((((dbUserData.Erp_Qt_Request_Core['___tax___'] - 0) / 2).toFixed(2).toString()).split('.')[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")) : "0.00",
                        '___previous_insurer___': (objProduct.insurer_master.prev_insurer) ? (objProduct.insurer_master.prev_insurer.insurer_db_master['PreviousInsurer_Code']) : '',
                        '___proposal_number___': objProduct.prepared_request['pg_reference_number_2'],
                        '___policy_expiry_date___': dbUserData.Processed_Request['___policy_expiry_date___'],
                        '___policy_start_date___': moment(Erp_Qt_Request_Core['___policy_start_date___']).format("DD/MM/YYYY"),
                        '___policy_end_date___': moment(Erp_Qt_Request_Core['___policy_end_date___']).format("DD/MM/YYYY"),
                        '___curr_dt___': (moment().format('DD/MM/YYYY')).toString(),
                        '___pay_dt___': moment(objProduct.lm_request['pg_reference_number_1']).format('DD/MM/YYYY').toString(),
                        "___addon_zd___": Erp_Qt_Request_Core['___addon_zero_dep_cover___'] === "yes" ? "" : "display: none;",
                        "___addon_ip___": Erp_Qt_Request_Core['___addon_invoice_price_cover___'] === "yes" ? "" : "display: none;",
                        "___addon_cc___": Erp_Qt_Request_Core['___addon_consumable_cover___'] === "yes" ? "" : "display: none;",
                        "___addon_pb___": Erp_Qt_Request_Core['___addon_personal_belonging_loss_cover___'] === "yes" ? "" : "display: none;",
                        "___addon_ep___": Erp_Qt_Request_Core['___addon_engine_protector_cover___'] === "yes" ? "" : "display: none;",
                        "___addon_kl___": Erp_Qt_Request_Core['___addon_key_lock_cover___'] === "yes" ? "" : "display: none;",
                        "___addon_mdp___": mdp_prm > 0 ? "" : "display: none;",
                        "___addon_rsa___": Erp_Qt_Request_Core['___addon_road_assist_cover___'] === "yes" ? "" : "display: none;",
                        "___addon_ncbp___": Erp_Qt_Request_Core['___addon_ncb_protection_cover___'] === "yes" ? "" : "display: none;",
                        "___premium_breakup_od_final_premium___": ((dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_final_premium___'] + dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_final_premium___']).toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        "___vehicle_expected_idv___": (dbUserData.Erp_Qt_Request_Core['___vehicle_expected_idv___'].toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        "___non_electrical_accessory___": (dbUserData.Erp_Qt_Request_Core['___non_electrical_accessory___'].toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        "___electrical_accessory___": (dbUserData.Erp_Qt_Request_Core['___electrical_accessory___'].toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        "___external_bifuel_value___": (dbUserData.Erp_Qt_Request_Core['___external_bifuel_value___'].toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        "___total_si_idv___": ((parseInt(dbUserData.Erp_Qt_Request_Core['___vehicle_expected_idv___']) + parseInt(dbUserData.Erp_Qt_Request_Core['___non_electrical_accessory___']) + parseInt(dbUserData.Erp_Qt_Request_Core['___electrical_accessory___']) + parseInt(dbUserData.Erp_Qt_Request_Core['___external_bifuel_value___'])).toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        "___premium_breakup_od_basic___": (dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_basic___'].toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        "___premium_breakup_tp_basic___": (dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_basic___'].toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        "___vol_deduct_prm___": "0.00",
                        "___premium_breakup_od_elect_access___": (dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_elect_access___'].toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        "___premium_breakup_od_non_elect_access___": (dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_non_elect_access___'].toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        "___premium_breakup_tp_cng_lpg___": (dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cng_lpg___'].toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        "___premium_breakup_od_cng_lpg___": (dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_cng_lpg___'].toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        "___premium_breakup_tp_cover_owner_driver_pa___": (dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cover_owner_driver_pa___'].toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        "___premium_breakup_tp_cover_paid_driver_pa___": (dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cover_paid_driver_pa___'].toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        "___premium_breakup_tp_cover_unnamed_passenger_pa___": (dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cover_unnamed_passenger_pa___'].toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        "___premium_breakup_tp_cover_paid_driver_ll___": (dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cover_paid_driver_ll___'].toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        "___premium_breakup_od_disc_ncb___": (dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_disc_ncb___'].toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        "___premium_breakup_tp_final_premium___": (dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_final_premium___'].toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        "___premium_breakup_addon_final_premium___": (dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_final_premium___'].toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        "___premium_breakup_net_premium___": (dbUserData.Erp_Qt_Request_Core['___premium_breakup_net_premium___'].toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        "___final_premium___": ((dbUserData.Erp_Qt_Request_Core['___net_premium___'] - 0) + (dbUserData.Erp_Qt_Request_Core['___tax___'] - 0)).toString(), //(dbUserData.Erp_Qt_Request_Core['___final_premium___'].toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        "___total_veh_acc___": ((dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_elect_access___'] + dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_non_elect_access___'] + dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_cng_lpg___']).toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        "___total_tp_base___": ((dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_basic___'] + dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cng_lpg___']).toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        "___applicable_imt___": objProduct.applicable_imt(Erp_Qt_Request_Core),
                        "___ed_make_name___": dbUserData.Processed_Request['___dbmaster_insurer_vehicle_make_name___'],
                        "___ed_model_name___": dbUserData.Processed_Request['___dbmaster_insurer_vehicle_model_name___'],
                        "___ed_variant_name___": dbUserData.Processed_Request['___dbmaster_insurer_vehicle_variant_name___'],
                        "___ed_cubic_capacity___": dbUserData.Processed_Request['___dbmaster_insurer_vehicle_cubiccapacity___'],
                        "___ed_seating_capacity___": dbUserData.Processed_Request['___dbmaster_insurer_vehicle_seatingcapacity___'],
                        "___paid_amt___": paid_amt,
                        "___dbmaster_insurer_rto_city_name___": dbUserData.Processed_Request['___dbmaster_insurer_rto_city_name___'],
                        "___voluntary_deductible___": "0.00",
                        "___addon_zd_prm___": Erp_Qt_Request_Core['___addon_zero_dep_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_zero_dep_cover___'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,") : "0",
                        "___addon_ip_prm___": Erp_Qt_Request_Core['___addon_invoice_price_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_invoice_price_cover___'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,") : "0",
                        "___addon_cc_prm___": Erp_Qt_Request_Core['___addon_consumable_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_consumable_cover___'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,") : "0",
                        "___addon_pb_prm___": Erp_Qt_Request_Core['___addon_personal_belonging_loss_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_personal_belonging_loss_cover___'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,") : "0",
                        "___addon_ep_prm___": Erp_Qt_Request_Core['___addon_engine_protector_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_engine_protector_cover___'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,") : "0",
                        "___addon_kl_prm___": Erp_Qt_Request_Core['___addon_key_lock_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_key_lock_cover___'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,") : "0",
                        "___addon_mdp_prm___": mdp_prm > 0 ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_mandatory_deduction_protect___'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,") : "0",
                        "___addon_rsa_prm___": Erp_Qt_Request_Core['___addon_road_assist_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_road_assist_cover___'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,") : "0",
                        "___addon_ncbp_prm___": Erp_Qt_Request_Core['___addon_ncb_protection_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_ncb_protection_cover___'].toString().replace(/(\d)(?=(\d\d)+\d$)/g, "$1,") : "0",
                        "___compulsory_deductible___": parseInt(dbUserData.Processed_Request['___dbmaster_insurer_vehicle_cubiccapacity___']) < 1500 ? "1,000.00" : "2,000.00",
//                        '___is_financial___': dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___'] !== "0" ? is_financial : "",
                        "___hypothecated___": dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___'] === "Hypothecation" ? dbUserData.Erp_Qt_Request_Core['___financial_institute_name___'] : "...................................................",
                        "___lease_agreement___": dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___'] === "Lease agreement" ? dbUserData.Erp_Qt_Request_Core['___financial_institute_name___'] : "...................................................",
                        "___agreement___": dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___'] === "Hire Purchase" ? dbUserData.Erp_Qt_Request_Core['___financial_institute_name___'] : "...................................................",
                        "___posp_name___": posp_name,
                        "___posp_pan_no___": posp_pan_no,
                        "___registration_type___": (Erp_Qt_Request_Core['___vehicle_registration_type___'] === 'individual' || Erp_Qt_Request_Core['___vehicle_registration_type___'] === 'Individual') ? 'Individual' : 'Corporate'
                    };
                    if (objProduct.lm_request['product_id'] === 10) {
                        replacedata['___tax___'] = Erp_Qt_Request_Core['___communication_state___'] === "MAHARASHTRA" ? "0" : ((((dbUserData.Erp_Qt_Request_Core['___tax___'] - 0) / 1).toFixed(2).toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"));
                        replacedata['___cgst___'] = Erp_Qt_Request_Core['___communication_state___'] === "MAHARASHTRA" ? ((((dbUserData.Erp_Qt_Request_Core['___tax___'] - 0) / 2).toFixed(2).toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")) : "0.00";
                        replacedata['___sgst___'] = Erp_Qt_Request_Core['___communication_state___'] === "MAHARASHTRA" ? ((((dbUserData.Erp_Qt_Request_Core['___tax___'] - 0) / 2).toFixed(2).toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")) : "0.00";
                    }
                    htmlPol = htmlPol.toString().replaceJson(replacedata);
                    htmlPol = htmlPol.toString().replaceJson(Processed_Request);
                    htmlPol = htmlPol.toString().replaceJson(Erp_Qt_Request_Core);
                    // console.log(htmlPol);
                    var sleep = require('system-sleep');
                    sleep(2000);
                    var fs = require('fs');
                    var request_html_file = fs.writeFileSync(html_pdf_file_path, htmlPol);
                    sleep(2000);

                    // pdf changes for QA and local only 

                    const html = fs.readFileSync(html_pdf_file_path, 'utf8');
                    const options = {
                        format: 'Letter',
                        orientation: 'portrait',
                        height: '297mm', // A4 height
                        width: '210mm', // A4 width
                        border: {
                            top: '0.5in',
                            right: '0.5in',
                            bottom: '0.5in',
                            left: '0.5in'
                        },
                        paginationOffset: 1, // starts the page count at 1 instead of 0
                        header: {
                            height: '20mm'
                        },
                        footer: {
                            height: '20mm'
                        },
                        zoomFactor: 1, // sets the zoom level to 100%
                        timeout: 30000 // sets a timeout of 30 seconds for generating the PDF
                    };
                    var pdf = require('html-pdf');
                    pdf.create(html).toFile(pdf_file_path, function (err, res) {
                        if (err)
                            return console.log(err);
                        console.log(res);
                    });

                    /*                     PDF Changes for Production 
                     try {
                     var http = require('https');
                     console.log('EdelweissPdfUrl');
                     //var insurer_pdf_url = "http://qa.policyboss.com:3000/html2pdf?o=download&u=http://download.policyboss.com/pdf-files/policy/EdelweissMotor_CAR_POLICY_600006021.html";
                     var insurer_pdf_url = config.environment.pdf_url + html_web_path_portal;
                     //var insurer_pdf_url = html_web_path_portal;//Local
                     var file_horizon = fs.createWriteStream(pdf_file_path);
                     var request_horizon = http.get(insurer_pdf_url, function (response) {
                     response.pipe(file_horizon);
                     });
                     } catch (ex1) {
                     console.error('Exception', this.constructor.name, 'verification_response_handler', ex1);
                     }*/

                    if (objProduct.lm_request['product_id'] === 1) {
                        var ff_file_name = "EdelweissMotor_FeedFile_" + objProduct.lm_request['policy_number'] + ".xlsx";
                        var ff_loc_path_portal = appRoot + "/tmp/pdf/" + ff_file_name;
                        var ff_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + ff_file_name;
                        //var ff_web_path_portal = config.environment.weburl + config.pb_config.pdf_web_loc + ff_file_name;
                        var User_Data = require(appRoot + '/models/user_data');
                        var workbook = new excel.Workbook();
                        var worksheet = workbook.addWorksheet('Sheet 1');
                        var style = workbook.createStyle({
                            font: {
                                color: '#FF0800',
                                size: 12
                            },
                            numberFormat: '$#,##0.00; ($#,##0.00); -'
                        });
                        var styleh = workbook.createStyle({
                            font: {
                                bold: true,
                                size: 12
                            }
                        });
                        //row 1
                        worksheet.cell(1, 1).string('Policy Issue Date').style(styleh);
                        worksheet.cell(1, 2).string('Policy Number').style(styleh);
                        worksheet.cell(1, 3).string('Proposal Number').style(styleh);
                        worksheet.cell(1, 4).string('Branch').style(styleh);
                        worksheet.cell(1, 5).string('Agent Code').style(styleh);
                        worksheet.cell(1, 6).string('Agent Name').style(styleh);
                        worksheet.cell(1, 7).string('Agent Email').style(styleh);
                        worksheet.cell(1, 8).string('Agent Contact Number').style(styleh);
                        worksheet.cell(1, 9).string('Sale Manager Code').style(styleh);
                        worksheet.cell(1, 10).string('Sale Manager Name').style(styleh);
                        worksheet.cell(1, 11).string('Type of Business').style(styleh);
                        worksheet.cell(1, 12).string('Policy Type').style(styleh);
                        worksheet.cell(1, 13).string('TP Policy Number').style(styleh);
                        worksheet.cell(1, 14).string('TP Insurance Company Name').style(styleh);
                        worksheet.cell(1, 15).string('Policy Start Date (DD/MM/YYYY)').style(styleh);
                        worksheet.cell(1, 16).string('Policy Start Time').style(styleh);
                        worksheet.cell(1, 17).string('Policy End Date (DD/MM/YYYY)').style(styleh);
                        worksheet.cell(1, 18).string('Policy End Time').style(styleh);
                        worksheet.cell(1, 19).string('OwnDamage Policy Period').style(styleh);
                        worksheet.cell(1, 20).string('TP Policy Period').style(styleh);
                        worksheet.cell(1, 21).string('Add-On Policy Period').style(styleh);
                        worksheet.cell(1, 22).string('Main Applicant (Proposer) Type').style(styleh);
                        worksheet.cell(1, 23).string('Kind of Policy').style(styleh);
                        worksheet.cell(1, 24).string('Previous Insurance Policy?').style(styleh);
                        worksheet.cell(1, 25).string('Previous Insurance Company Name').style(styleh);
                        worksheet.cell(1, 26).string('Previous Insurance Company Address').style(styleh);
                        worksheet.cell(1, 27).string('Previous Policy Start Date').style(styleh);
                        worksheet.cell(1, 28).string('Previous Policy End Date').style(styleh);
                        worksheet.cell(1, 29).string('Previous Policy No').style(styleh);
                        worksheet.cell(1, 30).string('Claims in Prev Policy').style(styleh);
                        worksheet.cell(1, 31).string('Nature of Loss').style(styleh);
                        worksheet.cell(1, 32).string('Make').style(styleh);
                        worksheet.cell(1, 33).string('Model').style(styleh);
                        worksheet.cell(1, 34).string('Variant').style(styleh);
                        worksheet.cell(1, 35).string('Cubic Capacity').style(styleh);
                        worksheet.cell(1, 36).string('Licenced Seating Capacity').style(styleh);
                        worksheet.cell(1, 37).string('Fuel Type').style(styleh);
                        worksheet.cell(1, 38).string('New Or Used?').style(styleh);
                        worksheet.cell(1, 39).string('Year of Manufacture').style(styleh);
                        worksheet.cell(1, 40).string('Registration Date').style(styleh);
                        worksheet.cell(1, 41).string('Vehicle Age').style(styleh);
                        worksheet.cell(1, 42).string('Engine Number').style(styleh);
                        worksheet.cell(1, 43).string('Chassis Number').style(styleh);
                        worksheet.cell(1, 44).string('Fibre Glass Fuel Tank').style(styleh);
                        worksheet.cell(1, 45).string('Bodystyle Description').style(styleh);
                        worksheet.cell(1, 46).string('Body Type').style(styleh);
                        worksheet.cell(1, 47).string('Transmission Type').style(styleh);
                        worksheet.cell(1, 48).string('Handicapped').style(styleh);
                        worksheet.cell(1, 49).string('Certified Vintage Car').style(styleh);
                        worksheet.cell(1, 50).string('Anti-theft Device Installed').style(styleh);
                        worksheet.cell(1, 51).string('Automobile Association Member?').style(styleh);
                        worksheet.cell(1, 52).string('State Code Required').style(styleh);
                        worksheet.cell(1, 53).string('District Code').style(styleh);
                        worksheet.cell(1, 54).string('Vehicle Series Number').style(styleh);
                        worksheet.cell(1, 55).string('Registration Number').style(styleh);
                        worksheet.cell(1, 56).string('Vehicle Registration Number Required').style(styleh);
                        worksheet.cell(1, 57).string('RTO State').style(styleh);
                        worksheet.cell(1, 58).string('RTO City / District').style(styleh);
                        worksheet.cell(1, 59).string('Cluster Zone').style(styleh);
                        worksheet.cell(1, 60).string('Transfer of NCB').style(styleh);
                        worksheet.cell(1, 61).string('Transfer of NCB%').style(styleh);
                        worksheet.cell(1, 62).string('Proof document date').style(styleh);
                        worksheet.cell(1, 63).string('Proof Provided for NCB').style(styleh);
                        worksheet.cell(1, 64).string('Applicable NCB').style(styleh);
                        worksheet.cell(1, 65).string('Own Damage Basic').style(styleh);
                        worksheet.cell(1, 66).string('Voluntry Deductible').style(styleh);
                        worksheet.cell(1, 67).string('Voluntry Discount').style(styleh);
                        worksheet.cell(1, 68).string('Exshowroom Price').style(styleh);
                        worksheet.cell(1, 69).string('IDV Value').style(styleh);
                        worksheet.cell(1, 70).string('Original IDV Value').style(styleh);
                        worksheet.cell(1, 71).string('Non Electrical Accessories').style(styleh);
                        worksheet.cell(1, 72).string('Accessory Description').style(styleh);
                        worksheet.cell(1, 73).string('Value of Accessory').style(styleh);
                        worksheet.cell(1, 74).string('Electrical / Electronic Accessories').style(styleh);
                        worksheet.cell(1, 75).string('Accessory Description').style(styleh);
                        worksheet.cell(1, 76).string('Value of Accessory').style(styleh);
                        worksheet.cell(1, 77).string('CNG /LPG Gas Kit').style(styleh);
                        worksheet.cell(1, 78).string('Accessory Description').style(styleh);
                        worksheet.cell(1, 79).string('Value of Kit').style(styleh);
                        worksheet.cell(1, 80).string('Internal CNG /LPG Gas Kit').style(styleh);
                        worksheet.cell(1, 81).string('Basic Third Party Liability').style(styleh);
                        worksheet.cell(1, 82).string('Third Party Property Damage Limit').style(styleh);
                        worksheet.cell(1, 83).string('Trailer TP SI').style(styleh);
                        worksheet.cell(1, 84).string('Geographical Area Extension of Liability').style(styleh);
                        worksheet.cell(1, 85).string('Legal Liability Employees').style(styleh);
                        worksheet.cell(1, 86).string('No of Employees').style(styleh);
                        worksheet.cell(1, 87).string('Legal Liability Paid Drivers').style(styleh);
                        worksheet.cell(1, 88).string('Number of Paid Drivers').style(styleh);
                        worksheet.cell(1, 89).string('PA Owner Driver').style(styleh);
                        worksheet.cell(1, 90).string('Sum Insured').style(styleh);
                        worksheet.cell(1, 91).string('PA for Unnamed Passenger').style(styleh);
                        worksheet.cell(1, 92).string('Sum Insured Per Person').style(styleh);
                        worksheet.cell(1, 93).string('Total Sum Insured').style(styleh);
                        worksheet.cell(1, 94).string('CNG LPG Kit Liability').style(styleh);
                        worksheet.cell(1, 95).string('Invoice Value Protect').style(styleh);
                        worksheet.cell(1, 96).string('Key and Locks Protect').style(styleh);
                        worksheet.cell(1, 97).string('NCB Protect').style(styleh);
                        worksheet.cell(1, 98).string('Depreciation Protect').style(styleh);
                        worksheet.cell(1, 99).string('Engine Protect').style(styleh);
                        worksheet.cell(1, 100).string('Consumable Expenses Protect').style(styleh);
                        worksheet.cell(1, 101).string('Mandatory Deduction Protect').style(styleh);
                        worksheet.cell(1, 102).string('Road Side Assistance').style(styleh);
                        worksheet.cell(1, 103).string('Personal Belongings Protect').style(styleh);
                        worksheet.cell(1, 104).string('Personal Accident Protect').style(styleh);
                        worksheet.cell(1, 105).string('Required Discount/Loading (%)').style(styleh);
                        worksheet.cell(1, 106).string('Allowable Discount/Loading').style(styleh);
                        worksheet.cell(1, 107).string('Finance Type').style(styleh);
                        worksheet.cell(1, 108).string('Financier Name').style(styleh);
                        worksheet.cell(1, 109).string('Branch Name and Address').style(styleh);
                        worksheet.cell(1, 110).string('IDV Value').style(styleh);
                        worksheet.cell(1, 111).string('Policy Start Date Lease').style(styleh);
                        worksheet.cell(1, 112).string('Comment to U/W').style(styleh);
                        worksheet.cell(1, 113).string('Main Applicant (Proposer) Type').style(styleh);
                        worksheet.cell(1, 114).string('Salutation').style(styleh);
                        worksheet.cell(1, 115).string('First Name').style(styleh);
                        worksheet.cell(1, 116).string('Middle Name').style(styleh);
                        worksheet.cell(1, 117).string('Last Name').style(styleh);
                        worksheet.cell(1, 118).string('Gender').style(styleh);
                        worksheet.cell(1, 119).string('Marital Status').style(styleh);
                        worksheet.cell(1, 120).string('Date of Birth').style(styleh);
                        worksheet.cell(1, 121).string('Nationality').style(styleh);
                        worksheet.cell(1, 122).string('Current Address line 1').style(styleh);
                        worksheet.cell(1, 123).string('Current Address line 2').style(styleh);
                        worksheet.cell(1, 124).string('Current Address line 3').style(styleh);
                        worksheet.cell(1, 125).string('Current Country').style(styleh);
                        worksheet.cell(1, 126).string('Pincode').style(styleh);
                        worksheet.cell(1, 127).string('Current City').style(styleh);
                        worksheet.cell(1, 128).string('Current State').style(styleh);
                        worksheet.cell(1, 129).string('PAN').style(styleh);
                        worksheet.cell(1, 130).string('GST').style(styleh);
                        worksheet.cell(1, 131).string('Aadhaar No').style(styleh);
                        worksheet.cell(1, 132).string('Mobile Number').style(styleh);
                        worksheet.cell(1, 133).string('Email Id').style(styleh);
                        worksheet.cell(1, 134).string('Occupation').style(styleh);
                        worksheet.cell(1, 135).string('Nominee Name').style(styleh);
                        worksheet.cell(1, 136).string('Relationship with Applicant').style(styleh);
                        worksheet.cell(1, 137).string('Other').style(styleh);
                        worksheet.cell(1, 138).string('Date of Birth').style(styleh);
                        worksheet.cell(1, 139).string('Is Nominee Minor?').style(styleh);
                        worksheet.cell(1, 140).string('Guardian Name').style(styleh);
                        worksheet.cell(1, 141).string('Inspection Number').style(styleh);
                        worksheet.cell(1, 142).string('PUC Number').style(styleh);
                        worksheet.cell(1, 143).string('PUC Expiry Date').style(styleh);
                        worksheet.cell(1, 144).string('Is Registration Address Same').style(styleh);
                        worksheet.cell(1, 145).string('Registration Address line 1').style(styleh);
                        worksheet.cell(1, 146).string('Reg_ Address line 2').style(styleh);
                        worksheet.cell(1, 147).string('Reg_ Address line 3').style(styleh);
                        worksheet.cell(1, 148).string('Reg_ Country').style(styleh);
                        worksheet.cell(1, 149).string('Reg_Pincode').style(styleh);
                        worksheet.cell(1, 150).string('Reg_City').style(styleh);
                        worksheet.cell(1, 151).string('Reg_State').style(styleh);
                        worksheet.cell(1, 152).string('State Code').style(styleh);
                        worksheet.cell(1, 153).string('Own Damage Basic').style(styleh);
                        worksheet.cell(1, 154).string('Non Electrical Accessories').style(styleh);
                        worksheet.cell(1, 155).string('Electrical / Electronic Accessories').style(styleh);
                        worksheet.cell(1, 156).string('CNG /LPG Gas Kit').style(styleh);
                        worksheet.cell(1, 157).string('No Claim Bonus Discount Amount').style(styleh); //Add
                        worksheet.cell(1, 158).string('Total').style(styleh);
                        worksheet.cell(1, 159).string('Basic Third Party Liability').style(styleh);
                        worksheet.cell(1, 160).string('Legal Liability Employees').style(styleh);
                        worksheet.cell(1, 161).string('Legal Liability Paid Drivers').style(styleh);
                        worksheet.cell(1, 162).string('PA Owner Driver').style(styleh);
                        worksheet.cell(1, 163).string('PA for Unnamed Passenger').style(styleh);
                        worksheet.cell(1, 164).string('CNG LPG Kit Liability').style(styleh);
                        worksheet.cell(1, 165).string('Total').style(styleh);
                        worksheet.cell(1, 166).string('Invoice Value Protect').style(styleh);
                        worksheet.cell(1, 167).string('Key and Locks Protect').style(styleh);
                        worksheet.cell(1, 168).string('NCB Protect').style(styleh);
                        worksheet.cell(1, 169).string('Depreciation Protect').style(styleh);
                        worksheet.cell(1, 170).string('Engine Protect').style(styleh);
                        worksheet.cell(1, 171).string('Consumable Expenses Protect').style(styleh);
                        worksheet.cell(1, 172).string('Mandatory Deduction Protect').style(styleh);
                        worksheet.cell(1, 173).string('Road Side Assistance').style(styleh);
                        worksheet.cell(1, 174).string('Personal Belongings Protect').style(styleh);
                        worksheet.cell(1, 175).string('Personal Accident Protect').style(styleh);
                        worksheet.cell(1, 176).string('Total').style(styleh);
                        worksheet.cell(1, 177).string('Net Premium').style(styleh);
                        worksheet.cell(1, 178).string('SGST').style(styleh); //Add
                        worksheet.cell(1, 179).string('CGST').style(styleh); //Add
                        worksheet.cell(1, 180).string('IGST').style(styleh);
                        worksheet.cell(1, 181).string('Final Premium').style(styleh);
                        worksheet.cell(1, 182).string('Receipt_Number').style(styleh);
                        worksheet.cell(1, 183).string('NEFT').style(styleh);
                        worksheet.cell(1, 184).string('NEFT From').style(styleh);
                        worksheet.cell(1, 185).string('Bank Name').style(styleh);
                        worksheet.cell(1, 186).string('Instrument No.').style(styleh);
                        worksheet.cell(1, 187).string('Account No.').style(styleh);
                        worksheet.cell(1, 188).string('Account Holder').style(styleh);
                        worksheet.cell(1, 189).string('Instrument Date').style(styleh);
                        worksheet.cell(1, 190).string('Amount').style(styleh);
                        worksheet.cell(1, 191).string('Sub Intermediary Category').style(styleh);
                        worksheet.cell(1, 192).string('Sub Intermediary Code').style(styleh);
                        worksheet.cell(1, 193).string('Sub Intermediary Name').style(styleh);
                        worksheet.cell(1, 194).string('Sub Intermediary Phone Email').style(styleh);
                        worksheet.cell(1, 195).string('POSP PAN Aadhar No').style(styleh);
                        worksheet.cell(1, 196).string('Previous Policy TP Tenure').style(styleh);//Active TP Policy Period for SAOD
                        worksheet.cell(1, 197).string('TP Policy Start Date').style(styleh);
                        worksheet.cell(1, 198).string('TP Policy End Date').style(styleh);
                        worksheet.cell(1, 199).string('ekycValidateKey').style(styleh);
                        //row 2
                        worksheet.cell(2, 1).string(moment(objProduct.lm_request['pg_reference_number_1']).format('DD/MM/YYYY').toString()); // moment(dbUserData.Erp_Qt_Request_Core['___policy_start_date___']).format("DD/MM/YYYY")
                        worksheet.cell(2, 2).string(objProduct.lm_request['policy_number']); //Incorrect Policy Number
                        worksheet.cell(2, 3).string(dbUserData.Erp_Qt_Request_Core['___crn___']);
                        worksheet.cell(2, 4).string('Mumbai HO');
                        worksheet.cell(2, 5).string('2210001201');
                        worksheet.cell(2, 6).string('Landmark Insurance Brokers Pvt Ltd');
                        worksheet.cell(2, 7).string('customercare@policyboss.com');
                        worksheet.cell(2, 8).string('1800-419-4199');
                        worksheet.cell(2, 9).string('25159');
                        worksheet.cell(2, 10).string('Abirami Iyer');
                        worksheet.cell(2, 11).string(dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_type___'] === "renew" ? "Rollover" : "New"); //Rollover/ NEW
                        worksheet.cell(2, 12).string(dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1CH_0TP" ? "Package" : (dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? "Standalone Own Damage(Addon-Optional)" : "Liability Only")); //Package/ Liability/ Standalone Own Damage(Addon-Optional)
                        worksheet.cell(2, 13).string(dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? dbUserData.Erp_Qt_Request_Core['___tp_policy_number___'] : '');
                        worksheet.cell(2, 14).string(dbUserData.Erp_Qt_Request_Core['___tp_insurer_name___']);
                        worksheet.cell(2, 15).string(moment(dbUserData.Erp_Qt_Request_Core['___policy_start_date___']).format("DD/MM/YYYY"));
                        worksheet.cell(2, 16).string('00:00 AM');
                        worksheet.cell(2, 17).string(moment(dbUserData.Erp_Qt_Request_Core['___policy_end_date___']).format("DD/MM/YYYY"));
                        worksheet.cell(2, 18).string('11:59 PM');
                        worksheet.cell(2, 19).string(dbUserData.Erp_Qt_Request_Core['___policy_od_tenure___']);
                        worksheet.cell(2, 20).string(dbUserData.Erp_Qt_Request_Core['___policy_tp_tenure___']);
                        worksheet.cell(2, 21).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_final_premium___'] > 0 ? '1' : '0');
                        worksheet.cell(2, 22).string(dbUserData.Erp_Qt_Request_Core['___vehicle_registration_type___'] === "individual" ? "Person" : "Organisation"); //Person/Organisation
                        worksheet.cell(2, 23).string(dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1CH_0TP" ? "Package" : (dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? "Standalone OD" : "Liability Only")); //Package/ Liability/ Standalone OD
                        worksheet.cell(2, 24).string(dbUserData.Erp_Qt_Request_Core['___is_policy_exist___']);
                        worksheet.cell(2, 25).string(objProduct.insurer_master.prev_insurer.pb_db_master['Insurer_Name']); //Previous Insurance Company Name //STill to be done
                        worksheet.cell(2, 26).string('Mumbai'); //Previous Insurance Company Address
                        worksheet.cell(2, 27).string(moment(dbUserData.Premium_List.Summary.Request_Product['pre_policy_start_date']).format("DD/MM/YYYY")); //Previous Policy Start Date
                        worksheet.cell(2, 28).string(moment(dbUserData.Erp_Qt_Request_Core['___policy_expiry_date___']).format("DD/MM/YYYY"));
                        worksheet.cell(2, 29).string(dbUserData.Erp_Qt_Request_Core['___previous_policy_number___']);
                        worksheet.cell(2, 30).string(dbUserData.Erp_Qt_Request_Core['___is_claim_exists___']);
                        worksheet.cell(2, 31).string(''); // Optional Nature of Loss Keep it Blank
                        worksheet.cell(2, 32).string(dbUserData.Processed_Request['___dbmaster_insurer_vehicle_make_name___']);
                        worksheet.cell(2, 33).string(dbUserData.Processed_Request['___dbmaster_insurer_vehicle_model_name___']);
                        worksheet.cell(2, 34).string(dbUserData.Processed_Request['___dbmaster_insurer_vehicle_variant_name___']);
                        worksheet.cell(2, 35).string(dbUserData.Processed_Request['___dbmaster_insurer_vehicle_cubiccapacity___']);
                        worksheet.cell(2, 36).string(dbUserData.Processed_Request['___dbmaster_insurer_vehicle_seatingcapacity___']);
                        worksheet.cell(2, 37).string(dbUserData.Processed_Request['___dbmaster_insurer_vehicle_fueltype___']);
                        worksheet.cell(2, 38).string('Used'); //New Or Used?
                        worksheet.cell(2, 39).string(dbUserData.Erp_Qt_Request_Core['___vehicle_manf_year___']);
                        worksheet.cell(2, 40).string(moment(dbUserData.Erp_Qt_Request_Core['___vehicle_registration_date___']).format("DD/MM/YYYY"));
                        worksheet.cell(2, 41).string(dbUserData.Premium_List.Summary.Request_Product['vehicle_age_year'].toString()); //As per the vehicle Age
                        worksheet.cell(2, 42).string(dbUserData.Erp_Qt_Request_Core['___engine_number___']);
                        worksheet.cell(2, 43).string(dbUserData.Erp_Qt_Request_Core['___chassis_number___']);
                        worksheet.cell(2, 44).string('');
                        worksheet.cell(2, 45).string('');
                        worksheet.cell(2, 46).string('');
                        worksheet.cell(2, 47).string('Gear');
                        worksheet.cell(2, 48).string('');
                        worksheet.cell(2, 49).string('');
                        worksheet.cell(2, 50).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_disc_anti_theft___'] > 0 ? "Yes" : "No"); //dbUserData.Erp_Qt_Request_Core['___is_antitheft_fit___']
                        worksheet.cell(2, 51).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_disc_aai___'] > 0 ? "Yes" : "No"); //dbUserData.Erp_Qt_Request_Core['___is_aai_member___']
                        worksheet.cell(2, 52).string(dbUserData.Erp_Qt_Request_Core['___registration_no_1___']);
                        worksheet.cell(2, 53).string(dbUserData.Erp_Qt_Request_Core['___registration_no_2___']);
                        worksheet.cell(2, 54).string(dbUserData.Erp_Qt_Request_Core['___registration_no_3___']);
                        worksheet.cell(2, 55).string(dbUserData.Erp_Qt_Request_Core['___registration_no_4___']);
                        worksheet.cell(2, 56).string(dbUserData.Erp_Qt_Request_Core['___registration_no___']);
                        worksheet.cell(2, 57).string(dbUserData.Erp_Qt_Request_Core['___permanent_state___']);
                        worksheet.cell(2, 58).string(dbUserData.Processed_Request['___dbmaster_insurer_rto_city_name___'].toString()); //dbUserData.Erp_Qt_Request_Core['___pb_rto_city___']
                        worksheet.cell(2, 59).string(dbUserData.Processed_Request['___dbmaster_insurer_rto_zone_code___'].toString()); //dbUserData.Erp_Qt_Request_Core['___pb_vehicletariff_zone___']
                        worksheet.cell(2, 60).string(dbUserData.Erp_Qt_Request_Core['___is_claim_exists___'] === "yes" ? "NO" : "Yes"); //Transfer of NCB Yes/ NO
                        worksheet.cell(2, 61).string(dbUserData.Erp_Qt_Request_Core['___vehicle_ncb_current___'] + '%'); //Transfer of NCB If yes, then previous yr NCB in %
                        worksheet.cell(2, 62).string(moment(dbUserData.Erp_Qt_Request_Core['___policy_expiry_date___']).format("DD/MM/YYYY")); //Previous policy end date
                        worksheet.cell(2, 63).string('NCB declaration'); //NCB declaration (hard coded)
                        worksheet.cell(2, 64).string(dbUserData.Premium_List.Summary.Request_Product['vehicle_ncb_next'] + '%'); //Current year NCB
                        worksheet.cell(2, 65).string(''); //Keep it blank
                        worksheet.cell(2, 66).string("0");
                        worksheet.cell(2, 67).string("0");
                        worksheet.cell(2, 68).string(dbUserData.Processed_Request['___dbmaster_insurer_vehicle_exshowroom___'].toString()); //Exshowroom Price
                        worksheet.cell(2, 69).string(dbUserData.Erp_Qt_Request_Core['___vehicle_expected_idv___'].toString()); //IDV Value
                        worksheet.cell(2, 70).string(dbUserData.Processed_Request['___vehicle_normal_idv___'].toString()); //Original IDV Value;
                        worksheet.cell(2, 71).string(dbUserData.Erp_Qt_Request_Core['___non_electrical_accessory___'].toString() === "0" ? "NO" : "Yes"); //Yes or NO
                        worksheet.cell(2, 72).string('Non electrical accessories'); //Non electrical accessories (Hard coded)
                        worksheet.cell(2, 73).string(dbUserData.Erp_Qt_Request_Core['___non_electrical_accessory___'].toString());
                        worksheet.cell(2, 74).string(dbUserData.Erp_Qt_Request_Core['___electrical_accessory___'].toString() === "0" ? "NO" : "Yes"); //Yes or NO
                        worksheet.cell(2, 75).string('electrical accessories'); //electrical accessories (Hard coded)
                        worksheet.cell(2, 76).string(dbUserData.Erp_Qt_Request_Core['___electrical_accessory___'].toString());
                        worksheet.cell(2, 77).string(dbUserData.Erp_Qt_Request_Core['___is_external_bifuel___'].toString()); //Yes or NO
                        worksheet.cell(2, 78).string(dbUserData.Erp_Qt_Request_Core['___external_bifuel_type___'] ? dbUserData.Erp_Qt_Request_Core['___external_bifuel_type___'].toString() : ""); //CNG/ LPG
                        worksheet.cell(2, 79).string(dbUserData.Erp_Qt_Request_Core['___external_bifuel_value___'].toString());
                        worksheet.cell(2, 80).string(["LPG", "CNG"].indexOf(dbUserData.Processed_Request['___dbmaster_insurer_vehicle_fueltype___']) > -1 ? "Yes" : "NO"); //Internal CNG /LPG Gas Kit  //Yes or NO
                        worksheet.cell(2, 81).string(dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? "0" : "750000"); //LIMIT needs to be mentioned //Basic Third Party Liability Limit
                        worksheet.cell(2, 82).string(dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? "0" : (dbUserData.Erp_Qt_Request_Core['___is_tppd___'] === "no" ? "0" : "750000")); //LIMIT needs to be mentioned //Third Party Property Damage Limit
                        worksheet.cell(2, 83).string('');
                        worksheet.cell(2, 84).string('');
                        worksheet.cell(2, 85).string('No'); //Legal Liability Employees
                        worksheet.cell(2, 86).string('');
                        worksheet.cell(2, 87).string(dbUserData.Erp_Qt_Request_Core['___is_llpd___']);
                        worksheet.cell(2, 88).string(dbUserData.Erp_Qt_Request_Core['___is_llpd___'].toString() === "yes" ? "1" : "0");
                        worksheet.cell(2, 89).string(dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? "No" : (dbUserData.Erp_Qt_Request_Core['___is_pa_od___'].toString() === "yes" ? "Yes" : "No")); //PA Owner Driver //Yes And No
                        worksheet.cell(2, 90).string(dbUserData.Erp_Qt_Request_Core['___pa_owner_driver_si___']);
                        //Done Till Here IDV Still Not Done
                        worksheet.cell(2, 91).string(dbUserData.Processed_Request['___pa_unnamed_passenger_si___'] === "" ? "No" : "Yes"); //PA for Unnamed Passenger yes and no
                        worksheet.cell(2, 92).string(dbUserData.Processed_Request['___pa_unnamed_passenger_si___'] === "" ? "0" : dbUserData.Processed_Request['___pa_unnamed_passenger_si___']); //Sum Insured Per Person   If yes, the PA SI per person
                        if (dbUserData.Processed_Request['___pa_unnamed_passenger_si___'] === "") {
                            worksheet.cell(2, 93).string('0');
                        } else {
                            worksheet.cell(2, 93).string((parseInt(dbUserData.Processed_Request['___pa_unnamed_passenger_si___']) * parseInt(dbUserData.Processed_Request['___dbmaster_insurer_vehicle_seatingcapacity___'])).toString()); //Total Sum Insured
                        }
                        //to be check
                        worksheet.cell(2, 94).string(["CNG", "LPG"].indexOf(dbUserData.Processed_Request['___dbmaster_insurer_vehicle_fueltype___']) > -1 ? "Yes" : "No"); //CNG LPG Kit Liability
                        worksheet.cell(2, 95).string(dbUserData.Erp_Qt_Request_Core['___addon_invoice_price_cover___'].toString()); //Invoice Value Protect yes or no
                        worksheet.cell(2, 96).string(dbUserData.Erp_Qt_Request_Core['___addon_key_lock_cover___'].toString()); //Key and Locks Protect yes or no
                        worksheet.cell(2, 97).string(dbUserData.Erp_Qt_Request_Core['___addon_ncb_protection_cover___'].toString()); //NCB Protect yes or no
                        worksheet.cell(2, 98).string(dbUserData.Erp_Qt_Request_Core['___addon_zero_dep_cover___'].toString()); //Depreciation Protect yes or no
                        worksheet.cell(2, 99).string(dbUserData.Erp_Qt_Request_Core['___addon_engine_protector_cover___'].toString()); //Engine Protect yes or no
                        worksheet.cell(2, 100).string(dbUserData.Erp_Qt_Request_Core['___addon_consumable_cover___'].toString()); //Consumable Expenses Protect yes or no
                        worksheet.cell(2, 101).string(mdp_prm > 0 ? "yes" : "no"); //Mandatory Deduction Protect yes or no
                        worksheet.cell(2, 102).string(dbUserData.Erp_Qt_Request_Core['___addon_road_assist_cover___'].toString()); //Road Side Assistance yes or no
                        worksheet.cell(2, 103).string(dbUserData.Erp_Qt_Request_Core['___addon_personal_belonging_loss_cover___'].toString()); //Personal Belongings Protect yes or no
                        worksheet.cell(2, 104).string('no'); //Personal Accident Protect yes or no
                        worksheet.cell(2, 105).string(dbUserData.Processed_Request['___own_damage_disc_rate___'].toString()); //Required Discount/Loading (%) AS per GRID Shared
                        worksheet.cell(2, 106).string(dbUserData.Processed_Request['___own_damage_disc_rate___'].toString()); //Allowable Discount/Loading AS per GRID Shared
                        worksheet.cell(2, 107).string(dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___'] === "0" ? "" : dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___']); //Hypothecation or blank
                        worksheet.cell(2, 108).string(dbUserData.Erp_Qt_Request_Core['___financial_institute_name___']);
                        worksheet.cell(2, 109).string(dbUserData.Erp_Qt_Request_Core['___financial_institute_city___']);
                        worksheet.cell(2, 110).string(dbUserData.Erp_Qt_Request_Core['___vehicle_expected_idv___'].toString()); //IDV Value
                        worksheet.cell(2, 111).string('');
                        worksheet.cell(2, 112).string('');
                        worksheet.cell(2, 113).string(dbUserData.Processed_Request['___vehicle_registration_type___']); //Main Applicant (Proposer) Type Person/ Organisation
                        worksheet.cell(2, 114).string(dbUserData.Erp_Qt_Request_Core['___salutation___']);
                        worksheet.cell(2, 115).string(dbUserData.Erp_Qt_Request_Core['___first_name___']);
                        worksheet.cell(2, 116).string(dbUserData.Erp_Qt_Request_Core['___middle_name___']);
                        worksheet.cell(2, 117).string(dbUserData.Erp_Qt_Request_Core['___last_name___']);
                        worksheet.cell(2, 118).string(dbUserData.Erp_Qt_Request_Core['___gender___'] === "M" ? "Male" : (dbUserData.Erp_Qt_Request_Core['___gender___'] === "F" ? "Female" : "Unknown"));
                        worksheet.cell(2, 119).string(dbUserData.Erp_Qt_Request_Core['___marital_text___']);
                        var cust_dob = dbUserData.Erp_Qt_Request_Core['___birth_date___'].split("-");
                        worksheet.cell(2, 120).string(cust_dob[2] + '/' + cust_dob[1] + '/' + cust_dob[0]); //Mandatory DD/MM/YYYY
                        worksheet.cell(2, 121).string('Indian');
                        worksheet.cell(2, 122).string(dbUserData.Erp_Qt_Request_Core['___communication_address_1___']);
                        worksheet.cell(2, 123).string(dbUserData.Erp_Qt_Request_Core['___communication_address_2___']);
                        worksheet.cell(2, 124).string(dbUserData.Erp_Qt_Request_Core['___communication_address_3___']);
                        worksheet.cell(2, 125).string('India');
                        worksheet.cell(2, 126).string(dbUserData.Erp_Qt_Request_Core['___communication_pincode___']);
                        worksheet.cell(2, 127).string(dbUserData.Erp_Qt_Request_Core['___communication_city___']);
                        worksheet.cell(2, 128).string(dbUserData.Erp_Qt_Request_Core['___communication_state___']);
                        worksheet.cell(2, 129).string(dbUserData.Erp_Qt_Request_Core['___pan___']);
                        worksheet.cell(2, 130).string(dbUserData.Erp_Qt_Request_Core['___gst_no___']);
                        worksheet.cell(2, 131).string(dbUserData.Erp_Qt_Request_Core['___aadhar___']);
                        worksheet.cell(2, 132).string(dbUserData.Erp_Qt_Request_Core['___mobile___']);
                        worksheet.cell(2, 133).string(dbUserData.Erp_Qt_Request_Core['___email___']);
                        worksheet.cell(2, 134).string(dbUserData.Erp_Qt_Request_Core['___occupation___']);
                        worksheet.cell(2, 135).string(dbUserData.Erp_Qt_Request_Core['___nominee_name___']);
                        worksheet.cell(2, 136).string(dbUserData.Erp_Qt_Request_Core['___nominee_relation___']);
                        worksheet.cell(2, 137).string('');
                        var nominee_dob = dbUserData.Erp_Qt_Request_Core['___nominee_birth_date___'].split("-");
                        worksheet.cell(2, 138).string(nominee_dob[2] + '/' + nominee_dob[1] + '/' + nominee_dob[0]);
                        worksheet.cell(2, 139).string('no');
                        worksheet.cell(2, 140).string('');
                        worksheet.cell(2, 141).string('');
                        worksheet.cell(2, 142).string('');
                        worksheet.cell(2, 143).string('');
                        worksheet.cell(2, 144).string(''); //Is Registration Address Same //Yes or Blank
                        worksheet.cell(2, 145).string(dbUserData.Erp_Qt_Request_Core['___permanent_address_1___']);
                        worksheet.cell(2, 146).string(dbUserData.Erp_Qt_Request_Core['___permanent_address_2___']);
                        worksheet.cell(2, 147).string(dbUserData.Erp_Qt_Request_Core['___permanent_address_3___']);
                        worksheet.cell(2, 148).string('India');
                        worksheet.cell(2, 149).string(dbUserData.Erp_Qt_Request_Core['___permanent_pincode___']);
                        worksheet.cell(2, 150).string(dbUserData.Erp_Qt_Request_Core['___permanent_city___']);
                        worksheet.cell(2, 151).string(dbUserData.Erp_Qt_Request_Core['___permanent_state___']);
                        worksheet.cell(2, 152).string('');
                        worksheet.cell(2, 153).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_basic___'].toString());
                        worksheet.cell(2, 154).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_non_elect_access___'].toString());
                        worksheet.cell(2, 155).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_elect_access___'].toString());
                        worksheet.cell(2, 156).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_cng_lpg___'].toString());
                        worksheet.cell(2, 157).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_disc_ncb___'].toString()); // NCB Discount Amount
                        worksheet.cell(2, 158).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_final_premium___'].toString());
                        worksheet.cell(2, 159).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_basic___'].toString());
                        worksheet.cell(2, 160).string('');
                        worksheet.cell(2, 161).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cover_paid_driver_ll___'].toString());
                        worksheet.cell(2, 162).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cover_owner_driver_pa___'].toString());
                        worksheet.cell(2, 163).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cover_unnamed_passenger_pa___'].toString());
                        worksheet.cell(2, 164).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cng_lpg___'].toString());
                        worksheet.cell(2, 165).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_final_premium___'].toString());
                        worksheet.cell(2, 166).string(dbUserData.Erp_Qt_Request_Core['___addon_invoice_price_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_invoice_price_cover___'].toString() : "0");
                        worksheet.cell(2, 167).string(dbUserData.Erp_Qt_Request_Core['___addon_key_lock_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_key_lock_cover___'].toString() : "0");
                        worksheet.cell(2, 168).string(dbUserData.Erp_Qt_Request_Core['___addon_ncb_protection_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_ncb_protection_cover___'].toString() : "0");
                        worksheet.cell(2, 169).string(dbUserData.Erp_Qt_Request_Core['___addon_zero_dep_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_zero_dep_cover___'].toString() : "0");
                        worksheet.cell(2, 170).string(dbUserData.Erp_Qt_Request_Core['___addon_engine_protector_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_engine_protector_cover___'].toString() : "0");
                        worksheet.cell(2, 171).string(dbUserData.Erp_Qt_Request_Core['___addon_consumable_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_consumable_cover___'].toString() : "0");
                        worksheet.cell(2, 172).string(mdp_prm > 0 ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_mandatory_deduction_protect___'].toString() : "0"); //Mandatory Deduction Protect
                        worksheet.cell(2, 173).string(dbUserData.Erp_Qt_Request_Core['___addon_road_assist_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_road_assist_cover___'].toString() : "0");
                        worksheet.cell(2, 174).string(dbUserData.Erp_Qt_Request_Core['___addon_personal_belonging_loss_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_personal_belonging_loss_cover___'].toString() : "0");
                        worksheet.cell(2, 175).string('0'); //Personal Accident Protect
                        worksheet.cell(2, 176).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_final_premium___'].toString());
                        worksheet.cell(2, 177).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_net_premium___'].toString());
                        worksheet.cell(2, 178).string(Erp_Qt_Request_Core['___communication_state___'] === "MAHARASHTRA" ? ((((dbUserData.Erp_Qt_Request_Core['___tax___'] - 0) / 2).toFixed(2).toString()).split('.')[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")) : "0"); //Add SGST
                        worksheet.cell(2, 179).string(Erp_Qt_Request_Core['___communication_state___'] === "MAHARASHTRA" ? ((((dbUserData.Erp_Qt_Request_Core['___tax___'] - 0) / 2).toFixed(2).toString()).split('.')[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,")) : "0"); //Add CGST
                        worksheet.cell(2, 180).string(Erp_Qt_Request_Core['___communication_state___'] === "MAHARASHTRA" ? "0" : ((((dbUserData.Erp_Qt_Request_Core['___tax___'] - 0) / 1).toFixed(2).toString()).split('.')[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"))); // IGST
                        worksheet.cell(2, 181).string(dbUserData.Erp_Qt_Request_Core['___premium_breakup_final_premium___'].toString());
                        worksheet.cell(2, 182).string(objProduct.lm_request['policy_number']).style(styleh);
                        worksheet.cell(2, 183).string('NEFT');
                        worksheet.cell(2, 184).string(dbUserData.Erp_Qt_Request_Core['___first_name___']); //Customer First Name
//                        worksheet.cell(2, 185).string('PAYU'); //
                        worksheet.cell(2, 185).string(payment_bank_name); //
                        worksheet.cell(2, 186).string(objProduct.lm_request['transaction_id'].toString()); //Transaction ID
                        worksheet.cell(2, 187).string('1234'); //1234
                        worksheet.cell(2, 188).string('ABC');
                        worksheet.cell(2, 189).string(moment(objProduct.lm_request['pg_reference_number_1']).format('DD/MM/YYYY').toString()); //Payment date //Instrument Date
                        worksheet.cell(2, 190).string(typeof objProduct.lm_request['transaction_amount'] === 'number' ? objProduct.lm_request['transaction_amount'].toString() : objProduct.lm_request['transaction_amount']);
                        if (dbUserData.Erp_Qt_Request_Core['___is_posp___'] === "yes") {
                            //if (dbUserData.Erp_Qt_Request_Core['___posp_ss_id___'] > 0) {
                            worksheet.cell(2, 191).string('POSP');
                            worksheet.cell(2, 192).string((dbUserData.Erp_Qt_Request_Core['___posp_ss_id___']).toString());
                            worksheet.cell(2, 193).string(posp_name);
                            worksheet.cell(2, 194).string('');
                            worksheet.cell(2, 195).string(posp_pan_no);
                        } else {
                            worksheet.cell(2, 191).string('NA');
                            worksheet.cell(2, 192).string('NA');
                            worksheet.cell(2, 193).string('NA');
                            worksheet.cell(2, 194).string('NA');
                            worksheet.cell(2, 195).string('NA');
                        }
                        if (dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP") {
                            worksheet.cell(2, 196).string((dbUserData.Processed_Request['___saod_tp_policy_tenure___']).toString());
                            worksheet.cell(2, 197).string(dbUserData.Erp_Qt_Request_Core['___tp_start_date___']);
                            worksheet.cell(2, 198).string(dbUserData.Erp_Qt_Request_Core['___tp_end_date___']);
                        } else {
                            worksheet.cell(2, 196).string('');
                            worksheet.cell(2, 197).string('');
                            worksheet.cell(2, 198).string('');
                        }
                        worksheet.cell(2, 199).string(dbUserData.Erp_Qt_Request_Core['___kyc_no___'].toString());
                        workbook.write(ff_loc_path_portal); //ff_loc_path_portal//ff_file_name

                        var Email = require('../../models/email');
                        var objModelEmail = new Email();
                        var sub = '[' + config.environment.name.toString().toUpperCase() + ']INFO-PolicyBoss.com-Policy Edelweiss Feed File:' + objProduct.lm_request['policy_number'];
                        email_body = '<html><body><p>Hi,</p><BR/><p>Please find the attachment of Feed File of Edelweiss Private Car Policy.</p>'
                                + '<BR><p>Policy Number : ' + objProduct.lm_request['policy_number'] + '</p><BR><p>Policy URL : ' + ff_web_path_portal + ' </p></body></html>';
                        if (config.environment.name === 'Production') {
                            //objModelEmail.send('notifications@policyboss.com', 'DeepakG.Pandey@edelweissfin.com', sub, email_body, 'Nilesh.Devlekar@edelweissfin.com', config.environment.notification_email, ''); //UAT
                        } else if (config.environment.name === 'QA') {
                            //objModelEmail.send('notifications@policyboss.com', 'DeepakG.Pandey@edelweissfin.com', sub, email_body, 'Abirami.iyer@edelweissfin.com', 'policybosstesting@gmail.com', '');//Local
                        } else {

                        }
                    }
                    if (objProduct.lm_request['product_id'] === 10) {
                        var ff_file_name = "EdelweissMotor_FeedFile_" + objProduct.lm_request['policy_number'] + ".csv";
                        var ff_loc_path_portal = appRoot + "/tmp/pdf/" + ff_file_name;
                        var ff_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + ff_file_name;
                        //var ff_web_path_portal = config.environment.weburl + config.pb_config.pdf_web_loc + ff_file_name;
                        var User_Data = require(appRoot + '/models/user_data');

                        let is_tp_only = false;
                        if (dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'].indexOf('0CH') > -1) {
                            is_tp_only = true;
                        } else {
                            is_tp_only = false;
                        }
                        var cust_dob = dbUserData.Erp_Qt_Request_Core['___birth_date___'].split("-");
                        var nominee_dob = dbUserData.Erp_Qt_Request_Core['___nominee_birth_date___'].split("-");
                        //var pay_date = objProduct.processed_request['___pg_reference_number_1___'].split("/");
                        var posp_flag_ff = "NA";
                        var posp_id_ff = "NA";
                        var posp_name_ff = "NA";
                        var posp_email_ff = "NA";
                        var posp_pan_no_ff = "NA";
                        if (dbUserData.Erp_Qt_Request_Core['___is_posp___'] === "yes") {
                            //if (dbUserData.Erp_Qt_Request_Core['___posp_ss_id___'] > 0) {
                            posp_flag_ff = "POSP";
                            posp_id_ff = (dbUserData.Erp_Qt_Request_Core['___posp_ss_id___']).toString();
                            posp_name_ff = posp_name;
                            posp_email_ff = "";
                            posp_pan_no_ff = posp_pan_no;
                        }

                        var csvjson = require('csvjson');
                        var writeFile = require('fs').writeFile;
                        var fs = require('fs');
                        var data_list = [];
                        var data_csv = {
                            "Source": "Policy Boss",
                            "Policy_Number": objProduct.lm_request['policy_number'],
                            "Agent_Login_Email_ID": "customercare@policyboss.com",
                            "Branch": "Mumbai HO",
                            "Type_of_Business": dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_type___'] === "renew" ? "Rollover" : "New", //Rollover/ NEW
                            "Policy_Type": dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1CH_0TP" ? "Package" : (dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? "Standalone Own Damage(Addon-Optional)" : "Liability Only (TP:1)"),
                            "Sub policy type": "",
                            "Policy_Start_Date": moment(dbUserData.Erp_Qt_Request_Core['___policy_start_date___']).format("DD-MM-YYYY"),
                            "Main_Applicant_Proposer_Type": dbUserData.Erp_Qt_Request_Core['___vehicle_registration_type___'] === "individual" ? "Person" : "Organisation",
                            "Previous Policy TP Tenure": "1", //If PYP was long term TP policy, TP period would be  5 otherwise pass 1
                            "Existing TP Policy Details": "",
                            "Name Of Insurer": "",
                            "Policy number": "",
                            "Policy start date": "",
                            "policy end date": "",
                            "OwnDamage Policy Period": "",
                            "TP Policy Period": dbUserData.Erp_Qt_Request_Core['___policy_tp_tenure___'],
                            "Add-On Policy Period": "",
                            "Previous Insurance Policy": (dbUserData.Erp_Qt_Request_Core['___is_policy_exist___'] === "yes" ? "Yes" : "No"),
                            "Kind of Policy": dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1CH_0TP" ? "Package" : (dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? "Standalone OD" : "Liability Only"), //Package/ Liability/ Standalone OD
                            "Previous Insurance Company Name ": (objProduct.insurer_master.prev_insurer) ? (objProduct.insurer_master.prev_insurer.insurer_db_master['PreviousInsurer_Code']) : '',
                            "Previous Insurance Company Address": "Mumbai",
                            "Previous Policy Start Date ": moment(dbUserData.Premium_List.Summary.Request_Product['pre_policy_start_date']).format("DD-MM-YYYY"),
                            "Previous Policy End Date": moment(dbUserData.Erp_Qt_Request_Core['___policy_expiry_date___']).format("DD-MM-YYYY"),
                            "Previous Policy No": dbUserData.Erp_Qt_Request_Core['___previous_policy_number___'],
                            "Nature of Loss": "",
                            "Make": dbUserData.Processed_Request['___dbmaster_insurer_vehicle_make_name___'],
                            "Model": dbUserData.Processed_Request['___dbmaster_insurer_vehicle_model_name___'],
                            "Variant": dbUserData.Processed_Request['___dbmaster_insurer_vehicle_variant_name___'],
                            "New_or_Used": "Used", //New Or Used?
                            "Year_of_Manufacture": dbUserData.Erp_Qt_Request_Core['___vehicle_manf_year___'],
                            "Registration_Date": moment(dbUserData.Erp_Qt_Request_Core['___vehicle_registration_date___']).format("DD-MM-YYYY"),
                            "Engine_Number": dbUserData.Erp_Qt_Request_Core['___engine_number___'],
                            "Chassis_Number": dbUserData.Erp_Qt_Request_Core['___chassis_number___'],
                            "Fibre_Glass_Fuel_Tank": "No",
                            "Bodystyle_Description": "",
                            "Body_Type": "",
                            "Transmission_Type": "Gear",
                            "Valid_Driving_License": dbUserData.Erp_Qt_Request_Core['___is_pa_od___'].toString() === "yes" ? "Yes" : "No",
                            "Already_Have_PA_Cover": dbUserData.Erp_Qt_Request_Core['___is_pa_od___'].toString() === "yes" ? "No" : "Yes",
                            "Handicapped": "No",
                            "Automobile_Association_Member": dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_disc_aai___'] > 0 ? "Yes" : "No", //dbUserData.Erp_Qt_Request_Core['___is_aai_member___']
                            "Anti-Theft_Device_Installed": dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_disc_anti_theft___'] > 0 ? "Yes" : "No", //dbUserData.Erp_Qt_Request_Core['___is_antitheft_fit___']
                            "Type_of_Device_Installed": "",
                            "Automobile_Association_Membership_Number": "",
                            "Automobile_Association_Membership_Expiry_Date": "",
                            "State_Code": dbUserData.Erp_Qt_Request_Core['___registration_no_1___'],
                            "District_Code": dbUserData.Erp_Qt_Request_Core['___registration_no_2___'],
                            "Vehicle_Series_Number": dbUserData.Erp_Qt_Request_Core['___registration_no_3___'],
                            "Registration_Number": dbUserData.Erp_Qt_Request_Core['___registration_no_4___'],
                            "Transfer_of_NCB": dbUserData.Erp_Qt_Request_Core['___is_claim_exists___'] === "yes" ? "NO" : "Yes", //Transfer of NCB Yes/ NO
                            "Transfer_of_NCB_Percent": is_tp_only ? "" : (dbUserData.Erp_Qt_Request_Core['___vehicle_ncb_current___'] + '%'), //Transfer of NCB If yes, then previous yr NCB in %
                            "Proof_Document_Date": is_tp_only ? "" : (moment(dbUserData.Erp_Qt_Request_Core['___policy_expiry_date___']).format("DD-MM-YYYY")), //Previous policy end date
                            "Proof_Provided_for_NCB": is_tp_only ? "" : ('NCB declaration'),
                            "Own Damage Basic": is_tp_only ? "No" : "Yes",
                            "Own Damage Basic_IDV": "",
                            "Non_Electrical_Accessories": dbUserData.Erp_Qt_Request_Core['___non_electrical_accessory___'].toString() === "0" ? "No" : "Yes", //Yes or NO
                            "Non_Electrical_Description": dbUserData.Erp_Qt_Request_Core['___non_electrical_accessory___'].toString() === "0" ? "" : "Non electrical accessories", //Non electrical accessories (Hard coded)
                            "Value_of_Non_Electrical": dbUserData.Erp_Qt_Request_Core['___non_electrical_accessory___'].toString() === "0" ? "" : dbUserData.Erp_Qt_Request_Core['___non_electrical_accessory___'].toString(),
                            "Electrical_Accessories": dbUserData.Erp_Qt_Request_Core['___electrical_accessory___'].toString() === "0" ? "No" : "Yes", //Yes or NO
                            "Electrical_Description": dbUserData.Erp_Qt_Request_Core['___electrical_accessory___'].toString() === "0" ? "" : "Electrical accessories", //Electrical accessories (Hard coded)
                            "Value_of_Electrical": dbUserData.Erp_Qt_Request_Core['___electrical_accessory___'].toString() === "0" ? "" : dbUserData.Erp_Qt_Request_Core['___electrical_accessory___'].toString(),
                            "CNG_LPG_Gas_Kit": "", //Yes or NO
                            "CNG_LPG_Description": "", //CNG/ LPG
                            "Value_of_CNG_LPG": "",
                            "Internal_CNG/LPG_Gas_Kit": "", //Internal CNG /LPG Gas Kit  //Yes or NO
                            "Internal_CNG/LPG_Gas_Kit_Description": "",
                            "Side_Car": "",
                            "Side_Car_IDV_Value": "",
                            "Additional_Accessories": "No",
                            "Value_of_Additional_Accessories": "",
                            "Third_Party_Property_Damage": "Upto 100000", //LIMIT needs to be mentioned //Third Party Property Damage Limit
                            "Legal_Liability_Employees": "No", //Legal Liability Employees
                            "Legal_Liability_Employees_Number": "",
                            "Legal_Liability_Paid_Drivers": "No",
                            "Legal_Liability_Paid_Driver_Number": "",
                            "Legal_Liability_Soldier_Sailors_Airman": "",
                            "Legal_Liability_Soldier_Sailors_Airman_Number": "",
                            "PA_Owner_Driver": dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? "No" : (dbUserData.Erp_Qt_Request_Core['___is_pa_od___'].toString() === "yes" ? "Yes" : "No"), //PA Owner Driver //Yes And No
                            "PA_Owner_Driver_Policy_Tenure": dbUserData.Erp_Qt_Request_Core['___is_pa_od___'].toString() === "yes" ? "1" : "",
                            "PA_for_Unnamed_Passenger": dbUserData.Processed_Request['___pa_unnamed_passenger_si___'] === "" ? "No" : "Yes", //PA for Unnamed Passenger yes and no
                            "Sum_Insured_Per_Person": dbUserData.Processed_Request['___pa_unnamed_passenger_si___'] === "" ? "" : dbUserData.Processed_Request['___pa_unnamed_passenger_si___'], //Sum Insured Per Person   If yes, the PA SI per person
                            "PA_to_Driver_Cleaner_Conductor": "No",
                            "PA_to_Driver_Cleaner_Conductor_Number": "",
                            "PA_to_Driver_Cleaner_Conductor_Sum_Insured_per_Person": "",
                            "CNG_LPG_Kit_Liability": ((["CNG", "LPG"].indexOf(dbUserData.Processed_Request['___dbmaster_insurer_vehicle_fueltype___']) > -1) ? "Yes" : "No"), //CNG LPG Kit Liability
                            "PA_Cover_for_Named_Person_Other_than_Driver": "No",
                            "PA_Cover_for_Named_Person_Other_than_Driver_Number_of_Drivers": "",
                            "PA_Cover_for_Named_Person_Other_than_Driver_Sum_Insured_per_Person": "",
                            "PA_Cover_for_Unnamed_Hirrer_or_Pillion_Passenger": "No",
                            "PA_Cover_for_Unnamed_Hirrer_or_Pillion_Passenger_Number_of_Drivers": "",
                            "PA_Cover_for_Unnamed_Hirrer_or_Pillion_Passenger_Sum_Insured_per_Person": "",
                            "Invoice Value Protect": dbUserData.Erp_Qt_Request_Core['___addon_invoice_price_cover___'].toString(), //Invoice Value Protect yes or no
                            "Depreciation Protect": dbUserData.Erp_Qt_Request_Core['___addon_zero_dep_cover___'].toString(), //Depreciation Protect yes or no
                            "Pillion Protect": "No",
                            "Pillion Protect Value": "",
                            "Consumable Expenses Protect": dbUserData.Erp_Qt_Request_Core['___addon_consumable_cover___'].toString(), //Consumable Expenses Protect yes or no
                            "Emergency Medical Expenses Protect": "No",
                            "Additional Third Party Property Damage Protect": "No",
                            "Additional Third Party Property Damage Protect Value": "",
                            "Required_Discount": "",
                            "Finance_Type": dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___'] === "0" ? "" : dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___'], //Hypothecation or blank
                            "Financier_Name": dbUserData.Erp_Qt_Request_Core['___financial_institute_name___'],
                            "Branch_Name": dbUserData.Erp_Qt_Request_Core['___financial_institute_city___'],
                            "Net Premium": dbUserData.Erp_Qt_Request_Core['___premium_breakup_net_premium___'].toString(),
                            "GST": dbUserData.Erp_Qt_Request_Core['___tax___'].toString(), //(Math.ceil(dbUserData.Erp_Qt_Request_Core['___tax___'] - 0)), //(((dbUserData.Erp_Qt_Request_Core['___tax___'] - 0).toFixed(2).toString()).split('.')[0]),
                            "Total Premium Payable ": (((dbUserData.Erp_Qt_Request_Core['___net_premium___'] - 0) + (dbUserData.Erp_Qt_Request_Core['___tax___'] - 0)).toString()),
                            "IDV_Value": dbUserData.Erp_Qt_Request_Core['___vehicle_expected_idv___'].toString(), //IDV Value
                            "Comment_to_UW": "",
                            "Ind_Salutation": dbUserData.Erp_Qt_Request_Core['___salutation___'],
                            "Ind_First_Name": dbUserData.Erp_Qt_Request_Core['___first_name___'],
                            "Ind_Middle_Name": dbUserData.Erp_Qt_Request_Core['___middle_name___'],
                            "Ind_Last_Name": dbUserData.Erp_Qt_Request_Core['___last_name___'],
                            "Ind_Gender": dbUserData.Erp_Qt_Request_Core['___gender___'] === "M" ? "Male" : (dbUserData.Erp_Qt_Request_Core['___gender___'] === "F" ? "Female" : "Unknown"),
                            "Ind_Marital_Status": dbUserData.Erp_Qt_Request_Core['___marital_text___'],
                            "Ind_Date_of_Birth": cust_dob[2] + '-' + cust_dob[1] + '-' + cust_dob[0], //Mandatory DD/MM/YYYY
                            "Ind_Nationality": "Indian",
                            "Ind_Current_Address_Line_1": dbUserData.Erp_Qt_Request_Core['___communication_address_1___'],
                            "Ind_Current_Address_Line_2": dbUserData.Erp_Qt_Request_Core['___communication_address_2___'],
                            "Ind_Current_Address_Line_3": dbUserData.Erp_Qt_Request_Core['___communication_address_3___'],
                            "Ind_Pincode": dbUserData.Erp_Qt_Request_Core['___communication_pincode___'],
                            "Ind_Current_City": dbUserData.Erp_Qt_Request_Core['___communication_city___'],
                            "Ind_PAN_Number": dbUserData.Erp_Qt_Request_Core['___pan___'],
                            "Ind_GST_Number": dbUserData.Erp_Qt_Request_Core['___gst_no___'],
                            "Ind_Aadhar_Number": dbUserData.Erp_Qt_Request_Core['___aadhar___'],
                            "Ind_Mobile_Number": dbUserData.Erp_Qt_Request_Core['___mobile___'],
                            "Ind_Email_ID": dbUserData.Erp_Qt_Request_Core['___email___'],
                            "Ind_Occupation": dbUserData.Erp_Qt_Request_Core['___occupation___'],
                            "Org_GST_Registered": "",
                            "Org_GST_Number": "",
                            "Org_Salutation": "",
                            "Org_Company_Name": "",
                            "Org_Current_Address_Line_1": "",
                            "Org_Current_Address_Line_2": "",
                            "Org_Current_Address_Line_3": "",
                            "Org_Pincode": "",
                            "Org_Current_City": "",
                            "Org_PAN_Number": "",
                            "Org_Mobile_Number": "",
                            "Org_Email_ID": "",
                            "Nominee_Name": dbUserData.Erp_Qt_Request_Core['___nominee_name___'],
                            "Relationship_with_Applicant": dbUserData.Erp_Qt_Request_Core['___nominee_relation___'],
                            "Others": (dbUserData.Erp_Qt_Request_Core['___nominee_relation___'] === "Others" ? dbUserData.Erp_Qt_Request_Core['___nominee_other_relation___'] : ""),
                            "Nominee_Date_of_Birth": nominee_dob[2] + '-' + nominee_dob[1] + '-' + nominee_dob[0],
                            "Guardian_Name": "",
                            "Inspection_Number": "",
                            "Payment_Mode": "NEFT",
                            "Cheque_From_1": "",
                            "Cheque_Bank_Name_1": "",
                            "Cheque_Branch_1": "",
                            "Cheque_IFSC_1": "",
                            "Cheque_Account_Number_1": "",
                            "Cheque_Date_1": "",
                            "Cheque_Number_1": "",
                            "Cheque_Name_1": "",
                            "Cheque_Amount_1": "",
                            "Cheque_From_2": "",
                            "Cheque_Bank_Name_2": "",
                            "Cheque_Branch_2": "",
                            "Cheque_IFSC_2": "",
                            "Cheque_Account_Number_2": "",
                            "Cheque_Date_2": "",
                            "Cheque_Number_2": "",
                            "Cheque_Name_2": "",
                            "Cheque_Amount_2": "",
                            "Cheque_From_3": "",
                            "Cheque_Bank_Name_3": "",
                            "Cheque_Branch_3": "",
                            "Cheque_IFSC_3": "",
                            "Cheque_Account_Number_3": "",
                            "Cheque_Date_3": "",
                            "Cheque_Number_3": "",
                            "Cheque_Name_3": "",
                            "Cheque_Amount_3": "",
                            "NEFT_From_1": "Customer",
//                            "NEFT_Bank_Name_1": "PAYU",
                            "NEFT_Bank_Name_1": payment_bank_name,
                            "NEFT_Instrument_Number_1": objProduct.lm_request['transaction_id'].toString(), //Transaction ID
                            "NEFT_Account_Number_1": "1234", //1234
                            "NEFT_Accountholder_1": dbUserData.Erp_Qt_Request_Core['___first_name___'], //Customer First Name
                            "NEFT_Instrument_Date_1": moment(objProduct.lm_request['pg_reference_number_1']).format('DD/MM/YYYY').toString(), //Payment date //Instrument Date
                            "NEFT_Amount_1": (((dbUserData.Erp_Qt_Request_Core['___net_premium___'] - 0) + (dbUserData.Erp_Qt_Request_Core['___tax___'] - 0)).toString()),
                            "NEFT_From_2": "",
                            "NEFT_Bank_Name_2": "",
                            "NEFT_Instrument_Number_2": "",
                            "NEFT_Account_Number_2": "",
                            "NEFT_Accountholder_2": "",
                            "NEFT_Instrument_Date_2": "",
                            "NEFT_Amount_2": "",
                            "NEFT_From_3": "",
                            "NEFT_Bank_Name_3": "",
                            "NEFT_Instrument_Number_3": "",
                            "NEFT_Account_Number_3": "",
                            "NEFT_Accountholder_3": "",
                            "NEFT_Instrument_Date_3": "",
                            "NEFT_Amount_3": "",
                            "Cash_From_1": "",
                            "Cash_Name_1": "",
                            "Cash_Amount_1": "",
                            "Sub Intermediary Category": "",
                            "Sub Intermediary Code": "",
                            "Sub Intermediary Name": "",
                            "Sub Intermediary Phone Email": "",
                            "POSP PAN Aadhar No": "",
                            "Business Source Unique Id": "",
                            "Account No": "",
                            "Identifier": ((dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___ui_source___') && dbUserData.Erp_Qt_Request_Core['___ui_source___'] === 'quick_tw_journey') || (dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___agent_source___') && dbUserData.Erp_Qt_Request_Core['___agent_source___'] === 'quick_tw_journey')) ? 'PBoss Express' : 'PBoss'
                        };

                        data_list.push(data_csv);
                        var txs = JSON.parse(JSON.stringify(data_list));
                        finalTxs = [];
                        for (let i = 0; i <= data_list.length; i++) {
                            finalTxs.push(data_list[i]);
                        }
                        const csvData = csvjson.toCSV(finalTxs, {
                            headers: 'key'
                        });
                        writeFile(ff_loc_path_portal, csvData, (err) => {
                            if (err) {
                                console.log(err); // Do something to handle the error or just throw it
                            }
                            console.log('Success!');
                        });

                        var Email = require('../../models/email');
                        var objModelEmail = new Email();
                        var sub = '[' + config.environment.name.toString().toUpperCase() + ']INFO-PolicyBoss.com-Policy Edelweiss Feed File:' + objProduct.lm_request['policy_number'];
                        email_body = '<html><body><p>Hi,</p><BR/><p>Please find the attachment of Feed File of Edelweiss Private Car Policy.</p>'
                                + '<BR><p>Policy Number : ' + objProduct.lm_request['policy_number'] + '</p><BR><p>Policy URL : ' + ff_web_path_portal + ' </p></body></html>';
                        if (config.environment.name === 'Production') {
                            //objModelEmail.send('notifications@policyboss.com', 'DeepakG.Pandey@edelweissfin.com', sub, email_body, 'Nilesh.Devlekar@edelweissfin.com', config.environment.notification_email, ''); //UAT
                        } else if (config.environment.name === 'QA') {
                            //objModelEmail.send('notifications@policyboss.com', 'DeepakG.Pandey@edelweissfin.com', sub, email_body, 'Abirami.iyer@edelweissfin.com', 'policybosstesting@gmail.com', '');//Local
                        } else {

                        }
                    }
                } else {
                    policy.pdf_status = 'FAIL';
                }
            });
        } else {
            policy.pdf_status = 'FAIL';
        }
        console.log('Finish', this.constructor.name, 'pdf_response_handler', objServiceHandler);
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex
        };
        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'pdf_response_handler', ex);
    }
    objServiceHandler.Policy = policy;
    objServiceHandler.Error_Msg = Error_Msg;
    return objServiceHandler;
};
EdelweissMotor.prototype.get_vehicle_bodytype = function (vehicle_bodytype) {
    console.log('get vehicle bodytype', 'start');
    try {
        var obj_vehicle_bodytype = [
            {'body': 'Compact', 'value': 'Compact'},
            {'body': 'Highend', 'value': 'Highend'},
            {'body': 'High end', 'value': 'Highend'},
            {'body': 'Midsize', 'value': 'Midsize'},
            {'body': 'Mid-Size', 'value': 'Midsize'},
            {'body': 'MINI', 'value': 'MINI'},
            {'body': 'Mini', 'value': 'MINI'},
            {'body': 'MUV', 'value': 'MUV'},
            {'body': 'SUV', 'value': 'SUV'}
        ];
        var index = obj_vehicle_bodytype.findIndex(x => x.body === vehicle_bodytype);
        if (index === -1) {
            return vehicle_bodytype;
        }
        return obj_vehicle_bodytype[index]['value'];
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'get_vehicle_bodytype', ex);
    }
    console.log('get vehicle bodytype', 'End');
};
EdelweissMotor.prototype.applicable_imt = function (objResponseJson) {
    try {
        var objResponseJson = objResponseJson;
        var apllied_imt = (objResponseJson['___vehicle_insurance_subtype___'] === "0CH_1TP" ? "" : "IMT - 22, ");
        if (objResponseJson['___financial_agreement_type___'] === "Hire Purchase") {
            apllied_imt = apllied_imt + 'IMT - 5';
        }
        if (objResponseJson['___financial_agreement_type___'] === "Lease agreement") {
            apllied_imt = apllied_imt + ', IMT - 6';
        }
        if (objResponseJson['___financial_agreement_type___'] === "Hypothecation") {
            apllied_imt = apllied_imt + ', IMT - 7';
        }
        if (objResponseJson['___premium_breakup_tp_cover_owner_driver_pa___'] > 0) {
            apllied_imt = apllied_imt + ', IMT - 15';
        }
        if (objResponseJson['___premium_breakup_tp_cover_paid_driver_pa___'] > 0) {
            apllied_imt = apllied_imt + ', IMT - 17';
        }
        if (objResponseJson['___premium_breakup_od_elect_access___'] > 0) {
            apllied_imt = apllied_imt + ', IMT - 24';
        }
        if (objResponseJson['___premium_breakup_od_cng_lpg___'] > 0 || objResponseJson['___premium_breakup_tp_cng_lpg___'] > 0) {
            apllied_imt = apllied_imt + ', IMT - 25';
        }
        if (objResponseJson['___premium_breakup_tp_cover_paid_driver_ll___'] > 0) {
            apllied_imt = apllied_imt + ', IMT - 28';
        }
        if (objResponseJson['___premium_breakup_tp_cover_unnamed_passenger_pa___'] > 0) {
            apllied_imt = apllied_imt + ', IMT - 16';
        }
        if (objResponseJson['___addon_zero_dep_cover___'] === "yes") {
            apllied_imt = apllied_imt + ', EGICG.01';
        }
        if (objResponseJson['___addon_engine_protector_cover___'] === "yes") {
            apllied_imt = apllied_imt + ', EGICG.02';
        }
        if (objResponseJson['___addon_ncb_protection_cover___'] === "yes") {
            apllied_imt = apllied_imt + ', EGICG.03';
        }
        if (objResponseJson['___addon_invoice_price_cover___'] === "yes") {
            apllied_imt = apllied_imt + ', EGICG.04';
        }
        if (objResponseJson['___addon_key_lock_cover___'] === "yes") {
            apllied_imt = apllied_imt + ', EGICG.05';
        }
        if (objResponseJson['___addon_consumable_cover___'] === "yes") {
            apllied_imt = apllied_imt + ', EGICG.08';
        }
        if (objResponseJson['___addon_mandatory_deduction_protect___'] === "yes") {
            apllied_imt = apllied_imt + ', EGICG.09';
        }
        if (objResponseJson['___addon_personal_belonging_loss_cover___'] === "yes") {
            apllied_imt = apllied_imt + ', EGICG.10';
        }
        if (objResponseJson['___addon_road_assist_cover___'] === "yes") {
            apllied_imt = apllied_imt + ', EGICG.11';
        }
        return apllied_imt;
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'applicable_imt', ex);
    }
};
EdelweissMotor.prototype.saod_tp_policy_tenure = function (tp_start_date, tp_end_date) {
    var age_in_year = 0;
    try {
        var sd = tp_start_date.split('-');
        var tpsd = sd[2] + "-" + sd[1] + "-" + sd[0];
        var ed = tp_end_date.split('-');
        var tped = ed[2] + "-" + ed[1] + "-" + ed[0];
        var date1 = new Date(tped);
        var date2 = new Date(tpsd); //mm/dd/yyyy
        var diff_date = date1 - date2;
        var num_years = diff_date / 31536000000;
        var num_months = (diff_date % 31536000000) / 2628000000;
        var num_days = ((diff_date % 31536000000) % 2628000000) / 86400000;
        age_in_year = Math.floor(num_years);
        var age_in_days = Math.floor(num_days);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'saod_tp_policy_tenure', ex);
        return age_in_year;
    }
    return age_in_year;
};
EdelweissMotor.prototype.vehicle_age_year = function () {
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
EdelweissMotor.prototype.lv_quote_no = function () {
    try {
        return this.create_guid('', 'numeric', 7);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'lv_quote_no', ex);
        return 0;
    }
};
EdelweissMotor.prototype.top_new_city_rto = [
    "GJ01", "GJ02", "GJ03", "GJ06", "GJ07", "GJ18", "GJ23",
    "KA01", "KA02", "KA03", "KA04", "KA05", "KA41", "KA43", "KA50", "KA52", "KA53", "KA57", "KA58", "KA60", "KA61",
    "MH01", "MH02", "MH03", "MH04", "MH05", "MH06", "MH12", "MH14", "MH42", "MH43", "MH46", "MH47", "MH48",
    "TS02", "TS03", "TS04", "TS05", "TS06", "TS09", "TS10", "TS11", "TS13", "TS14"
];
EdelweissMotor.prototype.top_city_rto = [
    "AP07", "AP16", "AP27", "AP37", "BR01", "BR02", "BR03", "BR04", "BR05", "BR06", "BR07", "BR08",
    "BR09", "BR10", "BR11", "BR19", "BR21", "BR22", "BR24", "BR25", "BR26", "BR27", "BR28", "BR29",
    "BR30", "BR31", "BR32", "BR33", "BR34", "BR37", "BR38", "BR39", "BR43", "BR44", "BR45", "BR46",
    "BR50", "BR51", "BR52", "BR53", "BR55", "BR56", "BR57", "DD02", "DD03", "DL01", "DL02", "DL03",
    "DL04", "DL05", "DL06", "DL07", "DL08", "DL09", "DL10", "DL11", "DL12", "DL13", "DL14", "DL15",
    "DL16", "DL17", "DL18", "GA01", "GA02", "GA03", "GA04", "GA05", "GA06", "GA07", "GA08", "GA09",
    "GA10", "GA11", "GA12", "GJ01", "GJ02", "GJ03", "GJ05", "GJ06", "GJ07", "GJ18", "GJ23", "GJ28",
    "HR13", "HR26", "HR27", "HR29", "HR38", "HR51", "HR55", "JH01", "JH02", "JH05", "JH09", "JH10",
    "KA01", "KA02", "KA03", "KA04", "KA05", "KA41", "KA43", "KA50", "KA52", "KA53", "KA57", "KA58",
    "KA60", "KA61", "MH01", "MH02", "MH03", "MH04", "MH05", "MH06", "MH12", "MH14", "MH42", "MH43",
    "MH46", "MH47", "MH48", "TS02", "TS03", "TS04", "TS05", "TS06", "TS09", "TS10", "TS11", "TS13",
    "TS14", "UP14", "UP16", "WB02", "WB03", "WB04", "WB05", "WB06", "WB07", "WB08", "WB09", "WB10",
    "WB11", "WB12", "WB13", "WB14", "WB15", "WB16", "WB17", "WB18", "WB19", "WB20", "WB21", "WB22",
    "WB23", "WB24", "WB25", "WB26"
];
EdelweissMotor.prototype.addon_vehicle_age_year = function () {
    var age_in_year = 0;
    try {
        var moment = require('moment');
        var vehicle_manf_date = moment(this.lm_request['vehicle_registration_date']);
        var policy_start_date = moment(this.policy_start_date());
        var diffDuration = moment.duration(policy_start_date.diff(vehicle_manf_date));
        var age_in_year1 = diffDuration.years();
        var age_in_month = diffDuration.months();
        var age_in_day = diffDuration.days();
        if (age_in_month > 9) {
            age_in_year = (parseInt(age_in_year1) + 1) + ".00";
        } else {
            age_in_year = age_in_year1.toString() + '.' + age_in_month.toString() + age_in_day.toString();
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'addon_vehicle_age_year', ex);
        return age_in_year;
    }
    return age_in_year;
};
EdelweissMotor.prototype.get_vehicle_fueltype = function (vehicle_fueltype) {
    console.log('get vehicle fueltype', 'start');
    try {
        var obj_vehicle_fueltype = [
            {'fuel': 'Petrol', 'value': 'MFT1'},
            {'fuel': 'PETROL', 'value': 'MFT1'},
            {'fuel': 'Diesel', 'value': 'MFT2'},
            {'fuel': 'DIESEL', 'value': 'MFT2'},
            {'fuel': 'CNG', 'value': 'MFT3'},
            {'fuel': 'LPG', 'value': 'MFT5'},
            {'fuel': 'Battery', 'value': 'MFT6'}
        ];
        var index = obj_vehicle_fueltype.findIndex(x => x.fuel === vehicle_fueltype);
        if (index === -1) {
            return "MFT99";
        }
        return obj_vehicle_fueltype[index]['value'];
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'get_vehicle_fueltype', ex);
    }
    console.log('get vehicle fueltype', 'End');
};
EdelweissMotor.prototype.get_vehicle_bodytype1 = function (bodyType) {
    console.log('get vehicle bodytype', 'start');
    try {
        var obj_bodytype = [
            {'body_type': 'SEDAN', 'body_code': 'BD2'},
            {'body_type': 'HATCHBACK', 'body_code': 'BD4'},
            {'body_type': 'CLOSED', 'body_code': '11'},
            {'body_type': 'JEEP', 'body_code': 'BD6'},
            {'body_type': 'VAN', 'body_code': 'BD5'},
            {'body_type': 'SALOON', 'body_code': 'BD1'}
        ];
        var index = obj_bodytype.findIndex(x => x.body_type === bodyType);
        if (index === -1) {
            return "BD7";
        }
        return obj_bodytype[index]['body_code'];
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'get_vehicle_bodytype1', ex);
    }
    console.log('get vehicle bodytype', 'End');
};
EdelweissMotor.prototype.get_voluntary_deductible = function (voluntary_deduct) {
    console.log('get voluntary deductible', 'start');
    try {
        var obj_voluntary_deductible = [
            {'deductible': 500, 'value': 'TWVE2'},
            {'deductible': 750, 'value': 'TWVE3'},
            {'deductible': 1000, 'value': 'TWVE4'},
            {'deductible': 1500, 'value': 'TWVE5'},
            {'deductible': 3000, 'value': 'TWVE6'},
            {'deductible': 2500, 'value': 'PCVE2'},
            {'deductible': 5000, 'value': 'PCVE3'},
            {'deductible': 7500, 'value': 'PCVE4'},
            {'deductible': 15000, 'value': 'PCVE5'}
        ];
        var index = obj_voluntary_deductible.findIndex(x => x.deductible === voluntary_deduct);
        if (index === -1) {
            return (this.lm_request['product_id'] === 10 ? 'TWVE1' : 'PCVE1');
//        return "PCVE1";
        }
        return obj_voluntary_deductible[index]['value'];
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'get_voluntary_deductible', ex);
    }
    console.log('get vehicle deductible', 'End');
};
EdelweissMotor.prototype.premium_breakup_schema = {

    "own_damage": {
        "od_basic": "MOT-CVR-001", //when PropCoverDetails_CoverGroups = Own Damage
        "od_elect_access": "MOT-CVR-002", //need to calculate
        "od_non_elect_access": "", //not given by insurer 
        "od_cng_lpg": "", //yet to check
        "od_disc_ncb": "MOT-DIS-310",
        "od_disc_vol_deduct": "MOT-DIS-004",
        "od_disc_anti_theft": "MOT-DIS-002",
        "od_disc_aai": "MOT-DIS-005",
        "od_loading": "",
        "od_disc": "MOT-DLR-IMT",
        "od_final_premium": "OD_PREMIUM"//NetODPremium
    },
    "liability": {
        "tp_basic": "MOT-CVR-007", ////when PropCoverDetails_CoverGroups = Basic TP  including TPPD premium
        "tp_cover_owner_driver_pa": "MOT-CVR-010", //when PropCoverDetails_CoverGroups = Owner Driver
        "tp_cover_unnamed_passenger_pa": "MOT-CVR-012",
        "tp_cover_named_passenger_pa": "",
        "tp_cover_paid_driver_pa": "", //NA
        "tp_cover_paid_driver_ll": "MOT-CVR-015", //this is included in tp_basic
        "tp_cng_lpg": "MOT-CVR-008",
        "tp_final_premium": "TP_PREMIUM"
    },
    "addon": {
        "addon_zero_dep_cover": "MOT-CVR-150",
        "addon_road_assist_cover": "", ///when PropCoverDetails_CoverGroups = RoadSide Assist
        "addon_ncb_protection_cover": "",
        "addon_engine_protector_cover": "MOT-CVR-EPC",
        "addon_invoice_price_cover": "MOT-CVR-070",
        "addon_key_lock_cover": "",
        "addon_consumable_cover": "",
        "addon_daily_allowance_cover": null,
        "addon_windshield_cover": null,
        "addon_passenger_assistance_cover": null,
        "addon_tyre_coverage_cover": "",
        "addon_personal_belonging_loss_cover": "",
        "addon_inconvenience_allowance_cover": null,
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
module.exports = EdelweissMotor;
