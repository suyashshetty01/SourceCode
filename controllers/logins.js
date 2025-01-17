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
var mongojs = require('mongojs');
const formidable = require('express-formidable');
var formidable1 = require('formidable');
var path = require('path');
var fs = require('fs');
var appRoot = path.dirname(path.dirname(require.main.filename));
var myDb = mongojs(config.db.connection + ':27017/' + config.db.name);
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true});
var login = require('../models/logins');
module.exports.controller = function (app) {
    app.post('/logins/login', function (req, res, next) {
        req.body = JSON.parse(JSON.stringify(req.body));
        var objRequest = req.body;
        var Session_Id = objRequest["Session_Id"];
        try {
            var login = require('../models/logins');
            var login_time = new Date();
            var arg = {};
            arg = {
                session_id: objRequest["session_id"],
                ip_address: objRequest["ip_address"],
                user_agent: objRequest["user_agent"],
                header: objRequest["header"],
                referral: objRequest["referral"],
                ss_id: objRequest["ss_id"],
                fba_id: objRequest["fba_id"],
                login_response: objRequest["login_response"],
                login_time: login_time,
                logout_time: null
            };
            var login_data = new login(arg);
            login_data.save(arg, function (err, res1) {
                if (err)
                    throw err;
                res.json({'Status': "Success", 'Msg': "Session Data inserted successfully."});
            });
        } catch (err) {
            console.log(err);
            res.json({'msg': 'error'});
        }
    });
    app.post('/logins/logout', function (req, res) {
        try {
            var objRequest = req.body;
            var Session_Id = objRequest["session_id"];
            var login = require('../models/logins');
            var logout_time = new Date();
            var objUserData = {
                'logout_time': logout_time
            };
            login.update({'session_id': Session_Id}, {$set: objUserData}, function (err, numAffected) {
                if (err)
                    throw err;
                res.json({'Status': "Success", 'Msg': "Session Data Updated successfully."});
            });

        } catch (err) {
            console.log(err);
            res.json({'msg': 'error'});
        }
    });

    app.post('/logins/uploadFile', function (req, res) {
        try {
            var objRequest = req.body;
            var file = "";
            var file_ext = "";
            var path = appRoot + "/tmp/ticketing/";
            file = decodeURIComponent(objRequest["file"]);
            file_ext = objRequest["file_ext"];

            if (fs.existsSync(path + "NewTicket_Id")) {
                //console.log(NewTicket_Id + ' - Folder Already Exist');
                //for (var i in file_obj) {
                var data = file.replace(/^data:image\/\w+;base64,/, "");
                if (data === "") {
                    //res1.json({'msg': 'Something Went Wrong'});
                } else {
                    var buf = new Buffer(data, 'base64');
                    fs.writeFile(path + "NewTicket_Id" + '/file.' + file_ext, buf);
                }
                //}
            } else {
                fs.mkdirSync(path + "NewTicket_Id");
                //console.log(NewTicket_Id + ' - Folder Created');
                //for (var i in file_obj) {
                var data = file.replace(/^data:image\/\w+;base64,/, "");
                if (data === "") {
                    //res1.json({'msg': 'Something Went Wrong'});
                } else {
                    var buf = new Buffer(data, 'base64');
                    fs.writeFile(path + "NewTicket_Id" + '/file.' + file_ext, buf);
                }
                //}
            }


        } catch (ex)
        {
            console.log(ex);
        }
        res.status(200);
    });
    app.get('/logins/get_emp_details', function (req, res) {
        var emp_datas = require('../models/emp_data');
        emp_datas.find({}, function (err, emp_data) {
            try {
                if (err)
                    throw err;
                res.json(emp_data);
            } catch (e) {
                res.json(e);
            }
        });
    });

};