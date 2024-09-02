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
    app.get('/razorpay_payment/update_transaction_status/:transaction_id?/:status?/:PayId?', function (req, res) {
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
                            '___agent_name___': dbObject._doc.Name,
                            '___agent_mobile___': dbObject._doc.Mobile,
                            '___lead_count___': dbObject._doc.Lead_Count,
                            '___amount___': dbObject._doc.Total_Premium,
                            '___current_dt___': dt.toLocaleString(),
                            '___transaction_status___': dbObject._doc.Transaction_Status,
                            '___purchase_message___': dbObject._doc.Transaction_Status === "Success" ? "Customer has purchase lead successfully." : "Transaction Cancel."
                        };
                        var err_sms_data = objsmsLog.leadPurchase(obj_err_sms);
                        objsmsLog.send_sms('7208803933', err_sms_data, 'METHOD_SYNC_PURCHASE_MSG'); //Ashish
                        objsmsLog.send_sms('7666020532', err_sms_data, 'METHOD_SYNC_PURCHASE_MSG');//Chirag
                        objsmsLog.send_sms('9619160851', err_sms_data, 'METHOD_SYNC_PURCHASE_MSG'); //Anuj 
						objsmsLog.send_sms('9320208175', err_sms_data, 'METHOD_SYNC_PURCHASE_MSG'); //Piyush
                    });
                    res.json({"Status": status, "Transaction_Id": transaction_id, "Msg": "Data Updated Successfully"});
                }
                //res.json(objUserData);
            });
        } catch (e) {
            res.json({"Status": "Error", "Transaction_Id": 0, "Msg": e});
        }
    });
    app.get('/razorpay_payment/update_fatakpay_transaction_status/:transaction_id?/:status?/:PayId?', function (req, res) {
        try {
            var Client = require('node-rest-client').Client;
            var client = new Client();
            var fatakpay_details = require('../models/fatakpay_detail');
            let transaction_id = req.params['transaction_id'] - 0;
            let status = req.params['status'];
            let res_Status = (status && status === "COMPLETE") ? "SUCCESS" : "FAIL";
            let PayId = req.params['PayId'] ? req.params['PayId'] : null;
            let reqQuery = req.query;
            let objdata = {
                'Transaction_Status': res_Status,
                "PayId": PayId,
                "Total_Premium": reqQuery.first_payment && (reqQuery.first_payment - 0) || 0
            };
            razorpay_payment.update({'Transaction_Id': transaction_id}, {$set: objdata}, function (razorpay_payment_err_1, razorpay_payment_data_1) {
                if (razorpay_payment_err_1) {
                    res.json({"Status": "FAIL", "Transaction_Id": 0, "Msg": razorpay_payment_err_1});
                } else {
                    objdata = {'Transaction_Status': (status).toUpperCase(), "Pay_Id": PayId};
                    if (reqQuery && reqQuery.first_payment) {
                        objdata["Installment"] = "First";
                        objdata["Installment_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                        objdata["Installment_Amt"] = reqQuery.first_payment - 0;
                    }
                    fatakpay_details.findOneAndUpdate({'Transaction_Id': transaction_id}, {$set: objdata}, {new : true}, function (fatakpay_details_err_2, fatakpayDetailsDBData) {
                        if (fatakpay_details_err_2) {
                            res.json({"Status": "FAIL", "Transaction_Id": 0, "Msg": fatakpay_details_err_2});
                        } else {
                            let save_data_in_history = {
                                "PB_CRN": fatakpayDetailsDBData.PB_CRN && fatakpayDetailsDBData.PB_CRN - 0 || null,
                                "User_Data_Id": fatakpayDetailsDBData.User_Data_Id && fatakpayDetailsDBData.User_Data_Id - 0 || null,
                                "Proposal_Id": fatakpayDetailsDBData.Proposal_Id && fatakpayDetailsDBData.Proposal_Id - 0 || null,
                                "Insurer_Id": fatakpayDetailsDBData.Insurer_Id && fatakpayDetailsDBData.Insurer_Id - 0 || null,
                                "Application_Loan_Id": fatakpayDetailsDBData.Application_Loan_Id && fatakpayDetailsDBData.Application_Loan_Id - 0 || null,
                                "Premium_Amount": fatakpayDetailsDBData.Premium_Amount || 0,
                                "Emi_Amount": fatakpayDetailsDBData.Emi_Amount || 0,
                                "PAN": fatakpayDetailsDBData.PAN || "",
                                "Tenure": fatakpayDetailsDBData.Tenure || null,
                                "EMI_Status": fatakpayDetailsDBData.EMI_Status || "",
                                "Ss_Id": fatakpayDetailsDBData.Ss_Id && fatakpayDetailsDBData.Ss_Id - 0 || null,
                                "Transaction_Id": transaction_id,
                                "Transaction_Status": (status).toUpperCase()
                            };
                            let save_fatakpay_history_args = {
                                data: save_data_in_history,
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            };
                            try {
                                client.post(config.environment.weburl + '/fatakpays/save_fatakpay_histories', save_fatakpay_history_args, function (save_fatakpay_history_data, save_fatakpay_history_response) {
                                    if (fatakpayDetailsDBData && Object.keys(fatakpayDetailsDBData).length > 0) {
                                        if (status === 'COMPLETE') {
                                            let argsForEmiRedirection = {
                                                "crn": fatakpayDetailsDBData.PB_CRN || 0,
                                                "udid": fatakpayDetailsDBData.User_Data_Id || 0,
                                                "proposal_id": fatakpayDetailsDBData.Proposal_Id || 0,
                                                "insurer_id": fatakpayDetailsDBData.Insurer_Id || 0,
                                                "application": fatakpayDetailsDBData.Application_Loan_Id || 0,
                                                "premium_amount": fatakpayDetailsDBData.Premium_Amount || 0,
                                                "first_payment": fatakpayDetailsDBData.Emi_Amount || 0,
                                                "pb_tnx_id": fatakpayDetailsDBData.Transaction_Id || 0,
                                                "tenure": fatakpayDetailsDBData.Tenure - 0 || 0,
                                                "ss_id": fatakpayDetailsDBData.Ss_Id - 0 || 0,
                                                "pan": fatakpayDetailsDBData.PAN || "",
                                                "payment_link": fatakpayDetailsDBData.Proposal_Confirm_Url || ""
                                            };
                                            let insurer_redirect_args = {
                                                data: argsForEmiRedirection,
                                                headers: {
                                                    "Content-Type": "application/json"
                                                }
                                            };
                                            try {
                                                client.post(config.environment.weburl + '/postservicecall/fatakpay/insurance_redirection', insurer_redirect_args, function (insurance_redirection_data, insurance_redirection_response) {
                                                    client.get(config.environment.weburl + "/fatakpays/mail_send?udid=" + (fatakpayDetailsDBData.User_Data_Id - 0), function (send_mail_data, send_mail_response) {
                                                        if (insurance_redirection_data && insurance_redirection_data.Status === "SUCCESS") {
                                                            res.json({"Status": res_Status, "Transaction_Id": transaction_id, "Msg": "EMI REDIRECTION SUCCESSFULLY"});
                                                        } else {
                                                            res.json({"Status": res_Status, "Transaction_Id": transaction_id, "Msg": "EMI REDIRECTION FAIL"});
                                                        }
                                                    });
                                                });
                                            } catch (e) {
                                            }
                                        } else {
                                            res.json({"Status": res_Status, "Transaction_Id": transaction_id, "Msg": "FATAKPAY TRANSACTION FAIL"});
                                        }
                                    } else {
                                        res.json({"Status": res_Status, "Transaction_Id": transaction_id, "Msg": "NO RECORD AVAILABLE IN FATAKPAY DETAILS"});
                                    }
                                });
                            } catch (e) {
                            }
                        }
                    });
                }
            });
        } catch (e) {
            res.json({"Status": "FAIL", "Transaction_Id": 0, "Msg": e.stack});
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
                        var http = require('https');
                        //var insurer_pdf_url = "http://qa.policyboss.com:3000/html2pdf?o=download&u=http://qa-horizon.policyboss.com:3000/tmp/invoice/123.html";
                        //var insurer_pdf_url = "http://qa.policyboss.com:3000/html2pdf?o=download&u=" + html_web_path_portal;
                        var insurer_pdf_url = config.environment.pdf_url + html_web_path_portal;
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
                        res_report += '<p>URL : ' + pdf_web_path_portal + '</p>';
                        res_report += '</body></html>';
                        //objModelEmail.send('customercare@rupeeboss.com',dbObject._doc.Email, sub, res_report, '', config.environment.notification_email, '');
                        objModelEmail.send('customercare@rupeeboss.com', config.environment.notification_email, sub, res_report, '', '', '');
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
    app.get('/razorpay_payment/capture/:Transaction_Id', function (req, res) {
        try {
            var Transaction_Id = req.params['Transaction_Id'] - 0;
            var request = require('request');
            razorpay_payment.findOne({"Transaction_Id": Transaction_Id}).exec(function (err, dbObject) {
                if (err) {
                    res.send(err);
                } else {
                    var Total_Premium = dbObject._doc.Total_Premium;
                    Total_Premium = Total_Premium * 100;
                    var PayId = dbObject._doc.PayId;
                    request({
                        method: 'POST',
                        //url:'https://rzp_test_f34VagERxxOw9y:qezo8CJQ8xiBcZNloDrLNHok@api.razorpay.com/v1/payments/'+PayId+'/capture',
                        //url:'https://rzp_live_b7vQ8lyFs69syy:Hj5Bkherf4URhXsNwJfHwKpZ@api.razorpay.com/v1/payments/'+PayId+'/capture',
                        //url: 'https://<YOUR_KEY_ID>:<YOUR_KEY_SECRET>@api.razorpay.com/v1/payments/pay_29QQoUBi66xm2f/capture',
                        url: 'https://rzp_live_DFxDFYDslN2DIq:4SQY3QpIIo1uil3XZgOKtScK@api.razorpay.com/v1/payments/' + PayId + '/capture',
                        form: {
                            amount: Total_Premium,
                            currency: "INR"
                        }
                    }, function (error, response, body) {
                        console.log('razorpay payment capture Status:', response.statusCode);
                        console.log('razorpay payment capture Headers:', JSON.stringify(response.headers));
                        console.log('razorpay payment capture Response:', body);
                        res.json({'Status': 'Success', 'Msg': "Razorpay capture services run successfully"});
                    });

                }
            });
        } catch (err) {
            res.json({'Status': 'error', 'Msg': err});
        }
    });

    app.get('/posp_razorpay_payment/capture/:Pay_Id', function (req, res) {
        try {
            var Pay_Id = req.params['Pay_Id'];
            var request = require('request');
            razorpay_payment.findOne({"PayId": Pay_Id}).exec(function (err, dbObject) {
                if (err) {
                    res.json({'Status': 'Fail', 'Msg': err});
                } else {
                    var Total_Premium = dbObject._doc.Total_Premium;
                    Total_Premium = Total_Premium * 100;
                    var PayId = dbObject._doc.PayId;
                    request({
                        method: 'POST',
                        //url:'https://rzp_test_f34VagERxxOw9y:qezo8CJQ8xiBcZNloDrLNHok@api.razorpay.com/v1/payments/'+PayId+'/capture',
                        //url:'https://rzp_live_b7vQ8lyFs69syy:Hj5Bkherf4URhXsNwJfHwKpZ@api.razorpay.com/v1/payments/'+PayId+'/capture',
                        //url: 'https://<YOUR_KEY_ID>:<YOUR_KEY_SECRET>@api.razorpay.com/v1/payments/pay_29QQoUBi66xm2f/capture',
                        url: 'https://rzp_live_DFxDFYDslN2DIq:4SQY3QpIIo1uil3XZgOKtScK@api.razorpay.com/v1/payments/' + PayId + '/capture',
                        form: {
                            amount: Total_Premium,
                            currency: "INR"
                        }
                    }, function (error, response, body) {
                        console.log('razorpay payment capture Status:', response.statusCode);
                        console.log('razorpay payment capture Headers:', JSON.stringify(response.headers));
                        console.log('razorpay payment capture Response:', body);
                        res.json({'Status': 'Success', 'Msg': "Razorpay capture services run successfully"});
                    });

                }
            });
        } catch (err) {
            res.json({'Status': 'error', 'Msg': err});
        }
    });


    app.get('/razorpay-transaction-status/:Transaction_Id?/:Status?/:PayId?', function (req, res) {
        try {
            let Client = require('node-rest-client').Client;
            let client = new Client();
            let Transaction_Id = req.params['Transaction_Id'];
            let Status = req.params['Status'];
            let PayId = req.params['PayId'];
            /*client.get('https://horizon.policyboss.com/razorpay-transaction-status/' + Transaction_Id + '/' + Status + '/' + PayId, function (data, response) {
             res.send("Success");
             });*/
            res.redirect('https://horizon.policyboss.com/razorpay-transaction-status/' + Transaction_Id + '/' + Status + '/' + PayId);
        } catch (e) {
            console.error("/razorpay-transaction-status", e.stack);
            res.send("Error : " + e.stack);
        }
    });
    app.all('/razorpay_payment/update_posp_payment_status/:ss_id?/:status?/:PayId?', function (req, res) {
        try {
            let Posp_User = require('../models/posp_users.js');
            var razorpay_payment = require('../models/razorpay_payment');
            let Client = require('node-rest-client').Client;
            let client = new Client();
            let ss_id = req.params.ss_id ? req.params.ss_id - 0 : "";
            let status = req.params.status ? req.params.status : "Cancel";
            let PayId = req.params.PayId && req.params.PayId !== "undefined" ? req.params['PayId'] : "NA";
            let objdata = {'Payment_Status': status, "PayId": PayId, 'Paid_On': moment().format("YYYY-MM-DDTHH:mm:ss[Z]")};
            let amount = 999, GST = 18;
            let invoice_serial_no = "";
            let fba_id = 0, cust_id = 0;
            let razorypay_obj = {};
            let Addtorazorpaydata_Status = "", Addtorazorpaydata_Msg = "";
            let netAmount = Math.round(((amount * 100) / (100 + GST)) * 100) / 100;
            netAmount = Math.floor(netAmount);
            let totalTax = Math.round((amount - netAmount) * 100) / 100;
            let CGST = Math.round((totalTax / 2) * 100) / 100;
            let IGST = CGST + CGST;
            console.error("POSP_PAYMENT_DETAILS : Ss_ID : " + ss_id + " status : " + status + " PayId : " + PayId);
			if (ss_id && status === "Cancel") {
                try {
                    client.get(config.environment.weburl + '/posps/report/email_consolidate_process?ss_id=' + ss_id + '&event_type=PAYMENT_NOT_DONE', {}, function (mail_data, mail_res) {
					console.error('SEND_PAYMENT_NOT_DONE_MAIL', 'Ss_Id: ' + ss_id);
										});
									} catch (ex) {
					console.error('EXCEPTION_IN_PAYMENT_NOT_DONE_MAIL', 'Ss_Id: ' + ss_id, ex.stack);
									}
            } 
            Posp_User.find({'User_Id': ss_id}, function (posp_user_err, posp_user_res) {
                if (posp_user_err) {
                    res.json({"Status": "Error", "Ss_Id": ss_id, "Msg": posp_user_err});
                } else {
                    if (posp_user_res && posp_user_res.length > 0) {
                        let posp_user_data = posp_user_res[0]._doc;
                        if (posp_user_data.PayId && posp_user_data.Payment_Status === "Success" && posp_user_data.rzp_id) {
                            res.json({"Status": "Success", "Msg": "POSP payment details updated successfully"});
                        } else {
                            client.get(config.environment.weburl + "/onboarding/get_total_payment_count", {}, function (inv_no_res, response) {
                                if (inv_no_res && inv_no_res.Status && inv_no_res.Status === "Success") {
                                    invoice_serial_no = inv_no_res.Incremented_Count;
                                    status !== "Success" ? invoice_serial_no = "00000" : invoice_serial_no;
                                    console.error("Nilam on line 1");
                                    Posp_User.findOneAndUpdate({'User_Id': ss_id}, {$set: objdata}, {new : true}, function (err, documents) {
                                        if (err) {
                                            res.json({"Status": "Error", "Ss_Id": 0, "Msg": err});
                                        } else {
                                            if (documents && documents._doc) {
                                                console.error("Nilam on line 2");
                                                let posp_details = documents._doc;
                                                fba_id = posp_details.Fba_Id;
                                                cust_id = posp_details.Cust_Id;
                                                razorypay_obj = {
                                                    "Transaction_Status": objdata.Payment_Status,
                                                    "Modified_On": new Date(),
                                                    "Created_On": new Date(),
                                                    "Lead_Count": 0,
                                                    "Total_Premium": amount,
                                                    "Service_Tax": totalTax,
                                                    "Net_Premium": netAmount,
                                                    "Plan": amount,
                                                    "Email": posp_details.Email_Id,
                                                    "Mobile": posp_details.Mobile_Number,
                                                    "Name": posp_details.First_Name + " " + posp_details.Last_Name,
                                                    "Fba_ID": posp_details.Fba_Id,
                                                    "Ss_Id": ss_id,
                                                    "PayId": objdata.PayId,
                                                    "Invoice_No": invoice_serial_no,
                                                    "Source": "POSP_ONBOARD"
                                                };
                                                var razorpay_payment_data = new razorpay_payment(razorypay_obj);
                                                razorpay_payment_data.save(function (err, razorpay_res) {
                                                    if (err) {
                                                        res.json({"Status": "Fail", "Msg": "Status Not Updated.", "data": err});
                                                    } else {
                                                        console.error("Nilam on line 3");
                                                        let RZP_Invoice_No = razorpay_res._doc.Invoice_No;
                                                        let args = {
                                                            "rzp_id": RZP_Invoice_No
                                                        };
                                                        Posp_User.update({"User_Id": ss_id}, {$set: args}, function (err, numAffected) {
                                                            if (err) {
                                                                res.json({"Status": "Fail", "Msg": "Error while adding posp details", "data": err});
                                                            } else {
                                                                console.error("Nilam on line 4");
                                                                if (status === "Success") {
                                                                    // start add by roshani 05-09-2023
                                                                    try {
                                                                        let payment_update_args = {
                                                                            data: {
                                                                                "Is_Paid": 1,
                                                                                "Paid_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                                                                            },
                                                                            headers: {
                                                                                "Content-Type": "application/json"

                                                                            }
                                                                        };
                                                                        client.post(config.environment.weburl + "/onboarding/posp_data_update?ss_id=" + ss_id, payment_update_args, function (iib_upload_update_data, iib_upload_update_response) {});
                                                                    } catch (e) {
                                                                        console.error('Update POSP collection at the time of Successful Payment', e.stack);
                                                                    }
                                                                    // end add by roshani 05-09-2023
                                                                    let rest_args = {
                                                                        data: {
                                                                            "FBAID": fba_id,
                                                                            "CustId": cust_id,
                                                                            "PayId": PayId
                                                                        },
                                                                        headers: {
                                                                            'token': '1234567890',
                                                                            "Content-Type": "application/json"
                                                                        }
                                                                    };
                                                                    console.error("Nilam on line 5");
                                                                    client.post("http://api.magicfinmart.com/api/Addtorazorpaydata", rest_args, function (add_razorpay_data, response) {
                                                                        if (add_razorpay_data && add_razorpay_data.Message && add_razorpay_data.Message === "Success" && add_razorpay_data.Status && add_razorpay_data.Status === "success") {
                                                                            console.error("POSP: Added to razorpay", add_razorpay_data);
                                                                            client.get(config.environment.weburl + "/posp_razorpay_payment/capture/"+PayId, {}, function (capture_data, capture_response) {
                                                                            });
                                                                           client.get(config.environment.weburl + "/onboarding/generate_onboarding_invoice?User_Id=" + ss_id, {}, function (invoice_data, invoice_response) {
                                                                            });
                                                                            res.json({"Status": "Success", "Msg": "Added to razorpay"});
                                                                        } else {
                                                                            console.error("UPDATE_POSP_RAZOR_PAYMENT : Not added to razorpay_" + ss_id);
                                                                            res.json({'Status': "Fail", 'Msg': 'Not added to razorpay'});
                                                                        }
                                                                    });
                                                                } else {
                                                                    console.error("UPDATE_POSP_RAZOR_PAYMENT : Not added to razorpay_" + ss_id);
                                                                    res.json({"Status": "Fail", "Msg": "Not added to razorpay"});
                                                                }
                                                            }
                                                        });
                                                    }
                                                });
                                            } else {
                                                console.error("UPDATE_POSP_RAZOR_PAYMENT : Status Not Updated_" + ss_id);
                                                res.json({"Status": "Fail", "Msg": "Status Not Updated."});
                                            }
                                        }
                                        //res.json(objUserData);
                                    });
                                } else {
                                    console.error("UPDATE_POSP_RAZOR_PAYMENT : Invoice number not generated_" + ss_id);
                                    res.json({"Status": "Fail", "Msg": "Invoice number not generated"});
                                }
                            });
                        }
                    } else {
                        res.json({"Status": "Fail", "Msg": "User doesn't exist"});
                    }
                }
            });
        } catch (e) {
            console.error("UPDATE_POSP_RAZOR_PAYMENT : " + e.stack);
            res.json({"Status": "Error", "Transaction_Id": 0, "Msg": e.stack});
        }
    });
	app.get('/razorpay_payment/get_financer_report', function (req, res) {
        var moment = require('moment');
        var excel = require('excel4node');
        var Email = require('../models/email');
        var objModelEmail = new Email();
        try {
            var start_date = new Date();
            var days = (req.query.hasOwnProperty('days')) ? req.query.days - 0 : 1;
            start_date.setDate(start_date.getDate() - days);
            start_date.setHours(00, 00, 00, 000);
            var end_date = new Date();
            end_date.setDate(end_date.getDate() + 0);
            end_date.setHours(00, 00, 00, 000);
            var razorpay_payment = require('../models/razorpay_payment');
            razorpay_payment.find({'Transaction_Status': 'Success','Created_On': {$gte: start_date, $lt: end_date}}).sort({'Created_On': -1}).exec((err, data) => {
                if (err) {
                    res.json(err);
                } else if (data.length > 0) {
                    var workbook = new excel.Workbook();

                    var worksheet = workbook.addWorksheet('Sheet 1');
                    var styleh = workbook.createStyle({
                        font: {
                            bold: false,
                            size: 11
                        }
                    });
                    worksheet.cell(2, 1).string('PkId').style(styleh);
                    worksheet.cell(2, 2).string('Name').style(styleh);
                    worksheet.cell(2, 3).string('StateCode').style(styleh);
                    worksheet.cell(2, 4).string('InvoiceDate').style(styleh);
                    worksheet.cell(2, 5).string('InvoiceNo').style(styleh);
                    worksheet.cell(2, 6).string('CustomerId').style(styleh);
                    worksheet.cell(2, 7).string('FullAmount').style(styleh);
                    worksheet.cell(2, 8).string('Amount').style(styleh);
                    worksheet.cell(2, 9).string('SGST').style(styleh);
                    worksheet.cell(2, 10).string('CGST').style(styleh);
                    worksheet.cell(2, 11).string('IGST').style(styleh);
                    worksheet.cell(2, 12).string('PaymentId').style(styleh);
                    worksheet.cell(2, 13).string('PaymRefNo').style(styleh);
                    worksheet.cell(2, 14).string('PaymDate').style(styleh);
                    worksheet.cell(2, 15).string('Month').style(styleh);
                    worksheet.cell(2, 16).string('Source').style(styleh);
                    var total_FullAmount = 0;
                    for (var i = 0; i < data.length; i++) {
                        /*if (data[i]._doc.Source === 'POSP_ONBOARD' || data[i]._doc.Total_Premium == '999') {
                            if (data[i]._doc.State_Code === 'MH' && data[i]._doc.Net_Premium) {
                                data[i]._doc.CGST = 76;
                                data[i]._doc.SGST = 76;
                            } else if (data[i]._doc.Net_Premium) {
                                data[i]._doc.IGST = 153;
                            }
                        } else {*/
                            if (data[i]._doc.State_Code === 'MH' && data[i]._doc.Net_Premium) {
                                data[i]._doc.CGST = (data[i]._doc.Net_Premium - 0) * 0.09;
                                data[i]._doc.SGST = (data[i]._doc.Net_Premium - 0) * 0.09;
                            } else if (data[i]._doc.Net_Premium) {
                                data[i]._doc.IGST = (data[i]._doc.Net_Premium - 0) * 0.18;
                            }
                        //}
                        worksheet.cell((i + 3), 1).string((data[i]._doc.Transaction_Id || "").toString()).style(styleh);
                        worksheet.cell((i + 3), 2).string((data[i]._doc.Name || "").toString()).style(styleh);
                        worksheet.cell((i + 3), 3).string((data[i]._doc.State_Code || "").toString()).style(styleh);
                        worksheet.cell((i + 3), 4).string((data[i]._doc.Created_On ? moment(data[i]._doc.Created_On).format('DD-MM-YYYY HH:MM') : "").toString()).style(styleh);
                        worksheet.cell((i + 3), 5).string((data[i]._doc.Invoice_No || "").toString()).style(styleh);
                        worksheet.cell((i + 3), 6).string((data[i]._doc.Cust_Id || "").toString()).style(styleh);
                        worksheet.cell((i + 3), 7).string((data[i]._doc.Total_Premium || "").toString()).style(styleh);
                        total_FullAmount += data[i]._doc.Total_Premium - 0 || 0;
                        worksheet.cell((i + 3), 8).string((data[i]._doc.Net_Premium || "").toString()).style(styleh);
                        worksheet.cell((i + 3), 9).string((data[i]._doc.SGST || "").toString()).style(styleh);
                        worksheet.cell((i + 3), 10).string((data[i]._doc.CGST || "").toString()).style(styleh);
                        worksheet.cell((i + 3), 11).string((data[i]._doc.IGST || "").toString()).style(styleh);
                        worksheet.cell((i + 3), 12).string((data[i]._doc.PayId || "").toString()).style(styleh);
                        worksheet.cell((i + 3), 13).string((data[i]._doc.PayId || "").toString()).style(styleh);
                        worksheet.cell((i + 3), 14).string((data[i]._doc.Created_On ? moment(data[i]._doc.Created_On).format('DD-MM-YYYY HH:MM') : "").toString()).style(styleh);
                        worksheet.cell((i + 3), 15).string(moment(data[i]._doc.Created_On).format('MMMM') + '\'' + moment(data[i]._doc.Created_On).format('YY') || "").style(styleh);
                        worksheet.cell((i + 3), 16).string((data[i]._doc.Source || "").toString()).style(styleh);
                    }
                    console.log(total_FullAmount);
                    worksheet.cell(1, 7).number(total_FullAmount).style(styleh);
                    var folderPath = appRoot + "/tmp/Financer_Report/";
                    if (!fs.existsSync(folderPath)) {
                        fs.mkdirSync(folderPath, {recursive: true});
                    }
                    const currentDateTime = moment().format('YYYY-MM-DD_HH-mm-ss');
                    var ff_file_name = "Financer_Report_" + currentDateTime + ".xlsx";
                    var ff_loc_path_portal = folderPath + ff_file_name;
                    var ff_web_path_portal = config.environment.downloadurl + '/tmp/Financer_Report/' + ff_file_name;
                    workbook.write(ff_loc_path_portal);
                    var sub = '[' + config.environment.name.toString().toUpperCase() + ']INFO-PolicyBoss.com- Financer Report: From[' + moment(start_date).format("YYYY-MM-DD") + '] to [' + moment(end_date).format("YYYY-MM-DD") + ']';
                    var email_body = '<html><body><p>Hi,</p><BR/>'
                                + '<p>Please <a href=' + ff_web_path_portal + '>click</a> here to Download.</p></body></html>';
                    var arrTo = 'piyush.singh@policyboss.com,roshaniprajapati567@gmail.com';
                    var arrCc = 'anujsingh2511@gmail.com,ashish.hatia@policyboss.com'; //'roshani.prajapati@policyboss.com'
objModelEmail.send('notifications@policyboss.com', arrTo, sub, email_body, arrCc, config.environment.notification_email, '');
                    res.json({"Status": "SUCCESS", "Msg": "Excel file created"});
                } else {
                    res.json({"Status": "FAIL", "Msg": "No Data Found"});
                }
            });

        } catch (err) {
            res.json({"Status": "FAIL", "Msg": err.stack});
        }
    }); 


};
