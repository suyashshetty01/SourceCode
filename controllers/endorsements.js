/* Author: Piyush Singh
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var Base = require('../libs/Base');
var config = require('config');
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var MongoClient = require('mongodb').MongoClient;
var moment = require('moment');
var online_endorsement = require('../models/online_endorsement.js');
var user_details = require('../models/user_details');
var Ticket = require('../models/ticket');
var Client = require('node-rest-client').Client;
var insurer_url_api = {
    '44': 'godigit_online_endorsement'
};
var endorsementSubCategoryObjOld = {
    "33": "Address Correction",
    "34": "CNG",
    "35": "Contact Number",
    "36": "Cubic Capacity",
    "37": "Correction In Policy Inception",
    "38": "Correction In RTO",
    "39": "Date of Birth",
    "40": "Correction In Email Id",
    "41": "Correction In Engine And Chassis",
    "42": "GST number updation",
    "43": "Hypothecation",
    "44": "IDV",
    "45": "Make & Model",
    "47": "Name Correction",
    "48": "No Claim Bonus",
    "49": "Nominee Name",
    "50": "PA Cover",
    "52": "Transfer Of Ownership",
    "53": "Registration Number",
    "71": "Correction in Policy Period",
    "72": "Change in NCB Percentage",
    "73": "Previous Insurer Change/Updation",
    "85": "Mfg. Year",
    "92": "Policy with wrong Broker code",
    "93": "Policy without Broker code"
};
var endorsementSubCategoryObj = {
    "Address Correction": 33,
    "CNG": 34,
    "Contact Number": 35,
    "Cubic Capacity": "36",
    "Correction In Policy Inception": 37,
    "Correction In RTO": 38,
    "Date of Birth": 39,
    "Correction In Email Id": 40,
    "Correction In Engine And Chassis": 41,
    "GST number updation": 42,
    "Hypothecation": 43,
    "IDV": 44,
    "Make & Model": 45,
    "Name Correction": 47,
    "No Claim Bonus": 48,
    "Nominee Name": 49,
    "PA Cover": 50,
    "Transfer Of Ownership": 52,
    "Registration Number": 53,
    "Correction in Policy Period": 71,
    "Change in NCB Percentage": 72,
    "Previous Insurer Change/Updation": 73,
    "Mfg. Year": 85,
    "Policy with wrong Broker code": 92,
    "Policy without Broker code": 93
};
module.exports.controller = function (app) {
    
    app.post('/endorsements/online_endorsements', function (req, res) {
        try {
            var ObjRequest = req.body || {};
            var insurer_id = (ObjRequest.insurer_id && (ObjRequest.insurer_id - 0)) || 0;
            var insurer_api_name = insurer_url_api[insurer_id];
            //var endorsement_subcategory_type = (ObjRequest.endorsement_subcategory_type && endorsementSubCategoryObj[ObjRequest.endorsement_subcategory_type]) || '';
            //var endorsement_subcategory_type = (ObjRequest.subcategory && endorsementSubCategoryObj[ObjRequest.subcategory]) || '';
            if(insurer_api_name){
                var client = new Client();
            var insurer_api_url = ((config.environment.name === 'Production') ? config.environment.weburl + '/endorsements/' + insurer_url_api[insurer_id] : config.environment.weburl + '/endorsements/' + insurer_url_api[insurer_id]);
            let insurer_args = {
                data: ObjRequest,
                headers: {
                    "Content-Type": "application/json"
                }
            };
            client.post(insurer_api_url, insurer_args, function (data, response) {
                if (data && data.Status === "SUCCESS") {
                    res.json({"Status": "SUCCESS", "Msg": data.Msg, "Data": data.Data});
                } else {
                    res.json({"Status": "FAIL", "Msg": data.Msg, "Data": data.Data});
                }
            });
            }else{
                res.json({"Status": "FAIL", "Msg": "Online Endorsement Process Not Yet Implemented", "Data": {}});
            }
            
        } catch (ex) {
            console.error('Exception in -/online_endorsements service');
            res.json({"Error": "EXCEPTION IN /online_endorsements service SERVICE", "Msg": ex.stack, "Status": "FAIL"});
        }
    });
    
    app.post('/endorsements/godigit_online_endorsement', function (req, res) {
        try {
            var baseObj = new Base();
            var client = new Client();
            var ObjRequest = req.body || {};
            var todayDate = moment().format("YYYY-MM-DDTHH:mm:ss[Z]");
            var endorsement_subcategory_type = ObjRequest.subcategory ? endorsementSubCategoryObj[ObjRequest.subcategory] - 0 : 0;
            var updated_erpqt_data = ObjRequest.updated_qt_data || {};
            var policy_number = ObjRequest['policy_number'] ? ObjRequest['policy_number'] : "";
            var processed_erpqt = {};
            var godigit_endorsement_url = ((config.environment.name === 'Production') ? 'https://preprod-digitpolicyissuance.godigit.com/endo/v1/g91/endorsement/' + policy_number + '?source=CD' : 'https://preprod-digitpolicyissuance.godigit.com/endo/v1/g91/endorsement/' + policy_number + '?source=CD');
            var username = ((config.environment.name !== 'Production') ? '51197558' : '51197558');
            var password = ((config.environment.name !== 'Production') ? 'digit123' : 'digit123');
            var insurer_request;
            //var json_file_path = appRoot + "/resource/request_file/Endorsement/GoDigit.json";
            //var jsonPol = fs.readFileSync(json_file_path, 'utf8');
            for (var k in updated_erpqt_data) {
                processed_erpqt['___' + k + '___'] = updated_erpqt_data[k] ? updated_erpqt_data[k] : "";
            }
            console.log(processed_erpqt);
            console.log(godigit_endorsement_url);
            if (endorsement_subcategory_type === 33) {/** Address */
                insurer_request = {
                    "person": [
                        {
                            "addresses": [
                                {
                                    "addressType": "PRIMARY_RESIDENCE",
                                    "streetNumber": "SO",
                                    "street": "___permanent_address_1___ ___permanent_address_2___ ___permanent_address_3___",
                                    "city": "___permanent_city___",
                                    "country": "IN",
                                    "pincode": "___permanent_pincode___"
                                },
                                {
                                    "addressType": "SECONDARY_RESIDENCE",
                                    "streetNumber": "SO",
                                    "street": "___communication_address_1___ ___communication_address_2___ ___communication_address_3___",
                                    "city": "___communication_city___",
                                    "country": "IN",
                                    "pincode": "___communication_pincode___"
                                }
                            ]
                        }
                    ]
                };
            } else if (endorsement_subcategory_type === 35) {/** Mobile */
                insurer_request = {
                    "person": [
                        {
                            "communications": [
                                {
                                    "isPrefferedCommunication": true,
                                    "communicationType": "MOBILE",
                                    "communicationId": "___mobile___"
                                }
                            ]
                        }
                    ]
                };
            } else if (endorsement_subcategory_type === 40) {/** Email */
                insurer_request = {
                    "person": [
                        {
                            "communications": [
                                {
                                    "isPrefferedCommunication": true,
                                    "communicationType": "EMAIL",
                                    "communicationId": "___email___"
                                }
                            ]
                        }
                    ]
                };
            } else if (endorsement_subcategory_type === 49) {/** Nominee */
                insurer_request = {
                    "person": [],
                    "nominee": {
                        "firstName": "___nominee_first_name___",
                        "lastName": "___nominee_last_name___",
                        "dateOfBirth": "___nominee_birth_date___",
                        "relation": "___nominee_relation___"
                    }
                };
            }
            insurer_request = JSON.stringify(insurer_request);
            insurer_request = insurer_request.replaceJson(processed_erpqt);
            insurer_request = JSON.parse(insurer_request);
            console.log(insurer_request);
            var save_obj = {
                "Ticket_Id": ObjRequest.ticket_id || "",
                "CRN": ObjRequest.crn || 0,
                "Insurer_Id": ObjRequest.insurer_id || 0,
                "Product_Id": ObjRequest.product_id || 0,
                "Category": ObjRequest.category || "",
                "Sub_Category": ObjRequest.subcategory || "",
                "Insurer_Request": insurer_request,
                "Insurer_Response": "",
                "Created_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]"),
                "Modified_On": moment().format("YYYY-MM-DDTHH:mm:ss[Z]")
            };
            let args = {
                data: insurer_request,
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": config.environment.name === 'Production' ? '' : 'OWPNXSTG8TCBFQMB7G0BW3NQR4QT1W55'
                }
            };
            client.put(godigit_endorsement_url, args, function (data, response) {
                save_obj['Insurer_Response'] = data;
                if (data && data.status && data.link) {
                    /** Also Update erp_qt_data in user_datas collection and initiate pdf*/
                    /** save to db*/
                    save_obj['Status'] = "Success";
                    online_endorsement_obj = new online_endorsement(save_obj);
                    online_endorsement_obj.save(function (err, dbEndorsedData) {
                        if (err) {
                            res.json({"Status": "FAIL", "Msg": "Error Occurred While Saving in Online Endorsement Collection", "Data": err});
                        } else {
                            /** also update status and remark in userdatas collection*/

                            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                                if (err)
                                    throw err;
                                var tickets = db.collection('tickets');
                                tickets.findOne({"Ticket_Id": ObjRequest.ticket_id}, {sort: {"Modified_On": -1}}, function (err, dbticket) {
                                    dbticket['Status'] = 'Resolved';
                                    dbticket['Remark'] = 'Through Online Endorsement';
                                    dbticket['Modified_On'] = new Date();
                                    dbticket['Modified_By'] = ObjRequest.modified_by;
                                    delete dbticket['_id'];
                                    tickets.insertOne(dbticket, function (err, res1) {
                                        if (err)
                                            throw err;
                                        if (res1["insertedCount"] > 0) {
                                            var user_details = db.collection('user_details');
                                            var updateObj = {
                                                "Modified_By": ObjRequest.modified_by,
                                                "Status": 'Resolved',
                                                "Modified_On": todayDate,
                                                "Remark": 'Through Online Endorsement'
                                            };
                                            user_details.update({'Ticket_code': ObjRequest.ticket_id}, {$set: updateObj}, function (err, numAffected) {
                                                console.log('user_detailsUpdate', err, numAffected);
                                            });
                                        }
                                    });
                                });

                            });
                            res.json({"Status": "SUCCESS", "Msg": "Endorsement Data Updated Successfully.", "Data": dbEndorsedData});
                        }
                    });

                } else {
                    /** save to db*/
                    save_obj['Status'] = "Fail";
                    online_endorsement_obj = new online_endorsement(save_obj);
                    online_endorsement_obj.save(function (err, dbEndorsedData) {
                        if (err) {
                            res.json({"Status": "FAIL", "Msg": "Error Occurred While Saving in Online Endorsement Collection", "Data": err});
                        } else {
                            res.json({"Status": "FAIL", "Msg": "Failed to Update Endorsement Data", "Data": dbEndorsedData});
                        }
                    });
                }
            });
        } catch (ex) {
            console.error('Exception in -/endorsements/godigit_online_endorsement service');
            res.json({"Error": "EXCEPTION IN /endorsements/godigit_online_endorsement service SERVICE", "Msg": ex.stack, "Status": "FAIL"});
        }
    });
    
    app.post('/endorsements/online_endorsement_list', function (req, res) {
        try {
            var objBase = new Base();
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
            var filter = obj_pagination.filter;
            //filter data if any
            if (req && req.body && req.body.fromDate && req.body.toDate && req.body.fromDate !== '' && req.body.toDate !== '') {
                var fromDate = moment(req.body["fromDate"]).format("YYYY-MM-D");
                var toDate = moment(req.body["toDate"]).format("YYYY-MM-D");
                var arrFrom = fromDate.split('-');
                var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);
                var arrTo = toDate.split('-');
                var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
                dateTo.setDate(dateTo.getDate() + 1);
                console.log('DateRange', 'from', dateFrom, 'to', dateTo);
                filter["Created_On"] = {$gte: dateFrom, $lt: dateTo};
            }
            if (req && req.body && req.body.search_by && req.body.search_by !== '') {
                if (['Ticket_Id'].indexOf(req.body.search_by) > -1 && req.body.search_byvalue && req.body.search_byvalue !== '') {
                    filter[req.body.search_by] = new RegExp(req.body['search_byvalue'], 'i');
                } else if (['Endorsement_Id','Product_Id', 'CRN', 'Insurer_Id'].indexOf(req.body.search_by) > -1 && req.body.search_byvalue && req.body.search_byvalue !== '') {
                    filter[req.body.search_by] = req.body['search_byvalue'] - 0;
                } else {

                }
            }
            var online_endorsement = require('../models/online_endorsement');
            online_endorsement.paginate(filter, optionPaginate).then(function (data) {
                res.json(data);
            });
        } catch (ex) {
            console.error("Exception in - /online_endorsement_list", ex.stack);
            res.json({'Status': 'Error', 'Msg': ex.stack});
        }
    });
    
    
    app.post('/endorsements/online_endorsement_log', function (req, res) {
        try {            
            let filter = [
//                {
//                    "$match": {
//                        "Created_On": {
//                            "$gte": "2024-01-25T18:30:00.000Z",
//                            "$lte": "2024-02-09T18:29:59.999Z"
//                        }
//                    }
//                },
                {
                    "$group": {
                        "_id": {
                            "$dateToString": {
                                "format": "%Y-%m-%d",
                                "date": "$Created_On"
                            }
                        },
                        "Total_Count": {
                            "$sum": 1
                        },
                        "Success_Count": {
                            "$sum": {
                                "$cond": {
                                    "if": {
                                        "$eq": [
                                            "$Status",
                                            "Success"
                                        ]
                                    },
                                    "then": 1,
                                    "else": 0
                                }
                            }
                        },
                        "Fail_Count": {
                            "$sum": {
                                "$cond": {
                                    "if": {
                                        "$eq": [
                                            "$Status",
                                            "Fail"
                                        ]
                                    },
                                    "then": 1,
                                    "else": 0
                                }
                            }
                        }
                    }
                },
                {
                    "$project": {
                        "_id": 0,
                        "Payout_Query_Date": "$_id",
                        "Total_Count": 1,
                        "Success_Count": 1,
                        "Fail_Count": 1,
                        "Success_Percent": {
                            "$multiply": [
                                {
                                    "$divide": [
                                        "$Success_Count",
                                        "$Total_Count"
                                    ]
                                },
                                100
                            ]
                        }
                    }
                },
                {
                    "$sort": {
                        "Payout_Query_Date": -1
                    }
                }
            ];
            var online_endorsement = require('../models/online_endorsement');
            console.error(filter);
            online_endorsement.aggregate(filter,function(online_endorsement_err,online_endorsement_data){
               if(online_endorsement_err) {
                   res.json({"Status":"Fail","Msg":"Error occurred while fetching data from collection.","Error":online_endorsement_err});
               }else{
                   console.error(online_endorsement_data);
                   res.json(online_endorsement_data);
               }
            });
        } catch (ex) {
            console.error("Exception in - /online_endorsement_list", ex.stack);
            res.json({'Status': 'Error', 'Msg': ex.stack});
        }
    });
};
