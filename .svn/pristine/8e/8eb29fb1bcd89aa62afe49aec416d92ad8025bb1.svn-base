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
function EdelweissCVMotor() {

}
util.inherits(EdelweissCVMotor, Motor);
EdelweissCVMotor.prototype.lm_request_single = {};
EdelweissCVMotor.prototype.insurer_integration = {};
EdelweissCVMotor.prototype.insurer_addon_list = [];
EdelweissCVMotor.prototype.insurer = {};
EdelweissCVMotor.prototype.pdf_attempt = 0;
EdelweissCVMotor.prototype.insurer_date_format = 'dd/MM/yyyy';
EdelweissCVMotor.prototype.insurer_product_api_pre = function () {
};
EdelweissCVMotor.prototype.insurer_product_field_process_pre = function () {
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
            if (this.lm_request['vehicle_class'] === "gcv") {
                var vehicle_age = this.vehicle_age_year();
                var rto_zone = this.processed_request['___dbmaster_insurer_rto_cv_zone_code___'] ? this.processed_request['___dbmaster_insurer_rto_cv_zone_code___'] : this.processed_request['___dbmaster_insurer_rto_zone_code___'];
                var vehicle_age1 = 0;
                var arr_age = [5, 7, 30];
                for (var k in arr_age) {
                    if (vehicle_age <= arr_age[k]) {
                        vehicle_age1 = arr_age[k];
                        break;
                    }
                }
                var typeOfVehicle = this.lm_request['vehicle_sub_class'];
                var obj_basicod = [
                    {'zone': 'A', 'vehicle_age': 5, 'typeOfVehicle': "gcv_public_otthw", 'premium_rate': 1.751},
                    {'zone': 'A', 'vehicle_age': 7, 'typeOfVehicle': "gcv_public_otthw", 'premium_rate': 1.795},
                    {'zone': 'A', 'vehicle_age': 30, 'typeOfVehicle': "gcv_public_otthw", 'premium_rate': 1.839},
                    {'zone': 'A', 'vehicle_age': 5, 'typeOfVehicle': "gcv_private_otthw", 'premium_rate': 1.226},
                    {'zone': 'A', 'vehicle_age': 7, 'typeOfVehicle': "gcv_private_otthw", 'premium_rate': 1.257},
                    {'zone': 'A', 'vehicle_age': 30, 'typeOfVehicle': "gcv_private_otthw", 'premium_rate': 1.287},
                    {'zone': 'A', 'vehicle_age': 5, 'typeOfVehicle': "gcv_public_thwpc", 'premium_rate': 1.664},
                    {'zone': 'A', 'vehicle_age': 7, 'typeOfVehicle': "gcv_public_thwpc", 'premium_rate': 1.706},
                    {'zone': 'A', 'vehicle_age': 30, 'typeOfVehicle': "gcv_public_thwpc", 'premium_rate': 1.747},
                    {'zone': 'A', 'vehicle_age': 5, 'typeOfVehicle': "gcv_private_thwpc", 'premium_rate': 1.165},
                    {'zone': 'A', 'vehicle_age': 7, 'typeOfVehicle': "gcv_private_thwpc", 'premium_rate': 1.194},
                    {'zone': 'A', 'vehicle_age': 30, 'typeOfVehicle': "gcv_private_thwpc", 'premium_rate': 1.223},
                    {'zone': 'B', 'vehicle_age': 5, 'typeOfVehicle': "gcv_public_otthw", 'premium_rate': 1.743},
                    {'zone': 'B', 'vehicle_age': 7, 'typeOfVehicle': "gcv_public_otthw", 'premium_rate': 1.787},
                    {'zone': 'B', 'vehicle_age': 30, 'typeOfVehicle': "gcv_public_otthw", 'premium_rate': 1.830},
                    {'zone': 'B', 'vehicle_age': 5, 'typeOfVehicle': "gcv_private_otthw", 'premium_rate': 1.220},
                    {'zone': 'B', 'vehicle_age': 7, 'typeOfVehicle': "gcv_private_otthw", 'premium_rate': 1.251},
                    {'zone': 'B', 'vehicle_age': 30, 'typeOfVehicle': "gcv_private_otthw", 'premium_rate': 1.281},
                    {'zone': 'B', 'vehicle_age': 5, 'typeOfVehicle': "gcv_public_thwpc", 'premium_rate': 1.656},
                    {'zone': 'B', 'vehicle_age': 7, 'typeOfVehicle': "gcv_public_thwpc", 'premium_rate': 1.697},
                    {'zone': 'B', 'vehicle_age': 30, 'typeOfVehicle': "gcv_public_thwpc", 'premium_rate': 1.739},
                    {'zone': 'B', 'vehicle_age': 5, 'typeOfVehicle': "gcv_private_thwpc", 'premium_rate': 1.159},
                    {'zone': 'B', 'vehicle_age': 7, 'typeOfVehicle': "gcv_private_thwpc", 'premium_rate': 1.188},
                    {'zone': 'B', 'vehicle_age': 30, 'typeOfVehicle': "gcv_private_thwpc", 'premium_rate': 1.217},
                    {'zone': 'C', 'vehicle_age': 5, 'typeOfVehicle': "gcv_public_otthw", 'premium_rate': 1.726},
                    {'zone': 'C', 'vehicle_age': 7, 'typeOfVehicle': "gcv_public_otthw", 'premium_rate': 1.770},
                    {'zone': 'C', 'vehicle_age': 30, 'typeOfVehicle': "gcv_public_otthw", 'premium_rate': 1.812},
                    {'zone': 'C', 'vehicle_age': 5, 'typeOfVehicle': "gcv_private_otthw", 'premium_rate': 1.208},
                    {'zone': 'C', 'vehicle_age': 7, 'typeOfVehicle': "gcv_private_otthw", 'premium_rate': 1.239},
                    {'zone': 'C', 'vehicle_age': 30, 'typeOfVehicle': "gcv_private_otthw", 'premium_rate': 1.268},
                    {'zone': 'C', 'vehicle_age': 5, 'typeOfVehicle': "gcv_public_thwpc", 'premium_rate': 1.640},
                    {'zone': 'C', 'vehicle_age': 7, 'typeOfVehicle': "gcv_public_thwpc", 'premium_rate': 1.681},
                    {'zone': 'C', 'vehicle_age': 30, 'typeOfVehicle': "gcv_public_thwpc", 'premium_rate': 1.722},
                    {'zone': 'C', 'vehicle_age': 5, 'typeOfVehicle': "gcv_private_thwpc", 'premium_rate': 1.148},
                    {'zone': 'C', 'vehicle_age': 7, 'typeOfVehicle': "gcv_private_thwpc", 'premium_rate': 1.177},
                    {'zone': 'C', 'vehicle_age': 30, 'typeOfVehicle': "gcv_private_thwpc", 'premium_rate': 1.205}
                ];
                var index = obj_basicod.findIndex(x => x.zone === rto_zone && x.typeOfVehicle === typeOfVehicle && x.vehicle_age === vehicle_age1);
                this.prepared_request['od_tarrif_rate'] = obj_basicod[index]['premium_rate'];
                this.processed_request['___od_tarrif_rate___'] = this.prepared_request['od_tarrif_rate'];
            }
        }
        var vehicle_disc_age = 0;
        var discobj = {
            3: 50,
            6: 60,
            30: 70
        }
        for (var k in discobj) {
            if (vehicle_age <= k) {
                vehicle_disc_age = discobj[k];
                break;
            }
        }
        this.prepared_request['own_damage_disc_rate'] = vehicle_disc_age;
        this.processed_request['___own_damage_disc_rate___'] = vehicle_disc_age;

        if (this.lm_request['method_type'] === 'Verification' || this.lm_request['method_type'] === 'Proposal') {
            if (this.lm_request['method_type'] === 'Proposal' && this.lm_request['nominee_relation'] === 'Others') {
                this.prepared_request['nominee_relation'] = this.lm_request['nominee_other_relation'];
                this.processed_request['___nominee_relation___'] = this.prepared_request['nominee_relation'];
            }
            this.prepared_request['vehicle_normal_idv'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['vehicle_normal_idv'];
            this.processed_request['___vehicle_normal_idv___'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['vehicle_normal_idv'];
            this.prepared_request['own_damage_disc_rate'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['own_damage_disc_rate'];
            this.processed_request['___own_damage_disc_rate___'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['own_damage_disc_rate'];
            this.prepared_request['dbmaster_insurer_vehicle_exshowroom'] = this.insurer_master['service_logs']['insurer_db_master']['LM_Custom_Request']['dbmaster_insurer_vehicle_exshowroom'];
            this.processed_request['___dbmaster_insurer_vehicle_exshowroom___'] = this.insurer_master['service_logs']['insurer_db_master']['LM_Custom_Request']['dbmaster_insurer_vehicle_exshowroom'];



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
        }
        if (this.lm_request['method_type'] === 'Pdf') {
            this.lm_request['transaction_id'] = isNaN(this.lm_request['transaction_id']) ? (this.lm_request['transaction_pg'] ? this.lm_request['transaction_pg'] : this.lm_request['transaction_id']) : this.lm_request['transaction_id'];
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_product_field_process_pre', ex);
    }
};
EdelweissCVMotor.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
EdelweissCVMotor.prototype.insurer_product_field_process_post = function () {

    console.log("insurer_product_api_post");
};
EdelweissCVMotor.prototype.insurer_product_api_post = function () {

    console.log("insurer_product_api_post");
};
EdelweissCVMotor.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
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
        } else if (specific_insurer_object.method.Method_Type === 'Verification' && ((objInsurerProduct.const_payment_response.hasOwnProperty('pg_data') && objInsurerProduct.const_payment_response['pg_data'].hasOwnProperty('pg_type') && objInsurerProduct.const_payment_response['pg_data']['pg_type'] === "rzrpay") || (objInsurerProduct.proposal_processed_request.hasOwnProperty('___pay_from___') && objInsurerProduct.proposal_processed_request['___pay_from___'] === "wallet"))) {
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
EdelweissCVMotor.prototype.idv_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'idv_response_handler', objResponseJson);
};
EdelweissCVMotor.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    //var objPremiumService = objResponseJson;
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        let gross_vehicle_weight = 0;
        if (this.processed_request.hasOwnProperty('___dbmaster_pb_gross_vehicle_weight___')) {
            gross_vehicle_weight = parseInt(this.processed_request['___dbmaster_pb_gross_vehicle_weight___']);
        }
        let arr_weight = [7500, 12000, 20000, 40000, 49000];
        let vehicle_weight = 0;
        let vehicle_cc_slab = 0;
        let cubic_capacity = 0;
        if (this.processed_request.hasOwnProperty('___dbmaster_insurer_vehicle_cubiccapacity___')) {
            cubic_capacity = parseInt(this.processed_request['___dbmaster_insurer_vehicle_cubiccapacity___']);
        }

        for (var a in arr_weight) {
            if (gross_vehicle_weight <= arr_weight[a]) {
                vehicle_weight = arr_weight[a];
                break;
            }
        }
        var arr_cc = [1000, 1500, 8000];
        if (this.lm_request['vehicle_sub_class'] === "pcv_tw") {
            arr_cc = [76, 151, 351, 4000];
        }
        for (var i in arr_cc) {
            if (cubic_capacity < arr_cc[i]) {
                vehicle_cc_slab = arr_cc[i];
                break;
            }
        }
        const Edelweiss_CV_Rates = JSON.parse(fs.readFileSync(appRoot + '/resource/request_file/EdelweissCVRates.json').toString());
        let tp_basic;
        if (this.lm_request['vehicle_class'] === "gcv") {
            if (this.lm_request['vehicle_sub_class'] === "gcv_public_thwpc") {
                tp_basic = 4492;
            } else if (this.lm_request['vehicle_sub_class'] === "gcv_private_thwpc") {
                tp_basic = 3922;
            } else {
                tp_basic = Edelweiss_CV_Rates[this.lm_request['vehicle_class']][this.lm_request['vehicle_sub_class']][vehicle_weight];
            }
        } else {
            if (this.lm_request['vehicle_sub_class'] === "pcv_tw") {
                tp_basic = 2539;
            } else {
                tp_basic = Edelweiss_CV_Rates[this.lm_request['vehicle_class']][this.lm_request['vehicle_sub_class']][vehicle_cc_slab];
            }
        }
        if (this.lm_request['vehicle_class'] !== "gcv") {
            Error_Msg = "UW Guidelines : Restricted Vehicle Class " + this.lm_request['vehicle_class'];
        }
        if (Error_Msg === "NO_ERR") {
            if (this.prepared_request['dbmaster_pb_fuel_name'] === "ELECTRIC" || this.prepared_request['dbmaster_pb_fuel_name'] === "Electric") {
                Error_Msg = 'UW Guidelines : Electric Vehicle Restricted';
            }
            var idv = 0;

            var premium_breakup = this.get_const_premium_breakup();
            var od_tenure = parseInt(this.lm_request['policy_od_tenure']);
            var tp_tenure = parseInt(this.lm_request['policy_tp_tenure']);
            if (this.lm_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
                idv = 0;
            } else {
                idv = this.processed_request['___vehicle_expected_idv___'];
            }
            var od_tariff_rate = this.processed_request["___od_tarrif_rate___"];
            var od_basic_rate = parseFloat((od_tariff_rate * idv) / 100);
            var od_disc_rate = parseFloat(od_basic_rate * Math.abs((this.prepared_request['own_damage_disc_rate'] / 100)));
            var od_basic_final = 0;
            if (this.lm_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
                od_basic_final = 0;
                od_basic_rate = 0
                od_disc_rate = 0;
            } else {
                od_basic_final = parseFloat(od_basic_rate - od_disc_rate);
            }
            premium_breakup['own_damage']['od_elect_access'] = parseFloat((this.lm_request['electrical_accessory'] * 4) / 100);
            if (this.lm_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
                var non_elect_accsess = 0;
            } else {
                var non_elect_accsess = (od_tariff_rate - ((od_tariff_rate * Math.abs(this.prepared_request['own_damage_disc_rate'])) / 100));
            }
            premium_breakup['own_damage']['od_non_elect_access'] = parseFloat((this.lm_request['non_electrical_accessory'] * non_elect_accsess) / 100);
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
            premium_breakup['own_damage']['od_disc_own_premises'] = 0;
            premium_breakup['own_damage']['od_basic'] = od_basic_final;
            premium_breakup['own_damage']['od_disc'] = 0;
            //premium_breakup['own_damage']['od_disc_ncb'] = parseInt((parseInt(this.prepared_request['vehicle_ncb_next']) * ((premium_breakup['own_damage']['od_basic'] - 0) - (premium_breakup['own_damage']['od_disc'] - 0))) / 100);
            premium_breakup['own_damage']['od_disc_ncb'] = parseInt((parseInt(this.prepared_request['vehicle_ncb_next']) * (od_basic_final + premium_breakup['own_damage']['od_cng_lpg'])) / 100);
            premium_breakup['own_damage']['od_final_premium'] = parseFloat(premium_breakup['own_damage']['od_basic'] + premium_breakup['own_damage']['od_elect_access'] + premium_breakup['own_damage']['od_non_elect_access'] - premium_breakup['own_damage']['od_disc'] - premium_breakup['own_damage']['od_disc_ncb'] + premium_breakup['own_damage']['od_cng_lpg']);

            if (this.lm_request['vehicle_insurance_subtype'] !== "1OD_0TP") {
                premium_breakup['liability']['tp_basic'] = parseFloat(tp_basic);
                if (this.lm_request['is_pa_od'] === 'yes') {
                    premium_breakup['liability']['tp_cover_owner_driver_pa'] = 220;
                } else {
                    premium_breakup['liability']['tp_cover_owner_driver_pa'] = 0;
                }
                if (this.lm_request.hasOwnProperty('imt23') && this.lm_request['imt23'] === 'yes') {
                    premium_breakup['liability']['tp_cover_imt23'] = parseInt(od_basic_final) > 0 ? ((parseInt(od_basic_final) * 15) / 100) : 0;
                } else {
                    premium_breakup['liability']['tp_cover_imt23'] = 0;
                }
                if (this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === "CNG" || this.prepared_request['dbmaster_insurer_vehicle_fueltype'] === "LPG" || this.lm_request['is_external_bifuel'] === 'yes') {
                    premium_breakup['liability']['tp_cng_lpg'] = tp_tenure * 60;
                } else {
                    premium_breakup['liability']['tp_cng_lpg'] = 0;
                }
                premium_breakup['liability']['tp_final_premium'] = parseFloat(premium_breakup['liability']['tp_basic'] + premium_breakup['liability']['tp_cover_owner_driver_pa'] + premium_breakup['liability']['tp_cover_imt23'] + premium_breakup['liability']['tp_cng_lpg']);
            }
            premium_breakup['net_premium'] = parseFloat(premium_breakup['liability']['tp_final_premium'] + premium_breakup['own_damage']['od_final_premium']);
            premium_breakup['service_tax'] = this.lm_request['vehicle_class'] === "gcv" ? ((parseFloat((parseFloat(premium_breakup['net_premium']) - parseFloat(premium_breakup['liability']['tp_basic'])) * (0.18))) + (parseFloat(premium_breakup['liability']['tp_basic']) * (0.12))) : parseFloat(premium_breakup['net_premium'] * 0.18);
            premium_breakup['final_premium'] = parseFloat(premium_breakup['net_premium'] + premium_breakup['service_tax']);
            objServiceHandler.Premium_Breakup = premium_breakup;
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
EdelweissCVMotor.prototype.insurer_vehicle_idv = function (objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback) {
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
        // var MongoClient = require('mongodb').MongoClient;
        // MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
        //   if (err) {
        //    } else {
        //var edelweissMaster = db.collection('edelweiss_motor_idv_master');
        //edelweissMaster.findOne({MASTER_CODE: Vehicle_code, CITY: 'DELHI', CAPACITY: Vehicle_cubiccapacity}, function (err, result) {
        //   if (err) {
        //  } else {
        var vehicle_age = objCurrent.vehicle_age_year();
        var slab = parseFloat(Vehicle_Depreciation_Rate['Age_' + vehicle_age]);
        // var Idv = result['Upto_6_Month']; //result[slab];
        var Idv = 0;
        var Insurer_Vehicle_ExShowRoom = 0;
        if (this.prepared_request.hasOwnProperty('dbmaster_insurer_vehicle_exshowroom') && this.prepared_request['dbmaster_insurer_vehicle_exshowroom'] !== null && this.prepared_request['dbmaster_insurer_vehicle_exshowroom'] !== undefined) {
            Insurer_Vehicle_ExShowRoom = this.processed_request['___dbmaster_insurer_vehicle_exshowroom___'];
        }
        // if (objCurrent.lm_request['vehicle_insurance_type'] === 'new' && objCurrent.lm_request['vehicle_insurance_subtype'] === '3CH_0TP') {
        // Idv = parseFloat((Idv * slab) / 100);
//                            var Db_Idv_Calculated = {
//                                "Idv_Normal": Math.round(Idv),
//                                "Idv_Min": Math.round(Idv * 0.75),
//                                "Idv_Max": Math.round(Idv * 1.15),
//                                "Exshowroom": Math.round(Insurer_Vehicle_ExShowRoom)
//                            };
        //  } else {
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
            "Idv_Max": Math.round(Idv * 1.25),
            "Exshowroom": Math.round(Insurer_Vehicle_ExShowRoom)
        };
        // }
        objCurrent.insurer_vehicle_idv_handler(Db_Idv_Calculated, objProduct, Insurer_Object, specific_insurer_object);
        console.log('Finish', this.constructor.name, 'insurer_vehicle_idv', Db_Idv_Calculated);
        return Db_Idv_Calculated;
        // }
        // });
        //     }
        //   });
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_vehicle_idv', ex);
    }
};
EdelweissCVMotor.prototype.proposal_response_handler = function (objResponseJson) {
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
        if (this.lm_request['vehicle_insurance_type'] === 'renew') {
            if ((this.processed_request['___engine_number___']).length < 5 || (this.processed_request['___engine_number___']).length > 50) {
                Error_Msg = 'Engine Number : min 5 character and max 50 characters';
            }
            if ((this.processed_request['___chassis_number___']).length < 5 || (this.processed_request['___chassis_number___']).length > 50) {
                Error_Msg = 'Chassis Number : min 5 character and max 50 characters';
            }
            if (this.lm_request['is_policy_exist'] === "yes") {
                if ((this.processed_request['___previous_policy_number___']).length < 5 || (this.processed_request['___previous_policy_number___']).length > 35) {
                    Error_Msg = 'Previous Year Policy Number : min 5 character and max 35 characters';
                }
            }
        }
        if (this.lm_request['vehicle_insurance_type'] === 'new') {
//            if ((this.processed_request['___engine_number___']).length < 17 || (this.processed_request['___engine_number___']).length > 25) {
//                Error_Msg = 'Engine Number : min 17 character and max 25 characters';
//            }
            if ((this.processed_request['___engine_number___']).length < 5 || (this.processed_request['___engine_number___']).length > 50) {
                Error_Msg = 'Engine Number : min 5 character and max 50 characters';
            }
            if ((this.processed_request['___chassis_number___']).length < 17 || (this.processed_request['___chassis_number___']).length > 25) {
                Error_Msg = 'Chassis Number : min 17 character and max 25 characters';
            }
        }
        if ((this.processed_request['___engine_number___']).toLowerCase() == (this.processed_request['___chassis_number___']).toLowerCase()) {
            Error_Msg = 'Chassis Number & Engine Number Same';
        }
        let policy_number = objResponseJson.policy_number.toString();
        this.processed_request['___policy_number_generate___'] = policy_number;
        if (Error_Msg === 'NO_ERR') {
            objServiceHandler.Payment.pg_data = '';
            objServiceHandler.Payment.pg_redirect_mode = 'POST';
            objServiceHandler.Insurer_Transaction_Identifier = '';
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
EdelweissCVMotor.prototype.proposal_response_handler_NIU = function (objResponseJson) {
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
EdelweissCVMotor.prototype.pg_response_handler = function () {
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
        if (objInsurerProduct.const_payment_response.pg_data.hasOwnProperty('pg_type') && objInsurerProduct.const_payment_response.pg_data.pg_type === "rzrpay") {
            if (output['Status'] === 'Success') {
                this.const_policy.pg_status = 'SUCCESS';
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
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};
EdelweissCVMotor.prototype.verification_response_handler = function (objResponseJson) {
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
        if (((this.proposal_processed_request.hasOwnProperty('___pay_from___') && this.proposal_processed_request['___pay_from___'] === 'wallet') || (this.const_payment_response.pg_data.hasOwnProperty('pg_type') && this.const_payment_response.pg_data.pg_type === "rzrpay")) && this.const_policy.pg_status === "SUCCESS") {
            if (objResponseJson['status'] === "captured") {
                var razp_date = moment.unix(objResponseJson['created_at']).format("YYYY-MM-DD");
                this.const_policy['pg_reference_number_1'] = razp_date;
            } else {
                Error_Msg = JSON.stringify(objResponseJson);
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
            }
        }
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
                if (this.lm_request['product_id'] === 12)
                {
                    var pdf_file_name = this.constructor.name + '_' + product_name + '_POLICY_' + policy_number + '.pdf';
                    var html_file_name = this.constructor.name + '_' + product_name + '_POLICY_' + policy_number + '.html';
                    var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    var pdf_sys_loc_portal = config.pb_config.pdf_system_loc + pdf_file_name;
                    var html_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + html_file_name;
                    var html_sys_loc_portal = config.pb_config.pdf_system_loc + html_file_name;
                    this.const_policy.policy_url = pdf_web_path_portal;
                    this.const_policy.feedfile_url = config.environment.downloadurl + config.pb_config.pdf_web_loc + "EdelweissCVMotor_FeedFile_" + policy_number + ".xlsx";
//                    if (this.lm_request['product_id'] === 10) {
//                        this.const_policy.feedfile_url = config.environment.downloadurl + config.pb_config.pdf_web_loc + "EdelweissCVMotor_FeedFile_" + policy_number + ".csv";
//                    }
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
EdelweissCVMotor.prototype.pdf_call = function (url, args, pdf_sys_loc) {
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
EdelweissCVMotor.prototype.pdf_response_handler = function (objResponseJson) {
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
            policy.feedfile_url = config.environment.downloadurl + config.pb_config.pdf_web_loc + "EdelweissCVMotor_FeedFile_" + objProduct.lm_request['policy_number'] + ".xlsx";
            policy.pdf_status = 'SUCCESS';
            var html_file_path = appRoot + "/resource/request_file/Edelweiss_CV_CH_SampleHtml.html"; //for UAT
            if (this.prepared_request.hasOwnProperty('vehicle_insurance_subtype') && this.prepared_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
                html_file_path = appRoot + "/resource/request_file/Edelweiss_CV_TP_SampleHtml.html";
            }
            var pdf_file_path = appRoot + "/tmp/pdf/" + this.constructor.name + '_' + product_name + '_POLICY_' + objProduct.lm_request['policy_number'] + '.pdf';
            var html_pdf_file_path = appRoot + "/tmp/pdf/" + this.constructor.name + '_' + product_name + '_POLICY_' + objProduct.lm_request['policy_number'] + '.html';
            var htmlPol = fs.readFileSync(html_file_path, 'utf8');
            var User_Data = require(appRoot + '/models/user_data');
            User_Data.findOne({"Request_Unique_Id": objProduct.lm_request['search_reference_number']}, function (err, dbUserData) {
                if (dbUserData) {
                    let is_tp_only = false;
                    if (dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'].indexOf('0CH') > -1) {
                        is_tp_only = true;
                    } else {
                        is_tp_only = false;
                    }
                    var cust_dob = dbUserData.Erp_Qt_Request_Core['___birth_date___'].split("-");
                    var nominee_dob = dbUserData.Erp_Qt_Request_Core['___nominee_birth_date___'].split("-");
                    //process for pg_data
                    var Processed_Request = dbUserData.Proposal__Request_Core;
                    var Erp_Qt_Request_Core = dbUserData.Erp_Qt_Request_Core;
                    var mdp_prm = (dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_final_premium___']) - ((Erp_Qt_Request_Core['___addon_zero_dep_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_zero_dep_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_invoice_price_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_invoice_price_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_consumable_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_consumable_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_personal_belonging_loss_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_personal_belonging_loss_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_engine_protector_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_engine_protector_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_key_lock_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_key_lock_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_road_assist_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_road_assist_cover___'] : 0) + (Erp_Qt_Request_Core['___addon_ncb_protection_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_ncb_protection_cover___'] : 0));
                    var qr_text = 'Policy No: ' + objProduct.lm_request['policy_number'].toString() + '+Customer Name:' + Erp_Qt_Request_Core['___salutation___'] + ' ' + Erp_Qt_Request_Core['___first_name___'] + ' ' + Erp_Qt_Request_Core['___middle_name___'] + ' ' + Erp_Qt_Request_Core['___last_name___'] + '+Engine no:' + Erp_Qt_Request_Core['___engine_number___'] + '+Chassis No:' + Erp_Qt_Request_Core['___chassis_number___'] + '+Vehicle No:' + ((Erp_Qt_Request_Core['___vehicle_insurance_type___'] === 'new') ? (Erp_Qt_Request_Core['___registration_no_1___'] + ' ' + Erp_Qt_Request_Core['___registration_no_2___']) : (Erp_Qt_Request_Core['___registration_no___'])) + '+Policy Start date:' + moment(Erp_Qt_Request_Core['___policy_start_date___']).format("DD/MM/YYYY HH:mm:ss") + '+Policy end date:' + moment(Erp_Qt_Request_Core['___policy_end_date___']).format("DD/MM/YYYY HH:mm:ss") + '+URL:https://edelweissinsurance.com';
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
                        "___non_electrical_accessory___": (dbUserData.Erp_Qt_Request_Core['___non_electrical_accessory___'] - 0 > 0 && dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_non_elect_access___'] - 0 > 0) ? (dbUserData.Erp_Qt_Request_Core['___non_electrical_accessory___'].toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,") : "0",
                        "___electrical_accessory___": (dbUserData.Erp_Qt_Request_Core['___electrical_accessory___'] - 0 > 0 && dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_elect_access___'] - 0 > 0) ? (dbUserData.Erp_Qt_Request_Core['___electrical_accessory___'].toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,") : "0",
                        "___external_bifuel_value___": (dbUserData.Erp_Qt_Request_Core['___external_bifuel_value___'].toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
                        "___total_si_idv___": ((parseInt(dbUserData.Erp_Qt_Request_Core['___vehicle_expected_idv___']) + ((dbUserData.Erp_Qt_Request_Core['___non_electrical_accessory___'] - 0 > 0 && dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_non_elect_access___'] - 0 > 0) ? parseInt(dbUserData.Erp_Qt_Request_Core['___non_electrical_accessory___']) : 0) + ((dbUserData.Erp_Qt_Request_Core['___electrical_accessory___'] - 0 > 0 && dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_elect_access___'] - 0 > 0) ? parseInt(dbUserData.Erp_Qt_Request_Core['___electrical_accessory___']) : 0) + parseInt(dbUserData.Erp_Qt_Request_Core['___external_bifuel_value___'])).toString()).replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
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
                        "___paid_amt___": (objProduct.lm_request['transaction_amount']).toString().split('.')[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,"),
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
                        '___is_financial___': dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___'] !== "0" ? is_financial : "",
                        //"___hypothecated___": dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___'] === "Hypothecation" ? dbUserData.Erp_Qt_Request_Core['___financial_institute_name___'] : "...................................................",
                        //"___lease_agreement___": dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___'] === "Lease agreement" ? dbUserData.Erp_Qt_Request_Core['___financial_institute_name___'] : "...................................................",
                        //"___agreement___": dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___'] === "Hire Purchase" ? dbUserData.Erp_Qt_Request_Core['___financial_institute_name___'] : "...................................................",
                        "___posp_name___": posp_name,
                        "___posp_pan_no___": posp_pan_no,
                        "___imt_23___": (Erp_Qt_Request_Core.hasOwnProperty('___imt23___') && Erp_Qt_Request_Core['___imt23___'] == 'yes' && Erp_Qt_Request_Core['___premium_breakup_tp_cover_imt23___'] > 0) ? Erp_Qt_Request_Core['___premium_breakup_tp_cover_imt23___'] : "0",
                        "___hide_previous_insurer___": dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_type___'] === "renew" ? "" : "display:none;"
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
                    try {
                        var http = require('https');
                        console.log('EdelweissPdfUrl');
                        //var insurer_pdf_url = "http://qa.policyboss.com:3000/html2pdf?o=download&u=http://download.policyboss.com/pdf-files/policy/EdelweissCVMotor_CAR_POLICY_600006021.html";
                        var insurer_pdf_url = config.environment.pdf_url + html_web_path_portal;
                        //var insurer_pdf_url = html_web_path_portal;//Local
                        var file_horizon = fs.createWriteStream(pdf_file_path);
                        var request_horizon = http.get(insurer_pdf_url, function (response) {
                            response.pipe(file_horizon);
                        });
                    } catch (ex1) {
                        console.error('Exception', this.constructor.name, 'verification_response_handler', ex1);
                    }
                    if (objProduct.lm_request['product_id'] === 12) {
                        var ff_file_name = "EdelweissCVMotor_FeedFile_" + objProduct.lm_request['policy_number'] + ".xlsx";
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
                                bold: false,
                                size: 11
                            }
                        });
                        let FF_Vehicle_Sub_Class_Type;
                        let FF_Vehicle_Sub_Class_Type_obj = {
                            "gcv_public_otthw": "Goods Carrying vehicles other than three wheelers - Public",
                            "gcv_private_otthw": "Goods Carrying vehicles other than three wheelers - Private",
                            "gcv_public_thwpc": "Goods Carrying motorised three wheelers and pedals cycles - Public",
                            "gcv_private_thwpc": "Goods Carrying motorised three wheelers and pedals cycles - Private"
                        };
                        FF_Vehicle_Sub_Class_Type = FF_Vehicle_Sub_Class_Type_obj[dbUserData.Erp_Qt_Request_Core['___vehicle_sub_class___']];

                        //row 1
                        worksheet.cell(1, 1).string('Source').style(styleh);
                        worksheet.cell(1, 2).string('Policy_Number').style(styleh);
                        worksheet.cell(1, 3).string('Agent_Login_Email_ID').style(styleh);
                        worksheet.cell(1, 4).string('Branch').style(styleh);
                        worksheet.cell(1, 5).string('Type_of_Business').style(styleh);
                        worksheet.cell(1, 6).string('Policy_Type').style(styleh);
                        worksheet.cell(1, 7).string('Sub policy type').style(styleh);
                        worksheet.cell(1, 8).string('Policy_Start_Date').style(styleh);
                        worksheet.cell(1, 9).string('Main_Applicant_Proposer_Type').style(styleh);
                        worksheet.cell(1, 10).string('OwnDamage Policy Period').style(styleh);
                        worksheet.cell(1, 11).string('TP Policy Period').style(styleh);
                        worksheet.cell(1, 12).string('Add-On Policy Period').style(styleh);
                        worksheet.cell(1, 13).string('Previous Insurance Policy').style(styleh);
                        worksheet.cell(1, 14).string('Kind of Policy').style(styleh);
                        worksheet.cell(1, 15).string('Previous Insurance Company Name ').style(styleh);
                        worksheet.cell(1, 16).string('Previous Insurance Company Address').style(styleh);
                        worksheet.cell(1, 17).string('Previous Policy Start Date ').style(styleh);
                        worksheet.cell(1, 18).string('Previous Policy End Date').style(styleh);
                        worksheet.cell(1, 19).string('Previous Policy No').style(styleh);
                        worksheet.cell(1, 20).string('Previous Claims Made').style(styleh);
                        worksheet.cell(1, 21).string('Nature of Loss').style(styleh);
                        worksheet.cell(1, 22).string('Vehicle Type ').style(styleh);
                        worksheet.cell(1, 23).string('Make').style(styleh);
                        worksheet.cell(1, 24).string('Model').style(styleh);
                        worksheet.cell(1, 25).string('Variant').style(styleh);
                        worksheet.cell(1, 26).string('Vehicle Sub Class Type').style(styleh);
                        worksheet.cell(1, 27).string('New_or_Used').style(styleh);
                        worksheet.cell(1, 28).string('Year_of_Manufacture').style(styleh);
                        worksheet.cell(1, 29).string('Registration_Date').style(styleh);
                        worksheet.cell(1, 30).string('Engine_Number').style(styleh);
                        worksheet.cell(1, 31).string('Chassis_Number').style(styleh);
                        worksheet.cell(1, 32).string('Imported Vehicle without Custom duty ').style(styleh);
                        worksheet.cell(1, 33).string('Fibre_Glass_Fuel_Tank').style(styleh);
                        worksheet.cell(1, 34).string('Bodystyle_Description').style(styleh);
                        worksheet.cell(1, 35).string('Body_Type').style(styleh);
                        worksheet.cell(1, 36).string('Cover for motor lamps tyres etc').style(styleh);
                        worksheet.cell(1, 37).string('Location for parking during the day ').style(styleh);
                        worksheet.cell(1, 38).string('Location for parking during the night ').style(styleh);
                        worksheet.cell(1, 39).string('Color of Vehicle ').style(styleh);
                        worksheet.cell(1, 40).string('Type of Modification ').style(styleh);
                        worksheet.cell(1, 41).string('Use of Vehicle ').style(styleh);
                        worksheet.cell(1, 42).string('Average Daily use of the vehicle').style(styleh);
                        worksheet.cell(1, 43).string('Used Confined to Own Premises ').style(styleh);
                        worksheet.cell(1, 44).string('Driving Tuitions Usage ').style(styleh);
                        worksheet.cell(1, 45).string('Anti-Theft_Device_Installed').style(styleh);
                        worksheet.cell(1, 46).string('Type_of_Device_Installed').style(styleh);
                        worksheet.cell(1, 47).string('Geographical Extension ').style(styleh);
                        worksheet.cell(1, 48).string('Extension Country names ').style(styleh);
                        worksheet.cell(1, 49).string('Foreign Embassy Vehicle ').style(styleh);
                        worksheet.cell(1, 50).string('Foreign Embassy Registration No ').style(styleh);
                        worksheet.cell(1, 51).string('Bus Type ').style(styleh);
                        worksheet.cell(1, 52).string('Vehicle SubType').style(styleh);
                        worksheet.cell(1, 53).string('Indemnity to Hirer ').style(styleh);
                        worksheet.cell(1, 54).string('Overturning ').style(styleh);
                        worksheet.cell(1, 55).string('Revised GVW ').style(styleh);
                        worksheet.cell(1, 56).string('GPS Tracking ').style(styleh);
                        worksheet.cell(1, 57).string('State_Code').style(styleh);
                        worksheet.cell(1, 58).string('District_Code').style(styleh);
                        worksheet.cell(1, 59).string('Vehicle_Series_Number').style(styleh);
                        worksheet.cell(1, 60).string('Registration_Number').style(styleh);
                        worksheet.cell(1, 61).string('Transfer_of_NCB').style(styleh);
                        worksheet.cell(1, 62).string('Transfer_of_NCB_Percent').style(styleh);
                        worksheet.cell(1, 63).string('Proof_Document_Date').style(styleh);
                        worksheet.cell(1, 64).string('Proof_Provided_for_NCB').style(styleh);
                        worksheet.cell(1, 65).string('Own Damage Basic').style(styleh);
                        worksheet.cell(1, 66).string('Own Damage Basic_IDV').style(styleh);
                        worksheet.cell(1, 67).string('Non_Electrical_Accessories').style(styleh);
                        worksheet.cell(1, 68).string('Non_Electrical_Description').style(styleh);
                        worksheet.cell(1, 69).string('Value_of_Non_Electrical').style(styleh);
                        worksheet.cell(1, 70).string('Electrical_Accessories').style(styleh);
                        worksheet.cell(1, 71).string('Electrical_Description').style(styleh);
                        worksheet.cell(1, 72).string('Value_of_Electrical').style(styleh);
                        worksheet.cell(1, 73).string('Used for Commercial and Private purpose (IMT 34)').style(styleh);
                        worksheet.cell(1, 74).string('CNG_LPG_Gas_Kit').style(styleh);
                        worksheet.cell(1, 75).string('CNG_LPG_Description').style(styleh);
                        worksheet.cell(1, 76).string('Value_of_CNG_LPG').style(styleh);
                        worksheet.cell(1, 77).string('Internal_CNG/LPG_Gas_Kit').style(styleh);
                        worksheet.cell(1, 78).string('Internal_CNG/LPG_Gas_Kit_Description').style(styleh);
                        worksheet.cell(1, 79).string('Trailer OD (IMT 30)').style(styleh);
                        worksheet.cell(1, 80).string('No.of Trailers').style(styleh);
                        worksheet.cell(1, 81).string('Trailer Description ').style(styleh);
                        worksheet.cell(1, 82).string('Trailer OD IDV Value ').style(styleh);
                        worksheet.cell(1, 83).string('Registration Details-1').style(styleh);
                        worksheet.cell(1, 84).string('Chassis Number-1').style(styleh);
                        worksheet.cell(1, 85).string('Registration Details-2').style(styleh);
                        worksheet.cell(1, 86).string('Chassis Number-2').style(styleh);
                        worksheet.cell(1, 87).string('Registration Details-3').style(styleh);
                        worksheet.cell(1, 88).string('Chassis Number-3').style(styleh);
                        worksheet.cell(1, 89).string('Registration Details-4').style(styleh);
                        worksheet.cell(1, 90).string('Chassis Number-4').style(styleh);
                        worksheet.cell(1, 91).string('Registration Details-5').style(styleh);
                        worksheet.cell(1, 92).string('Chassis Number-5').style(styleh);
                        worksheet.cell(1, 93).string('Third_Party_Property_Damage').style(styleh);
                        worksheet.cell(1, 94).string('Liability for Bi-Fuel Kit').style(styleh);
                        worksheet.cell(1, 95).string('Used for Commercial and Private purpose (IMT 34)').style(styleh);
                        worksheet.cell(1, 96).string('PA_Owner_Driver').style(styleh);
                        worksheet.cell(1, 97).string('Policy_Tenure').style(styleh);
                        worksheet.cell(1, 98).string('PA_for_Unnamed_Passenger').style(styleh);
                        worksheet.cell(1, 99).string('Sum_Insured_Per_Person').style(styleh);
                        worksheet.cell(1, 100).string('Number of Unnamed Passengers ').style(styleh);
                        worksheet.cell(1, 101).string('PA to Paid Driver/Cleaner/Conductor - SI (IMT 17)').style(styleh);
                        worksheet.cell(1, 102).string('Sum_Insured').style(styleh);
                        worksheet.cell(1, 103).string('Number of Paid Drivers ').style(styleh);
                        worksheet.cell(1, 104).string('LL for Non-fare Paying Passengers (IMT 37)').style(styleh);
                        worksheet.cell(1, 105).string('Number of Non fare Paying Passengers ').style(styleh);
                        worksheet.cell(1, 106).string('LL for Fare Paying Passengers (IMT 38)').style(styleh);
                        worksheet.cell(1, 107).string('Number of Passengers ').style(styleh);
                        worksheet.cell(1, 108).string('Legal Liability to Employees').style(styleh);
                        worksheet.cell(1, 109).string('Number of Employees ').style(styleh);
                        worksheet.cell(1, 110).string('Legal Liability to Paid Drivers').style(styleh);
                        worksheet.cell(1, 111).string('Number of Paid Drivers ').style(styleh);
                        worksheet.cell(1, 112).string('Trailer TP (IMT 30) ').style(styleh);
                        worksheet.cell(1, 113).string('No.of Trailers ').style(styleh);
                        worksheet.cell(1, 114).string('Trailer Description ').style(styleh);
                        worksheet.cell(1, 115).string('Premium for Licensed Passengers').style(styleh);
                        worksheet.cell(1, 116).string('Invoice Value Protect').style(styleh);
                        worksheet.cell(1, 117).string('NCB Protect').style(styleh);
                        worksheet.cell(1, 118).string('Depreciation Protect').style(styleh);
                        worksheet.cell(1, 119).string('Consumable Expenses Protect').style(styleh);
                        worksheet.cell(1, 120).string('Emi Protect').style(styleh);
                        worksheet.cell(1, 121).string('Emi Value').style(styleh);
                        worksheet.cell(1, 122).string('Required_Discount').style(styleh);
                        worksheet.cell(1, 123).string('Finance_Type').style(styleh);
                        worksheet.cell(1, 124).string('Financier_Name').style(styleh);
                        worksheet.cell(1, 125).string('Branch_Name').style(styleh);
                        worksheet.cell(1, 126).string('Net Premium').style(styleh);
                        worksheet.cell(1, 127).string('GST').style(styleh);
                        worksheet.cell(1, 128).string('Total Premium Payable ').style(styleh);
                        worksheet.cell(1, 129).string('IDV_Value').style(styleh);
                        worksheet.cell(1, 130).string('Comment_to_UW').style(styleh);
                        worksheet.cell(1, 131).string('Valid_Driving_License').style(styleh);
                        worksheet.cell(1, 132).string('Already_Have_PA_Cover').style(styleh);
                        worksheet.cell(1, 133).string('Agree').style(styleh);
                        worksheet.cell(1, 134).string('Ind_Salutation').style(styleh);
                        worksheet.cell(1, 135).string('Ind_First_Name').style(styleh);
                        worksheet.cell(1, 136).string('Ind_Middle_Name').style(styleh);
                        worksheet.cell(1, 137).string('Ind_Last_Name').style(styleh);
                        worksheet.cell(1, 138).string('Ind_Gender').style(styleh);
                        worksheet.cell(1, 139).string('Ind_Marital_Status').style(styleh);
                        worksheet.cell(1, 140).string('Ind_Date_of_Birth').style(styleh);
                        worksheet.cell(1, 141).string('Ind_Nationality').style(styleh);
                        worksheet.cell(1, 142).string('Ind_Current_Address_Line_1').style(styleh);
                        worksheet.cell(1, 143).string('Ind_Current_Address_Line_2').style(styleh);
                        worksheet.cell(1, 144).string('Ind_Current_Address_Line_3').style(styleh);
                        worksheet.cell(1, 145).string('Ind_Pincode').style(styleh);
                        worksheet.cell(1, 146).string('Ind_Current_City').style(styleh);
                        worksheet.cell(1, 147).string('Ind_PAN_Number').style(styleh);
                        worksheet.cell(1, 148).string('Ind_GST_Number').style(styleh);
                        worksheet.cell(1, 149).string('Ind_Aadhar_Number').style(styleh);
                        worksheet.cell(1, 150).string('Ind_Mobile_Number').style(styleh);
                        worksheet.cell(1, 151).string('Ind_Email_ID').style(styleh);
                        worksheet.cell(1, 152).string('Ind_Occupation').style(styleh);
                        worksheet.cell(1, 153).string('Org_GST_Registered').style(styleh);
                        worksheet.cell(1, 154).string('Org_GST_Number').style(styleh);
                        worksheet.cell(1, 155).string('Org_Salutation').style(styleh);
                        worksheet.cell(1, 156).string('Org_Company_Name').style(styleh);
                        worksheet.cell(1, 157).string('Org_Current_Address_Line_1').style(styleh);
                        worksheet.cell(1, 158).string('Org_Current_Address_Line_2').style(styleh);
                        worksheet.cell(1, 159).string('Org_Current_Address_Line_3').style(styleh);
                        worksheet.cell(1, 160).string('Org_Pincode').style(styleh);
                        worksheet.cell(1, 161).string('Org_Current_City').style(styleh);
                        worksheet.cell(1, 162).string('Org_PAN_Number').style(styleh);
                        worksheet.cell(1, 163).string('Org_Mobile_Number').style(styleh);
                        worksheet.cell(1, 164).string('Org_Email_ID').style(styleh);
                        worksheet.cell(1, 165).string('Nominee_Name').style(styleh); //Add
                        worksheet.cell(1, 166).string('Relationship_with_Applicant').style(styleh);
                        worksheet.cell(1, 167).string('Others').style(styleh);
                        worksheet.cell(1, 168).string('Nominee_Date_of_Birth').style(styleh);
                        worksheet.cell(1, 169).string('Guardian_Name').style(styleh);
                        worksheet.cell(1, 170).string('Inspection_Number').style(styleh);
                        worksheet.cell(1, 171).string('Payment_Mode').style(styleh);
                        worksheet.cell(1, 172).string('Cheque_From_1').style(styleh);
                        worksheet.cell(1, 173).string('Cheque_Bank_Name_1').style(styleh);
                        worksheet.cell(1, 174).string('Cheque_Branch_1').style(styleh);
                        worksheet.cell(1, 175).string('Cheque_IFSC_1').style(styleh);
                        worksheet.cell(1, 176).string('Cheque_Account_Number_1').style(styleh);
                        worksheet.cell(1, 177).string('Cheque_Date_1').style(styleh);
                        worksheet.cell(1, 178).string('Cheque_Number_1').style(styleh);
                        worksheet.cell(1, 179).string('Cheque_Name_1').style(styleh);
                        worksheet.cell(1, 180).string('Cheque_Amount_1').style(styleh);
                        worksheet.cell(1, 181).string('Cheque_From_2').style(styleh);
                        worksheet.cell(1, 182).string('Cheque_Bank_Name_2').style(styleh);
                        worksheet.cell(1, 183).string('Cheque_Branch_2').style(styleh);
                        worksheet.cell(1, 184).string('Cheque_IFSC_2').style(styleh);
                        worksheet.cell(1, 185).string('Cheque_Account_Number_2').style(styleh);
                        worksheet.cell(1, 186).string('Cheque_Date_2').style(styleh); //Add
                        worksheet.cell(1, 187).string('Cheque_Number_2').style(styleh); //Add
                        worksheet.cell(1, 188).string('Cheque_Name_2').style(styleh);
                        worksheet.cell(1, 189).string('Cheque_Amount_2').style(styleh);
                        worksheet.cell(1, 190).string('Cheque_From_3').style(styleh);
                        worksheet.cell(1, 191).string('Cheque_Bank_Name_3').style(styleh);
                        worksheet.cell(1, 192).string('Cheque_Branch_3').style(styleh);
                        worksheet.cell(1, 193).string('Cheque_IFSC_3').style(styleh);
                        worksheet.cell(1, 194).string('Cheque_Account_Number_3').style(styleh);
                        worksheet.cell(1, 195).string('Cheque_Date_3').style(styleh);
                        worksheet.cell(1, 196).string('Cheque_Number_3').style(styleh);
                        worksheet.cell(1, 197).string('Cheque_Name_3').style(styleh);
                        worksheet.cell(1, 198).string('Cheque_Amount_3').style(styleh);
                        worksheet.cell(1, 199).string('NEFT_From_1').style(styleh);
                        worksheet.cell(1, 200).string('NEFT_Bank_Name_1').style(styleh);
                        worksheet.cell(1, 201).string('NEFT_Instrument_Number_1').style(styleh);
                        worksheet.cell(1, 202).string('NEFT_Account_Number_1').style(styleh);
                        worksheet.cell(1, 203).string('NEFT_Accountholder_1').style(styleh);
                        worksheet.cell(1, 204).string('NEFT_Instrument_Date_1').style(styleh);//Active TP Policy Period for SAOD
                        worksheet.cell(1, 205).string('NEFT_Amount_1').style(styleh);
                        worksheet.cell(1, 206).string('NEFT_From_2').style(styleh);
                        worksheet.cell(1, 207).string('NEFT_Bank_Name_2').style(styleh);
                        worksheet.cell(1, 208).string('NEFT_Instrument_Number_2').style(styleh);
                        worksheet.cell(1, 209).string('NEFT_Account_Number_2').style(styleh);
                        worksheet.cell(1, 210).string('NEFT_Accountholder_2').style(styleh);
                        worksheet.cell(1, 211).string('NEFT_Instrument_Date_2').style(styleh);
                        worksheet.cell(1, 212).string('NEFT_Amount_2').style(styleh);
                        worksheet.cell(1, 213).string('NEFT_From_3').style(styleh);
                        worksheet.cell(1, 214).string('NEFT_Bank_Name_3').style(styleh);
                        worksheet.cell(1, 215).string('NEFT_Instrument_Number_3').style(styleh);
                        worksheet.cell(1, 216).string('NEFT_Account_Number_3').style(styleh);
                        worksheet.cell(1, 217).string('NEFT_Accountholder_3').style(styleh);
                        worksheet.cell(1, 218).string('NEFT_Instrument_Date_3').style(styleh);
                        worksheet.cell(1, 219).string('NEFT_Amount_3').style(styleh);
                        worksheet.cell(1, 220).string('Cash_From_1').style(styleh);
                        worksheet.cell(1, 221).string('Cash_Name_1').style(styleh);
                        worksheet.cell(1, 222).string('Cash_Amount_1').style(styleh);
                        worksheet.cell(1, 223).string('Cash_Date_1').style(styleh);
                        worksheet.cell(1, 224).string('Sub Intermediary Category').style(styleh);
                        worksheet.cell(1, 225).string('Sub Intermediary Code').style(styleh);
                        worksheet.cell(1, 226).string('Sub Intermediary Name').style(styleh);
                        worksheet.cell(1, 227).string('Sub Intermediary Phone Email').style(styleh);
                        worksheet.cell(1, 228).string('POSP PAN Aadhar No').style(styleh);
                        worksheet.cell(1, 229).string('Business Source Unique Id').style(styleh);
                        worksheet.cell(1, 230).string('Account No').style(styleh);
                        worksheet.cell(1, 231).string('Is Payment Verified').style(styleh);
                        //row 2
                        worksheet.cell(2, 1).string('');
                        worksheet.cell(2, 2).string(objProduct.lm_request.hasOwnProperty('policy_number') ? objProduct.lm_request['policy_number'] : ''); //Incorrect Policy Number
                        worksheet.cell(2, 3).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___crn___') ? (dbUserData.Erp_Qt_Request_Core['___crn___']) : '');
                        worksheet.cell(2, 4).string('Mumbai');
                        worksheet.cell(2, 5).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___vehicle_insurance_type___') ? (dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_type___'] === "renew" ? "Rollover" : "New") : '');
                        worksheet.cell(2, 6).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___vehicle_insurance_subtype___') ? (dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1CH_0TP" ? "Package" : "Liability Only") : '');
                        worksheet.cell(2, 7).string('');
                        worksheet.cell(2, 8).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___policy_start_date___') ? (moment(dbUserData.Erp_Qt_Request_Core['___policy_start_date___']).format("DD-MM-YYYY")) : '');
//                        worksheet.cell(2, 8).string(moment(new Date(dbUserData.Erp_Qt_Request_Core['___policy_start_date___'])).format("DD-MM-YYYY"));
                        worksheet.cell(2, 9).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___vehicle_registration_type___') ? (dbUserData.Erp_Qt_Request_Core['___vehicle_registration_type___'] === "individual" ? "Person" : "Organisation") : '');
                        worksheet.cell(2, 10).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___policy_od_tenure___') ? (dbUserData.Erp_Qt_Request_Core['___policy_od_tenure___']) : '');
                        worksheet.cell(2, 11).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___policy_tp_tenure___') ? (dbUserData.Erp_Qt_Request_Core['___policy_tp_tenure___']) : '');
                        worksheet.cell(2, 12).string("");
                        worksheet.cell(2, 13).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___is_policy_exist___') ? (dbUserData.Erp_Qt_Request_Core['___is_policy_exist___'] == 'yes' ? 'Yes' : 'No') : '');//Previous Insurance Policy
                        worksheet.cell(2, 14).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___vehicle_insurance_subtype___') ? (dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1CH_0TP" ? "Package With Add-Ons" : "Liability Only") : '');
                        worksheet.cell(2, 15).string(objProduct.insurer_master.prev_insurer.insurer_db_master.hasOwnProperty('InsurerName') ? (objProduct.insurer_master.prev_insurer.insurer_db_master['InsurerName']) : '');
                        worksheet.cell(2, 16).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___vehicle_insurance_type___') ? (dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_type___'] === "renew" ? 'Mumbai' : '') : '');
//                        worksheet.cell(2, 17).string(moment(dbUserData.Premium_List.Summary.Request_Product['pre_policy_start_date']).format("DD-MM-YYYY"));
                        worksheet.cell(2, 17).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___vehicle_insurance_type___') && dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_type___'] === "renew" ? (dbUserData.Premium_List.Summary.Request_Product.hasOwnProperty('pre_policy_start_date') ? (moment(dbUserData.Premium_List.Summary.Request_Product['pre_policy_start_date']).format("DD-MM-YYYY")) : '') : '');
//                        worksheet.cell(2, 18).string(moment(dbUserData.Erp_Qt_Request_Core['___policy_expiry_date___']).format("DD-MM-YYYY"));
                        worksheet.cell(2, 18).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___vehicle_insurance_type___') && dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_type___'] === "renew" ? (dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___policy_expiry_date___') ? (moment(dbUserData.Erp_Qt_Request_Core['___policy_expiry_date___']).format("DD-MM-YYYY")) : '') : '');
                        worksheet.cell(2, 19).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___previous_policy_number___') ? (dbUserData.Erp_Qt_Request_Core['___previous_policy_number___']) : '');
                        worksheet.cell(2, 20).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___vehicle_insurance_type___') && dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_type___'] === "renew" ? (dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___is_claim_exists___') && dbUserData.Erp_Qt_Request_Core['___is_claim_exists___'] == "no" ? "No" : "Yes") : "");
                        worksheet.cell(2, 21).string('');
                        worksheet.cell(2, 22).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___pb_product_type___') && dbUserData.Erp_Qt_Request_Core['___pb_product_type___'] == 'GCV' ? "Goods Carrying Vehicle" : (dbUserData.Erp_Qt_Request_Core['___pb_product_type___'] + ' Vehicle'));

                        worksheet.cell(2, 23).string(dbUserData.Processed_Request.hasOwnProperty('___dbmaster_insurer_vehicle_make_name___') ? (dbUserData.Processed_Request['___dbmaster_insurer_vehicle_make_name___']) : '');
                        worksheet.cell(2, 24).string(dbUserData.Processed_Request.hasOwnProperty('___dbmaster_insurer_vehicle_model_name___') ? (dbUserData.Processed_Request['___dbmaster_insurer_vehicle_model_name___']) : '');
                        worksheet.cell(2, 25).string(dbUserData.Processed_Request.hasOwnProperty('___dbmaster_insurer_vehicle_variant_name___') ? (dbUserData.Processed_Request['___dbmaster_insurer_vehicle_variant_name___']) : '');
                        worksheet.cell(2, 26).string(FF_Vehicle_Sub_Class_Type);
//                        worksheet.cell(2, 27).string(dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_type___'] === "renew" ? "Used" : "New");
                        worksheet.cell(2, 27).string("New");
                        worksheet.cell(2, 28).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___vehicle_manf_year___') ? (dbUserData.Erp_Qt_Request_Core['___vehicle_manf_year___']) : '');
                        worksheet.cell(2, 29).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___vehicle_registration_date___') ? (moment(dbUserData.Erp_Qt_Request_Core['___vehicle_registration_date___']).format("DD-MM-YYYY")) : '');
//                        worksheet.cell(2, 29).string(moment(new Date(dbUserData.Erp_Qt_Request_Core['___vehicle_registration_date___'])).format("DD-MM-YYYY")); 
                        worksheet.cell(2, 30).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___engine_number___') ? (dbUserData.Erp_Qt_Request_Core['___engine_number___']) : '');
                        worksheet.cell(2, 31).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___chassis_number___') ? (dbUserData.Erp_Qt_Request_Core['___chassis_number___']) : '');

                        worksheet.cell(2, 32).string(''); // Imported Vehicle without Custom duty

                        worksheet.cell(2, 33).string('No'); //Fibre_Glass_Fuel_Tank

                        worksheet.cell(2, 34).string('');
                        worksheet.cell(2, 35).string('');

//                        worksheet.cell(2, 36).string('');//Cover for motor lamps tyres etc
                        worksheet.cell(2, 36).string((dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___imt23___') && dbUserData.Erp_Qt_Request_Core['___imt23___'] === "yes" && dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___premium_breakup_tp_cover_imt23___') && dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cover_imt23___'].toString() !== "0") ? "Yes" : "N");//Cover for motor lamps tyres etc

                        worksheet.cell(2, 37).string('');
                        worksheet.cell(2, 38).string('');
                        worksheet.cell(2, 39).string(''); //New Or Used?
                        worksheet.cell(2, 40).string('');

                        worksheet.cell(2, 41).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___vehicle_registration_type___') && dbUserData.Erp_Qt_Request_Core['___vehicle_registration_type___'] === "individual" ? "Private" : "Business");//Use of Vehicle

                        worksheet.cell(2, 42).string('');
                        worksheet.cell(2, 43).string('No');
                        worksheet.cell(2, 44).string('No');
                        worksheet.cell(2, 45).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___premium_breakup_od_disc_anti_theft___') && dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_disc_anti_theft___'] > 0 ? "Yes" : "No");
                        worksheet.cell(2, 46).string('');
                        worksheet.cell(2, 47).string('No');
                        worksheet.cell(2, 48).string('');
                        worksheet.cell(2, 49).string('');
                        worksheet.cell(2, 50).string('');
                        worksheet.cell(2, 51).string('');
                        worksheet.cell(2, 52).string('');
                        worksheet.cell(2, 53).string('No');
                        worksheet.cell(2, 54).string('');
                        worksheet.cell(2, 55).string('');
                        worksheet.cell(2, 56).string('No');
                        worksheet.cell(2, 57).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___registration_no_1___') ? (dbUserData.Erp_Qt_Request_Core['___registration_no_1___']) : '');
                        worksheet.cell(2, 58).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___registration_no_2___') ? (dbUserData.Erp_Qt_Request_Core['___registration_no_2___']) : '');
                        worksheet.cell(2, 59).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___registration_no_3___') ? (dbUserData.Erp_Qt_Request_Core['___registration_no_3___']) : '');
                        worksheet.cell(2, 60).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___registration_no_4___') ? (dbUserData.Erp_Qt_Request_Core['___registration_no_4___']) : '');
//                        worksheet.cell(2, 61).string(dbUserData.Erp_Qt_Request_Core['___is_claim_exists___'] === "Yes" ? "No" : "Yes"); //Transfer of NCB Yes/ NO
                        worksheet.cell(2, 61).string((dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___vehicle_insurance_type___') && dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_type___'] === "renew" && dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___vehicle_insurance_subtype___') && dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1CH_0TP") ? (dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___is_claim_exists___') && dbUserData.Erp_Qt_Request_Core['___is_claim_exists___'] === "Yes" ? "Yes" : "No") : ''); //Transfer of NCB Yes/ NO       
//                        worksheet.cell(2, 62).string(dbUserData.Erp_Qt_Request_Core['___vehicle_ncb_current___'] + '%'); //Transfer of NCB If yes, then previous yr NCB in %
                        worksheet.cell(2, 62).string((dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___vehicle_insurance_type___') && dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_type___'] === "renew" && dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___vehicle_insurance_subtype___') && dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1CH_0TP") ? (dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___vehicle_ncb_current___') ? (dbUserData.Erp_Qt_Request_Core['___vehicle_ncb_current___'] + '%') : '') : ''); //Transfer of NCB If yes, then previous yr NCB in %
                        worksheet.cell(2, 63).string((dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___vehicle_insurance_type___') && dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_type___'] === "renew" && dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___vehicle_insurance_subtype___') && dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1CH_0TP") ? (dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___policy_expiry_date___') ? (moment(dbUserData.Erp_Qt_Request_Core['___policy_expiry_date___']).format("DD-MM-YYYY")) : '') : ''); //Previous policy end date                        
                        worksheet.cell(2, 64).string((dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___vehicle_insurance_type___') && dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_type___'] === "renew" && dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___vehicle_insurance_subtype___') && dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1CH_0TP") ? 'NCB declaration' : ''); //NCB declaration (hard coded)                        
                        worksheet.cell(2, 65).string(is_tp_only ? "No" : "Yes");

                        worksheet.cell(2, 66).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___vehicle_expected_idv___') ? (dbUserData.Erp_Qt_Request_Core['___vehicle_expected_idv___'].toString()) : '');

//                        worksheet.cell(2, 67).string(dbUserData.Erp_Qt_Request_Core['___non_electrical_accessory___'].toString() === "0" ? "No" : "Yes");
                        worksheet.cell(2, 67).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___non_electrical_accessory___') && dbUserData.Erp_Qt_Request_Core['___non_electrical_accessory___'].toString() === "0" ? "No" : (dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___premium_breakup_od_non_elect_access___') && dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_non_elect_access___'].toString() === "0" ? "No" : "Yes"));
                        worksheet.cell(2, 68).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___non_electrical_accessory___') && dbUserData.Erp_Qt_Request_Core['___non_electrical_accessory___'].toString() === "0" ? "" : "Non electrical accessories");//Non_Electrical_Description                        
