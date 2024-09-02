/* Author - Revati Ghadge
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Base = require('../libs/Base');
var moment = require('moment');
var config = require('config');
function CyberSecurity() {

}
CyberSecurity.prototype.client_id = 0;
CyberSecurity.prototype.request_unique_id = '';
CyberSecurity.prototype.__proto__ = Base.prototype;
var mongojs = require('mongojs');
var myDb = mongojs(config.db.connection + ':27017/' + config.db.name);
CyberSecurity.prototype.const_premium_breakup = {
    "tax": {
        "CGST": 0,
        "SGST": 0,
        "IGST": 0,
        "UGST": 0
    },
    "addon": {
        "addon_malware": 0,
        "addon_final_premium": 0
    },
    "net_premium": 0,
    "service_tax": 0,
    "final_premium": 0
};

CyberSecurity.prototype.product_api_pre = function () {
    console.log(this.constructor.name + '::' + 'product_api_pre' + '::Start');
    var objLMRequest = this.lm_request;
    objLMRequest['policy_start_date'] = this.policy_start_date();
    objLMRequest['policy_end_date'] = this.policy_end_date();

    if (this.lm_request['method_type'] === 'Premium' || this.lm_request['method_type'] === 'Proposal') {
        if (objLMRequest.hasOwnProperty('contact_name') && objLMRequest['contact_name'] !== null) {
            var arr_name = objLMRequest['contact_name'].split(' ');
            objLMRequest['first_name'] = arr_name[0];
            if (arr_name.length > 1) {
                objLMRequest['last_name'] = arr_name[arr_name.length - 1];
            }
            if (arr_name.length > 2) {
                objLMRequest['middle_name'] = arr_name[1];
            } else {
                objLMRequest['middle_name'] = "";
            }
        }
//        if (this.lm_request['method_type'] === 'Proposal') {
//            objLMRequest['birth_date'] = this.get_birth_date();
//        }
    }
    this.lm_request = objLMRequest;
    console.log(this.constructor.name + '::' + 'product_api_pre' + '::Finish');
};
CyberSecurity.prototype.product_field_process_pre = function () {
    if (this.lm_request['method_type'] === 'Premium' && this.insurer_id !== 21) {
        var txt_replace = this.find_text_btw_key(this.method_content, '<!--InsurersDetail_Start-->', '<!--InsurersDetail_End-->', true);
        var txt_replace_with = "";
        var member = 1;
        for (member = 1; member <= this.lm_request['adult_count']; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
        }
        for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
            txt_replace_with += txt_replace.replaceAll('___member_array', '___member_' + member);
        }
        if (this.method_content[0] !== '<') // for json
        {
            txt_replace_with = txt_replace_with.replaceAll('<!--InsurersDetail_Start-->', "");
            var Total_Count = this.lm_request['member_count'];
            for (var x = 1; x <= Total_Count - 1; x++) {
                txt_replace_with = txt_replace_with.replace('<!--InsurersDetail_End-->', ",");
            }
            txt_replace_with = txt_replace_with.replace('<!--InsurersDetail_End-->', "");
        }
        this.method_content = this.method_content.replace(txt_replace, txt_replace_with);
    } else if (this.lm_request['method_type'] === 'Proposal') {

        // add questions in prepared and processed request
        for (var key in this.lm_request) {
            if (key.indexOf('_question_') > -1 && key.indexOf('member_') > -1) {
                this.prepared_request[key] = this.lm_request[key];
                this.processed_request['___' + key + '___'] = this.lm_request[key];
            }
        }
    }
    var member = 1;
    for (member = 1; member <= this.lm_request['adult_count']; member++) {
        this.prepared_request['member_' + member + '_inc'] = member;
        this.processed_request['___member_' + member + '_inc___'] = member;
    }
    for (member = 3; member <= this.lm_request['child_count'] + 2; member++) {
        this.prepared_request['member_' + member + '_inc'] = member - 1;
        this.processed_request['___member_' + member + '_inc___'] = member;
    }
};
CyberSecurity.prototype.product_response_handler = function (objResponseJson, objProduct, objInsurerProduct, Insurer_Object, specific_insurer_object) {
    console.log('Start', this.constructor.name, 'product_response_handler');
    try {
        var objProductResponse = objInsurerProduct.insurer_product_response_handler(objResponseJson, objProduct, Insurer_Object, specific_insurer_object);


        if (objProductResponse.Error_Msg === 'NO_ERR') {
            if (specific_insurer_object.method.Method_Type === 'Premium') {
                var net_premium = objProductResponse.Premium_Breakup.net_premium - 0;
                if (net_premium < 100) {
                    objProductResponse.Error_Msg = 'LM_MSG::INSURER_NET_PREMIUM_ZERO';
                }
            }
        }


//        if (objProductResponse.Error_Msg === 'NO_ERR') {
//            if (specific_insurer_object.method.Method_Type === 'Premium') {
//                //process for premium master                
//                var Premium_Breakup = this.const_premium_breakup;
//                var SearchCriteria = {
//                    "Insurer_Id": parseInt(specific_insurer_object['insurer_id']),
//                    "Sum_Insured": parseInt(objInsurerProduct.lm_request['cs_insurance_si']),
//                    "City_Id": parseInt(objInsurerProduct.lm_request['city_id']),
//                    "Premium_Breakup": Premium_Breakup
//                };
//                var Health_Premium = require('../models/health_premium');
//                var objModelHealthPremium = new Health_Premium(SearchCriteria);
//                objModelHealthPremium.save(function (err, objDBHealthPremium) {
//                    if (err) {
//                        console.error('objHealthPremium', 'product_response_handler', err);
//                    } else {
//                        console.log(objDBHealthPremium);
//                    }
//                });
//                //this.save_to_db(DbCollectionName, {$set: ObjDocument}, SearchCriteria);
//            }
//        }
        console.log('Finish', this.constructor.name, 'product_response_handler');
        return objProductResponse;
    } catch (e) {
        console.error('Exception', e);
    }

};
CyberSecurity.prototype.product_field_process_post = function () {

};
CyberSecurity.prototype.product_api_post = function () {

};
CyberSecurity.prototype.cyber_suminsured = function (objInsurerProduct, objProduct, Insurer_Object, specific_insurer_object) {
    var objInsurerProduct = this;
    var suminsured = objInsurerProduct.lm_request["cs_insurance_si"] - 0;
    var suminsured_next = 0;
    var suminsured_pre = 75000000;
    var suminsured_array = objInsurerProduct.const_insurer_suminsured;

    var si_available = objInsurerProduct.cyber_suminsured_selector(objProduct.lm_request['cs_insurance_si'] - 0, objInsurerProduct.const_insurer_suminsured);

//    objProduct.insurer_lm_request['cs_insurance_si'] = si_available;
//    objInsurerProduct.product_processed_request['cs_insurance_si'] = si_available;
    objInsurerProduct.prepared_request["cs_insurance_si"] = si_available;
    objInsurerProduct.processed_request["___cs_insurance_si___"] = si_available;
    var insurer_id = Insurer_Object.Insurer_ID;
    var method_field_list = objProduct.insurer_master_object['insurer_id_' + insurer_id]['method_field_list'];
    this.field_process_all(method_field_list, 'method');
    objInsurerProduct.process_execute_plan(objInsurerProduct, objProduct, Insurer_Object, specific_insurer_object);

    console.log(this.constructor.name, 'cyber_suminsured', 'Start', specific_insurer_object);
};
CyberSecurity.prototype.cyber_suminsured_selector = function (selected_cyber_si, const_insurer_suminsured) {
    var objInsurerProduct = this;
    var suminsured_available = 0;
    if (const_insurer_suminsured.indexOf(selected_cyber_si) > -1)
    {
        suminsured_available = selected_cyber_si;
    } else {
        //ascending
        const_insurer_suminsured.sort(function (a, b) {
            return a - b;
        });
        for (var x in const_insurer_suminsured)
        {
            if (const_insurer_suminsured[x] > selected_cyber_si)
            {
                suminsured_available = const_insurer_suminsured[x];
                break;
            }
        }
        //descending
        const_insurer_suminsured.sort(function (a, b) {
            return b - a;
        });
        if (suminsured_available === 0) {
            for (var x in const_insurer_suminsured)
            {
                if (const_insurer_suminsured[x] < selected_cyber_si)
                {
                    suminsured_available = const_insurer_suminsured[x];
                    break;
                }
            }
        }
    }
    console.log(this.constructor.name, 'cyber_suminsured_selector', 'Finish', suminsured_available);
    return suminsured_available;
};
CyberSecurity.prototype.get_const_premium_breakup = function () {
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
CyberSecurity.prototype.get_const_rate_breakup = function () {
    console.log('Start', this.constructor.name, 'get_const_rate_breakup');
    var rate_breakup = this.const_premium_rate;
    for (var key in rate_breakup) {
        rate_breakup[key] = 0;
    }
    return rate_breakup;
};
CyberSecurity.prototype.get_birth_date = function () {
    console.log(this.constructor.name, 'get_birth_date', 'Start');
    if (this.lm_request.hasOwnProperty('birth_date') && this.lm_request['birth_date'] !== '') {
        var dob = moment(this.lm_request['birth_date']).utcOffset("+05:30");
        return dob.format('YYYY-MM-DD');
    }
    return "";
};
CyberSecurity.prototype.policy_start_date = function () {
    console.log(this.constructor.name, 'policy_start_date', 'Start');
    var pol_start_date = this.lm_request.hasOwnProperty('start_date') ? this.lm_request['start_date'] : moment().utcOffset("+05:30").format('YYYY-MM-DD');
//    var pol_start_date = start_date.format('YYYY-MM-DD');
    console.log(this.constructor.name, 'policy_start_date', 'Finish', pol_start_date);
    return pol_start_date;
};
CyberSecurity.prototype.policy_end_date = function () {
    console.log('Start', this.constructor.name, 'policy_end_date');
    var start_date = this.lm_request.hasOwnProperty('start_date') ? moment(this.lm_request['start_date']).utcOffset("+05:30") : moment().utcOffset("+05:30");
    if (this.lm_request.hasOwnProperty('policy_tenure')) {
        pol_end_date = start_date.add(this.lm_request['policy_tenure'], 'year').format('YYYY-MM-DD');
    }
    console.log('Finish', this.constructor.name, 'policy_end_date', pol_end_date);
    return pol_end_date;
};
CyberSecurity.prototype.randomName = function (length) {
    var result = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
    return result;
};
CyberSecurity.prototype.cs_pb_crn_create = function (lm_request, client_id, request_unique_id, user_data_id) {
    try {
        var moment = require('moment');
        var crn_data = {
            "SumInsured": lm_request.hasOwnProperty("cs_insurance_si") ? lm_request['cs_insurance_si'].toString() : "0",
            "HealthType": "Topup",
            "DeductibleAmount": lm_request.hasOwnProperty("cs_insurance_si") ? lm_request['cs_insurance_si'] : 0,
            "TypeOfPolicy": "NEW",
            "CityID": lm_request.city_id,
            "PolicyTermYear": lm_request.policy_tenure,
//            "PolicyFor": lm_request.cyber_insurance_type === "floater" ? "Family" : "Self", //??
            "ProductID": 18,
            "ExistingCustomerReferenceID": (lm_request.hasOwnProperty('crn') && lm_request['crn'] !== '') ? lm_request['crn'] : 0,
//            "MemberList": [],
            "SessionID": (lm_request.hasOwnProperty('pb_session_id') && lm_request['pb_session_id'] !== '') ? lm_request['pb_session_id'] : '',
            "ContactName": lm_request.first_name + " " + lm_request.last_name,
            "ContactEmail": lm_request.email,
            "ContactMobile": lm_request.mobile,
            "ClientID": client_id.toString(),
            "SRN": request_unique_id,
            "QTNumber": (lm_request.hasOwnProperty('lerp_qt_number') && lm_request['lerp_qt_number'] !== '') ? lm_request['lerp_qt_number'] : '',
            "SupportsAgentID": (lm_request.hasOwnProperty('ss_id') && lm_request['ss_id'] !== '') ? (lm_request['ss_id'] - 0) : 0
        };
        console.log(JSON.stringify(crn_data));
        var ObjCrn = {
            'Product_Id': lm_request.product_id,
            'User_Data_Id': user_data_id,
            'Crn_Request': lm_request,
            'PB_Crn_Request': crn_data
        };
        var args = {
            data: ObjCrn,
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
        client.post(config.pb_config.horizon_api_crn_url, args, function (data, response) {
            var EndDate = moment(new Date());
            var Call_Execution_Time = EndDate.diff(StartDate);
            Call_Execution_Time = Math.round((Call_Execution_Time * 0.001) * 100) / 100;
            var is_email = false;
            data = data - 0;
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
        console.error('Cyber_pb_crn_create', e);
    }
};
CyberSecurity.prototype.premium_list_db = function (dbRequestItem, request_unique_id = '', client_id = 0, response_version = '1.0') {
    console.log(this.constructor.name, 'premium_list', 'Start');
    var objCyber = this;
    if (request_unique_id) {
        objCyber.client_id = client_id;
        objCyber.request_unique_id = request_unique_id;
    }
    var Combine_Data = {
        'Request': dbRequestItem,
        'Log': null,
        'Insurer': null,
        'User_Data': null
    };

    var dbCollLog = myDb.collection('service_logs');
    var cond_service_logs = {'Request_Id': dbRequestItem.Request_Id, 'Method_Type': 'Premium'};
    if (response_version === '1.0') {
        cond_service_logs = {'Request_Unique_Id': dbRequestItem.Request_Unique_Id};
    }
    dbCollLog.find(cond_service_logs).toArray(function (err, dbLogItems) {
        if (err) {
            return console.dir(err);
        }
        Combine_Data.Log = dbLogItems;
        objCyber.premium_list_db_handler(Combine_Data, response_version);
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
        objCyber.premium_list_db_handler(Combine_Data, response_version);
    });

    console.log(this.constructor.name, 'premium_list', 'Finish');
};
CyberSecurity.prototype.premium_list_db_handler_back = function (Db_Data_Object, response_version = '1.0') {
    console.log('Start', 'premium_list_db_handler');
    if (Db_Data_Object.Request && Db_Data_Object.Log && Db_Data_Object.Insurer) {
        this.premium_list_db_handler_version(Db_Data_Object);
    }
    console.log('Start', 'premium_list_db_handler');
};
CyberSecurity.prototype.premium_list_db_handler = function (Db_Data_Object, response_version = '1.0') {
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
CyberSecurity.prototype.premium_list_db_handler_version_1 = function (Db_Data_Object) {
    var objCyber = this;
    try {
        console.log('Start', 'premium_list_db_handler');


        var arr_premium_response = {
            'Summary': null,
            'Response': []
        };
        arr_premium_response.Summary = Db_Data_Object.Request;

        var actual_time = 0;
        var dbLogItems = Db_Data_Object.Log;
        var inc = 0;
        for (var k in dbLogItems) {
            arr_premium_response['Response'][inc] = {
                "Service_Log_Id": dbLogItems[k]['Service_Log_Id'],
                "Service_Log_Unique_Id_Core": dbLogItems[k]['Service_Log_Unique_Id'],
                "Service_Log_Unique_Id": dbLogItems[k]['Service_Log_Unique_Id'] + '_' + dbLogItems[k]['Service_Log_Id'] + '_' + objCyber.udid,
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

        objCyber.response_object.json(arr_premium_response);


    } catch (e) {
        console.error('CyberSecurity', 'premium_list_db_handler_version_1', e);
        objCyber.response_object.json(e);
    }
};
CyberSecurity.prototype.premium_list_db_handler_version_2 = function (Db_Data_Object) {
    console.log('Start', 'premium_list_db_handler_version_2');
    var objCyber = this;
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
    if (Db_Data_Object.Request.Client_Id === 4 || Db_Data_Object.Request.Client_Id === 6) {
        Response_Type = 'QUOTE';
    }
    //var All_Insurer_Addon = {};
    var Plan_List = [];
    var Plan_Addon = {};
    var All_Response = {};
    var All_Response_1 = {};
    var Insurer_Completion_Summary = {};
    var insurer_cnt = 0;
    for (var i = 0; i < Db_Data_Object.Log.length; i++) {
        var plan = {};
        plan['Plan_Id'] = Db_Data_Object.Log[i].Plan_Id;
        plan['Plan_Name'] = Db_Data_Object.Log[i]['Plan_Name'];
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
                    //var Filtered_Request = objHealth.insurer_request_filter(dbLogItems[k]['LM_Custom_Request']);
                    All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']] = {
                        "Service_Log_Id": dbLogItems[k]['Service_Log_Id'],
                        "Service_Log_Unique_Id_Core": dbLogItems[k]['Service_Log_Unique_Id'],
                        "Service_Log_Unique_Id": dbLogItems[k]['Service_Log_Unique_Id'] + '_' + dbLogItems[k]['Service_Log_Id'] + '_' + objCyber.udid,
                        "Insurer_Id": dbLogItems[k]['Insurer_Id'],
                        "Insurer": Db_Data_Object.Insurer['Insurer_' + dbLogItems[k]['Insurer_Id']],
                        //"Premium_Breakup": dbLogItems[k]['Premium_Breakup'],
                        "Premium_Rate": (dbLogItems[k].hasOwnProperty('Premium_Rate')) ? dbLogItems[k]['Premium_Rate'] : null,
                        "Addon_List": {},
                        "Plan_List": [],
                        //"LM_Custom_Request": Filtered_Request,
                        'Completion_Summary': null,
                        'Error_Code': dbLogItems[k]['Error_Code']
                    };
                    if (!(Db_Data_Object.Request.Client_Id === 1 || Db_Data_Object.Request.Client_Id === 2)) {
                        All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']]['Premium_Rate'] = null;
                    }
                    var Addon = dbLogItems[k]['Premium_Breakup']['addon'];
                    for (var key in Addon) {
                        if (!key.includes('final') && (Addon[key] - 0) > 0) {
                            var Addon_Amt = Math.round(Addon[key] - 0);
                            Plan_Addon[key] = Addon_Amt;
                            ////console.log(key,Addon_Amt);
                            All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']]['Addon_List'][key] = Addon_Amt;
                        }
                    }
                }

                var plan_len = All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']]['Plan_List'].length;
                All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']]['Plan_List'][plan_len] = {
                    "Plan_Id": dbLogItems[k]['Plan_Id'],
                    "Plan_Name": dbLogItems[k]['Plan_Name'],
                    "Plan_Code": dbLogItems[k]['Plan_Code'],
                    "Plan_Schema": dbLogItems[k]['Plan_Addon_List'],
                    "Service_Log_Id": dbLogItems[k]['Service_Log_Id'],
                    "Service_Log_Unique_Id_Core": dbLogItems[k]['Service_Log_Unique_Id'],
                    "Service_Log_Unique_Id": dbLogItems[k]['Service_Log_Unique_Id'] + '_' + dbLogItems[k]['Service_Log_Id'] + '_' + objCyber.udid,
                    "Insurer_Transaction_Identifier": dbLogItems[k]['Insurer_Transaction_Identifier'],
                    "Insurer_Id": dbLogItems[k]['Insurer_Id'],
                    "Insurer_Logo_Name": All_Response['Insurer_' + dbLogItems[k]['Insurer_Id']]['Insurer']['Insurer_Logo_Name'],
                    "Sum_Insured": dbLogItems[k]['LM_Custom_Request']['cs_insurance_si'],
                    "Premium_Breakup": dbLogItems[k]['Premium_Breakup'],
                    "Plan_Addon_Breakup": Plan_Addon,
                    "Plan_Addon_Premium": dbLogItems[k]['Premium_Breakup']['addon']['addon_final_premium']
                };
                actual_time += dbLogItems[k]['Call_Execution_Time'];
            }
        }

    }
    var Final_All_Response = [];
    var Final_All_Response_1 = [];
    for (var k in All_Response) {
        if (Insurer_Completion_Summary.hasOwnProperty('Insurer_' + All_Response[k]['Insurer_Id'])) {
            if (Insurer_Completion_Summary['Insurer_' + All_Response[k]['Insurer_Id']].Total > 0 && Insurer_Completion_Summary['Insurer_' + All_Response[k]['Insurer_Id']].Total === Insurer_Completion_Summary['Insurer_' + All_Response[k]['Insurer_Id']].Completed) {
                Insurer_Completion_Summary['Insurer_' + All_Response[k]['Insurer_Id']].Status = 'complete';
            }
            All_Response[k]['Completion_Summary'] = Insurer_Completion_Summary['Insurer_' + All_Response[k]['Insurer_Id']];
        }
        All_Response_1 = All_Response;
        Final_All_Response.push(All_Response[k]);
        Final_All_Response_1.push(All_Response_1[k]);
    }
    arr_premium_response['Response'] = Final_All_Response;
    var sum_insured_min = 75000000;
    var sum_insured_max = 0;
    var premium_min = 10000000;
    var premium_max = 0;
    // for response 1
    for (var key in Final_All_Response_1) {
        for (var plankey in Final_All_Response_1[key]['Plan_List']) {
            var list = {};
            list['Insurer_Name'] = Final_All_Response_1[key]['Insurer']['Insurer_Name'];
            list['Insurer_Id'] = Final_All_Response_1[key]['Insurer_Id'];
            list['Insurer_Logo_Name'] = Final_All_Response_1[key]['Insurer']['Insurer_Logo_Name'];
            list['Service_Log_Unique_Id'] = Final_All_Response_1[key]['Plan_List'][plankey]['Service_Log_Unique_Id'];
            list['Plan_Name'] = Final_All_Response_1[key]['Plan_List'][plankey]['Plan_Name'];
            list['Plan_Id'] = Final_All_Response_1[key]['Plan_List'][plankey]['Plan_Id'];
            list['Sum_Insured'] = Final_All_Response_1[key]['Plan_List'][plankey]['Sum_Insured'];
            list['Premium_Breakup'] = Final_All_Response_1[key]['Plan_List'][plankey]['Premium_Breakup'];
            arr_premium_response.Response_1.push(list);

            sum_insured_min = Math.min(list['Sum_Insured'], sum_insured_min);
            sum_insured_max = Math.max(list['Sum_Insured'], sum_insured_max);
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
    User_Data.update({'User_Data_Id': objCyber.udid - 0}, {$set: ObjUser_Data}, function (err, numAffected) {
        console.log('premium_db_list', 'user_data', err, numAffected);
    });

    objCyber.response_object.json(arr_premium_response);
    console.log('Finish', 'premium_list_db_handler_version_2', JSON.stringify(arr_premium_response));
};
CyberSecurity.prototype.elder_member_birth_date = function () {
    console.log('Start', this.constructor.name, 'elder_member_age_in_months');
    var member_1_month_age = this.get_member_age_in_months(1);
    var member_2_month_age = this.get_member_age_in_months((this.lm_request.hasOwnProperty('member_2_birth_date')) ? 2 : 0);
    return member_1_month_age > member_2_month_age ? this.lm_request['member_1_birth_date'] : this.lm_request['member_2_birth_date'];
};

module.exports = CyberSecurity;