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
var appRoot = path.dirname(path.dirname(require.main.filename));
var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
var config = require('config');
var mongojs = require('mongojs');
var autoIncrement = require("mongodb-autoincrement");
var myDb = mongojs(config.db.connection + ':27017/' + config.db.name);
var disposition = require('../models/disposition');

module.exports.controller = function (app) {

    app.post('/disposition_status_update', function (req, res, next) {
        try {
            var User_Data = require('../models/user_data');
            var formidable = require('formidable');
            var form = new formidable.IncomingForm();
            var fs = require('fs');
            form.parse(req, function (err, fields, files) {
                var User_Data_Id = fields["dsp_udid"];
                var todayDate = new Date();
                var dispoisition_file_name = "";
                if (files.length > 0) {
                    dispoisition_file_name = files['disposition_file'].name;
                }
                var User_Details =
                        {
                            ss_id: fields["user_ss_id"],
                            fba_id: fields["user_fba_id"]
                        };
                try {
                    // var dispositionCont = require('../controllers/dispositions');
                    disposition.find({
                        "PB_CRN": fields["dsp_crn"]
                    }).sort({"Modified_On": -1}).limit(1).exec(function (err, dbRequest) {
                        if (err) {
                            res.json({Msg: 'Disposition Not Saved', Details: err});
                        } else {
                            disposition.update({'PB_CRN': dbRequest[0]._doc["PB_CRN"], 'Modified_On': dbRequest[0]._doc['Modified_On']}, {$set: {"Is_Latest": 0}}, function (err, numAffected) {
                                if (err) {
                                    res.json({Msg: 'Disposition Not Saved', Details: err});
                                } else {
                                    //res.json({Msg: 'Success_Created', Details: numAffected});
                                }
                            });
                        }
                    });
                } catch (ex) {
                    console.log("Update ", ex);
                }
                var arg = {
                    User_Data_Id: fields["dsp_udid"],
                    PB_CRN: fields["dsp_crn"],
                    Status: fields["dsp_status"],
                    Sub_Status: fields["dsp_substatus"],
                    Created_On: todayDate,
                    Modified_On: todayDate,
                    Remark: fields["dsp_remarks"],
                    Lead_Call_Back_Time: fields["Lead_Call_Back_Time"],
                    ss_id: fields["dsp_ss_id"],
                    Is_Latest: 1,
                    fba_id: fields["dsp_fba_id"],
                    User_Data: User_Details,
                    File_Name: dispoisition_file_name
                };
                var dispositionObj = new disposition(arg);
                dispositionObj.save(function (err) {
                    if (err)
                        throw err;
                    if (files.hasOwnProperty('disposition_file')) {

                        var pdf_file_name = files['disposition_file'].name;
                        var path = appRoot + "/tmp/disposition/";
                        var pdf_sys_loc_horizon = path + fields["dsp_crn"] + '/' + pdf_file_name;
                        var oldpath = files.disposition_file.path;
                        if (fs.existsSync(path + fields["dsp_crn"]))
                        {

                        } else
                        {
                            fs.mkdirSync(path + fields["dsp_crn"]);
                        }
                        fs.readFile(oldpath, function (err, data) {
                            if (err) {
                                console.error('Read', err);
                            }
                            console.log('File read!');

                            // Write the file
                            fs.writeFile(pdf_sys_loc_horizon, data, function (err) {
                                if (err) {
                                    console.error('Write', err);
                                }
                                console.log('File uploaded and moved!');
                                console.log('File written!');

                            });
                            // Delete the file
                            fs.unlink(oldpath, function (err) {
                                if (err)
                                    throw err;
                                console.log('File deleted!');
                            });
                        });

                    }
                    var objUserData = {
                        'Disposition_Status': fields["dsp_status"],
                        'Disposition_SubStatus': fields["dsp_substatus"],
                        'Disposition_Modified_On': todayDate,
                        'Lead_Call_Back_Time': fields["Lead_Call_Back_Time"]
                    };
                    console.log('File uploaded and moved!');
                    User_Data.update({'User_Data_Id': User_Data_Id}, {$set: objUserData}, function (err, numAffected) {
                        console.log('UserDataUpdated', err, numAffected);
                        if (err) {
                            objUserData['Msg'] = err;
                        } else {
                            objUserData['Msg'] = numAffected;
                        }
                        //res.json(objUserData);
                    });

                    res.json({'msg': 'success'});
                });
            });

        } catch (err) {
            console.log(err);
            res.json({'msg': 'error'});
        }
    });

    app.post('/dialer_disposition_status_update_NIA', function (req, res, next) {
        try {
            var User_Data = require('../models/user_data');
            req.body = JSON.parse(JSON.stringify(req.body));
            var objRequestCore = req.body;
            var User_Data_Id = objRequestCore["udid"];
            var todayDate = new Date();
            try {
                disposition.find({
                    "User_Data_Id": objRequestCore["udid"]
                }).sort({"Modified_On": -1}).limit(1).exec(function (err, dbRequest) {
                    if (err) {
                        res.json({Msg: 'Disposition Not Saved', Details: err});
                    } else {
                        disposition.update({'User_Data_Id': dbRequest[0]._doc["User_Data_Id"], 'Modified_On': dbRequest[0]._doc['Modified_On']}, {$set: {"Is_Latest": 0}}, function (err, numAffected) {
                            if (err) {
                                res.json({Msg: 'Disposition Not Saved', Details: err});
                            } else {
                                //res.json({Msg: 'Success_Created', Details: numAffected});
                            }
                        });
                    }
                });
            } catch (ex) {
                console.log("Update ", ex);
            }
            var arg = {
                User_Data_Id: objRequestCore["udid"],
                Status: objRequestCore["dispostion_status"],
                Sub_Status: objRequestCore["dispostion_sub_status"],
                Lead_Phone1: objRequestCore["mobile_number_1"],
                Lead_Phone2: objRequestCore["mobile_number_2"],
                Customer_Name: objRequestCore["customer_name"],
                Call_Start_Time: objRequestCore["call_start_time"],
                Call_End_Time: objRequestCore["call_end_time"],
                Lead_First_Dial_Time: objRequestCore["lead_first_dial_time"],
                Lead_Call_Back_Time: objRequestCore["lead_next_dial_time"],
                Lead_Id: objRequestCore["lead_id"],
                Service_Id: objRequestCore["service_id"],
                Service_Name: objRequestCore["service_name"],
                Call_Type: objRequestCore["call_type"],
                Campaing_Name: objRequestCore["batch_name"],
                Created_On: todayDate,
                Modified_On: todayDate,
                Remark: objRequestCore["remarks"],
                Is_Latest: 1
            };
            var dispositionObj = new disposition(arg);
            dispositionObj.save(function (err) {
                if (err)
                    throw err;
                var objUserData = {
                    'Disposition_Status': objRequestCore["dispostion_status"],
                    'Disposition_SubStatus': objRequestCore["dispostion_sub_status"],
                    'Disposition_Modified_On': todayDate
                };
                User_Data.update({'User_Data_Id': User_Data_Id}, {$set: objUserData}, function (err, numAffected) {
                    console.log('UserDataUpdated', err, numAffected);
                    if (err) {
                        objUserData['Msg'] = err;
                    } else {
                        objUserData['Msg'] = numAffected;
                    }
                    //res.json(objUserData);
                });

                res.json({'msg': 'success'});
            });
            // });

        } catch (err) {
            console.log(err);
            res.json({'msg': 'error'});
        }
    });
  
    app.post('/dialer_disposition_status_update', function (req, res) {
        try {
            var ObjRequest = req.body;
            var lead_disposition = require('../models/lead_disposition');
            var disposition_history = require('../models/disposition_history');
            var lead = require('../models/leads');
            var User_Data = require('../models/user_data');
            var Disposition_Master = require('../models/disposition_master');

            lead_disposition.find({User_Data_Id: ObjRequest["Cust_ID"]}, function (err, dblmsData) {
                if (err) {
                    throw err;
                } else {
                    Disposition_Master.find({Sub_Status_Code:ObjRequest["Sub_Disposition"]}, function (err, dbDisData) {
                        if (err) {
                            throw err;
                        } else {
                            if (dbDisData && (dbDisData.length > 0) && dbDisData[0] && dbDisData[0]._doc){
                                ObjRequest["Disposition"] = ObjRequest["Disposition"] === "C" ? "Connected":"Not Connected";
                                ObjRequest["Sub_Disposition"] = dbDisData[0]._doc['Sub_Status_Description'];
                            } else {
                                ObjRequest["Disposition"] = ObjRequest["Disposition"] === "C" ? "Connected":"Not Connected";
                            }
                    if (Object.keys(dblmsData).length > 0) {
                        var Update_arg = {
                            Status: ObjRequest["Disposition"],
                            Sub_Status: ObjRequest["Sub_Disposition"],
                            Modified_On: new Date(),
                            Remark: ObjRequest["Call Remarks"],
                            Customer_Mobile: ObjRequest["mobile_number"],
                            Next_Call_Date: new Date(ObjRequest["Call_Back_Date"]),
                            Dialer_Request_Core: ObjRequest
                        };
                        lead_disposition.update({'User_Data_Id': ObjRequest["Cust_ID"]}, {$set: Update_arg}, {multi: false}, function (err, numAffected) {
                            if (err)
                                throw err;
                            res.json({'Msg': 'Success'});
                        });
                    } else {
                        var arg = {
                            User_Data_Id: ObjRequest["Cust_ID"],
                            Status: ObjRequest["Disposition"],
                            Sub_Status: ObjRequest["Sub_Disposition"],
                            Created_On: new Date(),
                            Modified_On: new Date(),
                            Remark: ObjRequest["Call Remarks"],
                            Is_Latest: 1,
                            Customer_Mobile: ObjRequest["mobile_number"],
                            Next_Call_Date: new Date(ObjRequest["Call_Back_Date"]),
                            Dialer_Request_Core: ObjRequest
                        };
                        var dispositionObj = new lead_disposition(arg);
                        dispositionObj.save(function (err) {
                            console.error(err);
                            if (err)
                                throw err;

                            res.json({'Msg': 'Success'});
                        });
                    }

                    //Lead Update 

                    var objLeadData = {'lead_disposition': ObjRequest["Disposition"],
                        'lead_subdisposition': ObjRequest["Sub_Disposition"],
                        'lead_disposition_assigned_on': new Date()
                    };
                    lead.update({'User_Data_Id': ObjRequest["Cust_ID"]}, {$set: objLeadData}, {multi: false}, function (err, numAffected) {
                        if (err)
                            throw err;

                    });

                    //Userdata Update 
                    var objUserData = {
                        'Disposition_Status': ObjRequest["Disposition"],
                        'Disposition_SubStatus': ObjRequest["Sub_Disposition"],
                        'Disposition_Modified_On': new Date()
                    };
                    User_Data.update({'User_Data_Id': ObjRequest["Cust_ID"]}, {$set: objUserData}, function (err, numAffected) {
                        console.log('UserDataUpdated', err, numAffected);
                        if (err) {
                            objUserData['Msg'] = err;
                        } else {
                            objUserData['Msg'] = numAffected;
                        }
                        //res.json(objUserData);
                    });

                    //Disposition history
                    var objDispostion = {
                        "UDID": ObjRequest["Cust_ID"],
                        "PB_CRN": "",
                        "Status": ObjRequest["Disposition"],
                        "SubStatus": ObjRequest["Sub_Disposition"],
                        "Created_On": new Date(),
                        "Modified_On": new Date(),
                        "Remark": ObjRequest["Call Remarks"],
                        "ss_id": 0,
                        "IsLatest": 1,
                        "fba_id": 0,
                        "User_Data": ObjRequest,
                        "File_Name": ""
                    };
                    var disposition = new disposition_history(objDispostion);
                    disposition.save(function (err) {
                        console.error(err);
                        if (err)
                            throw err;

                        res.json({'Msg': 'Success'});
                    });
                    //Disposition history End
                }
            });
                }
            });
            //Lead End


        } catch (e) {
            console.error(e);
            res.json({'Msg': 'Fail', 'Error': e});

        }
    });

    app.get('/disposition_status_get/:CRN', function (req, res, next) {
        try {
            var CRN = parseInt(req.params['CRN']);
            var arr_User_Data = [];
//            var disposition_history = require('../models/disposition_history');
            disposition.find({"PB_CRN": CRN}).sort({"Modified_On": -1}).exec(function (err, dbRequest) {
                console.log(dbRequest);
                var objResonse = {};

                for (var i in dbRequest) {
                    var dbRequest_data = dbRequest[i]["_doc"];
                    var objResonse = {
                        "Status": dbRequest_data["Status"],
                        "SubStatus": dbRequest_data["Sub_Status"],
                        "Remark": dbRequest_data["Remark"],
                        "Lead_Call_Back_Time": dbRequest_data["Lead_Call_Back_Time"],
                        "Modified_On": dbRequest_data["Modified_On"]
                    };
                    arr_User_Data.push(objResonse);
                }
                res.json(arr_User_Data);
            });

        } catch (err) {
            console.log(err);
            res.json({'msg': 'error'});
        }
    });

    app.get('/disposition_master_list/:Status_Id', function (req, res, next) {
        var disposition_master = require('../models/disposition_master');
        var Status_Id = parseInt(req.params['Status_Id']);
        try {

            disposition_master.find({"Status_Id": Status_Id}).exec(function (err, dbRequest) {
                console.log(dbRequest);
                res.json(dbRequest);
            });

        } catch (err) {
            console.log(err);
            res.json({'msg': 'error'});
        }
    });

    app.get('/disposition_master_Statuslist', function (req, res, next) {
        var disposition_master = require('../models/disposition_master');

        try {
            var objStatus = [];
            var objSubStatus = [];
            // var agg = [{"$group": {_id: "$Status_Id", "Status": {"$last": "$Status"}}}, {"$sort": {"Status_Id": 1}}];
            if (req.query.type) {
                var agg = [{$match: {'IsActive': true, 'Type': req.query.type}},
                    {$group: {_id: "$Status_Id", "Status": {"$first": "$Status"}, Substatuslist: {$push: {Sub_Status: "$Sub_Status", Sub_Status_Id: "$Sub_Status_Id"}}}},
                    {$sort: {'Status_Id': 1}}
                ];
            } else {
                var agg = [{$match: {'IsActive': true}},
                    {$group: {_id: "$Status_Id", "Status": {"$first": "$Status"}, Substatuslist: {$push: {Sub_Status: "$Sub_Status", Sub_Status_Id: "$Sub_Status_Id"}}}},
                    {$sort: {'Status_Id': 1}}
                ];
            }

            var objResponse = {};
            disposition_master.aggregate(agg, function (err, dbData) {
                if (err)
                    throw(err);
                for (var i in dbData) {
                    // obj.push(dbCategory[i]['Category_Id'] + ':' + dbCategory[i]['Category']);
                    objStatus.push({
                        Status_Id: dbData[i]['_id'],
                        Status: dbData[i]['Status'],
                        //Type : dbData[i]['Type']
                    });
                    for (var j in dbData[i]['Substatuslist']) {
                        objSubStatus.push({
                            Status_Id: dbData[i]['_id'],
                            Sub_Status_Id: dbData[i]['Substatuslist'][j]['Sub_Status_Id'],
                            Sub_Status: dbData[i]['Substatuslist'][j]['Sub_Status'],
                            // Lead_Status : dbData[i]['Substatuslist'][j]['Lead_Status']

                        });
                    }
                }
                objResponse = {"Status": objStatus, "SubStatus": objSubStatus}
                res.json(objResponse);
            });

        } catch (err) {
            console.log(err);
            res.json({'msg': 'error'});
        }
    });

    app.get('/disposition_master_Statuslist_SyncContact', function (req, res, next) {
        var disposition_master = require('../models/disposition_master');

        try {
            var objStatus = [];
            var objSubStatus = [];
            var agg = [{$match: {'IsActive': true, Campaign:'Sync-Contact'}},
                {$group: {_id: "$Status_Id", "Status": {"$first": "$Status"}, Substatuslist: {$push: {Sub_Status: "$Sub_Status", Sub_Status_Id: "$Sub_Status_Id"}}}},
                {$sort: {'_id': 1}}
            ];
            var objResponse = {};
            disposition_master.aggregate(agg, function (err, dbData) {
                if (err)
                    throw(err);
                for (var i in dbData) {
                    objStatus.push({
                        Status_Id: dbData[i]['_id'],
                        Status: dbData[i]['Status'],
                    });
                    for (var j in dbData[i]['Substatuslist']) {
                        objSubStatus.push({
                            Status_Id: dbData[i]['_id'],
                            Sub_Status_Id: dbData[i]['Substatuslist'][j]['Sub_Status_Id'],
                            Sub_Status: dbData[i]['Substatuslist'][j]['Sub_Status'],
                        });
                    }
                }
                objResponse = {"Status": objStatus, "SubStatus": objSubStatus}
                res.json(objResponse);
            });

        } catch (err) {
            console.log(err);
            res.json({'msg': 'error'});
        }
    });

    app.get('/get_allocation_list_admin/:campaign_name', function (req, res, next) {
        try {
            let campaign_name = req.params['campaign_name'];
            let action = "";
            let udid = "";
            if (campaign_name.includes("_")) {
                action = (campaign_name.split("_")[1]).split("-")[0];
                udid = campaign_name.split("-")[1];
                campaign_name = campaign_name.split("_")[0];
            }
            let file_name = appRoot + "/resource/request_file/campaign_list.json";
            let campaignJSON = fs.readFileSync(file_name, 'utf8');
            let objArr = JSON.parse(campaignJSON);
            if (action === "") {
                let objcampaign = {};
                let objcampaign_temp = [];
                for (var i in objArr) {
                    if (campaign_name === i) {
                        objcampaign = objArr[i]["uid"];
                        for (var k in objcampaign) {
                            var agent = {
                                "uid": objcampaign[k].split('-')[0],
                                "name": objcampaign[k].split('-')[1],
                                "ss_id": objcampaign[k].split('-')[2]
                            };
                            objcampaign_temp.push(agent);
                        }
                    }
                }
                res.json(objcampaign_temp);
            } else if (action === "remove") {
                let objcampaign = {};
                let objcampaign_temp = [];
                objcampaign = objArr;
                for (var i in objArr) {
                    if (campaign_name === i) {
                        for (var x in objArr[i]["uid"]) {
                            if (objArr[i]["uid"][x].includes(udid)) {
                                objArr[i]["uid"].splice(x, 1);
                            }
                        }
                        let new_json = JSON.stringify(objArr);
                        fs.writeFile(file_name, new_json);
                        res.json({msg: 'sucess'});
                    }
                }
            } else if (action === "add") {
                let objArr = JSON.parse(campaignJSON);
                let count = 0;
                for (var i in objArr) {
                    if (campaign_name === i) {
                        for (var x in objArr[i]['uid']) {
                            if (objArr[i]['uid'][x].includes(udid)) {
                                count++;
                                return res.json({msg: "sucess"});
                            }
                        }
                        if (count === 0) {
                            var Employee = require('../models/employee');
                            let obj_emp = {};
                            if (udid > 0) {
                                Employee.findOne({"Emp_Code": parseInt(udid)}, function (err, dbEmployee) {
                                    if (err) {
                                        res.json({msg: 'fail', error: err});
                                    } else {
                                        if (dbEmployee) {
                                            dbEmployee = dbEmployee._doc;
                                            obj_emp = {
                                                'uid': dbEmployee['Emp_Code'],
                                                'ss_id': dbEmployee['Emp_Id'],
                                                'emp_name': dbEmployee['Emp_Name']
                                            };
                                            let count = objArr[i]['uid'].length - 1;
                                            objArr[i]['uid'][count + 1] = obj_emp.uid + "-" + obj_emp.emp_name + "-" + obj_emp.ss_id;

                                            let new_json = JSON.stringify(objArr);
                                            fs.writeFile(file_name, new_json);
                                            res.json({msg: "sucess"});
                                        } else {
                                            res.json({msg: 'fail', error: "not valid udid"});
                                        }
                                    }
                                });
                            }
                        }
                    }
                }
            }
        } catch (e) {
            res.send({msg: 'fail', error: e.stack});
        }
    });
};
