/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
var Base = require('../libs/Base');
var mongojs = require('mongojs');
var path = require('path');
var fs = require('fs');
var sleep = require('system-sleep');
const csv = require('csv-parser');
var moment = require('moment');
var appRoot = path.dirname(path.dirname(require.main.filename));
var myDb = mongojs(config.db.connection + ':27017/' + config.db.name);
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database
var Posp = require('../models/posp');
module.exports.controller = function (app) {

    app.post('/create_campaign', function (req, res) {
        try {
            var ObjRequest = req.body;
            console.log("data = " + ObjRequest);
            var posp_reequipment_campaign = require('../models/posp_reequipment_campaign');
            var MongoClient = require('mongodb').MongoClient;
            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                if (err)
                    throw err;
                var obj = {
                    "Campaign_name": ObjRequest.camp_name,
                    "Description": ObjRequest.description,
                    "Start_date": ObjRequest.start_date,
                    "End_date": ObjRequest.end_date,
                    "Status": "Active"
                };
                var campaigns_obj = new posp_reequipment_campaign(obj);
                campaigns_obj.save(function (err1) {
                    if (err1)
                        res.json({'Msg': "Fail to add campaign"});
                    else {
                        res.json({'Msg': "campaign added"});
                    }
                });
            });
        } catch (e) {
            console.error(e);
            res.json({'Msg': 'Fail', 'Error': e});

        }
    });

    app.get('/get_campaign_data', function (req, res) {
        var campaign = require('../models/posp_reequipment_campaign');
        campaign.find(function (err, obj) {
            if (err) {
            } else {
                res.json(obj);
            }
        });
    });

    app.get('/get_campaign_type', function (req, res) {
        var campaign = require('../models/posp_lead');
        campaign.find(function (err, obj) {
            if (err) {
            } else {
                res.json(obj);
            }
        });
    });

    app.post('/saveFosData', function (req, res) {
        try {
            var ObjRequest = req.body;
            var fos_registration = require('../models/fos_onboarding');

            fos_registration.find({ss_id: parseInt(ObjRequest["ss_id"])}, function (err, dblmsData) {
                if (err) {
                    throw err;
                } else {
                    if (dblmsData.length > 0) {
                        res.json({'Msg': 'ss_id already exist', 'Status': 'error'});
                    } else {
                        var arg = {
                            'Full_Name': ObjRequest['name'],
                            'Mobile': parseInt(ObjRequest['mobile']),
                            'Email': ObjRequest['email'],
                            'Pan': ObjRequest['pan'],
                            'Aadhar': parseInt(ObjRequest['aadhar']),
                            'Gst': ObjRequest['gst'],
                            'Address_1': ObjRequest['address_1'],
                            'Address_2': ObjRequest['address_2'],
                            'Address_3': ObjRequest['address_3'],
                            'Pincode': parseInt(ObjRequest['pincode']),
                            'City': ObjRequest['city'],
                            'State': ObjRequest['state'],
                            'Account_No': parseInt(ObjRequest['accountNo']),
                            "IFSC_Code": ObjRequest['IFSCCode'],
                            "MICR_Code": parseInt(ObjRequest['MICRCode']),
                            "Bank_Name": ObjRequest['bankName'],
                            "Branch": ObjRequest['branch'],
                            "Bank_City": ObjRequest['bankCity'],
                            "Account_Type": ObjRequest['account'],
                            "Pan_Card": ObjRequest['pancard'],
                            "Aadhar_Card_Front": ObjRequest['aadharcardfront'],
                            "Aadhar_Card_Back": ObjRequest['Aadharcardback'],
                            "Cancelled_Chq": ObjRequest['cancelledchq'],
                            "Gst_Certification": ObjRequest['gstcertification'],
                            "ss_id": parseInt(ObjRequest['ss_id']),
                            "level": "Level1",
                            "status": "Waiting for approved"
                        };
                        var MongoClient = require('mongodb').MongoClient;
                        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                            if (err)
                                throw err;
                            var fos_registrations = db.collection('fos_onboardings');
                            fos_registrations.insertOne(arg, function (err, result) {
                                if (err) {
                                    res.json({'Msg': 'Data not added', 'Status': 'error'});
                                } else {
                                    res.json({'Msg': 'Data Added Successfully', 'Status': 'Success'});
                                }
                            });
                        });
                    }
                }
            });
        } catch (e) {
            console.error(e);
            res.json({'Msg': 'Fail', 'Error': e});
        }
    });

    app.get('/check_fos_present/:ss_id', function (req, res) {
        try {
            let ss_id = req.params.ss_id;
            var fos_registration = require('../models/fos_onboarding');
            fos_registration.find({ss_id: parseInt(ss_id)}, function (err, dblmsData) {
                if (err) {
                    throw err;
                } else {
                    if (dblmsData.length > 0) {
                        res.json({'Msg': 'ss_id already exist and Status is ', 'Status': 'error', 'fos_status': dblmsData[0]._doc["status"]});
                    } else {
                        res.json({'Msg': 'ss_id not exist', 'Status': 'sucess'});
                    }
                }
            });
        } catch (e) {
            res.send(e.stack);
        }
    });

    app.get('/get_pending_approval/:ss_id', function (req, res) {
        try {
            let ss_id = parseInt(req.params.ss_id);
            var MongoClient = require('mongodb').MongoClient;
            var fos_onboarding = require('../models/fos_onboarding');
            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                if (err)
                    throw err;
                var fosApproverLists = db.collection('fos_approver_lists');
                fosApproverLists.findOne({ss_id: ss_id}, function (err, fosData) {
                    if (err)
                        res.send(err);
                    else {
                        if (fosData !== null) {
                            var level = fosData["level"];

                            if (level === "Level1") {
                                var obj = {
                                    "level": level,
                                    "status": {$ne: "approved"}
                                };
                            } else {
                                var obj = {
                                    $or: [
                                        {"level": "Level1", "status": "approved"},
                                        {"level": "Level2", "status": {$ne: "approved"}}
                                    ]
                                };
                            }
                            fos_onboarding.find(obj, function (err, dblmsData) {
                                if (err)
                                    throw err;
                                if (dblmsData.length > 0) {
                                    for (var k in dblmsData) {
                                        dblmsData[k]._doc["approver_level"] = level;
                                    }
                                    res.send(dblmsData);
                                } else {
                                    res.json({'Msg': 'No data available', 'Status': 'error'});
                                }
                            });
                        } else {
                            res.json({'Msg': 'ss_id not have permission', 'Status': 'error'});
                        }
                    }
                });
            });
        } catch (e) {
            res.send(e.stack);
        }
    });

    app.post('/update_fos_status', function (req, res) {
        try {
            var ObjRequest = req.body;
            var fos_registration = require('../models/fos_onboarding');
            var chech_level;
            if (ObjRequest["approver_level"] === "Level2") {
                chech_level = "Level2";
            } else {
                chech_level = ObjRequest["level"];
            }
            var obj = {
                "level": chech_level,
                "status": ObjRequest["status"]
            };
            fos_registration.update({ss_id: parseInt(ObjRequest["ss_id"])}, {$set: obj}, function (err, dblmsData) {
                if (err) {
                    res.json({'Msg': 'Fail to Update status', 'Status': 'error'});
                } else {
                    res.json({'Msg': 'Status Updated', 'Status': 'success'});
                }
            });
        } catch (e) {
            console.error(e);
            res.json({'Msg': 'Fail', 'Error': e});
        }
    });

    app.post('/update_posp_enquiry', function (req, res, next) {
        var objRequest = req.body;
        var camp_id = objRequest["campaign_id"];
        let file = "";
        let file_ext = "";
        var sleep = require('system-sleep');
        var fs = require('fs');
        var path1 = require('path');
        var MongoClient = require('mongodb').MongoClient;
        var appRoot = path1.dirname(path1.dirname(require.main.filename));
        let path = appRoot + "/tmp/posp_enquiry_data";
        file = decodeURIComponent(objRequest["file"]);
        file_ext = objRequest["file_ext"];
        let fileName = path + '/posp_enquiry_data.' + file_ext;
        var data = file.replace(/^data:image\/\w+;base64,/, "");
        if (data === "") {
        } else {
            let buf = new Buffer(data, 'base64');
            fs.writeFile(fileName, buf);
        }
        sleep(5000);
        let file_excel = appRoot + "/tmp/posp_enquiry_data/posp_enquiry_data." + file_ext;
        let XLSX = require('xlsx');
        let workbook = XLSX.readFile(file_excel);
        let sheet_name_list = workbook.SheetNames;
        var requestObj = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        try {
            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                var posp_enquiry = db.collection('posp_enquiries');
                if (requestObj.length > 0) {
                    for (var k in requestObj) {
                        requestObj[k]["Source"] = "POSP-WEB";
                        requestObj[k]["Campgin_Id"] = parseInt(camp_id);
                    }
                }
                console.log(requestObj);
                posp_enquiry.insertMany(requestObj, function (err, res1) {
                    if (err) {
                        res.json({'Status': "error"});
                    } else {
                        res.json({'Status': "Success"});
                    }
                });
            });
        } catch (err) {
            console.log(err);
            res.json({'msg': 'error'});
        }
    });

    app.post('/get_posp_lead_data', LoadSession, function (req, res, next) {
        try {
            var Base = require('../libs/Base');
            var objBase = new Base();
            var obj_pagination = objBase.jqdt_paginate_process(req.body);

            var optionPaginate = {
                select: 'Campgin_name Enqiry_name Mobile Email Date',
                lean: true,
                page: 1,
                limit: 10
            };

            if (obj_pagination) {
                optionPaginate['page'] = obj_pagination.paginate.page;
                optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
            }
            var filter = obj_pagination.filter;
            console.error('HorizonLeadList', filter, req.body);
            var ObjRequest = req.body;

            if (ObjRequest.camp_Name !== "" && ObjRequest.camp_Name !== undefined) {
                filter["Campgin_name"] = ObjRequest.camp_Name;
            }

            var lead = require('../models/posp_lead');
            console.error('HorizonPOSPList', filter, req.body);
            lead.paginate(filter, optionPaginate).then(function (user_datas) {
                res.json(user_datas);
            });
        } catch (e) {
            console.error(e);
            res.json({'Msg': 'error', 'Status': 'fail'});
        }
    });

    function LoadSession(req, res, next) {
        try {
            var objRequestCore = req.body;
            if (req.method == "GET") {
                objRequestCore = req.query;
            }
            if (req.query && req.query !== {}) {
                for (let k in req.query) {
                    objRequestCore[k] = req.query[k];
                }
            }
            objRequestCore = JSON.parse(JSON.stringify(objRequestCore));
            if (objRequestCore.hasOwnProperty('session_id') && objRequestCore['session_id'] != '') {
                var Session = require('../models/session');
                Session.findOne({"_id": objRequestCore['session_id']}, function (err, dbSession) {
                    if (err) {
                        res.send(err);
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
                return next();
            }
        } catch (e) {
            console.error('Exception', 'GetReportingAssignedAgent', e);
            return next();
        }
    }
};