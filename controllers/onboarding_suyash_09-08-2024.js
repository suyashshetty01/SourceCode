/* Piyush,Nilam
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* global res */

let path = require('path');
let appRoot = path.dirname(path.dirname(require.main.filename));
let Base = require('../libs/Base');
let config = require('config');
let fs = require("fs");
let moment = require('moment');
let mongoose = require('mongoose');
let mongojs = require('mongojs');
let Client = require('node-rest-client').Client;
let Email = require('../models/email');
let SmsLog = require('../models/sms_log');
let formidable = require('formidable');
let sleep = require('system-sleep');
var excel = require('excel4node');
let pdf = require('html-pdf');
let zoop_api_key = "4RNA4S6-XWKM659-G7BR4MY-SHHTHHR";
let zoop_api_appid = "61d8162ba81661001db34ab9";
//let zoop_api_key = "9SAEK1C-DDTM8AV-PYPQY55-WDHK7RV";
//let zoop_api_appid = "6188a4b66a9887001d8df630";
let zoop_doc_args = {
    data: {},
    headers: {
        'Content-Type': 'application/json',
        "api-key": zoop_api_key,
        "app-id": zoop_api_appid
    }
};
function validatePan(pan) {
    return pan.match(
            /[A-Z]{5}[0-9]{4}[A-Z]{1}$/
            );
};
let myDb = mongojs(config.db.connection + ':27017/' + config.db.name);
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database
var client = new Client();

let posp_user = require('../models/posp_users.js');
let posp_document = require('../models/posp_document.js');
let posp_doc_log = require('../models/posp_doc_log.js');
let posp_api_log = require('../models/posp_api_log.js');
let question_master = require('../models/question_master.js');
let training_master = require('../models/training_master.js');
let training_section_master = require('../models/training_section_master.js');
let examResult = require('../models/exam_result.js');
let razorpay_payment = require('../models/razorpay_payment');
let posp_city_master = require('../models/posp_city_master');

module.exports.controller = function (app) {
    app.get('/onboarding/verifyOTP/:Mobile_Number/:OTP', function (req, res) {
        try {
            let client = new Client();
            let OTP = parseInt(req.params['OTP']);
            let Mobile_Number = parseInt(req.params['Mobile_Number']);
            posp_user.find({"Mobile_Number": Mobile_Number}, function (err, dbresult) {
                if (err) {
                    throw err;
                } else {
                    if (dbresult.length > 0) {
                        let userdata = dbresult[0]._doc;
                        client.get(config.environment.weburl + "/verifyOTP/" + OTP, {}, function (data, response) {
                            if (data.Msg === "Success") {
                                let args = {
                                    "Onboarding_Status": "OTP_Verified",
                                    "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                                };
                                if (userdata.Onboarding_Status === "InProcess") {
                                    posp_user.update({'Mobile_Number': Mobile_Number}, {$set: args}, {runValidators: true}, function (err, numAffected) {
                                        try {
                                            if (err) {
                                                throw err;
                                            } else {
                                                let objModelEmail = new Email();
                                                //config.environment.name = 'QA';
                                                //config.environment.weburl = 'http://qa-horizon.policyboss.com:3000';
                                                let url = config.environment.weburl;
                                                if (config.environment.name === 'Production') {

                                                } else if (config.environment.name === 'QA') {
                                                    url = config.environment.weburl ? (config.environment.weburl).split(':')[0] + ':' + (config.environment.weburl).split(':')[1] : config.environment.weburl;
                                                } else {
                                                    url = config.environment.weburl;
                                                }


                                                var objSmsLog = new SmsLog();
                                                var customer_msg = "Hi ,\n\Please click on below training link and upload document link to complete the process : " + "\n 1. Training Link : <a href='" + url + "/posp-training-dashboard.html'>training link.</a>";
                                                objSmsLog.send_sms(Mobile_Number, customer_msg, 'TRAINING-SCHEDULER');
                                                res.json({"Status": "Success", "Msg": "OTP Verified Successfully"});
                                            }
                                        } catch (ex) {
                                            console.error('Exception', 'onboarding-verifyOTP', ex);
                                            res.json({"Status": "Fail", "Msg": ex.stack});
                                        }
                                    });
                                } else {
                                    res.json({"Status": "Success", "Msg": "Already Verified."});
                                }
                            } else {
                                res.json({"Status": "Fail", "Msg": "OTP Verification Failed."});
                            }
                        });
                    } else {
                        res.json({"Status": "Fail", "Msg": "Error in Verifying OTP."});
                    }
                }
            });
        } catch (ex) {
            console.error('Exception', 'onboarding-verifyOTP', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/training-schedule', function (req, res) {
        try {
            let Client = require('node-rest-client').Client;
            let client = new Client();
            let Training_Status = "", prv_exam_start_date = "";
            let Mobile_Number = req.body.Mobile_Number ? req.body.Mobile_Number : "";
            let User_Id = req.body.User_Id ? req.body.User_Id - 0 : "";
            if (User_Id !== "") {
                posp_user.find({"User_Id": User_Id}, function (err, dbresult) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        try {
                            if (dbresult && dbresult.length > 0) {
                                let data = dbresult[0]._doc;
                                Training_Status = data.Training_Status;
                                prv_exam_start_date = data.Exam_Start_Date;
                                if (data.Training_Status === "Started") {
                                    if (req.body.remaining_hours || req.body.completed_hours || req.body.training_timing) {
                                        let args = {
                                            "Remaining_Hours": req.body.remaining_hours,
                                            "Completed_Hours": req.body.completed_hours
                                        };
                                        res.json({"Status": "Success", "Msg": "Remaining and Completed hours updated successfully."});
                                    } else {
                                        res.json({"Status": "Success", "Msg": data});
                                    }
                                } else if (data.Training_Status === "Completed") {
                                    if (req.body.Exam_Status || req.body.Onboarding_Status) {
                                        let args = {
                                            "Exam_Status": req.body.Exam_Status,
                                            "Onboarding_Status": req.body.Onboarding_Status,
                                            "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                                        };
                                        if (req.body.Exam_Status === "Started") {
                                            args["Exam_Start_Date"] = prv_exam_start_date ? prv_exam_start_date : moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                        }
                                        if (req.body.Exam_Status === "Completed") {
                                            args["Exam_End_Date"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                        }
                                        posp_user.update({"User_Id": User_Id}, {$set: args}, {runValidators: true}, function (err, numAffected) {
                                            if (err) {
                                                res.json({"Status": "Fail", "Msg": err});
                                            } else {
                                                console.error("POSP EXAM ERP UPDATE Line 1 : ", User_Id);
                                                if (req.body.Exam_Status === "Completed") {
                                                    console.error("POSP EXAM ERP UPDATE Line 2 : ", User_Id);
                                                    // start add by roshani 05-09-2023
                                                    try {
                                                        let exam_pass_update_args = {
                                                            data: {
                                                                "Is_Exam": 1
                                                            },
                                                            headers: {
                                                                "Content-Type": "application/json"
                                                            }
                                                        };
                                                        client.post(config.environment.weburl + "/onboarding/posp_data_update?ss_id=" + User_Id, exam_pass_update_args, function (iib_upload_update_data, iib_upload_update_response) {});
                                                    } catch (e) {
                                                        console.error('Update POSP collection at the time of Successful Payment', e.stack);
                                                    }
                                                    // start add by roshani 05-09-2023
                                                    try {
                                                        client.get(config.environment.weburl + "/onboarding/POSPTrainingStatus?ss_id=" + User_Id, {}, function (posp_training_status_data, posp_training_status_response) {
                                                            console.error("POSP EXAM ERP UPDATE Line 3 : ", User_Id);
                                                            console.error({"Status": "Success", "Msg": "POSP status updated.", "Data": posp_training_status_data});
                                                            try {
                                   client.get(config.environment.weburl + '/posps/dsas/view/' + User_Id, {}, function (posp_res, posp_res_data) {
									if (posp_res && posp_res.status && posp_res.status === "SUCCESS") {
									if (posp_res.user_type && ["POSP"].includes(posp_res.user_type)) {
										client.get(config.environment.weburl + "/onboarding/erp_code_doc_save?ss_id=" + User_Id, {}, function (erp_code_doc_save_data, erp_code_doc_save_response) {
										console.error("POSP EXAM ERP UPDATE Line 4 : ", User_Id);
										console.error({"Status": "Success", "Msg": "erp_code_doc_save called.", "Data": erp_code_doc_save_data});
										res.json({"Status": "Success", "Msg": "Status Updated Successfully."});
										});
										} else {
										res.json({"Status": "Success", "Msg": "Only POSP User is allowed for ERP"});
										}}else {
										res.json({"Status": "Success", "Msg": "Record Not Found."});
										}}); 
                                                            } catch (ex) {
                                                                console.error("POSP EXAM ERP UPDATE Line 5 : ", User_Id);
                                                                res.json({"Status": "Error", "Msg": "onboarding/erp_code_doc_save"});
                                                            }
                                                        });
                                                    } catch (ee) {
                                                        console.error("POSP EXAM ERP UPDATE Line 6 : ", User_Id);
                                                        console.error('onboarding training-shecdule Error', ee.stack);
                                                        res.json({"Status": "Error", "Msg": "onboarding/POSPTrainingStatus"});
                                                    }
                                                } else {
                                                    res.json({"Status": "Success", "Msg": "Status Updated Successfully."});
                                                }
                                            }
                                        });
                                    } else {
                                        res.json({"Status": "Fail", "Msg": "Training_Completed"});
                                    }
                                } else if (data.Exam_Status === "Inprogress") {
                                    if (req.body.Exam_Status || req.body.Onboarding_Status) {
                                        let args = {
                                            "Exam_Status": "Completed",
                                            "Onboarding_Status": req.body.Onboarding_Status,
                                            "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                                        };
                                        posp_user.update({"User_Id": User_Id}, {$set: args}, {runValidators: true}, function (err, numAffected) {
                                            if (err) {
                                                res.json({"Status": "Fail", "Msg": err});
                                            } else {
                                                res.json({"Status": "Success", "Msg": "Status Updated Successfully."});
                                            }
                                        }); //end
                                    } else {
                                        res.json({"Status": "Fail", "Msg": "Unable to update exam status."});
                                    }
                                } else {
                                    res.json({"Status": "Fail", "Msg": "Please verify your Mobile Number."});
                                }
                                //res.json({"Status":"Success","Msg":dbresult});
                            } else {
                                res.json({"Status": "Fail", "Msg": "Mobile Number not Found."});
                            }
                        } catch (ex) {
                            console.error('Exception', 'training-schedule', ex);
                            res.json({"Status": "Fail", "Msg": ex.stack});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Mobile Number Missing."});
            }
        } catch (ex) {
            console.error('Exception', 'training-schedule', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/training_completed_mail', function (req, res) {
        try {
            let User_Id = req.query['User_Id'];
            posp_document.findOne({"User_Id": User_Id}, function (err, dbdoc) {
                if (err) {
                    res.json({'Status': 'Fail', 'Msg': err});
                } else {
                    if (dbdoc && dbdoc._doc.PersonDetails && dbdoc._doc.PersonDetails.Person_EmailId) {
                        let objModelEmail = new Email();
                        let url = config.environment.weburl;
                        if (config.environment.name === 'Production') {

                        } else if (config.environment.name === 'QA') {
                            url = config.environment.weburl ? (config.environment.weburl).split(':')[0] + ':' + (config.environment.weburl).split(':')[1] : config.environment.weburl;
                        } else {
                            url = config.environment.weburl;
                        }
                        let mail_content = '<html><body><p>Dear Posp,<br>'
                                + 'You have successfully completed your training.<br>Please proceed with the examination.<br></p>'
                                + '<p>Exam Link : <a href="' + url + '/EduApp/examHome.html">Go To POSP Training Exam</a></p>'
                                + 'Regards,<br/>'
                                + 'Team Customer Care <br/>'
                                + 'Landmark Insurance Brokers Pvt. Ltd.<br/>'
                                + '<b> Contact</b> : 18004194199 <br/>'
                                + '<img src="https://policyboss.com/images/POSP/policyboss.png"><br/><br/>'
                                + '</p></body></html>';
                        let sendTo = (dbdoc._doc && dbdoc._doc.PersonDetails && dbdoc._doc.PersonDetails.Person_EmailId) ? dbdoc._doc.PersonDetails.Person_EmailId : "nilam.bhagde@policyboss.com";
                        //objModelEmail.send('pospcom@policyboss.com', sendTo, subject, mail_content, arrCC.join(','), '', '');
                        objModelEmail.send('pospcom@policyboss.com', sendTo, "Training Completed", mail_content, '', '', '');
                        var objSmsLog = new SmsLog();
                        var customer_msg = "Hi ,\n\you have completed your training.Please proceed with the examination.";
//                        objSmsLog.send_sms(Mobile_Number, customer_msg, 'POSP-EXAM');
                        res.json({"Status": "Success", "Msg": "Mail sent successfully."});
                    } else {
                        res.json({"Status": "Success", "Msg": "Email ID Not Found."});
                    }
                }
            });
        } catch (ex) {
            console.error('Exception', 'onboarding-verifyOTP', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.all('/onboarding/download/onboarding_docs/:folder/:file', function (req, res) {
        let urlpath = req.url;
        let folder = req.params.folder;
        let file = req.params.file;
        res.sendFile(path.join(appRoot + '/tmp/onboarding_docs/' + folder + '/' + file));
    });
    app.post('/onboarding/schedule_posp_training', function (req, res) {
        let args = {};
        try {
			console.error("Schedule Posp Training Line3",JSON.stringify(req.body));
//            let form = new formidable.IncomingForm();
//            form.parse(req, function (err, fields, files) {
            let client = new Client();
            let Posp_Email = "", Posp_Addr = "", posp_doc = {};
            let Ss_Id = req.body.Ss_Id ? parseInt(req.body.Ss_Id) : "";
            let Mail_Send_Flag = req.body.Send_Mail ? req.body.Send_Mail : "Yes";
            let rm_email = "", cc_arr = [];
            let Profile = "";
            req.body = JSON.parse(JSON.stringify(req.body));
            let objRequest = req.body || {};
            if (Ss_Id) {
                posp_user.find({"Ss_Id": Ss_Id}, function (err, dbresult) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        posp_document.find({"User_Id": Ss_Id}, function (err, dbresult2) {
                            if (err) {
                                res.json({"Status": "Fail", "Msg": err});
                            } else {
                                if (dbresult2.length > 0) {
                                    let data = dbresult2[0]._doc;
                                    posp_doc = {
                                        "BankDetails": data.BankDetails,
                                        "NomineeDetails": data.NomineeDetails
                                    };
                                } else {
                                    posp_doc = {
                                        "BankDetails": {},
                                        "NomineeDetails": {}
                                    };
                                }
                                req.body.hasOwnProperty("Profile_Photo") ? Profile = req.body['Profile_Photo'] : "";
                                args = {
                                    "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                                };
                                client.get(config.environment.weburl + '/posps/dsas/view/' + Ss_Id, {}, function (posp_res, posp_res_data) {
									console.error("Schedule Posp Training Line3",posp_res);

                                    // client.get('http://www.policyboss.com:5000/posps/dsas/view/' + Ss_Id, {}, function (posp_res, posp_res_data) {
                                    if (posp_res && posp_res.hasOwnProperty('status') && posp_res.status === "SUCCESS") {
                                        if (posp_res.hasOwnProperty('user_type') && ["POSP", "FOS"].includes(posp_res.user_type)) {
                                            if (posp_res.hasOwnProperty('POSP') && posp_res.POSP !== "NA") {
                                                //posp_res.POSP.hasOwnProperty("TrainingStartDate") && posp_res.POSP.TrainingStartDate ? args["Training_Start_Date"] = posp_res.POSP.TrainingStartDate : args["Training_Start_Date"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                                posp_res.POSP.hasOwnProperty("Posp_Id") ? args["Posp_Id"] = posp_res.POSP.Posp_Id : "";
                                                posp_res.POSP.hasOwnProperty("Mobile_No") ? (args["Mobile_Number"] = posp_res.POSP.Mobile_No, posp_doc["Mobile_Number"] = posp_res.POSP.Mobile_No) : "";
                                                posp_res.POSP.hasOwnProperty("Ss_Id") ? (args["User_Id"] = posp_res.POSP.Ss_Id, args["Ss_Id"] = posp_res.POSP.Ss_Id, posp_doc["User_Id"] = posp_res.POSP.Ss_Id) : "";
                                                posp_res.POSP.hasOwnProperty("Fba_Id") ? args["Fba_Id"] = posp_res.POSP.Fba_Id : "";
                                                posp_res.POSP.hasOwnProperty("Sm_Posp_Id") ? args["Sm_Posp_Id"] = posp_res.POSP.Sm_Posp_Id : "";
                                                posp_res.POSP.hasOwnProperty("Sm_Posp_Name") ? args["Sm_Posp_Name"] = posp_res.POSP.Sm_Posp_Name : "";
                                                posp_res.POSP.hasOwnProperty("First_Name") && posp_res.POSP.First_Name ? args["First_Name"] = posp_res.POSP.First_Name.trim() : "";
                                                posp_res.POSP.hasOwnProperty("Middle_Name") && posp_res.POSP.Middle_Name ? args["Middle_Name"] = posp_res.POSP.Middle_Name.trim() : "";
                                                posp_res.POSP.hasOwnProperty("Last_Name") && posp_res.POSP.Last_Name ? args["Last_Name"] = posp_res.POSP.Last_Name.trim() : "";
                                                posp_res.POSP.hasOwnProperty("Father_Name") && posp_res.POSP.Father_Name ? args["Father_Name"] = posp_res.POSP.Father_Name.trim() : "";
                                                posp_res.POSP.hasOwnProperty("Email_Id") ? (args["Email_Id"] = posp_res.POSP.Email_Id, posp_doc["Email"] = posp_res.POSP.Email_Id, Posp_Email = posp_res.POSP.Email_Id) : "";
                                                posp_res.POSP.hasOwnProperty("Agent_City") ? args["Agent_City"] = posp_res.POSP.Agent_City : "";
                                                posp_res.POSP.hasOwnProperty("Telephone_No") ? args["Telephone_No"] = posp_res.POSP.Telephone_No : "";
                                                posp_res.POSP.hasOwnProperty("Mobile_No") ? args["Mobile_No"] = posp_res.POSP.Mobile_No : "";
                                                posp_res.POSP.hasOwnProperty("Education") ? args["Education"] = posp_res.POSP.Education : "";
                                                posp_res.POSP.hasOwnProperty("Birthdate") ? (args["Birthdate"] = posp_res.POSP.Birthdate, posp_doc["DOB_On_PanCard"] = posp_res.POSP.Birthdate) : "";
                                                posp_res.POSP.hasOwnProperty("Permanant_Add1") && posp_res.POSP.Permanant_Add1 ? args["Permanant_Add1"] = posp_res.POSP.Permanant_Add1.trim() : "";
                                                posp_res.POSP.hasOwnProperty("Permanant_Add3") && posp_res.POSP.Permanant_Add3 ? args["Permanant_Add3"] = posp_res.POSP.Permanant_Add3.trim() : "";
                                                posp_res.POSP.hasOwnProperty("Permanant_Add2") && posp_res.POSP.Permanant_Add2 ? args["Permanant_Add2"] = posp_res.POSP.Permanant_Add2.trim() : "";
                                                posp_res.POSP.hasOwnProperty("Permanant_Landmark") ? args["Permanant_Landmark"] = posp_res.POSP.Permanant_Landmark : "";
                                                posp_res.POSP.hasOwnProperty("Permanant_Pincode") ? args["Permanant_Pincode"] = posp_res.POSP.Permanant_Pincode : "";
                                                posp_res.POSP.hasOwnProperty("Permanant_City") && posp_res.POSP.Permanant_City ? args["Permanant_City"] = posp_res.POSP.Permanant_City.trim() : "";
                                                posp_res.POSP.hasOwnProperty("Permanant_State") && posp_res.POSP.Permanant_State ? args["Permanant_State"] = posp_res.POSP.Permanant_State.trim() : "";
                                                posp_res.POSP.hasOwnProperty("Present_Add1") && posp_res.POSP.Present_Add1 ? args["Present_Add1"] = posp_res.POSP.Present_Add1.trim() : "";
                                                posp_res.POSP.hasOwnProperty("Present_Add2") && posp_res.POSP.Present_Add2 ? args["Present_Add2"] = posp_res.POSP.Present_Add2.trim() : "";
                                                posp_res.POSP.hasOwnProperty("Present_Add3") && posp_res.POSP.Present_Add3 ? args["Present_Add3"] = posp_res.POSP.Present_Add3.trim() : "";
                                                posp_res.POSP.hasOwnProperty("Present_Landmark") ? args["Present_Landmark"] = posp_res.POSP.Present_Landmark : "";
                                                posp_res.POSP.hasOwnProperty("Present_Pincode") ? args["Present_Pincode"] = posp_res.POSP.Present_Pincode : "";
                                                posp_res.POSP.hasOwnProperty("Present_City") && posp_res.POSP.Present_City ? args["Present_City"] = posp_res.POSP.Present_City.trim() : "";
                                                posp_res.POSP.hasOwnProperty("Present_State") && posp_res.POSP.Present_State ? args["Present_State"] = posp_res.POSP.Present_State.trim() : "";
                                                posp_res.POSP.hasOwnProperty("Pan_No") ? (args["Pan_No"] = posp_res.POSP.Pan_No, posp_doc["PanCard_Number"] = posp_res.POSP.Pan_No) : "";
                                                posp_res.POSP.hasOwnProperty("Aadhar") ? (args["Aadhar"] = posp_res.POSP.Aadhar, posp_doc["AadharCard_Number"] = posp_res.POSP.Aadhar) : "";
                                                posp_res.POSP.hasOwnProperty("Experience") ? args["Experience"] = posp_res.POSP.Experience : "";
                                                posp_res.POSP.hasOwnProperty("Income") ? args["Income"] = posp_res.POSP.Income : "";
                                                posp_res.POSP.hasOwnProperty("Already_Posp") ? args["Already_Posp"] = posp_res.POSP.Already_Posp : "No";
                                                posp_res.POSP.hasOwnProperty("Legal_case") ? args["Legal_case"] = posp_res.POSP.Legal_case : "No";
                                                posp_res.POSP.hasOwnProperty("Bank_Account_No") ? (args["Bank_Account_No"] = posp_res.POSP.Bank_Account_No, posp_doc["BankDetails"]["Bank_Account_No"] = posp_res.POSP.Bank_Account_No) : "";
                                                posp_res.POSP.hasOwnProperty("Account_Type") ? (args["Account_Type"] = posp_res.POSP.Account_Type, posp_doc["BankDetails"]["Account_Type"] = posp_res.POSP.Account_Type) : "";
                                                posp_res.POSP.hasOwnProperty("Ifsc_Code") ? (args["Ifsc_Code"] = posp_res.POSP.Ifsc_Code, posp_doc["BankDetails"]["IFSC_Code"] = posp_res.POSP.Ifsc_Code) : "";
                                                posp_res.POSP.hasOwnProperty("Micr_Code") ? (args["Micr_Code"] = posp_res.POSP.Micr_Code, posp_doc["BankDetails"]["Micr_Code"] = posp_res.POSP.Micr_Code) : "";
                                                posp_res.POSP.hasOwnProperty("Bank_Name") ? (args["Bank_Name"] = posp_res.POSP.Bank_Name, posp_doc["BankDetails"]["Bank_Name"] = posp_res.POSP.Bank_Name) : "";
                                                posp_res.POSP.hasOwnProperty("Bank_Branch") ? (args["Bank_Branch"] = posp_res.POSP.Bank_Branch, posp_doc["BankDetails"]["Bank_Branch"] = posp_res.POSP.Bank_Branch) : "";
                                                posp_res.POSP.hasOwnProperty("Sources") ? args["Sources"] = posp_res.POSP.Sources : "";
                                                posp_res.POSP.hasOwnProperty("Last_Status") ? args["Last_Status"] = posp_res.POSP.Last_Status : "";
                                                posp_res.POSP.hasOwnProperty("Status_Remark") ? args["Status_Remark"] = posp_res.POSP.Status_Remark : "";
                                                posp_res.POSP.hasOwnProperty("Document_Name") ? args["Document_Name"] = posp_res.POSP.Document_Name : "";
                                                posp_res.POSP.hasOwnProperty("Document_Type") ? args["Document_Type"] = posp_res.POSP.Document_Type : "";
                                                posp_res.POSP.hasOwnProperty("Service_Tax_Number") ? args["Service_Tax_Number"] = posp_res.POSP.Service_Tax_Number : "NA";
                                                posp_res.POSP.hasOwnProperty("Nominee_Aadhar") ? (args["Nominee_Aadhar"] = posp_res.POSP.Nominee_Aadhar, posp_doc["NomineeDetails"]["Nominee_Aadhar"] = posp_res.POSP.Nominee_Aadhar) : "";
                                                posp_res.POSP.hasOwnProperty("Nominee_Account_Type") ? (args["Nominee_Account_Type"] = posp_res.POSP.Nominee_Account_Type, posp_doc["NomineeDetails"]["Nominee_Account_Type"] = posp_res.POSP.Nominee_Account_Type) : "";
                                                posp_res.POSP.hasOwnProperty("Nominee_Bank_Account_Number") ? (args["Nominee_Bank_Account_Number"] = posp_res.POSP.Nominee_Bank_Account_Number, posp_doc["NomineeDetails"]["Nominee_Bank_Account_No"] = posp_res.POSP.Nominee_Bank_Account_Number) : "";
                                                posp_res.POSP.hasOwnProperty("Nominee_Bank_Branch") ? (args["Nominee_Bank_Branch"] = posp_res.POSP.Nominee_Bank_Branch, posp_doc["NomineeDetails"]["Nominee_Bank_Branch"] = posp_res.POSP.Nominee_Bank_Branch) : "";
                                                posp_res.POSP.hasOwnProperty("Nominee_Bank_City") ? (args["Nominee_Bank_City"] = posp_res.POSP.Nominee_Bank_City, posp_doc["NomineeDetails"]["Nominee_Bank_City"] = posp_res.POSP.Nominee_Bank_City) : "";
                                                posp_res.POSP.hasOwnProperty("Nominee_Bank_Name") ? (args["Nominee_Bank_Name"] = posp_res.POSP.Nominee_Bank_Name, posp_doc["NomineeDetails"]["Nominee_Bank_Name"] = posp_res.POSP.Nominee_Bank_Name) : "";
                                                posp_res.POSP.hasOwnProperty("Nominee_First_Name") && posp_res.POSP.Nominee_First_Name ? (args["Nominee_First_Name"] = posp_res.POSP.Nominee_First_Name.trim(), posp_doc["NomineeDetails"]["Nominee_First_Name"] = posp_res.POSP.Nominee_First_Name.trim()) : "";
                                                posp_res.POSP.hasOwnProperty("Nominee_Middle_Name") && posp_res.POSP.Nominee_Middle_Name ? (args["Nominee_Middle_Name"] = posp_res.POSP.Nominee_Middle_Name.trim(), posp_doc["NomineeDetails"]["Nominee_Middle_Name"] = posp_res.POSP.Nominee_Middle_Name.trim()) : "";
                                                posp_res.POSP.hasOwnProperty("Nominee_Ifsc_Code") ? (args["Nominee_Ifsc_Code"] = posp_res.POSP.Nominee_Ifsc_Code, posp_doc["NomineeDetails"]["Nominee_IFSC_Code"] = posp_res.POSP.Nominee_Ifsc_Code) : "";
                                                posp_res.POSP.hasOwnProperty("Nominee_Last_Name") && posp_res.POSP.Nominee_Last_Name ? (args["Nominee_Last_Name"] = posp_res.POSP.Nominee_Last_Name.trim(), posp_doc["NomineeDetails"]["Nominee_Last_Name"] = posp_res.POSP.Nominee_Last_Name.trim()) : "";
                                                posp_res.POSP.hasOwnProperty("Nominee_Micr_Code") ? (args["Nominee_Micr_Code"] = posp_res.POSP.Nominee_Micr_Code, posp_doc["NomineeDetails"]["Nominee_Micr_Code"] = posp_res.POSP.Nominee_Micr_Code) : "";
                                                posp_res.POSP.hasOwnProperty("Nominee_Name_as_in_Bank") ? (args["Nominee_Name_as_in_Bank"] = posp_res.POSP.Nominee_Name_as_in_Bank, posp_doc["NomineeDetails"]["Nominee_Name_on_Account"] = posp_res.POSP.Nominee_Name_as_in_Bank) : "";
                                                posp_res.POSP.hasOwnProperty("Is_Active") ? args["Is_Active"] = posp_res.POSP.Is_Active : false;
                                                posp_res.POSP.hasOwnProperty("Ss_Id") ? args["Ss_Id"] = posp_res.POSP.Ss_Id : "";
                                                posp_res.POSP.hasOwnProperty("Erp_Id") ? args["Erp_Id"] = posp_res.POSP.Erp_Id : "";
                                                posp_res.POSP.hasOwnProperty("Gender") ? (args["Gender"] = posp_res.POSP.Gender, posp_doc["Gender"] = posp_res.POSP.Gender) : "";
                                                posp_res.POSP.hasOwnProperty("Name_as_in_Bank") ? (args["Name_as_in_Bank"] = posp_res.POSP.Name_as_in_Bank, posp_doc["BankDetails"]["Name_on_Account"] = posp_res.POSP.Name_as_in_Bank) : "";
                                                posp_res.POSP.hasOwnProperty("Nominee_Gender") ? (args["Nominee_Gender"] = posp_res.POSP.Nominee_Gender, posp_doc["NomineeDetails"]["Nominee_Gender"] = posp_res.POSP.Nominee_Gender) : "";
                                                posp_res.POSP.hasOwnProperty("Nominee_Relationship") ? (args["Nominee_Relationship"] = posp_res.POSP.Nominee_Relationship, posp_doc["NomineeDetails"]["Nominee_Relationship"] = posp_res.POSP.Nominee_Relationship) : "";
                                                posp_res.POSP.hasOwnProperty("Nominee_Pan") ? (args["Nominee_Pan"] = posp_res.POSP.Nominee_Pan, posp_doc["NomineeDetails"]["Nominee_Pan_Number"] = posp_res.POSP.Nominee_Pan) : "";
                                                posp_res.POSP.hasOwnProperty("Posp_Category") ? args["Posp_Category"] = posp_res.POSP.Posp_Category : "";
                                                posp_res.POSP.hasOwnProperty("Reporting_Agent_Name") ? args["Reporting_Agent_Name"] = posp_res.POSP.Reporting_Agent_Name : args["Reporting_Agent_Name"] = "";
                                                posp_res.POSP.hasOwnProperty("Reporting_Agent_Uid") ? args["Reporting_Agent_Uid"] = posp_res.POSP.Reporting_Agent_Uid : "";
                                                posp_res.POSP.hasOwnProperty("Training_UserLog") ? args["Training_UserLog"] = posp_res.POSP.Training_UserLog : "";
                                                //  posp_res.POSP.hasOwnProperty("Certification_Datetime") ? args["Certification_Datetime"] = posp_res.POSP.Certification_Datetime : "";
                                                posp_res.POSP.hasOwnProperty("Reporting_Email_ID") ? args["Reporting_Email_ID"] = (posp_res.POSP.Reporting_Email_ID) : args["Reporting_Email_ID"] = "";
                                                posp_res.POSP.hasOwnProperty("Reporting_Mobile_Number") ? args["Reporting_Mobile_Number"] = posp_res.POSP.Reporting_Mobile_Number : args["Reporting_Mobile_Number"] = "";
                                                posp_res.POSP.hasOwnProperty("POSP_UploadedtoIIB") ? args["POSP_UploadedtoIIB"] = posp_res.POSP.POSP_UploadedtoIIB : "";

                                                if (posp_res.POSP.POSP_UploadingDateAtIIB && ["NA"].indexOf(posp_res.POSP.POSP_UploadingDateAtIIB) === -1) {
                                                    args["POSP_UploadingDateAtIIB"] = posp_res.POSP.POSP_UploadingDateAtIIB;
                                                    args["Is_IIB_Uploaded"] = "Yes";
                                                }

                                                posp_res.POSP.hasOwnProperty("POSP_DeActivatedtoIIB") ? args["POSP_DeActivatedtoIIB"] = posp_res.POSP.POSP_DeActivatedtoIIB : "";
                                                posp_res.POSP.hasOwnProperty("POSP_DeActivatedDateAtIIB") ? args["POSP_DeActivatedDateAtIIB"] = posp_res.POSP.POSP_DeActivatedDateAtIIB : "";
                                                posp_res.POSP.hasOwnProperty("FOS_Code") ? args["FOS_Code"] = posp_res.POSP.FOS_Code : "";
                                                posp_res.POSP.hasOwnProperty("ERPID_CreatedDate") ? args["ERPID_CreatedDate"] = posp_res.POSP.ERPID_CreatedDate : "";
                                                posp_res.POSP.hasOwnProperty("IsFOS") ? args["IsFOS"] = posp_res.POSP.IsFOS : "";
                                                posp_res.POSP.hasOwnProperty("RegAmount") ? (args["RegAmount"] = posp_res.POSP.RegAmount, args["Package_Amount"] = posp_res.POSP.RegAmount) : 0;
                                                posp_res.POSP.hasOwnProperty("Channel") ? args["Channel"] = posp_res.POSP.Channel : "";
                                                posp_res.POSP.hasOwnProperty("Recruitment_Status") ? args["Recruitment_Status"] = posp_res.POSP.Recruitment_Status : "";
                                                posp_res.POSP.hasOwnProperty("Is_Contact_Sync") ? args["Is_Contact_Sync"] = posp_res.POSP.Is_Contact_Sync : 0;
                                                posp_res.POSP.hasOwnProperty("Is_Paid") ? args["Is_Paid"] = posp_res.POSP.Is_Paid : 0;
                                                posp_res.POSP.hasOwnProperty("Paid_On") ? args["Paid_On"] = posp_res.POSP.Paid_On : "";
                                                posp_res.POSP.hasOwnProperty("Cust_Id") ? args["Cust_Id"] = posp_res.POSP.Cust_Id : 0;
                                                posp_res.POSP.hasOwnProperty("Posp_Onboarding_Photo") ? Profile = posp_res.POSP.Posp_Onboarding_Photo : "";
                                                rm_email = (posp_res.POSP.Reporting_Email_ID && posp_res.POSP.Reporting_Email_ID !== "NA") ? args["Reporting_Email_ID"] : "";
                                                rm_email ? cc_arr.push(rm_email) : "";
                                                let Posp_Name = "";
                                                if (args["First_Name"] && args["Middle_Name"] && args["Last_Name"]) {
                                                    Posp_Name = args["First_Name"] + " " + args["Middle_Name"] + " " + args["Last_Name"];
                                                } else if (args["First_Name"] && args["Last_Name"]) {
                                                    Posp_Name = args["First_Name"] + " " + args["Last_Name"];
                                                } else if (args["First_Name"]) {
                                                    Posp_Name = args["First_Name"];
                                                }
                                                if (args["Permanant_Add1"] || args["Permanant_Add2"] || args["Permanant_Add3"]) {
                                                    Posp_Addr = (args["Permanant_Add1"] ? args["Permanant_Add1"] : "") + ", " + (args["Permanant_Add2"] ? args["Permanant_Add2"] : "") + ", " + (args["Permanant_Add3"] ? args["Permanant_Add3"] : "") + ", " + (args["Permanant_City"] ? args["Permanant_City"] : "") + ", " + (args["Permanant_State"] ? args["Permanant_State"] : "") + ", " + (args["Permanant_Pincode"] ? args["Permanant_Pincode"] : "");
                                                } else if (args["Present_Add1"] || args["Present_Add2"] || args["Present_Add3"]) {
                                                    Posp_Addr = (args["Present_Add1"] ? args["Present_Add1"] : "") + ", " + (args["Present_Add2"] ? args["Present_Add2"] : "") + ", " + (args["Present_Add3"] ? args["Present_Add3"] : "") + ", " + (args["Present_City"] ? args["Present_City"] : "") + ", " + (args["Present_State"] ? args["Present_State"] : "") + ", " + (args["Present_Pincode"] ? args["Present_Pincode"] : "");
                                                }

                                                Posp_Name ? posp_doc ["Name_On_PanCard"] = Posp_Name.toUpperCase() : "";
                                                Posp_Addr ? posp_doc ["Address"] = Posp_Addr : "";
                                                req.body.hasOwnProperty("Email") ? Posp_Email = req.body.Email : "";
                                                if (Profile) {
                                                    posp_doc["UploadedFiles" ] = {
                                                        "UploadedFiles": {
                                                            "Profile_Photo": Profile
                                                        }
                                                    };
                                                }
                                                if (dbresult.length > 0) {
                                                    let training_start_date = dbresult[0]._doc.Training_Start_Date;
                                                    training_start_date ? args["Training_Start_Date"] = training_start_date : "";
                                                    try {
                                                        client.get(config.environment.weburl + "/posps/mssql/sync_training_date?ss_id=" + Ss_Id, {}, function (sync_training_date_data, sync_training_date_response) {
                                                            console.error({"Status": "Success", "Msg": "sync_training_date called.", "Data": sync_training_date_data});
                                                        });
                                                    } catch (ee) {
                                                        console.error('sync_training_date Error', ee.stack);
                                                    }
                                                    res.json({"Status": "Success", "Msg": "POSP details updated successfully", 'Ss_Id': Ss_Id});
                                                } else {
                                                    if (posp_res.POSP.Erp_Id) {
                                                        args["Training_Scheduled_On"] = posp_res.POSP.TrainingStartDate || null;
                                                        args["Training_Start_Date"] = posp_res.POSP.TrainingStartDate || null;
                                                        args["Training_End_Date"] = posp_res.POSP.TrainingEndDate || null;
                                                        args["Training_Status"] = "Completed";
                                                        args["Remaining_Hours"] = "00:00:00";
                                                        args["Completed_Hours"] = "30:00:00";
                                                        args["Is_Training_Completed"] = "Yes";
                                                    } else {
                                                        if (posp_res.POSP.TrainingStartDate) {
                                                            args["Training_Scheduled_On"] = posp_res.POSP.TrainingStartDate;
                                                            args["Training_Start_Date"] = posp_res.POSP.TrainingStartDate;
                                                            args["Training_Status"] = "Started";
                                                            args["Remaining_Hours"] = "30:00:00";
                                                            args["Completed_Hours"] = "00:00:00";
                                                        } else {
                                                            args["Training_Status"] = "";
                                                            args["Remaining_Hours"] = "";
                                                            args["Completed_Hours"] = "";
                                                            args["Certification_Datetime"] = null;
                                                            args["Training_Scheduled_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                                        }
                                                        args["Approved_Mail_Sent"] = "No";
                                                        args["Verified_Mail_Sent"] = "No";
                                                        args["POSP_UploadingDateAtIIB"] = "";
                                                        args["Is_Doc_Approved"] = "No";
                                                        args["Is_Invoice_Generated"] = "No";
                                                        args["Is_Certificate_Generated"] = "No";
                                                        args["Is_Appointment_Letter_Generated"] = "No";
                                                        args["Is_Doc_Verified"] = "No";
                                                        args["IIB_Uploaded_Ack"] = "No";
                                                        args["Is_IIB_Uploaded"] = "No";
                                                        args["Is_Document_Rejected"] = "No";
                                                        args["Is_Document_Uploaded"] = "No";
                                                        args["Is_Training_Completed"] = "No";
                                                        args["Payment_Status"] = "Pending";
                                                        args["Is_Mail_Sent"] = 2;                                                      
                                                        args["Certification_Datetime"] = null;
                                                    }
                                                    if (posp_res.POSP.Created_On && posp_res.POSP.Created_On != 'NA') {
                                                        args["Created_On"] = posp_res.POSP.Created_On;
                                                    } else {
                                                        args["Created_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                                    }
                                                    
                                                    if (objRequest && objRequest.POSP_Sources && ['TESTUSER', 'NPOS', 'GPOS', 'TPOS'].indexOf(objRequest.POSP_Sources) > -1) {
                                                        args['POSP_Sources'] = objRequest.POSP_Sources;
                                                        args["Erp_Series"] = objRequest.ERP_Series || "";
                                                        args['Pan_No'] = objRequest.Pan_No || "";
                                                        args['Posp_Reg_PAN'] = objRequest.Pan_No || "";
                                                        args['Is_Mobile_Verified'] = "Yes";
                                                        args['Mobile_Verified_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                                        if (['NPOS'].indexOf(objRequest.POSP_Sources) > -1) {
                                                            args["Is_PAN_Available"] = "Request Pending";
                                                            args["Is_User_Active"] = "No";
                                                            args['Posp_Enquiry_Id'] = objRequest.Posp_Enquiry_Id || "";
                                                        }
                                                    }
                                                    
                                                    let posp_userobj = new posp_user(args);
                                                    posp_userobj.save(function (err, dbresult2) {
                                                        if (err) {
                                                            res.json({"Status": "Fail", "Msg": err});
                                                        } else {
                                                            try {
                                                                client.get(config.environment.weburl + "/posps/mssql/sync_training_date?ss_id=" + Ss_Id, {}, function (sync_training_date_data, sync_training_date_response) {
                                                                    console.error({"Status": "Success", "Msg": "sync_training_date called.", "Data": sync_training_date_data});
                                                                });
                                                            } catch (ee) {
                                                                console.error('sync_training_date Error', ee.stack);
                                                            }
                                                            if (Profile) {
                                                                posp_doc["UploadedFiles"] = {
                                                                    "UploadedFiles": {
                                                                        "Profile_Photo": Profile
                                                                    }
                                                                };
                                                            } else {
                                                                posp_doc["UploadedFiles"] = {
                                                                    "UploadedFiles": {
                                                                        "Profile_Photo": ""
                                                                    }
                                                                };
                                                            }
                                                            let posp_documentObj = new posp_document(posp_doc);
                                                            posp_documentObj.save(function (err, data) {
                                                                try {
                                                                    if (err) {
                                                                        res.json({"Status": "Fail", "Msg": err});
                                                                    } else {
                                                                        if (Posp_Email && Mail_Send_Flag === "Yes") {
                                                                            try {
                                                                                client.get(config.environment.weburl + '/posps/report/email_consolidate_process?ss_id=' + Ss_Id + '&event_type=TRAINING_LINK', {}, function (mail_data, mail_res) {
                                                                                    console.error('SEND_TRAINING_SCHEDULE_MAIL', 'Ss_Id: ' + Ss_Id);
                                                                                });
                                                                            } catch (ex) {
                                                                                console.error('EXCEPTION_IN_SEND_TRAINING_SCHEDULE_MAIL', 'Ss_Id: ' + Ss_Id, ex.stack);
                                                                            }
                                                                            res.json({"Status": "Success", "Msg": "Training scheduled successfully!!", 'Ss_Id': Ss_Id});
                                                                        } else {
                                                                            res.json({"Status": "Success", "Msg": "Training scheduled but mail not sent", 'Ss_Id': Ss_Id});
                                                                        }
                                                                    }
                                                                } catch (e) {
                                                                    console.error("EXCEPTION", e.stack);
                                                                    res.json({"Status": "Success", "Msg": "Training scheduled but mail not sent", 'Ss_Id': Ss_Id});
                                                                }
                                                            });
                                                        }
                                                    });
                                                }//end
                                            } else {
                                                res.json({"Status": "Fail", "Msg": "POSP object not found in DSA", 'Ss_Id': Ss_Id});
                                            }
                                        } else {
                                            res.json({"Status": "Fail", "Msg": "User type EMP not allowed", 'Ss_Id': Ss_Id});
                                        }

                                    } else {
                                        res.json({"Status": "Fail", "Msg": "No record found in DSA", 'Ss_Id': Ss_Id});
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Please provide valid Ss_Id."});
            }
//            });
        } catch (ex) {
            console.error('Exception', 'Scheule POSP Training', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/get_all_scheduled_users', function (req, res) {
        try {
            const start = new Date().toDateString();
            posp_user.find({Created_On: {$gte: start}}, {Ss_Id: 1, Training_Status: 1, Remaining_Hours: 1, Completed_Hours: 1, Training_Start_Date: 1, Training_End_Date: 1, POSP_UploadingDateAtIIB: 1}).sort({'_id': -1}).exec(function (err, dbresults) {
                if (err) {
                    res.json({"Status": "Fail", "Msg": "User not found"});
                } else {
                    if (dbresults.length > 0) {
                        res.json({"Status": "Success", "Msg": "Users Found", "data": dbresults});
                    } else {
                        res.json({"Status": "Fail", "Msg": "Record not found.", "data": {}});
                    }
                }
            });
        } catch (Ex) {
            console.log('Exception', 'get_user_status', Ex);
            res.json({"Status": "Fail", "Msg": Ex.stack});
        }
    });
    app.post('/onboarding/create_posp_record', function (req, res) {
        try {
            let todayDate = moment().format('YYYY-MM-DD');
            let First_Name = "", Last_Name = "", Middle_Name = "";
            let Mobile_Number = req.body.Mobile_Number ? parseInt(req.body.Mobile_Number) : "";
            let User_Id = req.body.User_Id ? parseInt(req.body.User_Id) : "";
            let Posp_Name = req.body.hasOwnProperty("Name") ? (req.body.Name).toUpperCase() : "";
            let Posp_Email = req.body.hasOwnProperty("Email") ? req.body.Email : "";
            if (!isNaN(User_Id) && !isNaN(Mobile_Number) && Posp_Name && Posp_Email) {
                posp_user.find({"User_Id": User_Id}, function (err, dbresult) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        if (dbresult.length > 0) {
                            res.json({"Status": "Success", "Msg": "User Already Exist", 'data': dbresult});
                        } else {
                            let split_posp_names = Posp_Name.split(" ");
                            if (split_posp_names.length === 1) {
                                First_Name = split_posp_names[0].toUpperCase();
                            } else if (split_posp_names.length === 2) {
                                First_Name = split_posp_names[0].toUpperCase();
                                Last_Name = split_posp_names[1].toUpperCase();
                            } else if (split_posp_names.length > 2) {
                                First_Name = split_posp_names[0].toUpperCase();
                                Middle_Name = split_posp_names[1].toUpperCase();
                                Last_Name = split_posp_names[2].toUpperCase();
                            }
                            let argsObj = {
                                "Mobile_Number": Mobile_Number,
                                "User_Id": User_Id,
                                "Email_Id": Posp_Email.toLowerCase(),
                                "First_Name": First_Name,
                                "Middle_Name": Middle_Name,
                                "Last_Name": Last_Name,
                                "Payment_Status": 'Pending',
                                "Training_Status": "Started",
                                "Remaining_Hours": "30:00:00",
                                "Completed_Hours": "00:00:00",
                                "Training_Start_Date": moment().format("YYYY-MM-DDTHH:mm:ss[Z]"),
                                "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                            };
                            let posp_doc = {
                                "Mobile_Number": Mobile_Number,
                                "User_Id": User_Id,
                                "Name_On_PanCard": Posp_Name.toUpperCase(),
                                "Email": Posp_Email.toLowerCase()
                            };
                            let posp_userobj = new posp_user(argsObj);
                            posp_userobj.save(function (err, dbresult2) {
                                if (err) {
                                    res.json({"Status": "Fail", "Msg": err});
                                } else {
                                    let posp_documentObj = new posp_document(posp_doc);
                                    posp_documentObj.save(function (err, data) {
                                        if (err) {
                                            res.json({"Status": "Fail", "Msg": err});
                                        } else {
                                            let objModelEmail = new Email();
                                            var email_data = '';
                                            let objMail = {
                                                '___posp_name___': Posp_Name,
                                                '___total_training_time___': "30 Hours - General & Life Insurance",
                                                '___training_start_date___': todayDate,
                                                '___short_url___': "https://www.policyboss.com/posp-training-dashboard"
                                            };
                                            email_data = fs.readFileSync(appRoot + '/resource/request_file/Posp_Training_Schedule_Mail.html').toString();
                                            email_data = email_data.replaceJson(objMail);
                                            objModelEmail.send('pospcom@policyboss.com', Posp_Email, "[POSP-ONBOARDING] POSP TRAINING SCHEDULE : : SSID-" + User_Id, email_data, '', '', '');
                                            res.json({"Status": "Success", "Msg": "Training scheduled successfully!!", 'data': dbresult2});
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Please provide User_Id / Mobile_Number / Name / Email."});
            }
        } catch (ex) {
            console.error('Exception', 'Create POSP Record', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/save_mob_number/', function (req, res) {
        try {
            let client = new Client();
            let Mobile_Number = parseInt(req.query['Mobile_Number']);
            let posp_enquiry = require('../models/posp_enquiry.js');
            let posp_lead = require('../models/posp_lead.js');
            if (!isNaN(Mobile_Number)) {
                posp_user.find({"Mobile_Number": Mobile_Number}, function (err, dbresult) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        try {
                            if (dbresult.length > 0) {
                                res.json({"Status": "Success", "Msg": "Mobile Number Already Exist", 'data': dbresult});
                            } else {
                                let argsObj = {
                                    "Training_Status": "Started",
                                    "Remaining_Hours": "30:00:00",
                                    "Completed_Hours": "00:00:00",
                                    "Training_Start_Date": moment().format("YYYY-MM-DDTHH:mm:ss[Z]"),
                                    "Mobile_Number": Mobile_Number,
                                    "Payment_Status": 'Pending'

                                };
                                let posp_userobj = new posp_user(argsObj);
                                posp_userobj.save(function (err, dbresult2) {
                                    if (err) {
                                        res.json({"Status": "Fail", "Msg": err});
                                    } else {
                                        posp_enquiry.find({"mobile": Mobile_Number}, function (err, datapospenquiry) {
                                            if (err) {
                                                res.json({"Status": "Fail", "Msg": err});
                                            } else {
                                                let argsObj = {
                                                    "mobile": Mobile_Number,
                                                    "state": "",
                                                    "Status": "Active",
                                                    "city_id": "",
                                                    "city_name": "",
                                                    "email": "",
                                                    "name": "",
                                                    "aadhaar": "",
                                                    "pan": "",
                                                    "Source": "",
                                                    "Created_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]"),
                                                    "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                                                };
                                                if (datapospenquiry && datapospenquiry.length > 0) {
                                                    res.json({"Status": "Success", "data": dbresult2});
                                                } else {
                                                    let posp_enquiryobj = new posp_enquiry(argsObj);
                                                    posp_enquiryobj.save(function (err, dbresult) {
                                                        if (err) {
                                                            res.json({"Status": "Fail", "Msg": err});
                                                        } else {
                                                            posp_lead.find({"mobile": Mobile_Number}, function (err, dataposplead) {
                                                                if (err) {
                                                                    res.json({"Status": "Fail", "Msg": err});
                                                                } else {
                                                                    let leadargsObj = {
                                                                        "Campgin_name": "",
                                                                        "Enqiry_name": "",
                                                                        "Mobile": Mobile_Number,
                                                                        "Email": "",
                                                                        "Date": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                                                                    };
                                                                    if (dataposplead && dataposplead.length > 0) {
                                                                        res.json({"Status": "Success", "data": dbresult2});
                                                                    } else {
                                                                        let posp_leadobj = new posp_lead(leadargsObj);
                                                                        posp_leadobj.save(function (err, dbresult1) {
                                                                            if (err) {
                                                                                res.json({"Status": "Fail", "Msg": err});
                                                                            } else {
                                                                                if (dbresult1 && dbresult1.hasOwnProperty('_doc')) {
                                                                                    res.json({"Status": "Success", "Msg": "Mobile Number Saved Successfully.", "data": dbresult2});
                                                                                }
                                                                            }
                                                                        });
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            }
                                        });
                                        /* if (dbresult) {
                                         res.json({"Status": "Success", "Msg": "Mobile Number Saved Successfully.", 'data': dbresult});
                                         }*/
                                    }
                                });
                            }
                        } catch (ex) {
                            console.error('Exception', 'save_mob_number', ex);
                            res.json({"Status": "Fail", "Msg": ex.stack});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Provide Mobile Number."});
            }
        } catch (ex) {
            console.error('Exception', 'onboarding-generateOTP', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/save_training_log', function (req, res) {
        try {
            var moment = require('moment');
            let posp_training_history = require('../models/posp_training_history.js');
            let User_Id = req.query['User_Id'] ? parseInt(req.query['User_Id']) : "";
            if (User_Id !== '') {
                posp_user.find({"User_Id": User_Id}, function (err, dbresults) {
                    if (err) {
                        res.json({"Status": "Failure", "Msg": "User not found"});
                    } else {
                        if (dbresults.length > 0) {
                            let training_status = dbresults[0]._doc["Training_Status"];
                            if (training_status === "Started")
                            {
                                posp_training_history.find({"User_Id": User_Id}, function (err, dbres) {
                                    if (err) {
                                        res.json({"Status": "Failure", "Msg": "User not found"});
                                    } else {
                                        if (dbres.length > 0) {
                                            let training_log = [];
                                            for (let x = 0; x < dbres.length; x++) {
                                                let history_data = dbres[x]._doc;
                                                let obj = {
                                                    "StartDate": moment(history_data["Start_Date_Time"]).format('lll'),
                                                    "EndDate": moment(history_data["End_Date_Time"]).format('lll')
                                                };
                                                training_log.push(obj);
                                            }
                                            //Update posp_user
                                            let args1 = {"Training_Log": training_log};
                                            posp_user.update({"User_Id": User_Id}, {$set: args1}, function (err, numAffected) {
                                                if (err)
                                                    res.json({"Status": "Fail", "Msg": "Log Not Updated POSP Login.", "data": err});
                                                res.json({"Status": "Success", "Msg": "Training log updated"});
                                            });
                                        } else {
                                            res.json({"Status": "Success", "Msg": "No log found."});
                                        }
                                    }
                                });
                            } else {
                                res.json({"Status": "Success", "Msg": "Traning not started"});
                            }
                        } else {
                            res.json({"Status": "Success", "Msg": "User doesn't exist.", "data": {}});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "User doesn't exist."});
            }
        } catch (Ex) {
            console.log('Exception', 'get_user_status', Ex);
            res.json({"Status": "Fail", "Msg": Ex.stack});
        }
    });
    app.get('/onboarding/get_user_status_login', function (req, res) {
        try {
            let Mobile_Number = req.query['Mobile_Number'] ? req.query['Mobile_Number'] : "";
            if (Mobile_Number !== '') {
                posp_user.find({"Mobile_Number": Mobile_Number}, function (err, dbresults) {
                    if (err) {
                        res.json({"Status": "Failure", "Msg": "User not found"});
                    } else {
                        if (dbresults.length > 0) {
                            res.json({"Status": "Success", "Msg": "User Found", "data": dbresults[0]._doc});
                        } else {
                            res.json({"Status": "Success", "Msg": "User doesn't exist.", "data": {}});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Please Provide Valid Mobile Number."});
            }
        } catch (Ex) {
            console.log('Exception', 'get_user_status_login', Ex);
            res.json({"Status": "Fail", "Msg": Ex.stack});
        }
    });
    app.get('/onboarding/get_user_status',validateSession, function (req, res) {
        try {
//            let Mobile_Number = req.query['Mobile_Number'] ? parseInt(req.query['Mobile_Number']):"";
            let User_Id = req.query['Ss_Id'] ? parseInt(req.query['Ss_Id']) : "";
            if (User_Id !== '') {
                posp_user.find({"User_Id": User_Id, "Is_Active": true}, function (err, dbresults) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": "User not found"});
                    } else {
                        if (dbresults.length > 0) {
                            res.json({"Status": "Success", "Msg": "User Found", "data": dbresults[0]._doc});
                        } else {
                            res.json({"Status": "Fail", "Msg": "User doesn't exist.", "data": {}});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Please Provide Valid Mobile Number."});
            }
        } catch (Ex) {
            console.log('Exception', 'get_user_status', Ex);
            res.json({"Status": "Fail", "Msg": Ex.stack});
        }
    });
	
	app.get('/onboarding/get_posp_user_status', function (req, res) {
        try {
            let User_Id = req.query['Ss_Id'] ? parseInt(req.query['Ss_Id']) : "";
            if (User_Id !== '') {
                posp_user.find({"User_Id": User_Id, "Is_Active": true}, function (err, dbresults) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": "User not found"});
                    } else {
                        if (dbresults.length > 0) {
                            res.json({"Status": "Success", "Msg": "User Found", "data": dbresults[0]._doc});
                        } else {
                            res.json({"Status": "Fail", "Msg": "User doesn't exist.", "data": {}});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Please Provide Valid Mobile Number."});
            }
        } catch (Ex) {
            console.log('Exception', 'get_user_status', Ex);
            res.json({"Status": "Fail", "Msg": Ex.stack});
        }
    });
    
    app.get('/onboarding/get_user_training_log', function (req, res) {
        try {
            let posp_training_history = require('../models/posp_training_history.js');
            let User_Id = req.query['User_Id'] ? parseInt(req.query['User_Id']) : "";
            if (User_Id !== '') {
                posp_training_history.find({"User_Id": User_Id}, function (err, dbresults) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": "User not found"});
                    } else {
                        if (dbresults.length > 0) {
                            res.json({"Status": "Success", "Msg": "Log Found", "data": dbresults});
                        } else {
                            res.json({"Status": "Fail", "Msg": "Log doesn't exist.", "data": {}});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Please Provide Valid Mobile Number."});
            }
        } catch (Ex) {
            console.log('Exception', 'get_user_status', Ex);
            res.json({"Status": "Fail", "Msg": Ex.stack});
        }
    });
    app.get('/onboarding/get_result', function (req, res) {
        try {
            let examResult = require('../models/exam_result.js');
            let User_Id = req.query['User_Id'] ? parseInt(req.query['User_Id']) : "";
            if (User_Id !== '') {
                examResult.find({"User_Id": User_Id}, function (err, dbresults) {
                    if (err) {
                        res.json({"Status": "Failure", "Msg": "Result not found", "Error": err});
                    } else {
                        if (dbresults.length > 0) {
                            res.json({"Status": "Success", "Msg": "User Found", "data": dbresults[0]._doc});
                        } else {
                            res.json({"Status": "Fail", "Msg": "Result doesn't exist", "data": {}});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "User doesn't exist"});
            }
        } catch (Ex) {
            console.log('Exception', 'get_result', Ex);
            res.json({"Status": "Fail", "Msg": Ex.stack});
        }
    });
    app.get('/onboarding/get_training_sections', function (req, res) {
        try {
            training_section_master.find({}, function (err, dbresults) {
                if (err) {
                    res.json({"Status": "Failure", "Msg": err});
                } else {
                    if (dbresults.length > 0) {
                        res.json({"Status": "Success", "Msg": "Sections Found", "data": dbresults});
                    } else {
                        res.json({"Status": "Success", "Msg": "User doesn't exist.", "data": {}});
                    }
                }
            });
        } catch (Ex) {
            console.log('Exception', 'get_user_status', Ex);
            res.json({"Status": "Fail", "Msg": Ex.stack});
        }
    });
    app.get('/onboarding/get_posp_doc_details', function (req, res) {
        try {
            let User_Id = req.query['User_Id'] ? parseInt(req.query['User_Id']) : "";
            if (User_Id !== '') {
                posp_document.find({"User_Id": User_Id}, function (err, dbresult) {
                    if (err) {
                        throw err;
                    } else {
                        if (dbresult.length > 0) {
                            res.json({"Status": "Success", "data": dbresult});
                        } else {
                            res.json({"Status": "Fail", "Msg": "Details Not Found."});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Please Provide Valid Mobile Number."});
            }
        } catch (ex) {
            console.error('Exception', 'get_posp_doc_details', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/get_posp_doc_log_details', function (req, res) {
        try {
            let User_Id = req.query['User_Id'] ? parseInt(req.query['User_Id']) : "";
            let args = {};
            if (User_Id !== "") {
                args = {
                    "User_Id": User_Id
                };
            }
            posp_doc_log.find(args, function (err, dbresult) {
                if (err) {
                    throw err;
                } else {
                    if (dbresult.length > 0) {
                        res.json({"Status": "Success", "data": dbresult});
                    } else {
                        res.json({"Status": "Fail", "Msg": "Details Not Found"});
                    }
                }
            });
        } catch (ex) {
            console.error('Exception', 'get_posp_doc_log_details', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/update_status/:User_Id', function (req, res) {
        try {
            let client = new Client();
            let Status = req.body.Status;
            let Mobile_Number = parseInt(req.params['Mobile_Number']);
            let User_Id = parseInt(req.params['User_Id']);
            if (!isNaN(User_Id)) {
                posp_user.find({"User_Id": User_Id}, function (err, dbresult) {
                    if (err) {
                        throw err;
                    } else {
                        if (dbresult.length > 0) {
                            var dbresult = dbresult[0]._doc;
                            if (dbresult.Status === "InProcess") {
                                let args = {
                                    "Status": Status,
                                    "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                                };
                                posp_user.update({'User_Id': User_Id}, {$set: args}, {runValidators: true}, function (err, numAffected) {
                                    try {
                                        if (err) {
                                            throw err;
                                        } else {
                                            let objModelEmail = new Email();
                                            let mail_content = '<html><body><p>Dear Posp</p>'
                                                    + '<p>Thank You for choosing us.</p>'
                                                    + '<p>Please find the link to complete your training.<br>'
                                                    + '<a href="https://www.policyboss.com" ><u>Policyboss.com</u></a><br>'
                                                    + 'Regards,<br/>'
                                                    + 'Team Customer Care <br/>'
                                                    + 'Landmark Insurance Brokers Pvt. Ltd.<br/>'
                                                    + '<b> Contact</b> : 18004194199 <br/>'
                                                    + '<img src="https://policyboss.com/images/POSP/policyboss.png"><br/><br/>'
                                                    + '</p></body></html>';
                                            //objModelEmail.send('pospcom@policyboss.com', sendTo, subject, mail_content, arrCC.join(','), '', '');
                                            objModelEmail.send('pospcom@policyboss.com', "piyush.singh@policyboss.com", "Training-Url", mail_content, '', '', '');
                                            res.json({"Status": "Success", "Msg": "Status Updated Successfully"});
                                        }
                                    } catch (ex) {
                                        console.error('Exception', 'onboarding-update_status', ex);
                                        res.json({"Status": "Fail", "Msg": ex.stack});
                                    }
                                });
                            } else {
                                res.json({"Status": "Success", "Msg": ""});
                            }
                        } else {
                            res.json({"Status": "Fail", "Msg": "Mobile Number Not Found."});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Please Provide Valid Mobile Number."});
            }
        } catch (ex) {
            console.error('Exception', 'onboarding-update_status', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post("/onboarding/update_doc_status_NIU", function (req, res) {
        try {
            let body = req.body;
            let verification_data = {};
            let post_args = {
                data: {},
                headers: {
                    "Content-Type": "application/json"
                }
            };
            for (let key in body) {
                verification_data[key] = body[key] && body[key] !== undefined ? body[key] : "";
            }
            let total_doc_count = 0;
            var mail_to = [];
            var rejected_documents = [];
            var Approver_Type = verification_data["Approver_Type"];
            var Ss_Id = verification_data.User_Id;
            var doc_rej_obj = {
                "User_Id": Ss_Id,
                "User_Type": Approver_Type,
                "Email": verification_data.Email,
                "Rm_Mail": verification_data.RM_Email_ID && verification_data.RM_Email_ID !== "NA" ? verification_data.RM_Email_ID : "",
                "Rm_Name": verification_data.RM_Name,
                "Status": []
            };
            let objMail = {
                '___posp_name___': verification_data.Name,
                '___posp_content___': "",
                '___ssid___': Ss_Id,
                '___rm_name___': verification_data.RM_Name
            };
            var Msg = "";
            var total_doc_verified = 0, total_doc_approved = 0, total_doc_rejected = 0;
            var approver_obj = {"Approver": {"Approve": "Approved", "Reject": "A-Reject", "Ss_Id": "Approver_Ss_Id", "Date": "Approved_On_Date"}, "Verifier": {"Approve": "Verified", "Reject": "V-Reject", "Ss_Id": "Verifier_Ss_Id", "Date": "Verified_On_Date"}};
            let total_doc_count_arr = [];
            let total_doc_rejected_arr = [];
            let total_doc_approved_arr = [];
            let total_doc_verified_arr = [];
            let mandate_doc_arr = ["PROFILE", "PAN", "AADHAAR", "QUALIFICATION", "POSP_ACC_DOC", "OTHER"];
            var documents = {
                PAN: {"Status": verification_data["PanCard_Status"], "Remark": verification_data["PanCard_Reject_Reason"]},
                AADHAAR: {"Status": verification_data["AadharCard_Status"], "Remark": verification_data["AadharCard_Reject_Reason"]},
                QUALIFICATION: {"Status": verification_data["Qualification_Certificate_Status"], "Remark": verification_data["Qualification_Certificate_Reject_Reason"]},
                PROFILE: {"Status": verification_data["Profile_Status"], "Remark": verification_data["Profile_Reject_Reason"]},
                POSP_ACC_DOC: {"Status": verification_data["PospBankAccount_Status"], "Remark": verification_data["PospBank_Reject_Reason"]},
                OTHER: {"Status": verification_data["Other_Certificate_Status"], "Remark": verification_data["Other_Certificate_Reject_Reason"]}
            };
            if (verification_data.User_Id && Approver_Type) {
                Object.keys(documents).find(key => {
//                    total_doc_count++;
                    if ((documents[key] && mandate_doc_arr.indexOf(key) > -1) && (["Approve", "Reject"].indexOf(documents[key].Status) > -1)) {
                        total_doc_count_arr.push(documents[key]);
                    }
                    let doc_log_args = {};
                    if (Approver_Type === "Approver") {
                        doc_log_args["Approver_Ss_Id"] = verification_data.Approver_Ss_Id;
                        doc_log_args["Approved_On_Date"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                        doc_log_args["Prev_Approval_Status"] = approver_obj[Approver_Type][documents[key]["Status"]];
                    } else {
                        doc_log_args["Verifier_Ss_Id"] = verification_data.Verifier_Ss_Id;
                        doc_log_args["Verified_On_Date"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                    }
                    doc_log_args["User_Id"] = verification_data.User_Id;
                    doc_log_args["Mobile_Number"] = verification_data.Mobile_Number;
                    doc_log_args["Fba_Id"] = verification_data.Fba_Id;
                    doc_log_args["Doc_Type"] = key;
                    doc_log_args["Status"] = approver_obj[Approver_Type][documents[key]["Status"]];
                    doc_log_args["Remark"] = documents[key]["Remark"];
                    if (["A-Reject", "V-Reject"].includes(doc_log_args["Status"])) {
                        rejected_documents.push({
                            "Doc_Type": key,
                            "Reject_Reason": doc_log_args["Remark"],
                            "Reject_Remark": doc_log_args["Status"]
                        });
//                        total_doc_rejected++;
                        total_doc_rejected_arr.push(doc_log_args["Doc_Type"]);
                    } else {
//                        doc_log_args["Status"] === "Approved" ? (total_doc_approved++) : (doc_log_args["Status"] === "Verified" ? total_doc_verified++ : "");
                        if ((doc_log_args["Doc_Type"] && mandate_doc_arr.indexOf(doc_log_args["Doc_Type"]) > -1)) {
                            if (doc_log_args.Status && (["Approved"].indexOf(doc_log_args.Status) > -1)) {
                                total_doc_approved_arr.push(doc_log_args["Doc_Type"]);
                            } else if (doc_log_args.Status && (["Verified"].indexOf(doc_log_args.Status) > -1)) {
                                total_doc_verified_arr.push(doc_log_args["Doc_Type"]);
                            }
                        }
                    }
                    post_args["data"] = doc_log_args;
                    client.post(config.environment.weburl + "/onboarding/update_doc_log", post_args, function (data, response) {
                    });
                });
                if (total_doc_rejected_arr.length > 0) {
                    doc_rej_obj["Status"] = rejected_documents;
                    post_args["data"] = {'data': doc_rej_obj};
                    client.post(config.environment.weburl + "/onboarding/send_doc_rejection_mail", post_args, function (data, response) {
                    });
                }
                let posp_args = {
                    "Is_Document_Rejected": "No"
                };
//                if (total_doc_verified === 7) {
                if ([5, 6].indexOf(total_doc_verified_arr.length) > -1) {
                    posp_args["Is_Doc_Verified"] = "Yes";
                    posp_args["Onboarding_Status"] = "Doc_Verified";
                    posp_args["Documents_Verified_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                    posp_args["Last_Status"] = "Doc_Verified";
                    Msg = "Documents Verified Successfully";
                } else if (total_doc_count_arr.length === total_doc_approved_arr.length) {
                    posp_args["Is_Doc_Approved"] = "Yes";
                    posp_args["Is_Doc_Verified"] = "Yes";
                    posp_args["Onboarding_Status"] = "Doc_Approved";
                    posp_args["Documents_Approved_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                    posp_args["Last_Status"] = "Doc_Approved";
                    posp_args["Is_Mail_Sent"] = 0;
                    Msg = "Documents Approved Successfully";
                } else {
                    posp_args["Is_Document_Rejected"] = "Yes";
                    posp_args["Is_Doc_Verified"] = "No";
                    posp_args["Verified_Mail_Sent"] = "No";
                    posp_args["Onboarding_Status"] = "Doc_Rejected";
                    posp_args["Documents_Rejected_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                    posp_args["Documents_Rejected_By"] = Approver_Type;
                    posp_args["Last_Status"] = "Doc_Rejected";
                    Msg = "Documents status updated successfully";
                }
                posp_user.findOneAndUpdate({"User_Id": Ss_Id}, {$set: posp_args}, {new : true}, function (posp_update_err, posp_update_res) {
                    try {
                        if (posp_update_err) {
                            res.json({"Status": "Fail", "Msg": posp_update_err});
                        } else {
                            if (posp_update_res && (posp_update_res["Is_Doc_Verified"] === "Yes" || posp_update_res["Is_Doc_Approved"] === "Yes")) {
                                if (posp_update_res["Is_Doc_Approved"] === "Yes") {
                                    let args = {
                                        "Approved_Mail_Sent": "Yes"
                                    };
                                    posp_user.update({"User_Id": Ss_Id}, {$set: args}, function (posp_update_err, posp_update_res) {
                                        if (posp_update_err) {
                                            res.json({"Status": "Fail", "Msg": posp_update_err});
                                        }
                                    });
                                    try {
                                        client.get(config.environment.weburl + '/posps/report/email_consolidate_process?ss_id=' + Ss_Id + '&event_type=IIB_UPLOAD_REQUEST', {}, function (mail_data, mail_res) {
                                            console.error('SEND_IIB_UPLOAD_REQUEST_MAIL', 'Ss_Id: ' + Ss_Id);
                                        });
                                    } catch (ex) {
                                        console.error("EXCEPTION_IN_SEND_IIB_UPLOAD_REQUEST_MAIL", 'Ss_Id: ' + Ss_Id, ex.stack);
                                    }
                                } else if (posp_update_res && (posp_update_res["Is_Doc_Verified"] === "Yes" && posp_update_res["Verified_Mail_Sent"] === "No")) {
                                    let args = {
                                        "Verified_Mail_Sent": "Yes"
                                    };
                                    posp_user.update({"User_Id": Ss_Id}, {$set: args}, function (posp_update_err, posp_update_res) {
                                        if (posp_update_err) {
                                            res.json({"Status": "Fail", "Msg": posp_update_err});
                                        }
                                    });
                                    try {
                                        client.get(config.environment.weburl + '/posps/report/email_consolidate_process?ss_id=' + Ss_Id + '&event_type=DOCUMENT_APPROVE_REQUEST', {}, function (mail_data, mail_res) {
                                            console.error('SEND_DOCUMENT_APPROVE_REQUEST_MAIL', 'Ss_Id: ' + Ss_Id);
                                        });
                                    } catch (ex) {
                                        console.error("EXCEPTION_IN_SEND_DOCUMENT_APPROVE_REQUEST_MAIL", 'Ss_Id: ' + Ss_Id, ex.stack);
                                    }
                                }
                                res.json({"Status": "Success", "Msg": Msg});
                            } else {
                                res.json({"Status": "Success", "Msg": Msg});
                            }
                        }
                    } catch (ex) {
                        console.error('Exception', '/update_doc_status-', Ss_Id, ex.stack);
                        res.json({"Status": "FAIL", "Msg": ex.stack});
                    }
                });
            } else {
                res.json({"Status": "FAIL", "Msg": "Please provide valid Ss_Id / approver details."});
            }
        } catch (ex) {
            let body = req.body || 'NA';
            let Ss_Id = body.hasOwnProperty('User_Id') ? body.User_Id : "NA";
            console.error('Exception', '/update_doc_status-', Ss_Id, ex.stack);
            res.json({"Status": "FAIL", "Msg": ex.stack});
        }
    });

	app.post("/onboarding/update_doc_status", function (req, res) {
        try {
            let body = req.body;
            let verification_data = {};
            let post_args = {
                data: {},
                headers: {
                    "Content-Type": "application/json"
                }
            };
            for (let key in body) {
                verification_data[key] = body[key] && body[key] !== undefined ? body[key] : "";
            }
            let total_doc_count = 0;
            var mail_to = [];
            var rejected_documents = [];
            var Approver_Type = verification_data["Approver_Type"];
            var Ss_Id = verification_data.User_Id;
            var doc_rej_obj = {
                "User_Id": Ss_Id,
                "User_Type": Approver_Type,
                "Email": verification_data.Email,
                "Rm_Mail": verification_data.RM_Email_ID && verification_data.RM_Email_ID !== "NA" ? verification_data.RM_Email_ID : "",
                "Rm_Name": verification_data.RM_Name,
                "Status": []
            };
            let objMail = {
                '___posp_name___': verification_data.Name,
                '___posp_content___': "",
                '___ssid___': Ss_Id,
                '___rm_name___': verification_data.RM_Name
            };
            var Msg = "";
            var total_doc_verified = 0, total_doc_approved = 0, total_doc_rejected = 0;
            var approver_obj = {"Approver": {"Approve": "Approved", "Reject": "A-Reject", "Ss_Id": "Approver_Ss_Id", "Date": "Approved_On_Date"}, "Verifier": {"Approve": "Verified", "Reject": "V-Reject", "Ss_Id": "Verifier_Ss_Id", "Date": "Verified_On_Date"}};
            let total_doc_count_arr = [];
            let total_doc_rejected_arr = [];
            let total_doc_approved_arr = [];
            let total_doc_verified_arr = [];
            // aadhar_remove_27032024 let mandate_doc_arr = ["PROFILE", "PAN", "AADHAAR", "QUALIFICATION", "POSP_ACC_DOC", "OTHER"];
            let mandate_doc_arr = ["PROFILE", "PAN", "QUALIFICATION", "POSP_ACC_DOC", "OTHER"];
            var documents = {
                PAN: {"Status": verification_data["PanCard_Status"], "Remark": verification_data["PanCard_Reject_Reason"]},
                // aadhar_remove_27032024 AADHAAR: {"Status": verification_data["AadharCard_Status"], "Remark": verification_data["AadharCard_Reject_Reason"]},
                QUALIFICATION: {"Status": verification_data["Qualification_Certificate_Status"], "Remark": verification_data["Qualification_Certificate_Reject_Reason"]},
                PROFILE: {"Status": verification_data["Profile_Status"], "Remark": verification_data["Profile_Reject_Reason"]},
                POSP_ACC_DOC: {"Status": verification_data["PospBankAccount_Status"], "Remark": verification_data["PospBank_Reject_Reason"]},
                OTHER: {"Status": verification_data["Other_Certificate_Status"], "Remark": verification_data["Other_Certificate_Reject_Reason"]}
            };
            if (verification_data.User_Id && Approver_Type) {
                Object.keys(documents).find(key => {
//                    total_doc_count++;
                    if ((documents[key] && mandate_doc_arr.indexOf(key) > -1) && (["Approve", "Reject"].indexOf(documents[key].Status) > -1)) {
                        total_doc_count_arr.push(documents[key]);
                    }
                    let doc_log_args = {};
                    if (Approver_Type === "Approver") {
                        doc_log_args["Approver_Ss_Id"] = verification_data.Approver_Ss_Id;
                        doc_log_args["Approved_On_Date"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                        doc_log_args["Prev_Approval_Status"] = approver_obj[Approver_Type][documents[key]["Status"]];
                    } else {
                        doc_log_args["Verifier_Ss_Id"] = verification_data.Verifier_Ss_Id;
                        doc_log_args["Verified_On_Date"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                    }
                    doc_log_args["User_Id"] = verification_data.User_Id;
                    doc_log_args["Mobile_Number"] = verification_data.Mobile_Number;
                    doc_log_args["Fba_Id"] = verification_data.Fba_Id;
                    doc_log_args["Doc_Type"] = key;
                    doc_log_args["Status"] = approver_obj[Approver_Type][documents[key]["Status"]];
                    doc_log_args["Remark"] = documents[key]["Remark"];
                    if (["A-Reject", "V-Reject"].includes(doc_log_args["Status"])) {
                        rejected_documents.push({
                            "Doc_Type": key,
                            "Reject_Reason": doc_log_args["Remark"],
                            "Reject_Remark": doc_log_args["Status"]
                        });
//                        total_doc_rejected++;
                        total_doc_rejected_arr.push(doc_log_args["Doc_Type"]);
                    } else {
//                        doc_log_args["Status"] === "Approved" ? (total_doc_approved++) : (doc_log_args["Status"] === "Verified" ? total_doc_verified++ : "");
                        if ((doc_log_args["Doc_Type"] && mandate_doc_arr.indexOf(doc_log_args["Doc_Type"]) > -1)) {
                            if (doc_log_args.Status && (["Approved"].indexOf(doc_log_args.Status) > -1)) {
                                total_doc_approved_arr.push(doc_log_args["Doc_Type"]);
                            } else if (doc_log_args.Status && (["Verified"].indexOf(doc_log_args.Status) > -1)) {
                                total_doc_verified_arr.push(doc_log_args["Doc_Type"]);
                            }
                        }
                    }
                    post_args["data"] = doc_log_args;
                    client.post(config.environment.weburl + "/onboarding/update_doc_log", post_args, function (data, response) {
                    });
                });
                if (total_doc_rejected_arr.length > 0) {
                    doc_rej_obj["Status"] = rejected_documents;
                    post_args["data"] = {'data': doc_rej_obj};
                    client.post(config.environment.weburl + "/onboarding/send_doc_rejection_mail", post_args, function (data, response) {
                    });
                }
                let posp_args = {
                    "Is_Document_Rejected": "No"
                };
                // aadhar_remove_27032024 [5, 6]
                if ([4,5].indexOf(total_doc_verified_arr.length) > -1) {
                    posp_args["Is_Doc_Verified"] = "Yes";
                    posp_args["Onboarding_Status"] = "Doc_Verified";
                    posp_args["Documents_Verified_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                    posp_args["Last_Status"] = "Doc_Verified";
                    Msg = "Documents Verified Successfully";
                } else if (total_doc_count_arr.length === total_doc_approved_arr.length) {
                    posp_args["Is_Doc_Approved"] = "Yes";
                    posp_args["Is_Doc_Verified"] = "Yes";
                    posp_args["Onboarding_Status"] = "Doc_Approved";
                    posp_args["Documents_Approved_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                    posp_args["Last_Status"] = "Doc_Approved";
                    posp_args["Is_Mail_Sent"] = 0;
                    Msg = "Documents Approved Successfully";
                } else {
                    posp_args["Is_Document_Rejected"] = "Yes";
                    posp_args["Is_Doc_Verified"] = "No";
                    posp_args["Verified_Mail_Sent"] = "No";
                    posp_args["Onboarding_Status"] = "Doc_Rejected";
                    posp_args["Documents_Rejected_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                    posp_args["Documents_Rejected_By"] = Approver_Type;
                    posp_args["Last_Status"] = "Doc_Rejected";
                    Msg = "Documents status updated successfully";
                }
                posp_user.findOneAndUpdate({"User_Id": Ss_Id}, {$set: posp_args}, {new : true}, function (posp_update_err, posp_update_res) {
                    try {
                        if (posp_update_err) {
                            res.json({"Status": "Fail", "Msg": posp_update_err});
                        } else {
                            if (posp_update_res && (posp_update_res["Is_Doc_Verified"] === "Yes" || posp_update_res["Is_Doc_Approved"] === "Yes")) {
                                if (posp_update_res["Is_Doc_Approved"] === "Yes") {
                                    let args = {
                                        "Approved_Mail_Sent": "Yes"
                                    };
                                    posp_user.update({"User_Id": Ss_Id}, {$set: args}, function (posp_update_err, posp_update_res) {
                                        if (posp_update_err) {
                                            res.json({"Status": "Fail", "Msg": posp_update_err});
                                        }
                                    });
                                    try {
                                        client.get(config.environment.weburl + '/posps/report/email_consolidate_process?ss_id=' + Ss_Id + '&event_type=IIB_UPLOAD_REQUEST', {}, function (mail_data, mail_res) {
                                            console.error('SEND_IIB_UPLOAD_REQUEST_MAIL', 'Ss_Id: ' + Ss_Id);
                                        });
                                    } catch (ex) {
                                        console.error("EXCEPTION_IN_SEND_IIB_UPLOAD_REQUEST_MAIL", 'Ss_Id: ' + Ss_Id, ex.stack);
                                    }
                                } else if (posp_update_res && (posp_update_res["Is_Doc_Verified"] === "Yes" && posp_update_res["Verified_Mail_Sent"] === "No")) {
                                    let args = {
                                        "Verified_Mail_Sent": "Yes"
                                    };
                                    posp_user.update({"User_Id": Ss_Id}, {$set: args}, function (posp_update_err, posp_update_res) {
                                        if (posp_update_err) {
                                            res.json({"Status": "Fail", "Msg": posp_update_err});
                                        }
                                    });
                                    try {
                                        client.get(config.environment.weburl + '/posps/report/email_consolidate_process?ss_id=' + Ss_Id + '&event_type=DOCUMENT_APPROVE_REQUEST', {}, function (mail_data, mail_res) {
                                            console.error('SEND_DOCUMENT_APPROVE_REQUEST_MAIL', 'Ss_Id: ' + Ss_Id);
                                        });
                                    } catch (ex) {
                                        console.error("EXCEPTION_IN_SEND_DOCUMENT_APPROVE_REQUEST_MAIL", 'Ss_Id: ' + Ss_Id, ex.stack);
                                    }
                                }
                                res.json({"Status": "Success", "Msg": Msg});
                            } else {
                                res.json({"Status": "Success", "Msg": Msg});
                            }
                        }
                    } catch (ex) {
                        console.error('Exception', '/update_doc_status-', Ss_Id, ex.stack);
                        res.json({"Status": "FAIL", "Msg": ex.stack});
                    }
                });
            } else {
                res.json({"Status": "FAIL", "Msg": "Please provide valid Ss_Id / approver details."});
            }
        } catch (ex) {
            let body = req.body || 'NA';
            let Ss_Id = body.hasOwnProperty('User_Id') ? body.User_Id : "NA";
            console.error('Exception', '/update_doc_status-', Ss_Id, ex.stack);
            res.json({"Status": "FAIL", "Msg": ex.stack});
        }
    });

    app.post('/onboarding/get_all_posp_logins', function (req, res) { //admin: fetch all the posp mobile logins data
        try {
            var objBase = new Base();
            var obj_pagination = objBase.jqdt_paginate_process(req.body);
            var optionPaginate = {
                sort: {'Created_On': -1},
                lean: true,
                page: 1,
                limit: 10
            };
            if (obj_pagination) {
                optionPaginate['page'] = obj_pagination.paginate.page;
                optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
            }
            let objRequest = req.body;
            let filter = obj_pagination.filter;
            if (objRequest["search_by"] === "mobile_no") {
                filter["Mobile_Number"] = new RegExp(objRequest["search_byvalue"], 'i');
            }
            posp_user.paginate(filter, optionPaginate).then(function (user_datas) {
                res.json(user_datas);
            });
        } catch (ex) {
            console.error('Exception', 'get_all_posp_logins', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/get_posp_documents/:User_Id', function (req, res) { //Admin: fetch docs details by passing mobile number
        try {
            let User_Id = parseInt(req.params['User_Id']);
            posp_document.find({'User_Id': User_Id}, function (err, dbres) {
                if (err)
                    res.json({"Status": "Fail", "Msg": err});
                res.json(dbres);
            });
        } catch (ex) {
            console.error('Exception', 'get_posp_documents', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/get_posp_documents_by_mobile/:Mobile_Number', function (req, res) { //Admin: fetch docs details by passing mobile number
        try {
            let Mobile_Number = req.params['Mobile_Number'] ? req.params['Mobile_Number'] : "";
            if (!isNaN(Mobile_Number) && Mobile_Number !== '') {
                posp_document.findOne({'Mobile_Number': Mobile_Number}, function (err, dbres) {
                    if (err)
                        res.json({"Status": "Fail", "Msg": err});
                    res.json({"Status": 'Success', 'data': dbres});
                });
            } else {
                res.json({"Status": "Fail", "Msg": 'Document Not Found'});
            }
        } catch (ex) {
            console.error('Exception', 'get_posp_documents', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/fetch_all_questions', function (req, res) {
        try {
            var objBase = new Base();
            var obj_pagination = objBase.jqdt_paginate_process(req.body);
            var optionPaginate = {
                sort: {'Created_On': -1},
                lean: true,
                page: 1,
                limit: 10
            };
            if (obj_pagination) {
                optionPaginate['page'] = obj_pagination.paginate.page;
                optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
            }
            let filter = {};
            filter = obj_pagination.filter;
            question_master.paginate(filter, optionPaginate).then(function (question_datas) {
                res.json(question_datas);
            });
        } catch (ex) {
            console.error('Exception', 'fetch_all_questions', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/fetch_all_training_modules', function (req, res) {
        try {
            let training_module_master = require('../models/training_module_master.js');
            var objBase = new Base();
            var obj_pagination = objBase.jqdt_paginate_process(req.body);
            var optionPaginate = {
                sort: {'Created_On': -1},
                lean: true,
                page: 1,
                limit: 10
            };
            if (obj_pagination) {
                optionPaginate['page'] = obj_pagination.paginate.page;
                optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
            }
            let filter = {};
            filter = obj_pagination.filter;
            training_module_master.paginate(filter, optionPaginate).then(function (modules_datas) {
                res.json(modules_datas);
            });
        } catch (ex) {
            console.error('Exception', 'fetch_all_training_modules', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/fetch_all_training_content', function (req, res) {
        try {
            let training_module_content = require('../models/training_module_content.js');
            var objBase = new Base();
            var obj_pagination = objBase.jqdt_paginate_process(req.body);
            var optionPaginate = {
                sort: {'Created_On': -1},
                lean: true,
                page: 1,
                limit: 10
            };
            if (obj_pagination) {
                optionPaginate['page'] = obj_pagination.paginate.page;
                optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
            }
            let filter = {};
            filter = obj_pagination.filter;
            training_module_content.paginate(filter, optionPaginate).then(function (cotents_datas) {
                res.json(cotents_datas);
            });
        } catch (ex) {
            console.error('Exception', 'fetch_all_training_content', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/add_question', function (req, res) {
        try {
            let question = {};
            question['Section_Id'] = req.body.Section_Id ? req.body.Section_Id : "";
            question['Question_Name'] = req.body.Question_Name ? req.body.Question_Name : "";
            question['Section_Name'] = req.body.Section_Name ? req.body.Section_Name : "";
            question['OptionA'] = req.body.OptionA ? req.body.OptionA : "";
            question['OptionB'] = req.body.OptionB ? req.body.OptionB : "";
            question['OptionC'] = req.body.OptionC ? req.body.OptionC : "";
            question['OptionD'] = req.body.OptionD ? req.body.OptionD : "";
            question['Shuffle_All'] = req.body.Shuffle_All ? req.body.Shuffle_All : "";
            question['Correct_Answer'] = req.body.Correct_Answer ? req.body.Correct_Answer : "";
            question['Created_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
            question['Modified_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
            let questionObj = new question_master(question);
            questionObj.save(function (err, dbresult) {
                if (err)
                    res.json({"Status": "Fail", "Msg": err});
                if (dbresult) {
                    res.json({"Status": "Success", "Msg": "Question Added Successfully."});
                }
            });
        } catch (ex) {
            console.error('Exception', 'add_question', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/add_modules_content', function (req, res) {
        try {
            let training_module_content = require('../models/training_module_content.js');
            let content = {};
//            content['Content_Id'] = req.body.Content_Id ? parseInt(req.body.Content_Id) : 0;
            content['Module_Id'] = req.body.Module_Id ? parseInt(req.body.Module_Id) : 0;
            content['Training_Id'] = req.body.Training_Id ? parseInt(req.body.Training_Id) : 0;
            content['Chapter_No'] = req.body.Chapter_No ? parseInt(req.body.Chapter_No) : 0;
            content['Page_No'] = req.body.Page_No ? parseInt(req.body.Page_No) : 0;
            content['Module_Name'] = req.body.Module_Name ? req.body.Module_Name : "";
            content['Content_Heading'] = req.body.Content_Heading ? req.body.Content_Heading : "";
            content['Module_Content'] = req.body.Module_Content ? req.body.Module_Content : "";
            content['Status'] = req.body.Status ? req.body.Status : "";
            content['Created_On'] =moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
            content['Modified_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
            try {
                let contentObj = new training_module_content(content);
                contentObj.save(function (err, dbresult) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": "Content not added", "Error": err});
                    }
                    if (dbresult) {
                        res.json({"Status": "Success", "Msg": "Content Added Successfully."});
                    }
                });
            } catch (ex2) {
                console.error('Exception', 'add_training_content', ex2);
                res.json({"Status": "Fail", "Msg": ex2.stack});
            }
        } catch (ex) {
            console.error('Exception', 'add_training_content', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/add_training_modules', function (req, res) {
        try {
            let training_module_master = require('../models/training_module_master.js');
            let module = {};
            module['Training_Id'] = req.body.Training_Id ? parseInt(req.body.Training_Id) : 0;
            module['Training_Module_Id'] = req.body.Training_Module_Id ? parseInt(req.body.Training_Module_Id) : 0;
            module['Module_Name'] = req.body.Module_Name ? req.body.Module_Name : "";
            module['Total_Chapter_Count'] = req.body.Chapter_Count ? parseInt(req.body.Chapter_Count) : 0;
            module['Total_Page_Count'] = req.body.Page_Count ? parseInt(req.body.Page_Count) : 0;
            module['Status'] = req.body.Status ? req.body.Status : "";
            module['Created_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
            module['Modified_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
            let moduleObj = new training_module_master(module);
            moduleObj.save(function (err, dbresult) {
                if (err)
                    res.json({"Status": "Fail", "Msg": "Duplicate Record"});
                if (dbresult) {
                    res.json({"Status": "Success", "Msg": "Module Added Successfully."});
                }
            });
        } catch (ex) {
            console.error('Exception', 'add_training_module', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/update_question', function (req, res) {
        try {
            let Question_Id = req.body.Question_Id ? parseInt(req.body.Question_Id) : "";
            let questionObj = {};
            for (var key in req.body) {
                if (key === "Question_Id") {
                    continue;
                } else {
                    questionObj[key] = req.body[key];
                }
            }

            if (Question_Id !== "") {
                question_master.update({'Question_Id': Question_Id}, {$set: questionObj}, function (err, numAffected) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        res.json({"Status": "Success", "Msg": "Question updated successfully."});
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Question Id is missing."});
            }
        } catch (ex) {
            console.error('Exception', 'update_question', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/update_training_module', function (req, res) {
        try {
            let training_module_master = require('../models/training_module_master.js');
            let Training_Module_Id = req.body.Training_Module_Id ? parseInt(req.body.Training_Module_Id) : "";
            let moduleObj = {};
            for (var key in req.body) {
                if (key === "Training_Module_Id") {
                    continue;
                } else {
                    moduleObj[key] = req.body[key];
                }
            }
            moduleObj["Modified_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
            if (Training_Module_Id !== "") {
                training_module_master.update({'Training_Module_Id': Training_Module_Id}, {$set: moduleObj}, function (err, numAffected) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        res.json({"Status": "Success", "Msg": "Module updated successfully."});
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Training Module Id is missing."});
            }
        } catch (ex) {
            console.error('Exception', 'update_training_module', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/update_module_content', function (req, res) {
        try {
            let training_module_content = require('../models/training_module_content.js');
            let Content_Id = req.body.Content_Id ? parseInt(req.body.Content_Id) : "";
            let contentObj = {};
            for (var key in req.body) {
                if (key === "Training_Module_Id") {
                    continue;
                } else {
                    contentObj[key] = req.body[key];
                }
            }
            contentObj["Modified_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
            if (Content_Id !== "") {
                training_module_content.update({'Content_Id': Content_Id}, {$set: contentObj}, function (err, numAffected) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        res.json({"Status": "Success", "Msg": "Content updated successfully."});
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Content Id is missing."});
            }
        } catch (ex) {
            console.error('Exception', 'update_module_content', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/fetch_all_training', function (req, res) {
        try {
            var objBase = new Base();
            var obj_pagination = objBase.jqdt_paginate_process(req.body);
            var optionPaginate = {
                sort: {'Created_On': -1},
                lean: true,
                page: 1,
                limit: 10
            };
            if (obj_pagination) {
                optionPaginate['page'] = obj_pagination.paginate.page;
                optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
            }
            let filter = {};
            filter = obj_pagination.filter;
            training_master.paginate(filter, optionPaginate).then(function (training_datas) {
                res.json(training_datas);
            });
        } catch (ex) {
            console.error('Exception', 'fetch_all_training_modules', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/add_training', function (req, res) {
        try {
            let training = {};
            sectionObj = JSON.parse(req.body.Section);
            training['Training_Type'] = req.body.Training_Type ? req.body.Training_Type : "";
            training['Training_Timing'] = req.body.Training_Timing ? req.body.Training_Timing : "";
            training['Section'] = req.body.Section ? sectionObj : "";
            training['Total_Number_Of_Questions'] = req.body.Total_Number_Of_Questions ? req.body.Total_Number_Of_Questions : "";
            training['Passing_marks'] = req.body.Passing_marks ? req.body.Passing_marks : "";
            training['Status'] = req.body.Status ? req.body.Status : "";
            training['Created_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
            training['Modified_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
            let trainingObj = new training_master(training);
            trainingObj.save(function (err, dbresult) {
                if (err)
                    res.json({"Status": "Fail", "Msg": err});
                if (dbresult && dbresult._doc) {
                    if (Object.keys(sectionObj).length > 0) {
                        //let sectionArr = Object.entries(sectionObj);
                        for (let i = 0; i < Object.keys(sectionObj).length; i++)
                        {
                            let key = Object.keys(sectionObj)[i];
                            let args = {
                                "Training_Id": dbresult._doc.Training_Id,
                                "Section_Name": key,
                                "Number_Of_Questions": sectionObj[key],
                                "Created_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]"),
                                "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                            };
                            let training_sectionObj = new training_section_master(args);
                            training_sectionObj.save(function (err, dbresult) {});
                        }
                    }
                    res.json({"Status": "Success", "Msg": "Training Added Successfully."});
                }
            });
        } catch (ex) {
            console.error('Exception', 'add_training', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/update_training', function (req, res) {
        try {
            let Training_Id = req.body.Training_Id ? parseInt(req.body.Training_Id) : "";
            let trainingObj = {};
            for (var key in req.body) {
                if (key === "Training_Id") {
                    continue;
                } else {
                    trainingObj[key] = req.body[key];
                }
            }

            if (Training_Id !== "") {
                training_master.update({'Training_Id': Training_Id}, {$set: trainingObj}, function (err, numAffected) {
                    if (err)
                        throw err;
                    if (numAffected && numAffected.nModified === 1) {
                        res.json({"Status": "Success", "Msg": "Training updated successfully."});
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Training Id is missing."});
            }
        } catch (ex) {
            console.error('Exception', 'update_training', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/fetch_all_training_section', function (req, res) {
        try {
            var objBase = new Base();
            var obj_pagination = objBase.jqdt_paginate_process(req.body);
            var optionPaginate = {
                sort: {'Created_On': -1},
                lean: true,
                page: 1,
                limit: 10
            };
            if (obj_pagination) {
                optionPaginate['page'] = obj_pagination.paginate.page;
                optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
            }
            let filter = {};
            filter = obj_pagination.filter;
            training_section_master.paginate(filter, optionPaginate).then(function (training_section_datas) {
                res.json(training_section_datas);
            });
        } catch (ex) {
            console.error('Exception', 'fetch_all_training_section', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/add_training_section', function (req, res) {
        try {
            let training_section = {};
            let Training_Id = parseInt(req.body.Training_Id);
            training_master.findOne({"Training_Id": Training_Id}, function (err, dbres) {
                try {
                    if (err)
                        throw err;
                    if (dbres && dbres._doc) {
                        let objdata = dbres._doc.Section;
                        training_section['Training_Id'] = req.body.Training_Id ? req.body.Training_Id : "";
                        training_section['Number_Of_Questions'] = req.body.Number_Of_Questions ? req.body.Number_Of_Questions : "";
                        training_section['Section_Name'] = req.body.Section_Name ? req.body.Section_Name : "";
                        training_section['Created_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                        training_section['Modified_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                        let training_sectionObj = new training_section_master(training_section);
                        training_sectionObj.save(function (err, dbresult) {
                            if (err)
                                res.json({"Status": "Fail", "Msg": err});
                            if (dbresult && dbresult._doc) {
                                let d = dbresult._doc;
                                objdata[d['Section_Name']] = d['Number_Of_Questions'];
                                training_master.update({"Training_Id": Training_Id}, {$set: {"Section": objdata}}, function (err, numAffected) {

                                });
                                res.json({"Status": "Success", "Msg": "Training Section Added Successfully."});
                            }
                        });
                    } else {
                        res.json({"Status": "Fail", "Msg": "Training Section Not Added as Training Id does not Exist."});
                    }
                } catch (ex) {
                    console.error('Exception', 'onboarding-add_training_section', ex);
                    res.json({"Status": "Fail", "Msg": ex.stack});
                }
            });
        } catch (ex) {
            console.error('Exception', 'onboarding-add_training_section', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/update_training_section', function (req, res) {
        try {
            let Section_Id = req.body.Section_Id ? parseInt(req.body.Section_Id) : "";
            let Training_Id = req.body.Training_Id ? parseInt(req.body.Training_Id) : "";
            let Section_Name = req.body.Section_Name ? req.body.Section_Name : "";
            let Number_Of_Questions = req.body.Number_Of_Questions ? parseInt(req.body.Number_Of_Questions) : "";
            let trainingsectionObj = {};
            for (var key in req.body) {
                if (key === "Section_Id") {
                    continue;
                } else {
                    trainingsectionObj[key] = req.body[key];
                }
            }
            if (Section_Id !== "" && Training_Id !== "" && Number_Of_Questions !== "" && Section_Name !== "") {
                training_section_master.update({'Section_Id': Section_Id}, {$set: trainingsectionObj}, function (err, numAffected) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        training_section_master.find({'Training_Id': Training_Id}, function (err, dbres) {
                            if (err) {
                                res.json({"Status": "Fail", "Msg": err});
                            } else {
                                let Sections = {};
                                for (let i = 0; i < dbres.length; i++) {
                                    let current_sections = dbres[i]._doc;
                                    Sections[current_sections["Section_Name"]] = current_sections["Number_Of_Questions"];
                                }

                                training_master.update({'Training_Id': Training_Id}, {$set: {'Section': Sections}}, function (err, numAffected) {
                                    if (err)
                                        res.json({"Status": "Fail", "Msg": err});
                                    if (numAffected && numAffected.nModified === 1) {
                                        res.json({"Status": "Success", "Msg": "Training Section updated successfully."});
                                    }
                                });
                            }
                        });
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Some Details are missing."});
            }
        } catch (ex) {
            console.error('Exception', 'update-training-section', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/fetch_questions', function (req, res) {
        try {
            let Training_Id = parseInt(req.body.Training_Id);
            let Section_Id = parseInt(req.body.Section_Id);
            if (Section_Id !== "") {
                let filter = {
                    $and: [
                        {
                            $or: [
                                {"Training_Id": Training_Id},
                                {"Section_Id": Section_Id}
                            ]
                        },
                        {
                            "Is_Active": true
                        }
                    ]
                };
                let select = "Question_Id Section_Id Section_Name Question_Name OptionA OptionB OptionC OptionD Correct_Answer Shuffle_All";
                question_master.find(filter).select(select).exec(function (err, question_datas) {
                    if (err)
                        throw err;
                    res.json({"Status": "Success", "data": question_datas});
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Section Id Missing."});
            }
        } catch (ex) {
            console.error('Exception', 'fetch_questions', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/get_training_details', function (req, res) {
        try {
            let Training_Type = req.query['Training_Type'] ? req.query['Training_Type'] : "";
            let args = {};
            if (Training_Type !== "") {
                if (Training_Type !== "ALL") {
                    args = {
                        "Training_Type": Training_Type
                    };
                }
                training_master.find(args, function (err, dbresult) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        if (dbresult.length > 0) {
                            res.json({"Status": "Success", "data": dbresult});
                        } else {
                            res.json({"Status": "Fail", "Msg": "Training Details Not Found."});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Invalid Training_Type"});
            }
        } catch (ex) {
            console.error('Exception', 'get_training_details', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/save_user_response', function (req, res) {
        try {
            let questArr = JSON.parse(req.body.data);
            let posp_temp_answer = require('../models/posp_temp_answer.js');
            for (let i in questArr) {
                let User_Id = questArr[i].User_Id ? parseInt(questArr[i].User_Id) : "";
                //let Section_Name = questArr[i].Section_Id ? parseInt(questArr[i].Section_Name) : "";
                let Section_Id = questArr[i].Section_Id ? questArr[i].Section_Id : "";
                let Question_Id = questArr[i].Question_Id ? parseInt(questArr[i].Question_Id) : "";
                let Selected_Ans = questArr[i].Selected_Ans;
                posp_temp_answer.find({"User_Id": User_Id, "Question_Id": Question_Id}, function (err, dbdata) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        if (dbdata && dbdata.length > 0) {
                            let data = dbdata[0]._doc;
                            updateObj = {
                                "Selected_Ans": Selected_Ans,
                                "Modified_On":moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                            };
                            if (data['Correct_Ans'] === Selected_Ans) {
                                updateObj['result'] = 1;
                                posp_temp_answer.update({"User_Id": User_Id, "Question_Id": Question_Id}, {$set: updateObj}, function (err, numAffected) {
                                    if (err)
                                        res.json({"Status": "Fail", "Msg": err});
                                    if (numAffected && numAffected['nModified'] === 1) {
                                        //res.json({"Status": "Success"});
                                    }
                                });
                            } else {
                                updateObj['result'] = 0;
                                posp_temp_answer.update({"User_Id": User_Id, "Question_Id": Question_Id}, {$set: updateObj}, function (err, numAffected) {
                                    if (err)
                                        res.json({"Status": "Fail", "Msg": err});
                                    if (numAffected && numAffected['nModified'] === 1) {
                                        //res.json({"Status": "Success"});
                                    }
                                });
                            }
                        } else {
                            question_master.find({"Question_Id": Question_Id, "Section_Id": Section_Id}, function (err, dbres) {
                                if (err)
                                    res.json({"Status": "Fail", "Msg": err});
                                let count = 0;
                                if (dbres && dbres.length > 0) {
                                    let args = {
                                        "User_Id": User_Id,
                                        "Section_Id": Section_Id,
                                        "Question_Id": Question_Id,
                                        "Selected_Ans": Selected_Ans,
                                        "Correct_Ans": dbres[0]['Correct_Answer'],
                                        "result": count,
                                        "Created_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]"),
                                        "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                                    };
                                    if (dbres[0]['Correct_Answer'] === Selected_Ans) {
                                        args['result'] = 1;
                                        let ansObj = new posp_temp_answer(args);
                                        ansObj.save(function (err, dbresult) {
                                            if (err)
                                                res.json({"Status": "Fail", "Msg": err});
                                            //res.json({"Status": "Success", "Msg": "response saved."});
                                        });
                                    } else {
                                        args['result'] = 0;
                                        let ansObj = new posp_temp_answer(args);
                                        ansObj.save(function (err, dbresult) {
                                            if (err)
                                                res.json({"Status": "Fail", "Msg": err});
//                                            res.json({"Status": "Success", "Msg": "response saved."});
                                        });
                                    }
                                } else {
                                    res.json({"Status": "Fail", "Msg": "Question Not Found"});
                                }
                            });
                        }
                    }
                    ;
                });
                if (parseInt(i) === questArr.length - 1) {
                    res.json({"Status": "Success"});
                } else {

                }
            }
        } catch (ex) {
            console.error('Exception', 'save_user_response', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/save_result/:training_id/:user_id', function (req, res) {
        try {
            let passingMarks = 0, marksObtained = 0;
            let User_Id = parseInt(req.params.user_id);
            let Training_Id = parseInt(req.params.training_id);
            let posp_temp_answer = require('../models/posp_temp_answer.js');
            if (!isNaN(User_Id) && !isNaN(Training_Id)) {
                training_master.find({"Training_Id": Training_Id}, function (err, dbdata) {
                    if (err) {
                        res.json({"Status": "Success", "Msg": err});
                    } else {
                        if (dbdata && dbdata.length > 0) {
                            passingMarks = dbdata[0]._doc['Passing_marks'] - 0;
                        }
                        let getTotalMarks = {
                            "User_Id": User_Id, //pass user_id dyanamically.
                            $where: function () {
                                return this.result === 1;
                            }
                        };
                        posp_temp_answer.find(getTotalMarks).count(function (err, count) {
                            if (err) {
                                res.json({"Status": "Fail", "Msg": err});
                            } else {
                                if (count && count > 0) {
                                    marksObtained = count;
                                    let result = marksObtained < passingMarks ? "FAIL" : "PASS";
                                    console.log("user Result : " + result);
                                    let args = {
                                        "User_Id": User_Id,
                                        "Total_Score": marksObtained,
                                        "Passing_Marks": passingMarks,
                                        "Result": marksObtained < passingMarks ? "FAIL" : "PASS",
                                        "Created_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]"),
                                        "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                                    };
                                    examResult.find({"User_Id": User_Id}, function (err, dbres) {
                                        if (err)
                                            res.json({"Status": "Fail", Msg: err});
                                        if (dbres && dbres.length > 0) {
                                            args['Modified_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                            examResult.update({"User_Id": User_Id}, {$set: args}, function (err, numAffected) { //update result
                                                if (err)
                                                    res.json({"Status": "Fail", "Msg": err});
                                                if (numAffected && numAffected['nModified'] === 1) {
                                                    if (result === "PASS") {
                                                        let args2 = {
                                                            "Exam_Status": "Completed",
                                                            "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                                                        };
                                                        posp_user.update({"User_Id": User_Id}, {$set: args2}, {runValidators: true}, function (err, numAffected) {
                                                            if (err)
                                                                throw err;
                                                            if (numAffected && numAffected.ok === 1) {
                                                                res.json({"Status": "Success", "PassingMarks": passingMarks, "MarksObtained": marksObtained});
                                                            }
                                                        });
                                                    } else {
                                                        res.json({"Status": "Success", "PassingMarks": passingMarks, "MarksObtained": marksObtained});
                                                    }
                                                }
                                            });
                                        } else {
                                            let posp_examResult_obj = new examResult(args);
                                            posp_examResult_obj.save(function (err, dbresult) {
                                                if (err) {
                                                    res.json({"Status": "Fail", "Msg": err});
                                                } else {
                                                    if (dbresult) {
                                                        res.json({"Status": "Success", "PassingMarks": passingMarks, "MarksObtained": marksObtained});
                                                    }
                                                }
                                            });
//                                    
                                        }
                                    });
                                } else {
                                    let args = {
                                        "User_Id": User_Id,
                                        "Total_Score": 0,
                                        "Passing_Marks": passingMarks,
                                        "Result": "FAIL",
                                        "Created_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]"),
                                        "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                                    };
                                    examResult.find({"User_Id": User_Id}, function (err, dbres) {
                                        if (err)
                                            res.json({"Status": "Fail", Msg: err});
                                        if (dbres && dbres.length > 0) {
                                            args['Modified_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                            examResult.update({"User_Id": User_Id}, {$set: args}, function (err, numAffected) { //update result
                                                if (err) {
                                                    res.json({"Status": "Fail", "Msg": err});
                                                } else {
                                                    res.json({"Status": "Success", "PassingMarks": passingMarks, "MarksObtained": 0});
                                                }
                                            });
                                        } else {
                                            let posp_examResult_obj = new examResult(args);
                                            posp_examResult_obj.save(function (err, dbresult) {
                                                if (err) {
                                                    res.json({"Status": "Fail", "Msg": err});
                                                } else {
                                                    if (dbresult) {
                                                        res.json({"Status": "Success", "PassingMarks": passingMarks, "MarksObtained": 0});
                                                    }
                                                }
                                            });
//                                    
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            } else {
                res.json({"Status": "Success", "Msg": "User Id Or Training Id Missing Or Incorrect."});
            }
        } catch (ex) {
            console.error('Exception', 'get result', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }

    });
    app.post('/onboarding/add_onboarding_package', function (req, res) {
        try {
            let onboarding_package = require('../models/onboarding_packages.js');
            let requestObj = req.body;
            let argObj = {};
            for (let key in req.body) {
                argObj[key] = requestObj[key];
            }
            argObj['Created_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
            argObj['Modified_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
            let onboardingPackageObj = new onboarding_package(argObj);
            onboardingPackageObj.save(function (err, result) {
                if (err) {
                    res.json({"Status": "Fail", "Msg": err});
                } else {
                    if (result) {
                        res.json({"Status": "Success", "Msg": "Package has been Added Successfully."});
                    } else {
                        res.json({"Status": "Fail", "Msg": "Package Not Saved."});
                    }
                }
            });
        } catch (ex) {
            console.error('Exception', 'add_onboarding_package', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/fetch_onboarding_package/:package_id?', function (req, res) {
        try {
            let onboarding_package = require('../models/onboarding_packages.js');
            let Package_Id = req.params['package_id'] ? parseInt(req.params['package_id']) : "";
            let filterObj = {};
            if (!isNaN(Package_Id) && Package_Id !== "") {
                filterObj['Package_Id'] = Package_Id;
            }
            onboarding_package.find(filterObj).sort({'Amount': 1}).exec(function (err, dbresult) {
                if (err) {
                    res.json({"Status": "Fail", "Msg": err});
                } else {
                    res.json({"Status": "Success", "data": dbresult});
                }
            });
        } catch (ex) {
            console.error('Exception', 'fetch_onboarding_package', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/get_training_section/:Training_Id', function (req, res) {
        try {
            let Training_Id = parseInt(req.params['Training_Id']);
            if (!isNaN(Training_Id)) {
                training_section_master.find({"Training_Id": Training_Id}, function (err, dbresult) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        if (dbresult.length > 0) {
                            res.json({"Status": "Success", "data": dbresult});
                        } else {
                            res.json({"Status": "Fail", "Msg": "Training Section Not Found."});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Invalid Training ID."});
            }
        } catch (ex) {
            console.error('Exception', 'get_training_section', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    function getTimeDiff(time_dif) {
        let h = "", m = "", s = "";
        time_dif.hours() < 10 ? h = "0" + time_dif.hours() : h = time_dif.hours();
        time_dif.minutes() < 10 ? m = "0" + time_dif.minutes() : m = time_dif.minutes();
        time_dif.seconds() < 10 ? s = "0" + time_dif.seconds() : s = time_dif.seconds() - 1;
        return h + ":" + m + ":" + s;
    }
    app.post('/onboarding/training_scheduler', function (req, res) {
        try {
            let todayDate = moment().format('YYYY-MM-DD');
            let trainingStartDate, Completed_Hours, Remaining_Hours, Completed_Hours_In_Sec, Remaining_Hours_In_Sec;
            let posp_training_history = require('../models/posp_training_history.js');
            let argsObj = {};
            let requestObj = req.body;
            let User_Id = requestObj.User_Id ? requestObj.User_Id - 0 : "";
            let Training_Slot = requestObj.Training_Slot;
            argsObj['User_Id'] = User_Id;
            argsObj['Start_Date_Time'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
            argsObj['End_Date_Time'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
            argsObj['Created_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
            argsObj['Modified_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
            let dailyLimitInSec = 21600;
            let totalTrainingTime = '30:00:00';
            let totalTrainingTimeInSec = convertToSec(totalTrainingTime);
            if (User_Id !== "") {
                posp_user.find({'User_Id': User_Id}, function (err, dbposp) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        try {
                            if (dbposp && dbposp.length > 0 && dbposp[0]._doc['Training_Status'] === "Started") {
                                let data = dbposp[0]._doc;
                                trainingStartDate = data['Training_Start_Date'] ? data['Training_Start_Date'] : res.json({"Status": "Success", "Msg": "Training Not started yet."});
                                trainingStartDate = moment(trainingStartDate).format('YYYY-MM-DD');
                                Completed_Hours = data['Completed_Hours'];
                                Remaining_Hours = data['Remaining_Hours'];
                                Completed_Hours_In_Sec = convertToSec(Completed_Hours);
                                Remaining_Hours_In_Sec = convertToSec(Remaining_Hours);
                                if (totalTrainingTimeInSec > Completed_Hours_In_Sec) {
                                    let diff = (moment(todayDate).diff(moment(trainingStartDate), 'days')) + 1;
                                    if (diff > 0) {
                                        trainingTimeInSec = 36000;
                                        todaytrainingTimeInSec = trainingTimeInSec * diff;
                                        if (todaytrainingTimeInSec < totalTrainingTimeInSec) {
                                            if (todaytrainingTimeInSec > Completed_Hours_In_Sec) {
                                                incrementInSec = todaytrainingTimeInSec - Completed_Hours_In_Sec;
                                                Completed_Hours_In_Sec = todaytrainingTimeInSec;
                                                Remaining_Hours_In_Sec = Remaining_Hours_In_Sec - incrementInSec;
                                                Completed_Hours = convertToHours(Completed_Hours_In_Sec);
                                                Remaining_Hours = convertToHours(Remaining_Hours_In_Sec);
                                                posp_user.update({'User_Id': User_Id}, {$set: {'Completed_Hours': Completed_Hours, 'Remaining_Hours': Remaining_Hours}}, function (err, numAffected) {
                                                    if (err) {
                                                        res.json({"Status": "Fail", "Msg": err});
                                                    } else {
                                                        argsObj['Total_Time'] = Completed_Hours;
                                                        argsObj['Extension_Source'] = 'System';
                                                        let posp_training_historyObj = new posp_training_history(argsObj);
                                                        posp_training_historyObj.save(function (err, result) {
                                                            if (err) {
                                                                res.json({"Status": "Fail", "Msg": err});
                                                            } else {
                                                                res.json({"Status": "Success", "Msg": "Training scheduled succesfully."});
                                                            }
                                                        });
                                                    }
                                                });
                                            } else {
                                                argsObj['Total_Time'] = Completed_Hours;
                                                argsObj['Extension_Source'] = 'User';
                                                let posp_training_historyObj = new posp_training_history(argsObj);
                                                posp_training_historyObj.save(function (err, result) {
                                                    if (err) {
                                                        res.json({"Status": "Fail", "Msg": err});
                                                    } else {
                                                        res.json({"Status": "Success", "Msg": "Training scheduled succesfully."});
                                                    }
                                                });
                                            }

                                        } else {
                                            Completed_Hours_In_Sec = totalTrainingTimeInSec;
                                            Remaining_Hours_In_Sec = 0;
                                            Completed_Hours = convertToHours(Completed_Hours_In_Sec);
                                            Remaining_Hours = convertToHours(Remaining_Hours_In_Sec);
                                            let args = {
                                                "Is_Training_Completed": 'Yes',
                                                "Training_Status": "Completed",
                                                "Remaining_Hours": Remaining_Hours,
                                                "Completed_Hours": Completed_Hours,
                                                "Training_End_Date": moment().format("YYYY-MM-DDTHH:mm:ss[Z]"),
                                                "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                                            };
                                            posp_user.update({'User_Id': User_Id}, {$set: args}, {runValidators: true}, function (err, numAffected) {
                                                if (err) {
                                                    res.json({"Success": "Fail", "Msg": err});
                                                } else {
                                                    argsObj['Total_Time'] = Completed_Hours;
                                                    argsObj['Extension_Source'] = 'System';
                                                    let posp_training_historyObj = new posp_training_history(argsObj);
                                                    posp_training_historyObj.save(function (err, result) {
                                                        if (err) {
                                                            res.json({"Status": "Fail", "Msg": err});
                                                        } else {
                                                            posp_document.find({"User_Id": User_Id}, function (err, dbdoc) {
                                                                if (err) {
                                                                    res.json({"Status": "Fail", "Msg": err});
                                                                } else {

                                                                    let objModelEmail = new Email();
                                                                    let email = (dbdoc[0]._doc && dbdoc[0]._doc.PersonDetails && dbdoc[0]._doc.PersonDetails.Person_EmailId) ? dbdoc[0]._doc.PersonDetails.Person_EmailId : "piyush.singh@policyboss.com";
                                                                    let Mobile_Number = dbdoc[0]._doc['Mobile_Number'];
                                                                    let url = config.environment.weburl;
                                                                    if (config.environment.name === 'Production') {

                                                                    } else if (config.environment.name === 'QA') {
                                                                        url = config.environment.weburl ? (config.environment.weburl).split(':')[0] + ':' + (config.environment.weburl).split(':')[1] : config.environment.weburl;
                                                                    } else {
                                                                        url = config.environment.weburl;
                                                                    }
                                                                    let mail_content = '<html><body><p>Dear Posp,<br>'
                                                                            + 'You have successfully completed your training.<br>Please proceed with the examination.<br></p>'
                                                                            + '<p>Exam Link : <a href="' + url + '/EduApp/examHome.html">Go To POSP Training Exam</a></p>'
                                                                            + 'Regards,<br/>'
                                                                            + 'Team Customer Care <br/>'
                                                                            + 'Landmark Insurance Brokers Pvt. Ltd.<br/>'
                                                                            + '<b> Contact</b> : 18004194199 <br/>'
                                                                            + '<img src="https://policyboss.com/images/POSP/policyboss.png"><br/><br/>'
                                                                            + '</p></body></html>';
                                                                    //objModelEmail.send('pospcom@policyboss.com', sendTo, subject, mail_content, arrCC.join(','), '', '');
                                                                    objModelEmail.send('pospcom@policyboss.com', email, "Training Completed", mail_content, '', '', '');
                                                                    var objSmsLog = new SmsLog();
                                                                    var customer_msg = "Hi ,\n\you have completed your training.Please proceed with the examination.";
                                                                    objSmsLog.send_sms(Mobile_Number, customer_msg, 'TRAINING_COMPLETED');
                                                                    res.json({"Status": "Success", "Msg": "Training Completed succesfully."});
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }


                                    }
                                } else {
                                    posp_document.find({"User_Id": User_Id}, function (err, dbdoc) {
                                        if (err) {
                                            res.json({"Status": "Fail", "Msg": err});
                                        } else {
                                            let objModelEmail = new Email();
                                            let email = (dbdoc[0]._doc && dbdoc[0]._doc.PersonDetails && dbdoc[0]._doc.PersonDetails.Person_EmailId) ? dbdoc[0]._doc.PersonDetails.Person_EmailId : "piyush.singh@policyboss.com";
                                            let Mobile_Number = dbdoc[0]._doc['Mobile_Number'];
                                            let url = config.environment.weburl;
                                            if (config.environment.name === 'Production') {

                                            } else if (config.environment.name === 'QA') {
                                                url = config.environment.weburl ? (config.environment.weburl).split(':')[0] + ':' + (config.environment.weburl).split(':')[1] : config.environment.weburl;
                                            } else {
                                                url = config.environment.weburl;
                                            }
                                            let mail_content = '<html><body><p>Dear Posp,<br>'
                                                    + 'You have successfully completed your training.<br>Please proceed with the examination.<br></p>'
                                                    + '<p>Exam Link : <a href="' + url + '/EduApp/examHome.html">Go To POSP Training Exam</a></p>'
                                                    + 'Regards,<br/>'
                                                    + 'Team Customer Care <br/>'
                                                    + 'Landmark Insurance Brokers Pvt. Ltd.<br/>'
                                                    + '<b> Contact</b> : 18004194199 <br/>'
                                                    + '<img src="https://policyboss.com/images/POSP/policyboss.png"><br/><br/>'
                                                    + '</p></body></html>';
                                            //objModelEmail.send('pospcom@policyboss.com', sendTo, subject, mail_content, arrCC.join(','), '', '');
                                            objModelEmail.send('pospcom@policyboss.com', email, "Training Completed", mail_content, '', '', '');
                                            var objSmsLog = new SmsLog();
                                            var customer_msg = "Hi ,\n\you have completed your training.Please proceed with the examination.";
                                            objSmsLog.send_sms(Mobile_Number, customer_msg, 'TRAINING_COMPLETED');
                                            let args = {
                                                "Is_Training_Completed": 'Yes',
                                                "Training_Status": "Completed",
                                                "Remaining_Hours": "00:00:00",
                                                "Completed_Hours": "30:00:00",
                                                "Training_End_Date": moment().format("YYYY-MM-DDTHH:mm:ss[Z]"),
                                                "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                                            };
                                            posp_user.update({'User_Id': User_Id}, {$set: args}, {runValidators: true}, function (err, numAffected) {
                                                if (err) {
                                                    res.json({"Success": "Fail", "Msg": err});
                                                } else {
                                                    res.json({"Status": "Success", "Msg": "Training complated mail sent to the customer"});
                                                }
                                            });
                                        }
                                    });
                                }
                            } else {
                                res.json({"Success": "Success", "Msg": "Training not yet started"});
                            }
                        } catch (ex) {
                            console.error('Exception', 'training-scheduler', ex);
                            res.json({"Status": "Fail", "Msg": ex.stack});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "User ID Missing."});
            }


        } catch (ex) {
            console.error('Exception', 'update_training_history', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/update_training_status/:Ss_Id?', function (req, res) {
        try {
            let Client = require('node-rest-client').Client;
            let client = new Client();
            //let Ss_Id = (req.params.hasOwnProperty('Ss_Id') && req.params['Ss_Id'] !== undefined) ? parseInt(req.params['Ss_Id']) : 0;
            let objRequest = req.params;
            let Ss_Id = objRequest.Ss_Id ? parseInt(objRequest.Ss_Id) : 0;
            if (Ss_Id === 0) {
                posp_user.find({'Training_Status': "Started"}).sort({'_id': -1}).exec(function (err, dbposp) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        try {
                            let count_data = 0;
                            if (dbposp && dbposp.length > 0) {
                                for (let i = 0; i < dbposp.length; i++)
                                {
                                    let data = dbposp[i]._doc;
                                    let User_Id = data['User_Id'];
                                    let args = {
                                        data: {
                                            'User_Id': User_Id
                                        },
                                        headers: {
                                            "Content-Type": "application/json"
                                        }
                                    };
                                    client.post(config.environment.weburl + "/onboarding/save_training_history", args, function (data, response) {
                                        if (data.Status === "Success") {
                                            count_data++;
                                        }

                                    });
                                    if (i === (dbposp.length - 1))
                                    {
                                        if (count_data > 0) {
                                            res.send({'Status': "Success", "Msg": 'Training hours updated successfully.'});
                                        } else {
                                            res.send({'Status': "Success", "Msg": 'Training hours updated successfully.'});
                                        }
                                    }
                                }
                            } else {
                                res.json({"Status": "Success", "Msg": "No training is started"});
                            }
                        } catch (exx) {
                            console.error('Exception', 'update_training_status', exx.stack);
                            res.json({"Status": "Fail", "Msg": exx.stack});
                        }
                    }
                });
            } else {
                try {
                    let args = {
                        data: {
                            'User_Id': Ss_Id
                        },
                        headers: {
                            "Content-Type": "application/json"
                        }
                    };
                    client.post(config.environment.weburl + "/onboarding/save_training_history", args, function (data, response) {
                        if (data.Status === "Success") {
                            res.send({'Status': "Success", "Msg": 'Training hours updated successfully.', "Ss_Id": Ss_Id});
                        } else {
                            res.send({'Status': "Success", "Msg": 'Training hours not updated.', "Ss_Id": Ss_Id});
                        }

                    });
                } catch (e) {
                    res.json({"Status": "Fail", "Msg": e.stack});
                }
            }
        } catch (ex) {
            console.error('Exception', 'update_training_status', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get("/onboarding/dashboard", function (req, res) {
        var Mobile_Number = req.query["mobileno"];
        res.sendFile(appRoot + "/resource/request_file/EduApp_v2/training-module-chapter.html");
    });
    app.get('/onboarding/tmp/:folder/:file', function (req, res) {
        var urlpath = req.url;
        var folder = req.params.folder;
        var file = req.params.file;
        urlpath = urlpath.toString().replace('pdf', 'tmp/log');
        res.sendFile(path.join(appRoot + '/tmp/onboarding_docs/' + folder + '/' + file));
    });
    app.post('/onboarding/update_package_id', function (req, res) {
        try {
            let User_Id = req.body.User_Id ? req.body.User_Id : "";
            let Mobile_Number = req.body.Mobile_Number ? req.body.Mobile_Number : "";
            let Package_Id = req.body.package_id ? parseInt(req.body.package_id) : 0;
            let Package_Name = req.body.package_name ? req.body.package_name : "";
            let Amount = req.body.package_amount ? req.body.package_amount : "";
            let Description = req.body.package_desc ? req.body.package_desc : "";
            if (Mobile_Number !== "") {
                posp_user.find({"User_Id": User_Id}, function (err, dbresult) {
                    if (err) {
                        throw err;
                    } else {
                        try {
                            if (dbresult && dbresult.length > 0) {
                                let args = {
                                    "Package_Id": Package_Id
                                };
                                posp_user.update({'User_Id': User_Id}, {$set: args}, {runValidators: true}, function (err, numAffected) {
                                    if (err)
                                        res.json({"Status": "Fail", "Msg": err});
                                    if (numAffected && numAffected.ok === 1) {
                                        posp_document.findOne({'User_Id': User_Id}, function (err, dbdoc) {
                                            if (err) {
                                                res.json({"Status": "Fail", "Msg": err});
                                            } else if (dbdoc && dbdoc._doc) {
                                                if (dbdoc._doc && dbdoc._doc.Email) {
                                                    let objModelEmail = new Email();
                                                    let url = config.environment.weburl;
                                                    if (config.environment.name === 'Production') {

                                                    } else if (config.environment.name === 'QA') {
                                                        url = config.environment.weburl ? (config.environment.weburl).split(':')[0] + ':' + (config.environment.weburl).split(':')[1] : config.environment.weburl;
                                                    } else {
                                                        url = config.environment.weburl;
                                                    }

                                                    let mail_content = '<html><body><p>Dear Posp,</p><br>'
                                                            + '<p>You have choosen the package.<br>'
                                                            + '<p><b>Package Name :</b> ' + Package_Name + '<br>'
                                                            + '<p><b>Package Amount : </b>' + Amount + '<br>'
                                                            + '<p><b>Package Description : </b>' + Description + '<br>'
                                                            + '<p>Please click on the link below to complete your payment.<br>'
                                                            + '<p><b><a href="' + url + '/EduApp/Payment.html" ><u>Payment Link</u></a></b></p><br>'
                                                            + 'Regards,<br/>'
                                                            + 'Team Customer Care <br/>'
                                                            + 'Landmark Insurance Brokers Pvt. Ltd.<br/>'
                                                            + '<b> Contact</b> : 18004194199 <br/>'
                                                            + '<img src="https://policyboss.com/images/POSP/policyboss.png"><br/><br/>'
                                                            + '</p></body></html>';
                                                    let sendTo = dbdoc._doc && dbdoc._doc.Email ? dbdoc._doc.Email : "nilam.bhagde@policyboss.com";
                                                    //objModelEmail.send('pospcom@policyboss.com', sendTo, subject, mail_content, arrCC.join(','), '', '');
                                                    objModelEmail.send('pospcom@policyboss.com', sendTo, "Payment for Selected Package", mail_content, '', '', '');
                                                    var objSmsLog = new SmsLog();
                                                    var customer_msg = "Hi ,\n\You have choosen the package.\nPackage Name : " + Package_Name + ".\nPackage Amount : " + Amount + ".\nPackage Description : " + Description + ".\nPlease click on the below link to complete your payment.\n<a href='" + url + "'/EduApp/Payment.html'" + "><u>Payment Link</u></a>";
                                                    objSmsLog.send_sms(Mobile_Number, customer_msg, 'PACKAGE-SELECTED');
                                                    res.json({"Status": "Success", "Msg": "Package ID Updated Successfully."});
                                                } else {
                                                    res.json({"Status": "Success", "Msg": "Package Id updated but Email not Sent to User."});
                                                }
                                            } else {
                                                res.json({"Status": "Success", "Msg": "Details not updated."});
                                            }
                                        });
                                    } else {
                                        res.json({"Status": "Fail", "Msg": "Package id not updated."});
                                    }
                                });
                            }
                        } catch (ex) {
                            console.error('Exception', 'training-schedule', ex);
                            res.json({"Status": "Fail", "Msg": ex.stack});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Mobile Number Missing."});
            }
        } catch (ex) {
            console.error('Exception', 'Update package ID', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/generatePospCertificate/:User_Id', function (req, res) {
        try {
            var moment = require('moment');
            let User_ID = "";
            let Training_Start_Date = "";
            let Training_End_Date = "";
            let Name = "";
            let POSP_Email = "";
            let PanCard_Number = "";
            let AadharCard_Number = "";
            let Examination_pass_date = "";
            let Mobile_Number = parseInt(req.params['Mobile_Number']);
            let User_Id = parseInt(req.params['User_Id']);
            if (!isNaN(User_Id)) {
                posp_user.find({"User_Id": User_Id}, function (err, dbresult) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        if (dbresult.length > 0) {
                            if (dbresult[0]._doc.Exam_Status === "Completed") {
                                let data = dbresult[0]._doc;
                                User_ID = dbresult[0]._doc.User_Id;
                                Mobile_Number = dbresult[0]._doc.Mobile_Number;
                                let start_date = new Date(dbresult[0]._doc.Training_Start_Date);
                                Training_Start_Date = moment(start_date).format('YYYY-MM-DD');
                                let end_date = new Date(dbresult[0]._doc.Training_End_Date);
                                Training_End_Date = moment(end_date).format('YYYY-MM-DD');
                                let pname = data.First_Name + " " + data.Middle_Name + " " + data.Last_Name;
                                Name = pname ? pname : '________________';
                                POSP_Email = data.Email_Id ? data.Email_Id : "";
                                console.log("POSP EMAIL : " + POSP_Email);
                                PanCard_Number = data.Pan_No;
                                AadharCard_Number = data.Aadhar;
                                posp_document.find({"User_Id": User_Id}, function (err, dbresult1) {
                                    if (err) {
                                        res.json({"Status": "Fail", "Msg": err});
                                    } else {
                                        if (dbresult1.length > 0) {
                                            let data1 = dbresult1[0]._doc;
                                            Profile_Pic = data1.UploadedFiles.UploadedFiles.Profile_Photo;
                                            examResult.find({"User_Id": User_ID}, function (err, dbresult2) {
                                                if (err) {
                                                    res.json({"Status": "Fail", "Msg": err});
                                                } else {
                                                    if (dbresult2.length > 0) {

                                                        let exam_date = new Date(dbresult2[0]._doc.Modified_On);
                                                        Examination_pass_date = moment(exam_date).format('YYYY-MM-DD');
                                                        if (!fs.existsSync(appRoot + "/tmp/onboarding_certificates/" + User_Id)) {
                                                            fs.mkdirSync(appRoot + "/tmp/onboarding_certificates/" + User_Id);
                                                        }
                                                        let file_sys_loc_horizon = appRoot + "/tmp/onboarding_certificates/" + User_Id + "/Certificate.pdf";
                                                        let file_web_path_horizon = config.environment.weburl + "/onboarding/download/certificate/" + User_Id + "/Certificate.pdf";
                                                        let certificate_data = fs.readFileSync(appRoot + '/resource/request_file/Certificate.html').toString();
//                                                        let certificate_data = fs.readFileSync(appRoot + '/resource/request_file/Certificate.html').toString();
                                                        let objCertificate = {
                                                            '___training_name___': 'General Insurance and Life Insurance (Thirty Hours)',
                                                            '___posp_name___': Name,
                                                            '___posp_aadhar_no___': AadharCard_Number,
                                                            '___posp_pan_no___': PanCard_Number,
                                                            '___training_start_date___': Training_Start_Date,
                                                            '___training_end_date___': Training_End_Date,
                                                            '___examination_pass_date___': Examination_pass_date,
                                                            '___posp_img___': Profile_Pic ? Profile_Pic : 'https://origin-cdnh.policyboss.com/html/web-jul-2022/images/home-page/advisor1.png'
                                                        };
                                                        let certificate_content = certificate_data.replaceJson(objCertificate);
                                                        var options = {
                                                            format: "A4",
                                                            timeout: 50000,
                                                            "orientation": "portrait",
                                                            border: {
                                                                "top": "0.3cm",
                                                                "left": "0.3cm",
                                                                "right": "0.3cm"
                                                            }
                                                        };
                                                        pdf.create(certificate_content, options).toFile(file_sys_loc_horizon, function (err, result) {
                                                            if (err)
                                                                res.json({"Status": "Fail", "Msg": "Html to pdf"});
                                                            else {
                                                                let objModelEmail = new Email();
                                                                let mail_content = '<html><body><p>Hi,</p>'
                                                                        + '<p>Please click on the below link to download your certificate :</p>'
                                                                        + '<p>1. Download Certificate : <a href="' + config.environment.weburl + '/onboarding/download/certificate/' + User_Id + "/Certificate.pdf" + '">certificate link</a></p>'
                                                                        + 'Regards,<br/>'
                                                                        + 'Landmark Insurance Brokers Pvt. Ltd.<br/>'
                                                                        + '<b> Contact</b> : 18004194199 <br/>'
                                                                        + '<img src="https://www.policyboss.com/website/Images/PolicyBoss-Logo.jpg"><br/><br/>'
                                                                        + '</p></body></html>';
                                                                //objModelEmail.send('pospcom@policyboss.com', sendTo, subject, mail_content, arrCC.join(','), '', '');
                                                                let sendTo = POSP_Email;
                                                                let arrCC = ['piyush.singh@policyboss.com', 'nilam.bhagde@policyboss.com'];
                                                                objModelEmail.send('pospcom@policyboss.com', sendTo, "Posp-Certificate-download-Url", mail_content, arrCC.join(','), '', '');
                                                                var objSmsLog = new SmsLog();
                                                                var customer_msg = "Hi ,\n\Please click on below link to download your certificate." + "\n 1. Certificate Link : <a href='" + file_web_path_horizon + "'>download certificate</a>";
                                                                objSmsLog.send_sms(Mobile_Number, customer_msg, 'CERTIFICATE');
                                                                res.json({"Status": "Success", "Msg": "Certificate Generated."});
                                                            }
                                                        });
                                                    } else {
                                                        res.json({"Status": "Fail", "Msg": "Details not found."});
                                                    }
                                                }
                                            });
                                        } else {
                                            res.json({"Status": "Fail", "Msg": "Details not found."});
                                        }
                                    }
                                });
                            } else {
                                res.json({"Status": "Fail", "Msg": "Exam Not attempted."});
                            }
                        } else {
                            res.json({"Status": "Fail", "Msg": "User Not Found."});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Invalid Mobile_Number."});
            }
        } catch (ex) {
            console.error('Exception', 'get_training_section', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/generateCertificate_New/:User_Id/:Mail_Send_Flag?/:Dummy_Profile?', function (req, res) {
        try {
            var moment = require('moment');
            let User_ID = "";
            let Training_Start_Date = "";
            let Training_End_Date = "";
            let Name = "";
            let Certificate_Generated = "No";
            let POSP_Email = "";
            let PanCard_Number = "";
            let AadharCard_Number = "";
            let Examination_pass_date = "", Profile_Pic = "";
            let Mobile_Number = "";
            let User_Id = parseInt(req.params['User_Id']);
            let dummy_profile = req.params.Dummy_Profile ? req.params['Dummy_Profile'] : "";
            let Mail_Send_Flag = req.params.hasOwnProperty('Mail_Send_Flag') && req.params.Mail_Send_Flag ? req.params['Mail_Send_Flag'] : "Yes";
            if (!isNaN(User_Id)) {
                posp_user.find({"User_Id": User_Id}, function (err, dbresult) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        if (dbresult.length > 0) {
                            if (dbresult[0]._doc.Exam_Status === "Completed") {
                                let posp_data = dbresult[0]._doc;
                                User_ID = posp_data.User_Id;
                                Certificate_Generated = posp_data.Is_Certificate_Generated;
                                Mobile_Number = posp_data.hasOwnProperty('Mobile_Number') ? posp_data.Mobile_Number : "";
                                Name = posp_data.hasOwnProperty('Name_On_PAN') ? posp_data.Name_On_PAN : '________________';
                                POSP_Email = posp_data.hasOwnProperty('Email_Id') ? posp_data.Email_Id : "";
                                console.log("POSP EMAIL : " + POSP_Email);
                                PanCard_Number = posp_data.hasOwnProperty('Pan_No') ? posp_data.Pan_No : "";
                                AadharCard_Number = posp_data.hasOwnProperty('Aadhar') ? posp_data.Aadhar : "";
                                Training_Start_Date = moment.utc(posp_data.Training_Start_Date).format("YYYY-MM-DD");
                                Training_End_Date = moment.utc(posp_data.Training_End_Date).format("YYYY-MM-DD");
                                Examination_pass_date = moment.utc(posp_data.Exam_End_Date).format("YYYY-MM-DD");
                                var html_web_path_portal = config.environment.downloadurl + "/tmp/onboarding_certificates/" + User_Id + "/Certificate_" + User_Id + ".html";
                                var get_pdf_url = config.environment.downloadurl + "/onboarding/download/certificate/" + User_Id + "/Certificate_" + User_Id + ".pdf";//config.environment.pdf_url + html_web_path_portal;
                                if (Certificate_Generated === "No") {
                                    posp_doc_log.find({"User_Id": User_Id}, function (err, dbresult1) {
                                        if (err) {
                                            res.json({"Status": "Fail", "Msg": err});
                                        } else {
                                            if (dbresult1.length > 0) {
                                                for (let i in dbresult1) {
                                                    data = dbresult1[i]._doc;
                                                    if (data.Doc_Type === "PROFILE" && data.Doc_URL) {
                                                        Profile_Pic = dummy_profile ? "https://origin-cdnh.policyboss.com/website/UI22/images/icons/posp-dummy-icon.jpg" : data.Doc_URL;
                                                    }
                                                }
                                                if (Name && PanCard_Number && Profile_Pic) {
                                                    examResult.find({"User_Id": User_ID}, function (err, dbresult2) {
                                                        if (err) {
                                                            res.json({"Status": "Fail", "Msg": err});
                                                        } else {
                                                            if (dbresult2.length > 0) {

                                                                let exam_date = new Date(dbresult2[0]._doc.Modified_On);
                                                                if (!fs.existsSync(appRoot + "/tmp/onboarding_certificates/" + User_Id)) {
                                                                    fs.mkdirSync(appRoot + "/tmp/onboarding_certificates/" + User_Id);
                                                                }
                                                                let html_file_path = appRoot + "/resource/request_file/Certificate.html";
                                                                let htmlPol = fs.readFileSync(html_file_path, 'utf8');
                                                                let pdf_file_path = appRoot + "/tmp/onboarding_certificates/" + User_Id + "/Certificate_" + User_Id + ".pdf";
                                                                let pdf_file_attachment = pdf_file_path.replace(appRoot + "/tmp", "");
                                                                let html_pdf_file_path = appRoot + "/tmp/onboarding_certificates/" + User_Id + "/Certificate_" + User_Id + ".html";
                                                                var html_web_path_portal = config.environment.downloadurl + "/tmp/onboarding_certificates/" + User_Id + "/Certificate_" + User_Id + ".html";
                                                                let file_web_path_horizon = config.environment.downloadurl + "/onboarding/download/certificate/" + User_Id + "/Certificate_" + User_Id + ".pdf";
                                                                let objCertificate = {
                                                                    '___training_name___': 'General Insurance and Life Insurance (Thirty Hours)',
                                                                    '___posp_name___': Name,
                                                                    '___posp_aadhar_no___': AadharCard_Number,
                                                                    '___posp_pan_no___': PanCard_Number.toUpperCase(),
                                                                    '___training_start_date___': Training_Start_Date,
                                                                    '___training_end_date___': Training_End_Date,
                                                                    '___examination_pass_date___': Examination_pass_date,
                                                                    '___posp_img___': Profile_Pic ? Profile_Pic : ''
                                                                };
                                                                htmlPol = htmlPol.replaceJson(objCertificate);
                                                                htmlPol = htmlPol.replaceAll(/___(.*?)___/g, "");
                                                                var request_html_file = fs.writeFileSync(html_pdf_file_path, htmlPol);
                                                                try {
                                                                    var http = require('https');
                                                                    var get_pdf_url = config.environment.pdf_url + html_web_path_portal;
                                                                     var download_url = get_pdf_url;
                                                                    // var get_pdf_url = html_web_path_portal;
                                                                    var insurer_pdf_url = html_web_path_portal; //Local
                                                                    var file_horizon = fs.createWriteStream(pdf_file_path);
                                                                    var request_horizon = http.get(get_pdf_url, function (response) {
                                                                        get_pdf_url = file_horizon.path;
                                                                        response.pipe(file_horizon);
                                                                        console.error("Certificate::PDF URL" + file_horizon);
                                                                        console.error("PDF sucess");
                                                                        //post document update
                                                                        let args = {
                                                                            "Is_Certificate_Generated": "Yes",
                                                                            "Certification_Datetime": moment.utc(dbresult[0]._doc.Exam_End_Date, "YYYY-MM-DDTHH:mm:ss[Z]")._d
                                                                        };
                                                                        posp_user.update({'User_Id': User_Id}, {$set: args}, {runValidators: true}, function (err, numAffected) {
                                                                            if (err) {
                                                                                res.json({"Status": "Fail", "Msg": "Fail to update posp"});
                                                                            } else {
                                                                                if (Mail_Send_Flag === "Yes") {
                                                                                    let objModelEmail = new Email();
                                                                                    var email_data = '';
                                                                                    let objMail = {
                                                                                        '___posp_name___': Name,
                                                                                        '___short_url___': file_web_path_horizon
                                                                                    };
                                                                                    email_data = fs.readFileSync(appRoot + '/resource/request_file/Posp_Exam_Complete_Mail.html').toString();
                                                                                    email_data = email_data.replaceJson(objMail);
                                                                                    objModelEmail.send('pospcom@policyboss.com', POSP_Email, "[POSP-ONBOARDING] POSP EXAM PASS :: SSID-" + User_Id, email_data, '', config.environment.notification_email, 0, User_Id, pdf_file_attachment);
                                                                                    res.json({"Status": "Success", "Msg": "Certificate Generated.", "html_url": html_web_path_portal, "pdf_url": download_url});
                                                                                } else {
                                                                                    res.json({"Status": "Success", "Msg": "Certificate downloaded.", "html_url": html_web_path_portal, "pdf_url": download_url});
                                                                                }
                                                                            }
                                                                        });
                                                                    });
                                                                } catch (e) {
                                                                    console.error('PDF Exception', e);
                                                                }

                                                            } else {
                                                                res.json({"Status": "Fail", "Msg": "No record found in exam_result"});
                                                            }
                                                        }
                                                    });
                                                } else {
                                                    res.json({"Status": "Fail", "Msg": "Name/PanCard_Number/AadharCard_Number/Profile not found"});
                                                }

                                            } else {
                                                res.json({"Status": "Fail", "Msg": "Profile not found"});
                                            }
                                        }
                                    });
                                } else {
                                    res.json({"Status": "Success", "Msg": "Certificate downloaded.", "html_url": html_web_path_portal, "pdf_url": get_pdf_url});
                                }
                            } else {
                                res.json({"Status": "Fail", "Msg": "Exam Not attempted."});
                            }
                        } else {
                            res.json({"Status": "Fail", "Msg": "User Not Found."});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Invalid User_Id"});
            }
        } catch (ex) {
            console.error('Exception', 'get_training_section', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/generateCertificate/:User_Id/:Mail_Send_Flag?/:Dummy_Profile?', function (req, res) {
        try {
            var moment = require('moment');
            let User_ID = "";
            let Training_Start_Date = "";
            let Training_End_Date = "";
            let Name = "";
            let Certificate_Generated = "No";
            let POSP_Email = "";
            let PanCard_Number = "";
            let AadharCard_Number = "";
            let Examination_pass_date = "";
            let Mobile_Number = parseInt(req.params['Mobile_Number']);
            let User_Id = parseInt(req.params['User_Id']);
            let dummy_profile = req.params.Dummy_Profile ? req.params['Dummy_Profile'] : "";
            let Mail_Send_Flag = req.params.hasOwnProperty('Mail_Send_Flag') && req.params.Mail_Send_Flag ? req.params['Mail_Send_Flag'] : "Yes";
            if (!isNaN(User_Id)) {
                posp_user.find({"User_Id": User_Id}, function (err, dbresult) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        if (dbresult.length > 0) {
                            if (dbresult[0]._doc.Exam_Status === "Completed") {
                                User_ID = dbresult[0]._doc.User_Id;
                                Certificate_Generated = dbresult[0].Is_Certificate_Generated;
                                Mobile_Number = dbresult[0]._doc.Mobile_Number;
                                Training_Start_Date = moment.utc(dbresult[0]._doc.Training_Start_Date).format("YYYY-MM-DD");
                                Training_End_Date = moment.utc(dbresult[0]._doc.Training_End_Date).format("YYYY-MM-DD");
                                Examination_pass_date = moment.utc(dbresult[0]._doc.Exam_End_Date).format("YYYY-MM-DD");
                                var html_web_path_portal = config.environment.downloadurl + "/tmp/onboarding_certificates/" + User_Id + "/Certificate_" + User_Id + ".html";
                                var get_pdf_url = config.environment.downloadurl + "/onboarding/download/certificate/" + User_Id + "/Certificate_" + User_Id + ".pdf";//config.environment.pdf_url + html_web_path_portal;
                                if (Certificate_Generated === "No") {
                                    posp_document.find({"User_Id": User_Id}, function (err, dbresult1) {
                                        if (err) {
                                            res.json({"Status": "Fail", "Msg": err});
                                        } else {
                                            if (dbresult1.length > 0) {
                                                data = dbresult1[0]._doc;
                                                Name = data.Name_On_PanCard ? data.Name_On_PanCard : '________________';
                                                POSP_Email = data.Email ? data.Email : "";
                                                console.log("POSP EMAIL : " + POSP_Email);
                                                PanCard_Number = data.PanCard_Number;
                                                AadharCard_Number = data.AadharCard_Number;
                                                Profile_Pic = dummy_profile ? "https://origin-cdnh.policyboss.com/website/UI22/images/icons/posp-dummy-icon.jpg" : data.UploadedFiles.UploadedFiles.Profile_Photo;
                                                if (Name && PanCard_Number && Profile_Pic) {
                                                    examResult.find({"User_Id": User_ID}, function (err, dbresult2) {
                                                        if (err) {
                                                            res.json({"Status": "Fail", "Msg": err});
                                                        } else {
                                                            if (dbresult2.length > 0) {

                                                                let exam_date = new Date(dbresult2[0]._doc.Modified_On);
                                                                if (!fs.existsSync(appRoot + "/tmp/onboarding_certificates/" + User_Id)) {
                                                                    fs.mkdirSync(appRoot + "/tmp/onboarding_certificates/" + User_Id);
                                                                }
                                                                let html_file_path = appRoot + "/resource/request_file/Certificate.html";
                                                                let htmlPol = fs.readFileSync(html_file_path, 'utf8');
                                                                let pdf_file_path = appRoot + "/tmp/onboarding_certificates/" + User_Id + "/Certificate_" + User_Id + ".pdf";
                                                                let pdf_file_attachment = pdf_file_path.replace(appRoot + "/tmp", "");
                                                                let html_pdf_file_path = appRoot + "/tmp/onboarding_certificates/" + User_Id + "/Certificate_" + User_Id + ".html";
                                                                var html_web_path_portal = config.environment.downloadurl + "/tmp/onboarding_certificates/" + User_Id + "/Certificate_" + User_Id + ".html";
                                                                let file_web_path_horizon = config.environment.downloadurl + "/onboarding/download/certificate/" + User_Id + "/Certificate_" + User_Id + ".pdf";
                                                                let objCertificate = {
                                                                    '___training_name___': 'General Insurance and Life Insurance (Thirty Hours)',
                                                                    '___posp_name___': Name,
                                                                    '___posp_aadhar_no___': AadharCard_Number,
                                                                    '___posp_pan_no___': PanCard_Number.toUpperCase(),
                                                                    '___training_start_date___': Training_Start_Date,
                                                                    '___training_end_date___': Training_End_Date,
                                                                    '___examination_pass_date___': Examination_pass_date,
                                                                    '___posp_img___': Profile_Pic ? Profile_Pic : ''
                                                                };
                                                                htmlPol = htmlPol.replaceJson(objCertificate);
                                                                htmlPol = htmlPol.replaceAll(/___(.*?)___/g, "");
                                                                var request_html_file = fs.writeFileSync(html_pdf_file_path, htmlPol);
                                                                try {
                                                                    var http = require('https');
                                                                    var get_pdf_url = config.environment.pdf_url + html_web_path_portal;
                                                                     var download_url = get_pdf_url;
                                                                    var insurer_pdf_url = html_web_path_portal; //Local
                                                                    var file_horizon = fs.createWriteStream(pdf_file_path);
                                                                    var request_horizon = http.get(get_pdf_url, function (response) {
                                                                        get_pdf_url = file_horizon.path;
                                                                        response.pipe(file_horizon);
                                                                        console.error("Certificate::PDF URL" + file_horizon);
                                                                        console.error("PDF sucess");

                                                                        let args = {
                                                                            "Is_Certificate_Generated": "Yes",
                                                                            "Certification_Datetime": moment.utc(dbresult[0]._doc.Exam_End_Date, "YYYY-MM-DDTHH:mm:ss[Z]")._d
                                                                        };
                                                                        posp_user.update({'User_Id': User_Id}, {$set: args}, {runValidators: true}, function (err, numAffected) {
                                                                            if (err) {
                                                                                res.json({"Status": "Fail", "Msg": "Fail to update posp details"});
                                                                            } else {
                                                                                if (Mail_Send_Flag === "Yes") {
                                                                                    let objModelEmail = new Email();
                                                                                    var email_data = '';
                                                                                    let objMail = {
                                                                                        '___posp_name___': Name,
                                                                                        '___short_url___': file_web_path_horizon
                                                                                    };
                                                                                    email_data = fs.readFileSync(appRoot + '/resource/request_file/Posp_Exam_Complete_Mail.html').toString();
                                                                                    email_data = email_data.replaceJson(objMail);
                                                                                    objModelEmail.send('pospcom@policyboss.com', POSP_Email, "[POSP-ONBOARDING] POSP EXAM PASS :: SSID-" + User_Id, email_data, '', config.environment.notification_email, 0, User_Id, pdf_file_attachment);
                                                                                    res.json({"Status": "Success", "Msg": "Certificate Generated.", "html_url": html_web_path_portal, "pdf_url": download_url});
                                                                                } else {
                                                                                    res.json({"Status": "Success", "Msg": "Certificate downloaded.", "html_url": html_web_path_portal, "pdf_url": download_url});
                                                                                }
                                                                            }
                                                                        });
                                                                    });
                                                                } catch (e) {
                                                                    console.error('PDF Exception', e);
                                                                }

                                                            } else {
                                                                res.json({"Status": "Fail", "Msg": "Details not found."});
                                                            }
                                                        }
                                                    });
                                                } else {
                                                    res.json({"Status": "Fail", "Msg": "Document details not found."});
                                                }

                                            } else {
                                                res.json({"Status": "Fail", "Msg": "Details not found."});
                                            }
                                        }
                                    });
                                } else {
                                    res.json({"Status": "Success", "Msg": "Certificate downloaded.", "html_url": html_web_path_portal, "pdf_url": get_pdf_url});
                                }
                            } else {
                                res.json({"Status": "Fail", "Msg": "Exam Not attempted."});
                            }
                        } else {
                            res.json({"Status": "Fail", "Msg": "User Not Found."});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Invalid Mobile_Number."});
            }
        } catch (ex) {
            console.error('Exception', 'get_training_section', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.all('/onboarding/download/certificate/:folder/:file', function (req, res) {
        let urlpath = req.url;
        let folder = req.params.folder;
        let file = req.params.file;
        res.sendFile(path.join(appRoot + '/tmp/onboarding_certificates/' + folder + '/' + file));
    });
    app.post('/onboarding/posp_photos_upload', function (req, res) {
        req.body = JSON.parse(JSON.stringify(req.body));
        var objRequestCore = req.body;
        var Mobile_Number = objRequestCore.Mobile_Number;
        var User_Id = objRequestCore.User_Id;
        var path = appRoot + "/tmp/onboarding_docs/";
        var photo_file_name = "Profile_" + User_Id + '_.png';
        var img1 = decodeURIComponent(objRequestCore.img1);
        try {
            if (fs.existsSync(path + User_Id)) {
                photo_file_name = "Profile_" + User_Id + '_.png';
                var data = img1.replace(/^data:image\/\w+;base64,/, "");
                if (data === "") {
                    res.json({'msg': 'Something Went Wrong'});
                } else {
                    var buf = new Buffer(data, 'base64');
                    fs.writeFile(path + User_Id + '/' + photo_file_name, buf);
                    res.json({'msg': 'Success'});
                }
                //res.json({'msg': 'Success'});
            } else {
                fs.mkdirSync(path + User_Id);
                var data = img1.replace(/^data:image\/\w+;base64,/, "");
                if (data === "") {
                    res.json({'msg': 'Something Went Wrong'});
                } else {
                    var buf = new Buffer(data, 'base64');
                    fs.writeFile(path + User_Id + '/' + photo_file_name, buf);
                }
                //res.json({'msg': 'Success'});
            }
            //var pdf_web_path_horizon = "http://qa-horizon.policyboss.com:3000/" + "/onboarding/download/onboarding_docs" + Mobile_Number + "/" + photo_file_name;
            let objfile = {};
            let objdata = {'UploadedFiles': objfile};
            var pdf_web_path_horizon = config.environment.weburl + "/onboarding/download/onboarding_docs/" + User_Id + "/" + photo_file_name;
            posp_document.find({"User_Id": User_Id}, function (err, dbresult1) {
                if (err) {
                    res.json({"Status": "Fail", "Msg": err});
                } else {
                    if (dbresult1.length > 0) {
                        objdata.UploadedFiles = dbresult1[0]._doc["UploadedFiles"]["UploadedFiles"];
                        objdata.UploadedFiles["Profile_Photo"] = pdf_web_path_horizon;
                        posp_document.updateOne({"User_Id": User_Id, $set: {"UploadedFiles": objdata}}, function (err, nAffected) {
                            if (err) {
                                res.json({"Status": "Fail", "Msg": err});
                            } else {
                                res.json({'Status': 'Success'});
                            }
                        });
                    }
                }
            });
        } catch (err) {
            console.log(err);
            res.json({"Status": "Fail", "Msg": err});
        }
    });
    app.get('/onboarding/posp_photo/*', function (req, res) {
        var urlpath = req.url;
        urlpath = urlpath.toString().replace('onboarding/posp_photo', 'tmp/onboarding_docs');
        res.sendFile(path.join(appRoot + urlpath));
    });
    app.post('/onboarding/api_verification', function (req, res) {
        try {
            let Client = require('node-rest-client').Client;
            let client = new Client();
            let form = new formidable.IncomingForm();
            var User_Id = "", Mobile_Number = "";
            let files_list = [];
            let url = "";
            let posp_doc_name_obj = {"AADHAAR": "AadharCard_Front","AADHAAR_BACK":"AadharCard_Back", "PAN": "PanCard", "QUALIFICATION": "Educational_Certificate", "POSP_ACC_DOC": "POSP_Cancel_Cheque", "NOMINEE_PAN_DOC": "Nominee_Pan_Card", "NOMINEE_ACC_DOC": "Nominee_Cancel_Cheque", "PROFILE": "Profile_Photo"};
            form.parse(req, function (err, fields, files) {
                var docType = fields['DocType'];
                if (["PAN", "AADHAAR", "NOMINEE_PAN_DOC"].includes(docType)) {
                    url = "/onboarding/OCR_verification";
                } else if (docType === 'PROFILE') {
                    url = "/onboarding/profile_verification";
                } else if (["POSP_ACC_DOC", "NOMINEE_ACC_DOC"].includes(docType)) {
                    url = "/onboarding/bank_account_verification";
                }
                User_Id = fields.User_Id ? fields['User_Id'] : 0;
                if (User_Id) {
                     var path = appRoot + "/tmp/onboarding_docs/" + User_Id;
                    //handle bitmap 
                    if (fields.hasOwnProperty('Profile_Live_Photo')) {
                        var photo_file_name = "", Field_Name = "Profile_Live_Photo";
                        photo_file_name = "Profile_" + User_Id + '.png';
                        var img1 = decodeURIComponent(fields[Field_Name]);
                        if (!fs.existsSync(path)) {
                            fs.mkdirSync(path);
                        }
                        var data = img1.replace(/^data:image\/\w+;base64,/, "");
                        if (data === "") {
                            res.json({'Status': "Fail", 'Msg': "Data is empty", "data": err});
                        } else {
                            var buf = new Buffer(data, 'base64');
                            fs.writeFileSync(path + '/' + photo_file_name, buf);
                        }
                        files_list.push(fs.readFileSync(path  + '/' + photo_file_name, {encoding: 'base64'}));
                    }
                    //handle files
                    var files = files;
                    let fsdata = [];
                    if (JSON.stringify(files) !== "{}") {
                        if (!fs.existsSync(appRoot + "/tmp/onboarding_docs/" + User_Id)) {
                            fs.mkdirSync(appRoot + "/tmp/onboarding_docs/" + User_Id);
                        }
                        for (let i in files) {
                            let file_name = files[i].name.split('.')[0].replace(/ /g, '') + "." + files[i].name.split('.')[1];
                            let file_ext = files[i].name.split('.')[1];
                            if (docType === 'PROFILE') {
                                file_name = "Profile_" + User_Id + "." + file_ext;
                            }

                            if (file_name === 'blob.undefined') {
                                file_name = i + "_" + User_Id + ".jpeg";
                            }
                            let file_sys_loc_horizon = appRoot + "/tmp/onboarding_docs/" + User_Id + "/" + file_name;
                            fsdata.push(file_sys_loc_horizon);
                            let oldpath = files[i].path;
                            //let oldpath =  appRoot + "/tmp/onboarding_docs/" + User_Id + "/" + files[i].name.replace(/\s/g, '');
                            let reda_data = fs.readFileSync(oldpath, {});
                            // Write the file
                            fs.writeFileSync(file_sys_loc_horizon, reda_data, {});
                            files_list.push(fs.readFileSync(file_sys_loc_horizon, {encoding: 'base64'}));
                            // Delete the file
                            /*fs.unlink(oldpath_temp, function (err) {
                                if (err)
                                    res.send({'Status': "Failure", 'Msg': 'Error in deleting a file.', 'Error': err});
                            });*/
                            fs.unlink(oldpath, function (err) {
                                if (err)
                                    res.send({'Status': "Failure", 'Msg': 'Error in deleting a file.', 'Error': err});
                            });
                        }
                    }
                    if (fields.hasOwnProperty(posp_doc_name_obj[docType])) {
                        let android_file_name = fields[posp_doc_name_obj[docType]];
                        let file_ext = android_file_name.split('.')[1];
                        if (docType === 'PROFILE') {
                            android_file_name = "Profile_" + User_Id + "." + file_ext;
                        }
                        let file_sys_loc_horizon = appRoot + "/tmp/onboarding_docs/" + User_Id + "/" + android_file_name;
                        fsdata.push(file_sys_loc_horizon);
                        files_list.push(fs.readFileSync(file_sys_loc_horizon, {encoding: 'base64'}));
                        if (docType === "AADHAAR") {
                            let android_file_name = fields[posp_doc_name_obj["AADHAAR_BACK"]];
                            let file_sys_loc_horizon_a = appRoot + "/tmp/onboarding_docs/" + User_Id + "/" + android_file_name;
                            fsdata.push(file_sys_loc_horizon_a);
                            files_list.push(fs.readFileSync(file_sys_loc_horizon_a, {encoding: 'base64'}));
                    }
                    }
                    let args = {
                        data: {
                            'files': files_list,
                            'doc_type': docType,
                            'User_Id': User_Id
                        },
                        headers: {
                            "Content-Type": "application/json"
                        }
                    };
                    client.post(config.environment.weburl + url, args, function (data, response) {
                        res.send(data);
                    });
                } else {
                    res.json({"Status": "Fail", "Msg": "User_Id not found"});
                }
            });
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": "Exception in API verification", "Error": ex.stack});
        }
    });
    app.post('/onboarding/update_doc_zoopstatus', function (req, res) {
        req.body = JSON.parse(JSON.stringify(req.body));
        var objRequestCore = req.body;
        var Mobile_Number = objRequestCore.Mobile_Number;
        var User_Id = objRequestCore.User_Id;
        var zoop_status = objRequestCore.Is_Zoop_Verified;
        var doc_type = objRequestCore.Doc_Type;
        try {
            posp_doc_log.find({'User_Id': User_Id, 'Doc_Type': doc_type}, function (err, dbresult) {
                if (err) {
                    res.json({"Status": "Fail", "Msg": err});
                } else {
                    if (dbresult && dbresult.length > 0) {
                        let data = dbresult[0]._doc;
                        args = {
                            "Is_Zoop_Verified": zoop_status,
                            "Doc_Type": doc_type,
                            "Status": zoop_status === "Yes" ? "Verified" : "Invalid"
                        };
                        posp_doc_log.updateOne({'User_Id': User_Id, 'Doc_Type': doc_type}, {$set: args}, function (err, numAffected) {
                            if (err) {
                                res.json({"Status": "Fail", "Msg": "Status Not Updated.", "data": err});
                            } else {
                                if (numAffected && numAffected.nModified === 1) {

                                    //update zoop status in posp_user collection.
                                    posp_doc_log.find({'User_Id': User_Id}, function (err, dbdoc) {
                                        if (err) {
                                            res.json({"Status": "Fail", "Msg": err});
                                        } else {
                                            let countStatus = 0;
                                            if (dbdoc && dbdoc.length > 0) {
                                                for (let i = 0; i < dbdoc.length; i++) {
                                                    data = dbdoc[i]._doc;
                                                    if ((data['Doc_Type'] === 'Pan Card' && data['Is_Zoop_Verified'] === 'Yes') || (data['Doc_Type'] === 'Aadhar Card' && data['Is_Zoop_Verified'] === 'Yes')) {
                                                        countStatus++;
                                                    }
                                                }
                                                if (countStatus === 2) {
                                                    posp_user.updateOne({'User_Id': User_Id}, {$set: {'Zoop_Verified': 'Yes'}}, function (err, dbres) {
                                                        if (err)
                                                            throw err;
                                                    });
                                                }
                                            }
                                            res.json({"Status": "Success", "Msg": "Zoop Status Updated."});
                                        }
                                    });
                                } else {
                                    res.json({"Status": "Success", "Msg": "Zoop Status Updated."});
                                }
                            }
                        });
                    } else {
                        args = {
                            "User_Id": User_Id,
                            "Mobile_Number": Mobile_Number,
                            "Approver_Ss_Id": "",
                            "Verifier_Ss_Id": "",
                            "Verified_On_Date": "",
                            "Approved_On_Date": "",
                            "Fba_Id": "",
                            "Is_Zoop_Verified": zoop_status,
                            "Doc_Type": doc_type,
                            "Status": "Pending",
                            "Remark": ""
                        };
                        posp_doc_logObj = new posp_doc_log(args);
                        posp_doc_logObj.save(function (err, dbres) {
                            if (err) {
                                res.json({"Status": "Fail", "Msg": "Status Not Updated.", "data": err});
                            } else {
                                posp_doc_log.find({'User_Id': User_Id}, function (err, dbdoc) {
                                    if (err) {
                                        res.json({"Status": "Fail", "Msg": err});
                                    } else {
                                        let countStatus = 0;
                                        if (dbdoc && dbdoc.length > 0) {
                                            for (let i = 0; i < dbdoc.length; i++) {
                                                data = dbdoc[i]._doc;
                                                if ((data['Doc_Type'] === 'Pan Card' && data['Is_Zoop_Verified'] === 'Yes') || (data['Doc_Type'] === 'Aadhar Card' && data['Is_Zoop_Verified'] === 'Yes')) {
                                                    countStatus++;
                                                }
                                            }
                                            if (countStatus === 2) {
                                                posp_user.updateOne({'User_Id': User_Id}, {$set: {'Zoop_Verified': 'Yes'}}, function (err, dbres) {
                                                    if (err)
                                                        throw err;
                                                });
                                            }
                                        }
                                        res.json({"Status": "Success", "Msg": "Status updated.", "data": dbres});
                                    }
                                });
                                //res.json({"Status": "Success", "Msg": "Status updated.", "data": dbres});
                            }
                        });
                    }
                }

            });
        } catch (err) {
            console.log(err);
            res.json({"Status": "Fail", "Msg": err});
        }
    });
    app.post('/onboarding/OCR_verification', function (req, res) {
        try {
            let User_Id = req.body['User_Id'];
            let files_list = req.body['files'];
            let docType = req.body['doc_type'];
            var org_docType = docType;
            let zoop_url = "https://live.zoop.one/api/v1/in/utility/ocr/lite";
            let card_front_img = "";
            if (docType === "NOMINEE_PAN_DOC") {
                org_docType = "NOMINEE-PAN";
                docType = "PAN";
            }
            let data_req = {
                "data": {
                    "card_type": docType,
                    "consent": "Y",
                    "consent_text": "I hear by declare my consent agreement for fetching my information via ZOOP API."
                }
            };
            if (docType === "AADHAAR") {
                card_front_img = files_list[0];
                card_back_img = files_list[1];
                data_req['data']['card_front_image'] = card_front_img;
                data_req['data']['card_back_image'] = card_back_img;
            } else if (docType === "PAN") {
                card_front_img = files_list[0];
                data_req['data']['card_front_image'] = card_front_img;
            }
            zoop_doc_args["data"] = data_req;
            let api_log_args = {
                data: {
                    'User_Id': User_Id,
                    'Doc_Type': org_docType,
                    'Api_Url': zoop_url,
                    'Api_Request': {}
                },
                headers: {
                    "Content-Type": "application/json"
                }
            };
            client.post(zoop_url, zoop_doc_args, function (zoopdata, zoopresponse) {
                if (zoopdata && zoopdata["result"]) {
                    api_log_args["data"]["Status"] = "Success";
                } else {
                    api_log_args["data"]["Status"] = "Fail";
                }
                api_log_args["data"]["Api_Response"] = zoopdata;
                client.post(config.environment.weburl + '/onboarding/update_api_log', api_log_args, function (update_api_log_data, update_api_log_res) {
                    if (update_api_log_data.Status === "Success") {
                        res.json({Status: api_log_args["data"]["Status"], data: zoopdata});
                    } else {
                        res.json({Status: api_log_args["data"]["Status"], data: zoopdata});
                    }
                });
            });
        } catch (ex) {
            return res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/profile_verification', function (req, res) {
        try {
            let User_Id = req.body['User_Id'];
            let files_list = req.body['files'];
            docType = req.body['doc_type'];
            console.log("doc type : " + docType);
            let zoop_url = "https://live.zoop.one/api/v1/in/ml/face/crop";
            let card_front_img = "";
            let data_req = {
                "mode": "sync",
                "data": {
                    "consent": "Y",
                    "consent_text": "I hear by declare my consent agreement for fetching my information via ZOOP API."
                }
            };
            card_front_img = files_list[0];
            data_req['data']['card_image'] = card_front_img;
            zoop_doc_args["data"] = data_req;
            let api_log_args = {
                data: {
                    'User_Id': User_Id,
                    'Doc_Type': docType,
                    'Api_Url': zoop_url,
                    'Api_Request': {}
                },
                headers: {
                    "Content-Type": "application/json"
                }
            };
            try {
                client.post(zoop_url, zoop_doc_args, function (zoopdata, zoopresponse) {
                    if (zoopdata && zoopdata["result"]) {
                        api_log_args["data"]["Status"] = "Success";
                    } else {
                        api_log_args["data"]["Status"] = "Fail";
                    }
                    api_log_args["data"]["Api_Response"] = zoopdata;
                    client.post(config.environment.weburl + '/onboarding/update_api_log', api_log_args, function (update_api_log_data, update_api_log_res) {
                        if (update_api_log_data.Status === "Success") {
                            res.json({Status: api_log_args["data"]["Status"], data: zoopdata});
                        } else {
                            res.json({Status: api_log_args["data"]["Status"], data: zoopdata});
                        }
                    });
                });
            } catch (ex) {
                return res.json({"Status": "Fail", "Msg": "Error in profile API Verification", "Error": ex.stack});
            }
        } catch (ex) {
            return res.json({"Status": "Fail", "Msg": "Error in profile verification", "Error": ex.stack});
        }
    });
    app.post('/onboarding/bank_account_verification', function (req, res) {
        try {
            let User_Id = req.body['User_Id'];
            let files_list = req.body['files'];
            docType = req.body['doc_type'] === "POSP_ACC_DOC" ? "POSP-BANK-ACC" : "NOMINEE-BANK-ACC";
            console.log("doc type : " + docType);
            let zoop_url = "https://live.zoop.one/api/v1/in/utility/ocr/cheque";
            let card_front_img = "";
            let data_req = {
                "mode": "sync",
                "data": {
                    "consent": "Y",
                    "consent_text": "Approve the values here"
                }
            };
            card_front_img = files_list[0];
            data_req['data']['cheque_image'] = card_front_img;
            zoop_doc_args["data"] = data_req;
            let api_log_args = {
                data: {
                    'User_Id': User_Id,
                    'Doc_Type': docType,
                    'Api_Url': zoop_url,
                    'Sub_Type': "OCR",
                    'Api_Request': {}
                },
                headers: {
                    "Content-Type": "application/json"
                }
            };
            try {
                client.post(zoop_url, zoop_doc_args, function (zoopdata, zoopresponse) {
                    if (zoopdata && zoopdata["result"]) {
                        api_log_args["data"]["Status"] = "Success";
                    } else {
                        api_log_args["data"]["Status"] = "Fail";
                    }
                    api_log_args["data"]["Api_Response"] = zoopdata;
                    client.post(config.environment.weburl + '/onboarding/update_api_log', api_log_args, function (update_api_log_data, update_api_log_res) {
                        if (update_api_log_data.Status === "Success") {
                            res.json({Status: api_log_args["data"]["Status"], data: zoopdata});
                        } else {
                            res.json({Status: api_log_args["data"]["Status"], data: zoopdata});
                        }
                    });
                });
            } catch (ex) {
                return res.json({"Status": "Exception", "Error": ex.stack});
            }
        } catch (ex) {
            return res.json({"Status": "Fail", "Msg": "Error in bank account OCR verification", "Error": ex.stack});
        }
    });
    app.get('/onboarding/create_onboarding_documents', (req, res) => {
        try {
            let posp_doc = {};
            let Mobile_Number = req.query["Mobile_Number"] ? req.query["Mobile_Number"] : '';
            let User_Id = req.query["User_Id"] ? req.query["User_Id"] : '';
            if (User_Id !== '') {
                posp_document.find({"User_Id": User_Id}, function (err, dbresults) {
                    if (err) {
                        res.json({"Status": "Failure", "Msg": "Something went wrong", "data": err});
                    } else if (dbresults.length > 0) {
                        res.json({'Status': 'Success', 'Msg': 'Document already exist.'});
                    } else {
                        posp_doc['User_Id'] = User_Id;
                        posp_doc['Mobile_Number'] = Mobile_Number;
                        let posp_documentObj = new posp_document(posp_doc);
                        posp_documentObj.save(function (err, data) {
                            if (err) {
                                res.json({"Status": "Fail", "Msg": err});
                            } else {
                                res.json({'Status': 'Success', 'Msg': 'Document entry created successfully.'});
                            }
                        });
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "User doesn't exist."});
            }
        } catch (ex) {
            return res.json({"Status": "Failue", "Msg": "Exception in creating documents", "Error": ex.stack});
        }
    });
    app.post("/onboarding/update_api_log_old", function (req, res) {
        try {
            console.error("Nilam POSP Check update_api_log LINE 1", req.body);
            req.body = JSON.parse(JSON.stringify(req.body));
            console.error("Nilam POSP Check update_api_log LINE 2", req.body);
            var User_Id = req.body.User_Id ? parseInt(req.body.User_Id) : '';
            var Doc_Type = req.body.Doc_Type ? req.body.Doc_Type : '';
            var Status = req.body.Status ? req.body.Status.toUpperCase() : '';
            var Api_Request = req.body.Api_Request ? req.body.Api_Request : '';
            var Api_Response = req.body.Api_Response ? req.body.Api_Response : '';
            var Api_Url = req.body.Api_Url ? req.body.Api_Url : '';
            var Sub_Type = req.body.Sub_Type ? req.body.Sub_Type : '';
            console.log("req.body.Sub_Type : " + req.body.Sub_Type);
            console.log("Sub_Type : " + Sub_Type);
            if (User_Id !== "" && Doc_Type !== "") {

                let  args = {
                    "User_Id": User_Id,
                    "Doc_Type": Doc_Type,
                    "Api_Url": Api_Url,
                    "Api_Request": Api_Request,
                    "Api_Response": Api_Response,
                    "Status": Status

                };
                console.error("Nilam POSP Check update_api_log LINE 3", args);
                let posp_api_logObj = new posp_api_log(args);
                posp_api_logObj.save(function (err, dbres2) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": "Error in saving API details.", "data": err});
                    } else {
                        //send mail
                        console.error("Nilam POSP Check update_api_log LINE 4");
                        try {
                            let mail_sub = Sub_Type ? "[POSP-ONBOARDING] " + Doc_Type + "-" + Sub_Type + "-VERIFICATION-" + Status + " : : SSID-" + User_Id : "[POSP-ONBOARDING] " + Doc_Type + "-VERIFICATION-" + Status + " : : SSID-" + User_Id;
                            let objModelEmail = new Email();
                            var email_data = '';
                            let objMail = {
                                '___Api_Log_Id___': dbres2._doc.Api_Log_Id,
                                '___Ss_Id___': User_Id,
                                '___Doc_Type___': Doc_Type,
                                '___Api_Url___': Api_Url,
                                '___Status___': Status,
                                '___Api_Response___': JSON.stringify(Api_Response),
                                '___Api_Request___': JSON.stringify(Api_Request),
                                '___Created_On___': moment()

                            };
                            let sendTo = config.environment.notification_email;
//                            let arrCC = ["anuj.singh@policyboss.com", "ashish.hatia@policyboss.com"];
                            email_data = fs.readFileSync(appRoot + '/resource/request_file/Posp_API_Log_Mail.html').toString();
                            email_data = email_data.replaceJson(objMail);
                            // objModelEmail.send('pospcom@policyboss.com', sendTo, mail_sub, email_data, arrCC.join(','), '', '');
                            objModelEmail.send('pospcom@policyboss.com', sendTo, mail_sub, email_data, '', '', '');
                            console.error("Nilam POSP Check update_api_log LINE 5");
                            res.json({"Status": "Success", "Msg": "API log saved"});
                        } catch (e) {
                            res.json({"Status": "Fail to send mail update_api_log LINE 6", "Msg": e.stack});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "User_Id or Doc_Type not found."});
            }

        } catch (ex) {
            res.json({"Status": "Failure", "Msg": "Error in saving API details", "Error": ex.stack});
        }
    });
    app.post("/onboarding/update_api_log", function (req, res) {
        try {
            console.error("Nilam POSP Check update_api_log LINE 1", req.body);
            req.body = JSON.parse(JSON.stringify(req.body));
            console.error("Nilam POSP Check update_api_log LINE 2", req.body);
            let User_Id = req.body.User_Id ? parseInt(req.body.User_Id) : '';
            let Doc_Type = req.body.Doc_Type ? req.body.Doc_Type : '';
            let Status = req.body.Status ? req.body.Status.toUpperCase() : '';
            let Api_Request = req.body.Api_Request ? req.body.Api_Request : '';
            let Api_Response = req.body.Api_Response ? req.body.Api_Response : '';
            let Api_Url = req.body.Api_Url ? req.body.Api_Url : '';
            let Sub_Type = req.body.Sub_Type ? req.body.Sub_Type : '';
            let Name_On_PAN = req.body.Name_On_PAN ? req.body.Name_On_PAN : '';
            let Linked_Aadhaar = req.body.Linked_Aadhaar ? req.body.Linked_Aadhaar : '';
            let Masked_Aadhaar = req.body.Masked_Aadhaar ? req.body.Masked_Aadhaar : '';          
            let DOB = req.body.DOB ? req.body.DOB : '';
            let Pan_Number = req.body.Pan_Number ? req.body.Pan_Number : '';
            let Send_Mail = req.body.Send_Mail ? req.body.Send_Mail : 'Yes';
            console.log("req.body.Sub_Type : " + req.body.Sub_Type);
            console.log("Sub_Type : " + Sub_Type);
            if (User_Id !== "" && Doc_Type !== "") {
                let  args = {
                    "User_Id": User_Id,
                    "Doc_Type": Doc_Type,
                    "Api_Url": Api_Url,
                    "Api_Request": Api_Request,
                    "Api_Response": Api_Response,
                    "Status": Status

                };

                if (Doc_Type === "PAN") {
                    args["Name_On_PAN"] = Name_On_PAN;
                    args["Linked_Aadhaar"] = Linked_Aadhaar;
                    args["DOB"] = DOB;
                    args["Masked_Aadhaar"] = Masked_Aadhaar;
                    args["Pan_Number"] = Pan_Number;
                }
                console.error("Nilam POSP Check update_api_log LINE 3", args);
                let posp_api_logObj = new posp_api_log(args);
                posp_api_logObj.save(function (err, dbres2) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": "Error in saving API details.", "data": err});
                    } else {
                        //send mail
                        console.error("Nilam POSP Check update_api_log LINE 4");
                        try {
                            if (Send_Mail === "Yes") {
                                let mail_sub = Sub_Type ? "[POSP-ONBOARDING] " + Doc_Type + "-" + Sub_Type + "-VERIFICATION-" + Status + " : : SSID-" + User_Id : "[POSP-ONBOARDING] " + Doc_Type + "-VERIFICATION-" + Status + " : : SSID-" + User_Id;
                                let objModelEmail = new Email();
                                var email_data = '';
                                let objMail = {
                                    '___Api_Log_Id___': dbres2._doc.Api_Log_Id,
                                    '___Ss_Id___': User_Id,
                                    '___Doc_Type___': Doc_Type,
                                    '___Api_Url___': Api_Url,
                                    '___Status___': Status,
                                    '___Api_Response___': JSON.stringify(Api_Response),
                                    '___Api_Request___': JSON.stringify(Api_Request),
                                    '___Created_On___': moment()

                                };
                                let sendTo = config.environment.notification_email;
//                            let arrCC = ["anuj.singh@policyboss.com", "ashish.hatia@policyboss.com"];
                                email_data = fs.readFileSync(appRoot + '/resource/request_file/Posp_API_Log_Mail.html').toString();
                                email_data = email_data.replaceJson(objMail);
                                // objModelEmail.send('pospcom@policyboss.com', sendTo, mail_sub, email_data, arrCC.join(','), '', '');
                                objModelEmail.send('pospcom@policyboss.com', sendTo, mail_sub, email_data, '', '', '');
                            } 
                                console.error("Nilam POSP Check update_api_log LINE 5");
                                res.json({"Status": "Success", "Msg": "API log saved"});
                            
                        } catch (e) {
                            res.json({"Status": "Fail to send mail update_api_log LINE 6", "Msg": e.stack});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "User_Id or Doc_Type not found."});
            }

        } catch (ex) {
            res.json({"Status": "Failure", "Msg": "Error in saving API details", "Error": ex.stack});
        }
    });
    app.post("/onboarding/zoop_pan_lite_verification_test", function (req, res) {
        try {
            req.body = JSON.parse(JSON.stringify(req.body));
            let Pan_Number = req.body.Pan_Number ? (req.body.Pan_Number).toString() : "";
            if (Pan_Number) {
                let zoop_url = "https://live.zoop.one/api/v1/in/identity/pan/lite";
                let api_key = "4RNA4S6-XWKM659-G7BR4MY-SHHTHHR";
                let api_appid = "61d8162ba81661001db34ab9";
                let zoop_doc_args = {
                    data: {"data": {
                            "customer_pan_number": Pan_Number,
                            "consent": "Y",
                            "consent_text": "I hear by declare my consent agreement for fetching my information via ZOOP API."
                        }},
                    headers: {
                        'Content-Type': 'application/json',
                        "api-key": api_key,
                        "app-id": api_appid
                    }
                };
                console.error("zoop_pan_verification Line 1");
                client.post(zoop_url, zoop_doc_args, function (zoopdata, zoopresponse) {
                    return res.send(zoopdata);
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Pan is Mandatory"});
            }
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post("/onboarding/zoop_pan_verification", function (req, res) {
        try {
            req.body = JSON.parse(JSON.stringify(req.body));
            var User_Id = req.body.User_Id;
            var Pan_Number = (req.body.Pan_Number).toString();
            var docType = req.body.Doc_Type ? req.body.Doc_Type : "";
            //let zoop_url = "https://live.zoop.one/api/v1/in/identity/pan/lite";
            let zoop_url = "https://live.zoop.one/api/v1/in/identity/pan/pro";
            let api_key = "4RNA4S6-XWKM659-G7BR4MY-SHHTHHR";
            let api_appid = "61d8162ba81661001db34ab9";
            let zoop_doc_args = {
                data: {
                    "mode": "sync",
                    "data": {
                        "customer_pan_number": Pan_Number,
                        "consent": "Y",
                        "consent_text": "I hear by declare my consent agreement for fetching my information via ZOOP API."
                    }},
                headers: {
                    'Content-Type': 'application/json',
                    "api-key": api_key,
                    "app-id": api_appid
                }
            };
            let api_log_args = {
                data: {
                    'User_Id': User_Id,
                    'Doc_Type': docType,
                    'Api_Url': zoop_url,
                    'Api_Request': zoop_doc_args
                },
                headers: {
                    "Content-Type": "application/json"
                }
            };
            console.error("zoop_pan_verification Line 1");
            client.post(zoop_url, zoop_doc_args, function (zoopdata, zoopresponse) {
                console.error("zoop_pan_verification Line 2", zoopdata);
                if (zoopdata && zoopdata["result"]) {
                    api_log_args["data"]["Status"] = "Success";
                    api_log_args["data"]["Name_On_PAN"] = zoopdata["result"]["user_full_name"] || "";
                    api_log_args["data"]["Linked_Aadhaar"] = zoopdata["result"]["aadhaar_linked_status"] || "";
                    api_log_args["data"]["DOB"] = zoopdata["result"]["user_dob"] || "";
                    api_log_args["data"]["Masked_Aadhaar"] = zoopdata["result"]["masked_aadhaar"] || "";
                } else {
                    api_log_args["data"]["Status"] = "Fail";
                }
                api_log_args["data"]["Api_Response"] = zoopdata;
                //res.json({Status: api_log_args["data"]["Status"], data: zoopdata});
                client.post(config.environment.weburl + '/onboarding/update_api_log', api_log_args, function (update_api_log_data, update_api_log_res) {
                    console.error("zoop_pan_verification Line 3", update_api_log_data);
                    if (update_api_log_data.Status === "Success") {
                        res.json({Status: api_log_args["data"]["Status"], data: zoopdata});
                    } else {
                        res.json({Status: api_log_args["data"]["Status"], data: zoopdata});
                    }
                });
            });
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post("/onboarding/bank_details_verification", function (req, res) {
        try {
            var User_Id = req.body.User_Id;
            var Account_Number = (req.body.Account_Number).toString();
            var Ifsc_Code = req.body.Ifsc_Code;
            var docType = req.body['docType'] === "POSP_ACC_DOC" ? "POSP-BANK-ACC" : "NOMINEE-BANK-ACC";
            let zoop_url = "https://live.zoop.one/api/v1/in/financial/bav/lite";
            let data_req = {
                "data": {
                    "account_number": Account_Number,
                    "ifsc": Ifsc_Code,
                    "consent": "Y",
                    "consent_text": "I hear by declare my consent agreement for fetching my information via ZOOP API."
                }
            };
            zoop_doc_args["data"] = data_req;
            let api_log_args = {
                data: {
                    'User_Id': User_Id,
                    'Doc_Type': docType,
                    'Api_Url': zoop_url,
                    'Api_Request': zoop_doc_args
                },
                headers: {
                    "Content-Type": "application/json"
                }
            };
            client.post(zoop_url, zoop_doc_args, function (zoopdata, zoopresponse) {
                if (zoopdata && zoopdata["result"]) {
                    api_log_args["data"]["Status"] = "Success";
                } else {
                    api_log_args["data"]["Status"] = "Fail";
                }
                api_log_args["data"]["Api_Response"] = zoopdata;
                client.post(config.environment.weburl + '/onboarding/update_api_log', api_log_args, function (update_api_log_data, update_api_log_res) {
                    if (update_api_log_data.Status === "Success") {
                        res.json({Status: api_log_args["data"]["Status"], data: zoopdata});
                    } else {
                        res.json({Status: api_log_args["data"]["Status"], data: zoopdata});
                    }
                });
            });
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post("/onboarding/zoop_aadhaar_verification", function (req, res) {
        try {
            var User_Id = req.body.User_Id;
            var Aadhaar_Number = req.body.Aadhaar_Number;
            Aadhaar_Number = Aadhaar_Number.toString();
            var docType = "AADHAAR";
            let zoop_url = "https://live.zoop.one/api/v1/in/identity/aadhaar/verification";
            let data_req = {
                "data": {
                    "customer_aadhaar_number": Aadhaar_Number,
                    "consent": "Y",
                    "consent_text": "I hear by declare my consent agreement for fetching my information via ZOOP API."
                }
            };
            zoop_doc_args["data"] = data_req;
            let api_log_args = {
                data: {
                    'User_Id': User_Id,
                    'Doc_Type': docType,
                    'Api_Url': zoop_url,
                    'Api_Request': zoop_doc_args
                },
                headers: {
                    "Content-Type": "application/json"
                }
            };
            client.post(zoop_url, zoop_doc_args, function (zoopdata, zoopresponse) {
                if (zoopdata && zoopdata["result"]) {
                    api_log_args["data"]["Status"] = "Success";
                } else {
                    api_log_args["data"]["Status"] = "Fail";
                }
                api_log_args["data"]["Api_Response"] = zoopdata;
                client.post(config.environment.weburl + '/onboarding/update_api_log', api_log_args, function (update_api_log_data, update_api_log_res) {
                    if (update_api_log_data.Status === "Success") {
                        res.json({Status: api_log_args["data"]["Status"], data: zoopdata});
                    } else {
                        res.json({Status: api_log_args["data"]["Status"], data: zoopdata});
                    }
                });
            });
        } catch (ex) {
            res.json({"Status": "Fail", "Err": ex.stack});
        }
    });
    app.get('/onboarding/send_verify_req_mail_NIU', function (req, res) {
        try {
            let queryObj = req.query;
            let ss_id = queryObj.ss_id ? (queryObj.ss_id - 0) : "";
            let cc_arr = [], bcc_arr = [config.environment.notification_email];
            if (ss_id) {
				//client.get(config.environment.weburl + '/posps/report/sync_signup_inquiry?ss_id=' + ss_id , {}, function (sync_signup_data, sync_signup_response) {});
                posp_user.findOne({"User_Id": ss_id}, function (posp_user_err, posp_user_res) {
                    if (posp_user_err) {
                        res.json({'Status': 'Fail', 'Msg': posp_user_err});
                    } else {
                        if (posp_user_res) {
                            let posp_data = posp_user_res['_doc'];
                            ;
                            let fba_id = posp_data.Fba_Id ? posp_data.Fba_Id : 0;
                            let posp_name = posp_data.Middle_Name ? (posp_data.First_Name + " " + posp_data.Middle_Name + " " + posp_data.Last_Name)
                                    : (posp_data.First_Name + " " + (posp_data.Last_Name ? posp_data.Last_Name : ""));
                            let rm_name = posp_data.Reporting_Agent_Name ? posp_data.Reporting_Agent_Name : "";
                            let rm_uid = posp_data.Reporting_Agent_Uid ? posp_data.Reporting_Agent_Uid : "";
                            let uid = rm_uid ? "( UID : " + rm_uid + " )" : "";
                            let rm_email = posp_data.Reporting_Email_ID && posp_data.Reporting_Email_ID !== "NA" ? posp_data.Reporting_Email_ID : "";
                            let rm_city = posp_data.Agent_City ? posp_data.Agent_City : "";
                            let signup_date1 = moment(posp_data.Created_On).format('YYYY-MM-DD');
                            let signup_date = moment(posp_data.Created_On).format('DD-MMM-YYYY');
                            let todayDate = moment().format('YYYY-MM-DD');
                            let no_of_days = moment(todayDate).diff(moment(signup_date1), 'days');
                            console.log("no_of_days : " + no_of_days);
                            rm_email ? cc_arr.push(rm_email) : "";
                            let objModelEmail = new Email();
                            let send_to = "sandeep.nair@landmarkinsurance.in,posp.ops@policyboss.com";
                            //let send_to = "nilam.bhagde@policyboss.com";
                            var email_data = '';
                            let objMail = {
                                '___ssid___': ss_id,
                                '___posp_name___': posp_name,
                                '___rm_name___': rm_name + "" + uid,
                                '___rm_city___': rm_city,
                                '___signup_date___': signup_date,
                                '___days___': no_of_days,
                                "___Name_On_PAN___": (posp_data.Name_On_PAN) ? posp_data.Name_On_PAN.toUpperCase() : "",
                                "___Name_On_Aadhar___": (posp_data.Name_On_Aadhar) ? posp_data.Name_On_Aadhar.toUpperCase() : "",
                                "___Name_as_in_Bank___": (posp_data.Name_as_in_Bank) ? posp_data.Name_as_in_Bank : ""
                            };
                            email_data = fs.readFileSync(appRoot + '/resource/request_file/Posp_Doc_Upload_Mail.html').toString();
                            email_data = email_data.replaceJson(objMail);
                            objModelEmail.send('pospcom@policyboss.com', send_to, "[POSP-ONBOARDING] REQUEST TO VERIFY DOCUMENTS::SSID-" + ss_id + "::FBA_ID-" + fba_id, email_data, cc_arr.join(';'), bcc_arr.join(';'), '');
                            res.json({"Status": "SUCCESS", "Msg": "Document verification mail sent successfully!!", 'Ss_Id': ss_id});

                        } else {
                            res.json({"Status": "FAIL", "Msg": "No Record Found For Given Ss_Id.", "Ss_Id": ss_id});
                        }
                    }
                });
            } else {
                res.json({"Status": "FAIL", "Msg": "Ss_Id missing"});
            }
        } catch (ex) {
            res.json({"Status": "FAIl", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/upload_onboarding_documents_NIU', (req, res) => {
        try {
            let form = new formidable.IncomingForm();
            let posp_obj = {}, posp_doc_log_obj = {};
            let User_Id = 0, uploaded_len = 0;
            let doc_uploaded = "";
            let aadhar_type = "Front";
            let doc_log_update_obj = {};
            let file_prefix = "", posp_email = "", nominee_relation = "";
            let posp_doc_name_obj = {"AADHAAR": "AadharCard_Front", "PAN": "PanCard", "QUALIFICATION": "Educational_Certificate", "POSP_ACC_DOC": "POSP_Cancel_Cheque", "NOMINEE_PAN_DOC": "Nominee_Pan_Card", "NOMINEE_ACC_DOC": "Nominee_Cancel_Cheque", "PROFILE": "Profile_Photo", "OTHER": "Certificate"};
            let doc_fields = {"PAN": ["Pan_No", "Name_On_PAN", "DOB_On_PAN"],"QUALIFICATION":["Education"], "AADHAAR": ["Aadhar", "Name_On_Aadhar", "Present_City", "Present_State", "Permanant_City", "Permanant_State", "Present_Add1", "Permanant_Add1", "Present_Pincode", "Permanant_Pincode"], "POSP_ACC_DOC": ["Bank_Account_No", "Account_Type", "Micr_Code", "Ifsc_Code", "Bank_City", "Bank_Name", "Bank_Branch", "Name_as_in_Bank"], "NOMINEE_ACC_DOC": ["Nominee_Bank_Account_Number", "Nominee_Bank_City", "Nominee_Account_Type", "Nominee_Bank_Branch", "Nominee_Bank_Name", "Nominee_Ifsc_Code", "Nominee_Micr_Code", "Nominee_Name_as_in_Bank"], "NOMINEE_PAN_DOC": ["Nominee_Pan", "Nominee_Name_On_Pan", "Nominee_DOB_On_Pan"]};
            let basic_fields = ["Email_Id", "Gender", "Father_Name", "Nominee_Relationship"];
            let file_name_prefix = {"PAN": "PanCard_", "AADHAAR": "AadharCard_", "QUALIFICATION": "QualificationCertificate_", "POSP_ACC_DOC": "Posp_Bank_Account_", "NOMINEE_ACC_DOC": "Nominee_Bank_Account_", "PROFILE": "Profile_", "NOMINEE_PAN_DOC": "Nominee_Pan_Card_", "OTHER": "Certificate_"};
            let mandate_doc_arr = ["PROFILE", "PAN", "AADHAAR", "QUALIFICATION", "POSP_ACC_DOC", "OTHER"];
            form.parse(req, function (err, fields, files) {
                let objRequest = fields;
                User_Id = objRequest.User_Id ? objRequest.User_Id : "";
                if (User_Id) {
                    basic_fields.forEach((item) => {
                        objRequest.hasOwnProperty(item) ? posp_obj[item] = objRequest[item] : '';
                    });
                    let current_doc = doc_fields[objRequest["DocType"]];
                    if (current_doc) {
                        current_doc.forEach((currentVal) => {
                            if (currentVal === "DOB_On_PAN") {
                                let pan_dob_date = "";
                                if (objRequest.DOB_On_PAN) {
                                    if (objRequest.DOB_On_PAN && moment(objRequest.DOB_On_PAN, 'YYYY-MM-DD', true).isValid()) {
                                        pan_dob_date = objRequest.DOB_On_PAN;
                                    } else if (objRequest.DOB_On_PAN && moment(objRequest.DOB_On_PAN, 'DD-MM-YYYY', true).isValid()) {
                                        pan_dob_date = moment(objRequest.DOB_On_PAN, 'DD-MM-YYYY').format("YYYY-MM-DD");
                                    } else if (objRequest.DOB_On_PAN && moment(objRequest.DOB_On_PAN, 'DD/MM/YYYY', true).isValid()) {
                                        pan_dob_date = moment(objRequest.DOB_On_PAN, 'DD/MM/YYYY').format("YYYY-MM-DD");
                                    }
                                }
                                posp_obj["DOB_On_PAN"] = pan_dob_date;
                                posp_obj["Birthdate"] = pan_dob_date;
                            } else {
                                objRequest.hasOwnProperty(currentVal) ? posp_obj[currentVal] = objRequest[currentVal] : '';
                            }
                        });
                        if (objRequest["DocType"] === "PAN" || objRequest["DocType"] === "NOMINEE_PAN_DOC") {
                            let panType = objRequest["DocType"] === "PAN" ? "Name_On_PAN" : "Nominee_Name_On_Pan";
                            let nameOnPan = (objRequest[panType] !== "" && objRequest[panType] !== undefined && objRequest[panType] !== null) ? (objRequest[panType]).trim() : "";
                            let namesArr = nameOnPan ? nameOnPan.split(" ") : [];
                            if (namesArr.length > 0) {
                                let middle_name = first_name = last_name = "";
                                for (var i = 2; i < namesArr.length; i++) {
                                    middle_name += " " + namesArr[i - 1];
                                }
                                first_name = nameOnPan.split(' ')[0];
                                last_name = namesArr.length == 1 ? "" : namesArr[namesArr.length - 1];
                                objRequest["DocType"] === "PAN" ? posp_obj["Name_On_PAN"] = nameOnPan : posp_obj["Nominee_Name_On_Pan"] = nameOnPan;
                                objRequest["DocType"] === "PAN" ? posp_obj["First_Name"] = first_name.trim() : posp_obj["Nominee_First_Name"] = first_name.trim();
                                objRequest["DocType"] === "PAN" ? posp_obj["Middle_Name"] = middle_name.trim() : posp_obj["Nominee_Middle_Name"] = middle_name.trim();
                                objRequest["DocType"] === "PAN" ? posp_obj["Last_Name"] = last_name.trim() : posp_obj["Nominee_Last_Name"] = last_name.trim();

                            }

                        }
                    }
                    file_prefix = file_name_prefix[objRequest.DocType] + User_Id;
                   
                    var files = files;
                    posp_user.find({'User_Id': User_Id}, function (posp_find_err, posp_find_res) {
                        if (posp_find_err)
                            res.json({"Status": "FAIL", "Msg": posp_find_err});
                        if ((posp_find_res && posp_find_res.length > 0) || objRequest["Email_Id"] || objRequest["Nominee_Relationship"]) {
                            let posp_user_details = posp_find_res[0]._doc;
                            posp_email = posp_user_details.Email_Id;
                            nominee_relation = posp_user_details.Nominee_Relationship;
                            doc_uploaded = posp_user_details.Is_Document_Uploaded;
                            //posp_email ? uploaded_len++ : "";
                            //nominee_relation ? uploaded_len++ : "";
                            //Live profile 
                            if (objRequest.hasOwnProperty('Profile_Live_Photo')) {
                                var path = appRoot + "/tmp/onboarding_docs/";
                                var photo_file_name = "", Field_Name = "";
                                if (objRequest.hasOwnProperty('Profile_Live_Photo')) {
                                    photo_file_name = "Profile_" + User_Id + '.png';
                                    Field_Name = "Profile_Live_Photo";
                                }
                                var img1 = decodeURIComponent(objRequest[Field_Name]);
                                if (!fs.existsSync(appRoot + "/tmp/onboarding_docs/" + User_Id)) {
                                    fs.mkdirSync(appRoot + "/tmp/onboarding_docs/" + User_Id);
                                }
                                var data = img1.replace(/^data:image\/\w+;base64,/, "");
                                if (data === "") {
                                    res.json({'Status': "Fail", 'Msg': err});
                                } else {
                                    var buf = new Buffer(data, 'base64');
                                    fs.writeFile(path + User_Id + '/' + photo_file_name, buf);
                                }
                                var pdf_web_path_horizon = config.environment.downloadurl + "/onboarding/download/onboarding_docs/" + User_Id + "/" + photo_file_name;
                                posp_doc_log_obj['Doc_URL'] = pdf_web_path_horizon;
                                posp_doc_log_obj['Modified_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                posp_doc_log_obj['Status'] = "Pending";
                                posp_obj['Modified_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                doc_log_update_obj[objRequest["DocType"]] = posp_doc_log_obj;
                            }
                            try {
                                if (objRequest.hasOwnProperty("AadharCard_Front") && objRequest.hasOwnProperty("AadharCard_Back")) {
                                    let front_file_name = objRequest["AadharCard_Front"];
                                    let front_file_sys_loc_horizon = appRoot + "/tmp/onboarding_docs/" + User_Id + "/" + front_file_name;
                                    let front_file_web_path_horizon = config.environment.downloadurl + "/onboarding/download/onboarding_docs/" + User_Id + "/" + front_file_name;
                                    doc_log_update_obj["AADHAAR"] = {
                                        "Status": "Pending",
                                        "Doc_URL": front_file_web_path_horizon,
                                        "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                                    };

                                    let back_file_name = objRequest["AadharCard_Back"];
                                    let back_file_sys_loc_horizon = appRoot + "/tmp/onboarding_docs/" + User_Id + "/" + back_file_name;
                                    let back_file_web_path_horizon = config.environment.downloadurl + "/onboarding/download/onboarding_docs/" + User_Id + "/" + back_file_name;
                                    doc_log_update_obj["AadharCard_Back"] = {
                                        "Status": "Pending",
                                        "Doc_URL": back_file_web_path_horizon,
                                        "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                                    };

                                }
                                if (!["AadharCard_Front", "AadharCard_Back"].includes(posp_doc_name_obj[objRequest.DocType]) && objRequest.hasOwnProperty(posp_doc_name_obj[objRequest.DocType])) {
                                    console.error("POSP Profile Image LINE1 desktop2");
                                    let file_name = objRequest[posp_doc_name_obj[objRequest.DocType]];
                                    let file_ext = file_name.split('.')[1];

                                    let file_sys_loc_horizon = appRoot + "/tmp/onboarding_docs/" + User_Id + "/" + file_name;
                                    let file_web_path_horizon = config.environment.downloadurl + "/onboarding/download/onboarding_docs/" + User_Id + "/" + file_name;

                                    posp_doc_log_obj['Modified_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                    posp_doc_log_obj['Status'] = "Pending";
                                    posp_obj['Modified_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                    if (aadhar_type === "AadharBack") {
                                        doc_log_update_obj["AadharCard_Back"] = {
                                            "Status": "Pending",
                                            "Doc_URL": file_web_path_horizon,
                                            "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                                        };
                                    } else {
                                        doc_log_update_obj[objRequest["DocType"]] = {
                                            "Status": "Pending",
                                            "Doc_URL": file_web_path_horizon,
                                            "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                                        };
                                    }
                                }
                            } catch (e) {
                                console.error("POSP Profile Image LINE1 desktop3545");
                            }
//                            if (objRequest.hasOwnProperty(posp_doc_name_obj[objRequest.DocType])) {
//                                let file_name = objRequest[posp_doc_name_obj[objRequest.DocType]];
//                                let file_sys_loc_horizon = appRoot + "/tmp/onboarding_docs/" + User_Id + "/" + file_name;
//                                let file_web_path_horizon = config.environment.downloadurl + "/onboarding/download/onboarding_docs/" + User_Id + "/" + file_name;
//                                posp_doc_log_obj['Doc_URL'] = file_web_path_horizon;
//                            }
                            //Start Upload File

                            if (JSON.stringify(files) !== "{}") {
                                if (!fs.existsSync(appRoot + "/tmp/onboarding_docs/" + User_Id)) {
                                    fs.mkdirSync(appRoot + "/tmp/onboarding_docs/" + User_Id);
                                }
                                console.error("POSP Profile Image LINE1 desktop5");
                                for (let i in files) {
                                    console.error("POSP Profile Image LINE1 desktop5");
                                    let name_arr = files[i].name.split('.');
                                    let old_file = files[i].name.replace(/\s/g, '');
                                    if (i === "AadharCard_Back") {
                                        file_prefix = "AadharCardBack_" + User_Id;
                                        aadhar_type = "AadharBack";
                                    }
                                    file_name = file_prefix + '.' + name_arr[name_arr.length - 1];
                                    let file_ext = name_arr[name_arr.length - 1];
                                    let file_sys_loc_horizon = appRoot + "/tmp/onboarding_docs/" + User_Id + "/" + file_name;
                                    let file_web_path_horizon = config.environment.downloadurl + "/onboarding/download/onboarding_docs/" + User_Id + "/" + file_name;
                                    console.error("POSP Profile Image LINE1 desktop6");

                                    let oldpath = files[i].path;
                                    //let old_file_path = appRoot + "/tmp/onboarding_docs/" + User_Id + "/" + old_file;
                                    let read_data = fs.readFileSync(oldpath, {});
                                    fs.writeFileSync(file_sys_loc_horizon, read_data, {});
                                    fs.unlink(oldpath, function (err) {
                                        if (err)
                                            res.json({'Status': "Fail", 'Msg': "Error in deleting a file", "data": err});
                                    });
                                    /*if (fs.existsSync(old_file_path)) {
                                        console.error("old file", old_file_path);
                                        fs.unlink(old_file_path, function (err) {
                                            if (err)
                                                res.json({'Status': "Fail", 'Msg': "Error in deleting a file", "data": err});
                                        });
                                    }*/
                                    posp_doc_log_obj['Modified_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                    posp_doc_log_obj['Status'] = "Pending";
                                    posp_obj['Modified_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                    if (aadhar_type === "AadharBack") {
                                        doc_log_update_obj["AadharCard_Back"] = {
                                            "Status": "Pending",
                                            "Doc_URL": file_web_path_horizon,
                                            "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                                        };
                                    } else {
                                        doc_log_update_obj[objRequest["DocType"]] = {
                                            "Status": "Pending",
                                            "Doc_URL": file_web_path_horizon,
                                            "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                                        };
                                    }
                                }
                            }

                            if (objRequest["Email_Id"] || objRequest["Nominee_Relationship"]) {
                                posp_doc_log_obj = {};
                            } else {
                                if (objRequest["DocType"] === "AADHAAR") {
                                    posp_doc_log_obj = doc_log_update_obj["AADHAAR"];
                                } else {
                                    posp_doc_log_obj = doc_log_update_obj[objRequest["DocType"]] || {};
                                }
                            }
                            posp_doc_log.update({"User_Id": User_Id, "Doc_Type": objRequest["DocType"]}, {$set: posp_doc_log_obj}, function (update_posp_doc_log_err, update_posp_doc_log_res) {
                                if (update_posp_doc_log_err) {
                                    res.json({"Status": "FAIL", "Msg": update_posp_doc_log_err});
                                } else {
                                    if (objRequest["DocType"] === "AADHAAR") {
                                        posp_doc_log_obj = doc_log_update_obj["AadharCard_Back"] ? doc_log_update_obj["AadharCard_Back"] : {};
                                        posp_doc_log.update({"User_Id": User_Id, "Doc_Type": "AADHAAR_BACK"}, {$set: posp_doc_log_obj}, function (update_posp_doc_log_err, update_posp_doc_log_res) {
                                            if (update_posp_doc_log_err) {
                                                res.json({"Status": "FAIL", "Msg": update_posp_doc_log_err});
                                            } else {
                                                posp_doc_log.find({"User_Id": User_Id}, function (posp_log_err, posp_log_res) {
                                                    if (posp_log_err) {
                                                        res.json({"Status": "Fail", "Msg": posp_log_err});
                                                    } else {
                                                        if (posp_log_res.length > 0) {
                                                            let match_mandate_doc_arr = [];
                                                            for (let i = 0; i < posp_log_res.length; i++) {
                                                                //let current_doc_log = posp_log_res[i]._doc;
                                                                //["Verified", "Approved", "Pending"].includes(current_doc_log["Status"]) ? uploaded_len++ : uploaded_len;
                                                                let current_doc_log = posp_log_res[i]._doc;
                                                                if (current_doc_log.Doc_URL && (current_doc_log.Doc_Type && mandate_doc_arr.indexOf(current_doc_log.Doc_Type) > -1) && (current_doc_log.Status && ["Verified", "Approved", "Pending"].includes(current_doc_log.Status))) {
                                                                    match_mandate_doc_arr.push(current_doc_log.Doc_Type);
                                                                }
                                                            }
                                                            let is_doc_uploaded = "No";
                                                            //([7, 8, 9].indexOf(uploaded_len) > -1) ? (is_doc_uploaded = "Yes") : "";
                                                            if ([5, 6].indexOf(match_mandate_doc_arr.length) > -1) {
                                                                is_doc_uploaded = "Yes";
                                                            }
                                                            posp_obj["Is_Document_Uploaded"] = is_doc_uploaded;
                                                            if (is_doc_uploaded === "Yes") {
                                                                posp_obj["Last_Status"] = "Doc_Uploaded";
                                                                posp_obj["Onboarding_Status"] = "Doc_Uploaded";
                                                                posp_obj["Documents_Uploaded_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                                                posp_obj["Is_Document_Rejected"] = "No";
                                                            }
                                                        } else {
                                                            if (!objRequest["Email_Id"] && !objRequest["Nominee_Relationship"]) {
                                                                res.json({"Status": "FAIL", "Msg": "Document log not updated."});
                                                            }
                                                        }
                                                        posp_user.update({'User_Id': User_Id}, {$set: posp_obj}, function (update_posp_user_err, update_posp_user_res) {
                                                            if (update_posp_user_err) {
                                                                res.json({"Status": "FAIL", "Msg": update_posp_user_err});
                                                            } else {
                                                                if (doc_uploaded === "No" && posp_obj.hasOwnProperty("Is_Document_Uploaded") && posp_obj["Is_Document_Uploaded"] === "Yes") {
                                                                    try {
                                                                        client.get(config.environment.weburl + '/posps/report/email_consolidate_process?ss_id=' + User_Id + '&event_type=DOCUMENT_VERIFICATION_REQUEST', {}, function (mail_data, mail_res) {
                                                                            console.error('SEND_DOCUMENT_VERIFICATION_REQUEST_MAIL', 'Ss_Id: ' + User_Id);
                                                                        });
                                                                    } catch (ex) {
                                                                        console.error('EXCEPTION_IN_SEND_DOCUMENT_VERIFICATION_REQUEST_MAIL', 'Ss_Id: ' + User_Id, ex.stack);
                                                                    }
                                                                    try {
                                                                        client.get(config.environment.weburl + '/posps/report/email_consolidate_process?ss_id=' + User_Id + '&event_type=DOCUMENT_UPLOADED', {}, function (mail_data, mail_res) {
                                                                            console.error('SEND_DOCUMENT_UPLOADED_MAIL', 'Ss_Id: ' + User_Id);
                                                                        });
                                                                    } catch (ex) {
                                                                        console.error('EXCEPTION_IN_SEND_DOCUMENT_UPLOADED_MAIL', 'Ss_Id: ' + User_Id, ex.stack);
                                                                    }
                                                                }

                                                                res.json({"Status": "Success", "Msg": "Document uploaded successfully."});

                                                            }
                                                        });
                                                    }
                                                });

                                            }
                                        });
                                    } else {
                                        posp_doc_log.find({"User_Id": User_Id}, function (posp_log_err, posp_log_res) {
                                            if (posp_log_err) {
                                                res.json({"Status": "Fail", "Msg": posp_log_err});
                                            } else {
                                                if (posp_log_res.length > 0) {
                                                    let match_mandate_doc_arr = [];
                                                    for (let i = 0; i < posp_log_res.length; i++) {
                                                        //let current_doc_log = posp_log_res[i]._doc;
                                                        //["Verified", "Approved", "Pending"].includes(current_doc_log["Status"]) ? uploaded_len++ : uploaded_len;
                                                        let current_doc_log = posp_log_res[i]._doc;
                                                        if (current_doc_log.Doc_URL && (current_doc_log.Doc_Type && mandate_doc_arr.indexOf(current_doc_log.Doc_Type) > -1) && (current_doc_log.Status && ["Verified", "Approved", "Pending"].includes(current_doc_log.Status))) {
                                                            match_mandate_doc_arr.push(current_doc_log.Doc_Type);
                                                        }
                                                    }
                                                    let is_doc_uploaded = "No";
                                                    //([7, 8, 9].indexOf(uploaded_len) > -1) ? (is_doc_uploaded = "Yes") : "";
                                                    if ([5, 6].indexOf(match_mandate_doc_arr.length) > -1) {
                                                        is_doc_uploaded = "Yes";
                                                    }
                                                    posp_obj["Is_Document_Uploaded"] = is_doc_uploaded;
                                                    if (is_doc_uploaded === "Yes") {
                                                        posp_obj["Last_Status"] = "Doc_Uploaded";
                                                        posp_obj["Onboarding_Status"] = "Doc_Uploaded";
                                                        posp_obj["Documents_Uploaded_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                                        posp_obj["Is_Document_Rejected"] = "No";
                                                    }
                                                } else {
                                                    if (!objRequest["Email_Id"] && !objRequest["Nominee_Relationship"]) {
                                                        res.json({"Status": "FAIL", "Msg": "Document log not updated."});
                                                    }
                                                }
                                                posp_user.update({'User_Id': User_Id}, {$set: posp_obj}, function (update_posp_user_err, update_posp_user_res) {
                                                    if (update_posp_user_err) {
                                                        res.json({"Status": "FAIL", "Msg": update_posp_user_err});
                                                    } else {
                                                        if (doc_uploaded === "No" && posp_obj.hasOwnProperty("Is_Document_Uploaded") && posp_obj["Is_Document_Uploaded"] === "Yes") {
                                                            try {
                                                                client.get(config.environment.weburl + '/posps/report/email_consolidate_process?ss_id=' + User_Id + '&event_type=DOCUMENT_VERIFICATION_REQUEST', {}, function (mail_data, mail_res) {
                                                                    console.error('SEND_DOCUMENT_VERIFICATION_REQUEST_MAIL', 'Ss_Id: ' + User_Id);
                                                                });
                                                            } catch (ex) {
                                                                console.error('EXCEPTION_IN_SEND_DOCUMENT_VERIFICATION_REQUEST_MAIL', 'Ss_Id: ' + User_Id, ex.stack);
                                                            }
                                                            try {
                                                                client.get(config.environment.weburl + '/posps/report/email_consolidate_process?ss_id=' + User_Id + '&event_type=DOCUMENT_UPLOADED', {}, function (mail_data, mail_res) {
                                                                    console.error('SEND_DOCUMENT_UPLOADED_MAIL', 'Ss_Id: ' + User_Id);
                                                                });
                                                            } catch (ex) {
                                                                console.error('EXCEPTION_IN_SEND_DOCUMENT_UPLOADED_MAIL', 'Ss_Id: ' + User_Id, ex.stack);
                                                            }
                                                        }
                                                        res.json({"Status": "Success", "Msg": "Document uploaded successfully."});

                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            });

                        } else {
                            res.json({"Status": "FAIL", "Msg": "Document log doesn't exist."});
                        }
                    });
                } else {
                    res.json({"Status": "FAIL", "Msg": "User doesn't exist."});
                }
            });
        } catch (ex) {
            res.json({"Status": "FAIL", "Msg": "Exception in Upload_Onboarding_Documents", "Error": ex.stack});
        }
    });
    function sleep(ms) {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        });
    }
    app.get('/onboarding/update_content_status', function (req, res) {
        try {
            let Mobile_Number = req.query.mobileno;
            let User_Id = req.query.User_Id;
            let Module_Id = req.query.Module_Id ? parseInt(req.query.Module_Id) : 3;
            let Content_Id = req.query.Content_Id ? parseInt(req.query.Content_Id) : 1;
            let Page_Id = req.query.Page_Id ? parseInt(req.query.Page_Id) : 1;
            let Module_Name = req.query.Module_Name ? req.query.Module_Name : 'General Insurance';
            if (User_Id && Module_Id && Content_Id) {
                let args = {
                    "Last_Module_Id": Module_Id,
                    "Last_Module_Name": Module_Name,
                    "Last_Chapter": Content_Id,
                    "Last_Page": Page_Id
                };
                posp_user.update({'User_Id': User_Id}, {$set: args}, {runValidators: true}, function (err, numAffected) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        if (numAffected && numAffected.nModified === 1) {
                            res.json({"Status": "Success", "Msg": 'current content status updated'});
                        } else {
                            res.json({"Status": "Success", "Msg": 'current content status updated'});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "User Id or curent content Id missing"});
            }
        } catch (ex) {
            console.error('Exception', 'update_current_content failure', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/razorpay/create_order_id', function (req, res) { //create order id
        try
        {
            let onboarding_transaction_history = require('../models/onboarding_transaction_history.js');
            var Mobile_Number = req.query.mobileno ? req.query.mobileno : "";
            var User_Id = req.query.user_id ? req.query.user_id - 0 : "";
            var name = req.query.name ? req.query.name : "";
            var email = req.query.email ? req.query.email : "";
            var amount = req.query.amount ? parseInt(req.query.amount) : 0;
            let full_name = name; //proposal_request['middle_name'] === "" ? (proposal_request['first_name'] + " " + proposal_request['last_name']) : (proposal_request['first_name'] + " " + proposal_request['middle_name'] + " " + proposal_request['last_name']);
            let rzrpay_account_id = "";
            rzrpay_account_id = "acc_HkHhn0PQVj5NfV"; //config.rzp_landmark.account_id;
            let Client = require('node-rest-client').Client;
            let client = new Client();
            let rzrpay_amount;
            if (config.environment.name === 'Production') {
                amount = 1;
                rzrpay_amount = amount * 100;
            } else {
                rzrpay_amount = amount * 100;
            }

            let request = {
                "amount": rzrpay_amount,
                "payment_capture": 1,
                "currency": "INR",
                "notes": {
                    "customer_name": full_name,
                    "payment_mode": "individual"
                },
                "transfers": [
                    {
                        "account": rzrpay_account_id,
                        "amount": rzrpay_amount,
                        "currency": "INR"
                    }
                ]
            };
            var username = "rzp_test_PR1nbJKsdaLPop"; //config.rzp_landmark.username;
            var password = "CoNzrJZbBry80jMzzAbXSckP"; //config.rzp_landmark.password;
            let create_order_url = "https://api.razorpay.com/v1/orders";
            var args = {
                data: request,
                headers: {"Content-Type": "application/json",
                    "Accept": "application/json",
                    'Authorization': 'Basic ' + new Buffer(username + ':' + password).toString('base64')
                }
            };
            if (config.environment.name === 'Production') {
                pg_ack_url = 'http://horizon.policyboss.com';
            } else {
//                pg_ack_url = 'http://localhost:7000';
                pg_ack_url = 'http://qa-horizon.policyboss.com'; //UAT

            }
            let return_url = pg_ack_url + "/onboarding-transaction-status/" + User_Id;
            var merchant_key = config.rzp_landmark.username;
            let quoteId = "";
            var todayDate_time = moment((new Date()), 'YYYY-MM-DD HH:MM:SS:ZZZ').format("DD-MM-YYYY").replace(/-/g, '') + "_" + moment((new Date()), 'YYYY-MM-DD_HH:MM:SS:ZZZ').format("HH:MM:SS").replace(/:/g, '');
            todayDate_time = 'PB_' + todayDate_time;
            var pg_data = {
                'key': merchant_key,
                'user_id': User_Id,
                'full_name': full_name,
                'return_url': return_url,
                'phone': Mobile_Number,
                'orderId': "",
                'txnId': todayDate_time,
                'quoteId': '',
                'amount': rzrpay_amount, //(config.environment.name.toString() === 'Production') ? Math.round(proposal_request['final_premium']) : 1,
                'email': email,
                'img_url': 'https://origin-cdnh.policyboss.com/website/Images/PolicyBoss-Logo.jpg',
                'pg_type': "rzrpay",
                'transfer_id': ""
            };
            let Payment_Request = {
                "pg_url": "",
                "pg_data": pg_data,
                "pg_redirect_mode": "POST"
            };
            client.post(create_order_url, args, function (rzp_response, response) {
                if ((rzp_response.hasOwnProperty('status') && rzp_response['status'] === "created" && rzp_response.hasOwnProperty('id') && rzp_response['id'].includes('order_'))) {
                    pg_data['orderId'] = rzp_response["id"];
                    pg_data['transfer_id'] = rzp_response.hasOwnProperty('transfers') && rzp_response['transfers'][0].hasOwnProperty('status') && rzp_response['transfers'][0]['status'] === "created" ? rzp_response['transfers'][0]['id'] : "";
                    let args = {
                        "User_Id": User_Id,
                        "Name": full_name,
                        "Mobile": Mobile_Number,
                        "Email": email,
                        "Amount": Math.floor(rzrpay_amount / 100),
                        "PayId": '',
                        "Payment_Request": Payment_Request,
                        "Payment_Response": '',
                        "Transaction_Status": '',
                        "Created_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]"),
                        "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                    };
                    let onboarding_transaction_historyObj = new onboarding_transaction_history(args);
                    onboarding_transaction_historyObj.save(function (err, result) {
                        if (err) {
                            res.json({'Status': 'Fail', 'Msg': 'Razorpay Order Created But Not Saved In Collection.'});
                        } else {
                            res.json({'Status': 'Success', 'data': rzp_response, 'Razorpay_Request': Payment_Request});
                        }
                    });
                } else {
                    res.json({'Status': 'Fail', 'Msg': 'Razorpay Order Not Created'});
                }
                //res.json({'Status': 'Success', 'data': rzp_response, 'Razorpay_Request': args, 'Pg_Data': ObjUser_Data});
            });
        } catch (e) {
            return res.send(e.stack);
        }
    });
    app.get('/onboarding/view-onboarding-transaction-status/:user_id', function (req, res) {
        try {
            let onboarding_transaction_history = require('../models/onboarding_transaction_history.js');
            let User_Id = req.params.user_id ? req.params.user_id : '';
            if (User_Id !== '') {
                onboarding_transaction_history.find({'User_Id': User_Id}).sort({'Created_On': -1}).limit(1).exec(function (err, dbres) {
                    if (err) {
                        res.json({'Status': 'Fail', 'Msg': err});
                    } else {
                        res.json({'Status': 'Success', 'data': dbres});
                    }
                });
            } else {
                res.json({'Status': 'Fail', 'Msg': 'User Id missing.'});
            }
        } catch (e) {
            return res.send(e.stack);
        }
    });
    app.post('/onboarding/update-onboarding-transaction-status/:User_Id', function (req, res) {
        try {
            let onboarding_transaction_history = require('../models/onboarding_transaction_history.js');
            let Mobile_Number = req.params.mobile ? req.params.mobile : '';
            let User_Id = req.params.User_Id ? req.params.User_Id - 0 : '';
            if (User_Id !== '') {
                let Payment_Response = req.body.Payment_Response;
                let Status = req.body.Status;
                onboarding_transaction_history.findOne({'User_Id': User_Id}).sort({'Created_On': -1}).exec(function (err, dbres) {
                    if (err) {
                        res.json({'Status': 'Fail', 'Msg': err});
                    } else {
                        onboarding_transaction_history.update({'Transaction_Id': dbres['_doc']['Transaction_Id']}, {$set: {'Payment_Response': Payment_Response, 'Transaction_Status': Status, 'PayId': Payment_Response.PayId}}, function (err, numAffected) {
                            if (err) {
                                res.json({'Status': 'Fail', 'Msg': err});
                            } else {
                                if (Status === 'Success') {
                                    posp_user.update({'User_Id': User_Id}, {$set: {'Payment_Status': 'Successful'}}, {runValidators: true}, function (err, numAffected) {
                                        if (err) {
                                            res.json({'Status': 'Fail', 'Msg': err});
                                        } else {
                                            res.json({'Status': 'Success', 'Msg': 'transaction history updated.'});
                                        }
                                    });
                                } else {
                                    res.json({'Status': 'Success', 'Msg': 'transaction history updated.'});
                                }
                            }
                        });
                    }
                });
            } else {
                res.json({'Status': 'Fail', 'Msg': 'Mobile number missing.'});
            }
        } catch (ex) {
            console.error('Exception', 'update-onboarding-transaction-status', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/generate_onboarding_invoice', function (req, res) {
        try {
            var moment = require('moment');
            let Mobile_Number = "";
            let User_Id = req.query.User_Id ? req.query['User_Id'] - 0 : "";
            let Mail = req.query.Mail ? req.query.Mail : "Yes";
            let invoice_date = req.query.inv_date ? req.query.inv_date : moment().format('DD/MM/YYYY');
            let amount = req.query['amount'] ? req.query['amount'] : 999;
            let posp_user_data;
            let invoice_serial_no = "";
            let posp_doc_data;
            let Name = "", POSP_Email = "", rm_email = "", cc_arr = [], state = "", state_code = "", address = "", pan = "", Cust_Id = 0;
            ;
            let GST = 18; //18 percent
            let amountinwords = {
                "": "",
                "99": "Rupees Ninety-Nine Only.",
                "199": "Rupees One Hundred and Ninety-Nine Only.",
                "299": "Rupees Two Hundred and Ninety-Nine Only.",
                "399": "Rupees Three Hundred and Ninety-Nine Only.",
                "499": "Rupees Four Hundred and Ninety-Nine Only.",
                "599": "Rupees Five Hundred and Ninety-Nine Only.",
                "699": "Rupees Six Hundred and Ninety-Nine Only.",
                "799": "Rupees Seven Hundred and Ninety-Nine Only.",
                "899": "Rupees Eigth Hundred and Ninety-Nine Only.",
                "999": "Rupees Nine Hundred and Ninety-Nine Only."
            };
            if (User_Id !== "") {
                posp_user.find({"User_Id": User_Id}, function (err, dbresult) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        if (dbresult.length > 0) {
                            posp_user_data = dbresult[0]['_doc'];
                            invoice_serial_no = posp_user_data.rzp_id ? posp_user_data.rzp_id : "";
                            POSP_Email = posp_user_data.Email_Id ? posp_user_data.Email_Id : "";
                            Cust_Id = posp_user_data.Cust_Id ? (posp_user_data.Cust_Id - 0) : 0;
                            let Is_Invoice_Generated = posp_user_data.Is_Invoice_Generated;
                            var html_web_path_portal = config.environment.downloadurl + "/tmp/onboarding_invoices/" + User_Id + "/" + User_Id + "_invoice_" + amount + ".html";
                            var get_pdf_url = config.environment.pdf_url + html_web_path_portal;
                            var pdf_web_path_portal = config.environment.downloadurl + "/onboarding/download-invoice/" + User_Id + "/" + User_Id + "_invoice_" + amount + ".pdf";
                            if (Is_Invoice_Generated === "No") {
                                state = posp_user_data.Present_State ? posp_user_data.Present_State : (posp_user_data.Permanant_State ? posp_user_data.Permanant_State : "");
                                let pincode = posp_user_data.Present_Pincode ? (posp_user_data.Present_Pincode - 0) : (posp_user_data.Permanant_Pincode ? (posp_user_data.Permanant_Pincode - 0) : "");
                                var service_url = state ? config.environment.weburl : config.environment.weburl + "/getPinDetails/" + pincode;
                                state_code = getStateCode(state.toUpperCase());
                                client.get(service_url, {}, function (pincode_res, response) {
                                    if (pincode_res) {
                                        console.error("State fetched succeffully");
                                        state_code = state ? getStateCode(state.toUpperCase()) : getStateCode(pincode_res.State.toUpperCase());
                                        address = (posp_user_data.Present_Add1 && posp_user_data.Present_City) ? posp_user_data.Present_Add1 + ", " + posp_user_data.Present_City : '';
                                        rm_email = posp_user_data.Reporting_Email_ID ? posp_user_data.Reporting_Email_ID : "";
                                        cc_arr = ['posp.onboarding@policyboss.com', 'accounts.cord@policyboss.com'];
                                        rm_email ? cc_arr.push(rm_email) : "";
                                        Name = posp_user_data.First_Name + " " + posp_user_data.Last_Name;
                                        pan = posp_user_data.Pan_No ? posp_user_data.Pan_No : "";

                                        if (!fs.existsSync(appRoot + "/tmp/onboarding_invoices/" + User_Id)) {
                                            fs.mkdirSync(appRoot + "/tmp/onboarding_invoices/" + User_Id);
                                        }
                                        let html_file_path = appRoot + "/resource/request_file/tax-invoice-pb.html";
                                        let htmlPol = fs.readFileSync(html_file_path, 'utf8');
                                        let pdf_file_path = appRoot + "/tmp/onboarding_invoices/" + User_Id + "/" + User_Id + "_invoice_" + amount + ".pdf";
                                        let html_pdf_file_path = appRoot + "/tmp/onboarding_invoices/" + User_Id + "/" + User_Id + "_invoice_" + amount + ".html";
                                        var html_web_path_portal = config.environment.downloadurl + "/tmp/onboarding_invoices/" + User_Id + "/" + User_Id + "_invoice_" + amount + ".html";
                                        let file_web_path_horizon = config.environment.downloadurl + "/tmp/onboarding_invoices/" + User_Id + "/" + User_Id + "_invoice_" + amount + ".pdf";
                                        let invoice_attachment_system_path = "/onboarding_invoices/" + User_Id + "/" + User_Id + "_invoice_" + amount + ".pdf"
                                        let netAmount = Math.round(((amount * 100) / (100 + GST)) * 100) / 100;
                                        netAmount = Math.floor(netAmount) + ".00";
                                        let totalTax = Math.round((amount - netAmount) * 100) / 100;
                                        //let CGST = Math.round((totalTax / 2) * 100) / 100;
                                        let CGST = 76.14;
                                        let IGST = CGST + CGST;
                                        if (Name && state_code && invoice_serial_no) {
                                            let payment_args = {
                                                "State_Code": state_code,
                                                "Cust_Id": Cust_Id
                                            };
                                            razorpay_payment.updateMany({"Ss_Id": User_Id}, {$set: payment_args}, function (razorpay_err, razorpay_res) {
                                                if (razorpay_err) {
                                                    res.json({"Status": "Fail", "data": razorpay_err});
                                                } else {
                                                    let objInvoice = {
                                                        '___name___': Name,
                                                        '___Address___': address,
                                                        '___statecode___': state_code,
                                                        '___PAN___': pan,
                                                        '___GST___': '',
                                                        '___InvNo___': invoice_serial_no + "/POSP/" + moment().format("YYYY") + "-" + moment().add(1, "years").format("YYYY"),
                                                        '___CustId___': User_Id,
                                                        '___Date___': invoice_date,
                                                        '___totalamount___': amount,
                                                        '___Rate___': netAmount,
                                                        '___CGST___': (state_code === "MH") ? CGST : '-',
                                                        '___SGST___': (state_code === "MH") ? CGST : '-',
                                                        '___IGST___': (state_code === "MH") ? '-' : IGST,
                                                        '___ROUND_OFF___': 0.72,
                                                        '___Wordsamount___': amountinwords[amount]
                                                    };
                                                    htmlPol = htmlPol.replaceJson(objInvoice);
                                                    htmlPol = htmlPol.replaceAll(/___(.*?)___/g, "");
                                                    var request_html_file = fs.writeFileSync(html_pdf_file_path, htmlPol);
                                                    try {
                                                        var http = require('https');
                                                        var get_pdf_url = config.environment.pdf_url + html_web_path_portal;
                                                        var insurer_pdf_url = html_web_path_portal; //Local
                                                        var file_horizon = fs.createWriteStream(pdf_file_path);
                                                        var request_horizon = http.get(get_pdf_url, function (response) {
                                                            get_pdf_url = file_horizon.path;
                                                            response.pipe(file_horizon);
                                                            console.error("Certificate::PDF URL" + file_horizon);
                                                            console.error("PDF sucess");
                                                            let args = {
                                                                "Is_Invoice_Generated": "Yes"
                                                            };
                                                            posp_user.update({'User_Id': User_Id}, {$set: args}, {runValidators: true}, function (err, numAffected) {
                                                                if (err) {
                                                                    res.json({"Status": "Fail", "Msg": "Appointment Flag Not updated."});
                                                                } else {
                                                                    if (POSP_Email && Mail === "Yes") {
                                                                        try {
                                                                            client.get(config.environment.weburl + '/posps/report/email_consolidate_process?ss_id=' + User_Id + '&event_type=PAYMENT_DONE', {}, function (invoice_mail_data, invoice_mail_res) {
                                                                                console.error('SEND_INVOICE_MAIL', 'Ss_Id: ' + User_Id);
                                                                            });
                                                                        } catch (ex) {
                                                                            console.error('EXCEPTION_IN_SEND_INVOICE_MAIL', 'Ss_Id: ' + User_Id, ex.stack);
                                                                        }
                                                                    }
                                                                    res.json({"Status": "Success", "Msg": "Invoice Generated.", "html_url": html_web_path_portal, "pdf_url": get_pdf_url});
                                                                }
                                                            });
                                                        });
                                                    } catch (e) {
                                                        console.error('PDF Exception', e);
                                                    }
                                                }
                                            });
                                        } else {
                                            res.json({"Status": "Fail", "Msg": "Unsufficient details."});
                                        }
                                    } else {
                                        res.json({"Status": "Fail", "Msg": "Unsufficient details."});
                                    }
                                });

                            } else {
                                res.json({"Status": "Success", "Msg": "Invoice Generated.", "html_url": html_web_path_portal, "pdf_url": pdf_web_path_portal});
                            }

                        } else {
                            res.json({"Status": "Fail", "Msg": "User Not Found."});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "User Not Found."});
            }
        } catch (ex) {
            console.error('Exception', 'generate-onboarding-invoice', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/generateAppointmentLetter/:User_Id', function (req, res) {
        try {
            var moment = require('moment');
            let POSP_Email = "", Name = "", POSP_UploadingDateAtIIB = "", PanCard_Number = "", AadharCard_Number = "", Mobile_Number = "";
            let Address = present_add1 = present_add2 = present_add3 = present_City = present_state = present_Pincode = "";
            let data = "", appt_generated = "No";
            let User_Id = parseInt(req.params['User_Id']);
            if (!isNaN(User_Id)) {
                posp_user.find({"User_Id": User_Id}, function (err, dbres) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        if (dbres.length > 0) {
                            let user_data = dbres[0]._doc;
                            POSP_UploadingDateAtIIB = user_data.POSP_UploadingDateAtIIB;
                            appt_generated = user_data.Is_Appointment_Letter_Generated;
                            var html_web_path_portal = config.environment.downloadurl + "/onboarding_appointments/" + User_Id + "/AppointmentLetter_" + User_Id + ".html";
                            var get_pdf_url = config.environment.downloadurl + "/onboarding/download/appointment/" + User_Id + "/AppointmentLetter_" + User_Id + ".pdf";// config.environment.pdf_url + html_web_path_portal;
                            if (appt_generated === "No") {
                                Name = user_data.hasOwnProperty("Name_On_PAN") && user_data.Name_On_PAN ? user_data.Name_On_PAN : "";
                                if (Name === "") {
                                    let fname = user_data.hasOwnProperty("First_Name") && user_data.First_Name ? user_data.First_Name : "";
                                    let mname = user_data.hasOwnProperty("Middle_Name") && user_data.Middle_Name ? user_data.Middle_Name : "";
                                    let lname = user_data.hasOwnProperty("Last_Name") && user_data.Last_Name ? user_data.Last_Name : "";
                                    Name = fname + " " + mname + " " + lname;
                                }

                                Mobile_Number =  user_data.Mobile_Number || user_data.Mobile_No || "";
                                PanCard_Number = user_data.hasOwnProperty("Pan_No") && user_data.Pan_No ? user_data.Pan_No : "";
                                AadharCard_Number = user_data.hasOwnProperty("Aadhar") && user_data.Aadhar ? user_data.Aadhar : "";
                                POSP_Email = user_data.hasOwnProperty("Email_Id") && user_data.Email_Id;
                                present_add1 = (user_data.hasOwnProperty("Present_Add1") && user_data.Present_Add1) ? user_data.Present_Add1 : "";
                                present_add2 = (user_data.hasOwnProperty("Present_Add2") && user_data.Present_Add2) ? user_data.Present_Add2 : "";
                                present_add3 = (user_data.hasOwnProperty("Present_Add3") && user_data.Present_Add3) ? user_data.Present_Add3 : "";
                                present_City = (user_data.hasOwnProperty("Present_City") && user_data.Present_City) ? user_data.Present_City : "";
                                present_state = (user_data.hasOwnProperty("Present_State") && user_data.Present_State) ? user_data.Present_State : "";
                                present_Pincode = (user_data.hasOwnProperty("Present_Pincode") && user_data.Present_Pincode) ? user_data.Present_Pincode : "";

                                Address = present_add1 ? present_add1 + ', ' : "";
                                Address += present_add2 ? present_add2 + ', ' : "";
                                Address += present_add3 ? present_add3 + ', ' : "";
                                Address += present_City ? present_City + ', ' : "";
                                Address += present_state ? present_state + ', ' : "";
                                Address += present_Pincode ? present_Pincode : "";
                                SSID = user_data.hasOwnProperty("User_Id") && user_data.User_Id ? user_data.User_Id : "";
                                if (Name && Mobile_Number && PanCard_Number && POSP_Email && Address) {
                                    if (!fs.existsSync(appRoot + "/tmp/onboarding_appointments/" + User_Id)) {
                                        fs.mkdirSync(appRoot + "/tmp/onboarding_appointments/" + User_Id);
                                    }
                                    let html_file_path = appRoot + "/resource/request_file/landmark_posp_appointment_revised.html";
                                    if (req.query['dbg'] === 'Yes') {
                                        html_file_path = appRoot + "/resource/request_file/landmark_posp_appointment_revised.html";
                                    }     
                                    let htmlPol = fs.readFileSync(html_file_path, 'utf8');
                                    let pdf_file_path = appRoot + "/tmp/onboarding_appointments/" + User_Id + "/AppointmentLetter_" + User_Id + ".pdf";
                                    let pdf_file_attachment = pdf_file_path.replace(appRoot + "/tmp", "");
                                    let html_pdf_file_path = appRoot + "/tmp/onboarding_appointments/" + User_Id + "/AppointmentLetter_" + User_Id + ".html";
                                    var html_web_path_portal = config.environment.downloadurl + "/onboarding_appointments/" + User_Id + "/AppointmentLetter_" + User_Id + ".html";
                                    let objCertificate = {
                                        '___name___': Name,
                                        '___adhaar___': AadharCard_Number,
                                        '___pan___': PanCard_Number,
                                        '___address___': Address,
                                        '___mobile___': Mobile_Number,
                                        '___email___': POSP_Email,
                                        '___date___': POSP_UploadingDateAtIIB,
                                        '___ss_id___': SSID
                                    };
                                    htmlPol = htmlPol.toString().replaceJson(objCertificate);
                                    htmlPol = htmlPol.toString().replaceAll(/___(.*?)___/g, "");
                                    var request_html_file = fs.writeFileSync(html_pdf_file_path, htmlPol);
                                    try {
                                        var http = require('https');
                                        console.log("html_web_path_portal : " + html_web_path_portal);
                                        var get_pdf_url = config.environment.pdf_url + html_web_path_portal;
                                        var download_url = get_pdf_url;
//                                            var insurer_pdf_url = html_web_path_portal;//Local
                                        console.log("get_pdf_url : " + get_pdf_url);
                                        var file_horizon = fs.createWriteStream(pdf_file_path);

                                        var request_horizon = http.get(get_pdf_url, function (response) {
                                            get_pdf_url = file_horizon.path;
                                            response.pipe(file_horizon);
                                            console.error("Appointment Letter::PDF URL" + file_horizon);
                                            console.error("PDF sucess");

                                            let posp_training_dashboard_url = "https://www.policyboss.com/posp-training-dashboard";
                                            let objModelEmail = new Email();
                                           let mail_content = '<html><body style="font-size: 18px;"><p>Dear Sir/Madam, </p>'
                                                + '<p>Congratulations !!You have been successfully appointed as our Point of Sales Person( POSP ).</p>'
                                                + '<p>We welcome you to the family of Landmark Insurance Brokers Private Limited( Landmark ), an IRDAI registered Direct Insurance Broker(Category: Life & General). Landmark is one of the largest retail insurance broker in the country, in operations for nearly two decades.</p>'
                                                + '<p>Please find below the link to download your Letter of Appointment/Agreement.You are requested to kindly go through the same and let us know in case of any discrepancy within three days from the date of receipt, so that we can take necessary corrective action.In the event we do not hear from you, you acknowledge that the contents therein are accepted.</p>'
                                                + '<p><a style="color:blue" href=' + download_url + '' + '>Download Appointment Letter</a></p>'
                                                + '<p>We thank you for choosing us, to be part of our growth journey and look forward to a long term mutually beneficial association. </p>'
                                                + '<p><span>In case you need any support in your journey as our POSP, you can get in touch with your Relationship Manager or write to us at </span> <span><a href="customercare@policyboss.com" style="color:blue">customercare@policyboss.com</a></span><span>&nbsp;or call us on our toll free number 1800-419-419-9.</span></p>'
                                                + '<p><b>Congratulations once again from team Landmark.</b></p>'
                                                + '<p><b>Please visit our website <a href="www.policyboss.com" style="color:blue">www.policyboss.com</a>, the online presence of Landmark.</b></p>'
                                                + '<p>Regards,<br/>'
                                                + 'For <b>Landmark Insurance Brokers Private Limited </b><br/>'
                                                + '[IRDAI CoR: 216] <br/><br/><br/>Team Landmark <br/></br/>********************</p><br/>'
                                                + '<p style="font-size: 16px"><i>Section 41 (1) of Insurance Act: No person shall allow or offer to allow, either directly or indirectly, as an inducement to any person to take out or renew or continue an insurance in respect of any kind of risk relating to lives or property in India, any rebate of the whole or part of the commission payable or any rebate of the premium shown on the policy, nor shall any person taking out or renewing or continuing a policy accept any rebate, except such rebate as may be allowed in accordance with the published prospectuses or tables of the insurer.</i></p>'
                                                + '</body></html>';
                                            //objModelEmail.send('pospcom@policyboss.com', sendTo, subject, mail_content, arrCC.join(','), '', '');
                                            //                                  let arr = ['piyush.singh@policyboss.com', 'nilam.bhagde@policyboss.com'];
                                        if (req.query['dbg'] === 'Yes') {
                                            objModelEmail.send('pospcom@policyboss.com', 'nilam.bhagde@policyboss.com', " Congratulations !! | Welcome to the family of Landmark Insurance Brokers - SSID : " + SSID, mail_content, '', 'ashish.hatia@policyboss.com', 0, User_Id, pdf_file_attachment);
                                        } else {
                                            objModelEmail.send('pospcom@policyboss.com', POSP_Email, " Congratulations !! | Welcome to the family of Landmark Insurance Brokers - SSID : " + SSID, mail_content, '', 'ronald.mathais@policyboss.com,p.janardhan@policyboss.com,onlinepolicy@policyboss.com,horizonlive.2020@gmail.com', 0, User_Id, pdf_file_attachment);
                                        }
                                        });
                                    } catch (e) {
                                        console.error('PDF Exception', e);
                                    }

                                    //send SMS
                                    /*var objSmsLog = new SmsLog();
                                     var customer_msg = "Hi ,\n\Please click on below link to download your appointment letter." + "\n 1. Appointment Letter : <a href='" + get_pdf_url + "'>download appointment letter</a>";
                                     objSmsLog.send_sms(Mobile_Number, customer_msg, 'APPOINTMENT_LETTER');*/
                                    //update Flag
                                    let args = {
                                        "Is_Appointment_Letter_Generated": "Yes"
                                    };
                                    posp_user.update({'User_Id': User_Id}, {$set: args}, {runValidators: true}, function (err, numAffected) {
                                        if (err)
                                            res.json({"Status": "Fail", "Msg": "Appointment Flag Not updated."});
                                        if (numAffected && numAffected.ok === 1) {
                                            res.json({"Status": "Success", "Msg": "Appointment Letter Generated.", "html_url": html_web_path_portal, "pdf_url": get_pdf_url});
                                        }
                                    });
                                } else {
                                    res.json({"Status": "Fail", "Msg": "Please upload your document details to download Appointment Letter."});
                                }
                            } else {
                                res.json({"Status": "Success", "Msg": "Appointment Letter Downloaded.", "html_url": html_web_path_portal, "pdf_url": get_pdf_url});
                            }
                        } else {
                            res.json({"Status": "Fail", "Msg": "You are not a valid POSP."});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "You are not a valid POSP."});
            }
        } catch (ex) {
            console.error('Exception', 'GenerateAppointment', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/new_generateAppointmentLetter', function (req, res) {
        try {
            var moment = require('moment');
            let Address = "";
            let POSP_Email = "";
            let Name = "";
            let PanCard_Number = "";
            let AadharCard_Number = "";
            let Mobile_Number = "";
            let User_Id = parseInt(req.body['User_Id']);
            let format = req.body['format'];
            let ori = req.body['ori'];
            let top = req.body['top'];
            let left = req.body['left'];
            let right = req.body['right'];
            if (!isNaN(User_Id)) {
                posp_document.find({"User_Id": User_Id}, function (err, dbresult) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        if (dbresult.length > 0) {
                            data = dbresult[0]._doc;
                            Name = data.Name;
                            Mobile_Number = data.Mobile_Number;
                            PanCard_Number = data.PanCard_Number;
                            AadharCard_Number = data.AadharCard_Number;
                            POSP_Email = data.PersonDetails.Person_EmailId;
                            Address = data.PersonDetails.Person_Permanent_Addr;
                            if (!fs.existsSync(appRoot + "/tmp/onboarding_appointments/" + User_Id)) {
                                fs.mkdirSync(appRoot + "/tmp/onboarding_appointments/" + User_Id);
                            }
                            let file_sys_loc_horizon = appRoot + "/tmp/onboarding_appointments/" + User_Id + "/AppointmentLetter.pdf";
                            let file_web_path_horizon = config.environment.weburl + "/onboarding/download/appointment/" + User_Id + "/AppointmentLetter.pdf";
//                                                     let certificate_data = fs.readFileSync(appRoot + '/tmp/onboarding_certificates/Certificate.html').toString();
                            let certificate_data = fs.readFileSync(appRoot + '/resource/request_file/Appointment.html').toString();
                            let objCertificate = {
                                '___posp_name___': Name,
                                '___posp_aadhar_no___': AadharCard_Number,
                                '___posp_pan_no___': PanCard_Number,
                                '___posp_address___': Address,
                                '___posp_mobile___': Mobile_Number,
                                '___posp_email___': POSP_Email,
                                '___appointment_date___': moment().format('YYYY-MM-DD'),
                                '___SSID___': '125556'
                            };
                            let certificate_content = certificate_data.replaceJson(objCertificate);
                            var options = {
                                format: format,
                                timeout: 50000,
                                "orientation": ori,
                                border: {
                                    "top": top,
                                    "left": left,
                                    "right": right
                                }
                            };
                            pdf.create(certificate_content, options).toFile(file_sys_loc_horizon, function (err, result) {
                                if (err)
                                    res.json({"Status": "Fail", "Msg": "Html to pdf"});
                                else {
                                    let objModelEmail = new Email();
                                    let mail_content = '<html><body><p>Hello, ' + Name + '</p>'
                                            + '<p>Please click on the below link to download your Appointment Letter :</p>'
                                            + '<p>1. Download Appointment Letter : <a href="' + config.environment.weburl + '/onboarding/download/appointment/' + User_Id + "/AppointmentLetter.pdf" + '">Appointment Letter Link</a></p>'
                                            + 'Regards,<br/>'
                                            + 'Landmark Insurance Brokers Pvt. Ltd.<br/>'
                                            + '<b> Contact</b> : 18004194199 <br/>'
                                            + '<img src="https://www.policyboss.com/website/Images/PolicyBoss-Logo.jpg"><br/><br/>'
                                            + '</p></body></html>';
                                    //objModelEmail.send('pospcom@policyboss.com', sendTo, subject, mail_content, arrCC.join(','), '', '');
                                    let arr = ['piyush.singh@policyboss.com', 'nilam.bhagde@policyboss.com'];
                                    objModelEmail.send('pospcom@policyboss.com', arr.join(';'), "Posp-Appointment-Letter-download-Url", mail_content, '', '', '');
                                    var objSmsLog = new SmsLog();
                                    var customer_msg = "Hi ,\n\Please click on below link to download your Appointment Letter." + "\n 1. Appointment Letter : <a href='" + file_web_path_horizon + "'>download appointment letter</a>";
                                    objSmsLog.send_sms(Mobile_Number, customer_msg, 'APPOINTMENT-LETTER');
                                    //update Flag
                                    let args = {
                                        "Is_Appointment_Letter_Generated": "Yes"
                                    };
                                    posp_user.update({'User_Id': User_Id}, {$set: args}, {runValidators: true}, function (err, numAffected) {
                                        if (err)
                                            res.json({"Status": "Fail", "Msg": "Appointment Flag Not updated."});
                                        if (numAffected && numAffected.ok === 1) {
                                            res.json({"Status": "Success", "Msg": "Letter Generated."});
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Invalid Mobile_Number."});
            }
        } catch (ex) {
            console.error('Exception', 'GenerateAppointment', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.all('/onboarding/download/appointment/:folder/:file', function (req, res) {
        let urlpath = req.url;
        let folder = req.params.folder;
        let file = req.params.file;
        res.sendFile(path.join(appRoot + '/tmp/onboarding_appointments/' + folder + '/' + file));
    });
    app.all('/onboarding/download-invoice/:folder/:file', function (req, res) {
        let urlpath = req.url;
        let folder = req.params.folder;
        let file = req.params.file;
        res.sendFile(path.join(appRoot + '/tmp/onboarding_invoices/' + folder + '/' + file));
    });
    app.get('/onboarding/downloadCertificate', function (req, res) {
        var User_Id = req.query["User_Id"];
        const file = appRoot + "/tmp/onboarding_certificates/" + User_Id + "/Certificate.pdf";
        console.log("approot : " + appRoot);
        res.download(file, "Certificate.pdf"); // Set disposition and send it.
    });
    app.get('/onboarding/downloadDocument', function (req, res) {
        var User_Id = req.query["User_Id"];
        var File_Name = req.query["File_Name"];
        const file = appRoot + "/tmp/onboarding_docs/" + User_Id + "/" + File_Name;
        res.download(file, File_Name); // Set disposition and send it.
    });
    app.post('/onboarding/new_generateAppointmentLetter', function (req, res) {
        try {
            var moment = require('moment');
            let Address = "";
            let POSP_Email = "";
            let Name = "";
            let PanCard_Number = "";
            let AadharCard_Number = "";
            let Mobile_Number = "";
            let User_Id = parseInt(req.body['User_Id']);
            let format = req.body['format'];
            let ori = req.body['ori'];
            let top = req.body['top'];
            let left = req.body['left'];
            let right = req.body['right'];
            if (!isNaN(User_Id)) {
                posp_document.find({"User_Id": User_Id}, function (err, dbresult) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        if (dbresult.length > 0) {
                            data = dbresult[0]._doc;
                            Name = data.Name;
                            Mobile_Number = data.Mobile_Number;
                            PanCard_Number = data.PanCard_Number;
                            AadharCard_Number = data.AadharCard_Number;
                            POSP_Email = data.PersonDetails.Person_EmailId;
                            Address = data.PersonDetails.Person_Permanent_Addr;
                            if (!fs.existsSync(appRoot + "/tmp/onboarding_appointments/" + User_Id)) {
                                fs.mkdirSync(appRoot + "/tmp/onboarding_appointments/" + User_Id);
                            }
                            let file_sys_loc_horizon = appRoot + "/tmp/onboarding_appointments/" + User_Id + "/AppointmentLetter.pdf";
                            let file_web_path_horizon = config.environment.weburl + "/onboarding/download/appointment/" + User_Id + "/AppointmentLetter.pdf";
//                                                     let certificate_data = fs.readFileSync(appRoot + '/tmp/onboarding_certificates/Certificate.html').toString();
                            let certificate_data = fs.readFileSync(appRoot + '/resource/request_file/Appointment.html').toString();
                            let objCertificate = {
                                '___posp_name___': Name,
                                '___posp_aadhar_no___': AadharCard_Number,
                                '___posp_pan_no___': PanCard_Number,
                                '___posp_address___': Address,
                                '___posp_mobile___': Mobile_Number,
                                '___posp_email___': POSP_Email,
                                '___appointment_date___': moment().format('YYYY-MM-DD'),
                                '___SSID___': '125556'
                            };
                            let certificate_content = certificate_data.replaceJson(objCertificate);
                            //console.log("Letter Data : " + certificate_content);
                            var options = {
                                format: format,
                                timeout: 50000,
                                "orientation": ori,
                                border: {
                                    "top": top,
                                    "left": left,
                                    "right": right
                                }
                            };
                            pdf.create(certificate_content, options).toFile(file_sys_loc_horizon, function (err, result) {
                                if (err)
                                    res.json({"Status": "Fail", "Msg": "Html to pdf"});
                                else {
                                    let objModelEmail = new Email();
                                    let mail_content = '<html><body><p>Hello, ' + Name + '</p>'
                                            + '<p>Please click on the below link to download your Appointment Letter :</p>'
                                            + '<p>1. Download Appointment Letter : <a href="' + config.environment.weburl + '/onboarding/download/appointment/' + User_Id + "/AppointmentLetter.pdf" + '">Appointment Letter Link</a></p>'
                                            + 'Regards,<br/>'
                                            + 'Landmark Insurance Brokers Pvt. Ltd.<br/>'
                                            + '<b> Contact</b> : 18004194199 <br/>'
                                            + '<img src="https://www.policyboss.com/website/Images/PolicyBoss-Logo.jpg"><br/><br/>'
                                            + '</p></body></html>';
                                    //objModelEmail.send('pospcom@policyboss.com', sendTo, subject, mail_content, arrCC.join(','), '', '');
                                    let arr = ['piyush.singh@policyboss.com', 'nilam.bhagde@policyboss.com'];
                                    objModelEmail.send('pospcom@policyboss.com', arr.join(';'), "Posp-Appointment-Letter-download-Url", mail_content, '', '', '');
                                    var objSmsLog = new SmsLog();
                                    var customer_msg = "Hi ,\n\Please click on below link to download your Appointment Letter." + "\n 1. Appointment Letter : <a href='" + file_web_path_horizon + "'>download appointment letter</a>";
                                    objSmsLog.send_sms(Mobile_Number, customer_msg, 'APPOINTMENT-LETTER');
                                    //update Flag
                                    let args = {
                                        "Is_Appointment_Letter_Generated": "Yes"
                                    };
                                    posp_user.update({'User_Id': User_Id}, {$set: args}, {runValidators: true}, function (err, numAffected) {
                                        if (err)
                                            res.json({"Status": "Fail", "Msg": "Appointment Flag Not updated."});
                                        if (numAffected && numAffected.ok === 1) {
                                            res.json({"Status": "Success", "Msg": "Letter Generated."});
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Invalid Mobile_Number."});
            }
        } catch (ex) {
            console.error('Exception', 'GenerateAppointment', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    function convertToSec(time) {
        let HH = parseInt(time.split(':')[0]);
        let MM = parseInt(time.split(':')[1]);
        let SS = parseInt(time.split(':')[2]);
        return (HH * 60 * 60) + (MM * 60) + SS;
    }
    function convertToHours(sec) {
        if (sec >= 0) {
            let HH = Math.floor(sec / (3600));
            if (HH < 10) {
                HH = '0' + HH;
            }
            sec = sec - (HH * 3600);
            MM = Math.floor(sec / 60);
            if (MM < 10) {
                MM = '0' + MM;
            }
            sec = sec - (MM * 60);
            if (sec < 10) {
                sec = '0' + sec;
            }
            let SS = sec;
            return  HH + ":" + MM + ":" + SS;
        } else {
            return  "00:00:00";
        }


    }
    function capitalizeFirstLetter(addr) {
        let arr = addr.split(" "), newStr = "";
        for (let x = 0; x < arr.length; x++) {
            newStr += arr[x].charAt(0).toUpperCase() + arr[x].slice(1).toLowerCase() + " ";
        }
        return newStr;
    }
    function calRemainingTime(completed_sec) {
        var spentSec = completed_sec;
        let total_training_seconds = convertToSec("30:00:00");
        var rem_time_in_sec = total_training_seconds - spentSec;
        var hr = Math.floor(rem_time_in_sec / 3600);
        var min = Math.floor((rem_time_in_sec - hr * 3600) / 60);
        var sec = rem_time_in_sec - (hr * 3600 + min * 60);
        if (hr < 10)
            hr = "0" + hr;
        if (min < 10)
            min = "0" + min;
        if (sec < 10)
            sec = "0" + sec;
        remTime = hr + ":" + min + ":" + sec;
        return remTime;
    }
    app.post('/onboarding/update_doc_log', function (req, res) {
        try {
            var doc_log_args = {};
            let body = req.body["doc_log_args"] ? req.body["doc_log_args"] : req.body;
            let User_Id = body.User_Id ? body.User_Id - 0 : "";
            for (let key in body) {
                doc_log_args[key] = body[key] && body[key] !== undefined ? body[key] : "";
            }
            if (User_Id !== "" && doc_log_args["Doc_Type"] !== "") {
                posp_doc_log.find({"User_Id": User_Id, "Doc_Type": doc_log_args["Doc_Type"]}, function (doc_log_find_err, doc_log_find_res) {
                    if (doc_log_find_err)
                        res.json({"Status": "Fail", "Msg": doc_log_find_err});
                    if (doc_log_find_res && doc_log_find_res.length > 0) {
                        doc_log_args["Modified_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                        posp_doc_log.update({"User_Id": User_Id, "Doc_Type": doc_log_args["Doc_Type"]}, {$set: doc_log_args}, function (doc_log_update_err, doc_log_update_res) {
                            if (doc_log_update_err) {
                                res.json({"Status": "Fail", "Msg": doc_log_update_err});
                            } else {
                                res.json({"Status": "Success", "Msg": "Record Updated Successfully"});
                            }
                        });
                    } else {
                        doc_log_args = {
                            "User_Id": User_Id,
                            "Mobile_Number": doc_log_args["Mobile_Number"],
                            "Uploaded_By_Ss_Id": doc_log_args["Uploaded_By_Ss_Id"] ? doc_log_args["Uploaded_By_Ss_Id"] : "",
                            "Approver_Ss_Id": doc_log_args["Approver_Ss_Id"] ? doc_log_args["Approver_Ss_Id"] : "",
                            "Verifier_Ss_Id": doc_log_args["Verifier_Ss_Id"] ? doc_log_args["Verifier_Ss_Id"] : "",
                            "Verified_On_Date": doc_log_args["Verified_On_Date"] ? doc_log_args["Verified_On_Date"] : "",
                            "Approved_On_Date": doc_log_args["Approved_On_Date"] ? doc_log_args["Approved_On_Date"] : "",
                            "Fba_Id": doc_log_args["Fba_Id"] ? doc_log_args["Fba_Id"] : "",
                            "Verified_By_API": doc_log_args["Verified_By_API"],
                            "Doc_Type": doc_log_args["Doc_Type"],
                            "Status": doc_log_args["Status"],
                            "Pre_Approval_Status": "",
                            "Doc_URL": doc_log_args["Doc_URL"] ? doc_log_args["Doc_URL"] : "",
                            "Remark": doc_log_args["Remark"] ? doc_log_args["Remark"] : "",
                            "Created_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                        };
                        let posp_doc_logObj = new posp_doc_log(doc_log_args);
                        posp_doc_logObj.save(function (doc_log_save_err, doc_log_save_res) {
                            if (doc_log_save_err) {
                                res.json({"Status": "Fail", "Msg": doc_log_save_err});
                            } else {
                                res.json({"Status": "Success", "Msg": "Doc log updated."});
                            }
                        });
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "User_Id or Doc_Type not found."});
            }
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": "Exception in updating doc log", "Error": ex.stack});
        }
    });
    app.get('/onboarding/remove_documents', function (req, res) {
        try {
            let doc_fields = {"PAN": ["Pan_No", "Name_On_PAN", "DOB_On_PAN", "First_Name", "Middle_Name", "Last_Name", "Birthdate", "Father_Name" , "Present_City", "Present_State", "Permanant_City", "Permanant_State", "Present_Add1","Present_Add2", "Present_Add3","Permanant_Add1","Permanant_Add2","Permanant_Add3", "Present_Pincode", "Permanant_Pincode"], "AADHAAR": ["Aadhar", "Name_On_Aadhar", "Present_City", "Present_State", "Permanant_City", "Permanant_State", "Present_Add1","Present_Add2", "Present_Add3","Permanant_Add1","Permanant_Add2","Permanant_Add3", "Present_Pincode", "Permanant_Pincode"], "POSP_ACC_DOC": ["Bank_Account_No", "Ifsc_Code", "Bank_Name", "Bank_Branch", "Name_as_in_Bank","Account_Type","Micr_Code"], "NOMINEE_ACC_DOC": ["Nominee_Bank_Account_Number", "Nominee_Bank_Branch", "Nominee_Bank_Name", "Nominee_Ifsc_Code", "Nominee_Name_as_in_Bank"], "NOMINEE_PAN_DOC": ["Nominee_Pan", "Nominee_Name_On_Pan", "Nominee_DOB_On_Pan"], "QUALIFICATION": ["Education"]};
            var User_Id = req.query.User_Id ? req.query.User_Id : "";
            var Doc_Type = req.query.Doc_Type ? req.query.Doc_Type : "";
            var document_types = [Doc_Type];
            var posp_user_args = posp_log_args = {};
            if (User_Id && Doc_Type) {
                let current_doc_fields = doc_fields[Doc_Type];
                if (current_doc_fields) {
                    current_doc_fields.forEach((item) => {
                        posp_user_args[item] = "";
                    });
                }
                posp_user_args["Is_Document_Uploaded"] = "No";
                posp_log_args = {
                    "Verified_By_API": "",
                    "Status": "",
                    "Doc_URL": "",
                    "Remark": "",
                    "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                };
                if (Doc_Type === "AADHAAR") {
                    document_types = ["AADHAAR", "AADHAAR_BACK"];
                }
                try {
                    posp_user.update({'User_Id': User_Id}, {$set: posp_user_args}, {runValidators: true}, function (posp_user_err, posp_user_res) {
                        if (posp_user_err) {
                            res.json({"Status": "Fail", "Msg": posp_user_err});
                        } else {
                            posp_doc_log.updateMany({"User_Id": User_Id, "Doc_Type": {$in: document_types}}, {$set: posp_log_args}, function (posp_user_log_err, posp_user_log_res) {
                                if (posp_user_log_err) {
                                    res.json({"Status": "Fail", "Msg": posp_user_log_err});
                                } else {
                                    res.json({"Status": "Success", "Msg": "Document Log Updated Successfully"});
                                }
                            });
                        }
                    });
                } catch (ex) {
                    res.json({"Status": "Fail", "Msg": ex.stack});
                }
            } else {
                res.json({"Status": "Fail", "Msg": "User_Id or Document Type missing."});
            }
        } catch (ex) {
            console.error("Exception in remove_documents");
            res.json({"Status": "Fail", "Msg": ex.stack});

        }
    });
    app.get('/onboarding/get_module_details', function (req, res) {
        let training_module_master = require('../models/training_module_master.js');
        try {
            let Training_Id = parseInt(req.query['Training_Id']);
            if (!isNaN(Training_Id)) {
                training_module_master.find({"Training_Id": Training_Id}, function (err, dbresult) {

                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        if (dbresult.length > 0) {
                            res.json({"Status": "Success", "data": dbresult});
                        } else {
                            res.json({"Status": "Fail", "Msg": "Module Details Not Found."});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Invalid Training_Id."});
            }
        } catch (ex) {
            console.error('Exception', 'get_module_details', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/get_module_content_details', function (req, res) {
        let training_module_content = require('../models/training_module_content.js');
        try {
            let Module_Id = parseInt(req.query['Module_Id']);
            if (!isNaN(Module_Id)) {
                training_module_content.find({"Module_Id": Module_Id}, function (err, dbresult) {

                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        if (dbresult.length > 0) {
                            res.json({"Status": "Success", "data": dbresult});
                        } else {
                            res.json({"Status": "Fail", "Msg": "Module Details Not Found."});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Invalid Module_Id."});
            }
        } catch (ex) {
            console.error('Exception', 'get_module_content_details', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/get_module_chapter_details', function (req, res) {
        let training_module_master = require('../models/training_module_master.js');
        try {
            let Module_Id = parseInt(req.query['Module_Id']);
            if (!isNaN(Module_Id)) {
                training_module_master.find({"Training_Module_Id": Module_Id}, function (err, dbresult) {

                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        if (dbresult.length > 0) {
                            res.json({"Status": "Success", "data": dbresult});
                        } else {
                            res.json({"Status": "Fail", "Msg": "Chapter Details Not Found."});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Invalid Module_Id."});
            }
        } catch (ex) {
            console.error('Exception', 'get_Training_Id_details', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/get_module_content_page_details', function (req, res) {
        let training_module_content = require('../models/training_module_content.js');
        try {
            let Module_Id = parseInt(req.query['Module_Id']);
            let Chapter_Id = parseInt(req.query.Chapter_Id);
            console.log(req.query);
//            let hapter_Id = req.query['Chapter_Id'] - 0;
            if (Module_Id && Chapter_Id) {
                training_module_content.find({"Module_Id": Module_Id, "Chapter_No": Chapter_Id}, function (err, dbresult) {

                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        if (dbresult.length > 0) {
                            res.json({"Status": "Success", "data": dbresult});
                        } else {
                            res.json({"Status": "Fail", "Msg": "Page Details Not Found."});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Invalid Module_Id or Chapter No"});
            }
        } catch (ex) {
            console.error('Exception', 'get_module_content_page_details', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/get_chapter_details', function (req, res) {
        try {
            let training_module_content = require('../models/training_module_content.js');
            let Chapter_Id = req.query['Chapter_Id'] ? parseInt(req.query['Chapter_Id']) : "";
            let Module_Id = req.query['Module_Id'] ? parseInt(req.query['Module_Id']) : "";
            let Page_Id = req.query['Page_Id'] ? parseInt(req.query['Page_Id']) : "";
            if (Chapter_Id !== '' && Module_Id !== '' && Page_Id !== '') {
                training_module_content.find({"Module_Id": Module_Id, "Chapter_No": Chapter_Id, "Page_No": Page_Id}, function (err, dbresult) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        if (dbresult.length > 0) {
                            res.json({"Status": "Success", "data": dbresult});
                        } else {
                            res.json({"Status": "Fail", "Msg": "Details Not Found."});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Please Provide Valid Content ID."});
            }
        } catch (ex) {
            console.error('Exception', 'get_Chapter_details', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/delete_record', function (req, res) {
        try {

            let collection_name = req.query["collection_name"] ? req.query["collection_name"] : "";
            let record_id = req.query["record_id"] ? parseInt(req.query["record_id"]) : "";
            let collection;
            let prop_name;
            if (record_id !== '' && collection_name !== '') {
                if (collection_name === "posp_doc_log") {
                    collection = require('../models/posp_doc_log.js');
                    prop_name = "Doc_Log_Id";
                    collection.deleteOne({"Doc_Log_Id": record_id}, function (err, numAffacted) {
                        if (err) {
                            res.json({"Status": "Fail", "Msg": err});
                        } else {
                            res.json({"Status": "Success", "Msg": "Record deleted successfully."});
                        }
                    });
                } else if (collection_name === "training_master") {
                    collection = require('../models/training_master.js');
                    prop_name = "Training_Id";
                    collection.deleteOne({"Training_Id": record_id}, function (err, numAffacted) {
                        if (err) {
                            res.json({"Status": "Fail", "Msg": err});
                        } else {
                            let  training_section_master = require('../models/training_section_master.js');
                            training_section_master.deleteMany({"Training_Id": record_id}, function (err, numAffacted) {
                                if (err) {
                                    res.json({"Status": "Fail", "Msg": err});
                                } else {
                                    res.json({"Status": "Success", "Msg": "Record deleted successfully."});
                                }
                            });
                        }
                    });
                } else if (collection_name === "training_module_master") {
                    collection = require('../models/training_module_master.js');
                    prop_name = "Training_Module_Id";
                    collection.deleteOne({"Training_Module_Id": record_id}, function (err, numAffacted) {
                        if (err) {
                            res.json({"Status": "Fail", "Msg": err});
                        } else {
                            res.json({"Status": "Success", "Msg": "Record deleted successfully."});
                        }
                    });
                } else if (collection_name === "training_module_content") {
                    collection = require('../models/training_module_content.js');
                    prop_name = "Content_Id";
                    collection.deleteOne({"Content_Id": record_id}, function (err, numAffacted) {
                        if (err) {
                            res.json({"Status": "Fail", "Msg": err});
                        } else {
                            res.json({"Status": "Success", "Msg": "Record deleted successfully."});
                        }
                    });
                } else if (collection_name === "question_master") {
                    collection = require('../models/question_master.js');
                    prop_name = "Question_Id";
                    collection.deleteOne({"Question_Id": record_id}, function (err, numAffacted) {
                        if (err) {
                            res.json({"Status": "Fail", "Msg": err});
                        } else {
                            res.json({"Status": "Success", "Msg": "Record deleted successfully."});
                        }
                    });
                } else if (collection_name === "training_section_master") {
                    collection = require('../models/training_section_master.js');
                    let Training_Id = req.query["training_id"] ? parseInt(req.query["training_id"]) : "";
                    let section_name = req.query["section_name"] ? req.query["section_name"] : "";
                    prop_name = "Section_Id";
                    collection.deleteOne({"Section_Id": record_id}, function (err, numAffacted) {
                        if (err) {
                            res.json({"Status": "Fail", "Msg": err});
                        } else {
                            training_master.findOne({"Training_Id": Training_Id}, function (err, dbres) {
                                try {
                                    if (err)
                                        res.json({"Status": "Fail", "Msg": err});
                                    if (dbres && dbres._doc) {
                                        let objdata = dbres._doc.Section;
                                        if (objdata && objdata.hasOwnProperty(section_name)) {
                                            delete objdata[section_name];
                                        }
                                        training_master.update({"Training_Id": Training_Id}, {$set: {"Section": objdata}}, function (err, numAffected) {
                                            if (err) {
                                                res.json({"Status": "Fail", "Msg": err});
                                            } else {
                                                res.json({"Status": "Success", "Msg": "Record deleted successfully."});
                                            }
                                        });
                                    } else {
                                        res.json({"Status": "Success", "Msg": "Record not found."});
                                    }
                                } catch (ex2) {
                                    res.json({"Status": "Fail", "Msg": ex2.stack});
                                }
                            });
                        }
                    });
                } else if (collection_name === "posp_training_histories") {
                    collection = require('../models/posp_training_history.js');
                    prop_name = "User_Id";
                    collection.deleteMany({"User_Id": record_id}, function (err, numAffacted) {
                        if (err) {
                            res.json({"Status": "Fail", "Msg": err});
                        } else {
                            res.json({"Status": "Success", "Msg": "Record deleted successfully."});
                        }
                    });
                } else if (collection_name === "posp_user") {
                    collection = require('../models/posp_users.js');
                    let posp_training_history = require('../models/posp_training_history.js');
                    let posp_temp_answer = require('../models/posp_temp_answer.js');
                    let examResult = require('../models/exam_result.js');
                    prop_name = "User_Id";
                    let delete_all = req.query["delete_all"] ? req.query["delete_all"] : "Yes";
                    collection.deleteOne({"User_Id": record_id}, function (err, numAffacted) {
                        if (err) {
                            res.json({"Status": "Fail", "Msg": err});
                        } else {
                            if (delete_all === "Yes") {
                                posp_document.deleteOne({"User_Id": record_id}, function (err, numAffacted) {
                                    if (err) {
                                        res.json({"Status": "Fail", "Msg": err});
                                    } else {
                                        posp_training_history.deleteMany({"User_Id": record_id}, function (err, numAffacted) {
                                            if (err) {
                                                res.json({"Status": "Fail", "Msg": err});
                                            } else {
                                                posp_temp_answer.deleteMany({"User_Id": record_id}, function (err, numAffacted) {
                                                    if (err) {
                                                        res.json({"Status": "Fail", "Msg": err});
                                                    } else {
                                                        examResult.deleteOne({"User_Id": record_id}, function (err, numAffacted) {
                                                            if (err) {
                                                                res.json({"Status": "Fail", "Msg": err});
                                                            } else {
                                                                res.json({"Status": "Success", "Msg": "Record deleted successfully."});
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            } else {
                                res.json({"Status": "Success", "Msg": "Record deleted successfully."});
                            }
                        }
                    });
                }
//                collection.deleteOne({[prop_name]: record_id}, function (err, numAffacted) {
//                    if (err) {
//                        res.json({"Status": "Fail", "Msg": err});
//                    } else {
//                        res.json({"Status": "Success", "Msg": "Record deleted successfully."});
//                    }
//                });

            } else {
                res.json({"Status": "Fail", "Msg": "Invalid Record Id or Collection name"});
            }
        } catch (ex) {
            console.error('Exception', 'get_Chapter_details', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/send_doc_rejection_mail', function (req, res) {
        try {
            let data = req.body['data'];
            let User_Id = data.User_Id ? data.User_Id : "";
            if (User_Id) {
                try {
                    client.get(config.environment.weburl + '/posps/report/email_consolidate_process?ss_id=' + User_Id + '&event_type=DOCUMENT_REJECTED', {}, function (mail_data, mail_res) {
                        console.error('SEND_DOCUMENT_REJECTION_MAIL', 'Ss_Id: ' + User_Id);
                    });
                } catch (ex) {
                    console.error('EXCEPTION_IN_SEND_DOCUMENT_REJECTION_MAIL', 'Ss_Id: ' + User_Id, ex.stack);
                }
                res.json({"Status": "Success", "Msg": "Rejection mail sent"});
            } else {
                res.json({"Status": "Fail", "Msg": "Invalid User_Id"});
            }
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/set_start_date', function (req, res) {
        try {
            let User_Id = req.query['User_Id'] ? parseInt(req.query['User_Id']) : "";
            let Start_Date = req.query['Start_Date'] ? req.query['Start_Date'] : "";
            let Status = req.query['Status'] ? req.query['Status'] : "";
            if (User_Id !== '' && Start_Date !== '') {
                let args = {
                    "Training_Start_Date": new Date(Start_Date)
                };
                posp_user.update({'User_Id': User_Id}, {$set: args}, {runValidators: true}, function (err, numAffected) {
                    if (err)
                        throw err;
                    if (numAffected && numAffected.ok === 1) {
                        res.json({"Status": "Success", "Msg": "date updated Successfully."});
                    }
                });
            } else {
                if (User_Id !== '' && Status !== '') {
                    let args = {
                        "PanCard_Status": "Approved",
                        "AadharCard_Status": "Approved",
                        "Educational_Status": "Approved"
                    };
                    posp_document.update({'User_Id': User_Id}, {$set: args}, {runValidators: true}, function (err, numAffected) {
                        if (err)
                            throw err;
                        if (numAffected && numAffected.ok === 1) {
                            res.json({"Status": "Success", "Msg": "status updated Successfully."});
                        }
                    });
                } else {
                    res.json({"Status": "Fail", "Msg": "Please Provide Valid User ID."});
                }

            }
        } catch (ex) {
            console.error('Exception', 'set date', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/complete_posp_training', function (req, res) {
        try {
            let Training_Start_Date = "", Training_End_Date = "", Posp_Name = "", Posp_Email = "", Training_Status = "";
            let User_Id = req.query['Ss_Id'] ? parseInt(req.query['Ss_Id']) : "";
            if (User_Id !== '') {
                posp_user.find({"User_Id": User_Id}, function (err, dbresult1) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        if (dbresult1.length > 0) {
                            if (dbresult1[0].First_Name && dbresult1[0].Middle_Name && dbresult1[0].Last_Name) {
                                Posp_Name = dbresult1[0].First_Name + " " + dbresult1[0].Middle_Name + " " + dbresult1[0].Last_Name;
                            } else if (dbresult1[0].First_Name && dbresult1[0].Last_Name) {
                                Posp_Name = dbresult1[0].First_Name + " " + dbresult1[0].Last_Name;
                            } else if (dbresult1[0].First_Name) {
                                Posp_Name = dbresult1[0].First_Name;
                            } else {
                                Posp_Name = "POSP";
                            }
                            Posp_Email = dbresult1[0].Email_Id;
                            Training_Status = dbresult1[0].Training_Status;
                            let start_date = new Date(dbresult1[0]._doc.Training_Start_Date);
                            Training_Start_Date = moment(start_date).format('YYYY-MM-DD');
                            let todayDate = moment().format('YYYY-MM-DD');
                            let diff = moment(todayDate).diff(moment(Training_Start_Date), 'days');
                            if (Training_Status === "Started") {

                                if (diff >= 3) {
                                    let args = {
                                        "Training_Start_Date": new Date(Training_Start_Date),
                                        "Is_Training_Completed": 'Yes',
                                        "Remaining_Hours": "00:00:00",
                                        "Completed_Hours": "30:00:00",
                                        "Training_Status": "Completed",
                                        "Training_End_Date": todayDate,
                                        "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                                    };
                                    posp_user.update({'User_Id': User_Id}, {$set: args}, {runValidators: true}, function (err, numAffected) {
                                        if (err) {
                                            res.json({"Status": "Fail", "Msg": err});
                                        } else {
                                            //sent exam due email start												
                                            Send_Pos_Exam_Due_Email(User_Id);
                                            //send exam due email finish

                                            /*
                                             let objModelEmail = new Email();
                                             var email_data = '';
                                             let objMail = {
                                             '___posp_name___': Posp_Name,
                                             '___short_url___': "https://www.policyboss.com/posp-form"
                                             };
                                             email_data = fs.readFileSync(appRoot + '/resource/request_file/Posp_Training_Complete_Mail.html').toString();
                                             email_data = email_data.replaceJson(objMail);
                                             objModelEmail.send('pospcom@policyboss.com', Posp_Email, "[POSP-ONBOARDING] POSP TRAINING COMPLETE & POSP EXAM DUE : : SSID-" + User_Id, email_data, '', config.environment.notification_email, '');
                                             */
                                            res.json({"Status": "Success", "Msg": "Training completed successfully."});
                                        }
                                    });
                                } else {
                                    diff = 3 - diff;
                                    res.json({"Status": "Success", "Msg": diff + " day/days are left to complete the training."});
                                }
                            } else {
                                res.json({"Status": "Success", "Msg": "Already completed the training."});
                            }
                        } else {
                            res.json({"Status": "Fail", "Msg": "User doesn't exist."});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Invalid User Id"});
            }
        } catch (ex) {
            console.error('Exception', 'set date', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/get_diff', function (req, res) {
        try {
            let posp_training_history = require('../models/posp_training_history.js');
            let User_Id = req.query['User_Id'] ? parseInt(req.query['User_Id']) : "";
            posp_training_history.find({'User_Id': User_Id}).sort({'Created_On': -1}).exec(function (err, dbres2) {
                if (err) {
                    res.json({"Status": "Fail", "Msg": err});
                }
                if (dbres2 && dbres2.length > 0) {
                    for (let x = 0; x < dbres2.length; x++) {
                        data2 = dbres2[x]._doc;
                        var then = moment(data2['Start_Date_Time']);
                        var now = moment(data2['End_Date_Time']);
                        var dif = moment.duration(now.diff(then));
                        console.log([dif.hours().format("hh"), dif.minutes(), dif.seconds()].join(':'));
                    }

                    res.json({"Status": "Success"});
                }
            });
        } catch (ex) {
            console.error('Exception', 'set date', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/get_api_log', function (req, res) {
        try {
            let User_Id = req.query['User_Id'] ? req.query['User_Id'] : "";
            let args = {};
            if (User_Id !== "") {
                args = {
                    "User_Id": User_Id
                };
            }
            posp_api_log.find(args).sort({'_id': -1}).exec(function (err, dbresult) {
                if (err) {
                    res.json({"Status": "Fail", "Msg": err});
                } else {
                    if (dbresult.length > 0) {
                        res.json({"Status": "Success", "data": dbresult});
                    } else {
                        res.json({"Status": "Fail", "Msg": "API Details Not Found."});
                    }
                }
            });
        } catch (ex) {
            console.error('Exception', 'get_api_log', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/get_auth', function (req, res) {
        let Authorization = 'Basic ' + new Buffer("landmark" + ':' + "EB3F67DC-750C-40F9-BBAA-5F0EBF6A67E6").toString('base64');
        console.log("Authorization : " + Authorization);
        res.json({"Status": "Success", "Auth": Authorization});
        try {

        } catch (ex) {
            console.error('Exception', 'get_section_timer', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/get_section_timer', function (req, res) {
        try {
            let posp_training_history = require('../models/posp_training_history.js');
            let User_Id = req.query['User_Id'] ? parseInt(req.query['User_Id']) : "";
            let total_sec_time_in_sec = convertToSec("15:00:00");
            if (User_Id !== "") {

                //start
                posp_training_history.find({'User_Id': User_Id}).sort({'Created_On': 1}).exec(function (err, dbres2) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    }
                    if (dbres2 && dbres2.length > 0) {                                  //
                        let GI_Timer = "00:00:00", LI_Timer = "00:00:00";
                        for (let x = 0; x < dbres2.length; x++) {
                            data2 = dbres2[x]._doc;
                            let new_time = data2['Total_Time'];
                            let LI_Timer_sec = convertToSec(LI_Timer);
                            let GI_Timer_sec = convertToSec(GI_Timer);
                            let extended_total_time_sec = convertToSec(new_time);
                            if (extended_total_time_sec > 0) {
                                if (data2['Extension_Source'] === "system") {
                                    let Total_Spent_sec = LI_Timer_sec + GI_Timer_sec;
//                                    let extended_actual_time_sec = extended_total_time_sec - Total_Spent_sec;
                                    let extended_actual_time_sec = extended_total_time_sec;
                                    if (GI_Timer_sec >= total_sec_time_in_sec && LI_Timer_sec >= total_sec_time_in_sec) {
                                        GI_Timer = "15:00:00";
                                        LI_Timer = "15:00:00";
                                    } else {
                                        if (GI_Timer_sec >= total_sec_time_in_sec) {
                                            GI_Timer_sec > total_sec_time_in_sec ? (LI_Timer_sec = LI_Timer_sec + (GI_Timer_sec - total_sec_time_in_sec), GI_Timer_sec = total_sec_time_in_sec) : GI_Timer_sec;
                                            // GI_Timer_sec === total_sec_time_in_sec && extended_actual_time_sec ? LI_Timer_sec = extended_actual_time_sec : LI_Timer_sec;
                                            LI_Timer_sec = LI_Timer_sec + extended_actual_time_sec;
                                        } else if (LI_Timer_sec >= total_sec_time_in_sec) {
                                            LI_Timer_sec > total_sec_time_in_sec ? (GI_Timer_sec = GI_Timer_sec + (LI_Timer_sec - total_sec_time_in_sec), LI_Timer_sec = total_sec_time_in_sec) : LI_Timer_sec;
                                            GI_Timer_sec = GI_Timer_sec + extended_actual_time_sec;
                                        } else
                                        {
                                            //No section is completed
                                            let GI_Req_sec = total_sec_time_in_sec - GI_Timer_sec;
                                            let LI_Req_sec = total_sec_time_in_sec - LI_Timer_sec;
                                            let divided_extended_sec = (extended_actual_time_sec / 2);
                                            if (LI_Req_sec > divided_extended_sec) {
                                                LI_Timer_sec = LI_Timer_sec + divided_extended_sec;
                                            } else {
                                                LI_Timer_sec = LI_Timer_sec + LI_Req_sec;
                                                GI_Timer_sec = GI_Timer_sec + (divided_extended_sec - LI_Req_sec);
                                            }
                                            if (GI_Req_sec > divided_extended_sec) {
                                                GI_Timer_sec = GI_Timer_sec + divided_extended_sec;
                                            } else {
                                                GI_Timer_sec = GI_Timer_sec + GI_Req_sec;
                                                LI_Timer_sec = LI_Timer_sec + (divided_extended_sec - GI_Req_sec);
                                            }

                                        }
                                    }
                                    GI_Timer = convertToHours(GI_Timer_sec);
                                    LI_Timer = convertToHours(LI_Timer_sec);
                                } else {
                                    //Extension_Source === User
                                    var times = [0, 0, 0];
                                    var max = times.length;
                                    let a = [];
                                    if (data2['Section_Name'] === "Life Insurance" || data2['Section_Id'] === 20) {
                                        a = (LI_Timer || '').split(':');
                                    } else {
                                        a = (GI_Timer || '').split(':');
                                    }
                                    var b = (new_time || '').split(':');
                                    // normalize time values
                                    for (var i = 0; i < max; i++) {
                                        a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i]);
                                        b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i]);
                                    }
                                    // store time values
                                    for (var i = 0; i < max; i++) {
                                        times[i] = a[i] + b[i];
                                    }
                                    var hours = times[0];
                                    var minutes = times[1];
                                    var seconds = times[2];
                                    if (seconds >= 60) {
                                        var m = (seconds / 60) << 0;
                                        minutes += m;
                                        seconds -= 60 * m;
                                    }
                                    if (minutes >= 60) {
                                        var h = (minutes / 60) << 0;
                                        hours += h;
                                        minutes -= 60 * h;
                                    }
                                    let current_timer = ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
                                    if (GI_Timer_sec >= total_sec_time_in_sec && LI_Timer_sec >= total_sec_time_in_sec) {
                                        GI_Timer = "15:00:00";
                                        LI_Timer = "15:00:00";
                                    } else {
                                        if (data2['Section_Name'] === "Life Insurance" || data2['Section_Id'] === 20) {
                                            LI_Timer = current_timer;
                                            let LI_sec = convertToSec(LI_Timer);
                                            if (LI_sec > total_sec_time_in_sec) {
                                                let sec_to_be_added = (LI_sec - total_sec_time_in_sec);
                                                let total_sec = (convertToSec(GI_Timer)) + sec_to_be_added;
                                                total_sec > total_sec_time_in_sec ? GI_Timer = "15:00:00" : GI_Timer = convertToHours(total_sec);
                                                LI_Timer = "15:00:00";
                                            }
                                        } else {
                                            GI_Timer = current_timer;
                                            let GI_sec = convertToSec(GI_Timer);
                                            if (GI_sec > total_sec_time_in_sec) {
                                                let sec_to_be_added = ((convertToSec(GI_Timer)) - total_sec_time_in_sec);
                                                let total_sec = (convertToSec(LI_Timer)) + sec_to_be_added;
                                                total_sec > total_sec_time_in_sec ? LI_Timer = "15:00:00" : LI_Timer = convertToHours(total_sec);
                                                GI_Timer = "15:00:00";
                                            }
                                        }
                                    }

                                }
                            }
                            if (x === (dbres2.length - 1)) {
                                let splitGI = GI_Timer.split(":");
                                let splitLI = GI_Timer.split(":");
                                (splitGI[0] === "15" || (parseInt(splitGI[0]) > 15)) ? GI_Timer = "15:00:00" : GI_Timer;
                                (splitLI[0] === "15" || (parseInt(splitLI[0]) > 15)) ? LI_Timer = "15:00:00" : LI_Timer;
                                res.json({"Status": "Success", data: {"General_Insurance": GI_Timer, "Life_Insurance": LI_Timer}});
                            }
                        }
                    } else {
                        res.json({"Status": "Fail", "Msg": "Training history not available."});
                    }
                });
                //end
            } else {
                res.json({"Status": "Fail", "Msg": "User ID not found"});
            }
        } catch (ex) {
            console.error('Exception', 'get_section_timer', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    function calculate_section_timings(req, res, next) {
        try {
            let posp_training_history = require('../models/posp_training_history.js');
            let User_Id = req.query['User_Id'] ? parseInt(req.query['User_Id']) : "";
            let total_sec_time_in_sec = convertToSec("15:00:00"), tr_timer = "00:00:00";
            if (User_Id !== "") {

                //start
                posp_user.find({"User_Id": User_Id}, function (err, dbresult1) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        if (dbresult1.length > 0) {
                            tr_timer = dbresult1[0].Completed_Hours;
                        }
                        posp_training_history.find({'User_Id': User_Id}).sort({'Created_On': 1}).exec(function (err, dbres2) {
                            if (err) {
                                res.json({"Status": "Fail", "Msg": err});
                            }
                            if (dbres2 && dbres2.length > 0) {                                  //
                                let GI_Timer = "00:00:00", LI_Timer = "00:00:00";
                                for (let x = 0; x < dbres2.length; x++) {
                                    data2 = dbres2[x]._doc;
                                    let new_time = data2['Total_Time'];
                                    let LI_Timer_sec = convertToSec(LI_Timer);
                                    let GI_Timer_sec = convertToSec(GI_Timer);
                                    let extended_total_time_sec = convertToSec(new_time);
                                    if (extended_total_time_sec > 0) {
                                        if (data2['Extension_Source'] === "system") {
                                            let Total_Spent_sec = LI_Timer_sec + GI_Timer_sec;
                                            let extended_actual_time_sec = extended_total_time_sec - Total_Spent_sec;
                                            if (GI_Timer_sec >= total_sec_time_in_sec && LI_Timer_sec >= total_sec_time_in_sec) {
                                                GI_Timer = "15:00:00";
                                                LI_Timer = "15:00:00";
                                            } else {
                                                if (GI_Timer_sec >= total_sec_time_in_sec) {
                                                    GI_Timer_sec > total_sec_time_in_sec ? (LI_Timer_sec = LI_Timer_sec + (GI_Timer_sec - total_sec_time_in_sec), GI_Timer_sec = total_sec_time_in_sec) : GI_Timer_sec;
                                                    // GI_Timer_sec === total_sec_time_in_sec && extended_actual_time_sec ? LI_Timer_sec = extended_actual_time_sec : LI_Timer_sec;
                                                    LI_Timer_sec = LI_Timer_sec + extended_actual_time_sec;
                                                } else if (LI_Timer_sec >= total_sec_time_in_sec) {
                                                    LI_Timer_sec > total_sec_time_in_sec ? (GI_Timer_sec = GI_Timer_sec + (LI_Timer_sec - total_sec_time_in_sec), LI_Timer_sec = total_sec_time_in_sec) : LI_Timer_sec;
                                                    GI_Timer_sec = GI_Timer_sec + extended_actual_time_sec;
                                                } else
                                                {
                                                    //No section is completed
                                                    let GI_Req_sec = total_sec_time_in_sec - GI_Timer_sec;
                                                    let LI_Req_sec = total_sec_time_in_sec - LI_Timer_sec;
                                                    let divided_extended_sec = (extended_actual_time_sec / 2);
                                                    if (LI_Req_sec > divided_extended_sec) {
                                                        LI_Timer_sec = LI_Timer_sec + divided_extended_sec;
                                                    } else {
                                                        LI_Timer_sec = LI_Timer_sec + LI_Req_sec;
                                                        GI_Timer_sec = GI_Timer_sec + (divided_extended_sec - LI_Req_sec);
                                                    }
                                                    if (GI_Req_sec > divided_extended_sec) {
                                                        GI_Timer_sec = GI_Timer_sec + divided_extended_sec;
                                                    } else {
                                                        GI_Timer_sec = GI_Timer_sec + GI_Req_sec;
                                                        LI_Timer_sec = LI_Timer_sec + (divided_extended_sec - GI_Req_sec);
                                                    }

                                                }
                                            }
                                            GI_Timer = convertToHours(GI_Timer_sec);
                                            LI_Timer = convertToHours(LI_Timer_sec);
                                        } else {
                                            //Extension_Source === User
                                            var times = [0, 0, 0];
                                            var max = times.length;
                                            let a = [];
                                            if (data2['Section_Name'] === "Life Insurance" || data2['Section_Id'] === 20) {
                                                a = (LI_Timer || '').split(':');
                                            } else {
                                                a = (GI_Timer || '').split(':');
                                            }
                                            var b = (new_time || '').split(':');
                                            // normalize time values
                                            for (var i = 0; i < max; i++) {
                                                a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i]);
                                                b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i]);
                                            }
                                            // store time values
                                            for (var i = 0; i < max; i++) {
                                                times[i] = a[i] + b[i];
                                            }
                                            var hours = times[0];
                                            var minutes = times[1];
                                            var seconds = times[2];
                                            if (seconds >= 60) {
                                                var m = (seconds / 60) << 0;
                                                minutes += m;
                                                seconds -= 60 * m;
                                            }
                                            if (minutes >= 60) {
                                                var h = (minutes / 60) << 0;
                                                hours += h;
                                                minutes -= 60 * h;
                                            }
                                            let current_timer = ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
                                            if (GI_Timer_sec >= total_sec_time_in_sec && LI_Timer_sec >= total_sec_time_in_sec) {
                                                GI_Timer = "15:00:00";
                                                LI_Timer = "15:00:00";
                                            } else {
                                                if (data2['Section_Name'] === "Life Insurance" || data2['Section_Id'] === 20) {
                                                    LI_Timer = current_timer;
                                                    let LI_sec = convertToSec(LI_Timer);
                                                    if (LI_sec > total_sec_time_in_sec) {
                                                        let sec_to_be_added = (LI_sec - total_sec_time_in_sec);
                                                        let total_sec = (convertToSec(GI_Timer)) + sec_to_be_added;
                                                        total_sec > total_sec_time_in_sec ? GI_Timer = "15:00:00" : GI_Timer = convertToHours(total_sec);
                                                        LI_Timer = "15:00:00";
                                                    }
                                                } else {
                                                    GI_Timer = current_timer;
                                                    let GI_sec = convertToSec(GI_Timer);
                                                    if (GI_sec > total_sec_time_in_sec) {
                                                        let sec_to_be_added = ((convertToSec(GI_Timer)) - total_sec_time_in_sec);
                                                        let total_sec = (convertToSec(LI_Timer)) + sec_to_be_added;
                                                        total_sec > total_sec_time_in_sec ? LI_Timer = "15:00:00" : LI_Timer = convertToHours(total_sec);
                                                        GI_Timer = "15:00:00";
                                                    }
                                                }
                                            }

                                        }
                                    }
                                    if (x === (dbres2.length - 1)) {
                                        // res.json({"Status": "Success", data: {"General_Insurance": GI_Timer, "Life_Insurance": LI_Timer}});
                                        let timeAddition = addTimes(GI_Timer, LI_Timer);
                                        if (tr_timer !== timeAddition) {
                                            req.sec_total_timer = timeAddition;
                                            req.tr_timer = tr_timer;
                                            req.LI_Timer = LI_Timer;
                                            req.GI_Timer = GI_Timer;
                                            console.log("Total Section Timer : " + addTimes(GI_Timer, LI_Timer));
                                            return next();
                                        } else {
                                            res.json({"Status": "Success", data: {"General_Insurance": GI_Timer, "Life_Insurance": LI_Timer}});
                                        }
                                    }
                                }
                            } else {
                                res.json({"Status": "Fail", "Msg": "Training history not available."});
                            }
                        });
                    }
                });
                //end
            } else {
                res.json({"Status": "Fail", "Msg": "User ID not found"});
            }
        } catch (ex) {
            console.error('Exception', 'get_section_timer', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    }
    app.post('/onboarding/update_posp_details', function (req, res) {
        try {
            let User_Id = "";
            let tab_name = "";
            var posp_details = ["First_Name", "Middle_Name", "Last_Name", "Name_On_PAN", "Pan_No", "Aadhar", "Education", "Nominee_Relationship", "Birthdate", "DOB_On_PAN", "Name_On_Aadhar", "Bank_Account_No", "Ifsc_Code", "Name_as_in_Bank", "Nominee_Pan", "Nominee_Name_On_Pan", "Nominee_DOB_On_Pan", "Nominee_Name_as_in_Bank", "Nominee_Bank_Account_Number", "Nominee_Ifsc_Code","Present_Add1", "Present_Add2", "Present_Add3"];
            var basic_fields = ["User_Id", "Mobile_Number", "Email_Id", "First_Name", "Middle_Name", "Last_Name", "Gender", "Agent_City", "Telephone_No", "Education", "Birthdate", "Father_Name", "Present_Add1", "Present_Add2", "Present_Add3", "Present_Landmark", "Present_State", "Present_City", "Present_Pincode", "Permanant_Add1", "Permanant_Add2", "Permanant_Add3", "Permanant_Landmark", "Permanant_State", "Permanant_City", "Reporting_Agent_Uid", "Reporting_Agent_Name", "Reporting_Email_ID", "Reporting_Mobile_Number"];
            var posp_fields = ["Pan_No", "Name_On_PAN", "DOB_On_PAN", "Aadhar", "Name_On_Aadhar", "Education", "Name_as_in_Bank", "Account_Type", "Bank_Account_No", "Ifsc_Code", "Micr_Code", "Bank_Name", "Bank_Branch"];
            var nom_fields = ["Nominee_First_Name", "Nominee_Middle_Name", "Nominee_Last_Name", "Nominee_Pan", "Nominee_Name_On_Pan", "Nominee_DOB_On_Pan", "Nominee_Aadhar", "Nominee_Relationship", "Nominee_Gender", "Nominee_Name_as_in_Bank", "Nominee_Account_Type", "Nominee_Bank_Account_Number", "Nominee_Ifsc_Code", "Nominee_Micr_Code", "Nominee_Bank_Name", "Nominee_Bank_Branch", "Nominee_Bank_City"];
            var dataFields = {"BASIC_INFO": basic_fields, "POSP_DETAILS": posp_fields, "NOMINEE_DETAILS": nom_fields, 'POSP': posp_details};
            var updatedObj = {};
            let objRequest = req.body.posp ? req.body.posp : {};
            console.log("objRequest", objRequest);
            if (Object.keys(objRequest).length > 0) {
                User_Id = objRequest.User_Id ? objRequest.User_Id : "";
                tab_name = objRequest.tab_name ? objRequest.tab_name : "";
                console.log(User_Id, tab_name);
                let fields_to_update = [];
                if (User_Id !== "") {
                    if (objRequest.hasOwnProperty("bulk_update") && objRequest.bulk_update === "Yes") {
                        fields_to_update.push(dataFields["BASIC_INFO"], dataFields["POSP_DETAILS"], dataFields["NOMINEE_DETAILS"]);
                        for (let i = 0; i < 3; i++) {
                            fields_to_update[i].forEach((item) => {
                                if (objRequest[item]) {
                                    updatedObj[item] = objRequest[item];
                                }
                            });
                        }
                        delete updatedObj["Reporting_Agent_Uid"];
                    } else {
                        if (tab_name) {
                            fields_to_update = dataFields[tab_name];
                            fields_to_update.forEach((item) => {
                                if (objRequest[item]) {
                                    updatedObj[item] = objRequest[item];
                                }
                            });
                        }
                    }
                    console.log(updatedObj);
                    posp_user.update({'User_Id': User_Id}, {$set: updatedObj}, {runValidators: true}, function (err, numAffected) {
                        if (err) {
                            res.json({"Status": "Fail", "Msg": err});
                        } else {
                            res.json({"Status": "Success", "Msg": 'POSP details updated successfully'});
                        }
                    });
                } else {
                    res.json({"Status": "Fail", "Msg": "Unsufficient details to update data."});
                }
            } else {
                res.json({"Status": "Fail", "Msg": "Data not found."});
            }
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/add_extension', function (req, res) {
        try {
            let posp_training_history = require('../models/posp_training_history.js');
            let User_Id = req.query['User_Id'] ? parseInt(req.query['User_Id']) : "";
            let extension = req.query['Extension'] ? req.query['Extension'] : "";
            let total_ext_in_sec = convertToSec(extension);
            if (User_Id !== "" && extension !== "") {
                posp_training_history.find({'User_Id': User_Id}).sort({'Created_On': -1}).exec(function (err, dbres2) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    }
                    if (dbres2 && dbres2.length > 0) {
                        let last_log_entry = dbres2[0]._doc;
                        let time_spent_in_sec = convertToSec(last_log_entry["Total_Time"]);
                        let updated_sec = total_ext_in_sec + time_spent_in_sec;
                        let updated_time = convertToHours(updated_sec);
                        posp_training_history.update({'_id': last_log_entry['_id']}, {$set: {'Total_Time': updated_time}}, {runValidators: true}, function (err, dbres) {
                            if (err) {
                                res.json({"Status": "Fail", "Msg": err});
                            } else {
                                posp_user.find({"User_Id": User_Id}, function (err, dbresult) {
                                    if (err) {
                                        res.json({"Status": "Fail", "Msg": err});
                                    } else {
                                        if (dbresult && dbresult.length > 0) {
                                            let data = dbresult[0]._doc;
                                            let completed_hrs_sec = convertToSec(data["Completed_Hours"]);
                                            let updated_main_sec = total_ext_in_sec + completed_hrs_sec;
                                            let updated_hrs = convertToHours(updated_main_sec);
                                            let rem_hrs = calRemainingTime(updated_main_sec);
                                            posp_user.update({'User_Id': User_Id}, {$set: {'Completed_Hours': updated_hrs, 'Remaining_Hours': rem_hrs}}, function (err, numAffected) {
                                                if (err) {
                                                    res.json({"Status": "Fail", "Msg": err});
                                                } else {
                                                    res.json({"Status": "Success", "Msg": "Extension addded successfully"});
                                                }
                                            });
                                            //update end
                                        }
                                    }
                                });
                            }

                        });
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "User ID not found"});
            }
        } catch (ex) {
            console.error('Exception', 'add_extension', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/update_posp_document_details', function (req, res) {
        let User_Id = req.body.hasOwnProperty("User_Id") ? parseInt(req.body['User_Id']) : "";
        let PanCard_Number = req.body.hasOwnProperty("Pan_No") ? req.body['Pan_No'] : "";
        let Aadhaar_No = req.body.hasOwnProperty("Aadhaar_No") ? req.body['Aadhaar_No'] : "";
        let Posp_Name = req.body.hasOwnProperty("Posp_Name") ? req.body['Posp_Name'] : "";
        let Posp_Addr = req.body.hasOwnProperty("Posp_Addr") ? req.body['Posp_Addr'] : "";
        let Mobile_Number = req.body.hasOwnProperty("Mobile_Number") ? req.body['Mobile_Number'] : "";
        let Posp_Email = req.body.hasOwnProperty("Posp_Email") ? req.body['Posp_Email'] : "";
        let Profile = req.body.hasOwnProperty("Profile") ? req.body['Profile'] : "";
        var PanPattern = new RegExp('^[a-zA-Z]{3}[P]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}$');
        var aadharPattern = new RegExp('^[0-9]{12}$');
        try {
            if (User_Id) {
                posp_document.findOne({"User_Id": User_Id}, function (err, dbresult) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        if (dbresult && dbresult._doc) {
                            let data = dbresult._doc;
                            let UploadedFiles = data["UploadedFiles"] && data["UploadedFiles"]["UploadedFiles"] ? data["UploadedFiles"]["UploadedFiles"] : {};
                            let args = {}, posp_args = {};
                            if (Posp_Name) {
                                let split_posp_names = Posp_Name.split(" ");
                                if (split_posp_names.length === 1) {
                                    posp_args["First_Name"] = split_posp_names[0].toUpperCase();
                                } else if (split_posp_names.length === 2) {
                                    posp_args["First_Name"] = split_posp_names[0].toUpperCase();
                                    posp_args["Last_Name"] = split_posp_names[1].toUpperCase();
                                } else if (split_posp_names.length > 2) {
                                    posp_args["First_Name"] = split_posp_names[0].toUpperCase();
                                    posp_args["Middle_Name"] = split_posp_names[1].toUpperCase();
                                    posp_args["Last_Name"] = split_posp_names[2].toUpperCase();
                                }
                            }
                            PanCard_Number ? (args["PanCard_Number"] = PanCard_Number.toUpperCase(), posp_args["Pan_No"] = PanCard_Number.toUpperCase()) : "";
                            Mobile_Number ? (args["Mobile_Number"] = Mobile_Number, posp_args["Mobile_Number"] = Mobile_Number) : "";
                            Aadhaar_No ? (args["AadharCard_Number"] = Aadhaar_No, posp_args["Aadhar"] = Aadhaar_No) : "";
                            Posp_Name ? (args["Name_On_PanCard"] = Posp_Name.toUpperCase()) : "";
                            Posp_Addr ? (args["Address"] = capitalizeFirstLetter(Posp_Addr), posp_args["Present_Add1"] = capitalizeFirstLetter(Posp_Addr), posp_args["Permanant_Add1"] = capitalizeFirstLetter(Posp_Addr)) : "";
                            Posp_Email ? (args["Email"] = Posp_Email.toLowerCase(), posp_args["Email_Id"] = Posp_Email.toLowerCase()) : "";
                            Profile ? UploadedFiles["Profile_Photo"] = Profile : "";
                            args["UploadedFiles"] = {
                                "UploadedFiles": UploadedFiles
                            };
                            console.log("args : " + JSON.stringify(args));
                            posp_document.update({"User_Id": User_Id}, {$set: args}, function (err, numAffected) {
                                if (err) {
                                    res.json({"Status": "Fail", "Msg": "Error in adding posp details", "data": err});
                                } else {
                                    posp_user.update({"User_Id": User_Id}, {$set: posp_args}, function (err, numAffected) {
                                        if (err) {
                                            res.json({"Status": "Fail", "Msg": "Error in adding posp details", "data": err});
                                        } else {
                                            res.json({"Status": "Success", "Msg": "POSP details updated successfully"});
                                        }
                                    });
                                }
                            });
                        } else {
                            let args = {
                                "User_Id": User_Id,
                                "Mobile_Number": Mobile_Number,
                                "PanCard_Number": PanCard_Number,
                                "AadharCard_Number": Aadhaar_No,
                                "Name_On_PanCard": Posp_Name,
                                "Address": Posp_Addr,
                                "Email": Posp_Email,
                                "UploadedFiles": {
                                    "UploadedFiles": {
                                        "Profile_Photo": Profile
                                    }
                                }
                            };
                            let posp_documentObj = new posp_document(args);
                            posp_documentObj.save(function (err, dbres2) {
                                if (err) {
                                    res.json({"Status": "Fail", "Msg": "POSP details not added.", "data": err});
                                } else {
                                    res.json({"Status": "Success", "Msg": "POSP details updated successfully."});
                                }
                            });
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Invalid User Id."});
            }
        } catch (ex) {
            console.error('Exception', 'update_posp_details', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/middleware-demo', mid1, mid2, function (req, res) {
        let user_id = req.query.User_Id;
        console.log("User ID : " + user_id);
    });
    function mid1(req, res) {
        let user_id = req.query.User_Id;
        console.log("mid 1 User ID : " + user_id);
        return next();
    }
    function mid2(req) {
        let user_id = req.query.User_Id;
        console.log("mid 2 User ID : " + user_id);
        return next();
    }
    app.get('/onboarding/posp_training_histories', (req, res) => {
        try {
            let Posp_Training_History = require('../models/posp_training_history.js');
            let objRequestCore = req.query;
            let User_Id = objRequestCore.hasOwnProperty('ss_id') ? parseInt(objRequestCore['ss_id']) : '';
            if (User_Id) {
                Posp_Training_History.find({User_Id: User_Id, Extension_Source: "system"}, {_id: 0, Start_Date_Time: 1, End_Date_Time: 1}, function (posp_training_history_err, posp_training_history_data) {
                    if (posp_training_history_err) {
                        res.json({"Status": "Fail", "Msg": posp_training_history_err});
                    } else {
                        if (posp_training_history_data.length > 0) {
                            posp_training_history_data.forEach((obj) => {
                                obj.Start_Date_Time = moment(obj.Start_Date_Time, 'ddd MMM DD YYYY HH:mm:ss GMT+0530').format("MM/DD/YYYY hh:mm:ss A");
                                obj.End_Date_Time = moment(obj.End_Date_Time, 'ddd MMM DD YYYY HH:mm:ss GMT+0530').format("MM/DD/YYYY hh:mm:ss A");
                            })
                            res.json(JSON.parse(JSON.stringify(posp_training_history_data).replaceAll('Start_Date_Time', 'StartDate').replaceAll('End_Date_Time', 'EndDate')));
                        } else {
                            res.json({"Status": "Fail", "Msg": "User Id is missing."});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "SS Id is missing."});
            }
        } catch (e) {
            console.error('Exception', '/onboarding/posp_training_histories', e);
            res.json({"Status": "Fail", "Msg": e.stack});
        }
    });
    app.post('/onboarding/update_scheduled_posps', function (req, res) {
        try {
            let client = new Client();
            let posp_list = req.body.posp_list;
            let arr = posp_list.split(",");
            let success_count_data = 0;
            let fail_count_data = 0;
            for (var x = 0; x < arr.length; x++) {
                let args = {
                    data: {
                        'Ss_Id': arr[x],
                        'Send_Mail': "No"
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }
                };
                client.post(config.environment.weburl + "/onboarding/schedule_posp_training", args, function (data, response) {
                    if (data.Status === "Success") {
                        success_count_data++;
                    } else {
                        fail_count_data++;
                    }
                });
                sleep(3000);
                if (x === (arr.length - 1))
                {
                    res.send({'Status': "Success", "Msg": 'POSP details updated successfully.', "Success_Count": success_count_data, "Fail_Count": fail_count_data});
                }
            }
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/add_posp_details', function (req, res) {
        let User_Id = req.body['User_Id'] ? parseInt(req.body['User_Id']) : "";
        let PanCard_Number = req.body['Pan_No'] ? req.body['Pan_No'] : "";
        let Aadhaar_No = req.body['Aadhaar_No'] ? req.body['Aadhaar_No'] : "";
        let Posp_Name = req.body['Posp_Name'] ? req.body['Posp_Name'] : "";
        let Posp_Addr = req.body['Posp_Addr'] ? req.body['Posp_Addr'] : "";
        let Mobile_Number = req.body['Mobile_Number'] ? req.body['Mobile_Number'] : "";
        let Posp_Email = req.body['Posp_Email'] ? req.body['Posp_Email'] : "";
        let Profile = req.body['Profile'] ? req.body['Profile'] : "";
        var PanPattern = new RegExp('^[a-zA-Z]{3}[P]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}$');
        var aadharPattern = new RegExp('^[0-9]{12}$');
        try {
            if (User_Id !== "" && PanCard_Number !== "" && Aadhaar_No !== "" && Posp_Name !== "" && Mobile_Number !== "" && Posp_Email !== "") {

                if (PanPattern.test(PanCard_Number) && aadharPattern.test(Aadhaar_No)) {
                    posp_document.find({"User_Id": User_Id}, function (err, dbresult) {
                        if (err) {
                            res.json({"Status": "Fail", "Msg": err});
                        } else {
                            if (dbresult.length > 0) {
                                let data = dbresult[0]._doc;
                                let args = {};
                                data.hasOwnProperty('Mobile_Number') && data.Mobile_Number === "" ? args["Mobile_Number"] = Mobile_Number : data.hasOwnProperty('Mobile_Number') && data.Mobile_Number !== "" ? "" : args["Mobile_Number"] = Mobile_Number;
                                data.hasOwnProperty('PanCard_Number') && data.PanCard_Number === "" ? args["PanCard_Number"] = PanCard_Number : data.hasOwnProperty('PanCard_Number') && data.PanCard_Number !== "" ? "" : args["PanCard_Number"] = PanCard_Number;
                                data.hasOwnProperty('AadharCard_Number') && data.AadharCard_Number === "" ? args["AadharCard_Number"] = Aadhaar_No : data.hasOwnProperty('AadharCard_Number') && data.AadharCard_Number !== "" ? "" : args["AadharCard_Number"] = Aadhaar_No;
                                data.hasOwnProperty('Name_On_PanCard') && data.Name_On_PanCard === "" ? args["Name_On_PanCard"] = Posp_Name : data.hasOwnProperty('Name_On_PanCard') && data.Name_On_PanCard !== "" ? "" : args["Name_On_PanCard"] = Posp_Name;
                                data.hasOwnProperty('Address') && data.Address === "" ? args["Address"] = Posp_Addr : data.hasOwnProperty('Address') && data.Address !== "" ? "" : args["Address"] = Posp_Addr;
                                data.hasOwnProperty('Email') && data.Email === "" ? args["Email"] = Posp_Email : data.hasOwnProperty('Email') && data.Email !== "" ? "" : args["Email"] = Posp_Email;
                                if (data.hasOwnProperty('UploadedFiles') && data.UploadedFiles && data.UploadedFiles.UploadedFiles && data.UploadedFiles.UploadedFiles.Profile_Photo) {
                                    if (data.UploadedFiles.UploadedFiles.Profile_Photo === "") {
                                        let obj = {
                                            "UploadedFiles": {
                                                "Profile_Photo": Profile
                                            }
                                        };
                                        args["UploadedFiles"] = obj;
                                    }
                                } else {
                                    let obj = {
                                        "UploadedFiles": {
                                            "Profile_Photo": Profile
                                        }
                                    };
                                    args["UploadedFiles"] = obj;
                                }

                                posp_document.update({"User_Id": User_Id}, {$set: args}, function (err, numAffected) {
                                    if (err) {
                                        res.json({"Status": "Fail", "Msg": "Error in adding posp details", "data": err});
                                    } else {
                                        res.json({"Status": "Success", "Msg": "POSP details updated successfully"});
                                    }
                                });
                            } else {
                                let args = {
                                    "User_Id": User_Id,
                                    "Mobile_Number": Mobile_Number,
                                    "PanCard_Number": PanCard_Number,
                                    "AadharCard_Number": Aadhaar_No,
                                    "Name_On_PanCard": Posp_Name,
                                    "Address": Posp_Addr,
                                    "Email": Posp_Email,
                                    "UploadedFiles": {
                                        "UploadedFiles": {
                                            "Profile_Photo": Profile
                                        }
                                    }

                                };
                                let posp_documentObj = new posp_document(args);
                                posp_documentObj.save(function (err, dbres2) {
                                    if (err) {
                                        res.json({"Status": "Fail", "Msg": "POSP details not added.", "data": err});
                                    } else {
                                        res.json({"Status": "Success", "Msg": "POSP details updated."});
                                    }
                                });
                            }
                        }
                    });
                } else {
                    res.json({"Status": "Fail", "Msg": "Invalid PAN Card or AADHAR Card Number"});
                }
            } else {
                res.json({"Status": "Fail", "Msg": "User_Id / Mobile_Number / PanCard_Number / Aadhaar_No /Posp_Name / Posp_Email are mandatory fields."});
            }
        } catch (ex) {
            console.error('Exception', 'update_posp_details', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }

    });
    function addTimes(startTime, endTime) {
        var times = [0, 0, 0];
        var max = times.length;
        var a = (startTime || '').split(':');
        var b = (endTime || '').split(':');
        console.log("a", a);
        console.log("b", b);
        // normalize time values
        for (var i = 0; i < max; i++) {
            a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i]);
            b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i]);
        }

        // store time values
        for (var i = 0; i < max; i++) {
            times[i] = a[i] + b[i];
        }

        var hours = times[0];
        var minutes = times[1];
        var seconds = times[2];
        console.log("sec", seconds);
        console.log("min", minutes);
        console.log("hrs", hours);
        if (seconds >= 60) {
            var m = (seconds / 60) << 0;
            minutes += m;
            seconds -= 60 * m;
        }

        if (minutes >= 60) {
            var h = (minutes / 60) << 0;
            hours += h;
            minutes -= 60 * h;
        }
        console.log(('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2));
        return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
    };
    app.post('/onboarding/slot_adjustment', function (req, res) {
        let posp_training_history = require('../models/posp_training_history.js');
        const today = new Date().toDateString();
        let all_hist_obj = [];
        let last_day = "", second_day = "", first_day = "";
        let datesArr = [];
        let start_time_arr = ["07:00", "07:10", "07:15", "07:20", "7:30", "07:45", "08:00", "08:15", "08:30", "08:45", "08:45", "09:00", "09:05"];
        let time_gap_arr = [60, 40, 50, 35, 15, 20, 25, 10, 30];
        let time_add_arr = [40, 45, 50, 55, 60, 35];
        let User_Id = req.body.User_Id ? parseInt(req.body.User_Id) : "";
        let Required_Hours = req.body.Required_Hours ? req.body.Required_Hours : "";
        let training_start_date = req.body.Training_Start_Date ? req.body.Training_Start_Date : "";
        let Required_Sec = convertToSec(Required_Hours);
        let Remaining_Sec = Required_Sec;
        Remaining_Sec = 36000;
        try {
            const random = Math.floor(Math.random() * start_time_arr.length);
            let start_time = start_time_arr[random].split(":");
            let new_hr = (parseInt(start_time[0]) < 10) ? parseInt(start_time[0].replace('0', '')) : parseInt(start_time[0]);
            let new_min = (parseInt(start_time[1]) < 10) ? parseInt(start_time[1].replace('0', '')) : parseInt(start_time[1]);
            if (Required_Hours === "20:00:00") {
                second_day = moment(moment(training_start_date, 'YYYY-MM-DD HH:mm:ss').add(1, "days").format("ddd MMM DD YYYY 00:00:00")).add(new_hr, 'hours').add(new_min, 'minutes').toLocaleString();
                first_day = moment(moment(training_start_date, 'YYYY-MM-DD HH:mm:ss').format("ddd MMM DD YYYY 00:00:00")).add(new_hr, 'hours').add(new_min, 'minutes').toLocaleString();
                datesArr.push(first_day, second_day);
            } else if (Required_Hours === "30:00:00") {
                last_day = moment(moment(training_start_date, 'YYYY-MM-DD HH:mm:ss').add(2, "days").format("ddd MMM DD YYYY 00:00:00")).add(new_hr, 'hours').add(new_min, 'minutes').toLocaleString();
                second_day = moment(moment(training_start_date, 'YYYY-MM-DD HH:mm:ss').add(1, "days").format("ddd MMM DD YYYY 00:00:00")).add(new_hr, 'hours').add(new_min, 'minutes').toLocaleString();
                first_day = moment(moment(training_start_date, 'YYYY-MM-DD HH:mm:ss').format("ddd MMM DD YYYY 00:00:00")).add(new_hr, 'hours').add(new_min, 'minutes').toLocaleString();
                datesArr.push(first_day, second_day, last_day);
            } else if (Required_Hours === "10:00:00") {
                first_day = moment(moment().subtract(1, "days").format("ddd MMM DD YYYY 00:00:00")).add(new_hr, 'hours').add(new_min, 'minutes').toLocaleString();
                datesArr.push(first_day);
            }

            if (datesArr.length > 0) {
                //get Spent Time
                let hrCounter = 0;
                while (Remaining_Sec > 0) {
                    const random_time_add = Math.floor(Math.random() * time_add_arr.length);
                    let time_addition = (time_add_arr[random_time_add]);
                    const random_time_gap = Math.floor(Math.random() * time_gap_arr.length);
                    let time_gap = time_gap_arr[random_time_gap];
                    let new_datesArr = [];
                    for (var x = 0; x < datesArr.length; x++) {

                        if (time_gap === 60) {
                            if (hrCounter < 3) {
                                time_gap = 60;
                                hrCounter++;
                            } else {
                                time_gap = 10;
                            }
                        }
                        let end_date = (moment(datesArr[x], "ddd MMM DD YYYY HH:mm:ss").add(time_addition, 'minutes')).toLocaleString();
                        let new_start_date = (moment(end_date, "ddd MMM DD YYYY HH:mm:ss").add(time_gap, 'minutes')).toLocaleString();
                        new_datesArr.push(new_start_date);
                        let argsObj = {};
                        argsObj['User_Id'] = User_Id;
                        argsObj['Created_On'] = new Date(datesArr[x]);
                        argsObj['Modified_On'] = new Date(end_date);
                        argsObj['Extension_Source'] = 'system';
                        argsObj['Total_Time'] = "00:" + time_addition + ":00";
                        argsObj['Start_Date_Time'] = datesArr[x];
                        argsObj['End_Date_Time'] = end_date;
                        all_hist_obj.push(argsObj);
                    }
                    datesArr = new_datesArr;
                    Remaining_Sec = Remaining_Sec - ((parseInt(time_addition)) * 60);
                }
                //updateRecords
                for (let y = 0; y < all_hist_obj.length; y++) {
                    let posp_training_historyObj = new posp_training_history(all_hist_obj[y]);
                    posp_training_historyObj.save(function (err, result) {
                        if (err) {
                            res.json({"Status": "Fail", "Msg": err});
                        } else {
                            res.json({"Status": "Success", "Msg": "Training history saved succesfully."});
                        }
                    });
                }
            } else {
                res.json({"Status": "Success", "Msg": "Training history saved succesfully."});
            }
        } catch (ex) {
            console.error('Exception', 'get_training_section', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/update_training_histories_NIU', function (req, res) {
        try {
            let Client = require('node-rest-client').Client;
            let client = new Client();
            let objRequest = req.query;
            let args = {};
            let all_hist_obj = [];
            let start_time_arr = ["07:00", "07:10", "07:15", "07:20", "7:30", "07:45", "08:00", "08:15", "08:30"];
            //let cond_date = new Date(Date.now() - 72 * 60 * 60 * 1000);
			let cond_date = new Date(moment(moment().valueOf() - 72 * 60 * 60 * 1000).format("YYYY-MM-DDTHH:mm:ss[Z]"));
            console.error("cond_date : ", cond_date);
            let Mail_Send_Flag = objRequest.hasOwnProperty('Send_Mail') ? objRequest.Send_Mail : "Yes";

            if (objRequest.Ss_Id && objRequest.Status) {
                args = {
                    "User_Id": objRequest.Ss_Id - 0,
                    "Training_Status": objRequest.Status,
                    "Training_Start_Date": {$lt: cond_date}
                };
            } else if (objRequest.Ss_Id) {
                args = {
                    "User_Id": objRequest.Ss_Id - 0,
                    "Training_Start_Date": {$lt: cond_date}
                };
            } else if (objRequest.Status) {
                args = {
                    "Training_Status": objRequest.Status,
                    "Training_Start_Date": {$lt: cond_date}
                };
            } else {
                args = {
                    "Training_Status": "Started",
                    "Training_Start_Date": {$lt: cond_date}
                };
            }
            console.error('Onboarding Training start Data', args);
            posp_user.find(args).sort({'_id': -1}).exec(function (err, db_posp_user) {
                if (err) {
                    res.json({"Status": "Fail", "Msg": err});
                } else {
                    try {
                        if (db_posp_user && db_posp_user.length > 0) {
                            for (let i = 0; i < db_posp_user.length; i++) {
                                let posp_user_data = db_posp_user[i]._doc;
                                let User_Id = posp_user_data['User_Id'];
                                let Posp_Name = (posp_user_data.First_Name && posp_user_data.Middle_Name && posp_user_data.Last_Name) ? posp_user_data.First_Name + " " + posp_user_data.Middle_Name + " " + posp_user_data.Last_Name : posp_user_data.First_Name && posp_user_data.Last_Name ? posp_user_data.First_Name + " " + posp_user_data.Last_Name : posp_user_data.First_Name ? posp_user_data.First_Name : "POSP";
                                let Posp_Email = posp_user_data.Email_Id;
                                let Training_Start_Date = (moment(posp_user_data['Training_Start_Date'], "YYYY-MM-DDTHH:mm:ss[Z]"))._d;
                                let Training_Status = posp_user_data['Training_Status'];
                                let UploadedDateAt_IIB = posp_user_data['POSP_UploadingDateAtIIB'] ? posp_user_data['POSP_UploadingDateAtIIB'] : "";
                                let Training_End_Date = (moment.utc(Training_Start_Date, "YYYY-MM-DDTHH:mm:ss[Z]").add(72, 'hours'))._d;
                                console.log('Training_Start_Date', Training_Start_Date);
                                console.log('Training_End_Date', Training_End_Date);
                                let start_date = moment(Training_Start_Date).format('YYYY-MM-DD');
                                let temp_end_date = moment(Training_End_Date).format('YYYY-MM-DD');
                                let no_of_days = moment(temp_end_date).diff(moment(start_date), 'days') + 1;
                                let fist_day_hours = 0;
                                let fourth_day_hours = 0;
                                let day_start_date = "", start_time = "", day = 0, day_end_date = "", end_time = "", required_sec = 0;
                                let timeDiff = moment(Training_Start_Date).endOf('day') - Training_Start_Date;
                                let dur = moment.duration(timeDiff);
                                console.log(`${dur.hours()} hrs ${dur.minutes()} min ${dur.seconds()} sec until midnight.`);
                                if (no_of_days === 4)
                                {
                                    fist_day_hours = dur.hours();
                                    fist_day_hours >= 10 ? no_of_days = 3 : (fourth_day_hours = 10 - fist_day_hours);
                                } else if (no_of_days === 3) {
                                    fist_day_hours = (dur.hours());
                                }
                                sleep(1000);
                                for (var x = 1; x <= no_of_days; x++) {
                                    const random = Math.floor(Math.random() * start_time_arr.length);
                                    start_time = start_time_arr[random].split(":");
                                    if (x === 1) {//adjustment
                                        day_start_date = (moment(Training_Start_Date, 'YYYY-MM-DDTHH:mm:ss[Z]'))._d;
                                        start_time = moment.utc(moment(day_start_date, 'YYYY-MM-DDTHH:mm:ss')).format("HH:mm");
                                        start_time = start_time.split(":");
                                        console.log("start_time : ", start_time);
                                        required_sec = fist_day_hours * 60 * 60;
                                        day = 1;
                                    }
                                    if (x === 2) {//adjustment
                                        day_start_date = (moment(Training_Start_Date, 'YYYY-MM-DDTHH:mm:ss[Z]').add(1, "days").format("YYYY-MM-DDT00:00:00[Z]"));
                                        required_sec = 36000;
                                        day = 2;
                                    }
                                    if (x === 3) {//adjustment
                                        day_start_date = (moment(Training_Start_Date, 'YYYY-MM-DDTHH:mm:ss[Z]').add(2, "days").format("YYYY-MM-DDT00:00:00[Z]"));
                                        required_sec = 36000;
                                        day = 3;
                                    }
                                    if (x === 4) {//adjustment
                                        day_start_date = (moment(Training_Start_Date, 'YYYY-MM-DDTHH:mm:ss[Z]').add(3, "days").format("YYYY-MM-DDT00:00:00[Z]"));
                                        required_sec = fourth_day_hours * 60 * 60;
                                        day = 4;
                                    }

                                    let args = {
                                        data: {
                                            'User_Id': User_Id,
                                            'Start_Time': start_time,
                                            'Required_Seconds': required_sec,
                                            'Training_Start_Date': day_start_date,
                                            'Day': day,
                                            'Total_Training_Days': no_of_days
                                        },
                                        headers: {
                                            "Content-Type": "application/json"
                                        }
                                    };
                                    client.post(config.environment.weburl + "/onboarding/slot_log_allotment", args, function (data, response) {
                                        if (data.Status === "Success") {
                                            if (data.hasOwnProperty("Training_End_Date") && data.Training_End_Date) {
                                                let posp_args = {};
                                                if (Training_Status === "Completed") {
                                                    posp_args = {"Training_End_Date": data.Training_End_Date};
                                                } else {
                                                    posp_args = {'Completed_Hours': "30:00:00", 'Remaining_Hours': "00:00:00", "Is_Training_Completed": 'Yes', "Training_Status": "Completed", "Training_End_Date": data.Training_End_Date, "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")};
                                                }

                                                posp_user.update({'User_Id': User_Id}, {$set: posp_args}, function (err, numAffected) {
                                                    if (err) {
                                                        res.json({"Status": "Fail", "Msg": err});
                                                    } else {
                                                        try {
                                                            client.get(config.environment.weburl + "/posps/mssql/sync_training_date?ss_id=" + User_Id, {}, function (sync_training_date_data, sync_training_date_response) {
                                                                console.error({"Status": "Success", "Msg": "sync_training_date called.", "Data": sync_training_date_data});
                                                            });
                                                        } catch (ee) {
                                                            console.error('sync_training_date Error', ee.stack);
                                                        }
                                                        if (Training_Status === "Started" && Mail_Send_Flag === "Yes" && UploadedDateAt_IIB) {
                                                            console.log("Training Completed inside mail");
                                                            //sent exam due email start												
                                                            Send_Pos_Exam_Due_Email(User_Id);
                                                            //send exam due email finish

                                                            /*let objModelEmail = new Email();
                                                             var email_data = '';
                                                             let objMail = {
                                                             '___posp_name___': Posp_Name,
                                                             '___short_url___': "https://www.policyboss.com/posp-form"
                                                             };
                                                             email_data = fs.readFileSync(appRoot + '/resource/request_file/Posp_Training_Complete_Mail.html').toString();
                                                             email_data = email_data.replaceJson(objMail);
                                                             objModelEmail.send('pospcom@policyboss.com', Posp_Email, "[POSP-ONBOARDING] POSP TRAINING COMPLETE & POSP EXAM DUE : : SSID-" + User_Id, email_data, '', config.environment.notification_email, '');*/
                                                        }
                                                    }
                                                });
                                            }
                                        }

                                    });
                                }
                                sleep(3000);
                                if (i === (db_posp_user.length - 1)) {
                                    res.json({"Status": "Success", "Msg": "Training history saved succesfully."});
                                }
                            }
                        } else {
                            res.json({"Status": "Success", "Msg": "Training history updated successfully."});
                        }
                    } catch (exx) {
                        console.error('Exception', 'update_training_histories', exx.stack);
                        res.json({"Status": "Fail", "Msg": exx.stack});
                    }
                }
            });
        } catch (ex) {
            console.error('Exception', 'update_training_status', ex.stack);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });    
    app.post('/onboarding/slot_log_allotment_NIU', function (req, res) {
        let posp_training_history = require('../models/posp_training_history.js');
        const today = new Date().toDateString();
        let all_hist_obj = [];
        let datesArr = [];
        let time_gap_arr = [15, 20, 10];
        let time_add_arr = [50, 60, 120, 180, 90];
        let User_Id = req.body.User_Id ? parseInt(req.body.User_Id) : "";
        let Start_Time = req.body.Start_Time ? req.body.Start_Time : "";
        let Required_Seconds = req.body.Required_Seconds ? req.body.Required_Seconds : "";
        let training_start_date = req.body.Training_Start_Date ? req.body.Training_Start_Date : "";
        let day = req.body.Day ? parseInt(req.body.Day) : 0;
        let total_training_days = req.body.Total_Training_Days ? parseInt(req.body.Total_Training_Days) : 0;
        let Remaining_Sec = Required_Seconds;
        try {
            console.log("Start_Time : ", Start_Time);
            let start_time = Start_Time;
            let new_hr = (parseInt(start_time[0]) < 10) ? parseInt(start_time[0].replace('0', '')) : parseInt(start_time[0]);
            let new_min = (parseInt(start_time[1]) < 10) ? parseInt(start_time[1].replace('0', '')) : parseInt(start_time[1]);
            let start_slot_date = "";
            if (day === 1) {
                start_slot_date = training_start_date;
            } else {
                var temp_training_start_date = moment(training_start_date, 'YYYY-MM-DDTHH:mm:ss[Z]').format("YYYY-MM-DDT00:00:00[Z]");
                start_slot_date = (moment.utc(temp_training_start_date).add(new_hr, 'hours').add(new_min, 'minutes'))._d;
                console.log(start_slot_date);
            }
            datesArr.push(start_slot_date);
            //get Spent Time
            let hrCounter = 0;
            while (Remaining_Sec > 0) {
                const random_time_add = Math.floor(Math.random() * time_add_arr.length);
                let time_addition = (time_add_arr[random_time_add]);
                const random_time_gap = Math.floor(Math.random() * time_gap_arr.length);
                let time_gap = time_gap_arr[random_time_gap];
                let new_datesArr = [];
                let temp_new_start_date = "";
//                for (var x = 0; x < datesArr.length; x++) {
                let end_date = (moment.utc(datesArr[0], "YYYY-MM-DDTHH:mm:ss[Z]").add(time_addition, 'minutes'))._d;
                let new_start_date = (moment.utc(end_date, "YYYY-MM-DD HH:mm:ss").add(time_gap, 'minutes'))._d;
                new_datesArr.push(new_start_date);
                let min_to_hrs = (time_addition >= 60) ? convertToHours(time_addition * 60) : "00:" + time_addition + ":00";
                let argsObj = {};
                argsObj['User_Id'] = User_Id;
                argsObj['Created_On'] = datesArr[0];
                argsObj['Modified_On'] = end_date;
                argsObj['Extension_Source'] = 'system';
                argsObj['Total_Time'] = min_to_hrs;
                argsObj['Start_Date_Time'] = datesArr[0];
                argsObj['End_Date_Time'] = end_date;
                temp_new_start_date = (moment.utc(new_start_date, "YYYY-MM-DDTHH:mm:ss[Z]"))._d;
                if (moment.utc(temp_new_start_date).hours() >= 22) {
                    break;
//                        Remaining_Sec = Remaining_Sec + ((parseInt(time_addition)) * 60);
                } else {
                    all_hist_obj.push(argsObj);
                    datesArr = new_datesArr;
                    Remaining_Sec = Remaining_Sec - ((parseInt(time_addition)) * 60);
                }
//                }

            }
            //updateRecords

            for (let y = 0; y < all_hist_obj.length; y++) {
                let posp_training_historyObj = new posp_training_history(all_hist_obj[y]);
                posp_training_historyObj.save(function (err, result) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {

                    }
                });
                if (y === all_hist_obj.length - 1) {
                    if (day === total_training_days) {
                        res.json({"Status": "Success", "Msg": "Training history saved succesfully.", "Training_End_Date": all_hist_obj[all_hist_obj.length - 1]['End_Date_Time']});
                    } else {
                        res.json({"Status": "Success", "Msg": "Training history saved succesfully."});
                    }
                }
            }


        } catch (ex) {
            console.error('Exception', 'get_training_section', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
        app.get('/onboarding/update_training_histories', function (req, res) {
        try {
            let Client = require('node-rest-client').Client;
            let client = new Client();
            let objRequest = req.query;
            let args = {};
            let all_hist_obj = [];
            let start_time_arr = ["07:00", "07:10", "07:15", "07:20", "7:30", "07:45", "08:00", "08:15", "08:30"];//
            let cond_date = new Date(moment(moment().valueOf() - 72 * 60 * 60 * 1000).format("YYYY-MM-DDTHH:mm:ss[Z]"));
            console.error("cond_date after: ", cond_date);
            let Mail_Send_Flag = objRequest.hasOwnProperty('Send_Mail') ? objRequest.Send_Mail : "Yes";

            if (objRequest.Ss_Id && objRequest.Status) {
                args = {
                    "User_Id": objRequest.Ss_Id - 0,
                    "Training_Status": objRequest.Status,
                    "Training_Start_Date": {$lt: cond_date}
                };
            } else if (objRequest.Ss_Id) {
                args = {
                    "User_Id": objRequest.Ss_Id - 0,
                    "Training_Start_Date": {$lt: cond_date}
                };
            } else if (objRequest.Status) {
                args = {
                    "Training_Status": objRequest.Status,
                    "Training_Start_Date": {$lt: cond_date}
                };
            } else {
                args = {
                    "Training_Status": "Started",
                    "Training_Start_Date": {$lt: cond_date}
                };
            }
            console.error('Onboarding Training start Data', args);
            posp_user.find(args).sort({'_id': -1}).exec(function (err, db_posp_user) {
                if (err) {
                    res.json({"Status": "Fail", "Msg": err});
                } else {
                    try {
                        if (db_posp_user && db_posp_user.length > 0) {
                            for (let i = 0; i < db_posp_user.length; i++) {
                                let posp_user_data = db_posp_user[i]._doc;
                                let User_Id = posp_user_data['User_Id'];
                                let Posp_Name = (posp_user_data.First_Name && posp_user_data.Middle_Name && posp_user_data.Last_Name) ? posp_user_data.First_Name + " " + posp_user_data.Middle_Name + " " + posp_user_data.Last_Name : posp_user_data.First_Name && posp_user_data.Last_Name ? posp_user_data.First_Name + " " + posp_user_data.Last_Name : posp_user_data.First_Name ? posp_user_data.First_Name : "POSP";
                                let Posp_Email = posp_user_data.Email_Id;
                                let posp_training_date = posp_user_data['Training_Start_Date'].toISOString();
                                let Training_Start_Date = (moment(posp_user_data['Training_Start_Date'], "YYYY-MM-DDTHH:mm:ss[Z]"))._d;
                                let Training_Status = posp_user_data['Training_Status'];
                                let UploadedDateAt_IIB = posp_user_data['POSP_UploadingDateAtIIB'] ? posp_user_data['POSP_UploadingDateAtIIB'] : "";
                                let Training_End_Date = (moment.utc(Training_Start_Date, "YYYY-MM-DDTHH:mm:ss[Z]").add(72, 'hours'))._d;
                                console.log('Training_Start_Date', Training_Start_Date);
                                console.log('Training_End_Date', Training_End_Date);
                                let start_date = moment(Training_Start_Date).format('YYYY-MM-DD');
                                let temp_end_date = moment(Training_End_Date).format('YYYY-MM-DD');
                                let no_of_days = moment(temp_end_date).diff(moment(start_date), 'days') + 1;
                                let fist_day_hours = 0;
                                let fourth_day_hours = 0;
                                let fist_day_min = 0;
                                let fourth_day_min = 0;
                                let day_start_date = "", start_time = "", day = 0, day_end_date = "", end_time = "", required_sec = 0;
                                posp_training_date = (moment(posp_training_date, "YYYY-MM-DDTHH:mm:ss[Z]"));
                                let timeDiff = moment(posp_training_date).endOf('day') - posp_training_date;
                                console.error(moment(posp_training_date, "YYYY-MM-DDTHH:mm:ss[Z]").endOf('day'));
                                let dur = moment.duration(timeDiff);
                                console.error(`${dur.hours()} hrs ${dur.minutes()} min ${dur.seconds()} sec until midnight.`);
                                if (no_of_days === 4)
                                {
                                    fist_day_hours = dur.hours();
                                    fist_day_hours >= 10 ? (no_of_days = 3,fist_day_hours=10) : (fourth_day_hours = 10 - fist_day_hours);
                                    if (fist_day_hours < 10 && fist_day_hours >= 5) {
                                        fist_day_hours = fist_day_hours - 3;
                                        fourth_day_hours = 10 - fist_day_hours;
                                    } else if (fist_day_hours < 5 && fist_day_hours >= 3) {
                                        fist_day_hours = 2;
                                        fourth_day_hours = 10 - fist_day_hours;
                                    } else if (fist_day_hours < 3) {
                                        fist_day_min = 5;
                                        fourth_day_min = 595;
                                    }

                                } else if (no_of_days === 3) {
                                    console.log("inside 3");
                                    fist_day_hours = 10;
                                }
                                sleep(1000);
                                for (var x = 1; x <= no_of_days; x++) {
                                    const random = Math.floor(Math.random() * start_time_arr.length);
                                    start_time = start_time_arr[random].split(":");
                                    if (x === 1) {//adjustment
                                        day_start_date = (moment(Training_Start_Date, 'YYYY-MM-DDTHH:mm:ss[Z]'))._d;
                                        start_time = moment.utc(moment(day_start_date, 'YYYY-MM-DDTHH:mm:ss')).format("HH:mm");
                                        start_time = start_time.split(":");
                                        console.error("start_time : ", start_time);
                                        if (fist_day_hours > 0 && fist_day_min == 0) {
                                            required_sec = fist_day_hours * 60 * 60;
                                        }else{
                                            required_sec = fist_day_min * 60;
                                        }
                                        day = 1;
                                    }
                                    if (x === 2) {//adjustment
                                        day_start_date = (moment.utc(Training_Start_Date, 'YYYY-MM-DDTHH:mm:ss[Z]').add(1, "days").format("YYYY-MM-DDT00:00:00[Z]"));
                                        required_sec = 36000;
                                        day = 2;
                                    }
                                    if (x === 3) {//adjustment
                                        day_start_date = (moment.utc(Training_Start_Date, 'YYYY-MM-DDTHH:mm:ss[Z]').add(2, "days").format("YYYY-MM-DDT00:00:00[Z]"));
                                        required_sec = 36000;
                                        day = 3;
                                    }
                                    if (x === 4) {//adjustment
                                        day_start_date = (moment.utc(Training_Start_Date, 'YYYY-MM-DDTHH:mm:ss[Z]').add(3, "days").format("YYYY-MM-DDT00:00:00[Z]"));
                                         if (fourth_day_hours > 0 && fourth_day_min == 0) {
                                            required_sec = fourth_day_hours * 60 * 60;
                                        }else{
                                            required_sec = fourth_day_min * 60;
                                        }
                                        day = 4;
                                    }

                                    let args = {
                                        data: {
                                            'User_Id': User_Id,
                                            'Start_Time': start_time,
                                            'Required_Seconds': required_sec,
                                            'Training_Start_Date': day_start_date,
                                            'Day': day,
                                            'Total_Training_Days': no_of_days
                                        },
                                        headers: {
                                            "Content-Type": "application/json"
                                        }
                                    };
                                    client.post(config.environment.weburl + "/onboarding/slot_log_allotment", args, function (data, response) {
                                        if (data.Status === "Success") {
                                            if (data.hasOwnProperty("Training_End_Date") && data.Training_End_Date) {
                                                let posp_args = {};
                                                if (Training_Status === "Completed") {
                                                    posp_args = {"Training_End_Date": data.Training_End_Date};
                                                } else {
                                                    posp_args = {'Completed_Hours': "30:00:00", 'Remaining_Hours': "00:00:00", "Is_Training_Completed": 'Yes', "Training_Status": "Completed", "Training_End_Date": data.Training_End_Date, "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")};
                                                }

                                                posp_user.update({'User_Id': User_Id}, {$set: posp_args}, function (err, numAffected) {
                                                    if (err) {
                                                        res.json({"Status": "Fail", "Msg": err});
                                                    } else {
                                                        try {
                                                            client.get(config.environment.weburl + "/posps/mssql/sync_training_date?ss_id=" + User_Id, {}, function (sync_training_date_data, sync_training_date_response) {
                                                                console.error({"Status": "Success", "Msg": "sync_training_date called.", "Data": sync_training_date_data});
                                                            });
                                                        } catch (ee) {
                                                            console.error('sync_training_date Error', ee.stack);
                                                        }
                                                        if (Training_Status === "Started" && Mail_Send_Flag === "Yes" && UploadedDateAt_IIB) {
                                                            console.log("Training Completed inside mail");
                                                            //sent exam due email start												
                                                            Send_Pos_Exam_Due_Email(User_Id);
                                                            //send exam due email finish

                                                            /*let objModelEmail = new Email();
                                                             var email_data = '';
                                                             let objMail = {
                                                             '___posp_name___': Posp_Name,
                                                             '___short_url___': "https://www.policyboss.com/posp-form"
                                                             };
                                                             email_data = fs.readFileSync(appRoot + '/resource/request_file/Posp_Training_Complete_Mail.html').toString();
                                                             email_data = email_data.replaceJson(objMail);
                                                             objModelEmail.send('pospcom@policyboss.com', Posp_Email, "[POSP-ONBOARDING] POSP TRAINING COMPLETE & POSP EXAM DUE : : SSID-" + User_Id, email_data, '', config.environment.notification_email, '');*/
                                                        }
                                                    }
                                                });
                                            }
                                        }

                                    });
                                }
                                sleep(3000);
                                if (i === (db_posp_user.length - 1)) {
                                    res.json({"Status": "Success", "Msg": "Training history saved succesfully."});
                                }
                            }
                        } else {
                            res.json({"Status": "Success", "Msg": "Training history updated successfully."});
                        }
                    } catch (exx) {
                        console.error('Exception', 'update_training_histories', exx.stack);
                        res.json({"Status": "Fail", "Msg": exx.stack});
                    }
                }
            });
        } catch (ex) {
            console.error('Exception', 'update_training_status', ex.stack);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/slot_log_allotment', function (req, res) {
        let posp_training_history = require('../models/posp_training_history.js');
        const today = new Date().toDateString();
        let all_hist_obj = [];
        let datesArr = [];
        let time_gap_arr = [15, 20, 10];
        let time_add_arr = [50, 60, 120, 180, 90];
        let User_Id = req.body.User_Id ? parseInt(req.body.User_Id) : "";
        let Start_Time = req.body.Start_Time ? req.body.Start_Time : "";
        let Required_Seconds = req.body.Required_Seconds ? req.body.Required_Seconds : "";
        let training_start_date = req.body.Training_Start_Date ? req.body.Training_Start_Date : "";
        let day = req.body.Day ? parseInt(req.body.Day) : 0;
        let total_training_days = req.body.Total_Training_Days ? parseInt(req.body.Total_Training_Days) : 0;
        let Remaining_Sec = Required_Seconds;
        try {
            console.log("Start_Time : ", Start_Time);
            let start_time = Start_Time;
            let new_hr = (parseInt(start_time[0]) < 10) ? parseInt(start_time[0].replace('0', '')) : parseInt(start_time[0]);
            let new_min = (parseInt(start_time[1]) < 10) ? parseInt(start_time[1].replace('0', '')) : parseInt(start_time[1]);
            let start_slot_date = "";
            if (day === 1) {
                start_slot_date = training_start_date;
            } else {
                var temp_training_start_date = moment(training_start_date, 'YYYY-MM-DDTHH:mm:ss[Z]').format("YYYY-MM-DDT00:00:00[Z]");
                start_slot_date = (moment.utc(temp_training_start_date).add(new_hr, 'hours').add(new_min, 'minutes'))._d;
                console.log(start_slot_date);
            }
            datesArr.push(start_slot_date);
            //get Spent Time
            let hrCounter = 0;
            while (Remaining_Sec > 0) {
                const random_time_add = Math.floor(Math.random() * time_add_arr.length);
                let time_addition = (time_add_arr[random_time_add]);
                if (moment.utc(datesArr[0]).hours() >= 20) {
                    time_addition = 50;
                }
                let time_addition_sec = time_addition * 60;
                if (time_addition_sec > Remaining_Sec) {
                    time_addition = Math.floor(Remaining_Sec / 60);
                }
                const random_time_gap = Math.floor(Math.random() * time_gap_arr.length);
                let time_gap = time_gap_arr[random_time_gap];
                let new_datesArr = [];
                let temp_new_start_date = "";
                let end_date = (moment.utc(datesArr[0], "YYYY-MM-DDTHH:mm:ss[Z]").add(time_addition, 'minutes'))._d;
                let new_start_date = (moment.utc(end_date, "YYYY-MM-DD HH:mm:ss").add(time_gap, 'minutes'))._d;
                console.log("end_date", end_date);
                console.log("new_start_date", new_start_date);
                new_datesArr.push(new_start_date);
                let min_to_hrs = (time_addition >= 60) ? convertToHours(time_addition * 60) : "00:" + time_addition + ":00";
                let argsObj = {};
                argsObj['User_Id'] = User_Id;
                argsObj['Created_On'] = datesArr[0];
                argsObj['Modified_On'] = end_date;
                argsObj['Extension_Source'] = 'system';
                argsObj['Total_Time'] = min_to_hrs;
                argsObj['Start_Date_Time'] = datesArr[0];
                argsObj['End_Date_Time'] = end_date;
                temp_new_start_date = (moment.utc(new_start_date, "YYYY-MM-DDTHH:mm:ss[Z]"))._d;
                console.log("temp_new_start_date", temp_new_start_date);
                console.log("temp_new_start_date hours : " + moment.utc(temp_new_start_date).hours());
                if (moment.utc(temp_new_start_date).hours() >= 22 && (moment.utc(temp_new_start_date).date() != moment.utc(datesArr[0]).date())) {
                    break;
                } else {
                    all_hist_obj.push(argsObj);
                    datesArr = new_datesArr;
                    Remaining_Sec = Remaining_Sec - ((parseInt(time_addition)) * 60);
                }
            }
            //updateRecords
            for (let y = 0; y < all_hist_obj.length; y++) {
                let posp_training_historyObj = new posp_training_history(all_hist_obj[y]);
                posp_training_historyObj.save(function (err, result) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                    }
                });
                if (y === all_hist_obj.length - 1) {
                    if (day === total_training_days) {
                        res.json({"Status": "Success", "Msg": "Training history saved succesfully.", "Training_End_Date": all_hist_obj[all_hist_obj.length - 1]['End_Date_Time']});
                    } else {
                        res.json({"Status": "Success", "Msg": "Training history saved succesfully."});
                    }
                }
            }
        } catch (ex) {
            console.error('Exception', 'get_training_section', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });

    app.get('/onboarding/POSPTrainingStatus', function (req, res) {
        try {
            let objRequest = req.query;
            let Posp_User = require("../models/posp_users.js");
            let Client = require("node-rest-client").Client;
            let client = new Client();
            let ss_id = objRequest.ss_id ? objRequest.ss_id - 0 : 0;
            if (ss_id > 0) {
                Posp_User.find({"User_Id": ss_id}, function (posp_user_err, db_posp_user) {
                    if (posp_user_err) {
                        res.json({"Status": "Fail", "Msg": posp_user_err});
                    } else {
                        if (db_posp_user && db_posp_user.length > 0) {
                            let posp_user_data = db_posp_user[0]["_doc"];
                            let training_end_date = posp_user_data.Training_End_Date ? moment.utc(posp_user_data.Training_End_Date, "YYYY-MM-DD hh:mm:ss").format("MM/DD/YYYY hh:mm:ss A") : "";
                            if (training_end_date && posp_user_data && posp_user_data.Exam_Status && posp_user_data.Exam_Status === "Completed") {
                                let posp_training_status_api = "http://vehicleinfo.policyboss.com/api/POSPTrainingStatus";
                                client.get(config.environment.weburl + "/onboarding/posp_training_histories?ss_id=" + ss_id, {}, function (posp_training_histories_data, posp_training_histories_response) {
                                    if (posp_training_histories_data && posp_training_histories_data.length > 0) {
                                        let api_request = {
                                            "lstuserlog": posp_training_histories_data,
                                            "FBAID": ss_id.toString(),
                                            "Training_Status": "Pass",
                                            "Certificate_Data": "https://download.policyboss.com/tmp/onboarding_certificates/" + ss_id + "/Certificate_" + ss_id + ".pdf",
                                            "TrainingEndDate": training_end_date,
                                            "SS_ID": 0
                                        };
                                        console.error("api_request", JSON.stringify(api_request));
                                        let args = {
                                            data: JSON.stringify(api_request),
                                            headers: {
                                                "Content-Type": "application/json",
                                                "UserName": "test",
                                                "Password": "test@123"
                                            }
                                        };
                                        console.error("args", JSON.stringify(args));
                                        client.post(posp_training_status_api, args, function (posp_training_status_data, posp_training_status_response) {
                                            console.error(posp_training_status_data);
                                            res.json(posp_training_status_data);
                                        });
                                        //res.send(JSON.stringify(api_request));
                                    } else {
                                        res.json({"Status": "Fail", "Msg": "No Data Available in posp_training_histories"});
                                    }

                                });
                            } else {
                                res.json({"Status": "Fail", "Msg": "Training end date is mandatory and Exam should be completed"});
                            }
                        } else {
                            res.json({"Status": "Fail", "Msg": "No Data Available in Posp_User"});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "SS_ID is mandatory"});
            }
        } catch (e) {
            res.json({"Status": "Error", "Msg": e.stack});
        }
    });
    app.post('/onboarding/save_training_history', function (req, res) {
        try {
            let Client = require('node-rest-client').Client;
            let client = new Client();
            let Training_Start_Date = "";
            let todayDate = moment().format('YYYY-MM-DD'), now = moment(), dailyLimitInSec = 36000, totalTrainingTimeInSec = 108000, difference = 0, totalTimerInSec = 0;
            let trainingStartDate, training_Status, Completed_Hours, Remaining_Hours, Completed_Hours_In_Sec, Remaining_Hours_In_Sec, Posp_Name = "", Posp_Email = "", Training_Status = "";
            let posp_training_history = require('../models/posp_training_history.js');
            let argsObj = {}, updateArgs = {}, pospObj = {}, Training_Completed = "No", Zone = "", id, prevTime = "";
            let Training_Slot = req.body.Training_Slot;
            let User_Id = req.body.User_Id ? parseInt(req.body.User_Id) : "";
            argsObj['User_Id'] = User_Id;
            argsObj['Mobile_Number'] = req.body.Mobile_Number;
            argsObj['Training_Id'] = req.body.Training_Id;
            argsObj['Section_Id'] = req.body.Section_Id;
            argsObj['Section_Name'] = req.body.Section_Name;
            argsObj['Session_Id'] = req.body.Session_Id;
            argsObj['IP_Address'] = req.pbIp;
            argsObj['Start_Date_Time'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
            argsObj['End_Date_Time'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
            argsObj['Created_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
            argsObj['Modified_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
            let totalTimer = req.body.timer;
            if (User_Id) {
                posp_user.find({'User_Id': User_Id}, function (err, dbposp) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        try {
                            if (dbposp && dbposp.length > 0) {
                                let data = dbposp[0]._doc;
                                Training_Status = data.Training_Status;
                                trainingStartDate = moment(data['Training_Start_Date']).format('YYYY-MM-DD');
                                Completed_Hours = data['Completed_Hours'];
                                Remaining_Hours = data['Remaining_Hours'];
                                Completed_Hours_In_Sec = convertToSec(Completed_Hours);
                                Remaining_Hours_In_Sec = convertToSec(Remaining_Hours);
                                totalTimerInSec = totalTimer ? convertToSec(totalTimer) : Completed_Hours_In_Sec;

                                let diff = moment(todayDate).diff(moment(trainingStartDate), 'days');
                                if (diff > 3) {
                                    if (Training_Status === "Started") {
                                        client.get(config.environment.weburl + "/onboarding/update_training_histories?Ss_Id=" + User_Id, {}, function (slot_adjustment_data, slot_adjustment_response) {
                                            if (slot_adjustment_data && slot_adjustment_data.Status && slot_adjustment_data.Status === "Success") {
                                                console.error('/onboarding/save_training_history', slot_adjustment_data);
                                                res.json({"Status": "Success", "Msg": "Training history saved succesfully."});
                                            }
                                        });
                                    } else {
                                        res.json({"Status": "Success", "Msg": "Training history saved succesfully."});
                                    }
                                } else {
                                    difference = totalTimerInSec - Completed_Hours_In_Sec;
                                    Zone = 2;
                                    console.error("diff else");
                                    Completed_Hours = convertToHours(totalTimerInSec);
                                    Remaining_Hours = convertToHours(Remaining_Hours_In_Sec - difference);

                                    //start n end time check
                                    if (Training_Slot === "Start") {
                                        console.error("start");
                                        argsObj['Total_Time'] = "00:00:00";
                                        argsObj['Extension_Source'] = 'user';
                                        posp_user.update({'User_Id': User_Id}, {$set: {'Completed_Hours': Completed_Hours, 'Remaining_Hours': Remaining_Hours}}, function (err, numAffected) {
                                            if (err) {
                                                res.json({"Status": "Fail", "Msg": err});
                                            } else {

                                                let posp_training_historyObj = new posp_training_history(argsObj);
                                                posp_training_historyObj.save(function (err, result) {
                                                    if (err) {
                                                        res.json({"Status": "Fail", "Msg": err});
                                                    } else {
                                                        res.json({"Status": "Success", "Msg": "Training history saved succesfully.", "data": result});
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        posp_training_history.find({'User_Id': User_Id}).sort({'Created_On': -1}).exec(function (err, dbres2) {
                                            if (err) {
                                                res.json({"Status": "Fail", "Msg": err});
                                            }
                                            if (dbres2 && dbres2.length > 0) {
                                                updateArgs = {};
                                                let data2 = dbres2[0]._doc;
                                                let daily_limit_completed = "No";
                                                id = data2['_id'];
                                                if ((moment(data2['Start_Date_Time']).isSame(data2['End_Date_Time'])) && data2['Extension_Source'] !== "system") {
                                                    console.error("cond 1");
                                                    var then = (moment.utc(data2['Start_Date_Time']))._d;
                                                    var time_dif = moment.duration(now.diff(then));
                                                    time_dif = convertToSec(totalTimer) - Completed_Hours_In_Sec;
                                                    let total_tm = convertToHours(time_dif);
                                                    updateArgs = {'Total_Time': total_tm, 'Section_Id': req.body.Section_Id, 'Section_Name': req.body.Section_Name, 'End_Date_Time': moment().format("YYYY-MM-DDTHH:mm:ss[Z]"), 'Modified_On': moment().format("YYYY-MM-DDTHH:mm:ss[Z]")};
                                                } else if (moment(data2['Start_Date_Time']).isSame(data2['End_Date_Time'])) {
                                                    console.error("cond 2");
                                                    var then = moment.utc(data2['Start_Date_Time']);
                                                    var time_dif = moment.duration(now.diff(then));
                                                    time_dif = convertToSec(totalTimer) - Completed_Hours_In_Sec;
                                                    let total_tm = convertToHours(time_dif);
                                                    argsObj['Section_Name'] = req.body.Section_Name;
                                                    argsObj['Total_Time'] = total_tm;
                                                } else {
                                                    console.error("cond 3");
                                                    daily_limit_completed = "Yes";
                                                    argsObj['Total_Time'] = "00:00:00";
                                                    argsObj['Extension_Source'] = 'user';
                                                }
                                                // if (daily_limit_completed === "No") {
                                                posp_user.update({'User_Id': User_Id}, {$set: {'Completed_Hours': Completed_Hours, 'Remaining_Hours': Remaining_Hours}}, function (err, numAffected) {
                                                    if (err) {
                                                        res.json({"Status": "Fail", "Msg": err});
                                                    } else {
                                                        if (Object.keys(updateArgs).length > 0) {
                                                            console.error("save");
                                                            posp_training_history.update({'_id': data2['_id']}, {$set: updateArgs}, {runValidators: true}, function (err, dbres) {
                                                                if (err) {
                                                                    res.json({"Status": "Fail", "Msg": err});
                                                                } else {
                                                                    res.json({"Status": "Success", "Msg": "Training history saved succesfully."});
                                                                }
                                                            });
                                                        } else {
                                                            console.log("update");
                                                            let posp_training_historyObj = new posp_training_history(argsObj);
                                                            posp_training_historyObj.save(function (err, result) {
                                                                if (err) {
                                                                    res.json({"Status": "Fail", "Msg": err});
                                                                } else {
                                                                    res.json({"Status": "Success", "Msg": "Training history saved succesfully.", "data": result});
                                                                }
                                                            });
                                                        }
                                                    }
                                                });
//                                                } else {
//                                                    res.json({"Status": "Success", "Msg": "Training history saved succesfully."});
//                                                }
                                            }
                                        });
                                    }
                                }

                            } else {
                                res.json({"Status": "Fail", "Msg": "User doesn't exist."});
                            }
                        } catch (err) {
                            res.json({"Status": "Fail", "Msg": err.stack});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Invalid User."});
            }
        } catch (ex) {
            console.error('Exception', 'get_training_section', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get("/onboarding/initiate_payment_link", function (req, res) {
        try {
            var Client = require('node-rest-client').Client;
            var client = new Client();
            let ss_id = req.query.ss_id ? req.query.ss_id - 0 : "";
            if (ss_id) {
                client.get(config.environment.weburl + '/posps/dsas/view/' + ss_id, {}, function (data, response) {
                    if (data && data.status && data.status === "SUCCESS") {
                        if (data.POSP_USER && data.POSP_USER.Sources && (["31"].indexOf(data.POSP_USER.Sources) > -1)) {
                            res.json({"Status": "Success", "Msg": "POSP User Source Is (31), Hence Payment Link Is Not Sent"});
                        } else if (data.POSP && data.POSP.Sources && (["31"].indexOf(data.POSP.Sources) > -1)) {
                            res.json({"Status": "Success", "Msg": "POSP User Source Is (31), Hence Payment Link Is Not Sent"});
                        } else {
                            let payment_link = "https://www.policyboss.com/razorpay?ss_id=" + ss_id + "&source=POSP_ONBOARD";
                            client.get(config.environment.weburl + '/short_url/create?longUrl=' + encodeURIComponent(payment_link), {}, function (data, response) {
                                if (data && data.Short_Url) {
                                    let shortUrl = data.Short_Url;
                                    try {
                                        client.get(config.environment.weburl + '/posps/report/email_consolidate_process?ss_id=' + ss_id + '&event_type=PAYMENT_LINK', {}, function (payment_link_mail_data, payment_link_mail_res) {
                                            console.error('SEND_PAYMENT_LINK_MAIL', 'Ss_Id: ' + ss_id);
                                        });
                                    } catch (ex) {
                                        console.error('EXCEPTION_IN_SEND_PAYMENT_LINK_MAIL', 'Ss_Id: ' + ss_id, ex.stack);
                                    }
                                    res.json({"Status": "Success", "Short_URL": shortUrl, "Long_URL": payment_link});
                                } else {
                                    res.json({"Status": "Fail", "Msg": "Link not created."});
                                }
                            });
                        }
                    } else {
                        res.json({"Status": "Success", "Msg": "No Record Found."});
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Ss_Id is Missing"});
            }
        } catch (e) {
            res.json({"Status": "Fail", "Msg": e.stack});
        }
    });
    app.post("/onboarding/update_posp_exam_status", function (req, res) {
        try {
            let client = new Client();
            let posp_list = req.body.posp_list;
            let users = posp_list.split(",");
            let success_count_data = 0;
            let fail_count_data = 0;
            posp_user.find({User_Id: {$in: users}, Training_Status: "Completed"}, function (err, dbresult) {
                if (err) {
                    throw err;
                } else {
                    if (dbresult.length > 0) {
                        for (var x = 0; x < dbresult.length; x++) {
                            let userdata = dbresult[x]._doc;
                            let training_end_date = moment.utc(userdata.Training_End_Date, "YYYY-MM-DDTHH:mm:ss[Z]")._d;
                            let exam_end_date = moment(training_end_date, "YYYY-MM-DDTHH:mm:ss[Z]").add(1, 'd').add(30, 'minutes');
                            let obj = {
                                "Exam_Start_Date": training_end_date,
                                "Exam_End_Date": exam_end_date,
                                "Exam_Status": "Completed",
                                "Onboarding_Status": "Exam_Completed",
                                "Modified_On": exam_end_date
                            };
                            let args = {
                                data: {
                                    'Ss_Id': userdata.User_Id,
                                    'Posp_Obj': obj
                                },
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            };
                            client.post(config.environment.weburl + "/onboarding/update_exam_details", args, function (data, response) {
                                if (data.Status === "Success") {
                                    success_count_data++;
                                } else {
                                    fail_count_data++;
                                }
                            });
                            sleep(2000);
                            if (x === (dbresult.length - 1))
                            {
                                res.send({'Status': "Success", "Msg": 'POSP exam details updated successfully.', "Success_Count": success_count_data, "Fail_Count": fail_count_data});
                            }
                        }
                    } else {
                        res.json({"Status": "Fail", "Msg": "User not found"});
                    }
                }
            });
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/update_all_posp_training_status', function (req, res) {
        try {
            let client = new Client();
            let posp_list = req.body.posp_list ? req.body.posp_list : "";
            let posps = posp_list.split(",");
            if (posps.length > 0) {
                for (let x = 0; x < posps.length; x++) {
                    client.get(config.environment.weburl + "/onboarding/POSPTrainingStatus?ss_id=" + posps[x], {}, function (posp_training_status_data, posp_training_status_response) {
                        console.error({"Status": "Success", "Msg": "Traning status updated.", "Data": posp_training_status_data});
                    });
                    if (x === (posps.length - 1)) {
                        res.json({"Status": "Success", "Msg": "POSP training status updated successfully."});
                    }
                }
            } else {
                res.json({"Status": "Fail", "Msg": "Ss_Id not found"});
            }
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": ex.stack});
        }

    });
    app.post("/onboarding/update_exam_details", function (req, res) {
        try {
            let client = new Client();
            let reqObj = req.body;
            let ss_id = reqObj.Ss_Id ? (req.body.Ss_Id - 0) : "";
            let posp_user_obj = reqObj.Posp_Obj ? req.body.Posp_Obj : {};
            let ran = Math.floor(Math.random() * (27 - 15 + 1) + 15);
            let exam_obj = {
                "User_Id": ss_id,
                "Total_Score": ran,
                "Passing_Marks": 10,
                "Result": "PASS",
                "Created_On": posp_user_obj.Modified_On,
                "Modified_On": posp_user_obj.Modified_On
            };
            if (ss_id && posp_user_obj) {
                let posp_examResult_obj = new examResult(exam_obj);
                posp_examResult_obj.save(function (err, dbresult) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        posp_user.update({"User_Id": ss_id}, {$set: posp_user_obj}, {runValidators: true}, function (err, numAffected) {
                            if (err)
                                res.json({"Status": "Fail", "Msg": err});
                            if (numAffected && numAffected.ok === 1) {
                                client.get(config.environment.weburl + "/onboarding/generateCertificate/" + ss_id + "/Yes/Dummy", {}, function (data, response) {
                                });
                                res.json({"Status": "Success"});
                            }
                        });

                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Details not found"});
            }
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post("/onboarding/update_record", function (req, res) {
        try {
            let reqObj = req.body;
            let find_args = reqObj.find_args ? req.body.find_args : {};
            let collection_name = reqObj.collection_name ? req.body.collection_name : "posp_users.js";
            let updated_obj = reqObj.updated_obj ? req.body.updated_obj : "";
            let setObj = updated_obj;
            let model_name = require('../models/' + collection_name);
            if (find_args !== {} && model_name && setObj) {
                model_name.update(find_args, {$set: setObj}, {runValidators: true}, function (err, numAffected) {
                    if (err)
                        res.json({"Status": "Fail", "Msg": err});
                    if (numAffected && numAffected.ok === 1) {
                        res.json({"Status": "Success", "Msg": "Record updated successfully"});
                    } else {
                        res.json({"Status": "Fail", "Msg": "Record updation failed"});
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Unsufficient details"});
            }
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/get_total_payment_count', function (req, res) {
        try {
            let razorpay_payment = require('../models/razorpay_payment');
            let last_invoice_number = 0;
            let incrementedCount = 0;
            let paddingValue = "00000";
//            let filter = {
//                "Payment_Status": "Success"
//            };            
            let from_start = new Date("2024-04-03");
            let today_end = new Date("2025-03-31");
            let filter = {
                "PayId": {$nin: [null, "NA", ""]},
                "Created_On": {"$gte" : from_start , "$lt" : today_end},
                 "Source": "POSP_ONBOARD",
                "Transaction_Status": "Success"
            };

            razorpay_payment.find(filter).sort({'_id': -1}).exec (function (err, dbposp_users) {
                if (err) {
                    res.json({"Status": "Error", "Msg": err});
                } else {
                    if (dbposp_users.length > 0) {
                        last_invoice_number = dbposp_users[0]._doc["Invoice_No"] - 0;
                        console.log("totalCount:" + last_invoice_number);
                        incrementedCount = last_invoice_number + 1;
                        incrementedCount = String(paddingValue + incrementedCount).slice(-paddingValue.length);
                        console.error("POSP_NEXT_INVOICE_NUMBER_CALLED_SUCCESS : " + incrementedCount);
                        res.json({"Status": "Success", "Msg": "Total " + dbposp_users.length + " Records Found.", "Last Invoice Number": last_invoice_number, "Incremented_Count": incrementedCount});
                    } else {
                        console.error("POSP_NEXT_INVOICE_NUMBER_CALLED_FAILED : " + incrementedCount);
                        res.json({"Status": "Success", "Msg": "No Record Found.", "Total_Count": totalCount, "Incremented_Count": incrementedCount});
                    }

                }
            });
        } catch (e) {
            res.json({"Status": "Error", "Msg": e.stack});
        }
    });
    app.get("/onboarding/erp_code_generate", function (req, res) { // roshani - generate ERP code 
        let objResponseFull = {"Status": "", "Msg": "", "Ss_Id": "", "Data": "", "ERP_Code": ""};
        try {
            let Client = require('node-rest-client').Client;
            let client = new Client();
            let xml2js = require('xml2js');
            let http = require('http');
            let stripPrefix = require('xml2js').processors.stripPrefix;
            let ss_id = req.query.ss_id ? req.query.ss_id - 0 : "";
            objResponseFull["Ss_Id"] = ss_id;
            let posp_user_data = "";
            let posp_email = "";
            let rm_email = "";
            let rm_name = "";
            let rm_uid = "";
            let subVertical = "";
            let fba_id = "";
            let is_allow = true;
            let error_msg = "";
            let agent_cities = {"Kolkatta": "Kolkata", "Nashik": "Nasik", "BANGALORE": "Banglore", "Ahmednagar": "Nasik"};

            let error_msg_obj = {
                "Document_Status": "DOCUMENTS NOT UPLOADED",
                "Exam_Status": "EXAM NOT COMPLETED",
                "POSP_UploadingDateAtIIB": "NOT UPLOADED IN IIB"
            };
            if (ss_id !== "") {
                let obj_posp_user_cond = {
                    "User_Id": ss_id
                };
                posp_user.findOne(obj_posp_user_cond, function (posp_user_err, posp_user_data) {
                    if (posp_user_data) {
                        posp_user_data = posp_user_data._doc;
                        if (posp_user_data && posp_user_data.Erp_Id && posp_user_data.Erp_Status === "SUCCESS") {
                            objResponseFull["Status"] = "SUCCESS";
                            objResponseFull["Msg"] = "ERP CODE ALREADY EXIST";
                            objResponseFull["Data"] = posp_user_data;
                            objResponseFull["ERP_Code"] = posp_user_data.Erp_Id;
                            res.json(objResponseFull);
                        } else {
                            if (posp_user_data.Is_Document_Uploaded !== "Yes") {
                                is_allow = false;
                                error_msg = error_msg_obj['Document_Status'];
                            }
                            if (!posp_user_data.POSP_UploadingDateAtIIB) {
                                is_allow = false;
                                error_msg = error_msg_obj['POSP_UploadingDateAtIIB'];
                            }
                            if (posp_user_data.Exam_Status !== "Completed") {
                                is_allow = false;
                                error_msg = error_msg_obj['Exam_Status'];
                            }
                            let Pos_Name_On_PAN = posp_user_data.Name_On_PAN || "";
                            let Pos_Pan_No = posp_user_data.Pan_No || "";
                            let Pos_DOB = posp_user_data.DOB_On_PAN || posp_user_data.Birthdate || "";
                            let Pos_Prsnt_Add = posp_user_data.Present_Add1 || posp_user_data.Present_Add2 || posp_user_data.Present_Add3 || "";
                            let Pos_Prmnt_Add = posp_user_data.Permanant_Add1 || posp_user_data.Permanant_Add2 || posp_user_data.Permanant_Add3 || "";
                            let arr_msg = [];
                            if (Pos_Name_On_PAN.trim() === "") {
                                arr_msg.push("Name_On_PAN :: INVALID :: " + Pos_Name_On_PAN);
                            }


                            if (Pos_Pan_No && validatePan(Pos_Pan_No) && Pos_Pan_No.toUpperCase().charAt(3) == "P") {

                            } else {
                                arr_msg.push("PAN :: INVALID :: " + Pos_Pan_No);
                            }


                            if (Pos_DOB == "") {
                                arr_msg.push("BirthDate :: INVALID :: " + Pos_DOB);
                            }
                            if (Pos_Prsnt_Add == "" && Pos_Prmnt_Add == "") {
                                arr_msg.push("Address :: INVALID/BLANK :: " + Pos_Prsnt_Add);
                            }
                            if (arr_msg.length > 0) {
                                is_allow = false;
                                error_msg = arr_msg.join("<BR>");
                            }


                            if (is_allow) {
                                client.get("http://horizon.policyboss.com:5000/posps/iib_container/pan_details?pan=" + Pos_Pan_No + "&ss_id=" + ss_id, {}, function (pan_iib_status_data, pan_iib_status_response) {
                                    if (pan_iib_status_data && pan_iib_status_data.status === "SUCCESS") {
                                        client.get(config.environment.weburl + "/onboarding/check_document_status?ss_id=" + ss_id, {}, function (document_status_data, document_status_response) {
                                            if (document_status_data && document_status_data.Status === "SUCCESS") {
                                                client.get('http://horizon.policyboss.com:5000/posps/dsas/view/' + ss_id, {}, function (posp_dsa_response, response) {
                                                    if (posp_dsa_response && posp_dsa_response.status && posp_dsa_response.status === "SUCCESS" && posp_dsa_response.user_type && ["POSP", "FOS"].indexOf(posp_dsa_response.user_type) > -1) {
                                                        client.get('http://horizon.policyboss.com:5000/onboarding/posp_training_histories?ss_id=' + ss_id, {}, function (posp_training_histories_data, posp_training_histories_res) {
                                                            if (posp_training_histories_data && posp_training_histories_data.length > 0) {
                                                                let posp_training_obj = posp_training_histories_data;
                                                                let posp_data = posp_dsa_response["POSP"] || {};
                                                                //let rm_details_full = posp_dsa_response["RM"]["rm_details"] || {};
                                                                let rm_details_full = posp_dsa_response.RM && posp_dsa_response["RM"]["rm_details"] || {};
                                                                posp_email = posp_user_data.Email_Id ? posp_user_data.Email_Id : (posp_data.Email_Id ? posp_data.Email_Id : "");
                                                                rm_uid = rm_details_full["uid"] || "";
                                                                rm_name = rm_details_full["name"] || "";
                                                                rm_email = rm_details_full["email"] || "";

                                                                subVertical = posp_user_data.SubVertical ? posp_user_data.SubVertical : (posp_data.SubVertical ? posp_data.SubVertical : "");
                                                                fba_id = posp_user_data.Fba_Id ? posp_user_data["Fba_Id"] : (posp_data.Fba_Id ? posp_data["Fba_Id"] : "0");
                                                                let  dsa_name = "";
                                                                if (posp_user_data.Name_On_PAN) {
                                                                    dsa_name = posp_user_data.Name_On_PAN;
                                                                }

                                                                if (dsa_name.toString().trim().split(" ").length == 1) {
                                                                    dsa_name = dsa_name + " "+posp_user_data.Last_Name;
                                                                }
                                                                let nominee_name = posp_user_data.Nominee_Middle_Name ? (posp_user_data.Nominee_First_Name + " " + posp_user_data.Nominee_Middle_Name + " " + posp_user_data.Nominee_Last_Name)
                                                                        : (posp_user_data.Nominee_First_Name + " " + (posp_user_data.Nominee_Last_Name ? posp_user_data.Nominee_Last_Name : ""));

                                                                let posp_pan_no = posp_user_data.Pan_No || "";
                                                                //let posp_aadhar_no = posp_user_data.Aadhar || "";
																let posp_aadhar_no = "";
                                                                let nom_pan_no = posp_user_data.Nominee_Pan || "";
                                                                //let nom_aadhar_no = posp_user_data.Nominee_Aadhar || "";
																let nom_aadhar_no = "";
                                                                let posp_acc_no = posp_user_data.Bank_Account_No || "";
                                                                let posp_ifsc_code = posp_user_data.Ifsc_Code || "";
                                                                let posp_bank_name = posp_user_data.Bank_Name || "";
                                                                let posp_acc_type = posp_user_data.Account_Type || "Saving A/c";
                                                                let posp_branch_name = posp_user_data.Bank_Branch || "";
                                                                let nom_acc_no = posp_user_data.Nominee_Bank_Account_Number || "";
                                                                let nom_ifsc_code = posp_user_data.Nominee_Ifsc_Code || "";
                                                                let nom_bank_name = posp_user_data.Nominee_Bank_Name || "";
                                                                let nom_acc_type = posp_user_data.Nominee_Account_Type || "Saving A/c";
                                                                let nom_branch_name = posp_user_data.Nominee_Bank_Branch || "";
                                                                let nom_relationship = nom_pan_no === "SELF" ? "SELF" : (posp_user_data.Nominee_Relationship ? posp_user_data.Nominee_Relationship : "");
                                                                let service_url = config.environment.weburl;
                                                                let posp_ifsc_args = {};
                                                                let nom_ifsc_args = {};
                                                                if (true || ((posp_branch_name == "" || posp_branch_name == null || posp_branch_name == undefined) || (posp_bank_name == "" || posp_bank_name == null || posp_bank_name == undefined)) && posp_ifsc_code) {
                                                                    service_url = config.environment.weburl + '/onboarding/bank_ifsc_verification';
                                                                    posp_ifsc_args = {
                                                                        data: {
                                                                            'User_Id': ss_id,
                                                                            'Ifsc': posp_ifsc_code
                                                                        },
                                                                        headers: {
                                                                            "Content-Type": "application/json"
                                                                        }
                                                                    };
                                                                }

                                                                client.post(service_url, posp_ifsc_args, function (zoop_ifsc_data, zoop_ifsc_response) {
                                                                    let posp_zoop_ifsc_response = "";
                                                                    console.error("DEBUG", "IFSC", "SELF", posp_ifsc_code, zoop_ifsc_data);
                                                                    if (zoop_ifsc_data && zoop_ifsc_data.Status && zoop_ifsc_data.Status === "Success" && zoop_ifsc_data.data && zoop_ifsc_data.data.result) {
                                                                        posp_zoop_ifsc_response = zoop_ifsc_data.data.result;
                                                                        posp_branch_name = posp_zoop_ifsc_response.branch || "";
                                                                        posp_bank_name = posp_zoop_ifsc_response.bank || "";
                                                                    }

                                                                    if (nominee_name && nominee_name !== dsa_name && nom_relationship && ["Self", "SELF"].indexOf(nom_relationship) === -1) {

                                                                    } else {
                                                                        nominee_name = dsa_name;
                                                                    }
                                                                    nom_pan_no = posp_pan_no;
                                                                    //nom_aadhar_no = posp_aadhar_no;
																	nom_aadhar_no = "";
                                                                    nom_acc_no = posp_acc_no;
                                                                    nom_ifsc_code = posp_ifsc_code;
                                                                    nom_bank_name = posp_bank_name;
                                                                    nom_branch_name = posp_branch_name;

                                                                    if (true || ((nom_branch_name == "" || nom_branch_name == null || nom_branch_name == undefined) || (nom_bank_name == "" || nom_bank_name == null || nom_bank_name == undefined)) && nom_ifsc_code) {
                                                                        service_url = config.environment.weburl + '/onboarding/bank_ifsc_verification';
                                                                        nom_ifsc_args = {
                                                                            data: {
                                                                                'User_Id': ss_id,
                                                                                'Ifsc': nom_ifsc_code
                                                                            },
                                                                            headers: {
                                                                                "Content-Type": "application/json"
                                                                            }
                                                                        };
                                                                    } else {
                                                                        service_url = config.environment.weburl;
                                                                    }
                                                                    client.post(service_url, nom_ifsc_args, function (nom_zoop_ifsc_data, zoop_ifsc_response) {
                                                                        console.error("DEBUG", "IFSC", "NOMINEE", nom_ifsc_code, nom_zoop_ifsc_data);
                                                                        let nom_zoop_ifsc_response = "";
                                                                        if (nom_zoop_ifsc_data && nom_zoop_ifsc_data.Status && nom_zoop_ifsc_data.Status === "Success" && nom_zoop_ifsc_data.data && nom_zoop_ifsc_data.data.result) {
                                                                            nom_zoop_ifsc_response = nom_zoop_ifsc_data.data.result;
                                                                            nom_branch_name = nom_zoop_ifsc_response.branch || "";
                                                                            nom_bank_name = nom_zoop_ifsc_response.bank || "";
                                                                        }

                                                                        let xml_erp_dsa_details = fs.readFileSync(appRoot + '/resource/request_file/erp_code_generate_request.xml').toString();
                                                                        posp_training_obj.forEach((obj) => {
                                                                            obj.StartDate = moment(obj.StartDate, 'YYYY-MM-DDThh:mm:ss[Z]').format("MM/DD/YYYY hh:mm:ss A");
                                                                            obj.EndDate = moment(obj.EndDate, 'YYYY-MM-DDThh:mm:ss[Z]').format("MM/DD/YYYY hh:mm:ss A");
                                                                        });
                                                                        let reg_fess = 999;
                                                                        let payment_mode = 1;
                                                                        console.log("posp_user_data.POSP_Sources : ",posp_user_data.POSP_Sources);
                                                                        if(posp_user_data.POSP_Sources && posp_user_data.POSP_Sources === "TESTUSER"){
                                                                            if(posp_user_data.Payment_Subscription_Mode && ["Pay-As-You-Sell"].includes(posp_user_data.Payment_Subscription_Mode) ){
                                                                                reg_fess = 0; 
                                                                                payment_mode = 2;
                                                                            }                                                                           
                                                                        }
																		if (posp_user_data.POSP_Sources && posp_user_data.POSP_Sources === "NPOS") {
                                                                            reg_fess = 0;
                                                                            payment_mode = 3;
                                                                        }
                                                                        let replaceObj = {
                                                                            "___fba_id___": posp_user_data.Fba_Id || 0,
                                                                            "___posp_id___": posp_user_data.Ss_Id || 0,
                                                                            "___cordinator_id___": 116, // not available in dsa service
                                                                            "___city___": agent_cities[posp_user_data["Agent_City"]] || posp_user_data.Agent_City,
                                                                            "___product_list___": "Motor, Life", //posp_dsa_response['product'],
                                                                            "___dsa_name___": dsa_name,
                                                                            "___date_of_birth___": posp_user_data.DOB_On_PAN || "",
                                                                            "___gender___": posp_user_data.Gender || "",
                                                                            "___mobile_no___": posp_user_data.Mobile_No || posp_user_data.Mobile_Number || "",
                                                                            "___email___": posp_user_data.Email_Id || "",
                                                                            "___pan___": posp_user_data.Pan_No || "",
                                                                            "___qualification___": posp_data["Education"] || "2",
                                                                            "___sales_experience_year___": posp_data["Experience"] || "",
                                                                            "___source_type___": posp_data["Sources"] || "",
                                                                            "___address_1___": posp_user_data.Present_Add1 ? posp_user_data.Present_Add1.replace(/&/g, '&amp;') : "",
                                                                            "___address_2___": posp_user_data.Present_Add2 ? posp_user_data.Present_Add2.replace(/&/g, '&amp;') : "",
                                                                            "___address_3___": posp_user_data.Present_Add3 ? posp_user_data.Present_Add3.replace(/&/g, '&amp;') : "",
                                                                            "___permanant_address_1___": posp_user_data.Present_Add1 ? posp_user_data.Present_Add1.replace(/&/g, '&amp;') : "",
                                                                            "___permanant_address_2___": posp_user_data.Present_Add2 ? posp_user_data.Present_Add2.replace(/&/g, '&amp;') : "",
                                                                            "___permanant_address_3___": posp_user_data.Present_Add3 ? posp_user_data.Present_Add3.replace(/&/g, '&amp;') : "",
                                                                            "___aadhar___": posp_aadhar_no,
                                                                            "___account_type___": posp_acc_type,
                                                                            "___bank_account_number___": posp_acc_no,
                                                                            "___ifsc_code___": posp_ifsc_code,
                                                                            "___micrcode___": posp_data["Micr_Code"] || "",
                                                                            "___bank_name___": posp_bank_name ? posp_bank_name.replace(/&/g, '&amp;') : "",
                                                                            "___center___": posp_branch_name ? posp_branch_name.replace(/&/g, '&amp;') : "",
                                                                            "___bank_city___": posp_branch_name ? posp_branch_name.replace(/&/g, '&amp;') : "",
                                                                            "___nominee_name___": nominee_name.trim(),
                                                                            "___nominee_pan___": nom_pan_no,
                                                                            "___nominee_aadhar___": nom_aadhar_no,
                                                                            "___nominee_bank_account_no___": nom_acc_no,
                                                                            "___nominee_account_type___": nom_acc_type,
                                                                            "___nominee_ifsc_code___": nom_ifsc_code,
                                                                            "___nominee_micrcode___": posp_data["Micr_Code"] || "",
                                                                            "___nominee_bank_name___": nom_bank_name ? nom_bank_name.replace(/&/g, '&amp;') : "",
                                                                            "___nominee_bank_branch___": nom_branch_name ? nom_branch_name.replace(/&/g, '&amp;') : "",
                                                                            "___nominee_bank_city___": nom_branch_name ? nom_branch_name.replace(/&/g, '&amp;') : "",
                                                                            //"___is_posp___": 6, // now hardcoded 6
                                                                            "___is_posp___": (posp_data.Sources && (["31"].indexOf(posp_data.Sources) > -1)) ? "9" : "6", // For ERP Code Start With (6,9)
                                                                            "___posp_category___": 2,
                                                                            "___appointed_by___": rm_uid,
                                                                            "___training_log___": JSON.stringify(posp_training_obj),
                                                                            "___training_start_date___": posp_user_data.Training_Start_Date ? (moment.utc(posp_user_data["Training_Start_Date"], "YYYY-MM-DDTHH:mm:ss[Z]").format("DD-MMM-YYYY")) : "",
                                                                            "___training_end_date___": posp_user_data.Training_End_Date ? (moment.utc(posp_user_data["Training_End_Date"], "YYYY-MM-DDTHH:mm:ss[Z]").format("DD-MMM-YYYY")) : "",
                                                                            "___certificate_date___": posp_user_data.Exam_End_Date ? (moment.utc(posp_user_data["Exam_End_Date"], "YYYY-MM-DDTHH:mm:ss[Z]").format("DD-MMM-YYYY")) : "",
                                                                            "___registration_fee___": reg_fess,
									    									"___posp_pincode___": posp_user_data.Present_Pincode ? posp_user_data.Present_Pincode : "",
									    									"___posp_city___":posp_user_data.Present_City ? posp_user_data.Present_City.replace(/&/g, '&amp;') : "",
                                                                            "___onboarding_payment_mode___": payment_mode,
                                                                            "___pre_generated_pos_code___":'0'
                                                                        };
                                                                        //ERP Blank Fields Checking start by Nilam 25-10-2023
//                                                                        for (let key in replaceObj) {
//                                                                            console.log(key, replaceObj[key]);
//                                                                            if(["",null,undefined].indexOf(replaceObj[key]) > -1){
//                                                                                console.log("Error: ", key);
//                                                                                let org_key = key.replaceAll("___","");
//                                                                                arr_msg.push(org_key+" :: MISSING :: " + replaceObj[key]);
//                                                                            }
//                                                                        }
//                                                                        if (arr_msg.length > 0) {
//                                                                            error_msg = arr_msg.join("<BR>");
//                                                                            console.log("Error: ", error_msg); 
//                                                                            objResponseFull["Status"] = "FAIL";
//                                                                            objResponseFull["Msg"] = error_msg;
//                                                                            res.json(objResponseFull);
//                                                                        }        //ERP Blank Fields Checking end by Nilam 25-10-2023                                                               //ERP Blank Fields Checking end by Nilam 25-10-2023
//                                                                       else{
                                                                        let replace_xml_erp_code_req = "";
                                                                        replace_xml_erp_code_req = xml_erp_dsa_details.replaceJson(replaceObj);
                                                                        let stringify_xml = '`' + replace_xml_erp_code_req + '`';
                                                                        stringify_xml.replace(/___(.*?)___/g, "NA");
                                                                        console.error('stringify_xml', stringify_xml);
                                                                        let xml_erp_data = stringify_xml;
                                                                        let body = replace_xml_erp_code_req;
                                                                        let postRequest = {
                                                                            host: "202.131.96.100",
                                                                            path: "/Service.svc",
                                                                            port: '8074',
                                                                            method: "POST",
                                                                            rejectUnauthorized: false,
                                                                            headers: {
                                                                                'Cookie': "cookie",
                                                                                'Content-Type': 'text/xml; charset=utf-8',
                                                                                'Content-Length': Buffer.byteLength(body),
                                                                                "SOAPAction": "http://tempuri.org/IService1/InsertDSADetails",
                                                                                "Cache-Control": 'private, no-cache, no-store, must-revalidate, max-age=0',
                                                                                "Pragma": "no-cache"
                                                                            }
                                                                        };
                                                                        let StartDate = moment(new Date());
                                                                        let fliter_response = "";
                                                                        let dsa_req = http.request(postRequest, function (dsa_res) {
                                                                            console.error('ERP CODE Status Code', dsa_res.statusCode);
                                                                            let buffer = "";
                                                                            dsa_res.on("data", function (data) {
                                                                                buffer = buffer + data;
                                                                            });
                                                                            dsa_res.on("end", function (data) {
                                                                                console.error('ERP CODE Status Buffer data', buffer);
                                                                                fliter_response = buffer.replace(/s:/g, '');
                                                                                xml2js.parseString(buffer, {tagNameProcessors: [stripPrefix]}, function (err, objXml2Json) {
                                                                                    let EndDate = moment(new Date());
                                                                                    let Call_Execution_Time = EndDate.diff(StartDate);
                                                                                    Call_Execution_Time = Math.round((Call_Execution_Time * 0.001) * 100) / 100;
                                                                                    let erp_code = "";
                                                                                    if (err) {
                                                                                        objResponseFull['Data'] = err;
                                                                                        objResponseFull['Status'] = "FAIL";
                                                                                        objResponseFull['Msg'] = "ERROR IN ERP CODE GENERATION";
                                                                                    } else {
                                                                                        try {
                                                                                            objResponseFull['Data'] = objXml2Json;
                                                                                            if (objXml2Json && objXml2Json.hasOwnProperty('Envelope') && objXml2Json['Envelope'].hasOwnProperty('Body')) {
                                                                                                if (objXml2Json['Envelope']['Body'][0].hasOwnProperty('InsertDSADetailsResponse')) {
                                                                                                    erp_code = objXml2Json['Envelope']['Body'][0]['InsertDSADetailsResponse'][0]['InsertDSADetailsResult'][0];
                                                                                                    if (!isNaN(erp_code)) {
                                                                                                        objResponseFull['Status'] = "SUCCESS";
                                                                                                        objResponseFull['ERP_Code'] = erp_code;
                                                                                                        objResponseFull['Msg'] = "ERP CODE GENENERATED SUCCESSFULLY :: " + erp_code;
                                                                                                    } else if (erp_code.includes('is already exist')) {
                                                                                                        objResponseFull['ERP_Code'] = erp_code ? ((erp_code.split(":")[2]).trim()) : "";
                                                                                                        objResponseFull['Status'] = "SUCCESS";
                                                                                                        objResponseFull['Msg'] = "ERP CODE ALREADY EXIST :: " + erp_code;
                                                                                                    } else {
                                                                                                        objResponseFull['Status'] = "FAIL";
                                                                                                        objResponseFull['Msg'] = "ERP CODE GENERATION FAILED :: " + erp_code;
                                                                                                    }
                                                                                                } else {
                                                                                                    xml_err_res = objXml2Json['Envelope']['Body'][0]['Fault'][0];
                                                                                                    if (xml_err_res.hasOwnProperty('detail') && xml_err_res['detail'][0].hasOwnProperty('ExceptionDetail') && xml_err_res['detail'][0]['ExceptionDetail'][0] && xml_err_res['detail'][0]['ExceptionDetail'][0].hasOwnProperty('Message')) {
                                                                                                        erp_code = xml_err_res['detail'][0]['ExceptionDetail'][0]['Message'][0];
                                                                                                    }
                                                                                                    objResponseFull['Status'] = "FAIL";
                                                                                                    objResponseFull['Msg'] = "ERP CODE GENERATION FAILED :: " + erp_code;
                                                                                                }
                                                                                            } else {
                                                                                                objResponseFull['Status'] = "FAIL";
                                                                                                objResponseFull['Msg'] = "ERP CODE GENERATION FAILED";
                                                                                            }
                                                                                        } catch (e) {
                                                                                            console.error('ERP CODE SERVICE EXCEPTION', e.stack);
                                                                                        }
                                                                                    }
                                                                                    let app_version = 'PolicyBoss.com';
                                                                                    let type = "CODE";
                                                                                    let sub = '[' + ((objResponseFull["Status"] === 'SUCCESS') ? 'INFO' : objResponseFull["Status"]) + ']' + '-' + app_version + '-ERP_' + type + ((objResponseFull["Status"] === 'SUCCESS') ? ('-' + (objResponseFull.ERP_Code ? objResponseFull.ERP_Code : "NA")) : ('-0')) + '::SS_ID-' + ss_id + '::Exec_Time-' + Call_Execution_Time + '_SEC';
                                                                                    let msg = '<!DOCTYPE html><html><head><title>LERP ' + type + ' Create</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                                                                                    msg += '<div class="report"><span  style="font-family:tahoma;font-size:18px;">ERP_' + type + '&nbsp;Response</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
                                                                                    msg += '<tr><td  width="78%" style="font-family:tahoma;font-size:14px;"><pre>' + fliter_response.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ /g, '&nbsp;').replace(/\n/g, '<br />') + '</pre></td></tr>';
                                                                                    msg += '</table></div>';
                                                                                    msg += '<br><br>';
                                                                                    msg += '<div class="report"><span  style="font-family:tahoma;font-size:18px;">ERP_' + type + '&nbsp;Request</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
                                                                                    msg += '<tr><td  width="78%" style="font-family:tahoma;font-size:14px;"><pre>' + xml_erp_data.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/ /g, '&nbsp;') + '</pre></td></tr>';
                                                                                    msg += '</table></div><br><br>';
                                                                                    msg += '</body></html>';
                                                                                    let Email = require('../models/email');
                                                                                    let objModelEmail = new Email();
                                                                                    let arr_to = [config.environment.notification_email];
                                                                                    let arr_cc = [];
                                                                                    let arr_bcc = [];
                                                                                    objModelEmail.send('pospcom@policyboss.com', arr_to.join(','), sub, msg, arr_cc.join(','), arr_bcc.join(','), '');
                                                                                    if (objResponseFull.Status && objResponseFull.Status === "SUCCESS" && objResponseFull.ERP_Code) {
                                                                                        //start added by roshani 05-09-2023
                                                                                        try {
                                                                                            let erp_create_update_args = {
                                                                                                data: {
                                                                                                    "Erp_Id": objResponseFull.ERP_Code,
                                                                                                    "ERPID_CreatedDate": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                                                                                                },
                                                                                                headers: {
                                                                                                    "Content-Type": "application/json"
                                                                                                }
                                                                                            };
                                                                                            client.post(config.environment.weburl + "/onboarding/posp_data_update?ss_id=" + ss_id, erp_create_update_args, function (iib_upload_update_data, iib_upload_update_response) {});
                                                                                        } catch (e) {
                                                                                            console.error('Update POSP collection at the time of ERP Code Create ', e.stack);
                                                                                        }
                                                                                        //end added by roshani 05-09-2023
                                                                                        
                                                                                        //start loyalty_activation 06-05-2024
                                                                                        try {
                                                                                            if (posp_user_data.Sources && (posp_user_data.Sources - 0) === 31 && posp_user_data.Is_User_Active === "No") {
                                                                                                let loyalty_activation_args = {
                                                                                                    data: {
                                                                                                        "Ss_Id": ss_id,
                                                                                                        "Erp_Id": objResponseFull.ERP_Code
                                                                                                    },
                                                                                                    headers: {
                                                                                                        "Content-Type": "application/json"
                                                                                                    }
                                                                                                };
                                                                                                client.post(config.environment.weburl + "/prospect_npos_activation/add_loyalty_activation_user", loyalty_activation_args, function (loyalty_activation_args_data, loyalty_activation_args_response) {
                                                                                                    
                                                                                                });
                                                                                            }
                                                                                        } catch (e) {
                                                                                            console.error('Exception In Insert Loyalty Activation Data', e.stack);
                                                                                        }
                                                                                        //end loyalty_activation 06-05-2024
                                                                                        
                                                                                        try {
                                                                                            console.error('erp_code_generation_post_process_url', config.environment.weburl + "/posps/mssql/erp_code_generation_post_process?ss_id=" + ss_id + "&fba_id=" + posp_user_data["Fba_Id"] + "&erp_id=" + erp_code + "&dbg=no");
                                                                                            client.get(config.environment.weburl + "/posps/mssql/erp_code_generation_post_process?ss_id=" + ss_id + "&fba_id=" + posp_user_data["Fba_Id"] + "&erp_id=" + erp_code + "&dbg=no", {}, function (mssql_erp_data, mssql_erp_response) {
                                                                                                //sync inquiry data
                                                                                                client.get(config.environment.weburl + '/posps/report/sync_signup_inquiry?ss_id=' + ss_id, {}, function (data_inquiry, response_inquiry) {});

                                                                                                console.error('erp_code_generation_post_process_response', mssql_erp_data);
                                                                                                client.get(config.environment.weburl + '/posps/report/posp_onboarding_notification_rm?email=yes&email_type=ERPCODECREATION&ss_id=' + ss_id, {}, function (rmdata, rmresponse) {
                                                                                                    console.error('erp_code_generation_rm_notification_response', rmdata);
                                                                                                });
                                                                                            });
                                                                                        } catch (e) {
                                                                                            console.error('erp_code_generation_post_process_response Error', e.stack);
                                                                                        }
                                                                                    }
                                                                                    //send Email to POSP
                                                                                    let posp_msg = objResponseFull["Status"] === 'SUCCESS' ? 'Pos Erp Code: ' + objResponseFull.ERP_Code : 'Pos Erp Code Err Message: ' + objResponseFull.Msg.split(":")[3];
                                                                                    let posp_sub = objResponseFull["Status"] === 'SUCCESS' ? '[POSP-ONBOARDING] ERP CODE GENERATED' : '[POSP-ONBOARDING] ERP CODE GENERATION ERROR';
                                                                                    posp_sub = posp_sub + '::SS_ID-' + ss_id + '::FBA_ID-' + fba_id;
                                                                                    let posp_msg_head = objResponseFull["Status"] === 'SUCCESS' ? "ERP-CODE-GENERATED" : "ERP-CODE-GENERATION-ERROR";
                                                                                    let posp_mail_content = '<!DOCTYPE html><html><head><title>ERP GENERATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>'
                                                                                            + '<p>' + posp_msg_head + '</p>'
                                                                                            + '<p>--------------------------------------------------</p>'
                                                                                            + '<p>Pos Name: ' + dsa_name + '</p>'
                                                                                            + '<p>RM Name: ' + rm_name + '</p>'
                                                                                            + '<p>Business Vertical: ' + subVertical + '</p>'
                                                                                            + '<p>Pos Ss_Id:' + ss_id + '</p>'
                                                                                            + '<p>' + posp_msg + '</p>'
                                                                                            + '</body></html>';
                                                                                    let posp_arr_to = [];
                                                                                    let posp_arr_cc = [];
                                                                                    let posp_arr_bcc = [];
                                                                                    if (objResponseFull["Status"] === 'SUCCESS') {
                                                                                        posp_arr_to.push('posp.onboarding@policyboss.com');
                                                                                        posp_arr_cc.push('posp.ops@policyboss.com');
                                                                                        posp_email ? posp_arr_to.push(posp_email) : "";
                                                                                        rm_email ? posp_arr_cc.push(rm_email) : "";
                                                                                        posp_arr_bcc.push(config.environment.notification_email);
                                                                                    } else {
                                                                                        //rm_email ? posp_arr_to.push(rm_email) : "";
                                                                                        posp_arr_to.push(config.environment.notification_email);
																						posp_arr_to.push("anil.yadav@policyboss.com");
                                                                                        rm_email = "";
																						objModelEmail.send('pospcom@policyboss.com', posp_arr_to.join(','), posp_sub, posp_mail_content, posp_arr_cc.join(','), posp_arr_bcc.join(','), '');
                                                                                    }

                                                                                    
                                                                                    //
                                                                                    let posp_args = {
                                                                                        'Erp_Id': objResponseFull['ERP_Code'],
                                                                                        'Erp_Msg': objResponseFull['Msg'],
                                                                                        'Erp_Status': objResponseFull['Status'],
                                                                                        'ERPID_CreatedDate': moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                                                                                    };
                                                                                    console.error({"User_Id": ss_id}, {$set: posp_args});
                                                                                    posp_user.update({"User_Id": ss_id}, {$set: posp_args}, function (posp_user_err, posp_user_numAffected) {
                                                                                        if (posp_user_err) {
                                                                                            objResponseFull["Status"] = "FAIL";
                                                                                            objResponseFull["Msg"] = "ERROR IN ERP CODE UPDATION IN COLLECTION";
                                                                                            objResponseFull["Data"] = posp_user_err;
                                                                                            res.json(objResponseFull);
                                                                                        } else {
																							if (objResponseFull["Status"] === 'SUCCESS') {
																								client.get(config.environment.weburl + '/posps/report/email_consolidate_process?ss_id='+ss_id.toString()+'&event_type=ERP_CODE', {}, function (signup_data, signup_res) {
																									console.error("DBG","email_consolidate_process",ss_id,"SIGNUP",config.environment.weburl + '/posps/report/email_consolidate_process?ss_id='+ss_id.toString()+'&event_type=ERP_CODE',signup_data);
																								});
																							}
                                                                                            console.error("ERP CODE DATA UPDATED IN POSP USER COLLECTION");
                                                                                            res.json(objResponseFull);
                                                                                        }
                                                                                    });
                                                                                });
                                                                            });
                                                                            dsa_res.on('error', function (dsa_err) {
                                                                                console.error('problem with request: ' + dsa_err.message);
                                                                            });
                                                                            dsa_res.on('timeout', function () {
                                                                                console.error("Exception", "InsertDSADetails_TIMEOUT");
                                                                            });
                                                                        });
                                                                        dsa_req.write(body);
                                                                        dsa_req.end();
                                                                   // }
                                                                    });
                                                                });
                                                            } else {
                                                                objResponseFull["Status"] = "FAIL";
                                                                objResponseFull["Msg"] = "NO DATA AVAILABLE IN posp_training_histories COLLECTION";
                                                                res.json(objResponseFull);
                                                            }
                                                        });
                                                    } else {
                                                        objResponseFull["Status"] = "FAIL";
                                                        objResponseFull["Msg"] = "USER TYPE NOT ALLOWED FOR ERP CODE";
                                                        res.json(objResponseFull);
                                                    }
                                                });
                                            } else {
                                                objResponseFull["Status"] = "FAIL";
                                                objResponseFull["Msg"] = document_status_data.Msg;
                                                res.json(objResponseFull);
                                            }
                                        });
                                    } else {
                                        objResponseFull["Status"] = "FAIL";
                                        objResponseFull["Msg"] = "PAN NOT UPLOADED AT IIB";
                                        res.json(objResponseFull);
                                    }
                                });
                            } else {
                                objResponseFull["Status"] = "FAIL";
                                objResponseFull["Msg"] = error_msg;
                                res.json(objResponseFull);
                            }
                        }
                    } else {
                        objResponseFull["Status"] = "FAIL";
                        objResponseFull["Msg"] = "NO DATA AVAILABLE IN posp_user COLLECTION";
                        res.json(objResponseFull);
                    }
                });
            } else {
                objResponseFull["Status"] = "FAIL";
                objResponseFull["Msg"] = "SS_ID IS MANDATORY";
                res.json(objResponseFull);
            }
        } catch (e) {
            objResponseFull["Status"] = "FAIL";
            objResponseFull["Msg"] = e.stack;
            res.json(objResponseFull);
        }
    });
    app.get("/onboarding/save_document", function (req, res) { // roshani fetch document from dsa service & save document to temp folder
        try {
            let Client = require('node-rest-client').Client;
            let client = new Client();
            let http = require('http');
            let https = require('https');
            let Stream = require('stream').Transform;
            let ss_id = req.query.ss_id ? req.query.ss_id - 0 : "";
            let posp_dsa_data = "";
            if (ss_id !== "") {
                client.get('http://horizon.policyboss.com:5000/posps/dsas/view/' + ss_id, {}, function (posp_dsa_response, response) {
                    if (posp_dsa_response && posp_dsa_response.status && posp_dsa_response.status === "SUCCESS") {
                        posp_dsa_data = posp_dsa_response;
                        let document_obj = {"Photograph": "Profile_", "10th Certificate": "QualificationCertificate_", "12th Certificate (optional)": "QualificationCertificate_", "Pancard": "PanCard_", "Aadhar Card": "AadharCard_", "AADHAAR_BACK": "AadharCardBack_", "NOMINEE_PAN_DOC": "Nominee_Pan_Card_", "Copy of Cancelled Cheque for Self": "Posp_Bank_Account_", "NOMINEE_ACC_DOC": "Nominee_Bank_Account_", "PostTraining_Pass": "Certificate_"};
                        let document_list = posp_dsa_data.POSP.Document_List;
                        let doc_length = Object.keys(document_list).length;
                        Object.keys(document_list).find(key => {
                            if (document_list[key] !== "" && document_list[key] !== undefined && document_list[key] !== null) {
                                doc_length--;
                                let document_url = document_list[key];
                                let filename = document_obj[key] + ss_id + "." + document_url.split('.').pop();
                                let path = appRoot + "/tmp/onboarding_docs/" + ss_id;
                                if (!fs.existsSync(appRoot + "/tmp/onboarding_docs/" + ss_id)) {
                                    fs.mkdirSync(appRoot + "/tmp/onboarding_docs/" + ss_id);
                                }
                                let client = http;
                                if (document_url.toString().indexOf("https") === 0) {
                                    client = https;
                                }
                                client.request(document_url, function (doc_response) {
                                    let doc_data = new Stream();
                                    doc_response.on('data', function (chunk) {
                                        doc_data.push(chunk);
                                    });
                                    doc_response.on('end', function () {
                                        fs.writeFileSync(path + '/' + filename, doc_data.read());
                                    });
                                    fs.unlink(path + '/' + filename, function (doc_err) {
                                        if (doc_err) {
                                            console.log({'Status': "FAIL", 'Msg': 'Error in deleting a file.', 'Error': doc_err});
                                        }
                                    });
                                }).end();
                            }
                        });
//                        if (doc_length <= 0) {
                        res.json({"Status": "SUCCESS", "Msg": "Document Save Successfully", "Ss_Id": ss_id});
//                        } else {
//                            res.json({"Status": "FAIL", "Msg": "Some Documents Are Pending To Upload", "Ss_Id": ss_id});
//                        }
                    } else {
                        res.json({"Status": "FAIL", "Msg": "No Record Found For Given Ss_Id.", "Ss_Id": ss_id});
                    }
                });
            } else {
                res.json({"Status": "FAIL", "Msg": "Ss_Id is Missing"});
            }
        } catch (e) {
            res.json({"Status": "FAIL", "Msg": e.stack});
        }
    });
    app.get("/onboarding/upload_document_NIU", function (req, res) { // roshani - save multiple documents to UploadToTempFolder
        try {
            let Client = require('node-rest-client').Client;
            let client = new Client();
            let ss_id = req.query.ss_id ? req.query.ss_id - 0 : "";
            let erp_code = req.query.erp_code ? req.query.erp_code - 0 : "";
            let doc_upload_success_res = [];
            let doc_upload_fail_res = [];
            if (ss_id && erp_code) {
                let path = appRoot + "/tmp/onboarding_docs/" + ss_id;
                let arr_read_files = fs.readdirSync(path);
                console.error("read_data", arr_read_files);
                let doc_length = Object.keys(arr_read_files).length;
                for (let k in arr_read_files) {
                    doc_length--;
                    if (arr_read_files[k] === '.') {
                        continue;
                    }
                    let file_path = path + '/' + arr_read_files[k];
                    if (fs.existsSync(file_path)) {
                        let file_name = arr_read_files[k];
                        let post_request = {
                            'file_name': file_name,
                            'ss_id': ss_id,
                            'erp_code': erp_code
                        };
                        console.error(JSON.stringify(post_request));
                        let post_args = {
                            data: post_request,
                            headers: {
                                "Content-Type": "application/json"
                            }
                        };
                        client.post(config.environment.weburl + "/onboarding/save_doc_temp_folder", post_args, function (upload_data, upload_response) {
                            if (upload_data && upload_data.Status && upload_data.Status === "SUCCESS") {
                                doc_upload_success_res.push(upload_data);
                            } else {
                                doc_upload_fail_res.push(upload_data);
                            }
                            let response_length = doc_upload_success_res.length + doc_upload_fail_res.length;
                            if (response_length === arr_read_files.length) {
                                let json_response = {"Status": "SUCCESS", "Msg": "Document Save Successfully", "Success_Response": doc_upload_success_res, "Ss_Id": ss_id, "ERP_CODE": erp_code};
                                if (doc_upload_fail_res.length > 0) {
                                    json_response['Fail_Response'] = doc_upload_fail_res;
                                }
                                try {
                                    let objModelEmail = new Email();
                                    let gen_res = json_response["Success_Response"];
                                    let len = gen_res.length;
                                    var div = "<br>ERP_DOCUMENT_UPLOAD RESPONSE<table style='margin-top: 10px;border:1px solid black;border-collapse: collapse;padding:10px'><tr><th style='border: 1px solid black;padding: 15px;font-family:tahoma;font-size:14px;'>SR.NO</th><th style='border: 1px solid black;padding: 15px;font-family:tahoma;font-size:14px;'>DOCUMENT TYPE</th><th style='border: 1px solid black;padding: 15px;font-family:tahoma;font-size:14px;'>DOCUMENT UPLOAD ID</th><th style='border: 1px solid black;padding: 15px;font-family:tahoma;font-size:14px;'>STATUS</th></tr>";
                                    for (let x = 0; x < len; x++) {
                                        let doc_upload_status = gen_res[x].Status ? gen_res[x].Status : "Fail";
                                        let doc_type = gen_res[x]["Doc_Name"].split(".")[0];
                                        console.log("doc_upload_status : ", doc_upload_status);
                                        var upload_temp_id = "";
                                        try {
                                            upload_temp_id = gen_res[x].Response.Response.Envelope.Body[0].UploadToTempFolderResponse[0].UploadToTempFolderResult[0];
                                        } catch (e) {
                                            upload_temp_id = "";
                                        }

                                        div = div + '<tr><td style="border: 1px solid black;padding: 15px;font-family:tahoma;font-size:14px;"><p>' + (x + 1) + '</p></td><td style="border: 1px solid black;padding: 15px;font-family:tahoma;font-size:14px;"><p>' + doc_type + '</p></td><td style="border: 1px solid black;padding: 15px;font-family:tahoma;font-size:14px;"><p>' + upload_temp_id + '</p></td>'
                                                + '<td style="border: 1px solid black;padding: 15px;font-family:tahoma;font-size:14px;"><p>' + doc_upload_status + '</p></td></tr>';
                                    }
                                    let app_version = 'PolicyBoss.com';
                                    let type = "CERTIFICATE";
                                    let sub = '[' + config.environment.name.toString().toUpperCase() + '] -' + app_version + '-ERP_CODE-' + erp_code + '::SS_ID-' + ss_id;
                                    let mail_content = '<!DOCTYPE html><html><head><title>ERP ' + type + ' Create</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>'
                                            + div + '</table>'
                                            + '</body></html>';
                                    let arr_to = [config.environment.notification_email];
                                    let arr_cc = [];
                                    let arr_bcc = [];
                                    objModelEmail.send('pospcom@policyboss.com', arr_to.join(','), sub, mail_content, arr_cc.join(','), arr_bcc.join(','), '');
                                } catch (ex) {
                                    res.json({"Status": "FAIL", "Msg": ex.stack});
                                }
                                console.error('Upload Document Response', json_response);
                                res.json(json_response);
                            }
                        });
                    }
                }
            } else {
                res.json({"Status": "FAIL", "Msg": "Ss_Id or ERP_CODE is Missing"});
            }
        } catch (e) {
            res.json({"Status": "FAIL", "Msg": e.stack});
        }
    });
    app.get("/onboarding/upload_document", function (req, res) { // roshani - save multiple documents to UploadToTempFolder
        try {
            let Client = require('node-rest-client').Client;
            let client = new Client();
            let education = 2;
            let ss_id = req.query.ss_id ? req.query.ss_id - 0 : "";
            let erp_code = req.query.erp_code ? req.query.erp_code - 0 : "";
            let doc_upload_success_res = [];
            let doc_upload_fail_res = [];
            //let documents_names_prefix = ["Profile", "QualificationCertificate", "PanCard", "AadharCard", "Posp_Bank_Account", "AadharCardBack"];
			let documents_names_prefix = ["Profile", "QualificationCertificate", "PanCard", "Posp_Bank_Account"];
            if (ss_id && erp_code) {
                posp_user.find({"User_Id": ss_id}, function (posp_user_find_err, posp_user_data) {
                    if (posp_user_find_err) {
                        res.json({"Status": "Fail", "Msg": posp_user_find_err});
                    } else {
                        if (posp_user_data && posp_user_data.length > 0) {
                            let posp_data = posp_user_data[0]._doc;
                            education = posp_data.Education && (posp_data.Education - 0) || "" ;
                            if([2,3,4].indexOf(education) === -1){
                                education = 2;
                            }
                let path = appRoot + "/tmp/onboarding_docs/" + ss_id;
                let arr_read_files = fs.readdirSync(path);
                console.error("read_data", arr_read_files);
                let doc_length = Object.keys(arr_read_files).length;
                for (let k in arr_read_files) {
                    let file_prefix = arr_read_files[k].split('.')[0];
                    file_prefix = file_prefix.replace("_" + ss_id, "").trim();
                    if (documents_names_prefix.includes(file_prefix)) {
                        doc_length--;
                        if (arr_read_files[k] === '.') {
                            continue;
                        }
                        let file_path = path + '/' + arr_read_files[k];
                        if (fs.existsSync(file_path)) {
                            let file_name = arr_read_files[k];
                            let post_request = {
                                'file_name': file_name,
                                'ss_id': ss_id,
                                            'erp_code': erp_code,
                                            'education': education
                            };
                            console.error(JSON.stringify(post_request));
                            let post_args = {
                                data: post_request,
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            };
                            client.post(config.environment.weburl + "/onboarding/save_doc_temp_folder", post_args, function (upload_data, upload_response) {
                                if (upload_data && upload_data.Status && upload_data.Status === "SUCCESS") {
                                    doc_upload_success_res.push(upload_data);
                                } else {
                                    doc_upload_fail_res.push(upload_data);
                                }
                                let response_length = doc_upload_success_res.length + doc_upload_fail_res.length;
                                if (response_length === documents_names_prefix.length) {
                                    let json_response = {"Status": "SUCCESS", "Msg": "Document Save Successfully", "Success_Response": doc_upload_success_res, "Ss_Id": ss_id, "ERP_CODE": erp_code};
                                    if (doc_upload_fail_res.length > 0) {
                                        json_response['Fail_Response'] = doc_upload_fail_res;
                                    }
                                    try {
                                        let objModelEmail = new Email();
                                        let gen_res = json_response["Success_Response"];
                                        let len = gen_res.length;
                                        var div = "<br>ERP_DOCUMENT_UPLOAD RESPONSE<table style='margin-top: 10px;border:1px solid black;border-collapse: collapse;padding:10px'><tr><th style='border: 1px solid black;padding: 15px;font-family:tahoma;font-size:14px;'>SR.NO</th><th style='border: 1px solid black;padding: 15px;font-family:tahoma;font-size:14px;'>DOCUMENT TYPE</th><th style='border: 1px solid black;padding: 15px;font-family:tahoma;font-size:14px;'>DOCUMENT UPLOAD ID</th><th style='border: 1px solid black;padding: 15px;font-family:tahoma;font-size:14px;'>STATUS</th></tr>";
                                        for (let x = 0; x < len; x++) {
                                            let doc_upload_status = gen_res[x].Status ? gen_res[x].Status : "Fail";
                                            let doc_type = gen_res[x]["Doc_Name"].split(".")[0];
											doc_type = doc_type.replace("_" + ss_id, ""); 
                                            console.log("doc_upload_status : ", doc_upload_status);
                                            var upload_temp_id = "";
                                            try {
                                                upload_temp_id = gen_res[x].Response.Response.Envelope.Body[0].UploadToTempFolderResponse[0].UploadToTempFolderResult[0];
                                            } catch (e) {
                                                upload_temp_id = "";
                                            }

                                            div = div + '<tr><td style="border: 1px solid black;padding: 15px;font-family:tahoma;font-size:14px;"><p>' + (x + 1) + '</p></td><td style="border: 1px solid black;padding: 15px;font-family:tahoma;font-size:14px;"><p>' + doc_type + '</p></td><td style="border: 1px solid black;padding: 15px;font-family:tahoma;font-size:14px;"><p>' + upload_temp_id + '</p></td>'
                                                    + '<td style="border: 1px solid black;padding: 15px;font-family:tahoma;font-size:14px;"><p>' + doc_upload_status + '</p></td></tr>';
                                        }
                                        let app_version = 'PolicyBoss.com';
                                        let type = "CERTIFICATE";
                                        let sub = '[' + config.environment.name.toString().toUpperCase() + '] -' + app_version + '-ERP_CODE-' + erp_code + '::SS_ID-' + ss_id;
                                        let mail_content = '<!DOCTYPE html><html><head><title>ERP ' + type + ' Create</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>'
                                                + div + '</table>'
                                                + '</body></html>';
                                        let arr_to = [config.environment.notification_email];
                                        let arr_cc = [];
                                        let arr_bcc = [];
                                        objModelEmail.send('pospcom@policyboss.com', arr_to.join(','), sub, mail_content, arr_cc.join(','), arr_bcc.join(','), '');
                                    } catch (ex) {
                                        res.json({"Status": "FAIL", "Msg": ex.stack});
                                    }
                                    console.error('Upload Document Response', json_response);
                                    res.json(json_response);
                                }
                            });
                        }
                    }
                }
            } else {
                            res.json({"Status": "FAIL", "Msg": "User doesn't exist in POSP_USER", "Ss_Id": ss_id});

                        }
                    }
                });
            } else {
                res.json({"Status": "FAIL", "Msg": "Ss_Id or ERP_CODE is Missing"});
            }
        } catch (e) {
            res.json({"Status": "FAIL", "Msg": e.stack});
        }
    });
    app.post("/onboarding/save_doc_temp_folder_NIU", function (req, res) { // roshani save single document to UploadToTempFolder
        try {
            let replaceObj = {};
            let objRequest = req.body;
            let doc_type = {
                "Photograph": 1,
                "10th Certificate": 2,
                "12th Certificate (optional)": 3,
                "Graduate Certificate (optional)": 4,
                "Permanent Address Proof": 5,
                "Present Address Proof": 6,
                "Pancard": 7,
                "Aadhar Card": 8,
                "Copy of Cancelled Cheque for Self": 9,
                "Copy of Cancelled Cheque for Nominee": 10,
                "Application form with signature (Optional)": 11,
                "Certificate-pdf": 12,
                "PostTraining_Pass": 12,
                "GST Registration Certificate": 13
            };
            let ss_id = objRequest.ss_id;
            let path = appRoot + "/tmp/onboarding_docs/" + ss_id;
            if (fs.existsSync(path)) {
                let arr_read_files = fs.readdirSync(path);
                if (arr_read_files.length > 0) {
                    let full_file_name = "";
                    let file_path = "";
                    for (let k in arr_read_files) {
                        if (objRequest.file_name === arr_read_files[k]) {
                            full_file_name = arr_read_files[k];
                            file_path = path + '/' + arr_read_files[k];
                        }
                    }
                    let file_name = (full_file_name).split(".")[0];
                    let file_ext = (full_file_name).split(".")[1];
                    let stats = fs.statSync(file_path);
                    let fileSizeInBytes = stats.size;
                    let fileSizeInKb = (fileSizeInBytes / 1024).toFixed(2);
                    //if (fileSizeInKb > 10) {
                    let bitmap = fs.readFileSync(file_path);
                    if (bitmap !== "") {
                        let file_binary_data = new Buffer(bitmap).toString('base64');
                        let xml_erp_dsa_details = fs.readFileSync(appRoot + '/resource/request_file/erp_document_upload.xml').toString();
                        let replace_xml_erp_code_req = "";
                        let replaceObj = {
                            '___file_bytes___': file_binary_data,
                            '___file_name___': file_name,
                            '___file_extension___': file_ext,
                            '___file_doc_type___': doc_type[file_name] ? doc_type[file_name] : "",
                            '___erp_code___': objRequest.erp_code
                        };
                        replace_xml_erp_code_req = xml_erp_dsa_details.replaceJson(replaceObj);
                        let stringify_xml = '`' + replace_xml_erp_code_req + '`';
                        stringify_xml.replace(/___(.*?)___/g, "NA");
                        let body = replace_xml_erp_code_req;
                        console.error('ERP Document Save Request', body);
                        let xml2js = require('xml2js');
                        let http = require('http');
                        let contentType = 'text/xml; charset=utf-8';
                        let stripPrefix = require('xml2js').processors.stripPrefix;
                        let postRequest = {
                            host: "202.131.96.100",
                            path: "/Service1.svc",
                            port: '8025',
                            method: "POST",
                            rejectUnauthorized: false,
                            headers: {
                                'Cookie': "cookie",
                                'Content-Type': contentType,
                                'Content-Length': Buffer.byteLength(body),
                                "SOAPAction": "http://tempuri.org/IService1/UploadToTempFolder",
                                "Cache-Control": 'private, no-cache, no-store, must-revalidate, max-age=0',
                                "Pragma": "no-cache"
                            }
                        };
                        let xml_req = http.request(postRequest, function (xml_res) {
                            let buffer = "";
                            xml_res.on("data", function (data) {
                                buffer = buffer + data;
                            });
                            xml_res.on("end", function (data) {
                                xml2js.parseString(buffer, {tagNameProcessors: [stripPrefix]}, function (objXml2Json_err, objXml2Json) {
                                    let objFullResponse = {
                                        'err': objXml2Json_err,
                                        'Response': objXml2Json
                                    };
                                    console.error('Upload Document In Save Temp Folder', {"Status": "Success", "Msg": "Document Save Successfully", "Doc_Name": objRequest['file_name'], "Response": objFullResponse, "Ss_Id": ss_id});
                                    res.json({"Status": "SUCCESS", "Msg": "Document Save Successfully", "Doc_Name": objRequest['file_name'], "Response": objFullResponse, "Ss_Id": ss_id});
                                });
                            });
                        });
                        xml_req.on('error', function (e) {
                            console.error('problem with request: ' + e.message);
                            res.json({"Status": "FAIL", "Msg": "Document Save failed", "Response": e.message, "Ss_Id": ss_id});
                        });
                        xml_req.write(body);
                        xml_req.end();
                    } else {
                        res.json({"Status": "FAIL", "Msg": "Document Save Fail", "Ss_Id": ss_id});
                    }
//                    } else {
//                        res.json({"Status": "FAIL", "Msg": "Document file size is less than 10 KB", "Ss_Id": ss_id});
//                    }
                } else {
                    res.json({"Status": "FAIL", "Msg": "No documents found.", "Ss_Id": ss_id});
                }
            } else {
                res.json({"Status": "FAIL", "Msg": "User directory not found.", "Ss_Id": ss_id});
            }
        } catch (ex) {
            console.error('Exception', 'save_doc_temp_folder', ex);
            res.json({"Status": "FAIL", "Msg": "Exception in save_doc_temp_folder", "Error": ex.stack});
        }
    });
    app.post("/onboarding/save_doc_temp_folder", function (req, res) { // roshani save single document to UploadToTempFolder
        try {
            let replaceObj = {};
            let document_prefix = {"Profile": "Photograph", "QualificationCertificate": "10th Certificate", "PanCard": "Pancard", "AadharCard": "Aadhar Card", "Posp_Bank_Account_": "Copy of Cancelled Cheque for Self", "Certificate": "PostTraining_Pass","AadharCardBack":"AadharCardBack"};
            let objRequest = req.body;
//            let doc_type = {
//                "Photograph": 1,
//                "10th Certificate": 2,
//                "12th Certificate (optional)": 3,
//                "Graduate Certificate (optional)": 4,
//                "Permanent Address Proof": 5,
//                "Present Address Proof": 6,
//                "Pancard": 7,
//                "Aadhar Card": 8,
//                "Copy of Cancelled Cheque for Self": 9,
//                "Copy of Cancelled Cheque for Nominee": 10,
//                "Application form with signature (Optional)": 11,
//                "Certificate-pdf": 12,
//                "PostTraining_Pass": 12,
//                "GST Registration Certificate": 13
//            };
            let doc_type = {
                "Profile": 1,
                "QualificationCertificate": objRequest.education,
                "PanCard": 7,
                "AadharCard": 8,
                "Posp_Bank_Account": 9,
                "Certificate": 12,
				"AadharCardBack": 5
            };
            let ss_id = objRequest.ss_id;
            let path = appRoot + "/tmp/onboarding_docs/" + ss_id;
            if (fs.existsSync(path)) {
                let arr_read_files = fs.readdirSync(path);
                if (arr_read_files.length > 0) {
                    let full_file_name = "";
                    let file_path = "";
                    for (let k in arr_read_files) {
                        if (objRequest.file_name === arr_read_files[k]) {
                            full_file_name = arr_read_files[k];
                            file_path = path + '/' + arr_read_files[k];
                        }
                    }
                    let file_name = (full_file_name).split(".")[0];
                    file_name = file_name.replace("_" + ss_id, "").trim();
                    let file_ext = (full_file_name).split(".")[1];
                    let stats = fs.statSync(file_path);
                    let fileSizeInBytes = stats.size;
                    let fileSizeInKb = (fileSizeInBytes / 1024).toFixed(2);
                    //if (fileSizeInKb > 10) {
                    let bitmap = fs.readFileSync(file_path);
                    if (bitmap !== "") {
                        let file_binary_data = new Buffer(bitmap).toString('base64');
                        let xml_erp_dsa_details = fs.readFileSync(appRoot + '/resource/request_file/erp_document_upload.xml').toString();
                        let replace_xml_erp_code_req = "";
                        let replaceObj = {
                            '___file_bytes___': file_binary_data,
                            '___file_name___': file_name,
                            '___file_extension___': file_ext,
                            '___file_doc_type___': doc_type[file_name] ? doc_type[file_name] : "",
                            '___erp_code___': objRequest.erp_code
                        };
                        replace_xml_erp_code_req = xml_erp_dsa_details.replaceJson(replaceObj);
                        let stringify_xml = '`' + replace_xml_erp_code_req + '`';
                        stringify_xml.replace(/___(.*?)___/g, "NA");
                        let body = replace_xml_erp_code_req;
                        console.error('ERP Document Save Request', body);
                        let xml2js = require('xml2js');
                        let http = require('http');
                        let contentType = 'text/xml; charset=utf-8';
                        let stripPrefix = require('xml2js').processors.stripPrefix;
                        let postRequest = {
                            host: "202.131.96.100",
                            path: "/Service1.svc",
                            port: '8025',
                            method: "POST",
                            rejectUnauthorized: false,
                            headers: {
                                'Cookie': "cookie",
                                'Content-Type': contentType,
                                'Content-Length': Buffer.byteLength(body),
                                "SOAPAction": "http://tempuri.org/IService1/UploadToTempFolder",
                                "Cache-Control": 'private, no-cache, no-store, must-revalidate, max-age=0',
                                "Pragma": "no-cache"
                            }
                        };
                        let xml_req = http.request(postRequest, function (xml_res) {
                            let buffer = "";
                            xml_res.on("data", function (data) {
                                buffer = buffer + data;
                            });
                            xml_res.on("end", function (data) {
                                xml2js.parseString(buffer, {tagNameProcessors: [stripPrefix]}, function (objXml2Json_err, objXml2Json) {
                                    let objFullResponse = {
                                        'err': objXml2Json_err,
                                        'Response': objXml2Json
                                    };
                                    console.error('Upload Document In Save Temp Folder', {"Status": "Success", "Msg": "Document Save Successfully", "Doc_Name": objRequest['file_name'], "Response": objFullResponse, "Ss_Id": ss_id});
                                    res.json({"Status": "SUCCESS", "Msg": "Document Save Successfully", "Doc_Name": objRequest['file_name'], "Response": objFullResponse, "Ss_Id": ss_id});
                                });
                            });
                        });
                        xml_req.on('error', function (e) {
                            console.error('problem with request: ' + e.message);
                            res.json({"Status": "FAIL", "Msg": "Document Save failed", "Response": e.message, "Ss_Id": ss_id});
                        });
                        xml_req.write(body);
                        xml_req.end();
                    } else {
                        res.json({"Status": "FAIL", "Msg": "Document Save Fail", "Ss_Id": ss_id});
                    }
//                    } else {
//                        res.json({"Status": "FAIL", "Msg": "Document file size is less than 10 KB", "Ss_Id": ss_id});
//                    }
                } else {
                    res.json({"Status": "FAIL", "Msg": "No documents found.", "Ss_Id": ss_id});
                }
            } else {
                res.json({"Status": "FAIL", "Msg": "User directory not found.", "Ss_Id": ss_id});
            }
        } catch (ex) {
            console.error('Exception', 'save_doc_temp_folder', ex);
            res.json({"Status": "FAIL", "Msg": "Exception in save_doc_temp_folder", "Error": ex.stack});
        }
    });
    app.get("/onboarding/erp_code_doc_save", function (req, res) { // Generate ERP Code & Save document to temp folder also in service
        let ss_id = req.query.ss_id ? req.query.ss_id - 0 : "";
        let Client = require('node-rest-client').Client;
        let client = new Client();
        let erp_code = "";
        //client.get(config.environment.weburl + "/onboarding/save_document?ss_id=" + ss_id, {}, function (save_doc_data, save_doc_response) {
        //if (save_doc_data && save_doc_data.Status === "SUCCESS") {
        client.get(config.environment.weburl + "/onboarding/erp_code_generate?ss_id=" + ss_id, {}, function (erp_code_data, erp_code_response) {
            if (erp_code_data && erp_code_data.Status === "SUCCESS") {
                erp_code = erp_code_data.ERP_Code ? erp_code_data.ERP_Code : "";
                if (erp_code && !isNaN(erp_code)) {
                    client.get(config.environment.weburl + "/onboarding/upload_document?ss_id=" + ss_id + "&erp_code=" + erp_code, {}, function (upload_doc_data, upload_doc_response) {
                        res.json(upload_doc_data);
                    });
                } else {
                    res.json(erp_code_data);
                }
            } else {
                res.json(erp_code_data);
            }
        });
        /*} else {
         res.json(save_doc_data);
         }*/
        //});
    });
    app.get('/onboarding/generate_posp_erp_codes', function (req, res) { //generate ERP CODE 
        try {
            let from_start = moment().add(-5, 'days').utcOffset("+05:30").startOf('Day').toDate();
            let today_end = moment().utcOffset("+05:30").endOf('Day').toDate();
            let qry = {Exam_End_Date: {"$gte": from_start, "$lte": today_end}, "Exam_Status": "Completed", 'POSP_UploadingDateAtIIB': {$nin: [null, ""]}, "Erp_Id": ""};
            posp_user.find(qry, function (err, posp_user_res) {
                if (err) {
                    res.json({"Status": "FAIL", "Msg": err});
                } else {
                    if (posp_user_res.length > 0) {
                        if (req.query['dbg'] == 'yes') {
                            return res.json({
                                "qry": qry,
                                "count": posp_user_res.length
                            });
                        } else {
                            let obj_erp_res = {
                                "Status": "SUCCESS",
                                "Msg": "ERP_ID generated.",
                                "Completed": 0,
                                "qry": qry,
                                "count": posp_user_res.length,
                                "Success": 0,
                                "Fail": 0,
                                "Success_List": [],
                                "Fail_List": [],
                                "List": []
                            };
                            for (let x = 0; x < posp_user_res.length; x++) {
                                let current_posp = posp_user_res[x]._doc;
                                let ss_id = current_posp.Ss_Id;
                                obj_erp_res["List"].push(config.environment.weburl + "/onboarding/erp_code_generate?ss_id=" + ss_id);
                                client.get(config.environment.weburl + "/onboarding/erp_code_generate?ss_id=" + ss_id, {}, function (posp_dsa_response, response) {
                                    obj_erp_res["Completed"]++;
                                    if (obj_erp_res["Completed"] === posp_user_res.length) {

                                    }
                                    console.error("ERP_Code generation service called for Ss_Id: " + ss_id);
                                });
                                sleep(2000);
                            }
                            return res.json(obj_erp_res);
                        }
                    } else {
                        return res.json({
                            "Status": "SUCCESS",
                            "Msg": "No record found without ERP_ID.",
                            "qry": qry,
                            "count": posp_user_res.length
                        });
                    }
                }
            });
        } catch (ex) {
            res.json({"Status": "FAIL", "Msg": "Exception in generate_posp_erp_code", "Error": ex.stack});
        }
    });
    app.get('/onboarding/posp_exam_due_mail', function (req, res) {
        try {
            let ss_id = req.query.ss_id ? req.query.ss_id : "";
            if (ss_id) {
                client.get(config.environment.weburl + '/posps/dsas/view/' + ss_id, {}, function (posp_res, posp_res_data) {
                    try {
                        if (posp_res && posp_res.status && posp_res.status === "SUCCESS" && ["POSP", "FOS"].indexOf(posp_res.user_type) > -1 && posp_res["POSP_USER"]) {
                            let posp_user_data = posp_res["POSP_USER"];
                            let rm_details = posp_res["RM"] || {};
                            let rm_email = rm_details["rm_details"] ? (rm_details["rm_details"]["email"] || "") : "";
                            let rm_plus_1_email = rm_details["rm_reporting_details"] ? (rm_details["rm_reporting_details"]["email"] || "") : "";
                            let Posp_Name = posp_user_data.Name_On_PAN || "";
                            let Posp_Email = posp_user_data.Email_Id || "";
                            let Exam_Status = posp_user_data.Exam_Status;
                            let uploadedDateAt_IIB = posp_user_data.POSP_UploadingDateAtIIB || "";
                            let Training_Status = posp_user_data.Training_Status;
                            let IIB_On = moment(posp_user_data.POSP_UploadingDateAtIIB, "DD-MM-YYYY").utcOffset("+00:00");
                            let Training_Start_Date = moment(posp_user_data.Training_Start_Date).utcOffset("+00:00");
                            let Training_End_Date = moment(posp_user_data.Training_End_Date).utcOffset("+00:00"); // "2023-09-21T10:51:49.000Z"
                            // "22-09-2023"
                            let Is_IIB_Uploaded = posp_user_data.Is_IIB_Uploaded;
                            let Exam_Delayed = moment().utcOffset("+05:30").diff(Training_End_Date.format("YYYY-MM-DD"), 'days') - 0;
                            if ((IIB_On.format("YYYYMMDD") - 0) > (Training_End_Date.format("YYYYMMDD") - 0)) {
                                Exam_Delayed = moment().utcOffset("+05:30").diff(IIB_On.format("YYYY-MM-DD"), 'days') - 0;
                            }
                            let Exam_Due = (Exam_Delayed > 0) ? ((Exam_Delayed == 1) ? "Exam Due Yesterday" : "Exam Due " + Exam_Delayed + " Days") : "Exam Due Today";
                            let obj_summary = {
                                "Training_Start_Date": Training_Start_Date.format("YYYY-MM-DD"),
                                "Training_End_Date": Training_End_Date.format("YYYY-MM-DD"),
                                "IIB_On": IIB_On.format("YYYY-MM-DD"),
                                "Exam_Delayed": Exam_Delayed
                            }
                            if (Exam_Delayed >= 0 && Training_Status === "Completed" && Exam_Status !== "Completed" && (Is_IIB_Uploaded == "Yes" || uploadedDateAt_IIB)) {
                                try {
                                    client.get(config.environment.weburl + '/posps/report/email_consolidate_process?ss_id=' + ss_id + '&event_type=EXAM_LINK', {}, function (exam_mail_data, exam_mail_res) {
                                        console.error('SEND_EXAM_MAIL', 'Ss_Id: ' + ss_id);
                                    });
                                } catch (ex) {
                                    console.error('EXCEPTION_IN_SEND_EXAM_MAIL', 'Ss_Id: ' + ss_id, ex.stack);
                                }
                                res.json({"Status": "Success", "Msg": "Exam mail sent.", "Ss_Id": ss_id, "obj_summary": obj_summary});
                            } else {
                                console.error("EXAM_DUE_MAIL_NOT_SENT : ", ss_id);
                                res.json({"Status": "Success", "Msg": "Exam_Not_Due", "Ss_Id": ss_id, "obj_summary": obj_summary});
                            }
                        } else {
                            res.json({"Status": "Fail", "Msg": "Ss_Id not found", "Ss_Id": ss_id});
                        }
                    } catch (ex) {
                        res.json({"Status": "Fail", "Msg": ex.stack});
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Ss_Id not found", "Ss_Id": ss_id});
            }
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get("/onboarding/update_erp_details", function (req, res) {
        try {
            let args = {'Exam_Status': 'Completed', 'Erp_Id': ""};
            if (req.query.ss_id) {
                args = {
                    "User_Id": req.query.ss_id - 0
                };
            }
            posp_user.find(args, function (posp_user_err, posp_user_res) {
                if (posp_user_err) {
                    res.json({'Status': "Fail", "Msg": posp_user_err});
                } else {
                    if (posp_user_res.length > 0) {
                        for (let i = 0; i < posp_user_res.length; i++) {
                            let posp_user_obj = posp_user_res[i]._doc;
                            let ss_id = posp_user_obj.User_Id;
                            client.get('http://horizon.policyboss.com:5000/posps/dsas/view/' + ss_id, {}, function (posp_dsa_response, response) {
                                if (posp_dsa_response && posp_dsa_response.status && posp_dsa_response.status === "SUCCESS") {
                                    let erp_code = posp_dsa_response.POSP.Erp_Id;
                                    let erp_created_on = posp_dsa_response.POSP.ERPID_CreatedDate;
                                    if (erp_code) {
                                        let posp_args = {
                                            'Erp_Id': erp_code,
                                            'Erp_Msg': "ERP CODE GENENERATED SUCCESSFULLY :: " + erp_code,
                                            'Erp_Status': "SUCCESS",
                                            'ERPID_CreatedDate': erp_created_on
                                        };
                                        posp_user.update({'User_Id': ss_id}, {$set: posp_args}, function (update_posp_err, update_posp_res) {
                                            if (update_posp_err) {
                                                res.json({'Status': "Fail", "Msg": update_posp_err});
                                            } else {
                                                console.error("POSP_ONBOARDING_RECORD_UPDATED_SUCCESSFULLY : ", ss_id);
                                            }
                                        });
                                    }
                                } else {
                                    console.error("POSP_ONBOARDING_RECORD_NOT_FOUND_IN_DSAS : ", ss_id);
                                }
                            });

                            if (i === (posp_user_res.length - 1)) {
                                res.json({'Status': "Success", "Msg": "ERP details updated successfully."});
                            }
                        }
                    } else {
                        res.json({'Status': "Success", "Msg": "No record found to update"});
                    }
                }
            });
        } catch (ex) {
            res.json({'Status': "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/get_posp_payment_details', function (req, res) {
        try {
            var razorpay_payment = require('../models/razorpay_payment');
            let db_fields = ["Ss_Id", "Fba_ID", "PayId", "Email", "Invoice_No", "Transaction_Id", "Mobile", "Transaction_Status"];
            let razorpay_args = {"Source": "POSP_ONBOARD"};
            db_fields.forEach((field) => {
                req.query[field] ? razorpay_args[field] = req.query[field] : "";
            });
            razorpay_payment.find(razorpay_args, function (razorpay_payment_err, razorpay_payment_res) {
                if (razorpay_payment_err) {
                    res.json({"Status": "Fail", "Msg": razorpay_payment_err});
                } else {
                    if (razorpay_payment_res.length > 0) {
                        res.json({"Status": "Success", "Data": razorpay_payment_res});
                    } else {
                        res.json({"Status": "Success", "Data": "Record Not Found."});
                    }
                }
            });
        } catch (ex) {
            console.error('Exception', 'get_posp_payment_details', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get("/onboarding/posp/iib_upload/:ss_id/:session_id", validateSession_NIU, function (req, res) {
        try {
            let ss_id = req.params.ss_id ? req.params.ss_id - 0 : "";
            let posp_email = req.params.email ? req.params.email : "";
            let session_id = req.params.session_id ? req.params.session_id : "";
            let objRequest = req.query;
            objRequest = JSON.parse(JSON.stringify(objRequest));
            if (ss_id && session_id) {
                let updateObj = {
                    "Is_IIB_Uploaded": objRequest.uploaded_or_rejected,
                    "POSP_UploadedtoIIB": objRequest.uploaded_or_rejected,
                    "POSP_UploadingDateAtIIB": moment(objRequest.iib_upload_date, "YYYY-MM-DD").format("DD-MM-YYYY"),
                    "IIB_Modified_On" : new Date(),
                    "IIB_IP_Address" : req.pbIp
                };
                posp_user.findOneAndUpdate({$or: [{Ss_Id: ss_id}, {User_Id: ss_id}]}, {$set: updateObj}, {new : true}, function (posp_user_err, posp_user_res) {
                    if (posp_user_err) {
                        res.json({'Status': "Fail", "Msg": posp_user_err});
                    } else {
                        if (posp_user_res._doc) {

                            // start added by roshani 05-09-2023
                            try {
                                let posp_user_db_data = posp_user_res._doc;
                                let iib_upload_update_obj = {};
                                let iib_upload_update_array = ["First_Name", "Middle_Name", "Last_Name", "Father_Name", "Agent_City", "Education", "Birthdate", "Permanant_Add1",
                                    "Permanant_Add2", "Permanant_Add3", "Permanant_Landmark", "Permanant_Pincode", "Permanant_City", "Permanant_State", "Present_Add1", "Present_Add2", "Present_Add3",
                                    "Present_Landmark", "Present_Pincode", "Present_City", "Present_State", "Pan_No", "Aadhar", "Experience", "Income", "Already_Posp", "Legal_case", "Bank_Account_No",
                                    "Account_Type", "Ifsc_Code", "Micr_Code", "Bank_Name", "Bank_Branch", "Status_Remark", "Nominee_Aadhar", "Nominee_Account_Type", "Nominee_Bank_Account_Number", "Nominee_Bank_Branch",
                                    "Nominee_Bank_City", "Nominee_Bank_Name", "Nominee_First_Name", "Nominee_Middle_Name", "Nominee_Ifsc_Code", "Nominee_Last_Name",
                                    "Nominee_Micr_Code", "Nominee_Name_as_in_Bank", "Gender", "Name_as_in_Bank", "Nominee_Gender", "Nominee_Relationship", "Nominee_Pan", "Posp_Category", "POSP_UploadedtoIIB",
                                    "POSP_UploadingDateAtIIB", "IIB_On", "Is_IIB"];
                                for (let i in iib_upload_update_array) {
                                    try {
                                        if (posp_user_db_data[iib_upload_update_array[i]] && ["NA"].indexOf(posp_user_db_data[iib_upload_update_array[i]]) === -1) {
                                            iib_upload_update_obj[iib_upload_update_array[i]] = posp_user_db_data[iib_upload_update_array[i]];
                                        } 
										if (iib_upload_update_array[i] === "IIB_On" && posp_user_db_data.POSP_UploadingDateAtIIB && ["NA"].indexOf(posp_user_db_data.POSP_UploadingDateAtIIB) === -1) {
                                            iib_upload_update_obj['IIB_On'] = moment(posp_user_db_data.POSP_UploadingDateAtIIB, 'DD-MM-YYYY').format("YYYY-MM-DDTHH:mm:ss[Z]");
                                            iib_upload_update_obj['Is_IIB'] = 1;
                                        }
                                    } catch (e) {
                                        console.error('iib_upload_update_array', e.stack);
                                    }
                                }
                                console.error('iib_upload_update_obj', iib_upload_update_obj);
                                let iib_upload_update_args = {
                                    data: iib_upload_update_obj,
                                    headers: {
                                        "Content-Type": "application/json"

                                    }
                                };
                                client.post(config.environment.weburl + "/onboarding/posp_data_update?ss_id=" + ss_id, iib_upload_update_args, function (iib_upload_update_data, iib_upload_update_response) {});

                            } catch (e) {
                                console.error('IIB Uploaded POSP Collection', e.stack);
                            }
                            // end added by roshani 05-09-2023
                            try {
                                client.get(config.environment.weburl + "/posps/mssql/sync_iib?ss_id=" + ss_id, {}, function (iib_sync_data, iib_sync_response) {});
                            } catch (e) {
                                console.error('IIB Uploaded SQL POSP Collection', e.stack);
                            }


                            let send_to = posp_user_res._doc["Email_Id"] ? posp_user_res._doc["Email_Id"] : "";
                            send_to = posp_email ? posp_email : send_to;
//                            let objModelEmail = new Email();
//                            let mail_content = '<html><body><p>Dear POSP,</p>'
//                                    + '<p>Your details has been successfully uploaded to IIB.</p>'
//                                    + '</body></html>';
//                            objModelEmail.send('pospcom@policyboss.com', send_to, "[POSP-ONBOARDING] IIB_UPLOADED::SSID-" + ss_id, mail_content, '', config.environment.notification_email, '');
                            client.get(config.environment.weburl + "/onboarding/generateAppointmentLetter/" + ss_id, {}, function (generateAppointment_data, generateAppointment_response) {
                                if (generateAppointment_data.Status === "Success") {
                                    res.json({'Status': "Success", "Msg": "POSP Uploaded to IIB Succesfully."});
                                } else {
                                    res.json({'Status': "Success", "Msg": "POSP Uploaded but mail not sent."});
                                }
                            });

                        } else {
                            res.json({'Status': "Success", "Msg": "Updated Successfully."});
                        }
                    }
                });
                //res.json({'Status': "Success", "Msg": "Ss_Id or Session_Id found.", "Ss_Id": ss_id, "Session_Id": session_id});
            } else {
                res.json({'Status': "Fail", "Msg": "Ss_Id or Session_Id not found."});
            }
        } catch (ex) {
            res.json({'Status': "Fail", "Msg": ex.stack});
        }
    });
    app.get("/onboarding/posp/iib_upload_new", function (req, res) {
		let ss_id = req.query.ss_id ? req.query.ss_id - 0 : 0;
		let posp_pan = req.query.pan || "";
		let Obj_Summary = {
			"PAN" : posp_pan,
			"Ss_Id" : ss_id,
			"Status" : "PENDING",
			"Iib_Status" : "PENDING",
			"Appointment_Letter_Status" : "PENDING",
			"Training_Status" : "PENDING",
			"Exam_Link_Status" : "PENDING",
			"Msg" : null,
		};
		if (ss_id > 0 && posp_pan !== "") {
			posp_user.findOne({"User_Id": ss_id}).exec(function(err,Db_Posp_User){
				try{	
					if(Db_Posp_User){
						Db_Posp_User = Db_Posp_User._doc;
						if(Db_Posp_User["POSP_UploadedtoIIB"] === "Yes"){
							Obj_Summary["Status"] = "VALIDATION";
							Obj_Summary["Iib_Status"] = "ALREADY_IIB_TAG";
							return res.json(Obj_Summary);									
						}
						else{
							client.get(config.environment.weburl + "/posps/iib_container/pan_details?used_at=IIB&pan=" + posp_pan + "&ss_id=" + ss_id, {}, function (pan_iib_status_data, pan_iib_status_response) {
								if (pan_iib_status_data && pan_iib_status_data.status === "SUCCESS") {
									Obj_Summary["Training_Status"] = Db_Posp_User["Training_Status"];
									let pan_iib_details = pan_iib_status_data.iib_detail;
									let posp_iib_date = moment(pan_iib_details["AppointmentDate_Format"], "YYYY-MM-DD").format("DD-MM-YYYY");
									let updateObj = {
										"Is_IIB_Uploaded": "Yes",
										"POSP_UploadedtoIIB": "Yes",
										"POSP_UploadingDateAtIIB": posp_iib_date,
										"IIB_Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]"),
										"IIB_IP_Address": req.pbIp || "0.0.0.0"
									};
									posp_user.updateOne({"User_Id": ss_id}, {$set: updateObj},function (posp_user_err, posp_user_res) {
										if (posp_user_err) {
											Obj_Summary["Iib_Status"] = "DB_ERR";
											Obj_Summary["Iib_Status_Msg"] = posp_user_err;
											return res.json(Obj_Summary);
										} 
										else{
											if (posp_user_res && posp_user_res.nModified > 0) {
												Obj_Summary["Iib_Status"] = "SUCCESS";												
											   client.get(config.environment.weburl + "/posps/mssql/sync_iib?ss_id=" + ss_id, {}, function (iib_sync_data, iib_sync_response) {});								   
											   client.get(config.environment.weburl + "/onboarding/generateAppointmentLetter/" + ss_id, {}, function (generateAppointment_data, generateAppointment_response) {
												   if (generateAppointment_data.Status === "Success"){
														Obj_Summary["Appointment_Letter_Status"] = "SUCCESS";
														if(Db_Posp_User["Training_Status"] === "Completed") {
															Obj_Summary["Exam_Link_Status"] = "SUCCESS";
															client.get(config.environment.weburl + '/posps/report/email_consolidate_process?ss_id=' + ss_id + '&event_type=EXAM_LINK', {}, function (exam_mail_data, exam_mail_res) {});
														}
														else{
															Obj_Summary["Exam_Link_Status"] = "TRAINING_NOT_COMPLETE";
														}
													} else {
														Obj_Summary["Appointment_Letter_Status"] = "FAIL";
													}
													return res.json(Obj_Summary);
												});
											} else {
												Obj_Summary["Iib_Status"] = "FAIL";
												Obj_Summary["Msg"] = updateObj;
												return res.json(Obj_Summary);
											}
										}
									});
								}
								else {
									Obj_Summary["Status"] = "VALIDATION";
									Obj_Summary["Iib_Status"] = "PAN_IIB_NA";
									return res.json(Obj_Summary);                        
								}
							});	
						}
					}
					else{
						Obj_Summary["Status"] = "VALIDATION";
						Obj_Summary["Msg"] = "INVALID_SSID";
						return res.json(Obj_Summary);
					}
				}
				catch(e){
					Obj_Summary["Status"] = "EXCEPTION";
					Obj_Summary["Msg"] = e.stack;
					return res.json(Obj_Summary);
				}	
			});	
		} else {
			Obj_Summary["Status"] = "VALIDATION";
			Obj_Summary["MSg"] = "SS_ID_OR_PAN_INVALID";
			return res.json(Obj_Summary);									                
		}
    });
//    app.get("/onboarding/posp/deactivation/:ss_id", function (req, res) {
//        try {
//            let ss_id = req.params.ss_id ? req.params.ss_id - 0 : "";
//            let rm_email = "";
//            let posp_email = "";
//            let posp_pan = "";
//            if (ss_id && ss_id !== "") {
//                let objRequest = req.query;
//                objRequest = JSON.parse(JSON.stringify(objRequest));
//                let updateObj = {};
//                let action = objRequest.hasOwnProperty('action') ? objRequest.action : "";
//                if (action !== "" && ['activate', 'deactivate'].includes(action)) {
//                    if (action === 'deactivate') {
//                        updateObj['POSP_DeActivatedtoIIB'] = objRequest.deactivate;
//                        updateObj['POSP_DeActivatedBy'] = objRequest.ssid_by - 0;
//                        updateObj['POSP_DeActivatedDateAtIIB'] = moment(objRequest.deactivate_date).format("YYYY-MM-DDTHH:mm:ss[Z]");
//                        updateObj['POSP_DeActivatedReason'] = objRequest.deactivate_reason;
//                        updateObj['Is_Active'] = false;
//                    }
//                    if (action === 'activate') {
//                        updateObj['POSP_Activated'] = objRequest.activate;
//                        updateObj['POSP_ActivatedBy'] = objRequest.ssid_by;
//                        updateObj['POSP_ActivatedDate'] = moment(objRequest.activate_date).format("YYYY-MM-DDTHH:mm:ss[Z]");
//                        updateObj['POSP_ActivatedReason'] = objRequest.activate_reason;
//                        updateObj['Is_Active'] = true;
//                    }
////                    client.get(config.environment.weburl + '/posps/dsas/view/' + ss_id, {}, function (data, response) {
//                    posp_user.find({$or: [{Ss_Id: ss_id}, {User_Id: ss_id}]}, function (dbposperr, dbpospuser) {
//                        try {
//                            if (dbposperr) {
//                                res.json({"Status": "Fail", "Msg": dbposperr});
//                            } else {
//
////                            if (data && data.status && data.status === "SUCCESS") {
//                                if (dbpospuser && dbpospuser.length > 0) {
//                                    let data = dbpospuser[0]._doc;
//                                    rm_email = data.Reporting_Email_ID && data.Reporting_Email_ID !== "" ? data.Reporting_Email_ID : "";
//                                    posp_email = data && data.Email_Id && data.Email_Id !== "" ? data.Email_Id : "";
//                                    posp_pan = data && data.Pan_No && data.Pan_No !== "" ? data.Pan_No : "";
//                                    posp_user.update({$or: [{Ss_Id: ss_id}, {User_Id: ss_id}]}, {$set: updateObj}, function (dberr, numAffected) {
//                                        try {
//                                            if (dberr) {
//                                                res.json({'Status': "Fail", "Msg": dberr});
//                                            } else {
//                                                client.get(config.environment.weburl + "/posps/mssql/sync_noc?ss_id=" + ss_id, {}, function (noc_sync_data, noc_sync_response) {});
//                                                let objModelEmail = new Email();
//                                                let sendTo_arr = [posp_email];
//                                                //let sendTo_arr = ["nilam.bhagde@policyboss.com"];
//                                                //let cc_arr = [rm_email];
//                                                //let bcc_arr = []
//                                                //let cc_arr = ["roshani.prajapati@policyboss.com"];
//                                                let subject = "";
//                                                let mail_content = "";
//                                                let bcc_arr = [rm_email, "ashish.hatia@policyboss.com", "sandeep.nair@landmarkinsurance.in", "ronald.mathais@policyboss.com", "suresh.k@landmarkinsurance.in", "rohit.rajput@policyboss.com", "p.janardhan@policyboss.com", "customercare@policyboss.com","billprocess@policyboss.com", "onlinepolicy@policyboss.com", config.environment.notification_email];
//                                                //objModelEmail.send(from, to, sub, content, cc, bcc, crn, attachment);
//                                                if (action === 'deactivate' && numAffected && numAffected.nModified === 1) {
//                                                    subject = `Your PAN De-Activated & NoC - SSID : ${ss_id}`;
//                                                    mail_content = getDeActivationMailContentNew(posp_pan, objRequest.deactivate_date);
//                                                    objModelEmail.send('pospcom@policyboss.com', sendTo_arr.join(';'), subject, mail_content, '', bcc_arr.join(';'), '');
//                                                    res.json({"Status": "Success", "Msg": "Posp Deactivated Successfully"});
//                                                } else if (action === 'activate' && numAffected && numAffected.nModified === 1) {
//                                                    res.json({"Status": "Success", "Msg": "Posp Activated Successfully"});
//                                                } else {
//                                                    res.json({"Status": "Success", "Msg": "Posp " + (action === 'deactivate' ? 'Deactivated' : 'Activated') + " Successfully."});
//                                                }
//                                            }
//                                        } catch (ex) {
//                                            res.json({'Status': "Fail", "Msg": ex.stack});
//                                        }
//                                    });
//                                } else {
//                                    res.json({"Status": "Fail", "Msg": "No Posp Found Against Ss_Id - " + ss_id + "."});
//                                }
//                            }
//                        } catch (ex) {
//                            res.json({'Status': "Fail", "Msg": ex.stack});
//                        }
//                    });
//                } else {
//                    res.json({'Status': "Fail", "Msg": "Sent an invalid action.", "Ss_Id": ss_id});
//                }
//
//            } else {
//                res.json({'Status': "Fail", "Msg": "Ss_Id not found."});
//            }
//        } catch (ex) {
//            res.json({'Status': "Fail", "Msg": ex.stack});
//        }
//    });
    app.get("/onboarding/posp/deactivation_new/:ss_id", function (req, res) {
        try {
            let ss_id = req.params.ss_id ? req.params.ss_id - 0 : "";
            let posp_email = "nilam.bhagde@policyboss.com";
            let posp_pan = "CKAPB6186L";
            if (ss_id && ss_id !== "") {
                let objModelEmail = new Email();
                let sendTo_arr = [posp_email];
                let subject = "";
                let mail_content = "";
                let bcc_arr = ["ashish.hatia@policyboss.com", "horizonlive.2020@gmail.com"];
                subject = `Your PAN De-Activated & NoC - SSID : ${ss_id}`;
                mail_content = getDeActivationMailContentNew(posp_pan, "10-06-2024");
                console.log("mail_content : ", mail_content)
                objModelEmail.send('pospcom@policyboss.com', sendTo_arr.join(';'), subject, mail_content, '', bcc_arr.join(';'), '');
                res.json({"Status": "Success", "Msg": "Posp Deactivated Successfully"});
            } else {
                res.json({'Status': "Fail", "Msg": "Ss_Id not found."});
            }
        } catch (ex) {
            res.json({'Status': "Fail", "Msg": ex.stack});
        }
    });
    app.get("/onboarding/create_document_log", function (req, res) {
        try {
            let http = require('http');
            let https = require('https');
            let Stream = require('stream').Transform;
            let ss_id = req.query.ss_id ? req.query.ss_id - 0 : "";
            //let Is_Doc_uploaded = body.Is_Doc_Uploaded ? body.Is_Doc_Uploaded : "";
            if (ss_id) {
                client.get('http://horizon.policyboss.com:5000/posps/dsas/view/' + ss_id, {}, function (posp_dsa_response, response) {
                    if (posp_dsa_response && posp_dsa_response.status && posp_dsa_response.status === "SUCCESS") {
                        posp_dsa_data = posp_dsa_response;
                        let document_obj = {"Photograph": "Profile_", "12th Certificate (optional)": "QualificationCertificate_", "10th Certificate": "QualificationCertificate_", "Pancard": "PanCard_", "Aadhar Card": "AadharCard_", "Copy of Cancelled Cheque for Self": "POSP_Cancel_Cheque_"};
                        let document_list = posp_dsa_data.POSP.Document_List;
                        let doc_length = Object.keys(document_obj).length - 1;
                        let doc_map_obj = {"Photograph": "PROFILE", "10th Certificate": "QUALIFICATION", "12th Certificate (optional)": "QUALIFICATION", "Pancard": "PAN", "Aadhar Card": "AADHAAR", "Copy of Cancelled Cheque for Self": "POSP_ACC_DOC"};
                        let doc_urls = {};
                        let documents_uploaded = [];
                        if (Object.keys(document_list).length > 0) {
                            Object.keys(document_list).find(key => {
                                if (document_list[key] !== "" && document_list[key] !== undefined && document_list[key] !== null) {
                                    doc_length--;
                                    let document_url = document_list[key];
                                    let path = appRoot + "/tmp/onboarding_docs/" + ss_id;
                                    let log_file_name = document_obj[key] + "" + ss_id + "." + document_url.split('.').pop();
                                    let log_file_path = config.environment.downloadurl + "/onboarding/download/onboarding_docs/" + ss_id + "/" + log_file_name;
                                    doc_urls[doc_map_obj[key]] = log_file_path;
                                    if (!fs.existsSync(appRoot + "/tmp/onboarding_docs/" + ss_id)) {
                                        fs.mkdirSync(appRoot + "/tmp/onboarding_docs/" + ss_id);
                                    }
                                    let httpClient = http;
                                    if (document_url.toString().indexOf("https") === 0) {
                                        httpClient = https;
                                    }
                                    httpClient.request(document_url, function (doc_response) {
                                        let doc_data = new Stream();
                                        doc_response.on('data', function (chunk) {
                                            doc_data.push(chunk);
                                        });
                                        doc_response.on('end', function () {
                                            fs.writeFileSync(path + '/' + log_file_name, doc_data.read());
                                        });
                                        fs.unlink(path + '/' + log_file_name, function (doc_err) {
                                            if (doc_err) {
                                                console.log({'Status': "FAIL", 'Msg': 'Error in deleting a file.', 'Error': doc_err});
                                            }
                                        });
                                    }).end();
                                    !documents_uploaded.includes(key) ? documents_uploaded.push(key) : "";
                                    let args = {
                                        data: {
                                            'User_Id': ss_id,
                                            'Doc_Type': doc_map_obj[key],
                                            'Doc_Url': doc_urls[doc_map_obj[key]],
                                            'Verified_By_API': "Yes",
                                            'Status': "Pending"
                                        },
                                        headers: {
                                            "Content-Type": "application/json"
                                        }
                                    };
                                    client.post(config.environment.weburl + "/onboarding/update_doc_log", args, function (req, res) {
                                    });
                                }
                            });
                            console.log("Doc_urls : " + {doc_urls});
                            console.log("documents_uploaded : " + [...documents_uploaded]);
                            let Msg = "", Is_Document_Uploaded = "No";
                            if (doc_length <= 0) {
                                Msg = "Document Save Successfully";
                            } else {
                                Msg = "Some Documents Are Pending To Upload";
                            }
                            posp_user.update({"User_Id": ss_id}, {"Is_Document_Uploaded": "Yes"}, function (posp_user_err, posp_user_res) {
                                if (posp_user_err) {
                                    res.json({"Status": "FAIL", "Msg": posp_user_err});
                                } else {
                                    res.json({"Status": "SUCCESS", "Msg": Msg, "Ss_Id": ss_id});
                                }
                            });
                        } else {
                            res.json({"Status": "FAIL", "Msg": "No Documents Found For Given Ss_Id.", "Ss_Id": ss_id});
                        }
                    } else {
                        res.json({"Status": "FAIL", "Msg": "No Record Found For Given Ss_Id.", "Ss_Id": ss_id});
                    }
                });
            } else {
                res.json({"Status": "FAIL", "Msg": "Ss_Id is missing"});
            }
        } catch (ex) {
            res.json({"Status": "FAIL", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/send_doc_upload_mail', function (req, res) {
        try {
            let queryObj = req.query;
            let ss_id = queryObj.ss_id ? (queryObj.ss_id - 0) : "";
            let cc_arr = [], bcc_arr = [config.environment.notification_email];
            if (ss_id) {
				//client.get(config.environment.weburl + '/posps/report/sync_signup_inquiry?ss_id=' + ss_id , {}, function (sync_signup_data, sync_signup_response) {});
                client.get(config.environment.weburl + '/posps/dsas/view/' + ss_id, {}, function (posp_dsa_response, response) {
                    if (posp_dsa_response && posp_dsa_response.status && posp_dsa_response.status === "SUCCESS") {
                        if (posp_dsa_response.hasOwnProperty('user_type') && ["POSP", "FOS"].includes(posp_dsa_response.user_type)) {
                            if (posp_dsa_response.hasOwnProperty('POSP') && posp_dsa_response.POSP !== "NA") {
                                let posp_data = posp_dsa_response.POSP;
                                let posp_user_data = posp_dsa_response.POSP_USER || {};
                                let fba_id = posp_data.Fba_Id;
                                let posp_name = posp_data.Middle_Name ? (posp_data.First_Name + " " + posp_data.Middle_Name + " " + posp_data.Last_Name)
                                        : (posp_data.First_Name + " " + (posp_data.Last_Name ? posp_data.Last_Name : ""));
                                let rm_name = posp_data.Reporting_Agent_Name ? posp_data.Reporting_Agent_Name : "";
                                let rm_uid = posp_data.Reporting_Agent_Uid ? posp_data.Reporting_Agent_Uid : "";
                                let uid = rm_uid ? "( UID : " + rm_uid + " )" : "";
                                let rm_email = posp_data.Reporting_Email_ID && posp_data.Reporting_Email_ID !== "NA" ? posp_data.Reporting_Email_ID : "";
                                let rm_city = posp_data.Agent_City ? posp_data.Agent_City : "";
                                let signup_date1 = moment(posp_data.Created_On).format('YYYY-MM-DD');
                                let signup_date = moment(posp_data.Created_On).format('DD-MMM-YYYY');
                                let todayDate = moment().format('YYYY-MM-DD');
                                let no_of_days = moment(todayDate).diff(moment(signup_date1), 'days');
                                console.log("no_of_days : " + no_of_days);
                                rm_email ? cc_arr.push(rm_email) : "";
                                let objModelEmail = new Email();
                                let send_to = "sandeep.nair@landmarkinsurance.in,posp.ops@policyboss.com";
                                //let send_to = "nilam.bhagde@policyboss.com";
                                var email_data = '';
                                let objMail = {
                                    '___ssid___': ss_id,
                                    '___posp_name___': posp_name,
                                    '___rm_name___': rm_name + "" + uid,
                                    '___rm_city___': rm_city,
                                    '___signup_date___': signup_date,
                                    '___days___': no_of_days,
                                    "___Name_On_PAN___": (posp_user_data.Name_On_PAN) ? posp_user_data.Name_On_PAN.toUpperCase() : "NA",
                                    "___Name_On_Aadhar___": (posp_user_data.Name_On_Aadhar) ? posp_user_data.Name_On_Aadhar.toUpperCase() : "NA",
                                    "___Name_as_in_Bank___": (posp_user_data.Name_as_in_Bank) ? posp_user_data.Name_as_in_Bank : "NA"
                                };

                                email_data = fs.readFileSync(appRoot + '/resource/request_file/Posp_Doc_Upload_Mail.html').toString();
                                email_data = email_data.replaceJson(objMail);
                                objModelEmail.send('pospcom@policyboss.com', send_to, "[POSP-ONBOARDING] REQUEST TO VERIFY DOCUMENTS::SSID-" + ss_id + "::FBA_ID-" + fba_id, email_data, cc_arr.join(';'), bcc_arr.join(';'), '');
                                res.json({"Status": "SUCCESS", "Msg": "Document verification mail sent successfully!!", 'Ss_Id': ss_id});
                            } else {
                                res.json({"Status": "Fail", "Msg": "POSP details not found.", 'Ss_Id': ss_id});
                            }
                        } else {
                            res.json({"Status": "FAIL", "Msg": "User type EMP not allowed.", 'Ss_Id': ss_id});
                        }
                    } else {
                        res.json({"Status": "FAIL", "Msg": "No Record Found For Given Ss_Id.", "Ss_Id": ss_id});
                    }
                });
            } else {
                res.json({"Status": "FAIL", "Msg": "Ss_Id missing"});
            }
        } catch (ex) {
            res.json({"Status": "FAIl", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/fetch_posp_details', function (req, res) {
        try {
            let collection_name = req.body.collection_name ? req.body['collection_name'] : "posp_user.js";
            let args = req.body['posp_args'] ? req.body['posp_args'] : {};
            let projection = req.body['posp_projection'] ? req.body['posp_projection'] : {};
            let model_name = require('../models/' + collection_name);
            model_name.find(args, projection).sort({'_id': -1}).exec(function (posp_user_err, posp_user_data) {
                if (posp_user_err) {
                    res.json({"Status": "Fail", "Msg": posp_user_err});
                } else {
                    res.json({"Status": "Success", "Msg": posp_user_data});
                }
            });
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/schedule_and_send_payment_link', function (req, res) {
        try {
            let queryObj = req.query;
            let ss_id = queryObj.ss_id ? (queryObj.ss_id - 0) : "";
            if (ss_id) {
                let args = {
                    data: {
                        "Ss_Id": ss_id
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }
                };
                client.post(config.environment.weburl + "/onboarding/schedule_posp_training", args, function (schedule_posp_data, schedule_posp_response) {
                    if (schedule_posp_data.Status === "Success") {
                        client.get(config.environment.weburl + "/onboarding/initiate_payment_link?ss_id=" + ss_id + "", {}, function (payment_link_data, payment_link_response) {
                            if (payment_link_data.Status === "Success") {
                                res.json({"Status": "Success", "Msg": "Training scheduled & link sent successfully!!", "Ss_Id": ss_id});
                            } else {
                                res.json({"Status": "Fail", "Msg": "Training not scheduled", "Ss_Id": ss_id});
                            }
                        });
                    } else {
                        res.json({"Status": "Fail", "Msg": "Training not scheduled", "Ss_Id": ss_id});
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Ss_Id not found."});
            }
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/sync_posp_training_dates', function (req, res) {
        try {
            let posp_list = req.body.posp_list;
            let arr = posp_list.split(",");
            for (var x = 0; x < arr.length; x++) {
                let ss_id = arr[x] - 0;
                client.get(config.environment.weburl + "/posps/mssql/sync_training_date?ss_id=" + ss_id, {}, function (sync_training_date_data, sync_training_date_response) {
                    console.log({"Status": "Success", "Msg": "sync_training_date called.", "Data": sync_training_date_data});
                });
                if (x === (arr.length - 1))
                {
                    res.send({'Status': "Success", "Msg": 'POSP dates updated successfully.'});
                }
            }
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/fetch_posp_status', function (req, res) {
        try {
            let queryObj = req.query;
            let User_Id = queryObj.User_Id ? (queryObj.User_Id - 0) : "";
            var posp_criteria = {}, uploadCnt = 0;
            //aadhar_remove_27032024 var field_dsas_obj = {"Photograph": "Photograph", "Pancard": "PAN", "12th Certificate (optional)": "Education", "10th Certificate": "Education", "Graduate Certificate (optional)": "Education", "Aadhar Card": "Aadhar", "Copy of Cancelled Cheque for Self": "Cheque"};
            var field_dsas_obj = {"Photograph": "Photograph", "Pancard": "PAN", "12th Certificate (optional)": "Education", "10th Certificate": "Education", "Graduate Certificate (optional)": "Education","Copy of Cancelled Cheque for Self": "Cheque"};
            let client = new Client();
            if (User_Id) {
                client.get(config.environment.weburl + "/onboarding/get_posp_user_status?Ss_Id=" + User_Id, {}, function (posp_user_data, posp_user_err) {
                    console.log(posp_user_data);
                    if (posp_user_data.hasOwnProperty('Status') && posp_user_data.Status === "Success") {
                        let userData = posp_user_data["data"];
                        let exam_training_status = (userData["Training_Status"] === "Started") ? "SCHEDULED" : "COMPLETED";
                        let hours = ((userData["Completed_Hours"]).split(":")[0] - 0);
                        let exam_comleted_hours = (userData["Training_Status"] === "Started") ? hours + "Hrs / 30 Hrs" : "30 Hrs";
                        let exam_iib_uploaded = userData["POSP_UploadingDateAtIIB"] ? "UPLOADED" : "PENDING";
                        let onboarding_fees = userData.Payment_Status === "Success" ? "PAID" : "PENDING";
                        let exam_status = userData.Exam_Status === "Completed" ? "COMPLETE" : "PENDING";
                        let erp_code_status = (userData.hasOwnProperty('Erp_Id') && userData.hasOwnProperty('Erp_Status') && (!isNaN(userData['Erp_Id'])) && userData['Erp_Status'] === 'SUCCESS' ? "COMPLETE" : "PENDING"),
                                posp_criteria = {
                                    "Ss_Id": (userData.hasOwnProperty('Ss_Id') && userData['Ss_Id'] ? userData['Ss_Id'] : ""),
                                    "Fba_Id": (userData.hasOwnProperty('Fba_Id') && userData['Fba_Id'] ? userData['Fba_Id'] : ""),
                                    "Name": "",
                                    "Sign_Up_Date": (userData.hasOwnProperty('Created_On') && userData['Created_On'] ? userData['Created_On'] : ""),
                                    "Training_Scheduled_Date": (userData.hasOwnProperty('Training_Start_Date') && userData['Training_Start_Date'] ? userData['Training_Start_Date'] : ""),
                                    "Training_Start_Date": (userData.hasOwnProperty('Training_Start_Date') && userData['Training_Start_Date'] ? userData['Training_Start_Date'] : ""),
                                    "Training_End_Date": (userData.hasOwnProperty('Training_End_Date') && userData['Training_End_Date'] ? userData['Training_End_Date'] : ""),
                                    "Training": exam_training_status + "[" + exam_comleted_hours + "]",
                                    "Onboarding Fee": onboarding_fees,
                                    "Documents": "INCOMPLETE",
                                    //aadhar_remove_27032024 "Photograph": "PENDING", "PAN": "PENDING", "Aadhar": "PENDING", "Cheque": "PENDING", "Education": "PENDING",
                                    "Photograph": "PENDING", "PAN": "PENDING","Cheque": "PENDING", "Education": "PENDING",
                                    //aadhar_remove_27032024 "Pan_Upload_Date": "", "Aadhar_Upload_Date": "", "Education_Upload_Date": "", "Cheque_Upload_Date": "",
                                    "Pan_Upload_Date": "", "Education_Upload_Date": "", "Cheque_Upload_Date": "",
                                    "Document_Verification": (userData.hasOwnProperty('Is_Doc_Verified') && userData.hasOwnProperty('Is_Document_Rejected') && userData['Is_Doc_Verified'] === 'Yes' && userData['Is_Document_Rejected'] === 'No' ? "COMPLETE" : "PENDING"),
                                    "Document_Approved": (userData.hasOwnProperty('Is_Doc_Approved') && userData.hasOwnProperty('Is_Document_Rejected') && userData['Is_Doc_Approved'] === 'Yes' && userData['Is_Document_Rejected'] === 'No' ? "COMPLETE" : "PENDING"),
                                    "Document_Verification_Date": (userData.hasOwnProperty('Documents_Verified_On') && userData['Documents_Verified_On'] ? userData['Documents_Verified_On'] : ""),
                                    "Document_Approval_Date": (userData.hasOwnProperty('Documents_Approved_On') && userData['Documents_Approved_On'] ? userData['Documents_Approved_On'] : ""),
                                    "IIB": exam_iib_uploaded,
                                    "IIB_Upload_Date": (userData.hasOwnProperty('POSP_UploadingDateAtIIB') && userData['POSP_UploadingDateAtIIB'] ? userData['POSP_UploadingDateAtIIB'] : ""),
                                    "Exam Status": exam_status,
                                    "Exam_Start_Date": (userData.hasOwnProperty('Exam_Start_Date') && userData['Exam_Start_Date'] ? userData['Exam_Start_Date'] : ""),
                                    "Exam_End_Date": (userData.hasOwnProperty('Exam_End_Date') && userData['Exam_End_Date'] ? userData['Exam_End_Date'] : ""),
                                    "POS_Code_Status": erp_code_status,
                                    "POS_Created_Date": (userData.hasOwnProperty('ERPID_CreatedDate') && userData['ERPID_CreatedDate'] ? userData['ERPID_CreatedDate'] : "")
                                };
                        if (userData["First_Name"] && userData["Middle_Name"] && userData["Last_Name"]) {
                            posp_criteria['Name'] = userData["First_Name"] + " " + userData["Middle_Name"] + " " + userData["Last_Name"];
                        } else if (userData["First_Name"] && userData["Last_Name"]) {
                            posp_criteria['Name'] = userData["First_Name"] + " " + userData["Last_Name"];
                        } else if (userData["First_Name"]) {
                            posp_criteria['Name'] = userData["First_Name"];
                        }
                        client.get(config.environment.weburl + "/onboarding/get_posp_doc_log_details?User_Id=" + User_Id, {}, function (posp_doc_data, posp_doc_err) {
                            if (posp_doc_data && posp_doc_data.hasOwnProperty('Status') && posp_doc_data.Status === "Success") {
                                let posp_doc_log = posp_doc_data["data"];
                                var cnt = Object.keys(posp_doc_log).length;
                                //aadhar_remove_27032024 let field_obj = {"PROFILE": "Photograph", "PAN": "PAN", "QUALIFICATION": "Education", "AADHAAR": "Aadhar", "POSP_ACC_DOC": "Cheque"};
                                let field_obj = {"PROFILE": "Photograph", "PAN": "PAN", "QUALIFICATION": "Education", "POSP_ACC_DOC": "Cheque"};
                                for (let i = 0; i < cnt; i++) {
                                    if (Object.keys(field_obj).includes(posp_doc_log[i]["Doc_Type"])) {
                                        if(posp_doc_log[i].hasOwnProperty('Status') && ['A-Reject','V-Reject'].indexOf(posp_doc_log[i]["Status"]) > -1){
                                            posp_criteria[field_obj[posp_doc_log[i]["Doc_Type"]]] = "REJECTED";
                                        }else{
                                            posp_criteria[field_obj[posp_doc_log[i]["Doc_Type"]]] = (posp_doc_log[i].hasOwnProperty('Doc_URL') && posp_doc_log[i].Doc_URL) || (posp_doc_log[i]["Status"] === "Approved") ? "UPLOADED" : "PENDING";
                                        }
                                        posp_criteria[field_obj[posp_doc_log[i]["Doc_Type"]]] === "UPLOADED" ? uploadCnt++ : 0;
                                        posp_doc_log[i]["Doc_Type"] === "PAN" ? posp_criteria['Pan_Upload_Date'] = posp_doc_log[i]['Created_On'] : "";
                                        //aadhar_remove_27032024 posp_doc_log[i]["Doc_Type"] === "AADHAAR" ? posp_criteria['Aadhar_Upload_Date'] = posp_doc_log[i]['Created_On'] : "";
                                        posp_doc_log[i]["Doc_Type"] === "QUALIFICATION" ? posp_criteria['Education_Upload_Date'] = posp_doc_log[i]['Created_On'] : "";
                                        posp_doc_log[i]["Doc_Type"] === "POSP_ACC_DOC" ? posp_criteria['Cheque_Upload_Date'] = posp_doc_log[i]['Created_On'] : "";
                                    }
                                }
                                if (uploadCnt === 5) {
                                    posp_criteria["Documents"] = "COMPLETE";
                                }
                                res.json({"Status": "success", "Msg": posp_criteria});
                            } else {
                                client.get(config.environment.weburl + '/posps/dsas/view/' + User_Id, {}, function (posp_dsa_response, posp_dsa_err) {
                                    if (posp_dsa_response && posp_dsa_response.status && posp_dsa_response.status === "SUCCESS") {
                                        let posp_dsa_data = posp_dsa_response;
                                        let doc_pending_counter = 0;
                                        posp_criteria["onboarding_fees"] = posp_dsa_data.POSP.Is_Paid && posp_dsa_data.POSP.Is_Paid === 1 ? "PAID" : "PENDING";
                                        let document_list = posp_dsa_data.POSP.Document_List;
                                        if (Object.keys(document_list).length > 0) {
                                            Object.keys(field_dsas_obj).find(key => {
                                                document_list[key] !== "" ? posp_criteria[field_dsas_obj[key]] = "UPLOADED" : "";
                                                posp_criteria[field_dsas_obj[key]] === "UPLOADED" ? uploadCnt++ : 0;
                                            });
                                             //aadhar_remove_27032024 ["Photograph", "Education", "PAN", "Aadhar", "Cheque"]
                                            ["Photograph", "Education", "PAN", "Cheque"].forEach((item) => {
                                                posp_criteria[item] === "PENDING" ? doc_pending_counter++ : "";
                                            });
                                        }
                                        let document_status = doc_pending_counter === 0 ? "COMPLETE" : "INCOMPLETE";
                                        posp_criteria["Documents"] = document_status;
                                        res.json({"Status": "success", "Msg": posp_criteria});
                                    } else {
                                        res.json({"Status": "Fail", "Msg": 'Documents not found'});
                                    }
                                });
                            }
                        });
                    } else {
                        res.json({"Status": "Fail", "Msg": "User not found."});
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Ss_Id is missing."});
            }
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post("/onboarding/pan_verification", function (req, res) {
        try {
            let erp_pan_detail = require('../models/erp_pan_detail.js');
            var Pan_Number = (req.body.Pan_Number).toString();
            erp_pan_detail.find({"PAN_No": Pan_Number}, function (erp_pan_detail_err, erp_pan_detail_result) {
                if (erp_pan_detail_err) {
                    res.json({"Status": "Fail", "Msg": erp_pan_detail_err});
                } else {
                    if (erp_pan_detail_result.length === 0) {
                        let zoop_url = "https://live.zoop.one/api/v1/in/identity/pan/lite";
                        let data_req = {
                            "data": {
                                "customer_pan_number": Pan_Number,
                                "consent": "Y",
                                "consent_text": "I hear by declare my consent agreement for fetching my information via ZOOP API."
                            }
                        };
                        zoop_doc_args["data"] = data_req;
                        let api_log_args = {
                            'PAN_No': Pan_Number,
                            'API_Request': zoop_doc_args
                        };
                        client.post(zoop_url, zoop_doc_args, function (zoopdata, zoopresponse) {
                            if (zoopdata && zoopdata["result"]) {
                                api_log_args["Status"] = "Success";
                            } else {
                                api_log_args["Status"] = "Fail";
                            }
                            api_log_args["Name_On_PAN"] = "";
                            if (api_log_args["Status"] === "Success" && zoopdata.result && zoopdata.result.user_full_name) {
                                api_log_args["Name_On_PAN"] = zoopdata["result"]["user_full_name"];
                            }
                            api_log_args["API_Response"] = zoopdata;
                            let erp_pan_detailObj = new erp_pan_detail(api_log_args);
                            erp_pan_detailObj.save(function (err, dbres2) {
                                if (err) {
                                    res.json({"Status": "Fail", "Msg": "Error in saving API details.", "data": err});
                                } else {
                                }
                            });

                        });
                    } else {

                    }
                }
            });
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post("/onboarding/fetch_pan_details", function (req, res) {
        try {
            let client = new Client();
            let pan_list = req.body.pan_list;
            let users = pan_list.split(",");
            for (var x = 0; x < users.length; x++) {
                let args = {
                    data: {
                        'Pan_Number': users[x]
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }
                };
                client.post(config.environment.weburl + "/onboarding/pan_verification", args, function (data, response) {
                    if (data.Status === "Success") {
                    } else {
                    }
                });
                sleep(2000);
                if (x === (users.length - 1))
                {
                    res.send({'Status': "Success", "Msg": 'POSP PAN details updated successfully.'});
                }
            }
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post("/onboarding/get_bank_details_by_account_no", function (req, res) {
        try {
            let account_list = req.body.account_list;
            let arr_account_list = account_list.split(",");
            for (let x = 0; x < arr_account_list.length; x++) {
                let account_and_ifsc_code = (arr_account_list[x]).split('_');
                let args = {
                    data: {
                        'Account_Number': account_and_ifsc_code[0],
                        'IFSC_Code': account_and_ifsc_code[1]
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }
                };
                let client = new Client();
                client.post(config.environment.weburl + "/onboarding/account_verification", args, function (account_verification_data, account_verification_response) {
                    if (account_verification_data && account_verification_data.Status === "Success") {

                    } else {
                    }
                });
                sleep(2000);
                if (x === (arr_account_list.length - 1))
                {
                    res.send({'Status': "Success", "Msg": 'POSP Account No details updated successfully.'});
                }
            }
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post("/onboarding/account_verification", function (req, res) {
        try {
            let erp_bank_account_detail = require('../models/erp_bank_account_detail.js');
            let Account_Number = (req.body.Account_Number).toString();
            let Ifsc_Code = (req.body.IFSC_Code).toString();
            erp_bank_account_detail.find({"Account_Number": Account_Number, "IFSC_Code": Ifsc_Code}, function (erp_bank_account_detail_err, erp_bank_account_detail_result) {
                if (erp_bank_account_detail_err) {
                    res.json({"Status": "Fail", "Msg": erp_bank_account_detail_err});
                } else {
                    if (erp_bank_account_detail_result.length === 0) {
                        let zoop_url = "https://live.zoop.one/api/v1/in/financial/bav/lite";
                        let data_req = {
                            "data": {
                                "account_number": Account_Number,
                                "ifsc": Ifsc_Code,
                                "consent": "Y",
                                "consent_text": "I hear by declare my consent agreement for fetching my information via ZOOP API."
                            }
                        };
                        zoop_doc_args["data"] = data_req;
                        let api_log_args = {
                            'Account_Number': Account_Number,
                            'IFSC_Code': Ifsc_Code,
                            'API_Request': zoop_doc_args
                        };
                        let client = new Client();
                        client.post(zoop_url, zoop_doc_args, function (zoopdata, zoopresponse) {
                            if (zoopdata && zoopdata["result"]) {
                                api_log_args["Status"] = "Success";
                            } else if (zoopdata && zoopdata.response_message && zoopdata.response_message.includes('Combination')) {
                                api_log_args["Status"] = "Validation";
                            } else if (zoopdata && zoopdata.response_message && zoopdata.response_message.includes('Limit exhausted')) {
                                api_log_args["Status"] = "Limit_Exhausted";
                            } else if (zoopdata && zoopdata.response_message && zoopdata.response_message.includes('No Record Found')) {
                                if (zoopdata.response_message.metadata && zoopdata.response_message.metadata.reason_message.includes('Invalid Account Number')) {
                                    api_log_args["Status"] = "Invalid_Account_Number";
                                } else {
                                    api_log_args["Status"] = "No_Record_Found";
                                }
                            } else if (zoopdata && zoopdata.response_message && zoopdata.response_message.includes('Source Error')) {
                                api_log_args["Status"] = "Source_Error";
                            } else if (zoopdata && zoopdata.response_message && zoopdata.response_message.includes('Duplicate Transaction')) {
                                api_log_args["Status"] = "Duplicate_Transaction";
                            } else {
                                api_log_args["Status"] = "Fail";
                            }
                            api_log_args["Beneficiary_Name"] = "";
                            if (api_log_args["Status"] === "Success" && zoopdata && zoopdata.result && zoopdata.result.beneficiary_name) {
                                api_log_args["Beneficiary_Name"] = zoopdata.result.beneficiary_name;
                            }
                            api_log_args["API_Response"] = zoopdata;
                            let erp_bank_account_detailsObj = new erp_bank_account_detail(api_log_args);
                            erp_bank_account_detailsObj.save(function (err, dbres2) {
                                if (err) {
                                    res.json({"Status": "Fail", "Msg": "Error in saving API details.", "data": err});
                                } else {
                                }
                            });

                        });
                    } else {

                    }
                }
            });
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get("/onboarding/account_verification_fail_data", function (req, res) {
        try {
            let erp_bank_account_detail = require('../models/erp_bank_account_detail.js');
            if (req.body && req.body.account_list) {
                let account_list = req.body.account_list;
                let arr_account_list = account_list.split(",");
                for (let x = 0; x < arr_account_list.length; x++) {
                    let account_and_ifsc_code = (arr_account_list[x]).split('_');
                    let args = {
                        data: {
                            'Account_Number': account_and_ifsc_code[0],
                            'IFSC_Code': account_and_ifsc_code[1]
                        },
                        headers: {
                            "Content-Type": "application/json"
                        }
                    };
                    let client = new Client();
                    client.post(config.environment.weburl + "/onboarding/account_verification_update", args, function (account_verification_data, account_verification_response) {
                        if (account_verification_data && account_verification_data.Status === "Success") {

                        } else {
                        }
                    });
                    sleep(2000);
                    if (x === (arr_account_list.length - 1))
                    {
                        res.send({'Status': "Success", "Msg": 'POSP Account No details updated successfully.'});
                    }
                }
            } else {
                let count = 0;
                let fetch_args = {};
                if (req.query.status) {
                    fetch_args["Status"] = req.query.status;
                }
                if (req.query.count) {
                    count = req.query.count;
                }
                erp_bank_account_detail.find(fetch_args).limit(parseInt(count)).exec(function (erp_bank_account_detail_err, erp_bank_account_detail_result) {
                    if (erp_bank_account_detail_err) {
                        res.json({"Status": "Fail", "Msg": erp_bank_account_detail_err});
                    } else {
                        if (erp_bank_account_detail_result && erp_bank_account_detail_result.length > 0) {
                            for (let x = 0; x < erp_bank_account_detail_result.length; x++) {
                                let erp_bank_data = erp_bank_account_detail_result[x]._doc;
                                let Account_Number = erp_bank_data.Account_Number;
                                let IFSC_Code = erp_bank_data.IFSC_Code;
                                let args = {
                                    data: {
                                        'Account_Number': Account_Number.trim(),
                                        'IFSC_Code': IFSC_Code.trim()
                                    },
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                };
                                let client = new Client();
                                client.post(config.environment.weburl + "/onboarding/account_verification_update", args, function (account_verification_data, account_verification_response) {
                                    if (account_verification_data && account_verification_data.Status === "Success") {

                                    } else {
                                    }
                                });
                                sleep(2000);
                                if (x === (erp_bank_account_detail_result.length - 1))
                                {
                                    res.send({'Status': "Success", "Msg": 'POSP Account No details updated successfully.'});
                                }
                            }
                        } else {
                            res.send({'Status': "Success", "Msg": 'No Record Available'});
                        }
                    }
                });
            }
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get("/onboarding/mail_posp_iib_details", function (req, res) {
        try {
            var Posp = require('../models/posp');
            let posp_args = {};
            let pospListObj = {};
            let posp_mail_details = [];
            let posp_mail_send_ss_id = [];
            let date = moment().format('DD-MM-YYYY');
            let excel_file_attachment = "";
            let cnt = 0;
//            let no_of_days = req.query.days ? req.query.days - 0 : 0;
//            let cond_date = new Date((new Date().getTime() - (no_of_days * 24 * 60 * 60 * 1000)));
//            if (no_of_days > 0) {
//                posp_args = {"Created_On": {$gte: cond_date}};
//                date = moment().subtract(no_of_days, "days").format('DD-MM-YYYY');
//                ;
//            } else {
            posp_args = {
                "Is_Mail_Sent": 0,
                "Is_Active": true
            };
            //}
            posp_user.find(posp_args, function (posp_user_err, posp_user_res) {
                if (posp_user_err) {
                    res.json({"Status": "Fail", "Msg": posp_user_err});
                } else {
                    var pospListArrSsId = [];
                    var pospListArrPAN = existingPanSsId = [];
                    var pospList = {};
                    for (let i = 0; i < posp_user_res.length; i++) {
                        pospList[posp_user_res[i]._doc['Pan_No']] = posp_user_res[i]._doc['Ss_Id'];
                        pospListArrSsId.push(posp_user_res[i]._doc['Ss_Id']);
                    }
                    pospListArrPAN = Object.keys(pospList);
                    console.error('All POSP User List : ', pospList);
                    let iib_posp = require('../models/iib_posp.js');
                    iib_posp.find({"PAN": {'$in': pospListArrPAN}}, function (iib_posp_err, iib_posp_res) {
                        for (let i = 0; i < iib_posp_res.length; i++) {
                            let pospIib = iib_posp_res[i]._doc;
                            existingPanSsId.push(pospList[pospIib.PAN]);
                        }
                        console.error('PAN Available In IIB_POSP Collection : ', existingPanSsId);
                        Posp.find({"Ss_Id": {'$in': pospListArrSsId}}, function (posp_list_err, posp_list_res) {
                            try {
                                for (let i = 0; i < posp_list_res.length; i++) {
                                    let pospdata = posp_list_res[i]._doc;
                                    pospListObj[pospdata['Ss_Id']] = {};
                                    for (let key in pospdata) {
                                        pospListObj[pospdata['Ss_Id']][key] = pospdata[key];
                                    }
                                }
                                if (posp_user_res.length > 0) {
                                    posp_user_res.forEach((currentData) => {
                                        let posp_data = currentData._doc;
                                        // start added by roshani 05-09-2023
                                        if (existingPanSsId.indexOf(posp_data.User_Id) === -1) {
                                            let name_on_pan = "";
                                            let first_name = "";
                                            let middle_name = "";
                                            let last_name = "";
                                            if (posp_data.Name_On_PAN && posp_data.Name_On_PAN.trim() && posp_data.Name_On_PAN !== "NA") {
                                                name_on_pan = posp_data.Name_On_PAN.trim();
                                                let namesArr = name_on_pan ? name_on_pan.split(" ") : [];
                                                if (namesArr.length > 0) {
                                                    for (var i = 2; i < namesArr.length; i++) {
                                                        middle_name += " " + namesArr[i - 1];
                                                        middle_name = middle_name.trim();
                                                    }
                                                    first_name = name_on_pan.split(' ')[0];
                                                    last_name = namesArr.length == 1 ? "" : namesArr[namesArr.length - 1];
                                                }
                                            } else {
                                                first_name = (posp_data.First_Name && posp_data.First_Name.trim()) || "";
                                                middle_name = (posp_data.Middle_Name && posp_data.Middle_Name.trim()) || "";
                                                last_name = (posp_data.Last_Name && posp_data.Last_Name.trim()) || "";
                                            }
                                            if (last_name === middle_name || first_name === middle_name) {
                                                middle_name = "";
                                            }
                                            if (first_name === last_name) {
                                                last_name = "";
                                            }
                                            if (first_name === "" && last_name) {
                                                first_name = last_name;
                                                middle_name = "";
                                                last_name = "";
                                            }
                                            // end added by roshani 05-09-2023
                                            let posp_details = {};
                                            posp_details["PAN"] = (posp_data.hasOwnProperty('Pan_No') && posp_data["Pan_No"]) ? posp_data["Pan_No"] : (pospListObj.hasOwnProperty(posp_data['Ss_Id']) && pospListObj[posp_data['Ss_Id']].hasOwnProperty('Pan_No') && pospListObj[posp_data['Ss_Id']]['Pan_No']) ? pospListObj[posp_data['Ss_Id']]['Pan_No'] : "";
                                            //posp_details["UID"] = (posp_data.hasOwnProperty('Aadhar') && posp_data.Aadhar) ? posp_data.Aadhar : (pospListObj.hasOwnProperty(posp_data['Ss_Id']) && pospListObj[posp_data['Ss_Id']].hasOwnProperty('Aadhar') && pospListObj[posp_data['Ss_Id']]['Aadhar']) ? pospListObj[posp_data['Ss_Id']]['Aadhar'] : "";
											posp_details["UID"] = "";
                                            posp_details["POSPFName"] = first_name;
                                            posp_details["POSPMName"] = middle_name;
                                            posp_details["POSPLName"] = last_name;
                                            /*
                                             if (posp_data.DOB_On_PAN && posp_data.DOB_On_PAN.includes('-')) {
                                             posp_details["Dob"] = moment(posp_data["DOB_On_PAN"], 'YYYY-MM-DD').format("YYYY-MM-DD");
                                             } else if (posp_data.DOB_On_PAN && posp_data.DOB_On_PAN.includes('/')) {
                                             posp_details["Dob"] = moment(posp_data["DOB_On_PAN"], 'DD/MM/YYYY').format("YYYY-MM-DD");
                                             } else {
                                             posp_details["Dob"] = "";
                                             }
                                             */

                                            if (posp_data.DOB_On_PAN && moment(posp_data.DOB_On_PAN, 'YYYY-MM-DD', true).isValid()) {
                                                posp_details["Dob"] = posp_data["DOB_On_PAN"];
                                            } else if (posp_data.DOB_On_PAN && moment(posp_data.DOB_On_PAN, 'DD-MM-YYYY', true).isValid()) {
                                                posp_details["Dob"] = moment(posp_data["DOB_On_PAN"], 'DD-MM-YYYY').format("YYYY-MM-DD");
                                            } else if (posp_data.DOB_On_PAN && moment(posp_data.DOB_On_PAN, 'DD/MM/YYYY', true).isValid()) {
                                                posp_details["Dob"] = moment(posp_data["DOB_On_PAN"], 'DD/MM/YYYY').format("YYYY-MM-DD");
                                            } else {
                                                posp_details["Dob"] = "";
                                            }


                                            posp_details["City"] = (posp_data.hasOwnProperty('Present_City') && posp_data.Present_City) ? posp_data.Present_City : (pospListObj.hasOwnProperty(posp_data['Ss_Id']) && pospListObj[posp_data['Ss_Id']].hasOwnProperty('Present_City') && pospListObj[posp_data['Ss_Id']]['Present_City']) ? pospListObj[posp_data['Ss_Id']]['Present_City'] : "";
                                            posp_details["Pin"] = (posp_data.hasOwnProperty('Present_Pincode') && posp_data.Present_Pincode) ? (posp_data["Present_Pincode"]).toString() : (pospListObj.hasOwnProperty(posp_data['Ss_Id']) && pospListObj[posp_data['Ss_Id']].hasOwnProperty('Present_Pincode') && pospListObj[posp_data['Ss_Id']]['Present_Pincode']) ? (pospListObj[posp_data['Ss_Id']]['Present_Pincode']).toString() : "";
                                            posp_details["AppointmentDate"] = moment().format("YYYY-MM-DD");
                                            posp_details["Email"] = (posp_data.hasOwnProperty('Email_Id') && posp_data.Email_Id) ? posp_data.Email_Id : (pospListObj.hasOwnProperty(posp_data['Ss_Id']) && pospListObj[posp_data['Ss_Id']].hasOwnProperty('Email_Id') && pospListObj[posp_data['Ss_Id']]['Email_Id']) ? pospListObj[posp_data['Ss_Id']]['Email_Id'] : "";
                                            //posp_details["Mobile"] = (posp_data.hasOwnProperty('Mobile_Number') && posp_data.Mobile_Number) ? posp_data.Mobile_Number : (pospListObj.hasOwnProperty(posp_data['Ss_Id']) && pospListObj[posp_data['Ss_Id']].hasOwnProperty('Mobile_No') && pospListObj[posp_data['Ss_Id']]['Mobile_No']) ? pospListObj[posp_data['Ss_Id']]['Mobile_No'] : "";
                                            posp_details["Mobile"] = (posp_data.Mobile_Number && ["NA", "undefined"].indexOf(posp_data.Mobile_Number) === -1) ? posp_data.Mobile_Number : (pospListObj.hasOwnProperty(posp_data['Ss_Id']) && pospListObj[posp_data['Ss_Id']].hasOwnProperty('Mobile_No') && pospListObj[posp_data['Ss_Id']]['Mobile_No']) ? pospListObj[posp_data['Ss_Id']]['Mobile_No'] : "";
                                            posp_details["Status"] = "Y"; //doubts
                                            posp_details["InternalPOSCode"] = posp_data["User_Id"] + "";
                                            //posp_details["Column1"] = "Y";
                                            //posp_details["Column2"] = moment().format('DD.MM.YYYY');
                                            //posp_details["Column3"] = "";
                                            posp_mail_send_ss_id.push(posp_data.User_Id);
                                            posp_mail_details.push(posp_details);
                                        }

                                    });
                                    console.error({"posp_mail_send_ss_id": posp_mail_send_ss_id, "posp_mail_details": posp_mail_details});
                                    let filename = moment().format('DDMMYYYYhhmmss');
                                    var file_name = "POSP_Details_" + filename + ".xlsx";
                                    var loc_path_portal = appRoot + "/tmp/pdf/" + file_name;
                                    excel_file_attachment = loc_path_portal.replace(appRoot + "/tmp", "");
                                    var web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + file_name;
                                    var workbook = new excel.Workbook();
                                    var worksheet = workbook.addWorksheet('Sheet 1');
                                    var styleh = workbook.createStyle({
                                        font: {
                                            bold: false,
                                            size: 12
                                        },
                                        fill: {
                                            type: "pattern",
                                            patternType: "solid",
                                            bgColor: "#FDFEFE",
                                            fgColor: "#3498DB"
                                        }
                                    });
                                    var styleh2 = workbook.createStyle({
                                        font: {
                                            bold: false,
                                            size: 8
                                        },
                                        fill: {
                                            type: "none",
                                            bgColor: "#FBFCFC",
                                            fgColor: "#D6EAF8"
                                        }
                                    });

                                    if (posp_mail_details.length > 0) {
                                        try {
                                            //row 1
                                            worksheet.cell(1, 1).string('POSPPAN').style(styleh);
                                            worksheet.cell(1, 2).string('POSPUID').style(styleh);
                                            worksheet.cell(1, 3).string('PoSPFName').style(styleh);
                                            worksheet.cell(1, 4).string('PoSPMName').style(styleh);
                                            worksheet.cell(1, 5).string('PoSPLName').style(styleh);
                                            worksheet.cell(1, 6).string('DOB').style(styleh);
                                            worksheet.cell(1, 7).string('City').style(styleh);
                                            worksheet.cell(1, 8).string('Pin').style(styleh);
                                            worksheet.cell(1, 9).string('AppointmentDate').style(styleh);
                                            worksheet.cell(1, 10).string('EMail').style(styleh);
                                            worksheet.cell(1, 11).string('Mobile').style(styleh);
                                            worksheet.cell(1, 12).string('Status').style(styleh);
                                            worksheet.cell(1, 13).string('InternalPOSCode').style(styleh);
                                            //worksheet.cell(1, 14).string('Column1').style(styleh);
                                            //worksheet.cell(1, 15).string('Column2').style(styleh);
                                            //worksheet.cell(1, 16).string('Column3').style(styleh);
                                            let rowcount = 2;
                                            posp_mail_details.forEach((item, index) => {
                                                let col = 1;
                                                for (let keyVal in item) {
                                                    worksheet.cell(rowcount, col).string(item[keyVal].replaceAll(",", " ")).style(styleh2);
                                                    if (keyVal === "City") {
                                                        worksheet.cell(rowcount, col).string(item[keyVal].replace(/[^\w\s]/gi, "").replace(/[0-9]/g, '').trim()).style(styleh2);
                                                    }
                                                    console.log("rowcount : " + rowcount + " , col : " + col + " , keyVal : " + keyVal + " , Val : " + item[keyVal]);
                                                    col++;
                                                }
                                                rowcount++;
                                            });
                                            workbook.write(loc_path_portal);
                                            var Email = require('../models/email');
                                            var objModelEmail = new Email();
                                            var sub = 'POSP IIB Upload Data - ' + date;
                                            email_body = '<html><body><p>Dear Sir,</p><p>Please find the link of  IIB Format POSP data dated of  ' + date + '. </p>'
                                                    + '<p>POSP Details File URL : <a href="' + web_path_portal + '">' + web_path_portal + '</a> </p><br><br><br><p>Thanks & Regards</p><p>PolicyBoss IT</p></body></html>';
                                            var arrTo = "";
                                            var arrBcc = "";
                                            if (req.query && req.query.dbg && req.query.dbg === "yes") {
                                                arrTo = ['roshani.prajapati@policyboss.com'];
                                                arrBcc = [config.environment.notification_email, 'nilam.bhagde@policyboss.com', 'ashish.hatia@policyboss.com'];
                                            } else {
                                                try {
                                                    let setMailNodeArgs = {
                                                        data: {
                                                            'ss_id': posp_mail_send_ss_id
                                                        },
                                                        headers: {
                                                            "Content-Type": "application/json"
                                                        }
                                                    };
                                                    client.post(config.environment.weburl + "/onboarding/setMailNode", setMailNodeArgs, function (set_mail_node_data, sset_mail_node_response) {
                                                    });
                                                } catch (e) {
                                                    console.error("Error in updating mail node");
                                                }
                                                arrTo = ['ronald.mathais@policyboss.com', 'sandeep.nair@landmarkinsurance.in'];
                                                arrBcc = [config.environment.notification_email, 'p.janardhan@policyboss.com', 'posp.notification@policyboss.com', 'ashish.hatia@policyboss.com', 'onlinepolicy@policyboss.com'];
                                            }

                                            //objModelEmail.send('pospcom@policyboss.com', arrTo.join(','), sub, email_body, '', arrBcc.join(','), ''); //UAT
                                            objModelEmail.send('pospcom@policyboss.com', arrTo.join(','), sub, email_body, '', arrBcc.join(','), 0, 0, excel_file_attachment); //UAT

                                            res.json({"Status": "Success", "Msg": "Mail sent"});
                                        } catch (e) {
                                            res.json({"Status": "Fail", "Msg": e.stack, "Data": cnt});
                                        }
                                    } else {
                                        res.json({"Status": "Fail", "Msg": "No records to update"});
                                    }

                                } else {
                                    res.json({"Status": "Success", "Msg": "No records found"});
                                }
                            } catch (ex) {
                                console.error("EXCEPTION_MAIL_POSP_DETAILS : " + ex.stack);
                                res.json({"Status": "Fail", "Msg": ex.stack});
                            }
                        });
                    });
                }
            });
        } catch (ex) {
            console.error("EXCEPTION_MAIL_POSP_DETAILS : " + ex.stack);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post("/onboarding/setMailNode", function (req, res) {
        try {
            let ss_id = req.body.ss_id || [];
            let args = {
                "Is_Mail_Sent": 0,
                "User_Id": {"$in": ss_id},
                "Is_Active": true
            };
            console.error('POSP Send Mail Zero SS_Id: ', args);
            posp_user.find(args, function (posp_user_err, posp_user_res) {
                if (posp_user_err) {
                    res.json({"Status": "Fail", "Msg": posp_user_err});
                } else {
                    if (posp_user_res.length > 0) {
                        for (let i = 0; i < posp_user_res.length; i++) {
                            let posp_user_data = posp_user_res[i]._doc;
                            let User_Id = posp_user_data['User_Id'];
                            posp_user.update({"User_Id": User_Id}, {"Is_Mail_Sent": 1}, {runValidators: true}, function (err, numAffected) {
                                if (err) {
                                    res.json({"Status": "Fail", "Msg": err});
                                } else {

                                }
                            });
                            if (i === (posp_user_res.length - 1)) {
                                res.json({"Status": "Success", "Msg": "Mail sent successfully."});
                            }
                        }
                    } else {
                        res.json({"Status": "Fail", "Msg": "User not found"});
                    }

                }
            });

        } catch (ex) {
            res.json({'Status': "Fail", "Msg": ex.stack});
        }
    });
    app.post("/onboarding/account_verification_update", function (req, res) {
        try {
            let erp_bank_account_detail = require('../models/erp_bank_account_detail.js');
            let Account_Number = (req.body.Account_Number).toString();
            let Ifsc_Code = (req.body.IFSC_Code).toString();
            erp_bank_account_detail.find({"Account_Number": Account_Number, "IFSC_Code": Ifsc_Code}, function (erp_bank_account_detail_err, erp_bank_account_detail_result) {
                if (erp_bank_account_detail_err) {
                    res.json({"Status": "Fail", "Msg": erp_bank_account_detail_err});
                } else {
                    if (erp_bank_account_detail_result.length > 0) {
                        let zoop_url = "https://live.zoop.one/api/v1/in/financial/bav/lite";
                        let data_req = {
                            "data": {
                                "account_number": Account_Number,
                                "ifsc": Ifsc_Code,
                                "consent": "Y",
                                "consent_text": "I hear by declare my consent agreement for fetching my information via ZOOP API."
                            }
                        };
                        zoop_doc_args["data"] = data_req;
                        let api_log_find_args = {
                            'Account_Number': Account_Number,
                            'IFSC_Code': Ifsc_Code
                        };
                        let api_log_update_args = {
                            'API_Request': zoop_doc_args
                        };
                        let client = new Client();
                        client.post(zoop_url, zoop_doc_args, function (zoopdata, zoopresponse) {
                            if (zoopdata && zoopdata["result"]) {
                                api_log_update_args["Status"] = "Success";
                            } else if (zoopdata && zoopdata.response_message && zoopdata.response_message.includes('Combination')) {
                                api_log_update_args["Status"] = "Validation";
                            } else if (zoopdata && zoopdata.response_message && zoopdata.response_message.includes('Limit exhausted')) {
                                api_log_update_args["Status"] = "Limit_Exhausted";
                            } else if (zoopdata && zoopdata.response_message && zoopdata.response_message.includes('No Record Found')) {
                                if (zoopdata.response_message.metadata && zoopdata.response_message.metadata.reason_message.includes('Invalid Account Number')) {
                                    api_log_update_args["Status"] = "Invalid_Account_Number";
                                } else {
                                    api_log_update_args["Status"] = "No_Record_Found";
                                }
                            } else if (zoopdata && zoopdata.response_message && zoopdata.response_message.includes('Source Error')) {
                                api_log_update_args["Status"] = "Source_Error";
                            } else if (zoopdata && zoopdata.response_message && zoopdata.response_message.includes('Duplicate Transaction')) {
                                api_log_update_args["Status"] = "Duplicate_Transaction";
                            } else {
                                api_log_update_args["Status"] = "Fail";
                            }

                            api_log_update_args["Beneficiary_Name"] = "";
                            if (api_log_update_args["Status"] === "Success" && zoopdata && zoopdata.result && zoopdata.result.beneficiary_name) {
                                api_log_update_args["Beneficiary_Name"] = zoopdata.result.beneficiary_name;
                            }
                            api_log_update_args["API_Response"] = zoopdata;
                            erp_bank_account_detail.update(api_log_find_args, {$set: api_log_update_args}, {runValidators: true}, function (err, numAffected) {
                                if (err) {
                                    res.json({"Status": "Fail", "Msg": "Error in saving API details.", "data": err});
                                } else {
                                }
                            });
                        });
                    } else {

                    }
                }
            });
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/update_posp_user', function (req, res) {
        try {
            let body = req.body ? req.body : '';
            let user_id = body.User_Id ? body.User_Id : '';
            let posp_user_args = {};
            for (let key in body) {
                posp_user_args[key] = body[key] && body[key] !== undefined ? body[key] : "";
            }
            delete posp_user_args["User_Id"];
            if (user_id) {
                posp_user.find({"User_Id": user_id}, function (err, dbresult) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        if (dbresult && dbresult.length > 0) {
                            posp_user.update({'User_Id': user_id}, {$set: posp_user_args}, {runValidators: true}, function (err, numAffected) {
                                if (err) {
                                    res.json({"Status": "Fail", "Msg": err});
                                } else {
                                    res.json({"Status": "Success", "Msg": 'POSP details updated successfully'});
                                }
                            });
                        } else {
                            res.json({"Status": "Fail", "Msg": "User not found."});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "User_Id is missing."});
            }
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/posp_data_update', function (req, res) {
        try {
            req.body = JSON.parse(JSON.stringify(req.body));
            let objRequest = req.body;
            let objQuery = req.query;
            let ss_id = objQuery.ss_id ? objQuery.ss_id - 0 : "";
            if (ss_id && Object.keys(objRequest).length > 0) {
                let find_obj = {Ss_Id: ss_id};
                let update_obj = objRequest;
                let MongoClient = require('mongodb').MongoClient;
                MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (dberr, db) {
                    if (dberr) {
                        res.send({"Status": "FAIL", "Msg": "DATABASE CONNECTION FAIL", "Data": dberr});
                    } else {
                        let Posps = db.collection('posps');
                        Posps.update(find_obj, {$set: update_obj}, function (posp_data_err, posp_data) {
                            if (posp_data_err) {
                                res.send({"Status": "FAIL", "Msg": "NO RECORD UPDATE", "Data": posp_data_err});
                            } else {
                                res.send({"Status": "SUCCESS", "Msg": "UPDATE SUCCESSFULLY", "Data": posp_data});
                            }
                        });
                    }
                });
            } else {
                let msg = (ss_id ? (Object.keys(objRequest).length > 0 ? objRequest : "NO DATA AVAILABLE TO UPDATE") : "SS_ID IS MANDATORY");
                res.send({"Status": "FAIL", "Msg": msg});
            }
        } catch (e) {
            res.send({"Status": "FAIL", "Msg": e.stack});
        }
    });
    app.post('/onboarding/bank_ifsc_verification', function (req, res) {
        try {
            let Ifsc_Code_Master = require('../models/ifsc_code_master.js');
            let User_Id = req.body['User_Id'];
            let ifsc_code = req.body.Ifsc ? req.body['Ifsc'].toString().toUpperCase() : "";
            docType = req.body['doc_type'] === "POSP_ACC_DOC" ? "POSP-BANK-ACC" : "NOMINEE-BANK-ACC";
            console.log("doc type : " + docType);
            let zoop_url = "https://live.zoop.one/api/v1/in/utility/ifsc/lite";
            //zoop_url = "https://test.zoop.one/api/v1/in/utility/ifsc/lite";
            let data_req = {
                "mode": "sync",
                "data": {
                    "ifsc": ifsc_code,
                    "consent": "Y",
                    "consent_text": "I hear by declare my consent agreement for fetching my information via ZOOP API"
                },
                "task_id": "f26eb21e-4c35-4491-b2d5-41fa0e545a34"
            };

            zoop_doc_args["data"] = data_req;
            let api_log_args = {
                data: {
                    'User_Id': User_Id,
                    'Doc_Type': docType,
                    'Api_Url': zoop_url,
                    'Sub_Type': "",
                    'Api_Request': zoop_doc_args
                },
                headers: {
                    "Content-Type": "application/json"
                }
            };
            let save_ifsc_args = {
                'IFSC_Code': ifsc_code,
                'Request_Core': zoop_doc_args,
                'Created_On': moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
            };
            try {
                Ifsc_Code_Master.findOne({"IFSC_Code": ifsc_code}).sort({"Created_On": -1}).exec(function (ifsc_detail_err, ifsc_detail_data) {
                    if (ifsc_detail_data) {
                        let ifsc_record = {
                            "result": ifsc_detail_data._doc.Response_Core
                        };
                        return res.json({"Status": "Success", "data": ifsc_record});
                    } else {
                        client.post(zoop_url, zoop_doc_args, function (zoopdata, zoopresponse) {
                            if (zoopdata && zoopdata["result"]) {
                                let data = zoopdata["result"];
                                save_ifsc_args["Bank_Name"] = data.hasOwnProperty("bank") && data.bank ? data.bank : "";
                                save_ifsc_args["Branch"] = data.hasOwnProperty("branch") && data.branch ? data.branch : "";
                                save_ifsc_args["City"] = data.hasOwnProperty("city") && data.city ? data.city : "";
                                save_ifsc_args["Bank_Address"] = data.hasOwnProperty("address") && data.address ? data.address : "";
                                save_ifsc_args["MICR_Code"] = data.hasOwnProperty("micr") && data.micr ? data.micr : "";
                                save_ifsc_args["Center"] = data.hasOwnProperty("centre") && data.centre ? data.centre : "";
                                save_ifsc_args["Response_Core"] = data;
                                let Ifsc_Code_Master_Obj = new Ifsc_Code_Master(save_ifsc_args);
                                Ifsc_Code_Master_Obj.save(function (save_err, save_result) {
                                    if (save_err) {
                                        res.json({"Status": "Fail", "Msg": save_err});
                                    }
                                });
                            }
                            api_log_args["data"]["Status"] = zoopdata && zoopdata["result"] ? "Success" : "Fail";
                            api_log_args["data"]["Api_Response"] = zoopdata;
                            client.post(config.environment.weburl + '/onboarding/update_api_log', api_log_args, function (update_api_log_data, update_api_log_res) {
                                if (update_api_log_data.Status === "Success") {
                                    res.json({Status: api_log_args["data"]["Status"], data: zoopdata});
                                } else {
                                    res.json({Status: api_log_args["data"]["Status"], data: zoopdata});
                                }
                            });
                        });
                    }
                });
            } catch (ex) {
                return res.json({"Status": "Exception", "Error": ex.stack});
            }
        } catch (ex) {
            return res.json({"Status": "Fail", "Msg": "Error in bank IFSC verification", "Error": ex.stack});
        }
    });
    app.get("/onboarding/sync_documents", function (req, res) {
        try {
            let Client = require('node-rest-client').Client;
            let client = new Client();
            let http = require('http');
            let https = require('https');
            let Stream = require('stream').Transform;
            let ss_id = req.query.ss_id ? req.query.ss_id - 0 : "";
            let status = req.query.status ? req.query.status : "";
            let posp_dsa_data = "";
            let mobile_number = "";
            let fba_id = 0;
            let posp_user_obj = {};
            let mandate_doc_arr = ["PROFILE", "PAN", "AADHAAR", "QUALIFICATION", "POSP_ACC_DOC"];
            if (ss_id !== "" && status !== "") {
                posp_doc_log.find({"User_Id": ss_id}, function (posp_doc_log_err, posp_doc_log_data) {
                    if (posp_doc_log_err) {
                        res.json({"Status": "FAIL", "Msg": posp_doc_log_err});
                    } else {
                        if (posp_doc_log_data && posp_doc_log_data.length > 0) {
                            return res.json({"Status": "SUCCESS", "Msg": "Documents Already Exists For Given Ss_Id", "Ss_Id": ss_id});
                        } else {
                            client.get('http://horizon.policyboss.com:5000/posps/dsas/view/' + ss_id, {}, function (posp_dsa_response, response) {
                                if (posp_dsa_response && posp_dsa_response.status && posp_dsa_response.status === "SUCCESS") {
                                    posp_dsa_data = posp_dsa_response;
                                    mobile_number = posp_dsa_data.POSP && posp_dsa_data.POSP.Mobile_No ? posp_dsa_data.POSP.Mobile_No : "";
                                    fba_id = posp_dsa_data.POSP && posp_dsa_data.POSP.Fba_Id ? posp_dsa_data.POSP.Fba_Id : 0;
                                    let document_obj = {"Photograph": "Profile_", "10th Certificate": "QualificationCertificate_", "12th Certificate (optional)": "QualificationCertificate_", "Graduate Certificate (optional)": "QualificationCertificate_", "Pancard": "PanCard_", "Aadhar Card": "AadharCard_", "Copy of Cancelled Cheque for Self": "Posp_Bank_Account_", "PostTraining_Pass": "Certificate_"};
                                    let document_type = {"Photograph": "PROFILE", "10th Certificate": "QUALIFICATION", "12th Certificate (optional)": "QUALIFICATION", "Graduate Certificate (optional)": "QUALIFICATION", "Pancard": "PAN", "Aadhar Card": "AADHAAR", "Copy of Cancelled Cheque for Self": "POSP_ACC_DOC", "PostTraining_Pass": "Certificate_"};
                                    let document_list = posp_dsa_data.POSP.Document_List;
                                    let doc_length = mandate_doc_arr.length;
                                    Object.keys(document_list).find(key => {
                                        if (mandate_doc_arr.indexOf(document_type[key]) > -1) {
                                            if (document_list[key] !== "" && document_list[key] !== undefined && document_list[key] !== null) {
                                                doc_length--;
                                                let document_url = document_list[key];
                                                let filename = document_obj[key] + ss_id + "." + document_url.split('.').pop();
                                                let path = appRoot + "/tmp/onboarding_docs/" + ss_id;
                                                if (!fs.existsSync(appRoot + "/tmp/onboarding_docs/" + ss_id)) {
                                                    fs.mkdirSync(appRoot + "/tmp/onboarding_docs/" + ss_id);
                                                }
                                                let client = http;
                                                if (document_url.toString().indexOf("https") === 0) {
                                                    client = https;
                                                }
                                                client.request(document_url, function (doc_response) {
                                                    let doc_data = new Stream();
                                                    doc_response.on('data', function (chunk) {
                                                        doc_data.push(chunk);
                                                    });
                                                    doc_response.on('end', function () {
                                                        fs.writeFileSync(path + '/' + filename, doc_data.read());
                                                        if (key !== "PostTraining_Pass") {
                                                            let doc_log_obj = {
                                                                "User_Id": ss_id,
                                                                "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]"),
                                                                "Created_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]"),
                                                                "Doc_URL": config.environment.downloadurl + "/onboarding/download/onboarding_docs/" + ss_id + "/" + filename,
                                                                "Remark": "",
                                                                "Prev_Approval_Status": "",
                                                                "Status": "Pending",
                                                                "Doc_Type": document_type[key],
                                                                "Fba_Id": fba_id,
                                                                "Verified_By_API": "No",
                                                                "Approver_Ss_Id": "",
                                                                "Verifier_Ss_Id": "",
                                                                "Approved_On_Date": null,
                                                                "Verified_On_Date": null,
                                                                "Uploaded_By_Ss_Id": ss_id,
                                                                "Mobile_Number": mobile_number
                                                            };
                                                            if (status === "AP") {
                                                                doc_log_obj["Status"] = "Verified";
                                                                doc_log_obj["Verifier_Ss_Id"] = "7644";
                                                                doc_log_obj["Verified_On_Date"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                                            }
                                                            if (status === "VP") {
                                                                doc_log_obj["Status"] = "Pending";
                                                            }
                                                            if (status === "IIBP") {
                                                                doc_log_obj["Status"] = "Approved";
                                                                doc_log_obj["Verifier_Ss_Id"] = "7644";
                                                                doc_log_obj["Approver_Ss_Id"] = "7973";
                                                                doc_log_obj["Approved_On_Date"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                                                doc_log_obj["Verified_On_Date"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                                            }
                                                            let posp_doc_logObj = new posp_doc_log(doc_log_obj);
                                                            posp_doc_logObj.save(function (doc_log_save_err, doc_log_save_res) {
                                                                if (doc_log_save_err) {
                                                                    res.json({"Status": "FAIL", "Msg": "Fail To Insert Record In POSP_DOC_LOG", "Data": doc_log_save_err});
                                                                } else {
                                                                }
                                                            });
                                                        }
                                                    });
                                                }).end();
                                            }
                                        }
                                    });
                                    if (status === "AP") {
                                        posp_user_obj["Is_Doc_Approved"] = "No";
                                        posp_user_obj["Is_Document_Uploaded"] = "Yes";
                                        posp_user_obj["Is_Doc_Verified"] = "Yes";
                                        posp_user_obj["Is_Document_Rejected"] = "No";
                                        posp_user_obj["Verified_Mail_Sent"] = "Yes";
                                        posp_user_obj["Is_Mail_Sent"] = 2;
                                        posp_user_obj["Documents_Uploaded_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                        posp_user_obj["Documents_Verified_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                    }
                                    if (status === "VP") {
                                        posp_user_obj["Is_Doc_Approved"] = "No";
                                        posp_user_obj["Is_Document_Uploaded"] = "Yes";
                                        posp_user_obj["Is_Doc_Verified"] = "No";
                                        posp_user_obj["Is_Document_Rejected"] = "No";
                                        posp_user_obj["Verified_Mail_Sent"] = "No";
                                        posp_user_obj["Documents_Uploaded_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                    }
                                    if (status === "IIBP") {
                                        posp_user_obj["Is_Doc_Approved"] = "Yes";
                                        posp_user_obj["Is_Document_Uploaded"] = "Yes";
                                        posp_user_obj["Is_Doc_Verified"] = "Yes";
                                        posp_user_obj["Is_Document_Rejected"] = "No";
                                        posp_user_obj["Verified_Mail_Sent"] = "Yes";
                                        posp_user_obj["Approved_Mail_Sent"] = "Yes";
                                        posp_user_obj["Is_Mail_Sent"] = 2;
                                        posp_user_obj["Documents_Uploaded_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                        posp_user_obj["Documents_Verified_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                        posp_user_obj["Documents_Approved_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                    }
                                    if (doc_length <= 0) {
                                        posp_user.updateOne({'User_Id': ss_id}, {$set: posp_user_obj}, function (posp_user_err, numAffected) {
                                            if (posp_user_err) {
                                                res.json({"Status": "FAIL", "Msg": posp_user_err});
                                            } else {
                                                res.json({"Status": "SUCCESS", "Msg": "POSP Documents Synced Successfully"});
                                            }
                                        });
                                    } else {
                                        res.json({"Status": "FAIL", "Msg": "Some Documents Are Missing."});
                                    }

                                } else {
                                    res.json({"Status": "FAIL", "Msg": "No Record Found For Given Ss_Id.", "Ss_Id": ss_id});
                                }
                            }); //dsas
                        }
                    }
                });
            } else {
                res.json({"Status": "FAIL", "Msg": "Ss_Id / Status is Missing"});
            }
        } catch (e) {
            res.json({"Status": "FAIL", "Msg": e.stack});
        }
    });
    app.get("/onboarding/schedule_posps_data", function (req, res) {
        try {
            let days = req.query.days ? req.query.days - 0 : 10;
            let ss_id = req.query.ss_id ? true : false;
            let find_query = [];
            if (ss_id) {
                find_query = [
                    {$match: {"Ss_Id": (req.query.ss_id - 0)}}
                ];
            } else {
//                let cond_date = new Date(Date.now() - (days * 24) * 60 * 60 * 1000);
//                find_query = [
//                    {$match: {$and: [
//                                {"Created_On": {$lte: cond_date}},
//                                {"Erp_Id": {"$exists": true, "$ne": ""}},
//                                {"Erp_Status": "SUCCESS"}]}}
//                ];
                let start_date = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                start_date.setDate(start_date.getDate() - days);
                start_date.setHours(00, 00, 00, 000);
                let end_date = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
//                end_date.setDate(end_date.getDate() + 1);
                find_query = [
                    {$match: {$and: [
                                {"Created_On": {$gte: start_date, $lte: end_date}},
                                {"Erp_Id": {"$exists": true, "$ne": ""}},
                                {"Erp_Status": "SUCCESS"}]}}
                ];
            }
            console.error('find_query', JSON.stringify(find_query));
            posp_user.aggregate(find_query, function (posp_user_err, posp_user_data) {
                if (posp_user_err) {
                    res.json({"Status": "FAIL", "Msg": posp_user_err});
                } else {
                    let posp_user_db_response = posp_user_data;
                    if (posp_user_db_response && posp_user_db_response.length > 0) {
                        let posps_db_response = "";
                        let filter_ss_id = posp_user_db_response.map(function (filter_value) {
                            return (filter_value.Ss_Id ? filter_value.Ss_Id : "");
                        });
                        console.log(filter_ss_id);
                        let MongoClient = require('mongodb').MongoClient;
                        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (dberr, db) {
                            if (dberr) {
                                res.send({"Status": "FAIL", "Msg": "DATABASE CONNECTION FAIL", "Data": dberr});
                            } else {
                                let Posps = db.collection('posps');
                                Posps.find({Ss_Id: {$in: filter_ss_id}}, {_id: 0}).toArray(function (posps_db_err, posps_db_data) {
                                    if (posps_db_err) {
                                        res.send({"Status": "FAIL", "Msg": "NO RECORD AVAILABE", "Data": posps_db_err});
                                    } else {
                                        posps_db_response = posps_db_data;
                                        let posp_user = posp_user_db_response;
                                        let posp = posps_db_response;
//                                        let first_filter_data = posp_user.filter(obj1 =>
//                                            posp.some(obj2 => obj1.Ss_Id === obj2.Ss_Id)
//                                        );

                                        //change code 
//                                        let first_filter_data = posp_user.filter(obj1 =>
//                                            posp.filter(obj2 => {
//                                                if (obj1.Ss_Id === obj2.Ss_Id) {
//                                                    for (var key in obj2) {
//                                                        if (["", null, "NA"].indexOf(obj2[key]) > -1) {
//                                                            if (["", null, "NA"].indexOf(obj1[key]) > -1) {
//                                                                delete obj1[key];
//                                                            } else {
//                                                                obj2[key] = obj1[key];
//                                                            }
//                                                        }
//                                                    }
//                                                }
//                                            })
//                                        );
                                        let first_filter_data = posp.filter(obj1 =>
                                            posp_user.filter(obj2 => {
                                                if (obj1.Ss_Id === obj2.Ss_Id) {
                                                    for (var key in obj1) {
                                                        if (["", null, "NA"].indexOf(obj1[key]) > -1) {
                                                            if (["", null, "NA"].indexOf(obj2[key]) == -1) {
                                                                obj1[key] = obj2[key];
                                                            }
                                                        }
                                                    }
                                                }
                                            })
                                        );
                                        second_filter_data = first_filter_data;
                                        second_filter_data.forEach(obj1 => {
                                            for (const key in obj1) {
                                                try {
                                                    if (key === "Erp_Id" && obj1[key]) {
                                                        obj1['Last_Status'] = "18";
                                                    }
                                                    if (key === "IsFOS" && obj1[key]) {
                                                        obj1['IsFOS'] = obj1[key] === true ? 1 : 0;
                                                    }
                                                    if (key === "POSP_UploadedtoIIB" && obj1[key]) {
                                                        obj1['Is_IIB'] = obj1[key] === "Yes" ? 1 : 0;
                                                    }
                                                    if (key === "POSP_UploadingDateAtIIB" && obj1[key]) {
                                                        obj1['IIB_On'] = obj1[key] ? (moment(obj1[key], 'DD-MM-YYYY').format("YYYY-MM-DDTHH:mm:ss[Z]")) : "";
                                                    }
                                                    if (key === "POSP_DeActivatedtoIIB" && obj1[key]) {
                                                        obj1['Is_DeActivation'] = obj1[key] === "Yes" ? 1 : 0;
                                                    }
                                                    if (key === "POSP_DeActivatedDateAtIIB" && obj1[key]) {
                                                        obj1['DeActivation_On'] = obj1[key] ? (moment(obj1[key], 'DD-MM-YYYY').format("YYYY-MM-DDTHH:mm:ss[Z]")) : "";
                                                    }
                                                    if (key === "Exam_Status" && obj1[key]) {
                                                        obj1['Is_Exam'] = obj1[key] === "Completed" ? 1 : 0;
                                                    }
                                                    if (key === "Is_Certificate_Generated" && obj1[key]) {
                                                        obj1['Is_Certified'] = obj1[key] === "Yes" ? 1 : 0;
                                                    }
                                                    if (key === "PayId" && obj1[key].includes('pay_')) {
                                                        obj1['Is_Paid'] = obj1[key].includes('pay_') ? 1 : 0;
                                                    }
                                                    if (!posp[0].hasOwnProperty(key)) {
                                                        delete obj1[key];
                                                    }
                                                    if (posp[0].hasOwnProperty('Middle_Name')) {
                                                        delete obj1[key];
                                                    }
                                                } catch (e) {
                                                    console.error('/onboarding/erp_code_update_in_posps', e.stack);
                                                }
                                            }
                                        });
                                        console.error('second_filter_data', second_filter_data);
                                        second_filter_data.forEach(function (posp_loop, i) {
                                            let posp_loop_data = posp_loop;
                                            let update_ss_id = posp_loop_data.Ss_Id;
                                            try {
                                                let posp_update_args = {
                                                    data: posp_loop_data,
                                                    headers: {
                                                        "Content-Type": "application/json"
                                                    }
                                                };
                                                client.post(config.environment.weburl + "/onboarding/posp_data_update?ss_id=" + update_ss_id, posp_update_args, function (posp_update_data, posp_update_response) {
                                                    if (i === (second_filter_data.length - 1)) {
                                                        res.json({"Status": "SUCCESS", "Msg": "UPDATE SUCCESSFULLY"});
                                                    }
                                                });
                                            } catch (e) {
                                                console.error('Update POSP collection at the time of Successful Payment', e.stack);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        res.send({"Status": "FAIL", "Msg": "NO DATA AVAILABE IN POSP USER"});
                    }
                }
            });
        } catch (e) {
            res.json({"Status": "FAIL", "Msg": e.stack});
        }
    });
    app.post("/onboarding/sync_posp_user_data", function (req, res) {
        try {
            let posp_list = req.body.posp_list;
            let arr = posp_list.split(",");
            let successArr = [];
            let failArr = [];
            let total_length = 0;
            for (var x = 0; x < arr.length; x++) {
                let user_id = arr[x];
                client.get(config.environment.weburl + "/onboarding/schedule_posp_user_data?ss_id=" + user_id + "&sync=yes", {}, function (schedule_posp_document_data, schedule_posp_document_data_response) {
                    if (schedule_posp_document_data.Status === "SUCCESS") {
                        successArr.push(schedule_posp_document_data);
                        total_length++;
                    } else {
                        failArr.push(schedule_posp_document_data);
                        total_length++;
                    }
                    if (arr.length == total_length) {
                        res.json({"Status": "SUCCESS", "Msg": "POSP DATA SYNC SUCCESSFULLY IN POSP USER", "Successful_PAN": successArr, "Failed_PAN": failArr});
                    }
                });
            }
        } catch (e) {
            res.json({"Status": "FAIL", "Msg": e.stack});
        }
    });
    app.get("/onboarding/schedule_posp_user_data_NIU", function (req, res) {
        try {
            let ss_id = req.query.ss_id ? req.query.ss_id - 0 : "";
            let is_sync = req.query.sync ? req.query.sync : "No";
            let find_query = [];
            let is_allow = false;
            if (is_sync === "yes") {
                is_allow = true;
                find_query = [
                    {$match: {$and: [
                                {"Ss_Id": ss_id}
                            ]
                        }}];
            } else if (ss_id) {
                is_allow = true;
                find_query = [
                    {$match: {$and: [
                                {"Created_On": {$lt: new Date("2023-08-25T00:00:00.000Z")}}, // Before 29 Aug Records
                                {"Ss_Id": ss_id}
                            ]
                        }}];
            }
            if (is_allow) {
                posp_user.find({'Ss_Id': ss_id}, function (posps_user_db_err, posps_user_db_data) {
                    if (posps_user_db_err) {
                        res.send({"Status": "FAIL", "Msg": "ERROR IN FIND POSP USER", "Data": posps_user_db_err});
                    } else {
                        if (posps_user_db_data && posps_user_db_data.length > 0) {
                            res.send({"Status": "SUCCESS", "Msg": "USER AVAILABLE IN POSP USER", "Data": posps_user_db_data});
                        } else {
                            var Posp = require('../models/posp');
                            console.error('find_query', JSON.stringify(find_query));
                            Posp.aggregate(find_query, function (posps_db_err, posps_db_data) {
                                if (posps_db_err) {
                                    res.send({"Status": "FAIL", "Msg": "NO RECORD AVAILABE", "Data": posps_db_err});
                                } else {
                                    let posps_db_response = posps_db_data;
                                    if (posps_db_response && posps_db_response.length > 0) {
                                        let posp = JSON.parse(JSON.stringify(posps_db_response));
                                        let filter_data = posp;
                                        filter_data.forEach(obj1 => {
                                            for (const key in obj1) {
                                                try {
                                                    if (key === "Erp_Id" && obj1[key]) {
                                                        obj1['Last_Status'] = "18";
                                                        obj1['Erp_Status'] = "SUCCESS";
                                                        obj1['Erp_Msg'] = "ERP CODE GENENERATED SUCCESSFULLY :: " + obj1[key];
                                                        obj1["Is_Training_Completed"] = "Yes";
                                                        obj1["Training_Status"] = "Completed";
                                                        obj1["Remaining_Hours"] = "00:00:00";
                                                        obj1["Completed_Hours"] = "30:00:00";
                                                        obj1["Onboarding_Status"] = "Exam_Completed";
                                                    }
                                                    if (key === "Mobile_No" && obj1[key]) {
                                                        obj1["Mobile_Number"] = obj1[key];
                                                    }
                                                    if (key === "Is_Contact_Sync") {
                                                        obj1['Is_Contact_Sync'] = obj1[key] ? obj1[key].toString() : "";
                                                    }
                                                    if (key === "IsFOS") {
                                                        obj1['IsFOS'] = ((obj1[key] - 0) === 1) ? true : false;
                                                    }
                                                    if (key === "Is_IIB") {
                                                        obj1['POSP_UploadedtoIIB'] = ((obj1[key] - 0) === 1) ? "Yes" : "No";
                                                    }
                                                    if (key === "POSP_UploadingDateAtIIB" && obj1[key]) {
                                                        obj1['POSP_UploadingDateAtIIB'] = obj1[key];
                                                        obj1["Is_Doc_Approved"] = "Yes";
                                                        obj1["Is_IIB_Uploaded"] = "Yes";
                                                        obj1["Is_Doc_Verified"] = "Yes";
                                                        obj1["Is_Document_Uploaded"] = "Yes";
                                                    }
                                                    if (key === "Is_DeActivation") {
                                                        obj1['POSP_DeActivatedtoIIB'] = ((obj1[key] - 0) === 1) ? "Yes" : "No";
                                                    }
                                                    if (key === "DeActivation_On" && obj1[key]) {
                                                        obj1['POSP_DeActivatedDateAtIIB'] = obj1[key];
                                                    }
                                                    if (key === "Is_Certified") {
                                                        obj1['Is_Certificate_Generated'] = ((obj1[key] - 0) === 1) ? "Yes" : "No";
                                                    }
                                                    if (key === "Is_Exam") {
                                                        obj1['Exam_Status'] = ((obj1[key] - 0) === 1) ? "Completed" : "";
                                                        obj1['Is_Certificate_Generated'] = obj1['Exam_Status'] === "Completed" ? "Yes" : "No";
                                                    }
                                                    if (key === "Is_Paid") {
                                                        obj1['Payment_Status'] = ((obj1[key] - 0) === 1) ? "Success" : "Pending";
                                                        obj1["RegAmount"] = 999;
                                                    }
                                                    if (key === "TrainingStartDate" && obj1[key]) {
                                                        obj1["Training_Start_Date"] = obj1[key];
                                                        obj1["Training_Scheduled_On"] = obj1["Training_Start_Date"];
                                                    }
                                                    if (key === "TrainingEndDate" && obj1[key]) {
                                                        obj1["Training_End_Date"] = obj1[key];
                                                    }
                                                    obj1["User_Id"] = obj1.Ss_Id;
                                                    if (obj1.hasOwnProperty('_id')) {
                                                        delete obj1[key];
                                                    }
                                                } catch (e) {
                                                    console.error('/onboarding/schedule_posp_user_data', e.stack);
                                                }
                                            }
                                        });
                                        filter_data.forEach(function (posp_loop, i) {
                                            let posp_loop_data = "";
                                            posp_loop_data = posp_loop;
                                            if (posp_loop.Training_Start_Date && ([null, ""].indexOf(posp_loop.Training_End_Date) > -1)) {
                                                posp_loop_data['Training_Status'] = "Started";
                                                posp_loop_data['Remaining_Hours'] = "30:00:00";
                                                posp_loop_data['Completed_Hours'] = "00:00:00";
                                            }
                                            if (posp_loop.Training_Start_Date && posp_loop.Training_End_Date) {
                                                if (posp_loop.Erp_Id) {
                                                    posp_loop_data['Training_Status'] = "Completed";
                                                    posp_loop_data['Remaining_Hours'] = "00:00:00";
                                                    posp_loop_data['Completed_Hours'] = "30:00:00";
                                                    posp_loop_data['Is_Training_Completed'] = "Yes";
                                                } else {
                                                    posp_loop_data['Training_Status'] = "Started";
                                                    posp_loop_data['Remaining_Hours'] = "30:00:00";
                                                    posp_loop_data['Completed_Hours'] = "00:00:00";
                                                }
                                            }
                                            let update_ss_id = posp_loop_data.Ss_Id;
                                            try {
                                                let posp_user_update_args = {
                                                    data: posp_loop_data,
                                                    headers: {
                                                        "Content-Type": "application/json"
                                                    }
                                                };
                                                client.post(config.environment.weburl + "/onboarding/save_schedule_posp_user_data?ss_id=" + update_ss_id, posp_user_update_args, function (posp_user_data, posp_user_response) {
                                                    if (posp_user_data && posp_user_data.Status === "SUCCESS" && posp_user_data.Data && posp_user_data.Data.Training_Status === "Started" && ["", null, "NA"].indexOf(posp_user_data.Data.Erp_Id) > -1) {
                                                        try {
                                                            client.get(config.environment.weburl + "/onboarding/update_training_histories?Send_Mail=No&Status=Started&Ss_Id=" + update_ss_id, {}, function (update_training_histories_data, update_training_histories_response) {

                                                            });
                                                        } catch (e) {
                                                            console.error("Error in schedule_posp_user_data training log update service");
                                                        }
                                                        //save documents
                                                        try {
                                                            client.get(config.environment.weburl + "/onboarding/save_document?ss_id=" + ss_id, {}, function (save_doc_data, save_doc_response) {

                                                            });
                                                        } catch (e) {
                                                            console.error("Error in save_document service");
                                                        }
                                                        res.json({"Status": "SUCCESS", "Msg": "POSP SYNC SUCCESSFULLY"});
                                                    } else {
                                                        res.json({"Status": "SUCCESS", "Msg": "POSP SYNC SUCCESSFULLY"});
                                                    }
                                                });
                                            } catch (e) {
                                                console.error('/onboarding/schedule_posp_user_data', e.stack);
                                            }
                                        });
                                    } else {
                                        res.send({"Status": "FAIL", "Msg": "NO DATA AVAILABLE IN POSP"});
                                    }
                                }
                            });
                        }
                    }
                });
            } else {
                res.send({"Status": "FAIL", "Msg": "SEARCH CRITERIA NOT AVAILABLE"});
            }
        } catch (e) {
            res.json({"Status": "FAIL", "Msg": e.stack});
        }
    });
    app.get("/onboarding/schedule_posp_user_data", function (req, res) {
        try {
            let ss_id = req.query.ss_id ? req.query.ss_id - 0 : "";
            let is_sync = req.query.sync ? req.query.sync : "No";
            let find_query = [];
            let is_allow = false;
            if (is_sync === "yes") {
                is_allow = true;
                find_query = [
                    {$match: {$and: [
                                {"Ss_Id": ss_id}
                            ]
                        }}];
            } else if (ss_id) {
                is_allow = true;
                find_query = [
                    {$match: {$and: [
                                {"Created_On": {$lt: new Date("2023-08-25T00:00:00.000Z")}}, // Before 29 Aug Records
                                {"Ss_Id": ss_id}
                            ]
                        }}];
            }
            if (is_allow) {
                posp_user.find({'Ss_Id': ss_id}, function (posps_user_db_err, posps_user_db_data) {
                    if (posps_user_db_err) {
                        res.send({"Status": "FAIL", "Msg": "ERROR IN FIND POSP USER", "Data": posps_user_db_err});
                    } else {
                        if (posps_user_db_data && posps_user_db_data.length > 0) {
                            res.send({"Status": "SUCCESS", "Msg": "USER AVAILABLE IN POSP USER", "Data": posps_user_db_data});
                        } else {
                            var Posp = require('../models/posp');
                            console.error('find_query', JSON.stringify(find_query));
                            Posp.aggregate(find_query, function (posps_db_err, posps_db_data) {
                                if (posps_db_err) {
                                    res.send({"Status": "FAIL", "Msg": "NO RECORD AVAILABE", "Data": posps_db_err});
                                } else {
                                    let posps_db_response = posps_db_data;
                                    if (posps_db_response && posps_db_response.length > 0) {
                                        let posp = JSON.parse(JSON.stringify(posps_db_response));
                                        let filter_data = posp;
                                        filter_data.forEach(obj1 => {
                                            for (const key in obj1) {
                                                try {
                                                    if (key === "Erp_Id" && obj1[key]) {
                                                        obj1['Last_Status'] = "18";
                                                        obj1['Erp_Status'] = "SUCCESS";
                                                        obj1['Erp_Msg'] = "ERP CODE GENENERATED SUCCESSFULLY :: " + obj1[key];
                                                        obj1["Is_Training_Completed"] = "Yes";
                                                        obj1["Training_Status"] = "Completed";
                                                        obj1["Remaining_Hours"] = "00:00:00";
                                                        obj1["Completed_Hours"] = "30:00:00";
                                                        obj1["Onboarding_Status"] = "Exam_Completed";
                                                    }
                                                    if (key === "Mobile_No" && obj1[key]) {
                                                        obj1["Mobile_Number"] = obj1[key];
                                                    }
                                                    if (key === "Is_Contact_Sync") {
                                                        obj1['Is_Contact_Sync'] = obj1[key] ? obj1[key].toString() : "";
                                                    }
                                                    if (key === "IsFOS") {
                                                        obj1['IsFOS'] = ((obj1[key] - 0) === 1) ? true : false;
                                                    }
                                                    if (key === "Is_IIB") {
                                                        obj1['POSP_UploadedtoIIB'] = ((obj1[key] - 0) === 1) ? "Yes" : "No";
                                                    }
                                                    if (key === "POSP_UploadingDateAtIIB" && obj1[key]) {
                                                        obj1['POSP_UploadingDateAtIIB'] = obj1[key];
                                                        obj1["Is_Doc_Approved"] = "Yes";
                                                        obj1["Is_IIB_Uploaded"] = "Yes";
                                                        obj1["Is_Doc_Verified"] = "Yes";
                                                        obj1["Is_Document_Uploaded"] = "Yes";
                                                    }
                                                    if (key === "Is_DeActivation") {
                                                        obj1['POSP_DeActivatedtoIIB'] = ((obj1[key] - 0) === 1) ? "Yes" : "No";
                                                    }
                                                    if (key === "DeActivation_On" && obj1[key]) {
                                                        obj1['POSP_DeActivatedDateAtIIB'] = obj1[key];
                                                    }
                                                    if (key === "Is_Paid") {
                                                        obj1['Payment_Status'] = ((obj1[key] - 0) === 1) ? "Success" : "Pending";
                                                        obj1["RegAmount"] = 999;
                                                    }
                                                    if (key === "Is_Certified") {
                                                        obj1['Is_Certificate_Generated'] = ((obj1[key] - 0) === 1) ? "Yes" : "No";
                                                    }
                                                    if (key === "Is_Exam") {
                                                        obj1['Exam_Status'] = ((obj1[key] - 0) === 1) ? "Completed" : "";
                                                        obj1['Is_Certificate_Generated'] = obj1['Exam_Status'] === "Completed" ? "Yes" : "No";
                                                    }
                                                    if (key === "TrainingStartDate" && obj1[key]) {
                                                        obj1["Training_Start_Date"] = obj1[key];
                                                        obj1["Training_Scheduled_On"] = obj1["Training_Start_Date"];
                                                    }
                                                    if (key === "TrainingEndDate" && obj1[key]) {
                                                        obj1["Training_End_Date"] = obj1[key];
                                                    }
                                                    obj1["User_Id"] = obj1.Ss_Id;
                                                    if (obj1.hasOwnProperty('_id')) {
                                                        delete obj1[key];
                                                    }
                                                } catch (e) {
                                                    console.error('/onboarding/schedule_posp_user_data', e.stack);
                                                }
                                            }
                                        });
                                        filter_data.forEach(function (posp_loop, i) {
                                            let posp_loop_data = "";
                                            posp_loop_data = posp_loop;
                                            if (posp_loop.Training_Start_Date && ([null, ""].indexOf(posp_loop.Training_End_Date) > -1)) {
                                                posp_loop_data['Training_Status'] = "Started";
                                                posp_loop_data['Remaining_Hours'] = "30:00:00";
                                                posp_loop_data['Completed_Hours'] = "00:00:00";
                                            }
                                            if (posp_loop.Training_Start_Date && posp_loop.Training_End_Date) {
                                                if (posp_loop.Erp_Id) {
                                                    posp_loop_data['Training_Status'] = "Completed";
                                                    posp_loop_data['Remaining_Hours'] = "00:00:00";
                                                    posp_loop_data['Completed_Hours'] = "30:00:00";
                                                    posp_loop_data['Is_Training_Completed'] = "Yes";
                                                } else {
                                                    posp_loop_data['Training_Status'] = "Started";
                                                    posp_loop_data['Remaining_Hours'] = "30:00:00";
                                                    posp_loop_data['Completed_Hours'] = "00:00:00";
                                                }
                                            }
                                            let update_ss_id = posp_loop_data.Ss_Id;
                                            try {
                                                let posp_user_update_args = {
                                                    data: posp_loop_data,
                                                    headers: {
                                                        "Content-Type": "application/json"
                                                    }
                                                };
                                                client.post(config.environment.weburl + "/onboarding/save_schedule_posp_user_data?ss_id=" + update_ss_id, posp_user_update_args, function (posp_user_data, posp_user_response) {
                                                    if (posp_user_data && posp_user_data.Status === "SUCCESS" && posp_user_data.Data) {
                                                        if (posp_user_data.Data.Erp_Id && ["", null, "NA"].indexOf(posp_user_data.Data.Erp_Id) === -1) {
                                                            try {
                                                                client.get(config.environment.weburl + "/onboarding/save_document?ss_id=" + ss_id, {}, function (save_doc_data, save_doc_response) {
                                                                });
                                                            } catch (e) {
                                                                console.error("Error in save_document service");
                                                            }
                                                        } else if (posp_user_data.Data.POSP_UploadingDateAtIIB) {
                                                            try {
                                                                client.get(config.environment.weburl + "/onboarding/sync_documents?ss_id=" + ss_id + "&status=IIBP", {}, function (save_doc_data, save_doc_response) {
                                                                });
                                                            } catch (e) {
                                                                console.error("Error in sync_document service");
                                                            }
                                                        }
                                                        if (posp_user_data.Data.Training_Status === "Started" && ["", null, "NA"].indexOf(posp_user_data.Data.Erp_Id) > -1) {
                                                            try {
                                                                client.get(config.environment.weburl + "/onboarding/update_training_histories?Send_Mail=No&Status=Started&Ss_Id=" + update_ss_id, {}, function (update_training_histories_data, update_training_histories_response) {
                                                                });
                                                            } catch (e) {
                                                                console.error("Error in schedule_posp_user_data training log update service");
                                                            }
                                                        }
                                                        res.json({"Status": "SUCCESS", "Msg": "POSP SYNC SUCCESSFULLY"});
                                                    } else {
                                                        res.json({"Status": "SUCCESS", "Msg": "POSP SYNC SUCCESSFULLY"});
                                                    }
                                                });
                                            } catch (e) {
                                                console.error('/onboarding/schedule_posp_user_data', e.stack);
                                            }
                                        });
                                    } else {
                                        res.send({"Status": "FAIL", "Msg": "NO DATA AVAILABLE IN POSP"});
                                    }
                                }
                            });
                        }
                    }
                });
            } else {
                res.send({"Status": "FAIL", "Msg": "SEARCH CRITERIA NOT AVAILABLE"});
            }
        } catch (e) {
            res.json({"Status": "FAIL", "Msg": e.stack});
        }
    });
    app.post('/onboarding/save_schedule_posp_user_data', function (req, res) {
        try {
            req.body = JSON.parse(JSON.stringify(req.body));
            let objRequest = req.body;
            let objQuery = req.query;
            let ss_id = objQuery.ss_id ? objQuery.ss_id - 0 : "";
            if (ss_id && Object.keys(objRequest).length > 0) {
                let find_obj = {Ss_Id: ss_id};
                let save_obj = objRequest;
                posp_user.find(find_obj, function (posps_user_db_err, posps_user_db_data) {
                    if (posps_user_db_err) {
                        res.send({"Status": "FAIL", "Msg": "DATABASE ERROR", "Data": posps_user_db_err});
                    } else {
                        if (posps_user_db_data && posps_user_db_data.length > 0) {
                            res.send({"Status": "SUCCESS", "Msg": "USER AVAILABLE IN POSP USER", "Data": posps_user_db_data});
                        } else {
                            let posp_userobj = new posp_user(save_obj);
                            posp_userobj.save(function (posp_userobj_err, posp_userobj_res) {
                                if (posp_userobj_err) {
                                    res.json({"Status": "FAIL", "Msg": "DATABASE ERROR", "Data": posp_userobj_err});
                                } else {
                                    res.json({"Status": "SUCCESS", "Msg": "DATA INSERT SUCCESSFULLY", "Data": posp_userobj_res});
                                }
                            });
                        }
                    }
                });
            } else {
                let msg = (ss_id ? (Object.keys(objRequest).length > 0 ? objRequest : "NO DATA AVAILABLE TO SAVE") : "SS_ID IS MANDATORY");
                res.send({"Status": "FAIL", "Msg": msg});
            }
        } catch (e) {
            res.send({"Status": "FAIL", "Msg": e.stack});
        }
    });
	app.post('/onboarding/upload_onboarding_documents', (req, res) => {
        try {
            let form = new formidable.IncomingForm();
            let posp_obj = {}, posp_doc_log_obj = {};
            let User_Id = 0, uploaded_len = 0;
            let doc_uploaded = "";
            let aadhar_type = "Front";
            let doc_log_update_obj = {};
            let file_prefix = "", posp_email = "", nominee_relation = "";
            //aadhar_remove_27032024 let posp_doc_name_obj = {"AADHAAR": "AadharCard_Front", "PAN": "PanCard", "QUALIFICATION": "Educational_Certificate", "POSP_ACC_DOC": "POSP_Cancel_Cheque", "NOMINEE_PAN_DOC": "Nominee_Pan_Card", "NOMINEE_ACC_DOC": "Nominee_Cancel_Cheque", "PROFILE": "Profile_Photo", "OTHER": "Certificate"};
            let posp_doc_name_obj = {"PAN": "PanCard", "QUALIFICATION": "Educational_Certificate", "POSP_ACC_DOC": "POSP_Cancel_Cheque", "NOMINEE_PAN_DOC": "Nominee_Pan_Card", "NOMINEE_ACC_DOC": "Nominee_Cancel_Cheque", "PROFILE": "Profile_Photo", "OTHER": "Certificate"};
            let doc_fields = {"PAN": ["Pan_No", "Name_On_PAN", "DOB_On_PAN", "Present_City", "Present_State", "Permanant_City", "Permanant_State", "Present_Add1", "Permanant_Add1", "Present_Pincode", "Permanant_Pincode"],"QUALIFICATION":["Education"], "AADHAAR": ["Aadhar", "Name_On_Aadhar", "Present_City", "Present_State", "Permanant_City", "Permanant_State", "Present_Add1", "Permanant_Add1", "Present_Pincode", "Permanant_Pincode"], "POSP_ACC_DOC": ["Bank_Account_No", "Account_Type", "Micr_Code", "Ifsc_Code", "Bank_City", "Bank_Name", "Bank_Branch", "Name_as_in_Bank"], "NOMINEE_ACC_DOC": ["Nominee_Bank_Account_Number", "Nominee_Bank_City", "Nominee_Account_Type", "Nominee_Bank_Branch", "Nominee_Bank_Name", "Nominee_Ifsc_Code", "Nominee_Micr_Code", "Nominee_Name_as_in_Bank"], "NOMINEE_PAN_DOC": ["Nominee_Pan", "Nominee_Name_On_Pan", "Nominee_DOB_On_Pan"]};
            let basic_fields = ["Email_Id", "Gender", "Father_Name", "Nominee_Relationship"];
            //aadhar_remove_27032024 let file_name_prefix = {"PAN": "PanCard_", "AADHAAR": "AadharCard_", "QUALIFICATION": "QualificationCertificate_", "POSP_ACC_DOC": "Posp_Bank_Account_", "NOMINEE_ACC_DOC": "Nominee_Bank_Account_", "PROFILE": "Profile_", "NOMINEE_PAN_DOC": "Nominee_Pan_Card_", "OTHER": "Certificate_"};
            let file_name_prefix = {"PAN": "PanCard_", "QUALIFICATION": "QualificationCertificate_", "POSP_ACC_DOC": "Posp_Bank_Account_", "NOMINEE_ACC_DOC": "Nominee_Bank_Account_", "PROFILE": "Profile_", "NOMINEE_PAN_DOC": "Nominee_Pan_Card_", "OTHER": "Certificate_"};
            //aadhar_remove_27032024 let mandate_doc_arr = ["PROFILE", "PAN", "AADHAAR", "QUALIFICATION", "POSP_ACC_DOC", "OTHER"];
            let mandate_doc_arr = ["PROFILE", "PAN", "QUALIFICATION", "POSP_ACC_DOC", "OTHER"];
            form.parse(req, function (err, fields, files) {
                let objRequest = fields;
                User_Id = objRequest.User_Id ? objRequest.User_Id : "";
                if (User_Id) {
                    basic_fields.forEach((item) => {
                        objRequest.hasOwnProperty(item) ? posp_obj[item] = objRequest[item] : '';
                    });
                    let current_doc = doc_fields[objRequest["DocType"]];
                    if (current_doc) {
                        current_doc.forEach((currentVal) => {
                            if (currentVal === "DOB_On_PAN") {
                                let pan_dob_date = "";
                                if (objRequest.DOB_On_PAN) {
                                    if (objRequest.DOB_On_PAN && moment(objRequest.DOB_On_PAN, 'YYYY-MM-DD', true).isValid()) {
                                        pan_dob_date = objRequest.DOB_On_PAN;
                                    } else if (objRequest.DOB_On_PAN && moment(objRequest.DOB_On_PAN, 'DD-MM-YYYY', true).isValid()) {
                                        pan_dob_date = moment(objRequest.DOB_On_PAN, 'DD-MM-YYYY').format("YYYY-MM-DD");
                                    } else if (objRequest.DOB_On_PAN && moment(objRequest.DOB_On_PAN, 'DD/MM/YYYY', true).isValid()) {
                                        pan_dob_date = moment(objRequest.DOB_On_PAN, 'DD/MM/YYYY').format("YYYY-MM-DD");
                                    }
                                }
                                posp_obj["DOB_On_PAN"] = pan_dob_date;
                                posp_obj["Birthdate"] = pan_dob_date;
                            } else {
                                objRequest.hasOwnProperty(currentVal) ? posp_obj[currentVal] = objRequest[currentVal] : '';
                            }
                        });
                        if (objRequest["DocType"] === "PAN" || objRequest["DocType"] === "NOMINEE_PAN_DOC") {
                            let panType = objRequest["DocType"] === "PAN" ? "Name_On_PAN" : "Nominee_Name_On_Pan";
                            let nameOnPan = (objRequest[panType] !== "" && objRequest[panType] !== undefined && objRequest[panType] !== null) ? (objRequest[panType]).trim() : "";
                            let namesArr = nameOnPan ? nameOnPan.split(" ") : [];
                            if (namesArr.length > 0) {
                                let middle_name = first_name = last_name = "";
                                for (var i = 2; i < namesArr.length; i++) {
                                    middle_name += " " + namesArr[i - 1];
                                }
                                first_name = nameOnPan.split(' ')[0];
                                last_name = namesArr.length == 1 ? "" : namesArr[namesArr.length - 1];
                                objRequest["DocType"] === "PAN" ? posp_obj["Name_On_PAN"] = nameOnPan : posp_obj["Nominee_Name_On_Pan"] = nameOnPan;
                                objRequest["DocType"] === "PAN" ? posp_obj["First_Name"] = first_name.trim() : posp_obj["Nominee_First_Name"] = first_name.trim();
                                objRequest["DocType"] === "PAN" ? posp_obj["Middle_Name"] = middle_name.trim() : posp_obj["Nominee_Middle_Name"] = middle_name.trim();
                                objRequest["DocType"] === "PAN" ? posp_obj["Last_Name"] = last_name.trim() : posp_obj["Nominee_Last_Name"] = last_name.trim();

                            }

                        }
                    }
                    file_prefix = file_name_prefix[objRequest.DocType] + User_Id;
                   
                    var files = files;
                    posp_user.find({'User_Id': User_Id}, function (posp_find_err, posp_find_res) {
                        if (posp_find_err)
                            res.json({"Status": "FAIL", "Msg": posp_find_err});
                        if ((posp_find_res && posp_find_res.length > 0) || objRequest["Email_Id"] || objRequest["Nominee_Relationship"]) {
                            let posp_user_details = posp_find_res[0]._doc;
                            posp_email = posp_user_details.Email_Id;
                            nominee_relation = posp_user_details.Nominee_Relationship;
                            doc_uploaded = posp_user_details.Is_Document_Uploaded;
                            //posp_email ? uploaded_len++ : "";
                            //nominee_relation ? uploaded_len++ : "";
                            //Live profile 
                            if (objRequest.hasOwnProperty('Profile_Live_Photo')) {
                                var path = appRoot + "/tmp/onboarding_docs/";
                                var photo_file_name = "", Field_Name = "";
                                if (objRequest.hasOwnProperty('Profile_Live_Photo')) {
                                    photo_file_name = "Profile_" + User_Id + '.png';
                                    Field_Name = "Profile_Live_Photo";
                                }
                                var img1 = decodeURIComponent(objRequest[Field_Name]);
                                if (!fs.existsSync(appRoot + "/tmp/onboarding_docs/" + User_Id)) {
                                    fs.mkdirSync(appRoot + "/tmp/onboarding_docs/" + User_Id);
                                }
                                var data = img1.replace(/^data:image\/\w+;base64,/, "");
                                if (data === "") {
                                    res.json({'Status': "Fail", 'Msg': err});
                                } else {
                                    var buf = new Buffer(data, 'base64');
                                    fs.writeFile(path + User_Id + '/' + photo_file_name, buf);
                                }
                                var pdf_web_path_horizon = config.environment.downloadurl + "/onboarding/download/onboarding_docs/" + User_Id + "/" + photo_file_name;
                                posp_doc_log_obj['Doc_URL'] = pdf_web_path_horizon;
                                posp_doc_log_obj['Modified_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                posp_doc_log_obj['Status'] = "Pending";
                                posp_obj['Modified_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                doc_log_update_obj[objRequest["DocType"]] = posp_doc_log_obj;
                            }
                            try {
                                if (objRequest.hasOwnProperty("AadharCard_Front") && objRequest.hasOwnProperty("AadharCard_Back") && false) {//aadhar_remove_27032024
                                    let front_file_name = objRequest["AadharCard_Front"];
                                    let front_file_sys_loc_horizon = appRoot + "/tmp/onboarding_docs/" + User_Id + "/" + front_file_name;
                                    let front_file_web_path_horizon = config.environment.downloadurl + "/onboarding/download/onboarding_docs/" + User_Id + "/" + front_file_name;
                                    doc_log_update_obj["AADHAAR"] = {
                                        "Status": "Pending",
                                        "Doc_URL": front_file_web_path_horizon,
                                        "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                                    };

                                    let back_file_name = objRequest["AadharCard_Back"];
                                    let back_file_sys_loc_horizon = appRoot + "/tmp/onboarding_docs/" + User_Id + "/" + back_file_name;
                                    let back_file_web_path_horizon = config.environment.downloadurl + "/onboarding/download/onboarding_docs/" + User_Id + "/" + back_file_name;
                                    doc_log_update_obj["AadharCard_Back"] = {
                                        "Status": "Pending",
                                        "Doc_URL": back_file_web_path_horizon,
                                        "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                                    };

                                }
                                if (!["AadharCard_Front", "AadharCard_Back"].includes(posp_doc_name_obj[objRequest.DocType]) && objRequest.hasOwnProperty(posp_doc_name_obj[objRequest.DocType])) {
                                    console.error("POSP Profile Image LINE1 desktop2");
                                    let file_name = objRequest[posp_doc_name_obj[objRequest.DocType]];
                                    let file_ext = file_name.split('.')[1];

                                    let file_sys_loc_horizon = appRoot + "/tmp/onboarding_docs/" + User_Id + "/" + file_name;
                                    let file_web_path_horizon = config.environment.downloadurl + "/onboarding/download/onboarding_docs/" + User_Id + "/" + file_name;

                                    posp_doc_log_obj['Modified_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                    posp_doc_log_obj['Status'] = "Pending";
                                    posp_obj['Modified_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                    if (aadhar_type === "AadharBack") {
                                        doc_log_update_obj["AadharCard_Back"] = {
                                            "Status": "Pending",
                                            "Doc_URL": file_web_path_horizon,
                                            "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                                        };
                                    } else {
                                        doc_log_update_obj[objRequest["DocType"]] = {
                                            "Status": "Pending",
                                            "Doc_URL": file_web_path_horizon,
                                            "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                                        };
                                    }
                                }
                            } catch (e) {
                                console.error("POSP Profile Image LINE1 desktop3545");
                            }
//                            if (objRequest.hasOwnProperty(posp_doc_name_obj[objRequest.DocType])) {
//                                let file_name = objRequest[posp_doc_name_obj[objRequest.DocType]];
//                                let file_sys_loc_horizon = appRoot + "/tmp/onboarding_docs/" + User_Id + "/" + file_name;
//                                let file_web_path_horizon = config.environment.downloadurl + "/onboarding/download/onboarding_docs/" + User_Id + "/" + file_name;
//                                posp_doc_log_obj['Doc_URL'] = file_web_path_horizon;
//                            }
                            //Start Upload File

                            if (JSON.stringify(files) !== "{}") {
                                if (!fs.existsSync(appRoot + "/tmp/onboarding_docs/" + User_Id)) {
                                    fs.mkdirSync(appRoot + "/tmp/onboarding_docs/" + User_Id);
                                }
                                console.error("POSP Profile Image LINE1 desktop5");
                                for (let i in files) {
                                    console.error("POSP Profile Image LINE1 desktop5");
                                    let name_arr = files[i].name.split('.');
                                    let old_file = files[i].name.replace(/\s/g, '');
                                    if (i === "AadharCard_Back") {
                                        file_prefix = "AadharCardBack_" + User_Id;
                                        aadhar_type = "AadharBack";
                                    }
                                    file_name = file_prefix + '.' + name_arr[name_arr.length - 1];
                                    let file_ext = name_arr[name_arr.length - 1];
                                    let file_sys_loc_horizon = appRoot + "/tmp/onboarding_docs/" + User_Id + "/" + file_name;
                                    let file_web_path_horizon = config.environment.downloadurl + "/onboarding/download/onboarding_docs/" + User_Id + "/" + file_name;
                                    console.error("POSP Profile Image LINE1 desktop6");

                                    let oldpath = files[i].path;
                                    //let old_file_path = appRoot + "/tmp/onboarding_docs/" + User_Id + "/" + old_file;
                                    let read_data = fs.readFileSync(oldpath, {});
                                    fs.writeFileSync(file_sys_loc_horizon, read_data, {});
                                    fs.unlink(oldpath, function (err) {
                                        if (err)
                                            res.json({'Status': "Fail", 'Msg': "Error in deleting a file", "data": err});
                                    });
                                    /*if (fs.existsSync(old_file_path)) {
                                        console.error("old file", old_file_path);
                                        fs.unlink(old_file_path, function (err) {
                                            if (err)
                                                res.json({'Status': "Fail", 'Msg': "Error in deleting a file", "data": err});
                                        });
                                    }*/
                                    posp_doc_log_obj['Modified_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                    posp_doc_log_obj['Status'] = "Pending";
                                    posp_obj['Modified_On'] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                    if (aadhar_type === "AadharBack") {
                                        doc_log_update_obj["AadharCard_Back"] = {
                                            "Status": "Pending",
                                            "Doc_URL": file_web_path_horizon,
                                            "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                                        };
                                    } else {
                                        doc_log_update_obj[objRequest["DocType"]] = {
                                            "Status": "Pending",
                                            "Doc_URL": file_web_path_horizon,
                                            "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                                        };
                                    }
                                }
                            }

                            if (objRequest["Email_Id"] || objRequest["Nominee_Relationship"]) {
                                posp_doc_log_obj = {};
                            } else {
                                if (objRequest["DocType"] === "AADHAAR") {
                                    posp_doc_log_obj = doc_log_update_obj["AADHAAR"];
                                } else {
                                    posp_doc_log_obj = doc_log_update_obj[objRequest["DocType"]] || {};
                                }
                            }
                            posp_doc_log.update({"User_Id": User_Id, "Doc_Type": objRequest["DocType"]}, {$set: posp_doc_log_obj}, function (update_posp_doc_log_err, update_posp_doc_log_res) {
                                if (update_posp_doc_log_err) {
                                    res.json({"Status": "FAIL", "Msg": update_posp_doc_log_err});
                                } else {
                                    if (objRequest["DocType"] === "AADHAAR" && false) {//aadhar_remove_27032024
                                        posp_doc_log_obj = doc_log_update_obj["AadharCard_Back"] ? doc_log_update_obj["AadharCard_Back"] : {};
                                        posp_doc_log.update({"User_Id": User_Id, "Doc_Type": "AADHAAR_BACK"}, {$set: posp_doc_log_obj}, function (update_posp_doc_log_err, update_posp_doc_log_res) {
                                            if (update_posp_doc_log_err) {
                                                res.json({"Status": "FAIL", "Msg": update_posp_doc_log_err});
                                            } else {
                                                posp_doc_log.find({"User_Id": User_Id}, function (posp_log_err, posp_log_res) {
                                                    if (posp_log_err) {
                                                        res.json({"Status": "Fail", "Msg": posp_log_err});
                                                    } else {
                                                        if (posp_log_res.length > 0) {
                                                            let match_mandate_doc_arr = [];
                                                            for (let i = 0; i < posp_log_res.length; i++) {
                                                                //let current_doc_log = posp_log_res[i]._doc;
                                                                //["Verified", "Approved", "Pending"].includes(current_doc_log["Status"]) ? uploaded_len++ : uploaded_len;
                                                                let current_doc_log = posp_log_res[i]._doc;
                                                                if (current_doc_log.Doc_URL && (current_doc_log.Doc_Type && mandate_doc_arr.indexOf(current_doc_log.Doc_Type) > -1) && (current_doc_log.Status && ["Verified", "Approved", "Pending"].includes(current_doc_log.Status))) {
                                                                    match_mandate_doc_arr.push(current_doc_log.Doc_Type);
                                                                }
                                                            }
                                                            let is_doc_uploaded = "No";
                                                            //([7, 8, 9].indexOf(uploaded_len) > -1) ? (is_doc_uploaded = "Yes") : "";
                                                            //aadhar_remove_27032024 [5, 6]
                                                            if ([4,5].indexOf(match_mandate_doc_arr.length) > -1) {
                                                                is_doc_uploaded = "Yes";
                                                            }
                                                            posp_obj["Is_Document_Uploaded"] = is_doc_uploaded;
                                                            if (is_doc_uploaded === "Yes") {
                                                                posp_obj["Last_Status"] = "Doc_Uploaded";
                                                                posp_obj["Onboarding_Status"] = "Doc_Uploaded";
                                                                posp_obj["Documents_Uploaded_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                                                posp_obj["Is_Document_Rejected"] = "No";
                                                            }
                                                        } else {
                                                            if (!objRequest["Email_Id"] && !objRequest["Nominee_Relationship"]) {
                                                                res.json({"Status": "FAIL", "Msg": "Document log not updated."});
                                                            }
                                                        }
                                                        posp_user.update({'User_Id': User_Id}, {$set: posp_obj}, function (update_posp_user_err, update_posp_user_res) {
                                                            if (update_posp_user_err) {
                                                                res.json({"Status": "FAIL", "Msg": update_posp_user_err});
                                                            } else {
                                                                if (doc_uploaded === "No" && posp_obj.hasOwnProperty("Is_Document_Uploaded") && posp_obj["Is_Document_Uploaded"] === "Yes") {
                                                                    try {
                                                                        client.get(config.environment.weburl + '/posps/report/email_consolidate_process?ss_id=' + User_Id + '&event_type=DOCUMENT_VERIFICATION_REQUEST', {}, function (mail_data, mail_res) {
                                                                            console.error('SEND_DOCUMENT_VERIFICATION_REQUEST_MAIL', 'Ss_Id: ' + User_Id);
                                                                        });
                                                                    } catch (ex) {
                                                                        console.error('EXCEPTION_IN_SEND_DOCUMENT_VERIFICATION_REQUEST_MAIL', 'Ss_Id: ' + User_Id, ex.stack);
                                                                    }
                                                                    try {
                                                                        client.get(config.environment.weburl + '/posps/report/email_consolidate_process?ss_id=' + User_Id + '&event_type=DOCUMENT_UPLOADED', {}, function (mail_data, mail_res) {
                                                                            console.error('SEND_DOCUMENT_UPLOADED_MAIL', 'Ss_Id: ' + User_Id);
                                                                        });
                                                                    } catch (ex) {
                                                                        console.error('EXCEPTION_IN_SEND_DOCUMENT_UPLOADED_MAIL', 'Ss_Id: ' + User_Id, ex.stack);
                                                                    }
                                                                }

                                                                res.json({"Status": "Success", "Msg": "Document uploaded successfully."});

                                                            }
                                                        });
                                                    }
                                                });

                                            }
                                        });
                                    } else {
                                        posp_doc_log.find({"User_Id": User_Id}, function (posp_log_err, posp_log_res) {
                                            if (posp_log_err) {
                                                res.json({"Status": "Fail", "Msg": posp_log_err});
                                            } else {
                                                if (posp_log_res.length > 0) {
                                                    let match_mandate_doc_arr = [];
                                                    for (let i = 0; i < posp_log_res.length; i++) {
                                                        //let current_doc_log = posp_log_res[i]._doc;
                                                        //["Verified", "Approved", "Pending"].includes(current_doc_log["Status"]) ? uploaded_len++ : uploaded_len;
                                                        let current_doc_log = posp_log_res[i]._doc;
                                                        if (current_doc_log.Doc_URL && (current_doc_log.Doc_Type && mandate_doc_arr.indexOf(current_doc_log.Doc_Type) > -1) && (current_doc_log.Status && ["Verified", "Approved", "Pending"].includes(current_doc_log.Status))) {
                                                            match_mandate_doc_arr.push(current_doc_log.Doc_Type);
                                                        }
                                                    }
                                                    let is_doc_uploaded = "No";
                                                    //([7, 8, 9].indexOf(uploaded_len) > -1) ? (is_doc_uploaded = "Yes") : "";
                                                    //aadhar_remove_27032024 [5, 6]
                                                    if ([4,5].indexOf(match_mandate_doc_arr.length) > -1) {
                                                        is_doc_uploaded = "Yes";
                                                    }
                                                    posp_obj["Is_Document_Uploaded"] = is_doc_uploaded;
                                                    if (is_doc_uploaded === "Yes") {
                                                        posp_obj["Last_Status"] = "Doc_Uploaded";
                                                        posp_obj["Onboarding_Status"] = "Doc_Uploaded";
                                                        posp_obj["Documents_Uploaded_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                                        posp_obj["Is_Document_Rejected"] = "No";
                                                    }
                                                } else {
                                                    if (!objRequest["Email_Id"] && !objRequest["Nominee_Relationship"]) {
                                                        res.json({"Status": "FAIL", "Msg": "Document log not updated."});
                                                    }
                                                }
                                                posp_user.update({'User_Id': User_Id}, {$set: posp_obj}, function (update_posp_user_err, update_posp_user_res) {
                                                    if (update_posp_user_err) {
                                                        res.json({"Status": "FAIL", "Msg": update_posp_user_err});
                                                    } else {
                                                        if (doc_uploaded === "No" && posp_obj.hasOwnProperty("Is_Document_Uploaded") && posp_obj["Is_Document_Uploaded"] === "Yes") {
                                                            try {
                                                                client.get(config.environment.weburl + '/posps/report/email_consolidate_process?ss_id=' + User_Id + '&event_type=DOCUMENT_VERIFICATION_REQUEST', {}, function (mail_data, mail_res) {
                                                                    console.error('SEND_DOCUMENT_VERIFICATION_REQUEST_MAIL', 'Ss_Id: ' + User_Id);
                                                                });
                                                            } catch (ex) {
                                                                console.error('EXCEPTION_IN_SEND_DOCUMENT_VERIFICATION_REQUEST_MAIL', 'Ss_Id: ' + User_Id, ex.stack);
                                                            }
                                                            try {
                                                                client.get(config.environment.weburl + '/posps/report/email_consolidate_process?ss_id=' + User_Id + '&event_type=DOCUMENT_UPLOADED', {}, function (mail_data, mail_res) {
                                                                    console.error('SEND_DOCUMENT_UPLOADED_MAIL', 'Ss_Id: ' + User_Id);
                                                                });
                                                            } catch (ex) {
                                                                console.error('EXCEPTION_IN_SEND_DOCUMENT_UPLOADED_MAIL', 'Ss_Id: ' + User_Id, ex.stack);
                                                            }
                                                        }
                                                        res.json({"Status": "Success", "Msg": "Document uploaded successfully."});

                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            });

                        } else {
                            res.json({"Status": "FAIL", "Msg": "Document log doesn't exist."});
                        }
                    });
                } else {
                    res.json({"Status": "FAIL", "Msg": "User doesn't exist."});
                }
            });
        } catch (ex) {
            res.json({"Status": "FAIL", "Msg": "Exception in Upload_Onboarding_Documents", "Error": ex.stack});
        }
    });
    
   app.post('/onboarding/update_posp_user_test', function (req, res) {
        try {
            let body = req.body ? req.body : '';
            let user_id = body.User_Id ? body.User_Id : '';
            let posp_user_args = {};
            for (let key in body) {
                posp_user_args[key] = body[key] && body[key] !== undefined ? body[key] : "";
            }
            delete posp_user_args["User_Id"];
            if (user_id) {
                posp_user.find({"User_Id": user_id}, function (err, dbresult) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        if (dbresult && dbresult.length > 0) {
                            let posp_user_data = dbresult[0]._doc;
                            if (posp_user_args["Nominee_Relationship"] && posp_user_args.Nominee_Relationship === "Self") {
                                posp_user_args["Nominee_Pan"] = posp_user_data.Pan_No ? posp_user_data.Pan_No : "";
                                posp_user_args["Nominee_DOB_On_Pan"] = posp_user_data.DOB_On_PAN ? posp_user_data.DOB_On_PAN : "";
                                posp_user_args["Nominee_Name_On_Pan"] = posp_user_data.Name_On_PAN ? posp_user_data.Name_On_PAN : "";
                                posp_user_args["Nominee_First_Name"] = posp_user_data.First_Name ? posp_user_data.First_Name : "";
                                posp_user_args["Nominee_Middle_Name"] = posp_user_data.Middle_Name ? posp_user_data.Middle_Name : "";
                                posp_user_args["Nominee_Last_Name"] = posp_user_data.Last_Name ? posp_user_data.Last_Name : "";
                                posp_user_args["Nominee_Gender"] = posp_user_data.Gender ? posp_user_data.Gender : "";
                                posp_user_args["Nominee_Aadhar"] = posp_user_data.Aadhar ? posp_user_data.Aadhar : "";
                                posp_user_args["Nominee_Bank_Account_Number"] = posp_user_data.Bank_Account_No ? posp_user_data.Bank_Account_No : "";
                                posp_user_args["Nominee_Ifsc_Code"] = posp_user_data.Ifsc_Code ? posp_user_data.Ifsc_Code : "";
                                posp_user_args["Nominee_Micr_Code"] = posp_user_data.Micr_Code ? posp_user_data.Micr_Code : "";
                                posp_user_args["Nominee_Name_as_in_Bank"] = posp_user_data.Name_as_in_Bank ? posp_user_data.Name_as_in_Bank : "";
                                posp_user_args["Nominee_Bank_Branch"] = posp_user_data.Bank_Branch ? posp_user_data.Bank_Branch : "";
                                posp_user_args["Nominee_Bank_Name"] = posp_user_data.Bank_Name ? posp_user_data.Bank_Name : "";
                                posp_user_args["Nominee_Bank_City"] = posp_user_data.Bank_City ? posp_user_data.Bank_City : "";
//                                posp_user_args["Nominee_Relationship"] = "Self";
                            }

                            if (posp_user_args["Nominee_Name"] && posp_user_args.Nominee_Name) {
                                let nominee_name = (posp_user_args.Nominee_Name).trim();
                                let namesArr = nominee_name.split(" ");
                                if (namesArr.length > 0) {
                                    let middle_name = first_name = last_name = "";
                                    for (var i = 2; i < namesArr.length; i++) {
                                        middle_name += " " + namesArr[i - 1];
                                    }
                                    first_name = nominee_name.split(' ')[0];
                                    last_name = namesArr.length == 1 ? "" : namesArr[namesArr.length - 1];
                                    posp_user_args["Nominee_First_Name"] = first_name ? first_name.trim() : "";
                                    posp_user_args["Nominee_Middle_Name"] = middle_name ? middle_name.trim() : "";
                                    posp_user_args["Nominee_Last_Name"] = last_name ? last_name.trim() : "";

                                }
                            }
                            if (posp_user_args["Nominee_DOB_On_Pan"] && posp_user_args.Nominee_DOB_On_Pan) {
                                let nom_dob_date = "";
                                if (posp_user_args.Nominee_DOB_On_Pan && moment(posp_user_args.Nominee_DOB_On_Pan, 'YYYY-MM-DD', true).isValid()) {
                                    nom_dob_date = posp_user_args.Nominee_DOB_On_Pan;
                                } else if (posp_user_args.Nominee_DOB_On_Pan && moment(posp_user_args.Nominee_DOB_On_Pan, 'DD-MM-YYYY', true).isValid()) {
                                    nom_dob_date = moment(posp_user_args.Nominee_DOB_On_Pan, 'DD-MM-YYYY').format("YYYY-MM-DD");
                                } else if (posp_user_args.Nominee_DOB_On_Pan && moment(posp_user_args.Nominee_DOB_On_Pan, 'DD/MM/YYYY', true).isValid()) {
                                    nom_dob_date = moment(posp_user_args.Nominee_DOB_On_Pan, 'DD/MM/YYYY').format("YYYY-MM-DD");
                                }
                                posp_user_args["Nominee_DOB_On_Pan"] = nom_dob_date;
                            }
                            posp_user.update({'User_Id': user_id}, {$set: posp_user_args}, {runValidators: true}, function (err, numAffected) {
                                if (err) {
                                    res.json({"Status": "Fail", "Msg": err});
                                } else {
                                    res.json({"Status": "Success", "Msg": 'POSP details updated successfully'});
                                }
                            });
                        } else {
                            res.json({"Status": "Fail", "Msg": "User not found."});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "User_Id is missing."});
            }
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post("/onboarding/schedule_posp_user_data_update", function (req, res) {
        try {
            let posp_list = req.body.posp_list;
            let arr = posp_list.split(",");
            let success_count_data = 0;
            let fail_count_data = 0;
            for (var x = 0; x < arr.length; x++) {
                let user_id = arr[x];
                client.get(config.environment.weburl + "/onboarding/posp_user_data_update?ss_id=" + user_id, {}, function (schedule_posp_document_data, schedule_posp_document_data_response) {
                    if (schedule_posp_document_data.Status === "SUCCESS") {
                        success_count_data++;
                    } else {
                        fail_count_data++;
                    }
                });
                sleep(3000);
                if (x === (arr.length - 1)) {
                    res.send({'Status': "Success", "Msg": 'ERP Generated POSP Data & Document Save Successfully', "Success_Count": success_count_data, "Fail_Count": fail_count_data});
                }
            }
        } catch (e) {
            res.json({"Status": "FAIL", "Msg": e.stack});
        }
    });
    app.get("/onboarding/posp_user_data_update", function (req, res) {
        try {
            let ss_id = req.query.ss_id ? req.query.ss_id - 0 : "";
            if (ss_id) {
                client.get('http://horizon.policyboss.com:5000/posps/dsas/view/' + ss_id, {}, function (posp_res, posp_res_data) {
                    if (posp_res && posp_res.status === "SUCCESS" && posp_res.user_type && ["POSP"].includes(posp_res.user_type)) {
                        let org_posp_res = posp_res.POSP;
                        let posp_user_data = [];
                        posp_res.POSP_USER ? posp_user_data.push(posp_res.POSP_USER) : [];
                        let posp_data = [];
                        posp_res.POSP ? posp_data.push(posp_res.POSP) : [];
                        if (posp_user_data.length > 0 && posp_data.length > 0) {
                            let first_filter_data = posp_data.filter(posp_obj =>
                                posp_user_data.filter(posp_user_obj => {
                                    if (posp_user_obj.Ss_Id === posp_obj.Ss_Id) {
                                        for (var key in posp_user_obj) {
                                            if (["", null, "NA"].indexOf(posp_user_obj[key]) > -1) {
                                                if (["", null, "NA", undefined].indexOf(posp_obj[key]) === -1) {
                                                    posp_user_obj[key] = posp_obj[key];
                                                }
                                            }
                                        }
                                    }
                                })
                            );
                            let second_filter_data = first_filter_data[0];
                            for (let key in org_posp_res) {
                                try {
                                    if (key === "Erp_Id" && org_posp_res[key]) {
                                        second_filter_data['Last_Status'] = "18";
                                        second_filter_data['Erp_Status'] = "SUCCESS";
                                        second_filter_data['Erp_Msg'] = "ERP CODE GENENERATED SUCCESSFULLY :: " + org_posp_res[key];
                                        second_filter_data['Exam_Start_Date'] = org_posp_res[key] ? (moment(org_posp_res[key], "YYYY-MM-DDTHH:mm:ss[Z]").format("YYYY-MM-DDTHH:mm:ss[Z]")) : null;
                                        second_filter_data['Exam_End_Date'] = org_posp_res[key] ? (moment(org_posp_res[key], "YYYY-MM-DDTHH:mm:ss[Z]").format("YYYY-MM-DDTHH:mm:ss[Z]")) : null;
                                        second_filter_data['Is_Appointment_Letter_Generated'] = "Yes";
                                        second_filter_data['Training_Status'] = "Started";
                                        second_filter_data['Remaining_Hours'] = "30:00:00";
                                        second_filter_data['Completed_Hours'] = "00:00:00";
                                        second_filter_data["Onboarding_Status"] = "Exam_Completed";
                                    }
                                    if (key === "Mobile_No" && org_posp_res[key]) {
                                        second_filter_data["Mobile_Number"] = org_posp_res[key];
                                    }
                                    if (key === "Is_Contact_Sync") {
                                        second_filter_data['Is_Contact_Sync'] = org_posp_res[key] ? org_posp_res[key].toString() : "";
                                    }
                                    if (key === "IsFOS") {
                                        second_filter_data['IsFOS'] = ((org_posp_res[key] - 0) === 1) ? true : false;
                                    }
                                    if (key === "Is_IIB") {
                                        second_filter_data['POSP_UploadedtoIIB'] = ((org_posp_res[key] - 0) === 1) ? "Yes" : "No";
                                    }
                                    if (key === "POSP_UploadingDateAtIIB" && org_posp_res[key]) {
                                        second_filter_data['POSP_UploadingDateAtIIB'] = org_posp_res[key] ? (moment(org_posp_res[key], "DD-MM-YYYY").format("DD-MM-YYYY")) : null;
                                        second_filter_data["Is_Doc_Approved"] = "Yes";
                                        second_filter_data["Is_IIB_Uploaded"] = "Yes";
                                        second_filter_data["Is_Doc_Verified"] = "Yes";
                                        second_filter_data["Is_Document_Uploaded"] = "Yes";
                                    }
                                    if (key === "Is_DeActivation") {
                                        second_filter_data['POSP_DeActivatedtoIIB'] = ((org_posp_res[key] - 0) === 1) ? "Yes" : "No";
                                    }
                                    if (key === "DeActivation_On" && org_posp_res[key]) {
                                        second_filter_data['POSP_DeActivatedDateAtIIB'] = org_posp_res[key] ? org_posp_res[key] : null;
                                    }
                                    if (key === "Is_Exam") {
                                        second_filter_data['Exam_Status'] = ((org_posp_res[key] - 0) === 1) ? "Completed" : "Pending";
                                        second_filter_data['Is_Certificate_Generated'] = org_posp_res['Exam_Status'] === "Completed" ? "Yes" : "No";
                                    }
                                    if (key === "Is_Certified") {
                                        second_filter_data['Is_Certificate_Generated'] = ((org_posp_res[key] - 0) === 1) ? "Yes" : "No";
                                    }
                                    if (key === "Is_Paid") {
                                        second_filter_data['Payment_Status'] = ((org_posp_res[key] - 0) === 1) ? "Success" : "Pending";
                                        second_filter_data["RegAmount"] = 999;
                                    }
                                    if (key === "TrainingStartDate" && org_posp_res[key]) {
                                        second_filter_data["Training_Start_Date"] = org_posp_res[key] ? org_posp_res[key] : null;
                                        second_filter_data["Training_Scheduled_On"] = second_filter_data["Training_Start_Date"];
                                    }
                                    if (key === "TrainingEndDate" && org_posp_res[key]) {
                                        second_filter_data["Training_End_Date"] = org_posp_res[key] ? org_posp_res[key] : null;
                                    }
                                    second_filter_data["User_Id"] = org_posp_res.Ss_Id;
                                    if (org_posp_res.hasOwnProperty('_id')) {
                                        delete second_filter_data['_id'];
                                    }
                                } catch (e) {
                                    console.error('/onboarding/schedule_posp_user_data', e.stack);
                                }
                            }
                            if (([null, "NA", ""].indexOf(second_filter_data.POSP_UploadingDateAtIIB) > -1) && [null, "NA", ""].indexOf(second_filter_data.Training_Start_Date) > -1) {
                                second_filter_data['Training_Start_Date'] = second_filter_data.Created_On ? second_filter_data.Created_On : null;
                            }
                            if (second_filter_data.Training_Start_Date && ([null, "NA", ""].indexOf(second_filter_data.TrainingEndDate) > -1)) {
                                second_filter_data['Training_Status'] = "Started";
                                second_filter_data['Remaining_Hours'] = "30:00:00";
                                second_filter_data['Completed_Hours'] = "00:00:00";
                            }
                            second_filter_data["Account_Type"] = second_filter_data.Account_Type ? second_filter_data.Account_Type : "Saving A/c";
                            try {
                                let posp_user_update_args = {
                                    data: second_filter_data,
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                };
                                client.post(config.environment.weburl + "/onboarding/update_posp_user?ss_id=" + ss_id, posp_user_update_args, function (posp_user_data, posp_user_response) {
                                    try {
                                        client.get(config.environment.weburl + "/onboarding/update_training_histories?Send_Mail=No&Status=Started&Ss_Id=" + ss_id, {}, function (update_training_histories_data, update_training_histories_response) {

                                        });
                                    } catch (e) {
                                        console.error("Error in schedule_posp_user_data training log update service");
                                    }
                                    res.json({"Status": "SUCCESS", "Msg": "UPDATE SUCCESSFULLY"});
                                });
                            } catch (e) {
                                console.error('/onboarding/schedule_posp_user_data', e.stack);
                            }
                        } else {
                            res.json({"Status": "FAIL", "Msg": "POSP_USER/POSP DATA NOT AVAILABLE"});
                        }
                    } else {
                        res.json({"Status": "FAIL", "Msg": "USER TYPE IS FOS"});
                    }

                });
            } else {
                res.send({"Status": "FAIL", "Msg": "SS_ID IS MANDATORY"});
            }
        } catch (e) {
            res.json({"Status": "FAIL", "Msg": e.stack});
        }
    });
    app.post("/onboarding/update_document_uploading_date", function (req, res) {
        try {
            let posp_list = req.body.posp_list;
            let arr = posp_list.split(",");
            let success_count_data = 0;
            let fail_count_data = 0;
            for (var x = 0; x < arr.length; x++) {
                let user_id = arr[x];
                client.get(config.environment.weburl + "/onboarding/get_uploading_date?ss_id=" + user_id, {}, function (get_uploading_data, get_uploading_data_response) {
                    if (get_uploading_data.Status === "Success") {
                        success_count_data++;
                    } else {
                        fail_count_data++;
                    }
                });
                sleep(3000);
                if (x === (arr.length - 1))
                {
                    res.send({'Status': "Success", "Msg": 'Documents uploading dates updated successfully.', "Success_Count": success_count_data, "Fail_Count": fail_count_data});
                }
            }
        } catch (e) {
            res.json({"Status": "FAIL", "Msg": e.stack});
        }
    });
    app.get("/onboarding/get_uploading_date", function (req, res) {
        try {
            let ss_id = req.query.ss_id ? req.query.ss_id - 0 : "";
            let documents_uploaded_on = null;
            let documents_verified_on = null;
            let documents_approved_on = null;
            if (ss_id) {
                posp_user.find({"User_Id": ss_id}, function (posp_user_err, posp_user_data) {
                    if (posp_user_err) {
                        res.json({"Status": "Fail", "Msg": posp_user_err});
                    } else {
                        if (posp_user_data.length > 0) {
                            let posp_data = posp_user_data[0]._doc;
                            documents_uploaded_on = posp_data.hasOwnProperty("Documents_Uploaded_On") && posp_data["Documents_Uploaded_On"] !== null ? posp_data["Documents_Uploaded_On"] : "";
                            documents_verified_on = posp_data.hasOwnProperty("Documents_Verified_On") && posp_data["Documents_Verified_On"] !== null ? posp_data["Documents_Verified_On"] : "";
                            documents_approved_on = posp_data.hasOwnProperty("Documents_Approved_On") && posp_data["Documents_Approved_On"] !== null ? posp_data["Documents_Approved_On"] : "";

                            posp_doc_log.find({"User_Id": ss_id, "Status": {$in: ["Pending", "Verified", "Approved"]},"Doc_Type": {$in: ["PAN","AADHAAR","QUALIFICATION","PROFILE","POSP_ACC_DOC"]} }).sort({'Modified_On': -1}).limit(8).exec(function (posp_doc_log_err, posp_doc_log_data) {
                                if (posp_doc_log_err) {
                                    res.json({"Status": "Fail", "Msg": posp_doc_log_err});
                                } else {
                                    try {
                                        if (posp_doc_log_data && posp_doc_log_data.length > 0) {
                                            let data = posp_doc_log_data[0]._doc;
                                            let modified_on = data['Created_On'];
                                            let approved_on = data['Approved_On_Date'];
                                            let verified_on = data['Verified_On_Date'];
                                            let posp_args = {
                                                "Documents_Uploaded_On": documents_uploaded_on ? documents_uploaded_on : modified_on,
                                                "Documents_Verified_On": documents_verified_on ? documents_verified_on : verified_on,
                                                "Documents_Approved_On": documents_approved_on ? documents_approved_on : approved_on
                                            };
                                            posp_user.update({'User_Id': ss_id}, {$set: posp_args}, function (posp_user_update_err, pops_user_rowsAffected) {
                                                if (posp_user_update_err) {
                                                    res.json({"Status": "Fail", "Msg": posp_user_update_err});
                                                } else {
                                                    res.json({"Status": "Success", "Msg": "Document uploading date updated successfully."});
                                                }
                                            });
                                        } else {
                                            res.json({"Status": "Fail", "Msg": "No Record found"});
                                        }
                                    } catch (ee) {
                                        res.json({"Status": "Fail", "Msg": ee.stack});
                                    }
                                }
                            });
                        } else {
                            res.json({"Status": "Fail", "Msg": "No Record found"});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Ss_Id is missing"});
            }
        } catch (e) {
            res.json({"Status": "Fail", "Msg": e.stack});
        }
    });
    app.post("/onboarding/save_erp_generated_posp_document_data", function (req, res) {
        try {
            let posp_list = req.body.posp_list;
            let arr = posp_list.split(",");
            let success_count_data = 0;
            let fail_count_data = 0;
            for (var x = 0; x < arr.length; x++) {
                let user_id = arr[x];
                client.get(config.environment.weburl + "/onboarding/schedule_erp_generated_posp_document_data?ss_id=" + user_id, {}, function (schedule_posp_document_data, schedule_posp_document_data_response) {
                    if (schedule_posp_document_data.Status === "SUCCESS") {
                        success_count_data++;
                    } else {
                        fail_count_data++;
                    }
                });
                sleep(3000);
                if (x === (arr.length - 1)) {
                    res.send({'Status': "Success", "Msg": 'ERP Generated POSP Data & Document Save Successfully', "Success_Count": success_count_data, "Fail_Count": fail_count_data});
                }
            }
        } catch (e) {
            res.json({"Status": "FAIL", "Msg": e.stack});
        }
    });
    app.get("/onboarding/schedule_erp_generated_posp_document_data", function (req, res) {
        try {
            var Posp = require('../models/posp');
            let ss_id = req.query.ss_id ? req.query.ss_id - 0 : '';
            if (ss_id) {
                posp_user.find({"Ss_Id": ss_id}, function (posp_user_err, posp_user_data) {
                    if (posp_user_err) {
                        res.json({"Status": "FAIL", "Msg": posp_user_err});
                    } else {
                        let posp_user_db_response = posp_user_data;
                        if (posp_user_db_response && posp_user_db_response.length === 0) {
                            Posp.findOne({"Ss_Id": ss_id, "IsFOS": 0}, function (posps_db_err, posps_db_data) {
                                if (posps_db_err) {
                                    res.send({"Status": "FAIL", "Msg": "NO RECORD AVAILABE", "Data": posps_db_err});
                                } else {
                                    if (posps_db_data) {
                                        let posp_data = posps_db_data._doc;
                                        for (let key in posp_data) {
                                            try {
                                                if (key === "Erp_Id" && posp_data[key]) {
                                                    posp_data['Last_Status'] = "18";
                                                    posp_data['Erp_Status'] = "SUCCESS";
                                                    posp_data['Erp_Msg'] = "ERP CODE GENENERATED SUCCESSFULLY :: " + posp_data[key];
                                                    posp_data['Exam_Start_Date'] = posp_data[key] ? (moment(posp_data[key], "YYYY-MM-DDTHH:mm:ss[Z]").format("YYYY-MM-DDTHH:mm:ss[Z]")) : null;
                                                    posp_data['Exam_End_Date'] = posp_data[key] ? (moment(posp_data[key], "YYYY-MM-DDTHH:mm:ss[Z]").format("YYYY-MM-DDTHH:mm:ss[Z]")) : null;
                                                    posp_data['Is_Appointment_Letter_Generated'] = "Yes";
                                                    posp_data['Training_Status'] = "Completed";
                                                    posp_data['Remaining_Hours'] = "30:00:00";
                                                    posp_data['Completed_Hours'] = "30:00:00";
                                                    posp_data["Onboarding_Status"] = "Exam_Completed";
                                                }
                                                if (key === "Mobile_No" && posp_data[key]) {
                                                    posp_data["Mobile_Number"] = posp_data[key];
                                                }
                                                if (key === "Is_Contact_Sync") {
                                                    posp_data['Is_Contact_Sync'] = posp_data[key].toString();
                                                }
                                                if (key === "IsFOS") {
                                                    posp_data['IsFOS'] = ((posp_data[key] - 0) === 1) ? true : false;
                                                }
                                                if (key === "Is_IIB") {
                                                    posp_data['POSP_UploadedtoIIB'] = ((posp_data[key] - 0) === 1) ? "Yes" : "No";
                                                }
                                                if (key === "POSP_UploadingDateAtIIB" && posp_data[key]) {
                                                    posp_data['POSP_UploadingDateAtIIB'] = posp_data[key] ? (moment(posp_data[key], "DD-MM-YYYY").format("DD-MM-YYYY")) : null;
                                                    posp_data["Is_Doc_Approved"] = "Yes";
                                                    posp_data["Is_IIB_Uploaded"] = "Yes";
                                                    posp_data["Is_Doc_Verified"] = "Yes";
                                                    posp_data["Is_Document_Uploaded"] = "Yes";
                                                }
                                                if (key === "Is_DeActivation") {
                                                    posp_data['POSP_DeActivatedtoIIB'] = ((posp_data[key] - 0) === 1) ? "Yes" : "No";
                                                }
                                                if (key === "DeActivation_On" && posp_data[key]) {
                                                    posp_data['POSP_DeActivatedDateAtIIB'] = posp_data[key] ? posp_data[key] : null;
                                                }
                                                if (key === "Is_Exam") {
                                                    posp_data['Exam_Status'] = ((posp_data[key] - 0) === 1) ? "Completed" : "Pending";
                                                    posp_data['Is_Certificate_Generated'] = posp_data['Exam_Status'] === "Completed" ? "Yes" : "No";
                                                }
                                                if (key === "Is_Certified") {
                                                    posp_data['Is_Certificate_Generated'] = ((posp_data[key] - 0) === 1) ? "Yes" : "No";
                                                }
                                                if (key === "Is_Paid") {
                                                    posp_data['Payment_Status'] = ((posp_data[key] - 0) === 1) ? "Success" : "Pending";
                                                    posp_data["RegAmount"] = 999;
                                                }
                                                if (key === "TrainingStartDate" && posp_data[key]) {
                                                    posp_data["Training_Start_Date"] = posp_data[key] ? posp_data[key] : null;
                                                    posp_data["Training_Scheduled_On"] = posp_data["Training_Start_Date"];
                                                }
                                                if (key === "TrainingEndDate" && posp_data[key]) {
                                                    posp_data["Training_End_Date"] = posp_data[key] ? posp_data[key] : null;
                                                }
                                                if (key === "Nominee_Pan" && posp_data[key] === "SELF") {
                                                    posp_data["Nominee_DOB_On_Pan"] = posp_data.Birthdate ? posp_data.Birthdate : "";
                                                }
                                                posp_data["User_Id"] = posp_data.Ss_Id;

                                            } catch (e) {
                                                console.error('/onboarding/schedule_posp_document_data', e.stack);
                                            }
                                        }
                                        if (posp_data.hasOwnProperty('_id')) {
                                            delete posp_data['_id'];
                                        }
                                        let posp_userobj = new posp_user(posp_data);
                                        posp_userobj.save(function (posp_userobj_err, posp_userobj_res) {
                                            if (posp_userobj_err) {
                                                res.json({"Status": "FAIL", "Msg": "DATABASE ERROR", "Data": posp_userobj_err});
                                            } else {
                                                client.get(config.environment.weburl + "/onboarding/save_document?ss_id=" + ss_id, {}, function (save_doc_data, save_doc_response) {
                                                    if (save_doc_data && save_doc_data.Status === "SUCCESS") {
                                                        res.json({"Status": "SUCCESS", "Msg": "DATA INSERTED & DOCUMENTS SAVE TO HORIZON TEMP FOLDER SUCCESSFULLY", "Data": posp_userobj_res});
                                                    } else {
                                                        res.json({"Status": "SUCCESS", "Msg": "DATA INSERTED SUCCESSFULLY ", "Data": posp_userobj_res});
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        res.send({"Status": "SUCCESS", "Msg": "USER IS FOS"});
                                    }
                                }
                            });
                        } else {
                            res.send({"Status": "SUCCESS", "Msg": "DATA ALREADY AVAILABLE IN POSP USER"});
                        }
                    }
                });
            } else {
                res.send({"Status": "FAIL", "Msg": "SS_ID IS MANDATORY"});
            }
        } catch (e) {
            res.json({"Status": "FAIL", "Msg": e.stack});
        }
    });
    app.post("/onboarding/create_pan_records", function (req, res) {
        try {
            let pan_list = req.body.pan_list;
            let arr = pan_list.split(",");
            let success_count_data = 0;
            let fail_count_data = 0;
            for (var x = 0; x < arr.length; x++) {
                let pan_no = arr[x];
               let args = {
                    data: {
                        'User_Id': 8067,
                        'Pan_Number': pan_no,
                        'Doc_Type': "PAN"
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }
                };
                client.post(config.environment.weburl + "/onboarding/zoop_pan_pro", args, function (zoop_pan_pro_data, zoop_pan_pro_response) {
                    if (zoop_pan_pro_data.Status === "Success") {
                        success_count_data++;
                    } else {
                        fail_count_data++;
                    }
                });
                sleep(3000);
                if (x === (arr.length - 1))
                {
                    res.send({'Status': "Success", "Msg": 'Pan records created successfully.', "Success_Count": success_count_data, "Fail_Count": fail_count_data});
                }
            }
        } catch (e) {
            res.json({"Status": "FAIL", "Msg": e.stack});
        }
    });
    app.post("/onboarding/zoop_pan_pro", function (req, res) {
        try {
            req.body = JSON.parse(JSON.stringify(req.body));
            var User_Id = req.body.User_Id;
            var Pan_Number = (req.body.Pan_Number).toString();
            var docType = req.body.Doc_Type ? req.body.Doc_Type : "";
            let zoop_url = "https://live.zoop.one/api/v1/in/identity/pan/pro";
            let api_key = "4RNA4S6-XWKM659-G7BR4MY-SHHTHHR";
            let api_appid = "61d8162ba81661001db34ab9";
            let zoop_doc_args = {
                data: {
                    "mode": "sync",
                    "data": {
                        "customer_pan_number": Pan_Number,
                        "consent": "Y",
                        "consent_text": "I hear by declare my consent agreement for fetching my information via ZOOP API."
                    }},
                headers: {
                    'Content-Type': 'application/json',
                    "api-key": api_key,
                    "app-id": api_appid
                }
            };
            let api_log_args = {
                data: {
                    'User_Id': User_Id,
                    'Doc_Type': docType,
                    'Api_Url': zoop_url,
                    'Api_Request': zoop_doc_args,
                    'Send_Mail': "No"
                },
                headers: {
                    "Content-Type": "application/json"
                }
            };
            console.error("zoop_pan_verification Line 1");
            client.post(zoop_url, zoop_doc_args, function (zoopdata, zoopresponse) {
                console.error("zoop_pan_verification Line 2", zoopdata);
                if (zoopdata && zoopdata["result"]) {
                    api_log_args["data"]["Status"] = "Success";
                    api_log_args["data"]["Name_On_PAN"] = zoopdata["result"]["user_full_name"] || "";
                    api_log_args["data"]["Linked_Aadhaar"] = zoopdata["result"]["aadhaar_linked_status"] || "";
                    api_log_args["data"]["DOB"] = zoopdata["result"]["user_dob"] || "";
                    api_log_args["data"]["Masked_Aadhaar"] = zoopdata["result"]["masked_aadhaar"] || "";
					api_log_args["data"]["Pan_Number"] = zoopdata["result"]["pan_number"] || "";
                } else {
                    api_log_args["data"]["Status"] = "Fail";
                }
                api_log_args["data"]["Api_Response"] = zoopdata;
                //res.json({Status: api_log_args["data"]["Status"], data: zoopdata});
                client.post(config.environment.weburl + '/onboarding/update_api_log', api_log_args, function (update_api_log_data, update_api_log_res) {
                    console.error("zoop_pan_verification Line 3", update_api_log_data);
                    if (update_api_log_data.Status === "Success") {
                        res.json({Status: api_log_args["data"]["Status"], data: zoopdata});
                    } else {
                        res.json({Status: api_log_args["data"]["Status"], data: zoopdata});
                    }
                });
            });
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });

    app.get('/onboarding/check_document_status', function (req, res) {
        try {
            let ss_id = req.query.ss_id ? req.query.ss_id : "";
            let documents = ["PROFILE", "PAN", "QUALIFICATION", "POSP_ACC_DOC"];
            let counter = 0;
            let doc_found = false;
            let missing_doc = [];
            if (ss_id) {
                posp_doc_log.find({"User_Id": ss_id}, function (posp_doc_log_err, posp_doc_log_data) {
                    if (posp_doc_log_err) {
                        res.json({"Status": "FAIL", "Msg": posp_doc_log_err});
                    } else {
                        try {
                            if (posp_doc_log_data && posp_doc_log_data.length > 0) {
                                documents.forEach((current_doc) => {
                                    counter++;
                                    doc_found = false;
                                    for (let i = 0; i < posp_doc_log_data.length; i++) {
                                        let data = posp_doc_log_data[i]._doc;
                                        let doc_type = data["Doc_Type"];
                                        if (current_doc === doc_type) {
                                            if ((["Approved"].indexOf(data["Status"]) > -1) && (["", "NA", undefined, null].indexOf(data["Doc_URL"]) === -1)) {
                                                let path = appRoot + "/tmp/onboarding_docs/" + ss_id;
                                                if (fs.existsSync(path)) {
                                                    let file_path = appRoot + '/tmp/onboarding_docs' + (data.Doc_URL).split("onboarding_docs")[1];
                                                    if (fs.existsSync(file_path)) {
                                                        doc_found = true;
                                                    }
                                                } else {
                                                    break;
                                                    res.send({'Status': "FAIL", "Msg": ss_id + " FOLDER DOES NOT EXIST IN ONBOARDING_DOCS"});
                                                }
                                            }
                                        }
                                    }
                                    if (!doc_found) {
                                        missing_doc.push(current_doc);
                                    }
                                    if (counter === (documents.length)) {
                                        if (missing_doc.length > 0) {
                                            //res.send({'Status': "FAIL", "Msg": missing_doc.join(',') + ' IS/ARE PENDING'});
                                            res.send({'Status': "FAIL", "Msg": 'DOCUMENTS ARE PENDING'});
                                        } else {
                                            res.send({'Status': "SUCCESS", "Msg": 'ALL DOCUMENTS ARE UPLOADED'});
                                        }
                                    }
                                });
                            } else {
                                res.json({"Status": "FAIL", "Msg": "NO DOCUMENT FOUND"});
                            }
                        } catch (ee) {
                            res.json({"Status": "FAIL", "Msg": ee.stack});
                        }
                    }
                });
            } else {
                res.json({"Status": "FAIL", "Msg": "Ss_Id not found", "Ss_Id": ss_id});
            }
        } catch (ex) {
            res.json({"Status": "FAIL", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/sync_posp_data', function (req, res) {
        let args = {};
        try {
            let objRequest = req.query;
            let Ss_Id = objRequest.ss_id && objRequest.ss_id - 0 || "";
            if (Ss_Id) {
                posp_user.find({"Ss_Id": Ss_Id}, function (posp_user_db_err, posp_user_db_data) {
                    if (posp_user_db_err) {
                        res.json({"Status": "FAIL", "Msg": "ERROR_IN_FETCH_POSP_USER", 'Ss_Id': Ss_Id});
                    } else {
                        if (posp_user_db_data.length > 0) {
                            res.json({"Status": "SUCCESS", "Msg": "POSP_ALREADY_EXIST", 'Ss_Id': Ss_Id});
                        } else {
                            var Posp = require('../models/posp');
                            Posp.findOne({"Ss_Id": Ss_Id}, function (posps_db_err, posps_db_data) {
                                if (posps_db_err) {
                                    res.send({"Status": "FAIL", "Msg": "ERROR_IN_FETCH_POSP", 'Ss_Id': Ss_Id});
                                } else {
                                    if (posps_db_data && posps_db_data._doc) {
                                        let posp_res = posps_db_data._doc;
                                        args = posp_res;
                                        args["User_Id"] = Ss_Id;
                                        args["Payment_Status"] = "Pending";
                                        args["Is_Mail_Sent"] = 2;
                                        if (posp_res.Created_On) {
                                            args["Created_On"] = posp_res.Created_On;
                                        } else {
                                            args["Created_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                        }
                                        let posp_userobj = new posp_user(args);
                                        posp_userobj.save(function (err, dbresult2) {
                                            if (err) {
                                                res.json({"Status": "FAIL", "Msg": "ERROR_IN_SAVE_POSP_USER", 'Ss_Id': Ss_Id});
                                            } else {
                                                res.json({"Status": "SUCCESS", "Msg": "POSP_TRAINING_SYNC_SUCCESSFULLY", 'Ss_Id': Ss_Id});
                                            }
                                        });
                                    } else {
                                        res.json({"Status": "FAIL", "Msg": "NOT_EXIST_IN_POSP", 'Ss_Id': Ss_Id});
                                    }
                                }
                            });
                        }
                    }
                });
            } else {
                res.json({"Status": "FAIL", "Msg": "SS_ID_IS_MANDATORY"});
            }
        } catch (ex) {
            res.json({"Status": "FAIL", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/posp_training_schedule', function (req, res) {
        try {
            let objRequest = req.query;
            let Ss_Id = objRequest.ss_id && objRequest.ss_id - 0 || "";
            if (Ss_Id) {
                posp_user.find({"Ss_Id": Ss_Id}, function (posp_user_db_err, posp_user_db_data) {
                    if (posp_user_db_err) {
                        res.json({"Status": "FAIL", "Msg": "ERROR_IN_FETCH_POSP_USER", 'Ss_Id': Ss_Id});
                    } else {
                        if (posp_user_db_data.length > 0) {
                            let posp_user_response = posp_user_db_data[0]._doc;
                            if (posp_user_response.Training_Scheduled_On) {
                                res.json({"Status": "SUCCESS", "Msg": "POSP_TRANING_ALREADY_SCHEDULED", 'Ss_Id': Ss_Id});
                            } else {
                                let update_posp_user = {};
                                update_posp_user["Training_Scheduled_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                posp_user.update({"Ss_Id": Ss_Id}, {$set: update_posp_user}, function (err, numAffected) {
                                    if (err) {
                                        res.json({"Status": "FAIL", "Msg": "POSP_TRAINING_NOT_SCHEDULED", 'Ss_Id': Ss_Id});
                                    } else {
                                        res.json({"Status": "SUCCESS", "Msg": "POSP_TRAINING_SCHEDULED", 'Ss_Id': Ss_Id});
                                    }
                                });
                            }
                        } else {
                            res.json({"Status": "SUCCESS", "Msg": "NOT_EXIST_IN_POSP_USER", 'Ss_Id': Ss_Id});
                        }
                    }
                });
            } else {
                res.json({"Status": "FAIL", "Msg": "SS_ID_IS_MANDATORY"});
            }
        } catch (ex) {
            res.json({"Status": "FAIL", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/start_training_call', function (req, res) {
        try {
            let objRequest = req.query;
            let Ss_Id = objRequest.ss_id && objRequest.ss_id - 0 || "";
            let otp = objRequest.otp && objRequest.otp || "";
            client.get(config.environment.weburl + '/onboarding/start_posp_training?ss_id=' + Ss_Id + "&otp="+otp, {}, function (start_posp_training_data, start_posp_training_res) {
                if (start_posp_training_data && start_posp_training_data.Status && start_posp_training_data.Status === "FAIL") {
                    var email_data = '<!DOCTYPE html><html><head><title>POSP_TRAINING_START_ERROR</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                    email_data += '<p><h1>Training API Details</h1><pre>' + JSON.stringify(start_posp_training_data, undefined, 2) + '</pre></p>';
                    email_data += '</body></html>';
                    var Email = require('../models/email');
                    var objModelEmail = new Email();
                    objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, 'START_TRAINING_CALL_API::' + start_posp_training_data['Status'] + '::SSID-' + Ss_Id, email_data, '', '');
                }else{
                    res.send(start_posp_training_data);
                }
                console.error('TRAINING_START_CALL_API', 'Ss_Id: ' + Ss_Id);
            });
        } catch (ex) {
            res.json({"Status": "FAIL", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/start_posp_training', function (req, res) {
        try {
            let objRequest = req.query;
            let Ss_Id = objRequest.ss_id && objRequest.ss_id - 0 || "";
            let otp = objRequest.otp || "";
            if (Ss_Id) {
                posp_user.find({"Ss_Id": Ss_Id}, function (posp_user_db_err, posp_user_db_data) {
                    if (posp_user_db_err) {
                        res.json({"Status": "FAIL", "Msg": "ERROR_IN_FETCH_POSP_USER", 'Ss_Id': Ss_Id});
                    } else {
                        if (posp_user_db_data.length > 0) {
                            let posp_user_response = posp_user_db_data[0]._doc;
                            if (posp_user_response.Training_Start_Date && posp_user_response.Training_End_Date) {
                                res.json({"Status": "SUCCESS", "Msg": "POSP_TRANING_ALREADY_COMPLETED", 'Ss_Id': Ss_Id});
                            } else if (posp_user_response.Training_Start_Date) {
                                res.json({"Status": "SUCCESS", "Msg": "POSP_TRAINING_ALREADY_STARTED", 'Ss_Id': Ss_Id});
                            } else {
                                let update_posp_user = {};
                                if (["", null, undefined].indexOf(posp_user_response.Training_Scheduled_On) > -1) {
                                    update_posp_user["Training_Scheduled_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                }
                                if (["", null].indexOf(posp_user_response.Training_Start_Date) > -1) {
                                    update_posp_user["Training_Start_Date"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                    update_posp_user["Training_Status"] = "Started";
                                    update_posp_user["Remaining_Hours"] = "30:00:00";
                                    update_posp_user["Completed_Hours"] = "00:00:00";
                                    update_posp_user["Training_Start_Otp"] = otp;
                                    update_posp_user["Is_Email_Verified"] = "Yes";
                                    update_posp_user["Email_Verified_On"] = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
                                }
                                posp_user.update({"Ss_Id": Ss_Id}, {$set: update_posp_user}, function (err, numAffected) {
                                    if (err) {
                                        res.json({"Status": "FAIL", "Msg": "EEROR_IN_POSP_TRAINING_START", 'Ss_Id': Ss_Id});
                                    } else {
                                        try {
                                            client.get(config.environment.weburl + "/posps/mssql/sync_training_date?ss_id=" + Ss_Id, {}, function (sync_training_date_data, sync_training_date_response) {
                                                console.error({"Status": "Success", "Msg": "sync_training_date called.", "Data": sync_training_date_data});
                                            });
                                        } catch (ee) {
                                            console.error('sync_training_date Error', ee.stack);
                                        }
                                        try {
                                            client.get(config.environment.weburl + '/posps/report/email_consolidate_process?ss_id=' + Ss_Id + '&event_type=TRAINING_START', {}, function (mail_data, mail_res) {
                                                console.error('SEND_TRAINING_START_MAIL', 'Ss_Id: ' + Ss_Id);
                                            });
                                        } catch (ex) {
                                            console.error("EXCEPTION_IN_SEND_TRAINING_START_MAIL", 'Ss_Id: ' + Ss_Id, ex.stack);
                                        }
                                        res.json({"Status": "SUCCESS", "Msg": "POSP_TRAINING_STARTED", 'Ss_Id': Ss_Id});
                                    }
                                });
                            }
                        } else {
                            res.json({"Status": "FAIL", "Msg": "NOT_EXIST_IN_POSP_USER", 'Ss_Id': Ss_Id});
                        }
                    }
                });
            } else {
                res.json({"Status": "FAIL", "Msg": "SS_ID_IS_MANDATORY"});
            }
        } catch (ex) {
            res.json({"Status": "FAIL", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/check_pan_status', function (req, res) {
        try {
            let pan = req.query.pan ? req.query.pan : "";
            let ss_id = req.query.ss_id ? req.query.ss_id - 0 : "";
            if (pan && ss_id) {
                posp_user.find({"Pan_No": pan, "Is_Active": true, "User_Id": {$nin: [ss_id]}}, function (posp_user_err, posp_user_data) {
                    if (posp_user_err) {
                        res.send({"Status": "FAIL", "Msg": "ERROR_IN_FINDING_RECORD_IN_POSP_USER", "Data": posp_user_err});
                    } else {
                        if (posp_user_data && posp_user_data.length > 0) {
                            res.send({"Status": "SUCCESS", "Msg": "PAN_ALREADY_EXIST", "Data": posp_user_data[0]._doc});
                        } else {
                            var Posp = require('../models/posp');
                            Posp.find({"Pan_No": pan, "Is_Active": true, "Ss_Id": {$nin: [ss_id]}}, function (posp_err, posp_data) {
                                if (posp_err)
                                    res.json({"Status": "FAIL", "Msg": posp_err});
                                if (posp_data && posp_data.length > 0) {
                                    res.send({"Status": "SUCCESS", "Msg": "PAN_ALREADY_EXIST", "Data": posp_data[0]._doc});
                                } else {
                                    res.send({"Status": "SUCCESS", "Msg": "PAN_DOES_NOT_EXIST", "Data": pan});
                                }
                            });
                        }
                    }
                });
            } else {
                res.json({"Status": "FAIL", "Msg": "SSID_OR_PAN_MISSING"});
            }
        } catch (ex) {
            res.json({"Status": "FAIL", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/get_pincode_details_NIU', function (req, res) {
        try {
            let objRequest = req.query;
            let pincode = objRequest.Pincode ? (objRequest.Pincode - 0) : "";
            if (!isNaN(pincode)) {
                posp_city_master.find({"Pincode": pincode}, function (posp_city_master_err, posp_city_master_data) {
                    if (posp_city_master_err) {
                        res.json({"Status": "Fail", "Msg": "Error while fetching record from posp_city_master"});
                    } else {
                        if (posp_city_master_data && posp_city_master_data.length > 0) {
                            res.json(posp_city_master_data);
                        } else {
                            res.json({"Status": "Fail", "Msg": "Pincode doesn't exist."});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Please Provide a Valid Pincode."});
            }
        } catch (ex) {
            console.log('Exception', 'get_pincode_details', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/get_pincode_details', function (req, res) {
        try {
            let objRequest = req.query;
            let pincode = objRequest.Pincode ? (objRequest.Pincode - 0) : "";
            let updated_city_master_data = [];
            if (!isNaN(pincode)) {
                posp_city_master.find({"Pincode": pincode}, function (posp_city_master_err, posp_city_master_data) {
                    if (posp_city_master_err) {
                        res.json({"Status": "Fail", "Msg": "Error while fetching record from posp_city_master"});
                    } else {
                        if (posp_city_master_data && posp_city_master_data.length > 0) {
                            for (let i in posp_city_master_data) {
                                let current_entry = posp_city_master_data[i]._doc;
                                let updated_city = current_entry["City"].replace(/[^\w\s]/gi, "").replace(/[0-9]/g, '').trim();
                                console.log("Initial : " + current_entry["City"] + " - Updated : " + updated_city);
                                if (current_entry["City"] !== updated_city) {
                                    current_entry["City"] = updated_city;
                                    try {
                                        let update_city_args = {
                                            data: {
                                                "find_args": {
                                                    "_id": current_entry["_id"]
                                                },
                                                "collection_name": "posp_city_master.js",
                                                "updated_obj": {
                                                    "City": updated_city
                                                }
                                            },
                                            headers: {
                                                "Content-Type": "application/json"
                                            }
                                        };
                                        client.post(config.environment.weburl + "/onboarding/update_record", update_city_args, function (update_city_data, update_city_response) {});
                                    } catch (e) {
                                        console.error('Exception in updating POSP_CITY_MASTER Collection', e.stack);
                                    }
                                }
                                updated_city_master_data.push(current_entry);
                            }
                            res.json(updated_city_master_data);
                        } else {
                            res.json({"Status": "Fail", "Msg": "Pincode doesn't exist."});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "Please Provide a Valid Pincode."});
            }
        } catch (ex) {
            console.log('Exception', 'get_pincode_details', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/onboarding/fetch_posp_erp_generated', function (req, res) {
        try {
            let from_date = new Date(moment().subtract(2, 'days').format("YYYY-MM-DDT23:59:59[Z]"));
            let to_date = new Date(moment().format("YYYY-MM-DDT00:00:00.000[Z]"));
            let find_query = [
                {$match: {$and: [
                            {"ERPID_CreatedDate": {$gte: from_date, $lte: to_date}},
                            {"Erp_Id": {"$exists": true, "$ne": ""}},
                            {"Erp_Status": "SUCCESS"},
                            {"Is_Active": true}]}
                }
            ];
            posp_user.aggregate(find_query, function (posp_user_err, posp_user_data) {
                if (posp_user_err) {
                    res.json({"Status": "Fail", "Msg": "User not found"});
                } else {
                    if (posp_user_data.length > 0) {
                        let posp_data = posp_user_data;
                        let final_data = [];
                        posp_data.forEach((data) => {
                            let obj = {
                                "Ss_Id": data.Ss_Id,
                                "Erp_Id": data.Erp_Id,
                                "Full_Name": data.Name_On_PAN,
                                "City": data.Present_City,
                                "RM_Name": data.Reporting_Agent_Name,
                                "RM_UID": data.Reporting_Agent_Uid
                            };
                            final_data.push(obj);
                        });
                        res.json({"Status": "Success", "Msg": "User Found", "Data_Fetched_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]"), "data": final_data});
                    } else {
                        res.json({"Status": "Fail", "Msg": "User doesn't exist.", "data": {}});
                    }
                }
            });
        } catch (Ex) {
            console.error('Exception', 'fetch_posp_erp_generated', Ex.stack);
            res.json({"Status": "Fail", "Msg": Ex.stack});
        }
    });
    app.get('/onboarding/remove_all_documents', function (req, res) {
        try {
            let posp_doc_removal_history = require('../models/posp_doc_removal_history.js');
            let User_Id = req.query.ss_id - 0 || "";
            let Doc_Type = req.query.doc_type || "";
            let delete_all = req.query.delete_all || "No";
            let removed_by_ssid = req.query.removed_by_ssId || "";
            let doc_fields = {"PAN": ["Pan_No", "Name_On_PAN", "DOB_On_PAN", "First_Name", "Middle_Name", "Last_Name", "Birthdate", "Father_Name"], "AADHAAR": ["Aadhar", "Name_On_Aadhar", "Present_City", "Present_State", "Permanant_City", "Permanant_State", "Present_Add1", "Present_Add2", "Present_Add3", "Permanant_Add1", "Permanant_Add2", "Permanant_Add3", "Present_Pincode", "Permanant_Pincode"], "POSP_ACC_DOC": ["Bank_Account_No", "Ifsc_Code", "Bank_Name", "Bank_Branch", "Name_as_in_Bank", "Account_Type", "Micr_Code"], "QUALIFICATION": ["Education"]};
            let docs = ["PAN", "AADHAAR", "AADHAAR_BACK", "POSP_ACC_DOC", "QUALIFICATION", "PROFILE", "OTHER"];
            let fields = ["Pan_No", "Name_On_PAN", "DOB_On_PAN", "First_Name", "Middle_Name", "Last_Name", "Birthdate", "Father_Name", "Aadhar", "Name_On_Aadhar", "Present_City", "Present_State", "Permanant_City", "Permanant_State", "Present_Add1", "Present_Add2", "Present_Add3", "Permanant_Add1", "Permanant_Add2", "Permanant_Add3", "Present_Pincode", "Permanant_Pincode", "Bank_Account_No", "Ifsc_Code", "Bank_Name", "Bank_Branch", "Name_as_in_Bank", "Account_Type", "Micr_Code", "Education", "Nominee_Relationship", "Nominee_Pan", "Nominee_DOB_On_Pan", "Nominee_Name_On_Pan", "Nominee_Gender", "Nominee_Name_as_in_Bank", "Nominee_Ifsc_Code", "Nominee_Micr_Code", "Nominee_Last_Name", "Nominee_Middle_Name", "Nominee_First_Name", "Nominee_Bank_Name", "Nominee_Bank_Branch", "Nominee_Bank_Account_Number", "Nominee_Aadhar"];
            let document_types = [];
            let current_doc_fields = "";
            let doc_removed_obj = [];
            let posp_log_args = {
                "Verified_By_API": "",
                "Status": "",
                "Doc_URL": "",
                "Remark": "",
                "Prev_Approval_Status": "",
                "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
            };
            let posp_user_args = {
                "Is_Document_Uploaded": "No",
                "Is_Document_Rejected": "No",
                "Is_Doc_Verified": "No",
                "Is_Doc_Approved": "No",
                "Verified_Mail_Sent": "No",
                "Approved_Mail_Sent": "No",
                "Is_Mail_Sent": 2,
                "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
            };
            if (Doc_Type) {
                current_doc_fields = doc_fields[Doc_Type];
                if (Doc_Type === "AADHAAR") {
                    document_types = ["AADHAAR", "AADHAAR_BACK"];
                } else {
                    document_types.push(Doc_Type);
                }
            }
            if (delete_all === "Yes") {
                document_types = docs;
                current_doc_fields = fields;
            }
            if (User_Id && document_types) {
                posp_user.find({"User_Id": User_Id}, function (posp_user_err, posp_user_data) {
                    if (posp_user_err) {
                        res.json({"Status": "Fail", "Msg": posp_user_err});
                    } else {
                        if (posp_user_data.length > 0) {
                            let posp_data = posp_user_data[0]._doc;
                            let iib_uploadDate = posp_data.POSP_UploadingDateAtIIB || "";
                            if (iib_uploadDate) {
                                res.json({"Status": "Fail", "Msg": "User details already Uploaded to IIB."});
                            } else {
                                if (current_doc_fields) {
                                    current_doc_fields.forEach((item) => {
                                        posp_user_args[item] = "";
                                    });
                                }
                                let doc_status = "Uploaded";
                                if (posp_data.Is_Document_Uploaded === "Yes" && posp_data.Is_Document_Rejected === "No") {
                                    if (posp_data.Is_Doc_Verified === "Yes" && posp_data.Is_Doc_Approved === "No") {
                                        doc_status = "Verified";
                                    }
                                    if (posp_data.Is_Doc_Approved === "Yes" && posp_data.Is_Doc_Verified === "Yes") {
                                        doc_status = "Approved";
                                    }
                                } else {
                                    if (posp_data.Is_Document_Rejected === "Yes" && ["Approver", "Verifier"].indexOf(posp_data.Documents_Rejected_By) > -1) {
                                        doc_status = "A-Reject";
                                        if (posp_data.Documents_Rejected_By === "Verifier") {
                                            doc_status = "V-Reject";
                                        }
                                    }
                                }
                                document_types.forEach((doc) => {
                                    doc_obj = {
                                        "User_Id": User_Id,
                                        "Doc_Type": doc,
                                        "Details": {},
                                        "Last_Status": doc_status,
                                        "Removed_By": removed_by_ssid,
                                        "Removed_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]"),
                                        "Created_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                                    };
                                    let details_obj = doc_fields[doc] || [];
                                    details_obj.forEach((det) => {
                                        doc_obj["Details"][det] = posp_data[det];
                                    });
                                    doc_removed_obj.push(doc_obj);
                                });
                                try {
                                    posp_doc_log.updateMany({"User_Id": User_Id, "Doc_Type": {$in: document_types}}, {$set: posp_log_args}, function (posp_user_log_err, posp_user_log_res) {
                                        if (posp_user_log_err) {
                                            res.json({"Status": "Fail", "Msg": posp_user_log_err});
                                        } else {
                                            if (posp_user_log_res && posp_user_log_res.nModified >= 1) {
                                                posp_user.update({'User_Id': User_Id}, {$set: posp_user_args}, {runValidators: true}, function (posp_user_err, posp_user_res) {
                                                    if (posp_user_err) {
                                                        res.json({"Status": "Fail", "Msg": posp_user_err});
                                                    } else {
                                                        posp_doc_removal_history.insertMany(doc_removed_obj, function (err, posp_doc_removed_res) {
                                                            if (err) {
                                                                res.json({"Status": "Fail", "Msg": err});
                                                            } else {
                                                                res.json({"Status": "Success", "Msg": "Document Log and User Detail Updated Successfully"});
                                                            }
                                                        });
                                                    }
                                                });
                                            } else {
                                                res.json({"Status": "Fail", "Msg": "Document not found"});
                                            }
                                        }
                                    });
                                } catch (ex) {
                                    res.json({"Status": "Fail", "Msg": ex.stack});
                                }
                            }
                        } else {
                            res.json({"Status": "Fail", "Msg": "User Doesn't exists"});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "User Id / Doc Type is missing"});
            }
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/profile_update_posp_user', function (req, res) {
        try {
            let objRequest = req.body ? req.body : '';
            let user_id = objRequest.User_Id ? objRequest.User_Id : '';
            let posp_user_args = {};
            for (let key in objRequest) {
                posp_user_args[key] = objRequest[key] && objRequest[key] !== undefined ? objRequest[key] : "";
            }
            delete posp_user_args["User_Id"];
            let update_user_args = {
                "Profile_Updated_By": posp_user_args.Profile_Updated_By || 0,
                "Profile_Updated_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]"),
                "Business_Profile": posp_user_args
            };
            if (user_id) {
                posp_user.find({"User_Id": user_id}, function (err, dbresult) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        if (dbresult && dbresult.length > 0) {
                            posp_user.update({'User_Id': user_id}, {$set: update_user_args}, {runValidators: true}, function (err, numAffected) {
                                if (err) {
                                    res.json({"Status": "Fail", "Msg": err});
                                } else {
                                    res.json({"Status": "Success", "Msg": 'POSP details updated successfully'});
                                }
                            });
                        } else {
                            res.json({"Status": "Fail", "Msg": "User not found."});
                        }
                    }
                });
            } else {
                res.json({"Status": "Fail", "Msg": "User_Id is missing."});
            }
        } catch (ex) {
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/onboarding/send_for_pan_verification', function (req, res) {
        try {
            let request = require('request');
            let objRequest = req.body;
            let Pan_No = objRequest.pan_no;
            var pan_verification_url = 'http://lerpci.policyboss.com/RBServices.svc/SendPANNOforVerification?PANNo=' + Pan_No + '&Token=UnVwZWVCb3NzU2VydmljZXMxNDEwMjA';
            let options = {
                'method': 'GET',
                'url': pan_verification_url
            };
            var today = moment().utcOffset("+05:30");
            var today_str = moment(today).format("YYYYMMD");
            var objLogRequest = {
                'on': today,
                'req': objRequest,
                'url': pan_verification_url
            };
            request(options, function (error, data) {
                objLogRequest['res'] = data && data.body || "";
                if (error) {
                    res.json({"Status": "FAIL", "Msg": "SendPANNOforVerification SERVICE ERROR :", "ERROR": error});
                } else {
                    try {
                        fs.appendFile(appRoot + "/tmp/log/send_for_pan_verification_" + today_str + ".log", JSON.stringify(objLogRequest) + "\r\n", function (err) {
                            if (err) {
                                res.json({"Status": "FAIL", "Msg": "FAILED TO APPEND DATA IN LOG FILE", "Error": err});
                            }
                            res.json({"Status": "SUCCESS", "Msg": "FETCH DETAILS SUCCESSFULLY", "Data": objLogRequest});
                        });
                    } catch (e) {
                        res.json({"Status": "FAIL", "Msg": "EXCEPTION IN API", "Data": e.stack});
                    }
                }
            });
        } catch (ex) {
            res.json({"Status": "FAIL", "Msg": "EXCEPTION IN send_for_pan_verification SERVICE", "Data": ex.stack});
        }
    });
    app.get('/onboarding/generateAppointmentLetter_template/:User_Id', function (req, res) {
        try {
            let User_Id = parseInt(req.params['User_Id']);
            if (!isNaN(User_Id)) {
                if (!fs.existsSync(appRoot + "/tmp/onboarding_appointments/" + User_Id)) {
                    fs.mkdirSync(appRoot + "/tmp/onboarding_appointments/" + User_Id);
                }
                //let html_file_path = appRoot + "/resource/request_file/landmark_posp_appointment.html";
                let html_file_path = appRoot + "/resource/request_file/landmark-posp-agreement-v6-new.html";
                let htmlPol = fs.readFileSync(html_file_path, 'utf8');
                let pdf_file_path = appRoot + "/tmp/onboarding_appointments/" + User_Id + "/AppointmentLetter_" + User_Id + ".pdf";
                let pdf_file_attachment = pdf_file_path.replace(appRoot + "/tmp", "");
                let html_pdf_file_path = appRoot + "/tmp/onboarding_appointments/" + User_Id + "/AppointmentLetter_" + User_Id + ".html";
                var html_web_path_portal = config.environment.downloadurl + "/onboarding_appointments/" + User_Id + "/AppointmentLetter_" + User_Id + ".html";
                var request_html_file = fs.writeFileSync(html_pdf_file_path, htmlPol);
                try {
                    var http = require('https');
                    console.log("html_web_path_portal : " + html_web_path_portal);
                    var get_pdf_url = config.environment.pdf_url + html_web_path_portal;
                    var download_url = get_pdf_url;
                    console.log("get_pdf_url : " + get_pdf_url);
                    var file_horizon = fs.createWriteStream(pdf_file_path);

                    var request_horizon = http.get(get_pdf_url, function (response) {
                        get_pdf_url = file_horizon.path;
                        response.pipe(file_horizon);
                        console.error("Appointment Letter::PDF URL" + file_horizon);
                        console.error("PDF sucess");
                    });
                } catch (e) {
                    console.error('PDF Exception', e);
                }
                res.json({"Status": "Success", "Msg": "Appointment Letter Generated.", "html_url": html_web_path_portal, "pdf_url": get_pdf_url});
            } else {
                res.json({"Status": "Fail", "Msg": "You are not a valid POSP."});
            }
        } catch (ex) {
            console.error('Exception', 'GenerateAppointment', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    }); 
    app.post('/onboarding/update_pan_availablity_status', function (req, res) {
        let objSummary = {};
        try {
            let posp_users =  require('../models/posp_users');
            req.body = JSON.parse(JSON.stringify(req.body));
            let objRequest = req.body || "";
            let req_id = objRequest.Reference_Number || "";
            let pan_no = objRequest.Pan_Number || "";
            let find_query = {
                "PAN_Check_Erp_Id" : req_id,
                "Pan_No" : pan_no
			};
            if(req_id && pan_no){
                let updateObj = {
                    "Is_PAN_Available" : objRequest.Status || "",
                    "PAN_Availability_Status_Updated_On" : moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                };
                posp_users.findOneAndUpdate(find_query, {$set : updateObj} ,{new : true} , function(pospuser_error , pospuser_data){
                    if(pospuser_error){
                        objSummary["Status"] = "FAIL";
                        objSummary["Msg"] = pospuser_error;
                        res.json(objSummary);
                    }else{
                        if (pospuser_data && pospuser_data._doc) {
                            objSummary["Status"] = "SUCCESS";
                            objSummary["Msg"] = "DATA SAVED SUCCESSFULLY";
                            let Email = require(appRoot + '/models/email');
                            let objModelEmail = new Email();
                            let mail_content = '<html><body><p>Hello POSP,</p>'
                                    + '<p>PAN availablity status updated successfully!!!</p>'
									+ '<br><br><br><p>Thanks & Regards</p><p>PolicyBoss IT</p></body></html></body></html>';
                            let arr_cc = [];
                            let arr_bcc = ['horizonlive.2020@gmail.com'];
                            let arr_to = ['anuj.singh@policyboss.com', 'roshani.prajapati@policyboss.com'];
                            let sub = "[POSP-ONBOARDING] PAN AVAILABLITY STATUS UPDATE :: PAN ::" + pan_no;
                            objModelEmail.send('pospcom@policyboss.com', arr_to.join(',') ,sub , mail_content, arr_cc.join(','), arr_bcc.join(','), '');
                            res.json(objSummary);
                        } else {
                            objSummary["Status"] = "FAIL";
                            objSummary["Msg"] = "USER WITH PAN " + pan_no + " OR PAN CHECK ERPID " + req_id + " NOT FOUND.";
                            res.json(objSummary);
                        }
                    }
                });
            }else{
                objSummary["Status"] = "FAIL";
                objSummary["Msg"] = "PAN CHECK ERPID / PAN IS MANDATORY";
                res.json(objSummary);
            }
        } catch (ex) {
            objSummary["Status"] = "FAIL";
            objSummary["Msg"] = ex.stack;
            res.json(objSummary);
        }
    });
	app.post('/onboarding/get_agent_details', function (req, res) {
        try {
            let objRequest = req.body;
            let ss_id = objRequest.ss_id && objRequest.ss_id - 0 || '';
            let filter_request = {
                "User_ID": "",
                "SS_ID": "",
                "First_Name": "",
                "Middle_Name": "",
                "Last_Name": "",
                "Mobile": "",
                "Email": "",
                "Gender": "",
                "DOB": "",
                "User_Type": "",
                "Reporting_UID": "",
                "Vertical": "",
                "Sub_Vertical": ""
                    
            };
            let objResponseFull = {
                'Status': '',
                'Msg': '',
                'Data': ''
            };
            if (["", null, "NA", undefined].indexOf(ss_id) > -1) {
                objResponseFull['Status'] = 'FAIL';
                objResponseFull['Msg'] = 'SS_ID INVALID';
                res.json(objResponseFull);
            } else {
                let find_query = {
                    'Ss_Id': ss_id
                };
                let Posp = require('../models/posp');
                Posp.findOne(find_query, function (posp_err, posp_db_data) {
                    if (posp_db_data) {
                        let posp_db_data_obj = posp_db_data['_doc'];
                        objResponseFull['Status'] = 'SUCCESS';
                        objResponseFull['Msg'] = "FETCH RECORD SUCCESSFULLY";
                        filter_request['User_ID'] = posp_db_data_obj.Erp_Id || "";
                        filter_request['SS_ID'] = posp_db_data_obj.Ss_Id || "";
                        filter_request['First_Name'] = posp_db_data_obj.First_Name || "";
                        filter_request['Middle_Name'] = posp_db_data_obj.Middle_Name || "";
                        filter_request['Last_Name'] = posp_db_data_obj.Last_Name || "";
                        filter_request['Mobile'] = posp_db_data_obj.Mobile_No || "";
                        filter_request['Email'] = posp_db_data_obj.Email_Id || "";
                        filter_request['Gender'] = posp_db_data_obj.Gender || "";
                        filter_request['DOB'] = posp_db_data_obj.Birthdate || "";
                        filter_request['User_Type'] = "POS";
                        if (posp_db_data_obj.IsFOS == 1) {
                            filter_request['User_Type'] = "FOS";
                        }
                        filter_request['Reporting_UID'] = posp_db_data_obj.Reporting_Agent_Uid || "";
                        filter_request['Vertical'] = posp_db_data_obj.Vertical || "";
                        filter_request['Sub_Vertical'] = posp_db_data_obj.SubVertical || "";
                        objResponseFull['Data'] = filter_request;
                        res.json(objResponseFull);
                    } else {
                        let user = require('../models/user.js');
                        user.findOne(find_query, function (user_err, user_db_data) {
                            if (user_err) {
                                objResponseFull['Status'] = 'FAIL';
                                objResponseFull['Msg'] = "ERROR IN FETCH RECORD";
                                res.json(objResponseFull);
                            } else {
                                if (user_db_data) {
                                    let user_db_obj = user_db_data['_doc'];
                                    objResponseFull['Status'] = 'SUCCESS';
                                    objResponseFull['Msg'] = "FETCH RECORD SUCCESSFULLY";
                                    filter_request['User_ID'] = user_db_obj.UID || "";
                                    filter_request['SS_ID'] = user_db_obj.Ss_Id || "";
                                    let user_full_name = user_db_obj.Employee_Name && full_name_split(user_db_obj.Employee_Name) || "";
                                    filter_request['First_Name'] = user_full_name.First_Name || "";
                                    filter_request['Middle_Name'] = user_full_name.Middle_Name || "";
                                    filter_request['Last_Name'] = user_full_name.Last_Name || "";
                                    filter_request['Mobile'] = ((["", null, undefined, "-", "NA"].indexOf(user_db_obj.Business_Phone_Number) === -1) && user_db_obj.Business_Phone_Number)|| user_db_obj.Phone || "";
                                    filter_request['Email'] = user_db_obj.Official_Email || user_db_obj.Email || "";
                                    filter_request['Gender'] = "";
                                    filter_request['DOB'] = "";
                                    filter_request['User_Type'] = "Employee";
                                    filter_request['Reporting_UID'] = user_db_obj.Direct_Reporting_UID || "";
                                    filter_request['Vertical'] = user_db_obj.Vertical || "";
                                    filter_request['Sub_Vertical'] = user_db_obj.Sub_Vertical || "";
									filter_request['Date_Of_Joining'] = user_db_obj.DOJ || "";
                                    objResponseFull['Data'] = filter_request;
                                } else {
                                    objResponseFull['Status'] = 'FAIL';
                                    objResponseFull['Msg'] = "ERROR IN FETCH RECORD";
                                }
                                res.json(objResponseFull);
                            }
                        });
                    }
                });
            }
        } catch (e) {
            res.json({'Status': 'FAIL', 'Msg': "EXCEPTION IN API"});
        }
    });
	app.post('/onboarding/update_npos_pan_number', function (req, res) {
        let objSummary = {};
        try {
            let posp_users = require('../models/posp_users');
            req.body = JSON.parse(JSON.stringify(req.body));
            let objRequest = req.body || "";
            let ss_id = objRequest.ss_id && objRequest.ss_id - 0 || "";
            let pan_no = objRequest.pan_no || "";
            let find_query = {
                "Ss_Id": ss_id
            };
            if (ss_id && pan_no) {
                let updateObj = {
                    "Pan_No": pan_no
                };
                posp_users.findOneAndUpdate(find_query, {$set: updateObj}, {new : true}, function (pospuser_error, pospuser_data) {
                    if (pospuser_error) {
                        objSummary["Status"] = "FAIL";
                        objSummary["Msg"] = pospuser_error;
                        res.json(objSummary);
                    } else {
                        if (pospuser_data && pospuser_data._doc) {
                            objSummary["Status"] = "SUCCESS";
                            objSummary["Msg"] = "DATA SAVED SUCCESSFULLY";
                            res.json(objSummary);
                        } else {
                            objSummary["Status"] = "FAIL";
                            objSummary["Msg"] = "DATA NOT UPDATED";
                            res.json(objSummary);
                        }
                    }
                });
            } else {
                objSummary["Status"] = "FAIL";
                objSummary["Msg"] = "PAN CHECK SS_ID / PAN NO IS MANDATORY";
                res.json(objSummary);
            }
        } catch (ex) {
            objSummary["Status"] = "FAIL";
            objSummary["Msg"] = ex.stack;
            res.json(objSummary);
        }
    });
    
    app.get("/onboarding/posp/deactivation/:ss_id", function (req, res) {
        try {
            let ss_id = req.params.ss_id ? req.params.ss_id - 0 : "";
            let rm_email = "";
            let posp_email = "";
            let posp_pan = "";
            if (ss_id && ss_id !== "") {
                let objRequest = req.query;
                objRequest = JSON.parse(JSON.stringify(objRequest));
                let updateObj = {};
                let action = objRequest.hasOwnProperty('action') ? objRequest.action : "";
                if (action !== "" && ['activate', 'deactivate'].includes(action)) {
                    if (action === 'deactivate') {
                        updateObj['POSP_DeActivatedtoIIB'] = objRequest.deactivate;
                        updateObj['POSP_DeActivatedBy'] = objRequest.ssid_by - 0 || '';
                        updateObj['POSP_DeActivatedDateAtIIB'] = moment(objRequest.deactivate_date).format("YYYY-MM-DDTHH:mm:ss[Z]");
                        updateObj['POSP_DeActivatedReason'] = objRequest.deactivate_reason;
                        updateObj['Is_Active'] = false;
                    }
                    if (action === 'activate') {
                        updateObj['POSP_Activated'] = objRequest.activate;
                        updateObj['POSP_ActivatedBy'] = objRequest.ssid_by;
                        updateObj['POSP_ActivatedDate'] = moment(objRequest.activate_date).format("YYYY-MM-DDTHH:mm:ss[Z]");
                        updateObj['POSP_ActivatedReason'] = objRequest.activate_reason;
                        updateObj['Is_Active'] = true;
                    }
//                    client.get(config.environment.weburl + '/posps/dsas/view/' + ss_id, {}, function (data, response) {
                    posp_user.find({$or: [{Ss_Id: ss_id}, {User_Id: ss_id}]}, function (dbposperr, dbpospuser) {
                        try {
                            if (dbposperr) {
                                res.json({"Status": "Fail", "Msg": dbposperr});
                            } else {

//                            if (data && data.status && data.status === "SUCCESS") {
                                if (dbpospuser && dbpospuser.length > 0) {
                                    let data = dbpospuser[0]._doc;
                                    rm_email = data.Reporting_Email_ID && data.Reporting_Email_ID !== "" ? data.Reporting_Email_ID : "";
                                    posp_email = data && data.Email_Id && data.Email_Id !== "" ? data.Email_Id : "";
                                    posp_pan = data && data.Pan_No && data.Pan_No !== "" ? data.Pan_No : "";
                                    posp_user.update({$or: [{Ss_Id: ss_id}, {User_Id: ss_id}]}, {$set: updateObj}, function (dberr, numAffected) {
                                        try {
                                            if (dberr) {
                                                res.json({'Status': "Fail", "Msg": dberr});
                                            } else {
                                                //client.get(config.environment.weburl + "/posps/mssql/sync_noc?ss_id=" + ss_id, {}, function (noc_sync_data, noc_sync_response) {});
                                                let objModelEmail = new Email();
                                                let sendTo_arr = [posp_email];
                                                //let sendTo_arr = ["nilam.bhagde@policyboss.com"];
                                                //let cc_arr = [rm_email];
                                                //let bcc_arr = []
                                                //let cc_arr = ["roshani.prajapati@policyboss.com"];
                                                let subject = "";
                                                let mail_content = "";
                                                let bcc_arr = ["dinesh.mallepula@policyboss.com", "darpana.mane@policyboss.com", "suraj.sonkar@policyboss.com", "pooja.mishra@policyboss.com", "siddhi.singh@policyboss.com", rm_email , config.environment.notification_email];
                                                //objModelEmail.send(from, to, sub, content, cc, bcc, crn, attachment);
                                                if (action === 'deactivate' && numAffected && numAffected.nModified === 1) {
                                                    subject = `Your PAN De-Activated & NoC - SSID : ${ss_id}`;
                                                    mail_content = getDeActivationMailContent(posp_pan, objRequest.deactivate_date);
                                                    objModelEmail.send('noreply@policyboss.com', sendTo_arr.join(';'), subject, mail_content, '', bcc_arr.join(','), '');
                                                    res.json({"Status": "Success", "Msg": "Posp Deactivated Successfully"});
                                                } else if (action === 'activate' && numAffected && numAffected.nModified === 1) {
                                                    res.json({"Status": "Success", "Msg": "Posp Activated Successfully"});
                                                } else {
                                                    res.json({"Status": "Success", "Msg": "Posp " + (action === 'deactivate' ? 'Deactivated' : 'Activated') + " Successfully."});
                                                }
                                            }
                                        } catch (ex) {
                                            res.json({'Status': "Fail", "Msg": ex.stack});
                                        }
                                    });
                                } else {
                                    res.json({"Status": "Fail", "Msg": "No Posp Found Against Ss_Id - " + ss_id + "."});
                                }
                            }
                        } catch (ex) {
                            res.json({'Status': "Fail", "Msg": ex.stack});
                        }
                    });
                } else {
                    res.json({'Status': "Fail", "Msg": "Sent an invalid action.", "Ss_Id": ss_id});
                }

            } else {
                res.json({'Status': "Fail", "Msg": "Ss_Id not found."});
            }
        } catch (ex) {
            res.json({'Status': "Fail", "Msg": ex.stack});
        }
    });
};
function full_name_split(full_namae) {
    let name_obj = {
        "First_Name": "",
        "Middle_Name": "",
        "Last_Name": ""
    };
    let full_name_string = full_namae && full_namae.trim() || "";
    let namesArr = full_name_string && full_name_string.split(" ") || [];
    if (namesArr.length > 0) {
        let middle_name = first_name = last_name = "";
        for (var i = 2; i < namesArr.length; i++) {
            middle_name += " " + namesArr[i - 1];
        }
        first_name = full_name_string.split(' ')[0];
        last_name = namesArr.length == 1 ? "" : namesArr[namesArr.length - 1];
        name_obj["First_Name"] = first_name && first_name.trim().toUpperCase() || "";
        name_obj["Middle_Name"] = middle_name && middle_name.trim().toUpperCase() || "";
        name_obj["Last_Name"] = last_name && last_name.trim().toUpperCase() || "";
    }
    return name_obj;
};
function validateSession_NIU(req, res, next) {
    try {
        let objRequestCore = req.body;
        let session_id = req.params.session_id ? req.params.session_id : '';
        if (req.method === "GET") {
            objRequestCore = req.query;
        }
        objRequestCore = JSON.parse(JSON.stringify(objRequestCore));
        let id = session_id !== '' ? session_id : objRequestCore.hasOwnProperty('session_id') ? objRequestCore['session_id'] : '';
        if (session_id && session_id !== '') {
            var Session = require('../models/session');
            Session.findOne({"_id": id}, function (err, dbSession) {
                if (err) {
                    res.send(err);
                } else {
                    if (dbSession) {
                        dbSession = dbSession._doc;
                        var obj_session = JSON.parse(dbSession['session']);
                        if(obj_session && obj_session.user && obj_session.user.ss_id && obj_session.user.ss_id === 7973){/** Ronald */
                            req.obj_session = obj_session;
                            return next(); 
                        }else{
                            return res.status(401).json({'Msg': 'Not Authorized'});
                        }
                    } else {
                        return res.status(401).json({'Msg': 'Session Expired.Not Authorized'});
                    }
                }
            });
        } else {
            return res.status(401).json({'Msg': 'Invalid Session Id.Not Authorized'});
        }
    } catch (e) {
        console.error('Exception', 'LoadSession', e);
        return next();
    }
}

function validateSession(req, res, next) {
    try {
        var objRequestCore = req.body;
        if (req.method === "GET") {
            objRequestCore = req.query;
        }
        objRequestCore = JSON.parse(JSON.stringify(objRequestCore));
        if (objRequestCore.hasOwnProperty('session_id') && objRequestCore['session_id'] !== '') {
            var Session = require('../models/session');
            Session.findOne({"_id": objRequestCore['session_id']}, function (err, dbSession) {
                if (err) {
					return res.status(401).json({"Status": "Fail", "Msg": err});
                } else {
                    if (dbSession) {
                        dbSession = dbSession._doc;
                        var obj_session = JSON.parse(dbSession['session']);
                        req.obj_session = obj_session;
                        return next();
                    } else {
                        return res.status(401).json({'Msg': 'Session Expired.Not Authorized'});
                    }
                }
            });
        } else {
            return res.status(401).json({'Msg': 'ACCESS DENIED.'});
        }
    } catch (e) {
        console.error('Exception', 'validateSession', e);
        return res.status(401).json({"Status": "Fail", "Msg": e.stack});
    }
}
function Send_Pos_Exam_Due_Email(Ss_Id) {
    client.get(config.environment.weburl + '/onboarding/posp_exam_due_mail?ss_id=' + Ss_Id, {}, function (exam_due_data, exam_due_response) {
        console.error("Send_Pos_Exam_Due_Email", Ss_Id, exam_due_data);
    });
}
function getStateCode(state) {
    let state_code = "";
    let json_file_path = appRoot + "/resource/request_file/posp_state_codes.json";
    let jsonPol = fs.readFileSync(json_file_path, 'utf8');
    jsonPol = JSON.parse(jsonPol);
    for (let j = 0; j < jsonPol.length; j++) {
        let obj = jsonPol[j];
        (obj.State === state) ? state_code = obj.Code : "";
    }
    return state_code;
}
function convertPdfToImage(pdfPath, outputPath, ss_id) {
    let pdfPoppler = require('pdf-poppler');
    let path = require('path'); // Import the 'path' module
    let pdfFileName = path.basename(pdfPath, path.extname(pdfPath)); // Get the PDF file name without extension
    let opts = {
        format: 'jpeg',
        out_dir: outputPath,
        out_prefix: pdfFileName, // Use the PDF file name as the output prefix
        page: null
    };
    try {
        pdfPoppler.convert(pdfPath, opts);
        console.log('PDF converted to image successfully!');
        setTimeout(() => {
            fs.rename(appRoot + "/tmp/onboarding_docs/" + ss_id + "/" + pdfFileName + "-1.jpg", appRoot + "/tmp/onboarding_docs/" + ss_id + "/Profile_" + ss_id + ".jpg", (err) => {
                if (err) {
                    console.error('Error renaming file:', err);
                } else {
                    console.log('File renamed successfully.');
                }
            });
        }, 500);

    } catch (error) {
        console.error('Error converting PDF to image:', error);
    }
}
function getDeActivationMailContent(pan, date) {
    let mail_content = `
Dear Sir/Madam,

Basis your request, we have de-activated your PAN (${pan}) from the IIB POSP Portal on <${moment(date).format("DD-MMM-YYYY")}> and hence you are no longer our POSP and accordingly shall not represent yourself to be associated with Landmark Insurance Brokers ("Landmark") in any manner whatsoever.

This e-mail be treated as our No Objection.

Please note that this email No Objection, does not absolve you of any obligation and/or liability, which you may have towards Landmark and/or its customers/clients.

In light of your dis-association as the POSP of Landmark, you undertake:

  i. not to solicit any insurance business as a POSP on behalf of Landmark;

 ii. not to hold your-self out as POSP of Landmark;

iii. not to induce or entice away any of the registered/appointed POSP from Landmark to join any insurer or insurance intermediary;

 iv. to return or destroy the training and examination certificate and/or all other papers, documents, information, in your possession/custody;

  v. fulfil all your obligation towards Landmark and/or its customers prior and up-to the date of dis-association;

 vi. not to misuse, exploit any of the business software/systems/applications you were given access to.


Any act of omission or commission on your part and/or wrongful use of the training and examination certificate (granted by us) and/or wrongful use of other papers, documents, information, software/ systems/applications etc., shall be at your sole risk, responsibility and liability.

We thank you for choosing us, to be part of our growth journey.

In case of any clarification/assistance, you may write to us at customercare@policyboss.com.

Regards,
For Landmark Insurance Brokers Private Limited
[IRDAI CoR: 216]


Team Landmark

**************`;
    return mail_content;
}
function getDeActivationMailContentNew(pan, date) {
    let mail_content = `
Dear Sir/Madam,
<br>
<br>Basis your request, we have de-activated your PAN (${pan}) from the IIB POSP Portal on <${moment(date).format("DD-MMM-YYYY")}> and hence you are no longer our POSP and accordingly shall not represent yourself to be associated with Landmark Insurance Brokers ("Landmark") in any manner whatsoever.
<br>
<br>This e-mail be treated as our No Objection.
<br>
<br>Please note that this email No Objection, does not absolve you of any obligation and/or liability, which you may have towards Landmark and/or its customers/clients.
<br>
<br>In light of your dis-association as the POSP of Landmark, you undertake:
<br>
 <br> i. not to solicit any insurance business as a POSP on behalf of Landmark;
<br>
 <br> ii. not to hold your-self out as POSP of Landmark;
<br>
 <br> iii. not to induce or entice away any of the registered/appointed POSP from Landmark to join any insurer or insurance intermediary;
<br>
 <br> iv. to return or destroy the training and examination certificate and/or all other papers, documents, information, in your possession/custody;
<br>
 <br> v. fulfil all your obligation towards Landmark and/or its customers prior and up-to the date of dis-association;
<br>
 <br> vi. not to misuse, exploit any of the business software/systems/applications you were given access to.
<br>
<br>
<br>Any act of omission or commission on your part and/or wrongful use of the training and examination certificate (granted by us) and/or wrongful use of other papers, documents, information, software/ systems/applications etc., shall be at your sole risk, responsibility and liability.
<br>
<br>We thank you for choosing us, to be part of our growth journey.
<br>
<br>In case of any clarification/assistance, you may write to us at customercare@policyboss.com.
<br>
<br>Regards,
<br>For Landmark Insurance Brokers Private Limited
<br>[IRDAI CoR: 216]
<br>
<br>
<br>Team Landmark
<br>
<br>
<br>**************`;
    return mail_content;
}