//                        worksheet.cell(2, 69).string(dbUserData.Erp_Qt_Request_Core['___non_electrical_accessory___'].toString() === "0" ? "" : dbUserData.Erp_Qt_Request_Core['___non_electrical_accessory___'].toString()); //Value_of_Non_Electrical
                        worksheet.cell(2, 69).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___non_electrical_accessory___') && dbUserData.Erp_Qt_Request_Core['___non_electrical_accessory___'].toString() === "0" ? "" : (dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___premium_breakup_od_non_elect_access___') && dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_non_elect_access___'].toString() === "0" ? "" : (dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___non_electrical_accessory___') ? (dbUserData.Erp_Qt_Request_Core['___non_electrical_accessory___'].toString()) : ''))); //Value_of_Non_Electrical
//                        worksheet.cell(2, 70).string(dbUserData.Erp_Qt_Request_Core['___electrical_accessory___'].toString() === "0" ? "No" : "Yes"); //Electrical_Accessories
                        worksheet.cell(2, 70).string((dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___electrical_accessory___') && dbUserData.Erp_Qt_Request_Core['___electrical_accessory___'].toString() === "0") ? "No" : ((dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___premium_breakup_od_elect_access___') && dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_elect_access___'].toString() === "0") ? "No" : "Yes")); //Electrical_Accessories
                        worksheet.cell(2, 71).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___electrical_accessory___') && dbUserData.Erp_Qt_Request_Core['___electrical_accessory___'].toString() === "0" ? "" : "Electrical accessories"); //Electrical_Description                        
//                        worksheet.cell(2, 72).string(dbUserData.Erp_Qt_Request_Core['___electrical_accessory___'].toString() === "0" ? "" : dbUserData.Erp_Qt_Request_Core['___electrical_accessory___'].toString());//Value_of_Electrical
                        worksheet.cell(2, 72).string(dbUserData.hasOwnProperty('___electrical_accessory___') && dbUserData.Erp_Qt_Request_Core['___electrical_accessory___'].toString() === "0" ? "" : ((dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___premium_breakup_od_elect_access___') && dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_elect_access___'].toString() === "0") ? "" : (dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___electrical_accessory___') ? dbUserData.Erp_Qt_Request_Core['___electrical_accessory___'].toString() : '')));//Value_of_Electrical

                        worksheet.cell(2, 73).string('No'); //Used for Commercial and Private purpose (IMT 34)

                        worksheet.cell(2, 74).string(dbUserData.Processed_Request.hasOwnProperty('___dbmaster_insurer_vehicle_fueltype___') && ["CNG", "LPG"].indexOf(dbUserData.Processed_Request['___dbmaster_insurer_vehicle_fueltype___']) > -1 ? "Yes" : "No");
                        worksheet.cell(2, 75).string(''); //CNG_LPG_Description                        
                        worksheet.cell(2, 76).string(((dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___premium_breakup_od_cng_lpg___') ? (dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_cng_lpg___'] - 0) : 0) + (dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cng_lpg___'] - 0)).toString()); //Value_of_CNG_LPG
                        worksheet.cell(2, 77).string(["LPG", "CNG"].indexOf(dbUserData.Processed_Request['___dbmaster_insurer_vehicle_fueltype___']) > -1 ? "Yes" : "No");//Internal_CNG/LPG_Gas_Kit                        
                        worksheet.cell(2, 78).string(''); //Internal_CNG/LPG_Gas_Kit_Description
                        worksheet.cell(2, 79).string(''); //Trailer OD (IMT 30)
                        worksheet.cell(2, 80).string(''); //No.of Trailers 
                        worksheet.cell(2, 81).string('');  //Trailer Description 
                        worksheet.cell(2, 82).string(''); //Trailer OD IDV Value 
                        worksheet.cell(2, 83).string(''); //Registration Details-1
                        worksheet.cell(2, 84).string(''); //Chassis Number-1
                        worksheet.cell(2, 85).string(''); //Registration Details-2
                        worksheet.cell(2, 86).string(''); //Chassis Number-2
                        worksheet.cell(2, 87).string(''); //Registration Details-3
                        worksheet.cell(2, 88).string(''); //Chassis Number-3
                        worksheet.cell(2, 89).string(''); //Registration Details-4
                        worksheet.cell(2, 90).string(''); //Chassis Number-4
                        worksheet.cell(2, 91).string(''); //Registration Details-5
                        worksheet.cell(2, 92).string(''); //Chassis Number-5

                        worksheet.cell(2, 93).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___vehicle_insurance_subtype___') && dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? "0" : (dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___is_tppd___') && dbUserData.Erp_Qt_Request_Core['___is_tppd___'] === "no" ? "0" : "Upto 750000")); //Third_Party_Property_Damage                        

                        worksheet.cell(2, 94).string('No');//Liability for Bi-Fuel Kit

                        worksheet.cell(2, 95).string('No'); //Used for Commercial and Private purpose (IMT 34)

                        worksheet.cell(2, 96).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___vehicle_insurance_subtype___') && dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? "No" : (dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___is_pa_od___') && dbUserData.Erp_Qt_Request_Core['___is_pa_od___'].toString() === "yes" ? "Yes" : "No")); //PA_Owner_Driver

                        worksheet.cell(2, 97).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___policy_tenure___') ? dbUserData.Erp_Qt_Request_Core['___policy_tenure___'] : ''); //Policy_Tenure

