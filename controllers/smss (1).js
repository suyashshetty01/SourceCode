/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
var Base = require('../libs/Base');
var path = require('path');
var fs = require('fs');
var moment = require('moment');
var appRoot = path.dirname(path.dirname(require.main.filename));
mongoose.connect(config.db.connection + ':27017/' + config.db.name,{ useMongoClient: true}); // connect to our database

var Sms = require('../models/sms');
module.exports.controller = function (app) {
    /* GET users listing. */

    app.post('/sms/send', function (req, res, next) {
        console.log('I am Sms send post Request');

        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
        var Client = require('node-rest-client').Client;
        var client = new Client();

        if (true) {
            mobile_no = req.body.to;
            sms_content = req.body.text;
            if (mobile_no.toString().length < 12) {
                mobile_no = '91' + mobile_no.toString();
            }
            var args = {
                data: {
                    'userId': 'ebsalt',
                    'pass': 'ipebsalt',
                    'appid': 'ebsalt',
                    'subappid': 'ebsalt',
                    'contenttype': '1',
                    'to': mobile_no.toString(),
                    'from': 'PLBOSS',
                    'text': sms_content.toString(),
                    'selfid': 'true',
                    'alert': '1',
                    'dlrreq': 'true'
                },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            };
            console.log('args', args);
            function jsonToQueryString(json) {
                return '?' +
                        Object.keys(json).map(function (key) {
                    return encodeURIComponent(key) + '=' +
                            encodeURIComponent(json[key]);
                }).join('&');
            }
            var qs = jsonToQueryString(args.data);
            client.get('http://push3.maccesssmspush.com/servlet/com.aclwireless.pushconnectivity.listeners.TextListener' + qs, {}, function (data, response) {
                console.log('CoreSendSmS', data, response);
                data = data.toString();
                console.log('==========================');
                console.log('SendSmS', data);
            });
        }
        res.json(req.query);
    });
    app.post('/sms/receive', function (req, res, next) {
        console.log('I am Sms Receive Get Request');
        var LM_Req = {
            'Mode': 'Get',
            'Body': req.body,
            'Query': req.query,
            'Received_On': new Date()
        };
        //console.log('Body', JSON.stringify(req.body));
        //console.log('Query', JSON.stringify(req.query));
        var fs = require('fs');
        var today = new Date();
        var log_file_name = today.toISOString().substring(0, 10).toString().replace(/-/g, '');
        fs.appendFile(appRoot + "/tmp/log/sms_receive_" + log_file_name + ".log", JSON.stringify(LM_Req), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
        res.json(req.query);
    });
    app.get('/sms/receive', function (req, res, next) {
        console.log('I am Sms Receive Post Request');
        try {
            var objLog = {
                'Received_On': new Date(),
                'Body': req.body,
                'Query': req.query
            };
            var fs = require('fs');
            var today = new Date();
            var log_file_name = today.toISOString().substring(0, 10).toString().replace(/-/g, '');
            fs.appendFile(appRoot + "/tmp/log/sms_receive_" + log_file_name + ".log", '\n' + JSON.stringify(objLog), function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
            var SmsReceivedContent = '', sender_mobile_no = '';
            if (objLog.Body) {
                SmsReceivedContent = req.body.comments;
                sender_mobile_no = req.body.sender;
            }
            if (req.query.hasOwnProperty('message')) {
                //POST /sms/receive?refnum=vni84-08072017-50744&mobile=919892891772&message=Info%20murugan%20pillai
                SmsReceivedContent = req.query.message;
                sender_mobile_no = req.query.mobile;
            }
            if (sender_mobile_no.length > 10) {
                sender_mobile_no = sender_mobile_no.substring(2);
            }


            if (SmsReceivedContent !== '' && sender_mobile_no !== '') {
                var ArrSmsReceivedContent = SmsReceivedContent.split(' ');
                var Request_Type = 'NA';
                var objSmsRequest = {
                    'sms_id': '',
                    'request_type': '',
                    'registration_no': '',
                    'sender_mobile_no': sender_mobile_no,
                    'receiver_mobile_no': sender_mobile_no,
                    'sender_name': '',
                    'receiver_name': '',
                    'policy_expiry_date': '',
                    'is_claim_exists': 'no',
                    'vehicle_ncb_current': '',
                    'email': '',
                    'quote_id': '',
                    'selected_addon': ''
                };
                if (typeof ArrSmsReceivedContent[0] !== 'undefined') {
                    //ArrSmsReceivedContent.splice(0, 1);
                    objSmsRequest['request_type'] = ArrSmsReceivedContent[0];
                }

                objSmsRequest['request_type'] = objSmsRequest['request_type'].toString().toUpperCase();
                Request_Type = objSmsRequest['request_type'];


                if (Request_Type === 'DISCOUNT') {
                    var sms_content = '';
                    var pb_crn = ArrSmsReceivedContent[1] - 0;
                    var disc = ArrSmsReceivedContent[2] - 0;
                }
                if (Request_Type === 'POLICY') {
                    var sms_content = '';
                    var pb_crn = ArrSmsReceivedContent[1] - 0;
                }
                if (Request_Type === 'HELP') {
                    var sms_content = '';
                    var arrSmsList = {'Msg1': '', 'Msg2': '', 'Msg3': ''};

                    arrSmsList.Msg1 = "LM Quote Platform :: Help #1\n\
================\n\
QUOTE : Receive quotes for vehicle number\n\
Usage : Landmark QUOTE <Customer_Name> <Vehicle_Reg_No>\n\
Sample : Landmark QUOTE John_Doe MH01AB1234\n\
\n\
SQUOTE : Share quotes with Friend for vehicle number\n\
Usage : Landmark SQUOTE <Customer_Name> <Friend_Name> <Friend_Mobile_No> <Vehicle_Reg_No>\n\
Sample : Landmark SQUOTE John_Doe Kint_Eastwood 9876543210 MH01AB1234\n\
";

                    arrSmsList.Msg2 = "LM Quote Platform :: Help #2\n\
================\n\
QUOTEURL : Receive Proposal URL for Quote_No\n\
Usage : Landmark QUOTEURL <Customer_Email> <Quote_Id> <Addon_Selection>\n\
Sample : Landmark QUOTEURL test@gmail.com 12345 ZD+RA+EP\n\
\n\
POSREG : To register with Landmark as POSP Agent\n\
Usage : Landmark POSREG <Name> <Email> <City> <Pincode> <Pancard>\n\
Sample : Landmark POSREG John_Doe test@gmail.com Mumbai 400070 ATIPM1234G\n\
";
                    arrSmsList.Msg3 = "LM Quote Platform :: Help #3\n\
================\n\
PQUOTE : POSP Share quotes with Customer\n\
Usage : Landmark PQUOTE <Customer_Name> <Customer_Mobile> <Vehicle_Reg_No>\n\
Sample : Landmark PQUOTE John_Doe 9876543210 MH01AB1234\n\
\n\
PQUOTEURL : POSP Send Proposal URL to Customer\n\
Usage : Landmark PQUOTEURL <Customer_Email> <Quote_Id> <Addon_Selection>\n\
Sample : Landmark PQUOTEURL test@gmail.com 12345 ZD+RA+EP\n\
================\n\
Help Finish";
                    objSmsRequest['sender_name'] = ArrSmsReceivedContent[1].toString();
                    objSmsRequest['receiver_name'] = objSmsRequest['sender_name'];

                }



                if (Request_Type === 'QUOTE') {
                    if (typeof ArrSmsReceivedContent[1] !== 'undefined') {
                        objSmsRequest['sender_name'] = ArrSmsReceivedContent[1].toString();
                        objSmsRequest['receiver_name'] = objSmsRequest['sender_name'];
                        ArrSmsReceivedContent.splice(1, 1);
                    }
                    /*
                     var request_receiver = ArrSmsReceivedContent[2].toString();
                     if (request_receiver.length === 10 && isNaN(request_receiver.substr(0, 1)) === false) {
                     objSmsRequest['receiver_mobile_no'] = '91' + request_receiver.toString();
                     
                     }*/

                }
                if (Request_Type === 'PQUOTE') {
                    if (typeof ArrSmsReceivedContent[1] !== 'undefined') {
                        objSmsRequest['receiver_name'] = ArrSmsReceivedContent[1].toString();

                    }
                    if (typeof ArrSmsReceivedContent[2] !== 'undefined') {
                        objSmsRequest['receiver_mobile_no'] = '91' + ArrSmsReceivedContent[2].toString();
                    }
                    ArrSmsReceivedContent.splice(1, 2);
                }
                if (Request_Type === 'SQUOTE') {
                    if (typeof ArrSmsReceivedContent[1] !== 'undefined') {
                        objSmsRequest['sender_name'] = ArrSmsReceivedContent[1].toString();
                    }
                    if (typeof ArrSmsReceivedContent[2] !== 'undefined') {
                        objSmsRequest['receiver_name'] = ArrSmsReceivedContent[2].toString();
                    }
                    if (typeof ArrSmsReceivedContent[3] !== 'undefined') {
                        objSmsRequest['receiver_mobile_no'] = '91' + ArrSmsReceivedContent[3].toString();
                    }
                    ArrSmsReceivedContent.splice(1, 3);
                }


                var ObjSms = {
                    'Request_Core': {
                        'Body': req.body,
                        'Query': req.query
                    },
                    'Request_Type': Request_Type,
                    'Sender_Name': objSmsRequest['sender_name'],
                    'Sender': Math.round(objSmsRequest['sender_mobile_no'] - 0),
                    'Receiver_Name': objSmsRequest['receiver_name'],
                    'Receiver': Math.round(objSmsRequest['receiver_mobile_no'] - 0),
                    'Request_Id': null,
                    'Request_Unique_Id': null,
                    'Sms_Content': null,
                    'Received_On': new Date(),
                    'Replied_On': '',
                    'Status': 1,
                    'Send_Api_Response': null
                };
                var objModelSms = new Sms(ObjSms);
                objModelSms.save(function (err, objDbSms) {
                    if (err) {
                        return console.error(err);
                    }
                    objSmsRequest.sms_id = objDbSms.Sms_Id;
                    if (Request_Type === 'DISCOUNT') {
                        var Base = require(appRoot + '/libs/Base');
                        var objBase = new Base();
                        if (pb_crn > 0 && disc > 0) {
                            console.error('discsms', config.discount.approver, objSmsRequest['sender_mobile_no'].toString())
                            if (config.discount.approver.indexOf(objSmsRequest['sender_mobile_no'].toString()) > -1) {

                                var ref_code = objBase.randomString(7);
                                ref_code = ref_code.toString().toUpperCase();
                                sms_content = "PB-DISC-ACK\n\
--------------\n\
CRN : " + pb_crn.toString() + "\n\
Discount : " + disc.toString() + "\n\
Reference : " + ref_code;
                                var arrSmsList = {'Msg': sms_content};
                                var Discount_Request = require('../models/discount_request');
                                var objDataDiscountRequest = {
                                    "PB_CRN": pb_crn,
                                    "Insurer_Id": 14,
                                    "Original_Discount": 65,
                                    "Desired_Discount": disc - 0,
                                    "Reference": ref_code,
                                    "Requested_By": objSmsRequest['sender_mobile_no']
                                };
                                var objModelDiscountRequest = new Discount_Request(objDataDiscountRequest);
                                objModelDiscountRequest.save(function (err, objDbDiscountRequest) {
                                    if (err) {
                                        return console.error(err);
                                    }
                                    var objSms = new Sms();
                                    objSms.send_sms(objSmsRequest['sender_mobile_no'], sms_content, objDbSms.Sms_Id, arrSmsList);
                                    res.json({'status': 'success', 'details': 'Disc Approved'});
                                });
                            } else {
                                var objSms = new Sms();
                                sms_content = "PB-DISC-ACK\n\
--------------\n\
Unauthorized";
                                var arrSmsList = {'Msg': sms_content};
                                objSms.send_sms(objSmsRequest['sender_mobile_no'], sms_content, objDbSms.Sms_Id, arrSmsList);
                                res.json({'status': 'success', 'details': 'Unauthorized'});
                            }

                        } else {
                            var objSms = new Sms();
                            sms_content = "PB-DISC-ACK\n\
--------------\n\
CRN or DISC invalid";
                            var arrSmsList = {'Msg': sms_content};
                            objSms.send_sms(objSmsRequest['sender_mobile_no'], sms_content, objDbSms.Sms_Id, arrSmsList);
                            res.json({'status': 'success', 'details': 'CRN or DISC invalid'});
                        }
                    }
                    if (Request_Type === 'POLICY') {
                        var Base = require(appRoot + '/libs/Base');
                        var objBase = new Base();
                        if (pb_crn > 0) {
                            console.error('policy', config.discount.approver, objSmsRequest['sender_mobile_no'].toString());

                            var User_Data = require('../models/user_data');
                            User_Data.findOne({
                                'PB_CRN': pb_crn,
                                'Last_Status': {$in: ['TRANS_SUCCESS_WITH_POLICY', 'TRANS_SUCCESS_WO_POLICY']}}, function (err, objDbUserData) {
                                try {
                                    if (objDbUserData) {
                                        var arr_sender_approver = config.discount.approver;
                                        if (objDbUserData['Premium_Request'].hasOwnProperty('posp_mobile_no') && objDbUserData['Premium_Request']['posp_mobile_no'] > 0) {
                                            arr_sender_approver.push(objDbUserData['Premium_Request']['posp_mobile_no'].toString());
                                        }
                                        if (arr_sender_approver.indexOf(objSmsRequest['sender_mobile_no'].toString()) > -1) {
                                            var ERP_CS = (objDbUserData['ERP_CS'] != '') ? objDbUserData['ERP_CS'] : 'PENDING';
                                            if (objDbUserData['Transaction_Data']['policy_url']) {
                                                var Client = require('node-rest-client').Client;
                                                var client = new Client();
                                                client.get('https://api-ssl.bitly.com/v3/shorten?access_token=' + config.environment.bitly_access_token + '&longUrl=' + encodeURIComponent(objDbUserData['Transaction_Data']['policy_url']), function (data, response) {
                                                    console.log(data);
                                                    if (data && data.status_code === 200) {
                                                        var objSms = new Sms();
                                                        var short_url = data.data.url;
														var customer_name = '',registration_no='';
														if(objDbUserData.hasOwnProperty('Proposal_Request_Core')){
															customer_name = objDbUserData['Proposal_Request_Core']['first_name'] + ' ' + objDbUserData['Proposal_Request_Core']['last_name'];
															registration_no = objDbUserData['Proposal_Request_Core']['registration_no'];
														}
														else{
															customer_name = objDbUserData['Proposal_Request']['first_name'] + ' ' + objDbUserData['Proposal_Request']['last_name'];
															registration_no = objDbUserData['Erp_Qt_Request_Core']['___registration_no___'];
														}
                                                        sms_content = "PB-POLICY\n\
--------------\n\
CRN : " + pb_crn.toString() + "\n\
Customer : " + customer_name + "\n\
Vehicle Number : " + registration_no + "\n\
ERP_CS : " + ERP_CS + "\n\
Message : Policy Generated\n\
URL : " + short_url;
                                                        var arrSmsList = {'Msg': sms_content};
                                                        objSms.send_sms(objSmsRequest['sender_mobile_no'], sms_content, objDbSms.Sms_Id, arrSmsList);
                                                        res.json({'status': 'success', 'details': 'Policy Generated', 'url': short_url});
                                                    }
                                                });
                                            } else {
                                                var objSms = new Sms();
                                                sms_content = "PB-POLICY\n\
--------------\n\
CRN : " + pb_crn.toString() + "\n\
Message : Policy not generated";
                                                var arrSmsList = {'Msg': sms_content};
                                                objSms.send_sms(objSmsRequest['sender_mobile_no'], sms_content, objDbSms.Sms_Id, arrSmsList);
                                                res.json({'status': 'success', 'details': 'Policy Not Generated'});
                                            }

                                        } else {
                                            var objSms = new Sms();
                                            sms_content = "PB-POLICY\n\
--------------\n\
Unauthorized";
                                            var arrSmsList = {'Msg': sms_content};
                                            objSms.send_sms(objSmsRequest['sender_mobile_no'], sms_content, objDbSms.Sms_Id, arrSmsList);
                                            res.json({'status': 'success', 'details': 'Unauthorized'});
                                        }
                                    } else {
                                        var objSms = new Sms();
                                        sms_content = "PB-POLICY\n\
--------------\n\
CRN : " + pb_crn.toString() + "\n\
Message : Invalid CRN or No Sale Occured";
                                        var arrSmsList = {'Msg': sms_content};
                                        objSms.send_sms(objSmsRequest['sender_mobile_no'], sms_content, objDbSms.Sms_Id, arrSmsList);
                                        res.json({'status': 'success', 'details': 'Invalid CRN or No Sale Occured'});
                                    }
                                } catch (e) {
                                    console.error('POLICY_SMS_ERR', 'CRN', pb_crn, e);
                                }
                            });
                        } else {
                            var objSms = new Sms();
                            sms_content = "PB-POLICY\n\
--------------\n\
CRN or DISC invalid";
                            var arrSmsList = {'Msg': sms_content};
                            objSms.send_sms(objSmsRequest['sender_mobile_no'], sms_content, objDbSms.Sms_Id, arrSmsList);
                            res.json({'status': 'success', 'details': 'CRN or DISC invalid'});
                        }
                    }
                    if (Request_Type === 'HELP') {
                        //var arrSmsList = {'Msg': sms_content};
                        var objSms = new Sms();
                        objSms.send_sms(objSmsRequest['receiver_mobile_no'], arrSmsList.Msg1, objDbSms.Sms_Id, arrSmsList);
                        objSms.send_sms(objSmsRequest['receiver_mobile_no'], arrSmsList.Msg2, objDbSms.Sms_Id, arrSmsList);
                        objSms.send_sms(objSmsRequest['receiver_mobile_no'], arrSmsList.Msg3, objDbSms.Sms_Id, arrSmsList);
                        res.json({'status': 'success', 'details': 'Help Sent'});
                    }
                    if (Request_Type === 'POSREG') {
                        var Posp = require('../models/posp');
                        var ObjPosp = {
                            'Sms_Id': objDbSms.Sms_Id,
                            'Name': '',
                            'Mobile': sender_mobile_no,
                            'Email': '',
                            'City': '',
                            'Pincode': '',
                            'Pan': ''
                        };
                        if (typeof ArrSmsReceivedContent[1] !== 'undefined') {
                            ObjPosp['Name'] = ArrSmsReceivedContent[1];
                        }
                        if (typeof ArrSmsReceivedContent[1] !== 'undefined') {
                            ObjPosp['Email'] = ArrSmsReceivedContent[2];
                        }
                        if (typeof ArrSmsReceivedContent[1] !== 'undefined') {
                            ObjPosp['City'] = ArrSmsReceivedContent[3];
                        }
                        if (typeof ArrSmsReceivedContent[1] !== 'undefined') {
                            ObjPosp['Pincode'] = ArrSmsReceivedContent[4];
                        }
                        if (typeof ArrSmsReceivedContent[1] !== 'undefined') {
                            ObjPosp['Pan'] = ArrSmsReceivedContent[5];
                        }
                        console.log('ObjPosp', ObjPosp);
                        var Posp = require('../models/posp');
                        var objModelPosp = new Posp();
                        Posp.findOne({'Mobile': sender_mobile_no.toString()}, null, function (err, objDbPosp) {
                            if (err) {

                            } else {
                                console.log('objDbPospfind', objDbPosp);
                                var objSms = new Sms();
                                if (objDbPosp) {
                                    console.log('objDbPospfind', 'Already posp exists');
                                    var sms_content = 'Welcome to Landmark POSP\n==========================\nSorry, POSP Already registered on this mobile number';
                                    var arrSmsList = {'Msg': sms_content};
                                    objSms.send_sms(objSmsRequest['receiver_mobile_no'], sms_content, objDbSms.Sms_Id, arrSmsList);
                                    res.json({'status': 'fail', 'detais': 'Already POSP Exists'});
                                } else {
                                    console.log('objDbPospfind', 'Posp not exists');
                                    var objModelPosp = new Posp(ObjPosp);
                                    objModelPosp.save(function (err, objDbPosp) {
                                        console.log('objDbPospSave', objDbPosp);
                                        if (err) {
                                            var sms_content = 'Welcome to Landmark POSP\n==========================\nOpps, Error occured. Please contact Admin.';
                                        } else {
                                            var sms_content = 'Welcome to Landmark POSP\n==========================\nCongratulation, Your POSP Registration request is received.\n\nCo-ordinator will contact you.\n\nPOSP Acknowledge Id : LMPOSP#' + objDbPosp.Posp_Id;
                                        }
                                        console.log('objDbPospSave', sms_content);
                                        var arrSmsList = {'Msg': sms_content};
                                        objSms.send_sms(objSmsRequest['receiver_mobile_no'], sms_content, objDbSms.Sms_Id, arrSmsList);
                                        res.json({'status': 'fail', 'details': 'POSP Created', 'posp_id': objDbPosp.Posp_Id});
                                    });
                                }
                            }
                        });
                    }
                    if (Request_Type === 'INFO' || Request_Type === 'QUOTE' || Request_Type === 'SQUOTE' || Request_Type === 'PQUOTE') {

                        if (typeof ArrSmsReceivedContent[1] !== 'undefined') {
                            var tmp_reg_no = ArrSmsReceivedContent[1].toString().toUpperCase();
                            var arr_reg_no = [];
                            arr_reg_no[0] = tmp_reg_no.substr(0, 2);
                            arr_reg_no[1] = tmp_reg_no.substr(2, 2);
                            arr_reg_no[3] = tmp_reg_no.substr(-4);
                            arr_reg_no[2] = tmp_reg_no.replace(arr_reg_no[0], '').replace(arr_reg_no[3], '').replace(arr_reg_no[1], '');
                            objSmsRequest['registration_no'] = arr_reg_no.join('-');
                        }

                        if (typeof ArrSmsReceivedContent[2] !== 'undefined') {
                            objSmsRequest['policy_expiry_date'] = ArrSmsReceivedContent[2];
                        }
                        if (typeof ArrSmsReceivedContent[3] !== 'undefined') {
                            objSmsRequest['is_claim_exists'] = ArrSmsReceivedContent[3];
                        }
                        if (typeof ArrSmsReceivedContent[4] !== 'undefined') {
                            objSmsRequest['vehicle_ncb_current'] = ArrSmsReceivedContent[4];
                        }
                        var ModelVehicle = require('../models/vehicle');
                        var objVehicle = new ModelVehicle();
                        if (Request_Type === 'INFO' || Request_Type === 'QUOTE' || Request_Type === 'SQUOTE') {
                            objVehicle.get_vehicle_fastlane_data(objDbSms.Sms_Id, objSmsRequest);
                        }
                        if (Request_Type === 'PQUOTE') {
                            var Posp = require('../models/posp');
                            var objModelPosp = new Posp();
                            Posp.findOne({'Mobile': sender_mobile_no.toString(), 'Is_Active': true}, null, function (err, objDbPosp) {
                                if (err) {

                                } else {
                                    console.log('objDbPospfind', objDbPosp);
                                    var objSms = new Sms();
                                    if (objDbPosp) {
                                        console.log('objDbPospfind', 'POSP_Valid');
                                        objVehicle.get_vehicle_fastlane_data(objDbSms.Sms_Id, objSmsRequest, objDbPosp);
                                    } else {
                                        var sms_content = 'Welcome to Landmark POSP\n==========================\nOpps, You are yet to be POSP Agent.\n\nPlease contact Admin.';
                                        console.log('objDbPospSave', sms_content);
                                        var arrSmsList = {'Msg': sms_content};
                                        objSms.send_sms(objSmsRequest['sender_mobile_no'], sms_content, objDbSms.Sms_Id, arrSmsList);
                                        res.json({'status': 'fail', 'details': 'Not Valid POSP Agent'});
                                    }
                                }
                            });
                        }
                    }
                    if (Request_Type === 'QUOTEURL') {
                        if (typeof ArrSmsReceivedContent[1] !== 'undefined') {
                            objSmsRequest['email'] = ArrSmsReceivedContent[1];
                        }
                        if (typeof ArrSmsReceivedContent[2] !== 'undefined') {
                            objSmsRequest['quote_id'] = ArrSmsReceivedContent[2];
                        }
                        if (typeof ArrSmsReceivedContent[3] !== 'undefined') {
                            objSmsRequest['selected_addon'] = ArrSmsReceivedContent[3];
                        }
                        var Service_Log = require('../models/service_log');
                        Service_Log.findOne({'Service_Log_Id': objSmsRequest['quote_id'] - 0}, null, function (err, objDbServiceLog) {
                            if (err) {

                            } else {
                                if (objDbServiceLog) {

                                    var Request = require('../models/request');
                                    Request.findOne({'Request_Id': objDbServiceLog._doc['Request_Id']}, null, function (err, objDbRequest) {
                                        if (err) {

                                        } else {
                                            //save addon data start
                                            var Motor = require('../libs/Motor');
                                            var objMotor = new Motor();
                                            var Client = require('node-rest-client').Client;
                                            var client = new Client();
                                            var request_data = {
                                                "client_key": objDbRequest._doc.Request_Core['client_key'],
                                                "secret_key": objDbRequest._doc.Request_Core['secret_key'],
                                                'search_reference_number': objDbRequest._doc['Request_Unique_Id'],
                                                "data_type": 'addon'
                                            };
                                            if (objSmsRequest['selected_addon'] !== '') {
                                                var arrSelectedAddon = objSmsRequest['selected_addon'].toString().split('+');
                                                for (var j in objMotor.const_addon_master) {
                                                    var key = j.toString().replace('addon_', '').replace('_cover', '').replace(/\_/g, ' ');
                                                    key = objModelSms.camelize(key);
                                                    var keyCode = '';
                                                    var addKey = key.split(' ');
                                                    for (var h in addKey) {
                                                        keyCode += addKey[h].substr(0, 1);
                                                    }
                                                    if (arrSelectedAddon.indexOf(keyCode) > -1) {
                                                        request_data[j] = 'yes';
                                                    }
                                                }

                                                var args = {
                                                    data: request_data,
                                                    headers: {
                                                        "Content-Type": "application/json"
                                                    }
                                                };
                                                client.post(config.environment.weburl + '/quote/save_user_data', args, function (data, response) {
                                                    console.log(data);
                                                });
                                            }
                                            //save addon data end

                                            console.log('objDbRequest', objDbRequest);
                                            objDbSms.Receiver = objDbRequest._doc.Request_Core['mobile'];
                                            var BuyPageURL = config.environment.portalurl + '/buynowTwoWheeler/6/' + objDbServiceLog._doc.Service_Log_Unique_Id + '/NONPOSP/1';
                                            var Short_Url = require('../models/short_url');
                                            var objShortUrl = new Short_Url();
                                            objShortUrl.create_short_url(BuyPageURL, objDbSms, Request_Type);

                                        }
                                    });
                                } else {

                                }
                            }
                        });
                    }
                    if (Request_Type === 'PQUOTEURL') {
                        var Posp = require('../models/posp');
                        var objModelPosp = new Posp();
                        Posp.findOne({'Mobile': sender_mobile_no.toString(), 'Is_Active': true}, null, function (err, objDbPosp) {
                            if (err) {

                            } else {
                                console.log('objDbPospfind', objDbPosp);
                                var objSms = new Sms();
                                if (objDbPosp) {
                                    console.log('objDbPospfind', 'POSP_Valid');
                                    if (objDbPosp.Status === 'Certified') {
                                        if (typeof ArrSmsReceivedContent[1] !== 'undefined') {
                                            objSmsRequest['email'] = ArrSmsReceivedContent[1];
                                        }
                                        if (typeof ArrSmsReceivedContent[2] !== 'undefined') {
                                            objSmsRequest['quote_id'] = ArrSmsReceivedContent[2];
                                        }
                                        if (typeof ArrSmsReceivedContent[3] !== 'undefined') {
                                            objSmsRequest['selected_addon'] = ArrSmsReceivedContent[3];
                                        }
                                        var Service_Log = require('../models/service_log');
                                        Service_Log.findOne({'Service_Log_Id': objSmsRequest['quote_id'] - 0}, null, function (err, objDbServiceLog) {
                                            if (err) {

                                            } else {
                                                var Request = require('../models/request');
                                                Request.findOne({'Request_Id': objDbServiceLog._doc['Request_Id']}, null, function (err, objDbRequest) {
                                                    if (err) {

                                                    } else {
                                                        //save addon data start
                                                        var Motor = require('../libs/Motor');
                                                        var objMotor = new Motor();
                                                        var Client = require('node-rest-client').Client;
                                                        var client = new Client();
                                                        var request_data = {
                                                            "client_key": objDbRequest._doc.Request_Core['client_key'],
                                                            "secret_key": objDbRequest._doc.Request_Core['secret_key'],
                                                            'search_reference_number': objDbRequest._doc['Request_Unique_Id'],
                                                            "data_type": 'addon'
                                                        };
                                                        if (objSmsRequest['selected_addon'] !== '') {
                                                            var arrSelectedAddon = objSmsRequest['selected_addon'].toString().split('+');
                                                            for (var j in objMotor.const_addon_master) {
                                                                var key = j.toString().replace('addon_', '').replace('_cover', '').replace(/\_/g, ' ');
                                                                key = objModelSms.camelize(key);
                                                                var keyCode = '';
                                                                var addKey = key.split(' ');
                                                                for (var h in addKey) {
                                                                    keyCode += addKey[h].substr(0, 1);
                                                                }
                                                                if (arrSelectedAddon.indexOf(keyCode) > -1) {
                                                                    request_data[j] = 'yes';
                                                                }
                                                            }

                                                            var args = {
                                                                data: request_data,
                                                                headers: {
                                                                    "Content-Type": "application/json"
                                                                }
                                                            };
                                                            client.post(config.environment.weburl + '/quote/save_user_data', args, function (data, response) {
                                                                console.log(data);
                                                            });
                                                        }
                                                        //save addon data end

                                                        console.log('objDbRequest', objDbRequest);
                                                        objDbSms.Receiver = objDbRequest._doc.Request_Core['mobile'];
                                                        var BuyPageURL = config.environment.portalurl + '/buynowTwoWheeler/6/' + objDbServiceLog._doc.Service_Log_Unique_Id + '/POSP/1'
                                                        var Short_Url = require('../models/short_url');
                                                        var objShortUrl = new Short_Url();
                                                        objShortUrl.create_short_url(BuyPageURL, objDbSms, Request_Type);
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        var sms_content = 'Welcome to Landmark POSP\n==========================\nOpps, You are yet to be Certified POSP Agent.\nDo not hurry to sale.\n\nPlease contact Admin.';
                                        console.log('objDbPospSave', sms_content);
                                        var arrSmsList = {'Msg': sms_content};
                                        objSms.send_sms(objSmsRequest['receiver_mobile_no'], sms_content, objDbSms.Sms_Id, arrSmsList);
                                        res.json({'status': 'fail', 'details': 'Not Valid POSP Agent', 'posp_id': objDbPosp.Posp_Id});
                                    }

                                } else {
                                    var sms_content = 'Welcome to Landmark POSP\n==========================\nOpps, You are yet to be POSP Agent.\n\nPlease contact Admin.';
                                    console.log('objDbPospSave', sms_content);
                                    var arrSmsList = {'Msg': sms_content};
                                    objSms.send_sms(objSmsRequest['receiver_mobile_no'], sms_content, objDbSms.Sms_Id, arrSmsList);
                                    res.json({'status': 'fail', 'details': 'Not Valid POSP Agent', 'posp_id': objDbPosp.Posp_Id});
                                }
                            }
                        });
                    }
                });
            } else {
                console.log('SMS or Mobile is empty');
            }

        } catch (e) {
            console.error('Exception', '/sms/receive', e);
        }
    });
};
