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
var disposition_history = require('../models/disposition_history');

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

                var User_Details =
                        {
                            ss_id: fields["user_ss_id"],
                            fba_id: fields["user_fba_id"]
                        };
                try {
                    // var dispositionCont = require('../controllers/dispositions');
                    disposition_history.find({
                        "PB_CRN": fields["crn"]
                    }).sort({"Modified_On": -1}).limit(1).exec(function (err, dbRequest) {
                        if (err) {
                            res.json({Msg: 'Disposition Not Saved', Details: err});
                        } else {
                            disposition_history.update({'PB_CRN': dbRequest[0]._doc["PB_CRN"], 'Modified_On': dbRequest[0]._doc['Modified_On']}, {$set: {"IsLatest": 0}}, function (err, numAffected) {
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
                    UDID: fields["dsp_udid"],
                    PB_CRN: fields["dsp_crn"],
                    Status: fields["dsp_status"],
                    SubStatus: fields["dsp_substatus"],
                    Created_On: todayDate,
                    Modified_On: todayDate,
                    Remark: fields["dsp_remarks"],
                    ss_id: fields["dsp_ss_id"],
                    IsLatest: 1,
                    fba_id: fields["dsp_fba_id"],
                    User_Data: User_Details,
                    File_Name: files['disposition_file'].name
                };
                var dispositionObj = new disposition_history(arg);
                dispositionObj.save(function (err) {
                    if (err)
                        throw err;
                    if (files.hasOwnProperty('disposition_file')) {

                        var pdf_file_name = files['disposition_file'].name;
                        var pdf_sys_loc_horizon = path + pdf_file_name;
                        var oldpath = files.disposition_file.path;

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
                                var objUserData = {
                                    'Disposition_Status': fields["dsp_status"],
                                    'Disposition_SubStatus': fields["dsp_substatus"],
                                    'Disposition_Modified_On': todayDate
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
                            });
                            // Delete the file
                            fs.unlink(oldpath, function (err) {
                                if (err)
                                    throw err;
                                console.log('File deleted!');
                            });
                        });

                    }

                    res.json({'msg': 'success'});
                });
            });

        } catch (err) {
            console.log(err);
            res.json({'msg': 'error'});
        }
    });

    app.get('/disposition_status_get/:CRN', function (req, res, next) {
        try {
            var CRN = parseInt(req.params['CRN']);
            var arr_User_Data = [];
//            var disposition_history = require('../models/disposition_history');
            disposition_history.find({"PB_CRN": CRN}).sort({"Modified_On": -1}).exec(function (err, dbRequest) {
                console.log(dbRequest);
                var objResonse = {};

                for (var i in dbRequest) {
                    var dbRequest_data = dbRequest[i]["_doc"];
                    var objResonse = {
                        "Status": dbRequest_data["Status"],
                        "SubStatus": dbRequest_data["SubStatus"],
                        "Occured_On": dbRequest_data["Modified_On"]
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

};




   