//                        worksheet.cell(2, 98).string(dbUserData.Processed_Request['___pa_unnamed_passenger_si___'] === "" ? "No" : "Yes"); //PA_for_Unnamed_Passenger
                        worksheet.cell(2, 98).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___pa_unnamed_passenger_si___') && dbUserData.Erp_Qt_Request_Core['___pa_unnamed_passenger_si___'] === "" ? "No" : (((dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___premium_breakup_tp_cover_unnamed_passenger_pa___') && dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cover_unnamed_passenger_pa___'] == "") || (dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___premium_breakup_tp_cover_unnamed_passenger_pa___') && dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cover_unnamed_passenger_pa___'] == 0)) ? "No" : "Yes")); //PA_for_Unnamed_Passenger
                        worksheet.cell(2, 99).string(''); //(dbUserData.Processed_Request['___pa_unnamed_passenger_si___'] === "" ? "0" : dbUserData.Processed_Request['___pa_unnamed_passenger_si___']); //Sum_Insured_Per_Person

                        worksheet.cell(2, 100).string(''); //Number of Unnamed Passengers 

//                        worksheet.cell(2, 101).string('No'); //PA to Paid Driver/Cleaner/Conductor - SI (IMT 17)
                        worksheet.cell(2, 101).string(((dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___pa_paid_driver_si___') && dbUserData.Erp_Qt_Request_Core['___pa_paid_driver_si___'] == "") || (dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___pa_paid_driver_si___') && dbUserData.Erp_Qt_Request_Core['___pa_paid_driver_si___'] == 0)) ? "No" : (((dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___premium_breakup_tp_cover_paid_driver_pa___') && dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cover_paid_driver_pa___'] == "") || (dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___premium_breakup_tp_cover_paid_driver_pa___') && dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cover_paid_driver_pa___'] == 0)) ? "No" : "Yes")); //PA to Paid Driver/Cleaner/Conductor - SI (IMT 17)

                        worksheet.cell(2, 102).string(''); //string(dbUserData.Erp_Qt_Request_Core['___pa_owner_driver_si___']); //Sum_Insured                        
                        worksheet.cell(2, 103).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___is_llpd___') && dbUserData.Erp_Qt_Request_Core['___is_llpd___'].toString() === "yes" ? "1" : ""); //Number of Paid Drivers

                        worksheet.cell(2, 104).string(''); //LL for Non-fare Paying Passengers (IMT 37)

                        worksheet.cell(2, 105).string(''); //Number of Non fare Paying Passengers

                        worksheet.cell(2, 106).string(''); //LL for Fare Paying Passengers (IMT 38)

                        worksheet.cell(2, 107).string(''); //Number of Passengers 

                        worksheet.cell(2, 108).string(''); //Legal Liability to Employees

                        worksheet.cell(2, 109).string('');//Number of Employees 

                        worksheet.cell(2, 110).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___is_llpd___') && dbUserData.Erp_Qt_Request_Core['___is_llpd___'] == 'no' ? 'No' : 'Yes');//Legal Liability to Paid Drivers                        
                        worksheet.cell(2, 111).string(dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___is_llpd___') && dbUserData.Erp_Qt_Request_Core['___is_llpd___'].toString() === "yes" ? "1" : "0"); //Number of Paid Drivers 

                        worksheet.cell(2, 112).string('');//Trailer TP (IMT 30) 
                        worksheet.cell(2, 113).string('');//No.of Trailers 
                        worksheet.cell(2, 114).string(''); //Trailer Description 
                        worksheet.cell(2, 115).string('');//Premium for Licensed Passengers
                        worksheet.cell(2, 116).string('NO');
//                        worksheet.cell(2, 117).string('NO');//NCB Protect
                        worksheet.cell(2, 117).string(dbUserData.Processed_Request.hasOwnProperty('___addon_ncb_protection_cover___') && dbUserData.Processed_Request['___addon_ncb_protection_cover___'].toString().toLowerCase() === "no" ? "NO" : ((dbUserData.Processed_Request.hasOwnProperty('___premium_breakup_addon_ncb_protection_cover___') && dbUserData.Processed_Request['___premium_breakup_addon_ncb_protection_cover___']) - 0 > 0 ? "YES" : "NO"));//NCB Protect
                        worksheet.cell(2, 118).string('NO');
                        worksheet.cell(2, 119).string('NO');
                        worksheet.cell(2, 120).string('NO');
                        worksheet.cell(2, 121).string('');
                        worksheet.cell(2, 122).string(dbUserData.Processed_Request.___own_damage_disc_rate___ ? ('-' + dbUserData.Processed_Request['___own_damage_disc_rate___'].toString()) : '');//Required_Discount
                        worksheet.cell(2, 123).string(dbUserData.Erp_Qt_Request_Core.___financial_agreement_type___ && dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___'] === "0" ? "" : (dbUserData.Erp_Qt_Request_Core.___financial_agreement_type___ ? (dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___']) : ''));//Finance_Type
                        worksheet.cell(2, 124).string(dbUserData.Erp_Qt_Request_Core.___financial_institute_city___ ? (dbUserData.Erp_Qt_Request_Core['___financial_institute_name___']) : '');//Financier_Name
                        worksheet.cell(2, 125).string(dbUserData.Erp_Qt_Request_Core.___financial_institute_city___ ? (dbUserData.Erp_Qt_Request_Core['___financial_institute_city___']) : '');//Branch_Name
                        worksheet.cell(2, 126).string(dbUserData.Erp_Qt_Request_Core.___premium_breakup_net_premium___ ? (dbUserData.Erp_Qt_Request_Core['___premium_breakup_net_premium___'].toString()) : '');//Net Premium
                        worksheet.cell(2, 127).string(dbUserData.Erp_Qt_Request_Core.___gst_no___ ? (dbUserData.Erp_Qt_Request_Core['___gst_no___']) : ''); //GST                        
                        worksheet.cell(2, 128).string(((dbUserData.Erp_Qt_Request_Core.___net_premium___ ? (dbUserData.Erp_Qt_Request_Core['___net_premium___'] - 0) : 0) + (dbUserData.Erp_Qt_Request_Core.___tax___ ? (dbUserData.Erp_Qt_Request_Core['___tax___'] - 0) : 0)).toString());//Total Premium Payable                         
                        worksheet.cell(2, 129).string(dbUserData.Erp_Qt_Request_Core.___vehicle_expected_idv___ ? (dbUserData.Erp_Qt_Request_Core['___vehicle_expected_idv___'].toString()) : '');//IDV_Value                        
                        worksheet.cell(2, 130).string('');//Comment_to_UW                        
                        worksheet.cell(2, 131).string(dbUserData.Erp_Qt_Request_Core.___is_pa_od___ && dbUserData.Erp_Qt_Request_Core['___is_pa_od___'].toString() === "yes" ? "Yes" : "No"); //Valid_Driving_License                       
                        worksheet.cell(2, 132).string(dbUserData.Erp_Qt_Request_Core.___is_pa_od___ && dbUserData.Erp_Qt_Request_Core['___is_pa_od___'].toString() === "yes" ? "No" : "Yes");//Already_Have_PA_Cover

                        worksheet.cell(2, 133).string('Yes');//Agree

                        worksheet.cell(2, 134).string(dbUserData.Erp_Qt_Request_Core.___salutation___ ? (dbUserData.Erp_Qt_Request_Core['___salutation___']) : '');//Ind_Salutation
                        worksheet.cell(2, 135).string(dbUserData.Erp_Qt_Request_Core.___first_name___ ? (dbUserData.Erp_Qt_Request_Core['___first_name___']) : '');//Ind_First_Name
                        worksheet.cell(2, 136).string(dbUserData.Erp_Qt_Request_Core.___middle_name___ ? (dbUserData.Erp_Qt_Request_Core['___middle_name___']) : '');//Ind_Middle_Name
                        worksheet.cell(2, 137).string(dbUserData.Erp_Qt_Request_Core.___last_name___ ? (dbUserData.Erp_Qt_Request_Core['___last_name___']) : '');//Ind_Last_Name
                        worksheet.cell(2, 138).string(dbUserData.Erp_Qt_Request_Core.___gender___ && dbUserData.Erp_Qt_Request_Core['___gender___'] === "M" ? "Male" : (dbUserData.Erp_Qt_Request_Core.___gender___ && dbUserData.Erp_Qt_Request_Core['___gender___'] === "F" ? "Female" : "Unknown"));//Ind_Gender
                        worksheet.cell(2, 139).string(dbUserData.Erp_Qt_Request_Core.___marital_text___ ? (dbUserData.Erp_Qt_Request_Core['___marital_text___']) : '');//Ind_Marital_Status
                        worksheet.cell(2, 140).string(cust_dob[2] + '-' + cust_dob[1] + '-' + cust_dob[0]);//Ind_Date_of_Birth
                        worksheet.cell(2, 141).string('Indian');
                        worksheet.cell(2, 142).string(dbUserData.Erp_Qt_Request_Core.___communication_address_1___ ? (dbUserData.Erp_Qt_Request_Core['___communication_address_1___']) : '');//Ind_Current_Address_Line_1
                        worksheet.cell(2, 143).string(dbUserData.Erp_Qt_Request_Core.___communication_address_2___ ? (dbUserData.Erp_Qt_Request_Core['___communication_address_2___']) : '');//Ind_Current_Address_Line_2
                        worksheet.cell(2, 144).string(dbUserData.Erp_Qt_Request_Core.___communication_address_3___ ? (dbUserData.Erp_Qt_Request_Core['___communication_address_3___']) : '');//Ind_Current_Address_Line_3
                        worksheet.cell(2, 145).string(dbUserData.Erp_Qt_Request_Core.___communication_pincode___ ? (dbUserData.Erp_Qt_Request_Core['___communication_pincode___']) : '');//Ind_Pincode
                        worksheet.cell(2, 146).string(dbUserData.Erp_Qt_Request_Core.___communication_city___ ? (dbUserData.Erp_Qt_Request_Core['___communication_city___']) : '');//Ind_Current_City
                        worksheet.cell(2, 147).string(dbUserData.Erp_Qt_Request_Core.___pan___ ? (dbUserData.Erp_Qt_Request_Core['___pan___']) : '');//Ind_PAN_Number
                        worksheet.cell(2, 148).string(dbUserData.Erp_Qt_Request_Core.___gst_no___ ? (dbUserData.Erp_Qt_Request_Core['___gst_no___']) : '');//Ind_GST_Number
                        worksheet.cell(2, 149).string(dbUserData.Erp_Qt_Request_Core.___aadhar___ ? (dbUserData.Erp_Qt_Request_Core['___aadhar___']) : '');//Ind_Aadhar_Number
                        worksheet.cell(2, 150).string(dbUserData.Erp_Qt_Request_Core.___mobile___ ? (dbUserData.Erp_Qt_Request_Core['___mobile___']) : '');//Ind_Mobile_Number
                        worksheet.cell(2, 151).string(dbUserData.Erp_Qt_Request_Core.___email___ ? (dbUserData.Erp_Qt_Request_Core['___email___']) : ''); //Ind_Email_ID
                        worksheet.cell(2, 152).string(dbUserData.Erp_Qt_Request_Core.___occupation___ ? (dbUserData.Erp_Qt_Request_Core['___occupation___']) : '');//Ind_Occupation
                        worksheet.cell(2, 153).string('');//Org_GST_Registered
                        worksheet.cell(2, 154).string('');//Org_GST_Number
                        worksheet.cell(2, 155).string('');//Org_Salutation
                        worksheet.cell(2, 156).string('');//Org_Company_Name
                        worksheet.cell(2, 157).string('');//Org_Current_Address_Line_1
                        worksheet.cell(2, 158).string('');//Org_Current_Address_Line_2
                        worksheet.cell(2, 159).string('');//Org_Current_Address_Line_3
                        worksheet.cell(2, 160).string('');//Org_Pincode
                        worksheet.cell(2, 161).string('');//Org_Current_City
                        worksheet.cell(2, 162).string('');//Org_PAN_Number
                        worksheet.cell(2, 163).string('');//Org_Mobile_Number
                        worksheet.cell(2, 164).string(''); // Org_Email_ID
                        worksheet.cell(2, 165).string(dbUserData.Erp_Qt_Request_Core.___nominee_name___ ? (dbUserData.Erp_Qt_Request_Core['___nominee_name___']) : '');
                        worksheet.cell(2, 166).string(dbUserData.Erp_Qt_Request_Core.___nominee_relation___ ? (dbUserData.Erp_Qt_Request_Core['___nominee_relation___']) : '');//Relationship_with_Applicant
                        worksheet.cell(2, 167).string(dbUserData.Erp_Qt_Request_Core.___nominee_relation___ && dbUserData.Erp_Qt_Request_Core['___nominee_relation___'] === "Others" ? (dbUserData.Erp_Qt_Request_Core.___nominee_other_relation___ ? dbUserData.Erp_Qt_Request_Core['___nominee_other_relation___'] : '') : "");//Others
                        worksheet.cell(2, 168).string(nominee_dob[2] + '-' + nominee_dob[1] + '-' + nominee_dob[0]);//Nominee_Date_of_Birth
                        worksheet.cell(2, 169).string('');//Guardian_Name
                        worksheet.cell(2, 170).string('');//Inspection_Number
                        worksheet.cell(2, 171).string('NEFT');
                        worksheet.cell(2, 172).string('');//Cheque_From_1
                        worksheet.cell(2, 173).string('');//Cheque_Bank_Name_1
                        worksheet.cell(2, 174).string('');//Cheque_Branch_1
                        worksheet.cell(2, 175).string('');
                        worksheet.cell(2, 176).string('');
                        worksheet.cell(2, 177).string('');
                        worksheet.cell(2, 178).string('');
                        worksheet.cell(2, 179).string('');
                        worksheet.cell(2, 180).string('');
                        worksheet.cell(2, 181).string('');
                        worksheet.cell(2, 182).string('');
                        worksheet.cell(2, 183).string('');
                        worksheet.cell(2, 184).string('');
                        worksheet.cell(2, 185).string('');
                        worksheet.cell(2, 186).string('');
                        worksheet.cell(2, 187).string('');
                        worksheet.cell(2, 188).string('');
                        worksheet.cell(2, 189).string('');
                        worksheet.cell(2, 190).string('');
                        worksheet.cell(2, 191).string('');
                        worksheet.cell(2, 192).string('');
                        worksheet.cell(2, 193).string('');
                        worksheet.cell(2, 194).string('');
                        worksheet.cell(2, 195).string('');
                        worksheet.cell(2, 196).string('');
                        worksheet.cell(2, 197).string('');
                        worksheet.cell(2, 198).string('');
                        worksheet.cell(2, 199).string('Customer');//NEFT_From_1
                        worksheet.cell(2, 200).string('RAZORPAY');//NEFT_Bank_Name_1
                        worksheet.cell(2, 201).string(objProduct.lm_request.transaction_id ? (objProduct.lm_request['transaction_id'].toString()) : '');//NEFT_Instrument_Number_1
                        worksheet.cell(2, 202).string('1234');//NEFT_Account_Number_1
                        worksheet.cell(2, 203).string(dbUserData.Erp_Qt_Request_Core.___first_name___ ? (dbUserData.Erp_Qt_Request_Core['___first_name___']) : '');//NEFT_Accountholder_1
                        worksheet.cell(2, 204).string(moment(objProduct.lm_request['pg_reference_number_1']).format('DD-MM-YYYY').toString());//NEFT_Instrument_Date_1
