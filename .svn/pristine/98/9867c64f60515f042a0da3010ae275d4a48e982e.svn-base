/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var express = require('express');
var config = require('config');
var sleep = require('system-sleep');
var moment = require('moment');
const objMongoDB = null;
var path = require('path');
const bodyParser = require('body-parser');
var appRoot = path.dirname(path.dirname(require.main.filename));
var fs = require('fs');
var config = require('config');
var fs = require('fs');
var moment = require('moment');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var post_sale = ["Policy not received", "Post Sale Query", "Endorsement", "Claim Related", "Received policy copy, CRN is not marked as sell", "Done payment but not received policy copy"];
var const_arr_insurer = {
    "Insurer_1": "Bajaj",
    "Insurer_4": "FutureGenerali",
    "Insurer_16": "RahejaQBE",
    "Insurer_3": "Chola",
    "Insurer_19": "UniversalSompo",
    "Insurer_47": "DHFL",
    "Insurer_13": "Oriental",
    "Insurer_11": "TataAIG",
    "Insurer_44": "Digit",
    "Insurer_46": "Edelweiss",
    "Insurer_45": "Acko",
    "Insurer_5": "HdfcErgo",
    "Insurer_6": "IciciLombard",
    "Insurer_10": "RoyalSundaram",
    "Insurer_33": "LibertyVideocon",
    "Insurer_2": "Bharti",
    "Insurer_9": "Reliance",
    "Insurer_14": "United",
    "Insurer_30": "Kotak",
    "Insurer_7": "IffcoTokio",
    "Insurer_12": "NewIndia"
};
var arr_ins = {1: "BajajAllianz", 2: "BhartiAxa", 3: "Cholamandalam MS", 4: "Future Generali", 5: "HDFCERGO", 6: "ICICILombard", 7: "IFFCOTokio", 8: "National Insurance", 9: "Reliance", 10: "RoyalSundaram", 11: "TataAIG", 12: "New India", 13: "Oriental", 14: "UnitedIndia", 15: "L&amp;T General", 16: "Raheja QBE", 17: "SBI General", 18: "Shriram General", 19: "UniversalSompo", 20: "Max Bupa", 21: "HDFC ERGO Health", 22: "DLF Pramerica", 23: "Bajaj Allianz", 24: "IndiaFirst", 25: "AEGON Religare", 26: "Star Health", 27: "Express BPO", 28: "HDFC Life", 29: "Bharti Axa", 30: "Kotak Mahindra", 31: "LIC India", 32: "Birla Sun Life", 33: "LibertyGeneral", 34: "Care Health", 35: "Magma HDI", 36: "Indian Health Organisation", 37: "TATA AIA", 38: "Manipal Cigna", 39: "ICICI Pru", 42: "Aditya Birla", 43: "Edelweiss Tokio Life", 44: "GoDigit", 45: "Acko", 46: "Edelweiss", 48: 'Kotak', 47: "DHFL", 100: "FastLaneVariantMapping", 101: "Landmark"};
var const_email_env_sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']'));
var router = express.Router();
function execute_post(url, args) {
    let Client = require('node-rest-client').Client;
    let client = new Client();
    client.post(url, args, function (data, response) {
        if (data && args.hasOwnProperty('data') && args['data'].hasOwnProperty('method_type') && args['data']['method_type'] === 'Pdf' && data.Error_Code && data.Error_Code === '') {
            //email notification process
            var Base = require(appRoot + '/libs/Base');
            var objBase = new Base();
            objBase.send_policy_upload_notification(args['data']['udid']);
        }
    });
}

