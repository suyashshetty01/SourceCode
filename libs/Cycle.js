/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var util = require('util');
var Base = require('../libs/Base');
var moment = require('moment');
var config = require('config');
var MongoClient = require('mongodb').MongoClient;
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var fs = require('fs');
var mongojs = require('mongojs');
var myDb = mongojs(config.db.connection + ':27017/' + config.db.name);
var Paddle_Cycles = require('../models/paddle_cycles');
function Cycle() {

}
util.inherits(Cycle, Base);
//Cycle.prototype.__proto__ = Base.prototype;
Cycle.prototype.product_field_list = [];
Cycle.prototype.common_addon_list = [];
Cycle.prototype.const_idv_breakup = {
    "Idv_Normal": null,
    "Idv_Min": null,
    "Idv_Max": null,
    "Exshowroom": null
};
Cycle.prototype.const_premium_breakup = {
    "net_premium": 0,
    "service_tax": 0,
    "final_premium": 0
};
Cycle.prototype.const_premium_master = {
    "basic_premium": 0,
    "pa_cover_premium": 0
};
Cycle.prototype.const_premium_rate = {
    "basic_premium": 0,
    "pa_cover_premium": 0
};
Cycle.prototype.const_addon_master = {
    "addon_zero_dep_cover": 0,
    "addon_road_assist_cover": 0,
    "addon_ncb_protection_cover": 0,
    "addon_engine_protector_cover": 0,
    "addon_invoice_price_cover": 0,
    "addon_key_lock_cover": 0,
    "addon_consumable_cover": 0,
    "addon_daily_allowance_cover": 0,
    "addon_windshield_cover": 0,
    "addon_passenger_assistance_cover": 0,
    "addon_tyre_coverage_cover": 0,
    "addon_personal_belonging_loss_cover": 0,
    "addon_inconvenience_allowance_cover": 0,
    "addon_medical_expense_cover": 0,
    "addon_hospital_cash_cover": 0,
    "addon_ambulance_charge_cover": 0,
    "addon_rodent_bite_cover": 0,
    "addon_losstime_protection_cover": 0,
    "addon_hydrostatic_lock_cover": 0,
    "addon_guaranteed_auto_protection_cover": 0
};
Cycle.prototype.product_api_pre = function () {
    console.log(this.constructor.name + '::' + 'product_api_pre' + '::Start');
    var objLMRequest = this.lm_request;
    if (objLMRequest['vehicle_insurance_subtype'] === 'individual') {
        if (objLMRequest['pa_owner_driver_si'] === '') {
            objLMRequest['pa_owner_driver_si'] = 1500000;
        }
    }
    if (this.lm_request['method_type'] === 'Premium') {
        if ((objLMRequest['crn'] - 0) === 0) {
        }
    }
    if (objLMRequest.hasOwnProperty('gst_no')) {
        if (objLMRequest['gst_no'] !== '') {
            var state_code = objLMRequest['gst_no'].substring(0, 2);
            var obj_gst_state = {
                '01': 'JAMMU & KASHMIR',
                '02': 'HIMACHAL PRADESH',
                '03': 'PUNJAB',
                '04': 'CHANDIGARH',
                '05': 'UTTARAKHAND',
                '06': 'HARYANA',
                '07': 'DELHI',
                '08': 'RAJASTHAN',
                '09': 'UTTAR PRADESH',
                '10': 'BIHAR',
                '11': 'SIKKIM',
                '12': 'ARUNACHAL PRADESH',
                '13': 'NAGALAND',
                '14': 'MANIPUR',
                '15': 'MIZORAM',
                '16': 'TRIPURA',
                '17': 'MEGHLAYA',
                '18': 'ASSAM',
                '19': 'WEST BENGAL',
                '20': 'JHARKHAND',
                '21': 'ODISHA',
                '22': 'CHHATTISGARH',
                '23': 'MADHYA PRADESH',
                '24': 'GUJARAT',
                '25': 'DAMAN AND DIU',
                '26': 'DADRA AND NAGAR HAVELI',
                '27': 'MAHARASHTRA',
                '28': 'ANDHRA PRADESH',
                '29': 'KARNATAKA',
                '30': 'GOA',
                '31': 'LAKSHWADEEP',
                '32': 'KERALA',
                '33': 'TAMIL NADU',
                '34': 'PUDUCHERRY',
                '35': 'ANDAMAN & NICOBAR ISLANDS',
                '36': 'TELANGANA'
            };
            var state = obj_gst_state[state_code];
            objLMRequest['gst_state'] = state;
        }
    }
    var objLMRequest = objLMRequest;
    Paddle_Cycles.findOne({"Vehicle_ID": parseInt(objLMRequest['vehicle_id'])}, function (err, vehicle_data) {
        try {
            var res = vehicle_data['_doc'];
            if (err)
                throw err;
           objLMRequest['Cycle_Vehicle_ID'] = res['Vehicle_ID'];
           objLMRequest['Cycle_Make_Name'] = res['Make_Name'];
           objLMRequest['Cycle_Make_Code'] = res['Make_Code'];
           objLMRequest['Cycle_Model_Name'] = res['Model_Name'];
           objLMRequest['Cycle_Model_Code'] = res['Model_Code'];
           objLMRequest['Cycle_Vehicle_Price'] = res['Vehicle_Price'];
            //res.json(vehicle_data['_doc']);
        } catch (e) {
            console.log("Paddle_Cycles_details", e);
            //res.json(e);
        }
    });
    this.lm_request = objLMRequest;
    console.log(this.constructor.name + '::' + 'product_api_pre' + '::Finish');
};

