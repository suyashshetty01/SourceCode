/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/*
 * 
 * {
 "_id" : ObjectId("591ad96ac273518df36fbec2"),
 "Client_Id" : "1",
 "Client_Unique_Id" : "123124343",
 "Client_Name" : "Self",
 "Secret_Key" : "12345678",
 "Is_Active" : "1",
 "Created_On" : "",
 "Modified_On" : ""
 }
 */

// grab the things we need
var config = require('config');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
var mongoosePaginate = require('mongoose-paginate');
var Base = require('../libs/Base');
var moment = require('moment');

var arr_insurer = {
    "47": "DHFL",
    "101": "ERP",
    "16": "RahejaQBE",
    "3": "Chola",
    "13": "Oriental",
    "44": "Digit",
    "45": "Acko",
    "14": "United",
    "11": "TataAIG",
    "2": "Bharti",
    "4": "FutureGenerali",
    "7": "IffcoTokio",
    "9": "Reliance",
    "10": "RoyalSundaram",
    "12": "NewIndia",
    "19": "UniversalSompo",
    "33": "LibertyVideocon",
    "1": "Bajaj",
    "5": "HdfcErgo",
    "6": "IciciLombard",
    "30": "Kotak",
    "100": "FastLane",
    "46": "Edelweiss"
};
/*
 * {
 "_id" : ObjectId("5a65861282e62807c898b61e"),
 "Insurer_Vehicle_Mapping_ID" : 25,
 "Insurer_ID" : 10,
 "Insurer_Vehicle_ID" : 120,
 "Vehicle_ID" : 1315,
 "Is_Active" : 1,
 "Created_On" : 1480786181590.0,
 "Status_Id" : 2,
 "Premium_Status" : 1
 }
 */
