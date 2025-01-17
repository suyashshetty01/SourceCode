/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var express = require('express');
var config = require('config');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var razorpay_payment = require('../models/razorpay_payment');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var moment = require('moment');
var appRoot = path.dirname(path.dirname(require.main.filename));
module.exports.controller = function (app) {
    router.post('/razorpay_payment', function (req, res) {
        try {
            var objres = {};
            var razorpay_payment = require('../models/razorpay_payment');
            var razorpay_payment_data = new razorpay_payment();
            for (var key in req.body)
            {
                razorpay_payment_data[key] = req.body[key];
            }
            razorpay_payment_data.Created_On = new Date();
            razorpay_payment_data.Modified_On = new Date();
            razorpay_payment_data.Transaction_Status = "Pending";
            razorpay_payment.find({}).sort({"Transaction_Id": -1}).limit(1).exec(function (err1, dbRequest) {
                if (err1)
                {

                } else
                {
                    razorpay_payment_data.save(function (err) {
                        if (err) {
                            objres = {
                                "MSG": err,
                                "Status": "Fail",
                                "Transaction_Id": "0"
                            };
                            res.json(objres);
                        } else {
                            if (dbRequest.length === 0)
                            {
                                objres = {
                                    "MSG": "Congratulation !! Transaction data updated successfully. Kindly note your Transaction Id : 1",
                                    "Status": "Success",
                                    "Transaction_Id": 1
                                };
                                res.json(objres);
                            } else
                            {
                                objres = {
                                    "MSG": "Congratulation !! Transaction data updated successfully. Kindly note your Transaction Id : " + (dbRequest[0]['_doc'].Transaction_Id - 0 + 1),
                                    "Status": "Success",
                                    "Transaction_Id": dbRequest[0]['_doc'].Transaction_Id - 0 + 1
                                };
                                res.json(objres);
                            }
                        }
                    });
                }
            });
        } catch (e) {
            objres = {
                "MSG": e,
                "Status": "Fail",
                "Transaction_Id": "0"
            };
            res.json(objres);
        }
    });
    app.get('/razorpay_payment/update_transaction_status/:transaction_id/:status/:PayId', function (req, res) {
        try {
            var transaction_id = req.params['transaction_id'] - 0;
            var status = req.params['status'];
            var PayId = req.params['PayId'];
            var objdata = {'Transaction_Status': status, "PayId": PayId};
            razorpay_payment.update({'Transaction_Id': transaction_id}, {$set: objdata}, function (err, numAffected) {
                if (err) {
                    res.json({"Status": "Error", "Transaction_Id": 0, "Msg": err});
                } else {
                    razorpay_payment.findOne({"Transaction_Id": transaction_id}).exec(function (err1, dbObject) {
                         var SmsLog = require('../models/sms_log');
                        var objsmsLog = new SmsLog();
                        var dt = new Date();
                        var obj_err_sms = {
                            '___agent_name___':dbObject._doc.Name,
                            '___agent_mobile___':dbObject._doc.Mobile,
                            '___lead_count___':dbObject._doc.Lead_Count,
                            '___amount___':dbObject._doc.Total_Premium,
                            '___current_dt___': dt.toLocaleString()
                        };
                        var err_sms_data = objsmsLog.leadPurchase(obj_err_sms);
                        objsmsLog.send_sms('7208803933', err_sms_data, 'METHOD_SYNC_PURCHASE_MSG'); //Ashish
                        objsmsLog.send_sms('7666020532', err_sms_data, 'METHOD_SYNC_PURCHASE_MSG');//Chirag
                        objsmsLog.send_sms('9619160851', err_sms_data, 'METHOD_SYNC_PURCHASE_MSG'); //Anuj  
                    });
                    res.json({"Status": status, "Transaction_Id": transaction_id, "Msg": "Data Updated Successfully"});
                }
                //res.json(objUserData);
            });
        } catch (e) {
            res.json({"Status": "Error", "Transaction_Id": 0, "Msg": e});
        }
    });
    
    app.get('/razorpay_payment/update_coins_transaction_status/:transaction_id/:status', function (req, res) {
        try {
            var transaction_id = req.params['transaction_id'] - 0;
            var status = req.params['status'];
            var objdata = {'Transaction_Status': status};
            razorpay_payment.update({'Transaction_Id': transaction_id}, {$set: objdata}, function (err, numAffected) {
                if (err) {
                    res.json({"Status": "Error", "Transaction_Id": 0, "Msg": err});
                } else {
                    razorpay_payment.findOne({"Transaction_Id": transaction_id}).exec(function (err1, dbObject) {
                         var SmsLog = require('../models/sms_log');
                        var objsmsLog = new SmsLog();
                        var dt = new Date();
                        var obj_err_sms = {
                            '___agent_name___':dbObject._doc.Name,
                            '___agent_mobile___':dbObject._doc.Mobile,
                            '___lead_count___':dbObject._doc.Lead_Count,
                            '___amount___':dbObject._doc.Total_Premium,
                            '___current_dt___': dt.toLocaleString()
                        };
                        var err_sms_data = objsmsLog.leadPurchase(obj_err_sms);
                        objsmsLog.send_sms('9320208175', err_sms_data, 'METHOD_SYNC_PURCHASE_MSG'); //Piyush
                        /*
                        objsmsLog.send_sms('7208803933', err_sms_data, 'METHOD_SYNC_PURCHASE_MSG'); //Ashish
                        objsmsLog.send_sms('7666020532', err_sms_data, 'METHOD_SYNC_PURCHASE_MSG');//Chirag
                        objsmsLog.send_sms('9619160851', err_sms_data, 'METHOD_SYNC_PURCHASE_MSG'); //Anuj  
                        */
                    });
                    res.json({"Status": status, "Transaction_Id": transaction_id, "Msg": "Data Updated Successfully"});
                }
                //res.json(objUserData);
            });
        } catch (e) {
            res.json({"Status": "Error", "Transaction_Id": 0, "Msg": e});
        }
    });
    app.get('/razorpay_payment/transaction_details/:Transaction_Id', function (req, res) {
        try {
            var resData = {
            };
            var Transaction_Id = req.params['Transaction_Id'] - 0;
            razorpay_payment.findOne({"Transaction_Id": Transaction_Id}).exec(function (err1, dbObject) {
                if (err1) {
                    resData = {
                        "Message": "Error",
                        "Status": "error",
                        "StatusNo": 1,
                        "MasterData": err1
                    };
                    res.json(resData);
                } else {
                    resData = {
                        "Message": "Success",
                        "Status": "success",
                        "StatusNo": 0,
                        "MasterData": dbObject
                    };
                    res.json(resData);
                }
            });
        } catch (err) {
            resData = {
                "Message": "Error",
                "Status": "error",
                "StatusNo": 1,
                "MasterData": err
            };
            res.json(resData);
        }
    });
    app.get('/razorpay_payment/invoice/:Transaction_Id', function (req, res) {
        try {
            var Transaction_Id = req.params['Transaction_Id'] - 0;
            razorpay_payment.findOne({"Transaction_Id": Transaction_Id}).exec(function (err, dbObject) {
                if (err) {
                    res.send(err);
                } else {
                    var pdf_file_name = Transaction_Id + '.pdf';
                    var html_file_name = Transaction_Id + '.html';
                    var html_web_path_portal = config.environment.downloadurl + '/tmp/invoice/' + html_file_name;
                    var pdf_web_path_portal = config.environment.downloadurl + '/tmp/invoice/' + pdf_file_name;
                    var html_file_path = appRoot + "/resource/request_file/razorpay-invoice.html"; //for UAT
                    var pdf_file_path = appRoot + "/tmp/invoice/" + Transaction_Id + '.pdf';
                    var html_pdf_file_path = appRoot + "/tmp/invoice/" + Transaction_Id + '.html';
                    var htmlPol = fs.readFileSync(html_file_path, 'utf8');
                    var replacedata = {
                        '___name___': dbObject._doc.Name,
                        '___total_amount___': dbObject._doc.Total_Premium,
                        '___net_amount____': dbObject._doc.Net_Premium,
                        '___service_tax___': dbObject._doc.Service_Tax,
                        '___per_lead_amount___': dbObject._doc.Plan,
                        '___transaction_id___': dbObject._doc.Transaction_Id,
                        '___lead_count___': dbObject._doc.Lead_Count,
                        '___invoice_date___': moment(new Date()).format("DD MMMM YYYY")
                    };
                    htmlPol = htmlPol.toString().replaceJson(replacedata);
                    var sleep = require('system-sleep');
                    sleep(2000);
                    var request_html_file = fs.writeFileSync(html_pdf_file_path, htmlPol);
                    try {
                        var http = require('http');
                        //var insurer_pdf_url = "http://qa.policyboss.com:3000/html2pdf?o=download&u=http://qa-horizon.policyboss.com:3000/tmp/invoice/123.html";
                        var insurer_pdf_url = "http://qa.policyboss.com:3000/html2pdf?o=download&u=" + html_web_path_portal;
                        var file_horizon = fs.createWriteStream(pdf_file_path);
                        var request_horizon = http.get(insurer_pdf_url, function (response) {
                            response.pipe(file_horizon);
                        });
                        var Email = require('../models/email');
                        var objModelEmail = new Email(); 
                        let sub = '[Invoice]INFO-LEAD_SYNC_CONTACT_INVOICE';
                        let res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>Followup List</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                        res_report += '<p>Dear Customer,</p><br/>';
                        res_report += '<p>Please find attached Tax Invoice for your purchase.<br/></p>';
                        res_report += '<p>URL : '+pdf_web_path_portal+'</p>';
                        res_report += '</body></html>';
                        objModelEmail.send('customercare@rupeeboss.com',dbObject._doc.Email, sub, res_report, '', config.environment.notification_email, '');
                        res.json({'Status': 'Success', 'Msg': "File created Successfully"});
                    } catch (ex1) {
                        console.error('Exception', this.constructor.name, 'verification_response_handler', ex1);
                        res.json({'Status': 'error', 'Msg': ex1});
                    }
                }
            });
        } catch (err) {
            res.json({'Status': 'error', 'Msg': err});
        }
    });
};