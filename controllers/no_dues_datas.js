/* Author: Roshani Prajapati
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

let config = require('config');
let mongoose = require('mongoose');
let Base = require('../libs/Base');
let MongoClient = require('mongodb').MongoClient;
let no_dues_data = require('../models/no_dues_data');
let no_dues_history = require('../models/no_dues_history');
var moment = require('moment');
var path = require('path');
var fs = require('fs');
var appRoot = path.dirname(path.dirname(require.main.filename));
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database

module.exports.controller = function (app) {
    app.get('/no_dues_data/get_users/:uid', function (req, res) {
        try {
            let uid = req.params.uid ? parseInt(req.params.uid) : "";
            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                if (err)
                    throw err;
                let users = db.collection('users');
                users.find({'UID': uid}).toArray(function (err, dbresult) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        if (dbresult) {
                            res.send(dbresult);
                        } else {
                            res.json({"Status": "Fail", "Msg": err});
                        }
                    }
                    db.close();
                });
            });
        } catch (ex) {
            console.error('Exception', '/no_dues_data/get_users', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/no_dues_data/get_no_dues_emp_details/:Employee_UID', function (req, res) {
        try {
            let Employee_UID = req.params.Employee_UID ? parseInt(req.params.Employee_UID) : "";
                no_dues_data.find({"Employee_UID": Employee_UID}, function (err, dbresult) {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        if (dbresult) {
                            res.json({"Status": "Success", "Data": dbresult});
                        } else {
                            res.json({"Status": "Fail", "Msg": err});
                        }
                    }
                    
                });
        } catch (ex) {
            console.error('Exception', '/no_dues_data/get_users', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/no_dues_data/add_employee', function (req, res) {
        try {
            let ObjRequest = req.body;
            let Employee_UID = req.body.Employee_UID ? parseInt(req.body.Employee_UID) : "";
            no_dues_data.find({"Employee_UID": Employee_UID}, function (err, get_emp_data) {
                if (get_emp_data.length > 0) {
                    res.json({"Status": "Success", "Msg": "Employee Already Exist"});
                } else {
                    let integer_data_save = ["Employee_UID", "Employee_Code"];
                    let save_data = {};
                    for (let i in ObjRequest) {
                        if (integer_data_save.includes(i)) {
                            save_data[i] = parseInt(ObjRequest[i]);
                        } else {
                            save_data[i] = ObjRequest[i];
                        }
                    }
                    save_data['Created_On'] = new Date();
                    save_data['Modified_On'] = new Date();
                    let no_dues_datas = new no_dues_data(save_data);
                    no_dues_datas.save(function (err, res1) {
                        if (err) {
                            res.json({"Status": "Fail", "Msg": err});
                        } else {
                            res.json({"Status": "Success", "Msg": "Data Inserted successfully"});
                        }
                    });
                }
            });
        } catch (ex) {
            console.error('Exception', '/no_dues_data/add_employee', ex);
            res.json({"Msg": "Fail", "data": ex.stack});
        }
    });
    app.post('/no_dues_datas/no_dues_list', function (req, res) {
        try {
            let objBase = new Base();
            let obj_pagination = objBase.jqdt_paginate_process(req.body);
            let optionPaginate = {
                sort: {'Created_On': -1},
                lean: true,
                page: 1,
                limit: 10
            };
            if (obj_pagination) {
                optionPaginate['page'] = obj_pagination.paginate.page;
                optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
            }
            let filter = obj_pagination.filter;
            if(req.body.Employee_UID && req.body.Employee_UID !== ""){
                filter["Employee_UID"] = req.body.Employee_UID;
            }
            no_dues_data.paginate(filter, optionPaginate, function (err, collection) {
                if (err) {
                    res.json({"Msg": err, "Status": "FAIL"});
                } else {
                    res.json(collection);
                }
            });
        } catch (ex) {
            console.error('Exception', '/no_dues_datas/no_dues_list', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.post('/no_dues_data/add_approver_details', function (req, res) {
        try {
            let ObjRequest = req.body;
            let no_dues_id = ObjRequest.No_Dues_ID - 0;
            let save_data = {
                "No_Dues_ID": ObjRequest.No_Dues_ID,
                "Approver_Employee_Name": ObjRequest.Approver_Employee_Name,
                "Approver_Employee_UID": parseInt(ObjRequest.Approver_Employee_UID),
                "Employee_UID": parseInt(ObjRequest.Employee_UID),
                "Employee_Code": parseInt(ObjRequest.Employee_Code),
                "Verify_SSID": parseInt(ObjRequest.Verify_SSID),
                "Verify_Type": ObjRequest.Verify_Type,
                "Verify_Status": ObjRequest.Verify_Status,
                "No_Dues_Questions": ObjRequest.No_Dues_Questions
            };
            save_data['Created_On'] = new Date();
            save_data['Modified_On'] = new Date();
            let save_no_dues_history = new no_dues_history(save_data);
            save_no_dues_history.save(function (err, res1) {
                if (err) {
                    res.json({"Msg": err, "Status": "FAIL"});
                } else {
                    let update_record = {"No_Dues_ID": no_dues_id};
                    let newData = {};
                    newData['Verified_By_' + ObjRequest.Verify_Type] = parseInt(ObjRequest.Verify_SSID);
                    newData[ObjRequest.Verify_Type + '_Status'] = ObjRequest.Verify_Status;
                    newData['Modified_On'] = new Date();
                    no_dues_data.update(update_record, {$set: newData}, function (err, updatedData) {
                        if (err) {
                            res.json({'Msg': 'Fail'});
                        } else {
                            res.json({"Msg": "Success", "Status": "Data Insterted Successfully"});
                        }
                    });
                }
            });
        } catch (ex) {
            console.error('Exception', '/no_dues_data/add_approver_details', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/no_dues_data/get_no_dues_history/:no_dues_id/:user_type', function (req, res) {
        try {
            let no_dues_id = req.params.no_dues_id ? parseInt(req.params.no_dues_id) : "";
            let user_type = req.params.user_type ? req.params.user_type : "";
            no_dues_history.find({"No_Dues_ID": no_dues_id, "Verify_Type": user_type}).sort({'Modified_On': -1}).exec(function (err, no_dues_db_data) {
                if (err)
                    res.send(err);
                else {
                    if (no_dues_db_data.length > 0) {
                        res.json({"Msg": "Success", "Data": no_dues_db_data});
                    } else {
                        res.json({"Msg": "Fail", "Status": "No Record Found"});
                    }
                }
            });
        } catch (ex) {
            console.error('Exception', '/no_dues_data/get_users', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    app.get('/no_dues_data/get_hr_details', function (req, res) {
        try {
            let no_dues_id = req.query.no_dues_id ? parseInt(req.query.no_dues_id) : "";
            no_dues_data.find({"No_Dues_ID": no_dues_id}, function (err, hr_data) {
                if (err)
                    res.send(err);
                else {
                    if (hr_data.length > 0) {
                        no_dues_history.find({"No_Dues_ID": no_dues_id}, function (err, hr_history_data) {
                            if (err)
                                res.send(err);
                            else {
                                if (hr_history_data.length > 0) {
                                    let empUID;
                                    empUID = hr_history_data[0]._doc["Employee_UID"];
                                    let Client = require('node-rest-client').Client;
                                    let client = new Client();
                                    client.get(config.environment.weburl + '/no_dues_data/get_users/' + empUID, {}, function (hr_users_data, response) {
                                        if (err)
                                            res.send(err);
                                        else {
                                            if (hr_users_data.length > 0) {
                                                let html_file_path = appRoot + "/resource/request_file/exit-clearance-form.html";
                                                let htmlPol = fs.readFileSync(html_file_path, 'utf8');
                                                let file_name = "Exit_Clearance_" + hr_data[0]['_doc'].No_Dues_ID;
                                                let pdf_file_path = appRoot + "/tmp/Exit_Clearance/" + file_name + '.pdf';
                                                let html_pdf_file_path = appRoot + "/tmp/Exit_Clearance/" + file_name + '.html';
                                                var html_web_path_portal = config.environment.downloadurl + "/tmp/Exit_Clearance/" + file_name + '.html';
                                                var approval_type = ["Supervisor_Status", "IRDA_Status", "Administration_Status", "IT_Status", "Finance_Status", "Human_Resource_Status"];
                                                let replace_data = {};
                                                let replace_hr_data = {};
                                                let replace_hr_history = {};
                                                let replace_hr_user_data = {};
                                                for (var i in hr_data[0]['_doc']) {
                                                    if (approval_type.indexOf(i) === -1) {
                                                        replace_hr_data['___' + i + '___'] = hr_data[0][i];
                                                        if (i === "Date_Of_Joining" || i === "Resignation_Date") {
                                                            var tempDate;
                                                            tempDate = hr_data[0][i];
                                                            tempDate = moment(tempDate).format("YYYY-MM-DD");
                                                            replace_data['___' + i + '___'] = tempDate;
                                                        }
                                                    }
                                                    if (approval_type.indexOf(i) > -1) {
                                                        if (hr_data[0][i] === "Approved") {
                                                            replace_hr_data['___' + i + "_Yes" + '___'] = "checked";
                                                        } else {
                                                            replace_hr_data['___' + i + "_No" + '___'] = "checked";
                                                        }
                                                    }
                                                }
                                                for (var m in hr_history_data) {
                                                    for (var j in hr_history_data[m]['_doc']) {
                                                        if (j === "No_Dues_Questions") {
                                                            for (var no_dues_ques in hr_history_data[m]['_doc']['No_Dues_Questions']) {
                                                                replace_hr_history['___' + no_dues_ques + '___'] = hr_history_data[m]['_doc']['No_Dues_Questions'][no_dues_ques];
                                                            }
                                                        } else {
                                                            replace_hr_history['___' + j + '___'] = hr_history_data[m][j];
                                                        }
                                                        if (j === 'Verify_Type') {
                                                            replace_hr_history['___' + hr_history_data[m]['_doc']['Verify_Type'] + '_Approver_Employee_Name___'] = hr_history_data[m]['_doc']['Approver_Employee_Name'];
                                                            replace_hr_history['___' + hr_history_data[m]['_doc']['Verify_Type'] + '_Approver_Employee_UID___'] = hr_history_data[m]['_doc']['Approver_Employee_UID'];
                                                        }
                                                    }
                                                }
                                                for (var k in hr_users_data[0]) {
                                                    replace_hr_user_data['___' + k + '___'] = hr_users_data[0][k];
                                                }
                                                htmlPol = htmlPol.toString().replaceJson(replace_data);
                                                htmlPol = htmlPol.toString().replaceJson(replace_hr_data);
                                                htmlPol = htmlPol.toString().replaceJson(replace_hr_history);
                                                htmlPol = htmlPol.toString().replaceJson(replace_hr_user_data);
                                                htmlPol = htmlPol.replaceAll(/___(.*?)___/g, "");
                                                var request_html_file = fs.writeFileSync(html_pdf_file_path, htmlPol);
                                                try {
                                                    var http = require('https');
//                                                   var insurer_pdf_url = "http://qa.policyboss.com:3000/html2pdf?o=download&u=" + html_web_path_portal;
                                                    var get_pdf_url = config.environment.pdf_url + html_web_path_portal;
//                                                    var insurer_pdf_url = html_web_path_portal;//Local
                                                    var file_horizon = fs.createWriteStream(pdf_file_path);
                                                    var request_horizon = http.get(get_pdf_url, function (response) {
                                                        get_pdf_url = file_horizon.path;
                                                        response.pipe(file_horizon);
                                                        console.error("no_dues_data::PDF URL" + file_horizon);
                                                        console.error("PDF sucess");
                                                    });
                                                } catch (e) {
                                                    console.error('PDF Exception', e);
                                                }
                                                res.json({"Msg": "Success", "html_url": html_web_path_portal, "pdf_url": get_pdf_url});
                                            } else {
                                                res.json({"Msg": "Fail", "Status": "No Record Found"});
                                            }
                                        }
                                    });
                                } else {
                                    res.json({"Msg": "Fail", "Status": "No Record Found"});
                                }
                            }
                        });
                    } else {
                        res.json({"Msg": "Fail", "Status": "No Record Found"});
                    }
                }
            });
        } catch (ex) {
            console.error('Exception', '/get_hr_details/get_users', ex);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
};
