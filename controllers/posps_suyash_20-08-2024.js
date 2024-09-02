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
var excel = require('excel4node'); 
var appRoot = path.dirname(path.dirname(require.main.filename));
var myDb = mongojs(config.db.connection + ':27017/' + config.db.name);
var MongoClient = require('mongodb').MongoClient;
mongoose.connect(config.db.connection + ':27017/' + config.db.name, {useMongoClient: true}); // connect to our database
var Client = require('node-rest-client').Client;
var Const_Obj_Client = new Client();
var client = new Client();
var Posp = require('../models/posp');
let posp_user = require('../models/posp_users.js');
let Posp_Doc_Log = require('../models/posp_doc_log.js');
function validatePan(pan) {
    return pan.match(
            /[A-Z]{5}[0-9]{4}[A-Z]{1}$/
            );
};
function sortObject(obj) {
    return Object.keys(obj).sort().reduce(function (result, key) {
        result[key] = obj[key];
        return result;
    }, {});
}
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
            if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1 || req.obj_session.user.role_detail.role.indexOf('Recruiter') > -1 || [7973, 7644, 131349, 7222, 138796, 5418].indexOf(req.obj_session.user.ss_id) > -1) {

            } 
			else if(req.obj_session.user.ss_id == 144624){
				filter["$or"] = [
					{'Sources' : '31'}
				];
			}
			else if (req.obj_session.user.role_detail.role.indexOf('ChannelHead') > -1) {
                let obj_posp_channel_to_source = swap(config.channel.Const_POSP_Channel);
                var arr_source = [];
                for (var x of req.obj_session.user.role_detail.channel_agent) {
                    arr_source.push(obj_posp_channel_to_source[x]);
                }
                //filter['Sources'] = {$in: arr_source};
				
				filter["$or"] = [
					{'Sources' : {$in: arr_source},'Reporting_Agent_Uid':{$in:[null,0]}},
					{"Vertical_Head_UID":req.obj_session.user.uid},
					{"Reporting_Agent_Uid":req.obj_session.user.uid}
				];
            } else {
                filter['Ss_Id'] = {$in: req.obj_session.users_assigned.Team.POSP};
            }


            if (typeof req.body['Col_Name'] == 'string' && req.body['Col_Name'] !== '' && req.body['txtCol_Val'] !== '') {
				//numeric value
				if(req.body['Col_Name'] === 'Ss_Id' || req.body['Col_Name'] === 'Reporting_Agent_Uid' || req.body['Col_Name'] === 'FOS_Code' ){
					req.body['txtCol_Val'] = req.body['txtCol_Val'] - 0;
				}
				
				//regex name
				if(req.body['Col_Name'] === 'First_Name' || req.body['Col_Name'] === 'Reporting_Agent_Name'){
					filter[req.body['Col_Name']] = new RegExp(req.body['txtCol_Val'], 'i');
				}
				else{
					filter[req.body['Col_Name']] =  req.body['txtCol_Val'];
				}                
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
                        arr_last_status.push(objStatusSummary[req.body['Last_Status_Group']][k].toString());
                    }
                    filter['Last_Status'] = {$in: arr_last_status};
                }
            }
            if (req.body['Last_Status'] !== '') {
                filter['Last_Status'] = req.body['Last_Status'].toString();
            }
            if (req.body['RegAmount'] !== '') {
                filter['RegAmount'] = req.body['RegAmount'] - 0;
            }
            if (typeof req.body['DateRange_Type'] !== "undefined" && req.body['DateRange_Type'] !== '' && req.body['transaction_start_date'] !== '' && req.body['transaction_end_date'] !== '') {
                var arrFrom = req.body['transaction_start_date'].split('-');
                var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);
                var arrTo = req.body['transaction_end_date'].split('-');
                            var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
                            dateTo.setDate(dateTo.getDate() + 1);
                filter[req.body['DateRange_Type']] = {"$gte": dateFrom, "$lte": dateTo};
                        }
            if (req.body['Col_Is_Contact_Sync'] !== '') {
                filter['Is_Contact_Sync'] = (req.body['Col_Is_Contact_Sync'] === 'yes') ? 1 : 0;
                        }
            if (req.body['Col_Is_Paid'] !== '') {
                filter['Is_Paid'] = (req.body['Col_Is_Paid'] === 'yes') ? 1 : 0;
                        }
			if (req.body['Reporting_One'] !== '') {
                filter['Reporting_One'] = req.body['Reporting_One'].toString();
                        }
			if (req.body['Reporting_Two'] !== '') {
                filter['Reporting_Two'] = req.body['Reporting_Two'].toString();
                        }
			if (req.body['SubVertical'] !== '') {
                filter['SubVertical'] = req.body['SubVertical'].toString();
                        }
			if (typeof req.body['Col_Is_FOS'] !== 'undefined' && req.body['Col_Is_FOS'] !== '') {
                filter['IsFOS'] = (req.body['Col_Is_FOS'] === 'yes') ? 1 : 0;
                        }
			if (typeof req.body['Col_Is_Certified'] !== 'undefined' &&  req.body['Col_Is_Certified'] !== '') {
                filter['Is_Certified'] = (req.body['Col_Is_Certified'] === 'yes') ? 1 : 0;
                        }
			if (typeof req.body['Col_Is_Sale_Active'] !== 'undefined' &&  req.body['Col_Is_Sale_Active'] !== '') {
                filter['Is_Sale'] = (req.body['Col_Is_Sale_Active'] === 'yes') ? 1 : 0;
                        }			
			if (typeof req.body['Col_User_Type'] !== 'undefined' && req.body['Col_User_Type'] !== '') {
				if(req.body['Col_User_Type'] == 'FOS'){
                                filter['IsFOS'] = 1;
                                filter['Is_Certified'] = {"$ne": 1};
                            }
				if(req.body['Col_User_Type'] == 'POS'){
                                filter['Is_Certified'] = 1;
                            }
				if(req.body['Col_User_Type'] == 'POSP_9'){
                                filter['Is_Certified'] = 1;
								filter['Erp_Id'] = { "$regex": /^9/i };
                            }			
				if(req.body['Col_User_Type'] == 'POSP_6'){
                                filter['Is_Certified'] = 1;
								filter['Erp_Id'] = { "$regex": /^6/i };
                            }			
				if(req.body['Col_User_Type'] == 'PENDING-POSP'){
                                filter['Is_Certified'] = 0;
                                filter['IsFOS'] = {"$ne": 1};
                            }
                        }
                    }


        Posp.paginate(filter, optionPaginate).then(function (posps) {
            console.log(obj_pagination.filter, optionPaginate, posps);
            if (posps && posps.docs.length > 0) {
                let arrSsIds = [];
                for (let doc of posps.docs) {
                    arrSsIds.push(doc.Ss_Id);
                }
                console.error({'User_Id': {$in: arrSsIds}});
                posp_user.find({'User_Id': {$in: arrSsIds}}).exec(function (err, dbPospUsers) {
                    if (err) {
                        res.json(err);
                    }
                    posps['posp_user'] = dbPospUsers;
                    res.json(posps);
                });
            } else {
				posps['posp_user'] = [];
                res.json(posps);
            }
        });
    });
    app.get('/posps_without_pagination', LoadSession, function (req, res) {
        try {
            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                try {
                    if (err)
                        throw err;
                    var posps = db.collection('posps');
                    var objRequestCore = {};
                    if (req.query && req.query !== {}) {
                        for (let k in req.query) {
                            objRequestCore[k] = req.query[k];
                        }
                    }
                    //let domain = req.protocol + '://' + req.get('host');
                    let domain = 'https://' + req.get('host');
                    let ssid = objRequestCore.ss_id;
                    let objSource = {};
					objSource = config.channel.Const_POSP_Channel;
                    let Const_Posp_Status = {
                        99: 'SignUp',
                        100: 'Payment Received',
                        1: 'Lead Created',
                        2: 'Co-ordinated',
                        3: 'Registered',
                        4: 'Document Uploaded',
                        5: 'Document Verified',
                        6: 'Document declined',
                        7: 'Training Schedule for GI',
                        8: 'Training Pass for GI',
                        9: 'Training Fail for GI',
                        10: 'Training Schedule for LI',
                        11: 'Training Pass for LI',
                        12: 'Training Fail for LI',
                        13: 'Certified Agent for GI',
                        14: 'Certified Agent for LI',
                        15: 'Training Schedule for Both',
                        16: 'Training Pass for Both',
                        17: 'Training Fail for Both',
                        18: 'Certified Agent for Both'
                    };
                    var filter = {};
                    if (objRequestCore['search[value]'] && objRequestCore['search[value]'] !== '') {
                        if (isNaN(objRequestCore['search[value]'])) {
                            filter = {
                                $or: [
                                    {'Request_Unique_Id': new RegExp(objRequestCore['search[value]'], 'i')},
                                    {'Posp_Unique_Id': new RegExp(objRequestCore['search[value]'], 'i')},
                                    {'Method_Type': new RegExp(objRequestCore['search[value]'], 'i')},
                                    {'Error_Code': new RegExp(objRequestCore['search[value]'], 'i')}
                                ]
                            };
                        } else {
                            filter = {'Product_Id': parseInt(objRequestCore['Product_Id'])};
                        }
                    } else {
                        filter = {'Is_Active': true};
                        if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1 || req.obj_session.user.role_detail.role.indexOf('Recruiter') > -1 || req.obj_session.user.ss_id == 7973) {

                        } else if (req.obj_session.user.ss_id == 144624) {
                            filter["$or"] = [
                                {'Sources': '31'}
                            ];
                        } else if (req.obj_session.user.role_detail.role.indexOf('ChannelHead') > -1) {
                            let obj_posp_channel_to_source = swap(config.channel.Const_POSP_Channel);
                            var arr_source = [];
                            for (var x of req.obj_session.user.role_detail.channel_agent) {
                                arr_source.push(obj_posp_channel_to_source[x]);
                            }
                            //filter['Sources'] = {$in: arr_source};

                            filter["$or"] = [
                                {'Sources': {$in: arr_source}, 'Reporting_Agent_Uid': {$in: [null, 0]}},
                                {"Vertical_Head_UID": req.obj_session.user.uid},
                                {"Reporting_Agent_Uid": req.obj_session.user.uid}
                            ];
                        } else {
                            filter['Ss_Id'] = {$in: req.obj_session.users_assigned.Team.POSP};
                        }


                        if (typeof objRequestCore['Col_Name'] == 'string' && objRequestCore['Col_Name'] && objRequestCore['Col_Name'] !== '' && objRequestCore['txtCol_Val'] && objRequestCore['txtCol_Val'] !== '') {
                            //numeric value
                            if (objRequestCore['Col_Name'] === 'Ss_Id' || objRequestCore['Col_Name'] === 'Reporting_Agent_Uid' || objRequestCore['Col_Name'] === 'FOS_Code') {
                                objRequestCore['txtCol_Val'] = objRequestCore['txtCol_Val'] - 0;
                            }

                            //regex name
                            if (objRequestCore['Col_Name'] === 'First_Name' || objRequestCore['Col_Name'] === 'Reporting_Agent_Name') {
                                filter[objRequestCore['Col_Name']] = new RegExp(objRequestCore['txtCol_Val'], 'i');
                            } else {
                                filter[objRequestCore['Col_Name']] = objRequestCore['txtCol_Val'];
                            }
                        }
                        if (objRequestCore['Last_Status_Group'] && objRequestCore['Last_Status_Group'] !== 'undefined' && objRequestCore['Last_Status_Group'] !== '') {
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
                            if (objStatusSummary.hasOwnProperty(objRequestCore['Last_Status_Group'])) {
                                var arr_last_status = [];
                                for (var k in objStatusSummary[objRequestCore['Last_Status_Group']]) {
                                    arr_last_status.push(objStatusSummary[objRequestCore['Last_Status_Group']][k].toString());
                                }
                                filter['Last_Status'] = {$in: arr_last_status};
                            }
                        }
                        if (objRequestCore['Last_Status'] && objRequestCore['Last_Status'] !== '') {
                            filter['Last_Status'] = objRequestCore['Last_Status'].toString();
                        }
                        if (objRequestCore['RegAmount'] && objRequestCore['RegAmount'] !== '') {
                            filter['RegAmount'] = objRequestCore['RegAmount'] - 0;
                        }
                        if (typeof objRequestCore['DateRange_Type'] !== "undefined" && objRequestCore['DateRange_Type'] !== '' && objRequestCore['transaction_start_date'] !== '' && objRequestCore['transaction_end_date'] !== '') {
                            var arrFrom = objRequestCore['transaction_start_date'].split('-');
                            var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);
                            var arrTo = objRequestCore['transaction_end_date'].split('-');
                            var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
                            dateTo.setDate(dateTo.getDate() + 1);
                            filter[objRequestCore['DateRange_Type']] = {"$gte": dateFrom, "$lte": dateTo};
                        }
                        if (objRequestCore['Col_Is_Contact_Sync'] && objRequestCore['Col_Is_Contact_Sync'] !== '') {
                            filter['Is_Contact_Sync'] = (objRequestCore['Col_Is_Contact_Sync'] === 'yes') ? 1 : 0;
                        }
                        if (objRequestCore['Col_Is_Paid'] && objRequestCore['Col_Is_Paid'] !== '') {
                            filter['Is_Paid'] = (objRequestCore['Col_Is_Paid'] === 'yes') ? 1 : 0;
                        }
                        if (objRequestCore['Reporting_One'] && objRequestCore['Reporting_One'] !== '') {
                            filter['Reporting_One'] = objRequestCore['Reporting_One'].toString();
                        }
                        if (objRequestCore['Reporting_Two'] && objRequestCore['Reporting_Two'] !== '') {
                            filter['Reporting_Two'] = objRequestCore['Reporting_Two'].toString();
                        }
                        if (objRequestCore['SubVertical'] && objRequestCore['SubVertical'] !== '') {
                            filter['SubVertical'] = objRequestCore['SubVertical'].toString();
                        }
                        if (typeof objRequestCore['Col_Is_FOS'] !== 'undefined' && objRequestCore['Col_Is_FOS'] !== '' && objRequestCore['Col_Is_FOS'] !== '') {
                            filter['IsFOS'] = (objRequestCore['Col_Is_FOS'] === 'yes') ? 1 : 0;
                        }
                        if (typeof objRequestCore['Col_Is_Certified'] !== 'undefined' && objRequestCore['Col_Is_Certified'] && objRequestCore['Col_Is_Certified'] !== '') {
                            filter['Is_Certified'] = (objRequestCore['Col_Is_Certified'] === 'yes') ? 1 : 0;
                        }
                        if (typeof objRequestCore['Col_User_Type'] !== 'undefined' && objRequestCore['Col_User_Type'] && objRequestCore['Col_User_Type'] !== '') {
                            if (objRequestCore['Col_User_Type'] == 'FOS') {
                                filter['IsFOS'] = 1;
                                filter['Is_Certified'] = {"$ne": 1};
                            }
                            if (objRequestCore['Col_User_Type'] == 'POS') {
                                filter['Is_Certified'] = 1;
                            }
                            if (objRequestCore['Col_User_Type'] == 'PENDING-POSP') {
                                filter['Is_Certified'] = 0;
                                filter['IsFOS'] = {"$ne": 1};
                            }
                        }
                    }
                    posps.find(filter).toArray(function (err, dbPosps) {
                        try {
                            if (err) {
                                res.send(err);
                            } else {
                                var excel = require('excel4node');
                                var workbook = new excel.Workbook();
                                var worksheet = workbook.addWorksheet('Sheet1');
                                var ff_file_name = "All_Posp_List.xlsx";
                                var ff_loc_path_portal = appRoot + "/tmp/posp_list/" + ssid + "/" + ff_file_name;
                                if (!fs.existsSync(appRoot + "/tmp/posp_list/" + ssid)) {
                                    fs.mkdirSync(appRoot + "/tmp/posp_list/" + ssid);
                                }
                                if (fs.existsSync(appRoot + "/tmp/posp_list/" + ssid + "/" + ff_file_name)) {
                                    fs.unlinkSync(appRoot + "/tmp/posp_list/" + ssid + "/" + ff_file_name);
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
                                if (parseInt(dbPosps.length) > 0) {
                                    //row 1
                                    worksheet.cell(1, 1).string('Posp_Id').style(styleh);
                                    worksheet.cell(1, 2).string('Type').style(styleh);
                                    worksheet.cell(1, 3).string('Pos_Type').style(styleh);
                                    worksheet.cell(1, 4).string('Source').style(styleh);
                                    worksheet.cell(1, 5).string('Name').style(styleh);
                                    worksheet.cell(1, 6).string('SSID').style(styleh);
                                    worksheet.cell(1, 7).string('FBAID').style(styleh);
                                    worksheet.cell(1, 8).string('ERPID').style(styleh);
                                    worksheet.cell(1, 9).string('Status').style(styleh);
                                    worksheet.cell(1, 10).string('Reporting').style(styleh);
                                    worksheet.cell(1, 11).string('RM_Vertical_Head').style(styleh);
                                    worksheet.cell(1, 12).string('RM_SubVertical').style(styleh);
                                    worksheet.cell(1, 13).string('ContactSync').style(styleh);
                                    worksheet.cell(1, 14).string('App_Installed').style(styleh);
                                    worksheet.cell(1, 15).string('Region').style(styleh);
                                    worksheet.cell(1, 16).string('Paid_On').style(styleh);
                                    worksheet.cell(1, 17).string('Training_Start_On').style(styleh);
                                    worksheet.cell(1, 18).string('Training_End_On').style(styleh);
                                    worksheet.cell(1, 19).string('Certification_On').style(styleh);
                                    worksheet.cell(1, 20).string('ErpCode_Created_On').style(styleh);
                                    //row 2

                                    for (var rowcount in dbPosps) {
                                        try {
                                            PospData = dbPosps[rowcount];
                                            rowcount = parseInt(rowcount);
                                            worksheet.cell(rowcount + 2, 1).string(PospData.Posp_Id ? (PospData.Posp_Id).toString() : "");
                                            let type = (PospData.FOS_Code && PospData.FOS_Code.toString().charAt(0) === '7' && PospData.IsFOS && PospData.IsFOS == 1) ? 'FOS' : 'POSP';
                                            worksheet.cell(rowcount + 2, 2).string(type);
                                            let pos_type = '';
                                            if (type === 'FOS') {
                                                pos_type = "FOS"; //
                                            }
                                            if (type === 'POSP') {
                                                pos_type = "TPOS(6_SERIES)"; //						
                                                if (PospData["POSP_Sources"] && PospData["POSP_Sources"] == "TESTUSER") {
                                                    pos_type = "TEST POSP"; //	
                                                }
												if (PospData["POSP_Sources"] && PospData["POSP_Sources"] == "FPOS") {
                                                    pos_type = "FPOS(4_SERIES)"; //	
                                                }
                                                if (PospData["POSP_Sources"] && PospData["POSP_Sources"] == "NPOS") {
                                                    //else if(dbPospUsers[k] && dbPospUsers[k].hasOwnProperty('Sources') && dbPospUsers[k]['Sources'] && (dbPospUsers[k].Sources - 0) === 31){
                                                    pos_type = "NPOS(9_SERIES)";
                                                }
                                                if (PospData && PospData.hasOwnProperty('Sources') && PospData['Sources'] && PospData.Sources == '31') {
                                                    pos_type = "NPOS(9_SERIES)";
                                                }
                                            }
                                            worksheet.cell(rowcount + 2, 3).string(pos_type);
                                            worksheet.cell(rowcount + 2, 4).string(PospData.Sources ? objSource[PospData.Sources] : "NA");
                                            worksheet.cell(rowcount + 2, 5).string((PospData.First_Name || "") + " " + (PospData.Middle_Name || "") + " " + (PospData.Last_Name || ""));
                                            worksheet.cell(rowcount + 2, 6).string(PospData.Ss_Id ? (PospData.Ss_Id).toString() : "");
                                            worksheet.cell(rowcount + 2, 7).string(PospData.Fba_Id ? (PospData.Fba_Id).toString() : "");
                                            let erp_id = PospData.Erp_Id ? PospData.Erp_Id : "NA";
                                            worksheet.cell(rowcount + 2, 8).string(erp_id.toString());
                                            worksheet.cell(rowcount + 2, 9).string(PospData.Last_Status ? Const_Posp_Status[PospData.Last_Status] : "NA");
                                            worksheet.cell(rowcount + 2, 10).string(PospData.Reporting_Agent_Name ? PospData.Reporting_Agent_Name + '(UID#' + (PospData.Reporting_Agent_Uid ? (PospData.Reporting_Agent_Uid).toString() : "") + ')' : "NA");
                                            worksheet.cell(rowcount + 2, 11).string(PospData.Vertical_Head ? PospData.Vertical_Head : "NA");
                                            worksheet.cell(rowcount + 2, 12).string(PospData.SubVertical ? PospData.SubVertical : "NA");
                                            worksheet.cell(rowcount + 2, 13).string(PospData.Is_Contact_Sync && PospData.Is_Contact_Sync == 1 ? "YES" : "NO");
                                            worksheet.cell(rowcount + 2, 14).string(PospData.Is_App_Installed && PospData.Is_App_Installed == "1" ? "YES" : "NO");
                                            worksheet.cell(rowcount + 2, 15).string(PospData.Agent_City ? (PospData.Agent_City).toString() : "");
                                            worksheet.cell(rowcount + 2, 16).string(PospData.Paid_On ? moment(PospData.Paid_On).format('YYYY-MM-DD HH:mm:ss') : "NA");
                                            worksheet.cell(rowcount + 2, 17).string(PospData.TrainingStartDate ? moment(PospData.TrainingStartDate).format('YYYY-MM-DD HH:mm:ss') : "NA");
                                            worksheet.cell(rowcount + 2, 18).string(PospData.TrainingEndDate ? moment(PospData.TrainingEndDate).format('YYYY-MM-DD HH:mm:ss') : "NA");
                                            worksheet.cell(rowcount + 2, 19).string(PospData.Certification_Datetime ? moment(PospData.Certification_Datetime).format('YYYY-MM-DD HH:mm:ss') : "NA");
                                            worksheet.cell(rowcount + 2, 20).string(PospData.ERPID_CreatedDate ? moment(PospData.ERPID_CreatedDate).format('YYYY-MM-DD HH:mm:ss') : "NA");
                                        } catch (e) {
                                            //res.json({'msg': 'error-' + e.message, 'data': dbPosps[rowcount]});
                                        }
                                    }
                                    workbook.write(ff_loc_path_portal, function (err, stats) {
                                        if (err) {
                                            console.error(err);
                                        } else {
//                                res.download(ff_loc_path_portal);
                                            //res.json({"Status": "Success", "Msg": domain + "/posp_list/" + ssid + "/" + ff_file_name});
                                            res.json({"Status": "Success", "Msg": config.environment.downloadurl + "/posp_list/" + ssid + "/" + ff_file_name});
                                        }
                                    });
                                } else {
                                    worksheet.cell(1, 1).string('Posp_Id').style(styleh);
                                    worksheet.cell(1, 2).string('Type').style(styleh);
                                    worksheet.cell(1, 3).string('Pos_Type').style(styleh);
                                    worksheet.cell(1, 4).string('Source').style(styleh);
                                    worksheet.cell(1, 5).string('Name').style(styleh);
                                    worksheet.cell(1, 6).string('SSID').style(styleh);
                                    worksheet.cell(1, 7).string('FBAID').style(styleh);
                                    worksheet.cell(1, 8).string('ERPID').style(styleh);
                                    worksheet.cell(1, 9).string('Status').style(styleh);
                                    worksheet.cell(1, 10).string('Reporting').style(styleh);
                                    worksheet.cell(1, 11).string('RM_Vertical_Head').style(styleh);
                                    worksheet.cell(1, 12).string('RM_SubVertical').style(styleh);
                                    worksheet.cell(1, 13).string('ContactSync').style(styleh);
                                    worksheet.cell(1, 14).string('App_Installed').style(styleh);
                                    worksheet.cell(1, 15).string('Region').style(styleh);
                                    worksheet.cell(1, 16).string('Paid_On').style(styleh);
                                    worksheet.cell(1, 17).string('Training_Start_On').style(styleh);
                                    worksheet.cell(1, 18).string('Training_End_On').style(styleh);
                                    worksheet.cell(1, 19).string('Certification_On').style(styleh);
                                    worksheet.cell(1, 20).string('ErpCode_Created_On').style(styleh);

                                    workbook.write(ff_loc_path_portal, function (err, stats) {
                                        if (err) {
                                            console.error(err);
                                        } else {
//                                res.download(ff_loc_path_portal);
                                            //res.json({"Status": "Success", "Msg": domain + "/posp_list/" + ssid + "/" + ff_file_name});
                                            res.json({"Status": "Success", "Msg": config.environment.downloadurl + "/posp_list/" + ssid + "/" + ff_file_name});
                                        }
                                    });
                                }
                                //res.download(ff_loc_path_portal);
                            }
                            db.close();
                        } catch (e) {
                            console.error("Error - /posps_without_pagination", e.stack);
                            res.json({"Status": "Fail", "Msg": e.stack});
                        }
                    });
                } catch (e) {
                    console.error("Error - /posps_without_pagination", e.stack);
                    res.json({"Status": "Fail", "Msg": e.stack});
                }
            });
        } catch (e) {
            console.error("Error - /posps_without_pagination", e.stack);
            res.json({"Status": "Fail", "Msg": e.stack});
        }
    });
    app.get('/posp_list/:ssid/:filename',function(req,res){
        try{
            let ssid = req.params.ssid;
            let filename = req.params.filename;
            if(ssid && filename && ssid !== "" && filename !== ""){
                res.download(appRoot + '/tmp/posp_list/' + ssid + '/' + filename);
            }else{
                res.json({"Status":"Fail","Msg":"SsId or Filename is missing"});
            }
            
        }catch(e){
            console.error("Error - /download_posp_excel", e.stack);
            res.json({"Status": "Fail", "Msg": e.stack});
        }
    });
    app.get('/posps/pivot/:limit', LoadSession, function (req, res) {
        let data_limit = req.params.limit || 10;
        var filter = {};

        filter = {'Is_Active': true};
        /*
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
         */

        Posp.find(filter).select('-_id Channel Recruitment_Status Agent_City First_Name Last_Name Gender Present_City Present_State RegAmount').limit(data_limit - 0).exec(function (err, dbPosp) {
            if (err) {
                res.json({});
            } else {
                res.json(dbPosp);
            }
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
        let uid = req.params.uid || 0;
        uid = uid - 0;
		let ver = req.query['ver'] || "1";
		ver = ver - 0;
		if(ver == 1){
			GetReportingAssignedAgent(uid, res);
		}
		if(ver == 2){
			GetReportingAssignedAgent_Ver2(uid, res);
		}
    });

    function dsa_posp_update_rm_handler(res, obj_status) {
        try {
            obj_status['erp_status'] = 'PENDING';
            if (obj_status['posp_status'] !== 'PENDING' && obj_status['employee_status'] !== 'PENDING') {
                if (obj_status['req']["ss_id"] > 0 && obj_status['req']["Reporting_Agent_UID"] > 0) {
                    let ERP_MAPPING_URL = config.environment.weburl + '/posps/mapping/erp_update_rm?ss_id=' + obj_status['req']["ss_id"] + '&rm_uid=' + obj_status['req']["Reporting_Agent_UID"] + '&mode=' + obj_status['req']["mode"] + '&mapped_by=' + obj_status['req']["mapped_by"];
                    console.error('DBG', 'ERP_MAPPING_URL', ERP_MAPPING_URL);
                    client.get(ERP_MAPPING_URL, {}, function (data, response) {
                        obj_status['erp_data'] = data;
                        if (data['status'] === 'SUCCESS') {
                            obj_status['erp_status'] = 'SUCCESS';
                        } else {
                            obj_status['erp_status'] = 'FAIL';
                        }
                        if (obj_status['posp_status'] === 'SUCCESS' || obj_status['employee_status'] === 'SUCCESS') {
                            client.get(config.environment.weburl + '/report/sync_posp_master?ss_id=' + obj_status['req']["ss_id"], {}, function (data, response) {
								client.get(config.environment.weburl + '/report/sync_emp_master?ss_id=' + obj_status['req']["ss_id"], {}, function (data, response) {
									return res.json(obj_status);
								});
                            });
                        }
						else{
							return res.json(obj_status);
						}	
                    });
                } else {
                    return res.json(obj_status);
                }
            }
        } catch (e) {
            return res.send(e.stack);
        }
    }
    app.post('/posps/dsa_posp_update_rm', function (req, res) {
        try {
            req.body = JSON.parse(JSON.stringify(req.body));
            var objrequestCore = req.body;
            var obj_data = {
                'ss_id': 1,
                //'fba_id': 1,
                "Reporting_Agent_UID": 1,
                "Reporting_Agent_Name": 1,
                //"Reporting_Mobile_Number": 1,
                //"Reporting_Email_ID": 1
            };
            var posp_qry_str = "";
            for (var k in obj_data) {
                if (objrequestCore[k] == '') {
                    return res.send('ERR_PARAMETER_MISSING');
                }
            }
            //var posp_qry_str = 'update Posp_Details set Reporting_Agent_UID = ' + objrequestCore['Reporting_Agent_UID'].toString() + ' , Reporting_Agent_Name = \'' + objrequestCore['Reporting_Agent_Name'].toString() + '\' , Reporting_Mobile_Number = ' + objrequestCore['Reporting_Mobile_Number'].toString() + ' , Reporting_Email_ID = \'' + objrequestCore['Reporting_Email_ID'].toString() + '\'    where SS_ID = ' + objrequestCore["ss_id"].toString();
            //var employee_qry_str = 'update Employee_Master set UID = ' + objrequestCore['Reporting_Agent_UID'].toString() + ' , Reporting_UID_Name = \'' + objrequestCore['Reporting_Agent_Name'].toString() + '\' , Reporting_Mobile_Number = ' + objrequestCore['Reporting_Mobile_Number'].toString() + ' , Reporting_Email_ID = \'' + objrequestCore['Reporting_Email_ID'].toString() + '\'    where Emp_Id = ' + objrequestCore["ss_id"].toString();
			var posp_qry_str = 'update Posp_Details set Reporting_Agent_UID = ' + objrequestCore['Reporting_Agent_UID'].toString() + ' , Reporting_Agent_Name = \'' + objrequestCore['Reporting_Agent_Name'].toString() + '\'     where SS_ID = ' + objrequestCore["ss_id"].toString();
            var employee_qry_str = 'update Employee_Master set UID = ' + objrequestCore['Reporting_Agent_UID'].toString() + ' , Reporting_UID_Name = \'' + objrequestCore['Reporting_Agent_Name'].toString() + '\'     where Emp_Id = ' + objrequestCore["ss_id"].toString();
            
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
                            obj_status['req']['ss_id'] = obj_status['req']['ss_id'] - 0;
                            obj_status['req']['Reporting_Agent_UID'] = obj_status['req']['Reporting_Agent_UID'] - 0;
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
            }
        } catch (e) {
            return res.send(e.stack);
        }
    });
    app.get('/posps/dsas/view_by_erpcode/:erp_code', function (req, res) {
        let erp_code = req.params.erp_code || '';
        erp_code = erp_code.toString();
        let obj_agent = {
            'user_type': '',
            'product': 'insurance,loan',
            'status': 'NA',
            'channel': '',
            'POSP': null,
            'POSP_INSURER': null,
            'EMP': null,
            'RM': null
        };
        if (['1','6', '7','9'].indexOf(erp_code.charAt(0)) > -1 && erp_code.length === 6) {
            //var Posp = require('../models/posp');
            Posp.findOne({"Erp_Id": erp_code, 'Is_Active': true}, function (err, dbPosp) {
                if (dbPosp) {
                    dbPosp = dbPosp._doc;
                    let ss_id = dbPosp['Ss_Id'];
                    if (dbPosp['Erp_Id'] && (dbPosp['Erp_Id'] - 0) > 0) {
                        let Insurer_Posp = require('../models/insurer_posp');
                        Insurer_Posp.findOne({'ss_id': ss_id - 0}, function (err, dbInsurer_Posp) {
                            obj_agent['POSP'] = dbPosp;
                            if (dbInsurer_Posp) {
                                obj_agent['POSP_INSURER'] = dbInsurer_Posp._doc;
                            } else {
                                obj_agent['POSP_INSURER'] = 'NA';
                            }
                            posps_dsas_view_handler(obj_agent, req, res);
                        });
                    } else {
                        obj_agent['POSP'] = dbPosp;
                        obj_agent['POSP_INSURER'] = 'NA';
                        posps_dsas_view_handler(obj_agent, req, res);
                    }
                } else {
                    obj_agent['POSP'] = 'NA';
                    obj_agent['POSP_INSURER'] = 'NA';
                    posps_dsas_view_handler(obj_agent, req, res);
                }
            });
            var Employee = require('../models/employee');
            Employee.findOne({"Emp_Code": erp_code - 0, 'IsActive': 1}, function (err, dbEmployee) {
                if (dbEmployee) {
                    obj_agent['EMP'] = dbEmployee._doc;
                    posps_dsas_view_handler(obj_agent, req, res);
                } else { // for invalid agent id
                    obj_agent['EMP'] = 'NA';
                    client.get(config.environment.weburl + '/report/sync_emp_master?ss_id=' + ss_id, {}, function (data, response) {});
                    client.get(config.environment.weburl + '/report/sync_posp_master?ss_id=' + ss_id, {}, function (data, response) {});
                    res.json(obj_agent);
                }
            });
        } else {
            res.json(obj_agent);
        }
    });
	
	function pre_posps_dsas_view(req, res , next){
		let ss_id = req.params.ss_id - 0;
		let cond_posp = null;
		let cond_emp = null;
		let fba_id = 0;
		req.query['ss_id'] = ss_id;
        if(ss_id === 0 && req.query.hasOwnProperty('fba_id')){
			fba_id = req.query['fba_id'] - 0;
			cond_emp = {"FBA_ID": fba_id, 'IsActive': 1};
			var Employee = require('../models/employee');
			Employee.findOne(cond_emp, function (err, dbEmployee) {
				if (dbEmployee) {
					dbEmployee = dbEmployee._doc;
					ss_id = dbEmployee['Emp_Id'];
					req.query['ss_id'] = ss_id;
					return next();
				}
				else{
					cond_posp = {"Fba_Id": fba_id, 'Is_Active': true};
					Posp.findOne(cond_posp, function (err, dbPosp) {
						if (dbPosp) {
							dbPosp = dbPosp._doc;
							ss_id = dbPosp['Ss_Id'];
							req.query['ss_id'] = ss_id;
							return next();
						}
						else{
							return res.json({
								'user_type': '',
								'product': 'insurance,loan',
								'status': 'INVALID'
							});
						}
					});
				}
			});			
		}
		else{
			return next();
		}
	}
	app.get('/posps/get_details/ss_id', function (req, res) {
		let ss_id = 0;
		let cond_posp = null;
		let cond_emp = null;
		let fba_id = (req.query.hasOwnProperty('fba_id') && (req.query['fba_id'] - 0) > 0) ? (req.query['fba_id'] - 0) : 0;
		if(fba_id > 0){
			fba_id = req.query['fba_id'] - 0;
			cond_emp = {"FBA_ID": fba_id, 'IsActive': 1};
			var Employee = require('../models/employee');
			Employee.findOne(cond_emp, function (err, dbEmployee) {
				if (dbEmployee) {
					dbEmployee = dbEmployee._doc;
					ss_id = dbEmployee['Emp_Id'];
					return res.json({
						'status' : 'SUCCESS',
						'ss_id' : ss_id,
						'fba_id' : fba_id
					});
				}
				else{
					cond_posp = {"Fba_Id": fba_id, 'Is_Active': true};
					Posp.findOne(cond_posp, function (err, dbPosp) {
						if (dbPosp) {
							dbPosp = dbPosp._doc;
							ss_id = dbPosp['Ss_Id'];
							return res.json({
								'status' : 'SUCCESS',
								'ss_id' : ss_id,
								'fba_id' : fba_id
							});
						}
						else{
							return res.json({
								'status' : 'FAIL',
								'ss_id' : ss_id,
								'fba_id' : fba_id
							});
						}
					});
				}
			});			
		}
		else{
			return res.json({
				'status' : 'FAIL',
				'ss_id' : ss_id,
				'fba_id' : fba_id
			});
		}
	})
	app.get('/posps/dsas/view/:ss_id', pre_posps_dsas_view , function (req, res ,next) {
		let Email = require('../models/email');
		let objModelEmail = new Email();
		let ss_id = req.query.hasOwnProperty('ss_id') ? req.query['ss_id'] : 0;
		ss_id = ss_id - 0;
		let pos_cache_key = "posps_dsas_view_" + ss_id;
		let pos_cache_key_file = appRoot + "/cache/dsaview/" + pos_cache_key + ".log";		
		if (ss_id > 0 && fs.existsSync(pos_cache_key_file) === true) {
			let curr_date = moment().utcOffset("+05:30").startOf('Day').format('YYYY-MM-DD');	
			let stats = fs.statSync(pos_cache_key_file);
			let mtime = moment(stats.mtime).utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
			let mdate = moment(stats.mtime).utcOffset("+05:30").startOf('Day').format('YYYY-MM-DD');
			if(curr_date === mdate){			
				var cache_content = fs.readFileSync(pos_cache_key_file).toString();
				let cache_content_json = JSON.parse(cache_content);
				cache_content_json['cached_on_time'] = mtime;
				cache_content_json['cached_on_date'] = mdate;
				cache_content_json['curr_date'] = curr_date;
				cache_content_json['cached'] = 'YES';				
				return res.json(cache_content_json);
			}
		}	
		let fba_id = req.query.hasOwnProperty('fba_id') ? req.query['fba_id'] : 0;
		fba_id = fba_id - 0;
        let obj_agent = {
			'Ss_Id' : ss_id,
            'user_type': '',
            'product': 'insurance,loan',
            'status': 'NA',
            'channel': '',
            'POSP': null,
			'POSP_USER': null,
			'DOC_LOGS' : null,
			'IIB' : null,
            'POSP_INSURER': null,
            'EMP': null,
            'RM': null,
			"MAPPING_HISTORY" : null,
            'HR': null,
			'SYNC_CONTACT' : {
				'ACTION_NEEDED' : 'SYNC',
				'FIRST_SYNC_CAMPAIGN_CREATIVE' : 'https://origin-cdnh.policyboss.com/fmweb/prod_info/Images/in_miss1.jpeg',
				'RE_SYNC_CAMPAIGN_CREATIVE' : 'https://origin-cdnh.policyboss.com/fmweb/prod_info/Images/in_miss1.jpeg'
			},
			'SYNC_CONTACT_LEAD_PURCHASE' : {
				'ACTION_NEEDED' : 'PURCHASE'
			},
			'DEVICE' : {
				'ACTION_NEEDED' : 'INSTALL'
			},
			"INSURANCE" : {
				'ACTION_NEEDED' : 'SALE'
			}			
		};
		obj_agent["Cache_Key"] = pos_cache_key_file;
		let pan = "";
		if(ss_id > 0){
			Posp.findOne({"Ss_Id": ss_id, 'Is_Active': true}, function (err, dbPosp) {
				if (dbPosp) {
					dbPosp = dbPosp._doc;
						//update ssid
					try{
						
						if(dbPosp["Fba_Id"] > 0 && dbPosp["Ss_Id"] > 0){
							let fba_request = {
								data: {
									"FBAID": dbPosp["Fba_Id"].toString(),
									"SSID": dbPosp["Ss_Id"].toString()
								},
								headers: {
									"Content-Type": "application/json",
									"token": "1234567890"
								}
							};
							client.post("http://api.magicfinmart.com/api/UpdateSSID", fba_request, function (fba_ssid_update_data, fba_ssid_update_response) {
								console.error('fba_ssid_update', "FBAID",dbPosp.Fba_Id,"SSID",dbPosp.Ss_Id, ((fba_ssid_update_data && fba_ssid_update_data["Status"]) ? fba_ssid_update_data["Status"] : "NO_STATUS"), fba_ssid_update_data || {});
							});	
						}							
					}							
					catch(e){
						console.error("fba_ssid",e.stack);
					}
					//
					posp_user.findOne({"Ss_Id": ss_id, 'Is_Active': true}, function (err, dbPospUser) {
						if(dbPospUser){
							dbPospUser = dbPospUser._doc;							
							obj_agent['POSP_USER'] = sortObject(dbPospUser);
							if (dbPosp['Is_Certified'] == 1 && dbPosp['Erp_Id'] && (dbPosp['Erp_Id'] - 0) > 0) {
								dbPosp["First_Name"] = dbPospUser["First_Name"];
								dbPosp["Middle_Name"] = dbPospUser["Middle_Name"];
								dbPosp["Last_Name"] = dbPospUser["Last_Name"];
								dbPosp["Mobile_No"] = dbPospUser["Mobile_No"];
								dbPosp["Aadhar"] = dbPospUser["Aadhar"];
								dbPosp["Pan_No"] = dbPospUser["Pan_No"];
								dbPosp["Email_Id"] = dbPospUser["Email_Id"];										
							}							
						}
						pan = dbPosp['Pan_No'] || "NA";
						pan = pan.toString().trim().toUpperCase();
						dbPosp['Pan_No'] = pan;
						let Iib_Posp = require('../models/iib_posp');						
						Iib_Posp.findOne({"PAN": pan}).select("PAN DoB_Format AppointmentDate_Format InternalPOSCode POSPFName POSPMName POSPLName Age_On_Appointment").exec(function (err, dbIIB_Pan) {
							if(dbIIB_Pan){
								obj_agent["IIB"] = dbIIB_Pan._doc;
							}
													
							//let Client = require('node-rest-client').Client;
							//let client = new Client();
							client.get(config.environment.weburl + '/posps/msql/get_document_list?fba_id=0&ss_id=' + ss_id.toString(), {}, function (posp_document, posp_document_response) {
								let posp_onboarding_photo = '';
								let obj_posp_document = {};
								if(posp_document && posp_document.err == ''){
									obj_posp_document = posp_document["result_adv"]["Document_List"];
									posp_onboarding_photo = posp_document["result_adv"]["Posp_Onboarding_Photo"];
									obj_agent['DOC_LOGS'] = posp_document["doc_mongo"] || {};
									// for back data compatibility								
									if(dbPospUser){																		
									}
									else{
										if(ss_id < 142726){
											client.get(config.environment.weburl + '/onboarding/schedule_posp_user_data?ss_id=' + ss_id.toString(), {}, function (schedule_posp_user_data_document, schedule_posp_user_data_response) {
												let res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>POSP USER NOT SYNC</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
												res_report += '<p><h1>SSID-'+ss_id + '</h1></p>';
												res_report += '<p><h1>RESPONSE</h1></p>';
												if(schedule_posp_user_data_document){
													res_report += '<p><pre>'+JSON.stringify(schedule_posp_user_data_document,undefined,2)+'</pre></p>';
												}
												else{
													res_report += '<p>NO REPONSE</p>';
												}	
												res_report += '</body></html>';
												posp_user.count({"Ss_Id": ss_id}, function (err, PospUser_Count) {												
													let subject = '';
													if(PospUser_Count > 0){
														subject = '[POSP_NOT_SYNC] SYNC_PROCESSED :: SUCCESS , SSID-'+ss_id;
														objModelEmail.send('notifications@policyboss.com', config.environment.notification_email,subject, res_report, '', '');
													}
													else{
														subject = '[POSP_NOT_SYNC] SYNC_PROCESSED :: FAIL , SSID-'+ss_id;
														objModelEmail.send('notifications@policyboss.com', 'roshani.prajapati@policyboss.com,nilam.bhagde@policyboss.com,anuj.singh@policyboss.com' ,subject, res_report, '', config.environment.notification_email);
													}
												});
											});																				
											let res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>POSP USER NOT SYNC</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
											res_report += '<p><h1>SSID-'+ss_id + '</h1></p>';	
											res_report += '</body></html>';
											let subject = '[POSP_NOT_SYNC] NOT_EXISTS , SSID-'+ss_id;
											objModelEmail.send('notifications@policyboss.com', config.environment.notification_email,subject, res_report, '', '');									
										}
									}								
								}					
								if (dbPosp['Erp_Id'] && (dbPosp['Erp_Id'] - 0) > 0) {
									console.error('DBG-1', ss_id, dbPosp['Erp_Id']);
									let Insurer_Posp = require('../models/insurer_posp');
									Insurer_Posp.findOne({'ss_id': ss_id - 0}, function (err, dbInsurer_Posp) {
										obj_agent['POSP'] = sortObject(dbPosp);
										obj_agent['POSP']['Document_List'] = obj_posp_document;	
										obj_agent['POSP']['Posp_Onboarding_Photo'] = posp_onboarding_photo;
										if (dbInsurer_Posp) {
											console.error('DBG-3', ss_id, 'IPM');
											obj_agent['POSP_INSURER'] = dbInsurer_Posp._doc;
										} else {
											console.error('DBG-4', ss_id, 'NO_IPM');
											obj_agent['POSP_INSURER'] = 'NA';
										}
										posps_dsas_view_handler(obj_agent, req, res);
									});
								} else {
									obj_agent['POSP'] = sortObject(dbPosp);
									obj_agent['POSP']['Document_List'] = obj_posp_document;
									obj_agent['POSP']['Posp_Onboarding_Photo'] = posp_onboarding_photo;
									console.error('DBG-2', ss_id, 'NOERPID');
									obj_agent['POSP_INSURER'] = 'NA';
									posps_dsas_view_handler(obj_agent, req, res);
								}					
							});
						});	
					});
				} else {
					obj_agent['POSP'] = 'NA';
					obj_agent['POSP_INSURER'] = 'NA';
					posps_dsas_view_handler(obj_agent, req, res);
				}
			});
			var Employee = require('../models/employee');
			Employee.findOne({"Emp_Id": ss_id, 'IsActive': 1}, function (err, dbEmployee) {
				if (dbEmployee) {
					obj_agent['EMP'] = sortObject(dbEmployee._doc);
					posps_dsas_view_handler(obj_agent, req, res);
				} else { // for invalid agent id
					obj_agent['EMP'] = 'NA';
					
					client.get(config.environment.weburl + '/report/sync_emp_master?ss_id=' + ss_id, {}, function (data, response) {});
					client.get(config.environment.weburl + '/report/sync_posp_master?ss_id=' + ss_id, {}, function (data, response) {});
					
					res.json(obj_agent);
				}
			});
			let Rm_Mapping = require('../models/rm_mapping');
			Rm_Mapping.findOne({"ss_id": ss_id}).sort({"Created_On":-1}).exec(function (err, dbRm_Mapping) {
				if (dbRm_Mapping) {
					obj_agent['MAPPING_HISTORY'] = dbRm_Mapping._doc;                
				} else { // for invalid agent id
					obj_agent['MAPPING_HISTORY'] = 'NA';
				}
				posps_dsas_view_handler(obj_agent, req, res);
			});
			
			var User = require('../models/user');
			User.findOne({"Ss_Id": ss_id}, function (err, dbUser) {
				if (dbUser) {
					obj_agent['HR'] = dbUser._doc;                
				} else { // for invalid agent id
					obj_agent['HR'] = 'NA';
				}
				posps_dsas_view_handler(obj_agent, req, res);
			});
			let Now = moment().utcOffset("+05:30");
			/*
			let Device = require('../models/device');
			Device.findOne({"SS_ID": ss_id}).sort({Modified_On:-1}).exec(function (err, dbDevice) {
				dbDevice = (dbDevice) ? dbDevice._doc : {};
				obj_agent['DEVICE'] = dbDevice;
				obj_agent['DEVICE']['ACTION_NEEDED'] = 'INSTALL';
				if(dbDevice && dbDevice.hasOwnProperty('Activated_On') === true){				
					let Last_Activated_On = moment(dbDevice['Activated_On']).utcOffset("+05:30");
					let Days_From_Last_Active = Now.diff(Last_Activated_On, 'days');				
					obj_agent['DEVICE']['Days_From_Last_Active'] = Days_From_Last_Active;
					obj_agent['DEVICE']['ACTION_NEEDED'] = (Days_From_Last_Active > 3) ? 'ACTIVE' : 'NO_ACTION';				
				}
				posps_dsas_view_handler(obj_agent, req, res);
			});
*/
			/*let Razorpay_Payment = require('../models/razorpay_payment');
			Razorpay_Payment.findOne({"Ss_Id": ss_id, Transaction_Status:'Success'}).sort({Modified_On:-1}).exec(function (err, dbRazorpay_Payment) {
				dbRazorpay_Payment = (dbRazorpay_Payment) ? dbRazorpay_Payment._doc : {};
				obj_agent['SYNC_CONTACT_LEAD_PURCHASE'] = dbRazorpay_Payment;
				obj_agent['SYNC_CONTACT_LEAD_PURCHASE']['ACTION_NEEDED'] = 'PURCHASE';
				if(dbRazorpay_Payment && dbRazorpay_Payment.hasOwnProperty('Modified_On') === true){
					let Last_Purchased_On = moment(dbRazorpay_Payment['Modified_On']).utcOffset("+05:30");
					let Days_From_Last_Purchase = Now.diff(Last_Purchased_On, 'days');				
					obj_agent['SYNC_CONTACT_LEAD_PURCHASE']['Days_From_Last_Purchase'] = Days_From_Last_Purchase;
					obj_agent['SYNC_CONTACT_LEAD_PURCHASE']['ACTION_NEEDED'] = (Days_From_Last_Purchase > 30) ? 'RE_PURCHASE' : 'NO_ACTION';				
				}
				posps_dsas_view_handler(obj_agent, req, res);
			});
			*/
			/*
			let User_Data = require('../models/user_data');
			User_Data.findOne({"Premium_Request.ss_id": ss_id,"Last_Status":{$in:['TRANS_SUCCESS_WO_POLICY', 'TRANS_SUCCESS_WITH_POLICY']}}).sort({Modified_On:-1}).exec(function (err, dbUser_Data) {
				dbUser_Data = (dbUser_Data) ? dbUser_Data._doc : {};			
				obj_agent['INSURANCE'] = {};
				obj_agent['INSURANCE']['ACTION_NEEDED'] = 'SALE';
				if(dbUser_Data && dbUser_Data.hasOwnProperty('Modified_On') === true){
					obj_agent['INSURANCE']['Last_Sale_On'] = dbUser_Data['Modified_On'];
					let Last_Sale_On = moment(dbUser_Data['Modified_On']).utcOffset("+05:30");
					let Days_From_Last_Sale = Now.diff(Last_Sale_On, 'days');				
					obj_agent['INSURANCE']['Days_From_Last_Sale'] = Days_From_Last_Sale;
					obj_agent['INSURANCE']['ACTION_NEEDED'] = (Days_From_Last_Sale > 30) ? 'RE_SALE' : 'NO_ACTION';				
				}
				posps_dsas_view_handler(obj_agent, req, res);
			});
		*/
			/*		
			let Sync_Contact = require('../models/sync_contact');
			let arr_Sync_Contact_Cond = [
				{"$match": {"ss_id" : ss_id}},
				{$group: {
						_id: {'ss_id': "$ss_id", 'fba_id': "$fba_id", 'channel': "$channel"},
						contact: {$sum: 1},
						sync: {$sum: "$Is_Synced"},
						found: {$sum: "$Is_Found"},
						rsa_visited: {$sum: "$is_rsa_visited"},
						rsa_issued: {$sum: "$is_rsa_issued"},
						'first_synced_on' : {$first : "$Created_On"},
						'last_synced_on' : {$last : "$Created_On"}
					}},
				{$project: {_id: 0, "ss_id": '$_id.ss_id', fba_id: '$_id.fba_id', channel: '$_id.channel', contact: 1, sync: 1, found: 1, rsa_visited: 1, rsa_issued: 1,first_synced_on:1,last_synced_on:1}},
				{$sort: {'contact': -1}}
			];
			Sync_Contact.aggregate(arr_Sync_Contact_Cond).exec(function (err, dbSync_Contact_Summary) {
				dbSync_Contact_Summary = (dbSync_Contact_Summary && dbSync_Contact_Summary.length > 0) ? dbSync_Contact_Summary[0] : {};
				obj_agent['SYNC_CONTACT'] = dbSync_Contact_Summary;
				obj_agent['SYNC_CONTACT']['ACTION_NEEDED'] = 'SYNC';
				obj_agent['SYNC_CONTACT']['FIRST_SYNC_CAMPAIGN_CREATIVE'] = 'https://origin-cdnh.policyboss.com/fmweb/prod_info/Images/in_miss1.jpeg';
				obj_agent['SYNC_CONTACT']['RE_SYNC_CAMPAIGN_CREATIVE'] = 'https://origin-cdnh.policyboss.com/fmweb/prod_info/Images/in_miss1.jpeg';
				if(dbSync_Contact_Summary && dbSync_Contact_Summary.hasOwnProperty('last_synced_on') === true){
					let Now = moment().utcOffset("+05:30");
					let Last_Sync_On = moment(dbSync_Contact_Summary['last_synced_on']).utcOffset("+05:30");
					let Days_From_Last_Sync = Now.diff(Last_Sync_On, 'days');				
					let Is_ReSync_Required = (Days_From_Last_Sync > 15) ? "YES" : "NO";
					obj_agent['SYNC_CONTACT']['Days_From_Last_Sync'] = Days_From_Last_Sync;
					obj_agent['SYNC_CONTACT']['ACTION_NEEDED'] = (Is_ReSync_Required == 'YES') ? 'RE_SYNC' : 'NO_ACTION';				
				}
				posps_dsas_view_handler(obj_agent, req, res);
			});
			*/
		}
		else{
			return res.json(obj_agent);
		}
    });
	app.get('/posps/iib_container/sync_iib_upload_date', function (req, res) {
		let obj_summary = {
			"status" : "PENDING",
			"Appointed_On" : null,
			"Pan_Count" : 0,
			"Pan_List" : null,
			"SsId_List" : null,
			"Pan_List_Full" : null,
			"DB_Status" : null,
			"DB_Detail" : null
		};
		let Iib_Posp = require('../models/iib_posp');
		let Appointed_On = req.query['appointed_on'] || "";
		obj_summary["Appointed_On"] = Appointed_On;
		if(Appointed_On !== "" && moment(Appointed_On,"YYYY-MM-DD",true).isValid() === true){
			let Appointed_On_Format2 = moment(Appointed_On,"YYYY-MM-DD").format("DD-MM-YYYY");
			Iib_Posp.find({"AppointmentDate_Format": Appointed_On,"PAN":{"$ne":""}}).select("InternalPOSCode AppointmentDate_Format PAN POSPFName POSPMName POSPLName DoB_Format").exec(function (err, db_IIB_Pans) {
				obj_summary["Pan_List_Full"] = db_IIB_Pans;
				let arr_ssid = [];
				let arr_IIB_Pan = [];
				for(let ind_posp of db_IIB_Pans){
					ind_posp = ind_posp._doc;
					arr_ssid.push(ind_posp["InternalPOSCode"] - 0);
					arr_IIB_Pan.push(ind_posp["PAN"]);
				}
				obj_summary["Pan_List"] = arr_IIB_Pan;
				obj_summary["SsId_List"] = arr_ssid;
				if(arr_IIB_Pan.length > 0){
					obj_summary["Pan_Count"] = arr_IIB_Pan.length;					
					posp_user.find({"Ss_Id":{"$in":arr_ssid}}).select("Ss_Id Pan_No Name_On_PAN").exec(function(err,dbPosp_Users){
						if(dbPosp_Users && dbPosp_Users.length > 0){
							if(req.query["dbg"] == 'yes'){
								return res.json(obj_summary);
							}
							else{
								posp_user.updateMany({"PAN": {"$in":arr_IIB_Pan}},{"$set":{ "POSP_UploadedtoIIB": "Yes","POSP_UploadingDateAtIIB": Appointed_On_Format2}}, function (err, dbPosp_User) {
									obj_summary["DB_Status"] = (err) ? "ERR" : "FAIL";
									if(dbPosp_User){
										obj_summary["DB_Detail"] = dbPosp_User;
									}
									return res.json(obj_summary);	
								});								
							}
						}
						else{
							return res.json(obj_summary);
						}	
					});
				}
				else{
					return res.json(obj_summary);	
				}
			});
		}
		else{
			return res.json(obj_summary);
		}				
	});
	app.get('/posps/iib_container/pan_details', function (req, res) {
		let pan = req.query['pan'] || '';
		let ss_id = req.query['ss_id'] || 0;
		ss_id = ss_id - 0;
		let is_ssid_chk_required = "yes";
		let arr_ss_id = [140545,139229];		
		let Used_At = req.query['used_at'] || "ERPCODE";
		pan = pan.trim().toUpperCase();		
		if(arr_ss_id.indexOf(ss_id) > -1){
			is_ssid_chk_required = 'no';
		}
		let obj_response = {
			"ss_id" : ss_id,
			"status" : "FAIL",
			"pan" : pan,
			"pan_uploaded_iib" : "FAIL",
			"pan_match" : "FAIL",
			"ss_id_match" : "FAIL",
			"name_match" : "FAIL",
			"dob_match" : "FAIL",
			"is_ssid_chk_required" : is_ssid_chk_required,
			"iib_detail" : null,
			"pos_detail" : {
				"pos_dob" : null,
				"pos_full_name" : null,
			},
			"message" : null,
			'used_at' : Used_At,
			"iib_container_updated_on" : null
		};
		if(ss_id === 0){
			obj_response = {
				"status" : "FAIL",
				"pan" : pan,
				"pan_uploaded_iib" : "FAIL",
				"iib_detail" : null,
				"message" : null,
				'used_at' : Used_At,
				"iib_container_updated_on" : null,
			};
		}
		if(pan !== ""){
			let Iib_Batch = require('../models/iib_batch');
            Iib_Batch.findOne({}).select('Created_On').sort({'_id': -1}).exec(function (err, DbIib_Batch_Posp) {
				DbIib_Batch_Posp = DbIib_Batch_Posp._doc;
				obj_response["iib_container_updated_on"] = moment(DbIib_Batch_Posp["Created_On"]).format("DD MMMM, YYYY hh:mm:ss");
				let Iib_Posp = require('../models/iib_posp');
				Iib_Posp.findOne({"PAN": pan}).select("PAN DoB_Format AppointmentDate_Format InternalPOSCode POSPFName POSPMName POSPLName").exec(function (err, dbIIB_Pan) {				
					if(dbIIB_Pan){
						dbIIB_Pan = dbIIB_Pan._doc;
						obj_response["iib_detail"] = dbIIB_Pan;					
						obj_response["pan_uploaded_iib"] = "SUCCESS";
						let InternalPOSCode = dbIIB_Pan["InternalPOSCode"] - 0;
						if(ss_id > 0){
							client.get(config.environment.weburl + '/posps/dsas/view/' + ss_id.toString(), {}, function (agent_data, response) {
								try {
									console.error('DBG', 'erp_update_rm', 'step2', agent_data);
									if (agent_data && agent_data['status'] === 'SUCCESS') {
										let pos_data = 	agent_data["POSP_USER"] || null;
										if(pos_data){
											let pos_pan = pos_data["Pan_No"] || "";
											pos_pan = pos_pan.toString().trim().toUpperCase();
											let pos_dob = pos_data["DOB_On_PAN"] || pos_data["Birthdate"];
											if (pos_dob && moment(pos_dob, 'YYYY-MM-DD', true).isValid()) {
												//pos_dob = pos_dob;
											} else if (pos_dob && moment(pos_dob, 'DD-MM-YYYY', true).isValid()) {
												pos_dob = moment(pos_dob, 'DD-MM-YYYY').format("YYYY-MM-DD");
											} else if (pos_dob && moment(pos_dob, 'DD/MM/YYYY', true).isValid()) {
												pos_dob = moment(pos_dob, 'DD/MM/YYYY').format("YYYY-MM-DD");
											} else {
												pos_dob = "";
											}
											pos_data["DOB_On_PAN"] = pos_dob;
											let pos_full_name = pos_data["Name_On_PAN"].toUpperCase();
											let iib_full_name = dbIIB_Pan["POSPFName"] + (dbIIB_Pan["POSPMName"] ? (" " + dbIIB_Pan["POSPMName"]) : "") + (dbIIB_Pan["POSPLName"] ? (" " + dbIIB_Pan["POSPLName"] + " ") : "");
											iib_full_name = iib_full_name.trim().toUpperCase();
											obj_response["pos_detail"]["pos_dob"] = pos_dob;
											obj_response["pos_detail"]["pos_full_name"] = pos_full_name;
											obj_response["iib_detail"]["iib_full_name"] = iib_full_name;
											if(ss_id === InternalPOSCode || InternalPOSCode === 0){
												obj_response["ss_id_match"] = "SUCCESS";											
											}
											if(pan === pos_pan){
												obj_response["pan_match"] = "SUCCESS";											
											}
											if(pos_full_name == iib_full_name){
												obj_response["name_match"] = "SUCCESS";
											}
											if(pos_dob == dbIIB_Pan["DoB_Format"]){
												obj_response["dob_match"] = "SUCCESS";
											}
											if(obj_response["pan_match"] == "SUCCESS" && obj_response["dob_match"] == "SUCCESS" && (obj_response["ss_id_match"] == "SUCCESS" || is_ssid_chk_required == 'no')){
												obj_response["status"] = "SUCCESS";											
											}
										}
									}
								}
								catch(e){
									obj_response["status"] = "EXCEPTION";
									obj_response["message"] = e.stack;																
								}
								var Email_Content = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>POS IIB_CONTAINER NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
								Email_Content += '<p style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">';
								Email_Content += 'IIB CONTAINER PAN CHECK STATUS<br>';
								Email_Content += objectToHtml(obj_response);
								Email_Content += '</p>';
								if(obj_response["iib_detail"] !== null){
									Email_Content += '<p style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">';
									Email_Content += 'PAN IIB DETAILS<br>';
									Email_Content += objectToHtml(obj_response["iib_detail"]);
									Email_Content += '</p>';
								}
								if(obj_response["pos_detail"]["pos_dob"] !== null){
									Email_Content += '<p style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">';
									Email_Content += 'PAN POS DETAILS<br>';
									Email_Content += objectToHtml(obj_response["pos_detail"]);
									Email_Content += '</p>';
								}
								Email_Content += '</body></html>';
								var subject = '[IIB_CONTAINER]['+Used_At+'] PAN_IIB_CHECK-' + obj_response["status"]+",SS_ID-"+ss_id+",On-"+moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
								if(obj_response["status"] === "FAIL"){
									subject = '[IIB_CONTAINER]['+Used_At+'] PAN_IIB_CHECK-' + obj_response["status"]+",POSCODE-"+obj_response["ss_id_match"]+",DOB-"+obj_response["dob_match"]+",NAME-"+obj_response["name_match"]+",SS_ID-"+ss_id+",On-"+moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
								}
								var Email = require('../models/email');
								var objModelEmail = new Email();
								if(obj_response["status"] === "SUCCESS"){	
									objModelEmail.send('noreply@policyboss.com', config.environment.notification_email , subject, Email_Content, "", "", 0,0);				
								}
								else{
									objModelEmail.send('noreply@policyboss.com', "ashish.hatia@policyboss.com,anil.yadav@policyboss.com,nilam.bhagde@policyboss.com,anuj.singh@policyboss.com" , subject, Email_Content, "", config.environment.notification_email, 0,0);				
								}
								return res.json(obj_response);
							});
						}
						else{
							obj_response["status"] = "SUCCESS";
							return res.json(obj_response);
						}					
					}
					else{
						obj_response["status"] = "PAN_NOT_AVAILABLE";
						obj_response["message"] = "PAN_DETAIL_NOT_AVAILABLE";
						var Email_Content = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>POS IIB_CONTAINER NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
						Email_Content += '<p style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">';
						Email_Content += 'IIB CONTAINER PAN CHECK STATUS<br>';
						Email_Content += objectToHtml(obj_response);
						Email_Content += '</p>';					
						Email_Content += '</body></html>';
						var subject = '[IIB_CONTAINER]['+Used_At+'] PAN_IIB_CHECK-' + obj_response["status"]+",SS_ID-"+ss_id+",On-"+moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
						var Email = require('../models/email');
						var objModelEmail = new Email();				
						objModelEmail.send('noreply@policyboss.com', "ashish.hatia@policyboss.com,anil.yadav@policyboss.com" , subject, Email_Content, "", config.environment.notification_email, 0,0);				
						return res.json(obj_response);	
					}
				});
			});
		}
		else{
			obj_response["status"] = "VALIDATION";
			obj_response["message"] = "INVALID_PAN";
			return res.json(obj_response);	
		}	
	});
    app.get('/posps/agent/sync', function (req, res) {
        let arr_agent = {
            'POSP_COUNT': null,
            'FOS_COUNT': null,
            'EMP_COUNT': null,
            'LIST': []
        };
        var User = require('../models/user');
        let obj_emp_list = {};
        User.find(function (err, users) {
            try {
                if (!err && users) {
                    for (let i in users) {
                        let user = users[i]._doc;
                        let UID = user['UID'] - 0;
                        obj_emp_list['UID_' + UID] = user;
                    }
                    for (let i in users) {
                        let user = users[i]._doc;
                        let UID = user['UID'] - 0;
                        let Agent_UID = (user['UID'] && user['UID'] !== null) ? user['UID'] : 0;
                        let RM_Reporting_UID = (user['Direct_Reporting_UID'] && user['Direct_Reporting_UID'] !== null) ? user['Direct_Reporting_UID'] : 0;
                        arr_agent['LIST'].push({
                            'Ss_Id': user['Ss_Id'] - 0,
                            'Fba_Id': user['Fba_Id'] || 0,
                            'Erp_Id': UID,
                            'Type': 'EMPLOYEE',
                            'Channel': user['Dept_Short_Name'],
                            'Name': user['Employee_Name'],
                            'City': (user['Branch'])? user['Branch'].toString().trim().toUpperCase() : 'NA',
							'State': (user['State'])? user['State'].toString().trim().toUpperCase() : 'NA',
                            'Branch': (user['Branch'])? user['Branch'].toString().trim().toUpperCase() : 'NA',
                            'Mobile': (user['Business_Phone_Number'] != '-' && user['Business_Phone_Number'] != '') ? user['Business_Phone_Number'] : user['Phone'],
                            'Email': (user['Official_Email'] != '-' && user['Official_Email'] != '') ? user['Official_Email'] : user['Email'],
                            'RM_Name': (obj_emp_list['UID_' + RM_Reporting_UID]) ? obj_emp_list['UID_' + RM_Reporting_UID]['Employee_Name'] : 'NA',
                            'RM_UID': RM_Reporting_UID,
                            'RM_Branch': (obj_emp_list['UID_' + RM_Reporting_UID]) ? obj_emp_list['UID_' + RM_Reporting_UID]['Branch'] : 'NA',
                            'RM_Reporting_Name': 'NA',
                            'RM_Reporting_UID': 0,
                            'RM_Reporting_Branch': 'NA'
                        });
                    }
                    arr_agent['EMP_COUNT'] = users.length;
                }
                Posp.find({"Erp_Id": {"$nin": ['', null]}, 'Is_Active': true}, function (err, dbPosps) {
                    try {
                        if (dbPosps) {
                            for (let k in dbPosps) {
                                let dbPosp = dbPosps[k]._doc;
                                if (dbPosp['Erp_Id'] && (dbPosp['Erp_Id'] - 0) > 0) {
                                    let Agent_UID = (dbPosp['Reporting_Agent_Uid'] && dbPosp['Reporting_Agent_Uid'] !== null) ? dbPosp['Reporting_Agent_Uid'] : 0;
                                    let RM_Reporting_UID = (obj_emp_list['UID_' + Agent_UID]) ? (obj_emp_list['UID_' + Agent_UID]['Direct_Reporting_UID'] || 0) : 0;
                                    arr_agent['LIST'].push({
                                        'Ss_Id': dbPosp['Ss_Id'] - 0,
                                        'Fba_Id': dbPosp['Fba_Id'] - 0,
                                        'Erp_Id': dbPosp['Erp_Id'] - 0,
                                        'Type': 'POSP',
                                        'Channel': dbPosp['Channel'],
                                        'Name': dbPosp['First_Name'] + ((dbPosp['Last_Name']) ? (' ' + dbPosp['Last_Name']) : '').toUpperCase(),
                                        'City': (dbPosp['Present_City']) ? dbPosp['Present_City'].toString().trim().toUpperCase() : 'NA',
										'State': (dbPosp['Present_State']) ? dbPosp['Present_State'].toString().trim().toUpperCase() : 'NA',
                                        'Branch': (dbPosp['Agent_City']) ? dbPosp['Agent_City'].toString().trim().toUpperCase() : 'NA',
                                        'Mobile': dbPosp['Mobile_No'],
                                        'Email': dbPosp['Email_Id'],
                                        'RM_Name': (obj_emp_list['UID_' + Agent_UID]) ? obj_emp_list['UID_' + Agent_UID]['Employee_Name'] : 'NA',
                                        'RM_UID': Agent_UID,
                                        'RM_Branch': (obj_emp_list['UID_' + Agent_UID]) ? obj_emp_list['UID_' + Agent_UID]['Branch'] : 'NA',
                                        'RM_Reporting_Name': (obj_emp_list['UID_' + RM_Reporting_UID]) ? obj_emp_list['UID_' + RM_Reporting_UID]['Employee_Name'] : 'NA',
                                        'RM_Reporting_UID': RM_Reporting_UID,
                                        'RM_Reporting_Branch': (obj_emp_list['UID_' + RM_Reporting_UID]) ? obj_emp_list['UID_' + RM_Reporting_UID]['Branch'] : 'NA'
                                    });
                                }
                            }
                            arr_agent['POSP_COUNT'] = dbPosps.length;
                            posps_agent_sync_handler(arr_agent, req, res);
                        }
                    } catch (e) {
                        res.send(e.stack);
                    }
                });
                var Employee = require('../models/employee');
                Employee.find({"Role_ID": {$in: Object.keys(config.channel.Const_FOS_Channel).map(Number)}, 'IsActive': 1}, function (err, dbDsas) {
                    try {
                        if (dbDsas) {
                            for (let k in dbDsas) {
                                let dbPosp = dbDsas[k]._doc;
                                if (dbPosp['VendorCode'] && (dbPosp['VendorCode'] - 0) > 0) {
                                    let Agent_UID = (dbPosp['UID'] && dbPosp['UID'] !== null) ? (dbPosp['UID'] || 0) : 0;
                                    let RM_Reporting_UID = (obj_emp_list['UID_' + Agent_UID]) ? (obj_emp_list['UID_' + Agent_UID]['Direct_Reporting_UID'] || 0) : 0;
                                    let Role_ID = dbPosp['Role_ID'] || 0;
                                    arr_agent['LIST'].push({
                                        'Ss_Id': dbPosp['Emp_Id'] - 0,
                                        'Fba_Id': dbPosp['FBA_ID'] - 0,
                                        'Erp_Id': dbPosp['VendorCode'] - 0,
                                        'Type': 'FOS',
                                        'Channel': config.channel.Const_FOS_Channel[Role_ID.toString()] || 'NA',
                                        'Name': dbPosp['Emp_Name'].toUpperCase(),
                                        'City': (dbPosp['Branch']) ? dbPosp['Branch'].toString().trim().toUpperCase() : 'NA',
										'State': (dbPosp['State']) ? dbPosp['State'].toString().trim().toUpperCase() : 'NA',
                                        'Branch': (dbPosp['Branch']) ? dbPosp['Branch'].toString().trim().toUpperCase() : 'NA',
                                        'Mobile': dbPosp['Mobile_Number'],
                                        'Email': dbPosp['Email_Id'],
                                        'RM_Name': (obj_emp_list['UID_' + Agent_UID]) ? obj_emp_list['UID_' + Agent_UID]['Employee_Name'] : 'NA',
                                        'RM_UID': Agent_UID,
                                        'RM_Branch': (obj_emp_list['UID_' + Agent_UID]) ? obj_emp_list['UID_' + Agent_UID]['Branch'] : 'NA',
                                        'RM_Reporting_Name': (obj_emp_list['UID_' + RM_Reporting_UID]) ? obj_emp_list['UID_' + RM_Reporting_UID]['Employee_Name'] : 'NA',
                                        'RM_Reporting_UID': RM_Reporting_UID,
                                        'RM_Reporting_Branch': (obj_emp_list['UID_' + RM_Reporting_UID]) ? obj_emp_list['UID_' + RM_Reporting_UID]['Branch'] : 'NA'
                                    });
                                }
                            }
                            arr_agent['FOS_COUNT'] = dbDsas.length;
                            posps_agent_sync_handler(arr_agent, req, res);
                        }
                    } catch (e) {
                        res.send(e.stack);
                    }
                });
            } catch (e) {
                res.send(e.stack);
            }
        });
    });
    function posps_agent_sync_handler(arr_agent, req, res) {
        try {
            if (arr_agent['EMP_COUNT'] !== null &&
                    arr_agent['POSP_COUNT'] !== null &&
                    arr_agent['FOS_COUNT'] !== null) {
                if (req.query['sync_summary'] === 'yes') {
                    var Agent = require('../models/agent');
                    Agent.remove({}, function (err, DbAgent) {
                        Agent.insertMany(arr_agent['LIST'], function (err, DbAgentInserted) {
                            console.error('DBG', 'DbSync_Contact_Summary', 'save', err);
                            res.json({
                                'Summary': DbAgentInserted.length,
                                'Err': err,
                                'Count': 'EMP-' + arr_agent['EMP_COUNT'] + '-POSP-' + arr_agent['POSP_COUNT'] + '-FOS-' + arr_agent['FOS_COUNT'],
                                'List': arr_agent['LIST'].length
                            });
                        });
                    });
                } else {
                    let arr_agent_summary_final = [];
                    for (let i = 0; i < 50; i++) {
                        arr_agent_summary_final.push(arr_agent['LIST'][i]);
                    }
                    let res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>Followup List</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                    res_report += '<p><h1>CONTACT ERP SYNC REPORT</h1></p>';
                    res_report += arrayobjectToHtml(arr_agent_summary_final, 'Contact Report- Count' + arr_agent['LIST'].length, '', []);
                    res_report += '</p>';
                    res_report += '</body></html>';
                    res.send(res_report);
                }
            }
        } catch (e) {
            res.send(e.stack);
        }
    }
    app.get('/posps/dsas/viewbyfbaid/:fba_id', function (req, res) {
        let fba_id = req.params.fba_id;
        //var Posp = require('../models/posp');
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
    app.get('/posps/rm_mappings/list', LoadSession, function (req, res) {
        let Rm_Mapping = require('../models/rm_mapping');
        let ss_id = req.query['ss_id'] || 0;
        if (ss_id > 0) {
            Rm_Mapping.find({"ss_id": (ss_id - 0)}).select().sort({'Modified_On': -1}).exec(function (err, dbRmMappings) {
                try {
                    if (err) {
                        res.send(err);
                    } else {
                        res.json(dbRmMappings);
                    }
                } catch (e) {
                    res.send(e.stack);
                }
            });
        } else {
            res.send("Invalid Ss_Id");
        }
    });
	app.get('/posps/rm_mapping/update_ver2', LoadSession, function (req, res, next) {	
		var today_str_1 = moment().utcOffset("+05:30").format("YYYYMMD");
		let logged_in_user = (req.obj_session) ? (req.obj_session.user.fullname + '(ss_id:' + req.obj_session.user.ss_id + ')'):'SYSTEM';
		let ss_id = req.query['ss_id'] || 0;
		ss_id = ss_id - 0;
		let rm_uid = req.query['rm_uid'] || 0;		
		rm_uid = rm_uid - 0;
		let row = {
			'ss_id' : ss_id,
			'rm_uid' : rm_uid,
			'remark' : req.query['remark']
		};
		let obj_status = {
			'On' : (new Date()).toLocaleString(),
			'Status': 'pending',
			'Msg': null,
			'Detail': null,			
			'RM_History_Status': 'pending',
			'RM_History_Msg': null,
			'RM_History_Detail': null,
			'RM_Mapping_Status': 'pending',
			'RM_Mapping_Msg': null,
			'RM_Mapping_Detail': null
		};
		if (ss_id > 0 && rm_uid > 0 && rm_uid.toString().length == 6 && rm_uid.toString().charAt(0) == '1') {
			let obj_rm_mapping = {
				'Camp_Name': 'RM_MAPPING',
				'Channel': '',
				'agent_type' : '',
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
				'session_id': req.query['session_id'] || 'NA',
				'remark': row['remark'],
				'Posp_Stage' : '',
				'Ip_Address' : req.pbIp || '',
				'Created_By': logged_in_user,
				'Created_On': new Date(),
				'Modified_On': new Date()
			};			
			client.get(config.environment.weburl + '/posps/dsas/view/' + row['ss_id'], {}, function (data, response) {
				if (data['status'] === 'SUCCESS' && ['POSP', 'FOS','MISP'].indexOf(data.user_type) > -1) {
					let channel = data.channel;
					obj_rm_mapping['Channel'] = channel;
					obj_rm_mapping['agent_type'] = data.user_type;
					obj_rm_mapping['agent_name'] = (data.user_type === 'POSP') ? data['POSP']['First_Name'] + ' ' + data['POSP']['Last_Name'] : data['EMP']['Emp_Name'];
					obj_rm_mapping['agent_email'] = (data.user_type === 'POSP') ? data['POSP']['Email_Id'] : data['EMP']['Email_Id'];
					obj_rm_mapping['agent_city'] = (data.user_type === 'POSP') ? data['POSP']['Agent_City'] : data['EMP']['Branch'];
					obj_rm_mapping['fba_id'] = (data.user_type === 'POSP') ? data['POSP']['Fba_Id'] : data['EMP']['FBA_ID'];
					let Rm_Mapping = require('../models/rm_mapping');					
					Rm_Mapping.findOne({"ss_id": ss_id}).select().sort({'Modified_On': -1}).exec(function (err, dbRmMapping) {
						dbRmMapping = (dbRmMapping) ? dbRmMapping._doc : null;
						if(dbRmMapping && dbRmMapping.hasOwnProperty('Posp_Stage')){
							obj_rm_mapping['current_rm_uid'] = dbRmMapping['new_rm_uid'];
							obj_rm_mapping['current_rm_name'] = dbRmMapping['new_rm_name'];
							obj_rm_mapping['current_rm_vertical'] = dbRmMapping['Vertical'] || 'NA';
							obj_rm_mapping['current_rm_subvertical'] = dbRmMapping['new_rm_subvertical'] || 'NA';
						}
						else{
							obj_rm_mapping['current_rm_uid'] = (data['RM'] && data['RM']['rm_details'])? data['RM']['rm_details']['uid'] : 0;
							obj_rm_mapping['current_rm_name'] = (data['RM'] && data['RM']['rm_details'])? data['RM']['rm_details']['name'] : 'NA';
							obj_rm_mapping['current_rm_vertical'] = (data['RM'] && data['RM']['rm_details'])? data['RM']['rm_details']['vertical'] : 'NA';
							obj_rm_mapping['current_rm_subvertical'] = (data['RM'] && data['RM']['rm_details'])? data['RM']['rm_details']['sub_vertical'] : 'NA';
						}						
						//var User = require('../models/user');
						//User.findOne({"UID": row['rm_uid'] -0}, function (err, dbUser) {
						client.get(config.environment.weburl + '/posps/rm_details/' + row['rm_uid'].toString(), {}, function (rm_details_data, rm_details_response) {
							try {
								if (rm_details_data && rm_details_data['rm_details']) {
									let new_rm_data = rm_details_data['rm_details'];
									let new_rm_plus_one_data = rm_details_data['rm_reporting_details'] || {};
									let new_rm_plus_two_data = rm_details_data['rm_reporting_two_details'] || {};
									obj_rm_mapping['new_rm_name'] = new_rm_data['name'];
									obj_rm_mapping['new_rm_mobile'] = new_rm_data['mobile'];
									obj_rm_mapping['new_rm_email'] = new_rm_data['email'];
									obj_rm_mapping['new_rm_subvertical'] = new_rm_data['sub_vertical'].toUpperCase();
									obj_rm_mapping['new_rm_one_name'] = new_rm_plus_one_data['name'] || 'NA';
									obj_rm_mapping['new_rm_one_uid'] = new_rm_plus_one_data['uid'] || 0;
									obj_rm_mapping['new_rm_two_name'] = new_rm_plus_two_data['name'] || 'NA';
									obj_rm_mapping['new_rm_two_uid'] = new_rm_plus_two_data['uid'] || 0;
									obj_rm_mapping['Posp_Stage'] = 'BUSINESS'; 
									if(['POSP_RECRUITMENT','POSP_ACTIVATION','POSP_REACTIVATION'].indexOf(obj_rm_mapping['new_rm_subvertical']) > -1){
										obj_rm_mapping['Posp_Stage'] = obj_rm_mapping['new_rm_subvertical'];
									}									
									obj_rm_mapping['Vertical'] = new_rm_data['vertical'];
									obj_rm_mapping['Sub_Vertical'] = new_rm_data['sub_vertical'];
									let objModelRm_Mapping = new Rm_Mapping(obj_rm_mapping);
									objModelRm_Mapping.save(function (Err_Rm_Mapping, objDbRm_Mapping) {
										try{
											if (Err_Rm_Mapping) {
												obj_status['RM_History_Status'] = 'DB_ERR';
												obj_status['RM_History_Detail'] = obj_rm_mapping;											
												obj_status['RM_History_Msg'] = Err_Rm_Mapping;
												fs.appendFile(appRoot + "/tmp/log/rm_mapping_update_ver2_" + today_str_1 + ".log", JSON.stringify(obj_status) + "\r\n", function (err) {});	
												return res.json(obj_status);
											} else {
												//update mapping start
												let objRmMapping = obj_rm_mapping;
												let objMappingData = {
													"ss_id": objRmMapping['ss_id'],
													"fba_id": objRmMapping['fba_id'],
													"Reporting_Agent_Name": objRmMapping['new_rm_name'],
													"Reporting_Agent_UID": objRmMapping['new_rm_uid'],
													"Reporting_Email_ID": objRmMapping['new_rm_email'],
													"Reporting_Mobile_Number": objRmMapping['new_rm_mobile'],
													"mapped_by": logged_in_user,
													'mode': 'SINGLE',
													"Remarks": objRmMapping['remark'] || 'NA'
												};
												let dsa_posp_update_rm_args = {
													data: objMappingData,
													headers: {"Content-Type": "application/json"}
												};
												let objMappingEmailSummary = {
													'Agent': obj_rm_mapping['agent_name'] + '::SSID-' + obj_rm_mapping['ss_id'],
													'Channel': obj_rm_mapping['Channel'],
													'Posp_Stage' : obj_rm_mapping['Posp_Stage'],
													'Reporting_Manager_Name': obj_rm_mapping['new_rm_name'] + '::UID-' + obj_rm_mapping['new_rm_uid'],
													'Reporting_Manager_Email': obj_rm_mapping['new_rm_email'],
													'Reporting_Manager_Mobile': obj_rm_mapping['new_rm_mobile'],
													'Business_Vertical': obj_rm_mapping['Vertical'] + '-' +obj_rm_mapping['Sub_Vertical'],
													'Mapping_By': obj_rm_mapping['Created_By']
												};
												if(typeof obj_rm_mapping['current_rm_subvertical'] !== 'undefined' && obj_rm_mapping['current_rm_subvertical'] != 'NA' && obj_rm_mapping['current_rm_subvertical'].toUpperCase() !== obj_rm_mapping['new_rm_subvertical'].toUpperCase()){
													objMappingEmailSummary['Business_Old_Vertical'] = obj_rm_mapping['current_rm_subvertical'];
													objMappingEmailSummary['Vertical_Change'] = 'YES';
													//cc.push('posp.ops@policyboss.com');
												}
												objMappingEmailSummary['Ip_Address'] = obj_rm_mapping['Ip_Address'];
												client.post(config.environment.weburl + '/posps/dsa_posp_update_rm?dbg=no', dsa_posp_update_rm_args, function (mapping_data, mapping_response) {
													try{
														let Email = require('../models/email');
														let objModelEmail = new Email();
														obj_status['RM_Mapping_Status'] = 'FAIL';
														if (mapping_data){ 
															if(mapping_data['posp_status'] === 'SUCCESS') {
																obj_status['RM_Mapping_Status'] = 'SUCCESS';
																obj_status['Status'] = 'SUCCESS';																
																
																/*
																var cc = [objRmMapping['new_rm_email'].toString().toLowerCase()];
																var rm_notification = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>RM MAPPING NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
																rm_notification += '<p style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">Dear ' + objRmMapping['agent_name'] + ',<br>';
																rm_notification += 'Your Relationship Manager is updated. Now <b><u>' + objRmMapping['new_rm_name'] + '</u></b> is assigned to you as new Relationship Manager.<BR>Following is  details. For any query, Kindly contact your Reporting Manager.<br><br>';
																rm_notification += objectToHtml(objMappingEmailSummary);
																rm_notification += '</p>';
																rm_notification += '</body></html>';
																var subject = '[POSP][RM-MAPPING-UPDATE] Business Vertical :: '+objMappingEmailSummary['Business_Vertical']+',Agent :: ' + objMappingEmailSummary['Agent'];
																var to = objRmMapping['agent_email'].toString().toLowerCase();																	
																cc.push(new_rm_plus_one_data['email']);
																if(new_rm_plus_two_data && new_rm_plus_two_data['email']){
																	cc.push(new_rm_plus_two_data['email']);
																}
																cc.push('posp.ops@policyboss.com');
																objModelEmail.send('notifications@policyboss.com', to, subject, rm_notification, cc.join(','), config.environment.notification_email);
																//signup rm notification start
																if(objMappingEmailSummary["Mapping_By"] === "SYSTEM"){
																	//client.get(config.environment.weburl + '/posps/report/posp_onboarding_notification_rm?email=yes&email_type=SIGNUP&ss_id='+obj_rm_mapping['ss_id'], {}, function (rmdata, rmresponse) {});
																}
																//signup rm notification finish
																*/
																client.get(config.environment.weburl + '/posps/report/email_consolidate_process?ss_id='+obj_rm_mapping['ss_id']+'&event_type=RM_UPDATED', {}, function (rmdata, rmresponse) {});	
																
															}
															else{
																
															}		
															obj_status['RM_Mapping_Detail'] = mapping_data;
														}
														obj_status['Detail'] = obj_rm_mapping;
														
														if(obj_status['Status'] !== 'SUCCESS'){
															var rm_notification = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>RM MAPPING NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
															rm_notification += '<p><pre>' + JSON.stringify(obj_status, undefined, 2) + '</pre><p>';
															rm_notification += '</body></html>';
															var subject = '[MAPPING_ERR][POSP][RM-MAPPING-UPDATE] Business Vertical :: '+objMappingEmailSummary['Business_Vertical']+',Agent :: ' + objMappingEmailSummary['Agent'];
															objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, subject, rm_notification, '', '');
														}
														fs.appendFile(appRoot + "/tmp/log/rm_mapping_update_ver2_" + today_str_1 + ".log", JSON.stringify(obj_status) + "\r\n", function (err) {});	
														return res.json(obj_status);
													}
													catch(e){
														obj_status['Exception'] = e.stack
														fs.appendFile(appRoot + "/tmp/log/rm_mapping_update_ver2_" + today_str_1 + ".log", JSON.stringify(obj_status) + "\r\n", function (err) {});	
														return res.json(obj_status);
													}	
												});
												//update mapping stop
											}
										}
										catch (e) {
											obj_status['Detail'] = obj_rm_mapping;
											obj_status['Status'] = 'EXCEPTION';
											obj_status['Msg'] = e.stack;
											fs.appendFile(appRoot + "/tmp/log/rm_mapping_update_ver2_" + today_str_1 + ".log", JSON.stringify(obj_status) + "\r\n", function (err) {});	
											return res.json(obj_status);
										}	
									});
								} else {
									obj_status['Detail'] = obj_rm_mapping;	
									obj_status['Status'] = 'VALIDATION';
									obj_status['Msg'] = 'INVALID_RM';
									fs.appendFile(appRoot + "/tmp/log/rm_mapping_update_ver2_" + today_str_1 + ".log", JSON.stringify(obj_status) + "\r\n", function (err) {});	
									return res.json(obj_status);
								}
							} catch (e) {
								obj_status['Detail'] = obj_rm_mapping;
								obj_status['Status'] = 'EXCEPTION';
								obj_status['Msg'] = e.stack;
								fs.appendFile(appRoot + "/tmp/log/rm_mapping_update_ver2_" + today_str_1 + ".log", JSON.stringify(obj_status) + "\r\n", function (err) {});	
								return res.json(obj_status);
							}
						});
					});
				} else {
					obj_status['Detail'] = obj_rm_mapping;	
					obj_status['Status'] = 'VALIDATION';
					obj_status['Msg'] = 'INVALID_AGENT';
					fs.appendFile(appRoot + "/tmp/log/rm_mapping_update_ver2_" + today_str_1 + ".log", JSON.stringify(obj_status) + "\r\n", function (err) {});	
					return res.json(obj_status);
				}
			});
		} else {
			obj_status['Status'] = 'VALIDATION';
			obj_status['Msg'] = 'INVALID_IDS';
			return res.json(obj_status);
		}		
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
                            //let Client = require('node-rest-client').Client;
                            //let client = new Client();
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
                                    'mode': 'BULK',
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
                                    sleep(300);
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
                                        fs.appendFile(appRoot + "/tmp/log/rm_mapping_update_" + today_str_1 + ".log", JSON.stringify(objRequest) + "\r\n", function (err) {});
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
            if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1 || req.obj_session.user.role_detail.role.indexOf('Recruiter') > -1 || req.obj_session.user.ss_id == 7644) {
                allowed_channel = 'ALL';
            } else if (req.obj_session.user.role_detail.role.indexOf('ChannelHead') > -1 && req.obj_session.user.role_detail.channel_list.indexOf('GS') > -1) {
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
                                                                                        if (obj_rm_mapping['new_rm_uid'] == obj_rm_mapping['current_rm_uid'] && false) {
                                                                                            obj_data_validation['SameMappingAlready']++;
                                                                                            obj_data_validation['SameMappingAlready_List'].push(row['ss_id']);
                                                                                            obj_data_validation['Process']++;
                                                                                            rm_mapping_upload_handler(obj_data_validation, obj_status, res);
                                                                                        } else {
                                                                                            client.get(config.environment.weburl + '/pb_employees/list?q=' + row['rm_uid'], {}, function (data, response) {
                                                                                                try {
                                                                                                    if (typeof data[0] !== 'undefined') {
                                                                                                        obj_rm_mapping['new_rm_name'] = data[0]['Employee_Name'];

                                                                                                        obj_rm_mapping['new_rm_mobile'] = (data[0]['Business_Phone_Number'] && data[0]['Business_Phone_Number'] != '-') ? data[0]['Business_Phone_Number'] : data[0]['Phone'];
                                                                                                        obj_rm_mapping['new_rm_email'] = (data[0]['Official_Email'] && data[0]['Official_Email'] != '-') ? data[0]['Official_Email'] : data[0]['Email'];
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
                                                                            rm_mapping_upload_handler(obj_data_validation, obj_status, res);
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

        var msg = '<div class="report" ><span  style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">Report</span><table style="-moz-box-shadow: 1px 1px 3px 2px #d3d3d3;-webkit-box-shadow: 1px 1px 3px 2px #d3d3d3;  box-shadow:         1px 1px 3px 2px #d3d3d3;" border="1" cellpadding="3" cellspacing="0" width="95%"  >';
        var row_inc = 0;
        for (var k in objSummary) {
            if (row_inc === 0) {
                msg += '<tr>';
                msg += '<th style="font-size:12px;font-family:\'Google Sans\' ,tahoma;background-color: lightsalmon">Details</th>';
                msg += '<th style="font-size:12px;font-family:\'Google Sans\' ,tahoma;background-color: lightsalmon">Value</th>';
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
        msg += '<table style="-moz-box-shadow: 1px 1px 3px 2px #d3d3d3;-webkit-box-shadow: 1px 1px 3px 2px #d3d3d3;  box-shadow:         1px 1px 3px 2px #d3d3d3;" border="1" cellpadding="3" cellspacing="0" width="95%"  >';
        var row_inc = 0;
        for (var k in objSummary) {
            if (row_inc === 0) {
                msg += '<tr>';
                for (var k_head in objSummary[k]) {
                    if (ColumnToExclude.indexOf(k_head) < 0) {
                        msg += '<th style="font-size:12px;font-family:\'Google Sans\' ,tahoma;background-color: lightsalmon;text-align:center;"  align="center">' + k_head + '</th>';
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
			//console.error("DBG",objAgent["Ss_Id"],"POSP",((objAgent['POSP'] !== null)? "Y":"N"),"EMP",((objAgent['EMP'] !== null)? "Y":"N"),"SYNC_CONTACT",((objAgent['SYNC_CONTACT'] !== null)? "Y":"N"),"DEVICE",((objAgent['DEVICE'] !== null)? "Y":"N"),"INSURANCE",((objAgent['INSURANCE'] !== null)? "Y":"N"),"SYNC_CONTACT_LEAD_PURCHASE",((objAgent['SYNC_CONTACT_LEAD_PURCHASE'] !== null)? "Y":"N"),"MAPPING_HISTORY",((objAgent['MAPPING_HISTORY'] !== null)? "Y":"N"),"HR",((objAgent['HR'] !== null)? "Y":"N"));
            if (objAgent['POSP'] !== null && 
			objAgent['EMP'] !== null && 			
			objAgent['SYNC_CONTACT'] !== null && 
			objAgent['DEVICE'] !== null &&
			objAgent['INSURANCE'] !== null &&
			objAgent['SYNC_CONTACT_LEAD_PURCHASE'] !== null &&
			objAgent['MAPPING_HISTORY'] !== null &&
			objAgent['HR'] !== null
			 ) {
				//console.error("DBG",objAgent["Ss_Id"],"STEP-1"); 
				if(objAgent['HR'] !== "NA"){
					objAgent['user_type'] = 'EMP';
					//console.error("DBG",objAgent["Ss_Id"],"STEP-1-1");
				}
				else{	
					if (objAgent['EMP'] !== 'NA' && objAgent['POSP']['IsFOS'] == 1 && Object.keys(config.channel.Const_FOS_Channel).indexOf(objAgent['EMP']['Role_ID'].toString()) > -1) { //28 - MISP
						objAgent['user_type'] = 'FOS';					
					} else if (objAgent['EMP'] !== 'NA' && [28].indexOf(objAgent['EMP']['Role_ID'] - 0) > -1) { //28 - MISP
						objAgent['user_type'] = 'MISP';
					} else if (objAgent['EMP'] !== 'NA' && [35].indexOf(objAgent['EMP']['Role_ID'] - 0) > -1) {
						objAgent['user_type'] = 'INS';
					} else if (objAgent['POSP'] !== 'NA' && Object.keys(config.channel.Const_POSP_Channel).indexOf(objAgent['POSP']['Sources']) > -1) {
						objAgent['user_type'] = 'POSP';
					}
					//console.error("DBG",objAgent["Ss_Id"],"STEP-1-2");
				}
				//console.error("DBG",objAgent["Ss_Id"],"STEP-2");
                let channel = 'NA';
                let rm_uid = 0;
				
                
                /*if (objAgent['user_type'] == 'EMP') {
                    channel = (objAgent['EMP']['Role_ID'] == '30') ? 'RBS' : 'PBS';
                    //rm_uid = objAgent['EMP']['UID'];
                }
                if (objAgent['user_type'] == 'MISP') {
                    channel = 'MISP';
                    //rm_uid = objAgent['EMP']['UID'];
                }*/
				if(objAgent['user_type'] !== ''){
					if(objAgent['user_type'] == 'POSP' || objAgent['user_type'] == 'FOS'){						
						if(objAgent['MAPPING_HISTORY'] !== "NA" && objAgent['MAPPING_HISTORY'] && objAgent['MAPPING_HISTORY'].hasOwnProperty("new_rm_uid") === true && (objAgent['MAPPING_HISTORY']['new_rm_uid'] - 0) > 0){
							rm_uid = objAgent['MAPPING_HISTORY']['new_rm_uid'];	
						}
						else{
							rm_uid = objAgent['POSP']['Reporting_Agent_Uid'] || 0;
						}
						
						
						if (objAgent['user_type'] == 'POSP') {
							channel = config.channel.Const_POSP_Channel[objAgent['POSP']['Sources']];
						}
						if (objAgent['user_type'] == 'FOS') {
							channel = config.channel.Const_FOS_Channel[objAgent['EMP']['Role_ID']];
						}
					}
					if(objAgent['user_type'] == 'EMP'){
						rm_uid = objAgent['HR']['UID'] || 0;					
						channel = 'PBS';
					}
					if(objAgent['user_type'] == 'MISP'){
						rm_uid = objAgent['EMP']['UID'] || 0;
						channel = 'MISP';
					}
					rm_uid = rm_uid - 0;
					objAgent['channel'] = channel;
					objAgent['status'] = 'SUCCESS';
					//console.error("DBG",objAgent["Ss_Id"],objAgent['user_type'],"STEP-3",rm_uid);
					if (req.query['field'] === 'channel') {
						return res.send(channel);
					} else {
						let is_cache_eligible = true;
						if(objAgent["user_type"] == "POSP" && objAgent["POSP"]["Erp_Id"] == ""){
							is_cache_eligible = false;
						}
						if (rm_uid && rm_uid > 0) { 							
							client.get(config.environment.weburl + '/posps/rm_details/' + rm_uid.toString(), {}, function (rm_data, response) {
								objAgent['RM'] = rm_data || {};
								if(is_cache_eligible === true){
									fs.writeFile(objAgent["Cache_Key"], JSON.stringify(objAgent), function (err) {});
								}								
								return res.json(objAgent);								
								/*try{
									objAgent['RM'] = rm_data || {};							
									return res.json(objAgent);
								}catch (e) {
									objAgent['status'] = 'EXCEPTION';
									objAgent['error'] = e.stack;
									console.error("EXCEPTION",'posps_dsas_view_handler', objAgent, e.stack);
									return res.json(objAgent);
								}*/
							});
						} else {
							if(is_cache_eligible === true){
								fs.writeFile(objAgent["Cache_Key"], JSON.stringify(objAgent), function (err) {});
							}	
							return res.json(objAgent);
						}
					}
				}
				else{
					//console.error("DBG",objAgent["Ss_Id"],"STEP-7");
					objAgent['status'] = 'FAIL';
					return res.json(objAgent);
				}
            }
        } catch (e) {
			//console.error("DBG",objAgent["Ss_Id"],"STEP-6");
			objAgent['status'] = 'EXCEPTION';
			objAgent['error'] = e.stack;
            console.error("EXCEPTION",'posps_dsas_view_handler', objAgent, e.stack);
            return res.json(objAgent);
        }
		
    }
    function ReportingUpdateEmailSend(obj_email) {
        var Email = require('../models/email');
        let objModelEmail = new Email();
        let sub = (config.environment.name.toString() === 'Production' ? "" : ('[' + config.environment.name.toString().toUpperCase() + ']')) + '[' + obj_email['status'] + '] REPORTING_MANAGER_UPDATION, SS_ID : ' + obj_email['ss_id'] + ' , FBA_ID : ' + obj_email['fba_id'];
        let arr_to = ['posp.ops@policyboss.com'];
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
                //arr_cc.push('transactions.1920@gmail.com');
                //arr_cc.push('srinivas@policyboss.com');
                arr_cc.push('coordinator@magicfinmart.com');
            }
            if (Sources === 2 || Sources === 15) {
                arr_cc.push('kevin.menezes@policyboss.com');
            }
            if (Sources === 8 || Sources === 16) {
                arr_cc.push('gagandeep.singh@policyboss.com');
                arr_cc.push('saroj.singh@policyboss.com');
            }
            if (Sources === 11 || Sources === 18) {
                //arr_cc.push('kevin.menezes@policyboss.com');                
            }
            if (Sources === 11) {
                //arr_cc.push('kevin.menezes@policyboss.com');               
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
                var arr_uid_final = [];
                if (uid.toString().charAt(0) === '1') {
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

                    if (arr_emp.length > 0) {
                        for (var i in arr_emp) {
                            if ((arr_emp[i] - 0) > 0) {
                                arr_uid_final.push(arr_emp[i] - 0);
                            }
                        }
                    }
                }
                //obj_agent_summary.Team.CSE_UID = arr_uid_final;
                arr_uid_final.push(uid);
                //console.error('AgentListSS', arr_uid_final);
                // obj_agent_summary.Profile['Children'] = arr_uid_final;
                //var Posp = require('../models/posp');
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
                Employee.find({"Role_ID": {$in: Object.keys(config.channel.Const_FOS_Channel).map(Number)}, "UID": {$in: arr_uid_final}, 'IsActive': 1}, function (err, dbAgents) {
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
                if (uid.toString().charAt(0) === '1') {
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
                } else {
                    var arr_rm_ssid = [];
                    var arr_rm_ssid_direct = [];
                    obj_agent_summary.Team.CSE = arr_rm_ssid;
                    obj_agent_summary.Direct.CSE = arr_rm_ssid_direct;
                    GetReportingAssignedAgent_Handler(uid, obj_agent_summary, res);
                }
            });
        } catch (e) {
            console.error('Exception', 'GetReportingAssignedAgent', e);
            return next();
        }
    }
	function GetReportingAssignedAgent_Ver2(uid, res) {
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
			var Obj_User_Condition = {
				"$or": [
					{'UID': uid},
					{'Reporting_One_UID': uid},
					{'Reporting_Two_UID': uid},
					{'Reporting_Three_UID': uid},
					{'Reporting_Four_UID': uid}
				]
			};
            User.find(Obj_User_Condition).exec(function (err, users) {
                if (err){
                    return res.send(err);
				}
                var empData = users;
                var objKey = uid;
                var employees = "";
                var emap_pid;
                var arr_all_emp = [];
                var arr_all_sub_reporting = [];
                var arr_uid_final = [];
				let arr_cse_ssid = [];
				let arr_cse_ssid_direct = [];
                if (uid.toString().charAt(0) === '1') {
                    for (let i = 0; i < empData.length; i++) {
                        let tuid = empData[i]._doc['UID'] - 0;
						let tssid = empData[i]._doc['Ss_Id'] - 0;						
						if (tuid == uid) {
                            obj_agent_summary.Profile = empData[i]._doc;
                        }
						else{
							arr_cse_ssid.push(tssid);							
						}	
						arr_uid_final.push(tuid);
                    }
                }
                arr_uid_final.push(uid);
				obj_agent_summary.Team.CSE = arr_cse_ssid;
				obj_agent_summary.Direct.CSE = arr_cse_ssid_direct;
				GetReportingAssignedAgent_Handler(uid, obj_agent_summary, res);
                //console.error('AgentListSS', arr_uid_final);
                Posp.find({"Reporting_Agent_Uid": {$in: arr_uid_final}, 'Is_Active': true}, function (err, dbAgents) {
                    let arr_posp_ssid = [];
                    let arr_posp_ssid_direct = [];
                    if (err) {
                    } else {
                        if (dbAgents) {
                            for (let k in dbAgents) {
                                arr_posp_ssid.push(dbAgents[k]._doc['Ss_Id']);
                                //console.error('POSPMATCH', uid, dbAgents[k]._doc['Reporting_Agent_Uid']);
                                if (uid == dbAgents[k]._doc['Reporting_Agent_Uid']) {
                                    arr_posp_ssid_direct.push(dbAgents[k]._doc['Ss_Id']);
                                }

                            }
                        }
                    }
                    obj_agent_summary.Direct.POSP = arr_posp_ssid_direct;
                    obj_agent_summary.Team.POSP = arr_posp_ssid;
                    GetReportingAssignedAgent_Handler(uid, obj_agent_summary, res);
                });
                var Employee = require('../models/employee');
                Employee.find({"Role_ID": {$in: Object.keys(config.channel.Const_FOS_Channel).map(Number)}, "UID": {$in: arr_uid_final}, 'IsActive': 1}, function (err, dbAgents) {
                    let arr_fos_ssid = [];
                    let arr_fos_ssid_direct = [];
                    if (err) {
                    } else {
                        if (dbAgents) {
                            for (let k in dbAgents) {
                                arr_fos_ssid.push(dbAgents[k]._doc['Emp_Id']);
                                if (uid == dbAgents[k]._doc['UID']) {
                                    arr_fos_ssid_direct.push(dbAgents[k]._doc['Emp_Id']);
                                }
                            }
                        }
                    }
                    obj_agent_summary.Team.DSA = arr_fos_ssid;
                    obj_agent_summary.Direct.DSA = arr_fos_ssid_direct;
                    GetReportingAssignedAgent_Handler(uid, obj_agent_summary, res);
                });
            });
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
            /*fs.writeFile(appRoot + "/tmp/cachemaster/user_team_" + uid + "_" + current_date + ".log", JSON.stringify(obj_agent_summary), function (err) {
                if (err) {
                    return console.error(err);
                }
            });*/
            res.json(obj_agent_summary);
        }
    }
    app.get('/posps/dsas/list_by_rmid/:rm_uid', function (req, res) {
        let rm_uid = req.params.rm_uid - 0;
        //var Posp = require('../models/posp');
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
        Employee.find({"UID": rm_uid, 'Role_ID': {$in: Object.keys(config.channel.Const_FOS_Channel).map(Number)}, 'IsActive': 1}).select('FBA_ID Emp_Id Email_Id Emp_Name VendorCode').exec(function (err, dbEmployee) {
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
    function posps_rm_details_handler(req, res, obj_rm) {
        if (obj_rm['status'] === 'SUCCESS' && obj_rm['rm_details']['rm_reporting_uid'] && obj_rm['rm_details']['rm_reporting_uid'] > 0) {
            var User = require('../models/user');
            User.findOne({"UID": obj_rm['rm_details']['rm_reporting_uid']}, function (err, dbUser) {
                if (dbUser) {
                    dbUser = dbUser._doc;
                    obj_rm['status'] = 'SUCCESS';

                    obj_rm['rm_reporting_details'] = {
                        'ss_id': dbUser['Ss_Id'] - 0,
                        'name': dbUser['Employee_Name'],
						'designation' : dbUser['Designation'],
                        'uid': dbUser['UID'],
                        'mobile': (dbUser['Business_Phone_Number'] && isNaN(dbUser['Business_Phone_Number']) === false) ? dbUser['Business_Phone_Number'] : dbUser['Phone'],
                        'email': (dbUser['Official_Email'] && dbUser['Official_Email'].indexOf('@') > -1) ? dbUser['Official_Email'] : dbUser['Email'],
                        'agent_city': dbUser['Branch'],
						'direct_reporting_uid' : dbUser['Direct_Reporting_UID']
                    };
					if(isNaN(obj_rm['rm_reporting_details']["mobile"]) === true){
						obj_rm['rm_reporting_details']["mobile"] = 0;
					}
					if(dbUser['Direct_Reporting_UID'] > 0){
						User.findOne({"UID": dbUser['Direct_Reporting_UID']}, function (err, dbUser) {
							if (dbUser) {
								dbUser = dbUser._doc;
								obj_rm['status'] = 'SUCCESS';
								obj_rm['rm_reporting_two_details'] = {
									'ss_id': dbUser['Ss_Id'] - 0,
									'name': dbUser['Employee_Name'],
									'designation' : dbUser['Designation'],
									'uid': dbUser['UID'],
									'mobile': (dbUser['Business_Phone_Number'] && isNaN(dbUser['Business_Phone_Number']) === false) ? dbUser['Business_Phone_Number'] : dbUser['Phone'],
									'email': (dbUser['Official_Email'] && dbUser['Official_Email'].indexOf('@') > -1) ? dbUser['Official_Email'] : dbUser['Email'],
									'agent_city': dbUser['Branch'],
									'direct_reporting_uid' : dbUser['Direct_Reporting_UID']
								};
								if(isNaN(obj_rm['rm_reporting_two_details']["mobile"]) === true){
									obj_rm['rm_reporting_two_details']["mobile"] = 0;
								}
							}
							return res.json(obj_rm);
						});
					}
					else{
						return res.json(obj_rm);
					}
                }
				else{
					return res.json(obj_rm);	
				}
                
            });
        } else {
            return res.json(obj_rm);
        }
    }
    app.get('/posps/fos_details/:fos_code', function (req, res) {
        let fos_code = req.params.fos_code ? req.params.fos_code - 0 : 0;
        if (fos_code > 0) {
            var Employee = require('../models/employee');
            Employee.findOne({"Role_ID": {$in: Object.keys(config.channel.Const_FOS_Channel).map(Number)}, "VendorCode": fos_code, 'IsActive': 1}, function (err, dbFos) {
                dbFos = dbFos || {};
                res.json(dbFos);
            });
        } else {
            res.json({});
        }
    });
    app.get('/posps/get_erp_fos_code_by_pan/:fos_pan', function (req, res) {
        var objBase = new Base();
        let obj_fos_data = {
            'status': 'PENDING',
            'msg': 'PENDING',
            'data': {}
        };
        let fos_code = '';
        let fos_pan = req.params.fos_pan ? req.params.fos_pan.toString() : '';
        if (fos_pan && fos_pan !== '' && fos_pan.length === 10 && validatePan(fos_pan)) {
            var Employee = require('../models/employee');
            Employee.findOne({"Role_ID": {$in: Object.keys(config.channel.Const_FOS_Channel).map(Number)}, "Pan": fos_pan, 'IsActive': 1}, function (err, dbFos) {
                try {
                    if (dbFos) {
                        dbFos = dbFos._doc;
                        fos_code = dbFos.VendorCode;
                        obj_fos_data = {
                            'status': 'FAIL',
                            'msg': 'FOS CODE ' + fos_code + ' IS FOR PAN ' + fos_pan + '. FOS CODE IS ALREADY ACTIVE WITH SSID - ' + dbFos.Emp_Id,
                            'data': dbFos
                        };
                        res.json(obj_fos_data);
                    } else {
                        /*obj_fos_data = {
                         'status' : 'SUCCESS',
                         'msg' : 'FOS CODE '+fos_code+' IS RECEIVED FOR PAN '+fos_pan+'. FOS CODE IS AVAILABLE FOR ACTIVATEION',
                         'data' : dbFos
                         };*/
                        //let Client = require('node-rest-client').Client;
                        //let client = new Client();
                        let args = {
                            requestConfig: {
                                timeout: 5000, //request timeout in milliseconds
                                noDelay: true, //Enable/disable the Nagle algorithm
                                keepAlive: true, //Enable/disable keep-alive functionalityidle socket.
                                keepAliveDelay: 5000 //and optionally set the initial delay before the first keepalive probe is sent
                            },
                            responseConfig: {
                                timeout: 5000 //response timeout
                            }
                        };
                        let request_fos = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">\n\
<Body>\n\
<ValidatePANNo xmlns="http://tempuri.org/">\n\
<panno>' + fos_pan + '</panno>\n\
</ValidatePANNo>\n\
</Body>\n\
</Envelope>';
                        let postRequest = {
                            host: "202.131.96.100",
                            path: "/Service.svc",
                            port: '8074',
                            method: "POST",
                            "rejectUnauthorized": false,
                            headers: {
                                'Cookie': "cookie",
                                'Content-Type': 'text/xml',
                                'Content-Length': Buffer.byteLength(request_fos),
                                "SOAPAction": 'http://tempuri.org/IService1/ValidatePANNo',
                                "Cache-Control": 'private, no-cache, no-store, must-revalidate, max-age=0',
                                "Pragma": "no-cache"
                            }
                        };
                        //http://202.131.96.100:8074/Service.svc?wsdl
                        let buffer = "";
                        let fliter_response = '';
                        let api_data = '';
                        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

                        let http = require('http');
                        var ApiRequest = http.request(postRequest, function (ApiResponse) {
                            ApiResponse.on("data", function (data) {
                                buffer = buffer + data;
                            });
                            ApiResponse.on("end", function (data) {
                                try {
                                    core_response = buffer;
                                    fliter_response = buffer.replace(/s:/g, '');
                                    api_data = objBase.find_text_btw_key(fliter_response, '<ValidatePANNoResult>', '</ValidatePANNoResult>', false) || '';
                                    //code exists PANNo matched with 713264 who is Active
                                    if (api_data && api_data !== '') {
                                        //PANNo matched with 717900 who is Active
                                        if (api_data.indexOf('PANNo matched with') > -1) {
                                            fos_code = objBase.find_text_btw_key(api_data, 'PANNo matched with ', ' who is Active', false) || '';
                                            if (fos_code && fos_code !== '' && fos_code.length == 6 && fos_code.charAt(0) == '7') {
                                                Employee.findOne({"Role_ID": {$in: Object.keys(config.channel.Const_FOS_Channel).map(Number)}, "VendorCode": fos_code, 'IsActive': 1}, function (err, dbFos) {
                                                    try {
                                                        if (dbFos) {
                                                            dbFos = dbFos._doc;
                                                            obj_fos_data = {
                                                                'status': 'FAIL',
                                                                'msg': 'FOS CODE ' + fos_code + ' IS RECEIVED FOR PAN ' + fos_pan + '. FOS CODE IS ALREADY ACTIVE WITH SSID - ' + dbFos.Emp_Id,
                                                                'data': api_data
                                                            };
                                                        } else {
                                                            obj_fos_data = {
                                                                'status': 'SUCCESS',
                                                                'msg': 'FOS CODE ' + fos_code + ' IS RECEIVED FOR PAN ' + fos_pan + '. FOS CODE IS AVAILABLE FOR ACTIVATEION',
                                                                'fos_code': fos_code,
                                                                'data': api_data
                                                            };
                                                        }
                                                        res.json(obj_fos_data);
                                                    } catch (e) {
                                                        obj_fos_data = {
                                                            'status': 'ERROR',
                                                            'msg': e.stack,
                                                            'data': {}
                                                        };
                                                        res.json(obj_fos_data);
                                                    }
                                                });
                                            } else {
                                                obj_fos_data = {
                                                    'status': 'FAIL',
                                                    'msg': 'INVALID CODE FROM ERP',
                                                    'data': api_data
                                                };
                                                res.json(obj_fos_data);
                                            }
                                        } else {
                                            obj_fos_data = {
                                                'status': 'FAIL',
                                                'msg': 'FOS CODE IS NOT YET CREATED AT ERP FOR PAN - ' + fos_pan,
                                                'data': api_data
                                            };
                                            res.json(obj_fos_data);
                                        }
                                    } else {
                                        obj_fos_data = {
                                            'status': 'FAIL',
                                            'msg': 'INVALID_ERP_FOS_API_DATA',
                                            'data': {}
                                        };
                                        res.json(obj_fos_data);
                                    }
                                } catch (e) {
                                    obj_fos_data = {
                                        'status': 'ERROR',
                                        'msg': e.stack,
                                        'data': {}
                                    };
                                    res.json(obj_fos_data);
                                }
                            });
                        });
                        ApiRequest.on('error', function (e) {
                            obj_fos_data = {
                                'status': 'ERROR',
                                'msg': e.message,
                                'data': {}
                            };
                            res.json(obj_fos_data);
                        });
                        ApiRequest.write(request_fos);
                        ApiRequest.end();
                    }
                } catch (e) {
                    obj_fos_data = {
                        'status': 'ERROR',
                        'msg': e.stack,
                        'data': {}
                    };
                    res.json(obj_fos_data);
                }
            });
        } else {
            obj_fos_data = {
                'status': 'FAIL',
                'msg': 'INVALID_FOS_DATA',
                'data': {}
            };
            res.json(obj_fos_data);
        }
    });
	app.get('/posps/rm_details/:rm_uid', function (req, res) {
        let rm_uid = req.params.rm_uid ? req.params.rm_uid - 0 : 0;
        let obj_rm = {
            'rm_details': null,
            'rm_reporting_details': null,
			'rm_reporting_two_details': null,
			'rm_reporting_three_details': null,
			'rm_reporting_four_details': null,
			'rm_reporting_five_details': null,
            'status': null,
            'message': null
        };
        if (rm_uid > 0 && ['1'].indexOf(rm_uid.toString().charAt(0)) > -1) {            
			var User = require('../models/user');
			User.findOne({"UID": rm_uid}, function (err, dbUser) {
				if (dbUser) {
					dbUser = dbUser._doc;
					obj_rm['status'] = 'SUCCESS';						
					obj_rm['rm_details'] = {
						'ss_id': dbUser['Ss_Id'] - 0,
						'name': dbUser['Employee_Name'],
						'designation' : dbUser['Designation'],
						'uid': dbUser['UID'],
						'mobile': (dbUser['Business_Phone_Number'] && isNaN(dbUser['Business_Phone_Number']) === false) ? dbUser['Business_Phone_Number'] : dbUser['Phone'],
						'email': (dbUser['Official_Email'] && dbUser['Official_Email'].indexOf('@') > -1) ? dbUser['Official_Email'] : dbUser['Email'],
						'agent_city': dbUser['Branch'],
						'rm_reporting_uid': dbUser['Direct_Reporting_UID'] || 0,
						'vertical' :  dbUser['Vertical'].toString().toUpperCase(),
						'sub_vertical' :  dbUser['Sub_Vertical'].toString().toUpperCase()
					};						
					if(isNaN(obj_rm['rm_details']["mobile"]) === true){
						obj_rm['rm_details']["mobile"] = 0;
					}
					
					let Arr_Reporting_UID = [];
					if(dbUser['Reporting_One_UID'] > 0){
						Arr_Reporting_UID.push(dbUser['Reporting_One_UID']);
					}
					if(dbUser['Reporting_Two_UID'] > 0){
						Arr_Reporting_UID.push(dbUser['Reporting_Two_UID']);
					}
					if(dbUser['Reporting_Three_UID'] > 0){
						Arr_Reporting_UID.push(dbUser['Reporting_Three_UID']);
					}
					if(dbUser['Reporting_Four_UID'] > 0){
						Arr_Reporting_UID.push(dbUser['Reporting_Four_UID']);
					}
					if(dbUser['Reporting_Five_UID'] > 0){
						Arr_Reporting_UID.push(dbUser['Reporting_Five_UID']);
					}
					
					if(Arr_Reporting_UID.length > 0){
						User.find({"UID": {"$in":Arr_Reporting_UID}}, function (err, dbUsers) {
							try{
								if(dbUsers && dbUsers.length > 0){
									let obj_reporting_all = {};
									for(let dbUser_Ind of dbUsers){
										dbUser_Ind = dbUser_Ind._doc;
										obj_reporting_all[dbUser_Ind["UID"]] = dbUser_Ind;
									}
									let dbUser_Rm = {};
									if(obj_reporting_all.hasOwnProperty(dbUser['Reporting_One_UID'])){
										dbUser_Rm = obj_reporting_all[dbUser['Reporting_One_UID']];
										obj_rm['rm_reporting_details'] = {
											'ss_id': dbUser_Rm['Ss_Id'] - 0,
											'name': dbUser_Rm['Employee_Name'],
											'designation' : dbUser_Rm['Designation'],
											'uid': dbUser_Rm['UID'],
											'mobile': (dbUser_Rm['Business_Phone_Number'] && isNaN(dbUser_Rm['Business_Phone_Number']) === false) ? dbUser_Rm['Business_Phone_Number'] : dbUser_Rm['Phone'],
											'email': (dbUser_Rm['Official_Email'] && dbUser_Rm['Official_Email'].indexOf('@') > -1) ? dbUser_Rm['Official_Email'] : dbUser_Rm['Email'],
											'agent_city': dbUser_Rm['Branch'],
											'direct_reporting_uid' : dbUser_Rm['Direct_Reporting_UID']
										};										
									}
									if(obj_reporting_all.hasOwnProperty(dbUser['Reporting_Two_UID'])){
										dbUser_Rm = obj_reporting_all[dbUser['Reporting_Two_UID']];
										obj_rm['rm_reporting_two_details'] = {
											'ss_id': dbUser_Rm['Ss_Id'] - 0,
											'name': dbUser_Rm['Employee_Name'],
											'designation' : dbUser_Rm['Designation'],
											'uid': dbUser_Rm['UID'],
											'mobile': (dbUser_Rm['Business_Phone_Number'] && isNaN(dbUser_Rm['Business_Phone_Number']) === false) ? dbUser_Rm['Business_Phone_Number'] : dbUser_Rm['Phone'],
											'email': (dbUser_Rm['Official_Email'] && dbUser_Rm['Official_Email'].indexOf('@') > -1) ? dbUser_Rm['Official_Email'] : dbUser_Rm['Email'],
											'agent_city': dbUser_Rm['Branch'],
											'direct_reporting_uid' : dbUser_Rm['Direct_Reporting_UID']
										};										
									}
									if(obj_reporting_all.hasOwnProperty(dbUser['Reporting_Three_UID'])){
										dbUser_Rm = obj_reporting_all[dbUser['Reporting_Three_UID']];
										obj_rm['rm_reporting_three_details'] = {
											'ss_id': dbUser_Rm['Ss_Id'] - 0,
											'name': dbUser_Rm['Employee_Name'],
											'designation' : dbUser_Rm['Designation'],
											'uid': dbUser_Rm['UID'],
											'mobile': (dbUser_Rm['Business_Phone_Number'] && isNaN(dbUser_Rm['Business_Phone_Number']) === false) ? dbUser_Rm['Business_Phone_Number'] : dbUser_Rm['Phone'],
											'email': (dbUser_Rm['Official_Email'] && dbUser_Rm['Official_Email'].indexOf('@') > -1) ? dbUser_Rm['Official_Email'] : dbUser_Rm['Email'],
											'agent_city': dbUser_Rm['Branch'],
											'direct_reporting_uid' : dbUser_Rm['Direct_Reporting_UID']
										};										
									}
									if(obj_reporting_all.hasOwnProperty(dbUser['Reporting_Four_UID'])){
										dbUser_Rm = obj_reporting_all[dbUser['Reporting_Four_UID']];
										obj_rm['rm_reporting_four_details'] = {
											'ss_id': dbUser_Rm['Ss_Id'] - 0,
											'name': dbUser_Rm['Employee_Name'],
											'designation' : dbUser_Rm['Designation'],
											'uid': dbUser_Rm['UID'],
											'mobile': (dbUser_Rm['Business_Phone_Number'] && isNaN(dbUser_Rm['Business_Phone_Number']) === false) ? dbUser_Rm['Business_Phone_Number'] : dbUser_Rm['Phone'],
											'email': (dbUser_Rm['Official_Email'] && dbUser_Rm['Official_Email'].indexOf('@') > -1) ? dbUser_Rm['Official_Email'] : dbUser_Rm['Email'],
											'agent_city': dbUser_Rm['Branch'],
											'direct_reporting_uid' : dbUser_Rm['Direct_Reporting_UID']
										};										
									}
									if(obj_reporting_all.hasOwnProperty(dbUser['Reporting_Five_UID'])){
										dbUser_Rm = obj_reporting_all[dbUser['Reporting_Five_UID']];
										obj_rm['rm_reporting_five_details'] = {
											'ss_id': dbUser_Rm['Ss_Id'] - 0,
											'name': dbUser_Rm['Employee_Name'],
											'designation' : dbUser_Rm['Designation'],
											'uid': dbUser_Rm['UID'],
											'mobile': (dbUser_Rm['Business_Phone_Number'] && isNaN(dbUser_Rm['Business_Phone_Number']) === false) ? dbUser_Rm['Business_Phone_Number'] : dbUser_Rm['Phone'],
											'email': (dbUser_Rm['Official_Email'] && dbUser_Rm['Official_Email'].indexOf('@') > -1) ? dbUser_Rm['Official_Email'] : dbUser_Rm['Email'],
											'agent_city': dbUser_Rm['Branch'],
											'direct_reporting_uid' : dbUser_Rm['Direct_Reporting_UID']
										};										
									}
								}
								return res.json(obj_rm);
							}
							catch(e){
								return res.send(e.stack);
							}
						});							
					}
					else{
						return res.json(obj_rm);
					}
				} else {
					obj_rm['status'] = 'FAIL';
					return res.json(obj_rm);
				}
				//posps_rm_details_handler(req, res, obj_rm);
			});                            
        } else {
            obj_rm['status'] = 'VALIDATION';
            obj_rm['message'] = 'INVALID_UID';
            return res.json(obj_rm);
        }
    });
    app.get('/posps/rm_details_NIU_060226/:rm_uid', function (req, res) {
        let rm_uid = req.params.rm_uid ? req.params.rm_uid - 0 : 0;
        let obj_rm = {
            'rm_details': null,
            'rm_reporting_details': null,
			'rm_reporting_two_details': null,
            'status': null,
            'message': null
        };
        if (rm_uid > 0) {
            if (['1'].indexOf(rm_uid.toString().charAt(0)) > -1) {
                if (rm_uid.toString().charAt(0) === '1') {
                    var User = require('../models/user');
                    User.findOne({"UID": rm_uid}, function (err, dbUser) {
                        if (dbUser) {
                            dbUser = dbUser._doc;
                            obj_rm['status'] = 'SUCCESS';
                            /*
                             objRequestCore['rm_mobile'] = (dbUser['Business_Phone_Number'] && dbUser['Business_Phone_Number'] != '-') ? dbUser['Business_Phone_Number'] : dbUser['Phone'];
                             objRequestCore['rm_email'] = (dbUser['Official_Email'] && dbUser['Official_Email'] != '-') ? dbUser['Official_Email'] : dbUser['Email'];
                             */
                            obj_rm['rm_details'] = {
                                'ss_id': dbUser['Ss_Id'] - 0,
                                'name': dbUser['Employee_Name'],
								'designation' : dbUser['Designation'],
                                'uid': dbUser['UID'],
                                'mobile': (dbUser['Business_Phone_Number'] && isNaN(dbUser['Business_Phone_Number']) === false) ? dbUser['Business_Phone_Number'] : dbUser['Phone'],
                                'email': (dbUser['Official_Email'] && dbUser['Official_Email'].indexOf('@') > -1) ? dbUser['Official_Email'] : dbUser['Email'],
                                'agent_city': dbUser['Branch'],
                                'rm_reporting_uid': dbUser['Direct_Reporting_UID'] || 0,
								'vertical' :  dbUser['Vertical'].toString().toUpperCase(),
								'sub_vertical' :  dbUser['Sub_Vertical'].toString().toUpperCase()
                            };
							
							if(isNaN(obj_rm['rm_details']["mobile"]) === true){
								obj_rm['rm_details']["mobile"] = 0;
							}
                        } else {
                            obj_rm['status'] = 'FAIL';
                        }
                        posps_rm_details_handler(req, res, obj_rm);
                    });
                }
                if (false && rm_uid.toString().charAt(0) === '4') {
                    //var Posp = require('../models/posp');
                    Posp.findOne({"Erp_Id": rm_uid.toString(), 'Is_Active': true}, function (err, dbPosp) {
                        if (dbPosp) {
                            dbPosp = dbPosp._doc;
                            obj_rm['status'] = 'SUCCESS';
                            obj_rm['rm_details'] = {
                                'ss_id': dbPosp['Ss_Id'] - 0,
                                'name': dbPosp['First_Name'] + ' ' + dbPosp['Last_Name'],
                                'uid': dbPosp['Erp_Id'] - 0,
                                'mobile': dbPosp['Mobile_No'],
                                'email': dbPosp['Email_Id'],
                                'agent_city': dbPosp['Agent_City'],
                                'rm_reporting_uid': dbPosp['Reporting_Agent_Uid'] || 0
                            };
                        } else {
                            obj_rm['status'] = 'FAIL';
                        }
                        posps_rm_details_handler(req, res, obj_rm);
                    });
                }
            } else {
                obj_rm['status'] = 'VALIDATION';
                obj_rm['message'] = 'NOT_ALLOWED_UID';
                return res.json(obj_rm);
            }
        } else {
            obj_rm['status'] = 'VALIDATION';
            obj_rm['message'] = 'INVALID_UID';
            return res.json(obj_rm);
        }
    });
    app.get('/posps/users/get_ssid_by_uid', function (req, res) {
        let emp_uid = req.query['emp_uid'] || 0;
        emp_uid = emp_uid - 0;
        if (emp_uid > 0) {
            var User = require('../models/user');
            User.findOne({"UID": emp_uid}, function (err, dbUser) {
                if (dbUser) {
                    dbUser = dbUser._doc;
                    return res.json({"status": "success", "ss_id": dbUser['Ss_Id']});
                } else {
                    return res.json({"status": "fail", "ss_id": 0});
                }
            });
        } else {
            return res.json({"status": "fail", "ss_id": 0});
        }
    });
    app.get('/posps/fba/getbyfbaid', function (req, res) {
        var args = {
            data: {
                "FBAID": req.query['fba_id'] - 0
            },
            headers: {
                "Content-Type": "application/json",
                "token": "1234567890"
            }
        };
        client.post('http://mfmapi.policyboss.com/api/GetFBAInfo', args, function (data, response) {
            if (data) { // for posp agent                                
                return res.json(data);
            } else {
                return res.json('err');
            }
        });
    });
    app.get('/posps/mapping/erp_update_rm', function (req, res) {
        var objBase = new Base();
        var Rm_Log = require('../models/rm_log');
		console.error('DBG', 'erp_update_rm', req.query);
        let ss_id = req.query['ss_id'] || 0;
        let rm_uid = req.query['rm_uid'] || 0;
        let obj_erp_summary = {
            'mode': req.query['mode'] || 'NA',
            'session_id': req.query['session_id'] || 'NA',
            'mapped_by': req.query['mapped_by'] || 'NA',
            'status': 'NA',
            'mapped_on': new Date(),
            'ss_id': ss_id - 0,
            'rm_uid': rm_uid - 0,
            'erp_id': 0,
            'execution_time': '',
            'request': '',
            'response': '',
            'msg': ''
        };
        try {
            var today = moment().utcOffset("+05:30");
            var today_str_1 = moment(today).format("YYYYMMD");
            let time_stamp = moment(today).format("DD-MMM-YYYY HH:mm:ss"); //04-Feb-2021 12:29:00
            let obj_erp_rm = {
                '___ss_id___': ss_id,
                '___rm_uid___': rm_uid,
                '___erp_id___': 0,
                '___time_stamp___': time_stamp
            };
            ss_id = ss_id - 0;
            rm_uid = rm_uid - 0;
            let buffer = "";


            if (ss_id > 0 && rm_uid > 0) {                
                console.error('DBG', 'erp_update_rm', 'step1', ss_id, rm_uid);
                client.get(config.environment.weburl + '/posps/dsas/view/' + ss_id.toString(), {}, function (agent_data, response) {
                    try {
                        console.error('DBG', 'erp_update_rm', 'step2', agent_data);
                        if (agent_data && agent_data['status'] === 'SUCCESS') {
                            let erp_id = 0;
                            if (agent_data['user_type'] === 'POSP') {
                                erp_id = agent_data['POSP']['Erp_Id'] - 0;
                            }
                            if (agent_data['user_type'] === 'FOS') {
                                erp_id = agent_data['EMP']['VendorCode'] - 0;
                            }
							if (['6', '7', '9'].indexOf(erp_id.toString().charAt(0)) > -1 && erp_id.toString().length === 6) {
								var is_valid_mapping = (rm_uid.toString().charAt(0) == '1') ? true : false;                                
                                if (is_valid_mapping) {
                                    obj_erp_rm['___erp_id___'] = erp_id;
                                    obj_erp_summary['erp_id'] = erp_id;
                                    let core_response = '';
                                    let fliter_response = '';
                                    let soap_action = "http://tempuri.org/IService1/UpdateRMDetails";
                                    let erp_request_xml = fs.readFileSync(appRoot + '/resource/request_file/LERP_RM_Mapping.xml').toString();
                                    for (let k in obj_erp_rm) {
                                        erp_request_xml = erp_request_xml.replace(k, obj_erp_rm[k]);
                                    }
                                    obj_erp_summary['request'] = erp_request_xml;
                                    var http = require('http');
                                    var StartDate = moment(new Date());
                                    var postRequest = {
                                        host: "202.131.96.100",
                                        path: "/Service.svc",
                                        port: '8074',
                                        method: "POST",
                                        "rejectUnauthorized": false,
                                        headers: {
                                            'Cookie': "cookie",
                                            'Content-Type': 'text/xml',
                                            'Content-Length': Buffer.byteLength(erp_request_xml),
                                            "SOAPAction": soap_action
                                        }
                                    };
                                    let response_node_key = 'UpdateRMDetailsResult';
                                    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
                                    console.error('DBG', 'erp_update_rm', 'step3', erp_request_xml);
                                    var http_req = http.request(postRequest, function (http_res) {
                                        var EndDate = moment(new Date());
                                        var Call_Execution_Time = EndDate.diff(StartDate);
                                        Call_Execution_Time = Math.round((Call_Execution_Time * 0.001) * 100) / 100;
                                        obj_erp_summary['execution_time'] = Call_Execution_Time;
                                        http_res.on("data", function (data) {
                                            buffer = buffer + data;
                                        });
                                        http_res.on("end", function (data) {
                                            core_response = buffer;
                                            fliter_response = buffer.replace(/s:/g, '');
                                            obj_erp_summary['response'] = fliter_response;
                                            console.error('DBG', 'erp_update_rm', 'step4', fliter_response);
                                            if (fliter_response.indexOf('<' + response_node_key + '>') > -1) {
                                                let Erp_Mapping_Response = objBase.find_text_btw_key(fliter_response, '<' + response_node_key + '>', '</' + response_node_key + '>', false);
                                                obj_erp_summary['status'] = (Erp_Mapping_Response == '1') ? 'SUCCESS' : 'FAIL';

                                                //sending email to RM Notification
                                                if (obj_erp_summary['status'] == 'SUCCESS' && false) {
                                                    let rm_notification = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>Relationship Manager Update Notification</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                                                    rm_notification += '<p style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">Dear ' + objRmMapping['agent_name'] + ',<br>';
                                                    rm_notification += 'Your Relationship Manager is updated. Now <b><u>' + objRmMapping['new_rm_name'] + '</u></b> is assigned to you as new Relationship Manager.<BR>Following is  details. For any query, Kindly contact your Relationship Manager.<br><br>';

                                                    rm_notification += objectToHtml(objMappingEmailSummary);
                                                    rm_notification += '</p>';
                                                    rm_notification += '</body></html>';
                                                    var subject = '[MAPPING-UPDATE] MAPPING OF RM UPDATED FOR :: ' + objMappingSummary['Agent'];
                                                    var to = objRmMapping['agent_email'].toString().toLowerCase();
                                                    var cc = objRmMapping['new_rm_email'].toString().toLowerCase();
                                                    objModelEmail.send('notifications@policyboss.com', to, subject, rm_notification, cc, config.environment.notification_email);
                                                }
                                                //email sending done


                                            } else {
                                                obj_erp_summary['status'] = 'FAIL';
                                                obj_erp_summary['msg'] = 'RESPONSE_NODE_NA';
                                            }
                                            //saving history mapping start											
                                            var objModelRm_Log = new Rm_Log(obj_erp_summary);
                                            objModelRm_Log.save(function (err, objDbRm_Log) {});
                                            //saving history mapping end
                                            fs.appendFile(appRoot + "/tmp/log/erp_mapping_update_" + today_str_1 + ".log", JSON.stringify(obj_erp_summary) + "\r\n", function (err) {});
                                            res.json(obj_erp_summary);
                                        });
                                    });
                                    http_req.on('error', function (e) {
                                        console.error('problem with request: ' + e.message);
                                        obj_erp_summary['status'] = 'ERR';
                                        obj_erp_summary['msg'] = e.message;

                                        //saving history mapping start											
                                        var objModelRm_Log = new Rm_Log(obj_erp_summary);
                                        objModelRm_Log.save(function (err, objDbRm_Log) {});
                                        //saving history mapping end

                                        fs.appendFile(appRoot + "/tmp/log/erp_mapping_update_" + today_str_1 + ".log", JSON.stringify(obj_erp_summary) + "\r\n", function (err) {});
                                        res.json(obj_erp_summary);
                                    });
                                    http_req.write(erp_request_xml);
                                    http_req.end();
                                } else {
                                    obj_erp_summary['status'] = 'VALIDATION';
                                    obj_erp_summary['msg'] = 'INVALID_MAPPING_CRITERIA';

//saving history mapping start											
                                    var objModelRm_Log = new Rm_Log(obj_erp_summary);
                                    objModelRm_Log.save(function (err, objDbRm_Log) {});
                                    //saving history mapping end
                                    fs.appendFile(appRoot + "/tmp/log/erp_mapping_update_" + today_str_1 + ".log", JSON.stringify(obj_erp_summary) + "\r\n", function (err) {});
                                    res.json(obj_erp_summary);
                                }
                            } else {
                                obj_erp_summary['status'] = 'VALIDATION';
                                obj_erp_summary['msg'] = 'INVALID_ERPID';

                                //saving history mapping start											
                                var objModelRm_Log = new Rm_Log(obj_erp_summary);
                                objModelRm_Log.save(function (err, objDbRm_Log) {});
                                //saving history mapping end

                                fs.appendFile(appRoot + "/tmp/log/erp_mapping_update_" + today_str_1 + ".log", JSON.stringify(obj_erp_summary) + "\r\n", function (err) {});
                                res.json(obj_erp_summary);
                            }
                        } else {
                            obj_erp_summary['status'] = 'VALIDATION';
                            obj_erp_summary['msg'] = 'INVALID_SSID_DATA';

                            //saving history mapping start											
                            var objModelRm_Log = new Rm_Log(obj_erp_summary);
                            objModelRm_Log.save(function (err, objDbRm_Log) {});
                            //saving history mapping end

                            fs.appendFile(appRoot + "/tmp/log/erp_mapping_update_" + today_str_1 + ".log", JSON.stringify(obj_erp_summary) + "\r\n", function (err) {});
                            res.json(obj_erp_summary);
                        }
                    } catch (e) {
                        obj_erp_summary['status'] = 'EXCEPTION_SSID_DATA';
                        obj_erp_summary['msg'] = e.stack;

                        //saving history mapping start											
                        var objModelRm_Log = new Rm_Log(obj_erp_summary);
                        objModelRm_Log.save(function (err, objDbRm_Log) {});
                        //saving history mapping end

                        res.json(obj_erp_summary);
                    }
                });
            } else {
                obj_erp_summary['status'] = 'VALIDATION';
                obj_erp_summary['msg'] = 'INVALID_SSID_RMID';

                //saving history mapping start											
                var objModelRm_Log = new Rm_Log(obj_erp_summary);
                objModelRm_Log.save(function (err, objDbRm_Log) {});
                //saving history mapping end

                res.json(obj_erp_summary);
            }
        } catch (e) {
            obj_erp_summary['status'] = 'EXCEPTION';
            obj_erp_summary['msg'] = e.stack;

            //saving history mapping start											
            var objModelRm_Log = new Rm_Log(obj_erp_summary);
            objModelRm_Log.save(function (err, objDbRm_Log) {});
            //saving history mapping end

            res.json(obj_erp_summary);
        }
    });

    app.post('/posps/migrate_to_fos', LoadSession, function (req, res) {
        req.body = JSON.parse(JSON.stringify(req.body));
        var objRequestCore = req.body;
        
        
        client.get(config.environment.weburl + '/posps/rm_details/' + objRequestCore['rm_uid'], {}, function (rmdata, rmresponse) {
            try {
                if (rmdata) {
                    dbUser = rmdata['rm_details'];
                    objRequestCore['rm_name'] = dbUser['name'];
                    objRequestCore['rm_mobile'] = dbUser['mobile'];
                    objRequestCore['rm_email'] = dbUser['email'];


                    var fos_schema = {
                        'fos_code': 1,
                        'fos_name': 1,
                        'fos_mobile': 1,
                        'fos_email': 1,
                        'fos_pan': 1,
                        'rm_uid': 1,
                        'fos_branch': 1,
                        'ss_id': 1,
                        'fba_id': 1,
                        'posp_source': 1,
                        'session_id': 1
                    };
                    let obj_POSP_to_FOSRole = swap(config.channel.Const_FOS_Role_Source);
                    let Fos_Role_Id = obj_POSP_to_FOSRole[objRequestCore['posp_source'] - 0] || 'NA';
                    //update sql employee table
                    //update Employee_Master set Emp_Code=717808, VendorCode=717808, Emp_Password=CONVERT(varbinary,717808),[UID]='115800' ,Role_ID=51, Branch='KOLKATA', Pan='BINPD0498P', Reporting_Email_ID='sayantan.das@policyboss.com', Reporting_Manager_Emp_Id=118795, Reporting_UID_Name='Sayantan Kumar Das', Reporting_Mobile_Number=9804048944 where FBA_ID=88115
                    let employee_qry_str = 'update Employee_Master set Emp_Name = \'' + objRequestCore['fos_name'].toString() + '\', Mobile_Number = ' + objRequestCore['fos_mobile'].toString() + ', Email_Id = \'' + objRequestCore['fos_email'].toString() + '\',  Emp_Code= ' + objRequestCore['fos_code'].toString() + ', VendorCode = ' + objRequestCore['fos_code'].toString() + ' , Pan = \'' + objRequestCore['fos_pan'].toString() + '\' , Branch = \'' + objRequestCore['fos_branch'].toString() + '\' , Role_ID = ' + Fos_Role_Id.toString() + ' , Emp_Password = CONVERT(varbinary,' + objRequestCore['fos_code'].toString() + ') where Emp_Id = ' + objRequestCore["ss_id"].toString();

                    let posp_qry_str = 'update Posp_Details set IsFOS = 1 , IsActive = 1 , FOS_Code = ' + objRequestCore['fos_code'].toString() + ' where SS_ID = ' + objRequestCore["ss_id"].toString();

                    let obj_status = {
                        'Processed_On': moment().utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss'),
                        'req': req.body,
                        'posp_status': 'PENDING',
                        'employee_status': 'PENDING',
                        'fm_status': 'PENDING',
                        'mapping_status': 'PENDING',
                        'posp_msg': 'NA',
                        'employee_msg': 'NA',
                        'fm_msg': 'NA',
                        'posp_qry': posp_qry_str,
                        'employee_qry': employee_qry_str,
                        'fm_request': {
                            "FBAID": objRequestCore['fba_id'],
                            "FOSCode": objRequestCore['fos_code']
                        },
                        'mapping_request': {
                            "ss_id": objRequestCore['ss_id'],
                            "fba_id": objRequestCore['fba_id'],
                            "Reporting_Agent_Name": objRequestCore['rm_name'],
                            "Reporting_Agent_UID": objRequestCore['rm_uid'],
                            "Reporting_Email_ID": objRequestCore['rm_email'],
                            "Reporting_Mobile_Number": objRequestCore['rm_mobile'],
                            "session_id": objRequestCore['session_id'] || '',
                            'mode': 'FOS-MIGRATE',
                            "Remarks": 'FOS-MIGRATE'
                        }
                    };
                    if (req.query['dbg'] === 'yes') {
                        obj_status['dbg'] = 'yes';
                        let rm_notification = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>RM MAPPING NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                        rm_notification += '<p style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">Dear ' + objRequestCore['fos_name'] + ',<br>';
                        rm_notification += 'Your Transaction account is created.<BR>Following is  details. For any query, Kindly contact your Reporting Manager.<br><br>';
                        rm_notification += objectToHtml(objRequestCore);
                        rm_notification += '<br>Response<br>';
                        rm_notification += objectToHtml(obj_status);
                        rm_notification += '</p>';
                        rm_notification += '</body></html>';
                        var subject = '[USERTYPE-UPDATE] MIGRATE TO FOS FOR :: ' + objRequestCore['fos_name'];
                        //var to = objRequestCore['fos_email'].toString().toLowerCase();
                        var to = config.environment.notification_email;
                        var cc = objRequestCore['rm_email'].toString().toLowerCase();
                        let Email = require('../models/email');
                        let objModelEmail = new Email();
                        objModelEmail.send('notifications@policyboss.com', to, subject, rm_notification, '', '');

                        return res.json(obj_status);
                    } else {
                        let sql = require("mssql");
                        sql.close();
                        sql.connect(config.pospsqldb, function (conn_err) {
                            if (conn_err) {
                                obj_status['posp_status'] = 'DB_CON_ERR';
                                obj_status['posp_msg'] = conn_err;
                            } else {
                                let posp_update_request = new sql.Request();
                                posp_update_request.query(posp_qry_str, function (qry_err, recordset) {
                                    if (qry_err) {
                                        obj_status['posp_status'] = 'DB_UPDATE_ERR';
                                        obj_status['posp_msg'] = qry_err;
                                        res.json(obj_status);
                                    } else {
                                        obj_status['posp_status'] = 'SUCCESS';
                                        obj_status['posp_msg'] = recordset;

                                        obj_status['req']['ss_id'] = obj_status['req']['ss_id'] - 0;
                                        obj_status['req']['Reporting_Agent_UID'] = obj_status['req']['Reporting_Agent_UID'] - 0;
                                        sql.close();
                                        sql.connect(config.portalsqldb, function (conn_err) {
                                            if (conn_err) {
                                                obj_status['employee_status'] = 'DB_CON_ERR';
                                                obj_status['employee_msg'] = conn_err;
                                                res.json(obj_status);
                                            } else {
                                                let employee_update_request = new sql.Request();
                                                employee_update_request.query(employee_qry_str, function (qry_err, recordset) {
                                                    if (qry_err) {
                                                        obj_status['employee_status'] = 'DB_UPDATE_ERR';
                                                        obj_status['employee_msg'] = qry_err;
                                                        res.json(obj_status);
                                                    } else {
                                                        obj_status['employee_status'] = 'SUCCESS';
                                                        obj_status['employee_msg'] = recordset;
                                                        let args = {
                                                            data: obj_status['fm_request'],
                                                            headers: {"Content-Type": "application/json"}
                                                        };
                                                        //obj_status['fm_request'] = args['data'];
                                                        client.post('http://bo.magicfinmart.com/api/update-fos-code-posp', args, function (fmdata, fmresponse) {
                                                            if (fmdata['status'] == 'Success') {
                                                                obj_status['fm_status'] = 'SUCCESS';
                                                                obj_status['fm_msg'] = fmdata;



                                                                //
                                                                let objMappingData = obj_status.mapping_request;

                                                                let args = {
                                                                    data: objMappingData,
                                                                    headers: {"Content-Type": "application/json"}
                                                                };
                                                                client.get(config.environment.weburl + '/report/sync_emp_master?ss_id=' + objRequestCore['ss_id'], {}, function (data, response) {
                                                                    client.get(config.environment.weburl + '/report/sync_posp_master?ss_id=' + objRequestCore['ss_id'], {}, function (data, response) {
                                                                        client.post(config.environment.weburl + '/posps/dsa_posp_update_rm?dbg=no', args, function (crndata, response) {
                                                                            if (crndata && crndata['posp_status'] === 'SUCCESS' && crndata['employee_status'] === 'SUCCESS') {
                                                                                obj_status.mapping_status = 'SUCCESS';
                                                                                obj_status.mapping_response = crndata;
                                                                            } else {
                                                                                obj_status.mapping_status = 'FAIL';
                                                                                obj_status.mapping_response = crndata;
                                                                            }
                                                                            let rm_notification = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>RM MAPPING NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                                                                            rm_notification += '<p style="font-family:\'Google Sans\' ,tahoma;font-size:14px;">Dear ' + objRequestCore['fos_name'] + ',<br>';
                                                                            rm_notification += 'Your Transaction account is created.<BR>Following is  details. For any query, Kindly contact your Reporting Manager.<br><br>';
                                                                            rm_notification += objectToHtml(objRequestCore);
                                                                            rm_notification += '<br>Response<br><pre>';
                                                                            rm_notification += JSON.stringify(obj_status, undefined, 2);
                                                                            rm_notification += '</pre></p>';
                                                                            rm_notification += '</body></html>';
                                                                            var subject = '[USERTYPE-UPDATE] MIGRATE TO FOS FOR :: ' + objRequestCore['fos_name'] + ',SSID-' + objRequestCore['ss_id'];
                                                                            //var to = objRequestCore['fos_email'].toString().toLowerCase();
                                                                            var to = config.environment.notification_email;
                                                                            //var cc = objRequestCore['rm_email'].toString().toLowerCase();
                                                                            let Email = require('../models/email');
                                                                            let objModelEmail = new Email();
                                                                            objModelEmail.send('notifications@policyboss.com', to, subject, rm_notification, '', '');
                                                                            res.json(obj_status);
                                                                        });
                                                                    });
                                                                });

                                                                //
                                                            } else {
                                                                obj_status['fm_status'] = 'FAIL';
                                                                obj_status['fm_msg'] = fmdata;
                                                                res.json(obj_status);
                                                            }

                                                        });
                                                    }

                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }

                } else {
                    res.send('Invalid_RM');
                }
            } catch (e) {
                return res.send(e.stack);
            }
        });
    });
    app.get('/posps/report/posp_onboarding_notification_rm', function (req, res) {
        try {
            var today = moment().utcOffset("+05:30").startOf('Day').format("YYYY-MM-DD");
            var arrFrom = today.split('-');
            var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);
            var arrTo = today.split('-');
            var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
            dateTo.setDate(dateTo.getDate() + 1);
            let obj_cond_posp = {
                'Erp_Id': {$nin: ['', null]},
                'Is_Active': true,
                'ERPID_CreatedDate': {"$gte": dateFrom, "$lte": dateTo}
            };
            if (req.query.hasOwnProperty('ss_id') && req.query['ss_id'] !== '') {
                req.query['ss_id'] = req.query['ss_id'] - 0;
                obj_cond_posp = {
                    'Reporting_Agent_Uid': {"$nin": ['', null]},
                    'Is_Active': true,
                    'Ss_Id': req.query['ss_id']
                };
                if (req.query['email_type'] === 'ERPCODECREATION') {
                    obj_cond_posp['Erp_Id'] = {"$nin": ['', null]};
                }
                if (req.query['email_type'] === 'POS_DEACTIVATE') {
                    obj_cond_posp['Is_Active'] = false;
                }

            }
            //let Client = require('node-rest-client').Client;
            Posp.find(obj_cond_posp).exec(function (err, dbPosps) {
                try
                {
                    let arr_posp = [];
                    let obj_posp = {};
                    let rm_details_count = 0;
                    if (err) {
                        return res.send(err);
                    }

                    if (dbPosps && dbPosps.length > 0) {
                        for (let k in dbPosps) {
                            let ind_posp = dbPosps[k]._doc;
                            obj_posp['SSID_' + ind_posp['Ss_Id']] = {
                                'Ss_Id': ind_posp['Ss_Id'],
                                'Fba_Id': ind_posp['Fba_Id'],
                                'Erp_Id': ind_posp['Erp_Id'],
                                //'Email': ind_posp['Email_Id'],
                                //'Mobile': ind_posp['Mobile_No'],
                                'Channel': ind_posp['Channel'],
								'SubVertical': ind_posp['SubVertical'],
                                'Name': titleCase(ind_posp['First_Name'] + ' ' + ind_posp['Last_Name']),
                                //'Onboard_Amount' : ind_posp['RegAmount'],									
                                'City': ind_posp['Agent_City'],
                                'Rm_UID': ind_posp['Reporting_Agent_Uid']
                            };
                            //let client = new Client();
                            client.get(config.environment.weburl + '/posps/rm_details/' + ind_posp['Reporting_Agent_Uid'], {}, function (rmdata, rmresponse) {
                                try {
                                    rm_details_count++;
                                    if (rmdata && rmdata['status'] == 'SUCCESS') {
                                        obj_posp['SSID_' + ind_posp['Ss_Id']]['Rm_Name'] = rmdata['rm_details']['name'] || '';
                                        obj_posp['SSID_' + ind_posp['Ss_Id']]['Rm_Email'] = rmdata['rm_details']['email'] || '';
                                        obj_posp['SSID_' + ind_posp['Ss_Id']]['Rm_Reporting_UID'] = rmdata['rm_reporting_details']['uid'] || '';
                                        obj_posp['SSID_' + ind_posp['Ss_Id']]['Rm_Reporting_Name'] = rmdata['rm_reporting_details']['name'] || '';
                                        obj_posp['SSID_' + ind_posp['Ss_Id']]['Rm_Reporting_Email'] = rmdata['rm_reporting_details']['email'] || '';
										obj_posp['SSID_' + ind_posp['Ss_Id']]['Rm_Reporting_Two_Name'] = rmdata['rm_reporting_two_details']['name'] || '';
                                        obj_posp['SSID_' + ind_posp['Ss_Id']]['Rm_Reporting_Two_Email'] = rmdata['rm_reporting_two_details']['email'] || '';
                                    }
                                    if (rm_details_count === dbPosps.length) {
                                        let Email = require('../models/email');
                                        let objModelEmail = new Email();

                                        let today_str = moment().utcOffset("+05:30").startOf('Day').format("YYYY-MM-DD");
                                        let res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>ERP_CODE_CREATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                                        res_report += '<p><h1>ERP_CODE_CREATION REPORT :: ' + today_str + '</h1></p>';
                                        res_report += '<p><h1>List</h1>';
                                        res_report += arrayobjectToHtml(Object.values(obj_posp));
                                        res_report += '</p>';
                                        res_report += '</body></html>';
                                        let subject = '[REPORT-WELCOME] ERP_CODE_CREATION :: ' + today_str;
                                        /*if(req.query.hasOwnProperty('ss_id') === false){
                                         objModelEmail.send('notifications@policyboss.com', config.environment.notification_email,
                                         subject, res_report, '', '');
                                         }*/

                                        for (let j in obj_posp) {
                                            var ccList = obj_posp[j]['Rm_Reporting_Email'] + ',Posp.onboarding@policyboss.com';
											if(obj_posp[j]['Rm_Reporting_Two_Email'] !== ""){
												ccList += ","+ obj_posp[j]['Rm_Reporting_Two_Email'];
											}
                                            let res_report_rm = '';
                                            let subject_rm = '';
                                            if (req.query['email_type'] === 'SIGNUP') {
                                                res_report_rm = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>POSP SIGNUP</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                                                res_report_rm += '<p>Dear ' + obj_posp[j]['Rm_Name'] + ',<BR>Following POSP <b><u> ' + obj_posp[j]['Name'] + '</u></b> has Signup on PolicyBoss.<BR>Kindly co-ordinate him/her for Onboarding Formalities of Payment, Document, Training and Exam. Kindly login to Horizon --> Posp List to view more details about POSP';
                                                res_report_rm += objectToHtml(obj_posp[j]);
                                                res_report_rm += '</p>';
                                                res_report_rm += '</body></html>';
                                                subject_rm = '[POSP-SIGNUP] SIGNUP :: SSID-' + obj_posp[j]['Ss_Id'];
                                            }
                                            if (req.query['email_type'] === 'ONBOARDING_PAYMENT_SUCCESSS') {
                                                res_report_rm = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>POS ONBOARDING PAYMENT COMPLETE</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                                                res_report_rm += '<p>Dear ' + obj_posp[j]['Rm_Name'] + ',<BR>Following POSP <b><u>' + obj_posp[j]['Name'] + ' </u></b> has paid Onboarding Payment Amount. Kindly co-ordinate with POSP for any query regarding Training Process. You will be further informed with POSP Recruitment Status.';
                                                res_report_rm += objectToHtml(obj_posp[j]);
                                                res_report_rm += '</p>';
                                                res_report_rm += '</body></html>';
                                                subject_rm = '[POSP-PAYMENT-PAID] POSP ONBOARDING FEES :: SSID-' + obj_posp[j]['Ss_Id'] + ', FBAID-' + obj_posp[j]['Fba_Id'];
                                            }
                                            if (req.query['email_type'] === 'TRAININGSCHEDULE') {
                                                res_report_rm = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>POS TRAINING SCHEDULE</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                                                res_report_rm += '<p>Dear ' + obj_posp[j]['Rm_Name'] + ',<BR>IRDAI POS Training of 30 Hours (for GI and LI) is scheduled for Following POSP <b><u>' + obj_posp[j]['Name'] + ' </u></b>. Mentioned training is required to finish in next 3 days.<BR>Kindly co-ordinate with POSP for any query regarding Training Process. Once Training Completed, Kindly guide posp to attend POS Exam. After passing POSP Exam, Posp will be authorized to do Insurance Transaction. You will be further informed with POSP Exam Status.';
                                                res_report_rm += objectToHtml(obj_posp[j]);
                                                res_report_rm += '</p>';
                                                res_report_rm += '</body></html>';
                                                subject_rm = '[POSP-TRAINING-SCHEDULE] POSP TRAINING/EXAMINATION SCHEDULE :: SSID-' + obj_posp[j]['Ss_Id'] + ', FBAID-' + obj_posp[j]['Fba_Id'];
												
												//schedule training start
												let args = {
													"data": {
														"Ss_Id" : obj_posp[j]['Ss_Id']   
													},
													"headers": {"Content-Type": "application/json"}
												};
												let client_training = new Client();
												client_training.post(config.environment.weburl + '/onboarding/schedule_posp_training', args, function (training_data, training_response) {
												});
												//schedule training finish
                                            }
                                            if (req.query['email_type'] === 'TRAININGPASS') {
                                                res_report_rm = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>POS TRAINING PASS</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                                                res_report_rm += '<p>Dear ' + obj_posp[j]['Rm_Name'] + ',<BR>Following POSP <b><u> ' + obj_posp[j]['Name'] + ' </u></b> has completed IRDAI POS Training followed by POSP Examination. You will be communicated further Once System generates POSP Code.';
                                                res_report_rm += objectToHtml(obj_posp[j]);
                                                res_report_rm += '</p>';
                                                res_report_rm += '</body></html>';
                                                subject_rm = '[POSP-TRAINING-PASS] POSP TRAINING PASS :: SSID-' + obj_posp[j]['Ss_Id'] + ', FBAID-' + obj_posp[j]['Fba_Id'];
                                            }
											if (req.query['email_type'] === 'IIB') {
                                                res_report_rm = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>POS TRAINING PASS</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                                                res_report_rm += '<p>Dear ' + obj_posp[j]['Name'] + ',<BR>Your PAN is uploaded to IRDAI IIB Portal.<BR>If you have completed 30 hours of POS Training then you can appear in POSP Examination. After Successful Exam pass, POSP Code will be auto Generated.';
                                                res_report_rm += objectToHtml(obj_posp[j]);
                                                res_report_rm += '</p>';
                                                res_report_rm += '</body></html>';
                                                subject_rm = '[POSP-IIB] DATA UPLOADED TO IIB :: SSID-' + obj_posp[j]['Ss_Id'] + ', FBAID-' + obj_posp[j]['Fba_Id'];
                                            }
                                            if (req.query['email_type'] === 'ERPCODECREATION') {
                                                res_report_rm = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>ERP_CODE_CREATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                                                res_report_rm += '<p>Dear ' + obj_posp[j]['Rm_Name'] + ',<BR>Following POSP <b><u> ' + obj_posp[j]['Name'] + ' </u></b> has completed IRDAI formalities and is allowed to do Insurance Transaction. He is mapped to you as IRDAI Certified POSP.<BR>Kindly co-ordinate with him/her for any query regarding Transaction Plateform usage. Please login to Horizon --> Posp List to view more details about POSP';
                                                res_report_rm += objectToHtml(obj_posp[j]);
                                                res_report_rm += '</p>';
                                                res_report_rm += '</body></html>';
                                                subject_rm = '[POSP-CODE-GENERATION] POSP CODE GENERATED :: SSID-' + obj_posp[j]['Ss_Id'] + ', ERPCODE-' + obj_posp[j]['Erp_Id'];
                                                client.get(config.environment.weburl + '/posps/fos_to_posp_migration/post_code_process?ss_id=' + obj_posp[j]['Ss_Id'], {}, function (rmdataMigration, rmresponseMigration) {});
                                            }
                                            if (req.query['email_type'] === 'POS_DEACTIVATE') {
                                                res_report_rm = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>POSP CODE DE-ACTIVATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
                                                res_report_rm += '<p>Dear ' + obj_posp[j]['Rm_Name'] + ',<BR>Following POSP <b><u> ' + obj_posp[j]['Name'] + ' </u></b> has been given NOC and His/Her POS PAN is De-Activated.';
                                                res_report_rm += objectToHtml(obj_posp[j]);
                                                res_report_rm += '</p>';
                                                res_report_rm += '</body></html>';
                                                subject_rm = '[POSP-CODE-DEACTIVATE] POSP DEACTIVATION / NOC :: SSID-' + obj_posp[j]['Ss_Id'] + ', ERPCODE-' + obj_posp[j]['Erp_Id'];
                                            }

                                            if (req.query['dbg'] == 'yes') {
                                                objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, subject_rm, res_report_rm, '', '');
                                            }
                                            if (req.query['email'] == 'yes') {												
                                                if(req.query['email_type'] == 'IIB'){
													objModelEmail.send('notifications@policyboss.com', ind_posp['Email_Id'], subject_rm, res_report_rm, obj_posp[j]['Rm_Email']+',posp.onboarding@policyboss.com,posp.ops@policyboss.com' , config.environment.notification_email);
												}
												else{
													if (['TRAININGSCHEDULE', 'TRAININGPASS', 'ERPCODECREATION', 'POS_DEACTIVATE'].indexOf(req.query['email_type']) > -1) {
														ccList += ',posp.ops@policyboss.com';
													}
													if (['ERPCODECREATION', 'SIGNUP'].indexOf(req.query['email_type']) > -1 && config.channel.Const_CH_Contact.hasOwnProperty(obj_posp[j]['Channel']) === true){
														//ccList += ','+config.channel.Const_CH_Contact[obj_posp[j]['Channel']]['email'];
														ccList = ccList.replace(','+config.channel.Const_CH_Contact[obj_posp[j]['Channel']]['email'],"");
													}
													
													if (['ERPCODECREATION'].indexOf(req.query['email_type']) > -1) {
														client.get(config.environment.weburl + '/posps/report/email_consolidate_process?ss_id='+obj_posp[j]['Ss_Id']+'&event_type=POS_CODE', {}, function (rmdata, rmresponse) {});		
													}
													else if (['IIB'].indexOf(req.query['email_type']) > -1) {
														client.get(config.environment.weburl + '/posps/report/email_consolidate_process?ss_id='+obj_posp[j]['Ss_Id']+'&event_type=IIB_UPLOADED', {}, function (rmdata, rmresponse) {});		
													}
													else{
														objModelEmail.send('notifications@policyboss.com', obj_posp[j]['Rm_Email'], subject_rm, res_report_rm, ccList, config.environment.notification_email);													
													}
												}
                                            }
                                        }
                                        return res.send(res_report);
                                    }
                                } catch (e) {
                                    return res.send(e.stack);
                                }
                            });
                        }
                    } else {
                        return res.send('NO Record');
                    }
                } catch (e) {
                    return res.send(e.stack);
                }
            });
        } catch (e) {
            return res.send(e.stack);
        }

    });    
	app.get('/posps/report/posp_training_complete_notification', function (req, res) {
        try {
			let days = req.query['days'] ? (req.query['days'] -0) : 15;
			days = 0 - days;
            //let Client = require('node-rest-client').Client;
            var today = moment().utcOffset("+05:30").startOf('Day').format("YYYY-MM-DD");
            
			var dateFrom = moment().add(days, "days").utcOffset("+05:30").startOf('Day').toDate();
			var dateTo = moment().utcOffset("+05:30").endOf('Day').toDate();
			let Training_Min = moment("2023-04-01").utcOffset("+05:30").startOf('Day').toDate();
            let obj_cond_posp = {
                //'Last_Status': '15',
                'Erp_Id': {"$in": ['', null]},
                'Is_Active': true,
				'Is_IIB' : 1,
				//"Training_Status": "Completed",
				"Is_Exam" : 0,
                //'IsFOS': {"$ne": 1},
                //'First_Name': {$ne: 'Test'},
				'IIB_On': {"$gte": dateFrom , "$lte": dateTo},				
				'TrainingEndDate': {"$nin": ['', null]}
            };
			let mail_started = 0;
			let mail_sent = 0;
            Posp.find(obj_cond_posp).sort({'IIB_On': -1}).exec(function (err, dbPosps) {
                try
                {
                    let arr_posp = [];
                    let obj_posp = {};
                    let arr_posp_training_complete = [];
                    let rm_details_count = 0;
                    let obj_rm_email = {};
                    let obj_rm_reporting_email = {};
                    let obj_exam_summary = {
                        'Within_3_days': 0,
                        'Within_4_to_15_days': 0,
						'Within_16_to_30_days': 0,
						'Beyond_30_days': 0
                    };
                    if (err) {
                        return res.send(err);
                    }

                    if (dbPosps && dbPosps.length > 0) {
						let today_str = moment().utcOffset("+05:30").startOf('Day').format("YYYY-MM-DD");
						let res_report = "";
						let Email = require('../models/email');
						let objModelEmail = new Email();
						
                        for (let k in dbPosps) {
                            let ind_posp = dbPosps[k]._doc;
                            let Training_Start_Date = moment(ind_posp['TrainingStartDate']).utcOffset("+00:00");
							let IIB_On = moment(ind_posp['IIB_On']).utcOffset("+00:00");
                            let Training_End_Date = moment(ind_posp['TrainingEndDate']).utcOffset("+00:00");
							
							let Exam_Delayed = moment().utcOffset("+05:30").diff(Training_End_Date.format("YYYY-MM-DD"), 'days') - 0;							
							if((IIB_On.format("YYYYMMDD") -0) > (Training_End_Date.format("YYYYMMDD") -0)){
								Exam_Delayed = moment().utcOffset("+05:30").diff(IIB_On.format("YYYY-MM-DD"), 'days') - 0;
							}
							
							//let Exam_Due = (Exam_Delayed > 0)? "Due "+Exam_Delayed+" Days":"Due Today";
							let Exam_Due = (Exam_Delayed > 0) ? ((Exam_Delayed == 1) ? "Exam Due Yesterday" : "Exam Due "+Exam_Delayed+" Days") : "Exam Due Today";
							
                            //let Exam_Delayed = moment().diff(Training_End_Date, 'days') - 0;
                            if (Exam_Delayed <= 3) {
                                obj_exam_summary['Within_3_days']++;
                            }
							else if (Exam_Delayed >= 4 && Exam_Delayed <= 15) {
                                obj_exam_summary['Within_4_to_15_days']++;
                            }
                            else if (Exam_Delayed >= 16 && Exam_Delayed <= 30) {
                                obj_exam_summary['Within_16_to_30_days']++;
                            }
							else{
								obj_exam_summary['Beyond_30_days']++;
							}
							
							
							if(Exam_Delayed >= 0){
								
							}
							else{
								continue;
							}

                            obj_posp['SSID_' + ind_posp['Ss_Id']] = {
                                'Training_Start_On': Training_Start_Date.format('DD-MMM-YYYY'),
                                'Training_End_On': Training_End_Date.format('DD-MMM-YYYY'),
								'IIB_Uploaded_On': IIB_On.format('DD-MMM-YYYY'),
                                'Exam_Delayed': Exam_Due,
                                'Channel': ind_posp['Channel'] || 'NA',
								'SubVertical': ind_posp['SubVertical'] || 'NA',
								"Ss_Id" : ind_posp['Ss_Id'],
								"Fba_Id" : ind_posp['Fba_Id'],
                                'Name': titleCase(ind_posp['First_Name'] + ' ' + ind_posp['Last_Name']),
                                'City': ind_posp['Agent_City'] || 'NA',
                                'Rm_UID': ind_posp['Reporting_Agent_Uid'] || '0',
								'Rm_Name': ind_posp['Reporting_Agent_Name'] || 'NA',
								'Reporting_One': ind_posp['Reporting_One'] || 'NA',
								'Reporting_Two': ind_posp['Reporting_Two'] || 'NA'
                            };
							mail_started++;	
							//html prepare
							res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>POSP EXAM DUE NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
							res_report += '<p><h1>POSP EXAM DUE NOTIFICATION REPORT :: ' + today_str + '</h1></p>';
							if (req.query['dbg'] == 'yes') {
								res_report += '<p><pre>' + JSON.stringify(obj_cond_posp, undefined, 2) + '</pre><p>';
							}
							res_report += '<p>Dear Cordinator,<BR>Following POSP(s) had already completed IRDAI Posp Training according 30 hours schedule.<BR>RM and their reporting are already notified for same. Kindly cordinate Reporting Manager to connect POSP regarding Exam Appearance.<br>Once POSP passes exam, kindly create their Posp Code for business enablement.';
							res_report += '<p><h1>Posp Exam Due Summary</h1>';
							res_report += objectToHtml(obj_exam_summary);
							res_report += '</p>';
							res_report += '<p><h1>Posp List :: Count-' + Object.keys(obj_posp).length + '</h1>';
							res_report += arrayobjectToHtml(Object.values(obj_posp));
							res_report += '</p>';
							res_report += '</body></html>';
							
							//html prepare
							
							if (req.query['pospemail'] == 'yes') {
								sleep(100);
								//let client = new Client();
								//https://horizon.policyboss.com:5443/posps/report/email_consolidate_process?ss_id=140410&dbg=yes&event_type=EXAM_LINK
								client.get(config.environment.weburl + '/posps/report/email_consolidate_process?event_type=EXAM_LINK&ss_id=' + ind_posp['Ss_Id']+"&dbg="+(req.query['dbg'] || "no"), {}, function (rmdata, rmresponse) {
									try {
										mail_sent++;
										if(mail_started === mail_sent){     
											let subject_complete = '[POSP-ONBOARDING][REPORT] POSP EXAM DUE SUMMARY :: Completed :: Count-' + Object.keys(obj_posp).length + ' ' + today_str;
											obj_exam_summary["processed"] = Object.keys(obj_posp).length;
											obj_exam_summary["mail_started"] = mail_started;
											obj_exam_summary["mail_sent"] = mail_sent;											
											let content_complete = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>POSP EXAM DUE NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
											content_complete += '<p><h1>Posp Exam Due Summary</h1>';
											content_complete += objectToHtml(obj_exam_summary);
											content_complete += '</p>';											
											content_complete += '</body></html>';
											objModelEmail.send('noreply@policyboss.com', config.environment.notification_email, subject_complete
									, content_complete, '', '');
										}
									} catch (e) {
										return res.send(e.stack);
									}
								});
							}														
                        }
						let subject = '[POSP-ONBOARDING][REPORT] POSP EXAM DUE SUMMARY :: Count-' + Object.keys(obj_posp).length + ' :: ' + today_str;
						if (req.query['dbg'] == 'yes') {
							objModelEmail.send('notifications@policyboss.com', config.environment.notification_email,
									subject, res_report, '', '');
						} else {
							objModelEmail.send('notifications@policyboss.com', 'posp.ops@policyboss.com,posp.onboarding@policyboss.com,kevin.menezes@policyboss.com',
									subject, res_report, '', config.environment.notification_email);
						}
						return res.send(res_report);
                    } else {
                        return res.send('NO Record');
                    }
                } catch (e) {
                    return res.send(e.stack);
                }
            });
        } catch (e) {
            return res.send(e.stack);
        }

    });
	app.get('/posps/report/posp_payment_due_reminder', function (req, res) {
        try {
			let days = req.query['days'] ? (req.query['days'] -0) : 15;
			days = 0 - days;
            //let Client = require('node-rest-client').Client;
            var today = moment().utcOffset("+05:30").startOf('Day').format("YYYY-MM-DD");
            
			var dateFrom = moment().add(days, "days").utcOffset("+05:30").startOf('Day').toDate();
			var dateTo = moment().utcOffset("+05:30").endOf('Day').toDate();
			let Training_Min = moment("2023-04-01").utcOffset("+05:30").startOf('Day').toDate();
            let obj_cond_posp = {
                'Erp_Id': {"$in": ['', null]},
                'Is_Active': true,
				'Is_Paid' : { "$ne" : 1},
				"IsFOS": { "$ne" : 1},
				"Sources" : {"$nin": ['31']}, // for exclude direct campaign				
				'TrainingEndDate': {"$nin": ['', null]},				
				'Created_On': {"$gte": dateFrom , "$lte": dateTo},				
				'Paid_On': {"$in": ['', null]}
            };
			let mail_started = 0;
			let mail_sent = 0;
            Posp.find(obj_cond_posp).sort({'Created_On': -1}).exec(function (err, dbPosps) {
                try
                {
					
                    let obj_posp = {};
                    let obj_payment_summary = {
                        'Within_3_days': 0,
                        'Within_4_to_15_days': 0,
						'Within_16_to_30_days': 0,
						'Within_31_to_180_days': 0
                    };
                    if (err) {
                        return res.send(err);
                    }

                    if (dbPosps && dbPosps.length > 0) {
						let today_str = moment().utcOffset("+05:30").startOf('Day').format("YYYY-MM-DD");
						let res_report = "";
						let Email = require('../models/email');
						let objModelEmail = new Email();
						
                        for (let k in dbPosps) {
                            let ind_posp = dbPosps[k]._doc;
							let name = ind_posp['First_Name'] + ' ' + ind_posp['Last_Name'];
							name =name.toUpperCase();
							if(name.indexOf("TEST") > -1){
								continue;
							}
                            let Signup_On = moment(ind_posp['Created_On']).utcOffset("+00:00");                            
							let Payment_Delayed_Days = moment().utcOffset("+05:30").diff(Signup_On.format("YYYY-MM-DD"), 'days') - 0;
							let Exam_Due = (Payment_Delayed_Days > 0) ? ((Payment_Delayed_Days == 1) ? "Due Yesterday" : "Due "+Payment_Delayed_Days+" Days") : "Due Today";
							let payment_key = '';
                            if (Payment_Delayed_Days <= 3) {
                                payment_key = 'Within_3_days';
                            }
							else if (Payment_Delayed_Days >= 4 && Payment_Delayed_Days <= 15) {
                                payment_key = 'Within_4_to_15_days';								
                            }
                            else if (Payment_Delayed_Days >= 16 && Payment_Delayed_Days <= 30) {
                                payment_key = 'Within_16_to_30_days';
                            }
							else{
								payment_key = 'Within_31_to_180_days';
							}
							obj_payment_summary[payment_key]++;
							if(Payment_Delayed_Days >= 0){
								
							}
							else{
								continue;
							}

                            obj_posp['SSID_' + ind_posp['Ss_Id']] = {
                                'Signup_On': Signup_On.format('DD-MMM-YYYY'),
                                'Payment_Delayed_Days': Payment_Delayed_Days,
                                'Channel': ind_posp['Channel'] || 'NA',
								'SubVertical': ind_posp['SubVertical'] || 'NA',
								"Ss_Id" : ind_posp['Ss_Id'],
								"Fba_Id" : ind_posp['Fba_Id'],
                                'Name': titleCase(ind_posp['First_Name'] + ' ' + ind_posp['Last_Name']),
                                'City': ind_posp['Agent_City'] || 'NA',
                                'Rm_UID': ind_posp['Reporting_Agent_Uid'] || '0',
								'Rm_Name': ind_posp['Reporting_Agent_Name'] || 'NA',
								'Reporting_One': ind_posp['Reporting_One'] || 'NA',
								'Reporting_Two': ind_posp['Reporting_Two'] || 'NA'
                            };
							mail_started++;	
							//html prepare
							res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>POSP PAYMENT DUE NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
							res_report += '<p><h1>POSP PAYMENT DUE NOTIFICATION REPORT :: ' + today_str + '</h1></p>';
							if (req.query['dbg'] == 'yes') {
								res_report += '<p><pre>' + JSON.stringify(obj_cond_posp, undefined, 2) + '</pre><p>';
							}
							res_report += '<p>Dear Cordinator,<BR>Following POSP(s) are due in Onboarding Payment.Kindly cordinate Reporting Manager to connect POSP regarding Payment Process.';
							res_report += '<p><h1>Posp Payment Due Summary</h1>';
							res_report += objectToHtml(obj_payment_summary);
							res_report += '</p>';
							res_report += '<p><h1>Posp List :: Count-' + Object.keys(obj_posp).length + '</h1>';
							res_report += arrayobjectToHtml(Object.values(obj_posp));
							res_report += '</p>';
							res_report += '</body></html>';
							
							//html prepare
							
							if (req.query['pospemail'] == 'yes') {
								sleep(100);
								//let client = new Client();
								//client.get(config.environment.weburl + '/onboarding/posp_exam_due_mail?ss_id=' + ind_posp['Ss_Id']+"&dbg="+(req.query['dbg'] || "no"), {}, function (rmdata, rmresponse) {
								
								client.get(config.environment.weburl + '/posps/report/email_consolidate_process?event_type=PAYMENT_LINK&ss_id=' + ind_posp['Ss_Id']+"&dbg="+(req.query['dbg'] || "no"), {}, function (rmdata, rmresponse) {
									try {
										mail_sent++;
										if(mail_started === mail_sent){     
											let subject_complete = '[POSP-ONBOARDING][REPORT] POSP PAYMENT DUE SUMMARY :: Completed :: Count-' + Object.keys(obj_posp).length + ' ' + today_str;
											obj_exam_summary["processed"] = Object.keys(obj_posp).length;
											obj_exam_summary["mail_started"] = mail_started;
											obj_exam_summary["mail_sent"] = mail_sent;											
											let content_complete = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>POSP EXAM DUE NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
											content_complete += '<p><h1>Posp Exam Due Summary</h1>';
											content_complete += objectToHtml(obj_payment_summary);
											content_complete += '</p>';											
											content_complete += '</body></html>';
											objModelEmail.send('noreply@policyboss.com', config.environment.notification_email, subject_complete
									, content_complete, '', '');
										}
									} catch (e) {
										return res.send(e.stack);
									}
								});
							}														
                        }
						let subject = '[POSP-ONBOARDING][REPORT] POSP PAYMENT DUE SUMMARY :: Count-' + Object.keys(obj_posp).length + ' :: ' + today_str;
						if (req.query['dbg'] == 'yes') {
							objModelEmail.send('notifications@policyboss.com', config.environment.notification_email,
									subject, res_report, '', '');
						} else {
							objModelEmail.send('notifications@policyboss.com', 'posp.ops@policyboss.com,posp.onboarding@policyboss.com,kevin.menezes@policyboss.com',
									subject, res_report, '', config.environment.notification_email);
						}
						return res.send(res_report);
                    } else {
                        return res.send('NO Record');
                    }
                } catch (e) {
                    return res.send(e.stack);
                }
            });
        } catch (e) {
            return res.send(e.stack);
        }

    });
	app.get('/posps/report/posp_channel_vertical', function (req, res) {
		let obj_posp_channel_vertical = {
			"Channel" : null,
			"SubVertical" : null,
			//"Reporting" : null,
			"Reporting_One" : null,
			"Reporting_Two" : null,
			"Reporting_Three" : null,
			"Reporting_Four" : null,
			//"Agent_City" : null
		}
		Posp.distinct("Channel").exec(function(err,ArrChannel){
			obj_posp_channel_vertical["Channel"] = ArrChannel || [];
			posp_channel_vertical(obj_posp_channel_vertical ,req, res);						
		});
		Posp.distinct("SubVertical").exec(function(err,ArrVertical){
			obj_posp_channel_vertical["SubVertical"] = ArrVertical || [];
			posp_channel_vertical(obj_posp_channel_vertical ,req, res);
		});	
		Posp.distinct("Reporting_One",{"Reporting_One" : {"$ne":"NA"} }).exec(function(err,ArrReporting_One){
			obj_posp_channel_vertical["Reporting_One"] = ArrReporting_One || [];
			posp_channel_vertical(obj_posp_channel_vertical ,req, res);
		});
		Posp.distinct("Reporting_Two",{"Reporting_Two" : {"$ne":"NA"}}).exec(function(err,ArrReporting_Two){
			obj_posp_channel_vertical["Reporting_Two"] = ArrReporting_Two || [];
			posp_channel_vertical(obj_posp_channel_vertical ,req, res);
		});
		Posp.distinct("Reporting_Three",{"Reporting_Three" : {"$ne":"NA"}}).exec(function(err,ArrReporting_Three){
			obj_posp_channel_vertical["Reporting_Three"] = ArrReporting_Three || [];
			posp_channel_vertical(obj_posp_channel_vertical ,req, res);
		});
		Posp.distinct("Reporting_Four",{"Reporting_Four" : {"$ne":"NA"}}).exec(function(err,ArrReporting_Four){
			obj_posp_channel_vertical["Reporting_Four"] = ArrReporting_Four || [];
			posp_channel_vertical(obj_posp_channel_vertical ,req, res);
		});
		/*Posp.distinct("Reporting",{"Reporting_Four" : {"$ne":"NA"}).exec(function(err,ArrReporting_Two){
			obj_posp_channel_vertical["Reporting_Two"] = ArrReporting_Two || [];
			posp_channel_vertical(obj_posp_channel_vertical ,req, res);
		});*/
	});
	function posp_channel_vertical(obj_posp_channel_vertical ,req, res){
		let all_complete = false;
		for(let k in obj_posp_channel_vertical){
			if(obj_posp_channel_vertical[k] !== null){
				all_complete = true;
			}
			else{
				all_complete = false;
				break;
			}
		}
		if(all_complete === true){
			let arr_reporting_all = [];
			arr_reporting_all = obj_posp_channel_vertical["Reporting_One"].concat(obj_posp_channel_vertical["Reporting_Two"]);
			arr_reporting_all = arr_reporting_all.concat(obj_posp_channel_vertical["Reporting_Three"]);
			arr_reporting_all = arr_reporting_all.concat(obj_posp_channel_vertical["Reporting_Four"]);
			arr_reporting_all =  arr_reporting_all.filter(onlyUnique);
			arr_reporting_all = arr_reporting_all.sort();
			obj_posp_channel_vertical["Reporting"] = arr_reporting_all;
			return res.json(obj_posp_channel_vertical);
		}
	}
	function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}	
	app.get('/posps/report/posp_document_due_reminder', function (req, res) {
        try {
			let days = req.query['days'] ? (req.query['days'] -0) : 15;
			days = 0 - days;
            //let Client = require('node-rest-client').Client;
            var today = moment().utcOffset("+05:30").startOf('Day').format("YYYY-MM-DD");
            
			var dateFrom = moment().add(days, "days").utcOffset("+05:30").startOf('Day').toDate();
			var dateTo = moment().utcOffset("+05:30").endOf('Day').toDate();
			let Training_Min = moment("2023-04-01").utcOffset("+05:30").startOf('Day').toDate();
            let obj_cond_posp = {
                'Erp_Id': {"$in": ['', null]},
                'Is_Active': true,
				//'Is_Paid' : 1,
				'Is_Document_Uploaded' : 'No',
				//"IsFOS": { "$ne" : 1},								
				//'Paid_On': {"$gte": dateFrom , "$lte": dateTo},
				'Created_On': {"$gte": dateFrom , "$lte": dateTo}
            };
			let obj_payment_summary = {
				'Within_3_days': 0,
				'Within_4_to_15_days': 0,
				'Within_16_to_30_days': 0,
				'Within_31_to_180_days': 0
			};
			let mail_started = 0;
			let mail_sent = 0;
			obj_payment_summary['cond'] = obj_cond_posp;
			posp_user.distinct("Ss_Id",obj_cond_posp).exec(function (err, Arr_Posps_Users) {
				if(Arr_Posps_Users.length == 0){					
					return res.send("<pre>"+JSON.stringify(obj_payment_summary,undefined,2)+"</pre>");
				}			
				Posp.find({Ss_Id:{"$in":Arr_Posps_Users},'Created_On': {"$gte": dateFrom , "$lte": dateTo}}).sort({'Created_On': -1}).exec(function (err, dbPosps) {
					try
					{
						let obj_posp = {};						
						if (err) {
							return res.send(err);
						}

						if (dbPosps && dbPosps.length > 0) {
							let today_str = moment().utcOffset("+05:30").startOf('Day').format("YYYY-MM-DD");
							let res_report = "";
							let Email = require('../models/email');
							let objModelEmail = new Email();
							
							for (let k in dbPosps) {
								let ind_posp = dbPosps[k]._doc;
								let name = ind_posp['First_Name'] + ' ' + ind_posp['Last_Name'];
								name =name.toUpperCase();
								if(name.indexOf("TEST") > -1){
									continue;
								}
								let Signup_On = moment(ind_posp['Created_On']).utcOffset("+00:00");
								let Paid_On = moment(ind_posp['Paid_On']).utcOffset("+00:00");
								let Delayed_Days = moment().utcOffset("+05:30").diff(Signup_On.format("YYYY-MM-DD"), 'days') - 0;
								let payment_key = '';
								if (Delayed_Days <= 3) {
									payment_key = 'Within_3_days';
								}
								else if (Delayed_Days >= 4 && Delayed_Days <= 15) {
									payment_key = 'Within_4_to_15_days';								
								}
								else if (Delayed_Days >= 16 && Delayed_Days <= 30) {
									payment_key = 'Within_16_to_30_days';
								}
								else{
									payment_key = 'Within_31_to_180_days';
								}
								obj_payment_summary[payment_key]++;
								if(Delayed_Days >= 0){
									
								}
								else{
									continue;
								}

								obj_posp['SSID_' + ind_posp['Ss_Id']] = {
									'Signup_On': Signup_On.format('DD-MMM-YYYY'),
									'Paid_On': Paid_On.format('DD-MMM-YYYY'),
									'Document_Delayed_Days': Delayed_Days,
									'Channel': ind_posp['Channel'] || 'NA',
									'SubVertical': ind_posp['SubVertical'] || 'NA',
									"Ss_Id" : ind_posp['Ss_Id'],
									"Fba_Id" : ind_posp['Fba_Id'],
									'Name': titleCase(ind_posp['First_Name'] + ' ' + ind_posp['Last_Name']),
									'City': ind_posp['Agent_City'] || 'NA',
									'Rm_UID': ind_posp['Reporting_Agent_Uid'] || '0',
									'Rm_Name': ind_posp['Reporting_Agent_Name'] || 'NA',
									'Reporting_One': ind_posp['Reporting_One'] || 'NA',
									'Reporting_Two': ind_posp['Reporting_Two'] || 'NA'
								};
								mail_started++;	
								//html prepare
								res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>POSP PAYMENT DUE NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
								res_report += '<p><h1>POSP DOCUMENT DUE NOTIFICATION REPORT :: ' + today_str + '</h1></p>';
								if (req.query['dbg'] == 'yes') {
									res_report += '<p><pre>' + JSON.stringify(obj_cond_posp, undefined, 2) + '</pre><p>';
								}
								res_report += '<p>Dear Cordinator,<BR>Following POSP(s) are due in Onboarding DOCUMENT';
								res_report += '<p><h1>Posp Payment Due Summary</h1>';
								res_report += objectToHtml(obj_payment_summary);
								res_report += '</p>';
								res_report += '<p><h1>Posp List :: Count-' + Object.keys(obj_posp).length + '</h1>';
								res_report += arrayobjectToHtml(Object.values(obj_posp));
								res_report += '</p>';
								res_report += '</body></html>';
								
								//html prepare
								
								if (req.query['pospemail'] == 'yes') {
									sleep(100);
									//let client = new Client();									
									client.get(config.environment.weburl + '/posps/report/email_consolidate_process?event_type=DOCUMENT_LINK&ss_id=' + ind_posp['Ss_Id']+"&dbg="+(req.query['dbg'] || "no"), {}, function (rmdata, rmresponse) {
										try {
											mail_sent++;
											if(mail_started === mail_sent){     
												let subject_complete = '[POSP-ONBOARDING][REPORT] POSP DOCUMENT DUE SUMMARY :: Completed :: Count-' + Object.keys(obj_posp).length + ' ' + today_str;
												obj_exam_summary["processed"] = Object.keys(obj_posp).length;
												obj_exam_summary["mail_started"] = mail_started;
												obj_exam_summary["mail_sent"] = mail_sent;											
												let content_complete = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>POSP EXAM DUE NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
												content_complete += '<p><h1>Posp DOCUMENT Due Summary</h1>';
												content_complete += objectToHtml(obj_payment_summary);
												content_complete += '</p>';											
												content_complete += '</body></html>';
												objModelEmail.send('noreply@policyboss.com', config.environment.notification_email, subject_complete
										, content_complete, '', '');
											}
										} catch (e) {
											return res.send(e.stack);
										}
									});
								}														
							}
							let subject = '[POSP-ONBOARDING][REPORT] POSP DOCUMENT DUE SUMMARY :: Count-' + Object.keys(obj_posp).length + ' :: ' + today_str;
							if (req.query['dbg'] == 'yes') {
								objModelEmail.send('notifications@policyboss.com', config.environment.notification_email,
										subject, res_report, '', '');
							} else {
								objModelEmail.send('notifications@policyboss.com', 'posp.ops@policyboss.com,posp.onboarding@policyboss.com,kevin.menezes@policyboss.com',
										subject, res_report, '', config.environment.notification_email);
							}
							return res.send(res_report);
						} else {
							return res.send('NO Record');
						}
					} catch (e) {
						return res.send(e.stack);
					}
				});
			});
        } catch (e) {
            return res.send(e.stack);
        }

    });
	app.get('/posps/report/posp_document_uploaded_but_iib_due_reminder', function (req, res) {
        try {
			let days = req.query['days'] ? (req.query['days'] -0) : 15;
			days = 0 - days;
            //let Client = require('node-rest-client').Client;
            var today = moment().utcOffset("+05:30").startOf('Day').format("YYYY-MM-DD");
            
			var dateFrom = moment().add(days, "days").utcOffset("+05:30").startOf('Day').toDate();
			var dateTo = moment().utcOffset("+05:30").endOf('Day').toDate();
			let Training_Min = moment("2023-04-01").utcOffset("+05:30").startOf('Day').toDate();
            let obj_cond_posp = {
                'Erp_Id': {"$in": ['', null]},
                'Is_Active': true,				
				'Is_Document_Uploaded' : 'Yes',
				'Is_IIB_Uploaded' : 'No',								
				'Documents_Uploaded_On': {"$gte": dateFrom , "$lte": dateTo}
            };
			let obj_payment_summary = {
				'Within_3_days': 0,
				'Within_4_to_15_days': 0,
				'Within_16_to_30_days': 0,
				'Within_31_to_180_days': 0
			};
			let mail_started = 0;
			let mail_sent = 0;
			obj_payment_summary['cond'] = obj_cond_posp;
			posp_user.distinct("Ss_Id",obj_cond_posp).exec(function (err, Arr_Posps_Users) {
				if(Arr_Posps_Users.length == 0){					
					return res.send("<pre>"+JSON.stringify(obj_payment_summary,undefined,2)+"</pre>");
				}			
				Posp.find({Ss_Id:{"$in":Arr_Posps_Users}}).sort({'Created_On': -1}).exec(function (err, dbPosps) {
					try
					{
						let obj_posp = {};						
						if (err) {
							return res.send(err);
						}

						if (dbPosps && dbPosps.length > 0) {
							let today_str = moment().utcOffset("+05:30").startOf('Day').format("YYYY-MM-DD");
							let res_report = "";
							let Email = require('../models/email');
							let objModelEmail = new Email();
							
							for (let k in dbPosps) {
								let ind_posp = dbPosps[k]._doc;
								let Signup_On = moment(ind_posp['Created_On']).utcOffset("+00:00");
								let Paid_On = ind_posp['Paid_On'] ? moment(ind_posp['Paid_On']).utcOffset("+00:00") : "UNPAID";
								let Documents_Uploaded_On = moment(ind_posp['Documents_Uploaded_On']).utcOffset("+00:00");
								let Delayed_Days = moment().utcOffset("+05:30").diff(Documents_Uploaded_On.format("YYYY-MM-DD"), 'days') - 0;
								let payment_key = '';
								if (Delayed_Days <= 3) {
									payment_key = 'Within_3_days';
								}
								else if (Delayed_Days >= 4 && Delayed_Days <= 15) {
									payment_key = 'Within_4_to_15_days';								
								}
								else if (Delayed_Days >= 16 && Delayed_Days <= 30) {
									payment_key = 'Within_16_to_30_days';
								}
								else{
									payment_key = 'Within_31_to_180_days';
								}
								obj_payment_summary[payment_key]++;
								if(Delayed_Days >= 0){
									
								}
								else{
									continue;
								}

								obj_posp['SSID_' + ind_posp['Ss_Id']] = {
									'Signup_On': Signup_On.format('DD-MMM-YYYY'),
									'Paid_On': (Paid_On !== "UNPAID") ? Paid_On.format('DD-MMM-YYYY') : 'UNPAID',
									'Documents_Uploaded_On': Documents_Uploaded_On.format('DD-MMM-YYYY'),
									'Document_Delayed_Days': Delayed_Days,
									'Channel': ind_posp['Channel'] || 'NA',
									'SubVertical': ind_posp['SubVertical'] || 'NA',
									"Ss_Id" : ind_posp['Ss_Id'],
									"Fba_Id" : ind_posp['Fba_Id'],
									'Name': titleCase(ind_posp['First_Name'] + ' ' + ind_posp['Last_Name']),
									'City': ind_posp['Agent_City'] || 'NA',
									'Rm_UID': ind_posp['Reporting_Agent_Uid'] || '0',
									'Rm_Name': ind_posp['Reporting_Agent_Name'] || 'NA',
									'Reporting_One': ind_posp['Reporting_One'] || 'NA',
									'Reporting_Two': ind_posp['Reporting_Two'] || 'NA'
								};
								mail_started++;	
								//html prepare
								res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>POSP IIB DUE NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
								res_report += '<p><h1>POSP IIB DUE NOTIFICATION REPORT :: ' + today_str + '</h1></p>';
								if (req.query['dbg'] == 'yes') {
									res_report += '<p><pre>' + JSON.stringify(obj_cond_posp, undefined, 2) + '</pre><p>';
								}
								res_report += '<p>Dear Cordinator,<BR>Following POSP(s) had uploaded document But they are due in IIB Uploading.';
								res_report += '<p><h1>Posp IIB Due Summary</h1>';
								res_report += objectToHtml(obj_payment_summary);
								res_report += '</p>';
								res_report += '<p><h1>Posp List :: Count-' + Object.keys(obj_posp).length + '</h1>';
								res_report += arrayobjectToHtml(Object.values(obj_posp));
								res_report += '</p>';
								res_report += '</body></html>';
								
								//html prepare
								
								if (req.query['pospemail'] == 'yes') {
									sleep(100);
									//let client = new Client();
									client.get(config.environment.weburl + '/onboarding/posp_iib_due_mail?ss_id=' + ind_posp['Ss_Id']+"&dbg="+(req.query['dbg'] || "no"), {}, function (rmdata, rmresponse) {
										try {
											mail_sent++;
											if(mail_started === mail_sent){     
												let subject_complete = '[POSP-ONBOARDING][REPORT] POSP IIB DUE SUMMARY :: Completed :: Count-' + Object.keys(obj_posp).length + ' ' + today_str;
												obj_exam_summary["processed"] = Object.keys(obj_posp).length;
												obj_exam_summary["mail_started"] = mail_started;
												obj_exam_summary["mail_sent"] = mail_sent;											
												let content_complete = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>POSP DOCUMENT DUE NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
												content_complete += '<p><h1>Posp IIB Due Summary</h1>';
												content_complete += objectToHtml(obj_payment_summary);
												content_complete += '</p>';											
												content_complete += '</body></html>';
												objModelEmail.send('noreply@policyboss.com', config.environment.notification_email, subject_complete
										, content_complete, '', '');
											}
										} catch (e) {
											return res.send(e.stack);
										}
									});
								}														
							}
							let subject = '[POSP-ONBOARDING][REPORT] POSP IIB DUE SUMMARY :: Count-' + Object.keys(obj_posp).length + ' :: ' + today_str;
							if (req.query['dbg'] == 'yes') {
								objModelEmail.send('notifications@policyboss.com', config.environment.notification_email,
										subject, res_report, '', '');
							} else {
								objModelEmail.send('notifications@policyboss.com', 'posp.ops@policyboss.com,posp.onboarding@policyboss.com,kevin.menezes@policyboss.com',
										subject, res_report, '', config.environment.notification_email);
							}
							return res.send(res_report);
						} else {
							return res.send('NO Record');
						}
					} catch (e) {
						return res.send(e.stack);
					}
				});
			});
        } catch (e) {
            return res.send(e.stack);
        }

    });
	app.get('/posps/report/email_consolidate_process', function (req, res) {
        let Ss_Id = (req.query.ss_id) ? (req.query.ss_id - 0) : 0;
        let Is_Testing = req.query.Is_Testing || 'no';
        let Event_Type = req.query.event_type || "";
        let obj_mail_summary = {
            "Status": "Pending",
            "Ss_Id": Ss_Id,
            "Msg": null,
            "Event_Type": Event_Type,
            "objMail": null
        };
        try {
            let objMail = {};
            let Due_By = req.query.due_by || "";
            let arr_Event = ["PAYMENT_LINK", "DOCUMENT_LINK", "TRAINING_LINK", "EXAM_LINK", "DOCUMENT_UPLOADED", "DOCUMENT_REJECTED"];
            if (Ss_Id > 0 && Event_Type !== "") {
                client.get(config.environment.weburl +'/posps/dsas/view/' + Ss_Id, {}, function (posp_res, posp_res_data) {
                    try {
                        if (posp_res && posp_res.status && posp_res.status === "SUCCESS" && ["POSP", "FOS"].indexOf(posp_res.user_type) > -1 && posp_res["POSP_USER"]) {
                            let Obj_Recruitment_Status = {
                                "PAYMENT": "PENDING",
                                "DOCUMENT": "PENDING",
                                "TRAINING": "PENDING",
                                "IIB": "PENDING",
                                "EXAM": "NOT-SCHEDULE",
                                "POSCODE": "PENDING"
                            };

                            let posp_user_data = posp_res["POSP_USER"];
                            let posp_data = posp_res["POSP"] || {};
                            let Posp_Doc_Logs = posp_res['DOC_LOGS'];
                            if (posp_user_data["Payment_Status"] == "Success") {
                                Obj_Recruitment_Status["PAYMENT"] = "COMPLETED";
                            }
                            if (posp_user_data["Is_Document_Uploaded"] == "Yes") {
                                Obj_Recruitment_Status["DOCUMENT"] = "COMPLETED";
                            }
                            if (posp_user_data["Is_Training_Completed"] == "Yes") {
                                Obj_Recruitment_Status["TRAINING"] = "COMPLETED";
                            }
                            if (posp_user_data["Exam_Status"] == "Completed") {
                                Obj_Recruitment_Status["EXAM"] = "COMPLETED";
                            }
                            if (posp_user_data["POSP_UploadedtoIIB"] == "Yes") {
                                Obj_Recruitment_Status["IIB"] = "COMPLETED";
                            }
                            if (posp_user_data["Erp_Status"] == "SUCCESS") {
                                Obj_Recruitment_Status["POSCODE"] = "COMPLETED";
                            }

                            let obj_document_status = {};
                            let Document_Rejection_Reason = [];
                            let Document_Rejection_Type = [];
                            if (Posp_Doc_Logs && Posp_Doc_Logs["is_available"] == "YES" && Posp_Doc_Logs["Document_List_Db"].length > 0) {
                                for (let single_doc of Posp_Doc_Logs["Document_List_Db"]) {
                                    let doc_status = single_doc["Status"];
                                    doc_status = (doc_status.indexOf("Reject") > -1) ? "Reject" : doc_status;
                                    obj_document_status[single_doc['Doc_Type']] = {
                                        "Doc_Type": single_doc['Doc_Type'],
                                        "Status": doc_status,
                                        "Remark": single_doc["Remark"]
                                    };
                                    if (doc_status.indexOf("Reject") > -1) {
                                        Document_Rejection_Type.push(single_doc['Doc_Type']);
                                        Document_Rejection_Reason.push(single_doc['Doc_Type'] + " - " + doc_status + " - " + single_doc["Remark"]);
                                    }
                                }
                            }
                            Document_Rejection_Type = Document_Rejection_Type.join(" , ");
                            Document_Rejection_Reason = Document_Rejection_Reason.join(" , ");

                            let Name_On_PAN = posp_user_data.Name_On_PAN || "";
                            let Name_On_Aadhar = posp_user_data.Name_On_Aadhar || "";
                            let Name_as_in_Bank = posp_user_data.Name_as_in_Bank || "";
                            let obj_RM = posp_res["RM"] || {};
                            let Rm_Email = "";
                            let Rm_Name = "";
                            let Rm_Branch = "";
                            let Rm_Mobile = "";
                            let Rm_UID = "";
                            let rm_plus_1_email = "";
                            let posp_data_channel = "";
                            if (obj_RM && obj_RM["rm_details"]) {
                                Rm_Email = obj_RM["rm_details"]["email"] || "";
                                Rm_Name = obj_RM["rm_details"]["name"] + "(UID-" + obj_RM["rm_details"]["uid"] + ", SubVertical-" + obj_RM["rm_details"]["sub_vertical"] + ")";
                                Rm_Branch = obj_RM["rm_details"]["agent_city"] || "NA";
                                Rm_UID = obj_RM["rm_details"]["uid"] || "NA";
                                Rm_Mobile = obj_RM["rm_details"]["mobile"] || "NA";
                                rm_plus_1_email = obj_RM["rm_reporting_details"] ? (obj_RM["rm_reporting_details"]["email"] || "") : "";
                            }
                            if (posp_data && posp_data["Channel"])
                            {
                                posp_data_channel = posp_data["Channel"];
                            }
                            let Posp_Code = posp_user_data["Erp_Id"] || "";
                            let Posp_Name = posp_user_data.Name_On_PAN || "";
                            let Posp_Name_Signup = (posp_user_data.First_Name) ? (posp_user_data.First_Name + " " + posp_user_data.Last_Name) : (posp_data.First_Name + " " + posp_data.Last_Name);
                            let Posp_Email = posp_user_data.Email_Id || "";
                            let Posp_Mobile = posp_user_data.Mobile_No || "";
                            let Signup_On = moment(posp_user_data['Created_On']).utcOffset("+00:00");
                            let Training_Schedule_On = moment(posp_user_data['Training_Schedule_On']).utcOffset("+00:00");
                            let Training_Start_Date = (posp_user_data['Training_Start_Date']) ? moment(posp_user_data['Training_Start_Date']).utcOffset("+00:00") : "";
                            let Training_End_Date = (posp_user_data['Training_End_Date']) ? moment(posp_user_data['Training_End_Date']).utcOffset("+00:00") : "";
                            let Document_Uploaded_On = (posp_user_data['Document_Uploaded_On']) ? moment(posp_user_data['Document_Uploaded_On']).utcOffset("+00:00") : "";
                            let Documents_Approved_On = (posp_user_data['Documents_Approved_On']) ? moment(posp_user_data['Documents_Approved_On']).utcOffset("+00:00") : "";
                            let Documents_Verified_On = (posp_user_data['Documents_Verified_On']) ? moment(posp_user_data['Documents_Verified_On']).utcOffset("+00:00") : "";
                            let Payment_On = (posp_user_data['Paid_On']) ? moment(posp_user_data['Paid_On']).utcOffset("+00:00") : "";
                            let IIB_On = (posp_user_data.POSP_UploadedtoIIB == 'Yes' && posp_user_data.POSP_UploadingDateAtIIB) ? moment(posp_user_data.POSP_UploadingDateAtIIB, "DD-MM-YYYY") : "";

                            let Delayed_Days = -1;
                            let Email_Content = "";
                            let Email_Template = "";
                            let Link_to_Action = "";
                            let Sub = "";
                            let Attachment = "";
                            Posp_Name = Posp_Name || Posp_Name_Signup;
                            Posp_Name = titleCase(Posp_Name.toString().toUpperCase());
                            let arr_to = [];
                            let arr_cc = [
                                "posp.onboarding@policyboss.com"
                            ];
                            let posp_user_posp_source = posp_user_data.POSP_Sources || '';
                            let Posp_Age = (posp_user_data['DOB_On_PAN']) ? calAge(posp_user_data['DOB_On_PAN']) : "";
                            let Posp_Password = req.query["posp_password"] || "";
                            let Payment_Link = "https://www.policyboss.com/razorpay?ss_id=" + Ss_Id + "&source=POSP_ONBOARD";
                            let Training_Link = "https://www.policyboss.com/posp-training-dashboard";
                            let Exam_Link = "https://www.policyboss.com/posp-form";
                            let Document_Link = "https://www.policyboss.com/posp-form";
                            let Pos_Dashboard_Link = "https://www.policyboss.com/posp-training-dashboard";
                            let Payment_Invoice_Link = "https://download.policyboss.com/tmp/onboarding_invoices/" + Ss_Id + "/" + Ss_Id + "_invoice_999.pdf";
                            let Appointment_Letter_Link = "https://download.policyboss.com/onboarding_appointments/" + Ss_Id + "/AppointmentLetter_" + Ss_Id + ".pdf";
                            let Training_Certificate_Link = "http://download.policyboss.com/onboarding/download/certificate/" + Ss_Id + "/Certificate_" + Ss_Id + ".pdf";


                            if (Event_Type === "SIGNUP") {
                                //Delayed_Days = moment().utcOffset("+05:30").diff(Signup_On.format("YYYY-MM-DD"), 'days') - 0;
                                Email_Template = 'posp/Posp_Signup_Mail.html';
                                Link_to_Action = "https://www.policyboss.com/posp-training-dashboard";
                                Sub = "POLICYBOSS POSP SIGNUP";
                                arr_to.push(Posp_Email);
                            }
                            if (Event_Type === "RM_ASSIGNED" || Event_Type === "RM_UPDATED") { // DONE
                                Email_Template = 'posp/Posp_Rm_Assigned_Updated_Mail.html';
                                if (Event_Type === "RM_ASSIGNED") {
                                    Sub = "RELATIONSHIP MANAGER ASSIGNED";
                                }
                                if (Event_Type === "RM_UPDATED") {
                                    Sub = "RELATIONSHIP MANAGER UPDATED";
                                }
                                arr_to.push(Posp_Email);
                            }
                            if (Event_Type === "PAYMENT_LINK") { // DONE
                                Delayed_Days = moment().utcOffset("+05:30").diff(Signup_On.format("YYYY-MM-DD"), 'days') - 0;
                                Email_Template = 'posp/Posp_Payment_Mail.html';
                                Link_to_Action = "https://www.policyboss.com/razorpay?ss_id=" + Ss_Id + "&source=POSP_ONBOARD";
                                Sub = "POSP PAYMENT LINK";
                                arr_to.push(Posp_Email);
                            }
                            if (Event_Type === "PAYMENT_DONE") { // done
                                Email_Template = 'posp/Posp_Payment_Invoice_Mail.html';
                                Link_to_Action = "https://download.policyboss.com/tmp/onboarding_invoices/" + Ss_Id + "/" + Ss_Id + "_invoice_999.pdf";
                                Sub = "POSP PAYMENT COMPLETED";
                                arr_to.push(Posp_Email);
                                Attachment = "/onboarding_invoices/" + Ss_Id + "/" + Ss_Id + "_invoice_999.pdf";
                            }
                            if (Event_Type === "PAYMENT_NOT_DONE") { // done
                                Email_Template = 'posp/Posp_Payment_Not_Done_Mail.html';
                                Link_to_Action = "https://www.policyboss.com/razorpay?ss_id=" + Ss_Id + "&source=POSP_ONBOARD";
                                Sub = "POSP PAYMENT PENDING";
                                arr_to.push(Posp_Email);
                            }
                            if (Event_Type === "TRAINING_LINK") { // done
                                Delayed_Days = moment().utcOffset("+05:30").diff(Signup_On.format("YYYY-MM-DD"), 'days') - 0;
                                Email_Template = 'posp/Posp_Training_Schedule_Mail.html';
                                Link_to_Action = "https://www.policyboss.com/posp-training-dashboard";
                                Sub = "POSP TRAINING LINK";
                                arr_to.push(Posp_Email);
                            }
                            if (Event_Type === "DOCUMENT_LINK") { // DONE
                                Delayed_Days = moment().utcOffset("+05:30").diff(Signup_On.format("YYYY-MM-DD"), 'days') - 0;
                                Email_Template = 'posp/Posp_Document_Due_Mail.html';
                                Link_to_Action = "https://www.policyboss.com/posp-form";
                                Sub = "POSP DOCUMENT LINK";
                                arr_to.push(Posp_Email);
                            }
                            if (Event_Type === "TRAINING_START" || Event_Type === "TRAINING_ATTEMPT") { //VERIFY
                                //Delayed_Days = moment().utcOffset("+05:30").diff(Signup_On.format("YYYY-MM-DD"), 'days') - 0;
                                Email_Template = 'posp/Posp_Training_Start_Mail.html';
                                Link_to_Action = "https://www.policyboss.com/posp-training-dashboard";
                                Sub = "POSP TRAINING STARTED";
                                arr_to.push(Posp_Email);
                            }
                            if (Event_Type === "DOCUMENT_UPLOADED") { // verify
                                Email_Template = 'posp/Posp_Document_Acknowledge_Mail.html';
                                Link_to_Action = "https://www.policyboss.com/posp-training-dashboard";
                                Sub = "POSP DOCUMENT UPLOADED";
                                arr_to.push(Posp_Email);
                            }
                            if (Event_Type === "DOCUMENT_VERIFICATION_REQUEST") { // TO VERIFIER	DONE
                                Email_Template = 'posp/Posp_Document_Verify_Request_Mail.html';
                                Link_to_Action = "https://www.policyboss.com/posp-training-dashboard";
                                Sub = "REQUEST TO VERIFY DOCUMENT";
                                arr_to.push('sandeep.nair@landmarkinsurance.in');
                                arr_cc.push("posp.ops@policyboss.com");
                            }
                            if (Event_Type === "DOCUMENT_REJECTED") {
                                Email_Template = 'posp/Posp_Document_Rejection_Mail.html';
                                Link_to_Action = "https://www.policyboss.com/posp-training-dashboard";
                                Sub = "POSP DOCUMENT REJECTED";
                                arr_to.push(Posp_Email);
                                arr_cc.push('sandeep.nair@landmarkinsurance.in');
                                //arr_cc.push('ronald.mathais@policyboss.com');								
                                arr_cc.push("posp.ops@policyboss.com");
                            }
                            if (Event_Type === "DOCUMENT_APPROVE_REQUEST") { // TO approver done
                                Email_Template = 'posp/Posp_Document_Approve_Request_Mail.html';
                                Link_to_Action = "https://www.policyboss.com/posp-training-dashboard";
                                Sub = "REQUEST TO APPROVE DOCUMENT";
                                arr_to.push('ronald.mathais@policyboss.com');
                                arr_to.push('sandeep.nair@landmarkinsurance.in');
                                arr_cc.push("posp.ops@policyboss.com");
                            }
                            if (Event_Type === "IIB_UPLOAD_REQUEST") { // TO VERIFIER	
                                Email_Template = 'posp/Posp_IIB_Upload_Request_Mail.html';
                                Link_to_Action = "https://www.policyboss.com/posp-training-dashboard";
                                Sub = "REQUEST TO UPLOAD IIB";
                                arr_to.push('ronald.mathais@policyboss.com');
                                arr_to.push('sandeep.nair@landmarkinsurance.in');
                                arr_cc.push("posp.ops@policyboss.com");
                            }
                            if (Event_Type === "EXAM_LINK" && IIB_On !== "" && Training_End_Date !== "") {
                                Delayed_Days = moment().utcOffset("+05:30").diff(Training_End_Date.format("YYYY-MM-DD"), 'days') - 0;
                                if ((IIB_On.format("YYYYMMDD") - 0) > (Training_End_Date.format("YYYYMMDD") - 0)) {
                                    Delayed_Days = moment().utcOffset("+05:30").diff(IIB_On.format("YYYY-MM-DD"), 'days') - 0;
                                }
                                Email_Template = 'posp/Posp_Training_Complete_Mail.html';
                                Link_to_Action = "https://www.policyboss.com/posp-form";
                                Sub = "POSP EXAM LINK";
                                arr_to.push(Posp_Email);
                            }
                            if (Event_Type === "EXAM_PASS") {
                                Email_Template = 'posp/Posp_Exam_Pass_Mail.html';
                                Link_to_Action = "http://download.policyboss.com/onboarding/download/certificate/" + Ss_Id + "/Certificate_" + Ss_Id + ".pdf";
                                Sub = "POSP EXAM PASS";
                                Attachment = "/onboarding_certificates/" + Ss_Id + "/Certificate_" + Ss_Id + ".pdf";
                                arr_to.push(Posp_Email);
                            }
                            if (Event_Type === "APPOINTMENT_LETTER") {
                                Email_Template = 'posp/Posp_IIB_Uploaded_Mail.html';
                                Link_to_Action = "https://www.policyboss.com/posp-training-dashboard";
                                Sub = "POSP DOCUMENT REJECTED";
                                arr_to.push(Posp_Email);
                            }
                            if (Event_Type === "IIB_UPLOADED") {
                                Email_Template = 'posp/Posp_IIB_Uploaded_Mail.html';
                                Sub = "POS DATA UPLOADED TO IIB";
                                arr_cc.push("posp.ops@policyboss.com");
                                arr_to.push(Posp_Email);
                            }
                            if (Event_Type === "ERP_CODE") {	// done
                                Email_Template = 'posp/Posp_Erp_Code_Generated_Mail.html';
                                Sub = "POSP CODE GENERATED";
                                arr_to.push(Posp_Email);
                            }
                            let Delayed_Days_Text = "";
                            if (Delayed_Days >= 0) {
                                let Delayed_Days_Text = (Delayed_Days > 0) ? ((Delayed_Days == 1) ? "Due Yesterday" : "Due " + Delayed_Days + " Days") : "Due Today";
                                Delayed_Days_Text = "[" + Delayed_Days_Text + "]";
                                Delayed_Days_Text = Delayed_Days_Text.toUpperCase();
                            }
                            let Email = require('../models/email');
                            let objModelEmail = new Email();
                            let email_data = '';
                            objMail = {
                                '___posp_email___': Posp_Email,
                                '___posp_age___': Posp_Age,
                                '___posp_password___': Posp_Password,
                                '___ss_id___': Ss_Id,
                                '___posp_name___': Posp_Name,
                                '___erp_code___': Posp_Code,
                                '___rm_name___': Rm_Name || "NA",
                                '___rm_email___': Rm_Email || "NA",
                                '___rm_mobile___': Rm_Mobile || "NA",
                                '___rm_branch___': Rm_Branch || "NA",
                                '___rm_uid___': Rm_UID || "NA",
                                '___rm_subvertical___': posp_data["SubVertical"] || "NA",
                                '___channel___': posp_data["Channel"] || "NA",
                                '___Name_On_PAN___': Name_On_PAN,
                                '___Name_On_Aadhar___': Name_On_Aadhar,
                                '___Name_as_in_Bank___': Name_as_in_Bank,
                                '___Signup_On___': Signup_On ? Signup_On.format("D MMM,YYYY") : "",
                                '___training_schedule_on___': Training_Schedule_On ? Training_Schedule_On.format("D MMM,YYYY") : "",
                                '___training_start_on___': Training_Start_Date ? Training_Start_Date.format("D MMM,YYYY") : "",
                                '___training_end_on___': Training_End_Date ? Training_End_Date.format("D MMM,YYYY") : "",
                                '___document_uploaded_on___': Document_Uploaded_On ? Document_Uploaded_On.format("D MMM,YYYY") : "",
                                '___documents_verified_on___': Documents_Verified_On ? Documents_Verified_On.format("D MMM,YYYY") : "",
                                '___documents_approved_on___': Documents_Approved_On ? Documents_Approved_On.format("D MMM,YYYY") : "",
                                '___iib_uploaded_on___': IIB_On ? IIB_On.format("D MMM,YYYY") : "",
                                '___delayed_days_text___': Delayed_Days_Text.toUpperCase(),
                                '___short_url___': Link_to_Action,
                                '___link_to_action___': Link_to_Action,
                                '___payment_status___': Obj_Recruitment_Status["PAYMENT"],
                                '___document_status___': Obj_Recruitment_Status["DOCUMENT"],
                                '___training_status___': Obj_Recruitment_Status["TRAINING"],
                                '___iib_status___': Obj_Recruitment_Status["IIB"],
                                '___exam_status___': Obj_Recruitment_Status["EXAM"],
                                '___poscode_status___': Obj_Recruitment_Status["POSCODE"],
                                '___payment_status_color___': (Obj_Recruitment_Status["PAYMENT"] === "COMPLETED") ? "green" : "red",
                                '___document_status_color___': (Obj_Recruitment_Status["DOCUMENT"] === "COMPLETED") ? "green" : "red",
                                '___training_status_color___': (Obj_Recruitment_Status["TRAINING"] === "COMPLETED") ? "green" : "red",
                                '___iib_status_color___': (Obj_Recruitment_Status["IIB"] === "COMPLETED") ? "green" : "red",
                                '___exam_status_color___': (Obj_Recruitment_Status["EXAM"] === "COMPLETED") ? "green" : ((Obj_Recruitment_Status["EXAM"] === "NOT-SCHEDULE") ? "#1981ff" : "red"),
                                '___poscode_status_color___': (Obj_Recruitment_Status["POSCODE"] === "COMPLETED") ? "green" : "red",
                                '___training_start_otp___': posp_user_data["Training_Start_Otp"] || "",
                                '___payment_link___': Payment_Link,
                                '___training_link___': Training_Link,
                                '___exam_link___': Exam_Link,
                                '___document_link___': Document_Link,
                                '___pos_dashboard_link___': Pos_Dashboard_Link,
                                '___payment_invoice_link___': Payment_Invoice_Link,
                                '___appointment_letter_link___': Appointment_Letter_Link,
                                '___training_certificate_link___': Training_Certificate_Link,
                                '___payment_link_style___': 'block'
                            };
                            if (['TESTUSER','FPOS'].indexOf(posp_user_posp_source) > -1)
                            {
                                objMail['___payment_link_style___'] = "none";
                            }
                            if (Event_Type == "DOCUMENT_REJECTED") {

                                objMail['___profile_pic_status___'] = obj_document_status["PROFILE"]["Status"] + (obj_document_status["PROFILE"]["Status"].indexOf("Reject") > -1 ? (" - " + obj_document_status["PROFILE"]["Remark"]) : "");

                                objMail['___profile_pic_rejected_by___'] = obj_document_status["PROFILE"]["Status"].indexOf("Reject") > -1 ? (obj_document_status["PROFILE"]["Status"].indexOf("V-Reject") > -1 ? "VERIFIER" : "APPROVER") : "NA";

                                objMail['___profile_pic_rejected_remarks___'] = obj_document_status["PROFILE"]["Status"].indexOf("Reject") > -1 ? obj_document_status["PROFILE"]["Remark"] : "";

                                objMail['___profile_doc_status___'] = obj_document_status["PROFILE"]["Status"] || "NA";

                                objMail['___pan_status___'] = obj_document_status["PAN"]["Status"] + (obj_document_status["PAN"]["Status"].indexOf("Reject") > -1 ? (" - " + obj_document_status["PAN"]["Remark"]) : "");

                                objMail['___pan_rejected_by___'] = obj_document_status["PAN"]["Status"].indexOf("Reject") > -1 ? (obj_document_status["PAN"]["Status"].indexOf("V-Reject") > -1 ? "VERIFIER" : "APPROVER") : "NA";

                                objMail['___pan_rejected_remarks___'] = obj_document_status["PAN"]["Status"].indexOf("Reject") > -1 ? obj_document_status["PAN"]["Remark"] : "";

                                objMail['___pan_doc_status___'] = obj_document_status["PAN"]["Status"] || "NA";

                                /*objMail['___aadhar_status___'] = obj_document_status["AADHAAR"]["Status"]+ (obj_document_status["AADHAAR"]["Status"].indexOf("Reject") > -1 ? (" - "+ obj_document_status["AADHAAR"]["Remark"] ): "");
                                 
                                 objMail['___aadhar_back_status___'] = obj_document_status["AADHAAR_BACK"]["Status"]+ (obj_document_status["AADHAAR_BACK"]["Status"].indexOf("Reject") > -1 ? (" - "+ obj_document_status["AADHAAR_BACK"]["Remark"] ): "");
                                 
                                 objMail['___aadhar_rejected_by___'] = obj_document_status["AADHAAR"]["Status"].indexOf("Reject") > -1 ? (obj_document_status["AADHAAR"]["Status"].indexOf("V-Reject") > -1 ? "VERIFIER" : "APPROVER" ): "NA";
                                 
                                 objMail['___aadhar_rejected_remarks___'] =  obj_document_status["AADHAAR"]["Status"].indexOf("Reject") > -1 ? obj_document_status["AADHAAR"]["Remark"] : "";
                                 
                                 objMail['___aadhar_doc_status___'] = obj_document_status["AADHAAR"]["Status"] || "NA";*/

                                objMail['___education_status___'] = obj_document_status["QUALIFICATION"]["Status"] + (
                                        obj_document_status["QUALIFICATION"]["Status"].indexOf("Reject") > -1 ? (" - " + obj_document_status["QUALIFICATION"]["Remark"]) : "");
                                objMail['___education_rejected_by___'] = obj_document_status["QUALIFICATION"]["Status"].indexOf("Reject") > -1 ? (obj_document_status["QUALIFICATION"]["Status"].indexOf("V-Reject") > -1 ? "VERIFIER" : "APPROVER") : "NA";

                                objMail['___education_rejected_remarks___'] = obj_document_status["QUALIFICATION"]["Status"].indexOf("Reject") > -1 ? obj_document_status["QUALIFICATION"]["Remark"] : "";

                                objMail['___education_doc_status___'] = obj_document_status["QUALIFICATION"]["Status"] || "NA";

                                objMail['___cheque_status___'] = obj_document_status["POSP_ACC_DOC"]["Status"] + (obj_document_status["POSP_ACC_DOC"]["Status"].indexOf("Reject") > -1 ? (" - " + obj_document_status["POSP_ACC_DOC"]["Remark"]) : "");

                                objMail['___cheque_rejected_by___'] = obj_document_status["POSP_ACC_DOC"]["Status"].indexOf("Reject") > -1 ? (obj_document_status["POSP_ACC_DOC"]["Status"].indexOf("V-Reject") > -1 ? "VERIFIER" : "APPROVER") : "NA";

                                objMail['___cheque_rejected_remarks___'] = obj_document_status["POSP_ACC_DOC"]["Status"].indexOf("Reject") > -1 ? obj_document_status["POSP_ACC_DOC"]["Remark"] : "";

                                objMail['___cheque_doc_status___'] = obj_document_status["POSP_ACC_DOC"]["Status"] || "NA";
                                
                                objMail['___kyc_status___'] = "";
                                objMail['___kyc_rejected_by___'] = "";
                                objMail['___kyc_rejected_remarks___'] = "";
                                objMail['___kyc_row_style___'] = "none";
                                
                                if (Is_Testing === 'yes' && moment(posp_user_data['Created_On']).isAfter(new Date('2024-07-01'), 'day') && posp_user_data['KYC_Status'] && ['SUCCESS', 'FAIL'].indexOf(posp_user_data['KYC_Status']) > -1) {
                                    try {
                                        objMail['___kyc_status___'] = obj_document_status["KYC"] && (obj_document_status["KYC"]["Status"] + (obj_document_status["KYC"]["Status"].indexOf("Reject") > -1 ? (" - " + obj_document_status["KYC"]["Remark"]) : ""));
                                        objMail['___kyc_rejected_by___'] = obj_document_status["KYC"] && (obj_document_status["KYC"]["Status"].indexOf("Reject") > -1 ? (obj_document_status["KYC"]["Status"].indexOf("V-Reject") > -1 ? "VERIFIER" : "APPROVER") : "NA");
                                        objMail['___kyc_rejected_remarks___'] = obj_document_status["KYC"] && (obj_document_status["KYC"]["Status"].indexOf("Reject") > -1 ? obj_document_status["KYC"]["Remark"] : "");
                                        objMail['___kyc_row_style___'] = "contents";
                                    } catch (e) {
                                        console.error('uncaugth exception while creating kyc doc rejection mail obj');
                                    }
                                }
                            }
                            if (false && ["DOCUMENT_VERIFICATION_REQUEST", "DOCUMENT_APPROVE_REQUEST", "IIB_UPLOAD_REQUEST"].indexOf(Event_Type) > -1) {

                            } else {
                                if (Event_Type === "SIGNUP") {
                                    arr_to = [Posp_Email];
                                    arr_cc = [];
                                } else {
                                    if (Rm_Email !== '') {
                                        arr_cc.push(Rm_Email);
                                    }
                                    if (rm_plus_1_email !== '') {
                                        //arr_cc.push(rm_plus_1_email);
                                    }
                                }
                            }
                            //email_data = fs.readFileSync(appRoot + '/resource/email/'+Email_Template).toString();
                            //email_data = email_data.replaceJson(objMail);
                            Sub = "[POSP-ONBOARDING]" + Delayed_Days_Text + " " + Sub + " :: SSID-" + Ss_Id;
                            if (req.query['dbg'] === 'yes') {
                                email_data = fs.readFileSync(appRoot + '/resource/email/posp/' + Email_Template).toString();
                                email_data = email_data.replaceJson(objMail);
                                objModelEmail.send('noreply@policyboss.com', config.environment.notification_email, Sub, email_data, "", "", 0, Ss_Id, Attachment);
                            } else {
                                email_data = fs.readFileSync(appRoot + '/resource/email/' + Email_Template).toString();
                                email_data = email_data.replaceJson(objMail);
                                objModelEmail.send('noreply@policyboss.com', arr_to.join(","), Sub, email_data, arr_cc.join(","), config.environment.notification_email, 0, Ss_Id, Attachment);
                            }
                            obj_mail_summary["Status"] = "Success";
                            obj_mail_summary["Msg"] = "Mail_Sent";
                            let Arr_Posp_Sync = [
                                "DOCUMENT_UPLOADED",
                                "IIB_UPLOADED",
                                "ERP_CODE",
                            ];
                            if (Arr_Posp_Sync.indexOf(Event_Type) > -1) {
                                Const_Obj_Client.get(config.environment.weburl + '/posps/mssql/sync_pospuser_to_posp?ss_id=' + Ss_Id + '&dbg=no');
                            }
                            //web engage api start
                            try {
                                let Arr_Webengage_Event = [
                                    "SIGNUP", //done
                                    "PAYMENT_NOT_DONE", // payment cancel
                                    "PAYMENT_DONE", //done
                                    "TRAINING_START",
                                    "TRAINING_FINISH",
                                    "DOCUMENT_UPLOADED",
                                    "DOCUMENT_REJECTED",
                                    "IIB_UPLOAD_REQUEST", // document approved
                                    "IIB_UPLOADED", // done
                                    "EXAM_PASS", //done
                                    "ERP_CODE",
                                    "RM_UPDATED",
                                ];
                                if (Arr_Webengage_Event.indexOf(Event_Type) > -1 && ["POSP"].indexOf(posp_res.user_type) > -1) {
                                    let Obj_Webengage_Event = {
                                        "posp_email": Posp_Email,
                                        "request_type": Event_Type,
                                        "request_data": {
                                            "POSP_Number": Ss_Id,
                                            "Payable_Amount": 999,
                                            "Payment_Link": Payment_Link,
                                            "Customer_Name": Posp_Name,
                                            "Platform_Name": "",
                                            "ERP_Code": Posp_Code,
                                            "Invoice_URL": Payment_Invoice_Link,
                                            "Training_Start_Date": Training_Start_Date ? Training_Start_Date.format("YYYY-MM-DD") : "", //"T17:19:43.000Z",
                                            "Training_Category": "General Insurance & Life Insurance",
                                            "Training_Duration_in_hours": 30, // 0 default
                                            "Training_Link": Training_Link,
                                            "Relationship_Manager_Name": Rm_Name,
                                            "Relationship_Manager_Contact": Rm_Mobile,
                                            "Reporting_Email_ID": Rm_Email,
                                            "Channel": posp_data_channel,
                                            "Exam_Link": Exam_Link,
                                            "Status": (Event_Type == "EXAM_PASS") ? "pass" : "", // Exam Status pass or fail
                                            "Certificate_URL": Training_Certificate_Link,
                                            "Login_ID": Posp_Email,
                                            "Password": Posp_Password,
                                            "Stage": "", // verifier or approver
                                            "Document_Type": Document_Rejection_Type || "",
                                            "Business_Vertical": posp_data["Vertical"] || "",
                                            "Sub_Vertical": posp_data["SubVertical"] || "",
                                            "Rejection_Reason": (Event_Type == "DOCUMENT_REJECTED") ? Document_Rejection_Reason : "",
                                            "Appointment_Letter_Link": Appointment_Letter_Link || "",
                                            "Weekly_Total_Health_Sales": 0,
                                            "Weekly_Total_Health_Sales_Premium": 0,
                                            "Weekly_Total_Motor_Car_Sales": 0,
                                            "Weekly_Total_Motor_Car_Premium": 0,
                                            "Weekly_Total_Life_Ins_Sales": 0,
                                            "Weekly_Total_Life_Ins_Premium": 0,
                                            "Monthly_Total_Health_Sales": 0,
                                            "Monthly_Total_Health_Sale_Premium": 0,
                                            "Monthly_Total_Motor_Car_Sales": 0,
                                            "Monthly_Total_Motor_Car_Premium": 0,
                                            "Monthly_Total_Life_Ins_Sales": 0,
                                            "Monthly_Total_Life_Ins_Premium": 0,
                                            "Posp_User_Sources": posp_user_posp_source,
                                            "Posp_User_Sources": posp_user_posp_source
                                        }
                                    };
                                    console.error("DBG", "WEBENGAGE REQUEST", "EVENT", Obj_Webengage_Event, Event_Type);
                                    let Obj_Webengage_Event_Args = {
                                        data: Obj_Webengage_Event,
                                        headers: {"Content-Type": "application/json"}
                                    };
                                    Const_Obj_Client.post(config.environment.weburl + '/postservicecall/webengage_service_call', Obj_Webengage_Event_Args, function (webengage_data, webengage_response) {
                                        console.error("DBG", "WEBENGAGE", "EVENT", webengage_data);
                                    });
                                }
                            } catch (e) {
                                console.error("EXCEPTION", "WEBENGAGE", "EVENT", e.stack);
                            }
                            //web engage api finish
                        } else {
                            obj_mail_summary["Status"] = "Fail";
                            obj_mail_summary["Msg"] = "Ss_Id not found";
                        }
                    } catch (ex) {
                        obj_mail_summary["Status"] = "Fail";
                        obj_mail_summary["Msg"] = ex.stack;
                    }
                    obj_mail_summary["objMail"] = objMail;
                    return res.json(obj_mail_summary);
                });
            } else {
                obj_mail_summary["Status"] = "Fail";
                obj_mail_summary["Msg"] = "Ss_Id not found";
            }
        } catch (ex) {
            obj_mail_summary["Status"] = "Fail";
            obj_mail_summary["Msg"] = ex.stack;
            return res.json(obj_mail_summary);
        }
    });
	app.get('/posps/report/batch_sync_signup_inquiry', function (req, res) {
		let date_from = req.query["date_from"] || "";
		let date_to = req.query["date_to"] || "";
		if(date_from !== "" && date_to !== ""){			
			let obj_cond_posp = {
				"Created_On" : {
					"$gte" : moment(date_from).startOf("day").toDate(),
					"$lte" : moment(date_to).endOf("day").toDate()
				}
			}
			if(req.query["is_erp"] === "yes"){
				obj_cond_posp["Is_Certified"] = 1;
			}
			Posp.find(obj_cond_posp).exec(function (err, dbPosps) {
				let arr_url = [];
				if(dbPosps){
					for(let indPosp of dbPosps){
						indPosp = indPosp._doc;
						let ss_id = indPosp['Ss_Id'] - 0;
						if(ss_id > 0){
							arr_url.push(ss_id);
							if(req.query['dbg'] === "yes"){
								
							}
							else{	
								client.get(config.environment.weburl + '/posps/report/sync_signup_inquiry?ss_id=' + ss_id , {}, function (data, response) {});
								sleep(200);
							}
						}
					}
				}
				res.send("processed::"+ ((dbPosps) ? dbPosps.length : 0)+",List::"+arr_url.join(','));
			});
		}
		else{
			res.send("NA");
		}
	});
	app.get('/posps/report/sync_signup_inquiry', function (req, res) {
		let obj_Syncedup_Signup = {
			"status" : "PENDING",
			"data" : null,
			"html" : null
		};
		let Ss_Id = req.query.ss_id ? req.query.ss_id -0  : 0;
		let Obj_Input = {
			"Ss_Id" : Ss_Id
		};
		if(Ss_Id > 0){
			client.get(config.environment.weburl + '/posps/dsas/view/' + Ss_Id.toString(), {}, function (posp_data, posp_response) {
				try {
					if (posp_data && posp_data['status'] === 'SUCCESS' && ["POSP","FOS"].indexOf(posp_data["user_type"]) > -1) {
						let Posp_Enquiry = require('../models/posp_enquiry');
						let Posp_Sql_Data = posp_data["POSP"] || {};
						let Posp_User_Data = posp_data["POSP_USER"] || {};
						Obj_Input['Name'] = Posp_User_Data["Name_On_PAN"] || (Posp_Sql_Data["First_Name"] + " "+ Posp_Sql_Data["Last_Name"]);
						Obj_Input['TYPE'] = posp_data["user_type"];
						Obj_Input['Vertical'] = Posp_Sql_Data["SubVertical"] || "";
						Obj_Input['Channel'] = Posp_Sql_Data["Channel"] || "";					
						Obj_Input['Mobile_No'] = Posp_Sql_Data.Mobile_No || (Posp_User_Data.Mobile_No || "");
						Obj_Input['Email_Id'] = Posp_Sql_Data.Email_Id || (Posp_User_Data.Email_Id || "");
						Obj_Input['Pan_No'] = Posp_Sql_Data.Pan_No || (Posp_User_Data.Pan_No || "");
						Obj_Input['Aadhar'] = Posp_Sql_Data.Aadhar || (Posp_User_Data.Aadhar || "");
						let Signup_On = Posp_Sql_Data.Created_On || (Posp_User_Data.Created_On || "");
						let Erpcode_On = null;
						let Erpcode_On_Display = null;
						if(Posp_Sql_Data["Erp_Id"] && (Posp_Sql_Data["Erp_Id"] -0) > 0){
							Erpcode_On = Posp_Sql_Data["ERPID_CreatedDate"];
							Erpcode_On_Display =  moment(Erpcode_On).utcOffset("+00:00").format("YYYY-MM-DD");
							Obj_Input['Erp_Id'] = Posp_Sql_Data["Erp_Id"];
							Obj_Input['Erpcode_On'] = Erpcode_On;
						}
						let Signup_On_Display = moment(Signup_On).utcOffset("+00:00").format("YYYY-MM-DD");
						Obj_Input['Signup_On'] = Signup_On;
						let arr_cond = [
							{"mobile" : Obj_Input['Mobile_No'].toString()}
						];
						if(Obj_Input['Email_Id'] !== ""){
							arr_cond.push({"email" : Obj_Input['Email_Id'].toString().toLowerCase()});
						}
						if(Obj_Input['Pan_No'] !== ""){
							arr_cond.push({"pan" : Obj_Input['Pan_No'].toString()});
						}
						if(Obj_Input['Aadhar'] !== ""){
							arr_cond.push({"aadhaar" : Obj_Input['Aadhar'] - 0});
						}			
						let Obj_Cond_Posp_Enquiry = {
							"$or" : arr_cond
						};
						obj_Syncedup_Signup["Obj_Input"] = Obj_Input;
						Posp_Enquiry.find(Obj_Cond_Posp_Enquiry).select("-_id -search_parameter").sort({"Created_On":-1}).exec(function(Err_Posp_Enquiry,Db_Posp_Enquiries){
							try{
								let Email = require('../models/email');
								let objModelEmail = new Email();					
								let res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>SYNC-INQUIRY-SIGNUP</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
								if (req.query['dbg'] == 'yes') {
									res_report += '<p><h1>DB QUERY CONDITION</h1><BR><pre>' + JSON.stringify(Obj_Cond_Posp_Enquiry, undefined, 2) + '</pre><p>';
								}
								let subject = '[POSP-SYNC-INQUIRY-SIGNUP] UNMATCHED :: SSID-' + Obj_Input['Ss_Id'];
								if(Db_Posp_Enquiries && Db_Posp_Enquiries.length > 0){
									let arr_Posp_Inquiry_Id =[];
									for(let i in Db_Posp_Enquiries){
										let Ind_Posp_Enquiry = Db_Posp_Enquiries[i]._doc;
										Db_Posp_Enquiries[i] = Db_Posp_Enquiries[i]._doc;
										arr_Posp_Inquiry_Id.push(Ind_Posp_Enquiry["Posp_Enquiry_Id"]);
									}
									if(Db_Posp_Enquiries[0]["Erp_Id"] && Db_Posp_Enquiries[0]["Erp_Id"] > 0){
										obj_Syncedup_Signup['status'] = "VALIDATION";
										obj_Syncedup_Signup['data'] = Db_Posp_Enquiries;
										obj_Syncedup_Signup['detail'] = "ALREADY_PROCESSED";
										return res.json(obj_Syncedup_Signup);
									}
									if(arr_Posp_Inquiry_Id.length > 0){
										let obj_update_inquiry = {"Ss_Id":Ss_Id,"Signup_On":Signup_On};
										if(Erpcode_On){
											obj_update_inquiry["Erp_Id"] = Obj_Input['Erp_Id'];
											obj_update_inquiry["Erpcode_On"] = Erpcode_On;
										}
										Posp_Enquiry.updateMany({"Posp_Enquiry_Id":{"$in":arr_Posp_Inquiry_Id}},{"$set":obj_update_inquiry}, function (err, updatedPosp_Enquiry) {
											if (err){
												console.error(err);
											}
											else{
												console.error("updatedPosp_Enquiry : ", updatedPosp_Enquiry);
											}
										});
									}
									
									let Inquiry_On  = moment(Db_Posp_Enquiries[0]["Created_On"]).utcOffset("+00:00").format("YYYY-MM-DD");
									let Signup_Age = moment(Signup_On_Display).diff(Inquiry_On, 'days') - 0;					
									
									Obj_Input["Inquiry_To_Signup"] = Signup_Age + " Day(s)";
									Obj_Input["Inquiry_On"] = Inquiry_On;
									subject = '[POSP-SYNC-INQUIRY-SIGNUP] MATCHED :: SSID-' + Obj_Input['Ss_Id']  + " :: Inquiry_To_Signup-"+ Obj_Input["Inquiry_To_Signup"];
									if(Erpcode_On){
										subject += " :: Erp_On-"+Erpcode_On_Display;
									}
									obj_Syncedup_Signup["Obj_Input"] = Obj_Input;
									obj_Syncedup_Signup["status"] = "SUCCESS";
									res_report += '<p>Following POSP(s) signup are matched from Posp Inquiry.';
									res_report += '<p><h1>SIGNUP INPUT</h1>';
									res_report += objectToHtml(Obj_Input);
									res_report += '</p>';
									res_report += '<p><h1>Inquiry List :: Count-' + Db_Posp_Enquiries.length + '</h1>';
									res_report += arrayobjectToHtml(Db_Posp_Enquiries);
									res_report += '</p>';
									res_report += '</body></html>';
									if (req.query['dbg'] == 'yes') {
										objModelEmail.send('notifications@policyboss.com', config.environment.notification_email,
												subject, res_report, '', '');
									} else {
										objModelEmail.send('notifications@policyboss.com', 'marketing@policyboss.com,varun.kaushik@policyboss.com',
												subject, res_report, '', config.environment.notification_email);
									}
										
								}
								else{
									obj_Syncedup_Signup["status"] = "FAIL";
									res_report += '<p><h1>SIGNUP INPUT</h1>';
									res_report += objectToHtml(Obj_Input);
									res_report += '</p>';
									res_report += '</body></html>';
									objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, subject, res_report, '', '');
								}
								obj_Syncedup_Signup["html"] = res_report;
								return res.json(obj_Syncedup_Signup);
							}
							catch(e){
								obj_Syncedup_Signup['status'] = "EXCEPTION";
								obj_Syncedup_Signup['detail'] = e.stack;
								return res.json(obj_Syncedup_Signup);
							}
						});
					}
					else{
						obj_Syncedup_Signup['status'] = "VALIDATION";
						obj_Syncedup_Signup['detail'] = "INVALID";
						return res.json(obj_Syncedup_Signup);
					}
				}
				catch(e){
					obj_Syncedup_Signup['status'] = "EXCEPTION";
					obj_Syncedup_Signup['detail'] = e.stack;
					return res.json(obj_Syncedup_Signup);
				}
			});	
		}
		else{
			obj_Syncedup_Signup['status'] = "VALIDATION";
			obj_Syncedup_Signup['detail'] = "SSID_NA";
			return res.json(obj_Syncedup_Signup);
		}	
    });    
    app.get('/posps/onboarding/generate_payment_link', function (req, res) {
        try {
            let fba_id = req.query['fba_id'] || 0;
            fba_id = fba_id - 0;
            let obj_payment = {
                'err': '',
                'payment_link': '',
                'raw_data': null
            };
            if (fba_id) {
                
                
                var args = {
                    data: {
                        "FBAID": fba_id - 0
                    },
                    headers: {
                        "Content-Type": "application/json",
                        "token": "1234567890"
                    }
                };
                client.post('http://api.magicfinmart.com/api/GetPaymentLink', args, function (data, response) {
                    obj_payment['raw_data'] = data;
                    if (data && data.hasOwnProperty('Status') && data['Status'] == 'success' && data['MasterData']['shorturl']) {
                        obj_payment['payment_link'] = data['MasterData']['shorturl'];
                    } else {
                        obj_payment['err'] = 'URL_NOT_GENERATED';
                    }
                    res.json(obj_payment);
                });
            } else {
                obj_payment['err'] = 'Invalid_FbaId';
                res.json(obj_payment);
            }

        } catch (e) {
            res.send(e.stack);
        }
    });
    app.get('/posps/msql/get_document_list', function (req, res) {
        try {
            let ss_id = req.query['ss_id'] || 0;
            ss_id = ss_id - 0;
            let obj_posp_document = {
                'err': '',
                'err_details': '',
                'result': [],
				'doc_mongo': [],
				'doc_sql': [],
				'result_adv' : null
            };
            if (ss_id > 0 && isNaN(ss_id) === false) {
                let sql = require("mssql");
                sql.close();
                sql.connect(config.pospsqldb, function (conn_err) {
                    if (conn_err) {
                        obj_posp_document['err'] = 'DB_CON_ERR';
                        obj_posp_document['err_details'] = conn_err;
                        res.json(obj_posp_document);
                    } else {
                        let posp_request = new sql.Request();
                        let posp_qry_str = 'select * from Posp_Document where SS_ID = ' + ss_id;
                        posp_request.query(posp_qry_str, function (qry_err, recordset) {
							try{
								if (qry_err) {
									obj_posp_document['err'] = 'DB_DATA_ERR';
									obj_posp_document['err_details'] = qry_err;
								} else {
									obj_posp_document['result'] = recordset.recordset;
									let obj_document_sql = {
										"is_available" : "NO",
										"Document_List" : {},
										"Posp_Onboarding_Photo" : null
									};
									let posp_onboarding_photo = '';
									if(obj_posp_document['result'] && obj_posp_document['result'].length > 0){
										for(let single_posp_document of obj_posp_document['result']){
											obj_document_sql["Document_List"][single_posp_document['Document_Name']] = single_posp_document['Document_location'].replace('/Posp_Documents//','/Posp_Documents/');
											if(single_posp_document['Document_Name'] === 'Photograph'){
												obj_document_sql["is_available"] = "YES";
												obj_document_sql["Posp_Onboarding_Photo"] = single_posp_document['Document_location'].replace('/Posp_Documents//','/Posp_Documents/');
											}
										}
										
									}
									obj_posp_document['doc_sql'] = obj_document_sql;
									Posp_Doc_Log.find({User_Id:ss_id}).exec(function(err,Db_Posp_Doc_Logs){
										try{
											Db_Posp_Doc_Logs = Db_Posp_Doc_Logs || [];
											obj_posp_document['doc_mongo'] = {};
											let obj_document_mongo = {
												"is_available" : "NO",
												"Document_List" : {},
												"Posp_Onboarding_Photo" : null,
												"Document_List_Db" : Db_Posp_Doc_Logs
											};
											if(Db_Posp_Doc_Logs){												
												let obj_doc_schema = {
													"PROFILE" : "Photograph",
													"PAN" : "Pancard",
													"AADHAAR" : "Aadhar Card",
													"QUALIFICATION" : "10th Certificate",
													"POSP_ACC_DOC" : "Copy of Cancelled Cheque for Self"
												};
												for(let single_posp_document of Db_Posp_Doc_Logs){
													obj_document_mongo["is_available"] = "YES";
													let k_doc = obj_doc_schema[single_posp_document['Doc_Type']] || single_posp_document['Doc_Type'];
													obj_document_mongo["Document_List"][k_doc] = single_posp_document['Doc_URL'];
													if(single_posp_document['Doc_Type'] === 'PROFILE'){
														
														obj_document_mongo["Posp_Onboarding_Photo"] = single_posp_document['Doc_URL'];
													}
													//"PostTraining_Pass": "https://download.policyboss.com/tmp/onboarding_certificates/135737/Certificate_135737.pdf",
												}
											}
											if(obj_document_sql["is_available"] == "NO"){
												obj_posp_document['result_adv'] = obj_document_mongo;										
											}
											else{
												obj_posp_document['result_adv'] = obj_document_sql;
											}
											obj_posp_document['doc_mongo'] = obj_document_mongo; //chirag 11102023
											res.json(obj_posp_document);
										}
										catch(e){
											res.send(e.stack);
										}
									});
								}
							}
							catch(e){
								res.send(e.stack);
							}
                            
                        });
                    }
                });
            } else {
                obj_posp_document['err'] = 'Invalid_ssId';
                res.json(obj_posp_document);
            }

        } catch (e) {
            obj_posp_document['err'] = e.stack;
            res.json(obj_posp_document);
        }
    });
    app.get('/posps/mssql/get_status_history', function (req, res) {
        try {
            let posp_id = req.query['posp_id'] || 0;
            posp_id = posp_id - 0;
            let obj_posp_history = {
                'err': '',
                'err_details': '',
                'result': []
            };
            if (posp_id > 0 && isNaN(posp_id) === false) {
                let sql = require("mssql");
                sql.close();
                sql.connect(config.pospsqldb, function (conn_err) {
                    if (conn_err) {
                        obj_posp_history['err'] = 'DB_CON_ERR';
                        obj_posp_history['err_details'] = conn_err;
                        res.json(obj_posp_history);
                    } else {
                        let posp_request = new sql.Request();
                        let posp_qry_str = 'select * from POSP_Status_History where ( IsActive = 1 or Status = \'Lead has been created successfully.\' ) and POSP_ID = ' + posp_id;
                        posp_request.query(posp_qry_str, function (qry_err, recordset) {
                            if (qry_err) {
                                obj_posp_history['err'] = 'DB_DATA_ERR';
                                obj_posp_history['err_details'] = qry_err;
                            } else {
                                obj_posp_history['result'] = recordset.recordset;
                            }
                            res.json(obj_posp_history);
                        });
                    }
                });
            } else {
                obj_posp_history['err'] = 'Invalid_PospId';
                res.json(obj_posp_history);
            }

        } catch (e) {
            obj_posp_history['err'] = e.stack;
            res.json(obj_posp_history);
        }
    });

    app.get('/posps/report_list/pos_migration_list', function (req, res) {
        let Fos_Migration = require('../models/fos_migration');
        Fos_Migration.find({}).select({"_id": 0, "__v": 0}).sort({}).exec(function (err, dbMigrations) {
            try {
                if (err) {
                    res.send(err);
                } else {
                    res.json(dbMigrations);
                }
            } catch (e) {
                res.send(e.stack);
            }
        });
    });
    app.get('/posps/fos_to_posp_migration/post_code_process', function (req, res) {
        let ss_id = req.query['ss_id'] || 0;
        let obj_fos_to_posp_migration_summary = {
			"Ss_Id" : ss_id,
			"Status" : "PENDING",
			"Details" : null,
			"Summary" : null			
		};
		let Email = require('../models/email');
		let objModelEmail = new Email();

        ss_id = ss_id - 0;
        if (ss_id > 0) {
            let Fos_Migration = require('../models/fos_migration');
            Fos_Migration.findOne({"Ss_Id": ss_id, 'Status': 'PENDING'}).exec(function (err, dbSingleMigration) {
                try {
                    if (!err && dbSingleMigration) {
						dbSingleMigration = dbSingleMigration._doc;
						obj_fos_to_posp_migration_summary["Details"] = dbSingleMigration;
						client.get(config.environment.weburl + '/posps/dsas/view/' + ss_id, {}, function (agent_data, esponse) {
							try {
								if (agent_data && agent_data['status'] === 'SUCCESS') {
									let pos_erp_id = 0;
									let fos_erp_id = 0;
									let pan = '';
									pos_erp_id = agent_data['POSP']['Erp_Id'] - 0;
									fos_erp_id = agent_data['EMP']['VendorCode'] - 0;
									if(pos_erp_id == fos_erp_id){
										fos_erp_id = agent_data['EMP']['Emp_Code'] - 0;
									}
									pan = agent_data['POSP']['Pan_No'];
									
									if(pos_erp_id > 0){ // && fos_erp_id > 0 && pan && pan !== ""
										
										Fos_Migration.update({"Ss_Id": ss_id}, {$set: {'Status': 'MIGRATED', 'Modified_On': new Date()}}, function (err, objDbRm_Mapping_Job) {
											try{	
												let arr_fos_migration = [];
												arr_fos_migration.push({
													'NAME': agent_data['POSP']['First_Name'] + '' + agent_data['POSP']['Last_Name'],
													'CODE': 'POSP=' + pos_erp_id,
													'FBA ID': dbSingleMigration['Fba_Id'],
													'PAN NO': pan,
													'Status': 'Active',
													'Vertical': agent_data['channel'] || 'NA'
												});
												arr_fos_migration.push({
													'NAME': agent_data['EMP']['Emp_Name'],
													'CODE': 'FOS=' + fos_erp_id,
													'FBA ID': dbSingleMigration['Fba_Id'],
													'PAN NO': pan,
													'Status': 'InActive',
													'Vertical': agent_data['channel'] || 'NA'
												});
												obj_fos_to_posp_migration_summary["Summary"] = 	arr_fos_migration;
												let res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>POSP EXAM DUE NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
												res_report += '<p><h1>FOS TO POSP MIGRATION NOTIFICATION</h1></p>';
												res_report += '<p>Dear Cordinator,<BR>Following FOS is migrated to POSP.';
												res_report += '<p><h1>FOS TO POSP Migration Summary</h1>';
												res_report += arrayobjectToHtml(arr_fos_migration);
												res_report += '</p>';
												res_report += '</body></html>';
												let subject = '[FOS_TO_POSP_MIGRATE]FINISH :: PAN-' + pan + ',SSID-' + ss_id;

												if (req.query['dbg'] == 'yes') {
													objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, subject, res_report, '', '');
												} else {
													objModelEmail.send('notifications@policyboss.com', 'suresh.k@landmarkinsurance.in,sandeep.nair@landmarkinsurance.in,posp.ops@policyboss.com', subject, res_report, '', config.environment.notification_email);
												}
												let posp_source = agent_data['POSP']['Sources'].toString();
												let emp_role = config.channel.Const_POS_Source_to_Emp_Role[posp_source] || '';
												if (posp_source && emp_role) {
													client.get(config.environment.weburl + '/posps/fos_to_posp_migration/disable_dsa?posp_source=' + posp_source + '&emp_role=' + emp_role + '&ss_id=' + ss_id, {}, function (data, response) {});
												}
												obj_fos_to_posp_migration_summary["Status"] = "SUCCESS";
											}
											catch(e){
												let res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>NOT Eligible</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
												res_report += '<p><h1>FOS TO POSP MIGRATION NOTIFICATION</h1></p>';
												res_report += '<p>Non eligible';
												res_report += '<p><h1>FOS TO POSP Migration Details</h1>';
												res_report += arrayobjectToHtml(dbSingleMigration);
												res_report += '</p>';
												res_report += '</body></html>';
												let subject = '[FOS_TO_POSP_MIGRATE]EXCEPTION :: PAN-' + pan + ',SSID-' + ss_id;objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, subject, res_report, '', '');
												obj_fos_to_posp_migration_summary["Status"] = "EXCEPTION";
												obj_fos_to_posp_migration_summary["Exception"] = e.stack;
											}
											return res.json(obj_fos_to_posp_migration_summary);										
										});	
									}
									else{										
										let res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>NOT Eligible</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
										res_report += '<p><h1>FOS TO POSP Migration Details</h1>';
										res_report += "<pre>"+ JSON.stringify(obj_fos_to_posp_migration_summary,undefined,2)+"</pre>";
										res_report += '</p>';
										res_report += '</body></html>';
										let subject = '[FOS_TO_POSP_MIGRATE]ERP_CODE_PENDING :: SSID-' + ss_id;
										
										objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, subject, res_report, '', '');
										obj_fos_to_posp_migration_summary["Status"] = "ERP_CODE_PENDING";
										return res.json(obj_fos_to_posp_migration_summary);										
									}									
								}
								else{
									return res.json(obj_fos_to_posp_migration_summary);
								}
							} catch (e) {
								obj_fos_to_posp_migration_summary["Status"] = "EXCEPTION";
								obj_fos_to_posp_migration_summary["Exception"] = e.stack;
								
								let res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>NOT Eligible</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
								res_report += '<p><h1>FOS TO POSP Migration Details</h1>';
								res_report += "<pre>"+ JSON.stringify(obj_fos_to_posp_migration_summary,undefined,2)+"</pre>";
								res_report += '</p>';
								res_report += '</body></html>';
								let subject = '[FOS_TO_POSP_MIGRATE]EXCEPTION :: SSID-' + ss_id;
								
								objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, subject, res_report, '', '');
								
								return res.json(obj_fos_to_posp_migration_summary);
							}
						});
                    } else {
						obj_fos_to_posp_migration_summary["Status"] = "MIGRATION_NOT_STARTED";
						let res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>NOT Eligible</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
						res_report += '<p><h1>FOS TO POSP Migration Details</h1>';
						res_report += "<pre>"+ JSON.stringify(obj_fos_to_posp_migration_summary,undefined,2)+"</pre>";
						res_report += '</p>';
						res_report += '</body></html>';
						let subject = '[FOS_TO_POSP_MIGRATE]MIGRATION_NOT_STARTED :: SSID-' + ss_id;
						
						objModelEmail.send('notifications@policyboss.com', config.environment.notification_email, subject, res_report, '', '');	
						return res.json(obj_fos_to_posp_migration_summary);
                    }
                } catch (e) {
                    res.send(e.stack);
                }
            });
        } else {
            res.json({
                'Msg': 'InValid SSID',
                'Status': 'VALIDATION'
            });
        }
    });
    app.get('/posps/fos_to_posp_migration/disable_dsa', function (req, res) {
        try {
            let ss_id = req.query['ss_id'] || 0;

            ss_id = ss_id - 0;
            let posp_source = req.query['posp_source'] || '';
            let emp_role = req.query['emp_role'] || '';
            if (ss_id > 0 && emp_role !== '' && (emp_role - 0) > 0) {
                var employee_qry_str = 'update Employee_Master set Role_ID = ' + emp_role + ' where Emp_Id = ' + ss_id.toString();
                var sql = require("mssql");
                sql.close();
                sql.connect(config.portalsqldb, function (conn_err) {
                    if (conn_err) {
                        obj_status['employee_status'] = 'DB_CON_ERR';
                        obj_status['employee_msg'] = conn_err;
                        return res.json(obj_status);
                    } else {
                        var employee_update_request = new sql.Request();
                        employee_update_request.query(employee_qry_str, function (qry_err, recordset) {
                            if (qry_err) {
                                obj_status['employee_status'] = 'DB_UPDATE_ERR';
                                obj_status['employee_msg'] = qry_err;
                                return res.json(obj_status);
                            } else {
                                obj_status['employee_status'] = 'SUCCESS';
                                obj_status['employee_msg'] = recordset;
                                
                                
                                client.get(config.environment.weburl + '/report/sync_emp_master?ss_id=' + ss_id, {}, function (data, response) {
                                    return res.json(obj_status);
                                });
                            }
                        });
                    }
                });
            }
        } catch (e) {
            return res.send(e.stack);
        }
    });
    app.get('/posps/mssql/change_fos_to_posp', LoadSession, function (req, res) {
        try {
            let ss_id = req.query['ss_id'] || 0;
            ss_id = ss_id - 0;
            let obj_posp_summary = {
                'err': '',
                'err_details': '',
                'pos_details': null,
                'posp_qry_find': '',
                'posp_qry_update': '',
                'pos_err': '',
                'update_err': '',
                'update_err_details': '',
                'status': 'FAIL',
                'status_msg': 'FAIL'
            };
            if (ss_id > 0 && isNaN(ss_id) === false) {
                let sql = require("mssql");
                sql.close();
                sql.connect(config.pospsqldb, function (conn_err) {
                    if (conn_err) {
                        obj_posp_summary['err'] = 'DB_CONNECT_ERR';
                        obj_posp_summary['err_details'] = conn_err;
                        res.json(obj_posp_summary);
                    } else {
                        let posp_request = new sql.Request();
                        let posp_qry_find = 'select POSP_ID, FBAID, SS_ID ,  First_Name , Last_Name, IsActive , IsFOS , ERP_ID , Last_Status, Sources , PAN_No from Posp_Details where IsActive = 1 and IsFOS = 1 AND SS_ID = ' + ss_id;
                        obj_posp_summary['posp_qry_find'] = posp_qry_find;
                        posp_request.query(posp_qry_find, function (find_qry_err, recordset) {
                            try {
                                if (find_qry_err) {
                                    obj_posp_summary['err'] = 'FIND_DATA_ERR';
                                    obj_posp_summary['err_details'] = find_qry_err;
                                    res.json(obj_posp_summary);
                                } else {
                                    obj_posp_summary['pos_details'] = recordset.recordset;
                                    if (recordset.recordset.length == 1) {
                                        obj_posp_summary['pos_details'] = recordset.recordset[0];
                                        let is_approved_proceed = false;
                                        if (obj_posp_summary['pos_details']['IsActive'] == 1) {
                                            //obj_posp_summary['pos_err'] = 'ALREADY_ACTIVE';
                                        }
                                        if (obj_posp_summary['pos_details']['ERP_ID'] && obj_posp_summary['pos_details']['ERP_ID'] !== '' && obj_posp_summary['pos_details']['ERP_ID'].toString().length == 6) {
                                            let first_char_code = obj_posp_summary['pos_details']['ERP_ID'].toString().charAt(0).toString();
                                            if (['9', '6'].indexOf(first_char_code) > -1) {
                                                obj_posp_summary['pos_err'] = 'ALREADY_POS';
                                            }
                                            if (['7'].indexOf(first_char_code) > -1) {
                                                obj_posp_summary['pos_err'] = 'ALREADY_FOS';
                                            }
                                        }
                                        if (obj_posp_summary['pos_err'] === '') {
                                            let Pos_Pan = obj_posp_summary['pos_details']['PAN_No'] || '';
                                            Pos_Pan = Pos_Pan.toUpperCase();
                                            let Fos_Pan = Pos_Pan;
                                            let is_f2p_diff_pan = req.query['is_f2p_diff_pan'];
                                            if (req.query['pos_pan'] !== '') {
                                                Pos_Pan = req.query['pos_pan'].toUpperCase();
                                            }
                                            if (req.query['fos_pan'] !== '') {
                                                Fos_Pan = req.query['fos_pan'].toUpperCase();
                                            }

                                            let Fos_Migration = require('../models/fos_migration');
                                            let obj_Fos_Migration = {
                                                "Posp_Id": obj_posp_summary['pos_details']['POSP_ID'],
                                                "Ss_Id": obj_posp_summary['pos_details']['SS_ID'],
                                                "Fba_Id": obj_posp_summary['pos_details']['FBAID'],
                                                "Name": obj_posp_summary['pos_details']['First_Name'] + '-' + obj_posp_summary['pos_details']['Last_Name'],
                                                "Channel": config.channel.Const_POSP_Channel[obj_posp_summary['pos_details']['Sources']] || 'NA',
                                                "Status": 'PENDING',
                                                "Fos_Pan": Fos_Pan,
                                                "Pos_Pan": Pos_Pan,
                                                "Is_F2p_Diff_Pan": is_f2p_diff_pan,
                                                "Migrated_By": req.obj_session.user.fullname + '(ss_id:' + req.obj_session.user.ss_id + ')',
                                                "Created_On": new Date(),
                                                "Modified_On": new Date()
                                            };
                                            Fos_Migration.findOne({"Ss_Id": obj_Fos_Migration['Ss_Id']}, function (err, objDBMigrate) {
                                                if (objDBMigrate) {
                                                    objDBMigrate = objDBMigrate._doc;
                                                    obj_posp_summary['status'] = 'VALIDATION';
                                                    obj_posp_summary['status_msg'] = 'Fos migration is already initiated on ' + objDBMigrate['Created_On'].toLocaleString() + '. It is currently at status :: ' + objDBMigrate['Status'];
                                                    return res.json(obj_posp_summary);
                                                } else {
                                                    let objModelFos_Migration = new Fos_Migration(obj_Fos_Migration);
                                                    objModelFos_Migration.save(function (err_Fos_Migration, objDb_Fos_Migration) {
                                                        if (err_Fos_Migration) {
                                                            obj_posp_summary['err'] = 'SAVE_STATUS_ERR';
                                                            obj_posp_summary['err_details'] = err_Fos_Migration;
                                                            return res.json(obj_posp_summary);
                                                        } else {
                                                            obj_posp_summary['Fos_Migration'] = objDb_Fos_Migration._doc;
                                                            let posp_qry_update = 'update Posp_Details set IsActive = 1 where POSP_ID = ' + obj_Fos_Migration["Posp_Id"] + ' and SS_ID = ' + obj_Fos_Migration["Ss_Id"].toString();
                                                            let posp_qry_update_all = 'update Posp_Details set IsActive = 0 where SS_ID = ' + obj_Fos_Migration["Ss_Id"].toString();
                                                            obj_posp_summary['posp_qry_update'] = posp_qry_update;
                                                            obj_posp_summary['posp_qry_update_all'] = posp_qry_update_all;
                                                            if (req.query['update'] === 'yes') {
                                                                posp_request.query(posp_qry_update_all, function (update_qry_err_all, update_recordset_all) {
                                                                    obj_posp_summary['posp_update'] = update_qry_err_all || 'SUCCESS';
                                                                    obj_posp_summary['posp_update_all'] = update_recordset_all || 'NA';
                                                                    posp_request.query(posp_qry_update, function (update_qry_err, update_recordset) {
                                                                        try {
                                                                            if (update_qry_err) {
                                                                                obj_posp_summary['update_err'] = 'DB_DATA_ERR';
                                                                                obj_posp_summary['update_err_details'] = update_qry_err;
                                                                            } else {
                                                                                obj_posp_summary['status'] = 'SUCCESS';
                                                                                obj_posp_summary['status_msg'] = 'Fos to POSP Migration is initiated.';
                                                                                obj_posp_summary['result'] = update_recordset;
                                                                                let rm_notification = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>RM MAPPING NOTIFICATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';

                                                                                rm_notification += 'Following FOS migration process is initiated.<br><br>';

                                                                                rm_notification += objectToHtml(obj_Fos_Migration);
                                                                                rm_notification += '</p>';
                                                                                rm_notification += '</body></html>';
                                                                                var subject = '[FOS_TO_POSP_MIGRATE]STARTED ,DETAILS :: ' + obj_Fos_Migration['Name'] + " :: SSID-" + obj_Fos_Migration['Ss_Id'] + " :: is_f2p_diff_pan-" + is_f2p_diff_pan;
                                                                                let Email = require('../models/email');
                                                                                let objModelEmail = new Email();
                                                                                objModelEmail.send('notifications@policyboss.com', 'sandeep.nair@landmarkinsurance.in ,posp.ops@policyboss.com', subject, rm_notification, '', config.environment.notification_email);
                                                                            }

                                                                        } catch (e) {
                                                                            obj_posp_summary['exception'] = e.stack;
                                                                        }
																		try {
																			
																			
																			let training_arg = {
																				"Ss_Id": obj_Fos_Migration['Ss_Id'] - 0
																			};
																			let post_training_arg = {
																				data: training_arg,
																				headers: {
																					"Content-Type": "application/json"
																				}
																			};
																			client.post(config.environment.weburl + '/onboarding/schedule_posp_training', post_training_arg, function (schedule_posp_training_data, schedule_posp_training_res) {
																				if (schedule_posp_training_data && schedule_posp_training_data.Status === "Success") {
																					console.error("POSP_SIGNUP_SUCCESS_SCHEDULE_POSP_TRAINING",'FOS_TO_POSP_MIGRATE_STARTED', obj_Fos_Migration['Ss_Id'], 'INFO', schedule_posp_training_data);
																				} else {
																					console.error("POSP_SIGNUP_FAIL_SCHEDULE_POSP_TRAINING", 'FOS_TO_POSP_MIGRATE_STARTED', obj_Fos_Migration['Ss_Id'] ,'ERR', schedule_posp_training_data);
																				}
																			});
																		} catch (ex) {
																			console.error('POSP_SIGNUP_ERR_IN_SCHEDULE_POSP_TRAINING', 'EXCEPTION', obj_Fos_Migration['Ss_Id'], ex.stack);
																		}
																		
                                                                        return res.json(obj_posp_summary);
                                                                    });
                                                                });
                                                            } else {
                                                                return res.json(obj_posp_summary);
                                                            }
                                                        }
                                                    });
                                                }
                                            });
                                        } else {
                                            res.json(obj_posp_summary);
                                        }
                                    } else {
                                        res.json(obj_posp_summary);
                                    }
                                }
                            } catch (e) {
                                obj_posp_summary['err'] = e.stack;
                                res.json(obj_posp_summary);
                            }
                        });
                    }
                });
            } else {
                obj_posp_summary['err'] = 'Invalid_ssId';
                res.json(obj_posp_summary);
            }

        } catch (e) {
            obj_posp_summary['err'] = e.stack;
            res.json(obj_posp_summary);
        }
    });

    app.get('/posps/posp_appointment_letter/:ss_id', function (req, res) {
        try {
            let ss_id = req.params.ss_id && req.params.ss_id !== null && req.params.ss_id !== undefined && req.params.ss_id !== '' ? req.params.ss_id - 0 : 0;
            if (ss_id) {
                var Posp = require('../models/posp');
                Posp.find({"Ss_Id": ss_id, 'Is_Active': true}, function (err, dbPosp) {
                    if (err) {
                        res.json({Msg: err, Status: "Fail"});
                    } else {
                        if (dbPosp && dbPosp.hasOwnProperty('length') && dbPosp.length > 0) {
                            //pdf start
                            let html_file_path1 = appRoot + "/resource/request_file/landmark.html";
                            let htmlPol = fs.readFileSync(html_file_path1, 'utf8');
                            let file_name = "POSP_Appointment_Letter_" + ss_id;
                            let pdf_file_path = appRoot + "/tmp/posp_appointment_letter/" + file_name + '.pdf';
                            let html_file_path = appRoot + "/tmp/posp_appointment_letter/" + file_name + '.html';
                            var html_web_path_portal = config.environment.downloadurl + "/posp_appointment_letter/" + file_name + '.html';
							var pdf_web_path_portal = config.environment.downloadurl + "/posp_appointment_letter/" + file_name + '.pdf';
                            //var html_web_path_portal = config.environment.weburl + "/posp_appointment_letter/" + file_name + '.html';
                            let mid_name = (dbPosp['0']._doc.Middle_Name && dbPosp['0']._doc.Middle_Name !== "" ? (dbPosp['0']._doc.Middle_Name + " ") : "");
                            let add1 = (dbPosp['0']._doc.Permanant_Add1 && dbPosp['0']._doc.Permanant_Add1 !== "" ? (dbPosp['0']._doc.Permanant_Add1) : "");
                            let add2 = (dbPosp['0']._doc.Permanant_Add2 && dbPosp['0']._doc.Permanant_Add2 !== "" ? (", " + dbPosp['0']._doc.Permanant_Add2) : "");
                            let add3 = (dbPosp['0']._doc.Permanant_Add3 && dbPosp['0']._doc.Permanant_Add3 !== "" ? (", " + dbPosp['0']._doc.Permanant_Add3) : "");
                            let address = add1 + add2 + add3;
                            //let dt = dbPosp['0']._doc.POSP_UploadingDateAtIIB;//dbPosp['0']._doc.Certification_Datetime;
							let dt = (dbPosp['0']._doc.POSP_UploadingDateAtIIB && dbPosp['0']._doc.POSP_UploadingDateAtIIB !== "" ? dbPosp['0']._doc.POSP_UploadingDateAtIIB : '');
                            let replacedata = {};
                            replacedata = {
                                "___ss_id___": dbPosp['0']._doc.Ss_Id,
                                "___date___": (dt !== "" ? (moment(dt).format("DD-MM-YYYY")) : ''),
                                "___name___": dbPosp['0']._doc.First_Name + " " + mid_name + dbPosp['0']._doc.Last_Name,
                                "___address___": address,
                                "___mobile___": dbPosp['0']._doc.Mobile_No,
                                "___email___": dbPosp['0']._doc.Email_Id,
                                "___pan___": dbPosp['0']._doc.Pan_No,
                                "___adhaar___": dbPosp['0']._doc.Aadhar,
                                "___posp_name___": dbPosp['0']._doc.First_Name + " " + mid_name + dbPosp['0']._doc.Last_Name,
                                "___posp_pan___": dbPosp['0']._doc.Pan_No,
                                "___posp_mobile___": dbPosp['0']._doc.Mobile_No
                            };
                            htmlPol = htmlPol.toString().replaceJson(replacedata);
                            fs.writeFileSync(html_file_path, htmlPol);
                            try {
                                var http = require('https');
                                //var http = require('http');
                                var insurer_pdf_url = (config.environment.name !== 'Production' ? config.environment.pdf_url_qa : config.environment.pdf_url) + html_web_path_portal;
                                //var insurer_pdf_url = html_web_path_portal;
                                var file_horizon = fs.createWriteStream(pdf_file_path);
                                http.get(insurer_pdf_url, function (response) {
                                    response.pipe(file_horizon);
                                    //console.log("PDF success!");
									res.json({Msg: pdf_web_path_portal, Status: "Success"});
                                });
                            } catch (e) {
                               res.json({Msg: e.stack, Status: "Fail"});
                            }
                            //pdf end
                            
                        } else {
                            res.json({Msg: 'No data found', Status: "Fail"});
                        }
                    }
                });
            } else {
                res.json({Msg: 'Please pass SSID', Status: "Fail"});
            }
        } catch (e) {
            res.json({Msg: e.stack, Status: "Fail"});
        }
    });
    app.get('/posps/summary/erp_code_creation', LoadSession, function (req, res) {
		try{
			let User_Data = require('../models/user_data');
			let curr_date = moment().utcOffset("+05:30").startOf('Day').format('YYYY-MM-DD');
			let SubVertical = req.query['SubVertical'] || '';
			let posp_erp_code_creation_summary_cache_key = 'posp_erp_code_creation_summary_uid_'+req.obj_session.user.ss_id;	
			
			if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1){
				posp_erp_code_creation_summary_cache_key = 'posp_erp_code_creation_summary_superadmin';
			}			
			if(SubVertical !== ''){
				//posp_erp_code_creation_summary_cache_key = 'posp_erp_code_creation_summary_'+SubVertical.replace(/[^a-z0-9]/gi, '_');
				posp_erp_code_creation_summary_cache_key = '';
			}
			let is_cached = false;
			let cached_path = appRoot + "/cache/cohort/" + posp_erp_code_creation_summary_cache_key + ".log";
			if (posp_erp_code_creation_summary_cache_key !== '' && fs.existsSync(cached_path) === true) {
				let stats = fs.statSync(cached_path);
				let mtime = moment(stats.mtime).utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
				let mdate = moment(stats.mtime).utcOffset("+05:30").startOf('Day').format('YYYY-MM-DD');
				if(curr_date === mdate){			
					var cache_content = fs.readFileSync(cached_path).toString();
					let cache_content_json = JSON.parse(cache_content);
					cache_content_json['cached_on_time'] = mtime;
					cache_content_json['cached_on_date'] = mdate;
					cache_content_json['curr_date'] = curr_date;
					cache_content_json['cached'] = 'YES';
					cache_content_json['report_cache_key'] = posp_erp_code_creation_summary_cache_key;
					return res.json(cache_content_json);
				}
			}
			let cond_posp_code = {
				Erp_Id:{"$regex": /^6/ },"ERPID_CreatedDate":{"$nin":['',null]}
			};
			if(SubVertical !== ''){
				cond_posp_code["SubVertical"] = SubVertical;
			}
			
			if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1 || req.obj_session.user.role_detail.role.indexOf('Recruiter') > -1 ||  req.obj_session.user.ss_id == 7973) {

            } else if (req.obj_session.user.role_detail.role.indexOf('ChannelHead') > -1) {
                let obj_posp_channel_to_source = swap(config.channel.Const_POSP_Channel);
                var arr_source = [];
                for (var x of req.obj_session.user.role_detail.channel_agent) {
                    arr_source.push(obj_posp_channel_to_source[x]);
                }
				cond_posp_code["$or"] = [
					{'Sources' : {$in: arr_source},'Reporting_Agent_Uid':{$in:[null,0]}},
					{"Vertical_Head_UID":req.obj_session.user.uid},
					{"Reporting_Agent_Uid":req.obj_session.user.uid}
				];
            } else {
                cond_posp_code['Ss_Id'] = {$in: req.obj_session.users_assigned.Team.POSP};
            }
			
			let agt_posp = [
				{$match: cond_posp_code},
				{$group:{
					_id : {
						'Posp_Year' : {$year:"$ERPID_CreatedDate"},
						'Posp_Month' : {$month:"$ERPID_CreatedDate"}
						},
						Posp_Count : {$sum : 1},
						'Posp_List' : {$addToSet:"$Erp_Id"},
						'Posp_List_Ss_Id' : {$addToSet:"$Ss_Id"}	
				}},
				{
					$project : { 
						_id:0,
						'Posp_Year':'$_id.Posp_Year',
						'Posp_Month':'$_id.Posp_Month',
						'Posp_Count' : 1,
						'Posp_List' : 1,
						'Posp_List_Ss_Id' : 1	
							}
					},
					{
							$sort : {
									'Posp_Year' : -1,
									'Posp_Month' : -1
									}
							}
				];
			let obj_posp_summary = {
					"status" : "pending",
					"err" : "",
					"data" : []
			};
			Posp.aggregate(agt_posp).exec(function (err, dbPospAgrs) {
					try {
						if (err) {
							obj_posp_summary['status'] = 'err';
							obj_posp_summary['err'] = err;
						} else {
							obj_posp_summary['status'] = 'success';												
							if (dbPospAgrs) {
								for(let k in dbPospAgrs){
									dbPospAgrs[k]['Posp_List'] = dbPospAgrs[k]['Posp_List'].map(Number);
								}
								obj_posp_summary['data'] = dbPospAgrs;
								if(posp_erp_code_creation_summary_cache_key !== ''){
									fs.writeFile(cached_path, JSON.stringify(obj_posp_summary), function (err) {
										if (err) {
											return console.error(err);
										}
									});
								}
								res.json(obj_posp_summary);								
							} 
						}
					} catch (ex) {
						obj_posp_summary['err'] = ex.stack;
						obj_posp_summary['status'] = 'exception';
						res.json(obj_posp_summary);	
					}
					
			});
		} catch (ex) {
			res.json({"Status": "Fail", "Msg": ex.stack});
		}	
    });
    app.get('/posps/summary/rm_posp_activation_summary', LoadSession, function (req, res) {
		try{
			let curr_date = moment().utcOffset("+05:30").startOf('Day').format('YYYY-MM-DD');	
			let posp_erp_code_creation_summary_cache_key = 'rm_posp_activation_summary_'+req.obj_session.user.uid;
			let is_cached = false;
			let cached_path = appRoot + "/cache/cohort/" + posp_erp_code_creation_summary_cache_key + ".log";
			if (fs.existsSync(cached_path) === true) {
					let stats = fs.statSync(cached_path);
					let mtime = moment(stats.mtime).utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
					let mdate = moment(stats.mtime).utcOffset("+05:30").startOf('Day').format('YYYY-MM-DD');
					if(curr_date === mdate){			
							var cache_content = fs.readFileSync(cached_path).toString();
							let cache_content_json = JSON.parse(cache_content);
							cache_content_json['cached_on_time'] = mtime;
							cache_content_json['cached_on_date'] = mdate;
							cache_content_json['curr_date'] = curr_date;
							cache_content_json['cached'] = 'YES';
							cache_content_json['report_cache_key'] = posp_erp_code_creation_summary_cache_key;
							return res.json(cache_content_json);
					}
			}

			let cond_ssid_posp = {
				Is_Active: true,
				Last_Status: {$ne: null},
				/*Reporting_Agent_Uid: {
						$gt: 100000,
						$lt: 200000
				}*/
			};
			let arr_ssid= [];
			if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1 || req.obj_session.user.role_detail.role.indexOf('Recruiter') > -1) {

			} else if (false && req.obj_session.user.role_detail.role.indexOf('ChannelHead') > -1) {
				let obj_posp_channel_to_source = swap(config.channel.Const_POSP_Channel);
				var arr_source = [];
				for (var x of req.obj_session.user.role_detail.channel_agent) {
					arr_source.push(obj_posp_channel_to_source[x]);
				}
				cond_ssid_posp["$or"] = [
						{'Sources' : {$in: arr_source},'Reporting_Agent_Uid':{$in:[null,0]}},
						{"Vertical_Head_UID":req.obj_session.user.uid},
						{"Reporting_Agent_Uid":req.obj_session.user.uid}
					];
			} else {
				cond_ssid_posp['Ss_Id'] = {$in: req.obj_session.users_assigned.Team.POSP};
			}
			
			let agt_posp = [{
							$match: cond_ssid_posp
					},
					{
							$group: {
									_id: {
											"Reporting_Agent_Uid": "$Reporting_Agent_Uid"
									},
									"Lead_Count": {
											$sum: 1
									},
									"Posp_Count": {
											$sum: "$Is_Certified"
									},
									"Paid_Count": {
											$sum: "$Is_Paid"
									},
									"Fos_Count": {
											$sum: "$IsFOS"
									},
									"App_Installed_Count": {
											$sum: "$Is_App_Installed"
									},
									"Sync_Count": {
											$sum: "$Is_Contact_Sync"
									},
									"Channel_List" : {
											$addToSet: "$Channel"
									},
									"Posp_List" : {
											$addToSet: "$Ss_Id"
									}
							},
					},
					{
							$project: {
									_id: 0,
									"RM_Uid": "$_id.Reporting_Agent_Uid",
									"Lead_Count": 1,
									"Fos_Count": 1,
									"Posp_Count": 1,
									"Paid_Count": 1,
									"App_Installed_Count": 1,
									"Sync_Count": 1,
									"Channel_List": 1,
									"Posp_List" : 1
							}
					},
					{
							$sort: {
									Posp_Count: -1
							}
					}
			];
			let obj_posp_summary = {
					"status" : "pending",
					"err" : "",
					"data" : [],
					"count" : 0
			};
			Posp.aggregate(agt_posp).exec(function (err, dbPospAgrs) {
					try {
							if (err) {
									obj_posp_summary['status'] = 'err';
									obj_posp_summary['err'] = err;
							} else {
									obj_posp_summary['status'] = 'success';												
									if (dbPospAgrs) {
											let obj_rm_uid = {};
											for(let k in dbPospAgrs){

												dbPospAgrs[k]['RM_Uid'] = dbPospAgrs[k]['RM_Uid'] || 0;
												dbPospAgrs[k]['RM_Uid'] = dbPospAgrs[k]['RM_Uid'] - 0;
												dbPospAgrs[k]['RM_Name'] = '--RM-NOT-MAPPED--';
												dbPospAgrs[k]['Employment_Status'] = 'RM-NOT-MAPPED';
												
												dbPospAgrs[k]['Vertical'] = 'NA';
												dbPospAgrs[k]['SubVertical'] = 'NA';
												dbPospAgrs[k]['HOD_Name'] = 'NA';
												dbPospAgrs[k]['Branch'] = 'NA';
												dbPospAgrs[k]['Reporting_One'] = 'NA';
												dbPospAgrs[k]['Reporting_Two'] = 'NA';
												dbPospAgrs[k]['Contact_Sync'] = 'NO';
												dbPospAgrs[k]['App_Installed'] = 'NO';
												dbPospAgrs[k]['Is_Login_Today'] = 'NO';
												if(dbPospAgrs[k]['RM_Uid'] > 0 && dbPospAgrs[k]['RM_Uid'] > 100000 && dbPospAgrs[k]['RM_Uid'] < 200000){
													dbPospAgrs[k]['RM_Name'] = '--PAYROLL-NOT-ACTIVE--';
													dbPospAgrs[k]['Employment_Status'] = 'NOT-ACTIVE';
													obj_rm_uid[dbPospAgrs[k]['RM_Uid']] = dbPospAgrs[k];
												}												
												//dbPospAgrs[k]['Posp_List'] = dbPospAgrs[k]['Posp_List'].map(Number);
											}
											let User = require('../models/user');
											let obj_emp_list = {};
											User.find({"UID":{$in:Object.keys(obj_rm_uid).map(Number)}},function (err, dbUsers) {
												try{
													let arr_rm_ssid = [];													
													for(let obj_user of dbUsers){
														obj_user = obj_user._doc;
														arr_rm_ssid.push(obj_user['Ss_Id'] -0);
														let RM_UID = obj_user['UID'];
														obj_rm_uid[RM_UID]['RM_Ss_Id'] = obj_user['Ss_Id'];
														obj_rm_uid[RM_UID]['RM_Name'] = obj_user['Employee_Name'] ? obj_user['Employee_Name'] : 'NA';
														obj_rm_uid[RM_UID]['RM_Designation'] = obj_user['Designation'] || 'NA';
														obj_rm_uid[RM_UID]['RM_Email'] = (obj_user['Official_Email'] && obj_user['Official_Email'].indexOf('@') > -1) ? obj_user['Official_Email'] : obj_user['Email'];
														obj_rm_uid[RM_UID]['Employment_Status'] = 'ACTIVE';
														obj_rm_uid[RM_UID]['Vertical'] = obj_user['Vertical'] ? obj_user['Vertical'].toUpperCase() : 'NA';
														obj_rm_uid[RM_UID]['SubVertical'] = obj_user['Sub_Vertical'] ? obj_user['Sub_Vertical'].toUpperCase() : 'NA';
														obj_rm_uid[RM_UID]['HOD_Name'] = obj_user['RH_Name'] ? obj_user['RH_Name'].toUpperCase() : 'NA';
														obj_rm_uid[RM_UID]['Branch'] = obj_user['Branch'] ? obj_user['Branch'].toUpperCase() : 'NA';										
														obj_rm_uid[RM_UID]['Reporting_One'] = obj_user['Reporting_One'];
														obj_rm_uid[RM_UID]['Reporting_Two'] = obj_user['Reporting_Two'];
														obj_rm_uid[RM_UID]['Contact_Sync'] = (obj_user['Is_Contact_Sync'] == 1) ? 'YES' : 'NO';
														obj_rm_uid[RM_UID]['App_Installed'] = (obj_user['Is_App_Installed'] == 1) ? 'YES' : 'NO';
													}
													var today = moment().utcOffset("+05:30").startOf('Day').format('YYYY-MM-D');
													var arrFrom = today.split('-');
													var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);
													var arrTo = today.split('-');
													var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
													dateTo.setDate(dateTo.getDate() + 1);        
													let cond_login = {
														"login_time": {"$gte": dateFrom, "$lte": dateTo}
													};
													cond_login["ss_id"] = { "$in" : arr_rm_ssid};
													var Login = require('../models/logins');
													Login.distinct('ss_id', cond_login).exec(function (err, Arr_Logins) {
														if(Arr_Logins && Arr_Logins.length > 0){
															for(let obj_user of dbUsers){
																obj_user = obj_user._doc;
																if(Arr_Logins.indexOf(obj_user['Ss_Id']) > -1){
																	let RM_UID = obj_user['UID'];
																	obj_rm_uid[RM_UID]['Is_Login_Today'] = 'YES';	
																}
															}
														}
														//obj_posp_summary['login_qry'] = cond_login;
														//obj_posp_summary['login_err'] = err;
														//obj_posp_summary['login_data'] = Arr_Logins;	
														obj_posp_summary['data'] = Object.values(obj_rm_uid);
														obj_posp_summary['data'].sort(function(a, b) {return b.Posp_Count - a.Posp_Count;});
														obj_posp_summary['count'] = obj_posp_summary['data'].length;
														if(true){
																fs.writeFile(cached_path, JSON.stringify(obj_posp_summary), function (err) {
																		if (err) {
																				//return console.error(err);
																		}
																});
														}
														return res.json(obj_posp_summary);														
													});
													
												}
												catch (ex) {
														obj_posp_summary['err'] = ex.stack;
														obj_posp_summary['status'] = 'exception'; 
														return res.json(obj_posp_summary);	
												}	
											});							
									}
									else{
										return res.json(obj_posp_summary);
									}	
							}
					} catch (ex) {
						obj_posp_summary['err'] = ex.stack;
						obj_posp_summary['status'] = 'exception'; 
						return res.json(obj_posp_summary);	
					}
			});
		} catch (ex) {
			res.json({"Status": "Fail", "Msg": ex.stack});
		}	
    });
    app.get('/posps/summary/channel_posp_activation_summary', LoadSession, function (req, res) {
            try{
                    let curr_date = moment().utcOffset("+05:30").startOf('Day').format('YYYY-MM-DD');	
                    let posp_erp_code_creation_summary_cache_key = 'channel_posp_activation_summary';
                    let is_cached = false;
                    let cached_path = appRoot + "/cache/cohort/" + posp_erp_code_creation_summary_cache_key + ".log";
                    if (fs.existsSync(cached_path) === true && false) {
                            let stats = fs.statSync(cached_path);
                            let mtime = moment(stats.mtime).utcOffset("+05:30").format('YYYY-MM-DD HH:mm:ss');
                            let mdate = moment(stats.mtime).utcOffset("+05:30").startOf('Day').format('YYYY-MM-DD');
                            if(curr_date === mdate){			
                                    var cache_content = fs.readFileSync(cached_path).toString();
                                    let cache_content_json = JSON.parse(cache_content);
                                    cache_content_json['cached_on_time'] = mtime;
                                    cache_content_json['cached_on_date'] = mdate;
                                    cache_content_json['curr_date'] = curr_date;
                                    cache_content_json['cached'] = 'YES';
                                    cache_content_json['report_cache_key'] = posp_erp_code_creation_summary_cache_key;
                                    return res.json(cache_content_json);
                            }
                    }

                    let agt_posp = [{
                                    $match: {
                                            Is_Active: true,
                                            Last_Status: {
                                                    $ne: null
                                            },
                                            Reporting_Agent_Uid: {
                                                    $gt: 100000,
                                                    $lt: 200000
                                            }
                                    }
                            },
                            {
                                    $group: {
                                            _id: {
                                                    "Channel": "$Channel"
                                            },
                                            "Rm_List" : {
                                                    $addToSet: "$Reporting_Agent_Uid"
                                            },
                                            "SignUp_Count": {
                                                    $sum: 1
                                            },
                                            "Posp_Count": {
                                                    $sum: "$Is_Certified"
                                            },
                                            "Paid_Count": {
                                                    $sum: "$Is_Paid"
                                            },
                                            "App_Installed_Count": {
                                                    $sum: "$Is_App_Installed"
                                            },
                                            "Sync_Count": {
                                                    $sum: "$Is_Contact_Sync"
                                            }						
                                    },
                            },
                            {
                                    $project: {
                                            _id: 0,
                                            "Channel": "$_id.Channel",						
                                            "Rm_Count" : {
                                                    $size: "$Rm_List"
                                            },
                                            "SignUp_Count": 1,
                                            "Posp_Count": 1,
                                            "Paid_Count": 1,
                                            "App_Installed_Count": 1,
                                            "Sync_Count": 1
                                    }
                            },
                            {
                                    $sort: {
                                            Posp_Count: -1
                                    }
                            }
                    ];
                    let obj_posp_summary = {
                            "status" : "pending",
                            "err" : "",
                            "data" : [],
                            "count" : 0
                    };
                    Posp.aggregate(agt_posp).exec(function (err, dbPospAgrs) {
                            try {
                                    if (err) {
                                            obj_posp_summary['status'] = 'err';
                                            obj_posp_summary['err'] = err;
                                    } else {
                                            obj_posp_summary['status'] = 'success';												
                                            if (dbPospAgrs) {							
                                                    obj_posp_summary['data'] = dbPospAgrs;	
                                                    return res.json(obj_posp_summary);	
                                            }
                                            else{
                                                    return res.json(obj_posp_summary);
                                            }	
                                    }
                            } catch (ex) {
                                    obj_posp_summary['err'] = ex.stack;
                                    obj_posp_summary['status'] = 'exception'; 
                                    return res.json(obj_posp_summary);	
                            }
                    });
    } catch (ex) {
        res.json({"Status": "Fail", "Msg": ex.stack});
    }	
    });
    app.post('/posps/user_disposition_save', function (req, res) {
        try {
            var user_disposition = require('../models/posp_disposition');
            var posp_leads = require('../models/posp_enquiry');
            var formidable = require('formidable');
            var form = new formidable.IncomingForm();
            var fs = require('fs');
            form.parse(req, function (err, fields, files) {
                try {
                    console.log(fields);
                    var pdf_web_path = "";
                    if (files.hasOwnProperty('disposition_file')) {

                        var pdf_file_name = files['disposition_file'].name.split('.')[0].replace(/ /g, '') + "." + files['disposition_file'].name.split('.')[1];
                        var path = appRoot + "/tmp/disposition/";
                        var pdf_sys_loc_horizon = path + fields["posp_ssid"] + '/' + pdf_file_name;
                        pdf_web_path = config.environment.downloadurl + "/disposition/" + fields["posp_ssid"] + '/' + pdf_file_name;
                        var oldpath = files.disposition_file.path;
                        if (fs.existsSync(path + fields["posp_ssid"]))
                        {

                        } else
                        {
                            fs.mkdirSync(path + fields["posp_ssid"]);
                        }
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
                            });
                            // Delete the file
                            fs.unlink(oldpath, function (err) {
                                if (err)
                                    throw err;
                                console.log('File deleted!');
                            });
                        });
                    }
                    
                    var updated_arg = {
                        Disposition_Status: fields["dsp_status"],
                        Sub_Status: fields["dsp_substatus"],
                        Disposition_On: new Date(),
                        Next_Call_Date: fields["Next_Call_Date"],               
                    };
                    var arg = {
                        Disposition_Id: fields["posp_ssid"] - 0,
                        Status: fields["dsp_status"],
                        Sub_Status: fields["dsp_substatus"],
                        Remark: fields["dsp_remarks"],
                        Disposition_By: fields["Disposition_By"],
                        Is_Latest: 1,
                        File_Name: pdf_web_path,
                        Customer_Name: fields["Customer_Name"],
                        Customer_Mobile: fields["Customer_Mobile"],
                        Disposition_Source: fields["Disposition_Source"],
                        Next_Call_Date: fields["Next_Call_Date"],
                        Created_On: new Date(),
                        Modified_On: new Date()
                    };
                    var dispositionObj = new user_disposition(arg);
                    dispositionObj.save(function (err) {
                        if (err)
                            throw err;
                        res.json({'Msg': 'Success'});
                    });
                    posp_leads.update({Posp_Enquiry_Id: parseInt(arg.Disposition_Id)}, {$set: updated_arg}, function (err, dblmsData) {
            if (err) {
                res.json({'Msg': err, 'Status': 'error'});
            } else {
                res.json({'Msg': 'Status Updated', 'Status': 'success'});
            }
        });
                    
                } catch (e) {
                    res.json({"Status": "Error", "Msg": e.stack});
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
	app.get('/posps/razorpay_payments/onboarding_recent_history', LoadSession, function (req, res) {
        try {
			var today = moment().utcOffset("+05:30").startOf('Day');
			
			if (req.query.hasOwnProperty('type') && req.query['type'] == 'today') {
				req.query['datefrom'] = moment(today).format("YYYY-MM-D");
            }
			if (req.query.hasOwnProperty('type') && req.query['type'] == 'weekly') {
                var weekstart = moment().add(-7, 'days').format("YYYY-MM-D");
                req.query['datefrom'] = weekstart;
            }
			req.query['dateto'] = today.format("YYYY-MM-D");

            var arrFrom = req.query['datefrom'].split('-');
            var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);
            var arrTo = req.query['dateto'].split('-');
            var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
            dateTo.setDate(dateTo.getDate() + 1);
			
            var cond_razorpay_payments = {
				"Source" : "POSP_ONBOARD",
				"Transaction_Status" : "Success"
			};
            if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1 || req.obj_session.user.role_detail.role.indexOf('Recruiter') > -1 || req.obj_session.user.uid == '102572') {
            } else {
                var arr_ssid = [];
                if (req.obj_session.hasOwnProperty('users_assigned')) {
                    var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
                    arr_ssid = combine_arr.split(',').filter(Number).map(Number);
                }
                arr_ssid.push(req.obj_session.user.ss_id);
                cond_razorpay_payments['Ss_Id'] = {$in: arr_ssid};
            }
            var Razorpay_Payment = require('../models/razorpay_payment');
            Razorpay_Payment.find(cond_razorpay_payments).select('-_id Email Name Transaction_Status Created_On Ss_Id Fba_ID').exec(function (err, dbRazorpay_Payments) {
				return res.json(dbRazorpay_Payments);			
			});
        } catch (e) {
            console.error(e);
            res.json({"Msg": e.stack});
        }
    });
	app.get('/posps/signup_dashboard/recent', LoadSession, function (req, res) {
        try {
			var today = moment().utcOffset("+05:30").startOf('Day');
			
			if (req.query.hasOwnProperty('type') && req.query['type'] == 'today') {
				req.query['datefrom'] = moment(today).format("YYYY-MM-D");
            }
			if (req.query.hasOwnProperty('type') && req.query['type'] == '3days') {
                var weekstart = moment(today).add(-3, 'days').format("YYYY-MM-D");
                req.query['datefrom'] = weekstart;
            }
			req.query['dateto'] = today.format("YYYY-MM-D");

            var arrFrom = req.query['datefrom'].split('-');
            var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);
            var arrTo = req.query['dateto'].split('-');
            var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
            dateTo.setDate(dateTo.getDate() + 1);
			
            var cond_posp = {				
				"Created_On" : { "$gt": dateFrom , "$lt": dateTo}
			};
            if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1 || req.obj_session.user.role_detail.role.indexOf('Recruiter') > -1 || req.obj_session.user.uid == '102572') {
            } else {
                var arr_ssid = [];
                if (req.obj_session.hasOwnProperty('users_assigned')) {
                    var combine_arr = req.obj_session.users_assigned.Team.POSP.join(',') + ',' + req.obj_session.users_assigned.Team.DSA.join(',') + ',' + req.obj_session.users_assigned.Team.CSE.join(',');
                    arr_ssid = combine_arr.split(',').filter(Number).map(Number);
                }
                arr_ssid.push(req.obj_session.user.ss_id);
                cond_posp['Ss_Id'] = {$in: arr_ssid};
            }
            
            Posp.find(cond_posp).select('-_id Email_Id Mobile_No First_Name Last_Name Channel Created_On Ss_Id Fba_Id Recruitment_Status Vertical SubVertical Reporting_Agent_Name Reporting_Agent_Uid Agent_City Present_City').exec(function (err, dbPospsSignup) {
				return res.json(dbPospsSignup);			
			});
        } catch (e) {
            console.error(e);
            res.json({"Msg": e.stack});
        }
    });
	app.get('/posps/mssql/erp_code_generation_post_process', LoadSession, function (req, res) {
        try {
			let objrequestCore = {
                'ss_id': req.query['ss_id'] || 0,
                'fba_id': req.query['fba_id'] || 0,
				'erp_id' : req.query['erp_id'] || 0
            };
            
			for (let k in objrequestCore) {
				objrequestCore[k] = objrequestCore[k] - 0;
                if (objrequestCore[k] > 0) {
                }
				else{					
					return res.send('ERR_PARAMETER_MISSING');
				}
            }
            let posp_qry_str = "update Posp_Details set ERP_ID = '" + objrequestCore['erp_id'].toString() + "' , Last_Status = '18' , ERPID_CreatedDate = '"+moment().format('YYYY-MM-DD HH:mm:ss')+"' where SS_ID = " + objrequestCore["ss_id"].toString();
            let employee_qry_str = "update Employee_Master set VendorCode = '" + objrequestCore['erp_id'].toString() + "' where Emp_Id = " + objrequestCore["ss_id"].toString();
			let fm_query = "update FBAMast set ERPID = " + objrequestCore['erp_id'].toString() + " where FBAID="+objrequestCore['fba_id'].toString();
            let obj_post_code_status = {
                'req': objrequestCore,
				'posp_status': 'PENDING',
                'employee_status': 'PENDING',
                'fm_status' : 'PENDING',                
				'posp_msg': 'NA',
                'employee_msg': 'NA',
                'fm_msg': 'NA',
				'posp_qry': posp_qry_str,
                'employee_qry': employee_qry_str,
				'fm_qry': fm_query
            };
            if (req.query['dbg'] === 'yes') {
                obj_post_code_status['dbg'] = 'yes';
                return res.json(obj_post_code_status);
            } else {
                var sql = require("mssql");
                sql.close();
                sql.connect(config.pospsqldb, function (conn_err) {
                    if (conn_err) {
                        obj_post_code_status['posp_status'] = 'DB_CON_ERR';
                        obj_post_code_status['posp_msg'] = conn_err;
						erp_code_generation_post_process_handler(res, obj_post_code_status);
                    } else {						
                        var posp_update_request = new sql.Request();
                        posp_update_request.query(posp_qry_str, function (qry_err, recordset) {
                            if (qry_err) {
                                obj_post_code_status['posp_status'] = 'DB_UPDATE_ERR';
                                obj_post_code_status['posp_msg'] = qry_err;
								erp_code_generation_post_process_handler(res, obj_post_code_status);
                            } else {
                                obj_post_code_status['posp_status'] = 'SUCCESS';
                                obj_post_code_status['posp_msg'] = recordset;
								//portal db
								var portalsql = require("mssql");
								portalsql.close();
								portalsql.connect(config.portalsqldb, function (conn_err) {
									if (conn_err) {
										obj_post_code_status['employee_status'] = 'DB_CON_ERR';
										obj_post_code_status['employee_msg'] = conn_err;
										erp_code_generation_post_process_handler(res, obj_post_code_status);
									} else {
										var employee_update_request = new portalsql.Request();
										employee_update_request.query(employee_qry_str, function (qry_err, recordset) {
											if (qry_err) {
												obj_post_code_status['employee_status'] = 'DB_UPDATE_ERR';
												obj_post_code_status['employee_msg'] = qry_err;
												erp_code_generation_post_process_handler(res, obj_post_code_status);
											} else {
												obj_post_code_status['employee_status'] = 'SUCCESS';
												obj_post_code_status['employee_msg'] = recordset;
												
												//mysql db
												var mysql = require('mysql');
												var mysql_con = mysql.createConnection({
													host: "finmart.cb2rojdrkjxn.ap-south-1.rds.amazonaws.com",
													user: "finmart_user",
													password: "finmart0909",
													database: "BackOffice"
												});
												mysql_con.connect(function (conn_err) {
													if (conn_err)
													{
														obj_post_code_status['fm_status'] = 'DB_CON_ERR';
														obj_post_code_status['fm_msg'] = conn_err;
														erp_code_generation_post_process_handler(res, obj_post_code_status);	
													} else {						
														mysql_con.query(fm_query, function (qry_err, recordset) {
															if (qry_err) {
																obj_post_code_status['fm_status'] = 'DB_UPDATE_ERR';
																obj_post_code_status['fm_msg'] = qry_err;
															} else {
																obj_post_code_status['fm_status'] = 'SUCCESS';
																obj_post_code_status['fm_msg'] = recordset;
															}
															erp_code_generation_post_process_handler(res, obj_post_code_status);
														});
													}
												});
											}
										});
									}
								});
                            }                           
                        });
					}
				});					
            }
        } catch (e) {
            return res.send(e.stack);
        }
    });
	app.get('/posps/mssql/sync_training_date', LoadSession, function (req, res) {
		let posp_user = require('../models/posp_users.js');
		
		let ss_id = req.query['ss_id'] || 0;
		ss_id	= ss_id - 0;
		
		posp_user.findOne({"Ss_Id": ss_id}, function (err, dbresult) {
			try {
				if(dbresult){
					dbresult = dbresult._doc;
				}
				else{
					return res.send('POSP_USER_NA');
				}
				let objrequestCore = {
					'ss_id': ss_id,
					'training_start_date': dbresult['Training_Start_Date'] || '',
					'training_end_date': dbresult['Training_End_Date'] || ''				
				};
				if(objrequestCore['training_start_date'] === ""){
					return res.json({
						'req': objrequestCore,
						'posp_status': 'SUCCESS',
						'posp_msg': 'NA',
						'posp_qry': ''                
					});
				}
				if(objrequestCore['ss_id'] > 0 && (objrequestCore['training_start_date'] !== '' || objrequestCore['training_end_date'] !== '')){
					
				}
				else{
					return res.send('PARAMETER MISSING');
				}
				
				
				let posp_qry_str = "update Posp_Details set TrainingStartDate = '" + moment(objrequestCore['training_start_date']).utcOffset("+00:00").format('YYYY-MM-DD HH:mm:ss') + "' ___TRAINING_END_DATE___ where SS_ID = " + objrequestCore["ss_id"].toString();
				if(objrequestCore['training_end_date'] !== ''){
					posp_qry_str = posp_qry_str.replace('___TRAINING_END_DATE___',", TrainingEndDate = '"+moment(objrequestCore['training_end_date']).utcOffset("+00:00").format('YYYY-MM-DD HH:mm:ss')+"'");
				}
				else{
					posp_qry_str = posp_qry_str.replace('___TRAINING_END_DATE___',"");
				}
				let obj_post_code_status = {
					'req': objrequestCore,
					'posp_status': 'PENDING',
					'posp_msg': 'NA',
					'posp_qry': posp_qry_str                
				};
				if (req.query['dbg'] === 'yes') {
					obj_post_code_status['dbg'] = 'yes';
					return res.json(obj_post_code_status);
				} else {
					var sql = require("mssql");
					sql.close();
					sql.connect(config.pospsqldb, function (conn_err) {
						if (conn_err) {
							obj_post_code_status['posp_status'] = 'DB_CON_ERR';
							obj_post_code_status['posp_msg'] = conn_err;
							sync_training_date_handler(res, obj_post_code_status);
						} else {						
							var posp_update_request = new sql.Request();
							posp_update_request.query(posp_qry_str, function (qry_err, recordset) {
								if (qry_err) {
									obj_post_code_status['posp_status'] = 'DB_UPDATE_ERR';
									obj_post_code_status['posp_msg'] = qry_err;
									
								} else {
									obj_post_code_status['posp_status'] = 'SUCCESS';
									obj_post_code_status['posp_msg'] = recordset;
								}
								sync_training_date_handler(res, obj_post_code_status);	
							});
						}
					});					
				}
			} catch (e) {
				return res.send(e.stack);
			}
		});		
	});
	app.get('/posps/mssql/sync_pospuser_to_posp', function (req, res) {
		let posp_user = require('../models/posp_users.js');
		
		let ss_id = req.query['ss_id'] || 0;
		ss_id	= ss_id - 0;
		if(ss_id === 0){
			return res.send("INVALID_SSID");
		}
		posp_user.findOne({"Ss_Id": ss_id}, function (err, dbresult) {
			try {
				if(dbresult){
					dbresult = dbresult._doc;
				}
				else{
					return res.send('POSP_USER_NA');
				}
				// update POSP_Details set Pan_No=,Aadhar=,Present_State=,Present_City=,Present_Add1=,Present_Add2=,Present_Add3=,Permanant_City=,DOB=  where SS_ID=
				let pospFieldSchema_Sql_to_Mongo = {
	"Aadhar": "Aadhar",
	"Account_Type": "Account_Type",
	"AgentCity": "Agent_City",
	"Already_posp": "Already_Posp",
	"Bank_Account_No": "Bank_Account_No",
	"Bank_Branch": "Bank_Branch",
	"Bank_Name": "Bank_Name",
	"DOB": "Birthdate",
	"Education": "Education",
	"Email_ID": "Email_Id",
	"Experience": "Experience",
	"Father_Name": "Father_Name",
	"First_Name": "First_Name",
	"Gender": "Gender",
	"IFSC_Code": "Ifsc_Code",
	"Income": "Income",
	"Last_Name": "Last_Name",
	"MICR_Code": "Micr_Code",
	"Middle_Name": "Middle_Name",
	"Mobile_No": "Mobile_No",
	"Name_as_in_Bank": "Name_as_in_Bank",
	"Nominee_Aadhar": "Nominee_Aadhar",
	"Nominee_AccountType": "Nominee_Account_Type",
	"Nominee_BankAccountNumber": "Nominee_Bank_Account_Number",
	"Nominee_BankBranch": "Nominee_Bank_Branch",
	"Nominee_BankCity": "Nominee_Bank_City",
	"Nominee_BankName": "Nominee_Bank_Name",
	"Nominee_FirstName": "Nominee_First_Name",
	"Nominee_Gender": "Nominee_Gender",
	"Nominee_IFSCCode": "Nominee_Ifsc_Code",
	"Nominee_LastName": "Nominee_Last_Name",
	"Nominee_MICRCode": "Nominee_Micr_Code",
	"Nominee_MiddleName": "Nominee_Middle_Name",
	"Nominee_PAN": "Nominee_Pan",
	"Nominee_Relationship": "Nominee_Relationship",
	"NomineeName_as_in_Bank": "Nominee_Name_as_in_Bank",
	"PAN_No": "Pan_No",
	"Permanant_Add1": "Permanant_Add1",
	"Permanant_Add2": "Permanant_Add2",
	"Permanant_Add3": "Permanant_Add3",
	"Permanant_City": "Permanant_City",
	"Permanant_Landmark": "Permanant_Landmark",
	"Permanant_Pincode": "Permanant_Pincode",
	"Permanant_State": "Permanant_State",
	"Present_Add1": "Present_Add1",
	"Present_Add2": "Present_Add2",
	"Present_Add3": "Present_Add3",
	"Present_City": "Present_City",
	"Present_Landmark": "Present_Landmark",
	"Present_Pincode": "Present_Pincode",
	"Present_State": "Present_State",
	"RegAmount": "RegAmount"	
};
				
				let objrequestCore = {};
				let posp_qry_str = "update Posp_Details set ";
				let arr_posp_qry = [];
				for(let sql_key in pospFieldSchema_Sql_to_Mongo){
					let mongo_key = pospFieldSchema_Sql_to_Mongo[sql_key] || "";
					let mongo_val = dbresult[mongo_key] || "";					
					if(mongo_key && mongo_val){
						if(['RegAmount','Permanant_Pincode','Present_Pincode'].indexOf(mongo_key) === -1){
							mongo_val = mongo_val.trim().toString().replace(/'/g, "\\'");
							arr_posp_qry.push(sql_key + " = '"+mongo_val+"'");
						}
						else{
							arr_posp_qry.push(sql_key + " = "+mongo_val);
						}
						objrequestCore[sql_key] = mongo_val;
					}
				}
				posp_qry_str += arr_posp_qry.join(" , ");
				posp_qry_str += " where SS_ID = " + ss_id.toString();
				if(arr_posp_qry.length > 0){
					
				}
				else{
					return res.send('PARAMETER MISSING');
				}
				
				
				
				let obj_post_code_status = {
					'ss_id' : ss_id,
					'req': objrequestCore,
					'posp_status': 'PENDING',
					'posp_msg': 'NA',
					'posp_qry': posp_qry_str                
				};
				if (req.query['dbg'] === 'yes') {
					obj_post_code_status['dbg'] = 'yes';
					return res.json(obj_post_code_status);
				} else {
					let sql = require("mssql");
					sql.close();
					sql.connect(config.pospsqldb, function (conn_err) {
						if (conn_err) {
							obj_post_code_status['posp_status'] = 'DB_CON_ERR';
							obj_post_code_status['posp_msg'] = conn_err;
							sync_iib_handler(res, obj_post_code_status);
						} else {						
							let posp_update_request = new sql.Request();
							posp_update_request.query(posp_qry_str, function (qry_err, recordset) {
								if (qry_err) {
									obj_post_code_status['posp_status'] = 'DB_UPDATE_ERR';
									obj_post_code_status['posp_msg'] = qry_err;
									
								} else {
									obj_post_code_status['posp_status'] = 'SUCCESS';
									obj_post_code_status['posp_msg'] = recordset;
								}
								sync_pospuser_to_posp_handler(res, obj_post_code_status);	
							});
						}
					});					
				}
			} catch (e) {
				return res.send(e.stack);
			}
		});		
	});
	function sync_pospuser_to_posp_handler(res,obj_post_code_status){	
		let ss_id = obj_post_code_status['ss_id'];
		client.get(config.environment.weburl + '/report/sync_posp_master?ss_id=' + ss_id, {}, function (data, response) {
			let Email = require('../models/email');
			let objModelEmail = new Email();

			let res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>POSP IIB UPLOAD</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
			res_report += '<p><h1>MSSQL SYNC IIB , SSID-'+ss_id + '</h1></p>';	
			res_report += '<p><pre>' + JSON.stringify(obj_post_code_status, undefined, 2) + '</pre><p>';	
			res_report += '</body></html>';
			let subject = '[POSPUSER_TO_POSP_MSSQL_SYNC] POSPUSER_TO_POSP , SSID-'+ss_id;
			objModelEmail.send('notifications@policyboss.com', config.environment.notification_email,subject, res_report, '', '');		
			return res.json(obj_post_code_status);
		});
		
	}
	app.get('/posps/mssql/sync_iib', LoadSession, function (req, res) {
		let posp_user = require('../models/posp_users.js');
		
		let ss_id = req.query['ss_id'] || 0;
		ss_id	= ss_id - 0;
		posp_user.findOne({"Ss_Id": ss_id}, function (err, dbresult) {
			try {
				if(dbresult){
					dbresult = dbresult._doc;
				}
				else{
					return res.send('POSP_USER_NA');
				}
				/*
				"POSP_UploadedtoIIB" : "Yes",
				"POSP_UploadingDateAtIIB" : "26-08-2023",
				
				*/
				let objrequestCore = {
					'ss_id': ss_id,
					"POSP_UploadedtoIIB" : "Yes",
					'POSP_UploadingDateAtIIB': dbresult['POSP_UploadingDateAtIIB'] || ""			
				};
				
				if(objrequestCore['ss_id'] > 0 && objrequestCore['POSP_UploadingDateAtIIB'] !== ''){
					
				}
				else{
					return res.send('PARAMETER MISSING');
				}
				
				
				let posp_qry_str = "update Posp_Details set POSP_UploadedtoIIB = 'Yes' , POSP_UploadingDateAtIIB = '" + objrequestCore['POSP_UploadingDateAtIIB'] + "' where SS_ID = " + objrequestCore["ss_id"].toString();
				
				let obj_post_code_status = {
					'req': objrequestCore,
					'posp_status': 'PENDING',
					'posp_msg': 'NA',
					'posp_qry': posp_qry_str                
				};
				if (req.query['dbg'] === 'yes') {
					obj_post_code_status['dbg'] = 'yes';
					return res.json(obj_post_code_status);
				} else {
					var sql = require("mssql");
					sql.close();
					sql.connect(config.pospsqldb, function (conn_err) {
						if (conn_err) {
							obj_post_code_status['posp_status'] = 'DB_CON_ERR';
							obj_post_code_status['posp_msg'] = conn_err;
							sync_iib_handler(res, obj_post_code_status);
						} else {						
							var posp_update_request = new sql.Request();
							posp_update_request.query(posp_qry_str, function (qry_err, recordset) {
								if (qry_err) {
									obj_post_code_status['posp_status'] = 'DB_UPDATE_ERR';
									obj_post_code_status['posp_msg'] = qry_err;
									
								} else {
									obj_post_code_status['posp_status'] = 'SUCCESS';
									obj_post_code_status['posp_msg'] = recordset;
								}
								sync_iib_handler(res, obj_post_code_status);	
							});
						}
					});					
				}
			} catch (e) {
				return res.send(e.stack);
			}
		});		
	});
	app.get('/posps/mssql/sync_noc', LoadSession, function (req, res) {
		let posp_user = require('../models/posp_users.js');
		
		let ss_id = req.query['ss_id'] || 0;
		ss_id	= ss_id - 0;
		posp_user.findOne({"Ss_Id": ss_id}, function (err, dbresult) {
			try {
				if(dbresult){
					dbresult = dbresult._doc;
				}
				else{
					return res.send('POSP_USER_NA');
				}
				/*
				"POSP_DeActivatedtoIIB" : "Yes",
				"POSP_DeActivatedDateAtIIB" : "26-08-2023",
				
				*/
				let objrequestCore = {
					'ss_id': ss_id,
					"POSP_DeActivatedtoIIB" : "Yes",
					'POSP_DeActivatedDateAtIIB': dbresult['POSP_DeActivatedDateAtIIB'] || ""			
				};
				
				if(objrequestCore['ss_id'] > 0 && objrequestCore['POSP_DeActivatedDateAtIIB'] !== ''){
					
				}
				else{
					return res.send('PARAMETER MISSING');
				}
				
				
				let posp_qry_str = "update Posp_Details set IsActive = 0 , IsPospBlocked = 1 , BlockDescription = 'Not Interested to work' , POSP_DeActivatedtoIIB = 'Yes' , POSP_DeActivatedDateAtIIB = '" + moment(objrequestCore['POSP_DeActivatedDateAtIIB']).utcOffset("+00:00").format('DD-MM-YYYY') + "' where SS_ID = " + objrequestCore["ss_id"].toString();
				
				let obj_post_code_status = {
					'req': objrequestCore,
					'posp_status': 'PENDING',
					'posp_msg': 'NA',
					'posp_qry': posp_qry_str                
				};
				if (req.query['dbg'] === 'yes') {
					obj_post_code_status['dbg'] = 'yes';
					return res.json(obj_post_code_status);
				} else {
					var sql = require("mssql");
					sql.close();
					sql.connect(config.pospsqldb, function (conn_err) {
						if (conn_err) {
							obj_post_code_status['posp_status'] = 'DB_CON_ERR';
							obj_post_code_status['posp_msg'] = conn_err;
							sync_noc_handler(res, obj_post_code_status);
						} else {						
							var posp_update_request = new sql.Request();
							posp_update_request.query(posp_qry_str, function (qry_err, recordset) {
								if (qry_err) {
									obj_post_code_status['posp_status'] = 'DB_UPDATE_ERR';
									obj_post_code_status['posp_msg'] = qry_err;
									
								} else {
									obj_post_code_status['posp_status'] = 'SUCCESS';
									obj_post_code_status['posp_msg'] = recordset;
								}
								sync_noc_handler(res, obj_post_code_status);	
							});
						}
					});					
				}
			} catch (e) {
				return res.send(e.stack);
			}
		});		
	});
	app.get('/posps/dashboard/recruitment_historic_summary', LoadSession, function (req, res, next) {
		try {
			let report_category = req.query['report_category'] || "EVENTDATE";
			let SubVertical = (req.query.hasOwnProperty('SubVertical') && req.query['SubVertical'] !== '') ? req.query['SubVertical'] : '';
			let Channel = req.query['Channel'] || '';
			let Reporting = req.query['Reporting'] || '';
			let Reporting_One = req.query['Reporting_One'] || '';
			let Reporting_Two = req.query['Reporting_Two'] || '';
			let Posp_Report_Stage_Category = req.query['Posp_Report_Stage_Category'] || 'INCLUSIVE';
			var today = moment().utcOffset("+05:30").startOf('Day');
			var today_start = moment().utcOffset("+05:30").startOf('Day');
			var today_end = moment().utcOffset("+05:30").endOf('Day');
			var yesterday_start = moment().add(-1, 'days').utcOffset("+05:30").startOf('Day');
			var yesterday = moment().add(-1, 'days').utcOffset("+05:30").endOf('Day');
			let obj_Posp_Summary = {           
				'TODAY': {
					'start': today_start,
					'end': today_end,
					'count': null
				},
				'YESTERDAY': {
					'start': yesterday_start,
					'end': yesterday,
					'count': null
				},
				'DAY_BEFORE_YESTERDAY': {
					'start': moment().subtract(2, 'day').utcOffset("+05:30").startOf('Day'),
					'end': moment().subtract(2, 'day').utcOffset("+05:30").endOf('Day'),
					'count': null
				},
				'2DAY_BEFORE_YESTERDAY': {
					'start': moment().subtract(3, 'day').utcOffset("+05:30").startOf('Day'),
					'end': moment().subtract(3, 'day').utcOffset("+05:30").endOf('Day'),
					'count': null
				},
				'3DAY_BEFORE_YESTERDAY': {
					'start': moment().subtract(4, 'day').utcOffset("+05:30").startOf('Day'),
					'end': moment().subtract(4, 'day').utcOffset("+05:30").endOf('Day'),
					'count': null
				},
				'LAST_3_DAY': {
					'start': moment().subtract(3, 'day').utcOffset("+05:30").startOf('day'),
					'end': yesterday,
					'count': null
				},	
				'WEEKLY': {
					'start': moment().subtract(7, 'day').utcOffset("+05:30").startOf('day'),
					'end': yesterday,
					'count': null
				},	
				'MONTHLY': {
					'start': moment().utcOffset("+05:30").startOf('month'),
					'end': yesterday,
					'count': null
				},
				'MONTHLY-PREVIOUS': {
					'start': moment().subtract(1, 'month').utcOffset("+05:30").startOf('month'),
					'end': moment().subtract(1, 'month').utcOffset("+05:30").endOf('month'),
					'count': null
				},
				'MONTHLY-PREVIOUS-2': {
					'start': moment().subtract(2, 'month').utcOffset("+05:30").startOf('month'),
					'end': moment().subtract(2, 'month').utcOffset("+05:30").endOf('month'),
					'count': null
				},
				'MONTHLY-PREVIOUS-3': {
					'start': moment().subtract(3, 'month').utcOffset("+05:30").startOf('month'),
					'end': moment().subtract(3, 'month').utcOffset("+05:30").endOf('month'),
					'count': null
				},
				'MONTHLY-PREVIOUS-4': {
					'start': moment().subtract(4, 'month').utcOffset("+05:30").startOf('month'),
					'end': moment().subtract(4, 'month').utcOffset("+05:30").endOf('month'),
					'count': null
				},	
				'YEARLY': {
					'start': moment('2024-04-01').utcOffset("+05:30").startOf('day'),
					'end': yesterday,
					'count': null
				},
				'YEARLY-2023_2024': {
					'start': moment('2023-04-01').utcOffset("+05:30").startOf('day'),
					'end': moment('2024-03-31').utcOffset("+05:30").endOf('day'),
					'count': null
				},
				'YEARLY-2022_2023': {
					'start': moment('2022-04-01').utcOffset("+05:30").startOf('day'),
					'end': moment('2023-03-31').utcOffset("+05:30").endOf('day'),
					'count': null
				},	
				'YEARLY-2021_2022': {
					'start': moment('2021-04-01').utcOffset("+05:30").startOf('day'),
					'end': moment('2022-03-31').utcOffset("+05:30").endOf('day'),
					'count': null
				},
				'YEARLY-2020_2021': {
					'start': moment('2020-04-01').utcOffset("+05:30").startOf('day'),
					'end': moment('2021-03-31').utcOffset("+05:30").endOf('day'),
					'count': null
				},
				'YEARLY-2019_2020': {
					'start': moment('2019-04-01').utcOffset("+05:30").startOf('day'),
					'end': moment('2020-03-31').utcOffset("+05:30").endOf('day'),
					'count': null
				},
				'YEARLY-2018_2019': {
					'start': moment('2018-04-01').utcOffset("+05:30").startOf('day'),
					'end': moment('2019-03-31').utcOffset("+05:30").endOf('day'),
					'count': null
				},
				'YEARLY-2017_2018': {
					'start': moment('2017-04-01').utcOffset("+05:30").startOf('day'),
					'end': moment('2018-03-31').utcOffset("+05:30").endOf('day'),
					'count': null
				}, 			
				'ALL': {
					'start': moment('2017-04-01').utcOffset("+05:30").startOf('day'),
					'end': yesterday,
					'count': null
				}
			};
			
			let count_report_type = req.query['report_type'] || "NA";
			let obj_query_schema = {
				"SIGNUP" : {
					"Status_Field" : "NA",
					"Date_Field" : "Created_On"
				},
				"PAYMENT" : {
					"Status_Field" : "Is_Paid",
					"Date_Field" : "Paid_On"
				},
				"IIB_UPLOAD" : {
					"Status_Field" : "Is_IIB",
					"Date_Field" : "IIB_On"
				},
				"EXAM_PASS" : {
					"Status_Field" : "Is_Exam",
					"Date_Field" : "Certification_Datetime"
				},
				"POS_CODE_CREATED" : {
					"Status_Field" : "Is_Certified",
					"Date_Field" : "ERPID_CreatedDate"
				},
				"DEACTIVATION" : {
					"Status_Field" : "Is_DeActivation",
					"Date_Field" : "DeActivation_On"
				},
				"SYNC" : {
					"Status_Field" : "Is_Contact_Sync",
					"Date_Field" : "Contact_Sync_On"
				},
				"APP" : {
					"Status_Field" : "Is_App_Installed",
					"Date_Field" : "App_Installed_On"
				},
				"SALE" : {
					"Status_Field" : "Is_Sale",
					"Date_Field" : "First_Sale_On"
				}
			};
			
			for (let k in obj_Posp_Summary) {
				let cond_posp_qry = {'Is_Active': true, 'IsFOS' : {"$ne":1}};
				let fromDate = obj_Posp_Summary[k]['start'].format("YYYY-MM-DD");
				let toDate = obj_Posp_Summary[k]['end'].format("YYYY-MM-DD");
				
				let mom_fromDate = obj_Posp_Summary[k]['start'].toDate();
				let mom_toDate = obj_Posp_Summary[k]['end'].toDate();
				obj_Posp_Summary[k]['mom_start'] = mom_fromDate;
				obj_Posp_Summary[k]['mom_end'] = mom_toDate;
				
				let arrFrom = fromDate.split('-');
				let dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);
				let arrTo = toDate.split('-');
				let dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
				dateTo.setDate(dateTo.getDate() + 1);
				
				
				if(count_report_type === 'DEACTIVATION'){
					cond_posp_qry = {};
				}
				
				if(report_category == 'EVENTDATE'){
					if(obj_query_schema[count_report_type]['Date_Field'] == "First_Sale_On"){
						cond_posp_qry[obj_query_schema[count_report_type]['Date_Field']] = {"$gte": fromDate, "$lte": toDate};
					}
					else{
						cond_posp_qry[obj_query_schema[count_report_type]['Date_Field']] = {"$gte": mom_fromDate, "$lte": mom_toDate};
					}
				}
				else{
					cond_posp_qry['Created_On'] = {"$gte": mom_fromDate, "$lte": mom_toDate};
				}
				//cond_posp_qry[obj_query_schema[count_report_type]['Date_Field']] = {"$gte": dateFrom, "$lte": dateTo};
				
				if(Posp_Report_Stage_Category == 'EXCLUSIVE'){
					if(count_report_type == "SIGNUP"){
						cond_posp_qry["Is_IIB"] = 0;						
					}
					if(count_report_type == "PAYMENT"){
						cond_posp_qry["Is_IIB"] = 0;						
					}
					if(count_report_type == "EXAM_PASS"){
						cond_posp_qry["Is_Certified"] = 0;						
					}
					
					if(count_report_type == "IIB_UPLOAD"){
						cond_posp_qry["Is_Certified"] = 0;
						cond_posp_qry["Is_Exam"] = 0;	
					}
				}
				
				
				if(obj_query_schema[count_report_type]['Status_Field'] !== 'NA'){
					cond_posp_qry[obj_query_schema[count_report_type]['Status_Field']] = 1;
				}
				
				if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1 || req.obj_session.user.role_detail.role.indexOf('Recruiter') > -1) {

				} else {
					cond_posp_qry['Ss_Id'] = {$in: req.obj_session.users_assigned.Team.POSP};
				}
				
				if(SubVertical !== ''){
					cond_posp_qry['SubVertical'] = SubVertical;					
				}
				if(Channel !== ''){
					if(Channel == "6_SERIES"){
						cond_posp_qry['Channel'] = { "$ne" : "DIRECT"};
					}
					if(Channel == "9_SERIES"){
						cond_posp_qry['Channel'] = "DIRECT";					
					}					
				}
				if(Reporting !== ''){
					Reporting = Reporting - 0;	
					cond_posp_qry['$or'] = [
						{'Reporting_Agent_Uid' :  Reporting},
						{'Reporting_One_UID': Reporting},
						{'Reporting_Two_UID': Reporting},
						{'Reporting_Three_UID': Reporting},
						{'Reporting_Four_UID': Reporting}
					];
				}
				if(Reporting_One !== ''){
					cond_posp_qry['Reporting_One'] = Reporting_One;					
				}
				if(Reporting_Two !== ''){
					cond_posp_qry['Reporting_Two'] = Reporting_Two;					
				}
				
				
				
				obj_Posp_Summary[k]['qry'] = cond_posp_qry;	
				Posp.count(cond_posp_qry).exec(function (err, dbRecruitment_Count) {
					try{	
						if (err) {
							return res.send(err);
						} else {
							obj_Posp_Summary[k]['count'] = dbRecruitment_Count || 0;
							obj_Posp_Summary[k]['data'] = [];
							posps_recruitment_historic_summary(obj_Posp_Summary, req, res);
						}
					}
					catch(e){
						res.send(e.stack);
					}					
				});				
			}        
		} catch (Ex) {
			console.error('Exception', 'onboarding_summary_historic', Ex.stack);
			res.send(Ex.stack);
		}
	});
	app.get('/posps/dashboard/recruitment_historic_posplist', LoadSession, function (req, res, next) {
		try {
			let report_category = req.query['report_category'] || "EVENTDATE";
			let frequency = req.query['frequency'] || "TODAY";
			let SubVertical = (req.query.hasOwnProperty('SubVertical') && req.query['SubVertical'] !== '') ? req.query['SubVertical'] : '';
			let Channel = req.query['Channel'] || '';
			let Posp_Report_Stage_Category = req.query['Posp_Report_Stage_Category'] || 'INCLUSIVE';
			let Reporting = req.query['Reporting'] || '';
			let Reporting_One = req.query['Reporting_One'] || '';
			let Reporting_Two = req.query['Reporting_Two'] || '';
			var today = moment().utcOffset("+05:30").startOf('Day');
			var today_start = moment().utcOffset("+05:30").startOf('Day');
			var today_end = moment().utcOffset("+05:30").endOf('Day');
			var yesterday_start = moment().add(-1, 'days').utcOffset("+05:30").startOf('Day');
			var yesterday = moment().add(-1, 'days').utcOffset("+05:30").endOf('Day');
			let obj_Posp_Summary = {           
				'TODAY': {
					'start': today_start,
					'end': today_end,
					'count': null
				},
				'YESTERDAY': {
					'start': yesterday_start,
					'end': yesterday,
					'count': null
				},
				'DAY_BEFORE_YESTERDAY': {
					'start': moment().subtract(2, 'day').utcOffset("+05:30").startOf('Day'),
					'end': moment().subtract(2, 'day').utcOffset("+05:30").endOf('Day'),
					'count': null
				},
				'2DAY_BEFORE_YESTERDAY': {
					'start': moment().subtract(3, 'day').utcOffset("+05:30").startOf('Day'),
					'end': moment().subtract(3, 'day').utcOffset("+05:30").endOf('Day'),
					'count': null
				},
				'3DAY_BEFORE_YESTERDAY': {
					'start': moment().subtract(4, 'day').utcOffset("+05:30").startOf('Day'),
					'end': moment().subtract(4, 'day').utcOffset("+05:30").endOf('Day'),
					'count': null
				},
				'LAST_3_DAY': {
					'start': moment().subtract(3, 'day').utcOffset("+05:30").startOf('day'),
					'end': yesterday,
					'count': null
				},	
				'WEEKLY': {
					'start': moment().subtract(7, 'day').utcOffset("+05:30").startOf('day'),
					'end': yesterday,
					'count': null
				},	
				'MONTHLY': {
					'start': moment().utcOffset("+05:30").startOf('month'),
					'end': yesterday,
					'count': null
				},
				'MONTHLY-PREVIOUS': {
					'start': moment().subtract(1, 'month').utcOffset("+05:30").startOf('month'),
					'end': moment().subtract(1, 'month').utcOffset("+05:30").endOf('month'),
					'count': null
				},
				'MONTHLY-PREVIOUS-2': {
					'start': moment().subtract(2, 'month').utcOffset("+05:30").startOf('month'),
					'end': moment().subtract(2, 'month').utcOffset("+05:30").endOf('month'),
					'count': null
				},
				'MONTHLY-PREVIOUS-3': {
					'start': moment().subtract(3, 'month').utcOffset("+05:30").startOf('month'),
					'end': moment().subtract(3, 'month').utcOffset("+05:30").endOf('month'),
					'count': null
				},
				'MONTHLY-PREVIOUS-4': {
					'start': moment().subtract(4, 'month').utcOffset("+05:30").startOf('month'),
					'end': moment().subtract(4, 'month').utcOffset("+05:30").endOf('month'),
					'count': null
				},	
				'YEARLY': {
					'start': moment('2024-04-01').utcOffset("+05:30").startOf('day'),
					'end': yesterday,
					'count': null
				},
				'YEARLY-2023_2024': {
					'start': moment('2023-04-01').utcOffset("+05:30").startOf('day'),
					'end': moment('2024-03-31').utcOffset("+05:30").endOf('day'),
					'count': null
				},
				'YEARLY-2022_2023': {
					'start': moment('2022-04-01').utcOffset("+05:30").startOf('day'),
					'end': moment('2023-03-31').utcOffset("+05:30").endOf('day'),
					'count': null
				},	
				'YEARLY-2021_2022': {
					'start': moment('2021-04-01').utcOffset("+05:30").startOf('day'),
					'end': moment('2022-03-31').utcOffset("+05:30").endOf('day'),
					'count': null
				},
				'YEARLY-2020_2021': {
					'start': moment('2020-04-01').utcOffset("+05:30").startOf('day'),
					'end': moment('2021-03-31').utcOffset("+05:30").endOf('day'),
					'count': null
				},
				'YEARLY-2019_2020': {
					'start': moment('2019-04-01').utcOffset("+05:30").startOf('day'),
					'end': moment('2020-03-31').utcOffset("+05:30").endOf('day'),
					'count': null
				},
				'YEARLY-2018_2019': {
					'start': moment('2018-04-01').utcOffset("+05:30").startOf('day'),
					'end': moment('2019-03-31').utcOffset("+05:30").endOf('day'),
					'count': null
				},
				'YEARLY-2017_2018': {
					'start': moment('2017-04-01').utcOffset("+05:30").startOf('day'),
					'end': moment('2018-03-31').utcOffset("+05:30").endOf('day'),
					'count': null
				}, 			
				'ALL': {
					'start': moment('2017-04-01').utcOffset("+05:30").startOf('day'),
					'end': yesterday,
					'count': null
				}
			};
			
			let count_report_type = req.query['report_type'] || "NA";
			let obj_query_schema = {
				"SIGNUP" : {
					"Status_Field" : "NA",
					"Date_Field" : "Created_On"
				},
				"APP" : {
					"Status_Field" : "Is_App_Installed",
					"Date_Field" : "App_Installed_On"
				},
				"PAYMENT" : {
					"Status_Field" : "Is_Paid",
					"Date_Field" : "Paid_On"
				},
				"IIB_UPLOAD" : {
					"Status_Field" : "Is_IIB",
					"Date_Field" : "IIB_On"
				},
				"EXAM_PASS" : {
					"Status_Field" : "Is_Exam",
					"Date_Field" : "Certification_Datetime"
				},
				"POS_CODE_CREATED" : {
					"Status_Field" : "Is_Certified",
					"Date_Field" : "ERPID_CreatedDate"
				},
				"DEACTIVATION" : {
					"Status_Field" : "Is_DeActivation",
					"Date_Field" : "DeActivation_On"
				},
				"SYNC" : {
					"Status_Field" : "Is_Contact_Sync",
					"Date_Field" : "Contact_Sync_On"
				},				
				"SALE" : {
					"Status_Field" : "Is_Sale",
					"Date_Field" : "First_Sale_On"
				}
			};
			
			let obj_Posp_Summary_filter = obj_Posp_Summary[frequency];
			obj_Posp_Summary = {};
			obj_Posp_Summary[frequency] = obj_Posp_Summary_filter;
			for (let k in obj_Posp_Summary) {
				let cond_posp_qry = {'Is_Active': true, 'IsFOS' : {"$ne":1}};
				let fromDate = obj_Posp_Summary[k]['start'].format("YYYY-MM-DD");
				let toDate = obj_Posp_Summary[k]['end'].format("YYYY-MM-DD");
				
				let mom_fromDate = obj_Posp_Summary[k]['start'].toDate();
				let mom_toDate = obj_Posp_Summary[k]['end'].toDate();
				obj_Posp_Summary[k]['mom_start'] = mom_fromDate;
				obj_Posp_Summary[k]['mom_end'] = mom_toDate;
				
				let arrFrom = fromDate.split('-');
				let dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);
				let arrTo = toDate.split('-');
				let dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
				dateTo.setDate(dateTo.getDate() + 1);
				if(count_report_type === 'DEACTIVATION'){
					cond_posp_qry = {};
				}
				
				if(report_category == 'EVENTDATE'){
					if(obj_query_schema[count_report_type]['Date_Field'] == "First_Sale_On"){
						cond_posp_qry[obj_query_schema[count_report_type]['Date_Field']] = {"$gte": fromDate, "$lte": toDate};
					}
					else{
						cond_posp_qry[obj_query_schema[count_report_type]['Date_Field']] = {"$gte": mom_fromDate, "$lte": mom_toDate};
					}
				}
				else{
					cond_posp_qry['Created_On'] = {"$gte": mom_fromDate, "$lte": mom_toDate};
				}
				//cond_posp_qry[obj_query_schema[count_report_type]['Date_Field']] = {"$gte": dateFrom, "$lte": dateTo};
				if(Posp_Report_Stage_Category == 'EXCLUSIVE'){
					if(count_report_type == "SIGNUP"){
						cond_posp_qry["Is_IIB"] = 0;						
					}
					if(count_report_type == "PAYMENT"){
						cond_posp_qry["Is_IIB"] = 0;						
					}
					if(count_report_type == "EXAM_PASS"){
						cond_posp_qry["Is_Certified"] = 0;						
					}
					
					if(count_report_type == "IIB_UPLOAD"){
						cond_posp_qry["Is_Certified"] = 0;
						cond_posp_qry["Is_Exam"] = 0;	
					}
				}
				
				
				if(obj_query_schema[count_report_type]['Status_Field'] !== 'NA'){
					cond_posp_qry[obj_query_schema[count_report_type]['Status_Field']] = 1;
				}
				
				if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1 || req.obj_session.user.role_detail.role.indexOf('Recruiter') > -1) {

				} else if (false && req.obj_session.user.role_detail.role.indexOf('ChannelHead') > -1) {
					let obj_posp_channel_to_source = swap(config.channel.Const_POSP_Channel);
					var arr_source = [];
					for (var x of req.obj_session.user.role_detail.channel_agent) {
						arr_source.push(obj_posp_channel_to_source[x]);
					}
					cond_posp_qry['Sources'] = {$in: arr_source};
					
					/*filter["$or"] = [
						{"Vertical_Head_UID":req.obj_session.user.uid},
						{"Reporting_Agent_Uid":req.obj_session.user.uid}
					];*/
				} else {
					cond_posp_qry['Ss_Id'] = {$in: req.obj_session.users_assigned.Team.POSP};
				}
				
				if(SubVertical !== ''){
					cond_posp_qry['SubVertical'] = SubVertical;					
				}
				if(Channel !== ''){
					if(Channel == "6_SERIES"){
						cond_posp_qry['Channel'] = { "$ne" : "DIRECT"};
					}
					if(Channel == "9_SERIES"){
						cond_posp_qry['Channel'] = "DIRECT";					
					}					
				}
				if(Reporting !== ''){
					Reporting = Reporting - 0;	
					cond_posp_qry['$or'] = [
						{'Reporting_Agent_Uid' :  Reporting},
						{'Reporting_One_UID': Reporting},
						{'Reporting_Two_UID': Reporting},
						{'Reporting_Three_UID': Reporting},
						{'Reporting_Four_UID': Reporting}
					];
				}
				if(Reporting_One !== ''){
					cond_posp_qry['Reporting_One'] = Reporting_One;					
				}
				if(Reporting_Two !== ''){
					cond_posp_qry['Reporting_Two'] = Reporting_Two;					
				}				
				
				obj_Posp_Summary[k]['qry'] = cond_posp_qry;
				Posp.find(cond_posp_qry).select("-_id Ss_Id Fba_Id Erp_Id First_Name Last_Name Vertical SubVertical Reporting_Agent_Name Reporting_Agent_Uid Reporting_One Reporting_Two Reporting_Three Reporting_Four Created_On IIB_On ERPID_CreatedDate First_Sale_On TrainingStartDate Certification_Datetime").exec(function (err, dbRecruitment_List) {					
					try{	
						if(!err && dbRecruitment_List){
							obj_Posp_Summary[k]['data'] = dbRecruitment_List || [];
							obj_Posp_Summary[k]['count'] = dbRecruitment_List.length || 0;
						}
						return res.json(obj_Posp_Summary);
					}
					catch(e){
						res.send(e.stack);
					}					
				});				
			}        
		} catch (Ex) {
			console.error('Exception', 'onboarding_summary_historic', Ex.stack);
			res.send(Ex.stack);
		}
	});	
	app.get('/posps/dashboard/recruitment_pending_historic_summary', LoadSession, function (req, res, next) {
		try {
			let report_category = req.query['report_category'] || "EVENTDATE";
			let report_type = req.query['report_type'] || "";
			let data_type = req.query['data_type'] || "COUNT";			
			let frequency = req.query['frequency'] || "NA"; 
			let SubVertical = (req.query.hasOwnProperty('SubVertical') && req.query['SubVertical'] !== '') ? req.query['SubVertical'] : '';
			let Channel = req.query['Channel'] || '';
			let Reporting = req.query['Reporting'] || '';
			let Posp_Report_Stage_Category = req.query['Posp_Report_Stage_Category'] || 'INCLUSIVE';
			var today = moment().utcOffset("+05:30").startOf('Day');
			var today_start = moment().utcOffset("+05:30").startOf('Day');
			var today_end = moment().utcOffset("+05:30").endOf('Day');
			var yesterday_start = moment().add(-1, 'days').utcOffset("+05:30").startOf('Day');
			var yesterday = moment().add(-1, 'days').utcOffset("+05:30").endOf('Day');
			//["SINCE_7_DAYS","15_TO_30_DAYS","31_TO_90_DAYS","91_TO_180_DAYS"]
			let obj_Posp_Summary = {           
				'SINCE_7_DAYS': {
					'start': moment().subtract(7, 'day').utcOffset("+05:30").startOf('Day'),
					'end': today_end,
					'count': null
				},
				'8_TO_30_DAYS': {
					'start': moment().subtract(30, 'day').utcOffset("+05:30").startOf('Day'),
					'end': moment().subtract(8, 'day').utcOffset("+05:30").endOf('Day'),
					'count': null
				},
				'31_TO_90_DAYS': {
					'start': moment().subtract(90, 'day').utcOffset("+05:30").startOf('Day'),
					'end': moment().subtract(31, 'day').utcOffset("+05:30").endOf('Day'),
					'count': null
				},
				'91_TO_180_DAYS': {
					'start': moment().subtract(180, 'day').utcOffset("+05:30").startOf('Day'),
					'end': moment().subtract(91, 'day').utcOffset("+05:30").endOf('Day'),
					'count': null
				},				 			
				'MORE_THAN_181_DAYS': {
					'start': moment('2017-04-01').utcOffset("+05:30").startOf('day'),
					'end': moment().subtract(181, 'day').utcOffset("+05:30").endOf('Day'),
					'count': null
				},
				'ALL': {
					'start': moment('2017-04-01').utcOffset("+05:30").startOf('day'),
					'end': today_end,
					'count': null
				}
			};
			
			
			
			
			for (let k in obj_Posp_Summary) {
				try{
					let cond_posp_qry = {'Is_Active': true, 'IsFOS' : {"$ne":1}};
					let fromDate = obj_Posp_Summary[k]['start'].format("YYYY-MM-DD");
					let toDate = obj_Posp_Summary[k]['end'].format("YYYY-MM-DD");
					
					let mom_fromDate = obj_Posp_Summary[k]['start'].toDate();
					let mom_toDate = obj_Posp_Summary[k]['end'].toDate();
					obj_Posp_Summary[k]['mom_start'] = mom_fromDate;
					obj_Posp_Summary[k]['mom_end'] = mom_toDate;
					
					let arrFrom = fromDate.split('-');
					let dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);
					let arrTo = toDate.split('-');
					let dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
					dateTo.setDate(dateTo.getDate() + 1);
					
					if(report_type == "SIGNUP"){
						cond_posp_qry['Created_On'] = {"$gte": mom_fromDate, "$lte": mom_toDate};					
					}
					if(report_type == "TRAINING_START_PENDING"){
						cond_posp_qry["Is_IIB"] = 0;
						cond_posp_qry["TrainingStartDate"] = null;	
						cond_posp_qry['Created_On'] = {"$gte": mom_fromDate, "$lte": mom_toDate};					
					}
					if(report_type == "IIB_UPLOAD_PENDING"){
						cond_posp_qry["Is_IIB"] = 0;
						cond_posp_qry["TrainingStartDate"] = {"$ne":null};	
						cond_posp_qry['Created_On'] = {"$gte": mom_fromDate, "$lte": mom_toDate};					
					}
					else if(report_type == "EXAM_PASS_PENDING"){
						cond_posp_qry["Is_IIB"] = 1;
						cond_posp_qry["Is_Certified"] = 0;
						cond_posp_qry["Is_Exam"] = 0;	
						cond_posp_qry['IIB_On'] = {"$gte": mom_fromDate, "$lte": mom_toDate};
					}					
					else if(report_type == "POSCODE_PENDING"){
						cond_posp_qry["Is_IIB"] = 1;	
						cond_posp_qry["Is_Certified"] = 0;
						cond_posp_qry["Is_Exam"] = 1;	
						cond_posp_qry['Certification_Datetime'] = {"$gte": mom_fromDate, "$lte": mom_toDate};
					}
					else if(report_type == "POSCODE_CREATED"){						
						cond_posp_qry["Is_Certified"] = 1;						
						cond_posp_qry['ERPID_CreatedDate'] = {"$gte": mom_fromDate, "$lte": mom_toDate};
					}					
					else if(report_type == "SYNC_CONTACT_PENDING"){
						cond_posp_qry['ERPID_CreatedDate'] = {"$gte": mom_fromDate, "$lte": mom_toDate};
						cond_posp_qry["Is_Certified"] = 1;
						cond_posp_qry["Is_Contact_Sync"] = 0;						
					}
					else if(report_type == "SALE_PENDING"){
						cond_posp_qry['ERPID_CreatedDate'] = {"$gte": mom_fromDate, "$lte": mom_toDate};
						cond_posp_qry["Is_Certified"] = 1;
						cond_posp_qry["Is_Sale"] = 0;						
					}
					else if(report_type == "APP_PENDING"){
						cond_posp_qry['ERPID_CreatedDate'] = {"$gte": mom_fromDate, "$lte": mom_toDate};
						cond_posp_qry["Is_Certified"] = 1;
						cond_posp_qry["Is_App_Installed"] = 0;						
					}	
					
					
					if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1 || req.obj_session.user.role_detail.role.indexOf('Recruiter') > -1) {

					} else {
						cond_posp_qry['Ss_Id'] = {$in: req.obj_session.users_assigned.Team.POSP};
					}
					
					if(SubVertical !== ''){
						cond_posp_qry['SubVertical'] = SubVertical;					
					}
					if(Channel !== ''){
						if(Channel == "6_SERIES"){
							cond_posp_qry['Channel'] = { "$ne" : "DIRECT"};
						}
						if(Channel == "9_SERIES"){
							cond_posp_qry['Channel'] = "DIRECT";					
						}					
					}
					if(Reporting !== ''){
						Reporting = Reporting - 0;	
						cond_posp_qry['$or'] = [
							{'Reporting_Agent_Uid' :  Reporting},
							{'Reporting_One_UID': Reporting},
							{'Reporting_Two_UID': Reporting},
							{'Reporting_Three_UID': Reporting},
							{'Reporting_Four_UID': Reporting}
						];
					}				
					obj_Posp_Summary[k]['qry'] = cond_posp_qry;	
					if(data_type === "COUNT"){
						Posp.count(cond_posp_qry).exec(function (err, dbRecruitment_Count) {
							try{	
								if (err) {
									return res.send(err);
								} else {
									obj_Posp_Summary[k]['count'] = dbRecruitment_Count || 0;
									obj_Posp_Summary[k]['data'] = [];
									posps_recruitment_historic_summary(obj_Posp_Summary, req, res);
								}
							}
							catch(e){
								res.send(e.stack);
							}					
						});
					}
					if(k === frequency && data_type === "LIST"){
						Posp.find(cond_posp_qry).select("-_id Ss_Id Fba_Id Erp_Id First_Name Last_Name Vertical SubVertical Reporting_Agent_Name Reporting_Agent_Uid Reporting_One Reporting_Two Reporting_Three Reporting_Four Created_On IIB_On ERPID_CreatedDate First_Sale_On TrainingStartDate Certification_Datetime").exec(function (err, dbRecruitment_List) {
							try{	
								if(!err && dbRecruitment_List){
									obj_Posp_Summary[k]['data'] = dbRecruitment_List || [];
									obj_Posp_Summary[k]['count'] = dbRecruitment_List.length || 0;
								}
								return res.json(obj_Posp_Summary);
							}
							catch(e){
								return res.send(e.stack);
							}					
						});
					}
				} catch (Ex) {
					console.error('Exception', 'recruitment_pending_historic_summary','loop', Ex.stack);
					return res.send(Ex.stack);
				}	
			}        
		} catch (Ex) {
			console.error('Exception', 'recruitment_pending_historic_summary', Ex.stack);
			res.send(Ex.stack);
		}
	});
	app.get('/posps/rm_mapping/update', LoadSession, function (req, res, next) {	
		try {
			let logged_in_user = req.obj_session.user.fullname + '(ss_id:' + req.obj_session.user.ss_id + ')';
			let row = {
				'ss_id' : req.query['ss_id'] - 0,
				'rm_uid' : req.query['rm_uid'] - 0,
				'remark' : req.query['remark']
			};
			if (row['ss_id'] > 0 && row['rm_uid'] > 0) {
				let obj_rm_mapping = {
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
				
				client.get(config.environment.weburl + '/posps/dsas/view/' + row['ss_id'], {}, function (data, response) {
					if (data['status'] === 'SUCCESS' && ['POSP', 'FOS'].indexOf(data.user_type) > -1) {
						let channel = data.channel;
						obj_rm_mapping['Channel'] = channel;
						obj_rm_mapping['agent_type'] = data.user_type;
						obj_rm_mapping['agent_name'] = (data.user_type === 'POSP') ? data['POSP']['First_Name'] + ' ' + data['POSP']['Last_Name'] : data['EMP']['Emp_Name'];
						obj_rm_mapping['agent_email'] = (data.user_type === 'POSP') ? data['POSP']['Email_Id'] : data['EMP']['Email_Id'];
						obj_rm_mapping['agent_city'] = (data.user_type === 'POSP') ? data['POSP']['Agent_City'] : data['EMP']['Branch'];
						obj_rm_mapping['current_rm_uid'] = (data.user_type === 'POSP') ? data['POSP']['Reporting_Agent_Uid'] : data['EMP']['UID'];
						obj_rm_mapping['current_rm_name'] = (data.user_type === 'POSP') ? data['POSP']['Reporting_Agent_Name'] : data['EMP']['Reporting_UID_Name'];
						obj_rm_mapping['fba_id'] = (data.user_type === 'POSP') ? data['POSP']['Fba_Id'] : data['EMP']['FBA_ID'];
						
						client.get(config.environment.weburl + '/pb_employees/list?q=' + row['rm_uid'], {}, function (data, response) {
							try {
								if (typeof data[0] !== 'undefined') {
									let new_rm_data = data[0];
									obj_rm_mapping['new_rm_name'] = new_rm_data['Employee_Name'];
									obj_rm_mapping['new_rm_mobile'] = (new_rm_data['Business_Phone_Number'].length == 10 && isNaN(new_rm_data['Business_Phone_Number']) === false) ? new_rm_data['Business_Phone_Number'] : new_rm_data['Phone'];
									obj_rm_mapping['new_rm_email'] = (new_rm_data['Official_Email'] && new_rm_data['Official_Email'].indexOf('@') > -1) ? new_rm_data['Official_Email'] : new_rm_data['Email'];
									obj_rm_mapping['new_rm_reporting_one'] = new_rm_data['Reporting_One'];
									obj_rm_mapping['new_rm_reporting_two'] = new_rm_data['Reporting_Two'];
									obj_rm_mapping['Vertical'] = new_rm_data['Vertical'];
									obj_rm_mapping['Sub_Vertical'] = new_rm_data['Sub_Vertical'];
									let objModelRm_Mapping = new Rm_Mapping(obj_rm_mapping);
									obj_data_validation['Mapping_List'].push(obj_rm_mapping);
									objModelRm_Mapping.save(function (err, objDbRm_Mapping) {
										if (err) {
											obj_status['Detail'] = obj_rm_mapping;
											obj_status['Status'] = 'RM_HISTORY_SAVE_DB_ERR';
											obj_status['Msg'] = err;
											console.error('Exception', 'Rm_Mapping_Save', obj_rm_mapping, err, objDbRm_Mapping);
											return res.json(obj_status);
										} else {
											rm_mapping_upload_handler(obj_data_validation, obj_status, res);
										}												
									});
								} else {
									obj_status['Detail'] = obj_rm_mapping;	
									obj_status['Status'] = 'VALIDATION';
									obj_status['Msg'] = 'INVALID_RM';
									return res.json(obj_status);
								}
							} catch (e) {
								obj_status['Detail'] = obj_rm_mapping;
								obj_status['Status'] = 'EXCEPTION';
								obj_status['Msg'] = e.stack;
								return res.json(obj_status);
							}
						});
					} else {
						obj_status['Detail'] = obj_rm_mapping;	
						obj_status['Status'] = 'VALIDATION';
						obj_status['Msg'] = 'INVALID_AGENT';
						return res.json(obj_status);
					}
				});
			} else {
				obj_status['Status'] = 'VALIDATION';
				obj_status['Msg'] = 'INVALID_IDS';
				return res.json(obj_status);
			}
		} catch (e) {
			obj_status['Status'] = 'EXCEPTION';
			obj_status['Msg'] = e.stack;
			return res.json(obj_status);
		}		
	});
	app.get('/posps/subvertical/list',function (req, res, next){
		Posp.distinct('SubVertical', {Is_Certified:1,SubVertical:{$nin:['IT','OPERATION','NA']}}).exec(function (err, Arr_SubVertical) {
			Arr_SubVertical = Arr_SubVertical || [];
			res.json(Arr_SubVertical.sort());
		});
	});
	app.get('/posps/hierachy/details',function (req, res, next) {
		let ss_id = req.query.hasOwnProperty('ss_id') ? req.query['ss_id'] : 0;
		let fba_id = req.query.hasOwnProperty('fba_id') ? req.query['fba_id'] : 0;
		let obj_response = {
			"MasterData" : [ 
				{
					"Designation" : "L1 - CENTRAL SUPPORT",
					"EmployeeName" : "CUSTOMER CARE",
					"EmailId" : "customercare@policyboss.com",
					"MobileNo" : "18004194199"
				}
			],
			"StatusNo" : 0,
			"Status" : "success",
			"Message" : "Success"
		};
		if (ss_id > 0 || fba_id > 0) {
			
			
			let url_api = 	config.environment.weburl + '/posps/dsas/view/' + ss_id.toString();
			if(ss_id === 0 && fba_id > 0){
				url_api = 	config.environment.weburl + '/posps/dsas/view/0?fba_id=' + fba_id.toString();
			}
			client.get(url_api, {}, function (agent_data, agent_response) {
				if(agent_data && agent_data['status'] == 'SUCCESS' && agent_data['RM']){
					let reporting_one = null;
					let reporting_two = null;
					let reporting_three = null;
					if(agent_data['user_type'] == 'EMP'){
						reporting_one = agent_data['RM']['rm_reporting_details'];
						reporting_two = agent_data['RM']['rm_reporting_two_details'];						
					}
					else{
						reporting_one = agent_data['RM']['rm_details'];
						reporting_two = agent_data['RM']['rm_reporting_details'];
						reporting_three = agent_data['RM']['rm_reporting_two_details'];						
					}
					
					if(reporting_one || reporting_two || reporting_three){
						obj_response["MasterData"] = [];
						if(reporting_one){
							obj_response["MasterData"].push({
								"Designation" : "L1 - " + reporting_one['designation'],
								"EmployeeName" : reporting_one['name'],
								"EmailId" : reporting_one['email'],
								"MobileNo" : (reporting_one['designation'].indexOf('CHIEF') === -1 && reporting_one['designation'].indexOf('DIRECTOR') === -1 && reporting_one['designation'].indexOf('PRESIDENT') === -1 ) ? reporting_one['mobile'] : 'NOT DISCLOSED'
							});
						}						
						if(reporting_two){
							obj_response["MasterData"].push({
								"Designation" : "L2 - " + reporting_two['designation'],
								"EmployeeName" : reporting_two['name'],
								"EmailId" : reporting_two['email'],
								"MobileNo" : (reporting_two['designation'].indexOf('CHIEF') === -1 && reporting_two['designation'].indexOf('DIRECTOR') === -1 && reporting_two['designation'].indexOf('PRESIDENT') === -1 ) ? reporting_two['mobile'] : 'NOT DISCLOSED'
							});
						}
						if(reporting_three){
							obj_response["MasterData"].push({
								"Designation" : "L3 - " + reporting_three['designation'],
								"EmployeeName" : reporting_three['name'],
								"EmailId" : reporting_three['email'],
								"MobileNo" : (reporting_three['designation'].indexOf('CHIEF') === -1 && reporting_three['designation'].indexOf('DIRECTOR') === -1 && reporting_three['designation'].indexOf('PRESIDENT') === -1 ) ? reporting_three['mobile'] : 'NOT DISCLOSED'
							});
						}
						

						if(obj_response["MasterData"].length < 3)
						{
							obj_response["MasterData"].push({
								"Designation" : "L"+(obj_response["MasterData"].length+1)+" - CENTRAL SUPPORT",
								"EmployeeName" : "CUSTOMER CARE",
								"EmailId" : "customercare@policyboss.com",
								"MobileNo" : "18004194199"
							});
						}	
					}

							
				}
				return res.json(obj_response);
			});
		}
		else{
			return res.json(obj_response);
		}	
	});
	app.get('/posp/iib_container/duration_summary', function (req, res) {
		let Obj_Summary = {
			"Status" : "SUCCESS",
			"FinancialYearWise" : [],
			"YearMonthwise" : [],
			"Daywise" : []
		};
		let Iib_Posp = require('../models/iib_posp');	
		Iib_Posp.aggregate([
			{$group:{
				_id : {Appointed_On : "$AppointmentDate_Format"},
				Total_Count : {$sum : 1},
				Count_With_PAN : {$sum: { $cond: {if: {$ne: ["$PAN",""]},then: 1,else: 0}}},
				Pan_List : {$addToSet: { $cond: {if: {$ne: ["$PAN",""]},then: "$PAN",else:"$$REMOVE"}}}
				}},
			{$project: {
				_id : 0,
				Appointed_On : "$_id.Appointed_On",
				Total_Count : 1,
				Count_With_PAN : 1,
				Pan_List : 1
				}},
			{$sort : {Appointed_On : -1}},
		]).exec(function(err,dbIib_Posps_Daywise){
			Obj_Summary["Daywise"] = dbIib_Posps_Daywise;
			Iib_Posp.aggregate([
				{$group:{
					_id : {Appointed_On : "$Appointment_YearMonth"},
					Total_Count : {$sum : 1},
					Count_With_PAN : {$sum: { $cond: {if: {$ne: ["$PAN",""]},then: 1,else: 0}}},
					Pan_List : {$addToSet: { $cond: {if: {$ne: ["$PAN",""]},then: "$PAN",else:"$$REMOVE"}}}
					}},
				{$project: {
					_id : 0,
					Appointed_On : "$_id.Appointed_On",
					Total_Count : 1,
					Count_With_PAN : 1,
					Pan_List : 1
					}},
				{$sort : {Appointed_On : -1}},
			]).exec(function(err,dbIib_Posps_YearMonthWise){
				Obj_Summary["YearMonthwise"] = dbIib_Posps_YearMonthWise;
				Iib_Posp.aggregate([
					{$group:{
						_id : {Appointed_On : "$Appointment_Financial_Year"},
						Total_Count : {$sum : 1},
						Count_With_PAN : {$sum: { $cond: {if: {$ne: ["$PAN",""]},then: 1,else: 0}}},
						//Posp_List : {$addToSet: { $cond: {if: {$ne: ["$PAN",""]},then: "$PAN",else:"$$REMOVE"}}}
						}},
					{$project: {
						_id : 0,
						Appointed_On : "$_id.Appointed_On",
						Total_Count : 1,
						Count_With_PAN : 1,
						//Posp_List : 1
						}},
					{$sort : {Appointed_On : -1}},
				]).exec(function(err,dbIib_Posps_FinancialYearWise){
					Obj_Summary["FinancialYearWise"] = dbIib_Posps_FinancialYearWise;	
					//find posp iib date aggregate
					Posp.aggregate([
						{$match : {
							"POSP_UploadedtoIIB": "Yes",
							"POSP_UploadingDateAtIIB":{"$nin":[null,""]},
							"POSP_DeActivatedtoIIB" : {"$ne" : 'Yes'},
							"Is_Active" : true
							}},
						{$group:{
							_id : {Appointed_On : "$POSP_UploadingDateAtIIB"},
							Total_Count : {$sum : 1},
							"ErpCode_Count" : {$sum: { $cond: {if: {$eq: ["$Is_Certified",1]},then: 1,else: 0}}},
							Pan_List : {$addToSet: "$Pan_No"}	
							}},
						{$project: {
							_id : 0,
							Appointed_On : "$_id.Appointed_On",
							Total_Count : 1,
							ErpCode_Count:1,
							"Pan_List" :1
							}},
						{$sort : {Appointed_On : -1}},
					]).exec(function(err,dbPosps_IIB){
						try{
							let obj_posp_uploaded_iib_daywise = {};
							let obj_posp_uploaded_iib_yearmonthwise = {};
							let obj_posp_uploaded_iib_financial = {};
							for(let ind of dbPosps_IIB){
								let Appointed_On_Date = moment(ind["Appointed_On"],"DD-MM-YYYY").format("YYYY-MM-DD");
								let Appointed_On_Year_Mon = moment(ind["Appointed_On"],"DD-MM-YYYY").format("YYYYMM") - 0;
								
								let Single_FinancialYearWise = GetFinancialYear(Appointed_On_Year_Mon);
								obj_posp_uploaded_iib_daywise[Appointed_On_Date] = {
									"Total_Count" : ind["Total_Count"],
									"ErpCode_Count" : ind["ErpCode_Count"],
									"Pan_List" : ind["Pan_List"] || [],
								};
								
								if(obj_posp_uploaded_iib_yearmonthwise.hasOwnProperty(Appointed_On_Year_Mon) === false){
									obj_posp_uploaded_iib_yearmonthwise[Appointed_On_Year_Mon] = {
										"Total_Count" : 0,
										"ErpCode_Count" : 0,
										"Pan_List" : ind["Pan_List"] || []
									};
								}
								obj_posp_uploaded_iib_yearmonthwise[Appointed_On_Year_Mon]["Total_Count"] += ind["Total_Count"];
								obj_posp_uploaded_iib_yearmonthwise[Appointed_On_Year_Mon]["ErpCode_Count"] += ind["ErpCode_Count"];
								
								if(obj_posp_uploaded_iib_financial.hasOwnProperty(Single_FinancialYearWise) === false){
									obj_posp_uploaded_iib_financial[Single_FinancialYearWise] = {
										"Total_Count" : 0,
										"ErpCode_Count" : 0,
										"Pan_List" : ind["Pan_List"] || []
									};
								}
								obj_posp_uploaded_iib_financial[Single_FinancialYearWise]["Total_Count"] += ind["Total_Count"];
								obj_posp_uploaded_iib_financial[Single_FinancialYearWise]["ErpCode_Count"] += ind["ErpCode_Count"];
								
							}
							//add posp date in iib data						
							for(let i in Obj_Summary["Daywise"]){
								let Appointed_On = Obj_Summary["Daywise"][i]["Appointed_On"];
								
								let posp_uploaded_count = obj_posp_uploaded_iib_daywise[Appointed_On] ? obj_posp_uploaded_iib_daywise[Appointed_On]["Total_Count"] : 0;
								Obj_Summary["Daywise"][i]["Pos_Tag_Count"] = posp_uploaded_count;								
								
								let ErpCode_Count = obj_posp_uploaded_iib_daywise[Appointed_On] ? obj_posp_uploaded_iib_daywise[Appointed_On]["ErpCode_Count"] : 0;
								Obj_Summary["Daywise"][i]["ErpCode_Count"] = ErpCode_Count;
							}
							for(let i in Obj_Summary["YearMonthwise"]){
								let Appointed_On = Obj_Summary["YearMonthwise"][i]["Appointed_On"];
								//let posp_uploaded_count = obj_posp_uploaded_iib_yearmonthwise[Appointed_On] || 0; 
								//Obj_Summary["YearMonthwise"][i]["Pos_Tag_Count"] = posp_uploaded_count;
								
								let posp_uploaded_count = obj_posp_uploaded_iib_yearmonthwise[Appointed_On] ? obj_posp_uploaded_iib_yearmonthwise[Appointed_On]["Total_Count"] : 0;
								Obj_Summary["YearMonthwise"][i]["Pos_Tag_Count"] = posp_uploaded_count;								
								
								let ErpCode_Count = obj_posp_uploaded_iib_yearmonthwise[Appointed_On] ? obj_posp_uploaded_iib_yearmonthwise[Appointed_On]["ErpCode_Count"] : 0;
								Obj_Summary["YearMonthwise"][i]["ErpCode_Count"] = ErpCode_Count;
							}
							for(let i in Obj_Summary["FinancialYearWise"]){
								let Appointed_On = Obj_Summary["FinancialYearWise"][i]["Appointed_On"];
								//let posp_uploaded_count = obj_posp_uploaded_iib_financial[Appointed_On] || 0; 
								//Obj_Summary["FinancialYearWise"][i]["Pos_Tag_Count"] = posp_uploaded_count;
								
								let posp_uploaded_count = obj_posp_uploaded_iib_financial[Appointed_On] ? obj_posp_uploaded_iib_financial[Appointed_On]["Total_Count"] : 0;
								Obj_Summary["FinancialYearWise"][i]["Pos_Tag_Count"] = posp_uploaded_count;								
								
								let ErpCode_Count = obj_posp_uploaded_iib_financial[Appointed_On] ? obj_posp_uploaded_iib_financial[Appointed_On]["ErpCode_Count"] : 0;
								Obj_Summary["FinancialYearWise"][i]["ErpCode_Count"] = ErpCode_Count;
								
							}
							return res.json(Obj_Summary);
						}
						catch(e){
							return res.send(e.stack);
						}
					});					
				});					
			});	
		});
	});
	
	app.get('/posp/create_login_session_data', function (req, res) {
        try {
            let objRequest = req.query;
            let ObjResponse = {};
            //let Client = require('node-rest-client').Client;
            //let client = new Client();
            if (objRequest.ss_id) {
                client.get('http://horizon.policyboss.com:5000/posps/dsas/view/' + objRequest.ss_id, {}, function (data, response) {
                    try {
                        if (!data) {
                            res.json({'Status': 'FAIL', 'Msg': 'DATA_NOT_FOUND', 'Data': data});
                        } else {
                            if (data.status !== "SUCCESS") {
                                res.json({'Status': 'FAIL', 'Msg': 'DATA_SUCCESS_NOT_FOUND', 'Data': data});
                            } else {
                                var role_detail = {};
                                if (data['status'] === 'SUCCESS' && data.hasOwnProperty('user_type')) {
                                    var Const_POSP_Code = {
                                        "1": "DC",
                                        "2": "SM",
                                        "4": "SG",
                                        "8": "GS",
                                        "11": "EM",
                                        "12": "LA",
                                        "13": "CC-AUTO",
                                        "14": "CC-HEALTH",
                                        "15": "SM-NP",
                                        "16": "GS-NP",
                                        "17": "DC-NP",
                                        "18": "EM-NP",
                                        "19": "OPS-NP",
                                        "20": "RURBAN",
                                        "21": "RURBAN-NP",
                                        "22": "REMOTE",
                                        "23": "REMOTE-NP"
                                    };
                                    var Const_FOS_Code = {
                                        29: 'SM',
                                        34: 'GS',
                                        38: "SG",
                                        39: 'DC',
                                        41: 'EM',
                                        43: 'LA',
                                        51: 'RURBAN',
                                        56: "REMOTE"
                                    };
                                    data.Sources = 0;
                                    if (data['user_type'] === 'POSP') {
                                        let dbPosp = data['POSP'];
                                        data.Sources = dbPosp['Sources'] || 0;
                                        dbPosp['Sources'] = dbPosp['Sources'] - 0;
                                        let channel = Const_POSP_Code[dbPosp['Sources']];
                                        role_detail = {
                                            'channel': 'POSP',
                                            'ownership': channel,
                                            'title': channel + '-POSP',
                                            'role': ['Agent']
                                        };
                                        data.EmailID = dbPosp.Email_Id;
                                        data.MobiNumb1 = dbPosp.Mobile_No;
                                        data.Fullname = dbPosp.First_Name + ' ' + (dbPosp.Middle_Name || '') + ' ' + dbPosp.Last_Name;
                                        data.RoleId = data['EMP']['Role_ID'];
                                        data.FBAId = dbPosp.Fba_Id;
                                        data.EmpCode = dbPosp.Erp_Id;
                                    }
                                    if (data['user_type'] === 'FOS') {
                                        let dbEmployee = data['EMP'];
                                        let Role_ID = dbEmployee['Role_ID'] - 0;
                                        let channel = Const_FOS_Code[Role_ID];
                                        role_detail = {
                                            'channel': 'FOS',
                                            'ownership': channel,
                                            'title': channel + '-FOS',
                                            'role': ['Agent']
                                        };
                                    }
                                    if (data['user_type'] === 'MISP') {
                                        let dbEmployee = data['EMP'];
                                        let Role_ID = dbEmployee['Role_ID'] - 0;
                                        role_detail = {
                                            'channel': 'MISP',
                                            'ownership': 'MISP',
                                            'title': 'MISP',
                                            'role': ['Agent']
                                        };
                                    }
                                    if (data['user_type'] === 'INS') {
                                        let dbEmployee = data['EMP'];
                                        let Role_ID = dbEmployee['Role_ID'] - 0;
                                        let Insurer_Id = (dbEmployee['Emp_Code'] - 0) - 9000000;
                                        role_detail = {
                                            'channel': 'INS',
                                            'ownership': 'INS',
                                            'title': 'INSURER REPRESENTATIVE',
                                            'role': ['Insurer'],
                                            'insurer': Insurer_Id
                                        };
                                    }
                                    if (data['user_type'] === 'EMP') {
                                        if (data['EMP']['Role_ID'] === 23) {
                                            role_detail = {
                                                'channel': 'CallCenter',
                                                'ownership': 'ST',
                                                'title': 'PB-CC',
                                                'role': ['Employee']
                                            };
                                        }
                                        if (data['EMP']['Role_ID'] === 30) {
                                            role_detail = {
                                                'channel': 'CallCenter',
                                                'ownership': 'ST',
                                                'title': 'RB-CC',
                                                'role': ['Employee']
                                            };
                                        }
                                    }
                                    role_detail['allowed_product'] = ['ALL'];
                                    role_detail['allowed_make'] = ['ALL'];
                                    /*if (config.dealership.BENELLI.indexOf(data['EMP']['Emp_Id'] - 0) > -1 || config.dealership.TRIUMPH.indexOf(data['EMP']['Emp_Id'] - 0) > -1) {
                                        role_detail['allowed_product'] = ['TW'];
                                        role_detail['allowed_make'] = [];
                                        if (config.dealership.BENELLI.indexOf(data['EMP']['Emp_Id'] - 0) > -1) {
                                            role_detail['allowed_make'].push('BENELLI');
                                        }
                                        if (config.dealership.TRIUMPH.indexOf(data['EMP']['Emp_Id'] - 0) > -1) {
                                            role_detail['allowed_make'].push('TRIUMPH');
                                        }
                                    }*/
                                    if (data['EMP']['Emp_Id'] - 0 == 127818)
                                    {
                                        role_detail['allowed_make'] = [];
                                        role_detail['allowed_make'].push('VOLKSWAGEN');
                                    }
                                }

                                if (Object.keys(role_detail).length === 0) {
                                    let today = new Date();
                                    var obj_error_log = {
                                        'TYPE': 'LOGIN_ERR',
                                        'MSG': 'ROLE_NOT_CONFIGURE',
                                        'RM_DETAILS': {},
                                        'LOGIN_RESP': data,
                                        'HRZ_RESP': data
                                    };
                                    let log_file_name = 'login_error_log_' + today.toISOString().substring(0, 10).toString().replace(/-/g, '') + ".log";
                                    fs.appendFile(config.environment.horizon_app_path + "tmp/log/" + log_file_name, JSON.stringify(obj_error_log), function (err) {
                                        if (err) {
                                            //return //console.log(err);
                                        }
                                    });
                                    let obj_email = {
                                        'from': 'noreply@policyboss.com',
                                        'to': 'pramod.parit@policyboss.com,vikas.nerkar@policyboss.com,piyush.singh@policyboss.com',
                                        'cc': 'horizonlive.2019@gmail.com',
                                        'sub': '[LOGIN_ERR] fba_id : ' + data['EMP']['FBA_ID'] + ', ss_id : ' + data['EMP']['Emp_Id'] + ', Err_On : ' + (new Date()).toLocaleString(),
                                        'content': '<html><body><h1>LOGIN ERROR</h1><BR><pre>' + JSON.stringify(obj_error_log, undefined, 2) + '</pre></body></html>'
                                    };
                                    send_email(obj_email);
                                    res.json({'Status': 'FAIL', 'Msg': 'LOGIN ERROR', 'Data': obj_error_log});
                                }
                                if (data['user_type'] === 'EMP') {
                                    var channel = 'NA';
                                    data.EmpCode = (data['EMP'].hasOwnProperty('Emp_Code') && data['EMP'].Emp_Code !== null) ? data['EMP'].Emp_Code : '000000';
                                    if (['100151', '107124', '112666', '105248', '100015', '113907', '113265', '114143'].indexOf(data.EmpCode.toString()) > -1) {
                                        var arrChannelList = [];
                                        if (data.EmpCode == '100151') {//sm
                                            channel = 'SM';
                                            arrChannelList.push('SM-NP');
                                        }
                                        if (data.EmpCode == '107124') {//dc
                                            channel = 'DC';
                                            arrChannelList.push('LA');
                                            arrChannelList.push('DC-NP');
                                        }
                                        if (data.EmpCode == '114143') {//la snehal
                                            channel = 'LA';
                                        }
                                        if (data.EmpCode == '113907' || data.EmpCode == '113265') {//achint
                                            channel = 'EM';
                                            arrChannelList.push('EM-NP');
                                        }
                                        if (data.EmpCode == '100015') {//sg
                                            channel = 'SG';
                                        }
                                        if (data.EmpCode == '112666' || data.EmpCode == '105248') {//gs
                                            channel = 'GS';
                                            arrChannelList.push('GS-NP');
                                        }

                                        if (channel !== 'NA') {
                                            arrChannelList.push(channel);
                                        }
                                        role_detail.role.push('ChannelHead');
                                        role_detail.channel = channel;
                                        role_detail.title = 'ChannelHead';
                                    }
                                    var ArrSuperAdmin = [107602, 100002, 100005, 100336, 104449, 112739, 110560, 103759, 103595];
                                    if (ArrSuperAdmin.indexOf(data.EmpCode - 0) > -1) {
                                        role_detail.role.push('SuperAdmin');
                                        role_detail.channel = 'ALL';
                                        role_detail.title = 'SuperAdmin';
                                    }
                                    var ArrCustomerCare = [102571, 100004];
                                    if (ArrCustomerCare.indexOf(data.EmpCode - 0) > -1) {
                                        role_detail.role.push('SuperAdmin');
                                        role_detail.role.push('CustomerCare');
                                        role_detail.channel = 'ALL';
                                        role_detail.title = 'SuperAdmin';
                                    }
                                    var ArrErpTeam = [105580];
                                    if (ArrErpTeam.indexOf(data.EmpCode - 0) > -1) {
                                        role_detail.role.push('SuperAdmin');
                                        role_detail.role.push('ErpTeam');
                                        role_detail.channel = 'ALL';
                                        role_detail.title = 'ErpTeam';
                                    }
                                    var ArrProductAdmin = [111598];
                                    if (ArrProductAdmin.indexOf(data.EmpCode - 0) > -1) {
                                        role_detail.role.push('SuperAdmin');
                                        role_detail.role.push('ProductAdmin');
                                        role_detail.channel = 'ALL';
                                        role_detail.product = [2, 17, 4, 3];
                                        role_detail.title = 'SuperAdmin';
                                    }
                                    var ArrITAdmin = [107602, 104449, 104450];
                                    if (ArrITAdmin.indexOf(data.EmpCode - 0) > -1) {
                                        role_detail.role.push('Developer');
                                        role_detail.channel = 'ALL';
                                        role_detail.title = 'SuperAdmin';
                                    }
                                    var ArrRecruiter = [110196, 100427]; //sandeep and kiran
                                    if (ArrRecruiter.indexOf(data.EmpCode - 0) > -1) {
                                        role_detail.role.push('Recruiter');
                                        role_detail.channel = 'ALL';
                                        role_detail.title = 'Recruiter';
                                    }
                                }
                                var web_session_data = {
                                    "session_id": req.sessionID,
                                    "agent_name": data['EMP']['Emp_Name'],
                                    "agent_city": 'NA',
                                    "fba_id": data['EMP']['FBA_ID'] - 0,
                                    "sub_fba_id": 0,
                                    "agent_source": "",
                                    "AgentClientFBAID": data['EMP']['Emp_Id'] - 0 + "," + "0" + "," + data['EMP']['FBA_ID'] - 0,
                                    "agent_email": data['EMP']['Email_Id'],
                                    "agent_mobile": data['EMP']['Mobile_Number'],
                                    "UID": data.EmpCode,
                                    "Is_Employee": (data['EMP']['Role_ID'] === 23 ? 'Y' : 'N'),
                                    'User_Type': data['user_type'],
                                    "Is_Posp_Certified": (data['user_type'] === 'POSP' && data['POSP']['Erp_Id'] && data['POSP']['Erp_Id'].length == 6) ? 'Y' : 'N',
                                    "client_id": "",
                                    "agent_id": data['EMP']['Emp_Id'] - 0,
                                    'agent_rm_name': 'NA',
                                    'role_detail': role_detail
                                };
                                var obj_session = {
                                    'session_id': req.sessionID,
                                    'email': data['EMP']['Email_Id'],
                                    'mobile': data['EMP']['Mobile_Number'],
                                    'fullname': data['EMP']['Emp_Name'],
                                    'role_id': data['EMP']['Role_ID'],
                                    'role_detail': role_detail,
                                    'ss_id': data['EMP']['Emp_Id'] - 0,
                                    'fba_id': data['EMP']['FBA_ID'] - 0,
                                    'erp_id': data['EMP']['Emp_Code'] - 0,
                                    'sub_fba_id': 0,
                                    'uid': data.EmpCode,
                                    'website_session': web_session_data,
                                    'direct': {
                                        'cnt_posp': 0,
                                        'cnt_dsa': 0,
                                        'cnt_cse': 0},
                                    'team': {
                                        'cnt_posp': 0,
                                        'cnt_dsa': 0,
                                        'cnt_cse': 0},
                                    'profile': {
                                        'Designation': role_detail.title
                                    },
                                    "POSP": {
                                        "Paid_On": data["POSP"]["Paid_On"] || '',
                                        "Is_Paid": data["POSP"]["Is_Paid"] || '',
                                        "Is_Certified": data["POSP"]["Is_Certified"] || '',
                                        "Certified_On": data["POSP"]["ERPID_CreatedDate"] || ''
                                    },
                                    'SYNC_CONTACT': data['SYNC_CONTACT'] || {},
                                    'DEVICE': data['DEVICE'] || {},
                                    'SYNC_CONTACT_LEAD_PURCHASE': data['SYNC_CONTACT_LEAD_PURCHASE'] || {},
                                    'INSURANCE': data['INSURANCE'] || {}
                                };
                                ObjResponse.login_response = data;
                                ObjResponse.user = obj_session;
                                if (data['user_type'] !== 'EMP') {
                                    res.json({'Status': 'SUCCESS', 'Msg': 'LOGIN SUCCESS', 'Data': ObjResponse});
                                } else {
                                    var Client = require('node-rest-client').Client;
                                    var client = new Client();
                                    var args = {
                                        data: {
                                            "ss_id": data['EMP']['Emp_Id'],
                                            "fba_id": data['EMP']['FBA_ID'],
                                            'login_response': data
                                        },
                                        headers: {
                                            "Content-Type": "application/json"
                                        }
                                    };
                                    client.get('http://horizon.policyboss.com:5000/posps/rm_get_posp_dsa_ssid/' + data.EmpCode, args, function (rmdetails, response) {
                                        try {
                                            if (rmdetails && rmdetails.hasOwnProperty('Profile')) {
                                                //req.session.users_assigned = rmdetails;
                                                if (rmdetails.Team.POSP.length > 0) {
                                                    obj_session.team.cnt_posp = rmdetails.Team.POSP.length;
                                                }
                                                if (rmdetails.Team.DSA.length > 0) {
                                                    obj_session.team.cnt_dsa = rmdetails.Team.DSA.length;
                                                }
                                                if (rmdetails.Team.CSE.length > 0) {
                                                    obj_session.team.cnt_cse = rmdetails.Team.CSE.length;
                                                }

                                                if (rmdetails.Direct.POSP.length > 0) {
                                                    obj_session.direct.cnt_posp = rmdetails.Direct.POSP.length;
                                                }
                                                if (rmdetails.Direct.DSA.length > 0) {
                                                    obj_session.direct.cnt_dsa = rmdetails.Direct.DSA.length;
                                                }
                                                if (rmdetails.Direct.CSE.length > 0) {
                                                    obj_session.direct.cnt_cse = rmdetails.Direct.CSE.length;
                                                }
                                                ObjResponse.login_response = data;
                                                ObjResponse.user = obj_session;
                                                ObjResponse.user.profile = rmdetails.Profile;
                                            }
                                            res.json({'Status': 'SUCCESS', 'Msg': 'LOGIN SUCCESS', 'Data': ObjResponse});
                                        } catch (e) {
                                            let today = new Date();
                                            var obj_error_log = {
                                                'TYPE': 'RM_ERR',
                                                'MSG': e.stack,
                                                'RM_DETAILS': rmdetails,
                                                'LOGIN_RESP': data
                                            };
                                            let log_file_name = 'login_error_log_' + today.toISOString().substring(0, 10).toString().replace(/-/g, '') + ".log";
                                            fs.appendFile(config.environment.horizon_app_path + "tmp/log/" + log_file_name, JSON.stringify(obj_error_log), function (err) {
                                                if (err) {

                                                }
                                            });
                                            res.json({'Status': 'FAIL', 'Msg': 'LOGIN ERROR', 'Data': obj_error_log});
                                        }
                                    });
                                }
                            }
                        }
                    } catch (e) {
                        let today = new Date();
                        var obj_error_log = {
                            'TYPE': 'LOGIN_ERR',
                            'MSG': e.stack,
                            'RM_DETAILS': {},
                            'LOGIN_RESP': data
                        };
                        let log_file_name = 'login_error_log_' + today.toISOString().substring(0, 10).toString().replace(/-/g, '') + ".log";
                        fs.appendFile(config.environment.horizon_app_path + "tmp/log/" + log_file_name, JSON.stringify(obj_error_log), function (err) {
                            if (err) {
                                //return //console.log(err);
                            }
                        });
                        res.json({'Status': 'FAIL', 'Msg': 'LOGIN ERROR', 'Data': obj_error_log});
                    }
                });
            } else {
                let today = new Date();
                var obj_error_log = {
                    'TYPE': 'SS_ID IS MANDATORY',
                    'MSG': objRequest
                };
                let log_file_name = 'login_error_log_' + today.toISOString().substring(0, 10).toString().replace(/-/g, '') + ".log";
                fs.appendFile(config.environment.horizon_app_path + "tmp/log/" + log_file_name, JSON.stringify(obj_error_log), function (err) {
                    if (err) {
                        //return //console.log(err);
                    }
                });
                res.json({'Status': 'FAIL', 'Msg': 'LOGIN ERROR', 'Data': obj_error_log});
            }
        } catch (e) {
            let today = new Date();
            var obj_error_log = {
                'TYPE': 'MAIN_ERR',
                'MSG': e.stack,
                'LOGIN_REQ': objRequest
            };
            let log_file_name = 'login_error_log_' + today.toISOString().substring(0, 10).toString().replace(/-/g, '') + ".log";
            fs.appendFile(config.environment.horizon_app_path + "tmp/log/" + log_file_name, JSON.stringify(obj_error_log), function (err) {
                if (err) {
                    //return //console.log(err);
                }
            });
            res.json({'Status': 'FAIL', 'Msg': 'LOGIN ERROR', 'Data': obj_error_log});
        }
    });
	app.post('/posp/posp_users', LoadSession, function (req, res) {
        try {
            var objBase = new Base();
            var obj_pagination = objBase.jqdt_paginate_process(req.body);
            var optionPaginate = {
                select: '',
                sort: {'Modified_On': 'desc'},
                lean: true,
                page: 1,
                limit: 10
            };
            if (obj_pagination) {
                optionPaginate['page'] = obj_pagination.paginate.page;
                optionPaginate['limit'] = parseInt(obj_pagination.paginate.limit);
            }
            var filter = obj_pagination.filter;
            console.error('PospUsersFilter', req.body);
            if (req && req.body && req.body['search'] && req.body['search']['value'] !== '') {
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
                //filter = {'Is_Active': true ,'IsFOS' :{$ne:true}};
                filter = {'Is_Active': true};
                if ((req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1) || ([7973, 7644, 17026].indexOf(req.obj_session.user.ss_id) > -1)) {//added Ronald and Sandeep ssid  to show all data

                } else if (req.obj_session.user.role_detail.role.indexOf('ChannelHead') > -1) {
                    let obj_posp_channel_to_source = swap(config.channel.Const_POSP_Channel);
                    var arr_source = [];
                    for (var x of req.obj_session.user.role_detail.channel_agent) {
arr_source.push(obj_posp_channel_to_source[x]);
                    }
                    filter['Sources'] = {$in: arr_source};
                } else {
                    filter['Ss_Id'] = {$in: req.obj_session.users_assigned.Team.POSP};
                }


                if (req && req.body && req.body['Col_Name'] && typeof req.body['Col_Name'] == 'string' && req.body['Col_Name'] !== '' && req.body['txtCol_Val'] !== '') {
                    if (req.body['Col_Name'] === 'Ss_Id' || req.body['Col_Name'] === 'Reporting_Agent_Uid') {
                        filter[req.body['Col_Name']] = req.body['txtCol_Val'] - 0;
                    } else if (req.body['Col_Name'] === 'First_Name' || req.body['Col_Name'] === 'Email_Id') {
                        filter[req.body['Col_Name']] = new RegExp(req.body['txtCol_Val'], 'i');
                    } else if (req.body['Col_Name'] === 'Reporting_Agent_Name') {
                        filter[req.body['Col_Name']] = new RegExp(req.body['txtCol_Val'], 'i');
                    } else {
                        filter[req.body['Col_Name']] = req.body['txtCol_Val'];
                    }
                }
                /*
                if (req && req.body && req.body['Last_Status_Group'] && req.body['Last_Status_Group'] !== '') {
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
arr_last_status.push(objStatusSummary[req.body['Last_Status_Group']][k].toString());
                        }
                        filter['Last_Status'] = {$in: arr_last_status};
                    }
                }
                */
                if (req && req.body && req.body['Last_Status'] && req.body['Last_Status'] !== '') {
                    let value = req.body['Last_Status'].toString();
                    switch (value) {
                        case '5':
                            filter['Is_Doc_Verified'] = 'Yes';
                            filter['Is_Active'] = true;
                            break;
                        case '4':
                            filter['Is_Document_Uploaded'] = 'Yes';
                            filter['Is_Active'] = true;
                            break;
                        case '6':
                            filter['Is_Document_Rejected'] = 'Yes';
                            filter['Is_Active'] = true;
                            break;
                        case '99':
                            filter['Is_Doc_Approved'] = 'Yes';
                            filter['Is_Active'] = true;
                            break;
                        case '100':
                            filter['Is_Doc_Approved'] = 'Yes';
                            filter['Is_Active'] = true;
                            break;
                        case 'Document_Verification_Pending': //'101':
                            filter['Is_Document_Uploaded'] = 'Yes';
                            filter['Is_Doc_Verified'] = 'No';
                            filter['Is_Document_Rejected'] = 'No';
							filter['Is_Doc_Approved'] = 'No';
                            filter['Is_Active'] = true;
                            break;
                        case 'Document_Approval_Pending': //'102':
						    filter['Is_Document_Uploaded'] = 'Yes';
                            filter['Is_Doc_Verified'] = 'Yes';
                            filter['Is_IIB_Uploaded'] = 'No';
                            filter['Is_Doc_Approved'] = 'No';
                            filter['Is_Active'] = true;
                            break;
                        case 'IIB_Upload_Pending': //'103':
							filter['Is_Doc_Verified'] = 'Yes';
						    filter['Is_Doc_Approved'] = 'Yes';
                            filter['Is_IIB_Uploaded'] = 'No';
							//filter['Exam_Status'] = '';
                            filter['POSP_UploadingDateAtIIB'] = {$in: ['', null]};
                            filter['Erp_Id'] = '';
                            filter['Is_Active'] = true;
                            break;
						case 'Approval_or_Verification_Rejected':
                            filter['Is_Doc_Verified'] = 'No';
                            filter['Is_Doc_Approved'] = 'No';
							filter['Is_Document_Rejected'] = 'Yes';							
                            filter['Is_Active'] = true;
                            break;	
						case 'Verification_Rejected':
                            filter['Is_Doc_Verified'] = 'No';
                            filter['Is_Doc_Verification_Rejected'] = 'Yes';
							filter['Is_Active'] = true;
                            break;	
						case 'Approval_Rejected':
                            filter['Is_Doc_Verified'] = 'Yes';
                            filter['Is_Doc_Approved'] = 'No';
							filter['Is_Doc_Approval_Rejected'] = 'Yes';							
                            filter['Is_Active'] = true;
                            break;		
                        case 'Exam_Pending':
							filter['Is_Doc_Verified'] = 'Yes';
						    filter['Is_Doc_Approved'] = 'Yes';
                            filter['Is_IIB_Uploaded'] = 'Yes';
                            filter['Exam_Status'] = { "$ne":'Completed' };
							filter['Erp_Id'] = {"$in": ['', null, 0]};
                            filter['Is_Active'] = true;
                            break;
                        case 'ERP_Code_Pending':
							filter['Is_Doc_Verified'] = 'Yes';
						    filter['Is_Doc_Approved'] = 'Yes';
                            filter['Is_IIB_Uploaded'] = 'Yes';
                            filter['Exam_Status'] = 'Completed';
                            filter['Erp_Id'] = {"$in": ['', null, 0]};
							filter['Erp_Status'] = {"$ne":'SUCCESS'};
                            filter['Is_Active'] = true;
                            break;
                        case 'ERP_Code_Complete':
                            filter['Erp_Id'] = {"$exists": true, "$nin": ["", null]};
                            filter['Is_Active'] = true;
                            break;
						case 'NOC_Given':
                            filter['POSP_DeActivatedtoIIB'] = "Yes";
                            break;	
                    }
                }
                if (req && req.body && req.body['DateRange_Type'] && typeof req.body['DateRange_Type'] !== "undefined" && req.body['DateRange_Type'] !== '' && req.body['transaction_start_date'] !== '' && req.body['transaction_end_date'] !== '') {
                    var arrFrom = req.body['transaction_start_date'].split('-');
                    var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);
                    var arrTo = req.body['transaction_end_date'].split('-');
                    var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
                    dateTo.setDate(dateTo.getDate() + 1);
                    filter[req.body['DateRange_Type']] = {"$gte": dateFrom, "$lte": dateTo};
                }
                if (req && req.body && req.body['Col_Is_Contact_Sync'] && req.body['Col_Is_Contact_Sync'] !== '') {
                    filter['Is_Contact_Sync'] = (req.body['Col_Is_Contact_Sync'] === 'yes') ? 1 : 0;
                }
//            if (req.body['Col_Is_Paid'] && req.body['Col_Is_Paid'] !== '') {
//                filter['Is_Paid'] = (req.body['Col_Is_Paid'] === 'yes') ? 1 : 0;
//            }
            }
            console.error('/posp/posp_users',filter);
            posp_user.paginate(filter, optionPaginate).then(function (dbposp_users) {
                //console.log(obj_pagination.filter, optionPaginate, posps);
				dbposp_users["filter"] = filter;
                res.json(dbposp_users);
            });
        } catch (e) {
            console.error('Exception', '/posp/posp_users', e.stack);
            res.json({'Status':'Error','Msg':e.stack});
        }
    });  
        app.get('/posp/pospuser_dashboard', function (req, res) { //piyush
        try {
            let posp_user = require("../models/posp_users");
            var today = moment().utcOffset("+05:30").startOf('Day');
            var fromDate = moment(today).format("YYYY-MM-DD");
            var toDate = moment(today).format("YYYY-MM-DD");

            var response_json = {
                "TODAY": {
                    "TOTAL": 0,
                    "UPLOADED": 0,
                    "REJECTED": 0,
                    "VERIFIED": 0,
                    "APPROVED": 0,
                    "APPROVAL_PENDING": 0,
                    "VERIFICATION_PENDING": 0,
                    "IIB_UPLOADED": 0,
                    "IIB_UPLOAD_PENDING": 0
                },
                "Last_7_Days": {
                    "TOTAL": 0,
                    "UPLOADED": 0,
                    "REJECTED": 0,
                    "VERIFIED": 0,
                    "APPROVED": 0,
                    "APPROVAL_PENDING": 0,
                    "VERIFICATION_PENDING": 0,
                    "IIB_UPLOADED": 0,
                    "IIB_UPLOAD_PENDING": 0
                }

            };
            var arrFrom = fromDate.split('-');
            var dateFrom = new Date(arrFrom[0] - 0, arrFrom[1] - 0 - 1, arrFrom[2] - 0);
            dateFrom.setDate(dateFrom.getDate() - 7);

            var arrTo = toDate.split('-');
            var dateTo = new Date(arrTo[0] - 0, arrTo[1] - 0 - 1, arrTo[2] - 0);
            dateTo.setDate(dateTo.getDate() + 1);
            posp_user.find({"Created_On": {$gte: dateFrom, $lt: dateTo}}, function (err, res_val1) {
                try {
                    if (err) {
                        res.json({"Status": "Fail", "Msg": err});
                    } else {
                        for (var i in res_val1) {
                            if (res_val1[i]['_doc']['Is_Document_Uploaded'] === "Yes") {
                                response_json['Last_7_Days']['UPLOADED']++;
                                if (moment(res_val1[i]['_doc']['Created_On'], "YYYY-MM-DD HH:MM:SS.000Z").format("DD-MM-YYYY") === moment(today).format("DD-MM-YYYY")) {
                                    response_json['TODAY']['UPLOADED']++;
                                }
                            }
                            if (res_val1[i]['_doc']['Is_Document_Rejected'] === "Yes") {
                                response_json['Last_7_Days']['REJECTED']++;
                                if (moment(res_val1[i]['_doc']['Created_On'], "YYYY-MM-DD HH:MM:SS.000Z").format("DD-MM-YYYY") === moment(today).format("DD-MM-YYYY")) {
                                    response_json['TODAY']['REJECTED']++;
                                }
                            }
                            if (res_val1[i]['_doc']['Is_Doc_Verified'] === "Yes") {
                                response_json['Last_7_Days']['VERIFIED']++;
                                if (moment(res_val1[i]['_doc']['Created_On'], "YYYY-MM-DD HH:MM:SS.000Z").format("DD-MM-YYYY") === moment(today).format("DD-MM-YYYY")) {
                                    response_json['TODAY']['VERIFIED']++;
                                }
                            }
                            if (res_val1[i]['_doc']['Is_Doc_Approved'] === "Yes") {
                                response_json['Last_7_Days']['APPROVED']++;
                                if (moment(res_val1[i]['_doc']['Created_On'], "YYYY-MM-DD HH:MM:SS.000Z").format("DD-MM-YYYY") === moment(today).format("DD-MM-YYYY")) {
                                    response_json['TODAY']['APPROVED']++;
                                }
                            }
                            //Approval Pending
                            if (res_val1[i]['_doc']['Is_Document_Uploaded'] === "Yes" && res_val1[i]['_doc']['Is_Doc_Verified'] === "Yes" && res_val1[i]['_doc']['Is_IIB_Uploaded'] === "No" && res_val1[i]['_doc']['Is_Doc_Approved'] === "No") {
                                response_json['Last_7_Days']['APPROVAL_PENDING']++;
                                if (moment(res_val1[i]['_doc']['Created_On'], "YYYY-MM-DD HH:MM:SS.000Z").format("DD-MM-YYYY") === moment(today).format("DD-MM-YYYY")) {
                                    response_json['TODAY']['APPROVAL_PENDING']++;
                                }
                            }
                            //Verification Pending
                            if (res_val1[i]['_doc']['Is_Document_Uploaded'] === "Yes" && res_val1[i]['_doc']['Is_Doc_Verified'] === "No") {
                                response_json['Last_7_Days']['VERIFICATION_PENDING']++;
                                if (moment(res_val1[i]['_doc']['Created_On'], "YYYY-MM-DD HH:MM:SS.000Z").format("DD-MM-YYYY") === moment(today).format("DD-MM-YYYY")) {
                                    response_json['TODAY']['VERIFICATION_PENDING']++;
                                }
                            }
                            //IIB Uploaded
                            if (res_val1[i]['_doc']['Is_Document_Uploaded'] === "Yes" && res_val1[i]['_doc']['Is_Doc_Verified'] === "Yes" && res_val1[i]['_doc']['Is_Document_Rejected'] === "No" && res_val1[i]['_doc']['Is_Doc_Approved'] === "Yes" && res_val1[i]['_doc']['Is_IIB_Uploaded'] === "Yes") {
                                response_json['Last_7_Days']['IIB_UPLOADED']++;
                                if (moment(res_val1[i]['_doc']['Created_On'], "YYYY-MM-DD HH:MM:SS.000Z").format("DD-MM-YYYY") === moment(today).format("DD-MM-YYYY")) {
                                    response_json['TODAY']['IIB_UPLOADED']++;
                                }
                            }
                            //IIB Uploaded Pending
                            if (res_val1[i]['_doc']['Is_Document_Uploaded'] === "Yes" && res_val1[i]['_doc']['Is_Doc_Verified'] === "Yes" && res_val1[i]['_doc']['Is_Document_Rejected'] === "No" && res_val1[i]['_doc']['Is_Doc_Approved'] === "No" && res_val1[i]['_doc']['Is_IIB_Uploaded'] === "No") {
                                response_json['Last_7_Days']['IIB_UPLOAD_PENDING']++;
                                if (moment(res_val1[i]['_doc']['Created_On'], "YYYY-MM-DD HH:MM:SS.000Z").format("DD-MM-YYYY") === moment(today).format("DD-MM-YYYY")) {
                                    response_json['TODAY']['IIB_UPLOAD_PENDING']++;
                                }
                            }
                            if (moment(res_val1[i]['_doc']['Created_On'], "YYYY-MM-DD HH:MM:SS.000Z").format("DD-MM-YYYY") === moment(today).format("DD-MM-YYYY")) {
                                response_json['TODAY']['TOTAL']++;
                            }
                            response_json['Last_7_Days']['TOTAL']++;
                        }
                        res.json({"Status": "SUCCESS", "Msg": response_json});
                    }
                } catch (e) {
                    console.error('Exception', '/posp/pospuser_dashboard', e.stack);
                    res.json({"Status": "Fail", "Msg": e.stack});
                }

            });
        } catch (e) {
            console.error('Exception', '/posp/pospuser_dashboard', e.stack);
            res.json({"Status": "Fail", "Msg": e.stack});
        }
    });
	    app.post('/posps/get_posps_pan_details', function (req, res) {
        try {
            req.body = JSON.parse(JSON.stringify(req.body));
            let objRequest = req.body;
            if (objRequest.Pan_No) {
                let PanPattern = new RegExp('^[a-zA-Z]{3}[P]{1}[a-zA-Z]{1}[0-9]{4}[a-zA-Z]{1}$');
                if (!PanPattern.test(objRequest.Pan_No)) {
                    res.send({"Status": "FAIL", "Msg": "Enter Valid Pan Number"});
                } else {
                    let MongoClient = require('mongodb').MongoClient;
                    MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (dberr, db) {
                        if (dberr) {
                            res.send({"Status": "FAIL", "Msg": "DATABASE CONNECTION FAIL", "Data": dberr});
                        } else {
                            let Posps = db.collection('posps');
//                            Posps.find({"Pan_No": objRequest.Pan_No}, function (posp_data_err, posp_data) {
                            Posps.find({"Pan_No": objRequest.Pan_No}, {_id: 0}).toArray(function (posp_data_err, posp_data) {
                                if (posp_data_err) {
                                    res.send({"Status": "FAIL", "Msg": "NO RECORD FOUND"});
                                } else {
                                    let objPOSP_Response = posp_data[0];
									if (objPOSP_Response) {
                                    let objPOSPDetails = {
                                        "Ss_Id": objPOSP_Response.Ss_Id ? (objPOSP_Response.Ss_Id - 0) : 0,
                                        "Fba_Id": objPOSP_Response.Fba_Id ? (objPOSP_Response.Fba_Id - 0) :0,
                                        "Erp_Id": objPOSP_Response.Erp_Id ? (objPOSP_Response.Erp_Id - 0) : 0
                                    };
                                    res.send({"Status": "SUCCESS", "Msg": objPOSPDetails});
									} else {
										res.send({"Status": "FAIL", "Msg": "NO RECORD FOUND"});
									}
                                }
                            });
                        }
                    });
                }
            } else {
                let msg = "Pan_No IS MANDATORY";
                res.send({"Status": "FAIL", "Msg": msg});
            }
        } catch (e) {
            res.send({"Status": "FAIL", "Msg": e.stack});
        }
    }); 
    app.get("/posp_payment_report", function (req, res) {
        try {
            let excel = require('excel4node');
            let posp_args = {};
            let posp_records = [];
            let CGST = 76.14;
            let IGST = CGST + CGST;
            let GST = 18;
            let date = moment().add(-1, 'days').format("DD-MM-YYYY");
            let currentDate = new Date();
            let monthName = currentDate.toLocaleString('en-US', {month: 'long'});
            let fromDate = new Date(moment().add(-1, 'days').format("YYYY-MM-DDT00:00:00.000[Z]"));
            let toDate = new Date(moment().add(-1, 'days').format("YYYY-MM-DDT23:59:59[Z]"));
            let payment_args = {
                "Source": "POSP_ONBOARD",
                "Transaction_Status": "Success"
            };
            payment_args['Created_On'] = {
                $gt: fromDate,
                $lte: toDate
            };
            console.error('Payment Args : ', payment_args);
            let razorpay_data = {};
            let Address = present_add1 = present_add2 = present_add3 = present_City = present_state = present_Pincode = "";
            let razorpay_payment = require('../models/razorpay_payment');
            let posp_user = require('../models/posp_users.js');
            razorpay_payment.find(payment_args, function (razorpay_err, razorpay_res) {
                if (razorpay_err) {
                    res.json({"Status": "FAIL", "Msg": razorpay_err});
                } else {
                    let pospListArrSsId = [];
                    for (let i = 0; i < razorpay_res.length; i++) {
                        let ssId = razorpay_res[i]._doc['Ss_Id'];
                        if (!pospListArrSsId.includes(ssId) && ssId) {
                            razorpay_data[ssId] = razorpay_res[i]._doc['Created_On'];
                            pospListArrSsId.push(ssId);
                        }
                    }
                    console.error('Razorpay Data - ', razorpay_data);
                    posp_args = {
                        "Ss_Id": {'$in': pospListArrSsId},
                        "Is_Active": true
                    };
                    posp_user.find(posp_args, function (posp_user_err, posp_user_res) {
                        if (posp_user_err) {
                            res.json({"Status": "FAIL", "Msg": posp_user_err});
                        } else {
                            if (posp_user_res.length > 0) {
                                posp_user_res.forEach((currentData) => {
                                    let posp_data = currentData._doc;
                                    let name_on_pan = "";
                                    let first_name = "";
                                    let middle_name = "";
                                    let last_name = "";
                                    let invoice_serial_no = posp_data.rzp_id || "";
                                    if (posp_data && posp_data.Name_On_PAN && posp_data.Name_On_PAN !== "NA") {
                                        name_on_pan = posp_data.Name_On_PAN.trim();
                                        let namesArr = name_on_pan ? name_on_pan.split(" ") : [];
                                        if (namesArr.length > 0) {
                                            for (var i = 2; i < namesArr.length; i++) {
                                                middle_name += " " + namesArr[i - 1];
                                                middle_name = middle_name.trim();
                                            }
                                            first_name = name_on_pan.split(' ')[0];
                                            last_name = namesArr.length == 1 ? "" : namesArr[namesArr.length - 1];
                                        }
                                    } else {
                                        first_name = (posp_data.First_Name && posp_data.First_Name.trim()) || "";
                                        middle_name = (posp_data.Middle_Name && posp_data.Middle_Name.trim()) || "";
                                        last_name = (posp_data.Last_Name && posp_data.Last_Name.trim()) || "";
                                    }
                                    if (last_name === middle_name || first_name === middle_name) {
                                        middle_name = "";
                                    }
                                    if (first_name === last_name) {
                                        last_name = "";
                                    }
                                    if (first_name === "" && last_name) {
                                        first_name = last_name;
                                        middle_name = "";
                                        last_name = "";
                                    }

                                    present_add1 = posp_data.Present_Add1 && posp_data.Present_Add1.trim() || "";
                                    present_add2 = posp_data.Present_Add2 && posp_data.Present_Add2.trim() || "";
                                    present_add3 = posp_data.Present_Add3 && posp_data.Present_Add3.trim() || "";
                                    present_City = posp_data.Present_City && posp_data.Present_City.trim() || "";
                                    present_state = posp_data.Present_State && posp_data.Present_State.trim() || "";
                                    present_Pincode = posp_data.Present_Pincode || "";
                                    Address = [present_add1, present_add2, present_add3, present_City, present_state, present_Pincode].filter(Boolean).join(', ');

                                    let posp_details = {};
                                    let contact_name = "";
                                    if (middle_name) {
                                        contact_name = first_name + " " + middle_name + " " + last_name;
                                    } else {
                                        contact_name = first_name + " " + last_name;
                                    }
                                    let state_code = posp_data.Present_State ? getStateCode((posp_data.Present_State).toUpperCase()) : "";
                                    posp_details["PkId"] = posp_data.User_Id || "";
                                    posp_details["Name"] = contact_name || "";
                                    posp_details["Address"] = Address;
                                    posp_details["StateCode"] = state_code;
                                    posp_details["Pan"] = posp_data.Pan_No || "";
                                    posp_details["InvoiceDate"] = moment(razorpay_data[posp_data.User_Id]).format('YYYY-MM-DD h:mm:ss A');
                                    posp_details["InvoiceNo"] = invoice_serial_no + "/POSP/" + moment().format("YYYY") + "-" + moment().add(1, "years").format("YY"),
                                    posp_details["CustomerId"] = posp_data.User_Id || "";
                                    posp_details["SacHsnCode"] = "998314";
                                    posp_details["FullAmount"] = 999;
                                    posp_details["Amount"] = (Math.round(((999 * 100) / (100 + GST)) * 100) / 100);
                                    posp_details["SGST"] = (state_code === "MH") ? CGST : '';
                                    posp_details["CGST"] = (state_code === "MH") ? CGST : '';
                                    posp_details["IGST"] = (state_code === "MH") ? '' : IGST;
                                    posp_details["CreatedDate"] = moment(posp_data.Created_On).format("DD-MM-YYYY");
                                    posp_details["IsActive"] = posp_data.Is_Active + "" || "";
                                    posp_details["FBAID"] = posp_data.Fba_Id || "";
                                    posp_details["Email"] = posp_data.Email_Id || "";
                                    posp_details["PaymentId"] = posp_data.PayId || "";
                                    posp_details["PaymRefNo"] = posp_data.PayId || "";
                                    posp_details["PaymStatus"] = posp_data.Payment_Status || "";
                                    posp_details["PaymType"] = "";//doubts
                                    posp_details["PaymDate"] = moment(razorpay_data[posp_data.User_Id]).format('YYYY-MM-DD h:mm:ss A');
                                    posp_records.push(posp_details);
                                });
                                console.error('Data to create File - ', posp_records);
                                let filename = moment().format('DDMMYYYYhhmmss');
                                var file_name = "MIS_" + filename + ".xlsx";
                                var loc_path_portal = appRoot + "/tmp/pdf/" + file_name;
                                var web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + file_name;
                                var workbook = new excel.Workbook();
                                var worksheet = workbook.addWorksheet('MIS_' + monthName);
                                var styleh = workbook.createStyle({
                                    font: {
                                        bold: false,
                                        size: 12
                                    },
                                    fill: {
                                        type: "pattern",
                                        patternType: "solid",
                                        bgColor: "#FDFEFE",
                                        fgColor: "#3498DB"
                                    },
                                    alignment: {horizontal: 'center', vertical: 'center'}
                                });
                                var styleh2 = workbook.createStyle({
                                    font: {
                                        bold: false,
                                        size: 8
                                    },
                                    fill: {
                                        type: "none",
                                        bgColor: "#FBFCFC",
                                        fgColor: "#D6EAF8"
                                    }
                                });
                                if (posp_records.length > 0) {
                                    try {
                                        let styro = workbook.createStyle({alignment: {horizontal: 'center', vertical: 'center'}});
                                        worksheet.cell(1, 10).formula('=IF(SUBTOTAL(9,J3:J1048576) = 0, "-", SUBTOTAL(9,J3:J1048576))').style(styro);
                                        worksheet.cell(1, 11).formula('=IF(SUBTOTAL(9,K3:K1048576) = 0, "-", SUBTOTAL(9,K3:K1048576))').style(styro);
                                        worksheet.cell(1, 12).formula('=IF(SUBTOTAL(9,L3:L1048576) = 0, "-", SUBTOTAL(9,L3:L1048576))').style(styro);
                                        worksheet.cell(1, 13).formula('=IF(SUBTOTAL(9,M3:M1048576) = 0, "-", SUBTOTAL(9,M3:M1048576))').style(styro);
                                        worksheet.cell(1, 14).formula('=IF(SUBTOTAL(9,N3:N1048576) = 0, "-", SUBTOTAL(9,N3:N1048576))').style(styro);
                                        worksheet.cell(2, 1).string('PkId').style(styleh);
                                        worksheet.cell(2, 2).string('Name').style(styleh);
                                        worksheet.cell(2, 3).string('Address').style(styleh);
                                        worksheet.cell(2, 4).string('StateCode').style(styleh);
                                        worksheet.cell(2, 5).string('Pan').style(styleh);
                                        worksheet.cell(2, 6).string('InvoiceDate').style(styleh);
                                        worksheet.cell(2, 7).string('InvoiceNo').style(styleh);
                                        worksheet.cell(2, 8).string('CustomerId').style(styleh);
                                        worksheet.cell(2, 9).string('SacHsnCode').style(styleh);
                                        worksheet.cell(2, 10).string('FullAmount').style(styleh);
                                        worksheet.cell(2, 11).string('Amount').style(styleh);
                                        worksheet.cell(2, 12).string('SGST').style(styleh);
                                        worksheet.cell(2, 13).string('CGST').style(styleh);
                                        worksheet.cell(2, 14).string('IGST').style(styleh);
                                        worksheet.cell(2, 15).string('CreatedDate').style(styleh);
                                        worksheet.cell(2, 16).string('IsActive').style(styleh);
                                        worksheet.cell(2, 17).string('FBAID').style(styleh);
                                        worksheet.cell(2, 18).string('Email').style(styleh);
                                        worksheet.cell(2, 19).string('PaymentId').style(styleh);
                                        worksheet.cell(2, 20).string('PaymRefNo').style(styleh);
                                        worksheet.cell(2, 21).string('PaymStatus').style(styleh);
                                        worksheet.cell(2, 22).string('PaymType').style(styleh);
                                        worksheet.cell(2, 23).string('PaymDate').style(styleh);
                                        let rowcount = 3;
                                        posp_records.forEach((item, index) => {
                                            let col = 1;
                                            for (let keyVal in item) {
                                                if (["FullAmount", "Amount", "SGST", "CGST", "IGST", "FBAID", "CustomerId", "PkId"].indexOf(keyVal) > -1 && ["", '-'].indexOf(item[keyVal]) === -1) {
                                                    worksheet.cell(rowcount, col).number(item[keyVal]).style(styleh2);
                                                } else {
                                                    worksheet.cell(rowcount, col).string(item[keyVal]).style(styleh2);
                                                }
                                                console.error("rowcount : " + rowcount + " , col : " + col + " , keyVal : " + keyVal + " , Val : " + item[keyVal]);
                                                col++;
                                            }
                                            rowcount++;
                                        });
                                        workbook.write(loc_path_portal);
                                        console.error('File written successfully -', loc_path_portal);
                                        var Email = require('../models/email');
                                        var objModelEmail = new Email();
                                        var sub = 'POSP Payment Done Data - ' + date;
                                        email_body = '<html><body><p>Dear Team,</p><p>Please find the link of POSP onboarding payment on date ' + date + '. </p>' + '<p>POSP Payment File URL : <a href="' + web_path_portal + '">' + web_path_portal + '</a> </p><br><br><br><p>Thanks & Regards</p><p>PolicyBoss IT</p></body></html>';
                                        var arrTo = "";
                                        var arrBcc = "";
                                        if (req.query && req.query.dbg && req.query.dbg === "yes") {
                                            arrTo = ['anuj.singh@policyboss.com', 'roshani.prajapati@policyboss.com'];
											arrBcc = [config.environment.notification_email];
                                        } else {
                                            arrTo = ['invoicedesk@policyboss.com','statement@policyboss.com'];
                                            arrBcc = [config.environment.notification_email, 'ashish.hatia@policyboss.com'];
                                        }
                                        objModelEmail.send('noreply@policyboss.com', arrTo.join(','), sub, email_body, '', arrBcc.join(','), '');
                                        res.json({"Status": "SUCCESS", "Msg": "Mail sent"});
                                    } catch (e) {
                                        res.json({"Status": "FAIL", "Msg": e.stack});
                                    }
                                } else {
                                    res.json({"Status": "FAIL", "Msg": "No records found"});
                                }
                            } else {
                                res.json({"Status": "FAIL", "Msg": "No records found in collection"});
                            }
                        }
                    });
                }
            });
        } catch (ex) {
            console.error("EXCEPTION_PAYMENT_REPORT : " + ex.stack);
            res.json({"Status": "Fail", "Msg": ex.stack});
        }
    });
    
    app.post('/posp/user_disposition_save_new', function (req, res) {
        try {
            let user_disposition = require('../models/posp_disposition');
            let posp_enquiry = require('../models/posp_enquiry');
            let objRequest = req.body || {};
            objRequest = JSON.parse(JSON.stringify(objRequest));
            try {
                let posp_enquiry_id = objRequest['posp_enquiry_id'];
                if (posp_enquiry_id && !isNaN(posp_enquiry_id)) {
                    let updated_arg = {
                        Disposition_Status: objRequest["dsp_status"] || "",
                        Sub_Status: objRequest["dsp_substatus"] || "",
                        Disposition_On: new Date(),
                        Next_Call_Date: objRequest["Next_Call_Date"] || ""
                    };
                    let arg = {
                        Disposition_Id: posp_enquiry_id - 0,
                        Lead_Id: posp_enquiry_id - 0,
                        Status: objRequest["dsp_status"] || "",
                        Sub_Status: objRequest["dsp_substatus"] || "",
                        Remark: objRequest["dsp_remarks"] || "",
                        Disposition_By: objRequest["Disposition_By"] || 0,
                        Is_Latest: 1,
                        File_Name: '',
                        Customer_Name: objRequest["Customer_Name"] || "",
                        Customer_Mobile: objRequest["Customer_Mobile"] || "",
                        Disposition_Source: objRequest["Disposition_Source"] || "",
                        Next_Call_Date: objRequest["Next_Call_Date"] || "",
                        Created_On: new Date(),
                        Modified_On: new Date()
                    };
                    let dispositionObj = new user_disposition(arg);
                    dispositionObj.save(function (err) {
                        try {
                            if (err)
                                throw err;
                            posp_enquiry.update({Posp_Enquiry_Id: parseInt(arg.Disposition_Id)}, {$set: updated_arg}, function (err, dblmsData) {
                                if (err) {
                                    res.json({"Status": "FAIL", "Msg": 'ERROR OCCURRED WHILE SAVING DISPOSITION', 'Data': err});
                                } else {
                                    res.json({'Status': 'SUCCESS', 'Msg': 'DISPOSITION ADDED SUCCESSFULLY', 'Data': arg});
                                }
                            });
                        } catch (e) {
                            res.json({"Status": "FAIL", "Msg": 'EXCEPTION OCCURRED', 'Data': e.stack});
                        }
                    });
                } else {
                    res.json({'Status': 'FAIL', 'Msg': 'POSP ENQUIRY ID SHOULD BE OF TYPE NUMBER'});
                }
            } catch (e) {
                res.json({"Status": "FAIL", "Msg": 'EXCEPTION OCCURRED', 'Data': e.stack});
            }
        } catch (e) {
            res.json({"Status": "FAIL", "Msg": 'EXCEPTION OCCURRED', 'Data': e.stack});
        }
    });
	app.get('/posp/employee_list',  LoadSession ,function (req, res) {    
		try {
			var users = require('../models/user');
			var filter = {};
			var arr_ssid = [];
			var selected_column = '-_id UID Employee_Name Branch';
			filter['UID'] = {$nin: [100001, 100192]};			
			
			if (req.obj_session.user.role_detail.role.indexOf('SuperAdmin') > -1) {

			} else if (req.obj_session.hasOwnProperty('users_assigned') && req.obj_session.users_assigned.hasOwnProperty('Team')) {
				filter['Ss_Id'] = {$in: req.obj_session.users_assigned.Team.CSE};				
			} else {
				filter['Ss_Id'] = {$in: req.obj_session.user.ss_id};				
			}
			
			users.find(filter).select(selected_column).sort({"Employee_Name":1}).exec(function (err, dbusers) {
				try {
					if(dbusers){
						return res.json(dbusers);
					}
					else{
						return res.json({});
					}
				} catch (ex) {
					console.log("error:", ex);
					res.json({'Status': 'Error', 'Msg': ex.stack, 'Data': dbusers});
				}
			});

		} catch (ex) {
			console.log("error:", ex);
			res.json({'Status': 'Error', 'Msg': ex.stack});
		}
	});
    app.get('/posp/bitrix_disposition_save', function (req, res) {
        try {
            let Client = require('node-rest-client').Client;
            let objRequest = req.query || {};
            objRequest = JSON.parse(JSON.stringify(objRequest));
            let bitrix_id = objRequest.bitrix_id || "";
            if (bitrix_id) {
                try {
                    let bitrix_disposition_obj = {
                        "29459": "Contacted-Follow Up",
                        "29461": "Contacted-Duplicate",
                        "29463": "Contacted-Not Interested",
                        "29465": "Contacted-Call Closed",
                        "29467": "Contacted-Call Back",
                        "29469": "Contacted-DND",
                        "29471": "Contacted-Language Barrier",
                        "29475": "Not Contacted-Invalid No.",
                        "29477": "Not Contacted-Not Reachable",
                        "29479": 'Not Contacted-No Answer',
                        "29481": "Not Contacted-Switch Off",
                        "29483": "Not Contacted-Wrong Number",
                        "29485": "Not Interested-Already POSP",
                        "29487": "Not Interested-Competitor has better offering",
                        "29489": "Not Interested-No Docs",
                        "29491": "Not Interested-No NOC",
                        "29493": "Not Interested-Not Interested"
                    };
                    let client1 = new Client();
                    let fetch_bitrix_data_url = 'https://policyboss.bitrix24.in/rest/2/1bttbyztfz106siy/crm.deal.get.json?id=' + bitrix_id;
                    client1.get(fetch_bitrix_data_url, {}, function (bitrix_data, bitrix_response) {
                        try {
                            let bitrixdata = typeof bitrix_data === 'string' ? JSON.parse(bitrix_data) : bitrix_data;
                            let posp_enquiry_id = "";
                            if (bitrixdata && bitrixdata.result) {
                                let disposition = (bitrixdata.result["UF_CRM_1715926575794"] && bitrix_disposition_obj[bitrixdata.result["UF_CRM_1715926575794"]]) || "";
                                let dsp_status = disposition.split('-')[0] || "";
                                let dsp_substatus = disposition.split('-')[1] || "";
                                let json_data = {
                                    posp_enquiry_id: bitrixdata.result["UF_CRM_1705553933158"] - 0, //posp enquiry id
                                    dsp_status: dsp_status,
                                    dsp_substatus: dsp_substatus,
                                    dsp_remarks: bitrixdata.result["UF_CRM_1715926629991"] || "",
                                    Disposition_By: "",
                                    Is_Latest: 1,
                                    Customer_Name: bitrixdata.result["UF_CRM_1705481346348"] || "",
                                    Customer_Mobile: bitrixdata.result["UF_CRM_1705481390852"] || "",
                                    Disposition_Source: "BITRIX",
                                    Next_Call_Date: bitrixdata.result["UF_CRM_1693029388103"] || ""
                                };
                                let client2 = new Client();
                                let argsT = {
                                    data: JSON.stringify(json_data),
                                    headers: {
                                        "Content-Type": "application/json",
                                        "Accept": "*/*"
                                    }
                                };
                                client2.post(config.environment.weburl + "/posp/user_disposition_save_new", argsT, function (disposition_data, disposition_response) {
                                    try {
                                        disposition_data = typeof disposition_data === 'string' ? JSON.parse(disposition_data) : disposition_data;
                                        if (disposition_data && disposition_data.Status === 'SUCCESS') {
                                            return res.json({"Status": "SUCCESS", "Msg": disposition_data.Msg, "Data": disposition_data['Data'] || ""});
                                        } else {
                                            return res.json({"Status": "FAIL", "Msg": "ERROR WHILE SAVING DISPOSITION", "Data": disposition_data['Data'] || ""});
                                        }
                                    } catch (e) {
                                        return res.json({"Status": "FAIL", "Msg": 'EXCEPTION OCCURRED', "Data": e.stack});
                                    }
                                });
                            } else {
                                return res.json({"Status": "FAIL", "Msg": 'NO DATA FOUND FROM BITRIX API', "Data": bitrixdata});
                            }
                        } catch (e) {
                            return res.json({"Status": "FAIL", "Msg": 'EXCEPTION OCCURRED', "Data": e.stack});
                        }
                    });
                } catch (e) {
                    return res.json({"Status": "FAIL", "Msg": 'EXCEPTION OCCURRED', "Data": e.stack});
                }
            } else {
                return res.json({"Status": "FAIL", "Msg": 'PLEASE PASS VALID BITRIX ID', "Data": {'BitrixID': bitrix_id}});
            }
        } catch (e) {
            return res.json({"Status": "FAIL", "Msg": 'EXCEPTION OCCURRED', "Data": e.stack});
        }
    });
};
function getStateCode(state) {
    let state_code = "";
    let json_file_path = appRoot + "/resource/request_file/posp_state_codes.json";
    let jsonPol = fs.readFileSync(json_file_path, 'utf8');
    jsonPol = JSON.parse(jsonPol);
    for (let j = 0; j < jsonPol.length; j++) {
        let obj = jsonPol[j];
        (obj.State === state) ? state_code = obj.Code : "";
    }
    return state_code;
}
function posps_recruitment_historic_summary(obj_Posp_Summary, req, res){
	try{
		let is_finish_all = false;
		let finish_count = 0;
		let key_count = Object.keys(obj_Posp_Summary).length;
		for(let k in obj_Posp_Summary){
			if(obj_Posp_Summary[k]['count'] !== null){
				finish_count++;
			}					
		}
		if(finish_count > 0 && finish_count === key_count){
			return res.json(obj_Posp_Summary);
		}
	}
	catch(e){
		res.send(e.stack);
	}
}
function erp_code_generation_post_process_handler(res,obj_post_code_status){	
	let ss_id = obj_post_code_status['req']['ss_id'];
	
	
	client.get(config.environment.weburl + '/report/sync_emp_master?ss_id=' + ss_id, {}, function (data, response) {});
	client.get(config.environment.weburl + '/report/sync_posp_master?ss_id=' + ss_id, {}, function (data, response) {});
	let Email = require('../models/email');
	let objModelEmail = new Email();

	let res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>POSP CODE CREATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
	res_report += '<p><h1>MSSQL PROCESS AFTER ERP CODE CREATION , SSID-'+ss_id + '</h1></p>';	
	res_report += '<p><pre>' + JSON.stringify(obj_post_code_status, undefined, 2) + '</pre><p>';	
	res_report += '</body></html>';
	let subject = '[POSP_MSSQL_CALLBACK] MSSQL PROCESS AFTER ERP CODE CREATION , SSID-'+ss_id;
	objModelEmail.send('notifications@policyboss.com', config.environment.notification_email,subject, res_report, '', '');
	
	return res.json(obj_post_code_status);
}
function sync_training_date_handler(res,obj_post_code_status){	
	let ss_id = obj_post_code_status['req']['ss_id'];
	
	
	client.get(config.environment.weburl + '/report/sync_posp_master?ss_id=' + ss_id, {}, function (data, response) {});
	let Email = require('../models/email');
	let objModelEmail = new Email();

	let res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>POSP CODE CREATION</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
	res_report += '<p><h1>MSSQL SYNC TRAINING DATE , SSID-'+ss_id + '</h1></p>';	
	res_report += '<p><pre>' + JSON.stringify(obj_post_code_status, undefined, 2) + '</pre><p>';	
	res_report += '</body></html>';
	let subject = '[POSP_MSSQL_TRAINING_SYNC] MSSQL SYNC TRAINING DATE , SSID-'+ss_id;
	objModelEmail.send('notifications@policyboss.com', config.environment.notification_email,subject, res_report, '', '');
	
	return res.json(obj_post_code_status);
}
function sync_iib_handler(res,obj_post_code_status){	
	let ss_id = obj_post_code_status['req']['ss_id'];
	
	
	client.get(config.environment.weburl + '/report/sync_posp_master?ss_id=' + ss_id, {}, function (data, response) {});
	let Email = require('../models/email');
	let objModelEmail = new Email();

	let res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>POSP IIB UPLOAD</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
	res_report += '<p><h1>MSSQL SYNC IIB , SSID-'+ss_id + '</h1></p>';	
	res_report += '<p><pre>' + JSON.stringify(obj_post_code_status, undefined, 2) + '</pre><p>';	
	res_report += '</body></html>';
	let subject = '[POSP_MSSQL_IIB_SYNC] MSSQL SYNC IIB DATE , SSID-'+ss_id;
	objModelEmail.send('notifications@policyboss.com', config.environment.notification_email,subject, res_report, '', '');
	try{
	client.get(config.environment.weburl + '/postservicecall/posp_iib_event_tracking?ss_id=' + ss_id, {}, function (data1, response1) {});
	}catch(ex)
	{
		console.error("EXCEPTION","WEBENGAGE","POSP IIB UPLOAD DATA",ex.stack);
	}
	return res.json(obj_post_code_status);
}
function sync_noc_handler(res,obj_post_code_status){	
	let ss_id = obj_post_code_status['req']['ss_id'];
	
	
	client.get(config.environment.weburl + '/report/sync_posp_master?ss_id=' + ss_id, {}, function (data, response) {});
	let Email = require('../models/email');
	let objModelEmail = new Email();

	let res_report = '<!DOCTYPE html><html><head><style>body,*,html{font-family:\'Google Sans\' ,tahoma;font-size:14px;}</style><title>POSP NOC</title><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head><body>';
	res_report += '<p><h1>MSSQL SYNC NOC , SSID-'+ss_id + '</h1></p>';	
	res_report += '<p><pre>' + JSON.stringify(obj_post_code_status, undefined, 2) + '</pre><p>';	
	res_report += '</body></html>';
	let subject = '[POSP_MSSQL_NOC_SYNC] MSSQL SYNC NOC , SSID-'+ss_id;
	objModelEmail.send('notifications@policyboss.com', config.environment.notification_email,subject, res_report, '', '');
	
	return res.json(obj_post_code_status);
}
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
function calAge(dob){
	var dob = moment(dob);
	var years = moment().diff(dob, 'year');
	dob.add(years, 'years');

	var months = moment().diff(dob, 'months');
	dob.add(months, 'months');

	var days = moment().diff(dob, 'days');
	return years + ' years, ' + months + ' month(s), ' + days + ' day(s)';
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
function GetFinancialYear(business_year_month){
	let obj_financial = {
		'April_2025-March_2026' : { 'start' : 202504, 'end': 202603},
		'April_2024-March_2025' : { 'start' : 202404, 'end': 202503},
		'April_2023-March_2024' : { 'start' : 202304, 'end': 202403},
		'April_2022-March_2023' : { 'start' : 202204, 'end': 202303},
		'April_2021-March_2022' : { 'start' : 202104, 'end': 202203},
		'April_2020-March_2021' : { 'start' : 202004, 'end': 202103},
		'April_2019-March_2020' : { 'start' : 201904, 'end': 202003},
		'April_2018-March_2019' : { 'start' : 201804, 'end': 201903},
		'April_2017-March_2018' : { 'start' : 201704, 'end': 201803}					
	};
	let business_finacial_year = '';
	for(let ind_financial in obj_financial){
		if(business_year_month >=  obj_financial[ind_financial]['start'] && business_year_month <=  obj_financial[ind_financial]['end']){
			business_finacial_year = ind_financial;
			break;
		}
	}
	return business_finacial_year;	
}