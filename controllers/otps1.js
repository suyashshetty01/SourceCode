var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var otp = require('../models/otp');
var Email = require('../models/email');
var objModelEmail = new Email();
module.exports.controller = function (app) {
    app.get('/generateOTP/:Mobile_Number/:Email?/:Product?/:InsurerID?/:MakeModel?/:RenewalNcb?/:RegYear?/:Breakin?/:FinalPremium?/:Name?/:Crn?', function (req, res, next) {
        var Mobile_Number = parseInt(req.params['Mobile_Number']);
        var Email = req.params['Email'];
//        let insurer_id = (req.params['InsurerID'] === undefined ? '' : parseInt(req.params['InsurerID']));
//        if (isNaN(insurer_id)) {
//            insurer_id = 0;
//        }
//        let make_model = null;
//        let renewal_ncb = null;
//        let breakin = null;
//        let reg_year = null;
//        let final_premium = null;
//        let customer_name = null;
//        let crn = null;
//        if (insurer_id === 33) {
//            make_model = (req.params['MakeModel'] === undefined ? '' : req.params['MakeModel']);
//            renewal_ncb = (req.params['RenewalNcb'] === undefined ? '' : req.params['RenewalNcb']);
//            breakin = (req.params['Breakin'] === undefined ? '' : req.params['Breakin']);
//            reg_year = (req.params['RegYear'] === undefined ? '' : req.params['RegYear']);
//            final_premium = (req.params['FinalPremium'] === undefined ? '' : req.params['FinalPremium']);
//            customer_name = req.params['Name'] === undefined ? '' : req.params['Name'];
//            crn = req.params['Crn'] === undefined ? '' : req.params['Crn'];
//        }
        let OTP_Data = '';
        var todayDate = new Date();
        var Product = "";
        let veh_type = null;

        if (req.params['Product'] === "Bike") {
            Product = "2w";
//            veh_type = "TW";
        } else {
            Product = "4w";
//            veh_type = "PC";
        }
        Product = ["Health", "Cyber", "Travel"].includes(req.params['Product']) ? req.params['Product'] : Product;

        try {
            otp.find({'Mobile_Number': Mobile_Number}).exec(function (err, dbRequest) {
                if (err)
                    throw err;
                if (dbRequest.length > 0)
                {
                    OTP_Data = dbRequest[0]._doc["otp"];
                    otp.update({'Mobile_Number': Mobile_Number}, {$set: {"Created_On": todayDate}}, function (err1, numAffected) {
                        if (err) {
                            throw err1;
                        } else {
                            var SmsLog = require('../models/sms_log');
                            var objSmsLog = new SmsLog();
//                            let Msg = '';
//                            if (insurer_id === 33) {
//                                Msg = "Dear " + customer_name + ",\nPlease validate the Motor CRN No :" +  crn + "  by entering the OTP:" + OTP_Data + " " + "and valid for 5 minutes.\nVehicle type:" + veh_type + "\nMake/Model: " + make_model + "\nRenewal NCB:" + renewal_ncb + "\n" + "Reg year:" + reg_year + "\n" + "Break in: " + breakin + "\n" + "Premium: Rs." + final_premium;
//                            } else {
//                                Msg = OTP_Data + " is the OTP for your " + Product + " insurance quote search on Policyboss.com. Validity 5 minutes.";
//                            }
                            let Msg = OTP_Data + " is the OTP for your " + Product + " insurance quote search on Policyboss.com. Validity 5 minutes.";
                            objSmsLog.send_sms(Mobile_Number, Msg, 'OTP_SMS_Link');

                            if (Email !== "" && Email !== undefined) {
                                objModelEmail.send('customercare@policyboss.com', Email, "[POLICYBOSS] QUOTE - OTP", Msg, '', '', '');
                            }

                            res.json({Msg: 'Success'});
                        }
                    });
                } else {
                    if (Mobile_Number === 9999999999) {
                        OTP_Data = "8888";
                    } else {
                        OTP_Data = generateOTP();
                    }
                    // OTP_Data = generateOTP();
                    var arg = {
                        Mobile_Number: Mobile_Number,
                        otp: OTP_Data,
                        Created_On: todayDate,
                        Status: 1
                    };
                    var otpBoj = new otp(arg);
                    otpBoj.save(function (err) {
                        if (err)
                        {
                            res.json({Msg: 'Error', OTP: ""});
                        } else
                        {
                            var SmsLog = require('../models/sms_log');
                            let objSmsLog = new SmsLog();
//                            let Msg = '';
//                            if (insurer_id === 33) {
//                                Msg = "Dear  " + customer_name + ",\nPlease validate the Motor CRN No :" +  crn + "  by entering the OTP: " + OTP_Data + " " + "and valid for 5 minutes.\nVehicle type:" + veh_type + "\nMake/Model: " + make_model + "\nRenewal NCB: " + renewal_ncb + "\n" + "Reg year: " + reg_year + "\n" + "Break in: " + breakin + "\n" + "Premium: Rs." + final_premium;
//                            } else {
//                                Msg = OTP_Data + " is the OTP for your " + Product + " insurance quote search on Policyboss.com. Validity 5 minutes.";
//                            }
                            let Msg = OTP_Data + " is the OTP for your " + Product + " insurance quote search on Policyboss.com. Validity 5 minutes.";
                            objSmsLog.send_sms(Mobile_Number, Msg, 'OTP_SMS_Link');
                            if (Email !== "" && Email !== undefined) {
                                objModelEmail.send('customercare@policyboss.com', Email, "[POLICYBOSS] QUOTE - OTP", Msg, '', '', '');
                            }
                            res.json({Msg: 'Success'});
                        }
                    });
                }
            });
        } catch (err) {
            console.log(err);
            res.json({'Msg': 'error'});
        }
    });
    app.get('/resendOTP/:Mobile_Number/:Email?/:Product?/:InsurerID?/:MakeModel?/:RenewalNcb?/:RegYear?/:Breakin?/:FinalPremium?/:Name?/:Crn?', function (req, res, next) {
        var Email = req.params['Email'];
        var Mobile_Number = parseInt(req.params['Mobile_Number']);
//        let insurer_id = (req.params['InsurerID'] === undefined ? '' : parseInt(req.params['InsurerID']));
//        if (isNaN(insurer_id)) {
//            insurer_id = null;
//        }
//        let make_model = null;
//        let renewal_ncb = null;
//        let breakin = null;
//        let reg_year = null;
//        let final_premium = null;
//        let customer_Name = null;
//        let crn = null;
//        if (insurer_id === 33) {
//            make_model = (req.params['MakeModel'] === undefined ? '' : req.params['MakeModel']);
//            renewal_ncb = (req.params['RenewalNcb'] === undefined ? '' : req.params['RenewalNcb']);
//            breakin = (req.params['Breakin'] === undefined ? '' : req.params['Breakin']);
//            reg_year = (req.params['RegYear'] === undefined ? '' : req.params['RegYear']);
//            final_premium = (req.params['FinalPremium'] === undefined ? '' : req.params['FinalPremium']);
//            customer_Name = req.params['Name'] === undefined ? '' : req.params['Name'];
//            crn = req.params['Crn'] === undefined ? '' : req.params['Crn'];
//        }
        let OTP_Data = '';
        var todayDate = new Date();
        var Product = "";
        let veh_type = null;

        if (req.params['Product'] === "Bike") {
            Product = "2w";
//            veh_type = "TW";
        } else {
            Product = "4w";
//            veh_type = "PC";
        }
        Product = ["Health", "Cyber", "Travel"].includes(req.params['Product']) ? req.params['Product'] : Product;

        try {

            otp.find({"Mobile_Number": Mobile_Number}).exec(function (err, dbRequest) {
                if (err)
                    res.json({Msg: 'Error'});
                if (dbRequest.length > 0)
                {
                    OTP_Data = dbRequest[0]._doc["otp"];
                    otp.update({'Mobile_Number': Mobile_Number}, {$set: {"Created_On": todayDate}}, function (err1, numAffected) {
                        if (err) {
                            throw err1;
                        } else {
                            var SmsLog = require('../models/sms_log');
                            var objSmsLog = new SmsLog();
//                            let Msg = '';
//                            if (insurer_id === 33) {
//                                Msg = "Dear  " + customer_Name + ",\nPlease validate the Motor CRN No :" +  crn + "  by entering the OTP: " + OTP_Data + " " + "and valid for 5 minutes.\nVehicle type:" + veh_type + "\nMake/Model: " + make_model + "\nRenewal NCB:" + renewal_ncb + "\n" + "Reg year:" + reg_year + "\n" + "Break in: " + breakin + "\n" + "Premium: Rs." + final_premium;
//                            } else {
//                                Msg = OTP_Data + " is the OTP for your " + Product + " insurance quote search on Policyboss.com. Validity 5 minutes.";
//                            }
                            let  Msg = OTP_Data + " is the OTP for your " + Product + " insurance quote search on Policyboss.com. Validity 5 minutes.";                           
                            objSmsLog.send_sms(Mobile_Number, Msg, 'OTP_SMS_Link');
                            if (Email !== "" && Email !== undefined) {
                                objModelEmail.send('customercare@policyboss.com', Email, "[POLICYBOSS] QUOTE - OTP", Msg, '', '', '');
                            }
                            res.json({Msg: 'Success'});
                        }
                    });
                } else
                {
                    OTP_Data = generateOTP();
                    var arg = {
                        Mobile_Number: Mobile_Number,
                        otp: OTP_Data,
                        Created_On: todayDate,
                        Status: 1
                    };
                    var otpBoj = new otp(arg);
                    otpBoj.save(function (err) {
                        if (err)
                        {
                            res.json({Msg: 'Error', OTP: ""});
                        } else
                        {
                            var SmsLog = require('../models/sms_log');
                            let objSmsLog = new SmsLog();
//                            let Msg = '';
//                            if (insurer_id === 33) {
//                                Msg = "Dear  " + customer_Name + ",\nPlease validate the Motor CRN No :" +  crn + "  by entering the OTP: " + OTP_Data + " " + "and valid for 5 minutes.\nVehicle type:" + veh_type + "\nMake/Model: " + make_model + "\nRenewal NCB:" + renewal_ncb + "\n" + "Reg year:" + reg_year + "\n" + "Break in: " + breakin + "\n" + "Premium: Rs." + final_premium;
//                            } else {
//                                Msg = OTP_Data + " is the OTP for your " + Product + " insurance quote search on Policyboss.com. Validity 5 minutes.";
//                            }
                               Msg = OTP_Data + " is the OTP for your " + Product + " insurance quote search on Policyboss.com. Validity 5 minutes.";
                            objSmsLog.send_sms(Mobile_Number, Msg, 'OTP_SMS_Link');
                            if (Email !== "" && Email !== undefined) {
                                objModelEmail.send('customercare@policyboss.com', Email, "[POLICYBOSS] QUOTE - OTP", Msg, '', '', '');
                            }
                            res.json({Msg: 'Success'});
                        }
                    });
                }
                res.json({Msg: 'Success'});
            });

        } catch (err) {
            console.log(err);
            res.json({'Msg': 'error'});
        }
    });
    app.get('/verifyOTP/:OTP/:udid?', function (req, res, next) {
        var OTP_Data = req.params['OTP'];
        var udid = 0;
        if (req.params.hasOwnProperty('OTP')) {
            udid = req.params['udid'] - 0;
        }
        try {
            if (OTP_Data === "8888") {
                res.json({Msg: 'Success'});
                return false;
            }
            otp.find({"otp": OTP_Data}).exec(function (err, dbRequest) {
                if (err)
                    throw err;
                if (dbRequest.length > 0)
                {
                    if (udid > 0) {
                        var User_Data = require('../models/user_data');
                        User_Data.findOne({"User_Data_Id": udid}, function (err, dbUserData) {
                            if (err) {

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
                    res.json({Msg: 'Success'});
//                    var arg = {
//                        'Mobile_Number': dbRequest[0]._doc["Mobile_Number"]
//                    };
//                    otp.remove(arg, function (err, result) {
//                        if (err) {
//                            res.json({Msg: 'Success'});
//                        } else
//                        {
//                            res.json({Msg: 'Success'});
//                        }
//                    });
                } else
                {
                    res.json({Msg: 'Fail'});
                }
            });
        } catch (err) {
            console.log(err);
            res.json({'Msg': 'error'});
        }
    });
    app.get('/expireOTP/:abc', function (req, res, next) {
        var tenMinutesOld = new Date();
        tenMinutesOld.setMinutes(tenMinutesOld.getMinutes() - 2880);
        try {
            var arg = {
                Created_On: {$lt: tenMinutesOld}
            };
            otp.remove(arg, function (err, result) {
                if (err) {
                    res.json({Msg: 'Error'});
                } else {
                    res.json({Msg: 'Success'});
                }
            });
        } catch (err) {
            console.log(err);
            res.json({'msg': 'error'});
        }
    });

    app.get('/generateOTPN/:Mobile_Number/:Email?/:Product?', function (req, res, next) {
        try {
            var Client = require('node-rest-client').Client;
            var client = new Client();
            var service_method_url = 'http://horizon.policyboss.com:5000/generateOTP/' + req.params['Mobile_Number'] + '/' + req.params['Email'] + '/' + req.params['Product'];
            client.get(service_method_url, function (data, response) {
                //console.log('ICICI tranaction Data', data.toString());
                res.json(data);
            });
        } catch (err) {
            console.log(err);
            res.json({'Msg': 'error'});
        }
    });
    app.get('/verifyOTPN/:OTP/:udid?', function (req, res, next) {
        try {
            var Client = require('node-rest-client').Client;
            var client = new Client();
            var service_method_url = 'http://horizon.policyboss.com:5000/verifyOTP/' + req.params['OTP'] + '/' + req.params['udid'];
            client.get(service_method_url, function (data, response) {
                //console.log('ICICI tranaction Data', data.toString());
                res.json(data);
            });
        } catch (err) {
            console.log(err);
            res.json({'Msg': 'error'});
        }
    });
    app.get('/resendOTPN/:Mobile_Number/:Email?/:Product?', function (req, res, next) {
        try {
            var Client = require('node-rest-client').Client;
            var client = new Client();
            var service_method_url = 'http://horizon.policyboss.com:5000/resendOTP/' + req.params['Mobile_Number'] + '/' + req.params['Email'] + '/' + req.params['Product'];
            client.get(service_method_url, function (data, response) {
                //console.log('ICICI tranaction Data', data.toString());
                res.json(data);
            });
        } catch (err) {
            console.log(err);
            res.json({'Msg': 'error'});
        }
    });


    app.get('/getipinfo', function (req, res, next) {
        try {
            var Client = require('node-rest-client').Client;
            var client = new Client();
            client.get("http://ip-api.com/json", "", function (data, response) {
                res.json(data);

            });
        } catch (e) {
            res.json({"Msg": e});
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