var obj_schema = {
    "Vehicle_ID": {type: Number, required: true},
    "Product_Id_New": {type: Number, required: true},
    "Make_Name": {type: String, required: true},
    "Model_Name": {type: String, required: true},
    "Variant_Name": {type: String, required: true},
    "Cubic_Capacity": {type: String, required: true},
    "Fuel_Name": {type: String, required: true},
    "Seating_Capacity": {type: Number, required: true},
    "ExShoroomPrice": {type: Number, required: true},
    "Image": {type: String},
    "Launch_Date": {type: Date},
    "Discontinue_Date": {type: Date},
    "IndirectVariant_Id": {type: Number},
    "InHouseSS_Variant_Id": {type: Number},
    "Is_Active": {type: Number},
    'Is_Base': String,
    'Base_Vehicle_ID': Number,
    'Mapped_Insurer_Count': Number,
    "Created_On": {type: Date, required: true},
    "Modified_On": {type: Date, required: true}
};
for (var k in arr_insurer) {
    obj_schema['Insurer_' + k] = {};
}
var vehicleSchema = new Schema(obj_schema);
// the schema is useless so far
// we need to create a model using it
vehicleSchema.plugin(mongoosePaginate);
//vehicleSchema.plugin(autoIncrement.plugin, {model: 'Client', field: 'Client_Id', startAt: 1});
var Vehicle = mongoose.model('Vehicle', vehicleSchema);
Vehicle.prototype.get_vehicle_fastlane_data = function (sms_id, objSmsRequest, objDbPosp = null) {

    var args = {
        data: {'registrationnumber': objSmsRequest['registration_no'].replace(/-/g, '')},
        headers: {
            "Content-Type": "application/json",
            //'Username': 'PBApi',
            //'Password': 'PB@123%!'
            //'Username': 'HorizonApi',
            //'Password': 'h@1234'
        }
    };
    var Client = require('node-rest-client').Client;
    var client = new Client();
    //console.log('args', args);
    client.post('http://horizon.policyboss.com:5000/quote/vehicle_info', args, function (data, response) {
        var soap = require('soap');
        var xml2js = require('xml2js');
        var http = require('http');
        var https = require('https');
        var parse = require('xml-parser');

        //var fliter_response = data['FastlaneResponse'];
        //xml2js.parseString(fliter_response, {ignoreAttrs: true}, function (err, objXml2Json) {
        //    console.log(objXml2Json);
        //    if (false) {
//
        //    } else {
        // parsed response body as js object        
        //    data['FastlaneResponseObj'] = null;
        var FL_Status = 0; //fail
        //if (data['FastlaneResponse'].indexOf('{') > -1) {
        if (data.hasOwnProperty('Variant_Id') && data['Variant_Id'] !== '' && data['Variant_Id'] - 0 > 0) {
            FL_Status = 3;
        } else {
            FL_Status = 1;
        }


        //data['FastlaneResponseObj'] = JSON.parse(data['FastlaneResponse']);
        //} else if (data.hasOwnProperty('FastlaneResponse') && data['ErrorMessage'] === '' && !err) {
        //    if (data.hasOwnProperty('Variant_Id') && data['Variant_Id'] !== '') {
        //        FL_Status = 3;
        //    } else {
        //        FL_Status = 2;
        //    }
        //var oblfl = {};
        //for (var k in objXml2Json.response.result[0].vehicle[0]) {
        //    oblfl[k] = objXml2Json.response.result[0].vehicle[0][k][0];
        //}

        //data['FastlaneResponseObj'] = oblfl;
        //} else {
        //    FL_Status = 1;
        //}

        var Sms = require('../models/sms');
        Sms.update({'Sms_Id': sms_id}, {'FL_Response': data, 'FL_Status': FL_Status}, function (err, doc) {
            console.log('smsupdate', err, doc);
        });
        var objSms = new Sms();
        var objVehicle = new Vehicle();
        if (objSmsRequest['request_type'] === 'INFO') {
            var sms_content = objVehicle.prepareMotorDetails(data);
            var arrSmsList = {'Info': sms_content};
            objSms.send_sms(objSmsRequest['receiver_mobile_no'], sms_content, sms_id, arrSmsList);
        }
        if (objSmsRequest['request_type'] === 'QUOTE' || objSmsRequest['request_type'] === 'SQUOTE' || objSmsRequest['request_type'] === 'PQUOTE') {
            var arrSmsList = {};
            var FastLaneData = data;
            if (FL_Status !== 3) {
                if (FL_Status === 1) {
                    var sms_content = 'Sorry Vehicle data is not available.\n\
' + objSmsRequest['registration_no'] + '\n\
Customer Care will contact you further.';
                }
                if (FL_Status === 2) {
                    var sms_content = 'Sorry Vehicle data is not mapped.\n\
' + objSmsRequest['registration_no'] + '\n\
Customer Care will contact you further.';
                }
                arrSmsList['Msg'] = sms_content;
                objSms.send_sms(objSmsRequest['receiver_mobile_no'], sms_content, sms_id, arrSmsList);
                if (objSmsRequest['sender_mobile_no'] !== objSmsRequest['receiver_mobile_no']) {
                    objSms.send_sms(objSmsRequest['sender_mobile_no'], sms_content, sms_id, arrSmsList);
                }
            } else {


                var sms_quote_request = objVehicle.prepareMotorQuoteRequest(data, objSmsRequest, objDbPosp);

                var args = {
                    data: sms_quote_request,
                    headers: {
                        "Content-Type": "application/json",
                        'client_key': sms_quote_request.client_key,
                        'secret_key': sms_quote_request.secret_key
                    }
                };
                var Client = require('node-rest-client').Client;
                var client = new Client();
                //console.log('args', args);
                client.post(config.environment.weburl + '/quote/premium_initiate', args, function (data, response) {
                    console.log(data);
                    if (data.Summary.Request_Unique_Id) {
                        //welcome start
                        if (objSmsRequest['request_type'] === 'QUOTE' || objSmsRequest['request_type'] === 'SQUOTE') {
                            var arrSmsList = {
                                'Start': '',
                                'Quote': [],
                                'Summary': ''
                            };

//                    var sms_content = objSms.initiateQuoteMsg(FastLaneData, objSmsRequest);
//                    arrSmsList.Start = sms_content;
//                    objSms.send_sms(objSmsRequest['receiver_mobile_no'], sms_content, sms_id, arrSmsList);

                            var objWelcome = {
                                '___sender_name___': objSmsRequest['sender_name'].toString().replace('_', ' '),
                                '___receiver_name___': objSmsRequest['receiver_name'].toString().replace('_', ' '),
                                '___registration_number___': FastLaneData["Registration_Number"],
                                '___vehicle_name___': FastLaneData['Make_Name'] + ' ' + FastLaneData['Model_Name'] + ' ' + FastLaneData['Variant_Name'],
                                '___regn_dt___': FastLaneData['FastlaneResponseObj']['regn_dt']
                            };
                            var QuotePageURL = config.environment.portalurl + '/CarInsuranceIndia/QuotePageNew?SID=' + data.Summary['Request_Unique_Id'] + '&ClientID=6';
                            var Short_Url = require('../models/short_url');
                            var objShortUrl = new Short_Url();
                            objShortUrl.create_short_url_quote('WELCOME', QuotePageURL, objSmsRequest, objWelcome, sms_id, arrSmsList);

                            // var sms_quote_request = objVehicle.prepareMotorQuoteRequest(data, objSmsRequest, objDbPosp);
                        }

                        if (objSmsRequest['request_type'] === 'PQUOTE') {
                            var arrSmsList = {
                                'PospStart': '',
                                'CustomerStart': '',
                                'Quote': [],
                                'Summary': '',
                                'AgentBOAck': ''
                            };
                            //send msg to agent

                            var objWelcome = {
                                '___posp_id___': objDbPosp.Posp_Id,
                                '___posp_name___': objDbPosp.Name,
                                '___posp_mobile___': objDbPosp.Mobile,
                                '___receiver_name___': objSmsRequest['receiver_name'].toString().replace('_', ' '),
                                '___registration_number___': FastLaneData["Registration_Number"],
                                '___vehicle_name___': FastLaneData['Make_Name'] + ' ' + FastLaneData['Model_Name'] + ' ' + FastLaneData['Variant_Name'],
                                '___regn_dt___': FastLaneData['FastlaneResponseObj']['regn_dt']
                            };
                            var QuotePageURL = config.environment.portalurl + '/CarInsuranceIndia/QuotePageNew?SID=' + data.Summary['Request_Unique_Id'] + '&ClientID=6';
                            var Short_Url = require('../models/short_url');
                            var objShortUrl = new Short_Url();
                            objShortUrl.create_short_url_quote('WELCOME', QuotePageURL, objSmsRequest, objWelcome, sms_id, arrSmsList);

                            //var sms_quote_request = objVehicle.prepareMotorQuoteRequest(data, objSmsRequest, objDbPosp);
                        }
                        //welcome finish
                        var sleep = require('system-sleep');
                        sleep(5000);
                        var args = {
                            data: {
                                "search_reference_number": data.Summary.Request_Unique_Id,
                                'client_key': sms_quote_request.client_key,
                                'secret_key': sms_quote_request.secret_key,
                                'response_version': '2.0'
                            },
                            headers: {
                                "Content-Type": "application/json",
                                'client_key': sms_quote_request.client_key,
                                'secret_key': sms_quote_request.secret_key
                            }
                        };
                        var insurer_list = [];
                        var insurer_id_list = [];
                        var premium_list = [];
                        var complete;
                        complete = false;
                        var Request_Id = data.Summary.Request_Id;
                        for (var x = 0; x < 5; x++) {
                            var Client = require('node-rest-client').Client;
                            var client = new Client();
                            //console.log('args', args);
                            if (complete === false) {
                                client.post(config.environment.weburl + '/quote/premium_list_db', args, function (data, response) {
                                    console.log(data);
                                    var PremiumResp = data.Response;
                                    for (var k in PremiumResp) {
                                        if (insurer_id_list.indexOf(PremiumResp[k]['Insurer_Id']) > -1) {
                                            continue;
                                        }
                                        if (PremiumResp[k]['Completion_Summary'].Status === 'complete' && PremiumResp[k].Error_Code === '') {
                                            var objReplace = {
                                                '___Request_Id___': data.Summary.Request_Id,
                                                '___Service_Log_Id___': PremiumResp[k]['Service_Log_Id'],
                                                '___insurer_name___': PremiumResp[k]['Insurer']['Insurer_Code'].toString().replace(/ /g, ''),
                                                '___vehicle_expected_idv___': objSms.indianMoneyFormat(PremiumResp[k]['LM_Custom_Request']['vehicle_expected_idv']),
                                                '___base_premium___': objSms.indianMoneyFormat(PremiumResp[k]['Premium_Breakup']['final_premium']),
                                                '___addon_list___': ''
                                            };
                                            insurer_id_list.push(PremiumResp[k]['Insurer_Id']);
                                            insurer_list.push('  ' + PremiumResp[k]['Insurer']['Insurer_Code'].toString().replace(/ /g, ''));
                                            premium_list.push(PremiumResp[k]['Premium_Breakup']['final_premium']);
                                            var addon_list = '';
                                            var arr_addon_list = [];
                                            for (var j in PremiumResp[k]['Addon_List']) {
                                                var key = j.toString().replace('addon_', '').replace('_cover', '').replace(/\_/g, ' ');
                                                key = objSms.camelize(key);
                                                var keyCode = '';
                                                var addKey = key.split(' ');
                                                for (var h in addKey) {
                                                    keyCode += addKey[h].substr(0, 1);
                                                }
                                                //arr_addon_list.push('   ' + key + '(' + keyCode + ') : ' + objSms.indianMoneyFormat(PremiumResp[k]['Addon_List'][j]) + ' INR');
                                                arr_addon_list.push(keyCode + ':' + objSms.indianMoneyFormat(PremiumResp[k]['Addon_List'][j]));
                                            }
                                            addon_list = arr_addon_list.join('\n');

                                            if (addon_list !== '') {
                                                addon_list = "Addon\n" + addon_list;
                                            } else {
                                                addon_list = 'No Addon';
                                            }
                                            objReplace['___addon_list___'] = addon_list;
                                            console.log(objReplace);
                                            //var sms_content = objSms.InsurerQuoteMsg(objReplace);
                                            //arrSmsList.Quote.push(sms_content);

                                            var sale_method = '';
                                            var is_customer = '';
                                            if (objSmsRequest['request_type'] === 'QUOTE' || objSmsRequest['request_type'] === 'SQUOTE') {
                                                sale_method = 'NONPOSP';
                                                is_customer = '0';
                                            }
                                            if (objSmsRequest['request_type'] === 'PQUOTE') {
                                                sale_method = 'POSP';
                                                is_customer = '1';
                                            }
                                            var BuyPageURL = config.environment.portalurl + '/buynowTwoWheeler/6/' + PremiumResp[k]['Service_Log_Unique_Id'] + '/' + sale_method + '/' + is_customer;
                                            var Short_Url = require('../models/short_url');
                                            var objShortUrl = new Short_Url();
                                            objShortUrl.create_short_url_quote('QUOTE', BuyPageURL, objSmsRequest, objReplace, sms_id, arrSmsList);

                                            /* if (objSmsRequest['request_type'] === 'QUOTE') {
                                             objSms.send_sms(objSmsRequest['sender_mobile_no'], sms_content, sms_id, arrSmsList);
                                             }
                                             if (objSmsRequest['request_type'] === 'SQUOTE') {
                                             objSms.send_sms(objSmsRequest['receiver_mobile_no'], sms_content, sms_id, arrSmsList);
                                             }
                                             if (objSmsRequest['request_type'] === 'PQUOTE') {
                                             objSms.send_sms(objSmsRequest['receiver_mobile_no'], sms_content, sms_id, arrSmsList);
                                             if (objSmsRequest['sender_mobile_no'] !== objSmsRequest['receiver_mobile_no']) {
                                             objSms.send_sms(objSmsRequest['sender_mobile_no'], sms_content, sms_id, arrSmsList);
                                             }
                                             }
                                             */

                                        }
                                        sleep(2000);
                                    }
                                    if (data.Summary.Status === 'complete' || x === 4) {
                                        complete = true;
                                        var objSummary = {
                                            '___insurer_list___': insurer_list.join('\n'),
                                            '___idv_range___': objSms.indianMoneyFormat(data.Summary.vehicle_min_idv) + '-' + objSms.indianMoneyFormat(data.Summary.vehicle_max_idv),
                                            '___premium_range___': objSms.indianMoneyFormat(Math.min.apply(null, premium_list)) + '-' + objSms.indianMoneyFormat(Math.max.apply(null, premium_list)),
                                            '___srn___': data.Summary.Request_Id
                                        };
                                        /*var QuotePageURL = config.environment.portalurl + '/CarInsuranceIndia/QuotePageNew?SID=' + data.Summary['Request_Unique_Id'] + '&ClientID=6';
                                         var Short_Url = require('../models/short_url');
                                         var objShortUrl = new Short_Url();
                                         objShortUrl.create_short_url_quote('SUMMARY', QuotePageURL, objSmsRequest, objSummary, sms_id, arrSmsList);
                                         */
                                        var sms_content = objSms.finishQuoteMsg(objSummary);
                                        arrSmsList.Summary = sms_content;
                                        if (objSmsRequest['request_type'] === 'QUOTE') {
                                            objSms.send_sms(objSmsRequest['sender_mobile_no'], sms_content, sms_id, arrSmsList);
                                        }
                                        if (objSmsRequest['request_type'] === 'SQUOTE') {
                                            objSms.send_sms(objSmsRequest['receiver_mobile_no'], sms_content, sms_id, arrSmsList);
                                        }
                                        if (objSmsRequest['request_type'] === 'PQUOTE') {
                                            objSms.send_sms(objSmsRequest['receiver_mobile_no'], sms_content, sms_id, arrSmsList);
                                            if (objSmsRequest['sender_mobile_no'] !== objSmsRequest['receiver_mobile_no']) {
                                                objSms.send_sms(objSmsRequest['sender_mobile_no'], sms_content, sms_id, arrSmsList);
                                            }
                                        }

                                    }
                                });
                                sleep(8000);
                            }
                        }
                    } else {
                        console.log('Console not generated');
                    }
                });
            }
            //objSms.send_sms(mobile_no, sms_content, sms_id);

        }


    });
};
Vehicle.prototype.prepareMotorDetails = function (objFastlane) {
    var objContentSms = {
        "PBId": objFastlane['Variant_Id'],
        "PBName": objFastlane['Make_Name'] + '_' + objFastlane['Model_Name'] + '_' + objFastlane['Variant_Name'],
        "FLId": objFastlane['FastlaneResponseObj']['vehicle_cd'],
        "FLName": objFastlane['FastlaneResponseObj']['fla_maker_desc'] + '_' + objFastlane['FastlaneResponseObj']['fla_model_desc'] + '_' + objFastlane['FastlaneResponseObj']['fla_fuel_type_desc'] + '_' + objFastlane['FastlaneResponseObj']['fla_cubic_cap'],
        "RtoName": objFastlane['FastlaneResponseObj']['maker_desc'] + '_' + objFastlane['FastlaneResponseObj']['maker_model'] + '_' + objFastlane['FastlaneResponseObj']['fuel_type_desc'] + '_' + objFastlane['FastlaneResponseObj']['cubic_cap'],
        "PurDate": objFastlane['FastlaneResponseObj']['purchase_dt'],
        "RegDate": objFastlane['FastlaneResponseObj']['regn_dt'],
        "Rto": objFastlane['FastlaneResponseObj']['state_cd'] + '_' + objFastlane['FastlaneResponseObj']['rto_name']
    };
    var contentSms = '';
    for (var k in objContentSms) {
        contentSms += k + ' : ' + objContentSms[k] + '\n';
    }
    return contentSms;

};