//                        worksheet.cell(2, 204).string(moment(new Date(objProduct.lm_request['pg_reference_number_1'])).format('DD-MM-YYYY').toString());//NEFT_Instrument_Date_1
                        worksheet.cell(2, 205).string(((dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___net_premium___') ? (dbUserData.Erp_Qt_Request_Core['___net_premium___'] - 0) : 0) + (dbUserData.Erp_Qt_Request_Core.hasOwnProperty('___tax___') ? (dbUserData.Erp_Qt_Request_Core['___tax___'] - 0) : 0)).toString());//NEFT_Amount_1
                        worksheet.cell(2, 206).string('');//NEFT_From_2
                        worksheet.cell(2, 207).string('');//NEFT_Bank_Name_2
                        worksheet.cell(2, 208).string('');//NEFT_Instrument_Number_2
                        worksheet.cell(2, 209).string('');//NEFT_Account_Number_2
                        worksheet.cell(2, 210).string('');//NEFT_Accountholder_2
                        worksheet.cell(2, 211).string('');//NEFT_Instrument_Date_2
                        worksheet.cell(2, 212).string('');//NEFT_Amount_2
                        worksheet.cell(2, 213).string('');//NEFT_From_3
                        worksheet.cell(2, 214).string('');//NEFT_Bank_Name_3
                        worksheet.cell(2, 215).string('');//NEFT_Instrument_Number_3
                        worksheet.cell(2, 216).string('');//NEFT_Account_Number_3
                        worksheet.cell(2, 217).string('');//NEFT_Accountholder_3
                        worksheet.cell(2, 218).string('');//NEFT_Instrument_Date_3
                        worksheet.cell(2, 219).string('');//NEFT_Amount_3
                        worksheet.cell(2, 220).string('');//Cash_From_1
                        worksheet.cell(2, 221).string('');//Cash_Name_1
                        worksheet.cell(2, 222).string('');//Cash_Amount_1
                        worksheet.cell(2, 223).string('');
                        worksheet.cell(2, 224).string('');//Sub Intermediary Category
                        worksheet.cell(2, 225).string('');//Sub Intermediary Code
                        worksheet.cell(2, 226).string('');//Sub Intermediary Name
                        worksheet.cell(2, 227).string('');//Sub Intermediary Phone Email
                        worksheet.cell(2, 228).string('');//POSP PAN Aadhar No
                        worksheet.cell(2, 229).string('');//POSP PAN Aadhar No
                        worksheet.cell(2, 230).string('');//Account No
                        worksheet.cell(2, 231).string('');

                        workbook.write(ff_loc_path_portal); //ff_loc_path_portal//ff_file_name

                        var Email = require('../../models/email');
                        var objModelEmail = new Email();
                        var sub = '[' + config.environment.name.toString().toUpperCase() + ']INFO-PolicyBoss.com-Policy Edelweiss Feed File:' + objProduct.lm_request['policy_number'];
                        email_body = '<html><body><p>Hi,</p><BR/><p>Please find the attachment of Feed File of Edelweiss Private CV Policy.</p>'
                                + '<BR><p>Policy Number : ' + objProduct.lm_request['policy_number'] + '</p><BR><p>Policy URL : ' + ff_web_path_portal + ' </p></body></html>';
                        if (config.environment.name === 'Production') {
                            //objModelEmail.send('notifications@policyboss.com', 'DeepakG.Pandey@edelweissfin.com', sub, email_body, 'Nilesh.Devlekar@edelweissfin.com', config.environment.notification_email, ''); //UAT
                        } else if (config.environment.name === 'QA') {
                            var arrTo = ['shubham.waghmare@qualitykiosk.com', 'akshay.kohade@edelweissfin.com'];
                            var arrCc = ['shivakumar.bale@qualitykiosk.com', 'utkarsh.chaudhari@edelweissfin.com', 'somanshu.singh@policyboss.com'];
                            objModelEmail.send('notifications@policyboss.com', arrTo.join(','), sub, email_body, arrCc.join(','), '', '');//Local
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
EdelweissCVMotor.prototype.get_vehicle_bodytype = function (vehicle_bodytype) {
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
EdelweissCVMotor.prototype.applicable_imt = function (objResponseJson) {
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
        if (objResponseJson.hasOwnProperty('___imt23___') && objResponseJson['___imt23___'] === "yes" && objResponseJson['___premium_breakup_tp_cover_imt23___'] > 0) {
            apllied_imt = apllied_imt + ', IMT - 23';
        }
        return apllied_imt;
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'applicable_imt', ex);
    }
};
EdelweissCVMotor.prototype.saod_tp_policy_tenure = function (tp_start_date, tp_end_date) {
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
EdelweissCVMotor.prototype.vehicle_age_year = function () {
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
EdelweissCVMotor.prototype.lv_quote_no = function () {
    try {
        return this.create_guid('', 'numeric', 7);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'lv_quote_no', ex);
        return 0;
    }
};
EdelweissCVMotor.prototype.top_city_rto = [
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
EdelweissCVMotor.prototype.addon_vehicle_age_year = function () {
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
EdelweissCVMotor.prototype.get_vehicle_fueltype = function (vehicle_fueltype) {
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
EdelweissCVMotor.prototype.get_vehicle_bodytype1 = function (bodyType) {
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
EdelweissCVMotor.prototype.get_voluntary_deductible = function (voluntary_deduct) {
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
EdelweissCVMotor.prototype.premium_breakup_schema = {

    "own_damage": {
        "od_basic": "", //when PropCoverDetails_CoverGroups = Own Damage
        "od_elect_access": "", //need to calculate
        "od_non_elect_access": "", //not given by insurer 
        "od_cng_lpg": "", //yet to check
        "od_disc_ncb": "",
        "od_disc_vol_deduct": "",
        "od_disc_anti_theft": "",
        "od_disc_aai": "",
        "od_loading": "",
        "od_disc": "",
        "od_disc_own_premises": "",
        "od_final_premium": ""//NetODPremium
    },
    "liability": {
        "tp_basic": "", ////when PropCoverDetails_CoverGroups = Basic TP  including TPPD premium
        "tp_cover_owner_driver_pa": "", //when PropCoverDetails_CoverGroups = Owner Driver
        "tp_cover_unnamed_passenger_pa": "",
        "tp_cover_named_passenger_pa": "",
        "tp_cover_paid_driver_pa": "", //NA
        "tp_cover_imt23": "",
        "tp_cover_paid_driver_ll": "", //this is included in tp_basic
        "tp_cng_lpg": "",
        "tp_final_premium": ""
    },
    "addon": {
        "addon_zero_dep_cover": "",
        "addon_road_assist_cover": "", ///when PropCoverDetails_CoverGroups = RoadSide Assist
        "addon_ncb_protection_cover": "",
        "addon_engine_protector_cover": "",
        "addon_invoice_price_cover": "",
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
module.exports = EdelweissCVMotor;

