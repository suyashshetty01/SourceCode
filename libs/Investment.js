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

function Investment() {

}
util.inherits(Investment, Base);
Investment.prototype.product_field_process_pre = function () {

};
Investment.prototype.investment_pb_crn_create = function (lm_request, client_id, request_unique_id, user_data_id) {
    try {
        var moment = require('moment');
        var crn_data = {
            "product_id": 5,
            "gender": lm_request.gender,
            "customer_name": lm_request.first_name + " " + lm_request.last_name,
            "birth_date": moment(new Date(this.lm_request['birth_date'])).format("DD-MM-YYYY"),
            "investment_amount": lm_request.investment_amount,
            "investing_for": lm_request.investing_for,
            "frequency": lm_request.frequency,
            "mobile_no": lm_request.mobile,
            "email_id": lm_request.email,
            "policy_term_year": lm_request.policy_tenure
        };

        console.log(JSON.stringify(crn_data));
        var args = {
            data: crn_data,
            headers: {
                "Content-Type": "application/json",
                'UserName': config.pb_config.api_crn_user,
                'Password': config.pb_config.api_crn_pass
            }
        };
        var Client = require('node-rest-client').Client;
        var client = new Client();
        //console.log('args', args);

        var StartDate = moment(new Date());
        client.post(config.pb_config.api_investment_crn_url, args, function (data, response) {
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
        console.error('investment_pb_crn_create', e);
    }
};
Investment.prototype.product_api_pre = function () {
    console.log(this.constructor.name + '::' + 'product_api_pre' + '::Start');
    var objLMRequest = this.lm_request;
    objLMRequest['policy_start_date'] = this.policy_start_date();
    objLMRequest['policy_end_date'] = this.policy_end_date();
    objLMRequest['birth_date'] = this.get_member_birth_date();

    objLMRequest['age'] = this.get_member_age();
    this.lm_request = objLMRequest;
    console.log(this.constructor.name + '::' + 'product_api_pre' + '::Finish');


};
Investment.prototype.policy_start_date = function () {
    console.log(this.constructor.name, 'policy_start_date', 'Start');
//    var pol_start_date = moment().add(1, 'days').format('YYYY-MM-DD');
    var pol_start_date = moment(new Date()).format("YYYY-MM-DD");
    console.log(this.constructor.name, 'policy_start_date', 'Finish', pol_start_date);
    return pol_start_date;
};
Investment.prototype.policy_end_date = function () {
    console.log('Start', this.constructor.name, 'policy_end_date');
    var pol_end_date = moment().add(89, 'days').format('YYYY-MM-DD');
    if (this.lm_request.hasOwnProperty('policy_tenure') && this.lm_request['policy_tenure'] > 0) {
        pol_end_date = moment().add(this.lm_request['policy_tenure'], 'year').format('YYYY-MM-DD');
    }
    console.log('Finish', this.constructor.name, 'policy_end_date', pol_end_date);
    return pol_end_date;
};
Investment.prototype.get_member_birth_date = function (i) {
    console.log(this.constructor.name, 'get_member_age', 'Start');
    if (this.lm_request.hasOwnProperty('birth_date') && this.lm_request['birth_date'] !== '') {
        return this.lm_request['birth_date'];
    } else if (this.lm_request.hasOwnProperty('age') && this.lm_request['age'] - 0 >= 0) {
        return moment().subtract(this.lm_request['age'], 'years').subtract(15, 'days').format('YYYY-MM-DD');
    }
    return "";
};
Investment.prototype.get_member_age = function (i) {
    console.log(this.constructor.name, 'get_member_birth_date', 'Start');
    if (this.lm_request.hasOwnProperty('age') && this.lm_request['age'] - 0 >= 0) {
        return this.lm_request['age'];
    } else if (this.lm_request.hasOwnProperty('birth_date') && this.lm_request['birth_date'] != '') {
        return moment().diff(this.lm_request['birth_date'], 'years');
    }
    return 0;
    console.log(this.constructor.name, 'get_member_birth_date', 'End');
};
Investment.prototype.product_response_handler = function (objResponseJson, objProduct, objInsurerProduct, Insurer_Object, specific_insurer_object) {
    console.log('Start', this.constructor.name, 'product_response_handler');
    try {
        var objProductResponse = objInsurerProduct.insurer_product_response_handler(objResponseJson, objProduct, Insurer_Object, specific_insurer_object);
        console.log('Finish', this.constructor.name, 'product_response_handler');
        return objProductResponse;
    } catch (e) {
        console.error('Exception', e);
    }
};

Investment.prototype.premium_list_db = function (dbRequestItem, request_unique_id = '', client_id = 0, response_version = '1.0') {
    console.log(this.constructor.name, 'premium_list', 'Start');
    var objInvestment = this;
    if (request_unique_id) {
        objInvestment.client_id = client_id;
        objInvestment.request_unique_id = request_unique_id;
    }
    var Combine_Data = {
        'Request': dbRequestItem,
        'Log': null,
        'Insurer': null,
        'User_Data': null
    };

    var dbCollLog = myDb.collection('service_logs');
    var cond_service_logs = {'Request_Id': dbRequestItem.Request_Id, 'Method_Type': 'Premium'};
    if (response_version == '1.0') {
        cond_service_logs = {'Request_Unique_Id': dbRequestItem.Request_Id};
    }
    dbCollLog.find(cond_service_logs).toArray(function (err, dbLogItems) {
        if (err) {
            return console.dir(err);
        }
        Combine_Data.Log = dbLogItems;
        objInvestment.premium_list_db_handler(Combine_Data, response_version);
    });

    var dbCollInsurer = myDb.collection('insurers');
    dbCollInsurer.find().toArray(function (err, dbInsurerItems) {
        if (err) {
            return console.dir(err);
        }
        var InsurerMaster = [];
        for (var k in dbInsurerItems) {
            InsurerMaster['Insurer_' + dbInsurerItems[k]['Insurer_ID']] = dbInsurerItems[k];
        }
        Combine_Data.Insurer = InsurerMaster;
        objInvestment.premium_list_db_handler(Combine_Data, response_version);
    });

    console.log(this.constructor.name, 'premium_list', 'Finish');
};
Investment.prototype.premium_list_db_handler = function (Db_Data_Object, response_version = '1.0') {
    console.log('Start', 'premium_list_db_handler');
    if (Db_Data_Object.Request && Db_Data_Object.Log && Db_Data_Object.Insurer) {
        if (response_version === '1.0') {
            this.premium_list_db_handler_version_1(Db_Data_Object);
        }
        if (response_version === '2.0') {
            this.premium_list_db_handler_version_2(Db_Data_Object);
        }
    }
    console.log('Start', 'premium_list_db_handler');
};
Investment.prototype.premium_list_db_handler_version_1 = function (Db_Data_Object) {
    var objInvestment = this;
    try {
        console.log('Start', 'premium_list_db_handler');
        var arr_premium_response = {
            'Summary': null,
            'Response': []
        };
        arr_premium_response.Summary = Db_Data_Object.Request;

        var actual_time = 0;
        var dbLogItems = Db_Data_Object.Log;

        console.log("dbLogItems", dbLogItems)
        var inc = 0;
        for (var k in dbLogItems) {
            arr_premium_response['Response'][inc] = {
                "Service_Log_Id": dbLogItems[k]['Service_Log_Id'],
                "Service_Log_Unique_Id_Core": dbLogItems[k]['Service_Log_Unique_Id'],
                "Service_Log_Unique_Id": dbLogItems[k]['Service_Log_Unique_Id'] + '_' + dbLogItems[k]['Service_Log_Id'] + '_' + objInvestment.udid,
                "Method_Type": dbLogItems[k]['Method_Type'],
                "Insurer_Transaction_Identifier": dbLogItems[k]['Insurer_Transaction_Identifier'],
                "Error_Code": dbLogItems[k]['Error_Code'],
                "Created_On": dbLogItems[k]['Created_On'],
                "Product_Id": dbLogItems[k]['Product_Id'],
                "Insurer_Id": dbLogItems[k]['Insurer_Id'],
                "Status": dbLogItems[k]['Status'],
                "Plan_Id": dbLogItems[k]['Plan_Id'],
                "Plan_Name": dbLogItems[k]['Plan_Name'],
                "LM_Custom_Request": dbLogItems[k]['LM_Custom_Request'],
                "Premium_Breakup": (dbLogItems[k]['Error_Code'] === "") ? dbLogItems[k]['Premium_Breakup'] : null,
                "Insurer": Db_Data_Object.Insurer['Insurer_' + dbLogItems[k]['Insurer_Id']],
                "Call_Execution_Time": dbLogItems[k]['Call_Execution_Time']
            };
            if (dbLogItems[k]['Error']) {
                arr_premium_response['Response'][inc]['Error'] = dbLogItems[k]['Error'];
            }




            actual_time += dbLogItems[k]['Call_Execution_Time'];
            inc++;
        }
        arr_premium_response.Summary['Actual_Time'] = actual_time;

        objInvestment.response_object.json(arr_premium_response);


    } catch (e) {
        console.error('Investment', 'premium_list_db_handler_version_1', e);
        objInvestment.response_object.json(e);
    }
};
Investment.prototype.premium_list_db_handler_version_2 = function (Db_Data_Object) {
    var objInvestment = this;
    var arr_premium_response = {
        'Summary': null,
        'Response': [],
        'Response_1': []
    };
    arr_premium_response.Summary = Db_Data_Object.Request;

    var actual_time = 0;
    var dbLogItems = Db_Data_Object.Log;

    //var Arr_Idv_Min = [], Arr_Idv_Max = [];
    //var Common_Addon_List = {};

    var Response_Type = 'FULL';
    if (Db_Data_Object.Request.Client_Id == 4 || Db_Data_Object.Request.Client_Id == 6) {
        Response_Type = 'QUOTE';
    }
    //var All_Insurer_Addon = {};
    var Plan_List = [];
    var All_Response = {};
    var Insurer_Completion_Summary = {};
    var premium_list = [];
    var insurer_cnt = 0;
    for (var i = 0; i < Db_Data_Object.Log.length; i++) {
        var plan = {};
        plan['Plan_Id'] = Db_Data_Object.Log[i].Plan_Id;
        plan['Plan_Name'] = Db_Data_Object.Log[i].Plan_Name;
        plan['Plan_Code'] = Db_Data_Object.Log[i].Plan_Code;
        Plan_List.push(plan);
    }


    for (var k in dbLogItems) {
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
                    All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']] = {
                        "Service_Log_Id": dbLogItems[k]['Service_Log_Id'],
                        "Service_Log_Unique_Id_Core": dbLogItems[k]['Service_Log_Unique_Id'],
                        "Service_Log_Unique_Id": dbLogItems[k]['Service_Log_Unique_Id'] + '_' + dbLogItems[k]['Service_Log_Id'] + '_' + objInvestment.udid,
                        "Insurer_Id": dbLogItems[k]['Insurer_Id'],
                        "Insurer": Db_Data_Object.Insurer['Insurer_' + dbLogItems[k]['Insurer_Id']],
                        //"Premium_Breakup": dbLogItems[k]['Premium_Breakup'],
                        "Premium_Rate": (dbLogItems[k].hasOwnProperty('Premium_Rate')) ? dbLogItems[k]['Premium_Rate'] : null,
                        "Premium_Breakup": dbLogItems[k]['Premium_Breakup'],
                        //"Addon_List": {},
                        "Plan_List": [],
                        "Topup_List": [],
                        //"LM_Custom_Request": Filtered_Request,
                        'Completion_Summary': null,
                        'Error_Code': dbLogItems[k]['Error_Code']
                    };
                    if (!(Db_Data_Object.Request.Client_Id == 1 || Db_Data_Object.Request.Client_Id == 2)) {
                        All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']]['Premium_Rate'] = null;
                    }
                }
                var plan_len = All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']]['Plan_List'].length;
//                dbLogItems[k]['Premium_Breakup']['net_premium'] = dbLogItems[k]['Premium_Breakup']['net_premium'] - 0;
//                dbLogItems[k]['Premium_Breakup']['service_tax'] = 2 * Math.round(dbLogItems[k]['Premium_Breakup']['net_premium'] * 0.09);
//                dbLogItems[k]['Premium_Breakup']['final_premium'] = this.round2Precision(dbLogItems[k]['Premium_Breakup']['net_premium'] + dbLogItems[k]['Premium_Breakup']['service_tax']);
//                if (dbLogItems[k]['Premium_Breakup']['final_premium'] > 0) {
//                    premium_list.push(dbLogItems[k]['Premium_Breakup']['final_premium']);
//                }
                All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']]['Plan_List'][plan_len] = {
                    "Plan_Id": dbLogItems[k]['Plan_Id'],
                    "Plan_Name": dbLogItems[k]['Plan_Name'],
                    "Plan_Code": dbLogItems[k]['Plan_Code'],
                    "Plan_Schema": dbLogItems[k]['Plan_Addon_List'],
                    "Service_Log_Id": dbLogItems[k]['Service_Log_Id'],
                    "Service_Log_Unique_Id_Core": dbLogItems[k]['Service_Log_Unique_Id'],
                    "Service_Log_Unique_Id": dbLogItems[k]['Service_Log_Unique_Id'] + '_' + dbLogItems[k]['Service_Log_Id'] + '_' + objInvestment.udid,
                    "Insurer_Transaction_Identifier": dbLogItems[k]['Insurer_Transaction_Identifier'],
                    "Sum_Insured": dbLogItems[k]['LM_Custom_Request']['health_insurance_si'],
                    "Premium_Breakup": dbLogItems[k]['Premium_Breakup']
//                    'Plan_Addon_Breakup': Plan_Addon,
//                    'Plan_Addon_Premium': dbLogItems[k]['Premium_Breakup']['addon']['addon_final_premium']
                };
                actual_time += dbLogItems[k]['Call_Execution_Time'];
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
    var sum_insured_min = 30000000;
    var sum_insured_max = 0;
    var premium_min = 10000000;
    var premium_max = 0;
    // for response 1
    for (var key in arr_premium_response.Response) {
        for (var plankey in arr_premium_response.Response[key]['Plan_List']) {
            var list = {};
            list['Insurer_Name'] = arr_premium_response.Response[key]['Insurer']['Insurer_Name'];
            list['Insurer_Logo_Name'] = arr_premium_response.Response[key]['Insurer']['Insurer_Logo_Name'];
            list['Service_Log_Unique_Id'] = arr_premium_response.Response[key]['Plan_List'][plankey]['Service_Log_Unique_Id'];
            list['Plan_Name'] = arr_premium_response.Response[key]['Plan_List'][plankey]['Plan_Name'];
            // list['Sum_Insured'] = arr_premium_response.Response[key]['Plan_List'][plankey]['Sum_Insured'];
            list['maturity4'] = arr_premium_response.Response[key]['Plan_List'][plankey]['Premium_Breakup']['maturity4'];
            list['maturity8'] = arr_premium_response.Response[key]['Plan_List'][plankey]['Premium_Breakup']['maturity8'];
            list['final_premium'] = arr_premium_response.Response[key]['Plan_List'][plankey]['Premium_Breakup']['premium'];
            arr_premium_response.Response_1.push(list);

            //sum_insured_min = Math.min(list['Sum_Insured'], sum_insured_min);
            //sum_insured_max = Math.max(list['Sum_Insured'], sum_insured_max);
            premium_min = Math.min(list['final_premium'], premium_min);
            premium_max = Math.max(list['final_premium'], premium_max);
        }
    }
    arr_premium_response.Summary['Actual_Time'] = actual_time;
    arr_premium_response.Summary['Insurer_Cnt'] = insurer_cnt;
    arr_premium_response.Summary['Plan_Cnt'] = arr_premium_response.Response_1.length;
    arr_premium_response.Summary['Sum_Insured'] = {min: sum_insured_min, max: sum_insured_max};
    arr_premium_response.Summary['Premium'] = {min: premium_min, max: premium_max};
    var ObjUser_Data = {
        'Premium_List': arr_premium_response
    };
    var User_Data = require('../models/user_data');
    User_Data.update({'User_Data_Id': objInvestment.udid - 0}, {$set: ObjUser_Data}, function (err, numAffected) {
        console.log('premium_db_list', 'user_data', err, numAffected);
    });

    objInvestment.response_object.json(arr_premium_response);
    console.log('Finish', 'premium_list_db_handler_version_2', JSON.stringify(arr_premium_response));
};
Investment.prototype.get_const_premium_breakup = function () {
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
module.exports = Investment;
