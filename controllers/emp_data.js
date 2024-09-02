/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var config = require('config');
var mongoose = require('mongoose');
var Base = require('../libs/Base');
var path = require('path');
var MongoClient = require('mongodb').MongoClient;
var config = require('config');
var moment = require('moment');
var sleep = require('system-sleep');
var fs = require('fs');
var pdf = require('html-pdf');
var appRoot = path.dirname(path.dirname(require.main.filename));

module.exports.controller = function (app) {
    app.post('/empdata/upload_emp_data', function (req, res, next) {
        var objRequest = req.body;
        let file = "";
        let file_ext = "";
        let path = appRoot + "/tmp/emp_data/";
        file = decodeURIComponent(objRequest["file"]);
        file_ext = objRequest["file_ext"];
        let fileName = path + '/emp_data.' + file_ext;
        //console.log(NewTicket_Id + ' - Folder Already Exist');
        //for (var i in file_obj) {
        var data = file.replace(/^data:image\/\w+;base64,/, "");
        if (data === "") {
//res1.json({'msg': 'Something Went Wrong'});
        } else {
            let buf = new Buffer(data, 'base64');
            fs.writeFile(fileName, buf);
        }
//}
        sleep(5000);
        let file_excel = appRoot + "/tmp/emp_data/emp_data.xlsx";
        let XLSX = require('xlsx');
        let workbook = XLSX.readFile(file_excel);
        let sheet_name_list = workbook.SheetNames;
        var objRequest = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
        console.log(objRequest);
        try {
            MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
                var emp_data = db.collection('emp_datas');
                emp_data.insertMany(objRequest, function (err, res1) {
                    if (err)
                        throw err;
                    res.json({'Status': "Success", 'Msg': "emp_data Data inserted"});
                });
            });
        } catch (err) {
            console.log(err);
            res.json({'msg': 'error'});
        }
    });
    app.get('/empdata/get_emp_details', function (req, res) {
        var emp_datas = require('../models/emp_data');
        emp_datas.find({}, function (err, emp_data) {
            try {
                if (err)
                    throw err;
                res.json(emp_data);
            } catch (e) {
                console.log("get_emp_details", e);
                res.json(e);
            }
        });
    });
    app.get('/empdata/print_emp_pdf', function (req, res) {

        let resultArray = [];
        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
            try {
                //var FilePathPdf = appRoot + "/tmp/emp_data/emp_data_pdf/";
                let cursor = db.collection('emp_datas').find({}, {_id: 0});
                cursor.forEach(function (doc, err) {
                    resultArray.push(doc);
                }, function () {
                    //db.close();
                    console.log(resultArray);
                    //res.send(resultArray);
                    let objCSSummary = [];
                    for (let k in resultArray) {
                        var user = resultArray[k];
                        console.log('Log', 'user', user);
                        let args = {
                            data: {
                                "UID": user.Employee_Code,
                                "Name": user.Name,
                                "Branch": user.Branch,
                                "Effective_Date": user.Effective_Date,
                                "Designation": user.Designation,
                                "Letter_Type": user.Letter_Type,
                                "Basic": user.Basic,
                                "HRA": user.House_Rent_Allowance,
                                "Leave_Travel_Allowance": user.Leave_Travel_Allowance,
                                "Gratuity": user.Advance_Gratuity,
                                "Fuel_Reimbursement": user.Fuel_Reimbursement,
                                "Mobile_Reimbursement": user.Mobile_Reimbursement,
                                "Prof_Development": user.Professional_Development,
                                "Meal_Allowance": user.Meal_Reimbursement,
                                "Performance_Reward": user.Performance_Reward,
                                "Business_Expense_Reimbursement": user.Business_Expense_Reimbursement,
                                "Gross_Salary": user.Gross_Salary,
                                "Employer_PF": user.Employer_PF,
                                "Employer_ESIC": user.Employer_ESIC,
                                "Performance_Variable": user.Performance_Variable,
                                "CTC": user.Cost_to_Company,
                                "Advance_Gratuity": user.Advance_Gratuity,
                                "Total_Earnings": user.Total_Earnings,
                                "PF_Admin_Charges": user.PF_Admin_Charges
                            },
                            headers: {
                                "Content-Type": "application/json"
                            }
                        };
                        objCSSummary.push(user);
                        let url_api = config.environment.weburl + '/empdata/print_pdf';
                        var Client = require('node-rest-client').Client;
                        var client = new Client();
                        client.post(url_api, args, function (data, response) {

                        });
                        sleep(2000);
                    }
                    res.json({'Status': "Success", 'Msg': "EMP Data Printed successfully."});
                });
            } catch (err) {
                console.log("print_emp_pdf", err);
                res.json({'msg': 'error'});
            }
        });
    });
    app.get('/empdata/emp_data_download', function (req, res) {
        var resultArray = [];
        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
            try {
                let cursor = db.collection('emp_datas').find({}, {_id: 0});
                cursor.forEach(function (doc, err) {
                    resultArray.push(doc);
                }, function () {
                    db.close();
                    //console.log(resultArray);
                    //res.send(resultArray);
                    let file_name = "emp_data_link.xlsx";
                    let ff_loc_path_portal = appRoot + "/tmp/emp_data/" + file_name;
                    let excel = require('excel4node');
                    let workbook = new excel.Workbook();
                    let worksheet = workbook.addWorksheet('Sheet 1');
                    let style = workbook.createStyle({
                        font: {
                            color: '#FF0800',
                            size: 12
                        },
                        numberFormat: '$#,##0.00; ($#,##0.00); -'
                    });
                    let styleh = workbook.createStyle({
                        font: {
                            bold: true,
                            size: 12
                        }
                    });
                    worksheet.cell(1, 1).string('Employee_Code').style(styleh);
                    worksheet.cell(1, 2).string('Name').style(styleh);
                    worksheet.cell(1, 3).string('Branch').style(styleh);
                    worksheet.cell(1, 4).string('Letter').style(styleh);
                    for (let k in resultArray) {
                        let user = resultArray[k];
                        k = parseInt(k);
                        worksheet.cell(k + 2, 1).string((user.Employee_Code).toString());
                        worksheet.cell(k + 2, 2).string(user.Name);
                        worksheet.cell(k + 2, 3).string(user.Branch ? user.Branch : "");
                        worksheet.cell(k + 2, 4).string(user.Letter ? user.Letter : "");
                    }
                    workbook.write(ff_loc_path_portal);
                    res.json({'Status': "Success", 'Msg': "Excel File Succesfully Craeted"});
                });
            } catch (err) {
                console.log("emp_data_download", err);
                res.json({'Status': "Failed", 'Msg': err});
            }
        });
        res.json({'Status': "Success"});
    });
    app.get('/empdata/emp_data_delete', function (req, res) {
        //var resultArray = [];
        MongoClient.connect(config.db.connection + ':27017/' + config.db.name, function (err, db) {
            try {
                var cursor = db.collection('emp_datas');
                cursor.remove(function (err, obj) {
                    if (err)
                        throw err;
                    console.log(obj.result.n + " record(s) deleted");
                    let rmDir = appRoot + "/tmp/emp_data/emp_data_pdf";
                    let rmFile = appRoot + "/tmp/emp_data/emp_data.xlsx";
                    let empty = require('empty-folder');
                    try {
                        fs.unlinkSync(rmFile);
                        //file removed
                    } catch (err) {
                        console.error("emp_data_delete", err);
                    }
                    empty(rmDir, false, (o) => {
                        if (o.error)
                        {
                            console.error(err);
                            res.json({'Status': "Failed", 'Msg': err});
                        } else
                        {
                            console.log(o.removed);
                            console.log(o.failed);
                            res.json({'Status': "Success", 'Msg': "EMP Data Deleted successfully."});
                        }


                    });
                });
            } catch (err) {
                console.log(err);
                res.json({'Status': "Failed", 'Msg': err});
            }
        });
    });
    app.post('/empdata/print_pdf', function (req, res) {
        try
        {
            console.log("print_pdf1");
            let objRequest = JSON.parse(JSON.stringify(req.body));
            let path = appRoot + "/tmp/emp_data/emp_data_pdf/";
            let file_name1 = 'appraisal_cum_promotion_letter';
            let file_name2 = 'compensation_revision';
            //var file_name3 = 'performance_assessment';
            let html_file_path1 = appRoot + "/resource/request_file/Promotion_Letter.html";
            let html_file_path2 = appRoot + "/resource/request_file/Structural_Change.html";
            //var html_file_path3 = appRoot + "/resource/request_file/performance-assessment.html";
            let emp_datas = require('../models/emp_data');
            let file_pdf = {
                "Promotion letter": [file_name1, html_file_path1],
                "Compensation restructuring": [file_name2, html_file_path2]
            };
            let htmlPol = fs.readFileSync(file_pdf[objRequest.Letter_Type][1], 'utf8');
            let file_name = "EMP_Structural_" + objRequest.UID;
            if (objRequest.Letter_Type === 'Promotion letter')
            {
                file_name = "EMP_Promotion_" + objRequest.UID;
            }
            let pdf_file_path = appRoot + "/tmp/emp_data/emp_data_pdf/" + file_name + '.pdf';
            let html_file_path = appRoot + "/tmp/emp_data/emp_data_pdf/" + file_name + '.html';
            var html_web_path_portal = config.environment.downloadurl + "/emp_data/emp_data_pdf/" + file_name + '.html';
            let replacedata = {};
            if (objRequest.Letter_Type === 'Promotion letter')
            {
                replacedata = {
                    "___uid___": objRequest.UID,
                    "___name___": objRequest.Name,
//                    "___branch___": objRequest.Branch,
                    "___designation___": objRequest.Designation
                };
            } else {
                replacedata = {
                    "___uid___": objRequest.UID,
                    "___name___": objRequest.Name,
//                    "___branch___": objRequest.Branch,
                    "___effective_date___": objRequest.Effective_Date,
                    "___designation___": objRequest.Designation,
                    "___letter_type___": objRequest.Letter_Type,
                    "___basic___": objRequest.Basic,
                    "___hra___": objRequest.HRA,
                    "___leave_travel_allowance___": objRequest.Leave_Travel_Allowance,
                    "___gratuity___": objRequest.Gratuity,
                    "___fuel_reimbursement___": objRequest.Fuel_Reimbursement,
                    "___mobile_reimbursement___": objRequest.Mobile_Reimbursement,
                    "___prof_development___": objRequest.Prof_Development,
                    "___meal_allowance___": objRequest.Meal_Allowance,
                    "___performance_reward___": objRequest.Performance_Reward,
                    "___business_expense_reimbursement___": objRequest.Business_Expense_Reimbursement,
                    "___lease_car_expense___": objRequest.Lease_Car_Expense,
                    "___stipend___": objRequest.Stipend,
                    "___gross_salary___": objRequest.Gross_Salary,
                    "___employer_pf___": objRequest.Employer_PF,
                    "___employer_esic___": objRequest.Employer_ESIC,
                    "___performance_variable___": objRequest.Performance_Variable,
                    "___ctc___": objRequest.CTC,
                    "___basic_12___": (objRequest.Basic * 12),
                    "___hra_12___": (objRequest.HRA * 12),
                    "___other_allow_12___": (objRequest.Other_Allow * 12),
                    "___leave_travel_allowance_12___": (objRequest.Leave_Travel_Allowance * 12),
                    "___gratuity_12___": (objRequest.Gratuity * 12),
                    "___advance_statutory_bonus_12___": objRequest.Advance_Statutory_Bonus * 12,
                    "___fuel_reimbursement_12___": objRequest.Fuel_Reimbursement * 12,
                    "___drivers_salary_reimbursement_12___": objRequest.Driver_Salary_Reimbursement * 12,
                    "___mobile_reimbursement_12___": objRequest.Mobile_Reimbursement * 12,
                    "___prof_development_12___": objRequest.Prof_Development * 12,
                    "___meal_allowance_12___": objRequest.Meal_Allowance * 12,
                    "___performance_reward_12___": objRequest.Performance_Reward * 12,
                    "___business_expense_reimbursement_12___": objRequest.Business_Expense_Reimbursement * 12,
                    "___lease_car_expense_12___": objRequest.Lease_Car_Expense * 12,
                    "___gross_salary_12___": objRequest.Gross_Salary * 12,
                    "___employer_pf_12___": objRequest.Employer_PF * 12,
                    "___employer_esic_12___": objRequest.Employer_ESIC * 12,
                    "___performance_variable_12___": objRequest.Performance_Variable * 12,
                    "___ctc_12___": objRequest.CTC * 12,
                    "___uid_disp_disp___": objRequest.UID === 0 ? "display:none;" : "",
                    "___name_disp___": objRequest.Name === 0 ? "display:none;" : "",
                    "___branch_disp___": objRequest.Branch === 0 ? "display:none;" : "",
                    "___basic_disp___": objRequest.Basic === 0 ? "display:none;" : "",
                    "___hra_disp___": objRequest.HRA === 0 ? "display:none;" : "",
                    "___other_allow_disp___": objRequest.Other_Allow === 0 ? "display:none;" : "",
                    "___leave_travel_allowance_disp___": objRequest.Leave_Travel_Allowance === 0 ? "display:none;" : "",
                    "___gratuity_disp___": objRequest.Gratuity === 0 ? "display:none;" : "",
                    "___advance_statutory_bonus_disp___": objRequest.Advance_Statutory_Bonus === 0 ? "display:none;" : "",
                    "___fuel_reimbursement_disp___": objRequest.Fuel_Reimbursement === 0 ? "display:none;" : "",
                    "___drivers_salary_reimbursement_disp___": objRequest.Driver_Salary_Reimbursement === 0 ? "display:none;" : "",
                    "___mobile_reimbursement_disp___": objRequest.Mobile_Reimbursement === 0 ? "display:none;" : "",
                    "___prof_development_disp___": objRequest.Prof_Development === 0 ? "display:none;" : "",
                    "___meal_allowance_disp___": objRequest.Meal_Allowance === 0 ? "display:none;" : "",
                    "___performance_reward_disp___": objRequest.Performance_Reward === 0 ? "display:none;" : "",
                    "___business_expense_reimbursement_disp___": objRequest.Business_Expense_Reimbursement === 0 ? "display:none;" : "",
                    "___lease_car_expense_disp___": objRequest.Lease_Car_Expense === 0 ? "display:none;" : "",
                    "___stipend_disp___": objRequest.Stipend === 0 ? "display:none;" : "",
                    "___gross_salary_disp___": objRequest.Gross_Salary === 0 ? "display:none;" : "",
                    "___employer_pf_disp___": objRequest.Employer_PF === 0 ? "display:none;" : "",
                    "___employer_esic_disp___": objRequest.Employer_ESIC === 0 ? "display:none;" : "",
                    "___performance_variable_disp___": objRequest.Performance_Variable === 0 ? "display:none;" : "",
                    "___ctc_disp___": objRequest.CTC === 0 ? "display:none;" : "",
                    "___advance_gratuity___": objRequest.Advance_Gratuity,
                    "___advance_gratuity_12___": objRequest.Advance_Gratuity * 12,
                    "___total_earnings___": objRequest.Total_Earnings,
                    "___total_earnings_12___": objRequest.Total_Earnings * 12,
                    "___pf_admin_charges___": objRequest.PF_Admin_Charges,
                    "___pf_admin_charges_12___": objRequest.PF_Admin_Charges * 12,
                    "___advance_gratuity_disp___": objRequest.Advance_Gratuity === 0 ? "display:none;" : "",
                    "___pf_admin_charges_disp___": objRequest.PF_Admin_Charges === 0 ? "display:none;" : ""
                };
            }
            htmlPol = htmlPol.toString().replaceJson(replacedata);
            fs.writeFileSync(html_file_path, htmlPol);
            sleep(4000);
            try {
                var http = require('http');
                var insurer_pdf_url = (config.environment.name !== 'Production' ? config.environment.pdf_url_qa : config.environment.pdf_url) + html_web_path_portal;
                var file_horizon = fs.createWriteStream(pdf_file_path);
                http.get(insurer_pdf_url, function (response) {
                    response.pipe(file_horizon);
                    console.log("PDF success!");
                });
            } catch (e) {
                console.error('PDF Exception', e);
            }

            let objUserData = {
                'Letter': config.environment.downloadurl + "/emp_data/emp_data_pdf/" + file_name + '.pdf'
            };
            emp_datas.update({'Employee_Code': objRequest.UID}, {$set: objUserData}, function (err, numAffected) {
                if (err)
                    throw err;
                res.json({'Status': "Success", 'Msg': "EMP Data Updated successfully."});
            });
        } catch (err)
        {
            console.log("print_pdf", err);
        }
    });
    app.post('/dhfl/policy_pdf', function (req, res) {
        try
        {
            //Example POST method invocation 
            var Client = require('node-rest-client').Client;
            var client = new Client();
            var args = null;
            var service_method_url = '';
            var username = '';
            var password = '';
            var token = '';
            var Insurer_Request = JSON.stringify(req.body);
            if (config.environment.name === 'Production') {
                service_method_url = 'https://api.cocogeneralinsurance.com/dhflgic/api/broker/od/policy';
                username = 'coco_partner';
                password = '&z29kGdZaz^$G4e*eB0!';
                token = 'LANDMARK_3P8IEg1aDLdYSYTmpRtx';
            } else {
                service_method_url = 'https://devapi.dhflgi.com/dhflgip/api/broker/od/policy';
                username = 'partnerchannel';
                password = 'test@654321';
                token = 'LANDMARK_TEST';
            }
            args = {
                data: Insurer_Request,
                headers: {
                    'Content-Type': 'application/json',
                    'username': username,
                    'password': password,
                    'token': token
                }
            };
            client.post(service_method_url, args, function (data, response) {
                // parsed response body as js object 
                console.log(data);
                //res.json(data);
                // raw response 
                var sleep = require('system-sleep');
                sleep(5000);
                var objResponseJson = data;
                console.log(response);
                if (objResponseJson.hasOwnProperty('code') && objResponseJson['code'] === 1) {
                    if (objResponseJson.hasOwnProperty('data') && objResponseJson['data'].hasOwnProperty('policy_number') && objResponseJson['data']['policy_number'] !== '') {
                        var insurer_pdf_url = objResponseJson['data']['pdf_url'];
                        var policy_pdf_name = (objResponseJson['data']['policy_number']).replaceAll('/', '');
                        var pdf_file_name = 'DhflMotor_TW_' + policy_pdf_name + '.pdf';
                        var pdf_sys_loc_horizon = appRoot + "/tmp/pdf/" + pdf_file_name;
                        var pdf_web_path_horizon = config.environment.weburl + "/pdf/" + pdf_file_name;
                        var pdf_web_path_portal = config.environment.downloadurl + config.pb_config.pdf_web_loc + pdf_file_name;
                        sleep(5000);
                        client.get(insurer_pdf_url, function (data, response) {
                            console.log('data --> ' + data);
                            console.log('response --> ' + response);
                            fs.writeFile(pdf_sys_loc_horizon, data, 'binary', function (err) {
                                if (err)
                                    console.log(err);
                                else
                                    res.json({'Status': "Success", 'URL': pdf_sys_loc_horizon});
                                console.log("The file was saved!");
                            });
                        });
                        sleep(10000);
                    }
                } else {
                    res.json({'Status': "Fail", 'Msg': objResponseJson});
                }
            });
        } catch (err)
        {
            res.json({'Status': "Fail", 'Msg': err});
        }
    });
    app.get('/dhfl/payment/orderLookup', function (req, res) {
        var order_no = req.query['order_no'];
        var access_code = 'OPMED4OM2U05LCQQIX';
        if (req.query['dbg'] === 'no') {
            access_code = 'KQVCIBSTBW2PYN6E6Y';
        }
        try {
            var service_method_url = 'https://payment.cocogeneralinsurance.com/payment/orderLookup/';
            const request = require('request');
            request.post({
                url: service_method_url,
                form: {
                    order_no: order_no,
                    access_code: access_code
                }
            }, function (err, httpResponse, body) {
                if (err)
                    res.send(err);
                res.json(body);
            });
        } catch (err) {

            console.log(err);
            res.json('Error');
        }
    });
    app.get('/icici/payment/orderLookup', function (req, res) {
        var order_no = req.query['order_no'];
        var Client = require('node-rest-client').Client;
        var client = new Client();
        process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
        var service_method_url = '';
        var username = 'landmark';
        var password = 'landmark';
        if (config.environment.name === 'Production') {
            username = 'Landmark';
            password = 'Landmark';
            service_method_url = 'https://paygate.icicilombard.com/pgi/api/transaction/TransactionEnquiry?TransactionIdForPG=' + order_no;
        } else {
            service_method_url = "https://ilesb.southindia.cloudapp.azure.com/pgi/api/transaction/TransactionEnquiry?TransactionIdForPG=" + order_no;
        }
        var args1 = {
            headers: {
                "Authorization": "Basic " + new Buffer(username + ':' + password).toString('base64')
            }
        };
        try {
            client.get(service_method_url, args1, function (data, response) {
                //console.log('ICICI tranaction Data', data.toString());
                res.json(data);
            });
        } catch (err) {

            console.log(err);
            res.json('Error');
        }
    });
    app.post('/send_sms', function (req, res) {
        try {
            if (req.body && req.body.hasOwnProperty('to_num') && req.body.to_num !== "" && req.body.hasOwnProperty('sent_msg') && req.body.sent_msg !== "") {
                let mob = /^[6-9]{1}[0-9]{9}$/;
                let customer_num = req.body.to_num;
                if (mob.test(customer_num) === false) {
                    res.json({'status': 'FAIL'});
                } else {
                    let SmsLog = require('../models/sms_log');
                    let objSmsLog = new SmsLog();
                    let customer_msg = req.body.sent_msg;
                    objSmsLog.send_sms(customer_num, customer_msg, 'POLBOS'); //Somanshu
                    res.json({'status': 'SUCCESS'});
                }

            } else {
                res.json({'status': 'FAIL'});
            }
        } catch (ex) {
            res.json({'status': 'Exception - ' + ex.stack});
        }
    });
};