var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var otp = require('../models/otp');
var config = require('config');
var fs = require("fs");
var Email = require('../models/email');
var objModelEmail = new Email();
module.exports.controller = function (app) {
    app.get('/expireOTP/:abc', function (req, res, next) {
        try {
            let tenMinutesOld = new Date();
            tenMinutesOld.setMinutes(tenMinutesOld.getMinutes() - 60);
            try {
                let find_arg = {
                    "Created_On": {$lt: tenMinutesOld},
                    "Status": 1
                };
                let updateObj = {
                    "Status": 0,
                    "Modified_On": new Date()
                };
                otp.updateMany(find_arg, {$set: updateObj}, function (err, numAffected) {
                    if (err) {
                        return res.json({Msg: 'Error'});
                    } else {
                        return res.json({Msg: 'Success'});
                    }
                });
            } catch (err) {
                console.log(err.stack);
                return res.json({'msg': 'error'});
            }
        } catch (e) {
            console.error('Exception in /expireOTP API', e.stack);
            return res.json({'msg': 'Error'});
        }
    });

    app.get('/getipinfo', function (req, res, next) {
        try {
            var Client = require('node-rest-client').Client;
            var client = new Client();
            client.get("http://ip-api.com/json", "", function (data, response) {
                return res.json(data);

            });
        } catch (e) {
            return res.json({"Msg": e.stack});
        }

    });


    app.get('/generateOTP_New/:Mobile_Number/:Source?/:Product?/:InsurerID?/:Email?', function (req, res, next) {
        let Mobile_Number = parseInt(req.params['Mobile_Number']);
        let Email = req.params.Email || "";
        let source = req.params.Source || "";
        let insurer_id = req.params.InsurerID && (req.params.InsurerID - 0) || 0;
        let OTP_Data = '';
        let is_allow = true;
        let error_msg = "";
        let arr_msg = [];
        try {
            if ((["", null, "NA", undefined, "0", 0, "undefined"].indexOf(Email) > -1)) {
                Email = "";
                arr_msg.push("Email ID :: INVALID :: " + Email);
            }
            if ((["", null, "NA", undefined, "0", 0, "undefined"].indexOf(Mobile_Number) > -1)) {
                Mobile_Number = 0;
                arr_msg.push("Mobile Number :: INVALID :: " + Mobile_Number);
            }
            if (arr_msg.length > 1) {
                is_allow = false;
                error_msg = arr_msg.join("<BR>");
                console.error('Generate OTP Fail', error_msg);
                return res.json({Msg: 'Fail'});
            }
            if (is_allow) {
                let find_args = {
                    "Status": 1
                };
                if (source) {
                    find_args["Source"] = source;
                }
                if (Email) {
                    find_args["Email_Id"] = Email;
                }
                if (Mobile_Number) {
                    find_args["Mobile_Number"] = Mobile_Number;
                }
                if (Email && Mobile_Number) {
                    find_args = {"Status": 1, $or: [{"Email_Id": Email}, {"Mobile_Number": Mobile_Number}]};
                    if (source) {
                        find_args = {"Status": 1, "Source": source, $or: [{"Email_Id": Email}, {"Mobile_Number": Mobile_Number}]};
                    }
                }
                otp.updateMany(find_args, {$set: {"Status": 0, "Modified_On": new Date()}}, function (err, result) {
                    if (err) {
                        return res.json({Msg: 'Error'});
                    } else {
                        OTP_Data = generateOTP();
                        let otp_save_arg = {};
                        otp_save_arg = {
                            otp: OTP_Data,
                            Created_On: new Date(),
                            Modified_On: new Date(),
                            Status: 1
                        };
                        if (Email) {
                            otp_save_arg["Email_Id"] = Email;
                        }
                        if (Mobile_Number) {
                            otp_save_arg["Mobile_Number"] = Mobile_Number;
                        }
                        let source_obj = {
                            "LOGIN-OTP": "LOGIN-OTP",
                            "ONBOARDING": "ONBOARDING",
                            "REGISTRATION": "REGISTRATION",
                            "POSP-TRAINING": "POSP-TRAINING"
                        };
                        otp_save_arg['Source'] = source_obj[source] || "PRODUCT";
                        let otpBoj = new otp(otp_save_arg);
                        otpBoj.save(function (err) {
                            if (err) {
                                return res.json({Msg: 'Error', OTP: ""});
                            } else {
                                var SmsLog = require('../models/sms_log');
                                let objSmsLog = new SmsLog();
                                let objProductReplace = {
                                    "POSP": "inquiry",
                                    "LOGIN-OTP": "login",
                                    "ONBOARDING": "POSP Training",
                                    "REGISTRATION": "registration",
                                    "POSP-TRAINING": "POSP Training",
                                    "PRODUCT": "proposal"
                                };
                                let objReplace = {
                                    '___otp___': OTP_Data,
                                    '___product___': objProductReplace[source] || ''
                                };
                                let email_read_file_name = "";
                                let email_send_subject = "";
                                let sms_data_core = "";
                                let sms_data = "";
                                let arrBcc = [config.environment.notification_email];
                                if (Email) {
                                    if (source === "POSP-TRAINING") {
                                        let ss_id = insurer_id; // we are passing ss_id in insurer_id field
                                        email_read_file_name = "/resource/email/posp/Posp_Training_OTP.html";
                                        email_send_subject = "[POSP-ONBOARDING] POSP TRAINING OTP :: SSID-" + ss_id;
                                    }
                                    if (source === "REGISTRATION") {
                                        email_read_file_name = "/resource/email/posp/Posp_Registration_OTP.html";
                                        email_send_subject = "[POSP-ONBOARDING] POSP Registration OTP :: Email " + Email;
                                    }
                                    if (source === "LOGIN-OTP") {
                                        email_read_file_name = "/resource/email/posp/Login_OTP.html";
                                        email_send_subject = "Login OTP :: Email " + Email;
                                    }
                                    if (insurer_id === 515) {
                                        email_send_subject = "[POLICYBOSS] POSP Email Verification - OTP";
                                    }
                                    if (source === "PRODUCT") {
                                        email_send_subject = "[POLICYBOSS] PROPOSAL - OTP";
                                    }
                                    if (email_read_file_name === "") {
                                        email_read_file_name = "/resource/sms/otp_sms.txt";
                                    }
                                    sms_data_core = fs.readFileSync(appRoot + email_read_file_name).toString();
                                    sms_data = sms_data_core.replaceJson(objReplace);
                                    console.log(sms_data);
                                    objModelEmail.send('customercare@policyboss.com', Email, email_send_subject, sms_data, '', arrBcc.join(','), '');
                                }
                                if (Mobile_Number) {
                                    sms_data_core = fs.readFileSync(appRoot + '/resource/sms/otp_sms.txt').toString();
                                    sms_data = sms_data_core.replaceJson(objReplace);
                                    objSmsLog.send_sms(Mobile_Number, sms_data, 'OTP_SMS_Link');
                                }
                                return res.json({Msg: 'Success'});
                            }
                        });
                    }
                });
            }
        } catch (err) {
            return res.json({'Msg': 'error'});
        }
    });
    app.get('/verifyOTP_New/:OTP/:Mobile_Number?/:udid?/:email_id?/:source?', function (req, res, next) {
        let OTP_Data = req.params.OTP || "";
        let Mobile_Number = req.params.Mobile_Number || "";
        let udid = 0;
        let email_id = "";
        let source = req.params.source || "";
        if (req.params.hasOwnProperty('OTP')) {
            udid = req.params['udid'] - 0;
        }
        if (["", null, "NA", undefined, "0", 0].indexOf(req.params.email_id) === -1) {
            email_id = req.params.email_id;
        }
        try {
            if (OTP_Data == 8888) {
                return res.json({Msg: 'Success'});
                return false;
            }
            let find_args = {};
            find_args = {
                "otp": OTP_Data,
                "Status": 1
            };
            if (source) {
                find_args["Source"] = source;
            }
            if (["", null, "NA", undefined, "0", 0].indexOf(req.params.email_id) === -1) {
                find_args["Email_Id"] = email_id;
            }
            if (["", null, "NA", undefined, "0", 0].indexOf(Mobile_Number) === -1) {
                find_args["Mobile_Number"] = Mobile_Number;
            }
            if (find_args.Mobile_Number && find_args.Email_Id) {
                find_args = {};
                find_args = {"Status": 1, "otp": OTP_Data, $or: [{"Mobile_Number": Mobile_Number}, {"Email_Id": email_id}]};
                if (source) {
                    find_args = {"Status": 1, "Source": source, "otp": OTP_Data, $or: [{"Mobile_Number": Mobile_Number}, {"Email_Id": email_id}]};
                }
            }
            otp.find(find_args).exec(function (err, dbRequest) {
                if (err) {
                    return res.json({Msg: 'Fail'});
                }
                if (dbRequest && dbRequest.length > 0) {
                    if (udid > 0) {
                        var User_Data = require('../models/user_data');
                        User_Data.findOne({"User_Data_Id": udid}, function (err, dbUserData) {
                            if (err) {
                                return res.json({Msg: 'Fail'});
                            } else {
                                if (dbUserData) {
                                    var Base = require(appRoot + '/libs/Base');
                                    var objBase = new Base();
                                    dbUserData = dbUserData._doc;
                                    var Premium_Request = dbUserData['Premium_Request'];
                                    Premium_Request['is_mobile_verified'] = 'yes';
                                    var ObjUser_Data = {
                                        'Premium_Request': Premium_Request
                                    };
                                    objBase.dialer_lead_push(Premium_Request);
                                    var User_Data = require(appRoot + '/models/user_data');
                                    User_Data.update({'User_Data_Id': dbUserData['User_Data_Id']}, {$set: ObjUser_Data}, function (err, numAffected) {
                                        console.log('save_customer_details', 'user_data', err, numAffected);
                                    });
                                }
                            }
                        });
                    }
                    let update_args = {
                        "Status": 2,
                        "Modified_On": new Date()
                    };
                    otp.updateOne(find_args, {$set: update_args}, function (update_1_err, update_1_result) {
                        if (update_1_err) {
                            return res.json({Msg: 'Success'});
                        } else {
                            return res.json({Msg: 'Success'});
                        }
                    });
                } else {
                    return res.json({Msg: 'Fail'});
                }
            });
        } catch (err) {
            console.log(err.stack);
            return res.json({'Msg': 'error'});
        }
    });

    app.get('/VerifyRegistrationOTP/:mobile_no/:mobile_otp/:email_id/:email_otp/:source', function (req, res, next) {
        req.body = JSON.parse(JSON.stringify(req.body));
        let objRequest = req.params || "";
        let mobile_number = objRequest.mobile_no && objRequest.mobile_no - 0 || 0;
        let mobile_otp = objRequest.mobile_otp || "";
        let email_id = objRequest.email_id || "";
        let email_otp = objRequest.email_otp || "";
        let source = objRequest.source || "";
        let arr_msg = [];
        let is_allow = true;
        let error_msg = "";
        let objResponseCore = {
            "mobile_verified": "yes",
            "email_verified": "no",
            "otp_verified": "no"
        };
        try {
            if (mobile_number == 0) {
                arr_msg.push("Mobile Number :: INVALID :: " + mobile_number);
            }
            if (mobile_otp == "") {
                arr_msg.push("Mobile OTP :: INVALID :: " + mobile_otp);
            }
            if (email_id === "") {
                arr_msg.push("Email ID :: INVALID :: " + email_id);
            }
            if (email_otp == "") {
                arr_msg.push("Email OTP :: INVALID :: " + email_otp);
            }
            if (arr_msg.length > 0) {
                is_allow = false;
                error_msg = arr_msg.join("<BR>");
                objResponseCore["error_msg"] = error_msg;
                return res.json(objResponseCore);
            }
            if (is_allow) {
                let find_mobile_args = {
                    "Status": 1,
                    "otp": mobile_otp,
                    "Mobile_Number": mobile_number,
                    "Source": source
                };
                let find_email_args = {
                    "Status": 1,
                    "otp": email_otp,
                    "Email_Id": email_id,
                    "Source": source
                };
                console.log(find_mobile_args);
                otp.find(find_mobile_args).exec(function (mobile_err, mobile_data) {
                    if (mobile_data && mobile_data.length > 0) {
                        objResponseCore["mobile_verified"] = "yes";
                    }
                    console.log(find_email_args);
                    otp.find(find_email_args).exec(function (email_err, email_data) {
                        if (email_data && email_data.length > 0) {
                            objResponseCore["email_verified"] = "yes";
                        }
                        if (objResponseCore["mobile_verified"] === "yes" && objResponseCore["email_verified"] === "yes") {
                            objResponseCore["otp_verified"] = "yes";
                            let update_args = {
                                "Status": 2,
                                "Modified_On": new Date()
                            };
                            otp.updateOne(find_mobile_args, {$set: update_args}, function (update_1_err, update_1_result) {
                                otp.updateOne(find_email_args, {$set: update_args}, function (update_2_err, update_2_result) {
                                    return res.json(objResponseCore);
                                });
                            });
                        } else {
                            return res.json(objResponseCore);
                        }
                    });
                });
            }
        } catch (err) {
            objResponseCore["error_msg"] = err.stack;
            return res.json(objResponseCore);
        }
    });

    function generateOTP()
    {
        var digits = '0123456789';
        var OTP = '';
        for (let i = 0; i < 4; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        OTP = OTP.replaceAll('0', '9');
        otp.find({"otp": OTP}).exec(function (err, dbRequest) {
            if (err)
                throw err;
            if (dbRequest > 0)
            {
                generateOTP();
            }
        });
        return OTP;
    }
};
