/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var config = require('config');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var sleep = require('system-sleep');
var moment = require('moment');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var fs = require('fs');
var inspection_schedule = require('../models/inspection_schedule');
module.exports.controller = function (app) {
    app.post('/inspection/iffco_inspection_status', function (req, res) {
        try {
            let objReq = req.body;
            let Client = require('node-rest-client').Client;
            let objClient = new Client();
            objClient.get(config.environment.weburl + '/clients', {}, function (data, response) {
                if (data) {
                    if (data.hasOwnProperty(objReq.client_key) && objReq.secret_key === data[objReq.client_key]['Secret_Key']
                            && data[objReq.client_key]['Is_Active'] === true) {
                        let reportDownloadLink = objReq['reportDownloadLink'];
                        let Inspection_Id = objReq['caseId'];
                        let inspectionDate = objReq['inspectionDate'];
                        let branch = objReq['branch'];
                        let vehicleRegNo = objReq['vehicleRegNo'];
                        let insurer_status = objReq['status'];
                        let insurer_request = JSON.stringify(objReq);
                        let status = "";
                        if (insurer_status === 'APPROVED') {
                            status = 'INSPECTION_APPROVED';
                        }
                        if (insurer_status === "REJECTED") {
                            status = 'INSPECTION_REJECTED';
                        }
                        let objProduct = null;
                        objProduct = {
                            "Insurer_Status": insurer_status,
                            "Insurer_Request": insurer_request,
                            "Status": status,
                            "Inspection_Date": inspectionDate,
                            "Modified_On": new Date()
                        }, {
                            upsert: false, multi: false
                        };
                        inspection_schedule.update({"Inspection_Id": Inspection_Id}, {$set: objProduct}, {upsert: false, multi: true}, function (err, objproduct_share) {
                            if (err) {
                                throw err;
                            } else {
                                if (objproduct_share.nModified === 1 && objproduct_share.ok === 1) {
                                    inspection_schedule.find({"Inspection_Id": Inspection_Id}, function (err1, dbUsers) {
                                        if (err1) {
                                            res.send(err1);
                                        } else {
                                            try {
                                                if (dbUsers.length > 0) {
                                                    let user = dbUsers['0']['_doc'];
                                                    let args = {
                                                        data: user,
                                                        headers: {
                                                            "Content-Type": "application/json"
                                                        }
                                                    };
                                                    console.error('IFFCO Tokio - /inspection/iffco_mail_inspection_status - POST calling Request : ', JSON.stringify(args));
                                                    let url_api = config.environment.weburl + '/inspection/iffco_mail_inspection_status';
                                                    execute_post(url_api, args);
                                                } else {
                                                    res.json({'/iffco_inspection_status ': 'NO DATA AVAILABLE'});
                                                }
                                            } catch (ex) {
                                                console.error('Exception in iffco_inspection_status() for inspectionSchedules db details : ', ex);
                                                res.send(ex, dbUsers);
                                            }
                                        }
                                    });
                                    res.json({'Msg': "Status Updated Successfully", 'Status': "Success"});
                                } else {
                                    res.json({'Msg': "Status Failed to Update", 'Status': "Failure"});
                                }
                            }
                        });
                        //res.json({'Msg': "Status Updated Successfully", 'Status': "Success"});
                    } else {
                        res.json({'Msg': 'Invalid Credentials'});
                    }
                } else {
                    res.json({'Msg': 'Not Authorized'});
                }
            });
        } catch (e) {
            res.json({'Msg': "Error to Update and read Data", 'Status': "Failure"});
        }
    });

    app.post('/inspection/iffco_breakin_data', function (req, res) {
        try {
            console.error('iffco_breakin_data', req.body);
            let cond = {
                "PB_CRN": req.body.CustomerReferenceID,
                "Service_Log_Unique_Id": (req.body.api_reference_number.split("_"))[0],
                "Request_Unique_Id": (req.body.search_reference_number.split("_"))[0],
                "Status": "INSPECTION_APPROVED"
            };
            inspection_schedule.find(cond, function (err, dbUsers) {
                if (err) {
                    res.send(err);
                } else {
                    let inspection_id = dbUsers['0']['_doc']['Inspection_Id'];
                    let dbUsers1 = JSON.parse(dbUsers['0']['_doc']['Insurer_Request']);
                    let inspection_date = "";
                    if ((dbUsers1.hasOwnProperty('inspectionDate')) && dbUsers1['inspectionDate'] !== "" && dbUsers1['inspectionDate'] !== null) {
                        inspection_date = dbUsers1['inspectionDate'].split(" ");
                        inspection_date = getMonthFromString(inspection_date[1]) + "/" + inspection_date[2] + "/" + inspection_date[5];
                        console.log(inspection_date);
                        res.json({'Msg': 'Success', 'inspection_date': inspection_date, 'inspection_id':inspection_id});
                    } else {
                        res.json({'Msg': 'Inspection Date was not found.'});
                    }
                }
            });
        } catch (e) {
            console.error('iffco_breakin_data', 'exception', e);
            res.send(e.stack);
        }
    });

    app.post('/inspection/iffco_mail_inspection_status', function (req, res) {
        let objInsurerProduct = req.body;
        let email_template = "";
        let email_sub_status = "";
        let payment_link = "";
        let short_url = "";
        let Error_Msg = "";
        let Inspection_Remarks = "IFFCO TOKIO GENERAL INSURANCE CO. LTD. has REJECTED";
        let Inspection_Status = objInsurerProduct['Status'];
        try {
            let User_Data = require('../models/user_data');
            let ud_cond = {"User_Data_Id": objInsurerProduct['UD_Id']};
            User_Data.findOne(ud_cond, function (err, dbUserData) {
                if (err) {
                    console.error('Exception in iffco_mail_inspection_status() : ', err);
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
                        "Status": Inspection_Status,
                        "StatusOn": new Date()
                    });
                    if (Inspection_Status === 'INSPECTION_REJECTED') {
                        newvalues1 = {
                            "Last_Status": Inspection_Status,
                            "Status_History": Status_History,
                            "Inspection_Remarks": Inspection_Remarks,
                            "Premium_Request.is_inspection_done": "yes",
                            "Modified_On": new Date()
                        }, {
                            upsert: false, multi: false
                        };
                        email_template = 'Send_Inspection_Status.html'; //'Send_UnSuccessful_Inspection.html';
                        email_sub_status = 'Unsuccessful';
                        Inspection_Remarks = ''; //Inspection_Remarks;
                        Error_Msg = Inspection_Status + " : " + Inspection_Remarks;
                    } else if (Inspection_Status === 'INSPECTION_APPROVED') {
                        newvalues1 = {
                            "Last_Status": Inspection_Status,
                            "Status_History": Status_History,
                            "Premium_Request.is_inspection_done": "yes",
                            "Modified_On": new Date()
                        };
                        email_template = 'Send_Inspection_Status.html';
                        email_sub_status = 'Successful';
                        Error_Msg = Inspection_Status;
                    } else {
                        Error_Msg = JSON.stringify(objInsurerProduct);
                    }

                    User_Data.updateOne(myquery1, newvalues1, function (err, numAffected) {
                        console.log('iffco_mail_inspection_status() UserDataUpdated : ', err, numAffected);
                    });

                    if (Inspection_Status === 'INSPECTION_APPROVED') {
                        payment_link = config.environment.portalurl.toString() + '/car-insurance/buynow/' + dbUserData['Premium_Request']['client_id'] + '/' + objInsurerProduct['Service_Log_Unique_Id'] + '_' + objInsurerProduct['SL_Id'] + '_' + objInsurerProduct['UD_Id'] + '/NonPOSP/0';
                        console.log("iffco_mail_inspection_status() payment_link : ", payment_link);
                    }

                    let Client = require('node-rest-client').Client;
                    let client = new Client();
                    client.get(config.environment.shorten_url + '?longUrl=' + encodeURIComponent(payment_link), function (urlData, urlResponse) {
                        try {
                            if (Inspection_Status === 'INSPECTION_APPROVED' && urlData && urlData.Short_Url !== '') {
                                inspection_status_msg = 'Your Vehicle Inspection has been done successfully. Payment is acceptable within One day only. Payment Link is : ';
                                //+ urlData.Short_Url;
                                //inspection_status_msg = inspection_status_msg + "Payment is acceptable within One day only.";
                                short_url = urlData.Short_Url;
                                console.log("iffco_mail_inspection_status() inspection_status_msg : ", inspection_status_msg, short_url);
                            }
                            if (Inspection_Status === 'INSPECTION_REJECTED') {
                                inspection_status_msg = 'Your Vehicle Inspection has been Rejected.';
                                short_url = "";
                                console.log("iffco_mail_inspection_status() inspection_status_msg : ", inspection_status_msg);
                            }

                            let dataObj = dbUserData['Proposal_Request_Core'];
                            let objRequestCore = {
                                'customer_name': dataObj['first_name'] + ' ' + dataObj['last_name'],
                                'crn': dataObj['crn'],
                                'vehicle_text': dataObj['vehicle_text'],
                                'insurer_name': 'IFFCO TOKIO GENERAL INSURANCE CO. LTD.',
                                'insurance_type': 'RENEW - Breakin Case',
                                'inspection_id': objInsurerProduct['Inspection_Id'],
                                'final_premium': parseInt(dbUserData.Proposal_Request_Core['final_premium']),
                                'email_id': dataObj['email'],
                                'registration_no': dataObj['registration_no'],
                                'short_url': short_url,
                                'inspection_status_msg': inspection_status_msg
                            };
                            let processed_request = {};
                            for (let key in objRequestCore) {
                                if (typeof objRequestCore[key] !== 'object') {
                                    processed_request['___' + key + '___'] = objRequestCore[key];
                                }
                            }
                            console.error('/iffco_mail_inspection_status Breakin Email', Inspection_Status);
                            if (Inspection_Status === 'INSPECTION_APPROVED' || Inspection_Status === 'INSPECTION_REJECTED') {
                                let email_data = fs.readFileSync(appRoot + '/resource/email/' + email_template).toString();
                                email_data = email_data.replaceJson(processed_request);
                                let emailto = dataObj['email'];
                                let sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[Car] Inspection Verification ' + email_sub_status + ' CRN : ' + dataObj['crn'];
                                let Email = require(appRoot + '/models/email');
                                let objModelEmail = new Email();
                                let email_agent = '';
                                if (dbUserData.Premium_Request['posp_email_id'] !== 0 && dbUserData.Premium_Request['posp_email_id'] !== null && dbUserData.Premium_Request['posp_email_id'].toString().indexOf('@') > -1) {
                                    email_agent = dbUserData.Premium_Request['posp_email_id'].toString();
                                }
                                let arr_bcc = [config.environment.notification_email];
                                if (dbUserData.Premium_Request.hasOwnProperty('posp_reporting_email_id') && dbUserData.Premium_Request['posp_reporting_email_id'] !== '' && dbUserData.Premium_Request['posp_reporting_email_id'] !== null) {
                                    if (dbUserData.Premium_Request['posp_reporting_email_id'] !== 0 && dbUserData.Premium_Request['posp_reporting_email_id'].indexOf('@') > -1) {
                                        arr_bcc.push(dbUserData.Premium_Request['posp_reporting_email_id']);
                                    }
                                }
                                if (dbUserData['Premium_Request'].hasOwnProperty('posp_sub_fba_email') && dbUserData['Premium_Request']['posp_sub_fba_email'] !== 0 && dbUserData['Premium_Request']['posp_sub_fba_email'] !== null && dbUserData['Premium_Request']['posp_sub_fba_email'].toString().indexOf('@') > -1) {
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
                                res.json({'Status': Error_Msg});
                            }
                        } catch (e) {
                            console.error('Exception in iffco_mail_inspection_status() for mailing : ', e);
                            res.json({'Status': e});
                        }
                    });
                }
            });
        } catch (e) {
            console.error('Exception in iffco_mail_inspection_status() for mailing : ', e);
            res.json({'Status': e});
        }
    });

    function execute_post(url, args) {
        let Client = require('node-rest-client').Client;
        let client = new Client();
        client.post(url, args, function (data, response) {
            console.error('/inspections.js execute_post() : ');
        });
    }

    function getMonthFromString(mon) {
        let d = Date.parse(mon + "1, 2012");
        if (!isNaN(d)) {
            let mm = new Date(d).getMonth() + 1;
            if (mm < 10) {
                mm = "0" + mm;
            }
            return mm;
        }
        return -1;
    }

    app.get('/inspection/iciciLombard_inspection_status', function (req, res) {
        try {
            let cond = {"Status": {$in: ["INSPECTION_SCHEDULED"]}};
            let day_back = 2;
            let today = moment().utcOffset("+05:30").startOf('Day');
            let fromDate = moment(today).format("YYYY-MM-D");
            let toDate = moment(today).format("YYYY-MM-D");
            let arrFrom = fromDate.split('-');
            let dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 1, arrFrom[2] - 0);
            dateFrom.setDate(dateFrom.getDate() - day_back);
            let arrTo = toDate.split('-');
            let dateTo = new Date(arrTo[0] - 0, arrTo[1] - 1, arrTo[2] - 0);
            dateTo.setDate(dateTo.getDate() - 1);
            cond['Insurer_Id'] = 6;
            cond['Created_On'] = {"$gte": dateFrom, "$lte": dateTo};
            console.log(cond);
            inspection_schedule.find(cond).exec(function (err1, dbUsers) {
                if (err1) {
                    res.send(err1);
                } else {
                    try {
                        if (dbUsers.length > 0) {
                            console.error('Log', 'iciciLombard_inspection_status', dbUsers);
                            let  objCSSummary = [];
                            for (let k in dbUsers) {
                                let user = dbUsers[k]['_doc'];
                                let temp_crn = dbUsers[k]['_doc']['PB_CRN'];
                                let args = {
                                    data: user,
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                };
                                objCSSummary.push(temp_crn);
                                console.error('ICICI Lombard - /inspection/iciciLombard_inspection_status - POST calling Request : ', JSON.stringify(args));
                                let url_api = config.environment.weburl + '/inspection/iciciLombard_update_inspection_status';
                                execute_post(url_api, args);
                                sleep(2000);
                            }
                            res.json(objCSSummary);
                        } else {
                            res.json({'/iciciLombard_inspection_status ': 'NO DATA AVAILABLE'});
                        }
                    } catch (ex) {
                        console.error('Exception in iciciLombard_inspection_status() for inspectionSchedules db details : ', ex);
                        res.send(ex, dbUsers);
                    }
                }
            });
        } catch (e) {
            res.json({'Msg': "iciciLombard_inspection_status - Exception", 'Status': "Failure"});
        }
    });

    app.post('/inspection/iciciLombard_update_inspection_status', function (req, res2, next) {
        let objInsurerProduct = req.body;
        let dealNo = "", callingService = '', Error_Msg = '', Inspection_Remarks = '';
        let args = {};
        let body = {};

        try {
            if (config.environment.name.toString() === 'Production') {
                dealNo = 'DL-3001/2511179';
                callingService = 'https://app9.icicilombard.com/ILServices/Motor/v1/Breakin/ClearInspectionStatus';
            } else {
                dealNo = 'DEAL-3001-0206164'; //'DL-3001/1488439';
                callingService = 'https://cldilbizapp02.cloudapp.net:9001/ILServices/motor/v1/Breakin/ClearInspectionStatus';
            }

            //let Icici_Token = require(appRoot + '/models/icici_token');
            //Icici_Token.findOne({'Product_Id': 1}, null, {sort: {'Created_On': -1}}, function (err, dbIciciToken) {
            if (!callingService) { //if (err) {
                //console.error('/iciciLombard_update_inspection_status Icici Token not Found', err);
                //Error_Msg = err;
            } else {
                process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
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
                    console.error('ICICI Lombard - iciciLombard_update_inspection_status - ClearInspectionStatus service - Response : ', JSON.stringify(data));
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
                                console.error('Exception in iciciLombard_update_inspection_status() for inspection_breakins DB updating : ', ex4);
                            }

                            try {
                                //let inspectionSchedules = require(appRoot + '/models/inspection_schedule');
                                let today = new Date();
                                let myquery = {Inspection_Id: objInsurerProduct['Inspection_Id'], PB_CRN: objInsurerProduct['PB_CRN'], UD_Id: objInsurerProduct['UD_Id']};
                                let newvalues = {Insurer_Status: "CHECKED", Status: iciciLombard_breakin_status, Modified_On: today};
                                inspection_schedule.updateOne(myquery, newvalues, function (uperr, upres) {
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
                                                let short_url_value = "";
                                                if (iciciLombard_breakin_status === 'INSPECTION_APPROVED' && urlData && urlData.Short_Url !== '') {
                                                    inspection_status_msg = 'Your Vehicle Inspection has been done successfully. Payment Link is : ';
                                                    short_url_value = urlData.Short_Url;
                                                    console.log("iciciLombard_update_inspection_status() inspection_status_msg : ", inspection_status_msg, short_url_value);
                                                }
                                                if (iciciLombard_breakin_status === 'INSPECTION_REJECTED') {
                                                    inspection_status_msg = 'Your Vehicle Inspection has been Rejected. REMARKS : ' + Inspection_Remarks;
                                                    console.log("iciciLombard_update_inspection_status() inspection_status_msg : ", inspection_status_msg);
                                                    short_url_value = "";
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
                                                    'short_url': short_url_value
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
                                                    let email_agent = '';
                                                    if (dbUserData.Premium_Request['posp_email_id'] !== 0 && dbUserData.Premium_Request['posp_email_id'] !== null && dbUserData.Premium_Request['posp_email_id'].toString().indexOf('@') > -1) {
                                                        email_agent = dbUserData.Premium_Request['posp_email_id'].toString();
                                                    }
                                                    let arr_bcc = [config.environment.notification_email];
                                                    if (dbUserData.Premium_Request.hasOwnProperty('posp_reporting_email_id') && dbUserData.Premium_Request['posp_reporting_email_id'] !== '' && dbUserData.Premium_Request['posp_reporting_email_id'] !== null) {
                                                        if (dbUserData.Premium_Request['posp_reporting_email_id'] !== 0 && dbUserData.Premium_Request['posp_reporting_email_id'].indexOf('@') > -1) {
                                                            arr_bcc.push(dbUserData.Premium_Request['posp_reporting_email_id']);
                                                        }
                                                    }
                                                    if (dbUserData['Premium_Request'].hasOwnProperty('posp_sub_fba_email') && dbUserData['Premium_Request']['posp_sub_fba_email'] !== 0 && dbUserData['Premium_Request']['posp_sub_fba_email'] !== null && dbUserData['Premium_Request']['posp_sub_fba_email'].toString().indexOf('@') > -1) {
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
            //});
        } catch (ex3) {
            console.error('Exception in iciciLombard_update_inspection_status() for User_Data db details : ', ex3);
            res2.json({'Status': ex3});
        }
        //res2.json({'Status': Error_Msg});
    });

    app.get('/inspection/godigit_inspection_status', function (req, res) {
        try {
            let cond = {"Status": {$in: ["INSPECTION_SCHEDULED"]}};
            cond['Insurer_Id'] = 44;
            console.log("godigit_inspection_status : cond : ", cond);
            inspection_schedule.find(cond).exec(function (err1, dbUsers) {
                if (err1) {
                    res.send(err1);
                } else {
                    try {
                        if (dbUsers.length > 0) {
                            console.error('Log', 'godigit_inspection_status no. of records fetched', dbUsers.length);
                            console.error('Log', 'godigit_inspection_status', dbUsers);
                            let  objCSSummary = [];
                            for (let k in dbUsers) {
                                let user = dbUsers[k]['_doc'];
                                let temp_crn = dbUsers[k]['_doc']['PB_CRN'];
                                let args = {
                                    data: user,
                                    headers: {
                                        "Content-Type": "application/json"
                                    }
                                };
                                objCSSummary.push(temp_crn);
                                console.error('GODIGIT - /inspection/godigit_mail_inspection_status - POST calling Request : ', JSON.stringify(args));
                                let url_api = config.environment.weburl + '/inspection/godigit_mail_inspection_status';
                                execute_post(url_api, args);
                                sleep(2000);
                            }
                            res.json(objCSSummary);
                        } else {
                            res.json({'/iciciLombard_inspection_status ': 'NO DATA AVAILABLE'});
                        }
                    } catch (ex) {
                        console.error('Exception in godigit_inspection_status() for inspectionSchedules db details : ', ex);
                        res.send(ex, dbUsers);
                    }
                }
            });
        } catch (e) {
            res.json({'Msg': "godigit_inspection_status - Exception", 'Status': "Failure"});
        }
    });

    app.post('/inspection/godigit_mail_inspection_status', function (req, res) {
        let objInsurerProduct = req.body;
        let payment_link = "";
        let short_url = "";
        let Error_Msg = "";
        let Inspection_Remarks = "GODIGIT GENERAL INSURANCE CO. LTD. has REJECTED";
        let Inspection_Status = "";
        let username = "";
        let password = "";
        let service_url = "";

        try {
            if (config.environment.name.toString() === 'Production') {
                username = '95967257';
                password = 'Digit@123$';
                service_url = "https://qnb.godigit.com/digit/motor-insurance/services/integration/v2/quote?policyNumber=" + objInsurerProduct['Inspection_Id'];
            } else {
                username = '51197558';
                password = 'digit123';
                service_url = "http://preprod-qnb.godigit.com/digit/motor-insurance/services/integration/v2/quote?policyNumber=" + objInsurerProduct['Inspection_Id'];
            }

            let args = {
                headers: {
                    'Authorization': 'Basic ' + (new Buffer(username + ':' + password).toString('base64'))
                }
            };
            console.log(service_url);
            let Client = require('node-rest-client').Client;
            process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
            let client = new Client();
            client.get(service_url, args, function (data, response) {
                console.log('Service Response in godigit_mail_inspection_status() : ', JSON.stringify(data));
                if (data) {
                    let proceedflg = false;
                    if (data.hasOwnProperty('error')) {
                        if (data['error']['errorCode'] === 0 || data['error']['httpCode'] === 200) {
                            proceedflg = true;
                        } else {
                            if (data['error']['validationMessages'][1]) {
                                Error_Msg = data['error']['validationMessages'][1];
                            } else {
                                Error_Msg = data['error']['validationMessages'];
                            }
                        }
                    } else {
                        Error_Msg = JSON.stringify(data);
                    }

                    if (proceedflg) {
                        let email_template = '';
                        let email_sub_status = '';
                        let inspection_status_msg = '';
                        let goDigit_breakin_status = '';
                        if (data.hasOwnProperty('policyStatus') && data.hasOwnProperty('policyNumber')) {
                            //Insurer_Status = PRE_INSPECTION_APPROVED, PRE_INSPECTION_DECLINED, SELF_INSPECTION_PENDING, ASSESSMENT_PENDING
                            if ((data.hasOwnProperty('policyStatus')) && (data['policyStatus'] === 'PRE_INSPECTION_APPROVED')) {
                                goDigit_breakin_status = 'PRE_INSPECTION_APPROVED';
                                Inspection_Status = 'INSPECTION_APPROVED';
                                email_template = 'Send_Inspection_Status.html';
                                email_sub_status = 'Successful';
                                Error_Msg = Inspection_Status;
                            }
                            if ((data.hasOwnProperty('policyStatus')) && (data['policyStatus'] === 'PRE_INSPECTION_DECLINED')) {
                                goDigit_breakin_status = 'PRE_INSPECTION_DECLINED';
                                Inspection_Status = 'INSPECTION_REJECTED';
                                email_template = 'Send_Inspection_Status.html';
                                email_sub_status = 'Unsuccessful';
                                Error_Msg = Inspection_Status + " : " + Inspection_Remarks;
                            }

                            if (Inspection_Status === 'INSPECTION_APPROVED' || Inspection_Status === 'INSPECTION_REJECTED') {
                                try {
                                    let queryObj = {
                                        PB_CRN: parseInt(objInsurerProduct['PB_CRN']),
                                        UD_Id: parseInt(objInsurerProduct['UD_Id']),
                                        SL_Id: parseInt(objInsurerProduct['SL_Id']),
                                        Insurer_Id: 44,
                                        Request_Unique_Id: objInsurerProduct['Request_Unique_Id'],
                                        Service_Log_Unique_Id: objInsurerProduct['Service_Log_Unique_Id'],
                                        Inspection_Number: objInsurerProduct['Inspection_Id'],
                                        Status: goDigit_breakin_status,
                                        Insurer_Request: "URL : " + service_url + " Request : " + args,
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
                                                    console.log("godigit_mail_inspection_status() inspectionBreakinsdb : ", inspectionBreakinsdb.insertedCount, inspectionBreakinsdb.result);
                                                }
                                            });
                                        }
                                    });
                                } catch (ex4) {
                                    Error_Msg = ex4;
                                    console.error('Exception in godigit_mail_inspection_status() for inspection_breakins DB updating : ', ex4);
                                }

                                try {
                                    let today = new Date();
                                    let myquery = {Inspection_Id: objInsurerProduct['Inspection_Id'], PB_CRN: objInsurerProduct['PB_CRN'], UD_Id: objInsurerProduct['UD_Id']};
                                    let newvalues = {Insurer_Status: "CHECKED", Status: Inspection_Status, Modified_On: today};
                                    inspection_schedule.updateOne(myquery, newvalues, function (uperr, upres) {
                                        if (uperr) {
                                            Error_Msg = uperr;
                                            throw uperr;
                                        } else {
                                            console.log("godigit_mail_inspection_status() BreakIn Status Updated for : ", objInsurerProduct['Inspection_Id'], ", UD_Id : ", objInsurerProduct['UD_Id']);
                                            console.log("godigit_mail_inspection_status() : UD_Id : ", objInsurerProduct['UD_Id'], upres);
                                        }
                                    });
                                } catch (ex4) {
                                    Error_Msg = ex4;
                                    console.error('Exception in godigit_mail_inspection_status() for inspection_schedule DB updating : ', ex4);
                                }

                                let User_Data = require('../models/user_data');
                                let ud_cond = {"User_Data_Id": objInsurerProduct['UD_Id']};
                                User_Data.findOne(ud_cond, function (err, dbUserData) {
                                    if (err) {
                                        console.error('Exception in godigit_mail_inspection_status() : ', err);
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
                                            "Status": Inspection_Status,
                                            "StatusOn": new Date()
                                        });
                                        if (Inspection_Status === 'INSPECTION_REJECTED') {
                                            newvalues1 = {
                                                "Last_Status": Inspection_Status,
                                                "Status_History": Status_History,
                                                "Inspection_Remarks": Inspection_Remarks,
                                                "Premium_Request.is_inspection_done": "yes",
                                                "Modified_On": new Date()
                                            }, {
                                                upsert: false, multi: false
                                            };
                                            email_template = 'Send_Inspection_Status.html'; //'Send_UnSuccessful_Inspection.html';
                                            email_sub_status = 'Unsuccessful';
                                            Inspection_Remarks = ''; //Inspection_Remarks;
                                            Error_Msg = Inspection_Status + " : " + Inspection_Remarks;
                                        }
                                        if (Inspection_Status === 'INSPECTION_APPROVED') {
                                            newvalues1 = {
                                                "Last_Status": Inspection_Status,
                                                "Status_History": Status_History,
                                                "Premium_Request.is_inspection_done": "yes",
                                                "Modified_On": new Date()
                                            };
                                            email_template = 'Send_Inspection_Status.html';
                                            email_sub_status = 'Successful';
                                            Error_Msg = Inspection_Status;
                                        }

                                        User_Data.updateOne(myquery1, newvalues1, function (err, numAffected) {
                                            console.log('godigit_mail_inspection_status() UserDataUpdated : ', err, numAffected);
                                        });

                                        if (Inspection_Status === 'INSPECTION_APPROVED') {
                                            payment_link = config.environment.portalurl.toString() + '/car-insurance/buynow/' + dbUserData['Premium_Request']['client_id'] + '/' + objInsurerProduct['Service_Log_Unique_Id'] + '_' + objInsurerProduct['SL_Id'] + '_' + objInsurerProduct['UD_Id'] + '/NonPOSP/0';
                                            console.log("godigit_mail_inspection_status() payment_link : ", payment_link);
                                        }

                                        let Client1 = require('node-rest-client').Client;
                                        let client1 = new Client1();
                                        client1.get(config.environment.shorten_url + '?longUrl=' + encodeURIComponent(payment_link), function (urlData, urlResponse) {
                                            try {
                                                if (Inspection_Status === 'INSPECTION_APPROVED' && urlData && urlData.Short_Url !== '') {
                                                    inspection_status_msg = 'Your Vehicle Inspection has been done successfully. Payment Link is : ';
                                                    short_url = urlData.Short_Url;
                                                    console.log("godigit_mail_inspection_status() inspection_status_msg : ", inspection_status_msg, short_url);
                                                }
                                                if (Inspection_Status === 'INSPECTION_REJECTED') {
                                                    inspection_status_msg = 'Your Vehicle Inspection has been Rejected.';
                                                    short_url = "";
                                                    console.log("godigit_mail_inspection_status() inspection_status_msg : ", inspection_status_msg);
                                                }

                                                let dataObj = dbUserData['Proposal_Request_Core'];
                                                let objRequestCore = {
                                                    'customer_name': dataObj['first_name'] + ' ' + dataObj['last_name'],
                                                    'crn': dataObj['crn'],
                                                    'vehicle_text': dataObj['vehicle_text'],
                                                    'insurer_name': 'GODIGIT GENERAL INSURANCE CO. LTD.',
                                                    'insurance_type': 'RENEW - Breakin Case',
                                                    'inspection_id': objInsurerProduct['Inspection_Id'],
                                                    'final_premium': parseInt(dbUserData.Proposal_Request_Core['final_premium']),
                                                    'email_id': dataObj['email'],
                                                    'registration_no': dataObj['registration_no'],
                                                    'short_url': short_url,
                                                    'inspection_status_msg': inspection_status_msg
                                                };
                                                let processed_request = {};
                                                for (let key in objRequestCore) {
                                                    if (typeof objRequestCore[key] !== 'object') {
                                                        processed_request['___' + key + '___'] = objRequestCore[key];
                                                    }
                                                }
                                                console.error('/godigit_mail_inspection_status Breakin Email', Inspection_Status);
                                                if (Inspection_Status === 'INSPECTION_APPROVED' || Inspection_Status === 'INSPECTION_REJECTED') {
                                                    let email_data = fs.readFileSync(appRoot + '/resource/email/' + email_template).toString();
                                                    email_data = email_data.replaceJson(processed_request);
                                                    let emailto = dataObj['email'];
                                                    let sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[Car] Inspection Verification ' + email_sub_status + ' CRN : ' + dataObj['crn'];
                                                    let Email = require(appRoot + '/models/email');
                                                    let objModelEmail = new Email();
                                                    let email_agent = '';
                                                    if (dbUserData.Premium_Request['posp_email_id'] !== 0 && dbUserData.Premium_Request['posp_email_id'] !== null && dbUserData.Premium_Request['posp_email_id'].toString().indexOf('@') > -1) {
                                                        email_agent = dbUserData.Premium_Request['posp_email_id'].toString();
                                                    }
                                                    let arr_bcc = [config.environment.notification_email];
                                                    if (dbUserData.Premium_Request.hasOwnProperty('posp_reporting_email_id') && dbUserData.Premium_Request['posp_reporting_email_id'] !== '' && dbUserData.Premium_Request['posp_reporting_email_id'] !== null) {
                                                        if (dbUserData.Premium_Request['posp_reporting_email_id'] !== 0 && dbUserData.Premium_Request['posp_reporting_email_id'].indexOf('@') > -1) {
                                                            arr_bcc.push(dbUserData.Premium_Request['posp_reporting_email_id']);
                                                        }
                                                    }
                                                    if (dbUserData['Premium_Request'].hasOwnProperty('posp_sub_fba_email') && dbUserData['Premium_Request']['posp_sub_fba_email'] !== 0 && dbUserData['Premium_Request']['posp_sub_fba_email'] !== null && dbUserData['Premium_Request']['posp_sub_fba_email'].toString().indexOf('@') > -1) {
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
                                                    res.json({'Status': Error_Msg});
                                                }
                                            } catch (e) {
                                                console.error('Exception in godigit_mail_inspection_status() for mailing : ', e);
                                                res.json({'Status': e});
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    }
                } else {
                    console.error('Error in service godigit_mail_inspection_status() : ', Error_Msg);
                }
            });
        } catch (e) {
            console.error('Exception in godigit_mail_inspection_status() for mailing : ', e);
            res.json({'Status': e});
        }
    });

    app.get('/inspection/iciciLombard_check_inspection_status', function (req, res2) {
        let callingService = '', Error_Msg = '';
        //let breakin_inspection_id = req.params['breakin_inspection_id'];
        let breakin_inspection_id = "";
        let args = {};
        try {
            if (config.environment.name.toString() === 'Production') {
                callingService = 'https://app9.icicilombard.com/ILServices/Motor/v1/Breakin/GetStatus';
            } else {
                callingService = 'https://cldilbizapp02.cloudapp.net:9001/ILServices/motor/v1/Breakin/GetStatus';
            }

            let Icici_Token = require(appRoot + '/models/icici_token');
            Icici_Token.findOne({'Product_Id': 1}, null, {sort: {'Created_On': -1}}, function (err, dbIciciToken) {
                if (err) {
                    console.error('/iciciLombard_check_inspection_status Icici Token not Found', err);
                } else {
                    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
                    //let dbIciciToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjZCN0FDQzUyMDMwNUJGREI0RjcyNTJEQUVCMjE3N0NDMDkxRkFBRTEiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJhM3JNVWdNRnY5dFBjbExhNnlGM3pBa2ZxdUUifQ.eyJuYmYiOjE1OTEwODY4ODYsImV4cCI6MTU5MTA5MDQ4NiwiaXNzIjoiaHR0cHM6Ly9jbGRpbGJpemFwcDAyLmNsb3VkYXBwLm5ldDo5MDAxL2NlcmJlcnVzIiwiYXVkIjpbImh0dHBzOi8vY2xkaWxiaXphcHAwMi5jbG91ZGFwcC5uZXQ6OTAwMS9jZXJiZXJ1cy9yZXNvdXJjZXMiLCJlc2Jtb3RvciJdLCJjbGllbnRfaWQiOiJyby5sYW5kbWFyayIsInN1YiI6IjJhYjIxM2E0LTBlZTItNDgzNS05YWUyLTFkZGFhMjYwYzlhMCIsImF1dGhfdGltZSI6MTU5MTA4Njg4NiwiaWRwIjoibG9jYWwiLCJzY29wZSI6WyJlc2Jtb3RvciJdLCJhbXIiOlsiY3VzdG9tIl19.lWlhLSkiY9Pkc5G9GMWpINr2pBObx4GR9VLGDQi2hXz49idW9D7pK9mUTkuh9sVxcpq4sm0sqR0k6JnkSC9qVNAGDKGODpf6gJy3bO0dP9Kq0N_5OKPNMmQiAXwIKUIWD67csHlrJoa0FNCo_P0bYpfbaHc4uSLN3kd9TUVPiCHcQisYFYbg4p0j0h7osm8lDHQ05vQ6O-zLoHJVdFpnat5xyD7OU1NNfLNia8iIN7EhfIyda9INFRoExfxBRzEwCIFwP6ZZv5lIhbek_FrJhG_J_ElEUVx52n2lS8scvTer3toF-Sb-DbpgQvLqYVUgQwfmwTM42R2F9yu8K9mu0Q";
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
                            let queryObj = {
                                Insurer_Id: 6,
                                Insurer_Response: data,
                                Created_On: new Date()
                            };
                            /*let MongoClient = require('mongodb').MongoClient;
                             MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                             if (err) {
                             throw err;
                             } else {
                             let iciciinspectionBreakins = db.collection('icici_inspection_breakins');
                             iciciinspectionBreakins.insertOne(queryObj, function (err, inspectionBreakinsdb) {
                             if (err) {
                             throw err;
                             } else {
                             console.log("iciciLombard_check_inspection_status() inspectionBreakinsdb : ", inspectionBreakinsdb.insertedCount, inspectionBreakinsdb.result);
                             }
                             });
                             }
                             });*/
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
                                                    console.error('ICICI Lombard - /inspection/iciciLombard_update_inspection_status_daily - POST calling Request : ', JSON.stringify(args2));
                                                    let url_api = config.environment.weburl + '/inspection/iciciLombard_update_inspection_status_daily';
                                                    execute_post(url_api, args2);
                                                    sleep(2000);
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
                                console.error('iciciLombard_check_inspection_status() GetStatus : ', data['message']);
                                Error_Msg = data['message'];
                                res2.json({'Status': Error_Msg});
                            } else {
                                console.error('iciciLombard_check_inspection_status() GetStatus : ', JSON.stringify(data));
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

    app.post('/inspection/iciciLombard_update_inspection_status_daily', function (req, res2, next) {
        let objInsurerProduct = req.body;
        let dealNo = "", callingService = '', Error_Msg = '', Inspection_Remarks = '';
        let args = {};
        let body = {};

        try {
            if (config.environment.name.toString() === 'Production') {
                dealNo = 'DL-3001/2511179';
                callingService = 'https://app9.icicilombard.com/ILServices/Motor/v1/Breakin/ClearInspectionStatus';
            } else {
                dealNo = 'DEAL-3001-0206164';//'DL-3001/1488439';
                callingService = 'https://cldilbizapp02.cloudapp.net:9001/ILServices/motor/v1/Breakin/ClearInspectionStatus';
            }

            let Icici_Token = require(appRoot + '/models/icici_token');
            Icici_Token.findOne({'Product_Id': 1}, null, {sort: {'Created_On': -1}}, function (err, dbIciciToken) {
                if (err) {
                    console.error('/iciciLombard_update_inspection_status_daily Icici Token not Found', err);
                    Error_Msg = err;
                } else {
                    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
                    //let dbIciciToken = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjZCN0FDQzUyMDMwNUJGREI0RjcyNTJEQUVCMjE3N0NDMDkxRkFBRTEiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJhM3JNVWdNRnY5dFBjbExhNnlGM3pBa2ZxdUUifQ.eyJuYmYiOjE1OTEwOTIyNDIsImV4cCI6MTU5MTA5NTg0MiwiaXNzIjoiaHR0cHM6Ly9jbGRpbGJpemFwcDAyLmNsb3VkYXBwLm5ldDo5MDAxL2NlcmJlcnVzIiwiYXVkIjpbImh0dHBzOi8vY2xkaWxiaXphcHAwMi5jbG91ZGFwcC5uZXQ6OTAwMS9jZXJiZXJ1cy9yZXNvdXJjZXMiLCJlc2JwYXltZW50Il0sImNsaWVudF9pZCI6InJvLnBvbGljeWJvc3MiLCJzdWIiOiI0MmM5ZDY0MC02ZTQ2LTQwN2QtYmZjNi0yOWJhZDUwYmU0MDIiLCJhdXRoX3RpbWUiOjE1OTEwOTIyNDIsImlkcCI6ImxvY2FsIiwic2NvcGUiOlsiZXNicGF5bWVudCJdLCJhbXIiOlsiY3VzdG9tIl19.oqA_VkX0IhBT4Q3lL1x9du0nuIRQVRyw8AxTCOgekQqiFg3JbUGQ451QFWFaDbHJatpRDP0n6daXHm-Z_Cj8fMhsDDXwFo-4w4UVTs7VpQoLCj8pMEfM9OtSI0ujfn52qUsH_0XJwtUDlZv2eFHCzSyhu-bWPVLS7CBfRepKnc7Rp4on1JANJHJ3o2atY4PNvDIukHF4Mqu6bncJ4y9-hoek8bOkobsJFtK_DNlvl0nYJnBirBsB_nC87sbiwWxy3wd3UP5HBKxLrpqz3B8PNwmBls7t4jcoXLxYluI5xhnIabKhlkRc06NDmUT9ODBoRYlZZzV6SWvVQY9Q2PjV4A";
                    console.log('iciciLombard_update_inspection_status_daily() dbIciciToken from DB : ', dbIciciToken);
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
                    console.error('iciciLombard_update_inspection_status_daily Request :: ', JSON.stringify(args));

                    let Client = require('node-rest-client').Client;
                    let client = new Client();
                    client.post(callingService, args, function (data, response) {
                        console.error('iciciLombard_update_inspection_status_daily() ClearInspectionStatus service - Response : ', JSON.stringify(data));
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
                                                    console.log("iciciLombard_update_inspection_status_daily() inspectionBreakinsdb : ", inspectionBreakinsdb.insertedCount, inspectionBreakinsdb.result);
                                                }
                                            });
                                        }
                                    });
                                } catch (ex4) {
                                    Error_Msg = ex4;
                                    console.error('Exception in iciciLombard_update_inspection_status_daily() for inspection_schedule DB updating : ', ex4);
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
                                            console.log("IciciLombardMotor iciciLombard_update_inspection_status_daily() BreakIn Status Updated for : ", objInsurerProduct['Inspection_Id'], ", UD_Id : ", objInsurerProduct['UD_Id']);
                                            console.log("IciciLombardMotor : UD_Id : ", objInsurerProduct['UD_Id'], upres);
                                        }
                                    });
                                } catch (ex4) {
                                    Error_Msg = ex4;
                                    console.error('Exception in iciciLombard_update_inspection_status_daily() for inspection_schedule DB updating : ', ex4);
                                }

                                try {
                                    let User_Data = require(appRoot + '/models/user_data');
                                    let ud_cond = {"User_Data_Id": objInsurerProduct['UD_Id']};
                                    User_Data.findOne(ud_cond, function (err, dbUserData) {
                                        if (err) {
                                            console.error('Exception in iciciLombard_update_inspection_status_daily() : ', err);
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
                                                console.log('iciciLombard_update_inspection_status_daily() UserDataUpdated : ', err, numAffected);
                                            });

                                            let payment_link = "";
                                            if (iciciLombard_breakin_status === 'INSPECTION_APPROVED') {
                                                payment_link = config.environment.portalurl.toString() + '/car-insurance/buynow/' + dbUserData['Premium_Request']['client_id'] + '/' + objInsurerProduct['Service_Log_Unique_Id'] + '_' + objInsurerProduct['SL_Id'] + '_' + objInsurerProduct['UD_Id'] + '/NonPOSP/0';
                                                console.log("iciciLombard_update_inspection_status_daily() payment_link : ", payment_link);
                                            }

                                            let Client2 = require('node-rest-client').Client;
                                            let client2 = new Client2();
                                            client2.get(config.environment.shorten_url + '?longUrl=' + encodeURIComponent(payment_link), function (urlData, urlResponse) {
                                                try {
                                                    let short_url_value = "";
                                                    if (iciciLombard_breakin_status === 'INSPECTION_APPROVED' && urlData && urlData.Short_Url !== '') {
                                                        inspection_status_msg = 'Your Vehicle Inspection has been done successfully. Payment Link is : ';
                                                        short_url_value = urlData.Short_Url;
                                                        console.log("iciciLombard_update_inspection_status_daily() inspection_status_msg : ", inspection_status_msg, short_url_value);
                                                    }
                                                    if (iciciLombard_breakin_status === 'INSPECTION_REJECTED') {
                                                        inspection_status_msg = 'Your Vehicle Inspection has been Rejected. REMARKS : ' + Inspection_Remarks;
                                                        console.log("iciciLombard_update_inspection_status_daily() inspection_status_msg : ", inspection_status_msg);
                                                        short_url_value = "";
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
                                                        'short_url': short_url_value
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
                                                        let email_agent = '';
                                                        if (dbUserData.Premium_Request['posp_email_id'] !== 0 && dbUserData.Premium_Request['posp_email_id'] !== null && dbUserData.Premium_Request['posp_email_id'].toString().indexOf('@') > -1) {
                                                            email_agent = dbUserData.Premium_Request['posp_email_id'].toString();
                                                        }
                                                        let arr_bcc = [config.environment.notification_email];
                                                        if (dbUserData.Premium_Request.hasOwnProperty('posp_reporting_email_id') && dbUserData.Premium_Request['posp_reporting_email_id'] !== '' && dbUserData.Premium_Request['posp_reporting_email_id'] !== null) {
                                                            if (dbUserData.Premium_Request['posp_reporting_email_id'] !== 0 && dbUserData.Premium_Request['posp_reporting_email_id'].toString().indexOf('@') > -1) {
                                                                arr_bcc.push(dbUserData.Premium_Request['posp_reporting_email_id']);
                                                            }
                                                        }
                                                        if (dbUserData['Premium_Request'].hasOwnProperty('posp_sub_fba_email') && dbUserData['Premium_Request']['posp_sub_fba_email'] !== 0 && dbUserData['Premium_Request']['posp_sub_fba_email'] !== null && dbUserData['Premium_Request']['posp_sub_fba_email'].toString().indexOf('@') > -1) {
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
                                                        res2.json({'Status': Error_Msg});
                                                    }
                                                } catch (e) {
                                                    console.error('Exception in iciciLombard_update_inspection_status_daily() for mailing : ', e);
                                                    res2.json({'Status': e});
                                                }
                                            });
                                        }
                                    });
                                } catch (ex2) {
                                    console.error('Exception in iciciLombard_update_inspection_status_daily() for User_Data db details : ', ex2);
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
            console.error('Exception in iciciLombard_update_inspection_status_daily() for User_Data db details : ', ex3);
            res2.json({'Status': ex3});
        }
        //res2.json({'Status': Error_Msg});
    });

    app.get('/inspection/hdfcergo_breakin_ids', function (req, res, next) {
        //console.log('Start', this.constructor.name, 'hdfcergo_breakin_ids');
        try {
            let cond = {"Status": {$in: ["INSPECTION_SCHEDULED", "INSPECTION_APPROVED"]}};
            let day_back = 5;
            if (req.query.hasOwnProperty('range')) {
                day_back = req.query['range'];
            }

            let today = moment().utcOffset("+05:30").startOf('Day');
            let fromDate = moment(today).format("YYYY-MM-D");
            let toDate = moment(today).format("YYYY-MM-D");
            let arrFrom = fromDate.split('-');
            let dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 1, arrFrom[2] - 0);
            dateFrom.setDate(dateFrom.getDate() - day_back);
            let arrTo = toDate.split('-');
            let dateTo = new Date(arrTo[0] - 0, arrTo[1] - 1, arrTo[2] - 0);
            dateTo.setDate(dateTo.getDate() + 1);
            cond['Created_On'] = {"$gte": dateFrom, "$lte": dateTo};
            //let hdfcergo_breakin = require('../models/hdfcergo_breakin');
            inspection_schedule.find(cond).select(['UD_Id', 'Agent_Code', 'Proposal_Number', 'PB_CRN', 'Created_On', 'Status']).exec(function (err, dbUsers) {
                if (err) {
                    res.send(err);
                }
                try {
                    if (!err) {
                        console.error('Log', 'hdfcergo_breakin_ids', dbUsers);
                        let objCSSummary = [];
                        for (let k in dbUsers) {
                            let user = dbUsers[k]._doc;
                            //console.log('Log', 'user', user);
                            let args = {
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
                            let url_api = config.environment.weburl + '/inspection/hdfcergo_breakin_data';
                            execute_post(url_api, args);
                            sleep(2000);
                        }
                        //log email
                        let msg = '<!DOCTYPE html><html><head><title>EPR CS SYNC</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                        msg += '<div class="report" ><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">BREAKIN_SCHEDULE</span><table style="-moz-box-shadow: 1px 1px 3px 2px #d3d3d3;-webkit-box-shadow: 1px 1px 3px 2px #d3d3d3;  box-shadow:         1px 1px 3px 2px #d3d3d3;" border="0" cellpadding="3" cellspacing="0" width="95%"  >';
                        let row_inc = 0;
                        for (let k in objCSSummary) {
                            if (row_inc === 0) {
                                msg += '<tr>';
                                for (let k_head in objCSSummary[k]) {
                                    msg += '<th style="font-size:12px;font-family:\'Google Sans\' ,tahoma;background-color: #d7df01">' + k_head + '</th>';
                                }
                                msg += '</tr>';
                            }
                            msg += '<tr>';
                            for (let k_row in objCSSummary[k]) {
                                msg += '<td style="font-size:12px;font-family:\'Google Sans\' ,tahoma;" align="center">' + objCSSummary[k][k_row] + '</td>';
                            }
                            msg += '</tr>';
                            row_inc++;
                        }
                        msg += '</table></div>';
                        let Email = require('../models/email');
                        let objModelEmail = new Email();
                        let sub = '[' + config.environment.name.toString().toUpperCase() + '-SCHEDULE]';
                        let today = moment().format('YYYY-MM-DD_HH:mm:ss');
                        sub += 'BREAKIN_PROCESS::' + today.toString();
                        objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, sub, msg, '', '');
                        //log email
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

    app.post('/inspection/hdfcergo_breakin_data', function (req, res2, next) {
        let not_verified_result = JSON.parse(JSON.stringify(req.body));
        let UD_Id = not_verified_result['udid'] - 0;
        let PB_CRN = not_verified_result['PB_CRN'] - 0;
        let Status = not_verified_result['Status'];
        let Proposal_Number = not_verified_result['PGTransNo'];
        let Agent_Code = not_verified_result['AgentCode'];
        console.log('Proposal_Number :', Proposal_Number, '- Agent_Code :', Agent_Code);
        let args = {
            AgentCode: Agent_Code,
            PGTransNo: Proposal_Number //'MT1902048737T'
        };
        let callingService = '';
        if (config.environment.name.toString() === 'Production')
        {
            callingService = 'https://hewspool.hdfcergo.com/motorcp/service.asmx?WSDL';
        } else {
            callingService = 'http://202.191.196.210/uat/onlineproducts/newmotorcp/service.asmx?WSDL';
        }
        let Error_Msg = '';
        let soap = require('soap');
        let xml2js = require('xml2js');
        soap.createClient(callingService, function (err, client) {
            client['GetBreakinInspectionStatus'](args, function (err1, result, raw, soapHeader) {
                if (err1) {
                    console.error('HDFCErgoMotor', 'service_call', 'exception', err1);
                    let objResponseFull = {
                        'err': err1,
                        'result': result,
                        'raw': raw,
                        'soapHeader': soapHeader,
                        'objResponseJson': null
                    };
                    console.error('HDFCErgo Check BreakInStatus service response :', objResponseFull);
                } else
                {
                    let objResponseJson = {};
                    let objResponseJsonLength = Object.keys(result).length;
                    let processedXml = 0;
                    for (let key in result)
                    {
                        let keyJsonObj = JSON.parse('{"' + key + '":{}}');
                        Object.assign(objResponseJson, keyJsonObj);
                        xml2js.parseString(result[key], function (err2, objXml2Json) {
                            processedXml++;
                            if (err2) {
                                console.error('HDFCErgoMotor', 'service_call', 'xml2jsonerror', err2);
                                let objResponseFull = {
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
                                    let objResponseFull = {
                                        'result': result,
                                        'raw': raw,
                                        'soapHeader': soapHeader,
                                        'objResponseJson': objResponseJson
                                    };
                                    //log
                                    let today = moment().utcOffset("+05:30");
                                    let today_str = moment(today).format("YYYYMMD");
                                    let objRequest = {
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
                                                let hdfcergo_breakin_status = '';
                                                let user_data_status = '';
                                                let email_template = '';
                                                let email_sub_status = '';
                                                let insurer_inspection_status = objResponseJson['GetBreakinInspectionStatusResult']['BreakinDTO']['BreakInStatus']['0'];
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
                                                    //let hdfcergo_breakin_db = require(appRoot + '/models/hdfcergo_breakin');
                                                    let date = new Date();
                                                    let myquery = {Proposal_Number: Proposal_Number};
                                                    let newvalues = {$set: {Status: hdfcergo_breakin_status, Modified_On: date}};
                                                    inspection_schedule.updateOne(myquery, newvalues, function (err, numaffected) {
                                                        if (err) {
                                                            throw err;
                                                        } else {
                                                            console.log("HDFCErgo : BreakInStatus Updated for:Verified", Proposal_Number);
                                                            console.log("HDFCErgo : UD_Id : ", UD_Id);
                                                        }
                                                    });
                                                    if (insurer_inspection_status === 'ISSUED') {
                                                        let myquery = {
                                                            'PB_CRN': PB_CRN,
                                                            'Proposal_Number': {'$ne': Proposal_Number}
                                                        };
                                                        let newvalues = {$set: {Status: 'CLOSED', Modified_On: date}};
                                                        inspection_schedule.update(myquery, newvalues, {multi: true}, function (err, numaffected) {
                                                            if (err) {
                                                                throw err;
                                                            } else {
                                                                console.log("HDFCErgo : BreakInStatus Updated for:Verified", Proposal_Number);
                                                                console.log("HDFCErgo : UD_Id : ", UD_Id);
                                                            }
                                                        });
                                                    }

                                                    try {
                                                        let User_Data = require(appRoot + '/models/user_data');
                                                        let ud_cond = {
                                                            "User_Data_Id": UD_Id,
                                                            'Last_Status': {"$nin": ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY']}
                                                        };
                                                        User_Data.findOne(ud_cond, function (err, dbUserData) {
                                                            if (err) {
                                                                console.error('Exception', err);
                                                            } else {
                                                                if (dbUserData) {
                                                                    dbUserData = dbUserData._doc;
                                                                    let objUserData = {
                                                                        'Last_Status': null,
                                                                        'Status_History': null
                                                                    };
                                                                    let Status_History = (dbUserData.hasOwnProperty('Status_History')) ? dbUserData.Status_History : [];
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
                                                                    let dataObj = dbUserData['Proposal_Request_Core'];
                                                                    let objRequestCore = {
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
                                                                    let processed_request = {};
                                                                    for (let key in objRequestCore) {
                                                                        if (typeof objRequestCore[key] !== 'object') {
                                                                            processed_request['___' + key + '___'] = objRequestCore[key];
                                                                        }
                                                                    }
                                                                    console.error('Breakin Email', Status, hdfcergo_breakin_status);
                                                                    if ((insurer_inspection_status === 'RECOMMENDED' || insurer_inspection_status === 'NOT RECOMMENDED') && Status === 'INSPECTION_SCHEDULED' && hdfcergo_breakin_status === 'INSPECTION_APPROVED') {
                                                                        let email_data = fs.readFileSync(appRoot + '/resource/email/' + email_template).toString();
                                                                        email_data = email_data.replaceJson(processed_request);
                                                                        let emailto = dataObj['email'];
                                                                        let sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[Car] Inspection Verification ' + email_sub_status + ' CRN : ' + dataObj['crn'];
                                                                        let Email = require(appRoot + '/models/email');
                                                                        let objModelEmail = new Email();
                                                                        let email_agent = '';
                                                                        if (dbUserData.Premium_Request['posp_email_id'] !== 0 && dbUserData.Premium_Request['posp_email_id'] !== null && dbUserData.Premium_Request['posp_email_id'].toString().indexOf('@') > -1) {
                                                                            email_agent = dbUserData.Premium_Request['posp_email_id'].toString();
                                                                        }
                                                                        let arr_bcc = [config.environment.notification_email];
                                                                        if (dbUserData.Premium_Request.hasOwnProperty('posp_reporting_email_id') && dbUserData.Premium_Request['posp_reporting_email_id'] !== '' && dbUserData.Premium_Request['posp_reporting_email_id'] !== null) {
                                                                            if (dbUserData.Premium_Request['posp_reporting_email_id'] !== 0 && dbUserData.Premium_Request['posp_reporting_email_id'].toString().indexOf('@') > -1) {
                                                                                arr_bcc.push(dbUserData.Premium_Request['posp_reporting_email_id']);
                                                                            }
                                                                        }
                                                                        if (dbUserData['Premium_Request'].hasOwnProperty('posp_sub_fba_email') && dbUserData['Premium_Request']['posp_sub_fba_email'] !== 0 && dbUserData['Premium_Request']['posp_sub_fba_email'] !== null && dbUserData['Premium_Request']['posp_sub_fba_email'].toString().indexOf('@') > -1) {
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
                                                                    }
                                                                    if (insurer_inspection_status === 'ISSUED') {
                                                                        let sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[Car] Inspection Verification "' + insurer_inspection_status + '" CRN : ' + dbUserData['PB_CRN'];
                                                                        let Email = require(appRoot + '/models/email');
                                                                        let objModelEmail = new Email();
                                                                        let email_data = '<!DOCTYPE html><html><head><title>INSPECTION_NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                                                                        email_data += '<div class="report"><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">INSPECTION_NOTIFICATION</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
                                                                        email_data += '<tr><td  width="70%" style="font-family:\'Google Sans\' ,tahoma;font-size:14px;"><pre>';
                                                                        for (let k in objRequestCore) {
                                                                            email_data += k + ':' + objRequestCore[k] + '<br/>';
                                                                        }
                                                                        email_data += '</pre></td></tr>';
                                                                        email_data += '</table></div><br></body></html>';
                                                                        let arr_bcc = [config.environment.notification_email];
                                                                        objModelEmail.send('noreply@policyboss.com', 'notifications@policyboss.com', sub, email_data, '', arr_bcc.join(','), dbUserData['PB_CRN']);
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
                                                        /*let hdfcergo_breakin = require(appRoot + '/models/hdfcergo_breakin');
                                                         let date = new Date();
                                                         let myquery = {Proposal_Number: Proposal_Number};
                                                         let newvalues = {$set: {Status: insurer_inspection_status, Modified_On: date}};
                                                         inspection_schedule.updateOne(myquery, newvalues, function (err, res) {
                                                         if (err) {
                                                         throw err;
                                                         } else {
                                                         //res2.json(res);
                                                         console.log("HDFCErgo : BreakInStatus Updated for:Issued", Proposal_Number);
                                                         }
                                                         });
                                                         */

                                                        let User_Data = require(appRoot + '/models/user_data');
                                                        let ud_cond = {"User_Data_Id": UD_Id};
                                                        User_Data.findOne(ud_cond, function (err, dbUserData) {
                                                            if (err) {
                                                                console.error('Exception', err);
                                                            } else {


                                                                dbUserData = dbUserData._doc;
                                                                let dataObj = dbUserData['Proposal_Request_Core'];
                                                                let objRequestCore = {
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
                                                                let sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[Car] Inspection Verification "' + insurer_inspection_status + '" CRN : ' + dbUserData['PB_CRN'];
                                                                let Email = require(appRoot + '/models/email');
                                                                let objModelEmail = new Email();
                                                                let email_data = '<!DOCTYPE html><html><head><title>INSPECTION_NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                                                                email_data += '<div class="report"><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">INSPECTION_NOTIFICATION</span><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
                                                                email_data += '<tr><td  width="70%" style="font-family:\'Google Sans\' ,tahoma;font-size:14px;"><pre>';
                                                                for (let k in objRequestCore) {
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

};