module.exports.controller = function (app) {
    app.get('/horizon_job/hdfcergo_breakin_ids', function (req, res, next) {
        //console.log('Start', this.constructor.name, 'hdfcergo_breakin_ids');
        try {
            var cond = {"Status": {$in: ["INSPECTION_SCHEDULED", "INSPECTION_APPROVED"]}};
            var day_back = 5;
            if (req.query.hasOwnProperty('range')) {
                day_back = req.query['range'];
            }

            var today = moment().utcOffset("+05:30").startOf('Day');
            var fromDate = moment(today).format("YYYY-MM-D");
            var toDate = moment(today).format("YYYY-MM-D");
            var arrFrom = fromDate.split('-');
            var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 1, arrFrom[2] - 0);
            dateFrom.setDate(dateFrom.getDate() - day_back);
            var arrTo = toDate.split('-');
            var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 1, arrTo[2] - 0);
            dateTo.setDate(dateTo.getDate() + 1);
            cond['Created_On'] = {"$gte": dateFrom, "$lte": dateTo};
            var hdfcergo_breakin = require('../models/hdfcergo_breakin');
            hdfcergo_breakin.find(cond).select(['UD_Id', 'Agent_Code', 'Proposal_Number', 'PB_CRN', 'Created_On', 'Status']).exec(function (err, dbUsers) {
                if (err) {
                    res.send(err);
                }
                try {
                    if (!err) {
                        console.error('Log', 'hdfcergo_breakin_ids', dbUsers);
                        var objCSSummary = [];
                        for (var k in dbUsers) {
                            var user = dbUsers[k]._doc;
                            //console.log('Log', 'user', user);
                            var args = {
                                data: {
                                    "AgentCode": user['Agent_Code'],
                                    "udid": user['UD_Id'],
                                    "PB_CRN": user['PB_CRN'],
                                    "PGTransNo": user['Proposal_Number'],
                                    "Status": user['Status']
                                },
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            };
                            objCSSummary.push(user);
                            var url_api = config.environment.weburl + '/quote/hdfcergo_breakin_data';
                            execute_post(url_api, args);
                            sleep(2000);
                        }
                        //log email
                        var msg = '<!DOCTYPE html><html><head><title>EPR CS SYNC</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                        msg += '<div class="report" ><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">BREAKIN_SCHEDULE</span><table style="-moz-box-shadow: 1px 1px 3px 2px #d3d3d3;-webkit-box-shadow: 1px 1px 3px 2px #d3d3d3;  box-shadow:         1px 1px 3px 2px #d3d3d3;" border="0" cellpadding="3" cellspacing="0" width="95%"  >';
                        var row_inc = 0;
                        for (var k in objCSSummary) {
                            if (row_inc === 0) {
                                msg += '<tr>';
                                for (var k_head in objCSSummary[k]) {
                                    msg += '<th style="font-size:12px;font-family:\'Google Sans\' ,tahoma;background-color: #d7df01">' + k_head + '</th>';
                                }
                                msg += '</tr>';
                            }
                            msg += '<tr>';
                            for (var k_row in objCSSummary[k]) {
                                msg += '<td style="font-size:12px;font-family:\'Google Sans\' ,tahoma;" align="center">' + objCSSummary[k][k_row] + '</td>';
                            }
                            msg += '</tr>';
                            row_inc++;
                        }
                        msg += '</table></div>';
                        var Email = require('../models/email');
                        var objModelEmail = new Email();
                        var SmsLog = require('../models/sms_log');
                        var objsmsLog = new SmsLog();
                        let dt = new Date();
                        var arrCc = ['vikram.jena@policyboss.com', 'anuj.singh@policyboss.com'];
                        var sub = '[' + config.environment.name.toString().toUpperCase() + '-SCHEDULE]';
                        var today = moment().format('YYYY-MM-DD_HH:mm:ss');
                        sub += 'BREAKIN_PROCESS::' + today.toString();
                        objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, sub, msg, arrCc.join(','), '', '');
                        let obj_err_sms = {
                            '___date_time___': dt.toLocaleString(),
                            '___name___': 'HDFCErgo Breakin Ids'
                        };
                        let sms_data = objsmsLog.leadScheduler(obj_err_sms);
                        objsmsLog.send_sms('9619160851', sms_data, 'POLBOS-SCHEDULER'); //Anuj
                        objsmsLog.send_sms('9768463482', sms_data, 'POLBOS-SCHEDULER'); //Vikram
                        ////log email
                        res.json(objCSSummary);
                    }
                } catch (ex) {
                    console.error('Exception', 'hdfcergo_breakin_ids', ex);
                    res.json(ex);
                }
            });
        } catch (e) {
            console.error('Exception', 'hdfcergo_breakin_ids', e);
            res.json(e);
        }
    });

    app.get('/horizon_job/iciciLombard_check_inspection_status', function (req, res2) {
        let callingService = '', Error_Msg = '';
        //var breakin_inspection_id = req.params['breakin_inspection_id'];
        let breakin_inspection_id = "";
        let args = {};
        try {
            if (config.environment.name.toString() === 'Production') {
                callingService = 'https://app9.icicilombard.com/ILServices/Motor/v1/Breakin/GetStatus';
            } else {
                callingService = 'https://cldilbizapp02.cloudapp.net:9001/ILServices/motor/v1/Breakin/GetStatus';
            }

            var Icici_Token = require(appRoot + '/models/icici_token');
            Icici_Token.findOne({'Product_Id': 1}, null, {sort: {'Created_On': -1}}, function (err, dbIciciToken) {
                if (err) {
                    console.error('/iciciLombard_check_inspection_status Icici Token not Found', err);
                } else {
                    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
                    //var dbIciciToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjZCN0FDQzUyMDMwNUJGREI0RjcyNTJEQUVCMjE3N0NDMDkxRkFBRTEiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJhM3JNVWdNRnY5dFBjbExhNnlGM3pBa2ZxdUUifQ.eyJuYmYiOjE1OTEwODY4ODYsImV4cCI6MTU5MTA5MDQ4NiwiaXNzIjoiaHR0cHM6Ly9jbGRpbGJpemFwcDAyLmNsb3VkYXBwLm5ldDo5MDAxL2NlcmJlcnVzIiwiYXVkIjpbImh0dHBzOi8vY2xkaWxiaXphcHAwMi5jbG91ZGFwcC5uZXQ6OTAwMS9jZXJiZXJ1cy9yZXNvdXJjZXMiLCJlc2Jtb3RvciJdLCJjbGllbnRfaWQiOiJyby5sYW5kbWFyayIsInN1YiI6IjJhYjIxM2E0LTBlZTItNDgzNS05YWUyLTFkZGFhMjYwYzlhMCIsImF1dGhfdGltZSI6MTU5MTA4Njg4NiwiaWRwIjoibG9jYWwiLCJzY29wZSI6WyJlc2Jtb3RvciJdLCJhbXIiOlsiY3VzdG9tIl19.lWlhLSkiY9Pkc5G9GMWpINr2pBObx4GR9VLGDQi2hXz49idW9D7pK9mUTkuh9sVxcpq4sm0sqR0k6JnkSC9qVNAGDKGODpf6gJy3bO0dP9Kq0N_5OKPNMmQiAXwIKUIWD67csHlrJoa0FNCo_P0bYpfbaHc4uSLN3kd9TUVPiCHcQisYFYbg4p0j0h7osm8lDHQ05vQ6O-zLoHJVdFpnat5xyD7OU1NNfLNia8iIN7EhfIyda9INFRoExfxBRzEwCIFwP6ZZv5lIhbek_FrJhG_J_ElEUVx52n2lS8scvTer3toF-Sb-DbpgQvLqYVUgQwfmwTM42R2F9yu8K9mu0Q";
                    console.log('iciciLombard_check_inspection_status() dbIciciToken from DB : ', dbIciciToken);
                    args = {
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "Authorization": "Bearer " + dbIciciToken['Token']
                        }
                    };
                    //console.log('iciciLombard_check_inspection_status Request :: ', JSON.stringify(args));

                    let Client = require('node-rest-client').Client;
                    let client = new Client();
                    client.get(callingService, args, function (data, response) {
                        console.error('ICICI Lombard - GetStatus service - Response : ', JSON.stringify(data));
                        if (data) {
                            //data['status'] = 'true';
                            //data['statusMessage'] = 'Success';
                            //data['inspectionStatus'] = 'Recommended';
                            //data['breakInInsuranceID'] = breakin_inspection_id;
                            if ((data.hasOwnProperty('status') && data['status'] === 'true') && (data.hasOwnProperty('statusMessage') && data['statusMessage'] === 'Success') && (data.hasOwnProperty('inspectionStatus') && (data['inspectionStatus'] === 'Recommended' || data['inspectionStatus'] === 'Rejected'))) {
                                if (data.hasOwnProperty('breakInInsuranceID')) {
                                    console.error('ICICI Lombard - GetStatus service - Response - Breakin ID : ', data['breakInInsuranceID']);
                                    breakin_inspection_id = data['breakInInsuranceID'];
                                    let inspectionSchedules = require(appRoot + '/models/inspection_schedule');
                                    inspectionSchedules.findOne({Inspection_Id: breakin_inspection_id}, function (err, dbUsers) {
                                        if (err) {
                                            res2.send(err);
                                        } else {
                                            try {
                                                if (dbUsers) {
                                                    let args2 = {
                                                        data: dbUsers['_doc'],
                                                        headers: {
                                                            "Content-Type": "application/json"
                                                        }
                                                    };
                                                    console.error('ICICI Lombard - /quote/iciciLombard_update_inspection_status - POST calling Request : ', JSON.stringify(args2));
                                                    let url_api = config.environment.weburl + '/quote/iciciLombard_update_inspection_status';
                                                    execute_post(url_api, args2);
                                                    sleep(2000);
                                                    var Email = require('../models/email');
                                                    var objModelEmail = new Email();
                                                    var SmsLog = require('../models/sms_log');
                                                    var objsmsLog = new SmsLog();
                                                    let dt = new Date();
                                                    var arrCc = ['vikram.jena@policyboss.com', 'anuj.singh@policyboss.com'];
                                                    var email_body = '<html><body><p>Hi,</p><BR/><p>ICICILombard Inspection Status Scheduler Sucessfull.</p>'
                                                            + '<BR><p>Date-Time : ' + moment().format('YYYYMMDD_HH:mm:ss') + '</p></body></html>';
                                                    let sub = '[SCHEDULER]ICICILombard_Inspection_Status :: ' + moment().format('YYYYMMDD_HH:mm:ss');
                                                    objModelEmail.send('noreply@landmarkinsurance.co.in', 'anuj.singh@policyboss.com', sub, email_body, arrCc.join(','), '', '');
                                                    let obj_err_sms = {
                                                        '___date_time___': dt.toLocaleString(),
                                                        '___name___': 'ICICILombard Check Inspection Status'
                                                    };
                                                    let sms_data = objsmsLog.leadScheduler(obj_err_sms);
                                                    objsmsLog.send_sms('9619160851', sms_data, 'POLBOS-SCHEDULER'); //Anuj
                                                    objsmsLog.send_sms('9768463482', sms_data, 'POLBOS-SCHEDULER'); //Vikram
                                                    res2.json({'Status': Error_Msg});
                                                }
                                            } catch (ex) {
                                                console.error('Exception in iciciLombard_check_inspection_status() for inspectionSchedules db details : ', ex);
                                                res2.send(ex, dbUsers);
                                            }
                                        }
                                    });
                                }
                            } else if ((data.hasOwnProperty('status') && data['status'] === 'false') && (data.hasOwnProperty('statusMessage') && data['statusMessage'] === 'Failed') && (data.hasOwnProperty('message') && data['message'] === 'No more Item in Queue')) {
                                console.error('ICICI Lombard GetStatus : ', data['message']);
                                Error_Msg = data['message'];
                                res2.json({'Status': Error_Msg});
                            } else {
                                console.error('ICICI Lombard GetStatus : ', JSON.stringify(data));
                                Error_Msg = JSON.stringify(data);
                                res2.json({'Status': Error_Msg});
                            }
                        }
                    });
                }
            });
        } catch (ex2) {
            console.error('Exception in iciciLombard_check_inspection_status() for User_Data db details : ', ex2);
            res2.json({'Status': ex2});
        }
//res2.json({'Status': Error_Msg});
    });

    app.post('/horizon_job/hdfcergo_breakin_data', function (req, res2, next) {
        var not_verified_result = JSON.parse(JSON.stringify(req.body));
        var UD_Id = not_verified_result['udid'] - 0;
        var PB_CRN = not_verified_result['PB_CRN'] - 0;
        var Status = not_verified_result['Status'];
        var Proposal_Number = not_verified_result['PGTransNo'];
        var Agent_Code = not_verified_result['AgentCode'];
        console.log('Proposal_Number :', Proposal_Number, '- Agent_Code :', Agent_Code);
        var args = {
            AgentCode: Agent_Code,
            PGTransNo: Proposal_Number //'MT1902048737T'
        };
        var callingService = '';
        if (config.environment.name.toString() === 'Production')
        {
            callingService = 'https://hewspool.hdfcergo.com/motorcp/service.asmx?WSDL';
        } else {
            callingService = 'http://202.191.196.210/uat/onlineproducts/newmotorcp/service.asmx?WSDL';
        }
        var Error_Msg = '';
        var soap = require('soap');
        var xml2js = require('xml2js');
        soap.createClient(callingService, function (err, client) {
            client['GetBreakinInspectionStatus'](args, function (err1, result, raw, soapHeader) {
                if (err1) {
                    console.error('HDFCErgoMotor', 'service_call', 'exception', err1);
                    var objResponseFull = {
                        'err': err1,
                        'result': result,
                        'raw': raw,
                        'soapHeader': soapHeader,
                        'objResponseJson': null
                    };
                    console.error('HDFCErgo Check BreakInStatus service response :', objResponseFull);
                } else
                {
                    var objResponseJson = {};
                    var objResponseJsonLength = Object.keys(result).length;
                    var processedXml = 0;
                    for (var key in result)
                    {
                        var keyJsonObj = JSON.parse('{"' + key + '":{}}');
                        Object.assign(objResponseJson, keyJsonObj);
                        xml2js.parseString(result[key], function (err2, objXml2Json) {
                            processedXml++;
                            if (err2) {
                                console.error('HDFCErgoMotor', 'service_call', 'xml2jsonerror', err2);
                                var objResponseFull = {
                                    'err': err2,
                                    'result': result,
                                    'raw': raw,
                                    'soapHeader': soapHeader,
                                    'objResponseJson': null
                                };
                                console.error('HDFCErgo BreakInStatus - xml2js Exception :', objResponseFull);
                            } else {
                                objResponseJson[key] = objXml2Json;
                                if (processedXml === objResponseJsonLength) {
                                    var objResponseFull = {
                                        'result': result,
                                        'raw': raw,
                                        'soapHeader': soapHeader,
                                        'objResponseJson': objResponseJson
                                    };
                                    //log
                                    var today = moment().utcOffset("+05:30");
                                    var today_str = moment(today).format("YYYYMMD");
                                    var objRequest = {
                                        'dt': today.toLocaleString(),
                                        'req': Proposal_Number,
                                        'resp': objResponseJson
                                    };
                                    fs.appendFile(appRoot + "/tmp/log/hdfc_inspection_response_" + today_str + ".log", JSON.stringify(objRequest) + "\r\n", function (err) {
                                        if (err) {
                                            return console.log(err);
                                        }
                                        console.log("The file was saved!");
                                    });
                                    //log
                                    if (objResponseJson.hasOwnProperty('GetBreakinInspectionStatusResult')) {
                                        if (objResponseJson['GetBreakinInspectionStatusResult'].hasOwnProperty(['BreakinDTO'])) {
                                            if (objResponseJson['GetBreakinInspectionStatusResult']['BreakinDTO'].hasOwnProperty(['BreakInStatus'])) {
                                                var hdfcergo_breakin_status = '';
                                                var user_data_status = '';
                                                var email_template = '';
                                                var email_sub_status = '';
                                                var insurer_inspection_status = objResponseJson['GetBreakinInspectionStatusResult']['BreakinDTO']['BreakInStatus']['0'];
                                                if (insurer_inspection_status === 'RECOMMENDED' || insurer_inspection_status === 'NOT RECOMMENDED' || insurer_inspection_status === 'ISSUED')
                                                {
                                                    if (insurer_inspection_status === 'RECOMMENDED') {
                                                        hdfcergo_breakin_status = 'INSPECTION_APPROVED';
                                                        user_data_status = 'INSPECTION_APPROVED';
                                                        email_template = 'Send_Successful_Inspection.html';
                                                        email_sub_status = 'Successful';
                                                    }
                                                    if (insurer_inspection_status === 'NOT RECOMMENDED') {
                                                        hdfcergo_breakin_status = 'INSPECTION_REJECTED';
                                                        user_data_status = 'INSPECTION_REJECTED';
                                                        email_template = 'Send_UnSuccessful_Inspection.html';
                                                        email_sub_status = 'Unsuccessful';
                                                    }
                                                    if (insurer_inspection_status === 'ISSUED') {
                                                        hdfcergo_breakin_status = 'POLICY_ISSUED';
                                                        user_data_status = 'INSPECTION_POLICY_ISSUED';
                                                        email_template = '';
                                                        email_sub_status = '';
                                                    }
                                                    var hdfcergo_breakin_db = require(appRoot + '/models/hdfcergo_breakin');
                                                    var date = new Date();
                                                    var myquery = {Proposal_Number: Proposal_Number};
                                                    var newvalues = {$set: {Status: hdfcergo_breakin_status, Modified_On: date}};
                                                    hdfcergo_breakin_db.updateOne(myquery, newvalues, function (err, numaffected) {
                                                        if (err) {
                                                            throw err;
                                                        } else {
                                                            console.log("HDFCErgo : BreakInStatus Updated for:Verified", Proposal_Number);
                                                            console.log("HDFCErgo : UD_Id : ", UD_Id);
                                                        }
                                                    });
                                                    if (insurer_inspection_status === 'ISSUED') {
                                                        var myquery = {
                                                            'PB_CRN': PB_CRN,
                                                            'Proposal_Number': {'$ne': Proposal_Number}
                                                        };
                                                        var newvalues = {$set: {Status: 'CLOSED', Modified_On: date}};
                                                        hdfcergo_breakin_db.update(myquery, newvalues, {multi: true}, function (err, numaffected) {
                                                            if (err) {
                                                                throw err;
                                                            } else {
                                                                console.log("HDFCErgo : BreakInStatus Updated for:Verified", Proposal_Number);
                                                                console.log("HDFCErgo : UD_Id : ", UD_Id);
                                                            }
                                                        });
                                                    }

                                                    try {
                                                        var User_Data = require(appRoot + '/models/user_data');
                                                        var ud_cond = {
                                                            "User_Data_Id": UD_Id,
                                                            'Last_Status': {"$nin": ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY']}
                                                        };
                                                        User_Data.findOne(ud_cond, function (err, dbUserData) {
                                                            if (err) {
                                                                console.error('Exception', err);
                                                            } else {
                                                                if (dbUserData) {
                                                                    dbUserData = dbUserData._doc;
                                                                    var objUserData = {
                                                                        'Last_Status': null,
                                                                        'Status_History': null
                                                                    };
                                                                    var Status_History = (dbUserData.hasOwnProperty('Status_History')) ? dbUserData.Status_History : [];
                                                                    Status_History.unshift({
                                                                        "Status": user_data_status,
                                                                        "StatusOn": new Date()
                                                                    });
                                                                    objUserData.Last_Status = user_data_status;
                                                                    objUserData.Status_History = Status_History;
                                                                    objUserData.Modified_On = new Date();
                                                                    User_Data.update({'User_Data_Id': dbUserData.User_Data_Id}, {$set: objUserData}, function (err, numAffected) {
                                                                        console.log('UserDataUpdated', err, numAffected);
                                                                    });
                                                                    var dataObj = dbUserData['Proposal_Request_Core'];
                                                                    var objRequestCore = {
                                                                        'customer_name': dataObj['first_name'] + ' ' + dataObj['last_name'],
                                                                        'crn': dataObj['crn'],
                                                                        'vehicle_text': dataObj['vehicle_text'],
                                                                        'insurer_name': 'HDFC ERGO GENERAL INSURANCE COMPANY LTD.',
                                                                        'insurance_type': 'RENEW - Breakin Case',
                                                                        'inspection_id': Proposal_Number,
                                                                        'final_premium': dbUserData['Payment_Request']['pg_data']['TxnAmount'],
                                                                        'email_id': dataObj['email'],
                                                                        'registration_no': dbUserData.Proposal_Request['registration_no_1'] + '-' + dbUserData.Proposal_Request['registration_no_2'] + '-' + dbUserData.Proposal_Request['registration_no_3'] + '-' + dbUserData.Proposal_Request['registration_no_4']

                                                                    };
                                                                    var processed_request = {};
                                                                    for (var key in objRequestCore) {
                                                                        if (typeof objRequestCore[key] !== 'object') {
                                                                            processed_request['___' + key + '___'] = objRequestCore[key];
                                                                        }
                                                                    }
                                                                    console.error('Breakin Email', Status, hdfcergo_breakin_status);
                                                                    if ((insurer_inspection_status === 'RECOMMENDED' || insurer_inspection_status === 'NOT RECOMMENDED') && Status === 'INSPECTION_SCHEDULED' && hdfcergo_breakin_status === 'INSPECTION_APPROVED') {
                                                                        var email_data = fs.readFileSync(appRoot + '/resource/email/' + email_template).toString();
                                                                        email_data = email_data.replaceJson(processed_request);
                                                                        var emailto = dataObj['email'];
                                                                        var sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[Car] Inspection Verification ' + email_sub_status + ' CRN : ' + dataObj['crn'];
                                                                        var Email = require(appRoot + '/models/email');
                                                                        var objModelEmail = new Email();
                                                                        var SmsLog = require('../models/sms_log');
                                                                        var objsmsLog = new SmsLog();
                                                                        let dt = new Date();
                                                                        var email_agent = '';
                                                                        if (dbUserData.Premium_Request['posp_email_id'] !== null && dbUserData.Premium_Request['posp_email_id'].toString().indexOf('@') > -1) {
                                                                            email_agent = dbUserData.Premium_Request['posp_email_id'].toString();
                                                                        }
                                                                        var arr_bcc = [config.environment.notification_email, 'vikram.jena@policyboss.com', 'anuj.singh@policyboss.com'];
                                                                        if (dbUserData.Premium_Request.hasOwnProperty('posp_reporting_email_id') && dbUserData.Premium_Request['posp_reporting_email_id'] != '' && dbUserData.Premium_Request['posp_reporting_email_id'] != null) {
                                                                            if (dbUserData.Premium_Request['posp_reporting_email_id'].toString().indexOf('@') > -1) {
                                                                                arr_bcc.push(dbUserData.Premium_Request['posp_reporting_email_id']);
                                                                            }
                                                                        }
                                                                        if (dbUserData['Premium_Request'].hasOwnProperty('posp_sub_fba_email') && dbUserData['Premium_Request']['posp_sub_fba_email'] != null && dbUserData['Premium_Request']['posp_sub_fba_email'].toString().indexOf('@') > -1) {
                                                                            arr_bcc.push(dbUserData['Premium_Request']['posp_sub_fba_email']);
                                                                        }
                                                                        if (config.environment.name === 'Production') {
                                                                            if ((dbUserData.Premium_Request['posp_sources'] - 0) > 0) {
                                                                                if ((dbUserData.Premium_Request['posp_sources'] - 0) === 1) {
                                                                                    arr_bcc.push('transactions.1920@gmail.com'); //finmart-dc 
                                                                                }
                                                                            }
                                                                        }
                                                                        objModelEmail.send('customercare@policyboss.com', emailto, sub, email_data, email_agent, arr_bcc.join(','), dbUserData['PB_CRN']);
                                                                        let obj_err_sms = {
                                                                            '___date_time___': dt.toLocaleString(),
                                                                            '___name___': 'HDFCErgo Breakin Data'
                                                                        };
                                                                        let sms_data = objsmsLog.leadScheduler(obj_err_sms);
                                                                        objsmsLog.send_sms('9619160851', sms_data, 'POLBOS-SCHEDULER'); //Anuj
                                                                        objsmsLog.send_sms('9768463482', sms_data, 'POLBOS-SCHEDULER'); //Vikram
                                                                    }
                                                                    if (insurer_inspection_status === 'ISSUED') {
                                                                        var sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[Car] Inspection Verification "' + insurer_inspection_status + '" CRN : ' + dbUserData['PB_CRN'];
                                                                        var Email = require(appRoot + '/models/email');
                                                                        var objModelEmail = new Email();
                                                                        var SmsLog = require('../models/sms_log');
                                                                        var objsmsLog = new SmsLog();
                                                                        let dt = new Date();
                                                                        var email_data = '<!DOCTYPE html><html><head><title>INSPECTION_NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                                                                        email_data += '<div class="report"><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">INSPECTION_NOTIFICATION</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
                                                                        email_data += '<tr><td  width="70%" style="font-family:\'Google Sans\' ,tahoma;font-size:14px;"><pre>';
                                                                        for (var k in objRequestCore) {
                                                                            email_data += k + ':' + objRequestCore[k] + '<br/>';
                                                                        }
                                                                        email_data += '</pre></td></tr>';
                                                                        email_data += '</table></div><br></body></html>';
                                                                        var arr_bcc = [config.environment.notification_email, 'vikram.jena@policyboss.com', 'anuj.singh@policyboss.com'];
                                                                        objModelEmail.send('noreply@policyboss.com', 'notifications@policyboss.com', sub, email_data, '', arr_bcc.join(','), dbUserData['PB_CRN']);
                                                                        let obj_err_sms = {
                                                                            '___date_time___': dt.toLocaleString(),
                                                                            '___name___': 'HDFCErgo Breakin Data'
                                                                        };
                                                                        let sms_data = objsmsLog.leadScheduler(obj_err_sms);
                                                                        objsmsLog.send_sms('9619160851', sms_data, 'POLBOS-SCHEDULER'); //Anuj
                                                                        objsmsLog.send_sms('9768463482', sms_data, 'POLBOS-SCHEDULER'); //Vikram
                                                                    }
                                                                }

                                                            }
                                                        });
                                                    } catch (ex2) {
                                                        console.error('Exception in hdfcergo_breakin_data() for User_Data db details : ', ex2);
                                                    }
                                                } else {
                                                    if (insurer_inspection_status !== '' && insurer_inspection_status !== 'CASE NOT DONE') {
                                                        Error_Msg = JSON.stringify(objResponseFull);
                                                        /*var hdfcergo_breakin = require(appRoot + '/models/hdfcergo_breakin');
                                                         var date = new Date();
                                                         var myquery = {Proposal_Number: Proposal_Number};
                                                         var newvalues = {$set: {Status: insurer_inspection_status, Modified_On: date}};
                                                         hdfcergo_breakin.updateOne(myquery, newvalues, function (err, res) {
                                                         if (err) {
                                                         throw err;
                                                         } else {
                                                         //res2.json(res);
                                                         console.log("HDFCErgo : BreakInStatus Updated for:Issued", Proposal_Number);
                                                         }
                                                         });
                                                         */

                                                        var User_Data = require(appRoot + '/models/user_data');
                                                        var ud_cond = {"User_Data_Id": UD_Id};
                                                        User_Data.findOne(ud_cond, function (err, dbUserData) {
                                                            if (err) {
                                                                console.error('Exception', err);
                                                            } else {


                                                                dbUserData = dbUserData._doc;
                                                                var dataObj = dbUserData['Proposal_Request_Core'];
                                                                var objRequestCore = {
                                                                    'customer_name': dataObj['first_name'] + ' ' + dataObj['last_name'],
                                                                    'crn': dataObj['crn'],
                                                                    'vehicle_text': dataObj['vehicle_text'],
                                                                    'insurer_name': 'HDFC ERGO GENERAL INSURANCE COMPANY LTD.',
                                                                    'insurance_type': 'RENEW - Breakin Case',
                                                                    'inspection_id': Proposal_Number,
                                                                    'final_premium': dbUserData['Payment_Request']['pg_data']['TxnAmount'],
                                                                    'email_id': dataObj['email'],
                                                                    'registration_no': dbUserData.Proposal_Request['registration_no_1'] + '-' + dbUserData.Proposal_Request['registration_no_2'] + '-' + dbUserData.Proposal_Request['registration_no_3'] + '-' + dbUserData.Proposal_Request['registration_no_4'],
                                                                    'insurer_inspection_status': insurer_inspection_status
                                                                };
                                                                var sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[Car] Inspection Verification "' + insurer_inspection_status + '" CRN : ' + dbUserData['PB_CRN'];
                                                                var Email = require(appRoot + '/models/email');
                                                                var objModelEmail = new Email();
                                                                var email_data = '<!DOCTYPE html><html><head><title>INSPECTION_NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                                                                email_data += '<div class="report"><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">INSPECTION_NOTIFICATION</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
                                                                email_data += '<tr><td  width="70%" style="font-family:\'Google Sans\' ,tahoma;font-size:14px;"><pre>';
                                                                for (var k in objRequestCore) {
                                                                    email_data += k + ':' + objRequestCore[k] + '<br/>';
                                                                }
                                                                email_data += '</pre></td></tr>';
                                                                email_data += '</table></div><br></body></html>';
                                                                objModelEmail.send('noreply@policyboss.com', config.environment.notification_email, sub, email_data, '', '', dbUserData['PB_CRN']);
                                                            }
                                                        });
                                                    }
                                                    console.error('HDFCErgo : BreakInStatus for', Proposal_Number, ':', objResponseJson['GetBreakinInspectionStatusResult']['BreakinDTO']['BreakInStatus']['0']);
                                                }
                                            } else {
                                                Error_Msg = JSON.stringify(objResponseFull);
                                                console.error('HDFCErgo : GetBreakinInspectionStatusResult.BreakinDTO.BreakInStatus node not found');
                                            }
                                        } else {
                                            Error_Msg = JSON.stringify(objResponseFull);
                                            console.error('HDFCErgo : GetBreakinInspectionStatusResult.BreakinDTO node not found');
                                        }
                                    } else {
                                        Error_Msg = JSON.stringify(objResponseFull);
                                        console.error('HDFCErgo : GetBreakinInspectionStatusResult node not found');
                                    }
                                }
                            }
                        });
                    }
                }
            });
        });
        res2.json({'Status': 'Initiated'});
    });

    app.post('/horizon_job/iciciLombard_update_inspection_status', function (req, res2, next) {
        let objInsurerProduct = req.body;
        let dealNo = "", callingService = '', Error_Msg = '', Inspection_Remarks = '';
        let args = {};
        let body = {};

        try {
            if (config.environment.name.toString() === 'Production') {
                dealNo = 'DL-3001/2511179';
                callingService = 'https://app9.icicilombard.com/ILServices/Motor/v1/Breakin/ClearInspectionStatus';
            } else {
                dealNo = 'DL-3001/1488439';
                callingService = 'https://cldilbizapp02.cloudapp.net:9001/ILServices/motor/v1/Breakin/ClearInspectionStatus';
            }

            let Icici_Token = require(appRoot + '/models/icici_token');
            Icici_Token.findOne({'Product_Id': 1}, null, {sort: {'Created_On': -1}}, function (err, dbIciciToken) {
                if (err) {
                    console.error('/iciciLombard_update_inspection_status Icici Token not Found', err);
                    Error_Msg = err;
                } else {
                    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
                    //let dbIciciToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjZCN0FDQzUyMDMwNUJGREI0RjcyNTJEQUVCMjE3N0NDMDkxRkFBRTEiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJhM3JNVWdNRnY5dFBjbExhNnlGM3pBa2ZxdUUifQ.eyJuYmYiOjE1OTEwOTIyNDIsImV4cCI6MTU5MTA5NTg0MiwiaXNzIjoiaHR0cHM6Ly9jbGRpbGJpemFwcDAyLmNsb3VkYXBwLm5ldDo5MDAxL2NlcmJlcnVzIiwiYXVkIjpbImh0dHBzOi8vY2xkaWxiaXphcHAwMi5jbG91ZGFwcC5uZXQ6OTAwMS9jZXJiZXJ1cy9yZXNvdXJjZXMiLCJlc2JwYXltZW50Il0sImNsaWVudF9pZCI6InJvLnBvbGljeWJvc3MiLCJzdWIiOiI0MmM5ZDY0MC02ZTQ2LTQwN2QtYmZjNi0yOWJhZDUwYmU0MDIiLCJhdXRoX3RpbWUiOjE1OTEwOTIyNDIsImlkcCI6ImxvY2FsIiwic2NvcGUiOlsiZXNicGF5bWVudCJdLCJhbXIiOlsiY3VzdG9tIl19.oqA_VkX0IhBT4Q3lL1x9du0nuIRQVRyw8AxTCOgekQqiFg3JbUGQ451QFWFaDbHJatpRDP0n6daXHm-Z_Cj8fMhsDDXwFo-4w4UVTs7VpQoLCj8pMEfM9OtSI0ujfn52qUsH_0XJwtUDlZv2eFHCzSyhu-bWPVLS7CBfRepKnc7Rp4on1JANJHJ3o2atY4PNvDIukHF4Mqu6bncJ4y9-hoek8bOkobsJFtK_DNlvl0nYJnBirBsB_nC87sbiwWxy3wd3UP5HBKxLrpqz3B8PNwmBls7t4jcoXLxYluI5xhnIabKhlkRc06NDmUT9ODBoRYlZZzV6SWvVQY9Q2PjV4A";
                    console.log('iciciLombard_update_inspection_status() dbIciciToken from DB : ', dbIciciToken);
                    body = {
                        "InspectionId": objInsurerProduct['Inspection_Id'],
                        "DealNo": dealNo,
                        "ReferenceDate": objInsurerProduct['Reference_Date'],
                        "InspectionStatus": "OK",
                        "CorrelationId": objInsurerProduct['Correlation_Id'],
                        "ReferenceNo": objInsurerProduct['Reference_No']
                    };
                    args = {
                        data: JSON.stringify(body),
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                            "Authorization": "Bearer " + dbIciciToken['Token']
                        }
                    };
                    console.error('iciciLombard_update_inspection_status Request :: ', JSON.stringify(args));

                    let Client = require('node-rest-client').Client;
                    let client = new Client();
                    client.post(callingService, args, function (data, response) {
                        console.error('ICICI Lombard - ClearInspectionStatus service - Response : ', JSON.stringify(data));
                        if (data) {
                            let iciciLombard_breakin_status = '';
                            let email_template = '';
                            let email_sub_status = '';
                            let inspection_status_msg = '';
                            //data['statusMessage'] = 'Success';
                            //data['vehicleInspectionStatus'] = 'PASS';
                            if ((data.hasOwnProperty('statusMessage')) && (data['statusMessage'] === 'Success')) {
                                if ((data.hasOwnProperty('vehicleInspectionStatus')) && (data['vehicleInspectionStatus'] === 'PASS')) {
                                    iciciLombard_breakin_status = 'INSPECTION_APPROVED';
                                    email_template = 'Send_Inspection_Status.html';
                                    email_sub_status = 'Successful';
                                    Error_Msg = iciciLombard_breakin_status;
                                } else if ((data.hasOwnProperty('vehicleInspectionStatus')) && (data['vehicleInspectionStatus'] === 'FAIL')) {
                                    iciciLombard_breakin_status = 'INSPECTION_REJECTED';
                                    email_template = 'Send_Inspection_Status.html'; //'Send_UnSuccessful_Inspection.html';
                                    email_sub_status = 'Unsuccessful';
                                    Inspection_Remarks = data['message'];
                                    Error_Msg = iciciLombard_breakin_status + " : " + Inspection_Remarks;
                                } else {
                                    Error_Msg = JSON.stringify(data);
                                }

                                try {
                                    let queryObj = {
                                        PB_CRN: parseInt(objInsurerProduct['PB_CRN']),
                                        UD_Id: parseInt(objInsurerProduct['UD_Id']),
                                        SL_Id: parseInt(objInsurerProduct['SL_Id']),
                                        Insurer_Id: 6,
                                        Request_Unique_Id: objInsurerProduct['Request_Unique_Id'],
                                        Service_Log_Unique_Id: objInsurerProduct['Service_Log_Unique_Id'],
                                        Inspection_Number: objInsurerProduct['Inspection_Id'],
                                        Status: iciciLombard_breakin_status,
                                        Insurer_Request: args,
                                        Insurer_Response: data,
                                        Service_Call_Status: 'complete',
                                        Created_On: new Date(),
                                        Modified_On: ''
                                    };

                                    let MongoClient = require('mongodb').MongoClient;
                                    MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                                        if (err) {
                                            throw err;
                                        } else {
                                            let inspectionBreakins = db.collection('inspection_breakins');
                                            inspectionBreakins.insertOne(queryObj, function (err, inspectionBreakinsdb) {
                                                if (err) {
                                                    throw err;
                                                } else {
                                                    console.log("iciciLombard_update_inspection_status() inspectionBreakinsdb : ", inspectionBreakinsdb.insertedCount, inspectionBreakinsdb.result);
                                                }
                                            });
                                        }
                                    });
                                } catch (ex4) {
                                    Error_Msg = ex4;
                                    console.error('Exception in iciciLombard_update_inspection_status() for inspection_schedule DB updating : ', ex4);
                                }

                                try {
                                    console.log('path :: ', appRoot, '/models/inspection_schedule');
                                    let inspectionSchedules = require(appRoot + '/models/inspection_schedule');
                                    let today = new Date();
                                    let myquery = {Inspection_Id: objInsurerProduct['Inspection_Id'], PB_CRN: objInsurerProduct['PB_CRN'], UD_Id: objInsurerProduct['UD_Id']};
                                    let newvalues = {Insurer_Status: "CHECKED", Status: iciciLombard_breakin_status, Modified_On: today};
                                    inspectionSchedules.updateOne(myquery, newvalues, function (uperr, upres) {
                                        if (uperr) {
                                            Error_Msg = uperr;
                                            throw uperr;
                                        } else {
                                            console.log("IciciLombardMotor iciciLombard_update_inspection_status() BreakIn Status Updated for : ", objInsurerProduct['Inspection_Id'], ", UD_Id : ", objInsurerProduct['UD_Id']);
                                            console.log("IciciLombardMotor : UD_Id : ", objInsurerProduct['UD_Id'], upres);
                                        }
                                    });
                                } catch (ex4) {
                                    Error_Msg = ex4;
                                    console.error('Exception in iciciLombard_update_inspection_status() for inspection_schedule DB updating : ', ex4);
                                }

                                try {
                                    let User_Data = require(appRoot + '/models/user_data');
                                    let ud_cond = {"User_Data_Id": objInsurerProduct['UD_Id']};
                                    User_Data.findOne(ud_cond, function (err, dbUserData) {
                                        if (err) {
                                            console.error('Exception in iciciLombard_update_inspection_status() : ', err);
                                        } else {
                                            dbUserData = dbUserData._doc;
                                            let myquery1 = {
                                                //"Last_Status": "INSPECTION_SUBMITTED",
                                                "User_Data_Id": dbUserData.User_Data_Id,
                                                "Request_Unique_Id": objInsurerProduct['Request_Unique_Id']
                                            };
                                            let newvalues1 = '';
                                            let Status_History = (dbUserData.hasOwnProperty('Status_History')) ? dbUserData.Status_History : [];
                                            Status_History.unshift({
                                                "Status": iciciLombard_breakin_status,
                                                "StatusOn": new Date()
                                            });
                                            if (iciciLombard_breakin_status === 'INSPECTION_REJECTED') {
                                                newvalues1 = {
                                                    "Last_Status": iciciLombard_breakin_status,
                                                    "Status_History": Status_History,
                                                    "Inspection_Remarks": data['message'],
                                                    "Premium_Request.is_inspection_done": "yes",
                                                    "Modified_On": new Date()
                                                }, {upsert: false, multi: false};
                                            }
                                            if (iciciLombard_breakin_status === 'INSPECTION_APPROVED') {
                                                newvalues1 = {
                                                    "Last_Status": iciciLombard_breakin_status,
                                                    "Status_History": Status_History,
                                                    "Premium_Request.is_inspection_done": "yes",
                                                    "Modified_On": new Date()
                                                };
                                            }

                                            User_Data.updateOne(myquery1, newvalues1, function (err, numAffected) {
                                                console.log('iciciLombard_update_inspection_status() UserDataUpdated : ', err, numAffected);
                                            });

                                            let payment_link = "";
                                            if (iciciLombard_breakin_status === 'INSPECTION_APPROVED') {
                                                payment_link = config.environment.portalurl.toString() + '/car-insurance/buynow/' + dbUserData['Premium_Request']['client_id'] + '/' + objInsurerProduct['Service_Log_Unique_Id'] + '_' + objInsurerProduct['SL_Id'] + '_' + objInsurerProduct['UD_Id'] + '/NonPOSP/0';
                                                console.log("iciciLombard_update_inspection_status() payment_link : ", payment_link);
                                            }

                                            let Client2 = require('node-rest-client').Client;
                                            let client2 = new Client2();
                                            client2.get(config.environment.shorten_url + '?longUrl=' + encodeURIComponent(payment_link), function (urlData, urlResponse) {
                                                try {
                                                    if (iciciLombard_breakin_status === 'INSPECTION_APPROVED' && urlData && urlData.Short_Url !== '') {
                                                        inspection_status_msg = 'Your Vehicle Inspection has been done successfully. Payment Link is : ';
                                                        console.log("iciciLombard_update_inspection_status() inspection_status_msg : ", inspection_status_msg);
                                                    }
                                                    if (iciciLombard_breakin_status === 'INSPECTION_REJECTED') {
                                                        inspection_status_msg = 'Your Vehicle Inspection has been Rejected. REMARKS : ' + Inspection_Remarks;
                                                        console.log("iciciLombard_update_inspection_status() inspection_status_msg : ", inspection_status_msg);
                                                    }
                                                    let dataObj = dbUserData['Proposal_Request_Core'];
                                                    let objRequestCore = {
                                                        'customer_name': dataObj['first_name'] + ' ' + dataObj['last_name'],
                                                        'crn': dataObj['crn'],
                                                        'vehicle_text': dataObj['vehicle_text'],
                                                        'insurer_name': 'ICICI LOMBARD GENERAL INSURANCE CO. LTD.',
                                                        'insurance_type': 'RENEW - Breakin Case',
                                                        'inspection_id': objInsurerProduct['Inspection_Id'],
                                                        'final_premium': dbUserData.Proposal_Request_Core['final_premium'],
                                                        'email_id': dataObj['email'],
                                                        'registration_no': dbUserData['registration_no'],
                                                        'inspection_status_msg': inspection_status_msg,
                                                        'short_url': urlData.Short_Url
                                                    };
                                                    let processed_request = {};
                                                    for (let key in objRequestCore) {
                                                        if (typeof objRequestCore[key] !== 'object') {
                                                            processed_request['___' + key + '___'] = objRequestCore[key];
                                                        }
                                                    }
                                                    console.error('Breakin Email', iciciLombard_breakin_status);
                                                    if (iciciLombard_breakin_status === 'INSPECTION_APPROVED' || iciciLombard_breakin_status === 'INSPECTION_REJECTED') {
                                                        let email_data = fs.readFileSync(appRoot + '/resource/email/' + email_template).toString();
                                                        email_data = email_data.replaceJson(processed_request);
                                                        let emailto = dataObj['email'];
                                                        let sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[Car] Inspection Verification ' + email_sub_status + ' CRN : ' + dataObj['crn'];
                                                        let Email = require(appRoot + '/models/email');
                                                        let objModelEmail = new Email();
                                                        var SmsLog = require('../models/sms_log');
                                                        var objsmsLog = new SmsLog();
                                                        let dt = new Date();
                                                        let email_agent = '';
                                                        if (dbUserData.Premium_Request['posp_email_id'] !== null && dbUserData.Premium_Request['posp_email_id'].toString().indexOf('@') > -1) {
                                                            email_agent = dbUserData.Premium_Request['posp_email_id'].toString();
                                                        }
                                                        let arr_bcc = [config.environment.notification_email, 'vikram.jena@policyboss.com', 'anuj.singh@policyboss.com'];
                                                        if (dbUserData.Premium_Request.hasOwnProperty('posp_reporting_email_id') && dbUserData.Premium_Request['posp_reporting_email_id'] != '' && dbUserData.Premium_Request['posp_reporting_email_id'] != null) {
                                                            if (dbUserData.Premium_Request['posp_reporting_email_id'].toString().indexOf('@') > -1) {
                                                                arr_bcc.push(dbUserData.Premium_Request['posp_reporting_email_id']);
                                                            }
                                                        }
                                                        if (dbUserData['Premium_Request'].hasOwnProperty('posp_sub_fba_email') && dbUserData['Premium_Request']['posp_sub_fba_email'] != null && dbUserData['Premium_Request']['posp_sub_fba_email'].toString().indexOf('@') > -1) {
                                                            arr_bcc.push(dbUserData['Premium_Request']['posp_sub_fba_email']);
                                                        }
                                                        if (config.environment.name === 'Production') {
                                                            if ((dbUserData.Premium_Request['posp_sources'] - 0) > 0) {
                                                                if ((dbUserData.Premium_Request['posp_sources'] - 0) === 1) {
                                                                    arr_bcc.push('transactions.1920@gmail.com');//finmart-dc 
                                                                }
                                                            }
                                                        }
                                                        objModelEmail.send('customercare@policyboss.com', emailto, sub, email_data, email_agent, arr_bcc.join(','), dbUserData['PB_CRN']);
                                                        let obj_err_sms = {
                                                            '___date_time___': dt.toLocaleString(),
                                                            '___name___': 'ICICILombard Update Inspection Status'
                                                        };
                                                        let sms_data = objsmsLog.leadScheduler(obj_err_sms);
                                                        objsmsLog.send_sms('9619160851', sms_data, 'POLBOS-SCHEDULER'); //Anuj
                                                        objsmsLog.send_sms('9768463482', sms_data, 'POLBOS-SCHEDULER'); //Vikram
                                                        res2.json({'Status': Error_Msg});
                                                    }
                                                } catch (e) {
                                                    console.error('Exception in iciciLombard_update_inspection_status() for mailing : ', e);
                                                    res2.json({'Status': e});
                                                }
                                            });
                                        }
                                    });
                                } catch (ex2) {
                                    console.error('Exception in iciciLombard_update_inspection_status() for User_Data db details : ', ex2);
                                    res2.json({'Status': ex2});
                                }
                            } else {
                                Error_Msg = JSON.stringify(data);
                                res2.json({'Status': Error_Msg});
                            }
                        } else {
                            Error_Msg = JSON.stringify(data);
                            res2.json({'Status': Error_Msg});
                        }
                    });
                }
            });
        } catch (ex3) {
            console.error('Exception in iciciLombard_update_inspection_status() for User_Data db details : ', ex3);
            res2.json({'Status': ex3});
        }
        //res2.json({'Status': Error_Msg});
    });

    app.get('/horizon_job/iciciLombard_nstp_cases', function (req, resp) {
        try {
            let cond = {"Status": {$in: ["NSTP", "NSTP_MODIFY"]}, "Insurer_Id": 6};
            let health_nstp_case = require('../models/health_nstp_case');
            health_nstp_case.find(cond).exec(function (err, dbUsers) {
                if (err) {
                    resp.send(err);
                }
                try {
                    if (!err) {
                        for (let p in dbUsers) {
                            let og_proposal_number = dbUsers[p]['_doc'].Inspection_Id;
                            let new_proposal_number = dbUsers[p]['_doc'].Proposal_Number;
                            let args = {
                                data: {
                                    "Base_Proposal": og_proposal_number,
                                    "Counter_Proposal": new_proposal_number,
                                    "PB_CRN": dbUsers[p]['_doc']['PB_CRN'],
                                    "SRN": dbUsers[p]['_doc']['Request_Unique_Id'],
                                    "ARN": dbUsers[p]['_doc']['Service_Log_Unique_Id'],
                                    "Status": dbUsers[p]['_doc']['Status']
                                },
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            };
                            let api_url = config.environment.weburl + '/horizon_job/iciciLombard_proposal_status';
                            execute_post(api_url, args);
                        }
                    }
                } catch (ex) {
                    console.error('Exception', 'hdfcergo_breakin_ids', ex);
                    resp.json(ex);
                }
            });
        } catch (ex2) {
            console.error('Exception in iciciLombard_check_inspection_status() for User_Data db details : ', ex2);
            resp.json({'Status': ex2});
        }
    });

    app.post('/horizon_job/iciciLombard_check_uw_status', function (req, resp) {
        let body = req.body;
        let callingService = '', Error_Msg = '';
        let health_nstp_case = require('../models/health_nstp_case');
        let args = {};
        try {
            if (config.environment.name.toString() === 'Production') {
                callingService = 'https://app9.icicilombard.com/ilservices/health/v1/PolicyDetails/FetchUWProposalStatus?ProposalNo=';
            } else {
                callingService = 'https://cldilbizapp02.cloudapp.net:9001/ilservices/health/v1/PolicyDetails/FetchUWProposalStatus?ProposalNo=';
            }

            try {
                let Icici_Token = require(appRoot + '/models/icici_token');
                Icici_Token.findOne({'Product_Id': 2}, null, {sort: {'Created_On': -1}}, function (err, dbIciciToken) {
                    if (err) {
                        console.error('iciciLombard_check_uw_status Token not Found', err);
                    } else {
                        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
                        console.log('iciciLombard_check_uw_status dbIciciToken : ', dbIciciToken);
                        let token = dbIciciToken['Token'];
                        args = {
                            headers: {
                                "Authorization": "Bearer " + token
                            }
                        };
                        callingService = callingService + body.Base_Proposal;
                        let Client = require('node-rest-client').Client;
                        let client = new Client();
                        client.get(callingService, args, function (data, response) {
                            console.error('ICICI Lombard - Get_UW_Status service - Response : ', JSON.stringify(data));
                            if (data) {
                                if ((data.hasOwnProperty('status') && data['status'] === 'SUCCESS') && (data.hasOwnProperty('statusMessage') && data['statusMessage'] === 'Success') && (data.hasOwnProperty('uwProposalStatus1') && (data['uwProposalStatus1'].includes('New Confirmed')))) {
                                    if (data.hasOwnProperty('uwProposalNumber') && data['uwProposalNumber'] !== null && data['uwProposalNumber'] !== "") {
                                        console.error('ICICI Lombard - Get_UW_Status service - New Proposal : ', data['uwProposalNumber']);
                                        let args = {
                                            data: {
                                                "Base_Proposal": data['proposalNumber'],
                                                "Counter_Proposal": data['uwProposalNumber']
                                            },
                                            headers: {
                                                "Content-Type": "application/json"
                                            }
                                        };
                                        let api_url = config.environment.weburl + '/horizon_job/iciciLombard_counter_proposal';
                                        execute_post(api_url, args);
                                        sleep(2000);
                                        let objUpdates = {
                                            "Proposal_Number": data['uwProposalNumber'],
                                            "Revised_Premium": data['revisedPremium'],
                                            "Status": "NSTP_MODIFY",
                                            "Last_Status": "NSTP",
                                            "Modified_On": new Date(),
                                            "Insurer_UW_Response": JSON.stringify(data)
                                        };

                                        health_nstp_case.update({'Inspection_Id': body.Base_Proposal}, objUpdates, function (err) {
                                            if (err) {
                                                console.error('Insert new proposal details Error', 'health_nstp_cases', err);
                                            }
                                        });
                                    }
                                } else {
                                    console.error('ICICI Lombard Get_UW_Status : ', JSON.stringify(data));
                                    Error_Msg = JSON.stringify(data);
                                    resp.json({'Status': Error_Msg});
                                }
                            }
                        });
                    }
                });
            } catch (ex) {
                console.error('Exception', 'Get_UW_Status', ex);
                resp.json(ex);
            }
        } catch (ex2) {
            console.error('Exception in iciciLombard_Get_UW_Status : ', ex2);
            resp.json({'Status': ex2});
        }
    });

    app.post('/horizon_job/iciciLombard_counter_proposal', function (req, resp) {
        let body = req.body;
        let callingService = '', Error_Msg = '';
        let args = {};
        try {
            if (config.environment.name.toString() === 'Production') {
                callingService = 'https://app9.icicilombard.com/ilservices/health/v1/PolicyDetails/CounterOffer';
            } else {
                callingService = 'https://cldilbizapp02.cloudapp.net:9001/ilservices/health/v1/PolicyDetails/CounterOffer';
            }

            try {
                let Icici_Token = require(appRoot + '/models/icici_token');
                Icici_Token.findOne({'Product_Id': 2}, null, {sort: {'Created_On': -1}}, function (err, dbIciciToken) {
                    if (err) {
                        console.error('iciciLombard_counter_proposal Token not Found', err);
                    } else {
                        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
                        console.log('iciciLombard_counter_proposal dbIciciToken : ', dbIciciToken);
                        args = {
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json",
                                "Authorization": "Bearer " + dbIciciToken['Token']
                            }
                        };
                        let Client = require('node-rest-client').Client;
                        let client = new Client();
                        const uuidv4 = require('uuid/v4');
                        let uuid = uuidv4();
                        let objRequest = {
                            "CorrelationId": uuid,
                            "Inputs": {
                                "ProposalNo": body.Counter_Proposal,
                                "EmailId": "revati.ghadge@policyboss.com"
                            }
                        };
                        args['data'] = JSON.stringify(objRequest);
                        client.post(callingService, args, function (data) {
                            if (data) {
                                if ((data.hasOwnProperty('status') && data['status'] === true) && (data.hasOwnProperty('statusMessage') && data['statusMessage'] === 'Success')) {
                                    console.error('ICICI Lombard - Counter Offer sent : Proposal - ', body.Counter_Proposal);
                                } else {
                                    console.error('ICICI Lombard - Counter Offer : ', JSON.stringify(data));
                                    Error_Msg = JSON.stringify(data);
                                    resp.json({'Status': Error_Msg});
                                }
                            }
                        });

                    }
                });
            } catch (ex) {
                console.error('Exception', 'Counter Offer', ex);
                resp.json(ex);
            }
        } catch (ex2) {
            console.error('Exception in iciciLombard_Counter Offer : ', ex2);
            resp.json({'Status': ex2});
        }
    });

    app.post('/horizon_job/iciciLombard_proposal_status', function (req, resp) {
        try {
            let body = req.body;
            let callingService = "";
            if (config.environment.name.toString() === 'Production') {
                callingService = 'https://app9.icicilombard.com/ilservices/misc/v1/Generic/GetProposalStatus?proposalNumber=';
            } else {
                callingService = 'https://cldilbizapp02.cloudapp.net:9001/ilservices/misc/v1/Generic/GetProposalStatus?proposalNumber=';
            }
            let Client = require('node-rest-client').Client;
            let client = new Client();
            process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
            let args = {
                data: {
                    'grant_type': 'password',
                    'username': ((config.environment.name !== 'Production') ? 'policyboss' : 'landmark'),
                    'password': ((config.environment.name !== 'Production') ? 'pol!cyboss' : 'l@n&M@rk'),
                    'scope': 'esbgeneric',
                    'client_id': ((config.environment.name !== 'Production') ? 'ro.policyboss' : 'ro.landmark'),
                    'client_secret': ((config.environment.name !== 'Production') ? 'pol!cybossCLi3nt' : 'ro.l@n&M@rkcL!3nt')
                },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            };
            function jsonToQueryString(json) {
                return  Object.keys(json).map(function (key) {
                    return encodeURIComponent(key) + '=' +
                            encodeURIComponent(json[key]);
                }).join('&');
            }
            args.data = jsonToQueryString(args.data);
            let tokenservice_url = config.icici_health_auth.auth_url;
            console.error('token data', JSON.stringify(args));
            console.error(tokenservice_url);
            client.post(tokenservice_url, args, function (data, response) {
                // parsed response body as js object 
                console.error('token', JSON.stringify(data));
                let access_key = data['access_token'];
                let args = {
                    headers: {
                        "Authorization": "Bearer " + access_key
                    }
                };
                let base_proposal_number = body.Base_Proposal;
                let new_proposal_number = body.Counter_Proposal;
                callingService += base_proposal_number;
                client.get(callingService, args, function (data, response) {
                    // parsed response body as js object 
                    console.error('proposal_status', JSON.stringify(data));
                    if (data) {
                        let health_nstp_case = require('../models/health_nstp_case');
                        if (data.hasOwnProperty('proposalStatus') && data['proposalStatus'] === 'NC') {
                            let args = {
                                data: {
                                    "Base_Proposal": base_proposal_number,
                                    "Counter_Proposal": new_proposal_number,
                                    "SRN": body.SRN,
                                    "ARN": body.ARN,
                                    "token": access_key
                                },
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            };
                            let api_url = config.environment.weburl + '/horizon_job/iciciLombard_get_policy_number';
                            execute_post(api_url, args);
                            sleep(2000);
                            let objUpdates = {
                                "Status": "NSTP_APPROVED",
                                "Last_Status": body.Status,
                                "Modified_On": new Date()
                            };

                            health_nstp_case.update({'Inspection_Id': base_proposal_number}, objUpdates, function (err) {
                                if (err) {
                                    console.error('proposal_status', 'health_nstp_cases', err);
                                }
                            });

                        } else if (data.hasOwnProperty('proposalStatus') && data['proposalStatus'] === 'NR') {
                            console.error('ICICI Lombard proposal_status : ', data['errorMessage']);
                            let objUpdates = {
                                "Status": "NSTP_REJECT",
                                "Last_Status": body.Status,
                                "Modified_On": new Date()
                            };

                            health_nstp_case.update({'Inspection_Id': base_proposal_number}, objUpdates, function (err) {
                                if (err) {
                                    console.error('proposal_status', 'health_nstp_cases', err);
                                }
                            });
                        } else if (data.hasOwnProperty('proposalStatus') && (data['proposalStatus'] === 'CUWP')) {
                            console.error('ICICI Lombard proposal_status : ', data['statusMessage']);
                            if (body.Status === "NSTP") {
                                let args = {
                                    data: {
                                        "Base_Proposal": base_proposal_number
                                    },
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                };
                                let api_url = config.environment.weburl + '/horizon_job/iciciLombard_check_uw_status';
                                execute_post(api_url, args);
                                sleep(2000);
                                let objUpdates = {
                                    "Status": "NSTP_MODIFY",
                                    "Last_Status": body.Status,
                                    "Modified_On": new Date()
                                };

                                health_nstp_case.update({'Inspection_Id': base_proposal_number}, objUpdates, function (err) {
                                    if (err) {
                                        console.error('proposal_status', 'health_nstp_cases', err);
                                    }
                                });
                            }
                        } else {
                            console.error('proposal_status : ', JSON.stringify(data));
                            Error_Msg = JSON.stringify(data);
                            resp.json({'Status': Error_Msg});
                        }
                    }
                });
            });
        } catch (ex2) {
            console.error('Exception in iciciLombard_proposal_status : ', ex2);
            resp.json({'Status': ex2});
        }
    });

    app.post('/horizon_job/iciciLombard_get_policy_number', function (req, resp) {
        try {
            let body = req.body;
            let callingService = "";
            if (config.environment.name.toString() === 'Production') {
                callingService = 'https://app9.icicilombard.com/ilservices/Misc/v1/Generic/GetPolicyStatusByProposalNumber?ProposalNumbers=';
            } else {
                callingService = 'https://cldilbizapp02.cloudapp.net:9001/ilservices/Misc/v1/Generic/GetPolicyStatusByProposalNumber?ProposalNumbers=';
            }
            let Client = require('node-rest-client').Client;
            let client = new Client();
            let args = {
                headers: {
                    "Authorization": "Bearer " + body.token
                }
            };
            let health_nstp_case = require('../models/health_nstp_case');
            try {
                process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
                let og_proposal_number = body.Base_Proposal;
                let new_proposal_number = body.Counter_Proposal;
                let srn = body.SRN;
                let arn = body.ARN;
                callingService = new_proposal_number === "" ? callingService + og_proposal_number : callingService + new_proposal_number;

                client.get(callingService, args, function (data, response) {
                    // parsed response body as js object 
                    console.error('iciciLombard_get_policy_number', JSON.stringify(data));
                    if (data) {
                        if ((data.hasOwnProperty('status') && data['status'] === true) && (data.hasOwnProperty('statusMessage') && data['statusMessage'] === 'Success')) {
                            let policy_number = data['policyDetails'][0].policyNumber;
                            if (policy_number !== '' && policy_number !== null && policy_number !== undefined) {
                                var pdf_file_name = 'IciciLombardHealth_Health_' + policy_number.toString().replaceAll('/', '') + '.pdf';
                                var pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;

                                var args = {
                                    data: {
                                        "search_reference_number": srn,
                                        "api_reference_number": arn,
                                        "policy_number": policy_number,
                                        'client_key': "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
                                        'secret_key': "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
                                        'insurer_id': 6,
                                        'method_type': 'Pdf',
                                        'execution_async': 'no'
                                    },
                                    headers: {
                                        "Content-Type": "application/json",
                                        'client_key': "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9",
                                        'secret_key': "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW"
                                    }
                                };
                                execute_post(config.environment.weburl + '/quote/pdf_initiate', args, pdf_sys_loc);
                                sleep(2000);
                                let objUpdates = {
                                    "Policy_Number": policy_number,
                                    "Modified_On": new Date()
                                };

                                health_nstp_case.update({'Inspection_Id': og_proposal_number}, objUpdates, function (err) {
                                    if (err) {
                                        console.error('get_policy_number', 'health_nstp_cases', err);
                                    }
                                });
                            }
                        } else {
                            console.error('get_policy_number : ', JSON.stringify(data));
                            Error_Msg = JSON.stringify(data);
                            resp.json({'Status': Error_Msg});
                        }
                    }
                });
            } catch (ex) {
                console.error('Exception', 'get_policy_number', ex);
                resp.json(ex);
            }
        } catch (ex2) {
            console.error('Exception in iciciLombard_get_policy_number : ', ex2);
            resp.json({'Status': ex2});
        }
    });
};