Cycle.prototype.product_field_process_pre = function () {

};
Cycle.prototype.product_response_handler = function (objResponseJson, objProduct, objInsurerProduct, Insurer_Object, specific_insurer_object) {
    console.log('Start', this.constructor.name, 'product_response_handler');
    try {
        var objProductResponse = objInsurerProduct.insurer_product_response_handler(objResponseJson, objProduct, Insurer_Object, specific_insurer_object);
        if (objProductResponse.Error_Msg === 'NO_ERR') {
            if (specific_insurer_object.method.Method_Type === 'Premium') {
                var basic = objProductResponse.Premium_Breakup.basic_premium - 0;
                if (basic < 0) {
                        objProductResponse.Error_Msg = 'LM_MSG::INSURER_BASIC_PREMIUM_ZERO';
                    }
            }
        }

        if (objProductResponse.Error_Msg === 'NO_ERR') {
            if (specific_insurer_object.method.Method_Type === 'Premium') {
                //process premium rates
                var Premium_Rate = this.get_const_rate_breakup();
                Premium_Rate.basic_premium = this.round2Precision(objProductResponse.Premium_Breakup.basic_premium);
                Premium_Rate.pa_cover_premium = this.round2Precision(objProductResponse.Premium_Breakup.pa_cover_premium);
                objProductResponse.Premium_Rate = Premium_Rate;
                //process for premium mastet
                DbCollectionName = 'motor_premiums_idvs';
                var Premium_Breakup = this.const_premium_master;
                for (var key  in this.const_premium_master) {
                    if (typeof this.const_premium_master[key] === 'object') {
                            Premium_Breakup[key] = objProductResponse.Premium_Breakup[key];
                    }
                }

                Premium_Breakup['net_premium'] = Premium_Breakup['basic_premium'] + Premium_Breakup['pa_cover_premium'];
                Premium_Breakup['service_tax'] = Premium_Breakup['net_premium'] * 0.18;
                Premium_Breakup['final_premium'] = Premium_Breakup['net_premium'] + Premium_Breakup['service_tax'];
                //var Addon = objProductResponse.Premium_Breakup['addon'];
                //var addon_final_premium = Addon['addon_final_premium'];
                //delete Addon['addon_final_premium'];
                var SearchCriteria = {
                    "Insurer_Id": parseInt(specific_insurer_object['insurer_id']),
                    "Vehicle_Id": parseInt(objInsurerProduct.lm_request['vehicle_id']),
                    //"Rto_Id": parseInt(objInsurerProduct.lm_request['rto_id']),
                    "Vehicle_Age_Month": objInsurerProduct.vehicle_age_month(),
                    "Vehicle_Age_Slab": objInsurerProduct.vehicle_age_slab_month()
                };
                /*var Search_Criteria = {
                 "Insurer_Id": parseInt(specific_insurer_object['insurer_id']),
                 "PB_CRN": parseInt(objInsurerProduct.lm_request['crn'])
                 };*/
                var ObjDocument = {
                    "Premium_Breakup": Premium_Breakup,
                    //"Addon": Addon,
                    "Premium_Rate": Premium_Rate
                };
                this.save_to_db(DbCollectionName, {$set: ObjDocument}, SearchCriteria);
                //Object.assign(Addon, {'addon_final_premium': addon_final_premium});

            }/*
            if (specific_insurer_object.method.Method_Type === 'Coverage') {
                DbCollectionName = 'motor_premiums_idvs';
                var SearchCriteria = {
                    "Insurer_Id": parseInt(specific_insurer_object['insurer_id']),
                    "Vehicle_Id": parseInt(objInsurerProduct.lm_request['vehicle_id']),
                    "Rto_Id": parseInt(objInsurerProduct.lm_request['rto_id']),
                    "Vehicle_Age_Month": objInsurerProduct.vehicle_age_month()
                };
                var Search_Criteria = {
                 "Insurer_Id": parseInt(specific_insurer_object['insurer_id']),
                 "PB_CRN": parseInt(objInsurerProduct.lm_request['crn'])
                 };

                var ObjDocument = {
                    "Coverage": objProductResponse.Coverage
                };
                this.save_to_db(DbCollectionName, {$set: ObjDocument}, SearchCriteria);
            }*/
        }
        console.log('Finish', this.constructor.name, 'product_response_handler');
        return objProductResponse;
    } catch (e) {
        console.error('Exception', e);
    }

};
Cycle.prototype.product_field_process_post = function () {

};
Cycle.prototype.product_api_post = function () {

};
Cycle.prototype.Cycle_pb_crn_create = function (lm_request, client_id, request_unique_id, user_data_id) {
    try {
        var moment = require('moment');
        var crn_data = {
            "product_id": "13",
            "customer_name": lm_request.customer_name,
            "company_name": "Digit",
            "city_id": lm_request.city_id,
            "policy_type": lm_request.policy_type,
            "mobile": lm_request.mobile,
            "email": lm_request.email,
            "city_name": lm_request.city_name,
            "type_of_cargo": "ABC",
            "sum_insured": 500000,
            "mode_of_transit": "Air",
            "transit_From": "Mumbai",
            "transit_To": "Pune",
            "transit_Start_Date": "10/11/2019",
            "transit_End_Date": "10/11/2019",
            "ExistingCustomerReferenceID": (lm_request.hasOwnProperty('crn') && lm_request['crn'] !== '') ? lm_request['crn'] : 0
        };
        var args = {
            data: crn_data,
            headers: {
                "Content-Type": "application/json",
                'Username': config.pb_config.api_crn_user,
                'Password': config.pb_config.api_crn_pass
            }
        };
        var Client = require('node-rest-client').Client;
        var client = new Client();
        //console.log('args', args);

        var StartDate = moment(new Date());
        client.post(config.pb_config.api_marine_crn_url, args, function (data, response) {
            console.log(data);
            var EndDate = moment(new Date());
            var Call_Execution_Time = EndDate.diff(StartDate);
            Call_Execution_Time = Math.round((Call_Execution_Time * 0.001) * 100) / 100;
            var is_email = false;
            if (data > 0) {
                if (Call_Execution_Time > 1.5)
                {
                    is_email = true;
                }
                var Request = require('../models/request');
                Request.findOne({"Request_Unique_Id": request_unique_id}, function (err, dbRequest) {
                    if (err) {
                        console.log("CRN error");
                        console.log(err);
                    } else {
                        if (dbRequest) {
                            var ObjRequest = {'PB_CRN': data};
                            var Request = require('../models/request');
                            Request.update({'Request_Id': dbRequest._doc['Request_Id']}, ObjRequest, function (err, numAffected) {
                                console.log('RequestCRNUpdate', err, numAffected);
                            });
                        }
                    }
                });
                var ObjUser_Data = {'PB_CRN': data};
                var User_Data = require('../models/user_data');
                User_Data.update({'User_Data_Id': user_data_id}, {$set: ObjUser_Data}, function (err, numAffected) {
                    console.log('UserDataCRNUpdate', err, numAffected);
                });
            } else {
                is_email = true;
            }
            is_email = false;
            if (is_email)
            {
                //console.error("PB_CRN_LOG", crn_data, data);

                var sub = '[' + config.environment.name.toString().toUpperCase() + '-' + ((data > 0) ? 'INFO' : 'ERR') + '][HEALTH]CRN_';
                sub += (lm_request.hasOwnProperty('crn') && (lm_request['crn'] - 0) > 0) ? 'UPDATE' : 'CREATE';
                sub += '::Exec_Time-' + Call_Execution_Time + '_SEC';
                var msg = '<!DOCTYPE html><html><head><title>Proposal Report</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';

                msg += '<div class="report"><span  style="font-family:tahoma;font-size:18px;">CRN&nbsp;Request</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
                msg += '<tr><td  width="78%" style="font-family:tahoma;font-size:14px;"><pre>' + JSON.stringify(crn_data, undefined, 2) + '</pre></td></tr>';

                msg += '</table></div><br><br>';
                msg += '<div class="report"><span  style="font-family:tahoma;font-size:18px;">CRN&nbsp;Response</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
                msg += '<tr><td  width="78%" style="font-family:tahoma;font-size:14px;"><pre>' + JSON.stringify(data, undefined, 2) + '</pre></td></tr>';

                msg += '</table></div>';
                msg += '</body></html>';

                var Email = require('../models/email');
                var objModelEmail = new Email();
                objModelEmail.send('noreply@landmarkinsurance.co.in', 'horizon.lm.notification@gmail.com', sub, msg, '', '');
            }
        });
    } catch (e) {
        console.error('Pedal_Cycle_pb_crn_create', e);
    }
};

