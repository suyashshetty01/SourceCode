/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
var Base = require('../libs/Base');
var moment = require('moment');
var Posps = require('../models/posp');
var Sms_log = require('../models/sms_log');
var sleep = require('system-sleep');
var mongojs = require('mongojs');
var myDb = mongojs(config.db.connection + ':27017/' + config.db.name);
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var fs = require("fs");
var _ = require("underscore");
var MongoClient = require('mongodb').MongoClient;
mongoose.connect(config.db.connection + ':27017/' + config.db.name, { useMongoClient: true }); // connect to our database

var User_Data = require('../models/user_data');
var Proposal = require('../models/proposal');
module.exports.controller = function (app) {

    /*app.get('/user_datas', function (req, res) {
     User_Data.find(function (err, user_datas) {
     if (err)
     res.send(err);
     
     res.json(user_datas);
     });
     });*/
    app.post('/user_datas/proposals/list', LoadSession, function (req, res) {
        try {
            req.body = JSON.parse(JSON.stringify(req.body));
            req.body['PB_CRN'] = req.body['PB_CRN'] - 0;
            req.body['User_Data_Id'] = req.body['User_Data_Id'] - 0;
            if (req.body['PB_CRN'] > 0 && req.body['User_Data_Id'] > 0) {
                let cond_proposal = {
                    'PB_CRN': req.body['PB_CRN']
                };
                Proposal.find(cond_proposal, function (err, dbProposals) {
                    if (dbProposals) {
                        res.json(dbProposals);
                    } else {
                        res.json([]);
                    }
                });
            }
        } catch (e) {
            res.send(e.stack);
        }
    });
    app.get('/user_datas/ssid_by_crn/:PB_CRN', function (req, res) {
        if (parseInt(req.params.PB_CRN)) {
            User_Data.findOne({ PB_CRN: parseInt(req.params.PB_CRN) }, function (err, dbUserData) {
                if (err) {

                } else {
                    if (dbUserData) {
                        res.send(dbUserData._doc['Premium_Request']['ss_id'].toString());
                    } else {
                        res.send('Invalid CRN');
                    }
                }
            });
        } else {
            res.send('Invalid CRN');
        }
    });
    app.get('/user_datas/last_status_update/:udid', function (req, res) {
        try {
            let udid = req.params.udid;
            if (udid) {
                User_Data.findOne({ User_Data_Id: parseInt(udid) }, function (err, dbUserData) {
                    if (err) {
                        res.send(err);
                    } else {
                        if (dbUserData) {
                            let Status_History = dbUserData['Status_History'];
                            let updateData = {
                                "Last_Status": "BUY_NOW_CUSTOMER"
                            };
                            Status_History.unshift({
                                "Status": "BUY_NOW_CUSTOMER",
                                "StatusOn": new Date()
                            });
                            updateData.Status_History = Status_History;
                            User_Data.update({ 'User_Data_Id': parseInt(udid) }, { $set: updateData }, function (err, numAffected) {
                                if (err) {
                                    res.send(err);
                                } else {
                                    console.log('UserDataUpdated', err, numAffected);
                                    res.send({ "Msg": "Success", "Data": dbUserData });
                                }
                            });
                        } else {
                            res.send('Invalid User Data ID');
                        }
                    }
                });
            } else {
                res.send('Invalid User Data ID');
            }
        } catch (e) {
            res.send(e.stack);
        }
    });
    app.get('/user_datas/detail_by_crn/:PB_CRN', function (req, res) {
        if (parseInt(req.params.PB_CRN)) {
            User_Data.findOne({ PB_CRN: parseInt(req.params.PB_CRN) }, null, { sort: { User_Data_Id: -1 } }, function (err, dbUserData) {
                if (err) {

                } else {
                    if (dbUserData) {
                        res.json(dbUserData);
                    } else {
                        res.send('Invalid CRN');
                    }
                }
            });
        } else {
            res.send('Invalid CRN');
        }
    });
    app.get('/user_datas/CRN/:PB_CRN', function (req, res) {
        if (parseInt(req.params.PB_CRN)) {
            User_Data.findOne({ PB_CRN: parseInt(req.params.PB_CRN) }, null, { sort: { User_Data_Id: -1 } }, function (err, dbUserData) {
                if (err) {

                } else {
                    if (dbUserData) {
                        //var QuotePageURL = config.environment.portalurl + '/CarInsuranceIndia/QuotePageNew?SID=' + dbUserData['_doc']['Request_Unique_Id'] + '&ClientID=3';
                        //dbUserData['_doc']['Premium_Request']['QUOTE_URL'] = QuotePageURL;
                        var obj_whitelabel = {
                            "electrical_accessory": "0",
                            "external_bifuel_type": "",
                            "external_bifuel_value": 0,
                            "is_aai_member": "no",
                            "is_antitheft_fit": "no",
                            "is_claim_exists": "no",
                            "is_external_bifuel": "no",
                            "is_llpd": "yes",
                            "non_electrical_accessory": "0",
                            "pa_named_passenger_si": "0",
                            "pa_owner_driver_si": "",
                            "pa_paid_driver_si": "0",
                            "pa_unnamed_passenger_si": "50000",
                            "policy_expiry_date": "2019-03-28",
                            "prev_insurer_id": 11,
                            "product_id": 1,
                            "rto_id": 210,
                            "vehicle_expected_idv": 0,
                            "vehicle_id": 3270,
                            "vehicle_insurance_subtype": "1CH_0TP",
                            "vehicle_insurance_type": "renew",
                            "vehicle_manf_date": "2017-03-01",
                            "vehicle_ncb_current": "20",
                            "vehicle_registration_date": "2017-03-30",
                            "vehicle_registration_type": "individual",
                            "voluntary_deductible": 0,
                            "udid": 576970,
                            "ss_id": 0,
                            "fba_id": 0,
                            "sub_fba_id": 0
                        };


                        var content_html = '<!DOCTYPE html><html><head><title>CRN Details #' + req.params.PB_CRN + '</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                        content_html += '<div class="report" ><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">CRN Details #' + req.params.PB_CRN + '</span>\n\
					 <br>\n\
				<table style="-moz-box-shadow: 1px 1px 3px 2px #d3d3d3;-webkit-box-shadow: 1px 1px 3px 2px #d3d3d3;  box-shadow:         1px 1px 3px 2px #d3d3d3;" border="0" cellpadding="3" cellspacing="0" width="95%"  >';
                        content_html += '<tr>';
                        content_html += '<th style="font-size:12px;font-family:\'Google Sans\' ,tahoma;background-color: orange">Key</th>';
                        content_html += '<th style="font-size:12px;font-family:\'Google Sans\' ,tahoma;background-color: orange">Value</th>';
                        content_html += '</tr>';


                        for (var k in dbUserData['_doc']['Premium_Request']) {
                            if (obj_whitelabel.hasOwnProperty(k)) {
                                content_html += '<tr>';
                                content_html += '<td style="font-size:12px;font-family:\'Google Sans\' ,tahoma;background-color:white;" align="center">' + k.toString().replace(/_/g, ' ').toTitleCase() + '</td>';
                                content_html += '<td style="font-size:12px;font-family:\'Google Sans\' ,tahoma;background-color:white;" align="center">' + dbUserData['_doc']['Premium_Request'][k] + '</td>';
                                content_html += '</tr>';
                            }
                        }
                        content_html += '</table></div></body></html>';
                        res.send(content_html);
                    } else {
                        res.send('Invalid CRN');
                    }
                }
            });
        } else {
            res.send('Invalid CRN');
        }
    });
    app.get('/user_datas/make_model_list', function (req, res) {
        var agg = [
            {
                $group: {
                    _id: { Make_Name: "$Make_Name", Model_Name: "$Model_Name" }
                }
            },
            { $project: { _id: 0, Make_Name: "$_id.Make_Name", Model_Name: "$_id.Model_Name" } },
            { $sort: { 'Make_Name': 1 } }
        ];

        User_Data.aggregate(agg, function (err, user_datas) {
            if (err)
                res.send(err);

            res.json(user_datas);
        });
    });
    app.post('/user_datas/list', function (req, res) {

        User_Data.find({
            $or: [
                { 'Make_Name': new RegExp(req.body['q'], 'i') },
                { 'Model_Name': new RegExp(req.body['q'], 'i') },
                { 'Variant_Name': new RegExp(req.body['q'], 'i') },
                { 'Fuel_Name': new RegExp(req.body['q'], 'i') }
            ],
            $and: [{ 'Product_Id_New': parseInt(req.body['product_id']) }]
        }, function (err, user_datas) {
            if (err)
                res.send(err);
            //
            //            var listresponse = [];
            //            for (var k in user_datas) {
            //                listresponse.push({'id': user_datas[k]['User_Data_ID'], 'label': user_datas[k]['Make_Name'] + ' ' + user_datas[k]['Model_Name'] + ' ' + user_datas[k]['Variant_Name'] + '( Fuel: ' + user_datas[k]['Fuel_Name'] + ', CC:' + user_datas[k]['Cubic_Capacity'] + ' )'})
            //            }

            res.json(user_datas);
        });
        //        User_Data.find({$text: {$search: req.query['query']}}, {score: {$meta: "textScore"}}).sort({score: {$meta: 'textScore'}}).exec(function (err, user_datas) {
        //            if (err)
        //                res.send(err);
        //
        //            var listresponse = [];
        //            for (var k in user_datas) {
        //                listresponse.push({'id': user_datas[k]['User_Data_ID'], 'label': user_datas[k]['Make_Name'] + ' ' + user_datas[k]['Model_Name'] + ' ' + user_datas[k]['Variant_Name'] + '( Fuel: ' + user_datas[k]['Fuel_Name'] + ', CC:' + user_datas[k]['Cubic_Capacity'] + ' )'})
        //            }
        //
        //            res.json(listresponse);
        //        });
    });

    app.get('/user_datas/make1/:product_id', function (req, res) {
        var product_id = parseInt(req.params.product_id);
        var from = 0, to = 0;
        if (product_id === 1) {
            from = 0;
            to = 50000;
        } else {
            from = 50000;
            to = 100000;
        }
        User_Data.find().distinct('Make_Name', {}, function (err, user_datas) {
            if (err)
                res.send(err);

            res.json(user_datas);
        });
    });
    app.get('/user_datas/make/:product_id', function (req, res) {
        var product_id = parseInt(req.params.product_id);
        var from = 0, to = 0;
        if (product_id === 1) {
            from = 0;
            to = 50000;
        } else {
            from = 50000;
            to = 100000;
        }
        ;
        var agg = [
            { "$match": { "User_Data_ID": { "$gte": from, "$lte": to } } },
            {
                $group: {
                    _id: { Make_Name: "$Make_Name" },
                    User_DataCount: { $sum: 1 }
                }
            },
            { $project: { _id: 0, Make_Name: "$_id.Make_Name", User_DataCount: 1 } },
            { $sort: { 'Make_Name': 1 } }
        ];

        User_Data.aggregate(agg, function (err, user_datas) {
            if (err)
                res.send(err);

            res.json(user_datas);
        });

    });
    app.get('/user_datas/model/:make_name', function (req, res) {
        var make_name = req.params.make_name;
        User_Data.find().distinct('Model_Name', { 'Make_Name': make_name }, function (err, user_datas) {
            if (err)
                res.send(err);

            res.json(user_datas);
        });
        //        User_Data.distinct('Model_Name', {'Make_Name': make_name}, function (err, user_datas) {
        //            if (err)
        //                res.send(err);
        //
        //            res.json(user_datas);
        //        });
    });
    app.get('/user_datas/variant/:make_name/:model_name', function (req, res) {
        var make_name = req.params.make_name;
        var model_name = req.params.model_name;
        User_Data.find({ 'Make_Name': make_name, 'Model_Name': model_name }).sort({ 'Variant_Name': 'asc' }).exec(function (err, user_datas) {
            if (err)
                res.send(err);

            res.json(user_datas);
        });
    });
    app.post('/user_datas', LoadSession, function (req, res) {
        try {
            var objBase = new Base();
            //var objPost = req.body;
            //objPost = JSON.parse(JSON.stringify(objPost));
            //console.error('user_datas', 'post', objPost);
            var obj_pagination = objBase.jqdt_paginate_process(req.body);

            var optionPaginate = {
                select: 'User_Data_Id Request_Unique_Id Service_Log_Unique_Id PB_CRN ERP_CS ERP_CS_RESPONSE ERP_ENTRY ERP_CS_DOC Last_Status Insurer_Id Status_History Product_Id Client_Id Report_Summary Premium_Request Payment_Request Payment_Response Transaction_Data Transaction_Status Erp_Qt_Request_Core Is_Active Created_On Modified_On Verification_Request Pdf_Request Insurer_Transaction_Identifier Disposition_Status Disposition_SubStatus Erp_Cs_Err lead_assigned_uid lead_assigned_name Lead_Call_Back_Time Insurer_Success_Count Proposal_Id',
                sort: { 'Modified_On': 'desc' },
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

            if (typeof req.body['page_action'] !== 'undefined') {
                if (req.obj_session.user.role_detail.role.indexOf('ProductAdmin') > -1) {
                    filter['Product_Id'] = { $in: req.obj_session.user.role_detail.product };
                }
                if (req.body['page_action'] === 'all_transaction' && req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1) {

                }
                if (req.body['page_action'] === 'ch_all_transaction') {
                    var arr_ch_ssid = [];
                    var arr_ch_list = [];
                    if (req.obj_session.hasOwnProperty('users_assigned')) {
                        arr_ch_ssid = req.obj_session.users_assigned.Team.CSE;
                    }
                    arr_ch_ssid.push(req.obj_session.user.ss_id);
                    arr_ch_list = req.obj_session.user.role_detail.channel_transaction;
                    filter['$or'] = [
                        { 'Premium_Request.channel': { $in: arr_ch_list } },
                        { 'Premium_Request.ss_id': { $in: arr_ch_ssid } }
                    ];
                    //filter['Premium_Request.channel'] = req.obj_session.user.role_detail.channel;
                }
                if (req.body['page_action'] === 'my_transaction') {
                    var arr_ssid = [];
                    if (req.obj_session.hasOwnProperty('users_assigned')) {
                        var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
                        arr_ssid = combine_arr.split(',').filter(Number).map(Number);
                    }

                    //if ([114536, 113035, 114611, 114825, 114826, 114827, 114828, 114815, 110317].indexOf(req.obj_session.user.uid) > -1) {
                    const lead_caller_arr = JSON.parse(fs.readFileSync(appRoot + "/tmp/lead_assign_caller.json", { encoding: 'utf8', flag: 'r' }));
                    let lead_caller_uid = [114941, 114919, 117138];
                    lead_caller_arr.map(el => {
                        lead_caller_uid.push(el.uid);
                    });
                    if (lead_caller_uid.indexOf(req.obj_session.user.uid) > -1) {
                        filter['Is_Last'] = 'yes';
                        filter['$or'] = [
                            { 'Premium_Request.ss_id': req.obj_session.user.ss_id },
                            { 'lead_assigned_ssid': req.obj_session.user.ss_id }
                        ];
                        if (arr_ssid.length > 0) {
                            arr_ssid.push(req.obj_session.user.ss_id);
                            filter['$or'] = [
                                { 'Premium_Request.ss_id': { $in: arr_ssid } },
                                { 'lead_assigned_ssid': req.obj_session.user.ss_id }
                            ];
                        }
                    } else {
                        filter['Premium_Request.ss_id'] = req.obj_session.user.ss_id;
                        if (arr_ssid.length > 0) {
                            arr_ssid.push(req.obj_session.user.ss_id);
                            filter['Premium_Request.ss_id'] = { $in: arr_ssid };
                        }
                    }

                }
            }

            //to show only last attempt of search
            if (req.body['Group_Status'] == 'SELL') {

            } else {
                //filter['Is_Last'] = 'yes';
            }

            if (req.body['Col_Name'] !== '' && req.body['txtCol_Val'] !== '') {
                var arr_number_field = ['Premium_Request.posp_reporting_agent_uid', 'Premium_Request.posp_mobile_no', 'Premium_Request.posp_fba_id', 'Premium_Request.posp_erp_id', 'Premium_Request.ss_id', 'Proposal_Request.mobile'];
                var search_val = (arr_number_field.indexOf(req.body['Col_Name']) > -1) ? (req.body['txtCol_Val'] - 0) : req.body['txtCol_Val'];
                filter[req.body['Col_Name']] = search_val;
            }
            if (req.body['Product_Id'] !== '') {
                if (req.body['Product_Id'] === 'HospiCash') {
                    filter['Product_Id'] = 2;
                    filter['Premium_Request.is_hospi'] = 'yes';
                } else if (req.body['Product_Id'] === 'SME_ALL') {
                    filter['Product_Id'] = { "$in": [13, 19, 20, 21, 22, 23] };
                } else {
                    filter['Product_Id'] = req.body['Product_Id'] - 0;
                }
            }
            if (typeof req.body['Insurer_Id'] !== 'undefined' && req.body['Insurer_Id'] !== '') {
                filter['Insurer_Id'] = req.body['Insurer_Id'] - 0;
            }
            if (typeof req.body['Disposition_Status'] !== 'undefined' && req.body['Disposition_Status'] !== '') {
                filter['Disposition_Status'] = req.body['Disposition_Status'];
                if (filter["Disposition_Status"] === 'PENDING') {
                    filter["Disposition_Status"] = { $exists: false };
                }
                if (filter["Disposition_Status"] === 'DISPOSED') {
                    filter["Disposition_Status"] = { $exists: true };
                }
            }
            if (typeof req.body['Disposition_SubStatus'] !== 'undefined' && req.body['Disposition_SubStatus'] !== '') {
                filter['Disposition_SubStatus'] = (req.body['Disposition_SubStatus'].split(',').length == 1) ? req.body['Disposition_SubStatus'] : { $in: req.body['Disposition_SubStatus'].split(',') };
            }

            if (typeof req.body['utm_source'] !== 'undefined' && req.body['utm_source'] !== '') {
                filter['Premium_Request.utm_source'] = req.body['utm_source'];
            }
            if (typeof req.body['expiry_identifier'] !== 'undefined' && req.body['expiry_identifier'] !== '') {
                let expiry_start = null;
                let expiry_end = null;
                if (req.body['expiry_identifier'] === 'EXPIRED_3') {
                    expiry_start = moment().add(-3, 'days').utcOffset("+05:30").startOf('Day');
                    expiry_end = moment().add(-1, 'days').utcOffset("+05:30").endOf('Day');
                }
                if (req.body['expiry_identifier'] === 'TODAY') {
                    expiry_start = moment().utcOffset("+05:30").startOf('Day');
                    expiry_end = moment().utcOffset("+05:30").endOf('Day');
                }
                if (req.body['expiry_identifier'] === 'TOMORROW') {
                    expiry_start = moment().add(1, 'days').utcOffset("+05:30").startOf('Day');
                    expiry_end = moment().add(1, 'days').utcOffset("+05:30").endOf('Day');
                }
                if (req.body['expiry_identifier'] === 'NEXT_2_7') {
                    expiry_start = moment().add(2, 'days').utcOffset("+05:30").startOf('Day');
                    expiry_end = moment().add(7, 'days').utcOffset("+05:30").endOf('Day');
                }
                if (req.body['expiry_identifier'] === 'NEXT_8_15') {
                    expiry_start = moment().add(8, 'days').utcOffset("+05:30").startOf('Day');
                    expiry_end = moment().add(15, 'days').utcOffset("+05:30").endOf('Day');
                }
                if (req.body['expiry_identifier'] === 'NEXT_16_30') {
                    expiry_start = moment().add(16, 'days').utcOffset("+05:30").startOf('Day');
                    expiry_end = moment().add(30, 'days').utcOffset("+05:30").endOf('Day');
                }
                filter['Premium_Request.policy_expiry_date'] = { '$gte': expiry_start.format("YYYY-MM-DD"), '$lte': expiry_end.format("YYYY-MM-DD") };
            }




            if (req.body['Source'] && req.body['Source'] !== '') {
                filter['Premium_Request.channel'] = req.body['Source'];
            }
            if (req.body['Group_Status'] !== '') {
                var ObjSummaryStatus = {
                    'SEARCH': ['SEARCH', 'ADDON_QUOTE_APPLY', 'ADDON_PROPOSAL_AGENT_APPLY', 'BUY_NOW_AGENT'],
                    'LINK_SENT': ['PROPOSAL_LINK_SENT', 'BUY_NOW_CUSTOMER', 'ADDON_PROPOSAL_CUSTOMER_APPLY', 'ADDON_QUOTE_APPLY', 'ADDON_PROPOSAL_AGENT_APPLY', 'BUY_NOW_AGENT'],
                    'PAYMENT_PENDING': ['PROPOSAL_SUBMIT', 'PROPOSAL_EXCEPTION'],
                    'POLICY_PENDING': ['VERIFICATION_EXCEPTION', 'TRANS_MANUAL_PAYPASS', 'TRANS_PAYPASS'],
                    'FAIL': ['TRANS_FAIL'],
                    'SELL': ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY']
                };
                filter['Last_Status'] = {
                    $in: ObjSummaryStatus[req.body['Group_Status']]
                };
            }
            if (req.body['App_Version'] !== '') {
                if (req.body['App_Version'] === 'PolicyBoss.com') {
                    filter['Premium_Request.app_version'] = 'PolicyBoss.com';
                }
                if (req.body['App_Version'] === 'FinPeace') {
                    filter['Premium_Request.app_version'] = 'FinPeace';
                }
                if (req.body['App_Version'] === 'FinmartApp') {
                    filter['Premium_Request.app_version'] = { "$ne": "PolicyBoss.com" };
                }
            }
            if (req.body['Renewal'] === 'yes') {
                filter['Proposal_Request_Core.renewal_crn_udid'] = { "$exists": true };
            }
            if (req.body['Policy_Status'] === 'yes') {
                filter['Last_Status'] = 'TRANS_SUCCESS_WITH_POLICY';
            }
            if (req.body['Policy_Status'] === 'no') {
                filter['Last_Status'] = 'TRANS_SUCCESS_WO_POLICY';
            }
            if (req.body['CS_Status'] === 'yes') {
                filter['ERP_CS'] = new RegExp('CS', 'i');
            }
            if (req.body['CS_Status'] === 'no') {
                filter['ERP_CS'] = { $in: ['PENDING', 'INPROGRESS', 'VALIDATION', 'EXCEPTION', 'TRYAGAIN', 'DUPLICATE'] };
            }

            if (req.body['Col_Transaction_Status'] !== '') {
                var cs_status = ['CS_PENDING', 'CS_INPROGRESS', 'CS_VALIDATION', 'CS_EXCEPTION', 'CS_TRYAGAIN', 'CS_DUPLICATE'];
                if (req.body['Col_Transaction_Status'] === 'TRANS_WO_CS') {
                    filter['Last_Status'] = {
                        $in: ["TRANS_SUCCESS_WO_POLICY", "TRANS_SUCCESS_WITH_POLICY"]
                    };
                    filter['ERP_CS'] = "PENDING";
                } else if (cs_status.indexOf(req.body['Col_Transaction_Status']) > -1) {
                    filter['ERP_CS'] = req.body['Col_Transaction_Status'].replace('CS_', '');

                } else if (req.body['Col_Transaction_Status'] === 'TRANS_WO_CS_DOC') {
                    filter['Last_Status'] = {
                        $in: ["TRANS_SUCCESS_WO_POLICY", "TRANS_SUCCESS_WITH_POLICY"]
                    };
                    filter['ERP_CS'] = { "$nin": [null, ""] };
                    filter['ERP_CS_DOC'] = { "$nin": ['SUCCESS', 'Success'] };
                } else {
                    filter['Last_Status'] = req.body['Col_Transaction_Status'];
                }
            }
            if (req.body['transaction_start_date'] !== '' && req.body['transaction_end_date'] !== '') {
                var arrFrom = req.body['transaction_start_date'].split('-');
                var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);

                var arrTo = req.body['transaction_end_date'].split('-');
                var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
                dateTo.setDate(dateTo.getDate() + 1);
                filter['Modified_On'] = { "$gte": dateFrom, "$lte": dateTo };
            }

            if (req.body['PB_CRN'] !== "") {
                filter['PB_CRN'] = req.body['PB_CRN'] - 0;
            } else if (req.body['registration_number'] !== "") {
                filter['Erp_Qt_Request_Core.___registration_no___'] = req.body['registration_number'];
            }

            for (let k in req.body) {
                if (k.indexOf('Erp_Qt_Request_Core') > -1 && req.body[k] !== '') {
                    if (k === 'Erp_Qt_Request_Core.___final_premium___') {
                        var min_fp = req.body[k].split('_')[0];
                        var max_fp = req.body[k].split('_')[1];
                        filter[k] = { "$gte": min_fp, "$lte": max_fp };
                    } else {
                        filter[k] = req.body[k];
                    }
                }
            }

            if (req.body['Erp_Qt_Request_Core.___voluntary_deductible___'] === "yes") {
                filter['Erp_Qt_Request_Core.___voluntary_deductible___'] = { '$exists': true, '$ne': '0' };
            }


            console.error('HorizonSaleSearch', filter, req.body);
            User_Data.paginate(filter, optionPaginate).then(function (user_datas) {
                //console.error('UserDataSearch', filter, optionPaginate, user_datas);
                res.json(user_datas);
            });
        } catch (e) {
            console.error('userdata', 'error', e);
            res.json(e);
        }
    });
    app.post('/user_datas/save', function (req, res) {
        var objUserData = {};
        var base = new Base();
        for (var key in req.body) {
            if (req.body[key].indexOf('{') === 0) {
                objUserData[key] = JSON.parse(req.body[key]);
            } else {
                objUserData[key] = (isNaN(req.body[key])) ? req.body[key].toString() : req.body[key] - 0;
            }
        }
        console.log('UserData', objUserData);
        //res.json(objUserData);
        if (true) {

            // get the current date
            var currentDate = new Date();
            if (req.body.User_Data_Id) {
                //objUserData.Modified_On = currentDate;
                User_Data.update({ 'User_Data_Id': objUserData.User_Data_Id }, objUserData, function (err, numAffected) {
                    console.log('UserDataUpdated', err, numAffected);
                    res.json({ 'Msg': 'Data saved', 'Id': objUserData.User_Data_Id });
                });
            }
        }
    });
    app.post('/user_datas/proposals/search_by_pgdata', function (req, res) {
        try {
            var pg_post = req.body['pg_post'] || {};
            var pg_get = req.body['pg_get'] || {};
            var pg_url = req.body['pg_url'] || '';
            var referer = req.body['referer'] || '';
            var pg_redirect_mode = req.body['pg_redirect_mode'] || '';

            let ud_cond = null;
            let match_type = 'exact';
            let Insurer_Transaction_Identifier = '';
            if (pg_redirect_mode === 'GET') {
                if (pg_get.hasOwnProperty('PolicyNo') && pg_get.hasOwnProperty('Msg') && pg_get.hasOwnProperty('ProposalNo')) {//hdfc
                    insurer_id = 5;
                    if (pg_get.hasOwnProperty('BrkProposalNo')) {
                        Insurer_Transaction_Identifier = pg_get['BrkProposalNo'];
                    } else {
                        Insurer_Transaction_Identifier = pg_get['ProposalNo'];
                    }
                }
                if (pg_get.hasOwnProperty('policyId') && pg_get.hasOwnProperty('quoteId') && pg_get.hasOwnProperty('status')) {//acko
                    insurer_id = 45;
                    Insurer_Transaction_Identifier = pg_get['quoteId'];
                }
                if (pg_get.hasOwnProperty('Output') && (pg_get['Output'].toString().toLowerCase().indexOf('|ccavenue|r') > -1 || pg_get['Output'].toString().toLowerCase().indexOf('|payu|r') > -1)) {//reliance
                    insurer_id = 9;
                    let arr_pg = pg_get['Output'].split('|');
                    Insurer_Transaction_Identifier = arr_pg[5];
                }
                if (pg_get.hasOwnProperty('ITGIResponse')) {//iffco
                    insurer_id = 7;
                    let arr_pg = pg_get['ITGIResponse'].split('|');
                    Insurer_Transaction_Identifier = arr_pg[5];
                }
                if (pg_get.hasOwnProperty('MSG') && pg_get['MSG'].indexOf('SOMPOGINS') > -1) {//universalsompo
                    insurer_id = 19;
                    let arr_pg = pg_get['MSG'].split('|');
                    Insurer_Transaction_Identifier = arr_pg[1];
                }
                if (pg_get.hasOwnProperty('productID') && pg_get.hasOwnProperty('orderNo')) {//bharti
                    insurer_id = 2;
                    Insurer_Transaction_Identifier = pg_get['orderNo'];
                    match_type = 'like';
                }
                if (pg_get.hasOwnProperty('response')) {//tataaig
                    insurer_id = 11;
                    let data = pg_get['response'];
                    let buff = new Buffer(data, 'base64');
                    let text = buff.toString('ascii');
                    let decoded_response = JSON.parse(text);
                    console.error('DEBUG', 'pgdata_by_proposal', decoded_response, data);
                    /*
                     * {
                     "status": "1",
                     "data": {
                     "proposalno": "P/N/3122/0000055931",
                     "policyno": "064001/0173549536/000000/00",
                     "rnd_str": "UdAMHnBgjWlvc5jARqxxPpKWv",
                     "productname": "Two Wheeler",
                     "productcode": "3122",
                     "uw_ref": "",
                     "status": "1",
                     "message": "",
                     "is_SAOD": false,
                     "errocde": ""
                     }
                     }
                     */

                    Insurer_Transaction_Identifier = decoded_response['data']['proposalno'];
                }

            }
            if (pg_redirect_mode === 'POST') {
                if (pg_post.hasOwnProperty('TransactionId') && pg_post.hasOwnProperty('ProposalId') && pg_post.hasOwnProperty('ApplicationNo')) {//apollo
                    Insurer_Transaction_Identifier = pg_post['ApplicationNo'];
                    insurer_id = 21;
                }
                if (pg_post.hasOwnProperty('pgRespCode') && pg_post.hasOwnProperty('QuoteId') && pg_post.hasOwnProperty('SourceTxnId')) {//Aditya
                    Insurer_Transaction_Identifier = pg_post['QuoteId'];
                    insurer_id = 42;
                }
                if (pg_post.hasOwnProperty('txnid') && pg_post['txnid'] && pg_post['txnid'].toString().length === 13 && pg_post['txnid'].toString().charAt(0) == 'C') {//RahejaQBE
                    Insurer_Transaction_Identifier = pg_post['txnid'];
                    insurer_id = 16;
                    match_type = 'like';
                }
            }
            if (Insurer_Transaction_Identifier !== '') {
                var today = moment().utcOffset("+05:30").startOf('Day');

                var T_MIN_3_DAY = moment(today).add(-5, 'days').format("YYYY-MM-DD");
                var today_str = moment(today).format("YYYY-MM-DD");
                var arrFrom = T_MIN_3_DAY.split('-');
                var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);

                var arrTo = today_str.split('-');
                var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
                dateTo.setDate(dateTo.getDate() + 1);

                ud_cond = {
                    'Proposal_Request': { $exists: true },
                    'Modified_On': { "$gte": dateFrom, "$lte": dateTo },
                    'Insurer_Id': insurer_id,
                    'Insurer_Transaction_Identifier': Insurer_Transaction_Identifier.toString()
                };
                if (match_type === 'like') {
                    ud_cond['Insurer_Transaction_Identifier'] = new RegExp(Insurer_Transaction_Identifier, 'i');
                }
                Proposal.findOne(ud_cond, function (err, dbProposal) {
                    if (err)
                        res.send(err);

                    if (dbProposal) {
                        res.json(dbProposal._doc);
                    } else {
                        res.json({});
                    }
                });
            } else {
                res.json({});
            }
        } catch (e) {
            console.error('Exception', 'PG_BY_PROPOSAL', e.stack, req.get, req.body);
            res.send(e.stack);
        }
    });
    app.get('/user_datas/view/:User_Data_Id', function (req, res) {
        var User_Data_Id = req.params.User_Data_Id - 0;

        User_Data.find({ 'User_Data_Id': User_Data_Id }, function (err, user_data) {
            if (err)
                res.send(err);

            res.json(user_data);
        });
    });
    app.get('/user_datas/proposal/view/:Proposal_Id', function (req, res) {
        var Proposal_Id = req.params.Proposal_Id - 0;
        Proposal.findOne({ 'Proposal_Id': Proposal_Id }, function (err, dbProposal) {
            if (err)
                res.send(err);

            res.json(dbProposal._doc);
        });
    });
    app.get('/user_datas/quicklist/:Product_Id/:Type/:Ss_Id/:Fba_Id/:Page/:Mobile/:Sub_Fba_Id?', function (req, res) {
        try {
            var Product_Id = req.params.Product_Id - 0;
            var Fba_Id = req.params.Fba_Id - 0;
            var Type = req.params.Type;
            var Ss_Id = req.params.Ss_Id - 0;
            var Page = req.params.Page - 0;
            var Skip = 0;
            var Limit = 10;
            var status_grp = "";
            var Mobile = (req.params.hasOwnProperty('Mobile')) ? req.params.Mobile : 0;
            var Sub_Fba_Id = (req.params.hasOwnProperty('Sub_Fba_Id')) ? req.params.Sub_Fba_Id - 0 : 0;
            if (Ss_Id && Type && Page) {
                var Condition = {
                    "Product_Id": Product_Id
                    //"Last_Status": ""
                };
                //agent condition
                if (Ss_Id) { //10859
                    if (Ss_Id === 10859 && Product_Id === 2) {
                        Condition['Premium_Request.ss_id'] = 0;
                    } else if (Ss_Id === 5417) {
                        Condition['Premium_Request.ss_id'] = 0;
                    } else if (Ss_Id === 7844 || Ss_Id === 8048 || Ss_Id === 12311) {
                        Condition['Premium_Request.posp_sources'] = 1;
                    } else if (Ss_Id === 8304) {
                        Condition['Premium_Request.posp_sources'] = 2;
                    } else if (Type === 'INSPECTION' && Ss_Id === 487) {
                    } else {
                        if (Ss_Id === 5) {
                            Condition['Premium_Request.fba_id'] = Fba_Id;
                        } else if (Ss_Id !== 5) {
                            Condition['Premium_Request.ss_id'] = Ss_Id;
                            if (Sub_Fba_Id > 0) {
                                Condition['Premium_Request.sub_fba_id'] = Sub_Fba_Id;
                            }
                        }
                    }
                }

                if (Mobile > 0) {
                    Condition['Premium_Request.mobile'] = Mobile;
                }

                if (Product_Id === 22) { //hospicash 
                    Condition['Premium_Request.is_hospi'] = "yes";
                    Condition['Product_Id'] = 2;
                } else if (Product_Id === 23) //Group health Insurance 
                {
                    Condition['Premium_Request.is_ghi'] = "yes";
                    Condition['Product_Id'] = 2;
                } else if (Product_Id === 42) //Shortteam Policy
                {
                    Condition['Premium_Request.is_short_term_policy'] = "yes";
                    Condition['Product_Id'] = 2;
                } else if (Product_Id === 35) //TW Express
                {
                    Condition['Premium_Request.ui_source'] = "quick_tw_journey";
                    Condition['Product_Id'] = 10;
                } else {

                }
                //type condition
                var ObjSummaryStatus = {
                    'SEARCH': ['SEARCH', 'ADDON_QUOTE_APPLY', 'ADDON_PROPOSAL_AGENT_APPLY', 'BUY_NOW_AGENT'],
                    'LINK_SENT': ['PROPOSAL_LINK_SENT', 'BUY_NOW_CUSTOMER', 'ADDON_PROPOSAL_CUSTOMER_APPLY', 'ADDON_QUOTE_APPLY', 'ADDON_PROPOSAL_AGENT_APPLY', 'BUY_NOW_AGENT'],
                    'PAYMENT_PENDING': ['PROPOSAL_SUBMIT', 'PROPOSAL_EXCEPTION'],
                    'POLICY_PENDING': ['VERIFICATION_EXCEPTION', 'TRANS_MANUAL_PAYPASS', 'TRANS_PAYPASS'],
                    'FAIL': ['TRANS_FAIL'],
                    'SELL': ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY']
                };
                var ObjSummaryCondition = {
                    'QUOTE': ['SEARCH', 'ADDON_PROPOSAL_CUSTOMER_APPLY', 'ADDON_QUOTE_APPLY', 'ADDON_PROPOSAL_AGENT_APPLY'],
                    'APPLICATION': ['PROPOSAL_LINK_SENT', 'BUY_NOW_CUSTOMER', 'BUY_NOW_AGENT', 'PROPOSAL_SUBMIT', 'PROPOSAL_EXCEPTION', 'TRANS_FAIL', 'PROPOSAL_SAVE_AGENT'],
                    'COMPLETE': ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY', 'VERIFICATION_EXCEPTION', 'TRANS_MANUAL_PAYPASS', 'TRANS_PAYPASS'],
                    'INSPECTION': ['INSPECTION_SCHEDULED', 'INSPECTION_APPROVED', 'INSPECTION_REJECTED', 'INSPECTION_EXCEPTION', 'INSPECTION_REINSPECTION', 'INSPECTION_SUBMITTED'],
                    'INSPECTION_SUBMITTED': ['INSPECTION_SUBMITTED'],
                    'PENDING_PAYMENT': ['PROPOSAL_SUBMIT', 'PROPOSAL_EXCEPTION', 'TRANS_FAIL'],
                    'SENDLINK': ['PROPOSAL_LINK_SENT'],
                    'PROPOSALSUBMIT': ['PROPOSAL_SUBMIT', 'PROPOSAL_EXCEPTION']
                };
                if (Type === 'SEARCH') {
                    Condition['Last_Status'] = { $in: ObjSummaryCondition['QUOTE'] };
                }
                if (Type === 'APPLICATION') {
                    Condition['Last_Status'] = { $in: ObjSummaryCondition['APPLICATION'] };
                }
                if (Type === 'SELL') {
                    Condition['Last_Status'] = { $in: ObjSummaryCondition['COMPLETE'] };
                    if (Product_Id === 35) //TW Express
                    {
                        Condition['Last_Status'] = ['SEARCH', 'ADDON_PROPOSAL_CUSTOMER_APPLY', 'ADDON_QUOTE_APPLY', 'ADDON_PROPOSAL_AGENT_APPLY', 'PROPOSAL_LINK_SENT', 'BUY_NOW_CUSTOMER', 'BUY_NOW_AGENT', 'PROPOSAL_SUBMIT', 'PROPOSAL_EXCEPTION', 'TRANS_FAIL', 'PROPOSAL_SAVE_AGENT'];
                    }
                }
                if (Type === 'INSPECTION' && Ss_Id !== 487) {
                    Condition['Last_Status'] = { $in: ObjSummaryCondition['INSPECTION'] };
                }
                if (Type === 'INSPECTION' && Ss_Id === 487) {
                    Condition['Last_Status'] = { $in: ObjSummaryCondition['INSPECTION_SUBMITTED'] };
                }
                if (Type === 'PENDING_PAYMENT') {
                    Condition['Last_Status'] = { $in: ObjSummaryCondition['PENDING_PAYMENT'] };
                }
                if (Type === 'SENDLINK') {
                    Condition['Last_Status'] = { $in: ObjSummaryCondition['SENDLINK'] };
                }
                if (Type === 'PROPOSALSUBMIT') {
                    Condition['Last_Status'] = { $in: ObjSummaryCondition['PROPOSALSUBMIT'] };
                }
                var pageCount = 0;
                console.log(Condition);
                User_Data.find(Condition).count(function (e, count) {
                    console.log(count);
                    pageCount = count;
                });
                //page is 
                if (Page > 1) {
                    Skip = Limit * (Page - 1);
                }
                //console.error('UDBG', Ss_Id, Page, Skip, Limit);
                User_Data.find(Condition).sort({
                    Modified_On: -1
                }).select(['Product_Id', 'PB_CRN', 'Request_Unique_Id', 'Report_Summary', 'Premium_Request', 'Premium_Summary', 'Proposal_Request', 'Last_Status', 'Created_On', 'Modified_On', 'Client_Id', 'Transaction_Data', 'Erp_Qt_Request_Core', 'Status_History', 'Insurer_Id', 'User_Data_Id', 'Transaction_Data', 'ERP_CS', 'Service_Log_Unique_Id', 'Proposal_History', 'Premium_List', 'Preferred_Plan_Data', 'Proposal_Request_Core']).skip(Skip).limit(Limit).exec(function (err, dbUsers) {
                    //console.error('UDBG', err, dbUsers);
                    try {
                        if (!err) {
                            var arr_User_Data = [];
                            for (var k in dbUsers) {
                                try {
                                    var user = dbUsers[k]._doc;
                                    var dt = (new Date(user.Modified_On)).toLocaleString();
                                    var Quote_Date = dt;
                                    dt = dt.split(',');
                                    var Quote_Date_Mobile = dt[0];
                                    Quote_Date_Mobile = moment(Quote_Date).format("DD/MM/YYYY");
                                    //Quote_Date_Mobile = dt;
                                    var customer = 'NO NAME';
                                    var mobile = user['Premium_Request'].hasOwnProperty('mobile') ? user['Premium_Request']['mobile'] : "";


                                    if (user.hasOwnProperty('Proposal_Request') && user['Proposal_Request'] && user['Proposal_Request'].hasOwnProperty('first_name')) {
                                        customer = user['Proposal_Request']['first_name'] + ' ' + user['Proposal_Request']['last_name'];
                                    } else {
                                        if (user.Product_Id === 2 || user.Product_Id === 17 || user.Product_Id === 18 || user.Product_Id === 4) {
                                            customer = user['Premium_Request'].hasOwnProperty('contact_name') ? user['Premium_Request']['contact_name'] : "";
                                        } else {
                                            customer = user['Premium_Request']['first_name'] + ' ' + user['Premium_Request']['last_name'];
                                        }
                                    }

                                    if (hasNumber(customer)) {
                                        customer = 'NO NAME';
                                    }



                                    if (user.hasOwnProperty('Proposal_Request') && user['Proposal_Request'] && user['Proposal_Request'].hasOwnProperty('mobile')) {
                                        mobile = user['Proposal_Request']['mobile'];
                                    }

                                    if (mobile) {
                                        mobile = mobile - 0;
                                    }



                                    if (Ss_Id === 5417) {
                                        customer = customer + '(MO#' + mobile + ')';
                                    }

                                    var contact_name = customer.toString().toTitleCase();
                                    var Sum_Insured = 0;
                                    if (user.Product_Id === 1 || user.Product_Id === 10 || user.Product_Id === 12) {
                                        if (user.Premium_Request['vehicle_insurance_subtype'] === "0CH_3TP" || user.Premium_Request['vehicle_insurance_subtype'] === "0CH_1TP" || user.Premium_Request['vehicle_insurance_subtype'] === "0CH_5TP") {
                                            Sum_Insured = 'NA';
                                        } else {
                                            if (user.hasOwnProperty('Erp_Qt_Request_Core') && user.Erp_Qt_Request_Core) {
                                                Sum_Insured = user.Erp_Qt_Request_Core.___vehicle_expected_idv___;
                                            } else if (user.hasOwnProperty('Proposal_Request_Core') && user.Proposal_Request_Core) {
                                                Sum_Insured = user.Proposal_Request_Core.vehicle_expected_idv;
                                            } else {
                                                if (user['Premium_Request']['vehicle_expected_idv'] !== null && user['Premium_Request']['vehicle_expected_idv'] !== undefined) {
                                                    Sum_Insured = user['Premium_Request']['vehicle_expected_idv'];
                                                }
                                            }
                                        }
                                    }
                                    if (user.Product_Id === 2) {
                                        Sum_Insured = user['Premium_Request']['is_hospi'] === "yes" ? user['Premium_Request']['per_day_si'] : user['Premium_Request']['health_insurance_si'];
                                    }
                                    if (user.Product_Id === 5) {
                                        Sum_Insured = user['Premium_Request']['investment_amount'] + '/' + user['Premium_Request']['frequency'];
                                    }
                                    if (user.Product_Id === 17) {
                                        Sum_Insured = user['Premium_Request'].hasOwnProperty('corona_insurance_si') ? user['Premium_Request']['corona_insurance_si'] : "";
                                    }
                                    if (user.Product_Id === 18) {
                                        Sum_Insured = user['Premium_Request'].hasOwnProperty('cs_insurance_si') ? user['Premium_Request']['cs_insurance_si'] : "";
                                    }
                                    var Progress = 0;
                                    status_grp = user['Last_Status'];
                                    var Progress = 0;
                                    var Color_code = "";
                                    if (ObjSummaryStatus['LINK_SENT'].indexOf(status_grp) > -1) {
                                        Progress = 50;
                                        Color_code = "#a50ae9";
                                    }
                                    if (ObjSummaryStatus['FAIL'].indexOf(status_grp) > -1) {
                                        Progress = 70;
                                        Color_code = "#ff8d28";
                                    }
                                    if (ObjSummaryStatus['PAYMENT_PENDING'].indexOf(status_grp) > -1) {
                                        Progress = 80;
                                        Color_code = "#263fb8";
                                    }
                                    if (ObjSummaryStatus['POLICY_PENDING'].indexOf(status_grp) > -1) {
                                        Progress = 90;
                                        Color_code = "#00811f";
                                    }
                                    if (ObjSummaryStatus['SELL'].indexOf(status_grp) > -1) {
                                        Progress = 100;
                                        Color_code = "green";
                                    }

                                    var objUD = {
                                        'Customer_Name': contact_name,
                                        'Customer_Mobile': mobile,
                                        'Sum_Insured': Sum_Insured,
                                        'CRN': user['PB_CRN'],
                                        'Quote_Date': Quote_Date,
                                        'Quote_Date_Mobile': Quote_Date_Mobile,
                                        'Created_On': user.Modified_On,
                                        'SRN': user['Request_Unique_Id'] + '_' + user['User_Data_Id'],
                                        'SRN_Core': user['Request_Unique_Id'],
                                        'udid': user['User_Data_Id'],
                                        'Last_Status': user['Last_Status'],
                                        'Application_Date': '',
                                        'Insurer': '',
                                        'Progress': Progress,
                                        'Premium': 0,
                                        'ERP_CS': user['ERP_CS'],
                                        'Color_code': Color_code,
                                        'Registration_no': user['Premium_Request']['registration_no'],
                                        'PageCount': Math.round(pageCount / 10),
                                        'Vehicle_Name': "",
                                        'RTO': ""
                                    };
                                    if ((Type === 'SEARCH' || Type === 'ALL') && [1, 12, 10].indexOf(user['Product_Id']) > -1) {
                                        if (user['Premium_Request'].hasOwnProperty('vehicle_full')) {
                                            var arr_veh = user['Premium_Request']['vehicle_full'].split('|');
                                            objUD['Vehicle_Name'] = arr_veh[0] + ' ' + arr_veh[1] + ' ' + arr_veh[2];
                                            objUD['RTO'] = user['Premium_Request']['rto_full'].split('|')[1];
                                        }
                                    }
                                    /*if (Type === 'SEARCH' || Type === 'ALL') {
                                     var args = {
                                     data: {
                                     "search_reference_number": user['Request_Unique_Id'],
                                     "udid": user['User_Data_Id'],
                                     "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
                                     "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9"
                                     },
                                     headers: {
                                     "Content-Type": "application/json"
                                     }
                                     };
                                     var url_api = config.environment.weburl + '/quote/premium_summary';
                                     //execute_post(url_api, args);
                                     var Client = require('node-rest-client').Client;
                                     var client = new Client();
                                     client.post(url_api, args, function (data, response) {
                                     
                                     objUD['Vehicle_Name'] = data['Master']['Vehicle']['Description'];
                                     objUD['RTO'] = data['Master']['Rto']['RTO_City'];
                                     });
                                     sleep(500);
                                     }*/
                                    if (Type !== 'SEARCH') {
                                        var Application_Date = '';
                                        objUD['Insurer'] = user['Insurer_Id'];
                                        for (var k in user.Status_History) {
                                            if (user.Status_History[k]['Status'] === 'PROPOSAL_LINK_SENT') {
                                                var dt = (new Date(user.Status_History[k]['StatusOn'])).toLocaleString();
                                                dt = dt.split(',');
                                                Application_Date = dt[0];
                                                Application_Date = moment(Quote_Date).format("DD/MM/YYYY");
                                                break;
                                            }
                                        }
                                        objUD['Application_Date'] = Application_Date;
                                    }

                                    if (Type === 'APPLICATION' && user.Product_Id === 2) {
                                        objUD['ARN'] = user.Service_Log_Unique_Id;
                                        objUD['SL_ID'] = user.Proposal_History[0]['Form_Data']['slid'];
                                        //objUD['ARN'] = user.Erp_Qt_Request_Core['___api_reference_number___'];;
                                        //objUD['SL_ID'] = user.Erp_Qt_Request_Core['___slid___'];;
                                    } else if (Type === 'APPLICATION' && (user.Product_Id === 1 || user.Product_Id === 10 || user.Product_Id === 12)) {
                                        for (var k in user.Premium_List['Response']) {
                                            if (user.Service_Log_Unique_Id === user.Premium_List['Response'][k]['Service_Log_Unique_Id_Core']) {
                                                objUD['ARN'] = user.Premium_List['Response'][k]['Service_Log_Unique_Id_Core'];
                                                objUD['SL_ID'] = user.Premium_List['Response'][k]['Service_Log_Id'];
                                                if (user.Premium_List['Response'][k]['Premium_Breakup']) {
                                                    objUD['Premium'] = user.Premium_List['Response'][k]['Premium_Breakup'].final_premium;
                                                    if (objUD['Sum_Insured'] === 0) {
                                                        objUD['Sum_Insured'] = user.Premium_List['Response'][k]['LM_Custom_Request'].vehicle_expected_idv;
                                                    }
                                                } else if (user.hasOwnProperty('Proposal_Request_Core') && user.Proposal_Request_Core && (user.Service_Log_Unique_Id === user.Proposal_Request_Core.api_reference_number)) {
                                                    objUD['Premium'] = Math.round(user.Proposal_Request_Core.final_premium);
                                                }
                                            }
                                        }
                                        if (objUD['Premium'] === 0) {
                                            if (user.hasOwnProperty('Proposal_Request_Core') && user.Proposal_Request_Core && (user.Service_Log_Unique_Id === user.Proposal_Request_Core.api_reference_number)) {
                                                objUD['Premium'] = Math.round(user.Proposal_Request_Core.final_premium);
                                            }
                                        }
                                    } else if (Type === 'APPLICATION' && user.Product_Id === 5) {
                                        for (var k in user.Premium_List['Response']) {
                                            objUD['Insurer'] = user.Premium_List['Response'][k]['Insurer'];

                                        }
                                    }
                                    if (Type === 'PENDING_PAYMENT' && (user.Product_Id === 1 || user.Product_Id === 10 || user.Product_Id === 12)) {
                                        for (var k in user.Premium_List['Response']) {
                                            if (user.Service_Log_Unique_Id === user.Premium_List['Response'][k]['Service_Log_Unique_Id_Core']) {
                                                if (user.Premium_List['Response'][k]['Premium_Breakup']) {
                                                    objUD['Premium'] = user.Premium_List['Response'][k]['Premium_Breakup'].final_premium;
                                                    if (objUD['Sum_Insured'] === 0) {
                                                        objUD['Sum_Insured'] = user.Premium_List['Response'][k]['LM_Custom_Request'].vehicle_expected_idv;
                                                    }
                                                } else if (user.hasOwnProperty('Proposal_Request_Core') && user.Proposal_Request_Core && (user.Service_Log_Unique_Id === user.Proposal_Request_Core.api_reference_number)) {
                                                    objUD['Premium'] = Math.round(user.Proposal_Request_Core.final_premium);
                                                }
                                            }
                                        }
                                        if (objUD['Premium'] === 0) {
                                            if (user.hasOwnProperty('Proposal_Request_Core') && user.Proposal_Request_Core && (user.Service_Log_Unique_Id === user.Proposal_Request_Core.api_reference_number)) {
                                                objUD['Premium'] = Math.round(user.Proposal_Request_Core.final_premium);
                                            }
                                        }
                                    }
                                    if (user.Product_Id === 2) {
                                        objUD['Premium_Request'] = user['Premium_Request'];
                                        if (user.hasOwnProperty("Preferred_Plan_Data")) {
                                            objUD['Preferred_Plan'] = user['Preferred_Plan_Data'];
                                        }
                                    }
                                    if (user.Product_Id !== 17) {
                                        if (Type === 'SELL' && Ss_Id !== 5417 && Ss_Id !== 7844 && Ss_Id !== 8048 && Ss_Id !== 8304 && Ss_Id !== 10859) {
                                            objUD['policy_url'] = user['Transaction_Data']['policy_url'];
                                        }
                                    }
                                    arr_User_Data.push(objUD);
                                } catch (e) {
                                    console.error('UDBG', e);
                                }
                            }
                            res.json(arr_User_Data);
                        } else {
                            console.error('Exception', 'QuickListDBError', err);
                            res.send(err);

                        }
                    } catch (e1) {
                        console.error('Exception', 'QuickList1', e1);
                    }
                });
            } else {
                res.json({ 'msg': 'ss_id is empty' });
            }
        } catch (e) {
            console.error('Exception', 'QuickList', e);
        }
    });

    app.get('/user_datas/smslist/:Product_Id/:Ss_Id/:Fba_Id/:Page', function (req, res) {

        var Product_Id = req.params.Product_Id - 0;
        var Fba_Id = req.params.Fba_Id - 0;
        var Ss_Id = req.params.Ss_Id - 0;
        var Page = req.params.Page - 0;
        var Mobile_No;
        var Skip = 0;
        var Limit = 20;

        if (Ss_Id && Fba_Id && Page) {

            var Condition = {
                "Ss_Id": Ss_Id,
                "Fba_Id": Fba_Id.toString()
            };
            Posps.find(Condition).select('Mobile_No').exec(function (err, Posps) {
                if (err) {
                    console.error(err);
                    res.json(err);
                } else {
                    console.error('SMS', 'Posps', Posps);
                    if (Posps) {
                        Mobile_No = Posps[0]['_doc']['Mobile_No'] - 0;
                        if (Mobile_No > 0) {
                            if (Page > 1) {
                                Skip = Limit * (Page - 1);
                            }
                            Sms_log.find({ "To": Mobile_No }).sort({ Created_On: -1 }).skip(Skip).limit(Limit).exec(function (err, smslog) {
                                if (err) {
                                    console.error(err);
                                } else {
                                    var sms_Data = [];
                                    for (var i in smslog) {
                                        try {
                                            console.log(smslog[i]['_doc']['Content']);
                                            sms_Data.push(smslog[i]['_doc']['Content']);

                                        } catch (e) {
                                            console.error('SMS_LOG', e);
                                        }
                                    }
                                    res.json(sms_Data);
                                }
                            });
                        } else {
                            res.json({ 'Status': 'Error', 'Details': 'Mobile number missing' });
                        }
                    } else {
                        res.json({ 'Status': 'Error', 'Details': 'No Record Found' });
                    }
                }
            });

        } else {
            res.json({ 'msg': 'ss_id is empty' });
        }
    });
    app.get('/user_datas/inspectionlist/:Product_Id/:Ss_Id/:Fba_Id/:Page', function (req, res) {
        try {
            var Product_Id = req.params.Product_Id - 0;
            var Fba_Id = req.params.Fba_Id - 0;
            var Ss_Id = req.params.Ss_Id - 0;
            var Page = req.params.Page - 0;
            var Skip = 0;
            var Limit = 20;

            if (Ss_Id && Page) {
                var Condition = {
                    "Product_Id": Product_Id,
                    "Last_Status": ""
                };
                //agent condition
                Ss_Id = 0;
                if (Ss_Id) {
                    if (Ss_Id === 5417) {
                        Condition['Premium_Request.ss_id'] = 0;
                    } else {
                        if (Ss_Id === 5) {
                            Condition['Premium_Request.fba_id'] = Fba_Id;
                        } else if (Ss_Id !== 5) {
                            Condition['Premium_Request.ss_id'] = Ss_Id;
                        }
                    }
                }

                var ObjSummaryCondition = {
                    'QUOTE': ['INSPECTION_SCHEDULED', 'INSPECTION_APPROVED', 'INSPECTION_REJECTED', 'INSPECTION_EXCEPTION']
                };
                Condition['Last_Status'] = { $in: ObjSummaryCondition['QUOTE'] };

                if (Page > 1) {
                    Skip = Limit * (Page - 1);
                }
                //console.error('UDBG', Ss_Id, Page, Skip, Limit);
                User_Data.find(Condition).sort({
                    Modified_On: -1
                }).select(['Product_Id', 'PB_CRN', 'Request_Unique_Id', 'Report_Summary', 'Premium_Request', 'Proposal_Request', 'Last_Status', 'Created_On', 'Modified_On', 'Client_Id', 'Transaction_Data', 'Erp_Qt_Request_Core', 'Status_History', 'Insurer_Id', 'User_Data_Id', 'Transaction_Data', 'ERP_CS']).skip(Skip).limit(Limit).exec(function (err, dbUsers) {
                    //console.error('UDBG', err, dbUsers);
                    try {
                        if (!err) {
                            var arr_User_Data = [];
                            for (var k in dbUsers) {
                                try {
                                    var user = dbUsers[k]._doc;
                                    var dt = (new Date(user.Modified_On)).toLocaleString();
                                    /* dt = dt.split(',');
                                     var Quote_Date = dt[0];
                                     Quote_Date = moment(Quote_Date).format("DD/MM/YYYY");*/
                                    Quote_Date = dt;
                                    var customer = 'NO NAME';
                                    var mobile = user['Premium_Request']['mobile'];

                                    if (user.hasOwnProperty('Proposal_Request') && user['Proposal_Request'] && user['Proposal_Request'].hasOwnProperty('first_name')) {
                                        customer = user['Proposal_Request']['first_name'] + ' ' + user['Proposal_Request']['last_name'];
                                    } else {
                                        customer = user['Premium_Request']['first_name'] + ' ' + user['Premium_Request']['last_name'];
                                    }

                                    if (hasNumber(customer)) {
                                        customer = 'NO NAME';
                                    }

                                    if (user.hasOwnProperty('Proposal_Request') && user['Proposal_Request'] && user['Proposal_Request'].hasOwnProperty('mobile')) {
                                        mobile = user['Proposal_Request']['mobile'];
                                    }

                                    if (mobile) {
                                        mobile = mobile - 0;
                                    }

                                    if (Ss_Id === 5417) {
                                        customer = customer + '(MO#' + mobile + ')';
                                    }

                                    var contact_name = customer.toString().toTitleCase();
                                    var Sum_Insured = 0;
                                    if (user.Product_Id === 1 || user.Product_Id === 10) {
                                        Sum_Insured = user['Premium_Request']['vehicle_expected_idv'];
                                    }
                                    if (user.Product_Id === 2) {
                                        Sum_Insured = user['Premium_Request']['health_insurance_si'];
                                    }

                                    status_grp = user['Last_Status'];
                                    var objUD = {
                                        'Customer_Name': contact_name,
                                        'Customer_Mobile': mobile,
                                        'Sum_Insured': Sum_Insured,
                                        'CRN': user['PB_CRN'],
                                        'Quote_Date': Quote_Date,
                                        'Created_On': user.Modified_On,
                                        'SRN': user['Request_Unique_Id'] + '_' + user['User_Data_Id'],
                                        'SRN_Core': user['Request_Unique_Id'],
                                        'udid': user['User_Data_Id'],
                                        'Last_Status': user['Last_Status'],
                                        'Application_Date': '',
                                        'Insurer': '',
                                        'Premium': 0,
                                        'ERP_CS': user['ERP_CS']
                                    };
                                    arr_User_Data.push(objUD);
                                } catch (e) {
                                    console.error('inspectionlist : UDBG', e);
                                }
                            }
                            res.json(arr_User_Data);
                        } else {
                            console.error('Exception', 'inspectionlist', err);
                            res.send(err);
                        }
                    } catch (e1) {
                        console.error('Exception', 'inspectionlist', e1);
                    }
                });
            } else {
                res.json({ 'msg': 'inspectionlist : ss_id is empty' });
            }
        } catch (e) {
            console.error('Exception', 'inspectionlist', e);
        }
    });
    app.post('/admin_inspection_list', LoadSession, function (req, res) {
        try {
            var objBase = new Base();
            var obj_pagination = objBase.jqdt_paginate_process(req.body);
            var optionPaginate = {
                select: 'Product_Id PB_CRN Request_Unique_Id Report_Summary Premium_Request Premium_Summary Proposal_Request Last_Status Created_On Modified_On Client_Id Transaction_Data Erp_Qt_Request_Core Status_History Insurer_Id User_Data_Id Transaction_Data ERP_CS Service_Log_Unique_Id Proposal_History Premium_List',
                sort: { 'Modified_On': -1 },
                lean: true,
                page: 1,
                limit: 10
            };
            if (obj_pagination) {
                optionPaginate['page'] = obj_pagination.paginate.page;
                optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
            }
            var filter = obj_pagination.filter;

            var Product_Id = req.body.ProductID - 0;
            var Fba_Id = req.body.fbaid - 0;
            var Type = req.body.Type;
            var Ss_Id = req.body.ss_id - 0;
            //var Mobile = (req.params.hasOwnProperty('Mobile')) ? req.params.Mobile : 0;
            var Sub_Fba_Id = req.body.sub_fba_id;
            if (Ss_Id && Type) {
                var Condition = {
                    "Product_Id": Product_Id
                    //"Last_Status": ""
                };

                //agent condition
                if (Ss_Id) { //10859
                    if (Ss_Id === 10859 && Product_Id === 2) {
                        //Condition['Premium_Request.ss_id'] = 0;
                    } else if (Ss_Id === 5417) {
                        //Condition['Premium_Request.ss_id'] = 0;
                    } else if (Ss_Id === 7844 || Ss_Id === 8048 || Ss_Id === 12311) {
                        Condition['Premium_Request.posp_sources'] = 1;
                    } else if (Ss_Id === 8304) {
                        Condition['Premium_Request.posp_sources'] = 2;
                    } else if (Type === 'INSPECTION' && (Ss_Id === 822)) {
                    } else {
                        if (Ss_Id === 5) {
                            Condition['Premium_Request.fba_id'] = Fba_Id;
                        } else if (Ss_Id !== 5) {
                            //Condition['Premium_Request.ss_id'] = Ss_Id;
                            if (Sub_Fba_Id > 0) {
                                Condition['Premium_Request.sub_fba_id'] = Sub_Fba_Id;
                            }
                        }
                    }
                }

                if (Product_Id === 22) { //hospicash 
                    Condition['Premium_Request.is_hospi'] = "yes";
                    Condition['Product_Id'] = 2;
                } else if (Product_Id === 23) //Group health Insurance 
                {
                    Condition['Premium_Request.is_ghi'] = "yes";
                    Condition['Product_Id'] = 2;
                } else if (Product_Id === 42) //Shortteam Policy
                {
                    Condition['Premium_Request.is_short_term_policy'] = "yes";
                    Condition['Product_Id'] = 2;
                } else {

                }
                if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1) {
                } else if (req.obj_session.user.role_detail.role.indexOf('ChannelHead') > -1) {
                    var arr_ch_ssid = [];
                    if (req.obj_session.hasOwnProperty('users_assigned')) {
                        arr_ch_ssid = req.obj_session.users_assigned.Team.CSE;
                    }
                    arr_ch_ssid.push(req.obj_session.user.ss_id);
                    channel = req.obj_session.user.role_detail.channel;
                    filter['$or'] = [
                        { 'channel': channel },
                        { 'ss_id': { $in: arr_ch_ssid } }
                    ];
                } else {
                    var arr_ssid = [];
                    if (req.obj_session.hasOwnProperty('users_assigned')) {
                        var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
                        arr_ssid = combine_arr.split(',').filter(Number).map(Number);

                    }
                    arr_ssid.push(req.obj_session.user.ss_id);
                    filter['ss_id'] = { $in: arr_ssid };
                }
                //type condition
                var ObjSummaryStatus = {
                    'SEARCH': ['SEARCH', 'ADDON_QUOTE_APPLY', 'ADDON_PROPOSAL_AGENT_APPLY', 'BUY_NOW_AGENT'],
                    'LINK_SENT': ['PROPOSAL_LINK_SENT', 'BUY_NOW_CUSTOMER', 'ADDON_PROPOSAL_CUSTOMER_APPLY', 'ADDON_QUOTE_APPLY', 'ADDON_PROPOSAL_AGENT_APPLY', 'BUY_NOW_AGENT'],
                    'PAYMENT_PENDING': ['PROPOSAL_SUBMIT', 'PROPOSAL_EXCEPTION'],
                    'POLICY_PENDING': ['VERIFICATION_EXCEPTION', 'TRANS_MANUAL_PAYPASS', 'TRANS_PAYPASS'],
                    'FAIL': ['TRANS_FAIL'],
                    'SELL': ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY']
                };
                var ObjSummaryCondition = {
                    'QUOTE': ['SEARCH', 'ADDON_PROPOSAL_CUSTOMER_APPLY', 'ADDON_QUOTE_APPLY', 'ADDON_PROPOSAL_AGENT_APPLY'],
                    'APPLICATION': ['PROPOSAL_LINK_SENT', 'BUY_NOW_CUSTOMER', 'BUY_NOW_AGENT', 'PROPOSAL_SUBMIT', 'PROPOSAL_EXCEPTION', 'TRANS_FAIL', 'PROPOSAL_SAVE_AGENT'],
                    'COMPLETE': ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY', 'VERIFICATION_EXCEPTION', 'TRANS_MANUAL_PAYPASS', 'TRANS_PAYPASS'],
                    'INSPECTION': ['INSPECTION_SCHEDULED', 'INSPECTION_APPROVED', 'INSPECTION_REJECTED', 'INSPECTION_EXCEPTION', 'INSPECTION_REINSPECTION', 'INSPECTION_SUBMITTED'],
                    'INSPECTION_SUBMITTED': ['INSPECTION_SUBMITTED'],
                    'PENDING_PAYMENT': ['PROPOSAL_SUBMIT', 'PROPOSAL_EXCEPTION', 'TRANS_FAIL'],
                    'SENDLINK': ['PROPOSAL_LINK_SENT'],
                    'PROPOSALSUBMIT': ['PROPOSAL_SUBMIT', 'PROPOSAL_EXCEPTION']
                };
                if (Type === 'SEARCH') {
                    Condition['Last_Status'] = { $in: ObjSummaryCondition['QUOTE'] };
                }
                if (Type === 'APPLICATION') {
                    Condition['Last_Status'] = { $in: ObjSummaryCondition['APPLICATION'] };
                }
                if (Type === 'SELL') {
                    Condition['Last_Status'] = { $in: ObjSummaryCondition['COMPLETE'] };
                }
                if (Type === 'INSPECTION' && (Ss_Id !== 822)) {
                    Condition['Last_Status'] = { $in: ObjSummaryCondition['INSPECTION'] };
                }

                if (Type === 'INSPECTION' && (Ss_Id === 822)) {
                    Condition['Last_Status'] = { $in: ObjSummaryCondition['INSPECTION_SUBMITTED'] };
                }
                if (Type === 'PENDING_PAYMENT') {
                    Condition['Last_Status'] = { $in: ObjSummaryCondition['PENDING_PAYMENT'] };
                }
                if (Type === 'SENDLINK') {
                    Condition['Last_Status'] = { $in: ObjSummaryCondition['SENDLINK'] };
                }
                if (Type === 'PROPOSALSUBMIT') {
                    Condition['Last_Status'] = { $in: ObjSummaryCondition['PROPOSALSUBMIT'] };
                }

                if (req.body.crn !== "" && req.body.crn !== undefined) {
                    Condition['PB_CRN'] = parseInt(req.body.crn);
                }
                if (req.body.mobile !== undefined && req.body.mobile > 0) {
                    Condition['Premium_Request.mobile'] = req.body.mobile;
                }
                if (req.body.regNo !== "" && req.body.regNo !== undefined) {
                    Condition['Premium_Request.registration_no'] = req.body.regNo;
                }
                if (req.body.email !== "" && req.body.email !== undefined) {
                    Condition['Premium_Request.email'] = req.body.email;
                }


                User_Data.paginate(Condition, optionPaginate).then(function (dbUsers) {
                    try {
                        res.json(dbUsers);
                    } catch (e1) {
                        console.error('Exception', 'QuickList1', e1);
                    }
                });
            } else {
                res.json({ 'msg': 'ss_id is empty' });
            }
        } catch (e) {
            console.error('Exception', 'QuickList', e);
        }
    });
    app.get('/user_datas/search/:Product_Id/:Type/:Ss_Id/:Fba_Id/:Searched_By/:Searched_Value/:Mobile', function (req, res) {
        try {
            var Product_Id = req.params.Product_Id - 0;
            var Search_Key = req.params.Searched_By;
            var Search_Val = req.params.Searched_Value;
            var Fba_Id = req.params.Fba_Id - 0;
            var Ss_Id = req.params.Ss_Id - 0;
            var Mobile = (req.params.hasOwnProperty('Mobile')) ? req.params.Mobile : 0;
            var Type = req.params.Type;

            if (Search_Key || Search_Val) {
                var Condition = {};
                //agent condition
                if (Search_Key === 'Name') {
                    if (Search_Val !== '' || Search_Val !== null) {
                        var customer_name = Search_Val.split(' ');
                        var first_name = customer_name[0];
                        var last_name = customer_name[customer_name.length - 1];
                        var middle_name = '';
                        var serch_str = '{"Premium_Request.first_name": first_name}';
                        last_name = new RegExp(last_name, 'i');
                        if (customer_name.length > 2) {
                            middle_name = customer_name[1];
                            middle_name = new RegExp(middle_name, 'i');
                        }
                        first_name = new RegExp(first_name, 'i');
                        if (customer_name.length > 2) {
                            Condition = {
                                $and: [
                                    {
                                        $or: [
                                            { "Premium_Request.first_name": first_name },
                                            { "Premium_Request.middle_name": middle_name },
                                            { "Premium_Request.last_name": last_name }
                                        ]
                                    },
                                    {
                                        // "Premium_Request.ss_id": Ss_Id,
                                        "Product_Id": Product_Id
                                    }
                                ]
                            };
                        } else {
                            Condition = {
                                $and: [
                                    {
                                        $or: [
                                            { "Premium_Request.first_name": first_name },
                                            { "Premium_Request.last_name": last_name }
                                        ]
                                    },
                                    {
                                        // "Premium_Request.ss_id": Ss_Id,
                                        "Product_Id": Product_Id
                                    }
                                ]
                            };
                        }
                    }
                } else if (Search_Key === 'CRN') {
                    Condition['PB_CRN'] = Search_Val - 0;
                    Condition['Product_Id'] = Product_Id;
                } else if (Search_Key === 'Reg_No') {
                    Condition['Premium_Request.registration_no'] = Search_Val;
                } else if (Search_Key === 'Mobile_No') {
                    Condition['Premium_Request.mobile'] = Search_Val;
                } else if (Search_Key === 'Email') {
                    Condition['Premium_Request.email'] = Search_Val;
                }

                if (Ss_Id) { //10859
                    if (Ss_Id === 10859 && Product_Id === 2) {
                        Condition['Premium_Request.ss_id'] = 0;
                    } else if (Ss_Id === 5417) {
                        Condition['Premium_Request.ss_id'] = 0;
                    } else if (Ss_Id === 7844 || Ss_Id === 8048 || Ss_Id === 12311) {
                        Condition['Premium_Request.posp_sources'] = { $in: [1, "1"] };
                    } else if (Ss_Id === 8304) {
                        Condition['Premium_Request.posp_sources'] = { $in: [2, "2"] };
                    } else if (Type === 'INSPECTION' && Ss_Id === 487) {
                    } else {
                        if (Ss_Id === 5) {
                            Condition['Premium_Request.fba_id'] = Fba_Id;
                        } else if (Ss_Id !== 5) {
                            Condition['Premium_Request.ss_id'] = Ss_Id;
                        }
                    }
                }

                if (Mobile > 0) {
                    Condition['Premium_Request.mobile'] = Mobile;
                }
                //console.log(Condition);
                var ObjSummaryStatus = {
                    'SEARCH': ['SEARCH', 'ADDON_QUOTE_APPLY', 'ADDON_PROPOSAL_AGENT_APPLY', 'BUY_NOW_AGENT'],
                    'LINK_SENT': ['PROPOSAL_LINK_SENT', 'BUY_NOW_CUSTOMER', 'ADDON_PROPOSAL_CUSTOMER_APPLY', 'ADDON_QUOTE_APPLY', 'ADDON_PROPOSAL_AGENT_APPLY', 'BUY_NOW_AGENT'],
                    'PAYMENT_PENDING': ['PROPOSAL_SUBMIT', 'PROPOSAL_EXCEPTION'],
                    'POLICY_PENDING': ['VERIFICATION_EXCEPTION', 'TRANS_MANUAL_PAYPASS', 'TRANS_PAYPASS'],
                    'FAIL': ['TRANS_FAIL'],
                    'SELL': ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY']
                };
                var ObjSummaryCondition = {
                    'QUOTE': ['SEARCH', 'ADDON_PROPOSAL_CUSTOMER_APPLY', 'ADDON_QUOTE_APPLY', 'ADDON_PROPOSAL_AGENT_APPLY'],
                    'APPLICATION': ['PROPOSAL_LINK_SENT', 'BUY_NOW_CUSTOMER', 'BUY_NOW_AGENT', 'PROPOSAL_SUBMIT', 'PROPOSAL_EXCEPTION', 'TRANS_FAIL'],
                    'COMPLETE': ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY', 'VERIFICATION_EXCEPTION', 'TRANS_MANUAL_PAYPASS', 'TRANS_PAYPASS'],
                    'INSPECTION': ['INSPECTION_SCHEDULED', 'INSPECTION_APPROVED', 'INSPECTION_REJECTED', 'INSPECTION_EXCEPTION', 'INSPECTION_REINSPECTION', 'INSPECTION_SUBMITTED'],
                    'INSPECTION_SUBMITTED': ['INSPECTION_SUBMITTED']
                };

                if (Type === 'SEARCH') {
                    Condition['Last_Status'] = { $in: ObjSummaryCondition['QUOTE'] };
                }
                if (Type === 'APPLICATION') {
                    Condition['Last_Status'] = { $in: ObjSummaryCondition['APPLICATION'] };
                }
                if (Type === 'SELL') {
                    Condition['Last_Status'] = { $in: ObjSummaryCondition['COMPLETE'] };
                }
                if (Type === 'INSPECTION' && Ss_Id !== 487) {
                    Condition['Last_Status'] = { $in: ObjSummaryCondition['INSPECTION'] };
                }
                if (Type === 'INSPECTION' && Ss_Id === 487) {
                    Condition['Last_Status'] = { $in: ObjSummaryCondition['INSPECTION_SUBMITTED'] };
                }
                if (Product_Id === 22) { //hospicash 
                    Condition['Premium_Request.is_hospi'] = "yes";
                    Condition['Product_Id'] = 2;
                } else if (Product_Id === 23) //Group health Insurance 
                {
                    Condition['Premium_Request.is_ghi'] = "yes";
                    Condition['Product_Id'] = 2;
                } else if (Product_Id === 42) //Shortteam Policy
                {
                    Condition['Premium_Request.is_short_term_policy'] = "yes";
                    Condition['Product_Id'] = 2;
                } else {

                }
                console.log(Condition);
                //console.error('UDBG', Ss_Id, Page, Skip, Limit);//"Premium_Request.first_name":Name
                User_Data.find(Condition).exec(function (err, dbUsers) {
                    //console.error('UDBG', err, dbUsers);
                    try {
                        if (!err) {
                            var arr_User_Data = [];
                            for (var k in dbUsers) {
                                try {
                                    var user = dbUsers[k];
                                    var dt = (new Date(user.Modified_On)).toLocaleString();
                                    /*dt = dt.split(',');
                                     var Quote_Date = dt[0];
                                     Quote_Date = moment(Quote_Date).format("DD/MM/YYYY");*/
                                    var Quote_Date = dt;
                                    var contact_name = user['Premium_Request'].hasOwnProperty('first_name') ? (user['Premium_Request']['first_name'] + ' ' + user['Premium_Request']['last_name']) : user['Premium_Request']['contact_name'];
                                    contact_name = contact_name.toString().toTitleCase();
                                    var Sum_Insured = 0;
                                    var Quote_Date_Mobile = dt[0];
                                    Quote_Date_Mobile = moment(Quote_Date).format("DD/MM/YYYY");
                                    if (user.Product_Id === 1 || user.Product_Id === 10) {
                                        Sum_Insured = user['Premium_Request']['vehicle_expected_idv'];
                                    }
                                    if (user.Product_Id === 2) {
                                        Sum_Insured = user['Premium_Request']['health_insurance_si'];
                                    }
                                    if (user.Product_Id === 5) {
                                        Sum_Insured = user['Premium_Request']['investment_amount'] + '/' + user['Premium_Request']['frequency'];
                                    }
                                    //                                    for (var k in ObjSummaryStatus) {
                                    //                                        if (ObjSummaryStatus[k].indexOf(user['Last_Status'])>=0) {
                                    //                                            status_grp = k;
                                    //                                            break;
                                    //                                        }
                                    //                                    }
                                    status_grp = user['Last_Status'];
                                    var Progress = 0;
                                    var Color_code = "";
                                    if (ObjSummaryStatus['LINK_SENT'].indexOf(status_grp) > -1) {
                                        Progress = 50;
                                        Color_code = "red";
                                    }
                                    if (ObjSummaryStatus['FAIL'].indexOf(status_grp) > -1) {
                                        Progress = 70;
                                        Color_code = "blue";
                                    }
                                    if (ObjSummaryStatus['PAYMENT_PENDING'].indexOf(status_grp) > -1) {
                                        Progress = 80;
                                        Color_code = "yellow";
                                    }
                                    if (ObjSummaryStatus['POLICY_PENDING'].indexOf(status_grp) > -1) {
                                        Progress = 90;
                                        Color_code = "pink";
                                    }
                                    if (ObjSummaryStatus['SELL'].indexOf(status_grp) > -1) {
                                        Progress = 100;
                                        Color_code = "green";
                                    }
                                    var objUD = {
                                        'Customer_Name': contact_name,
                                        'Customer_Mobile': user['Premium_Request']['mobile'],
                                        'Sum_Insured': Sum_Insured,
                                        'CRN': user['PB_CRN'],
                                        'Quote_Date': Quote_Date,
                                        'Quote_Date_Mobile': Quote_Date_Mobile,
                                        'Created_On': user.Modified_On,
                                        'SRN': user['Request_Unique_Id'] + '_' + user['User_Data_Id'],
                                        'SRN_Core': user['Request_Unique_Id'],
                                        'Last_Status': user['Last_Status'],
                                        'Application_Date': '',
                                        'Insurer': '',
                                        'Progress': Progress,
                                        'Premium': 0,
                                        'User_Data_Id': user['User_Data_Id'],
                                        'ERP_CS': user['ERP_CS'],
                                        'Color_code': Color_code
                                    };
                                    if (Type === 'SEARCH' || Type === 'ALL') {
                                        var args = {
                                            data: {
                                                "search_reference_number": user['Request_Unique_Id'],
                                                "udid": user['User_Data_Id'],
                                                "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
                                                "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9"
                                            },
                                            headers: {
                                                "Content-Type": "application/json"
                                            }
                                        };
                                        var url_api = config.environment.weburl + '/quote/premium_summary';
                                        //execute_post(url_api, args);
                                        var Client = require('node-rest-client').Client;
                                        var client = new Client();
                                        client.post(url_api, args, function (data, response) {

                                            objUD['Vehicle_Name'] = data['Master']['Vehicle']['Description'];
                                            objUD['RTO'] = data['Master']['Rto']['RTO_City'];
                                        });
                                        sleep(500);
                                    }
                                    if (Type !== 'SEARCH') {
                                        var Application_Date = '';
                                        objUD['Insurer'] = user['Insurer_Id'];
                                        for (var k in user.Status_History) {
                                            if (user.Status_History[k]['Status'] === 'PROPOSAL_LINK_SENT') {
                                                var dt = (new Date(user.Status_History[k]['StatusOn'])).toLocaleString();
                                                dt = dt.split(',');
                                                Application_Date = dt[0];
                                                Application_Date = moment(Quote_Date).format("DD/MM/YYYY");
                                                break;
                                            }
                                        }
                                        objUD['Application_Date'] = Application_Date;
                                    }
                                    if (Type === 'APPLICATION' && user.Product_Id === 5) {
                                        for (var k in user.Premium_List['Response']) {
                                            objUD['Insurer'] = user.Premium_List['Response'][k]['Insurer'];

                                        }
                                    }
                                    if (Type === 'SELL') {
                                        objUD['policy_url'] = user['Transaction_Data']['policy_url'];
                                    }
                                    arr_User_Data.push(objUD);
                                } catch (e) {
                                    console.error('UDBG', e);
                                }
                            }
                            res.json(arr_User_Data);
                        } else {
                            console.error('Exception', 'searchcrnDBError', err);
                            res.send(err);

                        }
                    } catch (e1) {
                        console.error('Exception', 'searchcrn1', e1);
                    }
                });
            } else {
                res.json({ 'msg': 'ss_id is empty' });
            }
        } catch (e) {
            console.error('Exception', 'searchcrn', e);
        }
    });

    app.get('/user_datas/search1/:Product_Id/:Ss_Id/:Fba_Id/:Searched_By/:Searched_Value/:Mobile', function (req, res) {
        try {
            var Product_Id = req.params.Product_Id - 0;
            var Search_Key = req.params.Searched_By;
            var Search_Val = req.params.Searched_Value;
            var Fba_Id = req.params.Fba_Id - 0;
            var Ss_Id = req.params.Ss_Id - 0;
            var Mobile = (req.params.hasOwnProperty('Mobile')) ? req.params.Mobile : 0;
            var Type = req.params.Type;


            if (Search_Key || Search_Val) {
                var Condition = {};
                //agent condition
                if (Search_Key === 'Name') {
                    if (Search_Val !== '' || Search_Val !== null) {
                        var customer_name = Search_Val.split(' ');
                        var first_name = customer_name[0];
                        var last_name = customer_name[customer_name.length - 1];
                        var middle_name = '';
                        var serch_str = '{"Premium_Request.first_name": first_name}';
                        last_name = new RegExp(last_name, 'i');
                        if (customer_name.length > 2) {
                            middle_name = customer_name[1];
                            middle_name = new RegExp(middle_name, 'i');
                        }
                        first_name = new RegExp(first_name, 'i');
                        if (customer_name.length > 2) {
                            Condition = {
                                $and: [
                                    {
                                        $or: [
                                            { "Premium_Request.first_name": first_name },
                                            { "Premium_Request.middle_name": middle_name },
                                            { "Premium_Request.last_name": last_name }
                                        ]
                                    },
                                    {
                                        // "Premium_Request.ss_id": Ss_Id,
                                        "Product_Id": Product_Id
                                    }
                                ]
                            };
                        } else {
                            Condition = {
                                $and: [
                                    {
                                        $or: [
                                            { "Premium_Request.first_name": first_name },
                                            { "Premium_Request.last_name": last_name }
                                        ]
                                    },
                                    {
                                        // "Premium_Request.ss_id": Ss_Id,
                                        "Product_Id": Product_Id
                                    }
                                ]
                            };
                        }
                    }
                } else if (Search_Key === 'CRN') {
                    Condition['PB_CRN'] = Search_Val - 0;
                    Condition['Product_Id'] = Product_Id;
                } else if (Search_Key === 'Registration_no') {
                    Condition['Premium_Request.registration_no'] = Search_Val;
                }

                if (Ss_Id) {
                    if (Ss_Id === 5417) {
                        Condition['Premium_Request.ss_id'] = 0;
                    } else {
                        if (Ss_Id === 5) {
                            Condition['Premium_Request.fba_id'] = Fba_Id;
                        } else if (Ss_Id !== 5) {
                            Condition['Premium_Request.ss_id'] = Ss_Id;
                        }
                    }
                }

                if (Mobile > 0) {
                    Condition['Premium_Request.mobile'] = Mobile;
                }
                //console.log(Condition);
                var ObjSummaryStatus = {
                    'SEARCH': ['SEARCH', 'ADDON_QUOTE_APPLY', 'ADDON_PROPOSAL_AGENT_APPLY', 'BUY_NOW_AGENT'],
                    'LINK_SENT': ['PROPOSAL_LINK_SENT', 'BUY_NOW_CUSTOMER', 'ADDON_PROPOSAL_CUSTOMER_APPLY', 'ADDON_QUOTE_APPLY', 'ADDON_PROPOSAL_AGENT_APPLY', 'BUY_NOW_AGENT'],
                    'PAYMENT_PENDING': ['PROPOSAL_SUBMIT', 'PROPOSAL_EXCEPTION'],
                    'POLICY_PENDING': ['VERIFICATION_EXCEPTION', 'TRANS_MANUAL_PAYPASS', 'TRANS_PAYPASS'],
                    'FAIL': ['TRANS_FAIL'],
                    'SELL': ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY']
                };
                var ObjSummaryCondition = {
                    'QUOTE': ['SEARCH', 'ADDON_PROPOSAL_CUSTOMER_APPLY', 'ADDON_QUOTE_APPLY', 'ADDON_PROPOSAL_AGENT_APPLY'],
                    'APPLICATION': ['PROPOSAL_LINK_SENT', 'BUY_NOW_CUSTOMER', 'BUY_NOW_AGENT', 'PROPOSAL_SUBMIT', 'PROPOSAL_EXCEPTION', 'TRANS_FAIL'],
                    'COMPLETE': ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY', 'VERIFICATION_EXCEPTION', 'TRANS_MANUAL_PAYPASS', 'TRANS_PAYPASS']
                };

                //                if (Type == 'SEARCH') {
                //                    Condition['Last_Status'] = {$in: ObjSummaryCondition['QUOTE']};
                //                }
                //                if (Type == 'APPLICATION') {
                //                    Condition['Last_Status'] = {$in: ObjSummaryCondition['APPLICATION']};
                //                }
                //                if (Type == 'SELL') {
                //                    Condition['Last_Status'] = {$in: ObjSummaryCondition['COMPLETE']};
                //                }
                //console.error('UDBG', Ss_Id, Page, Skip, Limit);//"Premium_Request.first_name":Name
                console.log(Condition);
                User_Data.find(Condition).exec(function (err, dbUsers) {
                    //console.error('UDBG', err, dbUsers);
                    try {
                        if (!err) {
                            var arr_User_Data = [];
                            for (var k in dbUsers) {
                                try {

                                    var user = dbUsers[k]._doc;
                                    var dt = (new Date(user.Modified_On)).toLocaleString();
                                    var Quote_Date = dt;
                                    var Sum_Insured = 0;
                                    var Quote_Date_Mobile = dt[0];
                                    Quote_Date_Mobile = moment(Quote_Date).format("DD/MM/YYYY");
                                    var customer = 'NO NAME';
                                    var mobile = user['Premium_Request']['mobile'];


                                    if (user.hasOwnProperty('Proposal_Request') && user['Proposal_Request'] && user['Proposal_Request'].hasOwnProperty('first_name')) {
                                        customer = user['Proposal_Request']['first_name'] + ' ' + user['Proposal_Request']['last_name'];
                                    } else {
                                        if (user.Product_Id === 2) {
                                            customer = user['Premium_Request']['contact_name'];
                                        } else {
                                            customer = user['Premium_Request']['first_name'] + ' ' + user['Premium_Request']['last_name'];
                                        }
                                    }

                                    if (hasNumber(customer)) {
                                        customer = 'NO NAME';
                                    }



                                    if (user.hasOwnProperty('Proposal_Request') && user['Proposal_Request'] && user['Proposal_Request'].hasOwnProperty('mobile')) {
                                        mobile = user['Proposal_Request']['mobile'];
                                    }

                                    if (mobile) {
                                        mobile = mobile - 0;
                                    }



                                    if (Ss_Id === 5417) {
                                        customer = customer + '(MO#' + mobile + ')';
                                    }

                                    var contact_name = customer.toString().toTitleCase();
                                    var Sum_Insured = 0;
                                    if (user.Product_Id === 1 || user.Product_Id === 10) {
                                        Sum_Insured = user['Premium_Request']['vehicle_expected_idv'];
                                    }
                                    if (user.Product_Id === 2) {
                                        Sum_Insured = user['Premium_Request']['health_insurance_si'];
                                    }
                                    status_grp = user['Last_Status'];
                                    var Status = "";
                                    if (ObjSummaryCondition['QUOTE'].indexOf(status_grp) > -1) {
                                        Status = "QUOTE";
                                    }
                                    if (ObjSummaryCondition['APPLICATION'].indexOf(status_grp) > -1) {
                                        Status = "APPLICATION";
                                    }
                                    if (ObjSummaryCondition['COMPLETE'].indexOf(status_grp) > -1) {
                                        Status = "COMPLETE";
                                    }


                                    var Progress = 0;
                                    if (ObjSummaryStatus['LINK_SENT'].indexOf(status_grp) > -1) {
                                        Progress = 50;
                                    }
                                    if (ObjSummaryStatus['FAIL'].indexOf(status_grp) > -1) {
                                        Progress = 70;
                                    }
                                    if (ObjSummaryStatus['PAYMENT_PENDING'].indexOf(status_grp) > -1) {
                                        Progress = 80;
                                    }
                                    if (ObjSummaryStatus['POLICY_PENDING'].indexOf(status_grp) > -1) {
                                        Progress = 90;
                                    }
                                    if (ObjSummaryStatus['SELL'].indexOf(status_grp) > -1) {
                                        Progress = 100;
                                    }
                                    var objUD = {
                                        'Customer_Name': contact_name,
                                        'Customer_Mobile': user['Premium_Request']['mobile'],
                                        'Sum_Insured': Sum_Insured,
                                        'CRN': user['PB_CRN'],
                                        'Quote_Date': Quote_Date,
                                        'Quote_Date_Mobile': Quote_Date_Mobile,
                                        'Created_On': user.Modified_On,
                                        'SRN': user['Request_Unique_Id'] + '_' + user['User_Data_Id'],
                                        'SRN_Core': user['Request_Unique_Id'],
                                        'Last_Status': user['Last_Status'],
                                        'Application_Date': '',
                                        'Insurer': '',
                                        'Progress': Progress,
                                        'Premium': 0,
                                        'User_Data_Id': user['User_Data_Id'],
                                        'Status': Status
                                    };
                                    if (Type !== 'SEARCH') {
                                        var Application_Date = '';
                                        objUD['Insurer'] = user['Insurer_Id'];
                                        for (var k in user.Status_History) {
                                            if (user.Status_History[k]['Status'] === 'PROPOSAL_LINK_SENT') {
                                                var dt = (new Date(user.Status_History[k]['StatusOn'])).toLocaleString();
                                                dt = dt.split(',');
                                                Application_Date = dt[0];
                                                Application_Date = moment(Quote_Date).format("DD/MM/YYYY");
                                                break;
                                            }
                                        }
                                        objUD['Application_Date'] = Application_Date;
                                    }
                                    if (Type === 'SELL') {
                                        objUD['policy_url'] = user['Transaction_Data']['policy_url'];
                                    }
                                    arr_User_Data.push(objUD);
                                } catch (e) {
                                    console.error('UDBG', e);
                                }
                            }
                            res.json(arr_User_Data);
                        } else {
                            console.error('Exception', 'searchcrnDBError', err);
                            res.send(err);

                        }
                    } catch (e1) {
                        console.error('Exception', 'searchcrn1', e1);
                    }
                });
            } else {
                res.json({ 'msg': 'ss_id is empty' });
            }
        } catch (e) {
            console.error('Exception', 'searchcrn', e);
        }
    });


    app.get('/user_datas/getAgentDetails/:abc', function (req, res) {
        try {
            var Condition = {};
            var ObjSummaryStatus = {
                'PAYMENT_PENDING': ['VERIFICATION_EXCEPTION', 'TRANS_MANUAL_PAYPASS', 'TRANS_PAYPASS', 'TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY']
            };
            Condition['Last_Status'] = { $nin: ObjSummaryStatus['PAYMENT_PENDING'] };
            Condition['Premium_Request.vehicle_insurance_type'] = 'renew';
            Condition['Premium_Request.ss_id'] = { "$gt": 0 };
            var dateFrom = "2019-06-16";
            Condition['Premium_Request.policy_expiry_date'] = { "$gt": dateFrom };
            // db.getCollection('user_datas').aggregate( [ { $match: { 
            //Last_Status:{$in:['PROPOSAL_SUBMIT','PROPOSAL_EXCEPTION','PROPOSAL_LINK_SENT','TRANS_FAIL']},
            //'Premium_Request.policy_expiry_date':{"$gt":'2018-06-16'},'Premium_Request.vehicle_insurance_type' : 'renew'}},
            //{ $group :{ _id : {ss_id: "$Premium_Request.ss_id",Product_name :"$Product_Id",
            //ss_id:"$Premium_Request.ss_id"},
            //total : { $sum : 1 }} } ] )
            var agg = [
                {
                    $match: {
                        Last_Status: { $in: ['PROPOSAL_SUBMIT', 'PROPOSAL_EXCEPTION', 'PROPOSAL_LINK_SENT', 'TRANS_FAIL'] },
                        'Premium_Request.policy_expiry_date': { "$gt": '2018-06-16' }, 'Premium_Request.vehicle_insurance_type': 'renew', 'Premium_Request.ss_id': { "$gt": 0 }
                    }
                },
                {
                    $group: {
                        _id: { ss_id: "$Premium_Request.ss_id", Product_name: "$Product_Id", Email_Id: "$Premium_Request.posp_email_id", Mobile_No: "$Premium_Request.posp_mobile_no" },
                        total: { $sum: 1 }
                    }
                }
            ];

            User_Data.aggregate(agg, function (err, rtos) {
                if (err)
                    res.send(err);
                res.json(rtos);
            });


        } catch (e) {
            console.error('Exception getAgentDetails', e);
        }
    });

    app.get('/user_datas/getRMDetails/:ss_id', function (req, res) {
        try {
            var Condition = {};
        } catch (e) {
            console.error('Exception getRMDetails', e);
        }

    });
    app.get('/user_datas/send_email/vehicle_class_available', function (req, res) {
        try {
            let PB_CRN = req.query['PB_CRN'] || 0;
            PB_CRN = PB_CRN - 0;
            let Registration_No = req.query['Registration_Number'] || '';
            User_Data.findOne({ 'PB_CRN': PB_CRN, 'Is_Last': 'yes' }).exec(function (err, dbUserData) {
                try {
                    if (dbUserData) {
                        dbUserData = dbUserData._doc;
                        var obj_product_action = {
                            1: 'car-insurance',
                            10: 'two-wheeler-insurance',
                            12: 'commercial-vehicle-insurance',
                            2: 'health-insurance',
                            8: 'personal-accident',
                            13: 'marine-insurance',
                            18: 'cyber-insurance'
                        };
                        let obj_product = {
                            1: 'CAR',
                            10: 'TW',
                            12: 'CV'
                        };
                        let email = '';
                        if (dbUserData['Premium_Request']['email'] && dbUserData['Premium_Request']['email'].indexOf('@') > -1) {
                            email = dbUserData['Premium_Request']['email'];
                        } else if (dbUserData['Proposal_Request']['email'] && dbUserData['Proposal_Request']['email'].indexOf('@') > -1) {
                            email = dbUserData['Proposal_Request']['email'];
                        } else if (dbUserData['Proposal_Request_Core']['email'] && dbUserData['Proposal_Request_Core']['email'].indexOf('@') > -1) {
                            email = dbUserData['Proposal_Request_Core']['email'];
                        }
                        if (email !== '') {
                            let Proposal_History = dbUserData['Proposal_History'] || [];
                            let Proposal_Page_URL = '';
                            if (Proposal_History.length > 0) {
                                Proposal_History = Proposal_History[Proposal_History.length - 1];
                                Proposal_Page_URL = (Proposal_History.hasOwnProperty('Service_Log_Unique_Id')) ? config.environment.portalurl + '/' + obj_product_action[dbUserData['Product_Id']] + '/proposal?ClientID=' + dbUserData.Client_Id + '&ARN=' + Proposal_History['Service_Log_Unique_Id'] + "_" + Proposal_History['Form_Data']['slid'] + "_" + dbUserData['User_Data_Id'] + '&POSP=NONPOSP&SsID=' + dbUserData['Premium_Request']['ss_id'] : '';
                            }
                            let sub = '[' + obj_product[dbUserData['Product_Id']] + '] Vehicle Class Available CRN : ' + dbUserData['PB_CRN'];


                            let obj_email_content = {
                                '___customer_name___': (dbUserData['Proposal_Request'] && dbUserData['Proposal_Request']['first_name']) ? (dbUserData['Proposal_Request']['first_name'] + ' ' + dbUserData['Proposal_Request']['last_name']).toString().toTitleCase() : 'Customer',
                                '___posp_first_name___': dbUserData['Premium_Request']['posp_first_name'].toString().toTitleCase(),
                                '___crn___': dbUserData['PB_CRN'],
                                '___vehicle_text___': obj_product[dbUserData['Product_Id']],
                                '___product___': obj_product[dbUserData['Product_Id']],
                                '___registration_no___': Registration_No,
                                '___payment_link___': Proposal_Page_URL
                            }
                            let email_content = fs.readFileSync(appRoot + '/resource/email/Send_Vehicle_Class_Availability.html').toString();
                            email_content = email_content.replaceJson(obj_email_content);
                            if (Proposal_Page_URL !== '') {
                                email_content = email_content.replace('<!--', '');
                                email_content = email_content.replace('-->', '');
                            }
                            var Email = require('../models/email');
                            var objModelEmail = new Email();
                            let agentemail = dbUserData['Premium_Request']['posp_email_id'];
                            let rmemail = dbUserData['Premium_Request']['posp_reporting_email_id'];
                            if (req.query['dbg'] == 'YES') {
                                objModelEmail.send('customercare@policyboss.com', config.environment.notification_email, sub, email_content, '', '', dbUserData['PB_CRN']);
                            } else {
                                objModelEmail.send('customercare@policyboss.com', agentemail, sub, email_content, rmemail, config.environment.notification_email, dbUserData['PB_CRN']);
                            }
                            res.send('email send');
                        }
                    } else {
                        res.send('no data');
                    }
                } catch (e) {
                    res.send(e.stack);
                }
            });
        } catch (e) {
            res.send(e.stack);
        }
    });
    app.get('/user_datas/RM_report/:uid/:user', function (req, res) {
        console.error('RM_report');
        var UID = req.params.uid - 0;
        var SwitchUser_type = req.params.user;
        var cond_ud = { 'Premium_Request.posp_reporting_agent_uid': UID };
        var user_data = require('../models/user_data');
        var obj_schema = {
            'source': '',
            'ss_id': 'ss_id',
            'fba_id': 'posp_fba_id',
            'name': '',
            'email': 'posp_email_id',
            'mobile': 'posp_mobile_no',
            'car_count': '',
            'tw_count': '',
            'health_count': ''
        };

        var objSwitchUserType = {
            'DC-POSP': ['DC-POSP'],
            'DC-NON-POSP': ['DC-NON-POSP'],
            'SM-POSP': ['SM-POSP'],
            'SM-NON-POSP': ['SM-NON-POSP'],
            'SM-FOS': ['SM-FOS'],
            'RBS': ['RBS'],
            'PB-SS': ['PB-SS'],
            'GS-All': ['GS-FOS', 'GS-POSP', 'GS-NON-POSP', 'GS-FBA'],
            'DC-All': ['DC-POSP', 'DC-NON-POSP', 'DC-FBA'],
            'SM-All': ['SM-POSP', 'SM-NON-POSP', 'SM-FBA']
        };
        var obj_result = {};
        user_data.find(cond_ud).exec(function (err, dbUsers) {
            if (!err) {
                console.error('RM_report', dbUsers.length);
                for (var k in dbUsers) {
                    try {
                        var user = dbUsers[k]._doc;
                        var user_type = get_search_source(user);

                        if (objSwitchUserType[SwitchUser_type].indexOf(user_type) > -1) {
                            if (user['Premium_Request'].hasOwnProperty('ss_id') && (user['Premium_Request']['ss_id'] - 0) > 0) {

                                var email = user['Premium_Request']['posp_email_id'];
                                var ss_id = (user['Premium_Request']['ss_id'] - 0);
                                var fba_id = (user['Premium_Request']['posp_fba_id'] - 0);
                                var agent_id = ss_id;
                                if (ss_id === 5) {
                                    agent_id = fba_id;
                                }
                                if (obj_result.hasOwnProperty(agent_id) === false) {
                                    obj_result[agent_id] = {};
                                    for (var k in obj_schema) {
                                        obj_result[agent_id][k] = '';
                                        if (obj_schema[k] !== '') {
                                            obj_result[agent_id][k] = user['Premium_Request'][obj_schema[k]];
                                        } else {
                                            obj_result[agent_id][k] = 0;
                                        }
                                    }
                                    obj_result[agent_id]['name'] = user['Premium_Request']['posp_first_name'] + ' ' + user['Premium_Request']['posp_last_name'];
                                    obj_result[agent_id]['source'] = get_search_source(user);

                                }
                                if (user['Product_Id'] === 1) {
                                    obj_result[agent_id]['car_count']++;
                                }
                                if (user['Product_Id'] === 10) {
                                    obj_result[agent_id]['tw_count']++;
                                }
                                if (user['Product_Id'] === 2) {
                                    obj_result[agent_id]['health_count']++;
                                }
                            }
                        }
                    } catch (e) {
                        console.error('RM_report', 'loop_err', e);
                    }
                }
                //res.json(obj_result);
                var html_report = arrayobjectToHtml(obj_result);
                console.log(html_report);
                res.send(html_report);

            }
        });

    });

    app.get('/user_datas/sms_campaign', function (req, res) {
        var today = moment().utcOffset("+05:30").startOf('Day');

        var daybefore = (req.query.hasOwnProperty('daybefore')) ? req.query['daybefore'] - 0 : 5;

        var startday = 0 - daybefore;
        var endday = (0 - daybefore) + 1;

        var from_date = moment(today).add(startday, 'days').format("YYYY-MM-D");
        var to_date = moment(today).add(endday, 'days').format("YYYY-MM-D");


        User_Data.find({
            "Premium_Request.utm_campaign": { $in: ['SMS_CAM_BIke', 'sms_cam_ci'] },
            "Modified_On": { "$gte": from_date, "$lte": to_date }
        }).select(['User_Data_Id', 'Request_Unique_Id', 'PB_CRN', 'Last_Status', 'ERP_CS', 'ERP_CS_DOC', "Proposal_Request_Core.registration_no", "Premium_Request.mobile"]).exec(function (err, dbUsers) {
            if (err) {
                res.send(err);
            }
            try {
                if (!err) {
                    var current = moment().utcOffset("+05:30").startOf('Day');
                    var current_date = moment(current).format("YYYYMMD");
                    for (let k in dbUsers) {
                        let user = dbUsers[k]._doc;
                        let url_send = 'https://chatbot.hellotars.com/conv/B1g5HF?crn=' + user["PB_CRN"];
                        var Client = require('node-rest-client').Client;
                        var client = new Client();
                        client.get('https://api-ssl.bitly.com/v3/shorten?access_token=' + config.environment.bitly_access_token + '&longUrl=' + url_send, function (data, response) {
                            console.log(data);
                            if (data && data.status_code === 200) {
                                let request_short_url = data.data.url;
                                var SmsLog = require('../models/sms_log');
                                var objSmsLog = new SmsLog();
                                let customer_msg = "Hi, Thanks for visiting PolicyBoss.com. As a policy we don’t call and disturb you. In case you need any assistance in helping you decide on the right insurance, you can schedule a call back by clicking " + request_short_url;
                                if (user.hasOwnProperty("Premium_Request") && user["Premium_Request"]["mobile"] !== "") {
                                    objSmsLog.send_sms(user["Premium_Request"]["mobile"], customer_msg, 'CAMPAIGN_LOG', user["PB_CRN"]);
                                    let data = "CRN- " + user["PB_CRN"] + ",Mobile- " + user["Premium_Request"]["mobile"] + ",Bitly- " + request_short_url;

                                    let file_path = appRoot + "/tmp/log/sms_campaign_" + current_date + ".log";
                                    fs.appendFile(file_path, data + "\r\n", function (err) {
                                        if (err) {
                                            return console.log(err);
                                        }
                                        console.log("The file was saved!");
                                    });

                                    res.json({ "Status": "Success", "Msg": "SMS sent successfully" });
                                }
                            }
                        });
                    }
                }
            } catch (ex) {
                console.error(ex);
                res.json({ "Status": "Fail", "Msg": ex });
            }

        });
    });
    app.get('/user_datas/rbmark/sms/:udid', function (req, res) {
        var User_Data = require('../models/user_data');
        User_Data.findOne({ Product_Id: 10, User_Data_Id: parseInt(req.params.udid), Last_Status: { $in: ["TRANS_SUCCESS_WO_POLICY", "TRANS_SUCCESS_WITH_POLICY"] } }, function (err, dbUserData) {
            if (err) {
                console.log(err);
            } else {
                if (dbUserData) {
                    var prm_request = dbUserData['_doc']['Premium_Request'];
                    var prop_request = dbUserData['_doc']['Proposal_Request'];
                    if (prm_request.channel === "DC" || prm_request.channel === "DIRECT") {
                        var pincode = parseInt(prop_request.permanent_pincode);
                        var allow_pincode = allowPincode(pincode);
                        if (allow_pincode === 'yes') {
                            var send_url = "https://www.rupeeboss.com/icici?FBAId=" + ((prm_request.channel === "DC") ? prm_request.posp_fba_id : 0) + "&type=" + ((prm_request.channel === "DC") ? 'Finmart' : 'PBDirect') + "&tid=" + dbUserData['_doc']['PB_CRN'];
                            var customer_name = capitalize(dbUserData['_doc']['Proposal_Request_Core'].first_name + ' ' + dbUserData['_doc']['Proposal_Request_Core'].last_name);
                            var Client = require('node-rest-client').Client;
                            var client = new Client();
                            client.get('https://api-ssl.bitly.com/v3/shorten?access_token=c9c248f950c3dd01467ccb9e49b0ecf5cb054d44&longUrl=' + encodeURIComponent(send_url), function (data, response) {
                                console.log('Bitly-', data);
                                if (data && data.status_code === 200) {
                                    let request_short_url = data.data.url;
                                    if (prm_request.channel === "DIRECT") {
                                        let customer_msg = 'Dear ' + customer_name + ',\n Get a Free Credit card now through ICICI Bank. Apply now by clicking on the following link. \n Link - ' + request_short_url;
                                        var SmsLog = require('../models/sms_log');
                                        var objSmsLog = new SmsLog();
                                        var customer_no = dbUserData['_doc']['Proposal_Request_Core']['mobile'];
                                        if (req.query.hasOwnProperty('dbg') && req.query['dbg'] === 'yes') {
                                            customer_no = '7666020532';
                                        }
                                        objSmsLog.send_sms(customer_no, customer_msg, 'CAMPAIGN_LOG', dbUserData['_doc']["PB_CRN"], 'RB');
                                        res.json({ "Status": "Success", "Msg": "SMS sent successfully" });
                                    }
                                    if (prm_request.channel === "DC") {
                                        let fba_name = capitalize(prm_request.posp_first_name + ' ' + prm_request.posp_last_name);
                                        let customer_msg = 'Dear ' + fba_name + ',\n Your customer ' + customer_name + ' can get a Free Credit card now through ICICI Bank. Every successful application you can earn Rs 500/-. Send this link to the customer.\n Link - ' + request_short_url;
                                        var SmsLog = require('../models/sms_log');
                                        var objSmsLog = new SmsLog();
                                        if (req.query.hasOwnProperty('dbg') && req.query['dbg'] === 'yes') {
                                            prm_request.posp_mobile_no = '7666020532';
                                        }
                                        objSmsLog.send_sms(prm_request.posp_mobile_no, customer_msg, 'CAMPAIGN_LOG', dbUserData['_doc']["PB_CRN"], 'RB');
                                        res.json({ "Status": "Success", "Msg": "SMS sent successfully" });
                                    }
                                } else {
                                    res.json({ "Status": "Fail", "Msg": "BITLY_ISSUE" });
                                }
                            });
                        } else {
                            res.json({ "Status": "Fail", "Msg": "NOT_ALLOWED" });
                        }
                    } else {
                        res.json({ "Status": "Fail", "Msg": "NOT_ALLOWED" });
                    }
                } else {
                    res.json({ "Status": "Fail", "Msg": "NO_DATA" });
                }
            }
        });
    });
    app.get('/user_datas/sync_policy_aws/:udid', function (req, res) {
        try {
            if (config.environment.name.toString() !== 'Production') {
                return res.send('NOT_ALLOWED_ON_NON_PRODUCTION');
            }
            let udid = parseInt(req.params.udid);

            if (req.query['dbg'] === 'yes') {
                return res.json(req.query);
            }
            if (udid === 0) {
                return res.send('ZERO_UDID');
            }
            let cond_ud = {
                'User_Data_Id': udid,
                "Last_Status": 'TRANS_SUCCESS_WITH_POLICY'
            };
            User_Data.findOne(cond_ud, function (err, dbUser) {
                let err_msg = '';
                if (!err && dbUser) {
                    try {
                        let user = dbUser._doc;
                        if (user.Transaction_Data && user.Transaction_Data.policy_url) {
                            let pdf_file_name = user.Transaction_Data.policy_url;
                            pdf_file_name = pdf_file_name.split('/');
                            pdf_file_name = pdf_file_name[pdf_file_name.length - 1];
                            let pdf_sys_loc = appRoot + "/tmp/pdf/" + pdf_file_name;
                            if (fs.existsSync(pdf_sys_loc) && pdf_sys_loc.indexOf('.pdf') > -1) {
                                let stats = fs.statSync(pdf_sys_loc);
                                let fileSizeInBytes = stats.size;
                                let fileSizeInKb = (fileSizeInBytes / 1024).toFixed(2);
                                if (fileSizeInKb > 10) {
                                    let obj_summary = {
                                        'push_on': (new Date()).toLocaleString(),
                                        'transact_on': (new Date(user.Modified_On)).toLocaleString(),
                                        'udid': udid,
                                        'status': null,
                                        'file_s3': pdf_file_name,
                                        'res': null,
                                        'err': null
                                    };
                                    fs.readFile(pdf_sys_loc, (err, filedata) => {
                                        if (true || req.query['op'] === 'execute') {
                                            let AWS = require('aws-sdk');
                                            let s3 = new AWS.S3({
                                                accessKeyId: config.aws.access_key,
                                                secretAccessKey: config.aws.secret_key
                                            });
                                            let params = {
                                                Bucket: 'horizon-policy-01012020/pdf', // pass your bucket name
                                                Key: pdf_file_name, // file will be saved as testBucket/contacts.csv
                                                Body: filedata
                                            };
                                            s3.upload(params, function (s3Err, s3data_response) {
                                                if (s3Err) {
                                                    obj_summary.status = 'ERR';
                                                    obj_summary.err = s3Err;
                                                } else {
                                                    obj_summary.status = 'INFO';
                                                    obj_summary.res = s3data_response;
                                                }
                                                var today_str = moment().utcOffset("+05:30").format("YYYYMMD");
                                                fs.appendFile(appRoot + "/tmp/log/aws_push_" + today_str + ".log", JSON.stringify(obj_summary) + "\r\n", function (err) {
                                                    if (err) {
                                                        return console.log(err);
                                                    }
                                                    console.log("The file was saved!");
                                                });
                                                res.json(obj_summary);
                                            });
                                        } else {
                                            res.json(obj_summary);
                                        }
                                    });
                                } else {
                                    err_msg = 'policy_less_than_10KB';
                                }
                            } else {
                                err_msg = 'invalid_policy';
                            }
                        } else {
                            err_msg = 'invalid_td_data';
                        }
                    } catch (e) {
                        err_msg = '<pre>' + e.stack + '</pre>';
                    }
                } else {
                    err_msg = 'invalid_ud_data';
                }

                if (err_msg !== '') {
                    let obj_summary = {
                        'push_on': (new Date()).toLocaleString(),
                        'transact_on': (typeof user !== 'undefined') ? (new Date(user.Modified_On)).toLocaleString() : 'NA',
                        'udid': udid,
                        'status': 'ERR',
                        'file_s3': '',
                        'res': null,
                        'err': err_msg
                    };
                    var today_str = moment().utcOffset("+05:30").format("YYYYMMD");
                    fs.appendFile(appRoot + "/tmp/log/aws_push_" + today_str + ".log", JSON.stringify(obj_summary) + "\r\n", function (err) {
                        if (err) {
                            return console.log(err);
                        }
                        console.log("The file was saved!");
                    });
                    res.send(err_msg);
                }
            });
        } catch (e) {
            res.send('<pre>' + e.stack + '</pre>');
        }
    });
    function get_search_source(user) {
        var client_key_val = '';
        try {
            client_key_val = 'PB-Direct';
            var agent_id = 0;
            var fba_id = 0;
            var posp_sources = 0;

            if (user['Premium_Request'].hasOwnProperty('ss_id') && (user['Premium_Request']['ss_id'] - 0) > 0) {
                posp_sources = user['Premium_Request']['posp_sources'] - 0;
                var ss_id = (user['Premium_Request']['ss_id'] - 0);
                fba_id = (user['Premium_Request']['posp_fba_id'] - 0);
                if (posp_sources === 1) {
                    if (user['Premium_Request'].hasOwnProperty('posp_erp_id') && (user['Premium_Request']['posp_erp_id'] - 0) > 0) { //posp_erp_id
                        client_key_val = 'DC-POSP';
                        if ([8279, 6328, 9627, 6425].indexOf(ss_id) > -1) {
                            client_key_val = 'FINPEACE';
                        }
                    } else if (ss_id !== 5) {
                        client_key_val = 'DC-NON-POSP';
                    } else if (ss_id === 5) {
                        client_key_val = 'DC-FBA';
                    }
                } else if (posp_sources === 2) {
                    if (user['Premium_Request'].hasOwnProperty('posp_erp_id') && (user['Premium_Request']['posp_erp_id'] - 0) > 0) { //posp_erp_id
                        client_key_val = 'SM-POSP';
                    } else if (ss_id === 5) {
                        client_key_val = 'SM-FBA';
                    } else {
                        client_key_val = 'SM-NON-POSP';
                    }
                } else if (posp_sources === 8) {
                    if (user['Premium_Request'].hasOwnProperty('posp_erp_id') && (user['Premium_Request']['posp_erp_id'] - 0) > 0) { //posp_erp_id
                        client_key_val = 'GS-POSP';
                    } else if (ss_id === 5) {
                        client_key_val = 'GS-FBA';
                    } else {
                        client_key_val = 'GS-NON-POSP';
                    }
                } else if (posp_sources === 11) {
                    if (user['Premium_Request'].hasOwnProperty('posp_erp_id') && (user['Premium_Request']['posp_erp_id'] - 0) > 0) { //posp_erp_id
                        client_key_val = 'EM-POSP';
                    } else if (ss_id === 5) {
                        client_key_val = 'EM-FBA';
                    } else {
                        client_key_val = 'EM-NON-POSP';
                    }
                } else {
                    if (user['Premium_Request']['posp_category'] === 'FOS') {
                        client_key_val = 'SM-FOS';
                    } else if (user['Premium_Request']['posp_category'] === 'GS-FOS') {
                        client_key_val = 'GS-FOS';
                    } else if (user['Premium_Request']['posp_category'] === 'DC-FOS') {
                        client_key_val = 'DC-FOS';
                    } else if (user['Premium_Request']['posp_category'] === 'EM-FOS') {
                        client_key_val = 'EM-FOS';
                    } else if (user['Premium_Request']['posp_category'] === 'RBS') {
                        client_key_val = 'RBS';
                    } else if (user['Premium_Request']['posp_category'] === 'MISP') {
                        client_key_val = 'MISP';
                    } else {
                        client_key_val = 'PB-SS';
                    }
                }
            } else if (user['Premium_Request']['user_source'] === 'tars') {
                client_key_val = 'BOT';
            }
        } catch (e) {
            console.error('');
        }
        return client_key_val;
    }
    function arrayobjectToHtml(objSummary) {
        var msg = '<!DOCTYPE html><html><head><title>Report</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';

        msg += '<div class="report" ><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">Report</span><table style="-moz-box-shadow: 1px 1px 3px 2px #d3d3d3;-webkit-box-shadow: 1px 1px 3px 2px #d3d3d3;  box-shadow:         1px 1px 3px 2px #d3d3d3;" border="0" cellpadding="3" cellspacing="0" width="95%"  >';
        var row_inc = 0;
        for (var k in objSummary) {
            if (row_inc === 0) {
                msg += '<tr>';
                for (var k_head in objSummary[k]) {
                    msg += '<th style="font-size:12px;font-family:\'Google Sans\' ,tahoma;background-color: #d7df01; text-align:center " >' + k_head + '</th>';
                }
                msg += '</tr>';
            }
            msg += '<tr>';
            for (var k_row in objSummary[k]) {
                msg += '<td style="font-size:12px;font-family:\'Google Sans\' ,tahoma;" align="center">' + objSummary[k][k_row] + '</td>';

            }
            msg += '</tr>';
            row_inc++;
        }
        msg += '</table></div>';
        return msg;
    }
    function sortObject(preObj) {
        var newO = {};
        Object.keys(preObj).sort(function (a, b) {
            return preObj[b] - preObj[a];
        }).map(key => newO[key] = preObj[key]);
        return newO;
    }

    app.get('/user_datas/pospFirstSale/:ssid', function (req, res) {
        var ss_id = parseInt(req.params['ssid']);//2964
        User_Data.findOne({ "Premium_Request.ss_id": ss_id, "Premium_Request.is_posp": "yes", "Erp_Qt_Request_Core.___erp_is_posp___": 'POSP', Last_Status: { $in: ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY'] } }, function (err, user_datas) {
            if (err) {
                res.send(err);
            } else {
                if (user_datas) {
                    var dataObj = user_datas['_doc'];
                    var result = {
                        'First_Sale_Date': ''
                    };
                    var sale_date = dataObj['Modified_On'];
                    sale_date = sale_date.getFullYear() + "-" + (sale_date.getMonth() + 1) + "-" + sale_date.getDate();
                    console.log(sale_date);
                    result['First_Sale_Date'] = sale_date;
                    //result['Last_Status'] = dataObj['Last_Status'];
                    //result['Policy_Status'] = dataObj['Last_Status'];
                    res.send(result['First_Sale_Date']);
                } else {
                    res.send('NA');
                }
            }
        });
    });
    app.post('/user_datas/top_performance', LoadSession, function (req, res) {
        try {
            let report_type = (req.query.hasOwnProperty('report_type')) ? req.query['report_type'] : 'search';
            let Product_Id = (req.query.hasOwnProperty('Product_Id') && req.query['Product_Id'] !== '') ? req.query['Product_Id'] - 0 : 0;
            let Insurer_Id = (req.query.hasOwnProperty('Insurer_Id') && req.query['Insurer_Id'] !== '') ? req.query['Insurer_Id'] - 0 : 0;
            let limit = (req.query.hasOwnProperty('limit')) ? req.query['limit'] - 0 : 10;
            let channel = req.query['channel'] || '';
            let subchannel = req.query['subchannel'] || '';
            let today = moment().utcOffset("+05:30").startOf('Day');
            let yesterday = moment(today).add(-1, 'days');
            let arr_sale = ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY'];

            if (req.query.hasOwnProperty('type') && req.query['type'] === 'daily') {
                yesterday = moment(today).add(-1, 'days').format("YYYY-MM-D");
                req.query['datefrom'] = yesterday;
                req.query['dateto'] = yesterday;
            }

            let arrFrom = req.query['datefrom'].split('-');
            let dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);
            let arrTo = req.query['dateto'].split('-');
            let dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
            dateTo.setDate(dateTo.getDate() + 1);
            var cond_ud = {
                "Premium_Request.ss_id": { "$gte": 0 },
                "Modified_On": { "$gte": dateFrom, "$lte": dateTo }
            };
            if (report_type === 'sale') {
                cond_ud['Last_Status'] = { $in: arr_sale };
            }
            if (Product_Id > 0) {
                cond_ud['Product_Id'] = Product_Id;
            }
            if (Insurer_Id > 0) {
                cond_ud['Insurer_Id'] = Insurer_Id;
            }
            if (channel !== '' && channel !== 'RM') {
                cond_ud['Premium_Request.channel'] = channel;
            }
            if (subchannel !== '') {
                cond_ud['Premium_Request.subchannel'] = subchannel;
            }
            if (req.query.hasOwnProperty('page_action') && req.query['page_action'] !== '') {
                if (req.query['page_action'] === 'all_daily') {
                } else if (req.query['page_action'] === 'ch_all_daily') {
                    var arr_ch_ssid = [];
                    var arr_ch_list = [];
                    if (req.obj_session.hasOwnProperty('users_assigned')) {
                        arr_ch_ssid = req.obj_session.users_assigned.Team.CSE;
                    }
                    arr_ch_ssid.push(req.obj_session.user.ss_id);
                    //channel = req.obj_session.user.role_detail.channel;
                    arr_ch_list = req.obj_session.user.role_detail.channel_transaction;
                    cond_ud["$or"] = [
                        { 'Premium_Request.channel': { $in: arr_ch_list } },
                        { 'Premium_Request.ss_id': { $in: arr_ch_ssid } }
                    ];
                } else if (req.query['page_action'] === 'my_daily') {
                    var arr_ssid = [];
                    if (req.obj_session.hasOwnProperty('users_assigned')) {
                        var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
                        arr_ssid = combine_arr.split(',').filter(Number).map(Number);
                        cond_ud['Premium_Request.ss_id'] = { $in: arr_ssid };
                    }
                    arr_ssid.push(req.obj_session.user.ss_id);
                    cond_ud['Premium_Request.ss_id'] = { $in: arr_ssid };
                }
                let qry_agre_performance = [
                    { "$match": cond_ud },
                    {
                        "$group": {
                            _id: {
                                'ss_id': "$Premium_Request.ss_id"
                            },
                            NOP: { $sum: 1 }
                        }
                    },
                    { "$project": { _id: 0, ss_id: "$_id.ss_id", NOP: 1 } },
                    { "$sort": { 'NOP': -1 } },
                    { "$limit": limit - 0 }
                ];
                if (channel === 'RM') {
                    cond_ud['Premium_Request.channel'] = { "$ne": 'CC' };
                    qry_agre_performance = [
                        { "$match": cond_ud },
                        {
                            "$group": {
                                _id: {
                                    'rm_uid': "$Premium_Request.posp_reporting_agent_uid"
                                },
                                NOP: { $sum: 1 }
                            }
                        },
                        { "$project": { _id: 0, rm_uid: "$_id.rm_uid", NOP: 1 } },
                        { "$sort": { 'NOP': -1 } },
                        { "$limit": limit - 0 }
                    ];
                }
                User_Data.aggregate(qry_agre_performance).exec(function (err, dbTopPerformance) {
                    try {
                        if (err) {
                            return res.send(err);
                        }
                        if (dbTopPerformance) {
                            if (channel === 'RM') {
                                let obj_rmuid = {};
                                let arr_rmuid = [];
                                let arr_rmuid_4series = [];
                                for (let k in dbTopPerformance) {
                                    obj_rmuid[dbTopPerformance[k]['rm_uid'] - 0] = dbTopPerformance[k];
                                    if (dbTopPerformance[k]['rm_uid'].toString().charAt(0) === '4') {
                                        arr_rmuid_4series.push(dbTopPerformance[k]['rm_uid'].toString());
                                    }
                                }
                                arr_rmuid = Object.keys(obj_rmuid).map(Number);
                                var User = require('../models/user');
                                User.find({ 'UID': { $in: arr_rmuid } }).exec(function (err, dbAgents) {
                                    if (dbAgents) {
                                        for (let k in dbAgents) {
                                            obj_rmuid[dbAgents[k]._doc['UID']]['Name'] = dbAgents[k]._doc['Employee_Name'];
                                            obj_rmuid[dbAgents[k]._doc['UID']]['Department'] = dbAgents[k]._doc['Dept_Segment'] + '-' + dbAgents[k]._doc['Dept_Short_Name'];
                                            obj_rmuid[dbAgents[k]._doc['UID']]['Branch'] = dbAgents[k]._doc['Branch'];
                                        }
                                    }
                                    if (arr_rmuid_4series.length > 0) {
                                        Posps.find({ 'Erp_Id': { $in: arr_rmuid_4series } }).exec(function (err, dbAgents) {
                                            if (dbAgents) {
                                                for (let k in dbAgents) {
                                                    obj_rmuid[dbAgents[k]._doc['Erp_Id']]['Name'] = dbAgents[k]._doc['First_Name'] + ' ' + dbAgents[k]._doc['Last_Name'];
                                                    obj_rmuid[dbAgents[k]._doc['Erp_Id']]['Department'] = config.channel.Const_POSP_Channel[dbAgents[k]._doc['Sources'].toString()];
                                                    obj_rmuid[dbAgents[k]._doc['Erp_Id']]['Branch'] = dbAgents[k]._doc['Agent_City'];
                                                }
                                            }
                                            obj_rmuid = Object.values(obj_rmuid);
                                            obj_rmuid.sort((a, b) => (b.NOP > a.NOP) ? 1 : -1);
                                            return res.json(obj_rmuid);
                                        });
                                    } else {
                                        obj_rmuid = Object.values(obj_rmuid);
                                        obj_rmuid.sort((a, b) => (b.NOP > a.NOP) ? 1 : -1);
                                        return res.json(obj_rmuid);
                                    }

                                });

                            } else {
                                let obj_ssid = {};
                                let arr_ssid = [];
                                for (let k in dbTopPerformance) {
                                    obj_ssid[dbTopPerformance[k]['ss_id'] - 0] = dbTopPerformance[k];
                                }
                                arr_ssid = Object.keys(obj_ssid).map(Number);
                                if ((channel === 'CC')) {
                                    var User = require('../models/user');
                                    User.find({ 'Ss_Id': { $in: arr_ssid } }).exec(function (err, dbAgents) {
                                        if (dbAgents) {
                                            for (let k in dbAgents) {
                                                obj_ssid[dbAgents[k]._doc['Ss_Id']]['Name'] = dbAgents[k]._doc['Employee_Name'];
                                                obj_ssid[dbAgents[k]._doc['Ss_Id']]['Department'] = dbAgents[k]._doc['Dept_Segment'] + '-' + dbAgents[k]._doc['Dept_Short_Name'];
                                                obj_ssid[dbAgents[k]._doc['Ss_Id']]['Branch'] = dbAgents[k]._doc['Branch'];
                                            }
                                        }
                                        obj_ssid = Object.values(obj_ssid);
                                        obj_ssid.sort((a, b) => (b.NOP > a.NOP) ? 1 : -1);
                                        return res.json(obj_ssid);
                                    });
                                }
                                if ((subchannel !== '' && subchannel === 'FOS')) {
                                    var Employee = require('../models/employee');
                                    Employee.find({ 'Emp_Id': { $in: arr_ssid } }).exec(function (err, dbAgents) {
                                        if (dbAgents) {
                                            for (let k in dbAgents) {
                                                obj_ssid[dbAgents[k]._doc['Emp_Id']]['Name'] = dbAgents[k]._doc['Emp_Name'];
                                                obj_ssid[dbAgents[k]._doc['Emp_Id']]['Channel'] = config.channel.Const_FOS_Channel[dbAgents[k]._doc['Role_ID'].toString()];
                                                obj_ssid[dbAgents[k]._doc['Emp_Id']]['City'] = dbAgents[k]._doc['Branch'];
                                                obj_ssid[dbAgents[k]._doc['Emp_Id']]['RM'] = dbAgents[k]._doc['Reporting_UID_Name'] + ':UID-' + dbAgents[k]._doc['UID'];
                                            }
                                        }
                                        obj_ssid = Object.values(obj_ssid);
                                        obj_ssid.sort((a, b) => (b.NOP > a.NOP) ? 1 : -1);
                                        return res.json(obj_ssid);
                                    });
                                }
                                if (subchannel !== '' && subchannel === 'POSP') {
                                    Posps.find({ 'Ss_Id': { $in: arr_ssid } }).exec(function (err, dbAgents) {
                                        if (dbAgents) {
                                            for (let k in dbAgents) {
                                                obj_ssid[dbAgents[k]._doc['Ss_Id']]['Name'] = dbAgents[k]._doc['First_Name'] + ' ' + dbAgents[k]._doc['Last_Name'];
                                                obj_ssid[dbAgents[k]._doc['Ss_Id']]['Channel'] = config.channel.Const_POSP_Channel[dbAgents[k]._doc['Sources'].toString()];
                                                obj_ssid[dbAgents[k]._doc['Ss_Id']]['City'] = dbAgents[k]._doc['Agent_City'];
                                                obj_ssid[dbAgents[k]._doc['Ss_Id']]['RM'] = dbAgents[k]._doc['Reporting_Agent_Name'] + ':UID-' + dbAgents[k]._doc['Reporting_Agent_Uid'];
                                            }
                                        }
                                        obj_ssid = Object.values(obj_ssid);
                                        obj_ssid.sort((a, b) => (b.NOP > a.NOP) ? 1 : -1);
                                        return res.json(obj_ssid);
                                    });
                                }
                            }
                        }
                    } catch (e) {
                        return res.send(e.stack);
                    }
                });
            }
        } catch (e) {
            return res.send(e.stack);
        }
    });
    app.get('/user_datas/premium/resync', function (req, res) {
        let lmt = req.query['limit'] - 0;
        User_Data.find({ Last_Status: { $in: ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY'] }, 'Erp_Qt_Request_Core.___final_premium___': { $type: 2 } }).select('User_Data_Id Erp_Qt_Request_Core.___final_premium___').limit(lmt).exec(function (err, db_user_datas) {
            let arr_ud = [];
            if (db_user_datas) {
                for (let k in db_user_datas) {
                    let obj_ud = {
                        'User_Data_Id': db_user_datas[k]._doc['User_Data_Id'],
                        'Erp_Qt_Request_Core.___final_premium___': db_user_datas[k]._doc['Erp_Qt_Request_Core']['___final_premium___'] - 0
                    };

                    if (req.query['execute'] === 'yes') {
                        User_Data.updateOne({ 'User_Data_Id': obj_ud['User_Data_Id'] }, { $set: obj_ud }, function (err, dbUdStatus) {
                            obj_ud['status'] = (err) ? 'fail' : 'success';
                            obj_ud['details'] = err || dbUdStatus;
                            arr_ud.push(obj_ud);
                            if (db_user_datas.length == arr_ud.length) {
                                res.json({
                                    'data_count': db_user_datas.length,
                                    "process_count": arr_ud.length,
                                    "data": arr_ud
                                });
                            }
                        });
                    } else {
                        arr_ud.push(obj_ud);
                    }
                }
            }
            if (req.query['execute'] === 'yes') {

            } else {
                res.json({
                    'data_count': db_user_datas.length,
                    "process_count": arr_ud.length,
                    "data": arr_ud
                });
            }

        });
    });
    app.get('/user_datas/agent_summary_process/level_1', function (req, res) {
        try {
            let Agent_Summary = require('../models/agent_summary');
            let yesterday = moment().utcOffset("+05:30").startOf('Day').add(-1, 'days').format("YYYY-MM-DD");
            let report_date = (req.query.hasOwnProperty('report_date') && req.query['report_date'] !== '') ? req.query['report_date'] : yesterday;
            let cache_key = 'agent_summary_process_level_1_1_' + report_date;
            if (req.query['cache'] === 'yes' && fs.existsSync(appRoot + "/tmp/cachereport/" + cache_key + ".log") === true) {
                var cache_content = fs.readFileSync(appRoot + "/tmp/cachereport/" + cache_key + ".log").toString();

                return res.send(cache_content);
            } else {

                let business_start = moment(report_date).utcOffset("+05:30").startOf('month').format("YYYY-MM-D");
                let business_end = moment(report_date).utcOffset("+05:30").endOf('month').format("YYYY-MM-D");
                let business_year_month = moment(report_date).utcOffset("+05:30").endOf('month').format("YYYYMM") - 0;
                let business_year = moment(report_date).utcOffset("+05:30").endOf('month').format("YYYY") - 0;
                let business_month = moment(report_date).utcOffset("+05:30").endOf('month').format("MMM");
                let obj_financial = {
                    'April_2023-March_2024': { 'start': 202304, 'end': 202403 },
                    'April_2022-March_2023': { 'start': 202204, 'end': 202303 },
                    'April_2021-March_2022': { 'start': 202104, 'end': 202203 },
                    'April_2020-March_2021': { 'start': 202004, 'end': 202103 },
                    'April_2019-March_2020': { 'start': 201904, 'end': 202003 },
                    'April_2018-March_2019': { 'start': 201804, 'end': 201903 },
                    'April_2017-March_2018': { 'start': 201704, 'end': 201803 }
                };
                let business_finacial_year = '';
                for (let ind_financial in obj_financial) {
                    if (business_year_month >= obj_financial[ind_financial]['start'] && business_year_month <= obj_financial[ind_financial]['end']) {
                        business_finacial_year = ind_financial;
                        break;
                    }
                }
                let arrFrom = business_start.split('-');
                let dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);
                let arrTo = business_end.split('-');
                let dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
                dateTo.setDate(dateTo.getDate() + 1);


                let obj_agent_monthly = {};
                let cond_ud = {
                    "Premium_Request.ss_id": { "$gt": 0, "$ne": 5 },
                    "Premium_Request.channel": { "$exists": true },
                    'Modified_On': { "$gte": dateFrom, "$lte": dateTo }
                };

                let aggregate_ud = [
                    { "$match": cond_ud },
                    {
                        "$group": {
                            _id: {
                                Ss_Id: "$Premium_Request.ss_id",
                                Erp_Id: "$Premium_Request.posp_erp_id",
                                Channel: "$Premium_Request.channel",
                                SubChannel: "$Premium_Request.subchannel",
                                posp_first_name: "$Premium_Request.posp_first_name",
                                posp_last_name: "$Premium_Request.posp_last_name",
                                rm_uid: "$Premium_Request.posp_reporting_agent_uid",
                                rm_name: "$Premium_Request.posp_reporting_agent_name",
                                agent_city: "$Premium_Request.posp_agent_city",

                                Product_Id: "$Product_Id"
                            },
                            "Search": { "$sum": 1 },
                            "Nop": {
                                "$sum": {
                                    "$cond": [{ "$in": ["$Last_Status", ["TRANS_SUCCESS_WITH_POLICY", "TRANS_SUCCESS_WO_POLICY"]] }, 1, 0]
                                }
                            },
                            "Premium": {
                                "$sum": {
                                    "$cond": [{ "$in": ["$Last_Status", ["TRANS_SUCCESS_WITH_POLICY", "TRANS_SUCCESS_WO_POLICY"]] }, "$Erp_Qt_Request_Core.___final_premium___", 0]
                                }
                            }
                        }
                    },
                    {
                        "$project": {
                            _id: 0, Ss_Id: "$_id.Ss_Id",
                            Erp_Id: "$_id.Erp_Id",
                            Channel: '$_id.Channel',
                            Sub_Channel: '$_id.SubChannel',
                            Rm_Name: '$_id.rm_name',
                            Rm_Uid: '$_id.rm_uid',
                            Agent_City: '$_id.agent_city',
                            posp_first_name: '$_id.posp_first_name',
                            posp_last_name: '$_id.posp_last_name',
                            Product_Id: '$_id.Product_Id',
                            Search: 1,
                            Nop: 1,
                            Premium: 1
                        }
                    }
                ];
                if (req.query['dbg'] == 'qry') {
                    return res.json(aggregate_ud);
                } else {
                    User_Data.aggregate(aggregate_ud).exec(function (err, dbUsersAggregate) {
                        if (err) {
                            return res.send(err);
                        }
                        try {
                            /*
                             {
                             "1": "Car",
                             "2": "Health",
                             "4": "Travel",
                             "3": "Term",
                             "10": "TW",
                             "13": "Marine",
                             "12": "CV",
                             "17": "CoronaCare",
                             "18": "CyberSecurity"
                             } ["TW","Car","Travel","CV","Health","Term","CoronaCare","CyberSecurity","Marine"]
                             */
                            let arr_agent_summary_level_1 = {};
                            if (dbUsersAggregate && dbUsersAggregate.length > 0) {
                                let arr_product_name = ["TW", "Car", "Travel", "CV", "Health", "Term", "CoronaCare", "CyberSecurity", "Marine"];
                                for (let k in dbUsersAggregate) {
                                    let ind_agent_summary = dbUsersAggregate[k];

                                    if (arr_agent_summary_level_1.hasOwnProperty(ind_agent_summary['Ss_Id']) === false) {
                                        let Agent_Name = 'NA';
                                        if (ind_agent_summary['posp_first_name']) {
                                            Agent_Name = ind_agent_summary['posp_first_name'].toString();
                                            Agent_Name += (ind_agent_summary['posp_last_name']) ? ('-' + ind_agent_summary['posp_last_name'].toString()) : '';
                                        }

                                        let Agent_City = ind_agent_summary['Agent_City'] ? ind_agent_summary['Agent_City'].toString().trim().toUpperCase() : 'NA';
                                        ind_agent_summary['Agent_City'] = Agent_City;
                                        arr_agent_summary_level_1[ind_agent_summary['Ss_Id']] = Object.assign({
                                            'Agent_Name': Agent_Name.toUpperCase(),
                                            'Report_Year_Month': business_year_month,
                                            'Report_Year': business_year,
                                            'Report_Month': business_month,
                                            'Financial_Year': business_finacial_year
                                        }, ind_agent_summary);
                                        //arr_agent_summary_level_1[ind_agent_summary['Ss_Id']] = ind_agent_summary;
                                        if (ind_agent_summary['Channel'] === 'CC') {
                                            arr_agent_summary_level_1[ind_agent_summary['Ss_Id']]['Erp_Id'] = arr_agent_summary_level_1[ind_agent_summary['Ss_Id']]['Rm_Uid'];
                                        }

                                        for (let prd of arr_product_name) {
                                            arr_agent_summary_level_1[ind_agent_summary['Ss_Id']][prd + '_Search'] = 0;
                                            arr_agent_summary_level_1[ind_agent_summary['Ss_Id']][prd + '_Nop'] = 0;
                                            arr_agent_summary_level_1[ind_agent_summary['Ss_Id']][prd + '_Premium'] = 0;
                                        }
                                        arr_agent_summary_level_1[ind_agent_summary['Ss_Id']]['Search'] = 0;
                                        arr_agent_summary_level_1[ind_agent_summary['Ss_Id']]['Nop'] = 0;
                                        arr_agent_summary_level_1[ind_agent_summary['Ss_Id']]['Premium'] = 0;
                                    }
                                    let prod_name = config.const_product[ind_agent_summary['Product_Id'].toString()];
                                    arr_agent_summary_level_1[ind_agent_summary['Ss_Id']][prod_name + '_Search'] += ind_agent_summary['Search'];
                                    arr_agent_summary_level_1[ind_agent_summary['Ss_Id']][prod_name + '_Nop'] += ind_agent_summary['Nop'];
                                    arr_agent_summary_level_1[ind_agent_summary['Ss_Id']][prod_name + '_Premium'] += ind_agent_summary['Premium'];

                                    arr_agent_summary_level_1[ind_agent_summary['Ss_Id']]['Search'] += ind_agent_summary['Search'];
                                    arr_agent_summary_level_1[ind_agent_summary['Ss_Id']]['Nop'] += ind_agent_summary['Nop'];
                                    arr_agent_summary_level_1[ind_agent_summary['Ss_Id']]['Premium'] += ind_agent_summary['Premium'];


                                    delete arr_agent_summary_level_1[ind_agent_summary['Ss_Id']]['posp_first_name'];
                                    delete arr_agent_summary_level_1[ind_agent_summary['Ss_Id']]['posp_last_name'];
                                    delete arr_agent_summary_level_1[ind_agent_summary['Ss_Id']]['Product_Id'];
                                }

                            }
                            if (req.query['dbg'] == 'yes') {
                                res.json(arr_agent_summary_level_1);
                            } else if (req.query['dbg'] == 'execute') {
                                Agent_Summary.remove({ 'Report_Year_Month': business_year_month }, function (err, Agent_Summary_Remove_Summary) {
                                    Agent_Summary.insertMany(Object.values(arr_agent_summary_level_1), function (err, DbInserted) {
                                        let objPayment = {
                                            'Report_Year_Month': business_year_month,
                                            'err': err,
                                            'DbInserted': DbInserted.length,
                                            'DbRemoved': Agent_Summary_Remove_Summary
                                        };
                                        return res.json(objPayment);
                                    });
                                });
                            } else {
                                let res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>Followup List</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><h1>Count:' + Object.keys(arr_agent_summary_level_1).length + '</h1>';
                                arr_agent_summary_level_1 = Object.values(arr_agent_summary_level_1);
                                arr_agent_summary_level_1.sort(function (a, b) {
                                    return b.Premium - a.Premium;
                                })
                                res_report += arrayobjectToHtml(arr_agent_summary_level_1);
                                res_report += '</body></html>';
                                fs.writeFile(appRoot + "/tmp/cachereport/" + cache_key + ".log", res_report, function (err) {
                                    if (err) {
                                        return console.error(err);
                                    }
                                });
                                return res.send(res_report);
                            }
                        } catch (e) {
                            return res.send(e.stack);
                        }
                    });
                }
            }
        } catch (e) {
            return res.send(e.stack);
        }

    });
    app.get('/user_datas/agent_summary_process/day_level_1', LoadSession, function (req, res) {
        try {
            let Agent_Summary = require('../models/agent_summary');
            let yesterday = moment().utcOffset("+05:30").startOf('Day').add(-1, 'days').format("YYYY-MM-DD");
            let report_date = (req.query.hasOwnProperty('report_date') && req.query['report_date'] !== '') ? req.query['report_date'] : yesterday;


            let business_start = moment(report_date).utcOffset("+05:30").startOf('day').format("YYYY-MM-D");
            let business_end = moment(report_date).utcOffset("+05:30").endOf('day').format("YYYY-MM-D");
            let arrFrom = business_start.split('-');
            let dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);
            let arrTo = business_end.split('-');
            let dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
            dateTo.setDate(dateTo.getDate() + 1);

            let cond_ud = {
                "Premium_Request.channel": { "$exists": true }
            };

            if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1) {

            } else if (req.obj_session.user.role_detail.role.indexOf('ChannelHead') > -1) {
                var arr_ch_ssid = [];
                var arr_ch_list = [];
                if (req.obj_session.hasOwnProperty('users_assigned')) {
                    arr_ch_ssid = req.obj_session.users_assigned.Team.CSE;
                }
                arr_ch_ssid.push(req.obj_session.user.ss_id);
                arr_ch_list = req.obj_session.user.role_detail.channel_transaction;
                cond_ud = {
                    'Last_Status': { $in: arr_sale },
                    "$or": [
                        { 'Premium_Request.channel': { $in: arr_ch_list } },
                        { 'Premium_Request.ss_id': { $in: arr_ch_ssid } }
                    ]
                };
            } else {
                let arr_ssid = [];
                if (req.obj_session.hasOwnProperty('users_assigned')) {
                    var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
                    arr_ssid = combine_arr.split(',').filter(Number).map(Number);
                    cond_ud['Premium_Request.ss_id'] = { $in: arr_ssid };
                }
                arr_ssid.push(req.obj_session.user.ss_id);
                cond_ud['Premium_Request.ss_id'] = { $in: arr_ssid };
            }
            cond_ud['Modified_On'] = { "$gte": dateFrom, "$lte": dateTo };


            let aggregate_ud = [
                { "$match": cond_ud },
                {
                    "$group": {
                        _id: { Product_Id: "$Product_Id" },
                        "Search": { "$sum": 1 },
                        "Unique": {
                            "$sum": {
                                "$cond": [{ "$eq": ["$Is_Last", "yes"] }, 1, 0]
                            }
                        },
                        "Nop": {
                            "$sum": {
                                "$cond": [{ "$in": ["$Last_Status", ["TRANS_SUCCESS_WITH_POLICY", "TRANS_SUCCESS_WO_POLICY"]] }, 1, 0]
                            }
                        },
                        "Premium": {
                            "$sum": {
                                "$cond": [{ "$in": ["$Last_Status", ["TRANS_SUCCESS_WITH_POLICY", "TRANS_SUCCESS_WO_POLICY"]] }, "$Erp_Qt_Request_Core.___final_premium___", 0]
                            }
                        }
                    }
                },
                {
                    "$project": {
                        _id: 0,
                        Product_Id: "$_id.Product_Id",
                        Search: 1,
                        Unique: 1,
                        Nop: 1,
                        Premium: 1
                    }
                }
            ];

            User_Data.aggregate(aggregate_ud).exec(function (err, dbUsersAggregate) {
                if (err) {
                    return res.send(err);
                }
                try {
                    let arr_agent_summary_level_1 = {};
                    if (dbUsersAggregate && dbUsersAggregate.length > 0) {
                        let arr_product_name = ["TW", "Car", "Travel", "CV", "Health", "Term", "CoronaCare", "CyberSecurity", "Marine"];
                        for (let prd of arr_product_name) {
                            arr_agent_summary_level_1[prd + '_Search'] = 0;
                            arr_agent_summary_level_1[prd + '_Unique'] = 0;
                            arr_agent_summary_level_1[prd + '_Nop'] = 0;
                            arr_agent_summary_level_1[prd + '_Premium'] = 0;
                        }
                        for (let k in dbUsersAggregate) {
                            let ind_agent_summary = dbUsersAggregate[k];
                            if (config.const_product.hasOwnProperty(ind_agent_summary['Product_Id'].toString())) {
                                let prod_name = config.const_product[ind_agent_summary['Product_Id'].toString()];
                                arr_agent_summary_level_1[prod_name + '_Search'] += ind_agent_summary['Search'];
                                arr_agent_summary_level_1[prod_name + '_Unique'] += ind_agent_summary['Unique'];
                                arr_agent_summary_level_1[prod_name + '_Nop'] += ind_agent_summary['Nop'];
                                arr_agent_summary_level_1[prod_name + '_Premium'] += ind_agent_summary['Premium'];
                            }
                        }
                    }
                    return res.json(arr_agent_summary_level_1);
                } catch (e) {
                    return res.send(e.stack);
                }
            });
        } catch (e) {
            return res.send(e.stack);
        }

    });
    app.get('/user_datas/agent_summary_process/rm_level', function (req, res) {
        try {
            let Agent_Summary = require('../models/agent_summary');
            let Rm_Summary = require('../models/rm_summary');
            let yesterday = moment().utcOffset("+05:30").startOf('Day').add(-1, 'days').format("YYYY-MM-DD");
            let report_date = yesterday;
            let cache_key = 'agent_summary_process_level_1_1_' + report_date;
            if (req.query['cache'] === 'yes' && fs.existsSync(appRoot + "/tmp/cachereport/" + cache_key + ".log") === true) {
                var cache_content = fs.readFileSync(appRoot + "/tmp/cachereport/" + cache_key + ".log").toString();

                return res.send(cache_content);
            } else {
                /*
                 let business_start = moment(report_date).utcOffset("+05:30").startOf('month').format("YYYY-MM-D");
                 let business_end = moment(report_date).utcOffset("+05:30").endOf('month').format("YYYY-MM-D");
                 let business_year_month = moment(report_date).utcOffset("+05:30").endOf('month').format("YYYYMM") -0; 
                 let business_year = moment(report_date).utcOffset("+05:30").endOf('month').format("YYYY") -0;
                 let business_month = moment(report_date).utcOffset("+05:30").endOf('month').format("MMM");
                 let arrFrom = business_start.split('-');
                 let dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);
                 let arrTo = business_end.split('-');
                 let dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
                 dateTo.setDate(dateTo.getDate() + 1);
                 
                 */
                let ym_start = req.query.hasOwnProperty('ym_start') ? req.query['ym_start'] : moment(report_date).utcOffset("+05:30").startOf('month').format("YYYYMM");
                let ym_end = req.query.hasOwnProperty('ym_end') ? req.query['ym_end'] : moment(report_date).utcOffset("+05:30").endOf('month').format("YYYYMM");

                let obj_financial = {
                    'April_2023-March_2024': { 'start': 202304, 'end': 202403 },
                    'April_2022-March_2023': { 'start': 202204, 'end': 202303 },
                    'April_2021-March_2022': { 'start': 202104, 'end': 202203 },
                    'April_2020-March_2021': { 'start': 202004, 'end': 202103 },
                    'April_2019-March_2020': { 'start': 201904, 'end': 202003 },
                    'April_2018-March_2019': { 'start': 201804, 'end': 201903 },
                    'April_2017-March_2018': { 'start': 201704, 'end': 201803 }
                };



                let obj_agent_monthly = {};
                let cond_ud = {
                    "Channel": { '$ne': 'CC' },
                    'Rm_Uid': { '$gt': 0 }
                };
                let rm_remove_cd = {};
                ym_start = ym_start - 0;
                ym_end = ym_end - 0;
                if (ym_start > 0 && ym_end > 0) {
                    cond_ud['Report_Year_Month'] = { $gte: ym_start, $lte: ym_end };
                    rm_remove_cd = { 'Report_Year_Month': { $gte: ym_start, $lte: ym_end } };
                }

                let aggregate_ud = [
                    { "$match": cond_ud },
                    {
                        "$group": {
                            _id: {
                                Report_Year_Month: "$Report_Year_Month",
                                Report_Year: "$Report_Year",
                                Report_Month: "$Report_Month",
                                Rm_Uid: "$Rm_Uid",
                                Rm_Name: "$Rm_Name"
                            },
                            "Search_Total": { "$sum": "$Search" },
                            "Nop_Total": { "$sum": "$Nop" },
                            "Premium_Total": { "$sum": "$Premium" },
                            "TW_Search_Total": { "$sum": "$TW_Search" },
                            "TW_Nop_Total": { "$sum": "$TW_Nop" },
                            "TW_Premium_Total": { "$sum": "$TW_Premium" },
                            "Car_Search_Total": { "$sum": "$Car_Search" },
                            "Car_Nop_Total": { "$sum": "$Car_Nop" },
                            "Car_Premium_Total": { "$sum": "$Car_Premium" },
                            "Travel_Search_Total": { "$sum": "$Travel_Search" },
                            "Travel_Nop_Total": { "$sum": "$Travel_Nop" },
                            "Travel_Premium_Total": { "$sum": "$Travel_Premium" },
                            "CV_Search_Total": { "$sum": "$CV_Search" },
                            "CV_Nop_Total": { "$sum": "$CV_Nop" },
                            "CV_Premium_Total": { "$sum": "$CV_Premium" },
                            "Health_Search_Total": { "$sum": "$Health_Search" },
                            "Health_Nop_Total": { "$sum": "$Health_Nop" },
                            "Health_Premium_Total": { "$sum": "$Health_Premium" },
                            "Term_Search_Total": { "$sum": "$Term_Search" },
                            "Term_Nop_Total": { "$sum": "$Term_Nop" },
                            "Term_Premium_Total": { "$sum": "$Term_Premium" },
                            "CoronaCare_Search_Total": { "$sum": "$CoronaCare_Search" },
                            "CoronaCare_Nop_Total": { "$sum": "$CoronaCare_Nop" },
                            "CoronaCare_Premium_Total": { "$sum": "$CoronaCare_Premium" },
                            "CyberSecurity_Search_Total": { "$sum": "$CyberSecurity_Search" },
                            "CyberSecurity_Nop_Total": { "$sum": "$CyberSecurity_Nop" },
                            "CyberSecurity_Premium_Total": { "$sum": "$CyberSecurity_Premium" },
                            "Marine_Search_Total": { "$sum": "$Marine_Search" },
                            "Marine_Nop_Total": { "$sum": "$Marine_Nop" },
                            "Marine_Premium_Total": { "$sum": "$Marine_Premium" }
                        }
                    },
                    {
                        "$project": {
                            _id: 0,
                            Report_Year_Month: "$_id.Report_Year_Month",
                            Report_Year: "$_id.Report_Year",
                            Report_Month: "$_id.Report_Month",
                            "Rm_Uid": "$_id.Rm_Uid",
                            "Rm_Name": "$_id.Rm_Name",
                            Search_Total: 1,
                            Nop_Total: 1,
                            Premium_Total: 1,
                            "TW_Search_Total": 1,
                            "TW_Nop_Total": 1,
                            "TW_Premium_Total": 1,
                            "Car_Search_Total": 1,
                            "Car_Nop_Total": 1,
                            "Car_Premium_Total": 1,
                            "Travel_Search_Total": 1,
                            "Travel_Nop_Total": 1,
                            "Travel_Premium_Total": 1,
                            "CV_Search_Total": 1,
                            "CV_Nop_Total": 1,
                            "CV_Premium_Total": 1,
                            "Health_Search_Total": 1,
                            "Health_Nop_Total": 1,
                            "Health_Premium_Total": 1,
                            "Term_Search_Total": 1,
                            "Term_Nop_Total": 1,
                            "Term_Premium_Total": 1,
                            "CoronaCare_Search_Total": 1,
                            "CoronaCare_Nop_Total": 1,
                            "CoronaCare_Premium_Total": 1,
                            "CyberSecurity_Search_Total": 1,
                            "CyberSecurity_Nop_Total": 1,
                            "CyberSecurity_Premium_Total": 1,
                            "Marine_Search_Total": 1,
                            "Marine_Nop_Total": 1,
                            "Marine_Premium_Total": 1
                        }
                    },
                    { "$sort": { 'Report_Year_Month': -1, 'Nop_Total': -1 } }
                ];
                if (req.query['dbg'] == 'qry') {
                    return res.json(aggregate_ud);
                } else {

                    Agent_Summary.aggregate(aggregate_ud).exec(function (err, dbUsersAggregate) {
                        if (err) {
                            return res.send(err);
                        }
                        try {
                            let arr_agent_summary_level_1 = [];
                            if (dbUsersAggregate && dbUsersAggregate.length > 0) {
                                for (let k in dbUsersAggregate) {
                                    let ind_agent_summary = dbUsersAggregate[k];
                                    let business_year_month = ind_agent_summary['Report_Year_Month'] - 0;
                                    let business_finacial_year = '';
                                    let ind_rm = {
                                        Financial_Year: '',
                                        Report_Year_Month: 0,
                                        Report_Year: 0,
                                        Report_Month: 0,
                                        "Rm_Uid": 0,
                                        "Rm_Name": ""
                                    };

                                    for (let ind_financial in obj_financial) {
                                        if (business_year_month >= obj_financial[ind_financial]['start'] && business_year_month <= obj_financial[ind_financial]['end']) {
                                            business_finacial_year = ind_financial;
                                            break;
                                        }
                                    }
                                    ind_agent_summary['Financial_Year'] = business_finacial_year;
                                    for (let z in ind_agent_summary) {
                                        ind_rm[z] = ind_agent_summary[z];
                                    }
                                    arr_agent_summary_level_1.push(ind_rm);
                                }

                            }
                            if (req.query['dbg'] == 'yes') {
                                res.json(arr_agent_summary_level_1);
                            } else if (req.query['dbg'] == 'execute') {
                                Rm_Summary.remove(rm_remove_cd, function (err, Agent_Summary_Remove_Summary) {
                                    Rm_Summary.insertMany(arr_agent_summary_level_1, function (err, DbInserted) {
                                        let objPayment = {
                                            'Report_Year_Month': cond_ud,
                                            'err': err,
                                            'DbInserted': DbInserted.length,
                                            'DbRemoved': Agent_Summary_Remove_Summary
                                        };
                                        return res.json(objPayment);
                                    });
                                });
                            } else {
                                let res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>Followup List</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body><h1>Count:' + arr_agent_summary_level_1.length + '</h1>';

                                arr_agent_summary_level_1.sort(function (a, b) {
                                    return b.Premium - a.Premium;
                                })
                                res_report += arrayobjectToHtml(arr_agent_summary_level_1);
                                res_report += '</body></html>';
                                /*fs.writeFile(appRoot + "/tmp/cachereport/" + cache_key + ".log", res_report, function (err) {
                                 if (err) {
                                 return console.error(err);
                                 }								
                                 });*/
                                return res.send(res_report);
                            }
                        } catch (e) {
                            return res.send(e.stack);
                        }
                    });
                }
            }
        } catch (e) {
            return res.send(e.stack);
        }

    });
    app.post('/user_datas/agent_monthly_performance', LoadSession, function (req, res) {
        try {
            var Base = require('../libs/Base');
            var objBase = new Base();
            var obj_pagination = objBase.jqdt_paginate_process(req.body);
            var optionPaginate = {
                select: '',
                sort: { 'Report_Year_Month': -1, 'Search': -1, 'Nop': -1 },
                lean: true,
                page: 1,
                limit: 25
            };
            if (obj_pagination) {
                //optionPaginate['page'] = obj_pagination.paginate.page;
                //optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
            }
            var filter = obj_pagination.filter;
            var ObjRequest = req.body;
            if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1) {
            } else if (req.obj_session.user.role_detail.role.indexOf('ChannelHead') > -1) {
                var arr_ch_ssid = [];
                if (req.obj_session.hasOwnProperty('users_assigned')) {
                    arr_ch_ssid = req.obj_session.users_assigned.Team.CSE;
                }
                arr_ch_ssid.push(req.obj_session.user.ss_id);
                channel = req.obj_session.user.role_detail.channel;
                filter['$or'] = [
                    { 'Channel': channel },
                    { 'Ss_Id': { $in: arr_ch_ssid } }
                ];
            } else {
                var arr_ssid = [];
                if (req.obj_session.hasOwnProperty('users_assigned')) {
                    var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
                    arr_ssid = combine_arr.split(',').filter(Number).map(Number);
                }
                arr_ssid.push(req.obj_session.user.ss_id);
                filter['Ss_Id'] = { $in: arr_ssid };
            }

            if (typeof ObjRequest['Channel'] !== 'undefined') {
                filter['Channel'] = ObjRequest['Channel'];
            }
            if (typeof ObjRequest['Report_Year'] !== 'undefined') {
                filter['Report_Year'] = ObjRequest['Report_Year'] - 0;
            }
            if (typeof ObjRequest['Report_Month'] !== 'undefined') {
                filter['Report_Month'] = ObjRequest['Report_Month'].toString();
            }
            if (typeof ObjRequest['Report_Type'] !== 'undefined') {
                if (ObjRequest['Report_Type'] == 'SEARCH_SALE_BOTH') {
                    filter['Search'] = { $gt: 0 };
                    filter['Nop'] = { $gt: 0 };
                }
                if (ObjRequest['Report_Type'] == 'SEARCH_ONLY') {
                    filter['Search'] = { $gt: 0 };
                    filter['Nop'] = { $eq: 0 };
                }
            }


            if (ObjRequest['dbg'] === 'yes') {
                res.json({
                    "filter": filter,
                    "optionPaginate": optionPaginate
                });
            } else {
                let Agent_Summary = require('../models/agent_summary');
                if (ObjRequest['paginate'] === 'no') {
                    Agent_Summary.paginate(filter, optionPaginate).then(function (dbAgent_Summaries) {
                        res.json(dbAgent_Summaries);
                    });
                } else {
                    Agent_Summary.paginate(filter, optionPaginate).then(function (dbAgent_Summaries) {
                        res.json(dbAgent_Summaries);
                    });
                }
            }
        } catch (e) {
            console.error(e.stack);
            res.json({ "Msg": "error", 'Details': e.stack });
        }
    });
    app.post('/user_datas/rm_monthly_performance', LoadSession, function (req, res) {
        try {
            var Base = require('../libs/Base');
            var objBase = new Base();
            var obj_pagination = objBase.jqdt_paginate_process(req.body);
            var optionPaginate = {
                select: '',
                sort: { 'Report_Year_Month': -1, 'Search': -1, 'Nop': -1 },
                lean: true,
                page: 1,
                limit: 10
            };
            if (obj_pagination) {
                //optionPaginate['page'] = obj_pagination.paginate.page;
                //optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
            }
            var filter = obj_pagination.filter;
            var ObjRequest = req.body;
            if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1) {
            } else if (req.obj_session.user.role_detail.role.indexOf('ChannelHead') > -1) {
                var arr_ch_ssid = [];
                if (req.obj_session.hasOwnProperty('users_assigned')) {
                    arr_ch_ssid = req.obj_session.users_assigned.Team.CSE;
                }
                arr_ch_ssid.push(req.obj_session.user.ss_id);
                channel = req.obj_session.user.role_detail.channel;
                filter['$or'] = [
                    { 'Channel': channel },
                    { 'Ss_Id': { $in: arr_ch_ssid } }
                ];
            } else {
                var arr_ssid = [];
                if (req.obj_session.hasOwnProperty('users_assigned')) {
                    var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
                    arr_ssid = combine_arr.split(',').filter(Number).map(Number);
                }
                arr_ssid.push(req.obj_session.user.ss_id);
                filter['Ss_Id'] = { $in: arr_ssid };
            }

            if (typeof ObjRequest['Channel'] !== 'undefined') {
                filter['Channel'] = ObjRequest['Channel'];
            }
            if (typeof ObjRequest['Report_Year'] !== 'undefined') {
                filter['Report_Year'] = ObjRequest['Report_Year'] - 0;
            }
            if (typeof ObjRequest['Report_Month'] !== 'undefined') {
                filter['Report_Month'] = ObjRequest['Report_Month'].toString();
            }
            if (typeof ObjRequest['Report_Type'] !== 'undefined') {
                if (ObjRequest['Report_Type'] == 'SEARCH_SALE_BOTH') {
                    filter['Search'] = { $gt: 0 };
                    filter['Nop'] = { $gt: 0 };
                }
                if (ObjRequest['Report_Type'] == 'SEARCH_ONLY') {
                    filter['Search'] = { $gt: 0 };
                    filter['Nop'] = { $eq: 0 };
                }
            }


            if (ObjRequest['dbg'] === 'yes') {
                res.json({
                    "filter": filter,
                    "optionPaginate": optionPaginate
                });
            } else {
                let Rm_Summary = require('../models/rm_summary');
                if (ObjRequest['paginate'] === 'no') {
                    Rm_Summary.paginate(filter, optionPaginate).then(function (dbAgent_Summaries) {
                        res.json(dbAgent_Summaries);
                    });
                } else {
                    Rm_Summary.paginate(filter, optionPaginate).then(function (dbAgent_Summaries) {
                        res.json(dbAgent_Summaries);
                    });
                }
            }
        } catch (e) {
            console.error(e.stack);
            res.json({ "Msg": "error", 'Details': e.stack });
        }
    });
    app.post('/user_datas/agent_monthly_performance_all', LoadSession, function (req, res) {
        try {
            var filter = {};
            var ObjRequest = req.body;
            if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1) {
            } else if (req.obj_session.user.role_detail.role.indexOf('ChannelHead') > -1) {
                var arr_ch_ssid = [];
                if (req.obj_session.hasOwnProperty('users_assigned')) {
                    arr_ch_ssid = req.obj_session.users_assigned.Team.CSE;
                }
                arr_ch_ssid.push(req.obj_session.user.ss_id);
                channel = req.obj_session.user.role_detail.channel;
                filter['$or'] = [
                    { 'Channel': channel },
                    { 'Ss_Id': { $in: arr_ch_ssid } }
                ];
            } else {
                var arr_ssid = [];
                if (req.obj_session.hasOwnProperty('users_assigned')) {
                    var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
                    arr_ssid = combine_arr.split(',').filter(Number).map(Number);
                }
                arr_ssid.push(req.obj_session.user.ss_id);
                filter['Ss_Id'] = { $in: arr_ssid };
            }

            if (typeof ObjRequest['Channel'] !== 'undefined') {
                filter['Channel'] = ObjRequest['Channel'];
            }
            if (typeof ObjRequest['Report_Year'] !== 'undefined') {
                filter['Report_Year'] = ObjRequest['Report_Year'] - 0;
            }
            if (typeof ObjRequest['Report_Month'] !== 'undefined') {
                filter['Report_Month'] = ObjRequest['Report_Month'].toString();
            }
            if (typeof ObjRequest['Report_Type'] !== 'undefined') {
                if (ObjRequest['Report_Type'] == 'SEARCH_SALE_BOTH') {
                    filter['Search'] = { $gt: 0 };
                    filter['Nop'] = { $gt: 0 };
                }
                if (ObjRequest['Report_Type'] == 'SEARCH_ONLY') {
                    filter['Search'] = { $gt: 0 };
                    filter['Nop'] = { $eq: 0 };
                }
            }


            let agent_summary_agg = [
                { "$match": filter },
                {
                    "$group": {
                        _id: { Report_Year_Month: "$Report_Year_Month" },
                        "Agent": { $sum: 1 },
                        "Rm_Total": { $addToSet: "$Rm_Uid" },
                        "Search_Total": { "$sum": "$Search" },
                        "Nop_Total": { "$sum": "$Nop" },
                        "Premium_Total": { "$sum": "$Premium" },
                        "TW_Search_Total": { "$sum": "$TW_Search" },
                        "TW_Nop_Total": { "$sum": "$TW_Nop" },
                        "TW_Premium_Total": { "$sum": "$TW_Premium" },
                        "Car_Search_Total": { "$sum": "$Car_Search" },
                        "Car_Nop_Total": { "$sum": "$Car_Nop" },
                        "Car_Premium_Total": { "$sum": "$Car_Premium" },
                        "Travel_Search_Total": { "$sum": "$Travel_Search" },
                        "Travel_Nop_Total": { "$sum": "$Travel_Nop" },
                        "Travel_Premium_Total": { "$sum": "$Travel_Premium" },
                        "CV_Search_Total": { "$sum": "$CV_Search" },
                        "CV_Nop_Total": { "$sum": "$CV_Nop" },
                        "CV_Premium_Total": { "$sum": "$CV_Premium" },
                        "Health_Search_Total": { "$sum": "$Health_Search" },
                        "Health_Nop_Total": { "$sum": "$Health_Nop" },
                        "Health_Premium_Total": { "$sum": "$Health_Premium" },
                        "Term_Search_Total": { "$sum": "$Term_Search" },
                        "Term_Nop_Total": { "$sum": "$Term_Nop" },
                        "Term_Premium_Total": { "$sum": "$Term_Premium" },
                        "CoronaCare_Search_Total": { "$sum": "$CoronaCare_Search" },
                        "CoronaCare_Nop_Total": { "$sum": "$CoronaCare_Nop" },
                        "CoronaCare_Premium_Total": { "$sum": "$CoronaCare_Premium" },
                        "CyberSecurity_Search_Total": { "$sum": "$CyberSecurity_Search" },
                        "CyberSecurity_Nop_Total": { "$sum": "$CyberSecurity_Nop" },
                        "CyberSecurity_Premium_Total": { "$sum": "$CyberSecurity_Premium" },
                        "Marine_Search_Total": { "$sum": "$Marine_Search" },
                        "Marine_Nop_Total": { "$sum": "$Marine_Nop" },
                        "Marine_Premium_Total": { "$sum": "$Marine_Premium" }
                    }
                },
                {
                    "$project": {
                        _id: 0,
                        Report_Year_Month: "$_id.Report_Year_Month",
                        Agent: 1,
                        "Rm": { $size: "$Rm_Total" },
                        Search_Total: 1,
                        Nop_Total: 1,
                        Premium_Total: 1,
                        "TW_Search_Total": 1,
                        "TW_Nop_Total": 1,
                        "TW_Premium_Total": 1,
                        "Car_Search_Total": 1,
                        "Car_Nop_Total": 1,
                        "Car_Premium_Total": 1,
                        "Travel_Search_Total": 1,
                        "Travel_Nop_Total": 1,
                        "Travel_Premium_Total": 1,
                        "CV_Search_Total": 1,
                        "CV_Nop_Total": 1,
                        "CV_Premium_Total": 1,
                        "Health_Search_Total": 1,
                        "Health_Nop_Total": 1,
                        "Health_Premium_Total": 1,
                        "Term_Search_Total": 1,
                        "Term_Nop_Total": 1,
                        "Term_Premium_Total": 1,
                        "CoronaCare_Search_Total": 1,
                        "CoronaCare_Nop_Total": 1,
                        "CoronaCare_Premium_Total": 1,
                        "CyberSecurity_Search_Total": 1,
                        "CyberSecurity_Nop_Total": 1,
                        "CyberSecurity_Premium_Total": 1,
                        "Marine_Search_Total": 1,
                        "Marine_Nop_Total": 1,
                        "Marine_Premium_Total": 1
                    }
                },
                { "$sort": { 'Report_Year_Month': -1 } }
            ];

            if (ObjRequest['report_range'] === 'YEARLY') {
                agent_summary_agg = [
                    { "$match": filter },
                    {
                        "$group": {
                            _id: { "Financial_Year": "$Financial_Year" },
                            "Agent_Total": { $addToSet: "$Ss_Id" },
                            "Rm_Total": { $addToSet: "$Rm_Uid" },
                            "Search_Total": { "$sum": "$Search" },
                            "Nop_Total": { "$sum": "$Nop" },
                            "Premium_Total": { "$sum": "$Premium" },
                            "TW_Search_Total": { "$sum": "$TW_Search" },
                            "TW_Nop_Total": { "$sum": "$TW_Nop" },
                            "TW_Premium_Total": { "$sum": "$TW_Premium" },
                            "Car_Search_Total": { "$sum": "$Car_Search" },
                            "Car_Nop_Total": { "$sum": "$Car_Nop" },
                            "Car_Premium_Total": { "$sum": "$Car_Premium" },
                            "Travel_Search_Total": { "$sum": "$Travel_Search" },
                            "Travel_Nop_Total": { "$sum": "$Travel_Nop" },
                            "Travel_Premium_Total": { "$sum": "$Travel_Premium" },
                            "CV_Search_Total": { "$sum": "$CV_Search" },
                            "CV_Nop_Total": { "$sum": "$CV_Nop" },
                            "CV_Premium_Total": { "$sum": "$CV_Premium" },
                            "Health_Search_Total": { "$sum": "$Health_Search" },
                            "Health_Nop_Total": { "$sum": "$Health_Nop" },
                            "Health_Premium_Total": { "$sum": "$Health_Premium" },
                            "Term_Search_Total": { "$sum": "$Term_Search" },
                            "Term_Nop_Total": { "$sum": "$Term_Nop" },
                            "Term_Premium_Total": { "$sum": "$Term_Premium" },
                            "CoronaCare_Search_Total": { "$sum": "$CoronaCare_Search" },
                            "CoronaCare_Nop_Total": { "$sum": "$CoronaCare_Nop" },
                            "CoronaCare_Premium_Total": { "$sum": "$CoronaCare_Premium" },
                            "CyberSecurity_Search_Total": { "$sum": "$CyberSecurity_Search" },
                            "CyberSecurity_Nop_Total": { "$sum": "$CyberSecurity_Nop" },
                            "CyberSecurity_Premium_Total": { "$sum": "$CyberSecurity_Premium" },
                            "Marine_Search_Total": { "$sum": "$Marine_Search" },
                            "Marine_Nop_Total": { "$sum": "$Marine_Nop" },
                            "Marine_Premium_Total": { "$sum": "$Marine_Premium" }
                        }
                    },
                    {
                        "$project": {
                            _id: 0,
                            "Financial_Year": "$_id.Financial_Year",
                            "Agent_Unique": { $size: "$Agent_Total" },
                            "Rm_Unique": { $size: "$Rm_Total" },
                            "Search_Total": 1,
                            "Nop_Total": 1,
                            "Premium_Total": 1,
                            "TW_Search_Total": 1,
                            "TW_Nop_Total": 1,
                            "TW_Premium_Total": 1,
                            "Car_Search_Total": 1,
                            "Car_Nop_Total": 1,
                            "Car_Premium_Total": 1,
                            "Travel_Search_Total": 1,
                            "Travel_Nop_Total": 1,
                            "Travel_Premium_Total": 1,
                            "CV_Search_Total": 1,
                            "CV_Nop_Total": 1,
                            "CV_Premium_Total": 1,
                            "Health_Search_Total": 1,
                            "Health_Nop_Total": 1,
                            "Health_Premium_Total": 1,
                            "Term_Search_Total": 1,
                            "Term_Nop_Total": 1,
                            "Term_Premium_Total": 1,
                            "CoronaCare_Search_Total": 1,
                            "CoronaCare_Nop_Total": 1,
                            "CoronaCare_Premium_Total": 1,
                            "CyberSecurity_Search_Total": 1,
                            "CyberSecurity_Nop_Total": 1,
                            "CyberSecurity_Premium_Total": 1,
                            "Marine_Search_Total": 1,
                            "Marine_Nop_Total": 1,
                            "Marine_Premium_Total": 1
                        }
                    },
                    { "$sort": { 'Financial_Year': -1 } }
                ];
            }
            if (ObjRequest['report_range'] === 'ALLTIME') {
                agent_summary_agg = [
                    { "$match": filter },
                    {
                        "$group": {
                            _id: null,
                            "Agent_Total": { $addToSet: "$Ss_Id" },
                            "Rm_Total": { $addToSet: "$Rm_Uid" },
                            "Search_Total": { "$sum": "$Search" },
                            "Nop_Total": { "$sum": "$Nop" },
                            "Premium_Total": { "$sum": "$Premium" },
                            "TW_Search_Total": { "$sum": "$TW_Search" },
                            "TW_Nop_Total": { "$sum": "$TW_Nop" },
                            "TW_Premium_Total": { "$sum": "$TW_Premium" },
                            "Car_Search_Total": { "$sum": "$Car_Search" },
                            "Car_Nop_Total": { "$sum": "$Car_Nop" },
                            "Car_Premium_Total": { "$sum": "$Car_Premium" },
                            "Travel_Search_Total": { "$sum": "$Travel_Search" },
                            "Travel_Nop_Total": { "$sum": "$Travel_Nop" },
                            "Travel_Premium_Total": { "$sum": "$Travel_Premium" },
                            "CV_Search_Total": { "$sum": "$CV_Search" },
                            "CV_Nop_Total": { "$sum": "$CV_Nop" },
                            "CV_Premium_Total": { "$sum": "$CV_Premium" },
                            "Health_Search_Total": { "$sum": "$Health_Search" },
                            "Health_Nop_Total": { "$sum": "$Health_Nop" },
                            "Health_Premium_Total": { "$sum": "$Health_Premium" },
                            "Term_Search_Total": { "$sum": "$Term_Search" },
                            "Term_Nop_Total": { "$sum": "$Term_Nop" },
                            "Term_Premium_Total": { "$sum": "$Term_Premium" },
                            "CoronaCare_Search_Total": { "$sum": "$CoronaCare_Search" },
                            "CoronaCare_Nop_Total": { "$sum": "$CoronaCare_Nop" },
                            "CoronaCare_Premium_Total": { "$sum": "$CoronaCare_Premium" },
                            "CyberSecurity_Search_Total": { "$sum": "$CyberSecurity_Search" },
                            "CyberSecurity_Nop_Total": { "$sum": "$CyberSecurity_Nop" },
                            "CyberSecurity_Premium_Total": { "$sum": "$CyberSecurity_Premium" },
                            "Marine_Search_Total": { "$sum": "$Marine_Search" },
                            "Marine_Nop_Total": { "$sum": "$Marine_Nop" },
                            "Marine_Premium_Total": { "$sum": "$Marine_Premium" }
                        }
                    },
                    {
                        "$project": {
                            _id: 0,
                            "Agent_Unique": { $size: "$Agent_Total" },
                            "Rm_Unique": { $size: "$Rm_Total" },
                            "Search_Total": 1,
                            "Nop_Total": 1,
                            "Premium_Total": 1,
                            "TW_Search_Total": 1,
                            "TW_Nop_Total": 1,
                            "TW_Premium_Total": 1,
                            "Car_Search_Total": 1,
                            "Car_Nop_Total": 1,
                            "Car_Premium_Total": 1,
                            "Travel_Search_Total": 1,
                            "Travel_Nop_Total": 1,
                            "Travel_Premium_Total": 1,
                            "CV_Search_Total": 1,
                            "CV_Nop_Total": 1,
                            "CV_Premium_Total": 1,
                            "Health_Search_Total": 1,
                            "Health_Nop_Total": 1,
                            "Health_Premium_Total": 1,
                            "Term_Search_Total": 1,
                            "Term_Nop_Total": 1,
                            "Term_Premium_Total": 1,
                            "CoronaCare_Search_Total": 1,
                            "CoronaCare_Nop_Total": 1,
                            "CoronaCare_Premium_Total": 1,
                            "CyberSecurity_Search_Total": 1,
                            "CyberSecurity_Nop_Total": 1,
                            "CyberSecurity_Premium_Total": 1,
                            "Marine_Search_Total": 1,
                            "Marine_Nop_Total": 1,
                            "Marine_Premium_Total": 1
                        }
                    }
                ];
            }
            let Agent_Summary = require('../models/agent_summary');
            Agent_Summary.aggregate(agent_summary_agg).then(function (dbAgent_Summaries) {
                res.json(dbAgent_Summaries);
            });


        } catch (e) {
            console.error(e.stack);
            res.json({ "Msg": "error", 'Details': e.stack });
        }
    });
    app.get('/user_datas/quicklistcorp/:Product_Id/:Type/:Ss_Id/:Fba_Id/:Page/:Mobile/:Sub_Fba_Id?', function (req, res) {
        try {
            var Product_Id = req.params.Product_Id - 0;
            var Fba_Id = req.params.Fba_Id - 0;
            var Type = req.params.Type;
            var Ss_Id = req.params.Ss_Id - 0;
            var Page = req.params.Page - 0;
            var Skip = 0;
            var Limit = 10;
            var status_grp = "";
            var Mobile = (req.params.hasOwnProperty('Mobile')) ? req.params.Mobile : 0;
            var Sub_Fba_Id = (req.params.hasOwnProperty('Sub_Fba_Id')) ? req.params.Sub_Fba_Id - 0 : 0;
            if (Ss_Id && Type && Page) {
                var Condition = {
                    "Product_Id": Product_Id
                    //"Last_Status": ""
                };
                //agent condition
                if (Ss_Id) { //10859
                    if (Ss_Id === 10859 && Product_Id === 2) {
                        Condition['Premium_Request.ss_id'] = 0;
                    } else if (Ss_Id === 5417) {
                        Condition['Premium_Request.ss_id'] = 0;
                    } else if (Ss_Id === 7844 || Ss_Id === 8048 || Ss_Id === 12311) {
                        Condition['Premium_Request.posp_sources'] = 1;
                    } else if (Ss_Id === 8304) {
                        Condition['Premium_Request.posp_sources'] = 2;
                    } else if (Type === 'INSPECTION' && Ss_Id === 487) {
                    } else {
                        if (Ss_Id === 5) {
                            Condition['Premium_Request.fba_id'] = Fba_Id;
                        } else if (Ss_Id !== 5) {
                            Condition['Premium_Request.ss_id'] = Ss_Id;
                            if (Sub_Fba_Id > 0) {
                                Condition['Premium_Request.sub_fba_id'] = Sub_Fba_Id;
                            }
                        }
                    }
                }

                if (Mobile > 0) {
                    Condition['Premium_Request.mobile'] = Mobile;
                }

                if (Product_Id === 22) { //hospicash 
                    Condition['Premium_Request.is_hospi'] = "yes";
                    Condition['Product_Id'] = 2;
                } else if (Product_Id === 23) //Group health Insurance 
                {
                    Condition['Premium_Request.is_ghi'] = "yes";
                    Condition['Product_Id'] = 2;
                } else if (Product_Id === 42) //Shortteam Policy
                {
                    Condition['Premium_Request.is_short_term_policy'] = "yes";
                    Condition['Product_Id'] = 2;
                } else if (Product_Id === 35) //TW Express
                {
                    Condition['Premium_Request.ui_source'] = "quick_tw_journey";
                    Condition['Product_Id'] = 10;
                } else {

                }
                //type condition
                var ObjSummaryStatus = {
                    'SEARCH': ['SEARCH', 'ADDON_QUOTE_APPLY', 'ADDON_PROPOSAL_AGENT_APPLY', 'BUY_NOW_AGENT'],
                    'LINK_SENT': ['PROPOSAL_LINK_SENT', 'BUY_NOW_CUSTOMER', 'ADDON_PROPOSAL_CUSTOMER_APPLY', 'ADDON_QUOTE_APPLY', 'ADDON_PROPOSAL_AGENT_APPLY', 'BUY_NOW_AGENT'],
                    'PAYMENT_PENDING': ['PROPOSAL_SUBMIT', 'PROPOSAL_EXCEPTION'],
                    'POLICY_PENDING': ['VERIFICATION_EXCEPTION', 'TRANS_MANUAL_PAYPASS', 'TRANS_PAYPASS'],
                    'FAIL': ['TRANS_FAIL'],
                    'SELL': ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY']
                };
                var ObjSummaryCondition = {
                    //                    'QUOTE': ['SEARCH', 'ADDON_PROPOSAL_CUSTOMER_APPLY', 'ADDON_QUOTE_APPLY', 'ADDON_PROPOSAL_AGENT_APPLY'],
                    'QUOTE': ['SEARCH', 'PROPOSAL_LINK_SENT', 'BUY_NOW_CUSTOMER'],
                    'APPLICATION': ['PROPOSAL_LINK_SENT', 'BUY_NOW_CUSTOMER', 'BUY_NOW_AGENT', 'PROPOSAL_SUBMIT', 'PROPOSAL_EXCEPTION', 'TRANS_FAIL', 'PROPOSAL_SAVE_AGENT'],
                    'COMPLETE': ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY', 'VERIFICATION_EXCEPTION', 'TRANS_MANUAL_PAYPASS', 'TRANS_PAYPASS'],
                    'INSPECTION': ['INSPECTION_SCHEDULED', 'INSPECTION_APPROVED', 'INSPECTION_REJECTED', 'INSPECTION_EXCEPTION', 'INSPECTION_REINSPECTION', 'INSPECTION_SUBMITTED'],
                    'INSPECTION_SUBMITTED': ['INSPECTION_SUBMITTED'],
                    'PENDING_PAYMENT': ['PROPOSAL_SUBMIT', 'PROPOSAL_EXCEPTION', 'TRANS_FAIL'],
                    'SENDLINK': ['PROPOSAL_LINK_SENT'],
                    'PROPOSALSUBMIT': ['PROPOSAL_SUBMIT', 'PROPOSAL_EXCEPTION']
                };
                if (Type === 'SEARCH') {
                    Condition['Last_Status'] = { $in: ObjSummaryCondition['QUOTE'] };
                }
                if (Type === 'APPLICATION') {
                    Condition['Last_Status'] = { $in: ObjSummaryCondition['APPLICATION'] };
                }
                if (Type === 'SELL') {
                    Condition['Last_Status'] = { $in: ObjSummaryCondition['COMPLETE'] };
                    if (Product_Id === 35) //TW Express
                    {
                        Condition['Last_Status'] = ['SEARCH', 'ADDON_PROPOSAL_CUSTOMER_APPLY', 'ADDON_QUOTE_APPLY', 'ADDON_PROPOSAL_AGENT_APPLY', 'PROPOSAL_LINK_SENT', 'BUY_NOW_CUSTOMER', 'BUY_NOW_AGENT', 'PROPOSAL_SUBMIT', 'PROPOSAL_EXCEPTION', 'TRANS_FAIL', 'PROPOSAL_SAVE_AGENT'];
                    }
                }
                if (Type === 'INSPECTION' && Ss_Id !== 487) {
                    Condition['Last_Status'] = { $in: ObjSummaryCondition['INSPECTION'] };
                }
                if (Type === 'INSPECTION' && Ss_Id === 487) {
                    Condition['Last_Status'] = { $in: ObjSummaryCondition['INSPECTION_SUBMITTED'] };
                }
                if (Type === 'PENDING_PAYMENT') {
                    Condition['Last_Status'] = { $in: ObjSummaryCondition['PENDING_PAYMENT'] };
                }
                if (Type === 'SENDLINK') {
                    Condition['Last_Status'] = { $in: ObjSummaryCondition['SENDLINK'] };
                }
                if (Type === 'PROPOSALSUBMIT') {
                    Condition['Last_Status'] = { $in: ObjSummaryCondition['PROPOSALSUBMIT'] };
                }
                Condition['Product_Id'] = { $in: [19, 20, 21, 22, 23, 13] };
                var pageCount = 0;
                console.log(Condition);
                User_Data.find(Condition).count(function (e, count) {
                    console.log(count);
                    pageCount = count;
                });
                //page is 
                if (Page > 1) {
                    Skip = Limit * (Page - 1);
                }
                //console.error('UDBG', Ss_Id, Page, Skip, Limit);
                User_Data.find(Condition).sort({
                    Modified_On: -1
                }).select(['Product_Id', 'PB_CRN', 'Request_Unique_Id', 'Report_Summary', 'Premium_Request', 'Premium_Summary', 'Proposal_Request', 'Last_Status', 'Created_On', 'Modified_On', 'Client_Id', 'Transaction_Data', 'Erp_Qt_Request_Core', 'Status_History', 'Insurer_Id', 'User_Data_Id', 'Transaction_Data', 'ERP_CS', 'Service_Log_Unique_Id', 'Proposal_History', 'Premium_List', 'Preferred_Plan_Data', 'Proposal_Request_Core']).skip(Skip).limit(Limit).exec(function (err, dbUsers) {
                    //console.error('UDBG', err, dbUsers);
                    try {
                        if (!err) {
                            var arr_User_Data = [];
                            for (var k in dbUsers) {
                                try {
                                    var user = dbUsers[k]._doc;
                                    var dt = (new Date(user.Modified_On)).toLocaleString();
                                    var Quote_Date = dt;
                                    //                                    dt = dt.split(',');
                                    //                                    var Quote_Date_Mobile = dt[0];
                                    if (Quote_Date) {
                                        try {
                                            Quote_Date_Mobile = moment(Quote_Date).format("DD/MM/YYYY");
                                        } catch (err) {
                                            Quote_Date_Mobile = '';
                                        }
                                    } else {
                                        Quote_Date_Mobile = '';
                                    }
                                    //Quote_Date_Mobile = dt;
                                    var customer = 'NO NAME';
                                    var mobile = user['Premium_Request'].hasOwnProperty('mobile') ? user['Premium_Request']['mobile'] : "";


                                    if (user.hasOwnProperty('Proposal_Request') && user['Proposal_Request'] && user['Proposal_Request'].hasOwnProperty('first_name')) {
                                        customer = user['Proposal_Request']['first_name'] + ' ' + user['Proposal_Request']['last_name'];
                                    } else {
                                        if (user.Product_Id === 2 || user.Product_Id === 17 || user.Product_Id === 18 || user.Product_Id === 4 || user.Product_Id === 13) {
                                            customer = user['Premium_Request'].hasOwnProperty('contact_name') ? user['Premium_Request']['contact_name'] : "";
                                            if (customer === "") {
                                                if (user['Premium_Request'].customer_name) {
                                                    customer = user['Premium_Request']['customer_name'];
                                                } else {
                                                    customer = user['Premium_Request']['first_name'] + ' ' + user['Premium_Request']['last_name'];
                                                }
                                            }
                                        } else {
                                            if (user['Premium_Request'].customer_name) {
                                                customer = user['Premium_Request']['customer_name']
                                            } else {
                                                customer = user['Premium_Request']['first_name'] + ' ' + user['Premium_Request']['last_name'];
                                            }
                                        }
                                    }

                                    if (hasNumber(customer)) {
                                        customer = 'NO NAME';
                                    }



                                    if (user.hasOwnProperty('Proposal_Request') && user['Proposal_Request'] && user['Proposal_Request'].hasOwnProperty('mobile')) {
                                        mobile = user['Proposal_Request']['mobile'];
                                    }

                                    if (mobile) {
                                        mobile = mobile - 0;
                                    }



                                    if (Ss_Id === 5417) {
                                        customer = customer + '(MO#' + mobile + ')';
                                    }

                                    var contact_name = customer.toString().toTitleCase();
                                    var Sum_Insured = 0;
                                    if (user.Product_Id === 1 || user.Product_Id === 10 || user.Product_Id === 12) {
                                        if (user.Premium_Request['vehicle_insurance_subtype'] === "0CH_3TP" || user.Premium_Request['vehicle_insurance_subtype'] === "0CH_1TP" || user.Premium_Request['vehicle_insurance_subtype'] === "0CH_5TP") {
                                            Sum_Insured = 'NA';
                                        } else {
                                            if (user.hasOwnProperty('Erp_Qt_Request_Core') && user.Erp_Qt_Request_Core) {
                                                Sum_Insured = user.Erp_Qt_Request_Core.___vehicle_expected_idv___;
                                            } else if (user.hasOwnProperty('Proposal_Request_Core') && user.Proposal_Request_Core) {
                                                Sum_Insured = user.Proposal_Request_Core.vehicle_expected_idv;
                                            } else {
                                                if (user['Premium_Request']['vehicle_expected_idv'] !== null && user['Premium_Request']['vehicle_expected_idv'] !== undefined) {
                                                    Sum_Insured = user['Premium_Request']['vehicle_expected_idv'];
                                                }
                                            }
                                        }
                                    }
                                    if (user.Product_Id === 2) {
                                        Sum_Insured = user['Premium_Request']['is_hospi'] === "yes" ? user['Premium_Request']['per_day_si'] : user['Premium_Request']['health_insurance_si'];
                                    }
                                    if (user.Product_Id === 5) {
                                        Sum_Insured = user['Premium_Request']['investment_amount'] + '/' + user['Premium_Request']['frequency'];
                                    }
                                    if (user.Product_Id === 17) {
                                        Sum_Insured = user['Premium_Request'].hasOwnProperty('corona_insurance_si') ? user['Premium_Request']['corona_insurance_si'] : "";
                                    }
                                    if (user.Product_Id === 18) {
                                        Sum_Insured = user['Premium_Request'].hasOwnProperty('cs_insurance_si') ? user['Premium_Request']['cs_insurance_si'] : "";
                                    }
                                    var Progress = 0;
                                    status_grp = user['Last_Status'];
                                    var Progress = 0;
                                    var Color_code = "";
                                    if (ObjSummaryStatus['LINK_SENT'].indexOf(status_grp) > -1) {
                                        Progress = 50;
                                        Color_code = "#a50ae9";
                                    }
                                    if (ObjSummaryStatus['FAIL'].indexOf(status_grp) > -1) {
                                        Progress = 70;
                                        Color_code = "#ff8d28";
                                    }
                                    if (ObjSummaryStatus['PAYMENT_PENDING'].indexOf(status_grp) > -1) {
                                        Progress = 80;
                                        Color_code = "#263fb8";
                                    }
                                    if (ObjSummaryStatus['POLICY_PENDING'].indexOf(status_grp) > -1) {
                                        Progress = 90;
                                        Color_code = "#00811f";
                                    }
                                    if (ObjSummaryStatus['SELL'].indexOf(status_grp) > -1) {
                                        Progress = 100;
                                        Color_code = "green";
                                    }
                                    if (!Sum_Insured) {
                                        Sum_Insured = 'NA'
                                    }
                                    var objUD = {
                                        'Customer_Name': contact_name,
                                        'Customer_Mobile': mobile,
                                        'Sum_Insured': Sum_Insured,
                                        'CRN': user['PB_CRN'],
                                        'Quote_Date': Quote_Date,
                                        'Quote_Date_Mobile': Quote_Date_Mobile,
                                        'Created_On': user.Modified_On,
                                        'SRN': user['Request_Unique_Id'] + '_' + user['User_Data_Id'],
                                        'SRN_Core': user['Request_Unique_Id'],
                                        'udid': user['User_Data_Id'],
                                        'Last_Status': user['Last_Status'],
                                        'Application_Date': '',
                                        'Insurer': '',
                                        'Progress': Progress,
                                        'Premium': 0,
                                        'ERP_CS': user['ERP_CS'],
                                        'Color_code': Color_code,
                                        'Registration_no': user['Premium_Request']['registration_no'],
                                        'PageCount': Math.round(pageCount / 10),
                                        'Vehicle_Name': "",
                                        'RTO': "",
                                        'Product_Id': user.Product_Id
                                    };
                                    if ((Type === 'SEARCH' || Type === 'ALL') && [1, 12, 10].indexOf(user['Product_Id']) > -1) {
                                        if (user['Premium_Request'].hasOwnProperty('vehicle_full')) {
                                            var arr_veh = user['Premium_Request']['vehicle_full'].split('|');
                                            objUD['Vehicle_Name'] = arr_veh[0] + ' ' + arr_veh[1] + ' ' + arr_veh[2];
                                            objUD['RTO'] = user['Premium_Request']['rto_full'].split('|')[1];
                                        }
                                    }
                                    /*if (Type === 'SEARCH' || Type === 'ALL') {
                                     var args = {
                                     data: {
                                     "search_reference_number": user['Request_Unique_Id'],
                                     "udid": user['User_Data_Id'],
                                     "secret_key": "SECRET-HZ07QRWY-JIBT-XRMQ-ZP95-J0RWP3DYRACW",
                                     "client_key": "CLIENT-CNTP6NYE-CU9N-DUZW-CSPI-SH1IS4DOVHB9"
                                     },
                                     headers: {
                                     "Content-Type": "application/json"
                                     }
                                     };
                                     var url_api = config.environment.weburl + '/quote/premium_summary';
                                     //execute_post(url_api, args);
                                     var Client = require('node-rest-client').Client;
                                     var client = new Client();
                                     client.post(url_api, args, function (data, response) {
                                     
                                     objUD['Vehicle_Name'] = data['Master']['Vehicle']['Description'];
                                     objUD['RTO'] = data['Master']['Rto']['RTO_City'];
                                     });
                                     sleep(500);
                                     }*/
                                    if (Type !== 'SEARCH') {
                                        var Application_Date = '';
                                        objUD['Insurer'] = user['Insurer_Id'];
                                        for (var k in user.Status_History) {
                                            if (user.Status_History[k]['Status'] === 'PROPOSAL_LINK_SENT') {
                                                var dt = (new Date(user.Status_History[k]['StatusOn'])).toLocaleString();
                                                dt = dt.split(',');
                                                Application_Date = dt[0];
                                                Application_Date = moment(Quote_Date, 'DD/MM/YYYY hh:mm:ss').format("DD/MM/YYYY");
                                                break;
                                            }
                                        }
                                        objUD['Application_Date'] = Application_Date;
                                    }

                                    if (Type === 'APPLICATION' && user.Product_Id === 2) {
                                        objUD['ARN'] = user.Service_Log_Unique_Id;
                                        objUD['SL_ID'] = user.Proposal_History[0]['Form_Data']['slid'];
                                        //objUD['ARN'] = user.Erp_Qt_Request_Core['___api_reference_number___'];;
                                        //objUD['SL_ID'] = user.Erp_Qt_Request_Core['___slid___'];;
                                    } else if (Type === 'APPLICATION' && (user.Product_Id === 1 || user.Product_Id === 10 || user.Product_Id === 12)) {
                                        for (var k in user.Premium_List['Response']) {
                                            if (user.Service_Log_Unique_Id === user.Premium_List['Response'][k]['Service_Log_Unique_Id_Core']) {
                                                objUD['ARN'] = user.Premium_List['Response'][k]['Service_Log_Unique_Id_Core'];
                                                objUD['SL_ID'] = user.Premium_List['Response'][k]['Service_Log_Id'];
                                                if (user.Premium_List['Response'][k]['Premium_Breakup']) {
                                                    objUD['Premium'] = user.Premium_List['Response'][k]['Premium_Breakup'].final_premium;
                                                    if (objUD['Sum_Insured'] === 0) {
                                                        objUD['Sum_Insured'] = user.Premium_List['Response'][k]['LM_Custom_Request'].vehicle_expected_idv;
                                                    }
                                                } else if (user.hasOwnProperty('Proposal_Request_Core') && user.Proposal_Request_Core && (user.Service_Log_Unique_Id === user.Proposal_Request_Core.api_reference_number)) {
                                                    objUD['Premium'] = Math.round(user.Proposal_Request_Core.final_premium);
                                                }
                                            }
                                        }
                                        if (objUD['Premium'] === 0) {
                                            if (user.hasOwnProperty('Proposal_Request_Core') && user.Proposal_Request_Core && (user.Service_Log_Unique_Id === user.Proposal_Request_Core.api_reference_number)) {
                                                objUD['Premium'] = Math.round(user.Proposal_Request_Core.final_premium);
                                            }
                                        }
                                    } else if (Type === 'APPLICATION' && user.Product_Id === 5) {
                                        for (var k in user.Premium_List['Response']) {
                                            objUD['Insurer'] = user.Premium_List['Response'][k]['Insurer'];

                                        }
                                    }
                                    if (Type === 'PENDING_PAYMENT' && (user.Product_Id === 1 || user.Product_Id === 10 || user.Product_Id === 12)) {
                                        for (var k in user.Premium_List['Response']) {
                                            if (user.Service_Log_Unique_Id === user.Premium_List['Response'][k]['Service_Log_Unique_Id_Core']) {
                                                if (user.Premium_List['Response'][k]['Premium_Breakup']) {
                                                    objUD['Premium'] = user.Premium_List['Response'][k]['Premium_Breakup'].final_premium;
                                                    if (objUD['Sum_Insured'] === 0) {
                                                        objUD['Sum_Insured'] = user.Premium_List['Response'][k]['LM_Custom_Request'].vehicle_expected_idv;
                                                    }
                                                } else if (user.hasOwnProperty('Proposal_Request_Core') && user.Proposal_Request_Core && (user.Service_Log_Unique_Id === user.Proposal_Request_Core.api_reference_number)) {
                                                    objUD['Premium'] = Math.round(user.Proposal_Request_Core.final_premium);
                                                }
                                            }
                                        }
                                        if (objUD['Premium'] === 0) {
                                            if (user.hasOwnProperty('Proposal_Request_Core') && user.Proposal_Request_Core && (user.Service_Log_Unique_Id === user.Proposal_Request_Core.api_reference_number)) {
                                                objUD['Premium'] = Math.round(user.Proposal_Request_Core.final_premium);
                                            }
                                        }
                                    }
                                    if (user.Product_Id === 2) {
                                        objUD['Premium_Request'] = user['Premium_Request'];
                                        if (user.hasOwnProperty("Preferred_Plan_Data")) {
                                            objUD['Preferred_Plan'] = user['Preferred_Plan_Data'];
                                        }
                                    }
                                    if (user.Product_Id !== 17) {
                                        if (Type === 'SELL' && Ss_Id !== 5417 && Ss_Id !== 7844 && Ss_Id !== 8048 && Ss_Id !== 8304 && Ss_Id !== 10859) {
                                            objUD['policy_url'] = user['Transaction_Data']['policy_url'];
                                        }
                                    }
                                    arr_User_Data.push(objUD);
                                } catch (e) {
                                    console.error('UDBG', e);
                                }
                            }
                            res.json(arr_User_Data);
                        } else {
                            console.error('Exception', 'QuickListDBError', err);
                            res.send(err);

                        }
                    } catch (e1) {
                        console.error('Exception', 'QuickList1', e1);
                    }
                });
            } else {
                res.json({ 'msg': 'ss_id is empty' });
            }
        } catch (e) {
            console.error('Exception', 'QuickList', e);
        }
    });

    app.get('/user_datas/proposal/exception_dashboard_summary', function (req, res) {
        try {
            let now = moment().utcOffset("+05:30").startOf('Day');

            let fromDate = null;
            let toDate = null;
            let type = req.query['type'] || 'TODAY';
            if (type === 'TODAY') {
                fromDate = moment(now).format('YYYY-MM-D');
                toDate = moment(now).format('YYYY-MM-D');
            } else if (type === 'DAILY') {
                fromDate = moment(now).subtract(2, 'day').format('YYYY-MM-D');
                toDate = moment(now).subtract(1, 'day').format('YYYY-MM-D');
            } else if (type === 'MONTHLY') {
                fromDate = moment(now).startOf('Month').format('YYYY-MM-D');
                toDate = moment(now).endOf('Month').format('YYYY-MM-D');
            } else if (type === 'CUSTOM') {
                let Req_From_Date = req.query['FromDate'] || '';
                let Req_To_Date = req.query['ToDate'] || '';
                if (Req_From_Date && Req_To_Date) {
                    fromDate = moment(Req_From_Date).utcOffset("+05:30").startOf('Day').format('YYYY-MM-D');
                    toDate = moment(Req_To_Date).utcOffset("+05:30").startOf('Day').format('YYYY-MM-D');
                }
            }

            var arrFrom = fromDate.split('-');
            var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);
            var arrTo = toDate.split('-');
            var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
            dateTo.setDate(dateTo.getDate() + 1);


            let agt_proposal = [
                {
                    "$match": {
                        "Created_On": { "$gte": dateFrom, "$lte": dateTo },
                        "Status": 'EXCEPTION',
                        'Error_Action': { '$ne': 'UI_VALIDATION' },
                        "Proposal_Request.email": { '$ne': 'policybosstesting@gmail.com' },
                        'Is_Error': 'yes'
                    }
                },
                {
                    "$group": {
                        "_id": {
                            Product_Id: "$Product_Id",
                            Insurer_Id: "$Insurer_Id",
                            Error_Code: "$Error_Code",
                            'Error_Name': "$Error_Name"
                        },
                        PB_CRN_LIST: {
                            $addToSet: "$PB_CRN"
                        }
                    }
                },
                {
                    "$project": {
                        Product_Id: "$_id.Product_Id",
                        Insurer_Id: "$_id.Insurer_Id",
                        Error_Code: "$_id.Error_Code",
                        Error_Name: "$_id.Error_Name",
                        'PB_CRN_LIST': 1,
                        "_id": 0,
                        "PB_CRN_List_Count": { $size: "$PB_CRN_LIST" }
                    }
                },
                {
                    "$sort": {
                        Product_Id: 1,
                        Insurer_Id: 1,
                        PB_CRN_List_Count: -1
                    }
                }
            ];
            let obj_proposal_summary = {
                "status": "pending",
                "err": "",
                "data": [],
                "query": agt_proposal
            };
            Proposal.aggregate(agt_proposal).exec(function (err, dbProposals) {
                try {
                    if (err) {
                        obj_proposal_summary['status'] = 'err';
                        obj_proposal_summary['err'] = err;
                    } else {
                        obj_proposal_summary['status'] = 'success';
                        let obj_total = {
                            'Product': 'ALL',
                            'Product_Id': 'ALL',
                            'Insurer': 'ALL',
                            'Insurer_Id': 'ALL',
                            'Error_Code': 'ALL',
                            'Error_Name': 'ALL',
                            'PB_CRN_List_Count': 0
                        };
                        if (dbProposals) {
                            for (let k in dbProposals) {
                                let Insurer_Id = dbProposals[k]['Insurer_Id'];
                                let Product_Id = dbProposals[k]['Product_Id'];
                                dbProposals[k]['Product'] = config.const_product[Product_Id] || 'NA';
                                dbProposals[k]['Insurer'] = config.const_insurer_short[Insurer_Id] || 'NA';
                                obj_total['PB_CRN_List_Count'] += dbProposals[k]['PB_CRN_List_Count'];
                            }
                            dbProposals.push(obj_total);
                            obj_proposal_summary['data'] = dbProposals;
                        }
                    }
                } catch (ex) {
                    obj_proposal_summary['err'] = ex.stack;
                    obj_proposal_summary['status'] = 'exception';
                }
                res.json(obj_proposal_summary);
            });
        } catch (ex) {
            res.json({ "Status": "Fail", "Msg": ex.stack });
        }
    });
    app.get('/user_datas/agent_summary/cohort_report', function (req, res) {
        try {
            let Agent_Summary = require('../models/agent_summary');
            let From_Cohort_Year_Month = req.query['From_Cohort_Year_Month'] || '';
            let To_Cohort_Year_Month = req.query['To_Cohort_Year_Month'] || '';
            let SubVertical = req.query['SubVertical'] || '';
            let Client = require('node-rest-client').Client;
            let client = new Client();
            if (SubVertical == "HEALTH & LIFE") {
                SubVertical = "HEALTH%20%26%20LIFE";
            }
            client.get(config.environment.weburl + '/posps/summary/erp_code_creation?SubVertical=' + SubVertical, function (posp_onboard_data, posp_onboard_response) {
                try {
                    if (posp_onboard_data && posp_onboard_data['data']) {
                        let obj_posp_code = {};
                        let arr_posp_code = posp_onboard_data['data'];

                        for (let i = arr_posp_code.length - 1; i > -1; i--) {
                            let t_date = arr_posp_code[i]["Posp_Year"] + "-" + ((arr_posp_code[i]["Posp_Month"] < 10) ? "0" + "" + arr_posp_code[i]["Posp_Month"] : arr_posp_code[i]["Posp_Month"]) + '-01';
                            obj_posp_code[t_date] = arr_posp_code[i]['Posp_List'];
                        }
                        var start_year = moment(From_Cohort_Year_Month, 'YYYYMMDD');
                        start_year.add(-1, 'month');
                        var to_year = moment(To_Cohort_Year_Month, 'YYYYMMDD');
                        let to_year_range = to_year.format('YYYYMM') - 0;
                        var cur_year = moment().format('YYYYMM') - 0;
                        var diff_month = to_year.diff(start_year, 'months') - 0;
                        var inc_month = diff_month;
                        var col_ind = 0;
                        let obj_summary_posp = {
                            'range': {
                                'From_Cohort_Year_Month': From_Cohort_Year_Month,
                                'To_Cohort_Year_Month': To_Cohort_Year_Month
                            },
                            'started': 0,
                            'completed': 0,
                            'data': {}
                        };
                        for (let i = 1; i <= diff_month; i++) {
                            let st_tmp = start_year.add(1, 'month');
                            let st_year_range = st_tmp.format('YYYYMM') - 0;
                            let val_1 = st_tmp.format('YYYY-MM-DD');
                            obj_summary_posp['started']++;
                            obj_summary_posp['data'][val_1] = {};
                            let agg_posp = [
                                {
                                    $match: {
                                        "Report_Year_Month": {
                                            "$gte": st_year_range,
                                            "$lte": to_year_range
                                        },
                                        "Erp_Id": {
                                            "$in": obj_posp_code[val_1]
                                        },
                                        'Nop': { "$gt": 0 }
                                    }
                                },
                                {
                                    $group: {
                                        _id: {
                                            'Report_Year_Month': "$Report_Year_Month"
                                        },
                                        'Total_Nop': { "$sum": "$Nop" },
                                        'Total_Premium': { "$sum": "$Premium" },
                                        'Total_Agent_List': { "$addToSet": "$Erp_Id" },
                                    }
                                },
                                {
                                    $project: {
                                        '_id': 0,
                                        'Report_Year_Month': "$_id.Report_Year_Month",
                                        'Total_Nop': 1,
                                        'Total_Premium': 1,
                                        'Total_Agent': {
                                            $size: "$Total_Agent_List"
                                        },
                                        'Total_Agent_List': 1
                                    }
                                },
                                {
                                    $sort: {
                                        Report_Year_Month: 1
                                    }
                                }
                            ];
                            Agent_Summary.aggregate(agg_posp).exec(function (err, dbAgent_Summaries) {
                                obj_summary_posp['completed']++;
                                obj_summary_posp['data'][val_1] = dbAgent_Summaries;
                                if (obj_summary_posp['started'] > 0 && obj_summary_posp['started'] === obj_summary_posp['completed']) {
                                    return res.json(obj_summary_posp);
                                }
                            });
                        }
                    }
                } catch (ex) {
                    return res.json({ "Status": "Fail", "Msg": ex.stack });
                }
            });

        } catch (e) {
            return res.send(e.stack);
        }

    });
    app.get('/user_datas/offline_online/cohort_report', LoadSession, function (req, res) {
        try {
            let Offline_Transaction = require('../models/offline_transaction');
            let From_Cohort_Year_Month = req.query['From_Cohort_Year_Month'] || '';
            let To_Cohort_Year_Month = req.query['To_Cohort_Year_Month'] || '';
            let SubVertical = req.query['SubVertical'] || '';
            let Client = require('node-rest-client').Client;
            let client = new Client();
            if (SubVertical == "HEALTH & LIFE") {
                SubVertical = "HEALTH%20%26%20LIFE";
            }
            let cache_key = 'offline_online_cohort_report_From_' + From_Cohort_Year_Month + '_To_' + To_Cohort_Year_Month;
            if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1) {
                cache_key += '_superadmin';
            } else {
                cache_key += '_ssid_' + req.obj_session.user.ss_id;
            }
            let cached_path = appRoot + "/cache/cohort/" + cache_key + ".log";
            if (cache_key !== '' && fs.existsSync(cached_path) === true) {
                let curr_date = moment().utcOffset("+05:30").startOf('Day').format('YYYY-MM-DD');
                let stats = fs.statSync(cached_path);
                let mtime = moment(stats.mtime).utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
                let mdate = moment(stats.mtime).utcOffset("+05:30").startOf('Day').format('YYYY-MM-DD');
                if (curr_date === mdate) {
                    var cache_content = fs.readFileSync(cached_path).toString();
                    let cache_content_json = JSON.parse(cache_content);
                    cache_content_json['cached_on_time'] = mtime;
                    cache_content_json['cached_on_date'] = mdate;
                    cache_content_json['curr_date'] = curr_date;
                    cache_content_json['cached'] = 'YES';
                    cache_content_json['report_cache_key'] = cache_key;
                    return res.json(cache_content_json);
                }
            }
            client.get(config.environment.weburl + '/posps/summary/erp_code_creation?session_id=' + req.query['session_id'] + '&SubVertical=' + SubVertical, function (posp_onboard_data, posp_onboard_response) {
                try {
                    if (posp_onboard_data && posp_onboard_data['data']) {
                        let obj_posp_code = {};
                        let arr_posp_code = posp_onboard_data['data'];

                        for (let i = arr_posp_code.length - 1; i > -1; i--) {
                            let t_date = arr_posp_code[i]["Posp_Year"] + "-" + ((arr_posp_code[i]["Posp_Month"] < 10) ? "0" + "" + arr_posp_code[i]["Posp_Month"] : arr_posp_code[i]["Posp_Month"]) + '-01';
                            obj_posp_code[t_date] = arr_posp_code[i]['Posp_List'];
                        }
                        var start_year = moment(From_Cohort_Year_Month, 'YYYYMMDD');
                        start_year.add(-1, 'month');
                        var to_year = moment(To_Cohort_Year_Month, 'YYYYMMDD');
                        let to_year_range = to_year.format('YYYYMM') - 0;
                        var cur_year = moment().format('YYYYMM') - 0;
                        var diff_month = to_year.diff(start_year, 'months') - 0;
                        var inc_month = diff_month;
                        var col_ind = 0;
                        let obj_summary_posp = {
                            'range': {
                                'From_Cohort_Year_Month': From_Cohort_Year_Month,
                                'To_Cohort_Year_Month': To_Cohort_Year_Month
                            },
                            'started': 0,
                            'completed': 0,
                            'cond': {},
                            'data': {}
                        };
                        for (let i = 1; i <= diff_month; i++) {
                            let st_tmp = start_year.add(1, 'month');
                            let st_year_range = st_tmp.format('YYYYMM') - 0;
                            let val_1 = st_tmp.format('YYYY-MM-DD');
                            obj_summary_posp['started']++;
                            obj_summary_posp['data'][val_1] = {};
                            obj_summary_posp['cond'][val_1] = {
                                "Inception_Year_Month": {
                                    "$gte": st_year_range,
                                    "$lte": to_year_range
                                },
                                "AgentID": {
                                    "$in": obj_posp_code[val_1]
                                }
                            };
                            let agg_posp = [
                                {
                                    $match: {
                                        "Inception_Year_Month": {
                                            "$gte": st_year_range,
                                            "$lte": to_year_range
                                        },
                                        "AgentID": {
                                            "$in": obj_posp_code[val_1]
                                        }
                                    }
                                },
                                {
                                    $group: {
                                        _id: {
                                            'Report_Year_Month': "$Inception_Year_Month"
                                        },
                                        'Total_Nop': { "$sum": 1 },
                                        'Total_Premium': { "$sum": "$FinalPremium" },
                                        'Total_Agent_List': { "$addToSet": "$AgentID" },
                                    }
                                },
                                {
                                    $project: {
                                        '_id': 0,
                                        'Report_Year_Month': "$_id.Report_Year_Month",
                                        'Total_Nop': 1,
                                        'Total_Premium': 1,
                                        'Total_Agent': {
                                            $size: "$Total_Agent_List"
                                        },
                                        'Total_Agent_List': 1
                                    }
                                },
                                {
                                    $sort: {
                                        Report_Year_Month: 1
                                    }
                                }
                            ];
                            Offline_Transaction.aggregate(agg_posp).exec(function (err, dbAgent_Summaries) {
                                obj_summary_posp['completed']++;
                                obj_summary_posp['data'][val_1] = dbAgent_Summaries;
                                if (obj_summary_posp['started'] > 0 && obj_summary_posp['started'] === obj_summary_posp['completed']) {
                                    if (cache_key !== '') {
                                        fs.writeFile(cached_path, JSON.stringify(obj_summary_posp), function (err) {
                                            if (err) {
                                                return console.error(err);
                                            }
                                        });
                                    }
                                    return res.json(obj_summary_posp);
                                }
                            });
                        }
                    }
                } catch (ex) {
                    return res.json({ "Status": "Fail", "Msg": ex.stack });
                }
            });

        } catch (e) {
            return res.send(e.stack);
        }

    });
    app.get('/user_datas/offline_online/cohort_report_pos_details', LoadSession, function (req, res) {
        try {
            let Offline_Transaction = require('../models/offline_transaction');
            let Selected_Month_Slab = req.query['Selected_Month_Slab'] || '';
            let From_Cohort_Year_Month = req.query['From_Cohort_Year_Month'] || '';
            let To_Cohort_Year_Month = req.query['To_Cohort_Year_Month'] || '';
            let SubVertical = req.query['SubVertical'] || '';
            let Client = require('node-rest-client').Client;
            let client = new Client();
            if (SubVertical == "HEALTH & LIFE") {
                SubVertical = "HEALTH%20%26%20LIFE";
            }
            let cache_key = 'offline_online_cohort_report_pos_details_From_' + From_Cohort_Year_Month + '_To_' + To_Cohort_Year_Month + "_Selected_" + Selected_Month_Slab;
            if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1) {
                cache_key += '_superadmin';
            } else {
                cache_key += '_ssid_' + req.obj_session.user.ss_id;
            }
            let cached_path = appRoot + "/cache/cohort/" + cache_key + ".log";
            if (cache_key !== '' && fs.existsSync(cached_path) === true) {
                let curr_date = moment().utcOffset("+05:30").startOf('Day').format('YYYY-MM-DD');
                let stats = fs.statSync(cached_path);
                let mtime = moment(stats.mtime).utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
                let mdate = moment(stats.mtime).utcOffset("+05:30").startOf('Day').format('YYYY-MM-DD');
                if (curr_date === mdate) {
                    var cache_content = fs.readFileSync(cached_path).toString();
                    let cache_content_json = JSON.parse(cache_content);
                    cache_content_json['cached_on_time'] = mtime;
                    cache_content_json['cached_on_date'] = mdate;
                    cache_content_json['curr_date'] = curr_date;
                    cache_content_json['cached'] = 'YES';
                    cache_content_json['report_cache_key'] = cache_key;
                    return res.json(cache_content_json);
                }
            }
            client.get(config.environment.weburl + '/posps/summary/erp_code_creation?session_id=' + req.query['session_id'] + '&SubVertical=' + SubVertical, function (posp_onboard_data, posp_onboard_response) {
                try {
                    if (posp_onboard_data && posp_onboard_data['data']) {
                        let obj_posp_code = {};
                        let arr_posp_code = posp_onboard_data['data'];

                        for (let i = arr_posp_code.length - 1; i > -1; i--) {
                            let t_date = arr_posp_code[i]["Posp_Year"] + "-" + ((arr_posp_code[i]["Posp_Month"] < 10) ? "0" + "" + arr_posp_code[i]["Posp_Month"] : arr_posp_code[i]["Posp_Month"]) + '-01';
                            obj_posp_code[t_date] = arr_posp_code[i];
                        }

                        var Pos_Condition = {
                            "Erp_Id": {
                                "$in": obj_posp_code[Selected_Month_Slab]["Posp_List"].map(String)
                            }
                        };

                        let ud_agg_cond = [
                            {
                                $match: {
                                    "Is_Last": "yes",
                                    //"Premium_Request.ss_id" : {$in: obj_posp_code[Selected_Month_Slab]["Posp_List_Ss_Id"] }
                                    "Premium_Request.ss_id": 7582
                                }
                            },
                            {
                                $group: {
                                    _id: {
                                        "Ss_Id": "$Premium_Request.ss_id",
                                        //"Erp_Id" : "$Premium_Request.posp_erp_id"
                                    },
                                    "Last_Search_On": { $last: "$Created_On" }
                                }
                            },
                            {
                                $project: {
                                    _id: 0,
                                    Ss_Id: "$_id.Ss_Id",
                                    //Erp_Id : "$_id.Erp_Id",
                                    Last_Search_On: 1
                                }
                            },
                            {
                                $sort: {
                                    Last_Search_On: -1
                                }
                            }
                        ];
                        User_Data.aggregate(ud_agg_cond).exec(function (err, dbUser_Data) {
                            let obj_pos_online = {};
                            for (let d of dbUser_Data) {
                                obj_pos_online[d["Ss_Id"]] = d;
                            }

                            let Posp = require('../models/posp');
                            let obj_posp_list = {};
                            Posps.find(Pos_Condition).exec(function (err, dbPosps) {
                                try {
                                    if (dbPosps) {
                                        for (let single_posp of dbPosps) {
                                            single_posp = single_posp._doc;
                                            let Erp_Id = single_posp["Erp_Id"] - 0;
                                            let Ss_Id = single_posp["Ss_Id"] - 0;
                                            if (Erp_Id > 0) {
                                                let Last_Search_On = 'NA';
                                                if (Ss_Id > 0 && obj_pos_online.hasOwnProperty(Ss_Id) && obj_pos_online[Ss_Id]["Last_Search_On"]) {
                                                    Last_Search_On = moment(obj_pos_online[Ss_Id]["Last_Search_On"]).utcOffset("+05:30").format("YYYY-MM-DD");
                                                }
                                                obj_posp_list[Erp_Id] = {
                                                    "AgentID": Erp_Id,
                                                    "Name": single_posp["First_Name"] + " " + single_posp["Last_Name"] + " (ERP-" + Erp_Id + ")",
                                                    "Mobile": single_posp["Mobile_No"],
                                                    "Email": single_posp["Email_Id"],
                                                    "Vertical": single_posp["SubVertical"],
                                                    "Channel": single_posp["Channel"],
                                                    "Last_Search_On": Last_Search_On,
                                                    "Last_Sale_On": single_posp["Last_Sale_On"] || "NA",
                                                    "City": single_posp["Agent_City"],
                                                    "Reporting": single_posp["Reporting_Agent_Name"] + " (UID-" + single_posp["Reporting_Agent_Uid"] + ")",
                                                    "Reporting_One": single_posp["Reporting_One"],
                                                    "Reporting_Two": single_posp["Reporting_Two"]
                                                };
                                            }
                                        }
                                    }

                                    var start_year = moment(From_Cohort_Year_Month, 'YYYYMMDD');
                                    start_year.add(-1, 'month');
                                    var to_year = moment(To_Cohort_Year_Month, 'YYYYMMDD');
                                    let to_year_range = to_year.format('YYYYMM') - 0;
                                    var cur_year = moment().format('YYYYMM') - 0;
                                    var diff_month = to_year.diff(start_year, 'months') - 0;
                                    var inc_month = diff_month;
                                    var col_ind = 0;
                                    let obj_summary_posp = {
                                        'range': {
                                            'Selected_Month_Slab': Selected_Month_Slab,
                                            'From_Cohort_Year_Month': From_Cohort_Year_Month,
                                            'To_Cohort_Year_Month': To_Cohort_Year_Month
                                        },
                                        'started': 0,
                                        'completed': 0,
                                        'cond': {},
                                        'data': {}
                                    };
                                    for (let i = 1; i < 2; i++) {
                                        let st_tmp = start_year.add(1, 'month');
                                        let st_year_range = st_tmp.format('YYYYMM') - 0;
                                        let val_1 = st_tmp.format('YYYY-MM-DD');
                                        obj_summary_posp['started']++;
                                        obj_summary_posp['data'][Selected_Month_Slab] = {};
                                        obj_summary_posp['cond'][Selected_Month_Slab] = {
                                            "Inception_Year_Month": {
                                                "$gte": st_year_range,
                                                "$lte": to_year_range
                                            },
                                            "AgentID": {
                                                "$in": obj_posp_code[Selected_Month_Slab]["Posp_List"]
                                            }
                                        };
                                        let agg_posp = [
                                            {
                                                $match: {
                                                    "Inception_Year_Month": {
                                                        "$gte": st_year_range,
                                                        "$lte": to_year_range
                                                    },
                                                    "AgentID": {
                                                        "$in": obj_posp_code[Selected_Month_Slab]["Posp_List"]
                                                    }
                                                }
                                            },
                                            {
                                                $group: {
                                                    _id: {
                                                        'Report_Year_Month': "$Inception_Year_Month",
                                                        'AgentID': "$AgentID"
                                                    },
                                                    'Total_Nop': { "$sum": 1 },
                                                    'Total_Premium': { "$sum": "$FinalPremium" }
                                                }
                                            },
                                            {
                                                $project: {
                                                    '_id': 0,
                                                    'Report_Year_Month': "$_id.Report_Year_Month",
                                                    'AgentID': "$_id.AgentID",
                                                    'Total_Nop': 1,
                                                    'Total_Premium': 1
                                                }
                                            },
                                            {
                                                $sort: {
                                                    AgentID: 1,
                                                    Report_Year_Month: 1
                                                }
                                            }
                                        ];
                                        Offline_Transaction.aggregate(agg_posp).exec(function (err, dbAgent_Summaries) {
                                            try {
                                                obj_summary_posp['completed']++;
                                                obj_summary_posp['data'][Selected_Month_Slab] = dbAgent_Summaries;
                                                if (obj_summary_posp['started'] > 0 && obj_summary_posp['started'] === obj_summary_posp['completed']) {
                                                    let arr_active_posp = [];
                                                    for (let i in obj_summary_posp['data'][Selected_Month_Slab]) {
                                                        let Erp_Id = obj_summary_posp['data'][Selected_Month_Slab][i]["AgentID"];
                                                        arr_active_posp.push(Erp_Id);
                                                        if (obj_posp_list.hasOwnProperty(Erp_Id)) {
                                                            obj_summary_posp['data'][Selected_Month_Slab][i] = Object.assign(obj_summary_posp['data'][Selected_Month_Slab][i], obj_posp_list[Erp_Id]);
                                                        }
                                                    }
                                                    for (let Erp_Id_All in obj_posp_list) {
                                                        if (arr_active_posp.indexOf(Erp_Id_All) === -1) {
                                                            obj_summary_posp['data'][Selected_Month_Slab].push(obj_posp_list[Erp_Id_All]);
                                                        }
                                                    }

                                                    if (cache_key !== '') {
                                                        fs.writeFile(cached_path, JSON.stringify(obj_summary_posp), function (err) {
                                                            if (err) {
                                                                return console.error(err);
                                                            }
                                                        });
                                                    }
                                                    return res.json(obj_summary_posp);
                                                }
                                            } catch (e) {
                                                res.send(e.stack);
                                            }
                                        });
                                    }
                                } catch (e) {
                                    res.send(e.stack);
                                }
                            });
                        });
                    }
                } catch (ex) {
                    return res.json({ "Status": "Fail", "Msg": ex.stack });
                }
            });

        } catch (e) {
            return res.send(e.stack);
        }

    });
    app.get('/user_datas/offline_online/top_performer', LoadSession, function (req, res) {
        try {
            let Offline_Transaction = require('../models/offline_transaction');
            let Selected_Month_Slab = req.query['Selected_Month_Slab'] || '';
            let From_Cohort_Year_Month = req.query['From_Cohort_Year_Month'] || '';
            let To_Cohort_Year_Month = req.query['To_Cohort_Year_Month'] || '';
            let SubVertical = req.query['SubVertical'] || '';

            if (SubVertical == "HEALTH & LIFE") {
                SubVertical = "HEALTH%20%26%20LIFE";
            }
            let cache_key = 'offline_online_top_performer_From_' + From_Cohort_Year_Month + '_To_' + To_Cohort_Year_Month;
            if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1) {
                cache_key += '_superadmin';
            } else {
                cache_key += '_ssid_' + req.obj_session.user.ss_id;
            }
            let cached_path = appRoot + "/cache/cohort/" + cache_key + ".log";
            if (cache_key !== '' && fs.existsSync(cached_path) === true) {
                let curr_date = moment().utcOffset("+05:30").startOf('Day').format('YYYY-MM-DD');
                let stats = fs.statSync(cached_path);
                let mtime = moment(stats.mtime).utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
                let mdate = moment(stats.mtime).utcOffset("+05:30").startOf('Day').format('YYYY-MM-DD');
                if (curr_date === mdate) {
                    var cache_content = fs.readFileSync(cached_path).toString();
                    let cache_content_json = JSON.parse(cache_content);
                    cache_content_json['cached_on_time'] = mtime;
                    cache_content_json['cached_on_date'] = mdate;
                    cache_content_json['curr_date'] = curr_date;
                    cache_content_json['cached'] = 'YES';
                    cache_content_json['report_cache_key'] = cache_key;
                    return res.json(cache_content_json);
                }
            }


            let obj_posp_code = {};

            var start_year = moment(From_Cohort_Year_Month, 'YYYYMMDD');
            let st_year_range = start_year.format('YYYYMM') - 0;
            var to_year = moment(To_Cohort_Year_Month, 'YYYYMMDD');
            let to_year_range = to_year.format('YYYYMM') - 0;
            var cur_year = moment().format('YYYYMM') - 0;
            var diff_month = to_year.diff(start_year, 'months') - 0;
            var inc_month = diff_month;
            var col_ind = 0;
            let obj_summary_posp = {
                'range': {
                    'From_Cohort_Year_Month': From_Cohort_Year_Month,
                    'To_Cohort_Year_Month': To_Cohort_Year_Month
                },
                'started': 0,
                'completed': 0,
                'cond': {},
                'data': {},
                'summary': {
                    'Total_Nop': 0,
                    'Total_Premium': 0,
                }
            };

            obj_summary_posp['cond'] = {
                "AgentID": { "$gt": 600000, "$lt": 700000 },
                "Inception_Year_Month": {
                    "$gte": st_year_range,
                    "$lte": to_year_range
                }
            };
            let agg_posp = [
                {
                    $match: {
                        "AgentID": { "$gt": 600000, "$lt": 700000 },
                        "Inception_Year_Month": {
                            "$gte": st_year_range,
                            "$lte": to_year_range
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            'Report_Year_Month': "$Inception_Year_Month",
                            'AgentID': "$AgentID"
                        },
                        'Total_Nop': { "$sum": 1 },
                        'Total_Premium': { "$sum": "$FinalPremium" }
                    }
                },
                {
                    $project: {
                        '_id': 0,
                        'Report_Year_Month': "$_id.Report_Year_Month",
                        'AgentID': "$_id.AgentID",
                        'Total_Nop': 1,
                        'Total_Premium': 1
                    }
                },
                {
                    $sort: {
                        AgentID: 1,
                        Report_Year_Month: 1
                    }
                }
            ];
            Offline_Transaction.aggregate(agg_posp).exec(function (err, dbAgent_Summaries) {
                try {
                    if (dbAgent_Summaries) {
                        let arr_erp_id = [];
                        let obj_offline_list = {};
                        obj_summary_posp['data'] = dbAgent_Summaries;
                        for (let i in dbAgent_Summaries) {
                            let Erp_Id = dbAgent_Summaries[i]["AgentID"];
                            obj_offline_list[Erp_Id] = dbAgent_Summaries[i];
                            arr_erp_id.push(Erp_Id);
                        }
                        var Pos_Condition = {
                            "Erp_Id": {
                                "$in": arr_erp_id.map(String)
                            }
                        };
                        let Posp = require('../models/posp');
                        let obj_posp_list = {};
                        Posps.find(Pos_Condition).exec(function (err, dbPosps) {
                            try {
                                if (dbPosps) {
                                    for (let single_posp of dbPosps) {
                                        single_posp = single_posp._doc;
                                        let Erp_Id = single_posp["Erp_Id"] - 0;
                                        let Ss_Id = single_posp["Ss_Id"] - 0;
                                        if (Erp_Id > 0) {
                                            let Last_Search_On = 'NA';
                                            if (Ss_Id > 0 && single_posp.hasOwnProperty(Ss_Id) && single_posp[Ss_Id]["Last_Search_On"]) {
                                                Last_Search_On = moment(single_posp[Ss_Id]["Last_Search_On"]).utcOffset("+05:30").format("YYYY-MM-DD");
                                            }
                                            obj_posp_list[Erp_Id] = {
                                                "AgentID": Erp_Id,
                                                "Name": single_posp["First_Name"] + " " + single_posp["Last_Name"] + " (ERP-" + Erp_Id + ")",
                                                "Mobile": single_posp["Mobile_No"],
                                                "Email": single_posp["Email_Id"],
                                                "Vertical": single_posp["SubVertical"],
                                                "Channel": single_posp["Channel"],
                                                "Last_Search_On": Last_Search_On,
                                                "Last_Sale_On": single_posp["Last_Sale_On"] || "NA",
                                                "City": single_posp["Agent_City"],
                                                "Reporting": single_posp["Reporting_Agent_Name"] + " (UID-" + single_posp["Reporting_Agent_Uid"] + ")",
                                                "Reporting_One": single_posp["Reporting_One"],
                                                "Reporting_Two": single_posp["Reporting_Two"]
                                            };
                                        }
                                    }
                                    let Const_Performer_Data = {};
                                    let selected_month_data = obj_summary_posp['data'];
                                    let summary_total = {
                                        "Total_Nop": 0,
                                        "Total_Premium": 0,
                                        "Total_Agent": 0
                                    };
                                    for (let k in selected_month_data) {
                                        let AgentID = selected_month_data[k]["AgentID"] - 0;
                                        let Erp_Id = AgentID - 0;
                                        let Report_Year_Month = selected_month_data[k]["Report_Year_Month"] || "NA";
                                        if (Const_Performer_Data.hasOwnProperty(AgentID) === false) {
                                            let obj_performance_single = {
                                                "Active_Month": 0,
                                                "Performer_Rank": 0,
                                                "Performer_Slab": "OTHER",
                                                "Status": "ACTIVE",
                                                "Total_Nop": 0,
                                                "Total_Premium": 0
                                            };

                                            Const_Performer_Data[AgentID] = {
                                                "Active_Month": 0,
                                                "Performer_Rank": 0,
                                                "Performer_Slab": "OTHER",
                                                "Status": "ACTIVE",
                                                "Total_Nop": 0,
                                                "Total_Premium": 0
                                            };
                                            if (obj_posp_list.hasOwnProperty(Erp_Id) === true) {
                                                Const_Performer_Data[AgentID] = Object.assign(Const_Performer_Data[AgentID], obj_posp_list[Erp_Id]);
                                            }
                                            if (Const_Performer_Data[AgentID]["Last_Sale_On"] && Const_Performer_Data[AgentID]["Last_Sale_On"] !== "NA") {
                                                Const_Performer_Data[AgentID]["Last_Sale_On"] = moment(Const_Performer_Data[AgentID]["Last_Sale_On"]).format("YYYY-MM");
                                            }
                                        }

                                        if (Const_Performer_Data[AgentID].hasOwnProperty(Report_Year_Month + "_Nop") === false) {
                                            Const_Performer_Data[AgentID][Report_Year_Month + "_Nop"] = 0;
                                            Const_Performer_Data[AgentID][Report_Year_Month + "_Premium"] = 0;
                                            Const_Performer_Data[AgentID]["Active_Month"]++;
                                        }

                                        Const_Performer_Data[AgentID][Report_Year_Month + "_Nop"] += selected_month_data[k]["Total_Nop"];
                                        Const_Performer_Data[AgentID][Report_Year_Month + "_Premium"] += selected_month_data[k]["Total_Premium"];

                                        Const_Performer_Data[AgentID]["Total_Nop"] += selected_month_data[k]["Total_Nop"];
                                        Const_Performer_Data[AgentID]["Total_Premium"] += selected_month_data[k]["Total_Premium"];

                                        summary_total["Total_Nop"] += selected_month_data[k]["Total_Nop"];
                                        summary_total["Total_Premium"] += selected_month_data[k]["Total_Premium"];
                                    }
                                    let arr_Const_Performer_Data = _.sortBy(Object.values(Const_Performer_Data), "Total_Premium").reverse();
                                    for (let Inc_Single_Agent in arr_Const_Performer_Data) {
                                        arr_Const_Performer_Data[Inc_Single_Agent]["Performer_Rank"] = Inc_Single_Agent - 0 + 1;
                                        if (0 <= Inc_Single_Agent && Inc_Single_Agent < 100) {
                                            arr_Const_Performer_Data[Inc_Single_Agent]["Performer_Slab"] = "TOP_100";
                                        } else if (100 <= Inc_Single_Agent && Inc_Single_Agent < 500) {
                                            arr_Const_Performer_Data[Inc_Single_Agent]["Performer_Slab"] = "TOP_100_TO_500";
                                        } else if (500 <= Inc_Single_Agent && Inc_Single_Agent < 1000) {
                                            arr_Const_Performer_Data[Inc_Single_Agent]["Performer_Slab"] = "TOP_500_TO_1000";
                                        } else {
                                            arr_Const_Performer_Data[Inc_Single_Agent]["Performer_Slab"] = "OTHER";
                                        }
                                    }
                                    summary_total["Total_Agent"] = arr_Const_Performer_Data.length;
                                    Const_arr_Top_Performer = arr_Const_Performer_Data.slice(0, 1000);
                                    obj_summary_posp["data"] = Const_arr_Top_Performer;
                                    obj_summary_posp["summary"] = summary_total;
                                    if (cache_key !== '') {
                                        fs.writeFile(cached_path, JSON.stringify(obj_summary_posp), function (err) {
                                            if (err) {
                                                return console.error(err);
                                            }
                                        });
                                    }
                                }
                                return res.json(obj_summary_posp);
                            } catch (e) {
                                res.send(e.stack);
                            }
                        });
                    }

                } catch (e) {
                    res.send(e.stack);
                }
            });

        } catch (e) {
            return res.send(e.stack);
        }

    });

    app.get('/userdatas_without_pagination', LoadSession, function (req, res) {
        try {
            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                try {
                    if (err)
                        throw err;
                    var user_datas = db.collection('user_datas');
                    var objRequestCore = {};
                    if (req.query && req.query !== {}) {
                        for (let k in req.query) {
                            objRequestCore[k] = req.query[k];
                        }
                    }
                    var objProduct_Display = {
                        '1': 'CAR',
                        '2': 'HEALTH',
                        '3': 'TERM',
                        '10': 'TW',
                        '12': 'CV',
                        '17': 'CORONACARE',
                        '4': 'TRAVEL',
                        '18': 'CYBER',
                        '8': 'PA',
                        '13': 'SME-MARINE',
                        '19': 'SME-WORKMAN',
                        '20': 'SME-GROUPHEALTH',
                        '21': 'SME-PROPERTY',
                        '22': 'SME-INDEMINITY-CA',
                        '23': 'SME-INDEMINITY-DOCTORS'
                    };
                    var ObjStatus = {
                        'SEARCH': 'SEARCH',
                        'ADDON_QUOTE': 'ADDON_QUOTE_APPLY',
                        'ADDON_AGENT': 'ADDON_PROPOSAL_AGENT_APPLY',
                        'ADDON_CUSTOMER': 'ADDON_PROPOSAL_CUSTOMER_APPLY',
                        'BUY_AGENT': 'BUY_NOW_AGENT',
                        'BUY_CUST': 'BUY_NOW_CUSTOMER',
                        'SAVE_AGENT': 'PROPOSAL_SAVE_AGENT',
                        'SAVE_CUST': 'PROPOSAL_SAVE_CUSTOMER',
                        'LINK_SENT': 'PROPOSAL_LINK_SENT',
                        'PROPOSAL_SUB': 'PROPOSAL_SUBMIT',
                        'PROPOSAL_ERR': 'PROPOSAL_EXCEPTION',
                        'INSPECTION_SCHEDULED': 'INSPECTION_SCHEDULED',
                        'INSPECTION_EXCEPTION': 'INSPECTION_EXCEPTION',
                        'INSPECTION_APPROVED': 'INSPECTION_APPROVED',
                        'INSPECTION_REJECTED': 'INSPECTION_REJECTED',
                        'PG_RETURNED': 'PG_RETURNED',
                        'VERIFICATION_EXCEPTION': 'VERIFICATION_EXCEPTION',
                        'VERIFY_ERR': 'VERIFICATION_EXCEPTION',
                        'TRANS_FAIL': 'TRANS_FAIL',
                        'TRANS_WO_POLICY': 'TRANS_SUCCESS_WO_POLICY',
                        'TRANS_WITH_POLICY': 'TRANS_SUCCESS_WITH_POLICY',
                        'TRANS_MANUAL_PAYPASS': 'TRANS_MANUAL_PAYPASS',
                        'TRANS_PAYPASS': 'TRANS_PAYPASS',
                        'TRANS_WO_CS': 'TRANS_WO_CS',
                        'TRANS_WO_CS_DOC': 'TRANS_WO_CS_DOC',
                        'ALREADY_CLOSED': 'ALREADY_CLOSED'
                    };
                    let ssid = objRequestCore.ss_id;
                    var filter = {};

                    if (typeof objRequestCore['page_action'] !== 'undefined') {
                        if (req.obj_session.user.role_detail.role.indexOf('ProductAdmin') > -1) {
                            filter['Product_Id'] = { $in: req.obj_session.user.role_detail.product };
                        }
                        if (objRequestCore['page_action'] === 'all_transaction' && req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1) {

                        }
                        if (objRequestCore['page_action'] === 'ch_all_transaction') {
                            var arr_ch_ssid = [];
                            var arr_ch_list = [];
                            if (req.obj_session.hasOwnProperty('users_assigned')) {
                                arr_ch_ssid = req.obj_session.users_assigned.Team.CSE;
                            }
                            arr_ch_ssid.push(req.obj_session.user.ss_id);
                            arr_ch_list = req.obj_session.user.role_detail.channel_transaction;
                            filter['$or'] = [
                                { 'Premium_Request.channel': { $in: arr_ch_list } },
                                { 'Premium_Request.ss_id': { $in: arr_ch_ssid } }
                            ];
                            //filter['Premium_Request.channel'] = req.obj_session.user.role_detail.channel;
                        }
                        if (objRequestCore['page_action'] === 'my_transaction') {
                            var arr_ssid = [];
                            if (req.obj_session.hasOwnProperty('users_assigned')) {
                                var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
                                arr_ssid = combine_arr.split(',').filter(Number).map(Number);
                            }

                            //if ([114536, 113035, 114611, 114825, 114826, 114827, 114828, 114815, 110317].indexOf(req.obj_session.user.uid) > -1) {
                            if ([114941, 114919, 116415, 117138, 118403].indexOf(req.obj_session.user.uid) > -1) {
                                filter['Is_Last'] = 'yes';
                                filter['$or'] = [
                                    { 'Premium_Request.ss_id': req.obj_session.user.ss_id },
                                    { 'lead_assigned_ssid': req.obj_session.user.ss_id }
                                ];
                                if (arr_ssid.length > 0) {
                                    arr_ssid.push(req.obj_session.user.ss_id);
                                    filter['$or'] = [
                                        { 'Premium_Request.ss_id': { $in: arr_ssid } },
                                        { 'lead_assigned_ssid': req.obj_session.user.ss_id }
                                    ];
                                }
                            } else {
                                filter['Premium_Request.ss_id'] = req.obj_session.user.ss_id;
                                if (arr_ssid.length > 0) {
                                    arr_ssid.push(req.obj_session.user.ss_id);
                                    filter['Premium_Request.ss_id'] = { $in: arr_ssid };
                                }
                            }

                        }
                    }
                    if (objRequestCore['Col_Name'] !== '' && objRequestCore['txtCol_Val'] !== '') {
                        var arr_number_field = ['Premium_Request.posp_reporting_agent_uid', 'Premium_Request.posp_mobile_no', 'Premium_Request.posp_fba_id', 'Premium_Request.posp_erp_id', 'Premium_Request.ss_id', 'Proposal_Request.mobile'];
                        var search_val = (arr_number_field.indexOf(objRequestCore['Col_Name']) > -1) ? (objRequestCore['txtCol_Val'] - 0) : objRequestCore['txtCol_Val'];
                        filter[objRequestCore['Col_Name']] = search_val;
                    }
                    if (objRequestCore['Product_Id'] !== '') {
                        if (objRequestCore['Product_Id'] === 'HospiCash') {
                            filter['Product_Id'] = 2;
                            filter['Premium_Request.is_hospi'] = 'yes';
                        } else if (objRequestCore['Product_Id'] === 'SME_ALL') {
                            filter['Product_Id'] = { "$in": [13, 19, 20, 21, 22, 23] };
                        } else {
                            filter['Product_Id'] = objRequestCore['Product_Id'] - 0;
                        }
                    }
                    if (typeof objRequestCore['Insurer_Id'] !== 'undefined' && objRequestCore['Insurer_Id'] !== 'undefined' && objRequestCore['Insurer_Id'] !== '') {
                        filter['Insurer_Id'] = objRequestCore['Insurer_Id'] - 0;
                    }
                    if (typeof objRequestCore['Disposition_Status'] !== 'undefined' && objRequestCore['Disposition_Status'] !== 'undefined' && objRequestCore['Disposition_Status'] !== '') {
                        filter['Disposition_Status'] = objRequestCore['Disposition_Status'];
                        if (filter["Disposition_Status"] === 'PENDING') {
                            filter["Disposition_Status"] = { $exists: false };
                        }
                        if (filter["Disposition_Status"] === 'DISPOSED') {
                            filter["Disposition_Status"] = { $exists: true };
                        }
                    }
                    if (objRequestCore['Disposition_SubStatus'] && objRequestCore['Disposition_SubStatus'] !== 'undefined' && typeof objRequestCore['Disposition_SubStatus'] !== 'undefined' && objRequestCore['Disposition_SubStatus'] !== '') {
                        filter['Disposition_SubStatus'] = (objRequestCore['Disposition_SubStatus'].split(',').length == 1) ? objRequestCore['Disposition_SubStatus'] : { $in: objRequestCore['Disposition_SubStatus'].split(',') };
                    }

                    if (objRequestCore['utm_source'] && typeof objRequestCore['utm_source'] !== 'undefined' && objRequestCore['utm_source'] !== '') {
                        filter['Premium_Request.utm_source'] = objRequestCore['utm_source'];
                    }
                    if (typeof objRequestCore['expiry_identifier'] !== 'undefined' && objRequestCore['expiry_identifier'] !== '') {
                        let expiry_start = null;
                        let expiry_end = null;
                        if (objRequestCore['expiry_identifier'] === 'EXPIRED_3') {
                            expiry_start = moment().add(-3, 'days').utcOffset("+05:30").startOf('Day');
                            expiry_end = moment().add(-1, 'days').utcOffset("+05:30").endOf('Day');
                        }
                        if (objRequestCore['expiry_identifier'] === 'TODAY') {
                            expiry_start = moment().utcOffset("+05:30").startOf('Day');
                            expiry_end = moment().utcOffset("+05:30").endOf('Day');
                        }
                        if (objRequestCore['expiry_identifier'] === 'TOMORROW') {
                            expiry_start = moment().add(1, 'days').utcOffset("+05:30").startOf('Day');
                            expiry_end = moment().add(1, 'days').utcOffset("+05:30").endOf('Day');
                        }
                        if (objRequestCore['expiry_identifier'] === 'NEXT_2_7') {
                            expiry_start = moment().add(2, 'days').utcOffset("+05:30").startOf('Day');
                            expiry_end = moment().add(7, 'days').utcOffset("+05:30").endOf('Day');
                        }
                        if (objRequestCore['expiry_identifier'] === 'NEXT_8_15') {
                            expiry_start = moment().add(8, 'days').utcOffset("+05:30").startOf('Day');
                            expiry_end = moment().add(15, 'days').utcOffset("+05:30").endOf('Day');
                        }
                        if (objRequestCore['expiry_identifier'] === 'NEXT_16_30') {
                            expiry_start = moment().add(16, 'days').utcOffset("+05:30").startOf('Day');
                            expiry_end = moment().add(30, 'days').utcOffset("+05:30").endOf('Day');
                        }
                        filter['Premium_Request.policy_expiry_date'] = { '$gte': expiry_start.format("YYYY-MM-DD"), '$lte': expiry_end.format("YYYY-MM-DD") };
                    }




                    if (objRequestCore['Source'] && objRequestCore['Source'] !== 'undefined' && objRequestCore['Source'] !== '') {
                        filter['Premium_Request.channel'] = objRequestCore['Source'];
                    }
                    if (objRequestCore['Group_Status'] !== '') {
                        var ObjSummaryStatus = {
                            'SEARCH': ['SEARCH', 'ADDON_QUOTE_APPLY', 'ADDON_PROPOSAL_AGENT_APPLY', 'BUY_NOW_AGENT'],
                            'LINK_SENT': ['PROPOSAL_LINK_SENT', 'BUY_NOW_CUSTOMER', 'ADDON_PROPOSAL_CUSTOMER_APPLY', 'ADDON_QUOTE_APPLY', 'ADDON_PROPOSAL_AGENT_APPLY', 'BUY_NOW_AGENT'],
                            'PAYMENT_PENDING': ['PROPOSAL_SUBMIT', 'PROPOSAL_EXCEPTION'],
                            'POLICY_PENDING': ['VERIFICATION_EXCEPTION', 'TRANS_MANUAL_PAYPASS', 'TRANS_PAYPASS'],
                            'FAIL': ['TRANS_FAIL'],
                            'SELL': ['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY']
                        };
                        filter['Last_Status'] = {
                            $in: ObjSummaryStatus[objRequestCore['Group_Status']]
                        };
                    }
                    if (objRequestCore['App_Version'] && objRequestCore['App_Version'] !== "undefined" && objRequestCore['App_Version'] !== '') {
                        if (objRequestCore['App_Version'] === 'PolicyBoss.com') {
                            filter['Premium_Request.app_version'] = 'PolicyBoss.com';
                        }
                        if (objRequestCore['App_Version'] === 'FinPeace') {
                            filter['Premium_Request.app_version'] = 'FinPeace';
                        }
                        if (objRequestCore['App_Version'] === 'FinmartApp') {
                            filter['Premium_Request.app_version'] = { "$ne": "PolicyBoss.com" };
                        }
                    }
                    if (objRequestCore['Renewal'] === 'yes') {
                        filter['Proposal_Request_Core.renewal_crn_udid'] = { "$exists": true };
                    }
                    if (objRequestCore['Policy_Status'] === 'yes') {
                        filter['Last_Status'] = 'TRANS_SUCCESS_WITH_POLICY';
                    }
                    if (objRequestCore['Policy_Status'] === 'no') {
                        filter['Last_Status'] = 'TRANS_SUCCESS_WO_POLICY';
                    }
                    if (objRequestCore['CS_Status'] === 'yes') {
                        filter['ERP_CS'] = new RegExp('CS', 'i');
                    }
                    if (objRequestCore['CS_Status'] === 'no') {
                        filter['ERP_CS'] = { $in: ['PENDING', 'INPROGRESS', 'VALIDATION', 'EXCEPTION', 'TRYAGAIN', 'DUPLICATE'] };
                    }

                    if (objRequestCore['Col_Transaction_Status'] !== '') {
                        var cs_status = ['CS_PENDING', 'CS_INPROGRESS', 'CS_VALIDATION', 'CS_EXCEPTION', 'CS_TRYAGAIN', 'CS_DUPLICATE'];
                        if (objRequestCore['Col_Transaction_Status'] === 'TRANS_WO_CS') {
                            filter['Last_Status'] = {
                                $in: ["TRANS_SUCCESS_WO_POLICY", "TRANS_SUCCESS_WITH_POLICY"]
                            };
                            filter['ERP_CS'] = "PENDING";
                        } else if (cs_status.indexOf(objRequestCore['Col_Transaction_Status']) > -1) {
                            filter['ERP_CS'] = objRequestCore['Col_Transaction_Status'].replace('CS_', '');

                        } else if (objRequestCore['Col_Transaction_Status'] === 'TRANS_WO_CS_DOC') {
                            filter['Last_Status'] = {
                                $in: ["TRANS_SUCCESS_WO_POLICY", "TRANS_SUCCESS_WITH_POLICY"]
                            };
                            filter['ERP_CS'] = { "$nin": [null, ""] };
                            filter['ERP_CS_DOC'] = { "$nin": ['SUCCESS', 'Success'] };
                        } else {
                            filter['Last_Status'] = objRequestCore['Col_Transaction_Status'];
                        }
                    }
                    if (objRequestCore['transaction_start_date'] !== '' && objRequestCore['transaction_end_date'] !== '') {
                        var arrFrom = objRequestCore['transaction_start_date'].split('-');
                        var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);

                        var arrTo = objRequestCore['transaction_end_date'].split('-');
                        var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
                        dateTo.setDate(dateTo.getDate() + 1);
                        filter['Modified_On'] = { "$gte": dateFrom, "$lte": dateTo };
                    }

                    if (objRequestCore['PB_CRN'] !== "") {
                        filter['PB_CRN'] = objRequestCore['PB_CRN'] - 0;
                    } else if (objRequestCore['registration_number'] !== "") {
                        filter['Erp_Qt_Request_Core.___registration_no___'] = objRequestCore['registration_number'];
                    }

                    for (let k in objRequestCore) {
                        if (k.indexOf('Erp_Qt_Request_Core') > -1 && objRequestCore[k] !== '') {
                            if (k === 'Erp_Qt_Request_Core.___final_premium___') {
                                var min_fp = objRequestCore[k].split('_')[0];
                                var max_fp = objRequestCore[k].split('_')[1];
                                filter[k] = { "$gte": min_fp, "$lte": max_fp };
                            } else {
                                filter[k] = objRequestCore[k];
                            }
                        }
                    }

                    if (objRequestCore['Erp_Qt_Request_Core.___voluntary_deductible___'] === "yes") {
                        filter['Erp_Qt_Request_Core.___voluntary_deductible___'] = { '$exists': true, '$ne': '0' };
                    }

                    console.error('HorizonSaleSearch', filter, objRequestCore);
                    user_datas.find(filter).sort({ "Modified_On": -1 }).toArray(function (err, dbUserDatas) {
                        try {
                            if (err) {
                                res.send(err);
                            } else {
                                var excel = require('excel4node');
                                var workbook = new excel.Workbook();
                                var worksheet = workbook.addWorksheet('Sheet1');
                                var ff_file_name = "All_UserDatas_List.xlsx";
                                var ff_loc_path_portal = appRoot + "/tmp/user_datas_excel/" + ssid + "/" + ff_file_name;
                                if (!fs.existsSync(appRoot + "/tmp/user_datas_excel/" + ssid)) {
                                    fs.mkdirSync(appRoot + "/tmp/user_datas_excel/" + ssid);
                                }
                                if (fs.existsSync(appRoot + "/tmp/user_datas_excel/" + ssid + "/" + ff_file_name)) {
                                    fs.unlinkSync(appRoot + "/tmp/user_datas_excel/" + ssid + "/" + ff_file_name);
                                }
                                var style = workbook.createStyle({
                                    font: {
                                        color: '#FF0800',
                                        size: 12
                                    },
                                    numberFormat: '$#,##0.00; ($#,##0.00); -'
                                });
                                var styleh = workbook.createStyle({
                                    font: {
                                        bold: true,
                                        size: 12
                                    }
                                });
                                if (parseInt(dbUserDatas.length) > 0) {
                                    //row 1
                                    worksheet.cell(1, 1).string('CRN').style(styleh);
                                    worksheet.cell(1, 2).string('Vehicle_Number').style(styleh);
                                    worksheet.cell(1, 3).string('ModifiedOn').style(styleh);
                                    worksheet.cell(1, 4).string('Product').style(styleh);
                                    worksheet.cell(1, 5).string('Owner_Type').style(styleh);
                                    worksheet.cell(1, 6).string('Status').style(styleh);
                                    worksheet.cell(1, 7).string('Customer').style(styleh);
                                    worksheet.cell(1, 8).string('Mobile').style(styleh);
                                    worksheet.cell(1, 9).string('Product_Detail').style(styleh);
                                    worksheet.cell(1, 10).string('Location').style(styleh);
                                    worksheet.cell(1, 11).string('Expiry_Date').style(styleh);
                                    worksheet.cell(1, 12).string('Disposition').style(styleh);
                                    worksheet.cell(1, 13).string('SubDisposition').style(styleh);
                                    worksheet.cell(1, 14).string('Utm_Source').style(styleh);
                                    worksheet.cell(1, 15).string('User_Data_Id').style(styleh);
                                    worksheet.cell(1, 16).string('Source').style(styleh);
                                    worksheet.cell(1, 17).string('Lead_Call_Back_Time').style(styleh);
                                    worksheet.cell(1, 18).string('Lead_Caller').style(styleh);
                                    worksheet.cell(1, 19).string('Agent').style(styleh);
                                    worksheet.cell(1, 20).string('Reporting').style(styleh);
                                    worksheet.cell(1, 21).string('Ss_Id').style(styleh);
                                    worksheet.cell(1, 22).string('Fba_Id').style(styleh);
                                    worksheet.cell(1, 23).string('Rm_Uid').style(styleh);
                                    worksheet.cell(1, 24).string('Insurer_Count').style(styleh);
                                    //row 2

                                    for (var rowcount in dbUserDatas) {
                                        try {
                                            UserData = dbUserDatas[rowcount];
                                            rowcount = parseInt(rowcount);
                                            worksheet.cell(rowcount + 2, 1).string(UserData.PB_CRN ? (UserData.PB_CRN).toString() : "NA");
                                            var Vehicle_Number = "NA";
                                            Vehicle_Number = (UserData['Premium_Request'].hasOwnProperty('registration_no') && UserData['Premium_Request']['registration_no'] !== "") ? UserData['Premium_Request']['registration_no'] : "NA";
                                            worksheet.cell(rowcount + 2, 2).string(Vehicle_Number);
                                            worksheet.cell(rowcount + 2, 3).string(UserData['Modified_On'] ? moment(new Date(UserData['Modified_On'])).format('D-MMM-YY HH:mm') : 'NA');
                                            var Product_Name = "NA";
                                            Product_Name = objProduct_Display[UserData['Product_Id']] + (UserData['Premium_Request']['ui_source'] == 'UI22' ? '-UI22' : '');
                                            worksheet.cell(rowcount + 2, 4).string(Product_Name);
                                            var Owner_Type = (UserData['Premium_Request'] && UserData['Premium_Request'].hasOwnProperty('owner_type') && UserData['Premium_Request']['owner_type'] !== "") ? UserData['Premium_Request']['owner_type'] : "NA";
                                            worksheet.cell(rowcount + 2, 5).string(Owner_Type);
                                            var Last_Status = "NA";
                                            var objStatusSwap = swap(ObjStatus);
                                            if (UserData.hasOwnProperty('Last_Status') === false) {
                                                Last_Status = 'SEARCH';
                                            }
                                            Last_Status = objStatusSwap[UserData['Last_Status']];
                                            worksheet.cell(rowcount + 2, 6).string(Last_Status);
                                            var Customer = "NA";
                                            if (UserData.hasOwnProperty('Erp_Qt_Request_Core')) {
                                                Customer = UserData['Erp_Qt_Request_Core']['___first_name___'] + ' ' + UserData['Erp_Qt_Request_Core']['___last_name___'];
                                            } else if (UserData.hasOwnProperty('Proposal_Request') && UserData['Proposal_Request'].hasOwnProperty('first_name')) {
                                                Customer = UserData['Proposal_Request']['first_name'] + ' ' + UserData['Proposal_Request']['last_name'];
                                            } else if (UserData['Premium_Request'].hasOwnProperty('contact_name')) {
                                                Customer = UserData['Premium_Request']['contact_name'];
                                            } else {
                                                Customer = UserData['Premium_Request']['first_name'] + ' ' + UserData['Premium_Request']['last_name'];
                                            }
                                            Customer = capitalize(Customer);
                                            worksheet.cell(rowcount + 2, 7).string(Customer);
                                            let Mobile = UserData['Premium_Request']['mobile'] || UserData['Premium_Request']['contact_mobile'];
                                            Mobile = Mobile || "NA";
                                            worksheet.cell(rowcount + 2, 8).string(Mobile);
                                            var Product_Detail = 'NA';
                                            var Location = 'NA';
                                            if ([1, 10, 12].indexOf(UserData['Product_Id']) > -1) {
                                                var Veh = UserData['Premium_Request']['vehicle_full'].split('|');
                                                var Rto = UserData['Premium_Request']['rto_full'].split('|');
                                                Product_Detail = 'MANF-' + UserData['Premium_Request']['vehicle_manf_date'].split('-')[0] + '::' + UserData['Premium_Request']['vehicle_insurance_subtype'] + '::' + Veh[0] + '::' + Veh[1] + '::ID-' + UserData['Premium_Request']['vehicle_id'];
                                                Location = Rto[0] + '::' + Rto[2] + '::ID-' + UserData['Premium_Request']['rto_id'];
                                            } else if ([2].indexOf(UserData['Product_Id']) > -1) {
                                                Product_Detail = UserData['Premium_Request']['health_insurance_type'] + '|' + UserData['Premium_Request']['health_insurance_si'];
                                                Location = UserData['Premium_Request']['city_name'] + ',' + UserData['Premium_Request']['permanent_pincode'];
                                            } else if ([4].indexOf(UserData['Product_Id']) > -1) {
                                                Product_Detail = UserData['Premium_Request']['trip_type'] + '|' + UserData['Premium_Request']['travel_insurance_type'] + '|Member-' + UserData['Premium_Request']['member_count'];
                                                Location = UserData['Premium_Request']['travelling_to_area'];
                                            }
                                            worksheet.cell(rowcount + 2, 9).string(Product_Detail);
                                            worksheet.cell(rowcount + 2, 10).string(Location);
                                            var Expiry_Date = "NA";
                                            if (UserData['Premium_Request'].hasOwnProperty('vehicle_insurance_type') &&
                                                UserData['Premium_Request']['vehicle_insurance_type'] === 'renew') {
                                                Expiry_Date = moment(new Date(UserData['Premium_Request']['policy_expiry_date'])).format('D-MMM-YY');
                                            }
                                            worksheet.cell(rowcount + 2, 11).string(Expiry_Date);
                                            worksheet.cell(rowcount + 2, 12).string(UserData['Disposition_Status'] || 'NA');
                                            worksheet.cell(rowcount + 2, 13).string(UserData['Disposition_SubStatus'] || 'NA');
                                            var Utm_Source = UserData['Premium_Request'].hasOwnProperty('utm_source') ? UserData['Premium_Request']['utm_source'] : "NA";
                                            worksheet.cell(rowcount + 2, 14).string(Utm_Source);
                                            worksheet.cell(rowcount + 2, 15).string(UserData.User_Data_Id ? (UserData.User_Data_Id + "") : "NA");
                                            var Source = get_search_source(UserData);
                                            worksheet.cell(rowcount + 2, 16).string(Source);
                                            worksheet.cell(rowcount + 2, 17).string(UserData.hasOwnProperty('Lead_Call_Back_Time') ? UserData.Lead_Call_Back_Time : "NA");
                                            var Lead_Caller = UserData.hasOwnProperty('lead_assigned_uid') ? UserData['lead_assigned_name'] + '#' + UserData['lead_assigned_uid'] : 'NA';
                                            worksheet.cell(rowcount + 2, 18).string(Lead_Caller);
                                            var Agent = "NA";
                                            if (UserData['Client'] !== 'PB-DIRECT' && isNaN(UserData['Premium_Request']['posp_first_name'])) {
                                                Agent = capitalize(UserData['Premium_Request']['posp_first_name'] + ' ' + UserData['Premium_Request']['posp_last_name']);
                                            }
                                            worksheet.cell(rowcount + 2, 19).string(Agent);
                                            var Reporting_Agent_Name = UserData['Premium_Request']['posp_reporting_agent_name'] ? capitalize(UserData['Premium_Request']['posp_reporting_agent_name']) : "NA";
                                            worksheet.cell(rowcount + 2, 20).string(Reporting_Agent_Name);
                                            worksheet.cell(rowcount + 2, 21).string(UserData['Premium_Request']['ss_id'] ? (UserData['Premium_Request']['ss_id'] + "") : "NA");
                                            worksheet.cell(rowcount + 2, 22).string(UserData['Premium_Request']['fba_id'] ? (UserData['Premium_Request']['fba_id'] + "") : "NA");
                                            var Rm_Uid = UserData['Premium_Request']['posp_reporting_agent_uid'] ? (UserData['Premium_Request']['posp_reporting_agent_uid'] + "") : "NA";
                                            if (UserData['Premium_Request'].hasOwnProperty('posp_reporting_agent_name_core') && UserData['Premium_Request']['posp_reporting_agent_name_core'] !== '') {
                                                Rm_Uid = UserData['Premium_Request']['posp_reporting_agent_uid_core'];
                                            }
                                            worksheet.cell(rowcount + 2, 23).string(Rm_Uid);
                                            var Insurer_Count = UserData['Insurer_Success_Count'] || 'NA';
                                            worksheet.cell(rowcount + 2, 24).string(Insurer_Count + "");
                                        } catch (e) {
                                            res.json({ 'msg': 'error-' + e.message, 'data': dbUserDatas[rowcount] });
                                        }
                                    }
                                    workbook.write(ff_loc_path_portal, function (err, stats) {
                                        if (err) {
                                            console.error(err);
                                        } else {
                                            //                                res.download(ff_loc_path_portal);
                                            res.json({ "Status": "Success", "Msg": config.environment.downloadurl + "/user_datas/userdatas_excel_list/" + ssid + "/" + ff_file_name });
                                        }
                                    });
                                } else {
                                    worksheet.cell(1, 1).string('CRN').style(styleh);
                                    worksheet.cell(1, 2).string('Vehicle_Number').style(styleh);
                                    worksheet.cell(1, 3).string('ModifiedOn').style(styleh);
                                    worksheet.cell(1, 4).string('Product').style(styleh);
                                    worksheet.cell(1, 5).string('Owner_Type').style(styleh);
                                    worksheet.cell(1, 6).string('Status').style(styleh);
                                    worksheet.cell(1, 7).string('Customer').style(styleh);
                                    worksheet.cell(1, 8).string('Mobile').style(styleh);
                                    worksheet.cell(1, 9).string('Product_Detail').style(styleh);
                                    worksheet.cell(1, 10).string('Location').style(styleh);
                                    worksheet.cell(1, 11).string('Expiry_Date').style(styleh);
                                    worksheet.cell(1, 12).string('Disposition').style(styleh);
                                    worksheet.cell(1, 13).string('SubDisposition').style(styleh);
                                    worksheet.cell(1, 14).string('Utm_Source').style(styleh);
                                    worksheet.cell(1, 15).string('User_Data_Id').style(styleh);
                                    worksheet.cell(1, 16).string('Source').style(styleh);
                                    worksheet.cell(1, 17).string('Lead_Call_Back_Time').style(styleh);
                                    worksheet.cell(1, 18).string('Lead_Caller').style(styleh);
                                    worksheet.cell(1, 19).string('Agent').style(styleh);
                                    worksheet.cell(1, 20).string('Reporting').style(styleh);
                                    worksheet.cell(1, 21).string('Ss_Id').style(styleh);
                                    worksheet.cell(1, 22).string('Fba_Id').style(styleh);
                                    worksheet.cell(1, 23).string('Rm_Uid').style(styleh);
                                    worksheet.cell(1, 24).string('Insurer_Count').style(styleh);

                                    workbook.write(ff_loc_path_portal, function (err, stats) {
                                        if (err) {
                                            console.error(err);
                                        } else {
                                            //                                res.download(ff_loc_path_portal);
                                            res.json({ "Status": "Success", "Msg": config.environment.downloadurl + "/user_datas/userdatas_excel_list/" + ssid + "/" + ff_file_name });
                                        }
                                    });
                                }
                                //res.download(ff_loc_path_portal);
                            }
                            db.close();
                        } catch (e) {
                            console.error("Error - /userdatas_without_pagination", e.stack);
                            res.json({ "Status": "Fail", "Msg": e.stack });
                        }
                    });
                } catch (e) {
                    console.error("Error - /userdatas_without_pagination", e.stack);
                    res.json({ "Status": "Fail", "Msg": e.stack });
                }
            });
        } catch (e) {
            console.error("Error - /userdatas_without_pagination", e.stack);
            res.json({ "Status": "Fail", "Msg": e.stack });
        }
    });
    app.get('/user_datas/userdatas_excel_list/:ssid/:filename', function (req, res) {
        try {
            let ssid = req.params.ssid;
            let filename = req.params.filename;
            if (ssid && filename && ssid !== "" && filename !== "") {
                res.download(appRoot + '/tmp/user_datas_excel/' + ssid + '/' + filename);
            } else {
                res.json({ "Status": "Fail", "Msg": "SsId or Filename is missing" });
            }

        } catch (e) {
            console.error("Error - /download_userdatas_excel_list", e.stack);
            res.json({ "Status": "Fail", "Msg": e.stack });
        }
    });
    app.get('/get_user_data_from_reg_no', function (req, res) {
        try {
            var User_Data = require('../models/user_data');
            let objRequest = req.query;
            let registration_no = objRequest.registration_no || "";
            if (registration_no) {
                let filter = {
                    "Erp_Qt_Request_Core": { $exists: true },
                    "Erp_Qt_Request_Core.___registration_no___": registration_no
                };
                filter['Last_Status'] = {
                    $in: ["TRANS_SUCCESS_WO_POLICY", "TRANS_SUCCESS_WITH_POLICY"]
                };
                User_Data.findOne(filter, { Premium_Request: 1, Proposal_Request_Core: 1, Erp_Qt_Request_Core: 1, Addon_Request: 1, Transaction_Data: 1 }).sort({ 'Modified_On': -1 }).exec(function (user_data_err, user_data_datas) {
                    if (user_data_err) {
                        res.json({ 'Status': 'FAIL', 'Msg': "NO DATA AVAILABLE" });
                    } else if (user_data_datas) {
                        res.json({ 'Status': 'SUCCESS', 'Msg': 'DATA FETCH SUCCESSFULLY', 'Data': user_data_datas });
                    } else {
                        res.json({ 'Status': 'FAIL', 'Msg': "NO DATA AVAILABLE" });
                    }
                });
            } else {
                res.json({ 'Status': 'FAIL', 'Msg': "REGISTRATION NO MANDATORY" });
            }
        } catch (e) {
            res.json({ 'Status': 'FAIL', 'Msg': e.stack });
        }
    });
    //    app.get('/sales_list_excel_download', function (req, res) {
    //        try {
    //            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
    //                try {
    //                    if (err)
    //                        throw err;
    //                    var user_data = db.collection('user_datas');
    //                    // var objRequestCore = {};
    //                    // if (req.query && req.query !== {}) {
    //                    //     for (let k in req.query) {
    //                    //         objRequestCore[k] = req.query[k];
    //                    //     }
    //                    // }
    //                    let ssid=req.query.ss_id || 0;
    //                    let date = req.query.date || '';
    //                    let dateFrom = date ? moment(date).utcOffset("+05:30").startOf('Day').toDate() : moment().utcOffset("+05:30").startOf('Day').toDate();
    //                    let dateTo = moment().utcOffset("+05:30").endOf('Day').toDate();
    //                    var final = {
    //                        filterData: {Modified_On:{$gte: dateFrom, $lte: dateTo },Last_Status: {$in: ['TRANS_SUCCESS_WITH_POLICY', 'TRANS_SUCCESS_WO_POLICY']}},
    //                        filterQuery: {
    //                            _id: 0,
    //                            'Erp_Qt_Request_Core.___vehicle_insurance_type___': 1,
    //                            'Erp_Qt_Request_Core.___vehicle_insurance_subtype___': 1,
    //                            'Erp_Qt_Request_Core.___brokerage_amount___': 1,
    //                            'Premium_Request.fba_id': 1,
    //                            Modified_On: 1,
    //                            ERP_ENTRY: 1,
    //                            'Premium_Request.ss_id': 1,
    //                            Insurer_Id: 1,
    //                            PB_CRN: 1,
    //                            ERP_CS: 1,
    //                            'Erp_Qt_Request_Core.___pb_erp_regionname___': 1,
    //                            'Erp_Qt_Request_Core.___erp_policy_category___': 1,
    //                            'Erp_Qt_Request_Core.___erp_product_name___': 1,
    //                            'Erp_Qt_Request_Core.___posp_reporting_agent_name___': 1,
    //                            'Erp_Qt_Request_Core.___posp_reporting_agent_uid___': 1,
    //                            'Erp_Qt_Request_Core.___insurerco_name___': 1,
    //                            'Erp_Qt_Request_Core.Created_On': 1,
    //                            'Erp_Qt_Request_Core.___premium_breakup_od_final_premium___': 1,
    //                            'Erp_Qt_Request_Core.___premium_breakup_final_premium___': 1,
    //                            'Erp_Qt_Request_Core.___premium_breakup_service_tax___': 1,
    //                            'Erp_Qt_Request_Core.___policy_start_date___': 1,
    //                            'Erp_Qt_Request_Core.___vehicle_manf_date___': 1,
    //                            'Premium_Request.channel': 1,
    //                            'Premium_Request.subchannel': 1,
    //                            'Erp_Qt_Request_Core.___pb_description___': 1,
    //                            'Erp_Qt_Request_Core.___contact_name___': 1,
    //                            'Transaction_Data.policy_number': 1,
    //                            'Erp_Qt_Request_Core.___posp_first_name___': 1,
    //                            'Erp_Qt_Request_Core.___posp_last_name___': 1,
    //                            'Erp_Qt_Request_Core.___fba_id___': 1,
    //                            'Erp_Qt_Request_Core.___posp_posp_id___': 1,
    //                            Product_Id: 1
    //                        }
    //                    };
    //                    user_data.find(final.filterData
    //                        , final.filterQuery).toArray(function (err, dbUserData) {
    //                        try {
    //                            if (err) {
    //                                res.send(err);
    //                            } else {
    //                                console.log('userData',dbUserData);
    //                                 var excel = require('excel4node');
    //                                 var workbook = new excel.Workbook();
    //                                 var worksheet = workbook.addWorksheet('Sheet1');
    //                                 var ff_file_name = "User_Data_List.xlsx";
    //                                 var ff_loc_path_portal = appRoot + "/tmp/User_Data_List/" + ssid + "/" + ff_file_name;
    //                                 if (!fs.existsSync(appRoot + "/tmp/User_Data_List/" + ssid)) {
    //                                     fs.mkdirSync(appRoot + "/tmp/User_Data_List/" + ssid);
    //                                 }
    //                                 if (fs.existsSync(appRoot + "/tmp/User_Data_List/" + ssid + "/" + ff_file_name)) {
    //                                     fs.unlinkSync(appRoot + "/tmp/User_Data_List/" + ssid + "/" + ff_file_name);
    //                                 }
    //                                 var style = workbook.createStyle({
    //                                     font: {
    //                                         color: '#FF0800',
    //                                         size: 12
    //                                     },
    //                                     numberFormat: '$#,##0.00; ($#,##0.00); -'
    //                                 });
    //                                 var styleh = workbook.createStyle({
    //                                     font: {
    //                                         bold: true,
    //                                         size: 12
    //                                     }
    //                                 });
    //                                 if (parseInt(dbUserData.length) > 0) {
    //                                     //row 1
    //                                     worksheet.cell(1, 1).string('___vehicle_insurance_type___').style(styleh);
    //                                     worksheet.cell(1, 2).string('___vehicle_insurance_subtype___').style(styleh);
    //                                     worksheet.cell(1, 3).string('___brokerage_amount___').style(styleh);
    //                                     worksheet.cell(1, 4).string('fba_id').style(styleh);
    //                                     worksheet.cell(1, 5).string('Modified_On').style(styleh);
    //                                     worksheet.cell(1, 6).string('ERP_ENTRY').style(styleh);
    //                                     worksheet.cell(1, 7).string('ss_id').style(styleh);
    //                                     worksheet.cell(1, 8).string('Insurer_Id').style(styleh);
    //                                     worksheet.cell(1, 9).string('PB_CRN').style(styleh);
    //                                     worksheet.cell(1, 10).string('ERP_CS').style(styleh);
    //                                     worksheet.cell(1, 11).string('___pb_erp_regionname___').style(styleh);
    //                                     worksheet.cell(1, 12).string('___erp_policy_category___').style(styleh);
    //                                     worksheet.cell(1, 13).string('___erp_product_name___').style(styleh);
    //                                     worksheet.cell(1, 14).string('___posp_reporting_agent_name___').style(styleh);
    //                                     worksheet.cell(1, 15).string('___posp_reporting_agent_uid___').style(styleh);
    //                                     worksheet.cell(1, 16).string('___insurerco_name___').style(styleh);
    //                                     worksheet.cell(1, 17).string('Created_On').style(styleh);
    //                                     worksheet.cell(1, 18).string('___premium_breakup_od_final_premium___').style(styleh);
    //                                     worksheet.cell(1, 19).string('___premium_breakup_final_premium___').style(styleh);
    //                                     worksheet.cell(1, 20).string('___premium_breakup_service_tax___').style(styleh);
    //                                     worksheet.cell(1, 21).string('___policy_start_date___').style(styleh);
    //                                     worksheet.cell(1, 22).string('___vehicle_manf_date___').style(styleh);
    //                                     worksheet.cell(1, 23).string('subchannel').style(styleh);
    //                                     worksheet.cell(1, 24).string('___pb_description___').style(styleh);
    //                                     worksheet.cell(1, 25).string('___contact_name___').style(styleh);
    //                                     worksheet.cell(1, 26).string('policy_number').style(styleh);
    //                                     worksheet.cell(1, 27).string('___posp_first_name___').style(styleh);
    //                                     worksheet.cell(1, 28).string('___fba_id___').style(styleh);
    //                                     worksheet.cell(1, 29).string('___posp_posp_id___').style(styleh);
    //                                     worksheet.cell(1, 30).string('Product_Id').style(styleh);
    //                                     //row 2
    //
    //                                     for (var rowcount in dbUserData) {
    //                                         try {
    //                                             UserData = dbUserData[rowcount];
    //                                             rowcount = parseInt(rowcount);
    //                                             worksheet.cell(rowcount + 2, 1).string((UserData.hasOwnProperty('Erp_Qt_Request_Core') && UserData.Erp_Qt_Request_Core.___vehicle_insurance_type___) ? UserData.Erp_Qt_Request_Core.___vehicle_insurance_type___ : "NA");
    //                                             worksheet.cell(rowcount + 2, 2).string((UserData.hasOwnProperty('Erp_Qt_Request_Core') && UserData.Erp_Qt_Request_Core.___vehicle_insurance_subtype___) ? UserData.Erp_Qt_Request_Core.___vehicle_insurance_subtype___ : "NA");
    //                                             worksheet.cell(rowcount + 2, 3).string((UserData.hasOwnProperty('Erp_Qt_Request_Core') && UserData.Erp_Qt_Request_Core.___brokerage_amount___) ? (UserData.Erp_Qt_Request_Core.___brokerage_amount___).toString() : "NA");
    //                                             worksheet.cell(rowcount + 2, 4).string((UserData.hasOwnProperty('Premium_Request') && UserData.Premium_Request.fba_id) ? (UserData.Premium_Request.fba_id).toString() : "NA");
    //                                             worksheet.cell(rowcount + 2, 5).string(UserData.Modified_On ?moment(UserData.Modified_On).format('YYYY-MM-DD HH:mm:ss'): "NA");
    //                                             worksheet.cell(rowcount + 2, 6).string(UserData.ERP_ENTRY ? UserData.ERP_ENTRY : "NA");
    //                                             worksheet.cell(rowcount + 2, 7).string((UserData.hasOwnProperty('Premium_Request') && UserData.Premium_Request.ss_id) ? (UserData.Premium_Request.ss_id).toString() : "NA");
    //                                             worksheet.cell(rowcount + 2, 8).string(UserData.Insurer_Id ? (UserData.Insurer_Id).toString():"NA");
    //                                             worksheet.cell(rowcount + 2, 8).string(UserData.PB_CRN ? UserData.PB_CRN : "NA");
    //                                             worksheet.cell(rowcount + 2, 10).string(UserData.ERP_CS ? UserData.ERP_CS : "NA");
    //                                             worksheet.cell(rowcount + 2, 11).string((UserData.hasOwnProperty('Erp_Qt_Request_Core') && UserData.Erp_Qt_Request_Core.___pb_erp_regionname___) ? UserData.Erp_Qt_Request_Core.___pb_erp_regionname___ : "NA");
    //                                             worksheet.cell(rowcount + 2, 12).string((UserData.hasOwnProperty('Erp_Qt_Request_Core') && UserData.Erp_Qt_Request_Core.___erp_policy_category___) ? UserData.Erp_Qt_Request_Core.___erp_policy_category___ : "NA");
    //                                             worksheet.cell(rowcount + 2, 13).string((UserData.hasOwnProperty('Erp_Qt_Request_Core') && UserData.Erp_Qt_Request_Core.___erp_product_name___) ? UserData.Erp_Qt_Request_Core.___erp_product_name___ : "NA");
    //                                             worksheet.cell(rowcount + 2, 14).string((UserData.hasOwnProperty('Erp_Qt_Request_Core') && UserData.Erp_Qt_Request_Core.___posp_reporting_agent_name___)  ? UserData.Erp_Qt_Request_Core.___posp_reporting_agent_name___ : "NA");
    //                                             worksheet.cell(rowcount + 2, 15).string((UserData.hasOwnProperty('Erp_Qt_Request_Core') && UserData.Erp_Qt_Request_Core.___posp_reporting_agent_uid___) ? (UserData.Erp_Qt_Request_Core.___posp_reporting_agent_uid___).toString() : "NA");
    //                                             worksheet.cell(rowcount + 2, 16).string((UserData.hasOwnProperty('Erp_Qt_Request_Core') && UserData.Erp_Qt_Request_Core.___insurerco_name___) ? UserData.Erp_Qt_Request_Core.___insurerco_name___ : "NA");
    //                                             worksheet.cell(rowcount + 2, 17).string((UserData.hasOwnProperty('Erp_Qt_Request_Core') && UserData.Erp_Qt_Request_Core.Created_On) ? moment(UserData.Erp_Qt_Request_Core.Created_On).format('YYYY-MM-DD HH:mm:ss') : "NA");
    //                                             worksheet.cell(rowcount + 2, 18).string((UserData.hasOwnProperty('Erp_Qt_Request_Core') && UserData.Erp_Qt_Request_Core.___premium_breakup_od_final_premium___) ? (UserData.Erp_Qt_Request_Core.___premium_breakup_od_final_premium___).toString() : "NA");
    //                                             worksheet.cell(rowcount + 2, 19).string((UserData.hasOwnProperty('Erp_Qt_Request_Core') && UserData.Erp_Qt_Request_Core.___premium_breakup_final_premium___) ? (UserData.Erp_Qt_Request_Core.___premium_breakup_final_premium___).toString() : "NA");
    //                                             worksheet.cell(rowcount + 2, 20).string((UserData.hasOwnProperty('Erp_Qt_Request_Core') && UserData.Erp_Qt_Request_Core.___premium_breakup_service_tax___) ? (UserData.Erp_Qt_Request_Core.___premium_breakup_service_tax___).toString() : "NA");
    //                                             var policyStartDate = (UserData.hasOwnProperty('Erp_Qt_Request_Core') && UserData.Erp_Qt_Request_Core.___policy_start_date___) ? moment(UserData.Erp_Qt_Request_Core.___policy_start_date___):"NA";
    //                                             worksheet.cell(rowcount + 2, 21).string((UserData.hasOwnProperty('Erp_Qt_Request_Core') && UserData.Erp_Qt_Request_Core.___policy_start_date___) ? (policyStartDate).format('YYYY-MM-DD HH:mm:ss'): "NA");
    //                                             var vehicleManfDate = (UserData.hasOwnProperty('Erp_Qt_Request_Core') && UserData.Erp_Qt_Request_Core.___vehicle_manf_date___) ? moment(UserData.Erp_Qt_Request_Core.___vehicle_manf_date___):"NA";
    //                                             worksheet.cell(rowcount + 2, 22).string((UserData.hasOwnProperty('Erp_Qt_Request_Core') && UserData.Erp_Qt_Request_Core.___vehicle_manf_date___) ? (vehicleManfDate).format('YYYY-MM-DD HH:mm:ss') : "NA");
    //                                             worksheet.cell(rowcount + 2, 23).string((UserData.hasOwnProperty('Premium_Request') && UserData.Premium_Request.subchannel) ? UserData.Premium_Request.subchannel : "NA");
    //                                             worksheet.cell(rowcount + 2, 24).string((UserData.hasOwnProperty('Erp_Qt_Request_Core') && UserData.Erp_Qt_Request_Core.___pb_description___) ? UserData.Erp_Qt_Request_Core.___pb_description___ : "NA");
    //                                             worksheet.cell(rowcount + 2, 25).string((UserData.hasOwnProperty('Erp_Qt_Request_Core') && UserData.Erp_Qt_Request_Core.___contact_name___) ? UserData.Erp_Qt_Request_Core.___contact_name___ : "NA");
    //                                             worksheet.cell(rowcount + 2, 26).string((UserData.hasOwnProperty('Transaction_Data') && UserData.Transaction_Data.policy_number) ? UserData.Transaction_Data.policy_number : "NA");
    //                                             worksheet.cell(rowcount + 2, 27).string((UserData.hasOwnProperty('Erp_Qt_Request_Core') && UserData.Erp_Qt_Request_Core.___posp_first_name___) ? UserData.Erp_Qt_Request_Core.___posp_first_name___ : "NA");
    //                                             worksheet.cell(rowcount + 2, 28).string((UserData.hasOwnProperty('Erp_Qt_Request_Core') && UserData.Erp_Qt_Request_Core.___fba_id___) ? (UserData.Erp_Qt_Request_Core.___fba_id___).toString() : "NA");
    //                                             worksheet.cell(rowcount + 2, 29).string((UserData.hasOwnProperty('Erp_Qt_Request_Core') && UserData.Erp_Qt_Request_Core.___posp_posp_id___) ? (UserData.Erp_Qt_Request_Core.___posp_posp_id___).toString() : "NA");
    //                                             worksheet.cell(rowcount + 2, 30).string(UserData.Product_Id ? (UserData.Product_Id).toString() : "NA");
    //                                         } catch (e) {
    //                                             res.json({'msg': 'error-' + e.message, 'data': dbUserData[rowcount]});
    //                                         }
    //                                     }
    //                                    workbook.write(ff_loc_path_portal, function (err, stats) {
    //                                        if (err) {
    //                                            console.error(err);
    //                                        } else {
    ////                                res.download(ff_loc_path_portal);
    //                                            //res.json({"Status": "Success", "Msg": domain + "/posp_list/" + ssid + "/" + ff_file_name});
    //                                            res.json({"Status": "Success", "Msg": config.environment.downloadurl + "/User_Data_List/" + ssid + "/" + ff_file_name});
    //                                        }
    //                                    });
    //                                } else {
    //                                     worksheet.cell(1, 1).string('___vehicle_insurance_type___').style(styleh);
    //                                     worksheet.cell(1, 2).string('___vehicle_insurance_subtype___').style(styleh);
    //                                     worksheet.cell(1, 3).string('___brokerage_amount___').style(styleh);
    //                                     worksheet.cell(1, 4).string('fba_id').style(styleh);
    //                                     worksheet.cell(1, 5).string('Modified_On').style(styleh);
    //                                     worksheet.cell(1, 6).string('ERP_ENTRY').style(styleh);
    //                                     worksheet.cell(1, 7).string('ss_id').style(styleh);
    //                                     worksheet.cell(1, 8).string('Insurer_Id').style(styleh);
    //                                     worksheet.cell(1, 9).string('PB_CRN').style(styleh);
    //                                     worksheet.cell(1, 10).string('ERP_CS').style(styleh);
    //                                     worksheet.cell(1, 11).string('___pb_erp_regionname___').style(styleh);
    //                                     worksheet.cell(1, 12).string('___erp_policy_category___').style(styleh);
    //                                     worksheet.cell(1, 13).string('___erp_product_name___').style(styleh);
    //                                     worksheet.cell(1, 14).string('___posp_reporting_agent_name___').style(styleh);
    //                                     worksheet.cell(1, 15).string('___posp_reporting_agent_uid___').style(styleh);
    //                                     worksheet.cell(1, 16).string('___insurerco_name___').style(styleh);
    //                                     worksheet.cell(1, 17).string('Created_On').style(styleh);
    //                                     worksheet.cell(1, 18).string('___premium_breakup_od_final_premium___').style(styleh);
    //                                     worksheet.cell(1, 19).string('___premium_breakup_final_premium___').style(styleh);
    //                                     worksheet.cell(1, 20).string('___premium_breakup_service_tax___').style(styleh);
    //                                     worksheet.cell(1, 21).string('___policy_start_date___').style(styleh);
    //                                     worksheet.cell(1, 22).string('___vehicle_manf_date___').style(styleh);
    //                                     worksheet.cell(1, 23).string('subchannel').style(styleh);
    //                                     worksheet.cell(1, 24).string('___pb_description___').style(styleh);
    //                                     worksheet.cell(1, 25).string('___contact_name___').style(styleh);
    //                                     worksheet.cell(1, 26).string('policy_number').style(styleh);
    //                                     worksheet.cell(1, 27).string('___posp_first_name___').style(styleh);
    //                                     worksheet.cell(1, 28).string('___fba_id___').style(styleh);
    //                                     worksheet.cell(1, 29).string('___posp_posp_id___').style(styleh);
    //                                     worksheet.cell(1, 30).string('Product_Id').style(styleh);
    //
    //                                    workbook.write(ff_loc_path_portal, function (err, stats) {
    //                                        if (err) {
    //                                            console.error(err);
    //                                        } else {
    ////                                res.download(ff_loc_path_portal);
    //                                            //res.json({"Status": "Success", "Msg": domain + "/posp_list/" + ssid + "/" + ff_file_name});
    //                                            res.json({"Status": "Success", "Msg": config.environment.downloadurl + "/User_Data_List/" + ssid + "/" + ff_file_name});
    //                                        }
    //                                    });
    //                                }
    //                                //res.download(ff_loc_path_portal);
    //                            }
    //                            db.close();
    //                        } catch (e) {
    //                            console.error("Error - /excel", e.stack);
    //                            res.json({"Status": "Fail", "Msg": e.stack});
    //                        }
    //                    });
    //                } catch (e) {
    //                    console.error("Error - /excel", e.stack);
    //                    res.json({"Status": "Fail", "Msg": e.stack});
    //                }
    //            });
    //        } catch (e) {
    //            console.error("Error - /excel", e.stack);
    //            res.json({"Status": "Fail", "Msg": e.stack});
    //        }
    //    });

    //app.get('/user_datas/my_sales/userdatas_list_excel', function (req, res) {
    //        try {
    //            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
    //                try {
    //                    if (err)
    //                        throw err;
    //                    var user_data = db.collection('user_datas');
    //                     var objRequestCore = {};
    //                     if (req.query && req.query !== {}) {
    //                         for (let k in req.query) {
    //                             objRequestCore[k] = req.query[k];
    //                         }
    //                     }
    //                    let ssid = objRequestCore.ss_id || 0;
    //                    let startDate = objRequestCore.start_date || '';
    //                    let endDate = objRequestCore.end_date || '';
    //                    let dateFrom = startDate ? moment(startDate).utcOffset("+05:30").startOf('Day').toDate() : moment().utcOffset("+05:30").startOf('Day').toDate();
    //                    let dateTo = endDate?moment(endDate).utcOffset("+05:30").endOf('Day').toDate() : moment().utcOffset("+05:30").endOf('Day').toDate();
    //                    var queryObj = {
    //                        filterData: {
    //                            Modified_On: {
    //                                $gte: dateFrom, $lte: dateTo
    //                            },
    //                            Last_Status: {$in: ['TRANS_SUCCESS_WITH_POLICY', 'TRANS_SUCCESS_WO_POLICY']}
    //                        },
    //                        selectedFields: {
    //                            _id: 0,
    //                            'PB_CRN': 1,
    //                            'Product_Id': 1,
    //                            'Insurer_Id': 1,
    //                            'Premium_Request.ss_id': 1,
    //                            'Premium_Request.fba_id': 1,
    //                            'ERP_CS': 1,
    //                            'Modified_On': 1,
    //                            'Erp_Qt_Request_Core.___vehicle_insurance_type___': 1,
    //                            'Erp_Qt_Request_Core.___vehicle_insurance_subtype___': 1,
    //                            'Erp_Qt_Request_Core.___brokerage_amount___': 1,
    //                            'Erp_Qt_Request_Core.___pb_erp_regionname___': 1,
    //                            'Erp_Qt_Request_Core.___erp_policy_category___': 1,
    //                            'Erp_Qt_Request_Core.___erp_product_name___': 1,
    //                            'Erp_Qt_Request_Core.___posp_reporting_agent_name___': 1,
    //                            'Erp_Qt_Request_Core.___posp_reporting_agent_uid___': 1,
    //                            'Erp_Qt_Request_Core.___insurerco_name___': 1,
    //                            'Erp_Qt_Request_Core.Created_On': 1,
    //                            'Erp_Qt_Request_Core.___premium_breakup_od_final_premium___': 1,
    //                            'Erp_Qt_Request_Core.___premium_breakup_final_premium___': 1,
    //                            'Erp_Qt_Request_Core.___premium_breakup_service_tax___': 1,
    //                            'Erp_Qt_Request_Core.___policy_start_date___': 1,
    //                            'Erp_Qt_Request_Core.___vehicle_manf_date___': 1,
    //                            'Premium_Request.channel': 1,
    //                            'Premium_Request.subchannel': 1,
    //                            'Erp_Qt_Request_Core.___pb_description___': 1,
    //                            'Erp_Qt_Request_Core.___contact_name___': 1,
    //                            'Transaction_Data.policy_number': 1,
    //                            'Erp_Qt_Request_Core.___posp_first_name___': 1,
    //                            'Erp_Qt_Request_Core.___posp_last_name___': 1,
    //                            'Erp_Qt_Request_Core.___fba_id___': 1,
    //                            'Erp_Qt_Request_Core.___posp_posp_id___': 1,
    //                        }
    //                    };
    //                    user_data.find(queryObj.filterData, queryObj.selectedFields).toArray(function (dbUserErr, dbUserData) {
    //                        try {
    //                            if (dbUserErr) {
    //                                res.send(dbUserErr);
    //                            } else {
    ////                                console.log('userData', dbUserData);
    //                                var excel = require('excel4node');
    //                                var workbook = new excel.Workbook();
    //                                var worksheet = workbook.addWorksheet('Sheet1');
    //                                var ff_file_name = "User_Data_List.xlsx";
    //                                if (!fs.existsSync(appRoot + "/tmp/User_Data_list/")) {
    //                                    fs.mkdirSync(appRoot + "/tmp/User_Data_list/");
    //                                }
    //                                var ff_loc_path_portal = appRoot + "/tmp/User_Data_list/" + ssid + "/" + ff_file_name;
    //                                if (!fs.existsSync(appRoot + "/tmp/User_Data_list/" + ssid)) {
    //                                    fs.mkdirSync(appRoot + "/tmp/User_Data_list/" + ssid);
    //                                }
    //                                if (fs.existsSync(appRoot + "/tmp/User_Data_list/" + ssid + "/" + ff_file_name)) {
    //                                    fs.unlinkSync(appRoot + "/tmp/User_Data_list/" + ssid + "/" + ff_file_name);
    //                                }
    //                                var style = workbook.createStyle({
    //                                    font: {
    //                                        color: '#FF0800',
    //                                        size: 12
    //                                    },
    //                                    numberFormat: '$#,##0.00; ($#,##0.00); -'
    //                                });
    //                                var styleh = workbook.createStyle({
    //                                    font: {
    //                                        bold: true,
    //                                        size: 12
    //                                    }
    //                                });
    //                                if (parseInt(dbUserData.length) > 0) {
    //                                    //row 1
    //                                    worksheet.cell(1, 1).string('PB_CRN').style(styleh);
    //                                    worksheet.cell(1, 2).string('PRODUCT_NAME').style(styleh);
    //                                    worksheet.cell(1, 3).string('INSURER_NAME').style(styleh);
    //                                    worksheet.cell(1, 4).string('SS_ID').style(styleh);
    //                                    worksheet.cell(1, 5).string('FBA_ID').style(styleh);
    //                                    worksheet.cell(1, 6).string('ERP_CS').style(styleh);
    //                                    worksheet.cell(1, 7).string('MODIFIED_ON').style(styleh);
    //                                    worksheet.cell(1, 8).string('VEHICLE_INS_TYPE').style(styleh);
    //                                    worksheet.cell(1, 9).string('VEHICLE_INS_SUBTYPE').style(styleh);
    //                                    worksheet.cell(1, 10).string('BROKERAGE_AMOUNT').style(styleh);
    //                                    worksheet.cell(1, 11).string('PB_ERP_REGION').style(styleh);
    //                                    worksheet.cell(1, 12).string('POLICY_CATEGORY').style(styleh);
    //                                    worksheet.cell(1, 13).string('POSP_REPORTING_AGENT_NAME').style(styleh);
    //                                    worksheet.cell(1, 14).string('POSP_REPORTING_AGENT_UID').style(styleh);
    //                                    worksheet.cell(1, 15).string('CREATED_ON').style(styleh);
    //                                    worksheet.cell(1, 16).string('OD_FINAL_PREMIUM').style(styleh);
    //                                    worksheet.cell(1, 17).string('FINAL_PREMIUM').style(styleh);
    //                                    worksheet.cell(1, 18).string('SERVICE_TAX').style(styleh);
    //                                    worksheet.cell(1, 19).string('START_DATE').style(styleh);
    //                                    worksheet.cell(1, 20).string('MANF_DATE').style(styleh);
    //                                    worksheet.cell(1, 21).string('CHANNEL').style(styleh);
    //                                    worksheet.cell(1, 22).string('SUB_CHANNEL').style(styleh);
    //                                    worksheet.cell(1, 23).string('PB_DESC').style(styleh);
    //                                    worksheet.cell(1, 24).string('CONTACT_NAME').style(styleh);
    //                                    worksheet.cell(1, 25).string('POLICY_NUMBER').style(styleh);
    //                                    worksheet.cell(1, 26).string('POSP_FIRST_NAME').style(styleh);
    //                                    worksheet.cell(1, 27).string('POSP_LAST_NAME').style(styleh);
    //                                    worksheet.cell(1, 28).string('ERP_QT_FBA_ID').style(styleh);
    //                                    worksheet.cell(1, 29).string('ERP_QT_POSP_ID').style(styleh);
    //                                    //row 2
    //
    //                                    for (var rowcount in dbUserData) {
    //                                        try {
    //                                            UserData = dbUserData[rowcount];
    //                                            rowcount = parseInt(rowcount);
    //                                            
    //                                            worksheet.cell(rowcount + 2, 1).string(UserData.PB_CRN ? (UserData.PB_CRN).toString() : "NA");
    //                                            worksheet.cell(rowcount + 2, 2).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___erp_product_name___) ? UserData.Erp_Qt_Request_Core.___erp_product_name___ : "NA");
    //                                            worksheet.cell(rowcount + 2, 3).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___insurerco_name___) ? UserData.Erp_Qt_Request_Core.___insurerco_name___ : "NA");
    //                                            worksheet.cell(rowcount + 2, 4).string((UserData.Premium_Request && UserData.Premium_Request.ss_id) ? (UserData.Premium_Request.ss_id).toString() : "NA");
    //                                            worksheet.cell(rowcount + 2, 5).string((UserData.Premium_Request && UserData.Premium_Request.fba_id) ? (UserData.Premium_Request.fba_id).toString() : "NA");
    //                                            worksheet.cell(rowcount + 2, 6).string(UserData.ERP_CS ? UserData.ERP_CS : "NA");
    //                                            worksheet.cell(rowcount + 2, 7).string(UserData.Modified_On ? moment(UserData.Modified_On).format('YYYY-MM-DD HH:mm:ss') : "NA");
    //                                            worksheet.cell(rowcount + 2, 8).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___vehicle_insurance_type___) ? UserData.Erp_Qt_Request_Core.___vehicle_insurance_type___ : "NA");
    //                                            worksheet.cell(rowcount + 2, 9).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___vehicle_insurance_subtype___) ? UserData.Erp_Qt_Request_Core.___vehicle_insurance_subtype___ : "NA");
    //                                            worksheet.cell(rowcount + 2, 10).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___brokerage_amount___) ? (UserData.Erp_Qt_Request_Core.___brokerage_amount___).toString() : "NA");
    //                                            worksheet.cell(rowcount + 2, 11).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___pb_erp_regionname___) ? UserData.Erp_Qt_Request_Core.___pb_erp_regionname___ : "NA");
    //                                            worksheet.cell(rowcount + 2, 12).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___erp_policy_category___) ? UserData.Erp_Qt_Request_Core.___erp_policy_category___ : "NA");
    //                                            worksheet.cell(rowcount + 2, 13).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___posp_reporting_agent_name___) ? UserData.Erp_Qt_Request_Core.___posp_reporting_agent_name___ : "NA");
    //                                            worksheet.cell(rowcount + 2, 14).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___posp_reporting_agent_uid___) ? (UserData.Erp_Qt_Request_Core.___posp_reporting_agent_uid___).toString() : "NA");
    //                                            worksheet.cell(rowcount + 2, 15).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.Created_On) ? moment(UserData.Erp_Qt_Request_Core.Created_On).format('YYYY-MM-DD HH:mm:ss') : "NA");
    //                                            worksheet.cell(rowcount + 2, 16).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___premium_breakup_od_final_premium___) ? (UserData.Erp_Qt_Request_Core.___premium_breakup_od_final_premium___).toString() : "NA");
    //                                            worksheet.cell(rowcount + 2, 17).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___premium_breakup_final_premium___) ? (UserData.Erp_Qt_Request_Core.___premium_breakup_final_premium___).toString() : "NA");
    //                                            worksheet.cell(rowcount + 2, 18).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___premium_breakup_service_tax___) ? (UserData.Erp_Qt_Request_Core.___premium_breakup_service_tax___).toString() : "NA");
    //                                            worksheet.cell(rowcount + 2, 19).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___policy_start_date___) ? moment(UserData.Erp_Qt_Request_Core.___policy_start_date___).format('YYYY-MM-DD HH:mm:ss') : "NA");
    //                                            worksheet.cell(rowcount + 2, 20).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___vehicle_manf_date___) ? moment(UserData.Erp_Qt_Request_Core.___vehicle_manf_date___).format('YYYY-MM-DD HH:mm:ss') : "NA");
    //                                            worksheet.cell(rowcount + 2, 21).string((UserData.Premium_Request && UserData.Premium_Request.channel) ? UserData.Premium_Request.channel : "NA");
    //                                            worksheet.cell(rowcount + 2, 22).string((UserData.Premium_Request && UserData.Premium_Request.subchannel) ? UserData.Premium_Request.subchannel : "NA");
    //                                            worksheet.cell(rowcount + 2, 23).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___pb_description___) ? UserData.Erp_Qt_Request_Core.___pb_description___ : "NA");
    //                                            worksheet.cell(rowcount + 2, 24).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___contact_name___) ? UserData.Erp_Qt_Request_Core.___contact_name___ : "NA");
    //                                            worksheet.cell(rowcount + 2, 25).string((UserData.Transaction_Data && UserData.Transaction_Data.policy_number) ? UserData.Transaction_Data.policy_number : "NA");
    //                                            worksheet.cell(rowcount + 2, 26).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___posp_first_name___) ? UserData.Erp_Qt_Request_Core.___posp_first_name___ : "NA");
    //                                            worksheet.cell(rowcount + 2, 27).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___posp_last_name___) ? UserData.Erp_Qt_Request_Core.___posp_last_name___ : "NA");
    //                                            worksheet.cell(rowcount + 2, 28).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___fba_id___) ? (UserData.Erp_Qt_Request_Core.___fba_id___).toString() : "NA");
    //                                            worksheet.cell(rowcount + 2, 29).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___posp_posp_id___) ? (UserData.Erp_Qt_Request_Core.___posp_posp_id___).toString() : "NA");
    //                                            
    //                                        } catch (e) {
    //                                            res.json({'msg': 'error-' + e.message, 'data': dbUserData[rowcount]});
    //                                        }
    //                                    }
    //                                    workbook.write(ff_loc_path_portal, function (err, stats) {
    //                                        if (err) {
    //                                            console.error(err);
    //                                        } else {
    ////                                res.download(ff_loc_path_portal);
    //                                            //res.json({"Status": "Success", "Msg": domain + "/posp_list/" + ssid + "/" + ff_file_name});
    //                                            res.json({"Status": "Success", "Msg": config.environment.downloadurl + "/user_datas/user_data_list/" + ssid + "/" + ff_file_name});
    //                                        }
    //                                    });
    //                                } else {
    //                                    worksheet.cell(1, 1).string('PB_CRN').style(styleh);
    //                                    worksheet.cell(1, 2).string('PRODUCT_NAME').style(styleh);
    //                                    worksheet.cell(1, 3).string('INSURER_NAME').style(styleh);
    //                                    worksheet.cell(1, 4).string('SS_ID').style(styleh);
    //                                    worksheet.cell(1, 5).string('FBA_ID').style(styleh);
    //                                    worksheet.cell(1, 6).string('ERP_CS').style(styleh);
    //                                    worksheet.cell(1, 7).string('MODIFIED_ON').style(styleh);
    //                                    worksheet.cell(1, 8).string('VEHICLE_INS_TYPE').style(styleh);
    //                                    worksheet.cell(1, 9).string('VEHICLE_INS_SUBTYPE').style(styleh);
    //                                    worksheet.cell(1, 10).string('BROKERAGE_AMOUNT').style(styleh);
    //                                    worksheet.cell(1, 11).string('PB_ERP_REGION').style(styleh);
    //                                    worksheet.cell(1, 12).string('POLICY_CATEGORY').style(styleh);
    //                                    worksheet.cell(1, 13).string('POSP_REPORTING_AGENT_NAME').style(styleh);
    //                                    worksheet.cell(1, 14).string('POSP_REPORTING_AGENT_UID').style(styleh);
    //                                    worksheet.cell(1, 15).string('CREATED_ON').style(styleh);
    //                                    worksheet.cell(1, 16).string('OD_FINAL_PREMIUM').style(styleh);
    //                                    worksheet.cell(1, 17).string('FINAL_PREMIUM').style(styleh);
    //                                    worksheet.cell(1, 18).string('SERVICE_TAX').style(styleh);
    //                                    worksheet.cell(1, 19).string('START_DATE').style(styleh);
    //                                    worksheet.cell(1, 20).string('MANF_DATE').style(styleh);
    //                                    worksheet.cell(1, 21).string('CHANNEL').style(styleh);
    //                                    worksheet.cell(1, 22).string('SUB_CHANNEL').style(styleh);
    //                                    worksheet.cell(1, 23).string('PB_DESC').style(styleh);
    //                                    worksheet.cell(1, 24).string('CONTACT_NAME').style(styleh);
    //                                    worksheet.cell(1, 25).string('POLICY_NUMBER').style(styleh);
    //                                    worksheet.cell(1, 26).string('POSP_FIRST_NAME').style(styleh);
    //                                    worksheet.cell(1, 27).string('POSP_LAST_NAME').style(styleh);
    //                                    worksheet.cell(1, 28).string('ERP_QT_FBA_ID').style(styleh);
    //                                    worksheet.cell(1, 29).string('ERP_QT_POSP_ID').style(styleh);
    //
    //                                    workbook.write(ff_loc_path_portal, function (err, stats) {
    //                                        if (err) {
    //                                            console.error(err);
    //                                        } else {
    ////                                res.download(ff_loc_path_portal);
    //                                            //res.json({"Status": "Success", "Msg": domain + "/posp_list/" + ssid + "/" + ff_file_name});
    //                                            res.json({"Status": "Success", "Msg": config.environment.downloadurl + "/user_datas/user_data_list/" + ssid + "/" + ff_file_name});
    //                                        }
    //                                    });
    //                                }
    //                                //res.download(ff_loc_path_portal);
    //                            }
    //                            db.close();
    //                        } catch (e) {
    //                            console.error("Error - /excel", e.stack);
    //                            res.json({"Status": "Fail", "Msg": e.stack});
    //                        }
    //                    });
    //                } catch (e) {
    //                    console.error("Error - /excel", e.stack);
    //                    res.json({"Status": "Fail", "Msg": e.stack});
    //                }
    //            });
    //        } catch (e) {
    //            console.error("Error - /excel", e.stack);
    //            res.json({"Status": "Fail", "Msg": e.stack});
    //        }
    //    });

    app.get('/user_datas/my_sales/userdatas_list_excel', function (req, res) {
        try {
            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                try {
                    if (err)
                        throw err;
                    var user_data = db.collection('user_datas');
                    var objRequestCore = {};
                    if (req.query && req.query !== {}) {
                        for (let k in req.query) {
                            objRequestCore[k] = req.query[k];
                        }
                    }
                    let ssid = objRequestCore.ss_id || 0;
                    let startDate = objRequestCore.start_date || '';
                    let endDate = objRequestCore.end_date || '';
                    let dateFrom = startDate ? moment(startDate).utcOffset("+05:30").startOf('Day').toDate() : moment().utcOffset("+05:30").startOf('Day').toDate();
                    let dateTo = endDate ? moment(endDate).utcOffset("+05:30").endOf('Day').toDate() : moment().utcOffset("+05:30").endOf('Day').toDate();
                    var queryObj = {
                        filterData: {
                            Modified_On: {
                                $gte: dateFrom, $lte: dateTo
                            },
                            Last_Status: { $in: ['TRANS_SUCCESS_WITH_POLICY', 'TRANS_SUCCESS_WO_POLICY'] }
                        },
                        selectedFields: {
                            _id: 0,
                            'PB_CRN': 1,
                            'Product_Id': 1,
                            'Insurer_Id': 1,
                            'Premium_Request.ss_id': 1,
                            'Premium_Request.fba_id': 1,
                            'ERP_CS': 1,
                            'Modified_On': 1,
                            'Erp_Qt_Request_Core.___vehicle_insurance_type___': 1,
                            'Erp_Qt_Request_Core.___vehicle_insurance_subtype___': 1,
                            'Erp_Qt_Request_Core.___brokerage_amount___': 1,
                            'Erp_Qt_Request_Core.___pb_erp_regionname___': 1,
                            'Erp_Qt_Request_Core.___erp_policy_category___': 1,
                            'Erp_Qt_Request_Core.___erp_product_name___': 1,
                            'Erp_Qt_Request_Core.___posp_reporting_agent_name___': 1,
                            'Erp_Qt_Request_Core.___posp_reporting_agent_uid___': 1,
                            'Erp_Qt_Request_Core.___insurerco_name___': 1,
                            'Erp_Qt_Request_Core.Created_On': 1,
                            'Erp_Qt_Request_Core.___premium_breakup_od_final_premium___': 1,
                            'Erp_Qt_Request_Core.___premium_breakup_final_premium___': 1,
                            'Erp_Qt_Request_Core.___premium_breakup_service_tax___': 1,
                            'Erp_Qt_Request_Core.___policy_start_date___': 1,
                            'Erp_Qt_Request_Core.___vehicle_manf_date___': 1,
                            'Premium_Request.channel': 1,
                            'Premium_Request.subchannel': 1,
                            'Erp_Qt_Request_Core.___pb_description___': 1,
                            'Erp_Qt_Request_Core.___contact_name___': 1,
                            'Transaction_Data.policy_number': 1,
                            'Erp_Qt_Request_Core.___posp_first_name___': 1,
                            'Erp_Qt_Request_Core.___posp_last_name___': 1,
                            'Erp_Qt_Request_Core.___fba_id___': 1,
                            'Erp_Qt_Request_Core.___posp_posp_id___': 1,
                        }
                    };
                    user_data.find(queryObj.filterData, queryObj.selectedFields).toArray(function (dbUserErr, dbUserData) {
                        try {
                            if (dbUserErr) {
                                res.send(dbUserErr);
                            } else {
                                //                                console.log('userData', dbUserData);
                                var excel = require('excel4node');
                                var workbook = new excel.Workbook();
                                var worksheet = workbook.addWorksheet('Sheet1');
                                var ff_file_name = "User_Data_List.xlsx";
                                if (!fs.existsSync(appRoot + "/tmp/User_Data_list/")) {
                                    fs.mkdirSync(appRoot + "/tmp/User_Data_list/");
                                }
                                var ff_loc_path_portal = appRoot + "/tmp/User_Data_list/" + ssid + "/" + ff_file_name;
                                if (!fs.existsSync(appRoot + "/tmp/User_Data_list/" + ssid)) {
                                    fs.mkdirSync(appRoot + "/tmp/User_Data_list/" + ssid);
                                }
                                if (fs.existsSync(appRoot + "/tmp/User_Data_list/" + ssid + "/" + ff_file_name)) {
                                    fs.unlinkSync(appRoot + "/tmp/User_Data_list/" + ssid + "/" + ff_file_name);
                                }
                                var style = workbook.createStyle({
                                    font: {
                                        color: '#FF0800',
                                        size: 12
                                    },
                                    numberFormat: '$#,##0.00; ($#,##0.00); -'
                                });
                                var styleh = workbook.createStyle({
                                    font: {
                                        bold: true,
                                        size: 12
                                    }
                                });
                                if (parseInt(dbUserData.length) > 0) {
                                    //row 1
                                    var excelheader = ['PB_CRN', 'PRODUCT_NAME', 'INSURER_NAME', 'SS_ID',
                                        'FBA_ID', 'ERP_CS', 'MODIFIED_ON', 'VEHICLE_INS_TYPE', 'VEHICLE_INS_SUBTYPE',
                                        'BROKERAGE_AMOUNT', 'PB_ERP_REGION', 'POLICY_CATEGORY', 'POSP_REPORTING_AGENT_NAME',
                                        'POSP_REPORTING_AGENT_UID', 'CREATED_ON', 'OD_FINAL_PREMIUM', 'FINAL_PREMIUM', 'SERVICE_TAX',
                                        'START_DATE', 'MANF_DATE', 'CHANNEL', 'SUB_CHANNEL', 'PB_DESC', 'CONTACT_NAME', 'POLICY_NUMBER',
                                        'POSP_FIRST_NAME', 'POSP_LAST_NAME', 'ERP_QT_FBA_ID', 'ERP_QT_POSP_ID'];
                                    for (let i = 0; i < excelheader.length; i++) {
                                        worksheet.cell(1, i + 1).string(excelheader[i]).style(styleh);
                                    }
                                    //                                    worksheet.cell(1, 1).string('PB_CRN').style(styleh);
                                    //                                    worksheet.cell(1, 2).string('PRODUCT_NAME').style(styleh);
                                    //                                    worksheet.cell(1, 3).string('INSURER_NAME').style(styleh);
                                    //                                    worksheet.cell(1, 4).string('SS_ID').style(styleh);
                                    //                                    worksheet.cell(1, 5).string('FBA_ID').style(styleh);
                                    //                                    worksheet.cell(1, 6).string('ERP_CS').style(styleh);
                                    //                                    worksheet.cell(1, 7).string('MODIFIED_ON').style(styleh);
                                    //                                    worksheet.cell(1, 8).string('VEHICLE_INS_TYPE').style(styleh);
                                    //                                    worksheet.cell(1, 9).string('VEHICLE_INS_SUBTYPE').style(styleh);
                                    //                                    worksheet.cell(1, 10).string('BROKERAGE_AMOUNT').style(styleh);
                                    //                                    worksheet.cell(1, 11).string('PB_ERP_REGION').style(styleh);
                                    //                                    worksheet.cell(1, 12).string('POLICY_CATEGORY').style(styleh);
                                    //                                    worksheet.cell(1, 13).string('POSP_REPORTING_AGENT_NAME').style(styleh);
                                    //                                    worksheet.cell(1, 14).string('POSP_REPORTING_AGENT_UID').style(styleh);
                                    //                                    worksheet.cell(1, 15).string('CREATED_ON').style(styleh);
                                    //                                    worksheet.cell(1, 16).string('OD_FINAL_PREMIUM').style(styleh);
                                    //                                    worksheet.cell(1, 17).string('FINAL_PREMIUM').style(styleh);
                                    //                                    worksheet.cell(1, 18).string('SERVICE_TAX').style(styleh);
                                    //                                    worksheet.cell(1, 19).string('START_DATE').style(styleh);
                                    //                                    worksheet.cell(1, 20).string('MANF_DATE').style(styleh);
                                    //                                    worksheet.cell(1, 21).string('CHANNEL').style(styleh);
                                    //                                    worksheet.cell(1, 22).string('SUB_CHANNEL').style(styleh);
                                    //                                    worksheet.cell(1, 23).string('PB_DESC').style(styleh);
                                    //                                    worksheet.cell(1, 24).string('CONTACT_NAME').style(styleh);
                                    //                                    worksheet.cell(1, 25).string('POLICY_NUMBER').style(styleh);
                                    //                                    worksheet.cell(1, 26).string('POSP_FIRST_NAME').style(styleh);
                                    //                                    worksheet.cell(1, 27).string('POSP_LAST_NAME').style(styleh);
                                    //                                    worksheet.cell(1, 28).string('ERP_QT_FBA_ID').style(styleh);
                                    //                                    worksheet.cell(1, 29).string('ERP_QT_POSP_ID').style(styleh);
                                    //row 2

                                    for (var rowcount in dbUserData) {
                                        try {
                                            UserData = dbUserData[rowcount];
                                            rowcount = parseInt(rowcount);

                                            worksheet.cell(rowcount + 2, 1).string(UserData.PB_CRN ? (UserData.PB_CRN).toString() : "NA");
                                            worksheet.cell(rowcount + 2, 2).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___erp_product_name___) ? UserData.Erp_Qt_Request_Core.___erp_product_name___ : "NA");
                                            worksheet.cell(rowcount + 2, 3).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___insurerco_name___) ? UserData.Erp_Qt_Request_Core.___insurerco_name___ : "NA");
                                            worksheet.cell(rowcount + 2, 4).string((UserData.Premium_Request && UserData.Premium_Request.ss_id) ? (UserData.Premium_Request.ss_id).toString() : "NA");
                                            worksheet.cell(rowcount + 2, 5).string((UserData.Premium_Request && UserData.Premium_Request.fba_id) ? (UserData.Premium_Request.fba_id).toString() : "NA");
                                            worksheet.cell(rowcount + 2, 6).string(UserData.ERP_CS ? UserData.ERP_CS : "NA");
                                            worksheet.cell(rowcount + 2, 7).string(UserData.Modified_On ? moment(UserData.Modified_On).format('YYYY-MM-DD HH:mm:ss') : "NA");
                                            worksheet.cell(rowcount + 2, 8).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___vehicle_insurance_type___) ? UserData.Erp_Qt_Request_Core.___vehicle_insurance_type___ : "NA");
                                            worksheet.cell(rowcount + 2, 9).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___vehicle_insurance_subtype___) ? UserData.Erp_Qt_Request_Core.___vehicle_insurance_subtype___ : "NA");
                                            worksheet.cell(rowcount + 2, 10).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___brokerage_amount___) ? (UserData.Erp_Qt_Request_Core.___brokerage_amount___).toString() : "NA");
                                            worksheet.cell(rowcount + 2, 11).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___pb_erp_regionname___) ? UserData.Erp_Qt_Request_Core.___pb_erp_regionname___ : "NA");
                                            worksheet.cell(rowcount + 2, 12).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___erp_policy_category___) ? UserData.Erp_Qt_Request_Core.___erp_policy_category___ : "NA");
                                            worksheet.cell(rowcount + 2, 13).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___posp_reporting_agent_name___) ? UserData.Erp_Qt_Request_Core.___posp_reporting_agent_name___ : "NA");
                                            worksheet.cell(rowcount + 2, 14).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___posp_reporting_agent_uid___) ? (UserData.Erp_Qt_Request_Core.___posp_reporting_agent_uid___).toString() : "NA");
                                            worksheet.cell(rowcount + 2, 15).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.Created_On) ? moment(UserData.Erp_Qt_Request_Core.Created_On).format('YYYY-MM-DD HH:mm:ss') : "NA");
                                            worksheet.cell(rowcount + 2, 16).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___premium_breakup_od_final_premium___) ? (UserData.Erp_Qt_Request_Core.___premium_breakup_od_final_premium___).toString() : "NA");
                                            worksheet.cell(rowcount + 2, 17).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___premium_breakup_final_premium___) ? (UserData.Erp_Qt_Request_Core.___premium_breakup_final_premium___).toString() : "NA");
                                            worksheet.cell(rowcount + 2, 18).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___premium_breakup_service_tax___) ? (UserData.Erp_Qt_Request_Core.___premium_breakup_service_tax___).toString() : "NA");
                                            worksheet.cell(rowcount + 2, 19).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___policy_start_date___) ? moment(UserData.Erp_Qt_Request_Core.___policy_start_date___).format('YYYY-MM-DD HH:mm:ss') : "NA");
                                            worksheet.cell(rowcount + 2, 20).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___vehicle_manf_date___) ? moment(UserData.Erp_Qt_Request_Core.___vehicle_manf_date___).format('YYYY-MM-DD HH:mm:ss') : "NA");
                                            worksheet.cell(rowcount + 2, 21).string((UserData.Premium_Request && UserData.Premium_Request.channel) ? UserData.Premium_Request.channel : "NA");
                                            worksheet.cell(rowcount + 2, 22).string((UserData.Premium_Request && UserData.Premium_Request.subchannel) ? UserData.Premium_Request.subchannel : "NA");
                                            worksheet.cell(rowcount + 2, 23).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___pb_description___) ? UserData.Erp_Qt_Request_Core.___pb_description___ : "NA");
                                            worksheet.cell(rowcount + 2, 24).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___contact_name___) ? UserData.Erp_Qt_Request_Core.___contact_name___ : "NA");
                                            worksheet.cell(rowcount + 2, 25).string((UserData.Transaction_Data && UserData.Transaction_Data.policy_number) ? UserData.Transaction_Data.policy_number : "NA");
                                            worksheet.cell(rowcount + 2, 26).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___posp_first_name___) ? UserData.Erp_Qt_Request_Core.___posp_first_name___ : "NA");
                                            worksheet.cell(rowcount + 2, 27).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___posp_last_name___) ? UserData.Erp_Qt_Request_Core.___posp_last_name___ : "NA");
                                            worksheet.cell(rowcount + 2, 28).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___fba_id___) ? (UserData.Erp_Qt_Request_Core.___fba_id___).toString() : "NA");
                                            worksheet.cell(rowcount + 2, 29).string((UserData.Erp_Qt_Request_Core && UserData.Erp_Qt_Request_Core.___posp_posp_id___) ? (UserData.Erp_Qt_Request_Core.___posp_posp_id___).toString() : "NA");

                                        } catch (e) {
                                            res.json({ 'msg': 'error-' + e.message, 'data': dbUserData[rowcount] });
                                        }
                                    }
                                    workbook.write(ff_loc_path_portal, function (err, stats) {
                                        if (err) {
                                            console.error(err);
                                        } else {
                                            //                                res.download(ff_loc_path_portal);
                                            //res.json({"Status": "Success", "Msg": domain + "/posp_list/" + ssid + "/" + ff_file_name});
                                            res.json({ "Status": "Success", "Msg": config.environment.downloadurl + "/user_datas/user_data_list/" + ssid + "/" + ff_file_name });
                                        }
                                    });
                                } else {
                                    worksheet.cell(1, 1).string('PB_CRN').style(styleh);
                                    worksheet.cell(1, 2).string('PRODUCT_NAME').style(styleh);
                                    worksheet.cell(1, 3).string('INSURER_NAME').style(styleh);
                                    worksheet.cell(1, 4).string('SS_ID').style(styleh);
                                    worksheet.cell(1, 5).string('FBA_ID').style(styleh);
                                    worksheet.cell(1, 6).string('ERP_CS').style(styleh);
                                    worksheet.cell(1, 7).string('MODIFIED_ON').style(styleh);
                                    worksheet.cell(1, 8).string('VEHICLE_INS_TYPE').style(styleh);
                                    worksheet.cell(1, 9).string('VEHICLE_INS_SUBTYPE').style(styleh);
                                    worksheet.cell(1, 10).string('BROKERAGE_AMOUNT').style(styleh);
                                    worksheet.cell(1, 11).string('PB_ERP_REGION').style(styleh);
                                    worksheet.cell(1, 12).string('POLICY_CATEGORY').style(styleh);
                                    worksheet.cell(1, 13).string('POSP_REPORTING_AGENT_NAME').style(styleh);
                                    worksheet.cell(1, 14).string('POSP_REPORTING_AGENT_UID').style(styleh);
                                    worksheet.cell(1, 15).string('CREATED_ON').style(styleh);
                                    worksheet.cell(1, 16).string('OD_FINAL_PREMIUM').style(styleh);
                                    worksheet.cell(1, 17).string('FINAL_PREMIUM').style(styleh);
                                    worksheet.cell(1, 18).string('SERVICE_TAX').style(styleh);
                                    worksheet.cell(1, 19).string('START_DATE').style(styleh);
                                    worksheet.cell(1, 20).string('MANF_DATE').style(styleh);
                                    worksheet.cell(1, 21).string('CHANNEL').style(styleh);
                                    worksheet.cell(1, 22).string('SUB_CHANNEL').style(styleh);
                                    worksheet.cell(1, 23).string('PB_DESC').style(styleh);
                                    worksheet.cell(1, 24).string('CONTACT_NAME').style(styleh);
                                    worksheet.cell(1, 25).string('POLICY_NUMBER').style(styleh);
                                    worksheet.cell(1, 26).string('POSP_FIRST_NAME').style(styleh);
                                    worksheet.cell(1, 27).string('POSP_LAST_NAME').style(styleh);
                                    worksheet.cell(1, 28).string('ERP_QT_FBA_ID').style(styleh);
                                    worksheet.cell(1, 29).string('ERP_QT_POSP_ID').style(styleh);

                                    workbook.write(ff_loc_path_portal, function (err, stats) {
                                        if (err) {
                                            console.error(err);
                                        } else {
                                            //                                res.download(ff_loc_path_portal);
                                            //res.json({"Status": "Success", "Msg": domain + "/posp_list/" + ssid + "/" + ff_file_name});
                                            res.json({ "Status": "Success", "Msg": config.environment.downloadurl + "/user_datas/user_data_list/" + ssid + "/" + ff_file_name });
                                        }
                                    });
                                }
                                //res.download(ff_loc_path_portal);
                            }
                            db.close();
                        } catch (e) {
                            console.error("Error - /excel", e.stack);
                            res.json({ "Status": "Fail", "Msg": e.stack });
                        }
                    });
                } catch (e) {
                    console.error("Error - /excel", e.stack);
                    res.json({ "Status": "Fail", "Msg": e.stack });
                }
            });
        } catch (e) {
            console.error("Error - /excel", e.stack);
            res.json({ "Status": "Fail", "Msg": e.stack });
        }
    });

    app.get('/user_datas/user_data_list/:ssid/:filename', function (req, res) {
        try {
            let ssid = req.params.ssid;
            let filename = req.params.filename;
            if (ssid && filename && ssid !== "" && filename !== "") {
                res.download(appRoot + '/tmp/User_Data_list/' + ssid + '/' + filename);
            } else {
                res.json({ "Status": "Fail", "Msg": "SsId or Filename is missing" });
            }

        } catch (e) {
            console.error("Error - /user_data_list/:ssid/:filename", e.stack);
            res.json({ "Status": "Fail", "Msg": e.stack });
        }
    });

    app.post('/user_datas/userdatas_brokerage_paid', function (req, res) {
        try {
            req.body = JSON.parse(JSON.stringify(req.body));
            let objRequest = req.body;
            let objSummary = {
                "Status": "",
                "Msg": "",
                "User_Data": "",
                "Proposal_Data": ""
            };
            let cond_proposal = {
                'Proposal_Id': objRequest.proposal_id && objRequest.proposal_id - 0 || 0
            };
            Proposal.find(cond_proposal, function (dbProposals_err, dbProposals) {
                if (dbProposals && dbProposals[0].Is_Brokerage_Paid && dbProposals[0].Is_Brokerage_Paid === 1) {
                    objSummary['Status'] = "SUCCESS";
                    objSummary['Msg'] = "ALREADY EXIST";
                    objSummary['Proposal_Data'] = dbProposals[0];
                    res.json(objSummary);
                } else {
                    let ss_id_paid_to = objRequest.brokerage_paid_to_ss_id || 0;
                    let agent_name_paid_to = objRequest.brokerage_paid_to_name || "";
                    let brokerage_paid_by = objRequest.brokerage_paid_by_name && objRequest.brokerage_paid_by_uid && objRequest.brokerage_paid_by_ss_id && (objRequest.brokerage_paid_by_name + "_" + objRequest.brokerage_paid_by_uid + "_" + objRequest.brokerage_paid_by_ss_id) || "";
                    let brokerage_paid_to = objRequest.brokerage_paid_to_name && objRequest.brokerage_paid_to_ss_id && (objRequest.brokerage_paid_to_name + "_" + objRequest.brokerage_paid_to_ss_id) || "";
                    let brokerage_paid_details = ss_id_paid_to + '_' + agent_name_paid_to + '_' + moment().format("YYYY-MM-DD_HHmmss");
                    if (objRequest && brokerage_paid_details) {
                        let user_data_find_args = {
                            "PB_CRN": objRequest.crn && objRequest.crn - 0 || "",
                            "User_Data_Id": objRequest.udid && objRequest.udid - 0 || "",
                            "Proposal_Id": objRequest.proposal_id && objRequest.proposal_id - 0 || ""
                        };
                        let user_data_update_args = {
                            "Brokerage_Paid_Details": brokerage_paid_details,
                            "Premium_Request.brokerage_paid_details": brokerage_paid_details,
                            "Proposal_Request_Core.brokerage_paid_details": brokerage_paid_details,
                            "Erp_Qt_Request_Core.___brokerage_paid_details___": brokerage_paid_details
                        };
                        let User_Data = require('../models/user_data');
                        User_Data.findOneAndUpdate(user_data_find_args, { $set: user_data_update_args }, { new: true }, function (user_data_err, user_data_res) {
                            if (user_data_err) {
                                objSummary['Status'] = "FAIL";
                                objSummary['Msg'] = "ERROR_IN_USER_DATA_COLLECTION_UPDATE";
                                res.json(objSummary);
                            } else {
                                if (user_data_res) {
                                    objSummary['User_Data'] = user_data_res;
                                    let proposal_find_args = {
                                        'Proposal_Id': objRequest.proposal_id && objRequest.proposal_id - 0 || 0
                                    };
                                    let proposal_update_args = {
                                        "Is_Brokerage_Paid": 1,
                                        "Brokerage_Paid_On": new Date(),
                                        "Brokerage_Paid_By": brokerage_paid_by || "",
                                        "Brokerage_Paid_To": brokerage_paid_to || ""
                                    };
                                    let Proposal = require('../models/proposal');
                                    Proposal.findOneAndUpdate(proposal_find_args, { $set: proposal_update_args }, { new: true }, function (proposal_err, proposal_res) {
                                        if (proposal_err) {
                                            objSummary['Status'] = "FAIL";
                                            objSummary['Msg'] = "ERROR_IN_PROPOSAL_COLLECTION_DATA_UPDATE";
                                            res.json(objSummary);
                                        } else {
                                            if (proposal_res) {
                                                objSummary['Status'] = "SUCCESS";
                                                objSummary['Msg'] = "DATA_UPDATED_SUCCESSFULLY";
                                                objSummary['Proposal_Data'] = proposal_res;
                                                res.json(objSummary);
                                            } else {
                                                objSummary['Status'] = "FAIL";
                                                objSummary['Msg'] = "NO_DATA_UPDATE_IN_PROPOSAL";
                                                res.json(objSummary);
                                            }
                                        }
                                    });
                                } else {
                                    objSummary['Status'] = "FAIL";
                                    objSummary['Msg'] = "NO_DATA_UPDATE_IN_USER_DATA";
                                    res.json(objSummary);
                                }
                            }
                        });
                    } else {
                        objSummary['Status'] = "FAIL";
                        objSummary['Msg'] = "REQUEST_NOT_VALID";
                        res.json(objSummary);
                    }
                }
            });
        } catch (e) {
            res.json({ "Status": "FAIL", "Msg": e.stack });
        }
    });



};
function LoadSession(req, res, next) {
    try {
        var objRequestCore = req.body;
        if (req.method === "GET") {
            objRequestCore = req.query;
        }
        objRequestCore = JSON.parse(JSON.stringify(objRequestCore));
        if (objRequestCore.hasOwnProperty('session_id') && objRequestCore['session_id'] !== '') {
            var Session = require('../models/session');
            Session.findOne({ "_id": objRequestCore['session_id'] }, function (err, dbSession) {
                if (err) {
                    res.send(err);
                } else {
                    if (dbSession) {
                        dbSession = dbSession._doc;
                        var obj_session = JSON.parse(dbSession['session']);
                        req.obj_session = obj_session;
                        return next();
                    } else {
                        return res.status(401).json({ 'Msg': 'Session Expired.Not Authorized' });
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

function hasNumber(myString) {
    return /\d/.test(myString);
}
var capitalize = function (str) {
    var strArr = str.split(' ');
    var newArr = [];
    for (var i = 0; i < strArr.length; i++) {
        newArr.push(strArr[i].charAt(0).toUpperCase() + strArr[i].slice(1).toLowerCase());
    }

    return newArr.join(' ');
};

function swap(json) {
    var ret = {};
    for (var key in json) {
        ret[json[key]] = key;
    }
    return ret;
}

function get_search_source(user) {
    var client_key_val = '';
    try {
        client_key_val = 'PB-Direct';
        var agent_id = 0;
        var fba_id = 0;
        var posp_sources = 0;
        if (user['Premium_Request']['ss_id'] > 0) {
            posp_sources = user['Premium_Request']['posp_sources'];
            var ss_id = (user['Premium_Request']['ss_id'] - 0);
            fba_id = (user['Premium_Request']['posp_fba_id'] - 0);
            let channel = '';
            let pos_tag = 'NON-POSP';
            if (posp_sources > 0) {
                channel = user['Premium_Request']['channel'];
                if (user['Premium_Request'].hasOwnProperty('posp_erp_id') && (user['Premium_Request']['posp_erp_id'] - 0) > 0) { //posp_erp_id
                    pos_tag = 'POSP';
                } else if (ss_id !== 5) {
                    pos_tag = 'NON-POSP';
                } else if (ss_id === 5) {
                    pos_tag = 'FBA';
                }
                client_key_val = channel + '-' + pos_tag;
            } else {
                channel = user['Premium_Request']['channel'];
                if (user['Premium_Request']['posp_category'].indexOf('FOS') > -1) {
                    client_key_val = channel + '-FOS';
                } else if (user['Premium_Request']['posp_category'] === 'RBS') {
                    client_key_val = 'RBS';
                } else if (user['Premium_Request']['posp_category'] === 'MISP') {
                    client_key_val = 'MISP';
                } else {
                    client_key_val = 'PB-SS';
                }
            }
        } else if (user['Premium_Request']['user_source'] === 'tars') {
            client_key_val = 'BOT';
        } else if (user['Premium_Request'].hasOwnProperty('utm_campaign') && user['Premium_Request']['utm_campaign'] !== '') {
            client_key_val = 'PB-CAMP';
        }
    } catch (e) {
        console.error('');
    }
    return client_key_val;
}

function allowPincode(lm_pincode) {
    var pincodeArr = [];
    try {
        var content = fs.readFileSync(appRoot + "/resource/request_file/RB_SMS_Campaign/allow_pincodes.json");
        pincodeArr = JSON.parse(content);
        var result = pincodeArr.indexOf(lm_pincode);
        return (result > -1 ? 'yes' : 'no');
    } catch (err) {
        console.log(err);
    }
}

