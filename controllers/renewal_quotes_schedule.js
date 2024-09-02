/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
var Base = require('../libs/Base');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var config = require('config');
var moment = require('moment');
var sleep = require('system-sleep');
var fs = require('fs');
var pdf = require('html-pdf');
var appRoot = path.dirname(path.dirname(require.main.filename));
var User_Data = require('../models/user_data');
var excel = require('excel4node');
var Lead = require('../models/leads');
//var win32ole = require('win32ole');
//var ExcelJS = require('exceljs');

module.exports.controller = function (app) {
    //app.get('/renewal_quotes_schedule', function (req, res) {
    app.post('/renewal_quotes/schedule', function (req, res, next) {
        var Product_Id = (req.body['product_id']);
        var From_Date = (req.body['from_date']);
        var To_Date = (req.body['to_date']);
        try {
            var Lead = require(appRoot + '/models/leads');
            From_Date = '2020-12-01';
            To_Date = '2020-12-05';
            Product_Id = 1;
            var renew_cond = {
                'renewal_data.Erp_Qt_Request_Core.___policy_end_date___': {$gte: From_Date, $lt: To_Date},
                'renewal_data.Erp_Qt_Request_Core.___product_id___': Product_Id,
                'lead_type': 'renewal',
                'lead_status': 'pending'
            };
            Lead.find(renew_cond, {_id: 0}, function (err, quote_data) {
                try {
                    if (err)
                        throw err;
                    //res.json(quote_data);
                    if (parseInt(quote_data.length) > 0) {

                        for (var quotecount in quote_data) {
                            var dbUserData = [];
                            dbUserData = quote_data[quotecount]._doc;
                            var moment = require('moment');
                            var Premium_Request = dbUserData.renewal_data.Premium_Request;
                            var Erp_Qt_Request_Core = dbUserData.renewal_data.Erp_Qt_Request_Core;
                            //Premium_Request['policy_expiry_date'] = moment(Erp_Qt_Request_Core['___policy_end_date___']).add(11, "days").format("YYYY-MM-DD");
                            Premium_Request['policy_expiry_date'] = Erp_Qt_Request_Core['___policy_end_date___'];
                            Premium_Request['prev_insurer_id'] = Erp_Qt_Request_Core['___insurer_id___'];
                            Premium_Request['electrical_accessory'] = "0";
                            Premium_Request['non_electrical_accessory'] = "0";
                            Premium_Request['is_llpd'] = "no";
                            Premium_Request['is_breakin'] = "no";
                            Premium_Request['is_policy_exist'] = "yes";
                            Premium_Request['is_antitheft_fit'] = "no";
                            Premium_Request['voluntary_deductible'] = "0";
                            Premium_Request['is_aai_member'] = "no";
                            Premium_Request['pa_named_passenger_si'] = "0";
                            Premium_Request['pa_unnamed_passenger_si'] = "0";
                            Premium_Request['pa_unnamed_passenger_si'] = "0";
                            Premium_Request['registration_no'] = Erp_Qt_Request_Core['___registration_no___'];
                            Premium_Request['first_name'] = Erp_Qt_Request_Core['___first_name___'];
                            Premium_Request['middle_name'] = Erp_Qt_Request_Core['___middle_name___'];
                            Premium_Request['last_name'] = Erp_Qt_Request_Core['___last_name___'];
                            Premium_Request['mobile'] = Erp_Qt_Request_Core['___mobile___'];
                            Premium_Request['email'] = Erp_Qt_Request_Core['___email___'];
                            var args = {
                                data: Premium_Request,
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            };
                            var url_api = config.environment.weburl + '/quote/premium_initiate';
                            var Client = require('node-rest-client').Client;
                            var client = new Client();
                            client.post(url_api, args, function (data, response) {
                                console.log("renewal_quotes_schedule data - ", data);
                                console.log("renewal_quotes_schedule data - ", response);
                                try {
                                    var product_name = 'Car';
                                    var product_url = 'car-insurance';
                                    if (data.Request['product_id'] === 10) {
                                        product_name = 'TW';
                                        product_url = 'two-wheeler-insurance';
                                    }
                                    var objProduct = {
                                        '1': 'Car',
                                        '2': 'Health',
                                        '10': 'TW',
                                        '12': 'CV',
                                        '13': 'Marine',
                                        '5': 'Investment'
                                    };

                                    var quote_url = config.environment.portalurl + '/' + product_url + '/quotes?SID=' + data.Summary.Request_Unique_Id + '&ClientID=2';
                                    var fs = require('fs');
                                    var email_data = '';
                                    var ObjQr = {
                                        'chl': quote_url,
                                        'chld': 'L|4',
                                        'choe': 'UTF-8',
                                        'chs': '150x150',
                                        'cht': 'qr'
                                    };
                                    var qs = '';
                                    for (var k in ObjQr) {
                                        qs += k + '=' + encodeURIComponent(ObjQr[k]) + '&';
                                    }

                                    email_data = fs.readFileSync(appRoot + '/resource/email/Send_Quote_Link.html').toString();
                                    var Email = require('../models/email');
                                    var objModelEmail = new Email();
                                    var objEmail = {
                                        '___crn___': data.Request['crn'],
                                        '___contact_name___': data.Request['first_name'],
                                        '___short_url___': quote_url,
                                        '___insurance_type___': data.Request['vehicle_insurance_subtype'],
                                        '___qr_source___': "http://chart.googleapis.com/chart?" + qs
                                    };
                                    var product_short_name = objProduct[data.Request['product_id']];
                                    var sub = '[' + config.environment.name.toString().toUpperCase() + ']INFO-PolicyBoss.com-Policy Private ' + product_short_name + ' Quote for CRN : ' + data.Request['crn'];
                                    email_body = email_data.replaceJson(objEmail);
                                    if (config.environment.name === 'Production') {
                                        objModelEmail.send('noreply@landmarkinsurance.co.in', 'policybosstesting@gmail.com', sub, email_body, '', '', '');
                                    } else if (config.environment.name === 'QA') {
                                        objModelEmail.send('noreply@landmarkinsurance.co.in', 'policybosstesting@gmail.com', sub, email_body, '', '', '');
                                    } else {
                                        objModelEmail.send('noreply@landmarkinsurance.co.in', 'policybosstesting@gmail.com', sub, email_body, '', '', '');
                                    }
                                } catch (e) {
                                    console.log("renewal_quotes_schedule", e);
                                    res.json(e);
                                }
                            });
                            sleep(2000);

                        }
                        res.json({'msg': 'Success'});
                    } else {
                        res.json({'msg': 'No Data Avilable'});
                    }
                } catch (e) {
                    console.log("renewal_quotes_schedule", e);
                    res.json(e);
                }
            });
        } catch (err) {
            console.log(err);
            res.json({'msg': 'error'});
        }

    });

    app.get('/renewal_quotes/get_lead_data/:Product_Id/:Ss_Id/:Fba_Id/:Page?', function (req, res, next) {
        try {
            var objRequest = this;
            var Product_Id = req.params.Product_Id - 0;
            var Ss_Id = req.params.Ss_Id - 0;
            var Fba_Id = req.params.Fba_Id - 0;
            var Lead = require(appRoot + '/models/leads');
            var From_Date = moment().format('YYYY-MM-DD');
            var To_Date = moment(From_Date, "YYYY-MM-DD").add(45, 'days').format('YYYY-MM-DD');
            var pageCount = 0;
            var Page = req.params.Page - 0;
            var Skip = 0;
            var Limit = 10;
            var objRequest_new = {
                "product_id": Product_Id,
                "ss_id": Ss_Id,
                "user_data": User_Data,
                "from_date": From_Date,
                "to_date": To_Date,
                "pagecount": pageCount,
                "page": Page,
                "skip": Skip,
                "limit": Limit
            };
            objRequest['objRequest'] = objRequest_new;
            var renew_cond = {
                'policy_expiry_date': {$gte: From_Date, $lt: To_Date},
                'Product_Id': Product_Id,
                'ss_id': Ss_Id,
                'fba_id': Fba_Id,
                'lead_status': 'pending'
            };
            //User_Data.find({Product_Id: Product_Id, Last_Status: {$in: ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY']}, "Erp_Qt_Request_Core.___policy_end_date___": {$gte: From_Date, $lt: To_Date}, "Erp_Qt_Request_Core.___ss_id___": Ss_Id}, {_id: 0}, function (err, dbUsers) {
            Lead.find(renew_cond, {_id: 0}, function (err, dbUsers) {
                objRequest['pageCount'] = dbUsers.length;
                pageCount = dbUsers.length;
                if (pageCount > 0) {
                    //page is 
                    if (Page > 1) {
                        Skip = Limit * (Page - 1);
                    }
                    //User_Data.find({Product_Id: Product_Id, Last_Status: new RegExp(Last_Status, 'i'), "Erp_Qt_Request_Core.___policy_end_date___": {$gte: From_Date, $lt: To_Date}, "Erp_Qt_Request_Core.___ss_id___": objRequest['objRequest']['Ss_Id']}, {_id: 0}, function (err, quote_data) {
                    Lead.find(renew_cond, {_id: 0}).skip(Skip).limit(Limit).exec(function (err, quote_data) {
                        try {
                            if (err)
                                throw err;
                            //res.json(quote_data);
                            if (parseInt(quote_data.length) > 0) {
                                quote_data[0]['_doc']['pageCount'] = pageCount;
                                res.json(quote_data);
                            } else {
                                res.json({'msg': 'No Data Avilable'});
                            }
                        } catch (e) {
                            console.log("renewal_quotes_schedule", e);
                            res.json(e);
                        }
                    });
                } else {
                    res.json({'msg': 'No Data Avilable'});
                }
            });
        } catch (err) {
            console.log(err);
            res.json({'msg': 'error'});
        }

    });

    app.get('/renewal_quotes/get_fresh_quotes_data/:Fresh_Quote_Id', function (req, res) {
        var Fresh_Quote = require('../models/fresh_quote');
        Fresh_Quote.find({'Fresh_Quote_Id': req.params['Fresh_Quote_Id'] - 0}).sort({'Fresh_Quote_Id': 1}).select('-_id').exec(function (err, dbFresh_Quotes) {
            if (err) {
                res.send(err);
            } else {
                res.json(dbFresh_Quotes);
            }
        });
    });

    app.get('/renewal_quotes/set_lead_data', function (req, res, next) {
        try {
            var objRequest = this;
            var days = (req.query.hasOwnProperty('days')) ? req.query.days - 0 : 46;
            //var Product_Id = req.params.Product_Id - 0;
            //var Ss_Id = req.params.Ss_Id - 0;
            var User_Data = require('../models/user_data');
            var From_Date = moment().format('YYYY-MM-DD');
            var To_Date = moment(From_Date, "YYYY-MM-DD").add(days, 'days').format('YYYY-MM-DD');
            console.error('Renewal Lead From_Date -' + From_Date + ' To_Date - ' + To_Date);
            var lead_res = {
                "Status": "",
                "Msg": "",
                "Data_Exception": [],
                "Data_Inner_Exception": []
            };
            //User_Data.find({Product_Id: Product_Id, Last_Status: {$in: ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY']}, "Erp_Qt_Request_Core.___policy_end_date___": {$gte: From_Date, $lt: To_Date}, "Erp_Qt_Request_Core.___ss_id___": Ss_Id}, {_id: 0}, function (err, dbUsers) {
            User_Data.find({Product_Id: {$in: [1, 10]}, Last_Status: {$in: ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY']}, "Erp_Qt_Request_Core.___policy_end_date___": To_Date}, {_id: 0}, function (err, quote_data) {
                //objRequest['pageCount'] = dbUsers.length;
                //pageCount = dbUsers.length;
                console.error('Renewal Lead Length- ' + quote_data.length);
                if (quote_data.length > 0) {
                    for (var i in quote_data) {
                        let rwnluserData = quote_data[i]._doc;
                        let ErpqtRqst = rwnluserData.Erp_Qt_Request_Core;
                        try {
                            let arg = {
                                "PB_CRN": ErpqtRqst['___crn___'],
                                "User_Data_Id": ErpqtRqst['___udid___'],
                                "ss_id": isNaN(ErpqtRqst['___ss_id___']) ? 0 : ErpqtRqst['___ss_id___'],
                                "fba_id": isNaN(ErpqtRqst['___fba_id___']) ? 0 : ErpqtRqst['___fba_id___'],
                                "Created_On": new Date(),
                                "Modified_On": new Date(),
                                "Product_Id": ErpqtRqst['___product_id___'],
                                "previous_policy_number": rwnluserData.Transaction_Data['policy_number'],
                                "prev_policy_start_date": ErpqtRqst['___policy_start_date___'],
                                "policy_expiry_date": ErpqtRqst['___policy_end_date___'],
                                "engine_number": ErpqtRqst['___engine_number___'],
                                "chassis_number": ErpqtRqst['___chassis_number___'],
                                "company_name": ErpqtRqst['___company_name___'],
                                "Customer_Name": ErpqtRqst['___contact_name___'],
                                "Customer_Address": ErpqtRqst['___communication_address___'],
                                "mobile": ErpqtRqst['___mobile___'],
                                "mobile2": "", //ErpqtRqst['___communication_address___'],
                                "vehicle_insurance_type": ErpqtRqst['___vehicle_insurance_type___'] === "new" ? "N" : "R",
                                "issued_by_username": "", //to be ask
                                "registration_no": ErpqtRqst['___registration_no___'],
                                "nil_dept": ErpqtRqst['___addon_zero_dep_cover___'] === "yes" ? "Yes" : "No",
                                "rti": "", //to be ask
                                "Make_Name": ErpqtRqst['___pb_make_name___'],
                                "Model_ID": ErpqtRqst['___pb_model_id___'],
                                "Model_Name": ErpqtRqst['___pb_model_name___'],
                                "Variant_Name": ErpqtRqst['___pb_variant_name___'],
                                "Vehicle_ID": ErpqtRqst['___vehicle_id___'],
                                "Fuel_ID": ErpqtRqst['___pb_fuel_id___'],
                                "Fuel_Name": ErpqtRqst['___pb_fuel_name___'],
                                "RTO_City": ErpqtRqst['___pb_rto_city___'],
                                "VehicleCity_Id": ErpqtRqst['___pb_vehiclecity_id___'],
                                "VehicleCity_RTOCode": ErpqtRqst['___pb_vehiclecity_rtocode___'],
                                "vehicle_registration_date": ErpqtRqst['___vehicle_registration_date___'],
                                "vehicle_manf_date": ErpqtRqst['___vehicle_manf_date___'],
                                "prev_insurer_id": ErpqtRqst['___insurer_id___'],
                                "vehicle_ncb_current": rwnluserData.Premium_List.Summary.Request_Product['vehicle_ncb_next'],
                                "is_claim_exists": ErpqtRqst['___is_claim_exists___'],
                                "is_renewal_proceed": "yes",
                                "lead_type": "renewal",
                                "lead_status": "pending"
                            };
                            arg['renewal_data'] = {
                                "Erp_Qt_Request_Core": rwnluserData.Erp_Qt_Request_Core,
                                "Premium_Request": rwnluserData.Premium_Request,
                                "PB_CRN": rwnluserData.PB_CRN,
                                "Request_Unique_Id": rwnluserData.Request_Unique_Id,
                                "User_Data_Id": rwnluserData.User_Data_Id
                            };
                            var Lead = require('../models/leads');
                            Lead.findOne({PB_CRN: rwnluserData.PB_CRN - 0, User_Data_Id: rwnluserData.User_Data_Id - 0}, function (e, res) {
                                //Console.error('Renewal Lead Find One'+res);
                                if (e)
                                    throw e;
                                if (res !== null) {
                                    console.log('msg - Data Already Avilable');
                                } else {
                                    if (arg['renewal_data'] && arg['renewal_data']['Erp_Qt_Request_Core'] && arg['renewal_data']['Erp_Qt_Request_Core']['___channel___']) {
                                        var channel = arg['renewal_data']['Erp_Qt_Request_Core']['___channel___'];
                                        if (channel === "DC" || channel === "DIRECT" || channel === "CC") {
                                            prepared_sms(arg['renewal_data']['Erp_Qt_Request_Core']);
                                        }
                                    }
                                    var objModelUserData = new Lead(arg);
                                    objModelUserData.save(function (err, objDbUserData) {
                                        if (err)
                                            throw err;
                                        console.log('msg - Data Enterd');
                                    });
                                }
                            });
                        } catch (e) {
                            console.error('Renewal Lead Inner-' + e.stack);
                            lead_res['Data_Inner_Exception'].push({
                                'msg': e.stack
                            });

                        }
                    }
                    var sleep = require('system-sleep');
                    sleep(5000);
                    lead_res['Status'] = "Success";
                    lead_res['Msg'] = "Data Uploaded Successfylly in Lead";
                    res.json(lead_res);
                } else {
                    lead_res['Status'] = "Success";
                    lead_res['Msg'] = "No Details found";
                    res.json(lead_res);
                }
            });
        } catch (e) {
            console.error('Renewal Lead Exception-' + e.stack);
            lead_res['Data_Exception'].push({
                'msg': e.stack
            });

            res.json(lead_res);
        }

    });

    function prepared_sms(objRequestCore) {
        var obj_product_name = {
            1: 'CAR',
            10: 'TW',
            12: 'CV',
            2: 'HEALTH'
        };
        if (objRequestCore) {
            var SmsLog = require('../models/sms_log');
            var objSmsLog = new SmsLog();
            var customer_msg = "HORIZON-RENEWAL-QUOTE\n\
            ---------------\n\
            Hi " + objRequestCore['___first_name___'] + ",\n\
            Your contact " + objRequestCore['___posp_first_name___'] == 0 ? "PolicyBoss recommens" : (objRequestCore['___posp_first_name___'] + " has recommended") + "\n\some options for your " + obj_product_name[objRequestCore['___product_id___']] + "\n\insurance. Click to see your custom \n\quote, by simply verifying the following.\n\
            pboss.in/rq/" + objRequestCore['___search_reference_number___'].substr((objRequestCore['___search_reference_number___'].length) - 5) + "_" + objRequestCore['___udid___'];
            objSmsLog.send_sms(objRequestCore['___mobile___'], customer_msg, 'ONLINE_RENEWAL', objRequestCore['___crn___']);
        }
    }
    ;
    app.get('/renewal_quotes/update_lead_data', function (req, res, next) {
        try {
            var objRequest = this;
            var Product_Id = req.params.Product_Id - 0;
            var Ss_Id = req.params.Ss_Id - 0;
            var Lead = require('../models/leads');
            var From_Date = moment().format('YYYY-MM-DD');
            var To_Date = moment(From_Date, "YYYY-MM-DD").add(45, 'days').format('YYYY-MM-DD');
            var start_date = new Date();
            start_date.setDate(start_date.getDate() - 1);
            start_date.setHours(00, 00, 00, 000);
            var end_date = new Date();
            end_date.setDate(end_date.getDate() + 0);
            end_date.setHours(00, 00, 00, 000);
            var pageCount = 0;
            var Page = req.params.Page - 0;
            var Skip = 0;
            var Limit = 10;
            var objRequest_new = {
                "product_id": Product_Id,
                "ss_id": Ss_Id,
                "user_data": User_Data,
                "from_date": From_Date,
                "to_date": To_Date,
                "pagecount": pageCount,
                "page": Page,
                "skip": Skip,
                "limit": Limit
            };
            objRequest['objRequest'] = objRequest_new;
            //User_Data.find({Product_Id: Product_Id, Last_Status: {$in: ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY']}, "Erp_Qt_Request_Core.___policy_end_date___": {$gte: From_Date, $lt: To_Date}, "Erp_Qt_Request_Core.___ss_id___": Ss_Id}, {_id: 0}, function (err, dbUsers) {
            User_Data.find({Product_Id: {$in: [1, 10]}, Last_Status: {$in: ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY']}, Modified_On: {$gte: start_date, $lt: end_date}}, {User_Data_Id: 1, PB_CRN: 1, Product_Id: 1}, {_id: 0}, function (err, quote_data) {
                //objRequest['pageCount'] = dbUsers.length;
                //pageCount = dbUsers.length;
                if (parseInt(quote_data.length) > 0) {
                    //page is 
                    var arg = {};
                    for (var i in quote_data) {
                        var rwnluserData = quote_data[i]._doc;
                        var Lead = require('../models/leads');
                        Lead.findOne({PB_CRN: rwnluserData.PB_CRN - 0, User_Data_Id: rwnluserData.User_Data_Id - 0, lead_type: 'renewal', lead_status: 'processed'}, function (e, res) {
                            if (e)
                                throw e;
                            if (res !== null) {
                                console.log('msg - Data Already Updated');
                            } else {
                                //var objModelUserData = new Lead(arg);
                                //objModelUserData.save(function (err, objDbUserData) {
                                Lead.update({PB_CRN: rwnluserData.PB_CRN - 0, User_Data_Id: rwnluserData.User_Data_Id - 0, lead_type: 'renewal'}, {lead_status: 'processed'}, function (err, numAffected) {
                                    if (err)
                                        throw err;
                                    console.log('msg - Data Updated');
                                });
                            }
                        });
                        var sleep = require('system-sleep');
                        sleep(2000);
                    }
                    res.json({'msg': 'Success'});
                } else {
                    res.json({'msg': 'No Data Avilable'});
                }
            });
        } catch (err) {
            console.log(err);
            res.json({'msg': 'error'});
        }

    });

    /*app.get('/renewal_quotes/premium_initiate/:product_id/:user_data_id/:insurance_subtype/:is_claim/:ncb_current?', function (req, res, next) {
     try {
     var objRequest = this;
     var Product_Id = req.params['product_id'];
     var User_Data_Id = req.params['user_data_id'] - 0;
     var Insurance_Subtype = req.params['insurance_subtype'];
     var Is_Claim = req.params['is_claim'];
     var NCB_Current = req.params['ncb_current'];
     var Lead = require(appRoot + '/models/leads');
     var objRequest_new = {
     "product_id": Product_Id,
     "user_data_id": User_Data_Id,
     "insurance_subtype": Insurance_Subtype,
     "is_claim": Is_Claim,
     "ncb_current": NCB_Current,
     "user_data": User_Data
     };
     objRequest = objRequest_new;
     Lead.find({User_Data_Id: User_Data_Id}, {_id: 0}, function (err, quote_data) {
     try {
     if (err)
     throw err;
     //res.json(quote_data);
     if (parseInt(quote_data.length) > 0) {
     
     for (var quotecount in quote_data) {
     var dbUserData = [];
     dbUserData = quote_data[quotecount]._doc;
     var moment = require('moment');
     var Premium_Request = dbUserData.renewal_data.Premium_Request;
     var Erp_Qt_Request_Core = dbUserData.renewal_data.Erp_Qt_Request_Core;
     //Premium_Request['policy_expiry_date'] = moment(Erp_Qt_Request_Core['___policy_end_date___']).add(11, "days").format("YYYY-MM-DD");
     Premium_Request['is_claim_exists'] = objRequest.is_claim;
     Premium_Request['vehicle_ncb_current'] = objRequest.ncb_current;
     Premium_Request['vehicle_insurance_subtype'] = objRequest.insurance_subtype;
     Premium_Request['vehicle_insurance_type'] = "renew";
     Premium_Request['policy_expiry_date'] = Erp_Qt_Request_Core['___policy_end_date___'];
     Premium_Request['prev_insurer_id'] = Erp_Qt_Request_Core['___insurer_id___'];
     Premium_Request['electrical_accessory'] = "0";
     Premium_Request['non_electrical_accessory'] = "0";
     Premium_Request['is_llpd'] = "no";
     Premium_Request['is_breakin'] = "no";
     Premium_Request['is_policy_exist'] = "yes";
     Premium_Request['crn'] = "0";
     Premium_Request['is_antitheft_fit'] = "no";
     Premium_Request['voluntary_deductible'] = "0";
     Premium_Request['is_aai_member'] = "no";
     Premium_Request['pa_named_passenger_si'] = "0";
     Premium_Request['pa_unnamed_passenger_si'] = "0";
     Premium_Request['pa_unnamed_passenger_si'] = "0";
     Premium_Request['registration_no'] = Erp_Qt_Request_Core['___registration_no___'];
     Premium_Request['first_name'] = Erp_Qt_Request_Core['___first_name___'];
     Premium_Request['middle_name'] = Erp_Qt_Request_Core['___middle_name___'];
     Premium_Request['last_name'] = Erp_Qt_Request_Core['___last_name___'];
     Premium_Request['mobile'] = Erp_Qt_Request_Core['___mobile___'];
     Premium_Request['email'] = Erp_Qt_Request_Core['___email___'];
     Premium_Request['original_crn'] = Erp_Qt_Request_Core['___crn___'];
     Premium_Request['original_udid'] = Erp_Qt_Request_Core['___udid___'];
     var args = {
     data: Premium_Request,
     headers: {
     "Content-Type": "application/json"
     }
     };
     var url_api = config.environment.weburl + '/quote/premium_initiate';
     var Client = require('node-rest-client').Client;
     var client = new Client();
     client.post(url_api, args, function (data, response) {
     console.log("renewal_quotes_schedule data - ", data);
     console.log("renewal_quotes_schedule data - ", response);
     res.json(data);
     });
     }
     } else {
     res.json({'msg': 'No Data Avilable'});
     }
     } catch (e) {
     console.log("renewal_quotes_schedule", e);
     res.json(e);
     }
     });
     
     } catch (err) {
     console.log(err);
     res.json({'msg': 'error'});
     }
     
     });*/

    app.get('/renewal_quotes/get_leadid/:lead_id', function (req, res, next) {
        try {
            var ObjRequest = req.body;
            var lead_id = req.params.lead_id - 0;
            var Condition = {
                "Lead_Id": parseInt(lead_id)
            };
            var Lead = require('../models/leads');
            Lead.find(Condition).exec(function (er, dbLead) {
                try {
                    if (!er) {
                        for (var k in dbLead) {
                            try {
                                var user = dbLead[k]._doc;
                                //var user = dbLead[k];
                                var objUD = {
                                    'ss_id': user['ss_id'],
                                    'lead_id': user['Lead_Id'],
                                    'previous_policy_number': user['previous_policy_number'],
                                    'prev_policy_start_date': user['prev_policy_start_date'],
                                    'policy_expiry_date': user['policy_expiry_date'],
                                    'engine_number': user['engine_number'],
                                    'chassis_number': user['chassis_number'],
                                    'Model_Name': user['Model_Name'],
                                    'company_name': user['company_name'],
                                    'Customer_Name': user['Customer_Name'],
                                    'Customer_Address': user['Customer_Address'],
                                    'mobile': user['mobile'],
                                    'mobile2': user['mobile2'],
                                    'vehicle_insurance_type': user['vehicle_insurance_type'],
                                    'issued_by_username': user['issued_by_username'],
                                    'registration_no': user['registration_no'],
                                    'nil_dept': user['nil_dept'],
                                    'rti': user['rti'],
                                    'Make_Name': user['Make_Name'],
                                    'Model_ID': user['Model_ID'],
                                    'Variant_Name': user['Variant_Name'],
                                    'Vehicle_ID': user['Vehicle_ID'],
                                    'Fuel_ID': user['Fuel_ID'],
                                    'Fuel_Name': user['Fuel_Name'],
                                    'RTO_City': user['RTO_City'],
                                    'VehicleCity_Id': user['VehicleCity_Id'],
                                    'VehicleCity_RTOCode': user['VehicleCity_RTOCode'],
                                    'vehicle_registration_date': user['vehicle_registration_date'],
                                    'vehicle_manf_date': user['vehicle_manf_date'],
                                    'prev_insurer_id': user['prev_insurer_id'],
                                    'vehicle_ncb_current': user['vehicle_ncb_current'],
                                    'is_claim_exists': user['is_claim_exists'],
                                    'lead_type': user['lead_type']
                                };

                            } catch (e) {
                                console.error('UDBG', e);
                            }
                        }
                        res.json(objUD);
                    } else {
                        console.error('Exception', 'getleadData', er);
                        res.send(er);
                    }
                } catch (e1) {
                    console.error('Exception', 'getleadData', e1);
                }
            });
        } catch (e) {
            console.error('Exception', 'getleadData', e);
        }
    });

    app.get('/renewal_quotes/getpopupdata/:udid?', function (req, res, next) {
        var objRequest = this;
        var udid = req.params.udid;
        var Lead = require(appRoot + '/models/leads');
        try {
            var renew_cond = {
                'User_Data_Id': udid
            };
            Lead.find(renew_cond, {_id: 0}, function (err, quote_data) {
                try {
                    if (err)
                        throw err;
                    if (parseInt(quote_data.length) > 0) {
                        for (var quotecount in quote_data) {
                            var dbUserData = [];
                            dbUserData = quote_data[quotecount]._doc;
                            var moment = require('moment');
                            var Premium_Request = dbUserData.renewal_data.Premium_Request;
                            var Erp_Qt_Request_Core = dbUserData.renewal_data.Erp_Qt_Request_Core;
                            console.log("Erp_Qt_Request_Core = " + Erp_Qt_Request_Core);
                            //Premium_Request['policy_expiry_date'] = moment(Erp_Qt_Request_Core['___policy_end_date___']).add(11, "days").format("YYYY-MM-DD");
                            Premium_Request['policy_expiry_date'] = Erp_Qt_Request_Core['___policy_end_date___'];
                            Premium_Request['prev_insurer_id'] = Erp_Qt_Request_Core['___insurer_id___'];
                            Premium_Request['electrical_accessory'] = "0";
                            Premium_Request['non_electrical_accessory'] = "0";
                            Premium_Request['is_llpd'] = "no";
                            Premium_Request['crn'] = 0;
                            Premium_Request['is_breakin'] = "no";
                            Premium_Request['is_policy_exist'] = "yes";
                            Premium_Request['is_antitheft_fit'] = "no";
                            Premium_Request['voluntary_deductible'] = "0";
                            Premium_Request['is_aai_member'] = "no";
                            Premium_Request['pa_named_passenger_si'] = "0";
                            Premium_Request['pa_unnamed_passenger_si'] = "0";
                            Premium_Request['pa_unnamed_passenger_si'] = "0";
                            Premium_Request['registration_no'] = Erp_Qt_Request_Core['___registration_no___'];
                            Premium_Request['first_name'] = Erp_Qt_Request_Core['___first_name___'];
                            Premium_Request['middle_name'] = Erp_Qt_Request_Core['___middle_name___'];
                            Premium_Request['last_name'] = Erp_Qt_Request_Core['___last_name___'];
                            Premium_Request['mobile'] = Erp_Qt_Request_Core['___mobile___'];
                            Premium_Request['email'] = Erp_Qt_Request_Core['___email___'];
                            Premium_Request['og_udid'] = dbUserData['User_Data_Id'];
                            Premium_Request['og_crn'] = dbUserData['PB_CRN'];
                            Premium_Request['lead_type'] = "renewal_oneclick";
                            Premium_Request['lead_status'] = dbUserData['lead_status'];
                            Premium_Request['lead_id'] = dbUserData['Lead_Id'];

                            var args = {
                                data: Premium_Request,
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            };
                            console.log(Premium_Request);
                            console.log(JSON.stringify(Premium_Request));
                            var url_api = config.environment.weburl + '/quote/premium_initiate';
                            var Client = require('node-rest-client').Client;
                            var client = new Client();
                            client.post(url_api, args, function (data, response) {
                                console.log("renewal_quotes_schedule data - ", data);
                                console.log("renewal_quotes_schedule response - ", response);
                                try {
                                    var Listdb_args = {
                                        data: {
                                            udid: data.Request['udid'],
                                            secret_key: data.Request['secret_key'],
                                            search_reference_number: data.Summary['Request_Unique_Id'],
                                            client_key: data.Request['client_key']
                                        },
                                        headers: {
                                            "Content-Type": "application/json"
                                        }
                                    };
                                    sleep(4000);
                                    var listdb_url_api = config.environment.weburl + '/quote/premium_list_db';
                                    var listdb_Client = require('node-rest-client').Client;
                                    var client = new listdb_Client();
                                    client.post(listdb_url_api, Listdb_args, function (listdb_data, response) {
                                        console.log("listdb_data = " + listdb_data);
                                        console.log("response = " + response);
                                        res.json(listdb_data);
                                    });
                                    //res.json(srn);                                   
                                } catch (e) {
                                    console.log("renewal_quotes_schedule", e);
                                    res.json(e);
                                }
                            });
                            sleep(2000);
                        }
                        //res.json({'msg': 'Success'});
                    } else {
                        res.json({'msg': 'No Data Avilable'});
                    }
                } catch (e) {
                    console.log("renewal_quotes_schedule", e);
                    res.json(e);
                }
            });
        } catch (err) {
            console.log(err);
            res.json({'msg': 'error'});
        }
    });

    //app.get('/renewal_quotes/sendEmailMsg', function (req, res, next) {
    app.get('/renewal_quotes/sendEmailMsg/:product_id/:Request_Unique_Id/:User_Data_Id/:Premium_Min/:Premium_Max/:PB_CRN/:vehicle_insurance_subtype/:first_name/:email', function (req, res, next) {
        try {
            var Product_Id = req.params['product_id'];
            var Request_Unique_Id = req.params['Request_Unique_Id'];
            var User_Data_Id = req.params['User_Data_Id'];
            var Premium_Min = req.params['Premium_Min'];
            var Premium_Max = req.params['Premium_Max'];
            var PB_CRN = req.params['PB_CRN'];
            var vehicle_insurance_subtype = req.params['vehicle_insurance_subtype'];
            var first_name = req.params['first_name'];
            var email = req.params['email'];
            console.log(JSON.stringify(req.body));
            // req.body = JSON.parse(JSON.stringify(req.body));
            // var data = req.body;
            var product_name = 'Car';
            var product_url = 'car-insurance';
            if (Product_Id === "10") {
                product_name = 'TW';
                product_url = 'two-wheeler-insurance';
            }
            var objProduct = {
                '1': 'Car',
                '2': 'Health',
                '10': 'TW',
                '12': 'CV',
                '13': 'Marine',
                '5': 'Investment'
            };
            var quote_url = config.environment.portalurl + '/' + product_url + '/quotes?SID=' + Request_Unique_Id + '&ClientID=2&utm_source=renewal_oneclick';
            var fs = require('fs');
            var email_data = '';
            var ObjQr = {
                'chl': quote_url,
                'chld': 'L|4',
                'choe': 'UTF-8',
                'chs': '150x150',
                'cht': 'qr'
            };
            var qs = '';
            for (var k in ObjQr) {
                qs += k + '=' + encodeURIComponent(ObjQr[k]) + '&';
            }

            email_data = fs.readFileSync(appRoot + '/resource/email/Send_Quote_Link.html').toString();
            var Email = require('../models/email');
            var objModelEmail = new Email();
            var objEmail = {
                '___crn___': PB_CRN,
                '___contact_name___': first_name,
                '___short_url___': quote_url,
                '___insurance_type___': vehicle_insurance_subtype,
                '___qr_source___': "http://chart.googleapis.com/chart?" + qs
            };
            var product_short_name = objProduct[Product_Id];
            var sub = '[' + config.environment.name.toString().toUpperCase() + ']INFO-PolicyBoss.com-Policy Private ' + product_short_name + ' Quote for CRN : ' + PB_CRN;
            email_body = email_data.replaceJson(objEmail);
            if (config.environment.name === 'Production') {
                objModelEmail.send('noreply@landmarkinsurance.co.in', email, sub, email_body, '', '', '');
            } else if (config.environment.name === 'QA') {
                objModelEmail.send('noreply@landmarkinsurance.co.in', 'policybosstesting@gmail.com', sub, email_body, '', '', '');
            } else {
                objModelEmail.send('noreply@landmarkinsurance.co.in', 'policybosstesting@gmail.com', sub, email_body, '', '', '');
            }
            res.json("Success");
        } catch (e) {
            console.log("renewal_quotes_schedule", e);
            res.json(e);
        }
    });

    app.get('/renewal_quotes/premium_initiate/:product_id/:user_data_id/:insurance_subtype/:is_claim/:ncb_current?', function (req, res, next) {
        try {
            var objRequest = this;
            var Product_Id = req.params['product_id'];
            var User_Data_Id = req.params['user_data_id'] - 0;
            var Insurance_Subtype = req.params['insurance_subtype'];
            var Is_Claim = req.params['is_claim'];
            var NCB_Current = req.params['ncb_current'];
            var userData = require(appRoot + '/models/user_data');
            var objRequest_new = {
                "product_id": Product_Id,
                "user_data_id": User_Data_Id,
                "insurance_subtype": Insurance_Subtype,
                "is_claim": Is_Claim,
                "ncb_current": NCB_Current,
                "user_data": User_Data
            };
            objRequest = objRequest_new;
            Lead.find({User_Data_Id: User_Data_Id}, {_id: 0}, function (err, quote_data) {
                try {
                    if (err)
                        throw err;
                    //res.json(quote_data);
                    if (parseInt(quote_data.length) > 0) {

                        for (var quotecount in quote_data) {
                            var dbUserData = [];
                            dbUserData = quote_data[quotecount]._doc;
                            var moment = require('moment');
                            var Premium_Request = dbUserData.renewal_data.Premium_Request;
                            //var Erp_Qt_Request_Core = dbUserData.renewal_data.Erp_Qt_Request_Core;
                            //Premium_Request['policy_expiry_date'] = moment(Erp_Qt_Request_Core['___policy_end_date___']).add(11, "days").format("YYYY-MM-DD");
                            Premium_Request['policy_expiry_date'] = dbUserData['policy_expiry_date'];
                            Premium_Request['prev_insurer_id'] = dbUserData['prev_insurer_id'];
                            Premium_Request['is_claim_exists'] = objRequest.is_claim;
                            Premium_Request['vehicle_ncb_current'] = objRequest.ncb_current;
                            Premium_Request['vehicle_insurance_subtype'] = objRequest.insurance_subtype;
                            Premium_Request['electrical_accessory'] = "0";
                            Premium_Request['non_electrical_accessory'] = "0";
                            Premium_Request['is_llpd'] = "no";
                            Premium_Request['is_breakin'] = "no";
                            Premium_Request['is_policy_exist'] = "yes";
                            Premium_Request['crn'] = "0";
                            Premium_Request['is_antitheft_fit'] = "no";
                            Premium_Request['voluntary_deductible'] = "0";
                            Premium_Request['is_aai_member'] = "no";
                            Premium_Request['pa_named_passenger_si'] = "0";
                            Premium_Request['pa_unnamed_passenger_si'] = "0";
                            Premium_Request['pa_unnamed_passenger_si'] = "0";
                            Premium_Request['og_crn'] = dbUserData['PB_CRN'];
                            Premium_Request['og_udid'] = dbUserData['User_Data_Id'];
                            Premium_Request['lead_type'] = "renewal_now";
                            Premium_Request['lead_status'] = dbUserData['lead_status'];
                            Premium_Request['lead_id'] = dbUserData['Lead_Id'];
                            var args = {
                                data: Premium_Request,
                                headers: {
                                    "Content-Type": "application/json"
                                }
                            };
                            var url_api = config.environment.weburl + '/quote/premium_initiate';
                            var Client = require('node-rest-client').Client;
                            var client = new Client();
                            client.post(url_api, args, function (data, response) {
                                console.log("renewal_quotes_schedule data - ", data);
                                console.log("renewal_quotes_schedule data - ", response);
                                res.json(data);
                            });
                            sleep(3000);
                        }
                    } else {
                        res.json({'msg': 'No Data Avilable'});
                    }
                } catch (e) {
                    console.log("renewal_quotes_schedule", e);
                    res.json(e);
                }
            });

        } catch (err) {
            console.log(err);
            res.json({'msg': 'error'});
        }

    });
    app.get('/renewal_quotes/renewalSendEmailMsg/:product_id/:Request_Unique_Id/:User_Data_Id/:Premium_Min/:Premium_Max/:PB_CRN/:vehicle_insurance_subtype/:first_name/:email/:ss_id/:fba_id/:ip_address/:mac_address/:app_version/:sub_fba_id', function (req, res, next) {
        try {
            var Product_Id = req.params['product_id'];
            var Request_Unique_Id = req.params['Request_Unique_Id'];
            var User_Data_Id = req.params['User_Data_Id'];
            var Premium_Min = req.params['Premium_Min'];
            var Premium_Max = req.params['Premium_Max'];
            var PB_CRN = req.params['PB_CRN'];
            var vehicle_insurance_subtype = req.params['vehicle_insurance_subtype'];
            var first_name = req.params['first_name'];
            var email = req.params['email'];
            var ssId = req.params['ss_id'];
            var fbaId = req.params['fba_id'];
            var ipAddr = req.params['ip_address'];
            var macAddr = req.params['mac_address'];
            var appVersion = req.params['app_version'];
            var shbfbaid = req.params['sub_fba_id'];
            console.log(JSON.stringify(req.body));
            // req.body = JSON.parse(JSON.stringify(req.body));
            // var data = req.body;
            var product_name = 'Car';
            var product_url = 'car-insurance';
            if (Product_Id === "10") {
                product_name = 'TW';
                product_url = 'two-wheeler-insurance';
            }
            var objProduct = {
                '1': 'Car',
                '2': 'Health',
                '10': 'TW',
                '12': 'CV',
                '13': 'Marine',
                '5': 'Investment'
            };
            //var quote_url = config.environment.portalurl + '/' + product_url + '/quotes?SID=' + Request_Unique_Id + '&ClientID=2';
            var quote_url = config.environment.portalurl + '/Finmart/TW_Web/tw-main-page.html?ss_id=' + ssId + '&fba_id=' + fbaId + '&sub_fba_id=' + shbfbaid + '&ip_address=' + ipAddr + '&mac_address=' + macAddr + '&app_version=' + appVersion + '&product_id=' + Product_Id + '&SRN=' + Request_Unique_Id;
            var fs = require('fs');
            var email_data = '';
            var ObjQr = {
                'chl': quote_url,
                'chld': 'L|4',
                'choe': 'UTF-8',
                'chs': '150x150',
                'cht': 'qr'
            };
            var qs = '';
            for (var k in ObjQr) {
                qs += k + '=' + encodeURIComponent(ObjQr[k]) + '&';
            }

            email_data = fs.readFileSync(appRoot + '/resource/email/Send_Quote_Link.html').toString();
            var Email = require('../models/email');
            var objModelEmail = new Email();
            var objEmail = {
                '___crn___': PB_CRN,
                '___contact_name___': first_name,
                '___short_url___': quote_url,
                '___insurance_type___': vehicle_insurance_subtype,
                '___qr_source___': "http://chart.googleapis.com/chart?" + qs
            };
            var product_short_name = objProduct[Product_Id];
            var sub = '[' + config.environment.name.toString().toUpperCase() + ']INFO-PolicyBoss.com-Policy Private ' + product_short_name + ' Quote for CRN : ' + PB_CRN;
            email_body = email_data.replaceJson(objEmail);
            if (config.environment.name === 'Production') {
                objModelEmail.send('noreply@landmarkinsurance.co.in', email, sub, email_body, '', '', '');
            } else if (config.environment.name === 'QA') {
                objModelEmail.send('noreply@landmarkinsurance.co.in', 'policybosstesting@gmail.com', sub, email_body, '', '', '');
            } else {
                objModelEmail.send('noreply@landmarkinsurance.co.in', 'policybosstesting@gmail.com', sub, email_body, '', '', '');
            }
            res.json("Success");
        } catch (e) {
            console.log("renewal_quotes_schedule", e);
            res.json(e);
        }
    });
};