Cycle.prototype.vehicle_ncb_next = function () {
    console.log(this.constructor.name, 'vehicle_ncb_next', 'Start');
    var vehicle_ncb_next_val = '0';
    if (this.lm_request['vehicle_insurance_type'] === 'renew') {
        if (this.lm_request.hasOwnProperty('is_claim_exists')) {
            if (this.lm_request['is_claim_exists'] === 'yes') {
                vehicle_ncb_next_val = '0';
            } else {
                var current_ncb = this.lm_request['vehicle_ncb_current'];
                var ncb_slab = ["0", "20", "25", "35", "45", "50"];
                var current_ncb_index = ncb_slab.indexOf(current_ncb);
                var next_ncb_index = (current_ncb_index === (ncb_slab.length - 1)) ? current_ncb_index : (current_ncb_index + 1);
                console.log(this.constructor.name, 'vehicle_ncb_next', 'Finish');
                vehicle_ncb_next_val = ncb_slab[next_ncb_index];
            }

            var days_diff = moment(this.todayDate()).diff(this.lm_request['policy_expiry_date'], 'days');
            //for expired case
            if (days_diff > 90) {
                vehicle_ncb_next_val = '0';
            }
        }
    }
    console.log(this.constructor.name, 'vehicle_ncb_next', 'Finish');
    return vehicle_ncb_next_val;
};
Cycle.prototype.policy_start_date = function () {
    console.log(this.constructor.name, 'policy_start_date', 'Start');
    var pol_start_date = new Date();
    if (this.lm_request['vehicle_insurance_type'] === 'new') {

    }
    if (this.lm_request['vehicle_insurance_type'] === 'renew') {
        if (this.lm_request['is_policy_exist'] === 'no') {
            var d = new Date();
            d.setDate(d.getDate() - 90);
            var month = '' + (d.getMonth() + 1);
            var day = '' + d.getDate();
            var year = d.getFullYear();
            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            this.lm_request['policy_expiry_date'] = [year, month, day].join('-');
        }
        var days_diff = moment(this.todayDate()).diff(this.lm_request['policy_expiry_date'], 'days');
        //for expired case
        if (days_diff > 0) {
            var today_date = new Date(this.todayDate());
            pol_start_date.setDate(today_date.getDate() + 1);
        } else { // for not expired case
            var expiry_date = new Date(this.lm_request['policy_expiry_date']);
            var pol_start_date = expiry_date;
            pol_start_date.setDate(expiry_date.getDate() + 1);
        }
    }
    pol_start_date = this.date_format(pol_start_date, 'yyyy-MM-dd');
    console.log(this.constructor.name, 'policy_start_date', 'Finish', pol_start_date);
    return pol_start_date;
};
Cycle.prototype.policy_end_date_extended = function () {
    console.log('Start', this.constructor.name, 'policy_end_date');
    var pol_end_date = new Date();
    var policy_tenure = 1;
    if (this.lm_request.hasOwnProperty('policy_tenure') && (this.lm_request['policy_tenure'] - 0) > 0) {
        policy_tenure = (this.lm_request['policy_tenure'] - 0);
    }
    if (this.lm_request['vehicle_insurance_type'] === 'new') {
        pol_end_date.setDate(pol_end_date.getDate() - 1);
        pol_end_date.setFullYear(pol_end_date.getFullYear() + policy_tenure);
    }
    if (this.lm_request['vehicle_insurance_type'] === 'renew') {
        var days_diff = moment(this.todayDate()).diff(this.lm_request['policy_expiry_date'], 'days');
        //for expired case
        if (days_diff > 0) {
            var today_date = new Date(this.todayDate());
            //pol_end_date.setDate(today_date.getDate() + 1);
            pol_end_date.setFullYear(today_date.getFullYear() + policy_tenure);
        } else { // for not expired case
            var expiry_date = new Date(this.lm_request['policy_expiry_date']);
            var pol_end_date = expiry_date;
            pol_end_date.setFullYear(expiry_date.getFullYear() + policy_tenure);
        }
    }
    pol_end_date = this.date_format(pol_end_date, 'yyyy-MM-dd');
    console.log('Finish', this.constructor.name, 'policy_end_date', pol_end_date);
    return pol_end_date;
};
Cycle.prototype.policy_end_date = function () {
    console.log('Start', this.constructor.name, 'policy_end_date');
    var pol_end_date = new Date();
    var policy_tenure = 1;
    if (this.lm_request['vehicle_insurance_type'] === 'new') {
        pol_end_date.setDate(pol_end_date.getDate() - 1);
        pol_end_date.setFullYear(pol_end_date.getFullYear() + policy_tenure);
    }
    if (this.lm_request['vehicle_insurance_type'] === 'renew') {
        var days_diff = moment(this.todayDate()).diff(this.lm_request['policy_expiry_date'], 'days');
        //for expired case
        if (days_diff > 0) {
            var today_date = new Date(this.todayDate());
            //pol_end_date.setDate(today_date.getDate() + 1);
            pol_end_date.setFullYear(today_date.getFullYear() + policy_tenure);
        } else { // for not expired case
            var expiry_date = new Date(this.lm_request['policy_expiry_date']);
            var pol_end_date = expiry_date;
            pol_end_date.setFullYear(expiry_date.getFullYear() + policy_tenure);
        }
    }
    pol_end_date = this.date_format(pol_end_date, 'yyyy-MM-dd');
    console.log('Finish', this.constructor.name, 'policy_end_date', pol_end_date);
    return pol_end_date;
};
Cycle.prototype.pre_policy_start_date = function () {
    console.log(this.constructor.name, 'pre_policy_start_date', 'Start');
    var pre_pol_start_date;
    if (this.lm_request['vehicle_insurance_type'] === 'new') {
        pre_pol_start_date = '';
    }
    console.log(this.constructor.name, 'pre_policy_start_date', 'Finish', pre_pol_start_date);
    return pre_pol_start_date;
};
Cycle.prototype.vehicle_age_year = function () {
    console.log('Start', this.constructor.name, 'vehicle_age_year');
    var vehicle_manf_date = this.lm_request['vehicle_manf_date'];
    var policy_start_date = this.policy_start_date();
    var age_in_year = moment(policy_start_date).diff(vehicle_manf_date, 'years');
    console.log('Finish', this.constructor.name, 'vehicle_age_year', age_in_year);
    return age_in_year;
};
Cycle.prototype.vehicle_age_month = function () {
    console.log('Start', this.constructor.name, 'pre_policy_start_date');
    var vehicle_manf_date = this.lm_request['vehicle_manf_date'];
    var policy_start_date = this.policy_start_date();
    var age_in_month = moment(policy_start_date).diff(vehicle_manf_date, 'months');
    console.log('Finish', this.constructor.name, 'vehicle_age_month', age_in_month);
    return age_in_month;
};
Cycle.prototype.vehicle_manf_year = function () {
    console.log('Start', this.constructor.name, 'vehicle_manf_year');
    var vehicle_manf_date = this.lm_request['vehicle_manf_date'];
    var manf_year = this.date_format(vehicle_manf_date, 'yyyy');
    console.log('Finish', this.constructor.name, 'vehicle_manf_year', manf_year);
    return manf_year;
};
Cycle.prototype.vehicle_age_slab_month = function () {
    console.log('Start', this.constructor.name, 'vehicle_age_slab_month');
    var age_in_month = this.vehicle_age_month();
    var Const_Vehicle_Age_Slab = {
        'Month_3': 3,
        'Month_6': 6,
        'Month_9': 9,
        'Month_12': 12,
        'Month_18': 18,
        'Month_24': 24,
        'Month_30': 30,
        'Month_36': 36,
        'Month_42': 42,
        'Month_48': 48,
        'Month_54': 54,
        'Month_60': 60,
        'Month_72': 72,
        'Month_84': 84,
        'Month_96': 96,
        'Month_108': 108,
        'Month_120': 120,
        'Month_132': 132,
        'Month_144': 144,
        'Month_156': 156,
        'Month_168': 168,
        'Month_180': 180
    };
    var age_slab = 0;
    for (var key in Const_Vehicle_Age_Slab) {
        if (Const_Vehicle_Age_Slab[key] < age_in_month) {
            age_slab = Const_Vehicle_Age_Slab[key];
        } else {
            break;
        }
    }
    console.log('Finish', this.constructor.name, 'vehicle_age_slab_month', age_slab);
    return age_slab;
};
Cycle.prototype.get_const_premium_breakup = function () {
    console.log('Start', this.constructor.name, 'get_const_premium_breakup');
    var premium_breakup = this.const_premium_breakup;
    for (var key in premium_breakup) {
        if (typeof premium_breakup[key] === 'object') {
            for (var sub_key in premium_breakup[key]) {
                premium_breakup[key][sub_key] = 0;
            }
        } else {
            premium_breakup[key] = 0;
        }
    }
    return premium_breakup;
};
Cycle.prototype.get_const_rate_breakup = function () {
    console.log('Start', this.constructor.name, 'get_const_rate_breakup');
    var rate_breakup = this.const_premium_rate;
    for (var key in rate_breakup) {
        if (typeof rate_breakup[key] === 'object') {
            for (var sub_key in rate_breakup[key]) {
                rate_breakup[key][sub_key] = 0;
            }
        } else {
            rate_breakup[key] = 0;
        }
    }
    return rate_breakup;
};
Cycle.prototype.Cycle_report_handler = function (objMaster) {
    console.log('Start', this.constructor.name, 'Cycle_report_handler');
    try {
        var objCycle = this;
        var objReportFull = [];
        var objReportInvalid = [];
        var is_all_master_processed = false;
        for (var k in objMaster) {
            if (objMaster[k]) {
                is_all_master_processed = true;
            } else {
                is_all_master_processed = false;
                break;
            }
        }
        if (is_all_master_processed === true) {
            //console.log(objMaster.rtos);
            var user_data = require('../models/user_data');
            var today = moment().utcOffset("+05:30").startOf('Day');
            var tomorrow = moment(today).add(1, 'days');
            var yesterday = moment(today).add(-1, 'days');
            var week = moment(today).add(-7, 'days');
            var month = moment(today).add(-30, 'days');
            user_data.find({
                'Product_Id': {$in: [1, 10]},
                "Created_On": {$gt: week.toDate()},
                "Report_Summary": null
            }).exec(function (err, dbUsers) {
                if (!err) {
                    var objSingleReport = {
                        'client': null,
                        'agent': null,
                        'executive': null,
                        'agent_city': null,
                        'product': null,
                        'vehicle_make': null,
                        'vehicle_model': null,
                        'vehicle_full': null,
                        'cc': null,
                        'fuel': null,
                        'rto_code': null,
                        'zone': null,
                        'rto_state': null,
                        'existing_insurer': null,
                        'vehicle_age_month': null,
                        'vehicle_age_year': null,
                        'claim': null,
                        'ncb': null,
                        'ins_type': null
                    };
                    var objProduct = {
                        'prod_1': 'Car',
                        'prod_10': 'TW'
                    };
                    for (var k in dbUsers) {
                        try {
                            user = dbUsers[k]._doc;
                            var Premium_Request = dbUsers[k]._doc['Premium_Request'];
                            objCycle.lm_request = Premium_Request;
                            var indClient = objMaster.clients['client_' + Premium_Request.secret_key];
                            var indVeh = objMaster.vehicles['veh_' + Premium_Request.vehicle_id];
                            var indRto = objMaster.rtos['rto_' + Premium_Request.rto_id];
                            var indInsurer = null;
                            if (Premium_Request.hasOwnProperty('prev_insurer_id') && Premium_Request.prev_insurer_id > 0) {
                                indInsurer = objMaster.insurers['ins_' + Premium_Request.prev_insurer_id];
                            }
                            var cc_slab = '';
                            if (Premium_Request.product_id === 1) {
                                if ((indVeh['Cubic_Capacity'] - 0) < 1000) {
                                    cc_slab = 'Less_than_1000cc';
                                }
                                if ((indVeh['Cubic_Capacity'] - 0) >= 1000 && (indVeh['Cubic_Capacity'] - 0) < 1500) {
                                    cc_slab = '1000cc_to_1500cc';
                                }
                                if ((indVeh['Cubic_Capacity'] - 0) >= 1500) {
                                    cc_slab = 'More_than_1500cc';
                                }
                            }
                            if (Premium_Request.product_id === 10) {
                                if ((indVeh['Cubic_Capacity'] - 0) < 150) {
                                    cc_slab = 'Less_than_150cc';
                                }
                                if ((indVeh['Cubic_Capacity'] - 0) >= 150 && (indVeh['Cubic_Capacity'] - 0) < 350) {
                                    cc_slab = '150_to_350cc';
                                }
                                if ((indVeh['Cubic_Capacity'] - 0) >= 350) {
                                    cc_slab = 'More_than_350cc';
                                }
                            }

                            var expiry_slab = '';
                            var objSingleReport = {
                                'srn': user['Request_Unique_Id'],
                                'client': indClient['Client_Name'],
                                'agent': (indClient['Client_Id'] === 3) ? Premium_Request.posp_first_name + ' ' + Premium_Request.posp_last_name : '',
                                'executive': (indClient['Client_Id'] === 3) ? Premium_Request.posp_reporting_agent_name : '',
                                'agent_city': (indClient['Client_Id'] === 3) ? Premium_Request.posp_agent_city : '',
                                'product': objProduct['prod_' + Premium_Request['product_id']],
                                'vehicle_make': indVeh['Make_Name'],
                                'vehicle_model': indVeh['Model_Name'],
                                'vehicle_full': indVeh['Make_Name'] + '::' + indVeh['Model_Name'] + '::' + indVeh['Variant_Name'],
                                'cc': indVeh['Cubic_Capacity'],
                                'cc_slab': cc_slab,
                                'fuel': indVeh['Fuel_Name'],
                                'rto_code': indRto['VehicleCity_RTOCode'],
                                'zone': indRto['VehicleCity_RTOCode'],
                                'rto_city': indRto['RTO_City'],
                                'rto_state': indRto['VehicleCity_RTOCode'].toString().substr(0, 2),
                                'existing_insurer': (indInsurer) ? indInsurer['Insurer_Code'] : '',
                                'vehicle_age_month': objCycle.vehicle_age_month(),
                                'vehicle_age_slab_month': objCycle.vehicle_age_slab_month(),
                                'vehicle_age_year': objCycle.vehicle_age_year(),
                                'expiry_slab': '',
                                'expiry': Premium_Request['vehicle_expiry_date'],
                                'claim': Premium_Request['is_claim_exists'],
                                'ncb': Premium_Request['vehicle_ncb_current'],
                                'ins_type': Premium_Request['vehicle_insurance_type']
                            };
                            var ObjUser_Data = {
                                'Report_Summary': objSingleReport
                            };
                            var User_Data = require('../models/user_data');
                            User_Data.update({'User_Data_Id': user['User_Data_Id']}, ObjUser_Data, function (err, numAffected) {
                                console.log('UserDataCRNUpdate', err, numAffected);
                            });
                            objReportFull.push(objSingleReport);
                        } catch (ex1) {
                            objReportInvalid.push(Premium_Request);
                            console.error("Exception", 'loop', ex1);
                        }
                    }
                    //console.error(objReportInvalid);
                    console.log('DataCount', objReportFull.length);
                    console.log('Invalid', objReportInvalid.length);
                    objCycle.response.json(objReportFull);
                }
            });
        }
        console.log("Finish", this.constructor.name, 'Cycle_report_handler');
    } catch (ex) {
        console.error("Exception", this.constructor.name, 'Cycle_report_handler', ex);
    }
    console.log("Finish", this.constructor.name, 'Cycle_report_handler');
};
Cycle.prototype.Cycle_tariff_rate = function (processed_request) {
    try {
        console.log('Start', this.constructor.name, 'Cycle_tariff_rate', processed_request);
        var vehicle_age = processed_request['___vehicle_age_year___'];
        var zone_code = processed_request['___dbmaster_insurer_rto_zone_code___'];
        var idv = parseInt(processed_request['___vehicle_expected_idv___']);
        var cubic_capacity = parseInt(processed_request['___dbmaster_insurer_vehicle_cubiccapacity___']);
        var product_id = processed_request['___product_id___'];
        var vehicle_age_slab = 0;
        var arr_age = [5, 10, 15];
        for (var k in arr_age) {
            if (vehicle_age < arr_age[k]) {
                vehicle_age_slab = arr_age[k];
                break;
            }
        }
        var vehicle_cc_slab = 0;
        var arr_cc = [150, 350, 2000];
        for (var k in arr_cc) {
            if (cubic_capacity < arr_cc[k]) {
                vehicle_cc_slab = arr_cc[k];
                break;
            }
        }
        var obj_Cycle_tariff_rate = {
            'Product_10': {
                'Age_5': {
                    'Zone_A': {
                        'Cc_150': 1.708,
                        'Cc_350': 1.793,
                        'Cc_2000': 1.879
                    },
                    'Zone_B': {
                        'Cc_150': 1.676,
                        'Cc_350': 1.760,
                        'Cc_2000': 1.844
                    }
                },
                'Age_10': {'Zone_A': {
                        'Cc_150': 1.793,
                        'Cc_350': 1.883,
                        'Cc_2000': 1.973
                    },
                    'Zone_B': {
                        'Cc_150': 1.760,
                        'Cc_350': 1.848,
                        'Cc_2000': 1.936
                    }},
                'Age_15': {'Zone_A': {
                        'Cc_150': 1.836,
                        'Cc_350': 1.928,
                        'Cc_2000': 2.020
                    },
                    'Zone_B': {
                        'Cc_150': 1.802,
                        'Cc_350': 1.892,
                        'Cc_2000': 1.982
                    }}
            },
            'Product_1': {

            }
        };
        var Cycle_tariff_rate = obj_Cycle_tariff_rate['Product_' + product_id]['Age_' + vehicle_age_slab]['Zone_' + zone_code]['Cc_' + vehicle_cc_slab];
        return Cycle_tariff_rate;
    } catch (e) {
        console.error('Exception', this.constructor.name, 'Cycle_tariff_rate', e);
    }

    console.log("Finish", this.constructor.name, 'Cycle_tariff_rate', processed_request);
};
Cycle.prototype.premium_list_db = function (dbRequestItem, request_unique_id = '', client_id = 0, response_version = '1.0') {
    console.log(this.constructor.name, 'premium_list', 'Start');
    var objCycle = this;
    if (request_unique_id) {
        objCycle.client_id = client_id;
        objCycle.request_unique_id = request_unique_id;
    }
    var Combine_Data = {
        'Request': null,
        'Log': null,
        'Idv': null,
        'Insurer': null,
        'User_Data': null
    };
    var moment = require('moment');
    var StartDateRequest = moment(new Date()), StartDateLog = moment(new Date()), StartDateIdv = moment(new Date()), StartDateInsurer = moment(new Date()), StartDateUser_Data = moment(new Date());
    var Combine_Time = {
        'Request': {'Time': 0},
        'Log': {'Time': 0},
        'Idv': {'Time': 0},
        'Insurer': {'Time': 0},
        'User_Data': {'Time': 0}
    };
    //find method field
    var User_Data = require('../models/user_data');
    User_Data.findOne({"User_Data_Id": objCycle.udid - 0}, function (err, dbUserData) {
        if (err) {

        } else {
            if (dbUserData) {
                var EndDateUser_Data = moment(new Date());
                var Call_Execution_Time_User_Data = EndDateUser_Data.diff(StartDateUser_Data);
                Call_Execution_Time_User_Data = Math.round((Call_Execution_Time_User_Data * 0.001) * 100) / 100;
                Combine_Time.User_Data.Time = Call_Execution_Time_User_Data;
                Combine_Data.User_Data = dbUserData;
                objCycle.premium_list_db_handler(Combine_Data, response_version, Combine_Time);
            }
        }
    });
    //find method field
    if (dbRequestItem) {
        Combine_Data.Request = dbRequestItem;
        var dbCollPremiums = myDb.collection('Cycle_premiums_idvs');
        /*var Search_Criteria = {
         "User_Data_Id": objCycle.udid - 0
         };*/
        var Search_Criteria = {'Vehicle_Id': dbRequestItem.Request_Product.vehicle_id, 'Rto_Id': dbRequestItem.Request_Product.rto_id, 'Vehicle_Age_Month': dbRequestItem.Request_Product.vehicle_age_month};
        dbCollPremiums.find(Search_Criteria).toArray(function (err, dbIdvItems) {
            if (err) {
                return console.dir(err);
            }
            var EndDateIdv = moment(new Date());
            var Call_Execution_Time_Idv = EndDateIdv.diff(StartDateIdv);
            Call_Execution_Time_Idv = Math.round((Call_Execution_Time_Idv * 0.001) * 100) / 100;
            Combine_Time.Idv.Time = Call_Execution_Time_Idv;
            Combine_Data.Idv = dbIdvItems;
            objCycle.premium_list_db_handler(Combine_Data, response_version, Combine_Time);
        });
        var dbCollLog = myDb.collection('service_logs');
        var cond_service_logs = {'Request_Id': dbRequestItem.Request_Id};
        if (response_version === '1.0') {
            cond_service_logs = {'Request_Unique_Id': dbRequestItem.Request_Unique_Id};
        }
        dbCollLog.find(cond_service_logs).toArray(function (err, dbLogItems) {
            if (err) {
                return console.dir(err);
            }
            var EndDateLog = moment(new Date());
            var Call_Execution_Time_Log = EndDateLog.diff(StartDateLog);
            Call_Execution_Time_Log = Math.round((Call_Execution_Time_Log * 0.001) * 100) / 100;
            Combine_Time.Log.Time = Call_Execution_Time_Log;
            Combine_Data.Log = dbLogItems;
            objCycle.premium_list_db_handler(Combine_Data, response_version, Combine_Time);
        });
        let cache_key = 'live_insurer';
        if (fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
            let cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
            let obj_cache_content = JSON.parse(cache_content);
            Combine_Data.Insurer = obj_cache_content;
            objCycle.premium_list_db_handler(Combine_Data, response_version, Combine_Time);
        } else {
            var dbCollInsurer = myDb.collection('insurers');
            dbCollInsurer.find().toArray(function (err, dbInsurerItems) {
                if (err) {
                    return console.dir(err);
                }
                let InsurerMaster = {};
                for (var k in dbInsurerItems) {
                    InsurerMaster['Insurer_' + dbInsurerItems[k]['Insurer_ID']] = dbInsurerItems[k];
                }
                let EndDateInsurer = moment(new Date());
                let Call_Execution_Time_Insurer = EndDateInsurer.diff(StartDateInsurer);
                Call_Execution_Time_Insurer = Math.round((Call_Execution_Time_Insurer * 0.001) * 100) / 100;
                Combine_Time.Insurer.Time = Call_Execution_Time_Insurer;
                fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(InsurerMaster), function (err) {
                    if (err) {
                        return console.error(err);
                    }
                });
                Combine_Data.Insurer = InsurerMaster;
                objCycle.premium_list_db_handler(Combine_Data, response_version, Combine_Time);
            });
        }
    }
    console.log(this.constructor.name, 'premium_list', 'Finish');
};
Cycle.prototype.premium_list_db_handler = function (Db_Data_Object, response_version = '1.0', Combine_Time) {
    console.log('Start', 'premium_list_db_handler');
    if (Db_Data_Object.Request && Db_Data_Object.Log && Db_Data_Object.Idv && Db_Data_Object.Insurer && Db_Data_Object.User_Data) {
//console.error('Log', 'PremiumListDBG', Combine_Time);
        if (response_version === '1.0') {
            this.premium_list_db_handler_version_1(Db_Data_Object);
        }
        if (response_version === '2.0') {
            this.premium_list_db_handler_version_2(Db_Data_Object);
        }
    }
    console.log('Start', 'premium_list_db_handler');
};
Cycle.prototype.premium_list_db_handler_version_1 = function (Db_Data_Object) {
    console.log('Start', 'premium_list_db_handler');
    var objCycle = this;
    var arr_premium_response = {
        'Summary': null,
        'Response': []
    };
    arr_premium_response.Summary = Db_Data_Object.Request;
    var actual_time = 0;
    var dbLogItems = Db_Data_Object.Log;
    var Arr_Idv_Min = [], Arr_Idv_Max = [];
    var Common_Addon_List = {};
    var Response_Type = 'QUOTE';
    if (Db_Data_Object.Request.Client_Id === 4) {
        Response_Type = 'QUOTE';
    } else {
        Response_Type = 'FULL';
    }
    var inc = 0;
    for (var k in dbLogItems) {
        if (Db_Data_Object.Request.Client_Id === 5 && dbLogItems[k]['Method_Type'] !== 'Premium') {
            continue;
        }
        if (dbLogItems[k]['Status'] !== 'complete') {
            continue;
        }
        if (dbLogItems[k]['Error_Code'] !== "" && Response_Type === 'QUOTE') {
            continue;
        } else {
            console.log('Prem', dbLogItems[k]['Error_Code']);
        }

        var Filtered_Request = objCycle.insurer_request_filter(dbLogItems[k]['LM_Custom_Request']);
        arr_premium_response['Response'][inc] = {
            "Service_Log_Id": dbLogItems[k]['Service_Log_Id'],
            "Service_Log_Unique_Id": dbLogItems[k]['Service_Log_Unique_Id'],
            "Method_Type": dbLogItems[k]['Method_Type'],
            "Insurer_Transaction_Identifier": dbLogItems[k]['Insurer_Transaction_Identifier'],
            "Error_Code": dbLogItems[k]['Error_Code'],
            "Created_On": dbLogItems[k]['Created_On'],
            "Product_Id": dbLogItems[k]['Product_Id'],
            "Insurer_Id": dbLogItems[k]['Insurer_Id'],
            "Status": dbLogItems[k]['Status'],
            "Plan_Id": dbLogItems[k]['Plan_Id'],
            "Plan_Name": dbLogItems[k]['Plan_Name'],
            "LM_Custom_Request": Filtered_Request,
            "Premium_Breakup": (dbLogItems[k]['Error_Code'] === "") ? dbLogItems[k]['Premium_Breakup'] : null,
            "Insurer": Db_Data_Object.Insurer['Insurer_' + dbLogItems[k]['Insurer_Id']],
            "Call_Execution_Time": dbLogItems[k]['Call_Execution_Time']
        };
        if (dbLogItems[k]['Error']) {
            arr_premium_response['Response'][inc]['Error'] = dbLogItems[k]['Error'];
        }

        //adddon process
        if (dbLogItems[k]['Error_Code'] === "" && dbLogItems[k].hasOwnProperty('Premium_Breakup')) {
            if (dbLogItems[k]['Premium_Breakup']) {
                var Addon = dbLogItems[k]['Premium_Breakup']['addon'];
                for (var key in Addon) {
                    if (key.indexOf('final') < 0 && (Addon[key] - 0) > 0) {
                        var Addon_Amt = Math.round(Addon[key] - 0);
                        if (!Common_Addon_List.hasOwnProperty(key)) {
                            Common_Addon_List[key] = {
                                'min': 0,
                                'max': 0
                            };
                        }
                        if (Addon_Amt < Common_Addon_List[key]['min'] || Common_Addon_List[key]['min'] === 0) {
                            Common_Addon_List[key]['min'] = Addon_Amt;
                        }


                        if (Addon_Amt > Common_Addon_List[key]['max'] || Common_Addon_List[key]['max'] === 0) {
                            Common_Addon_List[key]['max'] = Addon_Amt;
                        }
                    }
                }
            }
        }

        Arr_Idv_Min.push(Filtered_Request['vehicle_min_idv']);
        Arr_Idv_Max.push(Filtered_Request['vehicle_max_idv']);
        actual_time += dbLogItems[k]['Call_Execution_Time'];
        inc++;
    }
    arr_premium_response.Summary['vehicle_min_idv'] = Math.min.apply(null, Arr_Idv_Min);
    arr_premium_response.Summary['vehicle_max_idv'] = Math.max.apply(null, Arr_Idv_Max);
    arr_premium_response.Summary['Actual_Time'] = actual_time;
    arr_premium_response.Summary['Common_Addon'] = Common_Addon_List;
    objCycle.response_object.json(arr_premium_response);
    console.log('Finish', 'premium_list_db_handler');
};
Cycle.prototype.premium_list_db_handler_version_2 = function (Db_Data_Object) {
    console.log('Start', 'premium_list_db_handler_version_2');
    var objCycle = this;
    var arr_premium_response = {
        'Summary': null,
        'Response': []
    };
    arr_premium_response.Summary = Db_Data_Object.Request;
    arr_premium_response.Summary.Request_Unique_Id_Core = Db_Data_Object.Request.Request_Unique_Id;
    arr_premium_response.Summary.Request_Unique_Id = Db_Data_Object.Request.Request_Unique_Id + "_" + Db_Data_Object.User_Data.User_Data_Id;
    var actual_time = 0;
    var dbLogItems = Db_Data_Object.Log;
    var Arr_Idv_Min = [], Arr_Idv_Max = [];
    var Common_Addon_List = {};
    var Response_Type = 'FULL';
    if (Db_Data_Object.Request.Client_Id === 4 || Db_Data_Object.Request.Client_Id === 6) {
        Response_Type = 'QUOTE';
    }
    var All_Insurer_Addon = {};
    var All_Response = {};
    var All_Error = {};
    var All_Log = {};
    var Insurer_Completion_Summary = {};
    var premium_list = [];
    var insurer_cnt = 0;
    for (var k in dbLogItems) {
        if (dbLogItems[k]['Method_Type'] !== 'Premium') {
            continue;
        }
        if (arr_premium_response.Summary.Request_Core.hasOwnProperty('user_source') && arr_premium_response.Summary.Request_Core.user_source === 'tars') {
            if (dbLogItems[k]['Error_Code'] !== "") {
                continue;
            }
        }
        /*if (typeof All_Log['Insurer_' + dbLogItems[k]['Insurer_Id']] === 'undefined') {
         All_Log['Insurer_' + dbLogItems[k]['Insurer_Id']] = 0;
         }		
         All_Log['Insurer_' + dbLogItems[k]['Insurer_Id']]++;
         */


        //Process insurer completion summary start
        if (typeof Insurer_Completion_Summary['Insurer_' + dbLogItems[k]['Insurer_Id']] === 'undefined') {
            Insurer_Completion_Summary['Insurer_' + dbLogItems[k]['Insurer_Id']] = {'Total': 0, 'Completed': 0, 'Status': 'pending'};
        }
        if (dbLogItems[k]['Status'] === 'complete') {
            Insurer_Completion_Summary['Insurer_' + dbLogItems[k]['Insurer_Id']]['Completed']++;
        }
        Insurer_Completion_Summary['Insurer_' + dbLogItems[k]['Insurer_Id']]['Total']++;
        //Process insurer completion summary end

        if (dbLogItems[k]['Status'] === 'complete') {
            if (dbLogItems[k]['Error_Code'] === "" && dbLogItems[k]['Premium_Breakup']) {
                if (typeof All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']] === 'undefined') {
                    insurer_cnt++;
                    var Filtered_Request = objCycle.insurer_request_filter(dbLogItems[k]['LM_Custom_Request']);
                    All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']] = {
                        "Service_Log_Id": dbLogItems[k]['Service_Log_Id'],
                        "Service_Log_Unique_Id_Core": dbLogItems[k]['Service_Log_Unique_Id'],
                        "Service_Log_Unique_Id": dbLogItems[k]['Service_Log_Unique_Id'] + '_' + dbLogItems[k]['Service_Log_Id'] + '_' + Db_Data_Object.User_Data.User_Data_Id,
                        "Insurer_Id": dbLogItems[k]['Insurer_Id'],
                        "Insurer": Db_Data_Object.Insurer['Insurer_' + dbLogItems[k]['Insurer_Id']],
                        "Premium_Breakup": dbLogItems[k]['Premium_Breakup'],
                        "Premium_Rate": (dbLogItems[k].hasOwnProperty('Premium_Rate')) ? dbLogItems[k]['Premium_Rate'] : null,
                        "Addon_List": {},
                        "Addon_Mode": (dbLogItems[k].hasOwnProperty('Addon_Mode')) ? dbLogItems[k]['Addon_Mode'] : 'ALACARTE',
                        "Plan_List": [],
                        "LM_Custom_Request": Filtered_Request,
                        'Completion_Summary': null,
                        'Error_Code': dbLogItems[k]['Error_Code']
                    };
                    if (!(Db_Data_Object.Request.Client_Id === 1 || Db_Data_Object.Request.Client_Id === 2) && false) {
                        All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']]['Premium_Rate'] = null;
                    }
                }
                var plan_len = All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']]['Plan_List'].length;
                var Addon = dbLogItems[k]['Premium_Breakup']['addon'];
                var Plan_Addon = {};
                for (var key in Addon) {
                    if (key.indexOf('final') < 0 && (Addon[key] - 0) > 0) {
                        var Addon_Amt = Math.round(Addon[key] - 0);
                        Plan_Addon[key] = Addon_Amt;
                        //console.log(key,Addon_Amt);
                        All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']]['Addon_List'][key] = Addon_Amt;
                        if (!Common_Addon_List.hasOwnProperty(key)) {
                            Common_Addon_List[key] = {
                                'min': 0,
                                'max': 0
                            };
                        }
                        if (Addon_Amt < Common_Addon_List[key]['min'] || Common_Addon_List[key]['min'] === 0) {
                            Common_Addon_List[key]['min'] = Addon_Amt;
                        }
                        if (Addon_Amt > Common_Addon_List[key]['max'] || Common_Addon_List[key]['max'] === 0) {
                            Common_Addon_List[key]['max'] = Addon_Amt;
                        }
                        //dbLogItems[k]['Premium_Breakup']['addon'][key] = 0;
                    }
                }

                //dbLogItems[k]['Premium_Breakup']['net_premium'] = (dbLogItems[k]['Premium_Breakup']['own_damage']['od_final_premium'] - 0) + (dbLogItems[k]['Premium_Breakup']['liability']['tp_final_premium'] - 0);
                dbLogItems[k]['Premium_Breakup']['net_premium'] = (dbLogItems[k]['Premium_Breakup']['net_premium'] - 0) - (dbLogItems[k]['Premium_Breakup']['addon']['addon_final_premium'] - 0);
                if ((dbLogItems[k]['Premium_Breakup']['net_premium'] - 0) < 0 || true) {
                    dbLogItems[k]['Premium_Breakup']['net_premium'] = (dbLogItems[k]['Premium_Breakup']['own_damage']['od_final_premium'] - 0) + (dbLogItems[k]['Premium_Breakup']['liability']['tp_final_premium'] - 0);
                }
                dbLogItems[k]['Premium_Breakup']['service_tax'] = dbLogItems[k]['Premium_Breakup']['net_premium'] * 0.18;
                dbLogItems[k]['Premium_Breakup']['final_premium'] = Math.round(dbLogItems[k]['Premium_Breakup']['net_premium'] + dbLogItems[k]['Premium_Breakup']['service_tax']);
                if (dbLogItems[k]['Premium_Breakup']['final_premium'] > 0) {
                    premium_list.push(dbLogItems[k]['Premium_Breakup']['final_premium']);
                }
                All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']]['Plan_List'][plan_len] = {
                    "Plan_Id": dbLogItems[k]['Plan_Id'],
                    "Plan_Name": dbLogItems[k]['Plan_Name'],
                    "Plan_Schema": dbLogItems[k]['Plan_Addon_List'],
                    "Service_Log_Id": dbLogItems[k]['Service_Log_Id'],
                    "Service_Log_Unique_Id_Core": dbLogItems[k]['Service_Log_Unique_Id'],
                    "Service_Log_Unique_Id": dbLogItems[k]['Service_Log_Unique_Id'] + '_' + dbLogItems[k]['Service_Log_Id'] + '_' + Db_Data_Object.User_Data.User_Data_Id,
                    "Insurer_Transaction_Identifier": dbLogItems[k]['Insurer_Transaction_Identifier'],
                    'Plan_Addon_Breakup': Plan_Addon,
                    'Plan_Addon_Premium': dbLogItems[k]['Premium_Breakup']['addon']['addon_final_premium']
                };
                delete dbLogItems[k]['Premium_Breakup']['addon'];
                Arr_Idv_Min.push(Filtered_Request['vehicle_min_idv']);
                Arr_Idv_Max.push(Filtered_Request['vehicle_max_idv']);
                actual_time += dbLogItems[k]['Call_Execution_Time'];
            } else {
                if (['LM003', 'LM004', 'LM005', 'LM006'].indexOf(dbLogItems[k]['Error_Code']) > -1) {
                    if (typeof All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']] === 'undefined') {
                        insurer_cnt++;
                        All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']] = {
                            "Service_Log_Id": dbLogItems[k]['Service_Log_Id'],
                            "Service_Log_Unique_Id": dbLogItems[k]['Service_Log_Unique_Id'],
                            "Insurer_Id": dbLogItems[k]['Insurer_Id'],
                            "Insurer": Db_Data_Object.Insurer['Insurer_' + dbLogItems[k]['Insurer_Id']],
                            "Premium_Breakup": null,
                            "Addon_List": {},
                            "Plan_List": [],
                            "LM_Custom_Request": null,
                            'Completion_Summary': null,
                            'Error_Code': dbLogItems[k]['Error_Code']
                        };
                    }
                }
                /*
                 else{ // for other error					
                 if (typeof All_Error['Insurer_' + dbLogItems[k]['Insurer_Id']] === 'undefined') {
                 All_Error['Insurer_' + dbLogItems[k]['Insurer_Id']] = [];
                 }
                 All_Error['Insurer_' + dbLogItems[k]['Insurer_Id']].push({
                 "Service_Log_Id": dbLogItems[k]['Service_Log_Id'],
                 "Service_Log_Unique_Id": dbLogItems[k]['Service_Log_Unique_Id'],
                 "Insurer_Id": dbLogItems[k]['Insurer_Id'],
                 "Insurer": Db_Data_Object.Insurer['Insurer_' + dbLogItems[k]['Insurer_Id']],
                 "Premium_Breakup": null,
                 "Addon_List": {},
                 "Plan_List": [],
                 "LM_Custom_Request": null,
                 'Completion_Summary': null,
                 'Error_Code': dbLogItems[k]['Error_Code']
                 });										
                 }*/
            }
        }
    }
    var Final_All_Response = [];
    for (var k in All_Response) {
        if (Insurer_Completion_Summary.hasOwnProperty('Insurer_' + All_Response[k]['Insurer_Id'])) {
            if (Insurer_Completion_Summary['Insurer_' + All_Response[k]['Insurer_Id']].Total > 0 && Insurer_Completion_Summary['Insurer_' + All_Response[k]['Insurer_Id']].Total === Insurer_Completion_Summary['Insurer_' + All_Response[k]['Insurer_Id']].Completed) {
                Insurer_Completion_Summary['Insurer_' + All_Response[k]['Insurer_Id']].Status = 'complete';
            }
            All_Response[k]['Completion_Summary'] = Insurer_Completion_Summary['Insurer_' + All_Response[k]['Insurer_Id']];
        }
        Final_All_Response.push(All_Response[k]);
    }

    arr_premium_response['Response'] = Final_All_Response;
    arr_premium_response.Summary['Created_On'] = (new Date(arr_premium_response.Summary['Created_On'])).toLocaleString();
    arr_premium_response.Summary['vehicle_min_idv'] = Math.min.apply(null, Arr_Idv_Min) || 0;
    arr_premium_response.Summary['vehicle_max_idv'] = Math.max.apply(null, Arr_Idv_Max) || 0;
    arr_premium_response.Summary['Actual_Time'] = actual_time;
    arr_premium_response.Summary['Idv_Min'] = Math.min.apply(null, Arr_Idv_Min) || 0;
    arr_premium_response.Summary['Idv_Max'] = Math.max.apply(null, Arr_Idv_Max) || 0;
    arr_premium_response.Summary['Premium_Min'] = Math.min.apply(null, premium_list);
    arr_premium_response.Summary['Premium_Max'] = Math.max.apply(null, premium_list);
    arr_premium_response.Summary['Insurer_Cnt'] = insurer_cnt;
    arr_premium_response.Summary['Actual_Time'] = actual_time;
    arr_premium_response.Summary['Common_Addon'] = Common_Addon_List;
    var ObjUser_Data = {
        'Premium_List': arr_premium_response
    };
    var User_Data = require('../models/user_data');
    User_Data.update({'User_Data_Id': objCycle.udid - 0}, {$set: ObjUser_Data}, function (err, numAffected) {
        console.log('premium_db_list', 'user_data', err, numAffected);
    });
    objCycle.response_object.json(arr_premium_response);
    console.log('Finish', 'premium_list_db_handler_version_2', JSON.stringify(arr_premium_response));
};
module.exports = Cycle;

