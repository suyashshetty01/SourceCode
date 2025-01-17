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
function SBIGeneralMotor() {

}
util.inherits(SBIGeneralMotor, Motor);
SBIGeneralMotor.prototype.lm_request_single = {};
SBIGeneralMotor.prototype.insurer_integration = {};
SBIGeneralMotor.prototype.insurer_addon_list = [];
SBIGeneralMotor.prototype.insurer = {};
SBIGeneralMotor.prototype.pdf_attempt = 0;
SBIGeneralMotor.prototype.insurer_date_format = 'DD/MM/yyyy';
SBIGeneralMotor.prototype.insurer_product_api_pre = function () {
};
SBIGeneralMotor.prototype.insurer_product_field_process_pre = function () {
    try {
        if (this.lm_request['method_type'] === 'Status') {
            //this.prepared_request['order_id'] = this.prepared_request && this.prepared_request.hasOwnProperty('dbmaster_insurer_transaction_identifier') ? this.prepared_request.dbmaster_insurer_transaction_identifier : '';
            //this.processed_request['___order_id___'] = this.prepared_request['order_id'];
        } else {
        if (this.lm_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
            this.prepared_request['vehicle_expected_idv'] = 0;
            this.processed_request['___vehicle_expected_idv___'] = 0;
        }
        this.prepared_request['od_disc_perc'] = 0;
        this.processed_request['___od_disc_perc___'] = 0;
        if (this.lm_request.hasOwnProperty('od_disc_perc') && this.lm_request['od_disc_perc'] > 0) {
            this.prepared_request['od_disc_perc'] = this.lm_request['od_disc_perc'];
            this.processed_request['___od_disc_perc___'] = this.lm_request['od_disc_perc'];
            this.prepared_request['own_damage_disc_rate'] = this.lm_request['od_disc_perc'];
            this.processed_request['___own_damage_disc_rate___'] = this.lm_request['od_disc_perc'];
        }
        if (this.prepared_request.hasOwnProperty('own_damage_disc_rate') && this.prepared_request['own_damage_disc_rate'] > 0) {
            this.prepared_request['od_disc_perc'] = this.prepared_request['own_damage_disc_rate'];
            this.processed_request['___od_disc_perc___'] = this.processed_request['___own_damage_disc_rate___'];
        }
        if (this.lm_request['method_type'] === 'Premium') {
            var cubic_capacity = parseInt(this.processed_request['___dbmaster_pb_cubic_capacity___']);
            var vehicle_age = this.vehicle_age_year();
            var rto_zone = this.processed_request['___dbmaster_pb_vehicletariff_zone___'];
            var vehicle_cc_slab_1 = 0;
            var vehicle_age1 = 0;
            var arr_cc_1 = [150, 350, 4000];
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
                {'zone': 'A', 'vehicle_age': 5, 'cubic_capacity': 150, 'premium_rate': 1.708},
                {'zone': 'A', 'vehicle_age': 10, 'cubic_capacity': 150, 'premium_rate': 1.793},
                {'zone': 'A', 'vehicle_age': 20, 'cubic_capacity': 150, 'premium_rate': 1.836},
                {'zone': 'A', 'vehicle_age': 5, 'cubic_capacity': 350, 'premium_rate': 1.793},
                {'zone': 'A', 'vehicle_age': 10, 'cubic_capacity': 350, 'premium_rate': 1.883},
                {'zone': 'A', 'vehicle_age': 20, 'cubic_capacity': 350, 'premium_rate': 1.928},
                {'zone': 'A', 'vehicle_age': 5, 'cubic_capacity': 4000, 'premium_rate': 1.879},
                {'zone': 'A', 'vehicle_age': 10, 'cubic_capacity': 4000, 'premium_rate': 1.973},
                {'zone': 'A', 'vehicle_age': 20, 'cubic_capacity': 4000, 'premium_rate': 2.020},
                {'zone': 'B', 'vehicle_age': 5, 'cubic_capacity': 150, 'premium_rate': 1.676},
                {'zone': 'B', 'vehicle_age': 10, 'cubic_capacity': 150, 'premium_rate': 1.760},
                {'zone': 'B', 'vehicle_age': 20, 'cubic_capacity': 150, 'premium_rate': 1.802},
                {'zone': 'B', 'vehicle_age': 5, 'cubic_capacity': 350, 'premium_rate': 1.760},
                {'zone': 'B', 'vehicle_age': 10, 'cubic_capacity': 350, 'premium_rate': 1.848},
                {'zone': 'B', 'vehicle_age': 20, 'cubic_capacity': 350, 'premium_rate': 1.892},
                {'zone': 'B', 'vehicle_age': 5, 'cubic_capacity': 4000, 'premium_rate': 1.844},
                {'zone': 'B', 'vehicle_age': 10, 'cubic_capacity': 4000, 'premium_rate': 1.936},
                {'zone': 'B', 'vehicle_age': 20, 'cubic_capacity': 4000, 'premium_rate': 1.982}
            ];
            var index = obj_basicod.findIndex(x => x.zone === rto_zone && x.cubic_capacity === vehicle_cc_slab_1 && x.vehicle_age === vehicle_age1);
            this.prepared_request['od_tarrif_rate'] = obj_basicod[index]['premium_rate'];
            this.processed_request['___od_tarrif_rate___'] = this.prepared_request['od_tarrif_rate'];
            if (this.lm_request['vehicle_insurance_subtype'] === '5CH_0TP') {

                var Insurer_Id = this['insurer_id'];
                var Insurer_Vehicle_ExShowRoom = this.prepared_request['dbmaster_pb_exshoroomprice'];
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
                if (Insurer_Vehicle_ExShowRoom != '') {
                    var Vehicle_Age_Year = this.vehicle_age_year();
                    if (Vehicle_Age_Year < 1) {
                        Vehicle_Age_Year = 1;
                    } else if (Vehicle_Age_Year > 11) {
                        Vehicle_Age_Year = 10;
                    }

                    var Applied_Year = Vehicle_Age_Year - 1;
                    var Idv_2 = Insurer_Vehicle_ExShowRoom - Math.round(Insurer_Vehicle_ExShowRoom * parseInt(Vehicle_Depreciation_Range['Age_' + (parseInt(Applied_Year) + 1)]) / 100);
                    var Idv_3 = Insurer_Vehicle_ExShowRoom - Math.round(Insurer_Vehicle_ExShowRoom * parseInt(Vehicle_Depreciation_Range['Age_' + (parseInt(Applied_Year) + 2)]) / 100);
                    var Idv_4 = Insurer_Vehicle_ExShowRoom - Math.round(Insurer_Vehicle_ExShowRoom * parseInt(Vehicle_Depreciation_Range['Age_' + (parseInt(Applied_Year) + 3)]) / 100);
                    var Idv_5 = Insurer_Vehicle_ExShowRoom - Math.round(Insurer_Vehicle_ExShowRoom * parseInt(Vehicle_Depreciation_Range['Age_' + (parseInt(Applied_Year) + 4)]) / 100);
                }

                this.prepared_request['vehicle_normal_idv_2'] = Idv_2;
                this.processed_request['___vehicle_normal_idv_2___'] = Idv_2;
                this.prepared_request['vehicle_normal_idv_3'] = Idv_3;
                this.processed_request['___vehicle_normal_idv_3___'] = Idv_3;
                this.prepared_request['vehicle_normal_idv_4'] = Idv_4;
                this.processed_request['___vehicle_normal_idv_4___'] = Idv_4;
                this.prepared_request['vehicle_normal_idv_5'] = Idv_5;
                this.processed_request['___vehicle_normal_idv_5___'] = Idv_5;
            }

        }

        if (this.lm_request['method_type'] === 'Verification' || this.lm_request['method_type'] === 'Proposal') {
            this.prepared_request['vehicle_normal_idv_2'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['vehicle_normal_idv_2'];
            this.processed_request['___vehicle_normal_idv_2___'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['vehicle_normal_idv_2'];
            this.prepared_request['vehicle_normal_idv_3'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['vehicle_normal_idv_3'];
            this.processed_request['___vehicle_normal_idv_3___'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['vehicle_normal_idv_3'];
            this.prepared_request['vehicle_normal_idv_4'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['vehicle_normal_idv_4'];
            this.processed_request['___vehicle_normal_idv_4___'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['vehicle_normal_idv_4'];
            this.prepared_request['vehicle_normal_idv_5'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['vehicle_normal_idv_5'];
            this.processed_request['___vehicle_normal_idv_5___'] = this.insurer_master['service_logs']['pb_db_master']['LM_Custom_Request']['vehicle_normal_idv_5'];
			
            if (this.lm_request['method_type'] === 'Proposal' && this.lm_request.hasOwnProperty('pay_from')) {
                this.prepared_request['pay_from'] = "wallet";
                this.processed_request['___pay_from___'] = this.prepared_request['pay_from'];
            }
        }

        if (this.lm_request['method_type'] === 'Verification') {
            if (this.processed_request['___pg_reference_number_1___'] !== null) {
                var res_year = (this.processed_request['___pg_reference_number_1___']).split("-");
                var res_date = res_year[2].split(" ");
                var date = res_date[0] + "/" + res_year[1] + "/" + res_year[0];
                this.prepared_request['pg_reference_number_1'] = date;
                this.processed_request['___pg_reference_number_1___'] = date;
            }
        }
        if (this.lm_request['method_type'] === 'Pdf') {
            this.lm_request['transaction_id'] = isNaN(this.lm_request['transaction_id']) ? (this.lm_request['transaction_pg'] ? this.lm_request['transaction_pg'] : this.lm_request['transaction_id']) : this.lm_request['transaction_id']; 
        }

        if (this.lm_request['is_breakin'] === 'yes') {
            var someStartDate = new Date(this.prepared_request['policy_start_date']);
            someStartDate.setDate(someStartDate.getDate() + 1);
            var startDateFormated = (someStartDate.toISOString().substr(0, 10)).split('-');
            var start_date = startDateFormated[0] + '-' + startDateFormated[1] + '-' + startDateFormated[2];
            this.prepared_request['policy_start_date'] = start_date;
            this.processed_request['___policy_start_date___'] = this.prepared_request['policy_start_date'];

            var someEndDate = new Date(this.prepared_request['policy_end_date']);
            someEndDate.setDate(someEndDate.getDate() + 1);
            var endDateFormated = (someEndDate.toISOString().substr(0, 10)).split('-');
            var end_date = endDateFormated[0] + '-' + endDateFormated[1] + '-' + endDateFormated[2];
            this.prepared_request['policy_end_date'] = end_date;
            this.processed_request['___policy_end_date___'] = this.prepared_request['policy_end_date'];

            if (this.lm_request['is_policy_exist'] === "no") {
                this.prepared_request['policy_expiry_date'] = '';
                this.processed_request['___policy_expiry_date___'] = this.prepared_request['policy_expiry_date'];
            }
            if (this.lm_request['is_claim_exists'] === "no") {
                var age_in_days = moment(this.processed_request['___policy_start_date___']).diff((moment(this.processed_request['___policy_expiry_date___']).format("DD-MM-YYYY")), 'days');
                if (age_in_days > 88) {
                    this.lm_request['vehicle_ncb_current'] = "0";
                    this.prepared_request['vehicle_ncb_current'] = "0";
                    this.processed_request['___vehicle_ncb_current___'] = this.prepared_request['vehicle_ncb_current'];
                    this.prepared_request['vehicle_ncb_next'] = "0";
                    this.processed_request['___vehicle_ncb_next___'] = this.prepared_request['vehicle_ncb_next'];
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
        }
	}
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'insurer_product_field_process_pre', ex);
    }
};
SBIGeneralMotor.prototype.insurer_product_response_handler = function (objResponseJson, objProduct, Insurer_Object, specific_insurer_object) {

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
SBIGeneralMotor.prototype.insurer_product_field_process_post = function () {

    console.log("insurer_product_api_post");
};
SBIGeneralMotor.prototype.insurer_product_api_post = function () {

    console.log("insurer_product_api_post");
};

SBIGeneralMotor.prototype.service_call = function (docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item) {
    try {

        var objInsurerProduct = this;
        var product_id = objProduct.db_specific_product.Product_Id; //
        var insurer_id = Insurer_Object.Insurer_ID;
        var soap = require('soap');
        var xml2js = require('xml2js');
        var Client = require('node-rest-client').Client;
        var client = new Client();
        console.log("SBIGeneralMotor service_call : ", specific_insurer_object.method.Method_Type, " :: ", docLog.Insurer_Request);
        var args = null;
        var service_method_url = '';
        if (specific_insurer_object.method.Method_Type === "Status") {
            let order_id = specific_insurer_object.master_db_list.service_logs.pb_db_master.Payment.pg_data.hasOwnProperty('orderId') ? specific_insurer_object.master_db_list.service_logs.pb_db_master.Payment.pg_data.orderId : '';
            var username = config.razor_pay.rzp_sbi.username;
            var password = config.razor_pay.rzp_sbi.password;
            var args1 = {
                headers: {"Content-Type": "application/json",
                    "Accept": "application/json",
                    'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
                }
            };
            let service_url = specific_insurer_object.method.Service_URL + order_id + specific_insurer_object.method.Method_Action;
            client.get(service_url, args1, function (data, response) {
                // parsed response body as js object 
                console.log('Order Data', data);
                var objResponseFull = {
                    'err': null,
                    'result': null,
                    'raw': JSON.stringify(data),
                    'soapHeader': null,
                    'objResponseJson': data
                };
                objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
            });
        } else {
        if (config.environment.hasOwnProperty('sbi_pg_type') && config.environment.sbi_pg_type === "rzrpay" && objInsurerProduct.lm_request['product_id'] === 10 && specific_insurer_object.method.Method_Type === 'Customer') {
            var full_name = objInsurerProduct.lm_request['middle_name'] === "" ? (objInsurerProduct.lm_request['first_name'] + " " + objInsurerProduct.lm_request['last_name']) : (objInsurerProduct.lm_request['first_name'] + " " + objInsurerProduct.lm_request['middle_name'] + " " + objInsurerProduct.lm_request['last_name']);
            let body = {
                "amount": objInsurerProduct['lm_request']['final_premium'] * 100,
                "payment_capture": 1,
                "currency": "INR",
                "notes": {
                    "customer_name": full_name,
					"payment_mode" : "individual"
                },
                "transfers": [
                    {
                        "account": config.razor_pay.rzp_sbi.account_id,
                        "amount": objInsurerProduct['lm_request']['final_premium'] * 100,
                        "currency": "INR"
                    }
                ]
            };
            var username = config.razor_pay.rzp_sbi.username;
            var password = config.razor_pay.rzp_sbi.password;
            var args1 = {
                data: body,
                headers: {"Content-Type": "application/json",
                    "Accept": "application/json",
                    'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
                }
            };
            console.log(JSON.stringify(args1));
            client.post(specific_insurer_object.method_file_url, args1, function (data, response) {
                // parsed response body as js object 
                console.log('Order Data', data);
                var objResponseFull = {
                    'err': null,
                    'result': null,
                    'raw': JSON.stringify(data),
                    'soapHeader': null,
                    'objResponseJson': data
                };
                objInsurerProduct.base_response_handler(objResponseFull, docLog, objProduct, Insurer_Object, specific_insurer_object, Db_Idv_Item);
            });
        } else {
            var args = {};
            if (specific_insurer_object.method.Method_Type === 'Proposal') {
                service_method_url = config.environment.weburl + '/quote/sbigeneral/proposal?Product_Id=' + product_id + '&CRN=' + objInsurerProduct.lm_request['crn'];
                console.error('DBG', 'SBI', 'service_method_url', service_method_url);
            } else if (this.const_payment_response.hasOwnProperty('pg_data') && this.const_payment_response['pg_data'].hasOwnProperty('pg_type') && this.const_payment_response['pg_data']['pg_type'] === "rzrpay" && objInsurerProduct.lm_request['product_id'] === 10 && specific_insurer_object.method.Method_Type === 'Verification') {
                service_method_url = specific_insurer_object.method_file_url + objInsurerProduct.const_payment_response.pg_get.PayId;
                var username = config.razor_pay.rzp_sbi.username;
                var secret_key = config.razor_pay.rzp_sbi.password;
                args = {
                    headers: {
                        "Accept": "application/json",
                        'Authorization': 'Basic ' + new Buffer(username + ':' + secret_key).toString('base64')
                    }
                };
            } else {
                service_method_url = config.environment.weburl;
            }
            //service_method_url = specific_insurer_object.method_file_url + specific_insurer_object.method.Method_Action;
            client.get(service_method_url, args, function (data, response) {
                // parsed response body as js object 
                console.log(data);
                // raw response 
                console.log(response);
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
        }
        }
    } catch (e) {
        console.error('Exception', this.constructor.name, 'service_call', e);
    }
};
SBIGeneralMotor.prototype.idv_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'idv_response_handler', objResponseJson);
};
SBIGeneralMotor.prototype.premium_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'premium_response_handler', objResponseJson);
    //var objPremiumService = objResponseJson;
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null
    };
    var Error_Msg = 'NO_ERR';
    try {
        if (parseInt(this.lm_request['product_id']) === 10) {
            let rto_flag = this.new_package_rto_list();
            if (rto_flag) {
                if (this.lm_request['vehicle_insurance_subtype'] === "1CH_4TP") {
                } else {
                    Error_Msg = "1CH_4TP plans are only allowed under restricted state list.";
                }
            }
        }
		if (this.prepared_request['dbmaster_pb_fuel_name'] === "ELECTRIC" || this.prepared_request['dbmaster_pb_fuel_name'] === "Electric"){
            Error_Msg = 'UW Guidelines : Electric Vehicle Restricted';
        }
        if (this.vehicle_age_year() >= 15) {
            Error_Msg = 'Vehicle age is allowed only upto 14.99 Years for Two Wheeler.';
        }
        if (Error_Msg === 'NO_ERR') {
            var premium_breakup = this.get_const_premium_breakup();
            var cubic_capacity = parseInt(this.processed_request['___dbmaster_pb_cubic_capacity___']);
            var idv = parseInt(this.processed_request['___vehicle_expected_idv___']);
            var tp_basic = 0;
            var vehicle_cc_slab = 0;
            var arr_cc = [76, 151, 351, 4000];
            for (var k in arr_cc) {
                if (cubic_capacity < arr_cc[k]) {
                    vehicle_cc_slab = arr_cc[k];
                    break;
                }
            }
            if (this.lm_request['vehicle_insurance_type'] === 'new') {
                var obj_cubic_capacity = {
                    'Cc_76': 1045,
                    'Cc_151': 3285,
                    'Cc_351': 5453,
                    'Cc_4000': 13034
                };
            } else {
                var obj_cubic_capacity = {
                    'Cc_76': 482,
                    'Cc_151': 752,
                    'Cc_351': 1193,
                    'Cc_4000': 2323
                };
            }
            var addon_zd_rate = [0.30, 0.35, 0.40, 0.45, 0.50];
            var addon_rti_rate = [0.15, 0.20, 0.25, 0.30, 0.35];
            var addon_ep_rate = [0.25, 0.30, 0.35, 0.40, 0.45];
            var od_tariff_rate = this.processed_request['___od_tarrif_rate___']; //obj_basicod[index]['premium_rate'];
            var tp_basic = obj_cubic_capacity['Cc_' + vehicle_cc_slab];
            var od_basic_rate = 0;
            var od_disc_rate = 0;
            var od_basic_final = 0;
            var vehicle_age = this.vehicle_age_year();
            var od_tenure = parseInt(this.lm_request['policy_od_tenure']);
            var tp_tenure = parseInt(this.lm_request['policy_tp_tenure']);
            var od_disc_slab = parseInt(this.prepared_request['own_damage_disc_rate'] === undefined ? 0 : this.prepared_request['own_damage_disc_rate']);//parseInt(this.prepared_request['od_disc_perc']);
            od_basic_rate = parseInt((od_tariff_rate * idv) / 100);
            od_disc_rate = parseInt((od_basic_rate * od_disc_slab) / 100);
            if (this.lm_request['vehicle_insurance_subtype'].indexOf('0CH') > -1) {
                od_basic_final = 0;
            } else {
                od_basic_final = parseInt(od_basic_rate - od_disc_rate);
            }

            if (this.lm_request['vehicle_insurance_subtype'] === '2CH_0TP') {
                premium_breakup['own_damage']['od_basic'] = 1.8 * od_basic_rate;
                premium_breakup['own_damage']['od_disc'] = 1.8 * od_disc_rate;
            } else if (this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP') {
                premium_breakup['own_damage']['od_basic'] = 2.5 * od_basic_rate;
                premium_breakup['own_damage']['od_disc'] = 2.5 * od_disc_rate;
            } else {
                premium_breakup['own_damage']['od_basic'] = od_tenure * od_basic_rate;
                premium_breakup['own_damage']['od_disc'] = od_tenure * od_disc_rate;
            }
            premium_breakup['own_damage']['od_disc_ncb'] = parseInt((parseInt(this.prepared_request['vehicle_ncb_next']) * ((premium_breakup['own_damage']['od_basic'] - 0) - (premium_breakup['own_damage']['od_disc'] - 0))) / 100);
            premium_breakup['own_damage']['od_elect_access'] = od_tenure * parseInt((this.lm_request['electrical_accessory'] * 4) / 100);
            premium_breakup['own_damage']['od_non_elect_access'] = od_tenure * parseInt((this.lm_request['non_electrical_accessory'] * od_tariff_rate) / 100);
            premium_breakup['own_damage']['od_final_premium'] = parseInt(premium_breakup['own_damage']['od_basic'] + premium_breakup['own_damage']['od_elect_access'] + premium_breakup['own_damage']['od_non_elect_access']
                    - premium_breakup['own_damage']['od_disc'] - premium_breakup['own_damage']['od_disc_ncb']);

            //Third Party
            if (this.lm_request['vehicle_insurance_subtype'] !== '1OD_0TP') {
                var pa_unnamed_psngr = parseFloat((parseInt(this.lm_request['pa_unnamed_passenger_si']) * 0.07) / 100);
                if (this.lm_request['vehicle_insurance_type'] === 'new') {
                    premium_breakup['liability']['tp_basic'] = (tp_basic - 0);
                } else {
                    premium_breakup['liability']['tp_basic'] = (tp_tenure - 0) * (tp_basic - 0);
                }
                if (this.lm_request['is_pa_od'] === 'yes') {
                    //if (this.lm_request['vehicle_insurance_type'] === 'new') {
                    //    premium_breakup['liability']['tp_cover_owner_driver_pa'] = 1661;
                    //} else {
                    premium_breakup['liability']['tp_cover_owner_driver_pa'] = 375;
                    //}
                } else {
                    premium_breakup['liability']['tp_cover_owner_driver_pa'] = 0;
                }
                if (this.lm_request['pa_unnamed_passenger_si'] === "0" || this.lm_request['pa_unnamed_passenger_si'] === undefined) {
                    premium_breakup['liability']['tp_cover_unnamed_passenger_pa'] = 0;
                } else {
                    premium_breakup['liability']['tp_cover_unnamed_passenger_pa'] = tp_tenure * parseFloat(pa_unnamed_psngr * parseFloat(this.prepared_request['dbmaster_insurer_vehicle_seatingcapacity']));
                }
                //premium_breakup['liability']['tp_cover_outstanding_loan'] = 0;
                premium_breakup['liability']['tp_final_premium'] = parseInt(premium_breakup['liability']['tp_basic'] + premium_breakup['liability']['tp_cover_owner_driver_pa'] + premium_breakup['liability']['tp_cover_unnamed_passenger_pa']);
            }

            //Addon
            if (this.vehicle_age_year() <= 4) {
                if (this.lm_request['vehicle_insurance_subtype'] === '2CH_0TP' && addon_ep_rate[vehicle_age] !== undefined && addon_ep_rate[vehicle_age + 1] !== undefined) {
                    premium_breakup['addon']['addon_zero_dep_cover'] = parseInt((addon_zd_rate[vehicle_age] === undefined ? 0 : addon_zd_rate[vehicle_age] * idv) / 100) + parseInt((addon_zd_rate[vehicle_age + 1] === undefined ? 0 : addon_zd_rate[vehicle_age + 1] * idv) / 100);
                    premium_breakup['addon']['addon_invoice_price_cover'] = parseInt((addon_rti_rate[vehicle_age] === undefined ? 0 : addon_rti_rate[vehicle_age] * idv) / 100) + parseInt((addon_rti_rate[vehicle_age + 1] === undefined ? 0 : addon_rti_rate[vehicle_age + 1] * idv) / 100);
                    premium_breakup['addon']['addon_engine_protector_cover'] = parseInt((addon_ep_rate[vehicle_age] === undefined ? 0 : addon_ep_rate[vehicle_age] * idv) / 100) + parseInt((addon_ep_rate[vehicle_age + 1] === undefined ? 0 : addon_ep_rate[vehicle_age + 1] * idv) / 100);
                } else if (this.lm_request['vehicle_insurance_subtype'] === '3CH_0TP' && addon_ep_rate[vehicle_age] !== undefined && addon_ep_rate[vehicle_age + 1] !== undefined && addon_ep_rate[vehicle_age + 2] !== undefined) {
                    premium_breakup['addon']['addon_zero_dep_cover'] = parseInt((addon_zd_rate[vehicle_age] === undefined ? 0 : addon_zd_rate[vehicle_age] * idv) / 100) + parseInt((addon_zd_rate[vehicle_age + 1] === undefined ? 0 : addon_zd_rate[vehicle_age + 1] * idv) / 100) + parseInt((addon_zd_rate[vehicle_age + 2] === undefined ? 0 : addon_zd_rate[vehicle_age + 2] * idv) / 100);
                    premium_breakup['addon']['addon_invoice_price_cover'] = parseInt((addon_rti_rate[vehicle_age] === undefined ? 0 : addon_rti_rate[vehicle_age] * idv) / 100) + parseInt((addon_rti_rate[vehicle_age + 1] === undefined ? 0 : addon_rti_rate[vehicle_age + 1] * idv) / 100) + parseInt((addon_rti_rate[vehicle_age + 2] === undefined ? 0 : addon_rti_rate[vehicle_age + 2] * idv) / 100);
                    premium_breakup['addon']['addon_engine_protector_cover'] = parseInt((addon_ep_rate[vehicle_age] === undefined ? 0 : addon_ep_rate[vehicle_age] * idv) / 100) + parseInt((addon_ep_rate[vehicle_age + 1] === undefined ? 0 : addon_ep_rate[vehicle_age + 1] * idv) / 100) + parseInt((addon_ep_rate[vehicle_age + 2] === undefined ? 0 : addon_zd_rate[vehicle_age + 2] * idv) / 100);
                } else if ((this.lm_request['vehicle_insurance_subtype'] === '1CH_0TP' || this.lm_request['vehicle_insurance_subtype'] === '1OD_0TP' || this.lm_request['vehicle_insurance_subtype'] === '1CH_4TP') && addon_ep_rate[vehicle_age] !== undefined) {
                    premium_breakup['addon']['addon_zero_dep_cover'] = parseInt((addon_zd_rate[vehicle_age] === undefined ? 0 : addon_zd_rate[vehicle_age] * idv) / 100);
                    premium_breakup['addon']['addon_invoice_price_cover'] = parseInt((addon_rti_rate[vehicle_age] === undefined ? 0 : addon_rti_rate[vehicle_age] * idv) / 100);
                    premium_breakup['addon']['addon_engine_protector_cover'] = parseInt((addon_ep_rate[vehicle_age] === undefined ? 0 : addon_ep_rate[vehicle_age] * idv) / 100);
                } else {
                    premium_breakup['addon']['addon_zero_dep_cover'] = 0;
                    premium_breakup['addon']['addon_invoice_price_cover'] = 0;
                    premium_breakup['addon']['addon_engine_protector_cover'] = 0;
                }
                premium_breakup['addon']['addon_final_premium'] = premium_breakup['addon']['addon_zero_dep_cover'] + premium_breakup['addon']['addon_invoice_price_cover'] + premium_breakup['addon']['addon_engine_protector_cover'];
            } else {
                premium_breakup['addon']['addon_final_premium'] = 0;
            }
            //Final
            premium_breakup['net_premium'] = premium_breakup['own_damage']['od_final_premium'] + premium_breakup['liability']['tp_final_premium'] + premium_breakup['addon']['addon_final_premium'];
            if (this.processed_request['___registration_no_1___'] === "KL") {
                var State_Cess_Amount = ((1 / 100) * premium_breakup['net_premium']).toFixed(2);
            } else {
                var State_Cess_Amount = 0;
            }
            premium_breakup['service_tax'] = Math.round((premium_breakup['net_premium'] * 0.18) + (State_Cess_Amount - 0));
            premium_breakup['final_premium'] = premium_breakup['net_premium'] + premium_breakup['service_tax'];
            objServiceHandler.Premium_Breakup = premium_breakup;
            objServiceHandler.Insurer_Transaction_Identifier = 'Complete';
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
SBIGeneralMotor.prototype.insurer_vehicle_idv = function (objProduct, Insurer_Object, specific_insurer_object, motor_idv_callback) {
    console.log('Start', this.constructor.name, 'insurer_vehicle_idv');
    try {
        var Insurer_Id = specific_insurer_object['insurer_id'];
        var Master_Db_List = objProduct.insurer_master_object['insurer_id_' + Insurer_Id]['master_db_list'];
        var Insurer_Vehicle_ExShowRoom = Master_Db_List['vehicles']['pb_db_master']['ExShoroomPrice'];
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
        if (Insurer_Vehicle_ExShowRoom != '') {
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
        console.error('Exception', this.constructor.name, 'insurer_vehicle_idv', ex);
    }
};
SBIGeneralMotor.prototype.customer_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'customer_response_handler', objResponseJson);
    var Error_Msg = 'NO_ERR';
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Customer': null
    };
    try {
        if (this.lm_request['product_id'] === 10) {
            var razorpay_response = objResponseJson;
//            if (razorpay_response.hasOwnProperty('status') && razorpay_response['status'] === 'created') {
//            } else {
//                Error_Msg = JSON.stringify(razorpay_response["error"]);
//            }

            if ((razorpay_response.hasOwnProperty('status') && razorpay_response.hasOwnProperty('id') && razorpay_response['id'].includes('order_'))) {
            } else if (razorpay_response.hasOwnProperty('status') && razorpay_response['status'] !== 'created') {
                Error_Msg = 'Razorpay Order Not Created';
            } else {
                Error_Msg = 'Razorpay Order Not Created';
            }

            if (Error_Msg === 'NO_ERR') {
                var Customer = {
                    'insurer_customer_identifier': JSON.stringify(razorpay_response)
                };
                objServiceHandler.Customer = Customer;
                objServiceHandler.Insurer_Transaction_Identifier = razorpay_response['id'];
            }
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
SBIGeneralMotor.prototype.proposal_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'proposal_response_handler', objResponseJson);
    var objPremiumService = objResponseJson;
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Payment': this.const_payment
    };
    var Error_Msg = 'NO_ERR';
    try {
        /*
         var merchant_key = 'BC50nb';
         var salt = 'Bwxo1cPe';
         var merchant_id = '4825050';
         var amount = this.lm_request['final_premium'];
         */
        if (objResponseJson.status === 'ERR') {
            Error_Msg = objResponseJson.msg;
        }
        if (this.lm_request['vehicle_insurance_type'] === 'renew') {
            if ((this.processed_request['___engine_number___']).length < 5 || (this.processed_request['___engine_number___']).length > 20) {
                Error_Msg = 'Engine Number : min 5 character and max 20 characters';
            }
            if ((this.processed_request['___chassis_number___']).length < 5 || (this.processed_request['___chassis_number___']).length > 20) {
                Error_Msg = 'Chassis Number : min 5 character and max 20 characters';
            }
            if ((this.processed_request['___engine_number___']).toLowerCase() == (this.processed_request['___chassis_number___']).toLowerCase()) {
                Error_Msg = 'Chassis Number & Engine Number Same';
            }
            if (this.lm_request['is_policy_exist'] === "yes") {
                if ((this.processed_request['___previous_policy_number___']).length < 5 || (this.processed_request['___previous_policy_number___']).length > 35) {
                    Error_Msg = 'Previous Year Policy Number : min 5 character and max 35 characters';
                }
            }
        }
        if (Error_Msg === 'NO_ERR') {
            let policy_number = objResponseJson.policy_number.toString();
            this.processed_request['___policy_number_generate___'] = policy_number;
            if (this.lm_request.hasOwnProperty('pay_from') && this.lm_request['pay_from'] === 'wallet') {
                let policy_number = objResponseJson.policy_number.toString();
                this.processed_request['___policy_number_generate___'] = policy_number;
                var pg_data = {
                    'ss_id': this.lm_request['ss_id'],
                    'crn': this.lm_request['crn'],
                    'User_Data_Id': this.lm_request['udid'],
                    'product_id': this.lm_request['product_id'],
                    'premium_amount': ([7582].indexOf(parseInt(this.lm_request['ss_id'])) > -1) ? 1 : this.lm_request['final_premium'],
                    'customer_name': this.lm_request['first_name'] + " " + this.lm_request['last_name'],
                    'txnid': policy_number
                };
                objServiceHandler.Payment.pg_data = pg_data;
                objServiceHandler.Payment.pg_redirect_mode = 'POST';
                objServiceHandler.Payment.pg_url = ((config.environment.name === 'Production') ? "https://www.policyboss.com/wallet-confirm" : "http://qa.policyboss.com/TransactionDetail_Form/index.html") + "?udid=" + this.lm_request['udid']; 
            } else if (config.environment.hasOwnProperty('sbi_pg_type') && config.environment.sbi_pg_type === "rzrpay" && this.lm_request['product_id'] === 10) {
                var merchant_key = config.razor_pay.rzp_sbi.username;
                var razorpay_response = JSON.parse(this.prepared_request['insurer_customer_identifier']);
                var pg_data = {
                    'key': merchant_key,
                    'full_name': this.lm_request['first_name'] + ' ' + this.lm_request['last_name'],
                    'return_url': this.const_payment.pg_ack_url,
                    'phone': this.lm_request['mobile'],
                    'orderId': razorpay_response["id"],
                    'txnId': this.lm_request['udid'] + ',' + this.lm_request['crn'] + ',' + this.lm_request['proposal_id'] + ',' + this.lm_request['insurer_id'],
                    'quoteId': policy_number,
                    'amount': this.lm_request['final_premium'],
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
                var merchant_key = ((config.environment.name === 'Production') ? 'o7LxX9fJ' : 'BC50nb');
                var salt = ((config.environment.name === 'Production') ? 'c6ob2Q7Wb4' : 'Bwxo1cPe');
                var merchant_id = ((config.environment.name === 'Production') ? '6867635' : '4825050'); //following MID -  ?MID- 6867635? of (SBI General Insurance Company Limited)
                var amount = (((config.environment.testing_ssid).indexOf(this.lm_request['ss_id']) > -1) ? '2' : this.lm_request['final_premium']);
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
SBIGeneralMotor.prototype.status_response_handler = function (objResponseJson) {
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
            Error_Msg = JSON.stringify(objResponseJson);
        } else if (objResponseJson.hasOwnProperty('count') && objResponseJson.count < 1 || objResponseJson.items.length < 1) {
            Error_Msg = JSON.stringify(objResponseJson);
        } else {
            var objserviceResponse = objResponseJson.items;
        }
        let pg_get = {
            "Status": "Fail"
        };
        if (Error_Msg === 'NO_ERR') {
            for (var l in objserviceResponse) {
                if (objserviceResponse[l].hasOwnProperty('status') && objserviceResponse[l]['status'] === "captured") {
                    console.log(objserviceResponse[l]['status']);
                    objServiceHandler['Pg_Status'] = "SUCCESS";
                    objServiceHandler['Recon_Reference_Number'] = objserviceResponse[l]['created_at'];
                    pg_get['Status'] = 'Success';
                    pg_get['PayId'] = objserviceResponse[l]['id'];
                    pg_get['OrderId'] = objserviceResponse[l]['order_id'];
                    objServiceHandler['pg_get'] = pg_get;
                    objServiceHandler['Data'] = objResponseJson;
                    break;
                } else {
                    objServiceHandler['Recon_Reference_Number'] = '';
                    objServiceHandler['Pg_Status'] = "FAIL";
                    objServiceHandler['pg_get'] = pg_get;
                    objServiceHandler['Data'] = objResponseJson;
                }
            }
        } else {
            objServiceHandler['Error_Msg'] = Error_Msg;
            objServiceHandler['Recon_Reference_Number'] = '';
            objServiceHandler['Pg_Status'] = "FAIL";
            objServiceHandler['pg_get'] = pg_get;
            objServiceHandler['Data'] = objResponseJson;
        }
    } catch (ex) {
        var Err = {
            'Type': 'LM',
            'Msg': ex.stack
        };

        objServiceHandler.Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'status_response_handler', objServiceHandler);
    }
    return objServiceHandler;
};
SBIGeneralMotor.prototype.pg_response_handler = function () {
    try {
        var objInsurerProduct = this;
        if (objInsurerProduct.const_payment_response.pg_data.hasOwnProperty('pg_type') && objInsurerProduct.const_payment_response.pg_data.pg_type === "rzrpay" && this.lm_request['product_id'] === 10) {
            var output = objInsurerProduct.const_payment_response.pg_get;
        } else {
            var output = objInsurerProduct.const_payment_response.pg_post;
        }
        if (objInsurerProduct.proposal_processed_request.hasOwnProperty('___pay_from___') && objInsurerProduct.proposal_processed_request['___pay_from___'] === 'wallet') {
            if (output['status'] === 'Success') {
                this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.transaction_id = output['txnid'];
                this.const_policy.transaction_amount = output['amount'];
                this.const_policy.pg_reference_number_1 = moment(this.proposal_processed_request['___current_date___'], 'DD/MM/YYYY').format("DD-MM-YYYY"); 
                this.const_policy.pg_reference_number_2 = output['order_id'];
                this.const_policy.pg_reference_number_3 = output['transfer_id'];
                this.const_policy.policy_number = objInsurerProduct.const_payment_response.pg_data.txnid;
            } else {
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
            }
        } else if (objInsurerProduct.const_payment_response.pg_data.hasOwnProperty('pg_type') && objInsurerProduct.const_payment_response.pg_data.pg_type === "rzrpay" && this.lm_request['product_id'] === 10) {
            if (output['Status'] === 'Success') {
                this.const_policy.transaction_amount = objInsurerProduct.const_payment_response.pg_data.amount;
                this.const_policy.pg_status = 'SUCCESS';
//                this.const_policy.pg_reference_number_1 = "";
                this.const_policy.pg_reference_number_2 = output['OrderId'];
                this.const_policy.transaction_id = output['PayId'].toString();
                this.const_policy.policy_number = objInsurerProduct.const_payment_response.pg_data.quoteId;
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
                this.const_policy.pg_status = 'SUCCESS';
                this.const_policy.pg_reference_number_1 = output['addedon'];
                this.const_policy.pg_reference_number_2 = output['bank_ref_num'];
                this.const_policy.transaction_id = output.hasOwnProperty('payuMoneyId') ? (JSON.parse(output['payuMoneyId'])['splitIdMap'][0]['splitPaymentId']).toString() : output['txnid'];
                this.const_policy.policy_number = (output['udf2'] !== '') ? output['udf2'] : output['txnid'];
            } else {
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
            }
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pg_response_handler', ex);
    }
};

SBIGeneralMotor.prototype.verification_response_handler = function (objResponseJson) {
    console.log('Start', this.constructor.name, 'verification_response_handler', objResponseJson);
    var objServiceHandler = {
        'Error_Msg': 'NO_ERR',
        'Insurer_Transaction_Identifier': null,
        'Premium_Breakup': null,
        'Policy': null
    };
    var Error_Msg = 'NO_ERR';
    var pdf = require('html-pdf');
    try {
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
        if (this.const_payment_response.pg_data.hasOwnProperty('pg_type') && this.const_payment_response.pg_data.pg_type === "rzrpay" && this.lm_request['product_id'] === 10 && this.const_policy.pg_status === "SUCCESS") {
            if (objResponseJson['status'] === "captured") {
                var razp_date = moment.unix(objResponseJson['created_at']).format("DD-MM-YYYY");
                this.const_policy['pg_reference_number_1'] = razp_date;
                if (this.const_policy.pg_reference_number_1 === null || this.const_policy.pg_reference_number_1 === undefined || this.const_policy.pg_reference_number_1 === "") {
                    this.const_policy['pg_reference_number_1'] = moment(this.proposal_processed_request['___current_date___'], 'DD/MM/YYYY').format("DD-MM-YYYY");
                }
            } else {
                Error_Msg = JSON.stringify(objResponseJson);
                this.const_policy.pg_status = 'FAIL';
                this.const_policy.transaction_status = 'FAIL';
            }
        }
        if (this.const_policy.pg_status === 'FAIL') {

        }
        if (this.const_policy.pg_status === 'SUCCESS') {
            if (this.const_policy.hasOwnProperty('policy_number') === false || this.const_policy.policy_number === '' || this.const_policy.policy_number === null || (this.const_policy.policy_number).indexOf('SBI') > -1 === false || this.const_policy.policy_number === 'Err_Pol_Num_Gnrt' || this.const_policy.policy_number.toString().length <= 7) {
                if ((this.const_policy.policy_number).indexOf('SBI') > -1 === false && this.hasOwnProperty('const_payment_response') && this.const_payment_response.hasOwnProperty('pg_data') && this.const_payment_response.pg_data.hasOwnProperty('txnid')) {
                    this.const_policy.policy_number = this.const_payment_response.pg_data['txnid'];
                    if (this.const_policy.hasOwnProperty('policy_number') === false || this.const_policy.policy_number === '' || this.const_policy.policy_number === null || (this.const_policy.policy_number).indexOf('SBI') > -1 === false || this.const_policy.policy_number === 'Err_Pol_Num_Gnrt' || this.const_policy.policy_number.toString().length <= 7) {
                        Error_Msg = 'ERROR IN POLICY NUMBER GENERATION';
                    }
                } else {
                    Error_Msg = 'ERROR IN POLICY NUMBER GENERATION';
                }
            }
            if (Error_Msg === 'NO_ERR') {
                this.const_policy.sbigeneral_data = JSON.stringify(this['processed_request']);
                //this.const_policy.policy_number = (this.processed_request['___policy_number_generate___']).toString();
                var policy_number = this.const_policy.policy_number;
                this.const_policy.transaction_status = 'SUCCESS';
                if (this.lm_request['product_id'] === 10)
                {
                    var pdf_file_name = this.constructor.name + '_' + product_name + '_POLICY_' + policy_number + '.pdf';
                    var html_file_name = this.constructor.name + '_' + product_name + '_POLICY_' + policy_number + '.html';
                    var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                    var html_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + html_file_name;
                    //var pdf_web_path_portal = config.environment.weburl + config.pb_config.pdf_web_loc + pdf_file_name;
                    var pdf_sys_loc_portal = config.pb_config.pdf_system_loc + pdf_file_name;
                    this.const_policy.policy_url = pdf_web_path_portal;
                    this.const_policy.feedfile_url = config.environment.downloadurl + config.pb_config.pdf_web_loc + "SBIGeneralMotor_FeedFile_" + policy_number + ".csv";
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
                                    "pg_reference_number_1": objProduct.const_policy.pg_reference_number_1,
                                    "pg_reference_number_2": objProduct.const_policy.pg_reference_number_2,
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
            'Msg': ex.stack
        };
        Error_Msg = JSON.stringify(Err);
        console.error('Exception', this.constructor.name, 'verification_response_handler', objServiceHandler);
    }
    objServiceHandler.Policy = this.const_policy;
    objServiceHandler.Error_Msg = Error_Msg;
    return objServiceHandler;
};
SBIGeneralMotor.prototype.applicable_imt = function (objResponseJson) {
    var apllied_imt = "22";
    try {
        var objResponseJson = objResponseJson;

        if (objResponseJson['___financial_agreement_type___'] === "Hire Purchase") {
            apllied_imt = apllied_imt + ',5';
        }
        if (objResponseJson['___financial_agreement_type___'] === "Lease agreement") {
            apllied_imt = apllied_imt + ',6';
        }
        if (objResponseJson['___financial_agreement_type___'] === "Hypothecation") {
            apllied_imt = apllied_imt + ',7';
        }
        if (objResponseJson['___premium_breakup_tp_cover_owner_driver_pa___'] > 0) {
            apllied_imt = apllied_imt + ',15';
        }
        if (objResponseJson['___premium_breakup_tp_cover_paid_driver_pa___'] > 0) {
            apllied_imt = apllied_imt + ',17';
        }
        if (objResponseJson['___premium_breakup_od_elect_access___'] > 0) {
            apllied_imt = apllied_imt + ',24';
        }
        if (objResponseJson['___premium_breakup_tp_cng_lpg___'] > 0) {
            apllied_imt = apllied_imt + ',25';
        }
        if (objResponseJson['___premium_breakup_tp_cover_paid_driver_ll___'] > 0) {
            apllied_imt = apllied_imt + ',28';
        }
        if (objResponseJson['___premium_breakup_tp_cover_unnamed_passenger_pa___'] > 0) {
            apllied_imt = apllied_imt + ',16';
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'applicable_imt', ex);
        return apllied_imt;
    }
    return apllied_imt;
};
SBIGeneralMotor.prototype.pdf_call = function (url, args, pdf_sys_loc) {
    try {
        var objInsurerProduct = this;
        objInsurerProduct.pdf_attempt++;
        var Client = require('node-rest-client').Client;
        var client = new Client();
        client.post(url, args, function (data, response) {
            if (data.Error_Code !== '' || true) {
                if (!fs.existsSync(pdf_sys_loc) && objInsurerProduct.pdf_attempt < 11) {
                    //var sleep = require('system-sleep');
                    //sleep(60000);
                    //objInsurerProduct.pdf_call(url, args, pdf_sys_loc);
                }
            }
        });
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'pdf_call', ex);
    }
};
SBIGeneralMotor.prototype.pdf_response_handler = function (objResponseJson) {
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
            var pdf_file_name = this.constructor.name + '_TW_POLICY_' + objProduct.lm_request['policy_number'] + '.pdf';
            var html_file_name = this.constructor.name + '_TW_POLICY_' + objProduct.lm_request['policy_number'] + '.html';
            var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
            var html_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + html_file_name;
            var html_file_path = appRoot + "/resource/request_file/SBIGeneral_TW_SampleHtml.html"; //for UAT
            var pdf_file_path = appRoot + "/tmp/pdf/" + this.constructor.name + '_TW_POLICY_' + objProduct.lm_request['policy_number'] + '.pdf';
            var html_pdf_file_path = appRoot + "/tmp/pdf/" + this.constructor.name + '_TW_POLICY_' + objProduct.lm_request['policy_number'] + '.html';
            //console.log("pdf_file_path : ",pdf_file_path);
            policy.feedfile_url = config.environment.downloadurl + config.pb_config.pdf_web_loc + "SBIGeneralMotor_FeedFile_" + objProduct.lm_request['policy_number'] + ".csv";
            policy.policy_url = pdf_web_path_portal;
            var htmlPol = fs.readFileSync(html_file_path, 'utf8');
            var User_Data = require(appRoot + '/models/user_data');
            User_Data.findOne({"Request_Unique_Id": this.lm_request['search_reference_number']}, function (err, dbUserData) {
                if (dbUserData) {
                    try {
                        //process for pg_data
                        var Processed_Request = dbUserData.Proposal__Request_Core;
                        var Erp_Qt_Request_Core = dbUserData.Erp_Qt_Request_Core;
                        var objUin = {
                            "0CH_1TP": "IRDAN144RP0001V01200910",
                            "1CH_0TP": "IRDAN144RP0006V02201112",
                            "2CH_0TP": "IRDAN144RP0001V01201516",
                            "3CH_0TP": "IRDAN144RP0001V01201516",
                            "0CH_5TP": "IRDAN144RP0003V01201819",
                            "1CH_4TP": "IRDAN144RP0007V01201819",
                            "5CH_0TP": "IRDAN144RP0005V01201819",
                            "1OD_0TP": "IRDAN144RP0002V01201920"
                        };
                        if (Erp_Qt_Request_Core['___registration_no_1___'] === "KL") {
                            var state_cess_amount = ((1 / 100) * ((dbUserData.Erp_Qt_Request_Core['___premium_breakup_net_premium___']) - 0)).toFixed(2);
                            var Final_Premium = (((dbUserData.Erp_Qt_Request_Core['___premium_breakup_final_premium___']) - 0) + (state_cess_amount - 0)).toFixed(2);
                        } else {
                            var state_cess_amount = 0;
                            var Final_Premium = (((dbUserData.Erp_Qt_Request_Core['___premium_breakup_final_premium___']) - 0) + (state_cess_amount - 0)).toFixed(2);
                        }
                        var breakin_day = 0;
                        if (Erp_Qt_Request_Core['___is_breakin___'] === "yes") {
                            breakin_day = 1;
                        }
                        var qr_text = 'Policy No: ' + objProduct.lm_request['policy_number'].toString() + '+Customer Name:' + Erp_Qt_Request_Core['___first_name___'] + ' ' + Erp_Qt_Request_Core['___middle_name___'] + ' ' + Erp_Qt_Request_Core['___last_name___'] + '+Engine no:' + Erp_Qt_Request_Core['___engine_number___'] + '+Chassis No:' + Erp_Qt_Request_Core['___chassis_number___'] + '+Vehicle No:' + Erp_Qt_Request_Core['___registration_no___'] + '+OD Policy Start date:' + moment(Erp_Qt_Request_Core['___policy_start_date___']).add('days', parseInt(breakin_day)).format("DD/MM/YYYY") + '+OD Policy end date:' + (moment(Erp_Qt_Request_Core['___policy_start_date___'], "YYYY-MM-DD").add('years', (dbUserData.Erp_Qt_Request_Core['___policy_od_tenure___'] - 0)).subtract(1, "days")).add('days', parseInt(breakin_day)).format('DD/MM/YYYY') + '+TP Policy Start date:' + moment(Erp_Qt_Request_Core['___policy_start_date___']).add('days', parseInt(breakin_day)).format("DD/MM/YYYY") + '+TP Policy end date:' + (moment(Erp_Qt_Request_Core['___policy_start_date___'], "YYYY-MM-DD").add('years', (dbUserData.Erp_Qt_Request_Core['___policy_tp_tenure___'] - 0)).subtract(1, "days")).add('days', parseInt(breakin_day)).format('DD/MM/YYYY') + '+URL:https://www.sbigeneral.in/';
                        var qr_url = 'https://chart.googleapis.com/chart?chs=70x70&cht=qr&chl=' + encodeURI(qr_text) + '&chld=L|1&choe=UTF-8';
                        let rzp_transfer_id = "";
                        let ff_rzp_dt = "";
                        let ff_pay_id = "";
                        let policy_pay_dt = "";
                        try {
                             /////////////remove later //////////////////
                            dbUserData.Transaction_Data.pg_reference_number_1 = '';
                            var policy_number = objProduct.lm_request['policy_number'].toString();
                            var ff_file_name = "SBIGeneralMotor_FeedFile_" + policy_number + ".csv";
                            var ff_web_path_portal = appRoot + "/tmp/pdf/" + ff_file_name;
                            if (dbUserData.Transaction_Data && dbUserData.Transaction_Data.pg_reference_number_1) {
                                policy_pay_dt = moment(dbUserData.Transaction_Data['pg_reference_number_1'], 'DD-MM-YYYY').format('DD/MM/YYYY');
                                ff_rzp_dt = dbUserData.Transaction_Data['pg_reference_number_1'];
                            } else {
//                                policy_pay_dt = moment(objProduct.lm_request['pg_reference_number_1'], 'DD-MM-YYYY').format('DD/MM/YYYY');
//                                ff_rzp_dt = objProduct.lm_request['pg_reference_number_1'];
                                if(config.environment.name === 'Development'){
                                    var sub = '[' + config.environment.name.toString().toUpperCase() + ']INFO-PolicyBoss.com-Policy SBI General Feed File:' + policy_number;
                                    email_body = '<html><body><p>Hi,</p><BR/><p>Please find the attachment of Feed File of SBI General TW Policy.</p>'
                                                  + '<BR><p>Policy Number : ' + policy_number + '</p><BR><p>Policy URL : ' + ff_web_path_portal + ' </p></body></html>';
                                    var arrTo = ['somanshu.singh@policyboss.com', 'roshani.prajapati@policyboss.com', 'ravi.pandey@policyboss.com'];
                                    var Email = require('../../models/email');
                                    var objModelEmail = new Email();
                                    objModelEmail.send('notifications@policyboss.com','ravi.pandey@policyboss.com', sub, email_body, config.environment.notification_email, '', '');
                                    console.log('mail sent')
                                }
                                if (config.environment.name === 'Production') {
                                      
                                }
                            }
                            if (dbUserData.Payment_Request.pg_data.hasOwnProperty('pg_type') && dbUserData.Payment_Request.pg_data['pg_type'] === "rzrpay") {
                                rzp_transfer_id = dbUserData.Payment_Request.pg_data['transfer_id'];
                                ff_pay_id = dbUserData.Payment_Response.pg_get && dbUserData.Payment_Response.pg_get['PayId'].toString();
                            } else if (dbUserData.Erp_Qt_Request_Core['___pay_from___'] === "wallet") {
                                if (dbUserData.Transaction_Data) {
                                    rzp_transfer_id = dbUserData.Transaction_Data['pg_reference_number_3'];
                                } else {
                                   // rzp_transfer_id = (dbUserData.Verification_Request && dbUserData.Verification_Request.hasOwnProperty('pg_post') && dbUserData.Verification_Request.pg_post) ? dbUserData.Verification_Request.pg_post['transfer_id'] : dbUserData.Transaction_Data['pg_reference_number_3'];
                                    rzp_transfer_id = dbUserData.Payment_Response.pg_post && dbUserData.Payment_Response.pg_post['transfer_id'];
                                    policy_pay_dt = moment(objProduct.lm_request['pg_reference_number_1'], 'DD-MM-YYYY').format('DD/MM/YYYY');
                                    ff_rzp_dt = objProduct.lm_request['pg_reference_number_1'];
                                }
                                ff_pay_id = objProduct.lm_request.transaction_id;
                            } else {
                                rzp_transfer_id = objProduct.lm_request.transaction_id.toString();
                                policy_pay_dt = moment(dbUserData.Transaction_Data['pg_reference_number_1']).format('DD/MM/YYYY');
                                ff_rzp_dt = moment(dbUserData.Transaction_Data['pg_reference_number_1']).format("DD-MM-YYYY");
                                ff_pay_id = objProduct.lm_request.transaction_id;
                            }
                        } catch (e) {
                            console.error("Exception Pdf Response Handler Razorpay handle : " + e.stack);
                        }
                          var replacedata = {
                            '___qr_url___': qr_url,
//                            '___transaction_id___': dbUserData.Payment_Request.pg_data.hasOwnProperty('pg_type') && dbUserData.Payment_Request.pg_data['pg_type'] === "rzrpay" ? dbUserData.Payment_Request.pg_data['transfer_id'] : (dbUserData.Erp_Qt_Request_Core['___pay_from___'] === "wallet" ? dbUserData.Transaction_Data['pg_reference_number_3'] : objProduct.lm_request.transaction_id.toString()),
                            '___transaction_id___': rzp_transfer_id,
                            '___saod_hide___': dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? "display:none;" : "",
                            '___non_saod_hide___': dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? "" : "display:none;",
                            '___misp_hide___': dbUserData.Erp_Qt_Request_Core['___posp_category___'] === "MISP" ? "" : "display:none;",
                            '___basic_tp_including_tppd___': (dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_basic___'] - 0) + (dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cover_paid_driver_pa___'] - 0),
                            '___policy_number___': objProduct.lm_request['policy_number'].toString(),
                            '___previous_insurer___': dbUserData.Erp_Qt_Request_Core['___is_breakin___'] === "yes" ? "" : objProduct.insurer_master.prev_insurer.insurer_db_master['InsurerName'],
                            '___si___': ((dbUserData.Erp_Qt_Request_Core['___vehicle_expected_idv___'] - 0) / 1).toFixed(2),
                            '___od_prm___': ((dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_basic___']) - (dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_disc___'])).toFixed(2),
                            '___tp_bas___': ((dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_basic___']) - 0).toFixed(2),
                            '___tp_own___': ((dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cover_owner_driver_pa___']) - 0).toFixed(2),
                            '___ncb_per___': (objProduct.processed_request['___vehicle_ncb_next___']),
                            '___registration_no___': dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_type___'] === "renew" ? dbUserData.Erp_Qt_Request_Core['___registration_no___'] : "NEW",
                            '___pr_ncb_per___': dbUserData.Erp_Qt_Request_Core['___vehicle_ncb_current___'],
                            '___ncb_prm___': ((dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_disc_ncb___']) - 0).toFixed(2),
                            '___od_fnl___': ((dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_final_premium___']) - 0).toFixed(2),
                            '___tp_fnl___': ((dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_final_premium___']) - 0).toFixed(2),
                            '____state_cess_amount___': state_cess_amount,
                            '___fnl_prm___': Final_Premium,
                            '___od_hide___': dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'].indexOf('0CH') > -1 ? "display:none;" : "",
                            '___paod_hide___': (dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cover_owner_driver_pa___'] - 0) > 0 ? "" : "display:none;",
                            '___tax___': ((dbUserData.Erp_Qt_Request_Core['___tax___'] - 0) / 1).toFixed(2),
                            '___cgst___': ((dbUserData.Erp_Qt_Request_Core['___tax___'] - 0) / 2).toFixed(2),
                            '___sgst___': ((dbUserData.Erp_Qt_Request_Core['___tax___'] - 0) / 2).toFixed(2),
                            '___proposal_number___': objProduct.prepared_request['pg_reference_number_2'],
                            '___policy_expiry_date___': dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? dbUserData.Erp_Qt_Request_Core['___tp_end_date___'] : moment(Erp_Qt_Request_Core['___policy_expiry_date___']).format("DD/MM/YYYY"),
                            '___pre_policy_start_date___': dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? dbUserData.Erp_Qt_Request_Core['___tp_start_date___'] : objProduct.processed_request['___pre_policy_start_date___'],
                            '___policy_start_date___': moment(Erp_Qt_Request_Core['___policy_start_date___']).add('days', parseInt(breakin_day)).format("DD/MM/YYYY"),
                            '___policy_end_date___': moment(Erp_Qt_Request_Core['___policy_end_date___']).add('days', parseInt(breakin_day)).format("DD/MM/YYYY"),
                            '___vehicle_manf_year___': moment(Erp_Qt_Request_Core['___vehicle_manf_date___'], "YYYY-MM-DD").format("MMM YYYY"),
                            '___od_pol_end_date___': (moment(Erp_Qt_Request_Core['___policy_start_date___'], "YYYY-MM-DD").add('years', (dbUserData.Erp_Qt_Request_Core['___policy_od_tenure___'] - 0)).subtract(1, "days")).add('days', parseInt(breakin_day)).format('DD/MM/YYYY'),
                            '___tp_pol_end_date___': (moment(Erp_Qt_Request_Core['___policy_start_date___'], "YYYY-MM-DD").add('years', (dbUserData.Erp_Qt_Request_Core['___policy_tp_tenure___'] - 0)).subtract(1, "days")).add('days', parseInt(breakin_day)).format('DD/MM/YYYY'),
                            '___paod_pol_end_date___': (moment(Erp_Qt_Request_Core['___policy_start_date___'], "YYYY-MM-DD").add('years', 1).subtract(1, "days")).add('days', parseInt(breakin_day)).format('DD/MM/YYYY'),
                            '___nominee_birth_date___': objProduct.processed_request['___nominee_birth_date___'],
                            '___nominee_age___': Erp_Qt_Request_Core['___nominee_age___'] == 0 ? '' : Erp_Qt_Request_Core['___nominee_age___'],
                            '___curr_dt___': (moment().format('DD/MM/YYYY')).toString(),
//                            '___pay_dt___': ((dbUserData.Payment_Request.pg_data.hasOwnProperty('pg_type') && dbUserData.Payment_Request.pg_data['pg_type'] === "rzrpay") || dbUserData.Erp_Qt_Request_Core['___pay_from___'] === "wallet") ? moment(dbUserData.Transaction_Data['pg_reference_number_1'], 'DD-MM-YYYY').format('DD/MM/YYYY') : moment(dbUserData.Transaction_Data['pg_reference_number_1']).format('DD/MM/YYYY'),
                            '___pay_dt___': policy_pay_dt,
                              "___applicable_imt___": objProduct.applicable_imt(Erp_Qt_Request_Core),
                            "___is_new___": Erp_Qt_Request_Core['___vehicle_insurance_type___'] === "new" ? "display:none;" : "",
                            "___is_policy___": Erp_Qt_Request_Core['___is_policy_exist___'] === "no" ? "display:none;" : "",
                            "___misp_name___": Erp_Qt_Request_Core['___posp_first_name___'] + " " + Erp_Qt_Request_Core['___posp_middle_name___'] + " " + Erp_Qt_Request_Core['___posp_last_name___'],
                            "___misp_code___": Erp_Qt_Request_Core['___posp_erp_id___'],
                            "___misp_contact___": Erp_Qt_Request_Core['___posp_mobile_no___'],
                            "___addon_zd_prm___": Erp_Qt_Request_Core['___addon_zero_dep_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_zero_dep_cover___'] : "0",
                            "___addon_rti_prm___": Erp_Qt_Request_Core['___addon_invoice_price_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_invoice_price_cover___'] : "0",
                            "___addon_ep_prm___": Erp_Qt_Request_Core['___addon_engine_protector_cover___'] === "yes" ? dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_engine_protector_cover___'] : "0",
                            "___financial_agreement_type___": dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___'] === "0" ? "" : dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___'],
                            "___gst_hide___": dbUserData.Erp_Qt_Request_Core['___gst_no___'] === "" ? "display:none;" : "",
                            "___finance_hide___": dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___'] === "0" ? "display:none;" : "",
                            "___uin_no_products___": objUin[Erp_Qt_Request_Core['___vehicle_insurance_subtype___']],
                            "___compulsory_deductible___": parseInt(objProduct.processed_request['___dbmaster_insurer_vehicle_cubiccapacity___']) < 1500 ? "100" : "100",
                            "___pa_unnamed_passenger_si___": ((dbUserData.Erp_Qt_Request_Core['___pa_unnamed_passenger_si___'] === undefined || dbUserData.Erp_Qt_Request_Core['___pa_unnamed_passenger_si___'] === "") ? "0" : dbUserData.Erp_Qt_Request_Core['___pa_unnamed_passenger_si___'])
                        };
                        htmlPol = htmlPol.toString().replaceJson(replacedata);
                        htmlPol = htmlPol.toString().replaceJson(Processed_Request);
                        htmlPol = htmlPol.toString().replaceJson(Erp_Qt_Request_Core);
                        // console.log(htmlPol);
                        var sleep = require('system-sleep');

                        var fs = require('fs');
                        var request_html_file = fs.writeFileSync(html_pdf_file_path, htmlPol);


                        var http = require('https');
                        console.log('PdfUrl');
//                        var insurer_pdf_url = "http://qa.policyboss.com:3000/html2pdf?o=download&u=http://qa-horizon.policyboss.com:3000/pdf-files/policy/SBIGeneralMotor_TW_POLICY_SBI100005.html";
                        var insurer_pdf_url = config.environment.pdf_url + html_web_path_portal;
                        var file_horizon = fs.createWriteStream(pdf_file_path);
                        var request_horizon = http.get(insurer_pdf_url, function (response) {
                            response.pipe(file_horizon);
                        });
//                        var policy_number = objProduct.lm_request['policy_number'].toString();
                        var date = moment().format('YYYY-MM-DD HH:mm:ss');
                        var CRN = (dbUserData.Erp_Qt_Request_Core['___crn___']).toString();
                        var Product_Id = dbUserData.Erp_Qt_Request_Core['___erp_product_id___'];
                        //START Feed File Code=========================================================================================
//                        var ff_file_name = "SBIGeneralMotor_FeedFile_" + policy_number + ".csv";
//                        var ff_web_path_portal = appRoot + "/tmp/pdf/" + ff_file_name;
                        if (config.environment.name === 'Production' || config.environment.name === 'QA') {
                            ff_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + ff_file_name;
                        }
                        var ff_name_web_path_portal = appRoot + "/tmp/pdf/" + ff_file_name;
                        var OccupationCode = {
                            "BUSINESS": "1",
                            "SALARIED": "2",
                            "PROFESSIONAL": "3",
                            "STUDENT": "4",
                            "HOUSEWIFE": "5",
                            "RETIRED": "6",
                            "OTHERS": "7"
                        };
                        var nominee_dob = dbUserData.Erp_Qt_Request_Core['___nominee_birth_date___'].split("-");
                        var User_Data = require(appRoot + '/models/user_data');
                        var csvjson = require('csvjson');
                        var writeFile = require('fs').writeFile;
                        var fs = require('fs');
                        var data_list = [];
                        var obj_inscovertype = {
                            "0CH_1TP": "L",
                            "0CH_5TP": "L",
                            "1OD_0TP": "O",
                            "2CH_0TP": "P",
                            "3CH_0TP": "P",
                            "1CH_4TP": "P",
                            "1CH_0TP": "P"
                        };
                        var data_csv = {
                            "Sr No.": 1,
                            "POLICY_NO": objProduct.lm_request['policy_number'],
                            "LEADBY": "A", //Dealer/Agent
                            "INSCOVERTYPE": obj_inscovertype[dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___']], //Standalone/ Package policy (OD only or Comprehensive policy) O- OD only Policy and P - Stands for Package Policy
                            "INSPOLICYTYPE": dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_type___'] === "new" ? "N" : "R",
//                            "PROPOSALCREATEDDATE": ((dbUserData.Payment_Request.pg_data.hasOwnProperty('pg_type') && dbUserData.Payment_Request.pg_data['pg_type'] === "rzrpay") || dbUserData.Erp_Qt_Request_Core['___pay_from___'] === "wallet") ? dbUserData.Transaction_Data['pg_reference_number_1'] : moment(dbUserData.Transaction_Data['pg_reference_number_1']).format("DD-MM-YYYY"),
                            "PROPOSALCREATEDDATE": ff_rzp_dt,
                            "PROPOSALCREATEDTIME": "",
//                            "TRANSACTIONID": dbUserData.Payment_Request.pg_data.hasOwnProperty('pg_type') && dbUserData.Payment_Request.pg_data['pg_type'] === "rzrpay" ? (dbUserData.Payment_Response.pg_get && dbUserData.Payment_Response.pg_get['PayId'].toString()) : objProduct.lm_request.transaction_id,
                            "TRANSACTIONID": ff_pay_id,
                            "VISOFNUMBER": "",
                            "INSPOLICYISSUINGDEALERCODE": objProduct.processed_request['___dbmaster_insurer_rto_district_name___'],
                            "INSPOLICYEFFECTIVEDATE": moment(Erp_Qt_Request_Core['___policy_start_date___']).add('days', parseInt(breakin_day)).format("YYYY-MM-DD"),
                            "INSPOLICYEFFECTIVETIME": "00:00:01",
                            "INSPOLICYEXPIRYDATE": (moment(Erp_Qt_Request_Core['___policy_start_date___'], "YYYY-MM-DD").add('years', (dbUserData.Erp_Qt_Request_Core['___policy_tp_tenure___'] - 0)).subtract(1, "days")).add('days', parseInt(breakin_day)).format('DD/MM/YYYY'),
                            "PROPOSERTYPE": "I",
                            "SALUTATION": dbUserData.Erp_Qt_Request_Core['___salutation___'],
                            "FIRSTNAME": dbUserData.Erp_Qt_Request_Core['___first_name___'],
                            "MIDDLENAME": dbUserData.Erp_Qt_Request_Core['___middle_name___'],
                            "LASTNAME": dbUserData.Erp_Qt_Request_Core['___last_name___'],
                            "COMPANYNAME": "",
                            "GENDER": dbUserData.Erp_Qt_Request_Core['___gender___'],
                            "DATEOFBIRTH": moment(dbUserData.Erp_Qt_Request_Core['___birth_date___']).format("YYYY-MM-DD"),
                            "ADDRESS1": dbUserData.Erp_Qt_Request_Core['___communication_address_1___'],
                            "ADDRESS2": dbUserData.Erp_Qt_Request_Core['___communication_address_2___'],
                            "ADDRESS3": dbUserData.Erp_Qt_Request_Core['___communication_address_3___'],
                            "CITYCODE": dbUserData.Erp_Qt_Request_Core['___communication_city_code___'],
                            "STATECODE": dbUserData.Erp_Qt_Request_Core['___communication_state___'],
                            "PINCODE": dbUserData.Erp_Qt_Request_Core['___communication_pincode___'],
                            "EMAIL": dbUserData.Erp_Qt_Request_Core['___email___'],
                            "PROPOSERPAN": dbUserData.Erp_Qt_Request_Core['___pan___'],
                            "PAOWNDRIVERNOMNAME": dbUserData.Erp_Qt_Request_Core['___nominee_name___'],
                            "PAOWNDRIVERNOMGENDER": "",
                            "PAOWNDRIVERNOMAGE": dbUserData.Erp_Qt_Request_Core['___nominee_age___'],
                            "PAOWNDRIVERNOMRELEATION": dbUserData.Erp_Qt_Request_Core['___nominee_relation___'],
                            "PAOWNDRIVERAPPOINTEENAME": "",
                            "PAOWNDRIVERAPPOINTEERELATION": "",
                            "VEHICLECLASS": "P",
                            "VEHICLETYPE": "TWP",
                            "VEHICLESUBCLASS": "",
                            "CVMISCTYPE": "",
                            "CARRIERTYPE": "",
                            "GVW": 0,
                            "CARRYINGCAPACITY": objProduct.processed_request['___dbmaster_insurer_vehicle_seatingcapacity___'],
                            "TARIFFPAXRANGE": "",
                            "VEHICLEINVOICEDATE": dbUserData.Erp_Qt_Request_Core['___vehicle_registration_date___'],
                            "MAKE": objProduct.processed_request['___dbmaster_insurer_vehicle_make_name___'],
                            "MODELCODE": objProduct.processed_request['___dbmaster_insurer_vehicle_model_code___'],
                            "VARIANTCODE": objProduct.processed_request['___dbmaster_insurer_vehicle_variant_code___'],
                            "ENGINENO": "'" + dbUserData.Erp_Qt_Request_Core['___engine_number___'].toString(),
                            "CHASSISNO": "'" + dbUserData.Erp_Qt_Request_Core['___chassis_number___'].toString(),
                            "CC": objProduct.processed_request['___dbmaster_pb_cubic_capacity___'],
                            "NOOFTRAILERS": 0,
                            "TRAILERCHASSISNO": "",
                            "TRAILERREGISTRATIONNO": "",
                            "YEAROFMANUFACTURE": dbUserData.Erp_Qt_Request_Core['___vehicle_manf_year___'],
                            "REGISTRATIONDATE": dbUserData.Erp_Qt_Request_Core['___vehicle_registration_date___'],
                            "REGISTRATIONNO": dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_type___'] === "new" ? "" : dbUserData.Erp_Qt_Request_Core['___registration_no___'],
                            "RTOCODE": dbUserData.Erp_Qt_Request_Core['___rto_id___'].toString(),
                            "ISBANGLADESHCOVERED": 0,
                            "ISBHUTANCOVERED": 0,
                            "ISMALDIVESCOVERED": 0,
                            "ISNEPALCOVERED": 0,
                            "ISPAKISTANCOVERED": 0,
                            "ISSRILANKACOVERED": 0,
                            "GEOGRAPHICEXTNPREMIUM": 0,
                            "GEOGRAPHICEXTNTPPREMIUM": 0,
                            "FINANCERCODE": dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___'] === "0" ? "0" : dbUserData.Erp_Qt_Request_Core['___financial_institute_code___'],
                            "FINANCERBRANCH": dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___'] === "0" ? "0" : dbUserData.Erp_Qt_Request_Core['___financial_institute_city___'],
                            "AGGREMENTTYPE": dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___'] === "0" ? "" : dbUserData.Erp_Qt_Request_Core['___financial_agreement_type___'],
                            "COMPDEDUCTIBLES": 100,
                            "EXSHOWROOMPRICE": objProduct.processed_request['___dbmaster_insurer_vehicle_exshowroom___'].toString(),
                            "VEHICLEIDV": dbUserData.Erp_Qt_Request_Core['___vehicle_expected_idv___'].toString(),
                            "BODYIDV": 0,
                            "TRAILERIDV": 0,
                            "TOTALIDV": dbUserData.Erp_Qt_Request_Core['___vehicle_expected_idv___'].toString(),
                            "PREMIUMCALCULATEDBY": "I",
                            "VEHICLEPREMIUM": (dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_basic___'] - dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_disc___']).toString(),
                            "ODDISCPER": 0, //yet to check
                            "TRAILERPREMIUM": 0,
                            "NONELECTRICACCIDV": dbUserData.Erp_Qt_Request_Core['___non_electrical_accessory___'].toString(),
                            "NONELECTRICACCPREMIUM": dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_non_elect_access___'].toString(),
                            "ELECTRICACCIDV": dbUserData.Erp_Qt_Request_Core['___electrical_accessory___'].toString(),
                            "ELECTRICACCPREMIUM": dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_elect_access___'].toString(),
                            "BIFUELKITVALUE": 0,
                            "BIFUELKITIDV": 0,
                            "BIFUELTPPREMIUM": 0,
                            "BIFUELKITPREMIUM": 0,
                            "IMT23PREMIUM": 0,
                            "IMT34PREMIUM": 0,
                            "OVERTURNCOVER": 0,
                            "IMT33PREMIUM": 0,
                            "BASICODP": (dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_basic___'] - dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_disc___']).toString(),
                            "VOLUNTARYDEDUCTIBLE": "",
                            "VOLUNTARYDISC": 0,
                            "ISAAMEMBERSHIP": 0,
                            "AAMEMNO": "",
                            "AADISCAMOUNT": 0,
                            "AAEXPIRYPERIOD": "",
                            "ISANTITHEFTATTACHED": 0,
                            "ANTITHEFTDISCAMOUNT": 0,
                            "NCBFLAG": (dbUserData.Erp_Qt_Request_Core['___is_claim_exists___'] === "yes" && dbUserData.Erp_Qt_Request_Core['___breakin_days___'] && dbUserData.Erp_Qt_Request_Core['___breakin_days___'] - 0 > 88) ? "0" : "1",
                            "NCBPER": dbUserData.Erp_Qt_Request_Core['___is_claim_exists___'] === "yes" ? "0" : objProduct.processed_request['___vehicle_ncb_next___'],
                            "NCBAMOUNT": dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_disc_ncb___'].toString(),
                            "ISOWNPREMISES": 0,
                            "ADDONISNILDEP": dbUserData.Erp_Qt_Request_Core['___addon_zero_dep_cover___'] === "no" ? "0" : "1",
                            "ADDONNILDEPAMT": dbUserData.Erp_Qt_Request_Core['___addon_zero_dep_cover___'] === "no" ? "0" : dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_zero_dep_cover___'],
                            "ADDONISADDTOWING": 0,
                            "ADDONADDTOWINGAMT": 0,
                            "ADDONISEMICOVER": 0,
                            "ADDONEMICOVERAMT": 0,
                            "ADDONISRTI": dbUserData.Erp_Qt_Request_Core['___addon_invoice_price_cover___'] === "no" ? "0" : "1",
                            "ADDONRTIAMT": dbUserData.Erp_Qt_Request_Core['___addon_invoice_price_cover___'] === "no" ? "0" : dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_invoice_price_cover___'],
                            "ADDONISNCBPROT": 0,
                            "ADDONNCBPROTAMT": 0,
                            "ADDONISCONSUMABLE": 0,
                            "ADDONCONSUMABLESAMT": 0,
                            "ADDONISENGINEPROT": dbUserData.Erp_Qt_Request_Core['___addon_engine_protector_cover___'] === "no" ? "0" : "1",
                            "ADDONENGINEPROTAMT": dbUserData.Erp_Qt_Request_Core['___addon_engine_protector_cover___'] === "no" ? "0" : dbUserData.Erp_Qt_Request_Core['___premium_breakup_addon_engine_protector_cover___'],
                            "ADDONISPERSONALBELONGING": 0,
                            "ADDONPERSONALBELONGINGAMT": 0,
                            "ADDONISCOURTESYCAR": 0,
                            "ADDONCOURTESYCARAMT": 0,
                            "NETODPREMIUM": dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_final_premium___'].toString(),
                            "BASICTPL": dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_basic___'].toString(),
                            "EXTTPPD": 0,
                            "IMT34TP": "",
                            "TRAILERTP": 0,
                            "TOTALTP": dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_basic___'].toString(),
                            "PACOVERPREMOWNERDRIVER": dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cover_owner_driver_pa___'].toString(),
                            "PACOVERUNNAMEDDRIVER": 0,
                            "PACOVERPILLIONRIDER": dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cover_unnamed_passenger_pa___'] > 0 ? "1" : "0",
                            "ISPAPAIDDRIVER": 0,
                            "NOOFPAIDDRIVERPA": 0,
                            "PACOVERPREMPAIDDRIVER": 0,
                            "PASUMINSUREDPEREMPLOYEE": "",
                            "ISPACLEANER": 0,
                            "NOOFCLEANERPA": 0,
                            "PACOVERPREMCLEANER": 0,
                            "ISPACONDUCTOR": 0,
                            "NOOFCONDUCTORPA": 0,
                            "PACOVERPREMCONDUCTOR": 0,
                            "ISPAHELPER": 0,
                            "NOOFHELPERPA": 0,
                            "PACOVERPREMHELPER": 0,
                            "PANOOFPERSON": 0,
                            "PASUMINSUREDPERUNNAMEDPERSON": ((dbUserData.Erp_Qt_Request_Core['___pa_unnamed_passenger_si___'] === undefined || dbUserData.Erp_Qt_Request_Core['___pa_unnamed_passenger_si___'] === "") ? "0" : dbUserData.Erp_Qt_Request_Core['___pa_unnamed_passenger_si___'].toString()),
                            "PACOVERPREMUNNAMEDPERSON": dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cover_unnamed_passenger_pa___'].toString(),
                            "PATOTALPREMIUM": dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_cover_owner_driver_pa___'].toString(),
                            "ISLLPAIDDRIVER": 0,
                            "NOOFPAIDDRIVERLL": 0,
                            "LLPAIDDRIVPREMIUM": 0,
                            "ISLLCLEANER": 0,
                            "NOOFCLEANERLL": 0,
                            "LLCLEANERPREMIUM": 0,
                            "ISLLCONDUCTOR": 0,
                            "NOOFCONDUCTORLL": 0,
                            "LLCONDUCTORPREMIUM": 0,
                            "ISLLHELPER": 0,
                            "NOOFHELPERLL": 0,
                            "LLHELPERPREMIUM": 0,
                            "ISLLOTHEREMP": 0,
                            "LLOTHEREMPCOUNT": 0,
                            "LLOTHEREMPPREMIUM": 0,
                            "ISLLUNNAMEDPASS": 0,
                            "LLUNNAMEDPASSCOUNT": 0,
                            "LLUNNAMEDPASSPREMIUM": 0,
                            "ISLLNFPP": 0,
                            "LLNFPPCOUNT": 0,
                            "LLNFPPPREMIUM": 0,
                            "TOTALLEGALLIABILITY": 0,
                            "NETLIABILITYPREMIUMB": dbUserData.Erp_Qt_Request_Core['___premium_breakup_tp_final_premium___'].toString(),
                            "TOTALPREMIUM": dbUserData.Erp_Qt_Request_Core['___premium_breakup_net_premium___'].toString(),
                            "SERVICETAX": 0,
                            "GROSSPREMIUM": dbUserData.Erp_Qt_Request_Core['___premium_breakup_final_premium___'].toString(),
                            "IMTCODE": objProduct.applicable_imt(Erp_Qt_Request_Core),
//                            "PAYMENTID": dbUserData.Payment_Request.pg_data.hasOwnProperty('pg_type') && dbUserData.Payment_Request.pg_data['pg_type'] === "rzrpay" ? (dbUserData.Payment_Response.pg_get && dbUserData.Payment_Response.pg_get['PayId']) : objProduct.lm_request.transaction_id,
                            "PAYMENTID": ff_pay_id,
                            "PROPOSERPAYMENTMODE": "F",
                            "ISPROPOSALMANUALAPPROVED": 0,
                            "PREVPOLICYNO": "'" + dbUserData.Erp_Qt_Request_Core['___previous_policy_number___'],
                            "FIRSTISSINGDEALERCODE": "N/A",
                            "PREVPOLICYEFFECTIVEDATE": objProduct.processed_request['___pre_policy_start_date___'],
                            "PREVPOLICYEXPIRYDATE": dbUserData.Erp_Qt_Request_Core['___policy_expiry_date___'],
                            "PREVINSURCOMPANYCODE": objProduct.processed_request['___dbmaster_previousinsurer_code___'],
                            "PREVINSURCOMPANYNAME": objProduct.processed_request['___dbmaster_insurername___'],
                            "PREVINSURCOMPANYADD": objProduct.processed_request['___dbmaster_pb_previousinsurer_address___'],
                            "ISPREVPOLCOPYSUBMIT": 0,
                            "ISNCBCERTIFICATESUBMIT": 0,
                            "ISCUSTOMERUNDERTAKINGSUBMIT": 0,
                            "CURRENT_POLICY_TENURE": dbUserData.Erp_Qt_Request_Core['___policy_od_tenure___'],
                            "PREVIOUS_POLICY_TENURE": 1,
                            "TOTAL_NOOFOD_CLAIMS": 0,
                            "IDV_TENURE2": "",
                            "IDV_TENURE3": "",
                            "TENURE1_END_DATE": moment(Erp_Qt_Request_Core['___policy_end_date___']).add('days', parseInt(breakin_day)).format("YYYY-MM-DD"),
                            "TENURE2_START_DATE": "",
                            "TENURE2_END_DATE": "",
                            "TENURE3_START_DATE": "",
                            "ADDONEMICOVERMONTH": "",
                            "ADDONISDAILYCASH": 0,
                            "ADDONDAILYCASHAMT": "",
                            "ADDONISRSA": 0,
                            "ADDONRSAAMT": "",
                            "ADDONISINCONALLOWANCE": 0,
                            "ADDONINCONALLOWANCEAMT": "",
                            "ADDONISTYRECOVER": 0,
                            "ADDONADDONTYRECOVERAMT": "",
                            "ADDONISKEYREPLACEMENT": 0,
                            "ADDONKEYREPLACEMENTAMT": "",
                            "BREAKININSPECTIONDATE": "",
                            "BREAKINREFERENCENO": "",
                            "BREAKININSPECTIONAGENCY": "",
                            "RTOZONECODE": dbUserData.Erp_Qt_Request_Core['___pb_vehicletariff_zone___'],
                            "ISHANDICAPVEHICLE": 0,
                            "HANDICAPDISPREMIUM": 0,
                            "ADDONRTICOVERAMOUNT": 0,
                            "PSPNAME": "N/A",
                            "PSPAADHAARCARDNUMBER": "N/A",
                            "PSPPANNUMBER": "N/A",
                            "CESS_AMT_1": 0,
                            "CESS_AMT_2": 0,
                            "CESS_AMT_3": 0,
                            "CESS_AMT_4": "",
                            "CESS_AMT_5": "",
                            "VEHICLEPREMIUM_TENURE1": dbUserData.Erp_Qt_Request_Core['___premium_breakup_final_premium___'].toString(),
                            "VEHICLEPREMIUM_TENURE2": "",
                            "VEHICLEPREMIUM_TENURE3": "",
                            "NONELECTRICACCIDV_TENURE2": "",
                            "NONELECTRICACCIDV_TENURE3": "",
                            "NONELECTRICACCPREMIUM_TENURE1": 0,
                            "NONELECTRICACCPREMIUM_TENURE2": "",
                            "NONELECTRICACCPREMIUM_TENURE3": "",
                            "ELECTRICACCIDV_TENURE2": "",
                            "ELECTRICACCIDV_TENURE3": "",
                            "ELECTRICACCPREMIUM_TENURE1": 0,
                            "ELECTRICACCPREMIUM_TENURE2": "",
                            "ELECTRICACCPREMIUM_TENURE3": "",
                            "BIFUELKITIDV_TENURE2": "",
                            "BIFUELKITIDV_TENURE3": "",
                            "BIFUELKITPREMIUM_TENURE1": 0,
                            "BIFUELKITPREMIUM_TENURE2": "",
                            "BIFUELKITPREMIUM_TENURE3": "",
                            "BASICODP_TENURE1": dbUserData.Erp_Qt_Request_Core['___premium_breakup_od_final_premium___'].toString(),
                            "BASICODP_TENURE2": "",
                            "BASICODP_TENURE3": "",
                            "LT_DISCOUNT_PERCENTAGE": "",
                            "NETODPREMIUM_TENURE1": dbUserData.Erp_Qt_Request_Core['___premium_breakup_net_premium___'].toString(),
                            "NETODPREMIUM_TENURE2": 0,
                            "NETODPREMIUM_TENURE3": 0,
                            "PSPUNIQUENO": "AB-DPTS000119",
                            "BREAKINLOADINGPER": 0,
                            "IMT44": 0,
                            "ADDONISHOSPICASH": 0,
                            "ADDONHOSPICASHAMT": 0,
                            "ADDONISWHEELRIM": 0,
                            "ADDONWHEELRIMAMT": 0,
                            "BUYERSTATECODE": 36,
                            "INSSTATECODE": 36,
                            "INSOFFICECODE": 4,
                            "BUYERGSTIN": "",
                            "SGSTPER": 9,
                            "SGSTAMOUNT": (dbUserData.Erp_Qt_Request_Core['___premium_breakup_service_tax___'] / 2).toString(),
                            "CGSTPER": 9,
                            "CGSTAMOUNT": (dbUserData.Erp_Qt_Request_Core['___premium_breakup_service_tax___'] / 2).toString(),
                            "IGSTPER": 0,
                            "IGSTAMOUNT": 0,
                            "GSTCESSPER": 0,
                            "GSTCESSAMOUNT": 0,
                            "MOBILENO": dbUserData.Erp_Qt_Request_Core['___mobile___'],
                            "MISPCODE": "AB-MTS000211",
                            "SOLICTATIONTYPE": "D",
                            "PREVPOLICYNILDEPAVAILED": dbUserData.Erp_Qt_Request_Core['___addon_zero_dep_cover___'] === "no" ? "0" : "1",
                            "ADDONHOSPICASHPARAMETERS": "",
                            "ADDONISADDROADASSIST": 0,
                            "ADDONADDROADASSISTAMT": 0,
                            "ADDONISADDON18": 0,
                            "ADDONADDON18AMT": 0,
                            "ADDONISADDON19": 0,
                            "ADDONADDON19AMT": 0,
                            "ADDONISADDON20": 0,
                            "ADDONADDON20AMT": 0,
                            "PROPOSERAADHAARNUMBER": "",
                            "PROPOSERAADHAAREID": "",
                            "ISPROPOSERFORM60": "",
                            "PROPOSEREIA": "",
                            "ISFREEINSURANCE": "",
                            "PSPOTHERIDTYPE": "",
                            "PSPOTHERIDNUMBER": "",
                            "PUCCERTIFICATENUMBER": "",
                            "PUCEXPIRYDATE": "",
                            "COMFITNESSEXPIRYDATE": "",
                            "ISPREVPOLICYVISOF": dbUserData.Erp_Qt_Request_Core['___is_policy_exist___'] === "no" ? "0" : "1",
                            "ADDONDISCOUNTPER": "",
                            "ADDONISADDON21": "",
                            "ADDONADDON21AMT": "",
                            "ADDONISADDON22": "",
                            "ADDONADDON22AMT": "",
                            "ADDONISADDON23": "",
                            "ADDONADDON23AMT": "",
                            "ADDONISADDON24": "",
                            "ADDONADDON24AMT": "",
                            "ADDONISADDON25": "",
                            "ADDONADDON25AMT": "",
                            "LASTCLAIMDATE": "",
                            "TPPOLICYEFFECTIVEDATE": dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? "" : moment(Erp_Qt_Request_Core['___policy_start_date___']).add('days', parseInt(breakin_day)).format("YYYY-MM-DD"),
                            "TPPOLICYEFFECTIVETIME": "",
                            "TPPOLICYEXPIRYDATE": dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? "0" : (moment(Erp_Qt_Request_Core['___policy_start_date___'], "YYYY-MM-DD").add('years', (dbUserData.Erp_Qt_Request_Core['___policy_tp_tenure___'] - 0)).subtract(1, "days")).add('days', parseInt(breakin_day)).format('DD/MM/YYYY'),
                            "TPCURRENT_POLICY_TENURE": dbUserData.Erp_Qt_Request_Core['___policy_tp_tenure___'],
                            "TPPREVIOUS_POLICY_TENURE": "",
                            "TENURE3_END_DATE": "",
                            "TENURE4_START_DATE": "",
                            "TENURE4_END_DATE": "",
                            "TENURE5_START_DATE": "",
                            "IDV_TENURE4": "",
                            "IDV_TENURE5": "",
                            "VEHICLEPREMIUM_TENURE4": 0,
                            "VEHICLEPREMIUM_TENURE5": 0,
                            "NONELECTRICACCIDV_TENURE4": 0,
                            "NONELECTRICACCIDV_TENURE5": 0,
                            "NONELECTRICACCPREMIUM_TENURE4": 0,
                            "NONELECTRICACCPREMIUM_TENURE5": 0,
                            "ELECTRICACCIDV_TENURE4": 0,
                            "ELECTRICACCIDV_TENURE5": 0,
                            "ELECTRICACCPREMIUM_TENURE4": 0,
                            "ELECTRICACCPREMIUM_TENURE5": 0,
                            "BIFUELKITIDV_TENURE4": 0,
                            "BIFUELKITIDV_TENURE5": 0,
                            "BIFUELKITPREMIUM_TENURE4": 0,
                            "BIFUELKITPREMIUM_TENURE5": 0,
                            "BASICODP_TENURE4": 0,
                            "BASICODP_TENURE5": 0,
                            "NETODPREMIUM_TENURE4": 0,
                            "NETODPREMIUM_TENURE5": 0,
                            "ISCPA_DL_EXIST": 1,
                            "CPAEFFECTIVEDATE": "",
                            "CPAEFFECTIVETIME": "",
                            "CPAEXPIRYDATE": "",
                            "CPA_CURRENT_TENURE": 0,
                            "CPA_PREVIOUS_TENURE": "",
                            "CPASUMINSURED": 1500000,
                            "CPAWAIVERREASONCODE": 0,
                            "TPSGSTPER": "",
                            "TPSGSTAMOUNT": "",
                            "TPCGSTPER": "",
                            "TPCGSTAMOUNT": "",
                            "TPIGSTPER": "",
                            "TPIGSTAMOUNT": "",
                            "KW": "",
                            "ISTESTDRIVEVEHICLE": 0,
                            "OTHERTPPOLICYNO": dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? dbUserData.Erp_Qt_Request_Core['___tp_policy_number___'] : "",
                            "OTHERTPINSURCOMPANYNAME": dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? dbUserData.Erp_Qt_Request_Core['___tp_insurer_name___'] : "",
                            "OTHERTPPOLICYEFFECTIVEDATE": dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? dbUserData.Erp_Qt_Request_Core['___tp_start_date___'] : "",
                            "OTHERTPPOLICYEFFECTIVETIME": "",
                            "OTHERTPPOLICYEXPIRYDATE": dbUserData.Erp_Qt_Request_Core['___vehicle_insurance_subtype___'] === "1OD_0TP" ? dbUserData.Erp_Qt_Request_Core['___tp_end_date___'] : "",
                            "INSPOLICYNO": objProduct.lm_request.policy_number.toString(),
                            "INSPROPOSALNO": dbUserData.Erp_Qt_Request_Core['___crn___'],
//                            "RECONCILEDCHEQUENO": dbUserData.Payment_Request.pg_data.hasOwnProperty('pg_type') && dbUserData.Payment_Request.pg_data['pg_type'] === "rzrpay" ? dbUserData.Payment_Request.pg_data['transfer_id'] : (dbUserData.Erp_Qt_Request_Core['___pay_from___'] === "wallet" ? dbUserData.Transaction_Data['pg_reference_number_3'] : objProduct.lm_request.transaction_id.toString()),
                            "RECONCILEDCHEQUENO": rzp_transfer_id,
//                            "RECONCILEDCHEQUEDATE": ((dbUserData.Payment_Request.pg_data.hasOwnProperty('pg_type') && dbUserData.Payment_Request.pg_data['pg_type'] === "rzrpay") || dbUserData.Erp_Qt_Request_Core['___pay_from___'] === "wallet") ? dbUserData.Transaction_Data['pg_reference_number_1'] : moment(dbUserData.Transaction_Data['pg_reference_number_1']).format("DD-MM-YYYY"),
                            "RECONCILEDCHEQUEDATE": ff_rzp_dt,
                            "RECONCILEDCHEQUEBANK": "",
                            "RECONCILEDCHEQUEBRANCH": "",
                            "RECONCILEDCHEQUEAMOUNT": dbUserData.Erp_Qt_Request_Core['___premium_breakup_final_premium___'].toString(),
                            "RECONCILEDCHEQUEISSUEDBY": "D",
                            "PAYINSLIPNO": objProduct.processed_request['___pg_reference_number_2___'].toString(),
//                            "PAYINSLIPDATE": ((dbUserData.Payment_Request.pg_data.hasOwnProperty('pg_type') && dbUserData.Payment_Request.pg_data['pg_type'] === "rzrpay") || dbUserData.Erp_Qt_Request_Core['___pay_from___'] === "wallet") ? dbUserData.Transaction_Data['pg_reference_number_1'] : moment(dbUserData.Transaction_Data['pg_reference_number_1']).format("DD-MM-YYYY"),
                            "PAYINSLIPDATE": ff_rzp_dt,
                            "UNIQUEREFERENCENO": objProduct.processed_request['___pg_reference_number_2___'],
                            "CHEQUEAMOUNT": dbUserData.Erp_Qt_Request_Core['___premium_breakup_final_premium___'].toString(),
                            "PYMTPROPAYMENTMODE": "I",
                            "Feedfile Rec date": "",
                            "MISPCODE": dbUserData.Erp_Qt_Request_Core['___posp_category___'] === "MISP" ? dbUserData.Erp_Qt_Request_Core['___posp_erp_id___'] : "",
                            "MISPNAME": dbUserData.Erp_Qt_Request_Core['___posp_category___'] === "MISP" ? dbUserData.Erp_Qt_Request_Core['___posp_first_name___'] + " " + dbUserData.Erp_Qt_Request_Core['___posp_middle_name___'] + " " + dbUserData.Erp_Qt_Request_Core['___posp_last_name___'] : ""
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
                        writeFile(ff_name_web_path_portal, csvData, (err) => {
                            if (err) {
                                console.log(err); // Do something to handle the error or just throw it
                            }
                            console.log('Success!');
                        });
                        var Email = require('../../models/email');
                        var objModelEmail = new Email();
                        var sub = '[' + config.environment.name.toString().toUpperCase() + ']INFO-PolicyBoss.com-Policy SBI General Feed File:' + policy_number;
                        email_body = '<html><body><p>Hi,</p><BR/><p>Please find the attachment of Feed File of SBI General TW Policy.</p>'
                                + '<BR><p>Policy Number : ' + policy_number + '</p><BR><p>Policy URL : ' + ff_web_path_portal + ' </p></body></html>';
                        var arrTo = ['SACHIN.KOCHAREKAR@SBIGENERAL.IN', 'debajyoti.sinha@sbigeneral.in', 'PALLAVI.PALAV@SBIGENERAL.IN'];
                        var arrCc = ['ABHISHEK.PANDEY@SBIGENERAL.IN', 'SARNA.BHATTACHARYA@SBIGENERAL.IN'];
                        if (config.environment.name === 'Production') {
                            //objModelEmail.send('notifications@policyboss.com', arrTo.join(','), sub, email_body, arrCc.join(','), config.environment.notification_email, ''); //UAT
                        } else if (config.environment.name === 'QA') {
                            //objModelEmail.send('notifications@policyboss.com', arrTo.join(','), sub, email_body, arrCc.join(','), config.environment.notification_email, ''); //UAT
                        } else {
                            //objModelEmail.send('notifications@policyboss.com', 'atish.sonawane@Kotak.com', sub, email_body, '', '', '');
                        }
                    } catch (ex1) {
                        console.error('Exception', this.constructor.name, 'verification_response_handler_2', 'crn', dbUserData.PB_CRN, ex1.stack);
                    }
//                    options = {};
//                    pdf.create(htmlPol, options).then((pdf) => pdf.toFile(pdf_file_path));
                }
            });
            policy.pdf_status = 'SUCCESS';
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
SBIGeneralMotor.prototype.vehicle_age_year = function () {
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
SBIGeneralMotor.prototype.lv_quote_no = function () {
    try {
        return this.create_guid('', 'numeric', 7);
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'lv_quote_no', ex);
        return 0;
    }
};

SBIGeneralMotor.prototype.get_vehicle_fueltype = function (vehicle_fueltype) {
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
        return 0;
    }
    console.log('get vehicle fueltype', 'End');
};
SBIGeneralMotor.prototype.get_vehicle_bodytype = function (bodyType) {
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
        console.error('Exception', this.constructor.name, 'get_vehicle_bodytype', ex);
        return 0;
    }
    console.log('get vehicle bodytype', 'End');
};
SBIGeneralMotor.prototype.get_voluntary_deductible = function (voluntary_deduct) {
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
        return 0;
    }
    console.log('get vehicle deductible', 'End');
};
SBIGeneralMotor.prototype.new_package_rto_list = function () {
    console.log('SBIGeneralMotor new_package_rto_list', 'start');
    try {
        var rtoValues = [
            {'rto_code': 'AN'}, {'rto_code': 'AR'}, {'rto_code': 'AS'}, {'rto_code': 'KA'},
            {'rto_code': 'KL'}, {'rto_code': 'LD'}, {'rto_code': 'ML'}, {'rto_code': 'MN'},
            {'rto_code': 'MP'}, {'rto_code': 'MZ'}, {'rto_code': 'NL'}, {'rto_code': 'OD'},
            {'rto_code': 'OR'}, {'rto_code': 'PY'}, {'rto_code': 'RJ'}, {'rto_code': 'SK'},
            {'rto_code': 'TN'}, {'rto_code': 'TR'}
        ];
        var index = rtoValues.findIndex(x => x.rto_code === this.lm_request['registration_no_1']);
        if (index > -1) {
            return true;
        } else {
            return false;
        }
    } catch (ex) {
        console.error('Exception', this.constructor.name, 'new_package_rto_list', ex);
    }
    console.log('SBIGeneralMotor new_package_rto_list', 'End');
};
SBIGeneralMotor.prototype.premium_breakup_schema = {

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
        "addon_final_premium": 0
    },
    "net_premium": "totalNetPremium",
    "service_tax": "service_tax",
    "final_premium": "final_premium"
};
module.exports = SBIGeneralMotor;