/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
var Base = require('../libs/Base');

mongoose.connect(config.db.connection + ':27017/' + config.db.name, { useMongoClient: true }); // connect to our database

var ServiceLog = require('../models/service_log');
module.exports.controller = function (app) {
    /**
     * a home page route
     */
    app.get('/service_logs/:Service_Log_Id', function (req, res) {
        ServiceLog.findOne({ Service_Log_Id: parseInt(req.params.Service_Log_Id) }, function (err, service_log) {
            if (err)
                res.send(err);

            res.json(service_log['_doc']);
        });
    });
    app.get('/service_logs/by_udid/:User_Data_Id', function (req, res) {
        let User_Data_Id = req.params.User_Data_Id - 0;
        let Service_Response = [];
        if (User_Data_Id > 0) {
            ServiceLog.find({ User_Data_Id: User_Data_Id }).select('Service_Log_Id Method_Type Insurer_Id Product_Id Premium_Breakup Error_Code Error Request_Id Request_Unique_Id Service_Log_Unique_Id PB_CRN LM_Custom_Request Call_Execution_Time Plan_Name').exec(function (err, dbService_Logs) {
                if (err)
                    res.send(err);
                else {
                    for (let k in dbService_Logs) {
                        Service_Response.push(dbService_Logs[k]._doc);
                    }
                }
                res.json(dbService_Logs);
            });
        } else {
            res.json(Service_Response);
        }
    });
    app.get('/service_logs/:Service_Log_Id/:DB_Field_Name', function (req, res) {
        var DB_Field_Name = req.params.DB_Field_Name;
        ServiceLog.findOne({ Service_Log_Id: parseInt(req.params.Service_Log_Id) }, function (err, service_log) {
            if (err)
                res.send(err);

            var content_type = '';
            if (typeof service_log['_doc'][DB_Field_Name] === 'string') {
                if (service_log['_doc'][DB_Field_Name].toString().indexOf('<') > -1) {
                    res.header('Content-Type', 'text/xml');
                    res.send(service_log['_doc'][DB_Field_Name]);
                } else if (service_log['_doc'][DB_Field_Name].toString().indexOf('{') === 0) {
                    //res.header('Content-Type', 'application/json');
                    try {
                        var objJson = JSON.parse(service_log['_doc'][DB_Field_Name]);
                        var objField = JSON.stringify(objJson, undefined, 2);
                        res.send('<pre>' + objField + '</pre>');
                    } catch (e) {
                        res.send("<h1>JSON INVALID</h1><pre>" + service_log['_doc'][DB_Field_Name] + '</pre>');
                    }
                } else {
                    res.send("<pre>" + service_log['_doc'][DB_Field_Name] + '</pre>');
                }
            } else {
                //res.header('Content-Type', 'application/json');
                var objField = JSON.stringify(service_log['_doc'][DB_Field_Name], undefined, 2);
                res.send('<pre>' + objField + '</pre>');
            }

        });
    });
    app.get('/user_datas/:PB_CRN', function (req, res) {
        var User_Data = require('../models/user_data');
        User_Data.findOne({ PB_CRN: parseInt(req.params.PB_CRN) }, function (err, dbUserData) {
            if (err) {

            } else {
                if (dbUserData) {
                    var QuotePageURL = config.environment.portalurl + '/CarInsuranceIndia/QuotePageNew?SID=' + dbUserData['_doc']['Request_Unique_Id'] + '&ClientID=3';
                    dbUserData['_doc']['Premium_Request']['QUOTE_URL'] = QuotePageURL;
                    var objField = JSON.stringify(dbUserData['_doc']['Premium_Request'], undefined, 2);
                    res.send('<pre>' + objField + '</pre>');
                }
            }
        });
    });
    app.post('/service_logs', function (req, res) {
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);

        var optionPaginate = {
            select: '',
            sort: { 'Service_Log_Id': 'desc' },
            //populate: null,
            lean: true,
            page: 1,
            limit: 10
        };

        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);

        }
        var filter = obj_pagination.filter;
        console.error('Filter', req.body);
        if (req.body['search[value]'] !== '') {
            if (isNaN(req.body['search[value]'])) {
                filter = {
                    $or: [
                        { 'Request_Unique_Id': new RegExp(req.body['search[value]'], 'i') },
                        { 'Service_Log_Unique_Id': new RegExp(req.body['search[value]'], 'i') },
                        { 'Method_Type': new RegExp(req.body['search[value]'], 'i') },
                        { 'Error_Code': new RegExp(req.body['search[value]'], 'i') }
                    ]
                };
            } else {
                filter = { 'Product_Id': parseInt(req.body['Product_Id']) };
            }
        } else {
            filter = {};
            if (req.body['Request_Unique_Id'] !== '') {
                filter['Request_Unique_Id'] = (req.body['Request_Unique_Id']);
            } else if (req.body['Service_Log_Unique_Id'] !== '') {
                filter['Service_Log_Unique_Id'] = req.body['Service_Log_Unique_Id'];
            } else if (req.body['Method_Type'] !== '') {
                filter['Method_Type'] = req.body['Method_Type'];
            } else if (req.body['Error_Code'] !== '') {
                filter['Error_Code'] = req.body['Error_Code'];
            }
        }


        ServiceLog.paginate(filter, optionPaginate).then(function (service_logs) {
            console.log(obj_pagination.filter, optionPaginate, service_logs);
            res.json(service_logs);
        });
    });
    app.post('/service_logs/save', function (req, res) {
        var service_log = new ServiceLog();
        var base = new Base();
        for (var key in req.body) {
            service_log[key] = req.body[key];
        }

        // get the current date
        var currentDate = new Date();
        if (!req.body.ServiceLog_Id) {
            service_log.Created_On = currentDate;
            service_log.Is_Active = true;
        }
        service_log.Modified_On = currentDate;
        // any logic goes here
        console.log(service_log);
        service_log.save(function (err) {
            if (err) {
                res.send(err);
            }
            console.log('saved', service_log);
            res.json({ message: 'ServiceLog created with ServiceLog_Id - ' + service_log.Secret_Key + ' :: ' + service_log.ServiceLog_Id + ' !' });
        });
    });
    app.get('/service_logs/view/:id', function (req, res) {

        ServiceLog.find(function (err, service_log) {
            if (err)
                res.send(err);

            res.json(service_log);
        });
    });
    app.delete('/delete/:id', function (req, res) {
        // any logic goes here
        res.render('service_logs/view');
    });
    /**
     * About page route
     */
    app.get('/login', function (req, res) {
        // any logic goes here
        res.render('users/login')
    });

    // added by suraj
    app.post('/service_log/find', function (req, res) {
        try {
            let reqObj = req.body;
            let condition = {};
            if (reqObj.query) {
                for (var key in reqObj.query) {
                    condition[key] = reqObj.query[key];
                };
            }
            if (Object.keys(condition).length === 0) {
                res.json({ "Status": 'FAIL', 'Msg': 'Key Missing' });
            } else if (reqObj.query_options && reqObj.query_options.select) {
                ServiceLog.findOne(condition, reqObj.query_options.select, function (err, datas) {
                    if (err) {
                        res.json({ "Status": 'FAIL', 'Msg': err.stack });
                    } else {
                        res.send(datas);
                    }
                });
            } else if (reqObj.query_options && reqObj.query_options.toArray && reqObj.query_options.toArray === 1) {
                if (reqObj.query_options.sort) {
                    ServiceLog.find(condition).sort(reqObj.query_options.sort).exec(function (err, data) {
                        if (err) {
                            res.json({ "Status": 'FAIL', 'Msg': err.stack });
                        } else {
                            if (data && data.length > 0) {
                                res.send(data);
                            } else {
                                res.json({ "Status": 'FAIL', 'Msg': 'No data found' });
                            }
                        }
                    });
                } else {
                    ServiceLog.find(condition).toArray(function (err, datas) {
                        if (err) {
                            res.json({ "Status": 'FAIL', 'Msg': err.stack });
                        } else {
                            res.send(datas);
                        }
                    });
                }
            } else {
                ServiceLog.findOne(condition, function (err, datas) {
                    if (err) {
                        res.json({ "Status": 'FAIL', 'Msg': err.stack });
                    } else {
                        res.send(datas);
                    }
                });
            }
        } catch (e) {
            res.send({ "Status": 'FAIL', 'Msg': e.stack });
        }
    });

    // added by suraj
    app.post('/service_log/save', function (req, res) {
        var MongoClient = require('mongodb').MongoClient;
        let { collectionName, documentData } = req.body;
        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
            var collection = db.collection(collectionName);
            if (err) {
                res.json({
                    status: "FAIL"
                });
            } else {
                collection.insertOne(documentData, function (err, docsInserted) {
                    if (err) {
                        console.log("Not able to insert data in : ", collectionName, err.stack);
                        res.json({
                            status: "FAIL"
                        });
                    } else {
                        console.log("Data inserted or save into ", collectionName);
                        res.json({
                            status: "SUCCESS"
                        });
                    }
                });
            }
        });
    });

    // added by suraj
    app.post('/service_log/update', function (req, res) {
        var MongoClient = require('mongodb').MongoClient;
        let { collectionName, documentData, condition } = req.body;
        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
            var collection = db.collection(collectionName);
            if (err) {
                res.json({
                    status: "FAIL",
                    collectionName
                });
            } else {
                if (!condition) {
                    res.json({
                        status: "FAIL",
                        msg: "condition not found."
                    });
                } else {
                    collection.findAndModify(condition, [], documentData, {}, function (err, docs) {
                        if (err) {
                            res.json({
                                status: "FAIL",
                                collectionName
                            });
                        } else {
                            res.json({
                                status: "SUCCESS"
                            });
                        }
                    });
                }
            }
        });
    });
};