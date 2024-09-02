var config = require('config');
var Base = require('../libs/Base');
var mongoose = require('mongoose');
let Email = require('../models/email');
var prospect_npos_activation = require('../models/prospect_npos_activation');
var moment = require('moment');
var path = require('path');
var fs = require('fs');
var appRoot = path.dirname(path.dirname(require.main.filename));
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true});

module.exports.controller = function (app) {
    app.post('/prospect_npos_activation/add_loyalty_activation_user', function (req, res) {
        let objSummary = {
            "Status": "",
            "Msg": "",
            "Data": ""
        };
        try {
            let objRequest = req.body;
            let is_allow = true;
            let error_msg = "";
            let arr_msg = [];
            if (["", "NA", null, undefined, 0].indexOf(objRequest.Ss_Id) > -1) {
                arr_msg.push("Ss_Id :: INVALID");
            }
            if (["", "NA", null, undefined, 0].indexOf(objRequest.Erp_Id) > -1) {
                arr_msg.push("Erp_Id :: INVALID");
            }
            if (arr_msg.length > 0) {
                is_allow = false;
                error_msg = arr_msg.join("<BR>");
            }
            if (is_allow) {
                prospect_npos_activation.find({Ss_Id: objRequest.Ss_Id}, function (prospect_npos_activation_err, prospect_npos_activation_data) {
                    if (prospect_npos_activation_err) {
                        objSummary['Status'] = 'FAIL';
                        objSummary['Msg'] = 'ERROR IN RECORD FOUND';
                        objSummary['Data'] = prospect_npos_activation_err;
                        res.json(objSummary);
                    } else {
                        if (prospect_npos_activation_data.length > 0) {
                            objSummary['Status'] = 'SUCCESS';
                            objSummary['Msg'] = 'ALREADY EXISTS';
                            objSummary['Data'] = prospect_npos_activation_data;
                            res.json(objSummary);
                        } else {
                            let prospect_npos_activation_args = {
                                "Ss_Id": objRequest.Ss_Id,
                                "Erp_Id": objRequest.Erp_Id,
                                "Created_On": new Date(),
                                "Modified_On": new Date()
                            };
                            let prospect_npos_activationObj = new prospect_npos_activation(prospect_npos_activation_args);
                            prospect_npos_activationObj.save(function (save_error, save_data) {
                                if (save_error) {
                                    objSummary['Status'] = 'FAIL';
                                    objSummary['Msg'] = 'ERROR IN SAVE RECORD';
                                    objSummary['Data'] = save_error;
                                    res.json(objSummary);
                                } else {
                                    objSummary['Status'] = 'SUCCESS';
                                    objSummary['Msg'] = 'SAVE SUCCESSFULLY';
                                    objSummary['Data'] = save_data;
                                    res.json(objSummary);
                                }
                            });
                        }
                    }
                });
            } else {
                objSummary['Status'] = 'FAIL';
                objSummary['Msg'] = error_msg;
                res.json(objSummary);
            }
        } catch (e) {
            objSummary['Status'] = 'FAIL';
            objSummary['Msg'] = 'EXCEPTION IN API';
            objSummary['Data'] = e.stack;
            res.json(objSummary);
        }
    });
    app.post('/prospect_npos_activation/update_loyalty_activation', function (req, res) {
        var formidable = require('formidable');
        let form = new formidable.IncomingForm();
        try {
            form.parse(req, function (err, fields, files) {
                var prospect_npos_activation = require('../models/prospect_npos_activation');
                var posp_user = require('../models/posp_users.js');
                var ss_id = fields.Ss_Id || "";
                var activated_by = fields.activated_by || "";
                var motor = fields.Motor && JSON.parse(fields.Motor) || {};
                var health = fields.Health && JSON.parse(fields.Health) || {};
                var other = fields.Other && JSON.parse(fields.Other) || {};
                var covers = fields.covers && JSON.parse(fields.covers) || {};
                if (ss_id && (Object.keys(motor).length > 0 || Object.keys(health).length > 0 || Object.keys(other).length > 0)) {
                    var files = files;
                    if (JSON.stringify(files) !== "{}") {
                        if (!fs.existsSync(appRoot + "/tmp/loyalty_activation/" + ss_id)) {
                            fs.mkdirSync(appRoot + "/tmp/loyalty_activation/" + ss_id);
                        }
                        for (let i in files) {
                            let file_name = (files[i].name).replace(/ +/g, "");
                            let file_ext = file_name.split('.').pop();
                            file_name = (file_name.substr(0, file_name.lastIndexOf('.'))) + "_" + ss_id + "." + file_ext;
                            let write_path = "";
                            let download_path = "";

                            if (i === "motor_policy") {
                                if (!fs.existsSync(appRoot + "/tmp/loyalty_activation/" + ss_id + "/Motor")) {
                                    fs.mkdirSync(appRoot + "/tmp/loyalty_activation/" + ss_id + "/Motor");
                                }
                                write_path = appRoot + "/tmp/loyalty_activation/" + ss_id + "/Motor/" + file_name;
                                download_path = config.environment.downloadurl + "/loyalty_activation/" + ss_id + "/Motor/" + file_name;
                                motor["motor_policy"] = download_path;
                            } else if (i === "health_policy") {
                                if (!fs.existsSync(appRoot + "/tmp/loyalty_activation/" + ss_id + "/Health")) {
                                    fs.mkdirSync(appRoot + "/tmp/loyalty_activation/" + ss_id + "/Health");
                                }
                                write_path = appRoot + "/tmp/loyalty_activation/" + ss_id + "/Health/" + file_name;
                                download_path = config.environment.downloadurl + "/loyalty_activation/" + ss_id + "/Health/" + file_name;
                                health["health_policy"] = download_path;
                            } else {
                                if (!fs.existsSync(appRoot + "/tmp/loyalty_activation/" + ss_id + "/Other")) {
                                    fs.mkdirSync(appRoot + "/tmp/loyalty_activation/" + ss_id + "/Other");
                                }
                                if (!fs.existsSync(appRoot + "/tmp/loyalty_activation/" + ss_id + "/Other/" + i)) {
                                    fs.mkdirSync(appRoot + "/tmp/loyalty_activation/" + ss_id + "/Other/" + i);
                                }
                                write_path = appRoot + "/tmp/loyalty_activation/" + ss_id + "/Other/" + i + "/" + file_name;
                                download_path = config.environment.downloadurl + "/loyalty_activation/" + ss_id + "/Other/" + i + "/" + file_name;
                                other[i]["policy"] = download_path;
                            }
                            let oldpath = files[i].path;
                            let read_data = fs.readFileSync(oldpath, {});
                            fs.writeFileSync(write_path, read_data, {});
                            fs.unlink(oldpath, function (err) {
                                if (err)
                                    res.json({'Status': "FAIL", 'Msg': "ERROR_IN_DELETING_FILE", "data": err});
                            });
                        }
                    }
                    var loyalty_activation_obj = {
                        "Is_Loyalty_Activated": "Yes",
                        "Is_PA": covers.PA || "",
                        "Is_RSA": covers.RSA || "",
                        "Is_Rodent": covers.Rodent || "",
                        "Is_Tyre": covers.Tyre || "",
                        "Is_Practo": covers.Practo || "",
                        "Is_Other": covers.Other || "",
                        "Motor_Policy_Details": motor,
                        "Health_Policy_Details": health,
                        "Other_Policy_Details": other,
                        "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                    };

                    prospect_npos_activation.update({'Ss_Id': ss_id}, {$set: loyalty_activation_obj}, {runValidators: true}, function (loyalty_activation_update_err, numAffected) {
                        if (loyalty_activation_update_err) {
                            res.json({Status: 'FAIL', "Msg": "ERROR_IN_UPDATING_LOYALTY_ACTIVATION", "Error": loyalty_activation_update_err});
                        } else {
                            let args = {
                                "Is_User_Active": "Yes",
                                "User_Activated_By" : activated_by,
                                "User_Activated_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
                            };
                            console.log("args : ", args);
                            posp_user.update({'Ss_Id': ss_id - 0}, {$set: args}, {runValidators: true}, function (posp_user_update_err, numAffected) {
                                if (posp_user_update_err) {
                                    res.json({"Status": "FAIL", "Msg": posp_user_update_err});
                                } else {
                                    if (numAffected && numAffected.ok === 1) {
                                        let objModelEmail = new Email();
                                        let mail_content = '<html><body><p>Hello, POSP</p>'
                                                + '<p>Your activation done successfully!!!</p>'
                                                + 'Regards,<br/>'
                                                + 'Landmark Insurance Brokers Pvt. Ltd.<br/>'
                                                + '<b> Contact</b> : 18004194199 <br/>'
                                                + '<img src="https://www.policyboss.com/website/Images/PolicyBoss-Logo.jpg"><br/><br/>'
                                                + '</p></body></html>';
                                        let arr_cc = [];
                                        let arr_bcc = [];
                                        let arr_to = ['nilam.bhagde@policyboss.com', 'roshani.prajapati@policyboss.com'];
                                        objModelEmail.send('customercare@policyboss.com', arr_to.join(','), "[POSP-ONBOARDING] LOYALTY ACTIVATION SSID : " + ss_id, mail_content, arr_cc.join(','), arr_bcc.join(','), '');
                                        console.log("Mail sent");
                                    }
                                    res.json({'Status': 'SUCCESS', 'Msg': 'LOYALTY_ACTIVATION_UPDATED_SUCCESSFULLY', 'Data': loyalty_activation_obj});
                                }
                            });
                        }
                    });
                } else {
                    res.json({Status: 'FAIL', "Msg": "SS_ID_OR_POLICY_DETAILS_NOT_FOUND", "Error": fields});
                }
            });
        } catch (ex) {
            res.json({Status: 'FAIL', 'Msg': "EXCEPTION_IN_LOYALTY_ACTIVATION", "Error": ex.stack});
        }

    });
    app.post("/prospect_npos_activation/get_details", function (req, res) {
        try {
            var objBase = new Base();
            console.log("req.body : ", req.body);
            var obj_pagination = objBase.jqdt_paginate_process(req.body);
            var optionPaginate = {
                sort: {'Created_On': -1},
                lean: true,
                page: 1,
                limit: 10
            };
            if (obj_pagination) {
                optionPaginate['page'] = obj_pagination.paginate.page;
                optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
            }
            let objRequest = req.body;
            var today = moment().format("YYYY-MM-DD");
            var fromDate = moment(objRequest.start_date ? objRequest["start_date"] : today ).format("YYYY-MM-DD");
            var toDate = moment(objRequest.end_date ? objRequest["end_date"] : today).add(1, 'd').format("YYYY-MM-DD");            
            let filter = obj_pagination.filter;
              if (objRequest.search_by) {
                filter[objRequest.search_by] = objRequest.search_byvalue;
            }
            filter['Created_On'] = {"$gte" : fromDate, "$lt": toDate};

            prospect_npos_activation.paginate(filter, optionPaginate).then(function (user_datas) {
                res.json(user_datas);
            });

        } catch (e) {
            res.json({"Status": "FAIL", "Msg": "EXCEPTION IN API", "Data": e.stack});
        }
    });
    app.get('/prospect_npos_activation/getInsurer/:product_id', function (req, res) {
        var product_id = req.params.product_id - 0 || 0;
        var insurerList = {};
        var Insurer = require('../models/insurer');
        Insurer.find({Product_Id: {$in: [product_id]}}).select(['Insurer_ID', 'Insurer_Code']).sort({'Insurer_Name': 1}).exec(function (insurer_find_err, insurer_data) {
            try {
                if (insurer_find_err) {
                    res.json({'Status': 'FAIL', 'Msg': "NO_DETAILS_FOUND", 'Data': insurer_find_err});
                } else {
                    console.log("insurer_data : ", insurer_data);
                    if (insurer_data.length > 0) {
                        console.log("insurer_data : ", insurer_data);
                        for (var inscount in insurer_data) {
                            var insurerListData = [];
                            insurerListData = insurer_data[inscount]._doc;
                            insurerList[inscount] = {
                                "Insurer_ID": insurerListData.Insurer_ID,
                                "Insurer_Code": insurerListData.Insurer_Code
                            };
                            console.log("insurerList : ", insurerList);
                        }
                    }
                    res.json(insurerList);
                }
            } catch (e) {
                console.log("npos get actor insurer list", e.stack);
                res.json({"Status": "FAIL", "Msg": "EXCEPTION_IN_NPOS_GET_INSURER", "Error": e.stack});
            }
        });

    });
    app.all('/loyalty_activation/:folder1/:folder2/:folder3?/:file', function (req, res) {
        let folder1 = req.params.folder1 || "";
        let folder2 = req.params.folder2 || "";
        let folder3 = req.params.folder3 || "";
        let file = req.params.file;
        if (folder2 === 'Other') {
            res.sendFile(path.join(appRoot + '/tmp/loyalty_activation/' + folder1 + '/' + folder2 + '/' + folder3 + '/' + file));
        } else {
            res.sendFile(path.join(appRoot + '/tmp/loyalty_activation/' + folder1 + '/' + folder2 + '/' + file));
        }
    });
    app.get('/prospect_npos_activation/get_activation_loyalty_data', (req, res) => {
        try {
            let objReqQry = req.query;
            let ss_id = objReqQry.ss_id && (objReqQry.ss_id - 0) || "";
            if (ss_id) {
                prospect_npos_activation.find({"Ss_Id": ss_id}, function (err, loyaltyData) {
                    if (err) {
                        res.json({'Status': 'FAIL', 'Msg': "NO_DETAILS_FOUND", 'Data': err});

                    } else {
                        res.json({'Status': 'SUCCESS', 'Msg': "DETAILS_FETCHED_SUCCESSFULLY", 'Data': loyaltyData});
                    }
                });
            } else {
                res.json({'Status': 'FAIL', 'Msg': "SSID_MISSING", 'Data': objReqQry});
            }
        } catch (ex) {
            res.json({Status: 'FAIL', 'Msg': "get_activation_loyalty_data", "Error": ex.stack});
        }
    });
};