/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
var Base = require('../libs/Base');
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database

var Error = require('../models/error');
module.exports.controller = function (app) {
    /**
     * a home page route
     */
    app.get('/errors', function (req, res) {
        Error.find(function (err, errors) {
            if (err)
                res.send(err);
            res.json(errors);
        });
    });
    app.post('/errors', function (req, res) {
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);
        var optionPaginate = {
            select: '',
            sort: {'Error_Id': 'asc'},
            //populate: null,
            lean: true,
            page: 1,
            limit: 10
        };
        if (obj_pagination) {
            optionPaginate['page'] = obj_pagination.paginate.page;
            optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
        }




        Error.paginate(obj_pagination.filter, optionPaginate).then(function (errors) {
            console.log(obj_pagination.filter, optionPaginate, errors);
            res.json(errors);
        });
    });
    app.post('/errors/save', function (req, res) {
        var error = new Error();
        for (var key in req.body) {
            error[key] = req.body[key];
        }

        // get the current date
        var currentDate = new Date();
        if (!req.body.Error_Id) {
            error.Created_On = currentDate;
            error.Is_Active = true;
        }
        error.Modified_On = currentDate;
        // any logic goes here
        console.log(error);
        error.save(function (err) {
            if (err) {
                res.send(err);
            }
            console.log('saved', error);
            res.json({message: 'Error created with Error_Id - ' + error.Secret_Key + ' :: ' + error.Error_Id + ' !'});
        });
    });
    app.post('/errors/reprocess', function (req, res) {
        try {
            req.body = JSON.parse(JSON.stringify(req.body));
            var obj_req = req.body;
            let Error_Code = obj_req['Error_Code'];
            let arr_User_Data_Id = obj_req['Ud_List'].split('|');
            if (Error_Code !== '' && arr_User_Data_Id.length > 0) {
                Error.findOne({'Error_Code': Error_Code}).exec(function (err, dbError) {
                    if (dbError) {
                        dbError = dbError._doc;
                        let Error_Identifier_List = dbError['Error_Identifier'];
                        var ServiceLog = require('../models/service_log');
                        ServiceLog.find({User_Data_Id: {$in: arr_User_Data_Id}}).select('Service_Log_Id Method_Type Insurer_Id Product_Id Premium_Breakup Error_Code Error Request_Id Request_Unique_Id Service_Log_Unique_Id PB_CRN LM_Custom_Request Call_Execution_Time Plan_Name').exec(function (err, dbService_Logs) {
                            if (err)
                                res.send(err);
                            else {
                                let arr_Service_Log_Update = [];
                                for (let k in dbService_Logs) {
                                    let sl = dbService_Logs[k]._doc;
                                    let Error_Specific = sl['Error']['Error_Specific'];
                                    for (let j in Error_Identifier_List) {
                                        if (Error_Specific.indexOf(Error_Identifier_List[j]) > -1) {
                                            arr_Service_Log_Update.push(sl['Service_Log_Id']);
                                            break;
                                        }
                                    }
                                }
                                if (arr_Service_Log_Update.length > 0) {
                                    ServiceLog.update({Service_Log_Id: {$in: arr_Service_Log_Update}}, {$set: {'Error_Code': Error_Code}}, {multi: true}, function (err, numAffected) {
                                        let Summary = {
                                            'Status': '',
                                            'Total': dbService_Logs.length,
                                            'Processed': arr_Service_Log_Update.length,
                                            'List': arr_Service_Log_Update,
                                            'Error_Code': Error_Code
                                        };
                                        if (err) {
                                            Summary['Status'] = err;
                                        } else {
                                            Summary['Status'] = 'Updated_Successfully';
                                        }
                                        res.json(Summary);
                                    });
                                } else {
                                    let Summary = {
                                        'Status': 'No_Match_Found',
                                        'Total': dbService_Logs.length,
                                        'Processed': arr_Service_Log_Update.length,
                                        'List': arr_Service_Log_Update,
                                        'Error_Code': Error_Code
                                    };
                                    res.json(Summary);
                                }
                            }
                        });
                    }
                });
            } else {
                let Summary = {
                    'Status': 'Input_Not_Ok'
                };
                res.json(Summary);
            }
        } catch (e) {
            res.send(e.stack);
        }
    });
    app.post('/errors/add_edit', function (req, res) {
        try {
            var fs = require('fs');
            var moment = require('moment');
            var path = require('path');
            var appRoot = path.dirname(path.dirname(require.main.filename));

            req.body = JSON.parse(JSON.stringify(req.body));
            var currentDate = new Date();
            var obj_error = req.body;
            if (obj_error.hasOwnProperty('Error_Identifier')) {
                obj_error['Error_Identifier'] = obj_error['Error_Identifier'].split('|||');
            }
            obj_error.Modified_On = currentDate;
            var cache_key = 'error_master_' + moment().format('YYYYMMDD');
            var cache_loc = appRoot + "/tmp/cachemaster/" + cache_key + ".log";
            if (fs.existsSync(cache_loc)) {
                fs.unlinkSync(cache_loc);
            }

            if (req.query['op'] === 'add') {

                obj_error.Created_On = currentDate;
                console.error('Error_Save', obj_error);
                var MongoClient = require('mongodb').MongoClient;
                MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                    var colError = db.collection('errors');
                    colError.insertOne(obj_error, function (err, resp) {
                        if (err) {
                            res.send(err);
                        }
                        let obj_email = {
                            'from': 'noreply@policyboss.com',
                            'to': 'vijay.chetgiri@policyboss.com,ashish.hatia@policyboss.com',
                            'cc': 'horizonlive.2019@gmail.com',
                            'sub': '[ERR_CODE_' + req.query['op'].toUpperCase() + '] Code : ' + obj_error.Error_Code + ', Name : ' + obj_error.Error_Name,
                            'content': '<html><body><h1>Error_Code</h1><pre>' + JSON.stringify(obj_error, undefined, 2) + '</pre></body></html>'
                        };
                        send_email(obj_email);
                        res.json({message: 'Error created with ' + obj_error.Error_Code + ' !', 'data': obj_error});
                    });
                });
                /*
                 var objModelError = new Error(obj_error);
                 
                 objModelError.save(function (err, objDbError) {
                 if (err) {
                 res.send(err);
                 }
                 console.log('saved', objDbError);
                 res.json({message: 'Error created with ' + obj_error.Error_Code + ' !'});
                 });
                 */
            } else if (req.query['op'] === 'edit') {
                Error.update({'Error_Code': obj_error['Error_Code']}, {$set: obj_error}, {multi: false}, function (err, numAffected) {
                    if (err) {
                        res.send(err);
                    }
                    console.log('saved', numAffected);
                    let obj_email = {
                        'from': 'noreply@policyboss.com',
                        'to': 'vijay.chetgiri@policyboss.com,ashish.hatia@policyboss.com',
                        'cc': 'horizonlive.2019@gmail.com',
                        'sub': '[ERR_CODE_' + req.query['op'].toUpperCase() + '] Code : ' + obj_error.Error_Code + ', Name : ' + obj_error.Error_Name,
                        'content': '<html><body><h1>Error_Code</h1><pre>' + JSON.stringify(obj_error, undefined, 2) + '</pre></body></html>'
                    };
                    send_email(obj_email);
                    res.json({message: 'Error created with ' + obj_error.Error_Code + ' !'});
                });
            } else {
                res.send('No Op send');
            }
        } catch (e) {
            res.send(e.stack);
        }
    });
    app.get('/errors/view/:id', function (req, res) {

        Error.find(function (err, error) {
            if (err)
                res.send(err);
            res.json(error);
        });
    });
    app.delete('/delete/:id', function (req, res) {
        // any logic goes here
        res.render('errors/view');
    });
    /**
     * About page route
     */
    app.get('/login', function (req, res) {
// any logic goes here
        res.render('users/login')
    });
    app.get('/errors/fetch_kyc_errors', function (req, res) {
        Error.find({"Error_Category": "KYC"}, function (err, errors) {
            if (err)
                res.send(err);
            res.json(errors);
        });
    });
}
function send_email(obj_email) {
    try {
        var Email = require('../models/email');
        var objModelEmail = new Email();
        objModelEmail.send(obj_email.from, obj_email.to, obj_email.sub, obj_email.content, '', config.environment.notification_email);
    } catch (e) {

    }
}
