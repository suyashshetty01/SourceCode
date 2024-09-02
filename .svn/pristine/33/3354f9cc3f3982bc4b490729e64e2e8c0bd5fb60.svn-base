/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var config = require('config');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var credential = require('../models/credential');
var Base = require('../libs/Base');

var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database


module.exports.controller = function (app) {
    app.get('/credentials/get_ssid/:ss_id/:user_password', function (req, res) {
        try {
            if (req.params.ss_id && req.params.ss_id !== "" && req.params.user_password && req.params.user_password !== "") {
                credential.find({ss_id: parseInt(req.params.ss_id), password: req.params.user_password}, function (err, dbcredentialData) {
                    if (err) {
                    } else {
                        if (dbcredentialData.length > 0) {
                            console.log(dbcredentialData[0]["_doc"]["ss_id"]);
                            let txt = {
                                ss_id: dbcredentialData[0]["_doc"]["ss_id"]
                            };
                            res.send(txt);
                        } else {
                            res.send('Record not found');
                        }
                    }
                });
            } else {
                res.send('Invalid user_id or user_password');
            }
        } catch (e) {
            console.log(e);
            res.json({"Msg": e, "Status": "Fail"});
        }
    });

    app.get('/credentials/password_change_initiate/:ss_id/:user_password/:user_new_password', function (req, res) {
        try {
            if (req.params.ss_id && req.params.ss_id !== "" && req.params.user_password && req.params.user_password !== "" && req.params.user_new_password && req.params.user_new_password !== "") {
                var condition = {
                    "password": req.params.user_password,
                    "ss_id": parseInt(req.params.ss_id)
                };
                let update_condition = {
                    "password": req.params.user_new_password,
                    "last_updated_on": new Date()
                };
                console.log(condition, {$set: update_condition});
                credential.updateOne(condition, {$set: update_condition}, function (err, numaffected) {
                    if (err) {
                    } else {
                        if (numaffected.nModified > 0) {
                            res.json({"Msg": "Credentials Updated Successfully.", "Status": "Success"});
                        } else {
                            res.json({"Msg": "Credentials Update Failed.", "Status": "Fail"});
                        }
                    }
                });
            }
        } catch (e) {
            console.log(e);
            res.json({"Msg": e, "Status": "Fail"});
        }
    });

    app.get('/credentials/get_password/:ss_id', function (req, res) {
        try {
            if (req.params.ss_id && req.params.ss_id !== "") {
                credential.find({ss_id: parseInt(req.params.ss_id)}, function (err, dbcredentialData) {
                    if (err) {
                    } else {
                        if (dbcredentialData.length > 0) {
                            console.log(dbcredentialData[0]["_doc"]["password"]);
                            let txt = {
                                ss_id: dbcredentialData[0]["_doc"]["password"]
                            };
                            res.send(txt);
                        } else {
                            res.send('Record not found');
                        }
                    }
                });
            } else {
                res.send('Invalid ss_id');
            }
        } catch (e) {
            console.log(e);
            res.json({"Msg": e, "Status": "Fail"});
        }
    });

};