Vehicle.prototype.prepareMotorQuoteRequest = function (objFastlane, objSmsRequest, objDbPosp = null) {
    var objBase = new Base();
    var Sender_Name = objSmsRequest['sender_name'].toString().replace('_', ' ');
    var Receiver_Name = objSmsRequest['receiver_name'].toString().replace('_', ' ');
    var arr_Receiver_Name = objSmsRequest['receiver_name'].toString().split('_');
    //Registration Date Creation
    var policy_start_date = new Date(), policy_expiry_date = new Date(), vehicle_registration_date = new Date();

    vehicle_registration_date = objFastlane['FastlaneResponseObj']['purchase_dt'];
    vehicle_registration_date = vehicle_registration_date.split('/');
    if (vehicle_registration_date[0] < 10) {
        vehicle_registration_date[0] = '0' + vehicle_registration_date[0].toString();
    }
    if (vehicle_registration_date[1] < 10) {
        vehicle_registration_date[1] = '0' + vehicle_registration_date[1].toString();
    }
    var vehicle_manf_year = vehicle_registration_date[2];
    var vehicle_manf_month = vehicle_registration_date[1];
    vehicle_registration_date = vehicle_registration_date.reverse().join('-');

    vehicle_registration_date = new Date(vehicle_registration_date);
    //Expiry Date Creation
    if (objSmsRequest['policy_expiry_date'] === '') {
        var todayDate = objBase.todayDate().toString();
        todayDate = new Date(todayDate);
        policy_start_date.setDate(todayDate.getDate() + 16);
        policy_expiry_date.setDate(todayDate.getDate() + 15);
        objSmsRequest['policy_expiry_date'] = objBase.date_format(policy_expiry_date, 'yyyy-MM-dd').toString();

        //registration date
        vehicle_registration_date.setMonth(policy_start_date.getMonth());
        vehicle_registration_date.setDate(policy_start_date.getDate());
    }

    if (objSmsRequest['is_claim_exists'] === 'no' && objSmsRequest['vehicle_ncb_current'] === '') {
        var age_in_months = moment(policy_start_date).diff(vehicle_registration_date, 'months');

        var cons_ncb = {
            'age_12': '0',
            'age_24': '20',
            'age_36': '25',
            'age_48': '35',
            'age_60': '45',
            'age_72': '50',
            'age_84': '55'
        };

        for (var key in cons_ncb) {
            var age = key.split('_')[1] - 0
            if (age <= age_in_months) {
                objSmsRequest['vehicle_ncb_current'] = cons_ncb[key];
            } else {
                break;
            }
        }


    }


    vehicle_registration_date = objBase.date_format(vehicle_registration_date, 'yyyy-MM-dd').toString();
    policy_start_date = objBase.date_format(policy_start_date, 'yyyy-MM-dd').toString();

    var is_posp = 'no', posp_id = 0;
    if (objDbPosp && objSmsRequest['receiver_mobile_no'] !== objSmsRequest['sender_mobile_no']) {
        is_posp = 'yes';
        posp_id = objDbPosp.Posp_Id;
    }

    var objContentSms = {
        "product_id": 1,
        "vehicle_id": objFastlane['Variant_Id'],
        "rto_id": 100,
        "vehicle_insurance_type": "renew",
        "vehicle_manf_date": vehicle_registration_date,
        "vehicle_registration_date": vehicle_registration_date,
        "policy_expiry_date": objSmsRequest['policy_expiry_date'],
        "vehicle_registration_type": "individual",
        "vehicle_ncb_current": objSmsRequest['vehicle_ncb_current'],
        "is_claim_exists": objSmsRequest['is_claim_exists'],
        "birth_date": "1981-12-07",
        "method_type": "Premium",
        "execution_async": "yes",
        "registration_no": objSmsRequest['registration_no'],
        "electrical_accessory": "0",
        "non_electrical_accessory": "0",
        "voluntary_deductible": "0",
        "is_llpd": "no",
        "is_external_bifuel": "no",
        "external_bifuel_value": "0",
        "pa_owner_driver_si": "0",
        "pa_named_passenger_si": "0",
        "pa_unnamed_passenger_si": "0",
        "pa_paid_driver_si": "0",
        "first_name": arr_Receiver_Name[0].toString(),
        "last_name": (typeof arr_Receiver_Name[1] === 'undefined') ? '' : arr_Receiver_Name[1].toString(),
        "mobile": objSmsRequest['receiver_mobile_no'],
        "secret_key": "SECRET-INGFSQU6-CFAD-YRDA-EQX4-XEOE3GGYLDWG",
        "client_key": "CLIENT-RF0W5BRK-DUM4-CZDB-3HQR-GLRHEJE79DP6",
        "is_posp": is_posp,
        "posp_id": posp_id,
        'sms_id': objSmsRequest.sms_id,
        'crn': 0
    };
    console.log(JSON.stringify(objContentSms));
    return objContentSms;

};
Vehicle.prototype.dateFormatConversion = function (dateVal, sourceDateFormat, targetDateFormat) {

};
Date.prototype.addDays = function (days) {
    this.setDate(this.getDate() + parseInt(days));
    return this;
};
// make this available to our users in our Node applications
module.exports = Vehicle;