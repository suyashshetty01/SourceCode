/* Author : Kevin Monteiro
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var config = require('config');
var mongoose = require('mongoose');

mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database

module.exports.controller = function (app) {
    app.post('/app_visitor/save_data', function (req, res) {
        let AppVisitors = require('../models/app_visitor');
        req.body.Created_On = new Date();
        req.body.Modified_On = new Date();
        let AppVisitors_data = new AppVisitors(req.body);
        AppVisitors_data.save(function (err, objDB) {
            if (err) {
                res.json({'Msg': err, 'Status': "Error"});
            } else {
                res.json({'Msg': "Data Inserted Successfully", 'Status': "Success", "visitor_Id":objDB._doc.visitor_Id});
            }
        });
    });
    app.get('/app_visitor/get_app_visitor/:crn', function (req, res) {
        try {
            let crn = req.params['crn'] - 0;
            let app_visitor = require('../models/app_visitor');
            app_visitor.find({visitor_Id: crn}, function (err, dbData) {
                if (err) {
                    res.json({'Msg': err, 'Status': "Error"});
                } else {
                    res.json(dbData);
                }
            });
        } catch (e) {
            res.send(e.stack);
        }
    });
    app.get('/app_visitor/get_app_visitor_historie/:crn', function (req, res) {
        try {
            let crn = req.params['crn'] - 0;
            let app_visitor_history = require('../models/app_visitor_history');
            app_visitor_history.find({visitor_Id: crn}, function (err, dbData) {
                if (err) {
                    res.json({'Msg': err, 'Status': "Error"});
                } else {
                    res.json(dbData);
                }
            });
        } catch (e) {
            res.send(e.stack);
        }
    });
    app.post('/app_visitor/save_device_details', function (req, res) {
        try {
            let reqObj = req.body ? req.body : '';
            let ssId = reqObj.ss_id ? reqObj.ss_id : '';
            let deviceId = reqObj.device_id ? reqObj.device_id : '';
            let deviceName = reqObj.device_name ? reqObj.device_name : '';
            let os_detail = reqObj.os_detail ? reqObj.os_detail : '';
            let actionType = reqObj.action_type  ? reqObj.action_type  : '';
            let Device_Info = reqObj.device_info  ? reqObj.device_info :'';
            let deviceDetailStatus = {};
            let deviceHistoryStatus = {};
            let deviceDetails = require('../models/device_detail');
            let deviceHistory = require('../models/device_history');
            let deviceData = {
                "SS_ID": ssId,
                "Device_ID": deviceId,
                "Device_Name": deviceName,
                "OS_Detail": os_detail,
                "Created_On": new Date(),
                "Modified_On": new Date(),
                "Request_Core": reqObj,
                "Action_Type": actionType,
                "Device_Info" : Device_Info
            };
            let args = {
                SS_ID: ssId,
                Device_ID: deviceId
            };
            
            let saveDeviceHistory = new deviceHistory(deviceData);
            saveDeviceHistory.save(deviceData, function (err, data) {
                try {
                    if (err) {
                        deviceHistoryStatus = {'Status': 'FAIL', 'Msg': 'Error in saving details in Device History' + err};
                    } else {
                        if (data && data._doc) {
                            deviceHistoryStatus = {'Status': 'SUCCESS', 'Msg': 'Data Save successfully in Device History', 'Data': data._doc};
                        } else {
                            deviceHistoryStatus = {'Status': 'FAIL', 'Msg': 'Data Not Saved in Device History'};
                        }
                    }
                    if (actionType === 'Active') {
                        deviceDetails.find(args, function (err, data) {
                            try {
                                if (data && data.length > 0) {
                                    let updateObj = {
                                        "Modified_On": new Date()
                                    };
                                    deviceDetails.update(args, {$set: updateObj}, function (err, getDeviceDetails) {
                                        if (err) {
                                            deviceDetailStatus = {'Status': 'FAIL', 'Msg': "No Record Updateded in Device Details"};
                                        } else {
                                            deviceDetailStatus = {'Status': 'SUCCESS', 'Msg': 'Record Already Exists in Device Detail'};
                                        }
                                        res.json({'Device Detail Status': deviceDetailStatus, 'Device History Status': deviceHistoryStatus});
                                    });
                                } else {
                                    let saveDeviceDetails = new deviceDetails(deviceData);
                                    saveDeviceDetails.save(function (err, objDeviceData) {
                                        if (objDeviceData && objDeviceData._doc) {
                                            if (err) {
                                                deviceDetailStatus = {'Status': 'FAIL', 'Msg': 'Error in saving details in Device Details' + err};
                                            } else {
                                                deviceDetailStatus = {'Status': 'SUCCESS', 'Msg': 'Data Save successfully in Device Details', 'Data': objDeviceData._doc};
                                            }
                                        } else {
                                            deviceDetailStatus = {'Status': 'FAIL', 'Msg': "Data Not Saved in Device Details"};
                                        }
                                        res.json({'Device Detail Status': deviceDetailStatus, 'Device History Status': deviceHistoryStatus});
                                    });
                                }
                            } catch (e) {
                                res.json({'Status': 'FAIL', 'Msg': e.stack});
                            }
                        });
                    }
                    else{
                        res.json({'Device Detail Status': 'Action Type is not Active', 'Device History Status': deviceHistoryStatus});
                    }
//                    
                } catch (e) {
                    res.json({'Status': 'FAIL', 'Msg': e.stack});
                }
            });
        } catch (e) {
            res.json({'Status': 'Fail', 'Msg': e.stack});
        }
    });
};