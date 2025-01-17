/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var config = require('config');
var path = require('path');
var appRoot = path.dirname(path.dirname(require.main.filename));
var xl = require('excel4node');
var moment = require('moment');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
module.exports.controller = function (app) {
    app.post('/posp_enquiry', function (req, res) {
        try {
            var posp_enquiry = require('../models/posp_enquiry');
            var posp_enquiry_data = new posp_enquiry();
            for (var key in req.body) {
                posp_enquiry_data[key] = req.body[key];
            }
            posp_enquiry_data.Status = "Active";
            posp_enquiry_data.Created_On = new Date();
            posp_enquiry_data.Modified_On = new Date();
            posp_enquiry_data.save(function (err1, dbrespnse) {
                if (err1) {
                    res.json({'Msg': err1, 'Status': "Error"});
                } else {
                    res.json({'Msg': "Data Inserted Successfully", 'Status': "Success"});
                    var Email = require('../models/email');
                    var objModelEmail = new Email();
                    let subject = 'POSP Inquiry - ' + dbrespnse._doc["name"] + ' - InquiryId : ' + dbrespnse.Posp_Enquiry_Id;
                    let mail_content = '<html><body>' +
                            'Dear Team,' +
                            '<p>We have received POSP inquiry as following</p>' +
                            '<p></p>Name - ' + dbrespnse._doc["name"] +
                            '<p></p>Contact Number  - ' + dbrespnse._doc["mobile"] +
                            '<p></p>Email Id  - ' + dbrespnse._doc["email"] +
                            '<p></p>City  - ' + dbrespnse._doc["city_name"] +
                            '<p></p><p></p>Regards,' +
                            '<p></p>PolicyBoss' +
                            '</body></html>';
                    let email_id = "marketing@policyboss.com;srinivas@policyboss.com";
                    objModelEmail.send('noreply@policyboss.com', email_id, subject, mail_content, '', config.environment.notification_email, '');
                }
            });
        } catch (e) {
            res.json({'Msg': e, 'Status': "Error"});
        }
    });

    app.get('/pe/:posp_enquiry_Id', function (req, res) {
        let posp_enquiry_Id = req.params.posp_enquiry_Id - 0;
        let posp_enquiry = require('../models/posp_enquiry');
        posp_enquiry.find({"Posp_Enquiry_Id": posp_enquiry_Id}, function (err, data) {
            if (err) {
                res.send(err);
            } else {
                if (data.length > 0) {
                    return res.redirect("http://qa.policyboss.com/Posp_Callback/callback_input.html?name=" + data[0].name + "&mobile=" + data[0].mobile + "&posp_enquiry_id=" + data[0].Posp_Enquiry_Id);
                } else {
                    res.send('No Records Found');
                }
            }
        });
    });
    app.post('/posp_callback', function (req, res) {
        try {
            var posp_callback = require('../models/posp_callback');
            posp_callback.find({"Posp_Enquiry_Id": req.body.posp_enquiry_id}, function (err, data) {
                if (err) {
                    res.send(err);
                } else {
                    if (data.length > 0) {//update into existing
                        let db_Data = data[0]._doc;
                        let Visited_History = db_Data.hasOwnProperty('Visited_History') ? db_Data.Visited_History : [];
                        Visited_History.unshift(new Date());
                        let Visited_Count = db_Data.hasOwnProperty('Visited_Count') ? db_Data.Visited_Count + 1 : 1;
                        let objFresh_Quote = {
                            'Visited_History': Visited_History,
                            'Visited_Count': Visited_Count,
                            'Visited_On': new Date(),
                            'Modified_On': new Date(),
                            'Call_Time': req.body.call_time,
                            'Remark': req.body.remark,
                            'Ip_Address': req.body.ip_address
                        };
                        posp_callback.update({'Posp_Enquiry_Id': req.body.posp_enquiry_id - 0}, {$set: objFresh_Quote}, function (err, numAffected) {
                            console.log('msg - ' + numAffected);
                            res.json({'Msg': "Data Updated Successfully", 'Status': "Success"});
                        });
                    } else {//insert new
                        var callback_data = {
                            'Posp_Enquiry_Id': req.body.posp_enquiry_id,
                            'Name': req.body.name,
                            'Mobile': req.body.mobile,
                            'Call_Time': req.body.call_time,
                            'Remark': req.body.remark,
                            'Status': 'InProgress',
                            'Ip_Address': req.body.ip_address,
                            'Visited_History': [new Date()],
                            'Visited_On': new Date(),
                            'Visited_Count': 1,
                            'Created_On': new Date(),
                            'Modified_On': new Date()
                        };
                        var posp_callback_data = new posp_callback(callback_data);
                        posp_callback_data.save(function (err1, dbrespnse) {
                            if (err1) {
                                res.json({'Msg': err1, 'Status': "Error"});
                            } else {
                                res.json({'Msg': "Data Inserted Successfully", 'Status': "Success"});
                            }
                        });
                    }

                    var subject = "POSP Sheduled call back";
                    var mail_content = '<html><body><p>Dear Team,</p><BR/><p>Please find the sheduled call back details for posp enquiry.</p>'
                            + '<p>Name - ' + req.body.name + '<br>Mobile - ' + req.body.mobile + '<br>Callback Time - ' + req.body.call_time + '<br>Remarks - ' + req.body.remark + '</p></body></html>';
                    var Email = require('../models/email');
                    var objModelEmail = new Email();
                    if (config.environment.name === 'Production') {
                        var arrTo = ['ashish.hatia@policyboss.com'];
                        var arrCc = ['anuj.singh@policyboss.com', 'kevin.monteiro@policyboss.com'];
                        var arrBcc = [config.environment.notification_email];
                    } else {
                        var arrTo = ['anuj.singh@policyboss.com'];
                        var arrCc = ['ashish.hatia@policyboss.com', 'kevin.monteiro@policyboss.com'];
                        var arrBcc = [config.environment.notification_email];
                    }
                    objModelEmail.send('noreply@landmarkinsurance.co.in', arrTo.join(','), subject, mail_content, arrCc.join(','), arrBcc.join(','), '');
                }
            });
        } catch (e) {
            res.json({'Msg': e.stack, 'Status': "Error"});
        }
    });

    app.get('/scheduler_posp_enquiries', function (req, res) {
        let days = (req.query.hasOwnProperty('days')) ? req.query.days - 0 : 0;
        let currentDate = moment().subtract(days, 'days').format('YYYY-MM-DD');
        let yesterdayDate = moment(currentDate).subtract(1, 'days').format('YYYY-MM-DD');
        let posp_enquiry = require('../models/posp_enquiry');
        try {
            posp_enquiry.find({'Created_On': {$gte: new Date(yesterdayDate), $lt: new Date(currentDate)}}, function (err, getData) {
                if (err)
                    res.send(err);
                else
                if (getData.length > 0) {
                    let ff_file_name = "POSP_Enquiries_" + moment(yesterdayDate).format('DD-MM-YYYY') + ".xlsx";
                    let ff_loc_path_portal = appRoot + "/tmp/pdf/" + ff_file_name;
                    let ff_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + ff_file_name;
                    let wb = new xl.Workbook();
                    let ws = wb.addWorksheet('Sheet 1');
                    let styleh = wb.createStyle({font: {bold: true, size: 12}});
                    //row 1
                    ws.cell(1, 1).string('Posp_Enquiry_Id').style(styleh);
                    ws.cell(1, 2).string('Name').style(styleh).ws.column(2).setWidth(20);
                    ws.cell(1, 3).string('Mobile').style(styleh).ws.column(3).setWidth(13);
                    ws.cell(1, 4).string('Email').style(styleh).ws.column(4).setWidth(20);
                    ws.cell(1, 5).string('City_Id').style(styleh);
                    ws.cell(1, 6).string('City_Name').style(styleh);
                    ws.cell(1, 7).string('State').style(styleh);
                    ws.cell(1, 8).string('Aadhaar').style(styleh).ws.column(8).setWidth(15);
                    ws.cell(1, 9).string('Pan').style(styleh);
                    ws.cell(1, 10).string('Created_On').style(styleh).ws.column(10).setWidth(20);
                    ws.cell(1, 11).string('Status').style(styleh);
                    ws.cell(1, 12).string('search_parameter').style(styleh).ws.column(12).setWidth(30);
                    ws.cell(1, 13).string('Source').style(styleh).ws.column(13).setWidth(20);
                    ws.cell(1, 14).string('Campgin_Id').style(styleh).ws.column(14).setWidth(20);

                    //row 2
                    let search_results = [];
                    let search = {"utm_source": "Campaign_GS", "utm_medium": "SMS_GS", "utm_campaign": "Campaign_GS"};
                    for (var i = 0; i < getData.length; i++) {
                        let record = getData[i]['_doc'];
                        ws.cell(i + 2, 1).string(record['Posp_Enquiry_Id'].toString());
                        ws.cell(i + 2, 2).string(record['name']);
                        ws.cell(i + 2, 3).string(record['mobile'].toString());
                        ws.cell(i + 2, 4).string(record['email']);
                        ws.cell(i + 2, 5).string(record['city_id'].toString());
                        ws.cell(i + 2, 6).string(record['city_name']);
                        ws.cell(i + 2, 7).string(record['state']);
                        ws.cell(i + 2, 8).string(record['aadhaar'] === null ? '' : record['aadhaar'].toString());
                        ws.cell(i + 2, 9).string(record['pan']);
                        ws.cell(i + 2, 10).string((new Date((record['Created_On']))).toLocaleString());
                        ws.cell(i + 2, 11).string(record['Status']);
                        ws.cell(i + 2, 12).string(record.hasOwnProperty('search_parameter') ? JSON.stringify(record['search_parameter']) : "");
                        ws.cell(i + 2, 13).string(record.hasOwnProperty('Source') ? record['Source'] : '');
                        ws.cell(i + 2, 14).string(record.hasOwnProperty('Campgin_Id') ? record['Campgin_Id'] : '');
                        if (record.hasOwnProperty('search_parameter')) {
                            for (var key in search) {
                                if (record.search_parameter.hasOwnProperty(key) && record.search_parameter[key].includes(search[key])) {
                                    search_results.push(record);
                                    break;
                                }
                            }
                        }
                    }
                    wb.write(ff_loc_path_portal);
                    var Email = require('../models/email');
                    var objModelEmail = new Email();
                    var sub = 'POSP Enquiry File';
                    email_body = '<html><body><p>Hello,</p><BR/><p>Please find below the URL of POSP Enquiry details of <b>' + moment(yesterdayDate).format('DD-MM-YYYY') + '</b></p>'
                            + '<BR><p>POSP Enquiry file URL : ' + ff_web_path_portal + '</p></body></html>';
                    if (config.environment.name === 'Production') {
                        var arrTo = ['mohan.hudke@policyboss.com'];
                        var arrCc = ['st@policyboss.com', 'sandesh.yadav@policyboss.com', 'varun.kaushik@policyboss.com', 'chirag.modi@policyboss.com'];
                        var arrBcc = [config.environment.notification_email];
                    } else {
                        var arrTo = ['anuj.singh@policyboss.com'];
                        var arrCc = ['ashish.hatia@policyboss.com', 'kevin.monteiro@policyboss.com'];
                        var arrBcc = [config.environment.notification_email];
                    }
                    objModelEmail.send('noreply@landmarkinsurance.co.in', arrTo.join(','), sub, email_body, arrCc.join(','), arrBcc.join(','), '');
                    posp_search_feedfile(search_results, search, yesterdayDate);
                    res.json({'msg': 'success'});
                } else {
                    res.json({'msg': 'No Records Found'});
                }
            });
        } catch (err) {
            try {
                let fs = require('fs');
                var cache_date = moment().format('DD/MM/YYYY HH:mm:ss');
                var cache_key = 'error_scheduler_posp_enquiries';
                if (fs.existsSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log")) {
                    var cache_content = fs.readFileSync(appRoot + "/tmp/cachemaster/" + cache_key + ".log").toString();
                    var obj_cache_content = JSON.parse(cache_content);
                    obj_cache_content[cache_date] = JSON.stringify(err, Object.getOwnPropertyNames(err));
                    fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(obj_cache_content), function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });
                } else {
                    var objReq = {};
                    objReq[cache_date] = JSON.stringify(err, Object.getOwnPropertyNames(err));
                    fs.writeFile(appRoot + "/tmp/cachemaster/" + cache_key + ".log", JSON.stringify(objReq), function (err) {
                        if (err) {
                            return console.error(err);
                        }
                    });
                }
                res.json({'msg': 'error'});
            } catch (er) {
                console.log(er);
            }
            console.log(err);
        }
    });
    function posp_search_feedfile(data, search, yesterdayDate) {
        //let yesterdayDate = moment().subtract(1, 'days').format('DD-MM-YYYY');
        let search_params = Object.keys(search)[0] + '-' + search[Object.keys(search)[0]];
        if (data.length > 0) {
            let wb = new xl.Workbook();
            let ws = wb.addWorksheet('Sheet 1');
            let styleh = wb.createStyle({font: {bold: true, size: 12}});
            //row 1- column headings
            ws.cell(1, 1).string('Posp_Enquiry_Id').style(styleh);
            ws.cell(1, 2).string('Name').style(styleh).ws.column(2).setWidth(20);
            ws.cell(1, 3).string('Mobile').style(styleh).ws.column(3).setWidth(13);
            ws.cell(1, 4).string('Email').style(styleh).ws.column(4).setWidth(20);
            ws.cell(1, 5).string('City_Id').style(styleh);
            ws.cell(1, 6).string('City_Name').style(styleh);
            ws.cell(1, 7).string('State').style(styleh);
            ws.cell(1, 8).string('Aadhaar').style(styleh).ws.column(8).setWidth(15);
            ws.cell(1, 9).string('Pan').style(styleh);
            ws.cell(1, 10).string('Created_On').style(styleh).ws.column(10).setWidth(20);
            ws.cell(1, 11).string('Status').style(styleh);
            ws.cell(1, 12).string('search_parameter').style(styleh).ws.column(12).setWidth(30);
            ws.cell(1, 13).string('Source').style(styleh).ws.column(13).setWidth(20);
            ws.cell(1, 14).string('Campgin_Id').style(styleh).ws.column(14).setWidth(20);
            //row 2+
            for (let i = 0; i < data.length; i++) {
                let record = data[i];
                ws.cell(i + 2, 1).string(record['Posp_Enquiry_Id'].toString());
                ws.cell(i + 2, 2).string(record['name']);
                ws.cell(i + 2, 3).string(record['mobile'].toString());
                ws.cell(i + 2, 4).string(record['email']);
                ws.cell(i + 2, 5).string(record['city_id'].toString());
                ws.cell(i + 2, 6).string(record['city_name']);
                ws.cell(i + 2, 7).string(record['state']);
                ws.cell(i + 2, 8).string(record['aadhaar'] === null ? '' : record['aadhaar'].toString());
                ws.cell(i + 2, 9).string(record['pan']);
                ws.cell(i + 2, 10).string((new Date((record['Created_On']))).toLocaleString());
                ws.cell(i + 2, 11).string(record['Status']);
                ws.cell(i + 2, 12).string(record.hasOwnProperty('search_parameter') ? JSON.stringify(record['search_parameter']) : "");
                ws.cell(i + 2, 13).string(record.hasOwnProperty('Source') ? record['Source'] : '');
                ws.cell(i + 2, 14).string(record.hasOwnProperty('Campgin_Id') ? record['Campgin_Id'] : '');
            }
            var ff_file_name = "POSP_Enquiries_" + search_params + '_' + yesterdayDate + ".xlsx";
            var ff_loc_path_portal = appRoot + "/tmp/pdf/" + ff_file_name;
            var ff_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + ff_file_name;
            wb.write(ff_loc_path_portal);
            var email_body = '<html><body><p>Hello,</p><BR/><p>Please find below the URL of POSP Enquiry ' + search_params + ' details Dated: <b>' + yesterdayDate + '</b></p>'
                    + '<BR><p>POSP Enquiry file URL : ' + ff_web_path_portal + '</p></body></html>';
        } else {
            var email_body = '<html><body><p>Hello,</p><BR/><p>Please find below the URL of POSP Enquiry ' + search_params + ' details Dated:<b>' + yesterdayDate + '</b></p>'
                    + '<BR><p>No Data Available</p></body></html>';
        }
        var Email = require('../models/email');
        var objModelEmail = new Email();
        var sub = 'POSP Enquiry File ' + search_params;
        if (config.environment.name === 'Production') {
            var arrTo = ['mohan.hudke@policyboss.com'];
            var arrCc = ['st@policyboss.com', 'sandesh.yadav@policyboss.com', 'varun.kaushik@policyboss.com', 'chirag.modi@policyboss.com'];
            var arrBcc = [config.environment.notification_email];
        } else {
            var arrTo = ['anuj.singh@policyboss.com'];
            var arrCc = ['ashish.hatia@policyboss.com', 'kevin.monteiro@policyboss.com'];
            var arrBcc = [config.environment.notification_email];
        }
        objModelEmail.send('noreply@landmarkinsurance.co.in', arrTo.join(','), sub, email_body, arrCc.join(','), arrBcc.join(','), '');
    }
};