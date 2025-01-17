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
    /**
     * a home page route
     */
    app.get('/posps/:Posp_Id', function (req, res) {
        Posp.findOne({Posp_Id: parseInt(req.params.Posp_Id)}, function (err, posp) {
            if (err)
                res.send(err);
            res.json(posp['_doc']);
        });
    });
    app.post('/posps', LoadSession, function (req, res) {
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);
        var optionPaginate = {
            select: '',
            sort: {'Modified_On': 'desc'},
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
                        {'Request_Unique_Id': new RegExp(req.body['search[value]'], 'i')},
                        {'Posp_Unique_Id': new RegExp(req.body['search[value]'], 'i')},
                        {'Method_Type': new RegExp(req.body['search[value]'], 'i')},
                        {'Error_Code': new RegExp(req.body['search[value]'], 'i')}
                    ]
                };
            } else {
                filter = {'Product_Id': parseInt(req.body['Product_Id'])};
            }
        } else {
            filter = {'Is_Active': true};
            if (req.body['page_action'] === 'ch_posp_list') {
                let obj_posp_channel_to_source = swap(config.channel.Const_POSP_Channel);
                var arr_source = [];
                for (var x of req.obj_session.user.role_detail.channel_agent) {
                    arr_source.push(obj_posp_channel_to_source[x]);
                }
                filter['Sources'] = {$in: arr_source};
            }
            if (req.body['page_action'] === 'posp_list') {
                filter['Ss_Id'] = {$in: req.obj_session.users_assigned.Team.POSP};
            }
            if (typeof req.body['Col_Name'] == 'string' && req.body['Col_Name'] !== '' && req.body['txtCol_Val'] !== '') {
                filter[req.body['Col_Name']] = (req.body['Col_Name'] === 'Ss_Id' || req.body['Col_Name'] === 'Reporting_Agent_Uid') ? req.body['txtCol_Val'] - 0 : req.body['txtCol_Val'];
            }
            if (req.body['Last_Status_Group'] !== '') {
                var objStatusSummary = {
                    'Lead/Cordinated/Registered': [1, 2, 3],
                    'DocumentUpload/Verified': [4, 5],
                    'Doc_Declined_Before_Certification': [6],
                    'TrainingSchedule': [7, 10, 15],
                    'TrainingPass': [8, 11, 16],
                    'TrainingFail': [9, 12, 17],
                    'Certified': [13, 14, 18],
                    'Doc_Declined_After_Certification': [6]
                };
                if (objStatusSummary.hasOwnProperty(req.body['Last_Status_Group'])) {
                    var arr_last_status = [];
                    for (var k in objStatusSummary[req.body['Last_Status_Group']]) {
                        arr_last_status.push(objStatusSummary[req.body['Last_Status_Group']][k].toString())
                    }
                    filter['Last_Status'] = {$in: arr_last_status};
                }
            }
        }


        Posp.paginate(filter, optionPaginate).then(function (posps) {
            console.log(obj_pagination.filter, optionPaginate, posps);
            res.json(posps);
        });
    });
    app.post('/posps/rm_mapping_job_list', LoadSession, function (req, res) {
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);
        var Rm_Mapping_Job = require('../models/rm_mapping_job');
        var optionPaginate = {
            select: '',
            sort: {'Modified_On': 'desc'},
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
        Rm_Mapping_Job.paginate(filter, optionPaginate).then(function (dbRm_Mapping_Job) {
            console.log(obj_pagination.filter, optionPaginate, dbRm_Mapping_Job);
            res.json(dbRm_Mapping_Job);
        });
    });
    app.get('/posps/view/:id', function (req, res) {

        Posp.find(function (err, posp) {
            if (err)
                res.send(err);
            res.json(posp);
        });
    });
    app.get('/posps/rm_list/:source', function (req, res) {
        var objBase = new Base();
        var obj_pagination = objBase.jqdt_paginate_process(req.body);
        var optionPaginate = {
            select: '',
            sort: {'Modified_On': 'desc'},
            //populate: null,
            lean: true,
            page: 1,
            limit: 50
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
                        {'Request_Unique_Id': new RegExp(req.body['search[value]'], 'i')},
                        {'Posp_Unique_Id': new RegExp(req.body['search[value]'], 'i')},
                        {'Method_Type': new RegExp(req.body['search[value]'], 'i')},
                        {'Error_Code': new RegExp(req.body['search[value]'], 'i')}
                    ]
                };
            } else {
                filter = {'Product_Id': parseInt(req.body['Product_Id'])};
            }
        } else {
            filter = {};
            if (typeof req.body['Col_Name'] == 'string' && req.body['Col_Name'] !== '' && req.body['txtCol_Val'] !== '') {
                filter[req.body['Col_Name']] = (req.body['Col_Name'] === 'Ss_Id') ? req.body['txtCol_Val'] - 0 : req.body['txtCol_Val'];
            }
        }


        Posp.paginate(filter, optionPaginate).then(function (posps) {
            console.log(obj_pagination.filter, optionPaginate, posps);
            res.json(posps);
        });
    });
    app.get('/posps/rm_get_posp_dsa_ssid/:uid', function (req, res) {
        var uid = req.params.uid;
        uid = uid - 0;
        GetReportingAssignedAgent(uid, res);
    });
    app.post('/posps/update_rm', LoadSession, function (req, res) {
        var sql = require("mssql");
        sql.close();
        // config for your database   
        req.body = JSON.parse(JSON.stringify(req.body));
        var objrequestCore = req.body;
        var obj_data = {
            'ss_id': 1,
            'fba_id': 1,
            "Reporting_Agent_UID": 1,
            "Reporting_Agent_Name": 1,
            "Reporting_Mobile_Number": 1,
            "Reporting_Email_ID": 1
        };
        var qry_str = "";
        for (var k in obj_data) {
            if (obj_data[k] == '') {
                res.send('ERR_PARAMETER_MISSING');
            }
        }

        qry_str = 'update Posp_Details set Reporting_Agent_UID = ' + objrequestCore['Reporting_Agent_UID'].toString() + ' , Reporting_Agent_Name = \'' + objrequestCore['Reporting_Agent_Name'].toString() + '\' , Reporting_Mobile_Number = ' + objrequestCore['Reporting_Mobile_Number'].toString() + ' , Reporting_Email_ID = \'' + objrequestCore['Reporting_Email_ID'].toString() + '\'    where SS_ID = ' + objrequestCore["ss_id"].toString();
        // connect to your database
        sql.connect(config.pospsqldb, function (conn_err) {
            var obj_status = {
                'status': 'PENDING',
                'msg': 'NA',
                'qry': qry_str,
                'old': null,
                'new': objrequestCore
            };
            if (conn_err) {
                console.error(conn_err);
                obj_status['status'] = 'ERR';
                obj_status['msg'] = conn_err;
            } else {
                var find_query = 'select * from Posp_Details where SS_ID = ' + objrequestCore["ss_id"].toString();
                var find_request = new sql.Request();
                find_request.query(find_query, function (err, recordset) {
                    if (err) {
                        console.error(err);
                    } else {
                        var obj_posp = recordset.recordset[0];
                        obj_status['old'] = obj_posp;
                        let Sources = obj_posp['Sources'] - 0;
                        let Source_Name = config.channel.Const_POSP_Channel[Sources.toString()];
                        let obj_email = {
                            'status': 'DBG',
                            'source': Sources,
                            'source_name': Source_Name,
                            'ss_id': objrequestCore["ss_id"],
                            'fba_id': objrequestCore["fba_id"],
                            'name': obj_posp["First_Name"] + ' ' + obj_posp["Last_Name"],
                            'agent_city': obj_posp["AgentCity"],
                            'previous_rm_uid': obj_posp['Reporting_Agent_UID'],
                            'previous_rm_name': obj_posp['Reporting_Agent_Name'],
                            'previous_rm_email': obj_posp['Reporting_Email_ID'],
                            'previous_rm_mobile': obj_posp['Reporting_Mobile_Number'],
                            'new_rm_uid': objrequestCore['Reporting_Agent_UID'],
                            'new_rm_name': objrequestCore['Reporting_Agent_Name'],
                            'new_rm_email': objrequestCore['Reporting_Email_ID'],
                            'new_rm_mobile': objrequestCore['Reporting_Mobile_Number'],
                            'remarks': (objrequestCore['Remarks'] !== '') ? objrequestCore['Remarks'] : 'NA',
                            'updated_by': req.obj_session.user.fullname + ' ( UID - ' + req.obj_session.user.erp_id + ' ,  SS_ID - ' + req.obj_session.user.ss_id + ' )',
                            'updated_on': moment().utcOffset("+05:30").toLocaleString()
                        };
                        if (obj_email['previous_rm_uid'] == obj_email['new_rm_uid']) {
                            obj_status['status'] = 'VALIDATION';
                            obj_status['msg'] = 'SAME_RECORD';
                            var today = moment().utcOffset("+05:30");
                            var today_str = moment(today).format("YYYYMMD");
                            var objRequest = {
                                'dt': today.toLocaleString(),
                                'req': req.body,
                                'resp': obj_status
                            };
                            fs.appendFile(appRoot + "/tmp/log/rm_mapping_update_" + today_str + ".log", JSON.stringify(objRequest) + "\r\n", function (err) {});
                            res.send(obj_status);
                        } else {
                            if (req.query['dbg'] === 'yes') {
                                ReportingUpdateEmailSend(obj_email);
                                res.send(obj_status);
                            } else {
                                // create Request object
                                var update_request = new sql.Request();
                                // query to the database and get the records            
                                update_request.query(qry_str, function (qry_err, recordset) {
                                    if (qry_err) {
                                        console.error(qry_err);
                                        obj_email['status'] = 'ERR';
                                        obj_status['status'] = 'QUERY_ERR';
                                        obj_status['msg'] = qry_err;
                                    } else {
                                        obj_email['status'] = 'SUCCESS';
                                        obj_status['status'] = 'SUCCESS';
                                        obj_status['msg'] = recordset;
                                        var Client = require('node-rest-client').Client;
                                        var client = new Client();
                                        client.get(config.environment.weburl + '/report/sync_emp_master?ss_id=' + objrequestCore["ss_id"], {}, function (data, response) {});
                                        client.get(config.environment.weburl + '/report/sync_posp_master?ss_id=' + objrequestCore["ss_id"], {}, function (data, response) {});
                                        if (req.query['email'] === 'no') {

                                        } else {
                                            ReportingUpdateEmailSend(obj_email);
                                        }
                                    }
                                    var today = moment().utcOffset("+05:30");
                                    var today_str = moment(today).format("YYYYMMD");
                                    var objRequest = {
                                        'dt': today.toLocaleString(),
                                        'req': req.body,
                                        'resp': obj_status
                                    };
                                    fs.appendFile(appRoot + "/tmp/log/rm_mapping_update_" + today_str + ".log", JSON.stringify(objRequest) + "\r\n", function (err) {});
                                    res.send(obj_status);
                                });
                            }
                        }
                    }
                });
            }
        });
    });
    function dsa_posp_update_rm_handler(res, obj_status) {
        try {
            if (obj_status['posp_status'] !== 'PENDING' && obj_status['employee_status'] !== 'PENDING') {
                var Client = require('node-rest-client').Client;
                var client = new Client();
                if (obj_status['posp_status'] === 'SUCCESS') {
                    client.get(config.environment.weburl + '/report/sync_posp_master?ss_id=' + obj_status['req']["ss_id"], {}, function (data, response) {});
                }
                if (obj_status['employee_status'] === 'SUCCESS') {
                    client.get(config.environment.weburl + '/report/sync_emp_master?ss_id=' + obj_status['req']["ss_id"], {}, function (data, response) {});
                }
                return res.json(obj_status);
            }
        } catch (e) {
            return res.send(e.stack);
        }
    }
    app.post('/posps/dsa_posp_update_rm', LoadSession, function (req, res) {
        try {
            req.body = JSON.parse(JSON.stringify(req.body));
            var objrequestCore = req.body;
            var obj_data = {
                'ss_id': 1,
                'fba_id': 1,
                "Reporting_Agent_UID": 1,
                "Reporting_Agent_Name": 1,
                "Reporting_Mobile_Number": 1,
                "Reporting_Email_ID": 1
            };
            var posp_qry_str = "";
            for (var k in obj_data) {
                if (objrequestCore[k] == '') {
                    return res.send('ERR_PARAMETER_MISSING');
                }
            }
            var posp_qry_str = 'update Posp_Details set Reporting_Agent_UID = ' + objrequestCore['Reporting_Agent_UID'].toString() + ' , Reporting_Agent_Name = \'' + objrequestCore['Reporting_Agent_Name'].toString() + '\' , Reporting_Mobile_Number = ' + objrequestCore['Reporting_Mobile_Number'].toString() + ' , Reporting_Email_ID = \'' + objrequestCore['Reporting_Email_ID'].toString() + '\'    where SS_ID = ' + objrequestCore["ss_id"].toString();
            var employee_qry_str = 'update Employee_Master set UID = ' + objrequestCore['Reporting_Agent_UID'].toString() + ' , Reporting_UID_Name = \'' + objrequestCore['Reporting_Agent_Name'].toString() + '\' , Reporting_Mobile_Number = ' + objrequestCore['Reporting_Mobile_Number'].toString() + ' , Reporting_Email_ID = \'' + objrequestCore['Reporting_Email_ID'].toString() + '\'    where Emp_Id = ' + objrequestCore["ss_id"].toString();
            var obj_status = {
                'req': req.body,
                'posp_status': 'PENDING',
                'employee_status': 'PENDING',
                'posp_msg': 'NA',
                'employee_msg': 'NA',
                'posp_qry': posp_qry_str,
                'employee_qry': employee_qry_str
            };
            if (req.query['dbg'] === 'yes') {
                obj_status['dbg'] = 'yes';
                return res.json(obj_status);
            } else {
                var sql = require("mssql");
                sql.close();
                sql.connect(config.pospsqldb, function (conn_err) {
                    if (conn_err) {
                        obj_status['posp_status'] = 'DB_CON_ERR';
                        obj_status['posp_msg'] = conn_err;
                    } else {
                        var posp_update_request = new sql.Request();
                        posp_update_request.query(posp_qry_str, function (qry_err, recordset) {
                            if (qry_err) {
                                obj_status['posp_status'] = 'DB_UPDATE_ERR';
                                obj_status['posp_msg'] = qry_err;
                            } else {
                                obj_status['posp_status'] = 'SUCCESS';
                                obj_status['posp_msg'] = recordset;
                            }
                            sql.close();
                            sql.connect(config.portalsqldb, function (conn_err) {
                                if (conn_err) {
                                    obj_status['employee_status'] = 'DB_CON_ERR';
                                    obj_status['employee_msg'] = conn_err;
                                } else {
                                    var employee_update_request = new sql.Request();
                                    employee_update_request.query(employee_qry_str, function (qry_err, recordset) {
                                        if (qry_err) {
                                            obj_status['employee_status'] = 'DB_UPDATE_ERR';
                                            obj_status['employee_msg'] = qry_err;
                                        } else {
                                            obj_status['employee_status'] = 'SUCCESS';
                                            obj_status['employee_msg'] = recordset;
                                        }
                                        dsa_posp_update_rm_handler(res, obj_status);
                                    });
                                }
                            });
                        });
                    }
                });
                if (false) {
                    var portalsql = require("mssql");
                    portalsql.close();
                    portalsql.connect(config.portalsqldb, function (conn_err) {
                        if (conn_err) {
                            obj_status['employee_status'] = 'DB_CON_ERR';
                            obj_status['employee_msg'] = conn_err;
                        } else {
                            var employee_update_request = new portalsql.Request();
                            employee_update_request.query(employee_qry_str, function (qry_err, recordset) {
                                if (qry_err) {
                                    obj_status['employee_status'] = 'DB_UPDATE_ERR';
                                    obj_status['employee_msg'] = qry_err;
                                } else {
                                    obj_status['employee_status'] = 'SUCCESS';
                                    obj_status['employee_msg'] = recordset;
                                }
                                dsa_posp_update_rm_handler(res, obj_status);
                            });
                        }
                    });
                }
            }
        } catch (e) {
            return res.send(e.stack);
        }
    });
    app.get('/posps/dsas/view/:ss_id', function (req, res) {
        let ss_id = req.params.ss_id - 0;
        var Posp = require('../models/posp');
        let obj_agent = {
            'user_type': '',
            'product': 'insurance,loan',
            'status': 'NA',
            'channel': '',
            'POSP': null,
            'EMP': null
        };
        Posp.findOne({"Ss_Id": ss_id, 'Is_Active': true}, function (err, dbPosp) {
            if (dbPosp) {
                obj_agent['POSP'] = dbPosp._doc;
            } else {
                obj_agent['POSP'] = 'NA';
            }
            posps_dsas_view_handler(obj_agent, req, res);
        });
        var Employee = require('../models/employee');
        Employee.findOne({"Emp_Id": ss_id, 'IsActive': 1}, function (err, dbEmployee) {
            if (dbEmployee) {
                obj_agent['EMP'] = dbEmployee._doc;
                posps_dsas_view_handler(obj_agent, req, res);
            } else { // for invalid agent id
                obj_agent['EMP'] = 'NA';
                var Client = require('node-rest-client').Client;
                var client = new Client();
                client.get(config.environment.weburl + '/report/sync_emp_master?ss_id=' + ss_id, {}, function (data, response) {});
                client.get(config.environment.weburl + '/report/sync_posp_master?ss_id=' + ss_id, {}, function (data, response) {});
                res.json(obj_agent);
            }

        });
    });
    app.get('/posps/dsas/viewbyfbaid/:fba_id', function (req, res) {
        let fba_id = req.params.fba_id;
        var Posp = require('../models/posp');
        let obj_agent = {
            'user_type': '',
            'status': 'NA',
            'POSP': null,
            'EMP': null
        };
        Posp.findOne({"Fba_Id": fba_id.toString(), 'Is_Active': true}, function (err, dbPosp) {
            if (dbPosp) {
                obj_agent['POSP'] = dbPosp._doc;
            } else {
                obj_agent['POSP'] = 'NA';
            }
            posps_dsas_view_handler(obj_agent, req, res);
        });
        var Employee = require('../models/employee');
        Employee.findOne({"FBA_ID": fba_id - 0, 'IsActive': 1}, function (err, dbEmployee) {
            if (dbEmployee) {
                obj_agent['EMP'] = dbEmployee._doc;
                posps_dsas_view_handler(obj_agent, req, res);
            } else { // for invalid agent id
                obj_agent['EMP'] = 'NA';
                //var Client = require('node-rest-client').Client;
                //var client = new Client();
                //client.get(config.environment.weburl + '/report/sync_emp_master?ss_id=' + ss_id, {}, function (data, response) {});
                //client.get(config.environment.weburl + '/report/sync_posp_master?ss_id=' + ss_id, {}, function (data, response) {});
                res.json(obj_agent);
            }

        });
    });
    app.get('/posps/emp/viewbyuid/:erp_uid', function (req, res) {
        let erp_uid = req.params.erp_uid - 0;
        let obj_agent = {
            'user_type': '',
            'status': 'NA',
            'POSP': 'NA',
            'EMP': null
        };
        var Employee = require('../models/employee');
        Employee.findOne({"Emp_Code": erp_uid, 'IsActive': 1}, function (err, dbEmployee) {
            if (dbEmployee) {
                obj_agent['EMP'] = dbEmployee._doc;
                posps_dsas_view_handler(obj_agent, req, res);
            } else { // for invalid agent id
                obj_agent['EMP'] = 'NA';
                res.json(obj_agent);
            }
        });
    });
    app.get('/posps/logs/get_tmp_dir', function (req, res) {
        try {
            if (req.query['dbg'] === 'yes') {
                return res.json(req.query);
            }
            if (req.query['type'] !== '' && req.query['folder'] !== '') {
                let location = (req.query['type'] === 'main') ? (appRoot + '/tmp/') : (appRoot + '/tmp/' + req.query['folder'] + '/');
                fs.readdir(location, function (err, files) {
                    //handling error
                    if (err) {
                        return res.send(err);
                    }
                    //listing all files using forEach
                    let arr_list = [];
                    files.forEach(function (file) {
                        // Do whatever you want to do with the file
                        console.log(file);
                        if (file !== '.') {
                            arr_list.push(file);
                        }
                    });
                    return res.json(arr_list);
                });
                //let arr_tmp_dir = getDirectories(location);                
            } else {
                return res.json([]);
            }
        } catch (e) {
            return res.send(e.stack);
        }
    });
    app.get('/posps/logs/get_files', function (req, res) {
        try {
            let arr_tmp_dir = getFiles(appRoot + '/tmp/' + req.query['folder'] + '/');
            res.json(arr_tmp_dir);
        } catch (e) {
            res.send(e.stack);
        }
    });
    function getDirectories(path) {
        return fs.readdirSync(path).filter(function (file) {
            return fs.statSync(path + '/' + file).isDirectory();
        });
    }
    function getFiles(path) {
        try {
            let arr_files = fs.readdirSync(path);
            let arr_files_list = [];
            for (let k in arr_files) {
                if (arr_files[k] === '.') {
                    continue;
                }
                let file_stat = fs.statSync(path + '/' + arr_files[k]);
                if (file_stat.isDirectory() === false) {
                    let fileSizeInBytes = file_stat.size;
                    let fileSizeInKb = (fileSizeInBytes / 1024).toFixed(2);
                    let fileSizeInMb = (fileSizeInBytes / (1024 * 1024)).toFixed(2);
                    let fileSize = fileSizeInKb + ' KB';
                    if (fileSizeInKb > 1024) {
                        fileSize = fileSizeInMb + ' MB';
                    }
                    arr_files_list.push({
                        'Name': arr_files[k],
                        'Size': fileSize,
                        'Modified_On': new Date(file_stat.mtime).toLocaleString()
                    });
                }
            }
            return arr_files_list;
        } catch (e) {
            return e.stack;
        }
    }
    app.post('/posps/mobile_verification', function (req, res) {
        var Sms = require('../models/sms');
        var now = moment().utcOffset("+05:30");
        var fromDate = null;
        var toDate = null;
        fromDate = moment(now).subtract(30, 'minutes');
        toDate = now;
        let Sender = req.body['Created_By_Mobile'] - 0;
        let cond = {"Sender": Sender, 'Request_Type': 'GOLD', 'Received_On': {'$gt': fromDate, '$lt': toDate}};
        Sms.findOne({"Sender": Sender, 'Request_Type': 'GOLD', 'Received_On': {'$gt': fromDate, '$lt': toDate}}).exec(function (err, dbSms) {
            let data = (dbSms) ? dbSms._doc : {};
            data['qry'] = cond;
            res.json(data);
        });
    });
    app.post('/posps/rm_mapping_execute', LoadSession, function (req, res) {
        var Rm_Mapping = require('../models/rm_mapping');
        var Rm_Mapping_Job = require('../models/rm_mapping_job');
        let Rm_Mapping_Job_Id = req.body['Rm_Mapping_Job_Id'] - 0;
        Rm_Mapping_Job.findOne({"Rm_Mapping_Job_Id": Rm_Mapping_Job_Id}).exec(function (err, dbRmMappingJob) {
            Rm_Mapping.find({"Rm_Mapping_Job_Id": Rm_Mapping_Job_Id}).select().exec(function (err, dbRmMapping) {
                try {
                    if (dbRmMapping) {
                        if (dbRmMapping.length > 0) {
                            let arr_mapping_summary = [];
                            let Client = require('node-rest-client').Client;
                            let client = new Client();
                            let Email = require('../models/email');
                            let objModelEmail = new Email();
                            var today = moment().utcOffset("+05:30");
                            var today_str_1 = moment(today).format("YYYYMMD");
                            for (let k in dbRmMapping) {
                                let objRmMapping = dbRmMapping[k]._doc;
                                let objMappingData = {
                                    "ss_id": objRmMapping['ss_id'],
                                    "fba_id": objRmMapping['fba_id'],
                                    "Reporting_Agent_Name": objRmMapping['new_rm_name'],
                                    "Reporting_Agent_UID": objRmMapping['new_rm_uid'],
                                    "Reporting_Email_ID": objRmMapping['new_rm_email'],
                                    "Reporting_Mobile_Number": objRmMapping['new_rm_mobile'],
                                    "session_id": req.body['session_id'] || '',
                                    "Remarks": objRmMapping['remark'] || 'NA'
                                };
                                let objMappingSummary = {
                                    'Rm_Mapping_Id': objRmMapping['Rm_Mapping_Id'],
                                    'Agent': objRmMapping['agent_name'] + '::SSID-' + objRmMapping['ss_id'],
                                    'Channel': objRmMapping['Channel'],
                                    'Old_RM': objRmMapping['current_rm_name'] + '::UID-' + objRmMapping['current_rm_uid'],
                                    'New_RM': objRmMapping['new_rm_name'] + '::UID-' + objRmMapping['new_rm_uid'],
                                    'Remark': objRmMapping['remark'] || 'NA',
                                    'Status': 'PENDING'
                                };
                                let objMappingEmailSummary = {
                                    'Agent': objRmMapping['agent_name'] + '::SSID-' + objRmMapping['ss_id'],
                                    'Channel': objRmMapping['Channel'],
                                    'Reporting_Manager_Name': objRmMapping['new_rm_name'] + '::UID-' + objRmMapping['new_rm_uid'],
                                    'Reporting_Manager_Email': objRmMapping['new_rm_email'],
                                    'Reporting_Manager_Mobile': objRmMapping['new_rm_mobile']
                                };
                                let args = {
                                    data: objMappingData,
                                    headers: {"Content-Type": "application/json"}
                                };
                                if (req.query['dbg'] === 'yes') {

                                } else {
                                    sleep(500);
                                    client.post(config.environment.weburl + '/posps/dsa_posp_update_rm?dbg=no&email=no', args, function (crndata, response) {
                                        if (crndata && crndata['posp_status'] === 'SUCCESS' && crndata['employee_status'] === 'SUCCESS') {
                                            objMappingSummary['Status'] = 'SUCCESS';
                                            if (req.query['mailtorm'] === 'yes') {
                                                let rm_notification = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>RM MAPPING NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                                                rm_notification += '<p style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">Dear ' + objRmMapping['agent_name'] + ',<br>';
                                                rm_notification += 'Your Reporting Manager is updated. Now <b><u>' + objRmMapping['new_rm_name'] + '</u></b> is assigned to you as new Reporting Manager.<BR>Following is  details. For any query, Kindly contact your Reporting Manager.<br><br>';
                                                rm_notification += objectToHtml(objMappingEmailSummary);
                                                rm_notification += '</p>';
                                                rm_notification += '</body></html>';
                                                var subject = '[MAPPING-UPDATE] MAPPING OF RM UPDATED FOR :: ' + objMappingSummary['Agent'];
                                                var to = objRmMapping['agent_email'].toString().toLowerCase();
                                                var cc = objRmMapping['new_rm_email'].toString().toLowerCase();
                                                objModelEmail.send('notifications@policyboss.com', to, subject, rm_notification, cc, config.environment.notification_email);
                                            }
                                        } else {
                                            objMappingSummary['Status'] = 'ERR';
                                        }
                                        arr_mapping_summary.push(objMappingSummary);
                                        let objRequest = {
                                            'dt': today.toLocaleString(),
                                            'type': 'posp_emp',
                                            'status': objMappingSummary['Status'],
                                            'req': objMappingData,
                                            'resp': crndata
                                        };
                                        fs.appendFile(appRoot + "/tmp/debug/rm_mapping_update_" + today_str_1 + ".log", JSON.stringify(objRequest) + "\r\n", function (err) {});
                                        rm_mapping_execute_handler(dbRmMappingJob, arr_mapping_summary, dbRmMapping, req, res);
                                    });
                                }
                            }
                            Rm_Mapping_Job.update({"Rm_Mapping_Job_Id": Rm_Mapping_Job_Id}, {$set: {'Status': 'PROCESSED'}}, function (err, objDbRm_Mapping_Job) {});
                            Rm_Mapping.update({"Rm_Mapping_Job_Id": Rm_Mapping_Job_Id}, {$set: {'Status': 'PROCESSED'}}, {multi: true}, function (err, objDbRm_Mapping) {});
                        }
                    }
                } catch (e) {
                    return res.send(e.stack);
                }
            });

        });
    });
    function rm_mapping_execute_handler(dbRmMappingJob, arr_mapping_summary, dbRmMapping, req, res) {
        if (dbRmMapping.length > 0 && dbRmMapping.length === arr_mapping_summary.length) {
            let Email = require('../models/email');
            let objModelEmail = new Email();

            let today_str = moment().utcOffset("+05:30").startOf('Day').format("YYYY-MM-DD");
            let res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>RM MAPPING UPDATE</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
            res_report += '<p><h1>RM MAPPING UPDATE REPORT :: ' + today_str + '</h1></p>';
            res_report += '<p><h1>MAPPING JOB : ' + dbRmMappingJob._doc['Camp_Name'] + '</h1></p>';
            res_report += '<p><h1>List</h1>';
            res_report += arrayobjectToHtml(arr_mapping_summary);
            res_report += '</p>';
            res_report += '</body></html>';
            let channel = dbRmMappingJob._doc['Channel'];
            var subject = '[MAPPING-BULK][CH-' + channel + '] RM_MAPPING_JOB :: ' + today_str;
            var arr_to = (channel === 'ALL') ? [] : [config.channel.Const_CH_Contact[channel]['email'].toString().toLowerCase()];
            let email_report = dbRmMappingJob._doc['Email'].toString().toLowerCase();
            if (arr_to.indexOf(email_report) < 0) {
                arr_to.push(email_report);
            }
            if (req.query['dbg'] === 'yes') {
                objModelEmail.send('notifications@policyboss.com', arr_to.join(','), subject, res_report, '', config.environment.notification_email);
            } else {
                objModelEmail.send('notifications@policyboss.com', arr_to.join(','), subject, res_report, 'pramod.parit@policyboss.com', config.environment.notification_email);
            }
            return res.json({'Status': 'SUCCESS', 'Data_Count': dbRmMapping.length});
        }
    }
    app.post('/posps/rm_mapping_upload', LoadSession, function (req, res) {
        let obj_status = {
            'Status': 'pending',
            'Msg': 'pending',
            'list': []
        };
        try {
            let logged_in_user = req.obj_session.user.fullname + '(ss_id:' + req.obj_session.user.ss_id + ')';
            let allowed_channel = 'NA';
            let allowed_channel_list = [];
            if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1) {
                allowed_channel = 'ALL';
            } else if (req.obj_session.user.role_detail.role.indexOf('ChannelHead') > -1) {
                allowed_channel = req.obj_session.user.role_detail.channel;
                allowed_channel_list = req.obj_session.user.role_detail.channel_list;
            } else {
                return res.send('NOT_AUTHORIZED');
            }

            var Rm_Mapping = require('../models/rm_mapping');
            var Rm_Mapping_Job = require('../models/rm_mapping_job');
            var formidable = require('formidable');
            var form = new formidable.IncomingForm();
            var fs = require('fs');
            form.parse(req, function (err, fields, files) {
                var source_path = files.files_rm_mapping.path;
                fs.readFile(source_path, function (err, data) {
                    try {
                        if (err)
                        {
                            obj_status['Status'] = 'ERR_FILE_READ';
                            obj_status['Msg'] = err;
                            console.error('Read', err);
                            res.json(obj_status);
                        } else {
                            console.log('File read!');
                            let quote_file = 'rm_mapping_' + moment().utcOffset("+05:30").format('YYYYMMDD_HHmmss') + '.csv';
                            let quote_file_sys_path = appRoot + "/tmp/rm_mapping/" + quote_file;
                            // Write the file
                            let import_file_path = appRoot + "/tmp/rm_mapping/" + quote_file;
                            fs.writeFile(quote_file_sys_path, data, function (err) {
                                if (err) {
                                    obj_status['Status'] = 'ERR_FILE_WRITE';
                                    obj_status['Msg'] = err;
                                    res.json(obj_status);
                                } else {
                                    obj_status['File_Status'] = 'SUCCESS';
                                    let obj_fresh_quote_job = {
                                        'Camp_Name': fields['Camp_Name'],
                                        'Email': fields['Email'],
                                        'Channel': allowed_channel,
                                        'Session_Id': fields['session_id'],
                                        'Status': 'UPLOADED', // UPLOADED , VALIDATED , REJECTED, VERIFIED , MATCHED , NOTMATCHED , SURLCREATED
                                        'Data_File': quote_file,
                                        'Quote_File': '',
                                        'File_Data_Count': 0,
                                        'Upload_Count': 0,
                                        'Created_By': logged_in_user,
                                        'Created_By_Mobile': fields['Created_By_Mobile'],
                                        'Created_On': new Date(),
                                        'Modified_On': new Date()
                                    };
                                    let obj_data_validation = {
                                        'Total': 0,
                                        'Valid': 0,
                                        'InValid': 0,
                                        'SsIdInValid': 0,
                                        'UIDInValid': 0,
                                        'SameMappingAlready': 0,
                                        'FromOtherChannel': 0,
                                        'FromNonAgent': 0,
                                        'SsIdInValid_List': [],
                                        'UIDInValid_List': [],
                                        'SameMappingAlready_List': [],
                                        'FromOtherChannel_List': [],
                                        'FromNonAgent_List': [],
                                        'Process': 0,
                                        'Mapping_List': []
                                    };
                                    let record_count = 0;
                                    fs.createReadStream(import_file_path)
                                            .pipe(csv())
                                            .on('data', (row) => {
                                                record_count++;
                                            })
                                            .on('end', () => {
                                                if (record_count > 50 || record_count === 0) {
                                                    return res.json({'Message': 'Found Record - ' + record_count + ', Record more than 50 or empty not allowed'});
                                                } else {
                                                    var objModelRm_Mapping_Job = new Rm_Mapping_Job(obj_fresh_quote_job);
                                                    objModelRm_Mapping_Job.save(function (err, objDbRm_Mapping_Job) {
                                                        obj_status['Job_Status'] = 'SUCCESS';
                                                        obj_status['Status'] = 'SUCCESS';
                                                        obj_status['Msg'] = quote_file;
                                                        obj_status['Rm_Mapping_Job_Id'] = objDbRm_Mapping_Job['Rm_Mapping_Job_Id'];
                                                        obj_data_validation['Rm_Mapping_Job_Id'] = objDbRm_Mapping_Job['Rm_Mapping_Job_Id'];
                                                        fs.createReadStream(import_file_path)
                                                                .pipe(csv())
                                                                .on('data', (row) => {
                                                                    try {
                                                                        obj_data_validation['Total']++;
                                                                        row['ss_id'] = row['ss_id'] - 0;
                                                                        row['rm_uid'] = row['rm_uid'] - 0;
                                                                        if (row['ss_id'] > 0 && row['rm_uid'] > 0) {
                                                                            obj_data_validation['Valid']++;
                                                                            let obj_rm_mapping = {
                                                                                'Rm_Mapping_Job_Id': objDbRm_Mapping_Job['Rm_Mapping_Job_Id'],
                                                                                'Camp_Name': req.body['Camp_Name'],
                                                                                'Channel': '',
                                                                                'agent_name': '',
                                                                                'agent_email': '',
                                                                                'agent_city': '',
                                                                                'ss_id': row['ss_id'],
                                                                                'fba_id': '',
                                                                                'current_rm_uid': '',
                                                                                'current_rm_name': '',
                                                                                'new_rm_uid': row['rm_uid'],
                                                                                'new_rm_name': '',
                                                                                'new_rm_mobile': '',
                                                                                'new_rm_email': '',
                                                                                'session_id': req.query['session_id'],
                                                                                'remark': row['remark'],
                                                                                'Created_By': logged_in_user,
                                                                                'Created_On': new Date(),
                                                                                'Modified_On': new Date()
                                                                            };
                                                                            var Client = require('node-rest-client').Client;
                                                                            var client = new Client();
                                                                            client.get(config.environment.weburl + '/posps/dsas/view/' + row['ss_id'], {}, function (data, response) {
                                                                                if (data['status'] === 'SUCCESS') {
                                                                                    let channel = data.channel;
                                                                                    if (['POSP', 'FOS'].indexOf(data.user_type) > -1 && (allowed_channel_list.indexOf(channel) > -1 || allowed_channel === 'ALL')) {
                                                                                        obj_rm_mapping['Channel'] = channel;
                                                                                        obj_rm_mapping['agent_name'] = (data.user_type === 'POSP') ? data['POSP']['First_Name'] + ' ' + data['POSP']['Last_Name'] : data['EMP']['Emp_Name'];
                                                                                        obj_rm_mapping['agent_email'] = (data.user_type === 'POSP') ? data['POSP']['Email_Id'] : data['EMP']['Email_Id'];
                                                                                        obj_rm_mapping['agent_city'] = (data.user_type === 'POSP') ? data['POSP']['Agent_City'] : data['EMP']['Branch'];
                                                                                        obj_rm_mapping['current_rm_uid'] = (data.user_type === 'POSP') ? data['POSP']['Reporting_Agent_Uid'] : data['EMP']['UID'];
                                                                                        obj_rm_mapping['current_rm_name'] = (data.user_type === 'POSP') ? data['POSP']['Reporting_Agent_Name'] : data['EMP']['Reporting_UID_Name'];
                                                                                        obj_rm_mapping['fba_id'] = (data.user_type === 'POSP') ? data['POSP']['Fba_Id'] : data['EMP']['FBA_ID'];
                                                                                        if (obj_rm_mapping['new_rm_uid'] == obj_rm_mapping['current_rm_uid']) {
                                                                                            obj_data_validation['SameMappingAlready']++;
                                                                                            obj_data_validation['SameMappingAlready_List'].push(row['ss_id']);
                                                                                            obj_data_validation['Process']++;
                                                                                            rm_mapping_upload_handler(obj_data_validation, obj_status, res);
                                                                                        } else {
                                                                                            client.get(config.environment.weburl + '/pb_employees/list?q=' + row['rm_uid'], {}, function (data, response) {
                                                                                                try {
                                                                                                    if (typeof data[0] !== 'undefined') {
                                                                                                        obj_rm_mapping['new_rm_name'] = data[0]['Employee_Name'];
                                                                                                        obj_rm_mapping['new_rm_mobile'] = data[0]['Phone'];
                                                                                                        obj_rm_mapping['new_rm_email'] = data[0]['Official_Email'] || data[0]['Email'];
                                                                                                        let objModelRm_Mapping = new Rm_Mapping(obj_rm_mapping);
                                                                                                        obj_data_validation['Mapping_List'].push(obj_rm_mapping);
                                                                                                        objModelRm_Mapping.save(function (err, objDbRm_Mapping) {
                                                                                                            if (err) {
                                                                                                                console.error('Exception', 'Rm_Mapping_Save', obj_rm_mapping, err, objDbRm_Mapping);
                                                                                                                //return res.send(err);
                                                                                                            } else {

                                                                                                            }
                                                                                                            obj_data_validation['Process']++;
                                                                                                            rm_mapping_upload_handler(obj_data_validation, obj_status, res);
                                                                                                        });
                                                                                                    } else {
                                                                                                        obj_data_validation['UIDInValid']++;
                                                                                                        obj_data_validation['UIDInValid_List'].push(row['rm_uid']);
                                                                                                        obj_data_validation['Process']++;
                                                                                                        rm_mapping_upload_handler(obj_data_validation, obj_status, res);
                                                                                                    }
                                                                                                } catch (e) {
                                                                                                    obj_status['Status'] = 'EXCEPTION';
                                                                                                    obj_status['Msg'] = e.stack;
                                                                                                    return res.json(obj_status);
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    } else {
                                                                                        if (['POSP', 'FOS'].indexOf(data.user_type) > -1) {
                                                                                            obj_data_validation['FromOtherChannel']++;
                                                                                            obj_data_validation['FromOtherChannel_List'].push(row['ss_id']);
                                                                                        } else {
                                                                                            obj_data_validation['FromNonAgent']++;
                                                                                            obj_data_validation['FromNonAgent_List'].push(row['ss_id']);
                                                                                        }
                                                                                        obj_data_validation['Process']++;
                                                                                        rm_mapping_upload_handler(obj_data_validation, obj_status, res);
                                                                                    }
                                                                                } else {
                                                                                    obj_data_validation['Process']++;
                                                                                    obj_data_validation['DataInValid']++;
                                                                                    obj_data_validation['DataInValid_List'].push(row['ss_id']);
                                                                                    rm_mapping_upload_handler(obj_data_validation, obj_status, res);
                                                                                }
                                                                            });
                                                                        } else {
                                                                            obj_data_validation['InValid']++;
                                                                            obj_data_validation['Process']++;
                                                                            rm_mapping_upload_handler(obj_data_validation, obj_status, res)
                                                                        }
                                                                    } catch (e) {
                                                                        obj_status['Status'] = 'EXCEPTION';
                                                                        obj_status['Msg'] = e.stack;
                                                                        return res.json(obj_status);
                                                                    }
                                                                })
                                                                .on('end', () => {
                                                                    obj_status['FILE_READ'] = 'SUCCESS';
                                                                });
                                                    });
                                                }
                                            });
                                }
                            });
                        }

                    } catch (e) {
                        obj_status['Status'] = 'EXCEPTION';
                        obj_status['Msg'] = e.stack;
                        return res.json(obj_status);
                    }
                });
            });
        } catch (e) {
            obj_status['Status'] = 'EXCEPTION';
            obj_status['Msg'] = e.stack;
            return res.json(obj_status);
        }
    });
    function rm_mapping_upload_handler(obj_data_validation, obj_status, res) {
        if (obj_data_validation['Process'] > 0 && obj_data_validation['Process'] === obj_data_validation['Total']) {
            var Rm_Mapping_Job = require('../models/rm_mapping_job');
            let obj_rm_mapping_job = {
                'Status': 'UPLOADED', // UPLOADED , VALIDATED , REJECTED, VERIFIED , MATCHED , NOTMATCHED , SURLCREATED
                'File_Data_Count': obj_data_validation['Total'],
                'Upload_Count': obj_data_validation['Valid'],
                'Validation_Summary': obj_data_validation,
                'Modified_On': new Date()
            };
            Rm_Mapping_Job.update({'Rm_Update_Job_Id': obj_data_validation['Fresh_Quote_Job_Id']}, {$set: obj_rm_mapping_job}, function (err, objDbFresh_Quote_Job) {
                return res.json(obj_data_validation);
            });
        }
    }
    function objectToHtml(objSummary) {

        var msg = '<div class="report" ><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">Report</span><table style="-moz-box-shadow: 1px 1px 3px 2px #d3d3d3;-webkit-box-shadow: 1px 1px 3px 2px #d3d3d3;  box-shadow:         1px 1px 3px 2px #d3d3d3;" border="0" cellpadding="3" cellspacing="0" width="95%"  >';
        var row_inc = 0;
        for (var k in objSummary) {
            if (row_inc === 0) {
                msg += '<tr>';
                msg += '<th style="font-size:12px;font-family:\'Google Sans\' ,tahoma;background-color: #d7df01">Details</th>';
                msg += '<th style="font-size:12px;font-family:\'Google Sans\' ,tahoma;background-color: #d7df01">Value</th>';
                msg += '</tr>';
            }
            msg += '<tr>';
            msg += '<td style="font-size:12px;font-family:\'Google Sans\' ,tahoma;" align="center">' + k + '</td>';
            msg += '<td style="font-size:12px;font-family:\'Google Sans\' ,tahoma;" align="center">' + objSummary[k] + '</td>';
            msg += '</tr>';
            row_inc++;
        }
        msg += '</table></div>';
        return msg;
    }
    function arrayobjectToHtml(objSummary, Title = 'Report', SubTitle = '', ColumnToExclude = []) {
        var msg = '<div class="report" ><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;font-weight:bold">' + Title + '</span>';
        if (SubTitle !== '') {
            msg += '<span  style="font-family:\'Google Sans\' ,tahoma;font-size:12px;">' + SubTitle + '</span>';
        }
        msg += '<table style="-moz-box-shadow: 1px 1px 3px 2px #d3d3d3;-webkit-box-shadow: 1px 1px 3px 2px #d3d3d3;  box-shadow:         1px 1px 3px 2px #d3d3d3;" border="0" cellpadding="3" cellspacing="0" width="95%"  >';
        var row_inc = 0;
        for (var k in objSummary) {
            if (row_inc === 0) {
                msg += '<tr>';
                for (var k_head in objSummary[k]) {
                    if (ColumnToExclude.indexOf(k_head) < 0) {
                        msg += '<th style="font-size:12px;font-family:\'Google Sans\' ,tahoma;background-color: #d7df01;text-align:center;"  align="center">' + k_head + '</th>';
                    }
                }
                msg += '</tr>';
            }
            msg += '<tr>';
            for (var k_row in objSummary[k]) {
                if (ColumnToExclude.indexOf(k_row) < 0) {
                    msg += '<td style="font-size:12px;font-family:\'Google Sans\' ,tahoma;;text-align:center;" align="center">' + objSummary[k][k_row] + '</td>';
                }
            }
            msg += '</tr>';
            row_inc++;
        }
        msg += '</table></div>';
        return msg;
    }

    function posps_dsas_view_handler(objAgent, req, res) {
        try {
            if (objAgent['POSP'] !== null && objAgent['EMP'] !== null) {
                if (objAgent['EMP'] !== 'NA' && Object.keys(config.channel.Const_FOS_Channel).indexOf(objAgent['EMP']['Role_ID'].toString()) > -1) { //28 - MISP
                    objAgent['user_type'] = 'FOS';
                } else if (objAgent['EMP'] !== 'NA' && [3, 23, 30].indexOf(objAgent['EMP']['Role_ID'] - 0) > -1) { //28 - MISP
                    objAgent['user_type'] = 'EMP';
                } else if (objAgent['EMP'] !== 'NA' && [28].indexOf(objAgent['EMP']['Role_ID'] - 0) > -1) { //28 - MISP
                    objAgent['user_type'] = 'MISP';
                } else if (objAgent['EMP'] !== 'NA' && [35].indexOf(objAgent['EMP']['Role_ID'] - 0) > -1) {
                    objAgent['user_type'] = 'INS';
                } else if (objAgent['POSP'] !== 'NA' && Object.keys(config.channel.Const_POSP_Channel).indexOf(objAgent['POSP']['Sources']) > -1) {
                    objAgent['user_type'] = 'POSP';
                }

                let channel = 'NA';
                if (objAgent['user_type'] == 'POSP') {
                    channel = config.channel.Const_POSP_Channel[objAgent['POSP']['Sources']];
                }
                if (objAgent['user_type'] == 'FOS') {
                    channel = config.channel.Const_FOS_Channel[objAgent['EMP']['Role_ID']];
                }
                if (objAgent['user_type'] == 'EMP') {
                    channel = (objAgent['EMP']['Role_ID'] == '30') ? 'RBS' : 'PBS';
                }
                objAgent['channel'] = channel;
                objAgent['status'] = 'SUCCESS';
                if (req.query['field'] === 'channel') {
                    return res.send(channel);
                } else {
                    return res.json(objAgent);
                }

            }
        } catch (e) {
            console.error('posps_dsas_view_handler', objAgent, e);
            res.send(e);
        }
    }
    function ReportingUpdateEmailSend(obj_email) {
        var Email = require('../models/email');
        let objModelEmail = new Email();
        let sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[' + obj_email['status'] + '] REPORTING_MANAGER_UPDATION, SS_ID : ' + obj_email['ss_id'] + ' , FBA_ID : ' + obj_email['fba_id'];
        let arr_to = [];
        let arr_bcc = [config.environment.notification_email];
        let arr_cc = [];
        let contentSms_Log = "REPORTING_MANAGER_UPDATION<BR>------------------------<BR>";
        for (let k in obj_email) {
            contentSms_Log += k.replace(/_/g, ' ').toString().toUpperCase() + ' : ' + obj_email[k] + '<BR>';
        }
        let email_body = contentSms_Log.replace(/\n/g, '<BR>');
        let email_data = '<!DOCTYPE html><html><head><style>*,body,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>REPORTING_MANAGER_UPDATION_NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
        email_data += '<div class="report"><span>Reporting Manager is updated for Following POSP as below summary.<br>For any query, Please write to techsupport@policyboss.com</span><br><br><table border="1" cellpadding="3" cellspacing="0" width="90%"  >';
        email_data += '<tr><td  width="70%">' + email_body + '&nbsp;</td></tr>';
        email_data += '</table></div><br></body></html>';
        if (obj_email['status'] === 'DBG') {
            arr_to.push('chirag.modi@policyboss.com');
        } else {
            arr_to.push(obj_email['new_rm_email']);
            let Sources = obj_email['source'];
            if (Sources === 1 || Sources === 12 || Sources === 17) {
                arr_cc.push('transactions.1920@gmail.com');
                arr_cc.push('srinivas@policyboss.com');
                arr_cc.push('coordinator@magicfinmart.com');
            }
            if (Sources === 2 || Sources === 15) {
                arr_cc.push('posp.mis@policyboss.com');
                arr_cc.push('sandeep.nair@landmarkinsurance.in');
            }
            if (Sources === 8 || Sources === 16) {
                arr_cc.push('gagandeep.singh@policyboss.com');
                arr_cc.push('saroj.singh@policyboss.com');
            }
            if (Sources === 11 || Sources === 18) {
                arr_cc.push('kevin.menezes@policyboss.com');
                arr_cc.push('posp.mis@policyboss.com');
            }
            if (Sources === 11) {
                arr_cc.push('kevin.menezes@policyboss.com');
                arr_cc.push('posp.mis@policyboss.com');
            }
            if (Sources === 13) {
                arr_cc.push('shah.kevin@landmarkinsurance.in');
            }
            if (Sources === 14) {
                arr_cc.push('Santosh.singh@policyboss.com');
            }
        }
        objModelEmail.send('notifications@policyboss.com', arr_to.join(','), sub, email_data, arr_cc.join(','), arr_bcc.join(','), 0);
    }
    function GetReportingAssignedAgent(uid, res) {
        try {
//            if (fs.existsSync(appRoot + "/tmp/cachemaster/user_team_" + uid + ".log")) {
//                var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/user_team_" + uid + ".log").toString();
//                var obj_cache_content = JSON.parse(cache_content);
//                res.json(obj_cache_content);
//            } else {
            var obj_agent_summary = {
                'Profile': null,
                'Direct': {
                    'POSP': null,
                    'DSA': null,
                    'CSE': null
                },
                'Team': {
                    'POSP': null,
                    'DSA': null,
                    'CSE': null
                }
            };
            var User = require('../models/user');
            User.find(function (err, users) {
                if (err)
                    res.send(err);
                var empData = users;
                var objKey = uid;
                var employees = "";
                var emap_pid;
                var arr_all_emp = [];
                var arr_all_sub_reporting = [];
                for (var i = 0; i < empData.length; i++) {
                    var pid = empData[i]._doc['Direct_Reporting_UID'] - 0;
                    var tuid = empData[i]._doc['UID'] - 0;
                    if (tuid == uid) {
                        obj_agent_summary.Profile = empData[i]._doc;
                    }
                    if (pid === objKey) {
                        arr_all_emp.push(tuid);
                    }
//                    if (arr_all_emp.indexOf(pid) > -1 || arr_all_sub_reporting.indexOf(pid) > -1)
//                    {
//                        arr_all_sub_reporting.push(tuid);
//                    }
                    //emap_pid = empData[i]['id'];
                    if ((pid === objKey)) {
                        employees += employees === "" ? tuid : "," + tuid;
                    }
                }
                for (var i = 0; i < empData.length; i++) {
                    var pid = empData[i]._doc['Direct_Reporting_UID'] - 0;
                    var tuid = empData[i]._doc['UID'] - 0;
                    if (arr_all_emp.indexOf(pid) > -1) {
                        arr_all_emp.push(tuid);
                    }

                    //emap_pid = empData[i]['id'];
                    if ((arr_all_emp.indexOf(pid) > -1)) {
                        employees += employees === "" ? tuid : "," + tuid;
                    }
                }
                if (uid === '100002') {
                    employees = '';
                }
                var arr_emp = employees.split(',');
                var arr_uid_final = [];
                if (arr_emp.length > 0) {
                    for (var i in arr_emp) {
                        if ((arr_emp[i] - 0) > 0) {
                            arr_uid_final.push(arr_emp[i] - 0);
                        }
                    }
                }
                //obj_agent_summary.Team.CSE_UID = arr_uid_final;
                arr_uid_final.push(uid);
                //console.error('AgentListSS', arr_uid_final);
                // obj_agent_summary.Profile['Children'] = arr_uid_final;
                var Posp = require('../models/posp');
                Posp.find({"Reporting_Agent_Uid": {$in: arr_uid_final}, 'Is_Active': true}, function (err, dbAgents) {
                    var arr_rm_ssid = [];
                    var arr_rm_ssid_direct = [];
                    if (err) {
                    } else {
                        if (dbAgents) {
                            for (var k in dbAgents) {
                                arr_rm_ssid.push(dbAgents[k]._doc['Ss_Id']);
                                //console.error('POSPMATCH', uid, dbAgents[k]._doc['Reporting_Agent_Uid']);
                                if (uid == dbAgents[k]._doc['Reporting_Agent_Uid']) {
                                    arr_rm_ssid_direct.push(dbAgents[k]._doc['Ss_Id']);
                                }

                            }
                        }
                    }
                    obj_agent_summary.Direct.POSP = arr_rm_ssid_direct;
                    obj_agent_summary.Team.POSP = arr_rm_ssid;
                    GetReportingAssignedAgent_Handler(uid, obj_agent_summary, res);
                });
                var Employee = require('../models/employee');
                Employee.find({"Role_ID": {$in: [29, 34, 35, 39, 41]}, "UID": {$in: arr_uid_final}, 'IsActive': 1}, function (err, dbAgents) {
                    var arr_rm_ssid = [];
                    var arr_rm_ssid_direct = [];
                    if (err) {
                    } else {
                        if (dbAgents) {
                            for (var k in dbAgents) {
                                arr_rm_ssid.push(dbAgents[k]._doc['Emp_Id']);
                                if (uid == dbAgents[k]._doc['UID']) {
                                    arr_rm_ssid_direct.push(dbAgents[k]._doc['Emp_Id']);
                                }
                            }
                        }
                    }
                    obj_agent_summary.Team.DSA = arr_rm_ssid;
                    obj_agent_summary.Direct.DSA = arr_rm_ssid_direct;
                    GetReportingAssignedAgent_Handler(uid, obj_agent_summary, res);
                });
                Employee.find({"Emp_Code": {$in: arr_uid_final}, 'IsActive': 1}, {'Emp_Id': 1, 'Emp_Code': 1}, function (err, dbAgents) {
                    var arr_rm_ssid = [];
                    var arr_rm_ssid_direct = [];
                    if (err) {
                    } else {
                        if (dbAgents) {
                            for (var k in dbAgents) {
                                if (uid !== dbAgents[k]._doc['Emp_Code']) {
                                    arr_rm_ssid.push(dbAgents[k]._doc['Emp_Id']);
                                }
                            }
                        }
                    }
                    obj_agent_summary.Team.CSE = arr_rm_ssid;
                    obj_agent_summary.Direct.CSE = arr_rm_ssid_direct;
                    GetReportingAssignedAgent_Handler(uid, obj_agent_summary, res);
                });
            });
//            }

        } catch (e) {
            console.error('Exception', 'GetReportingAssignedAgent', e);
            return next();
        }
    }
    function GetReportingAssignedAgent_Handler(uid, obj_agent_summary, res) {
        let current_date = moment().format('YYYYMMDD');
        if (obj_agent_summary.Team.POSP !== null &&
                obj_agent_summary.Team.DSA !== null &&
                obj_agent_summary.Team.CSE !== null
                ) {
            fs.writeFile(appRoot + "/tmp/cachemaster/user_team_" + uid + "_" + current_date + ".log", JSON.stringify(obj_agent_summary), function (err) {
                if (err) {
                    return console.error(err);
                }
            });
            res.json(obj_agent_summary);
        }
    }
    app.get('/posps/dsas/list_by_rmid/:rm_uid', function (req, res) {
        let rm_uid = req.params.rm_uid - 0;
        var Posp = require('../models/posp');
        let obj_agent = {
            'user_type': '',
            'status': 'NA',
            'POSP': null,
            'EMP': null
        };
        Posp.find({"Reporting_Agent_Uid": rm_uid, 'Is_Active': true}).select('Fba_Id Ss_Id Email_Id Erp_Id First_Name Last_Name').exec(function (err, dbPosp) {
            if (err) {
                obj_agent['POSP'] = err;
            } else {
                if (dbPosp) {
                    obj_agent['POSP'] = [];
                    for (let k in dbPosp) {
                        obj_agent['POSP'].push({
                            'user_type': 'POSP',
                            'ss_id': dbPosp[k]._doc['Ss_Id'],
                            'fba_id': dbPosp[k]._doc['Fba_Id'],
                            'erp_id': dbPosp[k]._doc['Erp_Id'],
                            'email': dbPosp[k]._doc['Email_Id'],
                            'name': titleCase(dbPosp[k]._doc['First_Name'] + ' ' + dbPosp[k]._doc['Last_Name'])
                        });
                    }
                } else {
                    obj_agent['POSP'] = 'NA';
                }
            }
            posps_dsas_list_by_rmid_handler(obj_agent, res);
        });
        var Employee = require('../models/employee');
        Employee.find({"UID": rm_uid, 'Role_ID': {$in: [29, 34, 35, 39, 41]}, 'IsActive': 1}).select('FBA_ID Emp_Id Email_Id Emp_Name VendorCode').exec(function (err, dbEmployee) {
            if (err) {
                obj_agent['EMP'] = err;
            } else {
                if (dbEmployee) {
                    obj_agent['EMP'] = [];
                    for (let k in dbEmployee) {
                        obj_agent['EMP'].push({
                            'user_type': 'FOS',
                            'ss_id': dbEmployee[k]._doc['Emp_Id'],
                            'fba_id': dbEmployee[k]._doc['FBA_ID'],
                            'erp_id': dbEmployee[k]._doc['VendorCode'],
                            'email': dbEmployee[k]._doc['Email_Id'],
                            'name': titleCase(dbEmployee[k]._doc['Emp_Name'])
                        });
                    }
                } else { // for invalid agent id
                    obj_agent['EMP'] = 'NA';
                }
            }
            posps_dsas_list_by_rmid_handler(obj_agent, res);
        });
    });
    
    app.get('/posps/fetch_all/user_disposition_data', function (req, res) {
        try {
            var user_disposition = require('../models/posp_disposition');
            let agg = [
                {"$group": {
                        "_id": "$Disposition_Id",
                        "Status": {"$last": "$Status"},
                        "Sub_Status": {"$last": "$Sub_Status"},
                        "Remark": {"$last": "$Remark"},
                        "Disposition_By": {"$last": "$Disposition_By"},
                        "Next_Call_Date": {"$last": "$Next_Call_Date"},
                        "Disposition_On": {"$last": "$Created_On"}
                    }
                },
                {$project: {
                        "_id": 0, "Disposition_Id": "$_id", "Status": 1, "Sub_Status": 1, "Remark": 1, "Disposition_By": 1, "Next_Call_Date": 1, "Disposition_On": 1
                    }
                }
            ];
            user_disposition.aggregate(agg, function (db_alluser_disposition_err, db_alluser_disposition) {
                if (db_alluser_disposition_err) {
                    res.json(db_alluser_disposition_err);
                } else {
                    res.json(db_alluser_disposition);
                }
            });
        } catch (e) {
            res.json({"Status": "Error", "Msg": e.stack});
        }
    });

app.get('/posps/get_user_disposition_data/:id', function (req, res) {
        try {
            var id = parseInt(req.params.id);
            var user_disposition = require('../models/posp_disposition');
            user_disposition.find({"Disposition_Id": id}, function (dbuser_disposition_err, dbuser_disposition) {
                if (dbuser_disposition_err) {
                    res.json(dbuser_disposition_err);
                } else {
                    dbuser_disposition.sort((a, b) => b.Created_On - a.Created_On);
                    res.json(dbuser_disposition);
                }
            });
        } catch (e) {
            res.json({"Status": "Error", "Msg": e.stack});
        }
    });
    
    function posps_dsas_list_by_rmid_handler(objAgent, res) {
        try {
            if (objAgent['POSP'] !== null && objAgent['EMP'] !== null) {
                res.json(objAgent);
            }
        } catch (e) {
            console.error('posps_dsas_list_by_rmid_handler', objAgent, e);
            res.send(e.stack);
        }
    }
}
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
function titleCase(str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
        str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
}
function swap(json) {
    var ret = {};
    for (var key in json) {
        ret[json[key]] = key;
    }
    return ret;
}
